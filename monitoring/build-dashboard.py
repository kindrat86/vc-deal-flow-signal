#!/usr/bin/env python3
"""Build a self-contained subscriber dashboard (HTML).

Fetches data from:
  - PocketBase (subscribers + email_log) — signups, tiers, sources, email engagement
  - Resend API (audience contacts)     — verified subscribers
  - PostHog (eu.posthog.com)            — visitors, sources, funnel

Output: monitoring/dashboard.html  (open with: open monitoring/dashboard.html)
"""
import json
import math
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
# Keep in sync with pseo-site/lib/excluded-emails.ts and email-api/excluded-emails.mjs.
TESTER_EMAILS = {
    "test@example.com",
    "mkondratyuk86@gmail.com",
    "maryan.kondratyuk@quickstarter.ai",
    "sales@sipiteno.com",
    "signal@gitdealflow.com",
    "escape@invisibleexit.com",
}
# Disposable / scanner inboxes — verified by crawlers, not humans.
BOT_EMAILS = {
    "jakub@mailinator.com",
    "probe1777473122350@deltajohnsons.com",
    "shannon-pool-1777015174929-94zulc@deltajohnsons.com",
}
EXCLUDED_EMAILS = TESTER_EMAILS | BOT_EMAILS
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

# Marketing & distribution channels — manually curated.
# Stats as of `as_of`; update here when meaningful changes happen.
CHANNELS = {
    "social": [
        {"name": "Twitter / X", "handle": "@data_nerd",
         "url": "https://twitter.com/data_nerd",
         "stat": "1 follower · 57 posts · 88 following",
         "note": "First organic follower; daily Dream 100 blitz + own posts (not Premium)",
         "status": "active", "as_of": "2026-04-20"},
        {"name": "Reddit", "handle": "u/Worth_Wealth_6811",
         "url": "https://www.reddit.com/user/Worth_Wealth_6811",
         "stat": "731 karma · 976 contribs · 18 followers",
         "note": "Top 5% Poster; 5y account age; 80 gold · 27 achievements; user-managed",
         "status": "active", "as_of": "2026-04-21"},
        {"name": "LinkedIn", "handle": "company/gitdealflow",
         "url": "https://www.linkedin.com/company/gitdealflow",
         "stat": "1 follower · 55 imp (30d) · Post1 17% ER / Post2 5% ER",
         "note": "Short video + link-in-comment = 3x engagement vs long-form (Post1 vs Post2). User handles all LinkedIn actions — Claude drafts + tracks stats only.",
         "status": "active", "as_of": "2026-04-21"},
        {"name": "Product Hunt", "handle": "data_nerd",
         "url": "https://www.producthunt.com/@data_nerd",
         "stat": "0 followers · 18 following · 6-day streak",
         "note": "Launch: Apr 26 · 6 seeding comments/day · badges: Gemologist/Tastemaker/Gone streaking 5",
         "status": "pre-launch", "as_of": "2026-04-20"},
        {"name": "IndieHackers", "handle": "@The_Data_Nerd",
         "url": "https://www.indiehackers.com/The_Data_Nerd",
         "stat": "Product listing live · 4 active threads · depth 2.0 avg",
         "note": "IH redesign killed public followers/points; track thread depth + newsletter mentions instead. 4 replies earned Apr 20-21 (sabahattink, clawback, apives, Vishal_chaudhary)",
         "status": "active", "as_of": "2026-04-21"},
        {"name": "Hacker News", "handle": "the_data_nerd",
         "url": "https://news.ycombinator.com/user?id=the_data_nerd",
         "stat": "1 karma · 6d old · 7 comments posted",
         "note": "Manual-only (noob filter killed autonomous post Apr 20); Apr 20 (3) + Apr 21 (3) + Apr 17 (1) replies posted; daily drafts at marketing/hn-seeding/drafts/",
         "status": "active", "as_of": "2026-04-21"},
        {"name": "Telegram", "handle": "@gitdealflow",
         "url": "https://t.me/gitdealflow",
         "stat": "1 subscriber",
         "note": "Free public channel; bio refreshed to unified claims 2026-04-20; Insider Circle = separate private group",
         "status": "active", "as_of": "2026-04-20"},
        {"name": "Discord", "handle": "the_data_nerd",
         "url": "",
         "stat": "Cursor + TS joined",
         "note": "Blitz: Cursor #showcase Apr 18; TS lurk only",
         "status": "active", "as_of": "2026-04-17"},
    ],
    "content": [
        {"name": "Company Blog", "handle": "signals.gitdealflow.com/blog",
         "url": "https://signals.gitdealflow.com/blog",
         "stat": "20 posts live",
         "note": "Canonical URL for all cross-posts",
         "status": "active", "as_of": "2026-04-20"},
        {"name": "Medium", "handle": "@signal_41476",
         "url": "https://medium.com/@signal_41476",
         "stat": "1 post published",
         "note": "Canonical → signals.gitdealflow.com; Import Story tool",
         "status": "active", "as_of": "2026-04-19"},
        {"name": "Substack", "handle": "@thedatanerd2026",
         "url": "https://substack.com/@thedatanerd2026",
         "stat": "3 Notes posted · 12 scheduled",
         "note": "Notes channel only (no split-list newsletter)",
         "status": "active", "as_of": "2026-04-19"},
        {"name": "HackerNoon", "handle": "@TheData_7cdit42c",
         "url": "https://hackernoon.com/u/TheData_7cdit42c",
         "stat": "1 story in editorial queue",
         "note": "'Alternative Data for VC' · check Apr 22",
         "status": "pending-review", "as_of": "2026-04-19"},
        {"name": "dev.to", "handle": "data_nerd",
         "url": "https://dev.to/data_nerd/i-stopped-building-dashboards-ai-assistants-are-the-new-ui-c5h",
         "stat": "1 MCP article published",
         "note": "Canonical URL for Hashnode cross-post",
         "status": "active", "as_of": "2026-04-18"},
        {"name": "Hashnode", "handle": "gitdealflow.hashnode.dev",
         "url": "https://gitdealflow.hashnode.dev/i-stopped-building-dashboards-ai-assistants-are-the-new-ui",
         "stat": "1 cross-post live",
         "note": "Canonical → dev.to -c5h",
         "status": "active", "as_of": "2026-04-19"},
        {"name": "Quora", "handle": "The Data Nerd",
         "url": "https://www.quora.com/profile/The-Data-Nerd",
         "stat": "4 answers posted · 11 scheduled",
         "note": "Q1-Q4 live · 2/day pace through Apr 26",
         "status": "active", "as_of": "2026-04-20"},
    ],
    "directories": [
        {"name": "Crunchbase", "category": "Business", "status": "live",
         "as_of": "2026-04-16",
         "url": "https://www.crunchbase.com/organization/gitdealflow",
         "note": "High-DA backlink + VC discoverability"},
        {"name": "G2", "category": "Software", "status": "live",
         "as_of": "2026-04-16",
         "url": "https://www.g2.com/products/gitdealflow/reviews",
         "note": "Free listing; category assignment pending"},
        {"name": "SaaSHub", "category": "Software", "status": "live",
         "as_of": "2026-04-16",
         "url": "https://www.saashub.com/git-deal-flow-alternatives",
         "note": "Pending: verify badge + embed on landing"},
        {"name": "IH Products", "category": "Startup", "status": "live",
         "as_of": "2026-04-18",
         "url": "https://indiehackers.com/product/vc-deal-flow-signal",
         "note": "Links are nofollow — brand value only"},
        {"name": "Wikidata", "category": "Knowledge graph", "status": "live",
         "as_of": "2026-04-16",
         "url": "https://www.wikidata.org/wiki/Q139376302",
         "note": "Fully enriched: refs, P154 logo, P1813 short name"},
        {"name": "StackShare", "category": "Tech stack", "status": "live",
         "as_of": "2026-04-19",
         "url": "https://stackshare.io/vc-deal-flow-signal-spot-breakout-startups-before-anyone-else",
         "note": "Passive brand listing"},
        {"name": "FutureTools", "category": "AI", "status": "live",
         "as_of": "2026-04-19", "url": "", "note": ""},
        {"name": "AItoolslist.io", "category": "AI", "status": "live",
         "as_of": "2026-04-19", "url": "", "note": ""},
        {"name": "StartupRanking", "category": "Startup", "status": "submitted",
         "as_of": "2026-04-19",
         "url": "https://www.startupranking.com/startup/gitdealflow",
         "note": "Claimed + HTML-verified; 80-day free queue"},
        {"name": "SideProjectors", "category": "Indie", "status": "pending-review",
         "as_of": "2026-04-18",
         "url": "https://www.sideprojectors.com/project/78284/vc-deal-flow-signal-engineering-momentum-for-vcs",
         "note": "In mod queue; public URL ≠ approval"},
        {"name": "AlternativeTo", "category": "Software", "status": "queued",
         "as_of": "2026-04-16", "url": "",
         "note": "Account created; 7-day wait; submit after Apr 22"},
        {"name": "VentureRadar", "category": "Startup", "status": "submitted",
         "as_of": "2026-04-19", "url": "",
         "note": "~21-day free review; HQ: Cyprus"},
        {"name": "10words", "category": "SaaS", "status": "submitted",
         "as_of": "2026-04-19", "url": "",
         "note": "Queue: 1,866 days (~5y); passive only"},
        {"name": "OpenVC", "category": "VC", "status": "signed-up",
         "as_of": "2026-04-19", "url": "",
         "note": "For future outbound; not a passive directory"},
        {"name": "Dealroom for Builders", "category": "VC", "status": "applied",
         "as_of": "2026-04-19", "url": "",
         "note": "5-biz-day review; follow up ~May 1"},
        {"name": "CB Insights", "category": "VC", "status": "applied",
         "as_of": "2026-04-19", "url": "",
         "note": "Trial-signup lead-gen (no public form)"},
        {"name": "FinTech Report", "category": "Award", "status": "submitted",
         "as_of": "2026-04-19", "url": "",
         "note": "WealthTech nomination; editorial only"},
        {"name": "Letterlist", "category": "Newsletter", "status": "submitted",
         "as_of": "2026-04-19", "url": "https://letterlist.com",
         "note": "≤24h review · submitted via letterlist.com/submit/"},
        {"name": "InboxReads", "category": "Newsletter", "status": "submitted",
         "as_of": "2026-04-19", "url": "https://inboxreads.co",
         "note": "≤24h review · submitted via inboxreads.co/submit"},
        {"name": "daily.dev", "category": "Dev", "status": "deferred",
         "as_of": "2026-04-19", "url": "",
         "note": "Post-launch (~May 3+): one Squad submission"},
    ],
    "dev_search": [
        {"name": "npm — mcp-signal", "stat": "@gitdealflow/mcp-signal v1.2.0",
         "status": "live", "as_of": "2026-04-18",
         "url": "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
         "note": ""},
        {"name": "Glama MCP", "stat": "Full A-tier (5 tools, 4.8-4.9/5.0)",
         "status": "live", "as_of": "2026-04-18",
         "url": "https://glama.ai/mcp/servers/kindrat86/mcp-deal-flow-signal",
         "note": ""},
        {"name": "MCP Registry", "stat": "Listed as io.github.kindrat86/vc-deal-flow-signal",
         "status": "live", "as_of": "2026-04-17",
         "url": "https://registry.modelcontextprotocol.io", "note": ""},
        {"name": "awesome-mcp-servers", "stat": "PR #4933",
         "status": "pending-merge", "as_of": "2026-04-18",
         "url": "https://github.com/punkpeye/awesome-mcp-servers/pull/4933",
         "note": "In merge queue"},
        {"name": "Chrome Web Store", "stat": "Extension live",
         "status": "live", "as_of": "2026-04-17",
         "url": "https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn",
         "note": "Badge on Crunchbase/AngelList/PitchBook"},
        {"name": "awesome-quant", "stat": "PR #360 merged",
         "status": "live", "as_of": "2026-04-19",
         "url": "https://github.com/wilsonfreitas/awesome-quant/pull/360",
         "note": "Tier 5 link building"},
        {"name": "Kaggle", "stat": "Dataset mirror",
         "status": "live", "as_of": "2026-04-19",
         "url": "https://www.kaggle.com/datasets/thedatanerd2026/vc-deal-flow-signal",
         "note": "High-DA backlink bundle"},
        {"name": "Data.world", "stat": "Dataset mirror",
         "status": "live", "as_of": "2026-04-19",
         "url": "https://data.world/thedatanerd2026/vc-deal-flow-signal-startup-engineering-acceleration",
         "note": "High-DA backlink bundle"},
        {"name": "Zenodo", "stat": "DOI 10.5281/zenodo.19650920",
         "status": "live", "as_of": "2026-04-19",
         "url": "https://zenodo.org/records/19650920",
         "note": "Canonical, DOI-stamped"},
        {"name": "SSRN", "stat": "Paper LIVE (abstract 6606558, 29h review)",
         "status": "live", "as_of": "2026-04-20",
         "url": "https://ssrn.com/abstract=6606558",
         "note": "Author page ssrn.com/author=11219548"},
        {"name": "arXiv", "stat": "Endorsement candidate shortlist sent",
         "status": "pending-review", "as_of": "2026-04-19",
         "url": "https://arxiv.org", "note": "Awaiting endorser"},
        {"name": "Papers With Code", "stat": "Submission draft ready (SSRN live unblocks)",
         "status": "pending-review", "as_of": "2026-04-20",
         "url": "https://paperswithcode.com/submit",
         "note": "Paste distribution/research-paper/papers-with-code-submission.md"},
        {"name": "Google Search Console", "stat": "Configured",
         "status": "live", "as_of": "2026-04-15",
         "url": "https://search.google.com/search-console", "note": ""},
        {"name": "Bing Webmaster / IndexNow", "stat": "272 URLs submitted",
         "status": "live", "as_of": "2026-04-18",
         "url": "https://www.bing.com/webmasters",
         "note": "Propagates to Yandex + Seznam"},
        {"name": "Yandex Webmaster", "stat": "19 URLs reindexed · 12 tracked",
         "status": "live", "as_of": "2026-04-18",
         "url": "https://webmaster.yandex.com",
         "note": "Both properties verified"},
        {"name": "Brave Search", "stat": "apex + signals submitted",
         "status": "submitted", "as_of": "2026-04-18",
         "url": "https://search.brave.com", "note": ""},
        {"name": "llms.txt registry", "stat": "Finance category",
         "status": "submitted", "as_of": "2026-04-18",
         "url": "https://directory.llmstxt.cloud", "note": ""},
        {"name": "Perplexity Publishers", "stat": "Intake form submitted",
         "status": "applied", "as_of": "2026-04-18",
         "url": "https://www.perplexity.ai/hub/blog/perplexity-publishers-program",
         "note": "Follow up ~May 9"},
    ],
}

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


def resend_email_events(window_start_date):
    """Page through Resend /emails back to window_start_date. Returns list of
    email records with fields: to[], subject, last_event, created_at."""
    if not RESEND_API_KEY:
        return []
    cutoff_iso = window_start_date.isoformat()
    collected = []
    after = None
    # Hard cap at 50 pages (5000 emails) to prevent runaway
    for _ in range(50):
        url = "https://api.resend.com/emails?limit=100"
        if after:
            url += f"&after={after}"
        r = http(url, headers={"Authorization": f"Bearer {RESEND_API_KEY}"})
        if not r or not r.get("data"):
            break
        data = r["data"]
        collected.extend(data)
        oldest = data[-1].get("created_at", "")
        # created_at format: "2026-04-20 16:30:28.882432+00"; first 10 chars = date
        if oldest[:10] < cutoff_iso:
            break
        if not r.get("has_more"):
            break
        after = data[-1]["id"]
    return collected


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
email_sequences = []
if token:
    subscribers = pb_fetch_all(token, "subscribers")
    email_log = pb_fetch_all(token, "email_log")
    email_sequences = pb_fetch_all(token, "email_sequences")
raw_sub_count, raw_log_count = len(subscribers), len(email_log)

# Filter testers + bots out of subscribers + email_log (by subscriber relation).
tester_ids = {s["id"] for s in subscribers if (s.get("email") or "").lower() in EXCLUDED_EMAILS}
subscribers = [s for s in subscribers if (s.get("email") or "").lower() not in EXCLUDED_EMAILS]
email_log = [e for e in email_log if e.get("subscriber") not in tester_ids]
print(f"  subscribers: {len(subscribers)} (excluded {raw_sub_count - len(subscribers)} testers+bots)"
      f", email_log: {len(email_log)} (excluded {raw_log_count - len(email_log)})")

print("Fetching Resend audience...")
resend_contacts = resend_audience_contacts()
resend_emails = {
    c["email"].lower() for c in resend_contacts
    if not c.get("unsubscribed") and c["email"].lower() not in EXCLUDED_EMAILS
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

# Email log aggregates — prefer Resend API (pSEO signup path doesn't write PB email_log)
print("Fetching Resend email events...")
resend_events = resend_email_events(window_start)
print(f"  resend events fetched: {len(resend_events)}")

email_status = Counter()
email_source = "none"
# Only count subscriber-directed sends; cold outreach to editors etc. is a
# different pipeline and would pollute open/click denominators.
subscriber_emails = {(s.get("email") or "").lower() for s in subscribers}
if resend_events:
    email_source = "resend"
    for e in resend_events:
        recipients = e.get("to") or []
        to = (recipients[0] if recipients else "").lower()
        if to in EXCLUDED_EMAILS:
            continue
        if subscriber_emails and to not in subscriber_emails:
            continue
        subject = e.get("subject") or ""
        if subject.startswith("Confirm your email"):
            continue
        email_status[e.get("last_event") or "unknown"] += 1
elif email_log:
    email_source = "pocketbase"
    for e in email_log:
        email_status[e.get("status") or "unknown"] += 1

# Resend last_event vocabulary: scheduled, sent, delivered, bounced, complained,
# opened, clicked, delivery_delayed, failed. Treat anything delivered-or-later
# as "sent" for rate denominators.
_SENT_EVENTS = ("sent", "delivered", "opened", "clicked", "delivery_delayed")
total_sent = sum(email_status[k] for k in _SENT_EVENTS if k in email_status)
total_scheduled = email_status.get("scheduled", 0)
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

# Per-subscriber Resend event stats (sent / opened / clicked).
# Resend events have `to[]` + `last_event` but no subscriber_id, so we match by email.
per_sub_stats = {}
for s in subscribers:
    email = (s.get("email") or "").lower()
    if email:
        per_sub_stats[email] = {"sent": 0, "opened": 0, "clicked": 0}

for e in resend_events:
    recipients = e.get("to") or []
    to = (recipients[0] if recipients else "").lower()
    if to not in per_sub_stats:
        continue
    subject = e.get("subject") or ""
    # Skip the double-opt-in confirmation email; it would distort engagement rates.
    if subject.startswith("Confirm your email"):
        continue
    last = e.get("last_event") or ""
    if last in _SENT_EVENTS:
        per_sub_stats[to]["sent"] += 1
    if last in ("opened", "clicked"):
        per_sub_stats[to]["opened"] += 1
    if last == "clicked":
        per_sub_stats[to]["clicked"] += 1


# Per-subscriber sequence identification (from PB email_log latest email_key).
log_by_sub = defaultdict(list)
for e in email_log:
    log_by_sub[e.get("subscriber")].append(e)


def describe_sequence(key):
    if not key:
        return "—"
    if key.startswith("soap-opera-"):
        try:
            n = int(key.rsplit("-", 1)[1])
            return f"Soap Opera {n}/5"
        except Exception:
            return key
    if key.startswith("weekly-digest"):
        return "Weekly Digest"
    if key.startswith("welcome"):
        return "Welcome"
    return key


# Fallback: match Resend subjects → email_sequences.key (for pSEO signups that
# bypass the PB email_log writer).
subject_to_key = {
    (seq.get("subject") or "").strip(): seq.get("key")
    for seq in email_sequences
    if seq.get("subject") and seq.get("key")
}


def resend_latest_key_for(email):
    latest_ts, latest_key = "", None
    for e in resend_events:
        recipients = e.get("to") or []
        to = (recipients[0] if recipients else "").lower()
        if to != email:
            continue
        subj = (e.get("subject") or "").strip()
        if subj.startswith("Confirm your email"):
            continue
        key = subject_to_key.get(subj)
        if not key:
            continue
        ts = e.get("created_at") or ""
        if ts > latest_ts:
            latest_ts, latest_key = ts, key
    return latest_key


per_sub_sequence = {}
for s in subscribers:
    sid = s.get("id")
    logs = sorted(
        log_by_sub.get(sid, []),
        key=lambda x: x.get("sent_at") or x.get("created") or "",
        reverse=True,
    )
    latest_key = logs[0].get("email_key") if logs else None
    if not latest_key:
        latest_key = resend_latest_key_for((s.get("email") or "").lower())
    per_sub_sequence[sid] = describe_sequence(latest_key)


# Recent subscribers (most recent 30)
def sort_key(s):
    return s.get("created") or ""


def _rates(email):
    stats = per_sub_stats.get(email, {"sent": 0, "opened": 0, "clicked": 0})
    sent = stats["sent"]
    return {
        "emails_sent": sent,
        "open_rate": round(100 * stats["opened"] / sent, 1) if sent else 0.0,
        "click_rate": round(100 * stats["clicked"] / sent, 1) if sent else 0.0,
    }


recent = sorted(subscribers, key=sort_key, reverse=True)[:30]
recent_rows = [
    {
        "email": s.get("email", ""),
        "verified": s.get("email", "").lower() in resend_emails,
        "sequence": per_sub_sequence.get(s.get("id"), "—"),
        **_rates((s.get("email") or "").lower()),
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

# ---------------- Google Search Console (OAuth) ----------------
# Fetches clicks/impressions/CTR/position + top queries + top pages over the
# rolling WINDOW_DAYS window. Token at secrets/gsc-oauth-token.json (created
# by tools/gsc-oauth/login.py). Soft-fails if missing/expired.
gsc_data = None

def fetch_gsc():
    """Pull GSC search-analytics for the rolling window. Returns dict or None."""
    token_path = os.path.join(PROJECT_DIR, "secrets", "gsc-oauth-token.json")
    if not os.path.exists(token_path):
        return None
    try:
        from google.oauth2.credentials import Credentials
        from google.auth.transport.requests import Request as GoogleAuthRequest
        from googleapiclient.discovery import build as gbuild
    except Exception as e:
        return {"error": f"google libs missing: {e}"}

    properties = (env.get("GSC_PROPERTIES") or "sc-domain:gitdealflow.com").split(",")
    properties = [p.strip() for p in properties if p.strip()]

    try:
        creds = Credentials.from_authorized_user_file(
            token_path,
            scopes=["https://www.googleapis.com/auth/webmasters.readonly"],
        )
        if creds.expired and creds.refresh_token:
            creds.refresh(GoogleAuthRequest())
        sc = gbuild("searchconsole", "v1", credentials=creds, cache_discovery=False)
    except Exception as e:
        return {"error": f"auth failed: {e}"}

    end = date.today()
    start = end - timedelta(days=WINDOW_DAYS)
    out = {
        "properties": properties,
        "window_start": start.isoformat(),
        "window_end": end.isoformat(),
        "totals": {"clicks": 0, "impressions": 0, "ctr": 0.0, "position": 0.0},
        "top_queries": [],
        "top_pages": [],
    }
    pos_weighted_sum = 0.0
    pos_weight = 0

    def _query(prop, dimension):
        return sc.searchanalytics().query(
            siteUrl=prop,
            body={
                "startDate": start.isoformat(),
                "endDate": end.isoformat(),
                "dimensions": [dimension] if dimension else [],
                "rowLimit": 25 if dimension else 1,
            },
        ).execute()

    queries_agg = {}
    pages_agg = {}
    for prop in properties:
        try:
            tot = _query(prop, None)
            for r in tot.get("rows", []):
                out["totals"]["clicks"] += int(r.get("clicks", 0))
                out["totals"]["impressions"] += int(r.get("impressions", 0))
                if r.get("impressions"):
                    pos_weighted_sum += float(r.get("position", 0)) * int(r["impressions"])
                    pos_weight += int(r["impressions"])

            for r in _query(prop, "query").get("rows", []):
                k = r["keys"][0]
                rec = queries_agg.setdefault(k, {"q": k, "clicks": 0, "impressions": 0, "position_w": 0.0, "_w": 0})
                rec["clicks"] += int(r.get("clicks", 0))
                rec["impressions"] += int(r.get("impressions", 0))
                if r.get("impressions"):
                    rec["position_w"] += float(r.get("position", 0)) * int(r["impressions"])
                    rec["_w"] += int(r["impressions"])

            for r in _query(prop, "page").get("rows", []):
                k = r["keys"][0]
                rec = pages_agg.setdefault(k, {"p": k, "clicks": 0, "impressions": 0})
                rec["clicks"] += int(r.get("clicks", 0))
                rec["impressions"] += int(r.get("impressions", 0))
        except Exception as e:
            out.setdefault("warnings", []).append(f"{prop}: {e}")

    if out["totals"]["impressions"]:
        out["totals"]["ctr"] = round(100 * out["totals"]["clicks"] / out["totals"]["impressions"], 2)
    if pos_weight:
        out["totals"]["position"] = round(pos_weighted_sum / pos_weight, 1)

    def _finalize(rec):
        if rec.get("_w"):
            rec["position"] = round(rec["position_w"] / rec["_w"], 1)
        for k in ("position_w", "_w"):
            rec.pop(k, None)
        if rec.get("impressions"):
            rec["ctr"] = round(100 * rec["clicks"] / rec["impressions"], 2)
        else:
            rec["ctr"] = 0.0
        return rec

    out["top_queries"] = sorted(
        (_finalize(q) for q in queries_agg.values()),
        key=lambda x: (-x["clicks"], -x["impressions"]),
    )[:15]
    out["top_pages"] = sorted(
        pages_agg.values(),
        key=lambda x: (-x["clicks"], -x["impressions"]),
    )[:10]
    for p in out["top_pages"]:
        p["ctr"] = round(100 * p["clicks"] / p["impressions"], 2) if p["impressions"] else 0.0
    return out

try:
    gsc_data = fetch_gsc()
    if gsc_data and not gsc_data.get("error"):
        print(f"  GSC: {gsc_data['totals']['clicks']} clicks / {gsc_data['totals']['impressions']} impressions / pos {gsc_data['totals']['position']}")
except Exception as e:
    gsc_data = {"error": str(e)}
    print(f"  GSC: skipped ({e})")

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

# ---------------- Forecast: weekly organic traffic, next 16 weeks ----------------
# Per-channel ramp model. Each channel contributes independently; totals stack.
# Numbers are calibrated to a developer-investor niche (small TAM, long-tail-heavy).
# Scenario bands: low = 50% of mid (sandbox-extended / unfeatured), high = 1.7× mid
# (Reddit AEO compounds + a single Tier-1 citation lands earlier than expected).
#
# Assumptions baked in:
#   - Reddit wave shipped 2026-05-02 → spike in weeks 1–3, fades to plateau by week 6.
#   - Google sandbox: branded queries index w2–4, long-tail pSEO from w6, head terms w12+.
#   - AI engines (Perplexity/ChatGPT search/Claude/Poe) cite from w2, compound through w12.
#   - SSRN/OpenAlex propagation lifts academic + Google authority from w4.
#   - Direct (Smithery 98 / Cursor / Poe / GitHub README) is the only "today" channel.
FORECAST_WEEKS = 16

# Anchor: current 30d visitor rate from PostHog → weekly equivalent.
# Treated as already-flowing baseline that persists alongside ramping channels.
baseline_weekly = round(total_uv / (WINDOW_DAYS / 7)) if total_uv else 0

FORECAST_CHANNELS = [
    # key,    name,                                                         lag, ramp, mature, shape, [extras]
    {"key": "direct",   "color": "#0ea5e9", "short": "Direct & registries",
     "name": "Direct & registries (Smithery 98 / Cursor / Poe / GitHub)",
     "lag": 0, "ramp": 8, "mature": 60, "shape": "linear"},
    {"key": "reddit",   "color": "#f97316", "short": "Reddit AEO",
     "name": "Reddit AEO (May 2 wave + organic comments)",
     "lag": 0, "ramp": 6, "mature": 30, "shape": "spike",
     "spike_peak": 90, "spike_week": 1},
    {"key": "g_brand",  "color": "#22c55e", "short": "Google — branded",
     "name": "Google — branded queries",
     "lag": 2, "ramp": 4, "mature": 25, "shape": "log"},
    {"key": "g_long",   "color": "#a855f7", "short": "Google — long-tail pSEO",
     "name": "Google — long-tail pSEO (alternatives, glossary, vs)",
     "lag": 6, "ramp": 14, "mature": 220, "shape": "log"},
    {"key": "g_head",   "color": "#ec4899", "short": "Google — head terms",
     "name": "Google — competitive head terms",
     "lag": 12, "ramp": 16, "mature": 80, "shape": "log"},
    {"key": "ai",       "color": "#eab308", "short": "AI engines",
     "name": "AI engines (Perplexity / ChatGPT / Claude / Poe)",
     "lag": 2, "ramp": 10, "mature": 55, "shape": "log"},
    {"key": "academic", "color": "#06b6d4", "short": "Academic / SSRN",
     "name": "Academic / SSRN / OpenAlex propagation",
     "lag": 4, "ramp": 10, "mature": 15, "shape": "log"},
    {"key": "social",   "color": "#94a3b8", "short": "Social",
     "name": "Social (Twitter / LinkedIn / IH / HN)",
     "lag": 0, "ramp": 16, "mature": 30, "shape": "linear"},
]


def _channel_value(ch, w):
    """Weekly visitors contributed by `ch` at week index w (0-based)."""
    if w < ch["lag"]:
        return 0.0
    progress = (w - ch["lag"]) / max(1, ch["ramp"])
    shape = ch["shape"]
    mature = ch["mature"]
    if shape == "linear":
        return min(1.0, progress) * mature
    if shape == "log":
        # Logistic curve centered at half-ramp; slow start, plateau at mature.
        x = (progress - 0.5) * 6
        return mature / (1 + math.exp(-x))
    if shape == "spike":
        # Linear ramp to peak, then exponential decay toward `mature`.
        peak = ch.get("spike_peak", mature * 2)
        sw = ch.get("spike_week", 1)
        if w <= sw:
            return (w / max(1, sw)) * peak
        decay_progress = min(1.0, (w - sw) / max(1, ch["ramp"]))
        return peak - (peak - mature) * decay_progress
    return mature


forecast_today = date.today()
forecast_rows = []
for w in range(FORECAST_WEEKS):
    # Pass w+1 so displayed Week 1 reflects "1 week of activity" rather than t=0
    # (channels that just shipped, like the Reddit wave, are already producing).
    model_w = w + 1
    by_channel = {ch["key"]: round(_channel_value(ch, model_w)) for ch in FORECAST_CHANNELS}
    channel_total = sum(by_channel.values())
    mid = channel_total + baseline_weekly
    forecast_rows.append({
        "w": w + 1,
        "start": (forecast_today + timedelta(days=w * 7)).isoformat(),
        "by": by_channel,
        "low": int(round(mid * 0.5)),
        "mid": mid,
        "high": int(round(mid * 1.7)),
    })

# Cumulative + key milestones (mid scenario).
forecast_cumulative = []
cum = 0
for row in forecast_rows:
    cum += row["mid"]
    forecast_cumulative.append(cum)

# Daily breakdown: distribute each week's totals across its 7 days.
# Lets the dashboard compare projected vs actual on a per-day basis for any
# user-selected range, instead of only at weekly granularity.
forecast_daily = []
for row in forecast_rows:
    week_start = date.fromisoformat(row["start"])
    daily_low  = row["low"]  / 7.0
    daily_mid  = row["mid"]  / 7.0
    daily_high = row["high"] / 7.0
    for d in range(7):
        forecast_daily.append({
            "d":    (week_start + timedelta(days=d)).isoformat(),
            "w":    row["w"],
            "low":  round(daily_low,  2),
            "mid":  round(daily_mid,  2),
            "high": round(daily_high, 2),
        })

# Headline numbers: week 4, 8, 12, 16 (mid).
def _row(idx):
    return forecast_rows[idx] if idx < len(forecast_rows) else None

forecast_milestones = {
    "baseline_weekly": baseline_weekly,
    "w4_mid":  _row(3)["mid"]  if _row(3)  else 0,
    "w8_mid":  _row(7)["mid"]  if _row(7)  else 0,
    "w12_mid": _row(11)["mid"] if _row(11) else 0,
    "w16_mid": _row(15)["mid"] if _row(15) else 0,
    "w16_low":  _row(15)["low"]  if _row(15) else 0,
    "w16_high": _row(15)["high"] if _row(15) else 0,
    "cum_16w_mid": forecast_cumulative[-1] if forecast_cumulative else 0,
}

forecast_payload = {
    "weeks":       FORECAST_WEEKS,
    "generated":   forecast_today.isoformat(),
    "baseline":    baseline_weekly,
    "channels":    [{"key": c["key"], "name": c["name"], "short": c["short"], "color": c["color"]}
                    for c in FORECAST_CHANNELS],
    "rows":        forecast_rows,
    "daily":       forecast_daily,
    "cumulative":  forecast_cumulative,
    "milestones":  forecast_milestones,
    "notes": [
        "Baseline = current PostHog weekly visitor rate (last 30d). Persists alongside ramps.",
        "Reddit wave shipped 2026-05-02 — spike weeks 1–3, decays to plateau by week 6.",
        "Google sandbox: branded queries from w2–4, long-tail pSEO from w6, head terms w12+.",
        "AI engines (Perplexity/ChatGPT search/Claude/Poe) cite from w2, compound through w12.",
        "Bands: low = 50% mid (sandbox-extended), high = 170% mid (Tier-1 citation lands early).",
        "Calibrated to developer-investor niche — small TAM, long-tail-heavy, Reddit/AEO-skewed.",
    ],
}

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
        "emails_scheduled": total_scheduled,
        "open_rate": open_rate,
        "click_rate": click_rate,
        "email_source": email_source,
    },
    "funnel": funnel,
    "daily": chart_days,
    "sub_sources": [{"src": k, "n": v} for k, v in sub_sources.most_common()],
    "tiers": [{"k": k, "n": v} for k, v in tier_counts.most_common()],
    "statuses": [{"k": k, "n": v} for k, v in status_counts.most_common()],
    "ph_sources": ph_sources_data,
    "ph_pages": ph_pages_data,
    "ph_countries": ph_countries_data,
    "gsc": gsc_data,
    "excluded": {
        "countries": sorted(EXCLUDE_COUNTRIES),
        "testers": sorted(TESTER_EMAILS),
        "bots": sorted(BOT_EMAILS),
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
    "channels": CHANNELS,
    "forecast": forecast_payload,
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

<h1 style="margin-top:40px;font-size:20px">Google Search Console — last __WINDOW_DAYS__ days</h1>
<div class="sub" id="gsc-status">—</div>

<div class="grid cols-4 row-group">
  <div class="card kpi"><div class="num" id="gsc-clicks">—</div><div class="lbl">Clicks</div></div>
  <div class="card kpi"><div class="num" id="gsc-impressions">—</div><div class="lbl">Impressions</div></div>
  <div class="card kpi"><div class="num" id="gsc-ctr">—</div><div class="lbl">CTR</div></div>
  <div class="card kpi"><div class="num" id="gsc-position">—</div><div class="lbl">Avg position</div></div>
</div>

<div class="grid cols-2 row-group">
  <div class="card">
    <h3>Top queries (by clicks)</h3>
    <table><thead><tr><th>Query</th><th class="num">Clicks</th><th class="num">Impr.</th><th class="num">CTR</th><th class="num">Pos</th></tr></thead>
      <tbody id="gsc-queries"></tbody></table>
  </div>
  <div class="card">
    <h3>Top pages (by clicks)</h3>
    <table><thead><tr><th>Page</th><th class="num">Clicks</th><th class="num">Impr.</th><th class="num">CTR</th></tr></thead>
      <tbody id="gsc-pages"></tbody></table>
  </div>
</div>

<div class="grid cols-2 row-group">
  <div class="card">
    <h3>Email engagement</h3>
    <div class="grid cols-4" style="margin-bottom:16px">
      <div><div class="num" id="e-sent">—</div><div class="lbl">Sent</div></div>
      <div><div class="num" id="e-sched">—</div><div class="lbl">Scheduled</div></div>
      <div><div class="num" id="e-open">—</div><div class="lbl">Open rate</div></div>
      <div><div class="num" id="e-click">—</div><div class="lbl">Click rate</div></div>
    </div>
    <table><thead><tr><th>Status</th><th class="num">Count</th></tr></thead>
      <tbody id="email-status"></tbody></table>
    <div style="margin-top:10px;font-size:11px;color:#64748b" id="e-source-note">
      Source: <code>—</code>. Open/click tracking enabled on <code>gitdealflow.com</code>
      (2026-04-20). Emails sent before that date stay at <code>delivered</code>; new sends
      report <code>opened</code> / <code>clicked</code>.
    </div>
  </div>
  <div class="card">
    <h3>Per-subscriber engagement (latest 30)</h3>
    <table><thead><tr><th>Email</th><th class="num">Sent</th><th>Verified</th><th class="num">Open</th><th class="num">Click</th><th>Sequence</th></tr></thead>
      <tbody id="recent"></tbody></table>
  </div>
</div>

<h1 style="margin-top:40px;font-size:20px">Marketing & Distribution Channels</h1>
<div class="sub">All accounts, content platforms, directories, and search/AEO surfaces we're publishing on or monitoring.</div>

<div class="grid cols-4 row-group">
  <div class="card kpi"><div class="num" id="ch-total">—</div><div class="lbl">Total channels</div></div>
  <div class="card kpi"><div class="num" id="ch-live">—</div><div class="lbl">Live / active</div></div>
  <div class="card kpi"><div class="num" id="ch-pending">—</div><div class="lbl">Submitted / pending</div></div>
  <div class="card kpi"><div class="num" id="ch-prelaunch">—</div><div class="lbl">Pre-launch / queued</div></div>
</div>

<div class="grid cols-2 row-group">
  <div class="card">
    <h3>Social & Community</h3>
    <table>
      <thead><tr><th>Channel</th><th>Stats</th><th>Status</th></tr></thead>
      <tbody id="ch-social"></tbody>
    </table>
  </div>
  <div class="card">
    <h3>Content & Publishing</h3>
    <table>
      <thead><tr><th>Platform</th><th>Activity</th><th>Status</th></tr></thead>
      <tbody id="ch-content"></tbody>
    </table>
  </div>
</div>

<div class="grid cols-2 row-group">
  <div class="card">
    <h3>Directories & Listings</h3>
    <table>
      <thead><tr><th>Directory</th><th>Category</th><th>Status</th><th>As of</th></tr></thead>
      <tbody id="ch-directories"></tbody>
    </table>
  </div>
  <div class="card">
    <h3>Dev Ecosystem & Search / AEO</h3>
    <table>
      <thead><tr><th>Platform</th><th>Info</th><th>Status</th></tr></thead>
      <tbody id="ch-devsearch"></tbody>
    </table>
  </div>
</div>

<h1 style="margin-top:40px;font-size:20px">Organic traffic forecast — next 16 weeks</h1>
<div class="sub">
  Channel-decomposed weekly visitor estimate. Baseline = current PostHog rate. Bands = scenario range (low / mid / high).
  <span style="color:#475569">Recalibrate when actuals diverge ≥30% from mid for 2 consecutive weeks.</span>
</div>

<div class="grid cols-4 row-group">
  <div class="card kpi"><div class="num" id="f-baseline">—</div><div class="lbl">Baseline / week (now)</div></div>
  <div class="card kpi"><div class="num" id="f-w4">—</div><div class="lbl">Week 4 mid</div></div>
  <div class="card kpi"><div class="num" id="f-w12">—</div><div class="lbl">Week 12 mid</div></div>
  <div class="card kpi"><div class="num" id="f-w16">—</div><div class="lbl">Week 16 (low–high)</div></div>
</div>

<div class="grid cols-2 row-group">
  <div class="card" style="grid-column: 1 / -1">
    <h3>Weekly visitors by channel (stacked) + scenario bands</h3>
    <canvas id="forecastChart" style="max-height:340px"></canvas>
    <div style="margin-top:10px;font-size:11px;color:#64748b">
      Stacked bars = mid scenario by channel. Dashed lines = low (50%) and high (170%) totals.
      Baseline persists across all weeks.
    </div>
  </div>
</div>

<div class="grid cols-2 row-group">
  <div class="card">
    <h3>Week-by-week table (mid scenario)</h3>
    <div style="max-height:340px;overflow-y:auto">
      <table>
        <thead>
          <tr>
            <th>Wk</th><th>Starts</th>
            <th class="num">Low</th><th class="num">Mid</th><th class="num">High</th>
            <th class="num">Cum.</th>
          </tr>
        </thead>
        <tbody id="forecast-table"></tbody>
      </table>
    </div>
  </div>
  <div class="card">
    <h3>Model assumptions</h3>
    <ul id="forecast-notes" style="font-size:13px;line-height:1.7;color:#cbd5e1;padding-left:20px;margin:0"></ul>
    <div style="margin-top:14px;font-size:11px;color:#64748b">
      Channel mix at week 16 (mid):
    </div>
    <table style="margin-top:6px">
      <thead><tr><th>Channel</th><th class="num">/ week</th><th class="num">Share</th></tr></thead>
      <tbody id="forecast-mix"></tbody>
    </table>
  </div>
</div>

<h1 style="margin-top:40px;font-size:20px">Projected vs reality — daily</h1>
<div class="sub">
  Pick any date range. Projected = weekly mid distributed across 7 days. Reality = PostHog daily uniques.
  <span style="color:#475569">Today is excluded from the Δ stat (partial day). Dates before the forecast generation date have no projection.</span>
</div>

<div class="grid cols-4 row-group" style="align-items:end">
  <div class="card" style="padding:14px">
    <div class="lbl" style="margin-bottom:6px">From</div>
    <input id="pvr-from" type="date" class="mono"
      style="background:#0f1729;color:#e2e8f0;border:1px solid #1e293b;border-radius:6px;padding:6px 8px;width:100%;font-size:14px;font-family:inherit">
  </div>
  <div class="card" style="padding:14px">
    <div class="lbl" style="margin-bottom:6px">To</div>
    <input id="pvr-to" type="date" class="mono"
      style="background:#0f1729;color:#e2e8f0;border:1px solid #1e293b;border-radius:6px;padding:6px 8px;width:100%;font-size:14px;font-family:inherit">
  </div>
  <div class="card kpi"><div class="num" id="pvr-actual">—</div><div class="lbl" id="pvr-actual-lbl">Actual visitors (range)</div></div>
  <div class="card kpi"><div class="num" id="pvr-variance">—</div><div class="lbl" id="pvr-variance-lbl">Δ vs projected (overlap days)</div></div>
</div>

<div class="grid cols-2 row-group" style="margin-top:8px;gap:8px">
  <div style="display:flex;flex-wrap:wrap;gap:8px;grid-column:1 / -1">
    <button class="pvr-preset" data-preset="last7">Last 7 days</button>
    <button class="pvr-preset" data-preset="last30">Last 30 days</button>
    <button class="pvr-preset" data-preset="next14">Next 14 days</button>
    <button class="pvr-preset" data-preset="next30">Next 30 days</button>
    <button class="pvr-preset" data-preset="window">±14 days around today</button>
    <button class="pvr-preset" data-preset="all">Max range</button>
  </div>
</div>

<div class="grid cols-2 row-group">
  <div class="card" style="grid-column: 1 / -1">
    <h3>Daily actual vs projected</h3>
    <canvas id="pvrChart" style="max-height:340px"></canvas>
    <div style="margin-top:10px;font-size:11px;color:#64748b">
      Solid blue = actual (PostHog). Dashed yellow = projected mid. Faint red/green = projected low/high band.
    </div>
  </div>
</div>

<div class="grid cols-2 row-group">
  <div class="card" style="grid-column: 1 / -1">
    <h3>Day-by-day breakdown</h3>
    <div style="max-height:340px;overflow-y:auto">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th class="num">Actual</th>
            <th class="num">Proj. low</th>
            <th class="num">Proj. mid</th>
            <th class="num">Proj. high</th>
            <th class="num">Δ (act − mid)</th>
            <th class="num">Δ%</th>
          </tr>
        </thead>
        <tbody id="pvr-table"></tbody>
      </table>
    </div>
  </div>
</div>

<div class="foot">
  Data sources: PocketBase (subscribers, email_log) · Resend (audience) · PostHog EU (visitors) · manual curation (channels).
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
document.getElementById('e-sched').textContent = fmt(D.kpis.emails_scheduled || 0);
document.getElementById('e-open').textContent = D.kpis.open_rate + '%';
document.getElementById('e-click').textContent = D.kpis.click_rate + '%';
const srcEl = document.getElementById('e-source-note');
if (srcEl) {
  srcEl.innerHTML = srcEl.innerHTML.replace('<code>—</code>',
    '<code>' + (D.kpis.email_source || 'none') + '</code>');
}

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
  r => `<td>${r.email}</td>`,
  r => `<td class="num">${fmt(r.emails_sent)}</td>`,
  r => `<td><span class="pill ${r.verified ? 'ok' : 'warn'}">${r.verified ? 'verified' : 'pending'}</span></td>`,
  r => `<td class="num">${r.open_rate}%</td>`,
  r => `<td class="num">${r.click_rate}%</td>`,
  r => `<td>${r.sequence}</td>`,
]);

tbl('ph-countries', D.ph_countries, [
  r => `<td>${r.name} <span style="color:#64748b">(${r.code})</span></td>`,
  r => `<td class="num">${fmt(r.n)}</td>`,
]);

// ---- Marketing & distribution channels ----
const CH = D.channels || {social:[], content:[], directories:[], dev_search:[]};
const allCh = [...CH.social, ...CH.content, ...CH.directories, ...CH.dev_search];
const liveStatuses = new Set(['live','active']);
const pendingStatuses = new Set(['submitted','pending-review','applied','pending-merge']);
const prelaunchStatuses = new Set(['pre-launch','queued','signed-up','deferred']);

document.getElementById('ch-total').textContent = fmt(allCh.length);
document.getElementById('ch-live').textContent = fmt(allCh.filter(c => liveStatuses.has(c.status)).length);
document.getElementById('ch-pending').textContent = fmt(allCh.filter(c => pendingStatuses.has(c.status)).length);
document.getElementById('ch-prelaunch').textContent = fmt(allCh.filter(c => prelaunchStatuses.has(c.status)).length);

const pillClass = s => {
  if (liveStatuses.has(s)) return 'above';
  if (pendingStatuses.has(s)) return 'on-track';
  if (prelaunchStatuses.has(s)) return 'early';
  return '';
};
const statusPill = s => `<span class="pill ${pillClass(s)}">${s}</span>`;
const link = (name, url) => url ? `<a href="${url}" target="_blank" rel="noopener">${name}</a>` : name;
const muted = t => t ? `<div style="color:#64748b;font-size:11px;margin-top:2px">${t}</div>` : '';

tbl('ch-social', CH.social, [
  r => `<td>${link(r.name, r.url)}${muted(r.handle)}</td>`,
  r => `<td>${r.stat}${muted(r.note)}</td>`,
  r => `<td>${statusPill(r.status)}${muted(r.as_of)}</td>`,
]);

tbl('ch-content', CH.content, [
  r => `<td>${link(r.name, r.url)}${muted(r.handle)}</td>`,
  r => `<td>${r.stat}${muted(r.note)}</td>`,
  r => `<td>${statusPill(r.status)}${muted(r.as_of)}</td>`,
]);

tbl('ch-directories', CH.directories, [
  r => `<td>${link(r.name, r.url)}${muted(r.note)}</td>`,
  r => `<td>${r.category}</td>`,
  r => `<td>${statusPill(r.status)}</td>`,
  r => `<td class="mono">${r.as_of}</td>`,
]);

tbl('ch-devsearch', CH.dev_search, [
  r => `<td>${link(r.name, r.url)}</td>`,
  r => `<td>${r.stat}${muted(r.note)}</td>`,
  r => `<td>${statusPill(r.status)}${muted(r.as_of)}</td>`,
]);

// ---- Organic traffic forecast ----
const F = D.forecast;
if (F && F.rows && F.rows.length) {
  const M = F.milestones;
  document.getElementById('f-baseline').textContent = fmt(M.baseline_weekly);
  document.getElementById('f-w4').textContent = fmt(M.w4_mid);
  document.getElementById('f-w12').textContent = fmt(M.w12_mid);
  document.getElementById('f-w16').textContent = fmt(M.w16_low) + '–' + fmt(M.w16_high);

  // Notes
  document.getElementById('forecast-notes').innerHTML =
    F.notes.map(n => `<li>${n}</li>`).join('');

  // Week-by-week table
  let cum = 0;
  document.getElementById('forecast-table').innerHTML = F.rows.map(r => {
    cum += r.mid;
    return `<tr>
      <td>${r.w}</td>
      <td class="mono" style="color:#64748b">${r.start.slice(5)}</td>
      <td class="num" style="color:#94a3b8">${fmt(r.low)}</td>
      <td class="num" style="color:#f1f5f9;font-weight:600">${fmt(r.mid)}</td>
      <td class="num" style="color:#94a3b8">${fmt(r.high)}</td>
      <td class="num" style="color:#64748b">${fmt(cum)}</td>
    </tr>`;
  }).join('');

  // Channel mix at final week
  const lastRow = F.rows[F.rows.length - 1];
  const lastTotal = lastRow.mid - F.baseline;
  const mixRows = F.channels.map(ch => ({
    name: ch.name, color: ch.color,
    n: lastRow.by[ch.key] || 0,
    pct: lastTotal > 0 ? Math.round(100 * (lastRow.by[ch.key] || 0) / lastTotal) : 0,
  })).filter(r => r.n > 0).sort((a, b) => b.n - a.n);
  if (F.baseline > 0) {
    mixRows.push({name: 'Baseline (sticky)', color: '#475569',
                  n: F.baseline, pct: Math.round(100 * F.baseline / lastRow.mid)});
  }
  document.getElementById('forecast-mix').innerHTML = mixRows.map(r => `
    <tr>
      <td><span style="display:inline-block;width:10px;height:10px;background:${r.color};border-radius:2px;margin-right:6px;vertical-align:middle"></span>${r.name}</td>
      <td class="num">${fmt(r.n)}</td>
      <td class="num" style="color:#64748b">${r.pct}%</td>
    </tr>`).join('');

  // Stacked bar chart with low/high overlay lines
  const labels = F.rows.map(r => 'W' + r.w);
  const datasets = F.channels.map(ch => ({
    label: ch.short || ch.name,
    data: F.rows.map(r => r.by[ch.key] || 0),
    backgroundColor: ch.color,
    borderColor: ch.color,
    borderWidth: 0,
    stack: 'channels',
    type: 'bar',
  }));
  if (F.baseline > 0) {
    datasets.push({
      label: 'Baseline',
      data: F.rows.map(() => F.baseline),
      backgroundColor: '#475569',
      borderColor: '#475569',
      borderWidth: 0,
      stack: 'channels',
      type: 'bar',
    });
  }
  // Scenario bands
  datasets.push({
    label: 'Low (50%)',
    data: F.rows.map(r => r.low),
    type: 'line',
    borderColor: '#fca5a5',
    backgroundColor: 'transparent',
    borderDash: [4, 4],
    borderWidth: 2,
    pointRadius: 0,
    tension: 0.3,
  });
  datasets.push({
    label: 'High (170%)',
    data: F.rows.map(r => r.high),
    type: 'line',
    borderColor: '#86efac',
    backgroundColor: 'transparent',
    borderDash: [4, 4],
    borderWidth: 2,
    pointRadius: 0,
    tension: 0.3,
  });

  new Chart(document.getElementById('forecastChart'), {
    data: { labels, datasets },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#cbd5e1', boxWidth: 12, font: { size: 11 } } },
        tooltip: { mode: 'index', intersect: false },
      },
      scales: {
        x: { stacked: true, ticks: { color: '#64748b' }, grid: { color: '#1e293b' } },
        y: { stacked: true, ticks: { color: '#64748b' }, grid: { color: '#1e293b' },
             title: { display: true, text: 'Visitors / week', color: '#64748b' } },
      },
      interaction: { mode: 'index', intersect: false },
    },
  });
}

// ---- Projected vs Reality (daily, range-selectable) ----
(function() {
  const FD = (D.forecast && D.forecast.daily) || [];
  if (!FD.length) return;

  const fromInput = document.getElementById('pvr-from');
  const toInput   = document.getElementById('pvr-to');
  if (!fromInput || !toInput) return;

  const actualByDay = {};
  (D.daily || []).forEach(x => { actualByDay[x.d] = x.visitors; });
  const projByDay = {};
  FD.forEach(x => { projByDay[x.d] = x; });

  const today = (D.forecast && D.forecast.generated) || new Date().toISOString().slice(0, 10);
  const allDays = Array.from(new Set([
    ...Object.keys(actualByDay),
    ...Object.keys(projByDay),
  ])).sort();
  if (!allDays.length) return;

  const minDay = allDays[0];
  const maxDay = allDays[allDays.length - 1];
  fromInput.min = minDay; fromInput.max = maxDay;
  toInput.min   = minDay; toInput.max   = maxDay;

  const addDays = (iso, n) => {
    const dt = new Date(iso + 'T00:00:00Z');
    dt.setUTCDate(dt.getUTCDate() + n);
    return dt.toISOString().slice(0, 10);
  };
  const clamp = (iso) => iso < minDay ? minDay : (iso > maxDay ? maxDay : iso);

  const PRESETS = {
    last7:   () => [clamp(addDays(today, -6)),  clamp(today)],
    last30:  () => [clamp(addDays(today, -29)), clamp(today)],
    next14:  () => [clamp(today),               clamp(addDays(today,  13))],
    next30:  () => [clamp(today),               clamp(addDays(today,  29))],
    window:  () => [clamp(addDays(today, -14)), clamp(addDays(today,  14))],
    all:     () => [minDay, maxDay],
  };

  // Style preset buttons (use existing palette)
  document.querySelectorAll('.pvr-preset').forEach(b => {
    b.style.cssText =
      'background:#0f1729;color:#cbd5e1;border:1px solid #1e293b;' +
      'border-radius:6px;padding:6px 12px;font-size:12px;cursor:pointer;font-family:inherit';
    b.onmouseover = () => b.style.borderColor = '#0ea5e9';
    b.onmouseout  = () => b.style.borderColor = '#1e293b';
    b.addEventListener('click', () => {
      const r = PRESETS[b.dataset.preset];
      if (!r) return;
      const [f, t] = r();
      fromInput.value = f; toInput.value = t;
      render();
    });
  });

  // Default range: ±14 days around today (clamped)
  const def = PRESETS.window();
  fromInput.value = def[0];
  toInput.value   = def[1];

  let chart = null;

  function render() {
    let f = fromInput.value, t = toInput.value;
    if (!f || !t) return;
    if (f > t) { const tmp = f; f = t; t = tmp; fromInput.value = f; toInput.value = t; }

    // Build day list inclusive
    const days = [];
    let d = f;
    while (d <= t) { days.push(d); d = addDays(d, 1); }

    const actual   = days.map(x => (actualByDay[x] !== undefined) ? actualByDay[x] : null);
    const projMid  = days.map(x => projByDay[x] ? projByDay[x].mid  : null);
    const projLow  = days.map(x => projByDay[x] ? projByDay[x].low  : null);
    const projHigh = days.map(x => projByDay[x] ? projByDay[x].high : null);

    // Stats: sum across range, plus overlap-only variance.
    // Exclude today from variance (the day isn't closed yet — partial actuals
    // would skew the comparison heavily negative until day's end).
    let totalActual = 0, hasActualDays = 0;
    let overlapActual = 0, overlapProjMid = 0, overlapDays = 0;
    days.forEach(x => {
      const a = actualByDay[x];
      const p = projByDay[x];
      if (a !== undefined) { totalActual += a; hasActualDays += 1; }
      if (a !== undefined && p && x !== today) {
        overlapActual += a;
        overlapProjMid += p.mid;
        overlapDays += 1;
      }
    });

    document.getElementById('pvr-actual').textContent = fmt(Math.round(totalActual));
    document.getElementById('pvr-actual-lbl').textContent =
      'Actual visitors · ' + hasActualDays + ' day' + (hasActualDays === 1 ? '' : 's') + ' w/ data';

    const v = document.getElementById('pvr-variance');
    const vLbl = document.getElementById('pvr-variance-lbl');
    if (overlapDays > 0 && overlapProjMid > 0) {
      const pct = Math.round(100 * (overlapActual - overlapProjMid) / overlapProjMid);
      v.textContent = (pct >= 0 ? '+' : '') + pct + '%';
      v.style.color = pct >= 0 ? '#86efac' : '#fca5a5';
      vLbl.textContent = 'Δ vs projected · ' + overlapDays + ' closed day' + (overlapDays === 1 ? '' : 's');
    } else {
      v.textContent = '—';
      v.style.color = '#94a3b8';
      vLbl.textContent = 'Δ vs projected · no closed overlap days';
    }

    // Day-by-day table
    document.getElementById('pvr-table').innerHTML = days.map(x => {
      const a = actualByDay[x];
      const p = projByDay[x];
      const aTxt = (a !== undefined) ? fmt(a) : '<span style="color:#475569">—</span>';
      const pLow  = p ? p.low.toFixed(1)  : '<span style="color:#475569">—</span>';
      const pMid  = p ? p.mid.toFixed(1)  : '<span style="color:#475569">—</span>';
      const pHigh = p ? p.high.toFixed(1) : '<span style="color:#475569">—</span>';
      const isToday = (x === today);
      let dTxt = '<span style="color:#475569">—</span>';
      let pctTxt = '<span style="color:#475569">—</span>';
      if (a !== undefined && p) {
        const delta = a - p.mid;
        const pct = p.mid > 0 ? Math.round(100 * delta / p.mid) : 0;
        // Today is in-progress — neutral color so partial actuals don't read as a "miss".
        const col = isToday
          ? '#94a3b8'
          : (delta >= 0 ? '#86efac' : '#fca5a5');
        dTxt   = '<span style="color:' + col + '">' + (delta >= 0 ? '+' : '') + delta.toFixed(1) + '</span>';
        pctTxt = '<span style="color:' + col + '">' + (pct   >= 0 ? '+' : '') + pct + '%</span>';
      }
      const rowStyle = isToday ? 'background:rgba(14,165,233,0.06)' : '';
      const dCol = isToday ? '#0ea5e9' : '#94a3b8';
      const dayLabel = isToday ? ' · today (partial)' : '';
      return '<tr style="' + rowStyle + '">' +
        '<td class="mono" style="color:' + dCol + '">' + x + dayLabel + '</td>' +
        '<td class="num" style="color:#f1f5f9;font-weight:600">' + aTxt + '</td>' +
        '<td class="num" style="color:#94a3b8">' + pLow  + '</td>' +
        '<td class="num" style="color:#cbd5e1;font-weight:600">' + pMid  + '</td>' +
        '<td class="num" style="color:#94a3b8">' + pHigh + '</td>' +
        '<td class="num">' + dTxt   + '</td>' +
        '<td class="num">' + pctTxt + '</td>' +
      '</tr>';
    }).join('');

    // Chart
    const labels = days.map(x => x.slice(5));
    const datasets = [
      { label: 'Actual',           data: actual,
        borderColor: '#0ea5e9', backgroundColor: 'rgba(14,165,233,0.18)',
        tension: 0.3, spanGaps: false, pointRadius: 3, fill: false, borderWidth: 2 },
      { label: 'Projected (mid)',  data: projMid,
        borderColor: '#eab308', backgroundColor: 'transparent',
        borderDash: [6, 4], tension: 0.3, spanGaps: false, pointRadius: 0, borderWidth: 2 },
      { label: 'Projected (low)',  data: projLow,
        borderColor: '#fca5a5', backgroundColor: 'transparent',
        borderDash: [2, 4], tension: 0.3, spanGaps: false, pointRadius: 0, borderWidth: 1 },
      { label: 'Projected (high)', data: projHigh,
        borderColor: '#86efac', backgroundColor: 'transparent',
        borderDash: [2, 4], tension: 0.3, spanGaps: false, pointRadius: 0, borderWidth: 1 },
    ];
    if (chart) chart.destroy();
    chart = new Chart(document.getElementById('pvrChart'), {
      type: 'line',
      data: { labels, datasets },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#cbd5e1', boxWidth: 12, font: { size: 11 } } },
          tooltip: { mode: 'index', intersect: false },
        },
        scales: {
          x: { ticks: { color: '#64748b', maxRotation: 0, autoSkip: true, maxTicksLimit: 16 },
               grid: { color: '#1e293b' } },
          y: { beginAtZero: true, ticks: { color: '#64748b' }, grid: { color: '#1e293b' },
               title: { display: true, text: 'Visitors / day', color: '#64748b' } },
        },
        interaction: { mode: 'index', intersect: false },
      },
    });
  }

  fromInput.addEventListener('change', render);
  toInput.addEventListener('change', render);
  render();
})();

// GSC tile
(function renderGsc() {
  const g = D.gsc;
  const statusEl = document.getElementById('gsc-status');
  if (!g) {
    statusEl.innerHTML = 'GSC not configured. Run <code class="mono">python3 tools/gsc-oauth/login.py</code> then rebuild.';
    return;
  }
  if (g.error) {
    statusEl.innerHTML = `<span style="color:#ef4444">GSC fetch failed:</span> ${g.error}. Re-auth via <code class="mono">python3 tools/gsc-oauth/login.py</code>.`;
    return;
  }
  const t = g.totals || {};
  document.getElementById('gsc-clicks').textContent = fmt(t.clicks || 0);
  document.getElementById('gsc-impressions').textContent = fmt(t.impressions || 0);
  document.getElementById('gsc-ctr').textContent = (t.ctr || 0) + '%';
  document.getElementById('gsc-position').textContent = (t.position || 0).toFixed(1);
  const props = (g.properties || []).join(', ');
  statusEl.textContent = `${props} · ${g.window_start} → ${g.window_end}`;
  const qBody = document.getElementById('gsc-queries');
  qBody.innerHTML = (g.top_queries || []).map(q => `
    <tr><td class="mono" style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${q.q}</td>
        <td class="num">${fmt(q.clicks)}</td>
        <td class="num">${fmt(q.impressions)}</td>
        <td class="num">${(q.ctr || 0)}%</td>
        <td class="num">${(q.position || 0).toFixed(1)}</td></tr>
  `).join('') || '<tr><td colspan="5" style="color:#64748b">No queries with impressions yet.</td></tr>';
  const pBody = document.getElementById('gsc-pages');
  pBody.innerHTML = (g.top_pages || []).map(p => {
    const path = (p.p || '').replace(/^https?:\/\/[^/]+/, '');
    return `<tr><td class="mono" style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${path || '/'}</td>
        <td class="num">${fmt(p.clicks)}</td>
        <td class="num">${fmt(p.impressions)}</td>
        <td class="num">${(p.ctr || 0)}%</td></tr>`;
  }).join('') || '<tr><td colspan="4" style="color:#64748b">No pages with impressions yet.</td></tr>';
})();

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
