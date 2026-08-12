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

The Resend API key in `agent/.env` returned 401. Refresh it:
1. Go to https://resend.com/api-keys
2. Create new key for gitdealflow.com domain
3. Update `agent/.env`: `RESEND_API_KEY=re_NEW_KEY`

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

### Friday — Dev.to Article (no API key)
Create account at dev.to/enter, then post from this file:
`outreach/devto-mcp-agent-article.md`
Tag: #mcp #ai #startup #datascience #github

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
