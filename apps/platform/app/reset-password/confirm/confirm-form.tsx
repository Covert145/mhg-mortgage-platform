"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@mhg/ui";
import { resetPasswordAction, type ActionResult } from "@/lib/actions";

const initialState: ActionResult = { ok: false };

export function ConfirmResetForm({ email, token }: { email: string; token: string }) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, initialState);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Choose a new password</CardTitle>
      </CardHeader>
      <CardContent>
        {state.ok ? (
          <p className="text-sm text-ink-700">
            Password updated. <Link href="/login" className="text-brand-700 hover:underline">Sign in</Link>.
          </p>
        ) : (
          <form action={formAction} className="flex flex-col gap-3">
            <input type="hidden" name="email" value={email} />
            <input type="hidden" name="token" value={token} />
            <label className="flex flex-col gap-1 text-sm text-ink-700">
              New password
              <Input type="password" name="password" required autoComplete="new-password" minLength={12} />
            </label>
            {state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
            <Button type="submit" disabled={pending} className="mt-2">
              {pending ? "Updating…" : "Update password"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
