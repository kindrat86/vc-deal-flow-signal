# Indie Hackers Post — Wave 1 (Sunday April 19)
## Post type: Build in public milestone

---

### Title
I built a tool that reads GitHub to find breakout startups before VCs do

### Body (copy-paste below)

I've been obsessed with an idea for the last few months: what if you could spot the next breakout startup by reading their GitHub activity?

**The problem**: VCs see the same deals. Warm intros, demo days, TechCrunch — by the time a startup hits your radar, 50 other investors already have the deck. The best deals close before most investors know the company exists.

**The insight**: GitHub is the largest free dataset of real-time engineering activity in the world. Every commit, every new contributor, every repository — timestamped and public. When a startup's commit velocity spikes 200% in two weeks, something changed. Maybe they just closed a round. Maybe they found product-market fit. Maybe they're about to launch.

Whatever the cause, the signal shows up in the commit graph **weeks before** it shows up in a press release.

**What I built**: A system that monitors thousands of startup GitHub orgs across 20 sectors. It calculates 14-day commit velocity, contributor growth, and repository expansion — then ranks startups by engineering acceleration. The site publishes weekly sector rankings with real data.

**Real example from this week**: carlos-emr (healthcare) — an open-source EMR system whose commit velocity spiked +199% in 14 days. 94 active contributors, up 76%. That's a textbook engineering hiring burst. This kind of pattern has preceded fundraise announcements by 3-6 weeks in our analysis.

**The stack**: Next.js pSEO site generating 100+ pages from structured data. GitHub API for the data pipeline. Pocketbase for subscriber management. Stripe for payments. Hosted on Vercel. The whole thing was built solo.

**Why not just use Harmonic, Dealroom, or Forager?** I looked at every deal flow platform out there. They charge $10K+/year, require you to book a demo just to see the product, and run on proprietary black-box data. Forager has a free trial but only searches people, not startups. None of them track engineering momentum. I wanted something transparent, self-serve, and affordable enough for solo angels — not just funds with six-figure tooling budgets.

**Current state**:
- 20 sectors tracked (AI/ML, Fintech, Healthcare, Cybersecurity, Developer Tools, etc.)
- 60+ startups showing measurable acceleration signals right now
- Free weekly Signal Digest (5 breakout startups with real data)
- Paid Dashboard at EUR 9.97/mo (60+ startups, filters by sector/stage/geography)
- Free weekly signals on Telegram

**NEW: Works inside Claude.** I just published an MCP server so you can query our data directly from Claude Desktop or Claude Code. Ask "which fintech startups are accelerating?" and get live data without leaving your AI workflow. Install: `npx @gitdealflow/mcp-signal`

**NEW: Two free Chrome extensions.**
- *Extension 1 — Crunchbase + Wellfound badge:* a green "Accelerating" badge appears on any startup profile on Crunchbase or Wellfound that's showing engineering momentum. Same workflow you already have, new layer of signal. https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn
- *Extension 2 — VC GitHub Lookup (NEW, May 2026):* hover any GitHub repo or org link for instant commit velocity, contributor growth, signal type, and stage estimate. Turns GitHub itself into a deal-flow surface. https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm

**What's next**: Public API for investors who want to pipe signals into their own workflows, watchlists, or trading systems.

**Ask**: Would you use something like this? If you're an angel investor or just curious about data-driven deal sourcing — what sectors would you want tracked?

Link: https://gitdealflow.com
Sector rankings: https://signals.gitdealflow.com
Free Telegram: https://t.me/gitdealflow
