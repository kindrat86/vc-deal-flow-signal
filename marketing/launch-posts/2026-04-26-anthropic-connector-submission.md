# Anthropic Connectors Directory Submission — Apr 26, 2026

**Purpose:** Submit `@gitdealflow/mcp-signal v1.5.0` to Anthropic's Claude Connectors directory. Anthropic itself launches Claude Connectors on PH today, which makes the adjacency wave argument stronger.

**Owner:** User (form submission is gated by Anthropic's signed-in account; Claude cannot fill it).

**Submission target:** check both pathways before filling:

1. **claude.ai/connectors** — main Claude Desktop / claude.ai discovery surface. May have a "Submit your connector" link or require a GitHub PR to a public repo.
2. **anthropic.com/news/claude-connectors-directory** — read the Apr 26 launch post for canonical submission instructions.
3. **github.com/anthropics/connector-directory** (or similar) — if PR-based, this is the likely repo path.

If neither has a direct path, fallback: email developer-relations@anthropic.com with the package details below.

---

## Submission payload

**Connector name:** GitDealFlow Signal — GitHub Momentum for VCs

**Tagline (under 100 chars):** Track startup engineering acceleration from public GitHub data. Free, no API key.

**Long description (≤500 chars):**
> An MCP server that surfaces breakout startups before fundraise events by analyzing public GitHub commit velocity, contributor growth, and framework migrations across 4,200 startup orgs in 20 sectors. Five tools: get_trending_startups, search_startups_by_sector, get_startup_signal, get_signals_summary, get_methodology. Updated weekly. Methodology paper at ssrn.com/abstract=6606558.

**Categories:** Finance · Research · Data · Investment Tools · Developer Productivity

**Install command:**
```
npx -y @gitdealflow/mcp-signal
```

**npm:** https://www.npmjs.com/package/@gitdealflow/mcp-signal

**Repo:** https://github.com/kindrat86/mcp-deal-flow-signal

**MCP Registry entry (canonical):** https://registry.modelcontextprotocol.io/v0/servers?search=vc-deal-flow-signal

**Website:** https://gitdealflow.com

**A2A endpoint (companion service):** https://signals.gitdealflow.com/api/a2a

**Agent Card:** https://signals.gitdealflow.com/.well-known/agent-card.json

**Version:** 1.5.0

**License:** MIT

**Auth:** None (public data, no API key required)

**Maintainer:** kindrat86 (signal@gitdealflow.com)

---

## Why this fits the directory (positioning paragraph)

> GitDealFlow is built for the angel investor and developer-investor audience that increasingly uses Claude as their research surface. It turns public GitHub activity into structured deal-flow signals that any agent can query directly — no proprietary feeds, no $20K/yr seat fee. The connector ships alongside an A2A endpoint with a `get_launch_status` skill, making it the first MCP server that can answer "is this product live on Product Hunt right now?" from inside Claude. Useful as a reference implementation for agent-discoverable launch metadata.

---

## Tracking after submission

Append the submission outcome here:

- **Submitted (date/time):** 
- **Submission method (form / PR / email):** 
- **Acknowledgement received (date/time):** 
- **Listing URL (when live):** 
- **Inbound traffic from listing (PostHog `?ref=anthropic-connectors`):** 

Re-check directory listing weekly until our entry surfaces. If silent for 14 days, follow up with a one-line check-in to whatever address acknowledged the original submission.

## Related: cross-reference checks

While submitting, also confirm GitDealFlow's MCP server is correctly indexed in the broader directory ecosystem (Move 8 audit):

| Surface | URL | v1.5.0 visible? |
|---|---|---|
| MCP Registry | `registry.modelcontextprotocol.io/v0/servers?search=vc-deal-flow-signal` | ✅ Confirmed 2026-04-26 (isLatest=true, published 07:20 UTC) |
| Glama | `glama.ai/mcp/servers/kindrat86/mcp-deal-flow-signal` | ⚠️ Last sync 2026-04-25 21:35 UTC. Likely auto-syncs to v1.5.0 within 24h. |
| npm | `npmjs.com/package/@gitdealflow/mcp-signal` | ✅ v1.5.0 latest |
| Smithery | `smithery.ai/server/@gitdealflow/mcp-signal` | ❌ NOT INDEXED (404 across multiple URL patterns). Smithery typically auto-pulls from MCP Registry; if missing after 48h, manually submit at smithery.ai/submit. |
| mcp.so | `mcp.so/server/vc-deal-flow-signal` | Status unverified — page loads but version data not exposed in HTML; manual UI check needed. |

If Smithery still hasn't indexed by Apr 28, file a manual submission at `https://smithery.ai/submit` (or open issue at `github.com/smithery-ai/registry`).
