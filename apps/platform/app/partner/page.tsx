import { Card, CardContent, CardHeader, CardTitle } from "@mhg/ui";
import { requireSession } from "@mhg/auth";

export default async function PartnerPortalPage() {
  const session = await requireSession();

  return (
    <Card className="max-w-xl">
      <CardHeader>
        <CardTitle>Your referrals</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-ink-700">Welcome, {session.email}.</p>
        <p className="mt-2 text-sm text-ink-500">
          Referral tracking, stage updates, and appointment scheduling are built in Phase 8.
        </p>
      </CardContent>
    </Card>
  );
}
