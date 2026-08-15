"use server";

import { z } from "zod";
import { ContactType } from "@mhg/db";
import { createPublicLead } from "@mhg/core";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

function getMarketingOrgId(): string {
  const orgId = process.env.MARKETING_ORG_ID;
  if (!orgId) {
    throw new Error("MARKETING_ORG_ID is not configured — see .env.example.");
  }
  return orgId;
}

const leadInput = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().min(7).optional().or(z.literal("")),
});

/**
 * Get Approved (quick pre-qualification) — see
 * docs/architecture/phase-1-implementation-spec.md #8: upsert Contact,
 * source=WEBSITE. Full Opportunity/Task creation on this event lands with
 * the CRM build in Phase 3; Phase 1 proves the Contact-creation path.
 */
export async function getApprovedAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = leadInput.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });
  if (!parsed.success) return { ok: false, error: "Please fill in your name and either an email or phone number." };
  if (!parsed.data.email && !parsed.data.phone) {
    return { ok: false, error: "Enter an email or phone number so we can reach you." };
  }

  try {
    await createPublicLead(getMarketingOrgId(), {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email || undefined,
      phone: parsed.data.phone || undefined,
      contactType: ContactType.LEAD,
      leadSource: "website:get-approved",
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Something went wrong." };
  }
}

/** Apply Online — same Contact-creation path, tagged with a different lead source for reporting. */
export async function applyOnlineAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = leadInput.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
  });
  if (!parsed.success) return { ok: false, error: "Please fill in your name and either an email or phone number." };
  if (!parsed.data.email && !parsed.data.phone) {
    return { ok: false, error: "Enter an email or phone number so we can reach you." };
  }

  try {
    await createPublicLead(getMarketingOrgId(), {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email || undefined,
      phone: parsed.data.phone || undefined,
      contactType: ContactType.LEAD,
      leadSource: "website:apply-online",
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Something went wrong." };
  }
}

const contactInput = leadInput.extend({ message: z.string().min(1).max(2000) });

/** Contact form — upsert Contact, source=WEBSITE. Full inbox/task routing lands in Phase 3. */
export async function contactFormAction(_prev: ActionResult, formData: FormData): Promise<ActionResult> {
  const parsed = contactInput.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
  });
  if (!parsed.success) return { ok: false, error: "Please fill in your name, contact info, and message." };

  try {
    await createPublicLead(getMarketingOrgId(), {
      firstName: parsed.data.firstName,
      lastName: parsed.data.lastName,
      email: parsed.data.email || undefined,
      phone: parsed.data.phone || undefined,
      contactType: ContactType.LEAD,
      leadSource: "website:contact-form",
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Something went wrong." };
  }
}
