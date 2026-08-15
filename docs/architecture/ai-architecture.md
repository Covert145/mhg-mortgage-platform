# AI Architecture

AI is a platform-level service (`packages/ai`), not a bolted-on chat widget. This document defines the agent registry, tool/guardrail model, conversation/action logging, human-approval requirements, and the explicit boundary between what AI may do and what only a human may do.

## 1. Agent registry

Five purpose-built agents, each a config object rather than a monolithic assistant:

1. **Lead Response** — responds to new leads, qualifies them, asks questions, collects information, answers general questions, schedules appointments, escalates to a human.
2. **Follow-Up** — lead follow-up, application reminders, document reminders, appointment reminders, lead reactivation.
3. **Borrower Assistant** — helps borrowers understand the application process, loan milestones, general mortgage questions, and document requests.
4. **Realtor Agent** — recruits partners, follows up, schedules meetings, answers general program questions.
5. **Database Reactivation** — scans the existing contact database and detects opportunities (purchase, refinance, cash-out, equity, rate reduction, annual mortgage review).

## 2. Core entities

| Entity | Key fields | Purpose |
|---|---|---|
| `AiAgent` | id, name, systemPrompt, allowedTools[], guardrailPolicyId, modelId (pinned version) | Registry entry; model version is pinned, not "latest," so behavior doesn't silently shift on a provider update |
| `AiTool` | discrete, permissioned capability | Only functions an agent can actually call: `queryContact`, `queryLoanFile` (read-only, field-filtered per agent type), `createTask`, `sendSms`/`sendEmail` (draft-then-send), `scheduleAppointment`, `escalateToHuman`, `logActivity` |
| `AiConversation` | organizationId, contactId, agentId, status (`ACTIVE`/`ESCALATED`/`CLOSED`), startedAt | One thread per contact–agent engagement |
| `AiMessage` | conversationId, role, content, toolCalls, createdAt | Full, immutable transcript |
| `AiAction` | conversationId, actionType, payload, status (`PROPOSED`/`EXECUTED`/`REQUIRES_APPROVAL`/`REJECTED`), executedAt | Every side-effecting thing an agent does, tracked separately from the message transcript so "what did the AI *do*" is queryable independent of "what did it *say*" |

No `AiTool` exists that writes underwriting, eligibility, pricing, or decision fields — those columns simply have no corresponding write path reachable by any agent, enforced at the service-layer function signature. This is a structural guarantee, not a prompt instruction.

## 3. Human approval and escalation

- Any AI-drafted `Campaign` starts in `PENDING_APPROVAL` status and requires `approvedByUserId` to be set before it can become `ACTIVE`. Individual `AiAction`s of type `send_campaign_message` are blocked at execution time if the parent campaign isn't `ACTIVE` — this is checked at send time, not just at draft time.
- `AiTool.escalateToHuman` sets `AiConversation.status = ESCALATED` and creates a `Task` assigned to the contact's owning loan officer. An agent that hits a limit does not simply go silent.
- Natural-language campaign creation (e.g., "create a 90-day follow-up campaign for cold mobile-home purchase leads") is implemented as a tool-calling flow that emits a structured `Campaign` + `CampaignStep[]` object for human review — the system never executes free-text instructions directly.

## 4. Audit logging

Every `AiAction` and every field it touched is also written to the same `AuditLog` table used for human actions (see `docs/architecture/security-architecture.md`), tagged `actorType = AI_AGENT`. AI activity does not require a separate audit surface from human activity.

## 5. What AI can do

- Qualify and engage leads.
- Answer general program/process questions.
- Draft campaign content.
- Schedule appointments.
- Send draft communications that fit within an already-active, human-approved campaign.
- Detect and surface opportunities (refinance, HELOC, equity, rate reduction, annual review).
- Summarize a loan file for a human reviewer.
- Recommend next steps or create tasks.

## 6. What AI must not do

AI must never independently:

- Make or record a final underwriting decision.
- Determine or state loan eligibility.
- Issue or word an adverse-action notice.
- Make or communicate a pricing or rate-lock decision.
- Generate or send a required regulatory disclosure.
- Represent itself, in any borrower-facing message, as having made a final lending decision.

Each of these is backed by the data model, not just instruction: the relevant tables (`UnderwritingDecision.*`, `LoanTerms.finalRate`, disclosure records) have no corresponding `AiTool` write function, so an agent cannot touch them regardless of what a given model output "decides" to do. A guardrail content filter additionally rejects any agent output asserting approval, denial, or final pricing.

## 7. Provider architecture

`packages/ai` wraps the Anthropic Claude API behind a provider-agnostic interface, so the model provider is never a hard dependency baked into agent logic. Agents run as event-triggered background jobs (Inngest functions — see `docs/architecture/system-architecture.md`), not synchronous request/response calls, so every AI action is durable, retryable, and auditable. No agent is live or invoked in Phase 1; see `docs/architecture/phase-1-implementation-spec.md` §16 for the deferred scope.
