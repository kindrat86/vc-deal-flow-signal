# Marketing Idea Queue
## Capture new ideas here. Do not execute until the Monday review decides.

> Rule: 3-tier triage (from Brunson Architect, 2026-04-19). See `brunson/launch-plan.md` for triggers.
> - **Tier 1 (tactic):** log here, swap into workbook 10 weekly experiment slate only if it beats the planned one on BOTH (a) Developer-Investor reach and (b) setup cost.
> - **Tier 2 (time-boxed opportunity):** log here, check against `launch-plan.md` "Trigger conditions to deviate." Act only if match.
> - **Tier 3 (strategic pivot — e.g. Dream Customer change):** STOP. Do not execute. Revisit workbook 08 in a dedicated session. No re-pivots during launch window.

## Monday review rhythm
Every Monday 09:30 EEST, scan this file. For each entry:
1. Still relevant? If no → strike through with reason.
2. Fits Developer-Investor? If no → strike through.
3. Cheap enough to run as this week's experiment? If yes → promote to workbook 10 experiment slate.
4. Otherwise → leave in queue.

Most ideas should die in the queue. That is the point.

---

## Queue

### 2026-04-27 — Signal of the Week (Akto) engineering follow-ups
- **Tier:** 1 (tactic — small, repeatable, weekly cadence)
- **Source:** `weekly-signal-content` task auto-generated three engineering items from this week's Signal of the Week (Akto, +75% framework migration). Variants 15, 18, 20 from `marketing/repurpose-blast-2026-04-27/`.
- **Items:**
  1. **Chrome extension popup teaser** — Wire the one-line "Signal of the Week: Akto +75% — framework migration detected at Growth stage" into the extension's popup placeholder (variant 15). One-line copy update; redeploy after.
  2. **MCP server response footer** — Append "Signal of the Week: Akto (+75% velocity, framework migration, Growth stage) — see details via get_startup_signal('Akto')" to `get_signals_summary` and `get_trending_startups` responses in `mcp-server/`. Bump patch version, republish (variant 18).
  3. **Short-form video** — 15-second TikTok/Shorts/YouTube script ready at `marketing/repurpose-blast-2026-04-27/20-shortform-video-script.md`. Decide whether to record this week or roll it forward to Signal of the Week May 4 launch (per `signal-of-the-week-may4-launch` task).
- **Decision:** items 1 and 2 are sub-30-min ships once the user is back at the keyboard; item 3 is gated on the May 4 video pipeline decision (`video-pipeline-revisit-may4`).

### 2026-04-26 (evening) — Russell + Greg full audit week — **PULLED FORWARD + EXECUTED 2026-04-26** (auto-mode)
User asked Claude to act as Russell + Greg, do a full audit, and suggest what both would adjust. 6 one-time scheduled tasks created (Mon-Fri Apr 27 → May 1). User then said "Continue with everything today autonomously" — Claude pulled all 6 days forward into one Sunday session, **disabled** the scheduled tasks to prevent re-fire, executed each Day spec. Spec + per-day status: `brunson/audit-2026-04-26-russell-greg-week.md`.

**Tier 1 — executed 2026-04-26 (6):**
- ✅ Day 1 `landing-bigdomino` — RE-SCOPED (landing already led with "Bet on the repo. Not the deck."; surgical change was missing PH50OFF countdown banner). LaunchBanner.tsx + landing/index.html banner + pseo-site/app/layout.tsx wiring shipped. **DEPLOY PENDING USER CONFIRM.**
- ✅ Day 2 `community-handoff` — Drafts shipped: `community/discord-server-spec.md`, `founding-50-invite-list.md` (10-row scaffold), `founding-50-invite-drafts.md` (10 personalized DMs). USER ACTION block: create server (5 min) + fill placeholders (15 min) + send (15 min).
- ✅ Day 3 `listicle-47-sources` — RE-SCOPED (listicle already shipped 2026-04-22 at slug `47-alternative-data-sources-angel-investors-2026`; would damage indexing to overwrite). Did NOT replace. Cross-post drafts saved in `marketing/threads|reddit-seeding|hn-launch|linkedin/`.
- ✅ Day 4 `pseo-a2a-batch10` — 10 new framework pSEO pages prerendered (crewai, mastra, pydantic-ai, continue, cline, aider, inngest, n8n, zapier, autogen). Combined with the 5 from morning = 15/20 framework pages live. **DEPLOY PENDING USER CONFIRM.**
- ✅ Day 5 `share-trigger-seinfeld` — PARTIAL. Share endpoint live: `pseo-site/app/share/[token]/page.tsx` + HMAC token util `pseo-site/lib/share-token.ts`. Soap Opera 5 P.P.S. updated. Seinfeld templates ALREADY existed at `emails/seinfeld-1.md`–`-7.md` — no new template. DEFERRED: send-outreach.mjs token injection + weekly-signal-content task integration (~1hr next session). **DEPLOY PENDING USER CONFIRM.**
- ✅ Day 6 `collab-recipe` — UPGRADED to ship live (date pulled forward May 1 → Apr 26). Cursor picked (score 8 vs Lee 6, Linear 4). Recipe blog `pseo-site/content/cursor-collab-2026.ts` wired into posts.ts. Outreach draft `tools/campaign/drafts/collab-cursor.txt` saved. Email send held (warmup gate). **DEPLOY PENDING USER CONFIRM (publishes the blog URL).**

**Deploys queued (gated on explicit user "deploy prod" confirm):**
- pSEO build complete in `.vercel/output` (production target). Command: `vercel deploy --prebuilt --prod --yes` from `pseo-site/`.
- Landing apex: edits in `landing/index.html` (banner). Separate `vercel deploy --prod` from `landing/`.

**Constraints honored:** division of labor (Reddit/LinkedIn/HN posting manual), email warmup gates outreach (no Cursor cold send today), no LinkedIn actions, anonymity locked, access-control prohibition (Discord create handed off), no git commits, Vercel CLI deploys only.

**Cross-day deferred follow-ups (next session, ~2 hrs combined):**
- Wire `email-api/send-outreach.mjs` to inject signed share token replacing `<<SHARE_TOKEN>>` in every rendered email.
- Integrate `emails/seinfeld-*.md` templates as the body skeleton in `weekly-signal-content` scheduled task.
- Ship residual 5 a2a frameworks (Mistral Le Chat, Inkeep, Voiceflow, Botpress, Semantic Kernel) ONLY if PostHog shows >0 referrals on the live 15 by mid-May.
- Queue `collab-cursor.txt` outreach into `tools/campaign/queue.jsonl` with `holdUntil: 2026-05-15` once warmup completes.

---

### 2026-04-26 (evening) — hn-traffic-multi-prong-plan
- **Tier:** 1 (tactic — multiple parallel layers, each compounds independently)
- **Source:** User asked "find any possible way to bring traffic from Hacker News" after Apr 21 Show HN stalled at 3 pts. Plan written to `~/.claude/plans/find-any-possible-way-fancy-valiant.md` and approved by user.
- **Idea:** Two-track 12-day plan to turn HN from one-shot launch surface into recurring traffic source. **Track 1 (compound credibility)**: karma 25→50+ via 2 unrelated + 1 on-topic comments/day; Apr 21 postmortem; new Algolia HN monitor (`tools/hn-monitor/find-threads.mjs`); cross-pollination doc mapping 10 existing assets to rough comment hooks. **Track 2 (concrete moves)**: ship Lobsters + Bluesky + Mastodon (HN feeders, drafts already exist at `marketing/launch-posts/2026-04-26-untapped-venues.md`); defer Apr 27 Show HN fallback to May 6-8; daily on-topic comment via cross-pollination map; submit a regular HN Story (not Show HN) once karma ≥30 — strongest candidate is the MCP "8→5 tools" blog post.
- **Why it might fit Developer-Investor:** HN is the densest concentration of dev-investors per page-view of any platform. Show HN attempts cost reputation per attempt, so the right play is to make each attempt count by building account credibility first, while harvesting comment-driven traffic in parallel.
- **Setup cost:** Claude time today ~2hr (postmortem + monitor + cross-pollination doc + edits). User cost: ~10 min/day (1-3 paste comments after rewriting in own voice) + ~18 min one-time for Lobsters/Bluesky/Mastodon Apr 27.
- **Files created:** `marketing/hn-seeding/postmortem-2026-04-21.md`, `tools/hn-monitor/find-threads.mjs`, `marketing/hn-cross-pollination.md`. **Edited:** `brunson/launch-plan.md` (deferred Apr 27 fallback), `monitoring/build-dashboard.py` (refreshed HN stat).
- **Decision:** promoted-to-experiment — Apr 27 starts daily on-topic cadence; Apr 27 ship Lobsters/Bluesky/Mastodon; Apr 30 first regular Story submission once karma ≥30; May 5 angle gate-check; May 6-8 next Show HN.
- **Decision reason (promoted):** Apr 21 attempt failed because account had no karma cushion (6) and a generic URL (`/predicted`). Mechanical fix is karma-build + deep-link URL. The on-topic comment cadence + Lobsters/Bluesky/Mastodon are pure-additive and don't conflict with anything else in the plan.
- **🚨 STATUS UPDATE 2026-04-26 (T+9h): HALTED.** `npm run hn:replies` surfaced 12/12 recent comments are `[flagged]`/`[dead]`/`[deleted]` — account is in shadow-cycle. Show HN deferred indefinitely. All HN comment posting halted Apr 27 → May 3 reassessment. Apr 27 Lobsters/Bluesky/Mastodon ship UNCHANGED (independent surfaces, not affected). See `marketing/hn-seeding/postmortem-2026-04-25.md` for revised plan + recommended dang-email recovery path.

---

### 2026-04-26 (evening) — reddit-7-layer-traffic-plan
- **Tier:** 1 (tactic — multiple parallel layers, each is its own experiment)
- **Source:** User asked "find any possible way to bring traffic from reddit" after PH editorial did NOT feature the launch (votesCount=0 at T+8h). Plan written to `~/.claude/plans/find-any-possible-way-velvet-giraffe.md` and approved by user.
- **Idea:** 7-layer Reddit strategy. L1: re-stage existing PH-state-safe drafts (mostly already done — drafts revised at T+8h). L2: 7 untapped subs (r/quant, r/algotrading, r/programming, r/InternetIsBeautiful, r/buildinpublic, r/datascience, r/PythonForFinance). L3: AEO pillar comments on Google-page-1 Reddit threads for 8 target queries (highest-leverage layer). L4: wiki/sidebar submissions for 8 subs. L5: 6 weekly recurring megathread slots. L6: newsjack receipts when tracked startups raise. L7: post-PH transparent retro to r/SideProject + r/IH + r/ERA + r/microsaas.
- **Why it might fit Developer-Investor:** every layer targets dev-first or quant-first audience. MCP server is the wedge in r/programming/r/cursor/r/ClaudeAI/r/datascience. SSRN paper is the credibility anchor for r/quant/r/algotrading/r/VC-comments. /receipts is the viral self-test for r/SideProject/r/IIB/r/IH. Newsjack receipts give permanent proof-of-taste to r/technology/r/business/r/startups.
- **Setup cost:** drafts already shipped (~2hr Claude time today). User cost: ~30-45 min/day of manual posting Mon Apr 27 → Mon May 4. AEO comments compound, wiki submissions persist.
- **Files:** All draft + tracker files in `marketing/reddit/` (7 new files): README.md, post-launch-retro-2026-04-27.md, layer-2-untapped-subs.md, aeo-target-threads.md, wiki-submissions.md, megathread-calendar.md, newsjack-monitor.md
- **Decision:** promoted-to-experiment — Mon Apr 27 is the start. Weekly review Sundays.
- **Decision reason (promoted):** PH no-feature creates a narrative window for the post-PH retro (Layer 7) to outperform the launch itself. AEO (Layer 3) is the highest-leverage discovery — Reddit comments now dominate Google AI Overview citations. Wiki listings (Layer 4) compound forever. None of the layers conflict with the durable rules (anonymity, no-automation, comments-only on r/VC, paid skipped).

---

### 2026-04-19 — autonomous-video-pipeline
- **Tier:** 2 (time-boxed opportunity — value gated on post-launch funnel data)
- **Source:** Maryan asked about YouTube/TikTok this evening; Claude proposed Remotion + ElevenLabs + YouTube Shorts pipeline; both agreed to defer until post-launch
- **Idea:** Auto-render a 25-second 1080x1920 MP4 every Monday from the Signal of the Week (Remotion programmatic slideshow + ElevenLabs TTS voiceover, ~$0.10-0.20/video, 25s output). Auto-publish to YouTube Shorts (Data API v3), @data_nerd Twitter (Chrome MCP), LinkedIn company page (LinkedIn API). Skip TikTok and Instagram Reels.
- **Why it might fit Developer-Investor:** YouTube Shorts skews technical-curious. A clean 25s "here is this week's breakout startup, here is the GitHub commit graph that flagged it" hits the same Dev-Investor we already target. NOT a new audience — same audience, new surface area.
- **Setup cost:** 3-4 hours of Claude time + one-time user OAuth (5 min for YouTube, 5 min for LinkedIn) + ~$5/mo ElevenLabs Starter
- **Decision:** deferred-to-may4 — see scheduled task `video-pipeline-revisit-may4` (fires May 4 10:00 EEST, autonomous decision tree based on PostHog launch-week metrics)
- **Decision reason (deferred):** Russell call: "After launch. After we know the funnel works. THEN we add a channel." Building this pre-launch trades 4 hours that should go to anchor thread quality + campaign queue + Dream 100 presence.

### 2026-04-20 — chrome-extension-signal-of-week-teaser
- **Tier:** 1 (tactic)
- **Source:** Weekly signal automation (Variant 15)
- **Idea:** Add "Signal of the Week" one-liner to Chrome extension popup — refreshes weekly with current top signal and links to /predict.
- **Why it might fit Developer-Investor:** Dev-investors who have the extension installed get a weekly touchpoint without opening a new tab.
- **Setup cost:** ~1hr engineering (hardcode or API-fetch from signals endpoint)
- **Decision:** pending

### 2026-04-20 — mcp-response-footer-signal-of-week
- **Tier:** 1 (tactic)
- **Source:** Weekly signal automation (Variant 18)
- **Idea:** Append "Signal of the Week: X (+Y% velocity, Z signal type)" to get_signals_summary and get_trending_startups MCP tool responses.
- **Why it might fit Developer-Investor:** Dev-investors using the MCP tool get contextual discovery with zero extra friction.
- **Setup cost:** ~30min engineering in mcp-server/src/server.ts
- **Decision:** pending

### 2026-04-20 — shortform-video-production
- **Tier:** 1 (tactic — manual version first, then automate)
- **Source:** Weekly signal automation (Variant 20)
- **Idea:** Produce one 15s screen-recording video per week from the Signal of the Week data. Script ready in repurpose-blast-2026-04-20/20-shortform-video-script.md. Post to YouTube Shorts + Twitter/X.
- **Why it might fit Developer-Investor:** Visual proof-of-product with concrete numbers. Same audience, new surface. Low production barrier with screen recording.
- **Setup cost:** 20min manual recording + 10min edit. Can automate later with Remotion (see autonomous-video-pipeline idea).
- **Decision:** pending — check post-launch funnel before committing weekly video production time.

### Template for each entry

```
### YYYY-MM-DD — <short-name>
- **Tier:** 1 / 2 / 3
- **Source:** where / who
- **Idea:** one-sentence description
- **Why it might fit Developer-Investor:** 1-2 sentences
- **Setup cost:** hours/days + any dependencies
- **Decision:** [pending / promoted-to-experiment / killed]
- **Decision reason (if killed or promoted):**
```
