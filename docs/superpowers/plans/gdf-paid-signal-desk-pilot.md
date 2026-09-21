# GitDealFlow Paid Signal Desk Pilot

## Copy-paste prompt for the implementation session

You are implementing a revenue experiment for GitDealFlow in the canonical repository:

```text
/Users/sipi/signals-gitdealflow
```

Your goal is to ship and verify a small, honest, revenue-focused offer that converts existing GitDealFlow attention into paid pilots.

Do not return a plan instead of implementation. Inspect the repository, make the changes, run the required checks, deploy through the canonical path if the checks pass, and verify the live result with a browser screenshot.

---

## Business goal

Sell the first five paid pilots to solo GPs, scouts, and emerging fund managers.

Offer:

> **GitDealFlow Signal Desk, 30-day pilot**
>
> Every Monday, receive five GitHub-accelerating companies matched to the investor's sectors, with plain-English reasoning, counter-evidence, and a suggested next action.
>
> **€250 upfront, credited toward the €490 annual Dashboard.**
>
> Five founding seats only.

This is a revenue test, not a broad redesign. The primary success event is a real paid checkout or a qualified payment-intent event that can be verified in Stripe. Do not claim revenue, customers, conversion, or pilot acceptance unless the live system proves it.

---

## Repository and deployment rules

Read these before editing:

1. `/Users/sipi/signals-gitdealflow/AGENTS.md`
2. `/Users/sipi/signals-gitdealflow/pseo-site/AGENTS.md`
3. The current pricing, Stripe, analytics, and landing-page implementation files.
4. `CLAIMS-LEDGER.md` if present.

Canonical deployment lineage:

- Work only in `/Users/sipi/signals-gitdealflow`.
- Use the `main` branch unless the current session has an explicitly approved isolated branch.
- The canonical pSEO checkout is `/Users/sipi/signals-gitdealflow/pseo-site`.
- Do not work in `/Users/sipi/signals-worldclass/pseo-site`.
- Do not work in any retired Downloads checkout.
- Do not edit `.deploy-lineage` or weaken any guard.
- Do not use `npx vercel`.
- Do not deploy while another Vercel build or deploy for this project is running.
- Check for competing processes before touching the worktree:

```bash
ps aux | grep -E "vercel (deploy|build)" | grep -v grep || true
git status --short --branch
git stash list
```

If the worktree is dirty because of another agent, stop and inspect the changes. Do not reset, stash, clean, or overwrite another agent's work.

---

## Locked truth and copy rules

Use only claims already supported by the repository and live public surfaces.

Allowed current claims:

- `350+ startup organizations` or `350+ startups`
- `15 sectors`
- `219 startup-period observations across 55 startups`
- `21-47 days before public fundraise announcements`, only when clearly described as a retrospective research-panel result, not a guaranteed forecast
- `Q3 2026` only where the current data period confirms it
- `€490/year` for the Dashboard only if the live Stripe configuration and current pricing implementation confirm it

Never write:

- `400+`, `411`, `369`, or `4,200+` as the current panel size
- `219 fundraises` or `219 funding events`
- Guaranteed prediction language
- Invented customer names, logos, testimonials, funds, revenue, subscriber counts, conversion rates, or performance improvements
- “Used by” or “trusted by” unless supported by a verified source
- Any claim that a pilot has been sold before Stripe or the payment system proves it

The offer must be described as a pilot or founding offer, not as an existing product line with customers.

Use the pseudonymous public brand voice. Do not reveal Maryan's real name or personal identity in public-facing GitDealFlow copy. Do not add a legal or postal block to marketing copy.

---

## Strategic position

The landing page currently presents GitDealFlow as an early signal for investors. Preserve that position.

The new commercial message should be operational:

> **Every Monday, know which technical startups deserve 30 minutes of your attention before the round becomes obvious.**

Do not turn GitDealFlow into a generic CRM, a generic newsletter, or an investment-advice product.

The pilot should make the existing signal useful inside a weekly sourcing routine:

1. Pick the investor's sectors.
2. Review five candidates.
3. Read the signal and counter-evidence.
4. Choose which companies deserve diligence.
5. Record or export the next action.

If the repository has no working mechanism for personalized sector selection, do not invent a backend system in this task. Implement the smallest truthful version using the existing product surface, email capture, Stripe checkout, and a structured pilot intake form or mailto flow. Clearly mark any manual fulfillment step.

---

## Scope

Implement only the smallest complete path needed to sell and measure the pilot.

### Required user path

A qualified visitor must be able to:

1. Understand the pilot offer.
2. See the exact price, €250 upfront.
3. Understand that the €250 is credited toward the €490 annual Dashboard.
4. See that there are five founding seats only.
5. Pay through a working Stripe checkout, or reach the existing verified Stripe flow if the repository already has a suitable payment link.
6. Provide enough information for fulfillment:
   - name
   - email
   - fund or investor type
   - sectors of interest
   - preferred weekly delivery email
   - optional note about current sourcing workflow
7. Understand what happens after payment.
8. Receive a verifiable confirmation or success state.

### Required measurement path

Track the funnel using the existing analytics stack and conventions. Do not add a second analytics provider.

At minimum, distinguish:

- `signal_desk_offer_viewed`
- `signal_desk_cta_clicked`
- `signal_desk_checkout_started`
- `signal_desk_checkout_completed`
- `signal_desk_intake_submitted`

Use the existing `ph_distinct_id` checkout attribution pattern if it is already implemented. Do not regress the existing `checkout_started` and `purchase_completed` join.

Event properties should include only non-sensitive operational fields, such as:

```json
{
  "offer": "signal_desk_pilot",
  "price_eur": 250,
  "credit_toward_dashboard_eur": 490,
  "seat_limit": 5,
  "investor_type": "solo_gp|scout|seed_fund|angel|other",
  "sector_count": 1
}
```

Do not send free-form investment notes, company names, personal notes, or payment details to analytics.

---

## Stripe requirements

Before creating a new Stripe product or price, inspect the current Stripe integration and existing products. Reuse an existing active payment link only if it exactly matches the intended offer and can be verified live.

If a new Stripe price or payment link is required:

1. Use the existing repository scripts and environment loading pattern.
2. Never paste keys into chat, files, commits, logs, or the prompt output.
3. Create an explicit one-time EUR 250 payment.
4. Put the credit language in the Stripe checkout description or metadata where appropriate:
   - `€250 Signal Desk pilot`
   - `Credited toward the €490 annual Dashboard`
5. Add metadata that identifies the offer:

```text
offer = signal_desk_pilot
pilot_duration_days = 30
credit_toward_dashboard_eur = 490
seat_limit = 5
```

6. Do not change the existing €490 Dashboard price unless the user explicitly requests it.
7. Do not create annual or recurring billing for the pilot.
8. Do not depend on Stripe defaults for currency, amount, mode, or metadata.
9. Verify the created object through a read-back API call.
10. Run a live checkout probe in test mode or through the repository's approved production-safe probe. Do not use a real payment method.
11. Verify the checkout page visibly shows the intended price and offer.
12. Verify cancellation and return URLs are valid.

If Stripe authentication or a human-only dashboard action is required, stop at that exact gate and report the missing action. Do not fabricate a checkout URL.

---

## UX and copy requirements

Do not redesign the whole site. Add a focused offer section and the minimum supporting flow.

The offer must answer these questions without requiring a call:

- Who is this for?
- What arrives every Monday?
- How much does it cost?
- What does the 30-day pilot include?
- What does “credited toward Dashboard” mean?
- What happens after payment?
- Is GitDealFlow investment advice?
- What data is used?
- How are false positives handled?
- How many seats are available?

Recommended section structure:

1. **Headline**
   - “Make Monday your earliest sourcing meeting.”
   - Or a stronger variant grounded in the same meaning.

2. **Short explanation**
   - Five candidates matched to the buyer's stated sectors.
   - Plain-English signal explanation.
   - Counter-evidence and a suggested next action.

3. **Pilot details**
   - 30 days.
   - €250 upfront.
   - Credited toward €490 annual Dashboard.
   - Five founding seats.

4. **Who it is for**
   - Solo GPs.
   - Emerging managers.
   - Scouts.
   - Angels who source technical startups.

5. **What is not included**
   - No investment recommendation.
   - No guarantee that a company will raise.
   - No private or non-public data claim.
   - No promise of access or allocation.

6. **Primary CTA**
   - “Apply for a founding pilot” or “Start the €250 pilot”.
   - Use one clear action, not several competing CTAs.

7. **Post-payment next step**
   - Submit sectors and delivery email.
   - Explain when the first Monday issue will arrive.
   - If fulfillment is manual, say so plainly.

Do not use fake urgency. “Five founding seats” is valid only if the implementation actually enforces or records the limit. If a hard seat counter is not available, use “We are opening five founding pilot places” and create a manual ledger or operational state file that the owner can maintain.

---

## Intake and fulfillment

Implement the smallest reliable intake mechanism.

Preferred order:

1. Existing application form or authenticated server action already used by the project.
2. A new server-side form using the existing email and validation conventions.
3. A simple post-payment form with a signed or opaque checkout reference.
4. A clear email-based intake fallback if no safe backend exists.

Required validation:

- Valid email format.
- At least one sector selected.
- Investor type selected.
- No secrets accepted.
- No payment-card fields stored by GitDealFlow.
- No raw Stripe customer or checkout objects exposed to the browser.

If data is stored, follow the existing database and privacy conventions. Do not introduce Supabase. Do not introduce a new database only for this experiment unless there is no safe existing storage path and the implementation can be kept small.

If fulfillment remains manual, create a private, local operational document only if the repository already has an approved pattern. Never commit private buyer data.

Suggested internal fulfillment record shape, without real customer data:

```json
{
  "offer": "signal_desk_pilot",
  "checkout_session_id": "redacted-at-rest",
  "payment_status": "paid",
  "intake_status": "pending|received|fulfilled",
  "delivery_day": "monday",
  "pilot_start_date": "YYYY-MM-DD",
  "pilot_end_date": "YYYY-MM-DD",
  "dashboard_credit_eur": 490
}
```

Do not commit real checkout IDs, emails, names, or notes.

---

## Files to inspect first

Find the actual paths before changing anything. Likely surfaces include:

- `landing/`
- `pseo-site/app/`
- `pseo-site/components/`
- `pseo-site/lib/`
- existing Stripe API routes
- existing checkout success and cancel pages
- existing PostHog instrumentation
- existing pricing or offer components
- existing claims guards and regression guards

Do not assume these paths or filenames exist. Use repository search and follow the existing architecture.

Before editing, produce a short internal file map containing:

- current landing page entry point
- current pricing page entry point
- current checkout creation or payment-link code
- current success page
- current analytics helper
- current tests and release scripts
- current deployment script

Then implement only the files required for the complete path.

---

## Test-first requirements

Add tests before implementation where the repository supports them.

Required test cases:

### Copy and claims

- The pilot copy contains €250.
- The credit copy contains €490/year or the repository's exact approved annual wording.
- The copy says 30 days.
- The copy says five founding seats or equivalent truthful wording.
- No banned panel claims appear.
- No “219 fundraises” or “219 funding events” appears.
- No fabricated testimonial or customer claim appears.

### Pricing and checkout

- Checkout amount is exactly 25000 minor EUR units.
- Currency is exactly EUR.
- Mode is one-time payment, not subscription.
- Offer metadata is present.
- Existing Dashboard annual price is unchanged.
- Success and cancel URLs are explicit and valid.

### Analytics

- Offer view event fires once per view according to existing conventions.
- CTA event fires with the expected offer properties.
- Checkout-start event retains attribution properties.
- Purchase completion remains compatible with the existing PostHog identity join.
- No sensitive intake content enters analytics properties.

### Intake

- Invalid email is rejected.
- Missing sector is rejected.
- Valid intake is accepted.
- Payment status is not trusted from a client-only field.
- A user cannot mark the pilot paid by editing a URL parameter.

### Regression

- Existing pricing tests pass.
- Existing claims guards pass.
- Existing Stripe tests pass.
- Existing build and type checks pass.
- Existing landing and pSEO tests pass where relevant.

Do not weaken a test or guard to make the implementation pass.

---

## Required verification commands

Use the project's actual package manager and scripts. First inspect `package.json` files.

At minimum, run the relevant commands from the correct directories:

```bash
npm test
npm run typecheck
npm run verify:no-regressions
npm run build
```

Only run commands that exist. If a command does not exist, identify the repository's equivalent and run that instead.

Before deployment, verify:

```bash
git status --short --branch
ps aux | grep -E "vercel (deploy|build)" | grep -v grep || true
```

The worktree must be clean except for the intended committed changes before production deployment, according to the repository's deployment rules.

---

## Live verification requirements

A successful build is not enough.

After deployment:

1. Verify the intended Vercel deployment is actually aliased to the live domain.
2. Run:

```bash
vercel inspect signals.gitdealflow.com
```

3. Open the live page in a real browser.
4. Capture a screenshot of the offer section.
5. Confirm the page is not blank and hydration works.
6. Click the pilot CTA.
7. Confirm the checkout page shows:
   - €250
   - EUR
   - one-time payment
   - pilot wording
   - credit toward the €490 annual Dashboard
8. Cancel or leave the checkout without paying.
9. Verify the cancel path returns to a usable page.
10. If a test checkout can be completed safely, verify the success page and intake flow.
11. Verify the live analytics events or test-event output using the repository's approved method.
12. Verify the original free Sunday signup still works.
13. Verify the existing Dashboard checkout still shows its intended live amount.

Use screenshots for page verification. A `curl 200` response alone does not prove the page rendered correctly.

Do not use a real card or create a real paid transaction without explicit user approval.

---

## Release and commit rules

Commit only the intended changes.

Before committing:

```bash
git diff --stat
git diff --check
git status --short
```

Use a focused commit message, for example:

```text
feat: launch paid Signal Desk pilot offer
```

Do not commit:

- API keys
- `.env` files
- real customer data
- real email addresses from pilot prospects
- raw Stripe secrets
- temporary screenshots unless the repository already stores approved release evidence
- unrelated work from another agent

If deployment is blocked by a human-only Stripe action, commit only source and tests if appropriate, then report the exact gate. Do not claim the pilot is live until the browser and checkout probe confirm it.

---

## Acceptance criteria

The implementation is complete only if all applicable criteria are true:

- [ ] A focused Signal Desk pilot offer is visible on the correct live GitDealFlow surface.
- [ ] The offer clearly states 30 days, €250 upfront, and credit toward €490 annual Dashboard.
- [ ] The five-seat founding limit is truthful and operationally recorded.
- [ ] The buyer can reach a real Stripe checkout or an explicitly documented human-gated checkout setup.
- [ ] The checkout is one-time EUR 250, not a subscription.
- [ ] Stripe metadata identifies the pilot offer.
- [ ] Intake captures investor type, sectors, and delivery email safely.
- [ ] Payment status is verified server-side or through Stripe, never trusted from the browser.
- [ ] Analytics events distinguish offer view, CTA click, checkout start, checkout completion, and intake submission.
- [ ] Existing PostHog checkout attribution is not regressed.
- [ ] Claims guards and regression tests pass.
- [ ] Typecheck passes.
- [ ] Production build passes.
- [ ] Live deployment is verified with `vercel inspect`.
- [ ] Live browser screenshot confirms the rendered page is usable.
- [ ] Checkout probe confirms the exact price and copy.
- [ ] Free signup still works.
- [ ] Existing Dashboard pricing still works.
- [ ] No unsupported claims were added.
- [ ] No secrets or private buyer data were committed.

---

## Final response required from the implementation session

Return a short, evidence-based report with these sections:

1. **Shipped**
   - Exact files changed.
   - Exact live URL.
   - Exact checkout URL or Stripe object ID, redacted if necessary but sufficient to identify the object.

2. **Verified**
   - Tests run and results.
   - Live page result.
   - Checkout price and mode.
   - Analytics verification result.
   - Existing signup and Dashboard checkout result.

3. **Blocked**
   - Only real blockers.
   - Name the exact human action if one is required.

4. **Next revenue action**
   - The single next action for selling the first five pilots.
   - Do not substitute traffic metrics for paid pilot evidence.

Never say “done” based only on source changes or a successful build.
