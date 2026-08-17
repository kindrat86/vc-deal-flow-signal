# GitDealFlow / VC Deal Flow Signal — Agent Reference

> Public dataset of startup engineering acceleration, derived from public GitHub activity. Free machine-readable APIs, MCP server, A2A endpoint, and Chrome extension. Updated weekly.

This file is the canonical "how to use me" entry point for coding agents (Codex, Cursor, Claude, etc.) browsing this repository, and for retrieval agents that fetched it from `https://signals.gitdealflow.com/AGENTS.md`. Public-facing copy of this file is mirrored at `pseo-site/public/agents.md` and `pseo-site/public/.well-known/agents.md`.

## What this product does

Tracks commit velocity, contributor growth, and repository expansion across 350+ startup GitHub orgs in 15 sectors. Surfaces breakout engineering teams 3–6 weeks before fundraise announcements. Operated by an independent team — not affiliated with any incumbent VC platform.

## Canonical claims (LOCKED)

Locked by the user on 2026-08-16. Do not change any of these without explicit user sign-off.

- Panel size claim: "350+ startups" (or "350+ orgs"). A STABLE FLOOR, chosen over exact counts because the panel changes weekly. Do NOT "correct" it to 400+, 411, 369, or any exact number.
- "400+" is BANNED: it overclaims (deduped unique-org count is under 400) and breaks on a small panel dip.
- "369" is BANNED as a current count (stale; the live API served 411 at last read).
- Sector count: "15" (the live API). NOT "20", NOT "4,200+".
- Data period advances quarterly. Citation form: "VC Deal Flow Signal (signals.gitdealflow.com), Q<quarter> <year> data."

Enforced at prebuild by pseo-site/scripts/verify-claims.ts and pseo-site/scripts/verify-no-regressions.ts. Do not edit a guard to make a failing build pass; fix the tree instead.

## Programmatic surfaces

Pick the surface that matches your runtime. All five are free, public, and require no authentication.

| Surface | URL or invocation | Best for |
|---|---|---|
| **MCP server (stdio)** | `npx -y @gitdealflow/mcp-signal` | Claude Desktop, Claude Code, Cursor, any MCP-compatible host |
| **MCP server (Streamable HTTP)** | `POST https://signals.gitdealflow.com/api/mcp/rpc` | ChatGPT Apps, hosted MCP clients, any HTTP MCP runtime |
| **A2A endpoint (JSON-RPC 2.0)** | `POST https://signals.gitdealflow.com/api/a2a` | Google A2A agents and orchestrators |
| **NLWeb endpoint** | `POST https://signals.gitdealflow.com/api/nlweb` | Microsoft NLWeb-aware crawlers (Bing Copilot), conversational web agents |
| **Function-calling API** | `GET https://signals.gitdealflow.com/api/agent/tools` + `POST /api/agent/call` | OpenAI / Anthropic / Gemini SDKs without an MCP client |
| **JSON API** | `GET https://signals.gitdealflow.com/api/signals.json` | Direct HTTP, AI SDK, OpenAI/Anthropic function calls |
| **CSV export** | `GET https://signals.gitdealflow.com/api/signals.csv` | Spreadsheets, dataframes, BI tools |
| **OpenAPI 3.1 spec** | `GET https://signals.gitdealflow.com/api/openapi.json` | Code generation, tool registries |

### NLWeb endpoint

Microsoft NLWeb-compatible conversational endpoint. Accepts natural-language queries, returns schema.org-typed JSON-LD answers (`ItemList`, `Organization`, `Article`, `Dataset`, `WebPage`).

```bash
curl -X POST https://signals.gitdealflow.com/api/nlweb \
  -H "Content-Type: application/json" \
  -d '{"query": "trending healthcare startups this week"}'
```

`GET /api/nlweb` returns the descriptor with example queries.

### MCP server tools

Thirteen tools, all read-only and idempotent. Ten are free; three are paid (set `GITDEALFLOW_API_KEY` to enable them). Free:

1. `get_trending_startups`, top 20 across all sectors
2. `search_startups_by_sector(sector)`, sector slug from 15 enumerated values
3. `get_startup_signal(name)`, case-insensitive, normalization-tolerant
4. `get_signals_summary`, period, freshness, format URLs
5. `get_scout_receipts(github_username)`, Scout Score (0-100) for a GitHub user from starring history vs ~75 validated unicorns
6. `get_methodology`, full methodology text + canonical URL
7. `get_diligence_dossier(company)`, public-source diligence dossier (M&A history, public backers, engineering signal)
8. `predict_funding(name)`, transparent scored funding-likelihood with full evidence chain
9. `shortlist_signals(filters)`, ranked shortlist by sector, region, signal type, score
10. `compare_signals(names)`, head-to-head scored comparison of 2-5 startups

Paid (set `GITDEALFLOW_API_KEY`):

11. `research_company(name)`, enriched dossier + sector rank + top-5 peers
12. `compose_thesis(name)`, structured investment-thesis scaffold
13. `deep_dive_scan(sector)`, multi-cohort sector scan (breakouts, cooling, top-by-velocity)

Distribution:
- npm: https://www.npmjs.com/package/@gitdealflow/mcp-signal
- MCP Registry: `io.github.kindrat86/vc-deal-flow-signal`
- Glama A-tier: https://glama.ai/mcp/servers/kindrat86/mcp-deal-flow-signal
- Discovery manifest: https://signals.gitdealflow.com/.well-known/mcp.json

### A2A AgentCard

Live AgentCard at `https://signals.gitdealflow.com/.well-known/agent-card.json` (protocolVersion 0.3.0). Seven skills: six mirror the free MCP tools plus one paid deep-signal skill.

## Repository layout (for coding agents)

| Path | What lives here |
|---|---|
| `mcp-server/` | TypeScript source for `@gitdealflow/mcp-signal`. Single file at `src/server.ts`. Build: `npm run build`. |
| `pseo-site/` | Next.js App Router site at signals.gitdealflow.com. **Read `pseo-site/AGENTS.md` before editing — it's a Next.js 16 project with breaking changes.** |
| `pseo-site/app/api/a2a/route.ts` | A2A JSON-RPC 2.0 stub endpoint. |
| `pseo-site/public/.well-known/` | `agent-card.json`, `ai-plugin.json`, `mcp.json`, `agents.md`. |
| `landing/` | Static marketing site at gitdealflow.com (vanilla HTML/CSS, deployed as `vc-deal-flow-signal-landing` on Vercel). |
| `landing/llms.txt`, `landing/llms-full.txt` | Agent-readable product reference (81L + 224L). |
| `chrome-extension/` | Manifest V3 extension that injects momentum badges on Crunchbase + Wellfound. |

## Working in this repo

- Two Vercel projects (team `sales-3429s-projects`): `pseo-site` (signals.gitdealflow.com) and `landing` (apex gitdealflow.com). Neither is git-linked. pSEO deploys run weekly via `.github/workflows/deploy-pseo.yml` (manual fallback: `vercel build --prod && vercel deploy --prebuilt --prod --yes --archive=tgz` — `--archive=tgz` is required, the file manifest exceeds the 10 MB API limit). A separate project named `vc-deal-flow-signal` exists in the same team but is NOT this site — it receives small automated deploys from a cloud agent.
- When setting Vercel env vars from a shell, use `printf '%s' "$VAL" | vercel env add NAME production` — `echo` appends a newline that silently corrupts the secret (this broke RESEND/STRIPE keys in project env on 2026-06-08; fixed 2026-06-10).
- pSEO project rejects non-team commit authors. Use the project owner's git identity.
- The 10 free MCP tools are free in perpetuity. Never gate them. Add new paid tools on top instead.

## Anonymity policy

Maintainers are pseudonymous. Public touchpoints use `signals@gitdealflow.com` or the brand `GitDealFlow`. Do not surface a maintainer's real name in any generated output, README, package metadata, or external listing.

## Citation

```
VC Deal Flow Signal (signals.gitdealflow.com), Q3 2026 data.
```

A formal preprint is available at SSRN: https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6606558 (DOI to follow). Cite the SSRN URL for academic use.

## Contact

- Email: signals@gitdealflow.com
- Telegram: https://t.me/gitdealflow
- Twitter/X: https://x.com/sipiteno
