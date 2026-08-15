/**
 * AI agent registry types — see docs/architecture/ai-architecture.md. Five
 * agents are defined by name/config only in Phase 1; none run (no live
 * Claude API calls — docs/architecture/phase-1-implementation-spec.md #16).
 *
 * Deliberately absent from this interface: any tool that writes
 * underwriting, eligibility, pricing, or disclosure fields. See
 * docs/architecture/ai-architecture.md #2/#6 — that boundary is enforced by
 * this type surface simply not exposing such a capability, not by prompt
 * instruction.
 */

export type AiAgentName =
  | "LEAD_RESPONSE"
  | "FOLLOW_UP"
  | "BORROWER_ASSISTANT"
  | "REALTOR_AGENT"
  | "DATABASE_REACTIVATION";

export type AiToolName =
  | "queryContact"
  | "queryLoanFile"
  | "createTask"
  | "sendSms"
  | "sendEmail"
  | "scheduleAppointment"
  | "escalateToHuman"
  | "logActivity";

export interface AiAgentConfig {
  name: AiAgentName;
  systemPrompt: string;
  allowedTools: AiToolName[];
  modelId: string;
  isActive: boolean;
}

export interface AiCompletionRequest {
  agentName: AiAgentName;
  conversationId: string;
  messages: { role: "agent" | "contact" | "system"; content: string }[];
}

export interface AiCompletionResult {
  content: string;
  toolCalls: { tool: AiToolName; input: Record<string, unknown> }[];
}

export interface AiProvider {
  complete(request: AiCompletionRequest): Promise<AiCompletionResult>;
}
