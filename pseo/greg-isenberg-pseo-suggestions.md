# pSEO Suggestions — Greg Isenberg

> Memo to the GitDealFlow team. Friend-of-the-product notes after a coffee-fueled
> 30-min skim of `signals.gitdealflow.com`. Voice and opinions are Greg's; tactical
> details adapted to what GitDealFlow already ships.
>
> Author: Greg Isenberg (Late Checkout, Boring Marketer, Startup Ideas Podcast)
> Date: 2026-05-28
> Status: Draft proposal for the next 60-day pSEO sprint.

---

## TL;DR — the take

You already have ~200 routes and the bones of a real internet brand. The
problem isn't volume, it's **shape**. Most of your pSEO targets "investors who
already know what they want." That's a small TAM with a lot of competition.

The opportunity is one rung lower: **operators, builders, and curious lurkers
typing long-tail questions into Google + ChatGPT**. They convert into newsletter
subs (top of value ladder) at 5–10× the rate of cold VC traffic. The Pro tier
sells itself once they're in the list.

Below: **15 new pSEO surfaces**, ranked by ROI / effort. Most reuse data you
already have (`content/companies.ts`, `content/startup-ideas.ts`,
`content/glossary.ts`, the GitHub corpus). The goal is **compounding internet
real-estate** — a page that ranks for "Rust startups to watch 2026" is still
working in 2029.

---

## Filter: what counts as a "Boring Marketer" page

Before any new template ships, it has to pass three tests:

1. **Long-tail search demand exists today.** Verify with Ahrefs / GSC. If
   nothing's there, the page is content for content's sake.
2. **The data refreshes automatically.** No template that requires manual
   curation per page. You're a 1–2 person team; build for leverage.
3. **The CTA is the free digest, not the Pro plan.** Cold traffic doesn't
   buy. It opts in. The digest converts to Pro over 6–10 sends.

If a page fails any of these, kill it. Don't ship a graveyard.

---

## The 15 surfaces

### Tier 1 — ship these first (highest ROI / lowest lift)

#### 1. `/idea/[slug]` — one startup idea per page
**Why:** IdeaBrowser proved this works. You already have
`content/startup-ideas.ts`; today it's one mega-page. Split it. Each idea gets
its own URL, its own schema.org `CreativeWork`, its own internal links to the
GitHub signal that inspired it.

**Template:**
- H1: "Startup idea: [name]"
- "Why now" (3 sentences, Data Nerd voice)
- The GitHub signal that surfaced it (live, linked to `/signal/[slug]`)
- TAM estimate (rough, cited)
- Adjacent ideas (3–5 internal links)
- "Want one of these in your inbox every week?" → digest CTA

**Volume:** ~300 ideas at launch, +5/week from the pipeline.
**Target query family:** "saas idea for [niche]", "[niche] startup idea
2026", "ai idea for [vertical]".

#### 2. `/q/[question-slug]` — Quora-style direct answers
**Why:** Google's AI Overview surfaces direct-answer pages with FAQ schema.
You already maintain `qa.json` / `qa.jsonl` / `standalone-faqs.ts` — expose
each Q as its own URL so Bing + ChatGPT cite the page, not just the JSON.

**Template:**
- H1: the exact question
- 80-word direct answer (above the fold, no preamble)
- Supporting evidence from the corpus (1–2 charts or tables)
- "Related questions" (internal links)
- Cite block (so AI assistants pull a clean attribution)

**Volume:** 500+ questions already drafted in `qa.jsonl`.
**Target query family:** "how do VCs find startups before they fundraise",
"what is commit velocity", "is GitHub data a leading indicator".

#### 3. `/how-to/[task-slug]` — investor + scout workflows
**Why:** "How to" queries are the most underserved high-intent slice in VC
SEO. Every existing answer is a Substack post behind a paywall. Free,
data-backed answers will rank in weeks.

**Examples:**
- `/how-to/spot-a-breakout-fintech-startup`
- `/how-to/run-due-diligence-on-an-engineering-team`
- `/how-to/source-pre-seed-deals-from-github`
- `/how-to/build-a-vc-deal-flow-spreadsheet`

**Volume:** Start with 40 workflows; one /sector × top 5 use-cases.
**Note:** you already shipped one of these
(`/how-to-spot-startup-momentum-before-the-round-gets-crowded`). Promote it
from a single page to a template.

#### 4. `/language/[lang]-startups` — programming-language listicles
**Why:** Developers Google "Rust startups" and "Go startups" constantly.
These pages double-dip: they rank for the language query *and* feed back
into recruiter / acquirer / journalist intent.

**Template:**
- H1: "Rust startups to watch, [period]"
- Top 15 by GitHub acceleration filtered to that language
- Mini sector chart (which sectors over-index in Rust)
- "Why [lang] startups matter now" intro
- CTA: digest + Pro

**Volume:** 25 languages × quarterly = 100 pages/year, all auto-refreshed.

#### 5. `/framework/[name]-startups` — same pattern, frameworks
**Why:** Even hotter than languages for AI-era queries. "Next.js startups",
"FastAPI startups", "LangChain companies" — all underserved.

**Volume:** 50 frameworks. Same data pipeline as #4.

---

### Tier 2 — ship within 30 days

#### 6. `/hiring/[role]-[sector]` — hiring signal pages
**Why:** GitHub contributor growth is a hiring leading indicator. You
already compute it. Convert it into recruiter / sales / candidate search
traffic.

**Examples:**
- `/hiring/senior-engineers-fintech`
- `/hiring/ml-engineers-ai-startups`

CTA layer: position the digest as "see who's hiring before they post the
job."

#### 7. `/tracker/[topic]` — auto-updating topic trackers
**Why:** Trackers are inherently viral and share-able (people screenshot
them). Greg playbook 101: build a *living dashboard* per topic.

**Examples:**
- `/tracker/ai-agents`
- `/tracker/devtools`
- `/tracker/llm-infra`
- `/tracker/dev-mcp-servers`

Each = a saved view of the dashboard. Snapshot weekly so the URL itself
ranks (search engines love freshness on the same canonical URL).

#### 8. `/list/[topic]` — editorial listicles, periodically updated
**Why:** Classic listicle SEO still works. Frame each as "Top 100 X" so they
collect backlinks from press.

**Examples:**
- `/list/top-100-saas-startups-by-engineering-velocity`
- `/list/top-50-yc-batches-by-momentum`
- `/list/top-25-bootstrapped-startups-2026`

Differentiator vs. competitor listicles: yours updates automatically and
shows methodology. That's link-bait gold.

#### 9. `/why/[contrarian-take]` — opinion pages with data backup
**Why:** Greg playbook: contrarian takes get shared. Yours can be defended
with the GitHub corpus, which competitors can't match.

**Examples:**
- `/why/most-vc-deal-flow-is-already-stale`
- `/why/github-data-beats-warm-intros-in-2026`
- `/why/series-a-funds-are-now-too-late`

Each = ~1200 words, 1 hero chart, 3 sub-claims with data. **Use these as
LinkedIn-native posts first; turn the post into the page once it pops.**

#### 10. `/startup-vs/[a]-vs-[b]` — head-to-head startup pages
**Why:** You have `/compare/[slug]` for sector-level comparisons. Go a layer
deeper. People search "Modal vs Replicate", "Linear vs Height", "Resend vs
Postmark" *constantly* and the top results are mediocre.

**Template:**
- Side-by-side GitHub velocity, contributor count, repo count
- "Who's hiring more / faster"
- "Which has more upstream OSS adoption"
- Editor's take (1 paragraph)

**Volume:** Top 200 startup pairs (you can mine these from search-suggest
APIs). Pages can be lightweight since the data does the talking.

---

### Tier 3 — ship within 60 days (higher lift, big payoff)

#### 11. `/state-of/[topic]/[year]` — annual state-of-X reports
**Why:** "State of JavaScript" / "State of AI" reports are the most
linked-to pages in their categories. You can shipping 10/year automatically.

**Examples:**
- `/state-of/ai-agents/2026`
- `/state-of/devtools/2026`
- `/state-of/open-source-funding/2026`

Each = a long-scroll page with charts, downloadable PDF, embeddable
sections. Press cites it, AEO ingests it.

#### 12. `/memo-template/[sector]` — free deal-memo templates
**Why:** Best lead magnets are tools people save and re-use. Memo templates
are the perfect investor lead magnet — high save-rate, high share-rate.

**Template:**
- 1-pager template per sector with the right diligence questions
- "Auto-populate from a GitHub URL" (lightweight tool, opens digest signup)
- Download as Notion / Google Doc

**Volume:** 20 sector templates.

#### 13. `/repo/[org]/[name]` — per-repo deep-dive pages
**Why:** This is the *long-tail goldmine*. People Google "[org] github" or
"[repo name] usage" all the time. Almost no one ranks for these except the
repo itself. You can sit in position 2.

**Template:**
- Repo health: stars, contributors, commit cadence
- "Signals from this repo" (which sector signal it contributes to)
- Adjacent repos
- "This is part of [parent org]'s engineering acceleration" → links to
  `/signal/[slug]`

**Volume:** Top 5000 tracked repos. SSG at build time, refreshed weekly.
This alone could 3× your organic traffic.

#### 14. `/accelerator/[name]/[batch]` — YC/Techstars batch tracking
**Why:** Every "YC W26 companies" search lands on a thin YC directory page.
You can dominate with engineering acceleration data overlaid.

**Examples:**
- `/accelerator/yc/w26`
- `/accelerator/techstars/nyc-2026`
- `/accelerator/a16z-speedrun/2026`

**Volume:** 50 accelerators × 4 batches = ~200 pages, each highly
link-worthy.

#### 15. `/watchlist/[topic]` — shareable user watchlists
**Why:** Greg playbook: turn pSEO pages into products. A watchlist page that
investors can save → "fork as my own watchlist" creates the network effect.

**Template:**
- Curated list of 10–25 startups by topic
- "Save this watchlist" → digest signup with watchlist preselected
- "Fork this watchlist" → premium feature (Pro tier moment)
- Shareable OG image with the top 5 names

**Volume:** 100 seeded watchlists, then UGC layer for Pro users.

---

## What I'd cut or de-prioritize

You have ~200 routes. Some are doing more harm than good — they dilute
authority and split internal link equity. Audit candidates:

| Route | Why audit |
|---|---|
| `/parables`, `/manifesto`, `/origin`, `/story` | Cute, but no search demand. Either delete or consolidate into `/about`. |
| `/decade-in-a-day`, `/post-90`, `/squeeze` | Funnel scaffolding that's leaked into the public sitemap. Move to `noindex`. |
| `/share-approve`, `/r/`, `/s/` | Look like aliasing/redirect paths. Verify they aren't getting crawled as standalone. |
| Any `/for/[slug]` page targeting a persona with <100 monthly searches | Consolidate into broader persona hubs. |

Run a GSC "low-quality pages" audit. Anything with <5 impressions/month
after 90 days indexed is a candidate to noindex.

---

## Internal-linking architecture (the part everyone skips)

New surfaces only compound if they link back to your **money pages**:

- Every new page → 1 link to `/sector/[slug]` it belongs to.
- Every new page → 1 link to the relevant `/signal/[slug]` startup.
- Every new page → 1 link to a `/q/[question]` for AEO depth.
- Homepage and `/sitemap` get a "What's new" module that surfaces the latest
  10 published pages — that's how you get them indexed in <72h.

Build a `lib/internal-links.ts` helper that returns the right 3–5 anchors
per page type. Don't hand-curate.

---

## Distribution: pages are 50% of the work

Each new template needs a distribution motion attached or it's a tree
falling in a forest:

1. **`/idea/[slug]`** → "Startup idea of the day" Twitter thread + Threads
   post. One a day, batch-scheduled.
2. **`/q/[question]`** → seed the question on Reddit
   (r/venturecapital, r/startups, r/EntrepreneurRideAlong), top-comment your
   own page.
3. **`/how-to/[task]`** → LinkedIn carousel + YouTube short. Same content,
   3 surfaces.
4. **`/list/[topic]`** → outreach to 5 journalists per list. The listicle
   is the lede; you're the source.
5. **`/state-of/[topic]/[year]`** → PR push, embargo, press release. This
   one warrants budget.

Repurpose first, write second. Every Reddit post / tweet that pops should
become a `/why/[take]` page. Every newsletter Q should become a `/q/[slug]`.

---

## What success looks like — 90 days from ship

- Organic sessions: 2× current baseline (mostly from `/idea`, `/q`,
  `/repo`)
- Newsletter conversions from pSEO traffic: 8–12% (vs. current ~4%)
- Top-of-funnel CAC: < €1.50
- AEO citations (Perplexity, ChatGPT, Bing Copilot): tracked weekly via the
  HubSpot AEO Grader you already run; goal +50% citation rate.
- One viral list (`/list/top-100-…`) that lands a press mention.

If you hit 3 of 5, the sprint paid for itself. If you hit 5 of 5, you've
got the foundation for Insider Circle pricing to be raised to €197.

---

## Final note from Greg

You're sitting on the only public GitHub-acceleration corpus that nobody
else has structured. That's a **moat that compounds with pSEO**. The
mistake would be optimizing the existing 200 pages instead of building the
next 5,000 the same way.

Move fast. Ship the Tier 1 surfaces this month. Audit in 60 days. Don't
let any one page take more than 30 minutes of human time after the
template is built — the template is the asset, not the page.

Hit me on Twitter if you want to riff on the listicle ideas.

— Greg
