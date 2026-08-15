// This is the ONE allowed direct import of the raw Prisma client outside
// packages/db and packages/auth (see packages/config's no-unscoped-prisma
// ESLint rule). Every organization-scoped query in the application must go
// through withOrgScope() so the app.current_org_id session variable is set
// before any query runs — that variable is what the Row-Level Security
// policies in packages/db/prisma/migrations/*_row_level_security key off
// of. See docs/architecture/security-architecture.md #3.
import { prisma, type Prisma } from "@mhg/db";

export type ScopedClient = Prisma.TransactionClient;

/**
 * Opens a transaction with the Postgres session variable app.current_org_id
 * set to `organizationId`, then runs `fn` with the scoped transaction
 * client. RLS policies enforce isolation from here on regardless of what
 * the query itself filters on — this is the backstop, not the only layer
 * (see requireOrgPermission in packages/core/src/guards.ts for the
 * authorization layer that runs before this).
 */
export async function withOrgScope<T>(
  organizationId: string,
  fn: (tx: ScopedClient) => Promise<T>,
): Promise<T> {
  if (!organizationId) {
    throw new Error("withOrgScope requires a non-empty organizationId");
  }

  return prisma.$transaction(async (tx) => {
    // set_config(..., true) scopes the setting to the current transaction
    // (LOCAL), so it never leaks across pooled connections or requests.
    // Parameterized (not string-interpolated) to rule out injection.
    await tx.$executeRaw`SELECT set_config('app.current_org_id', ${organizationId}, true)`;
    return fn(tx);
  });
}

/**
 * For the small set of genuinely platform-wide operations that have no
 * single organization to scope to (creating a brand new Organization;
 * platform_admin cross-org reads). No app.current_org_id is set, so this
 * only safely touches tables that are NOT RLS-protected (organizations,
 * roles, permissions, org_memberships — see the "not RLS-protected" note in
 * docs/architecture/database-schema.md). Callers must still authorize the
 * caller as platform_admin themselves (see requirePlatformAdmin in
 * packages/core/src/guards.ts) before calling this.
 */
export async function withPlatformScope<T>(fn: (tx: ScopedClient) => Promise<T>): Promise<T> {
  return prisma.$transaction(fn);
}
