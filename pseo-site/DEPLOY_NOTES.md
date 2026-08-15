# Deploy Notes, Cross-link additions to startup pages

## ⚠️ LINEAGE RESOLUTION 2026-08-12, one canonical deploy lineage, guard-enforced

**The only tree allowed to build/deploy signals.gitdealflow.com is
`~/signals-gitdealflow/pseo-site` on branch `main`.** A committed sentinel
(`.deploy-lineage`, `role=CANONICAL`) is checked FIRST in `prebuild` by
`scripts/assert-canonical-lineage.mjs`. The retired `worldclass-signals`
checkout (`~/signals-worldclass/pseo-site`) carries `role=RETIRED` and its
builds abort before anything compiles, covering every deploy path, including
`deploy_from_commit.sh`'s git-archive export (the sentinel is committed, so it
travels with the tree). The third historical checkout,
`~/Downloads/vc-deal-flow-signal`, no longer exists on disk (verified
2026-08-12). If you are in the retired checkout: land your change on `main` in
the canonical checkout, do NOT edit `.deploy-lineage` or the guard.
NOTE: `worldclass-signals` still holds 43 commits `main` lacks (entity-graph
fix, email send-gate guards, GSC sitemap fixes); see the backlog order to
audit/cherry-pick them before that branch is archived.
(Owner: AGENTS.md still needs this paragraph, agent writes to AGENTS.md are
blocked in autonomous mode; see owner-queue.)

## What changed

Added a **"Related Resources"** section to all 4,408 startup page templates (`app/startup/[slug]/page.tsx`), placing 4 cross-links to gitdealflow.com landing pages between the "View Full Sector Rankings" section and the "Badge embed CTA" section.

The links added per startup (dynamically rendered with the startup's name, slug, and sector):

| Link | Destination | Purpose |
|------|-------------|---------|
| View {name} in {sector} sector | `https://gitdealflow.com/sector/{sectorSlug}` | Pass authority to sector landing pages |
| Benchmark {name} vs 356 startups | `https://gitdealflow.com/benchmark` | Drive benchmark landing page traffic |
| Find startups like {name} | `https://gitdealflow.com/a/startups-like-{slug}` | SEO-optimized competitive-set pages |
| Check {name}'s velocity | `https://gitdealflow.com/check-velocity` | Drive velocity-checker landing page |

All links open in new tabs (`target="_blank"`, `rel="noopener noreferrer"`) and use the signals dark-theme card styling (border-slate-800, bg-slate-900, hover:border-sky-700/50).

## Modified file

- `app/startup/[slug]/page.tsx`, added ~60 lines (new section inserted after sector rankings, before badge embed)

## Deploy commands

The signals site has specific deployment constraints: the domain is **alias-pinned**, the live source is the canonical lineage `~/signals-gitdealflow/pseo-site` on `main` (sentinel-enforced since 2026-08-12), and the file manifest exceeds the 10 MB API upload limit.

### Step 1: Ensure clean tree

```bash
cd /Users/sipi/Downloads/vc-deal-flow-signal/pseo-site
git status
# Must show clean working tree before proceeding
# If dirty, commit or stash first
```

### Step 2: Switch to the correct branch

```bash
# Canonical lineage: main in ~/signals-gitdealflow/pseo-site (sentinel-enforced)
git checkout main
```

### Step 3: Build and deploy

```bash
# --archive=tgz is REQUIRED, the file manifest exceeds Vercel's 10 MB API limit
vercel build --prod && vercel deploy --prebuilt --prod --yes --archive=tgz
```

This outputs a deployment URL like `https://pseo-site-xxxxx.vercel.app`.

### Step 4: Alias the domain (required, alias-pinned)

```bash
# vercel --prod does NOT update the live domain
# You MUST explicitly alias the new deployment
vercel alias <deployment-url> signals.gitdealflow.com
```

Replace `<deployment-url>` with the URL from step 3.

Do **NOT** use `vercel --prod` as a shortcut, it will not update the live domain.

### Step 5: Verify

**Do NOT rely on `curl`**, the AGENTS.md warns that a `curl 200` can already hide an empty page due to the `require-trusted-types-for` CSP policy.

Verify by **screenshot**:
- Visit `https://signals.gitdealflow.com/startup/<any-slug>` in a browser
- Scroll to the "Related Resources" section (between "View Full Sector Rankings" and the badge embed)
- Confirm all 4 links render with correct startup name, sector, and slug interpolation
- Confirm links open `gitdealflow.com` (not signals.gitdealflow.com)

## Known pitfalls

- **Trusted Types CSP**: The site has `require-trusted-types-for` in CSP. If the page goes blank, it's a Trusted Types issue (fixed in commit 22d6de1c), not a deploy failure.
- **`/ux.js`**: Do NOT re-add `/ux.js` to layout.tsx, it blank-screens the site (App Router hydration wipe). `ux.css` is fine.
- **Non-team commit authors**: The pSEO project rejects commits from non-team git identities. Use the project owner's git identity.
- **Vercel env vars**: If adding/modifying env vars, use `printf '%s' "$VAL" | vercel env add NAME production`, `echo` appends a newline that silently corrupts secrets.
- **Swarm races**: Before deploying, check `ps aux | grep hermes` to ensure no other agent is modifying the project concurrently.
