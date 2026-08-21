"use client";

import CheckoutDistinctId from "@/components/CheckoutDistinctId";
import { BASE_PROPERTIES } from "./SignalDeskTracker";

type PostHog = {
  capture?: (event: string, properties?: Record<string, unknown>) => void;
};

function capture(event: string) {
  const posthog = (window as Window & { posthog?: PostHog }).posthog;
  posthog?.capture?.(event, BASE_PROPERTIES);
}

export default function SignalDeskCheckoutForm() {
  return (
    <form
      action="/api/checkout/session"
      method="POST"
      onSubmit={() => {
        capture("signal_desk_cta_clicked");
        capture("signal_desk_checkout_started");
      }}
    >
      <input type="hidden" name="tier" value="signal_desk_pilot" />
      <CheckoutDistinctId />
      <button
        type="submit"
        className="inline-flex w-full sm:w-auto items-center justify-center rounded-lg bg-amber-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-lg shadow-amber-400/20 transition-colors hover:bg-amber-300"
      >
        Start the €250 pilot
      </button>
    </form>
  );
}
