"use client";

import { useActionState } from "react";
import { Button, Input } from "@mhg/ui";
import { contactFormAction, type ActionResult } from "@/lib/actions";

const initialState: ActionResult = { ok: false };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(contactFormAction, initialState);

  if (state.ok) {
    return <p className="text-ink-700">Thanks for reaching out — we&apos;ll respond soon.</p>;
  }

  return (
    <form action={formAction} className="grid gap-3 sm:grid-cols-2">
      <Input name="firstName" placeholder="First name" required />
      <Input name="lastName" placeholder="Last name" required />
      <Input name="email" type="email" placeholder="Email" />
      <Input name="phone" type="tel" placeholder="Phone" />
      <textarea
        name="message"
        placeholder="How can we help?"
        required
        rows={4}
        className="h-auto w-full rounded-md border border-ink-300 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 sm:col-span-2"
      />
      {state.error ? <p className="text-sm text-danger sm:col-span-2">{state.error}</p> : null}
      <Button type="submit" disabled={pending} className="sm:col-span-2">
        {pending ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
