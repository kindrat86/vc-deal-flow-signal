# VC Deal Flow Signal — MCP Server

Search startup engineering acceleration signals directly from your AI assistant.

![Claude querying VC Deal Flow Signal MCP server](https://gitdealflow.com/mcp-demo.gif)

Tracks commit velocity, contributor growth, and repository expansion across 20 sectors. Built for seed/Series A investors looking for traction signals before they show up in traditional deal flow.

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

## Paid tools — require API key

Three additional tools are available to Dashboard and Insider subscribers. They require `GITDEALFLOW_API_KEY` to be set in the MCP server environment. Get your key at [signals.gitdealflow.com/dashboard/api-keys](https://signals.gitdealflow.com/dashboard/api-keys).

| Tool | Input | Returns |
|---|---|---|
| `create_watchlist_item` | `startup_name`, `alert_on_accelerating?`, `alert_on_new_peak?` | Upserts the startup into your persistent watchlist; weekly email alerts fire automatically. |
| `list_watchlist` | — | All startups on your watchlist with latest signal data. |
| `remove_watchlist_item` | `startup_name` | Removes the startup from your watchlist. |

To enable paid tools, add `GITDEALFLOW_API_KEY` to your MCP config:

```json
{
  "mcpServers": {
    "vc-deal-flow-signal": {
      "command": "npx",
      "args": ["-y", "@gitdealflow/mcp-signal"],
      "env": {
        "GITDEALFLOW_API_KEY": "gdf_your_key_here"
      }
    }
  }
}
```

## Data

All data is sourced live from [signals.gitdealflow.com](https://signals.gitdealflow.com) public API. Free tools require no API key. Updated weekly on Mondays.

## Links

- Website: https://gitdealflow.com
- Dashboard: https://signals.gitdealflow.com
- JSON API: https://signals.gitdealflow.com/api/signals.json
- Twitter/X: https://x.com/data_nerd

## License

MIT
