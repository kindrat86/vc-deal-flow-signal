# pSEO Thin-Page Analysis — 2026-05-28

**Purpose:** Non-destructive companion to `seo-geo-aeo-audit-2026-05-28.md`, recommendation #3 ("thin-page sweep"). This report *quantifies* thin-content exposure across the programmatic page families and produces a prioritized watch-list. **It does not de-index or delete anything** — pruning/`noindex` decisions are the owner's call. The goal is to replace the audit's worst-case framing with measured reality.

---

## Headline: the worst-case risk is already mitigated

The 2026-05-28 audit flagged "scaled content abuse" (Google's March 2024 spam policy) as the ceiling on the pSEO score, because a 5,000+ URL templated footprint built on one data engine is the canonical risk pattern. **Inspecting the generators shows the project already implements the exact defense that audit recommended** — a minimum-cell-size gate — on the families with the largest combinatorial blast radius.

`lib/data.ts`:
```ts
export const MIN_PSEO_CELL_SIZE = Number(process.env.PSEO_MIN_CELL_SIZE ?? 3);
// "...generous enough that we keep ~95% of the existing surface area."
```

This threshold gates **three** families — a page is only generated if the cell holds ≥3 real startups:

| Family | Gate | Source |
|---|---|---|
| `/stage/[slug]/[sector]` | `matchCount >= MIN_PSEO_CELL_SIZE` | `getAllStageSectorPairs` |
| `/signals/[slug]/[sector]` | `matching.length >= MIN_PSEO_CELL_SIZE` | `getSignalSectorData` |
| `/startup/[slug]/[period]` (cohort) | `startups.length >= MIN_PSEO_CELL_SIZE` | `lib/data.ts:1133` |

And `/sector/[slug]/in/[city]` is gated by **real data**, not a blind 17×43 = 731 cross-product:
```ts
// getAllSectorCityPairs — emit only if there's an editorial match OR a real HQ company
if (editorialMatch || hqMatch) pairs.push({ sector, city });
```

**Conclusion:** the combinatorial families (the ones that could explode into thousands of near-empty cells) are data-gated. The recent commit history corroborates this is enforced live ("+39 pages from HQ data," "cascades to +259 pages" — i.e. pages appear *because* data was added, not from cross-products). I'm revising the practical scaled-content risk **down** from the audit's worst case. The residual risk is narrower and named below.

---

## Fan-out cardinality (measured)

| Corpus | Records | Drives | Gated by data threshold? |
|---|--:|---|:--:|
| `sectors.ts` | 17 | `/sector/[slug]` + all crossings | n/a (base axis) |
| `cities.ts` | 43 | `/city/[slug]`, `/sector/in/city` | ✅ (editorial/HQ) |
| `niches.ts` | 72 sectors / **72 subniche pairs** | `/niche-down/[sector]/[subniche]` | ❌ curation only |
| `companies.ts` | 88 | `/startup/[slug]`, location crossings | partial |
| `funds.ts` | 49 | `/fund/[slug]` + `/portfolio` | curation |
| `acquirers.ts` | 24 | `/acquirer/[slug]` | curation |
| `comparisons.ts` | 56 | `/compare/[slug]`, `/vs/[slug]` | ❌ curation only |
| `alternatives.ts` | 14 | `/alternatives/[slug]` | ❌ curation only |
| `from-stars-to-seed.ts` | 50 | `/from-stars-to-seed/[slug]` | ❌ curation only |
| `build-vs-invest.ts` | 22 | `/build-vs-invest/[sector]` | ❌ curation only |
| `use-cases.ts` | 14 | `/use-cases/[slug]` | ❌ curation only |
| `community-signal.ts` | 14 | `/community-signal/[slug]` | ❌ curation only |
| `solo-founder-tracker.ts` | 22 | `/solo-founder-tracker/[sector]` | ❌ curation only |
| `glossary.ts` | 115 | `/define/[term]`, `/embed/define` | curation |
| `posts.ts` | 29 | `/blog/[slug]` | n/a (articles) |
| `locale-topics.ts` (`LOCALE_TOPICS`) | explicit list | `/[locale]/[topic]` | ✅ explicit curation, not locale×topic cross-product |

Stage/signal/startup-cohort families: counts are *dynamic* (depend on the weekly snapshot) and **gated** by `MIN_PSEO_CELL_SIZE`, so they self-prune as data shifts.

---

## Where residual thin-content risk actually lives

Two categories, neither catastrophic:

**1. Curation-gated editorial corpora (the ❌ rows above).**
These are hand-written, so per-page *depth* is presumably real — but there is no *quantitative* gate, so quality depends entirely on the author not shipping template-dominant pages. The highest-volume members to spot-check: `niche-down` (72), `comparisons` (56), `from-stars-to-seed` (50), `build-vs-invest` (22), `solo-founder-tracker` (22). Risk signature: pages where >70% of rendered tokens are boilerplate shared across siblings, with only the title/slug/one paragraph varying.

**2. i18n duplication (`/[locale]/[topic]`).**
Mitigated correctly: the template emits `hreflang` with `x-default` → the English canonical (`lib/hreflang.ts`, confirmed in source). So localized variants are declared as translations, not duplicate English content. Watch item only if any locale page is auto-translated boilerplate with no localized substance — that reads as doorway content regardless of hreflang.

---

## Recommended next step (non-destructive, data-driven)

Rather than prune by guesswork, **instrument** the thinness so any pruning is evidence-based:

1. **Build-time thinness probe.** Add a dev/CI script that renders each generated leaf to text and computes, per page: (a) total visible tokens, (b) tokens unique to that page vs. the family's shared template, (c) count of distinct structured-data points (table rows, list items, schema fields). Emit a CSV sorted ascending by unique-token ratio.
2. **Flag, don't cut.** Surface the bottom decile per family. A human (or a follow-up session with explicit sign-off) decides per family whether to (i) enrich, (ii) `noindex, follow` (keep for internal linking, drop from index), or (iii) consolidate into a parent hub.
3. **Extend the existing gate.** The cleanest lever already exists: generalize the `MIN_PSEO_CELL_SIZE` pattern to the curation-gated families that have a countable backing (e.g. require ≥N comparison data points for a `/compare/[slug]` to render). This keeps the defense in code, where the audit found it works.

**No index/robots changes are made by this report.** If you want, a follow-up can implement the build-time thinness probe (read-only, safe) and bring back the ranked CSV for a pruning decision.

---

## Effect on the audit score

pSEO stays at **96** — but the *reason* shifts. It was capped at 96 by unquantified scaled-content risk; that risk is now measured and largely mitigated in code for the combinatorial families. The remaining −4 is the curation-gated editorial corpora lacking a quantitative gate (category 1 above), not the data crossings. Net confidence in the 96 is **higher** after this analysis, not lower.

*Generated 2026-05-28. Read-only analysis — no production or index changes.*
