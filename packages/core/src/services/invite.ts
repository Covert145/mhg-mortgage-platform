import { randomBytes } from "node:crypto";
import { z } from "zod";
import { ActorType, InviteStatus, PermissionAction, RoleName } from "@mhg/db";
import { hashPassword, type SessionContext } from "@mhg/auth";
import { requireOrgPermission } from "../guards";
import { withPlatformScope } from "../scope";
import { writeAuditLog } from "./audit";

const INVITE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export const inviteUserInput = z.object({
  email: z.string().email(),
  roleName: z.nativeEnum(RoleName),
  branchId: z.string().uuid().optional(),
  teamId: z.string().uuid().optional(),
});
export type InviteUserInput = z.infer<typeof inviteUserInput>;

export interface InviteDto {
  id: string;
  email: string;
  token: string;
  expiresAt: Date;
}

/**
 * Invite-only registration (docs/architecture/security-architecture.md #1).
 * Only company_admin/manager-equivalent "users" MANAGE permission holders
 * can send invites. Returns the raw token so the caller (a server action)
 * can hand it to packages/comms — Phase 1 uses a dev-mode console
 * transport, see docs/architecture/phase-1-implementation-spec.md #16.
 */
export async function inviteUser(session: SessionContext, input: InviteUserInput): Promise<InviteDto> {
  const data = inviteUserInput.parse(input);

  return requireOrgPermission(session, "users", PermissionAction.MANAGE, async (tx) => {
    const role = await tx.role.findUniqueOrThrow({ where: { name: data.roleName } });
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + INVITE_TTL_MS);

    const invite = await tx.invite.create({
      data: {
        organizationId: session.activeOrganizationId,
        branchId: data.branchId,
        teamId: data.teamId,
        email: data.email,
        roleId: role.id,
        token,
        expiresAt,
        sentByUserId: session.userId,
      },
    });

    await writeAuditLog(tx, {
      organizationId: session.activeOrganizationId,
      actorId: session.userId,
      action: "invite.create",
      entityType: "Invite",
      entityId: invite.id,
      after: { email: invite.email, roleName: data.roleName },
    });

    return { id: invite.id, email: invite.email, token: invite.token, expiresAt: invite.expiresAt };
  });
}

export const acceptInviteInput = z.object({
  token: z.string().min(1),
  name: z.string().min(1).max(200),
  password: z.string().min(12, "Password must be at least 12 characters"),
});
export type AcceptInviteInput = z.infer<typeof acceptInviteInput>;

export interface AcceptInviteResult {
  userId: string;
  email: string;
  organizationId: string;
}

/**
 * Public flow — the new user has no session yet. The invite token itself is
 * the authorization artifact (see the invite_token_lookup migration note).
 * Runs outside org scope (withPlatformScope) since there is no session to
 * derive an active organization from until this completes.
 */
export async function acceptInvite(input: AcceptInviteInput): Promise<AcceptInviteResult> {
  const data = acceptInviteInput.parse(input);

  return withPlatformScope(async (tx) => {
    const invite = await tx.invite.findUnique({ where: { token: data.token } });
    if (!invite || invite.status !== InviteStatus.PENDING || invite.expiresAt < new Date()) {
      throw new Error("Invite is invalid, expired, or already used");
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await tx.user.upsert({
      where: { email: invite.email },
      update: {},
      create: {
        email: invite.email,
        name: data.name,
        hashedPassword,
        emailVerified: new Date(),
      },
    });

    await tx.orgMembership.upsert({
      where: { userId_organizationId: { userId: user.id, organizationId: invite.organizationId } },
      update: {},
      create: {
        userId: user.id,
        organizationId: invite.organizationId,
        branchId: invite.branchId,
        teamId: invite.teamId,
        roleId: invite.roleId,
      },
    });

    await tx.invite.update({
      where: { id: invite.id },
      data: { status: InviteStatus.ACCEPTED, acceptedAt: new Date() },
    });

    await writeAuditLog(tx, {
      organizationId: invite.organizationId,
      actorId: user.id,
      actorType: ActorType.USER,
      action: "invite.accept",
      entityType: "Invite",
      entityId: invite.id,
    });

    return { userId: user.id, email: user.email, organizationId: invite.organizationId };
  });
}
