"use client";

import { useActionState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@mhg/ui";
import { acceptInviteAction, type ActionResult } from "@/lib/actions";

const initialState: ActionResult = { ok: true };

export function RegisterForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(acceptInviteAction, initialState);

  if (!token) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-ink-50 p-4">
        <Card className="w-full max-w-sm">
          <CardContent className="pt-5">
            <p className="text-sm text-ink-700">
              This registration link is missing an invite token. Ask your administrator for a new invite.
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Accept your invite</CardTitle>
          <p className="text-sm text-ink-500">Set your name and password to finish creating your account.</p>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-3">
            <input type="hidden" name="token" value={token} />
            <label className="flex flex-col gap-1 text-sm text-ink-700">
              Full name
              <Input type="text" name="name" required autoComplete="name" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-ink-700">
              Password
              <Input type="password" name="password" required autoComplete="new-password" minLength={12} />
            </label>
            {!state.ok && state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
            <Button type="submit" disabled={pending} className="mt-2">
              {pending ? "Creating account…" : "Create account"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
