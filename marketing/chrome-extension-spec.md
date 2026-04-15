# Chrome Extension Spec: GitHub Signal Badge
## VC Deal Flow Signal | 2026-04-15 | Framework: Isenberg "piggyback on existing platforms"

## Concept
A free Chrome extension that injects a small "GitHub Signal" badge onto startup profile pages on Crunchbase, AngelList, and PitchBook. The badge shows the company's current engineering acceleration status based on your data. Clicking the badge links to gitdealflow.com.

This is a distribution trojan horse: investors see the signal while browsing companies they already care about, and it links back to your product.

---

## What the user sees

When an investor visits a startup's Crunchbase or AngelList profile page:

1. A small badge appears near the company name or in the sidebar
2. Badge states:
   - "Accelerating" (green) — commit velocity up 50%+ in 14 days
   - "Steady" (gray) — within normal range
   - "Decelerating" (yellow) — velocity down 30%+
   - "No data" (dimmed) — company not in our dataset or no public GitHub
3. On hover: tooltip with key metrics (commit velocity 14d, change %, contributor count)
4. On click: opens the full signal page on signals.gitdealflow.com (or the sector page if no dedicated company page)

---

## Architecture

### Simple (MVP, launch in 1-2 weeks)
- Chrome extension (Manifest V3)
- Content script matches Crunchbase/AngelList URL patterns
- On page load, extracts company name from the DOM
- Calls your API: `GET signals.gitdealflow.com/api/signal?company={name}`
- API returns: `{ status: "accelerating", commitVelocity14d: 342, velocityChange: "+199%", contributors: 94, contributorGrowth: "+76%", sectorUrl: "/startups-to-watch/healthcare-q2-2026" }`
- Content script injects badge into the DOM

### Backend (add to pSEO site)
- New API route: `/api/signal` — looks up company name in startups.json, returns status
- Fuzzy matching on company name (startups may use slightly different names on Crunchbase vs GitHub)
- Rate limit: 100 requests/day per user (free tier)
- For companies not in dataset: return `{ status: "no_data", cta: "We don't track this company yet. Want to request it?" }`

### Content script URL patterns
```json
{
  "matches": [
    "https://www.crunchbase.com/organization/*",
    "https://www.angellist.com/company/*",
    "https://pitchbook.com/profiles/company/*"
  ]
}
```

### Badge injection targets
- **Crunchbase:** Insert next to the company name in the header (`h1.profile-name` or similar)
- **AngelList:** Insert next to the company name in the profile header
- **PitchBook:** Insert in the company overview sidebar

---

## Funnel

```
Investor browses Crunchbase
  → Sees green "Accelerating" badge on a startup
  → Hovers: "Commit velocity +199% in 14d. 94 contributors (+76%)"
  → Clicks: lands on signals.gitdealflow.com sector page
  → Sees 20+ other startups ranked
  → CTA: "Get the full dashboard for EUR 9.97/mo" or "Join free digest"
```

---

## Growth mechanics

1. **Chrome Web Store listing** — SEO for "crunchbase extension," "angellist tools," "deal flow tools for investors"
2. **Product Hunt launch** — can be a separate launch from the main product (extensions get their own category)
3. **Demo GIF** — show the badge appearing on a Crunchbase page in a 5-second GIF for Twitter/LinkedIn
4. **Dream 100 pitch** — "I built a free Chrome extension that adds GitHub acceleration data to Crunchbase. Want to try it?"

---

## Monetization / upsell

- Free: see badge status (accelerating/steady/decelerating) for any company
- Free: see basic metrics on hover
- Upsell: "See the full ranked list for this sector" → links to Pro dashboard signup
- Upsell: "Get alerts when companies in your portfolio start accelerating" → Insider Circle

---

## Priority and timing

This is a Phase 2 project. Do not build until:
- [x] Landing page live
- [x] pSEO site live
- [ ] First 50 email subscribers
- [ ] Twitter/X active with 10+ posts
- [ ] At least 1 launch wave complete (IH, HN, or PH)

Estimated build time: 1-2 weekends (content script + simple API route).

---

## Files to create when ready

```
chrome-extension/
  manifest.json
  content.js        (DOM injection + API call)
  popup.html        (extension popup with branding + settings)
  popup.js
  styles.css        (badge styling)
  icons/            (16, 48, 128px)
```

API route to add to pSEO site:
```
pseo-site/app/api/signal/route.ts
```
