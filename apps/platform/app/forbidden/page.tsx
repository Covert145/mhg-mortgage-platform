import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@mhg/ui";

export default function ForbiddenPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Access denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-ink-700">
            Your account doesn&apos;t have permission to view that page. If you think this is a mistake, contact your
            administrator.
          </p>
          <Link
            href="/post-login"
            className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-brand-600 px-4 text-sm font-medium text-white hover:bg-brand-700"
          >
            Back to my dashboard
          </Link>
        </CardContent>
      </Card>
    </main>
  );
}
