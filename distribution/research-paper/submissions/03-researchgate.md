# ResearchGate — submission draft

**Target URL:** https://www.researchgate.net/add-publication

**Rationale:** ResearchGate is the largest academic social network
(20M+ researchers). Papers there rank in Google Scholar and get
recommended to connected researchers. High citation-recruitment value.

## Prerequisites

- Create a ResearchGate account at https://www.researchgate.net/signup
  using `signal@gitdealflow.com`. ResearchGate now accepts independent
  researchers without institutional email (as of 2024), but will prompt
  for institution. Choose **"I am an independent researcher"** option.
- Upload a profile photo (reuse `distribution/profile-pic-the-nerd.png`).
- Bio: copy from Twitter bio.

## Submission fields

**Publication type:** `Preprint`

**Title:**
```
A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups: Dataset and Early Observations
```

**Authors:** `The Data Nerd` (self) — ResearchGate links it to your profile
automatically. Leave co-authors blank.

**Publication date:** `April 2026`

**Preprint server:** `SSRN (Social Science Research Network)`

**DOI:** leave blank (SSRN doesn't issue DOIs).

**Abstract:** paste from `../abstract.txt`.

**Full-text PDF:** upload
`/Users/sipi/launch-projects/vc-deal-flow-signal/distribution/research-paper/paper.pdf`.

**Supplementary material URL:** `https://zenodo.org/records/19650920`

**Source URL (optional):** `https://ssrn.com/abstract=6606558`

**Research interests / tags (pick up to 5):**
```
Venture Capital; Alternative Data; Panel Data; Open Source Software;
Startup Finance
```

**License:** CC BY 4.0 — select in the advanced options.

## After submission

1. ResearchGate auto-generates a URL like
   `https://www.researchgate.net/publication/XXXXXXX`.
2. Paste it into `../amplification-status.json` under `researchgate`.
3. Enable "Full-text available" toggle so the paper is downloadable.
4. Add the ResearchGate URL to Wikidata paper item Q139493250 as
   P4873 (ResearchGate publication ID).

## Follow-up (low-friction)

- **Request citations:** ResearchGate shows "who viewed your paper".
  After 24 h, send 3 connection requests to the top relevant researchers
  with a personal note ("Saw you work on alt-data in VC — the panel in
  this preprint may be useful for replication studies.").
- **Answer 1 Question:** find 1 ResearchGate Question on
  "GitHub signals" or "alternative data" and post a 3-sentence reply
  with the paper as a reference. Earns RG score without being spammy.

## Automation

See `scripts/submit-researchgate.mjs`. Note: ResearchGate's upload
element is a nested React file picker — the Steel.dev script uses
`page.setInputFiles()` on the hidden `<input type="file">`.
