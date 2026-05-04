# Untapped Venue Drafts — Launch Day Apr 26, 2026

> ⚠️ **REVISED 2026-04-26 T+8h.** PH listing is created but NOT featured (`featuredAt: null`). PH-state-safe drafts below lead with "shipped a free MCP server" (which is true) and DROP all PH-launch references. If PH features the listing later, you can append a "btw also live on PH today: [URL]" line — but the drafts STAND on their own without it. The Bluesky variant previously called us "first PH launch agents can call" — that line is removed since it's not yet true.

**Purpose:** Three dev-aligned venues. Each is a 50–150 word hand-postable draft for the user. Not auto-posted (consistent with the no-LinkedIn/no-Reddit-automation discipline applied to all third-party platforms).

**Common rules:**
- Lead with the technical hook (MCP server shipped today)
- DROP PH framing — re-add only if PH features the listing
- No emojis (per Brunson voice)
- Each post links to `/api/a2a` or the npm package — NOT the PH URL

---

## 1. Lobste.rs — Technical post (HIGHEST PRIORITY)

**Skip-condition:** ONLY post if you have a Lobste.rs invite-tree account in good standing. Posting from a fresh account = auto-flagged. If no account, leave this section unposted.

**Tag:** `programming` + `practices` (do NOT use `show` — too marketing-adjacent for Lobste.rs culture)

**Title:** *MCP server for GitHub momentum signals (free, open data)*

**URL submission:** `https://www.npmjs.com/package/@gitdealflow/mcp-signal`

**Optional first comment by you (to seed discussion, posted within 5 min of submission):**
```
Built this over four weeks while researching whether public GitHub activity is a usable leading indicator for fundraise events. Methodology paper at ssrn.com/abstract=6606558 if you want the academic version.

Five tools, all free, no auth: get_trending_startups, search_startups_by_sector, get_startup_signal, get_signals_summary, get_methodology. The agent-card lives at signals.gitdealflow.com/.well-known/agent-card.json for anyone wiring it into a custom client.

Honest limitations:
- ~4,200 orgs sampled, weekly refresh
- No GitLab/Bitbucket coverage (data density is too low)
- 35-40% false-positive rate on "accelerating signals didn't precede fundraise within 6 months"
- Public data only — bot-only repos filtered at ranking step

Happy to answer questions on the methodology or signal classification.
```

**Why Lobste.rs:** small audience but the highest signal-to-noise of any tech aggregator. One front-page placement = ~3K targeted dev visits + permanent backlink. The PH launch is incidental — Lobste.rs allergic to "we launched today!" framing, so we frame it as "I shipped this; here's the methodology."

---

## 2. Bluesky — short thread (3 posts)

**Skip-condition:** none — Bluesky has no invite gating in 2026. Just need an account.

**Account:** create or use existing @data_nerd handle on Bluesky (verify identity matches Twitter handle to keep cross-platform proof-of-taste).

**Post 1 (288 chars max — Bluesky cap is 300):**
```
Shipped a free MCP server for GitHub momentum signals today. 4,200 startup orgs, weekly refresh, 5 tools your agent can call directly. `npx -y @gitdealflow/mcp-signal` and Claude or Cursor has it in 30 seconds. No proprietary data, no sign-up.
```

**Post 2 (reply, 270 chars — REVISED to drop PH claim):**
```
The differentiator isn't the UI. It's the A2A endpoint. We exposed get_launch_status as a callable skill — ask your agent about our shipping state and it gives a calibrated, honest answer (featured / pending review / off-cycle). Endpoint's at signals.gitdealflow.com/api/a2a.
```

**Post 3 (reply, 240 chars):**
```
Methodology paper: ssrn.com/abstract=6606558. Code: github.com/gitdealflow/mcp-signal. Honest limits: ~35% false-positive rate, GitHub-only, weekly cadence. If you build with it, would love to hear what breaks.
```

**Why Bluesky:** dev-builder cluster on Bluesky has been growing through 2025-2026. Cross-pollinates with the same swyx/Gergely/danshipper audience but with less algorithm gating than X. Likely <500 immediate engagements but high quality.

**Optional follow-up (if any of the 3 posts gets >5 replies):** quote-post one of them with "btw we're on PH today" — but ONLY if engagement is already alive. Per memory: target conversations, not people.

---

## 3. Mastodon (fosstodon.org) — single toot + reply

**Skip-condition:** account must be on `fosstodon.org` specifically (FOSS-friendly instance, allows promo if framed openly). DO NOT post on `mastodon.social` — culture mismatch.

**Toot 1 (450 chars max in default config):**
```
Shipped @gitdealflow/mcp-signal today — a free Model Context Protocol server for GitHub momentum signals. Public data only, weekly refresh across 4,200 startup orgs.

Five tools, no auth, MIT licensed:
- get_trending_startups
- search_startups_by_sector
- get_startup_signal
- get_signals_summary
- get_methodology

`npx -y @gitdealflow/mcp-signal` plugs into Claude Desktop, Cursor, or any A2A-compatible client.

Methodology: ssrn.com/abstract=6606558
Repo: github.com/gitdealflow
```

**Reply (480 chars):**
```
Why I built it: most VC tooling is $10-20K/yr per seat and gates the underlying data. The methodology — engineering acceleration as a leading indicator for fundraise events — is honestly not proprietary. The signal is in public GitHub data. The wedge is making it cheap, fast, and agent-callable.

Free tier stays free forever. Paid layer is for the dashboard + alerts. The MCP tools never get gated.

Building in public. Honest about the 35% FP rate.
```

**Why Mastodon (fosstodon):** FOSS culture appreciates "open methodology + free tier never gated" pitch. Audience is small (fosstodon ≈ 70K MAU) but high credibility. The launch is incidental — primary hook is "shipped FOSS-aligned MCP."

---

## SKIPPED venues (with reasons)

- **Tildes** — no community history on the account, auto-flagged
- **r/datasets** — Kaggle-style download expectation; our data is API-only (mismatch)
- **r/EntrepreneurRideAlong** — Sunday-vibes culture mismatch with operator tone
- **HN /show** — already covered by Wave 2 Show HN at 15:00 EEST
- **daily.dev /squads** — submission window is 24-48h, won't impact today's surge; deferred to May 3 per existing plan

---

## Posting cadence (suggested)

| Time (EEST) | Venue | Effort |
|---|---|---|
| 15:30 | Lobste.rs (if account exists) | 5 min |
| 17:00 | Bluesky (3-post thread) | 8 min |
| 19:00 | Mastodon fosstodon | 5 min |

Total: ~18 minutes if all three are postable, plus monitoring inbound replies.

## Tracking

- All venues link to `npm package` or `signals.gitdealflow.com/api/a2a` — PostHog will see referrer
- Append posting to `marketing/daily-marketing-log.md` with `2026-04-26` entry: "Untapped venues: Lobste.rs ✅/❌, Bluesky ✅/❌, Mastodon ✅/❌"
