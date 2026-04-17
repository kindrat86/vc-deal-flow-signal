#!/usr/bin/env python3
"""Build a self-contained subscriber dashboard (HTML).

Fetches data from:
  - PocketBase (subscribers + email_log) — signups, tiers, sources, email engagement
  - Resend API (audience contacts)     — verified subscribers
  - PostHog (eu.posthog.com)            — visitors, sources, funnel

Output: monitoring/dashboard.html  (open with: open monitoring/dashboard.html)
"""
import json
import os
import sys
import urllib.request
import urllib.error
from collections import Counter, defaultdict
from datetime import date, datetime, timedelta, timezone

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(SCRIPT_DIR)
ENV_FILE = os.path.join(PROJECT_DIR, "email-api", ".env")
OUT_FILE = os.path.join(SCRIPT_DIR, "dashboard.html")

WINDOW_DAYS = 30

# Exclude the founder + tester accounts from all subscriber metrics.
TESTER_EMAILS = {
    "test@example.com",
    "mkondratyuk86@gmail.com",
    "maryan.kondratyuk@quickstarter.ai",
    "sales@sipiteno.com",
}
# Exclude founder's country from PostHog traffic (self-traffic noise).
EXCLUDE_COUNTRIES = {"GR"}

# Industry benchmarks (Russell Brunson / Greg Isenberg rule-of-thumb funnel).
BENCHMARK_OPT_IN = 3.0   # % of visitors → subscribers
BENCHMARK_PAID_LO = 1.0  # % of subs → paid (low end)
BENCHMARK_PAID_HI = 3.3  # % of subs → paid (high end, approx 30-100 of 3000)
BENCHMARK_ROWS = [
    {"traffic": 100,    "subs": 3,    "paid_lo": 0,  "paid_hi": 0},
    {"traffic": 1000,   "subs": 30,   "paid_lo": 0,  "paid_hi": 1},
    {"traffic": 10000,  "subs": 300,  "paid_lo": 3,  "paid_hi": 10},
    {"traffic": 100000, "subs": 3000, "paid_lo": 30, "paid_hi": 100},
]

COUNTRY_NAMES = {
    "US": "United States", "GB": "United Kingdom", "DE": "Germany",
    "FR": "France", "JP": "Japan", "IN": "India", "CN": "China",
    "KR": "South Korea", "IE": "Ireland", "TW": "Taiwan",
    "NL": "Netherlands", "SE": "Sweden", "CA": "Canada",
    "AU": "Australia", "BR": "Brazil", "ES": "Spain", "IT": "Italy",
    "SG": "Singapore", "IL": "Israel", "CH": "Switzerland",
    "AT": "Austria", "PL": "Poland", "BE": "Belgium", "PT": "Portugal",
    "DK": "Denmark", "FI": "Finland", "NO": "Norway", "RU": "Russia",
    "MX": "Mexico", "AR": "Argentina", "CZ": "Czechia", "RO": "Romania",
    "HU": "Hungary", "TR": "Turkey", "ZA": "South Africa",
    "TH": "Thailand", "VN": "Vietnam", "PH": "Philippines",
    "ID": "Indonesia", "MY": "Malaysia", "CL": "Chile", "CO": "Colombia",
    "EE": "Estonia", "LT": "Lithuania", "LV": "Latvia", "UA": "Ukraine",
    "HK": "Hong Kong", "AE": "UAE",
}


def load_env(path):
    env = {}
    with open(path) as f:
        for line in f:
            line = line.strip()
            if "=" in line and not line.startswith("#"):
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip().strip('"').strip("'")
    return env


env = load_env(ENV_FILE)
RESEND_API_KEY = env.get("RESEND_API_KEY", "")
PB_URL = env.get("PB_URL", "http://127.0.0.1:8090")
PB_EMAIL = env.get("PB_EMAIL", "")
PB_PASSWORD = env.get("PB_PASSWORD", "")
PH_API_KEY = env.get("PH_API_KEY", "")
PH_HOST = env.get("PH_HOST", "https://eu.posthog.com")
PH_PROJECT = env.get("PH_PROJECT", "")


def http(url, method="GET", data=None, headers=None):
    headers = dict(headers or {})
    headers.setdefault("User-Agent", "gitdealflow-dashboard/1.0")
    body = None
    if data is not None:
        body = json.dumps(data).encode()
        headers.setdefault("Content-Type", "application/json")
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return json.load(resp)
    except urllib.error.HTTPError as e:
        print(f"WARN: HTTP {e.code} {url}: {e.read().decode()[:160]}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"WARN: {url}: {e}", file=sys.stderr)
        return None


# ---------------- PocketBase ----------------

def pb_auth():
    r = http(
        f"{PB_URL}/api/collections/_superusers/auth-with-password",
        method="POST",
        data={"identity": PB_EMAIL, "password": PB_PASSWORD},
    )
    return r.get("token") if r else None


def pb_fetch_all(token, collection):
    items, page = [], 1
    while True:
        r = http(
            f"{PB_URL}/api/collections/{collection}/records?perPage=500&page={page}",
            headers={"Authorization": f"Bearer {token}"},
        )
        if not r:
            break
        items.extend(r.get("items", []))
        if page >= r.get("totalPages", 1):
            break
        page += 1
    return items


# ---------------- Resend ----------------

def resend_audience_contacts():
    if not RESEND_API_KEY:
        return []
    r = http(
        "https://api.resend.com/audiences",
        headers={"Authorization": f"Bearer {RESEND_API_KEY}"},
    )
    if not r or not r.get("data"):
        return []
    aid = r["data"][0]["id"]
    c = http(
        f"https://api.resend.com/audiences/{aid}/contacts",
        headers={"Authorization": f"Bearer {RESEND_API_KEY}"},
    )
    return c.get("data", []) if c else []


# ---------------- PostHog ----------------

def ph_query(hogql):
    if not PH_API_KEY or not PH_PROJECT:
        return None
    return http(
        f"{PH_HOST}/api/environments/{PH_PROJECT}/query/",
        method="POST",
        data={"query": {"kind": "HogQLQuery", "query": hogql}},
        headers={"Authorization": f"Bearer {PH_API_KEY}"},
    )


# ---------------- Collect ----------------

today = date.today()
window_start = today - timedelta(days=WINDOW_DAYS - 1)

print("Authenticating PocketBase...")
token = pb_auth()
subscribers, email_log = [], []
if token:
    subscribers = pb_fetch_all(token, "subscribers")
    email_log = pb_fetch_all(token, "email_log")
raw_sub_count, raw_log_count = len(subscribers), len(email_log)

# Filter testers out of subscribers + email_log (by subscriber relation).
tester_ids = {s["id"] for s in subscribers if (s.get("email") or "").lower() in TESTER_EMAILS}
subscribers = [s for s in subscribers if (s.get("email") or "").lower() not in TESTER_EMAILS]
email_log = [e for e in email_log if e.get("subscriber") not in tester_ids]
print(f"  subscribers: {len(subscribers)} (excluded {raw_sub_count - len(subscribers)} testers)"
      f", email_log: {len(email_log)} (excluded {raw_log_count - len(email_log)})")

print("Fetching Resend audience...")
resend_contacts = resend_audience_contacts()
resend_emails = {
    c["email"].lower() for c in resend_contacts
    if not c.get("unsubscribed") and c["email"].lower() not in TESTER_EMAILS
}
print(f"  verified in Resend: {len(resend_emails)}")

print("Querying PostHog...")
# Build SQL fragment for excluded-country filter.
excl_list = ",".join(f"'{c}'" for c in EXCLUDE_COUNTRIES)
country_filter = (
    f"AND coalesce(properties.$geoip_country_code, '') NOT IN ({excl_list})"
    if excl_list else ""
)

pv_total = ph_query(f"""
SELECT count() as pv, count(DISTINCT distinct_id) as uv
FROM events
WHERE event = '$pageview'
  AND timestamp >= '{window_start.isoformat()}'
  {country_filter}
""")

pv_daily = ph_query(f"""
SELECT toDate(timestamp) as d, count(DISTINCT distinct_id) as uv
FROM events
WHERE event = '$pageview'
  AND timestamp >= '{window_start.isoformat()}'
  {country_filter}
GROUP BY d ORDER BY d
""")

ph_sources = ph_query(f"""
SELECT coalesce(nullIf(properties.$referring_domain, ''), '(direct)') as src, count() as n
FROM events
WHERE event = '$pageview'
  AND timestamp >= '{window_start.isoformat()}'
  {country_filter}
GROUP BY src ORDER BY n DESC LIMIT 10
""")

ph_pages = ph_query(f"""
SELECT properties.$pathname as p, count() as n
FROM events
WHERE event = '$pageview'
  AND timestamp >= '{window_start.isoformat()}'
  {country_filter}
GROUP BY p ORDER BY n DESC LIMIT 10
""")

ph_countries = ph_query(f"""
SELECT coalesce(nullIf(properties.$geoip_country_code, ''), '?') as c, count() as n
FROM events
WHERE event = '$pageview'
  AND timestamp >= '{window_start.isoformat()}'
  {country_filter}
GROUP BY c ORDER BY n DESC LIMIT 15
""")


# ---------------- Aggregate ----------------

def parse_dt(s):
    if not s:
        return None
    s = s.replace("Z", "+00:00").split(".")[0]
    try:
        return datetime.fromisoformat(s).date()
    except Exception:
        return None


# Per-day signups (last WINDOW_DAYS)
daily_signups = defaultdict(int)
for s in subscribers:
    d = parse_dt(s.get("created"))
    if d and d >= window_start:
        daily_signups[d.isoformat()] += 1

# Fill missing dates with 0
chart_days = []
for i in range(WINDOW_DAYS):
    d = (window_start + timedelta(days=i)).isoformat()
    chart_days.append({"d": d, "signups": daily_signups.get(d, 0)})

# Per-day visitors
daily_visitors_map = {}
if pv_daily and pv_daily.get("results"):
    for row in pv_daily["results"]:
        d_raw = row[0]
        # PostHog returns date as string or datetime — normalize
        d_str = str(d_raw)[:10]
        daily_visitors_map[d_str] = row[1]
for day in chart_days:
    day["visitors"] = daily_visitors_map.get(day["d"], 0)

# Source attribution (PB subscribers by source)
sub_sources = Counter()
for s in subscribers:
    sub_sources[s.get("source") or "unknown"] += 1

# Tier breakdown
tier_counts = Counter()
status_counts = Counter()
for s in subscribers:
    tier_counts[s.get("tier") or "free"] += 1
    status_counts[s.get("status") or "active"] += 1

# Verified vs unverified
sub_emails = {s.get("email", "").lower() for s in subscribers}
verified = sub_emails & resend_emails
unverified_in_pb = sub_emails - resend_emails

# Email log aggregates
email_status = Counter()
for e in email_log:
    email_status[e.get("status") or "unknown"] += 1

total_sent = sum(v for k, v in email_status.items() if k in ("sent", "opened", "clicked"))
total_opened = email_status.get("opened", 0) + email_status.get("clicked", 0)
total_clicked = email_status.get("clicked", 0)
open_rate = round(100 * total_opened / total_sent, 1) if total_sent else 0.0
click_rate = round(100 * total_clicked / total_sent, 1) if total_sent else 0.0

# PostHog totals
total_pv = 0
total_uv = 0
if pv_total and pv_total.get("results") and pv_total["results"]:
    total_pv = pv_total["results"][0][0] or 0
    total_uv = pv_total["results"][0][1] or 0

# Funnel
funnel = [
    {"label": f"Visitors ({WINDOW_DAYS}d)", "value": total_uv},
    {"label": "Signups (all time)", "value": len(subscribers)},
    {"label": "Verified (Resend)", "value": len(verified)},
]

# Recent subscribers (most recent 30)
def sort_key(s):
    return s.get("created") or ""

recent = sorted(subscribers, key=sort_key, reverse=True)[:30]
recent_rows = [
    {
        "email": s.get("email", ""),
        "created": (s.get("created") or "")[:10],
        "source": s.get("source") or "—",
        "tier": s.get("tier") or "free",
        "status": s.get("status") or "active",
        "verified": s.get("email", "").lower() in resend_emails,
    }
    for s in recent
]

ph_sources_data = []
if ph_sources and ph_sources.get("results"):
    ph_sources_data = [{"src": r[0] or "(direct)", "n": r[1]} for r in ph_sources["results"]]

ph_pages_data = []
if ph_pages and ph_pages.get("results"):
    ph_pages_data = [{"p": r[0] or "/", "n": r[1]} for r in ph_pages["results"]]

ph_countries_data = []
if ph_countries and ph_countries.get("results"):
    for row in ph_countries["results"]:
        code = row[0] or "?"
        ph_countries_data.append({
            "code": code,
            "name": COUNTRY_NAMES.get(code, code),
            "n": row[1],
        })

conversion_rate = round(100 * len(subscribers) / total_uv, 2) if total_uv else 0.0

# Paid subs (Dashboard or Insider tier, active status)
paid_subs = sum(
    1 for s in subscribers
    if s.get("tier") in ("dashboard", "insider") and s.get("status") == "active"
)
paid_rate = round(100 * paid_subs / len(subscribers), 2) if subscribers else 0.0

# Determine benchmark tier + active row
if total_uv < 100:
    bench_stage, active_idx = "too-early", -1
elif total_uv < 1000:
    bench_stage, active_idx = "100–1K traffic", 0
elif total_uv < 10000:
    bench_stage, active_idx = "1K–10K traffic", 1
elif total_uv < 100000:
    bench_stage, active_idx = "10K–100K traffic", 2
else:
    bench_stage, active_idx = "100K+ traffic", 3

# Expected values against benchmark (using actual visitor count)
expected_subs = int(round(total_uv * BENCHMARK_OPT_IN / 100)) if total_uv else 0
expected_paid_lo = int(round(len(subscribers) * BENCHMARK_PAID_LO / 100))
expected_paid_hi = int(round(len(subscribers) * BENCHMARK_PAID_HI / 100))

def grade(actual, expected):
    """Return (status, delta_pct) where status ∈ {early, below, on-track, above}."""
    if expected == 0:
        return ("early", 0)
    ratio = actual / expected
    if ratio >= 1.0:
        return ("above", round((ratio - 1) * 100))
    if ratio >= 0.5:
        return ("on-track", round((ratio - 1) * 100))
    return ("below", round((ratio - 1) * 100))

opt_in_status, opt_in_delta = grade(len(subscribers), expected_subs)
paid_status, paid_delta = ("early", 0) if len(subscribers) < 30 else grade(paid_subs, expected_paid_lo)

# Build verdict text
if total_uv < 100:
    verdict_headline = "Too early — keep driving traffic"
    verdict_detail = (
        f"You have {total_uv} visitors in the last {WINDOW_DAYS}d. "
        f"Benchmarks assume at least 100 visitors before opt-in rate is meaningful. "
        f"Focus on Dream 100 seeding, not on conversion."
    )
elif opt_in_status == "above":
    verdict_headline = f"Opt-in is above benchmark ({conversion_rate}% vs 3% target)"
    verdict_detail = f"You're converting visitors well. Scale traffic — the funnel works."
elif opt_in_status == "on-track":
    verdict_headline = f"Opt-in is near benchmark ({conversion_rate}% vs 3% target)"
    verdict_detail = f"Within 50% of target. Tighten the hook/offer to close the gap."
else:
    verdict_headline = f"Opt-in is below benchmark ({conversion_rate}% vs 3% target)"
    verdict_detail = (
        f"Expected {expected_subs} subs from {total_uv} visitors; got {len(subscribers)}. "
        f"The leak is in the hook, not the traffic. Revisit headline + email-gate offer."
    )

payload = {
    "generated_at": datetime.now(timezone.utc).isoformat(),
    "window_days": WINDOW_DAYS,
    "kpis": {
        "visitors": total_uv,
        "pageviews": total_pv,
        "signups": len(subscribers),
        "verified": len(verified),
        "unverified": len(unverified_in_pb),
        "conversion_rate": conversion_rate,
        "emails_sent": total_sent,
        "open_rate": open_rate,
        "click_rate": click_rate,
    },
    "funnel": funnel,
    "daily": chart_days,
    "sub_sources": [{"src": k, "n": v} for k, v in sub_sources.most_common()],
    "tiers": [{"k": k, "n": v} for k, v in tier_counts.most_common()],
    "statuses": [{"k": k, "n": v} for k, v in status_counts.most_common()],
    "ph_sources": ph_sources_data,
    "ph_pages": ph_pages_data,
    "ph_countries": ph_countries_data,
    "excluded": {
        "countries": sorted(EXCLUDE_COUNTRIES),
        "testers": sorted(TESTER_EMAILS),
    },
    "benchmark": {
        "opt_in_target": BENCHMARK_OPT_IN,
        "paid_target_lo": BENCHMARK_PAID_LO,
        "paid_target_hi": BENCHMARK_PAID_HI,
        "rows": BENCHMARK_ROWS,
        "active_idx": active_idx,
        "stage": bench_stage,
        "actual_opt_in": conversion_rate,
        "actual_paid_rate": paid_rate,
        "paid_subs": paid_subs,
        "expected_subs": expected_subs,
        "expected_paid_lo": expected_paid_lo,
        "expected_paid_hi": expected_paid_hi,
        "opt_in_status": opt_in_status,
        "opt_in_delta": opt_in_delta,
        "paid_status": paid_status,
        "paid_delta": paid_delta,
        "verdict_headline": verdict_headline,
        "verdict_detail": verdict_detail,
    },
    "email_status": [{"k": k, "n": v} for k, v in email_status.most_common()],
    "recent": recent_rows,
}


# ---------------- Render HTML ----------------

HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Subscriber Dashboard — VC Deal Flow Signal</title>
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
<style>
  * { box-sizing: border-box; }
  body { margin:0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif; background:#0b1220; color:#e2e8f0; }
  .wrap { max-width:1200px; margin:0 auto; padding:32px 24px; }
  h1 { font-size:24px; margin:0 0 4px; color:#f1f5f9; }
  .sub { color:#64748b; font-size:13px; margin-bottom:24px; }
  .grid { display:grid; gap:16px; }
  .grid.cols-4 { grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); }
  .grid.cols-2 { grid-template-columns: repeat(auto-fit, minmax(480px, 1fr)); }
  .card { background:#111a2e; border:1px solid #1e293b; border-radius:10px; padding:18px; }
  .kpi .num { font-size:32px; font-weight:700; color:#f1f5f9; line-height:1; }
  .kpi .lbl { font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:1px; margin-top:8px; }
  .kpi .delta { font-size:12px; color:#22c55e; margin-top:4px; }
  h3 { font-size:12px; text-transform:uppercase; letter-spacing:1.5px; color:#0ea5e9; margin:0 0 14px; }
  table { width:100%; border-collapse:collapse; font-size:13px; }
  th, td { text-align:left; padding:8px 12px 8px 0; border-bottom:1px solid #1e293b; }
  th { font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:1px; }
  td.num, th.num { text-align:right; }
  .pill { display:inline-block; padding:2px 8px; font-size:11px; border-radius:99px; background:#1e293b; color:#cbd5e1; }
  .pill.ok { background:#14532d; color:#86efac; }
  .pill.warn { background:#422006; color:#fbbf24; }
  .funnel-row { display:flex; align-items:center; margin-bottom:10px; gap:12px; }
  .funnel-label { min-width:160px; font-size:13px; color:#cbd5e1; }
  .funnel-bar-wrap { flex:1; height:28px; background:#1e293b; border-radius:6px; overflow:hidden; }
  .funnel-bar { height:100%; background:linear-gradient(90deg,#0ea5e9,#38bdf8); display:flex; align-items:center; padding-left:12px; color:#fff; font-weight:600; font-size:13px; min-width:40px; }
  .verdict { border-left:4px solid #0ea5e9; padding:16px 20px; background:#0f1b33; border-radius:8px; }
  .verdict.above    { border-left-color:#22c55e; background:#062414; }
  .verdict.on-track { border-left-color:#f59e0b; background:#2b1c04; }
  .verdict.below    { border-left-color:#ef4444; background:#2a0d0d; }
  .verdict.early    { border-left-color:#64748b; background:#111a2e; }
  .verdict .hl { font-size:18px; font-weight:700; color:#f1f5f9; }
  .verdict .dt { font-size:13px; color:#cbd5e1; margin-top:6px; line-height:1.5; }
  tr.bench-active td { background:#0f1b33; color:#f1f5f9; font-weight:600; }
  .pill.above { background:#14532d; color:#86efac; }
  .pill.below { background:#450a0a; color:#fca5a5; }
  .pill.on-track { background:#422006; color:#fbbf24; }
  .pill.early { background:#1e293b; color:#94a3b8; }
  canvas { max-height:280px; }
  .mono { font-family:'SF Mono',Menlo,monospace; font-size:12px; }
  .row-group { margin-bottom:28px; }
  a { color:#38bdf8; }
  .foot { margin-top:32px; padding-top:16px; border-top:1px solid #1e293b; color:#64748b; font-size:11px; }
</style>
</head>
<body>
<div class="wrap">

<h1>Subscriber Dashboard</h1>
<div class="sub">
  VC Deal Flow Signal · Window: last __WINDOW_DAYS__ days · Generated: <span id="gen"></span>
  <div style="margin-top:4px;color:#475569;font-size:11px">
    Excluded: <span id="exc-countries"></span> traffic · <span id="exc-testers"></span> tester emails
  </div>
</div>

<div class="grid cols-4 row-group">
  <div class="card kpi"><div class="num" id="k-visitors">—</div><div class="lbl">Visitors (30d)</div></div>
  <div class="card kpi"><div class="num" id="k-signups">—</div><div class="lbl">Total signups</div></div>
  <div class="card kpi"><div class="num" id="k-verified">—</div><div class="lbl">Verified (Resend)</div></div>
  <div class="card kpi"><div class="num" id="k-conv">—</div><div class="lbl">Visitor → signup</div></div>
</div>

<div class="row-group">
  <div class="verdict" id="verdict">
    <div class="hl" id="v-headline"></div>
    <div class="dt" id="v-detail"></div>
  </div>
</div>

<div class="grid cols-2 row-group">
  <div class="card">
    <h3>Benchmark — Brunson/Isenberg rule of thumb</h3>
    <table>
      <thead>
        <tr><th>Traffic</th><th class="num">Subs @3%</th><th class="num">Paid @1%</th></tr>
      </thead>
      <tbody id="bench-table"></tbody>
    </table>
    <div style="margin-top:10px;font-size:11px;color:#64748b">
      Highlighted row = your current traffic band.
    </div>
  </div>
  <div class="card">
    <h3>How you're tracking</h3>
    <div style="font-size:13px;line-height:1.9;color:#cbd5e1">
      <div>Stage: <strong id="b-stage"></strong></div>
      <div>Opt-in rate: <strong id="b-optin"></strong> (target 3%) <span id="b-optin-pill" class="pill"></span></div>
      <div>Expected subs from <span id="b-visitors"></span> visitors: <strong id="b-expected-subs"></strong></div>
      <div>Actual subs: <strong id="b-actual-subs"></strong></div>
      <div style="margin-top:12px">Paid subs: <strong id="b-paid"></strong> · rate: <strong id="b-paid-rate"></strong> <span id="b-paid-pill" class="pill"></span></div>
      <div>Expected paid range: <strong id="b-expected-paid"></strong></div>
    </div>
  </div>
</div>

<div class="grid cols-2 row-group">
  <div class="card">
    <h3>Funnel</h3>
    <div id="funnel"></div>
  </div>
  <div class="card">
    <h3>Signups & visitors — daily (last __WINDOW_DAYS__d)</h3>
    <canvas id="dailyChart"></canvas>
  </div>
</div>

<div class="grid cols-2 row-group">
  <div class="card">
    <h3>Source attribution (subscribers)</h3>
    <table><thead><tr><th>Source</th><th class="num">Signups</th></tr></thead>
      <tbody id="sub-sources"></tbody></table>
  </div>
  <div class="card">
    <h3>Traffic sources (PostHog)</h3>
    <table><thead><tr><th>Referrer</th><th class="num">Pageviews</th></tr></thead>
      <tbody id="ph-sources"></tbody></table>
  </div>
</div>

<div class="grid cols-2 row-group">
  <div class="card">
    <h3>Tier / status</h3>
    <table><thead><tr><th>Tier</th><th class="num">Count</th></tr></thead>
      <tbody id="tiers"></tbody></table>
    <table style="margin-top:14px"><thead><tr><th>Status</th><th class="num">Count</th></tr></thead>
      <tbody id="statuses"></tbody></table>
  </div>
  <div class="card">
    <h3>Top pages</h3>
    <table><thead><tr><th>Path</th><th class="num">Views</th></tr></thead>
      <tbody id="ph-pages"></tbody></table>
  </div>
</div>

<div class="grid cols-2 row-group">
  <div class="card">
    <h3>Traffic by country</h3>
    <table><thead><tr><th>Country</th><th class="num">Pageviews</th></tr></thead>
      <tbody id="ph-countries"></tbody></table>
  </div>
  <div class="card">
    <h3>Country mix (top 5)</h3>
    <canvas id="countryChart"></canvas>
  </div>
</div>

<div class="grid cols-2 row-group">
  <div class="card">
    <h3>Email engagement</h3>
    <div class="grid cols-4" style="margin-bottom:16px">
      <div><div class="num" id="e-sent">—</div><div class="lbl">Sent</div></div>
      <div><div class="num" id="e-open">—</div><div class="lbl">Open rate</div></div>
      <div><div class="num" id="e-click">—</div><div class="lbl">Click rate</div></div>
    </div>
    <table><thead><tr><th>Status</th><th class="num">Count</th></tr></thead>
      <tbody id="email-status"></tbody></table>
    <div style="margin-top:10px;font-size:11px;color:#64748b">
      Open/click rates depend on Resend webhooks populating <code>email_log.status</code>.
      If rates look low, webhooks aren't wired up yet — status will stay at <code>sent</code>.
    </div>
  </div>
  <div class="card">
    <h3>Recent signups (latest 30)</h3>
    <table><thead><tr><th>Date</th><th>Email</th><th>Source</th><th>Verified</th></tr></thead>
      <tbody id="recent"></tbody></table>
  </div>
</div>

<div class="foot">
  Data sources: PocketBase (subscribers, email_log) · Resend (audience) · PostHog EU (visitors).
  Regenerate: <code class="mono">python3 monitoring/build-dashboard.py</code>
</div>

</div>

<script id="__data__" type="application/json">__DATA__</script>
<script>
const D = JSON.parse(document.getElementById('__data__').textContent);
const fmt = n => new Intl.NumberFormat('en-US').format(n || 0);

const athensFmt = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Athens',
  day: 'numeric', month: 'numeric', year: 'numeric',
  hour: '2-digit', minute: '2-digit', hour12: false,
});
document.getElementById('gen').textContent = athensFmt.format(new Date(D.generated_at)) + ' (Athens time)';
document.getElementById('exc-countries').textContent = (D.excluded.countries || []).join(', ') || '—';
document.getElementById('exc-testers').textContent = (D.excluded.testers || []).length;

// KPIs
document.getElementById('k-visitors').textContent = fmt(D.kpis.visitors);
document.getElementById('k-signups').textContent = fmt(D.kpis.signups);
document.getElementById('k-verified').textContent = fmt(D.kpis.verified);
document.getElementById('k-conv').textContent = D.kpis.conversion_rate + '%';
document.getElementById('e-sent').textContent = fmt(D.kpis.emails_sent);
document.getElementById('e-open').textContent = D.kpis.open_rate + '%';
document.getElementById('e-click').textContent = D.kpis.click_rate + '%';

// Verdict + benchmark
const B = D.benchmark;
const verdictEl = document.getElementById('verdict');
verdictEl.classList.add(B.opt_in_status);
document.getElementById('v-headline').textContent = B.verdict_headline;
document.getElementById('v-detail').textContent = B.verdict_detail;

document.getElementById('b-stage').textContent = B.stage;
document.getElementById('b-optin').textContent = B.actual_opt_in + '%';
document.getElementById('b-visitors').textContent = fmt(D.kpis.visitors);
document.getElementById('b-expected-subs').textContent = fmt(B.expected_subs);
document.getElementById('b-actual-subs').textContent = fmt(D.kpis.signups);
document.getElementById('b-paid').textContent = fmt(B.paid_subs);
document.getElementById('b-paid-rate').textContent = B.actual_paid_rate + '%';
document.getElementById('b-expected-paid').textContent = B.expected_paid_lo + '–' + B.expected_paid_hi;

const optinPill = document.getElementById('b-optin-pill');
optinPill.classList.add(B.opt_in_status);
optinPill.textContent = {above:'above', 'on-track':'on track', below:'below', early:'too early'}[B.opt_in_status];

const paidPill = document.getElementById('b-paid-pill');
paidPill.classList.add(B.paid_status);
paidPill.textContent = {above:'above', 'on-track':'on track', below:'below', early:'too early'}[B.paid_status];

const benchTbody = document.getElementById('bench-table');
benchTbody.innerHTML = B.rows.map((r, i) => `
  <tr class="${i === B.active_idx ? 'bench-active' : ''}">
    <td>${fmt(r.traffic)}</td>
    <td class="num">${fmt(r.subs)}</td>
    <td class="num">${r.paid_lo === r.paid_hi ? r.paid_lo : r.paid_lo + '–' + r.paid_hi}</td>
  </tr>`).join('');

// Funnel
const maxF = Math.max(1, ...D.funnel.map(f => f.value));
document.getElementById('funnel').innerHTML = D.funnel.map(f => `
  <div class="funnel-row">
    <div class="funnel-label">${f.label}</div>
    <div class="funnel-bar-wrap">
      <div class="funnel-bar" style="width:${Math.max(5, 100*f.value/maxF)}%">${fmt(f.value)}</div>
    </div>
  </div>`).join('');

// Chart
const ctx = document.getElementById('dailyChart');
new Chart(ctx, {
  type: 'line',
  data: {
    labels: D.daily.map(x => x.d.slice(5)),
    datasets: [
      { label: 'Signups', data: D.daily.map(x => x.signups), borderColor: '#0ea5e9', backgroundColor:'rgba(14,165,233,0.2)', tension:0.3, yAxisID:'y' },
      { label: 'Visitors', data: D.daily.map(x => x.visitors), borderColor: '#f59e0b', backgroundColor:'rgba(245,158,11,0.1)', tension:0.3, yAxisID:'y1' }
    ]
  },
  options: {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#cbd5e1' } } },
    scales: {
      x: { ticks:{ color:'#64748b' }, grid:{ color:'#1e293b' } },
      y: { position:'left', ticks:{ color:'#0ea5e9' }, grid:{ color:'#1e293b' }, title:{ display:true, text:'Signups', color:'#0ea5e9'} },
      y1:{ position:'right', ticks:{ color:'#f59e0b' }, grid:{ drawOnChartArea:false }, title:{ display:true, text:'Visitors', color:'#f59e0b'} }
    }
  }
});

// Tables
const tbl = (id, rows, cellFns) => {
  const el = document.getElementById(id);
  if (!rows.length) { el.innerHTML = `<tr><td colspan="${cellFns.length}" style="color:#64748b">No data</td></tr>`; return; }
  el.innerHTML = rows.map(r => '<tr>' + cellFns.map(fn => fn(r)).join('') + '</tr>').join('');
};

tbl('sub-sources', D.sub_sources, [r => `<td>${r.src}</td>`, r => `<td class="num">${fmt(r.n)}</td>`]);
tbl('ph-sources', D.ph_sources, [r => `<td>${r.src}</td>`, r => `<td class="num">${fmt(r.n)}</td>`]);
tbl('ph-pages',   D.ph_pages,   [r => `<td class="mono">${r.p}</td>`, r => `<td class="num">${fmt(r.n)}</td>`]);
tbl('tiers',      D.tiers,      [r => `<td>${r.k}</td>`, r => `<td class="num">${fmt(r.n)}</td>`]);
tbl('statuses',   D.statuses,   [r => `<td>${r.k}</td>`, r => `<td class="num">${fmt(r.n)}</td>`]);
tbl('email-status', D.email_status, [r => `<td>${r.k}</td>`, r => `<td class="num">${fmt(r.n)}</td>`]);
tbl('recent', D.recent, [
  r => `<td class="mono">${r.created}</td>`,
  r => `<td>${r.email}</td>`,
  r => `<td>${r.source}</td>`,
  r => `<td><span class="pill ${r.verified ? 'ok' : 'warn'}">${r.verified ? 'verified' : 'pending'}</span></td>`,
]);

tbl('ph-countries', D.ph_countries, [
  r => `<td>${r.name} <span style="color:#64748b">(${r.code})</span></td>`,
  r => `<td class="num">${fmt(r.n)}</td>`,
]);

// Country donut (top 5, rest bucketed)
const topC = (D.ph_countries || []).slice(0, 5);
const restC = (D.ph_countries || []).slice(5).reduce((s, r) => s + r.n, 0);
const cLabels = topC.map(r => r.code);
const cData = topC.map(r => r.n);
if (restC > 0) { cLabels.push('Other'); cData.push(restC); }
if (cData.length) {
  new Chart(document.getElementById('countryChart'), {
    type: 'doughnut',
    data: {
      labels: cLabels,
      datasets: [{
        data: cData,
        backgroundColor: ['#0ea5e9','#22c55e','#f59e0b','#a855f7','#ef4444','#64748b'],
        borderColor: '#0b1220', borderWidth: 2,
      }],
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: { legend: { position: 'right', labels: { color: '#cbd5e1' } } },
    },
  });
}
</script>
</body>
</html>
"""

out = HTML.replace("__WINDOW_DAYS__", str(WINDOW_DAYS)).replace(
    "__DATA__", json.dumps(payload, default=str)
)
with open(OUT_FILE, "w") as f:
    f.write(out)

print(f"\nWrote {OUT_FILE}")
print(f"Open with: open {OUT_FILE}")
