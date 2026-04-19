# Hugging Face dataset card — ready to paste

**Status:** Ready to create at https://huggingface.co/new-dataset
**Target slug:** `thedatanerd2026/vc-deal-flow-signal`
**License:** CC-BY-4.0 (matches Zenodo + Kaggle + Data.world mirrors)
**Upload path:** use the HF Hub web UI or `huggingface-cli upload` — data files come from `distribution/dataset/` (`startup_signals.csv`, `sector_aggregates.csv`, `signal_type_timeseries.csv`).

---

## Dataset card (YAML frontmatter + body — paste into README.md on the HF repo)

```markdown
---
language:
  - en
license: cc-by-4.0
pretty_name: Startup GitHub Engineering Velocity Panel
size_categories:
  - n<1K
source_datasets:
  - original
task_categories:
  - tabular-classification
  - time-series-forecasting
  - text-classification
task_ids:
  - multi-class-classification
tags:
  - venture-capital
  - startup
  - github
  - alternative-data
  - engineering-velocity
  - commit-activity
  - panel-data
  - finance
  - dealflow
annotations_creators:
  - expert-generated
language_creators:
  - machine-generated
multilinguality:
  - monolingual
configs:
  - config_name: startup_signals
    data_files:
      - split: train
        path: startup_signals.csv
  - config_name: sector_aggregates
    data_files:
      - split: train
        path: sector_aggregates.csv
  - config_name: signal_type_timeseries
    data_files:
      - split: train
        path: signal_type_timeseries.csv
---

# Startup GitHub Engineering Velocity Panel

A longitudinal panel of GitHub engineering-velocity signals across venture-backed startups,
published under CC BY 4.0 for academic and editorial research on alternative data in
venture capital.

**Concept DOI:** [10.5281/zenodo.19650919](https://doi.org/10.5281/zenodo.19650919)
**Version DOI (v1.0.0):** [10.5281/zenodo.19650920](https://doi.org/10.5281/zenodo.19650920)
**Website:** https://gitdealflow.com
**Live dashboard:** https://signals.gitdealflow.com

## Dataset summary

This dataset captures engineering-velocity signals — commit velocity, contributor growth,
and repository expansion — across ~55 venture-backed startups and ~20 sectors, sampled
quarterly for 5 consecutive periods (Q3 2025 through Q2 2026 at the time of v1.0.0).
Every observation is derived from the public [GitHub REST API v3](https://docs.github.com/en/rest).

The core motivating hypothesis: **sustained engineering acceleration (commit velocity
increasing significantly against a startup's own baseline) tends to precede fundraise
announcements by approximately 6-12 weeks.** This dataset enables researchers to
formally test that hypothesis, build predictive models, or use the panel as an
alternative-data baseline in venture-capital research.

## Configs

| Config | Rows | Description |
|---|---:|---|
| `startup_signals` | ~275 | One row per (startup, quarter). Commit velocity, contributor counts, new repos, signal classification, stage estimate. |
| `sector_aggregates` | ~100 | One row per (sector, quarter). Sector-level means, medians, and top-signal breakdowns. |
| `signal_type_timeseries` | ~80 | One row per (signal-type, quarter). Occurrence counts and sector breakdowns per signal type. |

## Variables measured

| Variable | Description | Unit |
|---|---|---|
| Commit Velocity (14-day) | Total commits to the organisation's most active public repository over a rolling 14-day window | commits |
| Commit Velocity Change | Percentage change in commit velocity vs. the preceding 14-day window | percent |
| Contributor Count | Number of unique contributors to the org's most active public repository | contributors |
| Contributor Growth | Percentage change in contributor count vs. baseline | percent |
| New Repositories (30d) | Public repositories created in the last 30 days | repositories |
| Signal Type | Categorical: Engineering hiring burst / Infrastructure buildout / Deploy frequency spike / Framework migration | categorical |
| Stage Estimate | Pre-Seed / Seed / Series A-B / Growth — estimated from contributors + enrichment data | categorical |
| Geography | Broad region: US / UK / EU / APAC / Canada / LATAM / MENA | categorical |

## Example usage

```python
from datasets import load_dataset

ds = load_dataset("thedatanerd2026/vc-deal-flow-signal", "startup_signals")
print(ds["train"].features)
print(ds["train"][0])

# Filter to Series A-B startups in Q2 2026 with a Deploy Frequency Spike signal
filtered = ds["train"].filter(
    lambda row: row["stage"] == "Series A/B"
    and row["period"] == "q2-2026"
    and row["signal_type"] == "Deploy frequency spike"
)
print(f"Matches: {len(filtered)}")
```

## Methodology

Every record is computed deterministically from public GitHub data:

1. For each startup in the tracked universe, identify the GitHub organisation from curated enrichment data (startup name → GitHub org slug).
2. Query the GitHub REST API v3 for commit activity, contributor stats, and repository metadata.
3. Compute commit velocity over a 14-day rolling window and compare against the preceding 14-day window to derive the `commit_velocity_change` signal.
4. Classify the dominant signal pattern (hiring burst, infrastructure buildout, deploy spike, framework migration) using rule-based thresholds on contributor growth, new-repo count, and commit acceleration.
5. Emit one record per (startup, period).

See the [published methodology](https://signals.gitdealflow.com/methodology) for the
full decision tree. The live methodology is considered the canonical reference; this
dataset card captures the state as of v1.0.0.

## Limitations and caveats

- **Selection bias:** The universe is restricted to startups with a public GitHub organisation and visible engineering activity. Non-technical startups are systematically under-represented.
- **Survivorship:** Startups that shut down between tracking periods are removed from later quarters, which can introduce survivorship bias into period-over-period comparisons.
- **Stage imputation:** Stage estimates are imputed from contributor counts and enrichment data, not direct funding records. They should be treated as approximate.
- **Not investment advice:** This dataset is published for research and editorial use. Nothing in the dataset constitutes investment advice. Verify any signal independently before taking any investment action.

## Citation

```bibtex
@dataset{thedatanerd_2026_startup_github_velocity,
  author       = {{The Data Nerd}},
  title        = {{Startup GitHub Engineering Velocity Panel}},
  year         = {2026},
  publisher    = {Zenodo},
  version      = {1.0.0},
  doi          = {10.5281/zenodo.19650920},
  url          = {https://zenodo.org/records/19650920}
}
```

## License

This dataset is released under the [Creative Commons Attribution 4.0 International
(CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/) license. You are free to
share and adapt the data for any purpose, including commercial use, provided you
credit the source (VC Deal Flow Signal — https://gitdealflow.com) and link to the
license.
```

---

## After upload checklist

1. Verify all three CSVs render correctly in the HF Datasets viewer.
2. Add the "finance" and "venture-capital" badge tags in the HF UI.
3. Add the HF URL to the `Organization.sameAs` array in [pseo-site/app/page.tsx](../../pseo-site/app/page.tsx).
4. Add HF as a row in [distribution/dataset/LIVE-URLS.md](LIVE-URLS.md).
5. Cross-link from the Zenodo record's "Related Identifiers" field (`IsPartOf` → HF URL).
6. Cross-link from the Kaggle dataset description.
