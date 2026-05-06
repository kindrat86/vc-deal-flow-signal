"use client";

import { useState } from "react";

const BASE_CHECKOUT = "https://gitdealflow.com/#firstlook";
const BUMP_CHECKOUT = "https://buy.stripe.com/bJe14m34DbNC6gm1by0x204";

const BASE_LINE = {
  label: "First Look Pass · one sector",
  detail: "Top-25 ranked orgs · CSV + JSON + 14-page PDF · 24-hour delivery",
  price: 7,
} as const;

const BUMP_LINE = {
  label: "Order bump — full Sector Sweep",
  detail: "Every venture-backed org · 4w / 12w / 26w deltas · 60-min walkthrough",
  price: 1797,
  strike: 1997,
} as const;

export default function CartPreview() {
  const [bumpOn, setBumpOn] = useState(false);

  const subtotal = BASE_LINE.price + (bumpOn ? BUMP_LINE.price : 0);
  const youSave = bumpOn ? BUMP_LINE.strike - BUMP_LINE.price : 0;
  const ctaHref = bumpOn ? BUMP_CHECKOUT : BASE_CHECKOUT;
  const ctaLabel = bumpOn
    ? `Check out — €${subtotal.toLocaleString("en-US")} →`
    : `Check out — €${subtotal} →`;

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
        <span className="text-gray-500 text-[10px] sm:text-xs font-mono uppercase tracking-wider">
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
            <p className="text-gray-500 text-[10px] uppercase tracking-wider">one-time</p>
          </div>
        </li>

        <li className={`px-5 sm:px-6 py-4 transition-colors ${bumpOn ? "bg-emerald-950/20" : ""}`}>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              checked={bumpOn}
              onChange={(e) => setBumpOn(e.target.checked)}
              className="mt-1 h-4 w-4 shrink-0 rounded border-2 border-emerald-500/70 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900 cursor-pointer accent-emerald-500"
              aria-label="Add the full Sector Sweep order bump for €1,797"
            />
            <div className="flex-1 min-w-0 flex items-start justify-between gap-4">
              <div className="space-y-0.5 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-gray-100 font-semibold text-sm">{BUMP_LINE.label}</p>
                  <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950">
                    Save €200
                  </span>
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">{BUMP_LINE.detail}</p>
                <p className="text-emerald-300 text-[11px] font-medium pt-1">
                  This step only · €13,000+ standalone value · 30-day guarantee
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-gray-100 font-bold text-base">
                  €{BUMP_LINE.price.toLocaleString("en-US")}
                </p>
                <p className="text-gray-500 line-through text-xs">
                  €{BUMP_LINE.strike.toLocaleString("en-US")}
                </p>
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
          <span className="text-gray-100 font-bold text-xl sm:text-2xl tabular-nums">
            €{subtotal.toLocaleString("en-US")}
          </span>
        </div>

        {bumpOn ? (
          <p className="text-emerald-300 text-[11px] sm:text-xs leading-snug">
            ✓ You saved <strong>€{youSave}</strong> by bumping at this step. Discount
            disappears after checkout.
          </p>
        ) : (
          <p className="text-gray-500 text-[11px] sm:text-xs leading-snug">
            Tick the bump above to add the full Sector Sweep at a one-step-only €200 off.
          </p>
        )}

        <a
          href={ctaHref}
          className="block text-center w-full rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm sm:text-base py-3 sm:py-3.5 shadow-lg shadow-amber-500/20 transition-colors"
        >
          {ctaLabel}
        </a>

        <ul className="grid grid-cols-3 gap-1.5 text-[10px] sm:text-[11px] text-gray-500 pt-1">
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

        {bumpOn && (
          <p className="text-amber-200 text-[10px] sm:text-[11px] leading-snug bg-amber-950/30 border border-amber-700/40 rounded px-3 py-2 mt-2">
            <strong>Bump checkout:</strong> mention{" "}
            <code className="bg-slate-900 px-1 py-0.5 rounded text-emerald-200">
              FIRSTLOOK-BUMP
            </code>{" "}
            in the order field. €200 discount only valid from this page.
          </p>
        )}
      </footer>
    </section>
  );
}
