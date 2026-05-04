# A2A Directory Submissions

**Status:** Stub agent shipped + DEPLOYED 2026-04-26. Live and verified.
**AgentCard:** https://signals.gitdealflow.com/.well-known/agent-card.json (HTTP 200, ~4.1 KB)
**A2A endpoint:** https://signals.gitdealflow.com/api/a2a (JSON-RPC 2.0, `message/send` only)
**Tier:** 3 (passive presence + "first VC signal A2A agent" PR angle).
**Note on fintech:** the data file lists 20 sectors but `fintech` has 0 period snapshots, so it's filtered out at runtime. AgentCard description was tightened post-deploy to point clients at the discovery mechanism (`get_signals_summary` or invalid-slug error response) rather than enumerating all 20 — keeps A2A clients out of the failure mode. The MCP server's hardcoded enum has the same issue but that's pre-existing scope, not this work.

## Why we shipped this
Per analysis 2026-04-26: full A2A build is wrong-audience for developer-investor (Claude/Cursor users prefer MCP). Stub published anyway because:
- ~2 hrs of work, zero ongoing maintenance
- Low directory bar for early-mover claim
- Same 5 skills as MCP server, no separate data layer

## Submission targets

### Done (2026-04-26 autonomous batch)
- [x] **a2aregistry.org** (`prassanna-ravishankar/a2a-registry`) — POSTed `wellKnownURI` to `/api/agents/register`, got HTTP 201. Registry ID: `4eb0310e-5c8b-4e07-9fbd-6f7d86db553b`. They auto-fetch the AgentCard and run a 30-min health-check loop. Initial uptime % is 0 because the warmup hadn't run when we registered — should populate naturally. No further action.
- [x] **inference-gateway/awesome-a2a** — opened [PR #3](https://github.com/inference-gateway/awesome-a2a/pull/3) under a new "Finance & Investment" section. Mirrors the merged awesome-mcp-servers PR #4933 pattern. Per the awesome-* silent-drop rule: verify our entry is on the rendered main-branch README a few days after merge.

### Skipped (structural mismatch, not bandwidth)
- [x] **ai-boost/awesome-a2a** — biggest list by stars but has no "Agents" section, only Implementations / Libraries / Tools / Tutorials / Demos. Our agent is a vertical-specific service, not an A2A library or tool. Skipped per directory-strategy memory (avoid structural mismatches).

### Pending (needs user manual auth — un-automatable)
- [ ] **www.a2a-registry.org** (`A2ARegistry/GlobalA2ARegistry`) — different registry from a2aregistry.org despite the close name. Requires Developer Console signup + DNS or GitHub identity verification. Account is the gate; no API to register without it. ~10 min once user logs in via Google or GitHub at https://www.a2a-registry.org/console.
- [ ] **agentic.directory** — fetch returned 403; form layout couldn't be inspected from CLI. User to visit https://agentic.directory and submit the AgentCard URL when convenient.

### Queued for Monday review (smaller awesome-* lists)
- [ ] `isekOS/awesome-a2a-agents` — specifically "showcase interoperable agent systems"
- [ ] `pab1it0/awesome-a2a` — second-largest
- [ ] `forgewebO1/Awesome-A2A` — smaller, skim first to confirm fit
- [ ] `caramaschiHG/awesome-ai-agents-2026` — broader AI agents list, not pure A2A — lower fit

### Tier 3b — opportunistic (gated on PR #3 merge OR www.a2a-registry.org listing)
- [ ] Tweet from @data_nerd referencing the AgentCard URL — ~1 short tweet
- [ ] Company-page LinkedIn post — counts toward weekly Dream 100 cadence, not separate
- [ ] One-line "what's new" footer in next Signal of the Week digest

## Marketing artifacts shipped 2026-04-26 (Russell + Greg synthesis)

After consulting brunson-architect (Russell) and greg-isenberg-distribution-2026 (Greg), shipped:

### Live on production
- [x] **Cornerstone blog post** `/blog/a2a-launched` — Russell's epiphany-bridge structure: "I made my VC deal flow callable by Claude this weekend." Cliffhanger to /predict for the value-ladder funnel. KeyStats card in metadata. ~1500 words. ([signals.gitdealflow.com/blog/a2a-launched](https://signals.gitdealflow.com/blog/a2a-launched))
- [x] **/a2a-demo interactive playground** — Russell's #5. 5-mode tab UI (trending / by sector / lookup / summary / methodology), live JSON-RPC POST to /api/a2a, request+response panels, "Plug it into your runtime" code snippets, share card link, full-profile link. The page header has the meme banner. ([signals.gitdealflow.com/a2a-demo](https://signals.gitdealflow.com/a2a-demo))
- [x] **/api/og/signal-card** — Greg's #1 viral artifact. PNG (1200×630) generated from live data. Defaults to current top-trending startup; accepts `?name=X` to target a specific one. Footer is the meme: "Crunchbase API: $20K/yr. GitDealFlow A2A: free." Auto-cached 10 min. ([signals.gitdealflow.com/api/og/signal-card](https://signals.gitdealflow.com/api/og/signal-card))

### Drafts ready for user (text-only, no auto-post)
- [x] **`marketing/launch-posts/a2a-twitter-thread.md`** — 8-tweet thread for @data_nerd, all tweets under 280 char (account is not Premium), includes executable curl in tweet 3 (engagement engine), pin recommendation, 3 quote-tweet variants, post-post engagement tactics
- [x] **`marketing/launch-posts/a2a-email-soap-opera.md`** — full 5-email Brunson sequence (Day 1/2/3/5/7), gated on Mailreach warmup. Day 1 hook + announce, Day 2 curl demo, Day 3 cliffhanger, Day 5 /predict reveal, Day 7 Insider Circle pitch with PH50OFF before 25 June expiry. Meme footer in every email.

### Cross-post mirrors (queued 2026-04-26 evening)
- [x] **dev.to** — `a2a-launched` inserted at queue slot 6 with `status: draft-ready`. Ships **Mon 2026-05-25 11:30 EEST** via existing weekly Forem-API publisher. Draft at `distribution/devto-autopublish/drafts/06-a2a-launched.md` (1,285 words, passes 1,200-word gate). Existing slots 6-12 bumped to 7-13 with dates +7 days each (final entry now ships Mon 2026-07-13).
- [~] ~~**Hashnode**~~ — auto-mirror **DISABLED 2026-05-02** (channel retired: 0 followers, 0 referrals after 14d). Substack mirror at https://gitdealflow.substack.com replaces it.
- [ ] **Medium** — daily Brunson-humanized pipeline via Chrome MCP (manual paste pattern, per `feedback_medium_api_deprecated.md`). User pastes when Medium calendar next runs. Source draft = same dev.to file.
- [ ] **Substack** — passive mirror per `feedback_substack_passive_mirror.md`. Substack pulls from blog.signals.gitdealflow.com automatically; the post is already live there. No action.

### Manual-posting drafts shipped tonight (no auto-post)
- [x] **HN "Show HN" draft** — `marketing/launch-posts/a2a-hn-show-hn.md`. Title under 80 chars, body intentionally rough (Daniel mod flag rule from Apr 22 — never LLM-polish HN). Two backup angles + posting strategy + hard rules.
- [x] **Reddit drafts** — `marketing/launch-posts/a2a-reddit-drafts.md`. Four 40-55 word comment templates (A: r/ClaudeAI, B: r/startups, C: r/datascience, D: r/SaaS), main post for r/SideProject with first-comment probe, follow-up draft for r/cursor. Includes posting cadence and Day-0 → Day-4 plan.
- [x] **Telegram launch post** — `marketing/launch-posts/a2a-telegram-launch.md`. T-0 launch exception applies (overrides "skip if <10 subs" rule). Single broadcast post on @gitdealflow with curl example, AgentCard URL, playground link. Posting checklist + native macOS app reminder + 3-week follow-up cadence.
- [x] **LinkedIn company page draft** — `marketing/launch-posts/a2a-linkedin-company-page.md`. ~140-word text post + 15-min self-comment with SSRN anchor + CTA URL on its own line (per `feedback_linkedin_self_comment_tactic.md`). Counts toward Dream 100 weekly cadence (4/week max). Hard rules enforce company page only, no real names, no em-dashes.

### Share-card viral loop wired into SOTW (Greg's #1 completion)
- [x] [/signal-of-the-week](https://signals.gitdealflow.com/signal-of-the-week) — added "Share this week's signal" section with three buttons:
  - "Get share card (PNG)" → `/api/og/signal-card` (auto-renders top trending startup)
  - "Tweet the meme" → twitter intent prefilled with the $20K-vs-free meme
  - "Plug into your AI →" → `/a2a` integration hub
- The Signal of the Week archive page now functions as a viral artifact distribution channel even before the first SOTW edition ships May 4. Defaults gracefully to the current top-trending startup until SOTW posts begin.

### Companion paper queued for Zenodo (manual upload required)
- [x] **`distribution/research-paper/zenodo-companion-note-a2a.md`** — full draft (~1,500 words) suitable for direct PDF export to Zenodo. Cites SSRN abstract=6606558, documents the A2A surface, integration patterns, reproducibility implications, limitations. Zenodo upload checklist included. ZENODO_TOKEN not set per existing dataset-sync infra so this stays manual.

### Greg's pSEO compounding play — 5 of 20 shipped 2026-04-26
Tier-2 high-value subset shipped autonomously today; remaining 15 stay queued.

Live on prod (auto-indexed via sitemap + IndexNow ping):
- [x] [/a2a](https://signals.gitdealflow.com/a2a) — A2A integration hub with FAQPage schema (5 questions: what is the agent, how is it different from $20K APIs, supported frameworks, the 5 skills, rate limits)
- [x] [/a2a/claude-code](https://signals.gitdealflow.com/a2a/claude-code) — MCP-native, "MCP server (recommended)" + "Direct A2A from Bash tool"
- [x] [/a2a/cursor](https://signals.gitdealflow.com/a2a/cursor) — MCP-native, settings panel + custom Composer prompt fallback
- [x] [/a2a/openai-agents-sdk](https://signals.gitdealflow.com/a2a/openai-agents-sdk) — Custom function tool, Python + TypeScript variants
- [x] [/a2a/langchain](https://signals.gitdealflow.com/a2a/langchain) — Custom @tool A2A wrapper + langchain-mcp-adapters fallback
- [x] [/a2a/vercel-ai-sdk](https://signals.gitdealflow.com/a2a/vercel-ai-sdk) — tool() with zod schema + experimental_createMCPClient fallback

Each page: install snippet, two integration paths, "what to ask" examples, gotchas, references, breadcrumb + TechArticle JSON-LD, the meme banner, cross-link to /a2a-demo + /blog/a2a-launched, list of other framework integrations. ~50KB rendered each.

### Greg's pSEO — 15 still queued (Tier 3 Monday review)
- [ ] CrewAI, Mastra, Continue, Cline, Aider — agent-runtime adjacent
- [ ] Mistral Le Chat, Pydantic AI, AutoGen, Semantic Kernel — narrower audience
- [ ] Inkeep, Voiceflow, Botpress — chatbot-platform side
- [ ] Inngest, n8n, Zapier — workflow / automation
- [ ] Google Agent Builder — first-class A2A but enterprise-focused

Decide on Monday whether to ship these as a second batch or stop at 5. Watch which of the live 5 actually drive PostHog referrals before adding.

### Greg's AEO play (Tier 2/3, not yet shipped)
- [ ] **10-15 AEO pages** with FAQ schema markup ("Free alternative to Crunchbase API," "Free alternative to PitchBook," "Best deal flow API for AI agents," "How do VCs find startups before Crunchbase," "MCP server for VC signals"). Audit overlap with existing /alternatives/[slug] + /vs/[slug] before adding to avoid duplicate content. Tier 2 Monday review.
- [ ] **SSRN companion note** referencing the live A2A endpoint on Zenodo or OSF. ~30 min. Russell's #4. Defer to next academic-content session.

## Verification checklist
- [x] `curl https://signals.gitdealflow.com/.well-known/agent-card.json` returns 200 with valid AgentCard JSON ✅ 2026-04-26
- [x] `curl https://signals.gitdealflow.com/api/a2a` returns 200 with descriptor ✅ 2026-04-26
- [x] POST JSON-RPC 2.0 `message/send` with text "trending" returns Task with `status.state="completed"` and 20 startups in artifact data part ✅ 2026-04-26
- [x] Invalid sector returns `availableSectors[]` so clients can self-discover the live slug list ✅ 2026-04-26
- [x] Unknown method returns -32601, invalid envelope returns -32600 ✅ 2026-04-26
- [x] OPTIONS preflight returns 204 with CORS headers ✅ 2026-04-26

## Sample request for testing

```bash
curl -X POST https://signals.gitdealflow.com/api/a2a \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "message/send",
    "params": {
      "message": {
        "role": "user",
        "parts": [{ "kind": "text", "text": "Show me trending startups" }]
      }
    }
  }'
```

Or structured:

```bash
curl -X POST https://signals.gitdealflow.com/api/a2a \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "id": 1,
    "method": "message/send",
    "params": {
      "message": {
        "role": "user",
        "parts": [{
          "kind": "data",
          "data": { "skill": "search_startups_by_sector", "args": { "sector": "fintech" } }
        }]
      }
    }
  }'
```

## What's NOT shipped (intentional)
- No streaming (`message/stream`). Sync only.
- No task persistence. `tasks/get` returns -32004.
- No push notifications. Not in our use case.
- No authenticated extended card. The public AgentCard is the full card.

If a paying customer asks for any of the above, expand the endpoint then.
