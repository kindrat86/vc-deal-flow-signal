# Cron prompt — Daily Twitter check for Dream Customers CRM

You are running unattended from launchd to refresh the engagement signals on
74 verified VC targets, so the Dream Customers kanban
(`monitoring/dream-customers/dashboard.html`) shows up-to-date "they just
posted" cues each morning.

## Working directory

`/Users/sipi/launch-projects/vc-deal-flow-signal/monitoring/dream-customers/`

Files there:

- `data.json` — cron scratch for the roster + tweet signals (last_tweet_at /
  last_tweet_text / last_checked_at). NOT the source of truth for editable
  fields anymore.
- `build.mjs` — upserts tweet-signal fields from `data.json` into the
  PocketBase `contacts` collection. No longer regenerates HTML.
- `dashboard.html` — PocketBase-backed kanban opened via `python3 launch.py`.
  Hand-edit it like a normal HTML file; never auto-generated.
- `launch.py` — issues a PB admin token and writes `dashboard.config.js` so
  the dashboard can talk to PB at 127.0.0.1:8090. (Not used by the cron.)
- `migrate-json-to-pb.py` — one-shot importer for new contacts from
  `data.json` into PB. Run after adding rows to `data.json`.

PB is authoritative for stage / dream_customer / notes / display_name / firm
/ role / segment / confidence. The cron only writes tweet-signal fields.

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
3. Read the timeline.
   - `mcp__Claude_in_Chrome__get_page_text` is the fast path but
     unreliable on some profiles (returns "No text content found" when the
     first `<article>` has odd structure).
   - Fall back to `mcp__Claude_in_Chrome__read_page` with
     `filter: "interactive"`, depth 3, max_chars ~5000. Each tweet appears
     as `article [ref_N]` with a `link "<date>"` child whose `href` is
     `/<handle>/status/<tweet_id>`.
   - **Pinned-tweet trap** (smoke test 2026-05-25 hit this on
     @dunkhippo33: pinned tweet was from Jan 2018). The first article is
     often a long-pinned post. Walk the article list and pick the one
     with the most recent `<date>` link — that's the one with reply-now
     value.
4. Extract:
   - **`last_tweet_text`** — the tweet body, trimmed to ≤220 chars.
     `read_page` doesn't return body text; fall back to `get_page_text`
     on the specific article via permalink if the text is required.
     Acceptable to leave empty and only set the date if extraction is
     hard.
   - **`last_tweet_at`** — absolute ISO8601 UTC. The `<date>` link text
     is either relative ("2h", "1d") or an absolute month/day ("May 22");
     convert to a full ISO using `now()` as the anchor. For dates
     without a year, use the current year unless that produces a future
     date — then subtract one year.
5. Set `last_checked_at = now()` (ISO8601).
6. If extraction fails (login wall, profile gone, suspended, rate-limited,
   "No text content found" even after fallback, anything weird), leave
   `last_tweet_*` fields untouched but still update `last_checked_at` so
   the handle moves to the back of the queue. Note the issue in the log.

Pace yourself: do not navigate faster than ~one profile per 4 seconds.
X aggressively rate-limits anything that looks scripted.

### 4. Write back `data.json`

- Update each touched contact in place.
- Set `generated_at = now()` (ISO8601) at the top level.
- Atomic-write style: write to `data.json.tmp` first, then `mv` over
  `data.json`. The build script reads this file — a half-written JSON would
  produce a broken dashboard.

### 5. Sync tweet signals to PocketBase

Run `node build.mjs` from this directory. It reads `data.json` and upserts
the tweet-signal fields (`last_tweet_at`, `last_tweet_text`,
`last_checked_at`) into the PB `contacts` collection, matched by `x_handle`.
It NEVER writes to stage / dream_customer / notes / other user-editable
fields. The dashboard is PB-backed and shows the new signals on next reload —
no HTML rebuild needed.

### 6. Log + exit

- Append a one-line summary to `cron.log`:
  `<ISO> checked=<n> updated=<m> skipped=<k> failed=<f>`
- Exit. Do not commit, push, or open a browser tab.

## Anti-goals

- Do not engage with tweets. No replies, no likes, no follows.
- Do not log into X if a login wall appears. Skip the profile and move on.
- Do not modify `dashboard.html` — it's no longer auto-generated. Hand-edit
  via PR only.
- Do not touch user-driven state. Stage, dream_customer flag, notes, and
  edited display_name/firm/role live in PocketBase. `build.mjs` only writes
  the three tweet-signal fields and must never expand its write scope.
- Do not commit `data.json` from inside this run. The user pulls + opens
  the local file; the cron stays in their working tree.

## If you're invoked interactively (not by launchd)

Same logic, but you may print progress (one line per handle) and you may
answer follow-up questions from the user before exiting. The hard gate in
step 1 still applies: no browser → exit clean.
