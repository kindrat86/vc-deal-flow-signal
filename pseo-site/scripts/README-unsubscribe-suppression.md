# Email unsubscribe / opt-out suppression

Opt-out (unsubscribe) state is compliance-sensitive PII (CAN-SPAM / GDPR
suppression). It must live in the systems that gate sends, **never** in a flat
JSON file in the repo.

## Where opt-out state actually lives

```
signup ─▶ Resend audience (unsubscribed: true|false)      ◀── SOURCE OF TRUTH
              │  (hourly) monitoring/sync-resend-to-pb.py
              ▼
        PocketBase `subscribers` (status: active|unsubscribed)   ◀── mirror
              │
              ▼
   email-api/send-weekly-digest.mjs  →  filter=(status='active')  →  send
```

- `pseo-site/app/api/{subscribe,subscribe-mcp,verify}/route.ts` write subscribers
  into the **Resend** audience.
- The send path reads **PocketBase `subscribers`** (`status='active'`), minus a
  hardcoded tester/bot list (`email-api/excluded-emails.mjs`).
- The legacy file `pseo-site/data/unsubscribed-emails.json` was read **only** by
  the stats dashboard (`monitoring/build-dashboard.py`). It never suppressed a
  real send.

> ⚠️ **Consequence:** anyone who was added *only* to that flat file may still be
> `unsubscribed:false` in Resend (and `status='active'` in PB) and therefore
> **still receiving the weekly digest.** Running the suppression below closes
> that gap.

## 1. Suppress the opt-outs in the real stores

```bash
# Dry run, reads the local (gitignored) flat file, shows what it would do:
node pseo-site/scripts/suppress-unsubscribes.mjs

# Apply (needs RESEND_API_KEY; PB mirror also written if POCKETBASE_URL + admin creds set):
node pseo-site/scripts/suppress-unsubscribes.mjs --send
```

Env: `RESEND_API_KEY` (required), `RESEND_AUDIENCE_ID` (optional),
`POCKETBASE_URL` + `POCKETBASE_ADMIN_EMAIL` + `POCKETBASE_ADMIN_PASSWORD`
(optional, enables the PB mirror write; otherwise the hourly Resend→PB sync
catches up).

The script is idempotent and masks addresses in its output.

## 2. Verify

- Resend dashboard → Audience → Contacts: each address shows **Unsubscribed**.
- PB `subscribers`: each record `status = "unsubscribed"`.
- Confirm the next digest dry-run excludes them
  (`send-weekly-digest.mjs` without `--send`).

## 3. Point the stats dashboard at PocketBase (remove the flat-file read)

`monitoring/build-dashboard.py` (lives on the ops branch, not `main`) currently
reads the flat file. Replace the file read with a PB query so it derives
unsubscribers from the source the send path uses:

```python
# OLD, flat-file read (delete this block):
# unsubscribed_emails = set()
# _unsub_path = os.path.join(PROJECT_DIR, "pseo-site", "data", "unsubscribed-emails.json")
# try:
#     with open(_unsub_path) as _f:
#         unsubscribed_emails = {(e.get("email") or "").lower()
#                                for e in (json.load(_f).get("emails") or []) if e.get("email")}
# except FileNotFoundError:
#     pass

# NEW, derive from PB subscribers (already fetched as `contacts` in this script):
unsubscribed_emails = {
    (c.get("email") or "").lower()
    for c in contacts
    if c.get("status") == "unsubscribed" or c.get("unsubscribed")
}
```

## 4. Delete the flat file

Once steps 1-3 are done and verified:

```bash
rm pseo-site/data/unsubscribed-emails.json   # gitignored; no longer drives anything
```

## 5. Prevent recurrence (manual opt-outs)

Manual unsubscribes today come in as replies to `mailto:signals@gitdealflow.com
?subject=Unsubscribe` (the `List-Unsubscribe` header on every send). There is no
automated handler for those, they were being hand-added to the flat file.
Follow-up: either wire a one-click `List-Unsubscribe-Post` URL to the existing
`email-api` `/unsubscribe` endpoint (which already PATCHes PB
`subscribers.status`), or document a runbook step to mark mailto-replies
unsubscribed via this script (`--email …`).
