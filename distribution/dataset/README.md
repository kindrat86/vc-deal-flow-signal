# VC Deal Flow Signal — Startup Engineering Acceleration Dataset

A quarterly longitudinal panel of GitHub engineering-velocity signals across 55
venture-backed startups, 20 sectors, and 5 quarters (Q2 2025 through Q2 2026).
Collected by [VC Deal Flow Signal](https://gitdealflow.com) from the public
GitHub REST API. Released under [CC BY 4.0](LICENSE.txt) — free to reuse with
attribution.

**DOI:** [10.5281/zenodo.19650920](https://doi.org/10.5281/zenodo.19650920) (version 1.0.0)
**Concept DOI (latest version):** [10.5281/zenodo.19650919](https://doi.org/10.5281/zenodo.19650919)
**Homepage:** https://gitdealflow.com
**Live dataset endpoints:**
- CSV: https://signals.gitdealflow.com/api/signals.csv
- JSON: https://signals.gitdealflow.com/api/signals.json

**Mirrors:**
- Zenodo (canonical, DOI-stamped): https://zenodo.org/records/19650920
- Kaggle: https://www.kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal
- Data.world: https://data.world/thedatanerd2026/vc-deal-flow-signal-startup-engineering-acceleration

## What is this dataset?

Venture capital deal sourcing increasingly relies on alternative data — signals
that surface breakout startups before they appear on traditional funding radar.
One of the cleanest alternative data sources is the public GitHub footprint of
venture-backed startups: commit velocity, contributor growth, repository
expansion. These signals precede public fundraise announcements by six to
twelve weeks in our observational sample.

This dataset captures that footprint on a rolling quarterly cadence and
classifies each observation into one of four human-readable acceleration
patterns.

## Files

| File | Rows | Description |
| --- | --- | --- |
| `startup_signals.csv` | 219 | Primary observation table. One row per startup per quarterly period. |
| `sector_aggregates.csv` | 72 | Sector-level aggregates per period (avg/median velocity, top mover, dominant signal). |
| `signal_type_timeseries.csv` | 15 | Distribution of acceleration-signal types across observations, per period. |
| `datapackage.json` | — | Frictionless Data schema — Data.world and CKAN parse this natively. |
| `dataset-metadata.json` | — | Kaggle dataset metadata (`kaggle datasets` CLI format). |
| `CITATION.cff` | — | Citation File Format — GitHub + Zenodo + arXiv parse this automatically. |

## Schema — `startup_signals.csv`

| Column | Type | Description |
| --- | --- | --- |
| `period` | string | Quarterly period slug, e.g. `q2-2026`. |
| `sector_slug` | string | Sector identifier (20 distinct values). |
| `sector_name` | string | Human-readable sector name. |
| `startup_name` | string | GitHub organization slug. |
| `stage` | string | Self-reported funding stage. |
| `geography` | string | ISO region grouping — US, EU, APAC, LATAM, Canada, Unknown. |
| `commit_velocity_14d` | integer | Total commits to the org's most active public repo over a rolling 14-day window. |
| `commit_velocity_change_pct` | number | Percent change in commit velocity vs. the preceding 14-day window. |
| `contributors` | integer | Unique contributors in the observation window. |
| `contributor_growth_pct` | number | Percent change in unique-contributor count vs. the prior window. |
| `new_repos` | integer | New public repos created by the org in the window. |
| `signal_type` | string | One of: Framework migration, Engineering hiring burst, Infrastructure buildout, Deploy frequency spike. |
| `github_url` | string | Direct URL to the GitHub organization. |

Primary key: `(period, startup_name)`.

## Signal taxonomy

Each observation is classified into one of four acceleration patterns:

- **Framework migration** (75% of observations) — concentrated refactor
  activity; commits touch core dependencies and build config.
- **Engineering hiring burst** (9%) — unique-contributor count rising faster
  than commit volume; new accounts appearing in merge-commit authorship.
- **Infrastructure buildout** (4%) — new repos spawning under the org;
  disproportionate activity in infra/DevOps repos relative to the product repo.
- **Deploy frequency spike** (12%) — commit velocity rising sharply without
  proportional contributor growth; typically a sprint toward a product milestone.

## Sample summary statistics

- **Observations:** 219 startup-period rows
- **Unique startups:** 55
- **Sectors:** 20 (AI & ML, Data Infrastructure, Cybersecurity, Fintech, Climate Tech, Space Tech, Gaming, Robotics, HR Tech, Legal Tech, and 10 more)
- **Periods:** 5 quarters (Q2 2025 through Q2 2026)
- **Median 14-day commit velocity:** 71 commits
- **Mean 14-day commit velocity:** 173 commits
- **90th-percentile velocity:** 392 commits
- **Share of observations with positive quarter-over-quarter velocity change:** 49%
- **Velocity change range:** −94% to +1,647%

## Update cadence

Regenerated weekly from the live dataset. Treat this static snapshot as a
stable reference for reproducible research; for current data pull
https://signals.gitdealflow.com/api/signals.csv directly.

## Citation

> The Data Nerd. (2026). *A Longitudinal Panel of GitHub Engineering Velocity
> for Venture-Backed Startups: Dataset and Early Observations* (v1.0.0)
> [Data set]. Zenodo. https://doi.org/10.5281/zenodo.19650920

See `CITATION.cff` for machine-readable citation metadata.

## License

Creative Commons Attribution 4.0 International (CC BY 4.0). You may share and
adapt the data for any purpose, including commercial, provided you give
appropriate credit, link to the license, and indicate if changes were made.

## Methodology

Full methodology: https://signals.gitdealflow.com/methodology

In brief:
1. Curate a seed list of venture-backed startups with public GitHub orgs.
2. For each org, identify the most active public repository by recent commits.
3. Pull commit activity, contributors, and repo-creation events from the GitHub
   REST API over a rolling 14-day window.
4. Compare against the preceding 14-day window to compute velocity change.
5. Classify each observation into one of four signal types using deterministic
   heuristics over (commits, contributors, new_repos, commit-message patterns).
6. Roll up sector-level aggregates and rank startups by commit_velocity_change.

## Limitations

- **GitHub-observable startups only.** Orgs whose primary work is in private
  repos are under-represented. Sectors where open-source is unconventional
  (most consumer apps, many fintechs) are thin.
- **Org-to-startup mapping is manual.** Some orgs serve multiple products; we
  score the most active public repo, which may miss multi-repo buildouts.
- **14-day windows are coarse.** Short sprints and holiday weeks introduce
  noise; use `sector_aggregates.csv` for stable cross-period comparisons.
- **No ground-truth funding labels in this release.** Linking observations to
  subsequent fundraise events is on the roadmap — we welcome replication
  studies that join this dataset against Crunchbase, PitchBook, or Dealroom.
- **Survivorship.** The seed list skews toward orgs that are still active;
  shutdown companies are not retroactively added.

## Contact

signal@gitdealflow.com — questions, replication requests, corrections welcome.
