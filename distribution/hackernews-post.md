# Hacker News — Show HN Post

## Title
Show HN: I track GitHub engineering acceleration to help VCs find breakout startups

## URL
https://signals.gitdealflow.com

## Text (for self-post, if preferred over URL)

I built VC Deal Flow Signal — a tool that monitors GitHub engineering activity across thousands of startups in 20 sectors and ranks them by "engineering acceleration."

The core idea: when a startup's commit velocity spikes relative to its own baseline, something interesting is happening. Maybe they found PMF, maybe they just raised, maybe they hired a batch of engineers. Whatever it is, it shows up in the code 3-6 weeks before it shows up in a press release.

How it works:

- GitHub API pulls commit_activity, contributors, and repo creation data for startup orgs
- Computes 14-day commit velocity and its rate of change
- Classifies signal type (hiring burst, infra buildout, deploy spike, framework migration)
- Ranks startups by acceleration within each sector
- Regenerates weekly

Tech stack: Next.js 16 (SSG), Vercel, GitHub API, PostHog. The entire site is programmatically generated from data — 80+ pages across 20 sectors with structured data, FAQ schema, and weekly auto-refresh.

The data pipeline runs on a cron, rebuilds the site, and auto-submits to IndexNow for instant Bing indexing. Google Search Console is connected with a full sitemap.

Free tier: weekly Signal Digest of top 5 breakout startups by email. Everything on the site is free to browse.

Three embedded distribution layers for people who want the data in their existing workflow instead of a dashboard:
- MCP server (`npx @gitdealflow/mcp-signal`) — query signals directly from Claude Desktop, Claude Code, Cursor, or any MCP-compatible client
- Chrome extension #1 — Crunchbase + Wellfound badge: green "Accelerating" badge on startup profiles where the engineering signal is interesting. Link: https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn
- Chrome extension #2 — VC GitHub Lookup (new May 2026): hover any github repo or org link → tooltip with commit velocity, contributor growth, signal type, stage estimate. Link: https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm

I'd love feedback on:
1. Is this signal actually useful for investors?
2. What other engineering signals would you want to track?
3. Any sectors I should add?

---

# Comment replies to prep

## "This is just commit count, it doesn't mean anything"
We don't measure absolute commits — we measure acceleration (rate of change from baseline). A team going from 20 to 60 commits in 2 weeks is a different signal than a team consistently at 200. The acceleration matters, not the level.

## "Most startup code is private"
True. This only captures public engineering activity. For DevTools, open-source infra, and developer-facing companies, the signal is strong. For consumer apps with no public repos, it's less useful. We're transparent about this on our methodology page.

## "How do you filter out big companies and OSS projects?"
We maintain a blocklist of large tech companies and OSS foundations. We also filter by repo characteristics — star count, contributor patterns, organization size — to focus on venture-scale startups.

## "What's the business model?"
Free tier (email digest), paid dashboard (EUR 9.97/mo during beta), and an insider tier (EUR 97/mo) with a private investor group, live briefings, and API access.
