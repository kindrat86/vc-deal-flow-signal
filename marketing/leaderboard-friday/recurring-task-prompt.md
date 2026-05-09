# Recurring task: leaderboard-friday-weekly

Run this **once from a fresh Claude Code session** (the scheduled-task system blocks self-spawning from within a scheduled task, so the v1 launch task could not create it itself):

```
Create a scheduled task with these settings:

- taskId: leaderboard-friday-weekly
- cronExpression: 13 8 * * 5     (every Friday 08:13 EEST / local)
- description: Weekly Leaderboard Friday recap — top scouts from PocketBase, distribution-ready Twitter/Telegram/Substack/LinkedIn copy.
- prompt: (use the body below)
```

## Prompt body

Ship the weekly Leaderboard Friday recap. This is the Fri cadence in Greg Isenberg's 30-day distribution play — public ranking creates competition; competition creates retention.

**Pipeline:**
- Generator: `pseo-site/scripts/generate-leaderboard-friday.ts` (defaults to next Friday when run with no `--date`).
- Output: `marketing/leaderboard-friday/YYYY-MM-DD.md`
- Reads `scouts` collection from PocketBase via direct REST. Needs `POCKETBASE_ADMIN_EMAIL` + `POCKETBASE_ADMIN_PASSWORD` env at run time.

**Run, in order:**

1. `cd /Users/sipi/launch-projects/vc-deal-flow-signal/pseo-site`
2. **Load PB env**: `set -a && source .vercel/.env.production.local && set +a`
3. **Generate**: `npx tsx scripts/generate-leaderboard-friday.ts` (no `--date` — defaults to next Friday).
4. **Verify**: read the new `marketing/leaderboard-friday/YYYY-MM-DD.md`. Two valid outcomes:
   a. **Real scouts populated** (top 3 with @handles + points): ship.
   b. **Empty state**: recruitment recap. Default: ship. The recruitment angle still drives /predict signups.
5. **Commit + push**: stage only the new `marketing/leaderboard-friday/YYYY-MM-DD.md`. Use HEREDOC pattern + Co-Authored-By trailer. Commit message:
   ```
   leaderboard-friday: weekly — top scout @{handle} ({pts} pts)
   ```
   (or "recruitment recap" if empty state). Then `git push`.
6. **Post to channels** — automate where possible, defer to user when not:
   - **Twitter (@data_nerd)**: skip if generator emitted empty thread (empty-state). Otherwise check Chrome MCP via `mcp__Claude_in_Chrome__list_connected_browsers` — if `[]`, defer with clear note in ship log; otherwise post Tweet 1 main + Tweets 2–3 as thread replies, ONE insertText per editor, trim to 280 chars.
   - **Telegram**: post via @gitdealflow channel (macOS Telegram app via computer-use). Skip if subs < 10 or computer-use access not granted.
   - **Substack Notes (The Data Nerd)**: post via Chrome MCP. Skip if extension not connected.
   - **Skip**: LinkedIn (user-only — keep the draft in the recap doc), Reddit, HN.
7. **Log**: append to `marketing/leaderboard-friday/YYYY-MM-DD-ship-log.md` — channel URLs + time + skip reasons.
8. **Update memory**: `project_leaderboard_friday_YYYY_MM_DD.md` — top scout, points, posted URLs.

**Hard rules:**
- Never post to LinkedIn or Reddit automatically.
- Twitter: trim tweets to 280 chars; skip entirely if generator emits empty thread.
- If PB is unreachable AND empty-state recap doesn't feel right (rare) — halt and notify user.
- Empty-state recap is acceptable IF the recruitment-angle copy reads cleanly (it does, by design — except Twitter which is empty).
- Never clobber hand-edited drafts; the generator reroutes existing files to `-fresh.md`.
