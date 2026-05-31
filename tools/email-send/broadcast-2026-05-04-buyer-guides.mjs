#!/usr/bin/env node
/**
 * One-off broadcast: 5 new buyer guides + Top-100 Substack callout + Sector Sweep upsell.
 * Date: 2026-05-04
 *
 * Pulls subscribers from Resend Audience, filters via tester/bot exclusion list,
 * sends individually via Zoho SMTP (warmed, score 98 as of 2026-05-02).
 *
 * Usage:
 *   node tools/email-send/broadcast-2026-05-04-buyer-guides.mjs --dry-run   # preview only
 *   node tools/email-send/broadcast-2026-05-04-buyer-guides.mjs             # actually send
 *   node tools/email-send/broadcast-2026-05-04-buyer-guides.mjs --to=foo@bar.com  # single override
 */

import nodemailer from "nodemailer";
import { readFileSync, appendFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..", "..");

// ---- env load (tools/.env + email-api/.env) ----
function loadEnv(path) {
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf-8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#") || !t.includes("=")) continue;
    const i = t.indexOf("=");
    const k = t.slice(0, i).trim();
    const v = t.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    if (k && !process.env[k]) process.env[k] = v;
  }
}
loadEnv(resolve(ROOT, "tools", ".env"));
loadEnv(resolve(ROOT, "email-api", ".env"));

// ---- args ----
const ARG = (k, d) => {
  const a = process.argv.find((x) => x.startsWith(`--${k}=`));
  return a ? a.split("=")[1] : process.argv.includes(`--${k}`) ? true : d;
};
const DRY = ARG("dry-run", false);
const FORCE_TO = ARG("to", null);

// ---- exclusion (mirror pseo-site/lib/excluded-emails.ts) ----
const TESTER = new Set([
  "test@example.com",
  "mkondratyuk86@gmail.com",
  "maryan.kondratyuk@quickstarter.ai",
  "sales@sipiteno.com",
  "signal@gitdealflow.com",
  "escape@invisibleexit.com",
]);
const BOT = new Set([
  "jakub@mailinator.com",
  "probe1777473122350@deltajohnsons.com",
  "shannon-pool-1777015174929-94zulc@deltajohnsons.com",
]);
const BOT_PATTERNS = [/@mailinator\.com$/i, /@deltajohnsons\.com$/i];

function isExcluded(email) {
  if (!email) return true;
  const e = String(email).trim().toLowerCase();
  if (TESTER.has(e) || BOT.has(e)) return true;
  if (BOT_PATTERNS.some((re) => re.test(e))) return true;
  return false;
}

// ---- email content ----
const SUBJECT = "Top-100 list mirrored to Substack + 9 buyer guides live";
const SITE = "https://gitdealflow.com";
const SIGNALS = "https://signals.gitdealflow.com";
const SUBSTACK = "https://gitdealflow.substack.com/p/top-100-github-signal-startups-week";
const STRIPE = "https://buy.stripe.com/bJe14m34DbNC6gm1by0x204";

function htmlBody() {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#0ea5e9;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">

<p>Two things shipped this week.</p>

<p><strong>1. The full Top-100 startup list is now mirrored to Substack</strong></p>

<p>101 GitHub-tracked startups across 20 sectors, with sector breakdowns and signal type per row. The complete list with the underlying data:</p>
<p><a href="${SUBSTACK}" style="color:#0ea5e9;">gitdealflow.substack.com/p/top-100-github-signal-startups-week</a></p>

<p>Substack is now the canonical mirror &mdash; same data as the apex site, formatted for longer-form reading and forwarding to colleagues.</p>

<p><strong>2. Independent buyer guides for VC tooling</strong></p>

<p>Most VC tooling reviews are written by the firms selling the tooling. These nine aren't:</p>

<ul>
  <li><a href="${SIGNALS}/compare" style="color:#0ea5e9;">Best deal flow tools by stage and persona</a> &mdash; angel investors, seed VCs, solo GPs, emerging fund managers, European investors, AI-focused investors</li>
  <li>Head-to-head: VC Deal Flow Signal vs PitchBook, Harmonic.ai, CB Insights, Dealroom, Crunchbase</li>
  <li>Best free deal flow tools (2026), best GitHub-based deal flow tools, best AI deal sourcing tools</li>
</ul>

<p>Each guide compares lead time, cost, what each tool is actually good for, and what to skip until fund II.</p>

<p>Coming next week: head-to-head comparisons against Tribe Capital (Magnify), SignalFire (Beacon), and Affinity. Reply to this email if you want me to prioritise a specific one.</p>

<p style="margin-top:32px;"><strong>Signal of the week</strong></p>

<p><strong>airbytehq</strong> (Data Infrastructure, +866% commit velocity over the prior period). Full breakdown in Monday's digest.</p>

<div style="margin-top:36px;padding:20px;border:1px solid #e2e8f0;border-radius:8px;background:#f8fafc;">
<p style="margin-top:0;font-size:14px;color:#64748b;letter-spacing:1px;font-weight:600;">SECTOR SWEEP</p>
<p style="margin-bottom:8px;">If you want a single-sector deep-dive &mdash; one sector, top 30 startups, full GitHub signal data, custom angle for your thesis &mdash; I run those as one-off Sector Sweeps.</p>
<p style="margin:8px 0;">EUR 1,997 one-time. Includes commit-velocity timeline (24 months), contributor cohort analysis, and a ranked 30-startup shortlist with signal type per company.</p>
<p style="margin-top:16px;"><a href="${STRIPE}" style="display:block;width:100%;box-sizing:border-box;background:#0284c7;color:#ffffff;font-weight:700;font-size:19px;line-height:1.2;padding:18px 28px;border-radius:10px;text-decoration:none;text-align:center;box-shadow:0 4px 14px rgba(2,132,199,0.35);">Run a Sector Sweep &rarr;</a></p>
</div>

<p style="margin-top:32px;">&mdash; The Data Nerd</p>
<p style="color:#64748b;font-size:14px;">P.S. Reply to this email if you want me to focus on a specific sector or comparison next. The Tribe and SignalFire guides were both reader requests from prior reply threads.</p>

</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p>You&rsquo;re receiving this because you signed up at <a href="${SITE}" style="color:#0ea5e9;">gitdealflow.com</a></p>
<p><a href="${SIGNALS}" style="color:#0ea5e9;">Browse Signals</a> &middot; <a href="mailto:signal@gitdealflow.com?subject=unsubscribe" style="color:#0ea5e9;">Reply to unsubscribe</a></p>
</div>
</div>
</body></html>`;
}

// ---- fetch subscribers ----
async function fetchSubscribers() {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY missing");
  const audRes = await fetch("https://api.resend.com/audiences", {
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
  });
  const audJson = await audRes.json();
  if (!audJson.data?.[0]) throw new Error("No Resend audience found");
  const aid = audJson.data[0].id;
  const cRes = await fetch(`https://api.resend.com/audiences/${aid}/contacts`, {
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
  });
  const cJson = await cRes.json();
  return (cJson.data || []).map((c) => ({
    email: c.email,
    unsubscribed: c.unsubscribed,
    created_at: c.created_at,
  }));
}

// ---- main ----
const required = ["ZOHO_EMAIL", "ZOHO_APP_PASSWORD"];
const missing = required.filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`ERROR: missing env vars: ${missing.join(", ")}`);
  process.exit(1);
}

const all = FORCE_TO
  ? [{ email: FORCE_TO, unsubscribed: false, created_at: new Date().toISOString() }]
  : await fetchSubscribers();

const sendable = all.filter(
  (c) => !c.unsubscribed && !isExcluded(c.email),
);

console.log(`Total contacts: ${all.length}`);
console.log(`Sendable: ${sendable.length}`);
console.log(`Excluded: ${all.length - sendable.length}`);
console.log();
console.log("Sending to:");
sendable.forEach((c) => console.log("  ", c.email));
console.log();
console.log(`Subject: ${SUBJECT}`);
console.log();

if (DRY) {
  console.log("--- DRY RUN: not sending. HTML body length:", htmlBody().length, "chars ---");
  process.exit(0);
}

const fromName = process.env.FROM_NAME || "The Data Nerd";
const fromEmail = process.env.FROM_EMAIL || process.env.ZOHO_EMAIL;
const from = `"${fromName}" <${fromEmail}>`;

const transporter = nodemailer.createTransport({
  host: process.env.ZOHO_SMTP_HOST || "smtppro.zoho.eu",
  port: Number(process.env.ZOHO_SMTP_PORT || 465),
  secure: true,
  auth: { user: process.env.ZOHO_EMAIL, pass: process.env.ZOHO_APP_PASSWORD },
});

const logFile = resolve(__dirname, "sent.jsonl");
const broadcastLogFile = resolve(__dirname, "broadcast-2026-05-04-sent.jsonl");

let sent = 0, failed = 0;
for (const sub of sendable) {
  try {
    const info = await transporter.sendMail({
      from,
      to: sub.email,
      subject: SUBJECT,
      html: htmlBody(),
      replyTo: process.env.ZOHO_EMAIL,
    });
    const entry = {
      ts: new Date().toISOString(),
      to: sub.email,
      messageId: info.messageId,
      subject: SUBJECT,
      campaign: "broadcast-2026-05-04-buyer-guides",
    };
    appendFileSync(logFile, JSON.stringify(entry) + "\n");
    appendFileSync(broadcastLogFile, JSON.stringify(entry) + "\n");
    sent++;
    console.log(`  ✓ sent to ${sub.email} (${info.messageId})`);
    // 1.5s gap between sends — courteous + avoids Zoho throttle
    await new Promise((r) => setTimeout(r, 1500));
  } catch (e) {
    failed++;
    console.error(`  ✗ FAILED ${sub.email}: ${e.message}`);
    appendFileSync(broadcastLogFile, JSON.stringify({
      ts: new Date().toISOString(), to: sub.email, error: e.message,
      campaign: "broadcast-2026-05-04-buyer-guides",
    }) + "\n");
  }
}

console.log();
console.log(`Done. Sent: ${sent}, Failed: ${failed}`);
