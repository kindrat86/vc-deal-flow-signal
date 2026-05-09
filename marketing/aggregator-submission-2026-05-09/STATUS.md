# Aggregator submission status — 2026-05-09

Real-state audit of where the SSRN preprint (`abstract=6606558`, DOI `10.2139/ssrn.6606558`) and the companion Zenodo dataset (DOI `10.5281/zenodo.19650920`) currently live across academic indexes. Run today via OpenAlex + Semantic Scholar APIs.

## Summary

| Aggregator | Current status | Action needed | Time | Effort |
|---|---|---|---|---|
| **OpenAlex** | ✓ TWO records exist (Zenodo + SSRN) | Corrections only — link ORCID, fix affiliation, dedupe | 15 min | Form fills |
| **Semantic Scholar** | ✓ Indexed; author profile auto-created (unverified) | Claim author profile + minor corrections | 20 min | Account + form |
| **arXiv** | ✗ Not submitted | Full submission gated by endorsement (4-8 week real timeline) | 2-3 hours active + 4-8 weeks waiting | Endorsement gate is the bottleneck |
| **MPRA / RePEc** | ✗ Not submitted | Full MPRA submission, 1-7 day editorial wait | 30-45 min active + 1-7 days waiting | Form + waiting |

**Realistic total active user time:** ~90-120 minutes spread across the four aggregators.
**Realistic total elapsed time to all four indexed:** **6-10 weeks** — bottlenecked by arXiv endorsement.

## What's already there (verified via API today)

### OpenAlex — both records found

Two distinct OpenAlex `works` for the same underlying research:

**1. Zenodo dataset record:** [`W7154916891`](https://api.openalex.org/works/W7154916891)
- DOI: `10.5281/zenodo.19650920`
- Title: "Startup Engineering Acceleration: A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups"
- Type: `Dataset`
- Author: "The Data Nerd" — **ORCID null**, affiliation "Flow Analysis (United States)" (likely auto-inferred, may need correction)
- Abstract: present (inverted index, 111 terms)
- Top concepts: Commit (0.809), Reuse (0.626), Acceleration (0.556)
- Referenced works: 0 — **gap**

**2. SSRN preprint record:** [`W7154992629`](https://api.openalex.org/works/W7154992629)
- DOI: `10.2139/ssrn.6606558`
- Title: "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups: Dataset and Early Observations"
- Type: `Preprint`
- Host venue: SSRN Electronic Journal
- Author: "The Data Nerd" — **ORCID null**
- Abstract: **MISSING** — gap
- Fulltext origin: **None** — gap
- Referenced works: 0

### Semantic Scholar — already indexed

- Paper ID: `4dd7b11e79757f68e0c4107252514cbfdfbb0462`
- Corpus ID: `287646103`
- DOI: matches SSRN preprint
- Author: "The Data Nerd", authorId `2430837379` (unverified profile, auto-created)
- s2FieldsOfStudy: Engineering, Business
- Abstract: present
- Citations: 0, References: 0

## What needs autonomous fixing first

Before doing the time-consuming arXiv + MPRA submissions, four high-leverage corrections take 30-40 minutes total and improve the existing index records:

1. **Link ORCID `0009-0002-2222-4112` to both OpenAlex records** — this is the single most important fix. It connects the records to your verified author identity and improves citation-graph traversal across all downstream aggregators that ingest from OpenAlex.

2. **Add the missing abstract to the SSRN preprint OpenAlex record (`W7154992629`)** — currently null.

3. **Mark the two OpenAlex records as related** (Zenodo dataset is companion to the SSRN preprint, not duplicate work). OpenAlex supports a "supplementary_to" / "is_supplemented_by" relationship.

4. **Claim the Semantic Scholar author profile** (`authorId 2430837379`) under your verified email. This stops anyone else from claiming it later and lets you merge any future duplicate paper records.

These corrections are documented in `openalex-corrections.md` and `semantic-scholar-pack.md`.

## What can NOT be done autonomously

| Action | Why not |
|---|---|
| Submit to arXiv | Endorsement gate (3-5 endorsements from existing arXiv authors in q-fin.GN or econ.GN); LaTeX/PDF submission via web form; account creation. |
| Submit to MPRA | Account creation; manuscript upload + form completion; 1-7 day editorial review. |
| Claim Semantic Scholar author profile | Account + email verification + manual claim button. |
| Submit OpenAlex corrections | OpenAlex's correction form; no public write API for end users. |

I've prepared everything I can: metadata payloads, exact form values, endorsement-finding strategy, email templates, JEL/MSC codes, BibTeX. The user fills in forms; I removed every drafting decision they'd otherwise have to make.

## Recommended sequence (active-time optimal)

**Today (45-60 min active work):**
1. Submit OpenAlex corrections for both records (15 min) → see `openalex-corrections.md`
2. Claim Semantic Scholar author profile + correct affiliation (20 min) → see `semantic-scholar-pack.md`
3. Submit MPRA paper (25 min) → see `mpra-repec-submission-pack.md`

**This week (45-60 min active work + waiting):**
4. Identify 5-10 arXiv endorser candidates and send endorsement-request emails → see `arxiv-submission-pack.md`
5. Once 1-2 endorsements arrive (typically 1-3 weeks): complete arXiv submission

**Track 1 of `corroborating-sources-accumulation-plan.md` is satisfied by the time MPRA is approved + at least one Semantic Scholar correction is applied.**

## Files in this bundle

- `STATUS.md` — this file
- `openalex-corrections.md` — exact corrections for `W7154916891` + `W7154992629`
- `semantic-scholar-pack.md` — author profile claim + paper corrections
- `arxiv-submission-pack.md` — full submission metadata, endorsement strategy, email templates, abstract reformatting notes
- `mpra-repec-submission-pack.md` — MPRA walkthrough with exact form values, JEL codes, file list
- `SUBMISSION-CHECKLIST.md` — single-page tick-box checklist to run through

## Provenance

All status data fetched via public APIs on 2026-05-09:

- OpenAlex: `https://api.openalex.org/works/W7154916891` and `https://api.openalex.org/works/doi:10.2139/ssrn.6606558`
- Semantic Scholar: `https://api.semanticscholar.org/graph/v1/paper/DOI:10.2139/ssrn.6606558` and `https://api.semanticscholar.org/graph/v1/author/2430837379`

Re-run these endpoints any time to refresh the snapshot.
