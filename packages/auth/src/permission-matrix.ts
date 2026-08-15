import { PermissionAction } from "@mhg/db";

/**
 * A single granted (resource, action) pair for a role — the shape returned
 * by RolePermission rows (see packages/db/prisma/seed.ts, which seeds this
 * same data, and docs/architecture/security-architecture.md #2 for the
 * source-of-truth capability matrix this mirrors).
 */
export interface PermissionGrant {
  resource: string;
  action: PermissionAction;
}

/**
 * MANAGE is a superset: a role granted MANAGE on a resource implicitly has
 * VIEW/CREATE/EDIT/DELETE on that same resource too.
 */
const ACTIONS_IMPLIED_BY_MANAGE: PermissionAction[] = [
  PermissionAction.VIEW,
  PermissionAction.CREATE,
  PermissionAction.EDIT,
  PermissionAction.DELETE,
];

/**
 * Pure capability check: does this set of granted permissions allow
 * `action` on `resource`? No I/O — deliberately side-effect-free so it can
 * be unit tested without a database. Scope (own/team/org) is a separate
 * concern, checked by the caller after this returns true — see
 * packages/core/src/guards.ts.
 */
export function hasPermission(
  grants: PermissionGrant[],
  resource: string,
  action: PermissionAction,
): boolean {
  return grants.some((grant) => {
    if (grant.resource !== resource) return false;
    if (grant.action === action) return true;
    if (grant.action === PermissionAction.MANAGE && ACTIONS_IMPLIED_BY_MANAGE.includes(action)) {
      return true;
    }
    return false;
  });
}

export class AuthorizationError extends Error {
  constructor(resource: string, action: PermissionAction) {
    super(`Not authorized to ${action} ${resource}`);
    this.name = "AuthorizationError";
  }
}

export class AuthenticationError extends Error {
  constructor(message = "Authentication required") {
    super(message);
    this.name = "AuthenticationError";
  }
}
