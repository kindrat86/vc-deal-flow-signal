/**
 * Soap Opera Sequence — 7-day Russell ascension + day-9 bonus.
 * Updated 2026-05-02 per Russell audit: added day-3 usecase, day-4 tripwire,
 * day-6 insider; pulled Dashboard close from day-7 to day-5; demoted old
 * public-data-edge email to day-9 bonus follow-on.
 *
 * Each entry has: subject, html, delayMs (from verification time).
 * Resend `scheduled_at` queues each one at signup verification time.
 * (See app/api/verify/route.ts for the queueing.)
 */

const FROM_NAME = "The Data Nerd";
const SITE = "https://gitdealflow.com";
const SIGNALS = "https://signals.gitdealflow.com";

function wrap(body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;color:#1e293b;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<div style="max-width:600px;margin:0 auto;padding:32px 24px;">
<div style="margin-bottom:24px;"><strong style="color:#0ea5e9;font-size:14px;letter-spacing:1px;">VC DEAL FLOW SIGNAL</strong></div>
<div style="font-size:16px;line-height:1.7;color:#1e293b;">
${body}
</div>
<div style="margin-top:40px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;">
<p>You're receiving this because you signed up at <a href="${SITE}" style="color:#0ea5e9;">gitdealflow.com</a></p>
<p><a href="${SIGNALS}" style="color:#0ea5e9;">Browse Signals</a> · <a href="mailto:signal@gitdealflow.com" style="color:#0ea5e9;">Reply to unsubscribe</a></p>
</div>
</div>
</body>
</html>`;
}

const THIRTY_MIN = 30 * 60 * 1000;
const ONE_DAY = 24 * 60 * 60 * 1000;

export const SOAP_OPERA_EMAILS = [
  // Day 0 — Welcome (Russell: deliver value)
  {
    subject: "The deal flow signal hiding in plain sight",
    delayMs: THIRTY_MIN,
    html: wrap(`
<p>Welcome to VC Deal Flow Signal.</p>
<p>I want to tell you why I built this, because it starts with a mistake I kept making.</p>
<p>I was tracking a small fintech startup. Nothing special on the surface. No press, no AngelList buzz, no warm intros circulating. But their GitHub told a different story.</p>
<p>In two weeks, their commit velocity tripled. Four new contributors joined. They spun up three new infrastructure repos.</p>
<p>I flagged it in my notes.</p>
<p>Three weeks later, they announced a $4M Series A led by a top-tier fund.</p>
<p>The investors who got in had seen something I missed. Or maybe they just knew someone. That's when it clicked: the signal was right there in the commit graph the whole time. Public. Free. Updating in real time.</p>
<p>Nobody was reading it.</p>
<p>So I built a system that does.</p>
<p>Every week, I'll send you the top startups showing unusual engineering acceleration. Commit velocity spikes, contributor surges, new infrastructure repos. The patterns that precede fundraises, product launches, and breakout moments.</p>
<p>Tomorrow, I want to challenge something you probably believe about your current deal flow.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. If you want the full picture (85+ startups, filters by sector and stage), the Dashboard is EUR 9.97/mo early access pricing: <a href="${SITE}/#pricing" style="color:#0ea5e9;">${SITE}/#pricing</a></p>
<p style="color:#64748b;font-size:14px;">P.P.S. Weekly signals on Telegram: <a href="https://t.me/gitdealflow" style="color:#0ea5e9;">t.me/gitdealflow</a></p>
`),
  },

  // Day 1 — Vehicle objection (Russell: kept)
  {
    subject: '"GitHub data is noise" (here\'s why that\'s wrong)',
    delayMs: THIRTY_MIN + ONE_DAY,
    html: wrap(`
<p>When I tell investors I use GitHub to source deal flow, the first response is almost always the same:</p>
<p><em>"Isn't that just noise?"</em></p>
<p>Fair question. Raw GitHub data is noisy. Commit counts alone tell you nothing. A bot can inflate them. A hackathon can spike them. A single developer pushing config files looks the same as a team shipping features.</p>
<p>But here's what changes everything: we don't look at absolute numbers. We look at <strong>acceleration patterns</strong>.</p>
<p>When a company's engineering velocity deviates sharply from its own baseline, that's not noise. That's a regime change. Something happened inside that company. They hired. They found product-market fit. They're preparing to launch.</p>
<p>In our analysis across 219 startups (the SSRN-published panel), companies that showed a 2x contributor spike within 14 days had a strong correlation with a fundraise within 21 to 47 days.</p>
<p>The signal is there. You just need the right lens.</p>
<p>Tomorrow, I want to talk about something uncomfortable: why your network might be showing you yesterday's deals.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
`),
  },

  // Day 2 — External objection (Russell: kept)
  {
    subject: "Why your network is showing you yesterday's deals",
    delayMs: THIRTY_MIN + 2 * ONE_DAY,
    html: wrap(`
<p>Your network is valuable. I'm not going to pretend it isn't.</p>
<p>But here's the uncomfortable truth: your network shows you what other investors are already seeing.</p>
<p>By the time a warm intro reaches you, the founder has probably talked to 3 to 5 other investors. The deck is circulating. The terms are forming. You're competing on reputation and speed, not on information.</p>
<p>The deals that generate outsized returns are the ones where you arrive before consensus forms. Before the deck exists. Before the company is "hot."</p>
<p>That's the window VC Deal Flow Signal opens.</p>
<p>When a startup's engineering is accelerating but their fundraise hasn't started, there's a gap. 21 to 47 days. In that gap, you can reach out first. You can offer help before they need money. You can build a relationship before everyone else is trying to.</p>
<p>Your network gets you to the table. This gets you there first.</p>
<p>Tomorrow: three concrete plays for using the signal once you have it.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
`),
  },

  // Day 3 — Use-case (Russell NEW: show the dream outcome)
  {
    subject: "If I had your check-size, here's how I'd use this",
    delayMs: THIRTY_MIN + 3 * ONE_DAY,
    html: wrap(`
<p>You've seen the data. You've heard the story. You've heard the objection take-downs. The question now is the practical one: what do you actually do with this?</p>
<p>Here's what I would do if I were you — a developer who also writes angel checks, somewhere between deal #5 and deal #40, with a thesis that's mostly AI infra, devtools, or technical SaaS.</p>
<p><strong>Play 1 — Sunday morning, 15 minutes.</strong></p>
<p>Open the digest. Pick the one org out of the 5 whose sector matches your thesis. Open their GitHub org. Read the most-changed repo's README. Read the last 10 commits. If the work is the kind of work you'd ship, send the founder a 3-line email Monday morning with one specific observation about the codebase. Not "love what you're building." Specific. The reply rate when you lead with a code observation is roughly 4x the reply rate when you lead with the deck-question.</p>
<p><strong>Play 2 — Wednesday afternoon, 30 minutes.</strong></p>
<p>Open the Dashboard, filter to your thesis sector + Seed stage. Look at the 10 highest-acceleration orgs that aren't in your portfolio. For each one, run the org through your existing portfolio's GitHub orgs to spot collaborators or shared contributors. Two of those will be people in your network indirectly — "I know X, who knows Y, who's a contributor on this repo." That's a warm-intro vector your AngelList syndicate doesn't have.</p>
<p><strong>Play 3 — End of quarter, 60 minutes.</strong></p>
<p>Pull the Custom Sector Sweep on the thesis you keep saying you want to go deeper on. Read it. Pick 3 orgs to talk to before the next AngelList round opens. The €1,997 is a write-off; the 3 conversations are not.</p>
<p>That's it. Three plays. Sunday, Wednesday, end-of-quarter. The dashboard is just a tool — the leverage is in the rhythm.</p>
<p>Tomorrow I'll send you something specific you can do for €7 that locks in the founding-member upgrade path.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The dashboard preview lives at <a href="${SIGNALS}" style="color:#0ea5e9;">${SIGNALS}</a> — Founding-member price (€9.97/mo, locked forever) closes May 15.</p>
`),
  },

  // Day 4 — €7 First Look tripwire (Russell NEW: first dollar)
  {
    subject: "Pick a sector. €7. Full deep-dive in 24 hours.",
    delayMs: THIRTY_MIN + 4 * ONE_DAY,
    html: wrap(`
<p>If you're still on the fence, here's the thing I'd suggest before any subscription:</p>
<p><strong>The First Look Pass — €7 once.</strong></p>
<p>You pick any one of our 20 tracked sectors at checkout. Within 24 hours I send you the full Sector Deep Dive PDF for that sector — top 25 ranked orgs, 14-day acceleration deltas, contributor maps, signal-type classification, and the top 3 names that haven't shown up on Crunchbase yet.</p>
<p>Plus the raw CSV. Plus a written walkthrough of what stood out.</p>
<p>Why €7 is the price: it's exactly what a coffee costs in central Lisbon. It's the lowest-friction commitment that filters out the time-wasters but doesn't punish someone who just wants to see the data on their thesis. It also means I can ship a custom report in 24 hours without it eating my whole week.</p>
<p>If you upgrade to the Dashboard within 14 days of receiving the deep dive, the €7 is credited. If you don't, you still keep the report and the CSV.</p>
<p><a href="${SITE}/#firstlook" style="color:#0ea5e9;font-weight:600;">Pick a sector and grab the pass &rarr;</a></p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The first 50 passes lock the €7 price — it goes to €19 after launch week.</p>
`),
  },

  // Day 5 — Dashboard close (Russell: pulled forward from day 7)
  {
    subject: "What commit velocity tells you that pitch decks can't",
    delayMs: THIRTY_MIN + 5 * ONE_DAY,
    html: wrap(`
<p>You've been getting the free digest. Here's what the full Dashboard shows.</p>
<p>The Dashboard (EUR 9.97/mo, founding-member, locked forever) gives you the full picture:</p>
<p>85+ startups ranked by engineering acceleration across 20 sectors. Not a static list. A living dashboard where companies move up and down based on real GitHub API data, refreshed weekly.</p>
<p>You can filter by:</p>
<ul>
<li>Sector (fintech, devtools, AI/ML, cybersecurity, healthcare, and 15 more)</li>
<li>Stage (pre-seed, seed, Series A/B, growth)</li>
<li>Geography (US, EU, APAC)</li>
</ul>
<p>Each startup shows commit velocity (14-day rolling), velocity change vs previous period, contributor growth, new repo creation signals, and signal type classification.</p>
<p>What pitch decks tell you: what the founder <em>wants</em> you to believe.<br>
What commit velocity tells you: what the engineering team is <em>actually doing</em>.</p>
<p>One is a narrative. The other is behavior.</p>
<p>The full 9-object stack — Dashboard, 219-startup Backtest CSV, monthly Sector Deep Dive PDF, Chrome Extension #1 (Crunchbase + Wellfound badge), Chrome Extension #2 (VC GitHub Lookup — hover any GitHub repo), Claude MCP Server, async Watchlist Build, Methodology Vault — totals €1,980 of standalone value. Founding-member price €9.97/mo, locked forever, 60-day no-questions refund.</p>
<p><strong>Founding-member window closes May 15</strong> or at 30 signups, whichever comes first. After that, the Dashboard goes to €49/mo permanently.</p>
<p><a href="${SITE}/#pricing" style="color:#0ea5e9;font-weight:600;">Lock in founding price &rarr;</a></p>
<p>If the free digest is enough for now, that's fine too. You'll keep getting it every Sunday.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
`),
  },

  // Day 6 — Insider Circle invite + VSL link (Russell NEW: mid-tier close)
  {
    subject: "The 12-minute walkthrough I owed you",
    delayMs: THIRTY_MIN + 6 * ONE_DAY,
    html: wrap(`
<p>You've now had:</p>
<ul>
<li>A week of context (Day 0 through Day 5).</li>
<li>The Sunday digest (your free forever).</li>
<li>The Dashboard offer (€9.97/mo, founding-member, closes May 15).</li>
<li>The €7 First Look Pass (if you grabbed one).</li>
</ul>
<p>Today I'm sending you the full 12-minute written walkthrough of the Insider Circle. No video, no webinar signup, no scheduled call. Just the walkthrough — read on your timeline.</p>
<p>It covers:</p>
<ul>
<li>The hook (47 days before the deck, with the 219-fundraise dataset)</li>
<li>The origin (the founder-friend Series A, and the conversation that almost made me ship this as a personal spreadsheet)</li>
<li>The three Insider-specific objections ("I already pay for Harmonic," "I could ETL myself," "How do I trust an anonymous founder")</li>
<li>The 8-object stack (€9,429/yr of value, anchored line by line)</li>
<li>The close (a future-pace mental movie of August 2026)</li>
</ul>
<p><a href="${SITE}/insider" style="color:#0ea5e9;font-weight:600;">Read the walkthrough &rarr;</a></p>
<p>If at the end you want in: €97/mo, founding-member price, locked forever, 60-day no-questions refund. If at the end you want out: keep reading the free digest. The free digest stays free, with or without you joining the Insider Circle. Nothing about this newsletter changes.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. Insider Circle members get next Sunday's 5 <em>24 hours early</em> in the private Telegram group. That's not a feature line on the page; that's the rhythm of the room.</p>
`),
  },

  // Day 9 — Bonus: public-data-edge follow-on (was old day-4)
  {
    subject: "Public data, private edge: a new way to source deals",
    delayMs: THIRTY_MIN + 9 * ONE_DAY,
    html: wrap(`
<p>Quick follow-on this week, then I'll let the Sunday digest do its thing.</p>
<p>"If the data is public, where's the edge?"</p>
<p>This is the most common objection I hear. And it reveals a misunderstanding about how edges actually work.</p>
<p>Everyone has access to SEC filings. Quant funds still make billions parsing them faster and smarter than everyone else.</p>
<p>Everyone has access to satellite imagery. Hedge funds use it to count cars in parking lots and predict quarterly earnings.</p>
<p>The edge isn't in having exclusive data. <strong>The edge is in reading what others ignore.</strong></p>
<p>Right now, zero investor tools package GitHub activity as a deal flow signal. The data is public. The analysis layer doesn't exist. That gap is your edge, and it stays your edge until the market catches up.</p>
<p>Think about it: how many investors in your network are monitoring GitHub commit velocity right now? How many have a system that flags engineering acceleration across hundreds of startups?</p>
<p>The answer is probably zero. That's the definition of an edge.</p>
<p>From here on out, the Sunday digest takes over. Five names a week, every Sunday, free forever. That's the rhythm.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. If you ever want to commission a custom one-off cut on a specific thesis, the Sector Sweep is €1,997 once: <a href="${SITE}/sector-sweep" style="color:#0ea5e9;">${SITE}/sector-sweep</a></p>
`),
  },
];
