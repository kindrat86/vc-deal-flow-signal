# GitDealFlow source-to-live conversion matrix

**Captured:** 2026-08-21 EEST

This matrix separates what was observed in production from what the current `main` source would deploy. It is the Phase 0 gate for the conversion release. No source change should be made only to silence a guard.

## Public claims and offers

| Area | Production evidence | Current source evidence | Release decision |
|---|---|---|---|
| Core research proof | Homepage renders `350+ startup orgs`, `15 sectors`, and `219 startup-period observations across 55 startups`. | Root `AGENTS.md` locks the same facts. | Keep this exact formulation as the conversion standard. |
| Dashboard coverage | Pricing currently renders `140+ startups, 15 sectors`. | `landing/dashboard.html` repeats `140+` in metadata, hero, FAQ, and value stack. | Do not ship a coverage number until it is verified against the paid surface. Use “full ranked field across 15 sectors” in the offer contract. |
| Dashboard annual price | Pricing production renders €490/year and links `aFa5kC34DeZOawC6vS0x20c`. A rendered Checkout probe says “The link is no longer active.” The Stripe API confirms `active:false`, €490/year. | `landing/dashboard.html`, `pricing.html`, and locale pages render €441/year and link `5kQ8wO48H3h6cEKdYk0x20I`. The Stripe API confirms this stale link is `active:true`, €441/year. | Critical revenue blocker. Do not deploy either public annual claim until one active annual price/link is chosen, then verified in Stripe API and rendered Checkout. |
| Insider annual price | Pricing production renders €1,970/year and links `cNieVc34DbNCcEK2fC0x20e`. The Stripe API confirms `active:false`, €1,970/year. | `stripe/payment-links.md` incorrectly records it as active. | Critical revenue blocker. Hide or replace the annual CTA only after a fresh rendered Checkout probe. |
| First Look contract | Production says €7, one sector, ranked shortlist, 24-hour delivery, and 14-day upgrade credit. | `pseo-site/app/api/firstlook/intent/route.ts` allows 19 sectors and reactivates existing audience contacts. | High severity. Move to the 15-sector contract and preserve suppression before promoting pre-capture. |
| Research wording drift | Homepage is current. | Public landing pages still contain `219 documented fundraises`, including `landing/research/index.html`, `landing/mcp.html`, `landing/confirmed.html`, locale pages, glossary pages, and `landing/scripts/verify-claims.mjs`. | Replace the public conversion-surface wording with the locked observation phrasing. Historic research artifacts need a separate factual review, not a blind bulk replace. |
| Tracker / consent promise | Fresh production visit, with no stored consent, loaded Meta `PageView` and LinkedIn Insight requests. The banner says “No ads, no cross-site tracking.” | `landing/pixels.js` has non-empty Meta and LinkedIn IDs. Landing CSP and pSEO CSP explicitly allow their hosts. | High severity. Remove the two tags and their CSP grants, or build explicit opt-in. The contract defaults to removal. |
| Checkout identity | Checkout API accepts and persists `ph_distinct_id`; Stripe webhook can emit `purchase_completed` with it. | `landing/firstlook.html` sends it, but `landing/dashboard.html` captures `checkout_started` without including it in the checkout POST. | High severity. Thread one pseudonymous ID through all money-path checkout scripts and test webhook idempotency. |

## Open pull requests that overlap

| PR | Scope | Constraint for this release |
|---|---|---|
| [#385](https://github.com/kindrat86/vc-deal-flow-signal/pull/385) | Trust-copy cleanup on pSEO: duplicate CTAs, free-to-€7 mismatches, and 60-day to 30-day guarantee correction. | Do not duplicate its edited files without merging or reconciling its diff. It deliberately leaves fabricated value stacks and data-count drift untouched. |
| [#373](https://github.com/kindrat86/vc-deal-flow-signal/pull/373) | Dashboard upgrade CTA routing in email sequences and pSEO email code. | Do not reload the PocketBase email collection with the unsafe delete-and-reload script described in the PR. Preserve unmanaged scout records. |

## Source findings to fix in order

1. `pseo-site/app/api/firstlook/intent/route.ts` sends `unsubscribed: false` on create and PATCH fallback, and declares 19 valid sectors.
2. `landing/pixels.js` immediately starts Meta and LinkedIn trackers. It also treats qualified visits as GA4-only, leaving the claimed north-star measure absent from PostHog.
3. `landing/dashboard.html` has the stale €441 annual link and price in at least four CTA locations, and unsupported-looking component value anchors.
4. `landing/pricing.html` and both locale copies link the same stale €441 annual URL.
5. The public landing corpus retains “219 documented fundraises” in conversion and proof pages. The current `landing/scripts/verify-claims.mjs` still allows the forbidden phrase, so it cannot protect the truth lock.

## Verification already performed

- Production homepage and pricing were rendered in a browser.
- Production homepage PostHog initialized and browser-native required-email validation focused the hero email field without sending a request.
- A fresh production visit with no `gdf_cookie_consent` value loaded `connect.facebook.net`, `facebook.com/tr`, and `snap.licdn.com` resources.
- Stripe API probe: Dashboard monthly €49 is active; Dashboard annual €490 is inactive; source's stale €441 Dashboard annual is active; Insider annual €1,970 is inactive.
- Existing root-worktree changes were left untouched. This release worktree is `/private/tmp/gdf-conversion-audit-20260821` on `hermes/gdf-conversion-audit-20260821` from `main` commit `d7b752e`.

## Gate to start implementation

The following are required before editing money-page copy or deploying:

- [ ] Fresh Stripe API and rendered Checkout probes for every price/link in the offer contract.
- [ ] A file-level edit plan that avoids #385 and #373 overlap or explicitly reconciles it.
- [ ] Tests for suppression preservation, 15-sector validation, no raw-email analytics, distinct-ID propagation, and webhook idempotency.
- [ ] A source scan split between current public conversion surfaces and historic artifacts, so historical research is not silently rewritten.
