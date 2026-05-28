#!/usr/bin/env python3
"""Idempotent upsert of data.json contacts into PocketBase.

Reads monitoring/dream-customers/data.json and upserts each contact into the
PB `contacts` collection, matched by x_handle.

- New records: stage="sourced", dream_customer=true (all from Marcus 100).
- Existing records: refreshes display_name/firm/role/segment/confidence and
  tweet-signal fields. NEVER overwrites stage or dream_customer (those carry
  user state).

Re-runnable safely. Reads PB creds from email-api/.env.
"""

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(os.path.dirname(SCRIPT_DIR))
ENV_FILE = os.path.join(PROJECT_DIR, "email-api", ".env")
DATA_JSON = os.path.join(SCRIPT_DIR, "data.json")


def load_env(path):
    env = {}
    with open(path) as f:
        for line in f:
            line = line.strip()
            if "=" in line and not line.startswith("#"):
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip().strip('"').strip("'")
    return env


def api(url, token=None, method=None, body=None):
    headers = {"User-Agent": "dream-customers-migrate/1.0"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    data = None
    if body is not None:
        data = json.dumps(body).encode()
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            text = resp.read()
            return json.loads(text) if text else {}
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"HTTP {e.code} {url}: {e.read().decode()}")


def auth(pb_url, email, password):
    data = api(
        f"{pb_url}/api/collections/_superusers/auth-with-password",
        method="POST",
        body={"identity": email, "password": password},
    )
    return data["token"]


def find_by_handle(pb_url, token, handle):
    qs = urllib.parse.urlencode({"filter": f'x_handle="{handle}"', "perPage": 1})
    data = api(f"{pb_url}/api/collections/contacts/records?{qs}", token=token)
    items = data.get("items", [])
    return items[0] if items else None


def main():
    # Env vars take precedence over .env file (handy in worktrees + CI).
    if os.environ.get("PB_EMAIL") and os.environ.get("PB_PASSWORD"):
        env = {
            "PB_URL": os.environ.get("PB_URL", "http://127.0.0.1:8090"),
            "PB_EMAIL": os.environ["PB_EMAIL"],
            "PB_PASSWORD": os.environ["PB_PASSWORD"],
        }
    elif os.path.exists(ENV_FILE):
        env = load_env(ENV_FILE)
    else:
        raise RuntimeError(
            f"No PB creds: set PB_EMAIL/PB_PASSWORD env vars or create {ENV_FILE}"
        )

    pb_url = env.get("PB_URL", "http://127.0.0.1:8090").rstrip("/")
    pb_email = env["PB_EMAIL"]
    pb_password = env["PB_PASSWORD"]

    token = auth(pb_url, pb_email, pb_password)

    with open(DATA_JSON) as f:
        data = json.load(f)
    contacts = data.get("contacts", [])

    created = 0
    updated = 0
    skipped = 0

    for c in contacts:
        handle = (c.get("handle") or "").strip()
        if not handle:
            skipped += 1
            continue

        existing = find_by_handle(pb_url, token, handle)

        # Fields that can be safely refreshed from data.json (static + signal).
        # NEVER include stage or dream_customer here — those carry user state.
        payload = {
            "x_handle": handle,
            "display_name": c.get("name") or "",
            "firm": c.get("firm") or "",
            "role": c.get("role") or "",
            "segment": c.get("segment") or "",
            "confidence": c.get("confidence") or "",
            "last_tweet_at": c.get("last_tweet_at") or "",
            "last_tweet_text": (c.get("last_tweet_text") or "")[:1000],
            "last_checked_at": c.get("last_checked_at") or "",
        }

        if existing:
            # Update — don't touch stage/dream_customer.
            api(
                f"{pb_url}/api/collections/contacts/records/{existing['id']}",
                token=token,
                method="PATCH",
                body=payload,
            )
            updated += 1
        else:
            # Create — set initial stage + dream_customer.
            payload["stage"] = "sourced"
            payload["dream_customer"] = True  # all from Marcus 100
            api(
                f"{pb_url}/api/collections/contacts/records",
                token=token,
                method="POST",
                body=payload,
            )
            created += 1

    print(f"created={created} updated={updated} skipped={skipped} total_in_json={len(contacts)}")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(1)
