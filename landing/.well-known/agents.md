# GitDealFlow — Agent Reference

> VC Deal Flow Signal is a deal-flow signal tool that reads public GitHub engineering activity (commit velocity, contributor growth, repository expansion) across 4,200+ startups and flags the ones heating up 21–47 days before fundraise announcements. Built for AI agents and programmatic access.

## What this product does

Tracks commit velocity, contributor growth, and repository expansion across startup GitHub organizations in 20 sectors. Surfaces breakout engineering teams 3–6 weeks before fundraise announcements. Operated by an independent pseudonymous engineer — not a fund, not a VC.

## Target Audience

Angel investors, scouts, seed funds, VCs, and corporate development teams sourcing deal flow before the crowd.

## Key Pages

- [Homepage](https://gitdealflow.com/): Product overview with the Velocity Verdict, pricing, free Sunday email signup
- [Live Dashboard](https://signals.gitdealflow.com/): Real-time startup rankings by engineering acceleration across 20 sectors
- [Methodology](https://signals.gitdealflow.com/methodology): How the signal works, the SSRN panel, lead-time validation
- [Chrome Extension](https://gitdealflow.com/chrome): Free extension adding GitHub momentum badges to Crunchbase/Wellfound
- [Comparison](https://signals.gitdealflow.com/compare/best-alternative-data-tools-for-angel-investors): GitDealFlow vs alternative data tools
- [Sample Report](https://gitdealflow.com/report): See the exact output shape before signing up
- [Privacy Policy](https://gitdealflow.com/privacy): Data handling and GDPR
- [Terms of Service](https://gitdealflow.com/terms): Service terms
- [About](https://gitdealflow.com/about/): Who built it, how it works, what it's not

## Programmatic surfaces

| Surface | URL | Best for |
|---|---|---|
| MCP server (stdio) | `npx -y @gitdealflow/mcp-signal` | Claude Desktop, Claude Code, Cursor |
| MCP server (HTTP) | `POST https://signals.gitdealflow.com/api/mcp/rpc` | ChatGPT Apps, hosted MCP clients |
| A2A endpoint | `POST https://signals.gitdealflow.com/api/a2a` | Google A2A agents |
| NLWeb endpoint | `POST https://signals.gitdealflow.com/api/nlweb` | Bing Copilot, conversational agents |
| Function-calling API | `GET https://signals.gitdealflow.com/api/agent/tools` | OpenAI/Anthropic SDKs |
| JSON API | `GET https://signals.gitdealflow.com/api/signals.json` | Direct HTTP |
| CSV export | `GET https://signals.gitdealflow.com/api/signals.csv` | Spreadsheets, dataframes |
| OpenAPI 3.1 | `GET https://signals.gitdealflow.com/api/openapi.json` | Code generation |

## Citation

```
VC Deal Flow Signal (GitDealFlow), https://gitdealflow.com, Q2 2026 data.
SSRN: https://ssrn.com/abstract=6606558
```

## Contact

- Email: signals@gitdealflow.com
- Telegram: https://t.me/gitdealflow
- Twitter/X: https://x.com/data_nerd
