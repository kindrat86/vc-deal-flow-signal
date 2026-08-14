# Wikidata entity enrichment — CORRECTED 2026-08-15

**Items:**
- Product: https://www.wikidata.org/wiki/Q139376302 (VC Deal Flow Signal / GitDealFlow)
- Paper:  https://www.wikidata.org/wiki/Q139493250 (SSRN 6606558)

**⚠️ This file replaces the previous version, which contained WRONG property IDs.**
Corrections made 2026-08-15 (all verified live against wikidata.org + SPARQL):

| Old (WRONG) | Why wrong | Correct |
| --- | --- | --- |
| `P8292` = "SSRN Abstract ID" | P8292 is **AusStage person ID** (a theater database) | **P893** = SSRN article ID |
| `P356` = `10.5281/zenodo.19650920` on the paper | That is the *dataset deposit* DOI, not the paper's DOI; violates DOI-canonical use | **P356** = `10.2139/SSRN.6606558` (Crossref-verified); Zenodo goes in P4901 + P973 |
| `P4033` = `@sipiteno` | P4033 is **Mastodon address** | **P2002** = X (Twitter) username |
| `P178` (developer) on the paper | P178 is for software; wrong on a scholarly article | dropped |

Also discovered:
- Existing claim **P2002 "data_nerd" on Q139376302 is STALE** — @the_data_nerd is suspended
  (profile serves generic "Profile / X"). Replace with `sipiteno` (live, verified).
- `github.com/gitdealflow` is a **404** — do NOT cite it anywhere. Real repos:
  `github.com/kindrat86/mcp-deal-flow-signal` (MCP) and
  `github.com/kindrat86/gitdealflow-signal-classifier` (classifier). Note: the local
  `Downloads/gitdealflow/landing/knowledge-graph.json` still contains the dead
  `https://github.com/gitdealflow` in sameAs — separate site fix, tracked below.

## Verification done (2026-08-15)

- All 8 SPARQL reverse-lookups: P893/P356/P4901/P496/P9618/P10283/P4011/P3789 values
  are **FREE** (no existing items claim them).
- URL liveness: Telegram t.me/gitdealflow 200 · gitdealflow.substack.com 200 ·
  HF dataset 200 · HF space 200 · Kaggle 200 · data.world 200 · classifier repo 200 ·
  MCP repo 200 · 2nd Chrome extension (plgng…) 200 · OpenAlex API 200 ·
  Crossref API 200 · Semantic Scholar 202 (exists).
- Account: `TheDataNerd` on Wikidata — 98 edits, autoconfirmed, **NOT blocked**
  (the en-Wikipedia block of `Sipiteno` is project-local; do not ever edit
  en-Wikipedia, that channel is dead — see skill `wikipedia-citations`).

## QuickStatements V2 batch (paste-ready)

File: `wikidata-batch-2026-08-15.tsv` (same directory).

1. Log in at https://quickstatements.toolforge.org/ as **TheDataNerd**
   (Wikidata login: https://www.wikidata.org/wiki/Special:UserLogin — same account).
2. Open https://quickstatements.toolforge.org/#/batch → click the import box →
   paste the TSV (tab-separated, keep quotes) → "Import V1 commands" if prompted → Run.
3. Batch is 17 statements, all additive (no removals) — safe to run in one go.

## After the batch: 2 manual UI edits (2 minutes)

On https://www.wikidata.org/wiki/Q139376302:
1. **Remove the stale claim** `X (Twitter) username: data_nerd` (edit → remove).
   Account suspended; keeping it misleads both Google KG and LLM crawlers.
2. Optional: set `X (Twitter) username: sipiteno` as **preferred rank**.

## The batch (inline copy)

```
Q139493250	P893	"6606558"
Q139493250	P356	"10.2139/SSRN.6606558"
Q139493250	P4011	"4dd7b11e79757f68e0c4107252514cbfdfbb0462"
Q139493250	P10283	"W7154916891"
Q139493250	P4901	"19650920"
Q139493250	P973	"https://zenodo.org/records/19650920"
Q139493250	P973	"https://www.kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal"
Q139493250	P973	"https://github.com/kindrat86/gitdealflow-signal-classifier"
Q139376302	P856	"https://signals.gitdealflow.com"
Q139376302	P3789	"gitdealflow"
Q139376302	P2002	"sipiteno"
Q139376302	P8559	"plgngijmloeljfkenecdkhiblcfcbblm"
Q139376302	P9618	"vc-deal-flow-signal"
Q139376302	P1324	"https://github.com/kindrat86/gitdealflow-signal-classifier"
Q139376302	P11206	"@gitdealflow"
Q139376302	P973	"https://gitdealflow.substack.com"
Q139376302	P973	"https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal"
```

Property key: P893 SSRN ID · P356 DOI · P4011 Semantic Scholar · P10283 OpenAlex ·
P4901 Zenodo · P973 described-at-URL · P856 official website · P3789 Telegram ·
P2002 X username · P8559 Chrome Web Store ID · P9618 AlternativeTo ·
P1324 source repo · P11206 npm scope.

## Deliberately NOT done (and why)

- **No Person item for "The Data Nerd"** — pseudonymous person, weak notability under
  WD:N, and a Person item invites de-anonymization attempts (site anonymity policy).
  The paper's P2093 author-name-string + ORCID on the site is sufficient linkage.
- **No sitelinks/Wikipedia article** — en-Wikipedia channel permanently dead for this
  identity (blocked for promotion; see skill). Wikidata-only entity is the safe play.
- **No edits to `x.com/data_nerd` claims beyond removal** — suspended account.
- **No live-site code changes** (ItemList `numberOfItems: 20` vs 15 actual items on the
  signals homepage; dead `github.com/gitdealflow` in `Downloads/gitdealflow/landing/
  knowledge-graph.json` sameAs) — repo is mid-swarm with parallel agents committing;
  these are flagged for the next deploy window, not snuck in now.

## Fallback — BotPassword API path (if QuickStatements is down)

Special:BotPasswords → grants "Edit existing pages" + "Create, edit, and move pages".
Generate fresh per run, revoke after. Never paste bot passwords into chat.

```bash
npm i -g wikibase-cli
wd auth add --username TheDataNerd@<bot-name> --password <bot-pw> --instance https://www.wikidata.org
wd cm --id Q139493250 --property P893 --value '"6606558"'
# …repeat per claim; then wd auth remove
```

## Verification after run

```bash
curl -s "https://www.wikidata.org/w/api.php?action=wbgetentities&ids=Q139493250|Q139376302&format=json" \
  | python3 -c "import sys,json; d=json.load(sys.stdin); [print(p, len(c)) for p,c in d['entities']['Q139493250']['claims'].items()]"
```
Expect: P893 present on paper; P3789/P2002(sipiteno)/P9618/P8559×2 on product;
SPARQL reverse-lookups now resolve:
`SELECT ?i WHERE { ?i <http://www.wikidata.org/prop/direct/P893> "6606558". }` → Q139493250.
