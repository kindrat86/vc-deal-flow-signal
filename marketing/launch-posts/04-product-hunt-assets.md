# Product Hunt Asset Briefs + Hunter Outreach
## Companion to 04-product-hunt.md — fills the gaps for Apr 26 launch

The maker comment, tagline, and description are already drafted in `04-product-hunt.md`. This file covers what's still missing: detailed image briefs, hunter outreach, and the supporter alert.

---

## 1. Image asset briefs (need by Apr 23, 3 days before launch)

Product Hunt allows up to **5 images** + **1 video/GIF**. PH renders at 1270x760, so design at **2540x1520** (2x retina) and export PNG.

### Image 1 — Hero (REQUIRED, first image users see)
- **Source:** Screenshot of `signals.gitdealflow.com` homepage above the fold (the trending leaderboard with orbiternassp at #1)
- **Spec:** 2540x1520 PNG. Browser chrome cropped out. Add a 1-line overlay at top: "Spot breakout startups 3 weeks before they hit your inbox"
- **Capture command:** `vercel deploy` is not needed — just use Chrome DevTools device toolbar at 1270x760, take a full-viewport screenshot, scale 2x

### Image 2 — Sector ranking page
- **Source:** `signals.gitdealflow.com/sector/cybersecurity` — full ranked list with akto-api-security at #1
- **Spec:** 2540x1520 PNG. Show the table with at least 8 startups visible. Crop the footer.
- **Why this one:** Cybersecurity is our deepest sector (7 startups tracked, akto +75%). Most credible signal density.

### Image 3 — Sample signal card (close-up)
- **Source:** Single startup card for orbiternassp showing all metrics: +329% velocity, 30 commits/14d, 37 contributors, "Deploy frequency spike" signal type
- **Spec:** 2540x1520 PNG. Center the card on a soft brand-color background (not screenshot of full page). One number is BIG (+329%).

### Image 4 — MCP server in action
- **Source:** Screen recording or screenshot of Claude Desktop with the MCP query: "Which startups in cybersecurity are accelerating?" → Claude returns live ranked data
- **Spec:** 2540x1520 PNG. Include the Claude UI with the npx command visible at the top: `npx @gitdealflow/mcp-signal`
- **Why critical:** This is the differentiator no incumbent has. PH skews developer.

### Image 5 — Pricing comparison
- **Source:** Build a 3-column table: Free (Digest) / EUR 9.97 (Dashboard) / EUR 97 (Insider Circle). Add a 4th column "Harmonic / Dealroom" with "$10K+/yr, demo required" — the wedge.
- **Spec:** 2540x1520 PNG. Clean table, brand colors, no screenshots.

### Optional video/GIF (HIGHLY RECOMMENDED)
- **Source:** 30-second screen recording of the MCP server flow: terminal → `npx @gitdealflow/mcp-signal` → Claude query → ranked startup output
- **Spec:** GIF, max 3MB, ≤30 sec, 1270x760 native
- **Tooling:** Record with QuickTime (or Kap), convert with `gifski` or `ffmpeg -i in.mov -vf "fps=15,scale=1270:-1" -loop 0 out.gif`
- **Note:** This GIF doubles as the Twitter MCP demo and the dev.to article header — record once, use 4x

---

## 2. Hunter outreach DM (send by Apr 22, 4 days before)

**Destination:** https://x.com/messages/compose?recipient_id=ryan_hoover (or PH-internal DM if you have a maker connection)
**Account to send from:** @data_nerd
**Why:** A heads-up to a high-profile hunter doesn't guarantee a hunt, but it removes the cold-DM-on-launch-day awkwardness.

### Message

Hey Ryan — quick heads up, not asking for a hunt.

I'm launching VC Deal Flow Signal on Product Hunt this Sunday Apr 26. It's a tool that ranks startup GitHub orgs by engineering acceleration so investors can spot breakouts 3 weeks before they hit pitch deck stage.

Already shipped: 52 startups across 18 sectors live, MCP server on npm so Claude can query the data, free monthly digest + EUR 9.97/mo dashboard.

If it's interesting enough to feature in your weekly roundup, the listing goes live 12:01 AM PT Sunday: {PH-link}

Either way, congrats on building PH into what it is. — The Data Nerd / signals.gitdealflow.com

---

## 3. Supporter alert (send Apr 25, day before launch)

**Destination:** Telegram public channel (free) + email to existing subscribers via Zoho (signal@gitdealflow.com)
**Subject:** Tomorrow we launch on Product Hunt — would love your help

### Email body

Hey,

Tomorrow morning (Sunday Apr 26, 10:01 EEST / 12:01 AM PT) VC Deal Flow Signal goes live on Product Hunt.

If you've read the Signal Digest and found it useful, the single most helpful thing you can do is:

1. Click the link tomorrow morning: {PH-link}
2. Click the orange "upvote" button
3. Leave a one-sentence comment about what you've found useful

That's it. The first 4 hours determine the day.

The link will be live at 10:01 EEST sharp. I'll send a one-line follow-up the moment it goes live.

Thanks for being here from the start.

— The Data Nerd

---

## 4. Final pre-launch checklist (run Apr 25, 24 hrs before)

- [ ] All 5 images exported at 2540x1520 PNG, under 3MB each
- [ ] Demo GIF under 3MB, plays cleanly in PH preview
- [ ] PH listing drafted in PH dashboard with tagline + description from `04-product-hunt.md`
- [ ] Maker comment copied into a draft (post immediately on go-live)
- [ ] Hunter DM sent (Apr 22)
- [ ] Supporter email scheduled for Apr 25 18:00 EEST
- [ ] Twitter retro thread loaded into Typefully or scheduled (see `launch-retrospective.md`)
- [ ] IH retro post saved as draft (don't publish until PH is live)
- [ ] Topic tags selected: Venture Capital, Developer Tools, Data Analytics, Investing
- [ ] Pricing set to "Freemium"
- [ ] Confirm 5 supporters can show up in the first hour

---

## 5. Hunter to consider (if Ryan doesn't bite)

These are makers who hunt regularly and have launched VC/data tools:
- **Tibo Maker** (@tibo_maker) — launched analytics tools, open to dev-utility hunts
- **Chris Messina** (@chrismessina) — early PH community, hunts a lot of dev tools
- **Kevin William David** (@kwdinc) — actively hunts B2B SaaS

Outreach pattern: same DM as above, swap the name. If none respond by Apr 24 evening, **self-hunt**. A self-hunt with a strong first comment + 5 supporters in the first hour beats waiting on a hunter who never confirms.
