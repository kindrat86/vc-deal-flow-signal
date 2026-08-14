# Pinned Tweet Draft — Agent-Callable Launch (Move 1 companion)

> ⚠️ **REVISED 2026-04-26 T+8h post-discovery.** Original variants assumed PH listing was featured. It is not (PH GraphQL `featuredAt: null`). Hardened `/api/a2a` now correctly returns `active: false / state: scheduled-pending-feature` until PH features us. Variants below are revised to reflect THAT truthful state — they pivot the angle from "we're live on PH today" to "we shipped the agent-callable infra; PH listing is in queue." If/when PH features the listing, the original "we're live" framing becomes valid again — those variants are preserved at the bottom under "Variants if PH features later".

**Purpose:** A pinned tweet on @sipiteno (the Twitter handle from `reference_twitter.md`) that demonstrates the agent-callable infrastructure at `/api/a2a`. The differentiator (agent-discoverable launch payload) is REAL regardless of PH feature state — the endpoint returns truthful state, which is itself novel.

**Posting method (per memory `feedback_twitter_compose_method.md`):** ONE `insertText` only on a fresh editor; never clear-and-reinsert in same session.

**Constraint:** @sipiteno is on Twitter free tier — 280-char cap per tweet (per memory `reference_twitter.md`).

**Timing (PH-state-safe variants below):** post any time. The endpoint is live and the framing is truthful. Pin immediately after posting.

**Pre-post sanity:** `curl -s https://signals.gitdealflow.com/api/a2a | jq .launch.state`
- `scheduled-pending-feature` → use the SAFE variants below (default today)
- `featured-live` → can also use the original "live now" variants at bottom

---

## SAFE variants (use today — PH-state-truthful)

### Variant A-safe — single tweet (270 chars)

```
Just shipped a small thing for the agent era:

Ask Claude or Cursor "what's GitDealFlow's launch status right now?" — they actually know. Our /api/a2a endpoint reports it live. Honest answers when we're not featured, too.

Try: npx -y @gitdealflow/mcp-signal
```

**Why it works:** the angle is the *infrastructure* (agent-discoverable launch state), not the launch event itself. Even if PH never features us, this is genuinely novel — most products' "are you live?" question requires a human to answer. The screenshot bait is "an agent gave me a calibrated, honest answer."

**Char count:** ~268.

### Variant B-safe — single tweet, alternative angle (266 chars)

```
We built the first MCP server that tells you its own Product Hunt status.

Ask Claude: "Is @gitdealflow live on PH right now?" — it pings /api/a2a and gives you the real state. Featured, scheduled, pending review. Honest.

Install: npx -y @gitdealflow/mcp-signal
```

### Variant C-safe — quote-tweet of agent screenshot (highest leverage)

Workflow:
1. Install MCP: `npx -y @gitdealflow/mcp-signal`
2. In Claude Desktop or Cursor, ask: "Is GitDealFlow live on Product Hunt right now?"
3. Claude calls `get_launch_status`, returns:
   ```
   active: false
   state: scheduled-pending-feature
   headline: "Launch is in PH's review queue, not yet on the daily leaderboard..."
   ```
4. Screenshot Claude's response.
5. Tweet the screenshot with this caption:

**Caption (245 chars):**
```
Asked Claude if we're live on Product Hunt today.

Honest answer: not yet — PH hasn't featured the listing yet, but the MCP server is shipped. The agent told me both, calibrated.

We built the launch-status endpoint to be agent-discoverable.

npx -y @gitdealflow/mcp-signal
```

**Why this is the strongest variant:** the screenshot proves a calibrated, honest response from an agent — that's the actual novelty. Most "agent demos" cherry-pick. Showing a "we're not featured yet" answer from your own product is *more* credible, not less.

---

## ORIGINAL variants (use IF/WHEN PH features the listing — `state: featured-live`)

---

## Variant B — 2-tweet thread (more substance)

**Tweet 1 (264 chars):**
```
Quietly shipped the most fun thing we've built this month:

GitDealFlow is now agent-discoverable.

Ask Claude or Cursor "is GitDealFlow live on Product Hunt right now?" and the agent will tell you yes — by hitting /api/a2a, where we exposed a launch flag today.

Thread on why
```

**Tweet 2 (reply, 277 chars):**
```
Most products on PH today have a tweet thread, a Discord blast, an email blast.

We have all that.

We also have an agent-callable launch payload at signals.gitdealflow.com/api/a2a with a get_launch_status skill.

When agents become the default discovery surface, this is how launches will work.
```

**Tweet 3 (reply, optional, 264 chars):**
```
Try it now:

`npx -y @gitdealflow/mcp-signal`

Then in Claude Desktop or Cursor, ask: "what's trending on GitHub this week?"

Free, no auth, MIT license.

Methodology paper: ssrn.com/abstract=6606558
PH page: producthunt.com/posts/vc-deal-flow-signal
```

---

## Variant C — quote-tweet of an agent screenshot (highest leverage if user can produce screenshot)

Workflow:
1. User opens Claude Desktop
2. User installs MCP server: `npx -y @gitdealflow/mcp-signal`
3. User asks Claude: "Is GitDealFlow live on Product Hunt right now?"
4. Claude calls `get_launch_status` on the A2A endpoint
5. User screenshots Claude's response (which includes the headline + npm one-liner from our payload)
6. User tweets the screenshot with this caption:

**Caption (243 chars):**
```
Asked Claude if we're live on Product Hunt today.

It actually knows. (We exposed it via /api/a2a's get_launch_status skill — first PH launch built for agent discovery.)

Try the same question yourself: `npx -y @gitdealflow/mcp-signal`

producthunt.com/posts/vc-deal-flow-signal
```

**Why this is the strongest variant:** the screenshot IS the proof. Words can describe it; only a screenshot makes it real. Quote-tweetable.

---

## Recommended sequence (revised for current PH state)

1. **Variant A-safe as the pinned tweet** (single tweet — short attention budget, plenty of substance, no PH state misclaim).
2. **Variant C-safe** as a follow-up quote-tweet ~30 min later, once user produces the Claude screenshot showing the honest "not featured yet" answer.
3. **Variant B-safe** is a backup if the user wants a different angle.

If/when PH flips us to featured: any of the original "live now" variants (preserved below) become valid. The hardened endpoint will start returning `active: true / state: featured-live` automatically — no code change needed.

---

## Anti-patterns to avoid (verified against memory)

- ❌ Don't include emojis (Brunson voice, anonymity rules)
- ❌ Don't @mention the PH founder (rrhoover) directly — that's a Dream 100 in-thread reply, not a pinned-tweet move
- ❌ Don't ask explicitly for upvotes in the tweet text — the PH URL is the only ask vehicle
- ❌ Don't post until the production deploy of `/api/a2a launch flag` is verified live
- ❌ Don't pin without first un-pinning whatever was pinned previously (at most one pinned tweet per profile)

## Verification gate

Before posting, run:

```bash
curl -s https://signals.gitdealflow.com/api/a2a | jq '.launch | {active, state, ph_url}'
```

Expected output (TODAY — pending PH feature):
```json
{
  "active": false,
  "state": "scheduled-pending-feature",
  "ph_url": "https://www.producthunt.com/posts/vc-deal-flow-signal"
}
```

→ Use SAFE variants A/B/C-safe.

Expected output if PH features us later:
```json
{
  "active": true,
  "state": "featured-live",
  ...
}
```

→ Original variants A/B/C also become valid.

If the curl fails entirely (5xx, connection error), do NOT post — the central claim ("ask Claude, the endpoint reports it live") becomes unverifiable.
