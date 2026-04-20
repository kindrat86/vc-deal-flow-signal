# Humanities Commons / Commons Open Repository Exchange (CORE)

**Target URL:** https://hcommons.org/

**Rationale:** Humanities Commons' CORE repository is an open-access
DOI-issuing repository for humanities + social-science work. Managed by
Michigan State. Free, anyone can register. Another DOI + DA 70 backlink.

## Prerequisites

- Register at https://hcommons.org/register using `signal@gitdealflow.com`.
- Pick `Independent scholar` in the affiliation dropdown.
- Verify email.

## Deposit fields

**Work type:** `Preprint`

**Title:** same as SSRN.

**Authors:** `The Data Nerd`. Link ORCID iD.

**Description:** paste `../abstract.txt`.

**Subjects (pick from LCSH-controlled vocabulary):**
- `Venture capital`
- `Open source software — Economic aspects`
- `Business enterprises — Data processing`

**Keywords:** same as Figshare.

**License:** `Creative Commons — Attribution (CC BY 4.0)`

**Resource type:** `Preprint`

**Publisher:** `SSRN (Social Science Research Network)` — treat SSRN as
the original publisher.

**Date published:** `2026-04-20`

**Original URL:**
`https://ssrn.com/abstract=6606558`

**Linked dataset:**
`https://doi.org/10.5281/zenodo.19650920`

**Files to upload:**
- `../paper.pdf`

## After deposit

1. CORE assigns DOI: `10.17613/XXXXXX`.
2. Paste into `../amplification-status.json` under `humanities_commons`.
3. Add DOI to Zenodo related-identifiers.

## Automation

See `scripts/submit-humanities-commons.mjs`. HC uses WordPress-based
auth; Steel.dev logs in once, stores cookie, then the deposit form uses
standard HTML form posts.
