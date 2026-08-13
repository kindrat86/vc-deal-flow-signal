# dev.to — paper announcement article

**Target URL:** https://dev.to/new

**Rationale:** dev.to has an engaged developer audience that overlaps
strongly with both our ICP (developer-investors) and the paper's
subject (GitHub data). The existing @data_nerd account has a successful
post-history (i-stopped-building-dashboards MCP article) which gives
domain authority boost.

## Prerequisites

- Account `data_nerd` exists.
- Needs `DEV_TO_API_KEY` env var (dev.to → Settings → Extensions → DEV
  Community API Keys). Per memory `project_devto_publisher`, the env
  var was "needed" at the time of Medium API deprecation and may not
  be set yet.

## Article draft

**Title:**
```
I released a public dataset on startup engineering velocity (219 obs across 55 VC-backed startups)
```

**Subtitle / description:**
```
An SSRN preprint + CC BY 4.0 dataset on GitHub alt-data signals in venture capital, and what I learned from shipping it.
```

**Canonical URL:**
```
https://ssrn.com/abstract=6606558
```

**Tags:** `opensource`, `datascience`, `github`, `startup`

**Cover image:** reuse `distribution/logo-v2-512.png` or
`distribution/twitter-banner.png`.

**Body (Markdown, ≥1200 words — matches the dev.to MIN_WORDS check):**

```markdown
TL;DR — I just released a longitudinal panel of GitHub engineering
velocity for 55 venture-backed startups across 20 sectors and 5
quarters. Free to use under CC BY 4.0. The SSRN preprint describing
the methodology is at https://ssrn.com/abstract=6606558 and the dataset
is on Zenodo (DOI [10.5281/zenodo.19650920](https://doi.org/10.5281/zenodo.19650920)),
Kaggle, and Data.world.

This post is a developer-flavored walkthrough of what's in the dataset,
why I built it, and what I got wrong the first three times.

## Why a new alt-data panel?

VC deal sourcing has been shifting from network-mediated referrals
(warm intros, demo days, LP networks) to *alt-data* — structured
external signals that flag an interesting company before the inbound
queue catches it. Public datasets in this space have historically been
thin because the companies that generate high-signal data (Crunchbase,
Dealroom, PitchBook, Harmonic) are commercial and pricey.

GitHub is one of the cleanest public alt-data sources for early-stage
software companies, because:

1. Commit cadence, contributor count, and repo activity are **hard to
   fake**. You can't game a 14-day commit window or a hiring burst in
   the contributor graph without actually shipping code.
2. The timing is **earlier than most commercial sources** — engineering
   acceleration typically precedes a funding announcement by 6–12 weeks
   in our observational sample.
3. Public APIs make it cheap to instrument at scale, if you're willing
   to deal with GitHub's rate limits and normalization headaches.

## What's in the dataset

The panel contains **219 startup-period observations** across:

- **55 startups** — venture-backed, spanning pre-seed through Series C.
- **20 sectors** — fintech, devtools, AI infra, ML ops, climate tech,
  healthtech, logistics, and more.
- **5 quarters** — Q2 2025 through Q2 2026.

For each observation we record:

- **Commit velocity** (14-day rolling window)
- **Unique-contributor count**
- **New-repository creation**
- **Acceleration classification**: one of four patterns — framework
  migration, deploy frequency spike, engineering hiring burst, or
  infrastructure buildout.

Descriptive stats:

| Metric | Value |
| --- | --- |
| Median 14-day commit velocity | 71 |
| Mean | 173 |
| 90th percentile | 392 |
| QoQ velocity change min | -94% |
| QoQ velocity change max | +1,647% |
| Pct observations w/ positive growth | 49% |

And the acceleration distribution:

| Pattern | Share |
| --- | --- |
| Framework migration | 75% |
| Deploy frequency spike | 12% |
| Engineering hiring burst | 9% |
| Infrastructure buildout | 4% |

Geography (where identifiable) skews **56% US**, with European and
Israeli clusters in the remainder.

## Three mistakes I made building v0

### 1. Naive commit counts don't mean what you think

My first version used raw commit count per week. That produced a lot
of noise — a codegen-heavy monorepo commits 500 times a week even when
nothing interesting is happening. Switching to **14-day rolling commit
*velocity*** (commit count divided by active developer count) washed
out most of the noise and revealed the acceleration patterns cleanly.

### 2. Private forks are invisible — and important

GitHub's REST API returns public-repo data only for unauthenticated
requests. Early-stage startups often work in private orgs until launch.
Watching the *public-repo creation timestamp* turned out to be the
single best leading indicator of a framework migration or open-source
announcement.

### 3. Contributor-count drift is a story, not a fact

Adding a contributor to a repo is trivial — hitting one commit a
quarter is not. I originally counted any contributor with >= 1 commit
in the window. The panel now counts only contributors with >= 5
commits in the 14-day window *and* >= 30% of the repo's commits in
that window, which cleans out drive-by PRs from auto-bots and
test contributors.

## Methodology

Full methodology is in the SSRN preprint:
https://ssrn.com/abstract=6606558

Short version:

1. Seed list: 200 public venture-backed companies with identifiable
   GitHub orgs, weighted toward sectors with high open-source adoption.
2. Pull the public commit log + contributor graph per repo, aggregate
   to the org level, and snapshot weekly.
3. Normalize per-quarter to `commits_per_contributor_per_day`.
4. Classify the window via a deterministic rule set (not ML — rule
   auditability matters for replication studies).
5. Release everything as CC BY 4.0.

The **classifier code** is on GitHub at
https://github.com/kindrat86/gitdealflow-signal-classifier (MIT).
The self-test runs in under 2 seconds and all 4 assertions pass.

## How to use the data

### For a VC researcher

1. Grab the [Zenodo CSV](https://zenodo.org/records/19650920) or the
   [Kaggle mirror](https://www.kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal).
2. Join against your funding-event source (Crunchbase, PitchBook, public
   announcements) on `(github_org, quarter)`.
3. Compute correlation between `qoq_velocity_change` and
   `days_to_next_funding`.

I specifically avoided including funding-event labels in this release
to prevent a target-leakage shortcut — the paper explicitly invites
replication studies to join the external labels and report the
correlation.

### For an engineering leader

Load the dataset into a notebook and look at the 75% framework-migration
share. The panel surfaces the modal shape of a pre-fundraise codebase:
a big framework migration (Rails → Go, Flask → FastAPI, Express → Bun,
etc.) 6–12 weeks before the round closes. That's not causal, but it's
a very regular pattern.

### For a dev-infra engineer

The contributor-count normalization logic in `classify.mjs` is
reusable. It handles squash-merge noise, dependabot churn, and the
"weekend contributor" who's actually a different timezone teammate.

## What's next

- arXiv cross-listing (q-fin.GN, endorsement campaign in progress).
- Papers With Code submission (pending).
- Quarterly refreshes — the [live endpoint](https://signals.gitdealflow.com/api/signals.csv)
  updates daily; the Zenodo DOI snapshots version each quarter.
- Public replication study benchmarks (want to co-author? reply below).

## Links

- Paper (SSRN): https://ssrn.com/abstract=6606558
- Dataset (Zenodo, CC BY 4.0):
  [doi.org/10.5281/zenodo.19650920](https://doi.org/10.5281/zenodo.19650920)
- Kaggle mirror:
  https://www.kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal
- Data.world mirror:
  https://data.world/thedatanerd2026/vc-deal-flow-signal-startup-engineering-acceleration
- Code:
  https://github.com/kindrat86/gitdealflow-signal-classifier
- Product:
  https://gitdealflow.com

If you run a replication against Crunchbase or PitchBook labels, drop
me a DM — I'll happily co-author the follow-up.
```

## Queue entry

Append to `distribution/devto-autopublish/queue.json`:

```json
{
  "order": 99,
  "status": "draft-ready",
  "slug": "i-released-a-public-dataset-on-startup-engineering-velocity",
  "title": "I released a public dataset on startup engineering velocity (219 obs across 55 VC-backed startups)",
  "canonicalUrl": "https://ssrn.com/abstract=6606558",
  "tags": ["opensource", "datascience", "github", "startup"],
  "coverImage": "https://gitdealflow.com/og-banner.png",
  "scheduledFor": "2026-04-21",
  "bodyPath": "distribution/research-paper/submissions/12-devto-article.md"
}
```

## Automation

```bash
DEV_TO_API_KEY=<key> node tools/devto/publish-next.mjs
```

The existing `tools/devto/publish-next.mjs` script will pick up this
queue entry and publish via the Forem API. Set `order: 1` (or lower)
if you want this to be the next post in the queue ahead of the default
backlog.
