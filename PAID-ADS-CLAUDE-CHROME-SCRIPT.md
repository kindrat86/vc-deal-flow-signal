# Paid Ads Launch — Claude (Chrome) Execution Script

> Browser-level, step-by-step script for Claude driving Chrome (CDP / Playwright /
> cua-driver). Companion to `PAID-ADS-LAUNCH-RUNBOOK.md` (strategy + copy source of
> truth). This file turns that strategy into ordered browser actions with explicit
> human handoff points.
>
> **Ground rules Claude must follow:**
> 1. ORDER IS MANDATORY: Reddit first, Google second, Meta third, Newsletter fourth.
>    Do not reorder. Google's ~EUR 4-8 CPC is only paid after Reddit proves the
>    landing converts (>2%).
> 2. HUMAN-ONLY = anything that needs a login session (Google/Reddit/LinkedIn/Meta
>    OAuth + password + 2FA) OR money (card entry, final Launch/Publish click).
>    Claude NEVER types a card number, password, or 2FA code. Ever.
> 3. At every `[HUMAN]` checkpoint, Claude STOPS, asks Maryan to proceed, waits for
>    "done", then continues. Never skip a checkpoint.
> 4. Build everything as DRAFT first. Only Maryan clicks the final money-committing
>    Launch/Publish.
> 5. All copy below is final and paste-ready. Do not rewrite it.

---

## Phase 0 — Pre-flight verification (Claude, no human)

Confirm the pipeline is live before touching any ad platform. If any check
fails, stop and report; do not proceed.

> **PRE-VERIFIED GREEN (2026-08-15):** Hermes ran every check below against both
> domains and all PASS (deployment `dpl_FRPXPiaWpJTzNmRhSa1EcSn5SLkf`, aliased
> signals.gitdealflow.com). The EUR 7 purchase event is confirmed live: the
> shipped chunk serves `"purchase"` + `transaction_id` + `"EUR"`. Claude may
> proceed straight to Phase 1 R1, or re-confirm the 5 sections in ~30s.

1. Conversion events live (corrected targets):
   - `curl -s https://gitdealflow.com/subscribe-thanks | grep -c generate_lead` => >= 1
   - `curl -s https://gitdealflow.com/dashboard-thanks | grep -c "value: 49"` => >= 1
   - The EUR 7 purchase fires on `signals.gitdealflow.com/firstlook/thanks` (NOT on
     gitdealflow.com). That page exists but redirects to `/firstlook?cancelled=1`
     without a paid `session_id`, so it can only be live-confirmed in GA4 Realtime
     after the first real EUR 7 purchase (or via the built JS chunk containing
     `PurchaseConversionEvent` once deployed).
2. GA4 live (inline, not /pixels.js):
   - `curl -s https://signals.gitdealflow.com/ | grep -c G-7SV2SNZE4C` => >= 1
     (PixelManager inlines gtag in the root layout)
   - Note: `/pixels.js` is a gitdealflow.com-only file; it 404s on
     signals.gitdealflow.com by design. Do not treat that 404 as a failure.
3. Short-redirect routes return 308 with UTM payload (8 slugs):
   `vc`, `angel`, `devtools`, `programming`, `ml`, `startups`, `harmonic`, `tracxn`.
   - For each: `curl -s -o /dev/null -w "%{http_code} %{redirect_url}" https://signals.gitdealflow.com/r/<slug>` => expect `308` + a `/firstlook?...` or `/alternatives/...` URL with `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`.
4. Landing pages return 200: `/firstlook`, `/alternatives/tracxn`,
   `/alternatives/harmonic-ai`, `/pricing`.

---

## Phase 1 — Reddit Ads (FIRST channel, ~EUR 5/day per ad group)

### [HUMAN] R1 — Account + card
Claude navigates to `https://ads.reddit.com`, waits at the login/signup gate, and
STOPS. Ask Maryan:
"Please log into ads.reddit.com (or sign up) and add a payment method. This is the
only step I cannot do: it needs your login and card. Tell me when done."

### [CLAUDE] R2 — Build 6 ad groups as drafts
Go to Campaigns > Create campaign. For EACH of the 6 groups below, do the same
sequence, then Save as draft (do NOT launch):

Common settings for all 6:
- Objective: **Traffic**
- Campaign name: `GDF-<slug>-<YYYYMMDD>`
- Schedule: continuous (no end date)
- Daily budget: **EUR 5**
- Format: single image or text link (data-viz creative only, no founder face, per anonymity rule)

Per-group payload (paste verbatim):

| # | slug | subreddit | destination | headline | body |
|---|---|---|---|---|---|
| 1 | vc | r/venturecapital | https://signals.gitdealflow.com/r/vc | I tracked 350+ startups' GitHub commits for 6 months. Here's what predicts a raise. | Commit velocity spikes 21-47 days before the deck hits. Test the signal on your own thesis for €7: pick a sector, get a ranked deep-dive (top 25 orgs + 3 pre-Crunchbase breakouts) in 24h. Or start free with the Sunday digest. SSRN method (n=219). |
| 2 | angel | r/AngelInvestors | https://signals.gitdealflow.com/r/angel | The 5 startups accelerating hardest on GitHub right now. | See which teams are shipping faster than their round. €7 gets you a one-sector ranked deep-dive in 24h, credited toward Dashboard if you upgrade within 14 days. Free Sunday digest also available, no card. |
| 3 | devtools | r/devtools | https://signals.gitdealflow.com/r/devtools | I reverse-engineered which GitHub signals actually predict a fundraise. | Commit velocity, contributor growth, repo expansion across 350+ orgs, published on SSRN. €7 deep-dive on any sector, delivered in 24h (PDF + raw CSV). Or the free weekly digest with the 5 fastest teams. |
| 4 | programming | r/programming | https://signals.gitdealflow.com/r/programming | A public dataset of 350+ startups' GitHub acceleration, updated weekly. | Free machine-readable API + MCP server, no key required. For a ranked sector report: €7, 24h, PDF + raw CSV. Or the free Sunday digest, 5 breakout teams every week. |
| 5 | ml | r/MachineLearning | https://signals.gitdealflow.com/r/ml | Which AI startups are accelerating on GitHub right now? | AI/ML drives most breakout signals in the dataset. €7 one-sector deep-dive ranks the fastest teams by commit velocity and contributor growth, in 24h. Free weekly digest also available. |
| 6 | startups | r/startups | https://signals.gitdealflow.com/r/startups | Founders: your GitHub activity is your pitch before you pitch. | I track 350+ startups' public GitHub and surface acceleration 21-47 days before rounds. €7 First Look ranks one sector in 24h. If your angels don't see it, your competitors will. Free weekly digest available too. |

### [HUMAN] R3 — Review + launch
Claude opens the drafts list, screenshots it, and STOPS. Ask Maryan:
"6 Reddit ad groups are drafted at EUR 5/day each (EUR 30/day total). Please review
and click Publish. I will not launch spending without you."

After Maryan confirms, Claude records the campaign IDs and moves to Phase 2 ONLY
after the success bar is met (see Phase 2 gate).

---

## Phase 2 — Google Search Ads (SECOND channel, ~EUR 10/day)

**Gate:** do not start Phase 2 until Reddit has run and `/firstlook` converts >2%
with CTR >0.8%. If the gate is not met, hold and report the Reddit numbers instead.

### [HUMAN] G1 — Account + card + link GA4
Claude navigates to `https://ads.google.com`, waits at the login gate, STOPS.
Ask Maryan:
"Please log into ads.google.com (use the Google account that owns GA4
G-7SV2SNZE4C), add a payment method, then go to Tools > Data manager > Google
Analytics 4 > Link, and link property G-7SV2SNZE4C. Tell me when done."

### [CLAUDE] G2 — Create 2 conversion actions
Tools > Conversions > New conversion action > Import > Google Analytics 4 events:
1. `generate_lead` -> category **Lead**, **Primary**, count **Once**.
2. `purchase` -> category **Purchase/Sale**, **Primary**, use **dynamic value**.
These map to the events already firing on the thanks pages (Phase 0 verified).

### [CLAUDE] G3 — Build 2 Search campaigns as drafts
For each campaign, Save as draft (do NOT launch).

Common settings for both:
- Network: **Search only** (no Display, no Search Partners)
- Languages: English
- Locations: EU + US (add Israel)
- Daily budget: **EUR 10**
- Bidding: Maximize conversions (or Manual CPC max EUR 4 if conversions are sparse at first)

#### Campaign `harmonic` -> destination https://signals.gitdealflow.com/r/harmonic
Headlines (paste all 15):
1. Harmonic AI Alternative
2. GitDealFlow: Harmonic Alternative
3. Track Stealth Startups on GitHub
4. Harmonic Alternative From $7
5. See What Harmonic Misses
6. GitHub Momentum, Not LinkedIn
7. Alternative to Harmonic AI
8. Free API, No Key Required
9. Stealth Startups Before They Raise
10. The $7 Harmonic Alternative
11. Track Commit Velocity Weekly
12. Harmonic AI vs GitDealFlow
13. Catch Breakouts 21 Days Early
14. MCP-Native Startup Signals
15. Free Sunday Signal Digest

Descriptions (paste all 4):
1. Tracks 350+ startups' GitHub commits weekly. Surfaces stealth teams a LinkedIn-first lens misses. Free tier, no API key.
2. Commit velocity, contributor growth, repo expansion. See breakouts 21-47 days before the round. SSRN method (n=219).
3. $7 First Look Pass, free Sunday digest. MCP server, JSON API, Chrome extension. No card to start.
4. The GitHub-native alternative to Harmonic. Free machine-readable API, updated weekly across 15 sectors.

Keywords (phrase match): "harmonic ai alternative", "harmonic alternative",
"harmonic.ai alternative", "alternatives to harmonic", "harmonic ai competitors",
"harmonic vs", "stealth startup tracker", "startup sourcing tool".

Negative keywords: "harmonic music", "harmonic price", "harmonic funding",
"harmonic round", "harmonic series", "jobs", "careers", "salary".

#### Campaign `tracxn` -> destination https://signals.gitdealflow.com/r/tracxn
Headlines (paste all 15):
1. Tracxn Alternative
2. GitDealFlow: Tracxn Alternative
3. Track Startups on GitHub, Not Lists
4. Tracxn Alternative From $7
5. See Momentum Before the Round
6. Commit Velocity vs Sector Lists
7. Alternative to Tracxn
8. Free API, No Key Required
9. Breakout Teams, 21 Days Early
10. The $7 Tracxn Alternative
11. GitHub-Native Deal Flow
12. Tracxn vs GitDealFlow
13. Stealth Startups, Weekly
14. MCP-Native Startup Data
15. Free Sunday Signal Digest

Descriptions (paste all 4):
1. Tracks 350+ startups' GitHub commits weekly. Surfaces engineering acceleration before it hits the funding lists. Free tier, no API key.
2. Commit velocity, contributor growth, repo expansion. Breakouts 21-47 days before the round. SSRN method (n=219).
3. $7 First Look Pass, free Sunday digest. MCP server, JSON API, Chrome extension. No card to start.
4. The GitHub-native alternative to Tracxn. Free machine-readable API, updated weekly across 15 sectors.

Keywords (phrase match): "tracxn alternative", "alternatives to tracxn",
"tracxn competitors", "tracxn vs", "startup database alternative", "deal flow tool".

Negative keywords: "tracxn pricing", "tracxn funding", "tracxn review",
"tracxn careers", "tracxn login".

### [HUMAN] G4 — Review + launch
Claude opens the drafts, screenshots, STOPS. Ask Maryan:
"2 Google Search campaigns are drafted at EUR 10/day total, with conversion
tracking linked to GA4. Please review and click Launch."

---

## Phase 3 — Meta retargeting (THIRD, cheapest CPA, ~EUR 5/day)

**Requires a Meta Pixel that does not exist yet.** This is blocked until Maryan
creates it (Meta Business Manager login).

### [HUMAN] M1 — Meta Business + Pixel + card
Ask Maryan:
"Please create a Meta Business account at business.facebook.com, add a card, create
a Meta Pixel (Events Manager > Connect data source > Web), and give me the 15-16
digit Pixel ID. I will wire it into the site and redeploy. This needs your login."

### [CLAUDE] M2 — Wire pixel + redeploy
1. Set `NEXT_PUBLIC_META_PIXEL_ID` in Vercel (pseo-site) AND set `PIXEL_IDS.meta`
   in `landing/pixels.js`, then redeploy both. (PixelManager.tsx already has the
   Meta loader; it fires the moment the env var is set.)
2. Verify with Meta Pixel Helper that PageView fires.
3. Then build retargeting audiences + ad sets in Ads Manager (objective: Traffic
   or Conversions), targeting:
   - Retarget `/pricing` visitors (30d) -> `/from/facebook?ref=rt-pricing`
   - Retarget `/firstlook` non-checkout -> `/from/facebook?ref=rt-firstlook`
   - Retarget `/walkthrough` >30s -> `/from/facebook?ref=rt-walkthrough`
   - 1% lookalike of paid subscribers -> `/from/facebook?ref=lal-investor`
   - 2% lookalike of `/firstlook` buyers -> `/from/facebook?ref=lal-engineer`
   - Cold interest stack (Venture capital + Software dev + Angel investor +
     Crunchbase) -> `/from/facebook?ref=cold-interest`

### [HUMAN] M3 — Launch
Ask Maryan to review the Meta ad sets and click Publish.

---

## Phase 4 — Newsletter sponsorship (FOURTH, scale buy, pre-paid)

Only after Reddit proves the landing converts (>2%). These are pre-paid slots.

### [HUMAN] N1 — Card for the slot
Ask Maryan to purchase the slot. Targets (in order):
1. TLDR (4M+ devs, ~$5k/slot) -> https://signals.gitdealflow.com/r/tldr
2. The Generalist (~150k VC-curious) -> https://signals.gitdealflow.com/r/generalist

---

## Post-launch — Claude autonomous monitoring (no human needed)

Once campaigns are live, Claude owns the loop:

1. **Daily:** pull campaign metrics; record impressions, clicks, CTR, CPC,
   conversions per ad group/campaign. North-star = qualified signups/day by
   `utm_source` in GA4.
2. **Reddit kill rule:** pause any ad group under 0.8% CTR after 3 days.
3. **Google kill rule:** pause any keyword with Quality Score <4 after 2 weeks, or
   50 clicks with zero conversion.
4. **Search-terms mining (weekly):** pull the Google Search Terms report, add new
   negatives (wrong-intent queries), and flag new winning keywords to expand.
5. **Conversion check:** confirm `generate_lead` and `purchase` fire in Google Ads
   > Conversions and GA4 > Reports > Engagement > Events.
6. **Cost guardrails:** if cost-per-lead exceeds EUR 15 (Google) or CPA exceeds
   EUR 4 (Meta) for 7 consecutive days, pause and report to Maryan before
   continuing.

---

## Summary of human-only handoffs (the ONLY times Claude stops)

| Checkpoint | What Maryan must do | Why Claude cannot |
|---|---|---|
| R1 | Log into Reddit Ads + add card | Login + payment |
| R3 | Click Publish on 6 Reddit drafts | Commits money |
| G1 | Log into Google Ads + add card + link GA4 | Login + payment |
| G4 | Click Launch on 2 Google drafts | Commits money |
| M1 | Create Meta Business + Pixel + card | Login + payment |
| M3 | Click Publish on Meta ad sets | Commits money |
| N1 | Buy newsletter slot | Payment |

Everything else in this document Claude executes autonomously.
