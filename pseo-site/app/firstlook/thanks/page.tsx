import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { OTO_TIERS } from "@/lib/stripe-tiers";
import OneClickOtoButton from "@/components/OneClickOtoButton";
import DeliveryCountdown from "@/components/DeliveryCountdown";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "First Look Pass — confirmed. One-time offer inside.",
  robots: { index: false, follow: false },
};

const SESSION_RX = /^cs_(test_|live_)?[a-zA-Z0-9]+$/;

type Props = {
  searchParams: Promise<{ session_id?: string | string[] }>;
};

async function loadSession(rawSessionId: string | undefined) {
  if (!rawSessionId || !SESSION_RX.test(rawSessionId)) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(rawSessionId);
    if (session.payment_status !== "paid") return null;
    return {
      id: session.id,
      email: session.customer_details?.email ?? "",
      amount: session.amount_total ?? 0,
    };
  } catch {
    return null;
  }
}

export default async function FirstLookThanksPage({ searchParams }: Props) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.session_id) ? sp.session_id[0] : sp.session_id;
  const session = await loadSession(raw);

  if (!session) {
    redirect("/firstlook?cancelled=1");
  }

  const oto = OTO_TIERS.sector_sweep_oto1;
  if (oto.kind !== "one_time") throw new Error("oto1_must_be_one_time");

  const standalonePrice = 199700;
  const otoPrice = oto.unitAmount;
  const savings = standalonePrice - otoPrice;
  const fmt = (cents: number) => `€${(cents / 100).toLocaleString("en-US")}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <header className="space-y-3 border-b border-slate-800 pb-6">
        <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          ✓ Payment confirmed · €7 · {session.email || "your inbox"}
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-tight">
          You&rsquo;re in. The First Look deep dive lands within 24h.
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Your delivery email is queued. Watch your inbox — you&rsquo;ll get
          one mail asking which sector you want covered, and the deep dive
          (PDF + raw CSV) within 24 hours of your reply on weekdays.
        </p>
      </header>

      {/* IDENTITY FRAME — Brunson Expert Secrets Ch 4 ("New Opportunity")
          + DotCom Ch 13 ("Best Bait" identity-shaping). The bait isn't
          just the artefact; it's the role the buyer steps into. After
          payment, naming the role explicitly turns "I bought a PDF"
          into "I'm a Sector Scout now." That single sentence is what
          carries the buyer through the 14-day credit window. */}
      <section
        aria-label="Identity frame — what you just became"
        className="rounded-xl border-2 border-violet-500/40 bg-gradient-to-br from-violet-950/30 via-slate-900 to-slate-950 p-5 sm:p-7 space-y-3"
      >
        <p className="text-violet-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
          What you just became
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
          You&rsquo;re a Sector Scout now.
        </h2>
        <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
          Most investors source by deck and warm intro. Sector Scouts source
          by code-side momentum 21–47 days before the deck lands. This is
          the lane you just stepped into — your first deep dive arrives
          tomorrow, the engine refreshes every Monday, and the credit
          window keeps the door open to the live Dashboard for two weeks.
        </p>
        <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-violet-700/50 pl-3 italic">
          &ldquo;Trust the math, not me.&rdquo; The methodology is open;
          the SSRN paper is at <code className="bg-slate-900 text-violet-200 px-1.5 py-0.5 rounded text-xs">ssrn.com/abstract=6606558</code>;
          the regression code reproduces on the public Zenodo dataset. You
          don&rsquo;t have to take anyone&rsquo;s word — you can re-run the
          panel yourself.
        </p>
      </section>

      {/* LIVE DELIVERY COUNTDOWN — Brunson Ch 13 + Expert Ch 21 (Fast 15).
          A ticking clock turns the 24-hour SLA from a marketing claim
          into a contract the buyer watches enforce itself. Anchored at
          the moment of page load (proxy for payment confirmation, since
          this page is only reached on a paid session). */}
      <DeliveryCountdown />

      {/* OTO #1 — the heart of the cart funnel. The card was JUST captured
          with setup_future_usage=off_session, so this button charges the
          saved card with one click. No re-entry, no second checkout. */}
      <section
        aria-label="One-time offer · Sector Sweep bump"
        className="rounded-xl border-2 border-amber-500/60 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-6"
      >
        <header className="space-y-2">
          <p className="text-amber-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            One-time offer · disappears when you leave this page
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-tight">
            Wait — before your deep dive lands.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            You picked one sector. The Custom Sector Sweep is the same lens
            applied across <strong className="text-gray-100">every venture-backed startup in one sector</strong> —
            three time windows (30d / 90d / TTM), the full ranked panel, plus
            a <strong className="text-gray-100">60-minute walkthrough call</strong> to talk through
            the names that surprised you.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <Stat label="Standalone price" value={fmt(standalonePrice)} muted strike />
          <Stat label="Your price right now" value={fmt(otoPrice)} accent />
          <Stat label="You save" value={fmt(savings)} muted />
        </div>

        <ul className="space-y-2.5 border-t border-amber-700/40 pt-5">
          {[
            "Every venture-backed org in one sector — not just the top 25",
            "Three time windows (30d / 90d / TTM) — trend confirmation, not snapshot",
            "Contributor influx maps for top 50",
            "Eight pre-Crunchbase breakouts (vs three in First Look)",
            "60-minute walkthrough call — bring your IC questions",
            "10 business days to delivery — clock starts on your sector reply",
          ].map((line) => (
            <li key={line} className="flex items-start gap-2.5 text-sm text-gray-300">
              <span aria-hidden="true" className="text-amber-400 font-bold shrink-0 mt-0.5">→</span>
              <span className="leading-relaxed">{line}</span>
            </li>
          ))}
        </ul>

        <div className="rounded-lg border border-emerald-700/40 bg-emerald-950/20 p-4 sm:p-5 text-sm text-emerald-100 leading-relaxed">
          <strong className="text-emerald-200">Sweep-or-it&rsquo;s-free guarantee.</strong>{" "}
          14 days from delivery to ask for a refund. Keep the artefacts. We&rsquo;ve
          honored every one in three years — two refunds total.
        </div>

        <OneClickOtoButton
          sessionId={session.id}
          oto="sector_sweep_oto1"
          acceptHref="/firstlook/done"
          declineHref="/firstlook/downsell"
          acceptLabel={`Yes — add Sector Sweep for ${fmt(otoPrice)}`}
          declineLabel="No thanks, just deliver my First Look"
          acceptToneClass="bg-amber-500 hover:bg-amber-400 text-slate-950"
        />

        <p className="text-slate-500 text-xs leading-relaxed border-t border-slate-800 pt-4">
          You only see this offer once. Decline and the standalone Sweep
          stays at {fmt(standalonePrice)} on the public page. The bumped
          {" "}{fmt(otoPrice)} is exclusive to buyers who came through the
          First Look Pass.
        </p>
      </section>

      <p className="text-slate-600 text-xs leading-relaxed">
        Receipt: <code className="bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded text-[11px]">{session.id}</code>
        {session.email ? <> · sent to {session.email}</> : null}
        <br />
        Need help? <Link href="/contact" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">contact us</Link>.
      </p>
    </div>
  );
}

function Stat({
  label,
  value,
  accent,
  muted,
  strike,
}: {
  label: string;
  value: string;
  accent?: boolean;
  muted?: boolean;
  strike?: boolean;
}) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-3 sm:p-4 space-y-1">
      <p className="text-slate-500 text-[10px] uppercase tracking-wider">{label}</p>
      <p
        className={`font-bold text-base sm:text-lg tabular-nums ${
          accent ? "text-amber-300 text-xl sm:text-2xl" : muted ? "text-slate-300" : "text-gray-100"
        } ${strike ? "line-through opacity-70" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
