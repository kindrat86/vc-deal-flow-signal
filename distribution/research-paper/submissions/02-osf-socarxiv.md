# OSF Preprints / SocArXiv — submission draft

**Target URL:** https://osf.io/preprints/socarxiv (SocArXiv) or
https://osf.io/preprints (general OSF Preprints)

**Rationale:** SocArXiv is the open-access social-science preprint server
built on OSF infrastructure. Accepts papers with a prior DOI — include it
in the "Preprint DOI / Associated DOI" field so the record links to the
published SSRN version. OSF Preprints is indexed by Google Scholar, OpenAIRE,
CORE, BASE, and Semantic Scholar.

SocArXiv was founded by social scientists in 2016 after Elsevier purchased
SSRN, as an open-access alternative. Cross-listing SSRN + SocArXiv is
explicitly supported (per SocArXiv FAQ — post-print allowed with DOI link).

## Prerequisites

- Create a free OSF account at https://osf.io/register using `signal@gitdealflow.com`.
- Add ORCID iD to profile after creation (see `04-orcid.md`).

## Submission fields

**Title:**
```
A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups: Dataset and Early Observations
```

**Authors:**
```
The Data Nerd (independent researcher)
```
Affiliation field: leave blank or `VC Deal Flow Signal / independent`.

**Abstract** (paste from `../abstract.txt`):

See `../abstract.txt` — 248-word abstract, already framed to invite
replication studies.

**License:** `CC BY 4.0 (Attribution)` — matches Zenodo dataset.

**Subjects / Disciplines:** pick any of the following (SocArXiv taxonomy):
- Social and Behavioral Sciences → Economics → Finance
- Social and Behavioral Sciences → Economics → Entrepreneurial and Small Business Operations
- Statistics → Applied Statistics
- Library and Information Science → Data Science

**Tags:**
```
venture-capital, alternative-data, github, panel-data, open-source,
engineering-velocity, startup-analytics, github-signals
```

**Preprint DOI (prior / associated):**
```
10.5281/zenodo.19650920
```
(this is the dataset DOI — link the paper record to the dataset so
SocArXiv displays both. SSRN doesn't issue DOIs for preprints, so we
use the companion Zenodo DOI.)

**Original publication / cross-post URL:**
```
https://ssrn.com/abstract=6606558
```

**Supplemental materials** (add via "Supplemental Materials" link during
submission):
- Dataset: https://zenodo.org/records/19650920
- Code: https://github.com/kindrat86/gitdealflow-signal-classifier
- Kaggle mirror: https://www.kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal

**Upload file:**
```
/Users/sipi/launch-projects/vc-deal-flow-signal/distribution/research-paper/paper.pdf
```

## After submission

1. Note the SocArXiv URL (format: `https://osf.io/preprints/socarxiv/XXXX`).
2. Paste it into `../amplification-status.json` under `osf_socarxiv`.
3. Add the SocArXiv URL to the Zenodo record's related-identifiers (use
   the legacy deposit edit API flow — see LIVE-URLS.md for the pattern).
4. Cross-link from Wikidata paper item Q139493250 via property P8091
   (social-network profile URL) or P2021 (full work available at URL).

## Indexing downstream

OSF Preprints feeds:
- Google Scholar (24–72 h)
- Semantic Scholar (weekly crawl)
- OpenAIRE / BASE / CORE
- ORCID auto-link once the author record is claimed

Expected backlink gain: 1 DA ≈78 link back to gitdealflow.com (via
the supplemental-materials URL in the record metadata).

## Automation

See `scripts/submit-osf.mjs`.
