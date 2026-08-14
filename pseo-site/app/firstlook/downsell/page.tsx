import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { OTO_TIERS } from "@/lib/stripe-tiers";
import OneClickOtoButton from "@/components/OneClickOtoButton";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "First Look, one more thing.",
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
    };
  } catch {
    return null;
  }
}

export default async function FirstLookDownsellPage({ searchParams }: Props) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.session_id) ? sp.session_id[0] : sp.session_id;
  const session = await loadSession(raw);

  if (!session) {
    redirect("/firstlook?cancelled=1");
  }

  const oto = OTO_TIERS.insider_oto2;
  if (oto.kind !== "subscription") throw new Error("oto2_must_be_subscription");

  const standardMonthly = 9700;
  const firstMonthAmount = oto.firstInvoiceCouponAmountOff
    ? oto.unitAmount - oto.firstInvoiceCouponAmountOff
    : oto.unitAmount;
  const fmt = (cents: number) => `€${(cents / 100).toFixed(0)}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <header className="space-y-3 border-b border-slate-800 pb-6">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          Sector Sweep skipped, your First Look is locked in
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-tight">
          One last thing before your deep dive lands.
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          You said no to the Sweep, fair, it&rsquo;s a different size of
          purchase. Here&rsquo;s the rung between &euro;7 and &euro;1,797 that
          most First Look buyers actually take.
        </p>
      </header>

      <section className="rounded-xl border border-teal-500/30 bg-teal-500/5 p-5 sm:p-6 space-y-3">
        <p className="text-teal-300 text-xs font-semibold uppercase tracking-wider">
          If this still feels too early
        </p>
        <p className="text-gray-300 text-sm leading-relaxed">
          You do not need to force the higher-touch step today. If you only need recurring visibility, Dashboard is the cleaner next move. If you still need more trust before any subscription, use the buyer's guide or the free digest instead.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/answers/what-do-i-actually-get-from-dashboard-each-week" className="text-teal-200 hover:text-teal-100 underline underline-offset-2">
            See what Dashboard gives you
          </Link>
          <Link href="/buyers-guide" className="text-teal-200 hover:text-teal-100 underline underline-offset-2">
            Read the buyer's guide
          </Link>
          <a href="https://gitdealflow.com/#signup" className="text-teal-200 hover:text-teal-100 underline underline-offset-2">
            Get the free digest first
          </a>
        </div>
      </section>

      {/* OTO #2, Insider monthly with first-month discount.
          Subscription path: subscriptions.create with default_payment_method
          on the saved card and a one-shot coupon for the first invoice. */}
      <section
        aria-label="Insider Circle, first month discount"
        className="rounded-xl border-2 border-teal-500/60 bg-gradient-to-br from-teal-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-6"
      >
        <header className="space-y-2">
          <p className="text-teal-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            One-time offer · €20 off first month · this funnel only
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-tight">
            Try the Insider Circle for {fmt(firstMonthAmount)} this month.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Private investor Telegram, monthly briefing call, custom watchlists,
            API access, direct line to the founder.{" "}
            <strong className="text-gray-100">{fmt(standardMonthly)}/mo</strong>{" "}
            standard, your first month is{" "}
            <strong className="text-teal-200">{fmt(firstMonthAmount)}</strong>{" "}
            from this page only. Cancel any time, no clawback.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <Stat label="Standard rate" value={`${fmt(standardMonthly)}/mo`} muted strike />
          <Stat label="Your first month" value={fmt(firstMonthAmount)} accent />
          <Stat label="Then ongoing" value={`${fmt(standardMonthly)}/mo`} muted />
        </div>

        <ul className="space-y-2.5 border-t border-teal-700/40 pt-5">
          {[
            "Private investor Telegram, daily signal flags, founder-only side channel",
            "Monthly live briefing call, the names worth attention this month",
            "Custom watchlists, your thesis, scored by the same engine",
            "API access, pull the same scoring into your CRM or notebook",
            "Direct line to the founder, reply to any briefing, get a real answer",
          ].map((line) => (
            <li key={line} className="flex items-start gap-2.5 text-sm text-gray-300">
              <span aria-hidden="true" className="text-teal-400 font-bold shrink-0 mt-0.5">→</span>
              <span className="leading-relaxed">{line}</span>
            </li>
          ))}
        </ul>

        <div className="rounded-lg border border-emerald-700/40 bg-emerald-950/20 p-4 sm:p-5 text-sm text-emerald-100 leading-relaxed">
          <strong className="text-emerald-200">Cancel any time, keep the month.</strong>{" "}
          Reply <code className="bg-emerald-950/50 text-emerald-200 px-1 py-0.5 rounded text-xs">CANCEL</code>{" "}
          to any briefing email, refund or pro-rata, your choice. The discount
          locks at {fmt(firstMonthAmount)}; if you stay, month two onwards is
          {" "}{fmt(standardMonthly)}.
        </div>

        <OneClickOtoButton
          sessionId={session.id}
          oto="insider_oto2"
          acceptHref="/firstlook/done"
          declineHref="/firstlook/last-chance"
          acceptLabel={`Yes, start Insider for ${fmt(firstMonthAmount)} this month`}
          declineLabel="No thanks, see one final option"
          acceptToneClass="bg-teal-500 hover:bg-teal-400 text-slate-950"
        />

        <p className="text-slate-500 text-xs leading-relaxed border-t border-slate-800 pt-4">
          The discount only applies on this page. Decline and the Insider
          page stays at {fmt(standardMonthly)}/mo. Same card you used for
          the First Look, no re-entry, no second checkout.
        </p>
      </section>

      <p className="text-slate-600 text-xs leading-relaxed">
        Receipt for First Look: <code className="bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded text-[11px]">{session.id}</code>
        {session.email ? <> · sent to {session.email}</> : null}
        <br />
        Need help? <Link href="/contact" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">contact us</Link>.
      </p>

      <DataNerdSignoff variant="compact" className="mt-8" />
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
          accent ? "text-teal-300 text-xl sm:text-2xl" : muted ? "text-slate-300" : "text-gray-100"
        } ${strike ? "line-through opacity-70" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
