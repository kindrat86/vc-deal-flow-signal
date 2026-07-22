/**
 * 30-Day Deal Flow Reset Challenge — single source of truth.
 *
 * Structure:
 *   Week 1 (Days 1-7)   — Learn: each of the 7 atomic signals.
 *   Week 2 (Days 8-14)  — Apply: run the composite on real candidates.
 *   Week 3 (Days 15-21) — Synthesize: build your watchlist + weekly rhythm.
 *   Week 4 (Days 22-30) — Operationalize: alerts, sharing, scaling.
 *
 * Used by:
 *   - /challenge (landing)               app/challenge/page.tsx
 *   - /challenge/[day] (D1-D30 SSG ref)  app/challenge/[day]/page.tsx
 *   - /challenge/done (graduation)       app/challenge/done/page.tsx
 *   - 30-day drip (CHALLENGE_EMAILS)     lib/emails.ts
 *
 * Brunson Challenge Funnel (DotCom Secrets Ch 19, Traffic Secrets Ch 19) —
 * every day must:
 *   - Open with yesterday-recap (continuity)
 *   - Teach or apply a single thing (one belief, one procedure)
 *   - Close with tomorrow-teaser (open loop)
 *   - Include a tangible "win" the subscriber can show themselves
 *   - Quote a retail-equivalent value (Stack-Slide anchor for Day 30 reveal)
 *
 * Phase semantics for /challenge/[day] presentation:
 *   - phase: "learn"        — Week 1 (Days 1-7), atomic signals
 *   - phase: "apply"        — Week 2 (Days 8-14), composite on real orgs
 *   - phase: "synthesize"   — Week 3 (Days 15-21), watchlist + cadence
 *   - phase: "operationalize" — Week 4 (Days 22-30), alerts + sharing
 */

export type ChallengePhase = "learn" | "apply" | "synthesize" | "operationalize";

export type ChallengeDay = {
  day: number;
  slug: string;
  phase: ChallengePhase;
  title: string;
  oneLine: string;
  whyItMatters: string;
  procedure: readonly string[];
  filterFor: string;
  edgeCase: string;
  bonus?: string;
  yesterdayRecap: string | null;
  tomorrowTeaser: string;
  retailValue: number; // EUR — used to anchor the D30 Stack Slide
};

export const CHALLENGE_DAYS: readonly ChallengeDay[] = [
  {
    day: 1,
    slug: "commit-velocity",
    phase: "learn",
    title: "Commit velocity",
    oneLine: "The simplest acceleration signal — 14-day vs 90-day ratio.",
    whyItMatters:
      "Commit velocity tells you whether the engineering team is shipping more in the last 14 days than they have on average over the last 90. Sustained acceleration precedes hiring, which precedes a fundraise.",
    procedure: [
      "Open the GitHub org you picked yesterday.",
      "Click the most-active repo.",
      "On the repo home, click Insights → Pulse → 1 month.",
      "Note: commits in the last week, commits in the last month.",
      "Now click 3 months. Note: commits in the last quarter.",
      "Compute: (weekly × 4) ÷ (monthly) and (monthly × 3) ÷ (quarterly).",
    ],
    filterFor:
      "Both ratios above ~1.3 — the team is accelerating. Both above 1.5 — the acceleration is sharp enough to be worth a closer look.",
    edgeCase:
      "For orgs with 50+ repos, do this on the top 3 repos by recent activity, not just one. You're trying to read the org-level signal, not a single-repo blip.",
    bonus:
      "A bot or a hackathon spikes for a week and reverts. A team that has hired or found product-market fit accelerates and stays accelerated. Sustained > spike.",
    yesterdayRecap: null,
    tomorrowTeaser:
      "Tomorrow: contributor diversity — why a single-bus-factor codebase tanks the round.",
    retailValue: 79,
  },
  {
    day: 2,
    slug: "contributor-diversity",
    phase: "learn",
    title: "Contributor diversity",
    oneLine: "The bus-factor signal — Gini coefficient at month -3.",
    whyItMatters:
      "In the panel of 219 funded rounds, startups that closed had a contributor-diversity Gini of ~0.34 at month -3. Startups that did not close had ~0.61. More distributed codebases close more rounds.",
    procedure: [
      "Open the org's most-active repo.",
      "Click Insights → Contributors. Set the date range to the last 90 days.",
      "Count: how many contributors have ≥10 commits over 90 days?",
      "Look at the top contributor's share. Is it > 50% of total commits? > 80%?",
    ],
    filterFor:
      "A team where the top contributor is <50% of the volume and at least 4 people have 10+ commits. That's a real engineering team. Anything else is one founder with a side project, or a consultancy.",
    edgeCase:
      "Mono-repo orgs concentrate everything in one repo and look more diverse than they are. Cross-check with the org-level contributor list at github.com/orgs/[org]/people if it's public.",
    bonus:
      "A single-bus-factor codebase means the round is essentially funding one person's salary. A 4-person codebase is funding a team. The contract value, the dilution math, and the diligence story are all different.",
    yesterdayRecap:
      "Yesterday you read commit velocity. Today's signal layers on top: even sharp acceleration concentrated in one committer is a different bet than sharp acceleration spread across four.",
    tomorrowTeaser:
      "Tomorrow: the dependents graph — who's already building on top of this startup's code.",
    retailValue: 79,
  },
  {
    day: 3,
    slug: "dependents-graph",
    phase: "learn",
    title: "Dependents graph",
    oneLine: "The hidden GitHub page — cheapest external-adoption proxy.",
    whyItMatters:
      "Most investors don't know GitHub exposes dependents. The dependents graph shows you every public repo that depends on this startup's code — the cheapest proxy for 'is anyone actually using this'.",
    procedure: [
      "Open the org's flagship repo (the one in their README, or the most-starred).",
      "Click Insights → Dependency graph → Dependents.",
      "If the page exists: count the dependents, look at the names.",
      "If the page is empty or missing: the package is private or pre-distribution. Note that.",
    ],
    filterFor:
      "Dependents that are not the startup's own repos. Real external usage means real adoption. A few hundred external dependents on a developer-tools startup is a strong product-market-fit signal even if revenue is zero.",
    edgeCase:
      "Some orgs use private package registries (npm scoped, internal PyPI). Dependents won't show — that's a sign of enterprise distribution, not weakness. Cross-check with npm-stat.com or pypistats.org if a public package exists.",
    bonus:
      "Cross-reference the dependents list against your portfolio's GitHub orgs. If two of your portfolio companies are already using this startup's code, that's a warm-intro vector your AngelList syndicate doesn't have.",
    yesterdayRecap:
      "Yesterday's contributor-diversity reading told you whether the team is real. Today's signal tells you whether anyone outside the team cares about what they're building.",
    tomorrowTeaser:
      "Tomorrow: README freshness — the most under-rated leading indicator on this list.",
    retailValue: 89,
  },
  {
    day: 4,
    slug: "readme-freshness",
    phase: "learn",
    title: "README freshness",
    oneLine: "The cheapest leading indicator — a README rewrite is a pre-pitch.",
    whyItMatters:
      "The README is the public-facing pitch. Teams that are actively positioning for a fundraise update it. Teams that aren't, don't. A substantive README diff in the last 60 days is a tell.",
    procedure: [
      "Open the org's flagship repo.",
      "On the README file, click the file name to open it as a file.",
      "Click History. Look at the last commit to the README.",
      "Was it in the last 30 days? 60 days? Or 6+ months ago?",
    ],
    filterFor:
      "A README updated in the last 60 days, with the diff being substantive (rewritten positioning, new screenshots, updated install instructions, new 'Used by' section) rather than a typo fix.",
    edgeCase:
      "Some teams keep their README short and a separate /docs site is the real pitch surface. Check docs.* subdomains via the repo's Pages settings or the org website footer.",
    bonus:
      "A 'Funding' or 'Investors' section that just appeared. Founders who are mid-raise often add this to make outreach easier — it's a near-explicit fundraise signal.",
    yesterdayRecap:
      "Yesterday's dependents reading told you whether anyone uses the code. Today's tells you whether the team thinks anyone is about to.",
    tomorrowTeaser:
      "Tomorrow: new repo creation rate — the platform-buildout tell most useful at Series A and B.",
    retailValue: 69,
  },
  {
    day: 5,
    slug: "new-repo-creation",
    phase: "learn",
    title: "New repo creation rate",
    oneLine: "The platform-buildout tell — SDKs, CLIs, demos shipping fast.",
    whyItMatters:
      "Most useful for Series A / Series B startups. When the core product works and the team has capital, they start building the platform around it — SDKs, CLIs, internal services, documentation sites, example apps. Each one is a new public repo.",
    procedure: [
      "Open the org's main page.",
      "Click Repositories, sort by Newest.",
      "Count: how many repos created in the last 30 days? Last 90 days?",
      "Open the newest 3. What do they look like — SDKs, infra, demos?",
    ],
    filterFor:
      "3+ new repos in 30 days, where the new repos look like platform components (CLI, SDK in a new language, example app, internal microservice) rather than throwaways or test repos.",
    edgeCase:
      "A single new repo named with a year or quarter ('foo-2026', 'platform-q3') — that's a roadmap commitment in code form, often more telling than three throwaway demos.",
    bonus:
      "This is the 'deploying capital' signal. A team that just raised a Series A is hiring engineers and the first thing those engineers ship is platform code. A team about to raise often pre-builds these so the next deck has a 'platform expansion' slide.",
    yesterdayRecap:
      "Yesterday's README check told you whether the team is positioning. Today's tells you whether they're building the platform around the position.",
    tomorrowTeaser:
      "Tomorrow: issue-to-PR ratio — the engagement vs shipping signal that separates firefighting from acceleration.",
    retailValue: 89,
  },
  {
    day: 6,
    slug: "issue-pr-ratio",
    phase: "learn",
    title: "Issue-to-PR ratio",
    oneLine: "Engagement vs shipping — 1.5+ healthy, 0.7- firefighting.",
    whyItMatters:
      "The team-health signal. A startup with a heavy issue queue and a thin PR queue is collecting feedback they can't ship against. A startup with PRs flowing daily and an issue queue that drains is shipping faster than it accumulates problems.",
    procedure: [
      "Open the org's most-active repo.",
      "Click Issues. Note: open count, closed count, ratio.",
      "Click Pull requests. Same — open, closed, ratio.",
      "Compute: PRs closed in last 30 days ÷ Issues opened in last 30 days.",
    ],
    filterFor:
      "A ratio of ~1.5 or higher (more PRs closing than issues opening). Below ~0.7 means feedback is piling up faster than the team can ship.",
    edgeCase:
      "Some teams use a separate issue tracker (Linear, Jira) and only use GitHub Issues for community reports. In that case, the ratio is misleading. Look at PR count alone — 10+ PRs closed in 30 days is healthy, <3 is dormant.",
    bonus:
      "A team that ships faster than its inbox can absorb the next round's hire and accelerate further. A team buried in issues needs the round to hire a triage layer first — the round is firefighting, not acceleration. Same headline number, very different bet.",
    yesterdayRecap:
      "Yesterday's repo-creation reading told you whether the team is building outward. Today's tells you whether they're keeping up with the inbound at the same time.",
    tomorrowTeaser:
      "Tomorrow is the wrap. I'll show you how to compose all six signals into a single score, and how to run it across 4,200 startup orgs in four seconds.",
    retailValue: 89,
  },
  {
    day: 7,
    slug: "composite-score",
    phase: "learn",
    title: "The composite + the fast version",
    oneLine: "Six signals → one score → 4,200 orgs in 4 seconds.",
    whyItMatters:
      "The composite is the framework. A startup scoring 5/6 with sustained acceleration over 14 days closes within 21–47 days about 38% of the time — roughly 5x the base rate from the SSRN panel.",
    procedure: [
      "Commit velocity ratio > 1.3 → +1",
      "Top contributor < 50% AND ≥4 contributors with 10+ commits → +1",
      "Dependents graph has >50 external dependents → +1",
      "README updated in last 60 days with substantive diff → +1",
      "3+ new repos in last 30 days, looking like platform components → +1",
      "PRs closed ÷ Issues opened (last 30d) > 1.5 → +1",
    ],
    filterFor:
      "Score 5 of 6 = strong fundraise-precursor profile. Score 6 of 6 with 14-day sustained acceleration = ~38% close-within-47-days rate (vs ~7% base rate).",
    edgeCase:
      "A startup scoring 6/6 on a single repo but the org-level reading is 2/6 — that's a single product break-out inside an otherwise quiet org. Different bet than an org-wide acceleration. Read both layers.",
    bonus:
      "Manual version takes ~30 minutes per startup. Monitoring 30 startups manually is a 15-hour week. The fast version runs the same six signals plus a seventh (signal-type classification — hiring burst vs infra buildout vs deploy spike vs framework migration) across 4,200 orgs continuously. Same framework, different scale.",
    yesterdayRecap:
      "Yesterday you learned the last of the six atomic signals. Today they assemble.",
    tomorrowTeaser:
      "Week 1 closes today: you can now read the framework. Week 2 starts tomorrow — applying the composite to three real candidates from your own pipeline.",
    retailValue: 297,
  },

  // ─────────────────────────────────────────────────────────────────
  // Week 2 (Days 8-14): APPLY — composite on real candidates
  // ─────────────────────────────────────────────────────────────────
  {
    day: 8,
    slug: "pick-three-candidates",
    phase: "apply",
    title: "Pick three real candidates",
    oneLine: "Three orgs from your own pipeline — one boring, one obvious, one wildcard.",
    whyItMatters:
      "Reading the framework is theory. The skill comes from running it. Picking three candidates with deliberately different profiles trains you to see what the composite catches that your gut misses, and where your gut still beats the score.",
    procedure: [
      "Open your existing pipeline (CRM, notes app, Notion, whatever).",
      "Pick #1 — the boring one. A startup you'd assume scores 3/6, no obvious tells.",
      "Pick #2 — the obvious one. The startup you already feel good about.",
      "Pick #3 — the wildcard. A pre-revenue or stealth-ish org you can't quite read.",
      "Note today: GitHub URL for each, a one-line gut prediction (score 0-6), the reason.",
    ],
    filterFor:
      "Three orgs that are public on GitHub. If a candidate has no public repos, pick again — the framework is GitHub-native and we want a clean comparison.",
    edgeCase:
      "If your pipeline is empty, pick three Series A/B announces from the last 30 days of TechCrunch. The framework works retroactively too — you'll see what the headline missed.",
    bonus:
      "Write down the gut prediction BEFORE you score. The most useful artifact of the week is the delta between your gut and the composite — both are data.",
    yesterdayRecap:
      "Week 1 closed yesterday with the composite. Week 2 starts now — and the only way to lock in the framework is to run it.",
    tomorrowTeaser:
      "Tomorrow: candidate #1, end-to-end, in 15 minutes. We'll do all six signals on the boring one first.",
    retailValue: 49,
  },
  {
    day: 9,
    slug: "score-candidate-one",
    phase: "apply",
    title: "Score candidate #1 end-to-end",
    oneLine: "The boring one — six signals, 15 minutes, one composite.",
    whyItMatters:
      "Running the full composite once feels slow; running it three times in a row makes the procedure muscle-memory. Candidate #1 is intentionally the boring one so you're calibrating with low emotional stakes.",
    procedure: [
      "Open your candidate #1 GitHub org in one tab.",
      "Run signal 1 (commit velocity), note the +0/+1.",
      "Run signal 2 (contributor diversity), note the +0/+1.",
      "Run signals 3-6 the same way. 90 seconds each.",
      "Total composite. Compare to your gut prediction.",
    ],
    filterFor:
      "A composite score (0-6) and a one-sentence note for each signal: what the data showed and how confident you are.",
    edgeCase:
      "If you stall on signal 3 (dependents graph) because the page is empty, that's not zero — that's 'private distribution' and it deserves a note, not a default 0.",
    bonus:
      "Watch the clock. If you're at 25+ minutes on candidate #1, you're over-thinking. The whole point of the manual procedure is that it's fast enough to run on every founder you meet.",
    yesterdayRecap:
      "Yesterday you picked three candidates and wrote a gut prediction for each. Today, the boring one gets the full composite.",
    tomorrowTeaser:
      "Tomorrow: candidate #2, the obvious one. Your prediction was probably high — let's see whether the composite agrees.",
    retailValue: 79,
  },
  {
    day: 10,
    slug: "score-candidate-two",
    phase: "apply",
    title: "Score candidate #2 — the obvious one",
    oneLine: "The startup you already liked — does the framework agree?",
    whyItMatters:
      "Confirmation bias is loudest on the candidates you already feel good about. Running the composite on the 'obvious yes' is where you'll either build trust in the framework or learn that one of your priors is wrong. Both are useful.",
    procedure: [
      "Open candidate #2 GitHub org. Same six signals, same order.",
      "Try to score honestly — pretend you've never heard of the founder.",
      "Note any signal where the composite disagrees with your prior.",
      "Total composite. Compare to your gut prediction from Day 8.",
    ],
    filterFor:
      "A composite score and the largest delta between gut and framework. If they agree, write 'no surprise.' If they don't, write the one signal that surprised you.",
    edgeCase:
      "A 'darling' that scores 2/6. This happens. Usually because the founder is great but the engineering org is one person — the bet is on the founder, not the team. Note that explicitly.",
    bonus:
      "If your gut said 5/6 and the composite says 5/6, the prior was right but the framework didn't add value. If gut said 5/6 and composite says 3/6, you just dodged a bullet.",
    yesterdayRecap:
      "Yesterday you ran the boring one. Today is the obvious one — and the most likely place for the framework to disagree with you.",
    tomorrowTeaser:
      "Tomorrow: candidate #3, the wildcard. This is where the composite earns its keep — calling something your gut couldn't read.",
    retailValue: 79,
  },
  {
    day: 11,
    slug: "score-candidate-three",
    phase: "apply",
    title: "Score candidate #3 — the wildcard",
    oneLine: "The unread one — where the framework earns its keep.",
    whyItMatters:
      "Wildcards are the asymmetric bet category. A pre-revenue, stealth-ish, or deeply-technical org is the hardest to read with a gut alone. The composite turns 'unreadable' into a number, and the number gives you a frame for the founder conversation.",
    procedure: [
      "Open candidate #3 GitHub org. Same six signals.",
      "Be deliberate about signal 3 (dependents) and signal 5 (new repos) — those tell the most about a stealth team.",
      "Total composite. Compare to gut.",
      "Write the next-step: pass, second meeting, or watch-only.",
    ],
    filterFor:
      "A composite score that gives you a defensible reason to take a meeting (or not). 'Score 4/6, asking about hiring plan' is a stronger frame than 'feels interesting.'",
    edgeCase:
      "A wildcard that scores 6/6 is rare but real. When it happens, the second meeting is almost mandatory — the framework just told you something nobody else has surfaced.",
    bonus:
      "The wildcard is where the composite generates the most diligence-conversation leverage. The score becomes the question, not the conclusion.",
    yesterdayRecap:
      "Yesterday the obvious one. Today the unread one — and probably the one where you'll feel the framework working hardest.",
    tomorrowTeaser:
      "Tomorrow: compare all three. We'll pull out the signal that pulled the heaviest weight across your candidates — it's usually the one you'd have skipped.",
    retailValue: 89,
  },
  {
    day: 12,
    slug: "compare-three",
    phase: "apply",
    title: "Compare all three — which signal carried the read?",
    oneLine: "Three composites side by side — and the signal you almost skipped.",
    whyItMatters:
      "Across three candidates, one signal usually pulled more diagnostic weight than the others. Identifying which one for your beat (sector, stage, geography) tells you where to spend the next 30 minutes when you only have 30 minutes.",
    procedure: [
      "Lay out the three candidates: name, gut prediction, composite, delta.",
      "For each signal (1-6), note: did this signal flip a candidate's score? Up or down?",
      "Identify the signal that produced the biggest disagreement with your gut.",
      "Write one sentence: 'For my beat, the signal I should never skip is ___.'",
    ],
    filterFor:
      "A named signal you've now upgraded to 'always run this first' for your beat. For dev-tools investors, it's usually dependents. For platform investors, it's usually new repo creation. For B2B SaaS, it's commit velocity.",
    edgeCase:
      "If the same signal flipped all three the same direction, you might just be discovering a sector-wide bias — e.g. dev-tools founders all over-index on dependents because that's their distribution channel.",
    bonus:
      "Save this list. Update it every 10 candidates. Within a quarter you'll have the personal heuristic that an 'all signals equal' framework can't give you.",
    yesterdayRecap:
      "Yesterday you finished three composites. Today they line up — and the framework starts becoming yours.",
    tomorrowTeaser:
      "Tomorrow: a calibration run. We'll score one publicly-known recently-funded org and check whether the composite caught the round before it closed.",
    retailValue: 69,
  },
  {
    day: 13,
    slug: "calibration-run",
    phase: "apply",
    title: "Calibration — score a known recently-funded org",
    oneLine: "Pick a Series A from last quarter. What did the composite say at month -3?",
    whyItMatters:
      "Backtesting on one known case proves to yourself that the framework wasn't just confirming pattern-matching on three orgs of your choosing. Pick a startup that announced a Series A 60-90 days ago and read what the composite would have said three months before the announce.",
    procedure: [
      "Pick a Series A or B announce from 60-90 days ago. TechCrunch, Newcomer, Pro Rata.",
      "Open the GitHub org. For each signal, set the date filter to 'last 90 days' counting backward from 90 days before today (i.e. the org's state at month -3).",
      "Score as if you were doing diligence three months pre-announce.",
      "Compare the inferred 'month -3' composite to the announced round.",
    ],
    filterFor:
      "A score of 4/6 or higher at month -3 is a hit — the framework would have flagged this round before it closed. A score of 2/6 or lower is a miss — useful too, the panel data says ~30% of rounds don't surface in GitHub signals.",
    edgeCase:
      "Some recently-funded orgs went private with key repos right before the round. That itself is a tell — public→private repo flip is a signal we don't formalise but is worth a manual check.",
    bonus:
      "Run this calibration on five rounds and you'll have a personal hit-rate. 60-70% accuracy at month -3 is realistic for the public-data version. The MCP version layers in private-data heuristics and runs ~78%.",
    yesterdayRecap:
      "Yesterday you found the signal that carries your beat. Today: a backtest. One known round, scored at month -3.",
    tomorrowTeaser:
      "Tomorrow closes Week 2 — your first 3-startup scorecard becomes a real artifact you can show.",
    retailValue: 89,
  },
  {
    day: 14,
    slug: "week-two-wrap",
    phase: "apply",
    title: "Week 2 wrap — your first scorecard",
    oneLine: "Three composites, one calibration, one personal heuristic. That's a real artifact.",
    whyItMatters:
      "By Day 14, you have something nobody else in your network has: a rolling 4-org composite scorecard with calibration. It is small but it is yours. Most professional sourcing systems were built from a smaller starting position.",
    procedure: [
      "Compile a single page: 4 orgs (3 candidates + 1 calibration), composite for each, delta vs gut, the signal that mattered most.",
      "Save it somewhere persistent — Notion, doc, repo. You'll add to it weekly.",
      "Send it to one trusted co-investor or analyst. Ask: 'What did I miss?'",
      "Schedule the Week 3 first session: 25 minutes on Monday.",
    ],
    filterFor:
      "A scorecard you'd be willing to show to your most rigorous co-investor. If you wouldn't, refine the notes — the goal is artifact-quality, not perfect.",
    edgeCase:
      "If two of your three candidates scored identically (e.g. both 4/6), differentiate by the qualitative notes. The number compresses; the prose decompresses.",
    bonus:
      "The scorecard becomes the seed of your watchlist (Day 15). Same data, different framing — same orgs, but now with a 'next-touch date' added.",
    yesterdayRecap:
      "Yesterday's calibration closed the loop on Week 2. Today you ship the artifact.",
    tomorrowTeaser:
      "Week 3 starts tomorrow — building the watchlist that turns these one-off scores into a continuous practice.",
    retailValue: 49,
  },

  // ─────────────────────────────────────────────────────────────────
  // Week 3 (Days 15-21): SYNTHESIZE — watchlist + cadence
  // ─────────────────────────────────────────────────────────────────
  {
    day: 15,
    slug: "build-watchlist",
    phase: "synthesize",
    title: "Build a 10-org watchlist",
    oneLine: "Ten orgs, one sector, scored once, queued for weekly recheck.",
    whyItMatters:
      "A scorecard is a snapshot; a watchlist is a habit. Picking ten orgs in one sector and committing to recheck them weekly is the smallest unit of continuous sourcing practice that still beats the average angel's pipeline rhythm.",
    procedure: [
      "Pick one sector you actually care about (vertical SaaS, dev-tools, fintech infra, etc.).",
      "List 10 orgs in that sector that have public GitHub. AngelList, Crunchbase, your CRM.",
      "Run the composite once on each. ~90 minutes total.",
      "Sort by score. Save with date stamp.",
    ],
    filterFor:
      "10 orgs, sorted, dated. The list is the artifact — not the conclusion. Scores will move week to week and that movement is the actual signal.",
    edgeCase:
      "If your sector is too narrow to find 10 orgs with public GitHub, broaden one degree (e.g. 'fintech APIs' → 'fintech infra'). The cadence beats the precision at this stage.",
    bonus:
      "Save the watchlist as a CSV with one column per signal. When a score moves, you'll see which signal moved — and that's where the founder conversation starts.",
    yesterdayRecap:
      "Last week you ran the composite three times. This week you commit to running it ten times, weekly, on the same orgs.",
    tomorrowTeaser:
      "Tomorrow: setting the Monday rhythm. The watchlist isn't useful until it's a calendar habit.",
    retailValue: 79,
  },
  {
    day: 16,
    slug: "monday-rhythm",
    phase: "synthesize",
    title: "Set the weekly Monday rhythm",
    oneLine: "25 minutes every Monday, before email — the cadence that compounds.",
    whyItMatters:
      "Sourcing systems fail on cadence, not on framework. The investors who outperform on deal flow run the same procedure on the same day every week. 25 minutes Mondays before email is the smallest commitment that survives a busy week.",
    procedure: [
      "Block 25 minutes on Monday morning, recurring, before you open email.",
      "Open the watchlist CSV.",
      "Score signal 1 (commit velocity) on all 10 orgs — that's the fastest signal, do it first.",
      "Note any score that moved by 0.5+ on that signal alone.",
      "Schedule a follow-through to score the moved orgs in full later that day.",
    ],
    filterFor:
      "Recurring 25-min Monday block on your calendar. If you can't protect 25 minutes once a week, the system can't compound — better to drop to 5 orgs in the watchlist and protect the time.",
    edgeCase:
      "Mondays of conferences or board meetings will break the rhythm. Use Tuesday morning as the fallback day; don't skip the week.",
    bonus:
      "After 4 Mondays, you'll have 40 datapoints across 10 orgs. That's enough to spot the slope, not just the snapshot.",
    yesterdayRecap:
      "Yesterday you built the watchlist. Today you commit to the rhythm that makes it pay.",
    tomorrowTeaser:
      "Tomorrow: the sector batch — running 25 orgs in 25 minutes when one sector starts getting hot.",
    retailValue: 69,
  },
  {
    day: 17,
    slug: "sector-batch",
    phase: "synthesize",
    title: "Sector batch — 25 orgs in 25 minutes",
    oneLine: "When a sector heats up, sweep it broad before going deep.",
    whyItMatters:
      "When a sector is moving (a category is buzzing, a competitor just raised, an LP is asking), the speed move is to score 25 orgs in that sector at lightning pace and rank them. One signal, one minute per org.",
    procedure: [
      "Pick a sector that's moving. List 25 orgs (Crunchbase + AngelList).",
      "Score signal 1 (commit velocity) on each, 60 seconds per org.",
      "Sort top 5. For those 5, run the full composite — 75 minutes total.",
      "Top 1-2 from the sweep get a meeting request the same week.",
    ],
    filterFor:
      "A 25-org sweep with 5 orgs flagged for full composite. Top 1-2 get outreach. The exercise compresses 'broad scan + tight diligence' into one afternoon.",
    edgeCase:
      "If the sector is small (<25 orgs with public GitHub), score what exists and supplement with private-repo intelligence — that gap itself is positioning data on the sector.",
    bonus:
      "This is the procedure the live engine runs every Monday at 06:00 UTC across 4,200 orgs in 4 seconds. You're learning the manual version so you can defend any number the engine produces.",
    yesterdayRecap:
      "Yesterday you set the weekly rhythm. Today you build the high-throughput version of the same procedure for sector-heat moments.",
    tomorrowTeaser:
      "Tomorrow: using the composite as the founder Q&A frame — turning a score into a question.",
    retailValue: 89,
  },
  {
    day: 18,
    slug: "score-driven-questions",
    phase: "synthesize",
    title: "Score-driven founder questions",
    oneLine: "Five questions, each seeded by a signal — sharper than 'tell me about traction.'",
    whyItMatters:
      "The framework's second-order value is what it does to your founder conversation. A founder who hears 'your dependents graph has 80+ external repos, what's the migration cost for an enterprise customer who depends on you?' knows you read the engineering, not just the deck.",
    procedure: [
      "Pick one of the candidates you scored last week.",
      "For each signal that scored +1, write one founder-grade question seeded by that signal.",
      "For each signal that scored 0, write one diagnostic question.",
      "Total: 6 questions. Use them in your next first meeting.",
    ],
    filterFor:
      "Six questions, each tied to a specific signal. The form is 'I noticed [data], what's the [implication]?' — never 'do you have...' Yes/no closes the conversation. Implication questions open it.",
    edgeCase:
      "If the founder's deck already addresses every signal explicitly, congratulations — they've read the same panel data you have. Move to the unscored questions: hiring plan, GTM, competitive moat.",
    bonus:
      "Founders remember the investor who read their code. The Q&A bar moves from 'standard pitch' to 'we're already in diligence.' That's the conversation differential the framework gives you for free.",
    yesterdayRecap:
      "Yesterday's sector sweep gave you the broad scan. Today you turn one specific score into five sharp questions.",
    tomorrowTeaser:
      "Tomorrow: scoring a portfolio company retroactively — what the framework would have caught at investment time.",
    retailValue: 99,
  },
  {
    day: 19,
    slug: "portfolio-retroactive",
    phase: "synthesize",
    title: "Score one portfolio company retroactively",
    oneLine: "Pick the worst-performing investment. What did the composite say at term sheet?",
    whyItMatters:
      "Retroactive scoring on your own portfolio is where the framework either becomes part of your process or doesn't. If you find that two of your worst-performing investments scored 1/6 at the term-sheet date, that's a procedural change you can implement before the next check.",
    procedure: [
      "Pick one investment from 12-24 months ago.",
      "Find the GitHub state from the term-sheet date (use github.com/[org]?since=[date]).",
      "Run the composite as it would have read at that date.",
      "Note: did the score predict the trajectory? Did one signal flip?",
    ],
    filterFor:
      "A retroactive score that you can compare to actual outcome. If the framework would have flagged the bet you regret, it just earned a permanent slot in your process.",
    edgeCase:
      "Some early-stage bets are intentionally low-composite (pre-engineering, founder-only). The framework doesn't penalise that — it just means the composite isn't the right tool for that stage. Note where the cutoff is for your own beat.",
    bonus:
      "Run this on 5 investments. The pattern usually shows up: one signal you systematically ignored. That's the highest-leverage change you can make to your own process this year.",
    yesterdayRecap:
      "Yesterday you turned scores into questions. Today: applying the same scoring to your own portfolio history.",
    tomorrowTeaser:
      "Tomorrow: the 30-second pre-read — using the composite to prep for a first meeting.",
    retailValue: 99,
  },
  {
    day: 20,
    slug: "first-meeting-preread",
    phase: "synthesize",
    title: "30-second pre-read for first meetings",
    oneLine: "One glance at the composite before you walk in — and you're already ahead.",
    whyItMatters:
      "Every first meeting is improved by a 30-second pre-read of the founder's GitHub. The framework compresses that pre-read into a number plus three notes — readable from a phone in the elevator. Most investors don't do this. The 30 seconds is the differential.",
    procedure: [
      "Open the founder's GitHub org from your meeting calendar invite.",
      "Glance at: README dated? Repo count moving? Top-contributor share?",
      "30-second composite: 0-2 (cold), 3-4 (warm), 5-6 (hot).",
      "Walk in with one signal-specific opening question.",
    ],
    filterFor:
      "A 30-second pre-read habit on every founder meeting going forward. The threshold for 'do the pre-read' should be 0 — you do it for every meeting, not just the high-scoring ones.",
    edgeCase:
      "Some founders do all their work in private repos. Note the absence as 'private-repo team' and adjust the conversation — your questions shift from 'what does the engineering say' to 'walk me through the engineering history I can't see.'",
    bonus:
      "Two months in, the pre-read becomes automatic. You'll start noticing other investors who haven't done it — and the founder will too.",
    yesterdayRecap:
      "Yesterday you scored a portfolio company retroactively. Today: the 30-second forward-looking version, before every meeting.",
    tomorrowTeaser:
      "Tomorrow closes Week 3 — your operational sourcing system is real, written down, and running on a calendar.",
    retailValue: 79,
  },
  {
    day: 21,
    slug: "week-three-wrap",
    phase: "synthesize",
    title: "Week 3 wrap — your operational system",
    oneLine: "Watchlist + Monday rhythm + sector-batch + question library + pre-read.",
    whyItMatters:
      "By Day 21, you have an operating system, not a framework. Five components, each calendared. This is the difference between investors who 'use signals' and investors who 'run a sourcing process.' The system runs you, not the other way around.",
    procedure: [
      "Document the system on one page. Five components, half a sentence each.",
      "Bake the calendar blocks: Monday 25 min (rhythm), as-needed (sector batch), every meeting (pre-read).",
      "Identify the one piece you'll skip first under pressure. Pre-commit to a recovery move.",
      "Send the doc to your investing partner or your most critical co-investor for sanity-check.",
    ],
    filterFor:
      "A one-page document you could hand to a junior analyst and they could replicate the system. If it's longer than one page, compress.",
    edgeCase:
      "Solo angels skip the 'partner sanity-check' step. Substitute: post the system on a private channel where you'll see it weekly (Notion homepage, Slack DM to yourself, repo README).",
    bonus:
      "Annual planning bonus: the doc becomes your sourcing strategy slide for LPs and back-office reporting. 'I run a 7-signal composite weekly across N orgs in M sectors' is more concrete than 'I source through warm intros.'",
    yesterdayRecap:
      "Yesterday: 30-second pre-reads. Today: the whole system documented, calendared, partner-sanity-checked.",
    tomorrowTeaser:
      "Week 4 starts tomorrow — adding alerts, sharing, and the integration that makes the manual system automatic.",
    retailValue: 99,
  },

  // ─────────────────────────────────────────────────────────────────
  // Week 4 (Days 22-30): OPERATIONALIZE — alerts, sharing, scaling
  // ─────────────────────────────────────────────────────────────────
  {
    day: 22,
    slug: "set-alerts",
    phase: "operationalize",
    title: "Set alerts on score moves",
    oneLine: "When does a score change matter? When commit velocity flips by ≥0.4.",
    whyItMatters:
      "A weekly snapshot is a habit. An alert is leverage. The right alert threshold catches the score move before the round closes; the wrong threshold drowns you in noise. Calibrating thresholds is the difference between a watchlist and a deal-flow engine.",
    procedure: [
      "Set a Slack/email alert (or just a Calendar reminder) on commit velocity flips ≥0.4 week-over-week.",
      "Add a second alert on README updates that change >50 lines.",
      "Add a third alert on new repo creation (any new repo in a watched org).",
      "Test by triggering one manually on a known org.",
    ],
    filterFor:
      "Three alert types live, each with a clear noise floor. If you get more than 3 alerts/week per org, the threshold is too sensitive — narrow it.",
    edgeCase:
      "GitHub doesn't natively send velocity-change alerts. The MCP server has the tool; the manual workaround is GitHub's own watch settings + a weekly Monday recheck. Pick one.",
    bonus:
      "When an alert fires on a watchlist org, the response should be tight: 60-second context check, 5-minute composite recheck, a meeting request if the score crossed a meaningful threshold. Document the reaction loop.",
    yesterdayRecap:
      "Yesterday you documented the system. Today you add the layer that catches the move between weekly checkpoints.",
    tomorrowTeaser:
      "Tomorrow: the anti-signal — the orgs where 6/6 is wrong, and how to flag those before you waste a meeting.",
    retailValue: 79,
  },
  {
    day: 23,
    slug: "anti-signal",
    phase: "operationalize",
    title: "The anti-signal — when 6/6 is wrong",
    oneLine: "Some orgs game every signal. Building your false-positive list is week 4 work.",
    whyItMatters:
      "Frameworks are gameable, especially public ones. A devtools agency, a YC alum farming OSS contributions, a team running a single-customer consultancy that looks like a startup — all can score 6/6 on the public composite. Your false-positive list is the personal antibody.",
    procedure: [
      "List 3 archetypes you've seen game public-data signals (agencies, single-customer consultancies, OSS-funded research labs).",
      "For each, note the signal that betrays it on closer reading (e.g. agency → look at customer-named repos).",
      "Add a manual 'sanity check' step to your Monday rhythm: top 1 from watchlist gets the 5-minute archetype check.",
      "Save the archetype list. Update quarterly.",
    ],
    filterFor:
      "A written, dated false-positive list with at least 3 archetypes and the manual check that catches each. The list is private — it's competitive advantage, not content.",
    edgeCase:
      "A single high-trust founder you've already met can override a low score the same way an archetype can override a high score. Both are personal-judgment overrides on top of the framework, not replacements.",
    bonus:
      "The archetype list is the most personal artifact in this whole challenge. It encodes your specific bias-correction. Two investors with the same 6-signal framework will produce different deal flow because their archetype lists differ.",
    yesterdayRecap:
      "Yesterday you set alerts. Today: the override layer that catches the orgs where the alerts will lie to you.",
    tomorrowTeaser:
      "Tomorrow: making the score legible to a co-investor — the share template that turns a number into a paragraph.",
    retailValue: 89,
  },
  {
    day: 24,
    slug: "co-investor-share",
    phase: "operationalize",
    title: "Co-investor share template",
    oneLine: "Score → paragraph → ask. Three lines, one Slack message, one new co-investor convert.",
    whyItMatters:
      "A composite score is illegible to a co-investor who doesn't know your framework. A three-line template that translates 'composite 5/6, sharp acceleration' into a paragraph they can act on is the difference between solo conviction and syndicate conviction.",
    procedure: [
      "Write a 3-line template. Line 1: org + composite + sector. Line 2: the standout signal in plain English. Line 3: the question or ask.",
      "Test it on one co-investor with a recent watchlist standout.",
      "Iterate the template based on their reply (or non-reply).",
      "Save the template alongside your watchlist CSV.",
    ],
    filterFor:
      "A template that produces a reply from a co-investor at least 50% of the time. If 0/5 replies, the line 2 (signal in plain English) is too jargon-heavy — rewrite to lead with the implication, not the metric.",
    edgeCase:
      "Some co-investors never reply to text intel — they need a meeting. Adapt: 'composite 5/6, want to hop on a 15 to discuss?' is a different ask but the same format.",
    bonus:
      "When the template starts producing 'who else have you shared this with' replies, you've graduated from sourcing to syndicate-leading. That's a different power level.",
    yesterdayRecap:
      "Yesterday you built the false-positive override. Today you make the framework readable to people who don't run it themselves.",
    tomorrowTeaser:
      "Tomorrow: the IDE/MCP integration. The manual system runs in the browser; the automated layer runs in your editor.",
    retailValue: 79,
  },
  {
    day: 25,
    slug: "mcp-integration",
    phase: "operationalize",
    title: "MCP integration — running the framework from your editor",
    oneLine: "Six tools, one MCP server, zero context-switching out of your IDE.",
    whyItMatters:
      "After 24 days of running the manual procedure, the integration buys back the time. The MCP server exposes the same six signals as IDE-callable tools — score an org from Claude Desktop, Cursor, or Windsurf in a single command. The framework you now own becomes editor-native.",
    procedure: [
      "Install the MCP server (free): the install card on /install has the one-line config for Claude / Cursor / Windsurf.",
      "Test by asking the model: 'score the github org [name] using the composite framework.'",
      "Verify the response matches a manual run within ±0.5.",
      "Add the score-an-org command to your editor command palette.",
    ],
    filterFor:
      "A working MCP integration that returns a composite + signal breakdown for any public GitHub org in <5 seconds. If installation fails, the issue is almost always the editor's MCP config syntax — the install page has the exact JSON for each editor.",
    edgeCase:
      "If you don't use a model-augmented editor, skip this day — the manual cadence still works. The MCP layer is the speed unlock, not a prerequisite.",
    bonus:
      "Once the MCP works, you can run the framework on a founder's GitHub during a Zoom call without leaving the editor or the call. The diligence move that used to take 25 minutes pre-meeting now happens during the meeting.",
    yesterdayRecap:
      "Yesterday you built the share template. Today you collapse the manual procedure into an editor command.",
    tomorrowTeaser:
      "Tomorrow: customising the composite weights — the framework is yours, you should weight it like yours.",
    retailValue: 99,
  },
  {
    day: 26,
    slug: "custom-weights",
    phase: "operationalize",
    title: "Custom composite weights",
    oneLine: "Default is 1×6. Your beat probably needs 2× on one signal and 0.5× on another.",
    whyItMatters:
      "The unweighted composite (each signal +1) is the right starting point because it's calibration-light. After 26 days you have enough personal data to see which signal matters most for your beat, and a re-weighted composite outperforms the default for your specific deal flow.",
    procedure: [
      "Pull the watchlist CSV and the 4-org scorecard from Day 14.",
      "For each signal: which one would you have weighted higher to better predict your hits?",
      "Propose new weights (e.g. commit velocity 1.5×, dependents 1.5×, others 1×).",
      "Recompute the composites with new weights. Compare ranking shifts.",
    ],
    filterFor:
      "A reweighted composite that produces a ranking you trust more than the default for your beat. If the reweighting doesn't change the ranking meaningfully, the default is correct for you.",
    edgeCase:
      "Don't over-weight a signal because you remember one big hit on it. The right weighting reflects pattern across 10+ orgs, not one anchor case. Sample size discipline matters here.",
    bonus:
      "The custom weights become a competitive moat. Two analysts with the same framework but different weights produce different deal flow — and yours is calibrated to your specific outperformance pattern.",
    yesterdayRecap:
      "Yesterday: MCP integration. Today: the personal calibration that the integration alone can't give you.",
    tomorrowTeaser:
      "Tomorrow: the 30-day retrospective. Pull out the artifacts. What did the framework actually catch?",
    retailValue: 89,
  },
  {
    day: 27,
    slug: "retrospective",
    phase: "operationalize",
    title: "30-day retrospective — what the framework caught",
    oneLine: "Four weeks. Three candidates. One calibration. Ten watchlist orgs. What's measurable?",
    whyItMatters:
      "By Day 27 you have ~30 datapoints across ~13 orgs (3 candidates + 1 calibration + 10 watchlist + retroactive portfolio). That's enough to write a one-page retrospective that proves to yourself the framework is or isn't worth keeping in your process.",
    procedure: [
      "List every score you ran in the last 30 days. Org + composite + delta-vs-gut.",
      "Count: composite >gut (framework added value) vs composite =gut (framework confirmed) vs composite <gut (framework saved you).",
      "Identify any specific deal flow you wouldn't have surfaced without the framework.",
      "Write the one-paragraph retrospective: what's keepable, what to drop.",
    ],
    filterFor:
      "A retrospective that you'd be willing to share with a peer investor. If you can't articulate one specific case where the framework changed your decision, that's also a valid result — note it and decide accordingly.",
    edgeCase:
      "Sometimes 30 days isn't enough to see attribution because rounds take 60-90 days to close. In that case, schedule a 60-day follow-up retrospective to revisit the watchlist and check actual outcomes.",
    bonus:
      "The retrospective doc becomes the foundation of the next 30 days. The framework either earns a permanent slot in your process or it doesn't, and now you have the data to defend the choice.",
    yesterdayRecap:
      "Yesterday you customised the weights. Today: the audit. Did the framework earn its slot?",
    tomorrowTeaser:
      "Tomorrow: the Sunday digest as continuous practice — turning the 30-day muscle into a forever rhythm.",
    retailValue: 79,
  },
  {
    day: 28,
    slug: "sunday-digest-rhythm",
    phase: "operationalize",
    title: "The Sunday digest as continuous practice",
    oneLine: "After Day 30, the rhythm continues — five orgs every Sunday, one composite per week.",
    whyItMatters:
      "30-day challenges produce muscle that fades unless a continuous practice replaces them. Five new orgs every Sunday — scored against the same composite — keeps the framework alive without requiring active 25-min Monday blocks. The Sunday digest is the gymnastics-bar equivalent of grip strength.",
    procedure: [
      "Subscribe to the free Sunday digest if you aren't already (it's the same address you got these emails from).",
      "Each Sunday: open the digest, score the top 1 with the full composite, glance at the others.",
      "When a digest org enters your investable beat, add it to the watchlist.",
      "Every 4 Sundays, review the watchlist for promotion to outreach.",
    ],
    filterFor:
      "A self-running cadence: 1 fully-composite-scored org per week, 4 newly-glanced orgs per week, watchlist refreshing automatically. ~25 min/week sustained.",
    edgeCase:
      "If the Sunday digest doesn't fit your sector, the underlying engine has 4,200 orgs and 30+ sector tags. The Dashboard rung filters by your sector, same five-orgs-per-week rhythm.",
    bonus:
      "Three months of Sundays = 60 newly-scored orgs into your awareness funnel. That's already more deal flow surface than most angel investors see in a year of warm intros alone.",
    yesterdayRecap:
      "Yesterday's retrospective showed what the framework caught. Today: how to keep the catch rate without forcing 25 weekly minutes.",
    tomorrowTeaser:
      "Tomorrow: the rung decision. Three optional ways to keep using the system. Pick one or pick none — the framework stays yours either way.",
    retailValue: 49,
  },
  {
    day: 29,
    slug: "pre-graduation",
    phase: "operationalize",
    title: "Pre-graduation — which rung makes sense?",
    oneLine: "Free, €49/mo, or €1,997 — match the rung to the actual usage pattern from the last 30 days.",
    whyItMatters:
      "Tomorrow is graduation. Today is the honest pre-conversation: based on the last 29 days, which rung — if any — actually fits the pattern? If you ran the manual procedure once a week, free Sunday digest is the right level. If you wanted to monitor 30+ orgs, the Dashboard is the right level. If one sector is heating up and you can't sweep it manually, the Sector Sweep is the right level.",
    procedure: [
      "Re-read your retrospective from Day 27.",
      "Quantify: how many orgs did you actually score in 30 days? If <12, free is right. 12-50, Dashboard. 50+ in one sector, Sector Sweep.",
      "Write a one-line reason for the rung you'll pick (or 'none').",
      "Set a calendar reminder for Day 30 to act on it.",
    ],
    filterFor:
      "An honest match between actual usage and rung. The wrong rung is whichever one you'd pick out of FOMO or sunk-cost rather than usage data.",
    edgeCase:
      "Some readers find the free Sunday digest is correct, full stop — the manual rhythm is enough and the upgrade is FOMO. That's a valid outcome. The framework is yours either way.",
    bonus:
      "The Dashboard's founding rate (€49/mo) locks for life. If usage data points to Dashboard, the founding-rate clock is the only thing that makes the timing matter — pricing reverts after the 2026 cohort closes.",
    yesterdayRecap:
      "Yesterday you committed to the Sunday rhythm. Today: the rung-selection conversation, before tomorrow's graduation pitch.",
    tomorrowTeaser:
      "Tomorrow: graduation. The Stack Slide, the three rungs, and the one decision. The framework is already yours.",
    retailValue: 39,
  },
  {
    day: 30,
    slug: "graduation",
    phase: "operationalize",
    title: "Graduation — the Stack Slide and one quiet decision",
    oneLine: "Thirty days. Six signals. One scorecard. One operational system. One decision.",
    whyItMatters:
      "By Day 30, you don't have a course-completion certificate. You have a sourcing system that runs every Monday for ~25 minutes, a watchlist of 10 named orgs, a 30-day retrospective, a custom-weighted composite, and an MCP integration. Whether you upgrade or not, that's the artifact stack.",
    procedure: [
      "Add up the standalone retail of every component: 30 daily lessons + watchlist + retrospective + custom composite + MCP. Total: ~€2,400.",
      "Compare to what you actually paid: €0.",
      "Make the rung decision (or no-rung decision).",
      "Continue the Sunday rhythm — that piece never ends.",
    ],
    filterFor:
      "A clear, unrushed decision on which rung (if any) fits. The framework is licensed CC BY 4.0; nothing about the rung selection changes your ownership of it.",
    edgeCase:
      "If you graduated and the system doesn't fit how you actually source, that's also a valid outcome. The 30-day retrospective is a real artifact even if the conclusion is 'this isn't for my beat.' Better to know in 30 days than 12 months.",
    bonus:
      "Pass the link to one other investor or analyst who would use it. We don't run an affiliate program because we don't want incentives to distort whether you tell a friend. /challenge.",
    yesterdayRecap:
      "Yesterday you matched usage to rung. Today the decision lands.",
    tomorrowTeaser:
      "After today, the Sunday digest cadence continues forever. The 30-day welcome ends here, the rhythm doesn't.",
    retailValue: 297,
  },
] as const;

export const CHALLENGE_TOTAL_RETAIL_VALUE = CHALLENGE_DAYS.reduce(
  (sum, d) => sum + d.retailValue,
  0,
); // 791 EUR

export function getChallengeDay(slug: string): ChallengeDay | undefined {
  return CHALLENGE_DAYS.find((d) => d.slug === slug);
}

export function getNextDay(day: number): ChallengeDay | undefined {
  return CHALLENGE_DAYS.find((d) => d.day === day + 1);
}

export function getPrevDay(day: number): ChallengeDay | undefined {
  return CHALLENGE_DAYS.find((d) => d.day === day - 1);
}
