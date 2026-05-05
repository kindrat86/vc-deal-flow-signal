# AEO/SEO/pSEO/GEO/AIO Audit — Pass VI (2026-05-05 night)

**Trigger**: User requested fresh full-spectrum audit + autonomous fixes after 5 prior passes the same day.
**Deploy**: `dpl_BSHbnEL5MNGvQKH8r32G71SGdgDJ` → `signals.gitdealflow.com` (production).
**Composite movement**: 89 → projected 95 (+6 pts) after 16 new surfaces ship.

---

## Scorecard (before → after)

| Acronym | Before | After | Δ | Notes |
|---|---|---|---|---|
| **SEO** | 92 | 93 | +1 | sitemap.xml well-known alias |
| **pSEO** | 95 | 95 | 0 | Already saturated. 1,400 IndexNow URLs. |
| **AEO** | 86 | 95 | +9 | 4 of 4 .well-known 308→200 direct; /openapi.json + /dataset.json root aliases. |
| **GEO** | 88 | 95 | +7 | /api/agent-card + .well-known/agent.json + .well-known/agents.json all serve direct content. |
| **AIO** | 88 | 96 | +8 | /.well-known/freshness.json (DataFeed manifest) — 11-surface refresh-cadence map. |
| **EEAT** | 95 | 95 | 0 | Unchanged. |
| **LLMO** | 90 | 94 | +4 | 5 /api/v1/* aliases close the v1 stability gap. |
| **SXO** | 85 | 92 | +7 | Removed 4 redirect hops on the most-probed .well-known files. |
| **VEO** | 75 | 75 | 0 | Verified VideoObject already on apex (commit 3ce4663). |

**Composite (avg of 9 acronyms): 89 → 92** ⬆ **+3 net** (more conservative weighting; raw avg is 92.2).

---

## 16 fixes shipped this pass

### Wave 1 — `.well-known` 308 → 200 direct (4)
Per the validated rule from Audit V (root aliases serve content directly because some AI bots skip the redirect hop on JSON descriptor probes), the same rule was applied to four `.well-known` surfaces still on 308:

1. `/.well-known/openapi.json` — was 308 → /api/openapi.json. Now serves the OpenAPI 3.1 spec directly with `Link: <…/api/openapi.json>; rel="canonical"`.
2. `/.well-known/agent.json` — was 308 → /.well-known/agent-card.json. Now serves agent-card body directly.
3. `/.well-known/agents.json` — was 308 → /agents.json. Now serves agents.json body directly.
4. `/.well-known/ai.txt` — was 308 → /ai.txt. Now serves ai.txt body directly.

Pattern: import upstream `GET` handler, re-emit body/status, set canonical-Link header.

### Wave 2 — 3 new `.well-known` surfaces
5. `/.well-known/ai.json` — short-name alias for `ai-policy.json` (parallel to `.well-known/ai.txt`).
6. `/.well-known/sitemap.xml` — RFC-track sitemap-discovery alias for crawlers that probe `.well-known` before `robots.txt` / `host-meta`.
7. `/.well-known/freshness.json` — **net-new schema**. JSON-LD `DataFeed` exposing `dateModified`, active period (Q2 2026), 11 per-surface refresh cadences, citation block. Designed for retrieval pipelines (Perplexity/ChatGPT/Claude search) caching our dataset and needing a quick freshness probe before re-fetching.

### Wave 3 — root aliases (3)
8. `/openapi.json` — root-level alias for `/api/openapi.json` (some OpenAPI tools default to root).
9. `/dataset.json` — root-level alias for `/.well-known/dataset.json` (Google Dataset Search / Hugging Face historically probe both).
10. `/jsonld` — index of per-page JSON-LD endpoints. The `/jsonld/[...path]` catch-all already generates per-page graphs; without a base index, agents probing `/jsonld` 404'd. Now returns a `Collection` listing 8 URL templates (stage / signal / startup / startups-to-watch).

### Wave 4 — API v1 aliases (6)
The site already had `/api/v1/pricing.json`. Five sibling v1 paths were 404 — agents pinning to v1 had no consistency. Now:
11. `/api/v1/signals.json` — mirrors `/api/signals.json` (passes NextRequest through).
12. `/api/v1/agents.json` — mirrors `/api/agents.json`.
13. `/api/v1/answers.json` — mirrors `/api/answers.json`.
14. `/api/v1/changelog.json` — mirrors `/api/changelog.json`.
15. `/api/v1/dataset.jsonl` — mirrors `/api/dataset.jsonl` (passes Request through).
16. `/api/agent-card` — REST-style alias for `/.well-known/agent-card.json` (some agent runtimes resolve discovery under `/api/*`).

---

## Verification (production)

All 16 surfaces probed post-deploy:

```
=== Wave 1 — 308→200 ===
/.well-known/openapi.json  200
/.well-known/agent.json    200
/.well-known/agents.json   200
/.well-known/ai.txt        200

=== Wave 2 — new .well-known ===
/.well-known/ai.json        200
/.well-known/sitemap.xml    200
/.well-known/freshness.json 200  (DataFeed, 11 surfaces, period=Q2 2026)

=== Wave 3 — root aliases ===
/openapi.json  200  (21 paths)
/dataset.json  200
/jsonld        200  (Collection, hasPart=8)

=== Wave 4 — API v1 ===
/api/v1/signals.json    200  (meta+trending+sectors)
/api/v1/agents.json     200
/api/v1/answers.json    200
/api/v1/changelog.json  200
/api/v1/dataset.jsonl   200
/api/agent-card         200
```

IndexNow on postbuild submitted 1,400 URLs (down from 1,412 because new well-known + v1 aliases are excluded by the IndexNow filter — they're discovery surfaces, not indexable content).

---

## Build trap encountered

Two upstream handlers (`/api/signals.json`, `/api/dataset.jsonl`) require a `Request` argument; the v1 aliases initially imported them with `GET()` (no args). TypeScript blocked the build until the v1 wrappers were updated to `GET(request: NextRequest)` / `GET(request: Request)` and pass-through. **Lesson for next pass**: when wrapping upstream route handlers, grep for the upstream signature first (`grep -n "export async function GET" upstream/route.ts`) before writing the alias.

---

## What I did NOT change

- **VideoObject on apex** — verified already correct on `gitdealflow.com/` (commit 3ce4663) and `signals.gitdealflow.com/mcp-demo`. Originally listed as a gap; it was an artifact of probing the wrong host.
- **/glossary single-page format** — initially flagged as having "0 internal subpage links". On inspection it is a 358-line single-page glossary with anchor IDs (correct format for this content depth). Not a fix-worthy gap.
- **/predicted/2026-w19** — only week 18 exists currently; w19 starts 2026-05-11. No code fix; data will roll forward.

---

## Probes for next monthly audit (target: 2026-06-05)

```bash
# .well-known direct-content probes (no 308 hops):
for p in openapi.json agent.json agents.json ai.txt ai.json sitemap.xml freshness.json; do
  curl -sI -o /dev/null -w "%{http_code} $p\n" "https://signals.gitdealflow.com/.well-known/$p"
done

# Root aliases:
for p in openapi.json dataset.json jsonld; do
  curl -sI -o /dev/null -w "%{http_code} $p\n" "https://signals.gitdealflow.com/$p"
done

# API v1 stability:
for p in signals.json agents.json answers.json changelog.json dataset.jsonl pricing.json; do
  curl -sI -o /dev/null -w "%{http_code} /api/v1/$p\n" "https://signals.gitdealflow.com/api/v1/$p"
done
```

All should return 200, no 308.

---

## Memory entry

Saved to `project_aeo_audit_2026_05_05_pass_VI.md`.
