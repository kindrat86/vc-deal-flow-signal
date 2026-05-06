# Dream 100 — Tier 1 Quarterly Action Queue

> **Brunson rule:** Every Tier 1 voice (ICP score ≥ 85) must have a
> concrete monthly or quarterly action against it. The list below pairs
> each Tier 1 entry from `/dream-100` with one specific Brunson-style
> play (PR / comment / integration / quote-thread / co-mention),
> a measurable outcome, and a status flag.

**Source of truth:** `pseo-site/content/dream-100-icp.ts`
**Audit cycle:** 2026-05-06
**Tier 1 count:** 31 entries (out of 100)
**Re-scoring cadence:** quarterly

---

## How to read this queue

Each row carries:

- **Score** — Match × 4 + Reach × 3 + Engage × 3 (max 100)
- **Action** — the single concrete monthly play (Brunson "one pebble per voice")
- **Surface** — where the action ships from (our side)
- **Outcome** — what we measure 90 days later
- **Status** — `▶ active` / `◔ ramping` / `○ idle` / `■ blocked`

**Quarterly cadence:** every Tier 1 entry should have at least one
*active* artefact landing every 90 days. *Idle* entries roll forward
once; if still idle next quarter, demote out of Tier 1.

---

## Tier 1 — 31 entries

### 1. vercel — 97  ▶ active
- **Action:** Continue shipping integration adapters under `/for-vercel-ai-sdk`; add a /vercel-templates landing if a useful template emerges
- **Surface:** `pseo-site/app/for-vercel-ai-sdk/page.tsx`, npm `@gitdealflow/mcp-signal`, MCP registry listing
- **Outcome:** ≥ 1 community-mention or RT from an @vercel team member per quarter
- **Notes:** We deploy *on* Vercel — alignment is structural; keep platform-native posture

### 2. anthropic — 97  ▶ active
- **Action:** Maintain MCP server compliance with every protocol revision; keep `/install` MCP-first; participate in MCP Registry curation
- **Surface:** `pseo-site/app/api/mcp/rpc/route.ts`, MCP Registry listing
- **Outcome:** Stay listed in `modelcontextprotocol/servers` README; ≥ 1 inclusion in a Claude/MCP roundup per quarter
- **Notes:** Anthropic is the substrate of half the integration stack — reciprocal reach is automatic if we keep shipping

### 3. Vercel AI SDK — 97  ▶ active
- **Action:** Maintain `/for-vercel-ai-sdk` adapter; keep the streaming-first agent example current with each AI SDK major
- **Surface:** `pseo-site/app/for-vercel-ai-sdk/page.tsx`
- **Outcome:** AI SDK examples gallery inclusion OR docs cross-link; track via referrer logs
- **Notes:** Brunson "Conversation Domination" — be where the agents already live

### 4. LangChain / LangGraph — 97  ▶ active
- **Action:** Keep `/for-langchain` Python tool template current; PR to LangChain integrations docs once the tool template stabilizes
- **Surface:** `pseo-site/app/for-langchain/page.tsx`, optional langchain-community PR
- **Outcome:** Inclusion in LangChain integrations docs OR a LangChain partner-of-the-month nod
- **Notes:** Pair with LangSmith tracing demo for the next iteration

### 5. Claude Desktop / Claude Code — 97  ▶ active
- **Action:** Keep `/install` MCP-first instructions current; produce one weekly `share_result` Tweet-style mini-thread quoting MCP usage
- **Surface:** `pseo-site/app/install/page.tsx`, MCP `share_result` tool
- **Outcome:** ≥ 5 unique MCP installs per quarter from Claude clients (track via MCP server analytics)
- **Notes:** Anonymity-friendly — the integration speaks, not us

### 6. supabase — 94  ◔ ramping
- **Action:** Open one PR per quarter to a Supabase awesome-list adding GitDealFlow as a dataset/integration entry; cross-link if a Supabase startup hits the weekly Acceleration Watch
- **Surface:** awesome-supabase PR; weekly /predicted callout
- **Outcome:** PR merged OR Supabase team interaction (RT, reply)
- **Notes:** Brunson "earn-your-way-in" — show up as a contributor first, not a pitcher

### 7. modelcontextprotocol — 94  ▶ active
- **Action:** Keep MCP server in `modelcontextprotocol/servers` README; submit one tool-spec improvement or example per quarter
- **Surface:** GitHub PR to modelcontextprotocol/servers, MCP Registry
- **Outcome:** Stay in registry; ≥ 1 commit-level engagement per quarter
- **Notes:** This IS the protocol — strategic dependency

### 8. huggingface — 94  ○ idle
- **Action:** Add HuggingFace as a thesis sector inside `/sector-sweep` quarterly cuts; cross-publish dataset to HF Datasets if/when the panel hits n=300
- **Surface:** `/sector-sweep`, future HF Dataset upload
- **Outcome:** HF Dataset listed under `vc-deal-flow-signal/`; community downloads
- **Notes:** Currently idle — promote to ramping next quarter

### 9. cloudflare — 94  ◔ ramping
- **Action:** Quarterly /compare/cloudflare-vs-vercel page refresh tied to a Cloudflare org's GitHub momentum (e.g., D1, R2 changelog cadence)
- **Surface:** `pseo-site/app/compare/[slug]/page.tsx`
- **Outcome:** /compare page indexed by Cloudflare-thesis searches
- **Notes:** Watch for Cloudflare thesis-tagged orgs in the weekly digest

### 10. Cursor — 94  ▶ active
- **Action:** Maintain `/install` Cursor row; one quarterly Show-and-Tell of GitDealFlow MCP usage inside Cursor (synthetic-narration video clip OK per anonymity rules)
- **Surface:** `/install`, YouTube channel UCSK4ZC9EJAHjHyncb5cSh8w
- **Outcome:** ≥ 1 Cursor community mention per quarter
- **Notes:** Cursor users are dense in the developer-investor avatar

### 11. OpenAI ChatGPT GPT — 93  ▶ active
- **Action:** Maintain "VC Deal Flow Signal" Custom GPT (Action mounted to /api/actions); refresh actions schema with each OpenAPI bump
- **Surface:** Custom GPT listing, `/api/actions/openapi.json`
- **Outcome:** Custom GPT install count growth, ≥ 1 review per quarter
- **Notes:** Pair with `/api/openai-search.json` discoverability surface

### 12. The Pragmatic Engineer — 91  ○ idle
- **Action:** Quarterly Substack Notes thread quoting a Pragmatic Engineer post that pattern-matches a /predicted weekly mover; no DM, no pitch
- **Surface:** Substack Notes
- **Outcome:** Quote-thread visible in Substack Notes graph; ≥ 1 reply from PE community
- **Notes:** Highest-Match newsletter — anonymity rule allows quote-and-counter-quote

### 13. MCP Registry — 91  ▶ active
- **Action:** Continue shipping protocol-compliance updates; submit any new tool spec immediately; keep example READMEs current
- **Surface:** modelcontextprotocol/servers
- **Outcome:** Listing remains in featured/popular row; ≥ 1 PR per quarter
- **Notes:** Dual-pinned with #7

### 14. Insight Partners — 91  ◔ ramping
- **Action:** Watch `jbash@insightpartners.com` reply (already in pipeline per `marketing/project_traffic_push_2026_05_04.md`); follow-up with one specific GitHub-momentum data point if reply lands
- **Surface:** Email thread; /predicted weekly cross-link
- **Outcome:** Reply received OR conversion to LP-call OR explicit no
- **Notes:** Highest-leverage single email in the queue right now

### 15. CrewAI — 91  ○ idle
- **Action:** Maintain `/for-crewai` Crew tool template; submit one PR to crewAI tools registry once template is battle-tested
- **Surface:** `pseo-site/app/for-crewai/page.tsx`, crewAIInc/crewAI-tools PR
- **Outcome:** PR merged OR documented in crewAI examples
- **Notes:** Currently idle — promote next quarter

### 16. AngelList — 91  ◔ ramping
- **Action:** Continue building /vs/angellist comparison page; cross-link from /firstlook risk-reversal section
- **Surface:** `pseo-site/app/vs/[slug]/page.tsx`
- **Outcome:** /vs/angellist on first page of "AngelList alternative" SERP
- **Notes:** Direct ICP overlap; angel-investor avatar lives here

### 17. Smithery — 88  ▶ active
- **Action:** Keep listing live (currently 90/100 score per memory); refresh tool description with each MCP tool addition
- **Surface:** smithery.ai/servers/kindrat86/mcp-deal-flow-signal
- **Outcome:** Stay above 85/100 score; growing install count
- **Notes:** Recovered 2026-05-05 after delisting scare; monitor monthly

### 18. Our SSRN paper (n=219) — 88  ▶ active
- **Action:** Quarterly version bump as panel grows; cross-link from /research, /predicted, /methodology, every Pass V/VI/VII/VIII surface
- **Surface:** SSRN paper, `pseo-site/app/research/page.tsx`
- **Outcome:** Citation count; download count; n grows toward 300
- **Notes:** This is OUR voice in the Dream 100 — credibility infrastructure

### 19. Mastra — 88  ◔ ramping
- **Action:** Keep `/for-mastra` adapter current; one PR to mastra/integrations as the registry matures
- **Surface:** `pseo-site/app/for-mastra/page.tsx`
- **Outcome:** Listed in Mastra integrations
- **Notes:** TypeScript-native — pair with Vercel AI SDK story

### 20. openai (GitHub org) — 87  ○ idle
- **Action:** Watch openai/* public repos for orgs surfacing on /predicted; opportunistic /compare or /signals/* page if a clear thesis emerges
- **Surface:** opportunistic
- **Outcome:** ≥ 1 inclusion per quarter when a clear OAI-adjacent org hits the digest
- **Notes:** Not a relationship play — a watchlist play

### 21. dev.to — 87  ▶ active
- **Action:** Cross-publish one Substack-mirror essay to dev.to per month via Forem API; tagged with `webdev`, `vc`, `github`
- **Surface:** dev.to Forem API
- **Outcome:** ≥ 4 dev.to posts per quarter; ≥ 1 article in the top-100 daily
- **Notes:** Already automated; verify cadence holds

### 22. Y Combinator — 87  ○ idle
- **Action:** When a YC alumni org hits the digest, write a one-line annotation in the /predicted weekly: *"YC Wxx alumnus, surfaced 47 days before public round"*. Track those quarterly.
- **Surface:** `/predicted` weekly digest
- **Outcome:** ≥ 1 YC-tagged annotation per month
- **Notes:** YC alumni list IS our back-test cohort — annotate, don't pitch

### 23. TLDR Tech — 87  ◔ ramping
- **Action:** Quarterly submission to TLDR (https://tldr.tech/submit) when a /predicted weekly hits a milestone (N=300, etc.)
- **Surface:** TLDR submission form
- **Outcome:** ≥ 1 TLDR Tech inclusion in 2026
- **Notes:** Direct daily-tech-newsletter overlap with ICP

### 24. Crunchbase — 87  ▶ active
- **Action:** Keep `/built-with` and `/vs/crunchbase` pages current; opportunistic /compare cuts when a Crunchbase data gap is provable
- **Surface:** `pseo-site/app/vs/[slug]/page.tsx`, `pseo-site/app/built-with/page.tsx`
- **Outcome:** /vs/crunchbase top-3 SERP for "crunchbase alternative for github"
- **Notes:** Already shipped /vs page; watch SERP

### 25. Carta — 87  ○ idle
- **Action:** Quarterly comparison line in /pricing or /firstlook risk-reversal section: *"Carta tells you the cap table; we tell you the codebase"*. Add /vs/carta if traffic supports it.
- **Surface:** `pseo-site/app/pricing/page.tsx`
- **Outcome:** Carta comparison line drives ≥ 1% of /firstlook conversions
- **Notes:** Operator-investor crossover audience

### 26. Andreessen Horowitz (a16z) — 87  ◔ ramping
- **Action:** When an a16z portfolio org hits the digest, annotate; cross-link to a16z's published thesis when alignment is clean
- **Surface:** /predicted weekly, /signals/[slug] entries
- **Outcome:** ≥ 1 a16z-portfolio annotation per month
- **Notes:** Annotation > pitching — Brunson "show up where they are"

### 27. ollama — 85  ○ idle
- **Action:** Track ollama/* and ollama-adjacent on-device-AI orgs in the weekly digest; one /signals/local-llm-buildout report per quarter
- **Surface:** /signals/[slug]
- **Outcome:** ≥ 1 quarterly thesis report citing ollama as anchor
- **Notes:** Local-LLM thesis is hot — anchor here

### 28. neondatabase — 85  ◔ ramping
- **Action:** Quarterly /compare/neon-vs-supabase or /signals/serverless-postgres-buildout report; cross-link to /built-with
- **Surface:** /compare or /signals
- **Outcome:** Inclusion in Neon's serverless-postgres ecosystem reading
- **Notes:** Pair with Vercel Storage marketplace story

### 29. Software Lead Weekly — 85  ○ idle
- **Action:** Submit one issue's worth of editorial via Substack Notes quote-thread per quarter
- **Surface:** Substack Notes
- **Outcome:** ≥ 1 reciprocal mention or quote per quarter
- **Notes:** Highest-Match weekly — direct overlap with engineering-leader avatar

### 30. GitHub REST + GraphQL — 85  ▶ active
- **Action:** Methodology page maintenance; quarterly version-bump of `/methodology` to reflect API rate-limit and schema changes
- **Surface:** `pseo-site/app/methodology/page.tsx`
- **Outcome:** /methodology page accuracy stays at 100% reproducibility against current GH API
- **Notes:** This IS the substrate — methodology page is our reproducibility receipt

### 31. Console.dev — 85  ○ idle
- **Action:** Submit GitDealFlow to console.dev curation queue (https://console.dev/) once /agents/credits has a polished landing
- **Surface:** console.dev submission
- **Outcome:** Inclusion in a Console.dev weekly issue
- **Notes:** Curated devtool list — straightforward submission play

---

## Status summary

| Status | Count |
|---|---|
| ▶ active (shipping monthly) | 12 |
| ◔ ramping (1–2 actions taken, more on schedule) | 8 |
| ○ idle (no action this quarter — promote or demote next pass) | 11 |
| ■ blocked | 0 |

**Quarterly review cadence:** demote any Tier 1 entry that stays *idle*
two quarters in a row. Promote any Tier 2 entry that has produced an
unsolicited inbound (PR mention, RT, reply) into Tier 1.

**Next review:** 2026-08-06 (90 days from this audit cycle).

---

## Anchor links

- ICP-scored roster: https://signals.gitdealflow.com/dream-100
- Methodology: `pseo-site/content/dream-100-icp.ts`
- Where the conversation lives (counterpart map): `pseo-site/app/distribution/page.tsx`
- Weekly Acceleration Watch: `pseo-site/app/predicted/page.tsx`
- Brunson Trilogy chapter audit: project_brunson_v8_2026_05_06.md (and successors)

---

*Filed via Brunson audit cycle 2026-05-06, follow-on to the audit-V/VI/VII/VIII Composite-92 ship and PR #50 (/install Ext #2 symmetry).*
