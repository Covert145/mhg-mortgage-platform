-- CreateEnum
CREATE TYPE "OrgStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "InviteStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "RoleName" AS ENUM ('PLATFORM_ADMIN', 'COMPANY_ADMIN', 'MANAGER', 'LOAN_OFFICER', 'PROCESSOR', 'BORROWER', 'REALTOR_PARTNER');

-- CreateEnum
CREATE TYPE "PermissionAction" AS ENUM ('VIEW', 'CREATE', 'EDIT', 'DELETE', 'MANAGE');

-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('LEAD', 'BORROWER', 'PAST_CLIENT', 'REALTOR', 'OTHER');

-- CreateEnum
CREATE TYPE "PreferredChannel" AS ENUM ('SMS', 'EMAIL', 'PHONE');

-- CreateEnum
CREATE TYPE "PartnerType" AS ENUM ('REALTOR', 'PARK_MANAGER', 'DEALER', 'OTHER');

-- CreateEnum
CREATE TYPE "PartnerCompanyType" AS ENUM ('REALTY_BROKERAGE', 'MH_DEALER', 'PARK_MANAGEMENT', 'OTHER');

-- CreateEnum
CREATE TYPE "PipelineStageCategory" AS ENUM ('ACTIVE', 'CLOSED_WON', 'CLOSED_LOST', 'NURTURE');

-- CreateEnum
CREATE TYPE "StageActorType" AS ENUM ('USER', 'AI_AGENT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "LoanFileStatus" AS ENUM ('IN_PROGRESS', 'ACTIVE', 'CLOSED_WON', 'CLOSED_LOST', 'NURTURE');

-- CreateEnum
CREATE TYPE "PropertyType" AS ENUM ('MOBILE_HOME_IN_PARK', 'MANUFACTURED_HOME_IN_PARK', 'MANUFACTURED_HOME_WITH_LAND', 'MOBILE_HOME_WITH_LAND', 'SFR', 'CONDO', 'TOWNHOUSE', 'OTHER');

-- CreateEnum
CREATE TYPE "LandOwnership" AS ENUM ('PARK_OWNED', 'BORROWER_OWNED', 'OTHER');

-- CreateEnum
CREATE TYPE "OccupancyType" AS ENUM ('PRIMARY', 'SECONDARY', 'INVESTMENT', 'BUY_FOR_SOMEONE');

-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('SINGLEWIDE', 'DOUBLEWIDE', 'TRIPLEWIDE');

-- CreateEnum
CREATE TYPE "ParkApprovalStatus" AS ENUM ('NOT_REQUESTED', 'REQUESTED', 'APPROVED', 'DENIED');

-- CreateEnum
CREATE TYPE "LoanProductType" AS ENUM ('CHATTEL', 'LAND_HOME', 'CONVENTIONAL', 'FHA', 'VA', 'USDA', 'OTHER');

-- CreateEnum
CREATE TYPE "LoanPurpose" AS ENUM ('PURCHASE', 'REFINANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "AmortizationType" AS ENUM ('FIXED', 'ADJUSTABLE');

-- CreateEnum
CREATE TYPE "ApplicantType" AS ENUM ('BORROWER', 'CO_BORROWER');

-- CreateEnum
CREATE TYPE "Citizenship" AS ENUM ('US_CITIZEN', 'PERMANENT_RESIDENT_ALIEN', 'NON_PERMANENT_RESIDENT_ALIEN');

-- CreateEnum
CREATE TYPE "MaritalStatus" AS ENUM ('MARRIED', 'SEPARATED', 'UNMARRIED');

-- CreateEnum
CREATE TYPE "ResidencyBasis" AS ENUM ('OWN', 'RENT', 'LIVING_RENT_FREE');

-- CreateEnum
CREATE TYPE "BusinessStructure" AS ENUM ('SOLE_PROP', 'PARTNERSHIP', 'S_CORP', 'C_CORP', 'LLC');

-- CreateEnum
CREATE TYPE "OtherIncomeType" AS ENUM ('ALIMONY', 'CHILD_SUPPORT', 'SOCIAL_SECURITY', 'RETIREMENT', 'DISABILITY', 'OTHER');

-- CreateEnum
CREATE TYPE "AssetType" AS ENUM ('CHECKING', 'SAVINGS', 'RETIREMENT', 'STOCKS', 'GIFT', 'OTHER');

-- CreateEnum
CREATE TYPE "LiabilityType" AS ENUM ('CREDIT_CARD', 'INSTALLMENT', 'STUDENT_LOAN', 'AUTO_LOAN', 'MORTGAGE', 'ALIMONY_CHILD_SUPPORT', 'OTHER');

-- CreateEnum
CREATE TYPE "ReoStatus" AS ENUM ('SOLD', 'PENDING_SALE', 'RETAINED');

-- CreateEnum
CREATE TYPE "MilitaryServiceType" AS ENUM ('ACTIVE', 'RESERVE_NATIONAL_GUARD', 'VETERAN', 'SURVIVING_SPOUSE', 'NONE');

-- CreateEnum
CREATE TYPE "CollectionMethod" AS ENUM ('FACE_TO_FACE', 'TELEPHONE', 'MAIL', 'EMAIL_INTERNET');

-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE', 'NOT_PROVIDED');

-- CreateEnum
CREATE TYPE "ConditionCategory" AS ENUM ('INCOME', 'ASSET', 'PROPERTY', 'CREDIT', 'OTHER');

-- CreateEnum
CREATE TYPE "ConditionStatus" AS ENUM ('OPEN', 'SATISFIED', 'WAIVED');

-- CreateEnum
CREATE TYPE "DocumentCategory" AS ENUM ('BORROWER', 'LOAN', 'UNDERWRITING', 'CLOSING', 'PARTNER');

-- CreateEnum
CREATE TYPE "DocumentRequestStatus" AS ENUM ('REQUESTED', 'RECEIVED', 'REJECTED', 'WAIVED');

-- CreateEnum
CREATE TYPE "DocStatus" AS ENUM ('PENDING_REVIEW', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "VirusScanStatus" AS ENUM ('PENDING', 'CLEAN', 'FLAGGED');

-- CreateEnum
CREATE TYPE "DocumentAuditAction" AS ENUM ('VIEW', 'DOWNLOAD', 'UPLOAD', 'DELETE', 'STATUS_CHANGE');

-- CreateEnum
CREATE TYPE "RelatedEntityType" AS ENUM ('CONTACT', 'LOAN_FILE', 'OPPORTUNITY');

-- CreateEnum
CREATE TYPE "TaskStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('USER', 'AI_AGENT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "OpportunityType" AS ENUM ('PURCHASE', 'REFINANCE', 'CASH_OUT', 'HELOC', 'EQUITY', 'RATE_REDUCTION', 'ANNUAL_REVIEW');

-- CreateEnum
CREATE TYPE "OpportunitySource" AS ENUM ('WEBSITE', 'PROPERTY_INTEL', 'MANUAL', 'AI_DETECTED');

-- CreateEnum
CREATE TYPE "OpportunityStatus" AS ENUM ('OPEN', 'CONVERTED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "CommunicationChannel" AS ENUM ('SMS', 'EMAIL', 'PHONE', 'VOICEMAIL', 'NOTE');

-- CreateEnum
CREATE TYPE "CommunicationDirection" AS ENUM ('INBOUND', 'OUTBOUND');

-- CreateEnum
CREATE TYPE "SenderType" AS ENUM ('USER', 'AI_AGENT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "CommunicationStatus" AS ENUM ('QUEUED', 'SENT', 'DELIVERED', 'FAILED', 'RECEIVED');

-- CreateEnum
CREATE TYPE "CampaignStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'PAUSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "CampaignCreatedBy" AS ENUM ('USER', 'AI_AGENT');

-- CreateEnum
CREATE TYPE "CampaignEnrollmentStatus" AS ENUM ('ENROLLED', 'COMPLETED', 'STOPPED');

-- CreateEnum
CREATE TYPE "AiAgentName" AS ENUM ('LEAD_RESPONSE', 'FOLLOW_UP', 'BORROWER_ASSISTANT', 'REALTOR_AGENT', 'DATABASE_REACTIVATION');

-- CreateEnum
CREATE TYPE "AiConversationStatus" AS ENUM ('ACTIVE', 'ESCALATED', 'CLOSED');

-- CreateEnum
CREATE TYPE "AiMessageRole" AS ENUM ('AGENT', 'CONTACT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "AiActionStatus" AS ENUM ('PROPOSED', 'EXECUTED', 'REQUIRES_APPROVAL', 'REJECTED');

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nmlsId" TEXT,
    "status" "OrgStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "branches" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "addressLine1" TEXT,
    "addressLine2" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "branches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "name" TEXT,
    "image" TEXT,
    "hashedPassword" TEXT,
    "nmlsId" TEXT,
    "mfaSecret" TEXT,
    "mfaEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "activeOrganizationId" TEXT,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_tokens" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "invites" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "branchId" TEXT,
    "teamId" TEXT,
    "email" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "status" "InviteStatus" NOT NULL DEFAULT 'PENDING',
    "sentByUserId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" "RoleName" NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" "PermissionAction" NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "org_memberships" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "branchId" TEXT,
    "teamId" TEXT,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "org_memberships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "contactType" "ContactType" NOT NULL DEFAULT 'LEAD',
    "leadSource" TEXT,
    "leadScore" INTEGER,
    "ownerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_communication_preferences" (
    "id" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "smsOptIn" BOOLEAN NOT NULL DEFAULT false,
    "emailOptIn" BOOLEAN NOT NULL DEFAULT false,
    "doNotCall" BOOLEAN NOT NULL DEFAULT false,
    "preferredChannel" "PreferredChannel",
    "optInTimestamp" TIMESTAMP(3),
    "optInSource" TEXT,
    "optOutTimestamp" TIMESTAMP(3),

    CONSTRAINT "contact_communication_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partner_companies" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "companyType" "PartnerCompanyType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partner_companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "partners" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "partnerType" "PartnerType" NOT NULL,
    "partnerCompanyId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "partners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pipelines" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pipelines_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pipeline_stages" (
    "id" TEXT NOT NULL,
    "pipelineId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "stageCategory" "PipelineStageCategory" NOT NULL,
    "isSystemDefault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "pipeline_stages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stage_automation_rules" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "pipelineStageId" TEXT NOT NULL,
    "triggerEvent" TEXT NOT NULL,
    "action" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stage_automation_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stage_history" (
    "id" TEXT NOT NULL,
    "loanFileId" TEXT NOT NULL,
    "fromStageId" TEXT,
    "toStageId" TEXT NOT NULL,
    "changedByType" "StageActorType" NOT NULL DEFAULT 'USER',
    "changedByUserId" TEXT,
    "changedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stage_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_files" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "subjectPropertyId" TEXT,
    "pipelineId" TEXT NOT NULL,
    "pipelineStageId" TEXT NOT NULL,
    "currentStageEnteredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "loanOfficerId" TEXT,
    "processorId" TEXT,
    "partnerId" TEXT,
    "status" "LoanFileStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "acknowledgments" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "loan_files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject_properties" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "propertyType" "PropertyType" NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "county" TEXT,
    "landOwnership" "LandOwnership" NOT NULL DEFAULT 'OTHER',
    "occupancyType" "OccupancyType" NOT NULL,
    "estimatedValue" INTEGER,
    "purchasePrice" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subject_properties_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manufactured_home_details" (
    "id" TEXT NOT NULL,
    "subjectPropertyId" TEXT NOT NULL,
    "year" INTEGER,
    "make" TEXT,
    "model" TEXT,
    "serialNumber" TEXT,
    "vin" TEXT,
    "sizeSqFt" INTEGER,
    "widthFt" INTEGER,
    "lengthFt" INTEGER,
    "bedrooms" INTEGER,
    "bathrooms" DECIMAL(3,1),
    "sectionCount" INTEGER,
    "sectionType" "SectionType",

    CONSTRAINT "manufactured_home_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hud_labels" (
    "id" TEXT NOT NULL,
    "manufacturedHomeDetailId" TEXT NOT NULL,
    "labelNumber" TEXT NOT NULL,

    CONSTRAINT "hud_labels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "park_details" (
    "id" TEXT NOT NULL,
    "manufacturedHomeDetailId" TEXT NOT NULL,
    "parkName" TEXT NOT NULL,
    "parkAddressLine1" TEXT,
    "parkAddressLine2" TEXT,
    "parkCity" TEXT,
    "parkState" TEXT,
    "parkZip" TEXT,
    "parkManagerName" TEXT,
    "parkManagerPhone" TEXT,
    "parkManagerEmail" TEXT,
    "lotNumber" TEXT,
    "lotRentMonthly" INTEGER,
    "parkApprovalStatus" "ParkApprovalStatus" NOT NULL DEFAULT 'NOT_REQUESTED',
    "parkApprovalDate" TIMESTAMP(3),
    "parkRulesDocumentId" TEXT,
    "parkContactNotes" TEXT,

    CONSTRAINT "park_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "loan_terms" (
    "id" TEXT NOT NULL,
    "loanFileId" TEXT NOT NULL,
    "loanProductType" "LoanProductType" NOT NULL,
    "loanPurpose" "LoanPurpose" NOT NULL,
    "loanAmount" INTEGER,
    "amortizationType" "AmortizationType",
    "loanTermMonths" INTEGER,
    "interestRateBps" INTEGER,
    "qualifyingFrontDti" DECIMAL(5,2),
    "qualifyingBackDti" DECIMAL(5,2),
    "mortgageType" TEXT,
    "projectType" TEXT,
    "titleType" TEXT,
    "communityPropertyState" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "loan_terms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "other_new_mortgages" (
    "id" TEXT NOT NULL,
    "loanTermsId" TEXT NOT NULL,
    "creditorName" TEXT NOT NULL,
    "lienType" TEXT,
    "monthlyPayment" INTEGER,
    "amount" INTEGER,

    CONSTRAINT "other_new_mortgages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applicants" (
    "id" TEXT NOT NULL,
    "loanFileId" TEXT NOT NULL,
    "contactId" TEXT,
    "applicantType" "ApplicantType" NOT NULL,
    "legalFirstName" TEXT NOT NULL,
    "middleName" TEXT,
    "lastName" TEXT NOT NULL,
    "suffix" TEXT,
    "ssnEncrypted" TEXT,
    "dob" TIMESTAMP(3),
    "citizenship" "Citizenship",
    "maritalStatus" "MaritalStatus",
    "phone" TEXT,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "applicants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dependents" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "ageAtApplication" INTEGER NOT NULL,
    "relationship" TEXT,

    CONSTRAINT "dependents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "residence_history" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "residencyBasis" "ResidencyBasis" NOT NULL,
    "durationMonths" INTEGER NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "residence_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employment" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "employerName" TEXT NOT NULL,
    "addressLine1" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "position" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT true,
    "isSelfEmployed" BOOLEAN NOT NULL DEFAULT false,
    "ownershipPercent" DECIMAL(5,2),
    "monthlyIncome" INTEGER,

    CONSTRAINT "employment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "self_employment_details" (
    "id" TEXT NOT NULL,
    "employmentId" TEXT NOT NULL,
    "businessName" TEXT NOT NULL,
    "businessStructure" "BusinessStructure" NOT NULL,
    "monthlyIncomeOrLoss" INTEGER,
    "isLoss" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "self_employment_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "other_income" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "incomeType" "OtherIncomeType" NOT NULL,
    "monthlyAmount" INTEGER NOT NULL,

    CONSTRAINT "other_income_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assets" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "assetType" "AssetType" NOT NULL,
    "institutionName" TEXT,
    "accountNumberMasked" TEXT,
    "cashOrMarketValue" INTEGER NOT NULL,

    CONSTRAINT "assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gift_details" (
    "id" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "donorName" TEXT NOT NULL,
    "donorRelationship" TEXT NOT NULL,
    "deposited" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "gift_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "liabilities" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "liabilityType" "LiabilityType" NOT NULL,
    "creditorName" TEXT NOT NULL,
    "accountNumberMasked" TEXT,
    "monthlyPayment" INTEGER NOT NULL,
    "unpaidBalance" INTEGER NOT NULL,
    "willBePaidOffAtClosing" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "liabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "real_estate_owned" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "propertyType" "PropertyType" NOT NULL,
    "status" "ReoStatus" NOT NULL,
    "occupancyType" "OccupancyType" NOT NULL,
    "marketValue" INTEGER,
    "mortgageBalance" INTEGER,
    "monthlyRentalIncome" INTEGER,
    "monthlyExpense" INTEGER,
    "liabilityId" TEXT,

    CONSTRAINT "real_estate_owned_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "declarations" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "questionCode" TEXT NOT NULL,
    "answer" BOOLEAN NOT NULL,
    "explanation" TEXT,

    CONSTRAINT "declarations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "declaration_questions" (
    "code" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "declaration_questions_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "military_service" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "served" BOOLEAN NOT NULL DEFAULT false,
    "branch" TEXT,
    "serviceType" "MilitaryServiceType" NOT NULL DEFAULT 'NONE',
    "expectedCompletionDate" TIMESTAMP(3),

    CONSTRAINT "military_service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demographic_info" (
    "id" TEXT NOT NULL,
    "applicantId" TEXT NOT NULL,
    "sex" "Sex" NOT NULL DEFAULT 'NOT_PROVIDED',
    "collectionMethod" "CollectionMethod",
    "applicantDidNotWish" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "demographic_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demographic_race_details" (
    "id" TEXT NOT NULL,
    "demographicInfoId" TEXT NOT NULL,
    "raceCode" TEXT NOT NULL,
    "subCategory" TEXT,

    CONSTRAINT "demographic_race_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demographic_ethnicity_details" (
    "id" TEXT NOT NULL,
    "demographicInfoId" TEXT NOT NULL,
    "ethnicityCode" TEXT NOT NULL,
    "subCategory" TEXT,

    CONSTRAINT "demographic_ethnicity_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conditions" (
    "id" TEXT NOT NULL,
    "loanFileId" TEXT NOT NULL,
    "category" "ConditionCategory" NOT NULL,
    "description" TEXT NOT NULL,
    "status" "ConditionStatus" NOT NULL DEFAULT 'OPEN',
    "dueDate" TIMESTAMP(3),
    "satisfiedDocumentId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "conditions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "underwriting_decisions" (
    "id" TEXT NOT NULL,
    "loanFileId" TEXT NOT NULL,
    "decision" TEXT,
    "decidedByUserId" TEXT,
    "decidedAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "underwriting_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "closing_details" (
    "id" TEXT NOT NULL,
    "loanFileId" TEXT NOT NULL,
    "closingDate" TIMESTAMP(3),
    "fundingDate" TIMESTAMP(3),
    "titleCompany" TEXT,
    "closingDisclosureSentDate" TIMESTAMP(3),
    "docsOutDate" TIMESTAMP(3),
    "signingDate" TIMESTAMP(3),

    CONSTRAINT "closing_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_types" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT,
    "code" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "category" "DocumentCategory" NOT NULL,
    "requiresVersioning" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "document_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_requests" (
    "id" TEXT NOT NULL,
    "loanFileId" TEXT NOT NULL,
    "documentTypeId" TEXT NOT NULL,
    "requestedByUserId" TEXT NOT NULL,
    "status" "DocumentRequestStatus" NOT NULL DEFAULT 'REQUESTED',
    "dueDate" TIMESTAMP(3),
    "satisfiesConditionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "loanFileId" TEXT,
    "contactId" TEXT,
    "documentTypeId" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "originalFilename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "status" "DocStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "virusScanStatus" "VirusScanStatus" NOT NULL DEFAULT 'PENDING',
    "uploadedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_versions" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "document_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_access" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "grantedToUserId" TEXT NOT NULL,
    "grantedByUserId" TEXT NOT NULL,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),

    CONSTRAINT "document_access_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "document_audits" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "actorId" TEXT,
    "actorType" "StageActorType" NOT NULL DEFAULT 'USER',
    "action" "DocumentAuditAction" NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" TEXT,

    CONSTRAINT "document_audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tasks" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "assigneeId" TEXT,
    "relatedType" "RelatedEntityType" NOT NULL,
    "relatedId" TEXT NOT NULL,
    "loanFileId" TEXT,
    "title" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3),
    "status" "TaskStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tasks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "actorType" "ActorType" NOT NULL DEFAULT 'USER',
    "actorId" TEXT,
    "relatedType" "RelatedEntityType" NOT NULL,
    "relatedId" TEXT NOT NULL,
    "loanFileId" TEXT,
    "activityType" TEXT NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunities" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "ownerId" TEXT,
    "opportunityType" "OpportunityType" NOT NULL,
    "source" "OpportunitySource" NOT NULL,
    "status" "OpportunityStatus" NOT NULL DEFAULT 'OPEN',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "communications" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "loanFileId" TEXT,
    "channel" "CommunicationChannel" NOT NULL,
    "direction" "CommunicationDirection" NOT NULL,
    "senderType" "SenderType" NOT NULL DEFAULT 'USER',
    "senderId" TEXT,
    "campaignId" TEXT,
    "body" TEXT,
    "status" "CommunicationStatus" NOT NULL DEFAULT 'QUEUED',
    "providerMessageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "communications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaigns" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "CampaignStatus" NOT NULL DEFAULT 'DRAFT',
    "createdBy" "CampaignCreatedBy" NOT NULL DEFAULT 'USER',
    "createdByUserId" TEXT,
    "approvedByUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_steps" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "channel" "CommunicationChannel" NOT NULL,
    "delayHours" INTEGER NOT NULL DEFAULT 0,
    "content" TEXT,
    "conditions" JSONB,

    CONSTRAINT "campaign_steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "campaign_enrollments" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "status" "CampaignEnrollmentStatus" NOT NULL DEFAULT 'ENROLLED',
    "currentStep" INTEGER NOT NULL DEFAULT 0,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stoppedAt" TIMESTAMP(3),

    CONSTRAINT "campaign_enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_agents" (
    "id" TEXT NOT NULL,
    "name" "AiAgentName" NOT NULL,
    "systemPrompt" TEXT NOT NULL,
    "allowedTools" TEXT[],
    "guardrailPolicyId" TEXT,
    "modelId" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ai_agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_conversations" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,
    "agentId" TEXT NOT NULL,
    "status" "AiConversationStatus" NOT NULL DEFAULT 'ACTIVE',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_messages" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "role" "AiMessageRole" NOT NULL,
    "content" TEXT NOT NULL,
    "toolCalls" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ai_actions" (
    "id" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "actionType" TEXT NOT NULL,
    "payload" JSONB,
    "status" "AiActionStatus" NOT NULL DEFAULT 'PROPOSED',
    "executedAt" TIMESTAMP(3),

    CONSTRAINT "ai_actions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "organizationId" TEXT NOT NULL,
    "actorId" TEXT,
    "actorType" "ActorType" NOT NULL DEFAULT 'USER',
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "ipAddress" TEXT,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "branches_organizationId_idx" ON "branches"("organizationId");

-- CreateIndex
CREATE INDEX "teams_branchId_idx" ON "teams"("branchId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_provider_providerAccountId_key" ON "accounts"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "sessions_sessionToken_key" ON "sessions"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_token_key" ON "verification_tokens"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "verification_tokens"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "invites_token_key" ON "invites"("token");

-- CreateIndex
CREATE INDEX "invites_organizationId_idx" ON "invites"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_resource_action_key" ON "permissions"("resource", "action");

-- CreateIndex
CREATE INDEX "org_memberships_organizationId_idx" ON "org_memberships"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "org_memberships_userId_organizationId_key" ON "org_memberships"("userId", "organizationId");

-- CreateIndex
CREATE INDEX "contacts_organizationId_idx" ON "contacts"("organizationId");

-- CreateIndex
CREATE INDEX "contacts_organizationId_email_idx" ON "contacts"("organizationId", "email");

-- CreateIndex
CREATE INDEX "contacts_organizationId_phone_idx" ON "contacts"("organizationId", "phone");

-- CreateIndex
CREATE UNIQUE INDEX "contact_communication_preferences_contactId_key" ON "contact_communication_preferences"("contactId");

-- CreateIndex
CREATE INDEX "partner_companies_organizationId_idx" ON "partner_companies"("organizationId");

-- CreateIndex
CREATE INDEX "partners_organizationId_idx" ON "partners"("organizationId");

-- CreateIndex
CREATE INDEX "pipelines_organizationId_idx" ON "pipelines"("organizationId");

-- CreateIndex
CREATE INDEX "pipeline_stages_pipelineId_idx" ON "pipeline_stages"("pipelineId");

-- CreateIndex
CREATE INDEX "stage_automation_rules_organizationId_idx" ON "stage_automation_rules"("organizationId");

-- CreateIndex
CREATE INDEX "stage_history_loanFileId_idx" ON "stage_history"("loanFileId");

-- CreateIndex
CREATE UNIQUE INDEX "loan_files_subjectPropertyId_key" ON "loan_files"("subjectPropertyId");

-- CreateIndex
CREATE INDEX "loan_files_organizationId_idx" ON "loan_files"("organizationId");

-- CreateIndex
CREATE INDEX "loan_files_organizationId_pipelineStageId_idx" ON "loan_files"("organizationId", "pipelineStageId");

-- CreateIndex
CREATE INDEX "subject_properties_organizationId_idx" ON "subject_properties"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "manufactured_home_details_subjectPropertyId_key" ON "manufactured_home_details"("subjectPropertyId");

-- CreateIndex
CREATE INDEX "hud_labels_manufacturedHomeDetailId_idx" ON "hud_labels"("manufacturedHomeDetailId");

-- CreateIndex
CREATE UNIQUE INDEX "park_details_manufacturedHomeDetailId_key" ON "park_details"("manufacturedHomeDetailId");

-- CreateIndex
CREATE UNIQUE INDEX "loan_terms_loanFileId_key" ON "loan_terms"("loanFileId");

-- CreateIndex
CREATE INDEX "applicants_loanFileId_idx" ON "applicants"("loanFileId");

-- CreateIndex
CREATE INDEX "dependents_applicantId_idx" ON "dependents"("applicantId");

-- CreateIndex
CREATE INDEX "residence_history_applicantId_idx" ON "residence_history"("applicantId");

-- CreateIndex
CREATE INDEX "employment_applicantId_idx" ON "employment"("applicantId");

-- CreateIndex
CREATE UNIQUE INDEX "self_employment_details_employmentId_key" ON "self_employment_details"("employmentId");

-- CreateIndex
CREATE INDEX "other_income_applicantId_idx" ON "other_income"("applicantId");

-- CreateIndex
CREATE INDEX "assets_applicantId_idx" ON "assets"("applicantId");

-- CreateIndex
CREATE UNIQUE INDEX "gift_details_assetId_key" ON "gift_details"("assetId");

-- CreateIndex
CREATE INDEX "liabilities_applicantId_idx" ON "liabilities"("applicantId");

-- CreateIndex
CREATE INDEX "real_estate_owned_applicantId_idx" ON "real_estate_owned"("applicantId");

-- CreateIndex
CREATE INDEX "declarations_applicantId_idx" ON "declarations"("applicantId");

-- CreateIndex
CREATE UNIQUE INDEX "military_service_applicantId_key" ON "military_service"("applicantId");

-- CreateIndex
CREATE UNIQUE INDEX "demographic_info_applicantId_key" ON "demographic_info"("applicantId");

-- CreateIndex
CREATE INDEX "demographic_race_details_demographicInfoId_idx" ON "demographic_race_details"("demographicInfoId");

-- CreateIndex
CREATE INDEX "demographic_ethnicity_details_demographicInfoId_idx" ON "demographic_ethnicity_details"("demographicInfoId");

-- CreateIndex
CREATE INDEX "conditions_loanFileId_idx" ON "conditions"("loanFileId");

-- CreateIndex
CREATE UNIQUE INDEX "underwriting_decisions_loanFileId_key" ON "underwriting_decisions"("loanFileId");

-- CreateIndex
CREATE UNIQUE INDEX "closing_details_loanFileId_key" ON "closing_details"("loanFileId");

-- CreateIndex
CREATE UNIQUE INDEX "document_types_organizationId_code_key" ON "document_types"("organizationId", "code");

-- CreateIndex
CREATE INDEX "document_requests_loanFileId_idx" ON "document_requests"("loanFileId");

-- CreateIndex
CREATE UNIQUE INDEX "documents_storageKey_key" ON "documents"("storageKey");

-- CreateIndex
CREATE INDEX "documents_organizationId_idx" ON "documents"("organizationId");

-- CreateIndex
CREATE INDEX "documents_loanFileId_idx" ON "documents"("loanFileId");

-- CreateIndex
CREATE INDEX "document_versions_documentId_idx" ON "document_versions"("documentId");

-- CreateIndex
CREATE INDEX "document_access_documentId_idx" ON "document_access"("documentId");

-- CreateIndex
CREATE INDEX "document_audits_documentId_idx" ON "document_audits"("documentId");

-- CreateIndex
CREATE INDEX "tasks_organizationId_idx" ON "tasks"("organizationId");

-- CreateIndex
CREATE INDEX "tasks_organizationId_relatedType_relatedId_idx" ON "tasks"("organizationId", "relatedType", "relatedId");

-- CreateIndex
CREATE INDEX "activities_organizationId_idx" ON "activities"("organizationId");

-- CreateIndex
CREATE INDEX "activities_organizationId_relatedType_relatedId_idx" ON "activities"("organizationId", "relatedType", "relatedId");

-- CreateIndex
CREATE INDEX "opportunities_organizationId_idx" ON "opportunities"("organizationId");

-- CreateIndex
CREATE INDEX "communications_organizationId_idx" ON "communications"("organizationId");

-- CreateIndex
CREATE INDEX "communications_contactId_idx" ON "communications"("contactId");

-- CreateIndex
CREATE INDEX "campaigns_organizationId_idx" ON "campaigns"("organizationId");

-- CreateIndex
CREATE INDEX "campaign_steps_campaignId_idx" ON "campaign_steps"("campaignId");

-- CreateIndex
CREATE INDEX "campaign_enrollments_campaignId_idx" ON "campaign_enrollments"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "ai_agents_name_key" ON "ai_agents"("name");

-- CreateIndex
CREATE INDEX "ai_conversations_organizationId_idx" ON "ai_conversations"("organizationId");

-- CreateIndex
CREATE INDEX "ai_messages_conversationId_idx" ON "ai_messages"("conversationId");

-- CreateIndex
CREATE INDEX "ai_actions_conversationId_idx" ON "ai_actions"("conversationId");

-- CreateIndex
CREATE INDEX "audit_logs_organizationId_idx" ON "audit_logs"("organizationId");

-- CreateIndex
CREATE INDEX "audit_logs_organizationId_entityType_entityId_idx" ON "audit_logs"("organizationId", "entityType", "entityId");

-- AddForeignKey
ALTER TABLE "branches" ADD CONSTRAINT "branches_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_sentByUserId_fkey" FOREIGN KEY ("sentByUserId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invites" ADD CONSTRAINT "invites_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_memberships" ADD CONSTRAINT "org_memberships_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_memberships" ADD CONSTRAINT "org_memberships_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_memberships" ADD CONSTRAINT "org_memberships_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "branches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_memberships" ADD CONSTRAINT "org_memberships_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "org_memberships" ADD CONSTRAINT "org_memberships_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contacts" ADD CONSTRAINT "contacts_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contact_communication_preferences" ADD CONSTRAINT "contact_communication_preferences_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partner_companies" ADD CONSTRAINT "partner_companies_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "partners" ADD CONSTRAINT "partners_partnerCompanyId_fkey" FOREIGN KEY ("partnerCompanyId") REFERENCES "partner_companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pipelines" ADD CONSTRAINT "pipelines_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pipeline_stages" ADD CONSTRAINT "pipeline_stages_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "pipelines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stage_automation_rules" ADD CONSTRAINT "stage_automation_rules_pipelineStageId_fkey" FOREIGN KEY ("pipelineStageId") REFERENCES "pipeline_stages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stage_history" ADD CONSTRAINT "stage_history_loanFileId_fkey" FOREIGN KEY ("loanFileId") REFERENCES "loan_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stage_history" ADD CONSTRAINT "stage_history_fromStageId_fkey" FOREIGN KEY ("fromStageId") REFERENCES "pipeline_stages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stage_history" ADD CONSTRAINT "stage_history_toStageId_fkey" FOREIGN KEY ("toStageId") REFERENCES "pipeline_stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_files" ADD CONSTRAINT "loan_files_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_files" ADD CONSTRAINT "loan_files_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_files" ADD CONSTRAINT "loan_files_subjectPropertyId_fkey" FOREIGN KEY ("subjectPropertyId") REFERENCES "subject_properties"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_files" ADD CONSTRAINT "loan_files_pipelineId_fkey" FOREIGN KEY ("pipelineId") REFERENCES "pipelines"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_files" ADD CONSTRAINT "loan_files_pipelineStageId_fkey" FOREIGN KEY ("pipelineStageId") REFERENCES "pipeline_stages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_files" ADD CONSTRAINT "loan_files_loanOfficerId_fkey" FOREIGN KEY ("loanOfficerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_files" ADD CONSTRAINT "loan_files_processorId_fkey" FOREIGN KEY ("processorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_files" ADD CONSTRAINT "loan_files_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "partners"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "manufactured_home_details" ADD CONSTRAINT "manufactured_home_details_subjectPropertyId_fkey" FOREIGN KEY ("subjectPropertyId") REFERENCES "subject_properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hud_labels" ADD CONSTRAINT "hud_labels_manufacturedHomeDetailId_fkey" FOREIGN KEY ("manufacturedHomeDetailId") REFERENCES "manufactured_home_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "park_details" ADD CONSTRAINT "park_details_manufacturedHomeDetailId_fkey" FOREIGN KEY ("manufacturedHomeDetailId") REFERENCES "manufactured_home_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "loan_terms" ADD CONSTRAINT "loan_terms_loanFileId_fkey" FOREIGN KEY ("loanFileId") REFERENCES "loan_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "other_new_mortgages" ADD CONSTRAINT "other_new_mortgages_loanTermsId_fkey" FOREIGN KEY ("loanTermsId") REFERENCES "loan_terms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_loanFileId_fkey" FOREIGN KEY ("loanFileId") REFERENCES "loan_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applicants" ADD CONSTRAINT "applicants_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dependents" ADD CONSTRAINT "dependents_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "residence_history" ADD CONSTRAINT "residence_history_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employment" ADD CONSTRAINT "employment_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "self_employment_details" ADD CONSTRAINT "self_employment_details_employmentId_fkey" FOREIGN KEY ("employmentId") REFERENCES "employment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "other_income" ADD CONSTRAINT "other_income_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "assets" ADD CONSTRAINT "assets_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gift_details" ADD CONSTRAINT "gift_details_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "assets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "liabilities" ADD CONSTRAINT "liabilities_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "real_estate_owned" ADD CONSTRAINT "real_estate_owned_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "real_estate_owned" ADD CONSTRAINT "real_estate_owned_liabilityId_fkey" FOREIGN KEY ("liabilityId") REFERENCES "liabilities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "declarations" ADD CONSTRAINT "declarations_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "military_service" ADD CONSTRAINT "military_service_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demographic_info" ADD CONSTRAINT "demographic_info_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "applicants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demographic_race_details" ADD CONSTRAINT "demographic_race_details_demographicInfoId_fkey" FOREIGN KEY ("demographicInfoId") REFERENCES "demographic_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "demographic_ethnicity_details" ADD CONSTRAINT "demographic_ethnicity_details_demographicInfoId_fkey" FOREIGN KEY ("demographicInfoId") REFERENCES "demographic_info"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conditions" ADD CONSTRAINT "conditions_loanFileId_fkey" FOREIGN KEY ("loanFileId") REFERENCES "loan_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "conditions" ADD CONSTRAINT "conditions_satisfiedDocumentId_fkey" FOREIGN KEY ("satisfiedDocumentId") REFERENCES "documents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "underwriting_decisions" ADD CONSTRAINT "underwriting_decisions_loanFileId_fkey" FOREIGN KEY ("loanFileId") REFERENCES "loan_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "closing_details" ADD CONSTRAINT "closing_details_loanFileId_fkey" FOREIGN KEY ("loanFileId") REFERENCES "loan_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_types" ADD CONSTRAINT "document_types_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_requests" ADD CONSTRAINT "document_requests_loanFileId_fkey" FOREIGN KEY ("loanFileId") REFERENCES "loan_files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_requests" ADD CONSTRAINT "document_requests_documentTypeId_fkey" FOREIGN KEY ("documentTypeId") REFERENCES "document_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_loanFileId_fkey" FOREIGN KEY ("loanFileId") REFERENCES "loan_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_documentTypeId_fkey" FOREIGN KEY ("documentTypeId") REFERENCES "document_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_uploadedByUserId_fkey" FOREIGN KEY ("uploadedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_versions" ADD CONSTRAINT "document_versions_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_access" ADD CONSTRAINT "document_access_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_audits" ADD CONSTRAINT "document_audits_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "document_audits" ADD CONSTRAINT "document_audits_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tasks" ADD CONSTRAINT "tasks_loanFileId_fkey" FOREIGN KEY ("loanFileId") REFERENCES "loan_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_loanFileId_fkey" FOREIGN KEY ("loanFileId") REFERENCES "loan_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "opportunities" ADD CONSTRAINT "opportunities_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_loanFileId_fkey" FOREIGN KEY ("loanFileId") REFERENCES "loan_files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "communications" ADD CONSTRAINT "communications_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_createdByUserId_fkey" FOREIGN KEY ("createdByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaigns" ADD CONSTRAINT "campaigns_approvedByUserId_fkey" FOREIGN KEY ("approvedByUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_steps" ADD CONSTRAINT "campaign_steps_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "campaign_enrollments" ADD CONSTRAINT "campaign_enrollments_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "ai_agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_messages" ADD CONSTRAINT "ai_messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ai_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ai_actions" ADD CONSTRAINT "ai_actions_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "ai_conversations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
