# Cron prompt — Daily Marcus discovery for Dream Customers CRM

You are running unattended from launchd to **find new Marcus-fit VC handles on X**
and append them to `data.json` as Sourced contacts. The signal-refresh cron
(`cron-prompt.md`) handles existing contacts; this cron grows the roster.

A "Marcus-fit" handle is a verifiable individual at a real VC firm in a
General Partner / Partner / Solo GP / Managing Partner / Founder-GP role,
posting substantive content (not just retweets, not a parody/aggregator
account, not a firm-level handle). Operator-angels who aren't running a fund
are out. So are corporate-dev and PE-operating-partner roles — those segments
(C and E) are LinkedIn-only by policy and X discovery would surface false
positives.

## Working directory

`/Users/sipi/launch-projects/vc-deal-flow-signal/monitoring/dream-customers/`

Files:

- `data.json` — single source of truth for the roster
- `build.mjs` — regenerates `dashboard.html` from `data.json`
- `cron.discovery.log` — append one summary line per run

## What to do — in order

### 1. Sanity check the environment (hard gate)

Run `mcp__Claude_in_Chrome__list_connected_browsers`.

- **Zero browsers connected** → write `cron-skipped-discovery-<ISODate>.log`
  with the reason and **exit cleanly**. Do not retry.
- **More than one browser connected** → same. Per memory entry
  `feedback_chrome_mcp_multi_browser_blocks_cron.md`, never guess deviceId
  in a cron context.
- **Exactly one browser** → continue.

### 2. Read `data.json` and build the anchor + dedup sets

Parse `data.json`. Build:

- `existing_handles` — set of every `handle` already in the roster, lowercased.
  This is your dedup gate.
- `anchors` — pool of `handle` values with `confidence === "HIGH"`.
  Pick **5 random anchors** from this pool for this run. Deterministic
  randomness keyed off the ISO date (e.g. hash the date and use that to seed)
  so re-running the same day touches the same anchors — idempotent.
  Across consecutive days, anchors rotate naturally because the seed changes.

### 3. For each anchor — harvest "You might like" / "Who to follow"

For each of the 5 anchors:

1. `mcp__Claude_in_Chrome__navigate` to `https://x.com/<handle>`.
2. Use `mcp__Claude_in_Chrome__find` with query
   `"user handles in You might like or Who to follow recommendations"` —
   X's right-rail recommendations are rendered dynamically and the
   accessibility tree may not populate on first read. If the first call
   returns zero matches, re-call once; if still zero, skip this anchor.
3. From the matches, extract every `@handle` that appears in a
   `link` or `generic` element inside a "You might like" / "Who to follow"
   sub-region.
4. Drop:
   - any handle already in `existing_handles` (dedup),
   - firm-level handles (no underscore-free single word that maps to a
     known firm, e.g. `usv`, `GreylockVC`, `a16z`, `sequoiacap` —
     maintain a small block-list of obvious firm handles in this prompt;
     extend it as you discover more),
   - parody/aggregator handles (e.g. `VCBrags`),
   - operator-angel handles you can't cleanly tie to a fund.

Pace: do not navigate faster than ~1 profile per 4 seconds. X rate-limits
anything scripted-looking.

**Firm-handle block-list (extend over time):** `usv`, `GreylockVC`, `a16z`,
`sequoiacap`, `benchmark`, `accel`, `kpcb`, `firstround`, `foundryvc`,
`bessemervp`, `lightspeedvp`, `Theoryvc`, `craftventures`, `indexventures`,
`generalcatalyst`, `nea`, `khoslaventures`, `redpoint`, `Cowboy_VC`,
`unionsquare`, `flybridge`, `bedrockcap`, `precursorvc`, `slow`,
`weekendfund`, `worklife`, `floodgate`, `xfund`, `sapphirepartners`,
`HustleFund`, `BananaCapital`.

### 4. For each new candidate handle — quick qualification visit

For each candidate that survived dedup + blocklist:

1. Navigate to `https://x.com/<candidate>`.
2. Use `find` with query `"profile bio describing role at venture capital firm"`
   to surface the bio. Pull the displayed name + the bio text.
3. If the bio mentions any of: `Partner`, `General Partner`, `GP`,
   `Managing Partner`, `Founder` (in a fund context), `Investor at
   <firm>`, `Investing at <firm>` — keep. Otherwise drop.
4. From the bio, extract `firm` (best-effort, ≤40 chars), `role` (e.g.
   "Partner", "General Partner", "Founder/GP"; ≤40 chars).
5. Assign a segment heuristically:
   - `A` — handles whose firm is described as solo-GP, micro-VC, seed,
     pre-seed, "I invest in", or a fund founded/led by the candidate.
   - `B` — institutional multi-stage VC partners (Benchmark, Sequoia
     non-AI, USV, Bessemer, etc.). Default fallback when firm name is
     recognizable as multi-stage.
   - `D` — only if firm is ICONIQ Growth.
   - `F` — Sequoia (AI-thesis lead role), Sapphire Partners (LP-side),
     Conviction (AI-thesis), or other "special" Marcus-fit cases.
   - If uncertain, default to `B`. The user will re-segment in the
     dashboard.
6. Always assign `"confidence": "LOW"` for autonomously-discovered
   contacts — the user reviews each new row before bumping confidence.

Cap the run at **8 new contacts maximum**. If you hit the cap mid-anchor,
stop visiting further candidates and proceed to step 5.

### 5. Append to `data.json`

**Schema-detect first.** The on-disk shape has migrated over time. Inspect
the first contact in the existing array and match its fields exactly:

- **v1 (legacy, one-line)** — only `handle`, `name`, `firm`, `role`, `segment`,
  `confidence`, `last_tweet_at`, `last_tweet_text`, `last_checked_at`.
  Append as a single-line object, two-space indent inside `contacts`.
- **v2 (stage-on-disk, multi-line)** — additionally `is_dream_customer`
  (bool), `stage` (e.g. `"sourced"`), `stage_source` (string identifying
  this cron, e.g. `"auto:x-discovery-sweep"`), `stage_updated_at` (ISO8601
  UTC). Append as a pretty-printed multi-line object.
- **v3+** — if you see any fields not listed above, copy their shape from
  the most-recent contact (lowest-handle-position match). Do not invent
  values for unknown fields.

Default values for new contacts (apply only the fields the detected schema
uses):

| Field | Value |
|---|---|
| `confidence` | `"LOW"` (cron-discovered) |
| `is_dream_customer` | `true` |
| `stage` | `"sourced"` |
| `stage_source` | `"auto:x-discovery-sweep"` |
| `stage_updated_at` | `now()` ISO8601 UTC |
| `last_tweet_at` / `last_tweet_text` / `last_checked_at` | `null` |

Then:

- Update top-level `generated_at` to `now()` (ISO8601 UTC) if that key
  exists in the file.
- Atomic-write: write `data.json.tmp` first, then `mv` over `data.json`.
- Hard cap on total size: if `contacts.length` after append would exceed
  **300**, abort the append entirely (do not delete existing rows) and log
  `reason=cap-hit`. The kanban is meant to stay reviewable.

### 6. Regenerate the dashboard

Run `node build.mjs` from this directory.

### 7. Log + exit

- Append one line to `cron.discovery.log`:
  `<ISO> anchors=<n> candidates=<k> kept=<m> blocked=<b> reason=<...>`
- Exit. Do not commit, push, or open additional browser tabs.

## Anti-goals

- Do not follow, reply to, or like anything during discovery.
- Do not log into X if a login wall appears. Skip the candidate and move on.
- Do not modify `dashboard.html` directly — always go through `build.mjs`.
- Do not touch user-driven state (stage, notes, counter live in browser
  localStorage; this cron must never know about them).
- Do not assign `confidence: HIGH` to autonomously-discovered contacts.
  HIGH is reserved for human-verified rows.
- Do not commit `data.json` from inside this run.

## If you're invoked interactively

Same logic, but you may print progress (one line per anchor + one line per
kept candidate) and you may answer follow-up questions from the user before
exiting. The hard gate in step 1 still applies: zero or multiple browsers
→ exit clean.
