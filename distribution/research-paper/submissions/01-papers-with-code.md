# Papers With Code — SUNSET (skip; route to HF instead)

> **⚠️ Obsolete as of 2026-04-20.** Papers With Code was sunset; all
> `paperswithcode.com` URLs (including `/submit`) 301-redirect to
> `huggingface.co/papers/trending`. See
> `/Users/sipi/.claude/projects/-Users-sipi-launch-projects-vc-deal-flow-signal/memory/reference_paperswithcode_dead.md`.
>
> **Replacement path:** publish a **Hugging Face Dataset card** now
> (`distribution/dataset/huggingface-dataset-card.md` — already staged)
> and submit to **HF Papers** only after arXiv endorsement lands.
> The HF Paper submission surface requires an arXiv ID; SSRN URLs
> aren't accepted on that page.

This file is kept for archival reference only.

**Target URL:** https://paperswithcode.com/submit (now redirects)

## Blocker: Zenodo needs paper.pdf uploaded

Zenodo record 19650920 currently has the CSV/metadata files but NOT
`paper.pdf`. Before PwC submission, add `paper.pdf` to Zenodo:

1. Zenodo → Edit record → New Version.
2. Upload `distribution/research-paper/paper.pdf` (103 KB).
3. Bump version to 1.0.2. Publish.
4. New DOI: `10.5281/zenodo.19650921`. Concept DOI unchanged
   (`10.5281/zenodo.19650919`).
5. Paper PDF URL becomes:
   `https://zenodo.org/records/19650921/files/paper.pdf`

## Submission fields (ready-to-paste)

**Title:**
```
A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups: Dataset and Early Observations
```

**Authors:**
```
The Data Nerd (VC Deal Flow Signal)
```

**Abstract:** paste `../abstract.txt`.

**Paper URL (primary):**
```
https://ssrn.com/abstract=6606558
```

**Paper OA PDF URL:**
```
https://zenodo.org/records/19650921/files/paper.pdf
```
(Use this URL after the Zenodo v1.0.2 upload completes.)

**Code URL:**
```
https://github.com/kindrat86/gitdealflow-signal-classifier
```

**Dataset URL:**
```
https://zenodo.org/records/19650920
```

**DOI:**
```
10.5281/zenodo.19650920
```

## Categories

When the PwC submission form asks for category:
- **Primary:** Finance / Alternative Data
- **Secondary:** Datasets
- **Tags:** `venture-capital, github, open-source, panel-data, engineering-velocity, startup-analytics`

## Dataset section (tick the Dataset checkbox)

- **Dataset name:** Startup Engineering Acceleration Panel
- **License:** CC BY 4.0
- **Sample count:** 219 startup-period observations
- **Modality:** Tabular (CSV), panel data
- **Paper:** SSRN URL above
- **Homepage:** https://gitdealflow.com
- **Download:** https://zenodo.org/records/19650920

## After acceptance

1. PwC assigns URL like `https://paperswithcode.com/paper/<slug>`.
2. Paste into `../amplification-status.json` → `papers_with_code`.
3. Update Wikidata paper item Q139493250 with Papers With Code ID (P5875).
4. Add PwC URL to Zenodo related-identifiers.
5. Tweet announcement tagging `@paperswithcode`.

## Automation

See `scripts/submit-papers-with-code.mjs`. PwC requires GitHub OAuth for
submission — Steel.dev captures the session cookie, then POSTs the form.
