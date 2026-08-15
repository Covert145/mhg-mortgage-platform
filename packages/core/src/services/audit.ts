import { ActorType, PermissionAction } from "@mhg/db";
import type { SessionContext } from "@mhg/auth";
import type { ScopedClient } from "../scope";
import { requireOrgPermission } from "../guards";

export interface AuditLogEntry {
  organizationId: string;
  actorId?: string;
  actorType?: ActorType;
  action: string;
  entityType: string;
  entityId: string;
  before?: unknown;
  after?: unknown;
  ipAddress?: string;
}

/**
 * Every mutating service function in this package calls this at the end of
 * its transaction — audit logging is not left to individual callers to
 * remember. See docs/architecture/security-architecture.md #3.
 */
export async function writeAuditLog(tx: ScopedClient, entry: AuditLogEntry): Promise<void> {
  await tx.auditLog.create({
    data: {
      organizationId: entry.organizationId,
      actorId: entry.actorId,
      actorType: entry.actorType ?? ActorType.USER,
      action: entry.action,
      entityType: entry.entityType,
      entityId: entry.entityId,
      before: entry.before === undefined ? undefined : (entry.before as object),
      after: entry.after === undefined ? undefined : (entry.after as object),
      ipAddress: entry.ipAddress,
    },
  });
}

export interface AuditLogDto {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  actorId: string | null;
  actorType: ActorType;
  timestamp: Date;
}

/** admin-only: docs/architecture/security-architecture.md #2. */
export async function getAuditLogForOrg(session: SessionContext, limit = 50): Promise<AuditLogDto[]> {
  return requireOrgPermission(session, "auditLog", PermissionAction.VIEW, async (tx) => {
    const rows = await tx.auditLog.findMany({
      where: { organizationId: session.activeOrganizationId },
      orderBy: { timestamp: "desc" },
      take: limit,
    });
    return rows.map((row) => ({
      id: row.id,
      action: row.action,
      entityType: row.entityType,
      entityId: row.entityId,
      actorId: row.actorId,
      actorType: row.actorType,
      timestamp: row.timestamp,
    }));
  });
}
