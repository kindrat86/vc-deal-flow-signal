# Drop-in coding-agent surfaces for GitDealFlow

Tiny config files that drop into popular coding-agent runtimes to surface the GitDealFlow MCP server, public APIs, and answer pages. Pick the one matching your editor / agent host.

| File | Use with |
|---|---|
| [`cursor-rule.mdc`](./cursor-rule.mdc) | Cursor, copy to `.cursor/rules/gitdealflow.mdc` |
| [`continue.json`](./continue.json) | Continue.dev, merge into `~/.continue/config.json` |
| [`aider.md`](./aider.md) | Aider, paste into `--read` or your repo's `CONVENTIONS.md` |
| [`claude-skill/`](../claude-skill/) | Claude Desktop / Claude Code, installable skill (already in repo) |

For all other MCP-compatible hosts (Claude Desktop, Windsurf, Zed, Cline, etc.), follow the standard MCP install pattern:

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

For non-MCP runtimes, see [AGENTS.md](../AGENTS.md), the same toolset is exposed via A2A, NLWeb, function-calling API, and OpenAPI 3.1 spec.
