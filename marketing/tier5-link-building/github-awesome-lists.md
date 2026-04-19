# GitHub Awesome-Lists — PR Targets

**Why these first:** one-time PR, permanent dofollow backlink, zero reply required. Highest ROI-per-hour in Tier 5.

**Pre-check before each PR:**
1. Read current CONTRIBUTING.md (format rules change)
2. Grep README for "gitdealflow" / "vc-deal-flow-signal" to avoid duplicate submission
3. Match the existing line format EXACTLY (alphabetical, markdown style, link casing)
4. Add one line only — don't also add decorative changes; reviewers reject scope-creep PRs

## Tier A — high activity, active maintainers

### 1. awesome-mcp-servers (punkpeye) ⭐ HIGHEST PRIORITY
- **Repo:** https://github.com/punkpeye/awesome-mcp-servers
- **Activity:** 5,913 commits, 737 open PRs, actively triaged
- **Status:** Already submitted — **awesome-mcp-servers PR #4933 in merge queue** (confirmed in memory 2026-04-18)
- **Action:** Monitor; no new PR needed

### 2. awesome-quant (wilsonfreitas)
- **Repo:** https://github.com/wilsonfreitas/awesome-quant
- **Activity:** 700+ commits, active maintainer
- **Section:** "Market Data & Data Sources" (best fit) or "Sentiment Analysis & Alternative Data"
- **List entry (ready to paste):**
  ```
  - [GitDealFlow](https://gitdealflow.com) — Alternative-data signal product ranking early-stage startups by GitHub stars-per-day, hiring velocity, and package-registry adoption. Free weekly signal report, Chrome extension, and MCP server for Claude.
  ```
- **PR title:** `Add GitDealFlow to Market Data & Data Sources`
- **PR body:**
  > Adding GitDealFlow as an alternative-data source for private-company / VC deal flow. Covers GitHub stars-per-day, hiring velocity, PyPI/npm install growth. Free signal report published weekly; MCP server (`@gitdealflow/mcp-signal` on npm) for agent access. Complementary to existing Preqin/ExtractAlpha-style sources but scoped to private markets.

### 3. awesome-data-engineering (igorbarinov)
- **Repo:** https://github.com/igorbarinov/awesome-data-engineering
- **Activity:** 14 open PRs, actively merging
- **Section:** "Workflow" or "Data Ingestion" (or "Datasets" if pitching the signal data itself)
- **List entry:**
  ```
  - [GitDealFlow MCP Server](https://www.npmjs.com/package/@gitdealflow/mcp-signal) — MCP server exposing VC deal-flow signals (GitHub momentum, hiring velocity, package-registry data) to LLM agents. Public weekly signal: https://gitdealflow.com/signals
  ```
- **PR title:** `Add GitDealFlow MCP server (VC deal-flow signals)`

### 4. jonathimer/awesome-oss-investors
- **Repo:** https://github.com/octolens/awesome-oss-investors (redirect from jonathimer)
- **Fit:** niche — list of VCs investing in commercial OSS. **Angle:** we're not an investor, but our signal product is OSS-focused. Worth checking if there's a "tools" section; if not, SKIP.
- **Action:** Open repo → grep for "tools" section → only PR if section exists.

## Tier B — medium activity, evaluate before PR

### 5. awesome-fintech (jplock)
- **Repo:** https://github.com/jplock/awesome-fintech
- **Note:** Skews to fintech companies (Plaid, Mercury, etc.), NOT VC tooling. May be off-topic. Check latest README before PR.
- **Memory cross-ref:** Memory says "Skip fintech.global" because ICP is strict fintech (banking/lending/payments). Same logic may apply here. **Only PR if list explicitly includes "investor tools" or "alt data" categories.**

### 6. moov-io/awesome-fintech
- **Repo:** https://github.com/moov-io/awesome-fintech
- **Note:** OSS-libraries focused. Our MCP server is closed-source, so likely off-topic. SKIP unless section explicitly supports SaaS.

### 7. 7kfpun/awesome-fintech
- **Repo:** https://github.com/7kfpun/awesome-fintech
- **Note:** Financial libraries / shiny things. Evaluate before PR.

### 8. tolkonepiu/best-of-mcp-servers
- **Repo:** https://github.com/tolkonepiu/best-of-mcp-servers
- **Note:** Ranked MCP list, updated weekly via automation — check if manual submissions are accepted or if it's auto-indexed from awesome-mcp-servers. Likely already auto-pulled once punkpeye PR merges.

## Tier C — low priority, skip for now

### thesurenk/awesome-venture-capital
- **Repo:** https://github.com/thesurenk/awesome-venture-capital
- **Issue:** Only 3 commits total, 0 open PRs — minimally maintained
- **Verdict:** SKIP. No authority signal → low backlink value.

### selcuke/venture-capital-firms-list, Fintech-startups-companies-list
- **Issue:** Lists of companies/firms, not tools. Off-topic for GitDealFlow (we're a tool, not an investor).
- **Verdict:** SKIP.

---

## PR submission checklist

Before opening any PR:

- [ ] Fork repo, create branch named `add-gitdealflow`
- [ ] Read CONTRIBUTING.md cover-to-cover (format conventions vary)
- [ ] Match exact format of surrounding lines (capitalization, trailing period, link style)
- [ ] Respect alphabetical ordering if used
- [ ] Keep PR scope to ONE added line — do not fix typos / reformat in same PR
- [ ] Write PR description that justifies editorial fit (see templates above)
- [ ] Link to npm page + live site in PR body for reviewer convenience
- [ ] Subscribe to PR notifications (reviewers often ask for tweaks)

## After PR is merged

1. Add merged PR URL to `tier5-log.md`
2. Note the category / section it landed in (informs future list pitches)
3. Check DA of the list repo's README rendering on github.io or similar (some awesome-lists have companion sites that are higher-DA)
