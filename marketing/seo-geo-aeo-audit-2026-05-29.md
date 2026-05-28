# SEO / pSEO / GEO / AIO / AEO Visibility Audit — 2026-05-29

**Subject:** VC Deal Flow Signal (GitDealFlow) — `signals.gitdealflow.com` (Next.js 16 App Router; 271 `page.tsx`, ~60 dynamic families) + apex static landing.
**Auditor pass:** Successor to the 2026-05-28 audit. That pass was explicitly **source-only** and named "live-route drift" as its #1 unverified risk. This pass does the thing it deferred: **live production HTTP probes** + a re-run of the near-duplicate gate with **expanded coverage**. Where a number changed, live evidence moved it.

> **Headline change vs 2026-05-28:** coverage is still essentially solved, but live measurement of the *largest* pSEO families surfaced a material, previously-unmeasured scaled-content exposure: **the entity/combinatorial pages built on `content/companies.ts` are near-duplicates of each other** (88% of 1,076 such pages flag at ≥86% body similarity). This is hard evidence for the scaled-content-abuse risk the prior passes only hypothesized, and it pulls pSEO down from 96 → **85**.

---

## TL;DR — Composite Scorecard

| Acronym | Discipline | Score | Δ vs 05-28 | Verdict |
|---|---|---:|:---:|---|
| **SEO** | Traditional organic search | **94** | = | Elite hygiene; live-verified, no drift. CWV still the cap. |
| **pSEO** | Programmatic SEO | **85** | ▼11 | Curated editorial is excellent; entity/combinatorial families are templated near-dups. |
| **GEO** | Generative Engine Optimization | **95** | ▼1 | Best-in-class attribution/entity graph; `/md` mirror is partial, not total. |
| **AEO** | Answer Engine Optimization | **96** | ▲2 | **Answer-first + speakable confirmed live.** |
| **AIO** | AI / Agent Optimization | **95** | = | A2A/MCP/x402/OpenAPI all `200` in prod. |
| **LLMO / GAIO** | LLM optimization | **91** | ▼2 | `/md` gaps on newer entity families; claims corrected this PR. |
| **AISO** | AI Search (Copilot/Pplx/SGE) | **93** | = | Named-bot allowlist verified in live robots.txt. |
| **EEAT** | Experience-Expertise-Authority-Trust | **88** | ▼2 | Authenticity ceiling + thin-content exposure now evidenced. |
| **Entity SEO / KGO** | Knowledge-graph / entity | **97** | = | Reciprocal Wikidata/ORCID/DOI/OpenAlex. |
| **Schema / Structured data** | JSON-LD coverage | **98** | = | 30+ types per page, template-tailored — verified in rendered HTML. |
| **Technical SEO / Crawl** | Indexability, sitemaps, robots | **94** | = | No live drift found across ~40 probed endpoints. |
| **i18n / hreflang** | Internationalization | **89** | ▼2 | Multilingual only on `[locale]/[topic]`; other families en-only. |
| **CWV / Performance** | Core Web Vitals | **83** | ▲1 | Home 508KB HTML → **69KB** br/gzip on the wire; `next/image` still 0×. |
| **A11y** | Accessibility | **85** | = | pa11y axe WCAG2AA in CI. |
| **VSO** | Voice Search Optimization | **74** | = | Speakable + FAQ; no audio (anonymity cap). |
| **Local SEO** | Geo/local | **72** | = | geo-pSEO, not local-pack eligible. |
| **SMO** | Social / Open Graph | **88** | = | Per-route OG factory; Twitter cards. |
| **Trust / Security** | Security posture | **96** | = | HSTS preload + CSP + X-Frame DENY verified in live headers. |
| **Discoverability** | `.well-known` surface | **97** | = | 40+ endpoints; all probed `200`. |
| | | | | |
| **COMPOSITE** | weighted | **≈ 90 / 100** | ▼3 | World-class coverage; the new ceiling is **content uniqueness on entity pages**, plus authenticity + CWV. |

---

## What live verification proved (the new evidence the prior pass lacked)

**1. No route drift.** Every core surface returns `200` in production (probed 2026-05-29): home, `robots.txt`, all 9 sitemaps, `llms.txt` (228KB), `llms-full.txt`, `ai.txt`, `agents.json`, `qa.jsonl` (315KB), `dataset.jsonl`, `entities.json`, `/api/answer`, `/api/ask`, `/faq`, all `.well-known/*` (agent-card, mcp, ai-plugin, openai-search, discover, security.txt, did-config), `openapi.json`, `/api/v1/faq.json`, `/api/v1/signals`. pSEO families probed live with **correct** slugs (`/fund/sequoia`, `/showdown/anthropic-vs-openai`, `/define/rag`, `/case-study/...`, `/acquirer/sap`, `/sector/ai-infra`, `/city/amsterdam`, `/answers/what-is-engineering-acceleration`) all `200`. The `route-canary` cron is holding — **the prior pass's #1 unverified risk is cleared.** (404s I initially hit were my own wrong-slug guesses; `dynamicParams=false` correctly hard-404s invalid slugs.)

**2. AEO answer-first is real — this is the upgrade.** The 05-28 pass docked AEO 6 points pending confirmation that `/answers/[slug]` leads with an extractable answer. Confirmed live on `/answers/what-is-engineering-acceleration`: `<meta name="description">` is a 30-word direct definition, and the same string renders `data-speakable="description"` at the top of the page (`app/answers/[slug]/page.tsx:281`). Textbook answer-first + speakable. **AEO 94 → 96.**

**3. Schema is genuinely per-template, verified in rendered HTML** (not just source inference): `/define/rag` → `DefinedTerm` + `DefinedTermSet` + `FAQPage` + `ScholarlyArticle`; `/case-study/*` → `HowTo` + 5× `HowToStep` + `Article` + `FAQPage`. 30+ `@type`s per page, no schema-only stubs. Schema **98** stands on live evidence.

**4. The "508KB home page" worry is resolved.** Raw HTML is ~520KB with 9 JSON-LD blocks, but with `Accept-Encoding` it's **69KB** over the wire, `x-vercel-cache: HIT`, ~0.28s TTFB. Transfer weight is a non-issue; the residual CWV gap is DOM/parse size + zero `next/image` usage (0 imports across `app/` + `components/`, only 3 raw `<img>`), which barely moves the needle on a text/SVG site. CWV 82 → **83**.

---

## 🚩 The major finding: entity/combinatorial pages are templated near-duplicates

The 05-28 uniqueness gate ran clean (397 entries, 0 near-dups) — but it only covered **9 curated editorial surfaces**. It did **not** cover the largest-by-count families: the 114 `/signal/[slug]` entity pages, the ~865 `/showdown` pairs, or the ~97 `/sector×city` cells. This pass extended the gate to measure them. Result:

| Family | Entries | Flagged (≥86% sim) | |
|---|---:|---:|---|
| `/signal/[slug]` (entity) | 114 | **38%** | one page per tracked company |
| `/showdown/[slug]` (pairs) | 865 | **100%** | company-vs-company |
| `/sector/[slug]/in/[city]` | 97 | **40%** | sector × city crossings |
| **Combined observational** | **1,076** | **88%** | |

**Root cause — confirmed by inspection, not inference.** `content/companies.ts` uses mad-lib templated prose. Three companies side by side:

> `whatWeTrack`: *"For **{Honeycomb / Arize AI / Sentry}**, we monitor: (1) Commit velocity across the public org versus the trailing 12-week median, (2) Contributor influx…"* — identical template, name swapped.
> `whyItMatters`: *"**{Name}** sits at an interesting point in the **{sector}** engineering curve. For investors, the signal is twofold…"* — identical template.
> `signalSummary`: *"Current **{Name}** engineering signal: {momentum}. Public repo footprint {N}+ public repos. Primary language bias: {langs}. Updated weekly…"*

Because every `/showdown` page is two of these blurbs concatenated, `honeycomb-vs-sentry` and `arize-ai-vs-sentry` are **98.4% identical** to a crawler. This is precisely the pattern Google's March-2024 *scaled content abuse* and *site reputation abuse* policies target. With ~1,000 of the ~1,374 sitemap URLs in these templated families, the exposure is not marginal — it's the bulk of the footprint.

**This is why pSEO drops 96 → 85.** The *curated* editorial corpora (`comparisons`, `niches`, `alternatives`, `use-cases`, `from-stars-to-seed`, `build-vs-invest`, etc. — 397 entries) remain genuinely unique (0% near-dup) and would score 95+. But the entity/combinatorial families that dominate the URL count are thin. A blended score has to reflect that the *majority* of indexed URLs are near-duplicates.

### What I shipped this PR (safe, reversible)

- **Extended `scripts/audit-pseo-uniqueness.ts`** to measure `/signal`, `/showdown`, and `/sector×city` — but in a new **observational (report-only) tier** that is **not build-gating**. Rationale: high cross-page overlap here is *structural* (driven by the shared template), and the fix is a content/index-strategy decision owned by a human, not a CI failure. The curated editorial surfaces stay hard-gated at 5%. The build now prints the 88% number + a root-cause warning on every run/PR, so the risk is visible instead of invisible. Verified: **build gate still PASS** (editorial 0%), observational tier reports 88%, exit 0.

### Recommended remediation (a product/content decision — NOT done here)

Pick one (or layer them):
1. **Rewrite per-entity editorial** so each `/signal` page has genuinely company-specific prose (real repo names, real signal narrative). Highest value, highest effort. This single fix cascades to `/showdown`, `/vs`, `/compare`, `/fund/portfolio`, `/sector`, `/city`, `/acquirer` — every family built on `companies.ts`.
2. **`noindex` the thinnest combinatorial leaves** (most of `/showdown`), keeping them for internal-link/agent value but out of the search index. Fast, defensive, protects the domain from a scaled-content demotion.
3. **`canonical` the thin pairs to the richer entity/sector hub** so equity consolidates and duplicates don't compete.

My recommendation: **#2 immediately** (cheap insurance against a manual action), then **#1 incrementally** for the high-traffic sectors.

---

## Other findings

**`/md` is a partial mirror, not "every page."** Live, `/md/signals/langfuse` → 404. The route (`app/md/[...path]/route.ts`) is a hand-maintained allowlist covering stage/signals/startup/startups-to-watch/methodology/answers/alternatives/niche-down/research/faq/glossary/agents/citations/badge-builder — but **none** of the newer entity families (`/signal`, `/define`, `/showdown`, `/case-study`, `/research-paper`, `/fund`, `/acquirer`, `/sector`, `/city`). The prior audit narrative and the in-repo copy overstated this as a total mirror. **Fixed the copy this PR** (`app/md/[...path]/route.ts` + `app/llms.txt/route.ts`) to describe the *actual* coverage rather than over-promise. (Deliberately did **not** extend `/md` to the entity families — mirroring templated thin content adds little; fix the content first.) GEO 96 → 95, LLMO 93 → 91.

**i18n breadth, not reciprocity, is the cap.** Hreflang reciprocity is correct, but live only `[locale]/[topic]` is multilingual; `/answers/*` and `/define/*` emit just `en` / `en-US` / `x-default`. The 13-language schema is real; the *translated page surface* is narrow. i18n 91 → 89 (honesty, not regression).

---

## Prioritized recommendations (by ROI)

| # | Action | Moves | Effort | Status |
|---|---|---|---|---|
| 1 | `noindex` the thinnest `/showdown` leaves (insurance vs scaled-content action) | Protects whole domain; pSEO floor | S | ⏳ user decision |
| 2 | Rewrite `companies.ts` per-entity prose so `/signal` (and everything downstream) is unique | pSEO 85→94 | L | ⏳ user decision |
| 3 | ✅ Extend uniqueness gate to measure entity/combinatorial families (observational tier) | Makes the risk visible every build | M | **done this PR** |
| 4 | ✅ Correct `/md` "every page" claims to actual coverage | GEO/LLMO honesty | S | **done this PR** |
| 5 | Earn ≥1 independent citation of the SSRN paper/dataset | EEAT 88→92 | L | ⏳ |
| 6 | `next/image` for the few raster assets; capture live CrUX baseline | CWV 83→90 | M | ⏳ |
| 7 | `news-sitemap.xml` lastmod → real publish times (not request-time `new Date()`) | Crawl trust | S | ⏳ |

---

## Methodology

Each dimension scored 0–100 on (a) presence in source, (b) correctness/robustness, (c) breadth across the route surface, (d) absence of cross-layer contradiction. **This pass added live HTTP probes** (~40 endpoints + 10 pSEO families) and an **expanded near-duplicate gate** (now 1,473 programmatic entries measured vs 397 before). Composite is judgment-weighted toward what moves 2026 ranking/citation outcomes; pSEO is heavily weighted by URL-count, which is why the entity-page uniqueness finding moves the composite.

*Generated 2026-05-29. Supersedes the 2026-05-28 audit for headline scoring.*
