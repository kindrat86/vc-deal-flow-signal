# Reddit MCP Posts
## Post after launch week, one per day to avoid spam detection
## ATTACH mcp-server/assets/mcp-demo.mp4 on subs that accept video (r/ClaudeAI, r/cursor, r/SideProject) — fall back to GIF link or imgur for r/LocalLLaMA and r/venturecapital

---

## 1. r/ClaudeAI

**Title:** I built an MCP server that gives Claude live startup engineering data

**Body:**

I track GitHub engineering acceleration across startups (commit velocity, contributor growth, repo expansion) and package it for investors. I just published it as an MCP server so Claude can query the data directly.

5 tools:

- `get_trending_startups` — top 20 startups by engineering acceleration right now
- `search_startups_by_sector` — 15 sectors (web3, healthcare, space-tech, etc.)
- `get_startup_signal` — deep profile on any tracked startup
- `get_signals_summary` — dataset overview
- `get_methodology` — how the signals work

Install in 10 seconds:

```json
{
  "mcpServers": {
    "vc-deal-flow-signal": {
      "command": "npx",
      "args": ["-y", "@gitdealflow/mcp-signal"]
    }
  }
}
```

No API key. Free. Data updates weekly from the public GitHub API.

Try asking Claude: "Which startups are accelerating in fintech?" or "Show me trending developer tools companies."

npm: https://www.npmjs.com/package/@gitdealflow/mcp-signal
GitHub: https://github.com/kindrat86/mcp-deal-flow-signal

Happy to answer questions about the build or the data methodology.

---

## 2. r/cursor

**Title:** Free MCP server for startup engineering signals (no API key needed)

**Body:**

Just published an MCP server that gives you live startup acceleration data inside Cursor.

It tracks commit velocity, contributor growth, and repo expansion across 350+ startup GitHub orgs and ranks them by engineering momentum. Useful if you're into venture capital, angel investing, or just curious about which startups are building fast.

Install: `npx @gitdealflow/mcp-signal`

5 tools, 15 sectors, updated weekly. No API key, no login.

Example queries:
- "Which AI startups are showing the highest commit velocity?"
- "Get the signal profile for roboflow"
- "What's the methodology behind these signals?"

npm: https://www.npmjs.com/package/@gitdealflow/mcp-signal

---

## 3. r/LocalLLaMA

**Title:** MCP server for startup engineering signals — free, open source, no API key

**Body:**

I built an MCP server that serves live startup engineering acceleration data. It tracks commit velocity, contributor growth, and repo expansion across 15 sectors using the public GitHub API.

The server is TypeScript, runs over stdio, and works with any MCP-compatible client. No API key needed, data fetched live from signals.gitdealflow.com.

Source: https://github.com/kindrat86/mcp-deal-flow-signal
npm: https://www.npmjs.com/package/@gitdealflow/mcp-signal

Install:
```
npx @gitdealflow/mcp-signal
```

5 tools: trending startups, sector search, individual startup profiles, dataset summary, methodology.

Built for investors but the data is interesting for anyone tracking open-source ecosystem trends. The acceleration patterns (when a company's velocity doubles in 14 days) are surprisingly consistent before major announcements.

---

## 4. r/SideProject

**Title:** I built an AI-native deal flow tool for investors — it lives inside Claude, not a dashboard

**Body:**

I had a realization a few weeks ago: I built a startup signal dashboard and nobody came back to it. Investors signed up, bookmarked it, and forgot about it.

Because that's not how people work anymore. They ask their AI.

So instead of trying to get people to visit a website, I published an MCP server. Now when an investor asks Claude "which startups are accelerating in healthcare?", they get live data from my engine. No login, no tab to remember.

The data: I monitor 350+ startup GitHub orgs for engineering acceleration (commit velocity spikes, contributor growth, new repos). The patterns have historically preceded fundraise announcements by 3 to 6 weeks.

The product:
- Free MCP server: `npx @gitdealflow/mcp-signal`
- Free weekly email digest: 5 breakout startups
- Paid dashboard (EUR 9.97/mo): 60+ startups ranked

Stack: TypeScript MCP server, Next.js pSEO site, GitHub API data pipeline, PocketBase for subscribers, Stripe for payments, Vercel hosting.

The MCP server took about 2 hours to build and is now listed in the official MCP Registry, Glama, and MCP Market. For distribution, it's the best ROI thing I've done.

Site: https://gitdealflow.com

---

## 5. r/venturecapital

**Title:** Using GitHub engineering data as a leading indicator for deal sourcing

**Body:**

I've been tracking what GitHub repos look like before a startup announces a raise. The pattern is surprisingly consistent: steady commit rhythm, then a sharp break. Velocity doubles or triples, new contributors appear (often senior engineers), new repos get created for infrastructure and platform work.

This acceleration window, usually 14 days, has been the most reliable leading indicator I've found. By the time AngelList shows "trending" or TechCrunch writes about it, you're already weeks late.

I built a system that monitors 350+ startup GitHub orgs across 15 sectors and ranks them by engineering acceleration. The data updates weekly.

Three ways to access it:

1. **Free weekly digest**: 5 breakout startups with real data — sign up at https://gitdealflow.com
2. **Dashboard** (EUR 9.97/mo): 60+ startups ranked by sector, stage, and geography
3. **Claude AI plugin**: if you use Claude, you can query the data directly. Install: `npx @gitdealflow/mcp-signal`

The methodology is fully transparent: https://signals.gitdealflow.com/methodology

Curious to hear from investors here: would you actually use engineering signals in your sourcing workflow? What would make this more useful?

---

## Posting schedule

- Day 1: r/ClaudeAI (most relevant audience)
- Day 2: r/SideProject (builder story)
- Day 3: r/cursor (tool audience)
- Day 4: r/venturecapital (end user)
- Day 5: r/LocalLLaMA (technical audience)

Post between 8am-10am ET for best visibility. Use the kindrat86 Reddit account.
