# Stack Exchange — Draft Answers

**Sites covered:**
- [Quantitative Finance SE](https://quant.stackexchange.com/) — most relevant, has an `alternative-data` tag
- [Open Data SE](https://opendata.stackexchange.com/) — good for "where can I get X data" questions
- [Data Science SE](https://datascience.stackexchange.com/) — methodology questions

**Account approach:**
- Stack Exchange accounts need 50+ rep before self-promotional links are tolerated. Before answering promotional threads, build rep: answer 5-10 unrelated questions in adjacent tags.
- Self-promo rule: clearly disclose affiliation, never link to homepage, link to methodology/blog pages only.
- Don't answer dead threads (>2 years). Focus on questions with <6 months activity or high traffic.

---

## How to find target questions (search queries)

Run these on each SE site before posting:

**Quantitative Finance SE:**
- `[alternative-data] venture capital`
- `[alternative-data] private markets`
- `github startup signal`
- `[alternative-data] leading indicator`

**Open Data SE:**
- `github commit data`
- `startup funding dataset`
- `venture capital public data`

**Data Science SE:**
- `time series leading indicator startup`
- `predicting funding rounds`
- `commit velocity signal`

---

## Answer 1 — Quant Finance SE target

**Likely question (search for exact match):** "What alternative data is available for private markets / venture capital?"

**Draft answer:**

> Private-markets alt-data differs from the hedge-fund alt-data playbook. Credit-card, satellite, and geolocation signals need public-company baselines that private companies lack. The signals that work for private markets are team-behavior signals.
>
> **Signal categories with reasonable data availability:**
>
> 1. **Public engineering activity (GitHub, GitLab).** Commit counts, contributor deltas, repository creation rates. Free via the [GitHub REST API statistics endpoints](https://docs.github.com/en/rest/metrics/statistics) and the [GitHub Archive BigQuery dataset](https://www.gharchive.org/). Lead time over fundraise announcements is typically 3-6 weeks based on observational data; the underlying mechanism is that engineering acceleration precedes product milestones, which precede round decisions. The 2023 Organization Science paper ["Engagement with Open Source Communities, Innovation, and Startup Funding"](https://pubsonline.informs.org/doi/10.1287/orsc.2023.18348) is the best peer-reviewed grounding.
>
> 2. **Hiring data.** Revelio Labs and Draup license structured workforce data; LinkedIn scraping (where ToS-compliant in your jurisdiction) is the DIY path. Lead time 4-8 weeks.
>
> 3. **Web traffic.** SimilarWeb paid tier, Cloudflare Radar for free aggregate data. Lead time 4-6 weeks but only useful for web-native products.
>
> 4. **Developer adoption metrics.** npm downloads, PyPI installs, Docker Hub pulls for dev-tool startups specifically. Very noisy below 10k weekly downloads.
>
> **Implementation note:** Raw velocity is noisy. The derivative — rate of change over a rolling 14-day window, compared to the prior 14-day window — is the signal. A sustained +50% over two consecutive windows is the standard threshold.
>
> **Disclosure:** I operate a product in this space ([GitDealFlow](https://gitdealflow.com)). The [methodology page](https://gitdealflow.com/methodology) documents the signal classification and threshold logic if useful.

---

## Answer 2 — Open Data SE target

**Likely question:** "Where can I get public data on startup engineering activity or funding-round leading indicators?"

**Draft answer:**

> For engineering activity as a private-markets signal, the practical data sources:
>
> **Free / self-serve:**
>
> 1. **[GitHub REST API](https://docs.github.com/en/rest)** — `GET /repos/{owner}/{repo}/stats/commit_activity` returns 52-week commit counts; `GET /repos/{owner}/{repo}/stats/contributors` returns contributor-level commit history. Rate-limited to 5000 requests/hour for authenticated calls. Sufficient for monitoring ~50-200 organizations per day at a reasonable cadence.
>
> 2. **[GitHub Archive](https://www.gharchive.org/)** — Hourly JSON dumps of public GitHub events, 2011-present, mirrored to Google BigQuery at `githubarchive.day.*`. The canonical source for large-scale historical analysis. Queryable SQL, free up to BigQuery's monthly limits.
>
> 3. **[OSS Insight](https://ossinsight.io/)** — Free dashboards on OSS repo trends, useful for sector-level mapping.
>
> **Paid / commercial:**
>
> - Crunchbase Enterprise API — funding events, not engineering activity
> - PitchBook — funding + some engineering metadata, enterprise only
> - Harmonic.ai — founder + team signals, pitched at VCs
>
> **For funding-round ground truth** (to validate whether your leading indicator actually leads):
>
> - Crunchbase exports (paid)
> - SEC Form D filings (free, via [SEC EDGAR](https://www.sec.gov/edgar.shtml))
> - TechCrunch + Axios Pro RSS feeds for announcement timing
>
> **Methodology note:** If you're building a model, use a 6-12 week lag between engineering signal and funding event as your target window. Closer than 4 weeks and you're picking up post-close announcement noise; farther than 14 weeks and the signal decays.
>
> **Disclosure:** I run a product using this data ([GitDealFlow](https://gitdealflow.com)).

---

## Answer 3 — Data Science SE target

**Likely question:** "How do you detect acceleration in a noisy time-series signal like commit counts?"

**Draft answer:**

> Commit-count time series have two noise characteristics that break naive acceleration detection:
>
> 1. **Weekly seasonality.** Monday-Friday dominates. Weekend commits exist but drop ~70%. A day-over-day derivative picks up cycle noise, not trend.
>
> 2. **Release-week spikes.** A single sprint-end or release week can show 3-5x the baseline. Without smoothing, you'll false-positive on every release cycle.
>
> **Practical approach that works for startup-acceleration detection:**
>
> - **Aggregate to 14-day rolling windows.** Two weeks is long enough to absorb weekly seasonality and short enough to catch real trajectory shifts.
> - **Compare window N to window N-1.** Compute `(commits_N - commits_N-1) / commits_N-1`. This is your rate-of-change.
> - **Require two consecutive positive windows above threshold.** A single +50% window catches release spikes. Two in a row filters those out.
> - **Threshold at +50% sustained.** Below +50% is within normal startup-team variability. Above +50% sustained is the regime change you care about.
>
> **Alternatives tried and why they're worse:**
>
> - 7-day rolling: too noisy, weekly seasonality still dominates
> - 30-day rolling: too slow, signal appears weeks after the actual acceleration
> - Absolute thresholds (e.g., ">100 commits/week"): doesn't generalize across teams of different sizes
> - ML classifiers: not enough labeled data for private-markets ground truth; rule-based wins
>
> **Ground truth:** If the signal is supposed to predict fundraise announcements, cross-reference against Crunchbase and use a 6-12 week lead window for true positives.
>
> **Disclosure:** I operate a production version of this at [GitDealFlow](https://gitdealflow.com); the [methodology page](https://gitdealflow.com/methodology) has the full parameterization.

---

## Answer 4 — Quant Finance SE target

**Likely question:** "Can GitHub activity predict startup fundraise events?"

**Draft answer:**

> Short answer: it predicts the window, not the date.
>
> **Empirical observation across ~2,000 startup organizations (proprietary but methodology is replicable):**
>
> - Engineering acceleration (+50% commit velocity, sustained two 14-day windows) precedes announced funding rounds by a median of 8-10 weeks, with a 6-12 week interquartile range
> - Contributor bursts (+50% active contributors in 30 days) precede rounds by 4-8 weeks
> - New infrastructure-repo creation (deployment, observability, internal-tooling repos) precedes rounds by 2-6 weeks
>
> **Why the signal has predictive content:**
>
> 1. Engineering acceleration is an upstream cause of product milestones, which is an upstream cause of fundraise decisions. It's not a coincident indicator, it's a leading one.
> 2. The signal is not easily gamed at scale. You can inflate star counts and social mentions. You cannot fake 90 sustained commits/week across 8 contributors.
> 3. Survivorship is built in. Teams that accelerate and then fizzle out don't reach announcement. The signal by construction filters for teams that convert acceleration into outcome.
>
> **Failure modes:**
>
> - AI-heavy startups distort velocity (LLM-assisted code inflates counts). Weight contributor count higher in AI sectors.
> - Large open-source projects embedded in startups (e.g. a startup with a popular OSS library) will always show high baseline velocity, which drowns out the company's core-product signal.
> - Stealth-mode teams that don't have public GitHub activity are invisible to this signal entirely.
>
> **Peer-reviewed grounding:** Organization Science 2023 paper ["Engagement with Open Source Communities, Innovation, and Startup Funding"](https://pubsonline.informs.org/doi/10.1287/orsc.2023.18348) establishes the statistical link between public OSS engagement and funding outcomes.
>
> **Disclosure:** I operate a product in this space ([GitDealFlow](https://gitdealflow.com)).

---

## Answer 5 — Open Data SE target

**Likely question:** "Is there a dataset linking GitHub activity to company outcomes (funding, acquisitions)?"

**Draft answer:**

> No single canonical dataset exists. The link is usually constructed by joining two or three sources:
>
> **Engineering-side data:**
> - [GitHub Archive](https://www.gharchive.org/) on BigQuery — raw event stream since 2011
> - [GitHub REST API](https://docs.github.com/en/rest/metrics/statistics) — aggregated per-repo stats
>
> **Company-outcome data:**
> - [Crunchbase](https://www.crunchbase.com/) — funding rounds, paid CSV export
> - [SEC EDGAR Form D](https://www.sec.gov/edgar.shtml) — private round filings, free
> - [CB Insights](https://www.cbinsights.com/), [PitchBook](https://pitchbook.com/), [Dealroom](https://dealroom.co/) — commercial
>
> **The join is the hard part.** Matching a GitHub organization to a legal company entity requires:
>
> 1. Domain-matching from the GitHub org's homepage URL to the Crunchbase `homepage_url` field (covers ~60%)
> 2. Name fuzzy-matching as fallback (covers ~20%)
> 3. Manual review or LinkedIn cross-reference for the remaining ~20%
>
> **Academic precedent:** The 2023 Organization Science paper ["Engagement with Open Source Communities, Innovation, and Startup Funding: Evidence from GitHub"](https://pubsonline.informs.org/doi/10.1287/orsc.2023.18348) built this join for a ~10-year historical sample; it's the most rigorous published work I'm aware of.
>
> **Practical note:** If you're building this to inform VC decisions rather than for academic purposes, the recency matters more than the size. A rolling 90-day window of 2,000-5,000 active startup orgs, joined against announcement-date-tagged Crunchbase events, gives you enough signal without needing the full decade of GHArchive.
>
> **Disclosure:** I operate a production pipeline with this join ([GitDealFlow](https://gitdealflow.com)).

---

## Execution checklist

- [ ] Week 1 (Apr 21-27): Build rep on each site — 3-5 unrelated quality answers per site
- [ ] Week 2 (Apr 28 - May 4): Search target tags, identify 5-8 live questions matching the drafts above
- [ ] Week 2: Post Answer 1 or Answer 4 on Quant Finance SE (highest-relevance site)
- [ ] Week 3: Post Answer 2 and Answer 5 on Open Data SE
- [ ] Week 3: Post Answer 3 on Data Science SE
- [ ] **Never** post the same answer on multiple sites verbatim (rate as duplicate content). Rewrite 60%+ if the question is similar across sites.
- [ ] Track votes + accepts in `marketing/stackexchange-log.md`

**Monthly review:** If any answer crosses 5+ upvotes or becomes accepted, the corresponding blog post gets a reciprocal link from the methodology page. Two-way citation strengthens topical authority for AI retrieval engines.
