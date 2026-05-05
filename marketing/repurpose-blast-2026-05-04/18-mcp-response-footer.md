# Variant 18 — MCP server response footer (engineering task)

**Status:** Engineering backlog item. File a Tier-1 entry in `brunson/idea-queue.md`.

---

## One-line footer to append to MCP tool responses (this week)

```
This week's Signal of the Week: airbytehq (+866% velocity, 100 contributors). https://signals.gitdealflow.com/blog/signal-of-the-week-2026-05-04
```

Char count: 142.

## Where to inject

The MCP server is published as `@gitdealflow/mcp-signal`. The footer lives in the response builder for these tools (per the deferred tool list visible in this session):

- `get_methodology`
- `get_signals_summary`
- `get_startup_signal`
- `get_trending_startups`
- `search_startups_by_sector`

Add a `signalOfTheWeekFooter` field to the JSON response envelope, populated from `/api/signal-of-the-week.json` (the same endpoint introduced in variant 15).

## Backlog entry to add to `brunson/idea-queue.md` (Tier 1)

```
- [ ] Tier 1 — MCP server: append Signal-of-the-Week footer to all tool responses. Pulls from /api/signal-of-the-week.json (created in variant 15). Updates weekly without an MCP republish (server fetches at runtime, 6h TTL). Effort: 2 hours. Owner: Claude (next eng cycle).
```

## Why this matters

Per memory `feedback_mcp_publisher_jwt_8d`, every full re-publish needs interactive `mcp-publisher login github`. A runtime-fetched footer avoids weekly republishes. The footer changes; the published code does not.

## Acceptance criteria

- Footer present on all 5 tool responses
- Footer not present when the upstream JSON 404s (graceful skip, not error)
- 6h client cache so repeated tool calls in a session don't re-fetch
