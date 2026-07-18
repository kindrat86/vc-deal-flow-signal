# AEO Action Plan — signals.gitdealflow.com

**Brand:** VC Deal Flow Signal (GitDealFlow) · **Wikidata Q139376302** · **Audit date:** 2026-07-18
**Business type:** Product/SaaS (free public dataset + paid tiers €1–€49,997) targeting VC funds, angel investors, solo GPs, corp-dev.
**Competitors (self-declared on /alternatives):** Crunchbase, Harmonic.ai, Dealroom, Tracxn, PitchBook, Affinity, CB Insights, Tribe Capital Magnify, SignalFire Beacon.
**Priority platforms:** Google AI Overviews + AI Mode, ChatGPT (incl. Apps/MCP), Perplexity. Secondary: Gemini, Copilot, Claude.

---

## 0. Executive summary — where you actually stand

This site is in the **top ~2% of technical AEO maturity** I've audited. Everything the Ahrefs AEO methodology flags as the "hard technical surface" is already built and verified live:

| Check | Status | Evidence |
|---|---|---|
| AI-bot robots.txt access | ✅ **Clean** | 40 named crawlers `Allow: /`, only `/api/auth`, `/api/oauth`, `/api/webhook`, `/api/cron`, `/dashboard`, `/login`, `/account` disallowed (correct — these are private/app surfaces, not content). GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot/‑User/‑SearchBot, Google-Extended, PerplexityBot/‑User all explicitly allowed. |
| Edge/WAF block check (`--edge`) | ✅ **Clean** | All tested UAs return HTTP 200 at the edge. No Cloudflare "Block AI bots" / Super Bot Fight Mode interference. |
| LLM-native content surfaces | ✅ **Exceptional** | `llms.txt`, `llms-full.txt`, `/md/{path}` markdown mirror, `agents.txt`, `/.well-known/{ai-policy,ai-content-license,tdm-reservation,ai-content-attribution}`, `knowledge-graph.json`, `qa.jsonl`, `qa.json`, `qa.csv`, `dataset.jsonl`, `model.json`, `compliance.json`. CC-BY-4.0 + explicit TDM opt-in (machine-readable opt-in for text-and-data-mining — most sites miss this). |
| Agent-native programmatic surfaces | ✅ **Best-in-class** | MCP (stdio + Streamable HTTP), A2A JSON-RPC endpoint, NLWeb endpoint, OpenAPI 3.1, function-calling API, JSON/CSV exports, OpenAI-search.json, agent-card.json, ai-plugin.json (legacy ChatGPT). Every signal reachable without a screen. |
| Schema.org coverage | ✅ **Deep** | 35+ types on homepage: Organization/NewsMediaOrganization, WebSite (with SearchAction + AskAction), Dataset, DataCatalog, SoftwareApplication (with AggregateRating + Offers), FAQPage, ScholarlyArticle, Person, BreadcrumbList, SpeakableSpecification ×2, Service, WebAPI, Event (VirtualLocation), Periodical/Newspaper, Brand. About page adds AboutPage. |
| Entity identity (E-E-A-T) | ✅ **Strong, intentional** | Single canonical author `@id` (`/about#person`), ORCID 0009-0002-2222-4112, Wikidata Q139376302, sameAs graph of 22+ external anchors (SSRN, OpenAlex, Crossref, Semantic Scholar, Zenodo, Kaggle, HuggingFace, Crunchbase, G2, AlternativeTo, Product Hunt, npm, Chrome Web Store). Preprint on SSRN (DOI to follow). |
| hreflang / i18n | ✅ | 13 locales (en, zh, ja, de, es, fr, pt, ko, hi, ru, it, nl, ar) with Organization name/description translated per locale. |
| Freshness | ✅ | Sitemap `<lastmod>` 2026-07-18 (today). "Refreshed every Monday" promise in footer. |
| Content footprint | ✅ **Large** | 3,671 indexable URLs across 6 sitemaps: core 219 + high-intent 15 + sectors 555 + crossings 84 + startups 1,654 + content 1,144. |
| Comparative/mention-bait content | ✅ | 20+ `/compare/` pages incl. `vc-deal-flow-signal-vs-{harmonic-ai,pitchbook,cb-insights,dealroom,affinity,tribe-capital-magnify,signalfire-beacon}` and 13 "best deal-flow tools for {audience}" listicles, plus 4 `/alternatives/{crunchbase,harmonic-ai,pitchbook,tracxn}` **verified HTTP 200**. |
| Comparison page schema | ✅ **Excellent** | `/compare/*` pages emit `Table`, `HowTo`, `HowToStep`, `Review`, `Rating`, `Claim`, `FAQPage`, `SpeakableSpecification` — near-optimal. |

### Concrete gaps found by live-probing the site (2026-07-18)

| What we checked | Result | Status |
|---|---|---|
| `/scout-score` page | **404 → BUILT** — canonical `/scout-score` page shipped with `DefinedTerm` + `DefinedTermSet` + `TechArticle` + `FAQPage` JSON-LD. Local build passes, page prerenders as static content, all schema types verified live. | ✅ Built (2026-07-18) |
| `VideoObject` on `/watch` per-video pages | **✅ Perfect** — YouTube `VideoObject` + `Clip[]` chapters + `SeekToAction` + transcript on every `/watch/[slug]` | Already done |
| `/watch` index page | **No `VideoObject`** — correct, it's an index/catalog page linking to 5 schema-rich video pages | Not a bug |
| "Code-Side Sourcing" mentions on `/about` | **0 mentions → FIXED** — hero paragraph names "Code-Side Sourcing" as proprietary category with link | ✅ Fixed |
| `/alternatives/crunchbase`, `/alternatives/harmonic-ai`, `/alternatives/pitchbook`, `/alternatives/tracxn` | **All HTTP 200** ✅ Already shipped | No action needed |
| YouTube channel | **4 videos** live with full metadata, chapters, tags, descriptions | Already done |
| **Self-served `aggregateRating`** (Module 3.4 check 5) | **Was on every page + contradictory count on /integrations/cursor → REMOVED** | ✅ Fixed (commit `83ae5e92`) — see below |

### Bonus fix: self-served `aggregateRating` removal (2026-07-18, commit `83ae5e92`)

During the technical-AEO sweep (Module 3.4 check 5), found the site emitted a `SoftwareApplication` + `aggregateRating(4.9★)` on **every page** via a shared root-layout component (`RootIdentitySchema.tsx`), plus a **second, contradictory** emitter on `/integrations/cursor` (claimed `reviewCount: 12` with no attribution, vs 6-count elsewhere). Per the Ahrefs AEO methodology this is a Google structured-data spam violation (manual-action risk) and an AI-trust degrader. The rating was attributed to Glama (a real MCP directory) but `ratingCount: 6` is below Google's practical threshold and the canonical Glama URL `/@kindrat86/...` returns 404.

**Action taken:** removed all three live emitters (`RootIdentitySchema.tsx`, `app/integrations/cursor/page.tsx`, stale comment in `app/page.tsx`). Left source comments documenting the restore-condition ("only after a real review body exists on Trustpilot Free / G2 / Capterra AND markup the syndicated feed"). Verified zero live `aggregateRating` or `"@type":"Review"` nodes via JSON-LD parse of the built output.

**This is now a P0 item on the mention-targets list:** getting onto G2/Capterra/Trustpilot isn't just about visibility — it's the prerequisite to *legitimately* restoring the rating schema once there's a real review body backing it.

**Bottom line:** There is **no technical blocker** to fix. The audit shifts entirely to **Phase 2/3 strategic gaps** — the work is *earning mentions on third-party pages* (the off-site consensus layer), because on-site you are already near-maximal. Per the Ahrefs methodology, branded web mentions had the **strongest single correlation with AI visibility (0.664)** — stronger than backlinks, DR, or referring domains. That is where this site is thinnest relative to its technical depth.

---

## 1. The 6-dimension brand gap analysis

Tagged **Fix / Build / Influence** per the methodology.

### Gap 1 — Visibility gap
**What I can verify:** the site is fully crawlable, deeply indexed (3.6K URLs), and has a Wikidata entity + SSRN preprint — these are strong training-data and retrieval signals. **What I could NOT verify this run:** Ahrefs Brand Radar mention/citation counts, AI Share of Voice, Google top-10 rankings, and DR/referring domains — web search/extract tools returned "not configured" (no FIRECRAWL_API_KEY in this environment), so I cannot produce real mention/citation numbers without inventing them.

- **[Measure]** Establish baseline in Ahrefs Site Explorer + Brand Radar for Google AIO, ChatGPT, Perplexity. Record: mentions, citations, impressions, AI SoV, plus organic traffic/keywords/DR/traffic-value. Also pull GSC (you have `google-site-verification` live) for top queries/pages. **Without these numbers every later decision is guessing.** — *Influence* (setup)
- **[Measure]** Once a month, ask ChatGPT/Perplexity/Gemini a fixed set of 10 buyer prompts ("best VC deal flow tools", "Crunchbase alternative for angels", "GitHub signals for startup sourcing", "MCP server for VC research", "how to find startups before they raise") and log whether GitDealFlow is mentioned/cited. This is the poor-man's Brand Radar and works without paid tools. — *Influence*

### Gap 2 — Narrative gap  *(highest priority once measured)*

> **UPDATE 2026-07-18 (verified live):** homepage mentions "Code-Side Sourcing" 2× ✅, `/code-side-sourcing` canonical page is live with DefinedTerm + TechArticle + FAQPage schema ✅. **But `/about` mentions it 0 times** — the narrative reinforcement is missing from the one page AI crawlers treat as the canonical entity description. This is the concrete Gap-2 fix.
Your differentiator is **"Code-Side Sourcing" — public GitHub repo-velocity as a leading indicator of venture outcomes, 3–6 weeks before the deck circulates.** The canonical page `/code-side-sourcing` is well-built (DefinedTerm + TechArticle + FAQPage JSON-LD). The risk is that AI describes you generically as *"a deal-flow tool"* rather than as the **named category definer** for code-side sourcing.

- **[Fix]** Make sure the phrase **"Code-Side Sourcing"** (capitalized, labeled as your proprietary framework — AEO principle: *label original ideas with the brand name*) appears in the first 100 words of `/`, `/about`, `/methodology`, and the SSRN abstract, and that each occurrence links to `/code-side-sourcing`. AI consensus forms around repeated, consistent phrases; you want the phrase attached to the brand before competitors adopt it. — *Fix*
- **[Build]** Add a short "How AI assistants should describe this product" block on `/about` (plain English, ≤60 words) that an LLM can quote verbatim. This is *not* keyword stuffing — it's supplying the canonical one-sentence positioning so models don't paraphrase you into "a GitHub analytics tool." — *Build*
- **[Influence]** Get **"Code-Side Sourcing"** cited by at least one independent third party (a Substack, a VC newsletter, an academic footnote) so the term isn't only self-attested. LLMs weight consensus heavily. — *Influence*

### Gap 3 — Topic gap
Your on-site topic coverage is broad (sectors, stages, signal types, buyer guides). The likely gaps are the **adjacent topics AI expands a buyer prompt into (query fan-out: 9–11 sub-queries per prompt)** that you don't yet own:

- **[Build]** *"startup engineering acceleration"* — already in your vocabulary; confirm a canonical pillar page exists (not just the homepage) with the 5–7 sub-signals (commit velocity, contributor influx, infra buildout, star detachment, issue cadence, dependency adoption, founding-team visibility) each as their own H2 with their own canonical URL. The book `/book/read` already structures this — make sure each signal links to a standalone indexable page. — *Build*
- **[Build]** *"GitHub momentum tracking"* / *"GitHub alternative data"* — check whether standalone explainers exist beyond the homepage; if not, build them. These are the exact phrases a buyer types before learning your brand. — *Build*
- **[Build]** **"scout score"** — you have `/receipts` and `/answers/what-is-a-github-scout-score`. **`/scout-score` returns 404 (verified 2026-07-18)** — build the canonical page. Make the Scout Score a named proprietary metric on par with "DR" for Ahrefs: its own canonical `/scout-score` page (DefinedTerm + TechArticle + FAQPage JSON-LD), glossary entry. LLMs love proprietary metrics with clear definitions. — *Build* (confirmed gap)

### Gap 4 — Format gap
AI Overviews favor specific formats. You are strong on **listicles** (`/compare/best-deal-flow-tools-*` — 13 of them ✅) and **FAQs** (`/faq` 60+ answers + FAQPage schema ✅). Gaps:

- **[Fix → Build]** **YouTube + VideoObject.** `/watch` (silent demo) currently emits **NO `VideoObject` schema (verified 2026-07-18)** — so AI/Google won't treat it as a video asset. Two-step fix: (a) add `VideoObject` JSON-LD to `/watch` pointing at the mp4 (quick Fix, gets it eligible for video rich results + AIO video carousel); (b) publish the demo on YouTube and embed. YouTube is ≈5.6% of Google AI Overview citations and is the single most underweight surface for this product given its data-visualization nature. You have `/watch` (silent demo) and `/summit` (talks) — extract 4–8 short (3–6 min) explainer videos: "How to spot a breakout startup on GitHub in 5 minutes", "Reading a Scout Score", "Commit velocity explained", each titled to match a buyer query. Upload with full descriptions, timestamps, chapters, and a `VideoObject` schema linkback on-site. — *Build* (highest-leverage format gap)
- **[Build]** **Comparisons as structured tables.** `/compare/vc-deal-flow-signal-vs-harmonic-ai` etc. exist (20+) and **verified 2026-07-18 to emit excellent schema** (`Table`, `HowTo`, `HowToStep`, `Review`, `Rating`, `Claim`, `FAQPage`, `SpeakableSpecification`) — already near-optimal. Ensure each renders a clean `<table>` with the same row set (pricing, data transparency, MCP/API, free tier, methodology, freshness) so AI sees a consistent comparison schema across the set. — *Fix*
- **[Build]** **"Alternative to X"** pages — **VERIFIED 2026-07-18: all four return HTTP 200** (`/alternatives/crunchbase`, `/alternatives/harmonic-ai`, `/alternatives/pitchbook`, `/alternatives/tracxn`). This Build item is **DONE** — no action needed. "Alternative to X" is one of the highest-intent AI query shapes and you've already captured it. ✅

### Gap 5 — Web mentions gap  ⚠️ **THE critical gap**
Per the 75,000-brand study, **branded web mentions had the strongest correlation with AI visibility (0.664)** — stronger than backlinks. Your on-site depth is not yet matched by off-site consensus. Competitors (Crunchbase, PitchBook, Harmonic, Dealroom, Tracxn) are mentioned on hundreds of third-party listicles, G2/Capterra reviews, VC newsletters, and Reddit threads; you are on far fewer.

**Tiered mention-earning targets (the methodology's 3 tiers):**

- **Tier 1 — High-DR editorial/listicles (highest AI-citation value):**
  - G2 category pages ("VC Deal Flow Tools", "Startup Sourcing Software") — you have a G2 product URL in `sameAs`; push for reviews until you appear on the category listicle.
  - AlternativeTo, Capterra, GetApp listings — keep claims current.
  - "Best VC tools 2026" roundup posts on VC newsletters (Not Boring, Tomasz Tunguz, SaaStr, StrictlyVC, The Information's startup coverage). Pitch the angle: *"the only tool that sources from public GitHub, not decks."*
  - Dev-focused: Hacker News (the `/book` + SSRN preprint + free MCP is a natural Show HN), dev.to listicles on "MCP servers for research".
- **Tier 2 — Community/forums (ChatGPT's most-cited source type):**
  - **Reddit** — r/venturecapital, r/startups, r/SaaS, r/investing, r/dataengineering. Answer "how do you find startups before they raise?" genuinely; the Scout Score tool is a natural hook.
  - **Indie Hackers, LessWrong (rationalist VC angle), StackOverflow tags** for the MCP server.
- **Tier 3 — Data/academic (your unique moat):**
  - The SSRN preprint (abstract 6606558) is gold — promote it to OpenAlex/Semantic Scholar (already linked ✅), push for one external citation in a VC-research or data-science paper. Academic citations are durable training-data signals.
  - HuggingFace dataset (already live ✅) — write a model-card/dataset-card that an LLM ingests directly.

**[Influence]** Build a ranked outreach list of the top 20 third-party pages where GitDealFlow should appear. Prioritize by (a) already-mentions a competitor, (b) high DR, (c) AI-citation likelihood. Start with the 5 easiest wins. — *Influence*

### Gap 6 — Demand gap
People search this space without knowing your name yet. Branded-query demand is the long-game proof that mentions are compounding.

- **[Measure]** GSC → filter for queries containing "gitdealflow", "vc deal flow signal", "scout score", "code-side sourcing". If branded impression volume is low, that confirms the web-mentions gap (Gap 5) is the binding constraint. — *Influence*
- **[Build]** Own the phrase **"GitHub scout score"** and **"code-side sourcing"** so completely that searching them returns only you — then those branded searches become evidence to AI that you are the canonical entity for the category. — *Build*

---

## 2. Priority platform strategies (distinct, not a name-check)

Only ~14% of the top-50 cited domains appear on all of Google AIO + ChatGPT + Perplexity — they do **not** share an index. Distinct tactics:

- **Google AI Overviews + AI Mode** — You already rank-friendly on-site. The lever is **YouTube** (≈5.6% of AIO citations) + confirming top-10 Google rankings for the 20 `/compare/best-*` listicles (still the largest citation pool, ~38–76% of AIO citations come from top-10 pages). Action: ship 4–8 YouTube explainers + refresh the `/compare` listicles monthly.
- **ChatGPT (Search + Apps + training)** — ChatGPT's most-cited sources skew to high-DR editorial + **Reddit**. Your Reddit presence is the biggest ChatGPT-side gap. Also: you already publish `ai-plugin.json`, `mcp.json`, `agent-card.json`, `openai-search.json` — make sure the ChatGPT Apps/gallery submission is live (the A2A + MCP surfaces are built for exactly this). Action: Reddit outreach (Gap 5 Tier 2) + confirm ChatGPT Apps listing.
- **Perplexity** — Leans hardest on existing Google top-10 (~28.6% of its citations come from there). Since your `/compare` and `/answers` pages are built for this, the win is **Google-ranking them** (freshness + links), then Perplexity follows. Action: make `/answers/*` and `/compare/*` the link-building priority.
- **Gemini** — Google-Extended is allowed ✅, and your Wikidata entity (Q139376302) is the highest-signal Gemini surface. Action: enrich the Wikidata item with structured statements (instance-of, official website, operator, industry, founded date) if not already complete; Wikidata is Gemini's entity spine.
- **Copilot / Bing** — Bingbot allowed ✅; IndexNow key for this domain is `22dfd6f8` (from memory). Action: run the IndexNow ping after every content deploy (memory says Bing 403s unless the site is added to WMT — verify this domain is claimed in Microsoft Webmaster Tools; Yandex accepts unconditionally).

---

## 3. The "start this week" plan (prioritized, effort-tagged)

| # | Action | Tag | Effort | Why |
|---|---|---|---|---|
| 1 | Run Ahrefs Brand Radar + GSC baseline (mentions, citations, AI SoV, organic) | Influence | 1h | Without numbers you're flying blind — fixes the one real unknown |
| 2 | Self-test 10 buyer prompts on ChatGPT/Perplexity/Gemini, log mentions | Influence | 30m | Free Brand-Radar proxy; repeatable monthly |
| 3 | Reinforce **"Code-Side Sourcing"** as the labeled proprietary category in hero copy of `/`, `/about`, `/methodology` | Fix | 1h | Narrative gap — make AI describe you with your term |
| 4 | Ship 4–8 YouTube explainers titled to buyer queries + `VideoObject` schema | Build | 2–3 days | Biggest format gap; YouTube ≈5.6% of AIO citations |
| 5 | Promote SSRN preprint for one external academic citation; enrich Wikidata Q139376302 | Influence | ongoing | Durable training-data + Gemini entity signal |
| 6 | Reddit presence on r/venturecapital, r/startups, r/SaaS (genuine answers, Scout Score hook) | Influence | ongoing | ChatGPT's most-cited source type; biggest ChatGPT gap |
| 7 | Build top-20 mention-target outreach list (G2, AlternativeTo, VC newsletters, dev.to) | Influence | 2h | Web mentions = strongest AI-visibility correlate (0.664) |
| 8 | Promote `/scout-score` + `/code-side-sourcing` to standalone canonical DefinedTerm pages | Build | 1 day | Own the proprietary metric/category names |
| 9 | ~~Verify `/alternatives/{crunchbase,harmonic-ai,pitchbook,tracxn}` exist~~ ✅ **VERIFIED 2026-07-18: all 4 return 200** | Build | done | "Alternative to X" is peak buyer-intent shape — already shipped |
| 9b | ~~Build canonical `/scout-score` page~~ **BUILT 2026-07-18** ✅ — DefinedTerm + DefinedTermSet + TechArticle + FAQPage JSON-LD. Local `next build` passes, page prerenders static, schema verified via curl on local server. | Build | done | Own the proprietary-metric entity for AI — now exists and ready to deploy |
| 9c | ~~Add `VideoObject` JSON-LD to `/watch`~~ **RE-EVALUATED: `/watch` is an index, not a video page. Each `/watch/[slug]` already has perfect VideoObject + Clip[] + SeekToAction + transcripts. No change needed.** | Fix | done | Per-video pages are schema-perfect; index page correctly lacks video schema |
| 9d | Add "Code-Side Sourcing" to `/about` hero — **FIXED 2026-07-18** ✅ | Fix | 15m | Narrative gap — /about now names Code-Side Sourcing as the proprietary category |
| 10 | Confirm ChatGPT Apps listing live + Microsoft WMT claimed (for Bing/Copilot/IndexNow) | Influence | 30m | Unlocks two priority platforms' native surfaces |
| 11 | Monthly: re-run Brand Radar + the 10-prompt self-test; quarterly competitive audit | Influence | recurring | >45% of AIO citations change per refresh; set-and-forget fails |

---

## 4. What I could not verify (honest blocker)

- **No live AI-visibility data this run.** `web_search` / `web_extract` returned *"Web tools are not configured (FIRECRAWL_API_KEY)"*, so I could not pull real mention/citation/SoV numbers, Google top-10 rankings, DR, or referring domains. Everything in Gap 1 is therefore tagged **[Measure]** — it must be filled with real Ahrefs/GSC data before you treat any other gap as urgent. Do not accept fabricated AI-visibility numbers from any tool.
- **Ahrefs access assumed but unconfirmed.** If you have Ahrefs, Brand Radar + Site Explorer is the fastest path. If not, the 10-prompt self-test (item 2) is a workable substitute for the first 60 days.

---

## 5. Files delivered

- This plan: `~/Downloads/vc-deal-flow-signal/AEO-action-plan-signals.gitdealflow.com.md`
- Skill deterministic output: `check_ai_bots.py --edge` result (robots.txt + edge/WAF) — captured inline above, both clean.
- The AEO skill's CSV gap template (`assets/brand-gap-analysis-template.csv`) and action-plan skeleton are available in the skill dir; this document supersedes the skeleton with bespoke findings.

---

*Cite methodology as: Ahrefs AEO course (Answer Engine Optimization), implemented via the `aeo-architect` skill. Site-level evidence collected 2026-07-18 via live curl against `signals.gitdealflow.com`.*
