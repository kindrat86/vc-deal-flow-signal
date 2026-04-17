# dev.to Article
## Publish after Reddit posts, link back to it from Reddit comments

---

**Title:** I stopped building dashboards. AI assistants are the new UI.

**Tags:** mcp, ai, typescript, opensource

**Cover image:** Upload mcp-server/assets/mcp-demo.gif (1.9MB, 2x speed, 12fps) — this is the hook; people will watch the loop before they read.

**Embed after first paragraph:**
```
{% embed https://raw.githubusercontent.com/kindrat86/vc-deal-flow-signal/main/mcp-server/assets/mcp-demo.mp4 %}
```
(dev.to's liquid `embed` tag auto-plays MP4s inline.)

---

**Body (copy below):**

## The dashboard nobody visited

I built a startup signal dashboard. It tracked GitHub engineering acceleration across 2,000+ startup organizations and ranked them by commit velocity, contributor growth, and repo expansion. The data was solid. The UI was clean.

Nobody came back to it.

Investors signed up, bookmarked the URL, and forgot about it. Because that's not how knowledge workers operate in 2026. They don't open dashboards. They ask their AI assistant.

## The shift

I had a realization: the best distribution channel for a data product isn't a website. It's being embedded in the tool people already use 8 hours a day.

For investors using Claude, that means an MCP server.

## What I built

[VC Deal Flow Signal](https://gitdealflow.com) monitors GitHub engineering activity across startup organizations and surfaces the ones showing unusual acceleration. The hypothesis: engineering acceleration (measured as the rate of change in commit velocity) is a leading indicator for fundraise announcements, usually by 6 to 12 weeks.

The MCP server exposes 5 tools:

| Tool | What it does |
|---|---|
| `get_trending_startups` | Top 20 startups by engineering acceleration |
| `search_startups_by_sector` | Startups ranked within a specific sector (20 sectors) |
| `get_startup_signal` | Signal profile for a specific startup |
| `get_signals_summary` | Dataset overview, formats, and links |
| `get_methodology` | How the signals are calculated |

All data is fetched live from the public API at signals.gitdealflow.com. No API key required.

## How I built the MCP server

The server is TypeScript, uses the official `@modelcontextprotocol/sdk`, and runs over stdio transport.

The entire implementation is about 250 lines:

```typescript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

const server = new Server(
  { name: "vc-deal-flow-signal", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Register tools, handle requests, fetch from API
// Full source: github.com/kindrat86/mcp-deal-flow-signal
```

Each tool fetches live data from `signals.gitdealflow.com/api/signals.json` and formats it as structured text. The server doesn't bundle any data — it's a thin wrapper around the public API.

## Publishing to the MCP ecosystem

Getting the server discoverable took three steps:

### 1. Publish to npm

```bash
npm publish --access public
```

Package: [@gitdealflow/mcp-signal](https://www.npmjs.com/package/@gitdealflow/mcp-signal)

### 2. Publish to the official MCP Registry

```bash
brew install mcp-publisher
mcp-publisher login github
mcp-publisher publish
```

This required a `server.json` manifest with the registry schema and an `mcpName` field in `package.json` that matches the registry namespace.

### 3. Submit to directories

I submitted to 8 directories in total:

- Official MCP Registry (published)
- npm (published)
- awesome-mcp-servers (PR open)
- Glama (approved)
- mcp.so (submitted)
- MCP Market (submitted)
- PulseMCP (auto-ingests from registry)
- Cline Marketplace (submitted)

The whole process from zero to published took about 3 hours.

## Install it

Add to your Claude Desktop or Claude Code config:

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

Then ask Claude: "Which startups are accelerating in fintech?" or "Show me the signal profile for roboflow."

## What I learned

1. **MCP servers are the new API.** If your product serves data, an MCP server is the highest-leverage distribution channel you can build. It took 2 hours to build and gets your product embedded in the user's workflow permanently.

2. **The ecosystem is early but growing fast.** The official registry exists, directories are active, and every major AI tool supports MCP. Getting in now means less competition for visibility.

3. **The best funnel is invisible.** When an investor asks Claude about startup signals and gets my data, they didn't "visit my website" or "open my app." They used my product without knowing they entered a funnel. That's the future of distribution.

4. **Embedded distribution needs a non-AI counterpart too.** Not every investor lives inside Claude yet. For the majority still browsing Crunchbase, AngelList, and PitchBook in the browser, I shipped a Chrome extension that injects the signal badge directly onto startup profile pages. Same Isenberg "piggyback" philosophy — show up where the user already is, not where you want them to go. Different surface, same funnel.

## Links

- Website: [gitdealflow.com](https://gitdealflow.com)
- npm: [@gitdealflow/mcp-signal](https://www.npmjs.com/package/@gitdealflow/mcp-signal)
- GitHub: [kindrat86/mcp-deal-flow-signal](https://github.com/kindrat86/mcp-deal-flow-signal)
- Live data: [signals.gitdealflow.com](https://signals.gitdealflow.com)
- Chrome extension (Crunchbase / AngelList / PitchBook badge): [Chrome Web Store](https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn)

---

## dev.to publishing notes

- Publish on dev.to under "The Data Nerd" account
- Add canonical URL if cross-posting elsewhere
- Engage with every comment for the first 24 hours
- Cross-link from Reddit posts: "I wrote a longer piece about this on dev.to: [link]"
