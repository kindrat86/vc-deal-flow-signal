/**
 * Methodology Q&A pairs, the canonical "how does this actually work" layer.
 *
 * Feeds app/qa.jsonl/route.ts (category "methodology") and, transitively,
 * llms.txt / RAG indexers / agentic search. Every answer is grounded in the
 * live /methodology page and /data-sources; do not add a claim here that is
 * not already stated on a public page. Canonical figures: 15 active sectors,
 * ~350+ tracked organizations, 4 signal types, weekly Monday refresh, rolling
 * 14-day window, three-to-six-week lead, SSRN preprint 6606558, CC BY 4.0.
 */

export interface MethodologyFAQ {
  question: string;
  answer: string;
  source: string;
  sourceHref: string;
}

export const methodologyFaqs: MethodologyFAQ[] = [
  {
    question: "How does VC Deal Flow Signal measure engineering acceleration?",
    answer:
      "Engineering acceleration is computed weekly from public GitHub data. The pipeline pulls 14-day commit velocity, contributor count, and repository-creation events for roughly 350+ startup organizations across 15 sectors via the GitHub REST API, then expresses each metric as a percentage change versus the prior 14-day window. A startup whose 14-day commit velocity doubles relative to its own baseline is recorded as +100% acceleration. The metric is computed per organization against its own historical baseline, not across the population.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "What data sources are used in the methodology?",
    answer:
      "The primary source is the public GitHub REST API v3: the search/repositories, stats/commit_activity, contributors, and repos endpoints. No private repositories, no scraping, no terms-of-service violations. The methodology excludes commits authored by accounts matching common bot patterns (Dependabot, Renovate, GitHub Actions) and applies file-count filtering to remove trivial commits. The full data-sources page lists every endpoint and refresh cadence.",
    source: "Methodology",
    sourceHref: "/data-sources",
  },
  {
    question: "Why use a 14-day rolling window?",
    answer:
      "Investor signal pipelines tend to use either 14-day or 28-day rolling windows. The 14-day window is more responsive, it surfaces breakouts faster, at the cost of higher volatility. To filter the resulting noise, the methodology requires a breakout to persist into a second 14-day window before it is treated as actionable. This two-period confirmation rule removes most one-period spikes caused by hackathons, launch sprints, or single contributors onboarding.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "How are bot commits filtered out?",
    answer:
      "Commits authored by accounts whose name or type matches known bot patterns (bot, github-actions, dependabot, renovate) are excluded before any aggregation. A second filter removes commits with diffs below a small file-count threshold to suppress automated formatting and dependency-update commits. The combination removes the loudest noise sources without overfitting; further normalization can be added but is rarely worth the engineering cost.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "What are the five signal types?",
    answer:
      "Tracked startups sort into five signal types. The engineering hiring burst is rising velocity plus rising contributor count, the strongest fundraise predictor. The deploy frequency spike is velocity rising while contributor count holds flat, typical of launch preparation. The infrastructure buildout is repository creation accelerating versus baseline, strategic technical investment. The framework migration is general acceleration indicating a technology-stack transition from prototype to production infrastructure. Deceleration is commit velocity falling versus the prior window, which can mean a shipped milestone, a team transition, or a strategic pivot. Each pattern implies a different diligence question.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "How is funding stage estimated?",
    answer:
      "Funding stage is estimated from contributor count as a rough proxy for team size: Pre-seed (1-7 contributors), Seed (8-19), Series A/B (20-49), and Growth (50+). This is an approximation, not all contributors are employees, and not all employees contribute to public repos, so stage is intended as a screening filter, not a definitive label.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "Is the methodology peer-reviewed?",
    answer:
      "The methodology write-up is published on SSRN at ssrn.com/abstract=6606558 and mirrored on Zenodo with a DOI. The dataset is auto-indexed by OpenAlex (W7154916891) and DataCite. The work is not formally peer reviewed in a journal, but it is openly published and reproducible: investors can audit the full methodology and replicate the metrics from the same public GitHub data described in the paper.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "Is engineering acceleration the same as a startup accelerator program?",
    answer:
      "No. They are unrelated concepts that share a word. A startup accelerator (Y Combinator, Techstars, 500 Global) is a fixed-term program founders join. Engineering acceleration is a quantitative signal computed from public GitHub activity. Throughout this site the term refers exclusively to code-side momentum, commit velocity, contributor growth, repository creation, and has nothing to do with program participation.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "What is commit velocity and how is it calculated?",
    answer:
      "Commit velocity is the total number of commits to an organization's most active public repository over a rolling 14-day window. The pipeline uses GitHub's weekly commit_activity data (52 weeks of history) and sums two consecutive weeks to produce a 14-day figure.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "What is commit velocity change and why does it matter?",
    answer:
      "Commit velocity change is the percentage change in commit velocity versus the preceding 14-day window. A startup with 40 commits this period and 20 last period shows +100% velocity change. This is the primary ranking signal, it measures acceleration, not absolute volume, which is what distinguishes a breakout team from a merely busy one.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "How is contributor growth measured?",
    answer:
      "Contributor count is the number of unique contributors to an organization's most active repository. Growth is estimated by comparing recent 6-week commit volume to the prior 6-week period. A rising contributor count often signals team expansion, a leading indicator of funding or product-market fit.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "What do new repository counts signal?",
    answer:
      "The pipeline counts public repositories an organization creates in the last 30 days. A burst of new repos often signals infrastructure buildout, new product lines, or framework migrations, the company is expanding its technical surface area, which typically requires capital and confidence in the product direction.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "What is the 3.4× composite finding?",
    answer:
      "The single most predictive composite in the SSRN panel of 219 confirmed rounds is 14-day commit-velocity acceleration combined with low top-contributor concentration (a Gini coefficient under 0.30 over the same window). Organizations that meet both conditions are 3.4× more likely to announce a Series A within 60 days than orgs with high acceleration alone. In other words: velocity matters, but the shape of the velocity, whether it is spread across many engineers rather than one, matters more.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "How does the methodology filter out large tech companies?",
    answer:
      "The startup universe excludes large tech companies (Google, Microsoft, Meta, and similar), major open-source foundations, and organizations with patterns inconsistent with venture-backed startups. The goal is to surface companies in the pre-seed through Series B range, where engineering acceleration is still a meaningful discovery signal.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "How is startup geography determined?",
    answer:
      "Geography is derived from the GitHub organization profile location field, mapped to broad regions (US, UK, EU, APAC, Canada, LATAM, MENA). It is a coarse filter rather than a precise HQ location, and is not cross-referenced against company registries.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "What are the known limitations of the signal?",
    answer:
      "Three limitations are called out explicitly. (1) Private repos are invisible, some startups keep all or most code private, so the signal only covers public engineering activity. (2) Commit volume is not code quality, high velocity can reflect refactoring, documentation, or CI/CD noise, which is why change-from-baseline is used instead of absolute counts. (3) It is not investment advice, engineering acceleration is a leading indicator of traction, not a guarantee of success.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "Why does the signal only cover public repositories?",
    answer:
      "The methodology is built entirely on public GitHub data so that it stays reproducible and free of terms-of-service risk. Private repositories are invisible to the pipeline, which means startups that keep most code private are under-represented. This is an acknowledged limitation rather than a leak: the signal is a public-data leading indicator, not a complete picture of a company's engineering.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "Is commit volume the same as code quality?",
    answer:
      "No. High commit velocity can reflect rapid feature development, but it can also reflect refactoring, documentation, or CI/CD noise. The methodology mitigates this by measuring change from each org's own baseline rather than raw commit counts, and by filtering bot and trivial-file commits before aggregation.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "How often is the data refreshed and what happens each refresh?",
    answer:
      "The full panel refreshes weekly, on Monday mornings (~09:00 UTC). Each refresh queries GitHub for the latest 52 weeks of commit history, recomputes acceleration metrics, classifies signal patterns, regenerates the sector rankings, and republishes the API endpoints and dashboard. The free Signal Report email is sent the same morning. Intraday changes do not affect rankings, the cadence is intentionally weekly to match how investors review pipelines.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "How was the signal validated?",
    answer:
      "The leading-signal hypothesis was validated on a longitudinal panel of 219 startup-period observations, documented in the SSRN preprint (abstract 6606558) and stratified by funding stage. The headline result is the 3.4× composite finding for velocity-plus-diversity. The panel is extended on a rolling basis, with the next refresh scheduled for Q3 2026.",
    source: "Research",
    sourceHref: "/research",
  },
  {
    question: "How far in advance does the signal predict fundraises?",
    answer:
      "Engineering acceleration signals have historically preceded fundraise announcements by roughly three to six weeks. The claim is a screening-filter claim, openly tracked on the public scorecard, not an established guarantee, the signal surfaces breakout engineering teams early, and investors are expected to do their own diligence on top of it.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "Is engineering acceleration investment advice?",
    answer:
      "No. VC Deal Flow Signal provides engineering-acceleration data as a leading indicator for deal sourcing. It is not investment advice. Engineering signals should be one input among many in an investment decision, combined with market analysis, founder evaluation, and customer reference checks.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "Why is engineering acceleration a leading indicator rather than a lagging one?",
    answer:
      "Funding announcements, team changes, and Crunchbase profiles are lagging indicators, they appear after a round closes. Engineering acceleration is a leading indicator because teams usually build hard before they raise: commit velocity, contributor growth, and repo creation accelerate three to six weeks ahead of the announcement. The methodology is built around this timing gap.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "How is a startup classified into exactly one signal type?",
    answer:
      "Each startup is assigned one of five signal types based on which metric is driving the signal. Contributor growth above 50% maps to engineering hiring burst; three or more new repos in 30 days maps to infrastructure buildout; commit velocity up 150% or more maps to deploy frequency spike; general acceleration that does not fit the first three is classified as framework migration; and commit velocity falling below the prior window is classified as deceleration. The classification is deterministic and re-run weekly.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
  {
    question: "What does 'framework migration' mean in the methodology?",
    answer:
      "In this methodology, framework migration is a signal type, not a literal code migration. It denotes general engineering acceleration that does not fit the hiring-burst, infrastructure-buildout, or deploy-spike rules, often indicating a technology-stack transition from prototype to production infrastructure. It is the subtlest of the acceleration types and tends to move on a slower, quarter-scale horizon.",
    source: "Methodology",
    sourceHref: "/methodology",
  },
];
