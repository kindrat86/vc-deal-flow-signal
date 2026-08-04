/**
 * Daily Seinfeld cron — invoked by Vercel Cron at 14:00 UTC.
 *
 * Brunson DotCom Secret #8. The Sunday digest trains the rhythm; this
 * keeps the list warm between Mondays. One observation, 60–90 second read,
 * single soft CTA. Each day uses a different editorial frame, anchored to
 * today's #1 mover from `getTopMoversThisWeek(1)`.
 *
 * Auth:
 *   - Production: Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}`.
 *     Without that header (or with the wrong secret), the route 401s.
 *   - Local + manual: `?dry=1` skips both auth and Resend send, returning
 *     the rendered email payload as JSON.
 *
 * Test surfaces:
 *   - `GET /api/cron/daily-seinfeld?dry=1`        → JSON, no send, no auth
 *   - `GET /api/cron/daily-seinfeld?to=foo@bar`   → single recipient via
 *                                                   Resend /emails (auth)
 *   - `GET /api/cron/daily-seinfeld`              → per-recipient fan-out to
 *                                                   the audience (auth), each
 *                                                   claiming the shared daily
 *                                                   send-gate slot first
 *
 * Restored 2026-05-06 — original cron + lib were uncommitted on
 * `claude/blissful-hamilton-6f38ab`, got overwritten when main moved.
 */

import { NextResponse } from "next/server";
import { getTopMoversThisWeek } from "@/lib/data";
import { buildDailySeinfeld, FROM_EMAIL } from "@/lib/daily-seinfeld";
import { pickAudienceId } from "@/lib/resend-audience";
import { listUnsubscribeHeaders, injectUnsubscribeLink } from "@/lib/list-unsubscribe";
import { gateAllows } from "@/lib/send-gate";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CRON_SECRET = process.env.CRON_SECRET;

interface ResendErrorBody {
  message?: string;
  name?: string;
  statusCode?: number;
}

async function getAudienceId(): Promise<string | null> {
  if (!RESEND_API_KEY) return null;
  const res = await fetch("https://api.resend.com/audiences", {
    method: "GET",
    headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
  });
  if (!res.ok) return null;
  const json: { data?: Array<{ id?: string }> } = await res.json();
  return pickAudienceId(json) ?? null;
}

export async function GET(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const dry = url.searchParams.get("dry") === "1";
  const to = url.searchParams.get("to");

  // Build the email regardless of mode — even auth failures benefit from the
  // payload being computed so we can debug schedule misfires from logs.
  const movers = getTopMoversThisWeek(1);
  const topMover = movers.length > 0 ? movers[0] : null;
  const today = new Date();
  const email = buildDailySeinfeld(today, topMover);

  // Dry-run: no auth required, no send.
  if (dry) {
    return NextResponse.json({
      ok: true,
      mode: "dry",
      date: today.toISOString().slice(0, 10),
      weekday: today.getUTCDay(),
      ...email,
    });
  }

  // Cron + manual paths require Vercel cron auth.
  const authHeader = req.headers.get("authorization");
  if (!CRON_SECRET) {
    console.error("[daily-seinfeld] CRON_SECRET not configured");
    return new Response("Cron secret not configured", { status: 500 });
  }
  if (authHeader !== `Bearer ${CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (!RESEND_API_KEY) {
    console.error("[daily-seinfeld] RESEND_API_KEY not configured");
    return new Response("Resend not configured", { status: 500 });
  }

  // ?to=email — single test recipient via /emails endpoint (not /broadcasts).
  if (to) {
    const sendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        bcc: "sales@sipiteno.com",
        to: [to],
        subject: email.subject,
        html: injectUnsubscribeLink(email.html, to),
        text: email.text,
        headers: {
          "X-Entity-Ref-ID": `daily-seinfeld-test-${Date.now()}`,
          ...listUnsubscribeHeaders(to),
        },
      }),
    });
    const body = (await sendRes.json()) as ResendErrorBody & { id?: string };
    if (!sendRes.ok) {
      console.error("[daily-seinfeld] test send failed:", body);
      return NextResponse.json(
        { ok: false, mode: "test", to, error: body },
        { status: 502 },
      );
    }
    console.info(`[daily-seinfeld] test sent to ${to}, frame=${email.frame}`);
    return NextResponse.json({
      ok: true,
      mode: "test",
      to,
      frame: email.frame,
      moverOrg: email.moverOrg,
      resend_id: body.id,
    });
  }

  // Default: fan out to the audience, one gated send per recipient.
  const audienceId = await getAudienceId();
  if (!audienceId) {
    console.error("[daily-seinfeld] no Resend audience found");
    return new Response("No audience", { status: 500 });
  }

  // Per-recipient fan-out instead of a Resend broadcast.
  //
  // A broadcast targets a whole audience and cannot exclude individuals at send
  // time, so it can't honour the shared one-marketing-email-per-day cap — a
  // subscriber who already got a drip this morning would still receive it. The
  // audience is small (tens of contacts), and the ?to= path below already sends
  // per recipient with correct unsubscribe handling, so we reuse that shape and
  // claim each recipient's daily slot first.
  //
  // Unsubscribe: broadcasts get Resend's {{{RESEND_UNSUBSCRIBE_URL}}} macro,
  // which does NOT expand on /emails sends — hence injectUnsubscribeLink() plus
  // listUnsubscribeHeaders() here, exactly as the single-recipient path does.
  const contactsRes = await fetch(
    `https://api.resend.com/audiences/${audienceId}/contacts`,
    { headers: { Authorization: `Bearer ${RESEND_API_KEY}` } },
  );
  const contactsBody: { data?: Array<{ email?: string; unsubscribed?: boolean }> } =
    contactsRes.ok ? await contactsRes.json() : {};
  const recipients = (contactsBody.data ?? [])
    .filter((c) => c.email && !c.unsubscribed)
    .map((c) => c.email as string);

  let sent = 0;
  let gated = 0;
  let failed = 0;
  for (const addr of recipients) {
    if (!(await gateAllows(addr, "pseo:daily-seinfeld"))) {
      gated++;
      continue;
    }
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [addr],
        subject: email.subject,
        html: injectUnsubscribeLink(email.html, addr),
        text: email.text,
        headers: {
          "X-Entity-Ref-ID": `daily-seinfeld-${today.toISOString().slice(0, 10)}-${email.frame}`,
          ...listUnsubscribeHeaders(addr),
        },
      }),
    });
    if (res.ok) sent++;
    else failed++;
  }

  console.info(
    `[daily-seinfeld] sent=${sent} gated=${gated} failed=${failed} (frame=${email.frame}, mover=${email.moverOrg ?? "none"})`,
  );
  return NextResponse.json({
    ok: true,
    mode: "per-recipient",
    sent,
    gated,
    failed,
    frame: email.frame,
    moverOrg: email.moverOrg,
    subject: email.subject,
  });
}
