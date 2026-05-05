# LLM Marketplaces — User-Click Checklist

Order: **fastest payoff first**. Estimated total time: 30-45 min for the whole batch.

For each row, full field-by-field answers are in [tier1-marketplaces.md](tier1-marketplaces.md). Once you submit, the watcher picks it up automatically — just paste back here the URL of the live listing (or the confirmation email subject) so I can add it to the tracks.

---

## ⚡ <2 min each — quick wins (do these first)

### ✅ HuggingChat — added as Custom MCP Server (2026-05-02)
- **What changed:** HuggingChat replaced "Assistants" with "MCP Servers" in their April 2026 redesign. The old `/chat/assistants/new` URL 404s. Custom MCP servers are now the equivalent surface.
- **Status:** GitDealFlow MCP server added to user `the-data-nerd`'s HuggingChat (Custom Servers (1) — "Connected", 6 tools, enabled). Verified end-to-end with a live prompt — model correctly discovered all 6 tools (`get_trending_startups`, `search_startups_by_sector`, `get_startup_signal`, `get_signals_summary`, `get_scout_receipts`, `get_methodology`) and called them.
- **Test conversation:** https://huggingface.co/chat/conversation/69f5a4dbe8a1d19b3daba541
- **Caveat:** Custom MCP servers are *personal config*, not a public catalog. Public discoverability via HuggingChat requires getting onto their **curated Base Servers list** (currently only 2: Exa Web Search and Hugging Face MCP). That's a partnership-style submission, not user-self-serve. **Tracked as deferred Tier-2 outreach** — pitch to HuggingChat product team once we have ≥10k MCP installs across other surfaces as social proof.

### ✅ Smithery.ai — LIVE + Verified + 98/100 (2026-05-02)
- **Listing:** https://smithery.ai/servers/kindrat86/vc-deal-flow-signal (canonical path is `/servers/` plural; `/server/` redirects)
- **Gateway:** `vc-deal-flow-signal--kindrat86.run.tools`
- **Inspect result:** SUCCESS in 10s — 6 tools, 5 prompts, 3 resources auto-discovered from `/.well-known/mcp/server-card.json`
- **Quality Score:** 98/100 (Naming 4.44pt deliberately skipped — would break existing client configs)
- **Visibility:** Public ✓ (already flipped)
- **Watcher:** track `smithery-vc-deal-flow-signal` added to [tools/llm-marketplaces-watcher/tracks.json](../../tools/llm-marketplaces-watcher/tracks.json) — polls Zoho for `*@smithery.ai` (featuring/trending notifications)

### ✅ Cursor Directory — FILED 2026-05-02 evening
- **Listing:** https://cursor.directory/plugins/vc-deal-flow-signal-mcp-1 ("Under review")
- **Path taken:** Manual submission at `/plugins/new` (Auto-scan from GitHub stuck — public mirror lacks Open Plugins manifest under `.cursor/`)
- **Components included:** Rule (`gitdealflow` — full cursor-rule.mdc content pasted) + MCP Server (`gitdealflow` — `npx -y @gitdealflow/mcp-signal` install JSON)
- **Skipped:** Logo upload (Chrome MCP `file_upload` returns "Not allowed" — can be added via the listing's edit screen later if needed)
- **Watcher:** `llm-marketplaces-watcher` polls Zoho for `*@cursor.directory` notifications

### ⏸ Continue Hub — DEPRECATED 2026-05-02 evening, recommend skip
- **URL:** https://hub.continue.dev (redirects to www.continue.dev/inbox; account is logged in as "MW My Workspace")
- **Status:** Re-verified 2026-05-02 evening via Chrome MCP. Continue.dev's **public Hub registry was deprecated in the Continuous AI pivot** — `https://www.continue.dev/hub?type=mcpServers` returns 500 ("Something broke. Our team has been notified.") even when authenticated. The new model has only:
  1. **Workspace integrations** (`/settings/integrations` → "Custom MCP Servers" → "Add MCP by URL") — private to your workspace, no public discoverability
  2. **Create-an-agent** (`/new`) — builds an agent that *uses* MCP tools, not a way to publish a server
- **Recommendation:** Skip. I'll add a weekly poll to `llm-marketplaces-watcher` that checks if `hub.continue.dev/hub?type=mcpServers` returns 200 again, and surface a re-submission task when the public registry comes back online.
- **Optional 30-second click** if you want it in your private MW workspace anyway: https://www.continue.dev/settings/integrations → "Add MCP by URL" → paste `https://signals.gitdealflow.com/api/mcp/rpc`. Zero public benefit.

### ✅ You.com Custom Agent — LIVE 2026-05-02 evening
- **Listing:** https://you.com/agents/user_mode_8dde2556-8bcc-45d9-8e5c-2ab7b56d8ae5 (owner: signal@gitdealflow.com / "The Data Nerd")
- **Visibility:** "Anyone with the link" — Can chat
- **Search:** Web search ON (You.com models call out via search to fetch from signals.gitdealflow.com per system prompt)
- **Smoke test:** "What AI/ML startups are accelerating fastest?" → agent picked "advanced" mode → workflow showed plan → researching steps included "Fetch the live startup signals dataset from https://signals.gitdealflow.com/api/signals.json" → API wiring confirmed
- **Path taken:** User signed in at you.com → I drove `/agents` → Create Agent modal → Name `VC Deal Flow Scout` (18/50), Description (116/200), Instructions (406/10000) per [USER-ACTION-2026-05-02-evening.md §4](USER-ACTION-2026-05-02-evening.md), Response model = Auto, Sources URL field didn't persist (acceptable — system prompt directs to API + web search is on), Share access = "Anyone with the link" / Can chat
- **Watcher:** TODO add `tracks.json` entry for `*@you.com` notifications

---

## 🟡 5-10 min each — needs prompt engineering or build

### ⚠️ Mistral Le Chat — CREATED + working, but PRIVATE on free tier (2026-05-02 evening)
- **Listing:** https://chat.mistral.ai/agents/0e7213f8-3214-4474-8318-148e1db9b0d7 (404s for everyone except The Data Nerd account)
- **Owner:** The Data Nerd / Le Chat Free
- **Status:** Agent SAVED with title, description, and full system prompt. Smoke test passed in preview pane: "trending startups in AI/ML" → "Here are the top 5 trending startups in AI/ML based on commit velocity change, according to the latest VC Deal Flow Signal data for Q2 2026: harvard-edge +55%, photoprism +36%, zapplyjobs -1%, ..." → confirms agent fetches signals.gitdealflow.com/api/signals.json correctly.
- **Public sharing BLOCKED on Le Chat Free:** "Access" dialog only offers Collaborators / Viewers / "Entire organization" toggle. Kebab menu offers only Duplicate / Delete. No public-link or "Anyone with link" option exists for free tier. Public agents appear to require **Le Chat Pro upgrade** (≈ €14.99/mo) or "La Plateforme" tier.
- **Your action (~2 min) IF you want public listing:** Upgrade to Le Chat Pro at chat.mistral.ai → re-open the agent → Access dialog should expose a public-link toggle → enable it → copy share URL → paste back here.
- **Defer recommendation:** Skip Pro upgrade for now (matches `feedback_paid_distribution_deferred.md` — paid distribution deferred until 500 paying subs OR earned Tier-1 citation). The agent stays usable as a personal tool from your account; revisit when Pro is justified.
- **Watcher:** TODO add tracks.json entry for `*@mistral.ai` notifications

### ☐ Google Gemini — Public Gem — needs anonymity-safe Google account
- **URL:** https://gemini.google.com → Gems → New (`/gems/new` direct route 404s)
- **Status:** Verified 2026-05-02 — gemini.google.com loads with a Google account avatar in the corner (avatar letter "T"). I deliberately did NOT proceed because I can't verify whether that account is your `signal@gitdealflow.com` brand identity vs a personal Google account, and posting a public Gem under your real-name personal Google account would violate the anonymity rule (per `feedback_anonymity_no_podcasts.md`).
- **Your action (~3 min):** First confirm which Google account is logged in. If it's a brand-safe one (or you create a fresh one for GitDealFlow), build the Gem with config from §10 of `tier1-marketplaces.md`. Set visibility "Anyone with the link" (free tier) or "Public" (Gemini Advanced).

### ☐ Perplexity Space (public) — Chrome MCP blocked, your hands needed
- **URL:** https://www.perplexity.ai/spaces
- **Status:** Verified 2026-05-02 — perplexity.ai is **blocked from Chrome MCP scripting by ExtensionsSettings policy** (per `feedback_perplexity_audit_blocked.md` — known limitation since April 2026).
- **Your action (~5 min):** Open https://www.perplexity.ai/spaces in your browser, sign in / sign up, create new Space with config from §12 of `tier1-marketplaces.md`. Pin all 10 starter queries.

### ☐ OpenAI GPT Store — Custom GPT (publish to "Everyone")
- **URL:** https://chatgpt.com/gpts/editor
- **Prereq:** ChatGPT Plus/Team/Enterprise + completed Builder profile + privacy policy URL on signals.gitdealflow.com
- **What:** Paste from `agents/chatgpt-gpt-instructions.md`. Configure Action with OpenAPI URL. Set visibility "Everyone".
- **Privacy gate:** ✅ verified — `https://gitdealflow.com/privacy` and `/terms` both return 200

---

## 🔵 30+ min each — has prerequisites I need to ship first (Phase 2)

These are blocked on engineering work I'll do this week before handing off:

### ⏸ OpenAI ChatGPT App Store (Apps SDK)
- **Blocker:** identity verification on OpenAI Platform Dashboard → choose "individual" → upload ID
- **Privacy / terms:** ✅ already live at `gitdealflow.com/privacy` + `/terms`
- **Then:** §1 of `tier1-marketplaces.md` for full submission.

### ☐ Anthropic Connectors Directory — UNBLOCKED 2026-05-02, ready to submit
- **OAuth status:** ✅ all infrastructure live in production (token endpoint, RFC 8414 metadata, RFC 6750 bearer validation on `/api/mcp/rpc`, all verified end-to-end)
- **Submission package:** Pre-filled fields + asset URLs + verification curl outputs at [distribution/anthropic-connectors-directory/SUBMISSION.md](../../distribution/anthropic-connectors-directory/SUBMISSION.md)
- **Your action (~5 min):** Open https://claude.com/docs/connectors/building/submission → sign in to Anthropic account → paste answers → upload assets → submit
- **Watcher:** Existing `anthropic-extension-watcher` task already polls Zoho for `*@anthropic.com` replies — will catch this submission's response automatically

### ✅ Poe Bot — LIVE 2026-05-02 evening
- **Listing:** https://poe.com/VCDealFlowScout (creator: @mkih6)
- **Server URL:** https://signals.gitdealflow.com/api/poe (Poe Server Bot v1; settings→JSON, query→SSE)
- **Reachability:** "Check successful. Your server is reachable." ✓
- **Smoke test:** "trending startups in AI/ML" → renders Top 5 with bold names, % commit velocity, signal type, contributors, citation footer
- **Path taken:** User signed in at poe.com/login → I drove poe.com/create_bot via Chrome MCP (Server bot type, name VCDealFlowScout, desc 394/4000 chars, access key auto-generated `Ur8GBu9lGBG0Ucv1Bq51MN7tTQs2zSUS`, visibility "Everyone", related-recommendations ON)
- **Required fixes during submission:** (a) `pseo-site` full prod deploy (cherry-pick infeasible — HEAD imports untracked WIP support files), (b) Poe protocol: `settings` request must return JSON not SSE, (c) `commitVelocityChange` is a string ("+142%"), `.toFixed` was crashing the query path
- **Watcher:** TODO add `tracks.json` entry for `*@poe.com` notifications

---

## What I've already filed autonomously (no clicks needed from you)

| Submission | Status | Reference |
|---|---|---|
| Anthropic Claude Desktop Extensions | ✅ submitted 2026-05-02 (you clicked Submit yourself, watcher monitoring) | [SUBMISSION.md](../../distribution/claude-desktop-extension/SUBMISSION.md) |
| Cline MCP Marketplace | ✅ submitted 2026-05-02 — issue [#1491](https://github.com/cline/mcp-marketplace/issues/1491) | watcher monitoring |
| CrewAI Tools | ✅ submitted 2026-05-02 — PR [crewAIInc/crewAI#5682](https://github.com/crewAIInc/crewAI/pull/5682) | watcher monitoring |
| OAuth 2.1 layer for `/api/mcp/rpc` | ✅ code shipped to repo (NOT deployed) — unblocks Anthropic Connectors directory | [pseo-site/app/api/oauth/](../../pseo-site/app/api/oauth/), [.well-known](../../pseo-site/app/.well-known/oauth-authorization-server/) |
| Poe SSE adapter route at `/api/poe` | ✅ code shipped to repo (NOT deployed) — unblocks Poe Bot submission | [pseo-site/app/api/poe/route.ts](../../pseo-site/app/api/poe/route.ts) |
| Anthropic Cookbook PR | ⏰ scheduled 2026-05-04 09:00 EEST | task `framework-pr-anthropic-cookbook` |
| LlamaHub Tool PR | ⏰ scheduled 2026-05-06 09:00 EEST | task `framework-pr-llamahub-tool` |
| Vercel AI SDK example PR | ⏰ scheduled 2026-05-08 09:00 EEST | task `framework-pr-vercel-ai-sdk` |
| **HF Space — VC Deal Flow Scout (DeepSeek)** | ✅ **LIVE 2026-05-02** — https://huggingface.co/spaces/the-data-nerd/vc-deal-flow-deepseek (RUNNING) | n/a |

## How the watcher hands signals back to you

- **Acceptance** → notification + celebration marker file in `marketing/`. You get pinged once per accepted listing.
- **Rejection** → suggested-fix file in `marketing/`. No auto-resubmit.
- **Open question email reply** → draft reply in `marketing/`. You review + send via Zoho.

---

## Optional Tier-2 (do later when you're bored or want to flex)

- **Make a public gist** of `agents/cursor-rule.mdc`, `agents/continue.json`, `agents/aider.md`, etc. — gives Twitter-shareable URLs.
- **Tweet the Cline marketplace acceptance** when it lands (draft will appear in `distribution/twitter-cline-acceptance.md`).
- **Cross-post HuggingChat assistant URL** on dev.to + LinkedIn once it's published.
- **Write a "GitDealFlow inside [Le Chat / Gemini / Perplexity]" 3-tweet mini-thread** for each public surface that goes live.
