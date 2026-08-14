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

REPO = os.path.expanduser("~/signals-gitdealflow")
ENV_FILE = os.path.join(REPO, "agent", ".env")
MON = os.path.join(REPO, "monitoring")
HIST = os.path.join(MON, "subscriber-count.jsonl")
MD = os.path.join(MON, "subscriber-count.md")
SIGNALS = os.path.expanduser("~/.hermes/portfolio-signals.md")

# Canonical GitDealFlow audience (also used by email-api/send-weekly-signal-digest.sh
# and ~/.hermes/email-engine/enroll-clickers.py). Name-resolved as a fallback.
AUDIENCE_ID_PINNED = "1ddf358e-2416-4481-a0f5-538fd12f6e73"


def load_key():
    with open(ENV_FILE) as f:
        for line in f:
            line = line.strip()
            if line.startswith("RESEND_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit("RESEND_API_KEY not found in agent/.env")


def resend_get(path):
    key = load_key()
    # subprocess curl, not urllib: urllib has TLS/proxy issues on this Mac
    # (same proven pattern as ~/.hermes/email-engine/engine.py).
    cmd = [
        "curl", "-s", "--max-time", "20", "--connect-timeout", "10",
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
    prev_active = hist[-1]["active"] if hist else None
    with open(HIST, "a") as f:
        f.write(json.dumps(record) + "\n")
    hist.append(record)

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
            f"({'+' if delta > 0 else ''}{delta} this week)."
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
        delta_str = f" ({'+' if delta > 0 else ''}{delta} vs last week)"
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
    idx = content.find("\n## ")
    if idx == -1:
        content += "\n" + block
    else:
        content = content[: idx + 1] + block + content[idx + 1 :]
    with open(SIGNALS, "w") as f:
        f.write(content)


if __name__ == "__main__":
    main()
