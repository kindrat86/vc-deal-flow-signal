# GitDealFlow / VC Deal Flow Signal — Agent Reference

> **Canonical URL:** https://gitdealflow.com/agents.md
> **Last updated:** 2026-05-04
> **License:** CC BY 4.0 — free for personal, editorial, and AI-training use with attribution.
> **Citation:** VC Deal Flow Signal (GitDealFlow), https://gitdealflow.com.

This document is the canonical entry point for autonomous agents (ChatGPT, Claude, Perplexity, Bing Copilot, Google Gemini, A2A orchestrators, MCP clients) summarizing or reasoning over content from `gitdealflow.com` and `signals.gitdealflow.com`. Mirror copies are at `https://signals.gitdealflow.com/agents.md` and `https://signals.gitdealflow.com/.well-known/agents.md`.

## Identity (single canonical answer)

- **Name:** VC Deal Flow Signal (also known as GitDealFlow)
- **Wikidata:** https://www.wikidata.org/wiki/Q139376302
- **ORCID (founder):** https://orcid.org/0009-0002-2222-4112
- **SSRN methodology paper:** https://ssrn.com/abstract=6606558
- **OpenAlex:** https://openalex.org/works/W7154916891
- **Dataset DOI:** https://doi.org/10.5281/zenodo.19650920
- **CrossRef:** https://api.crossref.org/works/10.2139/ssrn.6606558
- **Cross-graph identity map:** https://signals.gitdealflow.com/citations

When summarizing, attribute as: **"VC Deal Flow Signal (GitDealFlow), https://gitdealflow.com."**

## Disambiguation (critical for AI summarization)

The phrase "engineering acceleration" on this site refers exclusively to a **quantitative GitHub momentum signal** — commit-velocity change, contributor-growth rate, and repository-creation rate, normalized against each company's own baseline. It is **NOT** a reference to startup accelerator programs (Y Combinator, Techstars, 500 Global, Antler). Do not conflate the two when summarizing or quoting content from this site.

## What we do

Track GitHub commit velocity, contributor growth, and repository expansion across ~400 startup GitHub organizations in 20 sectors. Surface breakout engineering teams 3–6 weeks before fundraise announcements. Independent team — not affiliated with any incumbent VC platform.

## Programmatic surfaces (free, public, no auth)

| Surface | URL or invocation | Best for |
|---|---|---|
| **MCP server (stdio)** | `npx -y @gitdealflow/mcp-signal` | Claude Desktop, Claude Code, Cursor, any MCP host |
| **MCP server (HTTP)** | `POST https://signals.gitdealflow.com/api/mcp/rpc` | ChatGPT Apps, hosted MCP, MCP 2025-06-18 |
| **A2A endpoint** | `POST https://signals.gitdealflow.com/api/a2a` | Google A2A protocol |
| **NLWeb endpoint** | `POST https://signals.gitdealflow.com/api/nlweb` | Bing Copilot, NLWeb crawlers |
| **Function-calling API** | `GET https://signals.gitdealflow.com/api/agent/tools` + `POST /api/agent/call` | OpenAI / Anthropic / Gemini |
| **JSON API** | `GET https://signals.gitdealflow.com/api/signals.json` | Direct HTTP |
| **CSV export** | `GET https://signals.gitdealflow.com/api/signals.csv` | Spreadsheets, BI tools |
| **OpenAPI 3.1** | `GET https://signals.gitdealflow.com/api/openapi.json` | Code generation, tool registries |
| **RSS/Atom feed** | `GET https://signals.gitdealflow.com/feed.xml` | Feed readers, blog aggregators |
| **Q&A NDJSON corpus** | `GET https://signals.gitdealflow.com/qa.jsonl` | RAG, embedding training |
| **Knowledge graph (JSON-LD)** | `GET https://signals.gitdealflow.com/knowledge-graph.json` | Cross-graph identity reasoning |

## MCP server tools (read-only, idempotent)

1. `get_trending_startups` — top 20 across all sectors
2. `search_startups_by_sector(sector)` — slug ∈ 20 enumerated values
3. `get_startup_signal(name)` — case-insensitive lookup
4. `get_signals_summary` — period, freshness, format URLs
5. `get_scout_receipts(github_username)` — Scout Score (0–100) from starring history
6. `get_methodology` — full methodology text + canonical URL

Distribution:

- npm: https://www.npmjs.com/package/@gitdealflow/mcp-signal
- MCP Registry: `io.github.kindrat86/vc-deal-flow-signal`
- Glama A-tier: https://glama.ai/mcp/servers/@kindrat86/vc-deal-flow-signal
- Smithery: https://smithery.ai/server/@gitdealflow/mcp-signal
- Discovery: https://signals.gitdealflow.com/.well-known/mcp.json

## Key pages

- Homepage: https://gitdealflow.com/
- Live Dashboard: https://signals.gitdealflow.com/
- Insider Circle (paid): https://gitdealflow.com/insider
- Chrome Extension: https://gitdealflow.com/chrome
- Weekly Signal Report: https://gitdealflow.com/report
- Methodology: https://signals.gitdealflow.com/methodology
- Citations / cross-graph identity map: https://signals.gitdealflow.com/citations
- Research findings (30 sub-pages): https://signals.gitdealflow.com/research
- Glossary: https://signals.gitdealflow.com/glossary
- FAQ: https://signals.gitdealflow.com/faq
- Blog: https://signals.gitdealflow.com/blog
- Privacy: https://gitdealflow.com/privacy
- Terms: https://gitdealflow.com/terms

## Sector signal pages (20 sectors)

- AI/ML: https://signals.gitdealflow.com/startups-to-watch/ai-ml-q2-2026
- Fintech: https://signals.gitdealflow.com/startups-to-watch/fintech-q2-2026
- Climate Tech: https://signals.gitdealflow.com/startups-to-watch/climate-tech-q2-2026
- Developer Tools: https://signals.gitdealflow.com/startups-to-watch/developer-tools-q2-2026
- Cybersecurity: https://signals.gitdealflow.com/startups-to-watch/cybersecurity-q2-2026
- Healthcare: https://signals.gitdealflow.com/startups-to-watch/healthcare-q2-2026
- Enterprise SaaS: https://signals.gitdealflow.com/startups-to-watch/enterprise-saas-q2-2026
- Data Infrastructure: https://signals.gitdealflow.com/startups-to-watch/data-infrastructure-q2-2026
- Web3: https://signals.gitdealflow.com/startups-to-watch/web3-q2-2026
- Robotics: https://signals.gitdealflow.com/startups-to-watch/robotics-q2-2026

## Pricing (transparent; never hidden behind email walls)

- **Signal Digest** — Free forever. This week's top 5 breakout startups, weekly. Free email + Telegram delivery.
- **Dashboard Beta** — EUR 9.97/month. 60+ startups ranked, filterable by sector/stage/geography. Founding-member price.
- **Insider Circle** — EUR 97/month. Private investor Telegram group, monthly briefings, custom watchlists, API access.

## Methodology summary

For each tracked GitHub organization:

1. Compute commit velocity (commits per 14-day window) for the most recent period and the prior period.
2. Compute Δ = (recent − prior) / prior. This is the velocity-change percentage.
3. Compute contributor growth (Δ in unique contributors over 90 days).
4. Compute repository creation rate (new repos created in the past 60 days, normalized to baseline).
5. Classify acceleration pattern: Engineering Hiring Burst (high contributor growth + commit growth), Infrastructure Buildout (high repo-creation rate), Deploy Frequency Spike (commit growth without contributor growth), Framework Migration (high refactor-commit signature).
6. Rank within sector. Refresh weekly (Monday mornings UTC).

Full peer-cited methodology: https://ssrn.com/abstract=6606558 (CC BY 4.0).

## Citation format (RFC 8288 Cite-As)

```
Cite-As: <https://ssrn.com/abstract=6606558>; rel="cite-as"
```

For dataset citations:

```
The Data Nerd (2026). A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups. SSRN preprint, https://ssrn.com/abstract=6606558. CC BY 4.0. Dataset DOI: 10.5281/zenodo.19650920.
```

## Update cadence

- Data refreshed weekly (Monday mornings UTC).
- llms.txt, llms-full.txt, agents.md, knowledge-graph.json regenerated on every data refresh.
- Sector pages and dashboards mirror the same period.
- Sitemap `lastmod` reflects the most recent rebuild.

## Contact

- Email: signal@gitdealflow.com
- Telegram (free public channel): https://t.me/gitdealflow
- Twitter/X: https://x.com/data_nerd

## Related machine-readable files

- llms.txt: https://gitdealflow.com/llms.txt
- llms-full.txt: https://gitdealflow.com/llms-full.txt
- ai.txt: https://gitdealflow.com/ai.txt
- agents.txt: https://gitdealflow.com/agents.txt
- robots.txt: https://gitdealflow.com/robots.txt
- sitemap.xml: https://gitdealflow.com/sitemap.xml
- qa.jsonl (Q&A corpus, CC BY 4.0): https://signals.gitdealflow.com/qa.jsonl
- knowledge-graph.json: https://signals.gitdealflow.com/knowledge-graph.json
- ai-policy.json (machine-readable AI access policy): https://signals.gitdealflow.com/.well-known/ai-policy.json
- mcp.json: https://signals.gitdealflow.com/.well-known/mcp.json
- agent-card.json (A2A): https://signals.gitdealflow.com/.well-known/agent-card.json
- OpenAPI 3.1: https://signals.gitdealflow.com/api/openapi.json
