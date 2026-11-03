/**
 * soap-2026-11 pause sweep (Maryan 2026-11-03 11:08 Athens: pause the
 * sequence, all steps, delete nothing, email no one).
 *
 * Emails of the sequence that /api/verify or /api/cron/welcome-reenroll
 * already handed to Resend with scheduled_at would still fire, so this route
 * PARKS them: each scheduled soap-2026-11 email due within the next 7 days is
 * re-timed to now + 29 days (Resend's limit). Nothing is cancelled or deleted.
 * Runs daily (vercel.json) so parked emails never come due while held.
 *
 * Held = SOAP_2026_11_PAUSED (lib/soap-pause.ts) OR signal data stale.
 *
 * Auth: Bearer CRON_SECRET.
 *   GET            -> park (when held) and report
 *   GET ?dry=1     -> report only
 *   GET ?resume=1  -> only when NOT held: re-time parked emails (due > 20
 *                     days out) to now + 10 min, staggered 7 min apart
 */
import { NextResponse } from "next/server";
import { WELCOME_2026_11_EMAILS } from "@/lib/emails";
import { digestFreshness } from "@/lib/digest-builder";
import { SOAP_2026_11_PAUSED } from "@/lib/soap-pause";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CRON_SECRET = process.env.CRON_SECRET;
const DAY = 86_400_000;
const SUBJECTS = new Set(WELCOME_2026_11_EMAILS.map((e) => e.subject));

interface ListedEmail { id: string; subject?: string; last_event?: string; scheduled_at?: string | null; to?: string[] }

async function resend(path: string, init?: RequestInit) {
  return fetch(`https://api.resend.com${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json", ...(init?.headers || {}) },
  });
}

async function listScheduledSoap(): Promise<ListedEmail[]> {
  const out: ListedEmail[] = [];
  let after: string | undefined;
  for (let page = 0; page < 20; page++) {
    const r = await resend(`/emails?limit=100${after ? `&after=${after}` : ""}`);
    if (!r.ok) break;
    const b = (await r.json()) as { data?: ListedEmail[]; has_more?: boolean };
    const data = b.data ?? [];
    for (const e of data) if (e.last_event === "scheduled" && e.subject && SUBJECTS.has(e.subject)) out.push(e);
    if (!b.has_more || !data.length) break;
    after = data[data.length - 1].id;
  }
  return out;
}

const mask = (to?: string[]) => (to ?? []).map((t) => t.replace(/^(.{2}).*@/, "$1***@"));

export async function GET(request: Request) {
  if (!CRON_SECRET || request.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!RESEND_API_KEY) return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  const url = new URL(request.url);
  const dry = url.searchParams.get("dry") === "1";
  const resume = url.searchParams.get("resume") === "1";
  const fr = digestFreshness();
  const held = SOAP_2026_11_PAUSED || !fr.fresh;
  const now = Date.now();
  const scheduled = await listScheduledSoap();
  const results: Record<string, unknown>[] = [];

  if (held && !resume) {
    const parkAt = new Date(now + 29 * DAY).toISOString();
    for (const e of scheduled) {
      const due = e.scheduled_at ? Date.parse(e.scheduled_at) : now;
      if (due > now + 7 * DAY) { results.push({ id: e.id, subject: e.subject, to: mask(e.to), scheduled_at: e.scheduled_at, action: "already_parked" }); continue; }
      if (dry) { results.push({ id: e.id, subject: e.subject, to: mask(e.to), scheduled_at: e.scheduled_at, action: "would_park" }); continue; }
      const r = await resend(`/emails/${e.id}`, { method: "PATCH", body: JSON.stringify({ scheduled_at: parkAt }) });
      results.push({ id: e.id, subject: e.subject, to: mask(e.to), from: e.scheduled_at, to_at: parkAt, action: r.ok ? "parked" : `park_failed_${r.status}` });
    }
  } else if (resume && !held) {
    let i = 0;
    for (const e of scheduled) {
      const due = e.scheduled_at ? Date.parse(e.scheduled_at) : now;
      if (due < now + 20 * DAY) continue;
      const at = new Date(now + (10 + 7 * i++) * 60_000).toISOString();
      if (dry) { results.push({ id: e.id, subject: e.subject, to: mask(e.to), action: "would_resume", at }); continue; }
      const r = await resend(`/emails/${e.id}`, { method: "PATCH", body: JSON.stringify({ scheduled_at: at }) });
      results.push({ id: e.id, subject: e.subject, to: mask(e.to), at, action: r.ok ? "resumed" : `resume_failed_${r.status}` });
    }
  }
  console.info(`[soap-pause-sweep] held=${held} paused=${SOAP_2026_11_PAUSED} fresh=${fr.fresh} scheduled=${scheduled.length} ${JSON.stringify(results.map((r) => r.action))}`);
  return NextResponse.json({ held, paused: SOAP_2026_11_PAUSED, dataFresh: fr.fresh, fetchedAt: fr.fetchedAt, dry, resume, scheduledSoap: scheduled.length, results });
}
