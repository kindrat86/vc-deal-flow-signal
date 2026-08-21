<!-- SUPERSEDED: The canonical Show HN post is v3 at /Users/sipi/signals-gitdealflow/AEO-hn-show-hn-draft.md.
     (distribution/hackernews-post.md is itself superseded; do not use it either.)
     This version was never posted and still cites stale claims (2,000+ orgs, 20 sectors, EUR 9.97/mo). -->
# Show HN Post — Wave 2 (Tuesday April 21)
## Post between 8am-10am ET for max visibility

---

### Title
Show HN: VC Deal Flow Signal – GitHub engineering momentum as a leading indicator for investors

### URL
https://signals.gitdealflow.com

### First comment (post immediately after submitting)

Hey HN. I noticed that startups showing commit velocity spikes on GitHub tend to announce raises or product launches 3-6 weeks later. So I built a system that monitors 2,000+ GitHub orgs and ranks them by engineering acceleration for investors.

The data pipeline pulls commit activity from the GitHub API weekly, calculates 14-day rolling velocity and its rate of change, classifies signal types (hiring burst, infrastructure buildout, deploy frequency spike, framework migration), and publishes sector-by-sector rankings across 20 sectors.

Real example from this week: carlos-emr (healthcare open-source EMR) — commit velocity spiked +199% in 14 days, 94 active contributors up 76%. That's a regime change, not normal variance.

The pSEO site generates 100+ pages from structured data (Next.js on Vercel). Each sector page has real startup rankings with commit velocity, contributor counts, signal type, and stage estimates.

I also published an MCP server (npm: @gitdealflow/mcp-signal) so you can query the data directly from Claude Desktop or Claude Code. No API key needed. Just `npx @gitdealflow/mcp-signal` and you get 5 tools: trending startups, sector search, startup profiles, methodology, and data summary.

Existing deal flow platforms (Harmonic, Dealroom, etc.) charge $10K+/year, gate everything behind demo calls, and use proprietary data you can't verify. This is the opposite: transparent public GitHub data, self-serve, EUR 9.97/mo.

Honest questions I'd love HN's take on:

1. Is commit velocity change a meaningful signal, or am I overfitting to a few examples?
2. What other public data sources would make this more reliable? (I've been thinking about job postings and npm/PyPI download spikes as complementary signals.)
3. For those of you who angel invest — would you actually use this in your sourcing workflow?

The methodology page explains exactly how everything is calculated: https://signals.gitdealflow.com/methodology

---

### Tips for the day
- Post between 8-10am ET
- Don't ask anyone to upvote
- Respond to EVERY comment, especially critics
- The self-deprecating "am I overfitting?" tone plays well on HN
- If it gets traction, stay engaged for 4-6 hours
