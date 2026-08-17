# The 6 tools inside the VC Deal Flow Signal MCP server — a 5-minute tutorial

**Target:** dev.to (tag: #mcp #claude #ai #startups)

---

## The 6 tools inside the VC Deal Flow Signal MCP server

You can install a free MCP server right now that gives Claude (or Cursor) the ability to query live startup GitHub momentum data. No API key, no signup. Six read-only tools.

```bash
npx -y @gitdealflow/mcp-signal
```

Here's what each tool does and how to use it in practice.

---

### 1. `get_trending_startups` — top 20 across all sectors

```
You: "Which startups are accelerating fastest this week?"
Claude (via MCP): [returns top 20 ranked by commit velocity change]
```

The primary ranking signal is 14-day commit velocity change vs prior 14-day window. Surfaced weekly from 350+ tracked orgs.

---

### 2. `search_startups_by_sector(sector)` — drill into one vertical

15 sector slugs: `healthcare`, `edtech`, `ecommerce-infrastructure`, `supply-chain`, `web3`, `enterprise-saas`, `data-infrastructure`, `robotics`, `legal-tech`, `hr-tech`, `proptech`, `agtech`, `gaming`, `space-tech`, `social-community`.

```
You: "Show me space-tech startups with momentum this week"
Claude: [returns ranked list for that sector]
```

---

### 3. `get_startup_signal(name)` — deep-dive on one company

Case-insensitive, normalization-tolerant. Returns the full signal profile: commit velocity, contributor count, repo expansion, signal type (breakout / acceleration / steady / cooling), and stage estimate.

```
You: "Tell me about Verce's GitHub activity"
Claude: [returns Verce's signal profile with velocity change, contributor graph, signal classification]
```

---

### 4. `get_signals_summary` — meta info

Period coverage, freshness (last Monday refresh), format URLs (JSON, CSV, OpenAPI spec).

```
You: "How fresh is this data?"
Claude: "Updated every Monday ~09:00 UTC. Full methodology at /methodology."
```

---

### 5. `get_scout_receipts(github_username)` — taste metric

Grades any GitHub user's public starring history against ~75 validated unicorns. Returns a 0–100 Scout Score with rank (Curious → Oracle) and the top 8 early calls.

```
You: "What's tj's Scout Score?"
Claude: [returns Holowaychuk's score, rank, and earliest validated star calls]
```

---

### 6. `get_methodology` — how it's computed

Returns the full methodology text: what's measured, how signal types are classified, the 219-startup validation panel, and the statistical basis for the 21–47 day lead-time claim. SSRN-indexed, CC BY 4.0.

```
You: "How do you compute the engineering acceleration signal?"
Claude: [returns full methodology with citation]
```

---

### Why this matters for AI-assisted VC sourcing

Most VC deal-flow tools require a browser, a login, and a human reading a dashboard. This MCP server makes the same dataset queryable from inside your IDE or chat app — no context switch.

**Use case 1 — Morning brief:** "Good morning Claude. Pull this week's trending startups, filter to seed-stage, and cross-reference against my portfolio overlap list."

**Use case 2 — Due diligence:** "I'm looking at a fintech called Stripe-adjacent. Run get_startup_signal, get their commit trajectory, and compare it against the methodology's 219-startup panel baseline."

**Use case 3 — Scout sourcing:** "Find me GitHub users with Oracle-tier Scout Scores in the AI/ML sector. Their new stars are a leading indicator of the next breakout."

---

### Install

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

Add to `claude_desktop_config.json` or Cursor's MCP settings. Restart. That's it.

- npm: https://www.npmjs.com/package/@gitdealflow/mcp-signal
- Glama A-tier: https://glama.ai/mcp/servers/kindrat86/mcp-deal-flow-signal
- MCP Registry: `io.github.kindrat86/vc-deal-flow-signal`
- Discovery manifest: https://signals.gitdealflow.com/.well-known/mcp.json

**All six tools are free in perpetuity.** No API key, no rate limit for read-only queries.
