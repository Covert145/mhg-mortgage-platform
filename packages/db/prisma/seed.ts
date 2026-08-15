/**
 * Phase 1 reference-data seed: roles, permissions, the declaration question
 * set, and — for local development / e2e testing only — one demo
 * organization with a default pipeline, document types, and one seeded user
 * per role. See docs/architecture/phase-1-implementation-spec.md #14/#15.
 *
 * Synthetic data only. No production mortgage or borrower data.
 */
import { hash } from "bcryptjs";
import {
  PrismaClient,
  RoleName,
  PermissionAction,
  PipelineStageCategory,
  DocumentCategory,
} from "@prisma/client";

const prisma = new PrismaClient();

const ROLE_NAMES = Object.values(RoleName);

/**
 * Role -> permission capability mapping, translating the initial
 * role/permission matrix in docs/architecture/security-architecture.md #2
 * into resource/action rows. "MANAGE" implies view/create/edit/delete for
 * that resource; scope (own/team/org) is enforced in packages/auth at
 * request time, not encoded in the permission row itself.
 */
const RESOURCES = [
  "organization",
  "users",
  "contacts",
  "loanFiles",
  "underwriting",
  "pipeline",
  "communications",
  "documents",
  "reporting",
  "campaigns",
  "auditLog",
] as const;

const ROLE_PERMISSIONS: Record<RoleName, { resource: string; action: PermissionAction }[]> = {
  PLATFORM_ADMIN: RESOURCES.map((resource) => ({ resource, action: PermissionAction.MANAGE })),
  COMPANY_ADMIN: RESOURCES.filter((r) => r !== "underwriting" || true).map((resource) => ({
    resource,
    action: PermissionAction.MANAGE,
  })),
  MANAGER: [
    { resource: "users", action: PermissionAction.MANAGE },
    { resource: "contacts", action: PermissionAction.MANAGE },
    { resource: "loanFiles", action: PermissionAction.MANAGE },
    { resource: "communications", action: PermissionAction.MANAGE },
    { resource: "documents", action: PermissionAction.MANAGE },
    { resource: "reporting", action: PermissionAction.VIEW },
    { resource: "campaigns", action: PermissionAction.MANAGE },
  ],
  LOAN_OFFICER: [
    { resource: "contacts", action: PermissionAction.MANAGE },
    { resource: "loanFiles", action: PermissionAction.MANAGE },
    { resource: "communications", action: PermissionAction.MANAGE },
    { resource: "documents", action: PermissionAction.MANAGE },
    { resource: "reporting", action: PermissionAction.VIEW },
    { resource: "campaigns", action: PermissionAction.CREATE },
    { resource: "campaigns", action: PermissionAction.EDIT },
  ],
  PROCESSOR: [
    { resource: "loanFiles", action: PermissionAction.EDIT },
    { resource: "loanFiles", action: PermissionAction.VIEW },
    { resource: "communications", action: PermissionAction.CREATE },
    { resource: "documents", action: PermissionAction.MANAGE },
    { resource: "reporting", action: PermissionAction.VIEW },
  ],
  BORROWER: [
    { resource: "loanFiles", action: PermissionAction.VIEW },
    { resource: "communications", action: PermissionAction.CREATE },
    { resource: "documents", action: PermissionAction.CREATE },
    { resource: "documents", action: PermissionAction.VIEW },
  ],
  REALTOR_PARTNER: [
    { resource: "loanFiles", action: PermissionAction.VIEW },
    { resource: "communications", action: PermissionAction.CREATE },
    { resource: "reporting", action: PermissionAction.VIEW },
  ],
};

const DECLARATION_QUESTIONS: { code: string; text: string }[] = [
  { code: "A", text: "Will you occupy the property as your primary residence?" },
  { code: "B", text: "Have you had an ownership interest in another property in the last three years?" },
  { code: "C", text: "Are you a co-signer or guarantor on any debt not disclosed on this application?" },
  { code: "D", text: "Are there any outstanding judgments against you?" },
  { code: "E", text: "Are you currently delinquent or in default on a federal debt?" },
  { code: "F", text: "Are you a party to a lawsuit in which you potentially have a personal financial liability?" },
  { code: "G", text: "Have you conveyed title to any property in lieu of foreclosure in the past 7 years?" },
  { code: "H", text: "Have you completed a pre-foreclosure sale or short sale in the past 7 years?" },
  { code: "I", text: "Have you had property foreclosed upon in the last 7 years?" },
];

const DOCUMENT_TYPES: { code: string; label: string; category: DocumentCategory; requiresVersioning?: boolean }[] = [
  { code: "PAY_STUB", label: "Pay Stub", category: DocumentCategory.BORROWER, requiresVersioning: true },
  { code: "BANK_STATEMENT", label: "Bank Statement", category: DocumentCategory.BORROWER, requiresVersioning: true },
  { code: "TAX_RETURN", label: "Tax Return", category: DocumentCategory.BORROWER },
  { code: "ID_VERIFICATION", label: "Government ID", category: DocumentCategory.BORROWER },
  { code: "HUD_LABEL_PHOTO", label: "HUD Label Photo", category: DocumentCategory.LOAN },
  { code: "PARK_APPROVAL_LETTER", label: "Park Approval Letter", category: DocumentCategory.LOAN },
  { code: "PURCHASE_AGREEMENT", label: "Purchase Agreement", category: DocumentCategory.LOAN },
  { code: "APPRAISAL", label: "Appraisal Report", category: DocumentCategory.UNDERWRITING },
  { code: "CREDIT_REPORT", label: "Credit Report", category: DocumentCategory.UNDERWRITING },
  { code: "CLOSING_DISCLOSURE", label: "Closing Disclosure", category: DocumentCategory.CLOSING },
  { code: "COMPETITOR_LOAN_ESTIMATE", label: "Competitor Loan Estimate (Second Look)", category: DocumentCategory.LOAN },
];

/** Default pipeline stages — docs/architecture/database-schema.md #3. */
const DEFAULT_ACTIVE_STAGES = [
  "New Lead",
  "Attempting Contact",
  "Contacted",
  "Application Sent",
  "Application Started",
  "Documents Requested",
  "Documents Received",
  "Preparing To Submit For Approval",
  "Submitted for Approval",
  "Pre-Approved",
  "Shopping",
  "Offer Accepted",
  "Processing",
  "Submitted to Underwriting",
  "Approved",
  "Clear To Close",
  "Docs Out",
  "Signing",
  "Funded",
  "Post Close",
];

const CLOSED_STAGES: { name: string; category: PipelineStageCategory }[] = [
  { name: "Not Interested", category: PipelineStageCategory.CLOSED_LOST },
  { name: "Denied", category: PipelineStageCategory.CLOSED_LOST },
  { name: "Withdrawn", category: PipelineStageCategory.CLOSED_LOST },
  { name: "Nurture", category: PipelineStageCategory.NURTURE },
  { name: "Dead", category: PipelineStageCategory.CLOSED_LOST },
];

async function seedRolesAndPermissions() {
  const roles = new Map<RoleName, string>();
  for (const name of ROLE_NAMES) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    roles.set(name, role.id);
  }

  const permissionIds = new Map<string, string>();
  for (const resource of RESOURCES) {
    for (const action of Object.values(PermissionAction)) {
      const permission = await prisma.permission.upsert({
        where: { resource_action: { resource, action } },
        update: {},
        create: { resource, action },
      });
      permissionIds.set(`${resource}:${action}`, permission.id);
    }
  }

  for (const [roleName, grants] of Object.entries(ROLE_PERMISSIONS) as [RoleName, typeof ROLE_PERMISSIONS[RoleName]][]) {
    const roleId = roles.get(roleName)!;
    for (const grant of grants) {
      const permissionId = permissionIds.get(`${grant.resource}:${grant.action}`);
      if (!permissionId) continue;
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId, permissionId } },
        update: {},
        create: { roleId, permissionId },
      });
    }
  }

  return roles;
}

async function seedDeclarationQuestions() {
  for (const q of DECLARATION_QUESTIONS) {
    await prisma.declarationQuestion.upsert({
      where: { code: q.code },
      update: { text: q.text },
      create: q,
    });
  }
}

async function seedDemoOrganization(roles: Map<RoleName, string>) {
  const org = await prisma.organization.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Mobile Home Guy (Dev)",
      nmlsId: "0000000",
    },
  });

  const branch = await prisma.branch.upsert({
    where: { id: "00000000-0000-0000-0000-000000000002" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000002",
      organizationId: org.id,
      name: "Main Branch",
    },
  });

  const team = await prisma.team.upsert({
    where: { id: "00000000-0000-0000-0000-000000000003" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000003",
      branchId: branch.id,
      name: "Default Team",
    },
  });

  const pipeline = await prisma.pipeline.upsert({
    where: { id: "00000000-0000-0000-0000-000000000004" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000004",
      organizationId: org.id,
      name: "Default Pipeline",
      isDefault: true,
    },
  });

  const existingStages = await prisma.pipelineStage.count({ where: { pipelineId: pipeline.id } });
  if (existingStages === 0) {
    let sortOrder = 0;
    for (const name of DEFAULT_ACTIVE_STAGES) {
      await prisma.pipelineStage.create({
        data: {
          pipelineId: pipeline.id,
          name,
          sortOrder: sortOrder++,
          stageCategory: PipelineStageCategory.ACTIVE,
          isSystemDefault: true,
        },
      });
    }
    for (const stage of CLOSED_STAGES) {
      await prisma.pipelineStage.create({
        data: {
          pipelineId: pipeline.id,
          name: stage.name,
          sortOrder: sortOrder++,
          stageCategory: stage.category,
          isSystemDefault: true,
        },
      });
    }
  }

  for (const docType of DOCUMENT_TYPES) {
    await prisma.documentType.upsert({
      where: { organizationId_code: { organizationId: org.id, code: docType.code } },
      update: {},
      create: { ...docType, organizationId: org.id },
    });
  }

  const devPasswordHash = await hash("DevPassword123!", 10);
  const seedUsers: { email: string; name: string; role: RoleName; branchId?: string; teamId?: string }[] = [
    { email: "platform-admin@dev.mhg.internal", name: "Dev Platform Admin", role: "PLATFORM_ADMIN" },
    { email: "company-admin@dev.mhg.internal", name: "Dev Company Admin", role: "COMPANY_ADMIN" },
    { email: "manager@dev.mhg.internal", name: "Dev Manager", role: "MANAGER", branchId: branch.id, teamId: team.id },
    { email: "loan-officer@dev.mhg.internal", name: "Dev Loan Officer", role: "LOAN_OFFICER", branchId: branch.id, teamId: team.id },
    { email: "processor@dev.mhg.internal", name: "Dev Processor", role: "PROCESSOR", branchId: branch.id, teamId: team.id },
    { email: "borrower@dev.mhg.internal", name: "Dev Borrower", role: "BORROWER" },
    { email: "realtor@dev.mhg.internal", name: "Dev Realtor Partner", role: "REALTOR_PARTNER" },
  ];

  for (const seedUser of seedUsers) {
    const user = await prisma.user.upsert({
      where: { email: seedUser.email },
      update: {},
      create: {
        email: seedUser.email,
        name: seedUser.name,
        hashedPassword: devPasswordHash,
        emailVerified: new Date(),
      },
    });

    await prisma.orgMembership.upsert({
      where: { userId_organizationId: { userId: user.id, organizationId: org.id } },
      update: {},
      create: {
        userId: user.id,
        organizationId: org.id,
        branchId: seedUser.branchId,
        teamId: seedUser.teamId,
        roleId: roles.get(seedUser.role)!,
      },
    });
  }

  return { org, pipeline };
}

async function main() {
  console.log("Seeding roles and permissions...");
  const roles = await seedRolesAndPermissions();

  console.log("Seeding declaration question set...");
  await seedDeclarationQuestions();

  console.log("Seeding demo organization (dev/test only, synthetic data)...");
  await seedDemoOrganization(roles);

  console.log("Seed complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
