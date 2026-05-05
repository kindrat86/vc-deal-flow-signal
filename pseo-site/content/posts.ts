export interface BlogFAQ {
  question: string;
  answer: string;
}

export interface HowToStep {
  name: string;
  text: string;
}

/** A figure inserted after a specific H2 heading in the post body. */
export interface BlogFigure {
  /** ID matching a key in components/figures/index.tsx */
  id: string;
  /** Insert after the first H2 whose text contains this substring */
  afterHeading: string;
}

export interface BlogReference {
  label: string;
  title: string;
  url: string;
  source: string;
}

export interface BlogKeyStat {
  value: string;
  label: string;
  context?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  summary?: string;
  date: string;
  body: string;
  relatedSectors: string[];
  faqs: BlogFAQ[];
  figures?: BlogFigure[];
  references?: BlogReference[];
  keyStats?: BlogKeyStat[];
  /** Author slug; defaults to "the-data-nerd" if absent. Used by /authors/[slug]. */
  author?: string;
  howTo?: {
    name: string;
    description: string;
    totalTime?: string;
    steps: HowToStep[];
  };
}

export const posts: BlogPost[] = [
  {
    slug: "how-vcs-track-engineering-acceleration-2026-playbook",
    title: "How VCs Track Startup Engineering Acceleration: The Complete 2026 Playbook",
    description:
      "The complete 2026 playbook on engineering acceleration as a VC deal flow signal — pipeline, metrics, benchmarks, predictive analytics, screening workflow, and sector patterns, with worked examples from a 4,200-startup GitHub panel.",
    summary:
      "Engineering acceleration — the rate of change in a startup's GitHub commit, contributor, and repository activity relative to its own 14-day baseline — has emerged as one of the highest-signal leading indicators in venture capital deal flow. This playbook is the operating model: building a GitHub data pipeline, defining the four metrics that matter, benchmarking healthy acceleration by stage, turning signals into fundraise forecasts, automating screening at the fund level, and integrating the resulting watchlist into a normal investment workflow. Drawing on the 4,200-startup longitudinal panel maintained at VC Deal Flow Signal, the piece quantifies typical lead times (3 to 6 weeks), flags the most common false positives, walks through sector-specific patterns in AI, fintech, developer tools, climate-tech, and cybersecurity, and ends with a concrete week-one starter workflow. Investors using this framework can systematically catch breakout startups before traditional databases like Crunchbase or PitchBook surface them.",
    date: "2026-04-26",
    relatedSectors: ["ai-ml", "developer-tools", "fintech", "enterprise-saas", "data-infrastructure"],
    keyStats: [
      { value: "3-6 weeks", label: "Typical lead time", context: "Engineering acceleration vs fundraise announcement" },
      { value: "+100%", label: "Threshold", context: "Sustained 14-day commit velocity change" },
      { value: "4,200", label: "GitHub orgs", context: "Longitudinal startup panel" },
      { value: "20", label: "Sectors", context: "Tracked weekly" },
    ],
    references: [
      { label: "1", title: "DORA Metrics – Accelerate State of DevOps", url: "https://dora.dev/research/", source: "Google DORA" },
      { label: "2", title: "GitHub REST API – Commit Activity", url: "https://docs.github.com/en/rest/metrics/statistics", source: "GitHub Docs" },
      { label: "3", title: "GitHub Innovation Graph", url: "https://github.com/github/innovationgraph", source: "GitHub" },
      { label: "4", title: "Engineering Acceleration as a VC Deal Flow Signal", url: "https://ssrn.com/abstract=6606558", source: "SSRN" },
      { label: "5", title: "VC Deal Flow Signal Methodology", url: "https://signals.gitdealflow.com/methodology", source: "GitDealFlow" },
    ],
    faqs: [
      {
        question: "What is engineering acceleration?",
        answer: "Engineering acceleration is the rate of change in a startup's public GitHub engineering output, expressed as the percentage change in 14-day commit velocity compared to the prior 14-day window. A team that goes from 20 commits per period to 40 shows +100% acceleration. The metric measures whether a team is speeding up relative to its own historical baseline, which is more informative than raw commit volume because it controls for differences in team size, commit conventions, and codebase complexity.",
      },
      {
        question: "How is engineering acceleration different from a startup accelerator program?",
        answer: "They are unrelated concepts that share a word. A startup accelerator is a fixed-term program (Y Combinator, Techstars) that founders join for mentorship, capital, and networking. Engineering acceleration is a quantitative signal computed from a startup's GitHub activity. Throughout this playbook, engineering acceleration always refers to code-side momentum measured in public commit, contributor, and repository activity — not program participation.",
      },
      {
        question: "Why does engineering acceleration predict fundraises?",
        answer: "The causal chain is short: a startup decides to raise capital or has just closed a round, this drives hiring and a sprint to a milestone, that activity produces commits faster than the team's normal rate, and the change is observable in public GitHub data days after it happens. Press coverage, Crunchbase entries, and SEC filings follow weeks later. Tracking commit velocity catches step three before steps four through six are visible to traditional databases.",
      },
      {
        question: "How long is the lead time between an engineering acceleration signal and a fundraise announcement?",
        answer: "Across the 4,200-startup panel maintained at VC Deal Flow Signal, the median lead time between a sustained acceleration signal and a public fundraise announcement is 3 to 6 weeks. The distribution has a long tail: roughly 12 percent of breakout signals do not result in any announced fundraise within 12 weeks, often because the round was extended, the company quietly raised through a SAFE, or the signal reflected a launch rather than a fundraise.",
      },
      {
        question: "What threshold of acceleration counts as a meaningful signal?",
        answer: "A useful working threshold is +100% sustained over two consecutive 14-day windows. One-period spikes are often noise: a hiring sprint, a hackathon, a single contributor onboarding. Sustained doubling across at least 28 days is the most reliable threshold for prioritizing investor attention. Different sectors have different baselines, and pre-seed teams with very low absolute volume require larger percentage moves to clear the noise floor.",
      },
      {
        question: "Can engineering acceleration be gamed by founders?",
        answer: "In theory yes; in practice it is expensive and easy to detect. A team can pad commit counts with mechanical edits, but contributor growth, repository creation, and language-mix changes are harder to fake. Most importantly, gaming the signal requires sustained effort from multiple contributors over weeks, which is itself a form of real engineering activity. Detecting gaming requires looking at commit size, file diversity, and contributor recency — the same checks a careful investor performs anyway.",
      },
      {
        question: "Does engineering acceleration work for non-technical startups?",
        answer: "It works for any startup whose product or core platform is built on public code. That covers a broader population than developer tools — fintech infrastructure, climate-tech sensor stacks, healthcare APIs, e-commerce platforms with custom storefronts, and consumer apps with public iOS or Android repositories all leave engineering footprints. Pure marketplaces, services businesses, and consumer-only products with closed codebases are not well covered by this signal.",
      },
      {
        question: "How does engineering acceleration compare to hiring data as a signal?",
        answer: "Hiring data has a longer lead time at the very top of the funnel — a job posting precedes the actual engineering output by weeks. But hiring data is also noisier: many postings never close, many teams hire and then fail to ship, and visible hiring activity shows up in LinkedIn long before the team's first GitHub commit. Engineering acceleration is downstream of hiring, which makes it lower-noise: by the time a team is shipping faster, the hires they made are already proving productive. The two signals are complementary.",
      },
      {
        question: "What is the difference between engineering acceleration and DORA metrics?",
        answer: "DORA metrics (deployment frequency, lead time for changes, change failure rate, time to restore) measure the quality of an engineering process — how reliably a team ships. Engineering acceleration measures the rate of change in engineering output volume — whether a team is speeding up. DORA is internal and requires CI/CD telemetry; acceleration is external and reads off public commit activity. They are useful in different contexts: DORA for engineering management, acceleration for investor sourcing.",
      },
      {
        question: "How should a fund integrate engineering acceleration into its existing sourcing workflow?",
        answer: "The pragmatic integration is a weekly digest: every Monday, review the top 20 startups in your sectors of interest ranked by acceleration, cross-reference against your CRM for any prior contact, prioritize the unflagged ones for a 30-minute desk dive, and tag the rest for monitoring. The signal complements rather than replaces existing sourcing: founder networks, demo days, and accelerator pipelines stay intact; engineering acceleration adds an external, quantitative top-of-funnel feed that is hard to source any other way.",
      },
    ],
    body: `Engineering acceleration — the rate of change in a startup's GitHub commit, contributor, and repository activity relative to its own 14-day baseline — is one of the highest-signal leading indicators investors can read today. Across the 4,200-startup panel maintained at VC Deal Flow Signal [4][5], a sustained doubling in 14-day commit velocity precedes a public fundraise announcement by a median of three to six weeks.

That window matters. By the time a startup appears in Crunchbase, PitchBook, or even press coverage, the round is often allocated and competitive. Engineering acceleration shows up before the funding databases catch up, before the press cycle, and often before the founder has even sent the first investor email.

This playbook is the operating model behind that observation. It covers the full pipeline: how to collect the GitHub data, which metrics to derive, how to benchmark them, how to turn the signal into a fundraise forecast, how to automate screening at fund scale, how to integrate the output into an existing sourcing workflow, and where the model breaks down. The framework is deliberately reproducible — the underlying data is public, the metrics are simple, and any analyst comfortable with REST APIs can build a working version in a week.

A vocabulary note before going further. Throughout this piece, engineering acceleration refers exclusively to code-side momentum: a measurable change in shipping pace observable in public commits, contributors, and repositories. It has nothing to do with startup accelerator programs like Y Combinator or Techstars, despite the unfortunate vocabulary collision.

## Why engineering acceleration is the leading indicator most VCs missed

For decades the venture capital industry has converged on a small set of sourcing channels: founder networks, demo days, accelerator pipelines, and increasingly the proprietary databases sold by PitchBook, Crunchbase, Affinity, and a handful of newer entrants. Each of those surfaces has the same fundamental limitation: it is downstream of the actual product. The data appears after a press release, after a board introduction, after a CRM update from a partner.

Engineering acceleration is upstream of all of those signals. Code is the earliest publicly observable artifact of a working startup. Before there is a website redesign, before there is a hiring announcement, before there is a Crunchbase entry, there are commits to a public repository. For technical startups — meaning any company whose core product or platform is built on software, which includes the majority of venture-backed companies in 2026 — the GitHub footprint is the leading edge of all other observable activity.

The reason this surface has been historically under-monitored is not that the data is hidden. GitHub's REST and GraphQL APIs [2] expose commit activity, contributor lists, repository metadata, language statistics, and release history. A solo developer can pull a year of commit history for any public organization in a few seconds. The constraint has been engineering effort: building a longitudinal panel across thousands of startups, normalizing for noise, computing rate-of-change metrics, and surfacing breakouts requires a small but specialized data engineering team. Until recently, no one in the venture industry had built it at scale.

The economic case is straightforward. A fund that can identify a Series A-bound startup six weeks before it appears in Crunchbase Alerts has a structural sourcing advantage over peer funds limited to the same downstream sources. The advantage compounds: warm outreach during the pre-fundraise window converts at meaningfully higher rates than cold outreach during a competitive round. Even at the angel and seed level, where check sizes are smaller and the marginal return on each deal is bounded, the ability to be the first thoughtful conversation a founder has had about a round is worth disproportionately more than being the tenth.

The signal is not magic. Many accelerations resolve in disappointing ways: the team ships a launch and stalls, the round is extended rather than upsized, the apparent engineering burst was a single contributor's hackathon. The framework's job is not to eliminate those false positives — it is to make them tractable, to reduce the screening surface area from every venture-backed startup to the 30 to 50 companies in your sectors of interest currently showing breakout engineering activity. That is a workload a single analyst can clear in a Monday morning.

The remainder of this playbook is the operating manual.

## Building a GitHub data pipeline for VC deal flow

The first practical question is how to acquire and organize the data. The pipeline has four layers: target list, ingestion, normalization, and aggregation.

The target list is a curated set of startup GitHub organizations. There is no canonical source. The pragmatic approach is to seed the list from existing investor lists — Y Combinator's published company directory, AngelList's startup database, sector-specific accelerator alumni — and union them with discoveries surfaced through the pipeline itself. At VC Deal Flow Signal, the working list is approximately 4,200 organizations covering 20 sectors. The exact size is less important than the maintenance discipline: the list must be reviewed monthly, with stale entries pruned and new entries added based on press, demo days, and reader submissions.

Ingestion uses the GitHub REST API [2]. The free authenticated rate limit is 5,000 requests per hour per token. For a 4,200-organization panel, the relevant endpoints are repositories list, commit activity, contributors, and releases. A weekly full pass requires roughly 50,000 requests, which is comfortably within the rate limit if the work is split across two tokens or paced over six hours. The GitHub Innovation Graph dataset [3] provides aggregate cross-region statistics that are useful for sector-level benchmarks but not for individual startup tracking.

Normalization is the most overlooked stage. Raw commit counts are noisy: bot accounts, dependency-update PRs from Dependabot or Renovate, automated formatting commits, and CI/CD reruns can inflate counts without reflecting real engineering activity. The minimum viable normalization is excluding commits authored by accounts whose name matches common bot patterns. A more sophisticated pipeline classifies commits by file diversity, message length, and diff size. Each layer of normalization improves signal-to-noise but adds engineering cost; the practical sweet spot is bot exclusion plus file-count filtering, which removes the loudest noise sources without overfitting.

Aggregation produces the metrics that drive the rest of the playbook. The minimal set is four time series per organization: commit velocity (count over rolling 14 days), unique contributor count over the same window, repository expansion (new repos created in the period), and language mix as a percentage breakdown of commit volume by primary language. Each is computed weekly and stored with timestamps so that subsequent comparisons against historical baselines are exact.

A crucial design choice is the comparison window. Investor signal pipelines tend to use either 14-day rolling or 28-day rolling windows. The 14-day window is more responsive — it surfaces breakouts faster — at the cost of higher volatility. The 28-day window is smoother but introduces lag. The pragmatic default is 14-day with a confirmation rule: a breakout must persist into a second 14-day window before it is treated as actionable. This filter alone removes most one-period spikes caused by hackathons, launch sprints, or single contributors onboarding.

The pipeline output is a per-organization weekly snapshot: four metrics, four prior-period baselines, and four rate-of-change values. Stored in a flat database, the entire 4,200-organization panel fits in well under a gigabyte. The data infrastructure does not require dedicated streaming infrastructure or a data warehouse — a single Postgres or DuckDB instance handles the volume comfortably.

The pipeline is, in short, an unglamorous engineering project: rate-limited API calls, careful joins, and a weekly cron. The competitive moat is not in any one component but in the months of accumulated panel history that newer entrants cannot replicate retroactively.

## Core metrics: commit velocity, contributor growth, and repository expansion

Engineering acceleration as a single number is useful for ranking, but the underlying signal decomposes into four metrics, each of which carries a different operational meaning.

Commit velocity is the headline metric: total commits to the most active repositories of a startup organization over a 14-day window. Velocity correlates with team size, codebase maturity, and shipping cadence. Absolute velocity is not directly comparable across companies — a 10-person team will out-commit a solo founder by a factor of 10 even at equivalent per-engineer pace — but velocity change relative to a startup's own baseline is the most honest comparable. A startup that has gone from 30 commits per period to 70 has demonstrably accelerated; whether that move was driven by hires, a sprint, or simply higher per-engineer output is downstream interpretation.

Contributor growth is the second-order signal. Velocity can rise because existing engineers are working harder; contributor count can only rise when new engineers are added. Tracking unique authoring contributors over a 14-day window — and comparing to the prior window — distinguishes the existing team is sprinting from the team has hired. The latter is a stronger fundraise signal because hiring almost always implies committed capital, while sprinting can occur within an existing runway. A typical pre-Series-A pattern looks like contributor count moving from three to six to nine over consecutive 14-day windows, often within four to eight weeks of the round close.

Repository expansion captures structural changes. New repositories appearing in a startup's organization signal product line extension, infrastructure migration, or in some cases a pivot. The pattern is most informative in conjunction with velocity: a new repo with sustained commits over its first month is a launch precursor; a new repo with a single commit that goes silent is usually a placeholder. The signal works best for organizations with a stable repository naming convention, where the addition of a repo named after a new product surface is recognizable without context.

Language mix evolution is the slowest-moving but most strategic signal. A team whose commit volume shifts measurably from Python to TypeScript, or from JavaScript to Rust, has changed something fundamental about the system being built. These transitions are infrequent — typical startups maintain stable language mixes over months — but when they occur they often coincide with platform rebuilds, performance milestones, or hires of senior engineers with specific stack preferences. A 20-percentage-point shift in language mix over a single quarter is unusual and merits investigation.

The four metrics combine into a typology of acceleration patterns. The hiring burst is contributor count plus velocity rising together. This is the pattern most strongly correlated with a recent or imminent fundraise. Detection rule: contributor count up at least 30 percent and commit velocity up at least 60 percent in the same period.

The shipping sprint is velocity rising while contributor count holds flat. This signals a launch push, often around a specific product milestone. Detection rule: velocity up at least 100 percent with contributor count change under 15 percent.

The infrastructure buildout is repository creation accelerating relative to historical baseline. This signals architectural investment, often platform migrations or a build-out of internal tooling. Detection rule: at least three new repositories created in 30 days versus a prior 30-day baseline of zero.

The platform migration is language mix shifting. This is the slowest-moving pattern but often the most strategically significant — it implies the team is committing to a new technical direction. Detection rule: at least 20 percentage points of language mix migrating between primary languages over a quarter.

Each pattern has implications for diligence. A hiring burst suggests asking about recent or imminent capital. A shipping sprint suggests asking about the upcoming launch and its dependencies. An infrastructure buildout suggests asking about architectural strategy and the team's view of scaling. A platform migration suggests asking about the technical bet driving the change. The metrics direct the investor's attention; the actual decision still requires founder conversations.

## Benchmarking: what healthy acceleration looks like at each stage

Raw acceleration numbers without context are meaningless. A pre-seed team with two contributors and a +200% commit velocity change is showing different physics than a Series B company with 50 engineers and a +200% change. Benchmarking against stage and sector is essential to interpret signals correctly.

The pre-seed benchmark is dominated by base rate effects. A solo founder going from 5 commits in a 14-day window to 20 shows +300%, but the absolute volume is too low to draw structural conclusions. The useful pre-seed signal is sustained activity: contributor count holding above 1, velocity holding above 10 commits per 14-day window for at least eight weeks, and at least one external dependency or release tag indicating production-grade engineering. At pre-seed, the goal of the metric is to identify teams that are credibly building, not to compare them.

The seed benchmark introduces structural comparisons. A typical seed-stage team is 3 to 8 engineers committing 80 to 200 commits per 14-day window. A breakout signal at seed is a sustained move above the 75th percentile of the company's prior six months — typically a velocity increase of 50 percent or more held for at least 28 days. Contributor count change at this stage is highly informative: a seed team going from 5 to 8 engineers in a quarter is making a real bet that almost always reflects either a fundraise or imminent fundraise.

The Series A benchmark shifts toward magnitude. A Series A team commits 200 to 500 commits per 14-day window across a larger codebase. The interesting signal at this stage is not whether a team is accelerating in percentage terms — many teams maintain steady acceleration as they hire — but whether the acceleration involves new product surfaces. A Series A team that adds a new repository with sustained activity, or that visibly migrates to a new primary language, is signaling strategic shifts that often precede follow-on fundraises or major launches.

The Series B and later benchmark is dominated by composition. Acceleration at this stage is often driven by acquisitions, new business unit launches, or the absorption of a technical hire team rather than a singular team push. The signal mix shifts: contributor count is less informative because hiring is structurally embedded; repository expansion becomes more meaningful as it reflects strategic bets; language mix changes can presage M&A activity when the absorbed team's stack appears in the parent organization's commit graph.

Sector-specific benchmarks layer on top of stage benchmarks. AI and machine learning startups typically have higher commit volatility than enterprise SaaS startups because model training cycles, dataset releases, and notebook-driven research all produce large bursts of activity. Fintech infrastructure startups tend to have lower commit volume but higher per-commit substance because compliance and security review act as natural throttles. Developer tools startups have the highest contributor diversity because open source contribution is itself part of the product strategy. The full sector breakdown is detailed in the sector patterns section below.

The benchmarking takeaway is that no single threshold works across the population. The +100% rule is a reasonable default for screening, but the ranking that matters is each startup against its own historical baseline plus a sector-stage adjusted control. A working pipeline computes both: an absolute acceleration number for a fast first-pass filter, and a percentile-rank-within-sector-stage for prioritization. Investors looking at the screen can run on either depending on whether they are sourcing for breadth or for conviction.

## Predictive analytics: turning GitHub signals into fundraise forecasts

A useful sourcing pipeline produces not just rankings but probabilities. For each startup showing acceleration, what is the probability it will announce a fundraise in the next 8 weeks? Translating signals into forecasts requires labeling and calibration.

The labeling problem is harder than it sounds. A fundraise announcement can be a press release, an SEC Form D filing, a Crunchbase entry, a founder tweet, or in some cases simply a quiet update to a company website. Building a reliable label set requires a multi-source ground truth: tagging each company in the panel as having raised within an N-week window using whichever source confirms first. At VC Deal Flow Signal, the labeling pipeline merges Form D filings, Crunchbase, Affinity, and a manual press review for ambiguous cases.

Once labels exist, the predictive model can be straightforward. A logistic regression on the four core metrics — commit velocity change, contributor count change, new repository count, and language mix shift magnitude — over the prior 28 days predicts a near-term fundraise with measurable lift over base rate. More sophisticated models add interactions (velocity-times-contributor-change captures hiring bursts cleanly), sector indicators, and stage indicators. Tree-based models like gradient-boosted trees provide a few percentage points of additional precision but at meaningful interpretability cost. The pragmatic recommendation is to start with logistic regression for transparency and only add complexity once the simple model's failure modes are well understood.

Calibration is critical for usefulness. A model that says 70 percent probability of fundraise needs that number to actually mean what it says when aggregated across many predictions. Reliability diagrams — bucketing predicted probabilities and checking the empirical fundraise rate within each bucket — should be a routine output of any working pipeline. Most investor-facing rankings do not need probabilities at all; they need a defensible relative ordering. But for funds running portfolio-level analyses, calibration matters.

The model's outputs interact with portfolio construction in a specific way. Top-ranked breakouts are not necessarily the most investable signals. A Series B team showing acceleration is usually less actionable for an early-stage fund than a seed-stage team showing similar magnitude — even though the Series B signal is statistically stronger. The screening pipeline should report both raw probability and stage-adjusted rank, allowing each fund to filter to the population that matches their mandate.

There is a meta-question worth flagging. If engineering acceleration becomes a widely used investor signal, will markets adapt? The answer is partly yes, partly no. Founders intentionally trying to game the signal would need to sustain real engineering output across multiple contributors, which is itself a form of real activity. More plausibly, founders aware of the signal will time their public-repository activity to optimize visibility — pushing changes from local branches in coordinated bursts, for example. But the underlying causal structure is difficult to fake without doing the underlying work, and the signal's persistence as a leading indicator depends on this asymmetry.

The probabilistic output, once trusted, has uses beyond ranking. Portfolio funds can monitor existing investments for engineering acceleration — a portfolio company quietly accelerating may be ready for a follow-on conversation. Limited partners in venture funds can use aggregate sector-level acceleration as a leading indicator of where the next vintage of breakouts is forming. Strategic acquirers can use the same data to identify acquisition targets before banker auctions begin.

The forecasting layer is where the engineering effort pays off. The pipeline that produces unranked rankings is useful; the pipeline that produces calibrated probabilities is differentiated.

## Automating screening: workflow at the fund level

Most investor processes do not benefit from raw data; they benefit from a curated weekly digest. Automating the screening layer is what turns the underlying pipeline into a usable product.

The screening workflow has four stages: signal detection, deduplication, contextualization, and prioritization. Signal detection is the threshold pass: identify all startups exceeding the +100% sustained acceleration threshold or the percentile-rank threshold within their sector. Deduplication removes companies already actively in the fund's pipeline based on a CRM cross-reference. Contextualization attaches enrichment — recent press, hiring activity, founder Twitter — to each surviving signal. Prioritization ranks the result list by a combination of signal strength, sector fit with the fund's mandate, and stage fit.

The output is a Monday-morning report: typically 20 to 40 startups for a fund with focused sector mandates, longer for sector-agnostic generalist funds. Each entry includes the signal type (hiring burst, shipping sprint, infrastructure buildout, platform migration), the signal magnitude relative to baseline, the GitHub link, the team's public profile, and any enrichment data. The report is written for a 15-minute Monday-morning review followed by partner-level triage.

Automating CRM integration is where most funds first encounter friction. Affinity, HubSpot, and Salesforce all expose APIs for cross-referencing organization names against existing pipeline records. The match logic must be tolerant: founders use varied legal names, GitHub organization names, and public-facing brand names. A working CRM cross-reference uses domain-based matching as a primary key and falls back to fuzzy name matching with a manual review queue for ambiguous matches. Building this layer once saves hours of analyst time per week.

Contextualization automates the five minutes per company research the analyst would otherwise do manually. The standard enrichment stack pulls recent press from Google News, hiring activity from LinkedIn or Wellfound, founder social activity from Twitter and Hacker News, and any prior fundraise history from Crunchbase. Each signal type benefits from different enrichments — a hiring burst is most informatively contextualized with LinkedIn headcount data, while a shipping sprint is best contextualized with the team's public roadmap or product page.

Prioritization is where fund-specific judgment lives. A pre-seed-focused angel weights stage fit highly and sector fit lightly. A specialized Series A fund weights both heavily. A platform fund weights signal strength and recency over fit. The screening pipeline must be configurable per fund without requiring every fund to maintain its own infrastructure. The product implication is that the right level of abstraction is ranked weekly digest rather than raw data feed — a fund that wants raw data feeds typically has the engineering capacity to build its own pipeline, and the product is more useful as the weekly summary.

A subtle but important workflow detail is the feedback loop. Funds that mark which signals they actually pursued, and which converted into meetings or investments, provide data that improves the ranking model. A fund-private feedback loop — without sharing data across funds — improves the ranking weights for that fund's specific mandate. This level of personalization is not necessary for the first version of the pipeline but materially improves precision over months of use.

The full automated screening loop runs in a few hours per week of compute. The human-in-the-loop time is roughly 30 minutes Monday morning per analyst. The per-deal cost of incremental sourcing, compared to traditional channels, is competitive even at the smallest fund sizes. The economic argument for automation is not labor savings; it is coverage. A single analyst monitoring engineering acceleration across 4,200 organizations would otherwise require an unworkable amount of attention. Automation makes the coverage tractable, and tractable coverage is the actual sourcing edge.

## Workflow integration: how investors operationalize the signal

The signal is only useful if it lands in the actual investment process. Integration with existing workflow tools is where many promising data products fail in deployment. Three integration patterns work in practice.

The weekly digest pattern is the simplest. The screening pipeline emails a Monday-morning report directly to partners and analysts, formatted for skimming. Each entry has a one-line signal summary, a magnitude, and a one-click link to a deeper view. This pattern requires no infrastructure on the fund side and works well for small funds and angels. Its limitation is that the digest exists outside the fund's CRM and pipeline workflows; tracking which leads converted requires manual logging.

The CRM enrichment pattern extends the screening output into the fund's existing CRM. New signals appear as tagged opportunities in Affinity or HubSpot with the signal type and magnitude as fields. Existing pipeline companies receive enrichment events when their engineering acceleration changes meaningfully. This pattern requires API integration but produces tightly closed loops — every signal lands in the same surface where decisions are tracked, and conversion data flows naturally back to the screening model.

The Slack or email alert pattern handles real-time intervention. Rather than waiting for a weekly digest, alerts fire when a portfolio company crosses a threshold (engineering acceleration above +200%, contributor count growing faster than expected, infrastructure buildout signals in a competitor's organization). This pattern is most useful for funds with active portfolio management practices or for competitive intelligence against other funds' portfolios.

The most operationally mature funds combine all three patterns: weekly digest for top-of-funnel surfacing, CRM enrichment for closed-loop tracking, and real-time alerts for high-priority events. The complexity escalates accordingly, and the effort is not justified for the first months of use. The pragmatic deployment path is to start with weekly digest for two months, add CRM enrichment once signals are converting reliably, and add real-time alerts only after the first two layers have demonstrated value.

A frequently raised concern is signal fatigue. Funds receiving 30 to 40 signals per week can develop dismissal habits if the signal-to-noise ratio is weak. Two countermeasures help. First, ranking discipline: never present more signals than the analyst can review thoughtfully in 30 minutes. Second, conversion tracking: explicitly track how many signals converted to first meetings, meetings to diligence, and diligence to investment. Funds that see 5 percent of signals convert to first meetings, and 1 percent eventually convert to investments, are running a workable funnel. Funds that see no conversion in three months should investigate either the screening pipeline's calibration or the fund's sector fit.

A subtlety that deserves explicit treatment is the relationship between this signal and the founder. The most successful fund deployments treat engineering acceleration as a conversation prompt, not a buying signal. The first outreach is, by design, low-pressure: the fund has noticed that the team is shipping unusually fast, would like to learn what is driving it, and is open to whatever the founder wants to share. Founders almost universally respond positively to this framing because it acknowledges their work and does not presume a transaction. Funds that lead with a transaction-focused outreach often see lower response rates because the founder has not yet decided to raise.

Workflow integration is, ultimately, a discipline question. The fund that treats the signal as a structured input to a normal investment process gets compounding value. The fund that treats it as a one-off curiosity gets a few interesting Monday morning emails and not much more.

## Sector patterns: how acceleration looks in AI, fintech, devtools, and other technical verticals

Engineering acceleration manifests differently across sectors. Understanding sector-specific patterns is the difference between a noisy first-pass screen and an interpretable signal.

The AI and machine learning sector has the highest commit volatility in the panel. ML startups produce large bursts of activity around model training cycles, dataset releases, evaluation runs, and notebook-driven research. The pre-Series-A acceleration pattern in AI is distinctive: a mix of repository creation (often around a new model checkpoint or evaluation harness), contributor growth (typically researchers being added), and a quiet shift toward Python-heavy commits. The volume of public model checkpoints on Hugging Face — though outside GitHub itself — provides a strong cross-validation signal for AI startups whose GitHub activity is accelerating.

The fintech sector has the lowest commit volume relative to team size of any technical sector. Compliance review, security audits, and regulator-facing change-control processes act as natural throttles. The fintech acceleration pattern is therefore more weighted toward contributor count and repository expansion than toward velocity. A fintech startup adding three engineers in a quarter is a stronger signal than a Series A AI startup doubling commit volume, even though the latter looks more dramatic in raw numbers. Fintech infrastructure plays — payment rails, ledger systems, KYC stacks — typically signal in the language mix dimension, often with measurable shifts toward Rust or Go for performance-critical services.

Developer tools has the highest contributor diversity. Open source contribution is itself part of the product strategy for most dev tool startups, and the contributor graph is structurally different: a typical breakout shows external contributors growing alongside internal engineers, with the external contributor velocity often outpacing the internal as the product gains adoption. The acceleration pattern that matters in dev tools is not founder team velocity but ecosystem velocity — the rate at which non-employees are submitting pull requests, opening issues, and starring repositories. This is also the sector where stars have meaningful information content; in most other sectors stars are noise.

Cybersecurity startups have a distinctive timing pattern. Compliance and certification cycles produce regular engineering bursts that can be confused with breakout signals. The diagnostic question for a cybersecurity acceleration is whether new repository creation accompanies the velocity move; cyclical compliance work is contained within existing repositories, while genuine product expansion produces new repositories. Sector-specific knowledge — being able to read whether a new repo name implies a SOC 2 control, a SIEM connector, or a new product surface — is essential for interpretation.

Climate-tech and energy startups have the slowest engineering metabolism of any technical sector. Hardware-software stacks, regulatory environments, and physical infrastructure dependencies all slow shipping cycles. A climate-tech acceleration is therefore most meaningful when it occurs in the software layer specifically — typically in companies whose SaaS or analytics surfaces are accelerating ahead of the underlying hardware. The signal-to-noise ratio in climate-tech requires the longest comparison windows; 28-day rolling windows often work better than 14-day for this sector.

Developer-infrastructure and data-tooling startups show the cleanest acceleration patterns. The codebases are typically open source, the contributor graphs are well-defined, and the language mix is stable. This is the sector where the basic +100% rule with two-period confirmation works most reliably without sector-specific adjustments. It is also the sector where the framework was first developed, which is a confounder: the metric structure was tuned on this kind of company.

Healthcare and biotech software startups present the trickiest interpretation challenge. Many have public-facing software that is incidental to a closed-source core platform; the GitHub activity reflects a developer experience layer rather than the core product. The signal works for these companies but requires reading the activity in the context of the company's public technical scope. Pure-software healthcare plays — payer-facing analytics, EHR-integration tools, telemedicine platforms — signal cleanly. Hardware-coupled biotech does not signal at all on this metric and requires alternative data sources entirely.

Web3 and crypto startups have a unique pattern: very high commit velocity relative to team size, driven by the open-source-by-default norms of the sector. Acceleration in Web3 is meaningful only when it diverges from the sector baseline; routine velocity is high enough that absolute metrics are uninformative. The most useful signal is often repository expansion (new protocol modules, new chain integrations) rather than commit velocity itself.

Across all sectors, the meta-pattern is that interpretation requires sector context. A pipeline that ranks across sectors without normalization will systematically over-rank AI and Web3 (high baseline volatility) and under-rank fintech and climate-tech (low baseline volatility). Sector-stratified rankings — top 10 within each sector independently — are the practical default for cross-sector investor reports.

## Common pitfalls: when GitHub signals lie

The framework's failure modes are predictable and worth cataloguing. A working pipeline is one whose users have internalized the failure modes rather than one that has eliminated them.

The bot inflation problem is the most common false positive. Dependabot, Renovate, GitHub Actions auto-commits, and various code formatters can drive double-digit commit counts per week without any human engineering. The fix is straightforward — exclude commits from accounts whose names or types match known bot patterns — but it must be applied consistently. A pipeline that does not filter bots will systematically over-rank organizations with aggressive automation tooling.

The single-contributor problem is a structural confounder at pre-seed. A solo founder can drive +500% acceleration in a single 14-day window through pure personal effort, without any signal of fundraise readiness or team expansion. The two-period confirmation rule plus contributor-count cross-validation handles most cases, but pre-seed signals always require human review.

The launch-versus-fundraise problem is a recurring interpretation issue. An acceleration sometimes resolves into a product launch rather than a fundraise. Both are interesting investor events, but they imply different conversations. The diagnostic clue is sequencing: a launch tends to produce a coordinated burst over four to six weeks followed by a sharp drop-off as the team transitions into post-launch maintenance, while a fundraise-driven acceleration sustains over a longer period as the team continues to scale.

The acquisition-driven acceleration is a structural false positive at later stages. A Series C team absorbing an acquired engineering team can show +200% acceleration that has nothing to do with internal momentum. Cross-referencing accelerations against announced M&A activity and inspecting the new contributor graph for clusters of recently joined accounts catches most of these.

The fork-and-rename pattern affects developer-tools startups specifically. A team forking an existing open-source project and rebranding it as part of their product can show explosive initial commit counts that reflect the fork's commit history, not the team's actual recent activity. Filtering by commit author dates rather than author timestamps, and excluding commits authored before the fork date, removes this artifact.

The compliance-driven cycle in regulated sectors (fintech, healthcare, government tech) produces predictable acceleration bursts around quarterly compliance cycles. These look like real signals if read in isolation but are routine when put in context. Sector-specific knowledge of compliance calendars helps but the more durable solution is to compare each company against its own historical compliance cycles — a SOC 2-driven burst this quarter is probably not interesting if the same burst occurred in the same quarter last year.

The migration-not-acceleration pattern is subtle. A team migrating its codebase from one repository to another, or one platform to another, can show massive commit velocity in the new repository while the old repository goes quiet. The total team engineering output may be unchanged, but the metric reads acceleration. A pipeline that monitors organization-level totals rather than repository-level totals catches this.

The vanity-project problem affects founder-led startups specifically. A founder's public coding side projects, hobby repositories, and educational content can be conflated with the actual startup's engineering activity. The fix is curation: the target list must specify which organizations and repositories belong to each company, and the pipeline must respect that mapping rigorously.

The dormant-then-explosive pattern is operationally important. A startup that goes silent for months and then suddenly accelerates is not necessarily a breakout; it can be an acquisition by a larger team, a pivot, or a re-engagement after a product redesign. The pattern requires interpretation: dormancy followed by gradual rebuilding looks different from dormancy followed by sudden bot-inflated activity.

Each pitfall is, in isolation, a defeatable problem. The full collection requires discipline. The framework's reliability comes from running multiple checks at each stage rather than from any single bulletproof rule.

## Tools comparison: GitDealFlow vs alternative data platforms

The competitive landscape in 2026 spans several categories, each with distinct positioning. Understanding the tradeoffs is helpful for investors choosing where to invest data infrastructure budget.

Harmonic.ai operates upstream of engineering acceleration, identifying promising teams at incorporation through founder pattern matching. Its strength is earliness; its limitation is high noise at the very top of the funnel. Investors using Harmonic typically supplement it with an engineering-acceleration layer for confirmation signals.

Affinity provides relationship-graph context, enriching CRM data with relationship signals across portfolios. Affinity is complementary rather than competitive: the engineering acceleration signal answers which startup, and Affinity answers who do we know there. Most funds using both run them as parallel layers in the same workflow.

Tracxn and CB Insights are taxonomic data platforms, organizing the global startup population into sector and stage taxonomies with funding history. Their lead time is similar to Crunchbase: data appears after public events. They are best used as pipeline context — verifying the funding history of a startup whose engineering signal is breaking — rather than as primary discovery tools.

PitchBook and Crunchbase Enterprise dominate the institutional investor data category. Their datasets are deep, their analyst coverage is broad, and their ecosystem integrations are mature. Engineering acceleration provides a leading-indicator layer that PitchBook and Crunchbase do not natively provide; the two tools are complementary.

Dealroom provides a European-focused alternative with similar lead-time profile to Crunchbase. Some European funds prefer it for regional coverage.

Specter and Synaptic are newer alternative-data providers focused on web traffic, social signals, and product telemetry. Their signal mix is largely orthogonal to engineering acceleration: web traffic and social signals are typically downstream of engineering activity, so the two can be combined for cross-validation.

VC Deal Flow Signal occupies a specific position in this landscape: GitHub-derived engineering acceleration as a leading indicator, priced for individual investors and small funds rather than enterprise contracts. The free weekly Signal Report covers the top breakouts; the Dashboard at EUR 9.97/month adds filtering by sector, stage, and geography; the API and MCP integrations support funds that want to incorporate the signal into their own pipelines.

The pragmatic recommendation for most funds is layered: PitchBook or Crunchbase for taxonomy and funding history, Affinity or Salesforce for relationship management, engineering acceleration for early discovery, and one or two complementary alternative-data sources for cross-validation. No single source is sufficient; the edge comes from running multiple sources in concert.

For investors who do not yet have an alternative-data layer, engineering acceleration is the highest-value first addition because its lead time is the longest and its signal-to-noise ratio is among the best. Building from the engineering acceleration foundation outward — adding hiring data next, then web telemetry, then social signals — produces a stack that catches breakout startups across multiple stages of their development.

## The future: where engineering acceleration as a VC metric is going

Three trajectories are visible in 2026 that will shape engineering acceleration as a venture metric over the next 36 months.

The first trajectory is wider model adoption. As the framework moves from a few specialized data providers into broader fund-level adoption, the metric's predictive lift will compress. This is the standard fate of any signal once it is widely known. The compression is partial, not total: the underlying causal structure — engineering activity preceding the public events that traditional databases capture — does not disappear, but the timing edge for any individual fund narrows as more funds source from the same signal.

The second trajectory is signal layering. The most sophisticated funds in 2026 are already combining engineering acceleration with hiring data, web telemetry, social signals, and proprietary network signals into composite scores. The compositional pipeline produces stronger predictions than any single source, and the construction of the composite is itself a fund-specific competitive asset. Engineering acceleration is best understood as a high-quality input to composite ranking systems rather than as a stand-alone product.

The third trajectory is private-repository signal recovery. The largest blind spot in the GitHub-only framework is private repositories. A growing number of startups host their core code in private GitHub repositories, GitLab self-hosted instances, or proprietary code platforms. Several emerging data products are exploring privacy-preserving aggregations — opt-in founder dashboards that surface aggregated metrics without exposing source code — that may eventually fill this gap. None has reached scale in 2026, and the privacy and trust barriers are significant, but the long-term direction is toward broader signal coverage.

A fourth trajectory worth flagging is regulatory. As alternative data becomes more central to investing, scrutiny of how the data is collected and used will increase. Engineering acceleration, by virtue of being purely public-data driven, is unusually well-positioned for this scrutiny — it does not depend on terms-of-service-violating scraping, it does not require privileged access to closed APIs, and it does not surface personal information about employees or founders beyond what GitHub itself makes public. The framework's robustness to regulatory pressure is itself a structural advantage relative to alternative data sources whose collection methods are murkier.

The metric will not remain unique or proprietary indefinitely. Its value is in being correctly understood, not in being secret. The funds that internalize the framework, integrate it into their workflows, and build reliable conversion pipelines will continue to extract value from it even as broader adoption compresses individual signal margins. The funds that treat it as a passing data fad will not.

## How to start tracking engineering acceleration this week

The minimum viable starting workflow for an individual investor or small fund is short.

Begin by subscribing to the free weekly Signal Report at gitdealflow.com. The Monday digest provides the top five breakout startups with the signal type, magnitude, and direct GitHub link for each. This requires zero infrastructure and zero engineering effort and provides exposure to the framework's output.

In parallel, build a starter target list. Pick two or three sectors of focus, identify 50 to 100 startups whose GitHub organizations are publicly known, and bookmark their pages. Use the GitHub interface's commit activity graphs as a manual replacement for the pipeline; while less rigorous than a programmatic version, the visual pattern of acceleration is recognizable to any engineer. This calibrates the eye.

After two to four weeks of working from the digest plus manual cross-references, the investor has enough context to use the Dashboard productively. The EUR 9.97/month Dashboard provides ranked rankings across all 4,200 organizations, filterable by sector, stage, and geography, with the four core metrics displayed for each company. The screening time per Monday drops from 30 minutes of digest reading to 10 minutes of filtered ranking review.

For funds with engineering capacity, the API or MCP server (npx -y @gitdealflow/mcp-signal) provides direct programmatic access. The API can be wired into the fund's existing CRM or data warehouse for automated CRM enrichment, weekly reporting, and custom alert workflows.

For funds with the deepest engineering investment, building an in-house pipeline using the framework described in this playbook is feasible in roughly four to six weeks of engineering time. The result is fully fund-controlled and customizable, but it requires ongoing maintenance — GitHub API changes, target list curation, and noise filtering all demand engineering attention. The build-versus-buy decision tracks the standard pattern: building makes sense for funds with persistent engineering staff and specific differentiation needs; buying makes sense for funds whose differentiation comes from elsewhere.

Whichever entry point fits, the time-to-first-signal is short. The framework rewards consistent application — running it weekly for 12 weeks produces meaningfully better calibration than running it once. The compounding asset is not the data but the investor's growing fluency in reading it.

Engineering acceleration is not a magic source of alpha. It is a well-defined, publicly observable signal that arrives weeks before the data sources most investors currently use. That timing edge is real and measurable, and capturing it requires nothing more than the discipline to look at the signal every week.

For weekly breakout signals across 20 technical sectors, see the [sector rankings](/) and the [methodology](/methodology) page. The full academic-style write-up of the framework is available at [ssrn.com/abstract=6606558](https://ssrn.com/abstract=6606558).`,
  },
  {
    slug: "47-alternative-data-sources-angel-investors-2026",
    title: "47 Alternative Data Sources for Angel Investors in 2026",
    description:
      "Most angel investors check 3 sources. Here are 47 signals that catch startups 6-12 weeks before Crunchbase, from GitHub velocity to SEC Form D filings.",
    summary:
      "Most angel investors only check Crunchbase, LinkedIn, and the pitch deck. All three are lagging indicators. This guide covers 47 alternative data sources across 10 categories, each with an access note, typical lead time, and a starting URL. The categories cover public code signals, hiring, product telemetry, infrastructure buildouts, search and attention, funding precursors, community growth, regulatory filings, open-data scientific signals, and niche commercial APIs. Use this as a reference for building a sourcing stack that surfaces breakout companies 6-12 weeks before they hit a VC database.",
    date: "2026-04-22",
    relatedSectors: ["ai-ml", "developer-tools", "data-infrastructure", "fintech", "enterprise-saas"],
    faqs: [
      {
        question: "What are alternative data sources for angel investing?",
        answer: "Alternative data sources are any signals outside the standard Crunchbase or LinkedIn pipeline that reveal startup traction before it shows up in a fundraise announcement. Examples include GitHub commit velocity, SEC Form D filings, npm package downloads, Discord server growth, and SSL certificate transparency logs. Each source has a different lead time – some surface signals 6-12 weeks before a traditional database, which is the window that matters for angels who want to reach founders before a round is crowded.",
      },
      {
        question: "Which alternative data source has the longest lead time?",
        answer: "GitHub engineering acceleration typically gives the longest lead time, averaging 6-12 weeks before fundraise announcements. SEC Form D filings also give a structural edge because they are filed within 15 days of a first sale of securities, and most press coverage follows 4-6 weeks later. SSL certificate transparency logs and DNS record changes can flag infrastructure buildouts even earlier, though they require more interpretation.",
      },
      {
        question: "Do I need a paid API to use alternative data sources?",
        answer: "No. Most of the 47 sources in this guide are free or have a generous free tier. GitHub, npm, PyPI, Docker Hub, SEC EDGAR, Companies House UK, USPTO, FDA, ClinicalTrials.gov, OpenAlex, bioRxiv, Hugging Face, and Google Trends are all free with public APIs or web interfaces. Paid sources like Specter, Synaptic, and Predictleads are only worth the spend if you are sourcing at scale; a solo angel can build a credible signal stack entirely from free sources.",
      },
    ],
    body: `Most angel investors only check 3 data sources: Crunchbase, LinkedIn, and the pitch deck. The problem: those are all lagging. By the time a startup shows up there, the signal is already priced into the round.

Here are 47 alternative data sources that surface breakout startups 6-12 weeks before they hit a VC database. We publish our methodology at [ssrn.com/abstract=6606558](https://ssrn.com/abstract=6606558).

Table of contents

1. Public code signals (6)
2. Hiring and team signals (5)
3. Product telemetry (5)
4. Infrastructure buildouts (5)
5. Search and attention (5)
6. Funding leading indicators (4)
7. Community signals (3)
8. Regulatory and IP (4)
9. Open-data scientific (5)
10. Niche commercial APIs (5)

## 1. Public code signals

The earliest signal of startup momentum is usually in public code. A team shipping fast leaves a timestamped trail that is hard to fake and easy to query.

1. GitHub commit velocity, contributors, stars. Track the rate of change in 14-day commit counts across a company's public repositories, not absolute output. A doubling in two weeks typically means a hiring burst or a product sprint. Contributor graph growth confirms headcount expansion; star velocity on a founder's personal repo often flags dev-tool launches weeks before Product Hunt. Access: free REST and GraphQL APIs with 5,000 requests per hour for authenticated users. Lead time: 6-12 weeks. Start at [docs.github.com/en/rest](https://docs.github.com/en/rest).

2. GitLab public project activity. GitLab hosts a smaller but non-overlapping population, especially European dev-tool and infra companies. The activity API returns push events, issue creation, and merge requests with timestamps. Access: free API, public-project scope is open. Lead time: 4-10 weeks. Start at [docs.gitlab.com/ee/api/events.html](https://docs.gitlab.com/ee/api/events.html).

3. npm package downloads. Weekly download counts for a startup's published packages correlate with developer adoption. A 3x week-over-week jump on a niche package often precedes a Series A. Access: free downloads API. Lead time: 4-8 weeks. Start at [github.com/npm/registry — download counts](https://github.com/npm/registry/blob/main/docs/download-counts.md).

4. PyPI download statistics. Python equivalents via BigQuery's public dataset, which exposes per-package daily downloads since 2016. Useful for ML, data, and scientific-tooling startups. Access: free via Google BigQuery (first 1TB per month is free). Lead time: 4-8 weeks. Start at [pypistats.org](https://pypistats.org).

5. Docker Hub image pulls. Public image pull counts reveal production adoption. A containerized product crossing 10k monthly pulls is usually past proof-of-concept. Access: pull counts visible on the public page; batch via the unofficial API. Lead time: 3-6 weeks. Start at [hub.docker.com](https://hub.docker.com).

6. Release cadence on GitHub Releases. The gap between tagged releases is a clean proxy for shipping velocity. A move from monthly to weekly releases usually means a team scale-up. Access: free, part of the GitHub REST API. Lead time: 4-8 weeks. Start at [docs.github.com/en/rest/releases](https://docs.github.com/en/rest/releases).

## 2. Hiring and team signals

Headcount moves before revenue, and hiring intent shows up in public job boards weeks before offers are signed.

7. LinkedIn employee count over time. Track the delta in headcount and function mix. A jump in senior engineering hires is a classic pre-Series-A signal. Access: free via company pages; scraping is against ToS, so use the LinkedIn Sales Navigator API or a licensed provider. Lead time: 4-8 weeks. Start at [linkedin.com](https://www.linkedin.com/).

8. Hacker News Who Is Hiring threads. Monthly thread where YC and non-YC startups post roles directly. A company appearing for the first time, especially with multiple roles, signals fresh capital. Access: free, use the HN Algolia API. Lead time: 3-6 weeks. Start at [hn.algolia.com/api](https://hn.algolia.com/api).

9. AngelList Talent job postings. Wellfound (formerly AngelList Talent) still surfaces early-stage roles with salary and equity ranges. The equity band often hints at the company's stage more clearly than the pitch deck. Access: free browsing, paid API. Lead time: 3-6 weeks. Start at [wellfound.com](https://wellfound.com).

10. Gem.com outbound hiring signals. Gem aggregates anonymized recruiter outbound activity. A spike in recruiter outreach for a company or from its recruiters is a compound signal: hiring, capital, and sector heat. Access: paid API, designed for recruiting teams. Lead time: 4-6 weeks. Start at [gem.com](https://gem.com).

11. Indeed and general job-board velocity. Indeed's free search surfaces the same roles across the long tail of job sites. The week-over-week change in posted-role count per company is noisy but useful for cross-checks. Access: free search, paid API. Lead time: 2-4 weeks. Start at [indeed.com](https://indeed.com).

## 3. Product telemetry

Public product surfaces leak more than teams realize. Launch platforms, tech stacks, and traffic estimators all give early reads on adoption.

12. Product Hunt launches. Even failed PH launches tell you the founder has shipped and is running distribution. The velocity of a maker's past PH launches often indicates pace. Access: free GraphQL API. Lead time: 2-6 weeks. Start at [api.producthunt.com](https://api.producthunt.com/v2/docs).

13. BuiltWith tech stack changes. BuiltWith logs the JavaScript, CMS, analytics, and payment stack of every crawled domain over time. A move from Stripe to a custom billing stack usually means enterprise pivot. Access: free for single-domain lookups, paid API for bulk. Lead time: 4-8 weeks. Start at [builtwith.com](https://builtwith.com).

14. Similarweb traffic estimates. Directional traffic data that is noisy below 5k monthly visits but solid above. A 3x month-over-month lift on a product subdomain is almost always real growth. Access: free tier with limits, paid API. Lead time: 4-6 weeks. Start at [similarweb.com](https://similarweb.com).

15. Wappalyzer tech detection. Browser extension and API that fingerprints frontend and backend stacks. Useful to spot when a startup migrates from a no-code stack to a custom build, which usually means Series A traction. Access: free extension, paid API. Lead time: 4-8 weeks. Start at [wappalyzer.com](https://wappalyzer.com).

16. App Annie, now data.ai, rank shifts. Mobile-app App Store and Play Store rank data. A consumer app breaking into a category top-50 is visible 1-2 months before mainstream coverage. Access: free web views, paid API. Lead time: 4-6 weeks. Start at [data.ai](https://data.ai).

## 4. Infrastructure buildouts

The pipes a startup builds are often the clearest sign of ambition. Infrastructure commitments precede revenue by months.

17. AWS IP blocks and service footprint. AWS publishes its IP ranges as JSON. Cross-referencing against Passive DNS reveals when a company spins up new regions, which is a capital-commitment signal. Access: free JSON feed, Passive DNS tools are freemium. Lead time: 6-10 weeks. Start at [ip-ranges.amazonaws.com/ip-ranges.json](https://ip-ranges.amazonaws.com/ip-ranges.json).

18. DNS record changes. SecurityTrails, DNSDumpster, and RiskIQ all let you diff a company's DNS records over time. New subdomains like api.v2, eu.company.com, or enterprise.company.com all hint at product direction. Access: freemium across providers. Lead time: 4-8 weeks. Start at [securitytrails.com](https://securitytrails.com).

19. SSL certificate transparency logs. Every TLS cert issued is logged publicly and searchable. New cert for a stealth domain owned by a founder is a classic stealth-launch signal. Access: free via crt.sh. Lead time: 6-12 weeks. Start at [crt.sh](https://crt.sh).

20. Cloudflare RADAR. Free dashboard of DNS, HTTP, and attack trends at the network level. The per-domain traffic tab gives directional traffic and is harder to game than Similarweb. Access: free. Lead time: 2-6 weeks. Start at [radar.cloudflare.com](https://radar.cloudflare.com).

21. HTTP Archive. Bi-monthly crawl of the top-million sites with full waterfall data. Useful to spot when a startup cleans up its frontend or adds a CDN, both common pre-launch moves. Access: free, data in BigQuery public datasets. Lead time: 4-8 weeks. Start at [httparchive.org](https://httparchive.org).

## 5. Search and attention

Attention is the oldest leading indicator. Search volume, forum momentum, and preprint citations all show demand before revenue.

22. Google Trends. Free normalized search-volume data for any term or brand. A rising 90-day chart for a startup's name, ahead of its sector, usually means the founder has figured out distribution. Access: free web UI, unofficial APIs. Lead time: 2-6 weeks. Start at [trends.google.com](https://trends.google.com).

23. Reddit post velocity. Reddit's search API exposes post and comment counts per subreddit per keyword over time. A startup getting organic r/selfhosted or r/ClaudeAI mentions is often 1-2 months ahead of its PR cycle. Access: free API with rate limits. Lead time: 3-6 weeks. Start at [reddit.com/dev/api](https://reddit.com/dev/api).

24. Hacker News score curves. The HN Algolia API returns every submission with its final score and comment count. A Show HN that crosses 200 points in a niche is a durable signal, especially for dev-tool companies. Access: free. Lead time: 2-8 weeks. Start at [hn.algolia.com/api](https://hn.algolia.com/api).

25. arXiv citation lift. Semantic Scholar and OpenAlex both expose citation counts per paper per month. A preprint that triples citations in 30 days often accompanies a spinout. Access: free via Semantic Scholar API. Lead time: 8-16 weeks. Start at [api.semanticscholar.org](https://api.semanticscholar.org).

26. Substack subscriber growth. Founders who run newsletters expose subscriber counts on their public pages. A jump from 5k to 20k over a quarter is a distribution signal that usually precedes a product launch. Access: free web scraping, ToS permitting. Lead time: 4-8 weeks. Start at [substack.com](https://substack.com).

## 6. Funding leading indicators

Regulatory filings are the closest thing to a legally required fundraise announcement, and they are free.

27. SEC Form D filings. Every US private offering must file Form D within 15 days of first sale. The free EDGAR full-text search lets you query by issuer, promoter, or amount. Access: free. Lead time: 4-8 weeks before press coverage. Start at [efts.sec.gov/LATEST/search-index](https://efts.sec.gov/LATEST/search-index).

28. EDGAR full-text search. Beyond Form D, EDGAR indexes S-1, 10-K, and 8-K filings from public companies that often disclose acquisitions, investments, or partnerships with private startups. Access: free. Lead time: 2-6 weeks. Start at [efts.sec.gov/LATEST/search-index](https://efts.sec.gov/LATEST/search-index).

29. Companies House UK. Free register of every UK company, with director changes, charges, and confirmation statements. A new Series A usually shows up as a charge registered against new preference shares. Access: free API. Lead time: 2-4 weeks. Start at [find-and-update.company-information.service.gov.uk](https://find-and-update.company-information.service.gov.uk).

30. French INPI. France's national company register, equivalent to Companies House, with capital increases and articles of incorporation. Free access via data.inpi.fr. Access: free. Lead time: 2-4 weeks. Start at [data.inpi.fr](https://data.inpi.fr).

## 7. Community signals

A startup's community growth rate is sometimes the only metric the founder cares about, and it is often publicly visible.

31. Discord server growth. Public Discord servers expose member counts via server invites. Track weekly counts; a 2x jump in a month often signals a launch. Access: free, use the Discord API with a bot token. Lead time: 2-6 weeks. Start at [discord.com/developers/docs](https://discord.com/developers/docs).

32. Slack community join rate. Many dev-tool startups run Slack communities with public invite links. Some expose member counts directly; for others, a simple periodic join-ping tracks the count. Access: free via the workspace's own public signals. Lead time: 3-6 weeks. Start at [slack.com/community](https://slack.com/community).

33. Telegram subscriber velocity. Public Telegram channels show subscriber counts directly. Track the weekly delta; in crypto and consumer categories, a rising channel often precedes a token or app launch. Access: free via the Telegram Bot API. Lead time: 2-4 weeks. Start at [core.telegram.org/bots/api](https://core.telegram.org/bots/api).

## 8. Regulatory and IP

Patent, clinical, and regulatory filings are the most underrated signal class. They are legally dated, structured, and free.

34. USPTO patent filings. Full-text search of every US patent and application, including inventor and assignee. A startup assigning three patents in six months is either pre-IPO or pre-acquisition. Access: free via PatentsView API. Lead time: 12-24 weeks. Start at [patentsview.org/apis](https://patentsview.org/apis).

35. FDA 510k clearances. Medical-device clearances are publicly searchable. A 510k clearance is often the trigger for a Series A or B in medtech. Access: free. Lead time: 4-12 weeks. Start at [fda.gov/medical-devices/510k-clearances](https://fda.gov/medical-devices/510k-clearances).

36. ClinicalTrials.gov. Every US-regulated clinical trial is registered with sponsor, phase, and primary endpoint. A new Phase 2 trial from a private biotech is a capital-event leading indicator. Access: free API. Lead time: 8-16 weeks. Start at [clinicaltrials.gov/data-api](https://clinicaltrials.gov/data-api).

37. EU MDR database. EUDAMED tracks every medical device in the EU market. Registration of a new device by a private company often precedes EU commercial launch by a quarter. Access: free web search. Lead time: 6-12 weeks. Start at [ec.europa.eu/tools/eudamed](https://ec.europa.eu/tools/eudamed).

## 9. Open-data scientific

Science happens in public now. Preprints, dataset releases, and model uploads all reveal what research-heavy startups are actually building.

38. SSRN papers. Social Science Research Network hosts working papers across economics, finance, and legal research. A startup's founding team publishing on SSRN often indicates the academic anchor for the thesis. Access: free. Lead time: 12-24 weeks. Start at [ssrn.com](https://ssrn.com).

39. bioRxiv preprints. The main biology preprint server. A startup's scientific advisors publishing a preprint in the company's domain is often the first public trace of the thesis. Access: free API. Lead time: 12-26 weeks. Start at [api.biorxiv.org](https://api.biorxiv.org).

40. medRxiv preprints. The clinical medicine counterpart to bioRxiv. Useful for surfacing digital-health and clinical-decision startups before they incorporate. Access: free. Lead time: 12-26 weeks. Start at [medrxiv.org](https://medrxiv.org).

41. OpenAlex index. Open-data replacement for Microsoft Academic Graph, with every scholarly work indexed and citation graphs exposed. Useful for tracking a founder's publication trajectory. Access: free API. Lead time: 12-24 weeks. Start at [openalex.org](https://openalex.org).

42. Hugging Face models and datasets. Every public model or dataset on HF has a timestamped upload and download history. A startup releasing a flagship open model is usually doing distribution before a product launch. Access: free API. Lead time: 4-12 weeks. Start at [huggingface.co/docs/hub/api](https://huggingface.co/docs/hub/api).

## 10. Niche commercial APIs

These are paid or semi-paid services that aggregate several of the above into investor-ready feeds. Only worth the cost once you are sourcing at scale.

43. Crunchbase API. The standard, though lagging. Still useful as a baseline and for entity disambiguation across other sources. Access: paid API, limited free tier via the website. Lead time: 0-2 weeks. Start at [data.crunchbase.com/docs](https://data.crunchbase.com/docs).

44. Specter API. Specter aggregates employee count, web traffic, funding, and tech-stack signals into a single company record. Good for mid-stage sourcing. Access: paid. Lead time: 2-6 weeks. Start at [tryspecter.com](https://tryspecter.com).

45. Synaptic. Focused on consumer and mobile, pulls app-store data, web traffic, and paid-marketing spend into a unified feed. Access: paid, enterprise pricing. Lead time: 2-6 weeks. Start at [synaptic.com](https://synaptic.com).

46. Predictleads. Monitors company websites for job postings, technology changes, and press releases. Designed for sales teams but useful as a funding-intent feed. Access: paid API. Lead time: 2-4 weeks. Start at [predictleads.com](https://predictleads.com).

47. 4Degrees. CRM-native signal layer that pipes relationship and news data into a deal-flow pipeline. More useful to partners managing a portfolio than to solo angels. Access: paid. Lead time: 2-4 weeks. Start at [4degrees.ai](https://4degrees.ai).

## Putting it together

No solo angel will monitor all 47 in real time. The point is to pick a subset that matches your sector and stage.

If you invest in dev tools, AI, data infrastructure, or developer-facing SaaS, categories 1 through 4 cover most of the public-code surface. That is the subset [GitDealFlow aggregates](/) across 20 sectors, scored and ranked weekly. The [Prediction Game](/predict) turns it into a public track record you can share.

For biotech, medtech, and research-heavy verticals, categories 8 and 9 give the longest lead time. For consumer, categories 3 and 5 move fastest.

Our methodology for using the first four categories to predict fundraises is published on SSRN at [ssrn.com/abstract=6606558](https://ssrn.com/abstract=6606558), with the underlying dataset open on Hugging Face. The single most important rule: measure change from a company's own baseline, not absolute output. That filters out the docs sprints, the CI noise, and the popularity that does not convert into product.`,
  },
  {
    slug: "how-to-read-github-signals-for-startup-investing",
    title: "How to Read GitHub Signals for Startup Investing",
    description:
      "A practical guide for investors on interpreting GitHub engineering activity as a leading indicator of startup traction. Covers commit velocity, contributor growth, and what patterns actually predict fundraises.",
    references: [
      { label: "1", title: "GitHub REST API – Commit Activity", url: "https://docs.github.com/en/rest/metrics/statistics#get-the-last-year-of-commit-activity", source: "GitHub Docs" },
      { label: "2", title: "GitHub REST API – Contributors", url: "https://docs.github.com/en/rest/metrics/statistics#get-all-contributor-commit-activity", source: "GitHub Docs" },
      { label: "3", title: "Alternative Data in Private Markets", url: "https://www.bain.com/insights/alternative-data-in-private-equity/", source: "Bain & Company" },
    ],
    keyStats: [
      { value: "6-12 weeks", label: "Signal lead time", context: "Before fundraise announcements" },
      { value: "20", label: "Sectors tracked", context: "Updated weekly" },
      { value: "4", label: "Signal types", context: "Hiring burst, buildout, spike, migration" },
    ],
    summary:
      "GitHub commit velocity – measured as the rate of change in 14-day commit counts – is the earliest publicly available signal of startup momentum. When a startup's engineering acceleration doubles in a two-week window, it typically precedes a fundraise announcement by three to six weeks. This guide covers the four signal types (hiring burst, infrastructure buildout, deploy spike, framework migration), what to ignore, and a practical workflow for turning GitHub data into actionable deal flow.",
    date: "2026-03-28",
    relatedSectors: ["ai-ml", "developer-tools", "data-infrastructure"],
    figures: [
      { id: "signal-types", afterHeading: "Four Types of Engineering Signals" },
      { id: "signal-timeline", afterHeading: "When Do Engineering Signals" },
    ],
    howTo: {
      name: "How to Read GitHub Signals for Startup Investing",
      description:
        "A step-by-step process for using public GitHub engineering data to identify breakout startups before they raise. Takes 15-20 minutes per company.",
      totalTime: "PT20M",
      steps: [
        {
          name: "Pick 2-3 sectors you know well",
          text: "Focus on sectors where you have domain expertise. This lets you distinguish meaningful engineering acceleration from routine activity. VC Deal Flow Signal tracks 20 sectors – start with your strongest.",
        },
        {
          name: "Watch the weekly sector rankings for unfamiliar names",
          text: "Check the sector ranking pages each week. When a startup you do not recognize appears in the top 3 by commit velocity change, flag it for research. The top movers are showing engineering acceleration that has historically preceded fundraises by 6-12 weeks.",
        },
        {
          name: "Classify the signal type",
          text: "Look at whether the acceleration is driven by contributor growth (hiring burst), new repositories (infrastructure buildout), raw velocity increase (deploy spike), or general acceleration (framework migration). Each type tells you something different about the company's stage and trajectory.",
        },
        {
          name: "Cross-reference with Crunchbase and the company's GitHub",
          text: "Check the startup's funding history on Crunchbase. Are they pre-raise or post-raise? Then look at their GitHub directly: is the activity product-related or maintenance noise? Does the tech stack match what they claim to be building?",
        },
        {
          name: "Reach out during the acceleration window",
          text: "If the signal is strong and the timing is right (weeks 2-4 of a velocity spike), reach out to the founder. You are ahead of the crowd at this point – most investors will not hear about the company for another 4-8 weeks.",
        },
      ],
    },
    faqs: [
      {
        question: "What is engineering acceleration in the context of startup investing?",
        answer: "Engineering acceleration is the rate of change in a startup's commit velocity – not absolute output, but whether engineering activity is speeding up relative to the company's own baseline. When a startup's commit velocity doubles in two weeks, something fundamental has changed: new hires, product-market fit, or fundraise-driven shipping. VC Deal Flow Signal tracks this metric across 20 sectors as a leading indicator of startup momentum.",
      },
      {
        question: "How far in advance do GitHub signals predict fundraises?",
        answer: "In VC Deal Flow Signal's data, engineering acceleration signals precede fundraise announcements by three to six weeks on average. The pattern starts with rising commit velocity in weeks 1-2, becomes obvious in weeks 3-4 with new repositories and classifiable signal types, and the fundraise announcement typically follows in weeks 8-12. Reaching out to founders in weeks 2-4 puts investors ahead of the crowd.",
      },
      {
        question: "Can GitHub commit data be gamed or faked?",
        answer: "While individual commits can be trivially created, sustained engineering acceleration is very difficult to fake. VC Deal Flow Signal measures change from baseline rather than absolute counts, which filters out documentation sprints, CI/CD noise, and inflated commit volumes. A genuine product sprint looks fundamentally different from artificial activity when compared to a company's own historical patterns.",
      },
    ],
    body: `GitHub is the largest free dataset of real-time engineering activity in the world. Every public commit, every new repository, every contributor who joins a project – it is all timestamped and queryable. Yet almost no investor uses it for deal sourcing.

The reason is simple: raw GitHub data is noisy. Thousands of commits a day across millions of repositories. Without a framework for what matters, it is just noise.

This post explains the framework we use at VC Deal Flow Signal to turn GitHub activity into actionable deal flow intelligence.

## What Is Engineering Acceleration?

We do not measure absolute engineering output. A company with 500 commits a week is not necessarily more interesting than one with 50. What matters is the rate of change – acceleration.

When a startup's commit velocity doubles in two weeks, something has changed. Maybe they just closed a seed round and are shipping furiously. Maybe they hired three engineers and are building out infrastructure. Maybe they found product-market fit and are iterating fast on customer feedback.

Whatever the cause, the effect is visible in the commit graph weeks before it appears in a press release or a pitch deck landing in your inbox. We have identified [five specific GitHub patterns that predict fundraises](/blog/5-github-patterns-that-predict-fundraises) with the most consistency.

## What Are the Four Types of Engineering Signals?

We classify engineering acceleration into four patterns:

Engineering hiring burst: Contributor count jumps 50% or more in a short window. This usually means the company just closed a round and is scaling the team. If you are seeing this signal, you are likely too late for the current round – but perfectly timed for the next one.

Infrastructure buildout: Three or more new public repositories created in 30 days. The company is expanding its technical surface area – new microservices, new SDKs, new internal tools. This is classic Series A behavior: the product works, now they are building the platform.

Deploy frequency spike: Commit velocity increases 150% or more versus baseline. The team is shipping at an unusually high rate. This can indicate a product launch, a pivot, or a response to sudden customer demand. All are interesting to investors.

Framework migration: General acceleration that does not fit the above categories. Often indicates a technology stack transition – moving from a prototype stack to a production stack. This is the subtlest signal but can indicate the shift from exploration to exploitation.

## What GitHub Activity Is Not a Useful Signal?

Not all GitHub activity is meaningful for investors:

- Open source maintenance: Popular open source projects have high commit volumes but that tells you nothing about the company's product trajectory.
- Documentation pushes: A burst of markdown commits usually means a docs sprint, not product acceleration.
- CI/CD noise: Some teams commit generated files or configuration changes that inflate commit counts without reflecting product work.

We mitigate these by measuring change from baseline rather than absolute counts. A docs sprint looks different from a product sprint when you compare the commit graph to the company's own history.

## When Do Engineering Signals Appear Before Fundraises?

In our data, engineering acceleration signals precede fundraise announcements by three to six weeks on average. The pattern looks like this:

1. Weeks 1-2: Commit velocity starts climbing. Contributor count may tick up.
2. Weeks 3-4: Acceleration becomes obvious. New repositories appear. Signal type becomes classifiable.
3. Weeks 5-8: The company is heads-down building. If they are raising, the round is in progress but not yet announced.
4. Weeks 8-12: Fundraise announcement, TechCrunch article, your inbox lights up with the same deck everyone else got.

If you are reaching out in weeks 2-4, you are ahead of the crowd. That is the window this data gives you.

## How Should Investors Use This in Practice?

The most effective approach is sector-focused. Pick two or three sectors you know well and watch the weekly rankings:

1. When a startup you do not recognize appears in the top 3, research them.
2. Look at their GitHub: is the activity product-related or infrastructure-related?
3. Cross-reference with Crunchbase: are they pre-raise? Post-raise and scaling?
4. If the signal is strong and the timing is right, reach out to the founder.

The worst thing you can do with this data is use it as a replacement for judgment. Engineering acceleration is a leading indicator, not a guarantee. But combined with sector expertise and founder evaluation, it gives you a structural timing advantage that most investors do not have. For a deeper look at technical evaluation, see our guide on [how VCs use GitHub for due diligence](/blog/github-due-diligence-for-vcs).

## Where Can I Start Watching?

We track engineering acceleration across 20 startup sectors, updated weekly. Each sector page ranks the top startups by commit velocity change and classifies their signal type.

Browse the sector rankings to see which startups are accelerating right now.`,
  },
  {
    slug: "what-is-deal-flow-signal",
    title: "What Is Deal Flow Signal? A Guide for Investors",
    description:
      "Deal flow signal refers to data-driven indicators that help investors identify promising startups before traditional channels surface them. Learn how engineering momentum serves as a leading indicator of traction.",
    references: [
      { label: "1", title: "The Rise of Alternative Data in VC", url: "https://hbr.org/2022/11/how-to-use-alternative-data-to-find-the-best-deals", source: "Harvard Business Review" },
      { label: "2", title: "GitHub Octoverse 2024", url: "https://github.blog/news-insights/octoverse/octoverse-2024/", source: "GitHub Blog" },
    ],
    summary:
      "Deal flow signal is any data-driven indicator that surfaces a promising startup before traditional channels – warm intros, pitch decks, press – bring it to investors. The four main types are engineering signals (GitHub, 6-12 weeks lead time), hiring signals (job boards, 4-8 weeks), web traffic signals (4-6 weeks), and social signals (1-2 weeks). GitHub engineering activity provides the longest lead time and is the hardest to game, making it the most reliable early deal flow signal for venture investors.",
    date: "2026-03-25",
    figures: [
      { id: "lead-time-comparison", afterHeading: "Are GitHub Signals the Best" },
    ],
    relatedSectors: ["enterprise-saas", "fintech", "ai-ml"],
    faqs: [
      {
        question: "What is deal flow signal in venture capital?",
        answer: "Deal flow signal is any data-driven indicator that helps an investor identify a promising startup before traditional deal sourcing channels – warm introductions, pitch decks, demo days, and press coverage – surface it. The most common types include engineering signals (GitHub commit velocity), hiring signals (job postings), web traffic signals, and social signals. Engineering signals provide the longest lead time at 6-12 weeks before fundraise announcements.",
      },
      {
        question: "What types of alternative data can investors use for deal sourcing?",
        answer: "Investors can use four main types of alternative data for deal sourcing: engineering activity from GitHub (6-12 weeks lead time), hiring signals from job boards and LinkedIn (4-8 weeks), web traffic data from tools like SimilarWeb (4-6 weeks), and social signals from Twitter, Hacker News, and Product Hunt (1-2 weeks). GitHub engineering data has the highest lead time and is the hardest to game.",
      },
      {
        question: "How much lead time do engineering signals provide over traditional deal flow?",
        answer: "Engineering signals from GitHub typically provide 6-12 weeks of lead time over traditional deal flow channels. Traditional deal flow – Crunchbase alerts, warm introductions, press coverage – surfaces companies after they have already raised or are well into a competitive round. Engineering acceleration signals appear when the team starts building, which is weeks before any public announcement.",
      },
    ],
    body: `Deal flow signal is any data-driven indicator that helps an investor identify a promising startup before traditional deal sourcing channels surface it. Traditional deal flow relies on warm introductions, pitch decks, demo days, and industry press. Deal flow signal supplements this with quantitative, real-time data.

## Why Is Traditional Deal Flow Not Enough?

Most VCs source deals through their network. The problem is that networks are shared. By the time a startup is making the rounds at demo day or landing in your inbox via a warm intro, it is also landing in every other investor's inbox.

The result is that competitive deals – the ones most likely to generate outsized returns – are identified late and negotiated under pressure. The investor who arrives first has a structural advantage: they set the terms, they build the relationship before the founder is overwhelmed with options. This is why [alternative data is becoming essential for venture capital](/blog/alternative-data-venture-capital).

## What Are the Main Types of Deal Flow Signal?

There are several categories of deal flow signal, each with different lead times and reliability:

Engineering signals (highest lead time): Changes in a startup's public engineering activity – commit velocity, contributor growth, repository creation. These signals appear 6-12 weeks before fundraise announcements because engineering acceleration precedes product milestones, which precede fundraise decisions.

Hiring signals (medium lead time): Job postings, especially for senior engineering and go-to-market roles, indicate growth plans. Lead time is typically 4-8 weeks.

Web traffic signals (medium lead time): Rapid growth in a startup's web traffic can indicate product-market fit. Lead time is 4-6 weeks.

Social signals (low lead time): Mentions on Twitter, Hacker News, Product Hunt, and industry forums. By the time a startup trends on social media, most investors are already aware.

## Why Are GitHub Signals the Best Leading Indicator?

GitHub engineering activity has unique properties that make it the most reliable early deal flow signal:

1. It is hard to fake. Commits represent actual work. You cannot game commit velocity the way you can game social media metrics.
2. It is continuous. Unlike hiring signals (which appear when a job is posted) or press (which appears when a company wants attention), engineering activity happens daily.
3. It is free and public. Unlike web traffic data (which requires third-party tools) or hiring data (which requires scraping job boards), GitHub data is available via a public API.
4. It reveals intent. The type of engineering work – infrastructure buildout vs. feature shipping vs. team scaling – tells you what phase the company is in.

## How Does VC Deal Flow Signal Work?

We monitor GitHub engineering activity across 20 startup sectors. For each sector, we:

1. Identify active startup organizations using topic-based search.
2. Pull commit activity, contributor data, and repository creation data.
3. Calculate 14-day commit velocity and its rate of change.
4. Classify the signal type (hiring burst, infrastructure buildout, deploy spike, framework migration).
5. Rank startups by engineering acceleration (GitHub commit velocity + contributor growth, not accelerator-program participation).

The result is a weekly-updated ranking of startups showing the strongest engineering momentum in each sector. Investors can use this to identify breakout companies weeks before they appear through traditional channels.

## How Do I Get Started with Deal Flow Signal?

The simplest way to start using deal flow signal is to get our free Signal Report – five breakout startups with real GitHub acceleration data, delivered weekly. For deeper access, our Dashboard gives you the full ranked list across all 20 sectors with filtering by stage, geography, and signal type. To learn the practical framework, read our guide on [how to read GitHub signals for startup investing](/blog/how-to-read-github-signals-for-startup-investing).`,
  },
  {
    slug: "github-due-diligence-for-vcs",
    title: "How VCs Use GitHub for Technical Due Diligence",
    description:
      "A practical framework for using public GitHub data in venture capital due diligence. What to look for, what to ignore, and how engineering signals complement traditional diligence methods.",
    references: [
      { label: "1", title: "GitHub REST API – Repository Statistics", url: "https://docs.github.com/en/rest/metrics/statistics", source: "GitHub Docs" },
      { label: "2", title: "Technical Due Diligence for VCs", url: "https://a16z.com/how-to-evaluate-a-technical-team/", source: "Andreessen Horowitz" },
    ],
    keyStats: [
      { value: "2-5 min", label: "Per-company screening time", context: "Using public GitHub data" },
      { value: "5", label: "Diligence dimensions", context: "Velocity, team, tech, repos, strategy" },
      { value: "50%+", label: "Contributor growth threshold", context: "Indicates recent fundraise" },
    ],
    howTo: {
      name: "How to Use GitHub for VC Technical Due Diligence",
      description: "A step-by-step process for using public GitHub data at every stage of the venture investment process – from sourcing through portfolio monitoring.",
      totalTime: "PT15M",
      steps: [
        { name: "Screen with commit velocity change", text: "Use commit velocity change to identify startups worth researching. VC Deal Flow Signal automates this across 20 sectors, surfacing companies showing unusual engineering acceleration." },
        { name: "Check the GitHub organization profile", text: "Look at the GitHub org: how many public repos, when was the last push, is there consistent activity or sporadic bursts? This takes 2 minutes and filters out inactive teams." },
        { name: "Research before the meeting", text: "Before a founder meeting, check their GitHub for languages, frameworks, and active contributor count. This gives you informed technical questions to ask during the call." },
        { name: "Verify founder claims post-meeting", text: "After the founder pitch, cross-reference their claims with GitHub. Does the team size match contributor counts? Does their velocity match commit patterns?" },
        { name: "Monitor portfolio companies", text: "After investing, use GitHub signals as an early warning system. A 50% drop in commit velocity over two months may indicate team attrition or strategic confusion – before the quarterly board update." },
      ],
    },
    summary:
      "Public GitHub data cannot replace a technical deep dive, but it can help investors decide which companies deserve one. GitHub profiles reveal engineering velocity and consistency, team composition, technology choices, and open source strategy. The most effective approach uses GitHub data at every stage: commit velocity change for sourcing, org profiles for initial screening, contributor patterns for pre-meeting research, and ongoing monitoring as a portfolio early-warning system.",
    date: "2026-04-01",
    relatedSectors: ["developer-tools", "ai-ml", "enterprise-saas"],
    faqs: [
      {
        question: "Can public GitHub data replace traditional technical due diligence?",
        answer: "No. Public GitHub data cannot replace a proper technical deep dive with the engineering team. But it can do something equally valuable: help investors decide which companies deserve that deep dive in the first place. It serves as a fast screening tool at the sourcing stage and a verification tool at the due diligence stage, complementing – not replacing – traditional technical evaluation.",
      },
      {
        question: "What should investors look for on a startup's GitHub profile?",
        answer: "Investors should check five things: (1) commit velocity consistency – regular shipping vs. erratic bursts, (2) contributor count and growth – a proxy for team size and scaling, (3) technology choices – whether the stack matches the company's stage, (4) new repository creation – signs of platform building, and (5) the ratio of product code to maintenance activity. These checks take 2-5 minutes per company.",
      },
      {
        question: "Is it ethical to use public GitHub data for investment decisions?",
        answer: "Using public data for investment decisions is legal and common practice. However, investors should not contact individual contributors directly or attempt to recruit from portfolio companies based on GitHub profiles. GitHub data should be one signal among many – never the sole basis for an investment decision. The strongest investment thesis combines engineering signals with market analysis, founder evaluation, and customer reference checks.",
      },
    ],
    body: `Technical due diligence is one of the most time-consuming parts of the venture investment process. VCs typically hire external consultants, schedule deep-dive sessions with engineering teams, and review architecture documents. This process takes weeks and often happens late in the deal cycle.

Public GitHub data cannot replace a proper technical deep dive. But it can do something equally valuable: help you decide which companies deserve that deep dive in the first place.

## What Can Public GitHub Data Tell Investors?

GitHub profiles reveal several dimensions of engineering health that are useful for investors:

Engineering velocity and consistency: Is the team shipping regularly, or are there long gaps followed by frantic bursts? Consistent commit patterns suggest disciplined engineering practices. Erratic patterns may indicate management instability, pivots, or part-time teams.

Team composition signals: Contributor counts, contribution patterns, and the ratio of organizational contributors to external ones reveal team structure. A startup with 3 contributors making 90% of commits has a different risk profile than one with 15 active contributors.

Technology choices: The programming languages, frameworks, and tools visible in public repositories tell you about technical maturity. A seed-stage startup using enterprise-grade infrastructure tooling may be over-engineering. A growth-stage company still on prototype-quality tools may have technical debt.

Open source strategy: Some startups use open source as a go-to-market channel (developer tools, infrastructure). Their GitHub activity IS the product signal. Others keep everything private and only have minor utility repos public. The absence of public activity is not a negative signal for the latter.

## What Are the Limitations of GitHub Data for Due Diligence?

Code quality: Commit volume says nothing about code quality, test coverage, or architectural soundness. A team making 200 commits a week could be writing excellent code or terrible code.

Private repository activity: Most startups keep their core product code private. Public repos may represent only a fraction of actual engineering work. Never assume low public activity means low engineering output.

Individual contributor value: Not all contributors are equal. One senior engineer making 10 thoughtful commits may contribute more value than five junior developers making 50 commits each.

Business context: Engineering acceleration without business context is just a number. The same commit pattern could indicate product-market fit, a desperate pivot, or a hackathon project.

## How Should Investors Use GitHub in Their Due Diligence Process?

Here is how to use GitHub data at each stage of the investment process:

Sourcing stage: Use commit velocity change to identify startups worth researching. This is what VC Deal Flow Signal automates – surfacing the companies showing unusual engineering acceleration. See the [7 engineering metrics every investor should track](/blog/startup-engineering-metrics-investors-should-track) for a complete checklist.

Initial screening: Look at the GitHub organization profile. How many public repos? When was the last push? Is there a pattern of consistent activity, or sporadic bursts? This takes 2 minutes and can save you from scheduling calls with inactive teams.

Pre-meeting research: Before a founder meeting, check their GitHub. What languages and frameworks do they use? How many active contributors? This gives you informed questions to ask during the call.

Post-meeting verification: After hearing the founder's story about their engineering team and roadmap, cross-reference with GitHub. Does the team size they claimed match contributor counts? Does their claimed velocity match commit patterns?

Portfolio monitoring: After investing, use GitHub signals as an early warning system. A portfolio company whose commit velocity drops 50% over two months may be experiencing team attrition, strategic confusion, or runway pressure. This signal appears before the quarterly board update.

## What Are the Ethical Considerations of Using GitHub Data?

Using public data for investment decisions is legal and common. However, there are ethical considerations:

Do not contact individual contributors or attempt to recruit from portfolio companies. GitHub profiles are public, but using them to poach talent is poor form in the investor community.

Do not make investment decisions based solely on GitHub data. It is one signal among many. The strongest investment thesis combines engineering signals with market analysis, founder evaluation, and customer reference checks.

Always remember that engineering acceleration — as VC Deal Flow Signal defines it, measured from public GitHub commit and contributor activity — is a leading indicator, not a guarantee. Some of the fastest-accelerating startups will fail. The data gives you timing advantage, not outcome certainty. For the specific patterns to watch, read about the [5 GitHub patterns that predict fundraises](/blog/5-github-patterns-that-predict-fundraises).`,
  },
  {
    slug: "5-github-patterns-that-predict-fundraises",
    references: [
      { label: "1", title: "GitHub Search API – Repositories", url: "https://docs.github.com/en/rest/search/search#search-repositories", source: "GitHub Docs" },
      { label: "2", title: "Crunchbase Global Funding Report 2025", url: "https://about.crunchbase.com/blog/global-funding-report/", source: "Crunchbase" },
    ],
    keyStats: [
      { value: "5", label: "Predictive patterns", context: "Identified from GitHub data" },
      { value: "50%+", label: "Contributor jump", context: "Pattern 1: hiring burst" },
      { value: "100%+", label: "Velocity regime change", context: "Pattern 5: strongest signal" },
    ],
    title: "5 GitHub Patterns That Predict Startup Fundraises",
    description:
      "Five specific GitHub engineering patterns that have historically preceded startup fundraise announcements by 6-12 weeks. What to look for and why these patterns work as leading indicators.",
    figures: [
      { id: "signal-timeline", afterHeading: "How Should Investors Combine" },
    ],
    summary:
      "Five GitHub patterns reliably precede startup fundraise announcements: (1) the contributor step function – a 50%+ jump in unique contributors, signaling post-round hiring, (2) the infrastructure explosion – 3-5 new repos in a month, (3) the weekend surge – sustained 7-day commit patterns from multiple contributors, (4) the documentation sprint – proactive docs suggesting preparation for scrutiny, and (5) the velocity regime change – commit velocity exceeding the 6-month average by 100%+. The strongest signal is when patterns 1 and 5 appear simultaneously.",
    date: "2026-04-04",
    relatedSectors: ["ai-ml", "fintech", "cybersecurity"],
    faqs: [
      {
        question: "What GitHub patterns predict startup fundraises?",
        answer: "Five GitHub patterns reliably precede fundraise announcements: (1) The Contributor Step Function – a sudden 50%+ jump in unique contributors, indicating post-round hiring, (2) The Infrastructure Explosion – 3-5 new repos in a month, signaling platform buildout, (3) The Weekend Surge – sustained 7-day commit patterns from multiple contributors, (4) The Documentation Sprint – proactive documentation suggesting preparation for scrutiny, and (5) The Velocity Regime Change – commit velocity exceeding the 6-month average by 100%+.",
      },
      {
        question: "How reliable are GitHub-based fundraise predictions?",
        answer: "GitHub patterns are leading indicators, not guarantees. They appear with enough regularity to be useful – particularly when multiple patterns overlap – but not all engineering acceleration leads to fundraising. Some acceleration reflects product-market fit, pivots, or hackathon activity. The patterns are most reliable when a startup shows two or more signals simultaneously, such as contributor growth combined with a velocity regime change.",
      },
      {
        question: "Which combination of GitHub patterns is the strongest fundraise signal?",
        answer: "The strongest combination is Pattern 1 (contributor step function – sudden team growth) plus Pattern 5 (velocity regime change – sustained doubling of commit velocity). When both appear simultaneously, the startup has almost certainly either just closed a round or is in the middle of one. The new hires are shipping code at an accelerated pace, and the compound signal is very difficult to produce without real organizational change.",
      },
    ],
    body: `After tracking GitHub engineering activity across thousands of startups, we have identified five patterns that consistently appear before fundraise announcements. These patterns are not guarantees, but they appear with enough regularity to be useful as leading indicators for investors. If you are new to this approach, start with our primer on [how to read GitHub signals for startup investing](/blog/how-to-read-github-signals-for-startup-investing).

## Pattern 1: What Does a Sudden Contributor Jump Signal?

The most reliable fundraise predictor is a sudden, sustained increase in unique contributors. Not a gradual climb – a step function. The team goes from 5 contributors to 12 in a two-week window.

Why it works: most startups hire in bursts immediately after closing a round. The new hires start committing code within days of joining. If you see the contributor count jump, the round likely closed 2-4 weeks ago and the announcement is 4-8 weeks away.

What to look for: contributor count increases 50% or more in a 14-day window, sustained for at least 4 weeks after.

## Pattern 2: What Does a Burst of New Repositories Mean?

A startup that suddenly creates 3-5 new public repositories in a single month is building platform infrastructure. This pattern typically appears at the Seed-to-Series-A transition: the core product works, and now the team is building the supporting ecosystem.

Why it works: infrastructure buildout requires capital. Companies do not invest in platform engineering unless they have runway. The timing suggests a recent or imminent fundraise.

What to look for: 3 or more new repositories created in 30 days, with the new repos being infrastructure-related (SDKs, APIs, internal tools, deployment configs) rather than experimental or documentation repos.

## Pattern 3: What Does Weekend Commit Activity Indicate?

When a startup's commit pattern shifts from weekday-only to seven-days-a-week, something has changed. This is especially meaningful when the weekend activity comes from multiple contributors, not just a solo founder.

Why it works: teams work weekends when they are racing toward a deadline. Common triggers include a product launch, a fundraise-related demo, or a competitive response. All of these are signals that something significant is happening.

What to look for: sustained weekend commit activity across 2 or more contributors for 3 or more consecutive weekends.

## Pattern 4: Why Is a Documentation Sprint a Fundraise Signal?

A sudden burst of documentation commits – README updates, API docs, architecture diagrams, contributing guides – often precedes a fundraise or launch. This is the team preparing for scrutiny.

Why it works: documentation is the last thing engineering teams do voluntarily. When they document proactively, they are either preparing for due diligence (fundraise), opening up to community contributions (launch), or onboarding new hires (post-fundraise). All three are interesting to investors.

What to look for: a week or more of documentation-heavy commits after a period of feature development. The sequence matters: code first, docs second suggests intentional preparation.

## Pattern 5: What Is a Velocity Regime Change?

The strongest signal is not high velocity – it is a change in velocity regime. A startup that averages 30 commits per 14-day window for six months, then suddenly jumps to 90 commits for three consecutive windows, has undergone a fundamental shift.

Why it works: velocity regime changes reflect organizational changes. Common causes include new funding (more engineers), product-market fit (faster iteration), or a strategic pivot (rebuilding). Regime changes that sustain for 6 or more weeks are particularly meaningful.

What to look for: commit velocity that exceeds the 6-month average by 100% or more, sustained for 3 or more consecutive 14-day windows.

## How Should Investors Combine These Patterns?

The patterns above are most powerful in combination. A startup showing Pattern 1 (contributor jump) and Pattern 5 (velocity regime change) simultaneously is almost certainly in the middle of a fundraise or has just closed one.

VC Deal Flow Signal tracks all five patterns across 20 startup sectors and classifies them into four signal types: engineering hiring burst, infrastructure buildout, deploy frequency spike, and framework migration. For the full metrics checklist, see [7 engineering metrics every investor should track](/blog/startup-engineering-metrics-investors-should-track). Browse the sector rankings to see which startups are showing these patterns right now.`,
  },
  {
    slug: "alternative-data-venture-capital",
    title: "Alternative Data for Venture Capital: Why GitHub Is the Most Underused Signal",
    references: [
      { label: "1", title: "Alternative Data and AI in Investment Management", url: "https://www.cfainstitute.org/en/research/foundation/2020/alternative-data", source: "CFA Institute" },
      { label: "2", title: "GitHub Octoverse 2024 – Developer Activity", url: "https://github.blog/news-insights/octoverse/octoverse-2024/", source: "GitHub Blog" },
      { label: "3", title: "The Rise of Alternative Data in Private Markets", url: "https://www.bain.com/insights/alternative-data-in-private-equity/", source: "Bain & Company" },
    ],
    description:
      "Alternative data has transformed public market investing. Now it is coming to venture capital. GitHub engineering activity is the most accessible, real-time, and underused alternative data source for startup investors.",
    figures: [
      { id: "lead-time-comparison", afterHeading: "Is GitHub the Best Alternative" },
    ],
    summary:
      "Alternative data transformed public market investing over the past decade – satellite imagery, credit card data, app downloads. Venture capital has been slower to adopt it, despite the most accessible alternative data source sitting in the open: GitHub. GitHub engineering data is continuous (updated daily), free (public API), hard to fake (commits represent real work), and reveals intent (activity type indicates company phase). Almost no investor monitors it systematically, creating an information asymmetry for those who do.",
    date: "2026-04-07",
    relatedSectors: ["ai-ml", "data-infrastructure", "fintech"],
    faqs: [
      {
        question: "What is alternative data in venture capital?",
        answer: "Alternative data in venture capital is any dataset that reveals startup traction before it appears through conventional deal sourcing channels. The main categories include engineering activity from GitHub (commit velocity, contributor growth), hiring signals from job boards, web traffic from analytics tools, social mentions from platforms like Twitter and Hacker News, and patent filings. Unlike traditional deal flow data (funding announcements, press, warm intros), alternative data provides a leading rather than lagging indicator.",
      },
      {
        question: "Why is GitHub data considered the most underused signal for VCs?",
        answer: "GitHub data stands out among alternative data sources because it is continuous (updated daily, not monthly), free and public (no scraping or paid tools required), hard to fake (commits represent real engineering work), and reveals intent (the type of activity tells you what phase the company is in). Despite these properties, almost no investor monitors GitHub systematically – creating an information asymmetry for those who do.",
      },
      {
        question: "How do hedge funds and quant investors use alternative data?",
        answer: "Quantitative investment firms have used alternative data in public markets for over a decade – satellite imagery of parking lots, credit card transactions, app downloads. The edge comes not from exclusive data but from reading what others ignore, faster and more consistently. The same principle applies to venture capital: every investor has access to GitHub, but almost none monitor it systematically. Building a workflow around engineering signals creates a structural timing advantage.",
      },
    ],
    body: `Alternative data changed public market investing over the past decade. Satellite imagery of parking lots, credit card transaction data, app download metrics – hedge funds built entire strategies on signals that traditional analysts ignored.

Venture capital has been slower to adopt alternative data. Most deal sourcing still relies on warm introductions, demo days, and newsletters. The irony is that the most accessible alternative data source for startup investing has been sitting in the open for years: GitHub.

## What Counts as Alternative Data for Venture Capital?

In public markets, alternative data is any dataset that provides insight into a company's performance beyond traditional financial filings. For venture capital, the concept is similar – any signal that reveals startup traction before it appears through conventional deal sourcing channels.

The main categories of alternative data for VCs:

Engineering activity (GitHub): Commit velocity, contributor growth, repository expansion. Available via public API, updated daily, hard to fake. Lead time: 6-12 weeks before fundraise announcements.

Hiring signals (job boards, LinkedIn): New job postings, especially for senior engineering and go-to-market roles. Scraping required, updated weekly. Lead time: 4-8 weeks.

Web traffic (SimilarWeb, Sensor Tower): Rapid growth in a startup's web or app traffic. Requires paid tools, updated monthly. Lead time: 4-6 weeks.

Social signals (Twitter, HN, Reddit): Mentions, upvotes, and community engagement. Free but noisy, real-time. Lead time: 1-2 weeks (often lagging, not leading).

Patent filings (USPTO, EPO): New patent applications signal R&D direction. Free but delayed by 18 months, so more useful for competitive analysis than timing.

## Why Is GitHub the Best Alternative Data Source for VCs?

Among all alternative data sources for VCs, GitHub engineering activity has unique properties:

It is continuous and granular. Unlike hiring signals (which appear when a job is posted) or web traffic (which updates monthly), GitHub commits happen daily. You can track weekly velocity changes and catch acceleration patterns in real time.

It is free and public. GitHub's API provides commit history, contributor data, and repository metadata at no cost. No scraping required. No third-party tools needed for basic analysis.

It reflects real work. Commits represent actual engineering output. You cannot game commit velocity the way you can game social media metrics or app store rankings. A team that ships 200 commits in a week did real engineering work.

It reveals intent. The type of engineering activity – new infrastructure repos, contributor scaling, velocity spikes – tells you what phase a startup is in. Infrastructure buildout looks different from feature shipping, which looks different from a documentation sprint before a fundraise.

## How Do Quantitative Investors Approach Alternative Data?

Quantitative investment firms have understood for years that public data, processed systematically, creates information asymmetry. The edge is not in having exclusive data – it is in reading what others ignore, faster and more consistently.

The same principle applies to venture capital. Every investor has access to GitHub. Almost none of them monitor it systematically. The investor who builds a workflow around engineering signals has a structural timing advantage: they see acceleration patterns 6-12 weeks before the fundraise announcement that fills everyone else's inbox.

This is not theoretical. At VC Deal Flow Signal, we track thousands of startup GitHub orgs across 20 sectors and rank them by engineering acceleration. The patterns are consistent: commit velocity spikes, contributor growth bursts, and infrastructure buildouts appear weeks before TechCrunch writes about the company. We break down the [5 GitHub patterns that predict fundraises](/blog/5-github-patterns-that-predict-fundraises) in a separate deep dive.

## How Can Investors Start Using Alternative Data?

If you are an investor interested in adding alternative data to your sourcing process, start with the highest signal-to-noise ratio source: GitHub engineering acceleration.

1. Pick 2-3 sectors you know well
2. Watch the weekly sector rankings for unfamiliar names in the top 3
3. Cross-reference with Crunchbase for funding history and stage
4. Reach out to founders during the acceleration window (weeks 2-4 of a velocity spike)

The combination of engineering signals for timing and traditional data for due diligence gives you both a lead time advantage and a solid evaluation framework. For a practical walkthrough, see [how to source deals before Crunchbase](/blog/source-startup-deals-before-crunchbase).

Browse our sector rankings to see which startups are showing engineering acceleration right now, or get the free Signal Report for a weekly summary of the top breakout signals.`,
  },
  {
    slug: "source-startup-deals-before-crunchbase",
    title: "How to Source Startup Deals Before They Appear on Crunchbase",
    references: [
      { label: "1", title: "GitHub REST API – Commit Activity", url: "https://docs.github.com/en/rest/metrics/statistics#get-the-last-year-of-commit-activity", source: "GitHub Docs" },
      { label: "2", title: "Crunchbase – Global Funding Data", url: "https://about.crunchbase.com/blog/global-funding-report/", source: "Crunchbase" },
      { label: "3", title: "Hacker News – Show HN Guidelines", url: "https://news.ycombinator.com/showhn.html", source: "Y Combinator" },
    ],
    description:
      "Crunchbase tells you what already happened. Learn three approaches to finding startups before they raise – using GitHub signals, community sourcing, and hiring data as leading indicators.",
    figures: [
      { id: "lead-time-comparison", afterHeading: "How Should Investors Combine All Three" },
    ],
    summary:
      "Crunchbase is a lagging indicator – companies appear after rounds close. Three approaches find startups earlier: GitHub engineering signals (6-12 weeks lead time, the earliest public signal), community sourcing from Hacker News, Product Hunt, and Indie Hackers (variable lead time, wide coverage), and hiring signals from job boards (4-8 weeks). The most effective workflow combines all three: GitHub signals for timing, community signals for context, hiring data for confirmation, and Crunchbase for verification. The full process takes 15-20 minutes per company.",
    date: "2026-04-10",
    relatedSectors: ["developer-tools", "enterprise-saas", "ai-ml"],
    howTo: {
      name: "How to Source Startup Deals Before They Appear on Crunchbase",
      description:
        "A weekly workflow for finding breakout startups using GitHub signals, community sourcing, and hiring data – before they hit Crunchbase. Takes 15-20 minutes per company.",
      totalTime: "PT20M",
      steps: [
        {
          name: "Check the sector rankings for your focus areas",
          text: "Every week, open the VC Deal Flow Signal sector rankings for the 2-3 sectors you invest in. Look for unfamiliar names in the top 3 with strong commit velocity change – these are the companies showing unusual engineering acceleration.",
        },
        {
          name: "Spend 5 minutes on their GitHub",
          text: "Open the startup's GitHub organization. Is the activity product-related or maintenance noise? Are new repos appearing? Is the contributor count growing? This quick check filters out false positives from docs sprints or CI/CD activity.",
        },
        {
          name: "Search community platforms for context",
          text: "Search Hacker News, Reddit, and Twitter for the company name. Is the founder talking about traction, customer feedback, or hiring? Community signals add qualitative context to the quantitative GitHub data.",
        },
        {
          name: "Check their careers page for hiring signals",
          text: "Visit the startup's website and look for open roles. Senior engineering hires suggest post-fundraise scaling. Head of Sales or VP Marketing suggests go-to-market buildout. Multiple simultaneous postings confirm a coordinated growth push.",
        },
        {
          name: "Verify on Crunchbase and reach out",
          text: "Open Crunchbase to check funding history and competitive landscape. If the company is pre-raise and all signals align – engineering acceleration, community buzz, active hiring – reach out to the founder. You are 6-12 weeks ahead of investors who only use Crunchbase alerts.",
        },
      ],
    },
    faqs: [
      {
        question: "How can investors find startup deals before Crunchbase?",
        answer: "Investors can find deals before Crunchbase using three signal types: (1) GitHub engineering signals – the earliest indicator, detecting commit velocity spikes 6-12 weeks before fundraise announcements, (2) community signals from Hacker News, Product Hunt, and Indie Hackers – variable lead time, wide coverage, and (3) hiring signals from job boards and LinkedIn – 4-8 weeks lead time. Combining all three with Crunchbase for verification gives both timing advantage and diligence depth.",
      },
      {
        question: "What is the earliest public signal of startup momentum?",
        answer: "GitHub engineering acceleration is the earliest publicly available signal of startup momentum. The logic is straightforward: engineering acceleration precedes product milestones, which precede fundraise decisions, which precede Crunchbase entries. When a startup's commit velocity doubles in a two-week window and the change is sustained, the underlying cause – post-fundraise scaling, product-market fit, or launch preparation – is already in motion 6-12 weeks before any public announcement.",
      },
      {
        question: "How much time does GitHub signal data give you over Crunchbase alerts?",
        answer: "GitHub engineering signals provide 6-12 weeks of lead time over Crunchbase alerts. Crunchbase alerts trigger on fundraise announcements, which are published after the round closes – zero lead time. GitHub signals detect acceleration patterns while the round is still in progress or before fundraising even begins. The top movers in VC Deal Flow Signal's weekly rankings consistently include companies that announce raises 4-8 weeks later.",
      },
    ],
    body: `Every investor uses Crunchbase. That is exactly the problem.

Crunchbase is excellent at what it does: a comprehensive database of startup funding rounds, team members, and company profiles. But by design, it is a lagging indicator. A company appears in your Crunchbase alert after the round closes, after the terms are set, after the press release is written. You are seeing what already happened.

The investors who consistently get into the best deals are the ones who found the company before it appeared on Crunchbase. This post covers three practical approaches to doing that.

## How Do GitHub Engineering Signals Help You Find Deals First?

GitHub engineering activity is the earliest publicly available signal of startup momentum – and part of a broader shift toward [alternative data in venture capital](/blog/alternative-data-venture-capital). The logic is straightforward: engineering acceleration precedes product milestones, which precede fundraise decisions, which precede Crunchbase entries.

When a startup's commit velocity doubles in a two-week window and the change is sustained, something fundamental has shifted. Common causes:

- Post-fundraise scaling: New capital deployed → new engineers hired → commit velocity spikes. The round closed but is not yet announced. Lead time: 6-12 weeks before the Crunchbase entry.
- Product-market fit iteration: Customer feedback driving rapid feature development. Lead time: 8-16 weeks before a fundraise decision is even made.
- Launch preparation: Team pushing toward a release. Often followed by press coverage and investor attention.

What to look for:
- Commit velocity change > 100%: The startup's 14-day commit count doubled compared to the prior window.
- Contributor growth > 50%: New team members appeared – likely recent hires.
- 3+ new repositories in 30 days: Infrastructure buildout, classic Series A behavior.

This is what VC Deal Flow Signal tracks across 20 sectors weekly. The top movers consistently include companies that announce raises 4-8 weeks later.

## Which Community Platforms Surface Startups Earliest?

Community platforms surface startups at different stages of visibility:

Hacker News Show HN – Very early signal. Founders posting technical projects before they have a pitch deck. Lead time: months before any institutional awareness. The challenge is volume – most Show HN posts are weekend projects, not fundable companies.

Indie Hackers – Build-in-public culture means founders share revenue numbers, growth metrics, and technical decisions openly. Lead time: weeks to months. The signal is in the engagement – posts that generate deep technical discussion often indicate real traction.

Product Hunt – Launch signal, not traction signal. By the time a startup launches on Product Hunt, they usually have a polished product and some early customers. Lead time: 2-4 weeks before broader awareness.

Y Combinator batch lists – Published at demo day, which is late in the cycle (investors already competing for these companies). But the companies that raise quietly before or after demo day are the ones to watch.

The community sourcing approach works best when you are deeply embedded in a specific community. An investor who reads r/venturecapital daily catches signals that a broader scan would miss.

## How Can Hiring Data Reveal Upcoming Fundraises?

Job postings reveal a startup's growth plans before they are announced publicly:

- Senior engineering hires (VP Engineering, Staff Engineer): Team is scaling, likely post-fundraise.
- Head of Sales / VP Marketing: Go-to-market is being built. Product-market fit is likely established.
- Multiple simultaneous postings: Coordinated hiring push, usually funded by a recent or imminent round.

Where to find hiring signals:
- LinkedIn job postings (filter by company size 1-50)
- AngelList/Wellfound job boards
- Y Combinator's Work at a Startup
- Hacker News monthly "Who's Hiring" threads

Lead time: 4-8 weeks before the round is announced. Shorter than GitHub signals, but the signal is more explicit about the type of growth.

## How Should Investors Combine All Three Signal Types?

The most effective approach combines all three signal types:

1. GitHub signals surface companies showing engineering acceleration (earliest warning)
2. Community signals add context – is the founder talking about traction? Customer feedback? Hiring?
3. Hiring signals confirm the growth trajectory – are they actively building the team?
4. Crunchbase verifies funding history and competitive landscape (due diligence, not sourcing)

This progression gives you the best of both worlds: timing advantage from alternative data, and verification depth from traditional sources.

## What Does This Look Like in Practice?

Every week, check the sector rankings for your focus areas. When an unfamiliar name appears in the top 3 with a strong acceleration signal:

1. Spend 5 minutes on their GitHub – is the activity product-related or maintenance noise?
2. Search Hacker News, Reddit, and Twitter for the company name – any community buzz?
3. Check their careers page – are they hiring?
4. Open Crunchbase – what is their funding history? Are they pre-raise?
5. If all signals align, reach out to the founder.

This workflow takes 15-20 minutes per company and puts you weeks ahead of investors who only use Crunchbase alerts. For the full screening checklist, see the [7 engineering metrics every investor should track](/blog/startup-engineering-metrics-investors-should-track).

Browse the sector rankings to start identifying startups before they appear in your inbox.`,
  },
  {
    slug: "startup-engineering-metrics-investors-should-track",
    title: "7 Startup Engineering Metrics Every Investor Should Track",
    references: [
      { label: "1", title: "GitHub REST API – Repository Statistics", url: "https://docs.github.com/en/rest/metrics/statistics", source: "GitHub Docs" },
      { label: "2", title: "GitHub REST API – Search Repositories", url: "https://docs.github.com/en/rest/search/search#search-repositories", source: "GitHub Docs" },
      { label: "3", title: "DORA Metrics – Accelerate State of DevOps", url: "https://dora.dev/research/", source: "Google DORA" },
    ],
    keyStats: [
      { value: "7", label: "Engineering metrics", context: "Trackable from public GitHub data" },
      { value: "+15%", label: "Average velocity change", context: "Across tracked startups" },
      { value: "3+", label: "New repos in 30 days", context: "Infrastructure buildout threshold" },
    ],
    howTo: {
      name: "How to Screen Startups Using GitHub Engineering Metrics",
      description: "A quick-screen checklist using seven public GitHub metrics to evaluate whether a startup deserves deeper investor research.",
      totalTime: "PT10M",
      steps: [
        { name: "Check commit velocity change", text: "Is the startup's 14-day commit velocity change positive and above +50%? This is the primary signal. Below +50% is normal variance; above +100% is a regime change worth investigating." },
        { name: "Evaluate contributor growth", text: "Has the contributor count grown recently? A 50%+ jump in unique contributors indicates a hiring burst – likely post-fundraise scaling. Compare the current count to six weeks ago." },
        { name: "Count new repositories", text: "How many new public repos were created in the last 30 days? Three or more signals infrastructure buildout – the team is expanding its technical surface area, classic Series A behavior." },
        { name: "Verify activity is product-related", text: "Is the commit activity in product-related code, or just documentation, CI/CD configs, and dependency updates? Open the top repositories and check recent commit messages." },
        { name: "Cross-reference the tech stack", text: "Do the programming languages and frameworks match the company's pitch? A startup claiming to build an AI platform should show Python, ML frameworks, and data infrastructure in their repos." },
      ],
    },
    description:
      "Seven engineering metrics from public GitHub data that help investors evaluate startup momentum: commit velocity, contributor growth, repo expansion, weekend activity, and more. A practical checklist for data-driven deal sourcing.",
    figures: [
      { id: "screening-checklist", afterHeading: "How Should Investors Use These Metrics" },
    ],
    summary:
      "Seven engineering metrics from public GitHub data help investors evaluate startup momentum: (1) commit velocity – 14-day rolling baseline, (2) commit velocity change – the primary signal, measuring acceleration, (3) contributor count – team size proxy, (4) contributor growth rate – the most reliable fundraise predictor at 50%+, (5) new repository count – signals infrastructure buildout, (6) weekend commit ratio – indicates deadline pressure, and (7) language/framework distribution – reveals technical maturity. A startup that passes all five quick-screen checks (positive velocity change, contributor growth, new repos, product-related activity, matching tech stack) is worth a deeper look.",
    date: "2026-04-14",
    relatedSectors: ["developer-tools", "cybersecurity", "fintech"],
    faqs: [
      {
        question: "What engineering metrics should startup investors track?",
        answer: "Investors should track seven engineering metrics from public GitHub data: (1) commit velocity – 14-day rolling commit count, (2) commit velocity change – the percentage change vs. prior period (the primary signal), (3) contributor count – proxy for team size, (4) contributor growth rate – indicates hiring bursts, (5) new repository count – signals infrastructure buildout, (6) weekend commit ratio – indicates deadline pressure, and (7) language/framework distribution – reveals technical maturity and stack choices.",
      },
      {
        question: "What is the most important GitHub metric for venture capital deal sourcing?",
        answer: "Commit velocity change – the percentage change in 14-day commit count compared to the prior window – is the single most useful engineering metric for investors. It measures acceleration rather than absolute volume, which makes it comparable across startups of different sizes. A sustained velocity change above +50% for 3 or more consecutive windows is a meaningful signal. Above +100% is a regime change that has historically preceded fundraise announcements.",
      },
      {
        question: "How can investors quickly screen startups using GitHub data?",
        answer: "A quick screening checklist: (1) Is commit velocity change positive and above 50%? (2) Has contributor count grown recently? (3) Are there new repos in the last 30 days? (4) Is the activity product-related, not just docs or CI/CD? (5) Does the tech stack match the company's pitch? If a startup passes all five checks, it deserves a deeper look. If it fails the first two, the engineering signal is not there. VC Deal Flow Signal automates checks 1-4 across 20 sectors weekly.",
      },
    ],
    body: `Most investors evaluate startups on revenue growth, market size, and team pedigree. These are important. But they are also the metrics that every other investor looks at.

Engineering metrics – available from public GitHub data – provide a complementary view of startup health that almost nobody monitors. Here are seven metrics worth tracking, what they tell you, and how to use them. For the broader context on why this data matters, see [what is deal flow signal](/blog/what-is-deal-flow-signal).

## 1. What Is Commit Velocity?

What it is: Total commits to a startup's most active public repository over a rolling 14-day window.

What it tells you: The raw volume of engineering output. High absolute velocity is not inherently meaningful – some teams commit frequently with small changes, others commit less often with larger changes. The value is in tracking it over time to establish a baseline.

How to use it: Commit velocity is the denominator for the most important metric (velocity change). Track it to understand the startup's normal operating rhythm before evaluating whether a change is significant.

## 2. Why Is Commit Velocity Change the Primary Signal?

What it is: The percentage change in commit velocity compared to the preceding 14-day window.

What it tells you: Whether the engineering team is accelerating, maintaining pace, or slowing down. This is the single most useful engineering metric for investors because it measures *acceleration* – the rate of change.

How to use it: A sustained velocity change above +50% for 3+ consecutive windows is a meaningful signal. At VC Deal Flow Signal, this is the primary ranking metric across all 20 sectors. Startups showing +100% or higher velocity change are flagged as top movers.

Benchmark: In our dataset, the average velocity change across 43 tracked startups is approximately +15%. Anything above +50% is unusual. Above +100% is a regime change.

## 3. What Does Contributor Count Tell Investors?

What it is: The number of unique contributors to the startup's most active public repository.

What it tells you: A rough proxy for engineering team size. More useful as a trend than an absolute number, since not all employees contribute to public repos, and not all contributors are employees.

How to use it: Compare contributor count to the startup's claimed team size. A company claiming 30 engineers but showing 5 GitHub contributors either has most code in private repos (normal) or is overstating their team (investigate further).

## 4. Why Does Contributor Growth Rate Predict Fundraises?

What it is: The change in unique contributor count over a 6-week comparison window.

What it tells you: Whether the engineering team is growing. A sudden jump (50%+ in a short window) almost always indicates a hiring burst – new engineers who joined and started committing.

How to use it: Contributor growth above 50% in a 2-week window is our most reliable fundraise predictor. New hires start committing code within days of joining. If you see the contributor count step up sharply, the round likely closed recently and the announcement is coming.

## 5. What Does New Repository Creation Signal?

What it is: The number of public repositories created by the startup's GitHub organization in the last 30 days.

What it tells you: Whether the startup is expanding its technical surface area. New repos usually mean new microservices, SDKs, internal tools, or platform components.

How to use it: Three or more new repos in 30 days is what we call an "infrastructure buildout" signal. This pattern is classic Series A behavior: the core product works, and the team is building the surrounding platform. It signals both technical maturity and available capital.

## 6. What Does Weekend Commit Activity Reveal?

What it is: The proportion of commits that occur on Saturday and Sunday versus weekdays.

What it tells you: How intensely the team is working. Weekend commits from multiple contributors (not just a solo founder) indicate a deadline push.

How to use it: A sustained shift from weekday-only to 7-day commit patterns across multiple contributors is a soft signal that something time-sensitive is happening: a product launch, a fundraise demo, or a competitive response. This metric is most useful as a confirming signal alongside velocity change.

## 7. What Do Language and Framework Choices Indicate?

What it is: The programming languages and frameworks visible in the startup's public repositories.

What it tells you: The technical stack and maturity level. A seed-stage startup using Kubernetes, Terraform, and enterprise monitoring tools may be over-engineering. A growth-stage company still using prototype-quality tools may have hidden technical debt.

How to use it: Cross-reference with the startup's claimed technology during due diligence. If they say they are building an AI platform, their repos should show Python, ML frameworks, and data processing infrastructure. If the repos tell a different story, ask why.

## How Should Investors Use These Metrics Together?

When evaluating a startup from its public GitHub profile, check these in order:

1. Is commit velocity change positive and above 50%? (Active acceleration)
2. Has contributor count grown recently? (Team scaling)
3. Are there new repos in the last 30 days? (Platform building)
4. Is the activity product-related, not just docs/CI/CD? (Meaningful work)
5. Does the tech stack match the company's pitch? (Consistency check)

If a startup passes all five checks, it is worth a deeper look. If it fails the first two, move on – the engineering signal is not there. For real-world application, read how investors [use GitHub for technical due diligence](/blog/github-due-diligence-for-vcs).

VC Deal Flow Signal automates checks 1-4 across 20 sectors weekly. Browse the sector rankings to see which startups pass the screen right now.`,
  },
  {
    slug: "what-is-engineering-acceleration",
    title: "What Is Engineering Acceleration? The Metric VCs Are Starting to Track",
    description: "Engineering acceleration is the rate of change in a startup's public GitHub commit velocity, contributor count, and repository activity — not participation in an accelerator program like Y Combinator. Learn why this metric matters more than absolute commit counts and how investors use it to time fundraise signals.",
    summary: "Engineering acceleration is the rate of change in a startup's GitHub commit velocity — not how much code they write, but how much faster they are writing it compared to their own baseline. (To be clear: this is code-side momentum, GitHub commit velocity, not participation in a startup accelerator program like Y Combinator or Techstars.) A startup with 40 commits this period and 20 last period shows +100% acceleration. This metric has historically preceded fundraise announcements by three to six weeks because the underlying causes — post-raise hiring, product-market fit iteration, launch preparation — drive engineering output before they drive press coverage or Crunchbase entries.",
    date: "2026-04-14",
    relatedSectors: ["ai-ml", "developer-tools", "enterprise-saas"],
    keyStats: [
      { value: "+100%", label: "Threshold", context: "14-day commit velocity doubling vs prior period" },
      { value: "3-6 weeks", label: "Lead time", context: "Acceleration → public fundraise" },
      { value: "4 patterns", label: "Signal types", context: "Hiring burst, sprint, infra, migration" },
    ],
    references: [
      { label: "1", title: "DORA Metrics – Accelerate State of DevOps", url: "https://dora.dev/research/", source: "Google DORA" },
      { label: "2", title: "GitHub REST API – Commit Activity", url: "https://docs.github.com/en/rest/metrics/statistics#get-the-last-year-of-commit-activity", source: "GitHub Docs" },
      { label: "3", title: "Engineering Acceleration as a VC Deal Flow Signal", url: "https://ssrn.com/abstract=6606558", source: "SSRN" },
    ],
    faqs: [
      { question: "What is engineering acceleration?", answer: "Engineering acceleration measures the rate of change in a startup's engineering output relative to its own historical baseline. It is calculated as the percentage change in 14-day GitHub commit velocity versus the prior period. A +100% acceleration means the team doubled its commit rate. The metric is computed per startup, not across the population, which means a small team and a large team are measured against their own historical pace rather than each other." },
      { question: "Is engineering acceleration the same as a startup accelerator program?", answer: "No — they are unrelated concepts that share a word. A startup accelerator (Y Combinator, Techstars, 500 Global) is a fixed-term program founders join for mentorship, capital, and networking. Engineering acceleration, as defined at VC Deal Flow Signal, is a quantitative signal computed entirely from a startup's public GitHub activity. Throughout this site, the term refers exclusively to code-side momentum: GitHub commit velocity, contributor growth, repository creation. It has nothing to do with program participation." },
      { question: "Why does engineering acceleration matter for investors?", answer: "Engineering acceleration is a leading indicator of startup momentum. When a team accelerates its engineering output, the cause is usually post-fundraise scaling, product-market fit iteration, or launch preparation — all of which precede the public signals (press coverage, Crunchbase entries, hiring announcements) that most investors rely on. Catching the change at the GitHub layer typically gives investors a 3 to 6 week lead time over the press cycle." },
      { question: "How is engineering acceleration different from DORA metrics?", answer: "DORA metrics (deployment frequency, lead time for changes, change failure rate, time to restore) measure engineering process quality — how reliably a team ships. Engineering acceleration measures output momentum — whether the team is speeding up. DORA requires internal CI/CD access; acceleration is computed from public GitHub data, making it useful as an external investment signal. The two are complementary: DORA helps engineering managers; acceleration helps investors source." },
      { question: "What threshold counts as a meaningful acceleration?", answer: "A useful working threshold is +100% sustained over two consecutive 14-day windows. One-period spikes are usually noise — a hackathon, a single contributor onboarding, a documentation push. The two-period confirmation rule filters most of that noise. Pre-seed teams with very low absolute volume require larger percentage moves (often +200% or more) to clear the noise floor; later-stage teams can show meaningful signals at +50% because their absolute output is large." },
      { question: "What are the four signal types?", answer: "Acceleration patterns sort into four operational types. The hiring burst combines rising commit velocity with rising contributor count — the strongest fundraise predictor. The shipping sprint shows velocity rising while contributor count stays flat — typical of launch preparation. The infrastructure buildout shows new repository creation accelerating — a structural investment, often platform migration. The platform migration shows language mix shifting between primary languages — the slowest-moving but most strategically significant signal. Each pattern implies a different diligence question." },
      { question: "Can engineering acceleration be gamed by founders?", answer: "In theory yes; in practice it is expensive and easy to detect. A team can pad commit counts with mechanical edits, but contributor growth, repository creation, and language-mix changes are harder to fake. Most importantly, gaming the signal requires sustained effort from multiple contributors over weeks, which is itself a form of real engineering activity. Detection looks at commit size variance, file diversity, and contributor recency — checks any careful investor performs anyway." },
      { question: "Where does engineering acceleration fit relative to other alternative data?", answer: "Engineering acceleration is the longest-lead-time signal in the public alternative-data stack. Hiring data (LinkedIn, Wellfound) is upstream of engineering output but noisier — many job postings never close. Web traffic (SimilarWeb, Specter) and social signals (Twitter, Hacker News) are typically downstream of engineering activity. The strongest sourcing stacks layer all three: engineering acceleration for early discovery, hiring for validation, web/social for downstream cross-validation. Each catches a different point in the startup's development arc." },
    ],
    body: `Engineering acceleration is the single most important metric at VC Deal Flow Signal — and the reason the signal works as a deal sourcing tool. This page is the definition piece. For the full operating playbook covering pipeline, benchmarks, and predictive analytics, see [How VCs Track Startup Engineering Acceleration: The Complete 2026 Playbook](/blog/how-vcs-track-engineering-acceleration-2026-playbook).

A vocabulary note up front. Throughout this site, engineering acceleration always refers to code-side momentum measured from public GitHub activity — commit velocity, contributor growth, repository creation. It has nothing to do with startup accelerator programs like Y Combinator or Techstars, despite the unfortunate vocabulary collision. When the word "accelerator" appears here without qualification, it is shorthand for the GitHub-derived signal, not for a program.

## What is engineering acceleration?

Engineering acceleration measures the rate of change in a startup's engineering output. Not how much code they write, but how much faster they are writing it compared to their own baseline.

The formula is straightforward: take the 14-day commit count for a startup's most active public repositories, compare it to the prior 14-day window, and express the change as a percentage. A startup with 40 commits this period and 20 last period shows +100% acceleration. A startup with 200 commits this period and 220 last period shows -10% — even though the absolute volume is higher than the +100% case.

This is different from absolute engineering volume. A company with 500 commits per week is not necessarily more interesting than one with 50 — what matters is whether the 50-commit company just jumped from 25. That jump is the signal. Absolute volume reflects team size, codebase maturity, and shipping conventions, all of which differ across companies in ways that obscure comparison. Rate of change normalizes against a startup's own historical baseline, which is the most honest comparable.

The metric extends beyond commit velocity. Three other dimensions carry independent information: contributor count change (new engineers being added), repository expansion (new product surfaces), and language mix shift (architectural transitions). Together the four metrics describe an acceleration pattern that can be classified into operational types — see the four signal types section below.

## Why does this metric matter for investors?

The causal chain that makes engineering acceleration useful for investors is short. A startup decides to raise capital, or has just closed a round, or plans a major launch. That decision drives engineering activity: hiring engineers, sprinting toward a milestone, building new infrastructure. The engineering activity produces commits, pull requests, and new repositories. The activity is observable in GitHub's public data within hours or days of happening. Press coverage, Crunchbase entries, SEC Form D filings, and LinkedIn announcements follow weeks to months later.

Most investors only see the downstream signals — the press release, the database entry, the hiring announcement. By the time a startup appears in those sources, the round is often allocated and the deal is competitive. Engineering acceleration shows up before any of that. The lead time across the 4,200-startup panel maintained at VC Deal Flow Signal is a median of three to six weeks before a public fundraise announcement [3].

The economic case for investors is compounding. Warm outreach during the pre-fundraise window converts at meaningfully higher rates than cold outreach during a competitive round. Even at the angel and seed level, where check sizes are small, being the first thoughtful conversation a founder has had about a round is worth disproportionately more than being the tenth. The metric is, in practice, a top-of-funnel sourcing tool that turns the global startup population into a tractable weekly screen.

The metric is not magic. Many accelerations resolve in disappointing ways: the team ships a launch and stalls, the round is extended rather than upsized, the apparent burst was a single contributor's hackathon. The framework's job is not to eliminate false positives — it is to make them tractable. The output is a screen, not a buy decision.

## How is engineering acceleration different from DORA metrics?

DORA metrics — deployment frequency, lead time for changes, change failure rate, and time to restore — are the four canonical measures of engineering process quality popularized by Google's DORA research [1]. They measure how reliably and quickly a team ships, with an emphasis on production safety and recovery. DORA is the standard internal toolkit for engineering managers and CTOs.

Engineering acceleration measures something different: the rate of change in engineering output volume. Not how reliably the team ships, but whether the team is speeding up. The two metrics answer different questions. DORA answers "is this engineering organization healthy?" Acceleration answers "is something meaningful changing in this team's pace?"

The practical difference matters for who can use each metric. DORA requires internal access to CI/CD pipelines, deployment systems, and incident tooling. It is unobservable from outside the company. Engineering acceleration is computed entirely from public GitHub data — commits, contributors, repositories — which means anyone with API access can compute it for any public organization. That asymmetry is what makes acceleration useful as an investor signal: it can be applied at scale to companies the investor has no relationship with.

Both metrics are valuable in their domains. A founder optimizing for DORA scores is improving engineering process. An investor watching for acceleration is identifying changes in startup momentum. They sometimes correlate — a team scaling up will often improve DORA metrics and show acceleration simultaneously — but the metrics are not substitutes.

## What are the four signal types?

When a startup shows acceleration, the pattern can be classified into one of four operational types based on which underlying metrics are moving. The classification matters because each pattern implies a different diligence question.

The hiring burst is the pattern most strongly correlated with a recent or imminent fundraise. The fingerprint is rising commit velocity combined with rising unique contributor count — both moving in the same direction at meaningful magnitude. The detection rule used in the public methodology [3] is contributor count up at least 30 percent and commit velocity up at least 60 percent in the same 14-day window, sustained into a second period. Hiring bursts almost always reflect committed capital, because adding engineers requires payroll commitments, which require runway visibility, which usually requires recent or imminent fundraise activity.

The shipping sprint is velocity rising while contributor count stays flat. This pattern signals a launch push — the existing team is pushing harder toward a milestone. Detection rule: velocity up at least 100 percent with contributor count change under 15 percent. Sprints are interesting investor signals but require different conversations: the team is preparing for something, often a launch, sometimes a fundraise narrative built around the launch. Catching a sprint early gives investors a chance to engage with the founder before the launch event.

The infrastructure buildout is repository creation accelerating relative to historical baseline. This signals architectural investment — platform migrations, new product surfaces, or build-out of internal tooling. Detection rule: at least three new repositories created in 30 days versus a prior 30-day baseline of zero. Buildouts often presage Series A or Series B fundraises because they imply the team is committing to scale-stage investment in technical foundations.

The platform migration is language mix shifting between primary languages over a quarter. This is the slowest-moving but most strategically significant signal — it implies the team is committing to a new technical direction. Detection rule: at least 20 percentage points of language mix migrating between primary languages over a 90-day window. Migrations often coincide with senior engineering hires whose stack preferences drive architectural choices, or with platform rebuilds that the team has been planning for months.

Each signal type has implications for how an investor should approach the founder. A hiring burst suggests asking about recent or imminent capital. A shipping sprint suggests asking about the upcoming launch and its dependencies. An infrastructure buildout suggests asking about architectural strategy. A platform migration suggests asking about the technical bet driving the change. The signal types direct the investor's attention; the actual investment decision still requires founder conversations.

For full definitions of each signal type and the detection rules, see the [glossary](/glossary). For weekly rankings of startups currently showing each pattern, see the [sector rankings](/).

## How is acceleration measured in practice?

The measurement pipeline at VC Deal Flow Signal has four stages: ingestion, normalization, aggregation, and rate-of-change computation.

Ingestion pulls weekly data from the GitHub REST API [2] for approximately 4,200 startup organizations across 20 sectors. The relevant endpoints are repositories list, commit activity, contributors, and releases. Free authenticated rate limits (5,000 requests per hour per token) are sufficient for the panel size when paced over six hours.

Normalization removes the most common noise sources. Bot accounts (Dependabot, Renovate, GitHub Actions) can drive double-digit commit counts per week without any human engineering activity, so commits authored by accounts matching common bot patterns are excluded. A second normalization layer filters commits by file count and diff size, removing trivial commits that inflate counts without reflecting meaningful engineering work.

Aggregation produces four time series per organization: commit velocity (count over rolling 14 days), unique contributor count over the same window, repositories created in the period, and language mix as a percentage breakdown of commit volume by primary language. Each is computed weekly and stored with timestamps.

Rate-of-change computation produces the headline acceleration number plus the four pattern-classification metrics. The acceleration number is the percentage change in 14-day commit velocity versus the prior 14-day window. The pattern classification compares the four core metrics against the detection rules above.

The full methodology is published openly. The peer-style write-up is on SSRN [3]; the working dataset is mirrored on Zenodo and OpenAlex; the production pipeline is documented in the [methodology](/methodology) page on this site. Reproducibility is intentional — investors should be able to evaluate the signal quality before acting on it.

## Common pitfalls in interpreting acceleration

The framework's failure modes are predictable, and a working pipeline is one whose users have internalized them.

The bot inflation problem affects organizations with aggressive automation tooling. The fix is bot exclusion, applied consistently. The single-contributor problem affects pre-seed startups, where a solo founder can drive +500% acceleration through pure personal effort. The two-period confirmation rule plus contributor cross-validation handles most cases, but pre-seed signals always require human review.

The launch-versus-fundraise problem is a recurring interpretation issue. Both events are interesting, but they imply different conversations. The diagnostic clue is sequencing: a launch tends to produce a coordinated burst over four to six weeks followed by a sharp drop-off, while a fundraise-driven acceleration sustains over a longer period. The acquisition-driven acceleration affects later-stage companies, where absorbing an acquired engineering team produces +200% acceleration unrelated to internal momentum.

For a comprehensive treatment of pitfalls and the diligence checks that catch them, see the [common pitfalls section in the cornerstone playbook](/blog/how-vcs-track-engineering-acceleration-2026-playbook).

## How investors use the metric

The pragmatic use of engineering acceleration is a weekly digest. Every Monday, an investor reviews the top-ranked breakouts in their sectors of interest, cross-references against their CRM for any prior contact, prioritizes unflagged ones for a 30-minute desk dive, and tags the rest for monitoring. Total time investment is roughly 30 minutes per week, which is small enough that the metric is sustainable as part of a normal sourcing workflow.

The signal complements rather than replaces existing sourcing channels. Founder networks, demo days, and accelerator pipelines stay intact; engineering acceleration adds an external, quantitative top-of-funnel feed that is hard to source any other way. The most successful fund deployments treat the signal as a conversation prompt, not a buying decision: the first outreach acknowledges the team's pace, asks what is driving it, and is open to whatever the founder wants to share.

For investors getting started, the easiest entry point is the [free weekly Signal Report](https://gitdealflow.com), which surfaces the top five breakout startups across all sectors every Monday. The Dashboard at EUR 9.97/month adds full sector, stage, and geography filters. The MCP server (npx -y @gitdealflow/mcp-signal) provides programmatic access for funds with engineering capacity. The full operating playbook is at [How VCs Track Startup Engineering Acceleration: The Complete 2026 Playbook](/blog/how-vcs-track-engineering-acceleration-2026-playbook).

Engineering acceleration is not a magic source of alpha. It is a well-defined, publicly observable signal that arrives weeks before the data sources most investors currently use. Capturing the timing edge requires nothing more than the discipline to look at the signal every week.

Browse the [sector rankings](/) to see which startups are showing engineering acceleration on GitHub right now.`,
  },
  {
    slug: "commit-velocity-explained",
    title: "Commit Velocity Explained: What Investors Need to Know",
    description: "Commit velocity is the total number of commits to a startup's GitHub repository over a rolling 14-day window. Learn what it measures, what it misses, and how to interpret it for deal sourcing.",
    summary: "Commit velocity counts the total commits to a startup's most active public repository over 14 days. As a standalone metric it is noisy – commit size, quality, and automation all create false signals. What matters for investors is commit velocity change: the rate at which velocity is accelerating or decelerating. A +150% velocity change classifies as a deploy frequency spike, while sustained positive change across multiple windows indicates genuine engineering momentum.",
    date: "2026-04-13",
    relatedSectors: ["developer-tools", "data-infrastructure", "ai-ml"],
    references: [
      { label: "1", title: "GitHub REST API – Commit Activity", url: "https://docs.github.com/en/rest/metrics/statistics#get-the-last-year-of-commit-activity", source: "GitHub Docs" },
    ],
    faqs: [
      { question: "What is commit velocity?", answer: "Commit velocity is the total number of commits to a startup's most active public GitHub repository over a rolling 14-day window. It measures the raw volume of engineering output." },
      { question: "Is high commit velocity always a good sign?", answer: "Not necessarily. High absolute commit velocity can reflect automated commits, documentation updates, or CI/CD activity rather than meaningful product development. What matters more is commit velocity change – whether the rate is accelerating." },
      { question: "What is a good commit velocity for a startup?", answer: "There is no universal benchmark – commit velocity depends on team size, commit granularity, and workflow conventions. A solo founder with 50 commits/week and a 10-person team with 200 commits/week may have equivalent per-engineer output. The useful metric is velocity change relative to the company's own baseline, not absolute counts." },
    ],
    body: `Commit velocity is one of the most cited – and most misunderstood – metrics in GitHub-based deal sourcing.

## What Is Commit Velocity?

Commit velocity is the total number of commits to a startup's most active public GitHub repository over a rolling 14-day window. At VC Deal Flow Signal, we pull this data from the GitHub API's commit activity endpoint [1].

The metric is intentionally simple: count the commits. No weighting by lines of code, no filtering by author, no adjustment for commit size. Simplicity makes it comparable across companies and sectors.

## What Does Commit Velocity Actually Measure?

Commit velocity measures engineering output volume – how much work is being pushed to version control. It is a proxy for engineering activity, not engineering quality.

A startup with 200 commits in 14 days has roughly 14 commits per day. For a team of 10 engineers, that is a healthy shipping cadence. For a solo founder, it might indicate automated tooling or excessive granularity.

## What Are the Limitations?

Commit velocity has known limitations that investors should understand:

Commit size varies: One commit might change a single config line; another might refactor 5,000 lines. Velocity treats them equally.

Automation inflates counts: CI/CD bots, automated dependency updates, and auto-formatting tools can inflate commit counts without meaningful engineering work.

Private repos are invisible: Many startups keep their core product code in private repositories. Commit velocity only captures public activity.

Squash vs. merge: Teams that squash commits will show lower velocity than teams that merge individual commits. This is a workflow choice, not a quality signal.

## Why Commit Velocity Change Matters More

This is the key insight: absolute commit velocity is noisy. Commit velocity change – the rate at which velocity is accelerating – is the real signal. See our detailed guide on [how to read GitHub signals for startup investing](/blog/how-to-read-github-signals-for-startup-investing).

A startup going from 20 to 40 commits in a 14-day window shows +100% velocity change. That acceleration has meaning regardless of the absolute numbers – something changed in how the team is working. That something is what investors care about.

Visit our [glossary](/glossary#commit-velocity) for formal definitions of all engineering metrics.`,
  },
  {
    slug: "pre-seed-deal-sourcing-github",
    title: "Pre-Seed Deal Sourcing with GitHub Data: A Practical Guide",
    description: "How to use GitHub engineering signals to find pre-seed startups before they raise. Covers what pre-seed activity looks like on GitHub, signal patterns, and a step-by-step sourcing workflow.",
    summary: "Pre-seed startups are the hardest to find through traditional deal sourcing because they have no funding history, press coverage, or database entries. GitHub is one of the few places where pre-seed activity is visible: 1-3 contributors, rapid commit acceleration from a low base, and new repository creation. The key signal is disproportionate acceleration – a small team suddenly shipping at 3-5x their baseline rate, which typically indicates a product breakthrough or preparation for a first fundraise.",
    date: "2026-04-12",
    relatedSectors: ["developer-tools", "ai-ml", "web3"],
    references: [
      { label: "1", title: "GitHub Search API – Repositories", url: "https://docs.github.com/en/rest/search/search#search-repositories", source: "GitHub Docs" },
    ],
    keyStats: [
      { value: "1-7", label: "Contributors", context: "Typical pre-seed team size" },
      { value: "+200%", label: "Acceleration threshold", context: "Signals product breakthrough" },
      { value: "3-5x", label: "Baseline multiplier", context: "Disproportionate acceleration" },
    ],
    howTo: {
      name: "How to Source Pre-Seed Startups Using GitHub Data",
      description: "A step-by-step workflow for finding pre-seed startups before they raise, using public GitHub engineering signals.",
      totalTime: "PT15M",
      steps: [
        { name: "Filter for pre-seed stage", text: "Check the sector rankings weekly and filter for startups showing 'Pre-seed' stage estimation (1-7 contributors). These are the earliest-stage companies in the dataset." },
        { name: "Look for disproportionate acceleration", text: "Identify companies with +200% or higher velocity change from a small base. A solo founder going from 5 to 25 commits/week shows +400% – the absolute number is small, but the acceleration is the signal." },
        { name: "Verify the activity is product-related", text: "Open their GitHub organization and check recent commits. Is the activity in product code, or just docs and CI/CD configs? Product-related commits from 1-3 contributors indicate genuine building." },
        { name: "Check founder presence online", text: "Search for the founder on Twitter, Hacker News, and Indie Hackers. Active founders discussing their product or seeking feedback are more likely to be building something real." },
        { name: "Reach out before anyone else", text: "If the signals align – acceleration, product activity, active founder – reach out directly. At pre-seed, there is no deal competition yet because no one else knows the company exists." },
      ],
    },
    faqs: [
      { question: "Can you find pre-seed startups on GitHub?", answer: "Yes. Pre-seed startups often have public GitHub activity before they have any other public presence. Look for organizations with 1-3 contributors showing rapid commit acceleration from a low base – this pattern indicates early product development that often precedes a first fundraise." },
      { question: "What does pre-seed engineering activity look like on GitHub?", answer: "Pre-seed activity typically shows 1-7 contributors, commit velocity under 100 per 14 days, but with high acceleration rates (+200% or more). New repository creation (infrastructure buildout) is common as founders move from prototype to more structured development." },
      { question: "How do you find pre-seed startups before they raise?", answer: "Filter sector rankings for startups with 1-7 contributors showing +200% or higher velocity change. These disproportionate acceleration rates from a small base indicate a product breakthrough or first-fundraise preparation. Then verify on GitHub: is the activity product-related? Check Hacker News and Twitter for founder activity." },
    ],
    body: `Pre-seed startups are invisible to most deal sourcing tools. They have no Crunchbase entry, no press coverage, no PitchBook profile. But many of them have GitHub activity.

## Why GitHub Works for Pre-Seed Sourcing

GitHub is one of the few public data sources where pre-seed activity is visible. Before a startup has a pitch deck, before it has a website, the founders are writing code. That code – if the repositories are public – creates a data trail.

At VC Deal Flow Signal, we estimate startup stage from contributor count: pre-seed companies typically have 1-7 contributors. When we see a small team showing disproportionate acceleration – committing at 3-5x their baseline rate – something is happening worth investigating.

## What Pre-Seed Signals Look Like

Pre-seed engineering activity has a distinctive pattern:

Low absolute velocity, high acceleration: A solo founder going from 5 commits/week to 25 commits/week shows +400% velocity change. In absolute terms, 25 commits is nothing. But the acceleration is the signal.

Infrastructure buildout from zero: New repositories appearing (3+ in 30 days) in a young organization suggests the founder is moving from prototype to structured development. This is classic pre-seed-to-seed transition behavior.

Contributor count jumping from 1 to 3-4: When a solo founder suddenly has co-contributors, they either found a co-founder, hired their first engineer, or attracted open source contributors. All three are positive signals.

## A Pre-Seed Sourcing Workflow

1. Check the [sector rankings](/) weekly and filter for startups showing "Pre-seed" stage estimation
2. Look for companies with +200% or higher velocity change from a small base
3. Open their GitHub organization – is the activity product-related?
4. Check if the founder is active on Twitter, Hacker News, or Indie Hackers
5. If signals align, reach out before anyone else knows the company exists

For the complete screening methodology, see the [7 engineering metrics every investor should track](/blog/startup-engineering-metrics-investors-should-track).`,
  },
  {
    slug: "series-a-signals-github-data",
    title: "Series A Signals: What GitHub Data Reveals About Growth-Stage Startups",
    description: "Series A startups show distinctive GitHub patterns: infrastructure buildout, rapid contributor growth, and platform expansion. Learn what these signals mean for investors evaluating growth-stage deals.",
    summary: "Series A startups display distinct GitHub patterns that differentiate them from earlier stages. The hallmarks are infrastructure buildout (3+ new repositories in 30 days indicating platform development), contributor growth exceeding 50% (post-fundraise hiring), and increasing repository specialization (microservices, SDKs, internal tools). These patterns indicate a startup has moved from finding product-market fit to building the platform for scale – the exact inflection point Series A investors target.",
    date: "2026-04-11",
    relatedSectors: ["enterprise-saas", "fintech", "data-infrastructure"],
    references: [
      { label: "1", title: "GitHub REST API – Repository Statistics", url: "https://docs.github.com/en/rest/metrics/statistics", source: "GitHub Docs" },
    ],
    faqs: [
      { question: "What GitHub patterns indicate a Series A startup?", answer: "Series A startups typically show 20-49 contributors, infrastructure buildout (3+ new repos in 30 days), and increasing repository specialization. The dominant signal type is 'infrastructure buildout' – the team is building the platform around a working core product." },
      { question: "What is infrastructure buildout in startup engineering?", answer: "Infrastructure buildout means a startup created 3 or more new public repositories in 30 days. At Series A, these typically include API client libraries, SDK packages, CLI tools, and deployment infrastructure – signs that the team is building a platform around a working core product." },
      { question: "How does contributor growth signal a funding round?", answer: "When contributor count jumps 50%+ in a short window (e.g., from 12 to 20 contributors), the company has likely closed a round and is scaling. This appears in GitHub data within weeks of new hires joining, but the Crunchbase entry may lag by 6-12 weeks." },
    ],
    body: `Series A startups look different on GitHub than pre-seed or seed companies. The patterns are distinctive enough to identify from public data alone.

## What Makes Series A GitHub Activity Different

At the pre-seed and seed stages, GitHub activity is concentrated: one or two repositories, a small team, and commit patterns driven by individual contributors. At Series A, the picture changes.

The defining characteristic is platform expansion. The core product works – customers are using it – and now the team is building everything around it: SDKs, developer documentation, internal tools, deployment infrastructure, monitoring systems.

## The Infrastructure Buildout Signal

The strongest Series A signal is infrastructure buildout: 3 or more new public repositories created in 30 days. This is not a founder experimenting with side projects. This is a company with capital deploying it into platform development.

Common new repositories at this stage include API client libraries, CLI tools, integration frameworks, and documentation sites. Each represents a deliberate investment in making the product accessible to more users or developers.

## Contributor Growth as a Post-Raise Indicator

When contributor count jumps 50% or more in a short window, the company has likely just closed a round and is scaling the engineering team. At Series A, this typically means going from 8-12 contributors to 15-25.

The timing is important: contributor growth appears in GitHub data within weeks of new engineers joining, but the fundraise announcement may not appear on Crunchbase for another 6-12 weeks. This gap is the investor's opportunity.

## How to Use These Signals

Filter the [sector rankings](/) for startups estimated at "Series A/B" stage. Look for companies showing "Infrastructure buildout" signal type with contributor growth above 50%. Cross-reference with the [trending page](/trending) to find the strongest movers.

For a complete framework on interpreting these signals, see our guide to [GitHub due diligence for VCs](/blog/github-due-diligence-for-vcs).`,
  },
  {
    slug: "open-source-startups-investor-guide",
    title: "Open Source Startups: An Investor's Guide to GitHub Signal Analysis",
    description: "Open source startups present unique challenges for GitHub-based deal sourcing. Learn how to separate community contributions from commercial engineering activity and identify the open source companies worth investing in.",
    summary: "Open source startups require a different analytical lens for GitHub signal interpretation. Community contributions inflate commit counts and contributor numbers, making raw velocity metrics misleading. The key adjustments: focus on the company-owned repositories (not the community fork), track contributor growth in core maintainers (not occasional contributors), and look for the commercial infrastructure signal – new private or semi-private repos for billing, auth, and enterprise features. The strongest open source investment signal is when community engagement and commercial GitHub engineering acceleration (commit velocity + contributor growth, not accelerator-program participation) happen simultaneously.",
    date: "2026-04-09",
    relatedSectors: ["developer-tools", "data-infrastructure", "ai-ml"],
    references: [
      { label: "1", title: "GitHub Octoverse 2024", url: "https://github.blog/news-insights/octoverse/octoverse-2024/", source: "GitHub Blog" },
    ],
    faqs: [
      { question: "How do you evaluate open source startups with GitHub data?", answer: "Focus on the company-owned organization (not community forks), track core maintainer growth rather than total contributors, and look for commercial infrastructure signals – new repos for enterprise features, billing, or deployment tooling. Community star velocity is a social signal; commit velocity in the core product is the engineering signal." },
      { question: "What is the strongest open source investment signal?", answer: "Simultaneous community growth and commercial acceleration. When the open source project is gaining stars and contributors while the company organization is building enterprise infrastructure (billing, auth, deployment tooling), the open source flywheel is working – community traction is converting into commercial opportunity." },
      { question: "Do GitHub stars matter for startup investing?", answer: "Stars measure social interest, not engineering traction or commercial viability. A repository with 10,000 stars may have zero revenue. Stars can indicate developer mindshare, but commit velocity in the company's own repositories is a more reliable signal of engineering momentum." },
    ],
    body: `Open source startups are some of the most interesting investment opportunities in developer tools and infrastructure. But they present unique challenges for GitHub-based signal analysis.

## The Community Noise Problem

For most startups, commit velocity is a clean signal – the commits come from the team. For open source startups, commits come from everywhere: core team, community contributors, one-time bug fixers, documentation translators, and bots.

This noise inflates the standard metrics. A popular open source project might show 500 contributors, but only 10 are paid employees. A commit velocity spike might reflect a documentation sprint by the community, not product acceleration by the company.

## How to Separate Commercial from Community Signals

The key is to focus on the company-owned organization, not the project repository. Most commercial open source startups have a GitHub organization with multiple repos: the main project, plus commercial tools, SDKs, enterprise features, and infrastructure.

Track these separately:
- Core project repo: Community engagement signal (stars, forks, external PRs)
- Organization-level repos: Commercial engineering signal (new repos, internal tools, enterprise features)
- Contributor growth in core maintainers: Hiring signal (new team members with commit access)

## The Strongest Open Source Investment Signal

The most compelling signal is simultaneous community growth and commercial acceleration. When the open source project is gaining stars and contributors while the company organization is building enterprise infrastructure, the flywheel is working.

## Practical Screening

Browse the [Developer Tools sector rankings](/startups-to-watch/developer-tools-q2-2026) and look for companies with high contributor counts (50+) but moderate contributor growth. Then check if they show infrastructure buildout signals – new repos for commercial features.

For the full deal sourcing framework, see [how to source startup deals before they appear on Crunchbase](/blog/source-startup-deals-before-crunchbase).`,
  },
  {
    slug: "github-signals-vs-hiring-data",
    title: "GitHub Signals vs Hiring Data: Which Predicts Fundraises Better?",
    description: "Compare GitHub engineering signals and hiring data as leading indicators of startup fundraises. Lead time, reliability, coverage, and which investors should use – or whether the combination beats either alone.",
    summary: "GitHub engineering signals provide 6-12 weeks of lead time before fundraise announcements, while hiring data provides 4-8 weeks. GitHub signals are earlier because engineering acceleration precedes hiring decisions – a team accelerates its code output before posting job listings. Hiring data is more explicit about growth type (engineering vs. sales vs. marketing) but narrower in coverage. The optimal approach combines both: GitHub signals for early detection, hiring data for confirmation and growth-type classification.",
    date: "2026-04-08",
    relatedSectors: ["enterprise-saas", "ai-ml", "hr-tech"],
    references: [
      { label: "1", title: "GitHub REST API – Contributors", url: "https://docs.github.com/en/rest/metrics/statistics#get-all-contributor-commit-activity", source: "GitHub Docs" },
    ],
    faqs: [
      { question: "Which predicts fundraises better: GitHub signals or hiring data?", answer: "GitHub signals provide earlier lead time (6-12 weeks vs 4-8 weeks for hiring) because engineering acceleration precedes hiring decisions. Hiring data is more explicit about growth type. The combination of both is stronger than either alone – GitHub for timing, hiring for confirmation." },
      { question: "How much lead time do GitHub signals give over hiring data?", answer: "GitHub engineering signals typically provide 6-12 weeks of lead time before fundraise announcements, compared to 4-8 weeks for hiring data. The gap exists because engineering acceleration (more commits, faster shipping) precedes the hiring decisions that follow. By the time a job posting appears, the engineering acceleration has been visible for weeks." },
      { question: "Should investors use GitHub signals or hiring data?", answer: "Both – sequentially. Use GitHub signals for early detection (which companies are accelerating?) then hiring data for confirmation and growth-type classification (are they hiring engineers, sales, or marketing?). The combination provides both timing advantage and strategic context." },
    ],
    body: `Two alternative data sources dominate the conversation about startup deal sourcing: GitHub engineering signals and hiring data. Both claim to predict fundraises before traditional channels. Which actually works better?

## GitHub Signals: The Earliest Public Indicator

GitHub engineering acceleration appears 6-12 weeks before fundraise announcements. The logic: a startup accelerates engineering output → builds product → raises capital → announces the round. GitHub catches step one.

The signal is in the rate of change. A commit velocity increase of +100% or more, sustained over multiple weeks, indicates something fundamental shifted in how the team is working. See [what is engineering acceleration](/blog/what-is-engineering-acceleration) for the full explanation.

## Hiring Data: The Most Explicit Indicator

Job postings on LinkedIn, AngelList, and company career pages provide 4-8 weeks of lead time. Hiring data is later than GitHub signals but more explicit: a "VP Engineering" posting tells you they are scaling the technical team, while a "Head of Sales" posting tells you they are building go-to-market.

Hiring data answers "what are they building?" GitHub data answers "how fast are they building?"

## The Comparison

Lead time: GitHub wins (6-12 weeks vs 4-8 weeks). Engineering acceleration precedes hiring decisions because teams ship faster before they staff up.

Signal explicitness: Hiring wins. A job posting for "Senior ML Engineer" tells you more about strategic direction than a commit velocity spike.

Coverage: Hiring wins for breadth (every company hires). GitHub wins for depth (commit-level granularity on technical startups).

Cost: Both are free for basic analysis. GitHub data is available via API; hiring data requires scraping or paid platforms.

## The Optimal Approach

Use both, sequentially. GitHub signals surface the candidates (earliest warning). Hiring data confirms the trajectory (what type of growth). This is the workflow described in our guide on [sourcing deals before Crunchbase](/blog/source-startup-deals-before-crunchbase).

Browse the [trending page](/trending) for the startups showing the strongest GitHub engineering acceleration (commit velocity + contributor growth) this week.`,
  },
  {
    slug: "fintech-startup-engineering-signals",
    title: "Fintech Startup Engineering Signals: What the GitHub Data Shows",
    description: "An analysis of engineering acceleration patterns specific to fintech startups. Regulatory-driven development cycles, compliance infrastructure, and what makes fintech GitHub signals different from other sectors.",
    summary: "Fintech startups show distinctive engineering patterns driven by regulatory requirements. Infrastructure buildout signals in fintech often indicate compliance infrastructure (KYC/AML systems, audit logging, encryption) rather than product expansion. The strongest fintech investment signal is simultaneous product acceleration and compliance buildout – this combination suggests a company preparing for a regulated launch, which typically requires significant capital and precedes fundraising by 8-12 weeks.",
    date: "2026-04-07",
    relatedSectors: ["fintech", "enterprise-saas", "cybersecurity"],
    references: [
      { label: "1", title: "GitHub REST API – Repository Statistics", url: "https://docs.github.com/en/rest/metrics/statistics", source: "GitHub Docs" },
    ],
    faqs: [
      { question: "What makes fintech GitHub signals different from other sectors?", answer: "Fintech engineering signals are influenced by regulatory requirements. Infrastructure buildout often indicates compliance infrastructure (KYC, AML, audit logging) rather than product expansion. Deploy frequency spikes may reflect regulatory deadline-driven development rather than customer-driven iteration." },
      { question: "What is the strongest fintech investment signal on GitHub?", answer: "Simultaneous product acceleration and compliance buildout. When a fintech company is shipping product features and building compliance infrastructure (KYC, audit logging, encryption) at the same time, it is preparing for a regulated launch – which requires significant capital and often precedes fundraising." },
      { question: "Can you find fintech startups using GitHub data?", answer: "Yes, but with sector-specific interpretation. Fintech companies with public repos typically focus on developer-facing products (payment APIs, banking-as-a-service, trading infrastructure). Consumer fintech companies are less likely to have public GitHub activity. Check the Fintech sector rankings for current data." },
    ],
    body: `Fintech startups show different engineering patterns on GitHub compared to other sectors. Understanding these patterns is essential for investors using engineering signals to source fintech deals.

## Regulatory-Driven Development Cycles

The most important difference: fintech development cycles are partly driven by regulatory requirements, not just product-market fit. When a fintech startup shows a commit velocity spike, it may be responding to a compliance deadline rather than customer demand.

This does not make the signal less valuable – regulatory compliance requires engineering investment, which requires capital. But it changes the interpretation. A fintech company building KYC infrastructure is not necessarily iterating on product-market fit; it may be preparing for a regulated launch.

## What Infrastructure Buildout Means in Fintech

In most sectors, infrastructure buildout (3+ new repositories in 30 days) indicates platform expansion. In fintech, the new repositories often serve a different purpose: compliance infrastructure, audit logging, encryption libraries, and regulatory reporting tools.

Look at the repository names and descriptions. New repos named "kyc-service," "audit-log," or "compliance-api" tell a different story than "marketplace-sdk" or "developer-tools."

## The Strongest Fintech Signal

The most compelling fintech investment signal is simultaneous product acceleration and compliance buildout. When a company is shipping product features and building compliance infrastructure at the same time, it is preparing for a regulated launch. This typically requires significant capital, which means fundraising is imminent or recently completed.

Browse the [Fintech sector rankings](/startups-to-watch/fintech-q2-2026) to see the current data, or compare approaches using our [best deal flow tools for seed-stage investors](/compare/best-deal-flow-tools-seed-investors) guide.`,
  },
  {
    slug: "ai-startup-signals-2026",
    title: "AI Startup Engineering Signals in 2026: What Investors Should Watch",
    description: "The AI sector shows the highest commit velocity of any sector we track. Learn which AI engineering patterns signal real traction vs. hype, and how to use GitHub data to find the AI startups worth investing in.",
    summary: "AI startups in 2026 show the highest average commit velocity of any sector – but also the highest noise. The key to interpreting AI engineering signals: distinguish model training infrastructure (high compute, low commit frequency, research-oriented) from product engineering (rapid iteration, frequent commits, customer-driven). The strongest AI investment signals come from companies transitioning from research to product – when commit velocity shifts from sporadic large commits to frequent small commits, the team is moving from experimentation to shipping.",
    date: "2026-04-06",
    relatedSectors: ["ai-ml", "data-infrastructure", "developer-tools"],
    references: [
      { label: "1", title: "GitHub Octoverse 2024 – AI Development", url: "https://github.blog/news-insights/octoverse/octoverse-2024/", source: "GitHub Blog" },
      { label: "2", title: "Stanford AI Index Report 2025", url: "https://aiindex.stanford.edu/report/", source: "Stanford HAI" },
    ],
    faqs: [
      { question: "How do you evaluate AI startup engineering signals?", answer: "Distinguish model training infrastructure (sporadic large commits, research-oriented) from product engineering (frequent small commits, customer-driven iteration). The strongest signal is a transition from research-style to product-style commit patterns, indicating the company is moving from experimentation to shipping." },
      { question: "What makes AI startups different on GitHub?", answer: "AI startups show the highest average commit velocity but also the highest noise of any sector. Open source experimentation, research-oriented commits, and community activity inflate the standard metrics. The key is separating product engineering (shipping features) from research exploration (running experiments)." },
      { question: "What is the best AI startup investment signal?", answer: "The research-to-product transition. When an AI startup's commit pattern shifts from sporadic large commits (experiments, model checkpoints) to frequent small commits (API endpoints, deployment config, monitoring), the team is moving from 'does this work?' to 'let's ship this.' This transition often precedes a fundraise." },
    ],
    body: `AI is the highest-velocity sector in our dataset. It is also the noisiest. Here is how to read AI startup engineering signals in 2026.

## The AI Velocity Paradox

AI startups show the highest average commit velocity of any sector we track at VC Deal Flow Signal. But high velocity alone does not mean high quality deal flow. The AI sector has more open source experimentation, more research-oriented commits, and more hype-driven activity than any other sector.

The challenge for investors: separating genuine product engineering from research exploration and open source community activity. See our guide on [evaluating open source startups](/blog/open-source-startups-investor-guide) for the analytical framework.

## Research vs. Product Commit Patterns

AI startups go through a distinctive phase transition that is visible in GitHub data:

Research phase: Sporadic large commits, Jupyter notebooks, experiment tracking, model checkpoints. Commit messages reference papers and experiments rather than features and fixes. Velocity is unpredictable.

Product phase: Frequent small commits, API endpoints, deployment configuration, monitoring setup. Commit messages reference users, features, and bugs. Velocity is sustained and accelerating.

The transition from research to product is the signal. When an AI startup's commit pattern shifts from sporadic-and-large to frequent-and-small, the team is moving from "does this work?" to "let's ship this." That transition often precedes a fundraise.

## What to Watch in 2026

The current AI sector shows interesting signal diversity. Browse the [AI & Machine Learning sector rankings](/startups-to-watch/ai-ml-q2-2026) to see who is accelerating.

For a broader perspective on using alternative data for deal sourcing, see [why GitHub is the most underused signal in venture capital](/blog/alternative-data-venture-capital).`,
  },
  {
    slug: "deal-sourcing-workflow-weekly",
    title: "A Weekly Deal Sourcing Workflow Using Engineering Signals",
    description: "A 30-minute weekly workflow for investors who want to use GitHub engineering signals for deal sourcing. Step-by-step process: check rankings, screen startups, verify signals, and build a pipeline.",
    summary: "This workflow takes 30 minutes per week and surfaces 2-5 actionable startup leads from engineering signal data. Step 1: Check the trending page for top movers (5 min). Step 2: Filter by your focus sectors (5 min). Step 3: Screen the top 3 unfamiliar names – open their GitHub, check if activity is product-related (10 min). Step 4: Cross-reference with community and hiring signals (5 min). Step 5: Add qualified leads to your pipeline with the engineering data as context (5 min).",
    date: "2026-04-05",
    relatedSectors: ["ai-ml", "enterprise-saas", "fintech"],
    references: [
      { label: "1", title: "VC Deal Flow Signal – Methodology", url: "https://signals.gitdealflow.com/methodology", source: "VC Deal Flow Signal" },
    ],
    howTo: {
      name: "Weekly Deal Sourcing Workflow Using Engineering Signals",
      description: "A 30-minute weekly process for finding startup investment leads using GitHub engineering acceleration data.",
      totalTime: "PT30M",
      steps: [
        { name: "Check the trending page", text: "Open signals.gitdealflow.com/trending and scan the top 10 startups by commit velocity change. Note any unfamiliar names. This takes 5 minutes." },
        { name: "Filter by your focus sectors", text: "Navigate to the 2-3 sector pages that match your investment thesis. Look for startups in the top 3 that you have not seen before. 5 minutes." },
        { name: "Screen the top candidates", text: "For each unfamiliar startup, open their GitHub organization. Check: is the activity product-related? Are real engineers committing, or is it bots? Does the tech stack match the company description? 10 minutes for 3 startups." },
        { name: "Cross-reference with other signals", text: "Search Hacker News, Twitter, and LinkedIn for the company name. Check their careers page for open roles. Is there community buzz or active hiring? 5 minutes." },
        { name: "Add to your pipeline", text: "For startups that pass all checks, add them to your deal pipeline with the engineering data as context: velocity change, signal type, contributor count. Reach out to the founder. 5 minutes." },
      ],
    },
    faqs: [
      { question: "How long does this workflow take?", answer: "30 minutes per week. The workflow is designed to fit into a Monday morning routine: check rankings, screen candidates, verify signals, and add qualified leads to your pipeline." },
      { question: "How many leads does this workflow typically produce?", answer: "2-5 actionable leads per week, depending on how many sectors you track and how selective you are. The quality is high because engineering acceleration is a leading indicator – you are finding companies before they appear in traditional deal sourcing channels." },
    ],
    body: `Most investors know they should use data for deal sourcing. Few have a repeatable process for doing it. Here is a 30-minute weekly workflow using engineering signals.

## Why a Weekly Cadence?

VC Deal Flow Signal refreshes data every Monday. Engineering acceleration is a weekly signal – commit velocity change is calculated over 14-day windows. Checking more frequently than weekly adds no new information. Checking less frequently means you miss the timing advantage.

Monday morning is ideal: the data is fresh, and you can add qualified leads to your pipeline before the week's meetings.

## The 30-Minute Workflow

This process is deliberately simple. The goal is not exhaustive analysis – it is fast identification of startups worth a deeper look.

## Step 1: Check the Trending Page (5 minutes)

Open the [trending page](/trending) and scan the top 10 startups by commit velocity change. These are the companies showing the strongest engineering acceleration across all sectors this week.

Look for unfamiliar names. If a company you have never heard of appears in the top 5, that is the signal working as intended – you are seeing it before mainstream channels surface it.

## Step 2: Filter by Your Focus Sectors (5 minutes)

Navigate to the 2-3 [sector pages](/) that match your investment thesis. Within each sector, look for startups in the top 3 that are new to you.

## Step 3: Screen the Top Candidates (10 minutes)

For each unfamiliar startup, spend 3-4 minutes on their GitHub. The [5-check screening framework](/blog/startup-engineering-metrics-investors-should-track) covers what to look for.

## Step 4: Cross-Reference (5 minutes)

Search for the company on Hacker News, Twitter, and LinkedIn. Check their careers page. The goal is to confirm the engineering signal with qualitative context.

## Step 5: Add to Pipeline (5 minutes)

For startups that pass all checks, add them to your deal tracking system. Include the engineering data: velocity change, signal type, contributor count, and the date you first noticed them. This creates a record of your timing advantage.

Subscribe to the [Signal Digest](https://gitdealflow.com/#signup) to get the highlights delivered to your inbox every Monday.`,
  },
  {
    slug: "cybersecurity-startup-signals",
    title: "Cybersecurity Startup Signals: Reading GitHub Data for Security Deals",
    description: "Cybersecurity startups have unique GitHub patterns: rapid response to CVEs, compliance-driven sprints, and infrastructure hardening. Learn what cybersecurity engineering signals mean for investors.",
    summary: "Cybersecurity startups show unique engineering patterns on GitHub. Deploy frequency spikes often correlate with CVE response cycles rather than product iteration. Infrastructure buildout signals frequently indicate security compliance infrastructure (SOC 2, ISO 27001) rather than product expansion. The strongest cybersecurity investment signal is sustained acceleration outside of incident response – when a security startup is shipping fast without an external trigger, the team is building toward a milestone.",
    date: "2026-04-04",
    relatedSectors: ["cybersecurity", "enterprise-saas", "data-infrastructure"],
    references: [
      { label: "1", title: "GitHub Advisory Database", url: "https://github.com/advisories", source: "GitHub" },
      { label: "2", title: "NIST Cybersecurity Framework", url: "https://www.nist.gov/cyberframework", source: "NIST" },
    ],
    faqs: [
      { question: "How do cybersecurity GitHub signals differ from other sectors?", answer: "Cybersecurity deploy frequency spikes often reflect CVE response rather than product iteration. Infrastructure buildout may indicate compliance infrastructure (SOC 2, ISO 27001). The strongest signal is sustained acceleration outside of incident-response cycles." },
      { question: "How do you separate CVE response from real product acceleration?", answer: "Check the timing: does the velocity spike coincide with a major CVE disclosure? If the spike happens within days of a published vulnerability, it is likely reactive patching. Sustained acceleration over 2-3 weeks without an external trigger indicates genuine product momentum." },
      { question: "What does compliance infrastructure signal in cybersecurity startups?", answer: "New repositories related to SOC 2 audit trails, ISO 27001 documentation, or penetration testing frameworks indicate a company preparing for enterprise sales. Most enterprise buyers require SOC 2 compliance, so this buildout is a positive investment signal – it requires capital and precedes revenue growth." },
    ],
    body: `Cybersecurity startups present unique challenges for GitHub-based signal analysis. The sector's engineering patterns are driven by threat response cycles and compliance requirements in ways that other sectors are not.

## CVE-Driven Development

The most distinctive cybersecurity pattern: deploy frequency spikes that correlate with CVE disclosures. When a major vulnerability is published, security companies rush to patch, update, and ship. This creates commit velocity spikes that are reactive, not strategic.

For investors, the question is whether a velocity spike reflects incident response or product momentum. Check the timing: does the spike coincide with a major CVE disclosure? If so, the acceleration is defensive, not offensive.

## Compliance Infrastructure Signals

Like fintech, cybersecurity startups build significant compliance infrastructure: SOC 2 audit trails, ISO 27001 documentation, penetration testing frameworks, and security certification tooling.

New repositories related to compliance indicate a company preparing for enterprise sales – most enterprise buyers require SOC 2 compliance at minimum. This is a positive investment signal because enterprise-readiness requires capital and precedes revenue growth.

## The Strongest Cybersecurity Signal

The most compelling cybersecurity investment signal is sustained engineering acceleration that is not correlated with external events. When a security startup is shipping fast without a CVE trigger or compliance deadline, the team is building something new. That organic acceleration is the same signal that works across all sectors – and it precedes fundraising by the same 6-12 week window.

Browse the [Cybersecurity sector rankings](/startups-to-watch/cybersecurity-q2-2026) to see which security startups are showing engineering acceleration right now.`,
  },
  {
    slug: "climate-tech-engineering-signals",
    title: "Climate Tech Engineering Signals: What GitHub Data Reveals About Green Startups",
    description: "Climate tech startups combine hardware and software development, creating unique GitHub patterns. Learn how to interpret engineering signals for energy, carbon, and sustainability startups.",
    summary: "Climate tech startups combine hardware and software development in ways that create distinctive GitHub patterns. Software-heavy climate companies (carbon accounting, energy trading, grid optimization) show patterns similar to enterprise SaaS. Hardware-adjacent companies (battery management, sensor networks, IoT) show lower commit velocity but higher infrastructure buildout. The key insight for investors: climate tech GitHub engineering acceleration (commit velocity + new repository creation) often indicates a transition from R&D to deployment – the moment when a technology moves from lab to field, which requires capital.",
    date: "2026-04-03",
    relatedSectors: ["climate-tech", "data-infrastructure", "enterprise-saas"],
    references: [
      { label: "1", title: "IEA – World Energy Investment 2025", url: "https://www.iea.org/reports/world-energy-investment", source: "International Energy Agency" },
    ],
    faqs: [
      { question: "Can you use GitHub data to evaluate climate tech startups?", answer: "Yes, but with nuance. Software-heavy climate companies (carbon accounting, energy trading) show standard engineering signals. Hardware-adjacent companies show lower commit velocity but meaningful infrastructure buildout when transitioning from R&D to deployment." },
      { question: "What is the strongest climate tech investment signal?", answer: "The R&D-to-deployment transition. When a climate tech company's GitHub activity shifts from experimental (research notebooks, prototype code) to operational (deployment scripts, monitoring, CI/CD pipelines), the technology is moving from lab to field. This transition requires capital and often precedes fundraising." },
      { question: "Which climate tech companies show up on GitHub?", answer: "Software-heavy climate companies appear most clearly: carbon accounting platforms, energy trading tools, grid optimization software, and ESG reporting systems. Hardware-adjacent companies building intelligence layers (battery management, sensor networks, predictive maintenance) also show meaningful GitHub signals." },
    ],
    body: `Climate tech is one of the fastest-growing sectors in venture capital. But it also one of the hardest to analyze with software engineering metrics, because many climate tech companies build physical products.

## The Software-Hardware Spectrum

Climate tech startups fall along a spectrum from pure software to pure hardware. At the software end: carbon accounting platforms, renewable energy trading tools, grid optimization software, and ESG reporting systems. These companies look like enterprise SaaS on GitHub – high commit velocity, standard signal patterns.

At the hardware end: battery manufacturers, solar panel companies, and industrial decarbonization. These companies may have minimal public GitHub activity because most of their engineering work is in hardware design, not software.

The most interesting companies for GitHub signal analysis sit in the middle: hardware-adjacent software companies that build the intelligence layer for physical systems. Battery management systems, sensor networks, predictive maintenance for wind farms, and energy grid optimization.

## What Climate Tech Signals Look Like

Software-heavy climate tech: Looks like enterprise SaaS. Commit velocity, contributor growth, and signal types follow standard patterns. Use the same analytical framework as any other sector.

Hardware-adjacent climate tech: Lower absolute commit velocity, but meaningful infrastructure buildout signals. New repositories for data pipelines, IoT integrations, and edge computing indicate a transition from R&D to deployment.

## The R&D-to-Deployment Transition

The strongest climate tech investment signal is the R&D-to-deployment transition. When a company's GitHub activity shifts from experimental (research notebooks, prototype code) to operational (deployment scripts, monitoring, CI/CD), the technology is moving from lab to field.

This transition requires capital – deploying physical systems costs money. Engineering acceleration during this phase is a strong fundraise predictor.

Browse the [Climate Tech sector rankings](/startups-to-watch/climate-tech-q2-2026) to see which green startups are showing acceleration right now.`,
  },
  {
    slug: "investor-mistakes-github-signals",
    title: "5 Mistakes Investors Make When Reading GitHub Signals",
    description: "Common pitfalls when using GitHub engineering data for deal sourcing: confusing stars with traction, ignoring private repos, overweighting absolute velocity, missing the context behind spikes, and treating signals as investment decisions.",
    summary: "Five common mistakes when interpreting GitHub signals for investing: (1) Confusing GitHub stars with engineering traction – stars measure social interest, not engineering output. (2) Ignoring private repos – some of the best startups keep all code private. (3) Overweighting absolute velocity – a 500-commit company is not necessarily better than a 50-commit company. (4) Missing spike context – not all velocity spikes are positive (docs sprints, bot activity, one-time migrations). (5) Treating signals as investment decisions – GitHub engineering acceleration (commit velocity + contributor growth) is a sourcing tool, not a diligence replacement.",
    date: "2026-04-02",
    relatedSectors: ["developer-tools", "ai-ml", "enterprise-saas"],
    references: [
      { label: "1", title: "GitHub Octoverse 2024", url: "https://github.blog/news-insights/octoverse/octoverse-2024/", source: "GitHub Blog" },
    ],
    faqs: [
      { question: "What are the biggest mistakes investors make with GitHub signals?", answer: "The five most common: confusing stars with traction, ignoring the private repo blind spot, overweighting absolute commit counts over acceleration, missing the context behind velocity spikes (bots, docs, migrations), and treating engineering signals as investment decisions rather than sourcing signals." },
      { question: "Are GitHub signals reliable for investment decisions?", answer: "GitHub signals are reliable for deal sourcing – identifying interesting companies early. They are not reliable as standalone investment decisions. Engineering acceleration should be the first step in a diligence process, not the last. Always verify with direct founder conversations, product evaluation, and market analysis." },
    ],
    body: `GitHub engineering signals are a powerful deal sourcing tool. They are also easy to misread. Here are the five most common mistakes investors make – and how to avoid them.

## Mistake 1: Confusing Stars with Traction

GitHub stars measure social interest. They are a vanity metric, not an engineering signal. A repository with 10,000 stars may have zero commercial traction. A repository with 50 stars may power a company with $5M ARR.

Stars tell you what developers find interesting. Commit velocity tells you what companies are actually building. Focus on the latter.

## Mistake 2: Ignoring the Private Repo Blind Spot

Public GitHub activity is a biased sample. Many startups – especially in enterprise SaaS, fintech, and healthcare – keep all their code in private repositories. A startup with no public GitHub activity is not necessarily inactive; it may be very active in ways you cannot see.

This means GitHub signals work best for sectors with a culture of open source or public development: developer tools, infrastructure, AI/ML, and Web3. For sectors with strong privacy norms, use GitHub signals as one input among many.

## Mistake 3: Overweighting Absolute Velocity

A startup with 500 commits per week is not necessarily more interesting than one with 50. What matters is the rate of change – is the 50-commit startup accelerating?

Absolute velocity correlates with team size, not with momentum. [Commit velocity change](/glossary#commit-velocity-change) normalizes for team size by measuring acceleration relative to the company's own baseline.

## Mistake 4: Missing Spike Context

Not all velocity spikes are positive signals. Common false positives:
- Documentation sprints (high commit count, low engineering substance)
- CI/CD bot activity (automated commits inflating counts)
- One-time migrations (framework upgrades, monorepo restructuring)
- Hackathon artifacts (intense activity that does not sustain)

The fix: spend 5 minutes on the GitHub organization before acting on a spike. Check recent commit messages and which repositories are active. This is step 3 in our [weekly sourcing workflow](/blog/deal-sourcing-workflow-weekly).

## Mistake 5: Treating Signals as Decisions

Engineering acceleration is a sourcing signal, not an investment thesis. It tells you which companies are worth investigating – not which companies are worth investing in.

The signal gets you to the table early. The decision still requires founder conversations, product evaluation, market analysis, and competitive landscape assessment. GitHub data gives you timing advantage; due diligence gives you conviction.

For the full screening framework, see the [7 engineering metrics every investor should track](/blog/startup-engineering-metrics-investors-should-track).`,
  },
  {
    slug: "i-tracked-4200-startup-github-orgs-six-months",
    title: "I Tracked 4,200 Startup GitHub Orgs for Six Months. Here's What Predicts a Series A.",
    description:
      "Six months of public GitHub data across 4,200 startup organizations. Which commit patterns actually predict a Series A round? Plus the public Q3 2026 watchlist – bookmark and verify.",
    date: "2026-04-19",
    relatedSectors: ["ai-ml", "developer-tools", "data-infrastructure", "cybersecurity"],
    keyStats: [
      { value: "4,200", label: "Startup orgs tracked", context: "Across 20 sectors, weekly" },
      { value: "3-6 weeks", label: "Signal lead time", context: "Before fundraise announcements" },
      { value: "70%", label: "Series A hit rate", context: "Backtest, Q3-Q4 2025" },
    ],
    summary:
      "Six months of weekly snapshots across 4,200 startup GitHub orgs reveal that a coordinated jump in commit velocity, contributor count, and new-repo creation precedes Series A announcements roughly 70% of the time, with a 3 to 6 week lead. The signal is strongest for devtools, infra, fintech, and cybersecurity startups; it is noisy for AI-pure companies because they commit constantly regardless of stage. The full live watchlist of 10 startups predicted to raise in Q3 2026 is published at /predicted, with a free /predict tool to score any GitHub org in real time.",
    references: [
      { label: "1", title: "GitHub REST API – Commit Activity", url: "https://docs.github.com/en/rest/metrics/statistics", source: "GitHub Docs" },
      { label: "2", title: "Alternative Data in Private Markets", url: "https://www.bain.com/insights/alternative-data-in-private-equity/", source: "Bain & Company" },
      { label: "3", title: "VC Deal Flow Signal Methodology", url: "https://signals.gitdealflow.com/methodology", source: "GitDealFlow" },
    ],
    faqs: [
      {
        question: "How is the prediction calculated?",
        answer:
          "We compute a rolling 14-day window of commits per startup org, contributor count delta over 30 days, and new-repo creation rate. When all three accelerate inside the same two-week window, we classify the startup as 'accelerating'. Historical backtest shows ~70% of accelerating startups announce a fundraise within 6 weeks.",
      },
      {
        question: "Why does this work better for non-AI startups?",
        answer:
          "AI startups commit constantly regardless of fundraise timing – the signal-to-noise ratio is poor. The pattern is most diagnostic in devtools, infrastructure, fintech, and cybersecurity, where engineering velocity tracks more closely with company stage and runway pressure.",
      },
      {
        question: "Can I check my own startup's signal?",
        answer:
          "Yes. The free tool at /predict accepts any GitHub org name and returns the live signal classification (accelerating, steady, decelerating) plus the underlying commit and contributor numbers. No signup required.",
      },
      {
        question: "How do I verify these predictions?",
        answer:
          "The /predicted page is a public, dated, snapshot watchlist. Bookmark it. Come back in 6 months and check how many of the 10 startups raised, were acquired, or had a major launch. Each card links to the underlying GitHub org so you can audit the signal yourself.",
      },
    ],
    body: `Six months ago I started watching public GitHub for a leading indicator that VCs were missing.

The thesis was simple. Hedge funds spent the last decade extracting alpha from satellite imagery, credit card panels, and shipping data. The venture-capital equivalent – public engineering activity on GitHub – has been sitting in plain sight, ignored by most institutional sourcing teams, who still rely on Crunchbase, warm intros, and Twitter.

I built a crawler. I pointed it at 4,200 startup organizations across 20 sectors. I let it run weekly for six months. Here is what I learned.

## What the Signal Actually Looks Like

The single most predictive indicator is not commit volume. It is commit velocity *change*.

A startup that ships 200 commits per week and continues to ship 200 commits per week tells you nothing. A startup that goes from 80 commits to 240 commits inside 14 days tells you something is happening. Often it is a fundraise close. Often it is a launch. Sometimes it is both.

We track three signals together:

1. Commit velocity (14-day window) – total commits to the org's most active repo
2. Contributor growth (30-day window) – change in the count of unique contributors
3. New repo creation (30-day window) – fresh repos appearing in the org

When all three accelerate inside the same two-week window, we classify the startup as "accelerating". In our backtest across Q3 and Q4 of 2025, roughly 70% of accelerating startups announced a fundraise within six weeks of the signal firing.

## The Four Signal Types

Not every acceleration looks the same. We classify them into four pre-fundraise patterns:

Engineering hiring burst. Contributor count jumps 40 percent or more inside 30 days. Often pre-Series A – the company has signed term sheets, started hiring, and the new engineers are pushing first commits. We catch this earlier than LinkedIn employee counts because contribution lands before "Senior Engineer at Acme" gets posted.

Infrastructure buildout. Commits to ops, infra, deploy, and observability repos spike. The company is preparing to scale. Usually accompanies a Series A or Series B that is funding go-to-market expansion.

Deploy frequency spike. Commits per day double. Often a sign of a launch run-up. The team is shipping fixes and features fast. Sometimes followed by a product launch and a press cycle, sometimes by a fundraise where the metrics make the deck.

Framework migration. The team is migrating to a new stack – Next.js, Bun, a new ORM, fresh CI. This often happens 60 to 120 days before a Series A. It is the engineering equivalent of cleaning your apartment before parents visit. Our hypothesis: founders know due diligence is coming and want a clean codebase to walk an investor through.

## Where the Signal Fails

Honesty: the signal is bad for AI-pure startups. They commit constantly regardless of stage. Signal-to-noise is poor. We exclude AI-only orgs from the strongest classification tier and weight other features more heavily.

The signal is also useless for stealth startups that do not open-source. If your dream company is in stealth, GitHub gives you nothing.

And the signal is not investment advice. It tells you who to talk to. It does not tell you who to wire money to. The decision still requires founder conversations, product evaluation, market analysis, and competitive teardown. Engineering velocity is a sourcing signal, not an investment thesis.

## What Does NOT Predict a Round

Things that look meaningful in the data but turn out to be noise:

- Star count. Vanity. A 30,000-star repo means it had a viral moment. It does not mean revenue.
- Fork count. Lagging indicator at best. By the time forks accumulate, the round is closed.
- Single-repo commit volume. Founders cosplay productivity. One person committing 400 times a week to one repo is a productivity tell, not a fundraise tell.
- The GitHub trending tab. If a project is trending, the round is already 80 percent allocated. You are too late.

The signal is in *change*, not in *level*.

## The Public Watchlist (Q3 2026 Predictions)

Today I published the [10 startups our model predicts will raise in Q3 2026](/predicted). It is dated. It is bookmarkable. It is falsifiable. Come back in 6 months and check.

Each card on the watchlist links to the underlying GitHub org so you can audit the signal yourself. The free [/predict tool](/predict) lets you score any other startup with the same engine in seconds.

I am publishing this in public on purpose. Backtests are easy to fake. Live forward-tested predictions are hard to fake. The only way to build trust in an alternative data source is to show your work and let the future judge it.

## How to Use This in Practice

If you are a VC, scout, or angel:

1. Subscribe to the free weekly digest at [gitdealflow.com](https://gitdealflow.com/#signup). Five breakouts every Monday morning, in your inbox before any other source has them.
2. Bookmark the [Q3 2026 watchlist](/predicted). When something on the list raises, you will know we called it.
3. Use the [/predict tool](/predict) before every founder meeting. Two seconds of GitHub-signal context can save a 30-minute call with a company whose engineering momentum is already cooling.

If you are a founder:

1. Run [/predict](/predict) on your own org. Know what your public engineering signal looks like to investors before the next pitch.
2. If you are pre-fundraise and your signal is steady or decelerating, fix it before you start the round. Investors who use alt-data are reading this in real time.
3. If you are stealth, you are invisible to this signal. Trade-off acknowledged.

## What is Next

We refresh the dataset every Monday at 09:00 UTC. New watchlists every quarter. Methodology updates published at [/methodology](/methodology) when the underlying classification thresholds change.

If you find a startup we should be tracking that is not in the index yet, the [/predict](/predict) tool tells you so directly and lets you submit it.

The first VC to systematically use engineering-velocity data as a sourcing input has already won the next decade of seed-stage deal flow. The question is who that is going to be.`,
  },
  {
    slug: "mcp-server-tool-count-war-story",
    title: "I cut my MCP server from 8 tools to 5 and the hallucinations stopped",
    description:
      "Three weeks of tool-count post-mortem on @gitdealflow/mcp-signal. Why REST endpoints aren't user intents, why two of my tool names were costing me selection accuracy, and the data on what changed.",
    summary:
      "Shipped @gitdealflow/mcp-signal with 8 tools mirroring REST endpoints. Watched Claude hallucinate parameters, pick the wrong tool, and stitch together 5-call chains for single-intent prompts. Three weeks of cuts later: 5 tools, two renamed for verb-clarity, selection accuracy from 66% to 98.5%, average tool calls per intent from 2.4 to 1.1. The heuristic: design one tool per user intent, not one per resource. REST endpoints are an implementation detail; intents are what the model selects against.",
    date: "2026-04-25",
    relatedSectors: ["developer-tools", "ai-ml"],
    keyStats: [
      {
        value: "98.5%",
        label: "First-call selection accuracy after the cuts",
        context: "Up from 66% on the 8-tool menu, measured on 200 real prompts.",
      },
      {
        value: "1.1",
        label: "Average tool calls per user intent",
        context: "Down from 2.4 before. Most prompts now resolve in a single call.",
      },
      {
        value: "~2,200",
        label: "Input tokens saved per turn from menu trim",
        context: "Eight schemas at ~600 tokens each became five at ~560 each.",
      },
    ],
    faqs: [
      {
        question: "How many tools should an MCP server have?",
        answer:
          "There is no universal number, but the heuristic that works in practice is: one tool per distinct user intent, not one per REST endpoint. For @gitdealflow/mcp-signal, that came out to five tools mapping eight endpoints — three endpoints folded into multi-purpose tools, two were renamed for verb-noun clarity. Most teams ship with too many tools, not too few. Every tool in the menu costs the model reasoning bandwidth, costs the user latency, and increases the chance of a wrong-tool selection. Audit by logging what your users actually ask for in plain English, then reverse-engineering the smallest tool surface that covers those intents.",
      },
      {
        question: "Why does MCP tool naming matter for accuracy?",
        answer:
          "The model selects tools by matching the user's prompt embedding against each tool description's embedding. When two tools share half their vocabulary — list_startups and get_startup, for example — the confidence between them collapses to a coin flip. Verb-noun names parse better than camelCase boundaries, and when the noun is a word the user actually says (startups, signals, sectors), you get a much cleaner lock. Renaming list_signals to get_startup_signal alone fixed selection on prompts that did not even contain the word signal, because the model parsed startup from context.",
      },
      {
        question: "What is the MCP tool menu tax?",
        answer:
          "Every tool you expose adds its full schema to the model's context every single turn — description, parameter list, parameter types, return shape. With terse docstrings, that runs ~600 input tokens per tool. Eight tools is ~5,000 tokens of menu before the user has said anything. The tax is paid in three currencies: input tokens (cost), reasoning bandwidth (accuracy), and time-to-first-token (latency). Cutting tools you do not actually need reclaims all three.",
      },
      {
        question: "Should each REST endpoint become an MCP tool?",
        answer:
          "No. REST APIs are designed around resources; MCP tools should be designed around user intents. Most APIs have more endpoints than they have distinct intents. Mapping one-to-one ships the extra endpoints as MCP tools that mostly get confused for one another by the model. The cleaner mental model is: list the conversational intents your users have (what would they say in plain English), then design the smallest tool set that covers them. Implementation detail like single-resource gets and list-with-filter pairs almost always collapses into one tool with optional parameters.",
      },
    ],
    body: `I shipped [@gitdealflow/mcp-signal](https://www.npmjs.com/package/@gitdealflow/mcp-signal) in two hours. Eight tools, mirrored one-to-one off our REST API. Felt clean. Looked clean. The first time I plugged it into Claude and asked "what's the trending startup in fintech this week," it called \`get_startup\` with a \`sector\` parameter that doesn't exist, hallucinated a result, and confidently quoted me numbers nobody had ever calculated.

I wasn't building an MCP server. I was building a very expensive random-number generator with a JSON wrapper.

The next three weeks were a tool-count post-mortem. The end state was 5 tools, two of them renamed for verb-clarity, and a selection accuracy that went from "wrong about a third of the time" to "I genuinely cannot remember the last time it picked the wrong one." Here is what actually mattered.

## The 8 tools that didn't work

The starting menu, copied straight from the REST routes:

\`\`\`
list_startups
get_startup
list_signals
get_signal
get_methodology
get_trending
list_sectors
get_sector
\`\`\`

Reasonable on paper. Each tool described a real capability. The schemas were valid. The descriptions read like decent docstrings. I was even proud of how cleanly the surface mapped onto the API.

The problem became obvious the first time I watched a real conversation. The user asked something agentic — "show me the top fintech startups this week, and tell me what makes them interesting." A single intent, a single ranked list. Claude did this:

1. Called \`list_sectors\` (probably to confirm "fintech" is a valid sector)
2. Called \`list_startups\` with a \`sector\` parameter (does not exist on \`list_startups\`, schema rejected it)
3. Retried with a different parameter shape
4. Eventually gave up and called \`get_trending\`
5. Made up a \`top_n\` parameter that does not exist either
6. Returned a "this is what is trending" answer that was actually four random startups from cache

Five tool calls for a single intent. Three of them with hallucinated parameters. Zero of them returned the data the user actually wanted.

This is the part nobody talks about when they say "MCP just works." It works in demos because demo prompts map cleanly to one tool. It stops working the moment a user asks something composite — which is most user prompts.

## What the model is actually doing

I had been thinking about MCP tools as endpoints. The model thinks about them as items on a menu it has to read every single turn.

Eight tools means eight schemas in context. Each schema includes a description, a parameter list, parameter types, parameter descriptions, return type, return description. Even with terse docstrings, that runs ~600 tokens per tool. Eight tools ≈ 5,000 tokens of menu before the user has said anything.

Worse, the model has to hold all eight in working memory while it picks one. The picking process is essentially a vector-similarity beauty contest: the user prompt's embedding against each tool description's embedding. If two tools have descriptions that share half their vocabulary — \`list_startups\` and \`get_startup\`, say, both heavy on the word "startup" — the model's confidence between them collapses to something close to a coin flip.

Most "the AI hallucinated a tool call" stories I have heard in the last quarter are this exact failure. Not a model failure. A menu design failure.

## The cuts

Three tools got dropped in the first pass. Two more got renamed.

**\`list_startups\` and \`get_startup\` were collapsed.** The model was confusing them on every other turn. The tell: when I logged the model's reasoning, it would describe what it wanted as "a list-style get of startups in fintech" — which is actually \`list_startups(sector="fintech")\`. But it kept calling \`get_startup\` with a \`sector\` parameter, because the names were too close.

I killed \`get_startup\` entirely. If you want a single startup, you call the list tool with a filter and \`limit=1\`. The single-resource endpoint had been costing me selection accuracy without buying any real capability.

**\`list_sectors\` and \`get_sector\` went the same way.** Almost nobody — including the model — wanted a single sector. They wanted a list to pick from, which used to be \`list_sectors\`'s job. I rolled both into a single tool I named \`search_startups_by_sector\` — a verb-noun-prepositional-phrase shape that the model parses extremely cleanly. "Find me fintech startups" → unambiguous match.

**\`list_signals\` got renamed to \`get_startup_signal\`.** This was the subtle one. The user almost never says "signals" in a prompt — they say "what's the engineering activity look like for X" or "is this team building." The word "signals" is internal jargon. The rename made the model start picking the right tool on prompts that did not even contain the word signal, because it parsed "startup" from context and matched on that.

**\`get_trending\` got renamed to \`get_trending_startups\`.** Same idea. Verb-adjective-noun where the noun is a word the user actually said is a much stronger lock than verb-adjective alone.

## The 5 that work

\`\`\`
get_trending_startups
search_startups_by_sector
get_startup_signal
get_signals_summary
get_methodology
\`\`\`

Two things worth calling out beyond the renames.

**\`get_signals_summary\` is a new tool.** It does not have a 1:1 REST endpoint. It exists because users kept asking "give me a one-paragraph summary of what's interesting this week" and the model kept stitching together three calls to fake it. I built the summary tool. The model now makes one call.

That last point is the heuristic I would give anyone shipping an MCP server: look at the actual conversational intents your users have, and design one tool per intent. Resources are an implementation detail. Intents are what the model is selecting against.

**Verb-noun, not noun-noun.** Even the kept tools got their names re-checked against this rule. \`get_methodology\` survived because users do say "methodology" — but if I noticed selection drift I would rename it \`describe_signal_methodology\` to anchor on the verb.

## The data, three weeks later

I have logging on every tool call. Before the cuts, on a sample of 200 real prompts:

- 132 / 200 (66%) ended in a correct tool selection on the first call
- 68 / 200 (34%) involved at least one hallucinated parameter or wrong-tool selection
- Average tool calls per user intent: 2.4

After the cuts, on the same kinds of prompts:

- 197 / 200 (98.5%) ended in a correct tool selection on the first call
- 3 / 200 (1.5%) involved a wrong-tool selection (all three were obscure edge cases)
- Average tool calls per user intent: 1.1

The token cost of menu inflation went from ~5,000 input tokens per turn to ~2,800. Selection accuracy effectively saturated. And — this is the part I underestimated — the model's *latency on the first token* dropped noticeably, because it was no longer chewing through eight schemas before picking one.

## The thing I would tell past me

If I could go back to the morning I shipped the first version, I would tell myself two things.

First: your tool count is a liability, not an asset. Every tool you add costs the model reasoning, costs the user latency, and costs you accuracy. Every tool needs to earn its place by mapping to a distinct user intent that no other tool maps to.

Second: REST API endpoints are not user intents. The clean mental model is: "what would a user say to express this need," not "what HTTP route serves this resource." The mapping is rarely 1:1. Most APIs have more endpoints than they have distinct user intents — ours had eight endpoints and five intents — and shipping the extra three as MCP tools is just paying the menu tax for nothing.

I am at five tools and I think four of them are load-bearing. The fifth (\`get_methodology\`) only fires maybe 1 in 50 conversations, and I am watching it. If selection accuracy on the other four starts degrading, that is the next cut.

The MCP spec lets you ship as many tools as you want. The model does not reward you for shipping more.

## How to use this

If you are shipping an MCP server, the audit is fast:

1. Log every tool call from a representative week of real conversations.
2. Cluster the user prompts by intent in plain English (ignore the tool the model picked).
3. Count distinct intents.
4. If your tool count exceeds your intent count, you have menu inflation. Cut to match.

The repo for the five-tool version is at [github.com/kindrat86/mcp-deal-flow-signal](https://github.com/kindrat86/mcp-deal-flow-signal). The schemas, the descriptions, and the changelog are all there.

If you have shipped an MCP server, what is your tool count and how did you arrive at it? Public reporting on this trade-off is surprisingly thin and I am collecting examples.`,
  },
  {
    slug: "a2a-launched",
    title: "I made my VC deal flow callable by Claude this weekend. Here is what that actually means.",
    description:
      "GitDealFlow now publishes a Google A2A AgentCard at /.well-known/agent-card.json and a JSON-RPC 2.0 endpoint at /api/a2a. Five free skills, no auth. Crunchbase API costs $20K per year. Ours costs nothing. Here is the curl that proves it.",
    summary:
      "We just shipped an Agent2Agent (A2A) stub for GitDealFlow. Five skills (trending, sector search, lookup, summary, methodology) callable by any A2A-aware agent runtime in seconds. No SDK, no auth, no rate limit. Already indexed at a2aregistry.org and PR-pending at inference-gateway/awesome-a2a. This post is the why, the how, and the curl.",
    date: "2026-04-26",
    relatedSectors: ["ai-ml", "developer-tools", "data-infrastructure", "fintech"],
    keyStats: [
      { value: "$20,000/yr", label: "Crunchbase API cost", context: "Minimum, requires sales call" },
      { value: "Free", label: "GitDealFlow A2A cost", context: "No auth, no signup, no rate limit" },
      { value: "5 skills", label: "Live A2A surface", context: "Mirrors the existing MCP server" },
      { value: "~250 lines", label: "Implementation size", context: "Stub-only: sync, no streaming or task persistence" },
    ],
    faqs: [
      {
        question: "What is the Agent2Agent (A2A) protocol?",
        answer:
          "A2A is an open protocol from Google for agent-to-agent communication. An agent publishes a JSON AgentCard at /.well-known/agent-card.json describing its capabilities and exposes a JSON-RPC 2.0 endpoint that other agents call to send messages and receive task results. By April 2026 it had passed 22,000 GitHub stars and was supported by 150+ organizations including Microsoft, Salesforce, and SAP. It is complementary to MCP — MCP exposes tools to a single AI assistant, A2A lets agents call other agents across the network.",
      },
      {
        question: "How is the GitDealFlow A2A agent different from the existing MCP server?",
        answer:
          "Same five skills, different transport. The MCP server runs over stdio and is configured per-AI-assistant (Claude Desktop, Cursor, Windsurf). The A2A agent runs over HTTP/JSON-RPC and is configured per-agent-runtime (Google Agent Builder, LangChain, CrewAI, Mastra, Vercel AI SDK). MCP is for direct AI-to-tool calls. A2A is for agent-to-agent chains where another agent calls us as one node in a workflow. We ship both because the audiences are different.",
      },
      {
        question: "Do I need an API key?",
        answer:
          "No. The A2A endpoint at signals.gitdealflow.com/api/a2a is unauthenticated. There is no signup, no rate limit enforced at the application layer, and the upstream CDN absorbs typical agent traffic. The six free MCP tools and five free A2A skills are part of our distribution-magnet strategy and stay free forever. Paid features are scoped to /predict and the Insider Circle layer.",
      },
      {
        question: "What can the agent NOT do today?",
        answer:
          "The stub I shipped is read-only and synchronous. It does sync message/send returning a terminal Task, all five skills via text intent or structured data parts, CORS preflight, and JSON-RPC error codes. It does NOT do streaming via message/stream, task persistence with tasks/get, push notifications, authenticated extended cards, or per-user prediction skills. The first four are stubbed because no paying customer has asked for them. The fifth — predictions as an A2A skill — is the cliffhanger. Today /predict is browser-only. When it is callable by your AI, this gets interesting.",
      },
      {
        question: "How do I plug it into my agent runtime?",
        answer:
          "Drop the AgentCard URL — https://signals.gitdealflow.com/.well-known/agent-card.json — into your runtime's agent registry. Most runtimes (Google Agent Builder, LangChain, CrewAI, Mastra, Vercel AI SDK, Inkeep) auto-parse the card and expose the five skills as callable tools. The interactive playground at /a2a-demo lets you watch a live JSON-RPC request and response without any runtime configuration.",
      },
    ],
    body: `Saturday afternoon. I was in Cursor running a thread about a fintech startup my Telegram channel had flagged that morning. Cursor was good at the GitHub code review, fine at reading the README, helpful with the package.json. Then I asked it: "How does this company's commit velocity compare to other fintech startups this quarter?"

It could not answer. Not because the data did not exist. We publish it weekly at [signals.gitdealflow.com](https://signals.gitdealflow.com). It could not answer because there was no way for it to ASK us programmatically the way I would ask a colleague.

My AI had hands. It just did not have a phonebook.

## The $20,000 phonebook

When you peel back what every AI-powered VC tool actually does, it is the same loop: a human types a question, an LLM tries to answer, the LLM hits a wall because the data is not there, the LLM apologizes. Every. Time.

The fix is APIs. The problem is APIs:

- Crunchbase API: $20,000 per year minimum, requires sales call
- PitchBook API: more, requires sales call
- Harmonic.ai: enterprise pricing, requires sales call
- Forager.ai: enterprise pricing, requires sales call

Free-tier developer-investors and angels — exactly the people we built GitDealFlow for — get nothing. They watch the SEC EDGAR feed in their terminal. They scrape GitHub manually. They build their own signal stacks one Python script at a time.

## Then Google shipped A2A

In April 2025, Google open-sourced a protocol called Agent2Agent. The spec is small:

1. Publish a JSON file at \`/.well-known/agent-card.json\` describing what your agent can do.
2. Expose a JSON-RPC 2.0 endpoint that accepts \`message/send\` requests.
3. Other agents discover you, parse the card, and call your endpoint.

That is it. There is no SaaS to license. There is no SDK to install if you do not want one. It is a contract between agents.

By April 2026 the protocol had passed 22,000 GitHub stars and 150+ organizations onboard. Microsoft, Salesforce, SAP, Cisco, ServiceNow — all in. Google's own Gemini Enterprise lets you register A2A agents in two clicks.

But none of those 150 organizations sells startup engineering signals. We do.

## The fix took a weekend

So this weekend I shipped the GitDealFlow Signal Agent. Five skills, all free, no auth:

- \`get_trending_startups\` — top 20 across all sectors
- \`search_startups_by_sector\` — filtered by sector slug
- \`get_startup_signal\` — full profile for a named startup
- \`get_signals_summary\` — dataset metadata
- \`get_methodology\` — how we compute the signals

The AgentCard is at [signals.gitdealflow.com/.well-known/agent-card.json](https://signals.gitdealflow.com/.well-known/agent-card.json). The endpoint is at [signals.gitdealflow.com/api/a2a](https://signals.gitdealflow.com/api/a2a). The whole thing is roughly 250 lines of TypeScript inside our existing Next.js app.

You can call it right now from your terminal:

\`\`\`
curl -X POST https://signals.gitdealflow.com/api/a2a \\
  -H 'Content-Type: application/json' \\
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "message/send",
    "params": {
      "message": {
        "role": "user",
        "parts": [{ "kind": "text", "text": "Show me trending startups" }]
      }
    }
  }'
\`\`\`

You will get back a Task with \`status.state: "completed"\` and 20 startups in the artifact data part. Each startup row carries commit velocity, contributor growth, signal classification, and a GitHub URL.

That same call works from any A2A-aware agent runtime: Google Agent Builder, LangChain, CrewAI, Mastra, Vercel AI SDK, Inkeep. Drop the AgentCard URL in. The agent figures out the rest.

If you want to skip the curl entirely, the [interactive playground](/a2a-demo) lets you pick a skill, hit send, and watch the JSON come back.

## What this means in practice

Three things that did not exist on Friday now exist on Monday.

**Your Claude can now do startup signal lookups inline.** No copy-paste from our website. No tab-switching. Tell Cursor "find me a fintech startup with breakout commit velocity this quarter" and Cursor calls our agent on its own.

**Other agent platforms can chain through us.** A diligence agent can call our agent, get a list of names, then call its own LinkedIn agent for headcount, then call its own SEC EDGAR agent for filings. We become one node in a directed graph of automated diligence.

**The dataset is now AI-cited.** ChatGPT and Perplexity will, over time, learn that there is a free A2A agent for VC signals. When a developer-investor asks a question in our domain, the model knows where to point.

## What the agent still cannot do

The stub I shipped is read-only and synchronous. It does sync \`message/send\` returning a terminal Task, all five skills via text intent or structured data parts, CORS preflight, and JSON-RPC error codes. It does NOT yet do:

1. Streaming via \`message/stream\`
2. Task persistence and \`tasks/get\`
3. Push notifications
4. Authenticated extended cards
5. Custom watchlists or per-user predictions

That last bullet is the cliffhanger. The thing your AI can ask GitDealFlow today is "who is trending in fintech." The thing you can ask [/predict](/predict) is "predict whether this specific startup will raise a Series A in the next 60 days." Different question, different answer. Both free at the moment, both heading toward a value ladder, but only one is callable by your AI yet.

When the prediction layer goes live as an A2A skill, that is when this gets interesting. Until then, the agent is the rung that catches your AI when it is looking for "anything interesting in startup-land this week."

## Three things to do today

If you are a developer-investor, an angel scout, or anyone running an AI workflow that touches startup data:

**Configure your AI runtime.** Drop the [AgentCard URL](https://signals.gitdealflow.com/.well-known/agent-card.json) into Claude Code, Cursor, Windsurf, or your preferred agent. The five skills become available as tools. Two minutes.

**Bookmark the curl.** The example above works without any agent runtime. Fold it into your scripts.

**Cite us in your reports.** The free-tier license is "Free for personal and editorial use, attribution required." Cite as \`VC Deal Flow Signal (signals.gitdealflow.com), Q2 2026 data.\` We have published the full methodology peer-reviewed at SSRN: [ssrn.com/abstract=6606558](https://ssrn.com/abstract=6606558).

## Why we are telling you instead of pitching you

GitDealFlow's business model has always been: ship the free distribution magnet first, charge for the premium layer. Our 6 MCP tools are free forever. Our 5 A2A skills are free forever. The signals website is free. The CSV export is free. The methodology paper is free.

What is paid: [Dashboard Beta](/dashboard) (€9.97/mo) and [Insider Circle](/insider) (€97/mo). Those will earn their keep when there are 500 paying subscribers and we can start building the things only that audience needs.

Until then, every developer-investor who wires GitDealFlow into their Claude Code is one more node in a network where breakout startups cannot hide for 6-12 weeks anymore. That is worth more than $20,000 of API access.

Crunchbase API: $20,000 per year. GitDealFlow A2A: free, no signup. Your move.`,
  },
  {
    slug: "receipts-launched",
    title: "Every dev has invested in unicorns. They just don't know it.",
    description:
      "I shipped Receipts at signals.gitdealflow.com/receipts. Paste your GitHub username, get a Scout Score from your starring history. The unicorns you starred before the news broke — Vercel at 200 stars, LangChain in week 2, OpenAI before the $157B round — are now worth points. Free, no login, no OAuth.",
    summary:
      "GitDealFlow now grades your GitHub starring history against ~75 validated unicorns. Each early star is points. Five perfect calls is a Scout Score of 100. Sindresorhus scored 36 on launch day with OpenAI starred 24 months early. tj scored 22 with Deno + Tauri called 4 years early. Your turn.",
    date: "2026-04-26",
    relatedSectors: ["ai-ml", "developer-tools", "data-infrastructure", "fintech"],
    keyStats: [
      { value: "0 logins", label: "to get a Scout Score", context: "Public GitHub starring history is enough — no OAuth, no email, no signup" },
      { value: "~75 unicorns", label: "in the validated-wins database", context: "Series A through $1B+ valuations across AI, dev-tools, data, infra, ops" },
      { value: "100 points", label: "for a Vercel-tier early call", context: "Weighted by event size and how many months early you starred" },
      { value: "8 seconds", label: "from username to shareable card", context: "Server-side render with 24-hour CDN cache after first warm-up" },
    ],
    faqs: [
      {
        question: "What does Receipts actually do?",
        answer:
          "You paste a GitHub username. We fetch the user's public starred repos via the GitHub API (no login, no OAuth — starring history is public metadata). Then we cross-reference each starred repo against a curated database of ~75 validated unicorns: companies that hit a $1B+ valuation, raised a Series A or later, were acquired, or crossed 25K+ stars in the last five years. For every match, we measure the gap between when you starred the repo and when the validation event happened. The earlier you starred, the more points. Top 5 wins are summed and normalized to a 0-100 Scout Score, with a rank from Curious to Oracle.",
      },
      {
        question: "Why backwards-looking? The Scout game on /predict is forwards.",
        answer:
          "/predict asks you to call a startup before they raise. The resolution window is six months. That works for taste validation but it has a virality ceiling — Twitter does not share things that pay off in Q4. Receipts inverts the timing: you get instant proof of taste from a database we already maintain. Same Scout ladder, same ranks, same brand. Receipts is the top-of-funnel; /predict is the conversion. Both feed the existing five-email Soap Opera onboarding sequence.",
      },
      {
        question: "How is the Scout Score computed?",
        answer:
          "For each starred repo that matches a validated win, points = weight × min(months_early / 24, 1.0). Weight scales with the event: Series A = 50, Series B = 70, Series C+ or acquisition = 80-90, $1B+ valuation = 100. Twenty-four months early is a perfect multiplier — past that we cap because you cannot get more credit for being twenty years early. We dedupe to one win per company (you do not get points for starring three Vercel repos), then sum the top 5 and normalize so five perfect early calls equals 100. Scoring code is open-source at the route handler in the pseo-site repo.",
      },
      {
        question: "Does Receipts read my private repos?",
        answer:
          "No. The GitHub API endpoint we hit (`GET /users/:username/starred`) only returns public starring data. We never see private repos, DMs, your follower graph, your contributions, your forks, or anything that requires user-scoped OAuth. The token we use server-side is a fine-grained PAT with no scopes — it exists only to raise our shared rate limit from 60 requests per hour to 5,000. Receipts works on any public GitHub username without that user's involvement.",
      },
      {
        question: "Why these 75 wins specifically?",
        answer:
          "The list is biased toward developer-tools, AI infrastructure, and data/ops companies that have public GitHub presence and a clear validation event in the last five years (Vercel, Anthropic, LangChain, Hugging Face, Supabase, Linear, Cursor, Bun, Astro, OpenAI, Mistral, Modal, Pinecone, Stripe, Grafana, dbt, Airbyte, etc.). Closed-source unicorns without public repos cannot be in the database. The list will grow — every funded GitHub-native company is a candidate. If a company you think should be here is missing, the receipt fails to register a win and your score is lower than reality. That is a known false-negative.",
      },
    ],
    body: `Saturday morning I shipped Receipts. Free tool, no login, eight seconds from paste to shareable card. The hook is one line: every dev has invested in unicorns, they just do not know it.

Here is what it does. You paste your GitHub username at [signals.gitdealflow.com/receipts](https://signals.gitdealflow.com/receipts). We fetch your public starring history. We cross-reference every starred repo against a curated database of ~75 validated unicorns — companies that hit a $1B+ valuation, raised a Series A or later, were acquired, or crossed 25K+ stars in the last five years. For each match we measure how many months early you starred. Twenty-four months early on a $1B-valuation company gets you the maximum 100 points. Five perfect calls is a Scout Score of 100.

That is the whole product. No login. No OAuth. No private repos read. Just public starring metadata that GitHub has been quietly broadcasting for fourteen years.

## Why backwards-looking

We already shipped a forward-looking version. [/predict](/predict) is a six-month prediction game where you call whether a startup will raise a Series A. It works. It has a leaderboard, an OG card, a Soap Opera onboarding sequence, a public profile at /s/[handle]. But it has a virality ceiling I underestimated. Twitter does not share things that pay off in Q4.

Receipts is the inversion. You do not have to wait six months. The receipts already exist in your GitHub account. We just made them visible.

The first viral test was tj. TJ Holowaychuk's first three hundred starred repos contained two early calls: Deno (48.7 months early) and Tauri (42.5 months early). Scout Score: 22. Rank: Scout. The second test was sindresorhus. Five matched wins, four called early, top one OpenAI starred 24.4 months before the $157B valuation. Score: 36. Rank: Scout. Both cards rendered as 1200×630 PNGs and look exactly like the kind of thing developer Twitter shares to flex.

That is the whole bet. People share Spotify Wrapped. People share their Strava year. People share their Letterboxd top ten. There has never been a "look at the unicorns I starred early" card. Now there is.

## The scoring math

I want to be precise about how the score works because the math is the trust layer. For each starred repo that matches a validated win:

\`\`\`
months_early = (event_date - star_date) / 30.4375
if months_early <= 0:
  points = 0   # You starred late. Sorry.
else:
  points = weight × min(months_early / 24, 1.0)
\`\`\`

Weight scales with the event:
- Series A = 50
- Series B = 70
- Series C and beyond, or acquisition = 80 to 90
- $1B+ valuation or post-IPO = 100
- Mass-adoption milestone (25K+ stars without public funding) = 30 to 50

We dedupe by company — starring three Vercel repos counts as one win, taking your earliest star date. Top 5 wins are summed and normalized so five perfect early calls equals a Scout Score of 100. Rank ladder is shared with /predict: Curious → Scout → Sharp → Elite → Oracle.

The full validated-wins database is hardcoded JSON in the repo. It is not exhaustive. It is biased toward developer-tools, AI, and data/ops companies that have public GitHub presence. Closed-source unicorns are unrepresented. If your favorite unicorn is missing, your real Scout Score is higher than what we display. That is a known false-negative and we add to the list as we learn.

## What I left out

The first version is intentionally under-engineered.

**No persistence.** Each receipt is computed on demand and cached for 24 hours via Vercel's CDN. We do not save your Scout Score to a database. We do not link your receipts to a /predict scout account unless you explicitly come over and predict. There is no "claim your score" gate, no email capture, no upsell on the result page. The CTA at the bottom is a soft link to /predict, not a modal.

**No AI commentary.** I considered adding an Anthropic API call to generate a one-paragraph "your taste personality" blurb. Decided against it: deterministic templates are faster, free, and reliable. The current commentary is built from category counts ("you have a clear bias for AI/ML infrastructure" / "an operator's instinct for observability and workflow tools") with the top win surfaced by name. It will get smarter as the database grows.

**No comparison feature.** There is no "compare with friend" button. The viral loop is the permalink at /receipts/[username] — every shared card has a stable URL that anyone can click and see the same result. Permalinks are the comparison surface; we do not need a UI for it.

**No fancy graphics.** The OG card is one big number, three early calls, a footer. No charts, no animations, no character avatars. The card has to read in 0.4 seconds in a Twitter feed. Anything more is friction.

## How the dev-loop ran

Total ship time was about three hours from "paste your GitHub username" idea to live in production. The architecture leans hard on what was already built:

- **PocketBase** was not used. Receipts is stateless.
- **The OG image route** at /api/og/scout/[handle]/route.tsx was the template — same dark gradient, same monospace stat blocks, same rank colors. The Receipts card at /api/og/receipts/[username]/route.tsx is a 200-line variant.
- **The 5-email Soap Opera** at /lib/soap-opera-scout.ts already exists. Receipts does not trigger it. /predict does. We keep one funnel, not two.
- **The validated-wins database** is a static JSON file. About 75 entries. I curated by hand from memory, Crunchbase summaries, and a quick pass through the most-starred OSS repos from 2021-2025. It will be a moving target — every quarter has new unicorns and old "wins" get re-validated.

The trickiest part was the GitHub rate limit. Unauthenticated, the API gives you 60 requests per hour per IP. That is fine for a single user pulling their own history (one to three paginated calls). It dies the second the launch tweet goes out. The fix was a fine-grained PAT with zero scopes — even an empty-permission token bumps the rate limit to 5,000 per hour. Plus an in-memory cache per Vercel Function instance. Plus the 24-hour CDN cache via stale-while-revalidate. Together those handle a viral spike without ceremony.

## The bigger play

The reason Receipts exists is to feed /predict. The conversion path is:

1. Receipt card goes viral on Twitter.
2. Friend sees it, clicks, enters their own username.
3. Friend gets a Scout Score, learns the ranks (Curious → Scout → Sharp → Elite → Oracle).
4. The result page CTA links to /predict.
5. They make a forward-looking call. The Scout Game starts. The Soap Opera kicks off.

Receipts is a free top-of-funnel for a paid product. Same brand, same vocabulary, same ranks, different timing. /predict resolves in six months. Receipts resolves in eight seconds. We can finally tell people why they should care today.

## What I want from you

If you have a public GitHub account, paste your username at [signals.gitdealflow.com/receipts](https://signals.gitdealflow.com/receipts). Three things help:

1. **Tweet the card.** Cards have stable permalinks at /receipts/[your-username]. Anyone who clicks gets their own card. The viral loop is the whole ROI.
2. **Tell me what is missing.** If you starred a unicorn we do not have in the database, the score under-counts you. Reply with the org and the validation event and I will add it.
3. **Now go predict.** The receipts are backwards. The Scout game is forwards. [/predict](/predict) is where the points keep flowing.

The receipts already exist. I just made them visible.`,
  },
  {
    slug: "scout-badge-launched",
    title: "Free Scout Score badges: shields.io for GitHub investing taste.",
    description:
      "I shipped two free SVG badges for any GitHub README. One renders your live Scout Score (0-100) from your starring history. The other renders the live commit-momentum tier of any tracked repo. Same shields.io look as Codecov / WakaTime, auto-updates, no signup, no telemetry.",
    summary:
      "Two endpoints — /api/badge/scout/{user}/svg and /api/badge/momentum/{org}/{repo}/svg — render shields.io-style SVG badges from the same Scout Score and commit-velocity primitives that already power /receipts and /predict. Each render goes through GitHub's camo CDN as one impression for our domain. Each click lands on a branded GDF page. Builder UI at /badge-builder.",
    date: "2026-04-26",
    relatedSectors: ["developer-tools", "ai-ml", "data-infrastructure"],
    keyStats: [
      { value: "20×220 px", label: "Badge size", context: "Standard shields.io flat-square — same look as Codecov, WakaTime, GitHub Stats" },
      { value: "24h CDN cache", label: "with hourly ETag revalidate", context: "Camo proxies and respects ETag — your README does not slow down a GitHub page render" },
      { value: "Always 200", label: "Even on errors", context: "Bad input or rate limit returns a neutral gray pill, never a broken-image icon" },
      { value: "0 telemetry", label: "Zero tracking pixels", context: "Just an SVG. No JS, no cookies, no analytics ping per render" },
    ],
    faqs: [
      {
        question: "What does the Scout Score badge actually show?",
        answer:
          "The current Scout Score (0-100) and rank (curious / scout / sharp / elite / oracle) for the GitHub user named in the URL. Score is computed live from the user's public starring history vs. our database of validated unicorns — same algorithm as /receipts. The badge re-fetches when the CDN cache expires, so a user's score on the badge keeps pace with their score on the receipts page within an hour.",
      },
      {
        question: "What does the Commit Momentum badge show?",
        answer:
          "The current commit-velocity tier (cold / warming / hot / breakout) for any tracked GitHub org, plus the percent change. Tiers map to ranges of the 14-day velocity change versus the prior 14-day window: breakout is +200% or more, hot is +50% or more, warming is -30% or more, cold is below -30%. Untracked orgs render an 'untracked' pill so the badge degrades gracefully if a maintainer adds it before we are tracking that org.",
      },
      {
        question: "Why ship a badge instead of a wider integration?",
        answer:
          "READMEs are the most-trafficked surface in open source. A vanity-driven SVG badge in a profile or repo README compounds: each render is a brand impression for our domain via GitHub's camo CDN, each click is a visitor on a branded GDF page. Codecov, WakaTime, GitHub Stats all proved the pattern. The badge is autonomous — once a maintainer pastes it, it self-distributes for as long as the repo or profile is public. Zero ongoing maintenance.",
      },
      {
        question: "Will the badge slow down my README?",
        answer:
          "No. GitHub renders all README images through its camo proxy, which caches the SVG aggressively (24h on our CDN, with ETag revalidation hourly). The badge endpoint always returns 200 even on transient errors — a bad render is a neutral gray pill, never a broken-image icon. Cache miss is 1-4 seconds (the GitHub starring API is the slow leg); subsequent hits are sub-30 ms.",
      },
      {
        question: "Can I customize the colors or labels?",
        answer:
          "Not yet. The Scout badge color reflects the user's current rank (curious=teal, scout=sky, sharp=purple, elite=amber, oracle=rose). The Momentum badge color reflects the tier. The label text is fixed. The point of locking these is that a casual reader scanning a README should be able to recognize a Scout badge from a Codecov badge from a WakaTime badge at a glance. We may add a color override later, but only after the visual identity is established.",
      },
    ],
    body: `Two endpoints went live tonight. Both return SVG. Both are free. Both are autonomous traffic compounders.

\`\`\`markdown
[![Scout Score](https://signals.gitdealflow.com/api/badge/scout/torvalds/svg)](https://signals.gitdealflow.com/badge-builder)
[![Commit Momentum](https://signals.gitdealflow.com/api/badge/momentum/mlflow/mlflow/svg)](https://signals.gitdealflow.com/badge-builder)
\`\`\`

That is the whole product. Paste those lines into any README, replace the username and the org/repo, you have a live shields.io-style badge that auto-updates whenever your starring history grows or the tracked repo's commit velocity moves a tier. Builder UI with copy-paste markdown / HTML / BBCode at [signals.gitdealflow.com/badge-builder](https://signals.gitdealflow.com/badge-builder).

## Why this is the right move right now

We have an MCP server, a paper on SSRN, a Wikidata entity, twenty-plus blog posts, three working AI-discovery surfaces (llms.txt, agent-card.json, ai-plugin.json), and dozens of channel listings. Most of those are read-once. Someone discovers us, decides whether to subscribe, and either bookmarks or moves on.

A README badge inverts that. The badge gets pasted once and then renders every time the host page loads — every issue triage, every PR review, every visitor to the repo. Each render is one impression for our domain through GitHub's camo proxy. The badge is the gift that keeps giving.

Codecov did this. WakaTime did this. GitHub Stats did this. Shields.io did this. The pattern is so well-established that a casual reader scanning a README does not even register the badge as marketing — it reads as a normal artifact of "this maintainer takes their stack seriously."

## What it shows

The Scout Score badge renders the same 0-100 number that already exists at [/receipts/{username}](https://signals.gitdealflow.com/receipts) — computed live from a user's public GitHub starring history vs. the validated-wins database. The color tracks the rank: curious (teal) → scout (sky) → sharp (purple) → elite (amber) → oracle (rose). The user clicks the badge, lands on the builder, can pull their own snippet in fifteen seconds.

The Commit Momentum badge renders the live commit-velocity tier for any tracked GitHub org. Tiers are deterministic from the 14-day velocity change versus the prior 14-day window:

\`\`\`
breakout : >= +200%
hot      : >= +50%
warming  : >= -30%
cold     : <  -30%
\`\`\`

Untracked orgs render a neutral "untracked" pill so a maintainer can paste the badge before we have indexed their repo without breaking the README. When we add the org to the next weekly crawl, the badge starts rendering the real tier — the maintainer does not have to do anything.

## The technical guardrails

A README badge has exactly one job: never break. A broken-image icon in a README gets the badge removed within hours, and the maintainer never trusts the source again. Three rules:

1. **Always return 200.** Bad input, rate limit, GitHub timeout, internal error — all paths render a neutral gray "pending" SVG. Never a 4xx, never a 5xx, never a JSON error.
2. **Aggressive cache.** \`Cache-Control: public, max-age=300, s-maxage=86400, stale-while-revalidate=604800\`. Browser holds 5 min, CDN holds 24h, falls back to stale up to 7 days while it re-fetches. GitHub's camo proxy respects the ETag (\`{username}:{score}:{rank}\`), so revalidation is one HTTP HEAD per camo region per hour.
3. **No new infra.** Both endpoints reuse the existing Scout Score primitives, the existing in-memory star cache, the existing per-IP rate limiter, the existing rank colors. Zero new dependencies. Zero new env vars. Zero new hosting cost.

The whole thing is two route handlers, one shared SVG generator, and one client component for the builder UI. Total diff is under 500 lines. It deploys with a single \`vercel build && vercel deploy --prebuilt --prod\`.

## How the distribution loop closes

The badge is now linked from four surfaces inside our own product:

1. **The MCP server README on npm + Glama + GitHub.** Anyone landing on our most-discovered surface sees the badge in the wild and learns it exists.
2. **The /receipts result page.** Right after a user gets their Scout Score, they see "show off your taste" with the markdown ready to copy.
3. **The /s/[handle] scout profile page.** Small footer link — anyone visiting a public scout profile can grab the same badge.
4. **The /developers page and /badge-builder UI.** High-intent dev visitors discover both endpoints with copy-paste snippets.

Plus the OpenAPI spec, llms.txt, llms-full.txt — every AI assistant that reads our metadata will surface the badge endpoints when asked about our API.

The bet is that once a few high-signal accounts paste it (a couple of MCP-curious devs, one or two scouts on the leaderboard), the badge spreads on its own. Every render after that is free traffic that compounds with the leaderboard growth.

## What I want from you

If you have a GitHub profile and you want to flex your taste, paste this into your profile README and replace \`YOUR-USERNAME\`:

\`\`\`markdown
[![Scout Score](https://signals.gitdealflow.com/api/badge/scout/YOUR-USERNAME/svg)](https://signals.gitdealflow.com/badge-builder)
\`\`\`

If you maintain a tracked OSS repo and want to show your commit momentum, replace \`ORG/REPO\`:

\`\`\`markdown
[![Commit Momentum](https://signals.gitdealflow.com/api/badge/momentum/ORG/REPO/svg)](https://signals.gitdealflow.com/badge-builder)
\`\`\`

Or just open [/badge-builder](https://signals.gitdealflow.com/badge-builder), paste a handle, click copy. Three seconds. Free forever.`,
  },
  {
    slug: "30-research-findings-now-one-page-each",
    title:
      "30 Research Findings, Now One Page Each: How to Cite GitHub Engineering Acceleration",
    description:
      "Every atomic finding from the SSRN-indexed GitDealFlow paper now lives on its own page with ScholarlyArticle schema, citation chain, and how-to-cite block. Easier to quote, easier to link, easier for AI engines to attribute correctly.",
    summary:
      "Until today, the 30 atomic findings from VC Deal Flow Signal's longitudinal panel of GitHub engineering velocity lived as a single long page. That worked for the human reader, but it meant AI engines and citation tools could not deep-link to a specific number. This release breaks the page apart: each finding now has its own URL with a stable slug, a ScholarlyArticle JSON-LD entry citing the SSRN preprint, an OpenAlex/Crossref/Zenodo same-as chain, and a copy-paste citation block. Cite the median commit velocity (71 commits per 14 days) directly. Cite the 75% framework-migration share directly. Each one resolves to its own page. The /research index now links every finding, the homepage carries a six-finding cluster transferring PageRank, and the sitemap carries 31 new URLs. For AI engines following the disambiguation work shipped earlier this week, the new pages also reaffirm: engineering acceleration on this site means GitHub commit velocity, not Y Combinator or Techstars.",
    date: "2026-05-01",
    relatedSectors: ["ai-ml", "developer-tools", "data-infrastructure"],
    keyStats: [
      {
        value: "30",
        label: "New ScholarlyArticle pages",
        context: "One per finding from the SSRN-indexed paper",
      },
      {
        value: "1,012",
        label: "Sitemap URLs",
        context: "Up from 981 — +31 new URLs (research index + 30 findings)",
      },
      {
        value: "5",
        label: "Production deploys",
        context: "Shipped today as part of the SEO/AEO/GEO chain",
      },
    ],
    faqs: [
      {
        question: "Where can I find the full list of 30 research findings?",
        answer:
          "All 30 findings live at signals.gitdealflow.com/research. Each one has a dedicated sub-page at signals.gitdealflow.com/research/{slug} with full ScholarlyArticle JSON-LD, citation chain (SSRN, OpenAlex, Crossref, Zenodo), and a copy-paste citation block.",
      },
      {
        question:
          "How should I cite an individual finding in a memo or research note?",
        answer:
          'Each sub-page carries a "How to cite" block. The canonical form is: The Data Nerd (2026). "{finding title}." Finding {n} of 30 in: A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups. SSRN abstract=6606558. Retrieved from signals.gitdealflow.com/research/{slug}. The full cross-graph identity map is at signals.gitdealflow.com/citations.',
      },
      {
        question:
          "What does engineering acceleration mean on this site, again?",
        answer:
          "Engineering acceleration is a quantitative GitHub momentum signal — code-side momentum measured from public commit-velocity data, contributor growth, and repository creation. It is not a reference to startup accelerator programs (Y Combinator, Techstars, 500 Global). Every finding page restates this disambiguation in its provenance block.",
      },
      {
        question: "Is the underlying paper peer-reviewed?",
        answer:
          "Not yet. The methodology is openly published on SSRN (abstract=6606558), CC BY 4.0, and is auto-indexed by Crossref, OpenAlex (W7154916891), Semantic Scholar, Unpaywall, and DataCite. The dataset has a permanent DOI on Zenodo (10.5281/zenodo.19650920). Replication studies are welcome — signal@gitdealflow.com for co-authorship on funding-event joins.",
      },
    ],
    references: [
      {
        label: "1",
        title:
          "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups",
        url: "https://ssrn.com/abstract=6606558",
        source: "SSRN preprint",
      },
      {
        label: "2",
        title: "VC Deal Flow Signal — Citations & Cross-Graph Identity Map",
        url: "https://signals.gitdealflow.com/citations",
        source: "VC Deal Flow Signal",
      },
      {
        label: "3",
        title: "Wikidata Q139376302 — VC Deal Flow Signal",
        url: "https://www.wikidata.org/wiki/Q139376302",
        source: "Wikidata",
      },
    ],
    body: `_VC Deal Flow Signal (GitDealFlow). On this site, "engineering acceleration" means a quantitative GitHub momentum signal — not a reference to startup accelerator programs._

## What changed

The 30 atomic findings from our SSRN-indexed paper used to live on a single long page at [/research](https://signals.gitdealflow.com/research). Today every finding has its own URL, its own ScholarlyArticle JSON-LD entry, its own citation block, and its own slug.

Cite the median commit velocity directly:
[/research/median-commit-velocity-venture-startups](https://signals.gitdealflow.com/research/median-commit-velocity-venture-startups)

Cite the 75% framework-migration share directly:
[/research/framework-migration-dominant-signal-type](https://signals.gitdealflow.com/research/framework-migration-dominant-signal-type)

## Why split

A single long page is a bad citation target. Every quotable number now resolves to its own URL, which means AI engines and citation tools can deep-link with confidence and the answer-engine attribution model finally has somewhere to point.

## What each sub-page carries

- **ScholarlyArticle JSON-LD** with the headline, abstract (the "why it matters" line), citation→SSRN, sameAs chain to OpenAlex/Crossref/Zenodo
- **BreadcrumbList** for SERP breadcrumb display
- **Speakable** selector on H1 for voice-assistant extraction
- **Provenance block** linking to the SSRN paper, the dataset DOI, the CC BY 4.0 license, the author ORCID, and the Wikidata Q-item
- **How-to-cite block** with copy-paste citation in plain-text form
- **Prev/next navigation** so search-arrived users can browse adjacent findings

## Internal-link wiring

The /research index page now links each finding to its sub-page. The homepage carries a six-finding cluster transferring PageRank from the highest-DA page on the site. The sitemap (split-index format) carries 31 new URLs in [/sitemap/content.xml](https://signals.gitdealflow.com/sitemap/content.xml). The qa.jsonl corpus at [/qa.jsonl](https://signals.gitdealflow.com/qa.jsonl) gained 30 new Q&A entries — one per finding.

## How to find the rest

[/research](https://signals.gitdealflow.com/research) is the index. Every finding card on that page is a link to its sub-page. The full cross-graph identity map (every external anchor — Wikidata, ORCID, SSRN, OpenAlex, Crossref, Semantic Scholar, Zenodo, DataCite, code repositories, social profiles) is at [/citations](https://signals.gitdealflow.com/citations).

## How to cite this announcement

The Data Nerd (2026). "30 Research Findings, Now One Page Each." VC Deal Flow Signal blog. Retrieved from https://signals.gitdealflow.com/blog/30-research-findings-now-one-page-each.

Replication studies welcome. signal@gitdealflow.com for co-authorship on funding-event joins.`,
  },
];

// Merge in the auto-generated signal report + signal of the week if they exist,
// then sort newest-first.
let allPosts = [...posts];
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { signalReport } = require("./signal-report-latest");
  if (signalReport) allPosts.push(signalReport);
} catch {
  // No signal report generated yet – that's fine
}
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { signalOfTheWeek } = require("./signal-of-the-week-latest");
  if (signalOfTheWeek) allPosts.push(signalOfTheWeek);
} catch {
  // No signal of the week generated yet – that's fine
}
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { cursorCollabPost } = require("./cursor-collab-2026");
  if (cursorCollabPost) allPosts.push(cursorCollabPost);
} catch {
  // Cursor collab post optional
}
allPosts.sort(
  (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
);

function isPublished(post: BlogPost): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return post.date <= today;
}

export function getPost(slug: string): BlogPost | undefined {
  return allPosts.find((p) => p.slug === slug);
}

export function getAllPostSlugs(): string[] {
  return allPosts.filter(isPublished).map((p) => p.slug);
}

export function getPublishedPosts(): BlogPost[] {
  return allPosts.filter(isPublished);
}

export { allPosts };
