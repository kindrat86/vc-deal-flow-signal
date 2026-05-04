# ORCID — author ID + work claim

**Target URL:** https://orcid.org/register

**Rationale:** ORCID is the de-facto canonical identifier for researchers.
Adding the SSRN paper + Zenodo dataset as works links them across
platforms (Semantic Scholar, Crossref, CORE, OpenAIRE all respect ORCID).
ORCID is the **prerequisite** for most other academic identity systems —
set this up first.

## Prerequisites

- Register at https://orcid.org/register using `signal@gitdealflow.com`.
  Anyone can register; no institution check.
- Set name to: `The Data Nerd` (primary) + `T. Nerd` (alternate).
- Visibility: **Public** for name, works, affiliations.
- Copy the 16-digit ORCID iD (format: `0000-0000-0000-0000`) into
  `../amplification-status.json` + Wikidata paper item Q139493250 as
  P496 (ORCID iD) on the author statement.

## Works to add

Add **two** works to the ORCID record — paper and dataset.

### Work 1 — SSRN paper

Go to `My record → Works → Add works → Add manually`.

- **Work category:** `Publication`
- **Work type:** `Working paper`
- **Title:** `A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups: Dataset and Early Observations`
- **Subtitle:** leave blank
- **Journal title:** `SSRN Electronic Journal` (if prompted)
- **Publication date:** `2026-04-20`
- **URL:** `https://ssrn.com/abstract=6606558`
- **Short description:** first 300 chars of `../abstract.txt`
- **Citation type:** `BibTeX` — paste:
  ```bibtex
  @misc{thedatanerd2026ssrn,
    author = {The Data Nerd},
    title  = {A Longitudinal Panel of {GitHub} Engineering Velocity for Venture-Backed Startups: Dataset and Early Observations},
    year   = {2026},
    howpublished = {SSRN Working Paper},
    url    = {https://ssrn.com/abstract=6606558},
  }
  ```
- **External ID type:** `URI`, value `https://ssrn.com/abstract=6606558`

### Work 2 — Zenodo dataset

- **Work category:** `Research data`
- **Work type:** `Dataset`
- **Title:** `VC Deal Flow Signal — Startup Engineering Acceleration Panel`
- **Publication date:** `2026-04-19`
- **URL:** `https://zenodo.org/records/19650920`
- **External ID type:** `DOI`, value `10.5281/zenodo.19650920`
- **Citation type:** `BibTeX`:
  ```bibtex
  @dataset{thedatanerd2026dataset,
    author = {The Data Nerd},
    title  = {VC Deal Flow Signal — Startup Engineering Acceleration Panel},
    year   = {2026},
    publisher = {Zenodo},
    doi    = {10.5281/zenodo.19650920},
    url    = {https://doi.org/10.5281/zenodo.19650920},
  }
  ```

## After

1. Paste the ORCID iD into
   - `../amplification-status.json`
   - Zenodo record metadata (Edit → Creators → ORCID field)
   - SSRN profile (https://ssrn.com/author=11219548 → Edit Profile → ORCID)
   - ResearchGate profile Settings → Identifiers
2. Authorise Crossref, DataCite, SSRN, and OpenAIRE to auto-add future
   works (Settings → Trusted organizations).
3. Public ORCID URL: `https://orcid.org/<iD>`.

## Automation

See `scripts/submit-orcid.mjs`.
