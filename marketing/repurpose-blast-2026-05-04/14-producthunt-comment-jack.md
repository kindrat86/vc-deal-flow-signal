# Variant 14 — Product Hunt comment-jack

**Status:** DRAFT ONLY. Per memory `project_ph_post_launch_strategy`, daily Tier-1 cadence is 3 comments in Dev Tools + AI categories. Use this comment template, do NOT auto-post.
**CTA:** /predict (single, only if relevant to the launching product)
**Comment style:** value-first, not a pitch. Tie airbytehq's pattern to the launching product's category.

---

## Targeting heuristic

Find a Product Hunt launch today (any maker, any category) where the product is one of:

1. **A data integration / ETL / reverse-ETL tool** — direct category overlap with airbytehq
2. **A GitHub analytics or developer-velocity tool** — category overlap with the methodology
3. **A founder-facing AI agent / IDE plugin** — fits the "ask Claude / Cursor about the signal" angle
4. **An MCP server (any category)** — fits the MCP install hook

Skip everything else. A forced category fit reads as spam.

## Comment templates

### Template A — data integration / ETL launch

```
Congrats on the launch. The question that always comes up in this category is "how does the project trajectory compare to the open-source incumbent?" — for whatever it is worth, airbytehq cleared the engineering-acceleration gate this week (+866% commit velocity over 14 days, 100 contributors). The pattern usually precedes either a major product launch or a fundraise. So the incumbent's bar just moved a notch.

If you want a side-by-side velocity score against airbytehq for your repo, drop the URL here: https://signals.gitdealflow.com/predict
```

### Template B — GitHub analytics or velocity tool

```
Congrats on the launch. Curious how you handle the noisy-spike problem — a 3-person team triples its commits and reads +1000% off a small baseline, but the signal is meaningless. The single rule that improves the signal-to-noise the most for me is gating on contributor count >= 15. A 100-person org accelerating in lockstep (airbytehq this week, +866%) is much harder to fake than a sprint by 3 engineers. Worth thinking about as a default in your scoring layer.
```

### Template C — founder-facing AI agent or IDE plugin

```
Congrats on the launch. If you want a lightweight integration test, our MCP server returns startup velocity signals for any GitHub org. `npm install -g @gitdealflow/mcp-signal`, then ask Claude or Cursor "Show me the GitDealFlow signal for airbytehq" — should round-trip cleanly through your agent. Free, non-gated. Happy to debug if anything breaks.
```

### Template D — MCP server launch

```
Congrats on landing the launch. Quick question on the discovery side — how are you handling MCP registry submissions? We landed in MCP Registry and Glama this month and the signal-amplification difference between "in registry" and "GitHub-only" was bigger than I expected. The catch is that the JWT for mcp-publisher silently expires after about 8 days, so the publish step needs an interactive re-auth. Watch for that one.
```

## Don't do these

- Don't link to anything other than /predict (Template A) or the MCP install command (Template C). One CTA per comment.
- Don't post all four. One comment per launch, per day. Three launches per day, max.
- Don't post the same template twice in a week. Cycle.
- Don't use em-dashes (per discipline rule).
