# Pinned Tweet Draft — Agent-Callable Launch (Move 1 companion)

**Purpose:** A pinned tweet on @data_nerd (the Twitter handle from `reference_twitter.md`) that demonstrates the agent-callable launch payload at `/api/a2a`. This is the differentiator no other PH launch today has.

**Posting method (per memory `feedback_twitter_compose_method.md`):** ONE `insertText` only on a fresh editor; never clear-and-reinsert in same session.

**Constraint:** @data_nerd is on Twitter free tier — 280-char cap per tweet (per memory `reference_twitter.md`).

**Timing:** post when production deploy is live AND a `curl https://signals.gitdealflow.com/api/a2a | jq .launch.active` returns `true`. Pin immediately after posting.

---

## Variant A — single tweet (most viral, 270 chars)

```
Just shipped a small thing nobody else on Product Hunt today has:

Ask Claude or Cursor "is GitDealFlow live on Product Hunt right now?" — they actually know.

Our /api/a2a endpoint exposes a launch flag. First agent-discoverable PH launch.

producthunt.com/posts/vc-deal-flow-signal
```

**Why it works:** the screenshot/quote-tweet bait is "an agent answered yes." The PH URL is in the tweet, not as the headline.

**Char count:** 270 (incl. URL ≈ 23-char t.co shortener — Twitter shortens to ~23 chars regardless of length).

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

## Recommended sequence

1. **Variant A as the pinned tweet** (single tweet — short attention budget, plenty of substance).
2. **Variant C** as a follow-up quote-tweet ~30 min later, once user produces the Claude screenshot.
3. **Variant B** is a backup if the user has time only for one thread but wants more substance.

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
curl -s https://signals.gitdealflow.com/api/a2a | jq '.launch | {active, ph_url, hours_remaining}'
```

Expected output:
```json
{
  "active": true,
  "ph_url": "https://www.producthunt.com/posts/vc-deal-flow-signal",
  "hours_remaining": <some-positive-int>
}
```

If `active` is `false` or the curl fails, do NOT post — the tweet's claim is unverifiable until the endpoint reflects reality.
