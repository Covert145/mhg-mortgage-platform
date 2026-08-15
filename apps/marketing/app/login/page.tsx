import { redirect } from "next/navigation";

/**
 * Single login entry point (docs/architecture/phase-1-implementation-spec.md
 * "LOGIN"): the public site links to /login, which hands off to the
 * authenticated app (apps/platform) where the actual credential/magic-link
 * flow and role-based post-login routing live.
 */
export default function MarketingLoginRedirect() {
  const platformUrl = process.env.NEXT_PUBLIC_PLATFORM_URL ?? "http://localhost:3001";
  redirect(`${platformUrl}/login`);
}
