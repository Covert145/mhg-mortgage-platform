import { Card, CardContent, CardHeader, CardTitle } from "@mhg/ui";
import { requireSession } from "@mhg/auth";
import { getAuditLogForOrg } from "@mhg/core";
import { getCallerRole } from "@mhg/core";
import { RoleName } from "@mhg/db";
import { InviteUserForm } from "./invite-user-form";
import { CreateOrganizationForm } from "./create-organization-form";

export default async function AdminPage() {
  const session = await requireSession();
  const [role, auditLog] = await Promise.all([getCallerRole(session), getAuditLogForOrg(session, 20)]);

  return (
    <div className="grid max-w-4xl gap-6">
      {role === RoleName.PLATFORM_ADMIN ? <CreateOrganizationForm /> : null}
      <InviteUserForm />
      <Card>
        <CardHeader>
          <CardTitle>Recent audit log activity</CardTitle>
        </CardHeader>
        <CardContent>
          {auditLog.length === 0 ? (
            <p className="text-sm text-ink-500">No audited actions yet.</p>
          ) : (
            <ul className="divide-y divide-ink-100 text-sm">
              {auditLog.map((entry) => (
                <li key={entry.id} className="flex items-center justify-between py-2">
                  <span className="text-ink-800">
                    {entry.action} — {entry.entityType}
                  </span>
                  <span className="text-xs text-ink-400">{entry.timestamp.toISOString()}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
