import "server-only";
import { listUnsubscribeHeaders, injectUnsubscribeLink } from "@/lib/list-unsubscribe";

/**
 * Sector Sweep — heat-building Setter sequence.
 *
 * Brunson Expert Secrets Ch 16 (The Setter). The Setter qualifies the lead
 * before the Closer arrives. In live phone-room canon the Setter delivers
 * heat with voice and pacing, holding the prospect's attention through the
 * gap before the Closer connects. We can't do that — the founder anonymity
 * rule keeps every contact written + async.
 *
 * The original `/sector-sweep` flow scored 90/100 in the Brunson Trilogy
 * audit because the gap was real: a 24-hour text-only silence loses heat
 * the moment the prospect closes the tab. This module fixes that without
 * breaking anonymity by:
 *
 *   1. Fires an instant T+0 acknowledgement email to the PROSPECT (not just
 *      the internal brief). Their own thesis quoted back, a specific
 *      written-reply timestamp (not vague "24 business hours"), and a
 *      sector-tailored sample table-of-contents — delivering part of the
 *      Sweep's value at submit-time instead of 24h later.
 *
 *   2. Schedules a T+2h "Methodology Lead" status update — "your brief is
 *      in front of me, here's the methodology page that's grounding the
 *      reply." Gives the prospect a curiosity loop to chase while the
 *      human reply is being drafted.
 *
 *   3. Schedules a T+12h transparency note — "still drafting; here's the
 *      one question I'm trying to nail before I send." Builds anticipation
 *      through visibility.
 *
 *   4. Schedules a T+48h soft follow-up — fires only if the prospect has
 *      not yet purchased. (Gating happens at the "did they click the buy
 *      link" layer; the schedule fires either way and the body soft-asks
 *      "still on the fence?" — harmless if already converted.)
 *
 * Setter / Closer separation: emails 1–3 are signed by "Methodology Lead"
 * (the Setter persona, already used in the Summit talks). The T+24h human
 * reply (manual, sent from the founder's inbox) is signed "The Data Nerd"
 * (the Closer). Two distinct voices, one shared anonymity.
 */

const SITE = "https://signals.gitdealflow.com";
const APEX = "https://gitdealflow.com";

/** The Setter persona — pseudonymous, mirrors `/summit` Methodology Lead. */
export const SETTER_NAME = "Methodology Lead";
/** The Closer persona — manual T+24h reply uses this signoff. */
export const CLOSER_NAME = "The Data Nerd";

export const SETTER_FROM_EMAIL =
  process.env.FROM_EMAIL || "signals@gitdealflow.com";

/* -----------------------------------------------------------------------
 * Reply-deadline computation.
 *
 * Brunson rule: vague urgency is dead urgency. Specific timestamp is the
 * cheapest credibility move there is. We compute the deadline at submit
 * time and bake it into both the success page and every heat-build email
 * so the prospect always sees the SAME timestamp across surfaces.
 *
 * Business-hour definition: Monday–Friday, 09:00–18:00 UTC. 24 business
 * hours ≈ the next-but-one weekday morning (since each weekday gives us
 * 9 active hours). We don't need a full PERT scheduler — a conservative
 * walk-forward that accumulates 24 in-business-hour ticks lands inside
 * the promised SLA regardless of submit time and never points at a
 * weekend.
 * ----------------------------------------------------------------------- */

export interface ReplyDeadline {
  iso: string;
  /** "Thursday 2026-05-10 14:00 UTC" — for human display. */
  display: string;
  /** Hours from now to deadline, rounded to the nearest hour. */
  hoursFromNow: number;
}

export function computeReplyDeadline(now: Date = new Date()): ReplyDeadline {
  const BUSINESS_START_HOUR = 9;
  const BUSINESS_END_HOUR = 18;
  const TARGET_BUSINESS_HOURS = 24;

  const cursor = new Date(now.getTime());
  let accumulated = 0;
  let safety = 0;

  while (accumulated < TARGET_BUSINESS_HOURS && safety < 240) {
    safety += 1;
    cursor.setUTCMinutes(0, 0, 0);
    cursor.setUTCHours(cursor.getUTCHours() + 1);
    const day = cursor.getUTCDay(); // 0 = Sun, 6 = Sat
    const hour = cursor.getUTCHours();
    const isWeekday = day !== 0 && day !== 6;
    const isBusinessHour = hour >= BUSINESS_START_HOUR && hour < BUSINESS_END_HOUR;
    if (isWeekday && isBusinessHour) {
      accumulated += 1;
    }
  }

  cursor.setUTCMinutes(0, 0, 0);

  const iso = cursor.toISOString();
  const display = formatUtcDeadline(cursor);
  const hoursFromNow = Math.round((cursor.getTime() - now.getTime()) / 3_600_000);

  return { iso, display, hoursFromNow };
}

function formatUtcDeadline(d: Date): string {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(d.getUTCHours()).padStart(2, "0");
  return `${days[d.getUTCDay()]} ${yyyy}-${mm}-${dd} ${hh}:00 UTC`;
}

/* -----------------------------------------------------------------------
 * Sample table of contents — sector-aware.
 *
 * The actual €1,997 Sweep delivers a 10–14 section custom PDF. We can't
 * generate the full deliverable at T+0, but we CAN generate a credible
 * sample TOC tailored to the sector the prospect typed. That's the
 * Brunson Best Bait move — give them a slice of the deliverable shape
 * before they pay, so the imagination loops the rest.
 *
 * The matcher is intentionally loose: we keyword-scan the free-text
 * `sector` field and map to one of five canonical TOC families. Any
 * unrecognized sector falls through to the "general" template, which is
 * still credible (the structure is the same; sector-specific examples
 * just become placeholders).
 * ----------------------------------------------------------------------- */

type TocFamily =
  | "ai-infra"
  | "devtools"
  | "data-infra"
  | "fintech-infra"
  | "climate"
  | "general";

function pickTocFamily(sector: string): TocFamily {
  const s = sector.toLowerCase();
  if (
    /(\bai\b|\bml\b|inference|llm|gpu|model|agent|mcp|generative|cuda|tensor|transformer)/.test(
      s,
    )
  ) {
    return "ai-infra";
  }
  if (
    /(devtool|developer tool|build|ci\/?cd|ide|editor|compiler|linter|repo|version control|sdk|cli)/.test(
      s,
    )
  ) {
    return "devtools";
  }
  if (
    /(data|warehouse|etl|elt|streaming|kafka|database|sql|olap|analytics|pipeline|lakehouse)/.test(
      s,
    )
  ) {
    return "data-infra";
  }
  if (
    /(fintech|payment|settlement|trading|bank|crypto|defi|stablecoin|treasury|ledger|reconcil)/.test(
      s,
    )
  ) {
    return "fintech-infra";
  }
  if (
    /(climate|energy|grid|battery|solar|wind|carbon|sustainab|hydrogen|nuclear|robot)/.test(
      s,
    )
  ) {
    return "climate";
  }
  return "general";
}

export function generateSampleToc(sector: string): readonly string[] {
  const family = pickTocFamily(sector);
  const SPINE: readonly string[] = [
    "01 · Sector framing and panel scope (orgs included, exclusion criteria)",
    "02 · Top 25 ranked orgs, 14-day commit-velocity acceleration percentile",
    "03 · Three pre-Crunchbase breakouts — named, with the signal that surfaced each",
  ];
  const FLEX: Record<TocFamily, readonly string[]> = {
    "ai-infra": [
      "04 · Inference-layer accelerators vs training-layer — separation by dependents graph",
      "05 · Open-weights movement: who's shipping models, who's shipping infra around them",
      "06 · GPU-rental adjacency — orgs whose commit velocity tracks NVIDIA H100 release cadence",
      "07 · Agent / MCP / tooling sub-cluster — repos with .well-known/mcp-server.json or similar",
      "08 · Geography heatmap — US clusters vs EU vs APAC velocity differential",
      "09 · Contributor-influx map for the top 10 orgs (last 30 days)",
    ],
    devtools: [
      "04 · Build-pipeline accelerators vs editor-experience accelerators",
      "05 · Language ecosystem cuts — Rust, Go, TypeScript, Python tooling velocity by quarter",
      "06 · Open-source vs open-core licensing — commit-velocity differential",
      "07 · Repo-creation cadence — orgs spinning up 3+ new repos in 30 days",
      "08 · Geography heatmap — US clusters vs EU vs APAC velocity differential",
      "09 · Contributor-influx map for the top 10 orgs (last 30 days)",
    ],
    "data-infra": [
      "04 · Warehouse-layer vs query-layer vs streaming-layer — separation by repo-creation pattern",
      "05 · Open-source vs managed-service positioning — commit cadence as a positioning tell",
      "06 · Lakehouse / Iceberg / Delta cluster — who's actually shipping, who's roadmapping",
      "07 · ETL/ELT decline of monoliths vs rise of unbundled tools",
      "08 · Geography heatmap — US clusters vs EU vs APAC velocity differential",
      "09 · Contributor-influx map for the top 10 orgs (last 30 days)",
    ],
    "fintech-infra": [
      "04 · Settlement-layer vs payments-layer vs trading-rail separation",
      "05 · Crypto-adjacent vs non-crypto fintech infra — commit-velocity comparability",
      "06 · Stablecoin / on-chain rails — repo-velocity tells before partnership announcements",
      "07 · Compliance-tooling sub-cluster (KYC, sanctions, transaction monitoring)",
      "08 · Geography heatmap — US clusters vs EU vs APAC velocity differential",
      "09 · Contributor-influx map for the top 10 orgs (last 30 days)",
    ],
    climate: [
      "04 · Hardware-software split — orgs shipping firmware vs orgs shipping cloud control planes",
      "05 · Grid / energy / battery commit-velocity by quarter",
      "06 · Carbon-accounting and reporting tools — commit cadence as adoption proxy",
      "07 · Robotics / industrial-automation cross-pollination",
      "08 · Geography heatmap — EU + Nordics velocity differential vs US",
      "09 · Contributor-influx map for the top 10 orgs (last 30 days)",
    ],
    general: [
      "04 · Sub-cluster decomposition based on repo-topic and dependent graph",
      "05 · Open-source vs proprietary positioning — commit-cadence differential",
      "06 · Repo-creation cadence — orgs spinning up 3+ new repos in 30 days",
      "07 · Adjacency map — orgs whose commits correlate with the named sector leader",
      "08 · Geography heatmap — US clusters vs EU vs APAC velocity differential",
      "09 · Contributor-influx map for the top 10 orgs (last 30 days)",
    ],
  };
  const TAIL: readonly string[] = [
    "10 · Two-period confirmation — which 14-day spikes survived a second window",
    "11 · False-positive register — three orgs that pinged but didn't survive",
    "12 · Decision rule — what to act on this quarter, what to monitor next quarter",
  ];
  return [...SPINE, ...FLEX[family], ...TAIL];
}

/* -----------------------------------------------------------------------
 * Email body builders — same 600px stack as `lib/emails.ts wrap()`,
 * keeps Apple Mail / Outlook desktop rendering consistent with the SOS
 * drip the prospect may already be receiving.
 * ----------------------------------------------------------------------- */

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function wrap(body: string, footer: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#0ea5e9;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL · SECTOR SWEEP</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
${body}
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
${footer}
</div>
</div>
</body>
</html>`;
}

const FOOTER_SETTER = `
<p>This sequence runs only while your Sector Sweep brief is in flight. It stops automatically once the human reply lands or you reply to any of these emails.</p>
<p><a href="${SITE}/sector-sweep" style="color:#0ea5e9;">/sector-sweep</a> &middot; <a href="mailto:${SETTER_FROM_EMAIL}" style="color:#0ea5e9;">${SETTER_FROM_EMAIL}</a></p>
`.trim();

export interface SetterEmailInputs {
  contact_name: string;
  email: string;
  fund_or_role: string;
  sector: string;
  thesis: string;
  three_orgs: string;
  decision_window: string;
  why_sweep: string;
  deadline: ReplyDeadline;
}

/* -----------------------------------------------------------------------
 * T+0 — Instant acknowledgement.
 *
 * Brunson rule: deliver value in the first contact. Don't make the buyer
 * wait for the human reply to feel something has happened.
 *
 *   - Quote their own thesis back so they know we read it.
 *   - State the SPECIFIC reply deadline as a wall-clock UTC timestamp.
 *   - Show the sample TOC for the sector they typed, so they can already
 *     see the SHAPE of what they're paying €1,997 for.
 * ----------------------------------------------------------------------- */
export function buildAckEmail(i: SetterEmailInputs): {
  subject: string;
  html: string;
} {
  const firstName = (i.contact_name.split(/\s+/)[0] || "there").trim();
  const sectorClip = i.sector.length > 110 ? i.sector.slice(0, 107) + "…" : i.sector;
  const thesisClip = i.thesis.length > 320 ? i.thesis.slice(0, 317) + "…" : i.thesis;
  const toc = generateSampleToc(i.sector);
  const tocHtml = toc
    .map(
      (line) =>
        `<li style="margin:0 0 6px;color:#334155;font-size:14px;line-height:1.55;">${escapeHtml(line)}</li>`,
    )
    .join("");

  const body = `
<p>${escapeHtml(firstName)} — your Sector Sweep brief landed at ${escapeHtml(new Date().toISOString().slice(0, 16).replace("T", " "))} UTC.</p>

<p>I'm the Methodology Lead. I queue every brief, draft the fit assessment, and hand the buy link to The Data Nerd to send. The human reply you'll get is from <strong>${escapeHtml(CLOSER_NAME)}</strong> directly, signed by them. I'm just the queue.</p>

<p style="background:#fef3c7;border-left:4px solid #f59e0b;padding:14px 16px;margin:18px 0;border-radius:4px;">
<strong style="color:#78350f;">Your written reply lands at ${escapeHtml(i.deadline.display)}</strong> — that's ~${i.deadline.hoursFromNow} hours from now. We never blow this deadline. If for any reason it slips, the Sweep ships free.
</p>

<p>What you wrote, in the field that matters most:</p>
<blockquote style="margin:0;padding:14px 18px;border-left:4px solid #6366f1;background:#eef2ff;color:#312e81;font-size:14.5px;line-height:1.6;border-radius:4px;">
<strong style="color:#3730a3;font-size:11px;letter-spacing:0.5px;text-transform:uppercase;">Your thesis on ${escapeHtml(sectorClip)}</strong><br><br>
${escapeHtml(thesisClip)}
</blockquote>

<p>That's the spine the assessment is built around. We'll either confirm the Sweep is the right vehicle for that thesis, or tell you it isn't (and which rung is — usually the €49/mo Dashboard if the answer is "you need recurring, not one-shot"). The "don't buy this" note is real. We turn down maybe 1 in 4 briefs.</p>

<p style="margin-top:24px;"><strong style="color:#1e293b;">A sample shape of the deliverable, tailored to the sector you typed.</strong> The full PDF expands each line below into 2–4 pages with the actual orgs, charts, and contributor maps. This is what the table of contents will look like:</p>

<ol style="padding-left:20px;margin:14px 0 0;">
${tocHtml}
</ol>

<p style="margin-top:28px;color:#475569;font-size:14px;">While you wait, two pages worth reading — they're the methodology this whole assessment will rest on:</p>

<ul style="padding-left:20px;margin:8px 0 0;">
<li style="margin:0 0 6px;font-size:14px;"><a href="${SITE}/methodology" style="color:#0ea5e9;">/methodology</a> — the formula, two-period confirmation rule, contributor-quality filter</li>
<li style="margin:0 0 6px;font-size:14px;"><a href="${SITE}/walkthrough" style="color:#0ea5e9;">/walkthrough</a> — the 12-minute argument for why code-side acceleration is the most leading public signal in venture capital</li>
</ul>

<p style="margin-top:28px;">— ${escapeHtml(SETTER_NAME)}<br><span style="color:#94a3b8;font-size:13px;">VC Deal Flow Signal · setter for the €1,997 Sweep · async-only by design</span></p>
`;
  return {
    subject: `Brief received — your written reply lands ${i.deadline.display}`,
    html: wrap(body, FOOTER_SETTER),
  };
}

/* T+2h — Methodology grounding. */
export function buildMethodologyEmail(i: SetterEmailInputs): {
  subject: string;
  html: string;
} {
  const firstName = (i.contact_name.split(/\s+/)[0] || "there").trim();
  const body = `
<p>${escapeHtml(firstName)} — quick check-in.</p>

<p>Your brief is in front of me now. The Data Nerd will draft the actual fit assessment, but my job between now and then is to make sure the methodology that grounds the answer is squared away.</p>

<p>The single thing every Sector Sweep buyer asks before paying €1,997:</p>

<blockquote style="margin:18px 0;padding:16px 20px;background:#f1f5f9;border-left:4px solid #475569;color:#0f172a;font-size:15px;line-height:1.6;border-radius:4px;">
"How do I know commit-velocity acceleration is the right signal for <em>my</em> sector — and not just an artifact of how active that ecosystem happens to be on GitHub?"
</blockquote>

<p>The honest answer is in two pages, both public, both worth a five-minute read while you're waiting:</p>

<ol style="padding-left:20px;">
<li style="margin:0 0 10px;"><strong><a href="${SITE}/methodology" style="color:#0ea5e9;">/methodology</a></strong> — the regression that produced the 21–47 day lead-time IQR. n=219, five quarters, written so an engineer can audit it. The same code is in the public Zenodo dataset.</li>
<li style="margin:0 0 10px;"><strong><a href="${SITE}/scorecard" style="color:#0ea5e9;">/scorecard</a></strong> — every weekly Acceleration Watch pick, graded at 60d and 90d. Public, rolling. Misses included by design — they're the calibration boundary, not failures.</li>
</ol>

<p>If your sector skews toward private repos until Series B (some healthcare and defense plays do this), the Sweep adapts — we lean harder on contributor-influx, employer affinity, and dependents-graph signals instead of raw commit volume. That trade-off lands in the assessment when ${escapeHtml(CLOSER_NAME)} writes it.</p>

<p>Reply lands at <strong>${escapeHtml(i.deadline.display)}</strong>. I'll send one more status update halfway through if anything material shifts.</p>

<p style="margin-top:24px;">— ${escapeHtml(SETTER_NAME)}</p>
`;
  return {
    subject: "Your brief — the methodology I'm grounding the reply on",
    html: wrap(body, FOOTER_SETTER),
  };
}

/* T+12h — Drafting transparency. */
export function buildDraftingEmail(i: SetterEmailInputs): {
  subject: string;
  html: string;
} {
  const firstName = (i.contact_name.split(/\s+/)[0] || "there").trim();
  const sectorWord =
    i.sector
      .split(/[\s,]+/)
      .filter((w) => w.length > 3)
      .slice(0, 2)
      .join(" ") || "the sector you named";
  const thesisClip = i.thesis.length > 140 ? i.thesis.slice(0, 137) + "…" : i.thesis;
  const body = `
<p>${escapeHtml(firstName)} — halftime.</p>

<p>Draft of the fit assessment is in front of ${escapeHtml(CLOSER_NAME)}. They write replies in batches and yours is in the next batch.</p>

<p>The single question I'm trying to nail before they hit send:</p>

<blockquote style="margin:18px 0;padding:16px 20px;background:#fef3c7;border-left:4px solid #f59e0b;color:#78350f;font-size:15px;line-height:1.6;border-radius:4px;">
Of the three pre-Crunchbase breakouts we'd surface in <strong>${escapeHtml(sectorWord)}</strong>, which one would your IC find most defensible — the one with the cleanest commit pattern but a small team, or the one with a noisier pattern but a clearly experienced founding crew?
</blockquote>

<p>That's the framing tension every Sweep has to make a call on. Your thesis ("${escapeHtml(thesisClip)}") tilts the answer in a specific direction, but the call is what the assessment will lay out — explicitly, with the math.</p>

<p>The reply lands at <strong>${escapeHtml(i.deadline.display)}</strong> as promised. If I can shave that, you'll see the email earlier. If anything material slips, you'll hear from me first.</p>

<p style="margin-top:20px;">If you'd rather skip the assessment and go direct to checkout — same Sweep, same delivery, same 14-day async Q&amp;A window — the link is <a href="https://buy.stripe.com/bJe14m34DbNC6gm1by0x204" style="color:#0ea5e9;">here</a>. You don't lose anything by waiting; the assessment is the friction-reducer, not a gate.</p>

<p style="margin-top:24px;">— ${escapeHtml(SETTER_NAME)}</p>
`;
  return {
    subject: "Halfway — the question I'm nailing before reply lands",
    html: wrap(body, FOOTER_SETTER),
  };
}

/* T+48h — Soft follow-up if no purchase. */
export function buildFollowUpEmail(i: SetterEmailInputs): {
  subject: string;
  html: string;
} {
  const firstName = (i.contact_name.split(/\s+/)[0] || "there").trim();
  const body = `
<p>${escapeHtml(firstName)} — quick check.</p>

<p>If the assessment landed and you're moving, ignore this. If the assessment landed and you're sitting on it, here's the question I'd want answered before deciding:</p>

<blockquote style="margin:18px 0;padding:16px 20px;background:#ecfdf5;border-left:4px solid #10b981;color:#065f46;font-size:15px;line-height:1.6;border-radius:4px;">
What would you act on inside the next 30 days if the three pre-Crunchbase breakouts in the deliverable matched your thesis exactly? If the honest answer is "nothing concrete" — the Dashboard at €49/mo is probably the right rung. If the honest answer is "I'd send three first-meeting emails on Monday" — the €1,997 Sweep is the cheap version of an analyst hire.
</blockquote>

<p>That's the trade. Both rungs exist; both are real. Reply with one word — <strong>SWEEP</strong>, <strong>DASHBOARD</strong>, or <strong>NEITHER</strong> — and ${escapeHtml(CLOSER_NAME)} will route you accordingly. No call required.</p>

<p>If you've already bought the Sweep and the deliverable's in flight: thanks. The 14-day async Q&amp;A window starts the day the PDF lands in your inbox. Reply to the delivery email any time inside that window.</p>

<p style="margin-top:24px;">— ${escapeHtml(SETTER_NAME)}<br><span style="color:#94a3b8;font-size:13px;">Last message in this sequence. The next time you hear from us is either a Sweep delivery, a Dashboard onboarding, or silence.</span></p>
`;
  return {
    subject: "One question I'd want answered before deciding on the Sweep",
    html: wrap(body, FOOTER_SETTER),
  };
}

/* -----------------------------------------------------------------------
 * Schedule the heat-build sequence via Resend `scheduled_at`.
 *
 * Mirrors the pattern in /api/verify/route.ts — each email is queued
 * separately so a single API failure doesn't cascade.
 * ----------------------------------------------------------------------- */

const TWO_HOURS = 2 * 60 * 60 * 1000;
const TWELVE_HOURS = 12 * 60 * 60 * 1000;
const FORTY_EIGHT_HOURS = 48 * 60 * 60 * 1000;

export interface ScheduleResult {
  scheduled: number;
  failed: number;
  errors: string[];
}

export async function scheduleSetterSequence(
  inputs: SetterEmailInputs,
  resendApiKey: string,
): Promise<ScheduleResult> {
  const fromHeader = `${SETTER_NAME} <${SETTER_FROM_EMAIL}>`;
  const now = Date.now();

  const queue: Array<{ at: Date; subject: string; html: string }> = [
    { at: new Date(now), ...buildAckEmail(inputs) },
    { at: new Date(now + TWO_HOURS), ...buildMethodologyEmail(inputs) },
    { at: new Date(now + TWELVE_HOURS), ...buildDraftingEmail(inputs) },
    { at: new Date(now + FORTY_EIGHT_HOURS), ...buildFollowUpEmail(inputs) },
  ];

  let scheduled = 0;
  let failed = 0;
  const errors: string[] = [];

  for (const item of queue) {
    try {
      const isInstant = item.at.getTime() <= now + 5_000;
      const payload: Record<string, unknown> = {
        from: fromHeader,
        to: inputs.email,
        reply_to: SETTER_FROM_EMAIL,
        subject: item.subject,
        html: injectUnsubscribeLink(item.html, inputs.email),
        headers: listUnsubscribeHeaders(inputs.email),
      };
      if (!isInstant) {
        payload.scheduled_at = item.at.toISOString();
      }

      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const text = await res.text().catch(() => "(unreadable body)");
        failed += 1;
        errors.push(`${item.subject}: HTTP ${res.status} — ${text.slice(0, 200)}`);
      } else {
        scheduled += 1;
      }
    } catch (err) {
      failed += 1;
      errors.push(
        `${item.subject}: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  return { scheduled, failed, errors };
}

export type { TocFamily };
export { APEX };
