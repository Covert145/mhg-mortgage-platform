/**
 * The single most important test in Phase 1
 * (docs/architecture/phase-1-implementation-spec.md #14): proves
 * Organization A's data is invisible to Organization B, and vice versa,
 * enforced by PostgreSQL Row-Level Security — not merely by application
 * code remembering to filter correctly. Runs against a real Postgres
 * database (see .github/workflows/ci.yml for the CI service, or a local
 * Postgres per README.md) using the restricted `mhg_app` role, the same
 * role the application connects as. If this test used the superuser/
 * table-owner connection instead, RLS would be silently bypassed and this
 * test would pass even with no isolation at all — see
 * docs/architecture/security-architecture.md #3.
 */
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { prisma } from "@mhg/db";
import { withOrgScope } from "../scope";

let orgAId: string;
let orgBId: string;

beforeAll(async () => {
  const orgA = await prisma.organization.create({ data: { name: "RLS Test Org A" } });
  const orgB = await prisma.organization.create({ data: { name: "RLS Test Org B" } });
  orgAId = orgA.id;
  orgBId = orgB.id;

  await withOrgScope(orgAId, (tx) =>
    tx.contact.create({
      data: { organizationId: orgAId, firstName: "Alice", lastName: "OrgA", contactType: "LEAD" },
    }),
  );
  await withOrgScope(orgBId, (tx) =>
    tx.contact.create({
      data: { organizationId: orgBId, firstName: "Bob", lastName: "OrgB", contactType: "LEAD" },
    }),
  );
});

afterAll(async () => {
  await prisma.contact.deleteMany({ where: { organizationId: { in: [orgAId, orgBId] } } });
  await prisma.organization.deleteMany({ where: { id: { in: [orgAId, orgBId] } } });
  await prisma.$disconnect();
});

describe("Row-Level Security cross-tenant isolation", () => {
  it("a request scoped to Org A cannot see Org B's contacts", async () => {
    const contacts = await withOrgScope(orgAId, (tx) => tx.contact.findMany({ where: { organizationId: orgBId } }));
    expect(contacts).toHaveLength(0);
  });

  it("a request scoped to Org A sees only Org A's contacts, even without an explicit filter", async () => {
    const contacts = await withOrgScope(orgAId, (tx) => tx.contact.findMany());
    expect(contacts.every((c) => c.organizationId === orgAId)).toBe(true);
    expect(contacts.some((c) => c.firstName === "Alice")).toBe(true);
    expect(contacts.some((c) => c.firstName === "Bob")).toBe(false);
  });

  it("a request scoped to Org B cannot see Org A's contacts", async () => {
    const contacts = await withOrgScope(orgBId, (tx) => tx.contact.findMany({ where: { organizationId: orgAId } }));
    expect(contacts).toHaveLength(0);
  });

  it("fails closed: a query with no org context set sees zero rows, not everything", async () => {
    const contacts = await prisma.contact.findMany({
      where: { organizationId: { in: [orgAId, orgBId] } },
    });
    expect(contacts).toHaveLength(0);
  });

  it("a crafted write attempting to insert into another organization's scope is rejected by RLS, not just validated in app code", async () => {
    await expect(
      withOrgScope(orgAId, (tx) =>
        tx.contact.create({
          data: { organizationId: orgBId, firstName: "Malicious", lastName: "CrossTenant", contactType: "LEAD" },
        }),
      ),
    ).rejects.toThrow();
  });
});
