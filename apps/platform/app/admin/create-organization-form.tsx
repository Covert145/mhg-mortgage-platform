"use client";

import { useActionState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input } from "@mhg/ui";
import { createOrganizationAction, type ActionResult } from "@/lib/actions";

const initialState: ActionResult = { ok: true };

export function CreateOrganizationForm() {
  const [state, formAction, pending] = useActionState(createOrganizationAction, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create organization</CardTitle>
        <p className="text-sm text-ink-500">Platform admin only.</p>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm text-ink-700">
            Organization name
            <Input type="text" name="name" required className="w-64" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink-700">
            NMLS ID (optional)
            <Input type="text" name="nmlsId" className="w-40" />
          </label>
          <Button type="submit" disabled={pending}>
            {pending ? "Creating…" : "Create"}
          </Button>
        </form>
        {!state.ok && state.error ? <p className="mt-2 text-sm text-danger">{state.error}</p> : null}
        {state.ok && state !== initialState ? <p className="mt-2 text-sm text-success">Organization created.</p> : null}
      </CardContent>
    </Card>
  );
}
