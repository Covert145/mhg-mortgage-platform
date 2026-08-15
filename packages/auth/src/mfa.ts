import { createHmac, randomBytes } from "node:crypto";

/**
 * Minimal RFC 6238 TOTP implementation (no external dependency) backing the
 * MFA schema fields (User.mfaSecret / User.mfaEnabled). Enforcement is
 * feature-flagged off by default for Phase 1 — see
 * docs/architecture/security-architecture.md #1 and
 * docs/architecture/phase-1-implementation-spec.md #16.
 */

const STEP_SECONDS = 30;
const DIGITS = 6;

/** Whether MFA is enforced for staff logins. Off by default in Phase 1. */
export function isMfaEnforced(): boolean {
  return process.env.AUTH_MFA_ENFORCED === "true";
}

export function generateMfaSecret(): string {
  return randomBytes(20).toString("hex");
}

function hotp(secret: string, counter: number): string {
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(BigInt(counter));
  const hmac = createHmac("sha1", Buffer.from(secret, "hex")).update(counterBuffer).digest();
  const offset = (hmac[hmac.length - 1] ?? 0) & 0x0f;
  const binCode =
    (((hmac[offset] ?? 0) & 0x7f) << 24) |
    (((hmac[offset + 1] ?? 0) & 0xff) << 16) |
    (((hmac[offset + 2] ?? 0) & 0xff) << 8) |
    ((hmac[offset + 3] ?? 0) & 0xff);
  return String(binCode % 10 ** DIGITS).padStart(DIGITS, "0");
}

/** Verifies a 6-digit TOTP code, allowing a +/-1 step clock-skew window. */
export function verifyTotp(secret: string, code: string, at: number = Date.now()): boolean {
  const counter = Math.floor(at / 1000 / STEP_SECONDS);
  for (const drift of [0, -1, 1]) {
    if (hotp(secret, counter + drift) === code) return true;
  }
  return false;
}
