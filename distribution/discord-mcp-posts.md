# Discord Posts: MCP Server Distribution
## Target servers: Claude/Anthropic community, MCP-related Discords, dev tool communities
## Timing: post within 48h of dev.to publish, stagger 1 server per day

---

## 1. Anthropic / Claude Discord
### Channel: #showcase or #mcp-servers (check channel names after joining)

**Post:**

**Built an MCP server for VC deal flow signals — free, no API key**

I track GitHub engineering acceleration across 2,000+ startup orgs (commit velocity, contributor growth, repo expansion) and rank them by sector. Published it as an MCP server so Claude can query the data directly.

**5 tools:**
- `get_trending_startups` — top 20 by engineering acceleration
- `search_startups_by_sector` — 20 sectors (AI, fintech, healthcare, etc.)
- `get_startup_signal` — deep profile on any tracked startup
- `get_signals_summary` — dataset overview
- `get_methodology` — how signals are calculated

**Install:**
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

Try: "Which startups are accelerating in fintech?" or "Show me the signal for roboflow"

No API key, data updates weekly from public GitHub API.

npm: https://www.npmjs.com/package/@gitdealflow/mcp-signal
Writeup on building it: [dev.to link]

Happy to answer questions on the build or methodology.

---

## 2. MCP Community Discord (discord.gg/mcp or similar)
### Channel: #showcase or #servers

**Post:**

**New MCP server: VC Deal Flow Signal (finance/startup data)**

Published a server that gives any MCP client live startup engineering acceleration data. It monitors GitHub activity across 2,000+ orgs in 20 sectors and ranks them by commit velocity change.

Built for investors, but the data is interesting for anyone tracking open-source ecosystem trends.

**Tech:**
- TypeScript, `@modelcontextprotocol/sdk`
- stdio transport
- 5 tools, live data from public API (no key needed)
- ~250 lines total

**Install:** `npx @gitdealflow/mcp-signal`

**Registry:** Listed on the official MCP Registry as `io.github.kindrat86/vc-deal-flow-signal`

Also on npm, Glama, mcp.so, and submitted to awesome-mcp-servers.

Full build writeup: [dev.to link]
Source: https://github.com/kindrat86/mcp-deal-flow-signal

Would love feedback from other server builders — especially on the tool API design (return format, error handling, etc.)

---

## 3. Developer Tool / AI Discords (Cursor, Windsurf, Cody, etc.)
### Channel: #mcp or #plugins or #integrations

**Post:**

**Free MCP server: startup engineering signals for deal flow**

If you use [Cursor/Windsurf/etc.] with MCP support, I published a server that gives you live startup acceleration data.

It tracks commit velocity spikes across 2,000+ GitHub orgs in 20 sectors. Originally built for VC investors, but useful for anyone curious about which startups are building fast right now.

**Install:** `npx @gitdealflow/mcp-signal`

**Example queries:**
- "Which AI startups are showing the highest commit velocity?"
- "Get the signal profile for roboflow"
- "What sectors are trending this week?"

No API key, no login. Data updates weekly.

npm: https://www.npmjs.com/package/@gitdealflow/mcp-signal

---

## 4. Indie Hackers / Builder Discords (Indie Worldwide, WIP.co, etc.)
### Channel: #launches or #showcase

**Post:**

**I built an AI-native deal flow tool that lives inside Claude, not a dashboard**

Quick story: I built a startup signal dashboard. Nobody came back to it. So I published an MCP server instead — now the data lives inside the AI assistant, not a tab you forget about.

The MCP server took 2 hours to build and is now my highest-distribution channel. Wrote up the full process including the publishing workflow (npm → MCP Registry → 8 directories):

[dev.to link]

If you're building a data product, seriously consider an MCP server. It's the best ROI distribution move I've done.

---

## 5. TypeScript / Node.js Discords
### Channel: #showcase or #projects

**Post:**

**Open source MCP server in TypeScript (~250 lines)**

Published an MCP server that serves live startup engineering data. Built with `@modelcontextprotocol/sdk`, runs over stdio, and works with Claude Desktop, Claude Code, Cursor, and any MCP-compatible client.

If you're interested in building MCP servers, the codebase is pretty minimal — good reference for the tool registration pattern and API-wrapper approach.

Source: https://github.com/kindrat86/mcp-deal-flow-signal
npm: https://www.npmjs.com/package/@gitdealflow/mcp-signal
Writeup: [dev.to link]

---

## Discord servers to join (if not already a member)

| Server | Relevance | Find it |
|--------|-----------|---------|
| Anthropic / Claude | Primary MCP audience | Search Discord or check anthropic.com |
| MCP Community | Server builders | Search "Model Context Protocol" on Discord |
| Cursor | MCP-enabled IDE users | cursor.sh community |
| Windsurf | MCP-enabled IDE users | codeium.com community |
| Indie Worldwide | Builder community | indiehackers adjacent |
| TypeScript Community | TS devs | Search Discord |
| AI Engineers | AI tool builders | Search Discord |

## Posting schedule

- Day 1: Anthropic/Claude Discord (highest-intent audience)
- Day 2: MCP Community Discord (server builders, peer feedback)
- Day 3: Cursor/Windsurf Discord (tool users)
- Day 4: Indie/builder Discords (story angle)
- Day 5: TypeScript/dev Discords (technical angle)

## Rules
- Don't spam — one post per server, in the right channel
- Engage with every reply for 48 hours
- Offer to help anyone building their own MCP server (builds goodwill)
- Never double-post in the same server
- If a server has a #self-promotion channel, use that; if #showcase, use that; otherwise ask a mod
