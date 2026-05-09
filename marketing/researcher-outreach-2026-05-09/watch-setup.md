# Watch setup — researcher outreach 14-day monitoring

## What's running autonomously

A scheduled Claude task fires daily at **10:01 local Athens time** (07:01 UTC) starting 2026-05-10 and ending 2026-05-23.

- **Task ID:** `researcher-outreach-watch-2026-05-09`
- **Storage:** `~/.claude/scheduled-tasks/researcher-outreach-watch-2026-05-09/SKILL.md`
- **Schedule:** `0 10 * * *` (local time, daily)
- **Auto-disable:** on or after 2026-05-24

## What the daily run does

1. **Polls Resend API** for `last_event` on all 4 send IDs (delivered / bounced / complained / scheduled / opened / clicked).
2. **Detects halt conditions** — if any send returns `bounced` or `complained`, automatically cancels the remaining scheduled sends via Resend `DELETE /emails/{id}`.
3. **Appends a status block** to `daily-status.md` in this directory.
4. **Commits + pushes** the daily log to `origin/main`.
5. **Sends push notification** to the user if anything actionable happened.
6. On day 14, **writes a final summary** and disables itself.

## What it CAN'T do (be aware)

The campaign sends from `signal@gitdealflow.com`, which is on **Zoho Mail**. **No Zoho IMAP credentials are configured** in any project env file, so the daily task **cannot read replies that land in the Zoho inbox.** It can only monitor send-side events via Resend.

This means:
- **Bounce / spam complaint:** detected automatically, halt protocol fires.
- **Inbox reply ("thanks, looks interesting"):** NOT detected — sits in Zoho until you read it manually.
- **Hostile reply:** NOT detected — same.

## To enable full inbox monitoring (optional)

If you want the daily task to also read the Zoho inbox:

1. Generate a Zoho Mail app password at https://accounts.zoho.com/home#security/app_passwords (use a label like "claude-inbox-watcher").
2. Add to `email-api/.env`:
   ```
   ZOHO_IMAP_USER=signal@gitdealflow.com
   ZOHO_IMAP_PASS=<app-password-from-step-1>
   ZOHO_IMAP_HOST=imap.zoho.com
   ZOHO_IMAP_PORT=993
   ```
3. Tell me, and I'll extend the daily task with an IMAP fetch step (uses the existing `postal-mime` package already in `email-api/node_modules/`). No new dependencies needed.

Until then, please paste any reply from researchers into a fresh Claude session so the daily log can record it. The triage rules from `send-log.md` apply.

## Manual override

To pause the watch task at any time:

```bash
# Open the SKILL.md and edit `enabled: true` to `enabled: false`
$EDITOR ~/.claude/scheduled-tasks/researcher-outreach-watch-2026-05-09/SKILL.md

# Or set via API (requires schedule skill loaded)
```

To run it once on demand (test):
- In Claude Code, navigate to "Scheduled" in the sidebar → find this task → click "Run now".

## Files this watch maintains

- `daily-status.md` — appended each day with one ~15-line block.
- `send-log.md` — updated only on halt-protocol events.
- Final summary appended on day 14 to `daily-status.md`, then task auto-disables.
