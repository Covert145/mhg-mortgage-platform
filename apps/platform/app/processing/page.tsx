import { Card, CardContent, CardHeader, CardTitle } from "@mhg/ui";
import { requireSession } from "@mhg/auth";
import { getCallerRole } from "@mhg/core";

export default async function ProcessingPage() {
  const session = await requireSession();
  const role = await getCallerRole(session);

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Processing Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-ink-700">
          You are signed in as <strong>{role}</strong> in organization <code className="text-xs">{session.activeOrganizationId}</code>.
        </p>
        <p className="mt-2 text-sm text-ink-500">
          Condition tracking and document verification workflows are built in Phase 4.
        </p>
      </CardContent>
    </Card>
  );
}
