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
import { createHash } from "crypto";
import { WELCOME_2026_11_EMAILS } from "@/lib/emails";
import { digestFreshness } from "@/lib/digest-builder";
import { SOAP_2026_11_PAUSED, SOAP_RESUME_MODE } from "@/lib/soap-pause";
import { isExcluded } from "@/lib/excluded-emails";
import { listUnsubscribeHeaders, injectUnsubscribeLink } from "@/lib/list-unsubscribe";
import { pickAudienceId } from "@/lib/resend-audience";

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
  const resume = url.searchParams.get("resume") === "1" || SOAP_RESUME_MODE !== "off";
  const planOnly = dry || SOAP_RESUME_MODE === "dry";
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
    // Release plan (Maryan так 2026-11-03 12:01):
    //  - only parked emails (due > 20 days out); never anything already sent
    //  - unsubscribed / excluded / not-in-audience recipients: cancelled, never sent
    //  - per recipient, steps in sequence order, at most one per day, first one
    //    tomorrow 08:30 UTC, then the original gaps (E1 +1d, +2d, +2d, +2d)
    //  - E4 copies carry the pre-correction text and Resend cannot edit html,
    //    so they are cancelled and re-created from lib/emails (corrected) at the
    //    planned time; other steps are re-timed in place
    const sha = (e: string) => createHash("sha256").update(e.trim().toLowerCase()).digest("hex");
    let queueSet = new Set<string>();
    try {
      const q = JSON.parse(process.env.WELCOME_REENROLL_QUEUE || "[]") as { e?: string }[];
      queueSet = new Set(q.filter((x) => typeof x?.e === "string").map((x) => x.e!.trim().toLowerCase()));
    } catch {}
    const parked = scheduled.filter((e) => (e.scheduled_at ? Date.parse(e.scheduled_at) : 0) > now + 20 * DAY);
    const idxOf = (s?: string) => WELCOME_2026_11_EMAILS.findIndex((w) => w.subject === s);
    const aud = await resend("/audiences");
    const audienceId = aud.ok ? pickAudienceId(await aud.json()) : undefined;
    const byTo = new Map<string, ListedEmail[]>();
    for (const e of parked) {
      const to = (e.to ?? [])[0]?.toLowerCase() ?? "";
      byTo.set(to, [...(byTo.get(to) ?? []), e]);
    }
    const tomorrow = new Date(now + DAY);
    const base = Date.parse(`${tomorrow.toISOString().slice(0, 10)}T08:30:00Z`);
    const GAP = [0, 1, 2, 2, 2]; // days after the previous released step
    let p = 0;
    for (const [to, list] of byTo) {
      let ok = !!to && !isExcluded(to) && !!audienceId;
      if (ok) {
        const c = await resend(`/audiences/${audienceId}/contacts/${encodeURIComponent(to)}`);
        ok = c.ok && !((await c.json()) as { unsubscribed?: boolean }).unsubscribed;
      }
      const steps = [...list].sort((a, b) => idxOf(a.subject) - idxOf(b.subject));
      let at = base + (p++ % 12) * 7 * 60_000; // stagger recipients 7 min apart
      for (const [k, e] of steps.entries()) {
        const idx = idxOf(e.subject);
        if (k > 0) at += Math.max(1, GAP[Math.max(0, idx)] ?? 1) * DAY;
        const when = new Date(at).toISOString();
        const row: Record<string, unknown> = { id: e.id, step: idx + 1, to: mask([to]), at: ok ? when : null };
        if (ok && queueSet.has(to)) {
          // Re-enroll subscriber: the cron re-sends this step after the shift.
          row.h = sha(to);
          row.at = null;
          row.action = planOnly ? "would_cancel_for_reenroll_shift" : (await resend(`/emails/${e.id}/cancel`, { method: "POST" })).ok ? "cancelled_for_reenroll_shift" : "cancel_failed";
        } else if (!ok) {
          row.action = planOnly ? "would_cancel_unsubscribed" : (await resend(`/emails/${e.id}/cancel`, { method: "POST" })).ok ? "cancelled_unsubscribed" : "cancel_failed";
        } else if (idx === 3) {
          if (planOnly) row.action = "would_replace_corrected_e4";
          else {
            const cx = await resend(`/emails/${e.id}/cancel`, { method: "POST" });
            if (!cx.ok) row.action = `e4_cancel_failed_${cx.status}`;
            else {
              const w = WELCOME_2026_11_EMAILS[3];
              const r = await resend("/emails", { method: "POST", body: JSON.stringify({
                from: `${process.env.FROM_NAME || "The Data Nerd"} <${process.env.FROM_EMAIL || "signals@gitdealflow.com"}>`,
                reply_to: process.env.FROM_EMAIL || "signals@gitdealflow.com",
                bcc: "sales@sipiteno.com", to, subject: w.subject,
                html: injectUnsubscribeLink(w.html, to), headers: listUnsubscribeHeaders(to),
                tags: [{ name: "email_key", value: "welcome-2026-11-e4-corrected" }], scheduled_at: when }) });
              const nb = (await r.json().catch(() => ({}))) as { id?: string };
              row.action = r.ok ? "replaced_corrected_e4" : `e4_create_failed_${r.status}`;
              row.new_id = nb.id;
            }
          }
        } else {
          row.action = planOnly ? "would_retime" : (await resend(`/emails/${e.id}`, { method: "PATCH", body: JSON.stringify({ scheduled_at: when }) })).ok ? "retimed" : "retime_failed";
        }
        results.push(row);
      }
    }
  }
  console.info(`[soap-pause-sweep] held=${held} paused=${SOAP_2026_11_PAUSED} mode=${SOAP_RESUME_MODE} fresh=${fr.fresh} scheduled=${scheduled.length} ${JSON.stringify(results)}`);
  return NextResponse.json({ held, paused: SOAP_2026_11_PAUSED, dataFresh: fr.fresh, fetchedAt: fr.fetchedAt, dry, resume, scheduledSoap: scheduled.length, results });
}
