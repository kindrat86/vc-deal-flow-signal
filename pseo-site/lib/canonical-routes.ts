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
  "/tweet-teardown",
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
  "/origin",
  "/origin/your-journey",
  "/story",
  "/roadmap",

  // Earn-your-way-in surfaces
  "/affiliates",
  "/buyers-guide",
  "/press",
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
] as const;

export type CanonicalRoute = (typeof CANONICAL_PROD_ROUTES)[number];
