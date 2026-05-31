# Off-Page / Backlink Execution Plan — 2026-05-31

**Why this is the only thing that moves the composite.** The 2026-05-31 audit put the composite at **~90/100**
with on-page essentially maxed (Technical 94→95 after the #300 schema dedup; GEO 96; AEO 93). The two axes
pinning it below ~94 are **off-page authority (58)** and the **pseudonymity E-E-A-T cap (77)** — neither
movable by code. Off-page is the lever with headroom. This plan supersedes/sequences the 2026-05-30 pack.

## The hard constraint that shapes every play: anonymity

"The Data Nerd" is pseudonymous by design (no real name/face/voice — it's a product pillar). That **rules out**
the highest-yield human-identity link tactics: bylined guest posts with author bios, podcast appearances, HARO
as a named expert, conference talks, LinkedIn thought-leadership. So this plan leans entirely on the link types
that point at **the artifact, not the person**:

- **Data/dataset authority** (SSRN, Zenodo DOI, HF, OpenAlex, Google Dataset Search) — anonymity-PROOF, our
  strongest axis.
- **Free-tool / embeddable widgets** (badges, `/define` embed cards) — links to the tool.
- **Resource-page / awesome-list / listicle inclusion** — co-citation beside Crunchbase/PitchBook.
- **Data-drop PR** where the *data* is the story (works pseudonymously — the ranking is the news, not the author).

## Channel status board (what's done / blocked / open)

| Channel | State (2026-05-31) | Owner | Note |
|---|---|---|---|
| On-site Dataset schema + sitemap + DOI | ✅ **DONE** (verified today) | — | `/dataset` has `Dataset` JSON-LD, in sitemap, Zenodo `19650920`, SSRN `6606558`, HF distribution URLs |
| **Badge embeds** | ✅ **UNBLOCKED today** (was wrongly "blocked") | **YOU** (send) | `/api/badge/signal/<slug>/svg` is live + static for 62 accelerating cos. 44 ready-to-paste targets in `off-page-authority-2026-05-30/badge-embed-UNBLOCKED-2026-05-31.md` |
| Cold email (newsletters + VC list) | 🛑 **SATURATED — do not re-send** | — | 46 records in `email-api/outreach-sent.json`; everyone emailed 2× already. Only re-touch on reply or after 60–90d cooldown |
| Resource-page curators (Tier-A) | 🟡 PARTIAL | YOU | Growth Equity Guide + Visible + Affinity sent (PR #290); Qubit form-only, AlternativeData on hiatus |
| Awesome-lists / directories | 🟡 OPEN (cross-fork PR blocked) | ME→YOU | I stage branches, you 1-click compare URLs — OR set a fine-grained `GITHUB_TOKEN` to fully unblock me |
| Dataset directories (Google Dataset Search / OpenAlex / PWC) | 🟡 verify inbound | ME | Mostly auto-crawled; one-time confirmations lock durable authority |
| Data-drop PR (newsletters cite the ranking) | 🔴 BLOCKED on fresh data | YOU | `top-100/latest.json` stale + polluted with non-venture OSS — needs a venture-filtered re-run on your machine first |
| Wikipedia/Wikidata co-citation | 🟡 OPEN | YOU | Entity on Wikidata; one unlinked co-citation of "code-side sourcing" in a deal-sourcing article seeds the term |

## Priority sequence — next 30 days

### Week 1 — fresh, zero-deliverability-risk channels (start here)
1. **Badge embeds (BEST scalable lever).** Send 3–5/week from the 44-target list. Route = friendly GitHub issue
   → devrel email → DM. README badge = nofollow but referral+co-citation; the **site/docs embed is the dofollow
   prize** — ask for both. *(Assets ready; needs your voice to send — reputational, I won't auto-post to 44 repos.)*
2. **Awesome-list / directory PRs.** `wong2/awesome-mcp-servers`, `awesome-aeo`/`awesome-llms-txt` (our 229 KB
   `/llms.txt` + `/.well-known/*` is a reference implementation), agent-tooling lists (A2A+MCP+OpenAPI surface),
   `public-apis` (our no-auth `/api/signals.json`). *(I can stage the fork branches now and hand you compare URLs.)*
3. **Dataset-directory confirmations.** Verify we're surfaced in Google Dataset Search (`datasetsearch.research.google.com`
   → search `signals.gitdealflow.com`), OpenAlex, Semantic Scholar, Papers With Code; ensure HF READMEs link back
   to `/code-side-sourcing` + SSRN (reciprocal). *(I can run these checks autonomously.)*

### Week 1–2 — unblock the data-drop
4. **Venture-filter + refresh the ranking** (`top-100/latest.json`): exclude pure-OSS/academic orgs (no Monero,
   Harvard, sonic-pi), keep venture-backed. *(Needs the pipeline run on your machine.)* Only *then* are the
   data-drop pitches newsworthy — and even then they re-touch the saturated list, so hold them as **warm-reply
   material**, not fresh cold sends.

### Week 2–4 — co-citation + category seeding
5. **Crunchbase-alternative / deal-sourcing-tool listicles**: get added as the free GitHub-signal layer beside
   Harmonic/PitchBook. You already own `/alternatives/*` — now get on theirs.
6. **Wikipedia/Wikidata**: one co-citation of "code-side sourcing" in a relevant methods article (per
   `marketing/wikipedia-2026-05-09` approach).

## What I can do autonomously right now (say the word)
- Stage the **awesome-list / directory PR branches** (fork+push+compare URLs) — Week-1 item 2.
- Run the **dataset-directory inbound-link audit** (Dataset Search / OpenAlex / PWC / HF reciprocal) — item 3.
- **Rewrite `badge-issue-bodies.md`** to swap the broken `momentum/<org>/<repo>` URLs for the working
  `signal/<slug>` URLs, so your issue sends are copy-paste.

## What needs YOU (and why)
- **Sending anything** — to 3rd-party repos (badges) or curators: reputational + carries your voice; the warm
  Resend sender + `outreach-sent.json` live on your machine, not in any worktree.
- **The ranking re-run** — the data pipeline runs locally.
- **A fine-grained `GITHUB_TOKEN`** (repo+workflow scope) would let me open cross-fork awesome-list PRs end-to-end
  instead of handing you compare URLs — the single biggest autonomy unlock for this plan.

## Dataset-authority audit — VERIFIED FINDINGS 2026-05-31 (I ran these today)

The strongest, anonymity-proof axis is mostly wired but has **three concrete, fixable gaps**:

| Check | Result | Action |
|---|---|---|
| `/dataset` `Dataset` schema completeness | ✅ all 6 required fields (name/description/license/creator/distribution/url) → **Google Dataset Search eligible** | none — verify it appears at `datasetsearch.research.google.com` |
| HF **glossary** card reciprocal links | ✅ links to signals (7) + SSRN + `/code-side-sourcing` + Zenodo | none |
| HF **corpus** card reciprocal links | 🔴 links to signals (8) + SSRN, but **0 `/code-side-sourcing`, 0 Zenodo** | **fix the corpus README** to match glossary (add `/code-side-sourcing` + Zenodo DOI backlinks). HF MCP is read-only; do via `tools/.env HF_TOKEN` dataset-write or the HF web UI |
| SSRN paper (DOI `10.2139/ssrn.6606558`) in **OpenAlex** | 🔴 **count: 0** (not indexed) | SSRN DOIs don't auto-flow to OpenAlex; the **Zenodo DOI** is the path OpenAlex crawls |
| Zenodo dataset DOI (`10.5281/zenodo.19650920`) in OpenAlex | 🔴 not found | ensure the Zenodo record's metadata lists creators + related-identifier to the SSRN DOI so OpenAlex/Crossref pick it up — each indexed DOI = a permanent, anonymity-proof academic inbound |
| SSRN anchor resolves to bots | ⚠️ returns **403 to crawlers** (human-OK) | not fixable on our side; lean on the Zenodo DOI (200) as the citable anchor in outreach |

**Highest-value dataset action:** get the Zenodo DOI into OpenAlex (fix its metadata/related-identifiers), and
bring the corpus HF card to parity with the glossary card. Both are anonymity-proof and compounding.

## How to measure (monthly, in GSC + manual)
- Referring **domains** (count + diversity) — the actual 58→up metric, NOT raw link count.
- Brand-query impressions for **"code-side sourcing"** + **"gitdealflow"** (category seeding working?).
- Unprompted web mentions of "code-side sourcing" (co-citation working?).
- Google Dataset Search / OpenAlex presence (entity authority locked in?).

> Reality check: off-page authority is a **quarters-not-weeks** grind, and the anonymity ceiling means the
> realistic composite ceiling is ~94 even with a healthy referring-domain profile. The badge channel + dataset
> authority are the two plays that compound without ever touching the saturated cold list or the identity wall.
