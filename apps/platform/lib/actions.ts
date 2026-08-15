"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import {
  AuthenticationError,
  authRateLimitKey,
  consumePasswordResetToken,
  createPasswordResetToken,
  getRateLimiter,
  requireSession,
  setUserPassword,
  signIn,
  signOut,
} from "@mhg/auth";
import {
  acceptInvite,
  acceptInviteInput,
  assignOrgMembership,
  createContact,
  createOrganization,
  createOrganizationInput,
  getAuditLogForOrg,
  inviteUser,
  inviteUserInput,
} from "@mhg/core";
import { ContactType } from "@mhg/db";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

async function clientIp(): Promise<string> {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
}

const loginInput = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function loginAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = loginInput.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) return { ok: false, error: "Enter a valid email and password." };

  const ip = await clientIp();
  const allowed = await getRateLimiter().check(authRateLimitKey("login", ip, parsed.data.email));
  if (!allowed) return { ok: false, error: "Too many attempts. Try again in 15 minutes." };

  try {
    await signIn("credentials", { ...parsed.data, redirect: false });
  } catch {
    return { ok: false, error: "Invalid email or password." };
  }

  redirect("/post-login");
}

export async function logoutAction(): Promise<void> {
  await signOut({ redirect: false });
  redirect("/login");
}

export async function acceptInviteAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = acceptInviteInput.safeParse({
    token: formData.get("token"),
    name: formData.get("name"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  try {
    const result = await acceptInvite(parsed.data);
    await signIn("credentials", { email: result.email, password: parsed.data.password, redirect: false });
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Could not accept invite." };
  }

  redirect("/post-login");
}

const requestResetInput = z.object({ email: z.string().email() });

export async function requestPasswordResetAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = requestResetInput.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { ok: false, error: "Enter a valid email." };

  const ip = await clientIp();
  const allowed = await getRateLimiter().check(authRateLimitKey("reset-password", ip, parsed.data.email));
  if (!allowed) return { ok: false, error: "Too many attempts. Try again in 15 minutes." };

  const token = await createPasswordResetToken(parsed.data.email);
  if (token) {
    // Dev-mode transport — see docs/architecture/phase-1-implementation-spec.md #16.
    console.log(`[dev-email] Password reset for ${parsed.data.email}: /reset-password/confirm?email=${encodeURIComponent(parsed.data.email)}&token=${token}`);
  }

  // Always report success — do not leak whether the email exists.
  return { ok: true };
}

const resetPasswordInput = z.object({
  email: z.string().email(),
  token: z.string().min(1),
  password: z.string().min(12, "Password must be at least 12 characters"),
});

export async function resetPasswordAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = resetPasswordInput.safeParse({
    email: formData.get("email"),
    token: formData.get("token"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const valid = await consumePasswordResetToken(parsed.data.email, parsed.data.token);
  if (!valid) return { ok: false, error: "This reset link is invalid or expired." };

  await setUserPassword(parsed.data.email, parsed.data.password);
  return { ok: true };
}

export async function createOrganizationAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = createOrganizationInput.safeParse({
    name: formData.get("name"),
    nmlsId: formData.get("nmlsId") || undefined,
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    const session = await requireSession();
    await createOrganization(session, parsed.data);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: describeError(err) };
  }
}

export async function inviteUserAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = inviteUserInput.safeParse({
    email: formData.get("email"),
    roleName: formData.get("roleName"),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid input." };

  try {
    const session = await requireSession();
    const invite = await inviteUser(session, parsed.data);
    // Dev-mode transport — see docs/architecture/phase-1-implementation-spec.md #16.
    console.log(`[dev-email] Invite for ${invite.email}: /register?token=${invite.token}`);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: describeError(err) };
  }
}

export async function getAuditLogAction() {
  const session = await requireSession();
  return getAuditLogForOrg(session, 20);
}

export async function createContactAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const session = await requireSession();
    await createContact(session, {
      firstName: String(formData.get("firstName") ?? ""),
      lastName: String(formData.get("lastName") ?? ""),
      email: (formData.get("email") as string) || undefined,
      phone: (formData.get("phone") as string) || undefined,
      contactType: ContactType.LEAD,
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: describeError(err) };
  }
}

export async function assignOrgMembershipAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  try {
    const session = await requireSession();
    await assignOrgMembership(session, {
      userId: String(formData.get("userId") ?? ""),
      roleId: String(formData.get("roleId") ?? ""),
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: describeError(err) };
  }
}

function describeError(err: unknown): string {
  if (err instanceof AuthenticationError) return "You must be signed in.";
  if (err instanceof Error) return err.message;
  return "Something went wrong.";
}
