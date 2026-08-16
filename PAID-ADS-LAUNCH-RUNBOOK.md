# Paid Ads Launch Runbook — GitDealFlow

> Single source of truth for flipping the site from "0 ads" to "ads running."
> Written 2026-08-15 after a full autonomous audit. Companion to
> `pseo-site/lib/paid-acquisition.ts` (campaign table) and `MANUAL_QUEUE.md`
> SWITCH 3 (pixel creation).

---

## The only 3 things a human must do (everything else is already done)

Ad platforms hard-require a logged-in human for account creation, card entry,
and the final "Launch" click. There is no API for any of the three, and no
agent can spend your money. Everything up to those three clicks is prepared
below: copy, targeting, budgets, destination URLs, and conversion tracking.

**Total human time: ~15 min for the Reddit probe. Hard budget cap: $20 lifetime.**

| # | Human step | Time |
|---|---|---|
| 1 | Create Reddit Ads account + card | 10 min |
| 2 | Click Launch (campaign 1 only) | 1 min |
| 3 | (Later, only if Reddit probe converts) Google Ads account + GA4 link | 15 min |

> **$20 PROBE MODE (2026-08-16): the section below replaces the original six-group €5/day
> open-ended spec for the first spend.** The $20 experiment supports ONE campaign,
> ONE ad group. Reddit's platform floor is $5/day and ~$20-25 minimum lifetime
> budget, so $20 = one group running ~4 days, roughly 10-40 clicks at the
> $0.50-$2.00 B2B CPC range. That is a CTR + landing- quality signal, NOT a
> conversion-statistics experiment: at 2% expected conversion, 10-40 clicks
> gives 0-1 conversions, expected value ~0.4. The verdict it CAN deliver:
> (a) which subreddit audience cheapest delivers a click, (b) whether paid
> visitors engage the landing (GA4 engaged sessions, scroll, outbound clicks),
> (c) whether Reddit traffic subscribes to the free Sunday digest (the low-
> friction conversion already instrumented as generate_lead).
> Success bar for unlocking Google Stage 2: any paid-sourced signup OR
> engaged-session rate >= 40%. Kill rule: zero clicks by day 4 = pause, the
> creative/subreddit pairing is wrong; do not re-run without new copy.

---

## What is already live (verified 2026-08-15, no action needed)

- **GA4** `G-7SV2SNZE4C` firing on `signals.gitdealflow.com` (confirmed in page source).
- **LinkedIn Insight tag** `10702217` firing (audience building only; no LinkedIn campaigns, per the standing rule).
- **Short-redirect routes** `/r/<slug>` return 308 with full UTM payload, e.g.
  `/r/vc` → `/firstlook?utm_source=reddit&utm_medium=cpc&utm_campaign=vc-2026-05&utm_content=venturecapital`.
- **Landing pages** all return 200: `/firstlook`, `/alternatives/tracxn`,
  `/alternatives/harmonic-ai`, `/from/facebook`, `/pricing`.
- **UTM capture** end-to-end via `/api/subscribe` + `/api/verify` (PocketBase `subscribers`).
- **PixelManager** (components/PixelManager.tsx) ships Meta / Google / LinkedIn /
  Twitter / TikTok / Reddit / Quora / Pinterest / MS-UET loaders, each gated on its
  `NEXT_PUBLIC_*` env var. Set the var in Vercel and the pixel starts firing, no code change.
- **Conversion events** (corrected 2026-08-15): the apex `gitdealflow.com` thanks
  pages fire `generate_lead` on `/subscribe-thanks` (newsletter) and `purchase` on
  `/dashboard-thanks` (49), `/insider-thanks` (197), `/sector-sweep-thanks` (1997)
  via gtag with a sessionStorage dedupe guard. These are the Stripe success URLs
  for the dashboard/insider/sector_sweep tiers (see `lib/stripe-tiers.ts`). The
  EUR 7 First Look success page is `signals.gitdealflow.com/firstlook/thanks`; a
  `purchase` event there is deployed + live-verified 2026-08-15
  (`components/PurchaseConversionEvent.tsx`, deployment dpl_FRPXPiaWpJTzNmRhSa1EcSn5SLkf).
  `gitdealflow.com/firstlook-thanks` is a legacy page, NOT the live EUR 7 success target.

## Bugs fixed this session

- Google Ads `harmonic` campaign pointed at `/alternatives/harmonic`, which 404s.
  The live slug is `/alternatives/harmonic-ai`. Fixed in `lib/paid-acquisition.ts`
  (canonical `~/signals-gitdealflow/pseo-site` on `main`, sentinel-enforced), plus the cited
  `sourceUrl` in `content/agent-queries.ts` and two surfaces in
  `app/experiments/hooks/page.tsx`. A regression guard was added to
  `scripts/verify-no-regressions.ts` so no deploy can reintroduce the 404.

---

## Launch order (and the honest why)

1. **Reddit Ads first.** €5/day floor, no minimum lock-in, subreddit targeting
   (r/venturecapital, r/AngelInvestors, r/programming) is a literal Brunson
   Dream-100 cluster of the developer-investor ICP. No Quality Score concept:
   Reddit's auction is CTR + relevance, so you get signal without Google's
   "new account" penalty.
2. **Google Search second.** This is where **Quality Score** lives, and it is
   only computable after ads accrue impressions + clicks against expected CTR.
   Commercial-intent keywords ("harmonic alternative", "tracxn alternative")
   map to existing landing pages. Run only after Reddit confirms `/firstlook`
   converts >2% (you do not want to pay Google's ~€4–8 CPC on an unproven landing).
3. **Meta retargeting third.** After the Meta Pixel exists (SWITCH 3). Cheapest
   CPA in the funnel (~€2–4): retarget people who already hit /pricing or /firstlook.
4. **Newsletter sponsorship fourth.** Only after Reddit proves the landing
   converts. TLDR slot ~$5k is a scale buy, not a test.

---

## Reddit audience list (pre-built 2026-08-16)

> Researched against the ICP (angels, scouts, seed funds, plus the technical/analyst
> side that values a GitHub-signal dataset). This supersedes the single-subreddit
> "targeting r/X" line under each ad group below: every group now has a community set,
> an interest layer, a keyword layer, and an exclusion set. Subscriber sizes are
> directional from public 2026 community indexes; the Ads Manager "Communities"
> typeahead shows live "est. N users" reach, which is the number that actually
> matters. The $20 probe runs ONLY the `vc` group, so `vc` is the only audience you
> must build correctly on launch day; the other five are staged for when the verdict
> raises budget.

### ICP segments and their subreddits

| Segment | Why they convert | Subreddits (approx size, directional) | Intent tier |
|---|---|---|---|
| Investor (angels, scouts, seed funds) | Buy the signal directly | r/venturecapital (~60-70k), r/angelinvesting (~65k), r/AngelInvestors (smaller, secondary) | P1 |
| Founder (raising; many also scout) | Buy for their own raise + to spot peers | r/startups (~1.5M), r/startup (~500k), r/Entrepreneur (~3.2M, broad) | P1-P2 |
| Technical/data (analyst angels, data buyers, eng-to-investor) | The product's mechanism is GitHub data | r/datasets (~400k), r/datascience (~2.5M), r/MachineLearning (~3M), r/programming (~6M), r/devops (~1M), r/ExperiencedDevs (~600k), r/github (~100k), r/opensource, r/SideProject | P1-P2 |
| Sector scout (niche funds, sector analysts) | Sector-sweep angle | r/fintech (~300k), r/SaaS (~2M), r/artificial (~1M), r/biotech, r/HealthTech (~100k) | P2 |

### Per-ad-group audience build

| Group | Communities (primary + secondary) | Interest layer | Keyword layer | Exclude |
|---|---|---|---|---|
| vc (RUN FIRST) | r/venturecapital + r/angelinvesting + r/AngelInvestors | Venture Capital, Investing, Startups | "deal flow", "venture capital", "angel investing", "seed round", "deal sourcing" | r/investing, r/wallstreetbets, existing site visitors |
| angel | r/angelinvesting + r/AngelInvestors + r/venturecapital | Angel Investing (if listed), Venture Capital, Investing | "angel investing", "pre-seed", "seed round", "deal flow" | r/investing, existing site visitors |
| devtools | r/github + r/opensource + r/devops + r/ExperiencedDevs | Software Development, Programming | "github api", "developer tools", "open source data" | r/programming (keep separate), existing site visitors |
| programming | r/programming + r/datasets + r/datascience | Programming, Data Science | "github dataset", "public dataset", "startup api" | existing site visitors |
| ml | r/MachineLearning + r/artificial + r/datascience | Artificial Intelligence, Machine Learning | "ai startup", "ml dataset", "github ai" | existing site visitors |
| startups | r/startups + r/startup + r/EntrepreneurRideAlong | Startups, Entrepreneurship, Small Business | "raising", "funding", "investor", "pitch" | r/Entrepreneur (too broad), existing site visitors |

### Interest targeting stack (Reddit expanded taxonomy, ~152 categories)

Exact labels vary across the 2024-2026 rollout. In the Ads Manager "Interests"
typeahead, pick the closest live name; these are the canonical categories to seek:

- Core investor interests: Venture Capital, Startups, Investing (NOT Personal Finance), Business & Entrepreneurship, Angel Investing (if listed).
- Technical/data interests (for devtools/programming/ml): Software Development, Programming, Data Science, Artificial Intelligence, Machine Learning.
- Exclusion interests (subtract to protect the $20): Personal Finance, Gaming, Cryptocurrency, Sports, Memes.

### Keyword targeting (optional second layer)

Reddit lets you AND a keyword layer onto interest or community targeting for
immediate intent. For the `vc` probe, adding the keyword terms above tightens to
people discussing deal flow right now. Trade-off: narrower reach, higher relevance,
higher CPC. Given a $20 cap over ~4 days, prefer community + interest WITHOUT
keywords on the first run so the group can spend; add keywords only if day-1 CTR is
below 0.15%.

### Exclusions to set on every group

- Communities: r/investing, r/wallstreetbets, r/personalfinance, r/stocks, r/CryptoCurrency, r/funny, r/memes, r/gaming.
- Custom audience: exclude website visitors (30-90d) so the probe measures cold ICP, not warm retargeting.
- Placement: leave default; conversation placement is where B2B clicks are cheapest, but headlines must stay under 100 chars (already enforced in the ad copy).

### r/SaaS caution

The organic posting account u/Worth_Wealth_6811 is banned from r/SaaS for organic
posting. That ban does NOT apply to ad targeting, which runs under the ad account
and can still target r/SaaS subscribers. Keep r/SaaS in the sector-scout tier for
the sector-sweep angle, but do not attempt organic posting there.

---

## STEP 1 — Reddit Ads (FIRST, ~€5/day)

**Account:** https://ads.reddit.com → Sign up → add card.

Original six-group spec (all parked except `vc` until the probe verdict): **objective = Traffic**, **destination = the `/r/<slug>` URL**,
**schedule = continuous**, **budget = €5/day per ad group** (pause any group under
0.8% CTR after 3 days). The $20 probe runs ONLY the `vc` group with a $20 lifetime cap.

### Ad group `vc` — targeting r/venturecapital  ← RUN THIS ONE FIRST ($20 probe)
- **URL:** `https://signals.gitdealflow.com/r/vc`
- **Budget:** $5/day, **lifetime cap $20**, objective = Traffic, bid = max pay per click auto.
- **Headline (100 char max):** I tracked 350+ startups' GitHub commits for 6 months. Here's what predicts a raise.
  (87 chars — under the 100-char mobile/conversation cutoff)
- **Body:** Commit velocity spikes 21-47 days before the deck hits. Test the signal on your own thesis for €7: pick a sector, get a ranked deep-dive (top 25 orgs + 3 pre-Crunchbase breakouts) in 24h. Or start free with the Sunday digest. SSRN method (n=219 obs).

### Ad group `angel` — targeting r/AngelInvestors (SECOND, if probe budget is later raised)
- **URL:** `https://signals.gitdealflow.com/r/angel`
- **Headline:** The 5 startups accelerating hardest on GitHub right now.
- **Body:** See which teams are shipping faster than their round. €7 gets you a one-sector ranked deep-dive in 24h, credited toward Dashboard if you upgrade within 14 days. Free Sunday digest also available, no card.

### Ad group `devtools` — targeting r/devtools (parked: engineer-side, test after investor-side proves out)
- **URL:** `https://signals.gitdealflow.com/r/devtools`
- **Headline:** I reverse-engineered which GitHub signals actually predict a fundraise.
- **Body:** Commit velocity, contributor growth, repo expansion across 350+ orgs, published on SSRN. €7 deep-dive on any sector, delivered in 24h (PDF + raw CSV). Or the free weekly digest with the 5 fastest teams.

### Ad group `programming` — targeting r/programming (parked)
- **URL:** `https://signals.gitdealflow.com/r/programming`
- **Headline:** A public dataset of 350+ startups' GitHub acceleration, updated weekly.
- **Body:** Free machine-readable API + MCP server, no key required. For a ranked sector report: €7, 24h, PDF + raw CSV. Or the free Sunday digest, 5 breakout teams every week.

### Ad group `ml` — targeting r/MachineLearning (parked)
- **URL:** `https://signals.gitdealflow.com/r/ml`
- **Headline:** Which AI startups are accelerating on GitHub right now?
- **Body:** AI/ML drives most breakout signals in the dataset. €7 one-sector deep-dive ranks the fastest teams by commit velocity and contributor growth, in 24h. Free weekly digest also available.

### Ad group `startups` — targeting r/startups (parked)
- **URL:** `https://signals.gitdealflow.com/r/startups`
- **Headline:** Founders: your GitHub activity is your pitch before you pitch.
- **Body:** I track 350+ startups' public GitHub and surface acceleration 21-47 days before rounds. €7 First Look ranks one sector in 24h. If your angels don't see it, your competitors will. Free weekly digest available too.

---

## STEP 2 — Google Search Ads (SECOND, where Quality Score lives)

**Account:** https://ads.google.com → Sign up → add card.
**Link GA4:** Tools → Data manager → Link "Google Analytics 4" → property `G-7SV2SNZE4C`.
This lets Google import the free-signup conversion so Quality Score and ROAS are
measured, not guessed. **Create conversion action = "Sunday digest signup"** mapped
to the `generate_lead` event already firing on `/subscribe-thanks` (see "What is
already live"). Add a second primary action "purchase" (dynamic value) mapped to
the `purchase` event on the paid thanks pages.

**Expected CPC €4–8, budget €10/day, Search Network only, English, EU+US, no display.**

### Campaign `harmonic` — destination `/r/harmonic`

**Headlines (paste all 15):**
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

**Descriptions (paste all 4):**
1. Tracks 350+ startups' GitHub commits weekly. Surfaces stealth teams a LinkedIn-first lens misses. Free tier, no API key.
2. Commit velocity, contributor growth, repo expansion. See breakouts 21-47 days before the round. SSRN method (n=219).
3. $7 First Look Pass, free Sunday digest. MCP server, JSON API, Chrome extension. No card to start.
4. The GitHub-native alternative to Harmonic. Free machine-readable API, updated weekly across 15 sectors.

**Keywords (phrase match):** "harmonic ai alternative", "harmonic alternative",
"harmonic.ai alternative", "alternatives to harmonic", "harmonic ai competitors",
"harmonic vs", "stealth startup tracker", "startup sourcing tool".

**Negative keywords:** "harmonic music", "harmonic price", "harmonic funding",
"harmonic round", "harmonic series", "jobs", "careers", "salary".

### Campaign `tracxn` — destination `/r/tracxn`

**Headlines (paste all 15):**
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

**Descriptions (paste all 4):**
1. Tracks 350+ startups' GitHub commits weekly. Surfaces engineering acceleration before it hits the funding lists. Free tier, no API key.
2. Commit velocity, contributor growth, repo expansion. Breakouts 21-47 days before the round. SSRN method (n=219).
3. $7 First Look Pass, free Sunday digest. MCP server, JSON API, Chrome extension. No card to start.
4. The GitHub-native alternative to Tracxn. Free machine-readable API, updated weekly across 15 sectors.

**Keywords (phrase match):** "tracxn alternative", "alternatives to tracxn",
"tracxn competitors", "tracxn vs", "startup database alternative", "deal flow tool".

**Negative keywords:** "tracxn pricing", "tracxn funding", "tracxn review",
"tracxn careers", "tracxn login".

**Destination:** `signals.gitdealflow.com/r/tracxn` → `/alternatives/tracxn`

### Google campaign 3: crunchbase alternative (added 2026-08-15, audit follow-up)

Largest search volume of the alternatives set. Landing: `/alternatives/crunchbase` (live, verified).

**Keywords (phrase match):** "crunchbase alternatives", "crunchbase alternative",
"alternatives to crunchbase", "crunchbase competitors", "crunchbase pro alternative",
"free crunchbase alternative".

**Negative keywords:** "crunchbase login", "crunchbase jobs", "crunchbase careers",
"crunchbase pricing" (bid separately if we want comparison shoppers only),
"crunchbase customer service", "crunchbase data api" (we are not a data-vendor clone).

**Destination:** `signals.gitdealflow.com/r/crunchbase` → `/alternatives/crunchbase`
**Cap:** €5/day until QS ≥ 6 (highest expected CPC of the set).

### Google campaign 4: deal flow tools (category query, added 2026-08-15)

Category query capturing shoppers comparing all vendors, not one incumbent. Landing:
`/compare/best-free-deal-flow-tools-2026` (live, verified).

**Keywords (phrase match):** "deal flow tools", "best deal flow tools",
"deal flow software", "vc deal flow tools", "startup deal flow tools",
"deal sourcing tools", "best deal sourcing tools 2026".

**Negative keywords:** "free crm", "sales pipeline", "real estate deal flow",
"m&a deal flow", "banking deal flow", "car dealer software".

**Destination:** `signals.gitdealflow.com/r/dealflowtools` → `/compare/best-free-deal-flow-tools-2026`

---

## STEP 3 — Meta Retargeting (THIRD, after Meta Pixel from SWITCH 3)

**Requires:** Meta Pixel ID (SWITCH 3 in MANUAL_QUEUE.md) set as
`NEXT_PUBLIC_META_PIXEL_ID` in Vercel, then redeploy. Creative must be data-viz
(chart, no founder face) per the anonymity rule.

Three retargeting ad sets (70% of budget) + three cold/lookalike (30%):
- **Retarget /pricing visitors (30d)** → `/from/facebook?ref=rt-pricing`, hook: the €7 First Look bait.
- **Retarget /firstlook non-checkout** → `/from/facebook?ref=rt-firstlook`, hook: free Sunday digest + guarantee.
- **Retarget /walkthrough >30s** → `/from/facebook?ref=rt-walkthrough`, hook: SSRN n=219, 21-47d lead.
- **1% lookalike of paid subscribers** → `/from/facebook?ref=lal-investor`.
- **2% lookalike of /firstlook buyers** → `/from/facebook?ref=lal-engineer`.
- **Cold interest stack** (Venture capital + Software dev + Angel investor + Crunchbase) → `/from/facebook?ref=cold-interest`.

---

## STEP 4 — Newsletter sponsorship (FOURTH, after Reddit >2% conv)

- **TLDR** (4M+ devs, ~$5k/slot) → `/r/tldr`
- **The Generalist** (~150k VC-curious) → `/r/generalist`

---

## Budget & KPI table

| Stage | Channel | Budget | Success bar | Kill rule |
|---|---|---|---|---|
| 1 | Reddit ($20 probe: `vc` group ONLY) | $5/day, $20 lifetime cap | any paid-sourced signup OR engaged-session rate >= 40% | zero clicks by day 4 = pause; CTR < 0.15% after ~5k imps = pause |
| 2 | Google Search (4 campaigns) | €5/day per campaign (€20/day total) | CPA < €15 per signup, QS ≥ 6 by week 2 | pause keyword if QS <4 after 2 weeks |
| 3 | Meta retargeting | €5/day | CPA < €4 | kill if CPA > €10 |
| 4 | Newsletter | one-shot | conv >2% | n/a (pre-paid slot) |

**North-star KPI: qualified signups/day, segmented by utm_source in GA4.**
Do not spend on Stage 2 until Stage 1 proves the landing converts. Quality Score
is a Google-only metric; it starts at N/A and only becomes real after Stage 2
ads accrue impressions and clicks.
