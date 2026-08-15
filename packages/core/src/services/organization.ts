import { z } from "zod";
import { ActorType } from "@mhg/db";
import type { SessionContext } from "@mhg/auth";
import { requirePlatformAdmin } from "../guards";
import { writeAuditLog } from "./audit";

export const createOrganizationInput = z.object({
  name: z.string().min(1).max(200),
  nmlsId: z.string().max(50).optional(),
});
export type CreateOrganizationInput = z.infer<typeof createOrganizationInput>;

export interface OrganizationDto {
  id: string;
  name: string;
  nmlsId: string | null;
}

/** platform_admin only — docs/architecture/phase-1-implementation-spec.md #14. */
export async function createOrganization(
  session: SessionContext,
  input: CreateOrganizationInput,
): Promise<OrganizationDto> {
  const data = createOrganizationInput.parse(input);

  return requirePlatformAdmin(session, async (tx) => {
    const org = await tx.organization.create({ data });

    await writeAuditLog(tx, {
      organizationId: org.id,
      actorId: session.userId,
      actorType: ActorType.USER,
      action: "organization.create",
      entityType: "Organization",
      entityId: org.id,
      after: { name: org.name, nmlsId: org.nmlsId },
    });

    return { id: org.id, name: org.name, nmlsId: org.nmlsId };
  });
}
