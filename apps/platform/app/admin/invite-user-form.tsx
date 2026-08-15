"use client";

import { useActionState } from "react";
import { Button, Card, CardContent, CardHeader, CardTitle, Input, Select } from "@mhg/ui";
import { RoleName } from "@mhg/db";
import { inviteUserAction, type ActionResult } from "@/lib/actions";

const initialState: ActionResult = { ok: true };

export function InviteUserForm() {
  const [state, formAction, pending] = useActionState(inviteUserAction, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite a user</CardTitle>
        <p className="text-sm text-ink-500">
          Sends an invite-only registration link (dev-mode: logged to the server console).
        </p>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="flex flex-wrap items-end gap-3">
          <label className="flex flex-col gap-1 text-sm text-ink-700">
            Email
            <Input type="email" name="email" required className="w-64" />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink-700">
            Role
            <Select name="roleName" defaultValue={RoleName.LOAN_OFFICER} className="w-48">
              {Object.values(RoleName).map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </Select>
          </label>
          <Button type="submit" disabled={pending}>
            {pending ? "Sending…" : "Send invite"}
          </Button>
        </form>
        {!state.ok && state.error ? <p className="mt-2 text-sm text-danger">{state.error}</p> : null}
        {state.ok && state !== initialState ? <p className="mt-2 text-sm text-success">Invite sent.</p> : null}
      </CardContent>
    </Card>
  );
}
