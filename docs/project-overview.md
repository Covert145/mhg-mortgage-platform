# Mobile Home Guy Mortgage Platform — Project Overview

## What this is

A new, independent, production-grade mortgage technology platform for Mobile Home Guy, purpose-built for manufactured/mobile-home lending. This repository (`covert145/mhg-mortgage-platform`) is a completely separate codebase, database, authentication system, and deployment from the existing Mobile Home Guy Base44 application. Base44 and loanofficer.ai are used only as **reference material** — for brand, UX, and product-requirements research — never as a source of code, content, data, or infrastructure dependency.

## Why this exists

Mobile Home Guy needs a platform that treats manufactured and mobile-home lending as a first-class domain rather than an edge case bolted onto a generic mortgage CRM: chattel loans, land/home loans, park-owned vs. borrower-owned land, lot rent, HUD labels, park manager approvals, and manufactured-home-dealer/park/realtor referral relationships. It also needs to own the full mortgage lifecycle — public lead capture through CRM, mortgage application (URLA/1003), processing, underwriting, closing, and post-close — rather than handing applicants off to a third-party LOS partway through, which is how comparable tools (e.g., loanofficer.ai) are structured.

## Product pillars

1. **Public website** — lead-generation-first, modeled on the successful UX concepts of mobilehomeguy.com (rebuilt with original code).
2. **Secure authentication** — one login entry point, role-based routing into six distinct experiences.
3. **Mortgage CRM** — contact/lead/opportunity management, configurable pipeline, Contact 360 timeline.
4. **Mortgage loan-file management** — `LoanFile` as the system-of-record aggregate across the entire lifecycle.
5. **Mortgage application / URLA architecture** — a conceptual data model aligned to Form 1003 and MISMO 3.4 from day one, without taking on a MISMO XML implementation prematurely.
6. **Borrower & Realtor/Partner portals** — role-scoped, strictly limited views into shared loan data.
7. **AI platform** — five purpose-built agents (Lead Response, Follow-Up, Borrower Assistant, Realtor Agent, Database Reactivation) that engage but never make final lending decisions.
8. **Marketing automation** — campaign/trigger/condition/action architecture, human-approved before activation.
9. **Communications** — omnichannel (SMS/email/phone/voicemail/notes) with consent and TCPA-aware architecture.
10. **Property intelligence & rate engine** — provider-agnostic, mock data until a real vendor is connected.
11. **Reporting, administration, multi-company architecture** — organization → branch → team → user, with authorization enforced at the backend/database level, not just the UI.

## Business specialization

The platform's data model treats mobile/manufactured housing as first-class: property types (Mobile Home In Park, Manufactured Home In Park, Manufactured Home + Land, Mobile Home + Land, SFR, Condo, Townhouse, Other), land ownership (park-owned, borrower-owned, other), loan products (chattel, land/home, other), full manufactured-home attributes (year, make, model, serial/VIN, HUD label(s), size, bedrooms/bathrooms, single/double/triplewide), and park details (name, address, manager, lot number, lot rent, approval status). See `docs/architecture/database-schema.md` for the full data model.

## Separation from Base44

This project has, and will always have, its own repository, codebase, database, authentication, backend, frontend, deployment, environment variables, and integrations. Nothing in this repository connects to, imports from, deploys to, or depends on the Base44 Mobile Home Guy application or its infrastructure. This constraint applies to every phase of the roadmap, not just the current one.

## Document index

| Document | Contents |
|---|---|
| `docs/research/mobile-home-guy-research.md` | Public-website research (mobilehomeguy.com) and derived IA/requirements |
| `docs/research/loanofficer-ai-research.md` | Product research (loanofficer.ai) and derived CRM/AI requirements |
| `docs/architecture/system-architecture.md` | Technology stack, monorepo layout, long-term product architecture, portals |
| `docs/architecture/database-schema.md` | Multi-tenancy, CRM, pipeline, URLA/MISMO, mobile-home, and document data models |
| `docs/architecture/security-architecture.md` | Auth/RBAC, multi-tenant enforcement, threat model, communications compliance |
| `docs/architecture/ai-architecture.md` | Agent registry, tools, guardrails, human approval, AI CAN/MUST-NOT boundaries |
| `docs/architecture/phase-1-implementation-spec.md` | Exact Phase 1 build scope, acceptance criteria, deferred functionality |
| `docs/roadmap.md` | Phase 1–11 roadmap, complexity/risk notes |

## Current status

Phase 0/1 architecture and specification complete and approved. No application code, database, or infrastructure has been created yet — that begins as a separate, explicitly-approved next task per `docs/architecture/phase-1-implementation-spec.md`.
