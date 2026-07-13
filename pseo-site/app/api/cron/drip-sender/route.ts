/**
 * Deferred Drip Sender — daily cron.
 *
 * PROBLEM: Resend's `scheduled_at` API rejects any email more than 30 days
 * in the future (HTTP 422). The Soap Opera + Seinfeld sequence spans Day 0
 * through Day 180+. Before this cron existed, every email beyond Day 29 was
 * silently dropped — the verify route logged the 422 and moved on. That
 * meant 8+ nurture emails per subscriber (including all tier-specific
 * upsells) never sent.
 *
 * FIX: verify/route.ts now splits each new subscriber's sequence:
 *   • ≤29 days  → scheduled via Resend `scheduled_at` (immediate)
 *   • >29 days  → stored as a JSON plan in the contact's `properties.drip_plan`
 *
 * This cron runs daily, iterates the audience, computes days-since-signup
 * from `created_at`, and sends any deferred email whose day has arrived.
 * Sent emails are tracked in `properties.drip_sent` (comma-separated day
 * numbers) so re-runs are idempotent.
 *
 * Auth:
 *   - Production: Vercel Cron sends `Authorization: Bearer ${CRON_SECRET}`.
 *   - Local + manual: `?dry=1` skips both auth and Resend send, returning
 *     a summary of what would have been sent.
 *
 * Test surfaces:
 *   GET /api/cron/drip-sender?dry=1   → JSON summary, no send, no auth
 *   GET /api/cron/drip-sender         → cron mode (auth required)
 */

import { NextResponse } from "next/server";
import { pickAudienceId } from "@/lib/resend-audience";
import { listUnsubscribeHeaders, injectUnsubscribeLink } from "@/lib/list-unsubscribe";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const CRON_SECRET = process.env.CRON_SECRET;
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";

interface DripEntry {
  d: number; // delay in days
  s: string; // subject
  h: string; // html
}

interface ResendContact {
  id: string;
  email: string;
  created_at: string;
  unsubscribed: boolean;
  properties?: Record<string, string>;
}

async function getAudienceId(): Promise<string | null> {
  const res = await fetch("https://api.resend.com/audiences", {
    headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
  });
  if (!res.ok) return null;
  const body = await res.json();
  return pickAudienceId(body) ?? null;
}

async function getAllContacts(audienceId: string): Promise<ResendContact[]> {
  const res = await fetch(
    `https://api.resend.com/audiences/${audienceId}/contacts`,
    { headers: { Authorization: `Bearer ${RESEND_API_KEY}` } },
  );
  if (!res.ok) return [];
  const body = await res.json();
  return (body.data ?? []) as ResendContact[];
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<boolean> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to,
      subject,
      html: injectUnsubscribeLink(html, to),
      headers: listUnsubscribeHeaders(to),
    }),
  });
  return res.ok;
}

async function updateContactProps(
  audienceId: string,
  email: string,
  props: Record<string, string>,
): Promise<void> {
  await fetch(
    `https://api.resend.com/audiences/${audienceId}/contacts/${encodeURIComponent(email)}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ properties: props }),
    },
  );
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const dry = url.searchParams.get("dry") === "1";

  if (!dry) {
    const auth = request.headers.get("authorization");
    if (!CRON_SECRET || auth !== `Bearer ${CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  if (!RESEND_API_KEY) {
    return NextResponse.json(
      { error: "RESEND_API_KEY not configured" },
      { status: 500 },
    );
  }

  const audienceId = await getAudienceId();
  if (!audienceId) {
    return NextResponse.json({ error: "No audience found" }, { status: 500 });
  }

  const contacts = await getAllContacts(audienceId);
  const now = Date.now();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  let scanned = 0;
  let withPlan = 0;
  let sent = 0;
  let skipped = 0;
  let errors = 0;
  const sentLog: { email: string; day: number; subject: string }[] = [];

  for (const contact of contacts) {
    scanned++;

    // Skip unsubscribed — never send to opted-out contacts.
    if (contact.unsubscribed) continue;

    const planRaw = contact.properties?.drip_plan;
    if (!planRaw) continue;
    withPlan++;

    let plan: DripEntry[];
    try {
      plan = JSON.parse(planRaw);
    } catch {
      continue;
    }

    const createdAt = new Date(contact.created_at).getTime();
    if (isNaN(createdAt)) continue;
    const daysSince = Math.floor((now - createdAt) / ONE_DAY_MS);

    const sentDays = new Set(
      (contact.properties?.drip_sent || "")
        .split(",")
        .filter(Boolean)
        .map(Number),
    );

    for (const entry of plan) {
      if (entry.d > daysSince) continue; // not due yet
      if (sentDays.has(entry.d)) {
        skipped++;
        continue;
      }

      if (dry) {
        sentLog.push({ email: contact.email, day: entry.d, subject: entry.s });
        sent++;
        continue;
      }

      const ok = await sendEmail(contact.email, entry.s, entry.h);
      if (ok) {
        sent++;
        sentDays.add(entry.d);
        sentLog.push({
          email: contact.email,
          day: entry.d,
          subject: entry.s,
        });
      } else {
        errors++;
      }
    }

    // Persist updated sent-tracking after processing all due entries for
    // this contact. Dry run skips the write.
    if (!dry && sentDays.size > 0) {
      await updateContactProps(audienceId, contact.email, {
        drip_plan: planRaw, // preserve
        drip_sent: Array.from(sentDays).sort((a, b) => a - b).join(","),
      });
    }
  }

  return NextResponse.json({
    dry,
    scanned,
    withPlan,
    sent,
    skipped,
    errors,
    sentLog: sentLog.slice(0, 50),
  });
}
