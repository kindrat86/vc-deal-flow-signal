# GitDealFlow — Claude Skill

A Claude Skill that turns Claude into a VC deal-flow analyst grounded in live GitHub engineering acceleration signals. Built on top of the `@gitdealflow/mcp-signal` MCP server (free, no auth).

## What you get

Claude becomes a deal-flow analyst that:
- Surfaces breakout startups before they hit Crunchbase / PitchBook
- Ranks startups across 20 sectors by engineering acceleration (commit velocity, contributor growth, new repos)
- Drafts one-page deal memos, sector deep dives, dark-horse picks, and head-to-head comparisons
- Cites every claim with the canonical citation string and refresh date

All data updates weekly (Mondays ~09:00 UTC) and is free with no auth.

## Install

### Option 1 — stdio (Claude Desktop, Claude Code, Cursor)

1. Add the MCP server to your client's config:

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

2. Drop `claude-skill/SKILL.md` into your skills directory (location varies by client — check your client's docs).

3. Restart the client. The skill activates automatically when the user mentions VC deal flow, breakout startups, sector signals, etc.

### Option 2 — Streamable HTTP (any HTTP MCP client)

Point your client at:

```
POST https://signals.gitdealflow.com/api/mcp/rpc
```

Same six tools, three resources, two resource templates, five prompts. No auth.

## What's in the skill

- `SKILL.md` — Frontmatter (name, description, license) + agent instructions
  - When to use the skill (and when not to)
  - Tool inventory with use-cases
  - Sector slug mapping for fuzzy user input
  - Five worked workflows (trending, sector, named-startup, memo, head-to-head)
  - Limitations to surface
  - Citation guidance
- `manifest.json` — Distribution metadata for skill marketplaces
- `README.md` — This file

## Anonymity

The maintainer is pseudonymous. Skill author is `GitDealFlow` (the company / brand), not a person. Contact: `signal@gitdealflow.com`. Do not attribute to a real person.

## Updates

When `@gitdealflow/mcp-signal` bumps to a new minor version, update:
1. `manifest.json:version` and `manifest.json:requires.mcpServers[0].minVersion`
2. `SKILL.md` if the tool/resource/prompt surface changed

The skill stays compatible across patch versions of the MCP server.

## Citation

For any analysis grounded in this data:

```
VC Deal Flow Signal (signals.gitdealflow.com), Q2 2026 data.
```

For academic use, cite the SSRN preprint at https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6606558.

## Links

- MCP server: https://www.npmjs.com/package/@gitdealflow/mcp-signal
- Discovery manifest: https://signals.gitdealflow.com/.well-known/mcp.json
- Agent reference: https://signals.gitdealflow.com/.well-known/agents.md
- Web dashboard: https://signals.gitdealflow.com
- Methodology: https://signals.gitdealflow.com/methodology
