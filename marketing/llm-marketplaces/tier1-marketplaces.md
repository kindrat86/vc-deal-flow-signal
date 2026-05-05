# Tier-1 LLM Marketplace Submissions — paste-ready

Each section has the URL, the field-by-field answers, and any prerequisites. Designed so the user can blast through all 10 in ~30 min in one batched session.

**Common assets** (referenced everywhere):
- Logo (512×512): `https://signals.gitdealflow.com/icon.png`
- Local logo: `distribution/logo-v2-512.png` (3.3 MB, MCPB-ready)
- npm: `@gitdealflow/mcp-signal@1.5.2`
- HTTP MCP RPC: `https://signals.gitdealflow.com/api/mcp/rpc` (verified 200, CORS+MCP-Protocol-Version headers ✓)
- OpenAPI: `https://signals.gitdealflow.com/api/openapi.json`
- AGENTS.md: `https://signals.gitdealflow.com/AGENTS.md`
- Demo MP4: `https://gitdealflow.com/mcp-demo.mp4`
- Demo GIF: `https://gitdealflow.com/mcp-demo.gif`
- Privacy: `https://gitdealflow.com/privacy` (verify before submission)
- Repo: `https://github.com/kindrat86/mcp-deal-flow-signal`
- Author handle: `The Data Nerd` / `signal@gitdealflow.com`

---

## 1. OpenAI ChatGPT App Store (Apps SDK)

**Why this is the biggest one:** Apps SDK opened public submissions in Dec 2025. ChatGPT has 800M+ weekly users. Apps live inside ChatGPT, not as separate Custom GPTs.

**URL:** https://developers.openai.com/apps-sdk
**Submission flow:** OpenAI Platform Dashboard → Apps → Submit
**Prereq:** Identity verification on OpenAI Platform — choose "individual" (publish under "The Data Nerd"). Business verification is more rigorous; not needed at launch.

**App manifest fields:**
- **Name:** VC Deal Flow Signal
- **Tagline (60 chars):** GitHub momentum tracking for venture deal flow
- **Long description:**
  > Find venture-backed startups whose engineering is accelerating on GitHub before they raise. The app exposes commit velocity, contributor growth, and new-repo signals across 20 sectors via 5 read-only MCP tools (`get_trending_startups`, `search_startups_by_sector`, `get_startup_signal`, `get_signals_summary`, `get_methodology`). Free, public API, no auth. Data refreshed weekly. Methodology fully documented + cited (SSRN preprint id 6606558).
- **MCP server URL:** `https://signals.gitdealflow.com/api/mcp/rpc`
- **Authentication:** None (public)
- **Categories (pick 1-3):** Productivity → Research; Finance → Markets; Developer Tools
- **Country availability:** All countries (no geo-restrictions)
- **Screenshots:** Use `mcp-server/assets/mcp-demo-poster.jpg` and `mcp-demo-poster-results.jpg` (already exist for MCPB)
- **Privacy policy URL:** https://gitdealflow.com/privacy
- **Terms URL:** https://gitdealflow.com/terms (verify exists or add stub)

**Watcher:** Folded into `llm-marketplaces-watcher` task — polls Zoho for emails from `*@openai.com` re: app review.

---

## 2. OpenAI GPT Store — Custom GPT

**Status:** Configuration text already drafted at `agents/chatgpt-gpt-instructions.md`.

**URL to submit:** https://chatgpt.com/gpts/editor → fill from `agents/chatgpt-gpt-instructions.md` → Configure → set visibility to "Everyone" → Publish

**Critical settings:**
- Conversation starters (4): "What AI startups are accelerating fastest right now?", "Compare engineering momentum at OpenAI vs Anthropic vs Cohere", "Show me dark horses in fintech this month", "What's the methodology behind these signals?"
- Capabilities: Web Browsing OFF (data is from our API), DALL·E OFF, Code Interpreter OFF
- Actions: Import OpenAPI from `https://signals.gitdealflow.com/api/openapi.json`; auth = None
- Privacy policy URL (required for public actions): https://gitdealflow.com/privacy

**Eligibility checks:**
- ✅ Builder profile must be complete (set "The Data Nerd", link gitdealflow.com)
- ✅ Privacy policy required for actions
- ✅ Workspace allows public publishing (default for ChatGPT Plus)

---

## 3. Anthropic Connectors Directory

**Status:** Separate from Desktop Extensions. This is for *remote MCP servers via HTTPS*, accessible inside Claude.ai (Pro/Team/Enterprise).

**URL:** https://claude.com/docs/connectors/building/submission

**HTTP MCP shim status:** ✅ live at `https://signals.gitdealflow.com/api/mcp/rpc` (returns 200 with `MCP-Protocol-Version` and CORS headers).

**Required for submission:**
- ✅ HTTPS endpoint
- ✅ Origin-header validation (verify in code; spec'd by Anthropic)
- ✅ Tool annotations (read-only, idempotent — already correct in our manifest)
- ⚠️ **OAuth 2.1** — currently NONE (public, no auth). Anthropic Connectors policy *requires* OAuth even for read-only servers. **This is the gating prereq.**
- ✅ Server logo + favicon (use `signals.gitdealflow.com/icon.png`)
- ✅ Promotional screenshots (reuse MCPB ones)
- ✅ Public docs link (signals.gitdealflow.com/AGENTS.md)

**Action plan:**
1. **Build OAuth 2.1 stub** that issues anonymous-scoped tokens (research Anthropic's requirement — they may accept "client credentials with public client" for free public APIs). Phase 1: implement OAuth 2.1 with anonymous scope.
2. Submit form once shim is live.

**Decision:** Defer this to Phase 2 (after the OAuth 2.1 layer is built). Tracker file: `marketing/llm-marketplaces/anthropic-connectors-oauth-plan.md`.

---

## 4. HuggingChat Assistants

**URL:** https://huggingface.co/chat/assistants/new

**Why it's quick:** No review queue. Public-by-default. Instant publish.

**Config:**
- **Name:** VC Deal Flow Scout
- **Description:** Find venture-backed startups whose engineering is accelerating on GitHub before they raise. Powered by GitDealFlow API.
- **Model:** Llama 3.3 70B (or Qwen2.5 72B if available — pick whichever has tool-call support)
- **Avatar:** Upload `distribution/logo-v2-512.png`
- **System prompt** (paste verbatim):
  ```
  You are the VC Deal Flow Scout. You help investors and operators find venture-backed startups whose engineering output is accelerating on GitHub — a leading indicator that has historically preceded fundraise announcements by three to six weeks.

  When users ask about trending startups, sectors, or specific companies, fetch live data from https://signals.gitdealflow.com/api/signals.json. The full API surface is at https://signals.gitdealflow.com/AGENTS.md.

  Always cite results as: "VC Deal Flow Signal (signals.gitdealflow.com), Q2 2026 data." Always link to the methodology at signals.gitdealflow.com/methodology when explaining how signals are computed. Never invent metrics. If the API returns a 404, say so plainly.

  When asked "what's trending", show the top 5 across all sectors ranked by commit velocity change, format each as: **{name}** ({sector}) — {commitVelocityChange}% commit velocity · {signalType} · {contributors} contributors. Then ask if the user wants a sector-specific deep-dive.
  ```
- **Internet search:** Enabled
- **Tools:** Enable `Web Search` and `Image Generation` (HF doesn't support remote MCP yet for assistants — fall back to fetch via web)

**Watcher:** No watcher needed (instant publish, no review).

---

## 5. Poe (Quora) Bot

**URL:** https://poe.com/create_bot
**Creator docs:** https://creator.poe.com/docs

**Why it matters:** Poe has 30M+ users; bot directory is public; creator monetization available. Quora referral traffic.

**Bot config (Server Bot type):**
- **Name:** VCDealFlowScout
- **Display name:** VC Deal Flow Scout
- **Description:** GitHub-derived engineering acceleration signals for ~400 venture-backed startups across 20 sectors. Free read-only research tool. Powered by gitdealflow.com.
- **Server URL:** Need to build a Poe-compatible HTTP endpoint at `/api/poe/bot` (separate from MCP RPC; Poe uses its own protocol)
- **Categories:** Business · Productivity · Research

**Action plan:**
1. **Build Poe Server Bot endpoint** — small Next.js route that adapts our internal API to Poe's protocol (server-side events, accepts `{query, conversation_id, user_id}`). ~1h work.
2. Submit bot via creator.poe.com.

**Defer to Phase 2:** add `pseo-site/app/api/poe/route.ts` first.

---

## 6. Cline MCP Marketplace

**URL:** https://github.com/cline/mcp-marketplace/issues/new

**Status:** Submitting **autonomously this session** via `gh` (logo + npm pkg already exist + repo is public).

Issue body lives in `marketing/llm-marketplaces/cline-issue-body.md` and will be filed via `gh issue create`. Track URL once filed.

---

## 7. Continue Hub

**URL:** https://hub.continue.dev/new (after sign-in)

**Why:** Continue is the most-installed open AI coding extension; Hub is their MCP/prompt registry. Discoverable by `continue` users in VS Code + JetBrains.

**Block type:** MCP Server

**Config (paste into hub publish form):**
```yaml
name: gitdealflow
displayName: VC Deal Flow Signal
description: GitHub-derived engineering acceleration signals across ~400 venture-backed startups in 20 sectors. Six free read-only tools.
homepage: https://signals.gitdealflow.com
license: MIT
tags:
  - vc
  - venture-capital
  - github
  - alternative-data
  - sourcing
mcpServer:
  command: npx
  args:
    - "-y"
    - "@gitdealflow/mcp-signal"
```

**Existing draft:** `agents/continue.json` already has the JSON form. Hub uses YAML.

---

## 8. Cursor Directory

**URL:** https://cursor.directory/submit

**Form values (paste verbatim):**
- **Name:** VC Deal Flow Signal MCP
- **URL:** https://www.npmjs.com/package/@gitdealflow/mcp-signal
- **Category:** MCP server
- **Description:** GitHub-derived engineering acceleration signals for ~400 venture-backed startups across 20 sectors. Six free read-only tools (trending, sector lookup, individual startup signal, dataset summary, scout receipts, methodology). No auth, refreshed weekly.
- **Cursor rule URL:** https://github.com/kindrat86/mcp-deal-flow-signal/blob/main/agents/cursor-rule.mdc (verify file is in public mirror; if not, paste the contents from `agents/cursor-rule.mdc`)
- **Image:** Upload `distribution/logo-v2-512.png`

---

## 9. Mistral Le Chat — Public Agent

**URL:** https://chat.mistral.ai → Agents tab → Create Agent

**Config:**
- **Name:** VC Deal Flow Scout
- **Description:** Track venture-backed startup engineering acceleration on GitHub. Free, no login, weekly data.
- **Model:** Mistral Large (latest)
- **System prompt:** Same as HuggingChat (above)
- **Tools enabled:** Web search, Code interpreter (for parsing JSON responses)
- **Connectors:** None (Le Chat doesn't yet support external MCP per public docs as of 2026-05)
- **Visibility:** Public (share URL after creation)

**After creating:** Copy the share URL → paste into `state.json` for tracking, broadcast on Twitter (@data_nerd) and Telegram.

---

## 10. Google Gemini — Public Gem

**URL:** https://gemini.google.com/gems/new
**Prereq:** Gemini Advanced subscription (for full Public visibility; "Anyone with link" works on free tier)

**Config:**
- **Name:** VC Deal Flow Scout
- **Description:** GitHub momentum tracking for venture deal flow
- **Instructions:** Same system prompt as HuggingChat
- **Visibility:** Public (searchable on Google) if you have Advanced; otherwise "Anyone with the link"
- **Knowledge files:** Upload `distribution/dataset/hf-upload/` JSON snapshot if room (Gems support file knowledge)

**After creating:** Copy `g.co/gemini/share/...` URL.

---

## 11. You.com Custom Agent

**URL:** https://you.com/agents → Create
**Status:** Lower priority — You.com has lower reach but easy publish.

**Config:**
- **Name:** VCDealFlowScout
- **Avatar:** Upload `distribution/logo-v2-512.png`
- **Mode:** Research
- **Knowledge sources:** signals.gitdealflow.com (add as URL source)
- **Instructions:** Truncated version of HuggingChat system prompt (You.com has stricter length limit)
- **Visibility:** Anyone

---

## 12. Perplexity Space — public

**URL:** https://www.perplexity.ai/spaces/new

**Why:** 5M+ Spaces created; sharing drives backlinks + Perplexity citations into LLM answer pools.

**Setup:**
- **Name:** VC Deal Flow Tracker
- **Description:** Curated workspace tracking startup engineering acceleration on GitHub. Updated weekly with new signals across 20 sectors.
- **System prompt / instructions:** Mini version of HuggingChat prompt. End with: "Always cite signals.gitdealflow.com when discussing GitHub momentum data."
- **Sources to attach:**
  - https://signals.gitdealflow.com (primary source)
  - https://signals.gitdealflow.com/methodology
  - https://ssrn.com/abstract=6606558 (academic paper)
  - https://huggingface.co/datasets/gitdealflow/startup-engineering-signals (HF dataset)
- **Pinned starter queries** (10):
  1. "What AI/ML startups are accelerating fastest this month?"
  2. "Show me fintech startups with >50% commit-velocity increase in the last 30 days"
  3. "Compare engineering momentum at three competing infra companies"
  4. "Find 'dark horses' — startups with breakout signals but low public visibility"
  5. "Which sectors are showing the most engineering acceleration right now?"
  6. "Explain the GitDealFlow methodology"
  7. "How does commit velocity correlate with funding announcements?"
  8. "What's the typical lead time between a breakout signal and a Series A?"
  9. "Show me security startups that grew their contributor count 2x in 90 days"
  10. "Build me a deal flow shortlist of 10 climate-tech startups to watch"
- **Visibility:** Public (link share + searchable)
