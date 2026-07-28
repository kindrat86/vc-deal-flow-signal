# Hermes Autonomous Execution Brief — signals.gitdealflow.com AEO/SEO Remediation

**Target repo:** `~/signals-gitdealflow` (monorepo — this git root also contains `landing/` for `gitdealflow.com`, a separate site with its own Hermes brief; this document is `pseo-site/`-only). **Live-deploy source is the `worldclass-signals` branch, NOT `main`.**
**Live domain:** https://signals.gitdealflow.com (Vercel project `pseo-site`, team `sales-3429s-projects`). **The domain is alias-pinned — a plain `vercel --prod` does NOT update the live alias.** You must explicitly `vercel alias set` after every deploy (see §4).
**Deploy method:** work from a git worktree checked out to `worldclass-signals` (none currently exists — you'll need to create one, see §4), run `vercel --prod` from inside it, then explicitly alias the resulting deployment to the live domain.
**Source audit:** 10-site portfolio AEO/SEO audit, 2026-07-21, signals.gitdealflow.com scored 89/100 — the second-highest score in the portfolio — with 0 critical + 1 medium + 4 low findings.
**Executor:** Hermes Agent (autonomous, DeepSeek v4 Pro). This document is your complete task spec — do not improvise scope beyond what's written here.

**Important methodology note:** this brief required checking two different branches to get the ground truth right. The repo's `main` branch has a large, unrelated, in-progress redesign (a font/theme change) that is **not** what's live in production — production is built from `worldclass-signals`. Every root cause below was verified against `worldclass-signals`, not `main`. One finding turned out to be a deliberate, carefully-reasoned design decision rather than a mistake — see TASK-02, which is why it stays owner-gated even though a naive read of the audit would suggest a quick fix.

---

## 0. Read this whole section before touching anything

### 0.1 Branch confusion is the #1 risk on this repo — verify which branch you're actually looking at, always

```bash
cd ~/signals-gitdealflow
git branch --show-current   # main, most likely — this is NOT what's live
git worktree list           # check whether a worldclass-signals worktree already exists
curl -s https://signals.gitdealflow.com/ | grep -io "space_grotesk\|instrument_sans"   # sanity check: live site currently uses Space Grotesk (worldclass-signals), not Instrument Sans (main's in-progress redesign)
```

**Every file/line citation in this brief refers to the `worldclass-signals` branch, not `main`.** If you `grep` or edit a file on `main` expecting to find what's described below, you may see different, unrelated, in-progress content (a font/design refresh + a new `/ticker/embed` widget feature) — that's real work belonging to someone else, not something to touch or interfere with. Do all of your own work against `worldclass-signals`, ideally via a dedicated git worktree so you never accidentally check out `main` over other uncommitted work in the primary working directory.

### 0.2 Collision check

```bash
ps aux | grep -i hermes | grep -v grep
cd ~/signals-gitdealflow && git status --short | wc -l
```

At brief-writing time, `main`'s working tree had 342 modified/untracked files across the whole monorepo (including `landing/`, which has its own separate brief and its own separate collision caution — not your concern here) plus 31 files specifically under `pseo-site/` on `main` (font redesign + ticker widget, confirmed unrelated to any task in this brief, confirmed **not** touching the CSP/Trusted-Types configuration). If you're working correctly in a fresh `worldclass-signals` worktree per §0.1, this dirty `main` tree should not affect you at all — it's a different checkout. Just don't `cd` back into the primary `~/signals-gitdealflow/pseo-site` directory (which is on `main`) and start editing there by mistake.

### 0.3 The single most important rule on this site — read this twice

**A `Content-Security-Policy` header containing `require-trusted-types-for 'script'` with no matching `trustedTypes.createPolicy()` shim renders the site COMPLETELY BLANK on load.** This exact failure mode already happened on this exact domain (and on a sibling site, `churnlens.site`) for ~40 hours each before being caught, precisely because a `curl` or plain HTTP-status check does not reveal it — the server still returns full HTML, the blank screen only happens client-side after the browser parses the CSP and refuses to execute scripts that aren't Trusted-Types-wrapped.

**Currently this site is correctly configured** — confirmed via live screenshot (hero/nav/data cards all render) and confirmed the inline `trustedTypes.createPolicy('default', {...})` shim in `pseo-site/app/layout.tsx` sits before `/ux.js` loads. **No task below touches this pairing.** But you must re-verify it with an actual rendered check (not just `curl` status) after every deploy you make from this brief — see §5a. If you ever need to touch `next.config.ts`'s CSP headers or `layout.tsx`'s `<head>` script ordering for any reason outside this brief's scope, treat that as maximally high-risk and always screenshot-verify before considering it done.

### 0.4 Guardrails you must never bypass

- Never use `git commit --no-verify`. Always create new commits; never `git commit --amend` on a commit that's already been pushed/deployed. Never `git push --force` to `main` or `worldclass-signals`.
- Never touch `pseo-site/app/layout.tsx` lines governing the Trusted-Types shim, or the global CSP header block in `next.config.ts` (the `source: "/(.*)"` rule) — out of scope for every task in this brief.

### 0.5 What you are NOT authorized to change autonomously

See §6 "Owner-gated — do not execute" at the bottom. Anything not explicitly listed as a task in §1–§2 is out of scope.

---

## 1. P2 — MEDIUM

### TASK-01: Investigate and resolve the failing `refgrowcdn.com` tracking script

**Files:** `pseo-site/app/layout.tsx` (script tag, ~line 408), `pseo-site/next.config.ts` (CSP allowlist, `script-src` ~line 244 and `connect-src` ~line 248) — both confirmed present on `worldclass-signals`.

**Root cause (partially confirmed, needs a real-browser check to finish confirming):** The homepage loads `https://scripts.refgrowcdn.com/latest.js` (a third-party affiliate/referral tracking vendor, `data-project-id="829"`) via `next/script` with `strategy="lazyOnload"`. The audit observed repeated browser console errors — `Error loading tracking data: TypeError: Failed to fetch` — from this script on every homepage load. Note: the script **file itself** loads fine (confirmed via direct `curl`, returns 200) — the failure is an API call the script makes internally after it loads, which curl cannot observe. **You need actual browser/console inspection to confirm this is still happening before acting** — do not act on the curl-only signal alone, it doesn't prove or disprove the actual failure.

**Action:**
1. If you have headless-browser or console-inspection capability: load `https://signals.gitdealflow.com/`, wait for the lazy-loaded script to fire, and check the console for the exact error the audit described. If it's still failing consistently, proceed to the fix below. If it's not reproducing (vendor may have fixed their backend since the audit), close this out in your execution log as resolved-upstream, no code change needed.
2. If you have no browser/console capability, **do not guess** — skip the fix and flag this in your execution log as unconfirmed, recommending a follow-up run with browser tooling.

**Fix (only if the error is confirmed still reproducing):** Remove the script tag from `layout.tsx` and its two CSP allowlist entries from `next.config.ts` (`https://scripts.refgrowcdn.com` in both `script-src` and `connect-src`). This is a reasonably safe, reversible removal — a persistently-broken third-party call is pure waste (a render-blocking-adjacent request that never succeeds) regardless of whether the referral program itself is still commercially active; if the program is active but broken, removing the client-side call doesn't affect the business relationship, it just stops shipping a broken integration to every visitor. If you're at all unsure whether this integration is still commercially load-bearing (e.g., you find evidence elsewhere in the repo suggesting active referral-program usage), flag it for the owner instead of removing it — see §6.

**Verification (before commit, if you proceed with the fix):**
```bash
cd ~/signals-gitdealflow/pseo-site   # from your worldclass-signals worktree
grep -c "refgrowcdn" app/layout.tsx next.config.ts   # both must be 0
npx tsc --noEmit 2>&1 | tail -20   # confirm no new type errors introduced
```

---

## 2. Read-only audit task (no code changes)

### TASK-02: Full pSEO sitemap crawl for thin/duplicate content

**Root cause:** The source audit spot-checked only 6 inner pages; the full sitemap set (segmented into core/high-intent/sectors/crossings/startups/content sitemaps) has never been crawled end-to-end for title/meta/schema consistency or thin-content risk.

**Action:** This is safe, useful, read-only work you can actually complete (unlike TASK-01's browser dependency):
```bash
curl -s https://signals.gitdealflow.com/sitemap.xml   # or sitemap-index.xml — find the real index file first
# then fetch each segment sitemap and extract every <loc>
# for a sample (or all, if volume is manageable) URL, curl the page and record:
#   - HTTP status
#   - <title> content
#   - approximate visible body-text length (strip tags, count chars)
```
Look for: any URL returning non-200, any two URLs sharing an identical `<title>`, and any cluster of pages whose body-text length is suspiciously uniform (a sign of template-only boilerplate with no real per-page differentiation — the exact pattern already found and partially fixed on sibling sites `carshake.online` and `churnlens.site` in this same audit round). Given the site's scale, sampling 15-20 URLs spread across each of the 5 sitemap segments is a reasonable depth for one run rather than attempting an exhaustive crawl.

**Output:** A summary in your execution log — total URLs sampled, any non-200s found, any title duplicates found, any suspiciously uniform/thin pages found. **Do not attempt to fix anything found here as part of this brief** — this task's job is to produce an accurate report; any real issues it surfaces should become their own follow-up task once reviewed, since the generator/template code for these pSEO families hasn't been identified or verified in this brief.

---

## 3. Verify-only, no code changes authorized

### TASK-03: Core Web Vitals — verify with real data, don't guess

Homepage HTML is 467KB with 103 `<script>` tags — heavier than typical for a pSEO landing page. No real Lighthouse/CrUX data has been pulled. If you have rendering capability, measure real LCP/INP/CLS and report which specific scripts are on the critical path in your execution log. If not, skip rather than guessing at which of the 103 scripts to defer — a wrong guess here risks breaking the very Trusted-Types/CSP pairing this brief is most protective of (§0.3).

---

## 4. Deploy protocol — follow exactly, in order

This is the one Hermes brief in this portfolio where the deploy mechanics themselves are non-standard — read carefully.

1. Set up (or reuse, if one already exists) a git worktree on `worldclass-signals`, separate from the primary `~/signals-gitdealflow` working directory (which stays on `main` and has unrelated work in flight, see §0.1-0.2):
   ```bash
   cd ~/signals-gitdealflow
   git worktree list   # check for an existing worldclass-signals worktree first
   # if none exists:
   git worktree add ../signals-worldclass worldclass-signals
   cd ../signals-worldclass/pseo-site
   ```
2. Re-run the §0.2 collision check inside this worktree (`git status --short` here should be clean, since it's a fresh checkout — if it's not, something unexpected happened, stop and report).
3. Complete TASK-01 (if the browser-verified error still reproduces) and TASK-02 (the read-only crawl, no commit needed for this one — it just produces a log entry).
4. Run TASK-01's verification commands if you made that edit. Must pass before committing.
5. Commit (only if TASK-01 produced a real edit):
   ```bash
   git add app/layout.tsx next.config.ts
   git commit -m "fix: remove failing refgrowcdn.com tracking script and CSP allowlist entries"
   ```
6. Push the branch:
   ```bash
   git push origin worldclass-signals
   ```
7. Deploy from this worktree:
   ```bash
   vercel --prod --scope sales-3429s-projects
   ```
   Vercel will print a fresh deployment URL (e.g. `https://pseo-site-<hash>-sales-3429s-projects.vercel.app`) — **note it, you need it for the next step.**
8. **Explicitly point the live alias at the new deployment — this is the step that's easy to forget and, if skipped, means nothing you just did actually goes live:**
   ```bash
   vercel alias set <the-deployment-url-from-step-7> signals.gitdealflow.com --scope sales-3429s-projects
   ```

**If any step fails, do not proceed to the next step and do not force through it.** Report the exact error in your execution log (§7) and stop.

---

## 5a. Post-deploy verification — mandatory, and non-negotiable on this specific site

```bash
# 1. Confirm the alias actually moved (not just that a new deployment exists)
vercel inspect signals.gitdealflow.com --scope sales-3429s-projects | grep -A3 "Aliases\|Source"

# 2. Confirm the site is not blank — curl status alone does NOT prove this, see §0.3
curl -s https://signals.gitdealflow.com/ | wc -c   # should still be roughly ~460KB+, not near-zero
curl -s https://signals.gitdealflow.com/ | grep -c "trustedTypes.createPolicy"   # must be >=1

# 3. If TASK-01's fix was made, confirm the script is actually gone from the live page
curl -s https://signals.gitdealflow.com/ | grep -c "refgrowcdn"   # must be 0

# 4. Spot-check a few other routes
for path in / /sectors /pricing /methodology /about; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "https://signals.gitdealflow.com$path")
  echo "$path: $code"
done   # all must be 200
```

**You must use a headless-browser or screenshot capability here if at all available, and treat it as mandatory rather than optional for this specific site.** A `curl` 200 with a full HTML payload is exactly what this site returned during its prior ~40-hour blank-screen incidents — the failure is invisible to every check above except a real rendered screenshot showing the hero/nav/data actually painting on screen. If you have no rendering capability at all, say so explicitly in your execution log as a real limitation, not a passed check.

## 5b. Rollback plan — use immediately if §5a verification fails

```bash
# Instant: point the alias back at the previous known-good deployment
vercel ls pseo-site --scope sales-3429s-projects   # find the previous deployment URL
vercel alias set <previous-deployment-url> signals.gitdealflow.com --scope sales-3429s-projects
```
This is faster and safer than a git revert + redeploy cycle on this specific site, since the alias-pinning means you can roll back the live domain instantly without touching the branch history at all — do this first, then investigate/fix the branch separately afterward.

---

## 7. Execution log — append your results here as you work

```
### 2026-07-21 run
- §0.1 branch check: confirmed working from worldclass-signals worktree, live site fonts matched (Space Grotesk) before starting
- TASK-01: [browser-confirmed still failing → removed script + CSP entries, verified live / browser-confirmed resolved upstream, no action / unconfirmed, no browser capability, flagged for follow-up]
- TASK-02: crawled N URLs across 5 sitemap segments — [X non-200s, X title duplicates, X thin-content candidates] — see detail below
- TASK-03: [outcome — real Lighthouse data if available, or "skipped: no rendering capability"]
- Deploy: worktree created/reused, vercel --prod succeeded, alias explicitly set to new deployment
- Post-deploy verification: alias confirmed moved, TT shim intact, homepage screenshot confirmed non-blank [or: no rendering capability, relying on payload-size proxy only]
- No rollback needed
```

---

## 6. Owner-gated — do not execute autonomously

- **The `NewsMediaOrganization` schema dual-typing** — the audit flagged this as a low-severity "aggressive claim" that should maybe be dropped. Verification found this is **not an oversight** — `pseo-site/components/RootIdentitySchema.tsx` lines 103-111 carry an explicit, carefully-reasoned in-code comment explaining exactly why this choice was made: *"noBylinesPolicy is the load-bearing one: it states the pseudonymous byline is a declared editorial policy, not a missing-author trust gap."* Someone already thought through precisely the E-E-A-T concern the audit raises and made a deliberate counter-positioning via schema design (`publishingPrinciples`, `correctionsPolicy`, `noBylinesPolicy`, `ownershipFundingInfo` all present specifically to make the `NewsMediaOrganization` typing domain-valid). Reverting this without understanding — or explicitly re-litigating — that reasoning would undo a deliberate decision, not fix a mistake. Flag it for the owner to revisit if they want, but do not touch `RootIdentitySchema.tsx`'s `@type` array.
- **Referral/affiliate program business status** (if TASK-01's browser check can't determine whether refgrowcdn.com's failure reflects a truly-dead integration vs. a temporary vendor outage) — flag for owner rather than guessing.
- **Any fixes surfaced by TASK-02's crawl** — that task is read-only reporting only; turning findings into fixes is a separate, future-scoped task once reviewed.
- Anything not listed as a numbered TASK above.

---

**End of brief.** This is the one site in the portfolio where branch discipline (§0.1) matters more than file-level collision checking — verify you're looking at `worldclass-signals`, not `main`, before trusting anything in this document against the live repo. Verify after the deploy per §5a with an actual rendered check, not just curl, before considering the run complete.
