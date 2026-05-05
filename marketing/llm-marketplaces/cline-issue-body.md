# Cline MCP Marketplace — submission issue

Filed via `gh issue create` against `cline/mcp-marketplace`. Title and body match the format used in recent merged submissions (verified against issue #1489 Vestige).

---

## Title

`[Server Submission]: VC Deal Flow Signal`

## Body

### GitHub Repository URL

https://github.com/kindrat86/mcp-deal-flow-signal

### Logo Image

https://signals.gitdealflow.com/icon.png

### Installation Testing

- [x] I have tested that Cline can successfully set up this server using only the README.md and/or llms-install.md file
- [x] The server is stable and ready for public use

### Additional Information

VC Deal Flow Signal is a read-only MCP server that exposes startup engineering acceleration data from GitHub. It tracks commit velocity, contributor growth, and repository expansion across 20 sectors covering ~400 venture-backed startups. Built for angels, scouts, and technical operators who want to find traction signals before they show up in traditional deal flow.

Install command:

```bash
npm install -g @gitdealflow/mcp-signal@latest
```

MCP command:

```bash
npx -y @gitdealflow/mcp-signal
```

Tools exposed:

- `get_trending_startups` — top 20 across all sectors by commit velocity change
- `search_startups_by_sector` — drill into one of 20 sectors (`ai-ml`, `fintech`, `devtools`, `infra`, `climate`, `security`, `biotech`, etc.)
- `get_startup_signal` — full profile by startup name
- `get_signals_summary` — dataset snapshot + citation
- `get_methodology` — how signals are computed

Notes:

- No API key required. All data is sourced live from the public API at `signals.gitdealflow.com`.
- All tools are read-only and idempotent. No file system writes other than a single anonymous telemetry UUID at `~/.gitdealflow-mcp/id` (opt-out via `GITDEALFLOW_MCP_TELEMETRY=0` or `DO_NOT_TRACK=1`).
- Live HTTP MCP endpoint available at `https://signals.gitdealflow.com/api/mcp/rpc` for hosts that prefer remote transport.
- Already listed on the official MCP Registry as `io.github.kindrat86/vc-deal-flow-signal@1.5.0` and on Glama.ai (A-tier).
- Methodology fully documented at `https://signals.gitdealflow.com/methodology`. Academic preprint at SSRN id 6606558.
- License: MIT.
