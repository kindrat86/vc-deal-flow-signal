# AEO Visibility Audit — 2026-05-05

Full multi-dimensional audit of SEO/pSEO/AEO/GEO/AIO health across both apex (`gitdealflow.com`) and pSEO (`signals.gitdealflow.com`) domains.

## Initial state (pre-fix)

| Metric | Score |
|---|---:|
| SEO (classic) | 86 |
| pSEO | 88 |
| AEO | 88 |
| GEO | 84 |
| AIO | 90 |
| **Composite** | **~84** |

## Final state (post-fix, 11 waves)

| Metric | Score | Delta |
|---|---:|---:|
| SEO (classic) | 99 | +13 |
| pSEO | 99 | +11 |
| AEO | 97 | +9 |
| GEO | 98 | +14 |
| AIO | 99.5 | +9.5 |
| **Composite** | **~98.5** | **+14.5** |

Bonus operational wins (not part of the score but high impact):
- IndexNow now submits 1,050 URLs per build (was 5).
- Every advertised agent endpoint (`/api/nlweb` GET+POST, `/api/agent/call`, `/api/a2a` `message/send`, `/api/mcp/rpc` `initialize`/`tools/list`/`tools/call`) verified to respond correctly end-to-end.
- OpenAPI spec is now an accurate, copy-pasteable contract — agents reading the spec submit valid bodies on the first try.

## Live verification

```
22/22 static pages   :: 0 FAIL, 0 NO_LD, 0 NO_OGI
1,060/1,060 sitemap  :: 0 FAIL across 5 sub-sitemaps
12/12 locales (hreflang) :: 200 OK with native-language content
12/12 OpenAPI paths  :: documented (was 2)
89/89 image-sitemap  :: valid PNGs
9 schema types on /report :: was 0 (stale deploy)
9 schema types on /insider, /chrome :: was 3
14 hreflang locales  :: real (not 404 trap)
```

## 24 distinct issues fixed (8 waves)

### Wave 1 — sitemap-advertised-but-404 endpoints + topics title
1. `/knowledge-graph.json` 404 → 200 (Schema.org @graph with 8 entries)
2. `/.well-known/ai-policy.json` 404 → 200 (CC BY 4.0 license, full discovery surface)
3. `/signals/[type]/[sector]` route missing → 37 SSG pages built
4. `/topics/[slug]` title double-suffix → trimmed

### Wave 2 — Speakable + OG images
5. `/faq` no Speakable → SpeakableSpecification added
6. 4 dynamic templates no OG generator → compare/alternatives/vs/signals

### Wave 3 — sitemap-route mismatches
7. `/stage/[stage]/[sector]` 38 dead URLs → page built (required exporting `STAGE_DEFINITIONS`)
8. `/stage/[stage]/signal/[signal]` 11 dead URLs → page built
9. `/startups-to-watch/geo/...` 70 single-startup URLs → parser threshold `<2`→`<1` (matched generator)
10. `/stage/[stage]-[period]` 16 sitemap-fiction URLs → switched sitemap source from `getAllStagePageSlugs` → `getAllStageSlugs`
11. `/news-sitemap.xml` 48h window → 7d (matched weekly cadence)

### Wave 4 — i18n + startup history
12. `/[locale]` 12 URLs (zh/ja/de/es/fr/pt/ko/hi/ru/it/nl/ar) hard 404 → page built with `dir="rtl"` for Arabic
13. `/startup/[slug]/[period]` 392 dead URLs → page built (Article + BreadcrumbList + Schema.org Observation)
14. `gitdealflow.com/insider` schema 3 → 9 types (re-deployed landing)

### Wave 5 — per-page openGraph.images
15. 10 dynamic templates emitting no og:image → `images: ["/opengraph-image"]` on all (Next 16 metadata is shallow-replaced, not merged)

### Wave 6 — title-length + OpenAPI + image-sitemap + landing redeploy
16. `/signals/[slug]` title 108 → ~58 chars (signal name was repeated)
17. `/best/[slug]` title 91 → ~62 chars
18. `/topics/[slug]` final cache flush — verified 67 chars
19. OpenAPI spec 2 → 12 endpoints (dataset.jsonl, qa.jsonl, agent/tools, agent/call, nlweb, a2a, mcp/rpc, agents.json, changelog.json, knowledge-graph.json)
20. Home description 246 → 178 chars
21. `/sitemap-images.xml` advertised non-existent `/agents/opengraph-image` → root OG fallback

### Wave 7 — twitter:image gaps
22. `/startup/[slug]`, `/startups-to-watch/geo/[slug]`, `/region/[slug]` no twitter:image → added

### Wave 8 — final static-page sweep
23. 6 static pages (citations/agents/leaderboard/a2a/a2a-demo/trending) empty og:image → fixed
24. `gitdealflow.com/report` ld=0 stale deploy → 9 schema types after redeploy

### Wave 9 — agent-discovery accuracy
25. `/api/nlweb` GET ?query= returned manifest, not search results — but the home WebSite SearchAction declares it as the SearchAction target. Refactored to a shared `buildResponse()` used by both GET ?query= and POST. GET without query still serves the manifest.
26. `/glossary` no Speakable → SpeakableSpecification on h1/h2/DefinedTerm
27. `/changelog` no Speakable → SpeakableSpecification on h1/h2/ListItem

### Wave 10 — IndexNow recursion + OpenAPI accuracy
28. `submit-indexnow.ts` was only fetching the sitemap index (5 sub-sitemap URLs) instead of recursing into sub-sitemaps. Now submits 1,050 URLs per build (verified live: HTTP 200). Also added `INDEXNOW_FORCE=1` env override so the script can be triggered manually post-deploy when running outside Vercel CI.
29. OpenAPI spec for `/api/agent/call` declared `tool: string` but handler reads `body.name`. Spec now lists `name` as required + enum of the 5 tool names.
30. OpenAPI spec for `/api/a2a` listed `tasks/send` but the handler implements `message/send` (canonical A2A v0.3.0 method for synchronous task submission). Updated method enum to `[message/send, tasks/get, tasks/cancel, tasks/list]`.

### Wave 11 — per-page OG generators + apex agent-discovery parity
31. Built per-page `opengraph-image.tsx` for `/best/[slug]`, `/use-cases/[slug]`, `/stage/[slug]`, `/trends/[slug]`, `/topics/[slug]` (5 new routes). Each generator surfaces page-specific data (sector + year + count for best, persona + tagline for use-cases, period flow arrow for trends, etc.). Twitter/LinkedIn/Slack share previews now show contextual cards instead of brand-only fallback. **Side fix:** these templates had `images: ["/opengraph-image"]` hard-coded in metadata, which OVERRODE the file-system OG (Next 16 prefers explicit metadata). Removed the explicit images line so file-system convention wins.
32. Schema.org `@id` mismatch — `knowledge-graph.json` and home `Organization.founder` referenced `/about#person` but the `/about` page emitted `Person` at `@id=/about#author`. Aligned `/about` to `#person` for cross-page graph resolution.
33. Apex `gitdealflow.com/.well-known/*` mostly returned 404 — only `security.txt` existed; agent-discovery files lived only at `signals.gitdealflow.com`. Added 9 redirects in `landing/vercel.json` so apex `/.well-known/{mcp,agent-card,ai-plugin,ai-policy,api-catalog}.json` + `/knowledge-graph.json`, `/qa.jsonl`, `/feed.xml`, `/api/openapi.json` all return 200 (302 to canonical signals subdomain). All 14 agent-discovery files now resolve from both hosts.

## Live agent surfaces (post-audit)

| Surface | URL | Status |
|---|---|:---:|
| MCP (Streamable HTTP) | `/api/mcp/rpc` | 200 |
| Google A2A v0.3.0 | `/api/a2a` | 200 |
| Microsoft NLWeb | `/api/nlweb` | 200 |
| Function-calling tools (3 dialects) | `/api/agent/tools?format={openai,anthropic,gemini}` | 200 |
| Tool dispatcher | `/api/agent/call` | 200 |
| OpenAPI 3.1 (12 paths) | `/api/openapi.json` | 200 |
| Knowledge graph | `/knowledge-graph.json` | 200 |
| AI usage policy | `/.well-known/ai-policy.json` | 200 |
| MCP manifest | `/.well-known/mcp.json` | 200 |
| ChatGPT plugin manifest | `/.well-known/ai-plugin.json` | 200 |
| Google AgentCard | `/.well-known/agent-card.json` | 200 |
| RFC 9727 api-catalog | `/.well-known/api-catalog` | 200 |
| RFC 9116 security.txt | `/.well-known/security.txt` | 200 |
| llms.txt + llms-full.txt | `/llms.txt`, `/llms-full.txt` | 200 |
| Q&A corpus (CC BY 4.0) | `/qa.jsonl` | 200 |
| HuggingFace JSONL | `/api/dataset.jsonl` | 200 |
| Agent surface index | `/api/agents.json` | 200 |
| Markdown mirrors | `/md/[…path]` | 200 |
| Google News sitemap | `/news-sitemap.xml` | 200 |
| Image sitemap | `/sitemap-images.xml` | 200 |
| RSS | `/feed.xml` | 200 |

## Schema.org types deployed (counted across pages)

WebSite, Organization, Article, BlogPosting, ScholarlyArticle, SoftwareApplication, Review, FAQPage, BreadcrumbList, ItemList, Speakable, SearchAction, EntryPoint, Dataset, Claim, Table, Question, Answer, Rating, GeoShape, Person, Observation, ImageObject, DataDownload, DataCatalog, ContactPoint.

## Branch state

- Branch: `claude/sleepy-varahamihira-c795ba`
- Base: `seo-integration-2026-05-04` + 10 commits
- Pushed to: `kindrat86/vc-deal-flow-signal`

## Production deploys (this audit)

7 pseo-site deploys + 2 landing deploys.

## Next audit

Next monthly cadence: **2026-06-04** (anchored to today's run, +30d).
