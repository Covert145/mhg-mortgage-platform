import type { RoleName } from "@mhg/db";
import { AuthenticationError, type SessionContext } from "@mhg/auth";
import { withPlatformScope } from "../scope";

/**
 * Resolves the caller's role name for their active organization — used by
 * the post-login redirect (docs/architecture/phase-1-implementation-spec.md
 * "LOGIN" flow: Borrower -> Borrower Portal, Realtor -> Partner Portal,
 * Loan Officer -> CRM, Processor -> Processing Dashboard, Manager ->
 * Management Dashboard, Admin -> Administration) and by each route group's
 * server-side role guard.
 */
export async function getCallerRole(session: SessionContext): Promise<RoleName> {
  return withPlatformScope(async (tx) => {
    const membership = await tx.orgMembership.findUnique({
      where: {
        userId_organizationId: {
          userId: session.userId,
          organizationId: session.activeOrganizationId,
        },
      },
      include: { role: true },
    });
    if (!membership) {
      throw new AuthenticationError("No membership found for the active organization");
    }
    return membership.role.name;
  });
}
