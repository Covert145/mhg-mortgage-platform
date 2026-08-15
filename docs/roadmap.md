# Development Roadmap

The platform is built in controlled phases, not in one pass. Each phase builds on a database and authorization foundation that does not need to be reshaped later — see `docs/architecture/database-schema.md` for the schema decisions that make this possible (e.g., URLA-aligned `LoanFile` tables, mobile-home entities, and several "schema-only" tables seeded in Phase 1 for features that go live in later phases).

## Phase overview

| Phase | Scope | Depends on |
|---|---|---|
| **Phase 1 — Foundation** | Monorepo, database, authentication, Organization/Branch/Team/User, roles, design system | — |
| **Phase 2 — Public website** | Full build of Home, Get Approved, Apply Online, Listings, Parks, Loan Options, Learning Center, About, Team, Contact, State pages | Phase 1 |
| **Phase 3 — CRM** | Contact 360, pipeline board interactions, tasks/activities, contact management UI | Phase 1 |
| **Phase 4 — Loan files** | Full `LoanFile`/URLA intake UI, conditions, milestones | Phase 1, 3 |
| **Phase 5 — Communications** | Live Twilio (SMS/voice) and email provider integration, consent/opt-out enforcement in production | Phase 1, 3 |
| **Phase 6 — AI** | Live agent invocation (Lead Response, Follow-Up, Borrower Assistant, Realtor Agent, Database Reactivation), campaign automation execution | Phase 1, 3, 5 |
| **Phase 7 — Borrower portal** | Full borrower-facing feature set: document upload, milestone tracking, task completion | Phase 1, 4 |
| **Phase 8 — Partner portal** | Full realtor/partner-facing feature set: referrals, relationship activity, reporting | Phase 1, 3 |
| **Phase 9 — Property intelligence** | Real property-data provider integration, opportunity engine live | Phase 1, 6 |
| **Phase 10 — Reporting** | Lead/loan/partner/AI reporting dashboards across the platform | Phases 1–9 |
| **Phase 11 — LOS integrations** | Optional export/interop with external LOS platforms | Phase 1–4 |

## Phase 1 — exact scope

The full, exact Phase 1 build specification (directory structure, database tables, authentication implementation, design-system components, routes, server actions, tests, CI/CD, environment variables, and external services) is defined in `docs/architecture/phase-1-implementation-spec.md`. In summary, Phase 1 delivers:

- A Turborepo monorepo with `apps/marketing`, `apps/platform`, and the shared packages (`ui`, `db`, `core`, `auth`, `comms`, `ai`, `property-intel`, `rates`, `config`).
- The full multi-tenancy and RBAC schema (Organization → Branch → Team → User, roles, permissions), plus every core CRM/LoanFile/document table needed so later phases are additive migrations, not reshapes.
- Working authentication (invite-only registration, credentials + magic-link login, password reset, MFA schema) with server-side-enforced, role-based routing into six authenticated route groups (CRM, processing, management, admin, borrower portal, partner portal) — rendered as minimal shells, not full feature UIs.
- The base design system (tokens + ~14 core components) in Storybook.
- CI covering typecheck, lint (including a custom "no unscoped Prisma query" rule), unit/integration tests, an RLS cross-tenant-isolation test, e2e smoke tests, and a Prisma migration-drift check.

Full acceptance criteria are in `docs/architecture/phase-1-implementation-spec.md` §15.

## What Phase 1 explicitly does not do

No live AI agent invocation, no live SMS/email/phone sending, no live property-intelligence or mortgage-rate data, no MISMO XML export, no LOS integration, no underwriting decisioning engine, and no full-featured CRM/borrower/partner portal UI — all of these have schema and/or interface scaffolding in Phase 1 specifically so they can be built in their designated phase without a foundational rewrite. Full list in `docs/architecture/phase-1-implementation-spec.md` §16.

## Complexity and risk notes by phase

- **Phase 1** is schema/authorization-heavy; the highest-consequence risk is multi-tenant isolation correctness, mitigated by RLS + integration tests from day one (see `docs/architecture/security-architecture.md`).
- **Phase 4** (loan files/URLA) carries the most domain complexity — the URLA/MISMO-aligned data model (`docs/architecture/database-schema.md` §4) exists specifically to de-risk this phase.
- **Phase 5/6** (communications/AI) carry the most compliance risk (TCPA/CAN-SPAM, AI guardrails) — consent and guardrail structures are designed in Phase 1's schema even though nothing goes live until these phases.
- **Phase 9** (property intelligence) and future rate-provider integration carry vendor/cost uncertainty that is out of this platform's control; the provider-agnostic interface (mock data until a real vendor is connected) insulates the rest of the system from that uncertainty being unresolved for a long time.
- **Phase 11** (LOS integrations) is explicitly optional/interop, not a dependency for the platform to function, since `LoanFile` is already the system of record.
