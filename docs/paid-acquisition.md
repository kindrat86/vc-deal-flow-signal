# Paid acquisition — Reddit Ads first, newsletter sponsorship second

**Status:** Infrastructure shipped 2026-05-06. Campaigns are in `draft` state in
`pseo-site/lib/paid-acquisition.ts`. Account creation, payment-card entry, and
campaign launch are user-only actions (Claude is prohibited from doing them).
This doc is the paste-and-launch playbook.

**Why this exists:** Brunson DotCom Secret #5 — Three Types of Traffic. Earn
(SSRN, MCP catalogues, Smithery 90/100, awesome-* lists) and Own (the email
list) are in production. Control (paid) was the only one of the three at zero,
and was the lowest score in the Trilogy audit (78/100 — the only sub-80 score
in DotCom Secrets). Even €5/day moves that chapter to ~88.

**Channels intentionally excluded** (per `MEMORY.md`):

- **LinkedIn** — "No LinkedIn actions, ever" rule applies to organic AND paid.
- **HN sponsored** — account `the_data_nerd` blocked; same domain risk as
  organic posting.
- **X / Twitter Ads** — account suspended, no creative voice to attach to.
- **Meta / TikTok / Pinterest** — wrong ICP for developer-investor avatar.

---

## Channel 1 — Reddit Ads (start here, €5–25/day)

### Why Reddit first

1. **Lowest test floor.** €5/day, no minimum lock-in. €150 lets you reach
   statistical significance on a single subreddit.
2. **Dream-100 native.** r/venturecapital, r/AngelInvestors, and r/startups
   are literally three of the entries on `signals.gitdealflow.com/dream-100`.
3. **Subreddit targeting is precise.** Avoids the LinkedIn "we're paying €25
   CPM to reach HR managers, not VCs" cost blowup.
4. **Existing Pixel infra.** `monitoring/retargeting-pixels.md` already has
   the Reddit pixel slot wired into `PixelManager.tsx` — drop the ID in,
   redeploy, retargeting works.

### Account setup (user-only, ~10 min)

1. Go to https://ads.reddit.com → sign in with the Reddit account that owns
   the brand presence (NOT the personal account; create a "GitDealFlow"
   business handle if needed).
2. Add billing — €25 minimum top-up; expect a $1 auth charge.
3. Generate the Reddit Pixel ID (Events Manager → Add Pixel).
4. Set Vercel env var on `pseo-site` project:
   `NEXT_PUBLIC_REDDIT_PIXEL_ID=<rdt_xxxxxxxx>`
   Then redeploy. (`PixelManager.tsx` reads it on next build.)
5. Verify the pixel fires on `/firstlook` using the Reddit Pixel Helper
   browser extension — should show "PageView" within 5s.

### Campaign config

| Setting | Value | Why |
|--------|-------|-----|
| Objective | **Traffic** (not Conversions) | Conversions optimization needs ~50 events/week to learn; we won't have that on day 1. Switch to Conversions after the pixel logs >50 First Look conversions. |
| Bidding | **Manual CPC**, €0.40 starting bid | Reddit auto-bid spends fast on cheap inventory. Manual CPC keeps the experiment honest. |
| Budget | €5/day per ad-set, €25/day total cap | Six ad-sets (one per subreddit) running concurrently. €150/month max if nothing scales. |
| Geo | US, UK, IE, NL, DE, FR, ES, IT, PT, CA, AU, SG | EN-speaking + EU dev-investor concentration. Drops India/PH (lower €/check filter). |
| Dayparting | 09:00–22:00 local | Reddit B2B traffic is daytime-heavy; nights are entertainment. |
| Devices | Desktop + Mobile | Don't restrict — Reddit's mobile is 70%+ of traffic. |
| Frequency cap | 3/day per user | Anti-fatigue. |

### Targeting — six ad-sets

| # | Subreddit | Slug | Daily | Hypothesis |
|---|-----------|------|-------|------------|
| 1 | r/venturecapital | `vc` | €5 | 47-day-before-the-deck hook + dollars math |
| 2 | r/AngelInvestors | `angel` | €5 | Cheque-size-specific framing |
| 3 | r/startups | `startups` | €5 | Founder-side share-with-your-angel referral compounding |
| 4 | r/devtools | `devtools` | €3 | Engineering-acceleration method copy |
| 5 | r/programming | `programming` | €4 | Scale subreddit, lowest CTR/lowest CPM |
| 6 | r/MachineLearning | `ml` | €3 | AI-infra thesis (60% of FirstLook orders are AI-infra) |

Each ad URL uses the short redirect: `https://signals.gitdealflow.com/r/<slug>` —
which 308-forwards to `/firstlook?utm_source=reddit&utm_medium=cpc&utm_campaign=...`
so attribution lands cleanly in PocketBase via `/api/subscribe`.

### Kill / scale criteria (after 1,000 impressions per ad-set)

- **CTR < 0.8%** → pause that ad-set, swap creative.
- **CTR ≥ 1.5% AND CPC < €0.80** → scale daily budget 2× (max €15/day per ad-set).
- **/firstlook conversion rate < 1.0%** after 100 clicks → the *landing*, not the
  ad, is the problem; A/B the headline before scaling.
- **Net CAC > €30 for the €7 First Look** → don't kill — First Look is a loss-
  leader to Dashboard. Track 14-day Dashboard upgrade rate; CAC payback is
  measured at the Dashboard tier (€9.97/mo × 12 × 60% retention = €72 LTV).

### The 6 ads (paste-ready)

All ads use Reddit's "Promoted Post" format — title up to 300 chars, body up to
40,000 (use 200–600). Image specs: 1200×628, no overlay text per Reddit policy.

#### Ad 1 — r/venturecapital → /r/vc

**Title:**
> Built a tool that flags VC deals 21–47 days before the deck circulates. Free Sunday digest, €7 if you want it on your specific thesis.

**Body:**
> I'm a developer who also writes angel cheques. Spent two years frustrated that warm-intro deal flow always meant arriving after consensus had already formed.
>
> Built a system that monitors GitHub commit velocity, contributor influx, and new-repo creation across 350+ venture-backed startups. Across the SSRN-published panel of 219 confirmed rounds, the engineering acceleration shows up 21–47 days before Crunchbase hears about it.
>
> Free version: 5 ranked names every Sunday, sector-tagged.
>
> €7 version: pick any of 19 sectors at checkout, 24h later you get the full deep dive PDF + raw CSV. €7 credited toward Dashboard if you upgrade in 14 days.
>
> Methodology + paper: ssrn.com/abstract=6606558

**CTA:** "Get the €7 deep dive →"

---

#### Ad 2 — r/AngelInvestors → /r/angel

**Title:**
> Angel-side question: how do you avoid paying for deal flow tools built for €100M+ funds?

**Body:**
> Harmonic, Tracxn, and Affinity start at €1k–€10k/mo because they sell into procurement at funds. The data layer underneath is mostly public — GitHub momentum, contributor patterns, dependency graphs — but the SaaS markup is priced for fund-grade buyers.
>
> Pulled the same signals into a €9.97/mo dashboard. SSRN-published methodology, 219-startup backtest panel, weekly refresh. Founding member rate locked forever.
>
> If you want to test it on a sector you actually invest in before subscribing: First Look Pass — €7 once, pick a sector, 24h written deep-dive in your inbox. Refunded if we don't surface 3 names you don't already know.

**CTA:** "Test it for €7 →"

---

#### Ad 3 — r/startups → /r/startups

**Title:**
> Founders: the data layer your investors are about to start using to find you (and how to use it back at them).

**Body:**
> Spent the last 18 months building a dashboard that tracks engineering acceleration across 350+ venture-backed startups. The use-case is investor-side — surface companies before consensus forms — but the same data answers a question founders care about:
>
> Which competitors in your sector are about to raise? You can read it from their commit graph 21–47 days before they announce.
>
> Free Sunday digest covers 5 names a week. €7 First Look gives you the full sector deep-dive — top 25 ranked orgs, contributor maps, three pre-Crunchbase breakouts. SSRN paper with the methodology: ssrn.com/abstract=6606558
>
> If you're a founder and your competitors are accelerating faster than you, that's a signal you need to know about.

**CTA:** "Pull your sector report →"

---

#### Ad 4 — r/devtools → /r/devtools

**Title:**
> The data nerd's deal flow tool: ranks 350+ venture-backed devtools companies by GitHub commit velocity weekly.

**Body:**
> If you've ever wished GitHub had a "trending startups (not trending repos)" view, this is it.
>
> Continuous panel of 350+ venture-backed orgs. Weekly refresh on commit velocity acceleration, contributor diversity (Gini), README freshness, dependents-graph adoption, issue-to-PR ratio.
>
> Built specifically for the developer who also writes angel cheques. Methodology open, source CC BY 4.0 on the Sharp Tier.
>
> Free Sunday digest: 5 names. Dashboard at €9.97/mo locked-forever for founding members. €7 First Look Pass if you want a single sector deep-dive before subscribing.

**CTA:** "Read the methodology →"

---

#### Ad 5 — r/programming → /r/programming

**Title:**
> Q: what does GitHub commit velocity actually predict? A: VC funding rounds, ~21–47 days before Crunchbase hears about it.

**Body:**
> SSRN-published methodology, n=219 confirmed rounds, matched control set. Stratified by stage. Contributor-diversity Gini ~0.34 at month -3 for closed rounds vs ~0.61 for non-closing.
>
> Productized as a weekly digest of 5 names + a paid dashboard ranking 350+ orgs.
>
> Paper: ssrn.com/abstract=6606558. Methodology page is the entire algorithm in <500 words. You can fork it and re-derive every claim from public GitHub data without paying us.

**CTA:** "Read the algorithm →"

---

#### Ad 6 — r/MachineLearning → /r/ml

**Title:**
> AI-infra is 60% of the panel. Built a tool that flags accelerating AI startups 21–47 days before Crunchbase.

**Body:**
> Tracked engineering acceleration across 350+ venture-backed orgs for 18 months. AI infra and AI-tools sectors over-index in the panel of 219 confirmed rounds — closed AI-infra rounds had a contributor-diversity Gini of ~0.30 at month -3, vs ~0.61 for non-closing.
>
> Translation: distributed AI codebases (4+ committers, top one <50% of volume) close rounds faster than single-bus-factor ones. Surprising to no-one who works in AI infra; surprising to most VCs writing the cheques.
>
> €7 First Look gives you the AI-infra deep-dive on demand. Free Sunday digest covers 5 names a week.

**CTA:** "Get the AI-infra deep-dive →"

---

## Channel 2 — Google Search Ads (Tier 1.5)

Run *after* Reddit confirms /firstlook converts at >2% but *before* newsletter
sponsorship — Google has higher commercial intent than Reddit and lower scale
than newsletters.

### Keywords (exact match, low-volume / high-intent)

| Keyword | Match | Expected CPC | Landing |
|---------|-------|--------------|---------|
| `harmonic alternative` | exact | €3–6 | /alternatives/harmonic |
| `tracxn alternative` | exact | €2–5 | /alternatives/tracxn |
| `affinity vc alternative` | exact | €2–4 | /alternatives/affinity |
| `github trending startups` | phrase | €0.40–1.20 | /trending |
| `vc deal flow software` | phrase | €4–8 | /firstlook |
| `early stage startup database` | phrase | €1.50–3 | /best |

**Negative keywords:** `free`, `tutorial`, `course`, `jobs`, `pricing` (until
the searcher has shown commercial intent on a primary keyword).

**Budget:** €10/day per ad-group, €30/day total cap until cost-per-First-Look
falls below €15.

### Pixel: Google Ads conversion tag fires on `/thanks/firstlook` page-view.
Already wired in `PixelManager.tsx`; only need `NEXT_PUBLIC_GOOGLE_ADS_ID`.

---

## Channel 3 — Newsletter Sponsorship (Tier 2)

**Run only after Reddit confirms /firstlook converts at >2% over 1,000+ paid
visitors.** A €5,000 sponsorship slot with a 1% conversion rate burns
€500/customer; a 2.5% rate at the same price gets you to €200/customer with
60% Dashboard upgrade rate = breakeven inside 4 months on Dashboard LTV.

### Top-3 sponsorship targets

| Newsletter | Subscribers | ICP fit | Slot cost | Why this one |
|------------|-------------|---------|-----------|---|
| **TLDR** | 4M+ devs | Developer side | $5,000 | Largest scale on the developer leg of the avatar. |
| **The Generalist** (Mario Gabriele) | ~150k | Pure VC-curious | $3,000–5,000 | Highest concentration of investor-side ICP. |
| **Lenny's Newsletter** | ~700k | PM/founder, some investors | $4,000 | Founders share with their angels — referral compounding. |

### What to ship (creative)

A 60–80-word native sponsor block, NOT a banner ad. Same voice as the soap
opera in `pseo-site/lib/emails.ts`. Linked URL = `signals.gitdealflow.com/r/tldr`
(or `/r/generalist`, `/r/lenny`) — a campaign slug for clean attribution.

---

## Attribution & monitoring

UTM end-to-end is already wired:

- `/api/subscribe` reads + persists `utm_source`, `utm_medium`, `utm_campaign`
  to PocketBase `subscribers` collection (see `app/api/subscribe/route.ts:104`).
- `/api/verify` propagates the same UTMs to Resend audience contacts so the
  drip-email source-of-acquisition is queryable in Resend.
- `monitoring/build-dashboard.py` already filters subscribers by source.

**Daily attribution check:** `monitoring/build-dashboard.py` writes to
`monitoring/dashboard.html`. Add a paid-traffic filter card after first ad-spend
day (followup ticket — not blocking launch).

---

## Launch order (when you sit down to do this)

1. Set `NEXT_PUBLIC_REDDIT_PIXEL_ID` env var on Vercel + redeploy `pseo-site`.
   (~5 min)
2. Create the Reddit Ads account, top up €25, generate the pixel.   (~10 min)
3. Verify the pixel fires on /firstlook with the Reddit Pixel Helper. (~2 min)
4. Open `pseo-site/lib/paid-acquisition.ts`, flip the 6 Reddit campaigns
   from `status: "draft"` to `"live"`. Commit + deploy.  (~3 min)
5. Create the 6 ad-sets in Reddit Ads UI using the copy above.  (~30 min)
6. Set total daily budget cap to €25 to start. Launch.  (~1 min)
7. Check stats at 24h + 72h. Pause anything <0.8% CTR. Scale anything
   >1.5% CTR + CPC <€0.80.

**Estimated time-to-first-paid-click:** 60 minutes from sitting down.
**Estimated weekly spend at full deployment:** €175 (€25/day × 7).
**Estimated month-1 Brunson-audit lift:** DotCom #5 from 78 → 88 (+10 pts;
+0.4 composite alone). Plus retargeting unlocks Tier 1.5 + Tier 2 channels.
