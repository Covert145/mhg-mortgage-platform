import { RoleName } from "@mhg/db";

export interface ContactRecord {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  contactType: string;
  leadSource: string | null;
  leadScore: number | null;
  ownerId: string | null;
  createdAt: Date;
}

/** Full internal shape — loan officers, processors, managers, admins. */
export interface ContactInternalDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  contactType: string;
  leadSource: string | null;
  leadScore: number | null;
  ownerId: string | null;
}

/** Restricted shape — borrower/realtor portals never see lead-scoring internals or the assigned owner's identity. */
export interface ContactExternalDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
}

const INTERNAL_ROLES = new Set<RoleName>([
  RoleName.PLATFORM_ADMIN,
  RoleName.COMPANY_ADMIN,
  RoleName.MANAGER,
  RoleName.LOAN_OFFICER,
  RoleName.PROCESSOR,
]);

/**
 * Role-filtered response shaping — no server action returns a raw Prisma
 * row to the client. See docs/architecture/security-architecture.md #4
 * ("Borrower PII exposure" threat).
 */
export function toContactDto(
  contact: ContactRecord,
  roleName: RoleName,
): ContactInternalDto | ContactExternalDto {
  if (INTERNAL_ROLES.has(roleName)) {
    return {
      id: contact.id,
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      contactType: contact.contactType,
      leadSource: contact.leadSource,
      leadScore: contact.leadScore,
      ownerId: contact.ownerId,
    };
  }

  return {
    id: contact.id,
    firstName: contact.firstName,
    lastName: contact.lastName,
    email: contact.email,
    phone: contact.phone,
  };
}
