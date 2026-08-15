import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
// Raw prisma import allowed here (see auth.config.ts note): User and
// VerificationToken are global identity tables, not organization-scoped.
import { prisma } from "@mhg/db";

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1 hour

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Issues a password-reset token, reusing the Auth.js VerificationToken table
 * (identifier/token/expires) rather than adding a bespoke model. Returns
 * null if the email doesn't match a user — callers must still respond
 * identically either way so the endpoint doesn't leak account existence.
 */
export async function createPasswordResetToken(email: string): Promise<string | null> {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return null;

  const token = randomBytes(32).toString("hex");
  const identifier = `password-reset:${email.toLowerCase()}`;

  // Clear any prior outstanding reset tokens for this identifier first.
  await prisma.verificationToken.deleteMany({ where: { identifier } });
  await prisma.verificationToken.create({
    data: {
      identifier,
      token: hashToken(token),
      expires: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  });

  return token;
}

/** Validates and consumes (single-use) a password-reset token. */
export async function consumePasswordResetToken(email: string, token: string): Promise<boolean> {
  const identifier = `password-reset:${email.toLowerCase()}`;
  const hashed = hashToken(token);

  const record = await prisma.verificationToken.findUnique({
    where: { identifier_token: { identifier, token: hashed } },
  });
  if (!record || record.expires < new Date()) return false;

  await prisma.verificationToken.delete({ where: { identifier_token: { identifier, token: hashed } } });
  return true;
}

export async function setUserPassword(email: string, newPassword: string): Promise<void> {
  const hashedPassword = await hashPassword(newPassword);
  await prisma.user.update({ where: { email }, data: { hashedPassword } });
}

/** Shared bcrypt hashing entry point so no other package takes a direct bcryptjs dependency. */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}
