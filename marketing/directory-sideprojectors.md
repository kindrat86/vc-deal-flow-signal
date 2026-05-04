# SideProjectors Listing — GitDealFlow

**Submit at:** https://www.sideprojectors.com/project/new (sign up first at /signup)
**Status:** Showing off (not for sale)
**Expected DA:** ~50, do-follow link from project page

---

## Form fields

**Project name:**
VC Deal Flow Signal

**Tagline / short description (under 140 chars):**
Spot breakout startups 3 weeks early via GitHub engineering signals. Free digest + EUR 9.97/mo dashboard + MCP server + Chrome extension.

**Website URL:**
https://gitdealflow.com

**Category / Tags:**
SaaS, Data, Developer Tools, AI, Venture Capital, Chrome Extension

**Tech stack:**
Next.js 15, Vercel, TypeScript, GitHub API, MCP, Chrome Extension Manifest V3

**Status:**
Showing off

**Price:** (leave blank / Not for sale)

**Monthly revenue / visitors:** (leave blank or "pre-launch")

---

## Long description (paste into the big textarea)

VC Deal Flow Signal monitors GitHub engineering activity across thousands of startup orgs and surfaces the ones showing unusual acceleration — typically 3-6 weeks before a fundraise announcement hits TechCrunch.

**The thesis:** when a startup's commit velocity, contributor count, and release cadence deviate sharply from their own baseline, something is changing. Hiring spikes, product acceleration, or a push toward a milestone (often a round). That signal is public, free, and updates daily. Nobody was reading it systematically.

**What's inside:**
- 272 sector / stage / geo pSEO pages with ranked startups
- Free weekly Signal Digest (5 breakout companies with real data)
- Dashboard (EUR 9.97/mo) — 85+ startups ranked across 20 sectors
- Insider Circle (EUR 97/mo) — private investor community + API access
- **MCP server** — query the signal from inside Claude Desktop or Claude Code. `npx @gitdealflow/mcp-signal`
- **Chrome extension** — overlays the engineering signal onto Crunchbase, AngelList, and PitchBook profiles

**How it differs from Harmonic / Dealroom / Crunchbase:** those charge $10K+/yr, require demo calls, and use proprietary black-box data. GitDealFlow uses transparent public GitHub data, is fully self-serve, and starts at EUR 9.97/mo. None of the incumbents track engineering momentum — they report rounds after the fact. We show the acceleration before the deck exists.

Built solo by the Data Nerd. Shipping in public. Feedback welcome.

---

## Screenshots to upload

1. Landing hero — gitdealflow.com above the fold
2. Sector ranking table (signals.gitdealflow.com / any sector page)
3. Sample signal card (carlos-emr or similar)
4. MCP server demo still from `/Users/sipi/Desktop/mcp-server-demo.mov`
5. Chrome extension overlay on Crunchbase

---

## After submission

- [x] **Submitted 2026-04-18** — permalink https://www.sideprojectors.com/project/78284/vc-deal-flow-signal-engineering-momentum-for-vcs (returns HTTP 200)
- [ ] **STILL UNDER REVIEW** — the listing is in the mod queue. Banner on the page: "This project is currently under review. You can expedite the process by requesting for a fast approval with a small fee." **Do NOT pay.** Expect approval email 2026-04-21 – 2026-04-23.
- [x] **4 do-follow backlinks** verified to gitdealflow.com (no `rel="nofollow"`) + 1 to `/mcp-demo.mp4`
- [x] Added to JSON-LD `sameAs` arrays on `pseo-site/app/page.tsx` and `pseo-site/app/about/page.tsx` — entity consolidation to Google (works even while listing is pre-approval)
- [x] Redeployed pSEO 2026-04-18 — verified live on signals.gitdealflow.com + IndexNow auto-pinged 272 URLs on postbuild
- [ ] Tweet from @data_nerd linking the listing (wait until approval lands to avoid sending people to a page that may still say "under review")
- [ ] (Optional, after approval) Embed "Featured on SideProjectors" badge on landing footer alongside SaaSHub, Crunchbase, G2

## Gotcha: URL 200 ≠ approved

SideProjectors serves the project permalink publicly even while the listing is in the mod queue. `curl -I` showing HTTP 200 and `grep` finding do-follow links is NOT proof of approval. The listing won't appear in their `/browse`, search, newsletter, or homepage feeds until the mods approve. Check the listing page itself for the "under review" banner, or the `/browse` feed, before declaring a directory listing fully live. Applies to future directory submissions too.

## Note on IndexNow

IndexNow only accepts URLs on domains you own/verify — so we **cannot** IndexNow-ping the SideProjectors URL itself. For backlink discovery we rely on:
1. Google's own crawler (SideProjectors has decent authority, pages get crawled regularly)
2. Social signals (Twitter/LinkedIn share of the listing)
3. Entity mapping via `sameAs` JSON-LD (above)
