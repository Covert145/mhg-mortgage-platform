"use client";

import { useActionState } from "react";
import { Button, Input } from "@mhg/ui";
import { applyOnlineAction, type ActionResult } from "@/lib/actions";

const initialState: ActionResult = { ok: false };

export function ApplyForm() {
  const [state, formAction, pending] = useActionState(applyOnlineAction, initialState);

  if (state.ok) {
    return <p className="text-ink-700">Thanks — we&apos;ve started your file. A loan officer will follow up to continue your application.</p>;
  }

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      <Input name="firstName" placeholder="First name" required />
      <Input name="lastName" placeholder="Last name" required />
      <Input name="email" type="email" placeholder="Email" />
      <Input name="phone" type="tel" placeholder="Phone" />
      {state.error ? <p className="text-sm text-danger sm:col-span-2">{state.error}</p> : null}
      <Button type="submit" disabled={pending} className="sm:col-span-2">
        {pending ? "Starting…" : "Start my application"}
      </Button>
    </form>
  );
}
