# Daily Briefing — 2026-05-04

## Headline event
**Second Chrome extension shipped: VC GitHub Lookup — Startup Signals on Hover.** Companion to the existing Crunchbase + Wellfound badge. Hover any GitHub repo or org link → instant signal tooltip; chip injected on direct repo/org page loads; toolbar manual-lookup popup. Manifest V3, ~16 KB, no telemetry. Install: https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm

## Already shipped autonomously today
- Apex landing (gitdealflow.com): JSON-LD `sameAs` extended; SoftwareApplication featureList updated; pricing-card bonus pivoted from one→two extensions; §11 hero rebuilt as side-by-side dual-extension card; chrome.html now lists both extensions with separate JSON-LD nodes and refreshed body copy
- pSEO (signals.gitdealflow.com): Footer + CTABanner show both extensions; /integrations gains a new card for the GitHub-lookup extension; /citations and /about JSON-LD `sameAs` extended; /llms.txt and /llms-full.txt refreshed with both entries; /changelog gets a 2026-05-04 entry and corrects the prior Apr-17 entry (Crunchbase + Wellfound, not the stale tri-domain claim)
- All `marketing/launch-posts/*` drafts updated: PH listing, IH-products listing, IH long-form, PH long-form, Reddit /r/startups, Reddit /r/venturecapital, Reddit /r/SideProject, directory-startupbuffer
- Memory updated with the new Chrome extension reference

## Manual posting blocks (USER ACTION — Claude drafts only per division-of-labor)

> Status as of 2026-05-04 ~15:45 EEST: Twitter ✓ posted · Reddit r/SideProject ✓ posted · Indie Hackers ✓ posted · LinkedIn (company page) ✓ posted · Chrome Web Store listing ✓ submitted (one extension; second still pending) · Hacker News ❌ account BLOCKED.

> All channels below are user-posted per memory rules (no LinkedIn/Reddit/HN automation; HN must stay rough and user-rewritten). Drafts ready to copy-paste.

### Twitter / X — single tweet ✅ POSTED 2026-05-04 ~14:30 EEST from @data_nerd

> Shipped variant: hook-first / single branded URL / 169 raw / 162 weighted. Replaced the original 369-raw / 272-weighted draft after Twitter composer red-highlighted the long Chrome Web Store URL. Style codified as durable rule in memory `feedback_tweet_style_short_branded.md`.

```
GitHub is now a deal-flow surface.

Hover any repo → commit velocity, contributor growth, signal type. Free Chrome extension, no account.

https://gitdealflow.com/chrome
```
*169 raw / 162 weighted (well under 280-char @data_nerd non-Premium cap)*

Posted permalink: TBD — paste back into project_daily_marketing_log.md when captured.

### Reddit — r/SideProject (manual post)
**Title:** Built a Chrome extension that turns GitHub itself into a deal-flow surface
```
Hover any github.com/<owner> or github.com/<owner>/<repo> link and a tooltip surfaces commit velocity (14d), velocity change vs prior period, contributor count and growth, signal type, and a stage estimate.

A chip is also injected on direct repo and org page loads so the data is always one glance away. The toolbar opens a manual lookup form for any GitHub URL.

Manifest V3, ~16 KB, no analytics, no account, no host-page content collection. Only the owner slug is sent to the public signals API; responses cached in session storage for ≤5 min.

Companion to my earlier extension that overlays the same signal on Crunchbase and Wellfound profiles. Install both for the complete loop.

GitHub Lookup: https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm
Crunchbase/Wellfound badge: https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn

Built solo, six months in. Public dataset, public methodology (SSRN preprint).
```

### Indie Hackers — Build-in-Public milestone (manual post)
**Title:** Shipped extension #2 — turning GitHub itself into a deal-flow surface
```
Two months ago I shipped a Chrome extension that overlays an engineering-acceleration badge onto Crunchbase and Wellfound startup profiles. Today I shipped its companion: VC GitHub Lookup.

Hover any GitHub repo or org link → tooltip with commit velocity (14d), velocity change, contributor count and growth, signal type, and stage estimate. Chip on direct repo or org page loads. Toolbar manual lookup for any GitHub URL.

The thesis: investors should see the engineering signal where the engineering itself is happening, not just on Crunchbase. Two surfaces, same dataset, complete loop.

Install: https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm

Manifest V3, ~16 KB, no analytics. Only the owner slug hits the public API; responses cached in session storage for 5 min so the API stays friendly. Free in perpetuity.

Anyone using GitHub-side signals in their workflow? What would make this more useful?
```

### Hacker News — Show HN ❌ NOT POSTED — account `the_data_nerd` BLOCKED 2026-05-04

> Self-reported by user 2026-05-04 ~15:45 EEST: HN account is currently blocked from submitting/commenting after the May-2 dang unflag cycle. Saved to memory as `feedback_hn_account_blocked.md` — supersedes the prior "rough drafts only" rule while the block stands. Do NOT redraft, do NOT retry. Resolution = user emails dang@/hn@ycombinator.com from `mkondratyuk86@gmail.com` (real-name inbox) when ready.

The original rough draft is preserved below for the record; do not use it until the user explicitly says "HN is back".

```
this is a free chrome extension. hover any github repo or org link, see commit velocity over the last 14d, velocity change vs prior period, contributor count and growth, signal type, stage estimate. chip on direct visits. toolbar popup if you want to type an org name in.

manifest v3, 16kb, no analytics, no account. only thing it sends is the owner slug. responses cached 5 min in session storage.

uses signals.gitdealflow.com which i've been building for 6 months — public dataset, methodology on ssrn (abstract 6606558).

companion to my earlier extension that does the same thing on crunchbase and wellfound profiles. two surfaces, same data.

install: chromewebstore.google.com/detail/plgngijmloeljfkenecdkhiblcfcbblm

honest feedback wanted on whether the hover is too aggressive (fires on every github.com link in the page), too subtle, or right.
```

### LinkedIn (company page only — USER POSTS via LinkedIn UI)
```
Two surfaces, same signal — engineering acceleration meets you where you research.

We just shipped our second free Chrome extension: VC GitHub Lookup. Hover any GitHub repo or org and see commit velocity, contributor growth, signal type, and a stage estimate. Chip on direct visits. Toolbar manual lookup popup.

It's the companion to our existing Crunchbase + Wellfound profile badge — together they form the complete loop. The signal where you do deal research, AND the signal where the engineering itself originates.

Free in perpetuity. Manifest V3, ~16 KB, no analytics, no account.

Install: https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm

Existing extension (Crunchbase + Wellfound): https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn
```

## Notes / guardrails
- Per memory `feedback_no_linkedin_no_reddit_automation`, Claude drafts only — user posts manually on Reddit / LinkedIn / HN / IH.
- Per memory `feedback_hn_manual_posting`, the HN draft above is intentionally rough; rewrite before posting (Apr 22 mod flagged polished bodies).
- Per memory `feedback_target_conversations_not_people`, before any HN/Reddit post, run a 30-sec scan of the front page to ensure the audience matches; if not, defer.
- The LinkedIn post is for the company page (per memory `feedback_linkedin_undecided`), not personal profile.

---

## 2026-05-04 — Autonomous traffic+subs+buyers push (claude/relaxed-chatelet-164994 worktree, ~17:30 EEST)

User asked: "think out of the box… increase traffic, subscribers, buyers… proceed autonomously". Diagnosed today's gaps after morning Chrome-ext launch: dev.to draft-ready post not shipped; social-feed queues 0/2 used today; **no `/pricing` pSEO surface existed** despite five-tier offer; apex trust-strip missing the just-launched Substack publication.

### Autonomous moves shipped
- **`/pricing` pSEO pillar shipped** — `pseo-site/app/pricing/page.tsx` (5 tiers · ItemList + FAQPage + WebPage Speakable + BreadcrumbList JSON-LD · 11 Q&As targeting "GitDealFlow pricing" / "VC deal-flow tool cost" / "is there a free tier" / "founding-member rates" / "Sector Sweep vs Dashboard" SERP intent · AgentSummary with 4 facts · per-tier Stripe deep links · in-page anchors).
- **Internal-link surface for `/pricing`** — added to `Header.tsx` (NAV array + desktop + mobile + SiteNavigationElement JSON-LD), `Footer.tsx` (Product column), `PSEOFooterNav.tsx` (Other entry points). New canonical entry in `sitemap/[id]/route.ts` core block (priority 0.9) and `lib/hreflang.ts` (PATH_TO_TOPIC + TOPIC_TO_EN_PATH wired both directions; existing ja-only locale stub now reciprocates to the English canonical).
- **Apex landing conversion lever** — `landing/index.html` trust-strip gains `gitdealflow.substack.com/p/top-100-…` entry (fresh authority signal, mirrors yesterday's Substack publication launch); pricing-section header gains "See the full five-tier pricing comparison →" CTA pointing at `/pricing` (gives apex visitors a deep-detail surface, gives `/pricing` upstream PageRank).
- **Bluesky** — `tools/bluesky/engage.mjs` posted 1 post + 3 likes (warmup day-2 plan completed, idempotent). Top relevance candidate captured at 0.75. Output state.json updated.
- **Mastodon** — `tools/mastodon/engage.mjs` posted 1 post + 3 favs (warmup day-2 plan completed). Out of 128 candidates, top relevance was 0.25 — nothing on-thesis enough to reply to today.
- **Startup-discovery refresh** — `pseo-site/scripts/fetch-github-data.ts` running in background (PID 27308 — kicked off ~17:00 EEST, still mid-run at log time, hundreds of orgs processed; data file will be picked up by next build).
- **Production deploys** — pseo-site `dpl_FKTLPpqGCr89BNga1m97U6MH5chQ` (READY, aliased `signals.gitdealflow.com`); apex `dpl_EnPoSKRKfxnUb2qjJ3G6GfCGbNww` (READY, aliased `gitdealflow.com`). Both verified HTTP 200 with new content visible (`/pricing` returns FAQPage schema + all 5 tier names; apex shows "Substack publication" trust-strip entry + "See the full five-tier pricing comparison →" CTA).
- **IndexNow** — postbuild hook fired 5 URLs (HTTP 200); manual top-up fired `/pricing` + 3 sitemap URLs to api.indexnow.org (HTTP 200); apex update batch fired 2 URLs (HTTP 200).

### Blocked autonomously, queued as USER TODO
- **dev.to ph-launch-postmortem** — `distribution/devto-autopublish/queue.json` order-2.5 still `draft-ready` for 2026-05-04. `tools/devto/publish-next.mjs` requires `DEV_TO_API_KEY` which is not in `tools/.env`. USER ACTION: paste `DEV_TO_API_KEY=…` into `tools/.env` (key from dev.to → Settings → Extensions), then re-run `node tools/devto/publish-next.mjs`.
- **Farcaster first 2 casts** — `tools/farcaster/engage.mjs` reports "Missing NEYNAR_API_KEY / FARCASTER_SIGNER_UUID / FARCASTER_FID in tools/.env". Channel still untouched. USER ACTION: provision Neynar signer (https://dev.neynar.com/) and add the three vars to `tools/.env`.
- **Cold outreach (1 send/day max)** — `tools/campaign/HOLD` still in effect from 2026-04-20 (re-instated 2026-05-02 evening per memory). 6 pending pitches with no `needsResearch` (oldest: pitch-001-failory from 2026-04-21; 4 SOTW pitches scheduled 2026-05-05). `feedback_real_soap_opera_sender_is_pseo` adjacent guardrail: chat-level "proceed autonomously" instruction is NOT equivalent to lifting HOLD. USER ACTION: `rm tools/campaign/HOLD` from real-name terminal when ready to resume; campaign runner will then send 1/day per pace rules.

### Why these moves (out-of-the-box rationale)
- **`/pricing` is the highest-leverage missing surface.** Every other major B2B SaaS has a `/pricing` SEO entry that captures the bottom-of-funnel SERPs ("GitDealFlow pricing", "is X free", "X vs Y price"). The existing 46 pSEO routes don't include one. Shipping a single FAQPage-rich page with all 5 tiers + 11 high-intent Q&As + ItemList schema captures buyer-intent traffic that previously dead-ended at the apex `#pricing` anchor (which doesn't index as a separate URL). The cross-link in the trust-strip section makes the new surface immediately discoverable from every existing page.
- **Substack on the trust-strip** is a tiny edit with disproportionate signal: Substack is a recognized publication brand, the strip already establishes Zenodo / SSRN / Wikidata / SaaSHub as authority anchors, adding one more verified mirror tightens the credibility chain visible above the pricing fold.
- **Bluesky/Mastodon engagements** are the only outbound channels available today (Chrome MCP off, HN blocked, Reddit/LinkedIn manual-only, Discord retired, Hashnode retired) and they're warmup-day-2 — small, idempotent posting runs maintain reputation without overrunning the warmup curve.

### Net deltas
- Routes added to prod: 1 (`/pricing`)
- Schema entities added: 4 (WebPage Speakable, BreadcrumbList, ItemList of 5 tiers, FAQPage with 11 Q&As)
- Internal links pointing at `/pricing` from other pages: 4 (Header desktop + mobile + Footer Product + PSEOFooterNav)
- Trust-strip authority anchors: 8 → 9
- Social posts shipped: 2 (Bluesky 003 / Mastodon 003 — Signal-of-the-week gini-coefficient anchor)
- Production deploys: 2 (pseo-site + apex)
- IndexNow pings: 3 batches, HTTP 200 each

### Where the user picks up
Three USER TODOs to unblock the full chain:
1. Add `DEV_TO_API_KEY` to `tools/.env` (then re-run dev.to publish — ph-launch-postmortem ships within seconds).
2. Add `NEYNAR_API_KEY` + `FARCASTER_SIGNER_UUID` + `FARCASTER_FID` to `tools/.env` (then re-run `node tools/farcaster/engage.mjs` for the first cast).
3. `rm tools/campaign/HOLD` from real-name terminal to resume cold outreach (1 send/day, starting with pitch-001-failory which is overdue from 2026-04-21).

---

## 2026-05-04 — Wave 2-4 (continued autonomous push, ~18:30 EEST)

User said "proceed autonomously" again. Continued the traffic+subs+buyers push with three more waves of high-leverage shipping. All deploys verified HTTP 200, all schema valid, all IndexNow pings successful.

### Wave 2 — `/pricing` polish + cross-link CTAs
- Fact-corrected `/pricing` and `AgentSummary` from "85+ startups across 20 sectors" to "106 startups across 19 sectors" (matched the live signal report; later refreshed to 109 in Wave 4).
- Added **PH50OFF promo banner** to `/pricing` page-top — same code as the apex banner; auto-applies at Stripe checkout, stacks on top of founding-member rates. Conversion lever for visitors landing directly on `/pricing` without seeing the apex.
- Cross-linked `/pricing` from two high-traffic pages with full-width CTA blocks:
  - `/alternatives` (buyer-intent comparison-shopping landing) gains "Comparing tools? Here's what we cost." block with sky-themed CTA → `/pricing`.
  - `/integrations` (tool-shopping evaluators) gains "What does it cost?" block with the same theming → `/pricing`.
- Deploy: pseo-site `dpl_7Cxm6ErGyhgCkYTtJd5B78c2TqtL` (READY → signals.gitdealflow.com).
- Verified: `curl /pricing` returns PH50OFF + 106 references; `curl /alternatives` returns "Comparing tools" + "See full pricing"; `curl /integrations` returns "What does it cost" + "See full pricing".

### Wave 3 — `/buyers-guide` pSEO pillar
- NEW `pseo-site/app/buyers-guide/page.tsx` — opinionated 11-criterion buyers guide for evaluating VC deal-flow tools. Each criterion has the title, why-it-matters paragraph, the question to ask the vendor, and how VC Deal Flow Signal handles it. Plus 8-question FAQ targeting buyer-intent SERPs ("how should a small fund evaluate VC deal-flow tools", "what questions should I ask the vendor", "is open methodology more important than accuracy", "how much should a small fund spend", "cheapest way to test before committing", "why does pricing transparency matter", "engineering signals vs funding-round signals", "what is MCP for VC tooling").
- Schema: Article + WebPage Speakable + BreadcrumbList + ItemList of 11 criteria + FAQPage with 8 Q&As. AgentSummary with 4 facts. Twin pricing CTAs (top + bottom) plus a sister-CTA to `/alternatives`.
- Wired into `pseo-site/app/sitemap/[id]/route.ts` core block at priority 0.85, `Header.tsx` NAV array (drives JSON-LD SiteNavigationElement), and `Footer.tsx` Product column. Mobile/desktop visible nav stays at 6 items (kept `/buyers-guide` JSON-LD-only to avoid overcrowding).
- Deploy: pseo-site `dpl_FespUS2A2…` (READY → signals.gitdealflow.com).
- Verified: `/buyers-guide` returns "11 criteria" + "Eleven" + "Compare alternatives" + "First Look Pass" + "See full pricing" + sitemap entry confirmed.

### Wave 4 — AEO manifests (llms.txt + llms-full.txt)
- `pseo-site/app/llms.txt/route.ts` and `pseo-site/app/llms-full.txt/route.ts` now describe `/pricing` and `/buyers-guide` for AI bots. Pricing entry summarizes all 5 tiers + founding-member dynamics + PH50OFF + 30-day guarantee in the single bullet AI parsers will quote. Buyers Guide entry lists all 11 criteria + the small-fund decision-weight ordering.
- Fixed stale "ja-only — no English counterpart" comment on `/ja/pricing` line — English canonical now exists at `/pricing`, the ja stub correctly reciprocates.
- llms-full.txt gets a new "## Pricing" section (5-tier breakdown with prices and value-anchors) and a "## Buyers Guide" section (one-paragraph criteria summary with the 3-criterion small-fund filter).
- Deploy: pseo-site (final) `dpl_…/v5` after Wave 4 + 109-fact-refresh.
- Verified: `curl /llms.txt` shows 7 pricing/buyers-guide references; `curl /llms-full.txt` shows 4; "## Pricing" + "## Buyers Guide" sections present in llms-full.txt.

### Bonus — startup-discovery refresh (background → live data)
- The `pseo-site/scripts/fetch-github-data.ts` background job that I kicked off at the start of the session completed: **76 pages, 424 startup entries, 228 FAQs, 136 unique orgs**. Effective venture-backed-startup count grew **91 → 109 startups** (18 new discoveries persisted across 19 sectors).
- Build picked up the fresh dataset; signal report regenerated as `weekly-signal-report-2026-05-04 (109 startups, 19 sectors)`.
- Updated all hard-coded fact references (106 → 109 across `/pricing`, `/buyers-guide`, llms-full.txt). Verified live: each page now reports the 109/19 figure.

### Net session deltas (cumulative across all waves today)
- **NEW pSEO routes shipped**: 2 — `/pricing` + `/buyers-guide`
- **NEW schema entities**: 8 (WebPage Speakable + BreadcrumbList for both pages, ItemList of 5 tiers, ItemList of 11 criteria, FAQPage 11 Q&As + FAQPage 8 Q&As, Article on `/buyers-guide`)
- **Internal links pointing at `/pricing`**: 8 (Header desktop + Header mobile + Header NAV array + Footer Product + PSEOFooterNav + apex pricing CTA + `/alternatives` block + `/integrations` block + `/buyers-guide` top + `/buyers-guide` bottom = 10 actually)
- **Internal links pointing at `/buyers-guide`**: 2 (Header NAV array → JSON-LD only, Footer Product column)
- **AEO manifests updated**: 2 (llms.txt + llms-full.txt with `/pricing` + `/buyers-guide` entries)
- **Data refresh**: 91 → 109 startups (+18, +19.8% data growth)
- **Production deploys**: 5 pseo-site rebuilds (initial + 4 successive waves) + 1 apex landing
- **IndexNow pings**: 5 batches (postbuild + 4 manual), all HTTP 200

### What's still USER TODO (unchanged from earlier)
1. Add `DEV_TO_API_KEY` to `tools/.env` → re-run `node tools/devto/publish-next.mjs` to ship ph-launch-postmortem.
2. Add `NEYNAR_API_KEY` + `FARCASTER_SIGNER_UUID` + `FARCASTER_FID` to `tools/.env` → re-run `node tools/farcaster/engage.mjs` for first cast.
3. `rm tools/campaign/HOLD` from real-name terminal to resume cold outreach (1 send/day; oldest pending: pitch-001-failory).

---

## 2026-05-04 — Wave 5 (Sharp Tier surfacing, ~19:30 EEST)

User said "proceed with everything else autonomously" again. Continued shipping. **Highest-revenue-density move of the day:** Sharp Tier (€497/mo, application-gated, 8-fund cap 2026) was buried on apex landing — added it as the 5th tier on /pricing (it had been omitted as the 5-tier structure was modeled on the apex listing). One Sharp Tier conversion = roughly 5 Insider Circle conversions on revenue.

### Wave 5a — `/pricing` CTAs on high-traffic content pages
- **`/faq`** gains a third button in its bottom CTA row: "See Pricing" alongside "Browse Sectors" and "Read Methodology". Buyer-intent visitors who exhausted the FAQs get a one-click path to /pricing.
- **`/methodology`** gains "See Pricing" + "Read the Buyers Guide" buttons in the bottom CTA row, alongside "Browse Sector Rankings". Bonus: methodology copy fact-corrected from "20 sectors" to "19 sectors".

### Wave 5b — Sharp Tier added as 5th tier on `/pricing` (the missing high-margin tier)
- `pseo-site/app/pricing/page.tsx` `tiers` array now contains 6 entries (was 5). Sharp Tier inserted between Insider Circle and Sector Sweep, ordered correctly cheapest-to-most-expensive.
- Sharp Tier card: €497/mo, "€4,970/yr saves two months · application required · 8-fund cap 2026" RRP label, full feature list (quarterly review call, custom watchlist co-build, white-labeled API at `/api/v1/sharp/<your-fund>`, methodology source code access via private repo invite, same-day signal Q&A, data-room exports for LP updates, all future paid MCP tools), structured `mailto:` application URL with intake template (fund name, AUM/deals-year, thesis focus, attribution, review-call agenda).
- Title metadata pivoted "Pricing — Free Forever, €7 First Look, €9.97 Dashboard, €97 Insider, €1,997 Sweep" → "Pricing — Free, €7 First Look, €9.97 Dashboard, €97 Insider, €497 Sharp, €1,997 Sweep".
- "five tiers" → "six tiers" everywhere (description, AgentSummary TLDR, page H1 subhead, FAQ "How much does VC Deal Flow Signal cost", FAQ "Do you offer enterprise pricing?").
- Enterprise FAQ rewritten to lead with Sharp Tier (€4,970/yr) as the formal active-fund landing. Sweep is still positioned as the lower-commitment on-ramp; deeper-custom enterprise contact (white-label fund UI, dedicated Slack, fundraise on-call) routed to scoped-proposal email.
- **`/buyers-guide`** top-CTA copy updated: "five tiers from free to €1,997" → "six tiers from free to €4,970/yr Sharp Tier (active-fund tier, application-gated) and a €1,997 one-time Sector Sweep".
- **Apex landing** "See the full five-tier pricing comparison →" → "See the full six-tier pricing comparison →".
- **`llms.txt`** Pricing entry rewritten as 6-tier summary including Sharp Tier (application-gated, capped at 8 funds in 2026).
- **`llms-full.txt`** "## Pricing" section gets a new tier 5 (Sharp Tier full breakdown) and renumbers Sector Sweep to tier 6.

### Wave 5c — Substack queue check (no action needed)
- Substack autopublish queue inspected: 0 pending (all 42 ordered Notes are published or `draft-ready` through 2026-05-12). Healthy cadence; daily publisher will pick up the next entry on schedule. Skipped drafting more entries — the existing queue covers the next ~8 days.

### Wave 5d — `/changelog` updated with today's three milestones
- New entry: "Pricing surface redesign: /pricing + /buyers-guide + Sharp Tier" (tag: seo) — describes the full three-page surface and the cross-link mesh.
- New entry: "Dataset refresh: 91 → 109 startups (+19.8%)" (tag: data) — describes the autonomous fetch-github-data run, panel growth, regenerated email and signal-of-the-week artifacts.
- Existing 2026-05-04 Chrome-ext entry preserved.

### Production deploys
- **pseo-site v8** `dpl_…` (Sharp Tier on /pricing, /faq + /methodology CTAs, llms.txt + llms-full.txt updates) — verified `Sharp Tier` + `€497` + `application-gated` + `8 funds` + `Apply for Sharp` + `six tiers` all returning on /pricing; /faq returns 2× /pricing references; /methodology returns 2× /pricing-or-/buyers-guide references.
- **Apex landing v3** `dpl_…` — verified `six-tier pricing` returning on apex.
- **pseo-site v9** `dpl_…` (changelog updates) — verified `Pricing surface redesign`, `Dataset refresh: 91 → 109`, `Sharp Tier`, `Second Chrome extension shipped` all returning on /changelog.
- **IndexNow**: 4 batches HTTP 200 (pseo wave-5b initial + apex wave-5b + pseo wave-5d changelog + final cleanup batch).

### Cumulative session deltas (waves 1-5)
- **NEW pSEO routes shipped today**: 2 (`/pricing`, `/buyers-guide`)
- **NEW pricing tier surfaced**: 1 (Sharp Tier — was buried on apex, now has its own /pricing card + JSON-LD ItemList entry + dedicated llms.txt mention + AgentSummary fact)
- **NEW schema entities**: 9 (WebPage Speakable + BreadcrumbList for /pricing and /buyers-guide, ItemList of 6 tiers, ItemList of 11 criteria, FAQPage 11 Q&As, FAQPage 8 Q&As, Article on /buyers-guide)
- **Internal links pointing at /pricing**: 12 (Header desktop + Header mobile + Header NAV array + Footer Product + PSEOFooterNav + apex pricing CTA + /alternatives block + /integrations block + /buyers-guide top + /buyers-guide bottom + /faq button + /methodology button)
- **Internal links pointing at /buyers-guide**: 3 (Header NAV array → JSON-LD only, Footer Product column, /methodology button)
- **AEO manifests updated**: 2 (llms.txt + llms-full.txt, both updated twice — once for /pricing+/buyers-guide, once for Sharp Tier addition)
- **Production deploys**: 7 pseo-site + 2 apex landing
- **IndexNow batches**: 9 (all HTTP 200)
- **Data refresh**: 91 → 109 startups (+18 new, +19.8%)
- **Social posts shipped**: 2 (Bluesky day-2 + Mastodon day-2; warmup-aware, idempotent)
- **Changelog entries added**: 2 (pricing redesign + dataset refresh)

---

## 2026-05-04 — Wave 6 (Trust-page conversion mesh, ~20:15 EEST)

User said "proceed autonomously" again. Continuing diminishing-returns cleanup. **Move: extend the /pricing + /buyers-guide cross-link mesh to the remaining buyer-trust surfaces** (`/attestations`, `/press`, `/about`).

### What shipped
- **`/attestations`** gains a full sky-themed conversion-CTA block at the bottom: "Trust verified — ready to subscribe?" with a one-paragraph 6-tier pricing summary, founding-member callout, and 30-day guarantee mention. Two CTAs side-by-side: primary "See pricing →" and secondary "Read the buyers guide".
- **`/press`** see-also footer line gets two new inline links: "Pricing" and "Buyers guide", alongside the existing Citation guide / Standards / Attestations / apex link.
- **`/about`** bottom-CTA row gets a third button: "See Pricing", alongside existing "Browse Sectors" and "See This Week's Signals".

### Why these three
- `/attestations` is the highest-quality buyer-trust surface (third-party indexers, A-Tier MCP rating, SSRN preprint, OpenAlex). Visitors who reach the bottom have done their trust-due-diligence — closing with a pricing CTA is the natural next step.
- `/press` is the journalist/analyst-facing trust surface. Some visitors are evaluating the product post-press-mention; they need pricing in one click.
- `/about` is the team/founder-context page. Visitors who read it deeply are conversion-warm.

### Production deploys
- pseo-site v11 `dpl_…` (rebuild after Vercel transient deploy_failed). Verified: `/attestations` returns 2× /pricing-or-/buyers-guide refs, `/press` returns 2× /pricing-or-/buyers-guide refs, `/about` returns 2× /pricing refs.
- IndexNow ping fired for the 3 updated URLs (HTTP 200).

### Cumulative session deltas (waves 1-6)
- **Internal links pointing at /pricing**: 15 (up from 12 in Wave 5 — added /attestations CTA, /press inline link, /about CTA)
- **Internal links pointing at /buyers-guide**: 5 (up from 3 — added /attestations CTA, /press inline link)
- **Production deploys**: 8 pseo-site + 2 apex landing
- **IndexNow batches**: 10 (all HTTP 200)
- **All other counts unchanged from Wave 5** (no new pSEO routes, no new schema entities, no new pricing tiers in this wave)

### Stopping autonomous expansion here
Diminishing returns: the major buyer-trust surfaces, content pages, and comparison pages all now link to /pricing. Beyond this point, marginal cross-link additions return less value than would be gained by:
1. **User unblocking the 3 USER TODOs** (DEV_TO_API_KEY, Neynar signer, HOLD lift) — each opens a major outbound channel
2. **User reviewing + committing the working-tree edits in main** — captures the work cleanly for future PR/cherry-pick
3. **Allowing time for the new pSEO routes to be indexed** — Google + Bing typically take 24-72h to crawl new entries; first SERP visibility for /pricing and /buyers-guide should arrive between 2026-05-05 and 2026-05-07.

---

## 2026-05-04 — Wave 8 (Enterprise + machine-readable pricing API, ~21:00 EEST)

User said "proceed autonomously" again after dev.to API key was provided and PR opened. Two more high-leverage shipments:

### Wave 8a — `/api/v1/pricing.json` (machine-readable pricing for AI agents)
- NEW `pseo-site/app/api/v1/pricing.json/route.ts` (287 lines).
- Returns all 6 tiers with structured fields: `priceEur`, `priceCadence` (free/one-time/monthly/yearly/monthly-or-yearly), `listPriceEur`, `foundingMember` flag, `applicationGated` flag, `capacity` string, `oneLine`, `forWho`, `bullets`, `ctaLabel`, `ctaHref`, `guarantee`, `promoCode`.
- Top-level metadata blocks: `currency: "EUR"`, `promoCode` (PH50OFF — applies to dashboard-beta + insider-circle, stacks with founding-member rates), `guarantee` (30-day Signal-or-It's-Free with mechanism + appliesTo array), `foundingMemberPolicy`, `cancellationPolicy`, `enterprise` pointer (Sharp Tier slug + applicationUrl + capacityRemaining + humanPage).
- `relatedDocs` cross-references `humanPricingPage`, `buyersGuide`, `enterprisePage`, `methodology`, `llmsIndex`, `llmsFull`.
- License: `CC-BY-4.0` with attribution string.
- Cache: `public, s-maxage=3600, stale-while-revalidate=86400`. CORS: `Access-Control-Allow-Origin: *`. `Last-Modified` derived from `getDataLastModified()`.
- Verified live: `curl https://signals.gitdealflow.com/api/v1/pricing.json` returns HTTP 200 with `tiers=6, version=1.0.0, currency=EUR, promoCode.code=PH50OFF`.

### Wave 8b — NEW `/enterprise` page (SERP capture for enterprise queries)
- NEW `pseo-site/app/enterprise/page.tsx` (413 lines).
- Targets "VC deal flow enterprise pricing", "GitDealFlow enterprise plan", "VC deal flow tool enterprise" SERPs.
- Two paths surfaced:
  - **Sharp Tier** at €497/mo (€4,970/yr saves two months, application-gated, capped at 8 funds in 2026)
  - **Custom enterprise scope** starting at €15,000/yr (white-label fund-branded UI, dedicated Slack channel, on-call fundraise diligence, custom sector coverage expansion, multi-seat agreements covering multiple investing arms under one GP)
- 7 detailed Sharp Tier features (quarterly review call, custom watchlist co-build, white-labeled API endpoint, methodology source code access via private repo invite, same-day signal Q&A, data-room exports for LP updates, all future paid MCP tools included).
- 5 custom-enterprise-scope features (fund-branded UI, dedicated Slack, on-call diligence, sector expansion, multi-seat).
- 8-question FAQ targeting enterprise-specific intent (cap rationale, application process, cancellation policy, methodology contribution path, multi-seat pricing, custom sector expansion, Sharp-vs-Sweep relationship).
- Schema: WebPage Speakable + 3-level BreadcrumbList (Sectors → Pricing → Enterprise) + FAQPage with 8 Q&As.
- Two structured `mailto:` CTAs with prefilled subject/body intake templates (Sharp Tier application + custom enterprise scope request).
- AgentSummary with 4 facts.
- Verified live: `curl /enterprise` returns Sharp Tier + €497 + application-gated + Apply for Sharp visible.

### Wiring
- `pseo-site/app/sitemap/[id]/route.ts` core block: `/enterprise` priority 0.85, `/api/v1/pricing.json` priority 0.7.
- `pseo-site/app/llms.txt`: NEW Enterprise entry (Sharp Tier + custom scope summary) + NEW Pricing JSON API entry (machine-readable companion for AI agents/MCP/procurement automations).
- `pseo-site/components/Header.tsx`: NAV array gains `{ href: "/enterprise", label: "Enterprise" }`. Drives JSON-LD SiteNavigationElement.
- `pseo-site/components/Footer.tsx`: Product column gains `<Link href="/enterprise">Enterprise</Link>`.

### Production deploy
- pseo-site v12 `dpl_…` (READY → signals.gitdealflow.com). Verified both endpoints HTTP 200.
- IndexNow ping fired for `/enterprise + /api/v1/pricing.json + /llms.txt + sitemap/core.xml` — HTTP 200.

### PR #18 update
- Commit `1354582` pushed to `claude/pricing-buyers-guide-2026-05-04`. PR #18 now contains:
  - Commit 1: `seo: NEW /pricing + /buyers-guide pSEO pillars + cross-link mesh` (1321 insertions, 4 NEW files)
  - Commit 2: `seo: NEW /enterprise page + /api/v1/pricing.json (wave 8)` (700 insertions, 2 NEW files)

### Cumulative session deltas (waves 1-8)
- **NEW pSEO routes shipped today**: 4 (`/pricing`, `/buyers-guide`, `/enterprise`, `/api/v1/pricing.json`)
- **NEW pricing tier surfaced**: 1 (Sharp Tier — was buried on apex landing only, now first-class on /pricing + dedicated /enterprise + JSON API + llms.txt + AgentSummary)
- **NEW schema entities**: 11 (WebPage Speakable × 3, BreadcrumbList × 3 incl 3-level on /enterprise, ItemList × 2, FAQPage × 3 with 11+8+8 Q&As, Article × 1)
- **Internal links pointing at /pricing**: 16 (Header desktop + Header mobile + Header NAV + Footer Product + PSEOFooterNav + apex pricing CTA + /alternatives + /integrations + /buyers-guide top + /buyers-guide bottom + /faq + /methodology + /attestations + /press + /about + /enterprise)
- **Internal links pointing at /buyers-guide**: 6 (Header NAV + Footer + /methodology + /attestations + /press + /enterprise nav)
- **Internal links pointing at /enterprise**: 2 (Header NAV + Footer)
- **Internal links pointing at /api/v1/pricing.json**: 2 (llms.txt + sitemap)
- **AEO manifests updated**: 2 (llms.txt + llms-full.txt with all 4 new routes)
- **Production deploys**: 12 pseo-site + 2 apex landing
- **IndexNow batches**: 11 (all HTTP 200)
- **Data refresh**: 91 → 109 startups (+19.8%)
- **Social posts shipped**: 2 (Bluesky + Mastodon, warmup-aware day-2)
- **dev.to articles published autonomously**: 2 ("I tracked 4,200 startup GitHub orgs" + "0 votes on Product Hunt") with canonical-back to /blog
- **Changelog entries added today**: 3
- **Commits on PR #18**: 2 (43ce717 + 1354582), 6 NEW files total (1321 + 700 = 2021 lines added)

### Remaining USER TODOs (truly external dependencies)
1. **Farcaster** — provision Neynar signer + add 3 vars to `tools/.env`, then `node tools/farcaster/engage.mjs`.
2. **Cold outreach** — `rm tools/campaign/HOLD` from real-name terminal to resume queue (oldest pending: pitch-001-failory).
3. **Companion modifications commit** — review the 14 modified files in `seo/disambiguation-chain-2026-05-01` working tree (Header / Footer / hreflang / sitemap / llms* / cross-link CTAs / apex landing) and commit them on the appropriate branch.
