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

**What I built**: A system that monitors 2,000+ startup GitHub orgs across 20 sectors. It calculates 14-day commit velocity, contributor growth, and repository expansion — then ranks startups by engineering acceleration. The site publishes weekly sector rankings with real data.

**Real example from this week**: carlos-emr (healthcare) — an open-source EMR system whose commit velocity spiked +199% in 14 days. 94 active contributors, up 76%. That's a textbook engineering hiring burst. This kind of pattern has preceded fundraise announcements by 6-12 weeks in our analysis.

**The stack**: Next.js pSEO site generating 100+ pages from structured data. GitHub API for the data pipeline. Pocketbase for subscriber management. Stripe for payments. Hosted on Vercel. The whole thing was built solo.

**Current state**:
- 20 sectors tracked (AI/ML, Fintech, Healthcare, Cybersecurity, Developer Tools, etc.)
- 43 startups showing measurable acceleration signals right now
- Free monthly Signal Digest (5 breakout startups with real data)
- Paid Dashboard at EUR 9.97/mo (50+ startups, filters by sector/stage/geography)
- Free weekly signals on Telegram

**What's next**: Chrome extension for Crunchbase/AngelList overlay (showing the engineering signal alongside the standard startup profile), and an API for investors who want to integrate signals into their own workflow.

**Ask**: Would you use something like this? If you're an angel investor or just curious about data-driven deal sourcing — what sectors would you want tracked?

Link: https://gitdealflow.com
Sector rankings: https://signals.gitdealflow.com
Free Telegram: https://t.me/gitdealflow
