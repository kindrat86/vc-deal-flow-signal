#!/usr/bin/env python3
"""Load all Brunson emails into Pocketbase email_sequences collection."""
import json, os, re, urllib.request

PB_URL = os.environ.get("PB_URL", "http://127.0.0.1:8090")
PB_EMAIL = os.environ.get("PB_EMAIL")
PB_PASSWORD = os.environ.get("PB_PASSWORD")
EMAILS_DIR = os.environ.get("EMAILS_DIR", os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "emails"))

if not PB_EMAIL or not PB_PASSWORD:
    # Load from .env file as fallback
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), ".env")
    if os.path.exists(env_path):
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if "=" in line and not line.startswith("#"):
                    k, v = line.split("=", 1)
                    os.environ.setdefault(k.strip(), v.strip().strip('"').strip("'"))
        PB_EMAIL = os.environ.get("PB_EMAIL")
        PB_PASSWORD = os.environ.get("PB_PASSWORD")

if not PB_EMAIL or not PB_PASSWORD:
    print("ERROR: PB_EMAIL and PB_PASSWORD must be set (via env vars or .env file)")
    exit(1)

# Authenticate
auth_data = json.dumps({"identity": PB_EMAIL, "password": PB_PASSWORD}).encode()
req = urllib.request.Request(f"{PB_URL}/api/collections/_superusers/auth-with-password", data=auth_data, headers={"Content-Type": "application/json"})
token = json.loads(urllib.request.urlopen(req).read())["token"]

# Delete existing sequences first
req = urllib.request.Request(f"{PB_URL}/api/collections/email_sequences/records?perPage=50", headers={"Authorization": f"Bearer {token}"})
existing = json.loads(urllib.request.urlopen(req).read())
for rec in existing.get("items", []):
    dreq = urllib.request.Request(f"{PB_URL}/api/collections/email_sequences/records/{rec['id']}", method="DELETE", headers={"Authorization": f"Bearer {token}"})
    urllib.request.urlopen(dreq)
    print(f"  Deleted existing: {rec.get('key')}")

SEQUENCES = [
    # Soap Opera (welcome sequence, free tier)
    {"key": "soap-opera-1", "tier": "free", "day": 0, "file": "soap-opera-1.md"},
    {"key": "soap-opera-2", "tier": "free", "day": 1, "file": "soap-opera-2.md"},
    {"key": "soap-opera-3", "tier": "free", "day": 2, "file": "soap-opera-3.md"},
    {"key": "soap-opera-4", "tier": "free", "day": 4, "file": "soap-opera-4.md"},
    {"key": "soap-opera-5", "tier": "free", "day": 7, "file": "soap-opera-5.md"},
    # Seinfeld broadcasts (ongoing, free tier)
    {"key": "seinfeld-1", "tier": "free", "day": 14, "file": "seinfeld-1.md"},
    {"key": "seinfeld-2", "tier": "free", "day": 21, "file": "seinfeld-2.md"},
    {"key": "seinfeld-3", "tier": "free", "day": 28, "file": "seinfeld-3.md"},
    {"key": "seinfeld-4", "tier": "free", "day": 35, "file": "seinfeld-4.md"},
    {"key": "seinfeld-5", "tier": "free", "day": 42, "file": "seinfeld-5.md"},
    {"key": "seinfeld-6", "tier": "free", "day": 49, "file": "seinfeld-6.md"},
    {"key": "seinfeld-7", "tier": "free", "day": 56, "file": "seinfeld-7.md"},
]

def parse_email(filepath):
    try:
        with open(filepath) as f:
            content = f.read()
    except FileNotFoundError:
        print(f"  WARNING: File not found: {filepath}")
        return "", ""
    except OSError as e:
        print(f"  WARNING: Could not read {filepath}: {e}")
        return "", ""
    # Strip frontmatter
    parts = content.split("---")
    if len(parts) >= 3:
        frontmatter = parts[1].strip()
        body = "---".join(parts[2:]).strip()
    else:
        frontmatter = ""
        body = content.strip()
    # Extract subject from frontmatter
    subject = ""
    for line in frontmatter.split("\n"):
        if line.startswith("subject:"):
            subject = line.split(":", 1)[1].strip().strip('"').strip("'")
    # Convert body to HTML
    paragraphs = re.split(r"\n\n+", body)
    html_parts = []
    for p in paragraphs:
        p = p.strip()
        if not p:
            continue
        # Check if it's a list
        lines = p.split("\n")
        if all(re.match(r"^[\-\d]", l.strip()) for l in lines if l.strip()):
            items = "".join(f"<li>{l.strip().lstrip('-0123456789. ')}</li>" for l in lines if l.strip())
            html_parts.append(f"<ul>{items}</ul>")
        else:
            html_parts.append(f"<p>{p.replace(chr(10), '<br>')}</p>")
    return subject, "\n".join(html_parts)

for seq in SEQUENCES:
    filepath = f"{EMAILS_DIR}/{seq['file']}"
    subject, body_html = parse_email(filepath)

    record = {
        "key": seq["key"],
        "tier": seq["tier"],
        "day": seq["day"],
        "subject": subject,
        "body_html": body_html,
    }

    data = json.dumps(record).encode()
    req = urllib.request.Request(
        f"{PB_URL}/api/collections/email_sequences/records",
        data=data,
        headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    )
    try:
        resp = json.loads(urllib.request.urlopen(req).read())
        print(f"  Loaded: {seq['key']} (day {seq['day']}, {seq['tier']})")
    except urllib.error.HTTPError as e:
        err_body = e.read().decode()
        print(f"  ERROR {seq['key']}: {err_body[:300]}")

print(f"\nDone: {len(SEQUENCES)} emails loaded into Pocketbase")
