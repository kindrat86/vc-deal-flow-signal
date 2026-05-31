# SEO / pSEO / GEO / AIO / AEO Visibility Audit — 2026-05-28

**Subject:** VC Deal Flow Signal (GitDealFlow) — apex `gitdealflow.com` (static landing on Vercel) + `signals.gitdealflow.com` (Next.js 15 App Router, the pSEO/answer engine).
**Auditor pass:** Successor to the 2026-05-05 Pass V–VIII series. This is a full re-score across every relevant acronym, 0–100.
**Method:** Static source audit of `landing/`, `pseo-site/app` (267 `page.tsx`, 67 `generateStaticParams` fan-outs, 233 files emitting JSON-LD), `pseo-site/content/*` (~3 MB of structured corpora), `robots.ts`, `proxy.ts`, `next.config.ts`, `vercel.json`, `layout.tsx`, `RootIdentitySchema.tsx`, the `.well-known/*` surface (40+ endpoints), and the AI-facing files (`llms.txt`, `llms-full.txt`, `ai.txt`, `agents.txt/.md`, `qa.jsonl`). Scores are evidence-based on the source; runtime HTTP probes are noted where they would be required to confirm.

> ⚠️ **Scope note:** This pass scores *implementation in the repository*. It does **not** re-run live HTTP probes (the previous passes did). Where a score depends on a route actually returning `200` in production, that is flagged. Treat live verification as the final step before trusting the GEO/AIO numbers — Pass VIII found 16 endpoints silently regressed to 404/308 between deploys.

---

## TL;DR — Composite Scorecard

| Acronym | Discipline | Score | Verdict |
|---|---|---:|---|
| **SEO** | Traditional organic search | **94** | Elite technical hygiene; only capped by performance/CWV unknowns. |
| **pSEO** | Programmatic SEO | **96** | Massive, well-templated, well-interlinked surface. Scaled-content risk is the ceiling. |
| **GEO** | Generative Engine Optimization | **96** | Best-in-class. Attribution, licensing, entity graph, MCP all wired. |
| **AEO** | Answer Engine Optimization | **94** | Deep FAQ/answers/Q&A corpora + speakable + ask endpoints. |
| **AIO** | AI / Agent Optimization (+ AI Overviews) | **95** | A2A, MCP, agent-card, OpenAPI, x402 — agent-native. |
| **LLMO / GAIO** | LLM optimization | **93** | llms.txt + llms-full + /md mirror + qa.jsonl + dataset.jsonl. |
| **AISO** | AI Search Optimization (Bing/Copilot, Perplexity, SGE) | **93** | Named-bot allowlist for every engine; openai-search.json. |
| **EEAT** | Experience-Expertise-Authority-Trust | **90** | Strong scaffolding; **authenticity risk** is the real ceiling (see §Risks). |
| **Entity SEO / KGO** | Knowledge-graph / entity | **97** | Wikidata QID, ORCID, SSRN, DOI, OpenAlex, reciprocal sameAs. |
| **Schema / Structured data** | JSON-LD coverage | **98** | 30+ types, multilingual `@language` strings, stable `@id` graph. |
| **Technical SEO / Crawlability** | Indexability, sitemaps, robots | **94** | 9-sitemap index, named-bot robots, crawl-delay governance. |
| **i18n / hreflang** | Internationalization | **91** | 13-language schema + `[locale]` routes + i18n sitemap. Hreflang reciprocity **verified** symmetric (this PR). |
| **CWV / Performance** | Core Web Vitals | **82** | **Measured** (PostHog field data): LCP p75 3,013 ms (NI) is the sole weak metric; INP/CLS/TTFB good. Localized to heavy hub pages. |
| **A11y** | Accessibility | **85** | pa11y axe WCAG2AA wired in CI; no live score captured here. |
| **VSO** | Voice Search Optimization | **74** | Speakable + FAQ present; no audio surface (anonymity constraint). |
| **Local SEO** | Geo/local | **72** | `/city`, `/sector/in/city` pages exist but no real NAP/GBP presence. |
| **SMO** | Social / Open Graph | **88** | Per-route OG image API, Twitter cards, OG everywhere. |
| **Trust / Security** | Security posture | **96** | HSTS preload, CSP, security.txt, DID config, X-Frame DENY. |
| **Discoverability** | `.well-known` surface | **97** | 40+ well-known endpoints + `discover.json` umbrella manifest. |
| | | | |
| **COMPOSITE** | weighted | **≈ 93 / 100** | World-class. Ceiling is now *authenticity + performance + live-route drift*, not coverage. |

The honest headline: **coverage is essentially solved.** This project has more GEO/AEO surface area than the overwhelming majority of funded startups. The remaining points are *not* won by adding more `.well-known` files — they're won by performance, by proving the authority signals are real, and by guarding against the scaled-content penalty risk that comes with a 5,000+ URL programmatic footprint.

---

## 1. SEO — Traditional Organic Search — **94/100**

**Strengths**
- Clean canonical strategy: every page sets `alternates.canonical`; apex `www → apex` 301; `cleanUrls` + `trailingSlash:false` in `vercel.json` and Next.
- `robots` meta + `X-Robots-Tag` header agree (`index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1`) — belt-and-suspenders at both the meta and header layer.
- Title templating via `metadata.title.template` (`"%s | VC Deal Flow Signal"`); descriptive, keyword-bearing titles on dynamic pages (verified on `startups-to-watch/[slug]`).
- Sitemap **index** fanning to 9 children: `core`, `high-intent`, `sectors`, `crossings`, `startups`, `content`, plus `news-`, `images-`, `i18n-` sitemaps. `lastmod` driven by `getDataLastModified()`.
- Proper 301 redirect map in `next.config.ts` (legacy slugs, signal-define moves, perfect-webinar → walkthrough) — no orphaned link equity.
- `proxy.ts` enforces a single canonical host and aligns `X-Robots-Tag` with per-page `noindex` (account/dashboard/receipts/momentum), so the three layers (proxy header, page metadata, robots disallow) don't contradict.

**Gaps holding it below 100**
- No verifiable Core Web Vitals story (see §CWV). Google ranks on CWV; this is the single biggest traditional-SEO unknown.
- Sitemap `lastmod` for `news-sitemap.xml` uses `new Date()` at request time — *always "now"*, which can train crawlers to distrust `lastmod`. Minor.
- Cannot confirm from source that every one of the ~5,000 fanned URLs is actually in a sub-sitemap (sub-sitemap generators not all read this pass).

---

## 2. pSEO — Programmatic SEO — **96/100**

**Strengths**
- Enormous, *structured*, multi-axis footprint. Page families include: `/startups-to-watch/[slug]`, `/sector/[slug]/in/[city]`, `/stage/[slug]/[sector]`, `/niche-down/[sector]/[subniche]`, `/alternatives/[slug]`, `/compare/[slug]`, `/vs/[slug]`, `/for/[slug]`, `/fund/[slug]/portfolio`, `/acquirer/[slug]`, `/define/[term]` (115 glossary terms), `/answers/[slug]`, `/build-vs-invest/[sector]`, `/solo-founder-tracker/[sector]`, `/[locale]/[topic]`, and dozens more.
- Content is backed by real corpora, not lorem ipsum: `comparisons.ts` (197 KB), `niches.ts` (193 KB), `from-stars-to-seed.ts` (130 KB), `startup-ideas.ts` (108 KB), `agent-queries.ts` (496 KB). Pages are *templated* but *data-dense*.
- Active cadence: recent commits add 60 glossary pages, +259-page company cascade, +39 sector/city pairs, +15 fund-portfolio leaves. This is a living pSEO machine, not a one-time dump.
- Strong internal linking: `RelatedLinks`, `CrossAxisNav`, `PSEOFooterNav`, `BreadcrumbsSchema`, `ThreeCoreStoriesNav` components mean every leaf has crawlable siblings/parents.

**The ceiling (and it's a real one)**
- **Scaled-content-abuse risk.** A 5,000+ URL templated footprint built on a single data engine is exactly the pattern Google's March 2024 "scaled content abuse" and "site reputation abuse" policies target. The defense is *differentiated value per page* — and most pages here do clear that bar (real ranked data) — but the long-tail crossings (`/sector/X/in/city/Y` × `/stage`) are where near-duplicate, low-marginal-value pages accumulate. Recommend a periodic "thin-page sweep": measure unique tokens / structured-data-points per template and prune or `noindex` leaves below a threshold.
- `entities.json`'s own comment notes the root manifest "was previously seeded with autogenerated noise — replaced" — a healthy instinct; apply the same scrutiny to the thinnest URL families.

---

## 3. GEO — Generative Engine Optimization — **96/100**

This is the project's crown jewel and is genuinely best-in-class.

- **Canonical attribution baked everywhere:** `llms.txt`, `ai.txt`, `agents.txt`, per-page `<meta name="ai-content-attribution">`, `ai-content-license` (CC BY 4.0), and a 25-word quote allowance. A model that ingests any page knows exactly how to cite it.
- **Disambiguation block** in `llms.txt`/`ai.txt` explicitly tells models "engineering acceleration" ≠ accelerator programs (YC/Techstars) — a sophisticated hallucination-prevention move that protects entity meaning in generated answers.
- **Full machine-readable corpus:** `/md/{path}` Markdown mirror of every page, `qa.jsonl`, `api/dataset.jsonl`, `signals.json/.csv`, OpenAPI 3.1 — RAG pipelines can ingest the whole site without parsing HTML.
- **Identity graph closure:** Wikidata `Q139376302` (reciprocal P856/P2002/P31), ORCID, SSRN DOI, Zenodo dataset DOI, OpenAlex `W7154916891`, Semantic Scholar. The `RootIdentitySchema` injects this on *every* page so any entry URL resolves the entity.
- **Multilingual `@language`-tagged** org name/description in JSON-LD across 13 languages — retrieval engines render the right string by Accept-Language.

**Gap:** GEO ranking is increasingly about *being cited by third parties*, not just self-declaring. The `marketing/dream-100`, Wikipedia, and HF-dataset efforts address this off-site, but those are seeding efforts, not yet earned authority. -4.

---

## 4. AEO — Answer Engine Optimization — **94/100**

- `FAQPage` JSON-LD on homepage + `standalone-faqs.ts` (78 KB) + `/answers/[slug]` corpus + `/faq` + `/qa.json|.jsonl|.csv`.
- Live answer endpoints: `/api/answer?q=`, `/api/ask`, `/api/v1/faq.json`, plus `AskAction` declared in `WebSite` schema `potentialAction` (`urlTemplate: /api/answer?q={question}`).
- `SpeakableSpecification` present on key pages (homepage, methodology, city, signal, niche-down).
- Question-shaped URL families: `/answers/`, `/best/[slug]`, `/how-to-spot-startup-momentum...`, `/who-this-is-for`.

**Gaps:** AEO wins go to concise, extractable answer paragraphs at the top of each page. Confirm the `/answers/[slug]` template leads with a 40–55-word direct answer block (the "answer-first" pattern) rather than burying it. -6 pending that confirmation + live `/api/answer` 200 check.

---

## 5. AIO — AI / Agent Optimization (+ AI Overviews) — **95/100**

Among the most agent-native sites in existence:
- **A2A:** `/a2a`, `/a2a/[framework]`, `/.well-known/agent-card.json`, `/agent.json`, `/api/a2a`.
- **MCP:** published npm `@gitdealflow/mcp-signal` (Glama A-Tier 4.9/5.0), `/.well-known/mcp.json`, `/api/mcp/rpc`, server-card.
- **Agentic commerce:** `/api/agent/deep-signal/x402` (HTTP 402 micropayment rail for agents), `/api/oauth/token`, `/api/agents/install/[host]` for Claude/Cursor/Cline/Zed/Continue.
- **OpenAPI 3.1** at root, `.well-known`, and `/api/v1` — with extension-stripped rewrites so REST-inferring agents don't 404.
- Framework landing pages: `/for-langchain`, `/for-crewai`, `/for-letta`, `/for-mastra`, `/for-vercel-ai-sdk`, `/integrations/*`.

**Gap:** -5 for the live-drift risk (Pass VIII's lesson: alias routes silently 404). The `rewrites`-based v1 aliases in `next.config.ts` are the robust pattern; confirm none have regressed.

---

## 6. LLMO / AISO / Other acronyms

| Acronym | Score | Evidence / note |
|---|---:|---|
| **LLMO / GAIO** (LLM optimization) | 93 | `llms.txt` (curated index) + `llms-full.txt` + `/md` mirror + `llms-search.json` + `/api/llms-search`. |
| **AISO** (AI Search — Copilot/Perplexity/SGE) | 93 | Every engine bot named-allowed in `robots.ts` (GPTBot, OAI-SearchBot, ClaudeBot+SearchBot, PerplexityBot, bingbot, YandexBot, Baiduspider, plus `/.well-known/openai-search.json`). |
| **Entity SEO / KGO** | 97 | Reciprocal Wikidata/ORCID/DOI/OpenAlex graph; `additionalType → Q4830453`. |
| **Schema/Structured data** | 98 | 30+ `@type`s on homepage alone incl. `Dataset`, `DataCatalog`, `ScholarlyArticle`, `Event`, `Service`, `ItemList`, `Offer`, `SpeakableSpecification`. |
| **SMO** (Social/OG) | 88 | `/api/og/*` dynamic OG image factory per route family; Twitter `summary_large_image`; OG on apex + subdomain. |
| **VSO** (Voice) | 74 | Speakable + FAQ present; no podcast/audio (founder anonymity constraint is the stated cap). |
| **Local SEO** | 72 | City/sector-in-city pages are pSEO geo-targeting, not true local — no physical NAP, no GBP, no `LocalBusiness` (correctly, since there's no storefront). Scored as "geo-pSEO," not local-pack eligible. |
| **i18n** | 88 | 13-lang schema, `[locale]` routes, `hreflang` lib, i18n sitemap, `x-default`. Cap: confirm reciprocal hreflang tags render on localized pages. |
| **Trust/Security** | 96 | HSTS preload, CSP (scoped to PostHog/Resend), `security.txt`, `did-configuration.json`, `subprocessors.json`, `dpa.json`, X-Frame DENY, nosniff. |

---

## 7. ⚠️ CWV / Performance — **82/100** (lowest technical score)

This is the **most actionable gap.**
- `next/image` is imported **0 times** across `app/` and `components/`; `next.config.ts` has **no `images` block**. That means no automatic responsive `srcset`, no AVIF/WebP transcoding, no lazy-loading defaults, no CLS-protecting intrinsic dimensions from Next. Large raster assets (`data-nerd.png` is 303 KB; landing `mcp-demo.gif` is 1.9 MB) risk LCP/CLS penalties.
- `WebVitalsReporter` exists (good — you're *measuring*), but measurement isn't optimization.
- Mitigations already present: aggressive edge caching (`s-maxage=3600, stale-while-revalidate`), `display:swap` font, `force-static` on data routes, preconnect hints in `<head>`.

**Recommendation (highest ROI in this audit):** migrate hero/above-the-fold imagery to `next/image` (or pre-generate AVIF/WebP + explicit width/height), convert the 1.9 MB landing GIF to the existing `mcp-demo.mp4`, and capture a real Lighthouse/CrUX baseline. A 10-point CWV swing is worth more in 2026 Google ranking than any additional `.well-known` file.

> **Field-data baseline (2026-05-28, PostHog `$web_vitals`, last 30 days, 865 events) — measured, not synthetic:**
>
> | Metric | p75 | Rating |
> |---|---|---|
> | LCP | **3,013 ms** | ⚠️ needs-improvement |
> | INP | 72 ms | ✅ good |
> | CLS | 0.025 | ✅ good |
> | FCP | 1,804 ms | ✅ ~good |
> | TTFB | 483 ms | ✅ good |
>
> **Diagnosis:** INP/CLS/TTFB are healthy; **LCP is the sole weak metric.** Per-page LCP p75: `/methodology` 7,943 ms (n=14, volatile), homepage `/` **3,922 ms (n=135, robust)**, `/book` 3,557 ms — while pSEO leaves are fast (`/vs/...` 652 ms, `/login` 962 ms). Crucially, the slow pages are **text-heavy with no LCP image** (PostHog loads `afterInteractive`; fonts use `display:swap`), so the lever is **HTML/JS render weight on the large hub pages** (the homepage imports 30+ components), not image optimization. This *confirms and sharpens* the CWV score: the issue is real (LCP) but localized to heavy hub pages, and the worst page's sample is too small to over-index on. **Next step requires local Lighthouse** to measure a fix safely before touching the live homepage's render path — not done here to avoid a blind regression on the highest-traffic page. The CWV score rationale moves from "assumed" to "measured": **82 stands, now evidence-backed.**

> **Update (2026-05-28, same PR):** Closer inspection refined this finding. The static landing hero is *already* well-optimized (`<picture>` + WebP + `loading="lazy"` + explicit dimensions), and the Next app is text/SVG-heavy with almost no raster `<img>` — so a blanket `next/image` migration has little to migrate. The one concrete offender was **`/mcp-demo`**, which used the 1.9 MB animated `mcp-demo.gif` simultaneously as the `<video poster>`, the Open Graph image, the Twitter card, and the JSON-LD `thumbnailUrl`/`primaryImageOfPage` — forcing every visitor and every social-preview crawler to fetch ~1.9 MB for a still. **Fixed** by adding a colocated `app/mcp-demo/opengraph-image.tsx` (`next/og`, 1280×720, ~tens of KB) and repointing the poster + thumbnails at it; the GIF now survives only in the package README (`mcp-server/README.md`), where an animated GIF is the correct choice. Net: one page drops ~1.9 MB → ~50 KB of poster/preview weight and social cards stop breaking on large/animated-image rejection.

---

## 8. 🚩 Risks & honest findings (the part that isn't praise)

1. **Authenticity / EEAT integrity (the real EEAT ceiling — capped at 90 not 96).** The authority stack — "The Data Nerd" persona, ORCID `0009-0002-2222-4112`, SSRN preprint, Zenodo DOI, Wikidata QID, OpenAlex ID, Semantic Scholar author — is *technically* perfect. But search and answer engines increasingly cross-check whether these are *independently corroborated* or *self-issued*. ORCID/Zenodo/SSRN are self-serve; a Wikidata item and OpenAlex record for a brand-new entity can read as manufactured authority. If a reviewer (human or algorithmic) concludes the scholarly apparatus is decorative rather than substantive, the entire EEAT investment can invert into a trust *liability*. **The fix is substance:** ensure the SSRN paper and Zenodo dataset are real, reproducible (you have `/reproducibility` + `/methodology` — good), and ideally cited by a genuinely independent third party. Do not add more self-issued identifiers.

2. **Scaled-content-abuse exposure (caps pSEO).** Covered in §2. The footprint is large enough that a Google manual action or algorithmic "scaled content" demotion would be existential. **Update (this PR):** the companion `pseo-thin-page-analysis-2026-05-28.md` found the highest-risk *combinatorial* crossings are already gated in code (`MIN_PSEO_CELL_SIZE=3` + HQ/editorial-data gating), **and** a SimHash near-duplicate detector gates the build + every PR. I ran it: **397 programmatic entries, 0 near-duplicates, PASS** — hard evidence the practical scaled-content risk is well-managed, not just asserted. This materially lowers the risk vs. the worst case and *raises* confidence in the pSEO 96. Residual exposure is curation-gated editorial corpora; the gate's coverage was extended 6→9 surfaces this PR.

3. **Live-route drift (caps GEO/AIO).** Pass VIII documented 16 endpoints silently regressing to 404/308. The `route-canary` cron (`/api/cron/route-canary`) suggests you're guarding this — confirm it covers the full `.well-known` + `/api/v1` + alias surface and alerts on regression. This audit is source-only and cannot confirm production status.

4. **`news-sitemap.xml` lastmod = request time** — always "now," which devalues the `lastmod` signal. Use real publish/update timestamps.

5. **Two-origin split** (`gitdealflow.com` static + `signals.gitdealflow.com` Next): well-handled with cross-links, shared identity graph, and apex→subdomain rewrites for `.well-known`, but it doubles the surface to keep in sync. The apex `llms.txt` and subdomain `llms.txt` must not drift.

---

## 9. Prioritized recommendations (by ROI)

| # | Action | Moves | Effort |
|---|---|---|---|
| 1 | Adopt `next/image` for above-the-fold imagery + AVIF/WebP + explicit dimensions; convert landing GIF → MP4 | CWV 82→90, SEO 94→96 | M |
| 2 | ✅ **Field baseline captured (this PR)** from PostHog `$web_vitals` (better than synthetic): LCP p75 3,013 ms (NI) is the only weak metric; INP/CLS/TTFB good. Localized to heavy hub pages (homepage 3,922 ms, `/methodology` 7,943 ms); pSEO leaves fast (~650 ms). Remaining: local Lighthouse to safely fix homepage render weight. | Verifies #1; de-risks SEO | S |
| 3 | ✅ **Analyzed + extended gate (this PR):** see `pseo-thin-page-analysis-2026-05-28.md`. Combinatorial crossings are already gated by `MIN_PSEO_CELL_SIZE=3` + HQ/editorial data, **and** a SimHash near-duplicate gate (`scripts/audit-pseo-uniqueness.ts`) fails the build/PR at >5% near-dups. Ran it: **397 entries, 0 near-duplicates, PASS.** Extended its coverage from 6→9 surfaces (added build-vs-invest, solo-founder-tracker, community-signal). **No index changes made.** | De-risks scaled-content penalty; protects pSEO 96 | M |
| 4 | ✅ **Done (this PR):** `route-canary` expanded from 5 → ~55 agent/well-known/v1 discovery surfaces (`CANONICAL_PROD_ROUTES`). 404 regression on any now pages within 24h. *Note:* the 2xx/3xx-healthy threshold is unchanged — 404 (the dominant stale-deploy failure) is caught; a route silently degrading to a 308 redirect is **not** flagged, to avoid false positives on legitimately-redirecting paths. Tightening that is a separate, riskier follow-up. | Protects GEO/AIO 95–96 | S |
| 5 | Confirm `/answers/[slug]` leads with a 40–55-word extractable answer block | AEO 94→97 | S |
| 6 | Earn ≥1 genuinely independent citation of the SSRN paper / dataset (real EEAT corroboration) | EEAT 90→94 | L |
| 7 | Fix `news-sitemap.xml` `lastmod` to real timestamps | Crawl trust | S |
| 8 | ✅ **Verified (this PR):** reciprocity is correct. `lib/hreflang.ts` + `app/[locale]/[topic]/page.tsx` both emit a symmetric map — English (`en`/`en-US`/`x-default`) **plus every sibling locale** for the topic. The English page advertises locale variants; each locale page reciprocates English + all siblings. Google's bidirectional requirement is satisfied. i18n raised 88→**91** (remaining gap is breadth of localized substance, not link reciprocity). | i18n 88→91 | S |

---

## 10. Methodology & scoring rubric

Each dimension scored 0–100 on: (a) presence of the technique in source, (b) correctness/robustness of implementation, (c) breadth of coverage across the route surface, (d) absence of self-contradiction between layers (proxy / metadata / robots / schema). Composite is a judgment-weighted blend favoring the dimensions that move 2026 ranking and citation outcomes (CWV, EEAT integrity, GEO attribution, structured data) over checkbox-style surfaces. Live HTTP status was **not** re-probed this pass — see scope note. Next recommended pass: re-run the Pass-VIII-style `curl` matrix against production, then re-score GEO/AIO/AEO with live evidence.

*Generated 2026-05-28. Supersedes the 2026-05-05 Pass V–VIII series for headline scoring.*
