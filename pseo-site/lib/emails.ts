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

/**
 * 7-Day Deal Flow Reset Challenge — alternate funnel for /challenge signups.
 * One email per day teaches one of the seven signals from the SSRN paper, with
 * a 5-minute manual exercise the subscriber can run themselves on a public
 * GitHub org. Day 7 reveals "or run it across 4,200 orgs in 4 seconds with the
 * MCP" and stacks the three CTAs (Dashboard / Insider / Sector Sweep).
 *
 * Trigger: GET /api/verify?cohort=challenge → schedules CHALLENGE_EMAILS
 * instead of SOAP_OPERA_EMAILS. /challenge signup form sets cohort=challenge.
 */
export const CHALLENGE_EMAILS = [
  // Day 0 — onboard (15 min)
  {
    subject: "Welcome — your 7-Day Deal Flow Reset starts now",
    delayMs: 15 * 60 * 1000,
    html: wrap(`
<p>Welcome to the 7-Day Deal Flow Reset.</p>
<p>Over the next 7 days I'll send you one email per day. Each one teaches you a single GitHub signal that has historically preceded a fundraise — drawn from the panel of 219 confirmed rounds in the SSRN paper at <a href="https://ssrn.com/abstract=6606558" style="color:#0ea5e9;">ssrn.com/abstract=6606558</a>.</p>
<p>Each email includes a <strong>5-minute manual exercise</strong> you can run yourself on any public GitHub org you're curious about. By the end of the week, you'll have a personal sourcing process that works without any tool.</p>
<p>On Day 7, I'll show you how the same seven signals run across 4,200 startup orgs in four seconds — but the goal of the week is for you to own the framework either way.</p>
<p>Here's the plan:</p>
<ul>
<li><strong>Day 1:</strong> Commit velocity — the easiest signal to read</li>
<li><strong>Day 2:</strong> Contributor diversity — what bus-factor reveals</li>
<li><strong>Day 3:</strong> Dependents graph — who's already building on top</li>
<li><strong>Day 4:</strong> README freshness — the cheapest leading indicator</li>
<li><strong>Day 5:</strong> New repo creation rate — the platform-buildout tell</li>
<li><strong>Day 6:</strong> Issue-to-PR ratio — engagement vs. shipping</li>
<li><strong>Day 7:</strong> Composite score + how to run it across 4,200 orgs</li>
</ul>
<p>Pick one startup before tomorrow. Any one. A founder you met, a company you almost-invested in, a portfolio org you want to monitor. Have its GitHub URL ready.</p>
<p>Tomorrow at the same time, Day 1 lands. Talk soon —<br>${FROM_NAME}</p>
`),
  },

  // Day 1 — Commit velocity
  {
    subject: "Day 1 — Commit velocity in 5 minutes",
    delayMs: 15 * 60 * 1000 + 1 * ONE_DAY,
    html: wrap(`
<p>Signal 1: <strong>commit velocity</strong>.</p>
<p>This is the simplest acceleration signal. It tells you whether the engineering team is shipping more in the last 14 days than they have on average over the last 90.</p>
<p><strong>The 5-minute exercise:</strong></p>
<ol>
<li>Open the GitHub org you picked yesterday.</li>
<li>Click the most-active repo.</li>
<li>On the repo home, click <em>Insights → Pulse → 1 month</em>.</li>
<li>Note: commits in the last week, commits in the last month.</li>
<li>Now click <em>3 months</em>. Note: commits in the last quarter.</li>
<li>Compute: <code>(weekly × 4) ÷ (monthly)</code> and <code>(monthly × 3) ÷ (quarterly)</code>.</li>
</ol>
<p>If both ratios are above ~1.3, the team is accelerating. If both are above 1.5, the acceleration is sharp enough to be worth a closer look.</p>
<p><strong>What you're filtering for:</strong> a sustained rate-of-change, not a single spike. A bot or a hackathon spikes for a week and reverts. A team that has hired or found product-market fit accelerates and stays accelerated.</p>
<p><strong>Edge case:</strong> for orgs with 50+ repos, do this on the top 3 repos by recent activity, not just one. You're trying to read the org-level signal, not a single-repo blip.</p>
<p>Tomorrow: contributor diversity — why a single-bus-factor codebase tanks the round.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },

  // Day 2 — Contributor diversity
  {
    subject: "Day 2 — Contributor diversity (the bus-factor signal)",
    delayMs: 15 * 60 * 1000 + 2 * ONE_DAY,
    html: wrap(`
<p>Signal 2: <strong>contributor diversity</strong>.</p>
<p>In the panel of 219 funded rounds, startups that closed had a contributor-diversity Gini coefficient of ~0.34 at month -3 before the round. Startups that did not close had ~0.61. Translation: <em>more concentrated codebases (one or two committers doing everything) close fewer rounds than distributed codebases.</em></p>
<p><strong>The 5-minute exercise:</strong></p>
<ol>
<li>Open the org's most-active repo.</li>
<li>Click <em>Insights → Contributors</em>. Set the date range to the last 90 days.</li>
<li>Count: how many contributors have ≥10 commits over 90 days?</li>
<li>Look at the top contributor's share. Is it &gt; 50% of total commits? &gt; 80%?</li>
</ol>
<p><strong>What you're filtering for:</strong> a team where the top contributor is &lt;50% of the volume and at least 4 people have 10+ commits. That's a real engineering team. Anything else is one founder with a side project, or a consultancy.</p>
<p><strong>Why investors care:</strong> a single-bus-factor codebase means the round is essentially funding one person's salary. A 4-person codebase is funding a team. The contract value, the dilution math, and the diligence story are all different.</p>
<p>Tomorrow: the dependents graph — who's already building on top of this startup's code.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },

  // Day 3 — Dependents graph
  {
    subject: "Day 3 — The dependents graph (who's already using this)",
    delayMs: 15 * 60 * 1000 + 3 * ONE_DAY,
    html: wrap(`
<p>Signal 3: <strong>the dependents graph</strong>.</p>
<p>This one is underused because most investors don't know GitHub exposes it. The dependents graph shows you every public repo that depends on this startup's code. It's the cheapest proxy for "is anyone actually using this."</p>
<p><strong>The 5-minute exercise:</strong></p>
<ol>
<li>Open the org's flagship repo (the one in their README, or the most-starred).</li>
<li>Click <em>Insights → Dependency graph → Dependents</em>.</li>
<li>If the page exists: count the dependents, look at the names.</li>
<li>If the page is empty or missing: the package is private or pre-distribution. Note that.</li>
</ol>
<p><strong>What you're filtering for:</strong> dependents that are not the startup's own repos. Real external usage means real adoption. A few hundred dependents on a developer-tools startup is a strong product-market-fit signal even if revenue is zero.</p>
<p><strong>Edge case:</strong> some orgs use private package registries (npm scoped, internal PyPI). Dependents won't show — that's a sign of enterprise distribution, not weakness.</p>
<p>Bonus tip: cross-check the dependents list against your portfolio's GitHub orgs. If two of your portfolio companies are already using this startup's code, that's a warm-intro vector your AngelList syndicate doesn't have.</p>
<p>Tomorrow: README freshness — the most under-rated leading indicator.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },

  // Day 4 — README freshness
  {
    subject: "Day 4 — README freshness (the under-rated signal)",
    delayMs: 15 * 60 * 1000 + 4 * ONE_DAY,
    html: wrap(`
<p>Signal 4: <strong>README freshness</strong>.</p>
<p>This is the cheapest leading indicator there is. The README is the public-facing pitch. Teams that are actively positioning for a fundraise update it. Teams that aren't, don't.</p>
<p><strong>The 5-minute exercise:</strong></p>
<ol>
<li>Open the org's flagship repo.</li>
<li>On the README file, click the file name to open it as a file.</li>
<li>Click <em>History</em>. Look at the last commit to the README.</li>
<li>Was it in the last 30 days? 60 days? Or 6+ months ago?</li>
</ol>
<p><strong>What you're filtering for:</strong> a README updated in the last 60 days, with the diff being substantive (rewritten positioning, new screenshots, updated install instructions, new "Used by" section) rather than a typo fix.</p>
<p><strong>Why this works:</strong> the README is the public pitch. When founders are about to raise, they tighten the positioning. A README that hasn't been touched in a year is either a dead project or a team focused entirely on internal customers — both relevant to your decision, but very different stories.</p>
<p><strong>Bonus signal:</strong> a "Funding" or "Investors" section that just appeared. Founders who are mid-raise often add this to make outreach easier.</p>
<p>Tomorrow: new repo creation rate — the platform-buildout tell.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },

  // Day 5 — New repo creation rate
  {
    subject: "Day 5 — New repo creation rate (platform buildout)",
    delayMs: 15 * 60 * 1000 + 5 * ONE_DAY,
    html: wrap(`
<p>Signal 5: <strong>new repo creation rate</strong>.</p>
<p>This signal is most useful for Series A / Series B startups. When the core product works and the team has capital, they start building the platform around it — SDKs, CLIs, internal services, documentation sites, example apps. Each one is a new public repo.</p>
<p><strong>The 5-minute exercise:</strong></p>
<ol>
<li>Open the org's main page.</li>
<li>Click <em>Repositories</em>, sort by <em>Newest</em>.</li>
<li>Count: how many repos created in the last 30 days? Last 90 days?</li>
<li>Open the newest 3. What do they look like — SDKs, infra, demos?</li>
</ol>
<p><strong>What you're filtering for:</strong> 3+ new repos in 30 days, where the new repos look like platform components (CLI, SDK in a new language, example app, internal microservice) rather than throwaways or test repos.</p>
<p><strong>Why investors care:</strong> this is the "deploying capital" signal. A team that just raised a Series A is hiring engineers and the first thing those engineers ship is platform code. A team that is about to raise often pre-builds these so the next deck has a "platform expansion" slide.</p>
<p><strong>Edge case:</strong> a single new repo named with a year or quarter ("foo-2026", "platform-q3") — that's a roadmap commitment in code form.</p>
<p>Tomorrow: issue-to-PR ratio — the engagement vs. shipping signal.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },

  // Day 6 — Issue:PR ratio
  {
    subject: "Day 6 — Issue-to-PR ratio (engagement vs. shipping)",
    delayMs: 15 * 60 * 1000 + 6 * ONE_DAY,
    html: wrap(`
<p>Signal 6: <strong>issue-to-PR ratio</strong>.</p>
<p>This is the team-health signal. A startup with a heavy issue queue and a thin PR queue is collecting feedback they can't ship against. A startup with closed PRs flowing daily and an issue queue that drains is shipping faster than they accumulate problems.</p>
<p><strong>The 5-minute exercise:</strong></p>
<ol>
<li>Open the org's most-active repo.</li>
<li>Click <em>Issues</em>. Note: open count, closed count, ratio.</li>
<li>Click <em>Pull requests</em>. Same — open, closed, ratio.</li>
<li>Compute: PRs closed in last 30 days ÷ Issues opened in last 30 days.</li>
</ol>
<p><strong>What you're filtering for:</strong> a ratio of ~1.5 or higher (more PRs closing than issues opening). Below ~0.7 means feedback is piling up faster than the team can ship.</p>
<p><strong>What this tells you about the round:</strong> a team that ships faster than its inbox is one that can absorb the next round's hire and accelerate further. A team buried in issues is one that needs the round to hire a triage layer first — the round is firefighting, not acceleration.</p>
<p><strong>Edge case:</strong> some teams use a separate issue tracker (Linear, Jira) and only use GitHub Issues for community reports. In that case, the ratio is misleading. Look at PR count alone — 10+ PRs closed in 30 days is healthy, &lt;3 is dormant.</p>
<p>Tomorrow is the wrap. I'll show you how to compose all six signals into a single score, and how to run it across 4,200 startup orgs in four seconds.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },

  // Day 7 — Composite + reveal
  {
    subject: "Day 7 — The composite, and 4,200 orgs in 4 seconds",
    delayMs: 15 * 60 * 1000 + 7 * ONE_DAY,
    html: wrap(`
<p>You now know six signals. Here is how to compose them.</p>
<p><strong>The composite score (manual version):</strong></p>
<ul>
<li>Commit velocity ratio &gt; 1.3 → +1</li>
<li>Top contributor &lt; 50% of commits AND ≥4 contributors with 10+ commits → +1</li>
<li>Dependents graph has &gt;50 external dependents → +1</li>
<li>README updated in last 60 days with substantive diff → +1</li>
<li>3+ new repos in last 30 days, looking like platform components → +1</li>
<li>PRs closed ÷ Issues opened (last 30d) &gt; 1.5 → +1</li>
</ul>
<p>Score 5 of 6, you're looking at a startup with a strong fundraise-precursor profile. Score 6 of 6 with sustained acceleration over 14 days, and the panel data says the round closes within 21–47 days about 38% of the time — which is roughly 5x the base rate.</p>
<p>That's the manual version. It takes ~30 minutes per startup. If you want to monitor a portfolio of 30, that is a 15-hour week.</p>
<p><strong>The fast version:</strong></p>
<p>The same six signals, plus a seventh (signal-type classification — hiring burst vs. infra buildout vs. deploy spike vs. framework migration), runs continuously across <strong>4,200 venture-backed startup GitHub orgs</strong> via the GitDealFlow signal engine. The full ranking is at <a href="${SIGNALS}/trending" style="color:#0ea5e9;">${SIGNALS}/trending</a>.</p>
<p>Three ways to use it from here:</p>
<ol>
<li><strong>Free Signal Digest:</strong> 5 names every Sunday. <a href="${SITE}/#signup" style="color:#0ea5e9;">${SITE}/#signup</a>. Free forever, no upgrade pressure.</li>
<li><strong>Dashboard, €9.97/mo founding rate:</strong> the full ranking, sector and stage filters, weekly refresh. <a href="${SITE}/#pricing" style="color:#0ea5e9;">${SITE}/#pricing</a></li>
<li><strong>Custom Sector Sweep, €1,997 one-time:</strong> a 40-page written report on the one sector you pick, plus the raw CSV, plus three early-stage targets not on Crunchbase. <a href="${SITE}/sector-sweep" style="color:#0ea5e9;">${SITE}/sector-sweep</a></li>
</ol>
<p>Whatever you do — even if you just keep running the manual version yourself — you now have a sourcing process that works without paying anyone. That's the point of the week.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The Sector Sweep is capped at 8 per quarter. Q3 2026 has 7 of 8 open as of this email.</p>
`),
  },
];
