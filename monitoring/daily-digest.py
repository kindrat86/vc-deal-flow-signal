#!/usr/bin/env python3
"""Daily traffic digest for VC Deal Flow Signal.
Queries PostHog for yesterday's traffic, includes subscriber count from PocketBase,
and emails a summary via Resend. Runs daily at 8:00 AM via launchd."""

import json
import sys
import urllib.request
import urllib.error
from datetime import date, datetime, timedelta
import os

# --- Config ---
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
ENV_FILE = os.path.join(PROJECT_DIR, "email-api", ".env")
LOG_FILE = os.path.join(SCRIPT_DIR, "daily-digest.log")


def log(msg):
    with open(LOG_FILE, "a") as f:
        f.write(f"{date.today().isoformat()} | {msg}\n")


# Load .env
env = {}
with open(ENV_FILE) as f:
    for line in f:
        line = line.strip()
        if "=" in line and not line.startswith("#"):
            key, val = line.split("=", 1)
            env[key.strip()] = val.strip().strip('"').strip("'")

RESEND_API_KEY = env["RESEND_API_KEY"]
FROM_EMAIL = env["FROM_EMAIL"]
FROM_NAME = env.get("FROM_NAME", "The Data Nerd")
PH_API_KEY = env["PH_API_KEY"]
PH_HOST = env.get("PH_HOST", "https://eu.posthog.com")
PH_PROJECT = env.get("PH_PROJECT", "143861")
PB_URL = env.get("PB_URL", "http://127.0.0.1:8090")
PB_EMAIL = env.get("PB_EMAIL", "")
PB_PASSWORD = env.get("PB_PASSWORD", "")

YESTERDAY = (date.today() - timedelta(days=1)).isoformat()
TODAY = date.today().isoformat()


# --- Helpers ---

UA = "gitdealflow-digest/1.0"


def api_post(url, data, headers):
    encoded = json.dumps(data).encode()
    headers["User-Agent"] = UA
    req = urllib.request.Request(url, data=encoded, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        log(f"HTTP {e.code} from {url}: {body[:200]}")
        return None
    except Exception as e:
        log(f"Error calling {url}: {e}")
        return None


def api_get(url, headers):
    headers["User-Agent"] = UA
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            return json.load(resp)
    except Exception as e:
        log(f"GET error {url}: {e}")
        return None


def ph_query(hogql):
    return api_post(
        f"{PH_HOST}/api/environments/{PH_PROJECT}/query/",
        {"query": {"kind": "HogQLQuery", "query": hogql}},
        {"Authorization": f"Bearer {PH_API_KEY}", "Content-Type": "application/json"},
    )


def pb_auth():
    result = api_post(
        f"{PB_URL}/api/collections/_superusers/auth-with-password",
        {"identity": PB_EMAIL, "password": PB_PASSWORD},
        {"Content-Type": "application/json"},
    )
    return result.get("token") if result else None


COUNTRY_NAMES = {
    "US": "United States", "GB": "United Kingdom", "DE": "Germany",
    "FR": "France", "JP": "Japan", "IN": "India", "CN": "China",
    "KR": "South Korea", "GR": "Greece", "IE": "Ireland",
    "TW": "Taiwan", "NL": "Netherlands", "SE": "Sweden",
    "CA": "Canada", "AU": "Australia", "BR": "Brazil",
    "ES": "Spain", "IT": "Italy", "SG": "Singapore",
    "IL": "Israel", "CH": "Switzerland", "AT": "Austria",
    "PL": "Poland", "BE": "Belgium", "PT": "Portugal",
    "DK": "Denmark", "FI": "Finland", "NO": "Norway",
    "RU": "Russia", "MX": "Mexico", "AR": "Argentina",
    "CZ": "Czechia", "RO": "Romania", "HU": "Hungary",
    "TR": "Turkey", "ZA": "South Africa", "TH": "Thailand",
    "VN": "Vietnam", "PH": "Philippines", "ID": "Indonesia",
    "MY": "Malaysia", "CL": "Chile", "CO": "Colombia",
    "EE": "Estonia", "LT": "Lithuania", "LV": "Latvia",
    "UA": "Ukraine", "HK": "Hong Kong", "AE": "UAE",
}


def build_table_rows(data, formatter):
    if not data or not data.get("results"):
        return "<tr><td colspan='2' style='color:#94a3b8'>No data</td></tr>"
    rows = ""
    for row in data["results"]:
        label, views = formatter(row)
        rows += (
            f"<tr>"
            f"<td style='padding:4px 12px 4px 0'>{label}</td>"
            f"<td style='padding:4px 0;text-align:right;font-weight:600'>{views}</td>"
            f"</tr>"
        )
    return rows


def fmt_country(row):
    code = row[0] or "?"
    name = COUNTRY_NAMES.get(code, code)
    return f"{name} ({code})", row[1]


def fmt_source(row):
    src = row[0] or "(direct)"
    if src in ("$$_posthog_breakdown_null_$$", "null", "None"):
        src = "(unknown)"
    return src, row[1]


def fmt_page(row):
    page = row[0] or "/"
    return f"<code>{page}</code>", row[1]


# --- Run queries ---

try:
    overview = ph_query(f"""
    SELECT
      count() as pageviews,
      count(DISTINCT distinct_id) as unique_visitors
    FROM events
    WHERE event = '$pageview'
      AND timestamp >= '{YESTERDAY}'
      AND timestamp < '{TODAY}'
    """)

    countries_data = ph_query(f"""
    SELECT
      properties.$geoip_country_code as country,
      count() as views
    FROM events
    WHERE event = '$pageview'
      AND timestamp >= '{YESTERDAY}'
      AND timestamp < '{TODAY}'
      AND country IS NOT NULL AND country != ''
    GROUP BY country
    ORDER BY views DESC
    LIMIT 15
    """)

    sources_data = ph_query(f"""
    SELECT
      coalesce(nullIf(properties.$referring_domain, ''), '(direct)') as source,
      count() as views
    FROM events
    WHERE event = '$pageview'
      AND timestamp >= '{YESTERDAY}'
      AND timestamp < '{TODAY}'
    GROUP BY source
    ORDER BY views DESC
    LIMIT 10
    """)

    pages_data = ph_query(f"""
    SELECT
      properties.$pathname as page,
      count() as views
    FROM events
    WHERE event = '$pageview'
      AND timestamp >= '{YESTERDAY}'
      AND timestamp < '{TODAY}'
    GROUP BY page
    ORDER BY views DESC
    LIMIT 10
    """)

    # Subscriber data from PocketBase
    sub_count = 0
    new_subs = []
    pb_token = pb_auth()
    if pb_token:
        # Fetch all subscribers with pagination
        all_subs = []
        page = 1
        while True:
            subs = api_get(
                f"{PB_URL}/api/collections/subscribers/records?perPage=200&page={page}",
                {"Authorization": f"Bearer {pb_token}", "Content-Type": "application/json"},
            )
            if not subs:
                break
            all_subs.extend(subs.get("items", []))
            if page >= subs.get("totalPages", 1):
                break
            page += 1
        sub_count = len([s for s in all_subs if s.get("status") == "active"])
        new_subs = [s for s in all_subs if s.get("created", "").startswith(YESTERDAY)]


    # --- Parse results ---

    pv = overview["results"][0][0] if overview and overview.get("results") else 0
    uv = overview["results"][0][1] if overview and overview.get("results") else 0

    countries_rows = build_table_rows(countries_data, fmt_country)
    sources_rows = build_table_rows(sources_data, fmt_source)
    pages_rows = build_table_rows(pages_data, fmt_page)

    new_subs_section = ""
    if new_subs:
        def esc(val):
            return str(val).replace("&","&amp;").replace("<","&lt;").replace(">","&gt;").replace('"',"&quot;")
        sub_lines = "".join(
            f"<li><strong>{esc(s.get('email',''))}</strong> (source: {esc(s.get('source','?'))})</li>"
            for s in new_subs
        )
        new_subs_section = f"""
        <h3 style="margin:24px 0 8px;color:#0ea5e9;font-size:14px;letter-spacing:1px">
          NEW SUBSCRIBERS YESTERDAY
        </h3>
        <ul style="margin:0;padding-left:20px;font-size:14px">{sub_lines}</ul>
        """


    # --- Build email ---

    html = f"""<!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
    <body style="margin:0;padding:0;background:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#1e293b">
    <div style="max-width:600px;margin:0 auto;padding:32px 24px">

      <div style="margin-bottom:24px">
        <strong style="color:#0ea5e9;font-size:14px;letter-spacing:1px">VC DEAL FLOW SIGNAL</strong>
        <span style="color:#94a3b8;font-size:14px"> &mdash; Daily Traffic Digest</span>
      </div>

      <p style="color:#64748b;font-size:13px;margin:0 0 20px">
        Report for <strong>{YESTERDAY}</strong>
      </p>

      <!--[if mso]><table role="presentation" cellpadding="0" cellspacing="0" width="100%"><tr><td width="33%"><![endif]-->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
        <tr>
          <td style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px;text-align:center;width:33%">
            <div style="font-size:32px;font-weight:700;color:#0f172a">{pv}</div>
            <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px">Pageviews</div>
          </td>
          <td style="width:12px"></td>
          <td style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px;text-align:center;width:33%">
            <div style="font-size:32px;font-weight:700;color:#0f172a">{uv}</div>
            <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px">Unique Visitors</div>
          </td>
          <td style="width:12px"></td>
          <td style="background:#fff;border:1px solid #e2e8f0;border-radius:8px;padding:16px;text-align:center;width:33%">
            <div style="font-size:32px;font-weight:700;color:#0f172a">{sub_count}</div>
            <div style="font-size:11px;color:#64748b;text-transform:uppercase;letter-spacing:1px">Total Subs</div>
          </td>
        </tr>
      </table>
      <!--[if mso]></td></tr></table><![endif]-->

      {new_subs_section}

      <h3 style="margin:24px 0 8px;color:#0ea5e9;font-size:14px;letter-spacing:1px">TRAFFIC SOURCES</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px">{sources_rows}</table>

      <h3 style="margin:24px 0 8px;color:#0ea5e9;font-size:14px;letter-spacing:1px">COUNTRIES</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px">{countries_rows}</table>

      <h3 style="margin:24px 0 8px;color:#0ea5e9;font-size:14px;letter-spacing:1px">TOP PAGES</h3>
      <table style="width:100%;border-collapse:collapse;font-size:14px">{pages_rows}</table>

      <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8">
        Auto-generated by daily-digest.py &middot; PostHog + PocketBase
      </div>

    </div>
    </body>
    </html>"""


    # --- Send ---

    subject = f"Traffic Digest {YESTERDAY}: {pv} pageviews, {uv} visitors"
    if new_subs:
        subject += f", {len(new_subs)} new sub{'s' if len(new_subs) != 1 else ''}"

    result = api_post(
        "https://api.resend.com/emails",
        {
            "from": f"{FROM_NAME} <{FROM_EMAIL}>",
            "to": FROM_EMAIL,
            "subject": subject,
            "html": html,
        },
        {"Authorization": f"Bearer {RESEND_API_KEY}", "Content-Type": "application/json"},
    )

    if result and result.get("id"):
        log(f"Sent: {subject}")
        print(f"OK: {subject}")
    else:
        log(f"FAILED: {result}")
        print(f"FAILED: {result}")

except Exception as e:
    print(f"FAILED: {e}")
    # Write failure marker for monitor.sh to check
    with open(os.path.join(os.path.dirname(__file__), "digest-status.txt"), "w") as f:
        f.write(f"FAILED at {datetime.now().isoformat()}: {e}\n")
    sys.exit(1)
