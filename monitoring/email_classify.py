"""Shared email classification for the dashboard + email_log reconciler.

A subscriber's "sequence" position is derived from the email_key of their most
recent email. Drip emails (soap opera, seinfeld, scout, welcome) have stable
subjects that map 1:1 to a key via the `email_sequences` collection. Broadcast
emails (the Sunday weekly digest, the daily seinfeld note, one-off blasts) have
dynamic, dated subjects that map to nothing — so we classify them by content +
send date instead.

Keeping this in one place guarantees build-dashboard.py (display) and
sync-email-log.py (the row writer) agree on what a given email is.
"""

import re


def classify_email_key(subject, sent_date, subject_to_key=None):
    """Return a stable email_key for a sent email.

    subject        — the Resend subject line.
    sent_date      — "YYYY-MM-DD" string the email went out (for dated broadcasts).
    subject_to_key — optional {subject: key} map from the email_sequences
                     collection, so static drip subjects resolve to their real
                     key (soap-opera-3, seinfeld-2, scout-1, ...).

    Drip emails return their canonical key. Broadcasts return a dated key:
    "digest-<date>" for the weekly digest, "note-<date>" for everything else
    (the daily seinfeld and any one-off blast).
    """
    subj = (subject or "").strip()
    sent_date = (sent_date or "")[:10]

    if subject_to_key:
        key = subject_to_key.get(subj)
        if key:
            return key

    low = subj.lower()
    if "digest" in low or "signal digest" in low or low.startswith("this week in"):
        return f"digest-{sent_date}" if sent_date else "digest"

    # Daily seinfeld note + any other untracked broadcast.
    return f"note-{sent_date}" if sent_date else "note"


def describe_sequence(key):
    """Render an email_key as a human-readable sequence position for the dashboard."""
    if not key:
        return "—"

    m = re.match(r"^soap-opera-(\d+)$", key)
    if m:
        return f"Soap Opera {m.group(1)}/5"
    m = re.match(r"^seinfeld-(\d+)$", key)
    if m:
        return f"Seinfeld {m.group(1)}/7"
    m = re.match(r"^scout-(\d+)$", key)
    if m:
        return f"Scout {m.group(1)}/5"

    if key.startswith(("digest-", "weekly-digest")):
        return "Weekly Digest"
    if key.startswith(("note-", "daily-")):
        return "Daily Note"
    if key.startswith("broadcast"):
        return "Broadcast"
    if key.startswith("welcome"):
        return "Welcome"
    return key


# Resend last_event -> email_log status (select: queued/sent/failed/opened/clicked).
def status_from_event(last_event):
    e = (last_event or "").lower()
    if e == "clicked":
        return "clicked"
    if e == "opened":
        return "opened"
    if e in ("bounced", "complained", "failed"):
        return "failed"
    # sent / delivered / delivery_delayed / queued / (anything else delivered-ish)
    if e == "queued":
        return "queued"
    return "sent"
