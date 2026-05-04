# Wikidata — paper-entity enhancements

**Target entities:**
- Paper item: https://www.wikidata.org/wiki/Q139493250
- Project item: https://www.wikidata.org/wiki/Q139376302

**Rationale:** Wikidata feeds the Knowledge Graph, Wikipedia, many
LLM retrieval systems, and answer engines. Enriching the paper record
with additional identifiers (SSRN abstract ID, downstream DOIs, OpenAlex
ID, Semantic Scholar ID once assigned) increases entity disambiguation
quality and citation routing.

## Already done (from memory project_wikidata)

- Paper item Q139493250 created with 11 claims (P31, P1476, P2093, P577,
  P953 SSRN URL, P921 × 2, P275 CC-BY-4.0, P407 English, P1104 15 pages,
  P2860 cites Q139376302).
- Project item Q139376302 updated with P973 SSRN + P973 Zenodo DOI +
  P1343 → paper item.

## Additional claims to add

### Paper item Q139493250

| Property | Value | Notes |
| --- | --- | --- |
| P8292 | `6606558` | SSRN Abstract ID (recommended over P953 for SSRN-specific linkage) |
| P356 | `10.5281/zenodo.19650920` | DOI of companion dataset |
| P859 (sponsor) | — | leave; self-funded |
| P178 (developer) | Q139376302 | GitDealFlow as developer — links both entities |
| P973 | `https://zenodo.org/records/19650920` | Described at URL |
| P973 | `https://www.kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal` | Kaggle mirror |
| P973 | `https://github.com/kindrat86/gitdealflow-signal-classifier` | Code |
| P854 (reference URL) | `https://ssrn.com/abstract=6606558` | Add to every claim as a reference |

### Works that will be added after dependent actions complete

- **OpenAlex ID** (P10283) — assigned after paper is indexed in OpenAlex
  (follows Crossref / Zenodo DOI). Check
  https://api.openalex.org/works/doi:10.5281/zenodo.19650920 after 1 week.
- **Semantic Scholar paper ID** (P4011) — assigned after Semantic Scholar
  corpus ingests the paper (1–4 weeks).
- **ResearchGate publication ID** (P4873) — after `03-researchgate.md`
  completes.
- **ORCID iD** (P496) — added to the author statement (P2093 → qualifier)
  after `04-orcid.md` completes.
- **Figshare DOI** as P973 — after `07-figshare.md` completes.

## QuickStatements v2 batch

Paste the lines below at
https://quickstatements.toolforge.org/#/batch (logged in as
`TheDataNerd`, autoconfirmed as of 2026-04-20).

```
# ── Paper item enhancements ──────────────────────────────
Q139493250	P8292	"6606558"
Q139493250	P356	"10.5281/zenodo.19650920"
Q139493250	P178	Q139376302
Q139493250	P973	"https://zenodo.org/records/19650920"
Q139493250	P973	"https://www.kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal"
Q139493250	P973	"https://github.com/kindrat86/gitdealflow-signal-classifier"

# ── Project item enhancements ────────────────────────────
Q139376302	P856	"https://gitdealflow.com"
Q139376302	P1324	"https://github.com/kindrat86/gitdealflow-signal-classifier"
Q139376302	P4033	"@data_nerd"
```

### Fallback — BotPassword API path

If QuickStatements rejects due to autoconfirmed status or rate-limit,
use a fresh BotPassword from
https://www.wikidata.org/wiki/Special:BotPasswords.

Grants required:
- Edit existing pages
- Create, edit, and move pages

Then run:

```bash
npm i -g wikibase-cli
wd auth add --username TheDataNerd@<bot-name> --password <bot-pw> --instance https://www.wikidata.org
wd cm --id Q139493250 --property P8292 --value '"6606558"'
# ... repeat for each claim
```

**Important:** per memory `reference_wikimedia_bot_passwords`, BotPasswords
auto-flag if exposed in chat. Generate fresh each run, revoke after.

## Automation

See `scripts/submit-wikidata-enhancements.mjs`.
