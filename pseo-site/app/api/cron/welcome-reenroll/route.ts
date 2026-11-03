/**
 * Welcome re-enrollment, daily cron (05:30 UTC).
 *
 * Maryan 2026-11-03 (t588/t592): existing GitDealFlow subscribers who never
 * got the approved 2026-11 welcome start it at email 1, max 5 new people per
 * weekday, spread through the day. The queue lives in the WELCOME_REENROLL_QUEUE
 * env var (JSON [{ "e": email, "d": "YYYY-MM-DD" start day UTC, "t": "HH:MM" UTC }])
 * so subscriber addresses never enter git.
 *
 * Stateless and drip-shaped on purpose: each run only handles the emails due
 * TODAY (start + 0/1/3/5/7 days) and re-checks the live Resend contact first,
 * so an unsubscribe after email 1 stops emails 2-5. Same-day timing uses
 * Resend scheduled_at (a few hours ahead at most). Each send claims the shared
 * one-marketing-email-per-day gate, which also makes a double cron fire a no-op.
 *
 * Auth: Bearer CRON_SECRET for every mode.
 *   GET                      -> cron mode (schedules today's due emails)
 *   GET ?dry=1               -> plan only, no send
 *   GET ?to=<addr>&idx=<0-4> -> one test copy of welcome email idx to addr
 */
import { NextResponse } from "next/server";
import { WELCOME_2026_11_EMAILS } from "@/lib/emails";
import { isExcluded } from "@/lib/excluded-emails";
import { listUnsubscribeHeaders, injectUnsubscribeLink } from "@/lib/list-unsubscribe";
import { pickAudienceId } from "@/lib/resend-audience";
import { gateAllows } from "@/lib/send-gate";
import { honestSignalsCopy } from "@/lib/stale-copy";
import { digestFreshness } from "@/lib/digest-builder";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CRON_SECRET = process.env.CRON_SECRET;
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const THIRTY_MIN = 30 * 60 * 1000;
const ONE_DAY = 24 * 60 * 60 * 1000;

interface QueueEntry { e: string; d: string; t: string }

function loadQueue(): QueueEntry[] {
  try {
    const q = JSON.parse(process.env.WELCOME_REENROLL_QUEUE || "[]");
    return Array.isArray(q) ? q.filter((x) => x && typeof x.e === "string" && /^\d{4}-\d{2}-\d{2}$/.test(x.d) && /^\d{2}:\d{2}$/.test(x.t)) : [];
  } catch {
    return [];
  }
}

const dayOffsets = WELCOME_2026_11_EMAILS.map((m) => Math.round((m.delayMs - THIRTY_MIN) / ONE_DAY));

async function resend(path: string, init?: RequestInit) {
  return fetch(`https://api.resend.com${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json", ...(init?.headers || {}) },
  });
}

async function send(to: string, idx: number, scheduledAt?: string) {
  const m = WELCOME_2026_11_EMAILS[idx];
  const payload: Record<string, unknown> = {
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    reply_to: FROM_EMAIL,
    bcc: "sales@sipiteno.com",
    to,
    subject: m.subject,
    html: injectUnsubscribeLink(honestSignalsCopy(m.html), to),
    headers: listUnsubscribeHeaders(to),
    tags: [{ name: "email_key", value: `welcome-reenroll-${idx + 1}` }],
  };
  if (scheduledAt) payload.scheduled_at = scheduledAt;
  const res = await resend("/emails", { method: "POST", body: JSON.stringify(payload) });
  const body = await res.json().catch(() => ({}));
  return { ok: res.ok, id: (body as { id?: string }).id, error: res.ok ? undefined : body };
}

export async function GET(request: Request) {
  if (!CRON_SECRET || request.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!RESEND_API_KEY) return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  const url = new URL(request.url);
  const dry = url.searchParams.get("dry") === "1";
  const testTo = url.searchParams.get("to");
  // Freshness gate (Maryan 2026-11-03): welcome email 1 points readers at
  // "this week's" signals, so no welcome email goes out while the signal data
  // is older than FRESH_DAYS (8). dry=1 still plans. Held days are not
  // re-sent automatically; the log line lists who was held.
  const fr = digestFreshness();
  if (!fr.fresh && !dry) {
    console.error(`[welcome-reenroll] stale data (fetchedAt=${fr.fetchedAt}), not sending`);
    return NextResponse.json({ ok: false, reason: "stale_data", fetchedAt: fr.fetchedAt, ageDays: Math.round(fr.ageDays), freshCount: fr.freshCount }, { status: 409 });
  }
  if (testTo) {
    const idx = Math.max(0, Math.min(WELCOME_2026_11_EMAILS.length - 1, Number(url.searchParams.get("idx") || 0)));
    return NextResponse.json({ mode: "test", idx, ...(await send(testTo, idx)) });
  }

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const todayMs = Date.parse(`${today}T00:00:00Z`);
  const due: { email: string; idx: number; at: string }[] = [];
  for (const q of loadQueue()) {
    const offset = Math.round((todayMs - Date.parse(`${q.d}T00:00:00Z`)) / ONE_DAY);
    const idx = dayOffsets.indexOf(offset);
    if (idx < 0) continue;
    const at = new Date(`${today}T${q.t}:00Z`);
    due.push({ email: q.e.trim().toLowerCase(), idx, at: at.toISOString() });
  }

  const audRes = await resend("/audiences");
  const audienceId = audRes.ok ? pickAudienceId(await audRes.json()) : undefined;
  if (!audienceId) return NextResponse.json({ error: "No audience" }, { status: 500 });

  const results: Record<string, unknown>[] = [];
  for (const d of due) {
    if (isExcluded(d.email)) { results.push({ ...d, skipped: "excluded" }); continue; }
    const c = await resend(`/audiences/${audienceId}/contacts/${encodeURIComponent(d.email)}`);
    if (!c.ok) { results.push({ ...d, skipped: "not_in_audience" }); continue; }
    const contact = (await c.json()) as { unsubscribed?: boolean };
    if (contact.unsubscribed) { results.push({ ...d, skipped: "unsubscribed" }); continue; }
    if (dry) { results.push({ ...d, would_send: WELCOME_2026_11_EMAILS[d.idx].subject }); continue; }
    if (!(await gateAllows(d.email, "pseo:welcome-reenroll"))) { results.push({ ...d, skipped: "gate" }); continue; }
    const scheduledAt = Date.parse(d.at) > Date.now() + 60_000 ? d.at : undefined;
    results.push({ ...d, ...(await send(d.email, d.idx, scheduledAt)) });
  }
  console.info(`[welcome-reenroll] ${today} due=${due.length} ${JSON.stringify(results.map((r) => ({ i: r.idx, ok: r.ok, s: r.skipped })))}`);
  return NextResponse.json({ dry, today, due: due.length, results });
}
