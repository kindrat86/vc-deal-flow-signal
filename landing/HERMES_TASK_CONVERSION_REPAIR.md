# HERMES TASK — gitdealflow.com Conversion Repair

**Target site:** gitdealflow.com
**Repo:** `~/signals-gitdealflow/landing` (static HTML — no build step, no package.json)
**Vercel project:** `landing` / `prj_M3iknyIgZ8JMxPZzEPTWdSjm4l3E` (team `team_VqIhc5enyfXN91ZlfQhyz2bC`)
**Authored:** 2026-07-22
**Executor:** Hermes Agent (DeepSeek v4 Pro), autonomous
**Objective:** Repair the conversion path. This site has a **fully broken purchase path** and **fully broken analytics**. Both are proven below with live evidence. Fix the revenue path first, the measurement second.

---

## 0. READ THIS FIRST — THE THREE HARD RULES

These override every other instruction in this file. Violating any one of them makes the task a failure even if everything else succeeds.

### RULE 1 — NEVER INVENT A STRIPE PAYMENT LINK ID
Stripe payment link IDs (`https://buy.stripe.com/XXXXXXXX`) are opaque tokens tied to real products and real prices. You **cannot** derive, guess, pattern-match, or construct one. There are exactly **three** known-good links in this repo (Section 2.3). If a tier needs a link that does not already exist in the repo, you **must not** create a URL for it. You stop, leave the tier as-is, and record it in the report for the owner. A wrong payment link charges a real human the wrong amount.

### RULE 2 — NEVER TOUCH THE STRIPE DASHBOARD, AND NEVER FABRICATE PROOF
Two known defects are **owner-gated** and are explicitly **out of scope** for you:
- The Stripe checkout displays the merchant name **"MicroSaaS"** instead of **"GitDealFlow"**.
- The checkout defaults to **USD (~$58.09 + 4% conversion fee)** despite the pricing page promising "All prices in EUR".

Both are Stripe **Business settings**, not code. You have no credentials and must not attempt them. Report only.

Equally: **do not invent social proof.** No subscriber counts, no testimonials, no "1,247 founders", no "join 3,000+ investors", no fake scarcity. This portfolio has a documented history of fabricated stats and it is a legal liability. If you cannot source a number from a file in this repo, it does not go on the page.

### RULE 3 — SCOPE IS `landing/` ONLY, AND THE TREE IS DIRTY
The repo `~/signals-gitdealflow` is currently:
- on branch **`internal-link-engine`** (NOT `main`), and
- carrying **~20 uncommitted modified files under `pseo-site/`** — that is the *signals.gitdealflow.com* site, a different property.

You must **never** `git add -A`, `git commit -a`, or `git stash`. Stage files **individually and explicitly by path**, and only paths under `landing/`. Committing `pseo-site/` work would deploy someone else's half-finished changes.

---

## 1. PRE-FLIGHT (abort conditions)

Run all of these. If any ABORT condition triggers, stop and write the report; do not edit files.

```bash
cd ~/signals-gitdealflow/landing
```

**1.1 — Is another Hermes agent already working this repo?**
```bash
ps aux | grep -i hermes | grep -v grep
```
A `hermes-webui/server.py` and a `hermes_cli.main serve` process are **normal and expected** (the always-on gateway). **ABORT** only if you find a process whose command line references `signals-gitdealflow`, `landing`, or a `vercel` deploy in flight. The SEO swarm auto-deploys these repos and a concurrent write will race you.

**1.2 — Confirm branch and capture a rollback point.**
```bash
git -C ~/signals-gitdealflow branch --show-current   # expect: internal-link-engine
git -C ~/signals-gitdealflow rev-parse HEAD          # RECORD THIS — it is your rollback target
git -C ~/signals-gitdealflow status --short -- landing/   # expect: clean or near-clean
```
**ABORT** if `landing/` already has uncommitted modifications you did not make — someone else is mid-edit.

**1.3 — Confirm the Vercel project binding (known past trap).**
```bash
cat .vercel/project.json | grep projectName   # MUST read "landing"
```
**ABORT** if it is anything else. This directory has previously been mis-bound to the wrong Vercel project and deploying would overwrite a different site.

**1.4 — Confirm git author (Vercel rejects non-team authors).**
```bash
git config user.email    # MUST be sales@sipiteno.com
```
If it is not, set it: `git config user.email sales@sipiteno.com`. Vercel **blocks deploys** whose commit author is not a team member.

**1.5 — Baseline the live site so you can prove your change worked.**
```bash
curl -s https://gitdealflow.com/dashboard | wc -c
curl -s https://gitdealflow.com/dashboard | grep -c "buy.stripe.com"
```
Expected today: `58768` and `0`. Record both.

---

## 2. THE DIAGNOSIS (already verified — do not re-litigate, just fix)

### 2.1 — P0: The three paid sales pages CANNOT BE BOUGHT FROM

`vercel.json` sets `"cleanUrls": true`. For every paid page there exist **two files**, and Vercel serves the **flat `.html`**, not the directory index:

| URL | File SERVED (flat) | Stripe links in it | File SHADOWED (dir) | Stripe links in it |
|---|---|---|---|---|
| `/dashboard` | `dashboard.html` (58,768 b) | **0** | `dashboard/index.html` (22,736 b) | 3 |
| `/insider` | `insider.html` (37,899 b) | **0** | `insider/index.html` (14,587 b) | 2 |
| `/firstlook` | `firstlook.html` (42,259 b) | **0** | `firstlook/index.html` (12,549 b) | 2 |

**Proven live**, not inferred:
```
curl -s https://gitdealflow.com/dashboard | wc -c        -> 58768   (the flat file)
curl -s https://gitdealflow.com/dashboard | grep -c buy.stripe.com -> 0
```

Every checkout button written for these pages lives in the **shadowed** twin that no visitor can ever reach.

**The resulting dead-end loop**, traced through the real files:
- `/pricing` → €49/mo "Most Popular" tier → button `Get the Dashboard` → `href="/dashboard"` (`pricing.html:210`)
- `/dashboard` → serves `dashboard.html` → contains **no** `buy.stripe.com` link at all; its buttons point to `/pricing`, `/insider`, `/firstlook`, `/report`
- → back to `/pricing`. **Infinite loop. No purchase is possible.**

Identically for €197/mo Insider (`/pricing` → `/insider` → no checkout).

**The only three purchase paths that currently work** are the direct links on `pricing.html`:
- €1 Teardown (`pricing.html:180`)
- €490/yr Dashboard **annual** (`pricing.html:212`)
- €1,970/yr Insider **annual** (`pricing.html:227`)

There is **no monthly €49 checkout and no monthly €197 checkout anywhere on the site**, and no €7 First Look checkout. This is the direct cause of the portfolio's 19 `checkout_started` → 3 `invoice_payment_succeeded`.

### 2.2 — P0: One Stripe link is reused for four different prices

```bash
grep -rho "https://buy\.stripe\.com/[A-Za-z0-9]*" --include="*.html" . | sort | uniq -c | sort -rn
```
Returns:
```
10 https://buy.stripe.com/bJe5kC48H2d2cEKg6s0x209
 3 https://buy.stripe.com/cNieVc34DbNCcEK2fC0x20e
 3 https://buy.stripe.com/aFa5kC34DeZOawC6vS0x20c
```
`bJe5kC48H2d2cEKg6s0x209` is used **10 times** and is attached to CTAs labelled **€1 Teardown**, **€7 First Look**, **€49/mo Dashboard**, and **€197/mo Insider** (in `pricing.html`, `firstlook/index.html`, `insider/index.html`, `dashboard/index.html`, plus the `de/` and `es/` locale copies). One link cannot be four prices. At most one of those labels is truthful.

**This is why Step 3.2 exists: you must VERIFY what each link actually sells before wiring anything to it.**

### 2.3 — The three known links (the ONLY ones you may use)

| Token | Believed tier | Status |
|---|---|---|
| `bJe5kC48H2d2cEKg6s0x209` | €1 Teardown (per `pricing.html:180`, its most specific use) | **must verify** |
| `aFa5kC34DeZOawC6vS0x20c` | €490/yr Dashboard annual | **must verify** |
| `cNieVc34DbNCcEK2fC0x20e` | €1,970/yr Insider annual | **must verify** |

### 2.4 — P1: The 100% bounce rate is a TRACKING BUG, not visitor behaviour

Real PostHog data (project 143861, 90 days) for gitdealflow.com reads:
`pageviews = 1025, visitors = 1025, sessions = 1025` — **identical**, with **100.0% bounce**.

That is statistically impossible for organic human traffic. The cause is in `index.html`, which initialises PostHog **twice**:

- **`index.html:305`** (in `<head>`, correct): `posthog.init("phc_lyZ...", {api_host:"https://eu.i.posthog.com", person_profiles:"identified_only"})` — default persistence (localStorage + cookie).
- **`index.html:1329`** (deferred via `requestIdleCallback`): a **second** snippet plus
  `posthog.init('phc_lyZ...', {api_host:'https://eu.i.posthog.com', persistence: 'memory', person_profiles:'identified_only'})`

`persistence: 'memory'` stores the distinct_id and session id in a JS variable only — nothing survives navigation. Every pageview therefore mints a **brand-new anonymous person and a brand-new session**, which produces exactly `pageviews == visitors == sessions` and a mechanical 100% bounce.

**Consequences:** every funnel, retention, and attribution number for this site is currently meaningless, and any conversion event fired after the second init is attributed to a stranger. You cannot measure the P0 fix until this is repaired.

---

## 3. EXECUTION

Work the steps in order. Each has a gate; a failed gate means stop that step, revert that step's edit, and continue to the next step.

### STEP 3.1 — Fix the analytics double-init (do this FIRST so P0 becomes measurable)

**File:** `index.html`

**Action:** Remove the *second*, deferred PostHog bootstrap — the entire `<script>` block that begins at approximately **line 1326** and contains `persistence: 'memory'`. The head snippet at line 305 is the correct one and **stays untouched**.

**Critical:** that same block also contains the **A/B hero-layout feature-flag code** (`landing-hero-layout`, `hero_experiment_exposed`, `window.__heroVariant`). That code is live and referenced elsewhere (`index.html:1142` reads `window.__heroVariant`). You must **preserve the flag/experiment IIFE** and delete **only**:
1. the duplicated `!function(t,e){...}(document,window.posthog||[]);` loader snippet, and
2. the `function _init(){ ... posthog.init(... persistence: 'memory' ...) }` declaration together with the `requestIdleCallback(_init,...) / setTimeout(_init,2000)` line that calls it.

The surviving experiment IIFE must remain inside a `<script>` block and still run. Since PostHog is now initialised in `<head>`, its `posthog.onFeatureFlags(...)` / `ready()` polling will resolve normally.

**Gate 3.1 — all four must pass:**
```bash
grep -c "posthog.init" index.html          # MUST now be exactly 1
grep -c "persistence: 'memory'" index.html # MUST be 0
grep -c "hero_experiment_exposed" index.html # MUST still be 1 (experiment preserved)
grep -c "__heroVariant" index.html         # MUST still be >= 2 (setter + reader at :1142)
```
If any fails → `git checkout -- index.html` and skip to Step 3.2.

---

### STEP 3.2 — VERIFY what each Stripe link actually sells (mandatory gate before 3.3)

You may not wire a single button until you know what these links charge. Stripe payment-link pages expose the product name and price in their server-rendered HTML/OG metadata.

For **each** of the three tokens in Section 2.3:
```bash
curl -sL "https://buy.stripe.com/<TOKEN>" | grep -oiE '<title>[^<]*</title>|"(name|amount|currency)":[^,}]*' | head -20
```
Record, per token: the product name, the numeric amount, the currency, and whether it is one-time or recurring.

**Gate 3.2:**
- If a token's product and price are **unambiguous** → it is *verified* and may be used in Step 3.3 **only for the matching tier at the matching price**.
- If a token is ambiguous, returns a login/error page, or its price does **not** match the tier label → mark it **UNVERIFIED**. An UNVERIFIED token may **not** be wired to any button. Record it for the owner.
- If **all three** are UNVERIFIED → **skip Step 3.3 entirely**, do Steps 3.1 / 3.4 / 3.5 only, and escalate. Do not guess.

---

### STEP 3.3 — Repair the purchase path (only for VERIFIED links)

The defect is that the served flat file has no checkout while its shadowed twin does. Fix by **making the served file the single source of truth**, then removing the shadow.

For each of `dashboard`, `insider`, `firstlook`:

**3.3a — Port the checkout CTA into the SERVED flat file.**
Open the shadowed twin (`<page>/index.html`) and read the checkout CTA markup. Then add an equivalent primary CTA into the **flat** `<page>.html`, placed at the page's existing primary-CTA position (where it currently links to `/pricing` or `/report`).

Wire the `href` **only** to a token VERIFIED in Step 3.2 whose price matches that page's headline price. Concretely:
- `dashboard.html` headlines **€49/mo**. No verified *monthly* €49 link exists in this repo. Therefore: **do not fabricate one.** Wire the CTA to the verified **annual** link (`aFa5kC...`, €490/yr) **and change the button label to state the real terms**, e.g. `Start the Dashboard — €490/yr`. The label must never claim a price the link does not charge.
- `insider.html` headlines **€197/mo**. Same rule → verified annual `cNieVc...` (€1,970/yr), label `Join the Insider Circle — €1,970/yr`.
- `firstlook.html` headlines **€7 one-time**. If no token verifies at €7 → **add no checkout button.** Instead leave the existing content and record the gap.

Preserve the existing PostHog `onclick` capture pattern used elsewhere in the repo, e.g.:
`onclick="if(window.posthog)posthog.capture('dash_cta_yes',{placement:'dashboard_sales'})"`

**3.3b — Remove the shadowed twin so one URL = one file.**
```bash
git rm dashboard/index.html insider/index.html firstlook/index.html
```
Only remove a twin **after** its flat counterpart carries the corrected CTA (or, for firstlook, after you have recorded the gap). Removing the shadow eliminates the duplicate-content ambiguity permanently.

**3.3c — Correct the mislabelled shared link on `/pricing`.**
In `pricing.html`, the €7 First Look tier and the €49/€197 tiers must not point at a link that charges something else. Any CTA whose token was **not** verified at that tier's exact price must be relabelled to the truthful price (as in 3.3a) or converted from a checkout button to a `/pricing`-internal informational link. Apply the identical corrections to the locale copies **`de/pricing.html`** and **`es/pricing.html`**, which duplicate the same markup.

**Gate 3.3 — all must pass:**
```bash
# every served paid page now has a checkout link (firstlook may legitimately be 0)
for p in dashboard insider; do echo "$p: $(grep -c 'buy.stripe.com' $p.html)"; done   # each MUST be >= 1
# shadows are gone
ls dashboard/index.html insider/index.html firstlook/index.html 2>&1 | grep -c "No such file"  # MUST be 3
# NO invented links: every link in the repo must be one of the three known tokens
grep -rho "https://buy\.stripe\.com/[A-Za-z0-9]*" --include="*.html" . | sort -u
```
That last command's output **must contain no token outside** `bJe5kC48H2d2cEKg6s0x209`, `aFa5kC34DeZOawC6vS0x20c`, `cNieVc34DbNCcEK2fC0x20e`. **If a fourth token appears, you fabricated one — revert everything immediately** (`git checkout -- landing/`) and abort the whole task.

---

### STEP 3.4 — Create a real thank-you page for the email opt-in

Today the homepage capture fires `signup_verify_sent` (`index.html:1142`) but the visitor never reaches a second URL, so no genuine second pageview exists and "bounce" can never fall below 100% even after Step 3.1.

**Action:** Create **`subscribe-thanks.html`** at the repo root, modelled structurally on the existing **`sector-sweep-thanks.html`** (copy its header/footer/styles so the design stays consistent — read it first, do not invent a new layout).

Content requirements — all must be **true**:
- Confirms the email is on its way and tells the reader to check their inbox (and spam) for the confirmation.
- States the sender address so it can be allow-listed: **`signal@gitdealflow.com`** (singular "signal" — this is deliberate and current; do **not** write "signals@").
- Offers exactly one next step: the **€1 Teardown** — but only if `bJe5kC48H2d2cEKg6s0x209` VERIFIED at €1 in Step 3.2. Otherwise link to `/pricing`.
- Fires `posthog.capture('subscribe_thanks_viewed')` on load, using the same inline pattern as the rest of the repo.
- No fabricated counts, no fake scarcity.

Then point the post-submit redirect at it: in `index.html`, the success path around **line 1142–1144** currently sends the user to `/dashboard`. Change that destination to `/subscribe-thanks`. Leave the `signup_verify_sent` capture in place.

**Gate 3.4:**
```bash
test -f subscribe-thanks.html && echo OK
grep -c "signals@gitdealflow.com" subscribe-thanks.html   # MUST be 0 (wrong address)
grep -c "signal@gitdealflow.com" subscribe-thanks.html    # MUST be >= 1
grep -c "subscribe-thanks" index.html                     # MUST be >= 1
```

---

### STEP 3.5 — Surface the €1 Teardown near the hero

**Only if** `bJe5kC48H2d2cEKg6s0x209` VERIFIED at **€1** in Step 3.2. Otherwise skip this step entirely.

The €1 Teardown is the lowest-friction paid offer and is currently buried on `/pricing`. Add **one** secondary text link directly beneath the existing hero CTA block in `index.html` (the `#signup-hero` area) — for example: *"Not ready for the list? Get a €1 Tweet Teardown →"*.

Constraints: it must be a **secondary/text** style, never a second primary button. The hero must retain exactly **one** visually dominant CTA (the free email capture). Add `onclick="if(window.posthog)posthog.capture('hero_teardown_link_clicked')"`.

**Gate 3.5:** `grep -c "hero_teardown_link_clicked" index.html` → `1`. Confirm by eye that no second `btn-primary` was introduced in the hero.

---

## 4. VALIDATION (before any deploy)

```bash
cd ~/signals-gitdealflow/landing

# 4.1 No fabricated Stripe tokens anywhere (repeat of the hard gate)
grep -rho "https://buy\.stripe\.com/[A-Za-z0-9]*" --include="*.html" . | sort -u

# 4.2 Exactly one PostHog init on the homepage, no memory persistence
grep -c "posthog.init" index.html; grep -c "persistence: 'memory'" index.html

# 4.3 No fabricated proof introduced anywhere (all MUST return 0)
grep -rniE "[0-9,]+\+? (founders|investors|subscribers|customers|users) (trust|joined|use)" --include="*.html" . | wc -l
grep -rniE "only [0-9]+ (seats|slots|spots) left" --include="*.html" . | wc -l

# 4.4 No stray HTML — every file you edited must still parse
for f in index.html pricing.html dashboard.html insider.html firstlook.html subscribe-thanks.html; do
  [ -f "$f" ] && python3 -c "
import html.parser,sys
class P(html.parser.HTMLParser): pass
P().feed(open('$f',encoding='utf-8').read()); print('$f OK')"
done

# 4.5 Confirm you did NOT stage anything outside landing/
git -C ~/signals-gitdealflow diff --cached --name-only | grep -v "^landing/" | wc -l   # MUST be 0
```

**Do not deploy if 4.1 shows a fourth token, 4.3 returns non-zero, or 4.5 returns non-zero.**

---

## 5. COMMIT & DEPLOY

**5.1 — Stage explicitly by path. Never `git add -A`.**
```bash
cd ~/signals-gitdealflow
git add landing/index.html landing/pricing.html landing/dashboard.html \
        landing/insider.html landing/firstlook.html landing/subscribe-thanks.html \
        landing/de/pricing.html landing/es/pricing.html
git rm --cached -r landing/dashboard/index.html landing/insider/index.html landing/firstlook/index.html 2>/dev/null || true
git status --short   # REVIEW: nothing under pseo-site/ may appear
```

**5.2 — Commit.**
```bash
git commit -m "fix(gitdealflow): restore reachable checkout on paid pages, single PostHog init, thanks page

- Serve checkout CTAs from the flat .html files Vercel actually serves; remove shadowed dir twins
- Relabel tiers to the price their verified Stripe link truly charges
- Remove duplicate PostHog init with persistence:memory (cause of 100% bounce / pv==visitors==sessions)
- Add subscribe-thanks.html so the email opt-in produces a real macro conversion"
```

**5.3 — Deploy (static; no build).**
```bash
cd ~/signals-gitdealflow/landing
vercel deploy --prod --archive=tgz
```
Notes: `--archive=tgz` is required — this tree is large and plain uploads have failed before. `vercel.json` sets `buildCommand: null` and `outputDirectory: "."`, so nothing compiles.

**Known flake:** this deploy gets stuck reporting `UNKNOWN` roughly half the time. If it does, wait 60s, re-run the exact same command **once**. If it fails twice, stop and report — do not loop.

**Never delete `mcp-demo.gif`.** A previous agent removed it and broke the homepage demo.

---

## 6. POST-DEPLOY VERIFICATION (mandatory — a deploy is not "done" until these pass)

```bash
sleep 45

# 6.1 The paid pages now expose a checkout (this is the whole point)
curl -s https://gitdealflow.com/dashboard | grep -c "buy.stripe.com"   # was 0 -> MUST now be >= 1
curl -s https://gitdealflow.com/insider   | grep -c "buy.stripe.com"   # was 0 -> MUST now be >= 1

# 6.2 Homepage initialises PostHog once, with persistent storage
curl -s https://gitdealflow.com/ | grep -c "posthog.init"          # MUST be 1
curl -s https://gitdealflow.com/ | grep -c "persistence: 'memory'" # MUST be 0

# 6.3 Thank-you page is live
curl -s -o /dev/null -w "%{http_code}\n" https://gitdealflow.com/subscribe-thanks   # MUST be 200

# 6.4 Nothing 404'd or regressed
for u in / /pricing /dashboard /insider /firstlook /subscribe-thanks; do
  printf "%s -> %s\n" "$u" "$(curl -s -o /dev/null -w '%{http_code}' https://gitdealflow.com$u)"
done   # ALL MUST be 200
```

**Rollback** if any check fails:
```bash
git -C ~/signals-gitdealflow revert --no-edit HEAD
cd ~/signals-gitdealflow/landing && vercel deploy --prod --archive=tgz
```

**Measurement note:** Step 3.1 resets identity storage, so PostHog will show a **discontinuity** — visitor and session counts will drop sharply and bounce should fall well below 100%. That is the fix working, not a regression. Do not "correct" it. Compare against the recorded baseline (`pv=visitors=sessions=1025`, bounce 100.0%) only as a before/after, never as a trend.

---

## 7. REPORT (write this file, always — even on abort)

Write `~/signals-gitdealflow/landing/HERMES_REPORT_CONVERSION_REPAIR.md` containing:

1. **Stripe link verification table** from Step 3.2 — token → product name → amount → currency → recurring? → VERIFIED/UNVERIFIED. This is the most valuable output of the whole task.
2. **Which tiers still have no working checkout.** Expected to include €49/mo monthly, €197/mo monthly, and €7 First Look. State plainly that the owner must create these payment links in Stripe.
3. **Steps completed vs skipped**, with the gate result that caused each skip.
4. **Owner-gated items you did not touch** (restate for the owner):
   - Stripe merchant display name shows **"MicroSaaS"** → must be renamed to **GitDealFlow** in *Stripe Dashboard → Business settings → Public details*. This is the single highest-impact trust fix on the site and only the owner can do it.
   - Checkout defaults to **USD (~$58.09, +4% conversion fee)** while `/pricing` promises "All prices in EUR" → set EUR as the presentment currency, or correct the on-page claim.
   - Four legacy "founding" Stripe links remain active and should be deactivated.
5. **Before/after** of the four `curl` baselines from Sections 1.5 and 6.
6. Any file you edited but could not fully verify.

---

## 8. WHAT SUCCESS LOOKS LIKE

- `curl https://gitdealflow.com/dashboard | grep -c buy.stripe.com` returns **≥ 1** (was `0`).
- Every `buy.stripe.com` token in the repo is one of the **three** pre-existing tokens — zero invented.
- Every price label on a button matches what that link genuinely charges.
- `posthog.init` appears **once** on the homepage and `persistence: 'memory'` is gone.
- `/subscribe-thanks` returns 200 and fires a real second pageview.
- Nothing under `pseo-site/` was committed.
- The report names exactly which payment links the owner still has to create.

**The deepest point:** this site's copy, value ladder, and guarantee are genuinely good — the audit scored the writing well above the portfolio average. It converts almost nobody because **the checkout button is on a page nobody is served, and the analytics that would have revealed this were measuring noise.** Fix the plumbing; do not rewrite the persuasion.
