# Build spec — `/language/[lang]-startups`

> Concrete implementation plan for Tier 1 #1 of the Greg Isenberg pSEO memo.
> Authored so the team can approve / reject in 5 minutes before any code lands.
>
> Date: 2026-05-28
> Branch: `claude/pseo-page-suggestions-O4oS3` (same PR as the memo)
> Status: Awaiting decision — Do not implement yet.

---

## What this template does

Renders one SSG'd page per programming language, ranking the GitHub-tracked
companies whose `publicSignal.languageBias` includes that language by their
sector + momentum data. Targets long-tail queries like
"Rust startups to watch 2026", "Go startups by GitHub activity",
"Python AI startups".

## Data — what's already there

- `content/companies.ts` → every `Company` has
  `publicSignal.languageBias: string` (e.g. `"Python / Rust"`).
- Splitting on ` / ` yields **14 distinct languages** with enough companies
  to power a ranked list:

  C, C++, Clojure, Elixir, Go, Java, Kotlin, Python, Ruby, Rust, SQL, Swift,
  TypeScript, Zig

  (SQL skews to data infra; Zig and Clojure are thin — start with the
  top 10 by count.)

- No new fields needed on `Company`. No `lib/data.ts` changes.

## Slug convention

| Language | Slug |
|---|---|
| Rust | `rust` |
| Go | `go` |
| TypeScript | `typescript` |
| Python | `python` |
| Java | `java` |
| Ruby | `ruby` |
| C | `c` |
| C++ | `cpp` |
| Clojure | `clojure` |
| Elixir | `elixir` |
| Kotlin | `kotlin` |
| Swift | `swift` |
| SQL | `sql` |
| Zig | `zig` |

Lowercase, no spaces, `cpp` instead of `c++` to match common SEO precedent
(e.g. "cpp startups" gets more traffic than the URL-encoded "c++").

## Route

```
pseo-site/app/language/[slug]/page.tsx
```

Net-new, no collisions in the existing route tree.

## Page module shape (mirror `/sector/[slug]`)

- `generateStaticParams()` → enumerate the 14 language slugs.
- `dynamicParams = false` (same as `/sector/[slug]`).
- `revalidate = 604800` (weekly).
- `generateMetadata()` → title, description, canonical, OG, Twitter — pulls
  copy from a new `content/languages.ts` (10-line schema).
- JSON-LD `@graph` with `WebPage` + `ItemList` + `BreadcrumbList` (no
  `Organization` per item — those live on `/signal/[slug]`; link out
  instead).

## New content file — `content/languages.ts`

Single small file. ~120 lines for all 14 entries.

```ts
export interface LanguageHub {
  slug: string;
  language: string;         // canonical display, e.g. "Rust", "C++"
  aliases: string[];        // match tokens against company `lang` field
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;            // ~120 words, Data Nerd voice
  whyItMattersNow: string;  // ~80 words
  relatedSlugs: string[];   // 3 sibling language slugs for internal links
  relatedSectors: string[]; // 2-3 sector slugs that over-index in this lang
}
```

Static copy per language. Live data (the ranked startup list) is computed
at build time by filtering `companies` against `aliases`.

## Component reuse

- `StartupTable` (already exists, used by `/best/[slug]`)
- `CTABanner` (already exists)
- `AgentMirrorLinks`, `HreflangLinks` (already exists)
- `AgentSummary` (already exists)

No new components. Page composes the existing primitives.

## Internal-linking rules for this template

Per the memo's internal-linking architecture section, each page emits:

- 1 link to `/sector/[slug]` for each of its `relatedSectors`
- 1 link to `/signal/[slug]` for each ranked startup
- 1 link to `/answers/<related question>` (e.g. "is Rust replacing Go in
  startups?")
- "Other languages" footer row with 3 sibling languages

Add `language` → 3 sibling-language anchors to `lib/internal-links.ts` (the
helper I proposed in the memo — also not yet built).

## Sitemap + hreflang

- Add the 14 URLs to `app/sitemap.ts` (or whatever the equivalent is in this
  Next.js 16 build; needs verification — see Open questions below).
- `HreflangLinks` already covers `en` / locale variants automatically; no
  action.

## Acceptance criteria

1. 14 routes render `200 OK` at `/language/{slug}` with unique title +
   description.
2. Each page lists ≥3 ranked companies. Languages with <3 matches are
   excluded from `generateStaticParams`.
3. Each page passes the existing `.pa11yci.json` accessibility config.
4. JSON-LD validates (no schema warnings in Rich Results Test).
5. Routes appear in `sitemap.xml` and `news-sitemap.xml` is unaffected.
6. Lighthouse score parity with `/sector/[slug]` (±5 points).

## Open questions for the team

1. **URL pattern** — proposed `/language/[slug]`, NOT
   `/language/[slug]-startups`. The Greg memo says
   `/language/[lang]-startups`. The shorter form is cleaner; do you have a
   preference for matching the original proposal exactly?
2. **Top-10 vs all 14?** Drop `c`, `clojure`, `zig`, `sql` from v1 to keep
   the average page quality high. Ship the 10 with strong corpora first.
3. **Static copy generation** — can a separate copy-writing pass produce
   the 14 intros, or should I draft them in the Data Nerd voice on the
   same PR?
4. **Live signal join** — the seed corpus uses static `momentum` placeholders.
   Do we want the v1 `/language` page to defer to the same placeholders,
   or block on `lib/data.ts` integration first? Recommendation: ship with
   placeholders to unblock; do the live join in a follow-up PR.

## Effort estimate

- Spec sign-off: 5 min
- `content/languages.ts` (10 entries with copy): 90 min
- Route module mirroring `/sector/[slug]`: 60 min (plus 30 min of
  Next.js-16-specific verification per `pseo-site/AGENTS.md`)
- Sitemap + JSON-LD validation: 20 min
- Total: ~3.5 hours from green light to first PR review

## Why this and not Tier 1 #2 (`/framework/[name]-startups`) first

`/language` has zero new data dependencies. `/framework` needs detection
logic against `package.json`, `requirements.txt`, etc. — that's a separate
ingest spike. Ship `/language` first to prove the template; reuse the
template for `/framework` once detection lands.

---

**Decision needed:** OK to implement on this branch, or split to a fresh
branch / hold for triage?
