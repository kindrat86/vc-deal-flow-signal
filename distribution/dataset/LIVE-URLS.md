# Live dataset-mirror URLs

Tracking the public mirrors of the Startup Engineering Velocity dataset.
Update as each destination goes live.

| Destination | URL | Status | Published | DOI |
| --- | --- | --- | --- | --- |
| **Kaggle** | https://www.kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal | ✅ Public | 2026-04-19 | — |
| **Data.world** | https://data.world/thedatanerd2026/vc-deal-flow-signal-startup-engineering-acceleration | ✅ Public | 2026-04-19 | — |
| **Zenodo** | https://zenodo.org/records/19650920 | ✅ Published | 2026-04-19 | **10.5281/zenodo.19650920** (concept: 10.5281/zenodo.19650919) |
| **SSRN** | https://ssrn.com/abstract=6606558 | ✅ Under review (expect public in 24-48h) | 2026-04-19 | — |
| **arXiv** | _pending endorsement_ | ⏳ | — | — |
| **Papers With Code** | _blocked on Zenodo DOI_ | ⏳ | — | — |

## Kaggle — notes

- Kaggle username: `thedatanerd2026`
- Title: *Startup GitHub Engineering Velocity Panel* (41 chars)
- Subtitle: *GitHub commit velocity across 55 venture-backed startups, 5 quarters* (68 chars)
- Visibility: **Public** (cannot be reverted to Private on Kaggle)
- License: Attribution 4.0 International (CC BY 4.0)
- Files live: `startup_signals.csv`, `sector_aggregates.csv`, `signal_type_timeseries.csv`, `README.md`, `LICENSE.txt`, `CITATION.cff`, `datapackage.json`, `UPLOAD-GUIDE.md`, `build.mjs`
- Usability score: 5.88 (improvable by adding file descriptions + cover image)
- Tags applied: `Finance` (Kaggle CLI silently dropped the other 7 keywords; add manually via the Data Card → Edit if you want more surface area)

## Zenodo — notes

- Record ID: 19650920
- Version DOI: `10.5281/zenodo.19650920`
- Concept DOI (always resolves to latest version): `10.5281/zenodo.19650919`
- All 3 CSVs uploaded + metadata + related identifiers linking to gitdealflow.com, Kaggle, Data.world
- Indexed by OpenAIRE automatically
- **Unlocks Papers With Code submission** — the DOI is the blocker that's now cleared
- Created via InvenioRDM draft API + cookie auth + CSRF token (not Bearer token). Gotchas for next time:
  - Legacy `/api/deposit/depositions/{id}` works for CREATE only; file uploads use `/api/records/{id}/draft/files/...`
  - CSP on Zenodo settings page blocks cross-origin fetches (gitdealflow.com); must inline file content as base64 in JS
  - Zenodo API accepts cookie auth + `X-CSRFToken` header (no need for token after login)
  - File upload is 3-step per file: POST /files to init, PUT /files/{name}/content with octet-stream, POST /files/{name}/commit

## Data.world — notes

- Agentid: `thedatanerd2026`
- Auto-synced from `https://signals.gitdealflow.com/api/signals.csv` (live endpoint)
- Toggle **Autosync** in the UI to refresh the mirror automatically on each live-data update (currently off — flip on after the next weekly regen if desired)
- Created via REST API (POST /datasets/{owner}) because the UI `/upload` and `/datasets/create` paths 404 in Data.world's current layout
- Data.world API rejects tag strings with hyphens — use spaces instead (`venture capital`, not `venture-capital`)
- `description` field is max 120 chars; put the long narrative in `summary`

## Update flow for Kaggle

To refresh data after regeneration (`node distribution/dataset/build.mjs`):

```bash
cd distribution/dataset/
/Users/sipi/Library/Python/3.9/bin/kaggle datasets version -m "Refresh: <date>" -p .
```

Uses the same `dataset-metadata.json` — no re-auth needed (API key at `~/.kaggle/kaggle.json`).
