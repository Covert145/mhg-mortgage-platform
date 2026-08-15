import { NoopCommsProvider } from "./noop-provider";
import type { CommsProvider } from "./types";

export type { CommsProvider, CommsChannel, SendSmsParams, SendEmailParams, SendResult } from "./types";
export { NoopCommsProvider } from "./noop-provider";

/**
 * Phase 1 always returns the Noop provider — there are no TWILIO_ / RESEND_ /
 * POSTMARK_ environment variables to branch on yet (see .env.example).
 * Phase 5 adds real provider classes and switches on their presence here,
 * without changing any caller.
 */
export function getCommsProvider(): CommsProvider {
  return new NoopCommsProvider();
}
