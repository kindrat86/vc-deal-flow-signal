<!-- SUPERSEDED 2026-08-16: DO NOT USE. The canonical Show HN post is v3 at
     /Users/sipi/signals-gitdealflow/AEO-hn-show-hn-draft.md (this is also the
     file the gdf-hn-launch cron's paste-ready brief points to). This draft
     predates the v3 fact/claim correction and still cites the CLOSED founding
     pricing. Claims locked in AGENTS.md: "350+" orgs, 15 sectors, EUR 49/mo
     Dashboard + EUR 197/mo Insider pricing. v3 is the verified, gate-gated pack. -->

# Hacker News — Show HN Post (SUPERSEDED, archived)

## Title
Show HN: I track GitHub engineering acceleration to help VCs find breakout startups

## URL
https://signals.gitdealflow.com

## Text (for self-post, if preferred over URL)

I built VC Deal Flow Signal — a tool that monitors GitHub engineering activity across 350+ startups in 15 sectors and ranks them by "engineering acceleration."

The core idea: when a startup's commit velocity spikes relative to its own baseline, something interesting is happening. Maybe they found PMF, maybe they just raised, maybe they hired a batch of engineers. Whatever it is, it shows up in the code 3-6 weeks before it shows up in a press release.

How it works:

- GitHub API pulls commit_activity, contributors, and repo creation data for startup orgs
- Computes 14-day commit velocity and its rate of change
- Classifies signal type (hiring burst, infra buildout, deploy spike, framework migration)
- Ranks startups by acceleration within each sector
- Regenerates weekly

Tech stack: Next.js 16 (SSG), Vercel, GitHub API, PostHog. The entire site is programmatically generated from data — 80+ pages across 15 sectors with structured data, FAQ schema, and weekly auto-refresh.

The data pipeline runs on a cron, rebuilds the site, and auto-submits to IndexNow for instant Bing indexing. Google Search Console is connected with a full sitemap.

Free tier: weekly Signal Digest of top 5 breakout startups by email. Everything on the site is free to browse.

Two embedded distribution layers for people who want the data in their existing workflow instead of a dashboard:
- MCP server (`npx @gitdealflow/mcp-signal`) — query signals directly from Claude Desktop, Claude Code, Cursor, or any MCP-compatible client
- Chrome extension (Crunchbase / AngelList / PitchBook overlay) — adds a green "Accelerating" badge to startup profiles where the engineering signal is already interesting. Link: https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn

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
Free tier (email digest), paid dashboard (EUR 49/mo), and an insider tier (EUR 197/mo) with a private investor group, live briefings, and API access.
