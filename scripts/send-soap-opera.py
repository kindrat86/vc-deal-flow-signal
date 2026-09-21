#!/usr/bin/env python3
"""
GitDealFlow Soap Opera Email Sequence Sender
Reads soap-opera-sequence.json, finds subscribers due for each day's email,
sends via Resend API. Tracks sends to prevent duplicates.
Usage: python3 scripts/send-soap-opera.py [--dry-run]
"""
import json, os, sys, time, sqlite3
from datetime import datetime, timezone, timedelta

DRY_RUN = "--dry-run" in sys.argv
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
REPO_ROOT = os.path.dirname(SCRIPT_DIR)

# ─── Config ────────────────────────────────────────────
RESEND_API_KEY = os.environ.get("RESEND_API_KEY", "RESEND_KEY_PLACEHOLDER")
FROM_EMAIL = "The Data Nerd <signals@gitdealflow.com>"
SOAP_FILE = os.path.join(REPO_ROOT, "emails", "soap-opera-sequence.json")
TRACKING_FILE = os.path.join(SCRIPT_DIR, "soap-opera-sent.json")
SUBSCRIBER_DB = os.path.join(REPO_ROOT, "emails", "subscribers.json")

# For production: use Supabase/Pocketbase instead of local JSON
# The landing site's subscribe endpoint is at signals.gitdealflow.com/api/subscribe
# For now, check for local subscriber files
SUBSCRIBER_SOURCES = [
    os.path.join(REPO_ROOT, "emails", "subscribers.json"),
    os.path.join(REPO_ROOT, "emails", "subscribers.csv"),
]

def load_json(path):
    if not os.path.exists(path):
        return None
    with open(path) as f:
        return json.load(f)

def load_subscribers():
    """Load subscribers from all available sources."""
    subscribers = {}
    for src in SUBSCRIBER_SOURCES:
        if os.path.exists(src):
            data = load_json(src)
            if data:
                if isinstance(data, list):
                    for entry in data:
                        email = entry.get("email", "")
                        ts = entry.get("subscribed_at", entry.get("created", ""))
                        if email and ts:
                            subscribers[email] = ts
                elif isinstance(data, dict):
                    for email, entry in data.items():
                        ts = entry if isinstance(entry, str) else entry.get("subscribed_at", "")
                        if email and ts:
                            subscribers[email] = ts
    return subscribers

def load_sequence():
    """Load the 5-email soap opera sequence."""
    data = load_json(SOAP_FILE)
    if not data:
        print(f"ERROR: {SOAP_FILE} not found")
        return []
    return data.get("emails", [])

def load_tracking():
    """Load sent-email tracking to prevent duplicates."""
    data = load_json(TRACKING_FILE)
    return data if data else {"sent": {}}

def save_tracking(tracking):
    os.makedirs(os.path.dirname(TRACKING_FILE), exist_ok=True)
    with open(TRACKING_FILE, 'w') as f:
        json.dump(tracking, f, indent=2)

def send_email(day, email_data, subscriber_email):
    """Send one email via Resend API."""
    if DRY_RUN:
        print(f"  [DRY RUN] Would send Day {day}: {email_data['subject']} → {subscriber_email}")
        return {"id": "dry-run", "status": "dry_run"}
    
    payload = {
        "from": FROM_EMAIL,
        "to": [subscriber_email],
        "subject": email_data["subject"],
        "text": email_data.get("body_plain", ""),
        "html": email_data.get("body_html", ""),
        "headers": {
            "List-Unsubscribe": f"<mailto:signals@gitdealflow.com?subject=unsubscribe:{subscriber_email}>"
        }
    }
    
    try:
        import urllib.request
        req = urllib.request.Request(
            "https://api.resend.com/emails",
            data=json.dumps(payload).encode(),
            headers={
                "Authorization": f"Bearer {RESEND_API_KEY}",
                "Content-Type": "application/json",
                "User-Agent": "GitDealFlow-Soap-Opera/1.0"
            }
        )
        resp = urllib.request.urlopen(req, timeout=15)
        result = json.loads(resp.read())
        return {"id": result.get("id", "unknown"), "status": "sent"}
    except Exception as e:
        return {"status": "failed", "error": str(e)}

def main():
    if RESEND_API_KEY == "RESEND_KEY_PLACEHOLDER":
        print("ERROR: RESEND_API_KEY env var not set. Set it to your Resend API key.")
        print("Get it from https://resend.com/api-keys")
        sys.exit(1)
    
    sequence = load_sequence()
    if not sequence:
        print("No email sequence found.")
        return
    
    subscribers = load_subscribers()
    if not subscribers:
        print("WARNING: No subscribers found in local files.")
        print("Subscriber data source: signals.gitdealflow.com/api/subscribe stores in Supabase.")
        print("For production use, query Supabase directly or configure a subscriber export.")
        # In production, query Supabase instead
        return
    
    tracking = load_tracking()
    sent_count = 0
    now = datetime.now(timezone.utc)
    
    print(f"{'DRY RUN — ' if DRY_RUN else ''}Processing {len(subscribers)} subscribers...")
    
    for email, subscribed_at_str in subscribers.items():
        try:
            # Parse subscription timestamp
            subscribed_at = datetime.fromisoformat(subscribed_at_str.replace('Z', '+00:00'))
            days_since = (now - subscribed_at).days
            
            # Check if any sequence email matches
            for email_data in sequence:
                day = email_data["day"]
                if days_since < day:
                    continue  # Not due yet
                
                # Check if already sent
                sent_key = f"{email}:day{day}"
                if sent_key in tracking["sent"]:
                    continue  # Already sent
                
                # Check if we should send on exact match or any day after
                # Send if today matches the day exactly (within 24h window)
                if days_since == day or (days_since > day and tracking["sent"].get(f"{email}:day{day-1}")):
                    result = send_email(day, email_data, email)
                    if result["status"] in ("sent", "dry_run"):
                        tracking["sent"][sent_key] = {
                            "sent_at": now.isoformat(),
                            "resend_id": result.get("id", ""),
                            "day": day,
                            "email": email
                        }
                        sent_count += 1
                        print(f"  ✓ Day {day}: {email_data['subject'][:50]}... → {email}")
                    else:
                        print(f"  ✗ Day {day}: {email_data['subject'][:50]}... → {email} FAILED: {result.get('error','')}")
                    time.sleep(0.1)  # Rate limit
                    break  # One email per subscriber per run
                    
        except Exception as e:
            print(f"  ✗ Error processing {email}: {e}")
    
    save_tracking(tracking)
    print(f"\nDone. {sent_count} email{'s' if sent_count != 1 else ''} {'would be' if DRY_RUN else ''} sent.")
    print(f"Tracking file: {TRACKING_FILE}")

if __name__ == "__main__":
    main()
