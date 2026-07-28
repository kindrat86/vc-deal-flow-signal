# HERMES TASK — signals.gitdealflow.com: Internal Link Engine (pSEO PageRank distribution)

> **Runbook for:** Hermes Agent running DeepSeek v4 Pro
> **Mode:** AUTONOMOUS — build, validate, commit, deploy without human intervention, subject to the fail-safes in §1. If a fail-safe trips, STOP and report; do not force.
> **Repo:** `~/signals-gitdealflow/pseo-site` (Next.js **16**, React **19**, App Router, TypeScript, ~75 pSEO route types, thousands of deep pages)
> **Author of runbook:** Claude (2026-07-21), grounded in a live audit.

---

## 0. What you are building and why

signals.gitdealflow.com is the most SEO/AEO-mature site in the portfolio: it already has IndexNow, WebSub, RSS, `llms.txt`, `agents.txt`, `model.json`, speakable verification, schema-sweep, and pSEO uniqueness/coverage audits. Adding more of those does nothing.

The **one measurable gap**: with ~75 pSEO route types and thousands of deep pages, contextual internal linking is applied to only **2 route types** (`RelatedLinks` is imported in 2 files). The codebase's own `components/CrossAxisNav.tsx` documents the cost of this:

> *"Yandex's 2026-05-02 recheck flagged sector pages as 'low-value' because they only linked along the sector axis…"*

That single-axis / near-orphan under-linking almost certainly persists across the other 70+ route types. For a large pSEO site, **internal-link architecture is the highest-leverage reliable organic lever**: it distributes PageRank, gets deep pages out of "crawled – currently not indexed," and lets long-tail pages actually rank. You will build an **Internal Link Engine** that:

1. Generates a site-wide **related-links graph** from the site's own sitemaps (so every URL is real — nothing invented).
2. Ships a reusable helper + a new **`/explore` hub** (pillar page + crawl hub linking to deep pages).
3. (Gated Phase 2) Wires the existing `RelatedLinks` component into the highest-value under-linked page templates.

---

## 1. 🚨 HARD GUARDRAILS + FAIL-SAFES — READ FIRST

### 1a. The blank-screen landmine (site-killer).
- This site enforces a CSP `require-trusted-types-for 'script'`. A Trusted-Types default policy is registered **inline in `app/layout.tsx`** (around line 174). If it is removed/altered, or if any script assigns `innerHTML`/`document.body.prepend`, **the entire site renders BLANK** (React hydration wipe).
- **DO NOT** edit `app/layout.tsx`, the CSP in `next.config.ts`, or add any `ux.js`-style DOM-manipulating script. A prior incident blank-screened the site by injecting `ux.js` into the layout.
- **`curl` returns 200 on a blank site** (SSR HTML is present; hydration wipes it client-side). A curl check is NOT sufficient verification — see §7 render check.

### 1b. NEVER fabricate.
- Every URL in the link graph must come from the site's **own sitemaps** (real, canonical URLs). Do not hand-write or guess URLs/slugs.
- Link labels must be derived from the URL/slug or the sitemap — no invented page titles, stats, or descriptions.

### 1c. Foreign working-tree changes — CLEAN-TREE DEPLOY GATE.
- The working tree currently has **uncommitted changes you did not make** (likely the Hermes SEO swarm, which deploys this site independently). `git status` will show modified `app/layout.tsx`, `app/page.tsx`, `components/*`, etc.
- **You must not deploy those foreign changes.** Rule:
  - Do all your work on a dedicated branch and `git add` **only the files you create/edit** (listed in §Definition of done).
  - **Deploy autonomously ONLY IF** `git status --porcelain` shows no modified tracked files other than the ones this task touches. If foreign modified files are present, **commit your additive files to a branch, push nothing, and STOP with a report** ("deploy deferred: foreign uncommitted changes present"). Building/deploying from a dirty tree would ship someone else's half-finished work.

### 1d. Deploy is alias-pinned + archive-required.
- The prebuilt artifact has 25,000+ files, so plain upload fails — the canonical deploy (`scripts/deploy-prod.sh`) uses `vercel deploy --prebuilt --prod --archive=tgz`. Use `npm run deploy:prod`, never a raw `vercel deploy`.
- The live domain `signals.gitdealflow.com` may be **alias-pinned** (not auto-following prod). After deploy you MUST verify the live domain serves the new build and, if not, run `vercel alias set <deployment-url> signals.gitdealflow.com` (§7).

### 1e. Build integrity.
- `npm run typecheck` (`next typegen && tsc --noEmit`) and `npm run build` (or `vercel build`) MUST pass before any deploy. This site has strict TS. Any file you add must typecheck.
- Additive-first: Phase 1 adds only new files + one sitemap-list edit. Phase 2 edits page templates one at a time behind a per-file typecheck gate with immediate revert on failure.

### 1f. Idempotency.
- Re-running the whole task must not duplicate files, routes, or sitemap entries.

---

## 2. Deliverable A — `data/internal-links.json` (committed stub)

First create the file so the TypeScript import always resolves (the generator overwrites it):
```bash
cd ~/signals-gitdealflow/pseo-site
echo '{}' > data/internal-links.json
```

---

## 3. Deliverable B — generator `scripts/build-internal-links.ts`

Create exactly. It reads the site's own sitemaps (source of truth for real URLs), clusters URLs by path section, computes related groups by slug-token overlap, and writes `data/internal-links.json`. Self-contained; run with `npx tsx`.

```ts
#!/usr/bin/env npx tsx
/**
 * build-internal-links.ts — generates the pSEO internal-link graph for
 * signals.gitdealflow.com from the site's OWN sitemaps (every URL is real).
 *
 * Output: data/internal-links.json  ->  { [pathname]: RelatedGroup[] }
 * Consumed by lib/related-links.ts + the /explore hub + (Phase 2) page templates.
 *
 * Fail-safe: aborts if it can't collect a meaningful URL set.
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const BASE = process.env.LINKS_BASE || "https://signals.gitdealflow.com";
const SITEMAP_IDS = ["core", "high-intent", "sectors", "crossings", "startups", "content"];

interface Link { href: string; label: string }
interface RelatedGroup { title: string; links: Link[] }

// ---- collect real URLs from the site's sitemaps ----------------------------
async function fetchText(url: string): Promise<string | null> {
  try {
    const r = await fetch(url, { headers: { "User-Agent": "gdf-linkgraph" } });
    if (!r.ok) return null;
    return await r.text();
  } catch { return null; }
}
function extractLocs(xml: string): string[] {
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

const allUrls = new Set<string>();
for (const id of SITEMAP_IDS) {
  const xml = await fetchText(`${BASE}/sitemap/${id}.xml`);
  if (!xml) { console.warn(`  (skip sitemap ${id})`); continue; }
  for (const loc of extractLocs(xml)) if (loc.startsWith(BASE)) allUrls.add(loc);
}
// also try the flat sitemap.xml as a fallback source
const flat = await fetchText(`${BASE}/sitemap.xml`);
if (flat) for (const sm of extractLocs(flat)) {
  if (sm.endsWith(".xml")) { const x = await fetchText(sm); if (x) for (const l of extractLocs(x)) if (l.startsWith(BASE)) allUrls.add(l); }
}

const urls = [...allUrls];
if (urls.length < 100) {
  console.error(`FAIL: only ${urls.length} URLs collected from sitemaps (<100). Is the site up? Not writing.`);
  process.exit(1);
}

// ---- helpers ---------------------------------------------------------------
const pathOf = (u: string) => { try { return new URL(u).pathname.replace(/\/$/, "") || "/"; } catch { return "/"; } };
const sectionOf = (p: string) => (p === "/" ? "home" : p.split("/").filter(Boolean)[0]);
const tokensOf = (p: string) =>
  new Set(p.toLowerCase().split(/[^a-z0-9]+/).filter((t) => t.length > 2 && !["the", "and", "for", "vs", "www", "com"].includes(t)));
const titleCase = (slug: string) =>
  slug.split("/").filter(Boolean).pop()!.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()).replace(/\bVs\b/g, "vs");

const paths = [...new Set(urls.map(pathOf))].filter((p) => p !== "/" && !p.endsWith(".xml") && !p.endsWith(".txt") && !p.endsWith(".json"));
const bySection = new Map<string, string[]>();
for (const p of paths) { const s = sectionOf(p); (bySection.get(s) || bySection.set(s, []).get(s)!).push(p); }

const tokenCache = new Map<string, Set<string>>();
const toks = (p: string) => tokenCache.get(p) || tokenCache.set(p, tokensOf(p)).get(p)!;
function overlap(a: string, b: string): number {
  const ta = toks(a), tb = toks(b); let n = 0; for (const t of ta) if (tb.has(t)) n++;
  return n / Math.max(1, Math.min(ta.size, tb.size));
}

// ---- build graph -----------------------------------------------------------
const graph: Record<string, RelatedGroup[]> = {};
const MAX_PER_GROUP = 6;

for (const p of paths) {
  const section = sectionOf(p);
  const groups: RelatedGroup[] = [];

  // Group 1 — siblings in the same section, ranked by token similarity
  const siblings = (bySection.get(section) || [])
    .filter((q) => q !== p)
    .map((q) => ({ q, score: overlap(p, q) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_PER_GROUP)
    .filter((x) => x.score > 0);
  if (siblings.length >= 2)
    groups.push({ title: `More in ${titleCase("/" + section)}`, links: siblings.map((x) => ({ href: x.q, label: titleCase(x.q) })) });

  // Group 2 — cross-section pages sharing slug tokens (semantic neighbors)
  const cross = paths
    .filter((q) => q !== p && sectionOf(q) !== section)
    .map((q) => ({ q, score: overlap(p, q) }))
    .filter((x) => x.score >= 0.34)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_PER_GROUP);
  if (cross.length >= 2)
    groups.push({ title: "Related topics", links: cross.map((x) => ({ href: x.q, label: titleCase(x.q) })) });

  // Group 3 — always offer a path up to the section hub + explore
  const hub: Link[] = [];
  if (paths.includes(`/${section}`)) hub.push({ href: `/${section}`, label: `All ${titleCase("/" + section)}` });
  hub.push({ href: "/explore", label: "Explore all signals" });
  groups.push({ title: "Browse", links: hub });

  if (groups.some((g) => g.links.length > 0)) graph[p] = groups;
}

writeFileSync(join(process.cwd(), "data/internal-links.json"), JSON.stringify(graph, null, 0));
console.log(`✓ internal-links: ${Object.keys(graph).length} pages linked, from ${urls.length} sitemap URLs across ${bySection.size} sections.`);
```

Run it:
```bash
cd ~/signals-gitdealflow/pseo-site
npx tsx scripts/build-internal-links.ts
```
Expected: `✓ internal-links: <N> pages linked, from <M> sitemap URLs…`. If it prints `FAIL:` (site unreachable / <100 URLs), STOP — do not proceed with an empty graph.

---

## 4. Deliverable C — helper `lib/related-links.ts`

```ts
import graph from "@/data/internal-links.json";

export interface RelatedLink { href: string; label: string; subtitle?: string }
export interface RelatedGroup { title: string; links: RelatedLink[] }

const GRAPH = graph as Record<string, RelatedGroup[]>;

/** Related-link groups for a given pathname (no trailing slash). Safe on miss. */
export function getRelatedGroups(pathname: string): RelatedGroup[] {
  const key = pathname.replace(/\/$/, "") || "/";
  return GRAPH[key] ?? [];
}

/** Flat section index for hub pages: { section: pathnames[] }. */
export function getLinkSections(): Record<string, string[]> {
  const out: Record<string, string[]> = {};
  for (const p of Object.keys(GRAPH)) {
    const section = p.split("/").filter(Boolean)[0] || "home";
    (out[section] ||= []).push(p);
  }
  return out;
}
```

---

## 5. Deliverable D — `/explore` hub (`app/explore/page.tsx`)

A new additive route: a pillar/crawl-hub page linking to deep pages by section. Additive — cannot break existing routes. Match the site's Tailwind dark theme.

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { getLinkSections } from "@/lib/related-links";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title: "Explore GitHub Startup Signals — Sectors, Stages, Trends & More | GitDealFlow",
  description:
    "Browse every GitDealFlow signal view: sectors, funding stages, signal types, trends, comparisons, and research. Real GitHub engineering-activity signals across venture-backed startups.",
  alternates: { canonical: "/explore" },
  openGraph: { title: "Explore GitHub Startup Signals", description: "Browse every GitDealFlow signal view.", url: `${SITE}/explore`, type: "website" },
};

const SECTION_TITLES: Record<string, string> = {
  topics: "Topics", vs: "Comparisons", research: "Research", define: "Definitions",
  fund: "Funds", acquirer: "Acquirers", founder: "Founders", city: "Cities",
  continuity: "Continuity", answers: "Answers", sectors: "Sectors",
};
const titleCase = (s: string) => s.replace(/[-_/]/g, " ").trim().replace(/\b\w/g, (c) => c.toUpperCase());

export default function ExplorePage() {
  const sections = getLinkSections();
  const ordered = Object.entries(sections)
    .filter(([, ps]) => ps.length > 0)
    .sort((a, b) => b[1].length - a[1].length);

  const itemList = {
    "@context": "https://schema.org", "@type": "CollectionPage",
    name: "Explore GitHub Startup Signals", url: `${SITE}/explore`,
    hasPart: ordered.map(([sec]) => ({ "@type": "WebPage", name: SECTION_TITLES[sec] || titleCase(sec), url: `${SITE}/${sec}` })),
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <h1 className="text-3xl font-bold text-gray-100 mb-2">Explore GitHub startup signals</h1>
      <p className="text-slate-400 mb-8 max-w-2xl">
        Every view into GitDealFlow&apos;s real GitHub engineering-activity signals — by sector, stage, signal type, trend,
        comparison, and research. Pick a thread and follow it.
      </p>
      {ordered.map(([sec, ps]) => (
        <section key={sec} className="mb-10">
          <h2 className="text-lg font-semibold text-sky-400 uppercase tracking-wider mb-4">
            {SECTION_TITLES[sec] || titleCase(sec)} <span className="text-slate-600 normal-case">({ps.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
            {ps.slice(0, 60).map((p) => (
              <Link key={p} href={p} className="text-slate-300 hover:text-sky-300 text-sm truncate">
                {titleCase(p.split("/").filter(Boolean).slice(1).join(" ") || p)}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
```
> Note: `dangerouslySetInnerHTML` for JSON-LD is safe under the CSP (the Trusted-Types default policy in `layout.tsx` passes strings through; JSON-LD is data, not executed). This is the same pattern existing pages use.

**Add `/explore` to the sitemap.** Open `app/sitemap/[id]/page.tsx` (or wherever the `core` sitemap URL list is built — search: `grep -rn "high-intent\|/research\"\|CORE_" app/sitemap`) and add `"/explore"` to the core/static URL list. If the structure is unclear, instead confirm `/explore` is emitted by re-running the site's own sitemap generation; if not emitted, add it to the static list in the `core` sitemap route. Keep it to a one-line additive change.

---

## 6. VALIDATE (Phase 1) — all must pass

```bash
cd ~/signals-gitdealflow/pseo-site
# a) graph populated
node -e "const g=require('./data/internal-links.json');const n=Object.keys(g).length;if(n<100)throw'too few: '+n;console.log('✓ graph pages:',n)"
# b) typecheck (strict)
npm run typecheck
# c) production build succeeds (this also proves /explore compiles)
npx vercel build --prod   # or: npm run build
# d) /explore rendered in the build output (non-empty)
grep -rl "Explore GitHub startup signals" .vercel/output .next 2>/dev/null | head -1 || echo "check build output manually"
```
If typecheck or build fails, fix the file you added (do not touch layout/CSP). If you cannot make it green, revert your new files and STOP with a report. Never deploy a red build.

---

## 7. DEPLOY (Phase 1) — autonomous, with the alias dance + blank-screen check

**Clean-tree gate (§1c) first:**
```bash
cd ~/signals-gitdealflow/pseo-site
# List modified tracked files that are NOT yours:
git status --porcelain | grep '^ M' | grep -vE 'data/internal-links.json' || true
```
If that prints any file, **STOP**: commit your additive files to a branch and report "deploy deferred — foreign uncommitted changes present." Otherwise continue.

```bash
# Commit only your files
git checkout -b internal-link-engine
git add scripts/build-internal-links.ts lib/related-links.ts app/explore/page.tsx data/internal-links.json
# plus the one-line sitemap edit file, if you made it:
# git add app/sitemap/[id]/page.tsx
git commit -m "Add internal link engine + /explore hub"

# Confirm the Trusted-Types landmine is intact BEFORE building (must print a match):
grep -c "trustedTypes" app/layout.tsx    # must be >= 1

# Canonical deploy (archive-required; captures deployment URL)
DEPLOY_URL=$(npm run deploy:prod 2>&1 | tee /dev/stderr | grep -oE 'https://[a-z0-9-]+\.vercel\.app' | tail -1)
echo "Deployment: $DEPLOY_URL"

# --- Verify LIVE domain serves the new build AND is not blank ---
sleep 20
# 1) new content present at the live domain?
if ! curl -s "https://signals.gitdealflow.com/explore" | grep -q "Explore GitHub startup signals"; then
  echo "Live domain not updated — likely alias-pinned. Repointing alias…"
  vercel alias set "$DEPLOY_URL" signals.gitdealflow.com
  sleep 15
fi
# 2) blank-screen (hydration) check — curl is NOT enough. Use a headless render if available:
if command -v npx >/dev/null && npx --yes playwright --version >/dev/null 2>&1; then
  npx --yes playwright install chromium >/dev/null 2>&1 || true
  node -e "
    const { chromium } = require('playwright');
    (async () => {
      const b = await chromium.launch(); const pg = await b.newPage();
      await pg.goto('https://signals.gitdealflow.com/', { waitUntil: 'networkidle', timeout: 45000 });
      const txt = (await pg.evaluate(() => document.body.innerText || '')).trim();
      await b.close();
      if (txt.length < 200) { console.error('FAIL: homepage appears BLANK after hydration ('+txt.length+' chars). Possible Trusted-Types regression. INVESTIGATE — do not consider deploy healthy.'); process.exit(1); }
      console.log('✓ render check ok ('+txt.length+' chars of visible text)');
    })().catch(e => { console.error('render check error', e.message); process.exit(1); });
  " || echo "WARN: render check failed/unavailable — flag for manual screenshot of https://signals.gitdealflow.com/ (blank = Trusted-Types regression)."
else
  echo "WARN: no headless browser available — you did NOT touch layout/CSP, so blank-screen risk is low, but FLAG for a manual screenshot of the homepage to confirm it is not blank."
fi

# 3) new pages discoverable
curl -s "https://signals.gitdealflow.com/explore" | grep -c "Explore GitHub startup signals"   # expect 1
```
If the render check FAILS (blank), treat the deploy as unhealthy: report immediately. (You did not touch the layout, so this would indicate a pre-existing/foreign regression, not your change — flag it, don't try to "fix" the layout.)

---

## 8. Phase 2 (OPTIONAL, higher value, strictly gated) — wire RelatedLinks into deep pages

Only attempt after Phase 1 is green and deployed. This adds contextual internal links to under-linked page templates. Do it **one file at a time**, typechecking after each, reverting any that fail.

Target templates (highest value, currently under-linked). For **each** `PAGE` in this list:
`app/define/[term]/page.tsx`, `app/vs/[slug]/page.tsx`, `app/topics/[slug]/page.tsx`, `app/research/[slug]/page.tsx`, `app/acquirer/[slug]/page.tsx`, `app/continuity/[slug]/page.tsx`.

Mechanical edit per file:
1. Add imports at the top:
   ```ts
   import RelatedLinks from "@/components/RelatedLinks";
   import { getRelatedGroups } from "@/lib/related-links";
   ```
2. Inside the default-exported page component, after the page's `params` are resolved, compute the current pathname from the known route (e.g. for `define/[term]`: `const pathname = \`/define/${term}\`;`). Use the same slug variable the page already destructures.
3. Immediately before the component's closing `</main>` (or outermost closing wrapper tag), insert:
   ```tsx
   <RelatedLinks groups={getRelatedGroups(pathname)} heading="Related views" />
   ```
   `RelatedLinks` already returns `null` when there are no groups, so pages with no graph entry are unaffected.
4. Run the gate:
   ```bash
   npm run typecheck
   ```
   - **Pass** → keep the edit, move to the next file.
   - **Fail** → `git checkout -- <that file>` (revert only that file) and skip it. Do NOT spend time forcing it.
5. After all files: `npx vercel build --prod` must pass. Commit the ones that stuck: `git add <files> && git commit -m "Wire RelatedLinks into deep pSEO templates"`, then re-run the §7 deploy + verification block (alias + render check).

If Phase 2 causes any build/render trouble you can't cleanly resolve, revert Phase 2 entirely (`git reset --hard` to the Phase 1 commit) and ship Phase 1 only — it already delivers the graph + hub.

---

## 9. POST-DEPLOY

1. **Search Console + Bing:** request indexing on `/explore`; the site's postbuild already runs `submit-indexnow` + `submit-websub`, so new/changed URLs are pinged automatically on the next build.
2. **Weekly refresh:** add to a Hermes weekly task (the graph should track new pages):
   ```bash
   cd ~/signals-gitdealflow/pseo-site && npx tsx scripts/build-internal-links.ts && \
   git add data/internal-links.json && git commit -m "Refresh internal-link graph $(date +%F)" && npm run deploy:prod
   ```
   (Respect the clean-tree gate each time.)

---

## 10. Expected results (honest, mechanism-based — estimates, not guarantees)

**This is a crawl + PageRank-distribution play.** It doesn't add pages; it makes the thousands you already have discoverable and rankable.

| Effect | Mechanism | Realistic outcome | When |
|---|---|---|---|
| **Deep pages leave "crawled – not indexed"** | Every page gains ≥4–12 contextual inbound links from related pages + the `/explore` hub | More of the existing fleet gets indexed → more pages *eligible* to rank. Often the single biggest unlock for large pSEO sites | 3–8 weeks (crawl cycles) |
| **Escape "low-value / single-axis" flag** | Multi-axis internal links (the exact fix the codebase applied to sector pages, now generalized) | Pages the engines de-prioritized get re-evaluated upward | 4–10 weeks |
| **Ranking lift on already-indexed pages** | Internal links pass relevance + PageRank; anchor text reinforces topical relevance | Incremental position gains across the long tail; compounds as the graph densifies | 4–12 weeks |
| **`/explore` as a pillar** | A crawlable hub that itself targets head terms ("explore startup github signals") and funnels equity to spokes | New rankable page + faster discovery of everything it links | 2–6 weeks |

**Straight talk:**
- Internal linking raises the *ceiling* for pages that already have some authority; it won't rank a page with zero relevance. But for a site with thousands of thin-linked pages, getting them indexed and multi-axis-linked is exactly the lever that's been missing.
- Phase 1 alone (graph + `/explore`) is a real, safe win. Phase 2 (contextual in-content links) is where most of the PageRank-distribution value is — attempt it, but never at the cost of a red build.
- Measure in Search Console: watch **(a) Pages indexed** (Coverage), **(b) impressions on long-tail queries**, **(c) average position**. Compare 4-week windows. Indexed-count moves first.

---

## 11. Rollback
- Phase 1 is additive (new files + one sitemap line). Roll back: `git revert` the commit (or delete `app/explore/`, `lib/related-links.ts`, `scripts/build-internal-links.ts`, reset `data/internal-links.json` to `{}`), then `npm run deploy:prod` + alias verify.
- Phase 2: revert the specific page files; `RelatedLinks` returning `null` means partial reverts are always safe.

### Definition of done
- [ ] `data/internal-links.json` generated with ≥100 linked pages (from real sitemap URLs — nothing invented).
- [ ] `scripts/build-internal-links.ts`, `lib/related-links.ts`, `app/explore/page.tsx` created; `/explore` added to the sitemap.
- [ ] `npm run typecheck` + production build pass; Trusted-Types policy in `layout.tsx` untouched (`grep -c trustedTypes` ≥ 1).
- [ ] Clean-tree gate honored (did NOT ship foreign uncommitted changes).
- [ ] Deployed via `npm run deploy:prod`; live domain verified updated (alias repointed if needed) AND homepage render-checked non-blank.
- [ ] (Optional) Phase 2 RelatedLinks wiring attempted one-file-at-a-time behind the typecheck gate; only green files kept.
- [ ] Weekly refresh noted. Zero fabricated URLs/labels. Layout/CSP never touched.
```
