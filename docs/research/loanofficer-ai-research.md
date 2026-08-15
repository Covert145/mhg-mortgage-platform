# Research: loanofficer.ai (Product/Functionality Reference)

**Purpose of this document:** capture publicly available product-requirements information about loanofficer.ai so the new platform's CRM/AI/automation functionality can be designed to match and exceed it, using an entirely original implementation. Nothing here is copied source code, database structure, or copyrighted text — it is a functional summary used to derive requirements.

## Research method and a limitation to flag

Direct page fetches (`WebFetch`) to `loanofficer.ai` were blocked by this environment's network egress proxy, so this research was performed via web-search indexing (page titles, URLs, and search-snippet descriptions) of `loanofficer.ai/features`, `/crm-ai-assistants`, `/mortgage-crm`, `/solutions`, and `/websites`, rather than a full walkthrough of the live product/screens. **A follow-up direct-browse pass is recommended before Phase 3 (CRM) and Phase 6 (AI) detailed UX work**, to confirm exact screen layouts and workflow steps.

## Positioning

Marketed as "AI-powered mortgage CRM that thinks, acts & closes deals" and "your all-in-one mortgage command center" — a CRM-and-engagement layer purpose-built for individual loan officers and small teams, not a full loan-origination system.

## Confirmed feature pillars

- **AI lead response** — every inbound inquiry is answered, qualified, and worked in under 60 seconds, 24/7; the AI books consultations directly onto the loan officer's calendar without manual back-and-forth.
- **Automation** — always-on email/SMS/campaign automation; AI drafts and launches campaigns keyed to specific triggers (a rate drop, a new listing alert, a borrower reaching a milestone).
- **Database reactivation / opportunity detection ("Property Pulse")** — live property and equity monitoring that surfaces real-time mortgage opportunity alerts: refinance, HELOC, equity increase, PMI drop, rate drop, and life-event triggers, generated automatically from the existing contact database rather than requiring manual review.
- **Realtor/partner tools** — automated co-branded marketing, shared client status updates, and referral reporting aimed at keeping referring agents "producing" (i.e., continuing to send business).
- **Application intake → external LOS hand-off** — a short, smart intake flow that captures pre-qualification information to warm up a lead, then routes the prospect to a separate, secure loan-application portal (the loan officer's actual LOS — e.g., LendingPad, Arive) to complete the full Form 1003. AI is claimed to reduce 1003 completion time by roughly 70% via assistance/prefill, but the system does not appear to own the full mortgage-application data model itself.
- **Branded loan-officer microsites** wired directly into the CRM, so the marketing site and the CRM/pipeline function as one funnel rather than separate systems.
- **LOS sync** — the platform is described as syncing with the loan officer's LOS rather than replacing it.

## Key architectural takeaway for our platform

loanofficer.ai's core design choice — being an engagement/CRM layer that hands off to a third-party LOS for the actual mortgage application — is explicitly **not** the direction for this platform. Per the product brief, our `LoanFile` is designed as the system of record for the entire lifecycle (application through post-close), so the application/URLA data model, processing, underwriting, and closing are modeled natively (see `docs/architecture/database-schema.md`, URLA/MISMO section) rather than deferred to an external system. LOS integration remains on the roadmap (Phase 11) as an **optional export/interop target**, not a dependency the core product needs to function.

Everything else — AI lead response, automation/campaigns, database reactivation and opportunity detection, and realtor/partner relationship tooling — is treated as validated product-requirements input and is designed into the platform (see `docs/architecture/ai-architecture.md` and the CRM data model in `docs/architecture/database-schema.md`), built as an original implementation rather than a copy of loanofficer.ai's specific screens, prompts, or code.

## Derived requirements for the new platform

- An **AI Lead Response Agent** with a sub-minute engagement target, capable of qualifying, answering general questions, and booking appointments, with a defined escalation path to a human (see `docs/architecture/ai-architecture.md`).
- A **trigger-based automation/campaign engine** (rate drop, listing alert, milestone reached) rather than only manually-scheduled campaigns.
- A **provider-agnostic property-intelligence and opportunity-detection engine** ("Property Pulse"-equivalent), built against mock data until a real data provider is connected, per the platform's standing rule against claiming live data prematurely.
- **Realtor/partner portal tooling** for co-branded updates and referral reporting, scoped so partners see only what they're authorized to see (borrower financial detail is explicitly excluded — see `docs/architecture/security-architecture.md`).
- **Branded per-loan-officer public pages**, consistent with the individual bio pages observed on mobilehomeguy.com (see the companion research doc), wired into the same CRM/lead-capture flow.
- A native **URLA/1003-aligned application and LoanFile model**, explicitly as a differentiator from loanofficer.ai's LOS-hand-off approach.
