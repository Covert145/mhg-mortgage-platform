import { Card, CardContent, CardHeader, CardTitle } from "@mhg/ui";
import { requireSession } from "@mhg/auth";

export default async function BorrowerPortalPage() {
  const session = await requireSession();

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Your loan</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-ink-700">Welcome, {session.email}.</p>
        <p className="mt-2 text-sm text-ink-500">
          Application status, milestones, document upload, and closing details are built in Phase 7.
        </p>
      </CardContent>
    </Card>
  );
}
