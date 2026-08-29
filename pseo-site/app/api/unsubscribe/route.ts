import { NextResponse } from "next/server";
import { verifyVerifyToken } from "@/lib/verify-token";
import { pickAudienceId } from "@/lib/resend-audience";

// Mutating endpoint, never cache, run on Node (mirrors app/api/recent-signups).
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";

/**
 * HTTPS one-click unsubscribe (RFC 8058). Mail clients (Gmail, Apple Mail) POST
 * `List-Unsubscribe=One-Click` to the URL in the List-Unsubscribe header. The
 * URL carries a signed `unsubscribe` token that binds the recipient's email, so
 * no one can unsubscribe a third party.
 *
 * We only flip the contact to `unsubscribed:true` in the Resend audience, the
 * source of truth. The hourly Resend->PocketBase sync
 * (monitoring/sync-resend-to-pb.py) then demotes them to status='churned', which
 * the weekly digest (filter status='active') excludes. The Vercel runtime cannot
 * reach the laptop-local PocketBase, so Resend is the only write here.
 */

async function resolveAudienceId(): Promise<string | null> {
  const res = await fetch("https://api.resend.com/audiences", {
    headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
  });
  if (!res.ok) return null;
  const body = await res.json();
  return pickAudienceId(body) ?? null;
}

/** Mark a contact unsubscribed in Resend (idempotent). 404 = not in audience,
 *  treated as already-suppressed (nothing to send to). */
async function suppress(email: string): Promise<boolean> {
  if (!RESEND_API_KEY) {
    console.error("[unsubscribe] RESEND_API_KEY not configured");
    return false;
  }
  const audienceId = await resolveAudienceId();
  if (!audienceId) {
    console.error("[unsubscribe] could not resolve Resend audience");
    return false;
  }
  const res = await fetch(
    `https://api.resend.com/audiences/${audienceId}/contacts/${encodeURIComponent(email)}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ unsubscribed: true }),
    },
  );
  if (res.ok || res.status === 404) return true;
  console.error(`[unsubscribe] Resend PATCH failed ${res.status}: ${await res.text()}`);
  return false;
}

/**
 * Best-effort: cancel drip emails already queued via Resend `scheduled_at`
 * for this recipient, so an unsubscribe stops the sequence immediately
 * instead of after the queued sends drain. Scans the recent-sends list
 * (ample at current volume); anything it misses is still suppressed from
 * future drip-sender/broadcast sends by the contact flag.
 */
async function cancelQueued(email: string): Promise<number> {
  try {
    const res = await fetch("https://api.resend.com/emails?limit=100", {
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    });
    if (!res.ok) return 0;
    const body = (await res.json()) as {
      data?: Array<{ id: string; to?: string[]; last_event?: string }>;
    };
    const queued = (body.data ?? []).filter(
      (e) =>
        e.last_event === "scheduled" &&
        (e.to ?? []).some((t) => t.toLowerCase() === email.toLowerCase()),
    );
    let cancelled = 0;
    for (const e of queued) {
      const c = await fetch(`https://api.resend.com/emails/${e.id}/cancel`, {
        method: "POST",
        headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
      });
      if (c.ok) cancelled++;
    }
    if (cancelled > 0)
      console.info(`[unsubscribe] cancelled ${cancelled} queued emails for ${email}`);
    return cancelled;
  } catch (err) {
    console.warn("[unsubscribe] cancelQueued failed", err);
    return 0;
  }
}

function emailFromRequest(request: Request): string | null {
  const token = new URL(request.url).searchParams.get("token") || "";
  const v = verifyVerifyToken(token, "unsubscribe");
  return v?.email ?? null;
}

// POST = the actual one-click action. Always return 200 so the mail client shows
// success; a bad/expired token is logged and treated as a no-op.
export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") || "";
  let token = new URL(request.url).searchParams.get("token") || "";
  let reason = "";
  let isSurvey = false;
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = new URLSearchParams(await request.text());
    if (form.get("survey") === "1") {
      isSurvey = true;
      token = form.get("token") || "";
      reason = (form.get("reason") || "").slice(0, 100);
    }
  }
  const email = verifyVerifyToken(token, "unsubscribe")?.email ?? null;

  if (isSurvey) {
    if (email && reason) {
      void fetch("https://eu.i.posthog.com/capture/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: process.env.NEXT_PUBLIC_POSTHOG_KEY || "phc_lyZCgvTpicjLzAO3rY2GhxuX5WUc5jQjP8ZVwwJqauX",
          event: "free_list_exit_survey",
          distinct_id: email,
          properties: { $host: "signals.gitdealflow.com", product: "gitdealflow", reason },
        }),
      }).catch(() => undefined);
      const alertKey = process.env.RESEND_API_KEY;
      if (alertKey && RESEND_API_KEY) {
        void fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: `The Data Nerd <${FROM_EMAIL}>`,
            to: "signals@gitdealflow.com",
            bcc: "sales@sipiteno.com",
            reply_to: FROM_EMAIL,
            subject: `Exit survey: ${reason} (${email})`,
            html: `<p>A free-list subscriber unsubscribed and gave a reason.</p><p>Email: ${email}</p><p>Reason: ${reason}</p>`,
          }),
        }).catch(() => undefined);
      }
    }
    return NextResponse.redirect(
      new URL(`/api/unsubscribe?token=${encodeURIComponent(token)}&reason=thanks`, request.url),
      303,
    );
  }

  if (email) {
    await suppress(email);
    await cancelQueued(email);
  } else console.warn("[unsubscribe] POST with invalid/expired token");
  return new NextResponse(null, { status: 200 });
}

// GET = browser fallback (a recipient clicking an unsubscribe link in the body).
export async function GET(request: Request) {
  const url = new URL(request.url);
  const email = emailFromRequest(request);
  const ok = email ? await suppress(email) : false;
  if (ok && email) await cancelQueued(email);
  // Optional exit survey: browser GET path only, after a successful opt-out.
  // One question, optional answer, POSTs back with the same signed token so
  // nobody can submit a reason for someone else.
  const reasonDone = url.searchParams.get("reason") === "thanks";
  const token = url.searchParams.get("token") || "";
  return new NextResponse(confirmationHtml(ok, email, reasonDone, token), {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

// Free-list exit survey reasons. Distinct from the paid cancellation reasons
// in lib/retention-policy.ts because the free product is a weekly email, not
// a dashboard: the failure modes are content, cadence, and fit.
const UNSUB_REASONS: ReadonlyArray<[string, string]> = [
  ["not_investing", "I'm not actively investing right now"],
  ["wrong_fit", "Not relevant to how I source deals"],
  ["too_frequent", "Too many emails"],
  ["quality", "The signals weren't useful"],
  ["trust", "Didn't trust the method"],
  ["other", "Other"],
];

function escapeAttr(value: string): string {
  return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
}

function surveyBlock(ok: boolean, email?: string | null, reasonDone?: boolean, token?: string): string {
  if (!ok || !email) return "";
  if (reasonDone) {
    return `<p style="margin:.25rem 0 .75rem;font-size:.9rem;color:#64748b">Thanks. Noted, and it will shape what gets built next.</p>`;
  }
  if (!token) return "";
  const options = UNSUB_REASONS.map(
    ([value, label]) =>
      `<label style="display:block;margin:.35rem 0"><input type="radio" name="reason" value="${escapeAttr(value)}" style="margin-right:.5rem" />${label}</label>`,
  ).join("");
  return `<form method="POST" action="/api/unsubscribe" style="margin-top:1.25rem;padding-top:1rem;border-top:1px solid #1e293b">
  <p style="margin:0 0 .5rem;font-size:.95rem;color:#94a3b8">One optional question: what was the main reason?</p>
  ${options}
  <div style="margin-top:.6rem">
    <button type="submit" style="background:#1e293b;color:#e2e8f0;border:1px solid #334155;border-radius:8px;padding:.45rem .9rem;font-size:.9rem;cursor:pointer">Send answer</button>
    <span style="margin-left:.6rem;font-size:.8rem;color:#64748b">Optional. Skipping is fine.</span>
  </div>
  <input type="hidden" name="token" value="${escapeAttr(token)}" />
  <input type="hidden" name="survey" value="1" />
</form>`;
}

function confirmationHtml(ok: boolean, email?: string | null, reasonDone?: boolean, token?: string): string {
  const body = ok
    ? `<h1>You're unsubscribed.</h1>
       <p>You won't receive the weekly Signal Digest anymore. No hard feelings, the data will still be here if you ever want back in.</p>`
    : `<h1>Hmm, that link didn't work.</h1>
       <p>The unsubscribe link looks invalid or expired. Email
       <a href="mailto:${FROM_EMAIL}?subject=Unsubscribe">${FROM_EMAIL}</a>
       and I'll take you off the list by hand.</p>`;
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${ok ? "Unsubscribed" : "Unsubscribe failed"}: VC Deal Flow Signal</title>
<style>
  body{margin:0;background:#0b1120;color:#e2e8f0;font:16px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;display:flex;min-height:100vh;align-items:center;justify-content:center}
  .card{max-width:34rem;margin:1.5rem;padding:2rem;background:#0f172a;border:1px solid #1e293b;border-radius:14px}
  h1{margin:0 0 .75rem;font-size:1.5rem;color:#f1f5f9}
  p{margin:0 0 .5rem;color:#94a3b8}
  a{color:#38bdf8;text-decoration:none}
  a:hover{text-decoration:underline}
  .foot{margin-top:1.25rem;font-size:.8rem;color:#64748b}
</style></head>
<body><div class="card">
${body}
${surveyBlock(ok, email, reasonDone, token)}
<p class="foot">VC Deal Flow Signal · The Data Nerd</p>
</div></body></html>`;
}
