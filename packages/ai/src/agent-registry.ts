import type { AiAgentConfig } from "./types";

/**
 * The five agents from docs/architecture/ai-architecture.md #1, defined but
 * inactive in Phase 1 (isActive: false — nothing invokes these yet). Model
 * IDs are pinned, not "latest", per
 * docs/architecture/phase-1-implementation-spec.md #1 (avoids silent
 * behavior drift on a provider-side model update).
 */
export const AGENT_REGISTRY: Record<string, AiAgentConfig> = {
  LEAD_RESPONSE: {
    name: "LEAD_RESPONSE",
    systemPrompt:
      "You respond to new mortgage leads for Mobile Home Guy: qualify, answer general questions, collect information, and schedule appointments. Escalate to a human loan officer for anything beyond general qualification.",
    allowedTools: ["queryContact", "createTask", "sendSms", "sendEmail", "scheduleAppointment", "escalateToHuman", "logActivity"],
    modelId: "claude-sonnet-5",
    isActive: false,
  },
  FOLLOW_UP: {
    name: "FOLLOW_UP",
    systemPrompt:
      "You send follow-up reminders for applications, documents, and appointments, and reactivate cold leads. Escalate when a contact asks a question you cannot answer generally.",
    allowedTools: ["queryContact", "queryLoanFile", "createTask", "sendSms", "sendEmail", "escalateToHuman", "logActivity"],
    modelId: "claude-sonnet-5",
    isActive: false,
  },
  BORROWER_ASSISTANT: {
    name: "BORROWER_ASSISTANT",
    systemPrompt:
      "You help borrowers understand their application process, loan milestones, general mortgage questions, and document requests. You never state or imply an underwriting decision, eligibility determination, or final pricing.",
    allowedTools: ["queryLoanFile", "createTask", "escalateToHuman", "logActivity"],
    modelId: "claude-sonnet-5",
    isActive: false,
  },
  REALTOR_AGENT: {
    name: "REALTOR_AGENT",
    systemPrompt:
      "You recruit and follow up with referral partners, schedule meetings, and answer general program questions.",
    allowedTools: ["queryContact", "createTask", "sendSms", "sendEmail", "scheduleAppointment", "escalateToHuman", "logActivity"],
    modelId: "claude-sonnet-5",
    isActive: false,
  },
  DATABASE_REACTIVATION: {
    name: "DATABASE_REACTIVATION",
    systemPrompt:
      "You scan the existing contact database for mortgage opportunities (purchase, refinance, cash-out, equity, rate reduction, annual review) using property-intelligence signals, and surface them as Opportunity records for a loan officer to review.",
    allowedTools: ["queryContact", "createTask", "logActivity"],
    modelId: "claude-sonnet-5",
    isActive: false,
  },
};
