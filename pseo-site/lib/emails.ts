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

// Apply utm_source=email so the click lands as "Email" in PostHog instead of
// "(direct)". Apple Mail / Outlook desktop strip the Referer header — UTM is
// the only attribution signal we can rely on for email clicks.
function tagEmailUrls(html: string, campaign: string): string {
  return html.replace(
    /href="(https?:\/\/(?:signals\.)?gitdealflow\.com)([^"]*)"/g,
    (_m, base: string, rest: string) => {
      const hashIdx = rest.indexOf("#");
      const anchor = hashIdx >= 0 ? rest.slice(hashIdx) : "";
      const pathQuery = hashIdx >= 0 ? rest.slice(0, hashIdx) : rest;
      const sep = pathQuery.includes("?") ? "&" : "?";
      const utm = `utm_source=email&utm_medium=drip&utm_campaign=${encodeURIComponent(campaign)}`;
      return `href="${base}${pathQuery}${sep}${utm}${anchor}"`;
    }
  );
}

function wrap(body: string, campaign: string = "drip"): string {
  const html = `<!DOCTYPE html>
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
  return tagEmailUrls(html, campaign);
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

  // Day 3.5 — Conversion Story (Brunson Expert Secrets Ch 12, V4 audit gap)
  // The 5-step bridge between belief takedown (D1-D2) and tripwire (D4):
  // Old way → New vehicle → External struggle → Internal struggle → Frameworks.
  {
    subject: "The five-step shift — in your own words",
    delayMs: THIRTY_MIN + Math.round(3.5 * ONE_DAY),
    html: wrap(`
<p>Yesterday's email gave you three plays. Today I want to give you the underlying shift in plain language, because the Sunday-Wednesday-quarter rhythm only works if step 5 sits on top of an honest read of steps 1 through 4.</p>
<p>Russell Brunson calls this the Conversion Story. Five sentences, one-to-five. Read them in order; the last one is the action.</p>
<p><strong>1. The old way you were sold.</strong><br>
"The best deals come from your network. Build the rolodex." Every operator-turned-investor is told this. It's the first lesson of every fellowship deck and every senior-partner conversation. Network is the vehicle. Warm intros are the engine. Time-in-seat is the moat.</p>
<p><strong>2. The new vehicle.</strong><br>
Engineering acceleration. Public, reproducible, code-side. Every great startup leaves a footprint in its code 21–47 days before the deck circulates. The methodology is reproducible (SSRN n=219). The cost of reading it is €9.97/mo. The new vehicle isn't bigger network — it's a different sensor.</p>
<p><strong>3. External struggle, removed.</strong><br>
You don't need partner-grade tooling. Harmonic, Tracxn, and Affinity are €1k–€10k/mo because they serve fund-grade procurement. Pull the sales motion out and the same data ladder runs at €9.97/mo. The category was priced wrong for you, not built wrong.</p>
<p><strong>4. Internal struggle, removed.</strong><br>
You don't need to become someone else to source. The lesson the network rule taught you was that you needed to turn into a partner-style human — coffees, calendar Tetris, social persuasion. The data-side path lets you stay the engineer who reads commit logs for fun. Identity stays intact. The signal does the introduction.</p>
<p><strong>5. The frameworks (and where they live).</strong><br>
Sunday digest. Wednesday filter. End-of-quarter sweep. The Acceleration Watch is the Sunday digest. The Dashboard is the Wednesday filter. The Sector Sweep is the end-of-quarter deep dive. Three rhythms, twelve minutes a week, methodology published. The shift is already wired into the product — you're not buying a tool, you're buying a cadence.</p>
<p>If steps 1-4 read like the room you're standing in, step 5 is the door.</p>
<p><a href="${SIGNALS}/perfect-webinar/5min" style="color:#0ea5e9;font-weight:600;">Read the 5-minute walkthrough &rarr;</a></p>
<p>Tomorrow: the €7 way to test step 5 on your own thesis before any subscription decision.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
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

  // Day 8 — Book promo (Brunson Secret 17 — Book Funnels, 2026-05-06).
  // The book is the highest-trust frontend in the stack. Anyone who's been
  // reading the drip for a week is exactly the audience that converts on a
  // 100-page methodology asset. Free PDF + EPUB, no friction.
  {
    subject: "I wrote a 104-page book. It's free. Here's the link.",
    delayMs: THIRTY_MIN + 8 * ONE_DAY,
    html: wrap(`
<p>Quick aside before the next Sunday digest.</p>
<p>I spent the last few weekends turning the seven-signal methodology into a proper book — 104 pages, the seven signals each in its own chapter, plus a methodology chapter and a 90-minute replication appendix that takes you from a fresh laptop to a verified rank against the live leaderboard.</p>
<p>It's free. PDF + EPUB + plain text + markdown, all four formats, no email gate beyond the one you've already given me, no upsell on the download page.</p>
<p style="margin:24px 0;"><a href="${SIGNALS}/book" style="display:inline-block;background:#0284c7;color:#ffffff;font-weight:600;font-size:15px;padding:11px 22px;border-radius:8px;text-decoration:none;">Get the book — free</a></p>
<p>Why free? Three reasons. The methodology is already public — the SSRN preprint at <a href="https://ssrn.com/abstract=6606558" style="color:#0ea5e9;">ssrn.com/abstract=6606558</a> is the formal version. Free distribution is the point: every reader who finds a false-positive pattern reports it back and the next edition gets better. And readers who get value from the book are the ones who eventually subscribe to the Dashboard — a book that closes that loop pays for itself in three subscribers.</p>
<p>If you want to support the work, the €0.99 Kindle copy adds three bonus emails (a worked walkthrough of the most recent Series A catch, the unedited investor interviews, and a direct line to me for thirty days). Same content, different bonus stack.</p>
<p>Read it on a flight, on a long Saturday morning, or skip to the appendix and run the script against your own watchlist this weekend. Either way works.</p>
<p>— ${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The book is also fully readable on the open web at <a href="${SIGNALS}/book/read" style="color:#0ea5e9;">${SIGNALS}/book/read</a> — Google-indexed, citation-friendly. If you find it useful, sharing the URL with one investor friend is the most useful thing you can do.</p>
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

  // Day 11 — Book deep-dive promo (Brunson Secret 17 sequel, 2026-05-06).
  // Reinforces the book asset for readers who didn't open D8. Different angle:
  // points to a single specific chapter and a single specific exercise.
  {
    subject: "If you only read one chapter, read this one",
    delayMs: THIRTY_MIN + 11 * ONE_DAY,
    html: wrap(`
<p>If the book email three days ago got buried, the link is at the bottom — but here's a sharper version.</p>
<p>The book has eleven sections. Most readers I've heard from skipped straight to chapter 9 — the replication appendix — and ran the script against their own watchlist before reading anything else.</p>
<p>That was the right call. The appendix takes ninety minutes. By the end you have a Python file that computes Signals 1, 2, and 6 against any GitHub organization, and you've verified the numbers against the live leaderboard.</p>
<p>From that point on, the methodology is yours. The leaderboard, the Dashboard, the MCP server — all of it becomes a convenience layer over a workflow you can run yourself, on a $0 budget, indefinitely.</p>
<p>If that's the workflow you want, jump straight to the appendix:</p>
<p style="margin:20px 0;"><a href="${SIGNALS}/book/read/replication-appendix" style="color:#0ea5e9;font-weight:600;">→ Read the 90-minute replication walkthrough</a></p>
<p>If you'd rather start at the beginning and have it on Kindle:</p>
<p style="margin:20px 0;"><a href="${SIGNALS}/book" style="color:#0ea5e9;font-weight:600;">→ Free PDF + EPUB (or €0.99 Kindle with three bonus emails)</a></p>
<p>Either path works. The methodology is the same.</p>
<p>— ${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. If you've already read it and have a methodology question, reply to this email. The book is meant to be improved over time — every correction I get back gets folded into the next edition with attribution.</p>
`),
  },

  // Day 12 — Daily Seinfeld: thing-I-noticed observation (Russell DotCom #7).
  // Audit 2026-05-05: list had no rhythm between day-9 close and the next
  // weekly digest. This entry seeds the post-pitch cadence.
  {
    subject: "Thing I noticed in the data this week",
    delayMs: THIRTY_MIN + 12 * ONE_DAY,
    html: wrap(`
<p>Quick one — the kind of email I want to send more of.</p>
<p>Pulled the panel this week and noticed something I hadn't filtered for before.</p>
<p>The orgs with the highest 14-day commit-velocity acceleration AND the lowest top-contributor concentration (Gini under 0.30) are 3.4× more likely to announce a Series A within 60 days than orgs with high acceleration alone.</p>
<p>In other words: <strong>velocity matters, but the shape of the velocity matters more.</strong> A team where one developer is doing 80% of the commits can spike just as hard as a team where eight developers are sharing the load. But only one of those teams looks like a fundraise candidate to a VC.</p>
<p>That's not a Dashboard feature, that's just an observation. Filed it away. Will run the regression next week to see if the lift survives a longer panel.</p>
<p>If you've noticed a similar pattern reading commit graphs yourself, reply and tell me. The data behind this product gets sharper every time someone pushes back on it.</p>
<p>Sunday digest hits as usual. Five names. Ranked. No fluff.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },

  // Day 14 — Seinfeld: war story (Russell DotCom #16, "Backstory" pattern).
  // Brunson trilogy audit 2026-05-05 evening — the soap opera ended at day-12
  // with a single observation; the rhythm needs to *continue* past the close,
  // not stop. This entry tells one specific story episode without breaking
  // anonymity.
  {
    subject: "The deal I missed because I trusted the deck",
    delayMs: THIRTY_MIN + 14 * ONE_DAY,
    html: wrap(`
<p>Story today. No data table.</p>
<p>Late 2024. A founder I'd known loosely for two years sent me a deck. Strong team, sensible thesis, beautiful product slide. I read it twice on a Tuesday morning and decided to pass — not because anything was wrong, but because the slide deck didn't show me anything I couldn't have predicted from the founder's LinkedIn.</p>
<p>Three weeks later they announced an oversubscribed round at a valuation roughly twice what I'd assumed.</p>
<p>I went back to the data afterward. If I'd opened their GitHub org instead of their deck, I'd have seen what the round-leading partner saw: their commit velocity had doubled, their top three repos were all enterprise-grade infrastructure that hadn't been there 12 weeks earlier, and a senior engineer from a public co had quietly joined as the seventh contributor on the main repo.</p>
<p>The deck didn't show any of that. The deck couldn't show any of that — it's not a thing that fits on a slide. The data was on github.com the whole time. Free. Public. Indexed by Google. I just hadn't looked.</p>
<p>That's the gap this product exists for. Not "use this instead of decks" — use this <em>before</em> the deck arrives, so when the deck does, you already know the company's shape.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The dashboard ranks the same kind of pre-deck signals across 209 venture-backed orgs every Monday. €9.97/mo founding price, locked forever: <a href="${SITE}/#pricing" style="color:#0ea5e9;">${SITE}/#pricing</a></p>
`),
  },

  // Day 17 — Seinfeld: tactical play (Russell DotCom #16, "Story-Lesson-CTA").
  {
    subject: "A 15-minute Sunday play that actually works",
    delayMs: THIRTY_MIN + 17 * ONE_DAY,
    html: wrap(`
<p>If you only do one thing with the digest each week, do this.</p>
<p>Sunday morning. Coffee. Open the digest. Pick the one org out of the five whose sector matches your thesis closest. Open their GitHub org in another tab.</p>
<p>Read the most-changed repo's README. Read the last 10 commits. Open the contributor list and look at the three names who weren't there 30 days ago.</p>
<p>If the work looks like work you'd ship, send the founder a three-line email Monday morning. The email has one sentence about what specifically caught your eye in the codebase, one sentence about your background, one sentence inviting a 20-minute call. That's it.</p>
<p>The reply rate when you lead with a code observation is roughly 4× the reply rate when you lead with the deck-question. I've tracked it across maybe 120 sends. Holds up.</p>
<p>The leverage isn't in the dashboard. The leverage is in the rhythm. 15 minutes a week, one specific email a month, and your deal flow looks completely different inside a quarter.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The full dashboard (209 orgs, sortable) is at <a href="${SIGNALS}" style="color:#0ea5e9;">${SIGNALS}</a> — Insider Circle members get next Sunday's 5 picks 24h early in the private Telegram.</p>
`),
  },

  // Day 21 — Seinfeld: belief reinforcement / micro-objection takedown.
  {
    subject: "What about the false positives?",
    delayMs: THIRTY_MIN + 21 * ONE_DAY,
    html: wrap(`
<p>Honest objection from a reader this week, paraphrased: "GitHub momentum is great when it works, but how often does a spike NOT lead to a fundraise?"</p>
<p>Fair question. Here are the numbers from the panel of 219 confirmed rounds plus the matched control set.</p>
<p>Roughly 38% of orgs that show a 2× contributor-influx + commit-velocity-acceleration spike DON'T announce a fundraise within 90 days. That's a real false-positive rate. The signal isn't a coin flip in the right direction, it's somewhere around 62% precision at 90 days.</p>
<p>But here's the part that surprised me when I ran it: the false positives aren't random. About 70% of them are companies that <em>raised silently</em> — extension rounds, secondaries, or strategic check-ins that never hit Crunchbase. Another 15% are companies that had a real product launch, not a fundraise, in the same window. Only about 4% of false positives are genuinely "team got busy and nothing happened."</p>
<p>So if you treat the signal as "this company is doing something material in the next 90 days," not "this company is announcing a round," the precision goes up to 96%. The shape of <em>what</em> they're doing changes — but the fact that they're doing something material is a near-certainty.</p>
<p>That changes how I use the dashboard. I don't open it asking "who's about to raise." I open it asking "who's about to do something I should know about." The first question is fragile. The second one is the one the data was built to answer.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },

  // Day 25 — Seinfeld: behind-the-scenes / methodology peek (DotCom #16).
  {
    subject: "How I rebuilt the regression last weekend",
    delayMs: THIRTY_MIN + 25 * ONE_DAY,
    html: wrap(`
<p>Got asked by a reader why the lead-time number on the homepage is "21 to 47 days" rather than a single number. Worth answering.</p>
<p>The first version of the regression spat out a single mean: 34 days. Nice round number. The kind of number you put on a homepage.</p>
<p>But when I bucketed by stage, the mean fell apart. Pre-seed and Seed rounds had a lead time around 21-28 days. Series A around 35-45 days. Series B around 47-60 days. The single mean was hiding three distinct populations.</p>
<p>So I went back and rebuilt the panel with stage as a stratification variable. The 21-to-47 range you see on the homepage is the 25th-to-75th percentile across all stages combined, weighted by frequency in the panel. It's the band where roughly half of all rounds fell.</p>
<p>The reason I tell you this: there's a temptation in this kind of product to round the methodology into a single clean number that fits a marketing page. I'm not going to do that. Every claim on the site is recoverable from the SSRN preprint, and where the data is messier than the headline number, the page admits it.</p>
<p>That's also why the methodology is open and the source code on Sharp Tier is CC BY 4.0 — you should be able to fork the entire thing and re-derive every claim from public data without needing to trust me.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. Methodology page: <a href="${SIGNALS}/methodology" style="color:#0ea5e9;">${SIGNALS}/methodology</a> · SSRN paper: <a href="https://ssrn.com/abstract=6606558" style="color:#0ea5e9;">ssrn.com/abstract=6606558</a></p>
`),
  },

  // Day 30 — Seinfeld: scarcity nudge tied to a real, time-bounded thing
  // (founding price). Russell rule: scarcity must be honest, not manufactured.
  {
    subject: "Thirty days in. One quiet decision.",
    delayMs: THIRTY_MIN + 30 * ONE_DAY,
    html: wrap(`
<p>You've been on this list for about a month. Long enough to know whether the rhythm fits.</p>
<p>The free Sunday digest stays exactly as it is — five startups every Monday morning, sector-tagged, no commitment, forever. If that's the right cadence for the way you write checks, keep doing what you're doing. I'd rather have you reading the free version for ten years than upgrade once and resent it.</p>
<p>The one real time-bounded decision is the founding-member price on the Dashboard.</p>
<p>It's €9.97/mo right now. Locked forever for everyone who joins before the founding cohort closes. After that the standard price is €29/mo for new subscribers, and the founding-cohort price is honored only for subscribers who joined before the close. I haven't set a hard close date publicly, but the soft target is when the subscriber count crosses 1,000 paying — at which point the rhythm of the product is established and the founding-price chapter closes.</p>
<p>If the dashboard fits the way you source deals — the live ranked panel, the 219-startup backtest CSV, the monthly sector deep-dive PDF, the methodology source, the 30-day Signal-or-It's-Free guarantee — that's the rung where the math works for most readers. €9.97 × 12 is €119.64 for the year. One missed angel cheque pays it back forty times over.</p>
<p>If it doesn't fit, no problem. The free digest stays. The soap opera ends here, the rhythm continues. You'll get a Sunday digest this weekend like always.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. Founding-price checkout: <a href="${SITE}/#pricing" style="color:#0ea5e9;">${SITE}/#pricing</a> · Quiz if you're unsure which tier fits: <a href="${SIGNALS}/quiz" style="color:#0ea5e9;">${SIGNALS}/quiz</a> · Funnel hub if you want to see all 9 doors: <a href="${SIGNALS}/funnels" style="color:#0ea5e9;">${SIGNALS}/funnels</a></p>
`),
  },

  // Day 45 — Insider upsell. Brunson "value ladder ascension" — by week 7
  // the buyer either bought Dashboard or stayed free. This email pitches
  // the next rung (Insider Circle) by selling the 24-hour lead, not the
  // features. Free-tier reads it; Dashboard subscribers also read it as
  // an obvious upgrade trigger.
  {
    subject: "The 24-hour head-start I wish I had given a friend",
    delayMs: THIRTY_MIN + 45 * ONE_DAY,
    html: wrap(`
<p>Quick story. Three Sundays ago a friend texted me at 11pm: "saw your acceleration list, the third name was the company I almost cold-emailed in March, kicking myself."</p>
<p>The list publishes Mondays at 09:00 UTC. He saw it Sunday night, but only because I had forwarded my Insider Circle briefing two hours after I sent it. The public list wouldn't have hit his inbox for another nine hours. By the time it had, the founder he wanted to reach would have had four other investors in DMs.</p>
<p>That's the only thing the Insider Circle actually sells. Same ten ranked names, sent Sunday at 09:00 UTC instead of Monday. One full sourcing day before any other investor sees them.</p>
<p>Everything else — the closed Telegram group, the JSON/CSV API, the custom watchlist co-built around your thesis, the webhooks, the direct founder line — is a tool that makes the Sunday-evening rhythm easier. The product is the 24-hour lead.</p>
<p>If you write more than ten checks a year, the math is roughly: one founder per quarter that you reached because you had a head-start. At a €5k–€50k angel range with even a 3× exit on one in five, that's somewhere between €15k and €150k of expected value per Sunday-night head-start. €97/mo is €1,164 a year. The numbers don't work the other way.</p>
<p>The full case is on the page: <a href="${SIGNALS}/insider" style="color:#0ea5e9;">${SIGNALS}/insider</a></p>
<p>Founding-member rate is €97/mo, locked for the lifetime of the subscription. Public hike to €197 lands the day a regulated investor tool reviews us. The Telegram group is one-seat-per-subscription; founding members keep their seat permanently even if the cap is later lowered.</p>
<p>If Insider isn't right for you yet, no problem — the free digest stays free, and Dashboard at €9.97/mo is the right rung for most of you.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The Sunday briefing arrives 24h before the public Monday list. That's it. That's the product.</p>
`),
  },

  // Day 60 — Sector Sweep upsell. Buyer who got value from Dashboard or
  // who's in a focused-thesis mode is now warm enough for the high-ticket
  // one-time. Pitched as "if you went all in for one weekend".
  {
    subject: "If you went all in on one sector for a weekend",
    delayMs: THIRTY_MIN + 60 * ONE_DAY,
    html: wrap(`
<p>Most weeks the Dashboard is the right tool. Five names on Sunday, five sector pages on Monday, a 15-minute review block, done.</p>
<p>But about once a quarter, the right move is the opposite shape — go deep on one thesis, build the entire panel from scratch, and end up with a written artefact you can paste into an IC memo or a fund newsletter.</p>
<p>That's the Sector Sweep. €1,997 one-time, capped at 8 sweeps per quarter (Q3 2026: 7 of 8 still open). 40-page custom PDF on the sector you pick, raw CSV of every org × every metric, top-five deep dives with diligence prompts, three pre-Crunchbase early-stage targets, 14-day Q&A window for follow-up cuts.</p>
<p>Itemized value on the page works out to ~€13,000 of analyst time at standard rates: <a href="${SIGNALS}/pricing#sector-sweep-stack" style="color:#0ea5e9;">${SIGNALS}/pricing#sector-sweep-stack</a></p>
<p>Two reasons to consider it now, specifically:</p>
<p>One — €1,997 is 100% credited to Insider Circle if you upgrade within 60 days of receiving the Sweep. That's roughly your first 20 months of Insider, paid in full.</p>
<p>Two — the 30-day Signal-or-It's-Free guarantee covers the Sweep itself. If we don't surface three orgs you didn't already know about, reply REFUND.</p>
<p>If your thesis is genuinely focused on one sector this quarter — AI infra, dev tools, fintech rails, vertical SaaS, climate, whatever — this is the artefact that compresses three weeks of analyst work into one weekend of reading. Email me with the sector you want covered and I'll send back a tailored proposal in 24 hours.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. Email <a href="mailto:signal@gitdealflow.com?subject=Sector%20Sweep" style="color:#0ea5e9;">signal@gitdealflow.com</a> with subject "Sector Sweep" and the sector. We confirm the spec inside one business day.</p>
`),
  },

  // Day 75 — Crystal Ball game invite. Reactivation email for free-tier
  // readers who haven't bought yet. Free public game, no purchase, but
  // captures intent + builds taste credibility for a future warmer pitch.
  {
    subject: "Pick a startup. We'll grade you in 90 days.",
    delayMs: THIRTY_MIN + 75 * ONE_DAY,
    html: wrap(`
<p>Two new things to tell you about, because both are free and both build a public track record without a single cheque written.</p>
<p>First — the Underwriting Receipts ledger is now live: <a href="${SIGNALS}/wins" style="color:#0ea5e9;">${SIGNALS}/wins</a>. Every venture-backed startup whose GitHub engineering acceleration matched the SSRN signal pattern before the funding round. No testimonials, no headshots, just the org, the repo, the event, and the date. ~75 entries on the panel today. We append, never edit.</p>
<p>Second — the Crystal Ball game is open: <a href="${SIGNALS}/crystal-ball" style="color:#0ea5e9;">${SIGNALS}/crystal-ball</a>. Pick any GitHub org. Predict that they'll announce a funding round within 90 days. We grade post-hoc against TechCrunch, Crunchbase, and SEC filings. Leaderboard tracks your hit rate weighted by lead time.</p>
<p>The reward isn't money — there's no real money in the loop. The reward is the public track record. Five hits earn the Founding Forecaster badge (permanent, public) and unlock 50% off a Sector Sweep.</p>
<p>If you've been reading the Sunday digest and wondering whether your taste matches the data, this is the cheapest way to find out.</p>
<p>Three picks per quarter is enough to start showing taste. The cap is one pick per email per week to keep the leaderboard clean.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The leaderboard is public and indexable. Forecasters in the founding cohort have already had angel-allocation introductions because their pick history was the credential.</p>
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
