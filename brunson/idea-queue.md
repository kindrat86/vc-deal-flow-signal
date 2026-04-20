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
