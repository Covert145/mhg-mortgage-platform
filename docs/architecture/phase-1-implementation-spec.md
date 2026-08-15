# Phase 1 Implementation Specification

This is the exact, approved build specification for Phase 1 (Foundation). It converts the architecture defined in `docs/architecture/system-architecture.md`, `docs/architecture/database-schema.md`, `docs/architecture/security-architecture.md`, and `docs/architecture/ai-architecture.md` into an enumerable scope, so implementation can begin with no major architectural ambiguity left unresolved. This document itself is written before any application code, database, or infrastructure exists in this repository.

## 1. Technology stack — justification summary

Full per-technology detail (alternatives considered, risk, cost, scalability, security implications, Phase 1 necessity) is maintained here as the canonical record; `docs/architecture/system-architecture.md` carries the condensed version for day-to-day reference.

| Technology | Why selected | Major risk | Phase 1? |
|---|---|---|---|
| Turborepo + pnpm | One repo, multiple deployables, no shared-package version drift | Build-graph misconfiguration as packages grow | Required |
| Next.js 15 (App Router) + TypeScript | Single framework for marketing + authenticated app; RSC/SSR for SEO on lead-gen pages | Vercel-specific feature coupling if overused; RSC data-fetching learning curve | Required |
| PostgreSQL (Neon) | Relational integrity for an audit-sensitive domain; native RLS for tenant isolation; cheap branch-per-PR previews | Vertical scaling ceiling eventually (not a Phase 1 concern) | Required |
| Prisma | Mature migrations + generated types for a 20+-table LoanFile schema | RLS session variables need care under connection pooling | Required |
| Auth.js (NextAuth v5) | Full control of org/role claims and instant session revocation, vs. syncing our model into Clerk/WorkOS | v5 still stabilizing; MFA/TOTP is DIY | Required |
| Cloudflare R2 | S3-compatible, no egress fees (documents are read far more than written) | Confirm compliance posture before storing regulated documents in production | Interface required; zero real documents in Phase 1 |
| Inngest | Durable, retryable, event-driven jobs for AI/campaign step flows without operating Redis/workers ourselves | Vendor dependency for a core workflow engine | Interface required; no real jobs run in Phase 1 |
| Twilio | Deepest 10DLC/TCPA-adjacent tooling for SMS/voice | 10DLC registration lead time — should start well before Phase 5 | Not required |
| Resend / Postmark | Deliverability-focused email with less operational overhead than SES at this scale | Domain warm-up needed before high-volume sending | Not required |
| Anthropic Claude API | Tool-calling steerability fits enforceable guardrails; kept behind a provider-agnostic interface | Cost scales with conversation volume; pin model versions to avoid behavior drift | Not required |
| Vercel | Most mature first-party Next.js/RSC hosting | Deployment-specific lock-in (apps remain portable standard Next.js) | Required |
| Upstash Redis | Serverless rate limiting/caching, no server to operate | Low risk | Required (auth-endpoint rate limiting from day one) |
| Sentry | Cheap, proven error tracking with source-map support | Must configure PII scrubbing before real user data exists | Required |

No technology was swapped from the original proposal during this review; Twilio, Resend/Postmark, and live Claude-agent invocation are explicitly demoted to "interface-only" for Phase 1 (see §16).

## 2. Long-term product architecture

See `docs/architecture/system-architecture.md` §3 for the full lifecycle diagram (Website → Contact → CRM → Opportunity → Mortgage Application → LoanFile → Processing/Underwriting/Closing/Post-Close). The design consequence for Phase 1: the database schema is built around `LoanFile` as a durable aggregate from the start, even though most of its child tables are unused until Phases 3–4.

## 3–6. Data model

The URLA/MISMO conceptual model, mobile-home loan data model, CRM data model, and pipeline architecture are fully specified in `docs/architecture/database-schema.md` (§2–§5) and are incorporated here by reference as the schema Phase 1 implements.

## 7. Authentication & RBAC

Fully specified in `docs/architecture/security-architecture.md` §1–§2, including the complete initial role → permission matrix, incorporated here by reference as what Phase 1 implements (flows: invite-only registration, credentials + magic-link login, password reset, MFA schema present but not enforced by default).

## 8. Public website → CRM event flow

| Public interaction | Flow |
|---|---|
| **Get Approved** (quick pre-qual) | Upsert `Contact` (dedupe by phone/email within org) → create `Opportunity` (type inferred: purchase/refi), `source=WEBSITE` → create `Task` → `Activity` logged → (Phase 6) triggers AI Lead Response agent event |
| **Apply Online** | Upsert `Contact` → create `LoanFile` (status `IN_PROGRESS`, stage `Application Started`) → create initial `Applicant` → `Activity` logged |
| **Second Look** | Upsert `Contact` → create `Opportunity` (type `RATE_REDUCTION`, source `WEBSITE`) → uploaded competitor Loan Estimate stored as a `Document` (`COMPETITOR_LOAN_ESTIMATE`) linked to `Contact`; on conversion, `Opportunity` promotes to `LoanFile` and the `Document` re-links |
| **Listings/Parks browsing** | Anonymous browsing generates no CRM record; an explicit "Ask about this home/park" action upserts `Contact` + `Opportunity` (source `WEBSITE`, listing id in metadata) |
| **Contact form** | Upsert `Contact` (contactType defaults `LEAD` unless already known) → `Task` for the org's default inbox owner → `Activity` logged |
| **Mortgage Calculator** | No CRM record by default; an explicit "email me these results" or "talk to a loan officer" action triggers the same upsert-`Contact` + `Opportunity` flow as Get Approved |

All flows are implemented as typed Next.js Server Actions in `apps/marketing`, calling the same `packages/core` service functions the authenticated CRM app uses — one code path creates a `Contact`, not two.

## 9. Portal architecture — data available / prohibited detail

| Portal | Data available | Data prohibited | Primary actions |
|---|---|---|---|
| Borrower Portal (`/portal`) | Own application status, borrower-friendly pipeline stage, milestones, requested/own documents, own communications thread, own appointments, subject property summary, closing info once available | Other applicants' full SSN/DOB, underwriting notes/conditions detail beyond a borrower-facing summary, internal Activity/audit log, pricing/rate-lock internals, other orgs' data | Upload document, complete task, message loan team, view/download closing docs, view appointments |
| Realtor/Partner Portal (`/partner`) | Borrower name (not SSN/DOB/income), property address, assigned loan officer, partner-friendly stage label, stage-updated date, next milestone, estimated closing date, last update timestamp | SSN, DOB, income, assets, liabilities, credit detail, underwriting notes, documents (unless explicitly shared) | Submit referral, request contact/update, schedule appointment, view own referral-relationship activity/reporting |
| Loan Officer CRM (`/crm`) | Full CRM for own contacts/loan files (+ team scope if also a manager) | Other LOs' contacts/loan files unless team/manager-scoped; org admin settings; other orgs | Manage contacts/leads, advance pipeline, send communications, manage tasks, create/edit loan file, request documents |
| Processor Dashboard (`/processing`) | Assigned loan files (documents, conditions, verification status), task queue | Unassigned loan files, org admin settings, campaign management | Update conditions, request/verify documents, update processing status, message borrower/LO |
| Manager Dashboard (`/management`) | Team pipeline, team performance reporting, team workload, team contacts/loan files (read + reassign) | Org billing/admin settings, other teams' data (unless also company_admin) | Reassign leads/loan files within team, view team reporting, manage team tasks |
| Admin Dashboard (`/admin`) | Org settings, user/role management, pipeline configuration, audit log (own org for company_admin, all orgs for platform_admin), org-wide reporting | platform_admin-only cross-org/billing screens hidden from company_admin | Manage users/roles, configure pipeline stages, view audit log, manage org settings |

All six share one Next.js app (`apps/platform`) with route-group-level authorization guards; a role landing outside its allowed route group is redirected server-side, not just hidden via navigation.

## 10. AI architecture

Fully specified in `docs/architecture/ai-architecture.md`, incorporated here by reference. No agent is live or invoked in Phase 1 (see §16).

## 11. Communication architecture

Fully specified in `docs/architecture/security-architecture.md` §5, incorporated here by reference. No live sends in Phase 1.

## 12. Document architecture

Fully specified in `docs/architecture/database-schema.md` §6 (data model) and `docs/architecture/security-architecture.md` §6 (access control), incorporated here by reference.

## 13. Multi-tenant security & threat model

Fully specified in `docs/architecture/security-architecture.md` §3–§4, incorporated here by reference as the security model Phase 1 implements and tests against.

## 14. Phase 1 implementation plan — exact scope

**Repository / directory structure:**

```
/apps
  /marketing        # public website (Next.js)
  /platform         # authenticated app: CRM + all portals (Next.js)
/packages
  /ui               # design system (Tailwind + shadcn/ui based), Storybook
  /db               # Prisma schema, migrations, seed scripts, generated client
  /core             # service layer: org/user/contact/loanfile business logic, DTOs, scoped query helpers
  /auth             # Auth.js config, session helpers, requirePermission/requireSession guards
  /comms            # provider-agnostic SMS/email interfaces + a NoopProvider (no live sends)
  /ai               # AiAgent registry interfaces + a NoopProvider (no live model calls)
  /property-intel   # provider-agnostic interface + MockProvider
  /rates            # provider-agnostic interface + MockProvider
  /config           # shared tsconfig, eslint, tailwind config
/docs
  /research
  /architecture
```

**Database (exact tables created in Phase 1):** `Organization`, `Branch`, `Team`, `User`, `Role`, `Permission`, `RolePermission`, `OrgMembership`, `Contact`, `ContactCommunicationPreference`, `PartnerCompany`, `Partner`, `Pipeline`, `PipelineStage`, `LoanFile`, `SubjectProperty`, `ManufacturedHomeDetail`, `HudLabel`, `ParkDetail`, `Applicant`, `Dependent`, `ResidenceHistory`, `Employment`, `SelfEmploymentDetail`, `OtherIncome`, `Asset`, `GiftDetail`, `Liability`, `RealEstateOwned`, `LoanTerms`, `Declaration`, `MilitaryService`, `DemographicInfo`, `DemographicRaceDetail`, `DemographicEthnicityDetail`, `Condition`, `DocumentType`, `DocumentRequest`, `Document`, `DocumentVersion`, `DocumentAccess`, `DocumentAudit`, `Task`, `Activity`, `StageHistory`, `AuditLog`, `AiAgent` (schema only), `AiConversation`, `AiMessage`, `AiAction` (schema only, unused), `Opportunity`, `Campaign`, `CampaignStep`, `CampaignEnrollment` (schema only, unused), `Communication` (schema only, unused). All "schema only" tables exist so later phases are additive migrations, not reshapes of core tables.

**Authentication (exact implementation):** Auth.js v5, Prisma adapter, Credentials provider (bcrypt-hashed password) + Email (magic link) provider using a dev-mode console/log transport (no real email send required to test the flow); registration is invite-only via a signed token created by an authorized server action; password reset built and testable against the dev-mode email log; MFA schema present, TOTP verification code path built but feature-flagged off by default.

**Design system (exact initial components in `packages/ui`):** design tokens (color, type scale, spacing), Button, Input, Select, Checkbox, Radio, Card, Badge/StatusPill, Table, Tabs, Modal/Dialog, Avatar, Toast, Timeline, PipelineBoard (Kanban-style), StatWidget — each with a Storybook story and light/dark-safe tokens.

**Routes (exact, Phase 1):**
- `apps/marketing`: `/`, `/get-approved`, `/apply`, `/contact`, `/login` (redirects into `apps/platform` auth) — placeholder/skeleton content only; full public-site build is Phase 2.
- `apps/platform`: `/login`, `/register` (invite-token flow), `/reset-password`, `/crm`, `/processing`, `/management`, `/admin`, `/portal`, `/partner` — each behind its role guard, rendering a minimal authenticated shell that proves the auth/RBAC/redirect pattern end-to-end, not full feature UIs.

**Server actions (exact, Phase 1):** `createOrganization` (platform_admin only), `inviteUser`, `acceptInvite`, `login`, `logout`, `requestPasswordReset`, `resetPassword`, `createContact`, `getContact` (role-filtered DTO), `assignOrgMembership`, `getAuditLogForOrg` (admin only).

**Tests (exact, Phase 1):**
- Unit (Vitest): `packages/core` service functions (contact creation/dedupe, org-scoping helper), `packages/auth` permission-matrix guard.
- Integration: Prisma against a test Postgres schema — the RLS cross-org isolation test (org A cannot read org B's `Contact`/`LoanFile` rows) is the single most important test in this phase.
- E2E (Playwright): register-via-invite → login → land on role-correct route → attempt a disallowed route group → redirected/403.

**CI/CD (exact checks on PR):** typecheck (`tsc --noEmit` across the monorepo via Turborepo), lint (ESLint incl. the custom "no unscoped Prisma call" rule), unit + integration tests, Prisma migration-diff check, Playwright e2e smoke run, Turborepo remote cache.

**Environment variables (exact, Phase 1):** `DATABASE_URL`, `DIRECT_DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL` (per app), `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `SENTRY_DSN` (per app), `R2_ACCOUNT_ID`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET_NAME`. Explicitly **absent**: `TWILIO_*`, `RESEND_API_KEY`/`POSTMARK_*`, `ANTHROPIC_API_KEY`, any property-intel or rate-provider keys — added when their respective phases begin.

**External services created now vs. later:**
- **Now:** GitHub repo (exists), Vercel project(s) (new, unconnected to any Base44 project), Neon/Supabase Postgres project (new), Upstash Redis, Sentry project, Cloudflare R2 bucket.
- **Later:** Twilio account (Phase 5), Resend/Postmark account (Phase 5), Anthropic API key/usage tier (Phase 6), any property-intelligence or rate-provider contract (Phase 9).

## 15. Phase 1 acceptance criteria

1. `pnpm install` succeeds from a clean clone with no manual steps beyond documented env var setup.
2. Both `apps/marketing` and `apps/platform` start (`pnpm dev`) without errors.
3. `prisma migrate deploy` runs cleanly against a fresh database and seeds reference data (roles, permissions, default pipeline/stages, document types, declaration question set) successfully.
4. A platform_admin can create an `Organization` and invite a `company_admin`.
5. An invited user can accept the invite and set a password (or use magic link) and log in.
6. On login, the user is routed to the route group matching their role (verified for at least one seeded user per role).
7. A `loan_officer` attempting to access `/admin` is redirected/blocked server-side — verified by direct URL navigation in the e2e test, not just UI inspection.
8. An automated test proves Organization A's user cannot read Organization B's `Contact`/`LoanFile` rows via the API, even via a crafted request bypassing the UI.
9. Every mutation exercised by the Phase 1 server actions produces a corresponding `AuditLog` row.
10. `packages/ui` Storybook renders all listed components without errors, in both light and dark tokens.
11. CI (typecheck, lint, unit, integration, e2e, migration-diff) passes on the PR that lands Phase 1.
12. Repository contains no reference to, dependency on, or credentials for the Base44 application or its infrastructure (verified by manual review before merge).
13. No production mortgage/borrower data exists anywhere in the repo, seed scripts, or committed fixtures — only synthetic test data.

## 16. What Phase 1 will not do

- AI agents actually running (no live Claude API calls; `packages/ai` ships a `NoopProvider` only).
- Live SMS sending (no live Twilio integration; `packages/comms` ships a `NoopProvider`/console-log transport only).
- Live email sending beyond a dev-mode log transport for the auth flow itself.
- Live phone/voicemail integration.
- Live property intelligence data (mock provider only).
- Live/production mortgage rates (mock provider only; never hard-coded production rates).
- MISMO XML generation/export (data modeled MISMO-ready per the database schema doc; no export engine built).
- Any LOS integration.
- Full underwriting engine/decisioning logic (schema for `UnderwritingDecision` exists; no automated decisioning).
- Production-grade document workflows beyond the basic upload/request/authorize path needed to prove the access-control model (no OCR, no auto-classification, no e-sign integration yet).
- Full-featured borrower portal (Phase 1 ships an authenticated shell proving routing/authorization; the real feature set is Phase 7).
- Full-featured realtor/partner portal (Phase 8).
- Public website content build-out (Phase 2 — Phase 1 ships route skeletons only).
- Full CRM feature UI (pipeline board interactions, contact 360 timeline, campaign builder — Phase 3+).
- MFA enforcement (built but off by default).

## 17. Final output and separation confirmation

This document, together with the other seven docs listed in `docs/project-overview.md`, constitutes the complete Phase 1 specification. No application code, database, or infrastructure has been created as part of producing this specification. The repository contains, and will continue to contain, no reference to, dependency on, or credentials for the Base44 Mobile Home Guy application. Implementation begins only as a separate, explicitly approved next task.
