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
import time
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
         "stat": "2 followers · 124 posts · 100 following",
         "note": "May 3 burst: 7-tweet IH-leverage thread + 4 ICP reply-jacks (rauchg 199K, lennysan 48K, gregisenberg 39K, ivanburazin 4.5K) + 1 search-SEO own-post",
         "status": "active", "as_of": "2026-05-03"},
        {"name": "Reddit", "handle": "u/Worth_Wealth_6811",
         "url": "https://www.reddit.com/user/Worth_Wealth_6811",
         "stat": "778 karma · 1,147 contribs · 18 followers",
         "note": "Top 5% Poster; 5y account age; user-managed",
         "status": "active", "as_of": "2026-05-02"},
        {"name": "LinkedIn", "handle": "company/gitdealflow",
         "url": "https://www.linkedin.com/company/gitdealflow",
         "stat": "636 impr · 11 comments · 4 reactions · 0 reposts (Apr)",
         "note": "Peak Apr 21: 115 impr/day · 14 clicks · 19 reached; user-managed (anonymity)",
         "status": "active", "as_of": "2026-05-02"},
        {"name": "Product Hunt", "handle": "data_nerd",
         "url": "https://www.producthunt.com/@data_nerd",
         "stat": "1 follower · 0 KP · launch unfeatured Apr 26",
         "note": "Streak restored May 2 (3 day-15 comments); Tier 1 daily 3-in-DevTools/AI; T+6d support follow-up drafted",
         "status": "active", "as_of": "2026-05-02"},
        {"name": "IndieHackers", "handle": "@The_Data_Nerd",
         "url": "https://www.indiehackers.com/The_Data_Nerd",
         "stat": "Product listing live · 30 active threads · depth 3.4 avg",
         "note": "Day 18: 2 new external replies on PH-failure post (txdesk depth 11, Raquel50 depth 9); 3 new drafts pending paste (2 rejoinders + 1 fresh top-level on ReleaseLog 12-day plan)",
         "status": "active", "as_of": "2026-05-03"},
        {"name": "Hacker News", "handle": "the_data_nerd",
         "url": "https://news.ycombinator.com/user?id=the_data_nerd",
         "stat": "karma 25 · 17 submissions · 4 dead comments",
         "note": "BLOCKED 2026-05-02 — 4th dead comment today (47984445); dang email drafted; no more posts until dang confirms unflag OR karma > 50 organically. Show HN take 2 deferred to ~May 16+. Account is auto-flagged.",
         "status": "blocked", "as_of": "2026-05-02"},
        {"name": "Telegram", "handle": "@gitdealflow",
         "url": "https://t.me/gitdealflow",
         "stat": "1 subscriber · public broadcast channel",
         "note": "Free tier; Insider Circle = separate private group; teasers gated until ≥10 subs",
         "status": "active", "as_of": "2026-05-02"},
        {"name": "Discord", "handle": "the_data_nerd",
         "url": "",
         "stat": "5 servers joined · last post Apr 25 · 1 🔥 / 0 comments",
         "note": "RETIRED 2026-05-02 — embedding plan never executed past Day 1; phone-verify gates Glama/Windsurf; reactive-only on Cursor #mcp going forward",
         "status": "retired", "as_of": "2026-05-02"},
    ],
    "content": [
        {"name": "Company Blog", "handle": "signals.gitdealflow.com/blog",
         "url": "https://signals.gitdealflow.com/blog",
         "stat": "34 posts live · 30 SSRN-cited research sub-pages",
         "note": "Canonical URL for all cross-posts; latest: Weekly Signal Report Q2 2026 (May 2)",
         "status": "active", "as_of": "2026-05-02"},
        {"name": "Medium", "handle": "@signal_41476",
         "url": "https://medium.com/@signal_41476",
         "stat": "6 posts · 0 followers · 60 impr · 4 views · 1 read (lifetime) · 0 referrals",
         "note": "RETIRED 2026-05-02. Auto-publisher disabled. Publication-pivot rejected after live verification of all three Ali Mese sister pubs: Start it up rejects already-published+pivoted away from data/VC; Curious rejects money/finance+work topics; Geek Culture wants pure tech (investor frame is wrong-side-of-table). 6 published posts stay as passive SEO/AI-retrieval surface (canonicals point at gitdealflow). Full audit trail in distribution/medium-autopublish/the-startup-submission-package.md. Resume only if (a) we hire creator-economy ghostwriter, (b) we rewrite content to drop investor angle for Geek Culture, or (c) we launch our own Medium publication.",
         "status": "retired", "as_of": "2026-05-02"},
        {"name": "Substack", "handle": "@thedatanerd2026",
         "url": "https://substack.com/@thedatanerd2026",
         "stat": "17 Notes posted · 19 draft-ready (frozen) · 1 follower · 0 subs · 0 likes/restacks/replies · 0 PostHog referrals",
         "note": "NOTES RUNNER DISABLED 2026-05-02 (Russell+Greg self-audit kill #3: 17 Notes → 0 referrals, channel paid no rent). 19 draft-ready entries frozen in queue. NEWSLETTER MIRROR test still live (passive RSS from signals.gitdealflow.com/blog, free-only, canonical → apex) — 60-day window 2026-04-28 → 2026-06-27 with checkpoints May 4 / May 25 / Jun 27 (binary keep/modify/kill decision). USER ACTION pending: 30-min publication setup per distribution/substack-autopublish/SETUP-PUBLICATION-RUNBOOK.md (autonomous setup blocked by Steel free-tier silent magic-link drop). Cover image at distribution/substack-cover-1500x500.png awaits manual upload.",
         "status": "audit-killed", "as_of": "2026-05-02"},
        {"name": "HackerNoon", "handle": "@TheData_7cdit42c",
         "url": "https://hackernoon.com/can-github-activity-predict-the-next-startup-fundraise",
         "stat": "1 published (Apr 27, 171 reads/5 reacts) · 1 in editorial (May 2) · 0 PostHog referrals",
         "note": "Submission #1 rejected (Apr 19). Submission #2 published Apr 27 (HN claims own canonical → brand-citation only, 0 referrals in 5d). Submission #3 'Which Five GitHub Patterns Show Up Before a Startup Fundraise?' submitted autonomously May 2 11:40 EEST via Chrome MCP, canonical /blog/5-github-patterns-that-predict-fundraises, green 'submitted' badge confirmed. Strategy: keep posting 1/wk, do NOT amplify HN posts, do NOT chase referrals. Kill switch: if 30-day total at 2026-05-27 still shows 0 PostHog referrals AND no AI-engine citations, drop to monthly cadence.",
         "status": "active", "as_of": "2026-05-02"},
        {"name": "dev.to", "handle": "data_nerd",
         "url": "https://dev.to/data_nerd",
         "stat": "3 articles · 47 views · 2 reactions · 1 comment · 0 followers (lifetime)",
         "note": "AUTOPILOT-LITE: weekly Mon 11:30 EEST anchor via devto-weekly-anchor cron + Forem API (zero-effort, canonical→apex). 7 drafts ready through Jun 1, 7 pending titles through Jul 20. Dream 10 daily comments DEAD since Apr 24 (Comet auth fails in unattended cron). 90-day kill switch: if <500 lifetime views AND <5 apex referrals by 2026-08-02, retire publisher. Frame as SEO/backlink play, not direct-traffic channel.",
         "status": "active", "as_of": "2026-05-02"},
        {"name": "Hashnode", "handle": "gitdealflow.hashnode.dev",
         "url": "https://gitdealflow.hashnode.dev",
         "stat": "4 posts · 0 followers · 6 views · 4 responses · 0 PostHog referrals",
         "note": "RETIRED 2026-05-02 — auto-mirror killed (tools/devto/publish-next.mjs:104-107) after 14 days w/ 0 follower growth, 0 apex referrals; same self-audit kill as Discord. 4 existing posts (Apr 18 → Apr 28) remain as apex-canonical backlinks; toolkit (follow-tags / dream10-find / launchd plist) preserved but dormant, re-arm gated on organic follower signal. Newest: PH-failure post auto-mirrored Apr 28.",
         "status": "retired", "as_of": "2026-05-02"},
        {"name": "Quora", "handle": "The Data Nerd",
         "url": "https://www.quora.com/profile/The-Data-Nerd",
         "stat": "14 answers posted (Q1-Q14) · Q15 never shipped · 0 PostHog referrals",
         "note": "RETIRED 2026-05-02 — Russell+Greg self-audit kill #2: 14/15 answers → 0 referrals over 6d posting window (Apr 19-25). Root cause: account-age sandbox + 8 self-created ghost questions (Q5-Q8, Q10, Q11-Q14) never Google-indexed; only Q1-Q4 + Q9 sit on real existing questions. Credential + 10 Spaces fixes applied 2026-04-25, no lift. quora-daily-runner cron disabled. Re-arm trigger: 1 answer hits Google page-1 for a real query OR explicit user OK. 60-day mute through 2026-07-01.",
         "status": "retired", "as_of": "2026-05-02"},
    ],
    "directories": [
        {"name": "Crunchbase", "category": "Business", "status": "live",
         "as_of": "2026-05-02",
         "url": "https://www.crunchbase.com/organization/gitdealflow",
         "note": "Tier B passive co-citation (verified via Wikidata P2088 claim 2026-05-02); 5 profile edits applied 2026-04-25; 0 PostHog referrals lifetime; HTTP 403 to crawlers (Cloudflare)"},
        {"name": "G2", "category": "Software", "status": "live",
         "as_of": "2026-05-02", "url": "",
         "note": "Tier B; footer badge + JSON-LD shipped 2026-04-25; bot-walled to crawlers; 0 referrals; category assignment still pending"},
        {"name": "SaaSHub", "category": "Software", "status": "live",
         "as_of": "2026-05-02", "url": "",
         "note": "Tier B passive; HTTP 404 on slug probes 2026-05-02 (listing may have been rejected); 0 referrals; manual re-check needed"},
        {"name": "IH Products", "category": "Startup", "status": "live",
         "as_of": "2026-05-02",
         "url": "https://www.indiehackers.com/product/vc-deal-flow-signal",
         "note": "Tier C dead — HTTP 301→200 verified 2026-05-02; nofollow links + IH redesign killed Products visibility; brand-only"},
        {"name": "Wikidata", "category": "Knowledge graph", "status": "live",
         "as_of": "2026-05-02",
         "url": "https://www.wikidata.org/wiki/Q139376302",
         "note": "Tier B knowledge-graph; HTTP 200 verified 2026-05-02; 21 P-claims incl. P2088 (Crunchbase) + P973 backlinks; 27 entity views/30d"},
        {"name": "StackShare", "category": "Tech stack", "status": "live",
         "as_of": "2026-05-02",
         "url": "https://stackshare.io/vc-deal-flow-signal-spot-breakout-startups-before-anyone-else",
         "note": "Tier C audience-mismatch (devs ≠ VCs); HTTP 429 rate-limited on probe 2026-05-02; 0 referrals"},
        {"name": "FutureTools", "category": "AI", "status": "silent-reject",
         "as_of": "2026-05-02", "url": "",
         "note": "Tier C — silent-rejected since 2026-04-25 audit; manual editorial gate rejects B2B-VC focus; 0 referrals; ship-and-forget"},
        {"name": "AItoolslist.io", "category": "AI", "status": "ghost-site",
         "as_of": "2026-05-02", "url": "",
         "note": "Tier C — abandoned WordPress directory dead since Jul 2023; confirmed unchanged 2026-05-02; 0 referrals"},
        {"name": "StartupRanking", "category": "Startup", "status": "queued",
         "as_of": "2026-05-02", "url": "",
         "note": "Tier C — 80-day free queue, submitted 2026-04-19; ~67d remaining; 0 referrals expected"},
        {"name": "SideProjectors", "category": "Indie", "status": "pending-review",
         "as_of": "2026-05-02",
         "url": "https://www.sideprojectors.com/project/78284",
         "note": "Tier C — 14d no movement in mod queue (submitted 2026-04-18); HTTP 301→200 verified 2026-05-02; audience = side-project buyers"},
        {"name": "AlternativeTo", "category": "Software", "status": "live",
         "as_of": "2026-05-02", "url": "",
         "note": "Tier A — 2 visitors lifetime (PostHog 2026-04-24); HTTP 403 (Cloudflare blocks bot crawl); only software-comparison directory driving traffic"},
        {"name": "VentureRadar", "category": "Startup", "status": "queued",
         "as_of": "2026-05-02", "url": "",
         "note": "Tier C — 21d review queue (submitted 2026-04-19); T+13d 2026-05-02 ~8d remaining; HQ Cyprus"},
        {"name": "10words", "category": "SaaS", "status": "queued",
         "as_of": "2026-05-02", "url": "",
         "note": "Tier C — 1,866-day queue (~5y); submitted 2026-04-19; effectively dead, ship-and-forget"},
        {"name": "OpenVC", "category": "VC", "status": "signed-up",
         "as_of": "2026-05-02", "url": "",
         "note": "Tier E — NOT a directory; private deck-submission tool; signed up 2026-04-19; activate on fundraise event"},
        {"name": "Dealroom for Builders", "category": "VC", "status": "no-reply",
         "as_of": "2026-05-02", "url": "",
         "note": "Tier D — applied 2026-04-19 (5-biz-day promised); T+9BD 2026-05-02 no reply; ship-and-forget"},
        {"name": "CB Insights", "category": "VC", "status": "applied",
         "as_of": "2026-05-02", "url": "",
         "note": "Tier D — trial-signup lead-gen, applied 2026-04-19; no public form, no proactive contact expected; 0 referrals"},
        {"name": "FinTech Report", "category": "Award", "status": "submitted",
         "as_of": "2026-05-02", "url": "",
         "note": "Tier D — WealthTech nomination submitted 2026-04-19; editorial-only; T+13d no contact"},
        {"name": "Letterlist", "category": "Newsletter", "status": "abandoned",
         "as_of": "2026-05-02", "url": "",
         "note": "Tier C — directory abandoned by operator (RSS feed last update Jun 2023); confirmed unchanged 2026-05-02; no listing pipeline"},
        {"name": "InboxReads", "category": "Newsletter", "status": "live",
         "as_of": "2026-05-02",
         "url": "https://inboxreads.co",
         "note": "Tier A — 4 visitors lifetime (PostHog 2026-04-20→04-25); HTTP 200 verified 2026-05-02; only newsletter directory driving traffic"},
        {"name": "daily.dev", "category": "Dev", "status": "deferred",
         "as_of": "2026-05-02", "url": "",
         "note": "Post-launch deferral; one Squad submission planned ~May 3+; held 14d since 2026-04-19"},
    ],
    "dev_search": [
        {"name": "npm — mcp-signal", "stat": "@gitdealflow/mcp-signal v1.5.2",
         "status": "live", "as_of": "2026-05-02",
         "url": "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
         "note": "Verified 2026-05-02 npm registry"},
        {"name": "Glama MCP", "stat": "kindrat86/mcp-deal-flow-signal",
         "status": "live", "as_of": "2026-05-02",
         "url": "https://glama.ai/mcp/servers/kindrat86/mcp-deal-flow-signal",
         "note": "HTTP 200 verified 2026-05-02; A-tier (5 tools)"},
        {"name": "MCP Registry", "stat": "io.github.kindrat86/vc-deal-flow-signal v1.5.2 (6 versions)",
         "status": "live", "as_of": "2026-05-02",
         "url": "https://registry.modelcontextprotocol.io/v0/servers?search=vc-deal-flow",
         "note": "Verified 2026-05-02 via search API; JWT re-auth ~every 8d for new publishes"},
        {"name": "awesome-mcp-servers", "stat": "PR #4933 merged 2026-04-23",
         "status": "live", "as_of": "2026-05-02",
         "url": "https://github.com/punkpeye/awesome-mcp-servers/pull/4933",
         "note": "Verified 2026-05-02 in main README as kindrat86/mcp-deal-flow-signal w/ Glama score badge"},
        {"name": "Chrome Web Store", "stat": "Extension live (id hehkgipi…oogmknn)",
         "status": "live", "as_of": "2026-05-02",
         "url": "https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn",
         "note": "HTTP 302 verified 2026-05-02; badges on Crunchbase/AngelList/PitchBook"},
        {"name": "awesome-quant", "stat": "PR #360 merged",
         "status": "live", "as_of": "2026-05-02",
         "url": "https://github.com/wilsonfreitas/awesome-quant",
         "note": "Verified 2026-05-02 in master README; Tier 5 link building"},
        {"name": "awesome-public-datasets", "stat": "apd-core PR #396 (Finance)",
         "status": "pending", "as_of": "2026-05-03",
         "url": "https://github.com/awesomedata/apd-core/pull/396",
         "note": "VC-Deal-Flow-Signal.yml under core/Finance; validation passes; awesomedata maintainer review pending. After merge, verify entry survives autogen in awesome-public-datasets/README.rst (silent-drop rule)."},
        {"name": "Wolfram Data Repository", "stat": "Submission package staged (CC BY 4.0)",
         "status": "pending", "as_of": "2026-05-03",
         "url": "",
         "note": "submit.wl + metadata.json + runbook at distribution/dataset/wolfram/. Blocked on user Wolfram ID + Publisher ID + interactive ResourceSubmit (no wolframscript on machine; account creation prohibited)."},
        {"name": "Kaggle / Data.world / Zenodo", "stat": "Dataset mirrors (Zenodo DOI 10.5281/zenodo.19650920)",
         "status": "live", "as_of": "2026-05-02",
         "url": "https://zenodo.org/records/19650920",
         "note": "Kaggle 200 + Zenodo 200 verified 2026-05-02; Data.world per Wikipedia article draft"},
        {"name": "SSRN", "stat": "abstract=6606558 approved + 6/8 indexed",
         "status": "live", "as_of": "2026-05-02",
         "url": "https://ssrn.com/abstract=6606558",
         "note": "HTTP 301→canonical verified 2026-05-02; Crossref/SemScholar/OpenAlex/Unpaywall/DataCite/Zenodo indexed"},
        {"name": "arXiv", "stat": "Endorsement pending (blocked since 2026-04-25)",
         "status": "blocked", "as_of": "2026-05-02",
         "url": "", "note": "Dalle OOO 2026-04-25 → no reply; Zhu fallback rearm 2026-05-04 (T+5BD); 7d in blocked state"},
        {"name": "Papers With Code", "stat": "Pending submission · SSRN-unblocked",
         "status": "queued", "as_of": "2026-05-02",
         "url": "https://paperswithcode.com/submit",
         "note": "Was blocked on SSRN approval; now cleared (DOI 10.2139/ssrn.6606558 live since 2026-04-25). Prep: distribution/research-paper/papers-with-code-submission.md. PwC review: 3-7d after submit"},
        {"name": "Google Search Console", "stat": "OAuth dashboard live (hourly tile)",
         "status": "live", "as_of": "2026-05-02",
         "url": "https://search.google.com/search-console",
         "note": "Hourly tile pulls clicks/impr/queries; baseline 1 click / 43 imp / pos 2.8 (since 2026-04-26)"},
        {"name": "Bing / IndexNow", "stat": "1080 URLs submitted",
         "status": "live", "as_of": "2026-05-02",
         "url": "", "note": "SEO chain expansion 2026-05-02; propagates to Yandex + Seznam"},
        {"name": "Yandex Webmaster", "stat": "Apex clean · signals 7 'low-value' pages",
         "status": "live", "as_of": "2026-05-02",
         "url": "https://webmaster.yandex.com",
         "note": "T+14d recheck 2026-05-02: apex 'no errors'; signals subdomain has 1 favicon-SVG warn + /feed.xml fetch fail + 7 'low-value classifier' pages (need backlink graph + internal links)"},
        {"name": "Brave Search", "stat": "Indexed · 4 results for site:gitdealflow.com",
         "status": "live", "as_of": "2026-05-02",
         "url": "https://search.brave.com/search?q=site%3Agitdealflow.com",
         "note": "Verified 2026-05-02 via site: query (apex + signals subdomain pages)"},
        {"name": "llms.txt registry", "stat": "Finance category (14d in queue)",
         "status": "submitted", "as_of": "2026-05-02",
         "url": "https://directory.llmstxt.cloud",
         "note": "Submitted 2026-04-18; re-verified 2026-05-02 not yet listed; ship-and-forget"},
        {"name": "Perplexity Publishers", "stat": "Intake form submitted (14d wait)",
         "status": "applied", "as_of": "2026-05-02",
         "url": "https://www.perplexity.ai/hub/legal/publishers-program",
         "note": "Submitted 2026-04-18; follow-up window 2026-05-09 (T+7d); no proactive reply as of 2026-05-02"},
        {"name": "OAuth 2.1 endpoint", "stat": "client_credentials, RFC 8414",
         "status": "live", "as_of": "2026-05-02",
         "url": "https://signals.gitdealflow.com/.well-known/oauth-authorization-server",
         "note": "Bearer wired into /api/mcp/rpc; anonymous backward-compat preserved"},
        {"name": "Poe SSE adapter", "stat": "Server Bot v1 protocol",
         "status": "live", "as_of": "2026-05-02",
         "url": "https://signals.gitdealflow.com/api/poe",
         "note": "User must sign up at creator.poe.com to publish"},
        {"name": "MCP server-card", "stat": "/.well-known/mcp/server-card.json",
         "status": "live", "as_of": "2026-05-02",
         "url": "https://signals.gitdealflow.com/.well-known/mcp/server-card.json",
         "note": "Universal metadata for Smithery + future catalog scanners"},
        {"name": "AGENTS.md", "stat": "/agents.md",
         "status": "live", "as_of": "2026-05-02",
         "url": "https://signals.gitdealflow.com/agents.md", "note": "HTTP 200 verified"},
        {"name": "ai.txt", "stat": "/ai.txt",
         "status": "live", "as_of": "2026-05-02",
         "url": "https://signals.gitdealflow.com/ai.txt", "note": "HTTP 200 verified"},
        {"name": "llms.txt", "stat": "/llms.txt",
         "status": "live", "as_of": "2026-05-02",
         "url": "https://signals.gitdealflow.com/llms.txt", "note": "HTTP 200 verified"},
        {"name": "Q&A JSONL", "stat": "/qa.jsonl (30 SSRN-cited)",
         "status": "live", "as_of": "2026-05-02",
         "url": "https://signals.gitdealflow.com/qa.jsonl", "note": "HTTP 200; ?category= filter API"},
        {"name": "Cline MCP Marketplace", "stat": "Issue #1491 OPEN",
         "status": "in-review", "as_of": "2026-05-02",
         "url": "https://github.com/cline/mcp-marketplace/issues/1491",
         "note": "Submitted 2026-05-02; ~1-3d review (watcher polling 2x/day)"},
        {"name": "mcp.so directory", "stat": "Issue #2201 OPEN",
         "status": "in-review", "as_of": "2026-05-02",
         "url": "https://github.com/chatmcp/mcpso/issues/2201",
         "note": "20k+ servers in directory; ~1-3d review"},
        {"name": "Block Goose extensions", "stat": "PR #8974 OPEN (mergeable)",
         "status": "in-review", "as_of": "2026-05-03",
         "url": "https://github.com/aaif-goose/goose/pull/8974",
         "note": "Submitted 2026-05-03; appends to documentation/static/servers.json (60→61). Goose has 43.7k stars."},
        {"name": "Raycast MCP Registry", "stat": "PR #27618 OPEN (greptile-bot reviewed)",
         "status": "in-review", "as_of": "2026-05-03",
         "url": "https://github.com/raycast/extensions/pull/27618",
         "note": "Submitted 2026-05-03; appends to extensions/model-context-protocol-registry/.../entries.ts. Surfaces in MCP Registry browser on every Mac running Raycast v1.98+."},
        {"name": "CrewAI Tools", "stat": "PR #5682 OPEN",
         "status": "in-review", "as_of": "2026-05-02",
         "url": "https://github.com/crewAIInc/crewAI/pull/5682",
         "note": "Submitted 2026-05-02; awaiting maintainer review"},
        {"name": "Anthropic Connectors Directory", "stat": "Submission package ready",
         "status": "user-action", "as_of": "2026-05-02",
         "url": "https://claude.com/docs/connectors/building/submission",
         "note": "OAuth + manifest deployed; user 5-min form submit pending"},
        {"name": "Anthropic Desktop Extensions", "stat": "Google Form submitted",
         "status": "submitted", "as_of": "2026-05-02",
         "url": "", "note": "Submitted 2026-05-02 ~12:00 EEST; anthropic-extension-watcher monitoring"},
        {"name": "HuggingChat MCP", "stat": "Custom Server (personal config)",
         "status": "live", "as_of": "2026-05-02",
         "url": "https://huggingface.co/chat/conversation/69f5a4dbe8a1d19b3daba541",
         "note": "Personal config only — public Base Servers list is partnership-only"},
        {"name": "HF Space — DeepSeek demo", "stat": "Scaffolded local",
         "status": "user-action", "as_of": "2026-05-02",
         "url": "", "note": "distribution/hf-space-deepseek/; user HF write token + push pending"},
        {"name": "Anthropic Cookbook PR", "stat": "Scheduled 2026-05-04",
         "status": "scheduled", "as_of": "2026-05-02",
         "url": "", "note": "Task framework-pr-anthropic-cookbook"},
        {"name": "LlamaHub Tool PR", "stat": "Scheduled 2026-05-06",
         "status": "scheduled", "as_of": "2026-05-02",
         "url": "", "note": "Task framework-pr-llamahub-tool"},
        {"name": "Vercel AI SDK PR", "stat": "Scheduled 2026-05-08",
         "status": "scheduled", "as_of": "2026-05-02",
         "url": "", "note": "Task framework-pr-vercel-ai-sdk"},
        {"name": "n8n community node", "stat": "n8n-nodes-gitdealflow@0.1.0",
         "status": "live", "as_of": "2026-05-03",
         "url": "https://www.npmjs.com/package/n8n-nodes-gitdealflow",
         "note": "Published to npm 2026-05-03; auto-indexed at n8n.io/integrations within 24h. 5 ops: getTrending / searchBySector / findStartup / getSignals / getSummary. No auth, weekly refresh."},
        {"name": "Zapier", "stat": "App 240628 v1.0.3 (private)",
         "status": "user-action", "as_of": "2026-05-03",
         "url": "https://developer.zapier.com/app/240628/version/1.0.3/dashboard",
         "note": "Schema 43/43 passed; 2 triggers + 2 searches; needs 3 users w/ live Zaps before Public review eligible (S001/S002 publishing tasks). User invites testers + clicks Promote in dev portal."},
        {"name": "Pipedream", "stat": "PR #20774 OPEN",
         "status": "in-review", "as_of": "2026-05-03",
         "url": "https://github.com/PipedreamHQ/pipedream/pull/20774",
         "note": "4 actions + 2 sources for @pipedream/gitdealflow opened against PipedreamHQ/pipedream:master via fork kindrat86/pipedream branch add-gitdealflow. Awaiting maintainer review (Pipedream review SLA ~3-7d)."},
        {"name": "Make.com", "stat": "Custom App spec staged",
         "status": "user-action", "as_of": "2026-05-03",
         "url": "https://www.make.com/en/help/apps/about-the-development-of-custom-apps",
         "note": "4 modules at make-app/ (3 search + 1 polling trigger); Make has no CLI/API for app creation, user pastes IML JSON in dev portal."},
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


def http(url, method="GET", data=None, headers=None, retries=3):
    headers = dict(headers or {})
    headers.setdefault("User-Agent", "gitdealflow-dashboard/1.0")
    body = None
    if data is not None:
        body = json.dumps(data).encode()
        headers.setdefault("Content-Type", "application/json")
    last_err = None
    for attempt in range(retries):
        req = urllib.request.Request(url, data=body, headers=headers, method=method)
        try:
            with urllib.request.urlopen(req, timeout=30) as resp:
                return json.load(resp)
        except urllib.error.HTTPError as e:
            # 4xx is client error — don't retry. 5xx is worth a retry.
            msg = e.read().decode()[:160]
            if e.code < 500 or attempt == retries - 1:
                print(f"WARN: HTTP {e.code} {url}: {msg}", file=sys.stderr)
                return None
            last_err = f"HTTP {e.code}: {msg}"
        except Exception as e:
            last_err = str(e)
            if attempt == retries - 1:
                print(f"WARN: {url}: {e}", file=sys.stderr)
                return None
        time.sleep(2 ** attempt)  # 1s, 2s, 4s
    print(f"WARN: {url}: {last_err} (after {retries} attempts)", file=sys.stderr)
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

# Filter testers + bots out of subscribers + email_log (by subscriber relation).
excluded_ids = {s["id"] for s in subscribers if (s.get("email") or "").lower() in EXCLUDED_EMAILS}
subscribers = [s for s in subscribers if (s.get("email") or "").lower() not in EXCLUDED_EMAILS]
email_log = [e for e in email_log if e.get("subscriber") not in excluded_ids]
print(f"  subscribers: {len(subscribers)} (excluded {raw_sub_count - len(subscribers)} testers/bots)"
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

// ---- Marketing & distribution channels ----
const CH = D.channels || {social:[], content:[], directories:[], dev_search:[]};
const allCh = [...CH.social, ...CH.content, ...CH.directories, ...CH.dev_search];
const liveStatuses = new Set(['live','active']);
const pendingStatuses = new Set(['submitted','pending-review','applied','pending-merge','in-review','user-action']);
const prelaunchStatuses = new Set(['pre-launch','queued','signed-up','deferred','scheduled']);
const deadStatuses = new Set(['retired','audit-killed','abandoned','ghost-site','silent-reject','blocked','no-reply']);

document.getElementById('ch-total').textContent = fmt(allCh.length);
document.getElementById('ch-live').textContent = fmt(allCh.filter(c => liveStatuses.has(c.status)).length);
document.getElementById('ch-pending').textContent = fmt(allCh.filter(c => pendingStatuses.has(c.status)).length);
document.getElementById('ch-prelaunch').textContent = fmt(allCh.filter(c => prelaunchStatuses.has(c.status)).length);

const pillClass = s => {
  if (liveStatuses.has(s)) return 'above';
  if (pendingStatuses.has(s)) return 'on-track';
  if (prelaunchStatuses.has(s)) return 'early';
  if (deadStatuses.has(s)) return 'below';
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
