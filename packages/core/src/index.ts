export { withOrgScope, withPlatformScope } from "./scope";
export type { ScopedClient } from "./scope";
export { requireOrgPermission, requirePlatformAdmin } from "./guards";
export type { CallerMembership } from "./guards";

export { writeAuditLog, getAuditLogForOrg } from "./services/audit";
export type { AuditLogEntry, AuditLogDto } from "./services/audit";

export { createOrganization, createOrganizationInput } from "./services/organization";
export type { CreateOrganizationInput, OrganizationDto } from "./services/organization";

export { inviteUser, acceptInvite, inviteUserInput, acceptInviteInput } from "./services/invite";
export type { InviteUserInput, InviteDto, AcceptInviteInput, AcceptInviteResult } from "./services/invite";

export { assignOrgMembership, assignOrgMembershipInput } from "./services/membership";
export type { AssignOrgMembershipInput, OrgMembershipDto } from "./services/membership";

export { createContact, createPublicLead, getContact, createContactInput } from "./services/contact";
export type { CreateContactInput } from "./services/contact";

export { getCallerRole } from "./services/role";

export { toContactDto } from "./dto/contact";
export type { ContactInternalDto, ContactExternalDto, ContactRecord } from "./dto/contact";
