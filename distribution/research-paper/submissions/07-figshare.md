# Figshare — dataset mirror

**Target URL:** https://figshare.com/account/articles/new

**Rationale:** Figshare is a Digital Science dataset repository
(owned by the same parent as Dimensions, Altmetric, ReadCube). Assigns
DOIs, indexed by Google Dataset Search, OpenAIRE, DataCite. Another
high-DA backlink (DA 90+), zero-cost to maintain.

## Prerequisites

- Register at https://figshare.com/account/register using
  `signal@gitdealflow.com`. Institutional affiliation is optional for
  Figshare (use `Independent researcher` option).
- Verify email.
- Add ORCID iD from `04-orcid.md` to profile.

## Upload fields

**Type:** `Dataset`

**Title:**
```
Startup GitHub Engineering Velocity Panel — 219 observations, 55 startups, 5 quarters (companion to SSRN paper 6606558)
```

**Authors:** `The Data Nerd`

**Categories (pick 2–3):**
- `Applied economics not elsewhere classified`
- `Information systems not elsewhere classified`
- `Data management and data science`

**Keywords:**
```
venture capital, alternative data, github, open source, engineering velocity, startup analytics, panel data, commit velocity, contributor count, framework migration
```

**Description:**
```
Longitudinal panel of GitHub engineering-velocity signals for 55
venture-backed startups across 20 sectors, spanning Q2 2025 – Q2 2026
(219 startup-period observations).

This dataset is the companion to the SSRN working paper
https://ssrn.com/abstract=6606558 and is a mirror of the primary Zenodo
deposit at https://doi.org/10.5281/zenodo.19650920.

For each observation the panel records:
- 14-day rolling commit velocity
- Unique-contributor count
- New-repository creation
- Acceleration classification (one of four patterns: framework migration,
  engineering hiring burst, infrastructure buildout, deploy frequency
  spike)

Files distributed: three CSVs (startup_signals, sector_aggregates,
signal_type_timeseries) plus Frictionless datapackage.json, CITATION.cff,
LICENSE, README.

License: CC BY 4.0.
Live refresh endpoint: https://signals.gitdealflow.com/api/signals.csv

Citation:
The Data Nerd (2026). A Longitudinal Panel of GitHub Engineering
Velocity for Venture-Backed Startups: Dataset and Early Observations.
SSRN Working Paper. https://ssrn.com/abstract=6606558.
Dataset: https://doi.org/10.5281/zenodo.19650920.
```

**License:** `CC BY 4.0`

**Referenced works (optional but populate):**
- Paper: `https://ssrn.com/abstract=6606558`
- Zenodo: `10.5281/zenodo.19650920` (DOI field)
- Kaggle: `https://www.kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal`
- Code: `https://github.com/kindrat86/gitdealflow-signal-classifier`

**Files to upload** (drag-drop from Finder):
```
distribution/dataset/startup_signals.csv
distribution/dataset/sector_aggregates.csv
distribution/dataset/signal_type_timeseries.csv
distribution/dataset/datapackage.json
distribution/dataset/README.md
distribution/dataset/LICENSE
distribution/dataset/CITATION.cff
```

## After publish

1. Note the Figshare DOI (format: `10.6084/m9.figshare.XXXXXXXX`).
2. Paste into `../amplification-status.json` under `figshare`.
3. Add Figshare DOI to Zenodo record's related-identifiers (IsAlternateOf).
4. Add Figshare URL to landing footer's "Dataset & Research" row.

## Automation

See `scripts/submit-figshare.mjs`. Figshare has a public REST API with
OAuth2 — but signup still requires manual email verification.
