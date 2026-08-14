"use client";

import { useEffect, useState } from "react";

// Variant tag must stay short (Stripe metadata caps each value at 500
// chars) and ASCII-safe, kept in lockstep with VARIANT_RX in
// /api/checkout/session/route.ts. Mismatched shapes are dropped silently
// rather than 400-ing the buyer.
const VARIANT_RX = /^[a-zA-Z0-9_.-]{1,32}$/;

// Brunson DotCom Ch 18, TRUE order bump.
//
// Pre-2026-05-08 behaviour: this checkbox SWAPPED the €7 First Look for
// the €1,797 Sector Sweep via a separate Stripe Payment Link. That's not
// what Brunson means by an order bump, a bump is an ADDITIVE checkbox
// that lifts AOV on the same order. The Sector Sweep is now the OTO #1
// rung on /firstlook/thanks (one-click via the saved card), so this
// component reclaims the bump pattern as its true shape: a small,
// in-cart, additive +€19 line item ("Methodology Vault PDF") that the
// /api/checkout/session route picks up via the `bump` form field.
//
// Net effect:
//   - Buyers who tick the bump go through the same Checkout flow
//     (setup_future_usage='off_session' captures the card).
//   - The OTO ladder on /firstlook/thanks → /firstlook/downsell →
//     /firstlook/last-chance still fires after success.
//   - AOV on bumped orders: €7 + €19 = €26 base, plus whatever the buyer
//     accepts on the OTO chain.

const BASE_LINE = {
  label: "First Look Pass · one sector",
  detail: "Top-25 ranked orgs · CSV + JSON + 14-page PDF · 24-hour delivery",
  price: 7,
} as const;

const BUMP_LINE = {
  // Mirrors BUMPS.methodology_vault in lib/stripe-tiers.ts (€19, currency
  // EUR). If you change the price here, change it there too, the Stripe
  // checkout uses the server-side number, this component is presentation.
  bumpKey: "methodology_vault",
  label: "Methodology Vault, full PDF",
  detail:
    "38-page deep-dive on every signal definition + the 3 confounders the SSRN paper does not name",
  price: 19,
} as const;

export default function CartPreview() {
  const [bumpOn, setBumpOn] = useState(false);

  // Brunson Expert Secrets Ch 19 (Test, Test, Test), variant attribution.
  // /firstlook stays fully static (force-static) for SEO + edge-cache, so
  // we read ?variant= from window.location.search after mount and inject
  // it into the checkout form as a hidden field. /api/checkout/session
  // sanitises and stores it in Stripe metadata; /firstlook/thanks +
  // PostHog read it back to segment OTO copy + conversion analytics.
  const [variant, setVariant] = useState<string | null>(null);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const v = new URLSearchParams(window.location.search).get("variant");
    if (v && VARIANT_RX.test(v)) setVariant(v);
  }, []);

  const subtotal = BASE_LINE.price + (bumpOn ? BUMP_LINE.price : 0);
  const ctaLabel = bumpOn
    ? `Check out, €${subtotal} →`
    : `Check out, €${subtotal} →`;

  return (
    <section
      aria-label="Your cart"
      className="rounded-xl border border-amber-500/40 bg-slate-900/60 shadow-xl shadow-amber-500/5"
    >
      <header className="flex items-center justify-between border-b border-slate-800 px-5 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <span aria-hidden="true" className="text-amber-300 text-base">🛒</span>
          <h2 className="text-gray-100 font-semibold text-sm sm:text-base">
            Your cart
          </h2>
        </div>
        <span className="text-gray-400 text-[10px] sm:text-xs font-mono uppercase tracking-wider">
          Step 1 / 2
        </span>
      </header>

      <ul className="divide-y divide-slate-800">
        <li className="px-5 sm:px-6 py-4 flex items-start justify-between gap-4">
          <div className="space-y-0.5 min-w-0">
            <p className="text-gray-100 font-semibold text-sm">{BASE_LINE.label}</p>
            <p className="text-gray-400 text-xs leading-relaxed">{BASE_LINE.detail}</p>
            <p className="text-emerald-400 text-[11px] font-medium pt-1">
              ✓ Always included
            </p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-gray-100 font-bold text-base">€{BASE_LINE.price}</p>
            <p className="text-gray-400 text-[10px] uppercase tracking-wider">one-time</p>
          </div>
        </li>

        <li className={`px-5 sm:px-6 py-4 transition-colors ${bumpOn ? "bg-emerald-950/20" : ""}`}>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={bumpOn}
              onChange={(e) => setBumpOn(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-2 border-emerald-500/70 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 cursor-pointer accent-emerald-500"
              aria-label={`Add the Methodology Vault PDF for €${BUMP_LINE.price}`}
            />
            <div className="flex-1 min-w-0 flex items-start justify-between gap-4">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-gray-100 font-semibold text-sm">{BUMP_LINE.label}</p>
                  <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950">
                    +€{BUMP_LINE.price}
                  </span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{BUMP_LINE.detail}</p>
                <p className="text-emerald-300 text-[11px] font-medium pt-1">
                  Instant download · arrives with your First Look intake email
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-gray-100 font-bold text-base">+€{BUMP_LINE.price}</p>
                <p className="text-gray-400 text-[10px] uppercase tracking-wider">add-on</p>
              </div>
            </div>
          </label>
        </li>
      </ul>

      <footer className="border-t border-slate-800 px-5 sm:px-6 py-4 space-y-3">
        <div className="flex items-baseline justify-between gap-4">
          <span className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider">
            Subtotal
          </span>
          <span
            className="text-gray-100 font-bold text-xl sm:text-2xl tabular-nums"
            data-cart-subtotal
          >
            €{subtotal}
          </span>
        </div>

        {bumpOn ? (
          <p className="text-emerald-300 text-[11px] sm:text-xs leading-snug">
            ✓ <strong>Methodology Vault</strong> ships in the same intake email, no second order, no shipping.
          </p>
        ) : (
          <p className="text-gray-400 text-[11px] sm:text-xs leading-snug">
            Tick the bump above for the 38-page Methodology Vault, instant PDF, +€{BUMP_LINE.price} only at this step.
          </p>
        )}

        {/* Single form path, same Stripe Checkout for bumped + base orders.
            That preserves setup_future_usage='off_session' so the OTO chain
            on /firstlook/thanks fires identically for every buyer. */}
        <form action="/api/checkout/session" method="POST">
          <input type="hidden" name="tier" value="firstlook" />
          {bumpOn ? (
            <input type="hidden" name="bump" value={BUMP_LINE.bumpKey} />
          ) : null}
          {variant ? (
            <input type="hidden" name="variant" value={variant} />
          ) : null}
          <button
            type="submit"
            className="block text-center w-full rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm sm:text-base py-3 sm:py-3.5 shadow-lg shadow-amber-500/20 transition-colors"
          >
            {ctaLabel}
          </button>
        </form>

        <ul className="grid grid-cols-3 gap-1.5 text-[10px] sm:text-[11px] text-gray-400 pt-1">
          <li className="flex items-center gap-1">
            <span aria-hidden="true" className="text-emerald-400">🔒</span>
            Stripe checkout
          </li>
          <li className="flex items-center gap-1">
            <span aria-hidden="true" className="text-emerald-400">↩</span>
            30-day refund
          </li>
          <li className="flex items-center gap-1">
            <span aria-hidden="true" className="text-emerald-400">∅</span>
            No auto-renew
          </li>
        </ul>
      </footer>
    </section>
  );
}
