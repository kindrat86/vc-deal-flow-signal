# OpenAlex / Dimensions / The Lens — auto-indexers (monitor only)

These are Crossref/DOI-driven academic indexers that **auto-index**
from the Zenodo DOI once it propagates. No manual submission is
possible or needed. This file documents the expected timelines and
the URLs to monitor.

| Indexer | Source | Timeline from DOI registration | API to poll |
| --- | --- | --- | --- |
| OpenAlex | Crossref + DataCite | 1–2 weeks | `https://api.openalex.org/works/doi:10.5281/zenodo.19650920` |
| Dimensions | DOI + Crossref | 2–4 weeks | `https://api.dimensions.ai/...` (auth) |
| The Lens | Crossref + DataCite | 1–2 weeks | `https://api.lens.org/scholarly/search` (auth) |
| Unpaywall | DOI | instant on publication | `https://api.unpaywall.org/v2/10.5281/zenodo.19650920?email=signal@gitdealflow.com` |
| Scilit | Crossref | 2–4 weeks | (no public API) |
| Crossref | Zenodo → DataCite | instant | `https://api.crossref.org/works/10.5281/zenodo.19650920` |
| DataCite | Zenodo | instant | `https://api.datacite.org/dois/10.5281/zenodo.19650920` |

## Automated polling

See `scripts/check-indexing.mjs` — runs daily, writes results to
`../amplification-status.json` under `indexing_status`. No auth needed
for any of these APIs except Dimensions and The Lens.

## Claiming / enriching the OpenAlex record

Once OpenAlex has the record:

1. Visit `https://openalex.org/W<id>`.
2. Click **Correct this record**.
3. Add ORCID iD to the author entry.
4. Confirm concepts / MeSH tags look right.

OpenAlex is the single most important downstream — it replaced the
Microsoft Academic Graph and is the source for many LLM retrieval
pipelines.
