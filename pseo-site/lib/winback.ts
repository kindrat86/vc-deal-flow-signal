import "server-only";

import { listUnsubscribeHeaders } from "@/lib/list-unsubscribe";
import { type CancellationReason, winbackSequenceForReason } from "@/lib/retention-policy";

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const GDF_AUDIENCE_ID = "1ddf358e-2416-4481-a0f5-538fd12f6e73";

function headers() {
  return { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" };
}

async function canReceiveWinback(email: string): Promise<boolean> {
  if (!RESEND_API_KEY) return false;
  const response = await fetch(`https://api.resend.com/audiences/${GDF_AUDIENCE_ID}/contacts?limit=100`, { headers: headers(), cache: "no-store" });
  if (!response.ok) return false;
  const body = await response.json() as { data?: Array<{ email?: string; unsubscribed?: boolean }> };
  const contact = body.data?.find((item) => item.email?.toLowerCase() === email.toLowerCase());
  return contact?.unsubscribed !== true;
}

/** Cancel all still-scheduled lifecycle messages for a recipient. This is deliberately
 * broader than win-back only: a person who has unsubscribed or bought again should
 * not receive an old, contradictory scheduled lifecycle email. */
export async function cancelScheduledLifecycleEmails(email: string): Promise<number> {
  if (!RESEND_API_KEY) return 0;
  const response = await fetch("https://api.resend.com/emails?limit=100", { headers: headers(), cache: "no-store" });
  if (!response.ok) return 0;
  const body = await response.json() as { data?: Array<{ id: string; to?: string[]; last_event?: string }> };
  const scheduled = (body.data || []).filter((message) => message.last_event === "scheduled" && (message.to || []).some((recipient) => recipient.toLowerCase() === email.toLowerCase()));
  let cancelled = 0;
  for (const message of scheduled) {
    const result = await fetch(`https://api.resend.com/emails/${message.id}/cancel`, { method: "POST", headers: headers(), cache: "no-store" });
    if (result.ok) cancelled += 1;
  }
  return cancelled;
}

export async function scheduleWinbackSequence(input: { email: string; reason: CancellationReason }): Promise<number> {
  if (!(await canReceiveWinback(input.email))) return 0;
  let scheduled = 0;
  for (const step of winbackSequenceForReason(input.reason)) {
    // Resend accepts scheduled email only up to 30 days ahead. Day 90 is sent
    // by the retention dispatcher after it rechecks this contact's status.
    if (step.day > 30) continue;
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: input.email,
        bcc: "sales@sipiteno.com",
        reply_to: FROM_EMAIL,
        subject: step.subject,
        html: step.html,
        scheduled_at: new Date(Date.now() + step.day * 86_400_000).toISOString(),
        headers: listUnsubscribeHeaders(input.email),
      }),
      cache: "no-store",
    });
    if (response.ok) scheduled += 1;
    else console.error(`[winback] failed to schedule day ${step.day}: ${response.status}`);
  }
  return scheduled;
}

