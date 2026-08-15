"use client";

import { useActionState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@mhg/ui";
import { requestPasswordResetAction, type ActionResult } from "@/lib/actions";

const initialState: ActionResult = { ok: false };

export function RequestResetForm() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, initialState);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Reset your password</CardTitle>
        <p className="text-sm text-ink-500">We&apos;ll send a reset link to your email if an account exists.</p>
      </CardHeader>
      <CardContent>
        {state.ok ? (
          <p className="text-sm text-ink-700">
            If that email is registered, a reset link has been sent. Check the server console in Phase 1&apos;s
            dev-mode email transport.
          </p>
        ) : (
          <form action={formAction} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm text-ink-700">
              Email
              <Input type="email" name="email" required autoComplete="email" />
            </label>
            {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
            <Button type="submit" disabled={pending} className="mt-2">
              {pending ? "Sending…" : "Send reset link"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
