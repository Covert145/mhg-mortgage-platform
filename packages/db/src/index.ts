import { PrismaClient } from "@prisma/client";

/**
 * Raw Prisma client. Do not import this directly outside packages/db and
 * packages/core/src/scope.ts — use withOrgScope()/getScopedPrisma() from
 * @mhg/core instead, so every query is organization-scoped and RLS-backed.
 * Enforced by the mhg/no-unscoped-prisma ESLint rule (packages/config).
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export * from "@prisma/client";
export type { PrismaClient } from "@prisma/client";
