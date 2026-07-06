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

## 2026-06-10 (evening) — off-page execution run (manual, user-authorized "do everything")

**Badge-embed outreach UNBLOCKED and STARTED.** /api/badge/signal/[slug]/svg (PR #289)
is live — verified drizzle/e2b/langfuse/trigger-dev/inngest all render "accelerating".
Filed first batch of 5 gift-style issues (exact bodies from badge-issue-bodies.md,
one-touch rule, NO follow-ups):
- drizzle-team/drizzle-orm#5870 · triggerdotdev/trigger.dev#3895 · inngest/inngest#4381
- e2b-dev/E2B#1417 · langfuse/langfuse#14176
Next runs: file remaining Tier-1/2 targets in batches of ≤5 per day (spam-pattern
safety), tracking which get badge embeds. NEVER re-touch a company already issued.

**Awesome-list:** branch pushed to fork; cross-fork PR still blocked by token (404).
One-click submit: https://github.com/wong2/awesome-mcp-servers/compare/main...kindrat86:awesome-mcp-servers-wong2:add-vc-deal-flow-signal?expand=1

**Curator emails (Visible.vc/Qubit/Papermark) NOT sent:** no published email addresses
(contact forms/Intercom only); guessed addresses risk bounces on the warmed
signal@gitdealflow.com domain. Needs human: find/confirm addresses or use forms.
Cold Tier-1 list remains SATURATED — per 05-30 dedup, do NOT re-send (3rd-touch cap).

**GA4 (user approved ToS acceptance, UK):** account "GitDealFlow" + property
"GitDealFlow Web" (EUR, GMT) created up to the ToS modal; Chrome extension
disconnected before the accept click. Resume: analytics.google.com wizard →
accept ToS + GDPR DPA → web data stream for https://gitdealflow.com → put
G-XXXX measurement id into landing/pixels.js GA4 slot → vercel deploy landing.

**Bluesky:** bsky.app not logged in in Chrome; password entry is human-only.
Needs: user logs in → app password → gh secret set BSKY_HANDLE/BSKY_APP_PASSWORD.

## 2026-06-11 (midday) — manual cycle run ("запускай", user-triggered in main session)

**Why manual:** both scheduled tasks froze on unapproved permission prompts
(02:06 improve run + 09:12 dashboard run stuck "running"; user must open them
once and Allow — approvals then persist on the task).

**Badge issues batch 2 of ~5 filed** (10/24 total now):
browserbase/stagehand#2238 · tursodatabase/libsql#2250 · continuedev/continue#12601
· ollama/ollama#16678 · Helicone/helicone#5693. All 5 verified rendering
"accelerating" pre-send. Next batches: remaining Tier-1/2 (shadcn via
Discussion only — avoid issue noise on huge repos).

**IndexNow root cause FIXED + deployed (run 27345171059, success):** the
<key>.txt existed only on the apex — signals.gitdealflow.com served 404, so
every IndexNow batch was rejected; local builds also sent empty key (env
unset) → HTTP 400. Now: public/22df...36.txt added (verified 200 live) +
script defaults to the public key. NOTE: the postbuild submit in the NEXT
deploy is the first one that can succeed (key file went live with this one).
Check the deploy log next run — expect HTTP 200.

**Dashboard refreshed manually** (hourly task frozen — same permission issue).

## 2026-06-11 (afternoon) — manual cycle #2 ("запусти цикл", main session)

**Badge issues batch 3 filed** (15/24 total): mastra-ai/mastra#17824 ·
letta-ai/letta#3365 · crewAIInc/crewAI#6119 · typesense/typesense#2953 ·
duckdb/duckdb#23221. All verified "accelerating" pre-send (Letta's slug is
`letta-ai`, not `letta`). Dedupe check added to the process: `gh search
issues --repo <r> --author kindrat86` must return 0 before filing — keep
doing this every batch (protects against the scheduled session double-filing).
Remaining Tier-1: shadcn (Discussion only, NOT an issue — needs GraphQL or
human), SigNoz, Inngest done… next batch from ranked list rows 18-24.

**IndexNow VERIFIED WORKING:** deploy 27346961396 (success, health ok) ran the
first postbuild submit with the key file live → `IndexNow response: HTTP 200
(3227 URLs submitted)`. Closes the "investigate IndexNow 400" item below.

**Scheduled improve session note:** after the user approved the first
permission batch it advanced briefly and froze again at 12:26Z (likely a
deeper tool approval — Agent/WebSearch). If it never completes, its approvals
still accumulate on the task; the 20:00 run will tell.

**Known issues for next runs:**
- IndexNow post-build submit returned HTTP 400 (2,806 URLs) — investigate
  payload/key validity.
- Otterly/GEO probe launchd job needs a fresh ANTHROPIC_API_KEY (tools/.env
  absent on this machine).

## 2026-07-02 — Brunson-Architect + Isenberg max-improve session (user-triggered, main session)

**FIRST PAYING CUSTOMER (found in audit):** sarah.qlwang@gmail.com — First Look
€7 + Dashboard €9.97/mo (active since 06-30 02:50 UTC). Automated welcomes
delivered; personal welcome DRAFTED (monitoring/drafts/) — human must send +
check inbox for her First Look sector reply (deliverable possibly overdue).

**Emergency fix — triple drip:** /api/verify scheduled the full welcome
sequence on every confirmed entry; she had it queued 3× plus 4 pitches for
products she already owns. Cancelled 31 scheduled sends via Resend API; added
per-email drip dedup nonce (namespace `drip-scheduled`) in /api/verify.

**Founding-window integrity (Brunson):** deadline June 30 passed but checkout
still charged €9.97/€97. Enforced the printed post-founding prices: Dashboard
€49/mo (€490/yr), Insider €197/mo (€1,970/yr) — stripe-tiers.ts, TIER_BY_AMOUNT,
insider OTO (lookup insider_monthly_v2), 4 new payment links created, old ones
deactivated post-deploy. Copy sweep across pseo-site app/components/content,
lib/emails.ts, landing HTML (3 parallel agents), leaderboard script, mastodon
queue (3 pending posts). Grandfathered subs untouched.

**Isenberg "sell the work" fix:** First Look €7 now auto-fulfills — checkout
custom field `sector` → webhook → lib/firstlook-generator (was dead code,
imported nowhere) → ranked .md + .csv attached via Resend; miss → reply-based
fallback + admin alert with sector answer.

**June 11 traffic spike explained:** badge-outreach GitHub issues (batches
06-10/11) → repo watchers/bots hit exactly those /signal/* pages. Not organic;
but also proof badge outreach drives visits.

## 2026-07-06 (16:00Z) — scheduled auto-improve: API/badge 404-poisoning fix

**Scores (post-fix state · Δ vs 06-10 baseline):** Technical SEO 70 (↓ sitemap
family broken, see below) · On-page 87 (=) · Off-page 60 (=) · pSEO 70 (↓ stale
sitemap) · AEO 82 (recovered from ~40 during outage) · GEO 79 (=) · AIO 86 (recovered) ·
E-E-A-T 72 (=) · SMO 70 (=) · CRO 71 (=) · ASO 35 (=). The AEO/AIO numbers are
"recovered": the agent data surfaces were live-404 for most of each deploy cycle
before this run — see root cause.

**CRITICAL FIX — Vercel edge 404-poisoning of extension-path route handlers
(deployed, run 28805270154 success, buildTime 2026-07-06T16:11:42Z, health ok).**
Audit found the ENTIRE `/api/v1/*` agent surface + `/api/health.json`,
`/api/schema.json`, `/api/catalog.json`, `/api/corpus.json`, `/api/corpus.jsonl`,
`/api/openapi.json`, and the badge SVG `/api/badge/signal/[slug]/svg` were all
live-404 (`x-vercel-cache: HIT`, `x-matched-path: /404`, age ≈ time-since-deploy).
Impact: (1) every badge embedded in the ~24 outreach OSS repos was a BROKEN IMAGE;
(2) uptime monitors pointed at health.json saw the service DOWN; (3) the AEO/agent
data surfaces (a core product pillar) were unreachable ~23h/day.
- Root cause: route handlers whose pathname ends in a file extension, declared
  `dynamic = "force-static"` + `revalidate = N`, get their edge cache poisoned to
  a 404 by Vercel after the FIRST background revalidation (~2h post-deploy). Proof:
  `/api/openapi.json` and `/api/schema.json` ship byte-identical config yet served
  200 vs 404, both cache HITs. The deploy pipeline's own health-check passes only
  because it runs inside the 60s window before the first revalidation — so this hid
  from every prior green deploy.
- Fix (commit 76a10b9, 20 route files): `force-static`+`revalidate` → `force-dynamic`,
  matching `/api/signals.json` and `/api/changelog.json` — the two routes that stay
  reliably 200 on this deployment (both dynamic). CDN caching preserved via each
  route's existing `s-maxage`/`stale-while-revalidate` Response header, so economics
  are unchanged. Badge route also dropped `generateStaticParams`/`dynamicParams`
  (incompatible with force-dynamic; GET already renders any slug on demand).
- Verified live post-deploy: all 12 `/api/v1/*.json` + health/schema/catalog/corpus/
  openapi + badge `/svg` now return 200 with `x-matched-path` = the real route (not
  /404) and `x-vercel-cache: MISS` (function-rendered). health.json = status ok, fresh
  buildTime. No regressions: signals.json/changelog.json/llms.txt/homepage still 200.
- NOTE for next run: the true test is that they STAY 200 after the ~2h revalidation
  window. The poisoning MECHANISM is structurally removed (no more static-revalidation),
  and these now match the proven-reliable signals.json config, so confidence is high —
  but re-curl the set next run to confirm they didn't regress.

**Build verification:** `npx tsc --noEmit` clean; `verify-speakable` OK. Deliberately
did NOT run local `npm run build` — its `prebuild` regenerates signal-report-latest.ts
et al. and would have clobbered the large uncommitted WIP in the tree (below), and
`postbuild` fires IndexNow/WebSub. Relied on tsc + the hermetic GitHub Actions build
(alias only promotes on success).

**⚠️ NEEDS HUMAN — large uncommitted WIP in the Mac-mini working tree (99 files, NOT
on GitHub, NOT deployed).** The tree carries a substantive, deliberate-looking WIP set
from the 07-02 session that was never committed:
- Pricing **founding-window REOPEN** through 2026-09-30 at €9.97/€97 (lib/stripe.ts adds
  4900/19700 tiers as "post-founding"; lib/stripe-tiers, v1/pricing.json body, landing
  llms.txt, many pages/components). This CONTRADICTS the committed state (which enforced
  €49/€197 post-June-30). Live site still serves the committed €49/€197 logic.
- Weekly report refresh to 2026-07-02 (content/signal-report-latest.ts, 221 startups).
- ~95 other modified files (landing HTML, emails.ts, monitoring/, mastodon queue, audit
  reports) + 9 untracked.
This run committed ONLY the 20 API route fixes (pricing.json handled via patch-staging
to grab just the render-mode hunk, leaving the pricing-copy WIP untouched) and this log.
Human must decide: review + commit + deploy the founding-window/pricing WIP, or discard
it. Until then the pricing strategy in the tree is NOT live.

**BLOCKED / DEFERRED — sitemap family is broken (TOP PRIORITY next run, needs clean tree):**
- `/sitemap.xml` serves a STALE `<urlset>` (289 URLs, all lastmod frozen 2026-06-10)
  despite weekly deploys — not the `<sitemapindex>` the current `app/sitemap.xml/route.ts`
  code emits. Strong smell of an `app/sitemap.ts` (metadata route) vs `app/sitemap.xml/route.ts`
  collision, plus the same force-static dotted-path staleness.
- `/sitemap-index.xml`, every child `/sitemap/{core,high-intent,sectors,crossings,startups,
  content}.xml`, `/news-sitemap.xml`, `/sitemap-images.xml`, `/sitemap-i18n.xml` → ALL 404.
  So the index the route points at is dead; only the stale 06-10 urlset keeps 289 URLs
  discoverable. Did NOT touch sitemaps this run: high de-indexation risk, needs the routing
  conflict resolved + verification a 2h-poison test can't give inside one run.
- Hypothesis to test next run: apply the same force-static→force-dynamic conversion to the
  sitemap child routes AND resolve the sitemap.xml source conflict.

**BLOCKED — `.well-known` 404s (same bug family, investigate next run):**
`/.well-known/mcp.json` (has BOTH a public/.well-known/mcp.json file AND a route.ts —
a shadow conflict), `/.well-known/agent.json`, `/.well-known/freshness.json` (builds as
dynamic ƒ yet 404s), `/.well-known/discover.json`, `/.well-known/security.txt` → all 404.
`/.well-known/ai-plugin.json` is the only one 200.

**Still blocked on human (unchanged from prior runs):** retargeting pixel IDs; BSKY_HANDLE/
BSKY_APP_PASSWORD; GA4 measurement id (wizard stalled at ToS); Otterly/GEO probe
ANTHROPIC_API_KEY; guest-essay/curator outbound (human-only); Wikipedia autoconfirm;
named advisory board (cannot fabricate).
