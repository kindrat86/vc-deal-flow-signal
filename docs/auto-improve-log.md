# Auto-improve log

Append-only log of the 6-hourly autonomous audit→improve→deploy loop
(scheduled task `gitdealflow-audit-improve-deploy` on the Mac mini).
Each run MUST read this before changing anything: never redo or revert
prior entries, never regenerate removed surfaces, keep prior judgment calls.

## 2026-06-10 — baseline run (manual, full audit)

**Scores:** Technical SEO 82 · On-page 87 · Off-page 60 · pSEO 75 · AEO 82 ·
GEO 79 · AIO 88 · E-E-A-T 72 · SMO 70 · CRO 71 · ASO 35 · composite ~75.
Off-page authority is the bottleneck; AIO is the strongest dimension.
Live-verified: indexation recovered from the 2026-05-30 crisis (sector pages,
blog, faq, compare, for/founders all in Google). GEO probe baseline: 56%
own-domain citation overall, 0% on the alternatives cluster.

**Changed (commit 74b7a53):**
- Deleted /showdown family (1,582 near-dup pages, 100% flagged, already
  noindexed): routes + content/showdowns.ts removed; sitemap, entities.json,
  llms.txt, proxy.ts noindex list, personas/case-studies links cleaned;
  308 redirects /showdown(/:slug) → /compare in next.config.ts.
  Sitemap shrank 4,142 → 2,806 URLs. DO NOT regenerate this family.
- A2A endpoint completed: data-aware routing (23/23 agent-card examples),
  spec-correct tasks/get|cancel (-32001), capability-consistent errors.
- data-speakable added to sector/signal/compare/alternatives lead paragraphs.
- Visible YMYL disclaimer (components/SignalDisclaimer.tsx) + honest
  "Data refreshed" date on compare/alternatives detail pages.
- /answers + /compare added to homepage PILLAR_LINKS.
- X-Robots-Tag: noindex on /api/* (next.config.ts). NOTE: this is a
  *default* for otherwise-unguarded endpoints only — many /api/v1/* routes
  deliberately set their own "index, follow" at the route level (intentional
  AEO: data surfaces meant to be discoverable) and route headers win.
  Verified live post-deploy. Do NOT "fix" route-level index,follow headers.
- .github/workflows/social-bluesky.yml created (2 crons/day, AT Protocol,
  green no-op until secrets exist).
- Landing thanks pages: verified already noindexed — no change needed.
- FAQPage JSON-LD on /faq: verified already present — no change needed.
- Footer links to /answers + /compare: verified already present.

**Blocked on human (do not retry autonomously):**
- Retargeting pixel IDs — all empty in landing/pixels.js (LinkedIn + GA4 first).
- BSKY_HANDLE / BSKY_APP_PASSWORD repo secrets → social-bluesky.yml activation.
- Farcaster/Mastodon posting scripts don't exist (queues only) + no creds.
- Otterly.AI signup (config.json names it as aeo_monitoring).
- GSC service-account for true indexation telemetry.
- Guest-essay sends (Not Boring, Pragmatic Engineer, Generalist) + HARO —
  outbound comms are human-only; cold-email channel deliberately capped.
- Wikipedia autoconfirm edits, Stack Exchange rep building.
- Named advisory board (cannot fabricate people).
- alternatives-cluster GEO campaign = posting to external platforms → human.

**Deployed & verified live (run 27299454118, success, buildTime 19:12Z):**
health.json ok; /showdown/* → 308 /compare; A2A message/send routes
"Show me AI/ML startups" → search_startups_by_sector with completed Task;
tasks/get unknown id → -32001.

**Known issues for next runs:**
- IndexNow post-build submit returned HTTP 400 (2,806 URLs) — investigate
  payload/key validity.
- Otterly/GEO probe launchd job needs a fresh ANTHROPIC_API_KEY (tools/.env
  absent on this machine).
