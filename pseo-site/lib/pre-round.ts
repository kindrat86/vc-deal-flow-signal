/**
 * Pre-Round Report, the €49 one-off entry offer (2026-10 monetization wave).
 *
 * Checkout is a Stripe Payment Link that does NOT exist yet. Until the owner
 * creates it and sets NEXT_PUBLIC_STRIPE_PREROUND_LINK in Vercel, every CTA
 * falls back to a pre-filled email so no button ever dead-ends.
 * `||` over `??`: Vercel env entries can be empty strings.
 *
 * Payment Link settings to use when it is created:
 *   product  "GitDealFlow Pre-Round Report", EUR 49.00, one-time
 *   custom field "sector" (dropdown: All sectors + the 15 sector names), optional
 *   after payment: redirect to https://signals.gitdealflow.com/thanks/pre-round
 */
export const PRE_ROUND_PRICE_EUR = 49;

export const PRE_ROUND_FALLBACK_MAILTO =
  "mailto:signals@gitdealflow.com?subject=" +
  encodeURIComponent("Pre-Round Report (€49)") +
  "&body=" +
  encodeURIComponent(
    "Hi, I'd like the €49 Pre-Round Report.\nSector (or 'all sectors'): \n\nPlease send me the payment link.",
  );

export const PRE_ROUND_CHECKOUT =
  process.env.NEXT_PUBLIC_STRIPE_PREROUND_LINK || PRE_ROUND_FALLBACK_MAILTO;

export const PRE_ROUND_PATH = "/pre-round";
