"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

type Props = {
  sessionId: string;
  // Brunson DotCom Ch 18, three-rung OTO ladder. sector_sweep_oto1 fires
  // on /firstlook/thanks, insider_oto2 on /firstlook/downsell, and
  // extra_sector_oto3 on /firstlook/last-chance after the buyer declines
  // both upper rungs. Keep this union in lockstep with OtoKey in
  // lib/stripe-tiers.ts.
  oto: "sector_sweep_oto1" | "insider_oto2" | "extra_sector_oto3";
  acceptHref: string;
  declineHref: string;
  acceptLabel: string;
  declineLabel: string;
  acceptToneClass?: string;
  declineToneClass?: string;
};

type ChargeResult =
  | { ok: true; oto: string; receipt: { id: string; amount: number; kind: string } }
  | { ok: false; error: string; clientAction?: { url: string } };

export default function OneClickOtoButton({
  sessionId,
  oto,
  acceptHref,
  declineHref,
  acceptLabel,
  declineLabel,
  acceptToneClass = "bg-amber-500 hover:bg-amber-400 text-slate-950",
  declineToneClass = "border border-slate-700 text-slate-300 hover:text-slate-100",
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onAccept() {
    setError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/oto/charge", {
        method: "POST",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ session_id: sessionId, oto }),
      });
      const data = (await res.json()) as ChargeResult;
      if (data.ok) {
        startTransition(() => router.push(`${acceptHref}?session_id=${sessionId}`));
        return;
      }
      if (data.error === "requires_action" && data.clientAction?.url) {
        // Stripe-hosted 3DS challenge; after success Stripe redirects back to
        // our origin with the same PaymentIntent which the webhook then sees.
        window.location.href = data.clientAction.url;
        return;
      }
      if (data.error === "already_charged") {
        // Idempotent path, buyer double-clicked or refreshed; treat as accepted.
        startTransition(() => router.push(`${acceptHref}?session_id=${sessionId}`));
        return;
      }
      setError(humanizeError(data.error));
    } catch {
      setError("Network error, please try again or skip.");
    } finally {
      setSubmitting(false);
    }
  }

  function onDecline() {
    startTransition(() => router.push(`${declineHref}?session_id=${sessionId}`));
  }

  const busy = submitting || pending;

  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={onAccept}
          disabled={busy}
          className={`inline-flex items-center justify-center rounded-lg font-bold text-sm sm:text-base px-5 py-3 shadow-md transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${acceptToneClass}`}
        >
          {busy ? "Charging your saved card…" : acceptLabel}
        </button>
        <button
          type="button"
          onClick={onDecline}
          disabled={busy}
          className={`inline-flex items-center justify-center rounded-lg text-sm sm:text-base px-5 py-3 transition-colors disabled:opacity-60 ${declineToneClass}`}
        >
          {declineLabel}
        </button>
      </div>
      {error && (
        <p className="text-rose-300 text-sm leading-relaxed" role="alert">
          {error}
        </p>
      )}
      <p className="text-slate-500 text-xs leading-relaxed">
        One-click, no card re-entry. Charged to the same card you used moments ago.
      </p>
    </div>
  );
}

function humanizeError(code: string): string {
  switch (code) {
    case "card_declined":
      return "Your card was declined. Skip this offer or try a different card on the next checkout.";
    case "parent_not_found":
      return "We can't find your original purchase session. Skip this offer to continue to your delivery.";
    case "authentication_required":
      return "Your bank wants you to verify this charge. Use the button again, we'll redirect you to a secure page.";
    case "stripe_error":
    case "stripe_unknown":
      return "Stripe couldn't process the charge. Skip this offer to continue.";
    default:
      return "Something went wrong. Skip this offer to continue.";
  }
}
