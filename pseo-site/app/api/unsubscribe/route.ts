import { NextResponse } from "next/server";
import { verifyVerifyToken } from "@/lib/verify-token";
import { pickAudienceId } from "@/lib/resend-audience";

// Mutating endpoint — never cache, run on Node (mirrors app/api/recent-signups).
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
 * We only flip the contact to `unsubscribed:true` in the Resend audience — the
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
  const email = emailFromRequest(request);
  if (email) {
    await suppress(email);
    await cancelQueued(email);
  } else console.warn("[unsubscribe] POST with invalid/expired token");
  return new NextResponse(null, { status: 200 });
}

// GET = browser fallback (a recipient clicking an unsubscribe link in the body).
export async function GET(request: Request) {
  const email = emailFromRequest(request);
  const ok = email ? await suppress(email) : false;
  if (ok && email) await cancelQueued(email);
  return new NextResponse(confirmationHtml(ok), {
    status: 200,
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}

function confirmationHtml(ok: boolean): string {
  const body = ok
    ? `<h1>You're unsubscribed.</h1>
       <p>You won't receive the weekly Signal Digest anymore. No hard feelings — the data will still be here if you ever want back in.</p>`
    : `<h1>Hmm, that link didn't work.</h1>
       <p>The unsubscribe link looks invalid or expired. Email
       <a href="mailto:${FROM_EMAIL}?subject=Unsubscribe">${FROM_EMAIL}</a>
       and I'll take you off the list by hand.</p>`;
  return `<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>${ok ? "Unsubscribed" : "Unsubscribe failed"} — VC Deal Flow Signal</title>
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
<p class="foot">VC Deal Flow Signal · The Data Nerd</p>
</div></body></html>`;
}
