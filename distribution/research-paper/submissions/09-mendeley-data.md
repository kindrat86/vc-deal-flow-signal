# Mendeley Data — Elsevier dataset mirror

**Target URL:** https://data.mendeley.com/

**Rationale:** Mendeley Data is Elsevier's research-data platform
(same parent company as SSRN). Since the paper is already on SSRN,
Mendeley Data completes the Elsevier citation graph — Scopus auto-crawls
Mendeley Data records. Assigns DOIs, CC-BY-supported. DA 92.

## Prerequisites

- Mendeley Data logins reuse the Elsevier account created for SSRN
  (`signal@gitdealflow.com`). No separate registration needed —
  log in at https://data.mendeley.com/ with SSRN credentials.
- Enable ORCID link in profile settings.

## Submission fields

**Dataset title:**
```
Startup GitHub Engineering Velocity Panel — companion dataset to SSRN paper 6606558
```

**Authors:** `The Data Nerd` (link ORCID).

**Description:** same block as Figshare.

**Categories:**
- `Data Science`
- `Finance`
- `Open Source Software`

**Keywords:**
```
venture capital, alternative data, github, open source, engineering velocity, startup analytics, panel data
```

**Institution:** `Independent researcher`

**License:** `CC BY 4.0`

**Related articles:**
- `The Data Nerd. (2026). A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups. SSRN. https://ssrn.com/abstract=6606558`

**Version:** `1.0`

**Files to upload:**
- All CSVs + metadata as in Figshare draft.
- Also upload `paper.pdf` (Mendeley Data allows paper-style supplementary PDFs).

## After publish

1. Mendeley Data assigns a DOI: `10.17632/XXXXXXXXX.1`.
2. Paste into `../amplification-status.json` under `mendeley_data`.
3. Add the DOI to Zenodo related-identifiers.
4. Scopus will auto-crawl the Mendeley Data record within ~2 weeks;
   the paper citation shows up in Scopus Author Search if the SSRN
   author profile is linked via ORCID.

## Automation

See `scripts/submit-mendeley-data.mjs`. Mendeley Data has a REST API
(https://api.mendeley.com/data/documents). OAuth2 for write access.
