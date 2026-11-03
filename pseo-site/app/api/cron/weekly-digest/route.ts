/**
 * Sunday "five names" Signal Digest, weekly cron (Sunday 07:00 UTC).
 *
 * Maryan 2026-11-03 (t592): the GitDealFlow Seinfeld channel IS this weekly
 * digest. Replaces the Mac-only email-api/send-weekly-signal-digest.sh that
 * stopped when the Mac was retired.
 *
 * Real data only: refuses to send when data/startups.json is older than
 * MAX_DATA_AGE_DAYS (the digest must never present stale numbers as "this
 * week"). Per-recipient fan-out from the live Resend audience, skipping
 * unsubscribed + excluded contacts, each claiming the shared daily send gate.
 *
 * Auth: Bearer CRON_SECRET for every mode.
 *   GET            -> cron mode
 *   GET ?dry=1     -> counts + subject, no send
 *   GET ?to=<addr> -> one test copy
 */
import { NextResponse } from "next/server";
import startupsData from "@/data/startups.json";
import { buildLatestDigest, countFreshCurrentStartups } from "@/lib/digest-builder";
import { isExcluded } from "@/lib/excluded-emails";
import { listUnsubscribeHeaders, injectUnsubscribeLink } from "@/lib/list-unsubscribe";
import { pickAudienceId } from "@/lib/resend-audience";
import { gateAllows } from "@/lib/send-gate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CRON_SECRET = process.env.CRON_SECRET;
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const MAX_DATA_AGE_DAYS = 9;

async function resend(path: string, init?: RequestInit) {
  return fetch(`https://api.resend.com${path}`, {
    ...init,
    headers: { Authorization: `Bearer ${RESEND_API_KEY}`, "Content-Type": "application/json", ...(init?.headers || {}) },
  });
}

export async function GET(request: Request) {
  if (!CRON_SECRET || request.headers.get("authorization") !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!RESEND_API_KEY) return NextResponse.json({ error: "RESEND_API_KEY not configured" }, { status: 500 });
  const url = new URL(request.url);
  const dry = url.searchParams.get("dry") === "1";
  const testTo = url.searchParams.get("to");

  const fetchedAt = (startupsData as { _meta?: { fetchedAt?: string } })._meta?.fetchedAt;
  const ageDays = fetchedAt ? (Date.now() - Date.parse(fetchedAt)) / 86_400_000 : Infinity;
  const freshCount = countFreshCurrentStartups();
  const fresh = ageDays <= MAX_DATA_AGE_DAYS && freshCount >= 5;
  const digest = buildLatestDigest();
  const issue = new Date().toISOString().slice(0, 10);

  const sendOne = async (to: string) => {
    const res = await resend("/emails", {
      method: "POST",
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        reply_to: FROM_EMAIL,
        bcc: "sales@sipiteno.com",
        to,
        subject: digest.subject,
        html: injectUnsubscribeLink(digest.html, to),
        headers: { ...listUnsubscribeHeaders(to), "X-Entity-Ref-ID": `digest-${issue}-${to}` },
        tags: [{ name: "email_key", value: `digest-${issue}` }],
      }),
    });
    const body = await res.json().catch(() => ({}));
    return { ok: res.ok, id: (body as { id?: string }).id, error: res.ok ? undefined : body };
  };

  if (testTo) return NextResponse.json({ mode: "test", fetchedAt, fresh, subject: digest.subject, freshCount, ...(await sendOne(testTo)) });

  if (!fresh) {
    console.error(`[weekly-digest] data too old (fetchedAt=${fetchedAt}), not sending`);
    return NextResponse.json({ ok: false, reason: "stale_data", fetchedAt, ageDays: Math.round(ageDays), freshCount }, { status: 409 });
  }

  const audRes = await resend("/audiences");
  const audienceId = audRes.ok ? pickAudienceId(await audRes.json()) : undefined;
  if (!audienceId) return NextResponse.json({ error: "No audience" }, { status: 500 });
  const cRes = await resend(`/audiences/${audienceId}/contacts`);
  const contacts = cRes.ok ? (((await cRes.json()) as { data?: { email?: string; unsubscribed?: boolean }[] }).data ?? []) : [];
  const recipients = contacts.filter((c) => c.email && !c.unsubscribed && !isExcluded(c.email)).map((c) => c.email!.toLowerCase());

  if (dry) return NextResponse.json({ dry, fetchedAt, freshCount, subject: digest.subject, recipients: recipients.length });

  let sent = 0, gated = 0, failed = 0;
  for (const to of recipients) {
    if (!(await gateAllows(to, "pseo:weekly-digest"))) { gated++; continue; }
    const r = await sendOne(to);
    if (r.ok) sent++; else failed++;
  }
  console.info(`[weekly-digest] ${issue} sent=${sent} gated=${gated} failed=${failed} subject=${digest.subject}`);
  return NextResponse.json({ ok: true, issue, sent, gated, failed, subject: digest.subject });
}
