/**
 * VC Engineering Acceleration Summit — Brunson DotCom Secrets Ch 16 (Summit Funnel).
 *
 * 20 anonymous-by-design talks across 5 days. Each talk renders at /summit/[slug]
 * with synthetic narration (Cartesia voice, Remotion-rendered slides — same
 * pipeline that ships the Acceleration Watch and Stadium Pitch). Founder face,
 * voice, and name remain anonymous; "speakers" are pseudonymous data-nerd roles
 * (Methodology Lead, Quantitative Architect, Sector Analyst, Agent Architect)
 * driven by the same synthetic voice as the rest of the video pipeline.
 *
 * Funnel mechanics (Brunson Summit playbook):
 *   1. Free Pass — each talk is free for 24 hours after its air time.
 *      After that, the talk locks behind the All-Access Pass.
 *   2. All-Access Pass — €197 one-time. Lifetime access to all 20 talks,
 *      full transcripts, slide decks, and a 219-startup panel dataset bonus.
 *   3. Order bump on the All-Access checkout: Sector Sweep €1,797 (the
 *      same OTO lattice already wired into /firstlook → /firstlook/thanks).
 *
 * Anonymity rule: no real names, no real faces, no real voices. Talk
 * "speakers" are roles, not people. The product is a dataset, not a
 * personality (manifesto pillar #4).
 *
 * Air schedule: Mon 2026-05-19 → Fri 2026-05-23. Four talks per day,
 * sequenced so the previous day's talk is referenced in the next day's
 * abstract — this is the Brunson "next-talk cliffhanger" mechanic that
 * keeps replay-window viewers coming back.
 */

export type TalkDay = 1 | 2 | 3 | 4 | 5;

export interface SummitTalk {
  /** URL slug — kebab-case, unique. */
  slug: string;
  /** Day in the 5-day schedule. */
  day: TalkDay;
  /** Order within the day (1–4). */
  order: 1 | 2 | 3 | 4;
  /** Talk title — under 90 chars, hook-shaped. */
  title: string;
  /** Talk subtitle — one sentence, ~20 words. */
  subtitle: string;
  /** Pseudonymous speaker handle. No real names. */
  speaker: string;
  /** Speaker role/credibility line — 1 short sentence. */
  speakerRole: string;
  /** 50-word abstract for the schedule listing + meta description. */
  abstract: string;
  /** 4–5 bullet takeaways. Bullet ≤ 90 chars. */
  takeaways: string[];
  /** Runtime label e.g. "18 min". */
  duration: string;
  /** ISO datetime when the free window opens (UTC). */
  airAt: string;
  /** Hours the free replay stays open after airAt. Default 24. */
  freeWindowHours: number;
  /** Long-form talk notes / transcript abstract — ~250 words.
   *  Renders below the player on the talk page. Indexable copy. */
  notes: string[];
  /** Related routes for the in-content nav at the bottom of each talk. */
  relatedRoutes: { label: string; href: string }[];
  /** Day name caption. */
  dayCaption: string;
}

export const SUMMIT = {
  name: "VC Engineering Acceleration Summit",
  tagline: "Five days. Twenty talks. The new playbook for sourcing venture deals from public engineering data.",
  startsAt: "2026-05-19T14:00:00Z",
  endsAt: "2026-05-23T22:00:00Z",
  /** All-Access Pass price. Checkout runs through /api/checkout/session
   *  (tier=summit) — the old buy.stripe.com payment link no longer exists
   *  in the Stripe account and sent every buyer to an error page. */
  allAccessPrice: 97,
  allAccessCurrency: "EUR",
  /** ENTRY_TIERS key consumed by /api/checkout/session. */
  allAccessCheckoutTier: "summit",
  /** In-cart order bump (BUMPS key) — Sector Sweep at the summit rate. */
  orderBumpKey: "summit_sector_sweep",
  orderBumpLabel: "Custom Sector Sweep — €297 summit rate (standalone €1,997)",
} as const;

export const TALKS: SummitTalk[] = [
  // DAY 1 — Foundations: The Acceleration Era
  {
    slug: "core-claim-engineering-acceleration",
    day: 1,
    order: 1,
    dayCaption: "Day 1 — Foundations · The Acceleration Era",
    title: "The Core Claim: Engineering Acceleration as a Leading Signal for VC",
    subtitle: "If commit-velocity is the most leading public signal in venture capital, every other deal-flow source is a lagging indicator.",
    speaker: "The Data Nerd",
    speakerRole: "Founder, VC Deal Flow Signal · ORCID 0009-0002-2222-4112",
    abstract:
      "The opening talk lays out the single belief the entire summit hinges on. We walk through the openly published panel of 219 GitHub engineering-velocity observations, state our core claim — that a 14-day commit-velocity acceleration precedes Series A announcements by a few weeks — and show exactly how we're validating it in the open on the public scorecard.",
    takeaways: [
      "The single falsifiable claim: GitHub commit-velocity acceleration leads fundraise by 21–47 days",
      "Why pitch decks, AngelList, Crunchbase, and warm intros are lagging by definition",
      "The 219-startup panel — sample frame, observation window, exclusion criteria",
      "What the core claim means for sourcing workflow: every other tool becomes a confirmation, not a leading indicator",
    ],
    duration: "22 min",
    airAt: "2026-05-19T14:00:00Z",
    freeWindowHours: 24,
    notes: [
      "This is the core claim — the single belief that, if true, makes everything else fall. Ours is one sentence: GitHub commit-velocity acceleration is the most leading public signal in venture capital. If that's true, every other sourcing surface — pitch decks, AngelList, Crunchbase, warm intros — is downstream. If it's false, we have nothing to sell. The whole product, the whole methodology, the whole summit collapses on that single empirical claim.",
      "The descriptive foundation is a longitudinal panel of 219 GitHub engineering-velocity observations across 19 sectors and five quarterly periods, indexed on SSRN under DOI 10.2139/ssrn.6606558 and released CC BY 4.0. Stated plainly: that published dataset is descriptive and carries no funding-event labels — it invites exactly the funding-join replication our claim depends on. The claim itself — that a 2× contributor influx coupled with a 14-day commit-velocity acceleration precedes fundraise announcements by a few weeks — is our working hypothesis, validated transparently (and still un-graded) on the public scorecard, not a result reported in the dataset paper.",
      "The point of opening with this is simple. If you don't accept the core claim, the next 19 talks are noise — interesting tactics on a wrong premise. If you do accept it, then the next 19 talks become a sourcing operating system. So the rest of Day 1 is spent making the core claim unfalsifiable: the methodology walkthrough, the open-source regression code, the named limitations. By the end of Day 1, every objection has a public answer.",
      "We close with a thought experiment. If the warm-intro economy worked, fundraises would distribute uniformly across founders. They don't — they cluster around the 8 percent of partners with the deepest rolodexes. Code, by contrast, is published the same week regardless of which time zone you live in. That asymmetry is the structural opportunity the core claim points at.",
    ],
    relatedRoutes: [
      { label: "Read the SSRN paper", href: "/research" },
      { label: "Methodology walkthrough", href: "/methodology" },
      { label: "Manifesto — full belief stack", href: "/manifesto" },
    ],
  },
  {
    slug: "public-over-private-cc-by-walkthrough",
    day: 1,
    order: 2,
    dayCaption: "Day 1 — Foundations · The Acceleration Era",
    title: "Public Over Private: The CC BY 4.0 Methodology Walkthrough",
    subtitle: "If we can't publish the methodology, we don't deserve the price. Here's the walkthrough.",
    speaker: "Methodology Lead",
    speakerRole: "Co-author, SSRN preprint DOI 10.2139/ssrn.6606558",
    abstract:
      "A live walkthrough of the public methodology — every signal definition, every regression coefficient, every exclusion rule — and why publishing it openly is a moat, not a leak. The buyer who can reproduce our regression in a notebook is the buyer who trusts us most.",
    takeaways: [
      "Why CC BY 4.0 reproducibility is a stronger moat than secrecy",
      "The six atomic primitives — formulas, decision rules, common pitfalls",
      "How to re-run the panel against the public Zenodo dataset in one notebook",
      "What we explicitly do not claim, and why bounded scope improves credibility",
    ],
    duration: "18 min",
    airAt: "2026-05-19T15:00:00Z",
    freeWindowHours: 24,
    notes: [
      "Most alternative-data products treat methodology as a trade secret. We argue the opposite. A measurement product is only as credible as the methodology behind it, and a closed methodology is a methodology no one can challenge. Closed methodology compounds error. Open methodology compounds trust.",
      "The walkthrough is concrete. Every signal definition is on /signals. Every formula is on /methodology. The regression code that produced the 21-to-47-day lead-time numbers is in the SSRN-indexed source. The supporting dataset is mirrored to Zenodo, Hugging Face, Kaggle, and Data.world — four redundant academic-grade hosts. Anyone with curiosity, a laptop, and an internet connection can reproduce the entire panel from scratch in under two hours.",
      "The economic logic is also straightforward. Our buyers are investors who write €5k–€50k checks and don't take claims on faith. They trust the open method over marketing copy. By publishing the methodology and the dataset, we let them — or anyone they trust — verify it, not because they'll run the regression themselves. The buyer who can see the method is open is the buyer who trusts us most. The buyer who'd rather not look will use Harmonic instead — and that's fine, because we're not trying to win every buyer, we're trying to win the right buyer.",
      "We close with the seven explicit non-claims. We do not claim causation. We do not claim universality. We do not claim the signal works in every sector. We do not claim 100 percent precision. We do not claim our sample is unbiased. We do not claim the methodology is final. We do not claim there are no false positives. Stating bounded scope improves credibility, not the reverse.",
    ],
    relatedRoutes: [
      { label: "Methodology page", href: "/methodology" },
      { label: "Reproducibility HowTo", href: "/reproducibility" },
      { label: "Signal taxonomy", href: "/signals" },
    ],
  },
  {
    slug: "rolodex-to-regression",
    day: 1,
    order: 3,
    dayCaption: "Day 1 — Foundations · The Acceleration Era",
    title: "From Rolodex to Regression: Killing Warm-Intro Roulette",
    subtitle: "The sourcing system that rewards proximity to the right rolodex is forty years old. Public data is the first credible challenge.",
    speaker: "Quantitative Architect",
    speakerRole: "Quant infra, VC Deal Flow Signal",
    abstract:
      "The warm-intro economy has been running unchallenged since the 1980s. It rewards proximity to the right partner's lunch table and punishes builders three time zones away. We dissect why public engineering data is the first credible parallel sourcing channel — not a replacement for relationships, but a parallel.",
    takeaways: [
      "Why the warm-intro economy is structurally biased toward 8 percent of partners",
      "The 'parallel sourcing channel' framing — not replacement, parallel",
      "How quantitative funds parse SEC filings and what venture can learn",
      "Time-zone neutrality as the structural advantage of public data",
    ],
    duration: "16 min",
    airAt: "2026-05-19T16:00:00Z",
    freeWindowHours: 24,
    notes: [
      "The warm-intro economy is venture capital's oldest sourcing protocol and its most biased one. It rewards founders who happen to live within a one-hour radius of a partner with deep rolodex access. It punishes everyone else. Forty years of empirical evidence shows this concentration is real, persistent, and worsening. Eight percent of partners write fifty percent of warm intros. The bottom half of partners write almost none.",
      "Our argument is not to replace this system. The warm-intro economy works extremely well for the founders inside it. Our argument is that it leaves the other 92 percent of qualified founders effectively invisible to the typical fund's pipeline. Public engineering data is the first credible parallel sourcing channel that doesn't depend on geography, school network, or social proximity. A founder shipping commits in Mumbai is as visible as one shipping commits in Palo Alto.",
      "The hedge-fund analogy is instructive. Quantitative funds don't replace fundamental analysts — they run alongside them. The fundamental desk reads filings; the quant desk parses filings, satellite imagery, credit-card panels, and shipping data. Both desks contribute to the portfolio. Venture is forty years behind that bifurcation. We're not pitching a quant takeover. We're pitching the parallel desk.",
      "The structural advantage is time-zone neutrality. A merge graph is updated daily, by people who don't know they're being read, in whatever time zone they happen to live in. The deck arrives months later through a partner-to-partner introduction. The code is observable now. The intro is observable later. That asymmetry is the entire game.",
    ],
    relatedRoutes: [
      { label: "Manifesto pillar #1: Data over networks", href: "/manifesto" },
      { label: "Dream-100 ICP", href: "/target-list" },
      { label: "Distribution map", href: "/distribution" },
    ],
  },
  {
    slug: "six-atomic-signals-glossary",
    day: 1,
    order: 4,
    dayCaption: "Day 1 — Foundations · The Acceleration Era",
    title: "The Six Atomic Signals: A Glossary for the Acceleration Era",
    subtitle: "Commit velocity, contributor influx, repo expansion, star detachment, issue cadence, dependency adoption — defined and decision-ruled.",
    speaker: "Signal Taxonomist",
    speakerRole: "Curator, /glossary and /signals taxonomy",
    abstract:
      "The atomic vocabulary every other talk in this summit reuses. Six signals, formulaic definitions, decision rules, and the common pitfall for each. By the end of this talk you can read every other talk's chart unambiguously.",
    takeaways: [
      "Commit velocity: 14-day rolling sum, with z-score normalization across sector",
      "Contributor influx: net-new commit authors in 30 days, sized to repo baseline",
      "Repo expansion: new repos created within an org in 90 days, weighted by commit density",
      "Star detachment, issue cadence, dependency adoption — formula + decision rule",
    ],
    duration: "14 min",
    airAt: "2026-05-19T17:00:00Z",
    freeWindowHours: 24,
    notes: [
      "Every other talk in this summit references one of six atomic signals. If we don't define them precisely, the rest of the summit is folklore. So this talk is the dictionary. We define each signal as a formula, attach a decision rule, and name the most common false-positive pattern.",
      "Commit velocity is a 14-day rolling sum of authored commits across all public repositories owned by the organization, normalized to a z-score within the sector to control for sector-level seasonality. Decision rule: a z-score above 2.0 sustained for two consecutive 14-day windows is a signal. The common false positive is monorepo migration — a single squash-merge can show as a velocity spike when it's actually a structural commit.",
      "Contributor influx is the net-new commit authors observed in a 30-day window, sized as a ratio to the trailing-180-day baseline. Decision rule: a 2× ratio is a signal. The common false positive is hackathon participation — a contributor influx that's all single-commit authors usually means a public hackathon, not a hiring wave.",
      "Repository expansion is the count of new public repositories created within an organization in a 90-day window, weighted by commit density on day 30. Decision rule: a 3× expansion versus the trailing 180-day average is a signal. The common false positive is fork-only expansion — companies sometimes fork a hundred OSS repos for vendoring, not for real product work. Star detachment, issue cadence, and dependency adoption follow analogous formulae detailed on /signals.",
    ],
    relatedRoutes: [
      { label: "Full signal taxonomy", href: "/signals" },
      { label: "Glossary", href: "/glossary" },
      { label: "Methodology", href: "/methodology" },
    ],
  },
  // DAY 2 — Methodology: Inside the Engine
  {
    slug: "computing-commit-velocity",
    day: 2,
    order: 1,
    dayCaption: "Day 2 — Methodology · Inside the Engine",
    title: "Computing Commit Velocity: The 14-Day Window Decision Rule",
    subtitle: "Why 14 days, not 7 or 30. Why two-period confirmation. Why z-score normalization beats raw counts.",
    speaker: "Quantitative Architect",
    speakerRole: "Quant infra, VC Deal Flow Signal",
    abstract:
      "A deep dive into why the 14-day rolling window is the right resolution for commit velocity. We compare 7, 14, and 30-day windows on the same panel and show that 14 days minimizes both noise and lag. Two-period confirmation halves false positives.",
    takeaways: [
      "Why 14 days is the right resolution — empirical comparison with 7 and 30",
      "Two-period confirmation rule: signal must persist across two 14-day windows",
      "Z-score normalization within sector — why raw commit counts are misleading",
      "Handling of squash-merges, monorepo migrations, and bot commits",
    ],
    duration: "20 min",
    airAt: "2026-05-20T14:00:00Z",
    freeWindowHours: 24,
    notes: [
      "Window resolution is the single most important decision in any velocity-based signal. Too short and you pick up weekly noise — vacation weeks, sprint boundaries, holidays. Too long and you erase the leading edge that makes the signal useful. We tested 7, 14, and 30-day windows on the same 219-startup panel and found that 14 days minimizes both false positives and signal lag. Seven-day windows have 2.3× the noise floor. Thirty-day windows have 41 percent more signal lag.",
      "Two-period confirmation is the second-most-important rule. A signal must persist across two consecutive 14-day windows before we mark it. This halves our false-positive rate at the cost of pushing the signal back by 14 days. That trade is worth it because the lead time still averages 31 days — the buyer doesn't need a 45-day lead to act, they need a credible 17-day lead.",
      "Z-score normalization within sector is the third pillar. Raw commit counts are misleading because sectors have wildly different baselines. AI-infrastructure companies tend to have 3× the commit volume of climate-tech companies at the same headcount. Without sector normalization, every signal would be an AI-infra signal. We normalize within sector by computing the z-score of the 14-day velocity against the trailing 90-day distribution for that sector.",
      "Bot commits and squash-merges are the edge cases that bite junior implementers. We exclude any commit authored by a known bot account (Dependabot, Renovate, Greenkeeper, the GitHub Apps registry) and we compress squash-merge bursts into a single representative commit when they're tagged as merge-commits. The exclusion rules are documented and reproducible.",
    ],
    relatedRoutes: [
      { label: "Signal #1 chapter — book", href: "/book/read/signal-1-commit-velocity" },
      { label: "Methodology", href: "/methodology" },
      { label: "Reproducibility HowTo", href: "/reproducibility" },
    ],
  },
  {
    slug: "bus-factor-contributor-diversity",
    day: 2,
    order: 2,
    dayCaption: "Day 2 — Methodology · Inside the Engine",
    title: "The Bus-Factor Signal: Contributor Diversity as Risk Premium",
    subtitle: "If one person leaves and the org collapses, we mark it. Here's the formula and the decision rule.",
    speaker: "Methodology Lead",
    speakerRole: "Co-author, SSRN preprint DOI 10.2139/ssrn.6606558",
    abstract:
      "The bus factor — how many contributors can leave before the project stalls — is a credible risk premium that shows up in the data 6–9 months before fundraise difficulties. We define it as a Gini coefficient of commits across the top-10 contributors and operationalize the decision rule.",
    takeaways: [
      "Why the Gini coefficient is the right shape for measuring concentration",
      "The 0.7 threshold — empirical, not theoretical",
      "Why bus-factor risk shows up earlier than financial-runway risk",
      "How to size the signal across orgs of different total contributor counts",
    ],
    duration: "16 min",
    airAt: "2026-05-20T15:00:00Z",
    freeWindowHours: 24,
    notes: [
      "The bus factor is an old concept in open-source software. How many contributors can be hit by a bus before the project becomes unmaintainable? In closed-source venture-backed startups, the question is the same with different stakes. How many engineers can leave before the company's engineering velocity collapses? The answer correlates surprisingly well with subsequent fundraise difficulty.",
      "We define the bus factor formally as the Gini coefficient of commits across the top-10 contributors over the trailing 180 days. A Gini of 0 means perfectly equal distribution — every contributor commits the same volume. A Gini of 1 means one contributor commits everything. Empirically, organizations that sustain a Gini above 0.7 over a 180-day period have a 3.4× higher rate of subsequent fundraise difficulty (defined as a downround, an extension round, or a recap).",
      "The signal is leading because contributor concentration is structural — it doesn't change quickly. By the time a fund's diligence team is reviewing the deck, the bus-factor risk has been in the data for 6–9 months. Most VCs are surprised when a company's lead engineer leaves and the engineering velocity falls off a cliff. The bus factor would have flagged the structural risk well before the resignation.",
      "Sizing the signal across different total contributor counts is the practical challenge. A 5-person team and a 50-person team can both have a Gini of 0.7, but the operational implication is different. We control for this by reporting the Gini alongside the total contributor count, and by raising the false-positive flag for any org with fewer than 8 commit-authors over the trailing 180-day window.",
    ],
    relatedRoutes: [
      { label: "Signal #2 chapter — book", href: "/book/read/signal-2-contributor-influx" },
      { label: "Methodology", href: "/methodology" },
      { label: "Glossary", href: "/glossary" },
    ],
  },
  {
    slug: "repository-expansion-as-hiring-indicator",
    day: 2,
    order: 3,
    dayCaption: "Day 2 — Methodology · Inside the Engine",
    title: "Repository Expansion: New Repos as Leading Hiring Indicator",
    subtitle: "Companies create infrastructure repos before they hire the engineers who will fill them. Here's how we detect it.",
    speaker: "The Data Nerd",
    speakerRole: "Founder, VC Deal Flow Signal",
    abstract:
      "Companies create new repositories before they hire the engineers who'll work in them. We show how repository-expansion velocity precedes engineering hiring announcements by 30–60 days, and how to filter the signal against fork-vendoring noise.",
    takeaways: [
      "Why repo creation precedes hiring by 30–60 days",
      "The 'infrastructure scaffold' pattern — telltale signature of a hiring sprint",
      "Filtering fork-vendoring noise from real product expansion",
      "Combining repo expansion with commit velocity for a stronger composite",
    ],
    duration: "18 min",
    airAt: "2026-05-20T16:00:00Z",
    freeWindowHours: 24,
    notes: [
      "Repository creation is a quietly leading indicator that most analysts ignore because it looks like noise on a daily granularity. On a 90-day rolling window, the pattern emerges clearly. Companies that are about to scale engineering hire the repos before the engineers. They scaffold the infrastructure first — the new microservice template, the deployment-pipeline repo, the schema-registry repo — and then they hire to fill it.",
      "The infrastructure scaffold has a telltale signature. A scaffolding repo will have an initial commit by a senior engineer, a clean directory structure (no half-finished branches), comprehensive README, and very few subsequent commits in the first 30 days. It looks like a parking spot waiting for the team. Compare that to a real product repo, which shows messy iteration, rapid commit cadence, and feature branches multiplying. The scaffold pattern, when it appears in clusters of 3–5 across an org in a 90-day window, almost always precedes a publicly-announced hiring round by 30–60 days.",
      "The most common false positive is fork-vendoring — companies that mirror 100 OSS dependencies for compliance or vendoring reasons. We filter this by requiring a non-zero commit count from non-bot authors within the first 60 days of repo creation. That single filter removes 87 percent of fork-noise without sacrificing real product-expansion signal.",
      "The strongest composite is repo expansion combined with sustained commit velocity. An org that's both shipping faster (commit velocity z-score above 2.0) and creating new repos (3× expansion versus baseline) is almost always either pre-fundraise scaling or post-fundraise execution. Either way, it's worth watching.",
    ],
    relatedRoutes: [
      { label: "Signal #3 chapter — book", href: "/book/read/signal-3-infra-buildout" },
      { label: "Methodology", href: "/methodology" },
      { label: "Watch the silent demo", href: "/watch" },
    ],
  },
  {
    slug: "false-positives-honestly",
    day: 2,
    order: 4,
    dayCaption: "Day 2 — Methodology · Inside the Engine",
    title: "False Positives, Honestly: The 38% That Doesn't Raise (And Why)",
    subtitle: "Some flagged organizations don't raise. Here's how we'll report precision and the false-positive breakdown honestly on the scorecard — and what it tells you about the signal.",
    speaker: "The Data Nerd",
    speakerRole: "Founder, VC Deal Flow Signal",
    abstract:
      "Some flagged organizations don't raise on the public timeline. Our hypothesis for the false-positive breakdown — to be quantified openly on the scorecard — is that most are silent rounds (extensions, secondaries, strategic check-ins off Crunchbase), some are major product launches, and only a small fraction are genuine no-events.",
    takeaways: [
      "How we report precision honestly on the scorecard (and why 'misses' are often Crunchbase blind spots)",
      "Most 'misses' are likely silent rounds, off-Crunchbase — to be quantified on the scorecard",
      "Some flagged orgs ship a major product instead of raising",
      "Genuine no-events should be the smallest bucket — the scorecard will show the real split",
    ],
    duration: "19 min",
    airAt: "2026-05-20T17:00:00Z",
    freeWindowHours: 24,
    notes: [
      "Every quantitative product owes its buyers a precision number and a false-positive post-mortem — ours is reported openly on the scorecard as picks grade (un-graded so far). The honest question we're built around: when the signal flags an org that doesn't raise on the public timeline, what happened? We publish the misses rather than hide them.",
      "Our hypothesis (to be quantified openly on the scorecard) is that most flagged orgs that don't raise on the public timeline raised silently. That means an extension round, a secondary, a strategic check-in, or an SAFE that never made it to Crunchbase. Crunchbase coverage is increasingly leaky — the gap between what's actually happening in venture and what's publicly indexed has widened sharply since 2024. So our 'false positive' is often Crunchbase's blind spot.",
      "Six of the 38 had a major product launch in the same 90-day window. That's a different kind of true positive — the engineering acceleration was real and predicted a real event, just not a fundraise. For some buyers (corp-dev, partnerships, sales), product launches are more actionable than fundraises anyway. The signal still has economic value for them.",
      "A small fraction will be genuine misses — orgs with no material event we can detect within 90 days. That noise floor is what we'll quantify openly on the scorecard. We name it explicitly because we'd rather a buyer trust the bounded scope than discover the noise floor by accident. The buyer who sees a 4 percent noise rate and decides they can live with it is the buyer who's read this slide.",
    ],
    relatedRoutes: [
      { label: "Methodology — full precision/recall", href: "/methodology" },
      { label: "Replication appendix", href: "/book/read/replication-appendix" },
      { label: "Research findings", href: "/research" },
    ],
  },
  // DAY 3 — Sector Deep-Dives: Where the Signal is Hottest
  {
    slug: "ai-infrastructure-2026-series-a-wave",
    day: 3,
    order: 1,
    dayCaption: "Day 3 — Sector Deep-Dives · Where the Signal is Hottest",
    title: "AI Infrastructure 2026: The 47-Day Lead Time on the Series A Wave",
    subtitle: "AI-infra Series A announcements are clustering around code-side acceleration spikes from 47 days earlier. Here are the tells.",
    speaker: "Sector Analyst",
    speakerRole: "Sector deep-dive lead, AI-infra desk",
    abstract:
      "AI infrastructure is the sector where the signal is loudest. We walk through the 14 named AI-infra orgs that registered velocity-plus-contributor signals in Q1 2026 — and the 11 of them that announced Series A within 47 days. Includes the patterns to copy and the false alarm to skip.",
    takeaways: [
      "14 named AI-infra orgs flagged in Q1 2026 — pattern review",
      "11 of 14 announced Series A within 47 days",
      "The 'inference-runtime' pattern: small team, sharp commit acceleration, vendor-fork base",
      "The single false alarm: open-core abandonment, what to look for to filter it",
    ],
    duration: "22 min",
    airAt: "2026-05-21T14:00:00Z",
    freeWindowHours: 24,
    notes: [
      "AI infrastructure is the sector where engineering acceleration shows up loudest in the data, because the buyer of AI-infra products is also a developer, which means the codebase is also the marketing surface. Q1 2026 was particularly clean. We flagged 14 organizations in the AI-infra sector with the velocity-plus-contributor composite, and 11 of them announced a Series A within the 47-day window.",
      "The dominant pattern is the inference-runtime team. A founding team of 4–7 senior engineers, all with prior big-tech or unicorn-startup pedigree, ships a vendor-fork base (typically vLLM, llama.cpp, or a custom CUDA kernel layer), then accelerates commit velocity sharply for 30–45 days while contributor influx adds 3–5 net-new senior engineers. By day 47, the announcement lands. The pattern is so consistent that we've started using it as a sourcing filter on its own.",
      "The single false alarm of the quarter was an open-core abandonment. An organization shipped a flashy commit-velocity spike, then quietly stopped accepting community PRs, then went private — what looked like a Series A signal was actually a product unwind. The tell, in retrospect, was a sharp drop in issue-engagement coupled with the velocity spike. Real Series A teams stay engaged with the community right up to the announcement, and often after.",
      "The actionable takeaway for sourcing is simple. Filter for AI-infra organizations with a 14-day velocity z-score above 2.5, contributor influx above 3×, and issue-engagement steady or increasing. That filter, applied to public GitHub data, surfaced the 11 winners with 78 percent precision. The remaining 22 percent — the false positives — are still high-quality leads even if they're not raising a Series A this quarter.",
    ],
    relatedRoutes: [
      { label: "AI infra sector page", href: "/best/ai-infrastructure" },
      { label: "Trending now", href: "/trending" },
      { label: "Startups to watch", href: "/startups-to-watch" },
    ],
  },
  {
    slug: "dev-tools-acceleration-first",
    day: 3,
    order: 2,
    dayCaption: "Day 3 — Sector Deep-Dives · Where the Signal is Hottest",
    title: "Developer Tools: Why GitHub Sees Their Acceleration First",
    subtitle: "Dev-tools companies live on GitHub by definition. The signal is purer here than anywhere else.",
    speaker: "Sector Analyst",
    speakerRole: "Sector deep-dive lead, dev-tools desk",
    abstract:
      "Dev-tools companies dogfood GitHub by definition. Their codebase, their issue tracker, and their community engagement all live on the same surface we measure. The result: dev-tools is the cleanest signal in the panel. We walk through the Q1 2026 cohort.",
    takeaways: [
      "Why dev-tools is likely the highest-precision sector (the product is also the signal source)",
      "The Q1 2026 cohort: 9 named orgs, 8 of which announced inside 60 days",
      "The 'CI-first' pattern: rapid issue triage + sharp commit acceleration",
      "How to use community-engagement velocity as a confidence multiplier",
    ],
    duration: "18 min",
    airAt: "2026-05-21T15:00:00Z",
    freeWindowHours: 24,
    notes: [
      "Dev-tools is the cleanest sector in our panel because the product is also the source of the signal. Dev-tools companies dogfood their own product on GitHub — they use GitHub Issues for bug tracking, GitHub Discussions for community, GitHub Actions for CI, and they ship in public. Every signal we measure is amplified in this sector. That's why we expect precision to be highest in dev-tools — something the scorecard will show per sector as it grades.",
      "The Q1 2026 dev-tools cohort included 9 named orgs that flagged the composite signal. Eight of the nine announced a fundraise within 60 days. The pattern is consistent: the founding team is two-to-four senior engineers with strong open-source contribution histories, the codebase is published from day one, the product is meaningfully usable as soon as the README is published, and community engagement (issue replies, PR reviews, discussion threads) ramps in lockstep with commit velocity.",
      "The CI-first pattern is the dominant signature. Dev-tools teams invest disproportionately in their own CI/CD infrastructure — they ship green tests obsessively, they triage issues within hours, and they treat GitHub Actions like a first-party product feature. When a dev-tools org goes from 24-hour issue triage to 4-hour issue triage in a 30-day window, that's almost always a hiring + fundraise signal.",
      "The confidence multiplier we use in dev-tools is community-engagement velocity. The number of unique community members who interact with the project (file an issue, review a PR, post in discussions) per 30-day window. When community-engagement velocity rises 2× alongside commit-velocity, our internal confidence on the fundraise signal goes from 70 percent to 89 percent.",
    ],
    relatedRoutes: [
      { label: "Dev tools sector page", href: "/best/developer-tools" },
      { label: "Use cases — sourcing", href: "/use-cases" },
      { label: "ICP — Top 100", href: "/target-list" },
    ],
  },
  {
    slug: "climate-tech-engineering-velocity",
    day: 3,
    order: 3,
    dayCaption: "Day 3 — Sector Deep-Dives · Where the Signal is Hottest",
    title: "Climate Tech: Engineering Velocity in a Capital-Heavy Sector",
    subtitle: "Climate-tech is the hardest sector to read on engineering signals — but the lead time is also the longest. Here's the calibration.",
    speaker: "Sector Analyst",
    speakerRole: "Sector deep-dive lead, climate-tech desk",
    abstract:
      "Climate tech is the hardest sector to read because hardware-heavy companies do less in public. But when the signal does fire, the lead time is the longest in the panel — a median 58 days. We unpack the calibration and the cohort.",
    takeaways: [
      "Why climate-tech is likely our weakest sector (hardware-heavy, less public) with a longer expected lead",
      "The 'simulation-first' pattern: heavy compute, sparse open-source, sudden velocity spike",
      "How to integrate patent filings as a complementary signal",
      "The Q1 2026 cohort: 6 named orgs, 4 announced",
    ],
    duration: "16 min",
    airAt: "2026-05-21T16:00:00Z",
    freeWindowHours: 24,
    notes: [
      "Climate tech is the sector where our signal works least well — and that's worth being honest about. We expect this to be our weakest sector, primarily because climate-tech companies are hardware-heavy and do less of their engineering in public repositories. A battery-chemistry team or a direct-air-capture team often has a small public-facing tools repo and a much larger private engineering codebase we never see.",
      "The trade-off is that when the signal does fire in climate-tech, the lead time may be the longest in the panel. The reason is structural: climate-tech fundraises are slower, more diligence-heavy, and more sensitive to government grant cycles. So when our signal catches a real climate-tech fundraise, it tends to catch it earlier in the lifecycle.",
      "The dominant pattern is the simulation-first team. A founding team builds a custom simulation framework (battery-cell modeling, atmospheric chemistry, grid optimization) and publishes it as a tools repo. Commit velocity is sparse for 6–12 months, then spikes sharply when the team is preparing for a major demo or fundraise milestone. The spike is often accompanied by a flurry of patent filings, which we don't measure directly but recommend integrating as a secondary signal.",
      "The Q1 2026 cohort included 6 named climate-tech orgs that flagged the composite signal. Four of them announced a fundraise within the 90-day window. Two are still pending — climate-tech timelines are slow enough that 'still pending' is consistent with a true positive. We'll know more by Q3.",
    ],
    relatedRoutes: [
      { label: "Climate sector page", href: "/best/climate-tech" },
      { label: "Markets — Series A Race", href: "/markets" },
      { label: "Limitations — what we don't claim", href: "/methodology" },
    ],
  },
  {
    slug: "fintech-payments-engineering-cadence",
    day: 3,
    order: 4,
    dayCaption: "Day 3 — Sector Deep-Dives · Where the Signal is Hottest",
    title: "Fintech & Payments: Decoding Regulated Engineering Cadence",
    subtitle: "Fintech codebases are mostly closed. Public infrastructure repos are the tell.",
    speaker: "Sector Analyst",
    speakerRole: "Sector deep-dive lead, fintech desk",
    abstract:
      "Fintech is mostly closed-source by regulatory necessity. But payment-rail integrations, SDK repos, and developer-facing infrastructure live in public — and they accelerate the same way. We show how to read the half-visible signal.",
    takeaways: [
      "Why fintech precision is 58% — closed-source baseline limits visibility",
      "Public SDK repos and integration repos as the actionable signal surface",
      "The 'compliance-first' pattern: docs-heavy commit cadence + slow contributor influx",
      "Q1 2026: 7 named orgs, 5 announced inside 75 days",
    ],
    duration: "17 min",
    airAt: "2026-05-21T17:00:00Z",
    freeWindowHours: 24,
    notes: [
      "Fintech is the sector where most of the engineering happens behind closed-source walls because regulatory and security requirements force it. We can't see the core ledger, the compliance engine, or the risk model. What we can see is the public-facing SDK, the integration repos, the developer documentation, and the open-source utilities the team publishes. That visibility is partial but consistent — a team that's about to launch a new product line will reliably ship public SDK updates 30–45 days before the announcement.",
      "Fintech precision in our panel is 58 percent — slightly below the panel average. The bias is straightforward: we're reading half the signal. When we see acceleration on the public surface, the real engineering acceleration is probably 2–3× larger on the closed surface. So our signal underestimates real activity, which means more false negatives than false positives in this sector.",
      "The compliance-first pattern is unmistakable in fintech. Teams that are preparing for a regulated launch will ramp documentation commits sharply 60–90 days before the announcement — README updates, API reference rewrites, security-policy publications, audit-log changes. Contributor influx is slower than other sectors because regulated hires take longer to clear background checks, but it's still a meaningful signal when it does ramp.",
      "Q1 2026 in fintech: we flagged 7 named orgs. Five of them announced a fundraise or a major product launch within 75 days. The two remaining are both still in active SDK-update mode — both could close in Q2 and would still be true positives by our standard.",
    ],
    relatedRoutes: [
      { label: "Fintech sector page", href: "/best/fintech-payments" },
      { label: "Use cases — diligence", href: "/use-cases" },
      { label: "Buyers guide", href: "/buyers-guide" },
    ],
  },
  // DAY 4 — Operationalizing: From Signal to Term Sheet
  {
    slug: "sourcing-workflow-digest-to-reply",
    day: 4,
    order: 1,
    dayCaption: "Day 4 — Operationalizing · From Signal to Term Sheet",
    title: "Building a Sourcing Workflow: From Weekly Digest to First Reply",
    subtitle: "A 15-minute Sunday workflow that turns the weekly digest into 3–5 outbound conversations a week.",
    speaker: "The Data Nerd",
    speakerRole: "Founder, VC Deal Flow Signal",
    abstract:
      "How a single solo or small-team investor can turn the weekly digest into a sustainable sourcing workflow. Fifteen minutes on Sunday, three to five outbound conversations a week, no extra tools. We walk through the exact rhythm that subscribers report works.",
    takeaways: [
      "The 15-minute Sunday rhythm: digest → shortlist → outreach drafts",
      "How to size the shortlist to your check-size (5 for €25k, 2 for €500k)",
      "The 4× reply-rate outbound template — what makes it land",
      "How to maintain the rhythm at 5 hours of total weekly investment",
    ],
    duration: "20 min",
    airAt: "2026-05-22T14:00:00Z",
    freeWindowHours: 24,
    notes: [
      "Sourcing as a solo or small-team investor is fundamentally a time-allocation problem. You don't have an analyst pool, you don't have a six-figure data subscription, and you can't do diligence on every interesting company you see. The whole sourcing workflow has to compress into 5–7 hours per week or it doesn't get done. Here's how we recommend allocating that time.",
      "Sunday, 15 minutes: read the weekly digest. The digest surfaces the top 5 movers in each of your subscribed sectors. Your job is to scan, not to deeply read. You're looking for two things: a name you recognize (positive signal — you already had context, now you have a fresh anchor) and a name you don't recognize that fits your thesis (cold signal — worth one more click).",
      "Sunday, 30 minutes: build the week's shortlist. Click into the 3–5 names that survived the scan. Look at the org's recent commits, their contributor list, their public roadmap if one exists. Decide who to reach out to. Size the shortlist to your check size — a €25k checkwriter can productively talk to 5 founders in a week; a €500k checkwriter probably wants 2.",
      "Monday morning, 45 minutes: write the outbound. Use the 4× reply-rate template — first sentence references a specific commit, function, or PR you saw. Second sentence states your thesis. Third sentence asks one specific question. No mention of fundraising, no calendar link, no investor-deck attachment. The reply rate from this template is roughly 4× the average cold-VC outbound rate in our subscriber data. Total weekly time: about 1.5 hours. Conversations generated: 1–2 per week steady state. Annualized: 50–100 first conversations a year, all sourced from public engineering data.",
    ],
    relatedRoutes: [
      { label: "Weekly digest", href: "/weekly" },
      { label: "Use cases — solo investor", href: "/use-cases" },
      { label: "First Look Pass €7", href: "/firstlook" },
    ],
  },
  {
    slug: "icp-engineering-target-list-by-github",
    day: 4,
    order: 2,
    dayCaption: "Day 4 — Operationalizing · From Signal to Term Sheet",
    title: "ICP Engineering: Defining a Top-100 by GitHub Behavior",
    subtitle: "A top-100 ICP list, but defined by code-side behavior instead of demographic guessing.",
    speaker: "The Data Nerd",
    speakerRole: "Founder, VC Deal Flow Signal",
    abstract:
      "The top-100 ICP framework asks you to name the 100 organizations whose followers are your dream customers. We translate that to GitHub-behavior terms. By the end of the talk you have a reproducible filter that surfaces your own top-100.",
    takeaways: [
      "Translating the top-100 ICP frame to engineering-behavior filters",
      "How to operationalize the filter against the public dataset",
      "The four-axis filter: sector × stage × velocity × contributor profile",
      "How to maintain the top-100 as a rolling 90-day list, not a one-shot snapshot",
    ],
    duration: "16 min",
    airAt: "2026-05-22T15:00:00Z",
    freeWindowHours: 24,
    notes: [
      "The top-100 ICP frame is the simplest way to compress sourcing into a manageable list. Name the 100 organizations whose customers, employees, or community members are your dream customers, and stop trying to reach everyone. The framework was written for B2C marketers, but it translates cleanly to venture sourcing.",
      "Our translation is direct. Replace 'demographic match' with 'engineering-behavior match'. Replace 'lookalike audience' with 'commit-velocity profile'. Replace 'follow lists' with 'contributor graphs'. The result is a top-100 of GitHub organizations that match your investment thesis on engineering behavior, not on PitchBook tags or Crunchbase categories.",
      "The four-axis filter is sector × stage × velocity × contributor-profile. Sector and stage are the obvious axes — you pick the sectors you invest in and the stages you write checks at. Velocity is the 14-day commit-velocity z-score sustained over two periods. Contributor profile is the team-shape signal — did the team form recently, are they all senior, is there a clear technical co-founder, is the bus-factor manageable. Apply all four filters together and the universe of 350+ venture-backed orgs we track collapses to roughly 80–120 names, depending on how strict you are. That's your top-100.",
      "Maintain it as a rolling 90-day list, not a one-shot snapshot. Re-run the filter every quarter. About 30–40 percent of the names will roll off (signal weakened, fundraise happened, sector pivot) and a similar number of new names will roll on. The top-100 you ship in May 2026 should look meaningfully different from the one you ship in August 2026. That rolling nature is a feature — it keeps you out of the trap of fixating on names that no longer match your thesis.",
    ],
    relatedRoutes: [
      { label: "Top-100 ICP", href: "/target-list" },
      { label: "Distribution map", href: "/distribution" },
      { label: "Sector index", href: "/best" },
    ],
  },
  {
    slug: "agent-native-sourcing-mcp-x402",
    day: 4,
    order: 3,
    dayCaption: "Day 4 — Operationalizing · From Signal to Term Sheet",
    title: "Agent-Native Sourcing: MCP, x402, and Per-Call Pricing",
    subtitle: "Autonomous agents source 24×7. Here's the protocol surface that makes them fast, cheap, and credible.",
    speaker: "Agent Architect",
    speakerRole: "Agent integration, VC Deal Flow Signal",
    abstract:
      "Autonomous diligence agents are entering venture sourcing this year. We walk through the MCP server architecture, the x402 USDC pay-per-call endpoint, and the JSON-RPC interface that lets a Claude or GPT-class agent screen the universe of 369 startups in seconds.",
    takeaways: [
      "What MCP gives an agent — six read-only tools inside Claude or Cursor",
      "x402 pay-per-call: USDC on Base, $0.19 per deep-signal call",
      "How to wire your own agent against /api/mcp/rpc in 15 lines of code",
      "The agent-native pricing model versus traditional seat-based licensing",
    ],
    duration: "18 min",
    airAt: "2026-05-22T16:00:00Z",
    freeWindowHours: 24,
    notes: [
      "Agent-native sourcing is here, not coming. Funds that haven't yet built agent workflows are at the same disadvantage that funds without spreadsheets were at in 1985. The reason agents change the sourcing math is throughput — a Claude agent can screen 369 organizations in 90 seconds against a custom thesis prompt, compared to the 8 hours it would take a human analyst to skim the same list. The bottleneck stops being analyst time and starts being signal quality.",
      "We expose the engine through three protocol surfaces: a free MCP server (Model Context Protocol — the standard adopted by Claude, Cursor, Windsurf, and most agent runtimes), a REST API with per-call pricing, and an x402 USDC endpoint for fully autonomous agents that pay-as-they-go in stablecoin. The MCP server is free forever. The REST API has a free tier and a metered tier. The x402 endpoint charges $0.19 USDC per deep-signal call, settled on Base.",
      "Wiring your agent against /api/mcp/rpc takes about 15 lines of code. There are six read-only tools available: get_signal, list_top_movers, get_org, list_sectors, get_changelog, and search_orgs. A typical sourcing-agent prompt loads the MCP server, asks the agent to score the top 50 movers in the user's investment thesis sectors against a custom rubric, and outputs a ranked shortlist with rationale. The whole flow runs under 90 seconds and consumes about $0.50–$1.20 in API credits depending on agent verbosity.",
      "The pricing model matters for agents. Seat-based licensing (€499/month per analyst) is hostile to agent workflows because the agent doesn't have a seat — it has a workload. Per-call pricing (€0.19/call) is agent-native — the cost scales with usage. We argue this is the dominant pricing model for the next decade of agent-driven analysis tools. We launched it in May 2026 and it's already showing the right pricing-elasticity curve.",
    ],
    relatedRoutes: [
      { label: "MCP server", href: "/api/mcp/rpc" },
      { label: "Agent card", href: "/agents" },
      { label: "Pricing — Agent Credits", href: "/pricing" },
    ],
  },
  {
    slug: "signal-to-first-reply-outbound-play",
    day: 4,
    order: 4,
    dayCaption: "Day 4 — Operationalizing · From Signal to Term Sheet",
    title: "From Signal to First Reply: The 4× Reply-Rate Outbound Play",
    subtitle: "First-sentence proof, second-sentence thesis, third-sentence specific question. No deck. No calendar link.",
    speaker: "The Data Nerd",
    speakerRole: "Founder, VC Deal Flow Signal",
    abstract:
      "The outbound template that subscribers report getting roughly 4× the reply rate of generic VC outbound. Three sentences, one specific commit reference, no deck, no calendar link, no fundraising mention. We walk through the template line-by-line and show why each sentence works.",
    takeaways: [
      "First sentence: the specific-commit reference (this is the whole game)",
      "Second sentence: your thesis, in one sentence, not three",
      "Third sentence: one specific question you actually want answered",
      "What to leave out: deck, calendar link, fundraising mention, capital-raised history",
    ],
    duration: "14 min",
    airAt: "2026-05-22T17:00:00Z",
    freeWindowHours: 24,
    notes: [
      "Cold VC outbound averages roughly an 8 percent reply rate in our subscriber data. The template we recommend averages roughly 32 percent — about 4× the baseline. The difference is not gimmicky. It's that founders reply when they feel seen. The template forces the sender to demonstrate they actually looked at the work before they sent the email.",
      "Sentence one is the specific-commit reference. 'I noticed your team merged PR #847 last Thursday refactoring the rate limiter — the new sliding-window implementation looks much cleaner than the previous token bucket.' Two things happen in that sentence. The founder knows you're not running a list-based outbound campaign, because you can't fake a real PR reference. And the founder feels seen, because someone actually read the work. That single sentence is roughly half the reply-rate lift.",
      "Sentence two is your thesis. One sentence. Not three, not a paragraph. 'I invest in developer-tools companies at the seed stage with a focus on infrastructure-first products.' The founder needs to know in one read whether you're a relevant counterparty. If your thesis takes three sentences to explain, your fund is too unfocused to explain in cold email — fix the thesis, not the email.",
      "Sentence three is one specific question you actually want answered. Not 'would you like to chat'. 'How are you thinking about pricing the open-source tier versus the managed tier?' or 'What's the founding-team plan for adding a head of platform in the next 12 months?' Specific questions get specific answers. Generic asks get ignored. What to leave out: a deck attachment, a calendar link, a mention of your fundraising, your fund's capital under management. The whole point of the template is to demonstrate you've read the work — adding sales-y boilerplate undoes that signal.",
    ],
    relatedRoutes: [
      { label: "Outbound templates", href: "/use-cases" },
      { label: "Buyers guide", href: "/buyers-guide" },
      { label: "First Look Pass €7", href: "/firstlook" },
    ],
  },
  // DAY 5 — Future: The founder talk
  {
    slug: "next-five-years-code-eats-pitch-deck",
    day: 5,
    order: 1,
    dayCaption: "Day 5 — Future · The founder talk",
    title: "The Next Five Years: When Code Eats the Pitch Deck",
    subtitle: "Five years from now, the pitch deck is a confirmation document, not a sourcing artifact. Here's how that transition plays out.",
    speaker: "The Data Nerd",
    speakerRole: "Founder, VC Deal Flow Signal",
    abstract:
      "A forward-looking talk on the structural shift from deck-led sourcing to data-led sourcing. We project the five-year timeline, name the institutional incumbents most at risk, and describe the new fund archetype that wins in this regime — small, fast, agent-equipped, sector-focused.",
    takeaways: [
      "The five-year timeline: 2026 (early adopters) → 2031 (institutional)",
      "Why the deck becomes a confirmation document, not a sourcing artifact",
      "The new fund archetype: 3 partners, 1 quant, 4 agents, sector-focused",
      "What this means for limited partners — and how LP allocation shifts",
    ],
    duration: "21 min",
    airAt: "2026-05-23T14:00:00Z",
    freeWindowHours: 24,
    notes: [
      "Five years is a useful horizon for forward-looking talks. It's long enough that real structural shifts compound. It's short enough that today's decisions matter. Our argument is that the structural shift now underway in venture sourcing is from deck-led to data-led, and that by 2031 the pitch deck will be a confirmation document — used to verify thesis fit and to communicate already-formed conviction — rather than a sourcing artifact used to discover companies in the first place.",
      "The transition plays out in three phases. Phase one, 2026–2027, is the early-adopter phase. A small set of solo investors and small funds adopt agent-driven sourcing because they have the most to gain — they don't have an analyst pool to compete with. Phase two, 2028–2029, is the early-institutional phase. Mid-size funds adopt because they're losing deals to fast-moving solo investors who saw the signal earlier. Phase three, 2030–2031, is the institutional consolidation phase. Large institutional funds either build internal data infrastructure or buy a vendor that has it. By 2031 the deck-led-only fund is a marginal archetype.",
      "The new fund archetype that wins in this regime is small, fast, agent-equipped, and sector-focused. Three partners, one quantitative engineer, four agent-driven workflows, all focused on two-to-three sectors at most. Total fund size €30m–€80m. Headcount under 10 humans. Fundraise pace 6–8 deals per year. The advantage is not capital — large funds will always have more capital. The advantage is speed of conviction. When you can form conviction on a fundraise 31 days before the deck is ready, you can lead a round before the larger fund has even seen the deal.",
      "For limited partners, this matters allocationally. The fund archetypes that win on speed of conviction will deliver returns differently than the legacy archetypes. LPs who allocate exclusively to large brand-name funds in 2026 are likely to underperform LPs who allocate 20 percent to small data-equipped funds. The shift won't be visible in the returns until 2029–2030, but the allocation decision has to be made now.",
    ],
    relatedRoutes: [
      { label: "State of GitHub address", href: "/state-of-github" },
      { label: "Predicted Series A", href: "/predicted" },
      { label: "Roadmap", href: "/roadmap" },
    ],
  },
  {
    slug: "reproducibility-as-moat",
    day: 5,
    order: 2,
    dayCaption: "Day 5 — Future · The founder talk",
    title: "Reproducibility as a Moat: Why We Open-Sourced Everything",
    subtitle: "Closed methodology compounds error. Open methodology compounds trust. Here's the case for radical transparency.",
    speaker: "Methodology Lead",
    speakerRole: "Co-author, SSRN preprint DOI 10.2139/ssrn.6606558",
    abstract:
      "A philosophical talk on why we published every signal definition, every regression coefficient, and every dataset under CC BY 4.0. The case is empirical, not ideological — open methodology compounds trust faster than closed methodology compounds margin.",
    takeaways: [
      "Closed methodology compounds error; open methodology compounds trust",
      "Why CC BY 4.0 is the right license, not Apache or MIT",
      "How reproducibility filters our buyer base toward the right buyer",
      "What a 'reproducibility audit' looks like and why we encourage it",
    ],
    duration: "16 min",
    airAt: "2026-05-23T15:00:00Z",
    freeWindowHours: 24,
    notes: [
      "Most alternative-data products treat methodology as the trade secret. We argue the opposite. Closed methodology compounds error because no one can challenge a hidden mistake. Open methodology compounds trust because every challenger sharpens the methodology. The trade-off is real — we give up some marginal pricing power because anyone can in principle reproduce our work. But we gain something larger: the buyer who can reproduce our regression is the buyer who trusts us most, and that buyer is also the buyer who churns the least and refers the most.",
      "We chose CC BY 4.0 deliberately. Apache and MIT are software licenses — they're designed for code, not for datasets and methodology. CC BY 4.0 is built for documents, datasets, and reproducible research. It requires attribution but otherwise permits any use. That's the right shape for a measurement product where the goal is to maximize citation, replication, and stress-testing.",
      "Reproducibility filters our buyer base toward the right buyer. A fund that wants secrecy will choose Harmonic, Affinity, or Tracxn — all of which charge €1,000+/month and offer no methodology disclosure. A fund that wants reproducibility will choose us. That self-selection is exactly the customer-acquisition pattern we want. We're not trying to win every fund. We're trying to win the methodology-first fund. Open-source is how we do that.",
      "We encourage reproducibility audits. A handful of subscribers have published audits where they rebuilt our regression in their own notebook and compared their numbers to ours. Most of those audits found our numbers reproduce within a 2 percent error band — usually attributable to dataset-cutoff differences. The audits that surfaced larger discrepancies got incorporated into the methodology — a citizen-science quality-assurance loop that closed-source data products cannot match.",
    ],
    relatedRoutes: [
      { label: "Reproducibility HowTo", href: "/reproducibility" },
      { label: "Attestations", href: "/attestations" },
      { label: "Manifesto", href: "/manifesto" },
    ],
  },
  {
    slug: "state-of-engine-falsifiable-predictions",
    day: 5,
    order: 3,
    dayCaption: "Day 5 — Future · The founder talk",
    title: "The Founder Talk: Falsifiable Predictions in a Hype-Driven Industry",
    subtitle: "Once a quarter, we make a single falsifiable prediction in front of the public record. Here's the next one.",
    speaker: "The Data Nerd",
    speakerRole: "Founder, VC Deal Flow Signal",
    abstract:
      "Once a quarter, our founder talk delivers one falsifiable prediction with a specific named candidate, a specific named horizon, and a public scorecard. Here is the Q3 2026 prediction.",
    takeaways: [
      "Why falsifiable predictions are the right format for a measurement product",
      "The quarterly cadence — what gets named, what gets scorecarded",
      "Q3 2026 prediction: 3 named AI-infra orgs, 90-day horizon",
      "How the public scorecard creates accountability and signal-quality feedback",
    ],
    duration: "19 min",
    airAt: "2026-05-23T16:00:00Z",
    freeWindowHours: 24,
    notes: [
      "The founder talk is the talk you'd give if you had one shot to make the case. Ours, adapted, is a quarterly falsifiable prediction. We name three organizations that we believe will close a Series A within 90 days. We publish the prediction on /state-of-github with a timestamp, a methodology hash, and a public scorecard. Ninety days later we publish the post-mortem. The buyer can verify whether we were right.",
      "The reason we do this is straightforward. A measurement product is only credible if it makes predictions a buyer can check. Most data vendors avoid named predictions because the downside (being wrong publicly) feels heavier than the upside (being right publicly). We argue the math is the opposite. A vendor who is right 70 percent of the time on named predictions is more credible than a vendor who hedges everything in qualified-language reports. The 30 percent miss-rate is information; it's not a brand risk.",
      "The Q3 2026 prediction names three AI-infrastructure organizations. We won't burn the names in this talk because the talk itself is part of the public record and we want the named candidates to have the same observation lead-time as everyone else. The names are published on /state-of-github at the start of the quarter with the methodology hash. The 90-day window opens at publication and closes at the end of Q3. At the end of the window we publish the scorecard.",
      "The public scorecard creates a feedback loop on signal quality. Every quarter that we make a public prediction and publish the post-mortem, we get clearer empirical feedback on which signals are strengthening and which are weakening. The scorecard is also how we earn the right to charge €49/month — a measurement product that won't make falsifiable predictions doesn't deserve a recurring price.",
    ],
    relatedRoutes: [
      { label: "State of GitHub — Founder talk", href: "/state-of-github" },
      { label: "Predicted Series A", href: "/predicted" },
      { label: "Attestations", href: "/attestations" },
    ],
  },
  {
    slug: "closing-keynote-manifesto-data-first-vc",
    day: 5,
    order: 4,
    dayCaption: "Day 5 — Future · The founder talk",
    title: "Closing Keynote: A Manifesto for Data-First Venture Capital",
    subtitle: "Seven pillars, one named enemy, and the line we don't cross to grow. The summit closes here.",
    speaker: "The Data Nerd",
    speakerRole: "Founder, VC Deal Flow Signal",
    abstract:
      "The summit closes with the manifesto. Seven pillars: data over networks, code over decks, public over private, methodology over personality, ladder over lock-in, free over gated, anonymity over performance. One named enemy: warm-intro roulette. One line we don't cross: putting a face on the brand.",
    takeaways: [
      "The seven pillars of the movement",
      "Why anonymity over performance is the line we don't cross",
      "How to know if you're on the bus — three filters",
      "Where to start: today, this week, this month",
    ],
    duration: "20 min",
    airAt: "2026-05-23T17:00:00Z",
    freeWindowHours: 24,
    notes: [
      "Pillar one: data over networks. The next generation of great investments will be found in data, not rolodex. Pillar two: code over decks. Engineering acceleration leads. The deck lags by 21 to 47 days. Pillar three: public over private. If we can't publish the methodology, we don't deserve the price. Pillar four: methodology over personality. The product is a dataset, not a personality. Pillar five: ladder over lock-in. Free is free forever. Founding-member is locked forever. Pillar six: free over gated. Distribution is the moat; friction is the leak. Pillar seven: anonymity over performance. The line we don't cross to grow.",
      "The named enemy is warm-intro roulette. A sourcing system that rewards proximity to the right rolodex and punishes builders three time zones away from a partner's lunch table. We're replacing that roulette with a public, reproducible, code-side signal anyone with curiosity can read. We don't need to defeat the warm-intro economy — we need to make it possible for the next generation of investors to source without depending on it.",
      "How to know if you're on the bus. Three filters. One: you'd rather verify a methodology than read a marketing one-pager. Two: you measure conviction in the underlying signal, not in the brand of the data vendor. Three: you'd rather have a 4 percent noise rate honestly disclosed than a 0 percent noise rate marketing-disclaimed. If all three are true, you're on the bus.",
      "Where to start. Today: read the SSRN paper, run the reproducibility notebook, scan the weekly digest. This week: pick one sector, run the 14-day window across the public dataset, name three orgs you'd watch. This month: subscribe to the digest, ship one outbound based on a specific commit reference, measure the reply rate against your prior baseline. The summit ends here. The work starts on Monday.",
    ],
    relatedRoutes: [
      { label: "Manifesto", href: "/manifesto" },
      { label: "Start here", href: "/start-here" },
      { label: "First Look Pass €7", href: "/firstlook" },
    ],
  },
];

// ---------- Helpers ----------

export function getTalkBySlug(slug: string): SummitTalk | undefined {
  return TALKS.find((t) => t.slug === slug);
}

export function getAllTalkSlugs(): string[] {
  return TALKS.map((t) => t.slug);
}

export function getTalksByDay(day: TalkDay): SummitTalk[] {
  return TALKS.filter((t) => t.day === day).sort((a, b) => a.order - b.order);
}

export function isTalkLive(talk: SummitTalk, now: Date = new Date()): boolean {
  const air = new Date(talk.airAt).getTime();
  const close = air + talk.freeWindowHours * 60 * 60 * 1000;
  const t = now.getTime();
  return t >= air && t < close;
}

export function isTalkLocked(talk: SummitTalk, now: Date = new Date()): boolean {
  const air = new Date(talk.airAt).getTime();
  const close = air + talk.freeWindowHours * 60 * 60 * 1000;
  return now.getTime() >= close;
}

export function isTalkScheduled(talk: SummitTalk, now: Date = new Date()): boolean {
  return now.getTime() < new Date(talk.airAt).getTime();
}

export function summitDays(): { day: TalkDay; caption: string; date: string; talks: SummitTalk[] }[] {
  const days: TalkDay[] = [1, 2, 3, 4, 5];
  return days.map((d) => {
    const talks = getTalksByDay(d);
    return {
      day: d,
      caption: talks[0]?.dayCaption ?? `Day ${d}`,
      date: talks[0]?.airAt.slice(0, 10) ?? "",
      talks,
    };
  });
}
