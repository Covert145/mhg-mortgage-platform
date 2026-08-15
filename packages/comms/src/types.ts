/**
 * Provider-agnostic communications interface — see
 * docs/architecture/system-architecture.md #1 and
 * docs/architecture/security-architecture.md #5. Twilio (SMS/voice) and
 * Resend/Postmark (email) are Phase 5 concerns; Phase 1 ships this
 * interface plus a NoopProvider only, so later phases swap the
 * implementation without touching call sites.
 */

export type CommsChannel = "SMS" | "EMAIL";

export interface SendSmsParams {
  to: string;
  body: string;
}

export interface SendEmailParams {
  to: string;
  subject: string;
  body: string;
}

export interface SendResult {
  /** "queued" from a NoopProvider always — nothing is actually delivered until a real provider is wired up. */
  status: "queued" | "sent" | "failed";
  providerMessageId?: string;
}

export interface CommsProvider {
  sendSms(params: SendSmsParams): Promise<SendResult>;
  sendEmail(params: SendEmailParams): Promise<SendResult>;
}
