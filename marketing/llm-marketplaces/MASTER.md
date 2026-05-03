# LLM Marketplace Submission Plan — 2026-05-02

**Goal:** Get GitDealFlow into every consumer LLM product where users go to find tools/agents/connectors. The Anthropic Desktop Extensions submission opened the door — this is the rest of the surface.

**Scope:** Consumer LLM products (where buyers/scouts/devs actually chat) + agent framework integrations (where dev-investors live). Excludes pure MCP catalogues already covered in `distribution/agent-registries-2026-04-26.md`.

**Triage rule (per memory `feedback_idea_triage_rule.md`):** Each row is Tier 1 (do now) / Tier 2 (do this week) / Tier 3 (creative/long-tail).

---

## Tier 1 — High-leverage, real submission surface, do this week

| Product | Surface | Submission method | Auth gate | Owner | Asset path | Watcher |
|---|---|---|---|---|---|---|
| **OpenAI ChatGPT App Store** | Apps SDK directory | developers.openai.com/apps-sdk + identity verification | User (OpenAI Platform login + business/individual verification) | claude (manifest) → user (submit) | `openai-app/` | TBD |
| **OpenAI GPT Store** | Custom GPT publish to "Everyone" | chatgpt.com/gpts/editor → Publish | User (ChatGPT Plus/Team/Enterprise) | claude (already drafted in `agents/chatgpt-gpt-instructions.md`) → user (submit) | TBD |
| **Anthropic Connectors Directory** | Remote MCP via HTTPS+OAuth | claude.com/docs/connectors/building/submission | User (consent + assets upload) | claude (HTTP shim + manifest) → user (submit) | shared with `anthropic-extension-watcher` |
| ~~**HuggingChat Assistants**~~ → **HuggingChat Custom MCP Server** | Personal config (not public catalog; Assistants deprecated April 2026) | huggingface.co/chat → MCP Servers → Add Server | User (HF account) | ✅ DONE 2026-05-02 (added by Claude via Chrome MCP for `the-data-nerd`) | n/a — public listing requires partnership pitch to HF |
| **Poe Bots (Quora)** | Marketplace + creator monetization | creator.poe.com → Create Bot | User (Poe creator account) | claude (server URL handler + bot config) → user (create) | n/a (instant publish) |
| **Cline MCP Marketplace** | GitHub issue submission | github.com/cline/mcp-marketplace/issues | None — GitHub repo + 400×400 logo | claude (full submission) | watcher polls issue thread |
| **Smithery.ai** | Hosted MCP catalog (auto-discovers via `/.well-known/mcp/server-card.json`) | smithery.ai/new | User (Google/GitHub OAuth) | claude (submission package) → user (paste URL) | shared `llm-marketplaces-watcher` (`*@smithery.ai`) |
| **Continue Hub** | MCP server + assistant publish | hub.continue.dev/new | User (Continue Hub login) | claude (block draft) → user (publish) | n/a |
| **Cursor Directory** | Web form | cursor.directory/submit | User (web form) | claude (form fill instructions) → user | n/a |
| **Mistral Le Chat Agent** | Public agent share URL | chat.mistral.ai → New Agent → Share | User (Mistral account) | claude (system prompt) → user (create) | n/a |
| **Google Gemini Gem (public)** | g.co/gemini/share/... or fully Public Gem | gemini.google.com → Gems → New | User (Google account, Gemini Advanced for full) | claude (instructions) → user (create) | n/a |

## Tier 2 — Indirect / creative angles, this week

| Channel | Play | Why it works | Owner |
|---|---|---|---|
| **OpenAI Cookbook** | PR an investor-research notebook using GPT-5 + GitDealFlow API | High DA backlink; lands GitDealFlow in OpenAI's official examples; dev-investor audience | claude (notebook + PR) → user (push from gh) |
| **Anthropic Cookbook** | Same with Claude + MCP | Same | claude (notebook + PR) |
| **Vercel AI SDK examples** | PR an example using AI SDK + our MCP HTTP endpoint | AI SDK is the most-installed agent SDK; example dir is a star magnet | claude (PR draft) |
| **CrewAI Tools repo** | PR `gitdealflow_tool.py` to `crewAIInc/crewAI-tools` | CrewAI has a published tool catalog | claude (PR) |
| **AutoGen examples** | PR notebook to `microsoft/autogen` | Microsoft's repo has 35k+ stars | claude (PR) |
| **DSPy** | PR a `GitDealFlowSignature` example | Stanford/research crowd; LLM evals | claude (PR) |
| **Pydantic AI** | PR an example to `pydantic/pydantic-ai` | Hot framework; type-safe agents | claude (PR) |
| **HF Space — DeepSeek demo** | "DeepSeek Investor Briefing" Space using DeepSeek-V3 + MCP | Open-source LLM × open MCP narrative; HF discoverability; signals to DeepSeek's training crawlers | claude (Space build) → user (HF account) |
| **HF Space — Mistral demo** | Same with Mistral 7B | Mistral-EU narrative; second free hosting surface | claude (Space build) |
| **Perplexity Space — public** | "VC Deal Flow Tracker" curated Space with 10 starter queries pinned | 5M+ Spaces created; sharing drives backlinks + Perplexity citations | claude (queries + structure) → user (create) |
| **You.com Custom Agent** | Public Agent "VCDealFlowScout" | Underutilized but real share surface | claude (config) → user (create) |
| **LlamaHub Tool** | Already drafted in agent-registries doc; PR to `run-llama/llama_index` | Established Llama ecosystem | claude (PR — already drafted) |

## Tier 3 — Creative + indirect; ship-and-forget

| Channel | Play |
|---|---|
| **xAI Grok via X** | Post weekly "Signal of the Week" tweets that name-check Grok ("@grok what do you think of this acceleration pattern?") to seed Grok's X-context loop. Already partially covered by @data_nerd Twitter strategy |
| **DeepSeek crawler exposure** | Already covered by AGENTS.md + llms.txt + 30 SSRN-cited Q&A sub-pages from disambiguation chain |
| **Kagi Lens — VC research** | Build a custom Kagi Lens prefiltered on github.com + tracked-startup blogs; share the URL | 
| **n8n custom node** | Publish `n8n-nodes-gitdealflow` to npm + community node catalog |
| **Bolt.new / v0.dev / Replit Agent** | One-pager AGENTS.md tells these agents how to consume our API directly; no marketplace submission needed |
| **Dust.tt** | Enterprise-only sales path; defer to outbound when we have a target customer |
| **Windsurf MCP** | Cascade auto-discovers via the MCP Registry entry we already have; explicit submission flow not public |

## Tier 4 — Skip / not actionable

- **Inflection Pi** — defunct
- **Character.AI** — wrong category
- **Phind** — already on skip list (`reference_skip_list.md`)
- ~~**Smithery.ai** — already skipped (HTTP transport gap)~~ → **MOVED TO TIER-1 READY** 2026-05-02. HTTP MCP RPC + OAuth + `server-card.json` all live. Submission package: [distribution/smithery-submission/SUBMISSION.md](../../distribution/smithery-submission/SUBMISSION.md). User OAuth + form submit at https://smithery.ai/new (~3 min).
- **Grok official extensions marketplace** — does not exist as of 2026-05-02

---

## What I did autonomously (status as of 2026-05-02)

| # | Task | Status | Reference |
|---|---|---|---|
| 1 | Master tracker doc | ✅ done | this file |
| 2 | Tier-1 paste-ready answers for 12 marketplaces | ✅ done | [tier1-marketplaces.md](tier1-marketplaces.md) |
| 3 | USER-CLICKS handoff doc | ✅ done | [USER-CLICKS.md](USER-CLICKS.md) |
| 4 | Tier-2 framework PR plans | ✅ done | [tier2-framework-prs.md](tier2-framework-prs.md) |
| 5 | Generic watcher (GitHub issues + email) | ✅ live, 2x/day | [tools/llm-marketplaces-watcher/](../../tools/llm-marketplaces-watcher/) |
| 6 | Cline MCP Marketplace submission | ✅ filed | [cline/mcp-marketplace#1491](https://github.com/cline/mcp-marketplace/issues/1491) |
| 7 | CrewAI Tools PR | ✅ filed | [crewAIInc/crewAI#5682](https://github.com/crewAIInc/crewAI/pull/5682) |
| 8 | OAuth 2.1 stub (unblocks Anthropic Connectors) | ✅ **DEPLOYED + LIVE** 2026-05-02 | [/.well-known/oauth-authorization-server](https://signals.gitdealflow.com/.well-known/oauth-authorization-server) + [/api/oauth/token](https://signals.gitdealflow.com/api/oauth/token) + Bearer-token validation wired into `/api/mcp/rpc` (anonymous still allowed for backward compat) |
| 9 | Poe SSE adapter route (unblocks Poe bot) | ✅ **DEPLOYED + LIVE** 2026-05-02 | [/api/poe](https://signals.gitdealflow.com/api/poe) returns service info; POST handles Poe Server Bot v1 protocol |
| 9b | Anthropic Connectors Directory submission package | ✅ ready, awaiting user form submit | [distribution/anthropic-connectors-directory/SUBMISSION.md](../../distribution/anthropic-connectors-directory/SUBMISSION.md) |
| 10 | mcp.so directory submission | ✅ filed [chatmcp/mcpso#2201](https://github.com/chatmcp/mcpso/issues/2201) | watcher monitoring |
| 11 | `/.well-known/mcp/server-card.json` endpoint (Smithery + universal scanners) | ✅ DEPLOYED LIVE | [signals.gitdealflow.com/.well-known/mcp/server-card.json](https://signals.gitdealflow.com/.well-known/mcp/server-card.json) |
| 12 | HF Space "VC Deal Flow Scout — DeepSeek Edition" | ✅ **LIVE 2026-05-02** | https://huggingface.co/spaces/the-data-nerd/vc-deal-flow-deepseek (runtime: RUNNING, hardware: cpu-basic) |
| 13 | Public mirror polish: 12 GitHub topics + v1.5.2 release | ✅ DONE 2026-05-02 | [kindrat86/mcp-deal-flow-signal](https://github.com/kindrat86/mcp-deal-flow-signal) topics + [v1.5.2 release](https://github.com/kindrat86/mcp-deal-flow-signal/releases/tag/v1.5.2) |
| 14 | llms.txt updated with all OAuth + server-card endpoints | ✅ DEPLOYED LIVE | [signals.gitdealflow.com/llms.txt](https://signals.gitdealflow.com/llms.txt) — "MCP Server" section now multi-host with all 5 endpoints |
| 15 | IndexNow ping for new endpoints | ✅ DONE — HTTP 200 | 7 URLs submitted (all `.well-known` + `/api/*` + `/llms*.txt`) |
| 16 | Smithery submission package (FLIP from Tier-4 skip → Tier-1 ready) | ✅ done 2026-05-02 evening | [distribution/smithery-submission/SUBMISSION.md](../../distribution/smithery-submission/SUBMISSION.md) — awaiting user OAuth + paste at smithery.ai/new (~3 min) |
| 16b | **Smithery LIVE + Verified + 98/100** 2026-05-02 | ✅ published, Public, Verified, Quality 98/100 — Inspect SUCCESS, 6 tools / 5 prompts / 3 resources auto-discovered | [smithery.ai/servers/kindrat86/vc-deal-flow-signal](https://smithery.ai/servers/kindrat86/vc-deal-flow-signal) (gateway: `vc-deal-flow-signal--kindrat86.run.tools`). Naming 4.44pt skipped (would break existing client configs). |
| 17 | Anthropic Desktop Extensions support follow-up email draft | ✅ drafted 2026-05-02 evening, NOT SENT | [distribution/claude-desktop-extension/anthropic-support-followup-draft.md](../../distribution/claude-desktop-extension/anthropic-support-followup-draft.md) — preemptive; sanity-rail still fires 2026-05-04 |
| 18 | Cursor Directory plugin submission | ✅ filed 2026-05-02 evening — "Under review" | [cursor.directory/plugins/vc-deal-flow-signal-mcp-1](https://cursor.directory/plugins/vc-deal-flow-signal-mcp-1) — Manual path (Auto-scan stuck because public mirror lacks Open Plugins manifest); 2 components: Rule (cursor-rule.mdc) + MCP Server (gitdealflow). Logo skipped (Chrome MCP file_upload "Not allowed"; can be added via /edit later). |
| 19 | Block Goose extensions PR | ✅ filed 2026-05-03 — OPEN | [aaif-goose/goose#8974](https://github.com/aaif-goose/goose/pull/8974) — Adds entry to `documentation/static/servers.json` (60→61 entries). Mirrors AgentQL/Tavily npx-stdio pattern. Watcher polls. block/goose was renamed to aaif-goose/goose (43.7k stars). |
| 20 | Raycast MCP Registry PR | ✅ filed 2026-05-03 — OPEN | [raycast/extensions#27618](https://github.com/raycast/extensions/pull/27618) — Appends to `extensions/model-context-protocol-registry/src/registries/builtin/entries.ts`. Surfaces in the in-Raycast MCP Registry browser on every Mac running v1.98+. |
| 21 | /integrations/agent-runtimes hub page | ✅ shipped 2026-05-03 (uncommitted, awaiting deploy) | `pseo-site/app/integrations/agent-runtimes/page.tsx` — Single hub for Cursor, Cline, Goose, OpenHands, Aider (via mcpm-aider), AiderDesk, Raycast. Copy-paste install snippets per runtime + per-runtime status badges + JSON-LD WebPage/FAQPage/ItemList. Indexed via /integrations card. Continue.dev intentionally skipped per memory `feedback_continue_hub_deprecated_2026_05_02.md`. |
| 22 | Cross-runtime distribution sweep — config-only targets verified | ✅ done 2026-05-03 | OpenHands has NO marketplace (per-user `~/.openhands/mcp.json`); Aider has NO native MCP (issue #2525 still open — bridge via mcpm-aider); AiderDesk has NO catalog (Settings → Agent → MCP Servers → paste JSON). All three documented in /integrations/agent-runtimes hub instead of fake submissions. |
| 23 | Public mirror README — agent-runtimes section + 5 marketplace badges | ✅ MERGED 2026-05-03 | [kindrat86/mcp-deal-flow-signal#7](https://github.com/kindrat86/mcp-deal-flow-signal/pull/7) — content now LIVE on github.com/kindrat86/mcp-deal-flow-signal main. 7 visible badges (npm, MCP Registry, Smithery 98/100, Cursor Directory, Goose PR #8974, Raycast PR #27618, plus the existing Scout Score + Commit Momentum). Verified live via `curl raw.githubusercontent.com/.../README.md`. |
| 24 | Blog post: Install in Any Agent Runtime | ✅ LIVE 2026-05-03 | [/blog/install-vc-deal-flow-signal-mcp-in-any-agent-runtime](https://signals.gitdealflow.com/blog/install-vc-deal-flow-signal-mcp-in-any-agent-runtime) — companion tutorial post (~900 words), copy-paste install snippets per runtime, FAQs covering Continue.dev deprecation. Indexed in /blog and /sitemap/content.xml. |
| 25 | npm package republished v1.5.3 (README-only patch) | ✅ LIVE on npm 2026-05-03 | [npmjs.com/package/@gitdealflow/mcp-signal/v/1.5.3](https://www.npmjs.com/package/@gitdealflow/mcp-signal/v/1.5.3) — bumps the npm-rendered README to match the public mirror (now 12 install paths). Tarball SHA `6a98057ac3b02cf46bc8406e9418043849cc7e86`. **MCP Registry republish blocked** — JWT expired, requires interactive `mcp-publisher login github` (per memory `feedback_mcp_publisher_jwt_8d.md`). |
| 26 | Bluesky + Mastodon queue entries for hub announcement | ✅ queued 2026-05-03 | id `015-agent-runtimes-hub-2026-05-03` in both `tools/bluesky/post-queue.json` and `tools/mastodon/post-queue.json`. Bluesky: 249/300 chars; Mastodon: 493/500 chars. Fires on next daily-engage cron (Bluesky 17:00 EEST, Mastodon 17:05 EEST). |
| 27 | CrewAI tracker reclassified — REDIRECTED, not rejected | 🔄 redirected 2026-05-03 | PR #5682 closed by maintainer with link to docs.crewai.com/en/guides/tools/publish-custom-tools — re-submit via custom-tools mechanism (separate arc). |
| 10 | Anthropic Cookbook PR | ⏰ scheduled 2026-05-04 09:00 EEST | task `framework-pr-anthropic-cookbook` |
| 11 | LlamaHub Tool PR | ⏰ scheduled 2026-05-06 09:00 EEST | task `framework-pr-llamahub-tool` |
| 12 | Vercel AI SDK example PR | ⏰ scheduled 2026-05-08 09:00 EEST | task `framework-pr-vercel-ai-sdk` |

## Deferred (no autonomous path; needs user account / ChatGPT Plus / etc.)

- HuggingChat / Cursor / Continue / You.com / Le Chat / Gemini / Perplexity / OpenAI GPT Store — see [USER-CLICKS.md](USER-CLICKS.md). Total user time ~30-45 min batched.
- OpenAI Apps SDK — needs identity verification (only the user can do this)
- OpenAI Cookbook PR — needs OPENAI_API_KEY for live notebook testing; defer until that's added or user submits without testing.
- DSPy / AutoGen / Pydantic AI — defer until first 3 framework PRs land (avoids spamming pattern across multiple repos in same week).

## What needs your hands later (one batched session, ~30 min)

The handful of click-required items will be batched into a single `marketing/llm-marketplaces/USER-CLICKS.md` checklist when artifacts are ready. Auth-gated submissions only — most of which take <2 min each once the artifact is prepped.
