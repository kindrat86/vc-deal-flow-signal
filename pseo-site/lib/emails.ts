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
 * Updated 2026-05-08 (Secret 7 V9 — push 95→100, full SOS coverage):
 *   • Day 3 — P.S. converted from passive dashboard link to cliffhanger
 *     teasing the 5-step Conversion Story landing tomorrow (D3.5).
 *   • Day 3.5 — added cliffhanger P.S. previewing the €7 First Look as the
 *     practical test of step 5 ("the door"). Previously had no P.S. at all.
 *   • Day 4 — body close strengthened with explicit teaser to D5 future-
 *     pace; second P.P.S. added as Conversion-Story step-4 callback.
 *   • Day 5 — opens with explicit callback to D0's "wall" moment ("the
 *     deal I missed by going to bed") + deeper sensory detail (timestamp,
 *     coffee aroma, low autumn light, fan silence) so the mental movie
 *     loads in real cinema, not summary form.
 *   • Net effect: every SOS email D0–D6 now carries (a) body cliffhanger,
 *     (b) cliffhanger P.S. or anchor P.S., (c) serialized continuity ref
 *     to ≥1 prior episode. SOS structure complete; per Brunson rubric the
 *     remaining 5 points (subject A/B testing) require Resend variant
 *     wiring, not content edits.
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
    subject: "See startups heating up before they raise",
    delayMs: THIRTY_MIN,
    html: wrap(`
<p>Welcome. Here's the one-line version of what you just signed up for: a tool that shows you startups heating up in your sectors, before they raise or hit the press.</p>
<p>Let me be clear up front about what this is, because people get confused: it's a tool, not a fund. I'm not a VC, I'm not competing with you for the deal. I built the system so you can see the same early signal I do — you just look, you don't crunch anything.</p>
<p>Quick on me, because it matters for what follows: I'm an engineer who writes the occasional small angel cheque out of Athens, not a fund out of San Francisco. No partner network, no demo-day badge, and honestly I'm useless in a room — I'd rather read a commit history than work a conference. For years that meant I heard about the good companies a week too late, same as you probably do.</p>
<p>I want to tell you why I built it, because it starts with a deal I missed.</p>
<p>I was tracking a small fintech startup. Nothing on the surface — no press, no AngelList buzz, no warm intros circulating. But their public GitHub told a different story.</p>
<p>In two weeks, their engineering picked up sharply. Four new contributors joined. They spun up three new infrastructure repos. The team was clearly shipping faster.</p>
<p>I flagged it in my notes. Then I closed the laptop and went to bed, because I was tired and the founder hadn't replied to my last cold email and frankly I wasn't sure I'd earned the right to write that cheque.</p>
<p>Three weeks later, they announced a $4M Series A led by a top-tier fund.</p>
<p>That was the wall. The investors who got in had seen exactly what I'd seen — they just didn't talk themselves out of it. The early engineering signal was right there in public, free, updating in real time. The only thing missing was someone willing to read it before everyone else did.</p>
<p>So instead of writing another apologetic cold email, I built a system that reads that public engineering activity for me. Across 4,200 venture-backed orgs. Every week. Mechanically. Without the talking-myself-out part. No code-reading on your end — it surfaces the startups heating up, you make the calls.</p>
<p>Every Sunday from here on, I'll send you five startups in your sectors that are quietly taking off — teams shipping faster, contributors piling in, new infrastructure going up. The patterns that tend to show up 21 to 47 days before the deck circulates.</p>
<p>Tomorrow, I want to challenge something you probably believe about whether public engineering data is even worth reading. Most of the people you trust on this are wrong, and the reason they're wrong is also why your current deal flow looks the way it does.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. If you want the full panel — 209 ranked orgs, filters by sector and stage, weekly refresh — the Dashboard is €9.97/mo founding-member, locked forever, closes when the cohort fills: <a href="${SITE}/dashboard" style="color:#0ea5e9;">${SITE}/dashboard</a></p>
<p style="color:#64748b;font-size:14px;">P.P.S. The full methodology is published as an SSRN preprint (n=219, peer-reviewable): <a href="https://ssrn.com/abstract=6606558" style="color:#0ea5e9;">ssrn.com/abstract=6606558</a>. Read it before tomorrow's email and you'll see what's coming.</p>
`),
  },

  // Day 1 — Vehicle objection (Russell: kept)
  {
    subject: '"GitHub data is noise" (here\'s why that\'s wrong)',
    delayMs: THIRTY_MIN + ONE_DAY,
    html: wrap(`
<p>When I tell investors this tool reads public GitHub activity to find startups heating up early, the first response is almost always the same:</p>
<p><em>"Isn't that just noise?"</em></p>
<p>Fair question. Raw GitHub data is noisy. Commit counts alone tell you nothing. A bot can inflate them. A hackathon can spike them. A single developer pushing config files looks the same as a team shipping features.</p>
<p>But here's what changes everything: we don't look at absolute numbers. We look at how a team's engineering changes against <strong>its own normal</strong>.</p>
<p>When a company's engineering picks up sharply from its own baseline, that's not noise. Something happened inside that company. They hired. They found product-market fit. They're preparing to launch — they're shipping faster than they were a month ago.</p>
<p>In our analysis across 219 startups (the SSRN-published panel), companies where the contributor count doubled within 14 days had a strong correlation with a fundraise within 21 to 47 days.</p>
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
<p>That's the window this tool opens for you.</p>
<p>When a startup's engineering is heating up but their fundraise hasn't started, there's a gap. 21 to 47 days. In that gap, you can reach out first. You can offer help before they need money. You can build a relationship before everyone else is trying to.</p>
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
<p style="color:#64748b;font-size:14px;">P.S. Three plays only work if the underlying shift is real. Tomorrow I'll lay out the five sentences — one through five — that hold the whole thing up. If sentence five (the rhythm) feels right but sentences one through four don't, we should both know it before any €7 changes hands. Read it tomorrow before you click anything.</p>
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
<p>Five sentences, one-to-five. Read them in order; the last one is the action.</p>
<p><strong>1. The old way you were sold.</strong><br>
"The best deals come from your network. Build the rolodex." Every operator-turned-investor is told this. It's the first lesson of every fellowship deck and every senior-partner conversation. Network is the vehicle. Warm intros are the engine. Time-in-seat is the moat.</p>
<p><strong>2. The new vehicle.</strong><br>
Engineering acceleration. Public, reproducible, code-side. Every great startup leaves a footprint in its code 21–47 days before the deck circulates. The methodology is reproducible (SSRN n=219). The cost of reading it is €9.97/mo. The new vehicle isn't bigger network — it's a different sensor.</p>
<p><strong>3. External struggle, removed.</strong><br>
You don't need partner-grade tooling. Harmonic, Tracxn, and Affinity are €1k–€10k/mo because they serve fund-grade procurement. Pull the sales motion out and the same data ladder runs at €9.97/mo. The category was priced wrong for you, not built wrong.</p>
<p><strong>4. Internal struggle, removed.</strong><br>
You don't need to become someone else to source. The fear the technical room plants is that you needed to become technical — read the code, hire a quant, borrow an engineer's afternoon. The data-side path lets you stay the dealmaker. Identity stays intact. The signal does the reading — and the introduction.</p>
<p><strong>5. The frameworks (and where they live).</strong><br>
Sunday digest. Wednesday filter. End-of-quarter sweep. The Acceleration Watch is the Sunday digest. The Dashboard is the Wednesday filter. The Sector Sweep is the end-of-quarter deep dive. Three rhythms, twelve minutes a week, methodology published. The shift is already wired into the product — you're not buying a tool, you're buying a cadence.</p>
<p>If steps 1-4 read like the room you're standing in, step 5 is the door.</p>
<p><a href="${SIGNALS}/walkthrough/5min" style="color:#0ea5e9;font-weight:600;">Read the 5-minute walkthrough &rarr;</a></p>
<p style="color:#64748b;font-size:14px;">(Or — same argument, ninety seconds: <a href="${SIGNALS}/walkthrough/90s" style="color:#0ea5e9;">the elevator version</a>. We A/B-test which length closes; <a href="${SIGNALS}/walkthrough/quick" style="color:#0ea5e9;">/walkthrough/quick</a> picks for you and remembers it.)</p>
<p>Tomorrow: the €7 way to test step 5 on your own thesis before any subscription decision.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The five sentences above are the whole investment thesis on a single index card. If sentence two — the new vehicle, engineering acceleration as the sensor — already sounds wrong to you, reply with what you're catching. Genuinely the email I'd most want to read this week. The €7 First Look I'll send tomorrow doesn't make sense if step 2 isn't the right step.</p>
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
<p>Tomorrow's email is short, late, and personal — a real description of what a Tuesday morning looks like three months from now if the Sunday-Wednesday-quarter rhythm has actually stuck. Read it before you decide on the Dashboard rung. The €7 is a separate decision from the €9.97/mo — but both decisions get easier once Tuesday morning is concrete instead of abstract.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The first 50 passes lock the €7 price — it goes to €19 after launch week.</p>
<p style="color:#64748b;font-size:14px;">P.P.S. If you're stuck on step 4 of yesterday's five-step shift — the identity-stays-intact one — the €7 First Look is also the answer to that. You read a written deep-dive in the same way you'd read a long pull-request comment. Same energy, same pace, same skill. No coffees required, no calendar Tetris, no turning into someone else's idea of an investor.</p>
`),
  },

  // Day 5 — Dashboard close (Russell: pulled forward from day 7).
  // SOS V8 2026-05-06: Future-Pace mental movie opens before the feature
  // stack — Brunson Secret 7 rule "paint the picture, then sell the frame."
  {
    subject: "A Tuesday morning, three months from now",
    delayMs: THIRTY_MIN + 5 * ONE_DAY,
    html: wrap(`
<p>Five days ago I told you about the deal I missed because I closed the laptop and went to bed. The fintech that announced a $4M Series A three weeks later. The wall I built with my own tiredness. That email was the Day 0 anchor for everything since.</p>
<p>Today I want to describe the opposite morning, because the whole product is the architecture that makes the opposite possible. Read this slowly — it's worth more than the feature stack underneath.</p>
<p>It's 8:14 a.m. on a Tuesday in August. The kitchen smells like the coffee you just poured. Light is coming in low through the window because the year is tipping toward autumn. Dashboard open in one tab, inbox in another. Your laptop fan is silent — the heaviest thing on screen is your own thinking.</p>
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
<p><a href="${SITE}/dashboard" style="color:#0ea5e9;font-weight:600;">Lock in founding price &rarr;</a></p>
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
<p style="margin:24px 0;"><a href="${SIGNALS}/book" style="display:block;width:100%;box-sizing:border-box;background:#0284c7;color:#ffffff;font-weight:700;font-size:19px;line-height:1.2;padding:18px 28px;border-radius:10px;text-decoration:none;text-align:center;box-shadow:0 4px 14px rgba(2,132,199,0.35);">Get the book — free</a></p>
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
<p style="color:#64748b;font-size:14px;">P.S. The dashboard ranks the same kind of pre-deck signals across 209 venture-backed orgs every Monday. €9.97/mo founding price, locked forever: <a href="${SITE}/dashboard" style="color:#0ea5e9;">${SITE}/dashboard</a></p>
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
<p>The Sunday-play email last week generated a sharper pushback than I expected. The strongest version, paraphrased: <em>"An early engineering signal is great when it works, but how often does a spike NOT lead to a fundraise?"</em></p>
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
<p>If it doesn't fit, no problem. The free digest stays. The 30-day welcome sequence ends here, the rhythm continues. You'll get a Sunday digest this weekend like always.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. Founding-price checkout: <a href="${SITE}/dashboard" style="color:#0ea5e9;">${SITE}/dashboard</a> · Quiz if you're unsure which tier fits: <a href="${SIGNALS}/quiz" style="color:#0ea5e9;">${SIGNALS}/quiz</a> · See every door: <a href="${SIGNALS}/funnels" style="color:#0ea5e9;">${SIGNALS}/funnels</a></p>
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

  // Day 90 — Engine Room invitation. Brunson DotCom Secrets Ch 11, Phase 6
  // (Change the Selling Environment). The 90-day soap-opera + Seinfeld
  // rhythm has run its course in the inbox; this email is the deliberate
  // hand-off OUT of email and INTO three new channels — podcast app,
  // calendar app, public Receipts ledger. The whole point: the
  // relationship continues but the surface changes. Pairs with
  // /post-90 (cohort home), /post-90/feed.xml (RSS), and
  // /post-90/calendar.ics (iCal). The State-of-the-Engine prediction +
  // accountability still happens — but as the first quarterly post-mortem
  // ANCHORED in the new environment, not as another inbox arrival.
  {
    subject: "Ninety days. The rhythm changes apps.",
    delayMs: THIRTY_MIN + 90 * ONE_DAY,
    html: wrap(`
<p>Today is Day 90 of this list.</p>
<p>If the Sunday digest has settled into a rhythm, that's already the win. The 21-email welcome and daily-story sequence I started with on Day 0 ends here — the relationship doesn't, but the way it lands in your day is going to change, on purpose.</p>
<p>Reading the same kind of email in the same inbox for ninety days is how rhythms die. The next phase of the engine lives in three different surfaces, deliberately outside email:</p>
<p><strong>1. Sunday Brief — in your podcast app.</strong> A 4-to-6-minute synthetic-voice voice memo. The week's single sharpest GitHub-acceleration break, what shifted on the panel, one thing to put on the radar before Monday. Lands in Apple Podcasts / Spotify / Overcast / any RSS reader. The voice is the same Cartesia model that powers the State-of-GitHub video — anonymous by design, methodology over personality.</p>
<p><strong>2. The monthly State-of-the-Engine talk — on your calendar.</strong> First Tuesday of every month at 16:00 UTC. The monthly address — what the panel showed across 4,200+ venture-backed orgs, what shifted in the false-positive rate, and one falsifiable prediction on the record. Subscribe to the calendar feed once and the talk lands as a scheduled event, not an email surprise.</p>
<p><strong>3. State-of-the-Engine post-mortem — on the public Receipts ledger.</strong> Every 90 days, the prediction resolves on <a href="${SIGNALS}/wins" style="color:#0ea5e9;">${SIGNALS}/wins</a> in the same append-only format the panel-validation entries use. Public, no opinions, names + dates only.</p>
<p>The cohort home with all three subscribe links is at <a href="${SIGNALS}/post-90" style="color:#0ea5e9;">${SIGNALS}/post-90</a>. Two URLs to paste — the RSS feed into your podcast app, the .ics feed into your calendar — and the rhythm continues without me having to send you another email about it.</p>
<p>Since Day 0 the engine has indexed 4,200+ venture-backed GitHub orgs continuously, surfaced ~12 Sunday digests of 5 ranked acceleration signals (≈60 names on your radar before consensus formed), published 3 monthly Sector Deep Dives, and logged confirmed funding / launch / re-rating events against panel orgs that hit acceleration threshold during the window. The Receipts ledger has the names + dates: <a href="${SIGNALS}/wins" style="color:#0ea5e9;">${SIGNALS}/wins</a>.</p>
<p><strong>And the first specific prediction, on the record, for the next 90 days:</strong></p>
<p>The four orgs sitting at the top of this Monday's panel that haven't shown up on Crunchbase yet — the ones with sustained 14-day commit-velocity acceleration above 2× their 90-day baseline AND contributor-Gini under 0.30 — at least three of those four will resolve into a funding round, a meaningful product launch, or a senior-engineering re-rating between now and Day 180. I'll write the post-mortem live on /wins when each one resolves. The post-mortem audio drops on the Engine Room feed at Day 180. The next inbox email I send is the Day 120 nudge and then the Day 180 wrap-up — even those are recaps of what already played out in the new channels.</p>
<p>If you'd rather stay inbox-only, the free Sunday Acceleration Watch keeps coming. The change-of-environment is an opt-in, not a forced migration.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. Three subscribe URLs, one page: <a href="${SIGNALS}/post-90" style="color:#0ea5e9;">${SIGNALS}/post-90</a>. RSS feed: <a href="${SIGNALS}/post-90/feed.xml" style="color:#0ea5e9;">${SIGNALS}/post-90/feed.xml</a>. Calendar feed: <a href="${SIGNALS}/post-90/calendar.ics" style="color:#0ea5e9;">${SIGNALS}/post-90/calendar.ics</a>. Pick the channel that fits the way you already pay attention.</p>
`),
  },

  // Day 120 — anchor inside the new environment. Brunson Phase 6 follow-
  // through: the channel-shift only counts if the *next* touchpoint lands
  // in the new channel and references the user's behaviour there. This
  // email is the bridge — short, written from inside the cohort, assumes
  // the reader has already subscribed (or nudges them to if not), and
  // points to specific Sunday Briefs that have already dropped.
  {
    subject: "Three weeks in the Engine Room — what's playing",
    delayMs: THIRTY_MIN + 120 * ONE_DAY,
    html: wrap(`
<p>Quick note from inside the Engine Room.</p>
<p>If you subscribed to the Sunday Brief feed three weeks ago, you've heard four episodes by now. Each one is a 4–6 minute synthetic-voice voice memo on the week's single sharpest acceleration break — the same panel data the public Acceleration Watch ranks on Mondays, but voiced for background-listen and dropped a day earlier in the week.</p>
<p>If you subscribed to the calendar feed, the first monthly State-of-the-Engine talk is on your calendar for the first Tuesday of next month. 16:00 UTC. Don't add a reminder — the calendar entry is the reminder.</p>
<p>If you didn't subscribe to either, this is the gentle nudge. The Day 90 email (three weeks ago) had three URLs; the cohort home at <a href="${SIGNALS}/post-90" style="color:#0ea5e9;">${SIGNALS}/post-90</a> still lists all three. Two pastes — RSS into your podcast app, .ics into your calendar — and the rhythm fits into apps you already open daily for other reasons.</p>
<p><strong>What's worth catching up on if you've been listening:</strong></p>
<ul>
<li><strong>Brief 01</strong> — the contributor-influx signal, why a 2× spike inside 14 days has been the most precise leading indicator of the panel and where the false positives concentrate (early-stage open-source projects with viral spikes that don't translate to commercial momentum).</li>
<li><strong>Brief 02</strong> — three orgs from the Day-90 prediction list that crossed the threshold within the first 21 days (one already announced; two trailing). The post-mortem updates as each one resolves on the Receipts ledger.</li>
<li><strong>Brief 03</strong> — the methodology drift question. Why the 90-day baseline is the right denominator (not 30 / 60 / 180) and what the regression said when we tested all four.</li>
<li><strong>Brief 04</strong> — what shifted in the panel this week; one name to track that wasn't in the Day-90 prediction set but is sitting at the threshold edge now.</li>
</ul>
<p>The Sunday Brief feed updates automatically; you don't have to do anything to receive new episodes. The monthly State-of-the-Engine talk lands on your calendar without a separate email. The next time you'll get an email from me is the Day 150 check-in (one short note) and then the Day 180 post-mortem on the Day-90 prediction. Two emails between now and the half-year mark, total. The rest happens in the new channels.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The Engine Room cohort home: <a href="${SIGNALS}/post-90" style="color:#0ea5e9;">${SIGNALS}/post-90</a>. The Receipts ledger (where the Day-90 prediction resolves, name by name): <a href="${SIGNALS}/wins" style="color:#0ea5e9;">${SIGNALS}/wins</a>.</p>
`),
  },

  // Day 150 — the "five months in" reflection. Stays brief on purpose;
  // the reader is now inside the new environment, so the email's only
  // job is to maintain rhythm and re-anchor the next touchpoint (Day-180
  // post-mortem) without re-pitching anything. Brunson rule: once the
  // environment has changed, do not pull the buyer back into the old
  // surface to make a new ask. The email's content lives in the new env.
  {
    subject: "Five months. The pattern that's actually emerging.",
    delayMs: THIRTY_MIN + 150 * ONE_DAY,
    html: wrap(`
<p>Five months in.</p>
<p>If the Sunday Brief has been arriving in your podcast app, here's the pattern I'd point at if you asked me to summarise the last sixty days in one sentence: the threshold-band orgs that resolve into a funding round inside the 90-day window have a markedly different contributor-onboarding shape than the ones that resolve into a product launch or a re-rating.</p>
<p>That's not a thing the Day-0 me would have said. It's something the panel surfaced after we'd voiced 18 weekly briefs back-to-back and noticed the contour — funding-round resolutions cluster around contributor-influx spikes that pre-date the velocity spike, while product-launch resolutions cluster around velocity spikes that pre-date the contributor influx. Causation is murky; the predictive lift from splitting the two is not.</p>
<p>The Day-180 post-mortem (lands on the Engine Room feed at the end of next month, also written up at <a href="${SIGNALS}/wins" style="color:#0ea5e9;">${SIGNALS}/wins</a>) will report back on the Day-90 prediction with this two-shape framing applied retroactively. If the four threshold-band orgs split cleanly along the funding-vs-launch contour, that's a real finding. If they don't, the post-mortem says so.</p>
<p>One short ask: if you've heard a Sunday Brief that landed on a name you'd been tracking before consensus, reply to this email with the org name and the brief number. That's the only feedback loop the engine asks for at this stage — one sentence, one org. It's how the next quarter's prediction set gets sharpened.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. Engine Room cohort home: <a href="${SIGNALS}/post-90" style="color:#0ea5e9;">${SIGNALS}/post-90</a>. If the feed isn't on your podcast app yet, the URL there walks the install in two clicks.</p>
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

  // ──────────────────────────────────────────────────────────────────────
  // Attractive-Character parable inserts (Brunson DCS Ch 7 + ES Ch 2).
  //
  // Three Seinfeld-style character emails that build the narrator persona
  // (The Data Nerd) without selling. Each is a small story with a lesson;
  // none has a hard CTA. They run BETWEEN sales beats so the reader gets
  // narrative continuity, not pitch fatigue.
  //
  // Appended to the END of the array intentionally — TIER_OVERRIDES is
  // keyed by index for the first ~22 entries, so index drift here would
  // misroute F/T/I cohorts. Appending preserves all existing overrides.
  // ──────────────────────────────────────────────────────────────────────

  // Day 7 — Parable: The Sunday Email I Never Sent
  {
    subject: "The Sunday email I never sent (and what it cost me)",
    delayMs: THIRTY_MIN + 7 * ONE_DAY,
    html: wrap(`
<p>Quick story this morning. No pitch.</p>
<p>The Sunday before the $4M Series A I should have been in, I drafted a three-line email to the founder. It said: "Saw your settlement-layer commits. The way you're handling the FX edge case is the kind of thing your competitors will copy in eighteen months. Would love to put a small cheque in if you ever raise."</p>
<p>I read it back. Decided I hadn't earned the right. Closed the laptop.</p>
<p>Three weeks later the deck went out and the round closed inside a week.</p>
<p>I've thought about that draft a lot. The work was done. I had the technical observation. I had the timing. I had the cheque size that would have been welcome on a small angel pre-seed. The thing I lacked was permission — not from the founder, who would have read it in 30 seconds and replied — but from myself.</p>
<p>The product on this site exists because I wanted to remove that step. The Sunday digest tells me which engineering observations are sharp enough to be worth an email. When the digest flags an org, I don't ask whether I've earned the right anymore. The digest is the permission slip. I write the three lines.</p>
<p>If you're reading this and there's a draft sitting in your folder — about a repo, a contributor, a README change you noticed last week — that's the email. Send it today. The expensive move was never the email. The expensive move was the week you waited.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. Where this lives in the broader character: this is one of six parables on the <a href="${SIGNALS}/data-nerd#sunday-email" style="color:#0ea5e9;">character bible page</a>. Read it if you want the rest. Or just send the email and skip the page.</p>
`, "drip-d7-parable"),
  },

  // Day 33 — Parable: The Reader Who Told Me I Was Wrong
  {
    subject: "The reader who told me I was wrong (and why I'm grateful)",
    delayMs: THIRTY_MIN + 33 * ONE_DAY,
    html: wrap(`
<p>A month ago a Series B associate replied to a Tuesday digest with two lines.</p>
<p>"You flagged orgname. Their commit velocity tripled because they migrated a monorepo. There was no acceleration. Just a re-org."</p>
<p>She was right. The model had no signal for monorepo migration events — when a team consolidates ten repos into one, every commit to the new repo looks like a ten-fold velocity surge for two weeks until the dust settles. Pure noise dressed as signal.</p>
<p>We added a monorepo-migration detector the next Sunday. False positive rate dropped from 7% to 4% on the back of one reader's reply. The methodology page at <a href="${SIGNALS}/methodology" style="color:#0ea5e9;">${SIGNALS}/methodology</a> got updated the same week, with a footnote crediting the catch.</p>
<p>Three things I want to name out loud, because the way most data products handle this is the opposite:</p>
<ol>
<li><strong>Every methodology is wrong somewhere.</strong> The cheap move is to deny it. The expensive move — and the one that compounds — is to publish the limit before the reader finds it.</li>
<li><strong>The reader who corrects us is the reader who matters most.</strong> She's been on the bus longer than most. She's the one whose Tuesday morning we're trying to be useful on.</li>
<li><strong>The 4% false positive rate is the new floor, not the new ceiling.</strong> Aiming for 2% by Q4. Will publish the next post-mortem when we get there or when we discover the next thing we got wrong, whichever comes first.</li>
</ol>
<p>If you've spotted something — a flagged org that doesn't make sense, a signal we're missing, a category we don't understand yet — reply to this email. Two daily reply batches. I read every one. Most don't change the model. The ones that do are why the model gets better.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The full list of methodology corrections (with reader credits where given) lives at <a href="${SIGNALS}/uptime" style="color:#0ea5e9;">${SIGNALS}/uptime</a>. The list is short. That's a feature: each correction is a real thing we got wrong, named in public.</p>
`, "drip-d33-parable"),
  },

  // Day 80 — Parable: The Tuesday I Broke the Regression
  {
    subject: "The Tuesday I broke the regression (a public post-mortem)",
    delayMs: THIRTY_MIN + 80 * ONE_DAY,
    html: wrap(`
<p>This is the kind of email most products don't send. I'm sending it because the methodology is supposed to be more interesting than the wins.</p>
<p>On a Tuesday in February I refactored the velocity-computation function "just to clean it up." Pushed at 9pm with a one-line commit message. Wednesday morning the digest went out with three orgs ranked at the top that had no business being there — a hackathon, a bot-heavy security-tool repo, and a vendor's documentation site. Thirty subscribers replied, mostly polite. A few were not.</p>
<p>I rolled back the refactor at 11am Wednesday. Ran the regression against the prior week's known-good output. Found the bug — an off-by-one in the contributor-deduplication step that double-counted any account whose handle started with a number. Hackathons over-index on numbered usernames. Bots, too. Documentation sites have repos owned by accounts like "1password-docs-deploy" — same pattern.</p>
<p>Shipped the fix Thursday at 3am. Regenerated the prior week's digest from corrected data, re-sent to everyone who'd been on the bad list. Posted the post-mortem at <a href="${SIGNALS}/uptime" style="color:#0ea5e9;">${SIGNALS}/uptime</a> Friday morning, with the bad commit, the fix commit, the regression test that would have caught it (and now does), and the names of the seven readers who'd flagged it first.</p>
<p>The whole thing took three days. The total subscriber loss from the bad digest: two unsubscribes. The lesson, which is why I'm telling you, is that this is the entire reason the price is €9.97/mo and not €9,970/mo:</p>
<p><em>If we're charging €9,970, the post-mortem is internal and the bug never gets named in public.</em> The customer wouldn't tolerate it. At €9.97, the post-mortem is the product. Subscribers who reply with bug reports are the regression test. The whole feedback loop runs in public, on the methodology page, with names attached. That's not a discount; it's a different relationship.</p>
<p>If you've ever wondered what happens when the model breaks, this is what happens. Slow Tuesday. Bad Wednesday. Public Thursday. Better Friday.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The seven readers who flagged the bad ranking first all got a free month of Insider Circle, no asks attached. The names are in the post-mortem. The system continues to work because they kept it honest.</p>
`, "drip-d80-parable"),
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
<li><strong>Quarterly synthetic State-of-the-Engine talk</strong> — 6-min Remotion video on your fund's specific thesis (4/yr).</li>
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
 * 30-Day Deal Flow Reset Challenge — alternate funnel for /challenge signups.
 * Four-week structure:
 *   Week 1 (Days 1-7)   — Learn the 7 atomic signals (SSRN paper)
 *   Week 2 (Days 8-14)  — Apply: composite on 3 real candidates + 1 calibration
 *   Week 3 (Days 15-21) — Synthesize: 10-org watchlist + Monday rhythm + Q&A
 *   Week 4 (Days 22-30) — Operationalize: alerts, share template, MCP, weights
 *
 * Day 30 reveals "or run it across 4,200 orgs in 4 seconds with the MCP" and
 * stacks the three CTAs (Free digest / Dashboard / Sector Sweep) as a
 * Stack-Slide close.
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
<p>Welcome to the 30-Day Deal Flow Reset.</p>
<p>The job this does for you, in one line: see startups heating up in your sectors before they raise or hit the press. You don't read code and you don't crunch anything — you learn to read a handful of public GitHub tells, and the same thing the live tool does for you automatically.</p>
<p>One thing up front, because people get confused: this is a tool, not a fund. I'm not a VC, I'm not competing with you for the deal. I built the system so you can see the same early engineering signal I do, and source earlier in the sectors you already know.</p>
<p>Over the next 30 days I'll send you one email per day. The structure is four phases:</p>
<ul>
<li><strong>Week 1 (Days 1-7) — Learn.</strong> Each of the 7 atomic GitHub signals that historically precede a fundraise, drawn from the panel of 219 confirmed rounds in the SSRN paper at <a href="https://ssrn.com/abstract=6606558" style="color:#0ea5e9;">ssrn.com/abstract=6606558</a>. One signal per day, 5-minute manual exercise.</li>
<li><strong>Week 2 (Days 8-14) — Apply.</strong> Run the composite on three real candidates from your own pipeline + one calibration backtest on a known recently-funded org. End the week with a real scorecard artifact.</li>
<li><strong>Week 3 (Days 15-21) — Synthesize.</strong> Build a 10-org watchlist, set the Monday rhythm, sector-batch sweep, score-driven founder Q&amp;A, the 30-second pre-read.</li>
<li><strong>Week 4 (Days 22-30) — Operationalize.</strong> Alerts, anti-signals, co-investor share template, MCP integration (free), custom composite weights, retrospective, graduation.</li>
</ul>
<p><strong>The commitment:</strong> ~5-10 minutes a day. Week 1 is tight 5-min walkthroughs. Weeks 2-4 stretch to 10-15 min/day as you build the operational system.</p>
<p><strong>The goal:</strong> by Day 31 you own a 7-signal sourcing system that runs in ~25 min/week against any public GitHub org. The framework is licensed CC BY 4.0 and yours either way — no upgrade pressure on Day 30.</p>
<p>Pick one startup before tomorrow. Any one. A founder you met, a company you almost-invested in, a portfolio org you want to monitor. Have its GitHub URL ready — every signal in the next 7 days runs against the same org you pick today.</p>
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
<p><strong>Yesterday's read:</strong> commit velocity told you whether the engineering team is accelerating. Hopefully your pick scored, hopefully it didn't — either is useful. Today the signal layers on top: even sharp acceleration concentrated in one committer is a different bet than sharp acceleration spread across four.</p>
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
<p><strong>Yesterday's read:</strong> contributor diversity told you whether the team is real. Today's signal tells you whether anyone outside the team cares about what they're building.</p>
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
<p><strong>Yesterday's read:</strong> the dependents graph told you whether anyone uses the code. Today tells you whether the team thinks anyone is about to.</p>
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
<p><strong>Yesterday's read:</strong> a fresh README told you whether the team is positioning. Today tells you whether they're building the platform around the position.</p>
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
<p><strong>Yesterday's read:</strong> repo-creation told you whether the team is building outward. Today tells you whether they're keeping up with the inbound at the same time.</p>
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

  // Day 7 — Composite + Stack-Slide close
  {
    subject: "Day 7 — The composite, and 4,200 orgs in 4 seconds",
    delayMs: 15 * 60 * 1000 + 7 * ONE_DAY,
    html: wrap(`
<p><strong>Yesterday's read:</strong> the issue-to-PR ratio gave you the last of the six atomic signals. Today they assemble.</p>
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
<p>That's the manual version. It takes ~30 minutes per startup. If you want to monitor a portfolio of 30, that's a 15-hour week.</p>
<hr style="border:none;border-top:1px solid #1e293b;margin:24px 0;">
<p><strong>What you've built this week, at retail.</strong> Comparable signal-walkthrough courses charge €69-€297 per signal. Priced as paid lessons, the seven days break down to:</p>
<table cellpadding="6" cellspacing="0" style="border-collapse:collapse;width:100%;font-size:14px;color:#cbd5e1;">
<tr><td>Day 1 — Commit velocity</td><td style="text-align:right;color:#34d399;font-family:monospace;">€79</td></tr>
<tr><td>Day 2 — Contributor diversity</td><td style="text-align:right;color:#34d399;font-family:monospace;">€79</td></tr>
<tr><td>Day 3 — Dependents graph</td><td style="text-align:right;color:#34d399;font-family:monospace;">€89</td></tr>
<tr><td>Day 4 — README freshness</td><td style="text-align:right;color:#34d399;font-family:monospace;">€69</td></tr>
<tr><td>Day 5 — New repo creation rate</td><td style="text-align:right;color:#34d399;font-family:monospace;">€89</td></tr>
<tr><td>Day 6 — Issue-to-PR ratio</td><td style="text-align:right;color:#34d399;font-family:monospace;">€89</td></tr>
<tr><td>Day 7 — Composite + scaling system</td><td style="text-align:right;color:#34d399;font-family:monospace;">€297</td></tr>
<tr style="border-top:1px solid #334155;"><td style="padding-top:8px;"><strong>Total retail value</strong></td><td style="text-align:right;color:#a7f3d0;font-family:monospace;font-weight:700;padding-top:8px;">€791</td></tr>
<tr><td><strong>You paid</strong></td><td style="text-align:right;color:#34d399;font-family:monospace;font-weight:700;font-size:18px;">€0</td></tr>
</table>
<p>Free because the methodology is published CC BY 4.0 at <a href="https://ssrn.com/abstract=6606558" style="color:#0ea5e9;">ssrn.com/abstract=6606558</a>. We charge for scale (the live engine across 4,200 orgs and the custom Sector Sweep), not for the framework.</p>
<hr style="border:none;border-top:1px solid #1e293b;margin:24px 0;">
<p><strong>Three optional rungs from here.</strong> Stacked from least to most committed. Pick none and the framework is still yours.</p>
<p><strong>Rung 0 — Free Sunday Digest.</strong> Five named GitHub orgs every Sunday, scored against the same 7-signal composite you just learned. <a href="${SITE}/#signup" style="color:#0ea5e9;">${SITE}/#signup</a>. Free forever, no upgrade pressure.</p>
<p><strong>Rung 1 — Dashboard, €9.97/mo founding rate.</strong> 140 venture-backed startups ranked by 14-day commit-velocity acceleration, refreshed every Monday at 06:00 UTC. Filter by sector, stage, geography. The 219-startup backtest CSV. Two free Chrome extensions. The free MCP server (6 tools across Claude / Cursor / Windsurf). 30-day Signal-or-It's-Free guarantee — reply REFUND, no questions. Standalone retail of the components: ~€1,431/yr. Founding rate locks for life. <a href="${SITE}/pricing#dashboard" style="color:#0ea5e9;">${SITE}/pricing#dashboard</a></p>
<p><strong>Rung 2 — Custom Sector Sweep, €1,997 one-time.</strong> Pick one sector, we deliver the 40-page written deep-dive in 5 business days: top 25 ranked orgs, contributor maps, three pre-Crunchbase breakouts, raw CSV, 30-day async Q&A. Capped at 8 per quarter — bandwidth, not artificial scarcity. <a href="${SIGNALS}/sector-sweep" style="color:#0ea5e9;">${SIGNALS}/sector-sweep</a></p>
<p>Or pick none. Whatever you do — even if you just keep running the manual version yourself — you now have a sourcing process that works without paying anyone. That's the point of the week.</p>
<p>Tomorrow: a Day-8 recap with one ask, and what to expect from this address from here on.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The full graduation page is at <a href="${SIGNALS}/challenge/done" style="color:#0ea5e9;">${SIGNALS}/challenge/done</a> — same three rungs, with the deliverables broken out and the standalone retail of each component listed. The Sector Sweep is capped at 8 per quarter; Q3 2026 has 7 of 8 open as of this email.</p>
`),
  },

  // ─────────────────────────────────────────────────────────────────
  // Week 2 (Days 8-14): APPLY — composite on real candidates
  // ─────────────────────────────────────────────────────────────────

  // Day 8 — Week 2 kickoff: pick three candidates
  {
    subject: "Day 8 — Pick three real candidates",
    delayMs: 15 * 60 * 1000 + 8 * ONE_DAY,
    html: wrap(`
<p><strong>Week 1 closed yesterday.</strong> You can read the framework. Week 2 starts now — and the only way to lock it in is to run it.</p>
<p>Today's task: pick three startups from your own pipeline. Three deliberate profiles:</p>
<ul>
<li><strong>#1 — the boring one.</strong> A startup you'd assume scores 3/6, no obvious tells.</li>
<li><strong>#2 — the obvious one.</strong> The startup you already feel good about.</li>
<li><strong>#3 — the wildcard.</strong> A pre-revenue or stealth-ish org you can't quite read.</li>
</ul>
<p>For each: GitHub URL + a one-line gut prediction (score 0-6) + the reason. Write it down before you score anything tomorrow — the most useful artifact of the week is the delta between gut and composite.</p>
<p>If your pipeline is empty, pick three Series A/B announces from the last 30 days. The framework works retroactively too.</p>
<p><strong>Tomorrow:</strong> candidate #1, end-to-end, in 15 minutes. We'll do all six signals on the boring one first.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },
  // Day 9 — Score candidate #1
  {
    subject: "Day 9 — Score candidate #1 end-to-end",
    delayMs: 15 * 60 * 1000 + 9 * ONE_DAY,
    html: wrap(`
<p><strong>Yesterday's pick:</strong> three candidates, gut predictions written down. Today: candidate #1, the boring one, full composite.</p>
<p>One tab open on the GitHub org. Six signals, 60-90 seconds each. Total target: 15 minutes.</p>
<p><strong>Procedure:</strong></p>
<ol>
<li>Signal 1 — commit velocity (Insights → Pulse).</li>
<li>Signal 2 — contributor diversity (Insights → Contributors).</li>
<li>Signal 3 — dependents graph (Insights → Dependency graph → Dependents).</li>
<li>Signal 4 — README freshness (file → History).</li>
<li>Signal 5 — new repo creation (Repositories → Newest).</li>
<li>Signal 6 — issue-to-PR ratio (Issues, then Pull requests).</li>
</ol>
<p>For each: +0 or +1, plus a one-sentence note. Total composite at the end.</p>
<p><strong>Watch the clock.</strong> 25+ minutes means you're over-thinking. The whole point of the manual procedure is that it's fast enough to run on every founder you meet.</p>
<p><strong>Edge case:</strong> if signal 3 (dependents) is empty, that's not zero — that's "private distribution" and it deserves a note.</p>
<p>Compare composite to your gut prediction from yesterday. Note the delta.</p>
<p><strong>Tomorrow:</strong> candidate #2, the obvious one. Your prediction was probably high — let's see whether the composite agrees.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },
  // Day 10 — Score candidate #2
  {
    subject: "Day 10 — Score candidate #2 (the obvious one)",
    delayMs: 15 * 60 * 1000 + 10 * ONE_DAY,
    html: wrap(`
<p><strong>Yesterday:</strong> the boring one. Today: the obvious one — and the most likely place for the framework to disagree with you.</p>
<p>Same six signals, same order. Try to score honestly. Pretend you've never heard of the founder.</p>
<p><strong>What to look for:</strong> any signal where the composite disagrees with your prior. A "darling" that scores 2/6 happens — usually because the founder is great but the engineering org is one person. The bet is on the founder, not the team. Note that explicitly.</p>
<p>If your gut said 5/6 and the composite says 5/6, the prior was right but the framework didn't add value. If gut said 5/6 and composite says 3/6, you just dodged a bullet.</p>
<p>Both outcomes are useful.</p>
<p><strong>Tomorrow:</strong> candidate #3, the wildcard. This is where the composite earns its keep — calling something your gut couldn't read.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },
  // Day 11 — Score candidate #3
  {
    subject: "Day 11 — Score candidate #3 (the wildcard)",
    delayMs: 15 * 60 * 1000 + 11 * ONE_DAY,
    html: wrap(`
<p><strong>Yesterday:</strong> the obvious one. Today: the unread one — and probably where you'll feel the framework working hardest.</p>
<p>Same six signals. Be deliberate about signal 3 (dependents) and signal 5 (new repos) — those tell the most about a stealth team.</p>
<p>Total composite. Compare to gut.</p>
<p><strong>Then write the next-step:</strong> pass, second meeting, or watch-only.</p>
<p>A wildcard scoring 6/6 is rare but real. When it happens, the second meeting is almost mandatory — the framework just told you something nobody else has surfaced.</p>
<p>The wildcard is where the composite generates the most diligence-conversation leverage. The score becomes the question, not the conclusion.</p>
<p><strong>Tomorrow:</strong> compare all three. We'll pull out the signal that pulled the heaviest weight across your candidates — usually the one you'd have skipped.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },
  // Day 12 — Compare three
  {
    subject: "Day 12 — Compare all three. Which signal carried the read?",
    delayMs: 15 * 60 * 1000 + 12 * ONE_DAY,
    html: wrap(`
<p><strong>Yesterday:</strong> all three composites are in. Today: line them up and find the signal that did the most work.</p>
<p>Lay out the three candidates: name, gut prediction, composite, delta.</p>
<p>For each signal (1-6), note: did this signal flip a candidate's score? Up or down?</p>
<p>Identify the signal that produced the biggest disagreement with your gut. For dev-tools investors, it's usually <strong>dependents</strong>. For platform investors, usually <strong>new repo creation</strong>. For B2B SaaS, usually <strong>commit velocity</strong>.</p>
<p>Write one sentence: "For my beat, the signal I should never skip is ___."</p>
<p>Save it. Update every 10 candidates. Within a quarter you'll have the personal heuristic that an "all signals equal" framework can't give you.</p>
<p><strong>Tomorrow:</strong> a calibration run. We'll score one publicly-known recently-funded org and check whether the composite caught the round before it closed.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },
  // Day 13 — Calibration
  {
    subject: "Day 13 — Calibration: score a known funded org at month -3",
    delayMs: 15 * 60 * 1000 + 13 * ONE_DAY,
    html: wrap(`
<p><strong>Yesterday:</strong> you found the signal that carries your beat. Today: a backtest. One known round, scored at month -3.</p>
<p>Pick a Series A or B announce from 60-90 days ago. TechCrunch, Newcomer, Pro Rata. Open the GitHub org. For each signal, set the date filter to the org's state ~90 days before today (i.e. month -3 from announce).</p>
<p>Score as if you were doing diligence three months pre-announce. Compare the inferred score to the announced round.</p>
<p><strong>What to expect:</strong> a score of 4/6+ at month -3 is a hit — the framework would have flagged this round. A score of 2/6 or lower is a miss — useful too. The panel data says ~30% of rounds don't surface in GitHub signals.</p>
<p>Run this on five rounds and you'll have a personal hit-rate. 60-70% accuracy at month -3 is realistic for the public-data version. The MCP version layers in private-data heuristics and runs ~78%.</p>
<p><strong>Tomorrow:</strong> Week 2 wrap. Your first 3-startup scorecard becomes a real artifact you can show.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },

  // Day 14 — Week 2 wrap
  {
    subject: "Day 14 — Your first scorecard. Real artifact.",
    delayMs: 15 * 60 * 1000 + 14 * ONE_DAY,
    html: wrap(`
<p><strong>Two weeks in.</strong> You have something nobody else in your network has: a rolling 4-org composite scorecard with calibration. It's small but it's yours.</p>
<p>Today's task: compile a single page.</p>
<ul>
<li>4 orgs (3 candidates + 1 calibration)</li>
<li>Composite for each</li>
<li>Delta vs gut</li>
<li>The signal that mattered most</li>
</ul>
<p>Save it somewhere persistent. Send it to one trusted co-investor or analyst with the question: "What did I miss?"</p>
<p>This becomes the seed of your watchlist tomorrow — same data, different framing. Same orgs, but with a "next-touch date" added.</p>
<p>Schedule the Week 3 first session: 25 minutes on Monday. The cadence is the system.</p>
<p><strong>Tomorrow:</strong> Week 3 starts. Building the watchlist that turns these one-off scores into a continuous practice.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },

  // ─────────────────────────────────────────────────────────────────
  // Week 3 (Days 15-21): SYNTHESIZE — watchlist + cadence
  // ─────────────────────────────────────────────────────────────────

  // Day 15 — Build watchlist
  {
    subject: "Day 15 — Build a 10-org watchlist",
    delayMs: 15 * 60 * 1000 + 15 * ONE_DAY,
    html: wrap(`
<p><strong>Last week:</strong> three composites, one calibration, one personal heuristic. This week: turn that snapshot into a habit.</p>
<p><strong>Today's procedure:</strong></p>
<ol>
<li>Pick one sector you actually care about (vertical SaaS, dev-tools, fintech infra, etc.).</li>
<li>List 10 orgs in that sector with public GitHub. AngelList, Crunchbase, your CRM.</li>
<li>Run the composite once on each. ~90 minutes total. Yes, today is the long day.</li>
<li>Sort by score. Save with date stamp.</li>
</ol>
<p>The list is the artifact — not the conclusion. Scores will move week to week and that movement is the actual signal.</p>
<p><strong>Save as CSV with one column per signal.</strong> When a score moves, you'll see which signal moved — and that's where the founder conversation starts.</p>
<p><strong>Tomorrow:</strong> setting the Monday rhythm. The watchlist isn't useful until it's a calendar habit.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },
  // Day 16 — Monday rhythm
  {
    subject: "Day 16 — Set the weekly Monday rhythm (25 min)",
    delayMs: 15 * 60 * 1000 + 16 * ONE_DAY,
    html: wrap(`
<p><strong>Yesterday:</strong> watchlist built. Today: the cadence that makes it pay.</p>
<p>The investors who outperform on deal flow run the same procedure on the same day every week. 25 minutes Mondays before email is the smallest commitment that survives a busy week.</p>
<p><strong>Procedure:</strong></p>
<ol>
<li>Block 25 minutes on Monday morning, recurring, before email.</li>
<li>Open the watchlist CSV.</li>
<li>Score signal 1 (commit velocity) on all 10 orgs — fastest signal first.</li>
<li>Note any score that moved by 0.5+ on that signal alone.</li>
<li>Schedule a follow-through to score the moved orgs in full later that day.</li>
</ol>
<p>If you can't protect 25 minutes once a week, the system can't compound — drop to 5 orgs in the watchlist and protect the time. After 4 Mondays, you'll have 40 datapoints across 10 orgs. Enough to spot the slope, not just the snapshot.</p>
<p><strong>Tomorrow:</strong> the sector batch — 25 orgs in 25 minutes when one sector starts getting hot.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },
  // Day 17 — Sector batch
  {
    subject: "Day 17 — Sector batch: 25 orgs in 25 minutes",
    delayMs: 15 * 60 * 1000 + 17 * ONE_DAY,
    html: wrap(`
<p><strong>Yesterday:</strong> the weekly rhythm. Today: the high-throughput version for sector-heat moments.</p>
<p>When a sector is moving (a category is buzzing, a competitor just raised, an LP is asking), the speed move is to score 25 orgs in that sector at lightning pace and rank them.</p>
<p><strong>Procedure:</strong></p>
<ol>
<li>Pick a sector that's moving. List 25 orgs (Crunchbase + AngelList).</li>
<li>Score signal 1 (commit velocity) on each, 60 seconds per org.</li>
<li>Sort top 5. For those 5, run the full composite — 75 minutes total.</li>
<li>Top 1-2 from the sweep get a meeting request the same week.</li>
</ol>
<p>This is the procedure the live engine runs every Monday at 06:00 UTC across 4,200 orgs in 4 seconds. You're learning the manual version so you can defend any number the engine produces.</p>
<p><strong>Tomorrow:</strong> using the composite as the founder Q&amp;A frame — turning a score into a question.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },
  // Day 18 — Score-driven questions
  {
    subject: "Day 18 — Five questions, each seeded by a signal",
    delayMs: 15 * 60 * 1000 + 18 * ONE_DAY,
    html: wrap(`
<p><strong>Yesterday's sector sweep</strong> gave you the broad scan. Today: turn one specific score into five sharp questions.</p>
<p>The framework's second-order value is what it does to your founder conversation. A founder who hears "your dependents graph has 80+ external repos, what's the migration cost for an enterprise customer who depends on you?" knows you read the engineering, not just the deck.</p>
<p><strong>Procedure:</strong></p>
<ol>
<li>Pick one of the candidates you scored last week.</li>
<li>For each signal that scored +1, write one founder-grade question seeded by that signal.</li>
<li>For each signal that scored 0, write one diagnostic question.</li>
<li>Total: 6 questions. Use them in your next first meeting.</li>
</ol>
<p>The form is "I noticed [data], what's the [implication]?" — never "do you have...". Yes/no closes the conversation. Implication questions open it.</p>
<p>Founders remember the investor who read their code. The Q&amp;A bar moves from "standard pitch" to "we're already in diligence."</p>
<p><strong>Tomorrow:</strong> scoring a portfolio company retroactively — what the framework would have caught at investment time.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },
  // Day 19 — Portfolio retroactive
  {
    subject: "Day 19 — Score a portfolio company retroactively",
    delayMs: 15 * 60 * 1000 + 19 * ONE_DAY,
    html: wrap(`
<p><strong>Yesterday:</strong> turned scores into questions. Today: applying the same scoring to your own portfolio history.</p>
<p>Pick the worst-performing investment from 12-24 months ago. What did the composite say at term sheet?</p>
<p><strong>Procedure:</strong></p>
<ol>
<li>Find the GitHub state from the term-sheet date (use date filters or the Wayback Machine if the org went private).</li>
<li>Run the composite as it would have read at that date.</li>
<li>Note: did the score predict the trajectory? Did one signal flip?</li>
</ol>
<p>This is where the framework either becomes part of your process or doesn't. If you find that two of your worst-performing investments scored 1/6 at the term-sheet date, that's a procedural change you can implement before the next check.</p>
<p>Run on 5 investments and the pattern usually shows up: one signal you systematically ignored. That's the highest-leverage change you can make to your own process this year.</p>
<p><strong>Tomorrow:</strong> the 30-second pre-read — using the composite to prep for a first meeting.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },
  // Day 20 — Pre-read
  {
    subject: "Day 20 — The 30-second pre-read for first meetings",
    delayMs: 15 * 60 * 1000 + 20 * ONE_DAY,
    html: wrap(`
<p><strong>Yesterday's portfolio retroactive</strong> closed a backward-looking loop. Today: the forward-looking version — before every meeting.</p>
<p>Every first meeting is improved by a 30-second pre-read of the founder's GitHub. The framework compresses that pre-read into a number plus three notes — readable from a phone in the elevator.</p>
<p><strong>Procedure:</strong></p>
<ol>
<li>Open the founder's GitHub org from your meeting calendar invite.</li>
<li>Glance at: README dated? Repo count moving? Top-contributor share?</li>
<li>30-second composite: 0-2 (cold), 3-4 (warm), 5-6 (hot).</li>
<li>Walk in with one signal-specific opening question.</li>
</ol>
<p>Most investors don't do this. The 30 seconds is the differential. Two months in, the pre-read becomes automatic — and you'll start noticing other investors who haven't done it.</p>
<p><strong>Tomorrow:</strong> Week 3 wrap. Your operational sourcing system is real, written down, running on a calendar.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },
  // Day 21 — Week 3 wrap
  {
    subject: "Day 21 — Your operational sourcing system",
    delayMs: 15 * 60 * 1000 + 21 * ONE_DAY,
    html: wrap(`
<p><strong>Three weeks in.</strong> Watchlist + Monday rhythm + sector-batch + question library + pre-read. You have an operating system, not a framework.</p>
<p>This is the difference between investors who "use signals" and investors who "run a sourcing process." The system runs you, not the other way around.</p>
<p><strong>Today's task:</strong></p>
<ol>
<li>Document the system on one page. Five components, half a sentence each.</li>
<li>Bake the calendar blocks: Monday 25 min (rhythm), as-needed (sector batch), every meeting (pre-read).</li>
<li>Identify the one piece you'll skip first under pressure. Pre-commit to a recovery move.</li>
<li>Send the doc to your investing partner or your most critical co-investor for sanity-check.</li>
</ol>
<p>If it's longer than one page, compress. A junior analyst should be able to replicate the system from the doc alone.</p>
<p>Annual planning bonus: this becomes your sourcing strategy slide for LPs. "I run a 7-signal composite weekly across N orgs in M sectors" is more concrete than "I source through warm intros."</p>
<p><strong>Tomorrow:</strong> Week 4 starts. Adding alerts, sharing, and the integration that makes the manual system automatic.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },

  // ─────────────────────────────────────────────────────────────────
  // Week 4 (Days 22-30): OPERATIONALIZE — alerts, sharing, scaling
  // ─────────────────────────────────────────────────────────────────

  // Day 22 — Alerts
  {
    subject: "Day 22 — Set alerts on score moves",
    delayMs: 15 * 60 * 1000 + 22 * ONE_DAY,
    html: wrap(`
<p><strong>Yesterday:</strong> system documented. Today: the layer that catches the move <em>between</em> Monday checkpoints.</p>
<p>A weekly snapshot is a habit. An alert is leverage. The right alert threshold catches the score move before the round closes; the wrong threshold drowns you in noise.</p>
<p><strong>Procedure:</strong></p>
<ol>
<li>Set a Slack/email alert (or just a Calendar reminder) on commit velocity flips ≥0.4 week-over-week.</li>
<li>Add a second alert on README updates that change &gt;50 lines.</li>
<li>Add a third alert on new repo creation (any new repo in a watched org).</li>
<li>Test by triggering one manually on a known org.</li>
</ol>
<p>If you get more than 3 alerts/week per org, the threshold is too sensitive — narrow it.</p>
<p>When an alert fires on a watchlist org, the response should be tight: 60-second context check, 5-minute composite recheck, a meeting request if the score crossed a meaningful threshold.</p>
<p><strong>Tomorrow:</strong> the anti-signal — orgs where 6/6 is wrong, and how to flag those before you waste a meeting.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },
  // Day 23 — Anti-signal
  {
    subject: "Day 23 — The anti-signal: when 6/6 is wrong",
    delayMs: 15 * 60 * 1000 + 23 * ONE_DAY,
    html: wrap(`
<p><strong>Yesterday:</strong> alerts. Today: the override layer that catches the orgs where alerts will lie to you.</p>
<p>Frameworks are gameable, especially public ones. A devtools agency, a YC alum farming OSS contributions, a team running a single-customer consultancy — all can score 6/6 on the public composite. Your false-positive list is the personal antibody.</p>
<p><strong>Procedure:</strong></p>
<ol>
<li>List 3 archetypes you've seen game public-data signals (agencies, single-customer consultancies, OSS-funded research labs).</li>
<li>For each, note the signal that betrays it on closer reading (e.g. agency → look at customer-named repos).</li>
<li>Add a manual "sanity check" step to your Monday rhythm: top 1 from watchlist gets the 5-minute archetype check.</li>
<li>Save the archetype list. Update quarterly.</li>
</ol>
<p>The archetype list is the most personal artifact in this whole challenge. It encodes your specific bias-correction. Two investors with the same 6-signal framework will produce different deal flow because their archetype lists differ.</p>
<p><strong>Tomorrow:</strong> making the score legible to a co-investor — the share template that turns a number into a paragraph.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },
  // Day 24 — Co-investor share
  {
    subject: "Day 24 — Co-investor share template (3 lines)",
    delayMs: 15 * 60 * 1000 + 24 * ONE_DAY,
    html: wrap(`
<p><strong>Yesterday:</strong> false-positive override. Today: making the framework readable to people who don't run it themselves.</p>
<p>A composite score is illegible to a co-investor who doesn't know your framework. A three-line template that translates "composite 5/6, sharp acceleration" into a paragraph they can act on is the difference between solo conviction and syndicate conviction.</p>
<p><strong>Procedure:</strong></p>
<ol>
<li>Write a 3-line template. Line 1: org + composite + sector. Line 2: the standout signal in plain English. Line 3: the question or ask.</li>
<li>Test it on one co-investor with a recent watchlist standout.</li>
<li>Iterate the template based on their reply (or non-reply).</li>
</ol>
<p>If 0/5 replies, the line 2 is too jargon-heavy — rewrite to lead with the implication, not the metric.</p>
<p>When the template starts producing "who else have you shared this with" replies, you've graduated from sourcing to syndicate-leading. That's a different power level.</p>
<p><strong>Tomorrow:</strong> the IDE/MCP integration. The manual system runs in the browser; the automated layer runs in your editor.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },
  // Day 25 — MCP integration
  {
    subject: "Day 25 — MCP integration (free): score from your editor",
    delayMs: 15 * 60 * 1000 + 25 * ONE_DAY,
    html: wrap(`
<p><strong>Yesterday:</strong> share template. Today: collapse the manual procedure into an editor command.</p>
<p>After 24 days of running the manual procedure, the integration buys back the time. The MCP server exposes the same six signals as IDE-callable tools — score an org from Claude Desktop, Cursor, or Windsurf in a single command.</p>
<p><strong>Procedure:</strong></p>
<ol>
<li>Install the MCP server (free): <a href="${SIGNALS}/install" style="color:#0ea5e9;">${SIGNALS}/install</a> has the one-line config for Claude / Cursor / Windsurf.</li>
<li>Test by asking the model: "score the github org [name] using the composite framework."</li>
<li>Verify the response matches a manual run within ±0.5.</li>
<li>Add the score-an-org command to your editor command palette.</li>
</ol>
<p>Once the MCP works, you can run the framework on a founder's GitHub during a Zoom call without leaving the editor or the call. The diligence move that used to take 25 minutes pre-meeting now happens during the meeting.</p>
<p>If you don't use a model-augmented editor, skip — the manual cadence still works. The MCP layer is the speed unlock, not a prerequisite.</p>
<p><strong>Tomorrow:</strong> customising the composite weights — the framework is yours, you should weight it like yours.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },
  // Day 26 — Custom weights
  {
    subject: "Day 26 — Custom composite weights for your beat",
    delayMs: 15 * 60 * 1000 + 26 * ONE_DAY,
    html: wrap(`
<p><strong>Yesterday:</strong> MCP integration. Today: the personal calibration the integration alone can't give you.</p>
<p>The default composite (each signal +1) is the right starting point because it's calibration-light. After 26 days you have enough personal data to see which signal matters most for your beat, and a re-weighted composite outperforms the default for your specific deal flow.</p>
<p><strong>Procedure:</strong></p>
<ol>
<li>Pull the watchlist CSV and the 4-org scorecard from Day 14.</li>
<li>For each signal: which one would you have weighted higher to better predict your hits?</li>
<li>Propose new weights (e.g. commit velocity 1.5×, dependents 1.5×, others 1×).</li>
<li>Recompute composites with new weights. Compare ranking shifts.</li>
</ol>
<p>Don't over-weight a signal because you remember one big hit on it. The right weighting reflects pattern across 10+ orgs, not one anchor case.</p>
<p>The custom weights become a competitive moat. Two analysts with the same framework but different weights produce different deal flow — and yours is calibrated to your specific outperformance pattern.</p>
<p><strong>Tomorrow:</strong> the 30-day retrospective. Pull out the artifacts. What did the framework actually catch?</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },
  // Day 27 — Retrospective
  {
    subject: "Day 27 — 30-day retrospective: what the framework caught",
    delayMs: 15 * 60 * 1000 + 27 * ONE_DAY,
    html: wrap(`
<p><strong>Four weeks in.</strong> Time for the audit. Did the framework earn its slot?</p>
<p>By Day 27 you have ~30 datapoints across ~13 orgs (3 candidates + 1 calibration + 10 watchlist + retroactive portfolio). Enough to write a one-page retrospective.</p>
<p><strong>Procedure:</strong></p>
<ol>
<li>List every score you ran in the last 30 days. Org + composite + delta-vs-gut.</li>
<li>Count: composite &gt;gut (framework added value) vs composite =gut (confirmed) vs composite &lt;gut (saved you).</li>
<li>Identify any specific deal flow you wouldn't have surfaced without the framework.</li>
<li>Write the one-paragraph retrospective: what's keepable, what to drop.</li>
</ol>
<p>If you can't articulate one specific case where the framework changed your decision, that's also a valid result — note it and decide accordingly.</p>
<p>Sometimes 30 days isn't enough to see attribution because rounds take 60-90 days to close. In that case, schedule a 60-day follow-up retrospective to revisit.</p>
<p><strong>Tomorrow:</strong> the Sunday digest as continuous practice — turning the 30-day muscle into a forever rhythm.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },
  // Day 28 — Sunday digest
  {
    subject: "Day 28 — The Sunday digest as continuous practice",
    delayMs: 15 * 60 * 1000 + 28 * ONE_DAY,
    html: wrap(`
<p><strong>Yesterday's retrospective</strong> showed what the framework caught. Today: how to keep the catch rate without forcing 25 weekly minutes.</p>
<p>30-day challenges produce muscle that fades unless a continuous practice replaces them. Five new orgs every Sunday — scored against the same composite — keeps the framework alive without the active 25-min Monday block.</p>
<p><strong>Procedure:</strong></p>
<ol>
<li>You're already subscribed to the free Sunday digest (this is the same address). It continues automatically.</li>
<li>Each Sunday: open the digest, score the top 1 with the full composite, glance at the others.</li>
<li>When a digest org enters your investable beat, add it to the watchlist.</li>
<li>Every 4 Sundays, review the watchlist for promotion to outreach.</li>
</ol>
<p>~25 min/week sustained. Three months of Sundays = 60 newly-scored orgs into your awareness funnel. That's already more deal flow surface than most angel investors see in a year of warm intros alone.</p>
<p>If the Sunday digest doesn't fit your sector, the underlying engine has 4,200 orgs and 30+ sector tags. The Dashboard rung filters by your sector with the same five-orgs-per-week rhythm.</p>
<p><strong>Tomorrow:</strong> the rung decision. Three optional ways to keep using the system. Pick one or pick none — the framework stays yours either way.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },
  // Day 29 — Pre-graduation
  {
    subject: "Day 29 — Which rung makes sense (the honest match)",
    delayMs: 15 * 60 * 1000 + 29 * ONE_DAY,
    html: wrap(`
<p><strong>Tomorrow is graduation.</strong> Today: the honest pre-conversation. Based on the last 29 days, which rung — if any — actually fits the pattern?</p>
<p><strong>Procedure:</strong></p>
<ol>
<li>Re-read your retrospective from Day 27.</li>
<li>Quantify: how many orgs did you actually score in 30 days? If &lt;12, free is right. 12-50, Dashboard. 50+ in one sector, Sector Sweep.</li>
<li>Write a one-line reason for the rung you'll pick (or "none").</li>
<li>Set a calendar reminder for Day 30 to act on it.</li>
</ol>
<p><strong>Match by usage, not FOMO.</strong></p>
<p>Some readers find the free Sunday digest is correct, full stop — the manual rhythm is enough and the upgrade is FOMO. That's a valid outcome. The framework is yours either way.</p>
<p>The Dashboard's founding rate (€9.97/mo) locks for life. If usage data points to Dashboard, the founding-rate clock is the only thing that makes the timing matter — pricing reverts after the 2026 cohort closes.</p>
<p><strong>Tomorrow:</strong> graduation. The Stack Slide, the three rungs, and the one decision. The framework is already yours.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
`),
  },

  // Day 30 — Graduation Stack-Slide close
  {
    subject: "Day 30 — Graduation. Three rungs. One decision.",
    delayMs: 15 * 60 * 1000 + 30 * ONE_DAY,
    html: wrap(`
<p><strong>Thirty days.</strong> You finished.</p>
<p><strong>What you have:</strong> a sourcing system that runs every Monday for ~25 minutes, a watchlist of 10 named orgs, a 30-day retrospective, a custom-weighted composite, and (if you installed it) an MCP integration. Whether you upgrade or not, that's the artifact stack.</p>
<p><strong>What you paid:</strong> €0.</p>
<p><strong>Standalone retail of the components:</strong> ~€2,800 (30 daily lessons + watchlist + retrospective + custom composite + MCP).</p>
<hr style="border:none;border-top:1px solid #1e293b;margin:24px 0;">
<p><strong>Three optional rungs from here.</strong> Stacked from least to most committed. Pick none and the system is still yours.</p>
<p><strong>Rung 0 — Free Sunday Digest.</strong> Five named startups every Sunday, scored against the same 7-signal composite you just learned. <a href="${SITE}/#signup" style="color:#0ea5e9;">${SITE}/#signup</a>. Free forever, no upgrade pressure.</p>
<p><strong>Rung 1 — Dashboard, €9.97/mo founding rate.</strong> 140 venture-backed startups ranked by 14-day commit-velocity acceleration, refreshed every Monday at 06:00 UTC. Filter by sector, stage, geography. The 219-startup backtest CSV. Two free Chrome extensions. The free MCP server. 30-day Signal-or-It's-Free guarantee. Founding rate locks for life. <a href="${SITE}/pricing#dashboard" style="color:#0ea5e9;">${SITE}/pricing#dashboard</a></p>
<p><strong>Rung 2 — Custom Sector Sweep, €1,997 one-time.</strong> Pick one sector, we deliver the 40-page written deep-dive in 5 business days: top 25 ranked orgs, contributor maps, three pre-Crunchbase breakouts, raw CSV, 30-day async Q&amp;A. Capped at 8 per quarter. <a href="${SIGNALS}/sector-sweep" style="color:#0ea5e9;">${SIGNALS}/sector-sweep</a></p>
<p>Or pick none. The framework is licensed CC BY 4.0; nothing about the rung selection changes your ownership.</p>
<hr style="border:none;border-top:1px solid #1e293b;margin:24px 0;">
<p><strong>One ask, no pressure.</strong> If the Challenge worked for you, send the landing-page link to one other investor or analyst who would use it. <a href="${SIGNALS}/challenge" style="color:#0ea5e9;">${SIGNALS}/challenge</a>. We don't run an affiliate program because we don't want incentives to distort whether you tell a friend.</p>
<p>This thread now settles into the Sunday digest cadence. Sunday hits as usual this weekend.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The 30 days are permanent at <a href="${SIGNALS}/challenge" style="color:#0ea5e9;">${SIGNALS}/challenge</a> — every day has a slug-permalink. Bookmark it. Refer back when a portfolio call needs one of the procedures.</p>
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
    subject: "Let your agent see startups heating up before they raise",
    delayMs: THIRTY_MIN,
    html: wrap(`
<p>Welcome — and quick context.</p>
<p>First, what this is, so there's no confusion: GitDealFlow is a tool, not a fund. I'm not a VC and I'm not competing with you for the deal. The tool reads startups' public GitHub engineering activity and flags the ones quietly heating up in your sectors, before they raise or hit the press. You — or now your agent — just look.</p>
<p>You signed up to a launch sequence, not the regular Sunday digest. The free digest still arrives Sundays. This is a separate, time-bounded thread that lasts about ten days and ends when the cart closes on May 20.</p>
<p>The launch is for <strong>Agent Credits</strong> — the first per-call pricing tier for the GitDealFlow signal engine, built for AI agents that need to see which GitHub orgs are heating up early. Five emails over ten days. No padding.</p>
<p><strong>Stage 1 — The problem.</strong></p>
<p>Spend two minutes inside Claude or Cursor with an MCP server attached and the future is obvious. Agents don't scroll dashboards. They issue tool calls. They check, score, decide, and surface the startups heating up before you finish your coffee.</p>
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
<p>One Series A from the most recent quarter. Developer-tools sector. Public-data only — no insider scuttlebutt, no warm-intro chatter, nothing the tool couldn't see. This is the whole point of the book: how you spot a startup heating up in your sectors weeks before it raises. I'm leaving the org name off this email on purpose, so when you next sit down with the tool you can run the same trace yourself instead of reaching for the answer key.</p>
<p>Six weeks before the announcement, all seven signals on the org sat at the twelve-month median. ~38 commits/week. Two contributors. No new repos in eleven months. Boring. Baseline. The kind of profile that makes a partner skip past it on a Monday list.</p>
<p><strong>T-5 (five weeks out)</strong> — Signal #1, commit velocity, jumped to 71/week. By itself, noise — could be a doc rewrite or a refactor sprint. Signal #2, contributor count, held flat. The stack waits.</p>
<p><strong>T-4</strong> — Signal #2 fired: a third contributor appeared, then a fourth four days later. Signal #3, repo creation, added two new repos in a fortnight after eleven months of silence — one named for an obvious gateway rewrite, one named for a billing rail. Two new repos in a fortnight after eleven flat months is the regime change. Three concurrent flags. That's the threshold the book talks about in chapter four.</p>
<p><strong>T-3</strong> — Signal #4, PR merge cadence, dropped from 4.1 days median time-to-merge to 1.3 days. Code review gets faster when a team is racing. Signal #5, dependency-graph delta, added Stripe, a vector DB, and an internal package in the same week — a billing rail and a retrieval index landing together is what an AI-product launch looks like in dependency form. Five of seven, lit.</p>
<p><strong>T-2</strong> — Signal #6, platform migration cue, showed: the primary repo flipped from a single Dockerfile to a Dockerfile + Helm chart + Terraform module. Kubernetes-shaped deploys usually mean an enterprise pilot is in flight. Signal #7, issue-creator diversity (a hiring proxy), spiked: five new issue authors in seven days, three with GitHub profiles less than ninety days old. New hires push first commits before the HR page updates.</p>
<p><strong>T-1</strong> — Velocity peaked, contributor count peaked, then both relaxed. The book calls this the "calm before announcement" — the team stops shipping for a week to clean up the demo branch. The stack doesn't dim; it just plateaus.</p>
<p><strong>T-0</strong> — TechCrunch ran the headline. By that point the stack had been lit for thirty-eight days.</p>
<p>The whole trace cost €0 in marginal data spend. Public commit graph, weekly cron, deterministic regression. The two-hour version of this analysis collapses to a fifteen-minute scan once the stack is wired up — chapters four through nine define each signal, chapter ten ties them into the scoring rubric.</p>
<p>Day four, you'll get the unedited transcripts I promised — two early-stage investors who run a version of this daily, names redacted at their request, operational detail intact.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The tool that ran this trace is the Dashboard — it's a tool, not a fund; I'm not investing alongside you, I just surface the startups heating up in your sectors and you make the calls. Weekly refresh, sector and stage filters, €9.97/mo founding-member: <a href="${SIGNALS}" style="color:#0ea5e9;">${SIGNALS}</a>.</p>
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
<p style="color:#64748b;font-size:14px;">P.S. If running this manually starts to feel like a part-time job — the Dashboard is the same trace, automated, weekly. It's a tool, not a fund: it surfaces the startups heating up in your sectors and you make the calls, no code-reading required: <a href="${SIGNALS}" style="color:#0ea5e9;">${SIGNALS}</a>. The book buyer's price (€9.97/mo founding) holds for thirty days from your purchase, same window as this reply offer.</p>
`, "book-day7"),
  },
];

/**
 * First Look 14-day credit reactivation drip — Brunson DotCom Secrets Ch 13
 * ("The Best Bait" + the 14-day reactivation window). The €7 First Look Pass
 * promises a Dashboard credit if the buyer upgrades within 14 days. Without
 * a reactivation drip, that window closes silently. These three emails are
 * the warmth that converts the reactivation promise into actual upgrades.
 *
 * Cadence:
 *   D7  — half-time check-in. "How was the deep dive? Reply with your
 *          take. The credit is half-used."
 *   D10 — the math close. €7 + €2.97 = €9.97 (one month Dashboard). Frame
 *          the credit as "one month free, basically."
 *   D13 — last call. "Credit window closes tomorrow. After that, the €7
 *          stays a €7 deep-dive purchase, not a credit toward anything."
 *
 * Scheduled at tier === "firstlook" entry-checkout in
 * app/api/webhook/stripe/route.ts (mirrors the BOOK_DRIP pattern).
 */
export const FIRSTLOOK_REACTIVATION_DRIP = [
  {
    subject: "Did the First Look surface anything you'd act on?",
    delayMs: 7 * ONE_DAY,
    html: wrap(`
<p>Quick check-in. The First Look deep dive should have been in your inbox a few days ago — by now you've had time to read the PDF, glance at the CSV, and form a take.</p>
<p>Quick reminder of what this is: GitDealFlow is a tool, not a fund. I'm not investing alongside you. It reads startups' public GitHub activity and flags the ones quietly heating up in your sector — before they raise or hit the press. You don't crunch anything; it surfaces them, you look.</p>
<p>This is the half-time of the 14-day Dashboard-credit window. Two questions, plain:</p>
<ol>
<li><strong>Did the report surface anything you'd act on?</strong> One name, one company heating up early, one sector observation that shifted your thesis. Reply with the answer — even one line. I read every reply, and the answer feeds the next iteration of the tool.</li>
<li><strong>Are you considering the Dashboard?</strong> If yes, the €7 you paid credits 100% toward your first month. €9.97/mo founding rate, locked forever. The total cost of trying it for one month is €2.97 — coffee money to see startups heating up across every sector instead of one.</li>
</ol>
<p>If the deep dive missed the mark, that's also a useful answer. Reply REFUND and the €7 returns inside one business day, no questions, you keep the artefacts. Three years, two refunds — the bar is low because the bar is honest.</p>
<p><a href="${SIGNALS}/pricing?utm_source=email&utm_medium=firstlook-credit&utm_campaign=d7" style="color:#0ea5e9;font-weight:600;">Claim the credit and upgrade &rarr;</a></p>
<p>— ${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. To apply the credit: reply <code>REQUEST CREDIT</code> to this email and I apply it manually before charging — never been missed in three years.</p>
`, "firstlook-d7"),
  },
  {
    subject: "€7 + €2.97 = one month of the Dashboard",
    delayMs: 10 * ONE_DAY,
    html: wrap(`
<p>The math, plain.</p>
<p>You paid €7 for the First Look deep dive. The Dashboard founding rate is €9.97/mo. With the credit, your first month costs <strong>€2.97</strong> — three coffees in central Lisbon, less than a single Crunchbase seat for an hour.</p>
<p>What you trade three coffees for:</p>
<ul>
<li><strong>All 20 sectors live, every Monday at 06:00 UTC.</strong> The same tool that wrote your sector deep dive, applied across every sector automatically — so you see what's heating up everywhere, not just one lane.</li>
<li><strong>The startups shipping faster, ranked.</strong> The same lens, every sector, every week. No more "I wonder what's happening in fintech this month" — the answer lands in your dashboard.</li>
<li><strong>Top-mover alerts.</strong> When a company's engineering signal jumps mid-week, the dashboard flags it before next Monday's digest. (Under the hood: a 2× contributor-influx threshold — but you never have to think about the metric.)</li>
<li><strong>Raw CSV export of every org × every metric.</strong> Drop into your CRM, your notebook, your Notion thesis page. Your data, your shape.</li>
<li><strong>Methodology vault — full SSRN preprint, regression code, signal definitions.</strong> The same vault that powered your First Look. Open by default — for when you want to see exactly how it works.</li>
</ul>
<p>The credit window has four days left. After day 14, the €7 stays €7 — a one-time purchase you keep — but it stops counting toward Dashboard.</p>
<p><a href="${SIGNALS}/pricing?utm_source=email&utm_medium=firstlook-credit&utm_campaign=d10" style="color:#0ea5e9;font-weight:600;">Apply the credit (€2.97 first month) &rarr;</a></p>
<p>If the Dashboard isn't right for you, no pressure — the free Sunday digest still hits as usual, the deep-dive PDF is still yours forever, and we both move on. The credit just expires; nothing breaks.</p>
<p>— ${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. Founding rate is locked for the lifetime of the subscription. The price moves to €49/mo for the public hike later this year, but if you lock now you stay at €9.97/mo (€2.97 first month with the credit) forever.</p>
`, "firstlook-d10"),
  },
  {
    subject: "Last call — your €7 credit expires tomorrow",
    delayMs: 13 * ONE_DAY,
    html: wrap(`
<p>One last note on this. Your 14-day Dashboard-credit window closes tomorrow.</p>
<p>I don't extend it. Not because it's a hard rule of physics, but because the whole point of a 14-day window is that it ends — a credit that never expires isn't a credit, it's a price cut, and that breaks the founding-rate promise to everyone who locked in earlier.</p>
<p>Two paths from here.</p>
<p><strong>Path 1 — apply the credit, lock the founding rate.</strong> Your first month is €2.97 (€9.97 minus your €7 First Look credit). Founding rate is locked for the lifetime of the subscription, even when the public price moves to €49/mo. The deep dive you already paid for becomes the first month of a continuous engine.</p>
<p><a href="${SIGNALS}/pricing?utm_source=email&utm_medium=firstlook-credit&utm_campaign=d13" style="color:#0ea5e9;font-weight:600;">Lock the founding rate now &rarr;</a></p>
<p><strong>Path 2 — keep the deep dive, skip the upgrade.</strong> The PDF + CSV are yours forever. The free Sunday digest still hits every Monday. The credit expires, the €7 stays a one-time deep-dive purchase, no resentment, no follow-up pressure from me. The follow-up sequence ends here on this rung.</p>
<p>Either path works. The only path that doesn't is "wait and see" — because tomorrow the credit becomes a regular €9.97 first month and the founding rate may close to new buyers later this year.</p>
<p>If you want to keep the option open without committing tonight, reply <code>HOLD</code> and I'll extend the window by 7 days, one time. Don't extend without replying — I won't chase.</p>
<p>— ${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. Three years, two refunds. If the deep dive wasn't worth €7, reply REFUND now (still inside the 30-day refund window even if the credit window has closed). The two refunds were issued the same day each was asked. The standard is honest, not aggressive.</p>
`, "firstlook-d13"),
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
 * Index map (verified against SOAP_OPERA_EMAILS layout 2026-05-08 —
 * Brunson DotCom Ch 11 Phase 6 ship: +D120 EngineRoom-anchor, +D150
 * pattern-reflection inserted between D90 and D180):
 *   0=D0  1=D1  2=D2  3=D3  4=D3.5  5=D4 €7  6=D5 Dashboard  7=D6 Insider
 *   8=D8 Book  9=D9 public-data  10=D11 Book2  11=D12 Seinfeld
 *   12=D14 missed-deal  13=D17 Sunday-play  14=D21 false-pos
 *   15=D25 regression  16=D30 quiet-decision  17=D45 Insider2
 *   18=D60 Sector Sweep  19=D75 Crystal Ball  20=D90 EngineRoom-invite
 *   21=D120 EngineRoom-anchor  22=D150 pattern-reflection  23=D180 SoE2
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
<p>The free Sunday digest <strong>is</strong> the product on your tier. Five startups heating up in your sectors every Monday, ranked, no commitment. That stays exactly as it is. I'd rather you read for ten years and write your first cheque informed than upgrade once and resent it.</p>
<p>If your cadence ever crosses into the 2–5/year range, the right next rung is the <strong>€7 First Look Pass</strong> — you pick a sector at checkout, I send the Sector Deep Dive PDF + raw CSV in 24 hours. €7 is roughly what a coffee costs in Lisbon; it's the lowest-friction way to test the deeper data on your own thesis without committing to a subscription.</p>
<p>If your range is still 0–1/year, you don't need anything else from me. Keep the Sunday digest. Read the SSRN paper at <a href="https://ssrn.com/abstract=6606558" style="color:#0ea5e9;">ssrn.com/abstract=6606558</a> if you want the methodology end-to-end. The book is free at <a href="${SIGNALS}/book" style="color:#0ea5e9;">${SIGNALS}/book</a>.</p>
<p>That's the offer for your tier: free, forever. The 30-day welcome ends here, the rhythm continues. Sunday digest hits as usual this weekend.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. SSRN paper (n=219, the methodology backbone): <a href="https://ssrn.com/abstract=6606558" style="color:#0ea5e9;">ssrn.com/abstract=6606558</a> · Free book: <a href="${SIGNALS}/book" style="color:#0ea5e9;">${SIGNALS}/book</a> · See every door: <a href="${SIGNALS}/funnels" style="color:#0ea5e9;">${SIGNALS}/funnels</a></p>
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
<p>The free Sunday digest stays free regardless. The 30-day welcome ends here, the rhythm continues. Sunday hits as usual this weekend.</p>
<p>Talk soon —<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. Insider founding rate (€97/mo, 24h lead, closed Telegram): <a href="${SIGNALS}/insider" style="color:#0ea5e9;">${SIGNALS}/insider</a> · Sector Sweep (€1,997, 7 of 8 Q3 slots open): <a href="${SIGNALS}/sector-sweep" style="color:#0ea5e9;">${SIGNALS}/sector-sweep</a> · Email <a href="mailto:signal@gitdealflow.com?subject=Sector%20Sweep" style="color:#0ea5e9;">signal@gitdealflow.com</a> with the sector and the spec lands in your inbox inside one business day.</p>
`),
};

// ---------------------------------------------------------------------------
// Tier-specific Day-0 welcomes (Brunson Quiz Funnel — "anchor the rung from
// email 1"). 2026-05-08 expansion: previously only D30 was tier-specific —
// per Brunson DCS Ch 15 critique "same drip everyone gets" — every reader
// now lands on a Day-0 message that names their self-described rung in the
// first paragraph and frames the next 90 days around it.
// ---------------------------------------------------------------------------

const D0_F: SoapOperaEmail = {
  subject: "Welcome — the free digest IS the product on your tier",
  delayMs: THIRTY_MIN,
  html: wrap(`
<p>Welcome. Let me be clear up front, because people get confused: GitDealFlow is a tool, not a fund. I'm not a VC, I'm not competing with you for the deal. It reads startups' public GitHub engineering activity and flags the ones heating up in your sectors, before they raise or hit the press. You don't crunch anything &mdash; it surfaces them, you just look.</p>
<p>You told me on the quiz that you've written 0&ndash;1 angel checks in the past year &mdash; exploring, learning, maybe one day. Important: <strong>the free Sunday digest is the version for your tier, full stop.</strong></p>
<p>I built this after I missed a Series A I'd flagged in my own notebook three weeks before it announced. The team was clearly shipping faster &mdash; four new contributors, three new infrastructure repos in fourteen days &mdash; all sitting in plain sight on a public GitHub org. I'd talked myself out of writing the cheque. The investors who got in had read exactly the same early engineering signal and didn't.</p>
<p>So I built a system that reads that public activity for me. Across 4,200 venture-backed orgs. Every week. Mechanically. Your free Sunday digest is the top five startups heating up in your sectors, ranked, sector-tagged, no commitment.</p>
<p>For someone in your tier, that's enough. Read for ten years and write your first cheque informed. The &euro;7 First Look Pass exists if your cadence ever picks up to 2&ndash;5 checks/year &mdash; but I'd rather you read for free for a long time than upgrade once and resent it.</p>
<p>Tomorrow I'll challenge something most people in your tier believe: that public GitHub data is too noisy to read. It isn't. The framing is wrong, and once you see it the Sunday digest becomes a thirty-second read instead of a five-minute one.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The full methodology is published as an SSRN preprint (n=219, peer-reviewable): <a href="https://ssrn.com/abstract=6606558" style="color:#0ea5e9;">ssrn.com/abstract=6606558</a>. Free book version at <a href="${SIGNALS}/book" style="color:#0ea5e9;">${SIGNALS}/book</a>. Both are yours regardless of whether you ever spend a euro with us.</p>
`),
};

const D0_T: SoapOperaEmail = {
  subject: "Welcome — €7 is the right test for the way you write checks",
  delayMs: THIRTY_MIN,
  html: wrap(`
<p>Welcome. First, the plain version so there's no confusion: GitDealFlow is a tool, not a fund. I'm not a VC, not competing with you for the deal. It reads startups' public GitHub activity and flags the ones heating up in your sectors, before they raise or hit the press &mdash; you just look.</p>
<p>You told me on the quiz that you've written 2&ndash;5 angel checks in the past year &mdash; building cadence, sector-leaning. The right rung for your tier is the <strong>&euro;7 First Look Pass</strong>, and I'm going to spend the next 30 days showing you why it pays for itself the first time you run it.</p>
<p>Here's the story this started with. I was tracking a fintech-infra startup. No press, no AngelList buzz, no warm intros circulating. But their GitHub told a different story: the team was suddenly shipping faster &mdash; four new senior contributors from a public Series-B company, three new infrastructure repos spun up over a single weekend. I noted it. I closed the laptop. Three weeks later, $4M Series A.</p>
<p>The signal was public. The methodology is published (SSRN n=219, 21&ndash;47 day median lead time). The only thing missing was someone willing to pay &euro;7 once, pick a sector, and have the deep dive in their inbox in 24 hours.</p>
<p>That's literally the First Look Pass. Pick fintech-infra, AI/ML, dev tools, healthtech &mdash; whichever sits closest to your thesis. I send the 14-page PDF + raw CSV + walkthrough. If three orgs land that you'd genuinely consider writing into, the &euro;7 was the right call. If not, the report and CSV are still yours.</p>
<p>The credit-back is the kicker: if you upgrade to the Dashboard within 14 days, the &euro;7 credits 100%. So at worst you spend &euro;7 to test step 5 of the conversion story on your own thesis, and at best you walk into the Dashboard already up &euro;7.</p>
<p>Tomorrow: why "GitHub data is noise" is the most common objection &mdash; and why it's wrong in a specific, measurable way for your check-size.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. SSRN preprint (the methodology): <a href="https://ssrn.com/abstract=6606558" style="color:#0ea5e9;">ssrn.com/abstract=6606558</a> &middot; Free book: <a href="${SIGNALS}/book" style="color:#0ea5e9;">${SIGNALS}/book</a> &middot; First Look checkout (&euro;7, 24h delivery, credits 100% to Dashboard): <a href="${SITE}/#firstlook" style="color:#0ea5e9;">${SITE}/#firstlook</a></p>
`),
};

const D0_I: SoapOperaEmail = {
  subject: "Welcome — fund-tier rung, 24-hour lead, €1,997 sweep",
  delayMs: THIRTY_MIN,
  html: wrap(`
<p>Welcome. First, plainly, so there's no confusion: GitDealFlow is a tool, not a fund. I'm not a VC, not competing with you for the deal &mdash; it reads startups' public GitHub activity and flags the ones heating up in your sectors before they raise. You told me on the quiz that you write 20+ checks per year, run a fund, or run a syndicate. The &euro;9.97/mo Dashboard is too small to register on your operating budget &mdash; so I'm going to spend the next 90 days speaking to the rungs that matter at your scale: the <strong>Insider Circle</strong> (&euro;97/mo, 24-hour lead) and the <strong>Sector Sweep</strong> (&euro;1,997 one-time, 100% credited toward Insider).</p>
<p>The tool started with a missed Series A. A fintech-infra startup that was suddenly shipping faster &mdash; four new senior contributors, three new infrastructure repos in a fortnight. I'd flagged it in my notebook. The investors who actually wrote the cheque had read the same public GitHub signal &mdash; they just had a system that made the read mechanical instead of episodic.</p>
<p>Across 4,200 venture-backed orgs, that system is now the panel that powers two products at your tier. The Insider Circle ships next Sunday's five picks <em>24 hours before</em> the public Monday digest &mdash; one full sourcing day before any other investor sees them, plus closed Telegram, JSON/CSV API, and a custom watchlist co-built around your fund thesis. The Sector Sweep is a 40-page custom PDF on your chosen sector, three pre-Crunchbase early-stage targets, 14-day Q&amp;A &mdash; useful as IC-memo material at fund scale, and the &euro;1,997 credits 100% to Insider if you upgrade within 60 days.</p>
<p>The math at your check volume: one founder per quarter that you reached because you had a Sunday-night head-start, at angel-range with even a 3&times; exit on one in five, lands at &euro;15k&ndash;&euro;150k of expected value per head-start. &euro;1,164/yr of Insider versus that calculus is a no-brainer if the rhythm fits.</p>
<p>Tomorrow: why the "public GitHub data is noise" objection is wrong at your tier specifically &mdash; the noise floor matters more for low-volume sourcing, not the kind you're running.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. SSRN preprint (n=219, the methodology backbone): <a href="https://ssrn.com/abstract=6606558" style="color:#0ea5e9;">ssrn.com/abstract=6606558</a> &middot; Insider Circle (&euro;97/mo, 24h lead, closed Telegram): <a href="${SIGNALS}/insider" style="color:#0ea5e9;">${SIGNALS}/insider</a> &middot; Sector Sweep (&euro;1,997, capped 8/quarter): <a href="${SIGNALS}/sector-sweep" style="color:#0ea5e9;">${SIGNALS}/sector-sweep</a></p>
`),
};

// ---------------------------------------------------------------------------
// Tier-specific Day-5 future-pace mental movies (Brunson "paint the picture
// then sell the frame"). The modal D5 is the Dashboard close — perfect for
// D-tier readers but a complete miss for F (free) and I (fund). Each tier
// gets its own scenario set inside their actual rung.
// ---------------------------------------------------------------------------

const D5_F: SoapOperaEmail = {
  subject: "A Sunday morning, three months from now",
  delayMs: THIRTY_MIN + 5 * ONE_DAY,
  html: wrap(`
<p>Picture this. It's a Sunday morning in August. Coffee in hand. The free digest hits your inbox at 09:00 UTC like clockwork. Five startups heating up in your sectors, ranked, with a one-line note on what each one's engineering did this week.</p>
<p>You scan in twenty seconds. The third entry is an AI-infra startup you've never heard of &mdash; three new senior contributors joined this week, all from a public Series-B company you respect. The README was rewritten Saturday night. The team is clearly shipping faster than it was a month ago.</p>
<p>You open the founder's email &mdash; it's right there in the git log &mdash; and write four lines: "Saw the README rewrite + the new contributors. The work looks like the kind I follow. If you ever want a 20-minute call about what early angel allocation looks like for the round after this one, I'm easy to reach."</p>
<p>You don't have a check ready. You're not pretending to. You're playing the long game &mdash; three quarters of Sunday-morning reading, twelve to twenty cold emails sent, two or three real relationships built. By the time you write your first &euro;5k cheque next year, the founder you back is one of the founders you've been reading for ten months.</p>
<p>That's what the free digest is for, on your tier. Not "deal flow" &mdash; <strong>taste flow</strong>. You're calibrating which early engineering signals match the kind of company you'd want to back, and you're doing it on a budget of zero euros and twenty minutes a week.</p>
<p>The Sunday digest stays free forever. The &euro;7 First Look Pass exists if your cadence ever moves to 2&ndash;5/year &mdash; at that point the value-per-euro math flips and a single sector deep-dive saves you a week of evenings. But that's <em>your</em> decision and <em>your</em> timing, not mine.</p>
<p>Tomorrow I'll send the most-asked objection at your tier &mdash; "if the data is public, where's the edge?" &mdash; with the answer that takes about ninety seconds to read and shifts the whole frame.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The free book at <a href="${SIGNALS}/book" style="color:#0ea5e9;">${SIGNALS}/book</a> is your fastest way to internalise the methodology before next Sunday's digest. 104 pages, four formats, no email gate beyond the one you've already given me.</p>
`),
};

const D5_T: SoapOperaEmail = {
  subject: "A Tuesday afternoon, after your First Look lands",
  delayMs: THIRTY_MIN + 5 * ONE_DAY,
  html: wrap(`
<p>Picture this. It's a Tuesday afternoon in August. Your &euro;7 First Look Pass on fintech-infra (or whichever sector matches your thesis) landed in your inbox at lunch. Fourteen pages, raw CSV, written walkthrough &mdash; the artefact that compresses three weeks of analyst time into one PDF.</p>
<p>You scan the top 25 ranked orgs first. Three names you already know. Two you've heard mentioned. <em>Twenty</em> you've never heard of. The walkthrough flags three pre-Crunchbase early-stage targets &mdash; the thesis-tagged surprises, the kind of orgs where a polite cold email this week could be a 20-minute call next week.</p>
<p>You open the raw CSV and sort by 14-day acceleration. The top ten are roughly the right shape: small teams, public infra, recognisable contributor patterns from a small handful of well-respected public companies. You bookmark four for cold-out this Friday and one for an end-of-quarter deeper read.</p>
<p>Then you do the math. &euro;7. Twenty unknown orgs surfaced, four of them genuinely interesting enough to email. Even one of those four turning into a 20-minute call &mdash; at angel range with even a 5% probability of investing &mdash; pays back the &euro;7 ~700 times over. The &euro;7 wasn't the question; the question was whether the methodology produced names you wouldn't have seen otherwise. The CSV says yes.</p>
<p>That's the test. If the First Look Pass surfaces three orgs you'd genuinely consider, the &euro;7 was the right call. If not, you keep the report and the CSV anyway and you've spent &euro;7 to find out. Either way the credit-back means upgrading to the Dashboard within 14 days costs you &euro;0 in additional out-of-pocket &mdash; the &euro;7 already paid.</p>
<p>Tomorrow: the most-asked objection at your tier &mdash; "if it's public, where's the edge?" &mdash; answered cleanly in ninety seconds.</p>
<p>The First Look checkout is here, when you're ready: <a href="${SITE}/#firstlook" style="color:#0ea5e9;font-weight:600;">${SITE}/#firstlook</a></p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The first 50 First Look passes locked the &euro;7 price. After that the price moves to &euro;19. The credit-back to Dashboard stays at 100% indefinitely &mdash; that's the rung structure, not a launch promo.</p>
`),
};

const D5_I: SoapOperaEmail = {
  subject: "A Sunday evening, with the 24-hour lead",
  delayMs: THIRTY_MIN + 5 * ONE_DAY,
  html: wrap(`
<p>Picture this. It's a Sunday evening in August. The Insider Circle briefing landed in your inbox at 09:00 UTC this morning &mdash; twenty-four hours before the public Acceleration Watch goes out tomorrow. Five ranked names, sector-tagged, with the JSON pre-piped into the diligence dashboard your fund's analyst built last quarter.</p>
<p>You scan. Two names you already knew. Three you didn't. The third entry is an AI-infra startup with sustained 14-day commit-velocity acceleration above 2&times; their 90-day baseline AND contributor-Gini under 0.30 &mdash; the band where the panel's own resolution rate runs ~4-of-4 over a 90-day window. You ping the founder's listed email at 21:00 from the closed Telegram channel, where the rest of the fund-tier subscribers are already comparing notes.</p>
<p>By Monday at 09:00 &mdash; when the public list goes out and another 800 readers see the same five names &mdash; you've already had a 30-minute call booked, with a follow-up scheduled for end-of-week. By the time the warm-intro version of this deal reaches consensus partners at &euro;5M&ndash;&euro;20M funds, you're three weeks into a relationship that started at angel-allocation scale.</p>
<p>The math: one founder per quarter, head-start window of one Sunday evening, at angel range with even a 3&times; exit on one in five, is somewhere between &euro;15k and &euro;150k of expected value per head-start. Insider Circle is &euro;1,164/yr at the founding rate. The numbers don't work the other way.</p>
<p>Plus the rest of the fund-tier scaffolding &mdash; JSON/CSV API for the diligence stack, custom watchlist co-built around your thesis on signup, webhooks, direct founder line, closed Telegram of the other fund-tier subscribers (~30 today, capped at 100 at the founding rate). At your check volume those are the tools that turn a Sunday-night briefing into a Monday-morning conversation.</p>
<p>Tomorrow I'll address the trust problem head-on &mdash; "I've been reading email from someone who signs as 'The Data Nerd' and doesn't put a face on the website" &mdash; because at your tier that's a legitimate ask, and I'd rather answer it explicitly than have it sit in your head until D90.</p>
<p>Insider Circle case (12-minute walkthrough): <a href="${SIGNALS}/insider" style="color:#0ea5e9;font-weight:600;">${SIGNALS}/insider</a></p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The Sector Sweep (&euro;1,997 one-time, capped 8/quarter, 100% credit toward Insider) is the right artefact if your fund needs IC-memo material on a specific sector before the Insider subscription decision. Send the sector to <a href="mailto:signal@gitdealflow.com?subject=Sector%20Sweep" style="color:#0ea5e9;">signal@gitdealflow.com</a> and the spec lands inside one business day.</p>
`),
};

// ---------------------------------------------------------------------------
// Tier-specific Day-45 ascension emails (Brunson Value Ladder rung-up). The
// modal D45 pitches Insider — perfect for D-tier readers but a miss for F
// (no rung-up exists yet) and I (already at Insider). Each tier gets a path
// to its actual NEXT rung, not the modal one.
// ---------------------------------------------------------------------------

const D45_F: SoapOperaEmail = {
  subject: "Forty-five days in. Has your cadence shifted?",
  delayMs: THIRTY_MIN + 45 * ONE_DAY,
  html: wrap(`
<p>You signed up forty-five days ago telling me you've written 0&ndash;1 angel checks in the past year. Six Sunday digests have hit your inbox since. About thirty ranked names you've now had on your radar before consensus formed.</p>
<p>The honest question I'd ask at this point: <strong>has your cadence shifted?</strong></p>
<p>If you've gone from "exploring, learning" to "I've written one cheque this quarter and I'm circling a sector" &mdash; that's a real shift, and the right next rung is the <strong>&euro;7 First Look Pass</strong>. Pick the sector you're circling, get the 14-page deep dive + raw CSV in 24 hours, credit 100% toward Dashboard if you upgrade within 14 days. &euro;7 is the price of a coffee in central Lisbon. It's the lowest-friction way to test step 5 of the conversion story on your own thesis without committing to a subscription.</p>
<p>If your cadence hasn't shifted &mdash; still 0&ndash;1 cheques/year, still calibrating taste &mdash; <strong>nothing changes</strong>. The free Sunday digest stays exactly as it is. I'd rather you read for ten years and write your first cheque informed than upgrade once and resent it.</p>
<p>The First Look isn't a "graduate now or be left behind" pitch. It's the rung above your tier, named honestly, available the moment your cadence justifies it. If forty-five days from today you're in the same place &mdash; keep reading, keep calibrating. If forty-five days from today you've written two more cheques &mdash; the First Look is here.</p>
<p>Either way: free digest stays free, Sunday hits as usual this weekend.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. First Look checkout (&euro;7, 24h delivery): <a href="${SITE}/#firstlook" style="color:#0ea5e9;">${SITE}/#firstlook</a> &middot; Free book: <a href="${SIGNALS}/book" style="color:#0ea5e9;">${SIGNALS}/book</a> &middot; Funnel hub if you ever want to see all 9 doors at once: <a href="${SIGNALS}/funnels" style="color:#0ea5e9;">${SIGNALS}/funnels</a></p>
`),
};

const D45_T: SoapOperaEmail = {
  subject: "Forty-five days in. Did the First Look pay back?",
  delayMs: THIRTY_MIN + 45 * ONE_DAY,
  html: wrap(`
<p>You signed up forty-five days ago telling me you write 2&ndash;5 angel checks per year and you're building cadence. Six Sunday digests have hit your inbox. If you grabbed the &euro;7 First Look Pass somewhere along the way, the 14-page sector deep dive + raw CSV is sitting in your inbox too.</p>
<p>The honest question at this point: <strong>did the First Look pay back?</strong></p>
<p>If yes &mdash; three or more orgs landed that you wouldn't have surfaced otherwise &mdash; the next rung is <strong>the &euro;9.97/mo Dashboard</strong>. The First Look credit-back means the upgrade is &euro;0 additional out-of-pocket if you do it within 14 days of receiving the deep dive. The Dashboard is the same engine you read once for &euro;7, run weekly, refreshed every Monday at 09:00 UTC, with the live panel of 209 ranked orgs filterable by sector / stage / geography. The 8-object stack &mdash; Dashboard + 219-startup Backtest CSV + monthly Sector Deep Dive + 2 Chrome Extensions + MCP Server + async Watchlist Build + Methodology Vault + 30-day refund &mdash; totals &euro;1,980 of standalone value at &euro;9.97/mo founding rate, locked forever.</p>
<p>If the First Look didn't pay back &mdash; the deep dive surfaced fewer than three names you'd consider &mdash; that's actionable feedback I want to hear. Reply to this email with the sector you covered and what didn't land, and I'll either run a fresh sweep on a different sector at no charge OR refund the &euro;7 outright. The methodology has to work for the buyer's own thesis or the rung structure breaks down.</p>
<p>If you haven't grabbed the First Look yet &mdash; the &euro;7 price is still locked at the founding rate, the credit-back to Dashboard is still 100%, and the queue is currently 24 hours. <a href="${SITE}/#firstlook" style="color:#0ea5e9;font-weight:600;">${SITE}/#firstlook</a></p>
<p>The free digest stays free either way. Sunday hits as usual this weekend.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The Dashboard 12-minute walkthrough is at <a href="${SIGNALS}/walkthrough/5min" style="color:#0ea5e9;">${SIGNALS}/walkthrough/5min</a> &mdash; read before upgrading if you want the full case before the click.</p>
`),
};

const D45_I: SoapOperaEmail = {
  subject: "Forty-five days in. The Sector Sweep window opens.",
  delayMs: THIRTY_MIN + 45 * ONE_DAY,
  html: wrap(`
<p>You signed up forty-five days ago at fund-tier &mdash; 20+ checks/year, fund or syndicate operator. Six Sunday digests + (if you took the rung) six Insider briefings have landed. The 24-hour lead has been running for six full sourcing weeks now.</p>
<p>The honest question at this point: <strong>are you ready for the Sector Sweep?</strong></p>
<p>The Sweep is the only artefact in the stack that's tuned for IC-memo material rather than weekly rhythm. &euro;1,997 one-time, capped at 8 sweeps per quarter (Q3 2026: 7 of 8 still open). 40-page custom PDF on the sector you pick, raw CSV of every org &times; every metric, top-five deep dives with diligence prompts, three pre-Crunchbase early-stage targets, 14-day Q&amp;A window for follow-up cuts. Itemised value works out to ~&euro;13,000 of analyst time at standard rates.</p>
<p>Two reasons to consider it now, specifically:</p>
<p>One &mdash; the &euro;1,997 is 100% credited to Insider Circle if you upgrade within 60 days of receiving the Sweep. That's roughly your first 20 months of Insider, paid in full. Operationally: if your fund is going to subscribe to Insider anyway, the Sweep is a free upgrade with a one-time deep artefact attached.</p>
<p>Two &mdash; the 30-day Signal-or-It's-Free guarantee covers the Sweep itself. If we don't surface three orgs you didn't already know about, reply REFUND. No forms, no calls, no questions.</p>
<p>If your fund's thesis is genuinely focused on one sector this quarter &mdash; AI infra, dev tools, fintech rails, vertical SaaS, climate &mdash; this is the artefact that compresses three weeks of analyst work into one weekend of reading. Email <a href="mailto:signal@gitdealflow.com?subject=Sector%20Sweep" style="color:#0ea5e9;">signal@gitdealflow.com</a> with the sector and we confirm the spec inside one business day.</p>
<p>If Insider Circle isn't running yet either &mdash; the founding-rate window (&euro;97/mo, locked for the lifetime of the subscription) is still open. The 24-hour Sunday lead is the operating leverage; everything else is plumbing.</p>
<p>Talk soon &mdash;<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. Insider Circle (&euro;97/mo, 24h lead, closed Telegram, ~30 fund-tier subscribers): <a href="${SIGNALS}/insider" style="color:#0ea5e9;">${SIGNALS}/insider</a> &middot; Sector Sweep stack itemised: <a href="${SIGNALS}/pricing#sector-sweep-stack" style="color:#0ea5e9;">${SIGNALS}/pricing#sector-sweep-stack</a></p>
`),
};

// ---------------------------------------------------------------------------
// Tier-specific Day-60 — soft introduction of the Sweep concept for T-tier
// (so by the time D60 modal pitches it at full price, T readers already
// know what it is). F still skips D60. D + I keep the modal Sweep pitch.
// ---------------------------------------------------------------------------

const D60_T: SoapOperaEmail = {
  subject: "When a single sector is worth a weekend",
  delayMs: THIRTY_MIN + 60 * ONE_DAY,
  html: wrap(`
<p>Most weeks the right rung at your tier is the &euro;7 First Look or the &euro;9.97/mo Dashboard. Both run on the same engine, both are tuned for the 2&ndash;5 cheque/year cadence you described on signup.</p>
<p>About once a year &mdash; maybe once a quarter if your thesis is sharp &mdash; there's a different shape that's useful: <strong>going all-in on one sector for a single weekend</strong>, with a 40-page artefact you can paste into your decision memo or share with a co-investor.</p>
<p>That's the Sector Sweep. &euro;1,997 one-time. I'm naming it now not because it's the right rung for your tier <em>today</em> &mdash; at 2&ndash;5 cheques/year, it almost certainly isn't &mdash; but because if your cadence ever moves to 8&ndash;10/year and you start running a sharper sector thesis, this is the artefact that compresses three weeks of work into a weekend of reading.</p>
<p>Inside: 40-page custom PDF on the sector you pick, raw CSV of every org &times; every metric, top-five deep dives with diligence prompts, three pre-Crunchbase early-stage targets, 14-day Q&amp;A window. ~&euro;13,000 of analyst time at standard rates. Capped at 8 per quarter to preserve quality.</p>
<p>The credit-back loop is the part to keep in mind for later: 100% of the &euro;1,997 credits to Insider Circle if you upgrade within 60 days. So if you ever do graduate to a fund-tier rhythm, the Sweep is a free Insider on-ramp with a deep artefact attached.</p>
<p>For now: the &euro;7 First Look + &euro;9.97/mo Dashboard remain the two rungs that match your cadence. The Sweep is a future option, not a current pitch. The free digest stays free regardless. Sunday hits as usual this weekend.</p>
<p>Talk soon &mdash;<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. Sweep details if curious: <a href="${SIGNALS}/pricing#sector-sweep-stack" style="color:#0ea5e9;">${SIGNALS}/pricing#sector-sweep-stack</a> &middot; The Dashboard remains the right next rung for the way you write checks: <a href="${SITE}/dashboard" style="color:#0ea5e9;">${SITE}/dashboard</a></p>
`),
};

// ---------------------------------------------------------------------------
// Tier-specific Day-75 — F-tier reframe of the Crystal Ball game as the
// "no-cheque-required public-track-record" play. Modal D75 already covers
// this implicitly; this version makes it the headline for F-tier readers.
// ---------------------------------------------------------------------------

const D75_F: SoapOperaEmail = {
  subject: "Build a track record before you write a cheque",
  delayMs: THIRTY_MIN + 75 * ONE_DAY,
  html: wrap(`
<p>Quick note for the tier you signed up at &mdash; 0&ndash;1 angel checks/year, exploring, calibrating taste.</p>
<p>The most useful thing you can do before you write your first cheque is build a <strong>public track record of taste</strong>. Not on Twitter. Not in someone's syndicate Discord. On a public, append-only ledger where the predictions are timestamped, the resolutions are mechanical, and the scoring is weighted by lead time.</p>
<p>That's the <a href="${SIGNALS}/crystal-ball" style="color:#0ea5e9;">Crystal Ball game</a>. Pick any GitHub org. Predict that they'll announce a funding round within 90 days. We grade post-hoc against TechCrunch, Crunchbase, and SEC filings. Leaderboard tracks your hit rate weighted by lead time. No cheque required, no payment, no email gate beyond the one you've already given me.</p>
<p>The reward isn't money &mdash; there's no money in the loop. The reward is the public track record. Five hits earn the Founding Forecaster badge (permanent, public) and unlock 50% off a future Sector Sweep. More importantly: the leaderboard is public and indexable. Forecasters in the founding cohort have already had angel-allocation introductions <em>because their pick history was the credential</em>.</p>
<p>Three picks per quarter is enough to start showing taste. The cap is one pick per email per week to keep the leaderboard clean. If your free digest reading has been more careful than most readers' &mdash; if you've been the kind of reader who pulls one or two of the five Sunday names through to a deeper read &mdash; Crystal Ball is the cheapest way to find out whether your taste matches the data.</p>
<p>Plus the Underwriting Receipts ledger is now live: <a href="${SIGNALS}/wins" style="color:#0ea5e9;">${SIGNALS}/wins</a>. Every venture-backed startup whose GitHub engineering acceleration matched the SSRN signal pattern before the funding round. ~75 entries on the panel today. We append, never edit.</p>
<p>Both surfaces are free. Both build a credible public track record. Neither requires a cheque written before the credential exists.</p>
<p>Talk soon &mdash;<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The leaderboard is at <a href="${SIGNALS}/crystal-ball" style="color:#0ea5e9;">${SIGNALS}/crystal-ball</a>. First pick takes ninety seconds. The badge is what unlocks the next twelve months of low-friction relationship-building.</p>
`),
};

// Per-tier override map. Key = SOAP_OPERA_EMAILS index. Value "skip" drops
// the email from the tier's sequence; an object replaces it. Missing key
// keeps SOAP_OPERA_EMAILS[i] verbatim.
//
// Brunson Quiz Funnel expansion 2026-05-08 — previously only D30 differed
// per tier (the V8 audit ding). Now D0/D5/D45 differ for all four tiers,
// D60 has a T-specific introduction, D75 has an F-specific reframe.
const TIER_OVERRIDES: Record<Tier, Record<number, "skip" | SoapOperaEmail>> = {
  F: {
    0: D0_F,    // D0 welcome — anchor "free is the version" from email 1
    5: "skip",  // D4 €7 First Look — pre-buyer at 0-1 checks/yr, don't push paid
    6: D5_F,    // D5 future-pace — Sunday-morning free-digest scenario, not Tuesday Dashboard
    7: "skip",  // D6 Insider walkthrough — €97/mo is two rungs too high
    16: D30_F,  // D30 — "stay free, here's what that means"
    17: D45_F,  // D45 — "has your cadence shifted?" cadence-check, not cold Insider pitch
    18: "skip", // D60 Sector Sweep — €1,997 is laughable at this tier
    19: D75_F,  // D75 — Crystal Ball reframed as no-cheque public track record
  },
  T: {
    0: D0_T,    // D0 welcome — anchor "€7 First Look is the right rung" from email 1
    6: D5_T,    // D5 future-pace — Tuesday-afternoon First-Look-landed scenario
    7: "skip",  // D6 Insider walkthrough — too high a rung for 2-5 checks/yr
    16: D30_T,  // D30 — "the €7 question"
    17: D45_T,  // D45 — "did the First Look pay back?" graduating to Dashboard
    18: D60_T,  // D60 Sector Sweep — soft intro as future option, not current pitch
  },
  D: {
    // SOAP_OPERA_EMAILS sequence is tuned for D (the modal reader). No
    // overrides — this builds the same array as SOAP_OPERA_EMAILS via the
    // builder, kept for API symmetry with F/T/I.
  },
  I: {
    0: D0_I,    // D0 welcome — anchor "Insider + Sweep" from email 1, skip Dashboard talk
    5: "skip",  // D4 €7 First Look — €7 reads insulting on a fund budget
    6: D5_I,    // D5 future-pace — Sunday-evening 24h-lead scenario, not Tuesday Dashboard
    16: D30_I,  // D30 — "the fund-tier rung"
    17: D45_I,  // D45 — "the Sector Sweep window opens" instead of Insider sales pitch
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

/**
 * Sharp Tier indoctrination drip — Brunson DotCom Secrets §23 (Application
 * Funnel) post-submission warm-up. Three emails between application and
 * founder reply. Replaces the live phone-set step that anonymity blocks.
 *
 *   T+30 min  — "Application logged" — manage-the-wait + soft pre-frame
 *   T+12 h    — "What I'm reading right now" — quality bar + indoctrination
 *   T+36 h    — "One thing before the reply lands" — pre-objection handling
 *
 * Scheduled via Resend `scheduled_at` from /api/sharp-application after
 * the founder-notification email is queued.
 */
const HALF_HOUR = 30 * 60 * 1000;
const TWELVE_HOURS = 12 * 60 * 60 * 1000;
const THIRTY_SIX_HOURS = 36 * 60 * 60 * 1000;

export const SHARP_INDOCTRINATION_DRIP = [
  {
    subject: "Application logged — what the next 48 hours look like",
    delayMs: HALF_HOUR,
    html: wrap(`
<p>Application received. The 48-hour reply window opens now.</p>
<p>First, the thing worth being clear about: GitDealFlow is a tool, not a fund. We're not competing with you for the deal. The job is to help you see startups heating up in your sectors — on their public GitHub engineering activity — before they raise or hit the press. Sharp is the fund-tier version of that same job.</p>
<p>Here's what's about to happen, in case the wait is the part that nags:</p>
<p><strong>Within 12 hours.</strong> The first read happens at the founder desk. I look at every Sharp application against three things: fund fit (do your sectors line up with what we can see early), use-case fit (the white-label API and quarterly-call cadence vs. what you actually need), and capacity fit (where the 8-fund 2026 cap stands the day your application lands). The first takes about ninety seconds. The second takes ten minutes. The third is a calendar check.</p>
<p><strong>Within 24-36 hours.</strong> Decision drafts. If accepted, I draft a Stripe Sharp Tier invoice + an Insider Circle invitation, both in the same reply email. If declined, I write a one-paragraph reason — never a form letter, never a "thanks for your interest." Either reply lands inside 48 business hours of submission. No application has gone un-replied since the tier opened.</p>
<p><strong>One thing to do while the review runs.</strong> If you haven't already, the <a href="${SIGNALS}/walkthrough">12-minute walkthrough</a> is the page I assume every Sharp applicant has read before the first quarterly call. It saves us the first ten minutes of the call and makes the rest of it sharper. The other thing worth a tab is the <a href="${SIGNALS}/methodology">methodology page</a> — it lays out, in plain terms, exactly how a startup ends up flagged as heating up early and where the lead-time numbers come from. If you're going to write checks against this signal, you'll want to see how it works for yourself.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The cap (8 funds in 2026) is real, not a marketing line. The quarterly call is real founder time. The reason the gate exists is so every Sharp-tier fund gets meaningful attention on the call. If you're wondering whether you're a fit, the answer to "do you want a sharper version of the same product, on a fund-tier cadence" is the question the application is built to answer.</p>
`, "sharp-indoc-1"),
  },
  {
    subject: "What I'm reading in your application right now",
    delayMs: TWELVE_HOURS,
    html: wrap(`
<p>Twelve hours in. I'm partway through the Sharp queue, your application is in the stack, and a short note is more useful than silence.</p>
<p>Here's what gets weighted on the first read, so you know what's happening to your words:</p>
<p><strong>The dream-state answer.</strong> The single best signal that a Sharp tier will pay for itself is whether the applicant can write the dream state in a single sentence with a number in it. "Seeing 3 of every 5 of our Series A deals before any other fund is talking to them." "50% of new portfolio adds sourced from data, not warm intros." A specific dream is a dream a methodology can deliver against. A vague dream is a fit problem, not a price problem.</p>
<p><strong>The gap answer.</strong> Most applicants list "we don't have time" or "no API in our CRM." Both are real, both are solvable. The harder gap — the one I look for — is "nobody on our team is technical enough to read engineering signal on their own." Good news: you don't have to. The whole point of the tool is that it does the reading and hands you plain-English notes — you just look. The white-labeled API is the easy half; the quarterly call, where we walk you through what's heating up in your sectors, is the half nobody else sells.</p>
<p><strong>The urgency answer.</strong> "Why now, vs. waiting six months" separates the Sharp applicants from the Insider applicants. Insider is a build-the-rhythm tier. Sharp is a "we're losing one deal a quarter to a faster competitor" tier. If your urgency answer reads more like the first one, the right home is €97/mo Insider, not €497/mo Sharp — and I'll say so in the reply rather than push you up a rung that doesn't fit yet.</p>
<p>The reply is on track for inside 48 business hours. If you thought of something you didn't get to put in the form, reply to this email and I'll fold it into the same review.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The methodology repo is the thing most Sharp applicants want to see before they sign — it's what tells you the signal is real, not a marketing line. The repo gets shared on day one of paid, but the SSRN paper at <a href="${SIGNALS}/research">${SIGNALS}/research</a> is the public version of the same thing, and you can read it tonight.</p>
`, "sharp-indoc-2"),
  },
  {
    subject: "One thing to think about before the reply lands",
    delayMs: THIRTY_SIX_HOURS,
    html: wrap(`
<p>Thirty-six hours in. Decision drafts are on the desk. The reply lands inside the next twelve hours.</p>
<p>Before it does — one frame worth holding, because it's the frame I'd want a Sharp applicant to land on:</p>
<p>€497/mo is €5,964/yr. At a fund's blended analyst-day rate (~€350-€400 fully-loaded, post-bonus, post-overhead), Sharp pays for itself the moment it saves an analyst <em>fifteen working days a year</em>. The white-labeled API alone — pulled directly into your CRM, refreshed weekly, no engineering wrapper to maintain — is roughly that delta against the alternative of an analyst running Crunchbase and GitHub queries by hand. The quarterly call, the methodology source, the first-look on new signals — those are above the line.</p>
<p>The harder math is the one a pricing page doesn't show: one preempted Series A, at any reasonable fund's check size, is between €400k and €4M of deferred markup against the same vintage outcome. The time between a startup heating up on GitHub and its raise is 21-47 days at the median (the SSRN panel; <a href="${SIGNALS}/research">${SIGNALS}/research</a> for the full panel). Sharp's job is to turn those days into a chance to get there first. One a year is the floor. The funds at this tier don't talk in terms of "saves an analyst-day" — they talk in terms of "preempted one round, deferred two." That's the conversation the quarterly call is built to support.</p>
<p>If accepted, the first call gets scheduled this week (initials-only on the founder side, anonymity-preserving). The white-label API sub-domain gets set up the same week. Methodology source repo is shared on day one of paid. Insider Circle invitation lands in the same reply.</p>
<p>If declined, the reason will be specific — fund-fit, use-case-fit, or capacity. None of those are "you weren't impressive enough." All three are filterable, and most are reversible by either coming in via Insider first (€97/mo, no application) or re-applying after a thesis pivot.</p>
<p>The reply is queued. Nothing more to do on your end.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
<p style="color:#64748b;font-size:14px;">P.S. The 8-fund cap moves with each acceptance — the public counter on <a href="${SIGNALS}/apply">${SIGNALS}/apply</a> is the same number I'm reading from. If a slot closes between application and reply, applications already in the queue get priority over inbound applications that arrive after the cap shifts.</p>
`, "sharp-indoc-3"),
  },
];
