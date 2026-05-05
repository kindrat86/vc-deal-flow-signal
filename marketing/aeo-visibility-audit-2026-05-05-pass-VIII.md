# AEO/SEO/GEO/AIO/LLMO Visibility Audit — Pass VIII (2026-05-05 night)

**Cadence:** 8th audit pass on 2026-05-05 (post-VII at 92→94 composite).
**Trigger:** User asked for an extremely detailed audit of every relevant acronym, scored 0–100.
**Production deployment:** `dpl_1gmbY92Ve3TzHeXJfRwxWQuVJPCf`.
**Branch:** `claude/dreamy-zhukovsky-6f4a3c`.

---

## Executive summary

- Discovered that pass VII's 5 `/api/v1/*` alias routes + 6 `/.well-known/*` alias routes had silently regressed to **404 / 308** in prod despite source files being intact. Root cause: `dynamic = "force-static"` on alias-via-import handlers caused build-time evaluation failures that dropped them from the static manifest without surfacing build errors.
- Fixed all 11 broken aliases by dropping `force-static` (now dynamic per-request). Lambda invocation cost is negligible — these are agent-only surfaces.
- Added 4 net-new high-leverage surfaces: `/.well-known/discover.json` umbrella manifest enumerating 64 endpoints, `/openapi.json` root rewrite, `/.well-known/llms-full.txt`, `/.well-known/qa.jsonl`.
- 16 endpoints went 404/308 → **200** in production, all verified post-deploy.
- Composite score moved **88 → 96 projected**.

---

## Scoring (0–100 per dimension, before → after)

| Dimension | Before | After | Δ | Notes |
|---|---|---|---|---|
| **SEO** (traditional search) | 92 | 95 | +3 | `/openapi.json` root now 200; sitemap.xml index → 1,330+ URLs across 5 sub-sitemaps still healthy. |
| **pSEO** (programmatic SEO) | 96 | 96 | 0 | 287 sector URLs, 518 startup URLs, 200 content URLs, 94 crossings, 131 core. Strong. |
| **GEO** (Generative Engine Optimization) | 88 | 95 | +7 | All `.well-known` agent + schema surfaces now 200-direct (no 308 hops); agent-card.json + openapi.json reachable from both root and `.well-known`. |
| **AEO** (Answer Engine Optimization) | 85 | 95 | +10 | `/answers/*` (50+ pages) + `/api/answer` + `/api/ask` + `/api/v1/answers.json` + `/qa.jsonl` all 200; `/.well-known/discover.json` lets retrieval pipelines map the full surface in one fetch. |
| **AIO** (AI / Agent-discoverable) | 84 | 95 | +11 | All 11 v1 + well-known aliases working; A2A `/agent.json` legacy alias now 200; `/openapi.json` root + `.well-known` + `/api/v1` all reachable. |
| **LLMO** (LLM optimization) | 87 | 92 | +5 | `/.well-known/llms-full.txt` + `/.well-known/qa.jsonl` now reachable from agents that probe well-known first. |
| **E-E-A-T** | 96 | 96 | 0 | ORCID, SSRN, Wikidata, DOI, citations, attestations, founder bio, methodology, standards, reproducibility, corrections all in place. |
| **VSO** (Voice Search) | 78 | 78 | 0 | FAQPage + speakable in JSON-LD; no audio infra (anonymity rule precludes podcasts). |
| **Crawlability** | 90 | 94 | +4 | All v1 + well-known aliases reachable; sitemap-index serving 5 sub-sitemaps; IndexNow auto-pinged 1,406 URLs on this build. |
| **Trust** | 95 | 95 | 0 | HTTPS+HSTS preload, CSP, security.txt, security-policy.json, did-configuration.json, X-Frame-Options DENY. |
| **Discoverability** (well-known scope) | 76 | 96 | +20 | Was the weakest dimension. Now: 18 well-known surfaces 200-direct + 8 root aliases 200-direct + 11 `/api/v1/*` aliases 200 + new umbrella manifest at `/.well-known/discover.json`. |
| **Composite** | **88** | **96** | **+8** | Projected. Re-probe in monthly cadence (next 2026-06-04). |

---

## Probes that drove the audit

```
# All FAILED before pass VIII:
$ for u in /api/v1/{signals,agents,answers,changelog,dataset.jsonl} \
           /.well-known/{openapi.json,agent.json,agents.json,ai.json,sitemap.xml,freshness.json} \
           /openapi.json; do
    curl -s -o /dev/null -w "%{http_code}  $u\n" "https://signals.gitdealflow.com$u"
  done
404  /api/v1/signals.json     → became 200
404  /api/v1/agents.json      → became 200
404  /api/v1/answers.json     → became 200
404  /api/v1/changelog.json   → became 200
404  /api/v1/dataset.jsonl    → became 200
308  /.well-known/openapi.json → became 200
308  /.well-known/agent.json  → became 200
308  /.well-known/agents.json → became 200
308  /.well-known/ai.txt      → became 200
404  /.well-known/ai.json     → became 200
404  /.well-known/sitemap.xml → became 200
404  /.well-known/freshness.json → became 200
404  /openapi.json            → became 200

# Net-new in pass VIII:
$ curl -sI https://signals.gitdealflow.com/.well-known/discover.json     → 200, 12,572 bytes
$ curl -sI https://signals.gitdealflow.com/.well-known/llms-full.txt    → 200
$ curl -sI https://signals.gitdealflow.com/.well-known/qa.jsonl         → 200
```

---

## Root-cause analysis: why pass VI/VII aliases silently regressed

**Pattern that broke:**
```ts
// alias-via-import + force-static — fragile under Next 15+
import { GET as Up } from "@/app/.../route";
export const dynamic = "force-static";
export const runtime = "nodejs";
export async function GET(request) {
  const upstream = await Up(request);
  // wrap with canonical Link, return new Response()
}
```

**Why it failed:** When the alias declares `force-static`, Next.js tries to invoke `GET` once at build time and bake the response. But the upstream route doesn't always declare `force-static` itself, or reads `request.headers` (e.g. `if-none-match` in `/api/dataset.jsonl`). The build-time call returns an inconsistent state, the route gets dropped from the static manifest, and Vercel serves a 404.

**Why some aliases worked anyway:** `/.well-known/llms.txt` uses the same pattern but works because its upstream `/llms.txt/route.ts` declares `dynamic = "force-static"` + `revalidate = 3600` consistently — so the build-time evaluation is deterministic.

**Fix:** Drop `dynamic = "force-static"` from the alias. Now alias is dynamic per-request. The wrapping logic still works (call upstream, copy body, add canonical Link header). Cost: one Lambda invocation per request to that path. Acceptable since these are agent-only / discovery surfaces with low traffic.

**Lesson for future passes:** When using alias-via-import, do NOT add `force-static` to the alias. Either:
1. Make the alias dynamic (default) and let upstream's caching headers handle CDN cache, OR
2. Re-implement the alias as a fully standalone route (no upstream import).

---

## What shipped (file-level diff)

```
M  pseo-site/app/api/v1/signals.json/route.ts        — drop force-static + revalidate
M  pseo-site/app/api/v1/agents.json/route.ts         — drop force-static
M  pseo-site/app/api/v1/answers.json/route.ts        — drop force-static
M  pseo-site/app/api/v1/changelog.json/route.ts      — drop force-static
M  pseo-site/app/api/v1/dataset.jsonl/route.ts       — drop force-static
M  pseo-site/app/.well-known/openapi.json/route.ts   — drop force-static
M  pseo-site/app/.well-known/agent.json/route.ts     — drop force-static
M  pseo-site/app/.well-known/agents.json/route.ts    — drop force-static
M  pseo-site/app/.well-known/ai.txt/route.ts         — drop force-static
M  pseo-site/app/.well-known/ai.json/route.ts        — drop force-static
M  pseo-site/app/.well-known/sitemap.xml/route.ts    — drop force-static + revalidate
M  pseo-site/app/.well-known/freshness.json/route.ts — drop force-static + revalidate
M  pseo-site/next.config.ts                          — drop /.well-known/ai.txt rewrite (route handler authoritative now); add /openapi.json + /.well-known/llms-full.txt + /.well-known/qa.jsonl rewrites
A  pseo-site/app/.well-known/discover.json/route.ts  — NEW umbrella manifest (DataCatalog), 64 surfaces in 9 categories
```

---

## /.well-known/discover.json — what it does

One-shot probe for AI agents and retrieval pipelines that want to map the entire agent surface area without fanning out across 60+ URLs.

**Body shape:** Schema.org `DataCatalog` with surfaces[] enumerating every well-known, root-level, and `/api/v1/*` endpoint. Each entry has `url`, `format`, `category`, `description`. Categories: agent (8), api (17), policy (8), retrieval (7), schema (7), sitemap (7), feed (2), identity (6), human (2). Total **64 surfaces**.

**Why it matters:** Perplexity / ChatGPT-with-search / Claude search currently probe a small set of well-known URLs (mostly `/llms.txt`, `/sitemap.xml`, `/.well-known/agent-card.json`). Once they discover `/.well-known/discover.json`, they get the full agent surface map in one fetch — including the per-category index that lets them route follow-up probes intelligently.

---

## Verified surfaces post-deploy (2026-05-05 night)

```
200  /api/v1/signals.json    (57.3 KB body)
200  /api/v1/agents.json
200  /api/v1/answers.json    (269 KB body — full citation corpus)
200  /api/v1/changelog.json
200  /api/v1/dataset.jsonl
200  /api/v1/glossary.json   (already 200, unchanged)
200  /api/v1/faq.json        (already 200, unchanged)
200  /api/v1/methodology.json (already 200, unchanged)
200  /api/v1/openapi.json    (already 200, unchanged)
200  /api/v1/pricing.json    (already 200, unchanged)
200  /.well-known/openapi.json
200  /.well-known/agent.json
200  /.well-known/agents.json
200  /.well-known/ai.txt
200  /.well-known/ai.json
200  /.well-known/sitemap.xml
200  /.well-known/freshness.json (2.9 KB DataFeed)
200  /.well-known/discover.json  (12.6 KB DataCatalog — NEW)
200  /.well-known/llms-full.txt  (NEW alias)
200  /.well-known/qa.jsonl       (NEW alias)
200  /openapi.json               (NEW root rewrite, 31.2 KB OpenAPI 3.1 spec)
```

22 canonical surfaces re-verified still 200: /llms.txt, /robots.txt, /sitemap.xml, /api/openapi.json, /api/agents.json, /api/signals.json, /atom.xml, /rss.xml, /agents.json, /agents.txt, /agent-card.json, /humans.txt, /security.txt, /ai-policy.json, /compliance.json, /model.json, /api/schema.json, /api/health.json, /api/catalog.json, /dataset.json, /qa.jsonl, /llms-full.txt.

---

## Out-of-scope notes

- **/scout, /predicted/<week>, /manifesto, /scorecard, /experiments, /earned-plays, /dream-100, /distribution, /start-here, /decade-in-a-day, /roadmap** all 404 in prod. Per memory, these were "shipped" in unmerged claude/* branches (V4/V5/V6 Brunson trilogy work). Not part of this audit; they need a separate merge-to-main pass.
- **/sectors/<name>**, **/startups/<name>**, **/compare/<slug>**, **/best/<slug>**, **/built-with/<slug>** all 404 — but the actual pSEO patterns are `/startups-to-watch/<sector>-<period>` and `/startup/<slug>` (singular) which are healthy. Memory had stale URL conventions.
- **llms-full.txt is smaller (53 KB) than llms.txt (172 KB)** — intentional, llms-full is per-sector summaries while llms.txt is the full agent index of every page. Naming is ambiguous but not a bug.
- **/news-sitemap.xml is empty (179 bytes)** — correct per Google News spec (48-hour window with no recent posts in window). Will populate naturally when next blog post lands.

---

## Memory deltas to write

- **project**: AEO/SEO/pSEO/GEO/AIO audit VIII 2026-05-05 night — composite 88→96 projected, 16 surfaces fixed, /.well-known/discover.json shipped (64 surfaces in 9 categories), deploy `dpl_1gmbY92Ve3TzHeXJfRwxWQuVJPCf`.
- **feedback**: Don't use `dynamic = "force-static"` on alias-via-import routes. The build-time evaluation is fragile if upstream is dynamic. Either drop `force-static` (alias becomes dynamic, fine for low-traffic agent surfaces) or rewrite as fully standalone.
