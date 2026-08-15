import { redirect } from "next/navigation";
import { AuthenticationError, requireSession } from "@mhg/auth";
import { getCallerRole } from "@mhg/core";
import { ROLE_HOME_ROUTE } from "@/lib/route-guard";

/**
 * Neutral post-authentication landing: resolves the caller's role and
 * redirects into the correct portal/dashboard. See "LOGIN" in
 * docs/architecture/phase-1-implementation-spec.md — Borrower -> Borrower
 * Portal, Realtor -> Partner Portal, Loan Officer -> CRM, Processor ->
 * Processing Dashboard, Manager -> Management Dashboard, Admin ->
 * Administration.
 */
export default async function PostLoginPage() {
  let session;
  try {
    session = await requireSession();
  } catch (err) {
    if (err instanceof AuthenticationError) redirect("/login");
    throw err;
  }

  const role = await getCallerRole(session);
  redirect(ROLE_HOME_ROUTE[role]);
}
