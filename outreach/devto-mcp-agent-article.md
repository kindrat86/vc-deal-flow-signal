# Build a VC Sourcing Agent with GitDealFlow's Free MCP Server (6 Tools, No API Key)

Most VC deal-flow tools cost $5,000–$30,000 per year. GitDealFlow's MCP server costs nothing and gives your AI assistant six tools for reading startup engineering acceleration signals. Here's how to set it up in 5 minutes.

## What the MCP server gives you

GitDealFlow (`npx -y @gitdealflow/mcp-signal`) tracks public GitHub commit velocity across 350+ startup organizations and ranks them by engineering momentum every week. The MCP server exposes six read-only tools:

1. **get_trending_startups** — Top 20 startups across all 20 sectors this week
2. **search_startups_by_sector(sector)** — Filter by sector slug (e.g., "fintech", "ai-ml", "cybersecurity")
3. **get_startup_signal(name)** — Get full signal profile for a named startup
4. **get_signals_summary** — Current period, data freshness, export URLs
5. **get_scout_receipts(github_username)** — Grade someone's GitHub star history as a "Scout Score" (0–100)
6. **get_methodology** — The full SSRN-published methodology

No API key. No rate limits. No authentication. Just install and start querying.

## Setup with Claude Desktop (30 seconds)

1. Open Claude Desktop → Settings → Developer → Edit Config
2. Add this to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "gitdealflow": {
      "command": "npx",
      "args": ["-y", "@gitdealflow/mcp-signal"]
    }
  }
}
```

3. Restart Claude Desktop. You'll see six new tools in the tool list.

## Setup with Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "gitdealflow": {
      "command": "npx",
      "args": ["-y", "@gitdealflow/mcp-signal"]
    }
  }
}
```

## Code examples

### Find the top 5 accelerating fintech startups this week

```
User: "Show me the top 5 fintech startups accelerating on GitHub this week"

Claude: [Calls search_startups_by_sector("fintech")]

Result:
1. OpenBB-finance/OpenBB — +320% commit velocity, Deploy frequency spike
2. maybe-finance/maybe — +180% velocity, Framework migration
3. getlago/lago — +145% velocity, Infrastructure buildout
4. midday-ai/midday — +95% velocity, Contributor growth
5. splice-finance/splice — +72% velocity, Deploy frequency spike
```

### Check a specific startup's signal

```
User: "What's the GitDealFlow signal on vercel/next.js?"

Claude: [Calls get_startup_signal("vercel")]

Result:
vercel/next.js
Score: 88/100
Stars: 141,705
Δ stars/week: +651
Language: JavaScript
Signal type: Sustained momentum
Last push: 2026-08-10
```

### Grade someone's investment taste

```
User: "What's tj's Scout Score?"

Claude: [Calls get_scout_receipts("tj")]

Result:
Scout Score: 78/100
Rank: Elite
Top 5 early calls: Vercel (pre-$1B), Tailwind CSS, React, Next.js, Prisma
```

## A real use case: Monday morning deal sourcing pipeline

Start your Monday with this single prompt:

> "Show me the top 5 accelerating startups this week in enterprise-saas, cybersecurity, and data-infrastructure. For each, give me the signal type, velocity change, and a one-line reason it matters. Then generate a markdown table I can paste into our pipeline review doc."

Output:

| Startup | Sector | Velocity | Signal | Why |
|---------|--------|----------|--------|-----|
| databayt | Enterprise SaaS | +573% | Deploy spike | Highest single-org acceleration this week |
| ConduitIO | Data Infra | +421% | Infra buildout | 5 new repos in 30 days |
| greenbone | Cybersecurity | +130% | Framework migration | Sustained contributor growth |

## What makes these signals different from Crunchbase

Crunchbase tells you a funding round happened. GitDealFlow tells you it's about to happen. The SSRN preprint (abstract=6606558) backtested 219 fundraises and found a 3.4x predictive lift from the composite of commit velocity and contributor diversity — with a median 31-day lead time over the public announcement.

The Chrome extension overlays these momentum badges directly on Crunchbase and Wellfound profiles, so the signal appears where you already look.

## The data is open

- **Dataset:** CC BY 4.0, downloadable CSV/JSON
- **Momentum Index:** 40 repos ranked weekly at gitdealflow.com/data/momentum-index
- **API:** OpenAPI 3.1 spec, JSON endpoint, CSV export
- **Methodology:** Published on SSRN, fully reproducible

## Get started

```bash
npx -y @gitdealflow/mcp-signal
```

Or get the free Sunday email — 5 named startups with plain-English notes every Sunday at [gitdealflow.com](https://gitdealflow.com/#signup).

---

*Built by The Data Nerd. Pseudonymous. Open-source. Free forever.*
