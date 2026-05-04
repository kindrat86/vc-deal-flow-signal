# Indie Hackers Products — PASTE-READY LISTING
## Status: LIVE at https://www.indiehackers.com/product/vc-deal-flow-signal (2026-04-18)
## Account: The Data Nerd
## Goal: Free product listing + backlink to gitdealflow.com
## ⚠ Backlink reality: `rel="nofollow noopener"` on outbound links — NOT dofollow as originally pitched. Value is brand + referral traffic, not SEO juice.

---

## Form has only 4 required fields. Paste each one:

### 1. PRODUCT NAME
```
VC Deal Flow Signal
```
*Instruction says "name only, not a description" — this passes.*

### 2. PRODUCT TAGLINE
```
GitHub-driven startup deal flow for investors
```
*46 chars. Matches IH's format hint ("Music Remixing App, Form Building Tool") — it's a short category phrase, not a marketing hook. Keeps keywords "startup" + "investors" in the directory listing.*

**Alternate if you want the marketing hook instead:**
```
Spot breakout startups 3 weeks early via GitHub
```
*47 chars. More punchy but less "category-shaped". Safe either way.*

### 3. WEBSITE
```
https://gitdealflow.com
```
*Apex, not the signals subdomain — dofollow juice flows to the main ranking target.*

### 4. LOGO (must be ≥200×200, square or circular)
Upload this file:
```
/Users/sipi/launch-projects/vc-deal-flow-signal/distribution/logo-v2-512.png
```
*512×512, new brand mark (cat + blue sparkline). Also now live on landing + pSEO favicons. Chrome Web Store icon (`chrome-extension/Store Icon.png`, 1024×1024) is still the old mark — intentionally NOT replaced mid-launch to avoid Chrome Store review churn.*

---

## After clicking SUBMIT PRODUCT

- [ ] Verify the product page loads at `https://www.indiehackers.com/product/vc-deal-flow-signal` (slug may vary — grab the real URL from the browser)
- [ ] Open DevTools → Elements → find the anchor to `gitdealflow.com` → confirm `rel` attribute does NOT contain `nofollow`. If it's dofollow, you're done. If IH has silently moved to nofollow, just log it — the listing still helps for brand + traffic.
- [ ] Save the product URL somewhere you'll find it (add to this file or to a `project_ih_products.md` memory later)
- [ ] The IH product page typically also has an "edit" / expanded description section AFTER initial submission. If so, paste the long description from §6 below into the About / Description area.

---

## 5. Optional — after creation, look for these expanded fields

IH typically reveals richer fields once the product exists (pricing, stage, revenue, tags, social links). Fill them if shown:

| Field | Value |
| --- | --- |
| Stage | Launched |
| Pricing | Freemium |
| Launched on | 2026-04-15 |
| Twitter | data_nerd |
| Category/Tags | SaaS, Developer Tools, Investing/Finance (pick 2-3 closest) |
| Revenue | Leave blank unless you want it public |

---

## 6. Long description (paste if form exposes an About/Description field post-creation)

```
VC Deal Flow Signal monitors GitHub engineering activity across thousands of startup organizations and surfaces the ones showing unusual acceleration. Built for seed and Series A investors who want to spot breakouts before the pitch deck hits their inbox.

How it works: we calculate 14-day commit velocity, contributor growth, and repository expansion for every tracked org, then rank startups by engineering acceleration. When a company's velocity deviates sharply from its own baseline, we flag it and classify the signal type. 85+ startups currently live across 20 sectors, updated weekly.

Why this matters: GitHub is the largest free dataset of real-time engineering activity in the world. Every commit is timestamped and public. When a startup's velocity doubles in two weeks, something changed — and it shows up in the data weeks before the TechCrunch headline.

What you get:
• Free Signal Digest — 5 breakout startups with real GitHub data, delivered weekly
• Dashboard (EUR 9.97/mo) — full sector rankings, filter by stage and geography
• Insider Circle (EUR 97/mo) — private investor community, live briefings, API access
• Free Chrome extension — green "Accelerating" badge on Crunchbase, AngelList, and PitchBook profiles
• MCP server — query the data from inside Claude Desktop or Claude Code: npx @gitdealflow/mcp-signal

Different from Harmonic, Dealroom, Forager: those platforms charge $10K+/year, require demo calls, and use proprietary black-box data. VC Deal Flow Signal uses transparent public GitHub data, is completely self-serve, and starts at EUR 9.97/mo. None of the incumbents track engineering momentum — they report rounds after they happen.

Built solo. Next.js + Vercel + Pocketbase + Stripe. The whole pipeline runs on public data.
```

Extra links to add if an expanded form offers multiple URL fields:

| Label | URL |
| --- | --- |
| Dashboard | https://signals.gitdealflow.com |
| Chrome extension | https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn |
| MCP server (npm) | https://www.npmjs.com/package/@gitdealflow/mcp-signal |
| GitHub (methodology) | https://github.com/kindrat86/mcp-deal-flow-signal |
| Free Telegram | https://t.me/gitdealflow |
| LinkedIn | https://www.linkedin.com/company/gitdealflow |

---

## What NOT to do

- Do not use `icon-192.png` or any 128px logo — they're BELOW the 200×200 minimum and will be rejected
- Do not submit with a throwaway account — stay signed in as The Data Nerd so the listing attaches to your existing comment history
- Do not put marketing fluff in the tagline field — IH's placeholder ("Music Remixing App, Form Building Tool") is a strong hint they want a short category phrase
- Do not link to the signals subdomain as primary — apex gets the dofollow juice

---

Source of truth for launch forum post copy remains `01-indie-hackers.md` (Wave 1 forum post). This file is only for the `/products/new` directory submission.
