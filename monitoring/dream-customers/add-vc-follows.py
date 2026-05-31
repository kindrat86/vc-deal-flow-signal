#!/usr/bin/env python3
"""One-off: upsert newly-followed VC contacts into the PocketBase `contacts`
collection used by dashboard.html. Idempotent (matched by x_handle).

Reads PB creds from email-api/.env (PB_URL/PB_EMAIL/PB_PASSWORD), same as
migrate-json-to-pb.py. Local-only; does NOT deploy anything.
"""
import json, os, sys, urllib.request, urllib.parse, urllib.error, datetime

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(os.path.dirname(SCRIPT_DIR))
ENV_FILE = os.path.join(PROJECT_DIR, "email-api", ".env")

NOW = datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d")

# Only genuinely-completed follows from the 2026-05-30 session.
# (rabois/joshelman/galeforceVC/ollieforsyth clicks did NOT register — excluded.)
NEW = [
    {"x_handle": "sourceryy",    "display_name": "sourcery",       "firm": "sourceryvc (newsletter/podcast)", "role": "Investing + tech media",
     "note": f"VC newsletter/podcast. Followed {NOW}."},
    {"x_handle": "stevehaners_", "display_name": "Steve Han",      "firm": "Anti Fund",   "role": "Partner",
     "note": f"Followed {NOW}."},
    {"x_handle": "breeves08",    "display_name": "Brandon Reeves", "firm": "Lux Capital", "role": "Investor",
     "note": f"Followed {NOW}."},
    {"x_handle": "BrianACronin", "display_name": "Brian Cronin",   "firm": "",            "role": "VC researcher / investment consultant",
     "note": f"PENDING follow request (protected acct); already follows @data_nerd. {NOW}."},
]


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
    h = {"User-Agent": "crm-add-vc/1.0"}
    if token:
        h["Authorization"] = "Bearer " + token
    data = None
    if body is not None:
        data = json.dumps(body).encode()
        h["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, headers=h, method=method)
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            t = r.read()
            return json.loads(t) if t else {}
    except urllib.error.HTTPError as e:
        raise RuntimeError(f"HTTP {e.code} {url}: {e.read().decode()[:300]}")


def main():
    env = load_env(ENV_FILE)
    PB = env.get("PB_URL", "http://127.0.0.1:8090").rstrip("/")
    tok = api(f"{PB}/api/collections/_superusers/auth-with-password", method="POST",
              body={"identity": env["PB_EMAIL"], "password": env["PB_PASSWORD"]})["token"]
    print("AUTH OK ->", PB)

    for n in NEW:
        h = n["x_handle"]
        qs = urllib.parse.urlencode({"filter": f'x_handle="{h}"', "perPage": 1})
        existing = api(f"{PB}/api/collections/contacts/records?{qs}", token=tok).get("items", [])
        if existing:
            rec = existing[0]
            body = {"stage": "following", "dream_customer": True}
            # only fill blanks, never clobber user edits
            if not rec.get("display_name") and n["display_name"]:
                body["display_name"] = n["display_name"]
            if not rec.get("firm") and n["firm"]:
                body["firm"] = n["firm"]
            if not rec.get("role") and n["role"]:
                body["role"] = n["role"]
            existing_notes = rec.get("notes") or ""
            body["notes"] = (existing_notes + " | " + n["note"]).strip(" |") if existing_notes else n["note"]
            api(f"{PB}/api/collections/contacts/records/{rec['id']}", token=tok, method="PATCH", body=body)
            print(f"UPDATED {h}: id={rec['id']} -> stage=following dream=true")
        else:
            body = {
                "x_handle": h, "display_name": n["display_name"], "firm": n["firm"],
                "role": n["role"], "segment": "", "stage": "following",
                "dream_customer": True, "notes": n["note"],
                "last_tweet_at": "", "last_tweet_text": "", "last_checked_at": "",
            }
            created = api(f"{PB}/api/collections/contacts/records", token=tok, method="POST", body=body)
            print(f"CREATED {h}: id={created.get('id')} -> stage=following dream=true")

    # final report: following-stage roster
    qs = urllib.parse.urlencode({"filter": 'stage="following"', "perPage": 500, "sort": "x_handle"})
    foll = api(f"{PB}/api/collections/contacts/records?{qs}", token=tok).get("items", [])
    print(f"\nFOLLOWING-STAGE TOTAL: {len(foll)}")
    for c in foll:
        print(f"  @{c['x_handle']:<18} {c.get('display_name','')!s:<18} {c.get('firm','')}")


if __name__ == "__main__":
    try:
        main()
    except Exception as e:
        print("ERROR:", e, file=sys.stderr)
        sys.exit(1)
