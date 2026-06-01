/**
 * Canonical production routes — ones that MUST stay 200 on
 * https://signals.gitdealflow.com.
 *
 * The route-canary cron (app/api/cron/route-canary/route.ts) curls
 * every entry in this list once a day. Any non-2xx triggers a Resend
 * email alert to signal@gitdealflow.com.
 *
 * Single source of truth — when a new Brunson surface ships, add the
 * path here so the canary catches future silent rollbacks.
 *
 * Background — encoded from `feedback_unmerged_branch_overwrites_prod.md`
 * + 2026-05-06 incident where 6 routes silently 404'd on prod despite
 * existing in main, because a `vercel deploy --prod` fired from a
 * stale source tree and aliased over the good deploy.
 *
 * Rules for inclusion:
 *   - Must be a stable, indexable, marketing-relevant URL
 *   - Must NOT be a dynamic [slug] / API endpoint (those need their
 *     own probes — see api/cron/state-of-github for the pattern)
 *   - Must NOT require auth, cookies, or query params for a 200
 *
 * If a route here legitimately changes status (e.g. a sunsetted
 * tier), remove the entry in the same commit as the route deletion.
 */

export const CANONICAL_PROD_ROUTES = [
  // Apex + core landings
  "/",
  "/squeeze",
  "/firstlook",
  "/funnels",

  // Brunson Value Ladder rungs
  "/book",
  "/book/read",
  "/teardown",
  "/agents/credits",
  "/insider",
  "/pricing",

  // Brunson Funnels (DotCom Secrets) — three lengths of the same Perfect
  // Webinar argument, plus the A/B router that sticky-buckets a visitor
  // into 5min or 90s (Brunson Expert Secrets §3 Ch 15 + §4 Ch 19).
  "/walkthrough",
  "/walkthrough/5min",
  "/walkthrough/90s",
  "/walkthrough/quick",
  "/quiz",
  "/apply",
  "/challenge",
  "/launch",
  "/watch",
  "/state-of-github",
  "/predicted",
  "/diligence",

  // Post-purchase ascension (Brunson §3 Ladder-to-Funnel)
  "/thanks/firstlook",
  "/thanks/dashboard",
  "/thanks/insider",
  "/thanks/sector-sweep",

  // Brunson Trilogy infra (Expert + Traffic Secrets)
  "/target-list",
  "/distribution",
  "/manifesto",
  "/identity",
  "/start-here",
  "/scorecard",
  "/experiments",
  "/earned-plays",
  "/decade-in-a-day",
  "/continuity",
  "/origin",
  "/origin/your-journey",
  "/story",
  "/roadmap",

  // Earn-your-way-in surfaces
  "/affiliates",
  "/buyers-guide",
  "/press",
  "/podcasts",
  "/wins",
  "/receipts",
  "/crystal-ball",
  "/friday-preview",

  // Well-known / agent surfaces (Pass VI–VIII shipped these)
  "/llms.txt",
  "/agents.txt",
  "/manifest.webmanifest",
  "/sitemap.xml",
  "/robots.txt",

  // --- GEO / AIO / AEO discovery surfaces (added 2026-05-28) ---
  //
  // The 2026-05-06 incident this canary was built for was a silent 404/308
  // *batch* on exactly these agent/well-known/v1 routes — yet only five of
  // them were probed. Pass VIII separately found 16 of these regressing to
  // 404/308 between deploys. They are the highest-leverage surfaces for
  // generative engines, answer engines, and autonomous agents, and they
  // regress the same way (stale-tree --prod alias) as the funnel routes
  // above. Probing them closes the gap. All confirmed present as route
  // handlers; none require auth or query params.

  // .well-known agent + AI policy surfaces
  "/.well-known/ai.txt",
  "/.well-known/ai-policy.json",
  "/.well-known/agent-card.json",
  "/.well-known/agent.json",
  "/.well-known/agents.json",
  "/.well-known/mcp.json",
  "/.well-known/openapi.json",
  "/.well-known/openai-search.json",
  "/.well-known/discover.json",
  "/.well-known/dataset.json",
  "/.well-known/skills.json",
  "/.well-known/freshness.json",
  "/.well-known/wikidata.json",
  "/.well-known/security.txt",

  // Root agent / LLM / AEO files
  "/llms-full.txt",
  "/llms-search.json",
  "/ai.txt",
  "/ai.json",
  "/agent-card.json",
  "/agent.json",
  "/agents.json",
  "/openapi.json",
  "/knowledge-graph.json",
  "/entities.json",
  "/skills.json",
  "/model.json",

  // RAG-ingestion corpora (Q&A, glossary, dataset)
  "/qa.json",
  "/qa.jsonl",
  "/glossary.jsonl",
  "/dataset.json",

  // Syndication / discovery feeds
  "/feed.xml",
  "/feed.json",
  "/rss.xml",
  "/atom.xml",
  "/opensearch.xml",

  // Versioned JSON API corpora consumed by agents / answer engines
  "/api/openapi.json",
  "/api/signals.json",
  "/api/answers.json",
  "/api/health.json",
  "/api/v1/signals.json",
  "/api/v1/answers.json",
  "/api/v1/faq.json",
  "/api/v1/glossary.json",
  "/api/v1/methodology.json",
  "/api/v1/pricing.json",
  "/api/v1/changelog.json",
  "/api/v1/citations.json",
  "/api/v1/playbooks.json",

  // Secondary sitemaps referenced by robots.ts (the index at /sitemap.xml
  // is already probed above; these are the siblings that crawlers fetch).
  "/news-sitemap.xml",
  "/sitemap-images.xml",
  "/sitemap-videos.xml",
  "/sitemap-i18n.xml",
  "/sitemap-index.xml",
] as const;

export type CanonicalRoute = (typeof CANONICAL_PROD_ROUTES)[number];
