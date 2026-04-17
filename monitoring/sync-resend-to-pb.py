#!/usr/bin/env python3
"""Sync Resend Audience contacts into PocketBase.
Ensures verified subscribers from the pseo-site (Vercel) appear in PocketBase.
Runs periodically via launchd."""

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


def resend_get_contacts():
    """Fetch all contacts from the first Resend audience."""
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
    return [c for c in contacts.get("data", []) if not c.get("unsubscribed")]


def pb_auth():
    data = api_request(
        f"{PB_URL}/api/collections/_superusers/auth-with-password",
        data={"identity": PB_EMAIL, "password": PB_PASSWORD},
    )
    return data["token"]


def pb_get_existing_emails(token):
    """Fetch all subscriber emails from PocketBase."""
    emails = set()
    page = 1
    while True:
        data = api_request(
            f"{PB_URL}/api/collections/subscribers/records?perPage=200&page={page}",
            headers={"Authorization": f"Bearer {token}"},
        )
        for item in data.get("items", []):
            emails.add(item["email"].lower())
        if not data["items"] or page >= data["totalPages"]:
            break
        page += 1
    return emails


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


def main():
    # 1. Get verified contacts from Resend
    resend_contacts = resend_get_contacts()
    resend_emails = {c["email"].lower() for c in resend_contacts}
    log(f"Resend audience: {len(resend_emails)} active contacts")

    # 2. Get existing PocketBase subscribers
    token = pb_auth()
    pb_emails = pb_get_existing_emails(token)
    log(f"PocketBase: {len(pb_emails)} existing subscribers")

    # 3. Sync missing contacts
    missing = resend_emails - pb_emails
    if not missing:
        log("Already in sync, nothing to do")
        return

    created = 0
    for email in sorted(missing):
        try:
            pb_create_subscriber(token, email)
            log(f"Created: {email}")
            created += 1
        except Exception as e:
            log(f"Failed to create {email}: {e}")

    log(f"Sync complete: {created} new subscribers added to PocketBase")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        log(f"ERROR: {e}")
        sys.exit(1)
