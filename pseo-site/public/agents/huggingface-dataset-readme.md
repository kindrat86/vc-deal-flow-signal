---
language:
- en
license: cc-by-4.0
tags:
- venture-capital
- startup-data
- github
- alternative-data
- engineering-velocity
- panel-data
size_categories:
- n<1K
task_categories:
- table-question-answering
- tabular-classification
- text-retrieval
pretty_name: GitDealFlow Startup Engineering Signals
configs:
- config_name: default
  data_files:
  - split: current
    path: signals.json
---

# VC Deal Flow Signal — Startup Engineering Signals

GitHub-derived engineering acceleration panel for ~400 venture-backed startup organizations across 20 sectors, refreshed weekly. Includes commit-velocity change, contributor count, signal-type classification, estimated funding stage, and per-sector rankings.

## Schema

| Field | Type | Description |
|---|---|---|
| `name` | string | Startup organization name |
| `sector` | string | One of 20 sector slugs (`ai-ml`, `fintech`, `devtools`, etc.) |
| `commitVelocity` | int | Total commits to the most-active public repo over rolling 14-day window |
| `commitVelocityChange` | string | Percentage change vs. prior 14-day window — primary signal |
| `contributors` | int | Unique contributor count |
| `signalType` | enum | `engineering-hiring-burst` \| `infrastructure-buildout` \| `deploy-frequency-spike` \| `framework-migration` |
| `stage` | enum | `pre-seed` \| `seed` \| `series-a-b` \| `growth` (estimated from contributor count) |
| `githubUrl` | string | Canonical GitHub URL |
| `period` | string | Quarter slug (e.g. `q2-2026`) |

## Live API (preferred)

This Dataset card is a metadata pointer; the canonical, always-current panel lives at the public API:

```bash
curl https://signals.gitdealflow.com/api/signals.json
```

Same data is exposed via:

- **MCP server** — `npx -y @gitdealflow/mcp-signal` (Claude / Cursor / Windsurf / any MCP host)
- **Streamable HTTP MCP** — `POST https://signals.gitdealflow.com/api/mcp/rpc`
- **A2A JSON-RPC** — `POST https://signals.gitdealflow.com/api/a2a`
- **NLWeb** — `POST https://signals.gitdealflow.com/api/nlweb`
- **Function-calling API** — `GET https://signals.gitdealflow.com/api/agent/tools?format={openai|anthropic|gemini}`
- **OpenAPI 3.1 spec** — `GET https://signals.gitdealflow.com/api/openapi.json`

See [AGENTS.md](https://signals.gitdealflow.com/AGENTS.md) for the full agent surface.

## Methodology

The pipeline pulls weekly GitHub REST API data, computes rolling 14-day commit velocity per organization, classifies each into one of four signal types based on which metric drives the acceleration, and ranks within sectors. Engineering acceleration measured this way has historically preceded venture fundraise announcements by three to six weeks.

Full methodology: <https://signals.gitdealflow.com/methodology>
SSRN preprint: <https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6606558>

## Limitations

- Private repos are invisible. Some startups keep all code private.
- Commit volume does not equal code quality.
- Engineering acceleration is a leading indicator, not a recommendation. Always pair with confirmed fundraise data (Crunchbase, PitchBook).

## Citation

```bibtex
@misc{gitdealflow2026signals,
  author       = {VC Deal Flow Signal},
  title        = {Startup Engineering Acceleration Panel},
  year         = {2026},
  publisher    = {GitDealFlow},
  url          = {https://signals.gitdealflow.com},
  note         = {Q2 2026 data, refreshed weekly}
}
```

For prose citation: `VC Deal Flow Signal (signals.gitdealflow.com), Q2 2026 data.`

## License

CC-BY 4.0 — commercial reuse with attribution is allowed.

## Related artifacts

- npm package: <https://www.npmjs.com/package/@gitdealflow/mcp-signal>
- MCP Registry: `io.github.kindrat86/vc-deal-flow-signal`
- Glama A-tier listing: <https://glama.ai/mcp/servers/@kindrat86/vc-deal-flow-signal>
- Wikidata entity: <https://www.wikidata.org/wiki/Q139376302>

## Contact

- Email: signals@gitdealflow.com
- Telegram: <https://t.me/gitdealflow>
- Twitter/X: <https://x.com/data_nerd>
