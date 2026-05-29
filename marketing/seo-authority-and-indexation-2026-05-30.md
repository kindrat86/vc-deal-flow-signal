# SEO — Indexation Evidence + Authority Plan — 2026-05-30

Follow-up to [`seo-geo-aeo-audit-2026-05-29.md`](./seo-geo-aeo-audit-2026-05-29.md) and
[`pseo-thin-page-analysis-2026-05-28.md`](./pseo-thin-page-analysis-2026-05-28.md). This pass executes the
three open suggestions from the 05-30 audit conversation:

1. **Indexation reality check** (Discovered-not-indexed proxy — no GSC API access).
2. **Refreshed thin-page quantification** (re-ran the uniqueness gate against the *current* corpus).
3. **Authority / backlink plan** (anonymity-compatible, additive to the existing `tier5-link-building/`).

The headline has not changed since 05-29 — it has gotten **sharper and slightly worse**, and we now have
*indexation* evidence to go with the *uniqueness* evidence.

---

## 1. Indexation reality check — the supply/demand gap is real

**No Google Search Console credentials exist in the repo** (`grep` for `searchconsole|webmasters|GSC_` →
nothing; `tools/` has no Google service account). The authoritative "Discovered – not indexed" count therefore
**cannot** be pulled programmatically. If the user wires a GSC service-account JSON + the
`searchconsole.searchanalytics`/`urlInspection` scopes, this becomes a one-command report — flagged as a
follow-up.

**Substitute: live `site:` index proxy (2026-05-30).** Four queries against the public index:

| Query | Distinct URLs surfaced |
|---|---|
| `site:signals.gitdealflow.com` | 3 (`/`, `/citations`, `/blog/signal-of-the-week-2026-05-04`) |
| `site:signals.gitdealflow.com showdown` | 0 showdown pages |
| `site:signals.gitdealflow.com signal OR fund OR define OR sector` | 0 entity pages |
| `site:gitdealflow.com` (both hosts) | 4 total (apex home + the 3 above) |

**Caveat (honest):** `site:` is US-only here, a single-engine snapshot, and famously undercounts — this is
*directional*, not a census. But the direction is unambiguous and it corroborates the uniqueness finding:
**the ~4,142-URL sitemap is almost entirely not surfacing.** Only the genuinely unique, link-worthy pages
(home, `/citations`, the dated blog post) appear. Zero pages from the 1,582-page `/showdown` family — exactly
what you'd expect Google to do with near-duplicate scaled content.

**Live sitemap footprint (verified 2026-05-30):** 4,142 URLs across 6 sub-sitemaps —
core 218 · high-intent 15 · **sectors 2,090** · crossings 50 · startups 691 · content 1,078.

> **Conclusion:** technical readiness is ~100× ahead of actual indexation. Adding more pages or more schema
> moves nothing. The binding constraints are (a) too many near-duplicate URLs diluting crawl budget, and
> (b) near-zero off-page authority telling Google the domain is worth deep-crawling.

---

## 2. Refreshed thin-page quantification (re-ran the gate today)

`npm run audit:pseo` against the current corpus (companies 159, showdown 1,582 — both grown since the
05-28/29 reports):

**Gated editorial tier — still clean ✅**

| Surface | Entries | Near-dup |
|---|---:|---:|
| compare / alternatives / use-cases / vs / niche-down / from-stars-to-seed / build-vs-invest / solo-founder-tracker / community-signal | **397** | **0 (0.0%)** → build gate **PASS** |

**Observational (report-only, NOT build-gating) — worse than the 05-28 snapshot**

| Family | Entries | Flagged | % | Notable |
|---|---:|---:|---:|---|
| `/signal/[slug]` | 159 | 79 | **49.7%** | `astro ≈ asana` 93.8% |
| `/showdown/[slug]` | **1,582** | **1,582** | **100%** | now includes **exact** dups: `huggingface-vs-lovable ≈ continue-vs-prisma` (sim 100%, hamming 0) |
| `/sector/[slug]/in/[city]` | 97 | 39 | 40.2% | `developer-tools/in/sf ≈ infrastructure/in/sf` 96.9% |
| **Combined** | **1,838** | **1,700** | **92.5%** | up from 88% / 1,076 on 05-28 |

**What changed since 05-29:** showdown grew 865 → 1,582 and now contains **hamming-0 exact duplicates** (pages
that are byte-equivalent to a sibling after name-substitution). This is the single highest-risk surface for a
Google *scaled content abuse* algorithmic suppression or manual action. The cell-suppression discipline on the
*Cartesian* routes is good (coverage audit: 54.3% of stage×sector / signal×sector cells suppressed at
`MIN_PSEO_CELL_SIZE=3`) — the problem is **not** the Cartesian families; it's the un-gated *entity cascade*
built on `content/companies.ts` templated prose.

### Recommended remediation (unchanged from 05-29 — still a user decision, NOT executed here)

This was explicitly reserved as a product/content call in the 05-29 doc and affects ~1,600 live URLs, so I did
**not** unilaterally apply it. Ranked by ROI:

1. **`noindex` the thinnest `/showdown` leaves NOW** (cheap insurance vs a scaled-content demotion; fully
   reversible; keeps them for internal-link + agent value, removes them from the search index). Implementation
   sketch: add a `robots: { index: false }` branch in `app/showdown/[slug]/page.tsx generateMetadata` gated on
   the uniqueness report's flagged set, or a blanket `noindex` on the whole family. **Say the word and I'll
   ship it as a reversible PR.**
2. **Rewrite `companies.ts` per-entity prose** so `/signal` (and everything downstream — `/showdown`, `/vs`,
   `/compare`, `/fund/portfolio`, `/sector`, `/city`, `/acquirer`) carries genuinely company-specific narrative.
   Highest value, highest effort.
3. **`canonical` thin pairs → richer hub** so equity consolidates instead of self-competing.

> Until (1) or (3) ships, off-page link building to the entity cascade is **wasted spend** — you'd be pointing
> authority at URLs the index is actively discounting. Fix indexation first, *then* build links. That ordering
> is the whole point of this memo.

---

## 3. Authority / backlink plan (anonymity-compatible)

The composite score's ceiling is off-page authority + E-E-A-T as an anonymous, pre-revenue entity. We cannot
use a named founder, Product Hunt, HN, IndieHackers, Reddit, or personal LinkedIn (per standing anonymity
rules). So the plan leans on levers where **the data/artifact is the author, not a person.**

Sequencing matters: **Phase 0 must precede Phase 1+** or links land on discounted pages.

### Phase 0 — Make pages worth linking to (Weeks 1–2) — *prerequisite*
- [ ] Ship `noindex`/canonical on the `/showdown` near-dup family (remediation #1 above). Reclaims crawl budget
      for the ~400 unique editorial pages + entity hubs that *can* rank.
- [ ] Confirm the ~400-page unique core is fully indexed via the `site:` proxy weekly until coverage climbs.
- [ ] Set `news-sitemap.xml` `lastmod` to real publish timestamps (currently request-time `new Date()` — a
      crawl-trust smell). 05-29 rec #7.

### Phase 1 — "The data is the author" digital PR (Weeks 2–8) — *highest authority, anonymity-safe*
The SSRN paper + Zenodo dataset are the strongest assets a faceless brand has: a citable artifact with a DOI.
- [ ] **Google Dataset Search**: the DCAT-3 descriptor already exists at `/.well-known/dataset.json` — confirm
      it's discovered; if not, submit the dataset sitemap. Dataset Search citations are durable authority.
- [ ] **Papers With Code / OpenAlex / Semantic Scholar**: ensure the SSRN paper + dataset are linked as
      artifacts. We already emit `ScholarlyArticle` + reciprocal `sameAs` — verify the inbound side exists.
- [ ] **Data-drop pitches to newsletters** (Sacra, Lenny's, CB Insights briefings, The Generalist, Newcomer):
      offer the weekly ranked dataset as a guest "data drop" with a single attribution link to the methodology
      page. The link is to *data*, not a person — fully anonymity-compatible. 1 placement here > 50 directory
      links.
- [ ] **One quarterly "State of Engineering Velocity" report** (content/`state-of-engineering-velocity.ts`
      already exists) with one genuinely shareable stat, pitched to fintech/VC data journalists. Original-data
      reports are the most link-attractive format that needs no named author.

### Phase 2 — Resource-page + directory link building (Weeks 2–10) — *operationalize what exists*
The target list already exists in [`tier5-link-building/resource-page-targets.md`](./tier5-link-building/resource-page-targets.md)
(14 Tier-A pages) and [`ai-directory-submissions.md`](./ai-directory-submissions.md). It's a backlog, not a
campaign — turn it into one:
- [ ] Run the warmed Zoho outbound at **3–5 pitches/day**, Tier-A first (Growth Equity Interview Guide,
      Visible.vc, Affinity AI-tools, AlternativeData.org, Qubit Capital ×2, Papermark). Angle = "free
      GitHub-signal layer that complements your PitchBook/Crunchbase entry."
- [ ] 10–14 day wait, single follow-up, then drop. Track outcomes in the same doc.
- [ ] Finish the AI-tool directory checklist + any awesome-list PRs still open (cross-fork PR limitation noted
      in memory — ship branches, surface compare URLs for 1-click submit).

### Phase 3 — Embed-driven organic backlinks (ongoing) — *unique, under-used lever*
The `/embed/*` widgets (define cards, calculators, mini-leaderboard) set `frame-ancestors *` + `embed.js` and
bake CC BY 4.0 attribution into the asset. Every embed = a natural backlink.
- [ ] Add a one-line "Embed this" copy-button to each `/define/[term]`, `/tools/[slug]`, and the weekly
      leaderboard, with the `<iframe>` + attribution pre-filled.
- [ ] Seed the calculators into 5–10 operator/founder blogs and newsletter issues (Substack/Ghost/Notion) where
      a runway/CAC/dilution calc is contextually useful. Each embed carries a followed attribution link.

### E-E-A-T without identity (continuous)
- Keep leaning on the entity graph (ORCID `0009-0002-2222-4112`, Wikidata `Q139376302`, DOI, reciprocal
  `rel=me`) — this is the substitute for a personal brand and it's already strong (Entity SEO 97).
- Every claim → methodology link (already done) is the trust moat; protect it.
- The one thing that would move E-E-A-T most (05-29 rec #5): **≥1 independent third-party citation** of the
  SSRN paper or dataset. Phase 1 is designed to manufacture exactly that.

---

## Scorecard delta vs 05-29

| Discipline | 05-29 | 05-30 | Why |
|---|---:|---:|---|
| pSEO | 85 | **83** | showdown grew to 1,582 w/ exact (hamming-0) dups; observational near-dup 88% → 92.5% |
| EEAT / Authority | 88 (on-page) / 42 (off-page) | **42** | indexation proxy confirms near-zero organic surface; unchanged until Phase 1 lands a citation |
| Everything else | — | = | no drift; technical/AEO/GEO/schema/discoverability remain elite |
| **Composite** | ≈90 | **≈88** | the cap is now *evidenced*, not just asserted: indexation + uniqueness both measured |

**Bottom line:** stop building pages and schema (diminishing-to-negative returns). The next real point of
composite score comes from, in strict order: (1) prune the near-dup cascade out of the index, (2) operationalize
the existing link-building backlog, (3) manufacture one independent citation via a data-drop. None of it
requires shedding anonymity.

---

## Artifacts regenerated this pass
- `pseo-site/data/audit/pseo-uniqueness-report.json` — re-run 2026-05-30 (current corpus).
- `pseo-site/data/audit/pseo-coverage-report.json` — re-run 2026-05-30.

## Open follow-ups requiring a user decision / credential
- **GSC service account** → unlocks the real Discovered-not-indexed report (replaces the `site:` proxy).
- **`noindex` the showdown cascade** → reversible PR ready on request (remediation #1).
