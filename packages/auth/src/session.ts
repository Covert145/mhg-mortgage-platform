// Raw prisma import allowed here — see the note in auth.config.ts. Resolving
// which organization(s) a user belongs to is an identity-layer lookup that
// must work before any org context (app.current_org_id) exists, so
// org_memberships is intentionally not RLS-protected (see
// packages/db/prisma/migrations/20260815195859_org_membership_identity_lookup).
import { prisma } from "@mhg/db";
import { AuthenticationError } from "./permission-matrix";
import { auth } from "./next-auth";

export interface SessionContext {
  userId: string;
  email: string;
  /** The organization this request is acting within. */
  activeOrganizationId: string;
  membershipId: string;
}

/**
 * requireSession() — the first guard every server action calls. Resolves
 * the caller's active organization membership and throws
 * AuthenticationError if there is no valid session or no membership.
 *
 * Phase 1 always resolves the user's first (oldest) membership — every
 * seeded Phase 1 user belongs to exactly one organization. Full org-switcher
 * support (persisting a chosen org for multi-org users, e.g. a realtor
 * partnered with two companies) is a later-phase enhancement; the
 * Session.activeOrganizationId column exists for that purpose but is unused
 * in Phase 1.
 */
export async function requireSession(): Promise<SessionContext> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new AuthenticationError();
  }

  const membership = await prisma.orgMembership.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  });

  if (!membership) {
    throw new AuthenticationError("User does not belong to any organization");
  }

  return {
    userId: session.user.id,
    email: session.user.email ?? "",
    activeOrganizationId: membership.organizationId,
    membershipId: membership.id,
  };
}
