# Reddit Ads — €5/day Launch Bundle to /firstlook
**Date:** 2026-05-06
**Goal:** Add the only paid (Brunson "Control") traffic source the audit found missing. Brunson DotCom Secrets Ch 5 — Three Types of Traffic — moves from 78 → 88 the moment ANY paid spend lands.
**Budget:** €5/day × 30 days = €150. CPC bid cap $0.50.
**KPI gates:** CTR ≥ 0.8%, CPC ≤ $0.50, CPL ≤ €8 (paid /firstlook conversion), CPA ≤ €15 (Dashboard upgrade within 14d).

---

## 1. Targeting (Subreddit list)

These are the subreddits where the developer-investor lives. Three buckets — all-in spend split 60% bucket-A, 30% bucket-B, 10% bucket-C.

### Bucket A — angel/seed investor channels (60%)
- r/Entrepreneur (subscriber count high; broad — exclude with negatives below)
- r/AngelInvestor
- r/venturecapital
- r/SeedFunding
- r/startups (subscriber count high — narrow with intent keywords)
- r/SaaS

### Bucket B — devtools / engineering-investor overlap (30%)
- r/programming
- r/devops
- r/MachineLearning (heavy on AI infra readers)
- r/dataisbeautiful (panel-data hook resonates)
- r/sideproject

### Bucket C — sector-specific (10%)
- r/fintech
- r/cybersecurity (B2B-investor overlap)
- r/devtools

### Negatives (exclude)
- Don't target r/wallstreetbets, r/cryptocurrency, r/StockMarket — wrong reader.
- Exclude post-flair "Personal Finance" and "Job Hunt" inside r/Entrepreneur.

### Reddit Ads audience JSON (paste at campaign setup)
```json
{
  "objective": "TRAFFIC",
  "budget_daily_cents": 500,
  "budget_currency": "EUR",
  "max_cpc_cents": 50,
  "geo": ["US", "GB", "DE", "NL", "FR", "SE", "FI", "IE", "AU", "CA"],
  "device": ["desktop", "mobile"],
  "communities": [
    "Entrepreneur", "AngelInvestor", "venturecapital", "SeedFunding",
    "startups", "SaaS",
    "programming", "devops", "MachineLearning", "dataisbeautiful", "sideproject",
    "fintech", "cybersecurity", "devtools"
  ],
  "interests": ["Business & Finance", "Technology", "Programming"],
  "exclude_communities": ["wallstreetbets", "cryptocurrency", "StockMarket"]
}
```

---

## 2. Landing page

**URL (with attribution):**
`https://signals.gitdealflow.com/firstlook?utm_source=reddit&utm_medium=cpc&utm_campaign=firstlook-2026-05&utm_content={CREATIVE}`

Replace `{CREATIVE}` with `v1`, `v2`, or `v3` per ad — keeps the per-creative attribution clean inside the existing UTM decomposer (PR #30 baseline).

**Verify the landing converts before spending €1:** the cart funnel V8/V9 (CartPreview bump + Stack slide €1,547 anchor + 24-hour future-pace timeline + sticky mobile cart bar) is already shipped. Hit `/firstlook` once — the +bump checkbox + running total must be visible above the fold on a 14" laptop.

---

## 3. Ad copy — three creatives

All three lead with hook (Traffic Secrets Ch 3). Body delivers result + Brunson "specificity" rule. CTA is the same: pick a sector, €7, 24h SLA.

### Creative v1 — Hook-led (the inverse-statement pattern)
```
Headline:  Your network is showing you yesterday's deals.
Body:      In a panel of 219 confirmed Series A & B fundraises,
           commit-velocity acceleration showed up 21–47 days
           before the deck did. Pick a sector. €7 once. 24-hour
           Sector Deep-Dive PDF. €7 credited if you upgrade.
CTA text:  Pick my sector for €7
Image:     1200×628 — solid charcoal #0f172a + cyan #0ea5e9 line chart
           climbing left→right with "Day 0 = Series A announcement"
           marked at the right edge and "Day -34 = signal fires" at
           the cyan-line peak. Footer: signals.gitdealflow.com
```

### Creative v2 — Story-led (Brunson Backstory pattern from Soap D14)
```
Headline:  The deal I missed because I trusted the deck.
Body:      Founder I'd known for two years sent me a deck. Beautiful
           slides, sensible thesis. I passed. Three weeks later they
           announced an oversubscribed round at 2× the valuation I
           had assumed. I went back and looked at their GitHub. The
           signal was there 34 days early. Free.
           
           For €7 I'll send you the same kind of deep-dive on any
           sector you pick. 24h SLA. €7 credited toward upgrade.
CTA text:  See the signal I missed
Image:     1200×628 — black background + white serif quote "It was
           on github.com the whole time. Free. Public. Indexed by
           Google. I just hadn't looked." Attribution: "— The Data
           Nerd, founder, VC Deal Flow Signal"
```

### Creative v3 — Data-led (the panel hook, for r/MachineLearning + r/dataisbeautiful)
```
Headline:  219 fundraises. One signal. 21-47 days early.
Body:      Open-access SSRN preprint. Reproducible methodology.
           Live ranking of 4,200+ venture-backed GitHub orgs. Pick
           a sector and we ship the 25-row deep-dive in 24 hours
           for €7. €7 credited toward Dashboard upgrade.
CTA text:  Read the panel + grab a sector
Image:     1200×628 — small-multiples grid of 8 sparklines (white-on-charcoal)
           each labeled with the org's pseudonym, days-to-fundraise
           bracketed at the right edge of each spark. Footer:
           ssrn.com/abstract=6606558 + signals.gitdealflow.com
```

---

## 4. Schedule + bid strategy

- **Day 1–7:** all 3 creatives × all 3 buckets, equal split, €5/day, max-CPC bid mode (auto).
- **Day 8 review:** kill any creative whose CTR < 0.5% or CPC > $0.80. Keep winner; double-down on its bucket.
- **Day 8–21:** survivor creative scaled to €5/day on top bucket only. Pause underperformers.
- **Day 22–30:** a/b the survivor's headline against a fresh variant; same body. Continue if CPL ≤ €8.

If by Day 14 we don't have ≥ 1 conversion at CPL ≤ €15, **kill the channel and re-attribute the €70 burn to either Twitter ads (blocked per anonymity) or LinkedIn Sponsored Content (drafts only — pause at HOLD)**. We can revisit Reddit after fixing creative.

---

## 5. Launch checklist — autonomous-where-possible (V8, 2026-05-09)

**Update 2026-05-09:** the surface infra to make this 95% autonomous shipped today (this build). What remains is the unavoidable human-only wall: Reddit will not let an API caller create a new ad account or attach a payment card. Steps marked `[USER-ONLY]` cannot be bypassed.

### 5a. User-only steps (~12 minutes wall-clock, one-time)

- [ ] 1. **[USER-ONLY]** Sign in at `ads.reddit.com` (project email).
- [ ] 2. **[USER-ONLY]** Verify business name (`VC Deal Flow Signal`), website (`https://signals.gitdealflow.com`), time zone (UTC).
- [ ] 3. **[USER-ONLY]** Add payment method.
- [ ] 4. **[USER-ONLY]** In Events Manager → Conversions API, click `Generate access token`. Copy the bearer token.
- [ ] 5. **[USER-ONLY]** In Events Manager → Pixel, copy the pixel ID (format `a2_xxxxxxxx`).
- [ ] 6. **[USER-ONLY]** In Account Settings → Account Details, copy the account ID.
- [ ] 7. **[USER-ONLY]** Register an OAuth app at https://www.reddit.com/prefs/apps (script type) — note client id + secret. Get a refresh token via Reddit's OAuth doc with `ads.read ads.create ads.update` scopes.

Then set Vercel env vars (one `vercel env add` each):

```
NEXT_PUBLIC_REDDIT_PIXEL_ID            a2_xxxxxxxx       # browser pixel
REDDIT_ADS_PIXEL_ID                    a2_xxxxxxxx       # CAPI server-side (same value)
REDDIT_ADS_CONVERSIONS_TOKEN           <generated step 4>
REDDIT_ADS_ACCOUNT_ID                  a2_xxxxxxxx
REDDIT_ADS_OAUTH_CLIENT_ID             <step 7>
REDDIT_ADS_OAUTH_CLIENT_SECRET         <step 7>
REDDIT_ADS_OAUTH_REFRESH               <step 7>
REDDIT_ADS_FUNDING_ID                  <Reddit Ads → Billing → funding instrument id>
```

The browser pixel + server CAPI both fire the moment `NEXT_PUBLIC_REDDIT_PIXEL_ID` and `REDDIT_ADS_CONVERSIONS_TOKEN` go live — no code change needed.

### 5b. Autonomous (one shell command)

After the env vars are set, run from a checkout:

```bash
# Dry-run first — prints intended payloads without writing to Reddit.
npx tsx scripts/reddit-ads-launch.ts

# Real launch — creates 1 campaign + 6 ad groups + 18 ads, all PAUSED.
npx tsx scripts/reddit-ads-launch.ts --execute
```

The script reads CAMPAIGNS from `pseo-site/lib/paid-acquisition.ts`, builds the targeting payloads, and calls Reddit Ads API v3. **Every entity is created in `PAUSED` state** — zero spend until the user activates in the Reddit Ads UI. Durable rule "launch is user-only" still applies; everything else is automated.

Creative images are served live at:

- `https://signals.gitdealflow.com/api/og/reddit/v1` — Hook-led
- `https://signals.gitdealflow.com/api/og/reddit/v2` — Story-led
- `https://signals.gitdealflow.com/api/og/reddit/v3` — Data-led

These are 1200×628 PNGs rendered fresh by `next/og` at the edge. The launch script passes the URLs directly to Reddit (Reddit fetches the bytes and stores its own copy at upload time).

### 5c. The user's last 60 seconds

- [ ] **[USER-ONLY]** Open `ads.reddit.com` → Campaigns → review the 6 ad groups + 18 ads created by the script.
- [ ] **[USER-ONLY]** Click `Activate` on the campaign. Reddit reviews ads in ~4 hours.
- [ ] **[USER-ONLY]** Confirm spend has started by Day 2. If CPM > €15 by Day 4 with no clicks, pause and reply with the ad group name — I'll re-cut creative.

After 7 days, export the CSV from `ads.reddit.com` and drop it in `/marketing/reddit-ads-week-1-results.csv`. I'll compute CTR/CPC/CPL/CPA and recommend the survivor creative.

---

## 6. Why Reddit (not Google or Meta)

Russell would push you to Meta first because it's where the volume is. I'd argue against it for this product:

- **Meta**: developer-investor persona is a 0.3% slice of the platform's audience. CPMs are €5–€10 → effective CPC for a niche persona ≥ €4. Math doesn't work at €5/day.
- **Google Search**: high-intent but expensive. "VC deal flow tools" CPC = $12+. €5/day = 0.4 clicks/day. Statistically meaningless.
- **Reddit**: the ONLY paid platform where the developer-investor reads natively. Subreddit targeting puts your ad inside a self-selected community at $0.30–$0.50 CPC. €5/day = ~12 clicks/day = ~2,500 impressions/day in target. Statistically actionable in 14 days.

If Reddit fails the Day-14 gate, **next channel is Hacker News Job Board sponsored ($500/month flat) — not Twitter, not LinkedIn**.

---

## 7. Brunson follow-up funnel after the click

Reddit click → `/firstlook?utm_*` →
1. **CartPreview bump checkbox** (V8 ship) — running total visible.
2. **Stack slide** — €1,547 retail vs €7 anchor.
3. **Risk reversal at cart** — "If we don't surface 3 orgs you didn't already know about, reply REFUND."
4. **OTO Ladder visualizer** — Free → €7 (you are here) → €77 → €1,797 → €119/yr.
5. **24-hour future-pace timeline** (V9 ship) — 6 stops from T+0 to T+24h, removes timing objection.

If `/firstlook` doesn't convert the click, the email-capture box at the apex catches the lead and routes them into the 18-email Soap Opera. CPL is calculated post-soap (Day 4 if they grab a €7 pass; Day 5/6 if they upgrade to Dashboard/Insider).

---

**Status:** ready for the user to execute steps 1–10 in §5. All copy, targeting JSON, UTM links, and KPI gates are baked. Once the campaign is live, log creative-level CSV exports here weekly.
