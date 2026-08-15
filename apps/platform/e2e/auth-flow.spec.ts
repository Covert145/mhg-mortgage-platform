import { test, expect } from "@playwright/test";
import { prisma } from "@mhg/db";

/**
 * End-to-end proof of the Phase 1 acceptance criteria in
 * docs/architecture/phase-1-implementation-spec.md #15: an invited user can
 * register and log in, is routed to the route group matching their role,
 * and a wrong-role request to a disallowed route group is redirected
 * server-side (verified by direct URL navigation, not just UI hiding).
 */

const DEV_PASSWORD = "DevPassword123!";

test.describe("Role-based routing", () => {
  test("loan officer logs in and lands on /crm", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("loan-officer@dev.mhg.internal");
    await page.getByLabel("Password").fill(DEV_PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/crm");
    await expect(page.locator("header").getByText("Loan Officer")).toBeVisible();
  });

  test("a loan officer is redirected away from /admin via direct URL navigation", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("loan-officer@dev.mhg.internal");
    await page.getByLabel("Password").fill(DEV_PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/crm");

    await page.goto("/admin");
    await page.waitForURL("**/forbidden");
    await expect(page.getByText("Access denied")).toBeVisible();
  });

  test("platform admin logs in and lands on /admin", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("platform-admin@dev.mhg.internal");
    await page.getByLabel("Password").fill(DEV_PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/admin");
    await expect(page.locator("header").getByText("Platform Admin")).toBeVisible();
  });

  test("borrower logs in and lands on /portal, and cannot reach /crm", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("borrower@dev.mhg.internal");
    await page.getByLabel("Password").fill(DEV_PASSWORD);
    await page.getByRole("button", { name: "Sign in" }).click();
    await page.waitForURL("**/portal");

    await page.goto("/crm");
    await page.waitForURL("**/forbidden");
  });

  test("an unauthenticated request to a protected route is redirected to /login", async ({ page }) => {
    await page.goto("/management");
    await page.waitForURL("**/login");
  });
});

test.describe("Invite-only registration", () => {
  test("a fresh invite token can be accepted and the new user logs in and lands on /crm", async ({ page }) => {
    const email = `e2e-invited-${Date.now()}@dev.mhg.internal`;

    // Set up the invite directly (equivalent to what inviteUserAction does,
    // without driving the admin UI form here) so this test is independent
    // of the admin page's own layout.
    const org = await prisma.organization.findFirstOrThrow({ where: { name: "Mobile Home Guy (Dev)" } });
    const role = await prisma.role.findUniqueOrThrow({ where: { name: "LOAN_OFFICER" } });
    const token = `e2e-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    await prisma.invite.create({
      data: {
        organizationId: org.id,
        email,
        roleId: role.id,
        token,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        sentByUserId: (await prisma.user.findUniqueOrThrow({ where: { email: "platform-admin@dev.mhg.internal" } })).id,
      },
    });

    await page.goto(`/register?token=${token}`);
    await page.getByLabel("Full name").fill("E2E Invited User");
    await page.getByLabel("Password").fill("SuperSecurePassword123!");
    await page.getByRole("button", { name: "Create account" }).click();

    await page.waitForURL("**/crm");
    await expect(page.locator("header").getByText("Loan Officer")).toBeVisible();

    // Cleanup so repeated runs stay idempotent.
    await prisma.orgMembership.deleteMany({ where: { user: { email } } });
    await prisma.user.deleteMany({ where: { email } });
  });

  test("a missing invite token shows a clear message instead of a broken form", async ({ page }) => {
    await page.goto("/register");
    await expect(page.getByText(/missing an invite token/)).toBeVisible();
  });
});
