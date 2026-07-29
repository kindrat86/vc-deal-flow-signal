# VC Deal Flow Signal — Startup Engineering Acceleration Dataset

> **Public dataset · MCP server · Free tools** — Track breakout startup engineering teams before fundraise announcements, purely from public GitHub activity.

[![npm](https://img.shields.io/npm/v/@gitdealflow/mcp-signal?color=blue)](https://www.npmjs.com/package/@gitdealflow/mcp-signal)
[![npm downloads/week](https://img.shields.io/npm/dw/@gitdealflow/mcp-signal)](https://www.npmjs.com/package/@gitdealflow/mcp-signal)
[![HuggingFace Dataset](https://img.shields.io/badge/HuggingFace-Dataset-yellow)](https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal)
[![Kaggle](https://img.shields.io/badge/Kaggle-Dataset-blue)](https://kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal)
[![Zenodo](https://img.shields.io/badge/Zenodo-19650920-blue)](https://zenodo.org/records/19650920)
[![SSRN](https://img.shields.io/badge/SSRN-6606558-red)](https://ssrn.com/abstract=6606558)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC_BY_4.0-lightgrey)](https://creativecommons.org/licenses/by/4.0/)
[![MCP Registry](https://img.shields.io/badge/MCP-Registry-purple)](https://glama.ai/mcp/servers/@kindrat86/vc-deal-flow-signal)

---

## 🚀 What This Is

A **free, open dataset** of engineering-velocity signals across **324+ venture-backed startups** in **15 sectors**. Updated weekly from public GitHub activity.

**The core insight:** When a startup's commit velocity suddenly 3×'s and contributor count doubles, that startup is likely raising within 3–6 weeks — and the data was public the whole time.

| Surface | Link / Command | Best For |
|---|---|---|
| **Live Dashboard** | [signals.gitdealflow.com](https://signals.gitdealflow.com) | Browse all sectors and startups |
| **JSON API** | `GET https://signals.gitdealflow.com/api/signals.json` | Direct HTTP / AI SDKs |
| **CSV export** | `GET https://signals.gitdealflow.com/api/signals.csv` | Spreadsheets, dataframes |
| **MCP server (stdio)** | `npx -y @gitdealflow/mcp-signal` | Claude Desktop, Cursor |
| **MCP server (HTTP)** | `POST https://signals.gitdealflow.com/api/mcp/rpc` | ChatGPT, hosted MCP |
| **A2A endpoint** | `POST https://signals.gitdealflow.com/api/a2a` | Google A2A agents |
| **NLWeb endpoint** | `POST https://signals.gitdealflow.com/api/nlweb` | Bing Copilot |
| **npm package** | `@gitdealflow/mcp-signal` | MCP-compatible hosts |
| **SSRN Preprint** | [ssrn.com/abstract=6606558](https://ssrn.com/abstract=6606558) | Methodology & validation panel |

---

## 🆓 Free Tools

### 🔭 [Scout Score](https://gitdealflow.com/scout)
Enter any GitHub username → get a 0–100 score based on how many unicorns they starred *before* the funding/acquisition event. Backwards-looking "proof of taste" from public star history.

### ⚡ [StartUp Grader](https://gitdealflow.com/grader)
Enter any GitHub org → instant Engineering Health Score with breakdown (commit velocity, contributor growth, signal quality).

### ⚔️ [Compare Startups](https://gitdealflow.com/compare)
Head-to-head engineering velocity comparison. Shareable URLs hash-encoded for SEO.

### 🧩 [Embeddable Widget](https://gitdealflow.com/widget)
Free iframe showing top 5 trending startups by velocity. Embed on any blog → permanent backlink.

### 📊 [Deal Flow Score](https://gitdealflow.com/dealflow-score)
VC pipeline efficiency calculator with shareable results.

---

## 📦 Dataset

Available under **CC BY 4.0** on all major platforms:

| Platform | URL |
|----------|-----|
| HuggingFace | [the-data-nerd/vc-deal-flow-signal](https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal) |
| Kaggle | [thedatanerd2026/vc-deal-flow-signal](https://kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal) |
| Zenodo | [Record 19650920](https://zenodo.org/records/19650920) |
| data.world | [thedatanerd2026/vc-deal-flow-signal](https://data.world/thedatanerd2026/vc-deal-flow-signal) |
| CSV API | [api/signals.csv](https://signals.gitdealflow.com/api/signals.csv) |
| JSON API | [api/signals.json](https://signals.gitdealflow.com/api/signals.json) |

**Startup fields:** `name`, `description`, `stage`, `geography`, `commitVelocity14d`, `commitVelocityChange`, `contributors`, `contributorGrowth`, `newRepos`, `signalType`, `githubUrl`, `websiteUrl`, `sector`

---

## 🤖 MCP Server

6 free, read-only tools:

| Tool | Description |
|------|-------------|
| `get_trending_startups` | Top 20 across all sectors |
| `search_startups_by_sector(sector)` | Filter by sector (15+ values) |
| `get_startup_signal(name)` | Get signal data for one startup |
| `get_signals_summary` | Period, freshness, format URLs |
| `get_scout_receipts(github_username)` | Compute Scout Score (0-100) |
| `get_methodology` | Full methodology text + canonical URL |

```bash
# Quick start
npx -y @gitdealflow/mcp-signal
```

```bash
# Or HTTP
curl -X POST https://signals.gitdealflow.com/api/mcp/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get_trending_startups","arguments":{}}}'
```

---

## 📊 State of Startup Engineering Q3 2026

[Read the full report →](https://gitdealflow.com/state-of-startup-engineering-2026-q3)

Key findings:
- **324+ startups** tracked across **15 sectors**
- **Deploy frequency spikes** and **engineering hiring bursts** dominate acceleration signals
- Most accelerated startup: **+1,600% commit velocity increase** in 14 days
- **24%** of startups show deploy frequency spike signal type

---

## 📚 Research

A formal SSRN preprint validates the methodology on a 219-startup panel:
- **Median lead time:** 31 days between signal spike and fundraise announcement
- **Range:** 21–47 days depending on sector and stage
- **Citation:** `VC Deal Flow Signal (signals.gitdealflow.com), Q3 2026 data.`

[Read the preprint →](https://ssrn.com/abstract=6606558)

---

## 🌐 Architecture

This monorepo contains:

| Path | What |
|------|------|
| `pseo-site/` | Next.js App Router site at [signals.gitdealflow.com](https://signals.gitdealflow.com) |
| `landing/` | Static marketing site at [gitdealflow.com](https://gitdealflow.com) |
| `mcp-server/` | TypeScript MCP server (`@gitdealflow/mcp-signal`) |
| `chrome-extension/` | Manifest V3 extension for Crunchbase + Wellfound |
| `brand/` | Brand assets, logos, screenshots |

---

## 📈 Growth

- **2,165** startup profile pages with Organization + Product schema
- **1,161** content pages (blogs, guides, comparisons)
- **605** sector pages | **115** stage×sector crossings
- **15** data-driven sector landing pages on apex domain
- **22** interactive tools deployed on gitdealflow.com
- **3** weekly cron jobs (Telegram, X/Twitter, RSS)
- **3+** viral loops (badges, embeds, comparisons)
- **15** signal types captured from public GitHub events

---

## 📝 Citation

```bibtex
@misc{vc-deal-flow-signal-2026,
  title = {VC Deal Flow Signal: Startup Engineering Acceleration Dataset},
  author = {{The Data Nerd}},
  year = {2026},
  howpublished = {\url{https://signals.gitdealflow.com}},
  note = {CC BY 4.0. SSRN Preprint: \url{https://ssrn.com/abstract=6606558}}
}
```

---

## License

Dataset: **CC BY 4.0** — Free to use, share, and adapt with attribution.

Code: **MIT** — Free to modify and distribute.

---

<div align="center">
  <a href="https://gitdealflow.com">gitdealflow.com</a> ·
  <a href="https://signals.gitdealflow.com">signals.gitdealflow.com</a> ·
  <a href="https://signals.gitdealflow.com/methodology">Methodology</a> ·
  <a href="https://ssrn.com/abstract=6606558">SSRN</a>
</div>
