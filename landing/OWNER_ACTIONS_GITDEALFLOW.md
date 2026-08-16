# OWNER ACTIONS, gitdealflow.com Traffic Maximization

> Prepared by Hermes Agent, 2026-07-23. These actions require owner credentials, execute each at your own pace. When done, the site will have full search-engine and directory coverage.

---

## 1. Google Search Console, Add Property

**Recommended: Domain property via DNS TXT**

1. Go to https://search.google.com/search-console/
2. Click "Add property" → choose "Domain"
3. Enter: `gitdealflow.com`
4. Copy the TXT verification record shown by Google
5. Add the TXT record to your DNS provider (Cloudflare or wherever gitdealflow.com DNS is managed)
6. Wait 5-10 minutes, then click "Verify" in GSC

**Alternative: URL-prefix via HTML file**

1. In GSC, choose "URL prefix" instead of Domain
2. Enter: `https://gitdealflow.com`
3. Download the HTML verification file from GSC
4. Place it in `~/signals-gitdealflow/landing/` and redeploy: `cd ~/signals-gitdealflow/landing && vercel deploy --prod`

**After verification, submit sitemaps:**

```
https://gitdealflow.com/sitemap.xml
https://gitdealflow.com/sitemap-pages.xml
https://gitdealflow.com/sitemap-pseo.xml
https://gitdealflow.com/sitemap-momentum.xml
https://gitdealflow.com/sitemap-index.xml
```

---

## 2. Bing Webmaster Tools, Import from GSC

1. Go to https://www.bing.com/webmasters/
2. Sign in with the same Google account used for GSC
3. Click "Import from Google Search Console"
4. Select `gitdealflow.com` → Bing auto-imports it
5. Once imported, submit the same sitemap URLs as above

Already configured: Bing API key is set in your environment (`BING_WEBMASTER_API_KEY`). Site verification files are deployed:
- `BingSiteAuth.xml`
- `22df6d8f.txt`, `5a0fdc12.txt`, `f3f5891cbff0b50f.txt` (existing webmaster verification tokens)

---

## 3. Directory Submissions, Draft Listings

### 3.1 G2
- **URL:** https://www.g2.com/products/gitdealflow/reviews
- **Name:** GitDealFlow
- **One-liner:** GitHub engineering-acceleration signals for investors, see which startups are heating up 21-47 days before the round.
- **Description:** GitDealFlow is a deal-flow signal tool for investors (not a fund). It reads public GitHub engineering activity, commit velocity, contributor growth, and repository expansion, across 350+ venture-backed startups in 15 sectors. Every Sunday, subscribers get five named startups with sector, stage, and a plain-English note on why each is moving. The methodology is published on SSRN (DOI 10.2139/ssrn.6606558). Free tier available; paid tiers start at €49/mo.
- **Category:** Investment Intelligence / Alternative Data
- **Pricing:** Free (Sunday Signal Digest), €49/mo (Dashboard), €197/mo (Insider Circle)
- **Support email:** signal@gitdealflow.com

### 3.2 Capterra
- **URL:** https://www.capterra.com/ (search for "GitDealFlow" or submit new listing)
- **Name:** GitDealFlow
- **One-liner:** Pre-fundraise startup detection via public GitHub engineering signals, 21-47 days before the round.
- **Description:** GitDealFlow tracks commit velocity, contributor growth, and repository expansion across 350+ startup GitHub organizations. It flags breakout engineering teams 3-6 weeks before fundraise announcements, delivering five named startups every Sunday with plain-English analysis. Designed for angels, scouts, seed funds, and corporate development teams who want leading indicators, not lagging databases.
- **Category:** Investment Management / Financial Research
- **Pricing:** Free, €49/mo, €197/mo
- **Support email:** signal@gitdealflow.com

### 3.3 AlternativeTo
- **URL:** https://alternativeto.net/software/vc-deal-flow-signal/
- **Name:** GitDealFlow (VC Deal Flow Signal)
- **Tagline:** GitHub momentum tracking for earlier startup deal flow, 21-47 days before the round.
- **Description:** GitDealFlow surfaces venture-backed startups accelerating on GitHub before they appear through traditional sourcing. Tracks 350+ orgs across 15 sectors. Free API, MCP server for Claude/Cursor, and Chrome extension available. SSRN-indexed methodology. Alternatives to: Crunchbase, PitchBook, CB Insights, Dealroom, Tracxn.
- **Category:** Business & Commerce / Data & Analytics
- **Pricing:** Freemium (€49/mo Dashboard, €197/mo Insider)

### 3.4 Product Hunt
- **URL:** https://www.producthunt.com/products/vc-deal-flow-signal
- **Name:** GitDealFlow, GitHub Engineering Acceleration Signals
- **Tagline:** See which startups are heating up 21-47 days before the round, the Velocity Verdict.
- **Description:** GitDealFlow reads public GitHub activity from 350+ startup orgs and flags the ones accelerating before fundraises. Every Sunday, get five names with sector, stage, and a plain-English reason they're moving. Built by The Data Nerd, an engineer and occasional angel who got tired of hearing about great rounds a week too late. Methodology published on SSRN, dataset versioned on Zenodo. Free to start. No code reading required.
- **Topics:** Investing, Developer Tools, Data & Analytics, Venture Capital
- **Pricing:** Free, €49/mo, €197/mo

### 3.5 BetaList
- **URL:** https://betalist.com/ (submit new startup)
- **Name:** GitDealFlow
- **Pitch:** Track startup GitHub momentum before the fundraise. 350+ orgs, 15 sectors, 21-47 days ahead of the round. Free Sunday digest.
- **Description:** GitDealFlow is a deal-flow signal tool that monitors commit velocity, contributor growth, and repository expansion across venture-backed startups' public GitHub activity. It surfaces breakout engineering teams historically 3-6 weeks before fundraise announcements. Designed for angel investors, scouts, seed funds, and corporate development teams, no code reading required.
- **Categories:** Analytics, Finance, Developer Tools
- **Stage:** Launched (paying subscribers since June 2026)

---

## 4. Momentum Index Data-PR

### 4.1 Hacker News, "Show HN" Draft

**Title:** Show HN: GitDealFlow Momentum Index, 40 startup repos ranked by GitHub engineering signals

**Body:**

I built a weekly momentum ranking of 40 notable startup and dev-tool GitHub repositories, scored from real public engineering-activity signals, not social buzz or funding announcements.

The Momentum Score (0-100) blends three transparent signals:
- **Traction** (star count, log-scaled)
- **Recency** (days since last push)
- **Velocity** (week-over-week star growth)

This is a companion to GitDealFlow's main product, a deal-flow signal tool that tracks commit velocity, contributor growth, and repository expansion across 350+ startup orgs. The core finding (published on SSRN: https://ssrn.com/abstract=6606558) is that GitHub engineering acceleration historically precedes fundraise announcements by 3-6 weeks.

The index is:
- Free, no login
- Updated weekly (last: 2026-07-21)
- CC BY 4.0, full dataset at /data/momentum-index/data.json
- Every score is reproducible from public GitHub API data

Live at: https://gitdealflow.com/data/momentum-index

I'd love feedback on the scoring formula, especially whether the weight distribution (40% traction / 35% recency / 25% velocity) feels right.

### 4.2 HuggingFace Dataset Card Draft

**Account:** the-data-nerd
**Dataset name:** vc-deal-flow-signal-momentum-index

```yaml
---
license: cc-by-4.0
task_categories:
  - time-series
  - tabular-classification
language:
  - en
tags:
  - venture-capital
  - github
  - startups
  - engineering-metrics
  - momentum
pretty_name: GitHub Startup Momentum Index
size_categories:
  - n<1K
---

# GitHub Startup Momentum Index

Weekly momentum ranking of 40 notable startup and developer-tool
GitHub repositories, scored from public engineering-activity signals.

## Dataset Description

The Momentum Score (0-100) blends three transparent, public signals:
- **Traction**, star count, log-scaled
- **Recency**, days since last push
- **Velocity**, week-over-week star growth

Score = round(0.40·traction + 0.35·recency + 0.25·velocity)

Data source: GitHub public REST API. Updated weekly.

## Usage

```python
import json
with open("data.json") as f:
    data = json.load(f)
# data["rankings"] → list of {repo, score, stars, ...}
```

## Citation

```
VC Deal Flow Signal (gitdealflow.com), Momentum Index, 2026-07-21.
License: CC BY 4.0
```

## Source

- Live index: https://gitdealflow.com/data/momentum-index
- Raw data: https://gitdealflow.com/data/momentum-index/data.json
- Methodology: https://ssrn.com/abstract=6606558
```

---

## Deployment Completed By Hermes

The following changes were deployed to gitdealflow.com on 2026-07-23:

| Change | Detail |
|--------|--------|
| Review/Rating schema removed | 3 fake Review + 3 Rating objects deleted from JSON-LD |
| Footer crosslink added | "Research & startup signals → signals.gitdealflow.com" |
| llms-full.txt updated | 11 pages (homepage + top 10), verbatim text |
| IndexNow key deployed | `22f462164f53aacbb1d0b771d018bcf1.txt` |
| IndexNow ping script | `scripts/indexnow-ping.sh` |
| Sitemap lastmod removed | All 3 sitemaps cleaned of identical lastmod dates |
| TL;DR block | `<section id="tldr">` with 2-sentence extractable summary |

---

## Post-Deploy Verification

After owner deploys, verify these gates:

```bash
# Site health
curl -s -o /dev/null -w "%{http_code}\n" https://gitdealflow.com/
# → must be 200

# No fake reviews
curl -s https://gitdealflow.com/ | grep -c '"@type": "Review"'
# → must be 0

# TL;DR present
curl -s https://gitdealflow.com/ | grep -c 'id="tldr"'
# → must be ≥1

# llms-full.txt serving
curl -s -o /dev/null -w "%{http_code}\n" https://gitdealflow.com/llms-full.txt
# → must be 200

# IndexNow key live
curl -s https://gitdealflow.com/22f462164f53aacbb1d0b771d018bcf1.txt
# → must return the key string

# Run IndexNow ping
bash scripts/indexnow-ping.sh
# → expected 200 or 202
```

---

## 2026-08-13, PostHog analytics fix built & verified, ALIAS NEEDS YOUR CALL

**Status: production untouched. gitdealflow.com still serves the previous
deployment. Analytics on /, /de and /es are still dark.**

### What changed

Commit `3d23d39b` on the growth-loop worktree
`20260813T040004Z-posthog-snippet-syntax-error`. Three files, one character each:

    e.__SV=!0}(document,...)   →   e.__SV=!0)}(document,...)

in `landing/index.html`, `landing/de/index.html`, `landing/es/index.html`.

The missing `)` made the entire inline PostHog `<script>` in `<head>` a
SyntaxError, so `posthog.init()` never ran and `window.posthog` stayed undefined.
Every call site is guarded by `if (window.posthog)`, so all tracking silently
no-opped, while the page still contained the string "posthog", which is why
curl/grep health checks kept passing. **/, /de and /es have been recording zero
analytics.** The other 259 pages use an older snippet that parses fine and were
not touched.

Verified in real Chrome (Playwright, production CSP replayed, ingest intercepted
so no test events hit the live project): before, `posthog.__loaded` false,
`distinct_id` null, no ingest, uncaught SyntaxError; after, loaded true, real
distinct_id, POST to `eu.i.posthog.com/e/`, zero uncaught errors, zero CSP
violations, on all three pages.

### Built and waiting, unaliased

    https://landing-35txhsd2w-sipiteno.vercel.app     (dpl_8tBHcWh47CuJMnw8CmXFZH4ACxd4)

Built from the commit (not a working tree), JSON-LD gate passed on all 774 files,
serves committed bytes verbatim, and carries the fix.

### Why I did not alias it

A full 773-page sweep of the candidate against live found **759 identical, 14
different, 0 non-200**. Three are the intended fix (verified: the diff on /, /de,
/es is exactly the one added `)`, nothing else). The remaining **11 are
pre-existing repo/prod drift that has nothing to do with this fix**, and it goes
both ways, aliasing would silently:

| page | effect of aliasing |
|---|---|
| `/about` | strips ~116 live-only lines incl. 3 `<h2>` sections (12356 → 9234 bytes) |
| `/content-calendar` | strips a JSON-LD block (1 → 0) |
| `/glossary/safe-note`, `/seed-round`, `/valuation-cap` | strips live definition / how-it-works / key-points sections (~10.5K → ~8K); titles differ; repo has 4 ld+json vs live 3, so it cuts both ways |
| `/pricing` | strips the "Scout Pass" nav link |
| `/perfect-webinar` | strips 4 live-only lines |
| `/embed` | 2105 → 1226 bytes |
| `/network`, `/de/network`, `/es/network` | pushes ~144/~134 lines of never-deployed repo work live |

The standing rule for this site is: promote only if the sweep shows zero
differing pages beyond the intended change; otherwise leave it unaliased and
escalate. Reconciling those 11 needs real judgment, on `/network` the repo looks
like deliberate committed work, on `/glossary` the live copy is better, and
copying prod back verbatim has previously imported a generator bug that
triple-emits JSON-LD. That is a separate task, not something to decide inside a
3-character analytics fix.

### What I need from you

**Option A, ship analytics now, accept the 11-page collateral** (I do not
recommend it; it reverts live conversion copy):

    vercel alias set landing-35txhsd2w-sipiteno.vercel.app gitdealflow.com --scope sipiteno

**Option B (recommended), reconcile the 11 pages first, then deploy once.**
Decide per page which side wins, commit that into the repo, then redeploy and
re-sweep; the result ships the analytics fix with provably zero collateral.

**Option C, ship only the analytics fix**: reconcile just these 11 pages *to
live* in the repo, so the next deploy differs from production by exactly the
three characters. Fastest path to working analytics without touching content.

Either way, re-verify after aliasing: `gitdealflow.com/` must be 200, and
`curl -s https://gitdealflow.com/ | grep -c 'e.__SV=!0)}(document'` must be 1.
Check again a few minutes later, a concurrent session aliasing an older tree
over the top has silently reverted verified-live fixes on this portfolio before.

Rollback: `vercel ls landing --scope sipiteno --prod`, curl the last-good `/` for
200, then `vercel alias set <last-good> gitdealflow.com --scope sipiteno`.

Full sweep data: `/tmp/sweep_vs_live.tsv` (regenerate with `/tmp/sweep_live.py`).
