import { Card, CardContent, CardHeader, CardTitle } from "@mhg/ui";
import { requireSession } from "@mhg/auth";
import { getCallerRole } from "@mhg/core";

export default async function ManagementPage() {
  const session = await requireSession();
  const role = await getCallerRole(session);

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Management Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-ink-700">
          You are signed in as <strong>{role}</strong> in organization <code className="text-xs">{session.activeOrganizationId}</code>.
        </p>
        <p className="mt-2 text-sm text-ink-500">Team performance reporting and reassignment tools are built in Phase 10.</p>
      </CardContent>
    </Card>
  );
}
