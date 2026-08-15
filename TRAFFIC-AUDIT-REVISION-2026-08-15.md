# GitDealFlow Traffic Audit — Live Verification Revision (2026-08-15)

Scope: re-verified every claim of the section-by-section audit against live HTTP state,
repo HEAD (`~/signals-gitdealflow/pseo-site`, branch `main`, HEAD `b1a36b03`), Vercel REST,
and GSC data via the SA scoreboard (`~/.hermes/organic/state/kpi-latest.json`).

## Audit items that were WRONG or already fixed (do not redo)

| Audit claim | Reality (verified 2026-08-15) |
|---|---|
| "4,200+ orgs" everywhere | FIXED. Landing meta = "350+ orgs". Blog slug 301'd to `/blog/i-tracked-369-startup-github-orgs-six-months` (next.config.ts). llms.txt clean. |
| "gitdealflow.com NOT in GSC" | FALSE. Both `https://gitdealflow.com/` AND `sc-domain:gitdealflow.com` verified; SA pulls data daily. |
| "GA4 not implemented" | Landing: LIVE via `pixels.js` (G-7SV2SNZE4C) + CWV beacon, CSP allows gtag. Signals: env var set, PixelManager mounted, CSP fix COMMITTED (2db02e71) but NOT DEPLOYED (live CSP lacks googletagmanager). §16 guard in verify-no-regressions.ts. |
| "sitemap-pseo.xml broken, orphaned sitemaps" | FIXED. Valid XML sitemapindex; retired shards 301 to `/sitemap.xml`; robots.txt clean; `/sitemap-llm.xml` live (294 URLs). |
| "Comparison pages 465 words" | EXPANDED. `/alternatives-to/*` and `/best/*` now ~1,100 words, FAQPage schema, 6-7 H2s. |
| "No FAQ on sector pages" | FIXED. `/startups-to-watch/ai-ml-q2-2026` has FAQPage JSON-LD + Frequently Asked section. |
| "No related-startup internal links" | FIXED. `/startup/huggingface` has 40 unique internal links, related + similar modules. |
| "Crawl-delay throttling" | FIXED (SWARM_STATE 2026-08-14): 0 Crawl-delay lines, guard §12 asserts absence. |
| "No rank tracking / no KPI" | FALSE. Deterministic SA-pulled scoreboard (organic-measure.py), baseline 134 clicks/28d, brand-KPI tracked. |
| "Link velocity zero" | FALSE. Monthly link-velocity engine active (~/.hermes/scripts/gitdealflow-backlinks/, hackernoon + goodfirms packets in flight). |

## Real SERP data (28d window 2026-07-16 → 2026-08-14, GSC via SA)

| Property | Clicks | Impressions | Avg pos | Top-10 URLs | Brand clicks |
|---|---|---|---|---|---|
| sc-domain:gitdealflow.com | 63 | 32,220 | 11.1 | 928 | 5 |
| https://signals.gitdealflow.com/ | 59 | 31,975 | 10.9 | 910 | 1 |
| https://gitdealflow.com/ (apex) | 4 | 364 | 32.4 | 18 | 4 |

- CTR = 0.2%. Junk query share only 1.5% (clean).
- Portfolio aggregate: 193 clicks/28d, 1.44x baseline, 3,715 URLs in top-10.

## The one number that matters now

~32K monthly impressions at position ~11 but 0.2% CTR. 928 URLs already rank top-10.
A 2% CTR on the same impressions = ~640 clicks/mo (10x current). **Title/meta CTR
rewrite of the top-10 URL set is the single highest-leverage remaining lever.**
Position gains (11 → 8) are secondary; CTR is the multiplier.

## Remaining open items (priority order)

1. **CTR rewrite** (new #1): titles/metas for ~900 top-10 URLs. Numbers, brackets,
   specificity ("21 AI startups accelerating on GitHub right now" style).
   STATUS 2026-08-15: QUEUED. Fires via cron `gdf-ctr-title-meta-rewrite`
   (monitor gate `~/.hermes/scripts/gdf-ctr-rewrite-gate.py`, READY when signals
   CSP allows gtag + clean tree). Also queued in MANUAL_QUEUE.md.
2. **Deploy GA4 CSP fix**: committed 2db02e71 (2026-08-15 01:36). Live CSP still
   blocks gtag on signals. Deploy when tree is clean; guard §16 already protects.
3. **Sector-count reconciliation 15 vs 20**: OWNER-DEFERRED (MANUAL_QUEUE.md,
   queued 2026-08-14). Data pages say 20, marketing/llms.txt say 15. Pick one
   canonical number, sweep all surfaces, add guard assertion.
4. **Apex marketing pages**: only 36 URLs with impressions, pos 32.4, 1.7% of
   2,064 sitemap URLs impressed. Weakest index penetration in the portfolio.
5. Referring domains (engine in flight), brand search (5 clicks), featured
   snippets on pos-11 URLs, TOFU/MOFU cornerstone completion.

## Deploy hazards (unchanged, restated)

- Lineage resolved 2026-08-12: single canonical `main` in `~/signals-gitdealflow` (sentinel-enforced). `~/signals-worldclass` still exists but is RETIRED and cannot build/deploy.
- Dirty tree right now (~10 modified tracked files, other agents mid-sweep):
  do NOT deploy from this checkout until clean.
- verify-no-regressions.ts + assert-canonical-lineage.mjs (sentinel) run in prebuild and gate every deploy path.

## 2026-08-15 13:20 EEST — Quarterly-canonical completion (option a-consistent)

Spot-check of audit "90+/no-fix" items found sector/geo/region old-quarter pages
canonicalize to latest quarter (deliberate cannibalization guard) but were still
listed in sitemap/sectors.xml. Fixed: `latestQuarterSlugsOnly()` in
app/sitemap/[id]/route.ts keeps one URL per quarter group (newest); 617 -> 400
URLs live (145 quarters = 57 groups x 1 latest + geo/region singles). Old pages
remain live 200 + canonical->latest (reachable via internal links, no 301
flood). Commit f20091af. Decision consistent with the canonical design; 301s
NOT chosen (identical content, would waste the ranking history of old URLs).

Also this session: HSTS preload submitted (pending), wildcard `ALIAS *` DNS
record deleted (Vercel REST, junk subdomains no longer resolve to stale edge),
apex i18n de/es retirement verified live (sibling deploy 12:49), signals i18n
confirmed healthy per docs/i18n-audit-2026-08-15.md (12 locales, hand-written,
bidirectional hreflang - do not touch).
