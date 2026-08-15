# Security Architecture

Server-side authorization is the source of truth everywhere. Frontend role checks are UX convenience only and are never trusted as the actual control. This document defines authentication, RBAC, multi-tenant enforcement, the threat model, and communications/document access-control policy.

## 1. Authentication

- **Registration**: invitation-only for internal roles (platform_admin, company_admin, manager, loan_officer, processor) — no public self-registration for staff. Borrower/realtor accounts are provisioned when a loan officer creates a `Contact` → `LoanFile`/`Partner` and triggers a signed, expiring invite link.
- **Login**: Auth.js Credentials provider (email + password), Zod-validated input, Upstash-backed rate limiting (5 attempts / 15 min per IP+email combination).
- **Password reset**: signed, expiring token delivered by email.
- **Magic link**: Auth.js Email provider, used as an alternate login for borrower/realtor portals where a password is unnecessary friction.
- **MFA**: schema present (`User.mfaSecret`, `User.mfaEnabled`) and a TOTP verification step wired into login behind a feature flag; not enforced by default in Phase 1, enforcement for staff roles is a near-term follow-up.
- **Session**: Auth.js JWT session strategy (8-hour maxAge) — not database-backed sessions as originally proposed. This was corrected during Phase 1 implementation: Auth.js's Credentials provider does not create an adapter-backed database session regardless of the configured strategy (confirmed empirically — the `sessions` table stayed empty after a successful Credentials sign-in), a documented upstream constraint, not a preference. Role/permission claims are still never trusted from the JWT itself: every authorization check re-reads `OrgMembership`/`Role`/`Permission` from the database server-side (see §2), so a revoked or changed *permission* takes effect immediately. What the JWT strategy gives up is instant *session* revocation (forcibly logging a user out mid-token-lifetime) — mitigated for now by the short 8-hour maxAge; a `User.sessionInvalidatedAt` check in the `jwt` callback is a near-term follow-up, tracked alongside the MFA-enforcement item below. The PrismaAdapter remains in place for the Email (magic-link) provider and Account linkage, and `Session`/`Account`/`VerificationToken` tables stay in the schema for that purpose.
- **Role/org/branch/team assignment**: exclusively via `OrgMembership`, mutable only by `company_admin` (within their org) or `platform_admin` (any org) through an authorized server action — never client-writable.

## 2. Role-based access control

Seven roles: `platform_admin`, `company_admin`, `manager`, `loan_officer`, `processor`, `borrower`, `realtor_partner`. Initial permission matrix (✓ = full access to own-organization data; "team" = team/branch-scoped; "own" = owner/assignee-scoped):

| Capability | platform_admin | company_admin | manager | loan_officer | processor | borrower | realtor_partner |
|---|---|---|---|---|---|---|---|
| Manage organizations | ✓ | – | – | – | – | – | – |
| Manage own org settings | ✓ | ✓ | – | – | – | – | – |
| Manage users/roles | ✓ | ✓ | team-scope | – | – | – | – |
| View contacts/loan files | ✓ | ✓ | team-scope | own only | assigned only | own only | own referrals only |
| Create/edit contacts | ✓ | ✓ | ✓ | ✓ | – | – | request only |
| Create/edit LoanFile core data | ✓ | ✓ | ✓ | ✓ (own) | assigned fields only | – | – |
| Edit underwriting decision fields | ✓ | ✓ (licensed role) | – | – | – | – | – |
| Manage pipeline configuration | ✓ | ✓ | – | – | – | – | – |
| Send communications | ✓ | ✓ | ✓ (own contacts) | ✓ (own contacts) | ✓ (assigned) | reply only, own loan | reply only, own referrals |
| Upload/view documents | ✓ | ✓ | team-scope | own contacts | assigned | own documents only | none by default |
| View reporting/dashboards | ✓ platform | ✓ org | ✓ team | own metrics | own workload | – | own referral metrics only |
| Manage campaigns | ✓ | ✓ | ✓ | create/edit own, approval required to activate | – | – | – |
| View audit log | ✓ | ✓ (own org) | – | – | – | – | – |

This matrix is implemented as `Permission`/`RolePermission` seed data plus a single `requirePermission(user, resource, action, scopeCheck)` guard used by every server action — not ad hoc per-route checks.

## 3. Multi-tenant enforcement (defense in depth)

1. **PostgreSQL Row-Level Security** — every tenant-scoped table has a policy restricting rows to `organization_id = current_setting('app.current_org_id')`, set per request/transaction before any query runs. This is the hard backstop that holds even if application-layer scoping has a bug.
2. **Prisma scoping** — a shared `withOrgScope(orgId)` query helper wraps every read/write used in `packages/core`; a custom ESLint rule flags any unscoped Prisma call outside that helper.
3. **API/server-action authorization** — every server action runs `requireSession()` → `requirePermission(user, resource, action)` → an ownership/scope check (own/team/org, per the matrix above) before touching data.
4. **Object-level authorization** — beyond "is this the right organization," per-request ownership checks (e.g., is this loan officer actually the owner of *this* loan file) run on every request, never cached.
5. **Audit logging** — an append-only `AuditLog` table (actorId, actorType, action, entityType, entityId, before, after, organizationId, ipAddress, timestamp), written by the same service-layer helpers that perform mutations, so logging isn't something individual routes can forget.
6. **PII encryption** — `ssn`, `dob`, and account numbers use column-level encryption (pgcrypto) with keys managed outside the application codebase; the UI renders masked values by default, with an explicit, audit-logged reveal action.
7. **Document authorization** — signed, short-TTL URLs issued only after per-document, per-request authorization (see §5) — never a static or public link.

## 4. Threat model

| Threat | Vector | Mitigation |
|---|---|---|
| Cross-tenant access | A query missing an org filter; RLS session variable not set on a pooled connection | RLS as a hard backstop independent of app-layer bugs; integration tests specifically assert org-A cannot read org-B rows across every core entity; the RLS session variable is set in one shared request-context middleware, not per-route |
| Borrower PII exposure | An endpoint returns a full row (e.g., `Applicant` with SSN) to a role that shouldn't see it | Field-level, role-filtered response DTOs everywhere — no server action returns a raw Prisma model to the client |
| Unauthorized document access | Guessable or shared storage URLs | Short-TTL signed URLs only, issued per-request after authorization; storage keys are random, never derived from predictable identifiers |
| AI data leakage | An agent tool call returns more data than its context needs, or echoes sensitive data to the wrong channel | AI tools are field-filtered per agent type at the data-access layer (not just prompt-instructed); every AI conversation/action is logged for review — see `docs/architecture/ai-architecture.md` |
| Partner portal leakage | A partner-scoped query joins through to full borrower financial data | The partner portal has its own dedicated DTOs, never reusing the internal CRM's full loan-file serializer — a new internal field does not automatically appear in the partner view |
| Session compromise | Stolen session cookie/token | DB-backed sessions (instantly revocable, unlike long-lived stateless JWTs), short session TTL with sliding refresh, anomaly logging on IP/device change, forced re-auth for sensitive actions (revealing SSN, changing bank-linked fields) |

## 5. Communications compliance and consent

| Concept | Definition |
|---|---|
| `ContactCommunicationPreference` | contactId, smsOptIn, emailOptIn, doNotCall, preferredChannel, optInTimestamp, optInSource, optOutTimestamp | Consent tracked per channel — SMS (TCPA) and email (CAN-SPAM) have independent consent regimes |
| Consent capture | Every public form that could lead to outbound SMS/email captures explicit opt-in language, timestamp, and source at `Contact` creation — never assumed |
| Opt-out | Standard `STOP`/unsubscribe handling sets the relevant opt-in flag false; enforced as a hard gate in the send path (`packages/comms`) that no send function, including AI-triggered sends, can bypass |
| TCPA readiness | Quiet-hours enforcement per contact timezone and frequency capping are designed in now (fields exist) even though no real SMS sends until Phase 5, so the architecture doesn't need retrofitting |
| AI vs. human sender | Every `Communication` row records `senderType` (`USER`/`AI_AGENT`/`SYSTEM`) and `senderId` |

## 6. Document access control

Cloudflare R2 has no public access. Every document retrieval issues a short-TTL (5–15 minute) signed URL generated only after the requesting user's authorization is confirmed server-side for that specific `documentId`. Uploads land in a quarantine prefix and move to the accessible prefix only after `virusScanStatus = CLEAN`. Every view/download is logged in `DocumentAudit`, not just uploads and deletes — see the data model in `docs/architecture/database-schema.md` §6.

## 7. Compliance posture

The architecture is designed to be compatible with SOC 2 and GLBA Safeguards Rule expectations (encryption at rest/in transit, access logging, least-privilege roles) even though formal certification is out of scope for Phase 1. Demographic/Government Monitoring Information handling follows HMDA/Reg B constraints on allowed values and voluntary disclosure — see `docs/architecture/database-schema.md` §4.
