# SSRN paper — cross-venue submission bundle

Paper is LIVE on SSRN as of 2026-04-20 16:37 UTC:
https://ssrn.com/abstract=6606558

This directory holds ready-to-paste drafts + Steel.dev automation stubs for
every platform where the paper, dataset, or author profile can still be
submitted or enhanced. Priority ordering reflects estimated SEO / AEO /
citation impact.

## Master links (reuse everywhere)

| Resource | URL |
| --- | --- |
| SSRN paper | https://ssrn.com/abstract=6606558 |
| SSRN author page | https://ssrn.com/author=11219548 |
| Zenodo dataset | https://zenodo.org/records/19650920 |
| Zenodo DOI | `10.5281/zenodo.19650920` |
| Zenodo concept DOI | `10.5281/zenodo.19650919` |
| Kaggle mirror | https://www.kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal |
| Data.world mirror | https://data.world/thedatanerd2026/vc-deal-flow-signal-startup-engineering-acceleration |
| Wikidata paper item | https://www.wikidata.org/wiki/Q139493250 |
| Wikidata project item | https://www.wikidata.org/wiki/Q139376302 |
| Classifier repo | https://github.com/kindrat86/gitdealflow-signal-classifier |
| Product landing | https://gitdealflow.com |
| Signals API (live CSV) | https://signals.gitdealflow.com/api/signals.csv |

## Venue matrix

| # | Venue | Type | Auto? | Blocker | Priority |
| --- | --- | --- | --- | --- | --- |
| 23 | **Hugging Face Dataset** | Dataset index | `huggingface-cli` | 1× `huggingface-cli login` | P0 |
| 23 | **Hugging Face Papers** | Paper index | Manual form | arXiv ID required | P1 |
| 01 | ~~Papers With Code~~ | ~~sunset~~ | — | Site 301→HF; skip | — |
| 02 | OSF Preprints / SocArXiv | Preprint mirror | Manual login | Create OSF account | P0 |
| 03 | ResearchGate | Academic social | Manual login | Create RG account | P0 |
| 04 | ORCID | Author ID | Manual login | Create ORCID iD | P0 |
| 05 | Semantic Scholar | Academic search | Wait then claim | Auto-index (24–72 h) | P0 |
| 06 | RePEc / IDEAS / EconPapers | Economics index | Self-archive submission | Email `repec@repec.org` | P1 |
| 07 | Figshare | Dataset mirror | Manual login | Create Figshare account | P1 |
| 08 | Harvard Dataverse | Dataset mirror | Manual login | Create Dataverse account | P1 |
| 09 | Mendeley Data | Dataset mirror | Manual login | Elsevier account (reuse SSRN) | P1 |
| 10 | Humanities Commons | Interdisciplinary | Manual login | Create HC account | P2 |
| 11 | Wikidata enhancements | Knowledge graph | BotPassword API | Regenerate BotPassword | P1 |
| 12 | dev.to article | Technical blog | API | `DEV_TO_API_KEY` env var | P1 |
| 13 | Hashnode article | Technical blog | GraphQL API | `HASHNODE_PAT` env var | P2 |
| 14 | HackerNoon | Tech blog | Editorial queue | Add to queue (has account) | P2 |
| 15 | Medium | General blog | Chrome automation | Needs Chrome MCP | P2 |
| 16 | Substack (Note + post) | Newsletter | Chrome automation | Needs Chrome MCP | P2 |
| 17 | Twitter thread | Social | Chrome automation | Draft ready → post | P0 |
| 18 | Preprints.org (MDPI) | Preprint mirror | Manual login | See note below | P3 |
| 19 | Academia.edu | Academic social | Manual login | Create account | P3 |
| 20 | Lobsters "Ask" | HN-alt | Draft only | Invite-only site, skip | skip |
| 24 | **engrXiv** | Preprint mirror | Form + captcha | reCAPTCHA = human; IP soft-blocked (2026-08-19) | P1 |
| 25 | **Dryad** | Dataset mirror | Web form | **FULLY STAGED** (submission 458655); $150 DPC = payment gate | P1 |
| 26 | **ScienceOpen Preprints** | Preprint mirror | Web form | Account registered; email verify link pending (origin down 524) | P1 |
| 27 | **Research Square** | Preprint mirror | Web form | **SUBMITTED** (RSID rs-10745326, in editorial screening) | P1 |
| 28 | IEEE DataPort | Dataset mirror | Web form | In progress (Comet session; network error tab) | P2 |
| 29 | HAL (France) | Preprint mirror | Web form | Account creation in progress (CAS/ORCID) | P2 |
| 30 | JOSS | Software paper | GitHub-based | Needs separate software paper (gitdealflow-signal-engine); window check 2027-02-14 | P2 |
| 31 | EconStor | Economics index | Self-archive | RePEc path; account in progress | P2 |
| 32 | DANS Data Station SSH | Dataset mirror | Web form | Login via ORCID; in progress | P2 |

### Priority key

- **P0** — submit in next 24 hours; highest reach + AEO impact
- **P1** — submit in next 72 hours; strong academic / dataset reach
- **P2** — submit in next 7 days; amplification / backlink gain
- **P3** — low-priority or discouraged (see per-venue notes)

### Important notes

- **Preprints.org** explicitly discourages cross-posting a paper that is
  already on a preprint server (see
  [Preprints.org guidelines](https://www.preprints.org/help-center/submission-guidelines)).
  Submit only a substantially revised v2 later.
- **Academia.edu** has paywall friction and its indexing is lower quality
  than ResearchGate or Semantic Scholar. Low priority.
- **arXiv** (q-fin.GN) still requires an endorsement email campaign — see
  `../arxiv-endorsement-email.md` + `../arxiv-shortlist.md`. Not in this bundle.
- **PhilPapers** is philosophy-only. Not a fit.

## How to run the autonomous submissions

Most venues require an interactive login the first time to capture session
cookies. After that the Steel.dev scripts can fire unattended.

1. **Open a Steel session + log in once per venue:**
   ```bash
   node tools/steel/session.mjs --url=https://osf.io/login
   # Log in manually in the Live Browser View that opens.
   # Copy the session ID when prompted; scripts below reuse it.
   ```
2. **Run the per-venue submission script:**
   ```bash
   node distribution/research-paper/submissions/scripts/submit-<venue>.mjs \
     --session=<STEEL_SESSION_ID>
   ```
3. **Confirm the result URL** appears in the console, then paste it back
   into `distribution/dataset/LIVE-URLS.md` and
   `distribution/research-paper/amplification-status.json`.

## Tracking

Completion state of every venue is mirrored in
`distribution/research-paper/amplification-status.json`. Update that file
whenever a URL goes live — the monitoring dashboard reads it.
