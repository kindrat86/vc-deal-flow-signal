# @gitdealflow/mcp-signal — Startup Engineering Velocity Signals for AI Agents

[![npm version](https://img.shields.io/npm/v/@gitdealflow/mcp-signal.svg)](https://www.npmjs.com/package/@gitdealflow/mcp-signal)
[![npm downloads](https://img.shields.io/npm/dm/@gitdealflow/mcp-signal.svg)](https://www.npmjs.com/package/@gitdealflow/mcp-signal)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Smithery](https://smithery.ai/badge/kindrat86/vc-deal-flow-signal)](https://smithery.ai/server/kindrat86/vc-deal-flow-signal)

**MCP server for searching, shortlisting, comparing, and predicting startup engineering acceleration across 15 sectors.** Tracks commit velocity, contributor growth, and repository expansion for 350+ GitHub orgs. Built for VCs, angels, scouts, and technical operators who need transparent, citable deal-flow signals before they show up in traditional channels.

> One-click install for Claude Desktop / Cursor / Cline / Continue via Smithery — verified, 98/100 quality score.
>
> [![Smithery install](https://smithery.ai/badge/kindrat86/vc-deal-flow-signal)](https://smithery.ai/server/kindrat86/vc-deal-flow-signal)

![Claude querying VC Deal Flow Signal MCP server](https://raw.githubusercontent.com/kindrat86/vc-deal-flow-signal/main/marketing/launch-posts/mcp-demo-ph-30s.gif)

---

## Quick Start

```bash
# Run instantly — no install required
npx -y @gitdealflow/mcp-signal
```

Add to Claude Desktop (`claude_desktop_config.json`):

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

Or streamable HTTP for ChatGPT, Mistral Le Chat, and HTTP MCP clients:

```
POST https://signals.gitdealflow.com/api/mcp/rpc
```

**No API key required. All tools are free and read-only.**

---

## Use Cases

| Who | How they use it |
|---|---|
| **VCs & Angel Investors** | Screen Crunchbase profiles against live engineering velocity data. Use `predict_funding` for transparent, citable funding-likelihood scores with full evidence chains. |
| **Startup Founders** | Benchmark your own engineering velocity against 350+ tracked startups across your sector. Identify acquisition targets or partnership opportunities. |
| **Recruiters & Hiring Teams** | Find startups with accelerating engineering teams — the teams that are building fast and hiring. |
| **Scouts & Syndicate Leads** | Run `shortlist_signals` with sector/geography filters to surface the strongest deals in your thesis area. Use `get_scout_receipts` to validate your pattern recognition against 75+ unicorns. |
| **Corp Dev & M&A Teams** | Monitor competitor velocity trends and identify breakout acquisition targets 3–6 weeks before fundraise announcements. |
| **AI Agents & Copilots** | Integrate startup signals into agentic workflows — deal sourcing, company research, portfolio monitoring, and investment thesis generation. |

---

## Install

### Claude Desktop (stdio)

Add to `claude_desktop_config.json`:

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

### Claude Code (`.mcp.json` in project root)

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
|---|---|
| Connector name | `vc-deal-flow-signal` |
| Connection server | `https://signals.gitdealflow.com/api/mcp/rpc` |
| Authentication | No Authentication |

Workspace-admin only. Full step-by-step at [signals.gitdealflow.com/integrations/mistral](https://signals.gitdealflow.com/integrations/mistral).

### Install matrix

Same `npx -y @gitdealflow/mcp-signal` runs in every stdio runtime below. Per-runtime snippets and marketplace status: [signals.gitdealflow.com/integrations/agent-runtimes](https://signals.gitdealflow.com/integrations/agent-runtimes).

| Client | Transport | Install path |
|---|---|---|
| Claude Desktop | stdio | `claude_desktop_config.json` (above) |
| Claude Code | stdio | `.mcp.json` (above) |
| Cursor | stdio | Settings → MCP → +Add new MCP server → paste the JSON above; [cursor.directory listing](https://cursor.directory/plugins/vc-deal-flow-signal-mcp-1) (under review) |
| Cline (VS Code) | stdio | Cline panel → ⚙ → Edit Config → paste JSON; [cline/mcp-marketplace#1491](https://github.com/cline/mcp-marketplace/issues/1491) (open, awaiting review) |
| Block Goose | stdio | `goose session --with-extension "npx -y @gitdealflow/mcp-signal"`; [block/goose#8974](https://github.com/block/goose/pull/8974) (closed — Goose registry moratorium 2026-05-12, pending new listing flow) |
| OpenHands | stdio | `~/.openhands/mcp.json` paste-JSON, or `openhands mcp add ...` (no marketplace exists) |
| Aider | stdio | `npx -y mcpm-aider add vc-deal-flow-signal --command "npx -y @gitdealflow/mcp-signal"` (Aider native MCP not yet shipped — bridge required) |
| AiderDesk | stdio | Settings → Agent → MCP Servers → +Add → paste JSON |
| Raycast | stdio | Manage MCP Servers → +Add Server → paste JSON; [raycast/extensions#28376](https://github.com/raycast/extensions/pull/28376) (open, Ready for Review; supersedes auto-stale'd #27618) |
| Smithery one-click | streamable-http or stdio | [smithery.ai/server/kindrat86/vc-deal-flow-signal](https://smithery.ai/server/kindrat86/vc-deal-flow-signal) (Verified, 98/100) |
| Mistral Le Chat | Streamable HTTP | Custom Connector at `https://signals.gitdealflow.com/api/mcp/rpc` |
| ChatGPT GPT | OpenAPI Action | [GitHub VC Signal GPT](https://chatgpt.com/g/g-69f76b9b3b308191b6948bff20c0fbf8-github-vc-signal) — no install, paid ChatGPT plan required |
| Any other Streamable HTTP client | Streamable HTTP | `https://signals.gitdealflow.com/api/mcp/rpc` |
| Any other stdio client | stdio | `npx -y @gitdealflow/mcp-signal` |

---

## Tools

All tools are read-only, idempotent, and fetch live data from the public API (no auth required). Responses include both human-readable text and structured JSON (`structuredContent`) matching each tool's `outputSchema`.

| Tool | Input | Returns |
|---|---|---|
| `get_trending_startups` | — | Top 20 startups ranked by engineering acceleration across all sectors. |
| `search_startups_by_sector` | `sector` (enum of active slugs — currently 15) | All tracked startups in the sector, ranked by acceleration. |
| `get_startup_signal` | `name` (case-insensitive) | Full signal profile for one startup: velocity, contributors, repos, classification. |
| `get_signals_summary` | — | Dataset snapshot — period, counts, refresh date, format URLs, citation. |
| `get_methodology` | — | How signals are sourced, computed, and classified, with known limitations. |
| `predict_funding` | `name` | Transparent, scored funding-likelihood claim for one startup — score, full evidence chain, confidence, caveats, and methodology + SSRN provenance so the number is citable, not opaque. |
| `compare_signals` | `names` (2–5) | Head-to-head scored comparison of named startups, ranked, with a diligence recommendation. |
| `shortlist_signals` | `sector?`, `geography?`, `signalType?`, `minAccelerationScore?`, `minVelocityChangePct?`, `limit?` | The whole sourcing workflow in one call — "5 strongest signals in healthcare in the EU", ranked by acceleration score with a rationale each. |
| `get_diligence_dossier` | `name` | Public-source diligence dossier for one company in a cited object — M&A history (acquirer, year, amount), funds that publicly backed it, and the published engineering-acceleration signal. |
| `get_scout_receipts` | `github_username` | Scout Score (0–100) for a GitHub user from their public starring history vs. validated unicorns. |

**Provenance, not opaque numbers.** `predict_funding`, `shortlist_signals`, and `compare_signals` use one transparent, deterministic scoring engine (velocity ≤40 + contributor-growth ≤25 + new-repos ≤15 + signal-class ≤20 = 0–100). Every input and weight is returned in the response so a downstream agent can audit and cite the score. Geography is region-level only (`US`/`EU`/`UK`/`APAC`/`LATAM`/`Canada`); city/country aliases normalize up to the region. These are heuristics over public GitHub activity — not investment advice and not a guarantee of any financing event.

> Three paid agent tools (`research_company`, `compose_thesis`, `deep_dive_scan`) add enriched dossiers, thesis scaffolds, and multi-cohort sector scans for API-key holders — see [/pricing](https://signals.gitdealflow.com/pricing?utm_source=github&utm_medium=readme&utm_campaign=mcp_server).

**Supported sectors (active, refreshed weekly):** `healthcare`, `edtech`, `ecommerce-infrastructure`, `supply-chain`, `web3`, `enterprise-saas`, `data-infrastructure`, `robotics`, `legal-tech`, `hr-tech`, `proptech`, `agtech`, `gaming`, `space-tech`, `social-community`.

---

## Data

All data is sourced live from [signals.gitdealflow.com](https://signals.gitdealflow.com?utm_source=github&utm_medium=readme&utm_campaign=mcp_server) public API. No API key required. Updated weekly on Mondays.

- **JSON API:** `GET https://signals.gitdealflow.com/api/signals.json`
- **CSV export:** `GET https://signals.gitdealflow.com/api/signals.csv`
- **OpenAPI 3.1:** `GET https://signals.gitdealflow.com/api/openapi.json`
- **SSRN preprint:** https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6606558

---

## Complementary: the Scout Game

If you want to put your own eye on the line, there's a prediction game on top of the same dataset at [signals.gitdealflow.com/predict](https://signals.gitdealflow.com/predict?utm_source=github&utm_medium=readme&utm_campaign=mcp_server). Call which tracked startups raise a round in the next 6 months, earn points when your calls resolve, climb a public rank ladder from Curious to Oracle. Free tier: 3 predictions per month. Paid: 10 per month. Leaderboard: [signals.gitdealflow.com/leaderboard](https://signals.gitdealflow.com/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=mcp_server).

---

## Links

- Website: https://gitdealflow.com?utm_source=github&utm_medium=readme&utm_campaign=mcp_server
- Dashboard: https://signals.gitdealflow.com?utm_source=github&utm_medium=readme&utm_campaign=mcp_server
- Scout Game: https://signals.gitdealflow.com/predict?utm_source=github&utm_medium=readme&utm_campaign=mcp_server
- Leaderboard: https://signals.gitdealflow.com/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=mcp_server
- Chrome Extension (Momentum Badge): https://chrome.google.com/webstore/detail/...
- Email: signals@gitdealflow.com
- Telegram: https://t.me/gitdealflow
- SSRN: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6606558

---

## Related

- [GitDealFlow](https://gitdealflow.com) — startup engineering velocity dataset and tools
- [signals.gitdealflow.com](https://signals.gitdealflow.com) — full dashboard with interactive rankings, charting, and sector breakdowns
- [Momentum Badge (Chrome Extension)](https://chrome.google.com/webstore/detail/...) — see startup velocity on Crunchbase and Wellfound
- [Smithery registry](https://smithery.ai/server/kindrat86/vc-deal-flow-signal) — one-click MCP install
- [Glama A-tier listing](https://glama.ai/mcp/servers/kindrat86/mcp-deal-flow-signal)
- [MCP Registry](https://registry.modelcontextprotocol.io) — `io.github.kindrat86/vc-deal-flow-signal`

---

## Show what you built

If you ship something that calls this MCP server, the dataset, or the public signals JSON, drop the **Built-With badge** in your README — one line, permanent CDN-cached SVG, no signup:

```markdown
[![Built with @gitdealflow/mcp-signal](https://signals.gitdealflow.com/api/badge/built-with/svg?variant=long)](https://signals.gitdealflow.com/built-with)
```

Three variants (default, compact, long) and copy-paste snippets for HTML / BBCode at [signals.gitdealflow.com/built-with](https://signals.gitdealflow.com/built-with?utm_source=github&utm_medium=readme&utm_campaign=mcp_server). Ping `signals@gitdealflow.com` once you embed and we'll feature you on [/mirrors](https://signals.gitdealflow.com/mirrors?utm_source=github&utm_medium=readme&utm_campaign=mcp_server).

---

## License

MIT
