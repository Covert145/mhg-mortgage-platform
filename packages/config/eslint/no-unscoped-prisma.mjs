/**
 * Custom rule backing the Phase 1 security architecture requirement:
 * "a custom ESLint rule flags any unscoped Prisma call outside that helper"
 * (docs/architecture/security-architecture.md #3, item 2).
 *
 * The raw Prisma client (`prisma` exported from @mhg/db) may only be imported
 * by the org-scoping helper itself and by @mhg/db internals (migrations/seed).
 * Every other consumer (service layer, server actions, API routes) must go
 * through `withOrgScope` / `getScopedPrisma` from @mhg/core, which sets the
 * RLS session variable before any query runs.
 */

/**
 * Files allowed to import the raw prisma client directly.
 *
 * packages/auth is a deliberate exception: the Auth.js Prisma adapter and
 * the login/session lookups it depends on (User/Account/Session) operate on
 * global identity tables that are intentionally NOT organization-scoped —
 * a user must be looked up by email before any org context exists. See
 * docs/architecture/database-schema.md ("not RLS-protected" tables).
 */
const ALLOWED_PATTERNS = [
  /packages\/db\//,
  /packages\/core\/src\/scope\.ts$/,
  /packages\/auth\/src\//,
  /\.test\.ts$/,
  /\.spec\.ts$/,
  /seed\.ts$/,
];

function isAllowed(filename) {
  return ALLOWED_PATTERNS.some((pattern) => pattern.test(filename));
}

/** @type {import('eslint').Rule.RuleModule} */
const noUnscopedPrisma = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow importing the raw Prisma client outside the org-scoping helper. Use withOrgScope()/getScopedPrisma() from @mhg/core instead.",
    },
    schema: [],
    messages: {
      unscoped:
        "Do not import the raw Prisma client directly. Use withOrgScope()/getScopedPrisma() from @mhg/core so every query is organization-scoped.",
    },
  },
  create(context) {
    const filename = context.filename ?? context.getFilename();
    if (isAllowed(filename)) {
      return {};
    }
    return {
      ImportDeclaration(node) {
        if (node.source.value !== "@mhg/db") return;
        for (const specifier of node.specifiers) {
          const importedName =
            specifier.type === "ImportSpecifier"
              ? specifier.imported.name
              : undefined;
          if (importedName === "prisma") {
            context.report({ node: specifier, messageId: "unscoped" });
          }
        }
      },
    };
  },
};

export const mhgPlugin = {
  rules: {
    "no-unscoped-prisma": noUnscopedPrisma,
  },
};
