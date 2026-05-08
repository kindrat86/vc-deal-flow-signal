/**
 * 7-Day Deal Flow Reset Challenge — single source of truth.
 *
 * Used by:
 *   - /challenge (landing)               app/challenge/page.tsx
 *   - /challenge/[day] (D1-D7 SSG ref)   app/challenge/[day]/page.tsx
 *   - /challenge/done (graduation)       app/challenge/done/page.tsx
 *   - 7-day drip (CHALLENGE_EMAILS)      lib/emails.ts
 *
 * Brunson Challenge Funnel (DotCom Secrets Ch 19) — every day must:
 *   - Open with yesterday-recap (continuity)
 *   - Teach a single signal (one belief, one procedure)
 *   - Close with tomorrow-teaser (open loop)
 *   - Include a tangible "win" the subscriber can show themselves
 *   - Quote a retail-equivalent value (Stack-Slide anchor for Day 7 reveal)
 */

export type ChallengeDay = {
  day: number;
  slug: string;
  title: string;
  oneLine: string;
  whyItMatters: string;
  procedure: readonly string[];
  filterFor: string;
  edgeCase: string;
  bonus?: string;
  yesterdayRecap: string | null;
  tomorrowTeaser: string;
  retailValue: number; // EUR — used to anchor the D7 Stack Slide
};

export const CHALLENGE_DAYS: readonly ChallengeDay[] = [
  {
    day: 1,
    slug: "commit-velocity",
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
      "After today, you own the framework. The next email lands at Day 8 with a recap and three optional ways to run it at scale — but the framework is yours either way.",
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
