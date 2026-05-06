# Build Artifact Bloat — Diagnosis & Mitigations

**Filed:** 2026-05-06 (Brunson audit cycle, follow-on to PR #50)
**Symptom:** `vercel deploy --prebuilt --prod` fails with HTTP 400:

```
"reason": "missing_archive",
"message": "Invalid request: `files` should NOT have more than 15000 items, received 40372."
```

## TL;DR

- `.vercel/output/functions/` ships **25,366 files** — 99.7 % of the
  total artifact (25,451 files). The static side is only 76 files.
- The bottleneck is the **per-slug Next.js function bundle** the Vercel
  output spec emits for every dynamic-params route (`/startup/[slug]`,
  `/startups-to-watch/[slug]`, `/trends/[slug]`, etc.).
- ~125 startup slugs × ~80 files per `.func` bundle = ~10,000 files
  for `/startup/[slug]` alone. Sum across 11 dynamic-params routes
  exceeds the 15,000-file plain-upload cap.
- **Pragmatic fix (shipped):** `bash scripts/deploy-prod.sh` always
  invokes `vercel deploy --prebuilt --prod --archive=tgz`. The
  `--archive=tgz` flag tars the artifact before upload, sidestepping
  the 15k-file cap entirely.
- **Structural fix (not shipped):** convert the dynamic-params routes
  to pure-static via the Next.js 16 `'use cache' + cacheLife('max')`
  directive instead of `force-static + dynamicParams = false`. That
  emits HTML in `.vercel/output/static/` and skips the per-slug
  function bundle altogether.

## Reproduce

```bash
cd pseo-site
npx vercel build --prod
find .vercel/output -type f | wc -l        # 25,451
find .vercel/output/functions -type f | wc -l   # 25,366 (the offender)
find .vercel/output/static -type f | wc -l      # 76 (fine)

# Top contributors inside functions/
for d in .vercel/output/functions/*/; do
  count=$(find "$d" -type f | wc -l)
  printf "%6d  %s\n" "$count" "$d"
done | sort -rn | head -8
```

Expected output:

```
  9952  .vercel/output/functions/startup
  3980  .vercel/output/functions/startups-to-watch
  2220  .vercel/output/functions/startups-to-watch/geo
  1080  .vercel/output/functions/trends
  1074  .vercel/output/functions/stage
   932  .vercel/output/functions/signals
   864  .vercel/output/functions/answers
   542  .vercel/output/functions/research
```

## Why each slug emits ~80 files

For every dynamic-params route, Vercel's output spec emits this set
of artifacts per slug:

```
/startup/airbytehq                          # prerender HTML output dir
/startup/airbytehq.func/                    # function bundle (Node.js launcher + deps)
/startup/airbytehq.func/___next_launcher.cjs
/startup/airbytehq.func/.vc-config.json
/startup/airbytehq.rsc.func/                # RSC function bundle (separate)
/startup/airbytehq.prerender-config.json    # prerender metadata
/startup/airbytehq.prerender-fallback.html  # static fallback HTML
/startup/airbytehq.rsc.prerender-config.json
/startup/airbytehq.rsc.prerender-fallback.rsc
/startup/airbytehq.segments                 # segment manifest
```

The `.func/` and `.rsc.func/` directories each contain ~30 files
(launcher, config, runtime, server bundle, traced node_modules).
Multiplied by 125 slugs and two function bundles per slug, that's
~7,500 files for one route.

This is **standard Vercel output spec behavior** — the duplication is
necessary because each slug's function bundle could in principle
diverge (different env, different traced deps). It's only wasteful for
us specifically because every slug is fully prerendered with no
runtime divergence.

## Pragmatic fix — shipped

`pseo-site/scripts/deploy-prod.sh` (and `pnpm deploy:prod`) bake in
the `--archive=tgz` flag:

```bash
npx vercel deploy --prebuilt --prod --archive=tgz
```

The `--archive=tgz` flag tars the entire `.vercel/output/` artifact
into a single upload, bypassing the 15k-file plain-upload cap. There
is no functional difference at the runtime side — the artifact is
unpacked on Vercel's build infrastructure exactly as if uploaded
file-by-file.

**Cost of using `--archive=tgz` always:** none. On small artifacts
the tar is faster (single roundtrip vs. file-by-file), on large
artifacts it's the only way to deploy. Always-on is correct.

## Structural fix — not shipped, future work

Convert the dynamic-params routes to pure static using Next.js 16
Cache Components:

```tsx
// Currently: app/startup/[slug]/page.tsx
export async function generateStaticParams() { /* ... */ }
export const dynamicParams = false;
export default async function Page({ params }) { /* ... */ }
```

```tsx
// Future: pure static via 'use cache' + cacheLife('max')
import { cacheLife, cacheTag } from 'next/cache';

export async function generateStaticParams() { /* ... */ }

async function getStartupData(slug: string) {
  'use cache';
  cacheLife('max');                          // build-time only, no revalidate
  cacheTag('startups', `startup-${slug}`);   // tag for surgical invalidation
  return loadStartup(slug);
}

export default async function Page({ params }) {
  const { slug } = await params;
  const data = await getStartupData(slug);
  return <StartupView data={data} />;
}
```

Switching to `'use cache' + cacheLife('max')` should:

1. Emit the page as **pure HTML** in `.vercel/output/static/startup/<slug>.html`
2. **Eliminate** the per-slug `.func/` and `.rsc.func/` bundles
3. Cut artifact file count from ~25,000 to ~150 (the static
   counterparts only)
4. Make `--archive=tgz` optional rather than mandatory

**Why we haven't done this yet:** requires `next.config.ts` to enable
`cacheComponents: true` (replaces `experimental.ppr`). That's a
project-wide flag flip that needs validation across all routes,
including the few that legitimately need request-time data
(`/api/v1/signals.json`, `/api/agent-card`, etc.). Those API routes
are already function bundles by design and don't need to change, but
the flip should be validated under load before shipping.

**Estimated lift:** 1 dev-day to flip the flag, run a full local
production build, diff `.vercel/output/static/` vs. `.vercel/output/
functions/` before/after, and validate that every dynamic-params
route round-trips correctly.

**Estimated payback:** every prod deploy goes from ~2 min upload
+ ~1 min build to ~30 s total. Removes the `--archive=tgz`
requirement. Cuts artifact size from ~160 MB to ~10 MB.

## Affected dynamic-params routes (priority order)

| Route | Slug count | Files (est.) | Priority |
|---|---|---|---|
| `/startup/[slug]` | ~125 | ~10,000 | P0 — biggest win |
| `/startups-to-watch/[slug]` | ~50 | ~4,000 | P0 |
| `/startups-to-watch/geo/[slug]` | ~30 | ~2,200 | P1 |
| `/trends/[slug]` | ~14 | ~1,080 | P1 |
| `/stage/[slug]` | ~14 | ~1,074 | P1 |
| `/signals/[slug]` | ~12 | ~932 | P1 |
| `/answers/[slug]` | ~10 | ~864 | P1 |
| `/research/[slug]` | ~7 | ~542 | P2 |
| `/vs/[slug]` | ~7 | ~540 | P2 |
| `/compare/[slug]` | ~7 | ~540 | P2 |
| `/blog/[slug]` | ~7 | ~540 | P2 |

Total per-slug function-bundle files: ~22,300 — converting all 11
routes drops the artifact below the 15k cap without `--archive=tgz`.

## References

- Memory entry: `[Brunson Secret 18 — Cart Funnel V8 ship 2026-05-06]`
  — *"NB: `--archive=tgz` required on `vercel deploy --prebuilt`
  (>15k file upload limit)"*
- Vercel CLI deploy reference: https://vercel.com/docs/cli/deploy
- Next.js Cache Components guide: https://nextjs.org/docs/app/getting-started/cache-components
- Next.js `use cache` directive: https://nextjs.org/docs/app/api-reference/directives/use-cache
- Vercel Output API spec (the underlying file-format that emits
  per-slug `.func/` bundles): https://vercel.com/docs/build-output-api

## Status

- ✅ Pragmatic fix shipped (`scripts/deploy-prod.sh` + `pnpm deploy:prod`)
- ✅ Diagnosis filed (this doc)
- ◔ Structural fix queued (1-day Next.js 16 Cache Components migration)
