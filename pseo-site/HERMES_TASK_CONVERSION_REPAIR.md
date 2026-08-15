# HERMES TASK — signals.gitdealflow.com Conversion Repair

> ⚠️ **HISTORICAL (authored 2026-07-22). Do NOT execute.** This checkout
> (`~/signals-worldclass`) is RETIRED since 2026-08-12 (sentinel-enforced:
> its builds abort in prebuild). Canonical live source:
> `~/signals-gitdealflow/pseo-site` on `main`. This file is kept for archaeology.

**Target site:** signals.gitdealflow.com — **64% of all portfolio traffic** (5,843 pageviews / 5,178 sessions in 90 days, **93.4% bounce**, ~0 conversions)
**Repo / worktree:** `~/signals-worldclass/pseo-site` — Next.js **App Router**, branch **`worldclass-signals`**
**Vercel project:** `pseo-site` / `prj_s0JL6C4uFTmt83OnzAZDgeMDnlaU`
**Authored:** 2026-07-22
**Executor:** Hermes Agent (DeepSeek v4 Pro), autonomous
**Objective:** This domain is the portfolio's single biggest traffic asset and its single biggest leak. It advertises a price **5× lower than the card is actually charged**. Fix that first. Everything else is secondary.

---

## 0. READ THIS FIRST — FIVE HARD RULES

These override every other instruction. Rule 1 is the one that most commonly destroys this task.

### RULE 1 — YOU ARE IN THE WRONG DIRECTORY BY DEFAULT

There are **two worktrees** of this repo on this machine:

| Path | Branch | Status |
|---|---|---|
| `~/signals-gitdealflow` | `main` (was `internal-link-engine`) | **CANONICAL since 2026-08-12.** Work and deploy from here only. |
| `~/signals-worldclass` | `worldclass-signals` | **RETIRED 2026-08-12.** NOT live. Historical only. |

```bash
git worktree list
# /Users/sipi/signals-gitdealflow  [main]                 <- CANONICAL since 2026-08-12; work and deploy from here only
# /Users/sipi/signals-worldclass   [worldclass-signals]   <- RETIRED 2026-08-12; historical only
```

(Historical.) Editing this retired checkout (`~/signals-worldclass/pseo-site/`) will not reach production (its builds abort via the sentinel). Canonical live source: `~/signals-gitdealflow/pseo-site` on `main`. Every path in this document was relative to the now-retired `~/signals-worldclass/pseo-site`.
```bash
cd ~/signals-worldclass/pseo-site && git branch --show-current   # MUST print: worldclass-signals
```

### RULE 2 — NEVER BLIND FIND/REPLACE A PRICE

`€97` is **correct** in one place and **wrong** in another:
- `€97` attached to **Insider Circle** → **WRONG** (Insider is €197/mo).
- `€97` attached to **Summit All-Access Pass** → **CORRECT** (`unitAmount: 9700`).

A global `sed s/€97/€197/` corrupts the Summit product. Every price edit must be made **by reading the surrounding product name**, one occurrence at a time.

### RULE 3 — THREE FILES HAVE BLANK-SCREENED THIS SITE IN PRODUCTION

Do **not** modify, and do not "clean up", any of:
- `app/layout.tsx` — currently loads `/ux.css` (line 191) and `/ux.js` (line 192). `/ux.js` has previously **blank-screened this exact site** via an App Router hydration wipe. The Trusted Types policy at ~line 174 exists specifically to keep it alive.
- `next.config.ts` — carries `require-trusted-types-for 'script'` (line 251). This CSP directive has previously **blocked PostHog injection** across this portfolio. Changing CSP here is a separate, owner-reviewed task.
- `public/ux.js` / `public/ux.css`.

If your change appears to require touching any of these, **stop and record it** instead.

### RULE 4 — NEVER FABRICATE PROOF
No invented subscriber counts, testimonials, logos, or scarcity. This site currently has **zero verified customers** on this domain. If you cannot source a claim from a file in this repo, it does not go on the page. Removing a false claim is always allowed; inventing a replacement never is.

### RULE 5 — `curl` CANNOT VERIFY THIS SITE
A previous blank-screen incident returned **HTTP 200 with valid HTML** while rendering a completely white page (client-side hydration wipe). `curl -I` — including the command printed by `scripts/deploy-prod.sh` itself — **will lie to you**. Post-deploy verification must include a **rendered screenshot** (Section 6).

---

## 1. PRE-FLIGHT (abort conditions)

```bash
cd ~/signals-worldclass/pseo-site
```

**1.1 — Correct worktree and branch.**
```bash
pwd                        # MUST be /Users/sipi/signals-worldclass/pseo-site
git branch --show-current  # MUST be worldclass-signals
git rev-parse HEAD         # RECORD — rollback target
```
**ABORT** if either differs.

**1.2 — Another agent active?**
```bash
ps aux | grep -i hermes | grep -v grep
```
`hermes-webui/server.py` and `hermes_cli.main serve` are normal. **ABORT** if any process references `signals-worldclass`, `pseo-site`, or a `vercel` deploy in flight. The auto-deploy loop for this site is **disabled** — if you see one running, something is wrong; abort.

**1.3 — Baseline the working tree.**
```bash
git status --short
```
Expect a small set of **generated/automated** files already modified: `content/signal-report-latest.ts`, `data/audit/pseo-*.json`, `public/downloads/seven-signals.epub`, `emails/*`. These are digest-generation artifacts. **Leave them alone — never stage them.** **ABORT** if you see uncommitted edits to `app/`, `components/`, or `lib/` — that means a human or another agent is mid-edit.

**1.4 — Git author.**
```bash
git config user.email   # MUST be sales@sipiteno.com
```

**1.5 — Live baseline.**
```bash
curl -s https://signals.gitdealflow.com/ | grep -c "9.97"   # expect >0 today (the bug)
curl -s -o /dev/null -w "%{http_code}\n" https://signals.gitdealflow.com/pricing
```

**1.6 — Green build BEFORE any edit.**
```bash
pnpm typecheck    # or: npx tsc --noEmit
```
**ABORT** if typecheck fails on a clean tree — you must not inherit someone else's breakage.

---

## 2. THE DIAGNOSIS

### 2.1 — P0: THE SITE ADVERTISES A PRICE 5× LOWER THAN IT CHARGES

`lib/stripe-tiers.ts` is the **only** source of truth — these `unitAmount` values (in cents) are what Stripe genuinely bills:

| Product | `unitAmount` | **Actually charged** | Mode |
|---|---|---|---|
| First Look Pass | `700` | **€7** | one-time |
| **Dashboard** | `4900` | **€49 / month** | subscription |
| **Insider Circle** | `19700` | **€197 / month** | subscription |
| Sector Sweep | `199700` | **€1,997** | one-time |
| Summit All-Access | `9700` | **€97** | one-time |
| Methodology Vault (bump) | `1900` | €19 | one-time |
| Deal Flow Playbook (bump) | `700` | €7 | one-time |
| Extra Sector (OTO) | `1700` | €17 | one-time |

**The defect:** large parts of the site advertise **Dashboard at €9.97/mo** and **Insider at €97/mo**. A visitor who clicks *"Lock €9.97/mo founder price"* reaches a Stripe checkout that charges **€49** — **five times** the advertised price. Insider is advertised at €97 and charges **€197**.

This is not a cosmetic inconsistency. It is advertising a price the checkout will not honour, at the exact moment of payment. It is the most likely single cause of this domain converting ~nothing despite 5,178 sessions, and it carries chargeback and consumer-protection exposure.

**Known wrong-price locations** (verify each; line numbers may drift):

| File | Lines | Wrong claim |
|---|---|---|
| `app/page.tsx` | 1114, 1541, 1553, 1582 | €9.97/mo Dashboard (homepage) |
| `app/pitch/page.tsx` | 181, 209 | €9.97/mo Dashboard |
| `app/tools/page.tsx` | 243 | €9.97/mo Dashboard |
| `app/build-vs-invest/[sector]/page.tsx` | 693, 707 | €9.97/mo Dashboard |
| `app/continuity/page.tsx` | 182, 356, 389 | €97/mo Insider |
| `app/continuity/[slug]/page.tsx` | 252, 293, 309 | €97/mo Insider |
| `app/apply/page.tsx` | 29, 75 | €97/mo Insider |
| `app/identity/page.tsx` | 128 | €9.97/mo inside a testimonial quote |

Enumerate the live set yourself:
```bash
grep -rnE "9\.97" --include="*.tsx" --include="*.ts" app components lib content
grep -rnE "€ ?97\b" --include="*.tsx" --include="*.ts" app components lib content
```
**For the second command, read each hit's surrounding product name** before deciding — see RULE 2.

### 2.2 — P0: The first viewport contains no CTA

The hero renders the headline (*"Crunchbase tells you the day they raised. We tell you 47 days before the deck."*) plus three stat callouts (`3.4x`, `21-47d`, `n=219`) — and **no button**. With 93.4% bounce, most visitors never scroll to the first real CTA. The single largest traffic asset in the portfolio has no reachable action above the fold.

### 2.3 — P1: ~20 competing sections, no single goal

The homepage runs: origin story → Hook-Story-Offer explainer → 5-step epiphany bridge → this-week's-movers → wealth/status sections → category definition → 3 objections → a **second** origin-story retelling → 2-step opt-in → **two gamified lead magnets** (Scout Score, Predict) → offer stack → Charter Cohort → 8 polarities → manifesto → 3-tier pricing → a **separate** high-ticket ladder → 15 sector cards → blog feed → research findings → 12 comparison links → 18-item pillar directory.

Three separate price ladders and two games compete with the one thing that matters: the free digest opt-in.

### 2.4 — P1: Self-defeating scarcity

The Charter Cohort shows **"0 claimed · 25 open"**. This is *anti*-social-proof: it advertises that nobody has bought. Scarcity framing only works when consumption is visible.

### 2.5 — P2: An unverifiable testimonial

`app/identity/page.tsx:128` contains a customer quote:
> *"We dropped Tracxn at €4.2k/month. The dashboard at €9.97/mo replaced one analyst-hour per week of manual digging…"*

This domain has **no verified customers**. The quote also embeds the wrong price. Treat as unverified.

### 2.6 — P2: A silently failing email capture

PostHog records `squeeze_email_capture_failed` (3 events / 90 days) — a **broken path**, not merely low intent. The emitter is **not** in this worktree:
```bash
grep -rn "squeeze_email_capture_failed" ~/signals-worldclass ~/signals-gitdealflow 2>/dev/null | grep -v node_modules
```
Locate it before attempting a fix. If it lives in another property, **record it and do not fix it here**.

---

## 3. EXECUTION

Work in order. Each step has a gate. A failed gate → revert **that step only**, record it, continue.

### STEP 3.1 — Make every displayed price match what Stripe charges

**This is the whole task. If you do nothing else, do this.**

For each occurrence found in 2.1, correct the **displayed** price to the canonical value from the table:
- Dashboard: `€9.97/mo` → **`€49/mo`**
- Insider Circle: `€97/mo` → **`€197/mo`**
- Leave **Summit All-Access €97** exactly as it is.

Handle the surrounding copy, not just the digits — several sites read as rhetorical setups that break when the number changes:
- `app/page.tsx:1541,1553` form a rhetorical pair (*"…be worth €97/month?" / "…would €9.97/month be a fair trade?"*). Rewrite the pair so the logic still lands with €197 and €49. Do **not** leave a dangling comparison.
- `app/page.tsx:1114` reads *"€1,728 vs €9.97/mo founding rate"*. The €1,728 figure is a value-stack total; update the comparison so it is truthful against €49/mo, or remove the comparison. **Do not invent a new value-stack total.**
- `app/page.tsx:1582` reads *"A free rung, a €7 rung, a €9.97/mo rung…"* — correct to €49/mo.
- `app/identity/page.tsx:128` — see Step 3.4; the whole quote is likely coming out.

**Do not modify** `lib/stripe-tiers.ts`, `app/api/webhook/stripe/route.ts`, or `app/api/v1/pricing.json/route.ts` to match the *displayed* prices. The charged amounts are correct; **the display is wrong**. Changing `unitAmount` would alter what real customers are billed and is strictly forbidden.

**Gate 3.1 — all must pass:**
```bash
# no Dashboard-at-9.97 anywhere
grep -rn "9\.97" --include="*.tsx" --include="*.ts" app components lib content   # MUST be empty

# every remaining €97 must be Summit-related — inspect each hit BY HAND
grep -rn "€ ?97\b" --include="*.tsx" --include="*.ts" app components lib content

# the charged amounts are untouched
git diff --stat lib/stripe-tiers.ts app/api/   # MUST be empty

pnpm typecheck
```

---

### STEP 3.2 — Put a CTA in the first viewport

**File:** `app/page.tsx` (hero section, immediately after the subhead / stat callouts).

Add **one** styled primary CTA button that scrolls to the existing email opt-in anchor — reuse the anchor the page already uses; do not invent a new route. Label it for the free offer, e.g. **"Get this Sunday's 5 names — free"**.

Requirements:
- Exactly **one** primary-styled button in the hero. Do not add a second.
- Reuse an existing button component/class already used on this page — do not introduce new styling.
- Per the site's layout convention: **headings and heroes are centered, body copy is left-aligned.** Keep the CTA consistent with the centered hero.
- Fire a PostHog event using the pattern already present in the codebase (e.g. `hero_cta_clicked`).

**Gate 3.2:** `pnpm typecheck` passes, and the hero contains exactly one primary button. Verify visually in Section 6 — **not** by curl.

---

### STEP 3.3 — Neutralise the self-defeating scarcity

Find the Charter Cohort counter:
```bash
grep -rn "claimed\|25 open\|Charter Cohort" --include="*.tsx" app components | head
```
Replace *"0 claimed · 25 open"* with framing that does not advertise zero uptake — state the cohort cap **without** a claimed count (e.g. *"Charter Cohort — capped at 25 members"*). **Do not invent a claimed number.** If the count is wired to real data, leave the wiring and hide the "claimed" figure only while it is zero.

**Gate 3.3:** `grep -rn "0 claimed" app components` returns nothing; typecheck passes.

---

### STEP 3.4 — Remove the unverifiable testimonial

**File:** `app/identity/page.tsx` (~line 128).

This domain has no verified customers, and the quote also embeds the now-wrong €9.97 price. **Remove the testimonial block.** Do not replace it with a different quote. If removing it leaves an empty section wrapper, remove the wrapper too rather than leaving a hollow heading.

Then sweep for siblings:
```bash
grep -rnE "\"We (dropped|replaced|switched)|—\s*(Partner|Principal|Analyst|GP|LP)\b" --include="*.tsx" app components | head -20
```
Any quote you cannot trace to a real, named, verifiable source is unverified. Record each one you remove, and each one you leave in place because you were unsure.

**Gate 3.4:** `grep -rn "dropped Tracxn" app components` returns nothing; typecheck passes.

---

### STEP 3.5 — Homepage section reduction (OPTIONAL — only if Steps 3.1–3.4 are green and deployed)

**Do not attempt this in the same deploy as 3.1.** It is a large, high-risk edit to a 20-section page on the portfolio's biggest traffic asset, and it must not be entangled with the price fix in a single revert.

If undertaken as a **separate, later** run:
- Target: reduce to **≤ 6** homepage sections.
- Keep: hero + CTA, the proof/stat block, this-week's-movers, the opt-in form, one pricing reference, footer.
- Relocate (do not delete): manifesto, 8 polarities, the second origin-story retelling, the 5-step framework, the research panel, the pillar directory — move to their own routes and link to them.
- Remove from the homepage: the two gamified lead magnets and the high-ticket ladder (keep them on `/pricing` and their own pages).
- Every relocated section must keep a working URL — this site's pSEO depends on those pages existing. **Never delete content that a sitemap references.** Check `app/sitemap*` before removing any route.

---

## 4. VALIDATION (before deploy)

```bash
cd ~/signals-worldclass/pseo-site

# 4.1 Price truth
grep -rn "9\.97" --include="*.tsx" --include="*.ts" app components lib content   # MUST be empty
git diff --stat lib/stripe-tiers.ts app/api/                                     # MUST be empty

# 4.2 Landmine files untouched
git diff --name-only | grep -E "layout\.tsx|next\.config\.ts|ux\.(js|css)"       # MUST be empty

# 4.3 Types + lint
pnpm typecheck
pnpm lint

# 4.4 Generated artifacts NOT staged
git status --short | grep -E "signal-report-latest|pseo-(coverage|uniqueness)|seven-signals\.epub|emails/"
# these may appear as modified, but must NOT appear in `git diff --cached`

# 4.5 Full production build (prebuild runs data generation; postbuild runs pSEO audits + IndexNow)
npx vercel build --prod
```
**Do not deploy if `npx vercel build --prod` fails.** Note that `postbuild` submits IndexNow/WebSub — that is expected on a real build.

---

## 5. COMMIT & DEPLOY

**5.1 — Stage explicitly. Never `git add -A`** (it would sweep the generated digest artifacts).
```bash
git add app/page.tsx app/pitch/page.tsx app/tools/page.tsx \
        "app/build-vs-invest/[sector]/page.tsx" app/continuity/page.tsx \
        "app/continuity/[slug]/page.tsx" app/apply/page.tsx app/identity/page.tsx
git status --short   # REVIEW: no layout.tsx, no next.config.ts, no ux.*, no data/audit/*
```

**5.2 — Commit.**
```bash
git commit -m "fix(signals): display the prices Stripe actually charges

Dashboard was advertised at EUR 9.97/mo and Insider at EUR 97/mo across the
homepage and 7 other routes, while lib/stripe-tiers.ts bills 4900 and 19700 —
visitors were quoted 5x less than the checkout charges.

- Correct displayed Dashboard price to EUR 49/mo, Insider to EUR 197/mo
- Leave Summit All-Access at EUR 97 (genuinely 9700)
- Charged amounts in stripe-tiers.ts / webhooks left untouched
- Add a primary CTA to the first viewport
- Drop 0-claimed scarcity counter and an unverifiable testimonial"
```

**5.3 — Deploy.**
```bash
pnpm deploy:prod        # = npx vercel build --prod && npx vercel deploy --prebuilt --prod --archive=tgz
```
`--archive=tgz` is **mandatory** — this artifact exceeds 25,000 files and Vercel's plain-upload path caps at 15,000. `scripts/deploy-prod.sh` bakes the flag in.

**5.4 — ⚠ THE ALIAS PIN — the deploy is NOT live until you do this.**

`scripts/deploy-prod.sh` does **not** update the domain alias, and this domain is **alias-pinned**: a successful `--prod` deploy can complete while `signals.gitdealflow.com` still serves an **older** deployment. Agents have previously reported success here while changing nothing live.

After deploying, capture the new deployment URL from the CLI output and point the domain at it explicitly:
```bash
npx vercel alias set <NEW_DEPLOYMENT_URL> signals.gitdealflow.com
```
Then confirm the alias actually moved:
```bash
npx vercel inspect https://signals.gitdealflow.com 2>&1 | head -20
```
**If you skip 5.4, treat the task as FAILED regardless of what the deploy printed.**

---

## 6. POST-DEPLOY VERIFICATION — SCREENSHOT REQUIRED

`curl` returning 200 does **not** prove this site renders. A prior incident served valid HTML with a blank page.

```bash
sleep 45

# 6.1 The price fix is live
curl -s https://signals.gitdealflow.com/ | grep -c "9.97"   # MUST be 0
curl -s https://signals.gitdealflow.com/pricing | grep -c "9.97"  # MUST be 0

# 6.2 Routes healthy
for u in / /pricing /pitch /tools /continuity /apply /identity; do
  printf "%s -> %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' https://signals.gitdealflow.com$u)"
done   # ALL MUST be 200
```

**6.3 — MANDATORY rendered check.** Load `https://signals.gitdealflow.com/` in a real browser engine and capture a screenshot. Confirm with your own eyes that:
- the page renders content (not a white screen),
- the hero shows the new CTA button,
- no console error mentions **Trusted Types**, **CSP**, or a blocked script.

A blank render means the Trusted Types / `ux.js` landmine has re-triggered → roll back immediately.

**Rollback:**
```bash
git revert --no-edit HEAD
pnpm deploy:prod
npx vercel alias set <NEW_DEPLOYMENT_URL> signals.gitdealflow.com   # rollback needs the alias too
```

---

## 7. REPORT (write this file, always — even on abort)

Write `~/signals-worldclass/pseo-site/HERMES_REPORT_CONVERSION_REPAIR.md` with:

1. **Price-correction table** — every file/line changed, old → new displayed value, and the product name you read to decide. Explicitly list every `€97` you **kept** and why (Summit).
2. **Confirmation** that `lib/stripe-tiers.ts` and `app/api/**` were not modified.
3. **Alias step** — the deployment URL and the `vercel alias set` output. State plainly whether the live domain moved.
4. **Screenshot result** — rendered or blank, and any console errors.
5. **`squeeze_email_capture_failed`** — where the emitter lives, or "not found in either worktree".
6. **Testimonials** — which you removed, and which you left because you could not judge them.
7. **Steps skipped** and the gate output that caused each skip.
8. **Escalate to owner:**
   - Whether **€9.97 / €97 were ever the intended founding prices**. If real customers were sold at those rates, correcting the display is right but those customers' existing subscriptions need a decision — **do not touch existing Stripe subscriptions**.
   - This domain has **zero verified customers and zero testimonials**; the "0 claimed of 25" counter was advertising that. Real proof has to be earned, not written.
   - Step 3.5 (section reduction) is deliberately deferred as its own task.

---

## 8. WHAT SUCCESS LOOKS LIKE

- `grep -rn "9\.97"` across `app/ components/ lib/ content/` returns **nothing**, and every surviving `€97` belongs to the Summit product.
- `lib/stripe-tiers.ts` and `app/api/**` are **unmodified** — real customers' billing is untouched.
- The first viewport contains exactly one primary CTA.
- `layout.tsx`, `next.config.ts`, `ux.js`, `ux.css` are **unmodified**.
- The generated digest artifacts were never staged.
- `vercel alias set` ran and `signals.gitdealflow.com` serves the new deployment.
- A **screenshot** confirms the page renders with no Trusted-Types/CSP console errors.

**The deepest point:** this domain does not have a traffic problem — it has 64% of everything the portfolio earns. It has a **credibility problem at the exact moment of payment**: it promises €9.97 and charges €49. No amount of copywriting, section-trimming, or CTA tuning matters until the number on the page is the number on the card. Fix the price, ship it, verify the alias moved, and only then consider touching the narrative.
