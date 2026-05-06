import { NextRequest, NextResponse } from "next/server";
import { stripe, getTierFromSession, CREDIT_PACK_SIZES } from "@/lib/stripe";
import { addCredits } from "@/lib/credits";
import { generateApiKeyV2 } from "@/lib/api-key";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "signal@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;
const TELEGRAM_INSIDER_INVITE = process.env.TELEGRAM_INSIDER_INVITE || "";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sendEmail(to: string, subject: string, html: string) {
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to,
      subject,
      html,
    }),
  });
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
<li>85+ startups ranked by engineering acceleration</li>
<li>Filter by sector, stage, and geography</li>
<li>Updated weekly with fresh GitHub data</li>
<li>Priority access to new features</li>
</ul>
<p style="margin:24px 0;"><a href="https://signals.gitdealflow.com/login" style="display:inline-block;background:#0284c7;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Access Your Dashboard</a></p>
<p>Log in with this email address (${escapeHtml(email)}) — we'll send you a magic link, no password needed.</p>
<p>Questions? Just reply to this email.</p>
<p>— The Data Nerd</p>
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
<div style="margin-bottom:24px;"><strong style="color:#0ea5e9;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL — INSIDER CIRCLE</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
<p>You're in. Welcome to the Insider Circle.</p>
<p>Your beta price of <strong>&euro;97/mo is locked in forever</strong>. Here's everything that's included:</p>
<ul style="padding-left:20px;">
<li>Full Dashboard access (85+ startups, all filters)</li>
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
<p style="margin:24px 0;"><a href="https://signals.gitdealflow.com/login" style="display:inline-block;background:#0284c7;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">Access Your Dashboard</a></p>
<p>I'll reach out personally within 24 hours to learn what sectors and stages you care about most.</p>
<p>— The Data Nerd</p>
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p><a href="https://gitdealflow.com" style="color:#0ea5e9;">gitdealflow.com</a></p>
</div>
</div></body></html>`,
  };
}

function sectorSweepWelcomeEmail(email: string): { subject: string; html: string } {
  return {
    subject: "Custom Sector Sweep — your thesis intake form",
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#eab308;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL — SECTOR SWEEP</strong></div>
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
<li>A written walkthrough — like a Loom screencast in text</li>
<li>14-day email Q&amp;A window after delivery</li>
</ul>
<p>If you want to upgrade to Insider Circle within 60 days of delivery, the €1,997 credits 100% — your first ~20 months of Insider are paid.</p>
<p>The "Sweep or It's Free" 14-day refund applies after delivery.</p>
<p>— The Data Nerd</p>
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
    subject: `Your ${packSize} GitDealFlow agent credits — API key inside`,
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#0ea5e9;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL — AGENT CREDITS</strong></div>
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
<li><strong>The 6 free MCP tools stay free</strong> — credits only apply to <code>get_deep_signal</code> and the <code>/api/agent/deep-signal</code> endpoint.</li>
<li><strong>Credits never expire</strong>. Use them when you need them.</li>
<li><strong>Top up</strong> any time at <a href="https://signals.gitdealflow.com/agents/credits" style="color:#0ea5e9;">signals.gitdealflow.com/agents/credits</a>.</li>
</ul>
<p>Reply to this email if you hit anything weird. I read every message.</p>
<p>— The Data Nerd</p>
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
<div style="margin-bottom:24px;"><strong style="color:#d97706;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL — BOOK</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
<p>The €0.99 hit. Thank you for buying the book.</p>
<p>Your downloads:</p>
<table cellpadding="0" cellspacing="0" border="0" style="margin:16px 0;">
<tr>
<td style="padding-right:8px;padding-bottom:8px;"><a href="https://signals.gitdealflow.com/downloads/seven-signals.pdf" style="display:inline-block;background:#0284c7;color:#ffffff;font-weight:600;font-size:15px;padding:11px 22px;border-radius:8px;text-decoration:none;">PDF</a></td>
<td style="padding-right:8px;padding-bottom:8px;"><a href="https://signals.gitdealflow.com/downloads/seven-signals.epub" style="display:inline-block;background:#0284c7;color:#ffffff;font-weight:600;font-size:15px;padding:11px 22px;border-radius:8px;text-decoration:none;">EPUB (Kindle)</a></td>
<td style="padding-right:8px;padding-bottom:8px;"><a href="https://signals.gitdealflow.com/downloads/seven-signals.md" style="display:inline-block;background:#475569;color:#ffffff;font-weight:600;font-size:14px;padding:9px 18px;border-radius:8px;text-decoration:none;">Markdown</a></td>
</tr>
</table>
<p>To read on Kindle: tap the EPUB link on your Kindle device or app, or email it to your kindle.com address. Most Kindle apps now accept EPUB natively; if yours doesn&rsquo;t, drop the file into <a href="https://www.amazon.com/sendtokindle" style="color:#0ea5e9;">Send to Kindle</a> and it will sync within minutes.</p>
<p><strong>The three bonus emails arrive in this order:</strong></p>
<ol style="padding-left:20px;">
<li><strong>Tomorrow</strong> — a fully worked walkthrough of the most recent Series A announcement that the seven-signal stack would have caught, week-by-week, signal-by-signal.</li>
<li><strong>Day 4</strong> — a private link to the unedited interview transcripts with two early-stage developer-investors who use the workflow daily. Names redacted at their request, but the operational detail is intact.</li>
<li><strong>Day 7</strong> — the direct line. Reply to that email with any methodology question and I&rsquo;ll respond personally for thirty days from purchase.</li>
</ol>
<p>If anything in the book breaks for you, reply to this email. I read every message and the next edition folds in your correction with attribution.</p>
<p>— The Data Nerd</p>
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p>Account email: ${escapeHtml(email)} · <a href="https://gitdealflow.com" style="color:#0ea5e9;">gitdealflow.com</a></p>
</div>
</div></body></html>`,
  };
}

function teardownWelcomeEmail(email: string): { subject: string; html: string } {
  // Suppress unused-param warning — email is reserved for future per-recipient
  // personalisation (e.g. inserting the buyer's first name once Stripe captures it).
  void email;
  return {
    subject: "Tweet Teardown — name your startup",
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#f43f5e;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL — TWEET TEARDOWN</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
<p>€1 received. The 24-hour clock starts when you reply with the startup name.</p>
<p>What I need:</p>
<ul style="padding-left:20px;">
<li>The startup name</li>
<li>Their public GitHub org URL if you have it (otherwise I'll find it)</li>
<li>Optional: one sentence on what you already think — bullish, sceptical, or just curious. The kicker insight gets sharper when I know your prior.</li>
</ul>
<p>What lands back in your inbox within 24h on weekdays:</p>
<ul style="padding-left:20px;">
<li>Signal classification (hiring burst / shipping sprint / infra buildout / platform migration)</li>
<li>14-day commit-velocity delta — the actual number, two-period confirmed</li>
<li>The kicker insight — what the data implies for a check-writer this month</li>
</ul>
<p>All in a single tweet-shaped paragraph (≤280 chars). Paste-able into Twitter, into your IC memo, into a partner Slack. Your name is never attached unless you ask.</p>
<p><strong>If the org has no public GitHub footprint:</strong> I refund the €1 within the same hour — no public commit data, no signal to read.</p>
<p><strong>Want to upgrade?</strong> The €1 credits toward the €7 First Look Pass if you check out within 7 days. Reply <code>REQUEST CREDIT</code> to this email and I apply it manually.</p>
<p>— The Data Nerd</p>
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p><a href="https://signals.gitdealflow.com/firstlook" style="color:#0ea5e9;">See the €7 First Look Pass</a> · <a href="https://gitdealflow.com" style="color:#0ea5e9;">gitdealflow.com</a></p>
</div>
</div></body></html>`,
  };
}

function firstLookWelcomeEmail(email: string): { subject: string; html: string } {
  return {
    subject: "First Look Pass — pick your sector",
    html: `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#ff6b1a;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL — FIRST LOOK PASS</strong></div>
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
<p>If you upgrade to the Dashboard (€9.97/mo) within 14 days, the €7 is credited.</p>
<p>— The Data Nerd</p>
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
          "Credit pack purchased but no customer on session — payment link must use customer_creation=always:",
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
      await sendEmail(email, welcomeEmail.subject, welcomeEmail.html);
    } catch (err) {
      console.error("Failed to send welcome email:", err);
    }

    // Notify admin
    try {
      await sendEmail(
        "signal@gitdealflow.com",
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
  }

  return NextResponse.json({ received: true });
}
