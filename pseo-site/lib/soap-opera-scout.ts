/**
 * Brunson Soap Opera Sequence for new scouts.
 *
 * Day 1 (immediate) = welcome + confirmation — handled inline in /api/scout/predict.
 * Days 2-5 below are scheduled via Resend `scheduled_at` at scout creation.
 *
 * Tone: first-person, no corporate voice, declarative, plain text feel.
 * Brunson structure: hook → open loop → story → close with soft CTA.
 */

import "server-only";
import { isExcluded } from "@/lib/excluded-emails";
import { listUnsubscribeHeaders, injectUnsubscribeLink } from "@/lib/list-unsubscribe";
import { gateAllows } from "@/lib/send-gate";

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const FROM_EMAIL = process.env.FROM_EMAIL || "signals@gitdealflow.com";
const FROM_NAME = process.env.FROM_NAME || "The Data Nerd";
const SITE_URL = process.env.SITE_URL || "https://signals.gitdealflow.com";

interface ScoutContext {
  email: string;
  handle: string;
  dashboardUrl: string;
  profileUrl: string;
}

function wrap(title: string, body: string, dashboardUrl: string) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#0ea5e9;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
${body}
<div style="text-align:center;margin:32px 0;">
<a href="${dashboardUrl}" style="display:block;width:100%;box-sizing:border-box;background:#0284c7;color:#ffffff;font-weight:700;font-size:19px;line-height:1.2;padding:18px 28px;border-radius:10px;text-decoration:none;text-align:center;box-shadow:0 4px 14px rgba(2,132,199,0.35);">Open your scout dashboard</a>
</div>
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p>You received this because you made a prediction at <a href="${SITE_URL}/predict" style="color:#0ea5e9;">signals.gitdealflow.com/predict</a>.</p>
<p>Reply to this email to opt out of the onboarding series — you&rsquo;ll still keep your scout account and all your predictions.</p>
</div>
</div>
</body></html>`;
}

function day2(ctx: ScoutContext) {
  return {
    subject: `Why I built this (the 14-month call story)`,
    html: wrap(
      "Day 2",
      `
<p>Welcome back, @${ctx.handle}.</p>
<p>Here is the story that made me build this.</p>
<p>Two years ago I was tracking a Brazilian healthtech on GitHub. Solo founder, 20 commits a week, boring open source code.</p>
<p>Month four: three contributors appeared. Issues labeled <code>customer:acme-corp</code>. A <code>/billing</code> directory.</p>
<p>Month seven: CI pipelines deploying to four environments.</p>
<p>Month nine: an enterprise feature-flag module.</p>
<p>Month fourteen: twelve million Series A from a tier-one firm. TechCrunch covered it.</p>
<p>Every single signal was public. None of them were on Crunchbase.</p>
<p>If I had been watching that graph with a scout account, I would have called it at month four. Eight months early.</p>
<p>That is what you are doing here. You are calling the ones you see.</p>
<p>Tomorrow I will send you the five specific signals we look for. Use them on your next prediction.</p>
<p>&mdash; The Data Nerd</p>
`,
      ctx.dashboardUrl,
    ),
  };
}

function day3(ctx: ScoutContext) {
  return {
    subject: `The 5 signals I watch every Monday`,
    html: wrap(
      "Day 3",
      `
<p>@${ctx.handle} — five signals. In order of leading-ness.</p>
<ol>
<li><strong>Contributor acceleration.</strong> A jump from 1 to 4 contributors in 90 days means they already closed a hire round.</li>
<li><strong>Commit velocity.</strong> Median funded pre-seed runs 38 commits a week the quarter before announcement. Unfunded runs 11.</li>
<li><strong>Directory names.</strong> <code>/billing</code>, <code>/enterprise</code>, <code>/admin</code> leak the monetization roadmap.</li>
<li><strong>Issue labels with company names.</strong> <code>customer:stripe</code> in issues means a named design partner. Revenue signal, 12 months early.</li>
<li><strong>Release cadence stabilizing.</strong> From random pushes to weekly tagged releases means the team is selling. Shipping stops being building.</li>
</ol>
<p>Run these against a GitHub org before you make your call. The scout game rewards you for calling at the earliest visible sign.</p>
<p>Your next prediction form is here: <a href="${SITE_URL}/predict" style="color:#0ea5e9;">signals.gitdealflow.com/predict</a></p>
<p>&mdash; The Data Nerd</p>
`,
      ctx.dashboardUrl,
    ),
  };
}

function day4(ctx: ScoutContext) {
  return {
    subject: `One of our scouts called it at month 3`,
    html: wrap(
      "Day 4",
      `
<p>@${ctx.handle} — real scout on the board right now (anonymized).</p>
<p>Month 3 after a solo dev started pushing, she called it. Confidence 78%. Rationale: "Repo renamed from prototype to product. Contributor joined from a YC founder&rsquo;s circle."</p>
<p>Month 10: seed round announced. She hit. +7 points. Streak continued.</p>
<p>Her public profile is live. People share it. She does not run a fund. She runs an angel checkbook and a full-time engineering job.</p>
<p>That is the whole game. You do not need to be at Sequoia to read the signal. The signal is public, your eyes work, and now you have a scoreboard.</p>
<p>If you have not made a second prediction yet, pick any startup you have been quietly watching. Call it. It counts.</p>
<p>&mdash; The Data Nerd</p>
`,
      ctx.dashboardUrl,
    ),
  };
}

function day5(ctx: ScoutContext) {
  return {
    subject: `Unlock Sharp + Elite ranks (last onboarding email)`,
    html: wrap(
      "Day 5",
      `
<p>@${ctx.handle} — last email in the onboarding series.</p>
<p>Free tier is 3 predictions a month. That gets you to Scout rank (10 calls, 40% accuracy) and a public profile.</p>
<p>If you want Sharp (25 calls, 55%), Elite (50 calls, 65%), or Oracle (100 calls, 70%, top 1% globally), you need the paid Dashboard plan. EUR 9.97 per month. 10 predictions. Private mode. Weekly Top-10 Scouts email.</p>
<p>Oracle rank gets a lifetime Founder Scout badge on your profile. The first 100 scouts to join already have it &mdash; no upgrade required &mdash; but the ladder past Scout is paid-gated by design, because we do not want farmed leaderboards.</p>
<p>Upgrade or ignore &mdash; both are fine. Your calls keep resolving either way. We email you the moment each one hits.</p>
<p><a href="${SITE_URL}/dashboard" style="color:#0ea5e9;font-weight:600;">See the Dashboard plan</a></p>
<p>&mdash; The Data Nerd</p>
<p style="color:#64748b;font-size:13px;margin-top:24px;">P.S. If you ignore this email, you will still get one more: the resolution email when your first prediction hits or expires. Then you are out of the onboarding flow and into the normal weekly Signal Digest.</p>
<p style="color:#64748b;font-size:13px;margin-top:8px;">P.P.S. New: drop a live Scout Score badge into your GitHub README &mdash; <a href="${SITE_URL}/badge-builder?utm_source=email&utm_medium=soap_opera&utm_campaign=day5" style="color:#0ea5e9;">${SITE_URL.replace(/^https?:\/\//, "")}/badge-builder</a>. Auto-updates from your starring history, no signup, same look as Codecov or WakaTime.</p>
`,
      ctx.dashboardUrl,
    ),
  };
}

async function sendScheduled(opts: {
  to: string;
  subject: string;
  html: string;
  scheduledAtIso: string;
}): Promise<void> {
  if (!RESEND_API_KEY) {
    console.warn("No RESEND_API_KEY; skipping soap-opera scheduled email");
    return;
  }
  // These are submitted now but DELIVERED on a future day, so claim the shared
  // daily slot for the delivery date rather than today — otherwise this would
  // book today's slot and still land on a day another system has already used.
  // Day 1 (the confirmation) is transactional, sent inline by /api/scout/predict,
  // and deliberately does not pass through the gate.
  const deliveryDay = opts.scheduledAtIso.slice(0, 10);
  if (!(await gateAllows(opts.to, "pseo:soap-opera-scout", deliveryDay))) {
    return;
  }
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: opts.to,
      subject: opts.subject,
      html: injectUnsubscribeLink(opts.html, opts.to),
      scheduled_at: opts.scheduledAtIso,
      headers: listUnsubscribeHeaders(opts.to),
    }),
  }).catch((err) => {
    console.warn("Soap-opera schedule failed:", err);
  });
}

/**
 * Schedule days 2-5 of the soap opera sequence for a newly-created scout.
 * Day 1 is handled inline by the predict API as the confirmation email.
 */
export async function scheduleSoapOperaForNewScout(
  ctx: ScoutContext,
): Promise<void> {
  if (isExcluded(ctx.email)) {
    console.log(`[soap-opera-scout] SUPPRESSED schedule for excluded address: ${ctx.email}`);
    return;
  }
  const now = Date.now();
  const days = [
    { offsetMs: 24 * 3600 * 1000, builder: day2 },
    { offsetMs: 48 * 3600 * 1000, builder: day3 },
    { offsetMs: 72 * 3600 * 1000, builder: day4 },
    { offsetMs: 96 * 3600 * 1000, builder: day5 },
  ];

  await Promise.all(
    days.map(({ offsetMs, builder }) => {
      const { subject, html } = builder(ctx);
      return sendScheduled({
        to: ctx.email,
        subject,
        html,
        scheduledAtIso: new Date(now + offsetMs).toISOString(),
      });
    }),
  );
}
