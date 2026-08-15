# System Architecture

This document defines the technology stack and system-level architecture for the Mobile Home Guy mortgage platform: a new, independent codebase, database, and deployment, with no connection to the existing Base44 application. See `docs/project-overview.md` for product scope and `docs/architecture/phase-1-implementation-spec.md` for the exact near-term build plan.

## 1. Technology stack

Each choice below was evaluated against real alternatives, not assumed. Full per-technology justification, alternatives considered, risk, cost, scalability, and security notes are in `docs/architecture/phase-1-implementation-spec.md` §1; this table is the summary.

| Layer | Choice | Alternatives considered | Why this one |
|---|---|---|---|
| Monorepo tooling | Turborepo + pnpm workspaces | Nx, polyrepo | Lower config overhead than Nx; avoids cross-repo version drift a polyrepo would force on shared UI/db packages that change constantly early on |
| Frontend framework | Next.js 15 (App Router) + TypeScript | Remix; SPA (Vite/React) + standalone API | Single framework serves both marketing site and authenticated app; RSC/SSR matters for SEO on lead-gen pages; avoids standing up a second API service with no current non-web consumer |
| Database | PostgreSQL (Neon, serverless) | MySQL, MongoDB | Relational integrity fits a regulated, audit-sensitive domain; native Row-Level Security is the multi-tenant backstop; Neon's branch-per-PR model fits heavy early schema iteration |
| ORM | Prisma | Drizzle, raw SQL/Kysely | Mature migration tooling and generated types for a schema this large (20+ LoanFile-related tables); requires care with RLS session variables under connection pooling |
| Auth | Auth.js (NextAuth v5), DB session strategy | Clerk, WorkOS, Supabase Auth | Full control of org/role/branch claims and instant session revocation, needed for a platform whose core value is precise multi-tenant/RBAC control over mortgage data; avoids syncing our org model into a third-party auth system |
| File storage | Cloudflare R2 | AWS S3, Supabase Storage | S3-compatible with no egress fees, which matters since loan documents are read far more than written |
| Background jobs | Inngest | BullMQ + Redis, Trigger.dev, Temporal | Durable, retryable, event-driven step functions fit AI agent runs and multi-step campaigns without us operating Redis/workers ourselves |
| SMS/voice | Twilio (interface only in Phase 1) | Vonage, Plivo, MessageBird | Deepest 10DLC/compliance tooling; not wired to a live account until Phase 5 |
| Email | Resend or Postmark (interface only in Phase 1) | SendGrid, AWS SES | Deliverability-focused with less operational overhead than SES/SendGrid at this scale; final pick deferred to Phase 5 |
| AI model provider | Anthropic Claude API (interface only in Phase 1) | OpenAI, self-hosted open-weight models | Tool-calling steerability fits a platform where guardrails (no final lending decisions) must be enforceable; kept behind a provider-agnostic interface so this is never a hard lock-in |
| Hosting | Vercel | AWS (Amplify/ECS), Netlify, Cloudflare Pages | Most mature first-party Next.js/RSC support; both apps remain portable standard Next.js if we ever move |
| Rate limiting/cache | Upstash Redis | Self-hosted Redis, Vercel KV | Serverless-friendly, no server to operate; used from Phase 1 for auth-endpoint rate limiting |
| Observability | Sentry | Self-hosted (GlitchTip), Datadog | Cheap, proven, source-map support; PII-scrubbing rules configured before any real user data exists |
| Property intelligence / rates | Provider-agnostic interfaces, mock data | — | Never claim live data or hard-code production rates before a real vendor is connected |

## 2. Monorepo structure

```
/apps
  /marketing        # public website (Next.js) — Phase 2
  /platform         # authenticated app: CRM + all portals (Next.js) — Phases 3–8
/packages
  /ui               # design system (Tailwind + shadcn/ui), Storybook
  /db               # Prisma schema, migrations, seed scripts
  /core             # service layer: business logic, DTOs, org-scoped query helpers
  /auth             # Auth.js config, session/permission guards
  /comms            # provider-agnostic SMS/email interfaces
  /ai               # AI agent registry interfaces
  /property-intel   # provider-agnostic property data interface
  /rates            # provider-agnostic rate-engine interface
  /config           # shared tsconfig/eslint/tailwind config
/docs
  /research
  /architecture
```

One code path creates core records (e.g., a `Contact`) regardless of whether the caller is the public marketing site or the internal CRM — both call the same `packages/core` service functions.

## 3. Long-term product architecture

The platform owns the full mortgage lifecycle as a single system of record, not a CRM that hands off to an external LOS partway through:

```
Public Website (lead capture)
      │
      ▼
   Contact  ──────────────► CRM (pipeline, tasks, communications, campaigns)
      │
      ▼
  Opportunity (loan-type intent, property, estimated terms)
      │
      ▼
 Mortgage Application (URLA/1003-aligned intake)
      │
      ▼
   LoanFile (system of record: applicants, property, terms, docs, conditions)
      │
      ├──► Processing        (document collection, verification, conditions)
      ├──► Underwriting      (decisioning inputs, conditions, approval — human-owned)
      ├──► Closing           (closing disclosure data, docs out, signing, funding)
      └──► Post-Close        (servicing handoff, retention/reactivation triggers)
```

`LoanFile` is a durable aggregate that persists across the entire lifecycle, with stage-specific child entities (`Condition`, `ClosingDetails`, `UnderwritingDecision`) rather than separate systems per phase. This is what makes a future MISMO export or optional LOS integration (Phase 11) additive rather than a rebuild — see `docs/architecture/database-schema.md`.

## 4. Portal architecture

One Next.js app (`apps/platform`), one login entry point, role-based post-login redirect and route-group-level authorization guards (re-checked in every server action, not just middleware):

| Portal | Base route | Role | Scope |
|---|---|---|---|
| Borrower Portal | `/portal` | `borrower` | Own `LoanFile`(s) only |
| Realtor/Partner Portal | `/partner` | `realtor_partner` | `LoanFile`s where they are the linked `Partner`, borrower-financial fields excluded |
| Loan Officer CRM | `/crm` | `loan_officer` | Own contacts/loan files (+ team scope if also a manager) |
| Processor Dashboard | `/processing` | `processor` | Assigned loan files |
| Manager Dashboard | `/management` | `manager` | Team scope |
| Admin Dashboard | `/admin` | `company_admin` / `platform_admin` | Own org / all orgs |

Full permission-by-capability detail is in `docs/architecture/security-architecture.md`; full data-available/prohibited detail per portal is in `docs/architecture/phase-1-implementation-spec.md` §9.

## 5. Environments and deployment

Dedicated Vercel projects for `apps/marketing` and `apps/platform`, a dedicated Neon/Supabase Postgres project, dedicated Upstash Redis, Sentry, and Cloudflare R2 — all newly created for this platform, none shared with or dependent on any Base44 project, account, or credential. Preview deployments per PR use branched databases (Neon) so schema iteration never touches shared data.
