
---

## 2026-09-03, GSC Image Metadata structured data fix (IDE-014)

**Commit to ship:** `a4da1522` (author `sales@sipiteno.com`, already pushed to `origin/main`)
**Lives in:** `/tmp/pseo-fix-deploy` (detached worktree off `origin/main` @ `a4da1522`) — already clean, no deploy has run from it yet.
**Status:** committed and pushed (`a4da1522`), built and deployed to production (`dpl_61YeW2E1394gDSg6CDm55SBZHno8`), live verification passed — all 3 GSC-flagged fields present on every `ImageObject` node on `https://signals.gitdealflow.com/`.

### What changed

Adds the three fields Google Search Console flags as missing (non-critical) on every
site `ImageObject` node in the JSON-LD:

- `copyrightNotice`: `© VC Deal Flow Signal (GitDealFlow). Licensed under CC BY 4.0.`
- `creator`: `{ "@id": "https://signals.gitdealflow.com/about#person" }`
- `acquireLicensePage`: `https://signals.gitdealflow.com/terms`

Covers:
- site-wide `components/RootIdentitySchema.tsx` (2 nodes: `logo` + `image`, present on every page)
- 19 page-level JSON-LD templates (21 nodes total across `primaryImageOfPage` / `image` / `logo` blocks):
  `a2a-demo`, `answers/[slug]`, `blog/[slug]` (2), `breakout-startups-this-week` (2),
  `firstlook`, `from-stars-to-seed/[slug]`, `mcp-demo` (2), `page` (homepage),
  `playbooks/[slug]`, `predicted/[week]`, `press`, `receipts/[username]`, `research`,
  `s/[handle]`, `solo-founder-tracker` index + per-sector, `startup/[slug]` (2),
  `startup/[slug]/[period]`, `watch/[slug]` (2), `wins`.

Values are truthful and already live on the site (CC BY 4.0 license, pseudonymous
Data Nerd persona at `/about#person`, terms page at `/terms`); no new external claims.

### Why the live site still shows the issue

The commit landed on `origin/main` but Vercel has not rebuilt since. The homepage
already had the three fields in source (`app/page.tsx`) but no deploy propagated them;
the other 20 files did not. Live homepage JSON-LD as of check: 3 `ImageObject` nodes,
all missing the three fields.

### Pre-deploy checks from `AGENTS.md`

1. Confirm the deploy unit is clean: `git -C /tmp/pseo-fix-deploy status --porcelain` (must be empty).
2. Check for concurrent Hermes and Vercel build/deploy processes. Wait rather than
   queueing another deployment if the site is already being deployed.
3. Use a commit-export or clean worktree deploy. Do not deploy the dirty canonical
   checkout directly, and do not edit `.deploy-lineage` or a regression guard to bypass
   a failure.
4. `vercel inspect signals.gitdealflow.com` identifies the last writer but is not visual
   proof. Verify in a browser by screenshot (HTTP 200 has hidden blank pages here before,
   from a removed `/ux.js`).
5. After deploy, re-check the live homepage JSON-LD for all three fields on all three
   blocks (`primaryImageOfPage`, `Organization.logo`, `Organization.image`).

### Exact owner-only deploy commands

Option A — direct clean worktree deploy (recommended; builds from the commit, not the
dirty canonical tree; serializes via the shared deploy lock):

```bash
cd /tmp/pseo-fix-deploy/pseo-site

# 1) copy gitignored deploy identity + env into the clean worktree
cp -R /Users/sipi/signals-gitdealflow/pseo-site/.vercel .

# 2) install deps from the committed lockfile (node_modules is gitignored)
npm ci

# 3) deploy (serializes via deploy-lock.sh, gates structured data, verifies live)
bash scripts/deploy-prod.sh

# 4) confirm last writer
vercel inspect signals.gitdealflow.com
```

If `npm ci` tries to download Chromium via Puppeteer, retry with:
`PUPPETEER_SKIP_DOWNLOAD=1 npm ci`.

Option B — commit-export wrapper (idempotent, serializes, gates, verifies live):

```bash
WORKTREE='/tmp/pseo-fix-deploy'
REPO_PATH='/Users/sipi/signals-gitdealflow/pseo-site'

~/growth-loop/lib/deploy_from_commit.sh \
  --worktree "$WORKTREE" \
  --commit a4da1522 \
  --build-cmd 'cd pseo-site && cp -R /Users/sipi/signals-gitdealflow/pseo-site/.vercel . && cd pseo-site && npm ci && bash scripts/deploy-prod.sh' \
  --deploy-cmd 'true' \
  --repo-path "$REPO_PATH" \
  --verify-url https://signals.gitdealflow.com/ \
  --verify-needle "copyrightNotice" \
  --verify-min-bytes 20000
```

Notes:
- `.vercel/` and `node_modules/` are gitignored; both must be supplied before the build.
- The commit is a single-purpose ImageObject fix; no affiliate / teardown / methodology
  changes are included (those are a separate session's staged WIP in the canonical checkout
  and must NOT ship in this deploy).
- Do not add a separate `vercel alias`; the production deploy auto-aliases this domain.
- Verification must be by SCREENSHOT because HTTP 200 has hidden blank pages here before.
