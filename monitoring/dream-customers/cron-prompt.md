# Cron prompt — Daily Twitter check for Dream Customers CRM

You are running unattended from launchd to refresh the engagement signals on
73 verified VC targets, so the Dream Customers kanban
(`monitoring/dream-customers/dashboard.html`) shows up-to-date "they just
posted" cues each morning.

## Working directory

`/Users/sipi/launch-projects/vc-deal-flow-signal/monitoring/dream-customers/`

Files there:

- `data.json` — single source of truth for the roster + Twitter signals
- `build.mjs` — regenerates `dashboard.html` from `data.json`
- `dashboard.html` — generated; never edit by hand

## What to do — in order

### 1. Sanity check the environment (hard gate)

Run `mcp__Claude_in_Chrome__list_connected_browsers`.

- **Zero browsers connected** → write `cron-skipped-<ISODate>.log` with the
  reason and **exit cleanly**. Do not retry. Next day's run will pick up.
- **More than one browser connected** → same. Per memory entry
  `feedback_chrome_mcp_multi_browser_blocks_cron.md`, never guess deviceId
  in a cron context.
- **Exactly one browser** → continue.

### 2. Read `data.json`

The shape is `{ version, generated_at, contacts: [...] }` where each contact
has `handle`, `name`, `firm`, `role`, `segment`, `confidence`, plus the
mutable fields `last_tweet_at`, `last_tweet_text`, `last_checked_at`.

Build a queue of handles to check this run:

- Skip any handle whose `last_checked_at` is within the last 18 hours
  (idempotent — re-running same morning is a no-op).
- Order remaining handles ascending by `last_checked_at` (oldest first; nulls
  before any timestamp).
- Cap the batch at **40 handles** per run. If the prompt fires daily, the
  whole list (73) is fully covered every ~2 days while keeping each run under
  ~5 minutes of Chrome time.

### 3. For each handle in the queue

1. `mcp__Claude_in_Chrome__navigate` to `https://x.com/<handle>`.
2. Wait briefly for the page to render. Don't sleep more than ~3s.
3. `mcp__Claude_in_Chrome__get_page_text` (markdown form). Look for the
   first tweet (typically rendered as an article with the user's display
   name + handle, followed by tweet text + a timestamp like "2h", "1d",
   or an absolute date).
4. Extract:
   - **`last_tweet_text`** — the tweet body, trimmed to ≤220 chars.
   - **`last_tweet_at`** — absolute ISO8601 timestamp. Convert relative
     forms ("2h", "1d", "Jun 3") to `now() − relative` or to a parsed date
     in UTC.
5. Set `last_checked_at = now()` (ISO8601).
6. If extraction fails (login wall, profile gone, suspended, rate-limited,
   anything weird), leave `last_tweet_*` fields untouched but still update
   `last_checked_at` so the handle moves to the back of the queue. Note
   the issue in the log.

Pace yourself: do not navigate faster than ~one profile per 4 seconds.
X aggressively rate-limits anything that looks scripted.

### 4. Write back `data.json`

- Update each touched contact in place.
- Set `generated_at = now()` (ISO8601) at the top level.
- Atomic-write style: write to `data.json.tmp` first, then `mv` over
  `data.json`. The build script reads this file — a half-written JSON would
  produce a broken dashboard.

### 5. Regenerate the dashboard

Run `node build.mjs` from this directory. It writes `dashboard.html`. No
other side effects.

### 6. Log + exit

- Append a one-line summary to `cron.log`:
  `<ISO> checked=<n> updated=<m> skipped=<k> failed=<f>`
- Exit. Do not commit, push, or open a browser tab.

## Anti-goals

- Do not engage with tweets. No replies, no likes, no follows.
- Do not log into X if a login wall appears. Skip the profile and move on.
- Do not modify `dashboard.html` directly — always go through `build.mjs`.
- Do not touch user-driven state (stage, notes, counter live in browser
  localStorage; the cron must never know about them).
- Do not commit `data.json` from inside this run. The user pulls + opens
  the local file; the cron stays in their working tree.

## If you're invoked interactively (not by launchd)

Same logic, but you may print progress (one line per handle) and you may
answer follow-up questions from the user before exiting. The hard gate in
step 1 still applies: no browser → exit clean.
