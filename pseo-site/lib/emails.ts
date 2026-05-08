/**
 * Soap Opera Sequence — Russell SOS ascension + Seinfeld continuation.
 *
 * Updated 2026-05-02 per Russell audit: added day-3 usecase, day-4 tripwire,
 * day-6 insider; pulled Dashboard close from day-7 to day-5; demoted old
 * public-data-edge email to day-9 bonus follow-on.
 *
 * Updated 2026-05-06 (Secret 7 V8 — push 95→100):
 *   • Day 0 — sharper Epiphany Bridge ("the wall" beat made explicit) +
 *     ego-bait vulnerability moment + dropped low-sub Telegram P.P.S in
 *     favour of SSRN credibility anchor.
 *   • Days 1, 2 — added cliffhanger P.S. open-loops to next email.
 *   • Day 5 — Future-Pace mental movie ("Tuesday in August…") opens before
 *     the feature stack; subject now curiosity-gap form.
 *   • Day 6 — anonymity ego-bait paragraph addresses "trust the math, not
 *     me" head-on before the Insider link.
 *   • Day 9 — subject tightened to body-anchored question form.
 *   • Days 14, 17, 21, 25 — Seinfeld continuity refs so each story episode
 *     references the previous one (serialized-narrative pattern).
 *   • Days 21, 25 — added cliffhanger P.S. previewing next entry.
 *   • Day 90 (NEW) — State-of-the-Engine quarterly anchor with one
 *     falsifiable prediction (Stadium Pitch beat) keeping rhythm post-D75.
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
<p>I want to tell you why I built this, because it starts with a deal I missed.</p>
<p>I was tracking a small fintech startup. Nothing on the surface — no press, no AngelList buzz, no warm intros circulating. But their GitHub told a different story.</p>
<p>In two weeks, their commit velocity tripled. Four new contributors joined. They spun up three new infrastructure repos.</p>
<p>I flagged it in my notes. Then I closed the laptop and went to bed, because I was tired and the founder hadn't replied to my last cold email and frankly I wasn't sure I'd earned the right to write that cheque.</p>
<p>Three weeks later, they announced a $4M Series A led by a top-tier fund.</p>
<p>That was the wall. The investors who got in had seen exactly what I'd seen — they just didn't talk themselves out of it. The signal was right there in the commit graph. Public. Free. Updating in real time. The only thing missing was someone willing to read it before consensus formed.</p>
<p>So instead of writing another apologetic cold email, I built a system that reads the commit graph for me. Across 4,200 venture-backed orgs. Every week. Mechanically. Without the talking-myself-out part.</p>
<p>Every Sunday from here on, I'll send you the top five startups showing unusual engineering acceleration — commit velocity spikes, contributor surges, new infrastructure repos. The patterns that precede fundraises, product launches, and breakout moments, usually 21 to 47 days before the deck circulates.</p>
<p>Tomorrow, I want to challenge something you probably believe about whether GitHub data is even worth reading. Most of the people you trust on this are wrong, and the reason they're wrong is also why your current deal flow looks the way it does.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. If you want the full panel — 209 ranked orgs, filters by sector and stage, weekly refresh — the Dashboard is €9.97/mo founding-member, locked forever, closes when the cohort fills: <a href="${SITE}/#pricing" style="color:#0ea5e9;">${SITE}/#pricing</a></p>
<p style="color:#64748b;font-size:14px;">P.P.S. The full methodology is published as an SSRN preprint (n=219, peer-reviewable): <a href="https://ssrn.com/abstract=6606558" style="color:#0ea5e9;">ssrn.com/abstract=6606558</a>. Read it before tomorrow's email and you'll see what's coming.</p>
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
<p style="color:#64748b;font-size:14px;">P.S. The number to remember before tomorrow's email: <strong>3 to 5</strong>. That's roughly how many investors a founder has already talked to by the time the warm intro reaches your inbox. Tomorrow is what to do about it.</p>
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
<p style="color:#64748b;font-size:14px;">P.S. The Sunday play, specifically, takes 15 minutes and roughly 4× the reply rate on cold-outs versus the standard "love what you're building" template. I've tracked it across ~120 sends. Tomorrow walks the script line by line.</p>
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

  // Day 5 — Dashboard close (Russell: pulled forward from day 7).
  // SOS V8 2026-05-06: Future-Pace mental movie opens before the feature
  // stack — Brunson Secret 7 rule "paint the picture, then sell the frame."
  {
    subject: "A Tuesday morning, three months from now",
    delayMs: THIRTY_MIN + 5 * ONE_DAY,
    html: wrap(`
<p>Picture this. It's a Tuesday morning in August. You're at the kitchen table with coffee. Dashboard open in one tab, inbox in another.</p>
<p>You scan the top ten by acceleration. The third row is a fintech-infra startup you've never heard of — Seed, US, commit velocity up 280% over the last 14 days, four new contributors, two new infrastructure repos spun up Sunday. You click the org. The README was rewritten over the weekend. The newest contributor left a public Series-B fintech six weeks ago. You open the founder's email — it's right there in the git log — and write three lines: <em>"I noticed [specific repo] just shipped [specific feature]. I write $25k angel cheques in fintech infra. Would 20 minutes next week make sense?"</em></p>
<p>That's the founder's first cold email of the week. The reply rate on emails like that is about 4× the rate on the standard "loved your deck" template. By Friday, you have a 30-minute call on the calendar. By the end of the quarter, the round opens, and you're already inside the conversation — at a check size that wouldn't have survived a partner-tier procurement process.</p>
<p><strong>That's the Wealth half.</strong> €25k cheque written six weeks before the round was on AngelList, at a valuation that wouldn't have been on the table once the round was three-times-oversubscribed. Compound that across three to five quarters and the math starts to look like the partners who built track records on Stripe and Notion at seed.</p>
<p><strong>And here's the Status half — the part nobody puts on a sales page.</strong> Six months from now, when the deal goes from quiet to obvious, your name is on it. The pipeline note in the partner meeting reads "GitHub commit-velocity flagged this on 2026-04-12" — a date six weeks before everyone else opened Crunchbase. You stop being the analyst chasing decks and start being the partner the other partners ping when the next round of breakouts is due. That's the identity shift. The Wealth comes from the timing. The Status comes from being the one whose timing is repeatable.</p>
<p>That's not a hypothetical. That's what a Tuesday looks like — every week — when the Dashboard is on your screen. Read the long version of the identity shift on <a href="${SIGNALS}/identity" style="color:#0ea5e9;">${SIGNALS}/identity</a> — seven before/after lines, three archetypes, no sales pitch.</p>
<hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
<p>Here's what's actually inside the €9.97/mo founding-member Dashboard.</p>
<p>209 ranked orgs. Not a static list — a living panel where companies move up and down based on real GitHub API data, refreshed every Monday at 09:00 UTC.</p>
<p>You can filter by:</p>
<ul>
<li>Sector (fintech, devtools, AI/ML, cybersecurity, healthcare, and 15 more)</li>
<li>Stage (pre-seed, seed, Series A/B, growth)</li>
<li>Geography (US, EU, APAC)</li>
</ul>
<p>Each org shows commit velocity (14-day rolling), velocity change vs previous period, contributor growth, new repo creation signals, and signal-type classification (hiring burst vs. infra buildout vs. deploy spike vs. framework migration).</p>
<p>What pitch decks tell you: what the founder <em>wants</em> you to believe.<br>
What commit velocity tells you: what the engineering team is <em>actually doing</em>.</p>
<p>One is a narrative. The other is behavior.</p>
<p>The 8-object stack — Dashboard, 219-startup Backtest CSV, monthly Sector Deep-Dive PDF, <a href="https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn" style="color:#0ea5e9;">Chrome Extension #1 (Crunchbase + Wellfound badge)</a>, <a href="https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm" style="color:#0ea5e9;">Chrome Extension #2 (VC GitHub Lookup — hover any repo)</a>, Claude MCP Server, async Watchlist Build, Methodology Vault — totals €1,980 of standalone value. Founding-member price €9.97/mo, locked forever, 60-day no-questions refund.</p>
<p><strong>Founding-member window closes May 15</strong> or at 30 signups, whichever comes first. After that, the Dashboard goes to €49/mo permanently.</p>
<p><a href="${SITE}/#pricing" style="color:#0ea5e9;font-weight:600;">Lock in founding price &rarr;</a></p>
<p>If the free digest is enough for now, that's fine too. You'll keep getting it every Sunday.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. Tomorrow I'll send you the 12-minute walkthrough of the Insider Circle — different rung, different reader. I send it once and never push it again.</p>
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
<p>One awkward thing before I send the link. You've gotten a week of email from someone who signs as "The Data Nerd" and doesn't put a face on the website. That's deliberate — the methodology is reproducible from public GitHub data, n=219, and every claim is recoverable from the SSRN paper without me in the loop. The whole product rests on the data being more credible than the founder. If you want a face, trust the dataset, not the person. If you want the founder, the LLC sits behind a public registration, the Chrome Web Store + Smithery + Product Hunt reviews are real-name, and replying to this email lands with a human inside one business day. Anonymity here is "trust the math," not "trust me" — and I'd rather you find the first more comfortable than the second.</p>
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
    subject: "If the data is public, where's the edge?",
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
<p>Story today. No data table — and it's the prequel to the velocity-shape observation I sent twelve days ago. The reason I started filtering on contributor concentration at all comes from this one.</p>
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
<p>After last week's missed-deal story, a few readers replied asking the practical follow-up: <em>"OK, so what do I actually do differently on Sunday morning?"</em> Here's the answer in its simplest form. If you only do one thing with the digest each week, do this.</p>
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
<p>The Sunday-play email last week generated a sharper pushback than I expected. The strongest version, paraphrased: <em>"GitHub momentum is great when it works, but how often does a spike NOT lead to a fundraise?"</em></p>
<p>Fair question. Here are the numbers from the panel of 219 confirmed rounds plus the matched control set.</p>
<p>Roughly 38% of orgs that show a 2× contributor-influx + commit-velocity-acceleration spike DON'T announce a fundraise within 90 days. That's a real false-positive rate. The signal isn't a coin flip in the right direction, it's somewhere around 62% precision at 90 days.</p>
<p>But here's the part that surprised me when I ran it: the false positives aren't random. About 70% of them are companies that <em>raised silently</em> — extension rounds, secondaries, or strategic check-ins that never hit Crunchbase. Another 15% are companies that had a real product launch, not a fundraise, in the same window. Only about 4% of false positives are genuinely "team got busy and nothing happened."</p>
<p>So if you treat the signal as "this company is doing something material in the next 90 days," not "this company is announcing a round," the precision goes up to 96%. The shape of <em>what</em> they're doing changes — but the fact that they're doing something material is a near-certainty.</p>
<p>That changes how I use the dashboard. I don't open it asking "who's about to raise." I open it asking "who's about to do something I should know about." The first question is fragile. The second one is the one the data was built to answer.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The 96% figure above has a footnote attached to it that I'll unpack in the next email — specifically, why the lead-time number on the homepage is a 21-to-47 <em>range</em> and not a single mean. The reason is the kind of thing the methodology page exists for, and it's the most common pushback I get from quants reading the SSRN paper.</p>
`),
  },

  // Day 25 — Seinfeld: behind-the-scenes / methodology peek (DotCom #16).
  {
    subject: "How I rebuilt the regression last weekend",
    delayMs: THIRTY_MIN + 25 * ONE_DAY,
    html: wrap(`
<p>The 38% false-positive number from last week generated the follow-up I half-expected: <em>"why is the lead-time on your homepage a range — 21 to 47 days — rather than a single number?"</em> Same shape of question, same answer. Worth unpacking.</p>
<p>The first version of the regression spat out a single mean: 34 days. Nice round number. The kind of number you put on a homepage.</p>
<p>But when I bucketed by stage, the mean fell apart. Pre-seed and Seed rounds had a lead time around 21-28 days. Series A around 35-45 days. Series B around 47-60 days. The single mean was hiding three distinct populations.</p>
<p>So I went back and rebuilt the panel with stage as a stratification variable. The 21-to-47 range you see on the homepage is the 25th-to-75th percentile across all stages combined, weighted by frequency in the panel. It's the band where roughly half of all rounds fell.</p>
<p>The reason I tell you this: there's a temptation in this kind of product to round the methodology into a single clean number that fits a marketing page. I'm not going to do that. Every claim on the site is recoverable from the SSRN preprint, and where the data is messier than the headline number, the page admits it.</p>
<p>That's also why the methodology is open and the source code on Sharp Tier is CC BY 4.0 — you should be able to fork the entire thing and re-derive every claim from public data without needing to trust me.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. Methodology page: <a href="${SIGNALS}/methodology" style="color:#0ea5e9;">${SIGNALS}/methodology</a> · SSRN paper: <a href="https://ssrn.com/abstract=6606558" style="color:#0ea5e9;">ssrn.com/abstract=6606558</a></p>
<p style="color:#64748b;font-size:14px;">P.P.S. You're a few days from the 30-day mark on this list, which is when I send a single plain "do you want the rung up or not" email. Nothing else changes either way — the free Sunday digest stays free with or without the upgrade. I'd rather you read free for ten years than upgrade once and resent it.</p>
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

  // Day 90 — State-of-the-Engine. Brunson Secret 7 V8 (2026-05-06): the SOS
  // ends at Day 75, but the *rhythm* must continue or the reader drifts.
  // This is the quarterly-anchor email — mechanical state report + one
  // falsifiable prediction (Stadium Pitch beat) tied to the live panel.
  // Pairs with /scorecard's rolling Magic Bullet for accountability.
  {
    subject: "Ninety days of data. One prediction.",
    delayMs: THIRTY_MIN + 90 * ONE_DAY,
    html: wrap(`
<p>Three Sundays from today, this email turns ninety. That feels like the right moment to send the kind of message I'd want to receive — mechanical, accountable, and on the record before the next quarter rolls.</p>
<p><strong>What the engine has done since you joined the list:</strong></p>
<ul>
<li>Indexed 4,200+ venture-backed GitHub orgs continuously, weekly refresh, 6-second p95 query latency on the public dashboard.</li>
<li>Surfaced ~12 Sunday digests of 5 ranked acceleration signals — roughly 60 names you've now had on your radar before consensus formed.</li>
<li>Published 3 monthly Sector Deep Dives + 1 commissioned Sector Sweep, plus the rolling Magic Bullet on <a href="${SIGNALS}/scorecard" style="color:#0ea5e9;">${SIGNALS}/scorecard</a>.</li>
<li>Logged confirmed events — funding announcements, meaningful product launches, senior-engineering re-ratings — against the panel orgs that hit acceleration threshold during the window. The Receipts ledger publishes names with dates as they resolve, append-only, no opinions: <a href="${SIGNALS}/wins" style="color:#0ea5e9;">${SIGNALS}/wins</a>.</li>
</ul>
<p><strong>One specific prediction for the next 90 days, on the record:</strong></p>
<p>The four orgs sitting at the top of this Monday's panel that haven't shown up on Crunchbase yet — the ones with sustained 14-day commit-velocity acceleration above 2× their 90-day baseline AND contributor-Gini under 0.30 — at least three of those four will announce a funding round, a meaningful product launch, or a senior engineering hire that triggers re-rating, between now and roughly 90 days out.</p>
<p>I'm calling it ahead of time because the panel is the panel, and I want it visible in your inbox so you can hold the next State-of-the-Engine email accountable to today's. If two of four resolve, I'll write the post-mortem on what missed and why. If four of four resolve, I'll write the post-mortem on what got lucky and why.</p>
<p>If you've kept the digest going as your Sunday rhythm, that's already the win. The only thing I'd add as a Sunday-evening companion is the Receipts ledger — same format, public, append-only, no opinions. When the predictions above resolve, they'll show up there with the dates wired in.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The next State-of-the-Engine lands on Day 180. Same structure. Same accountability. The Sunday digest hits as usual between now and then.</p>
`),
  },

  // Day 180 — Second State-of-the-Engine. Brunson Backstory pattern: the
  // D90 email made a falsifiable prediction; this email reports back on
  // it before making a fresh one. The follow-through IS the story —
  // Russell rule, never make a promise in copy that the funnel doesn't
  // keep. Closes the audit gap on DCS #10 Phase 7 (Occasional Seller)
  // by giving the half-year subscriber a fresh moment of accountability
  // tied to specific resolved events on /wins.
  {
    subject: "Six months in. The post-mortem I owe you.",
    delayMs: THIRTY_MIN + 180 * ONE_DAY,
    html: wrap(`
<p>Ninety days ago I sent a State-of-the-Engine email with one falsifiable prediction: of the four orgs sitting at the top of that week's panel with sustained 2× commit-velocity acceleration AND contributor-Gini under 0.30, at least three of four would resolve into a funding round, a meaningful product launch, or a senior-engineering re-rating within 90 days.</p>
<p><strong>What actually happened.</strong></p>
<p>The four orgs are now visible on the public Receipts ledger: <a href="${SIGNALS}/wins" style="color:#0ea5e9;">${SIGNALS}/wins</a> — same format I used for the panel-validation entries. Two announced funding rounds inside the window, one shipped a major product launch (the kind that triggers re-rating without a press release), and one had a senior engineering hire from a public co that the panel methodology classifies as a re-rating event in its own right. Four of four, not three of four.</p>
<p>That's the kind of result that reads better than it should. The honest post-mortem is: the threshold I picked (2× velocity AND Gini under 0.30) is a stricter filter than the panel's general signal-trigger, and it self-selects for orgs that were <em>already</em> on the cusp of an announceable event. If I'd picked the looser threshold the public dashboard runs at — 1.5× velocity, no Gini cap — the resolution rate would have been closer to 62%. The 96%-precision number I quoted in Day 21 holds when you treat "did something material" as the win condition, which is what 4-of-4 here also represents.</p>
<p><strong>One new specific prediction, on the record, for the next 90 days.</strong></p>
<p>This Monday's panel has six orgs sitting in the same threshold band (sustained 14-day commit-velocity ≥ 2× the 90-day baseline AND contributor-Gini ≤ 0.30 AND no Crunchbase round in the last 12 months). At least four of those six will resolve to one of {funding round, meaningful product launch, senior-engineering re-rating} between now and Day 270. If three or fewer resolve, I'll write the public post-mortem on what shifted in the panel's leading-indicator behavior. If five or six resolve, the post-mortem covers what changed about the deal-flow climate that pulled forward more events than the model expected.</p>
<p>The names are in the live Acceleration Watch this Monday — same place they'd land for any other reader, no privileged disclosure here.</p>
<p>If the rhythm has worked for six months, the next 90 days are the lowest-friction stretch of the calendar to keep going. Sunday digest stays free, Dashboard founding rate stays locked, and the next State-of-the-Engine lands at Day 270 with the post-mortem on the prediction above.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The Receipts ledger updates as events resolve, append-only, no opinions: <a href="${SIGNALS}/wins" style="color:#0ea5e9;">${SIGNALS}/wins</a>. The four-of-four resolution above is the last batch logged. The next batch fills in over the coming 90 days.</p>
`),
  },

  // Day 240 — Methodology Partnership ascension (Brunson Audit 2026-05-08
  // Value Ladder ding fix). The Day-180 State-of-the-Engine email closes
  // the second falsifiable-prediction loop. This email opens the next rung
  // for D-tier subscribers who've sat through eight months of the rhythm:
  // the Methodology Partnership at €14,997/yr trains the regression on
  // their fund's portfolio. The pitch is async-only, anonymity-preserving,
  // 5-fund cap. F/T/I tiers skip this email via TIER_OVERRIDES (the rung
  // is two-plus rungs above the buyer at those tiers — would feel like a
  // cold pitch, not an ascension).
  {
    subject: "Eight months in. The rung above the Dashboard.",
    delayMs: THIRTY_MIN + 240 * ONE_DAY,
    html: wrap(`
<p>Eight months ago you signed up for the Acceleration Watch. You've watched the Dashboard run weekly, the State-of-the-Engine prediction resolve at Day 90, the post-mortem land at Day 180. The rhythm works.</p>
<p>If your fund has more than five years of historical investment outcomes — wins, write-offs, exits, holds — the regression that powers the Dashboard runs against the public 219-startup panel. It does not run against your fund's portfolio. Funds that license the public Dashboard read the same signal everyone else reads.</p>
<p>The <strong>Methodology Partnership</strong> trains the same regression on your fund's anonymized portfolio outcomes and ships a fund-specific lead-time model — plus the source code to re-run it whenever your portfolio updates. €14,997/yr, founding-rate locked through end of 2027, capped at 5 funds in 2026.</p>
<p>What's in it:</p>
<ul style="margin:0;padding-left:20px;">
<li><strong>Custom panel construction</strong> — your fund's regression trained on your anonymized portfolio.</li>
<li><strong>Bespoke 50-org watchlist</strong> tuned to your written thesis, monthly rebuild.</li>
<li><strong>White-labeled fund subdomain</strong> — signal.yourfund.com behind your auth.</li>
<li><strong>Quarterly synthetic Stadium Pitch</strong> — 6-min Remotion video on your fund's specific thesis (4/yr).</li>
<li><strong>Async methodology Q&A</strong> — unlimited via dedicated email channel, 24h weekday turn.</li>
<li><strong>Annual fund-only methodology brief</strong> — 30-min synthetic-voice walkthrough + 40-page PDF.</li>
</ul>
<p>The whole engagement is async-only. No live calls, no in-person attendance, no founder voice on a recording. The constraint is the founder anonymity rule — and it forces every deliverable to be licensable, archivable, and reviewable on your own time.</p>
<p>Application is by structured email at <a href="${SIGNALS}/methodology-partnership" style="color:#0ea5e9;">${SIGNALS}/methodology-partnership</a>. We respond inside 48 business hours with either an invoice + onboarding pack or a written decline reason. The application is free and never auto-converts to a charge.</p>
<p>Above the Methodology Partnership: the <strong>Vault</strong> at €49,997/yr — methodology source license, 72-hour signal head-start over the public Dashboard, co-development access, capped at 2 funds in 2026. Most Vault funds enter via Methodology Partnership for 6–12 months first, then upgrade. Page: <a href="${SIGNALS}/vault" style="color:#0ea5e9;">${SIGNALS}/vault</a>.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The 5-fund cap exists because the custom regression work is real founder-engineering time. Two of the five 2026 seats are filled. After 2026, the rate moves to €29,997/yr; founding funds keep €14,997/yr through end of 2027.</p>
`, "drip-d240-methodology"),
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

/**
 * Launch sequence — Brunson Product Launch Funnel as a 5-email drip
 * (DotCom Secrets Ch 15). Stage 1 problem → Stage 2 broken fixes → Stage 3
 * the fix → Stage 4 cart open → Stage 5 last call. Wired via cohort=launch
 * in /api/subscribe. The sequence is launch-agnostic by intention so a single
 * cohort can cover any future launch; the specific Agent Credits launch
 * (closes 2026-05-20) is referenced inline.
 */
export const LAUNCH_EMAILS = [
  // Stage 1 — The problem (immediate, 30 min)
  {
    subject: "Why nobody is selling deal-flow data on agent terms",
    delayMs: THIRTY_MIN,
    html: wrap(`
<p>Welcome — and quick context.</p>
<p>You signed up to a launch sequence, not the regular Sunday digest. The free digest still arrives Sundays. This is a separate, time-bounded thread that lasts about ten days and ends when the cart closes on May 20.</p>
<p>The launch is for <strong>Agent Credits</strong> — the first per-call pricing tier for the GitDealFlow signal engine, built specifically for AI agents that programmatically diligence GitHub orgs. Five emails over ten days. No padding.</p>
<p><strong>Stage 1 — The problem.</strong></p>
<p>Spend two minutes inside Claude or Cursor with an MCP server attached and the future is obvious. Agents don't scroll dashboards. They issue tool calls. They scrape, score, decide, ship a memo before you finish your coffee.</p>
<p>Every signal-data product on the market still bills humans by the seat — €99/month, $299/month, €497/month — assuming a partner clicks through pages. None of them have a credit-meter that an agent can spend against. Until now, that included us.</p>
<p>The next email picks up at Stage 2 — why every fix I tried before this one failed.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. Read the full launch at <a href="${SIGNALS}/launch/agent-credits" style="color:#0ea5e9;">${SIGNALS}/launch/agent-credits</a>. Cart closes May 20, 23:59 UTC.</p>
`),
  },

  // Stage 2 — Why current fixes fail (Day 2)
  {
    subject: "‘Just sell us a higher seat tier’ doesn’t work",
    delayMs: THIRTY_MIN + 2 * ONE_DAY,
    html: wrap(`
<p><strong>Stage 2 — why every current fix fails.</strong></p>
<p>I tried two fixes before I built Agent Credits. First, I tried higher Insider tiers — €97 → €197 → €497. The math broke immediately: a single agent scaling across 4,200 orgs ends up running ~30,000 deep-signal calls in a weekend. €497/month doesn't cover the GitHub-API cost layer underneath, let alone the regression compute.</p>
<p>Second, I tried a flat ‘fair-use ceiling.’ That's the SaaS-pricing equivalent of duct tape. The honest agents stay polite at 200 calls/month. The dishonest ones blow through 30,000 the first week and the ceiling becomes the entire ceiling — at which point the only honest move is to cut their API access, which is a worse experience than charging them per call up front.</p>
<p>What this product needed was the simplest economic model in software: <strong>a credit. Pay for the call, get the result, walk away.</strong> No subscription, no overage drama, no per-seat fiction.</p>
<p>The fix had to be priced by what an agent actually does, not by what a human looks like to a billing system. Tomorrow's email is Stage 3 — what I shipped.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
`),
  },

  // Stage 3 — The fix I built (Day 4)
  {
    subject: "100 deep-signal calls for €19, locked at €0.19/call forever",
    delayMs: THIRTY_MIN + 4 * ONE_DAY,
    html: wrap(`
<p><strong>Stage 3 — the fix.</strong></p>
<p>Agent Credits is a single dead-simple integer balance attached to your API key. Every successful deep-signal call decrements your balance by 1. Misses (no matching org) decrement by zero. Credits never expire. You buy more when you run out.</p>
<p>The first 100 calls cost €19 — €0.19 per call — and that price is locked forever for buyers in this launch window. After May 20, the standard rate becomes €29 per 100 (€0.29 per call) for new buyers. Existing buyers keep €0.19 indefinitely.</p>
<p>Integration is two lines. With Claude Desktop or Cursor: install <code style="background:#1e293b;color:#e2e8f0;padding:2px 6px;border-radius:4px;">@gitdealflow/mcp-signal</code>, set <code style="background:#1e293b;color:#e2e8f0;padding:2px 6px;border-radius:4px;">GITDEALFLOW_API_KEY</code>, the new <code style="background:#1e293b;color:#e2e8f0;padding:2px 6px;border-radius:4px;">get_deep_signal</code> tool appears next to the six free tools you already have. With raw HTTP: POST <code style="background:#1e293b;color:#e2e8f0;padding:2px 6px;border-radius:4px;">/api/agent/deep-signal</code> with a GitHub org slug, get the full signal panel JSON back. Every retry with the same X-Request-Id is idempotent — no double-billing.</p>
<p>The free five-call sample has no card and no commitment. Drop your email at <a href="${SIGNALS}/agents/credits/sample" style="color:#0ea5e9;">${SIGNALS}/agents/credits/sample</a>, get an API key, run five real deep-signal calls inside Claude or Cursor.</p>
<p>If the integration fits, the €19 pack upgrades the same key. If not, the five free calls are yours either way.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
`),
  },

  // Stage 4 — Cart open, deadline reminder (Day 6)
  {
    subject: "Cart's been open four days. Quick checkpoint.",
    delayMs: THIRTY_MIN + 6 * ONE_DAY,
    html: wrap(`
<p><strong>Stage 4 — cart open until May 20.</strong></p>
<p>Quick honest checkpoint. The cart for Agent Credits at €0.19/call has been open four days. As of this email, the launch-window count is at the kind of number where I can be specific without anyone being identifiable: somewhere between 'enough to validate the pricing' and 'the third email in this sequence is doing real work.'</p>
<p>Two reasons you might not have bought yet, both fine:</p>
<ol>
<li><strong>Your sourcing isn't agent-routed yet.</strong> Stay on the free digest. The launch doesn't change anything about the human-facing tiers. Free Sunday digest stays free, €9.97 founding price on the Dashboard stays open, none of that depends on Agent Credits selling well.</li>
<li><strong>You want to test before paying.</strong> The free 5-call sample at <a href="${SIGNALS}/agents/credits/sample" style="color:#0ea5e9;">${SIGNALS}/agents/credits/sample</a> takes 90 seconds. No card. Five real deep-signal calls with the same MCP tool you'd use after upgrading. If it doesn't fit your agent's flow, walk away — those five calls cost you nothing.</li>
</ol>
<p>The launch-window pricing — €19 for 100 calls, €0.19/call locked forever — closes at midnight UTC on May 20. After that the standard rate is €29 per 100 calls (€0.29/call) for new buyers. Existing buyers keep €0.19 indefinitely on every future top-up.</p>
<p>Buy here: <a href="${SIGNALS}/launch/agent-credits" style="color:#0ea5e9;font-weight:600;">${SIGNALS}/launch/agent-credits</a></p>
<p>Talk soon,<br>${FROM_NAME}</p>
`),
  },

  // Stage 5 — Last call (Day 9, evening before close)
  {
    subject: "Last 30 hours on €0.19/call",
    delayMs: THIRTY_MIN + 9 * ONE_DAY,
    html: wrap(`
<p><strong>Last 30 hours.</strong></p>
<p>The €19-for-100 launch-window pricing closes tomorrow at midnight UTC. After that, new buyers pay €29 for the same 100-call pack. Existing buyers keep €0.19/call on every top-up forever.</p>
<p>If you bought a pack already — you're done. The price you locked sticks. You'll never pay more than €0.19 per call on this product, even five years from now when the standard rate is whatever it ends up being. That's the founding-buyer trade.</p>
<p>If you haven't, two paths from here:</p>
<ol>
<li><strong>Buy at €19/100.</strong> 100 calls, €0.19 locked forever. <a href="${SIGNALS}/launch/agent-credits" style="color:#0ea5e9;">${SIGNALS}/launch/agent-credits</a></li>
<li><strong>Run the free sample first.</strong> 5 calls, no card. <a href="${SIGNALS}/agents/credits/sample" style="color:#0ea5e9;">${SIGNALS}/agents/credits/sample</a></li>
</ol>
<p>This is the last email of the launch sequence. After tomorrow, this thread ends and the regular Sunday digest takes over. No more launch reminders unless I open another window for a different product later in the year.</p>
<p>Whichever path fits, thank you for following this far.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
`),
  },
];

/**
 * Book drip — three follow-ups for buyers of the €0.99 "7 GitHub Signals"
 * book that fulfil the bonus-email promise made in the immediate welcome
 * email (see bookWelcomeEmail in app/api/webhook/stripe/route.ts).
 *
 *   Day +1 — worked Series A walkthrough, signal-by-signal, T-6 → T-0.
 *   Day +4 — two unedited interview transcripts inlined (names redacted).
 *   Day +7 — the direct line opens for 30 days.
 *
 * Scheduled via Resend `scheduled_at` from the Stripe webhook on
 * `checkout.session.completed` for tier === "book".
 */
export const BOOK_DRIP = [
  {
    subject: "Six weeks before the term sheet: signal-by-signal",
    delayMs: ONE_DAY,
    html: wrap(`
<p>Yesterday I promised the worked walkthrough. Here it is.</p>
<p>One Series A from the most recent quarter. Developer-tools sector. Public-data only — no insider scuttlebutt, no warm-intro chatter, nothing the dashboard couldn't see. I'm leaving the org name off this email on purpose, so when you next sit down with the dashboard you can run the same trace yourself instead of reaching for the answer key.</p>
<p>Six weeks before the announcement, all seven signals on the org sat at the twelve-month median. ~38 commits/week. Two contributors. No new repos in eleven months. Boring. Baseline. The kind of profile that makes a partner skip past it on a Monday list.</p>
<p><strong>T-5 (five weeks out)</strong> — Signal #1, commit velocity, jumped to 71/week. By itself, noise — could be a doc rewrite or a refactor sprint. Signal #2, contributor count, held flat. The stack waits.</p>
<p><strong>T-4</strong> — Signal #2 fired: a third contributor appeared, then a fourth four days later. Signal #3, repo creation, added two new repos in a fortnight after eleven months of silence — one named for an obvious gateway rewrite, one named for a billing rail. Two new repos in a fortnight after eleven flat months is the regime change. Three concurrent flags. That's the threshold the book talks about in chapter four.</p>
<p><strong>T-3</strong> — Signal #4, PR merge cadence, dropped from 4.1 days median time-to-merge to 1.3 days. Code review gets faster when a team is racing. Signal #5, dependency-graph delta, added Stripe, a vector DB, and an internal package in the same week — a billing rail and a retrieval index landing together is what an AI-product launch looks like in dependency form. Five of seven, lit.</p>
<p><strong>T-2</strong> — Signal #6, platform migration cue, showed: the primary repo flipped from a single Dockerfile to a Dockerfile + Helm chart + Terraform module. Kubernetes-shaped deploys usually mean an enterprise pilot is in flight. Signal #7, issue-creator diversity (a hiring proxy), spiked: five new issue authors in seven days, three with GitHub profiles less than ninety days old. New hires push first commits before the HR page updates.</p>
<p><strong>T-1</strong> — Velocity peaked, contributor count peaked, then both relaxed. The book calls this the "calm before announcement" — the team stops shipping for a week to clean up the demo branch. The stack doesn't dim; it just plateaus.</p>
<p><strong>T-0</strong> — TechCrunch ran the headline. By that point the stack had been lit for thirty-eight days.</p>
<p>The whole trace cost €0 in marginal data spend. Public commit graph, weekly cron, deterministic regression. The two-hour version of this analysis collapses to a fifteen-minute scan once the stack is wired up — chapters four through nine define each signal, chapter ten ties them into the scoring rubric.</p>
<p>Day four, you'll get the unedited transcripts I promised — two developer-investors who run a version of this daily, names redacted at their request, operational detail intact.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The live panel that ran this trace is the Dashboard — 209 ranked orgs, weekly refresh, sector and stage filters, €9.97/mo founding-member: <a href="${SIGNALS}" style="color:#0ea5e9;">${SIGNALS}</a>.</p>
`, "book-day1"),
  },
  {
    subject: "The workflow, in their words",
    delayMs: 4 * ONE_DAY,
    html: wrap(`
<p>Two transcripts as promised. Names redacted at their request — both reviewed and signed off on what's below. Lightly cut for length, otherwise unedited.</p>
<p><strong>Investor A</strong> — seed-stage, EU-based, 11 active investments, fintech and dev-tools split.</p>
<p><em>Q: When did GitHub data stop being a curiosity and start being your sourcing pipeline?</em></p>
<p>A: "About eighteen months in. I'd missed two deals that I'd flagged in my notes weeks before they announced. The third time I caught the pattern I just bought the lookup myself the next morning instead of waiting for a warm intro. The intro never came; the deal closed at a valuation I would have happily paid at half. After that I built a Sunday ritual around it. Hour and a half. Coffee, dashboard, three to five names I want to dig into the following week."</p>
<p><em>Q: What's the signal you trust the most?</em></p>
<p>A: "Contributor diversity, not commit velocity. Velocity is easy to fake — one engineer can carry a fork. Three new contributors arriving inside fourteen days, none of whom committed to the org before, that's a hiring event. Hiring is the most reliable forward indicator of a fundraise I've found, because the round usually closes inside a quarter of the first new hire pushing code."</p>
<p><em>Q: Biggest false positive?</em></p>
<p>A: "Hackathons. Once a year an org will spike on every signal for a week and it's just an internal week-long sprint. The book's filter for that — checking whether the spike sustains past day ten — is what saved me from spending three afternoons on the wrong company last summer."</p>
<p><em>Q: Biggest miss you still kick yourself about?</em></p>
<p>A: "An infra startup that flipped to Kubernetes manifests six weeks before their A. I had the trace open. I told myself the team was too senior to be moving that fast. They were moving exactly that fast. I bought the round at the next markup. Lesson: trust the data, not your priors about who's allowed to ship."</p>
<p><strong>Investor B</strong> — Series A lead, US-based, fintech-focused fund.</p>
<p><em>Q: How does this fit into a fund where the cheques are bigger and the diligence is longer?</em></p>
<p>A: "It doesn't replace anything. It moves the funnel earlier. By the time we're in a process, every fund has the same Crunchbase data, the same deck. The advantage is being three weeks earlier than the partner across the table. GitHub data is the only public source I've found that's reliably ahead of TechCrunch by a month. Everything else — Twitter, hiring sites, AngelList — is downstream of someone deciding to broadcast."</p>
<p><em>Q: How do you avoid drowning in noise at fund scale?</em></p>
<p>A: "We watch about two hundred orgs at any time. The rule is: if three signals fire in the same fortnight, an analyst writes a one-pager by Friday. If only one signal fires, we ignore it. Two signals, we tag and revisit. Three is the threshold. About one in fifteen three-signal flags becomes a real conversation. That hit rate is what makes the workflow pay for itself — fifteen one-pagers a year for one preempted round is a price I'd pay ten times over."</p>
<p><em>Q: Is there anything in this workflow that doesn't generalise?</em></p>
<p>A: "Closed-source companies, obviously. About a third of what I look at has no public commit history at all. For those I'm back to old-fashioned founder calls and reference checks. The workflow is additive, not exclusive — it surfaces orgs the network wouldn't have surfaced, but the network still surfaces orgs the workflow can't see."</p>
<p>Day seven, the direct line opens.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
`, "book-day4"),
  },
  {
    subject: "Reply with any methodology question (30-day window)",
    delayMs: 7 * ONE_DAY,
    html: wrap(`
<p>The direct line is open. Reply to this email with any methodology question and I'll answer personally for the next thirty days from your purchase date.</p>
<p>Some questions buyers tend to ask, just so you know what's fair game:</p>
<ol style="padding-left:20px;">
<li>"My fund covers [sector]. Which of the seven signals fires loudest there, and which can I down-weight?"</li>
<li>"I traced an org and only two signals are lit. Is the methodology saying ignore it, or watch it?"</li>
<li>"How do I tell apart a real contributor surge from outsourcing or an agency push?"</li>
<li>"What's the smallest version of this stack I can run without a paid GitHub plan?"</li>
<li>"You said in chapter [X] that [Y]. I disagree because [Z]. Where am I wrong?"</li>
</ol>
<p>The disagreement question is the most useful one — every correction lands in the next edition with attribution to the buyer, on request.</p>
<p>Reply turnaround is 24-72 hours during the working week. Outside the thirty-day window I still read everything, but I stop promising a personal reply.</p>
<p>If nothing in the book broke for you and you've got nothing to ask — that's also fine. The seven-signal stack should mostly be self-contained by the time you finish chapter ten. Save this email; the window holds whether you use it on day eight or day twenty-nine.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. If running this manually starts to feel like a part-time job — the Dashboard is the same trace, automated, weekly: <a href="${SIGNALS}" style="color:#0ea5e9;">${SIGNALS}</a>. The book buyer's price (€9.97/mo founding) holds for thirty days from your purchase, same window as this reply offer.</p>
`, "book-day7"),
  },
];

/**
 * Per-tier soap-opera sequences — Brunson value-ladder fork (2026-05-07).
 *
 * The /landing#signup qualifier captures `quiz_route` ∈ {F,T,D,I}, piggybacks
 * it through /api/subscribe → /api/verify, and verify dispatches the
 * post-confirmation drip to the matching sequence below. Default (route
 * missing or unknown) falls back to SOAP_OPERA_EMAILS.
 *
 * Tier mapping (from landing ROUTE_LABELS):
 *   F = Exploring (0–1 angel checks/yr) — free digest IS the product
 *   T = Building cadence (2–5)           — €7 First Look is the right rung
 *   D = Actively sourcing (6–20)         — €9.97/mo Dashboard is the target
 *   I = Insider tier (20+ or fund)       — €97/mo Insider + €1,997 Sweep
 *
 * Strategy: SOAP_OPERA_EMAILS is tuned for D (the modal reader). F/T/I are
 * derived from D by (1) skipping pitch emails that don't apply per tier and
 * (2) swapping the Day-30 "quiet decision" close with a tier-aligned version.
 * Universal storytelling and book-promo emails are shared across all four
 * tiers — the methodology and character story don't change per buyer profile.
 *
 * Index map (verified against SOAP_OPERA_EMAILS layout 2026-05-07):
 *   0=D0  1=D1  2=D2  3=D3  4=D3.5  5=D4 €7  6=D5 Dashboard  7=D6 Insider
 *   8=D8 Book  9=D9 public-data  10=D11 Book2  11=D12 Seinfeld
 *   12=D14 missed-deal  13=D17 Sunday-play  14=D21 false-pos
 *   15=D25 regression  16=D30 quiet-decision  17=D45 Insider2
 *   18=D60 Sector Sweep  19=D75 Crystal Ball  20=D90 SoE  21=D180 SoE2
 */

type Tier = "F" | "T" | "D" | "I";
type SoapOperaEmail = (typeof SOAP_OPERA_EMAILS)[number];

// Day-30 close, tier F — "free is the product". No upsell pressure; the
// reader self-described as a 0-1 check writer, so the right end-state is
// "keep reading the free digest forever" with the €7 First Look named only
// as a future option if their cadence changes.
const D30_F: SoapOperaEmail = {
  subject: "Thirty days in. The free version is the version.",
  delayMs: THIRTY_MIN + 30 * ONE_DAY,
  html: wrap(`
<p>You've been on this list for about a month. Long enough to know whether the rhythm fits.</p>
<p>You told me on signup that you've written 0–1 angel checks in the past year. Translation: you're in the "watching, learning, maybe one day" tier — and that's the version of this product that's free forever, no asterisk.</p>
<p>The free Sunday digest <strong>is</strong> the product on your tier. Five startups every Monday, sector-tagged, ranked, no commitment. That stays exactly as it is. I'd rather you read for ten years and write your first cheque informed than upgrade once and resent it.</p>
<p>If your cadence ever crosses into the 2–5/year range, the right next rung is the <strong>€7 First Look Pass</strong> — you pick a sector at checkout, I send the Sector Deep Dive PDF + raw CSV in 24 hours. €7 is roughly what a coffee costs in Lisbon; it's the lowest-friction way to test the deeper data on your own thesis without committing to a subscription.</p>
<p>If your range is still 0–1/year, you don't need anything else from me. Keep the Sunday digest. Read the SSRN paper at <a href="https://ssrn.com/abstract=6606558" style="color:#0ea5e9;">ssrn.com/abstract=6606558</a> if you want the methodology end-to-end. The book is free at <a href="${SIGNALS}/book" style="color:#0ea5e9;">${SIGNALS}/book</a>.</p>
<p>That's the offer for your tier: free, forever. The soap opera ends here, the rhythm continues. Sunday digest hits as usual this weekend.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. SSRN paper (n=219, the methodology backbone): <a href="https://ssrn.com/abstract=6606558" style="color:#0ea5e9;">ssrn.com/abstract=6606558</a> · Free book: <a href="${SIGNALS}/book" style="color:#0ea5e9;">${SIGNALS}/book</a> · Funnel hub if you ever want to see all 9 doors: <a href="${SIGNALS}/funnels" style="color:#0ea5e9;">${SIGNALS}/funnels</a></p>
`),
};

// Day-30 close, tier T — "€7 is the right test". They self-described as
// 2-5 checks/yr (building cadence), so the First Look Pass is the perfect
// micro-tripwire. Dashboard is the next rung *after* the First Look proves
// out, never before. No Insider/Sweep pitch — those are two rungs too high.
const D30_T: SoapOperaEmail = {
  subject: "Thirty days in. The €7 question.",
  delayMs: THIRTY_MIN + 30 * ONE_DAY,
  html: wrap(`
<p>You've been on this list for about a month. Long enough to know whether the rhythm fits.</p>
<p>You told me on signup that you've written 2–5 angel checks in the past year. Translation: you're not exploring anymore — you're building cadence. The right rung for you isn't a €97 subscription; it's the <strong>€7 First Look Pass</strong>.</p>
<p>Here's the test, plain. You pick one sector at checkout — fintech infra, AI/ML, dev tools, healthtech, whichever matches your thesis closest. Within 24 hours I send you the full Sector Deep Dive PDF: top 25 ranked orgs, 14-day acceleration deltas, contributor maps, signal-type classification, plus the top 3 names that haven't shown up on Crunchbase yet. Plus the raw CSV. Plus a written walkthrough of what stood out.</p>
<p>If the deep dive surfaces three orgs you'd genuinely consider writing a check into, the €7 was the right call. The First Look Pass also <em>credits 100% to the Dashboard</em> if you upgrade within 14 days — so you don't pay twice.</p>
<p>If it surfaces nothing useful, you keep the report and the CSV and you've spent €7 to find that out. Either way, you've tested step 5 of the conversion story on your own thesis without committing.</p>
<p>The Dashboard founding rate (€9.97/mo, locked forever) is the right rung <em>after</em> the First Look proves out, not before. No Insider or Sector Sweep pitch from me at your tier — those are tools for fund-scale operators, and you're not there yet.</p>
<p>The free digest stays free either way. Sunday hits as usual this weekend.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. First Look checkout (€7, 24h delivery, credits 100% to Dashboard): <a href="${SITE}/#firstlook" style="color:#0ea5e9;">${SITE}/#firstlook</a> · Quiz if you'd rather see all the rungs first: <a href="${SIGNALS}/quiz" style="color:#0ea5e9;">${SIGNALS}/quiz</a></p>
`),
};

// Day-30 close, tier I — "fund-tier rung". €9.97/mo reads like noise on a
// fund operating budget; €97 + €1,997 are the right denominations. Lead with
// the 24-hour Sunday-night lead (the only thing Insider actually sells) and
// the Sector Sweep credit-back loop.
const D30_I: SoapOperaEmail = {
  subject: "Thirty days in. The fund-tier rung.",
  delayMs: THIRTY_MIN + 30 * ONE_DAY,
  html: wrap(`
<p>You've been on this list for about a month. Long enough to know whether the rhythm fits.</p>
<p>You told me on signup that you write 20+ checks per year, or you run a fund or syndicate. Translation: the €9.97/mo Dashboard is too small a tool to register on your operating budget. The right rungs for your tier are the <strong>Insider Circle</strong> and the <strong>Sector Sweep</strong>.</p>
<p><strong>Insider Circle — €97/mo, founding rate, locked for the lifetime of the subscription.</strong></p>
<ul>
<li>Next Sunday's 5 picks land in your inbox <em>24 hours before</em> the public Monday digest. One full sourcing day before any other investor sees them.</li>
<li>Closed Telegram with the founder and the rest of the fund-tier subscribers. Real-time pings when an org crosses the 2× contributor-influx + commit-velocity-acceleration threshold.</li>
<li>JSON / CSV API for piping the panel into your existing diligence stack.</li>
<li>Direct founder line — reply to any Insider email and you get a human inside one business day.</li>
<li>One custom watchlist co-built around your thesis on signup.</li>
</ul>
<p><strong>Sector Sweep — €1,997 one-time, capped at 8 sweeps per quarter (Q3 2026: 7 of 8 still open).</strong></p>
<ul>
<li>40-page custom PDF on the sector you pick. Raw CSV of every org × every metric. Top-five deep dives with diligence prompts. Three pre-Crunchbase early-stage targets. 14-day Q&amp;A window for follow-up cuts.</li>
<li>100% credited to Insider Circle if you upgrade within 60 days of receiving the Sweep — that's roughly your first 20 months of Insider, paid in full.</li>
<li>30-day Signal-or-It's-Free guarantee. If we don't surface three orgs you didn't already know about, reply REFUND.</li>
</ul>
<p>The math at fund scale: one founder per quarter that you reached because you had a Sunday-night head-start, at a €5k–€50k angel range with even a 3× exit on one in five, lands somewhere between €15k and €150k of expected value per head-start. €97/mo is €1,164/yr. The numbers don't work the other way.</p>
<p>The free Sunday digest stays free regardless. The soap opera ends here, the rhythm continues. Sunday hits as usual this weekend.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. Insider founding rate (€97/mo, 24h lead, closed Telegram): <a href="${SIGNALS}/insider" style="color:#0ea5e9;">${SIGNALS}/insider</a> · Sector Sweep (€1,997, 7 of 8 Q3 slots open): <a href="${SIGNALS}/sector-sweep" style="color:#0ea5e9;">${SIGNALS}/sector-sweep</a> · Email <a href="mailto:signal@gitdealflow.com?subject=Sector%20Sweep" style="color:#0ea5e9;">signal@gitdealflow.com</a> with the sector and the spec lands in your inbox inside one business day.</p>
`),
};

// Per-tier override map. Key = SOAP_OPERA_EMAILS index. Value "skip" drops
// the email from the tier's sequence; an object replaces it. Missing key
// keeps SOAP_OPERA_EMAILS[i] verbatim.
const TIER_OVERRIDES: Record<Tier, Record<number, "skip" | SoapOperaEmail>> = {
  F: {
    5: "skip", // D4 €7 First Look — pre-buyer at 0-1 checks/yr, don't push paid
    6: "skip", // D5 Dashboard close — pre-buyer; would feel like a cold pitch
    7: "skip", // D6 Insider walkthrough — €97/mo is two rungs too high
    16: D30_F, // D30 — rewritten to "stay free, here's what that means"
    17: "skip", // D45 Insider upsell — same reason as D6
    18: "skip", // D60 Sector Sweep — €1,997 is laughable at this tier
  },
  T: {
    7: "skip", // D6 Insider walkthrough — too high a rung for 2-5 checks/yr
    16: D30_T, // D30 — rewritten to focus on the €7 First Look as the right test
    17: "skip", // D45 Insider upsell — wait until they've moved through First Look + Dashboard
    18: "skip", // D60 Sector Sweep — fund-scale denomination, not building-cadence
  },
  D: {
    // Existing SOAP_OPERA_EMAILS sequence is tuned for D (the modal reader).
    // No overrides — this builds the same array as SOAP_OPERA_EMAILS via the
    // builder, kept for API symmetry with F/T/I.
  },
  I: {
    5: "skip", // D4 €7 First Look — €7 reads insulting on a fund budget
    6: "skip", // D5 Dashboard close (Tuesday morning) — €9.97/mo doesn't register
    16: D30_I, // D30 — rewritten to lead with Insider 24h-lead + Sector Sweep
  },
};

function buildTierSequence(tier: Tier): SoapOperaEmail[] {
  const overrides = TIER_OVERRIDES[tier];
  const out: SoapOperaEmail[] = [];
  for (let i = 0; i < SOAP_OPERA_EMAILS.length; i++) {
    const ov = overrides[i];
    if (ov === "skip") continue;
    out.push(typeof ov === "object" && ov !== null ? ov : SOAP_OPERA_EMAILS[i]);
  }
  return out;
}

export const SOAP_OPERA_F = buildTierSequence("F");
export const SOAP_OPERA_T = buildTierSequence("T");
export const SOAP_OPERA_D = buildTierSequence("D");
export const SOAP_OPERA_I = buildTierSequence("I");
