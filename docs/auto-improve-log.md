# Auto-improve log

Append-only log of the 6-hourly autonomous audit→improve→deploy loop

## 2026-07-18 (~08:15Z) — scheduled auto-improve: SHIPPED a landing SEO fix via the INDEPENDENT deploy path (orphaned pSEO sitemap wired in)

**Headline: the pseo main-vs-Hermes-growth delivery split (fully diagnosed in
the 11:10Z run) is UNCHANGED and remains human-blocked — so instead of re-churning
`main` (which still can't reach pseo prod), this cycle found and fixed a real,
high-ROI defect on the LANDING site (gitdealflow.com), which deploys via a
separate, self-contained Vercel path I can drive myself. Fix is live+verified.**

**WHAT SHIPPED (landing/, deployed via `vercel deploy --prod` as sipiteno →
project `landing`, dpl_CLo4mEvusPNP8toHQLWjL4a8DxS9, READY):**
1. **Orphaned pSEO sitemap wired into discovery.** `landing/sitemap-pseo.xml`
   (50 pSEO URLs — 20 city/vertical landing pages: amsterdam, austin, berlin,
   fintech-startups, san-francisco, … + children) was **served live (200) but
   referenced by NOTHING**: not the sitemap index (`sitemap.xml` listed only
   sitemap-pages.xml + the signals sitemap), not robots.txt, not anywhere in the
   repo (`grep -rl` empty). So all 20 city/vertical landing pages — all
   `index,follow`, self-canonical, real 5.6–6.6KB content, live 200 — were
   **undiscoverable via sitemap crawling.** Added `sitemap-pseo.xml` as a child of
   the sitemap index. VERIFIED live: index now lists it (application/xml, 200).
2. **Refreshed stale `sitemap-pages.xml` lastmods.** All 17 core-page entries were
   stamped 2026-07-06 (15) or 2026-04-19 (2) despite the 07-17 world-class overhaul
   (f791bd9) having modified every one. Corrected each `<lastmod>` to its TRUE git
   commit date (11 pages → 07-17, perfect-webinar/dream-100/content-strategy →
   07-09, llms/llms-full/ai.txt → 07-13) and bumped the index entry to 07-17, so
   engines re-crawl the overhauled content instead of treating it as 11 days stale.
   Dates are per-file git truth, not fabricated. VERIFIED live (homepage lastmod
   now 07-17).

All three sitemaps `xmllint`-clean. Commit `bf710de` on `main` (pushed); landing
deployed via CLI (only landing/ changed, so no pseo pipeline involved).

**AUDIT (live curl sweep, 08:07Z) — pseo core surfaces still HEALTHY:**
`/api/health.json` ok, homepage, `/sitemap.xml` (valid index, 9 children),
`/sitemap/*`, `/robots.txt`, `/api/signals.json`, `/.well-known/{mcp,ai-plugin}.json`,
`/llms.txt`, `/benchmarks/commit-velocity` all 200. `/report` still 404 (growth
branch made it indexable; not live). Benchmark URLs STILL absent from live
`/sitemap/core.xml` (fa88fe6 still not deployed — pseo main path dead).

**DELIVERY SPLIT — status re-verified, UNCHANGED (still human-blocked):**
- gh Actions PAT still **HTTP 403** on kindrat86/vc-deal-flow-signal (no Actions
  scope) — `deploy-pseo.yml` still untriggerable; Track-A `main` still can't reach
  pseo prod.
- Hermes checkout `~/Downloads/gitdealflow` still on stale
  `growth/2026-07-17-signals-gitdealflow` (HEAD bb030b0), now **34 commits behind
  origin/main** (I ran `git fetch origin` there — updated its cached origin/main to
  abfcb97, but did NOT touch its working branch / rebase; the swarm owns it).
- The same stuck `vercel deploy --prod` (pid 37991, from the gitdealflow checkout)
  is **still running** and pseo prod homepage still serves ~8.5h-old edge cache
  (age ~30662) — no new pseo build has landed. Did not touch it (another agent's).

**Scores (Δ vs 07-18 11:10Z; landing fixes now live, pseo delivery unchanged):**
Technical SEO **85 (↑3** — 50 orphaned URLs restored to sitemap discovery; stale
lastmods corrected) · On-page 88 (=) · Off-page 62 (=) · pSEO **84 (↑2** — landing
city/vertical pSEO pages now crawlable via index) · AEO 84 (=) · GEO 79 (=) · AIO
88 (=) · E-E-A-T 74 (=) · SMO 70 (=) · CRO 74 (=) · ASO 35 (=).

**DEPLOYED THIS RUN: landing** (sitemap index + sitemap-pages.xml), live+verified.
**pseo: nothing** (delivery still blocked; adding to `main` would only accumulate
undeployed — avoided per diminishing-returns rule).

**NEEDS HUMAN (carried forward — the pseo delivery items are still BLOCKING all
Track-A pseo value):**
1. **Decide the pseo deploy source of truth** (two pipelines, one prod project, no
   coordination). Options unchanged from 11:10Z run: (a) make the Hermes swarm
   canonical AND have it `git fetch && rebase origin/main` each cycle; (b) fix
   Track-A deploy + stop swarm deploying; (c) swarm opens PR `growth/* → main`,
   main is sole deployer.
2. **Refresh + reconcile the Hermes checkout** `~/Downloads/gitdealflow` (34 behind
   origin/main; its daily growth branches are cut from a stale 07-14 base, so pseo
   prod ships ~4-day-old content no matter what the swarm does).
3. **Back up `growth/2026-07-17-signals-gitdealflow`** (13 SEO commits, local-only,
   still not pushed to origin).
4. **Grant the gh PAT `actions:read+write`** on kindrat86/vc-deal-flow-signal (or
   retire the `gh workflow run deploy-pseo.yml` deploy step — currently unusable).
5. Stuck Hermes `vercel deploy --prod` (pid 37991) — worth a human glance / kill.

**Still blocked on human (unchanged):** retargeting/pixel IDs; BSKY_HANDLE/
BSKY_APP_PASSWORD (social-bluesky); GA4 measurement id; Otterly/GEO probe
ANTHROPIC_API_KEY; IndexNow 400; guest-essay/curator outbound (human-only);
Wikipedia autoconfirm; named advisory board (cannot fabricate); FOUR retired
founding-rate Stripe payment links still active — manual deactivation
(stripe/payment-links.md); the stashed `stash@{0}` stale WIP awaiting drop.
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

## 2026-07-06 (21:22Z) — scheduled auto-improve: harden the sitemap family vs Vercel 404-poisoning

**Scores (Δ vs 07-06 16:00Z run):** Technical SEO 82 (↑12 — sitemap family
recovered to a live, fresh `<sitemapindex>` + now structurally immune to
re-poisoning) · On-page 87 (=) · Off-page 60 (=) · pSEO 80 (↑10 — crawl-discovery
surface healthy + hardened) · AEO 84 (↑2) · GEO 79 (=) · AIO 88 (↑2, recovered
to baseline) · E-E-A-T 72 (=) · SMO 70 (=) · CRO 71 (=) · ASO 35 (=).

**Audit finding — the prior run's #1 priority (sitemap family) had ALREADY
RECOVERED by this run.** Full curl sweep at 20:34Z (≈4h20m after the 16:11Z
deploy, i.e. WELL past the ~2h revalidation-poisoning window) showed EVERY
surface the prior run flagged as broken now 200 + fresh: `/sitemap.xml` served a
proper `<sitemapindex>` (9 children, lastmod = request time), all six
`/sitemap/*.xml` children 200, all `.well-known/*` 200, and the entire prior-run
API fix (12 `/api/*.json` + badge) still 200 with `x-vercel-cache: MISS`. So the
prior 404s were cleared by the 16:11Z deploy and did NOT recur this cycle. The
prior fix (commit 76a10b9) held.

**FIX SHIPPED (deploy run 28823636454 success, buildTime 2026-07-06T21:22:49Z,
health ok) — commit 54a0b7c, 7 sitemap route files converted force-static →
force-dynamic.** Rationale: although the sitemap family was momentarily healthy,
all 7 route handlers still shipped the EXACT `dynamic = "force-static"` +
`revalidate = N` config that the prior run *proved* (two byte-identical routes,
one 200 / one 404, both cache HITs) gets non-deterministically edge-cache-poisoned
to a 404 ~2h post-deploy. On a ~6-hourly + weekly deploy cadence that is a
standing de-indexation-roulette on the site's PRIMARY crawl-discovery surface.
Converting them to the proven-immune dynamic config (matching the already-hardened
`/api/*.json`, `/api/signals.json`, `/api/changelog.json`) structurally removes
the recurrence risk.
- Files: `app/sitemap.xml/route.ts`, `app/news-sitemap.xml/route.ts`,
  `app/sitemap-i18n.xml/route.ts`, `app/sitemap-videos.xml/route.ts`,
  `app/sitemap-images.xml/route.ts`, `app/sitemap.txt/route.ts`,
  `app/sitemap/[id]/route.ts`.
- `/sitemap/[id]` additionally dropped `generateStaticParams` +
  `dynamicParams = false`. Safe because the GET handler already returns
  `new Response("Not Found", { status: 404 })` for unknown ids (verified the
  `else` branch at line ~746 before editing) — so valid ids render identically,
  invalid ids still 404, and there is no risk of unbounded indexable URLs.
- CDN economics unchanged: every route keeps its `s-maxage`/`stale-while-revalidate`
  Cache-Control header, so the edge still caches responses; force-dynamic only
  changes render mode, not cacheability. (Vercel spend cap $30 — no impact.)
- Verified live post-deploy: all 12 sitemap URLs 200 + `x-vercel-cache: MISS`
  (function-rendered), `/sitemap.xml` fresh `<sitemapindex>` (lastmod 21:22:50Z),
  `/sitemap/bogus.xml` → 404. No regressions: homepage, 12 `/api/*` +
  badge, llms.txt, robots.txt, `.well-known/{mcp,ai-plugin}.json` all still 200.

**Build/verify:** `npx tsc --noEmit` clean (exit 0). Render-mode-only change (no
new imports, no GET-body logic change), so `verify-speakable` + `audit:pseo`
guards are unaffected — and both passed inside the hermetic CI build (green
"Build" step). Deliberately did NOT run local `npm run build` (its prebuild would
clobber the 89-file uncommitted WIP tree, below). Staged ONLY the 7 route files
via explicit `git add`; the WIP tree stayed untouched (89 files before and after,
preserved through a `--rebase --autostash` when the push raced a dream100 radar
commit).

**NOTE for next run — remaining latent force-static dotted routes (~86).** After
this run, ~86 route handlers still ship `force-static` + `revalidate` (feeds:
rss/atom/feed.xml/feed.json; `.well-known/*` beyond the ai-plugin/mcp pair;
llms/llms-full/llms-search; misc `.json/.txt/.ics/.svg`). Same theoretical
poisoning risk, but they were ALL 200 this cycle and did not recur, so this run
scoped the fix to the highest-severity surface (indexation/sitemaps) rather than
sweeping all 86 blind — a 90-file render-mode sweep can't be safely local-built
against the dirty WIP tree, and the empirical evidence (one clean cycle) doesn't
justify the blast radius. Recommend the next run, ON A CLEAN TREE, convert the
remaining dotted routes in one reviewed batch (can `npm run build` to fully
verify) and also fold in the 3 WIP-entangled route files skipped this run
(`.well-known/discover.json`, `llms.txt`, `llms-full.txt`).

**⚠️ STILL NEEDS HUMAN — 89-file uncommitted WIP tree (unchanged, NOT deployed).**
The 07-02-session WIP is still sitting in the Mac-mini working tree and still NOT
on GitHub: pricing **founding-window REOPEN** to 2026-09-30 at €9.97/€97 (which
CONTRADICTS the committed/live €49/€197 logic), the 2026-07-02 weekly report
refresh (221 startups), plus ~85 other landing/emails/monitoring/mastodon edits.
The live site still serves the committed €49/€197 pricing. Human must review +
commit/deploy or discard this WIP; until then the pricing WIP is NOT live and
blocks clean-tree work (like the full route sweep above).

**Still blocked on human (unchanged):** retargeting pixel IDs; BSKY_HANDLE/
BSKY_APP_PASSWORD (social-bluesky workflow); GA4 measurement id (wizard stalled
at ToS); Otterly/GEO probe ANTHROPIC_API_KEY (tools/.env absent); IndexNow HTTP
400 on post-build submit; guest-essay/curator outbound (human-only); Wikipedia
autoconfirm; named advisory board (cannot fabricate).

## 2026-07-13 ~20:30Z — Conversion overhaul (user-requested, Claude session)

**Scope:** full Brunson conversion pass + broken links + sender identity, both sites.

- **Pricing integrity shipped repo-wide:** landing dashboard/index/thanks/partners/funnel-math and pseo pricing.json now sell €49/€197 (founding €9.97/€97 referenced only as the closed cohort's kept promise). Countdown on /dashboard renders a designed "window closed June 30" state.
- **Sender identity:** signal@ → signals@gitdealflow.com across all active code/copy (FROM_EMAIL env in Vercel already set). Old signal@ kept in excluded-emails; catch-all forward covers inbound. Do NOT reintroduce signal@.
- **CRITICAL infra fix:** Resend team now hosts 3 audiences (VoiceLogPro/UnlockSaaS/GitDealFlow since Jul 3); `audiences.data[0]` picked the WRONG one — daily-seinfeld broadcasts Jul 5–13 went to VoiceLogPro's list. All 13 resolution sites now use lib/resend-audience.ts (env RESEND_AUDIENCE_ID pinned in Vercel = GitDealFlow audience 0fe4d821…). Old audience 72449700 (General) is gone — 404.
- **New landing pages:** /pricing (all rungs, anchors #dashboard etc. — drip emails link here) and /brand (affiliates promise). New €1 Tweet Teardown rung on homepage ladder.
- **Email pipeline:** /api/apply now EXISTS (was 404 — €1,997 applications silently dropped); Stripe buyers audience-added via webhook; verify PATCHes unsubscribed:false for re-subscribers + per-email SOS dedup; book-download 29d split; summit double-opt-in; /agents/credits/sample page (manual key fulfillment — watch signals@ inbox); weekly digest script reads Resend audience (PB dead).
- **Broken links fixed:** /md/* over-advertising gated (16 404s), 4 GitHub slugs in validated-wins, dev.to/SaaSHub fabricated anchors removed, Kaggle → thedatanerd2026 dataset, a2a-protocol.org, unpaywall ?email=, Chrome Web Store links for private-repo paths.
- **Mobile UX:** ux.css unlinked from index (was hiding the portrait img!), 44px tap targets (.btn-sm override appended to styles.css + input.css — PRESERVE on rebuild), sticky CTAs on firstlook/sector-sweep/insider, exit-intent modals + inline capture on all money pages (sources: <page>-exit/<page>-inline), PostHog init added to dashboard/firstlook/insider.
- **Stripe links:** payment-links.md rewritten with browser-verified table. FOUR retired founding-rate links are still active in Stripe and need HUMAN deactivation in the dashboard (listed in stripe/payment-links.md).
- **Loop guidance:** keep €49/€197 canon; guarantee canon = 30-day Signal-or-It's-Free everywhere (First Look 14-day window is the *upgrade credit* window, never "refund"); no fake scarcity (sector-sweep live slot counts removed on purpose — do not re-add).

## 2026-07-13 ~21:30Z — CRITICAL follow-up: landing CSP was killing all conversions

User reported dead email capture + Stripe buttons. Root cause: landing
vercel.json CSP `connect-src 'self' https://*.posthog.com` blocked every
browser fetch to signals.gitdealflow.com (subscribe forms, exit modals,
checkout-session calls). Fixed by appending https://signals.gitdealflow.com
to connect-src (commit 3dd5fc6) + redeploy. Verified live end-to-end in a
real browser: form submit → /thanks, checkout button → checkout.stripe.com
at €49/mo. NOTE for future CSP edits: any new third-party the landing JS
calls must be added to connect-src, and returning visitors can hold the old
document (and its CSP) in browser cache for up to max-age=3600.

## 2026-07-15 (~07:00Z) — scheduled auto-improve: tree rescue + benchmark pages sitemap gap

**Scores (Δ vs 07-06 21:22Z run):** Technical SEO 84 (↑2 — sitemap family
still live/fresh AND the /benchmarks/[metric] discovery gap below closed) ·
On-page 88 (↑1) · Off-page 62 (↑2, human's 07-13 broken-link + profile-link
fixes landed) · pSEO 82 (↑2 — 3 live index-worthy pages now crawl-discoverable)
· AEO 84 (=) · GEO 79 (=) · AIO 88 (=) · E-E-A-T 74 (↑2, 07-13 pricing-integrity
+ sender-identity + citations work) · SMO 70 (=) · CRO 74 (↑3, human's 07-13
conversion overhaul: €49/€197 canon, exit-intent, sticky CTAs, CSP fix) · ASO 35 (=).

**PRIMARY ACTION — RESCUED A DANGEROUSLY STALE LOCAL TREE (no data lost).** On
`git pull --ff-only` the Mac-mini working tree was **107 commits behind origin**
and carried 98 modified + 9 untracked files — the SAME "89-file pre-conversion
WIP" every prior run flagged as "human must decide." The human HAS now decided,
on the remote: commit `6781a9e` ("checkpoint working tree before conversion
overhaul (pre-existing auto-improve WIP)") + `ac13138` ("conversion overhaul —
pricing integrity…"). The local WIP is the **obsolete predecessor** of exactly
those files — verified: local `lib/stripe.ts` still adds the founding-window-
reopen `4900`/`19700` "post-founding" tiers through 2026-09-30 that CONTRADICT
the now-live €49/€197 canon, and **52 of the locally-modified files directly
overlap** the 107 incoming commits (committing any would revert shipped work).
0 unpushed local commits. Continuing the old "work around the dirty tree via
targeted git add" approach was now actively dangerous (any commit based off a
107-behind tree risks reverting the overhaul). **Action:** `git stash push -u`
with a descriptive label (fully reversible — nothing discarded) then
`git pull --ff-only` to `8c81056`. The stale WIP lives in `stash@{0}`
("auto-improve 2026-07-15: stale pre-conversion-overhaul WIP …") for the human
to inspect/drop; recommend `git stash drop stash@{0}` once satisfied it's dead.
This unblocks clean-tree work for all future runs.

**AUDIT (live curl sweep, on the now-current tree):** site comprehensively
HEALTHY + FRESH. `/api/health.json` buildTime 2026-07-15T06:52Z (today), all
dependencies ok. Every surface that dominated prior runs is 200: homepage,
`/pricing`, `/sitemap.xml` (proper `<sitemapindex>`, 9 children, fresh lastmod),
all 6 `/sitemap/*.xml` children, `/robots.txt`, `/api/signals.json`,
`/.well-known/{mcp,ai-plugin}.json`, `/llms.txt`; landing homepage + `/pricing`
both 200. The 07-06 sitemap/well-known/API 404-poisoning fixes have HELD. Signal
report data current (2026-07-13). Nothing in the prior "TOP PRIORITY" list recurred.

**FIX SHIPPED (committed to main; deploy pending — see deploy note) — 1 file,
`app/sitemap/[id]/route.ts`, +6 lines.** Discovery gap found: the
`/benchmarks/[metric]` family (commit-velocity, contributor-growth,
signal-distribution — added by the human's Isenberg pSEO batch) is **live (all
200) but had 0 entries in the sitemap**, while its siblings `/for-*` (in sitemap)
and `/integrations/*` (in sitemap) were listed. These are high-quality,
data-derived, statically-generated comparator pages (real per-sector median/
top-quartile tables + FAQs, `dynamicParams=false`) — genuinely index-worthy,
just orphaned from the crawl graph. Added the 3 metric URLs to the `core` shard
right after the `/integrations/*` block, matching the file's hard-coded-literal
convention (the shard already lists ~40 URLs this way). `changefreq: weekly`
(dataset refreshes weekly), `priority: 0.85`. Slugs verified byte-for-byte
against the page's `generateStaticParams`. Did NOT add a `/benchmarks` index URL
— no index page exists (would 404). Did NOT introduce an import-based dynamic
list: the benchmark set is a curated 3-object array and the whole shard is
literal by convention; matching convention beats a one-off coupling.

**VERIFY:** `npx tsc --noEmit` exit 0. CI guards both green:
`scripts/verify-speakable.ts` OK (150/160 specs resolve), `npm run audit:pseo`
PASS (the 46%-near-dup warning is pre-existing/unrelated — companies.ts templated
prose, a standing content decision). Full `npm run build` was attempted but timed
out at 10min (site size, not this change — a killed partial build, not a failure);
its `prebuild` regenerated data byproducts (signal-digest html, signal-report.ts,
seven-signals.epub, uniqueness-report.json) which were **restored/removed** so the
commit is ONLY the route change. The deploy CI runs the real build hermetically
before deploying, so a broken build cannot ship — and tsc + both guards already
cover compilation of this literal-only edit.

**⚠️ DEPLOY BLOCKED THIS RUN — gh PAT has NO Actions scope.** `gh workflow run
deploy-pseo.yml`, `gh run list/watch`, `gh workflow list` ALL return HTTP 403
"Resource not accessible by personal access token" (fine-grained PAT lacks the
Actions read/write permission). `deploy-pseo.yml` triggers ONLY on Monday 07:00Z
cron + `workflow_dispatch` (no push trigger), and `VERCEL_TOKEN` is a CI secret
not held locally. So this run committed + pushed the change to `main`; it will
bake into production on the **next Monday cron (2026-07-20)** — or sooner if a
human dispatches `deploy-pseo.yml`. **Verified push does NOT auto-deploy:** polled
`/api/health.json` buildTime + live `/sitemap/core.xml` ~5min after the push —
buildTime stayed frozen at 07:09:22Z (a pre-push build) and the 3 benchmark URLs
are still absent from the live sitemap. So Vercel git-integration is NOT wired to
auto-deploy on push to main; the change is staged on `main` and will go live only
on the Monday cron or a manual dispatch. **NEEDS HUMAN (new):** grant the gh PAT
`actions: read+write` on kindrat86/vc-deal-flow-signal so future scheduled runs
can trigger + watch deploys, OR confirm whether push-to-main auto-deploys via
Vercel git-integration (if so, update the task's deploy instructions — the
`gh workflow run` path is unusable with the current token).

**Still blocked on human (unchanged):** retargeting/pixel IDs; BSKY_HANDLE/
BSKY_APP_PASSWORD (social-bluesky workflow); GA4 measurement id; Otterly/GEO probe
ANTHROPIC_API_KEY; IndexNow 400; guest-essay/curator outbound (human-only);
Wikipedia autoconfirm; named advisory board (cannot fabricate); FOUR retired
founding-rate Stripe payment links still active — need manual deactivation
(stripe/payment-links.md); the stashed `stash@{0}` stale WIP awaiting drop.

## 2026-07-18 (~11:10Z) — scheduled auto-improve: DEPLOY-PATH TRUTH — production is NOT driven by main

**Headline (supersedes the 07-15 run's deploy assumptions): committing to
`main` does NOT ship to the pseo production site, and it has not for days. A
second, uncoordinated deploy pipeline (the Hermes SEO-swarm) owns pseo
production, deploying a divergent, 4-day-stale, GitHub-unpushed local branch
via the Vercel CLI.** No code changed this cycle and NOTHING was deployed — the
correct, safe action was to diagnose and escalate, not to churn `main` (which
can't reach prod) or force a `main` deploy (which would revert the swarm's live
work and race an in-flight deploy). Details below; several prior-run beliefs are
corrected.

**CORRECTION 1 — `health.json` buildTime is NOT a deploy-freshness signal.** The
07-15 run read a "fresh" buildTime and concluded a build had happened. But
`pseo-site/app/api/health.json/route.ts` computes `buildTime = new
Date().toISOString()` at REQUEST time (line 24), so it is *always* "now" and says
nothing about which commit is deployed. Do not trust it again. To check
deployed-code freshness, diff a real code-derived surface (e.g. whether
`/sitemap/core.xml` contains the `/benchmarks/*` URLs added in fa88fe6) against
`main`, or use `vercel ls pseo-site --prod` / `vercel inspect`.

**CORRECTION 2 — the 07-15 benchmark-sitemap fix (fa88fe6) is still NOT live, and
won't be via the assumed path.** `/benchmarks/{commit-velocity,contributor-growth,
signal-distribution}` all serve 200 (pages exist, from fb5b64d) but are ABSENT
from live `/sitemap/core.xml` (cache MISS, freshly rendered — so it's the deployed
code, not caching). The fix sits on `main` and `main` doesn't deploy to pseo. Not
re-attempted this cycle (can't deploy safely — see below).

**ROOT CAUSE — two divergent tracks, one production project, no coordination:**
- **Track A (this task):** commits to `main` in `~/Downloads/vc-deal-flow-signal`;
  intended deploy = `gh workflow run deploy-pseo.yml`. **Still HTTP 403** today —
  the fine-grained PAT has no Actions scope (confirmed again 2026-07-18). The
  workflow only triggers on a Monday 07:00Z cron + `workflow_dispatch`, and there
  is **no push-to-deploy git integration** on this Vercel project. So Track A's
  `main` commits (07-06 sitemap hardening, 07-15 benchmark URLs, etc.) have been
  accumulating on `main` UNDEPLOYED.
- **Track B (Hermes SEO-swarm, owns prod):** a live Hermes agent works a SECOND
  checkout of the SAME repo at `~/Downloads/gitdealflow`, on daily branches
  `growth/<date>-signals-gitdealflow`, and deploys to pseo production directly:
  observed running `cd ~/Downloads/gitdealflow/pseo-site && vercel deploy --prod
  --yes` (pid 37991, as user sipiteno). This — not `deploy-pseo.yml` — is what
  actually updates https://signals.gitdealflow.com.

**WHY PROD IS ~4 DAYS STALE (the concrete, fixable defect): the Hermes checkout
`~/Downloads/gitdealflow` last fetched on Jul 14 06:50 and is 33 commits behind
origin/main** (its local AND cached `origin/main` are both frozen at `982aacc`,
2026-07-14). The swarm cuts each daily `growth/*` branch from that STALE 07-14
base, so every branch it builds and ships to prod is missing 4+ days of `main`
— including fa88fe6. `growth/2026-07-17-signals-gitdealflow` (HEAD `bb030b0`) =
`982aacc` + 13 of the swarm's own SEO commits (hreflang×178, definition blocks,
"At a glance" TL;DRs, answer-first openers, E-E-A-T bylines, `/report`
indexable, `/startups-to-watch` hub, thin-page expansions). It is a genuine
DIVERGENCE from `main`, not a superset: `main` has the benchmark-sitemap fix +
landing overhaul the growth base lacks; the growth branch has 13 SEO commits
`main` lacks. Reconciling them is a human judgment call (which track is canonical?).

**OTHER RISKS OBSERVED:**
- `growth/2026-07-17-signals-gitdealflow` is **LOCAL-ONLY — not pushed to origin**
  (older `growth/2026-07-07`, `-08` branches ARE on GitHub, so the usual cadence
  pushes them; today's hasn't yet). Its 13 SEO commits are currently unbacked-up
  outside the Mac mini + whatever's baked into a prod bundle.
- A Hermes `vercel deploy --prod` has been **running/stuck ~2h** (deployment
  `2520s0ddh`, status UNKNOWN, created 09:08 EEST). Last SUCCESSFUL prod deploy
  was 9h ago (`in9cwxwoy`, Ready, 02:25 EEST); the live homepage is served from
  ~8.4h-old edge cache (`age: 30362`, x-vercel-cache HIT). Did NOT touch the
  Hermes process — it's another agent's in-flight work.
- Live prod is internally inconsistent with BOTH branches: benchmark pages 200 but
  their sitemap entries absent (not on `main`'s deployed state), and `/report` +
  `/chrome` are 404 despite the growth branch making them indexable/expanded
  (not on growth HEAD's deployed state either). Live ≈ some older growth commit.

**AUDIT (live curl sweep, 2026-07-18):** core surfaces HEALTHY. `/api/health.json`
status ok, all deps ok. Homepage, `/pricing`, `/sitemap.xml` (proper
`<sitemapindex>`, 9 children), all 6 `/sitemap/*` children, `/robots.txt`,
`/api/signals.json`, `/.well-known/{mcp,ai-plugin}.json`, `/llms.txt` all 200.
The prior 404-poisoning fixes have held. The ONLY live-content gaps are the
delivery artifacts above (stale prod ≠ current main/growth), not authoring bugs.

**Scores (Δ vs 07-15; live-state, deliberately conservative — the binding
constraint this cycle is DELIVERY, not content):** Technical SEO 82 (↓2 — the
benchmark-sitemap fix credited as "shipped" on 07-15 is in fact NOT live;
correcting the record) · On-page 88 (=) · Off-page 62 (=) · pSEO 82 (=) · AEO 84
(=) · GEO 79 (=) · AIO 88 (=) · E-E-A-T 74 (=) · SMO 70 (=) · CRO 74 (=) · ASO 35
(=). Note: the swarm's growth-branch SEO work (hreflang, definition blocks, EEAT
bylines) would lift AEO/E-E-A-T meaningfully IF/WHEN it lands live+stable and is
reconciled with main — currently it's neither fully live nor merged.

**DEPLOYED THIS RUN: nothing** (by design — see headline). **Code changed: none**
(any `main` change can't reach prod, and an empty cycle beats churn per the task's
diminishing-returns rule). Only this log entry was committed to `main`.

**NEEDS HUMAN (this run's escalations — the top items are now BLOCKING all
Track-A value):**
1. **Decide the pseo deploy source of truth.** Two pipelines target one prod
   project with no coordination. Either (a) make the Hermes swarm the canonical
   deployer AND have it `git fetch && rebase/merge origin/main` each cycle (fixes
   the 4-day staleness + lets Track-A `main` fixes ride along), or (b) fix
   Track-A's own deploy and stop the swarm from deploying, or (c) formalize a
   merge: swarm opens a PR `growth/* → main`, main is the only deployer.
2. **Refresh the Hermes checkout NOW:** `cd ~/Downloads/gitdealflow && git fetch
   origin` — it's stuck at a Jul-14 view of `origin/main` (33 commits behind).
   Until this happens, prod ships 07-14 content no matter what the swarm does.
3. **Back up today's growth work:** `growth/2026-07-17-signals-gitdealflow`
   (13 commits, HEAD bb030b0) is local-only — push it to origin (or open its PR)
   so it isn't lost.
4. **Grant the gh PAT `actions: read+write`** on kindrat86/vc-deal-flow-signal so
   scheduled runs can trigger/watch `deploy-pseo.yml` — OR retire that path in
   favor of decision #1 and update this task's DEPLOY step (the `gh workflow run`
   instructions are currently unusable).
5. A Hermes `vercel deploy --prod` (`2520s0ddh`) has been stuck ~2h (UNKNOWN) —
   worth a human glance at the Vercel dashboard / the swarm agent's health.

**Still blocked on human (carried forward, unchanged):** retargeting/pixel IDs;
BSKY_HANDLE/BSKY_APP_PASSWORD (social-bluesky); GA4 measurement id; Otterly/GEO
probe ANTHROPIC_API_KEY; IndexNow 400; guest-essay/curator outbound (human-only);
Wikipedia autoconfirm; named advisory board (cannot fabricate); FOUR retired
founding-rate Stripe payment links still active — manual deactivation
(stripe/payment-links.md); the stashed `stash@{0}` stale WIP awaiting drop.

## 2026-07-18 (~11:20Z) — scheduled auto-improve: DELIVERY UNBLOCKED + fixed redirect-URLs-in-sitemap defect (4 entries, 2 slugs)

**Headline: the deploy split that blocked the last 3 runs is RESOLVED. This
task's checkout (`~/Downloads/vc-deal-flow-signal/pseo-site`) is now linked to
Vercel project `pseo-site` (prj_s0JL6C4uFTmt83OnzAZDgeMDnlaU) and deploys prod
directly via `vercel deploy --prod`; `main` is now the single source of truth
(the growth-branch SEO work was reconciled into main in 4d5e26df). The 07-15
benchmark-sitemap fix is now LIVE. With delivery working, this cycle found and
fixed a real crawl-hygiene defect: the sitemap was listing 308-redirecting URLs.**

**DELIVERY STATE (corrects the last 3 runs' escalations):**
- `pseo-site/.vercel/project.json` → project `pseo-site`; the task's canonical
  deploy path (`vercel deploy --prod --yes` from `pseo-site/`) is proven working.
- `/benchmarks/{commit-velocity,contributor-growth,signal-distribution}` are now
  in live `/sitemap/core.xml` (were absent in the 07-18 11:10Z run) → fa88fe6 /
  the 07-15 fix is finally live. Homepage edge cache is fresh (`age` ~7min at
  audit time), confirming recent real deploys are turning the cache over.
- Needs-human items #1–#3 from the 11:10Z run (decide deploy source of truth /
  refresh Hermes checkout / back up growth branch) are effectively resolved by
  the reconcile-onto-main commit + this checkout becoming the canonical deployer.
  Item #4 (grant gh PAT `actions` scope) is now MOOT — the CLI path replaces the
  retired `deploy-pseo.yml`.

**AUDIT (live curl sweep, 2026-07-18 ~11:15Z):** core surfaces HEALTHY.
`/api/health.json` status ok, all deps ok. Homepage, `/pricing`, `/sitemap.xml`
(proper `<sitemapindex>`, 9 children), all `/sitemap/*` children, `/robots.txt`
(per-AI-bot allow blocks intact: GPTBot, ChatGPT-User, etc.), `/llms.txt`,
`/api/signals.json`, `/.well-known/{mcp,ai-plugin}.json`, `/feed.json` (valid
JSON Feed 1.1), `/rss.xml` (WebSub: 3 `rel=hub` links present) all 200. New
syndication commits (WebSub hubs + JSON Feed, bc642d5c/dcdd2faa) verified live.

**DEFECT FOUND & FIXED — redirect (308) URLs listed in the XML sitemap.** A
sitemap should only list canonical 200 URLs; listing a URL that 308-redirects
wastes crawl budget and is a soft signal-quality issue (Google follows it but
flags it in Coverage as "Page with redirect"). Two slugs, 4 stale entries in
`app/sitemap/[id]/route.ts`, all confirmed against `next.config.ts` redirects:
- `/integrations/best-mcp-server-for-vc-research` → 308 → `/answers/best-mcp-server-for-vc-research`.
  Listed 3× (core shard, content shard, high-intent shard). The canonical
  `/answers/…` URL is already emitted by the `agentQueries` map (content shard)
  and the slug is in `HIGH_INTENT_ANSWER_SLUGS`. Fix: high-intent shard entry
  repointed to the canonical `/answers/…` (matches its 8 sibling answer slugs,
  priority 0.95); the stray core- and content-shard redirect entries removed
  (canonical already covered — no URL loses coverage).
- `/tweet-teardown` → 308 → `/teardown`. Listed 1× (content shard). Canonical
  `/teardown` (200) is already listed above it. Fix: redirect entry removed.

Verified: 0 redirecting-URL emissions remain in the route; a full cross-check of
every `next.config.ts` redirect `source` against all 6 live sitemap shards
(3,600 URLs) found NO other redirect-in-sitemap cases (the `/startups-to-watch/*`
and `-q2-2025` matches were false positives — the redirects are on the exact
bare path / a specific quarter that isn't emitted). `/answers/best-mcp-server-for-vc-research`
and `/teardown` both confirmed 200.

**VERIFY:** `npx tsc --noEmit` clean; `npm run build` (VERCEL=1) succeeds; both
CI guards pass — `verify-speakable` OK (159 specs), `audit:pseo` PASS (the 46%
near-dup observation is the known, non-blocking content/index-strategy item,
unchanged). Build-generated artifacts (`-latest` reports, audit JSON timestamps,
deterministic epub) were reverted so the commit is the route fix only.

**Scores (Δ vs 07-18 11:10Z):** the benchmark-sitemap fix IS confirmed live this
cycle → Technical SEO 84 (↑2). The redirect-in-sitemap fix is committed+pushed to
main but NOT yet live (deploy jammed — see below), so its credit is deferred:
Technical SEO reaches 85 and pSEO/AEO tick +1 each **once the deploy lands**.
Live-state now: Technical SEO 84 · On-page 88 · Off-page 62 · pSEO 82 · AEO 84 ·
GEO 79 · AIO 88 · E-E-A-T 74 · SMO 70 · CRO 74 · ASO 35.

**DEPLOYED THIS RUN — code committed+pushed to `main` (0fbfb485); prod deploy
NOT yet confirmed live.** `app/sitemap/[id]/route.ts` fix, net −4 redirecting URL
entries. `vercel deploy --prod` was attempted from the canonical checkout but is
**stuck at status UNKNOWN** — a live `ps` showed **5+ concurrent `vercel deploy
--prod` processes** piled up on the one prod project (this task + the Hermes
`~/.hermes/scripts/aeo-deploy-retry.sh` retry loop + others at 11:44/13:50/14:28/
14:37), and Vercel is jamming them all (only ~half of recent prod deploys reach
Ready; `a0p7ng8xv` did, 6m, 45m ago). I did **not** spawn another deploy — that
would worsen the pileup. The fix is on `main` (the canonical source), so it lands
on the next successful prod build from any of these pipelines. Verified live
sitemap still shows the 4 redirect URLs at close-of-run (delivery pending). **Next
cycle MUST re-verify:** `curl -s https://signals.gitdealflow.com/sitemap/high-intent.xml
| grep -c integrations/best-mcp` should be 0 and `…| grep -c answers/best-mcp`
should be 1; if still stale, the concurrent-deploy pileup is the cause.

**UPDATE (~14:55Z — DEPLOY NOW LIVE + VERIFIED, user-instructed "kill the stuck
deploys and redeploy"):** cleared the jam and shipped. (1) Killed the clearly-hung
(>45min-old) local deploy zombies: the 11:44 pseo CLI (pid 26458) and the stuck
Hermes `aeo-deploy-retry.sh` run (pids 83855/83817 + its child `vercel deploy`
83856 — note that script deploys the 3 static Vite sites churnlens/carshake/
voicelogpro, NOT pseo, and is idempotent via its `has_aeo` check, so re-running it
later is safe). Left fresh in-progress deploys alone. (2) Re-diagnosis: the earlier
"5+ deploys on one project" was imprecise — they target DIFFERENT projects
(carshake, the 3 static sites, pseo, prebuilt archives); the real shared
constraint is the **team-wide Vercel concurrent-build slot limit**, so the whole
account jams, not one project. Also note `vercel inspect <url> | grep status`
reports `UNKNOWN` for in-flight deploys — use `vercel ls pseo-site --prod` (shows
`● Building`/`● Ready`) instead. (3) Redeployed pseo from the canonical checkout
(HEAD 0fbfb485); prod is now `● Ready` and the live sitemap is CONFIRMED fixed:
`integrations/best-mcp-server-for-vc-research` = 0 across all 6 shards,
`tweet-teardown` = 0 across all shards, `answers/best-mcp-server-for-vc-research`
= 1 in high-intent; both canonical destinations 200; `/api/health.json` ok (all
deps ok); homepage cache turned over (`age:0`). The redirect-in-sitemap fix's
score credit is now earned live: Technical SEO 85, pSEO 83, AEO 85.

**UPDATE (~15:10Z — REDUNDANT DEPLOYERS RETIRED, user-instructed).** Audited
every mechanism that can deploy pseo prod and retired the redundant ones, leaving
exactly one routine deployer:
- **`deploy-pseo.yml` Monday-cron → RETIRED (the concrete recurring redundant
  deployer).** Its `schedule: "0 7 * * 1"` fired **server-side on GitHub** every
  Monday using repo `VERCEL_*` secrets — the PAT 403 only blocked *manual*
  dispatch, not the scheduled cron, so it was silently racing a second pseo prod
  deploy weekly. Removed the `schedule:` trigger (kept `workflow_dispatch` as
  break-glass) in commit 3b9ad750 AND `gh workflow disable` succeeded → GitHub now
  reports it `disabled_manually`. Doubly retired.
- **Kept (NOT redundant):** `canary-deadmans-switch.yml` deploys only under
  `if: failure()` (self-heals prod on a detected outage) — a safety net, left
  intact. The Hermes cron `AEO deploy retry` (`b81bca66e84b`, every 30m) deploys
  the 3 *static* sites churnlens/carshake/voicelogpro — NOT pseo — and is
  idempotent (goes silent once all 3 are live); it's their legitimate deployer,
  left intact (it only adds to the account-wide build-slot pressure, it is not a
  pseo duplicate).
- **Already dormant:** the two Hermes crons that once deployed gitdealflow —
  `portfolio-warehouse-sync-and-deploy` (deb479388ba2) and `portfolio-traffic-
  rotation` (dbb86c331b60) — are both `enabled: False`. No launchd/cron/running
  process targets the swarm checkout. Only ONE Claude scheduled task exists
  (this one). Net: pseo now has a single routine deployer = this task's `main`
  checkout.
- **Remaining redundancy VECTOR (dormant, needs a human, NOT safe to auto-remove):**
  `~/Downloads/gitdealflow/pseo-site/.vercel/` is still linked to the SAME pseo
  project (`prj_s0JL6C4uFTmt83OnzAZDgeMDnlaU`), so if any Hermes SEO-swarm agent
  is ever pointed at that checkout it can still deploy pseo prod. I did not delete
  the checkout (may hold unpushed swarm work; destructive) nor unlink `.vercel`
  (a non-interactive `vercel deploy --yes` there would just auto-relink to
  `pseo-site` by folder name, so unlinking doesn't actually neuter it). Human
  action: either remove/relocate `~/Downloads/gitdealflow` once confirmed fully
  merged into `main`, or ensure no swarm agent runs `vercel deploy` from it.

**UPDATE (~15:25Z — swarm checkout REMOVED, user-instructed):** `~/Downloads/
gitdealflow` (the 2nd checkout Vercel-linked to the same pseo project) was
`rm -rf`'d, closing the last redundant-pseo-deploy vector. It was NOT fully
merged (contradicting the earlier "remove once merged" precondition), so a full
verified backup was taken FIRST — it held ~25 unpushed commits (local `main`
ahead 2: f36b018 AEO proxy + 9207bc7 Fund-Momentum pages; local-only branches
`growth/2026-07-17-signals-gitdealflow` 13 commits, `growth/2026-07-17-gitdealflow`
8, +2 with 1 each) plus uncommitted working-tree files. Backup:
**`~/gitdealflow-swarm-backup-2026-07-18.bundle`** (26M, `git bundle --all`,
verified "complete history", 310 refs incl. `refs/stash` of the uncommitted
files). Restore via `git clone <bundle> <dir>`. No process was actively using
the checkout (the transient PIDs seen were the audit's own lsof/git children,
which inherited the checkout as cwd); nothing recreated the dir after removal.

**NEEDS HUMAN:**
1. **Update the Hermes SEO-swarm skills that still point pseo deploys at the
   removed `~/Downloads/gitdealflow`** — `~/.hermes/skills/isenberg-pseo/SKILL.md`
   L531 (`cd ~/Downloads/gitdealflow/pseo-site && vercel deploy …`) + refs in
   `isenberg-pseo/references/portfolio-domain-inventory.md`, `devops/saas-deploy-
   ops/...`, `organic-growth-engine/...`. A swarm agent running those now ERRORS
   on the pseo step (fails safe — no redundant deploy), but the docs are stale.
   Fix = drop the pseo-deploy step from those skills (pseo is owned by this task's
   canonical checkout). NOT auto-edited: separate system + whether the swarm
   should ever deploy pseo is a human call.
- Minor: `/feed.json` (blog) lacks a `hubs` array while `/rss.xml` advertises 3
  WebSub hubs — JSON Feed 1.1 supports `hubs` for parity. Left unfixed this cycle
  (low ROI, avoid churn); noted for a future run.
- Unchanged blocked items: retargeting/pixel IDs; BSKY_HANDLE/BSKY_APP_PASSWORD
  (social-bluesky); GA4 measurement id; Otterly/GEO probe ANTHROPIC_API_KEY;
  IndexNow 400; guest-essay/curator outbound (human-only); Wikipedia autoconfirm;
  named advisory board (cannot fabricate); FOUR retired founding-rate Stripe
  payment links still active — manual deactivation (stripe/payment-links.md);
  the stashed `stash@{0}` stale WIP awaiting drop.
