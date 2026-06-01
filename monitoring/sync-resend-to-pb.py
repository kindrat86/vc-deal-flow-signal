#!/usr/bin/env python3
"""Sync Resend Audience contacts into PocketBase.

Two passes, both idempotent, run hourly via launchd:
  1. CREATE  — verified active subscribers in Resend that are missing from PB
               are created with status='active'.
  2. DEMOTE  — contacts marked unsubscribed in Resend that still show
               status='active' in PB are flipped to status='churned'.

WHY THE DEMOTE PASS EXISTS
--------------------------
The weekly digest sender (email-api/send-weekly-digest.mjs) only sends to PB
subscribers with status='active'. Resend is where unsubscribes are recorded
(unsubscribed:true), but nothing was propagating that to PB — so opted-out
people kept receiving the digest. PB's status enum is active|churned|paused
(there is NO 'unsubscribed' value — writing it returns HTTP 400), so an
opt-out is represented as 'churned'.

Pass without --dry-run to apply; with --dry-run to preview only.
"""

import json
import sys
import urllib.request
import urllib.error
from datetime import date
import os

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
ENV_FILE = os.path.join(PROJECT_DIR, "email-api", ".env")
LOG_FILE = os.path.join(SCRIPT_DIR, "sync-resend-to-pb.log")

DRY_RUN = "--dry-run" in sys.argv


def log(msg):
    with open(LOG_FILE, "a") as f:
        f.write(f"{date.today().isoformat()} | {msg}\n")
    print(msg)


# Load .env
env = {}
with open(ENV_FILE) as f:
    for line in f:
        line = line.strip()
        if "=" in line and not line.startswith("#"):
            key, val = line.split("=", 1)
            env[key.strip()] = val.strip().strip('"').strip("'")

RESEND_API_KEY = env["RESEND_API_KEY"]
PB_URL = env.get("PB_URL", "http://127.0.0.1:8090")
PB_EMAIL = env.get("PB_EMAIL", "")
PB_PASSWORD = env.get("PB_PASSWORD", "")

# Internal QA / owner addresses, managed by hand — never auto-demoted by this
# sync even if they're unsubscribed in Resend (they're already excluded from all
# subscriber sends via email-api/excluded-emails.mjs, and one of them is the
# operator's own address). MIRROR of that file's TESTER_EMAILS — keep in sync.
# Disposable BOT_EMAILS are intentionally NOT listed: churning them is harmless.
NEVER_DEMOTE = {
    "test@example.com",
    "mkondratyuk86@gmail.com",
    "maryan.kondratyuk@quickstarter.ai",
    "signal@gitdealflow.com",
    "escape@invisibleexit.com",
}


def api_request(url, data=None, headers=None, method=None):
    headers = headers or {}
    headers.setdefault("User-Agent", "gitdealflow-sync/1.0")
    if data is not None:
        data = json.dumps(data).encode()
        headers.setdefault("Content-Type", "application/json")
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        raise RuntimeError(f"HTTP {e.code} {url}: {body}")


def resend_get_all_contacts():
    """Fetch ALL contacts (active and unsubscribed) from the first Resend audience."""
    audiences = api_request(
        "https://api.resend.com/audiences",
        headers={"Authorization": f"Bearer {RESEND_API_KEY}"},
    )
    items = audiences.get("data", [])
    if not items:
        return []

    audience_id = items[0]["id"]
    contacts = api_request(
        f"https://api.resend.com/audiences/{audience_id}/contacts",
        headers={"Authorization": f"Bearer {RESEND_API_KEY}"},
    )
    return contacts.get("data", [])


def pb_auth():
    data = api_request(
        f"{PB_URL}/api/collections/_superusers/auth-with-password",
        data={"identity": PB_EMAIL, "password": PB_PASSWORD},
    )
    return data["token"]


def pb_get_records(token):
    """Fetch all subscriber records (email -> {id, status})."""
    records = {}
    page = 1
    while True:
        data = api_request(
            f"{PB_URL}/api/collections/subscribers/records?perPage=200&page={page}",
            headers={"Authorization": f"Bearer {token}"},
        )
        for item in data.get("items", []):
            records[item["email"].lower()] = {"id": item["id"], "status": item.get("status")}
        if not data["items"] or page >= data["totalPages"]:
            break
        page += 1
    return records


def pb_create_subscriber(token, email):
    api_request(
        f"{PB_URL}/api/collections/subscribers/records",
        data={
            "email": email,
            "name": "",
            "tier": "free",
            "status": "active",
            "source": "signals-site",
        },
        headers={"Authorization": f"Bearer {token}"},
    )


def pb_set_status(token, record_id, status):
    api_request(
        f"{PB_URL}/api/collections/subscribers/records/{record_id}",
        data={"status": status},
        headers={"Authorization": f"Bearer {token}"},
        method="PATCH",
    )


def main():
    tag = "[DRY-RUN] " if DRY_RUN else ""

    # 1. Get all contacts from Resend, split by unsubscribe state
    all_contacts = resend_get_all_contacts()
    active_emails = {c["email"].lower() for c in all_contacts if not c.get("unsubscribed")}
    unsub_emails = {c["email"].lower() for c in all_contacts if c.get("unsubscribed")}
    log(f"{tag}Resend audience: {len(active_emails)} active, {len(unsub_emails)} unsubscribed")

    # 2. Get existing PocketBase subscribers
    token = pb_auth()
    pb_records = pb_get_records(token)
    log(f"{tag}PocketBase: {len(pb_records)} existing subscribers")

    # 3. CREATE pass — active Resend contacts missing from PB
    missing = active_emails - set(pb_records.keys())
    created = 0
    for email in sorted(missing):
        if DRY_RUN:
            log(f"{tag}Would create: {email}")
            created += 1
            continue
        try:
            pb_create_subscriber(token, email)
            log(f"Created: {email}")
            created += 1
        except Exception as e:
            log(f"Failed to create {email}: {e}")

    # 4. DEMOTE pass — unsubscribed-in-Resend but still active-in-PB -> churned
    demoted = 0
    for email in sorted(unsub_emails):
        if email in NEVER_DEMOTE:
            continue  # internal QA/owner address — managed by hand, never auto-churned
        rec = pb_records.get(email)
        if not rec or rec["status"] != "active":
            continue  # not in PB, or already churned/paused — nothing to do
        if DRY_RUN:
            log(f"{tag}Would demote (unsubscribed): {email}  active -> churned")
            demoted += 1
            continue
        try:
            pb_set_status(token, rec["id"], "churned")
            log(f"Demoted (unsubscribed): {email}  active -> churned")
            demoted += 1
        except Exception as e:
            log(f"Failed to demote {email}: {e}")

    if not created and not demoted:
        log(f"{tag}Already in sync, nothing to do")
    else:
        log(f"{tag}Sync complete: {created} created, {demoted} demoted (unsubscribed)")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        log(f"ERROR: {e}")
        sys.exit(1)
