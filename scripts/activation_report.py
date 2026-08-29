#!/usr/bin/env python3
"""
GitDealFlow activation report (activation audit 2026-08-29, fix 3).

DEFINITION (canonical, from the 2026-08-29 activation audit):
  activated = a user whose signup_confirmed_viewed (email verification
  completed) is followed within 48h by an OPEN of a GitDealFlow email
  (instant first digest or drip), scoped by subject.

Why subject scoping: the PostHog project (143861, eu.i.posthog.com) is
shared across the whole Sipi portfolio and one Resend webhook forwards
EVERY product's engagement events into it (~15k opens/30d, ~1.5k ids).
GDF sends are identified by subject prefix / keywords, the same scoping
the audit used. Distinct ids are emails on the email side (Resend
webhook) and anonymous UUIDs on the web side when identify() did not
fire (DNT/GPC, prefetch); the report counts both but separates
"identified" from "anonymous" cohorts so the number is honest.

Usage (Hermes venv python 3.11):
  python3.11 ~/signals-gitdealflow/scripts/activation_report.py [--days 14]

Reads POSTHOG_QUERY_KEY from the Fernet vault at
~/portfolio/config/vault_local.json (key file .vault_key).
Prints the funnel and the activation rate; exit 0 always (report only).
"""
from __future__ import annotations

import json
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

from cryptography.fernet import Fernet

HOST = "https://eu.i.posthog.com"
PROJECT = 143861
VAULT_FILE = Path("/Users/sipi/portfolio/config/vault_local.json")
VAULT_KEY_FILE = Path("/Users/sipi/portfolio/config/.vault_key")
ACTIVATION_WINDOW_H = 48

# GDF email subjects: instant first digest, drip, broadcast. Subject-LIKE
# patterns, matching what the audit found in live properties.
GDF_SUBJECT_PATTERNS = [
    "Your first five:%",          # on-verify instant digest (new subject)
    "Signal Digest%",             # instant digest (old subject) + broadcasts
    "See startups heating up%",   # soap-opera day 0 (30 min after verify)
    "%GitDealFlow%",              # corrections, canaries, product emails
]


def load_key() -> str:
    fernet = Fernet(VAULT_KEY_FILE.read_text().strip())
    vault = json.loads(VAULT_FILE.read_text())
    for name in ("global:POSTHOG_QUERY_KEY", "global:PH_API_KEY"):
        enc = vault.get(name, {}).get("value_encrypted", "")
        if enc and not enc.startswith("«"):
            try:
                return fernet.decrypt(enc.encode()).decode()
            except Exception:
                continue
    raise SystemExit("No PostHog key in vault")


def q(key: str, hogql: str):
    payload = json.dumps({"query": {"kind": "HogQLQuery", "query": hogql}}).encode()
    req = urllib.request.Request(
        f"{HOST}/api/projects/{PROJECT}/query",
        data=payload,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as r:
        return json.loads(r.read().decode())["results"]


def parse_ts(v) -> datetime:
    if isinstance(v, datetime):
        return v if v.tzinfo else v.replace(tzinfo=timezone.utc)
    s = str(v).replace("Z", "+00:00")
    return datetime.fromisoformat(s)


def main() -> int:
    days = 14
    if "--days" in sys.argv:
        try:
            days = int(sys.argv[sys.argv.index("--days") + 1])
        except (ValueError, IndexError):
            pass
    key = load_key()

    subjects_sql = " OR ".join(f"properties.subject LIKE '{p}'" for p in GDF_SUBJECT_PATTERNS)

    # 1. Confirmed users in window: distinct_id -> confirm timestamps.
    conf_rows = q(
        key,
        f"""SELECT distinct_id, min(timestamp), max(timestamp)
            FROM events
            WHERE event='signup_confirmed_viewed'
              AND timestamp > now() - INTERVAL {days} DAY
            GROUP BY distinct_id""",
    )
    if not conf_rows:
        print(f"No confirmed signups in the last {days} days.")
        return 0
    conf_first = {r[0]: parse_ts(r[1]) for r in conf_rows}

    id_list = ",".join("'" + i.replace("'", "''") + "'" for i in conf_first)
    identified = lambda d: "@" in d  # noqa: E731

    # 2. GDF email opens per confirmed user (subject-scoped, any time).
    open_rows = q(
        key,
        f"""SELECT distinct_id, min(timestamp), max(timestamp), count()
            FROM events
            WHERE event='email_opened' AND ({subjects_sql})
              AND distinct_id IN ({id_list})
            GROUP BY distinct_id""",
    )
    first_open = {r[0]: parse_ts(r[1]) for r in open_rows}
    open_count = {r[0]: r[3] for r in open_rows}

    activated, anon_total, anon_activated, ident_total, ident_activated = 0, 0, 0, 0, 0
    per_user = []
    for did, ct in conf_first.items():
        is_ident = identified(did)
        opened_gdf = did in first_open
        delta = (first_open[did] - ct).total_seconds() if opened_gdf else None
        in_window = delta is not None and delta <= ACTIVATION_WINDOW_H * 3600
        if is_ident:
            ident_total += 1
            ident_activated += int(in_window)
        else:
            anon_total += 1
            anon_activated += int(in_window)
        activated += int(in_window)
        per_user.append((str(ct)[:16], did, is_ident, open_count.get(did, 0), in_window))

    total = len(conf_first)
    print(f"GitDealFlow activation report — {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M UTC')}")
    print(f"Window: last {days} days | Activation = first GDF email open within {ACTIVATION_WINDOW_H}h of confirm")
    print()
    print(f"{'confirmed':>10} {'identified':>11} {'anon':>5} {'activated':>10} {'rate':>7} {'ident-rate':>11}")
    ident_rate = f"{ident_activated/ident_total*100:.0f}%" if ident_total else "n/a"
    print(
        f"{total:>10} {ident_total:>11} {anon_total:>5} {activated:>10} "
        f"{activated/total*100 if total else 0:>6.0f}% {ident_rate:>11}"
    )
    print()
    print("per user (confirm time | distinct_id | identified | gdf_opens | activated_48h):")
    for ct, did, is_ident, oc, act in sorted(per_user):
        print(f"  {ct} | {did[:40]:40} | {'Y' if is_ident else 'n':1} | {oc:>3} | {'Y' if act else '-'}")
    print()
    print("Notes:")
    print("- anon ids = identify() missed (DNT/GPC, prefetch, or cross-device confirm);")
    print("  their email opens land on the email-keyed person and can still join via")
    print("  PostHog merge if identify fires later.")
    print("- Resend email_key tags are NOT forwarded by the shared webhook; subject")
    print("  scoping is the only reliable filter until that changes.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
