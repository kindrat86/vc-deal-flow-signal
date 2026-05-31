#!/usr/bin/env python3
"""Reconcile Resend sends → PocketBase email_log.

Why this exists
---------------
Per-recipient senders (email-api/index.mjs soap opera, send-weekly-digest.mjs)
write an email_log row on each send. But the high-volume paths — the daily
seinfeld note and the Sunday digest — go out via Resend *broadcasts*, fired from
a Vercel cron (pseo-site/app/api/cron/daily-seinfeld). That cron cannot reach the
local PocketBase (PB_URL is 127.0.0.1 / tailnet), so those sends never get an
email_log row. The dashboard was then left guessing a subscriber's position from
Resend subject lines, which only recognises the 5 soap-opera subjects — so people
who finished the soap opera and moved onto the digest stayed frozen at
"Soap Opera N/5".

This script runs locally (it has PB access), pulls the Resend /emails history,
and writes the missing email_log rows. It is the system of record for broadcast
sends. Idempotent: re-runs skip anything already logged.

Usage:
  python3 sync-email-log.py              # reconcile + write
  python3 sync-email-log.py --dry-run    # report what it would write, no writes
  python3 sync-email-log.py --limit 50   # cap writes (testing)
"""

import json
import os
import sys
import time
import urllib.request
import urllib.error
from datetime import date

from email_classify import classify_email_key, status_from_event

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
ENV_FILE = os.path.join(PROJECT_DIR, "email-api", ".env")
LOG_FILE = os.path.join(SCRIPT_DIR, "sync-email-log.log")

DRY_RUN = "--dry-run" in sys.argv
LIMIT = 0
for i, a in enumerate(sys.argv):
    if a == "--limit" and i + 1 < len(sys.argv):
        LIMIT = int(sys.argv[i + 1])

# Resend pagination is hard-capped to avoid a runaway; each page is 100 emails.
MAX_PAGES = 50


def log(msg):
    line = f"{date.today().isoformat()} | {msg}"
    with open(LOG_FILE, "a") as f:
        f.write(line + "\n")
    print(msg)


# ---------------- env ----------------
env = {}
with open(ENV_FILE) as f:
    for line in f:
        line = line.strip()
        if "=" in line and not line.startswith("#"):
            k, v = line.split("=", 1)
            env[k.strip()] = v.strip().strip('"').strip("'")

RESEND_API_KEY = env["RESEND_API_KEY"]
PB_URL = env.get("PB_URL", "http://127.0.0.1:8090")
PB_EMAIL = env.get("PB_EMAIL", "")
PB_PASSWORD = env.get("PB_PASSWORD", "")


def http(url, data=None, headers=None, method=None, retries=5):
    headers = headers or {}
    headers.setdefault("User-Agent", "gitdealflow-synclog/1.0")
    body = None
    if data is not None:
        body = json.dumps(data).encode()
        headers.setdefault("Content-Type", "application/json")
    last_err = None
    for attempt in range(retries):
        req = urllib.request.Request(url, data=body, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.loads(resp.read())
        except urllib.error.HTTPError as e:
            # Resend rate-limits with 429/403; back off and retry.
            if e.code in (429, 403, 500, 502, 503) and attempt < retries - 1:
                time.sleep(2 ** attempt)
                last_err = e
                continue
            raise RuntimeError(f"HTTP {e.code} {url}: {e.read().decode()}")
        except urllib.error.URLError as e:
            if attempt < retries - 1:
                time.sleep(2 ** attempt)
                last_err = e
                continue
            raise
    raise RuntimeError(f"giving up on {url}: {last_err}")


# ---------------- PocketBase ----------------
def pb_auth():
    data = http(
        f"{PB_URL}/api/collections/_superusers/auth-with-password",
        data={"identity": PB_EMAIL, "password": PB_PASSWORD},
    )
    return data["token"]


def pb_fetch_all(token, collection):
    out, page = [], 1
    while True:
        data = http(
            f"{PB_URL}/api/collections/{collection}/records?perPage=500&page={page}",
            headers={"Authorization": token},
        )
        out.extend(data.get("items", []))
        if not data.get("items") or page >= data.get("totalPages", 1):
            break
        page += 1
    return out


def pb_create_log(token, row):
    http(
        f"{PB_URL}/api/collections/email_log/records",
        data=row,
        headers={"Authorization": token},
    )


# ---------------- Resend ----------------
def resend_all_emails():
    """Page through Resend /emails (newest first). Same source the dashboard's
    SENT column uses, so email_log ends up consistent with it."""
    collected, after = [], None
    for _ in range(MAX_PAGES):
        url = "https://api.resend.com/emails?limit=100"
        if after:
            url += f"&after={after}"
        r = http(url, headers={"Authorization": f"Bearer {RESEND_API_KEY}"})
        data = r.get("data") or []
        if not data:
            break
        collected.extend(data)
        if not r.get("has_more"):
            break
        after = data[-1]["id"]
        time.sleep(0.5)  # be gentle with the rate limiter
    return collected


def norm_sent_at(created_at):
    """Resend 'created_at' is '2026-04-20 16:30:28.882432+00'. PB accepts an ISO
    datetime; normalise to 'YYYY-MM-DD HH:MM:SS.000Z'."""
    s = (created_at or "").strip()
    if not s:
        return ""
    base = s[:19]  # 'YYYY-MM-DD HH:MM:SS'
    return f"{base}.000Z"


def main():
    log(f"--- sync-email-log {'(DRY RUN) ' if DRY_RUN else ''}---")
    token = pb_auth()

    subs = pb_fetch_all(token, "subscribers")
    email_to_id = {(s.get("email") or "").lower(): s["id"] for s in subs if s.get("email")}
    log(f"PocketBase subscribers: {len(email_to_id)}")

    seqs = pb_fetch_all(token, "email_sequences")
    subject_to_key = {
        (s.get("subject") or "").strip(): s.get("key")
        for s in seqs
        if s.get("subject") and s.get("key")
    }

    existing = pb_fetch_all(token, "email_log")
    seen_resend_ids = {e.get("resend_id") for e in existing if e.get("resend_id")}
    seen_sub_key = {
        (e.get("subscriber"), e.get("email_key"))
        for e in existing
        if e.get("subscriber") and e.get("email_key")
    }
    log(f"Existing email_log rows: {len(existing)}")

    emails = resend_all_emails()
    log(f"Resend emails fetched: {len(emails)}")

    created, skipped_nonsub, skipped_dup, skipped_confirm = 0, 0, 0, 0
    by_label = {}

    # Oldest first so rows land in chronological order.
    for e in sorted(emails, key=lambda x: x.get("created_at") or ""):
        subject = (e.get("subject") or "").strip()
        if subject.startswith("Confirm your email"):
            skipped_confirm += 1
            continue
        recipients = e.get("to") or []
        to = (recipients[0] if recipients else "").lower()
        sub_id = email_to_id.get(to)
        if not sub_id:
            skipped_nonsub += 1
            continue

        resend_id = e.get("id") or ""
        created_at = e.get("created_at") or ""
        key = classify_email_key(subject, created_at, subject_to_key)

        if (resend_id and resend_id in seen_resend_ids) or (sub_id, key) in seen_sub_key:
            skipped_dup += 1
            continue

        row = {
            "subscriber": sub_id,
            "email_key": key,
            "subject": subject[:300],
            "resend_id": resend_id,
            "status": status_from_event(e.get("last_event")),
            "sent_at": norm_sent_at(created_at),
        }

        by_label[key.split("-")[0]] = by_label.get(key.split("-")[0], 0) + 1

        if DRY_RUN:
            created += 1
        else:
            try:
                pb_create_log(token, row)
                created += 1
            except Exception as ex:
                log(f"  FAILED to write {to} {key}: {ex}")
                continue

        # Mark seen so a duplicate within this same run isn't written twice.
        if resend_id:
            seen_resend_ids.add(resend_id)
        seen_sub_key.add((sub_id, key))

        if LIMIT and created >= LIMIT:
            log(f"  hit --limit {LIMIT}, stopping")
            break

    verb = "would write" if DRY_RUN else "wrote"
    log(
        f"Done. {verb} {created} email_log rows "
        f"(by type: {by_label}); skipped {skipped_dup} dup, "
        f"{skipped_nonsub} non-subscriber, {skipped_confirm} confirm."
    )


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        log(f"ERROR: {e}")
        sys.exit(1)
