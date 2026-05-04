/**
 * Soap Opera Sequence — 5 emails as HTML.
 * Each entry has: subject, html, delayMs (from verification time).
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
  {
    subject: '"GitHub data is noise" (here\'s why that\'s wrong)',
    delayMs: THIRTY_MIN + ONE_DAY,
    html: wrap(`
<p>When I tell investors I use GitHub to source deal flow, the first response is almost always the same:</p>
<p><em>"Isn't that just noise?"</em></p>
<p>Fair question. Raw GitHub data is noisy. Commit counts alone tell you nothing. A bot can inflate them. A hackathon can spike them. A single developer pushing config files looks the same as a team shipping features.</p>
<p>But here's what changes everything: we don't look at absolute numbers. We look at <strong>acceleration patterns</strong>.</p>
<p>When a company's engineering velocity deviates sharply from its own baseline, that's not noise. That's a regime change. Something happened inside that company. They hired. They found product-market fit. They're preparing to launch.</p>
<p>In our analysis across 500 startups, companies that showed a 2x contributor spike within 14 days had a strong correlation with a fundraise or major product launch within 60 days.</p>
<p>The signal is there. You just need the right lens.</p>
<p>Tomorrow, I want to talk about something uncomfortable: why your network might be showing you yesterday's deals.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
`),
  },
  {
    subject: "Why your network is showing you yesterday's deals",
    delayMs: THIRTY_MIN + 2 * ONE_DAY,
    html: wrap(`
<p>Your network is valuable. I'm not going to pretend it isn't.</p>
<p>But here's the uncomfortable truth: your network shows you what other investors are already seeing.</p>
<p>By the time a warm intro reaches you, the founder has probably talked to 3 to 5 other investors. The deck is circulating. The terms are forming. You're competing on reputation and speed, not on information.</p>
<p>The deals that generate outsized returns are the ones where you arrive before consensus forms. Before the deck exists. Before the company is "hot."</p>
<p>That's the window VC Deal Flow Signal opens.</p>
<p>When a startup's engineering is accelerating but their fundraise hasn't started, there's a gap. Maybe 2 to 4 weeks. In that gap, you can reach out first. You can offer help before they need money. You can build a relationship before everyone else is trying to.</p>
<p>Your network gets you to the table. This gets you there first.</p>
<p>Next email: I'll break down why "public data can't give you an edge" is the most expensive belief in venture.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
`),
  },
  {
    subject: "Public data, private edge: a new way to source deals",
    delayMs: THIRTY_MIN + 4 * ONE_DAY,
    html: wrap(`
<p>"If the data is public, where's the edge?"</p>
<p>This is the most common objection I hear. And it reveals a misunderstanding about how edges actually work.</p>
<p>Everyone has access to SEC filings. Quant funds still make billions parsing them faster and smarter than everyone else.</p>
<p>Everyone has access to satellite imagery. Hedge funds use it to count cars in parking lots and predict quarterly earnings.</p>
<p>The edge isn't in having exclusive data. <strong>The edge is in reading what others ignore.</strong></p>
<p>Right now, zero investor tools package GitHub activity as a deal flow signal. The data is public. The analysis layer doesn't exist. That gap is your edge, and it stays your edge until the market catches up.</p>
<p>Think about it: how many investors in your network are monitoring GitHub commit velocity right now? How many have a system that flags engineering acceleration across hundreds of startups?</p>
<p>The answer is probably zero. That's the definition of an edge.</p>
<p>Tomorrow, I'll share exactly what the Pro dashboard looks like and how investors are using it.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
`),
  },
  {
    subject: "What commit velocity tells you that pitch decks can't",
    delayMs: THIRTY_MIN + 7 * ONE_DAY,
    html: wrap(`
<p>You've been getting the free digest. Here's what the full Dashboard shows.</p>
<p>The Dashboard (EUR 9.97/mo, early access) gives you the full picture:</p>
<p>85+ startups ranked by engineering acceleration across 20 sectors. Not a static list. A living dashboard where companies move up and down based on real GitHub API data, refreshed weekly.</p>
<p>You can filter by:</p>
<ul>
<li>Sector (fintech, devtools, AI/ML, cybersecurity, healthcare, and 15 more)</li>
<li>Stage (pre-seed, seed, Series A/B, growth)</li>
<li>Geography (US, EU, APAC)</li>
</ul>
<p>Each startup shows:</p>
<ul>
<li>Commit velocity (14-day rolling window)</li>
<li>Velocity change vs previous period</li>
<li>Contributor count and growth rate</li>
<li>New repo creation signals</li>
<li>Signal type classification</li>
</ul>
<p>What pitch decks tell you: what the founder <em>wants</em> you to believe.<br>
What commit velocity tells you: what the engineering team is <em>actually doing</em>.</p>
<p>One is a narrative. The other is behavior.</p>
<p><a href="${SIGNALS}" style="color:#0ea5e9;">See the live data &rarr;</a></p>
<p><a href="${SITE}/#pricing" style="color:#0ea5e9;">Upgrade to the full Dashboard &rarr;</a></p>
<p>If the free digest is enough for now, that's fine too. You'll keep getting it every week.</p>
<p>Talk soon,<br>${FROM_NAME}</p>
`),
  },
];
