import { NextResponse } from "next/server";
import { pickAudienceId } from "@/lib/resend-audience";
import { isWinback90Due, type StoredHealthSnapshot } from "@/lib/retention-policy";
import { winbackSequenceForReason, type CancellationReason } from "@/lib/retention-policy";
import { listUnsubscribeHeaders } from "@/lib/list-unsubscribe";

// Day-90 win-back dispatcher. Resend only accepts scheduled emails up to 30
// days ahead, so scheduleWinbackSequence() (fired on subscription.deleted)
// sends day 7 and day 30; this cron sends the final day-90 note, but only
// after rechecking that (a) the contact has not unsubscribed and (b) has not
// resubscribed/reactivated in the meantime (cancelled state cleared).
//
// State lives in the Resend contact's last_name field (see lib/customer-health.ts
// for the encoding) - the same store the webhook's markCustomerCancelled() writes.
//
// Auth: Bearer CRON_SECRET (Vercel cron) or ?dry=1 for a no-send inspection.

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const CRON_SECRET = process.env.CRON_SECRET;
const STATE_PREFIX = "gdf-health-v1:";

function headers() {
  return { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" };
}

function decodeState(lastName: string | null | undefined): StoredHealthSnapshot | null {
  if (!lastName?.startsWith(STATE_PREFIX)) return null;
  try {
    const parsed = JSON.parse(lastName.slice(STATE_PREFIX.length)) as StoredHealthSnapshot;
    return parsed ?? null;
  } catch {
    return null;
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const dry = url.searchParams.get("dry") === "1";

  if (!dry) {
    const authHeader = req.headers.get("authorization");
    if (!CRON_SECRET) return new Response("Cron secret not configured", { status: 500 });
    if (authHeader !== `Bearer ${CRON_SECRET}`) return new Response("Unauthorized", { status: 401 });
  }
  if (!RESEND_API_KEY) return new Response("Resend not configured", { status: 500 });

  const audiences = await fetch("https://api.resend.com/audiences", {
    headers: headers(),
    cache: "no-store",
  });
  if (!audiences.ok) return new Response("Could not list audiences", { status: 502 });
  const audienceId = pickAudienceId(await audiences.json());
  if (!audienceId) return new Response("No GitDealFlow audience found", { status: 502 });

  const contactsRes = await fetch(
    `https://api.resend.com/audiences/${audienceId}/contacts?limit=100`,
    { headers: headers(), cache: "no-store" },
  );
  if (!contactsRes.ok) return new Response("Could not list contacts", { status: 502 });
  const body = (await contactsRes.json()) as {
    data?: Array<{ email?: string; last_name?: string; unsubscribed?: boolean }>;
  };
  const contacts = body.data ?? [];

  const due: Array<{ email: string; reason: CancellationReason }> = [];
  for (const contact of contacts) {
    if (!contact.email || contact.unsubscribed) continue;
    const state = decodeState(contact.last_name);
    if (!isWinback90Due(state)) continue;
    const reason = state?.cancellationReason as CancellationReason | undefined;
    if (!reason) continue;
    due.push({ email: contact.email, reason });
  }

  if (dry) {
    return NextResponse.json({ ok: true, mode: "dry", due: due.length, contacts: due });
  }

  let sent = 0;
  for (const target of due) {
    const step = winbackSequenceForReason(target.reason).find((s) => s.day === 90);
    if (!step) continue;
    // Re-encode state with winback90SentAt set. last_name carries the token;
    // we must preserve everything else in it.
    const contactsRes2 = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts?limit=100`,
      { headers: headers(), cache: "no-store" },
    );
    if (!contactsRes2.ok) continue;
    const b2 = (await contactsRes2.json()) as {
      data?: Array<{ email?: string; last_name?: string }>;
    };
    const fresh = b2.data?.find((c) => c.email?.toLowerCase() === target.email.toLowerCase());
    const state = decodeState(fresh?.last_name);
    if (!state || !isWinback90Due(state)) continue; // raced: already sent or reactivated

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: target.email,
        bcc: "sales@sipiteno.com",
        reply_to: FROM_EMAIL,
        subject: step.subject,
        html: step.html,
        headers: listUnsubscribeHeaders(target.email),
      }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`[winback-dispatcher] day-90 send failed for ${target.email}: ${res.status}`);
      continue;
    }
    await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts/${encodeURIComponent(target.email)}`,
      {
        method: "PATCH",
        headers: headers(),
        body: JSON.stringify({
          last_name: `${STATE_PREFIX}${JSON.stringify({ ...state, winback90SentAt: new Date().toISOString() })}`,
        }),
        cache: "no-store",
      },
    ).catch(() => undefined);
    sent += 1;
  }

  return NextResponse.json({ ok: true, sent, due: due.length });
}
