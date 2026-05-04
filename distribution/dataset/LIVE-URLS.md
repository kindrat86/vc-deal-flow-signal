# Live dataset-mirror URLs

Tracking the public mirrors of the Startup Engineering Velocity dataset.
Update as each destination goes live.

| Destination | URL | Status | Published | DOI |
| --- | --- | --- | --- | --- |
| **Kaggle** | https://www.kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal | ✅ Public | 2026-04-19 | — |
| **Data.world** | https://data.world/thedatanerd2026/vc-deal-flow-signal-startup-engineering-acceleration | ✅ Public | 2026-04-19 | — |
| **Zenodo** | https://zenodo.org/records/19650920 | ✅ Published (SSRN URL added to related identifiers 2026-04-19) | 2026-04-19 | **10.5281/zenodo.19650920** (concept: 10.5281/zenodo.19650919) |
| **SSRN** | https://ssrn.com/abstract=6606558 | ✅ **Live** (approved 2026-04-20; author page https://ssrn.com/author=11219548) | 2026-04-20 | — |
| **arXiv** | _pending endorsement_ | ⏳ | — | — |
| **Papers With Code** | _stub script ready; may be merged into HF Papers_ | ⏳ | — | — |
| **Classifier code** | https://github.com/kindrat86/gitdealflow-signal-classifier | ✅ Public (MIT) | 2026-04-19 | — |
| **Wikidata (paper)** | https://www.wikidata.org/wiki/Q139493250 | ✅ Live (11 claims) | 2026-04-20 | — |
| **Wikidata (product)** | https://www.wikidata.org/wiki/Q139376302 | ✅ Enriched + P973 SSRN/Zenodo + P1343 Q139493250 | 2026-04-20 | — |
| **OpenAlex (dataset)** | https://openalex.org/W7154916891 | ✅ Auto-indexed (via Zenodo → DataCite → OpenAlex) | 2026-04-20 | — |
| **DataCite (dataset)** | https://api.datacite.org/dois/10.5281/zenodo.19650920 | ✅ Findable (registered 2026-04-19) | 2026-04-19 | 10.5281/zenodo.19650920 |
| **Wayback Machine** | https://web.archive.org/web/20260420*/gitdealflow.com | ✅ 7/11 archived (SSRN + Kaggle blocked by CloudFlare/404) | 2026-04-20 | — |
| **OSF Preprints / SocArXiv** | _draft ready, needs OSF account_ | ⏳ | — | — |
| **ResearchGate** | _draft ready, needs RG account_ | ⏳ | — | — |
| **ORCID** | _draft ready, needs registration_ | ⏳ | — | — |
| **Semantic Scholar** | _auto-indexing pending 1-4 weeks_ | ⏳ | — | — |
| **RePEc / MPRA** | _draft ready, needs MPRA account_ | ⏳ | — | — |
| **Figshare** | _draft + script ready, needs FIGSHARE_TOKEN_ | ⏳ | — | — |
| **Harvard Dataverse** | _draft + script ready, needs HARVARD_DATAVERSE_TOKEN_ | ⏳ | — | — |
| **Mendeley Data** | _draft ready, needs Elsevier OAuth_ | ⏳ | — | — |
| **Humanities Commons** | _draft ready, needs HC account_ | ⏳ | — | — |
| **Academia.edu** | _draft ready (low priority)_ | ⏳ | — | — |
| **dev.to article** | _draft ready, needs DEV_TO_API_KEY_ | ⏳ | — | — |
| ~~**Hashnode article**~~ | **RETIRED 2026-05-02** — channel sunset | ✗ | — | — |
| **Medium article** | _draft ready, via medium-daily-publisher task_ | ⏳ | — | — |
| **Substack Note + post** | _draft ready, Chrome MCP needed_ | ⏳ | — | — |
| **HackerNoon article** | _draft ready, manual paste via @TheData_7cdit42c_ | ⏳ | — | — |

## Submission bundle

Full cross-venue submission matrix + ready-to-paste drafts + Steel.dev
automation scripts are at:
**`distribution/research-paper/submissions/`**

Run `node distribution/research-paper/submissions/scripts/run-all.mjs`
to fire the fully-autonomous jobs (Wayback Machine re-archive, indexing
poll). Pass `--session=<STEEL_SESSION_ID>` to also fire login-walled
scripts after bootstrapping a Steel session.

## Kaggle — notes

- Kaggle username: `thedatanerd2026`
- Title: *Startup GitHub Engineering Velocity Panel* (41 chars)
- Subtitle: *GitHub commit velocity across 55 venture-backed startups, 5 quarters* (68 chars)
- Visibility: **Public** (cannot be reverted to Private on Kaggle)
- License: Attribution 4.0 International (CC BY 4.0)
- Files live (v3 pushed 2026-04-19): `startup_signals.csv`, `sector_aggregates.csv`, `signal_type_timeseries.csv`, `README.md`, `LICENSE.txt`, `CITATION.cff`, `datapackage.json`, `UPLOAD-GUIDE.md`, `build.mjs`, `LIVE-URLS.md`
- Per-file descriptions: populated in v3 via `dataset-metadata.json` `data[]` field
- Tags applied: `Finance` (Kaggle CLI silently rejects hyphenated tags — ignore the warning)
- Usability score: 5.88 at v1 — should bump to ~7.5 after v3 descriptions land
- Cover image: uploadable only via Kaggle UI's native file picker, not via CLI or API. Candidate image at `/Users/sipi/launch-projects/vc-deal-flow-signal/chrome-ext-marquee.png` (1400×560, 53KB) is branded and ready. Upload path: Settings → Edit Header & Thumbnail Image → Edit Image → drag-drop from Finder. Takes 60 seconds.

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
- **Autosync: Every Day** — refreshes signals.csv from the live endpoint daily (enabled 2026-04-19)

## Update flow for Kaggle

To refresh data after regeneration (`node distribution/dataset/build.mjs`):

```bash
cd distribution/dataset/
/Users/sipi/Library/Python/3.9/bin/kaggle datasets version -m "Refresh: <date>" -p .
```

Uses the same `dataset-metadata.json` — no re-auth needed (API key at `~/.kaggle/kaggle.json`).
