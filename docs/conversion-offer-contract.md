# GitDealFlow conversion offer contract

**Status:** Proposed release contract, 2026-08-21

This is the only allowed source for public conversion claims and paid-offer facts in the next conversion release. It intentionally does not invent a paid Dashboard record count. A public claim must be either listed here or verified and added here first.

## Locked public research claim

> GitDealFlow reads public GitHub engineering activity across **350+ startup orgs** in **15 sectors**. Its research panel contains **219 startup-period observations across 55 startups**. The observed lead time before a public fundraise announcement was **21 to 47 days**.

Do not shorten this to “219 fundraises.” Do not use 19 or 20 sectors on current public conversion surfaces. Do not use 400+, 4,200+, or a stale exact organization count.

## Offers

| Offer key | Public name | Price | Billing | Verified public payment link | Fulfillment promise |
|---|---|---:|---|---|---|
| `free_digest` | Sunday Signal Digest | €0 | weekly email | n/a | Five accelerating startups every Sunday. Do not promise the next issue has already been delivered. |
| `teardown` | Tweet Teardown | €1 | one-time | `https://buy.stripe.com/bJe5kC48H2d2cEKg6s0x209` | Short, actionable public-GitHub signal verdict. |
| `firstlook` | First Look Pass | €7 | one-time | `https://signals.gitdealflow.com/api/checkout/session?tier=firstlook` | One sector deep dive and ranked shortlist within 24 hours. Upgrade credit window: 14 days. |
| `dashboard_monthly` | GitDealFlow Dashboard | €49 | monthly | `https://buy.stripe.com/4gMbJ07kTaJy7kqg6s0x20b` | Full ranked field across 15 sectors, refreshed weekly. Do not attach an unverified field-size number. |
| `dashboard_annual` | GitDealFlow Dashboard | €490 | annual | `https://buy.stripe.com/aFa5kC34DeZOawC6vS0x20c` | Same as Dashboard monthly. |
| `insider_monthly` | GitDealFlow Insider Circle | €197 | monthly | `https://buy.stripe.com/bJeaEWfRpcRG6gm2fC0x20d` | Dashboard plus the documented Insider delivery calendar and briefing artifact, before this is promoted. |
| `insider_annual` | GitDealFlow Insider Circle | €1,970 | annual | `https://buy.stripe.com/cNieVc34DbNCcEK2fC0x20e` | Same as Insider monthly. |
| `sector_sweep` | Custom Sector Sweep | €1,997 | one-time after review | `https://buy.stripe.com/bJe14m34DbNC6gm1by0x204` | Custom thesis-driven sector report. Promise one verified delivery timeline only. No automatic payment link before qualification. |
| `agent_credits` | Deep-signal credits | €19 | one-time | `https://buy.stripe.com/00w4gyfRpg3SbAGcUg0x205` | 100 deep-signal calls. |

Current Stripe API probe, 2026-08-21: Dashboard monthly at €49, Dashboard annual at €490, Insider monthly at €197, and Insider annual at €1,970 are active. The stale Dashboard €441/year and Insider €1,773/year routes must not be used.

Every release that changes a price, price CTA, or fulfillment must repeat the Stripe API and rendered Checkout probe before deployment.

## Operating rules

1. No public offer may use a price, link, capacity figure, “worth” anchor, sector count, or delivery deadline not present here and verified for the release.
2. Existing unsubscribed or globally suppressed contacts remain suppressed. Intent capture must never send `unsubscribed: false` in a create-or-update path.
3. Browser analytics never contain raw email. Checkout metadata may contain a pseudonymous PostHog distinct ID, never in a URL.
4. `purchase_completed` is only valid when the same pseudonymous distinct ID links checkout start to the Stripe webhook event.
5. Meta and LinkedIn tags are disabled by default. They must not load before an explicit opt-in, and the current earned/community growth strategy does not justify enabling them.
6. The 30-day Signal-or-It’s-Free guarantee applies to paid offers only. Any capacity or time-based urgency needs a live operational source before publication.

## Required release probe

For each payment link used in a release, record: Stripe API active status, product name, amount, currency, recurring interval, success/cancel target, and a rendered Checkout page with no payment credentials entered.
