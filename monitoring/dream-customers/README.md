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

## Daily Marcus discovery (second cron)

A separate cron, `run-discovery.sh`, **finds new Marcus-fit handles** on X
and appends them as `Sourced` rows. Where the signal cron above refreshes
known contacts, this one grows the roster.

Discovery rules (full text in `cron-prompt-discovery.md`):

- Pick 5 random HIGH-confidence contacts as anchors (deterministic by date).
- Visit each anchor's profile and harvest the "You might like" / "Who to
  follow" sidebar.
- Dedup against existing handles; drop firm-level/parody/operator-only
  recommendations.
- Quick-qualify each candidate by visiting their profile and matching role
  keywords in the bio (Partner / GP / Founder of a fund).
- Append up to 8 new contacts per run with `confidence: LOW` and
  `stage_source: auto:x-discovery-sweep`. You review + bump confidence in
  the dashboard.

### Install the discovery launchd job (one time)

```bash
cd monitoring/dream-customers

cp com.gitdealflow.dream-customers-discovery.plist ~/Library/LaunchAgents/
launchctl load ~/Library/LaunchAgents/com.gitdealflow.dream-customers-discovery.plist
launchctl list | grep dream-customers-discovery
```

Fires every day at **09:15 local** — deliberately 45 minutes after the
signal cron at 08:30 so the two Claude sessions never race for the single
Chrome browser. Edit `StartCalendarInterval` in the plist for a different
slot.

### Trigger a discovery run manually

```bash
./run-discovery.sh
tail -f cron.discovery.run.log cron.discovery.run.err cron.discovery.log
```

### Pause discovery (keeps signal cron running)

```bash
launchctl unload ~/Library/LaunchAgents/com.gitdealflow.dream-customers-discovery.plist
```

If Chrome MCP isn't connected (no browser running, or multiple browsers
open without a designated one), the session exits cleanly within a few
seconds and writes a `cron-skipped-*.log` entry. Next scheduled run picks
it up.

### Pause the cron

```bash
launchctl unload ~/Library/LaunchAgents/com.gitdealflow.dream-customers.plist
```

## Files

```
data.json                      # roster + cron-collected signals (committed)
build.mjs                      # data.json → dashboard.html (deterministic)
dashboard.html                 # generated; git-ignored or committed, your call
cron-prompt.md                 # prompt body the Claude CLI reads
run-daily.sh                   # shell wrapper launchd fires
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
