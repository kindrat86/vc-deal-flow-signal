# pSEO Suggestions — Greg Isenberg

> Memo to the GitDealFlow team. Friend-of-the-product notes after a closer
> read of `signals.gitdealflow.com`'s route tree (~210 routes inventoried).
> Voice and opinions are Greg's; tactical details adapted to what GitDealFlow
> already ships.
>
> Author: Greg Isenberg (Late Checkout, Boring Marketer, Startup Ideas Podcast)
> Date: 2026-05-28
> Status: Draft proposal for the next 60-day pSEO sprint.

---

## TL;DR — the take

You already have ~210 routes and the bones of a real internet brand. Several
of the "obvious" pSEO templates I'd normally pitch are **already shipped**
(see Audit below). The opportunity isn't to duplicate them — it's to
**fill ten specific gaps** that are still wide open and that match how your
ICP actually searches.

The thesis: most current routes target investors who already know what they
want. The next ring out — **operators, builders, recruiters, journalists, and
LP-curious lurkers** — types long-tail queries that map cleanly to GitHub
data you already publish. Those personas convert into the free digest at
5–10× the rate of cold VC traffic, and the digest → Pro ladder you've
already built does the rest.

Below: an audit of what's shipped, then **10 genuinely net-new pSEO surfaces**
ranked by ROI / effort.

---

## Audit — what I thought was missing but is already shipped

Before pitching anything new, calibration. Several templates I'd normally
propose first are already live:

| Proposed template | Already shipped as | Notes |
|---|---|---|
| `/idea/[slug]` (one startup idea per page) | `/startup-ideas/[slug]` | Driven by `content/startup-ideas.ts`. Article schema in place. |
| `/q/[question]` (Quora-style direct answers) | `/answers/[slug]` | Backed by `content/agent-queries.ts`. |
| `/tracker/[topic]` (auto-updating topic hubs) | `/topics/[slug]` | Pillar-driven, posts aggregated per topic. |
| `/startup-vs/[a]-vs-[b]` | `/vs/[slug]` | Competitor-vs, sourced from `content/competitor-vs.ts`. |
| `/repo/[org]/[name]` (per-repo deep-dives) | `/momentum/[org]/[repo]` | Already SSG'd with tier badges. |
| `/list/[topic]` (editorial listicles) | `/best/[slug]` | Sector-scoped today. Could be expanded — see #4 below. |
| `/calculator/[tool]` | `/tools/<calc>` | Burn-multiple, CAC payback, runway, LTV, etc. All live. |

That's seven templates I'd have pitched as Tier 1 in any other audit. Skip
them. The list below is **only** what's not currently covered.

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

## The 10 net-new surfaces

### Tier 1 — ship these first (highest ROI / lowest lift)

#### 1. `/language/[lang]-startups` — programming-language listicles
**Why:** Developers Google "Rust startups" and "Go startups" constantly.
None of your existing routes target language-scoped discovery. These pages
double-dip: they rank for the language query *and* feed back into recruiter
/ acquirer / journalist intent.

**Template:**
- H1: "[Lang] startups to watch, [period]"
- Top 15 by GitHub acceleration filtered to that language
- Mini sector chart (which sectors over-index in that language)
- "Why [lang] startups matter now" intro (Data Nerd voice, ~120 words)
- CTA: digest + Pro

**Data path:** add `primary_language` field to the company corpus (cheap —
already in the GitHub API responses you ingest). Filter at build time.

**Volume:** 25 languages × quarterly = 100 pages/year, all auto-refreshed.

#### 2. `/framework/[name]-startups` — framework-scoped listicles
**Why:** Even hotter than languages for AI-era queries. "Next.js startups",
"FastAPI startups", "LangChain companies" — all underserved in current
results.

**Volume:** ~50 frameworks. Same data pipeline as #1, different filter
(detect framework from `package.json` / `requirements.txt` / `Cargo.toml`).

#### 3. `/how-to/[task-slug]` — investor + scout workflows
**Why:** You shipped a single one-off page
(`/how-to-spot-startup-momentum-before-the-round-gets-crowded`) — proof the
concept ranks for you. Promote it from a one-off to a template.

"How to" queries are the most underserved high-intent slice in VC SEO.
Almost every existing answer is a Substack post behind a paywall. Free,
data-backed answers will rank in weeks.

**Examples to seed (40 pages):**
- `/how-to/spot-a-breakout-fintech-startup`
- `/how-to/run-due-diligence-on-an-engineering-team`
- `/how-to/source-pre-seed-deals-from-github`
- `/how-to/build-a-vc-deal-flow-spreadsheet`
- `/how-to/track-a-startup-without-tipping-off-founders`

**Template:** H1 = the exact task; 80-word "do this now" answer above the
fold; numbered steps; embedded chart from your corpus; "related questions"
links into `/answers/[slug]`.

#### 4. Expand `/best/[slug]` beyond sectors — editorial lists
**Why:** Today `/best/[slug]` is sector-scoped. Open it up to topical lists
that classic listicle SEO loves and that collect press backlinks.

**Examples (route stays the same, just new slugs):**
- `/best/bootstrapped-startups-2026`
- `/best/yc-companies-by-engineering-velocity`
- `/best/dev-tool-startups-by-contributor-growth`
- `/best/european-fintech-startups-2026`

**Differentiator vs. competitor listicles:** yours updates automatically and
shows methodology. That's link-bait gold.

**Lift:** very low — `lib/data.ts` already exposes the slug parser. Add a
new shape (`bestKind: "sector" | "topical"`) and unblock the new slugs.

---

### Tier 2 — ship within 30 days

#### 5. `/hiring/[role-or-sector]` — hiring signal pages
**Why:** GitHub contributor growth is a hiring leading indicator. You
already compute it. Convert it into recruiter / sales / candidate search
traffic.

**Examples:**
- `/hiring/senior-engineers-fintech`
- `/hiring/ml-engineers-ai-startups`
- `/hiring/devrel-developer-tools`

CTA layer: position the digest as "see who's hiring before they post the
job." Tight reframe of the same product.

#### 6. `/why/[contrarian-take]` — opinion pages with data backup
**Why:** Contrarian takes get shared. Yours can be defended with the GitHub
corpus, which competitors can't match.

**Examples:**
- `/why/most-vc-deal-flow-is-already-stale`
- `/why/github-data-beats-warm-intros-in-2026`
- `/why/series-a-funds-are-now-too-late`
- `/why/the-best-pre-seed-signal-is-a-monorepo-split`

Each = ~1200 words, 1 hero chart, 3 sub-claims with data. **Use these as
LinkedIn-native posts first; turn the post into the page once it pops.**
Doubles as repurposing content.

#### 7. `/state-of/[topic]/[year]` — annual state-of-X reports
**Why:** You have `/state-of-github` as a one-off. Promote it to a template.
"State of JavaScript" / "State of AI" reports are the most linked-to pages
in their categories. You can ship 10/year automatically.

**Examples:**
- `/state-of/ai-agents/2026`
- `/state-of/devtools/2026`
- `/state-of/open-source-funding/2026`
- `/state-of/dev-mcp-servers/2026`

Each = long-scroll page with charts, downloadable PDF, embeddable sections.
Press cites it, AEO ingests it. **This is the single biggest backlink
opportunity in the proposal.**

---

### Tier 3 — ship within 60 days (higher lift, big payoff)

#### 8. `/accelerator/[name]/[batch]` — accelerator batch tracking
**Why:** Every "YC W26 companies" search lands on a thin YC directory page.
You can dominate by overlaying engineering acceleration data on the public
batch list.

**Examples:**
- `/accelerator/yc/w26`
- `/accelerator/techstars/nyc-2026`
- `/accelerator/a16z-speedrun/2026`
- `/accelerator/entrepreneur-first/fall-2026`

**Volume:** 50 accelerators × ~4 batches = ~200 pages, each highly
link-worthy (alumni share their own batch page).

#### 9. `/memo-template/[sector]` — free deal-memo templates
**Why:** Best lead magnets are tools people save and re-use. Memo templates
are the perfect investor lead magnet — high save-rate, high share-rate, low
build cost.

**Template:**
- 1-pager diligence template per sector
- "Auto-populate from a GitHub URL" (lightweight tool, opens digest signup)
- Download as Notion / Google Doc

**Volume:** 20 sector templates. Reuse the sector taxonomy you already have.

#### 10. `/digest/[date]` — newsletter archive as SEO surface
**Why:** Every issue you've sent is currently invisible to search. Each
weekly digest = ~5 startups + ~3 signals + the editor's note. That's a
keyword-rich page Google will index, and people search "[startup name]
weekly signal" all the time.

**Template:**
- One page per published digest
- Stable URL pattern `/digest/2026-05-28`
- Linked from every digest email footer ("read in browser")
- Internal links to `/signal/[slug]` for every company mentioned

**Volume:** retroactively backfill ~30 historical issues + 1/week ongoing.

---

## What I'd cut or de-prioritize

You have ~210 routes. Some are doing more harm than good — they dilute
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
- Every new page → 1 link to an `/answers/[slug]` for AEO depth.
- Homepage and `/sitemap` get a "What's new" module that surfaces the latest
  10 published pages — that's how you get them indexed in <72h.

Build a `lib/internal-links.ts` helper that returns the right 3–5 anchors
per page type. Don't hand-curate.

---

## Distribution: pages are 50% of the work

Each new template needs a distribution motion attached or it's a tree
falling in a forest:

1. **`/language/[lang]-startups`** → submit to each language's official
   newsletter/awesome-list ("This Week in Rust", etc.). Easy first backlinks.
2. **`/how-to/[task]`** → LinkedIn carousel + YouTube short. Same content,
   3 surfaces.
3. **`/best/<topical>`** → outreach to 5 journalists per list. The listicle
   is the lede; you're the source.
4. **`/why/[take]`** → seed as LinkedIn post first, *then* turn the
   pop-iest post into the page.
5. **`/state-of/[topic]/[year]`** → PR push, embargo, press release. This
   one warrants budget.
6. **`/accelerator/[batch]`** → DM 5 alumni from each batch when the page
   ships. They share their own page like wildfire.

Repurpose first, write second. Every Reddit post / tweet that pops should
become a `/why/[take]` page. Every newsletter Q should become an
`/answers/[slug]`.

---

## What success looks like — 90 days from ship

- Organic sessions: 2× current baseline (mostly from `/how-to`,
  `/language`, `/best/<topical>`)
- Newsletter conversions from pSEO traffic: 8–12% (vs. current ~4%)
- Top-of-funnel CAC: < €1.50
- AEO citations (Perplexity, ChatGPT, Bing Copilot): tracked weekly via the
  HubSpot AEO Grader you already run; goal +50% citation rate.
- One viral list or `/state-of/` report that lands a press mention.

If you hit 3 of 5, the sprint paid for itself. If you hit 5 of 5, you've
got the foundation for Insider Circle pricing to be raised to €197.

---

## Final note from Greg

You're sitting on the only public GitHub-acceleration corpus that nobody
else has structured. The fact that you've already shipped `/startup-ideas`,
`/answers`, `/topics`, `/vs`, `/momentum/[org]/[repo]`, `/best` and 200
other routes is a real moat. Don't duplicate what's there.

These 10 fill the holes I can see in the search funnel. Ship Tier 1 this
month, audit the cuts in parallel, and the rest follows. Don't let any one
page take more than 30 minutes of human time after the template is built —
**the template is the asset, not the page**.

Hit me on Twitter if you want to riff on the `/state-of/` topic list.

— Greg
