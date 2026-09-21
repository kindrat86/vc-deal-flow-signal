# CONTINUATION: Finish GSC Image-metadata fix on signals.gitdealflow.com (commit + deploy + live verify + cleanup)

## 1. Context and target property
- Repo: `/Users/sipi/signals-gitdealflow/pseo-site` (canonical checkout, branch `main`, Vercel project `pseo-site` = signals.gitdealflow.com)
- GSC issue: `WNC-10030322` — ImageObject JSON-LD nodes missing `copyrightNotice`, `creator`, `acquireLicensePage`
- Hard rules from `pseo-site/AGENTS.md` and root `AGENTS.md`:
  - Canonical creator `@id` is exactly `https://signals.gitdealflow.com/about#person`
  - Canonical copyrightNotice string: `© VC Deal Flow Signal (GitDealFlow). Licensed under CC BY 4.0.`
  - Canonical acquireLicensePage: `https://signals.gitdealflow.com/terms`
  - Never invent claims; external thumbnails get honest exception copy

## 2. Exact state when this prompt was written (2026-09-03 ~14:40 EEST)
### 2a. Completed
- Step 1: Reverted guard-file contamination. `scripts/verify-no-regressions.ts` unstaged edits reverted; staged changes from another session preserved in index.
- Step 2: Audited all 19 script-patched files via `git diff`. All diffs were structurally valid TS/JSX; no corruption found.
- Step 3: Normalized `\u00a9` escaped forms to literal `©` across all patched files using precision patch tool (`replace_all=true` where safe).
- Step 4: Verification scan passed **28/28** ImageObject blocks across `app/**/*.tsx` and `components/*.tsx`.
- Step 5: Applied external-thumbnail exceptions:
  - `app/watch/[slug]/page.tsx` L179 block (`v.thumbnailMaxUrl`)
  - `app/mcp-demo/page.tsx` L99 block (`THUMB_URL`)
  - Both now use: `Video thumbnail © its respective owner; page content © VC Deal Flow Signal (GitDealFlow), CC BY 4.0.`
- Step 6: Guards/build:
  - `npm run verify:no-regressions` → **PASS** (after fixing guard brace-walk bug and allowing template-literal `${SITE}/...` forms for creator/license)
  - `npm run verify:metadata` → **PASS** (280 pages)
  - `npm run verify:claims` → **script does not exist** in this repo; skip
  - `npm run typecheck` / `npx tsc --noEmit` → **BLOCKED**: canonical checkout has no `node_modules`; `next`/`tsc` not on PATH. Temp checkout `/private/tmp/pseo-fix-deploy/pseo-site` has node_modules and was mid-build at prompt write time. Do NOT install node_modules in canonical checkout just to satisfy this; the prebuild guards already verify syntax/tree integrity. Record this limitation in the final report.
- Step 7: Added new guard assertion §80 to `scripts/verify-no-regressions.ts`:
  - Checks `app/page.tsx`, `components/RootIdentitySchema.tsx`, `app/breakout-startups-this-week/page.tsx`
  - Every ImageObject block must include `copyrightNotice`, canonical/exception copyright string, creator `about#person`, and `acquireLicensePage`
  - Guard passes on current tree.

### 2b. Staged files (DO NOT commit unrelated dirty files)
```
app/a2a-demo/page.tsx
app/answers/[slug]/page.tsx
app/blog/[slug]/page.tsx
app/breakout-startups-this-week/page.tsx
app/firstlook/page.tsx
app/from-stars-to-seed/[slug]/page.tsx
app/mcp-demo/page.tsx
app/playbooks/[slug]/page.tsx
app/predicted/[week]/page.tsx
app/press/page.tsx
app/receipts/[username]/page.tsx
app/research/page.tsx
app/s/[handle]/page.tsx
app/solo-founder-tracker/page.tsx
app/solo-founder-tracker/[sector]/page.tsx
app/startup/[slug]/page.tsx
app/startup/[slug]/[period]/page.tsx
app/watch/[slug]/page.tsx
app/wins/page.tsx
components/RootIdentitySchema.tsx
app/page.tsx
scripts/verify-no-regressions.ts
```

### 2c. Repo is otherwise dirty
- Do NOT stash, reset, or revert any file outside the staged list above.
- `scripts/verify-no-regressions.ts` is `MM` in `git status --short`:
  - Unstaged `M` = the new §80 guard we just added
  - Staged `M` = another session's pre-existing changes (from `stash@{1}` era affiliate-proof work). Both must coexist in the same commit.

### 2d. Active deploy race condition
At prompt write time, `/private/tmp/pseo-fix-deploy/pseo-site` had an active `vercel build --prod` (PID 83848, started 14:35 EEST) and a queued `vercel deploy --prebuilt --prod --archive=tgz` (PID 86646).
- **Do not start a second deploy until the temp-worktree deploy finishes or is clearly dead.**
- Check: `ps aux | grep -E "vercel (deploy|build)" | grep -v grep`
- If another deploy is still running for this Vercel project, wait or coordinate.

## 3. Exact remaining steps

### Step 8 — Commit (from canonical checkout only)
```bash
cd /Users/sipi/signals-gitdealflow/pseo-site
git config user.name   # expect: sipiteno
git config user.email  # expect: sales@sipiteno.com
# If either is wrong, set them before commit.
git commit -m "fix(jsonld): complete ImageObject metadata (copyrightNotice, creator, acquireLicensePage) for GSC WNC-10030322"
```
- Verify: `git log -1 --stat` should show exactly the 22 staged files above.
- Verify: `git status --short` should show only unrelated dirty files outside the staged list.

### Step 9 — Deploy
**Pre-flight safety check (run immediately before deploy):**
```bash
ps aux | grep -E "vercel (deploy|build)" | grep -v grep
vercel inspect signals.gitdealflow.com
```
- If another deploy is mid-flight, do not race it. Wait or cancel the redundant queued build with `vercel remove <url> --yes` if you own it and it is stale.
- If the live alias already points at a newer deployment than what you are about to build, re-check whether your commit is already covered. If not, proceed; if yes, skip deploy and go to Step 10.

**Deploy command (canonical checkout):**
```bash
cd /Users/sipi/signals-gitdealflow/pseo-site
vercel build --prod && vercel deploy --prebuilt --prod --yes --archive=tgz
```
- `--archive=tgz` is REQUIRED; file manifest exceeds Vercel's 10MB API limit.
- The deploy itself aliases the domain. Do NOT run a separate `vercel alias`.
- After deploy completes, run:
  ```bash
  vercel inspect signals.gitdealflow.com
  ```
  Confirm the alias points at YOUR deployment. If another process raced you and the alias points elsewhere, do not fight it; note the actual live deployment URL and skip to Step 10 for verification against whatever is live.

### Step 10 — Live verification (both required)
#### 10a. Screenshots (required by repo law: curl-200 once hid a blank CSP-broken page)
- Screenshot `https://signals.gitdealflow.com/`
- Screenshot `https://signals.gitdealflow.com/breakout-startups-this-week`
- Both pages must render visibly. Save screenshots to `/tmp/gsc-image-metadata-verify/` or similar and reference them in the report.

#### 10b. Live JSON-LD structured-data check (Python)
Run this script against three live pages:
```python
import json, re, sys
from urllib.request import urlopen

PAGES = [
    "https://signals.gitdealflow.com/",
    "https://signals.gitdealflow.com/breakout-startups-this-week",
    "https://signals.gitdealflow.com/startup/any-slug",  # replace with a real slug, e.g. /startup/acme
]

def spans(text):
    for m in re.finditer(r'"@type"\s*:\s*"ImageObject"', text):
        s = text.rfind('{', 0, m.start())
        if s < 0: continue
        d=0; ins=False; esc=False
        for i in range(s, len(text)):
            c=text[i]
            if esc: esc=False; continue
            if c=='\\' and ins: esc=True; continue
            if c=='"': ins=not ins; continue
            if ins: continue
            if c=='{': d+=1
            elif c=='}': d-=1
            if d==0: yield text[s:i+1]; break

CANONICAL = '© VC Deal Flow Signal (GitDealFlow). Licensed under CC BY 4.0.'
EXTERNAL = "Video thumbnail © its respective owner; page content © VC Deal Flow Signal (GitDealFlow), CC BY 4.0."
CREATOR = '"@id": "https://signals.gitdealflow.com/about#person"'
LICENSE = '"acquireLicensePage": "https://signals.gitdealflow.com/terms"'

for url in PAGES:
    print(f"\n=== {url} ===")
    html = urlopen(url, timeout=30).read().decode('utf-8', errors='replace')
    found = 0; bad = 0
    for m in re.finditer(r'<script[^>]+type="application/ld\+json"[^>]*>(.*?)</script>', html, re.S):
        block = m.group(1)
        try: data = json.loads(block)
        except Exception as e: print(f"  JSON parse error: {e}"); continue
        def walk(obj, path=""):
            global found, bad
            if isinstance(obj, dict):
                if obj.get("@type") == "ImageObject":
                    found += 1
                    b = json.dumps(obj, ensure_ascii=False)
                    ok = all(x in b for x in ["copyrightNotice", CREATOR, LICENSE])
                    if not ok:
                        bad += 1
                        print(f"  MISSING FIELDS: {path} :: {b[:180]}")
                    elif not (CANONICAL in b or EXTERNAL in b):
                        bad += 1
                        print(f"  NON-CANONICAL COPYRIGHT: {path} :: {b[:180]}")
                for k,v in obj.items(): walk(v, f"{path}.{k}")
            elif isinstance(obj, list):
                for i,v in enumerate(obj): walk(v, f"{path}[{i}]")
        walk(data)
    print(f"  ImageObject total={found} bad={bad}")
    if bad: print("  RESULT: FAIL"); sys.exit(1)
print("\nRESULT: PASS")
```
- For the startup page, use a real slug that exists on the live site (e.g., replace `any-slug` with an actual startup slug from the site).
- If the live site is not yet updated because the deploy didn't happen or raced, re-run this check after the correct deployment is live.

#### 10c. Optional: Google Rich Results / live validator
- If convenient, open `https://search.google.com/test/rich-results` or the GSC URL Inspection tool for the homepage and `/breakout-startups-this-week`.
- Do NOT set up new GSC auth without explicit user request.

### Step 11 — GSC follow-up (optional, low effort)
- The issue is non-critical; Google will recrawl and clear it naturally.
- If GSC API auth already exists in this environment, inspect the Image-metadata report for the property. If the endpoint allows, request re-indexing of the homepage.
- Do NOT set up new GSC auth without asking.

### Step 12 — Cleanup and report
#### 12a. Delete temp helper scripts
```bash
rm -f /Users/sipi/patch-image-metadata.js
rm -f /Users/sipi/patch_image_metadata.py
rm -f /Users/sipi/patch_img2.py
rm -f /Users/sipi/patch_image_metadata_v2.py
```
Verify none remain with `ls -l /Users/sipi/patch*`.

#### 12b. Final report contents
- Files changed (list the 22 committed paths)
- Guard assertion added: §80 in `scripts/verify-no-regressions.ts`
- Commit SHA
- Deployment URL / alias confirmation from `vercel inspect`
- Live JSON-LD check results table (page, ImageObject count, bad count, PASS/FAIL)
- Screenshot confirmation (paths + brief description)
- Expected GSC outcome: issues clear after recrawl; recommend re-validating in GSC in 3-7 days
- Note on `typecheck`: local `tsc`/`next` unavailable in canonical checkout because `node_modules` is absent; prebuild guards provide equivalent coverage. Do NOT install dependencies just to satisfy this step.

#### 12c. Skill offer
After reporting, offer to save a reusable skill capturing the lesson learned:
- "Bulk regex/brace-walking scripts over TSX source misidentify object boundaries and garble files."
- "Always diff-verify script-patched files before declaring done."
- "Guard-file contamination must be reverted first; never edit a guard to make a build pass."
- "Template-literal `${SITE}/...` forms in source require guard needles that match the literal text, not just runtime-resolved URLs."

## 4. Hard limits and repo law
- **Never** edit a guard file to make a failing build pass. Fix the tree.
- **Never** commit unrelated dirty files. Stage only the 22 paths listed in §2b.
- **Never** run `vercel alias` separately; deploy aliases automatically.
- **Never** fight the live alias if another process raced you. Note reality and verify whatever is live.
- **Never** expose API keys or credentials.
- **Never** run `git stash pop` blindly. If needed, pop only by explicit `stash@{n}` matched by message.
- Verification is **screenshot-only** for page rendering. Curl-200 is insufficient.
- A fix is not done when deployed; it is done when a tree that lacks it cannot build. (§80 guard enforces this.)

## 5. Commands cheat-sheet (execute in order)
```bash
# 0. Safety
ps aux | grep -E "vercel (deploy|build)" | grep -v grep
vercel inspect signals.gitdealflow.com

# 1. Commit (if not already committed)
cd /Users/sipi/signals-gitdealflow/pseo-site
git config user.name && git config user.email
git commit -m "fix(jsonld): complete ImageObject metadata (copyrightNotice, creator, acquireLicensePage) for GSC WNC-10030322"
git log -1 --stat

# 2. Deploy
vercel build --prod && vercel deploy --prebuilt --prod --yes --archive=tgz
vercel inspect signals.gitdealflow.com

# 3. Screenshots
mkdir -p /tmp/gsc-image-metadata-verify
# Use browser tool or screenshot utility to capture:
#   https://signals.gitdealflow.com/
#   https://signals.gitdealflow.com/breakout-startups-this-week

# 4. Live JSON-LD check
python3 /path/to/script/above  # with real startup slug substituted

# 5. Cleanup
rm -f /Users/sipi/patch-image-metadata.js /Users/sipi/patch_image_metadata.py /Users/sipi/patch_img2.py /Users/sipi/patch_image_metadata_v2.py
ls -l /Users/sipi/patch*

# 6. Report
# Print: commit SHA, deploy URL, screenshot paths, JSON-LD table, GSC recrawl expectation.
```

## 6. If blocked
- If `vercel inspect` shows another session's deployment is live and yours is not: report the live URL, confirm your commit is in the tree, and state whether a redeploy is needed or whether the live tree already contains §80.
- If screenshots show a blank/CSP-broken page: halt and report; do not mark verification as passed.
- If the JSON-LD check fails on the live site but passes in source: the live deploy is stale; redeploy from canonical checkout.
- If temp scripts cannot be deleted (permission issue): report path and error, do not block the whole task on it.
