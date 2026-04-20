# Wayback Machine — archive all paper + dataset URLs

**Target URL:** https://web.archive.org/save/<url>

**Rationale:** Permanent archive snapshots. The Wayback Machine
submission endpoint is open (no auth required for public URL archiving),
returns a permanent `web.archive.org/web/<timestamp>/<url>` link for each
saved page. This is **the only truly fully-autonomous preservation
layer** we can execute today.

Each archived URL becomes:
- Citable (`archive.org/web/<ts>/<url>` is a stable citation)
- Referenceable from Wikipedia citations (`url=`, `archive-url=`)
- Resistant to link rot

## URLs to archive

| # | URL | Why |
| --- | --- | --- |
| 1 | https://ssrn.com/abstract=6606558 | Paper landing |
| 2 | https://zenodo.org/records/19650920 | Dataset landing |
| 3 | https://doi.org/10.5281/zenodo.19650920 | DOI resolver |
| 4 | https://www.kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal | Kaggle mirror |
| 5 | https://data.world/thedatanerd2026/vc-deal-flow-signal-startup-engineering-acceleration | Data.world mirror |
| 6 | https://github.com/kindrat86/gitdealflow-signal-classifier | Code repo |
| 7 | https://signals.gitdealflow.com/api/signals.csv | Live data endpoint |
| 8 | https://gitdealflow.com/ | Product landing |
| 9 | https://www.wikidata.org/wiki/Q139493250 | Wikidata paper entity |
| 10 | https://www.wikidata.org/wiki/Q139376302 | Wikidata project entity |

## Automation (fully autonomous)

See `scripts/submit-wayback-machine.mjs` — uses the public
SavePageNow endpoint `https://web.archive.org/save/<url>`. No auth
required for public URLs. One HTTP POST per URL; Wayback Machine
returns the archived URL in the `Content-Location` header.

## Scheduling

Add to monthly cadence: archive all URLs on the 1st of each month so
old snapshots remain reachable even if a destination goes offline.
