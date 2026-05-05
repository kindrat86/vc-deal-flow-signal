# Retargeting Pixels — Setup & Activation Guide

**Status:** Pixel infrastructure shipped 2026-04-20. Pixels are wired into both
sites but **dormant** — they only fire once you drop in real IDs. That means
visitors arriving today are NOT yet being captured into ad-network audiences.
Activate accounts in the priority order below.

## Where pixels live

- **pSEO app** (`signals.gitdealflow.com`): `pseo-site/components/PixelManager.tsx` — reads `NEXT_PUBLIC_*` env vars from Vercel.
- **Static landing** (`gitdealflow.com`): `landing/pixels.js` — edit the `PIXEL_IDS` object in-file, redeploy.
- **Pages covered on landing:** `index.html`, `insider.html`, `report.html`. Add the same `<script src="/pixels.js" async></script>` line if you ship new HTML pages.
- **Privacy:** existing `landing/privacy.html` does NOT mention these pixels. Update it before EU-targeted paid traffic goes live (see "GDPR / consent" section below).

## Activation priority for VC / dev-investor ICP

The Dream Customer (developer-investor) lives mostly on **LinkedIn, X, Reddit, Google**. Activate these first; the rest are nice-to-haves once budgets exist.

| # | Platform | Why it matters | Env var |
|---|---|---|---|
| 1 | **LinkedIn Insight Tag** | Primary B2B retargeting. Highest-fidelity for VC / partner / scout titles. | `NEXT_PUBLIC_LINKEDIN_PARTNER_ID` |
| 2 | **Google Ads + GA4** | Search + YouTube retargeting + cross-property analytics. One pixel covers both. | `NEXT_PUBLIC_GA4_ID`, `NEXT_PUBLIC_GOOGLE_ADS_ID` |
| 3 | **X / Twitter** | Where the @data_nerd audience already lives; lookalike off site visitors. | `NEXT_PUBLIC_TWITTER_PIXEL_ID` |
| 4 | **Meta Pixel** | Lower B2B fit but cheap CPM; useful for FB Groups / Instagram dev creators. | `NEXT_PUBLIC_META_PIXEL_ID` |
| 5 | **Reddit Pixel** | Subreddit-targeted retargeting (r/venturecapital, r/startups, etc.). | `NEXT_PUBLIC_REDDIT_PIXEL_ID` |
| 6 | **Microsoft / Bing UET** | Cheap CPC, captures Edge / ChatGPT-Bing traffic that Google misses. | `NEXT_PUBLIC_MS_UET_ID` |
| 7 | **Quora Pixel** | Already running organic Q&A there; matches AEO surface. | `NEXT_PUBLIC_QUORA_PIXEL_ID` |
| 8 | **TikTok Pixel** | Wrong ICP today, but captures audience for future founder-focused content. | `NEXT_PUBLIC_TIKTOK_PIXEL_ID` |
| 9 | **Pinterest Tag** | Lowest priority. Skip unless infographic / dataset distribution lifts off. | `NEXT_PUBLIC_PINTEREST_TAG_ID` |

## How to grab each ID

### 1. LinkedIn Insight Tag
1. Go to https://www.linkedin.com/campaignmanager/ → create ad account (link to the GitDealFlow company page).
2. **Analyze → Insight Tag → Manage Insight Tag → I will install the tag myself.**
3. Copy the partner ID (7-digit number from the script — it's the value of `_linkedin_partner_id`).
4. Drop into both:
   - Vercel env: `NEXT_PUBLIC_LINKEDIN_PARTNER_ID`
   - `landing/pixels.js` → `PIXEL_IDS.linkedin`

### 2. Google Ads + GA4
1. **GA4** — https://analytics.google.com → Admin → Create Property. Copy the `G-XXXXXXXXXX` measurement ID.
2. **Google Ads** — https://ads.google.com → Tools → Conversions → set up tag. Copy the `AW-XXXXXXXXX` conversion ID.
3. Drop into:
   - Vercel: `NEXT_PUBLIC_GA4_ID` and `NEXT_PUBLIC_GOOGLE_ADS_ID`
   - `landing/pixels.js` → `PIXEL_IDS.ga4` and `PIXEL_IDS.googleAds`
4. Note: gtag will fire if EITHER is set; both can coexist on one snippet.

### 3. X / Twitter Pixel
1. https://ads.x.com → Tools → Events Manager → Add a website event source → install pixel manually.
2. Pixel ID is the short alphanumeric string (e.g. `o1abc`).
3. `NEXT_PUBLIC_TWITTER_PIXEL_ID` + `PIXEL_IDS.twitter`.

### 4. Meta Pixel (Facebook + Instagram)
1. https://business.facebook.com → Events Manager → Connect data source → Web → install code manually.
2. Pixel ID is the 15-16 digit number.
3. `NEXT_PUBLIC_META_PIXEL_ID` + `PIXEL_IDS.meta`.

### 5. Reddit Pixel
1. https://ads.reddit.com → Events Manager → Create new pixel → install manually.
2. Pixel ID looks like `t2_xxxxxxxx` (or hex).
3. `NEXT_PUBLIC_REDDIT_PIXEL_ID` + `PIXEL_IDS.reddit`.

### 6. Microsoft / Bing UET
1. https://ads.microsoft.com → Tools → UET tag → Create UET tag → copy `ti` value (8-digit number).
2. `NEXT_PUBLIC_MS_UET_ID` + `PIXEL_IDS.msUet`.

### 7. Quora Pixel
1. https://www.quora.com/business → Ads Manager → Pixel → Install code yourself.
2. Pixel ID is a 16-char hex.
3. `NEXT_PUBLIC_QUORA_PIXEL_ID` + `PIXEL_IDS.quora`.

### 8. TikTok Pixel
1. https://ads.tiktok.com → Assets → Events → Web Events → Set up → install code manually.
2. Pixel ID is `C0XXXXXXXXXXXXXXXXXX` format.
3. `NEXT_PUBLIC_TIKTOK_PIXEL_ID` + `PIXEL_IDS.tiktok`.

### 9. Pinterest Tag
1. https://ads.pinterest.com → Conversions → Pinterest Tag → Manually install.
2. Tag ID is 13-digit number.
3. `NEXT_PUBLIC_PINTEREST_TAG_ID` + `PIXEL_IDS.pinterest`.

## Adding an ID to Vercel (pSEO)

```sh
cd pseo-site
vercel env add NEXT_PUBLIC_LINKEDIN_PARTNER_ID production
vercel env add NEXT_PUBLIC_LINKEDIN_PARTNER_ID preview
vercel env add NEXT_PUBLIC_LINKEDIN_PARTNER_ID development
# repeat per pixel; then redeploy
vercel --prod
```

## Updating the static landing

```sh
# Edit the PIXEL_IDS object in-file, then redeploy from /landing
cd landing
# (edit pixels.js) ...
vercel --prod
```

## Verifying a pixel after activation

1. Open the live site in an incognito Chrome window.
2. Install the platform's official Chrome verifier extension:
   - Meta Pixel Helper, Google Tag Assistant, LinkedIn Insight Tag Helper, X Pixel Helper.
3. Reload — the extension should show "Pixel found, PageView fired".
4. In the ad platform's Events Manager, confirm the test event appears within ~5 min.

## GDPR / consent (required before paid EU traffic)

These pixels drop tracking cookies. Cyprus + EU traffic technically requires consent.

- **Today (organic traffic only):** acceptable risk — most early-stage startups in this stage operate without a consent banner; enforcement against small SaaS is rare.
- **Before paid EU campaigns launch:** add a Cookiebot / Klaro / Iubenda consent banner that gates pixel firing on user consent. Wrap each `if (PIXEL_IDS.x)` block in `if (consent.marketing && PIXEL_IDS.x)`.
- **Privacy policy update:** list all active pixels on `/privacy` once any are turned on. Today's `landing/privacy.html` only mentions PostHog.

## Cookieless analytics already running

PostHog (EU instance) is the source of truth for product analytics, and runs cookieless (`persistence: 'memory'`). Do NOT replace it with GA4 — GA4 is purely there for Google Ads conversion tracking and YouTube retargeting.
