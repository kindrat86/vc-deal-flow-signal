# Prompt body for `receipts-of-the-week-weekly` scheduled task

Paste into a fresh interactive Claude Code session:

> Create a recurring scheduled task with `mcp__scheduled-tasks__create_scheduled_task`:
> - taskId: `receipts-of-the-week-weekly`
> - cronExpression: `7 8 * * 3` (Wed 08:07 local)
> - description: `Weekly Wed 08:07 — generate, ship, and (when possible) post Receipts of the Week.`
> - notifyOnCompletion: true
> - prompt: (use the body below)

---

Ship the next Receipts of the Week — Wed cadence in Greg Isenberg's 30-day distribution play. Each Wednesday picks a notable developer from a 14-dev seed list (deterministic by date), fetches their /receipts data via the live API, and produces a distribution-ready markdown doc with Twitter / Telegram / Substack / LinkedIn copy.

**Pipeline:**
- Generator: `pseo-site/scripts/generate-receipts-of-the-week.ts` (defaults to next Wednesday)
- Output: `marketing/receipts-of-the-week/YYYY-MM-DD.md`
- Hits live `/api/receipts/[username]` so prod must be reachable.

**Run this, in order:**

1. `cd /Users/sipi/launch-projects/vc-deal-flow-signal/pseo-site`
2. **Generate**: `npx tsx scripts/generate-receipts-of-the-week.ts`. The generator picks "next Wednesday" by default. To override (e.g. thin receipts on the auto pick), pass `--user=<handle>` — proven test cases are `tj` or `gaearon`.
3. **Verify**: read the produced `marketing/receipts-of-the-week/YYYY-MM-DD.md`. Confirm: real top wins (≥1 with months_early > 0), Twitter thread is non-empty, all 4 channels populated. If the pick produced 0 wins, regenerate with `--user=tj` or `--user=gaearon`.
4. **Commit + push**: stage only `marketing/receipts-of-the-week/YYYY-MM-DD.md`. Commit as:
   ```
   receipts-of-the-week: @{handle} ({rank} rank, {N} validated wins)
   ```
   Use the HEREDOC pattern with the Co-Authored-By trailer. Then `git push`.
5. **Post to channels** (per division-of-labor memory: automate Twitter/Telegram/Substack; LinkedIn + Reddit are USER-only):
   - **Twitter**: open `@data_nerd` session in Chrome MCP. Post Tweet 1 from the distribution copy as a main tweet. Add Tweets 2–3 as thread replies. Follow the Twitter compose method feedback (ONE insertText per editor, never clear-and-reinsert). Trim to 280 chars (@data_nerd is not Premium).
   - **Telegram**: open native macOS Telegram app. Post the Telegram message to @gitdealflow channel. Use the arrow button, not Enter. Skip if channel has <10 subs (per `feedback_telegram_low_sub_skip.md`).
   - **Substack Notes**: post the Substack Note via The Data Nerd account.
   - **Skip**: LinkedIn (user handles manually — draft is in the distribution file), Reddit (no good Receipts subs).
   - **If Chrome MCP is unavailable** (`list_connected_browsers` returns []): skip Twitter + Substack auto-posts and document in the ship log so the user can paste manually.
6. **Log results**: append to `marketing/receipts-of-the-week/YYYY-MM-DD-ship-log.md` — Twitter URL, Telegram URL, Substack URL, time posted (or "not posted: <reason>" entries).
7. **Update memory**: save a project memory note that the new Receipts of the Week edition shipped, pick name, posted URLs.

**Hard rules:**
- Never post to LinkedIn or Reddit automatically (per `feedback_no_linkedin_actions.md` + `feedback_no_linkedin_no_reddit_automation.md`).
- Twitter: trim tweets to 280 chars since @data_nerd is not Premium.
- If the seed user's API call returns thin receipts (<2 validated wins), pick a different seed and regenerate — don't ship a weak edition.
- If `/api/receipts` is down, halt and report; don't ship empty drafts.
- Never clobber a hand-edited draft (the generator already reroutes to `-fresh.md` if the target file already exists; respect that).
