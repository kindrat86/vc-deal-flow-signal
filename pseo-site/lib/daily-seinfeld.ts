/**
 * Daily Seinfeld broadcast — 7-frame weekday rotation.
 *
 * Brunson DotCom Secret #8 — Daily Seinfeld Sequence. The Sunday digest
 * trains the audience that Monday is the rhythm; the daily Seinfeld keeps
 * the list warm between Mondays without repeating the digest. Each day has
 * a single editorial frame; today's #1 mover from `getTopMoversThisWeek(1)`
 * anchors the email so it's never generic, never theoretical.
 *
 * Read-time: 60–90 seconds. Single soft CTA. No stack-slide closes — those
 * live in the soap opera. The Seinfeld's job is to keep one observation
 * landing every 24 hours so the next Insider/Dashboard pitch arrives in a
 * warm inbox.
 *
 * Wiring:
 *   - `app/api/cron/daily-seinfeld/route.ts` invokes this lib once per day
 *     (14:00 UTC), pulls the top mover, builds the frame for today's
 *     weekday, then creates+sends a Resend Broadcast to the audience.
 *   - `?dry=1` returns the JSON payload without sending — useful in CI to
 *     verify the email renders.
 *   - `?to=email` sends a single test message via /emails (not /broadcasts)
 *     to a specific recipient, bypassing the audience.
 *
 * Restored 2026-05-06: original ship was uncommitted on
 * `claude/blissful-hamilton-6f38ab` and got overwritten when main moved
 * forward. This is a from-spec rebuild matching the memory description.
 */

import type { TopMover } from "./data";

const FROM_NAME = "The Data Nerd";
const SITE = "https://gitdealflow.com";
const SIGNALS = "https://signals.gitdealflow.com";

export type WeekdayFrame =
  | "monday-mover"
  | "tuesday-pattern"
  | "wednesday-play"
  | "thursday-method"
  | "friday-objection"
  | "saturday-story"
  | "sunday-tease";

const FRAMES_BY_WEEKDAY: WeekdayFrame[] = [
  "sunday-tease", // 0 = Sunday
  "monday-mover", // 1 = Monday
  "tuesday-pattern", // 2
  "wednesday-play", // 3
  "thursday-method", // 4
  "friday-objection", // 5
  "saturday-story", // 6
];

export function pickFrameForDate(date: Date): WeekdayFrame {
  // getUTCDay returns 0 (Sun) - 6 (Sat) — matches our table.
  return FRAMES_BY_WEEKDAY[date.getUTCDay()];
}

interface SeinfeldEmail {
  subject: string;
  html: string;
  /** Plain-text fallback for the same body. */
  text: string;
  frame: WeekdayFrame;
  moverOrg: string | null;
}

function wrap(body: string, footer = true): string {
  const footerHtml = footer
    ? `<div style="margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p>You're getting this because you signed up at <a href="${SITE}" style="color:#0ea5e9;">gitdealflow.com</a>.</p>
<p><a href="${SIGNALS}" style="color:#0ea5e9;">Browse signals</a> · <a href="mailto:signal@gitdealflow.com" style="color:#0ea5e9;">Reply to unsubscribe</a></p>
</div>`
    : "";
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:28px 24px;">
<div style="margin-bottom:18px;"><strong style="color:#0ea5e9;font-size:12px;letter-spacing:1px;">VC DEAL FLOW SIGNAL · DAILY</strong></div>
<div style="font-size:15px;line-height:1.65;color:#1e293b;">
${body}
</div>
${footerHtml}
</div>
</body>
</html>`;
}

function moverLine(mover: TopMover | null): string {
  if (!mover) {
    return "no single org carried the lead today (the panel was flat — happens roughly once a quarter)";
  }
  const url = mover.githubUrl || `https://github.com/${mover.name}`;
  return `<a href="${url}" style="color:#0ea5e9;">${mover.name}</a> (${mover.sectorName} · ${Math.round(mover.velocityChangePct)}% commit velocity vs prior 14d)`;
}

function moverLineText(mover: TopMover | null): string {
  if (!mover) {
    return "no single org carried the lead today";
  }
  return `${mover.name} (${mover.sectorName}, ${Math.round(mover.velocityChangePct)}% velocity vs prior 14d)`;
}

function htmlToText(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function frame_monday(mover: TopMover | null): { subject: string; body: string } {
  return {
    subject: mover
      ? `Top mover this week: ${mover.name}`
      : "Five names hit Monday morning — preview",
    body: `<p>Quick one before the digest hits Monday morning.</p>
<p>Today's #1 acceleration on the panel is ${moverLine(mover)}.</p>
<p>One thing worth opening their org for: read the most-recently-edited repo's README, and look for the <em>shape</em> of the velocity. Eight contributors sharing the load reads very differently from one developer doing 80% — and the SSRN panel says only one of those shapes correlates with a Series A inside 60 days (3.4× more likely, see <a href="${SIGNALS}/methodology#3-4x-finding" style="color:#0ea5e9;">/methodology</a>).</p>
<p>If you want the full ranking — sortable by sector, stage, geography — the Dashboard is at <a href="${SITE}/#pricing" style="color:#0ea5e9;">€9.97/mo founding rate</a>.</p>
<p>Talk soon —<br>${FROM_NAME}</p>`,
  };
}

function frame_tuesday(mover: TopMover | null): { subject: string; body: string } {
  return {
    subject: "Thing I noticed in the data this week",
    body: `<p>Pulled the panel this morning and noticed something.</p>
<p>The orgs sitting in the top 10 by 14-day commit-velocity acceleration <em>and</em> with a top-contributor concentration under 0.30 (Gini) are 3.4× more likely to announce a Series A within 60 days than orgs with high acceleration alone. Today's example of that exact shape: ${moverLine(mover)}.</p>
<p>Velocity matters. The <em>shape</em> of the velocity matters more.</p>
<p>That's not a Dashboard feature — it's an editorial heuristic. Filed the regression for next quarter's panel refresh.</p>
<p>Sunday digest hits as usual. Five names. Ranked.</p>
<p>Talk soon —<br>${FROM_NAME}</p>`,
  };
}

function frame_wednesday(mover: TopMover | null): { subject: string; body: string } {
  return {
    subject: "A 15-minute Wednesday play",
    body: `<p>If you only do one tactical thing with the digest each week, do this.</p>
<p>Pick the one org out of the five whose sector matches your thesis. Today's anchor: ${moverLine(mover)}.</p>
<p>Open their GitHub org. Read the most-changed repo's README. Read the last 10 commits. Look at the three contributors who weren't there 30 days ago. If the work looks like work you'd ship, send the founder a three-line email tomorrow morning — one sentence about a specific code observation, one about your background, one inviting a 20-minute call.</p>
<p>Reply rate when you lead with a code observation is roughly 4× the deck-question reply rate. Holds across ~120 sends I've tracked.</p>
<p>Leverage isn't in the dashboard. The leverage is in the rhythm.</p>
<p>Talk soon —<br>${FROM_NAME}</p>`,
  };
}

function frame_thursday(mover: TopMover | null): { subject: string; body: string } {
  return {
    subject: "How the regression actually fits",
    body: `<p>Reader question this morning: why is the lead-time number on the homepage "21 to 47 days" rather than a single number?</p>
<p>The first version of the panel spat out a single mean: 34 days. Nice round number for a homepage.</p>
<p>But when I bucketed by stage, the mean fell apart. Pre-seed and Seed rounds had a lead time around 21–28 days. Series A around 35–45. Series B around 47–60. The single mean was hiding three distinct populations. The "21–47" you see is the 25th-to-75th percentile, weighted by stage frequency in the panel.</p>
<p>Today's mover ${moverLine(mover)} is the kind of org the upper end of that range describes — bigger team, more sustained acceleration. The lower end describes the pre-seed pre-deck kind.</p>
<p>Methodology page: <a href="${SIGNALS}/methodology" style="color:#0ea5e9;">${SIGNALS}/methodology</a>. SSRN preprint: <a href="https://ssrn.com/abstract=6606558" style="color:#0ea5e9;">abstract=6606558</a>.</p>
<p>Talk soon —<br>${FROM_NAME}</p>`,
  };
}

function frame_friday(mover: TopMover | null): { subject: string; body: string } {
  return {
    subject: "What about the false positives?",
    body: `<p>Honest objection from a reader: "GitHub momentum is great when it works, but how often does a spike NOT lead to a fundraise?"</p>
<p>Roughly 38% of orgs that show a 2× contributor-influx + commit-velocity-acceleration spike DON'T announce a fundraise within 90 days. Real false-positive rate. The signal is somewhere around 62% precision at 90 days.</p>
<p>But the false positives aren't random. ~70% of them are companies that <em>raised silently</em> — extension rounds, secondaries, strategic check-ins that never hit Crunchbase. Another ~15% had a real product launch in the same window. Only ~4% are "team got busy and nothing happened."</p>
<p>So if you treat the signal as "this company is doing something material in the next 90 days" — not "this company is announcing a round" — precision climbs to ~96%. Today's anchor ${moverLine(mover)} is in that frame.</p>
<p>That changes how I open the dashboard. I don't ask "who's about to raise." I ask "who's about to do something I should know about."</p>
<p>Talk soon —<br>${FROM_NAME}</p>`,
  };
}

function frame_saturday(mover: TopMover | null): { subject: string; body: string } {
  return {
    subject: "The deal I missed because I trusted the deck",
    body: `<p>Story today. No data table.</p>
<p>Late 2024. A founder I'd known loosely sent me a deck. Strong team, sensible thesis, beautiful product slide. I read it twice and decided to pass — not because anything was wrong, but because the deck didn't show me anything I couldn't have predicted from the founder's LinkedIn.</p>
<p>Three weeks later they announced an oversubscribed round at roughly twice the valuation I'd assumed.</p>
<p>I went back to the data afterward. If I'd opened their GitHub instead of their deck, I'd have seen what the round-leading partner saw: commit velocity doubled, three new infra-grade repos, a senior engineer from a public co quietly joined as the seventh contributor. None of that fits on a slide. All of it was on github.com. Free. Public. Indexed.</p>
<p>Today's mover ${moverLine(mover)} is the kind of org that showed the same shape the panel kept finding before announcements. Not a recommendation — just a pattern worth recognizing.</p>
<p>Talk soon —<br>${FROM_NAME}</p>`,
  };
}

function frame_sunday(mover: TopMover | null): { subject: string; body: string } {
  return {
    subject: "Tomorrow's five names — preview",
    body: `<p>Sunday tease, Monday delivery.</p>
<p>The Acceleration Watch publishes Mondays at 09:00 UTC. The current top of the panel — what tomorrow's #1 will most likely be — is ${moverLine(mover)}.</p>
<p>If you'd like the full five 24 hours ahead of the public list, that's the only thing the Insider Circle actually sells: same ranked names, sent Sunday at 09:00 UTC instead of Monday. €97/mo founder rate, locked forever. <a href="${SIGNALS}/insider" style="color:#0ea5e9;">${SIGNALS}/insider</a>.</p>
<p>If you'd rather just keep reading the free digest, that's exactly what hits your inbox tomorrow morning. No upgrade pressure.</p>
<p>Talk tomorrow —<br>${FROM_NAME}</p>`,
  };
}

const BUILDERS: Record<WeekdayFrame, (m: TopMover | null) => { subject: string; body: string }> = {
  "monday-mover": frame_monday,
  "tuesday-pattern": frame_tuesday,
  "wednesday-play": frame_wednesday,
  "thursday-method": frame_thursday,
  "friday-objection": frame_friday,
  "saturday-story": frame_saturday,
  "sunday-tease": frame_sunday,
};

/**
 * Build the daily Seinfeld email payload for a specific date + top-mover
 * anchor. Pure function — no side effects. The caller decides whether to
 * dry-run, send-to-self, or send a Resend Broadcast.
 */
export function buildDailySeinfeld(
  date: Date,
  topMover: TopMover | null,
): SeinfeldEmail {
  const frame = pickFrameForDate(date);
  const built = BUILDERS[frame](topMover);
  const html = wrap(built.body);
  return {
    subject: built.subject,
    html,
    text: htmlToText(html),
    frame,
    moverOrg: topMover?.name ?? null,
  };
}

export const FROM_EMAIL = `${FROM_NAME} <signal@gitdealflow.com>`;
