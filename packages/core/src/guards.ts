import { PermissionAction, RoleName } from "@mhg/db";
import { AuthorizationError, hasPermission, type PermissionGrant, type SessionContext } from "@mhg/auth";
import { withOrgScope, withPlatformScope, type ScopedClient } from "./scope";

/**
 * requireOrgPermission — the single guard every org-scoped service function
 * runs through: opens a scoped transaction (withOrgScope), loads the
 * caller's role/permissions for their active organization, checks the
 * capability matrix (hasPermission), and only then runs `fn` with the
 * scoped client. See docs/architecture/security-architecture.md #2/#3.
 *
 * Scope beyond "is this the right organization" (own/team/org ownership
 * checks per the matrix in docs/architecture/security-architecture.md #2)
 * is the caller's responsibility inside `fn`, since it's specific to the
 * entity being accessed (e.g. "is this loan officer the owner of *this*
 * loan file").
 */
export interface CallerMembership {
  membershipId: string;
  roleName: RoleName;
  branchId: string | null;
  teamId: string | null;
}

export async function requireOrgPermission<T>(
  session: SessionContext,
  resource: string,
  action: PermissionAction,
  fn: (tx: ScopedClient, caller: CallerMembership) => Promise<T>,
): Promise<T> {
  return withOrgScope(session.activeOrganizationId, async (tx) => {
    const membership = await tx.orgMembership.findUnique({
      where: {
        userId_organizationId: {
          userId: session.userId,
          organizationId: session.activeOrganizationId,
        },
      },
      include: {
        role: {
          include: {
            permissions: { include: { permission: true } },
          },
        },
      },
    });

    if (!membership) {
      throw new AuthorizationError(resource, action);
    }

    const grants: PermissionGrant[] = membership.role.permissions.map((rp) => ({
      resource: rp.permission.resource,
      action: rp.permission.action,
    }));

    if (!hasPermission(grants, resource, action)) {
      throw new AuthorizationError(resource, action);
    }

    return fn(tx, {
      membershipId: membership.id,
      roleName: membership.role.name,
      branchId: membership.branchId,
      teamId: membership.teamId,
    });
  });
}

/**
 * requirePlatformAdmin — guard for the handful of genuinely cross-org
 * operations (creating a new Organization). Checks the caller has a
 * PLATFORM_ADMIN membership in *any* organization, since platform_admin is
 * not scoped to a single org the way other roles are.
 */
export async function requirePlatformAdmin<T>(
  session: SessionContext,
  fn: (tx: ScopedClient) => Promise<T>,
): Promise<T> {
  return withPlatformScope(async (tx) => {
    const membership = await tx.orgMembership.findFirst({
      where: { userId: session.userId, role: { name: RoleName.PLATFORM_ADMIN } },
    });
    if (!membership) {
      throw new AuthorizationError("organization", PermissionAction.MANAGE);
    }
    return fn(tx);
  });
}

export { PermissionAction };
