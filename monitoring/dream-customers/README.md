# Dream Customers CRM — local-only kanban

A private kanban for moving 73 verified VC targets through a 9-stage
conversion ladder. Lives entirely on your machine — no deployment, no
auth, no public surface.

## Open the board

Double-click `dashboard.html` or paste this into a browser:

```
file:///Users/sipi/launch-projects/vc-deal-flow-signal/monitoring/dream-customers/dashboard.html
```

Drag cards between columns. Click a card to edit notes / stage / comment
count. State is stored in your browser's `localStorage` (key
`dream-customers/v1`); it survives across opens but is per-browser.

The 9-stage ladder:

1. **Sourced** — handle verified, in the list (default for everyone)
2. **Followed** — you follow them on X / LinkedIn
3. **Engaged** — you've left N substantive replies (counter +/-)
4. **Acknowledged** — they liked / replied / followed back
5. **Outreach Sent** — cold DM or email sent
6. **In Conversation** — they replied
7. **Trial Signup** — free signup on gitdealflow.com
8. **Paying** — Insider €77/mo or Sector Sweep €1,797
9. **Champion** — referred others / public mention / case study

Cards in stages 1–3 with a recent tweet show an orange "fresh" stripe and
the tweet preview — that's the cron's main job (see below).

## Daily Twitter check (cron)

`run-daily.sh` fires a non-interactive Claude Code session that uses the
Chrome MCP to visit each VC's X profile and capture their latest tweet
into `data.json`. Then it runs `build.mjs` to regenerate `dashboard.html`.

The cron only writes the **cron-collected signal fields**
(`last_tweet_at`, `last_tweet_text`, `last_checked_at`,
top-level `generated_at`). Your stage / notes / counter (browser
`localStorage`) is never touched.

### Install the launchd job (one time)

```bash
cd monitoring/dream-customers

# Install + load
cp com.gitdealflow.dream-customers.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.gitdealflow.dream-customers.plist
launchctl list | grep dream-customers   # should show the job
```

Fires every day at **08:30 local**. Edit `StartCalendarInterval` in the
plist if you want a different slot, then re-load. Picking a morning hour
when your browser is normally open matters — Chrome MCP needs a live
Chrome with the extension connected.

### Trigger a run manually

```bash
./run-daily.sh
# tail the logs while it works
tail -f cron.run.log cron.run.err cron.log
```

If Chrome MCP isn't connected (no browser running, or multiple browsers
open without a designated one), the session exits cleanly within a few
seconds and writes a `cron-skipped-*.log` entry. Next scheduled run picks
it up.

### Pause the cron

```bash
launchctl unload ~/Library/LaunchAgents/com.gitdealflow.dream-customers.plist
```

## Inbound engagement scrape (who engages with YOU)

Separate from the daily "what did they post" check, this captures **inbound
engagement** — who replied to, liked, reposted, or quoted @sipiteno's posts —
so each card shows an engagement **★ score** and a reply/like/repost breakdown
(the PB `engagement_events` collection the dashboard already reads).

Two halves:

- **Read half** — `engagement-cron-prompt.md` is the prompt a Claude session
  reads to drive Chrome MCP over x.com's Notifications tabs
  (`/notifications/mentions` for replies/quotes, `/notifications` for
  likes/reposts). It parses events into a flat JSON array and writes
  `engagement-scratch.json` (gitignored).
- **Write half** — `node sync-engagement.mjs` reads that scratch, matches each
  engager to an existing contact by `x_handle`, dedupes against existing events
  (key: contact + type + tweet_id), assigns points
  (**reply = 7, repost = 3, quote = 3, like = 1**), and inserts inbound events.

**Only dream-customer followers are recorded** by default — matched contacts
that aren't flagged `dream_customer` are skipped + logged. Flag a follower as a
dream customer in the dashboard (click their row → "Dream customer" → Save, or
drag on the Board) before their engagement will be tracked.

```bash
node sync-engagement.mjs                    # dream customers only (default)
node sync-engagement.mjs --dry-run          # preview, write nothing
node sync-engagement.mjs --include-non-dream # record every engager regardless of dream status
node sync-engagement.mjs --create-missing   # also create contacts for non-CRM engagers
```

The dashboard's **📊 Engagement** view shows followers in a table — X account ·
likes · replies · reposts · points — with a **NOT DREAM** badge on non-dream
followers and a "hide non-dream" toggle. Points are computed live from the
weights above (so changing them re-scores everyone without a re-scrape).

**Hard limitation:** X's web UI virtualizes the notifications feed, so a single
run only sees a rolling window of recent events (no full backfill). The job is
designed to run on a schedule and accumulate; re-seeing an event is a deduped
no-op. Reply tweet_ids are the engager's own reply id; like/repost tweet_ids
are a stable hash of the liked post's text (no engager-side id exists).

### Schedule it (launchd)

`run-engagement.sh` + `com.gitdealflow.engagement.plist` mirror the tweet-check
job but fire at **09:00 local** (offset from 08:30 so two Claude sessions don't
contend for Chrome MCP at once).

```bash
cd monitoring/dream-customers
chmod +x run-engagement.sh
cp com.gitdealflow.engagement.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.gitdealflow.engagement.plist
launchctl list | grep engagement      # should show the job

./run-engagement.sh                    # trigger a run manually
launchctl unload ~/Library/LaunchAgents/com.gitdealflow.engagement.plist  # pause
```

## Files

```
data.json                      # roster + cron-collected signals (committed)
build.mjs                      # data.json → dashboard.html (deterministic)
dashboard.html                 # generated; git-ignored or committed, your call
cron-prompt.md                 # prompt body the Claude CLI reads (tweet check)
engagement-cron-prompt.md      # prompt body for the inbound-engagement scrape
sync-engagement.mjs            # engagement-scratch.json → PB engagement_events
run-engagement.sh              # shell wrapper launchd fires (engagement, 09:00)
com.gitdealflow.engagement.plist  # launchd job for the engagement scrape
run-daily.sh                   # shell wrapper launchd fires (tweet check, 08:30)
com.gitdealflow.dream-customers.plist   # launchd job (copy to LaunchAgents)
README.md                      # this file
cron.log                       # one line per run (created on first run)
cron.run.{log,err}             # launchd stdio capture (created on first run)
launchd.{out,err}.log          # launchd's own stream capture
```

## Edit the roster

Edit `data.json` directly to add / remove / re-tag contacts, then run
`node build.mjs` to refresh the HTML. The `handle` field is the unique
key — don't rename handles in place (rename = drop + re-add).

## Reset local state

Inside the dashboard, the **reset local** button clears all
stage/notes/counter state. Useful when you want to re-classify everyone
from scratch.

## Privacy notes

- Page metadata sets `<meta name="robots" content="noindex,nofollow">`.
- The file is served from `file://`; nothing leaves your machine unless
  you commit `data.json` to the repo.
- Decide for yourself whether to commit `data.json` (good for moving
  between machines) or `.gitignore` it (true private notes).
