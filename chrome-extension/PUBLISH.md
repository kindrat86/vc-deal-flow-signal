# Chrome Web Store — Publish Guide

> **Extension:** Momentum Badge — Startup Engineering Velocity | GitDealFlow
> **Folder:** `chrome-extension/`

---

## Prerequisites

- **Chrome Developer Account** — one-time \$5 fee at https://chrome.google.com/webstore/devconsole/register
- A **1280×800 or larger screenshot** showing the badge on Crunchbase or Wellfound (already present as `screenshot.png`)
- A **promotional tile image** (optional but recommended)
- The extension icons (16, 32, 48, 128 — all present in `icons/`)

---

## Step-by-step submission

### 1. Prepare the ZIP

```bash
cd /Users/sipi/Downloads/vc-deal-flow-signal/chrome-extension
zip -r ../momentum-badge-v0.1.0.zip . -x "*.git*" -x "screenshot.png" -x "store_icon*" -x "Store Icon.png" -x "developer_tool_icon_128.png"
```

This creates `../momentum-badge-v0.1.0.zip` with only what the store needs.

### 2. Go to Chrome Web Store Developer Dashboard

https://chrome.google.com/webstore/devconsole

### 3. Create a new item

Click **New item** and upload the ZIP created in step 1.

### 4. Fill in the store listing

#### Description (copy-paste)

```
Shows startup engineering velocity signals on Crunchbase and Wellfound company profiles. Free, GitHub-based data for VC deal flow analysis.

Momentum Badge injects a live signal badge directly onto Crunchbase organization pages and Wellfound company pages, showing you:

• Commit velocity (last 14 days) — how fast a startup's engineering team is moving
• Velocity change — trending up (accelerating), steady, or decelerating
• Contributor count — active developers shipping code
• Signal type — data-backed acceleration classification

The badge pulls data from GitDealFlow's public API, which tracks commit velocity, contributor growth, and repository expansion across ~400 startups in 20 sectors (AI/ML, fintech, cybersecurity, developer tools, and more). Updated weekly.

No login or API key required. Works instantly on Crunchbase and Wellfound.

Built for angel investors, VC scouts, technical operators, and anyone screening startups for deal flow.
```

#### Short description (max 132 chars)

```
Shows startup engineering velocity on Crunchbase & Wellfound. Free GitHub-based deal flow signals for VC investors.
```

#### Category

**Productivity**

#### Language

**English**

#### Homepage URL

https://gitdealflow.com

### 5. Upload screenshots

| Type | Size | Source |
|---|---|---|
| Screenshot (at least 1) | 1280×800 or 640×400 | `chrome-extension/screenshot.png` (already prepared) |

> **Tip:** Upload 2–3 screenshots showing the badge on different Crunchbase pages and the popup.

### 6. Upload icons

The icons are already bundled in the ZIP from `icons/`. No separate upload needed.

### 7. Set visibility

**Visibility:** Public

You can toggle this after initial submission.

### 8. Submit for review

Click **Submit for Review**. Typical review time is 1–3 business days for first submission.

---

## Post-submission checklist

- [ ] Extension is live on Chrome Web Store
- [ ] Update `homepage_url` in manifest if store listing URL changes
- [ ] Add Chrome Web Store badge to gitdealflow.com landing page
- [ ] Tweet about launch from @data_nerd
- [ ] Submit to ProductHunt, AlternativeTo, and G2

---

## Pre-written social copy

### Launch tweet

```
🚀 Momentum Badge is now on the Chrome Web Store!

See startup engineering velocity signals directly on Crunchbase & Wellfound profiles — commit velocity, contributor growth, and acceleration trends.

Free. No signup needed.

Install: [CHROME_STORE_URL]
Built on @gitdealflow data
```

### ProductHunt tagline

**Momentum Badge** — See startup engineering velocity on Crunchbase and Wellfound profiles.

---

## Version bump checklist

When releasing a new version:

1. Update `version` in `manifest.json`
2. Update `version` in `popup.html` if shown
3. Rebuild the ZIP
4. Go to Developer Dashboard → your item → **Package** → **Upload updated package**
5. Submit for review
