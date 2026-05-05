# VC Deal Flow Signal — MCP Server

Search startup engineering acceleration signals directly from your AI assistant.

[![smithery badge](https://smithery.ai/badge/kindrat86/vc-deal-flow-signal)](https://smithery.ai/server/kindrat86/vc-deal-flow-signal)

> One-click install for Claude Desktop / Cursor / Cline / Continue via Smithery — verified, 98/100 quality score.

![Claude querying VC Deal Flow Signal MCP server](https://gitdealflow.com/mcp-demo.gif)

Tracks commit velocity, contributor growth, and repository expansion across 20 sectors. Built for angels, scouts, and technical operators looking for traction signals before they show up in traditional deal flow.

## Install

Add to your Claude Desktop config (`claude_desktop_config.json`):

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

Or for Claude Code (`.mcp.json` in project root):

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

### Mistral Le Chat (Custom MCP Connector — remote HTTP)

In Le Chat, open Settings → Connectors → **+ Add Connector** → **Custom MCP Connector**, then paste:

| Field | Value |
| --- | --- |
| Connector name | `vc-deal-flow-signal` |
| Connection server | `https://signals.gitdealflow.com/api/mcp/rpc` |
| Authentication | No Authentication |

Workspace-admin only. Full step-by-step at [signals.gitdealflow.com/integrations/mistral](https://signals.gitdealflow.com/integrations/mistral).

### Install matrix

Same `npx -y @gitdealflow/mcp-signal` runs in every stdio runtime below. Per-runtime snippets and marketplace status: [signals.gitdealflow.com/integrations/agent-runtimes](https://signals.gitdealflow.com/integrations/agent-runtimes).

| Client | Transport | Install path |
| --- | --- | --- |
| Claude Desktop | stdio | `claude_desktop_config.json` (above) |
| Claude Code | stdio | `.mcp.json` (above) |
| Cursor | stdio | Settings → MCP → +Add new MCP server → paste the JSON above; [cursor.directory listing](https://cursor.directory/plugins/vc-deal-flow-signal-mcp-1) (under review) |
| Cline (VS Code) | stdio | Cline panel → ⚙ → Edit Config → paste JSON; [cline/mcp-marketplace#1491](https://github.com/cline/mcp-marketplace/issues/1491) (submitted) |
| Block Goose | stdio | `goose session --with-extension "npx -y @gitdealflow/mcp-signal"`; [aaif-goose/goose#8974](https://github.com/aaif-goose/goose/pull/8974) (PR open) |
| OpenHands | stdio | `~/.openhands/mcp.json` paste-JSON, or `openhands mcp add ...` (no marketplace exists) |
| Aider | stdio | `npx -y mcpm-aider add vc-deal-flow-signal --command "npx -y @gitdealflow/mcp-signal"` (Aider native MCP not yet shipped — bridge required) |
| AiderDesk | stdio | Settings → Agent → MCP Servers → +Add → paste JSON |
| Raycast | stdio | Manage MCP Servers → +Add Server → paste JSON; [raycast/extensions#27618](https://github.com/raycast/extensions/pull/27618) (PR open) |
| Smithery one-click | streamable-http or stdio | [smithery.ai/server/kindrat86/vc-deal-flow-signal](https://smithery.ai/server/kindrat86/vc-deal-flow-signal) (Verified, 98/100) |
| Mistral Le Chat | Streamable HTTP | Custom Connector at `https://signals.gitdealflow.com/api/mcp/rpc` |
| ChatGPT GPT | OpenAPI Action | [GitHub VC Signal GPT](https://chatgpt.com/g/g-69f76b9b3b308191b6948bff20c0fbf8-github-vc-signal) — no install, paid ChatGPT plan required |
| Any other Streamable HTTP client | Streamable HTTP | `https://signals.gitdealflow.com/api/mcp/rpc` |
| Any other stdio client | stdio | `npx -y @gitdealflow/mcp-signal` |

## Tools

All tools are read-only, idempotent, and fetch live data from the public API (no auth required). Responses include both human-readable text and structured JSON (`structuredContent`) matching each tool's `outputSchema`.

| Tool | Input | Returns |
|---|---|---|
| `get_trending_startups` | — | Top 20 startups ranked by engineering acceleration across all sectors. |
| `search_startups_by_sector` | `sector` (enum of 20 slugs) | All tracked startups in the sector, ranked by acceleration. |
| `get_startup_signal` | `name` (case-insensitive) | Full signal profile for one startup: velocity, contributors, repos, classification. |
| `get_signals_summary` | — | Dataset snapshot — period, counts, refresh date, format URLs, citation. |
| `get_methodology` | — | How signals are sourced, computed, and classified, with known limitations. |

**Supported sectors:** `ai-ml`, `fintech`, `cybersecurity`, `developer-tools`, `healthcare`, `climate-tech`, `enterprise-saas`, `data-infrastructure`, `web3`, `robotics`, `edtech`, `ecommerce-infrastructure`, `supply-chain`, `legal-tech`, `hr-tech`, `proptech`, `agtech`, `gaming`, `space-tech`, `social-community`.

## Data

All data is sourced live from [signals.gitdealflow.com](https://signals.gitdealflow.com) public API. No API key required. Updated weekly on Mondays.

## Complementary: the Scout Game

If you want to put your own eye on the line, there's a prediction game on top of the same dataset at [signals.gitdealflow.com/predict](https://signals.gitdealflow.com/predict). Call which tracked startups raise a round in the next 6 months, earn points when your calls resolve, climb a public rank ladder from Curious to Oracle. Free tier: 3 predictions per month. Paid: 10 per month. Leaderboard: [signals.gitdealflow.com/leaderboard](https://signals.gitdealflow.com/leaderboard).

## Links

- Website: https://gitdealflow.com
- Dashboard: https://signals.gitdealflow.com
- Scout Game: https://signals.gitdealflow.com/predict
- Leaderboard: https://signals.gitdealflow.com/leaderboard
- JSON API: https://signals.gitdealflow.com/api/signals.json
- Twitter/X: https://x.com/data_nerd

## Show what you built

If you ship something that calls this MCP server, the dataset, or the public signals JSON, drop the **Built-With badge** in your README — one line, permanent CDN-cached SVG, no signup:

```markdown
[![Built with @gitdealflow/mcp-signal](https://signals.gitdealflow.com/api/badge/built-with/svg?variant=long)](https://signals.gitdealflow.com/built-with)
```

Three variants (default, compact, long) and copy-paste snippets for HTML / BBCode at [signals.gitdealflow.com/built-with](https://signals.gitdealflow.com/built-with). Ping `signal@gitdealflow.com` once you embed and we'll feature you on [/mirrors](https://signals.gitdealflow.com/mirrors).

## License

MIT
