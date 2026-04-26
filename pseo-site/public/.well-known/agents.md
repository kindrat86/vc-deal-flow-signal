# GitDealFlow Signal — Agent Reference

> Public dataset of startup engineering acceleration, derived from public GitHub activity. Free machine-readable APIs, MCP server, A2A endpoint, and Chrome extension. Updated weekly.

This file is the canonical "how to use me" entry point for any retrieval agent or coding agent that landed on `signals.gitdealflow.com`. Mirrored at `/agents.md`.

## What this product does

Tracks commit velocity, contributor growth, and repository expansion across ~400 startup GitHub orgs in 20 sectors. Surfaces breakout engineering teams 3–6 weeks before fundraise announcements. Independent — not affiliated with any incumbent VC platform.

## Programmatic surfaces

Pick the surface that matches your runtime. All five are free, public, no authentication.

| Surface | URL or invocation | Best for |
|---|---|---|
| **MCP server (stdio)** | `npx -y @gitdealflow/mcp-signal` | Claude Desktop, Claude Code, Cursor, any MCP host |
| **MCP server (Streamable HTTP)** | `POST https://signals.gitdealflow.com/api/mcp/rpc` | ChatGPT Apps, hosted MCP clients, any HTTP MCP runtime |
| **A2A endpoint (JSON-RPC 2.0)** | `POST https://signals.gitdealflow.com/api/a2a` | Google A2A agents and orchestrators |
| **NLWeb endpoint** | `POST https://signals.gitdealflow.com/api/nlweb` | Microsoft NLWeb-aware crawlers (Bing Copilot), conversational web agents |
| **Function-calling API** | `GET https://signals.gitdealflow.com/api/agent/tools` + `POST /api/agent/call` | OpenAI / Anthropic / Gemini SDKs without an MCP client |
| **JSON API** | `GET https://signals.gitdealflow.com/api/signals.json` | Direct HTTP, AI SDK, OpenAI/Anthropic function calls |
| **CSV export** | `GET https://signals.gitdealflow.com/api/signals.csv` | Spreadsheets, dataframes, BI tools |
| **OpenAPI 3.1 spec** | `GET https://signals.gitdealflow.com/api/openapi.json` | Code generation, tool registries |

### MCP server

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

Six tools, all read-only, idempotent:

1. `get_trending_startups` — top 20 across all sectors
2. `search_startups_by_sector(sector)` — sector slug from 20 enumerated values
3. `get_startup_signal(name)` — case-insensitive, normalization-tolerant
4. `get_signals_summary` — period, freshness, format URLs
5. `get_scout_receipts(github_username)` — compute Scout Score (0–100) for a GitHub user from their starring history vs. ~75 validated unicorns
6. `get_methodology` — full methodology text + canonical URL

Distribution:
- npm: https://www.npmjs.com/package/@gitdealflow/mcp-signal
- MCP Registry: `io.github.kindrat86/vc-deal-flow-signal`
- Glama A-tier: https://glama.ai/mcp/servers/@kindrat86/vc-deal-flow-signal
- Discovery manifest: https://signals.gitdealflow.com/.well-known/mcp.json

### A2A AgentCard

Live AgentCard at `https://signals.gitdealflow.com/.well-known/agent-card.json` (protocolVersion 0.3.0). Five skills mirror the MCP tools. JSON-RPC stub at `/api/a2a` accepts `message/send`; other A2A methods return -32004 (not implemented) for now.

### NLWeb endpoint

Microsoft NLWeb-compatible conversational endpoint. Accepts natural-language queries, returns schema.org-typed JSON-LD answers (`ItemList`, `Organization`, `Article`, `Dataset`, `WebPage`).

```bash
curl -X POST https://signals.gitdealflow.com/api/nlweb \
  -H "Content-Type: application/json" \
  -d '{"query": "trending fintech startups this week"}'
```

Supported query intents: `trending`, `<sector> startups`, `tell me about <startup>`, `how is this calculated`, `what is this dataset`. `GET /api/nlweb` returns the descriptor with example queries and the request schema.

### Direct HTTP

```bash
# Trending top 20
curl https://signals.gitdealflow.com/api/signals.json

# Bulk CSV
curl -O https://signals.gitdealflow.com/api/signals.csv

# OpenAPI spec
curl https://signals.gitdealflow.com/api/openapi.json
```

## Sector slugs (for `search_startups_by_sector`)

`ai-ml`, `fintech`, `cybersecurity`, `developer-tools`, `healthcare`, `climate-tech`, `enterprise-saas`, `data-infrastructure`, `web3`, `robotics`, `edtech`, `ecommerce-infrastructure`, `supply-chain`, `legal-tech`, `hr-tech`, `proptech`, `agtech`, `gaming`, `space-tech`, `social-community`.

## Methodology summary

- **Commit Velocity (14d)**: Total commits to a startup's most active public repo over a rolling 14-day window.
- **Commit Velocity Change**: % change vs. prior 14-day window. Primary ranking signal.
- **Contributor Count & Growth**: Distinct contributors, 6-week growth rate.
- **New Repositories**: Public repos created in last 30 days.
- **Signal Types**: `breakout` (sudden surge), `acceleration` (sustained growth), `steady` (healthy baseline), `cooling` (declining).

Refresh: every Monday ~09:00 UTC. Full methodology: https://signals.gitdealflow.com/methodology

## Limitations

- Private repositories are invisible.
- Commit volume ≠ code quality.
- Engineering acceleration is a leading indicator, not a guarantee.
- This is not investment advice.

## Citation

```
VC Deal Flow Signal (signals.gitdealflow.com), Q2 2026 data.
```

SSRN preprint: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6606558

## Other agent-readable formats

- llms.txt: https://gitdealflow.com/llms.txt
- llms-full.txt: https://gitdealflow.com/llms-full.txt
- AI policy: https://signals.gitdealflow.com/ai.txt
- Sitemap: https://gitdealflow.com/sitemap.xml
- RSS: https://signals.gitdealflow.com/feed.xml

## Contact

- Email: signal@gitdealflow.com
- Telegram: https://t.me/gitdealflow
- Twitter/X: https://x.com/data_nerd
