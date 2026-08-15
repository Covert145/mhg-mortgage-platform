import type { CommsProvider, SendEmailParams, SendResult, SendSmsParams } from "./types";

/**
 * Phase 1 default: logs instead of sending. No Twilio/Resend/Postmark
 * account exists yet (docs/architecture/phase-1-implementation-spec.md #16)
 * — using this provider is how that's enforced in code, not just policy.
 */
export class NoopCommsProvider implements CommsProvider {
  async sendSms(params: SendSmsParams): Promise<SendResult> {
    // eslint-disable-next-line no-console
    console.log(`[comms:noop] SMS to ${params.to}: ${params.body}`);
    return { status: "queued" };
  }

  async sendEmail(params: SendEmailParams): Promise<SendResult> {
    // eslint-disable-next-line no-console
    console.log(`[comms:noop] Email to ${params.to} — ${params.subject}: ${params.body}`);
    return { status: "queued" };
  }
}
