import { z } from "zod";
import { PermissionAction } from "@mhg/db";
import type { SessionContext } from "@mhg/auth";
import { requireOrgPermission } from "../guards";
import { writeAuditLog } from "./audit";

export const assignOrgMembershipInput = z.object({
  userId: z.string().uuid(),
  roleId: z.string().uuid(),
  branchId: z.string().uuid().optional(),
  teamId: z.string().uuid().optional(),
});
export type AssignOrgMembershipInput = z.infer<typeof assignOrgMembershipInput>;

export interface OrgMembershipDto {
  id: string;
  userId: string;
  organizationId: string;
  roleId: string;
  branchId: string | null;
  teamId: string | null;
}

/**
 * Role/org/branch/team assignment — mutable only by company_admin/
 * platform_admin. docs/architecture/security-architecture.md #1.
 */
export async function assignOrgMembership(
  session: SessionContext,
  input: AssignOrgMembershipInput,
): Promise<OrgMembershipDto> {
  const data = assignOrgMembershipInput.parse(input);

  return requireOrgPermission(session, "users", PermissionAction.MANAGE, async (tx) => {
    const before = await tx.orgMembership.findUnique({
      where: { userId_organizationId: { userId: data.userId, organizationId: session.activeOrganizationId } },
    });

    const membership = await tx.orgMembership.upsert({
      where: { userId_organizationId: { userId: data.userId, organizationId: session.activeOrganizationId } },
      update: { roleId: data.roleId, branchId: data.branchId, teamId: data.teamId },
      create: {
        userId: data.userId,
        organizationId: session.activeOrganizationId,
        roleId: data.roleId,
        branchId: data.branchId,
        teamId: data.teamId,
      },
    });

    await writeAuditLog(tx, {
      organizationId: session.activeOrganizationId,
      actorId: session.userId,
      action: before ? "org_membership.update" : "org_membership.create",
      entityType: "OrgMembership",
      entityId: membership.id,
      before: before ? { roleId: before.roleId, branchId: before.branchId, teamId: before.teamId } : undefined,
      after: { roleId: membership.roleId, branchId: membership.branchId, teamId: membership.teamId },
    });

    return {
      id: membership.id,
      userId: membership.userId,
      organizationId: membership.organizationId,
      roleId: membership.roleId,
      branchId: membership.branchId,
      teamId: membership.teamId,
    };
  });
}
