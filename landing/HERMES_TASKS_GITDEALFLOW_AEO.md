# Hermes Autonomous Execution Brief — gitdealflow.com AEO/SEO Remediation

**Target repo:** `~/signals-gitdealflow/landing` (branch `main`, last commit at time of writing: `3eab07e`, 2026-07-20)
**Live domain:** https://gitdealflow.com (Vercel project `landing`, team `sales-3429s-projects`) — **not** `signals.gitdealflow.com`, which is a separate Next.js app (`~/signals-gitdealflow/pseo-site`) with its own separate Trusted-Types incident history; this brief is landing-repo-only.
**Deploy command:** static prebuilt site — `vercel --prod --yes` (or the repo's normal deploy script if one exists; check `package.json`/`vercel.json` at execution time since this repo's build tooling may have changed given the scale of pending changes noted below).
**Source audit:** 10-site portfolio AEO/SEO audit, 2026-07-21, gitdealflow.com scored 83/100, 0 critical + 1 high + 2 medium + 2 low findings.
**Executor:** Hermes Agent (autonomous, DeepSeek v4 Pro). This document is your complete task spec — **but read §0.1 before anything else. This repo requires a different first move than every other brief in this portfolio.**

---

## 0. Read this whole section before touching anything — this repo is a special case

### 0.1 STOP CONDITION — this repo's working tree was found extremely dirty at brief-writing time

```bash
cd ~/signals-gitdealflow/landing && git status --short | wc -l
```

**At brief-writing time this returned 341 modified/untracked files** — nearly the entire pSEO content tree (every city page, sector page, vs/ page, for/ page, learn/ page, plus `index.html` itself, which had a diff of +261/-644 lines, essentially rewriting roughly half the homepage). This is dramatically larger and more active than any other repo in this portfolio's Hermes briefs. It strongly indicates either a major redesign/consolidation pass mid-flight, or a very recent bulk regeneration that hasn't been committed yet.

**Do this before anything else:**
```bash
ps aux | grep -i hermes | grep -v grep
cd ~/signals-gitdealflow/landing && git status --short | wc -l
```

- **If the dirty-file count is still anywhere near this large (dozens or more files, especially if `index.html` is among them), DO NOT PROCEED with any task in this brief.** Do not attempt to isolate "just your fix" inside `index.html` while it's part of a much larger uncommitted change — you cannot cleanly separate your edit from whatever else is in flight there, and committing would either destroy someone else's in-progress work or misattribute a 900-line rewrite under your own commit message. Report the situation and stop. Re-check again later (every 10-15 minutes) until the tree either gets committed by whoever is working on it, or reverts to a small/clean diff.
- **Once the tree is clean (or only has a small number of unrelated dirty files you can identify and avoid), re-verify every task's root cause below against the new state before acting** — do not assume the file/line citations in this brief are still accurate. A tree this active means HEAD may have moved substantially, and the exact content this brief describes may have already changed, been fixed, or been restructured entirely.
- This is the one brief in this portfolio where "wait" is very likely to be the correct first action, not a fallback.

### 0.2 Why this matters more than usual here: production is already ahead of the last commit

Cross-checking `git show HEAD:index.html` (the last actual commit, `3eab07e`) against both the live production site and the current uncommitted working tree revealed something important: **the last committed version has zero instances of the AggregateRating/Review schema described in TASK-01 below, but the live production site currently serves it, and the current uncommitted working tree also has it.** In other words, whatever's live in production right now was deployed from a state that was never committed to this git history (or was committed elsewhere/since diverged) — the git commit log alone is not a reliable source of truth for "what's live" on this specific repo at this specific moment. **Always verify against the live site directly (`curl https://gitdealflow.com/`), not just against `git log`/`git diff`, before concluding whether something is fixed, broken, or already-shipped.**

### 0.3 This repo has no blank-screen CSP landmine (verified) — confirmed different from its sibling

`~/signals-gitdealflow/landing` is a static-HTML site (no `next.config`, no client-hydration framework), unlike `signals.gitdealflow.com` (a separate Next.js repo with its own documented Trusted-Types blank-screen incident history). No CSP/Trusted-Types risk applies here — confirmed via live header inspection (CSP present, `default-src 'self'`, scoped `script-src` to PostHog only, no `require-trusted-types-for` directive). No task below needs to guard against that failure mode.

### 0.4 Guardrails you must never bypass

- Never use `git commit --no-verify`. Always create new commits; never `git commit --amend` on a commit that's already been pushed/deployed. Never `git push --force` to `main`.
- Given the scale of concurrent activity on this repo (§0.1), be unusually conservative about broad operations — never `git add -A` or `git checkout .`; only ever stage the exact files each task below names, and never discard uncommitted changes you didn't create.

### 0.5 What you are NOT authorized to change autonomously

See §6 "Owner-gated — do not execute" at the bottom. Anything not explicitly listed as a task in §1–§2 is out of scope.

---

## 1. P1 — HIGH

### TASK-01: Remove the self-serving AggregateRating/Review schema

**File:** `~/signals-gitdealflow/landing/index.html` (and duplicated in `de/index.html`, `es/index.html` — check both, re-verify these locale twins still exist and still carry the same block once you re-check the tree per §0.1).

**Root cause (confirmed live and in the current working tree, though NOT in the last git commit — see §0.2):** A JSON-LD block with `"@id": "https://gitdealflow.com/#rating"` (`AggregateRating`, `ratingValue: 4.6`, `ratingCount`/`reviewCount: 219`) plus `Review` nodes at `#review-ssrn`, `#review-receipts`, `#review-zenodo` are self-authored — the reviewer/author is the site's own SSRN preprint and its own founder persona, reviewing its own dataset/methodology. This is the exact self-serving-review pattern Google's structured-data spam policy targets, and the same pattern already found and removed on sibling sites `sipiteno.com` and `voicelogpro.com` in this same audit round.

**Fix:** Delete the entire JSON-LD block(s) containing `#rating`, `#review-ssrn`, `#review-receipts`, `#review-zenodo` from `index.html` (and `de/index.html`/`es/index.html` if the duplication still exists once you re-check). Do not replace with a fabricated alternative. If genuine third-party reviews or a real backtest citation exist that the owner wants represented, that's a separate owner-gated task (see §6) — do not invent a replacement.

**Verification (before commit):**
```bash
cd ~/signals-gitdealflow/landing
for f in index.html de/index.html es/index.html; do
  test -f "$f" && grep -c "aggregateRating\|#rating\"\|#review-ssrn\|#review-receipts\|#review-zenodo" "$f"
done   # every count must be 0 after the edit
python3 -c "
import re, json
for f in ['index.html']:
    t = open(f, encoding='utf-8').read()
    for m in re.finditer(r'<script type=\"application/ld\+json\">(.*?)</script>', t, re.S):
        json.loads(m.group(1))
print('remaining JSON-LD blocks still valid')
"
```

### TASK-02: Consolidate the duplicate Organization JSON-LD nodes

**File:** `~/signals-gitdealflow/landing/index.html`

**Root cause (confirmed live):** Two separate `Organization` nodes exist with different `@id` anchors and non-overlapping `sameAs` arrays:
- `"@id": "https://gitdealflow.com/#organization"` — the fuller node, `sameAs` includes LinkedIn/SSRN/Zenodo.
- `"@id": "https://gitdealflow.com/#org"` — a second, minimal node, `sameAs` includes Telegram/X/GitHub.

Search engines and LLM knowledge-graph builders consolidate entities by `@id` — two different IDs for the same brand fragments the entity instead of reinforcing it.

**Fix:** Merge into a single `Organization` node keeping the more complete `@id` (`#organization`), union **all** `sameAs` URLs from both nodes into it (LinkedIn, SSRN, Zenodo, Telegram, X, GitHub — don't drop any real, already-present URL from either node), and update every other schema block that currently references `#org` (check `WebSite.publisher`, any `Review.author`/`itemReviewed` — though those should already be gone per TASK-01, and any other cross-reference) to point at `#organization` instead. Delete the now-redundant `#org` node entirely.

**Verification (before commit):**
```bash
cd ~/signals-gitdealflow/landing
grep -c '"@id": "https://gitdealflow.com/#org"' index.html   # must be 0 (the minimal node is gone)
grep -c '"@id": "https://gitdealflow.com/#organization"' index.html   # must be >=1
python3 -c "
import re, json
t = open('index.html', encoding='utf-8').read()
for m in re.finditer(r'<script type=\"application/ld\+json\">(.*?)</script>', t, re.S):
    d = json.loads(m.group(1))
    if d.get('@type') == 'Organization':
        same_as = d.get('sameAs', [])
        assert any('linkedin' in u for u in same_as), 'lost LinkedIn from merged sameAs'
        assert any('x.com' in u or 'twitter' in u for u in same_as), 'lost X/Twitter from merged sameAs'
        assert any('github' in u for u in same_as), 'lost GitHub from merged sameAs'
        print('merged Organization sameAs OK:', same_as)
"
```

---

## 2. P2 — MEDIUM

### TASK-03: Fix the stale `signals@gitdealflow.com` → `signal@gitdealflow.com` across the whole repo

**Root cause (confirmed, and larger in scope than the original audit's file list):** The Organization JSON-LD `email` field (and many other places) still say `signals@gitdealflow.com` (plural), but the actual live sending identity — per prior owner decision (2026-07-19 revert) — is the singular `signal@gitdealflow.com`. This is not confined to the handful of files the audit named: a repo-wide search found the stale string in **59 files** (`.html` and `.txt`), not the ~9 originally listed.

**Fix — repo-wide, script-based, not manual file-by-file:**
```bash
cd ~/signals-gitdealflow/landing
grep -rl "signals@gitdealflow.com" . --include="*.html" --include="*.txt" | grep -v node_modules > /tmp/stale-email-files.txt
wc -l /tmp/stale-email-files.txt   # sanity-check the count before touching anything
```
Review the file list first — if it includes anything under a path that looks like generated output you shouldn't hand-edit (check for a `dist/`, `build/`, or similar generated-output directory that would just get overwritten on next build; if found, fix the generator/source instead of the generated copy). For genuine source files, do the replacement:
```bash
xargs -a /tmp/stale-email-files.txt sed -i '' 's/signals@gitdealflow\.com/signal@gitdealflow.com/g'
```
(macOS `sed -i ''` syntax — adjust if running elsewhere.) **Do not touch any occurrence that is part of a different domain or an unrelated string that merely contains this substring** — spot-check a sample of the diff before committing to make sure the replacement was clean and didn't corrupt anything adjacent (e.g. check no `signals.gitdealflow.com` subdomain references got mangled — that's the pSEO app's domain, a different string, but worth an explicit sanity check given the similarity).

**Verification (before commit):**
```bash
cd ~/signals-gitdealflow/landing
grep -rc "signals@gitdealflow.com" . --include="*.html" --include="*.txt" 2>/dev/null | grep -v ":0" | wc -l   # must be 0
grep -rc "signal@gitdealflow.com" . --include="*.html" --include="*.txt" 2>/dev/null | grep -v ":0" | wc -l    # must be >=59 (roughly the original count)
grep -c "signals.gitdealflow.com" index.html   # sanity check: this different string (the subdomain) should be UNCHANGED if it exists — confirms the replacement didn't over-match
```

---

## 3. P3 — LOW / verify-only

### TASK-04: Founder identity / E-E-A-T — flag only, this is not a technical fix

The founder persona ("The Data Nerd") is pseudonymous with no independently verifiable identity beyond a self-submitted ORCID and a non-peer-reviewed self-authored SSRN preprint. This is a real, structural trust ceiling for investment-adjacent content, but there is no code-level fix — adding a real identity disclosure, third-party-graded track record, or media coverage is a business/positioning decision. Do not attempt anything here; note it in your execution log as a standing item for the owner, same as it's already been noted in this portfolio's memory.

### TASK-05: CSS consolidation — verify with real data first, don't guess

Homepage loads three separate stylesheets (`styles.css` preloaded, `ux.css`, `inline.css` — confirmed at `index.html` lines ~250-401, re-verify exact lines once the tree is clean per §0.1). This is a real but unconfirmed CWV proxy risk — no actual Lighthouse/PageSpeed data has been pulled specifically for `gitdealflow.com` (as opposed to its sibling `signals.gitdealflow.com`). If you have real rendering/Lighthouse capability, measure actual LCP/CLS impact before consolidating anything — merging stylesheets carelessly risks breaking styles that are intentionally scoped differently (`ux.css` is a known shared cross-portfolio stylesheet with its own rules elsewhere in this owner's sites — don't merge it into the app bundle without checking what it's for first). If you have no rendering capability, skip this task and note it as unverifiable rather than guessing.

---

## 4. Deploy protocol — follow exactly, in order

1. Re-run the §0.1 STOP CONDITION check. **Do not proceed past this step unless the tree is clean or has only a small number of files you can positively identify as unrelated to your work.** This is the most important step in this entire brief.
2. Re-verify TASK-01/02/03's root causes against the current state (per §0.2, don't trust git history alone — check the live site and the current file contents directly) before editing anything, since significant time may have passed since this brief was written.
3. Make the TASK-01, TASK-02, TASK-03 edits.
4. Run every verification command from each task. All must pass before committing.
5. Commit (stage only the specific files these three tasks touch — given the scale of other activity on this repo, do **not** use `git add -A` under any circumstances):
   ```bash
   cd ~/signals-gitdealflow/landing
   git add index.html de/index.html es/index.html $(cat /tmp/stale-email-files.txt)
   git commit -m "fix: remove self-serving AggregateRating/Review schema, merge duplicate Organization @id nodes, correct stale signals@ email to signal@gitdealflow.com repo-wide"
   ```
6. Deploy:
   ```bash
   vercel --prod --yes --scope sales-3429s-projects
   ```

**If any step fails, do not proceed to the next step and do not force through it.** Report the exact error in your execution log (§7) and stop.

---

## 5a. Post-deploy verification — mandatory

```bash
# 1. Confirm the fabricated rating schema is gone from production
curl -s https://gitdealflow.com/ | grep -c "aggregateRating\|#rating\""   # must be 0

# 2. Confirm the Organization nodes are merged
curl -s https://gitdealflow.com/ | grep -c '"@id": "https://gitdealflow.com/#org"'   # must be 0
curl -s https://gitdealflow.com/ | grep -o '"@id": "https://gitdealflow.com/#organization".\{0,400\}' | grep -o '"sameAs":\[[^]]*\]'   # must show linkedin + x/twitter + github + ssrn/zenodo all present

# 3. Confirm the email fix is live
curl -s https://gitdealflow.com/ | grep -o '"email": *"[^"]*"'   # must show signal@gitdealflow.com, not signals@

# 4. Confirm the homepage is still fully rendered, not broken
curl -s https://gitdealflow.com/ | wc -c   # should still be roughly ~127KB, not near-zero
curl -s -o /dev/null -w "%{http_code}\n" https://gitdealflow.com/   # must be 200

# 5. Spot-check a few other routes weren't broken by the email find/replace
for path in /pricing /insider /about /affiliates; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://gitdealflow.com$path")
  echo "$path: $code"
done   # all must be 200
```

**If you have any headless-browser or screenshot capability, use it to visually confirm the homepage renders normally.**

## 5b. Rollback plan — use immediately if §5a verification fails

```bash
# Option A — instant: roll the Vercel alias back to the last known-good deployment
vercel rollback --scope sales-3429s-projects

# Option B — revert and redeploy clean
cd ~/signals-gitdealflow/landing
git revert --no-edit HEAD
vercel --prod --yes --scope sales-3429s-projects
```

---

## 7. Execution log — append your results here as you work

```
### 2026-07-21 run
- §0.1 STOP CONDITION check: [tree was clean / tree was still dirty and I waited N minutes / tree never cleared, work not attempted]
- TASK-01: done — removed AggregateRating/Review schema from index.html [+ de/es twins if present], verified 0 matches live
- TASK-02: done — merged #org into #organization, unioned sameAs (N URLs), verified live
- TASK-03: done — fixed stale email across N files (repo-wide grep found N, not the original ~9), verified live
- TASK-04: flagged for owner, no action taken (not a technical fix)
- TASK-05: [outcome — real Lighthouse data if available, or "skipped: no rendering capability"]
- Deploy: vercel --prod --yes succeeded
- Post-deploy verification: all 5 checks passed
- No rollback needed
```

---

## 6. Owner-gated — do not execute autonomously

- **Founder identity disclosure / third-party credibility signals** (TASK-04) — a business/positioning decision, not a technical fix.
- **CSS consolidation** (TASK-05) — only with real measured data; `ux.css` is a shared cross-portfolio stylesheet, don't merge it blind.
- **Any change to what's currently mid-flight in the 341-file dirty tree** (§0.1) — that work belongs to whoever is running it; this brief's scope is the three specific tasks above, nothing about the broader pSEO content restructuring apparently in progress.
- Anything not listed as a numbered TASK above.

---

**End of brief.** This repo requires more patience than any other in this portfolio — §0.1's stop condition is not a formality, it's the load-bearing instruction. Re-verify every task's root cause against current live/file state before acting (§0.2), never trust git history alone here, and verify after the deploy per §5a before considering the run complete.
