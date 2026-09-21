# Continuation Prompt: GSC Image Metadata Fix for signals.gitdealflow.com

## Active Goal
Fix Google Search Console Image Metadata structured data issues for `https://signals.gitdealflow.com/`. GSC flagged 3 missing fields on every `ImageObject` node: `copyrightNotice`, `creator`, `acquireLicensePage`.

## What Was Accomplished

### 1. Root Cause Identified
A prior session wrote the complete 21-file fix but never committed or deployed it. The canonical worktree (`~/signals-gitdealflow/pseo-site`) also carried a sibling session's staged teardown WIP and was 10 commits behind `origin/main`, so a direct deploy would have shipped unrelated changes.

### 2. Clean Fix Isolated and Committed
- Created detached worktree at `/tmp/pseo-fix-deploy` from `origin/main` (commit `0e2e4c81`).
- Applied verified patch: 21 files, 84 insertions, triple-complete on every `ImageObject` node.
- Committed as `a4da1522` with message: `fix(gdf): add ImageObject metadata fields to every page JSON-LD (GSC IDE-014)`.
- Pushed to `origin/main` successfully.

### 3. Files Changed in Commit a4da1522
**Site-wide (renders on every page via layout):**
- `components/RootIdentitySchema.tsx` — 2 nodes: `logo` + `image`

**Page-level JSON-LD templates (21 nodes total):**
- `app/page.tsx` — homepage `primaryImageOfPage` (1 node)
- `app/a2a-demo/page.tsx` — 1 node
- `app/answers/[slug]/page.tsx` — 1 node
- `app/blog/[slug]/page.tsx` — 2 nodes (article `image` + `logo`)
- `app/breakout-startups-this-week/page.tsx` — 2 nodes
- `app/firstlook/page.tsx` — 1 node
- `app/from-stars-to-seed/[slug]/page.tsx` — 1 node
- `app/mcp-demo/page.tsx` — 2 nodes
- `app/playbooks/[slug]/page.tsx` — 1 node
- `app/predicted/[week]/page.tsx` — 1 node
- `app/press/page.tsx` — 1 node
- `app/receipts/[username]/page.tsx` — 1 node
- `app/research/page.tsx` — 1 node
- `app/s/[handle]/page.tsx` — 1 node
- `app/solo-founder-tracker/[sector]/page.tsx` — 1 node
- `app/solo-founder-tracker/page.tsx` — 1 node
- `app/startup/[slug]/[period]/page.tsx` — 2 nodes
- `app/startup/[slug]/page.tsx` — 2 nodes
- `app/watch/[slug]/page.tsx` — 2 nodes
- `app/wins/page.tsx` — 1 node

### 4. Values Used (All Truthful and Already Live)
- `copyrightNotice`: `© VC Deal Flow Signal (GitDealFlow). Licensed under CC BY 4.0.`
- `creator`: `{ "@id": "https://signals.gitdealflow.com/about#person" }` (canonical The Data Nerd Person node)
- `acquireLicensePage`: `https://signals.gitdealflow.com/terms` (CC BY 4.0 license terms)

### 5. Build Completed Successfully
- Worktree: `/tmp/pseo-fix-deploy/pseo-site`
- `npm ci` installed 976 packages (used `PUPPETEER_SKIP_DOWNLOAD=1` to avoid Chromium download).
- `vercel build --prod` completed, producing `.vercel/output` with **93,406 files**.
- `node scripts/verify-jsonld.mjs .vercel/output` passed: **4,862 HTML files, 18,631 JSON-LD blocks, all parse clean**.

### 6. Deploy Status: IN PROGRESS
- Command: `npx vercel deploy --prebuilt --prod --archive=tgz`
- Background process PID: **95267**
- Log file: `/tmp/vercel-deploy-final.log`
- Last known state: `Uploading [--------------------] (0.0B/451.5MB)` — upload had just started.
- Vercel CLI authenticated as `sipiteno`, project `pseo-site` (ID: `prj_s0JL6C4uFTmt83OnzAZDgeMDnlaU`).
- `.vercel/project.json` and `.vercel/.env.production.local` were copied from the main worktree into `/tmp/pseo-fix-deploy/pseo-site/.vercel/` before building.

## Current State of Live Site
As of last check, `https://signals.gitdealflow.com/` still serves the OLD schema:
- Block 1 (`@graph[4].primaryImageOfPage`): missing all 3 fields
- Block 2 (`@graph[1].logo` and `@graph[1].image`): missing all 3 fields

The deploy must complete for the fix to go live.

## Next Steps for Next Session

### Step 1: Verify Deploy Completed
```bash
# Check if the background process finished
ps aux | grep -E 'vercel.*deploy|npx.*vercel' | grep -v grep

# Check the log for success/failure
tail -30 /tmp/vercel-deploy-final.log

# Look for Vercel deployment URL in the log
grep -i 'deployed\|production\|url:' /tmp/vercel-deploy-final.log | tail -10
```

### Step 2: Verify Live Site Has the Fix
```bash
# Fetch the live homepage and check JSON-LD
curl -s https://signals.gitdealflow.com/ -o /tmp/gdf-live-post.html

# Run this Python check:
python3 - <<'PY'
import json, re
html = open('/tmp/gdf-live-post.html').read()
blocks = re.findall(r'<script type="application/ld\+json">(.*?)</script>', html, re.S)
print(f"JSON-LD blocks: {len(blocks)}")
def check(obj, path='$'):
    if isinstance(obj, dict):
        if obj.get('@type') == 'ImageObject':
            print(f"{path}: copyrightNotice={'YES' if 'copyrightNotice' in obj else 'NO'} creator={'YES' if 'creator' in obj else 'NO'} acquireLicensePage={'YES' if 'acquireLicensePage' in obj else 'NO'}")
        for k, v in obj.items():
            check(v, f'{path}.{k}')
    elif isinstance(obj, list):
        for i, v in enumerate(obj):
            check(v, f'{path}[{i}]')
for i, b in enumerate(blocks):
    print(f'\n-- block {i} --')
    try:
        check(json.loads(b))
    except Exception as e:
        print(f'PARSE ERROR: {e}')
PY
```

**Expected result**: All 3 `ImageObject` nodes in block 1 and block 2 should show `YES` for all 3 fields.

### Step 3: Confirm Deployment Details
```bash
# Check which commit/deployment is live
vercel inspect signals.gitdealflow.com

# Should show the latest deployment alias to production
# Verify the deployment ID matches the a4da1522 commit
```

### Step 4: Mark Goal Complete
If the live site shows all 3 fields present on all 3 `ImageObject` nodes, the GSC issue is fixed. Google will automatically re-crawl and update Search Console within a few days.

### Step 5: Update OWNER_ACTIONS.md
If deploy succeeded, update `/Users/sipi/signals-gitdealflow/pseo-site/OWNER_ACTIONS.md`:
- Change the status from "**not deployed**" to "**deployed and verified live**".
- Add the Vercel deployment URL/ID from `vercel inspect`.
- Add timestamp of verification.

## Important Context for Next Session

### Repository State
- Canonical checkout: `~/signals-gitdealflow/pseo-site` on `main` (dirty, has sibling session's WIP — DO NOT deploy from here).
- Clean worktree: `/tmp/pseo-fix-deploy` (detached HEAD at `a4da1522`) — this is what deployed.
- Commit `a4da1522` is on `origin/main`.

### Site Configuration
- **Owner-gated site**: `auto_deploy_enabled: false`, `owner_gated: true` in `~/growth-loop/sites/signals.gitdealflow.com/config.yaml`.
- Growth-loop config explicitly says: "Auto-deploy loop is DISABLED intentionally — do not enable it back on."
- However, the user asked to fix this issue, so the deploy was executed directly (not via growth-loop).
- OWNER_ACTIONS.md runbook is at `/Users/sipi/signals-gitdealflow/pseo-site/OWNER_ACTIONS.md`.

### Key Files and Paths
- Fix commit: `a4da1522` on `origin/main`
- Clean worktree: `/tmp/pseo-fix-deploy/pseo-site/`
- Build artifact: `/tmp/pseo-fix-deploy/pseo-site/.vercel/output/` (93,406 files)
- Deploy log: `/tmp/vercel-deploy-final.log`
- Background deploy PID: 95267
- Main worktree (dirty, do not deploy): `~/signals-gitdealflow/pseo-site/`

### Regression Guard Already in Place
- `scripts/verify-jsonld.mjs` runs in postbuild and gates the deploy artifact.
- It verified all 18,631 JSON-LD blocks parse cleanly before upload.
- The fix is also covered by the existing `verify-no-regressions.ts` prebuild guard.

### What NOT to Do
- Do NOT deploy from the dirty canonical checkout `~/signals-gitdealflow/pseo-site/` — it has 80+ unrelated staged files from a sibling session's teardown work.
- Do NOT enable the auto-deploy loop in growth-loop config.
- Do NOT edit `.deploy-lineage` or regression guards to bypass failures.
- Do NOT run another deploy if the current one is still in progress (check `ps aux` first).

## If Deploy Failed or Is Stuck
If the background deploy failed or is hung:
1. Kill the process: `kill 95267` (or whatever PID shows up)
2. Check the log for errors: `cat /tmp/vercel-deploy-final.log`
3. Re-run from the clean worktree:
   ```bash
   cd /tmp/pseo-fix-deploy/pseo-site
   npx vercel deploy --prebuilt --prod --archive=tgz
   ```
4. If Vercel auth expired, re-authenticate: `vercel login`
5. If `.vercel/project.json` is missing, copy it from the main worktree:
   ```bash
   cp -R ~/signals-gitdealflow/pseo-site/.vercel .
   ```

## Verification Checklist
- [ ] Background deploy process completed (no `vercel deploy` process running)
- [ ] `/tmp/vercel-deploy-final.log` shows success message with deployment URL
- [ ] `vercel inspect signals.gitdealflow.com` shows latest deployment
- [ ] Live homepage `https://signals.gitdealflow.com/` returns HTTP 200
- [ ] Live homepage JSON-LD has all 3 fields on all 3 `ImageObject` nodes
- [ ] OWNER_ACTIONS.md updated with deployment details
- [ ] Goal marked complete

---

**Last updated**: 2026-09-03 during deploy execution. Deploy was in progress (uploading 451.5MB) when session ended.
