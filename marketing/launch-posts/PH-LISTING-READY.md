# Product Hunt Launch — LISTING STATUS
## Launch: Sunday April 26, 2026 · 12:01 AM PT / 10:01 EEST
## Edit URL: https://www.producthunt.com/posts/vc-deal-flow-signal/edit
## Public preview: https://www.producthunt.com/products/vc-deal-flow-signal?launch=vc-deal-flow-signal

## ✅ Submitted and saved on 2026-04-19
- Name, Tagline (47/60), Description (470/500), all 7 links
- Launch tags: Chrome Extensions, Investing, Venture Capital
- Thumbnail (custom 240×240) + 6-image gallery + 30-sec MCP demo GIF
- Maker = The Data Nerd (@data_nerd); Hunter = self
- Pricing = Paid (with a free trial or plan)
- Maker's first comment drafted and persisted (auto-posts at launch)

## ✅ Shoutouts complete (2026-04-19)
- Vercel (alt: Cloudflare Pages, Netlify) — preview deployment + App Router story
- Claude Code (alt: Warp, Cursor, Synoppy, et al) — daily driver / tool use reliability
- Cursor (alt: Windsurf, Replit, et al) — Composer mode + codebase context

## ⏳ Optional items still pending
- Promo code (optional): not set. Worth considering 3-month free / 50%-off PH promo.
- Hunter: left blank (self-hunt). Scheduled task `ph-hunter-dm-rrhoover` fires Apr 22 at 10:30 EEST to send the §4 DM to Ryan Hoover.
- Supporter email: Scheduled task `ph-supporter-email-apr25` fires Apr 25 at 18:00 EEST to send the §5 email from signal@gitdealflow.com.
- Launch-day posts (Twitter + LinkedIn + IH + Telegram + Cursor Discord): Scheduled task `ph-launch-day-apr26` fires Apr 26 at 10:01 EEST. Verifies PH is live, then posts §6-7 copy across all 5 channels spaced ~3-5 min apart. Logs outcomes back into this doc and memory.
- Video/Loom URL (optional): skipped — the 30-sec demo GIF in the gallery covers "show me how it works."

---

Original paste-ready form fields below (kept for re-ingestion if anything resets).

---

## 1. PH Submission Form — field-by-field

### Name
```
VC Deal Flow Signal
```

### Tagline (PH limit: 60 chars)
```
Spot breakout startups 3 weeks early via GitHub
```
*47 / 60 chars*

### Description (PH limit: 260 chars)
```
We monitor GitHub engineering activity across thousands of startup orgs and surface the ones showing unusual acceleration. Free weekly digest or EUR 9.97/mo dashboard. Built for seed and Series A investors.
```
*207 / 260 chars*

### Links
| Field | Value |
| --- | --- |
| Website | https://gitdealflow.com |
| Dashboard | https://signals.gitdealflow.com |
| Chrome extension | https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn |
| MCP server (npm) | https://www.npmjs.com/package/@gitdealflow/mcp-signal |
| GitHub (methodology) | https://github.com/kindrat86/mcp-deal-flow-signal |
| Twitter/X | https://x.com/data_nerd |
| LinkedIn | https://www.linkedin.com/company/gitdealflow |

### Topics (pick up to 4)
- Venture Capital
- Developer Tools
- Data Analytics
- Investing

### Pricing
`Freemium`
- Free — Signal Digest (email, weekly)
- Paid — Dashboard Beta, EUR 9.97/mo (normally 49)
- Paid — Insider Circle, EUR 97/mo (normally 197)

### Makers
- `@data_nerd` — solo maker

### Platforms
- Web
- Chrome extension
- API (MCP server)

---

## 2. Media assets — ALL CAPTURED ✅ Ready to upload

All files in `/Users/sipi/launch-projects/vc-deal-flow-signal/marketing/launch-posts/`. Upload in this order — PH uses image #1 as the social preview when people share the PH link.

| # | File | Size | What it shows |
| - | ---- | ---- | ------------- |
| 1 | `ph-gallery-01-sectors-index.png` | 252 KB | Full sector grid — "Startup Engineering Signals by Sector" with 16 sector cards |
| 2 | `ph-gallery-02-sector-cybersecurity.png` | 250 KB | Cybersecurity deep-dive — bar chart + donut + 7-row ranked table (akto-api-security +75%) |
| 3 | `ph-gallery-03-trending.png` | 261 KB | Trending page — hero + velocity chart + Top 20 table with castle-engine (+344%) |
| 4 | `ph-gallery-04-mcp-claude.png` | 184 KB | MCP in Claude Desktop — live cybersecurity query returning ranked startup table |
| 5 | `ph-gallery-05-mcp-demo.gif` | 478 KB | 30-second MCP demo GIF (terminal → Claude → ranked output) |

**Alt candidate:** `ph-gallery-01b-landing-hero.png` (354 KB) — gitdealflow.com landing hero if you'd rather lead with the pitch headline than the product grid. Swap file #1 in PH upload if you prefer it.

### Capture methodology (for the record)
- Static pages rendered headlessly: `/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --headless=new --window-size=1280,1800 --screenshot=OUT.png URL`
- MCP demo frame: `ffmpeg -ss 50 -i landing/mcp-demo.mp4 -frames:v 1 OUT.png` pulled the Claude Desktop frame at the 50-sec mark (cleanest table render)
- Demo GIF trim: `ffmpeg -ss 0 -t 30 -i landing/mcp-demo.mp4 -vf "fps=15,scale=1270:-1:flags=lanczos" -loop 0 OUT.gif`

---

## 3. Maker's first comment — post immediately on go-live

```
Hey Product Hunt! I'm the Data Nerd behind VC Deal Flow Signal.

The backstory: I watched a startup's GitHub commit graph spike 200% in two weeks. Three weeks later they announced a Series A. The signal was right there the whole time — public, free, updating daily. Nobody was reading it.

So I built something that would.

VC Deal Flow Signal monitors GitHub engineering activity across thousands of startup orgs and ranks them by engineering acceleration. When a company's commit velocity deviates sharply from its own baseline, we flag it and classify the signal type. 60+ startups currently live across 20 sectors, updated weekly.

We launched on Indie Hackers and Hacker News last week and got great feedback on the methodology. The most common question was: "Does this actually predict fundraises?" The honest answer: engineering acceleration is a leading indicator, not a guarantee. But in our data, these patterns appear 3-6 weeks before announcements with enough regularity to be useful.

**How this is different from Harmonic, Dealroom, etc.:** Those platforms charge $10K+/year, require demo calls, and use proprietary black-box data. VC Deal Flow Signal uses transparent public GitHub data, is completely self-serve, and starts at EUR 9.97/mo. None of the incumbents track engineering momentum — they report rounds after they happen. We show you the acceleration before the pitch deck exists.

**What you get:**
- Free Signal Digest — 5 breakout startups with real GitHub data, weekly
- Dashboard (EUR 9.97/mo) — 60+ startups ranked by sector, stage, geography
- Insider Circle (EUR 97/mo) — private investor community, live briefings, API access

**NEW: Works inside Claude.** We shipped an MCP server so you can query the data directly from Claude Desktop or Claude Code. Ask "which startups are accelerating in cybersecurity?" and get live data. No API key, no login. Install: `npx @gitdealflow/mcp-signal`

**NEW: Works inside Crunchbase.** Free Chrome extension overlays the signal onto Crunchbase, AngelList, and PitchBook profiles. A green "Accelerating" badge appears next to any company where the GitHub data is interesting — the signal shows up inside your existing research workflow, not in a separate dashboard. https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn

I'd love to hear from anyone who invests or is curious about data-driven deal sourcing. What would make this more useful?
```

---

## 4. Hunter DM — send Apr 22 (4 days before launch)

**From:** @data_nerd on X
**To (primary):** https://x.com/messages/compose?recipient_id=rrhoover (Ryan Hoover)
**Fallbacks if no reply by Apr 24 evening:** @tibo_maker, @chrismessina, @kwdinc. Otherwise self-hunt.

```
Hey Ryan — quick heads up, not asking for a hunt.

I'm launching VC Deal Flow Signal on Product Hunt this Sunday Apr 26. It ranks startup GitHub orgs by engineering acceleration so investors can spot breakouts 3 weeks before pitch-deck stage.

Already shipped: 60+ startups across 20 sectors live, MCP server on npm so Claude can query the data, free weekly digest + EUR 9.97/mo dashboard.

If it's interesting enough for your weekly roundup, the listing goes live 12:01 AM PT Sunday: https://www.producthunt.com/posts/vc-deal-flow-signal

Either way, congrats on building PH into what it is. — The Data Nerd / signals.gitdealflow.com
```

---

## 5. Supporter email — send Apr 25 18:00 EEST (T-minus 16 hrs)

**From:** signal@gitdealflow.com (Zoho, warmed)
**To:** existing Signal Digest subscriber list
**Subject:** Tomorrow we launch on Product Hunt — would love your help

```
Hey,

Tomorrow morning (Sunday Apr 26, 10:01 EEST / 12:01 AM PT) VC Deal Flow Signal goes live on Product Hunt.

If you've read the Signal Digest and found it useful, the single most helpful thing you can do is:

1. Click this link tomorrow morning: https://www.producthunt.com/posts/vc-deal-flow-signal
2. Click the orange "Upvote" button
3. Leave a one-sentence comment about what you've found useful

That's it. The first 4 hours determine the day.

I'll send a one-line follow-up the moment it goes live.

Thanks for being here from the start.

— The Data Nerd
```

Also schedule the same link in the **public Telegram channel** at 10:01 EEST sharp.

---

## 6. Twitter thread — schedule for 12:15 AM PT (14 min post-launch)

**Post from:** @data_nerd · 4 tweets · character-trimmed for non-Premium (≤280 each)

**TWEET 1:**
```
Today I launched VC Deal Flow Signal on Product Hunt.

It monitors GitHub engineering activity across thousands of startup orgs and surfaces the ones showing unusual acceleration for investors.

Backstory 👇
```

**TWEET 2:**
```
Every VC I talked to had the same problem: by the time a startup hits their radar, 50 other investors already have the deck.

The best deals close before most investors know the company exists.
```

**TWEET 3:**
```
GitHub is the largest free dataset of real-time engineering activity. Every commit is timestamped and public.

When a startup's velocity doubles in two weeks, something changed — and it shows up in the data weeks before the TechCrunch headline.
```

**TWEET 4:**
```
So I built a system that monitors thousands of startup GitHub orgs and ranks them by acceleration across 20 sectors.

Free digest or EUR 9.97/mo dashboard.

PH → {PH-link}
```

Paste `{PH-link}` from the PH dashboard once live.

---

## 7. Day-by-day countdown · Apr 18 → Apr 26

### Today · Apr 18 (T-8) — prep the listing in PH dashboard
- [ ] Go to https://www.producthunt.com/posts/new while signed in as @data_nerd
- [ ] Paste Name, Tagline, Description (above), set topics + pricing
- [ ] Paste all links
- [ ] Save as draft. Do NOT schedule yet — PH slots open 7 days out
- [ ] Confirm mcp-demo.gif is the right one or trim to 30s via the ffmpeg command in §2

### Apr 19 (T-7) — schedule the launch slot
- [ ] Open the draft. Schedule for Sunday Apr 26, 12:01 AM PT
- [ ] Capture Image 1 (hero) and Image 2 (sector ranking) per §2

### Apr 20 (T-6) — design assets
- [ ] Design Image 3 (signal card close-up) in Figma or Canva
- [ ] Design Image 5 (pricing wedge table)
- [ ] Capture Image 4 (Claude Desktop MCP demo)

### Apr 21 (T-5) — polish + upload
- [ ] Upload all 5 images + demo GIF to the PH draft in order 1-5 + V
- [ ] Preview the listing on mobile and desktop — adjust anything clipped

### Apr 22 (T-4) — hunter outreach
- [ ] Send hunter DM to @rrhoover (or fallback) per §4
- [ ] Draft follow-up plan if no response by T-2 evening

### Apr 23 (T-3) — asset QA deadline per 04-product-hunt-assets.md §1
- [ ] All 5 images finalized, under 3MB each
- [ ] Demo GIF finalized at ≤30s / ≤3MB

### Apr 24 (T-2) — supporters + Insider alerts
- [ ] Confirm 5 supporters will show up in the first hour (Telegram DM + email)
- [ ] Post "we launch Sunday" teaser in Telegram public channel
- [ ] If no hunter reply: commit to self-hunt

### Apr 25 (T-1) — final checks
- [ ] Send supporter email at 18:00 EEST (§5)
- [ ] Schedule Twitter thread for 12:15 AM PT Sunday (§6)
- [ ] Draft the IH retro post (keep unpublished until PH is live)
- [ ] Pre-load the maker comment (§3) in a plain-text pad

### Apr 26 (LAUNCH DAY · 10:01 EEST)
- [ ] Verify listing is live — refresh producthunt.com/posts/new if needed
- [ ] Post maker comment immediately
- [ ] Share on Twitter (thread auto-posts at 12:15 AM PT)
- [ ] Share on LinkedIn company page
- [ ] Drop link in IH launch thread + Telegram + Discord (Cursor #showcase only)
- [ ] Reply to every comment within 30 min for the first 4 hours

---

## 8. What to NOT do

- Do not share the PH link before go-live (PH penalizes pre-launch sharing)
- Do not ask for "upvotes" in text — PH nukes listings for it. Say "feedback" or "support" instead
- Do not enable paid PH boost ads on launch day — wastes budget, no uplift for our ICP
- Do not change the tagline/description after 50 upvotes — resets ranking velocity

---

Source files superseded by this doc: `04-product-hunt.md`, `04-product-hunt-assets.md`. Keep them around for history; edit this file for any changes.
