/**
 * Signal-type deep-dive Q&A pairs, one set of six per signal type.
 *
 * Feeds app/qa.jsonl/route.ts (category "signal-type") and complements the
 * two generic per-type questions ("what is X", "what should investors look
 * for in X") already emitted from SIGNAL_TYPES.description / investorInsight.
 * `slug` must match a SIGNAL_TYPES entry in lib/data.ts. Grounded in the
 * /methodology signal-classification rules and each signal's investorInsight.
 */

export interface SignalTypeFAQ {
  slug: string;
  question: string;
  answer: string;
}

export const signalTypeFaqs: SignalTypeFAQ[] = [
  // -------------------------------------------------------------------------
  // Engineering Hiring Burst
  // -------------------------------------------------------------------------
  {
    slug: "hiring-burst",
    question: "How is the Engineering Hiring Burst signal detected?",
    answer:
      "A startup is classified as an engineering hiring burst when its contributor growth rate exceeds 50% over the measurement window, a proxy for rapid team expansion, often following a recent funding round.",
  },
  {
    slug: "hiring-burst",
    question: "What can falsely trigger a hiring burst signal?",
    answer:
      "The most common false positive is a wave of external open-source contributors landing on a popular public repo, which inflates contributor counts without any hiring. The methodology mitigates this by tracking contributor growth on the organization's most active repository and reading it alongside velocity and repo-creation signals rather than in isolation.",
  },
  {
    slug: "hiring-burst",
    question: "Which funding stage does a hiring burst usually indicate?",
    answer:
      "A hiring burst most often appears at seed through Series A/B, where a team that has just raised capital expands engineering to build toward a product milestone. It is less common at pre-seed (teams are too small) and at growth stage (hiring is steadier and less of a spike).",
  },
  {
    slug: "hiring-burst",
    question: "How does a hiring burst relate to fundraise timing?",
    answer:
      "If you are seeing a hiring burst, you may be too late for the current round but well-positioned for the next one. The team expansion suggests the company has capital to deploy and is building toward a product milestone, so the signal is strongest as a next-round or follow-on indicator rather than a current-round catch.",
  },
  {
    slug: "hiring-burst",
    question: "How is a hiring burst different from the other acceleration signal types?",
    answer:
      "A hiring burst is the only signal driven primarily by people (contributor growth above 50%) rather than code volume or repo count. It is also the strongest single fundraise predictor of the acceleration types, because scaling headcount implies capital already committed. Deploy spikes and infrastructure buildouts are code-side; framework migration is a slower stack-transition signal.",
  },
  {
    slug: "hiring-burst",
    question: "What should an investor do after spotting a hiring burst signal?",
    answer:
      "Treat it as a diligence trigger, not a buy signal. Confirm the contributor growth is internal hires rather than external open-source contributors, check whether the company has already announced a round (in which case the signal is confirmation, not discovery), and time outreach for the next financing milestone.",
  },

  // -------------------------------------------------------------------------
  // Infrastructure Buildout
  // -------------------------------------------------------------------------
  {
    slug: "infrastructure-buildout",
    question: "How is the Infrastructure Buildout signal detected?",
    answer:
      "A startup is classified as an infrastructure buildout when it creates three or more new public repositories within 30 days, expanding its technical surface area with new microservices, SDKs, or platform components.",
  },
  {
    slug: "infrastructure-buildout",
    question: "What can falsely trigger an infrastructure buildout signal?",
    answer:
      "Open-sourcing existing internal repositories, splitting a monorepo into multiple repos, or mirroring code for compliance can all create a burst of new repos without real platform investment. The methodology reads new-repo counts as a surface-area proxy, so a single repo split can inflate the signal if it is not weighed against velocity and contributor signals.",
  },
  {
    slug: "infrastructure-buildout",
    question: "Which funding stage does an infrastructure buildout usually indicate?",
    answer:
      "Infrastructure buildout is classic Series A/B behavior: the core product works, and the team is building the platform around it. The pattern requires capital and reflects confidence in the product direction, so it is a strong trajectory signal at later early-stage rounds.",
  },
  {
    slug: "infrastructure-buildout",
    question: "How does an infrastructure buildout relate to fundraise timing?",
    answer:
      "A buildout typically precedes a Series A or B by roughly three to six weeks, because a company expands its platform before telling the market it is scaling. Investors seeing a fresh buildout can often engage before the round is announced.",
  },
  {
    slug: "infrastructure-buildout",
    question: "How is an infrastructure buildout different from the other acceleration signal types?",
    answer:
      "An infrastructure buildout is driven by repo creation (3+ new repos in 30 days), whereas a hiring burst is driven by contributor growth, a deploy spike by commit-velocity change, and a framework migration by general acceleration. Buildout signals strategic technical investment rather than raw shipping speed.",
  },
  {
    slug: "infrastructure-buildout",
    question: "What should an investor do after spotting an infrastructure buildout signal?",
    answer:
      "Look at what the new repositories are: SDKs and platform components suggest a product-line expansion, while forks and mirrors suggest noise. Pair the buildout with the company's stated roadmap and recent hiring to judge whether the new surface area maps to a genuine growth thesis.",
  },

  // -------------------------------------------------------------------------
  // Deploy Frequency Spike
  // -------------------------------------------------------------------------
  {
    slug: "deploy-frequency-spike",
    question: "How is the Deploy Frequency Spike signal detected?",
    answer:
      "A startup is classified as a deploy frequency spike when its commit velocity increases 150% or more versus baseline, the team is shipping code at an unusually high rate over the 14-day window.",
  },
  {
    slug: "deploy-frequency-spike",
    question: "What can falsely trigger a deploy frequency spike signal?",
    answer:
      "Dependency-update and bot commits, mass refactoring, and CI/CD noise can all inflate commit counts without real feature work. The methodology filters known bot accounts and trivial-file commits, but a single large refactor can still look like a spike, which is why the signal requires the acceleration to persist into a second 14-day window.",
  },
  {
    slug: "deploy-frequency-spike",
    question: "Which funding stage does a deploy frequency spike usually indicate?",
    answer:
      "Deploy spikes are most common at pre-seed and seed, where a small team ships hard toward a launch or product-market-fit iteration. They can also appear at later stages around a major product launch, but the raw-shipping signature is most diagnostic early.",
  },
  {
    slug: "deploy-frequency-spike",
    question: "How does a deploy frequency spike relate to fundraise timing?",
    answer:
      "A deploy spike often indicates a product launch, rapid iteration on customer feedback, or a competitive response, all of which are common in the weeks immediately before a fundraise announcement. It is a near-term timing signal, sometimes visible as little as three weeks ahead.",
  },
  {
    slug: "deploy-frequency-spike",
    question: "How is a deploy frequency spike different from the other acceleration signal types?",
    answer:
      "A deploy spike is the purest velocity signal: it is driven by commit-velocity change (+150% or more) with contributor count roughly flat. A hiring burst requires rising contributors, an infrastructure buildout requires new repos, and a framework migration is the residual catch-all for general acceleration.",
  },
  {
    slug: "deploy-frequency-spike",
    question: "What should an investor do after spotting a deploy frequency spike signal?",
    answer:
      "Check whether the spike is broad-based (many contributors) or concentrated (one developer), since the 3.4× finding shows velocity-plus-diversity is far more predictive than velocity alone. Then look for what is being shipped, a launch, a competitive response, or a pivot, before acting.",
  },

  // -------------------------------------------------------------------------
  // Framework Migration
  // -------------------------------------------------------------------------
  {
    slug: "framework-migration",
    question: "How is the Framework Migration signal detected?",
    answer:
      "A startup is classified as a framework migration when it shows general engineering acceleration that does not fit the hiring-burst, infrastructure-buildout, or deploy-spike rules, typically indicating a technology-stack transition from prototype to production infrastructure.",
  },
  {
    slug: "framework-migration",
    question: "What can falsely trigger a framework migration signal?",
    answer:
      "Because framework migration is the residual category, it can absorb mixed signals, a mild velocity bump plus a couple of new repos that individually fall under each threshold. The methodology accepts this imprecision deliberately: the category flags 'something is changing under the hood' and routes the investor to diligence rather than asserting a specific cause.",
  },
  {
    slug: "framework-migration",
    question: "Which funding stage does a framework migration usually indicate?",
    answer:
      "Framework migration most often maps to seed through Series A, where a startup transitions from prototype to production infrastructure, moving from exploration to exploitation, a milestone that frequently precedes fundraising. It is a slower, quarter-scale signal than the other acceleration types.",
  },
  {
    slug: "framework-migration",
    question: "How does a framework migration relate to fundraise timing?",
    answer:
      "Framework migrations move on a longer horizon than hiring bursts or deploy spikes, often one to two quarters ahead of a fundraise. They signal the shift from building to scaling, which is exactly the story a startup tells a Series A or B investor, but they are less useful for catching a round within weeks.",
  },
  {
    slug: "framework-migration",
    question: "How is a framework migration different from the other acceleration signal types?",
    answer:
      "Framework migration is the subtlest of the acceleration types and the only residual one: it is general acceleration that does not meet the contributor-growth, repo-creation, or velocity thresholds. Where the other acceleration types point at a specific mechanism (hiring, building, shipping), framework migration points at a phase change in the technology stack.",
  },
  {
    slug: "framework-migration",
    question: "What should an investor do after spotting a framework migration signal?",
    answer:
      "Treat it as an invitation to look deeper rather than a specific call. A framework migration suggests a startup is professionalizing its stack, which is worth a diligence conversation about architecture, technical debt, and whether the migration is enabling scale or hiding instability.",
  },

  // -------------------------------------------------------------------------
  // Deceleration
  // -------------------------------------------------------------------------
  {
    slug: "deceleration",
    question: "How is the Deceleration signal detected?",
    answer:
      "A startup is classified as decelerating when its 14-day commit velocity falls below the prior 14-day window, a velocity ratio below 1.0. It is the inverse of the acceleration signals and is computed from the same public commit-activity endpoint.",
  },
  {
    slug: "deceleration",
    question: "What can falsely trigger a deceleration signal?",
    answer:
      "Sprint-cycle lumpiness is the main false positive: a team that works in two-week sprints can post a quiet planning week that reads as deceleration. A single quiet window should be read as noise until it persists. Holidays, seasonal dips, and post-launch regrouping are common non-negative causes.",
  },
  {
    slug: "deceleration",
    question: "Which funding stage does deceleration usually indicate?",
    answer:
      "Deceleration is not stage-specific. A post-launch slowdown is common at any stage, but a sustained drop paired with falling contributor count is most worrying at seed and Series A/B, where a shrinking team can signal runway pressure or a stalled roadmap.",
  },
  {
    slug: "deceleration",
    question: "How does deceleration relate to fundraise timing?",
    answer:
      "Deceleration is usually a neutral or negative timing signal: a team that just shipped a milestone often slows down to regroup before the next push. It becomes a red flag only when it is sustained and paired with declining contributors, which can indicate turnover or a strategic stall ahead of a difficult round.",
  },
  {
    slug: "deceleration",
    question: "How is deceleration different from the other four signal types?",
    answer:
      "Deceleration is the only cooling signal: the four acceleration types (hiring burst, infrastructure buildout, deploy frequency spike, framework migration) all flag rising activity, while deceleration flags falling commit velocity. It is read as the inverse axis and pairs most usefully with the contributor and repository signals to tell a finished push from a stalled team.",
  },
  {
    slug: "deceleration",
    question: "What should an investor do after spotting a deceleration signal?",
    answer:
      "Do not treat it as a sell signal. Check whether the slowdown is isolated to commits or accompanied by falling contributors and a pause in new repositories. A finished milestone with a stable team is normal; a broad-based slowdown is worth a founder conversation about roadmap, runway, and whether the team is regrouping or stalling.",
  },
];
