"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@mhg/ui";
import { loginAction, type ActionResult } from "@/lib/actions";

const initialState: ActionResult = { ok: true };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <main className="flex min-h-screen items-center justify-center bg-ink-50 p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <p className="text-sm text-ink-500">Mobile Home Guy Platform</p>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1 text-sm text-ink-700">
              Email
              <Input type="email" name="email" required autoComplete="email" />
            </label>
            <label className="flex flex-col gap-1 text-sm text-ink-700">
              Password
              <Input type="password" name="password" required autoComplete="current-password" />
            </label>
            {!state.ok && state.error ? <p className="text-sm text-danger">{state.error}</p> : null}
            <Button type="submit" disabled={pending} className="mt-2">
              {pending ? "Signing in…" : "Sign in"}
            </Button>
            <div className="mt-2 flex justify-between text-sm">
              <Link href="/reset-password" className="text-brand-700 hover:underline">
                Forgot password?
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
