import { z } from "zod";
import { ActorType, ContactType, PermissionAction } from "@mhg/db";
import type { SessionContext } from "@mhg/auth";
import { requireOrgPermission } from "../guards";
import { withOrgScope, type ScopedClient } from "../scope";
import { toContactDto, type ContactExternalDto, type ContactInternalDto } from "../dto/contact";
import { writeAuditLog } from "./audit";

export const createContactInput = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().optional(),
  phone: z.string().min(7).max(20).optional(),
  contactType: z.nativeEnum(ContactType).default(ContactType.LEAD),
  leadSource: z.string().max(100).optional(),
  ownerId: z.string().uuid().optional(),
});
export type CreateContactInput = z.infer<typeof createContactInput>;

/**
 * Shared dedupe-and-upsert core, used by both the internal CRM entry point
 * and the public-website entry point below — one code path creates a
 * Contact regardless of caller, per
 * docs/architecture/phase-1-implementation-spec.md #8.
 */
async function upsertContactRecord(tx: ScopedClient, organizationId: string, data: CreateContactInput) {
  const existing = data.email
    ? await tx.contact.findFirst({ where: { organizationId, email: data.email } })
    : data.phone
      ? await tx.contact.findFirst({ where: { organizationId, phone: data.phone } })
      : null;

  if (existing) {
    return tx.contact.update({
      where: { id: existing.id },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email ?? existing.email,
        phone: data.phone ?? existing.phone,
      },
    });
  }

  return tx.contact.create({
    data: {
      organizationId,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      contactType: data.contactType,
      leadSource: data.leadSource,
      ownerId: data.ownerId,
    },
  });
}

/** Internal CRM contact creation — requires "contacts" CREATE permission. */
export async function createContact(
  session: SessionContext,
  input: CreateContactInput,
): Promise<ContactInternalDto | ContactExternalDto> {
  const data = createContactInput.parse(input);

  return requireOrgPermission(session, "contacts", PermissionAction.CREATE, async (tx, caller) => {
    const contact = await upsertContactRecord(tx, session.activeOrganizationId, data);

    await writeAuditLog(tx, {
      organizationId: session.activeOrganizationId,
      actorId: session.userId,
      action: "contact.create",
      entityType: "Contact",
      entityId: contact.id,
      after: { firstName: contact.firstName, lastName: contact.lastName, contactType: contact.contactType },
    });

    return toContactDto(contact, caller.roleName);
  });
}

/**
 * Public-website entry point (Get Approved / Apply Online / Second Look /
 * Contact form / Listings inquiry) — unauthenticated by design, scoped to
 * whichever organization owns the public site (its id is configured, not
 * inferred from a session). See
 * docs/architecture/phase-1-implementation-spec.md #8 for the full flow
 * table. Every public-site server action in apps/marketing calls this.
 */
export async function createPublicLead(organizationId: string, input: CreateContactInput) {
  const data = createContactInput.parse({ ...input, contactType: input.contactType ?? ContactType.LEAD });

  return withOrgScope(organizationId, async (tx) => {
    const contact = await upsertContactRecord(tx, organizationId, data);

    await writeAuditLog(tx, {
      organizationId,
      actorType: ActorType.SYSTEM,
      action: "contact.create.public",
      entityType: "Contact",
      entityId: contact.id,
      after: { firstName: contact.firstName, lastName: contact.lastName, leadSource: contact.leadSource },
    });

    return { id: contact.id };
  });
}

/** Role-filtered single-contact read — docs/architecture/database-schema.md #2. */
export async function getContact(
  session: SessionContext,
  contactId: string,
): Promise<ContactInternalDto | ContactExternalDto | null> {
  return requireOrgPermission(session, "contacts", PermissionAction.VIEW, async (tx, caller) => {
    const contact = await tx.contact.findUnique({
      where: { id: contactId, organizationId: session.activeOrganizationId },
    });
    if (!contact) return null;
    return toContactDto(contact, caller.roleName);
  });
}
