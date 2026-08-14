# Manual Queue — GitDealFlow

Tasks that require a human hand. Execute once, file the result.

---

## SWITCH 3: Pixel IDs — 10 minutes, human-only

**Why this is here:** The agent CANNOT create Meta Pixel IDs or LinkedIn Partner IDs. These require human ad account logins.

### Step 1: Create a Meta Pixel (5 minutes)
1. Go to https://business.facebook.com/events_manager2
2. Click "Connect Data Sources" → "Web" → "Meta Pixel"
3. Name it "GitDealFlow"
4. Copy the numeric Pixel ID (e.g., `1234567890123456`)
5. In `landing/index.html`, find: `META_PIXEL_ID_REPLACE` → replace with your Pixel ID
6. Also find the `fbq('init', 'META_PIXEL_ID_REPLACE')` line and replace

### Step 2: Create LinkedIn Insight Tag (5 minutes)
1. Go to https://www.linkedin.com/campaignmanager/accounts
2. Click "Analyze" → "Insight Tag"
3. Click "Install my Insight Tag"
4. Copy the Partner ID (numeric, e.g., `1234567`)
5. In `landing/index.html`, find: `LINKEDIN_PARTNER_ID_REPLACE` → replace with your Partner ID

### Step 3: Redeploy
```bash
cd /Users/sipi/signals-gitdealflow/landing && vercel --prod --yes
```

---

## SWITCH 5: YouTube Video — 30 minutes, human-only

**Why this is here:** The agent CANNOT record video. Full script at `outreach/youtube-video-script.md` (455 lines).

### Quick Recording Guide (5-minute version)
1. **Open QuickTime Player** (Mac) → File → New Screen Recording
2. **Navigate to** https://signals.gitdealflow.com (dashboard view)
3. **Record this sequence** (5 minutes):
   - 0:00-0:30: Hook — "I tracked GitHub commits across 219 startups..."
   - 0:30-1:00: Show the dashboard, explain what it tracks
   - 1:00-2:30: Show one startup's signal profile (click any startup card)
   - 2:30-3:30: Navigate to methodology page — show the 3.4x finding
   - 3:30-4:30: Navigate to /receipts — demonstrate Scout Score
   - 4:30-5:00: CTA — "Get this Sunday's 5 names free at gitdealflow.com"
4. **Upload to YouTube** as "How to Predict Which Startups Will Raise (GitHub Commit Velocity, n=219)"
5. **Thumbnail**: Use `/data-nerd.png` with text overlay "21-47 DAYS BEFORE THE ROUND"
6. **Description**: Link to gitdealflow.com and ssrn.com/abstract=6606558
7. After upload, edit `/perfect-webinar` page to embed the YouTube video

---

## SWITCH 6: Resend Key Expired — Refresh & Resend

**STATUS 2026-08-14: RESOLVED.** The `agent/.env` key (`re_9aQ…`) was re-tested
and returns HTTP 200 against `/audiences` and `/emails` (live sends confirmed
same day). The "401" this entry warned about is stale. Do NOT rotate the key.

The real blocker that surfaced alongside it was different and is now fixed:
- `email-api/send-weekly-digest.mjs` reads `email-api/.env`, which did NOT
  exist — so the Sunday digest sender errored before it could count or send.
  `email-api/.env` is now written (gitignored) with the working key +
  `RESEND_AUDIENCE_ID=1ddf358e-2416-4481-a0f5-538fd12f6e73`.
- `resolveAudienceId()` in that file used `data[0]` as a fallback, which under
  the multi-product team would have blasted the digest to Hirenika's list.
  It now prefers a name match on "gitdealflow" before falling back to `data[0]`.

Subscriber count is now tracked at `monitoring/subscriber-count.{jsonl,md}`
(baseline: 30 active) and reported weekly via the
`gitdealflow-subscriber-count` cron (Sun 07:00). The digest itself is
regenerated + broadcast via `gitdealflow-sunday-digest` (Sun 16:00, runs
`~/.hermes/scripts/send-signal-digest-cron.sh`).

Only if the key genuinely fails in future (HTTP 401 from
`monitoring/subscriber-count.py`):
1. Go to https://resend.com/api-keys
2. Create new key for gitdealflow.com domain
3. Update BOTH `agent/.env` and `email-api/.env`: `RESEND_API_KEY=re_NEW_KEY`

**Then run podcast sends** — 5 pitches at `outreach/podcast-pitches.json` to:
- Invest Like the Best: patrick@osv.llc
- 20VC: harry@thetwentyminutevc.com
- All-In: allin@allinpodcast.co
- Acquired: acquiredfm@gmail.com
- My First Million: info@mfmpod.com

**And Sifted pitch** at `outreach/sifted-guest-post-pitch.json` → editor@sifted.eu

Or send manually from signals@gitdealflow.com.

---

## SWITCH 7: Content Calendar Week 1 — Social Posts

### Monday — X/Twitter Thread
Post from @data_nerd account. 5 tweets:

1/5: This week's top 3 movers from the engineering acceleration signal (Q3 2026):

2/5: databayt — +573% commit velocity. 74 commits/14d, 8 contributors. Deploy frequency spike. The acceleration pattern that preceded 219 fundraises in our SSRN panel.

3/5: rpgppengine — +520% velocity surge. Gaming startups rarely show this pattern. Major release cycle or platform expansion underway.

4/5: ConduitIO — +421% velocity. Data infra is the hottest sector this quarter. 3 data-infra startups in the top 20.

5/5: These 3 from a free weekly digest. 5 startups, plain English, zero code. gitdealflow.com/#signup

Post Tuesday 14:00 UTC.

### Tuesday — Hacker News Show HN
ALREADY IN THIS FILE (see "Show HN" section above).
Post Tuesday 13:00 UTC from SipitenoMK account.
URL: https://gitdealflow.com/data/momentum-index

### Wednesday — LinkedIn Long-Form
Post from The Data Nerd profile, Wednesday 10:00 UTC.

Title: Why I stopped networking and started reading commit graphs.

For ten years I wrote angel cheques out of Athens. No partner network. No demo-day badge. By the time a deck reached me through any warm intro, three other investors were already in. I told myself it was geography. It was network seniority.

Then in 2024 I watched a small fintech team — three founders, one repo, no press. Two weeks later their engineers were suddenly shipping far more. Commit activity tripled. New contributors piled in. Three weeks after that, a $4M Series A led by a top-tier fund.

Every clue had been sitting in the open on GitHub the whole time. I couldn't un-see it.

So I stopped networking. Started reading commit graphs the way quants read SEC filings. Same public data everyone else had. A lens almost nobody was using.

That asymmetry — not a better rolodex — turned out to be the whole opportunity.

I built a tool that reads that trail across 4,200+ startups every week. Methodology published on SSRN. Dataset CC BY 4.0. Sunday email free.

You don't need to be in San Francisco. You just need to read what's already public.

gitdealflow.com

### Thursday — Reddit
Post to r/datasets, Thursday 14:00 UTC.

Title: [Open Dataset] 219 startup fundraises backtested against GitHub commit velocity signals (CSV, CC BY 4.0)

Body: I backtested engineering acceleration signals (commit velocity + contributor diversity) against 219 confirmed startup fundraises. Composite signal predicted Series A 21-47 days before announcement with 3.4x lift.

Dataset: https://gitdealflow.com/datasets
CSV: https://gitdealflow.com/data/github-momentum-index-q3-2026.csv
SSRN: ssrn.com/abstract=6606558

Safe subreddits: r/datasets, r/juststart, r/devops. DO NOT post to r/SaaS, r/Entrepreneur, r/startups.

### Friday — Substack / Newsletter cross-promo (buyer-facing, not dev.to)
Post from The Data Nerd accounts, Friday 10:00 UTC.

Do NOT post the dev.to MCP article (that's developer-facing; the buyer doesn't read code). Instead, pitch a substack author or newsletter editor with the data story. The pre-registered-prediction angle ("10 names locked before the raise, graded after") is the hook. Pitch drafts are auto-generated every Monday by the `gitdealflow-buyer-pr-pitch` cron into `~/gitdealflow-distribution/07-community-distribution/`. Send from your own accounts.

Targets (buyer reads these): Not Boring, The Diff, Growth Unhinged, Clouded Judgement, StrictlyVC, Newcomer, Fortune Term Sheet.

---

## Show HN — Hacker News Post

### The Pitch

**Title:** Show HN: GitDealFlow — public GitHub momentum data predicts startup fundraises 21–47 days early (n=219, SSRN preprint)

**URL:** https://gitdealflow.com/data/momentum-index

**Body:**

I spent the last six months asking a single question: if you tracked every commit in every startup's public GitHub org, could you see a fundraise coming before the pitch deck leaked?

The answer is yes.

I mapped 4,200+ startup GitHub organizations across 20 sectors and backtested 219 fundraise events against the engineering velocity data. The signal is clean: a 3.4x lift in a composite of commit velocity and contributor diversity reliably precedes Series A pricing rounds by 21 to 47 days (median 31). The preprint is on SSRN (ssrn.com/abstract=6606558). The methodology is open. The data is CC BY 4.0.

What "The Data Nerd" shipped from this:

- A free **40-repo Momentum Index** at gitdealflow.com/data/momentum-index — updated weekly, no signup, no paywall. Every entry links back to the GitHub org so you can verify the signal yourself.
- A free **MCP server** (`npx -y @gitdealflow/mcp-signal`) with six read-only tools: trending startups, sector search, named-entity lookup, scout receipts (grades your personal GitHub star history against ~75 validated unicorns), and full methodology. Works inside Claude Desktop, Cursor, or any MCP host. Free forever, no auth required.
- A **Chrome extension** that overlays momentum badges on Crunchbase and Wellfound profiles so the signal appears in the tools investors already use.
- OpenAPI 3.1 spec, A2A endpoint, CSV/JSON/JSONL bulk exports, mirrors on Hugging Face and Zenodo (DOI pending).

There is no investor behind this. No fund affiliation, no pitch deck, no warm-intro software hidden under the hood. It is one pseudonymous author (ORCID 0009-0002-2222-4112, Wikidata Q139376302) who believes that public code shipping velocity is the most honest pre-round signal in venture capital — and that the data should be free.

I would love HN's feedback. Particularly interested in hearing from people who source deals, build on alternative data, or have strong opinions about what other GitHub signals (issue velocity? PR review latency? CI failure rates?) could improve the model.

The preprint and the dataset are linked from the landing page. Everything is public. Pull it apart.

**Posting instructions:**
- **Day/time:** Tuesday at 13:00 UTC (9:00 AM Eastern, peak HN window).
- **After posting:** Stay in the thread for the first 90 minutes and answer every substantive question with data, not marketing. Link back to the SSRN preprint whenever someone asks about methodology.
- **Rules:** No self-promotion pods. Do not coordinate with anyone to upvote. Do not share the post link in Telegram/Slack/Discord before it hits the front page. Let the data speak for itself.
- **If it gets traction:** Prepare a "what happened in the last 24 hours" follow-up comment with traffic and download stats.
- **Fallback:** If it does not clear the front page within 3 hours, accept it and move on. The data asset lives regardless.

---

## PLAY #6: Chrome Extension Distribution — store actions (added 2026-08-13)

**Why human:** Chrome Web Store / Edge Partner Center / Firefox AMO all sit behind your Google/Microsoft/Mozilla logins (passkey prompt blocked the agent). Everything below is staged — packages built, copy paste-ready.

**Packages (already built, v0.2.0 with in-popup upsell + review prompt):**
- Chrome: `~/signals-gitdealflow/dist-extensions/momentum-badge-chrome-v0.2.0.zip`
- Edge: `~/signals-gitdealflow/dist-extensions/momentum-badge-edge-v0.2.0.zip` (identical, Edge accepts Chrome zip)
- Firefox: `~/signals-gitdealflow/dist-extensions/momentum-badge-firefox-v0.2.0.zip` (has `gecko.id: momentum-badge@gitdealflow.com` — NEVER change this id later)

> **2026-08-14 rebuild:** manifest `name` was corrected from the stale "Momentum Badge" to "VC Deal Flow Signal — GitHub Startup Signals" so the in-browser name matches the store title (and the popup's own `<h1>`). All three zips were rebuilt via `python3 scripts/package-extensions.py`. When you upload the updated package, confirm the Package tab shows "VC Deal Flow Signal — GitHub Startup Signals" before submitting.

### 1. Chrome Web Store — upload v0.2.0 + fix listing (15 min)
1. Sign in: https://chrome.google.com/webstore/devconsole (passkey)
2. Open item `hehkgipiamajnnlpkfhpeoeaoaogmknn` ("VC Deal Flow Signal — GitHub Startup Signals")
3. Package → Upload updated package → the chrome zip above → Submit for review
4. Store listing → replace the description. Current listing says **"AngelList"** (wrong — it's Wellfound) and **"100+ startup organizations"** (stale). Paste-ready corrected copy:

```
Shows startup engineering velocity signals on Crunchbase and Wellfound company profiles. Free, GitHub-based data for VC deal flow analysis.

When you open a company profile on Crunchbase or Wellfound, an inline badge appears showing the live engineering signal:
• "Accelerating" — commit velocity up sharply vs the company's own baseline
• "Steady" — within normal range
• "Decelerating" — velocity down vs prior period
• "No data" — company not in the public dataset yet

Hover the badge for the underlying metrics: 14-day commit velocity, velocity change vs prior period, contributor count and growth, and the engineering signal type (hiring burst, infrastructure buildout, framework migration, deploy-frequency spike).

Data comes from GitDealFlow's public sector rankings — built from the public GitHub API across ~4,200 candidate startup organizations, refreshed weekly, and free to browse at https://signals.gitdealflow.com.

BUILT FOR
Seed and pre-seed investors, scouts, angels, and micro-fund GPs who research deals on Crunchbase and Wellfound and want a leading indicator next to the lagging database. Crunchbase shows what already happened; this badge shows whether engineering is accelerating right now — the acceleration that typically precedes a fundraise announcement by three to six weeks (methodology + SSRN preprint at https://gitdealflow.com).

PRIVACY
• No analytics, no tracking, no account required.
• Reads only the company slug from the URL of the page you're on.
• One outbound request to signals.gitdealflow.com per profile load.
• Free in perpetuity. Manifest V3.

Companion extension: "VC GitHub Lookup — Startup Signals on Hover" puts the same signal on every GitHub repo or org page. Install both from https://signals.gitdealflow.com/install.
```

5. Add screenshots (up to 5, 1280×800): ready-made at `~/signals-gitdealflow/chrome-ext-screenshot-1280x800.png` + take 2 more (badge on a Crunchbase page, the popup with the new upsell card).

### 2. Chrome Web Store — fix WRONG description on extension #2 (5 min)
Item `plgngijmloeljfkenecdkhiblcfcbblm` ("VC GitHub Lookup — Startup Signals on Hover") currently carries **extension #1's description** (talks about Crunchbase/Wellfound badges) and lists ITSELF as its own companion. Paste-ready corrected copy:

```
Hover any GitHub repo or org link — on any page — and a chip appears with VC-grade engineering signals: 14-day commit velocity, contributor growth, signal type, and stage estimate. Direct visits to github.com/org or github.com/org/repo pages get the chip automatically, and the toolbar popup runs a manual lookup against any GitHub URL.

Data comes from GitDealFlow's public sector rankings — built from the public GitHub API across ~4,200 candidate startup organizations, refreshed weekly, free to browse at https://signals.gitdealflow.com.

BUILT FOR
Investors and analysts doing technical diligence: native GitHub shows stars and a repo list; this chip shows whether the team is ramping or stalling against its own baseline — the engineering acceleration that typically precedes a fundraise by three to six weeks (methodology + SSRN preprint at https://gitdealflow.com).

PRIVACY
• No analytics, no tracking, no account required.
• Reads only GitHub org/repo slugs from links on the page.
• One outbound request to signals.gitdealflow.com per lookup.
• Free in perpetuity. Manifest V3.

Companion extension: "VC Deal Flow Signal — GitHub Startup Signals" overlays the same signal on Crunchbase and Wellfound company profiles. Install both from https://signals.gitdealflow.com/install.
```

### 3. Edge Add-ons (10 min, one-time account)
1. https://partner.microsoft.com/dashboard/microsoftedge — sign in with any Microsoft account, choose **Individual** account type (free, no business verification — do NOT pick Company)
2. New extension → upload the edge zip → listing copy: same as Chrome #1 above (title ≤55 chars: `GitDealFlow — Startup Signals on Crunchbase`)
3. Support/homepage URL: `https://gitdealflow.com/?utm_source=edge-addons`

### 4. Firefox AMO (10 min, one-time account)
1. https://addons.mozilla.org → register (free) → Developer Hub → Submit a New Add-on
2. Upload the firefox zip (first listed version MUST go through the web UI)
3. Listing copy: same as Chrome #1; homepage `https://gitdealflow.com/?utm_source=firefox-amo`
4. Source is unminified readable JS — no source archive needed.

### 5. Review-ask email (blocked on Resend key — SWITCH 6 above)
Once the Resend key is refreshed, send to the Digest list (day-14 of campaign):
Subject: `30 seconds: an honest review of the badge?`
Body: at `~/gitdealflow-distribution/06-chrome-extensions/review-campaign.md` (section "Lever 2").
