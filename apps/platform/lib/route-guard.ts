import { redirect } from "next/navigation";
import { RoleName } from "@mhg/db";
import { AuthenticationError, type SessionContext, requireSession } from "@mhg/auth";
import { getCallerRole } from "@mhg/core";

export const ROLE_HOME_ROUTE: Record<RoleName, string> = {
  [RoleName.PLATFORM_ADMIN]: "/admin",
  [RoleName.COMPANY_ADMIN]: "/admin",
  [RoleName.MANAGER]: "/management",
  [RoleName.LOAN_OFFICER]: "/crm",
  [RoleName.PROCESSOR]: "/processing",
  [RoleName.BORROWER]: "/portal",
  [RoleName.REALTOR_PARTNER]: "/partner",
};

/**
 * Server-side route-group guard used by every authenticated layout
 * (docs/architecture/phase-1-implementation-spec.md #9/#14). Redirects
 * unauthenticated requests to /login and wrong-role requests to /forbidden
 * — enforced here (a server component, evaluated on every request), not
 * only via client-side navigation, per
 * docs/architecture/security-architecture.md ("server-side authorization is
 * the source of truth everywhere").
 */
export async function requireRouteRole(
  allowed: RoleName[],
): Promise<{ session: SessionContext; role: RoleName }> {
  let session: SessionContext;
  try {
    session = await requireSession();
  } catch (err) {
    if (err instanceof AuthenticationError) {
      redirect("/login");
    }
    throw err;
  }

  const role = await getCallerRole(session);
  if (!allowed.includes(role)) {
    redirect("/forbidden");
  }

  return { session, role };
}
