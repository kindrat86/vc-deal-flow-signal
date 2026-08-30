#!/usr/bin/env python3
"""
GitDealFlow — canonical Sunday-digest subscriber count tracker.

The free Sunday email list feeds every paid tier (EUR 49 -> 197 -> 1997 ->
4970). This script makes that list's size VISIBLE and TRENDABLE: it reads the
GitDealFlow Resend audience, records a timestamped count, and rewrites a
human-readable summary. It is the single source of truth for "how big is the
free list", which previously lived nowhere in the repo.

Writes:
  monitoring/subscriber-count.jsonl   append-only history (trendable)
  monitoring/subscriber-count.md      human-readable current + last 20 weeks
Prints:
  a one-line summary to stdout (used by the weekly Hermes cron for delivery)

Safe to run any number of times: idempotent, read-only against Resend.
"""
import json
import os
import subprocess
from datetime import datetime, timezone

# Self-locating so the tracker can run from a dedicated clean worktree.
# Resend is the list source of truth; PocketBase is retired from the send path.
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_FILES = [
    os.path.join(REPO, "email-api", ".env"),
    os.path.join(REPO, "agent", ".env"),  # legacy fallback
]
MON = os.path.join(REPO, "monitoring")
HIST = os.path.join(MON, "subscriber-count.jsonl")
MD = os.path.join(MON, "subscriber-count.md")
SIGNALS = os.path.expanduser("~/.hermes/portfolio-signals.md")

# Canonical GitDealFlow audience (also used by email-api/send-weekly-signal-digest.sh
# and ~/.hermes/email-engine/enroll-clickers.py). Name-resolved as a fallback.
AUDIENCE_ID_PINNED = "1ddf358e-2416-4481-a0f5-538fd12f6e73"


def load_key():
    for env_file in ENV_FILES:
        if not os.path.exists(env_file):
            continue
        with open(env_file) as f:
            for line in f:
                line = line.strip()
                if line.startswith("RESEND_API_KEY="):
                    return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit(
        "RESEND_API_KEY not found in " + ", ".join(ENV_FILES)
    )


def resend_get(path):
    key = load_key()
    # subprocess curl, not urllib: urllib has TLS/proxy issues on this Mac
    # (same proven pattern as ~/.hermes/email-engine/engine.py).
    cmd = [
        "curl", "-sS", "--max-time", "20", "--connect-timeout", "10",
        "--user-agent", "Mozilla/5.0",
        "-w", "\n__HTTP_STATUS__:%{http_code}",
        f"https://api.resend.com{path}",
        "-H", f"Authorization: Bearer {key}",
    ]
    r = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
    out = r.stdout
    status = 200
    if "__HTTP_STATUS__:" in out:
        out, sp = out.rsplit("__HTTP_STATUS__:", 1)
        try:
            status = int(sp.strip())
        except ValueError:
            status = 0
    try:
        return json.loads(out), status
    except json.JSONDecodeError:
        return {"error": True, "message": out[:500]}, status


def resolve_audience():
    body, status = resend_get("/audiences")
    if status != 200:
        raise SystemExit(f"resend /audiences failed {status}: {body}")
    data = body.get("data", [])
    for a in data:
        if a.get("id") == AUDIENCE_ID_PINNED:
            return a.get("id"), a.get("name")
    for a in data:
        if "gitdealflow" in (a.get("name") or "").lower():
            return a.get("id"), a.get("name")
    if data:
        return data[0].get("id"), data[0].get("name")
    raise SystemExit("no audiences found under this key")


def count_contacts(audience_id):
    contacts = []
    page = 1
    while True:
        body, status = resend_get(
            f"/audiences/{audience_id}/contacts?per_page=100&page={page}"
        )
        if status != 200:
            raise SystemExit(f"contacts failed {status}: {body}")
        contacts.extend(body.get("data", []))
        if not body.get("has_more"):
            break
        page += 1
    return contacts


def main():
    audience_id, audience_name = resolve_audience()
    contacts = count_contacts(audience_id)
    total = len(contacts)
    active = [c for c in contacts if not c.get("unsubscribed")]
    unsub = total - len(active)
    now = datetime.now(timezone.utc).isoformat()

    record = {
        "ts": now,
        "audience_id": audience_id,
        "audience_name": audience_name,
        "total": total,
        "active": len(active),
        "unsubscribed": unsub,
    }

    os.makedirs(MON, exist_ok=True)

    hist = []
    if os.path.exists(HIST):
        with open(HIST) as f:
            for line in f:
                line = line.strip()
                if line:
                    try:
                        hist.append(json.loads(line))
                    except json.JSONDecodeError:
                        pass
    # Exactly one durable sample per UTC day. A launchd retry or manual check
    # replaces today's row instead of inventing extra churn intervals.
    same_day = bool(hist and hist[-1].get("ts", "")[:10] == now[:10])
    prev_active = (
        hist[-2]["active"] if same_day and len(hist) > 1
        else hist[-1]["active"] if hist and not same_day
        else None
    )
    if same_day:
        hist[-1] = record
    else:
        hist.append(record)
    with open(HIST, "w") as f:
        for item in hist:
            f.write(json.dumps(item) + "\n")

    delta = record["active"] - prev_active if prev_active is not None else None

    lines = [
        "# GitDealFlow — Sunday Digest subscriber count",
        "",
        f"Updated {now} (UTC)",
        "",
        f"- **Active subscribers (free Sunday list): {record['active']}**",
    ]
    if delta is not None:
        lines.append(
            f"- Change vs previous record: **{'+' if delta > 0 else ''}{delta}**"
        )
    lines.append(
        f"- Audience: `{audience_id}` ({audience_name}) · total contacts {total} · "
        f"unsubscribed {unsub}"
    )
    lines += ["", "## History", ""]
    lines.append("| timestamp (UTC) | active | total | unsubscribed | delta |")
    lines.append("|---|---|---|---|---|")
    prev = None
    for h in hist[-20:]:
        if prev is None:
            lines.append(f"| {h['ts']} | {h['active']} | {h['total']} | {h['unsubscribed']} | — |")
        else:
            d = h["active"] - prev["active"]
            lines.append(
                f"| {h['ts']} | {h['active']} | {h['total']} | {h['unsubscribed']} | "
                f"{'+' if d > 0 else ''}{d} |"
            )
        prev = h
    with open(MD, "w") as f:
        f.write("\n".join(lines) + "\n")

    # Mirror into the portfolio signal hub the user already reads (newest first).
    _append_portfolio_signal(record, delta)

    if delta is None:
        print(f"GitDealFlow Sunday-digest list: {record['active']} active subscribers (baseline).")
    else:
        print(
            f"GitDealFlow Sunday-digest list: {record['active']} active subscribers "
            f"({'+' if delta > 0 else ''}{delta} since prior sample)."
        )


def _append_portfolio_signal(record, delta):
    """Append a one-line entry to ~/.hermes/portfolio-signals.md (newest first).

    Inserted just before the first existing dated section so the weekly count
    shows up at the top of the file, matching the file's "newest first"
    convention, without disturbing the signal-sweep's own entries.
    """
    date_str = record["ts"][:10]
    delta_str = ""
    if delta is not None:
        delta_str = f" ({'+' if delta > 0 else ''}{delta} vs prior sample)"
    block = (
        f"## {date_str}\n\n"
        f"### GitDealFlow — Sunday digest list\n"
        f"- {record['active']} active subscribers{delta_str}. "
        f"Audience GitDealFlow ({record['audience_id']}), "
        f"total {record['total']}, unsubscribed {record['unsubscribed']}.\n\n"
    )
    try:
        with open(SIGNALS) as f:
            content = f.read()
    except FileNotFoundError:
        content = "# Portfolio Signals Log\n\n"
    # Retry-safe: do not insert a second GitDealFlow block for the same UTC day.
    same_day_marker = f"## {date_str}\n\n### GitDealFlow — Sunday digest list\n"
    if same_day_marker in content:
        return
    idx = content.find("\n## ")
    if idx == -1:
        content += "\n" + block
    else:
        content = content[: idx + 1] + block + content[idx + 1 :]
    with open(SIGNALS, "w") as f:
        f.write(content)


if __name__ == "__main__":
    main()
