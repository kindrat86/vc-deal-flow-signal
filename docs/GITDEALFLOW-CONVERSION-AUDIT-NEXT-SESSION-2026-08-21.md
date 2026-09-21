# GitDealFlow conversion audit: execution file for the next session

**Audit time:** 2026-08-21 12:13 EEST

**Conversion goal:** turn qualified investors into verified free subscribers, then into a paid First Look, Dashboard, Insider, or Sector Sweep customer. This is a conversion audit only. It does not score search traffic, discovery, or rankings except where they affect the visitor's buying decision.

**Surfaces audited**

1. `https://gitdealflow.com/`, static acquisition landing.
2. `https://gitdealflow.com/pricing`, pricing ladder.
3. `https://gitdealflow.com/firstlook`, €7 tripwire.
4. `https://gitdealflow.com/dashboard`, €49/month core product.
5. `https://gitdealflow.com/insider`, €197/month higher-touch offer.
6. `https://gitdealflow.com/sector-sweep`, €1,997 custom offer.
7. `https://gitdealflow.com/confirmed`, post-verification page.
8. `https://signals.gitdealflow.com/`, product, proof, and pSEO site.
9. Checkout API, Stripe webhook, email verification, onboarding, retention, and analytics code.

## Read this first: the audit is evidence, not estimates

- Scores mean **conversion-system maturity**, not a claimed business result. A 70 means a mechanism exists and is credible. It does not mean a 70% conversion rate.
- `N/A` means the financial or behavioral value cannot be honestly calculated from the live data. Do not replace it with a guessed score.
- There is a live/source split. The public Dashboard page currently says **60+ startups**, **15 sectors**, and also displays **60+ / 20** in the proof block. The current checked-out `landing/dashboard.html` says **140+** and includes stale annual-price code. Treat current production and current source as separate things until both are re-read after changes.
- Canonical truth lock from `AGENTS.md`: **350+ startup orgs**, **15 sectors**, and **219 startup-period observations across 55 startups**. Do not write “219 fundraises.” Do not use 20 sectors, 19 sectors, 140+ Dashboard startups, 60+ as the full tracked panel, or 4,200+.
- Existing open PRs include #385 (trust/CTA work) and #373 (Dashboard CTA routing). Inspect them before touching the same areas. The current root worktree also has unrelated dirty files. Do not stash, reset, or overwrite them.

## Live evidence collected

### 90-day PostHog funnel, both GitDealFlow hosts

| Stage | Unique people | What it means |
|---|---:|---|
| `$pageview` | 7,899 | Upper funnel denominator across both hosts, not a clean acquisition cohort. |
| `checkout_started` | 19 | 0.241% of pageview people began tracked checkout. |
| `signup_verify_sent` | 16 | 0.203% of pageview people requested verification. |
| `signup_confirmed_viewed` | 4 | 25.0% of tracked verification sends reached the tracked confirmation view. This is too small and event coverage may be incomplete. |
| `purchase_completed` | 0 | No purchase event joined into the browser funnel in this 90-day query. Do not infer zero paid revenue from this. |
| `exit_modal_opened` | 240 | Exit intervention has enough exposure to evaluate once its funnel is fixed. |
| `exit_modal_submitted` | 3 | 1.25% of exit-modal openers submitted. Small sample, weak current result. |
| `$rageclick` | 16 | 0.203% of visitors, low but worth reviewing after replay filters are confirmed. |

### 30-day field performance

| Host | Metric | Events | p75 | Status |
|---|---|---:|---:|---|
| `gitdealflow.com` | FCP | 41 | 7,428ms | Poor, but thin sample. |
| `gitdealflow.com` | LCP | 21 | 7,540ms | Poor, but thin sample. |
| `signals.gitdealflow.com` | CLS | 780 | 0.00 | Good. |
| `signals.gitdealflow.com` | FCP | 589 | 960ms | Good. |
| `signals.gitdealflow.com` | INP | 104 | 202ms | Just outside the 200ms good threshold. |
| `signals.gitdealflow.com` | LCP | 1,160 | 2,873ms | Needs improvement. |
| `signals.gitdealflow.com` | TTFB | 587 | 644ms | Good. |

### Live tracker verification

The live homepage loads all of the following before a visitor has clicked the visible “Got it” cookie notice:

- GA4
- PostHog, including `posthog-recorder.js`
- Meta Pixel and a `PageView` request
- LinkedIn Insight Tag

The notice says: “No ads, no cross-site tracking.” That is contradicted by the live Meta and LinkedIn requests. This is a trust problem, a consent problem, and a conversion problem for an investor audience. Since GitDealFlow's growth strategy is earned/community-led, do not add more paid pixels. Remove the two hardcoded pixels or hold them until explicit consent, then update every privacy surface in the same release.

## Executive diagnosis

GitDealFlow has an unusually strong offer architecture. The free digest, €1 teardown, €7 First Look, €49 Dashboard, €197 Insider, €1,997 Sweep, and application-gated offers create sensible commitment steps. The serious problems are not missing funnel pages. They are truth drift, broken measurement joins, value-delivery delay, and trust contradictions.

**The highest business risk is not low click-through. It is a buyer seeing incompatible claims after paying attention.** A data product cannot ask people to trust a timing signal while showing 15, 19, and 20 sectors, different Dashboard counts, and source code pointing at conflicting annual prices.

---

# 1. Full funnel map and leak points

```text
Qualified investor
  -> apex homepage / comparison / research / pSEO page
  -> free email form OR product/proof page
  -> verification email
  -> /confirmed
  -> sample issue / methodology / First Look
  -> Stripe checkout
  -> welcome email and first usable value
  -> Dashboard activity: view signal, create watchlist, export, use API
  -> recurring value, renewal, expansion or cancellation
```

## Main leaks

1. **Traffic to intent is nearly dark.** The 90-day event total shows 7,899 people and only 3 recorded `hero_cta_clicked` events. That does not mean only three people clicked. It means CTA instrumentation is inconsistent or fires after PostHog is unavailable.
2. **Verified signup is only partially visible.** `signup_verify_sent` and `signup_confirmed_viewed` exist, but the confirmation event has a thin denominator. It cannot tell whether the actual leak is delivery, inbox placement, link clicks, redirect behavior, or tracking loss.
3. **Checkout to purchase cannot be joined reliably.** `landing/dashboard.html` sends `checkout_started` but does not send `ph_distinct_id`; the checkout API supports that field and the webhook tries to use it. The result is browser intent and server purchase on different identities.
4. **The first free value is asserted, not proved.** `/confirmed` says the five names “just landed,” but this needs an event for delivered, opened, clicked, and first meaningful action. Sending a past issue immediately is good only if it is actually delivered and measured.
5. **The paid First Look path is operationally fragile.** Live copy says a buyer chooses a sector at Stripe, while source has a separate pre-capture flow. Current source also carries a 19-sector list that breaks the 15-sector truth lock.
6. **Expansion is built but not credibly measured.** Order bumps, OTOs, and drips exist. The data needed to decide if they help, hurt, or create refunds is not joined by buyer and cohort.

---

# 2. Page and flow audit

## 2.1 Apex homepage, `gitdealflow.com`

**Page score: 68/100**

### What converts

- The hero names an investor, a pain, and a distinct outcome in one screen.
- The proof bundle is unusually strong: public methodology, ledger, SSRN, open source, and a stated limitation.
- The mobile headline remains readable and the hamburger is usable.
- The first-party analytics explanation is plain language.

### What leaks

- On a 390px phone view, the cookie banner occupies the bottom of the first screen and the primary form/CTA is below the first viewport. Visitors see the promise but not the next action.
- The page is about 26,018px tall on the mobile capture. The core argument repeats before reaching the capture mechanism. This creates cognitive load and makes the Friday-morning investor work too hard.
- “Get this Sunday’s 5 names” suggests urgency, but the page also says this Sunday’s names are already locked. Make the actual next value explicit: “Get the next Sunday issue, plus a sample now.”
- Third-party advertising trackers contradict the page's trust language.

### Highest-impact fix

Create a compact above-the-fold conversion block on mobile: one email field, one button, “Get the next Sunday issue + read a sample now,” plus the three proof facts. Move the long story and objections below it. Remove Meta/LinkedIn tags or require explicit consent before they load.

## 2.2 Pricing, `gitdealflow.com/pricing`

**Page score: 64/100**

### What converts

- A true price ladder reduces “which product do I buy?” anxiety.
- The 30-day guarantee and closed founding window are credible forms of risk reversal and honest urgency.
- €1 and €7 steps offer a low-friction proof path before €49/month.

### What leaks

- The buyer must reconcile different counts and prices encountered elsewhere.
- Too many paid rungs appear before each has proof of product-market fit. This creates choice overload for a cold visitor.
- The pricing page needs an explicit decision rule, not just cards: “Start free if X, buy €7 if Y, buy €49 if Z.”
- Only some links have reliable named CTA events. No reliable pricing-to-checkout-to-paid report exists.

### Highest-impact fix

Publish one canonical pricing object and render it into apex, pSEO, schema, emails, Stripe probes, and the pricing API. Above the cards, add a 3-choice decision assistant that recommends Free, First Look, or Dashboard based on one question.

## 2.3 First Look, `gitdealflow.com/firstlook` and `signals.gitdealflow.com/firstlook`

**Page score: 66/100**

### What converts

- Good tripwire framing: one sector, one day, €7, an upgrade credit, and a clear delivery outcome.
- The page handles the “not now” objection honestly and sends lower-intent visitors back to free value.
- The Methodology Vault bump is an intelligible add-on, not a random upsell.

### What leaks

- There are conflicting promises between surfaces: live apex says a ranked shortlist, while source pSEO promises 19 sectors, top 25 orgs, a 10-14 page report, and claims not yet reconciled to the 15-sector truth lock.
- Source `app/api/firstlook/intent/route.ts` forcibly sets `unsubscribed: false` when a contact already exists. That violates the suppression rule and risks a trust-destroying email.
- The source flow asks for email before a €7 purchase, adding friction before the obvious proof moment. If retained, it must have a clear “why we ask now” and must never re-add suppressed contacts.
- No source of truth ties sector selection, checkout, delivery SLA, delivered report, refund, upgrade credit, and upgrade outcome into one record.

### Highest-impact fix

Define one 15-sector First Look contract. Use it in page copy, schema, checkout metadata, welcome email, delivery template, and the sector selector. Change existing-contact handling to preserve suppression and only capture intent after explicit permission.

## 2.4 Dashboard, `gitdealflow.com/dashboard`

**Page score: 58/100**

### What converts

- Strong pain-to-outcome copy. It makes the buyer picture a Monday investment meeting.
- The sample issue and methodology are appropriately placed before the payment decision.
- One-click checkout and SEPA support in the checkout API reduce payment friction.
- A clear 30-day guarantee and cancellation path lower risk.

### What leaks

- Production currently claims 60+ startups across 15 sectors, then displays “60+ / 20.” Checked-out source claims 140+. This is a direct credibility hit on the highest-intent page.
- Production currently uses the verified €490 annual Checkout link, while checked-out source contains an older €441 annual link and link ID. This is a revenue-critical source/live drift.
- The value stack uses invented-looking “worth €89/mo” components. It is fine to use an anchor only if it has a defensible basis. Otherwise it weakens the site's evidence-first positioning.
- `checkout_started` is captured in the browser, but `ph_distinct_id` is not posted to the checkout API. The webhook cannot reliably join the customer to the pre-payment journey.
- There is no clear screenshot/product tour of the paid Dashboard itself above the CTA. “Live signal surface” is not enough for a €49 subscription decision.

### Highest-impact fix

First, restore one verified Dashboard offer contract: annual price/link, full field count language, 15 sectors, and what is currently accessible. Second, pass PostHog distinct ID into the checkout API and emit `purchase_completed` with the same ID. Third, place one real, current Dashboard screenshot or 45-second product walkthrough next to the first payment CTA.

## 2.5 Insider, `gitdealflow.com/insider`

**Page score: 55/100**

### What converts

- The page clearly warns people not to over-buy. That increases qualified buying intent.
- Capacity scarcity is framed as a real operating constraint rather than a countdown.

### What leaks

- “Private discussion” and “monthly briefings” have no public artifact, sample agenda, schedule, or evidence of the current member experience.
- The page cannot prove the promised high-touch delivery without revealing member identities. That is solvable with a redacted monthly brief sample, a delivery calendar, and a specific onboarding sequence.
- No dedicated application/qualification event is visible in the current 90-day funnel data.

### Highest-impact fix

Add a privacy-safe “what an Insider month looks like” artifact: one redacted briefing outline, a delivery calendar, the reply SLA, and an explicit qualification CTA that tracks application start, submission, acceptance, and paid conversion.

## 2.6 Sector Sweep, `gitdealflow.com/sector-sweep`

**Page score: 61/100**

### What converts

- The thesis-first message and “tell you before you pay” stance are excellent high-ticket risk reduction.
- “No card required to apply” is right for €1,997.

### What leaks

- The main conversion path is `mailto:`. This cannot capture structured qualification, application completion, no-response rate, or payment conversion.
- Delivery promises vary in source: one page says 7 days; a webhook email says 10 business days. This must not be left unresolved.
- Capacity claims need an internal source of truth before publication. “8 sweeps per batch” should only display if the queue is actually tracked.

### Highest-impact fix

Replace the main mailto CTA with a short, instrumented application form: thesis, sector, geography, stage, intended decision, deadline, and email. Send a human confirmation, track acceptance/decline, and only issue a payment link after review.

## 2.7 Confirmation page, `gitdealflow.com/confirmed`

**Page score: 67/100**

### What converts

- Clear next step and an appropriate €7 offer for someone who has just committed an email.
- A sample issue and methodology are available as non-buy alternatives.
- The `signup_confirmed_viewed` event retries until PostHog is ready, which is better than the older pre-init event pattern.

### What leaks

- The page says “The five names are already there,” but the actual value delivery and email open are not visibly verified in the conversion report.
- The primary upsell is useful but receives only two recorded clicks in 90 days. The page needs a stronger “start with proof” choice before a paid ask.
- The page identifies a subscriber by email in the browser. Keep the URL scrubbing, but test the whole flow for email exposure in referrers, analytics, and error logs.

### Highest-impact fix

Make the first block an immediate sample-value panel: “Open your sample issue,” “Read the five names when delivered,” and “Choose a sector for a €7 deep dive.” Capture `sample_issue_opened`, `confirmed_upsell_clicked`, and email open/click events under one anonymous/identified person.

## 2.8 Signals product and pSEO site, `signals.gitdealflow.com`

**Page score: 47/100 as a conversion surface**

### What converts

- It contains real public proof, methodology, product tools, APIs, MCP, and a live signal surface.
- It is fast enough on first paint and has good layout stability.
- Its privacy page accurately describes PostHog's first-party cookie posture, but it must be reconciled with apex ad trackers.

### What leaks

- The site behaves like a very large research library. The visitor must infer the paid product path across thousands of pages.
- Many product pages route to `gitdealflow.com/#signup` without a page-specific intent event. A free calculator user, a developer, and a fund buyer should not see the same generic step.
- Global footer injections create a large amount of unrelated outbound choice at the bottom of high-intent product pages.
- The root layout contains an injected trust bar with claims such as `$80M+ Rounds Tracked` and `5,000+ Founders Tracked`. Verify those exact claims against the claims ledger or remove them. They do not match the canonical conversion proof set.

### Highest-impact fix

Create three explicit conversion paths at pSEO entry points: investor newsletter, thesis-specific First Look, and developer/agent credits. Instrument CTA source, path, intent, checkout, and paid outcome. Remove or correct unverified trust-bar claims.

---

# 3. Scorecards

## Scoring rules

- 0-20: missing, broken, or not measurable.
- 21-40: present but weak or untrusted.
- 41-60: functional with material leaks.
- 61-80: strong but not consistently evidenced.
- 81-100: proven, joined, and continuously optimized.
- `N/A`: no valid denominator or financial data. Do not manufacture a score.
- The **bounce rate** and **exit rate** rows below are intentionally not treated as the same metric: bounce requires a session-engagement definition, while exit is page-level departure behavior.

## 3.1 Core conversion metrics

| Item | Score | One-line reason | Single highest-impact fix |
|---|---:|---|---|
| CRO | 51 | Strong pages exist, but no joined conversion loop proves which changes create paid outcomes. | Build one weekly funnel report from landing through paid and renewal. |
| CVR / CR | 34 | Verified signup is 0.203% of 90-day pageview people, but attribution and event completeness are weak. | Define pageview-to-verified-signup funnel per landing path. |
| CTR | 28 | Only 3 hero CTA and 3 pricing CTA events appear over 90 days, so CTA click data is clearly incomplete. | Standardize one `cta_clicked` event with placement, destination, and offer. |
| CTA strength | 67 | “Get this Sunday’s 5 names” is concrete, but it is hidden below the fold on mobile by the cookie banner. | Put an email field and one CTA inside the mobile hero. |
| Bounce rate | N/A | `$pageleave` is not a valid bounce definition and GA4 loads late. | Calculate engaged sessions in PostHog, then publish a defined bounce metric. |
| Exit rate | 35 | Exit modal exposure is tracked, but page-level exits and next actions are not joined. | Build exit-by-path report with scroll depth and next click. |
| RPV | N/A | No reliable joined purchase revenue per visitor is available. | Join Stripe purchase value to browser distinct ID and host/path. |
| EPC | N/A | No paid-click spend/click data is available, and paid acquisition is not the preferred channel. | Keep this N/A until a deliberate paid campaign exists. |
| AOV | 40 | Order bumps record intended first-invoice AOV but no reliable completed-purchase AOV report exists. | Capture actual Stripe amount, bump, tier, and coupon to PostHog. |
| LTV / CLV | N/A | There is not enough observed cohort history. | Start monthly cohort retention and net-revenue reporting after purchase joining is fixed. |
| CAC | N/A | Earned/community acquisition cost and founder time are not tracked by source. | Track source, content effort, and paid cash cost only for deliberate campaigns. |
| CPA | N/A | No reliable paid spend or completed acquisition denominator. | Keep N/A until a named paid experiment is approved. |
| CPL | 30 | Leads are captured, but verified state and source do not form a complete lead report. | Report verified subscriber CPL by source and effort, not raw email submit. |
| CPC | N/A | No approved paid campaign data. | Keep N/A. |
| ROAS | N/A | No joined spend and Stripe revenue. | Only calculate after a deliberate paid campaign and server-side revenue join. |
| ROI | 25 | The product has value claims but no source-to-revenue ROI report. | Add a monthly revenue-minus-attributable-cost view. |
| MER | N/A | No documented total marketing spend denominator. | Keep N/A until spend accounting exists. |
| Payback period | N/A | CAC and retained gross profit are unknown. | Start after three complete paid cohorts. |
| KPI | 46 | Events exist, but no clear weekly owner-facing scorecard is visible. | Publish a single operating dashboard with five KPI definitions. |
| North-star metric | 30 | `qualified_visit` is sent only to GA4, while PostHog has zero current events for it. | Emit one host-scoped PostHog `qualified_visitor` event and use it everywhere. |
| OKR | 24 | The repo contains many tactics but no conversion OKR tied to verified users or revenue. | Set one quarterly objective with verified signup, activated buyer, and paid conversion key results. |

## 3.2 Funnel and experimentation

| Item | Score | One-line reason | Single highest-impact fix |
|---|---:|---|---|
| TOFU / MOFU / BOFU mapping | 66 | The value ladder is clear, but pSEO entries do not reliably route people into the right intent path. | Tag every CTA with audience, stage, and next offer. |
| Micro vs macro conversions | 45 | Many micro events exist, but the macro purchase event is not connected to them. | Define macro events: verified signup, paid purchase, first value, retained month two. |
| Drop-off / leak analysis | 32 | Current counts show leaks but cannot diagnose them by person and stage. | Create a scoped 30/90-day funnel insight with person identity continuity. |
| A/B testing | 42 | Hero and OTO exposure events exist, but test results are not decision-grade. | Freeze testing until events and sample thresholds are reliable. |
| MVT | 10 | No evidence of a defensible multivariate test program at current sample size. | Do not run MVT; use sequential single-variable tests. |
| Split-URL testing | 25 | Multiple pages/versions exist but no clear canonical experiment registry is visible. | Add experiment ID, hypothesis, owner, traffic allocation, and stop rule. |
| Statistical significance | 12 | Current event volume is too low for confident winner declarations. | Use pre-set sample thresholds and directional learning only. |
| Sample-size discipline | 20 | Tests appear in code, but no shared calculation or minimum sample rule governs decisions. | Add a simple sample-size template to each experiment ticket. |
| LPO | 60 | Landing architecture is strong, but mobile CTA visibility and narrative length hurt the most important page. | Run the compact hero experiment first. |
| SXO | 52 | Search-entry pages often offer a generic signup link rather than the best next proof step. | Match CTA to page intent, such as a sample, checker, or First Look. |

## 3.3 Behavioral analytics and tracking

| Item | Score | One-line reason | Single highest-impact fix |
|---|---:|---|---|
| GA4 | 60 | GA4 loads on both surfaces and receives qualifying mirrors, but it is lazy-loaded and not the full source of truth. | Document GA4 conversions and reconcile its count with PostHog weekly. |
| GTM | 20 | The implementation uses direct tags, not a governed data layer/container workflow. | Use a small explicit event contract, not a GTM migration, unless needed. |
| Event / goal / conversion tracking | 46 | Good event coverage exists, but event names and IDs do not form a complete revenue journey. | Create one event dictionary and delete/replace duplicate names. |
| Attribution, first / last / multi-touch | 43 | Channel attribution exists and writes a landing event, but only 72 people generated it in 90 days. | Fire first-touch once at page load and pass it through checkout metadata. |
| Heatmaps | 0 | No heatmap evidence found. | Do not add a new vendor yet; use PostHog replay after consent posture is fixed. |
| Scroll maps | 0 | No scroll-depth report is visible. | Capture 25/50/75/90% depth only on money pages. |
| Click maps | 35 | PostHog autocapture exists, but no reviewed click-map decision process exists. | Create one weekly money-page click review. |
| Session recordings | 65 | Live `posthog-recorder.js` loads, with masked-input configuration. | Filter and review 20 qualified mobile sessions per week. |
| Form analytics | 36 | Submit events exist, but field errors, abandonment, and verification completion are not modeled. | Track form viewed, started, invalid, submitted, verification sent, and confirmed. |
| Funnel analysis | 31 | The raw events exist but not a trustworthy person-level paid funnel. | Create PostHog funnels scoped by host and stable event definitions. |
| Cohort analysis | 18 | Buyer health state exists in Resend fields but no cohort report exists. | Build signup-week and purchase-month cohorts. |
| Segmentation | 48 | Lane, cohort, source, UTM, tier, and sector fields exist in scattered places. | Normalize a shared property set with `product`, `host`, `lane`, `offer`, and `source`. |
| PostHog instrumentation | 58 | It captures pageviews, replay, autocapture, vitals, and custom events, but the important purchase join is broken. | Pass `ph_distinct_id` from every entry checkout and validate it with a live test order. |

## 3.4 UX, UI, and information architecture

| Item | Score | One-line reason | Single highest-impact fix |
|---|---:|---|---|
| UX | 64 | The experience is thoughtful and readable, but too long before primary action. | Reduce apex hero-to-form distance on mobile. |
| UI | 73 | Clean dark design, strong typography, and coherent components. | Add a real product visual near paid CTAs. |
| IA | 54 | Navigation exposes many choices before visitors understand the one next step. | Group Explore items by “Proof,” “Try,” and “Buy.” |
| Visual hierarchy | 69 | Headline and proof facts are clear, but the form loses priority on smaller screens. | Put form/card directly after subhead. |
| Above-the-fold clarity | 73 | The who, what, and benefit are clear within five seconds. | Add the immediate value promise and form at the same level. |
| F-pattern / Z-pattern | 60 | Desktop header and hero flow work, but mobile eyes hit the cookie bar before action. | Reposition the notice or shrink it after consent choice. |
| Whitespace | 68 | Desktop spacing is premium, but long vertical gaps add scroll burden. | Tighten the first three mobile sections. |
| Accessibility | 65 | Skip links, labels, and modal focus handling exist. | Run keyboard and screen-reader pass on checkout, forms, cookie notice, and modal. |
| Mobile-first / responsive | 60 | Layout responds well, but CTA visibility and cookie occupation are weak. | Test the 390px path through signup before every release. |
| Progressive disclosure | 66 | FAQs and fit/not-fit blocks reduce pressure well. | Collapse secondary offer detail until a visitor chooses a path. |
| Cognitive load | 45 | Repeated story, proof, objections, and ladder copy asks too much from cold visitors. | Cut 30-40% of repeated apex copy, preserving proof and CTA. |
| Friction points | 44 | Email confirmation, sector choice, cross-domain flow, and mailto create preventable leaks. | Make each next step obvious, instrumented, and one-domain where possible. |
| Form design / abandonment | 48 | Forms use email autocomplete and labels, but no abandonment/error events prove performance. | Capture form step and validation events. |
| Cart / checkout abandonment | 28 | Checkout start is known, but Stripe completion and cancellation are not joined to the same visitor. | Pass distinct ID and query started-to-completed-to-cancelled by tier. |
| Guest checkout | 82 | Stripe captures email at checkout and does not require an account first. | Keep it; test card and SEPA paths live. |
| Autofill | 70 | Email fields use `autocomplete=email`; Stripe handles payment fields. | Confirm mobile browser autofill on apex and pSEO forms. |
| Inline validation / error states | 58 | HTML input validation and error copy exist, but source shows no granular error tracking. | Add inline errors and `form_invalid` events. |
| Loading states | 70 | Checkout shows “Opening secure checkout” and form buttons show sending state. | Add timeout-specific recovery and log checkout session errors. |
| Empty states | 44 | Product tools have some empty states, but paid Dashboard first-use state is not demonstrated. | Build a first-run “pick sector, open signal, create watchlist” screen. |
| Confirmation / thank-you pages | 67 | Good follow-on offer and proof links, but first value is not visibly verified. | Show and measure a sample issue before the upsell. |

## 3.5 Speed as a conversion lever

| Item | Score | One-line reason | Single highest-impact fix |
|---|---:|---|---|
| CWV | 62 | Field data exists on both hosts, which is a major improvement. | Monitor p75 weekly by host, path, and device. |
| LCP | 38 | Apex p75 LCP is 7,540ms on 21 events; signals p75 is 2,873ms on 1,160 events. | Profile and fix apex mobile LCP first, then reduce signals LCP below 2.5s. |
| INP | 69 | Signals p75 INP is 202ms, close to good but not yet there. | Review long tasks from replay on interactive pages. |
| CLS | 95 | Signals p75 CLS is 0.00 across 780 events. | Preserve it with a regression assertion. |
| TTFB | 79 | Signals p75 TTFB is 644ms. | Keep the current server/cache baseline. |
| FCP | 55 | Signals p75 FCP is 960ms; apex p75 is 7,428ms on a thin sample. | Diagnose apex script and CSS waterfall before adding new code. |
| TBT | 45 | No real field TBT report is available. | Use a mobile Lighthouse baseline and reduce third-party JS. |
| Real page-load time | 45 | Page-level field vitals exist, but no journey-level load report by money page. | Track vitals separately for home, pricing, dashboard, and confirmed. |
| Mobile speed | 42 | The 390px page is visually solid but field LCP is poor and notices/tracker scripts compete. | Remove paid trackers and optimize the hero critical path. |

## 3.6 Persuasion, offer, and copy

| Item | Score | One-line reason | Single highest-impact fix |
|---|---:|---|---|
| Hook-Story-Offer | 78 | The pages use the structure intentionally and consistently. | Shorten the story before the first conversion action. |
| Value ladder | 82 | Free to high-ticket rungs are clear and generally coherent. | Reconcile every rung, price, capacity, and delivery promise from one source. |
| Offer stack | 68 | First Look and Dashboard stacks feel concrete, but several values and deliverables conflict across surfaces. | Define fulfillment-backed stacks only. |
| UVP / USP / value proposition | 79 | “Public engineering signal before the round” is distinct and clear. | Use one canonical proof sentence everywhere. |
| Headline strength | 76 | The hero gives a sharp outcome for a defined buyer. | Test a more concrete next-value variant against current hero. |
| Microcopy | 64 | Helpful reassurance exists around payment, cancellation, and fit. | Standardize promised timings, sectors, and delivery language. |
| Readability | 58 | Plain language is strong, but total copy volume is too high for an investor's scan. | Create a one-minute version of home, pricing, and Dashboard. |
| AIDA | 71 | Attention and interest are strong; action gets delayed on mobile. | Bring the CTA/form into the first attention block. |
| PAS | 68 | Late-deal pain and cost of delay are well articulated. | Use fewer repetitions of the same pain. |
| Lead magnet | 72 | Velocity Verdict and sample issue are relevant. | Deliver the sample immediately after verification and measure consumption. |
| Squeeze / opt-in page | 62 | The home form offers a clear low-cost exchange. | Add one specific immediate reward and reduce visual friction. |
| OTO | 55 | OTO architecture exists, but outcome tracking and delivery proof are weak. | Track accepted, declined, charged, delivered, refunded by OTO. |
| Order bump | 60 | Dashboard and First Look bumps are relevant, but AOV outcome is unproven. | Keep only bumps that increase retained gross profit, not just checkout value. |
| Upsell | 64 | Each rung points up naturally. | Trigger upgrade offers only after a measurable value moment. |
| Downsell | 62 | Free digest is a reasonable fallback. | Track why a buyer takes the fallback and whether it later converts. |
| Epiphany bridge | 72 | “Public is not the same as read” is a strong belief shift. | Put the evidence immediately after the bridge. |
| Soap-opera sequence | 58 | A sequence exists, but post-confirmation and open/click outcomes are not joined. | Measure each email's first meaningful action and paid influence. |
| Urgency | 70 | Closed founding deadline and live thesis framing are credible. | Remove any urgency that lacks a live source of truth. |
| Scarcity | 56 | Seat and batch caps are plausible but need live capacity backing. | Render capacity only from an internal queue/capacity record. |
| FOMO | 66 | Missing an early deal is relevant to the buyer. | Pair it with evidence, not stronger fear copy. |
| Social proof | 43 | Honest refusal to fake testimonials is right, but public proof is not yet organized as buyer proof. | Use verified anonymized outcomes only after they exist. |
| Testimonials / case studies | 22 | Illustrative composites are properly labeled, but there are no verified customer stories. | Collect one permissioned, factual user story after a real result. |
| Trust signals | 67 | SSRN, ledger, source, data, refund, and public limits are strong. | Remove conflicting claims and tracker contradictions first. |
| Risk reversal / guarantee | 80 | The 30-day guarantee is specific and repeated. | Make fulfillment/refund operational data visible internally. |
| Price anchoring | 52 | Anchors are present but some component values feel unsupported. | Use only externally defensible comparisons or remove numbers. |
| Decoy effect | 40 | Multiple tiers may function as a decoy rather than guidance. | Add explicit recommended paths rather than more pricing cards. |
| Reciprocity | 68 | Free digest, sample issue, methodology, and tools create real give-first value. | Attach the best free proof to each paid path. |
| Authority | 75 | Research, reproducibility, public methods, and constraint honesty are strong. | Reconcile every authority claim to the claims ledger. |
| Commitment / consistency | 64 | Free email, sample issue, and €7 step create sensible commitments. | Use verified-sample reading as the trigger to offer First Look. |
| Liking | 66 | The Data Nerd voice is distinctive and anti-hype. | Cut self-referential copy that slows the buyer's own story. |
| Consensus | 33 | No verified peer adoption proof exists, and fake proof is correctly avoided. | Add consensus only when real cohort evidence exists. |
| Loss aversion | 67 | The cost of hearing about deals late is credible for this audience. | Tie it to a specific workflow, not a generic missed-out threat. |

## 3.7 Trust and technical conversion factors

| Item | Score | One-line reason | Single highest-impact fix |
|---|---:|---|---|
| SSL / HTTPS | 95 | All audited public routes use HTTPS. | Keep HSTS/security-header checks in release verification. |
| Trust badges / security seals | 55 | Stripe and public methodology carry trust, but visual badges are limited. | Do not add generic badges; show Stripe checkout and real data proof instead. |
| Payment options / friction | 72 | Checkout API supports card and SEPA for the relevant tiers. | Live-probe every tier and payment method after price changes. |
| Stripe checkout UX | 62 | Checkout creation is clean, but annual pricing/source drift and analytics identity loss are severe. | Fix canonical price/link contract and browser-to-webhook identity join. |
| GDPR / consent-banner UX | 20 | A passive “Got it” notice cannot justify trackers that already load and conflicts with its own text. | Remove paid trackers or block nonessential tags until explicit consent. |
| Schema / rich results that lift pre-click intent | 62 | Product, FAQ, and structured data exist, but offer details drift from live pages. | Generate product/offer schema from the same canonical pricing data. |

## 3.8 SaaS and product-led conversion

| Item | Score | One-line reason | Single highest-impact fix |
|---|---:|---|---|
| PLG | 48 | Free APIs, MCP, tools, and digest help self-serve discovery, but paid activation is unclear. | Define a free-to-paid product moment, not just a content path. |
| Activation rate | N/A | Customer health has events, but no paid cohort activation report. | Define activation as first signal view plus one meaningful action within seven days. |
| Onboarding flow | 55 | Welcome emails and drips exist, but current promises conflict and early value is not measured. | Create one buyer checklist with events for each step. |
| TTV | 42 | Email-first value can make users wait until Sunday, though source claims immediate sends. | Deliver current sample/last issue immediately after verification and measure it. |
| Aha moment | 45 | The likely aha is “I found one name useful,” but it is not defined or tracked. | Add “mark useful lead” after a signal view. |
| Trial-to-paid | N/A | There is no conventional product trial and no defined free-to-paid cohort report. | Track verified digest readers who take First Look or Dashboard. |
| Freemium-to-paid | 34 | The ladder exists but no trusted cohort conversion report exists. | Report conversion by source, lane, and first valuable action. |
| PQL | 28 | No scoring definition turns engaged product users into a sales/upgrade cue. | Define PQL as two meaningful free actions plus a pricing view. |
| MQL | 30 | Email capture and sector intent exist, but qualification is scattered. | Add a single lead status model: visitor, verified, qualified, PQL, buyer. |
| SQL | 35 | Sector Sweep applications are high intent but mailto prevents consistent qualification. | Use the structured application form and a review status. |
| MRR / ARR impact | N/A | There is no reliable purchase and subscription revenue cohort report. | Build Stripe-to-PostHog MRR view after identity joining. |
| Churn | N/A | Cancellation event code exists but current cohort size does not justify a rate claim. | Track cancellation reasons, time-to-first-value, and retained months. |
| Expansion / NRR | N/A | Upsells and referrals exist but expansion revenue cannot be reconciled by buyer. | Add tier-change and expansion revenue events tied to customer ID. |

## 3.9 Capture and retention

| Item | Score | One-line reason | Single highest-impact fix |
|---|---:|---|---|
| Email opt-in rate | 34 | 16 verification sends in 90 days are visible, but no clean landing-path denominator exists. | Build opt-in funnel by page and source. |
| Double opt-in | 72 | Verification flow is implemented and email URLs are scrubbed in the browser. | Track verification delivery, click, success, and failure end-to-end. |
| Exit intent | 35 | It has 240 opens but only 3 recorded submissions. | Test one simpler offer after fixing form event coverage. |
| Retargeting / remarketing readiness | 15 | Pixels load, but they conflict with stated privacy and earned-growth strategy. | Remove paid retargeting tags until an explicit paid plan and consent are approved. |
| Personalization | 48 | Route/lane/sector options exist, but are not consistently used across the journey. | Personalize the first issue and confirmation page by one declared investor lane. |
| Dynamic content | 52 | Route-specific confirmation and existing concierge logic exist. | Use dynamic content only from verified first-party inputs. |

## 3.10 Voice of customer

| Item | Score | One-line reason | Single highest-impact fix |
|---|---:|---|---|
| NPS | 0 | No NPS collection or action loop found. | Ask NPS only after a buyer has had a real value event. |
| CSAT | 15 | Support replies exist, but no structured post-resolution rating. | Add a one-click helpful/not-helpful question after support resolution. |
| CES | 0 | No effort measurement for signup, First Look, or cancellation. | Ask one CES question after a completed First Look or cancellation. |
| VoC signals | 38 | Replies, cancellations, and live behavior exist but are not synthesized. | Store tagged objections, outcomes, and cancellation reasons in one weekly review. |

## 3.11 Additional conversion concepts

| Item | Score | One-line reason | Single highest-impact fix |
|---|---:|---|---|
| Paradox of choice | 42 | The seven-rung ladder is valuable but too many choices appear before recommendation. | Add a three-option chooser at entry. |
| Hick's law | 45 | Navigation and footer offer too many early choices. | Remove secondary navigation from conversion pages. |
| Endowment effect | 35 | Users can browse proof but are not shown a saved personal shortlist/value state. | Let free users save one watchlist or sector view before upgrade. |
| Micro-commitments | 68 | Free digest, sample issue, and €7 pass create sensible steps. | Ensure each step earns a visible next commitment. |
| Zeigarnik effect | 58 | Curiosity loops are present on First Look. | Use one specific unfinished insight, not many repeated loops. |
| Von Restorff effect | 65 | The orange CTA stands out in the dark interface. | Reserve the color for exactly one primary action per viewport. |
| Cognitive ease | 55 | Plain English is a strength, but sheer page length reduces ease. | Use concise summaries and a visible “read more” path. |
| Banner blindness | 48 | Repeated trust/urgency bars may become ignored. | Remove redundant bands and keep one proof bar near checkout. |
| Message match | 48 | Channel-aware components exist, but paid-channel work is not the priority and UTM event coverage is thin. | Match community/referral pages to a specific proof CTA. |
| Friction budget | 44 | Some paths ask for confirmation, email, sector, then checkout before value. | Give a sample first and ask only for the next required field. |

---

# 4. Ranked top 10 conversion wins

Sorted by impact divided by implementation effort. Scores are planning priorities, not forecasts.

| Rank | Win | Expected impact | Effort | Impact / effort | Why it comes first |
|---:|---|---:|---:|---:|---|
| 1 | Stop re-subscribing suppressed contacts | 10 | 2 | 5.00 | Prevents a direct trust and compliance failure in the €7 intent flow. |
| 2 | Remove or consent-gate Meta and LinkedIn trackers | 9 | 2 | 4.50 | Fixes a visible privacy contradiction and reduces apex mobile load. |
| 3 | Create one PostHog qualified-visitor event and funnel | 8 | 2 | 4.00 | Gives the product a usable north-star denominator before more copy tests. |
| 4 | Repair claims and offer consistency across live/source | 10 | 3 | 3.33 | Data credibility is the product. Resolve 15/19/20 sectors, 60+/140+, and 219 language. |
| 5 | Join `checkout_started` to `purchase_completed` | 9 | 3 | 3.00 | Makes revenue conversion measurable by landing path, offer, and source. |
| 6 | Send immediate verified value and record it | 8 | 3 | 2.67 | Reduces email-first time to value from “wait until Sunday” to minutes. |
| 7 | Run live Stripe tier probes and replace stale source URLs | 10 | 4 | 2.50 | Prevents a checkout failure or price mismatch on revenue pages. |
| 8 | Give Sector Sweep a structured, instrumented application | 7 | 3 | 2.33 | Converts a dead-end mailto into a measurable high-ticket lead process. |
| 9 | Create a weekly VoC and cancellation insight loop | 7 | 3 | 2.33 | Makes retention and messaging improve from real buyer language. |
| 10 | Trim apex home and put one visible CTA above fold | 8 | 4 | 2.00 | Improves the main mobile conversion surface after truth and measurement are fixed. |

---

# 5. Next-session execution plan

## Phase 0: protect the worktree and establish truth

**Do not edit until these are complete.**

1. Read `/Users/sipi/signals-gitdealflow/AGENTS.md` and `/Users/sipi/signals-gitdealflow/pseo-site/AGENTS.md`.
2. Check `git status --short`, `git stash list`, running Vercel builds, and open PRs. Preserve existing dirty files:
   - `monitoring/subscriber-count.jsonl`
   - `monitoring/subscriber-count.md`
   - `pseo-site/scripts/ancestry-ledger.json`
3. Inspect open PRs #385 and #373 before any work on trust copy or Dashboard CTAs.
4. Create an isolated worktree from current `main` for this conversion release. Do not use a retired checkout.
5. Build a canonical `conversion-offer-contract` data file before changing text. It must contain:
   - canonical claims: 350+, 15, 219 startup-period observations across 55 startups
   - current Dashboard field language, only if verified against accessible product data
   - all live Stripe product/tier prices and URLs
   - exact fulfillment promise and deadline for every tier
   - capacity only where a real queue/source exists
6. Run a repository scan for forbidden drift: `20 sectors`, `19 sectors`, `140+ startups`, `60+ / 20`, old annual links, `219 documented fundraises`, and unverified trust-bar numbers.

**Acceptance gate:** a written diff list identifies every public source that needs correction. No content is changed merely to make a guard pass.

## Phase 1: fix trust and consent before optimization

### 1A. Preserve suppression in First Look intent

**Target:** `pseo-site/app/api/firstlook/intent/route.ts`

**Problem:** on an already-existing Resend contact, the route patches `{ unsubscribed: false }`. That re-adds a suppressed contact. It violates the product's suppression rule.

**Required change:**

- Never set `unsubscribed: false` for an existing contact.
- Before any new contact add, use the existing exclusion/suppression guard.
- If an email is suppressed, return a neutral success response with no send and no reactivation. Do not reveal suppression state.
- Store sector intent only where the user has explicitly consented and the contact is eligible.
- Add an automated test: existing unsubscribed contact remains unsubscribed after intent request.

**Verification:**

- Unit test covers new eligible contact, existing subscribed contact, existing unsubscribed contact, global suppression, and malicious origin.
- Read back the Resend contact state in a safe test or sandbox. Never use a real suppressed prospect.

### 1B. Fix tracker/consent contradiction

**Targets:** `landing/pixels.js`, `pseo-site/components/PixelManager.tsx`, relevant privacy pages, and CSP.

**Preferred GitDealFlow decision:** remove hardcoded Meta and LinkedIn IDs now. Keep the code capable of loading an approved tag later, but default to no paid-platform requests. This matches earned/community GTM and the site's “no ads, no cross-site tracking” promise.

**If trackers must remain:**

- Build explicit opt-in consent before Meta/LinkedIn load.
- Do not use “Got it” as consent.
- Block tags until opt-in. Respect GPC/DNT.
- State the actual trackers in privacy text and in every locale.

**Verification:**

- Fresh browser profile, no consent: no `facebook.com`, `connect.facebook.net`, or `snap.licdn.com` network resource.
- Consent path, if retained: tag fires only after explicit opt-in.
- Mobile LCP/FCP field data improves or at minimum does not regress.
- Privacy text and behavior match exactly.

## Phase 2: make revenue conversion measurable

### 2A. Canonical event contract

Create `docs/conversion-event-contract.md` or a type-safe equivalent. Required common properties:

```text
product = gitdealflow
host = gitdealflow.com | signals.gitdealflow.com
path
entry_surface
cta_placement
offer = free_digest | teardown | firstlook | dashboard | insider | sector_sweep | credits
lane
sector
utm_source / utm_medium / utm_campaign / utm_content
experiment_id / variant
ph_distinct_id where safe and pseudonymous
```

Required events:

```text
landing_viewed
cta_clicked
signup_form_viewed
signup_form_started
signup_validation_failed
signup_verify_sent
signup_verified
sample_issue_opened
sample_issue_read
pricing_viewed
checkout_started
checkout_session_created
checkout_redirected
purchase_completed
payment_cancelled
first_value_reached
watchlist_created
signal_opened
export_downloaded
subscription_cancelled
refund_requested
refund_completed
```

Do not include raw email in browser analytics properties.

### 2B. Repair browser-to-Stripe identity join

**Targets:** apex checkout scripts, `pseo-site/components/CheckoutDistinctId.tsx`, `pseo-site/app/api/checkout/session/route.ts`, `pseo-site/app/api/webhook/stripe/route.ts`.

**Problem:** source checkout endpoint accepts `ph_distinct_id` and persists it to metadata. Apex Dashboard checkout currently posts only tier, variant, bump, and referral. Purchase webhooks therefore fall back to email identity, making pre-purchase and post-purchase events separate people.

**Required change:**

1. Read PostHog distinct ID safely after PostHog is loaded.
2. Pass it in every entry checkout request, including Dashboard, First Look, Insider, Sector Sweep, agent credits, and any fallback route.
3. Preserve it only in Stripe metadata, never in a URL.
4. Webhook emits `purchase_completed` using that same ID, plus tier, actual amount, currency, bump, coupon, attribution, and a server-side marker.
5. Add idempotency guard tests so webhook retries do not duplicate revenue events.

**Verification:**

- Use a Stripe test-mode checkout or a live non-payment probe only where safe.
- In PostHog, one test person sees `checkout_started` then `purchase_completed` in order.
- No raw email appears in event properties.
- Query scoped to `$host` and `product=gitdealflow` returns the joined sequence.

### 2C. Fix the north-star metric

**Problem:** `qualified_visit` is mirrored into GA4 by `landing/pixels.js` and `PixelManager.tsx`, but PostHog currently reports zero `qualified_visit` events over 90 days.

**Required change:**

- Choose one definition: a person is qualified if they verify signup, start checkout, use a meaningful free tool, open the concierge, or reach a high-intent proof page. Keep the definition narrow and documented.
- Emit it once per session in PostHog and mirror it to GA4. Do not send it only to GA4.
- Build one PostHog insight and one GA4 audience from exactly the same definition.

**Acceptance metric:** report qualified visitors, verified signups, checkout starts, purchases, first-value activations, and retained buyers by source every week.

## Phase 3: truth and offer reconciliation

### 3A. Fix content drift

Correct these known conflicts:

| Conflict | Where observed | Required resolution |
|---|---|---|
| 15 vs 19 vs 20 sectors | Live Dashboard has 15 and “60+ / 20”; pSEO First Look source lists 19 | Use canonical 15 everywhere unless the live panel/research truth lock changes with explicit approval. |
| 60+ vs 140+ Dashboard startups | Live Dashboard says 60+; checked-out source says 140+ | State only the verified current paid deliverable. Do not use panel size as Dashboard count unless the customer sees it. |
| €490 vs €441 Dashboard annual | Live DOM and payment-links inventory show €490; source references €441 and an old Checkout ID | Use the live verified Stripe price/link. Remove old IDs from source and tests. |
| 219 “fundraises” | Old landing/proof copy | Use “219 startup-period observations across 55 startups.” |
| Delivery time / format | First Look and Sector Sweep page and email variants | Set one verified promise for every offer and write it once. |
| Trust-bar amounts | pSEO root layout includes `$80M+` and `5,000+` claims | Verify in claims ledger or remove. |

### 3B. Stripe verification gate

Before changing any price or CTA:

1. Read `stripe/payment-links.md`.
2. Use Stripe API to verify active status, mode, currency, amount, recurring interval, product name, and success/cancel target for each tier.
3. Use a safe rendered checkout probe for every active link. Do not enter payment credentials.
4. Check source-to-live link parity.
5. Verify existing grandfathered links remain inactive.

**Acceptance gate:** no price change is deployed until source, rendered page, live Checkout metadata, and Stripe API match.

## Phase 4: improve first value and activation

### 4A. Free subscriber activation

**Goal:** a verified subscriber gets proof within minutes, not only next Sunday.

- Send the latest public sample or a safely selected recent issue immediately after verification.
- The confirmation page should link to the exact sample and explain what to notice in two minutes.
- Track delivery, open, sample link click, sample read, and a “this was useful” micro-action.
- Do not claim “the five names are already there” unless the exact send result is known.

### 4B. Paid buyer activation

**Definition to implement:** buyer reaches first value when they open a signal and complete at least one meaningful action: create a watchlist, export a shortlist, save a company, or mark a lead useful.

- Update `customer-health.ts` only with a durable, truthfully observed activity event.
- Add a post-purchase guided checklist with 3 steps and a visible completion state.
- Send the day-2 and day-7 messages only after checking whether first value occurred.
- Ask the buyer one short question after meaningful value: “Did one name change what you will research this week?”

## Phase 5: page conversion work

### 5A. Apex homepage experiment

**Hypothesis:** moving a tangible immediate reward and the email field into the first mobile viewport improves verified signup without lowering lead quality.

**Control:** current page.

**Variant:**

```text
Eyebrow: For angels, scouts, and seed investors
Headline: Find technical startups building fast before the round is public.
Proof: 350+ orgs. 15 sectors. 219 startup-period observations across 55 startups.
Form: Email address + “Get the next Sunday issue and read a sample now”
Trust: Free. One email each Sunday. Unsubscribe in one click.
Secondary link: See exactly how the signal is measured.
```

**Rules:**

- Keep truth lock wording.
- Do not hide the methodology.
- Remove repeated explanation above the first form.
- Run only after event coverage is fixed.
- Do not call a winner until the sample threshold is met. At current conversion volume, expect a long test. Use it for directional learning first.

### 5B. Dashboard product proof

- Add a real, current, privacy-safe Dashboard screenshot, short annotated GIF, or 45-second product walkthrough.
- Next to it, show exactly what the buyer can do: filter a sector, open a signal, see history, and save a watchlist.
- Keep the sample issue as the secondary proof path.
- Replace unsupported “worth” line items with either verified comparable research or a simpler value stack without fake precision.

### 5C. Pricing decision architecture

Put one question above the ladder:

```text
What do you need this week?
- I want proof first: Free Sunday Signal
- I have one live sector thesis: First Look, €7
- I source every week: Dashboard, €49/month
```

Route the other tiers below this decision. Keep Insider and Sweep for informed/high-intent visitors, not as early choice overload.

### 5D. Sector Sweep qualification form

Replace mailto as the primary CTA with a form that asks:

- What decision will this report support?
- Sector/sub-sector
- Geography
- Stage
- Names already known
- Deadline
- Email

Required events: `sweep_application_started`, `sweep_application_submitted`, `sweep_application_qualified`, `sweep_quote_sent`, `sweep_paid`, `sweep_delivered`, `sweep_refunded`.

No automatic payment link until a human has reviewed suitability.

## Phase 6: Voice of customer and retention

1. Add one post-value micro-feedback action: useful / not useful / not yet.
2. At cancellation, retain structured Stripe reason plus free-text, time-to-first-value, last meaningful action, and tier. Do not interrupt cancellation.
3. Ask NPS only after a buyer has reached first value and had enough time to evaluate it.
4. Create a weekly VoC summary:
   - exact objections
   - why people did not buy
   - first-value failures
   - cancellation reasons
   - language buyers use to describe desired outcome
5. Feed only verified recurring themes back into copy tests and onboarding.

---

# 6. Required tests and verification

## Automated tests

- Suppressed contact never gets reactivated by First Look intent, checkout, or any add-to-audience path.
- Canonical offer contract has 15 sectors and approved price values.
- No stale Stripe link IDs or €441 annual reference remains.
- Checkout request includes valid `ph_distinct_id` when available.
- Stripe webhook preserves idempotency and produces exactly one purchase event.
- Event payloads contain no raw email address.
- Privacy text and tag settings are asserted together.
- Claim guard covers 350+, 15 sectors, and the exact 219-observation wording.

## Browser verification

Use a clean browser profile on desktop and 390px mobile:

1. Homepage: CTA/form visible without first dismissing an oversized banner.
2. No Meta/LinkedIn resource loads before explicit opt-in, or no resource loads at all if removed.
3. Signup: valid email, invalid email, honeypot, rate limit, verification result, and confirmation route work.
4. Dashboard: monthly and annual buttons reach the correct live Stripe Checkout, with no card entry.
5. First Look: sector selector matches canonical 15, selected sector reaches checkout metadata, no suppressed email is reactivated.
6. Sector Sweep: application confirmation works and is measurable.
7. Accessibility: keyboard tab path, dialog escape/focus, labels, error messages, and sticky CTA on mobile.

## Data verification

After a safe test journey, query PostHog by `product='gitdealflow'` and host:

```text
landing_viewed
-> signup_verify_sent
-> signup_verified
-> sample_issue_opened
-> checkout_started
-> purchase_completed
-> first_value_reached
```

Confirm the same pseudonymous distinct ID appears from checkout start through purchase. Confirm Stripe purchase amount, tier, bump, and source agree with the event.

## Release verification

- Run relevant unit tests, lint, typecheck, and production build.
- Run the repository's claim and regression guards. Do not weaken guards to pass.
- Deploy only from the canonical `~/signals-gitdealflow/pseo-site` lineage for signals, and the correct landing Vercel project for apex.
- Verify the alias after deployment because concurrent sessions can change it.
- Verify rendered production with screenshots, not HTTP 200 alone.
- Re-run the live tracker resource check, checkout link check, and event query after deploy.

---

# 7. Weekly operating scorecard after implementation

Review every Monday. Do not optimize page copy without this evidence.

| Metric | Definition | Weekly decision |
|---|---|---|
| Qualified visitors | One person who reaches defined high-intent behavior | Which source brings investors, not random traffic? |
| Verified signup rate | `signup_verified / qualified visitors` | Is the first exchange compelling and low-friction? |
| Sample-value rate | `sample_issue_opened / signup_verified` | Are we proving value quickly? |
| First Look take rate | `firstlook purchase / verified signup` | Does immediate thesis-specific proof work? |
| Dashboard checkout rate | `checkout_started / Dashboard pricing viewers` | Is the paid offer clear enough to evaluate? |
| Dashboard purchase rate | `purchase_completed / checkout_started` | Is price, payment, or checkout causing friction? |
| First-value activation | `first_value_reached / new paid buyers` | Did the product earn its first month? |
| Month-two retention | retained buyers / eligible buyers | Is recurring value real? |
| Expansion rate | higher tier or add-on revenue / eligible buyers | Do buyers reach a natural next rung? |
| Top VoC theme | count of tagged reason/outcome | What must change next, based on buyer language? |

---

# 8. Exact next-session prompt

```text
Continue GitDealFlow conversion work from /Users/sipi/signals-gitdealflow/docs/GITDEALFLOW-CONVERSION-AUDIT-NEXT-SESSION-2026-08-21.md.

Execute phases 0 through 3 first, not the visual copy tests. Preserve the current unrelated dirty files. Read AGENTS.md and pseo-site/AGENTS.md, inspect open PRs #385 and #373, and work from an isolated current-main worktree.

Non-negotiables: canonical claims are 350+ startup orgs, 15 sectors, and 219 startup-period observations across 55 startups. Never call them 219 fundraises. Never reactivate suppressed contacts. Do not load Meta or LinkedIn trackers before explicit consent, and prefer removing them because GitDealFlow is earned/community-led. Never invent customer proof, revenue, capacity, or performance claims. Any Stripe/pricing change requires a live Stripe API plus rendered Checkout probe before deploy.

First deliverable: a source-to-live claim/offer matrix and tests for suppression preservation, canonical claims, checkout distinct-ID propagation, and no raw-email analytics. Then implement and verify the full browser-to-Stripe-to-PostHog purchase join with a safe test journey. Only after that, ship the homepage/mobile CTA and paid page conversion work. Finish with build, production screenshot, tracker-resource verification, Stripe link verification, and a PostHog event query that proves the exact intended funnel.
```
