"use client";

import { useActionState } from "react";
import { Button, Input } from "@mhg/ui";
import { getApprovedAction, type ActionResult } from "@/lib/actions";

const initialState: ActionResult = { ok: false };

export function GetApprovedForm() {
  const [state, formAction, pending] = useActionState(getApprovedAction, initialState);

  if (state.ok) {
    return (
      <p className="text-ink-700">
        Thanks! A member of our team will reach out shortly. No commitment, no cost to get started.
      </p>
    );
  }

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      <Input name="firstName" placeholder="First name" required />
      <Input name="lastName" placeholder="Last name" required />
      <Input name="email" type="email" placeholder="Email" />
      <Input name="phone" type="tel" placeholder="Phone" />
      {state.error ? <p className="text-sm text-danger sm:col-span-2">{state.error}</p> : null}
      <Button type="submit" disabled={pending} className="sm:col-span-2">
        {pending ? "Submitting…" : "Get Approved — takes 1 minute"}
      </Button>
    </form>
  );
}
