#!/usr/bin/env python3
"""
GitDealFlow — Sunday Signal Digest engagement tracker.

The free Sunday digest is sent via email-api/send-weekly-digest.mjs, which now
records each send's Resend id in email-api/sent-log/digest-<date>.json as an
{email: id} map. This script resolves those ids against GET /emails/{id} to
measure, per issue and across history:

  sent, delivered, opened, clicked, bounced, suppressed
  open rate  = (opened + clicked) / (delivered + opened + clicked)
  click rate = clicked / (delivered + opened + clicked)

Resend's `last_event` is the "best" per-recipient event (clicked > opened >
delivered > bounced > suppressed), matching the drip engine's convention.

Fallback: when a sent-log predates id-tracking (bare array of emails), the
script ALSO subject-filters the recent GET /emails?limit=100 window for
"Signal Digest, Week of" sends so the most recent issue is still measurable.

Writes:
  monitoring/digest-engagement.jsonl   append-only per-issue history
  monitoring/digest-engagement.md      human-readable current + history
Prints a one-line summary to stdout (used by the Monday cron for delivery).

Idempotent and read-only against Resend; safe to run any number of times.
"""
import json
import os
import subprocess
from datetime import datetime, timezone

REPO = os.path.expanduser("~/signals-gitdealflow")
ENV_FILE = os.path.join(REPO, "agent", ".env")
MON = os.path.join(REPO, "monitoring")
SENT_LOG_DIR = os.path.join(REPO, "email-api", "sent-log")
HIST = os.path.join(MON, "digest-engagement.jsonl")
MD = os.path.join(MON, "digest-engagement.md")

SUBJECT_PREFIX = "Signal Digest, Week of"


def load_key():
    with open(ENV_FILE) as f:
        for line in f:
            line = line.strip()
            if line.startswith("RESEND_API_KEY="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise SystemExit("RESEND_API_KEY not found in agent/.env")


def curl_get(path):
    key = load_key()
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


def last_event_for_id(email_id):
    body, status = curl_get(f"/emails/{email_id}")
    if status != 200 or not isinstance(body, dict):
        return None
    return body.get("last_event")


def load_sent_logs():
    """Return a list of (date, {email: id}) from the sent-log dir, newest first."""
    out = []
    if not os.path.isdir(SENT_LOG_DIR):
        return out
    for fn in sorted(os.listdir(SENT_LOG_DIR), reverse=True):
        if not fn.startswith("digest-") or not fn.endswith(".json"):
            continue
        date = fn[len("digest-"):-len(".json")]
        try:
            raw = json.load(open(os.path.join(SENT_LOG_DIR, fn)))
        except (json.JSONDecodeError, OSError):
            continue
        if isinstance(raw, list):
            # Pre-id-tracking log: bare list of emails.
            out.append((date, {str(e).lower(): None for e in raw}))
        elif isinstance(raw, dict):
            out.append((date, {str(k).lower(): v for k, v in raw.items()}))
    return out


def subject_filter_fallback():
    """Catch the most recent issue via subject prefix if it is still in the
    last-100 window (id-tracking started 2026-08-16; older issues have no ids)."""
    body, status = curl_get("/emails?limit=100")
    if status != 200:
        return []
    events = []
    for e in body.get("data", []):
        subj = e.get("subject") or ""
        if subj.startswith(SUBJECT_PREFIX):
            events.append(e.get("last_event"))
    return events


def classify(events):
    sent = len(events)
    opened = sum(1 for e in events if e == "opened")
    clicked = sum(1 for e in events if e == "clicked")
    delivered = sum(1 for e in events if e == "delivered")
    bounced = sum(1 for e in events if e == "bounced")
    suppressed = sum(1 for e in events if e == "suppressed")
    engaged_denom = delivered + opened + clicked
    open_rate = round((opened + clicked) / engaged_denom * 100, 1) if engaged_denom else None
    click_rate = round(clicked / engaged_denom * 100, 1) if engaged_denom else None
    bounce_rate = round(bounced / sent * 100, 1) if sent else None
    return {
        "sent": sent,
        "delivered": delivered,
        "opened": opened,
        "clicked": clicked,
        "bounced": bounced,
        "suppressed": suppressed,
        "open_rate": open_rate,
        "click_rate": click_rate,
        "bounce_rate": bounce_rate,
    }


def fmt_pct(v):
    return "—" if v is None else f"{v}%"


def main():
    now = datetime.now(timezone.utc).isoformat()
    logs = load_sent_logs()

    # Resolve engagement per issue. Issues with real ids use GET /emails/{id};
    # the newest id-less issue (pre-tracking) falls back to subject filtering.
    issues = []  # (date, counts)
    fallback_used = False
    for idx, (date, emap) in enumerate(logs):
        sent_count = len(emap)
        ids = [v for v in emap.values() if v]
        if ids:
            events = []
            for email_id in ids:
                ev = last_event_for_id(email_id)
                if ev:
                    events.append(ev)
            counts = classify(events)
        elif idx == 0 and not fallback_used:
            # Newest issue, no ids: subject-filter fallback.
            events = subject_filter_fallback()
            if events:
                counts = classify(events)
                fallback_used = True
            else:
                counts = classify([])
        else:
            counts = classify([])
        # The sent-log always knows how many were sent, even when engagement
        # could not be resolved (ids missing / window scrolled). Report that
        # honestly rather than a misleading 0.
        counts["sent"] = sent_count
        issues.append((date, counts))

    os.makedirs(MON, exist_ok=True)

    # Load prior history.
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

    # Only append a NEW record if the newest issue's (date, sent) is not already
    # the last history row (idempotent re-runs must not double-append).
    latest = issues[0] if issues else None
    if latest:
        date, counts = latest
        already = any(h.get("date") == date and h.get("sent") == counts["sent"] for h in hist[-5:])
        if not already:
            record = {"ts": now, "date": date, **counts}
            with open(HIST, "a") as f:
                f.write(json.dumps(record) + "\n")
            hist.append(record)

    # Write markdown.
    lines = [
        "# GitDealFlow — Sunday Signal Digest engagement",
        "",
        f"Updated {now} (UTC)",
        "",
    ]
    if latest:
        date, counts = latest
        lines.append(f"## Latest issue: {date}")
        lines.append("")
        lines.append(f"- Sent: **{counts['sent']}**")
        lines.append(f"- Opened: **{counts['opened']}** · Clicked: **{counts['clicked']}** · Delivered (no open): {counts['delivered']}")
        lines.append(f"- Bounced: {counts['bounced']} · Suppressed: {counts['suppressed']}")
        lines.append(f"- **Open rate: {fmt_pct(counts['open_rate'])}** · **Click rate: {fmt_pct(counts['click_rate'])}** · Bounce rate: {fmt_pct(counts['bounce_rate'])}")
        if fallback_used:
            lines.append("")
            lines.append("_Measured via subject fallback; per-id tracking starts with the next Sunday send._")
    else:
        lines.append("No digest issues found in sent-log yet.")
    lines += ["", "## History", ""]
    lines.append("| date | sent | opened | clicked | delivered | bounced | open% | click% | bounce% |")
    lines.append("|---|---|---|---|---|---|---|---|---|")
    for h in hist[-20:]:
        lines.append(
            f"| {h.get('date','')} | {h.get('sent',0)} | {h.get('opened',0)} | {h.get('clicked',0)} | "
            f"{h.get('delivered',0)} | {h.get('bounced',0)} | {fmt_pct(h.get('open_rate'))} | "
            f"{fmt_pct(h.get('click_rate'))} | {fmt_pct(h.get('bounce_rate'))} |"
        )
    with open(MD, "w") as f:
        f.write("\n".join(lines) + "\n")

    # One-line stdout summary for cron delivery.
    if latest:
        date, counts = latest
        print(
            f"GitDealFlow digest {date}: sent={counts['sent']} "
            f"open={fmt_pct(counts['open_rate'])} click={fmt_pct(counts['click_rate'])} "
            f"bounce={fmt_pct(counts['bounce_rate'])} (clicked {counts['clicked']}/{counts['sent']})."
        )
    else:
        print("GitDealFlow digest: no sent issues found yet.")


if __name__ == "__main__":
    main()
