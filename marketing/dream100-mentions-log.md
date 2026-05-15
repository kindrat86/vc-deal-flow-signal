# Dream 100 Inbound Mentions Log

Track every third-party mention of our brand and reply within **4 hours**. This is the inbound mirror of `dream-100-engagement-log.md` (which tracks our outbound touches).

> Brunson's Traffic Secrets Ch 5: the Dream 100 isn't just a list — it's a two-way relationship. The outbound side is the touch cadence; the inbound side is the response cadence. Without inbound tracking, you give up the highest-conversion conversation moment in distribution: when someone *else* puts your name in front of *their* audience.

---

## How this log is maintained

**Auto:** `tools/dream100-mention-radar/scan.mjs` runs daily via GH Actions (`.github/workflows/dream100-mention-radar.yml`, 07:33 UTC). It scans HN Algolia, Reddit, Lobsters, and GitHub for our brand keywords (see `tools/dream100-mention-radar/keywords.json`), dedupes against `state.json`, and appends new entries here.

**Manual:** for platforms the auto-scanner can't reach (X/Twitter, LinkedIn, Substack comments, podcast transcripts, private DMs, in-person), use:

```bash
node tools/dream100-mention-radar/log-mention.mjs \
  --where twitter \
  --who "@swyx" \
  --url "https://x.com/swyx/status/..." \
  --quote "Just saw gitdealflow predict the Series A on day 31"
```

---

## The 4-hour reply SLA

Every entry below has a `Reply-by` timestamp = detection + 4h. Hit that window or note why you missed it. The 4h rule comes from algorithm timing on every major platform: replies inside the first hours get amplified into the original post's reach; replies after fall into a separate, much smaller conversation.

**Status values:**
- `pending` — newly detected, not yet replied
- `replied` — we engaged, link to our response
- `declined` — chose not to engage (off-topic, hostile, anonymity conflict)
- `escalate` — Tier-1 mention, founder-only call

---

## Reply playbook by platform

> **Anonymity rule applies everywhere.** No founder face/voice/name. No "I" statements that imply a single human (use "we / the panel / the methodology"). Synthetic-voice video and Cartesia narration are acceptable; a real human voice on a podcast is not.

### HN (Hacker News)
- **Tone:** technical, sourced, never promotional. HN punishes pitches.
- **Frame:** add ONE specific data point not in the parent comment, then link only if the link substantiates the data.
- **Length:** 80–250 words. Anything longer reads as marketing.
- **Don't:** open with "Founder here." Don't @-mention OP. Don't refer to features.
- **Do:** "The 21–47 day median lead time we saw in the SSRN panel (n=219) lines up with what GP is describing — though we've also seen the opposite signal break in AI-coding-agent repos when launches outpace contributor breadth. Methodology and CSV are at signals.gitdealflow.com/methodology if useful."

### Reddit
- **Subreddit-aware:** r/startups, r/EntrepreneurRideAlong, r/SideProject — share specific numbers, no marketing. r/venturecapital — methodology-first, no self-promo. r/MachineLearning — research-grade only.
- **Frame:** answer the question literally first, link second.
- **Length:** match the thread cadence. Don't outpace OP.
- **Don't:** post in /new without context. Don't pretend to be a normal user "discovering" us.

### Lobsters
- **Tone:** even more technical than HN. Methodology + reproducibility, link to SSRN/Zenodo.
- **Frame:** the panel is CC BY 4.0 — emphasize replication, not the product.
- **Length:** short. Lobsters values brevity.

### GitHub (issues / PRs / discussions)
- **Frame:** if someone references us in an issue, reply with API contract, MCP tool list, or methodology link. If a PR mentions us in a code comment or doc, leave a thank-you + offer help.
- **Don't:** drop product links into unrelated repos. Star, watch, contribute first.

### X / Twitter (manual log only)
- **Frame:** quote-reply with one specific number. Visual quote-tweet > text reply.
- **Length:** under 240 chars. Brevity reads as confidence.
- **Don't:** thread bait. Don't quote-tweet hostile takes (silent block).

### LinkedIn (manual log only)
- **Frame:** comment with a 2–4 line case (number + result + caveat). LinkedIn rewards thoroughness.
- **Length:** 200–600 chars. Bullet points encouraged.
- **Don't:** post on company page asking for engagement. Comment as the page, not a person.

### Substack comments / Notes (manual log only)
- **Frame:** add nuance to the post's argument. Cite the post by paragraph.
- **Length:** 100–400 chars per Note. 2–4 paragraphs per substantive comment.
- **Don't:** crosspost our own newsletter into someone else's comment thread.

### Podcasts / interviews (manual log only)
- **Anonymity blocker:** decline live appearances. Offer synthetic-voice prerecorded segment + transcript + data CSV.
- **Frame:** "We can ship a 5-min Cartesia-narrated segment with the methodology + a falsifiable claim within 48h. Founder doesn't appear. Show keeps full edit rights."

---

## Tier-1 mention escalation

If any of the **Tier-1 voices below** mention us — even a single word — the response gets bumped from `pending` → `escalate` and the founder reviews within the same 4h window. These are the people whose audience is our exact ICP:

**Substacks/blogs:** Lenny Rachitsky, Gergely Orosz (Pragmatic Engineer), Ben Thompson (Stratechery), Packy McCormick (Not Boring), shawn (swyx) Wang (Latent Space), Simon Willison, Elad Gil
**Podcasts:** Acquired (Ben Gilbert / David Rosenthal), Invest Like the Best (Patrick O'Shaughnessy), 20VC (Harry Stebbings), Lenny's Podcast, Logan Bartlett Show, BG2 Pod
**VCs:** Fred Wilson, Marc Andreessen, Chamath Palihapitiya, David Sacks, Naval Ravikant, Brad Feld, Joshua Kushner, Hunter Walk, Peter Walker
**Builders/indie:** Greg Isenberg, Pieter Levels, Tony Dinh, Dan Martell, Ryan Hoover, Shaan Puri, Arvid Kahl

If one of them mentions us, the reply must:
1. Acknowledge the specific point they made (not a generic thanks)
2. Add ONE data point that extends their argument
3. Link only if the link is the proof for the data point
4. Never feel like a sales pitch — the conversation IS the value

---

## Format spec

Each entry follows:

```markdown
- **Platform — Handle** — Title or first 140 chars
  - URL: <link>
  - Posted: <ISO> · Detected: <ISO> · Reply-by (4h SLA): **<ISO>**
  - Quote: > <up to 280 chars>
  - Status: `pending` — keyword: `<which kw matched>`
  - Reply: <text or link or _none yet_>
```

Both `scan.mjs` and `log-mention.mjs` produce this exact shape. Don't edit the format manually unless updating both scripts.

---

## Log

> Entries below are appended chronologically by date (UTC). Newest day at the bottom.


### 2026-05-09

- **GitHub — kindrat86** — Add VC Deal Flow Signal under Alternative Data
  - URL: https://github.com/georgezouq/awesome-ai-in-finance/pull/138
  - Posted: 2026-05-03 15:50Z · Detected: 2026-05-09 13:31Z · Reply-by (4h SLA): **2026-05-09 17:31Z**
  - Quote: > ### Why this fits Alternative Data Adds **VC Deal Flow Signal** — an open longitudinal panel of GitHub-derived engineering-velocity signals for venture-backed startups. Combines public commit cadence, contributor growth, repository-creation events, and inferred signal types (fra
  - Status: `pending` — keyword: `gitdealflow`
  - Reply: _none yet_
- **GitHub — kindrat86** — Add @pipedream/gitdealflow components
  - URL: https://github.com/PipedreamHQ/pipedream/pull/20774
  - Posted: 2026-05-03 15:13Z · Detected: 2026-05-09 13:31Z · Reply-by (4h SLA): **2026-05-09 17:31Z**
  - Quote: > ## Summary Adds a new no-auth Pipedream app: **@pipedream/gitdealflow** — exposes [VC Deal Flow Signal](https://gitdealflow.com)'s public startup engineering signal data to Pipedream workflows. GitDealFlow is a free, weekly-updated dataset that ranks 100+ startups across 20 sec
  - Status: `pending` — keyword: `gitdealflow`
  - Reply: _none yet_
- **GitHub — kindrat86** — MCP Registry: Add VC Deal Flow Signal
  - URL: https://github.com/raycast/extensions/pull/27618
  - Posted: 2026-05-03 15:07Z · Detected: 2026-05-09 13:31Z · Reply-by (4h SLA): **2026-05-09 17:31Z**
  - Quote: > ## Description Adds **VC Deal Flow Signal** to the MCP Registry — an MCP server exposing GitHub-derived engineering acceleration signals for ~400 venture-backed startups across 20 sectors. ## Why Raycast users in VC, fintech, and developer-tooling spaces can use this to query
  - Status: `pending` — keyword: `gitdealflow`
  - Reply: _none yet_
- **GitHub — kindrat86** — Add VC Deal Flow Signal MCP to extensions directory
  - URL: https://github.com/aaif-goose/goose/pull/8974
  - Posted: 2026-05-03 10:03Z · Detected: 2026-05-09 13:31Z · Reply-by (4h SLA): **2026-05-09 17:31Z**
  - Quote: > ## What Adds **VC Deal Flow Signal** — an MCP server exposing GitHub-derived engineering acceleration signals for ~400 venture-backed startups across 20 sectors. ## Why Goose users in VC, fintech, and developer-tooling spaces have asked for startup-discovery and competitive-in
  - Status: `pending` — keyword: `gitdealflow`
  - Reply: _none yet_
- **GitHub — kindrat86** — Add VC Deal Flow Signal — GitHub momentum tracking for venture capital
  - URL: https://github.com/e2b-dev/awesome-ai-agents/issues/890
  - Posted: 2026-05-03 08:21Z · Detected: 2026-05-09 13:31Z · Reply-by (4h SLA): **2026-05-09 17:31Z**
  - Quote: > **VC Deal Flow Signal** is an MCP server that mines GitHub for engineering signals predicting $1M+ funding rounds. **What it does:** - 5 free MCP tools: trending startups, sector signal sweep, signals summary, methodology, per-startup signal - 12k repos analyzed; 30 findings doc
  - Status: `pending` — keyword: `gitdealflow`
  - Reply: _none yet_
- **GitHub — kindrat86** — Add VC Deal Flow Signal MCP Server — GitHub momentum tracking for venture capital
  - URL: https://github.com/pulsemcp/mcp-servers/issues/585
  - Posted: 2026-05-03 08:13Z · Detected: 2026-05-09 13:31Z · Reply-by (4h SLA): **2026-05-09 17:31Z**
  - Quote: > ## Server Info - **Name**: VC Deal Flow Signal - **URL**: https://signals.gitdealflow.com - **MCP Endpoint**: `https://signals.gitdealflow.com/api/mcp/rpc` - **GitHub**: https://github.com/kindrat86/vc-deal-flow-signal - **npm**: [@gitdealflow/mcp-signal](https://www.npmjs.com/p
  - Status: `pending` — keyword: `gitdealflow`
  - Reply: _none yet_
- **GitHub — kindrat86** — [Submit] vc-deal-flow-signal — GitHub momentum tracking for venture deal flow
  - URL: https://github.com/chatmcp/mcpso/issues/2201
  - Posted: 2026-05-02 08:17Z · Detected: 2026-05-09 13:31Z · Reply-by (4h SLA): **2026-05-09 17:31Z**
  - Quote: > ## MCP Server Submission: vc-deal-flow-signal **Name**: `vc-deal-flow-signal` **Description**: GitHub momentum tracking for venture deal flow — find startups whose engineering is accelerating before they raise. Six read-only MCP tools across 20 sectors of venture-backed startups
  - Status: `pending` — keyword: `gitdealflow`
  - Reply: _none yet_
- **GitHub — kindrat86** — feat(crewai-tools): add GitDealFlowSignalTool for VC deal flow research
  - URL: https://github.com/crewAIInc/crewAI/pull/5682
  - Posted: 2026-05-02 07:09Z · Detected: 2026-05-09 13:31Z · Reply-by (4h SLA): **2026-05-09 17:31Z**
  - Quote: > ## What Adds `GitDealFlowSignalTool` under `lib/crewai-tools/` — a read-only research tool that lets CrewAI agents query the public [GitDealFlow](https://signals.gitdealflow.com) API for GitHub-derived engineering acceleration signals across venture-backed startups in 20 sectors
  - Status: `pending` — keyword: `gitdealflow`
  - Reply: _none yet_
- **GitHub — kindrat86** — [Server Submission]: VC Deal Flow Signal
  - URL: https://github.com/cline/mcp-marketplace/issues/1491
  - Posted: 2026-05-02 06:45Z · Detected: 2026-05-09 13:31Z · Reply-by (4h SLA): **2026-05-09 17:31Z**
  - Quote: > ### GitHub Repository URL https://github.com/kindrat86/mcp-deal-flow-signal ### Logo Image https://signals.gitdealflow.com/icon.png ### Installation Testing - [x] I have tested that Cline can successfully set up this server using only the README.md and/or llms-install.md fil
  - Status: `pending` — keyword: `gitdealflow`
  - Reply: _none yet_
- **GitHub — kindrat86** — Add GitDealFlow Signal Agent under new Finance & Investment section
  - URL: https://github.com/inference-gateway/awesome-a2a/pull/3
  - Posted: 2026-04-25 22:05Z · Detected: 2026-05-09 13:31Z · Reply-by (4h SLA): **2026-05-09 17:31Z**
  - Quote: > Adds GitDealFlow Signal Agent — a community A2A agent exposing startup engineering signals from public GitHub data. **What it does:** five read-only skills (trending startups, sector search, single-startup lookup, dataset summary, methodology) derived from commit velocity, contr
  - Status: `pending` — keyword: `gitdealflow`
  - Reply: _none yet_
- **GitHub — kindrat86** — Re-add VC Deal Flow Signal to Finance & Fintech
  - URL: https://github.com/punkpeye/awesome-mcp-servers/pull/5415
  - Posted: 2026-04-25 21:37Z · Detected: 2026-05-09 13:31Z · Reply-by (4h SLA): **2026-05-09 17:31Z**
  - Quote: > Re-adding [VC Deal Flow Signal](https://gitdealflow.com) after the entry from #4933 (merged 2026-04-23, commit d0e2cdfb) was silently dropped from `main` — likely a 3-way merge conflict from a later rebase, since both alphabetically-adjacent entries (`klever-io/mcp-klever-vm` and
  - Status: `pending` — keyword: `gitdealflow`
  - Reply: _none yet_
- **GitHub — kindrat86** — Re-add VC Deal Flow Signal MCP server (silently dropped from #4933)
  - URL: https://github.com/punkpeye/awesome-mcp-servers/pull/5414
  - Posted: 2026-04-25 21:33Z · Detected: 2026-05-09 13:31Z · Reply-by (4h SLA): **2026-05-09 17:31Z**
  - Quote: > Re-adds [VC Deal Flow Signal](https://gitdealflow.com) to the Finance & Fintech section. ## Why this PR The entry was added in #4933 (merged 2026-04-23) but is no longer present in \`main\`. The original merge SHA \`d0e2cdfb\` clearly applied a \`+1/-0\` change to README.md ins
  - Status: `pending` — keyword: `gitdealflow`
  - Reply: _none yet_
- **GitHub — kindrat86** — Add VC Deal Flow Signal under Finance
  - URL: https://github.com/awesomedata/apd-core/pull/396
  - Posted: 2026-05-03 09:43Z · Detected: 2026-05-09 13:31Z · Reply-by (4h SLA): **2026-05-09 17:31Z**
  - Quote: > ### Summary Adds a new dataset entry under **Finance**: *VC Deal Flow Signal* — an open dataset of GitHub-derived early-stage venture-capital deal-flow signals. ### Why this is a high-quality fit - **Direct download**, not gated by login or purchase: distributed via Hugging Face
  - Status: `pending` — keyword: `vc deal flow signal`
  - Reply: _none yet_
### 2026-05-13

- **GitHub — kimjune01** — Protect llama_index from AI slop PRs
  - URL: https://github.com/run-llama/llama_index/issues/21632
  - Posted: 2026-05-13 00:45Z · Detected: 2026-05-13 04:29Z · Reply-by (4h SLA): **2026-05-13 08:29Z**
  - Quote: > 9 of 98 PRs in the last 2 weeks would have been auto-closed before review (e.g. #21616 Security: Fix format-string sandbox bypass in EvaporateExtra, #21600 feat: add GitDealFlow tool spec for engineering acceleration). Install a GitHub Action: - [PR Quality Gate](https://github
  - Status: `pending` — keyword: `gitdealflow`
  - Reply: _none yet_
### 2026-05-15

- **GitHub — prassanna-ravishankar** — feat(conformance): persist task-probe results on a daily cadence (#108)
  - URL: https://github.com/prassanna-ravishankar/a2a-registry/pull/129
  - Posted: 2026-05-15 12:28Z · Detected: 2026-05-15 15:01Z · Reply-by (4h SLA): **2026-05-15 19:01Z**
  - Quote: > Closes the gap surfaced in #108: card-health (cheap GET) and task-conformance (real A2A `message/send`) were measured at different times — GET every 30 min, task only at registration. That left the registry showing healthy=true for agents whose POST endpoint had since broken. Th
  - Status: `pending` — keyword: `gitdealflow`
  - Reply: _none yet_