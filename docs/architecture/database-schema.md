# Database Schema Architecture

PostgreSQL via Prisma, with every tenant-owned table carrying a non-nullable `organizationId`. This document defines the conceptual data model; the exact Phase 1 table list is in `docs/architecture/phase-1-implementation-spec.md` §14. All primary keys are UUIDs, omitted below for brevity.

## 1. Multi-tenancy hierarchy

```
Organization → Branch → Team → User
```

Users are linked to organizations via `OrgMembership` (a many-to-many join carrying `organizationId`, `branchId`, `teamId`, and `roleId`), not a single FK on `User` — this supports a user (e.g., a realtor partner) belonging to more than one organization. See `docs/architecture/security-architecture.md` for how this hierarchy is enforced at the query and database level.

## 2. CRM data model

| Entity | Key fields | Relationships | Cardinality | Ownership |
|---|---|---|---|---|
| `Organization` | name, nmlsId, status | root of tenancy | 1 → many `Branch` | platform_admin creates |
| `Branch` | organizationId, name, address | belongs to `Organization` | 1 org → many `Branch` | company_admin manages |
| `Team` | branchId, name | belongs to `Branch` | 1 `Branch` → many `Team` | manager manages |
| `User` | email, name, nmlsId (if LO) | via `OrgMembership` | many-to-many `Organization` | company_admin / platform_admin |
| `Role` | name (enum, 7 roles) | `OrgMembership.roleId` | 1 → many `OrgMembership` | seeded |
| `Permission` | resource, action | `RolePermission` join | many-to-many `Role` | seeded |
| `OrgMembership` | userId, organizationId, branchId?, teamId?, roleId | central RBAC join | — | company_admin assigns |
| `Contact` | organizationId, name, email, phone, contactType, leadSource, leadScore, ownerId | → many `Opportunity`, `LoanFile`, `Communication`, `Activity`, `Task` | organizationId required | owned by `ownerId` |
| `Applicant` | contactId?, loanFileId, applicantType | belongs to `LoanFile` | 1 `LoanFile` → many `Applicant` | scoped via `LoanFile.organizationId` |
| `Partner` | organizationId, contactId, partnerType, partnerCompanyId? | belongs to `Organization` | many `Partner` → 1 `PartnerCompany`? | assigned loan officer |
| `PartnerCompany` | organizationId, name, companyType | 1 → many `Partner` | organizationId required | company_admin/manager |
| `LoanFile` | organizationId, contactId, subjectPropertyId, pipelineStageId, loanOfficerId, processorId, status | central aggregate — see §4/§5 | 1 `Contact` → many `LoanFile` | loanOfficerId + processorId |
| `Opportunity` | organizationId, contactId, opportunityType, source, status | precedes/parallels `LoanFile` | 1 `Contact` → many `Opportunity` | ownerId |
| `Task` | organizationId, assigneeId, relatedType/relatedId, dueDate, status | polymorphic | many → 1 related entity | assigneeId |
| `Activity` | organizationId, actorId, relatedType/relatedId, activityType, payload | append-only timeline | many → 1 related entity | system-generated, immutable |
| `Communication` | organizationId, contactId, loanFileId?, channel, direction, senderType, campaignId?, body, status | see communications compliance in security doc | many → 1 `Contact` | senderId / aiAgentId |
| `Campaign` | organizationId, name, status, createdBy | 1 → many `CampaignStep`, `CampaignEnrollment` | organizationId required | user or AI-drafted |
| `Document` | organizationId, loanFileId?, contactId?, documentTypeId, storageKey, uploadedBy | see §5 | many → 1 `LoanFile`/`Contact` | uploader + loan file owners |

`organizationId` is denormalized onto tables like `Communication` even though it's reachable transitively via `Contact`, specifically so Row-Level Security policies can filter on a single indexed column without a join.

## 3. Pipeline architecture

| Entity | Key fields | Notes |
|---|---|---|
| `Pipeline` | organizationId, name, isDefault | An org can define multiple pipelines later; Phase 1 seeds one default per org |
| `PipelineStage` | pipelineId, name, sortOrder, stageCategory, isSystemDefault | Seeded with the 20 default active stages (New Lead → Post Close) plus Not Interested / Denied / Withdrawn / Nurture / Dead |
| `LoanFile.pipelineStageId` | FK to current stage | Single source of truth for current stage |
| `StageHistory` | loanFileId, fromStageId?, toStageId, changedByUserId, changedAt | Append-only; powers cycle-time reporting |
| `StageAutomationRule` | organizationId, pipelineStageId, triggerEvent, action | Schema defined in Phase 1; zero active rules until Phase 3/6 |

Default stage order: New Lead, Attempting Contact, Contacted, Application Sent, Application Started, Documents Requested, Documents Received, Preparing To Submit For Approval, Submitted for Approval, Pre-Approved, Shopping, Offer Accepted, Processing, Submitted to Underwriting, Approved, Clear To Close, Docs Out, Signing, Funded, Post Close — configurable per organization from this seeded default.

## 4. URLA / Form 1003 / MISMO 3.4 conceptual model

Modeled against the 2021 redesigned URLA section structure so a future MISMO 3.4 export layer can be added without restructuring core tables. No MISMO XML engine is implemented at this stage.

| URLA section | Entity | Key fields | MISMO-sensitive notes |
|---|---|---|---|
| 1a Personal Information | `Applicant` | legalFirstName, middleName, lastName, ssn (encrypted), dob, citizenship, maritalStatus, phone, email | Citizenship/marital status use controlled enum vocabularies, never free text |
| 1a Dependents | `Dependent` | ageAtApplication, relationship | Modeled as a child table (not a count column) to preserve ages |
| 1a Residence | `ResidenceHistory` | applicantId, structured address, residencyBasis, durationMonths, isCurrent | Structured address (not free text); duration in months to derive the 24-month continuation rule precisely |
| 1b/1c/1d Employment | `Employment` | applicantId, employerName, structured employer address, position, dates, isCurrent, isSelfEmployed, ownershipPercent, monthlyIncome | Self-employment ≥25% ownership drives different MISMO income-type codes |
| 1b Self-employment | `SelfEmploymentDetail` | employmentId, businessName, businessStructure, monthlyIncomeOrLoss, isLoss | Explicit `isLoss` boolean, not just a signed amount |
| 1e Other income | `OtherIncome` | applicantId, incomeType (enum), monthlyAmount | `incomeType` maps 1:1 to MISMO's `OtherIncomeSourceType` vocabulary |
| 2a/2b Assets | `Asset` (+ `GiftDetail`) | applicantId, assetType, institutionName, accountNumberMasked, cashOrMarketValue | Gift/grant assets carry a `GiftDetail` child (source, donor relationship) |
| 2c/2d Liabilities | `Liability` | applicantId, liabilityType, creditorName, accountNumberMasked, monthlyPayment, unpaidBalance, willBePaidOffAtClosing | Payoff-at-closing flag is first-class, feeds DTI directly |
| 3a/3b Real Estate Owned | `RealEstateOwned` | applicantId, structured address, propertyType, status, occupancyType, marketValue, mortgageBalance, monthlyRentalIncome, liabilityId? | Optional cross-reference to the `Liability` row it secures |
| 4a Loan/Property | `SubjectProperty` + `LoanTerms` | loanPurpose, loanAmount, loanType, amortizationType, loanTerm | Chattel/manufactured-home loan types are a documented custom extension point beyond standard MISMO conventional/FHA/VA/USDA codes |
| 4b Other mortgages | `LoanTerms` child rows | creditorName, lienType, monthlyPayment, amount | Standard MISMO field |
| 4d Gifts/grants | `GiftDetail` | donorName, donorRelationship, deposited | — |
| 5 Declarations | `Declaration` | applicantId, questionCode (enum A–I), answer, explanation | Canonical question set stored as seed/reference data so codes stay stable if UI copy changes |
| 6 Acknowledgments | `LoanFile.acknowledgments` | consentTimestamp, consentIpAddress, esignConsent | E-sign compliance record |
| 7 Military service | `MilitaryService` | applicantId, served, branch, serviceType, expectedCompletionDate | Affects VA-loan eligibility logic; enum values match MISMO's military-service vocabulary |
| 8 Demographics / GMI | `DemographicInfo` (+ `DemographicRaceDetail`, `DemographicEthnicityDetail`) | ethnicity[], race[], sex, collectionMethod, applicantDidNotWish | **Highest compliance sensitivity in the model** — HMDA/Reg B govern exact values and multi-select semantics; never required-to-proceed |
| 9 Loan Originator | `User`, `Organization` | nmlsId (both levels) | Standard MISMO/URLA fields |
| Underwriting section | `UnderwritingDecision`, `LoanTerms` extensions | qualifying ratios, amortizationType, mortgageType, projectType, titleType | Writable only by processor/underwriter/admin roles — never by AI (see AI architecture doc) |
| Processing | `Condition` | loanFileId, category, description, status, dueDate, satisfiedDocumentId | Links directly to the `Document` that satisfies it |
| Closing | `ClosingDetails` | loanFileId, closingDate, fundingDate, titleCompany, closingDisclosureSentDate, docsOutDate, signingDate | Minimal Phase 1 shape; full CD field modeling deferred |

**MISMO-readiness rules applied schema-wide:** enum-like fields use fixed, MISMO-vocabulary-compatible values (Postgres enums or lookup tables, never free text); historical facts are preserved via audit log rather than silent overwrite; addresses are always structured; monetary fields are stored as integer cents.

## 5. Mobile-home loan data model

```
SubjectProperty (1) ──── (0..1) ManufacturedHomeDetail
      │                          │
      │                          └──── (0..1) ParkDetail  (when landOwnership = PARK_OWNED)
      │
      └──── (1) LoanFile
```

| Entity | Key fields | Notes |
|---|---|---|
| `SubjectProperty` | propertyType (`MOBILE_HOME_IN_PARK`, `MANUFACTURED_HOME_IN_PARK`, `MANUFACTURED_HOME_WITH_LAND`, `MOBILE_HOME_WITH_LAND`, `SFR`, `CONDO`, `TOWNHOUSE`, `OTHER`), structured address, landOwnership (`PARK_OWNED`, `BORROWER_OWNED`, `OTHER`), occupancyType (`PRIMARY`, `SECONDARY`, `INVESTMENT`, `BUY_FOR_SOMEONE`), estimatedValue, purchasePrice | `propertyType` + `landOwnership` determine whether the child tables below are required — enforced server-side, not just in the UI |
| `ManufacturedHomeDetail` | 1:1 with `SubjectProperty`; year, make, model, serialNumber, vin, sizeSqFt, widthFt, lengthFt, bedrooms, bathrooms, sectionCount, sectionType (`SINGLEWIDE`/`DOUBLEWIDE`/`TRIPLEWIDE`) | — |
| `HudLabel` | manufacturedHomeDetailId, labelNumber | Repeatable child table — a triplewide can carry multiple HUD labels |
| `ParkDetail` | 1:1 when park-owned; parkName, structured park address, parkManagerName/phone/email, lotNumber, lotRentMonthly, parkApprovalStatus, parkApprovalDate, parkRulesDocumentId, parkContactNotes | `lotRentMonthly` is a required input to DTI/qualifying-ratio calculation for park-sited homes |
| `LoanTerms.loanProductType` | `CHATTEL`, `LAND_HOME`, `OTHER`, plus standard conventional/FHA/VA/USDA | Primary underwriting-path branch for manufactured housing; drives which condition-set/document-checklist templates apply |

`SubjectProperty` is loan-file-scoped, not a shared listing object — the public website's Listings/Parks content is served by a separate, lighter `PublicListing`/`PublicPark` entity that feeds *into* a `SubjectProperty` at application time, keeping marketing-aggregated data cleanly separate from loan-file-of-record data.

## 6. Document data model

| Entity | Key fields | Notes |
|---|---|---|
| `DocumentType` | code, label, category (`BORROWER`/`LOAN`/`UNDERWRITING`/`CLOSING`/`PARTNER`), requiresVersioning | Seed data, extensible per organization |
| `DocumentRequest` | loanFileId, documentTypeId, requestedByUserId, status, dueDate, satisfiesConditionId? | Drives the borrower portal's requested-documents list |
| `Document` | organizationId, loanFileId?, contactId?, documentTypeId, storageKey, originalFilename, mimeType, sizeBytes, uploadedByUserId, virusScanStatus | Never publicly resolvable — see access control in the security doc |
| `DocumentVersion` | documentId, versionNumber, storageKey, uploadedAt | Only for document types requiring versioning |
| `DocumentAccess` | documentId, grantedToUserId, grantedByUserId, grantedAt, expiresAt? | Explicit exception grants (e.g., sharing a document with a referring realtor) beyond default role/ownership access |
| `DocumentAudit` | documentId, actorId, actorType, action, timestamp, ipAddress | Every read, not just write, is logged |

Full access-control and threat-model detail for documents and communications lives in `docs/architecture/security-architecture.md`.
