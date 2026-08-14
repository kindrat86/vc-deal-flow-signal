# REPORT, HERMES Conversion Repair: gitdealflow.com (2026-07-23)

Task source: full-portfolio conversion audit 2026-07-23. Repo: `~/signals-gitdealflow/landing` → Vercel project `landing` (prj_M3iknyIgZ8JMxPZzEPTWdSjm4l3E) → gitdealflow.com. Deploy verified live 2026-07-23.

## Per-task status

### T1, /pricing trust-bar ✅ REMOVED (all 353 pages)
The injected `brunson-trust-bar` block (dead `#get-teardown` anchor, wrong "€5" price, "Founding price locked" contradiction, off-brand teal) was present not just on /pricing but on **353 HTML pages** (EN + de/ + es/ mirrors). Deleted the whole block everywhere via a marker-anchored `re.DOTALL` regex (strip whole `<section class="brunson-trust-bar">…</section>`).

Verification (live):
```
curl -s https://gitdealflow.com/pricing | grep -c "get-teardown|Founding price locked|brunson-trust-bar"  → 0
curl -s https://gitdealflow.com/pricing | grep -o "€5\b" | wc -l                                          → 0
```
Rendered full-page screenshot of /pricing: layout intact, all 6 Stripe CTAs visible, no teal section.

### T2, /insider nav CTA ✅ FIXED
`insider.html` nav CTA said "Join Insider, €1,970/yr" but linked the €197/mo payment link (`8x29AS…20h`). Relabeled to **"Join Insider, €197/mo"** (kept the monthly link, per preferred option). The adjacent annual button ("€1,970/yr" → `cNieVc…20e`) was already correct.

Verification: live `/insider` shows `Join Insider, €197/mo`; Stripe API GET confirms `8x29AS…20h` = plink_1TvEtm… = €197.00/mo EUR and `cNieVc…20e` = plink_1ToVsn… = €1,970.00/yr EUR. Every visible price on /insider now matches its link's charge amount.

### T3, Single exit modal → /subscribe-thanks ✅
- Removed the second exit modal (`#exit-popup` div + its entire script) from `index.html`, `de/index.html`, `es/index.html`. Kept `#exit-modal` (has the form + `exit_modal_submitted` PostHog event).
- Changed ALL `/dashboard` success redirects to `/subscribe-thanks` (exit modal + the shared `js-signup-form` handler in de/es, which still pointed at /dashboard) so double-opt-in confirm instructions always show.

Verification (headless Chromium against the live site):
```
mouseout clientY<=0 → exit_modal_visible: True, exit_popup_exists: False   (exactly one modal)
submit sales+hermestest@sipiteno.com → REDIRECT OK: https://gitdealflow.com/subscribe-thanks
```

### T4, Anonymous testimonials ✅ DELETED
Removed the entire "What subscribers say" section (Alex/Jordan/Morgan 5-star cards + "details withheld" disclaimer) from `index.html`, `de/index.html`, `es/index.html`. No replacement testimonials written, the receipts (219 documented fundraises, SSRN/Zenodo, graded predictions) carry the proof.

Verification: `curl -s https://gitdealflow.com/ | grep -c "details withheld|What subscribers say"` → 0.

### T5, Stripe hygiene ✅ (API, no charges/subscriptions touched)
**Deactivated 8 payment links** (verified `active:false` via GET after POST):

| plink | What | Why |
|---|---|---|
| plink_1ToVsk… | Insider €197/mo (founding, old prod) | founding link, unreferenced |
| plink_1ToVse… | Dashboard €49/mo (founding, old prod) | founding link, unreferenced |
| plink_1TTlOf… | Insider €970/yr | stale |
| plink_1TTlOc… | Dashboard €99/yr | stale |
| plink_1TLqrL… | Premium €97/mo | stale |
| plink_1TLpQO… | Pro €9.97/mo | stale |
| plink_1TvEpv… | Dashboard €49/mo duplicate twin | HTML references plink_1Tvtly (7sYdR8…20r) |
| plink_1Tvtm4… | Insider €197/mo duplicate twin | HTML references plink_1TvEtm (8x29AS…20h) |

**Kept active (all referenced in live HTML, re-verified `active:true`):** €49/mo Dashboard (7sYdR8…20r), €197/mo Insider (8x29AS…20h), €490/yr Dashboard (aFa5kC…20c), €1,970/yr Insider (cNieVc…20e), €1 Teardown (bJe5kC…209), €7 First Look (28E6oG…203).

**⚠️ Deliberate deviation from the brief:** the brief listed `plink_1ToVsn` (€1,970/yr) and `plink_1ToVsh` (€490/yr) among the 4 founding links to deactivate. Those two are the ONLY annual payment links in the account and are referenced 13× in live HTML (every annual CTA on /pricing and /insider). Deactivating them would have 404'd every annual checkout. I deactivated the other two founding links (monthly, unreferenced) and kept these; if you want the annual founding links retired, new annual payment links must be created and wired into the HTML first.

**Products renamed** (checkout now says the brand):
- `prod_UKUNPIwagRwbnL`: "Dashboard" → **"GitDealFlow Dashboard"**
- `prod_UKVsgNDULAHJae`: "Insider Circle" → **"GitDealFlow Insider Circle"**
- Note: I did NOT append "(Annual)" as the brief suggested, both products also carry the live monthly/founding prices (incl. the real €9.97/mo recurring customer), so "(Annual)" would mislabel live subscriptions. The brand prefix fixes the actual defect (checkout showing an unbranded name).
- The current €49/€197 links already used products named "GitDealFlow Dashboard"/"GitDealFlow Insider Circle", no change needed.

**Business name via API: REFUSED**, `POST /v1/account business_profile[name]` → HTTP 403 "You cannot use this method on your own account: you may only use it on connected accounts." → OWNER ACTION below.

### T6, Hero trim ✅
Cut the amber "cost-of-delay" alert bar and the duplicate hero paragraph (the pitch was stated 3×). Hero is now: kicker → H1 (untouched, the 82/100 one) → TL;DR paragraph → form. Rendered screenshot confirms no layout breakage.

## Deploy
- Commit `8b612766` on branch `internal-link-engine` (author sales@sipiteno.com), 353 files, −4,994 lines.
- `vercel pull` → project.json confirmed `landing` → `vercel build --prod` → prebuilt artifact grep-verified clean → `vercel deploy --prebuilt --prod --archive=tgz` → "Aliased https://gitdealflow.com, Ready in 14s". Live bytes verified with cache-busted curl.

## Final verification gate results
1. ✅ /pricing: 0 dead anchors, 0 "€5", 0 "Founding price locked".
2. ✅ Rendered screenshots of / and /pricing, no breakage, CTAs visible (6 Stripe CTAs on /pricing).
3. ✅ /insider labels ↔ Stripe link amounts match (verified via API GET, no checkout opened).
4. ✅ Exit intent fires exactly one modal; submit lands on /subscribe-thanks.
5. ✅ Stripe: 8 old links `active:false`, 6 live links `active:true`, products renamed.
6. ✅ PostHog key `phc_lyZCgvTpicjLzAO3rY2GhxuX5WUc5jQjP8ZVwwJqauX` present in live HTML on /, /pricing, /insider; `signup_verify_sent` and `exit_modal_submitted` events still wired.
7. ✅ Free path: POST https://signals.gitdealflow.com/api/subscribe → HTTP 200 `{"ok":true,"verify":true,"message":"Check your email"}` (double-opt-in verify send confirmed by API response). Direct Resend read-verification not possible, all 3 available Resend API keys are send-only scope (GET /emails → 403); the API's `verify:true` + the earlier browser-path test submission are the evidence.

## Traffic amplifiers
- ✅ IndexNow ping for /, /pricing, /insider → HTTP 200 (key `22f46216…`; note: key `89ce69c8…` returns 403 despite a valid key file, stale on Bing's side, others work).
- Bing sitemap re-crawl piggybacks on IndexNow; no separate feed submission needed for this change set.
- Did NOT touch signals.gitdealflow.com (separate runbook).

## OWNER ACTIONS (cannot be done via API)
1. **Stripe public business name**, Dashboard → Settings → Public business information → change "MicroSaaS" to "GitDealFlow". (API returns 403 on own account.) Note: memory says the shared "MicroSaaS" name across all MVPs is intentional, this is the checkout-facing name for ALL products (sipi.bot etc.), so renaming it to GitDealFlow affects every product on the account. Decide accordingly.
2. **Stripe Adaptive Pricing**, Dashboard → Settings → Adaptive Pricing → disable, so EU visitors see EUR (currently defaults to USD + 4% conversion fee: $58.26 shown against the €49 sticker). Dashboard toggle only, not an API field.
3. **Google Search Console**, not set up for ANY portfolio site (per 07-23 traffic audit). Single biggest free-traffic lever; needs your Google login.

## Deliberately not done
- Did not deactivate plink_1ToVsn / plink_1ToVsh (see T5 deviation, they are the live annual checkouts).
- Did not change the exit-modal offer to the €1 teardown (T3 "consider"): the modal already links attribution + the hero has a €1 teardown link; swapping the offer is an A/B-worthy change, better done with PostHog experiment than blind, left as-is to keep this deploy pure defect-removal.
- Did not touch subscriptions, customers, charges, refunds, or payouts in Stripe.
- Did not create replacement testimonials (HONESTY GATE).
