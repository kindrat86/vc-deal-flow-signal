import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe, getTierFromSession, CREDIT_PACK_SIZES } from "@/lib/stripe";
import { addCredits } from "@/lib/credits";
import { generateApiKeyV2 } from "@/lib/api-key";
import { BOOK_DRIP, FIRSTLOOK_REACTIVATION_DRIP } from "@/lib/emails";
import { isNonceUsed, markNonceUsed } from "@/lib/runtime-cache";
import { fireRedditPurchase } from "@/lib/reddit-conversions-api";
import { listUnsubscribeHeaders } from "@/lib/list-unsubscribe";
import { isExcluded } from "@/lib/excluded-emails";
import { pickAudienceId } from "@/lib/resend-audience";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
const TELEGRAM_INSIDER_INVITE = process.env.TELEGRAM_INSIDER_INVITE || "";

// Stripe retries `checkout.session.completed` on any non-2xx response and on
// transient network errors, with the same `event.id`. Without dedup, a retry
// would re-send the welcome email, re-credit a credit pack, re-queue the book
// drip, and re-notify the admin. We mark the event ID in Runtime Cache the
// moment the handler enters the post-verify branch and bail on replay. 14-day
// TTL covers Stripe's max retry window (3 days) with comfortable headroom.
const STRIPE_EVENT_NAMESPACE = "stripe-webhook-event";
const STRIPE_EVENT_TTL_SECONDS = 14 * 86_400;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendEmail(
  to: string,
  subject: string,
  html: string,
  opts: { subscriberFacing?: boolean } = {},
) {
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      bcc: "sales@sipiteno.com",
      to,
      subject,
      html,
      // Buyer-facing sends carry RFC 8058 List-Unsubscribe (HTTPS one-click +
      // mailto). Admin notifications to our own inbox don't, a one-click on
      // those would suppress the founder's contact.
      ...(opts.subscriberFacing ? { headers: listUnsubscribeHeaders(to) } : {}),
    }),
  });
}

/**
 * Add a Stripe buyer to the Resend audience so they receive future digests
 * and broadcasts. Attribution is packed into `first_name` with the standard
 * gdf-attr-v1 marker (source: "stripe-<tier>"). If the contact already
 * exists (e.g. they subscribed before buying), PATCH `unsubscribed:false` so
 * a previously-unsubscribed buyer re-enters the list, buyers must never
 * silently fall out. Best-effort: a Resend hiccup must not 5xx the webhook.
 */
async function addBuyerToAudience(email: string, source: string) {
  if (!RESEND_API_KEY || isExcluded(email)) return;
  try {
    const audRes = await fetch("https://api.resend.com/audiences", {
      headers: { Authorization: `Bearer ${RESEND_API_KEY}` },
    });
    if (!audRes.ok) return;
    const audiences = await audRes.json();
    const audienceId: string | undefined = pickAudienceId(audiences);
    if (!audienceId) return;
    const res = await fetch(
      `https://api.resend.com/audiences/${audienceId}/contacts`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          first_name: "gdf-attr-v1:" + JSON.stringify({ source }),
          unsubscribed: false,
        }),
      },
    );
    if (!res.ok) {
      await fetch(
        `https://api.resend.com/audiences/${audienceId}/contacts/${encodeURIComponent(email)}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ unsubscribed: false }),
        },
      );
    }
  } catch (err) {
    console.error(`[stripe-webhook] audience-add failed for ${email}:`, err);
  }
}

function dashboardWelcomeEmail(email: string): { subject: string; html: string } {
  return {
    subject: "Your Dashboard is ready",
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#0ea5e9;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
<p>Welcome to VC Deal Flow Signal Dashboard!</p>
<p>Your early access price of <strong>&euro;9.97/mo is locked in forever</strong>. Here's what's waiting for you:</p>
<ul style="padding-left:20px;">
<li>140 startups ranked by engineering acceleration</li>
<li>Filter by sector, stage, and geography</li>
<li>Updated weekly with fresh GitHub data</li>
<li>Priority access to new features</li>
</ul>
<p style="margin:24px 0;"><a href="https://signals.gitdealflow.com/login" style="display:block;width:100%;box-sizing:border-box;background:#0284c7;color:#fff;font-weight:700;font-size:19px;line-height:1.2;padding:18px 28px;border-radius:10px;text-decoration:none;text-align:center;box-shadow:0 4px 14px rgba(2,132,199,0.35);">Access Your Dashboard</a></p>
<p>Log in with this email address (${escapeHtml(email)}), we'll send you a magic link, no password needed.</p>
<p>Questions? Just reply to this email.</p>
<p style="margin-top:28px;padding:16px 18px;background:#f0f9ff;border-left:3px solid #0284c7;border-radius:4px;font-size:14px;line-height:1.6;color:#0c4a6e;">
<strong>Already running this for an active fund?</strong> The next rung is the <a href="https://signals.gitdealflow.com/insider?utm_source=email&amp;utm_medium=dashboard-welcome&amp;utm_campaign=insider" style="color:#0284c7;font-weight:600;">Insider Circle</a>: Dashboard + private investor Telegram + monthly briefing call + custom watchlists + API access + direct line to me. €97/mo founding price (locked, list is €197). Reply <code>upgrade me</code> any time and I'll credit your current month.
</p>
<p>The Data Nerd</p>
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p><a href="https://gitdealflow.com" style="color:#0ea5e9;">gitdealflow.com</a></p>
</div>
</div></body></html>`,
  };
}

function insiderWelcomeEmail(email: string): { subject: string; html: string } {
  const telegramLine = TELEGRAM_INSIDER_INVITE
    ? `<li><strong>Join the private Telegram group:</strong> <a href="${TELEGRAM_INSIDER_INVITE}" style="color:#0ea5e9;">${TELEGRAM_INSIDER_INVITE}</a></li>`
    : `<li><strong>Private Telegram group:</strong> I'll send your invite link within 24 hours.</li>`;

  return {
    subject: "Welcome to the Insider Circle",
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#0ea5e9;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL, INSIDER CIRCLE</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
<p>You're in. Welcome to the Insider Circle.</p>
<p>Your beta price of <strong>&euro;97/mo is locked in forever</strong>. Here's everything that's included:</p>
<ul style="padding-left:20px;">
<li>Full Dashboard access (140 startups, all filters)</li>
<li>Private investor Telegram group</li>
<li>Monthly live signal briefing call</li>
<li>Custom watchlists</li>
<li>API access</li>
<li>Direct line to the founder</li>
</ul>
<p style="font-weight:600;">Your next steps:</p>
<ol style="padding-left:20px;">
<li><strong>Access your Dashboard:</strong> <a href="https://signals.gitdealflow.com/login" style="color:#0ea5e9;">Log in here</a> with ${escapeHtml(email)}</li>
${telegramLine}
</ol>
<p style="margin:24px 0;"><a href="https://signals.gitdealflow.com/login" style="display:block;width:100%;box-sizing:border-box;background:#0284c7;color:#fff;font-weight:700;font-size:19px;line-height:1.2;padding:18px 28px;border-radius:10px;text-decoration:none;text-align:center;box-shadow:0 4px 14px rgba(2,132,199,0.35);">Access Your Dashboard</a></p>
<p>I'll reach out personally within 24 hours to learn what sectors and stages you care about most.</p>
<p style="margin-top:28px;padding:16px 18px;background:#fef3c7;border-left:3px solid #d97706;border-radius:4px;font-size:14px;line-height:1.6;color:#78350f;">
<strong>Investing seven-figure cheques into a defined sector?</strong> The next rung is <a href="mailto:signals@gitdealflow.com?subject=Sharp%20Tier%20Application%20%E2%80%94%20%5BYour%20Fund%5D" style="color:#d97706;font-weight:600;">Sharp Tier</a> (€497/mo or €4,970/yr, saves two months), adds quarterly portfolio review call, white-labeled <code>/api/v1/sharp/&lt;your-fund&gt;</code> data feed, custom thesis-aligned watchlist co-built with me, same-day signal questions (typically &lt;4h), data-room exports for LP updates, all future paid MCP tools included. <strong>Capped at 8 funds in 2026, applications reviewed within 48h.</strong> Or grab a one-off <a href="https://gitdealflow.com/sector-sweep?utm_source=email&amp;utm_medium=insider-welcome&amp;utm_campaign=sector-sweep" style="color:#d97706;font-weight:600;">Custom Sector Sweep</a> (€1,997 one-time) for a single thesis cycle.
</p>
<p>The Data Nerd</p>
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p><a href="https://gitdealflow.com" style="color:#0ea5e9;">gitdealflow.com</a></p>
</div>
</div></body></html>`,
  };
}

function sectorSweepWelcomeEmail(email: string): { subject: string; html: string } {
  return {
    subject: "Custom Sector Sweep, your thesis intake form",
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#eab308;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL, SECTOR SWEEP</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
<p>Thank you for commissioning a Custom Sector Sweep. The €1,997 is locked in.</p>
<p>To start the 10-business-day clock, I need your thesis. Reply to this email with the following five fields:</p>
<ol style="padding-left:20px;">
<li><strong>Sector / sub-sector you want covered</strong> (e.g. AI infra, fintech rails, climate sensors, vertical SaaS)</li>
<li><strong>Geography focus</strong> (US / EU / APAC / global)</li>
<li><strong>Stage filter</strong> (pre-seed / seed / Series A / mixed)</li>
<li><strong>Specific question you want answered</strong> (e.g. "which AI-infra orgs are accelerating without a Series A yet")</li>
<li><strong>Orgs you already know about</strong> (so I focus discovery on net-new)</li>
</ol>
<p>Once your reply lands, the 10-business-day clock starts. Your delivery will be:</p>
<ul style="padding-left:20px;">
<li>The 40-page Sector Sweep PDF</li>
<li>The raw CSV (every org, every metric)</li>
<li>A written walkthrough, like a Loom screencast in text</li>
<li>14-day email Q&amp;A window after delivery</li>
</ul>
<p>If you want to upgrade to Insider Circle within 60 days of delivery, the €1,997 credits 100%, your first ~20 months of Insider are paid.</p>
<p>The "Sweep or It's Free" 30-day refund applies after delivery, reply REFUND to this email.</p>
<p style="margin-top:28px;padding:16px 18px;background:#fef3c7;border-left:3px solid #d97706;border-radius:4px;font-size:14px;line-height:1.6;color:#78350f;">
<strong>If your fund needs this on a quarterly cadence, not a one-off?</strong> The apex tier is <a href="mailto:signals@gitdealflow.com?subject=Sharp%20Tier%20Application%20%E2%80%94%20%5BYour%20Fund%5D" style="color:#d97706;font-weight:600;">Sharp Tier</a> (€497/mo or €4,970/yr), quarterly portfolio review call, white-labeled <code>/api/v1/sharp/&lt;your-fund&gt;</code> data feed, custom watchlist co-built with me, same-day questions (&lt;4h), data-room exports for LP updates. <strong>Capped at 8 funds in 2026, applications reviewed in 48h.</strong> The €1,997 from this Sweep counts toward your first two months if you're approved.
</p>
<p>The Data Nerd</p>
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p><a href="https://gitdealflow.com/sector-sweep" style="color:#0ea5e9;">Sector Sweep page</a> · <a href="https://gitdealflow.com" style="color:#0ea5e9;">gitdealflow.com</a></p>
</div>
</div></body></html>`,
  };
}

function creditPackWelcomeEmail(
  email: string,
  apiKey: string,
  packSize: number
): { subject: string; html: string } {
  const safeKey = escapeHtml(apiKey);
  const safePack = String(packSize);
  return {
    subject: `Your ${packSize} GitDealFlow agent credits, API key inside`,
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#0ea5e9;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL, AGENT CREDITS</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
<p>You bought ${safePack} agent credits. One credit = one deep-signal call from any LLM agent or programmatic caller.</p>
<p><strong>Your API key</strong> (paste into agent runtime as <code>GITDEALFLOW_API_KEY</code>):</p>
<pre style="background:#0f172a;color:#7dd3fc;padding:16px;border-radius:8px;font-family:'SF Mono',Menlo,monospace;font-size:13px;overflow-x:auto;">${safeKey}</pre>
<p><strong>Try it now</strong>:</p>
<pre style="background:#0f172a;color:#86efac;padding:16px;border-radius:8px;font-family:'SF Mono',Menlo,monospace;font-size:13px;overflow-x:auto;">curl -X POST https://signals.gitdealflow.com/api/agent/deep-signal \\
  -H "Authorization: Bearer ${safeKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"name":"supabase"}'</pre>
<p><strong>Check balance any time</strong>:</p>
<pre style="background:#0f172a;color:#86efac;padding:16px;border-radius:8px;font-family:'SF Mono',Menlo,monospace;font-size:13px;overflow-x:auto;">curl https://signals.gitdealflow.com/api/account/credits \\
  -H "Authorization: Bearer ${safeKey}"</pre>
<ul style="padding-left:20px;">
<li><strong>1 credit = 1 deep signal returned.</strong> Misses (startup not in our universe) are free.</li>
<li><strong>The 6 free MCP tools stay free</strong>: credits only apply to <code>get_deep_signal</code> and the <code>/api/agent/deep-signal</code> endpoint.</li>
<li><strong>Credits never expire</strong>. Use them when you need them.</li>
<li><strong>Top up</strong> any time at <a href="https://signals.gitdealflow.com/agents/credits" style="color:#0ea5e9;">signals.gitdealflow.com/agents/credits</a>.</li>
</ul>
<p>Reply to this email if you hit anything weird. I read every message.</p>
<p style="margin-top:28px;padding:16px 18px;background:#f0f9ff;border-left:3px solid #0284c7;border-radius:4px;font-size:14px;line-height:1.6;color:#0c4a6e;">
<strong>Hitting the API regularly for a fund?</strong> The <a href="https://signals.gitdealflow.com/insider?utm_source=email&amp;utm_medium=credits-welcome&amp;utm_campaign=insider" style="color:#0284c7;font-weight:600;">Insider Circle</a> bundles unlimited dashboard access + private investor Telegram + monthly briefing call + custom watchlists + API access + direct line to me for €97/mo (founding price, locked). Cheaper than buying credit packs once you're past ~50 deep-signal calls/month. Reply <code>insider me</code> and I'll move you over.
</p>
<p>The Data Nerd</p>
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p>Account email: ${escapeHtml(email)} · <a href="https://gitdealflow.com" style="color:#0ea5e9;">gitdealflow.com</a></p>
</div>
</div></body></html>`,
  };
}

function bookWelcomeEmail(email: string): { subject: string; html: string } {
  return {
    subject: "Your Kindle copy is ready (+ the three bonus emails)",
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#d97706;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL, BOOK</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
<p>The €0.99 hit. Thank you for buying the book.</p>
<p>Your downloads:</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="width:100%;margin:16px 0;">
<tr><td style="padding-bottom:10px;"><a href="https://signals.gitdealflow.com/downloads/seven-signals.pdf" style="display:block;width:100%;box-sizing:border-box;background:#0284c7;color:#ffffff;font-weight:700;font-size:19px;line-height:1.2;padding:18px 28px;border-radius:10px;text-decoration:none;text-align:center;box-shadow:0 4px 14px rgba(2,132,199,0.35);">PDF</a></td></tr>
<tr><td style="padding-bottom:10px;"><a href="https://signals.gitdealflow.com/downloads/seven-signals.epub" style="display:block;width:100%;box-sizing:border-box;background:#0284c7;color:#ffffff;font-weight:700;font-size:19px;line-height:1.2;padding:18px 28px;border-radius:10px;text-decoration:none;text-align:center;box-shadow:0 4px 14px rgba(2,132,199,0.35);">EPUB (Kindle)</a></td></tr>
<tr><td><a href="https://signals.gitdealflow.com/downloads/seven-signals.md" style="display:block;width:100%;box-sizing:border-box;background:#475569;color:#ffffff;font-weight:700;font-size:19px;line-height:1.2;padding:18px 28px;border-radius:10px;text-decoration:none;text-align:center;box-shadow:0 4px 14px rgba(71,85,105,0.35);">Markdown</a></td></tr>
</table>
<p>To read on Kindle: tap the EPUB link on your Kindle device or app, or email it to your kindle.com address. Most Kindle apps now accept EPUB natively; if yours doesn&rsquo;t, drop the file into <a href="https://www.amazon.com/sendtokindle" style="color:#0ea5e9;">Send to Kindle</a> and it will sync within minutes.</p>
<p><strong>The three bonus emails arrive in this order:</strong></p>
<ol style="padding-left:20px;">
<li><strong>Tomorrow</strong>: a fully worked walkthrough of the most recent Series A announcement that the seven-signal stack would have caught, week-by-week, signal-by-signal.</li>
<li><strong>Day 4</strong>: the unedited interview transcripts with two early-stage investors who run a version of this daily, inline in this thread. Names redacted at their request, but the operational detail is intact.</li>
<li><strong>Day 7</strong>: the direct line. Reply to that email with any methodology question and I&rsquo;ll respond personally for thirty days from purchase.</li>
</ol>
<p>If anything in the book breaks for you, reply to this email. I read every message and the next edition folds in your correction with attribution.</p>
<p>The Data Nerd</p>
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p>Account email: ${escapeHtml(email)} · <a href="https://gitdealflow.com" style="color:#0ea5e9;">gitdealflow.com</a></p>
</div>
</div></body></html>`,
  };
}

function teardownWelcomeEmail(email: string): { subject: string; html: string } {
  // Suppress unused-param warning, email is reserved for future per-recipient
  // personalisation (e.g. inserting the buyer's first name once Stripe captures it).
  void email;
  return {
    subject: "Tweet Teardown, name your startup",
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#f43f5e;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL, TWEET TEARDOWN</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
<p>€1 received. The 24-hour clock starts when you reply with the startup name.</p>
<p>What I need:</p>
<ul style="padding-left:20px;">
<li>The startup name</li>
<li>Their public GitHub org URL if you have it (otherwise I'll find it)</li>
<li>Optional: one sentence on what you already think, bullish, sceptical, or just curious. The kicker insight gets sharper when I know your prior.</li>
</ul>
<p>What lands back in your inbox within 24h on weekdays:</p>
<ul style="padding-left:20px;">
<li>Signal classification (hiring burst / shipping sprint / infra buildout / platform migration)</li>
<li>14-day commit-velocity delta, the actual number, two-period confirmed</li>
<li>The kicker insight, what the data implies for a check-writer this month</li>
</ul>
<p>All in a single tweet-shaped paragraph (≤280 chars). Paste-able into Twitter, into your IC memo, into a partner Slack. Your name is never attached unless you ask.</p>
<p><strong>If the org has no public GitHub footprint:</strong> I refund the €1 within the same hour, no public commit data, no signal to read.</p>
<p><strong>Want to upgrade?</strong> The €1 credits toward the €7 First Look Pass if you check out within 7 days. Reply <code>REQUEST CREDIT</code> to this email and I apply it manually.</p>
<p>The Data Nerd</p>
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p><a href="https://signals.gitdealflow.com/firstlook" style="color:#0ea5e9;">See the €7 First Look Pass</a> · <a href="https://gitdealflow.com" style="color:#0ea5e9;">gitdealflow.com</a></p>
</div>
</div></body></html>`,
  };
}

function firstLookWelcomeEmail(email: string): { subject: string; html: string } {
  return {
    subject: "First Look Pass, pick your sector",
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#ff6b1a;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL, FIRST LOOK PASS</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
<p>Thanks for grabbing the First Look Pass. Reply to this email with the sector you want and I'll ship the deep dive within 24 hours.</p>
<p>Tracked sectors (pick one):</p>
<p style="color:#64748b;">AI / ML, Fintech, Climate Tech, Developer Tools, Cybersecurity, Healthcare, Enterprise SaaS, Data Infrastructure, Web3, Robotics, HR Tech, PropTech, EdTech, MarTech, LegalTech, GovTech, Mobility, Gaming, Logistics, Bio.</p>
<p>What you'll get:</p>
<ul style="padding-left:20px;">
<li>Top 25 ranked orgs in your sector</li>
<li>14-day acceleration deltas + contributor maps</li>
<li>Top 3 names that haven't shown up on Crunchbase yet</li>
<li>Raw CSV + ranked PDF</li>
</ul>
<p>If you upgrade to the Dashboard (€49/mo) within 14 days, the €7 is credited.</p>
<p style="margin-top:24px;padding:14px 16px;background:#fff7ed;border-left:3px solid #FF6B1A;border-radius:4px;font-size:14px;line-height:1.6;color:#7c2d12;">
<strong>Allocating into a sector at fund scale?</strong> The <a href="https://gitdealflow.com/sector-sweep?utm_source=email&amp;utm_medium=firstlook-welcome&amp;utm_campaign=sector-sweep" style="color:#FF6B1A;font-weight:600;">Custom Sector Sweep</a> is the same engineering-acceleration lens across every venture-backed startup in one sector, written report in 7 business days, plus a clarifications call. €1,997 one-time. Mention it in your reply if you want to skip ahead.
</p>
<p>The Data Nerd</p>
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p><a href="https://gitdealflow.com" style="color:#0ea5e9;">gitdealflow.com</a></p>
</div>
</div></body></html>`,
  };
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Replay defense: Stripe retries on 5xx with the same event.id. Mark
    // before side effects fire so a concurrent retry racing the first
    // delivery cannot double-charge credits / double-send emails. The
    // mark-then-check ordering is intentional, `markNonceUsed` is
    // idempotent in the underlying Runtime Cache, so re-marking on a real
    // first delivery costs nothing, while a true retry sees the prior mark.
    if (await isNonceUsed(STRIPE_EVENT_NAMESPACE, event.id)) {
      console.log(`[stripe-webhook] replay suppressed: ${event.id}`);
      return NextResponse.json({ received: true, replay: true });
    }
    await markNonceUsed(STRIPE_EVENT_NAMESPACE, event.id, STRIPE_EVENT_TTL_SECONDS);

    // Fetch full session with line items + customer (credit pack tier needs the customer ID)
    const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
      expand: ["line_items", "customer"],
    });

    const email = fullSession.customer_details?.email;
    if (!email) {
      console.error("No email in checkout session:", session.id);
      return NextResponse.json({ received: true });
    }

    const tier = getTierFromSession(fullSession);

    let welcomeEmail: { subject: string; html: string };
    if (tier === "agent_credits_100") {
      const customerId =
        typeof fullSession.customer === "string"
          ? fullSession.customer
          : fullSession.customer?.id;
      if (!customerId) {
        console.error(
          "Credit pack purchased but no customer on session, payment link must use customer_creation=always:",
          session.id
        );
        return NextResponse.json({ received: true });
      }
      const packSize = CREDIT_PACK_SIZES[tier];
      try {
        await addCredits(customerId, packSize);
      } catch (err) {
        console.error("Failed to add credits:", err);
        return NextResponse.json(
          { error: "credit_ledger_write_failed" },
          { status: 500 }
        );
      }
      const apiKey = generateApiKeyV2(customerId);
      welcomeEmail = creditPackWelcomeEmail(email, apiKey, packSize);
    } else if (tier === "insider") {
      welcomeEmail = insiderWelcomeEmail(email);
    } else if (tier === "sector_sweep") {
      welcomeEmail = sectorSweepWelcomeEmail(email);
    } else if (tier === "firstlook") {
      welcomeEmail = firstLookWelcomeEmail(email);
    } else if (tier === "book") {
      welcomeEmail = bookWelcomeEmail(email);
    } else if (tier === "teardown") {
      welcomeEmail = teardownWelcomeEmail(email);
    } else {
      welcomeEmail = dashboardWelcomeEmail(email);
    }

    try {
      await sendEmail(email, welcomeEmail.subject, welcomeEmail.html, {
        subscriberFacing: true,
      });
    } catch (err) {
      console.error("Failed to send welcome email:", err);
    }

    // Buyers must not fall out of the list, add (or re-activate) the buyer
    // on the Resend audience with stripe-tier attribution.
    await addBuyerToAudience(email, `stripe-${tier}`);

    // Book buyers: queue the +1d / +4d / +7d follow-ups promised in the
    // welcome email. Best-effort, a Resend hiccup must not 5xx out of this
    // handler and trigger Stripe to retry the whole webhook (which would
    // double-send the welcome and double-queue the drip).
    if (tier === "book") {
      const now = Date.now();
      for (const drip of BOOK_DRIP) {
        const sendAt = new Date(now + drip.delayMs).toISOString();
        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: `${FROM_NAME} <${FROM_EMAIL}>`,
              bcc: "sales@sipiteno.com",
              to: email,
              subject: drip.subject,
              html: drip.html,
              scheduled_at: sendAt,
              headers: listUnsubscribeHeaders(email),
            }),
          });
          if (!res.ok) {
            const errText = await res.text();
            console.error(
              `Failed to schedule book drip "${drip.subject}" for ${email}:`,
              errText,
            );
          }
        } catch (err) {
          console.error(
            `Error scheduling book drip "${drip.subject}" for ${email}:`,
            err,
          );
        }
      }
    }

    // First Look buyers: queue the +7d / +10d / +13d 14-day Dashboard-credit
    // reactivation drip, Brunson DotCom Secrets Ch 13 ("the bait + the
    // 14-day reactivation window"). The credit promise on /firstlook expires
    // silently without these. Same best-effort pattern as the book drip:
    // a Resend hiccup must not 5xx out of this handler.
    if (tier === "firstlook") {
      const now = Date.now();
      for (const drip of FIRSTLOOK_REACTIVATION_DRIP) {
        const sendAt = new Date(now + drip.delayMs).toISOString();
        try {
          const res = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: `${FROM_NAME} <${FROM_EMAIL}>`,
              bcc: "sales@sipiteno.com",
              to: email,
              subject: drip.subject,
              html: drip.html,
              scheduled_at: sendAt,
              headers: listUnsubscribeHeaders(email),
            }),
          });
          if (!res.ok) {
            const errText = await res.text();
            console.error(
              `Failed to schedule firstlook drip "${drip.subject}" for ${email}:`,
              errText,
            );
          }
        } catch (err) {
          console.error(
            `Error scheduling firstlook drip "${drip.subject}" for ${email}:`,
            err,
          );
        }
      }
    }

    // Notify admin
    try {
      await sendEmail(
        "signals@gitdealflow.com",
        `New ${tier} subscriber: ${email}`,
        `<p><strong>New paying subscriber!</strong></p>
<p>Email: ${escapeHtml(email)}</p>
<p>Tier: ${escapeHtml(tier)}</p>
<p>Stripe Session: ${escapeHtml(session.id)}</p>
<p>Time: ${new Date().toISOString()}</p>`
      );
    } catch {
      // Admin notification is best-effort
    }

    // Reddit Conversions API, fire `Purchase` server-side. Survives
    // ad-blockers, ITP cookie partitioning, and any Reddit pixel-side
    // outage. Reddit dedups against the browser pixel hit via the
    // (stripeEventId-derived) conversion_id so the same order isn't
    // counted twice. Wrapped in catch, a Reddit-side failure here must
    // never 5xx the webhook (Stripe would retry → double-credit).
    try {
      const utm = (fullSession.metadata || {}) as Record<string, string>;
      const amountEUR = (fullSession.amount_total || 0) / 100;
      await fireRedditPurchase({
        email,
        amountEUR,
        tier,
        stripeEventId: event.id,
        utmSource: utm.utm_source,
        utmCampaign: utm.utm_campaign,
        utmContent: utm.utm_content,
      });
    } catch (capiErr) {
      console.error("[reddit-capi] Purchase dispatch error:", capiErr);
    }
  }

  // One-click OTO purchases come through as PaymentIntents (one-time, e.g.
  // Sector Sweep bumped) or Subscription invoices (recurring, e.g. Insider).
  // Both carry metadata.flow === "oto_one_click" so we can route off-session
  // welcome emails without touching the entry-checkout branch above.
  if (event.type === "payment_intent.succeeded") {
    const pi = event.data.object;
    // Only PaymentIntents created directly via /api/oto/charge carry
    // metadata.flow="oto_one_click". Subscription invoices' PIs don't
    // inherit subscription metadata, so they're ignored here and picked
    // up by the invoice.paid handler below, no double-send.
    if (pi.metadata?.flow === "oto_one_click") {
      // Same replay defense as the entry-checkout branch, Stripe retries
      // identical event.id on 5xx, so dedupe before sending the welcome.
      if (await isNonceUsed(STRIPE_EVENT_NAMESPACE, event.id)) {
        return NextResponse.json({ received: true, replay: true });
      }
      await markNonceUsed(STRIPE_EVENT_NAMESPACE, event.id, STRIPE_EVENT_TTL_SECONDS);
      const oto = pi.metadata.oto;
      const email = await resolveOtoEmail(pi.metadata.email, pi.customer);
      if (!email) {
        console.error("oto pi.succeeded without email:", pi.id);
        return NextResponse.json({ received: true });
      }
      await dispatchOtoWelcome(email, oto, pi.id);
    }
  }

  if (event.type === "invoice.paid") {
    const invoice = event.data.object;
    if (invoice.billing_reason !== "subscription_create") {
      return NextResponse.json({ received: true });
    }
    if (await isNonceUsed(STRIPE_EVENT_NAMESPACE, event.id)) {
      return NextResponse.json({ received: true, replay: true });
    }
    await markNonceUsed(STRIPE_EVENT_NAMESPACE, event.id, STRIPE_EVENT_TTL_SECONDS);
    const subId = subscriptionIdFromInvoice(invoice);
    if (!subId) return NextResponse.json({ received: true });
    const sub = await stripe.subscriptions.retrieve(subId);
    if (sub.metadata?.flow !== "oto_one_click") {
      return NextResponse.json({ received: true });
    }
    const oto = sub.metadata.oto;
    const email = await resolveOtoEmail(sub.metadata.email, sub.customer);
    if (!email) {
      console.error("oto invoice.paid without email:", invoice.id);
      return NextResponse.json({ received: true });
    }
    await dispatchOtoWelcome(email, oto, sub.id);
  }

  return NextResponse.json({ received: true });
}

function subscriptionIdFromInvoice(invoice: Stripe.Invoice): string | null {
  // The Stripe SDK type narrows differently across API versions; resolve
  // both shapes (string id vs expanded object) defensively.
  const raw = (invoice as unknown as { subscription?: unknown }).subscription;
  if (typeof raw === "string") return raw;
  if (raw && typeof raw === "object" && "id" in raw) {
    const id = (raw as { id?: unknown }).id;
    if (typeof id === "string") return id;
  }
  return null;
}

async function resolveOtoEmail(
  metaEmail: string | undefined,
  customerRef: string | Stripe.Customer | Stripe.DeletedCustomer | null
): Promise<string | null> {
  if (metaEmail) return metaEmail;
  const customerId =
    typeof customerRef === "string"
      ? customerRef
      : customerRef && "id" in customerRef
        ? customerRef.id
        : null;
  if (!customerId) return null;
  try {
    const cust = await stripe.customers.retrieve(customerId);
    if (cust.deleted) return null;
    return cust.email || null;
  } catch {
    return null;
  }
}

async function dispatchOtoWelcome(email: string, oto: string | undefined, ref: string) {
  let welcomeEmail: { subject: string; html: string } | null = null;
  if (oto === "sector_sweep_oto1") {
    welcomeEmail = sectorSweepWelcomeEmail(email);
  } else if (oto === "insider_oto2") {
    welcomeEmail = insiderWelcomeEmail(email);
  }
  if (!welcomeEmail) {
    console.warn("oto webhook: unknown oto key:", oto);
    return;
  }
  try {
    await sendEmail(email, welcomeEmail.subject, welcomeEmail.html, {
      subscriberFacing: true,
    });
  } catch (err) {
    console.error("oto welcome send failed:", err);
  }
  // OTO buyers must not fall out of the list either.
  await addBuyerToAudience(email, `stripe-${oto}`);
  try {
    await sendEmail(
      "signals@gitdealflow.com",
      `OTO upsell taken: ${oto} · ${email}`,
      `<p><strong>OTO upsell.</strong></p>
<p>Email: ${escapeHtml(email)}</p>
<p>OTO: ${escapeHtml(oto || "")}</p>
<p>Stripe ref: ${escapeHtml(ref)}</p>
<p>Time: ${new Date().toISOString()}</p>`
    );
  } catch {
    // best-effort
  }
}
