import { Card, CardContent, CardHeader, CardTitle } from "@mhg/ui";
import { requireSession } from "@mhg/auth";
import { getCallerRole } from "@mhg/core";

export default async function CrmPage() {
  const session = await requireSession();
  const role = await getCallerRole(session);

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>CRM</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-ink-700">
          You are signed in as <strong>{role}</strong> in organization <code className="text-xs">{session.activeOrganizationId}</code>.
        </p>
        <p className="mt-2 text-sm text-ink-500">
          Contact management, the pipeline board, and Contact 360 timelines are built in Phase 3. This Phase 1 shell
          proves the authentication, role-based routing, and authorization pattern end to end.
        </p>
      </CardContent>
    </Card>
  );
}
