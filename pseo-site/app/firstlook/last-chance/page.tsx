import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { OTO_TIERS } from "@/lib/stripe-tiers";
import OneClickOtoButton from "@/components/OneClickOtoButton";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-dynamic";

// Brunson DotCom Ch 18, third OTO rung. The cart funnel pattern is
//   sales letter → bump → OTO #1 → OTO #2 → confirmation
//, and Brunson's high-converting carts add a third "last-chance" rung
// that catches the buyer who said no to both upsells with a tiny,
// frictionless add-on. Here that's a SECOND First Look sector for €17:
//
//   - Standalone path: a buyer who wants two sectors checks out twice for
//     2 × €7 = €14.
//   - From this page only: one click, +€17, no second checkout.
//
// The €3 premium over the standalone path (€17 vs €14) is the price the
// buyer is willing to pay to NOT have to come back, re-enter card details,
// re-pick a sector. It's a convenience price, not a discount price.
//
// Decline path here is /firstlook/done (no further upsells; the chain
// terminates at this rung).

export const metadata: Metadata = withEditorialOverride({
  title: "First Look, last chance to add a second sector.",
  robots: { index: false, follow: false },
});

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

export default async function FirstLookLastChancePage({ searchParams }: Props) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.session_id) ? sp.session_id[0] : sp.session_id;
  const session = await loadSession(raw);

  if (!session) {
    redirect("/firstlook?cancelled=1");
  }

  const oto = OTO_TIERS.extra_sector_oto3;
  if (oto.kind !== "one_time") throw new Error("oto3_must_be_one_time");

  const standaloneSecondSector = 700;
  const fmt = (cents: number) => `€${(cents / 100).toLocaleString("en-US")}`;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <header className="space-y-3 border-b border-slate-800 pb-6">
        <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
          Two upsells skipped, your First Look is locked in
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-tight">
          One last thing, pick a second sector?
        </h1>
        <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
          Most buyers who decline the Sweep want to compare two sectors
          before they pick one. Same engine, same 24-hour cadence, just a
          second deep-dive PDF + CSV alongside the one you already bought. If
          you do not need that, this page should still leave you with one calm
          next step instead of a dead end.
        </p>
      </header>

      {/* OTO #3, the last-chance rung. Same one-click charge mechanic as
          the upper rungs (saved card, idempotency on (sessionId, oto), 3DS
          fallback to /firstlook/auth). Decline here lands on /firstlook/done
          and the cart funnel terminates. */}
      <section
        aria-label="Last-chance offer · second sector"
        className="rounded-xl border-2 border-sky-500/60 bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-6"
      >
        <header className="space-y-2">
          <p className="text-sky-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            Last-chance offer · this page only
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-tight">
            Add a second sector to your First Look, {fmt(oto.unitAmount)}.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Two sectors, one intake. The convenience of replying once and
            getting two reports back, instead of coming back to{" "}
            <Link href="/firstlook" className="text-sky-300 underline decoration-dotted">
              /firstlook
            </Link>{" "}
            for a separate checkout. {fmt(oto.unitAmount)} from this page
            only, standalone second-sector orders pay {fmt(standaloneSecondSector)}{" "}
            twice (one new checkout, one new card auth).
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <Stat
            label="Standalone path"
            value={`${fmt(standaloneSecondSector)} + checkout`}
            muted
          />
          <Stat label="From this page" value={fmt(oto.unitAmount)} accent />
          <Stat label="One-click" value="No card re-entry" muted />
        </div>

        <ul className="space-y-2.5 border-t border-sky-700/40 pt-5">
          {[
            "Second sector picked when you reply to the intake email",
            "Same 14-page PDF + raw CSV format as the first sector",
            "Both deep-dives delivered in the same 24-hour window",
            "Charged to the saved card from your First Look, no re-entry",
            "Same 30-day Signal-or-It's-Free guarantee on both reports",
          ].map((line) => (
            <li
              key={line}
              className="flex items-start gap-2.5 text-sm text-gray-300"
            >
              <span aria-hidden="true" className="text-sky-400 font-bold shrink-0 mt-0.5">
                →
              </span>
              <span className="leading-relaxed">{line}</span>
            </li>
          ))}
        </ul>

        <div className="rounded-lg border border-emerald-700/40 bg-emerald-950/20 p-4 sm:p-5 text-sm text-emerald-100 leading-relaxed">
          <strong className="text-emerald-200">Same 30-day refund.</strong>{" "}
          Reply <code className="bg-emerald-950/50 text-emerald-200 px-1 py-0.5 rounded text-xs">REFUND</code>{" "}
          to either deep-dive email, full refund of{" "}
          <strong className="text-emerald-200">that report only</strong>, no
          clawback of the artefacts you received. Two refunds in three years.
        </div>

        <OneClickOtoButton
          sessionId={session.id}
          oto="extra_sector_oto3"
          acceptHref="/firstlook/done"
          declineHref="/firstlook/done"
          acceptLabel={`Yes, add a second sector for ${fmt(oto.unitAmount)}`}
          declineLabel="No thanks, just deliver my First Look"
          acceptToneClass="bg-signal-500 hover:bg-signal-400 text-slate-950"
        />

        <p className="text-slate-500 text-xs leading-relaxed border-t border-slate-800 pt-4">
          One-time offer, closes when you leave this page. Standalone
          second-sector orders go through the full /firstlook checkout
          again at {fmt(standaloneSecondSector)} + Stripe fees + a fresh
          card auth.
        </p>
      </section>

      <aside
        className="border-l-2 border-sky-700/50 pl-4 py-1 space-y-2"
        aria-label="If you do not need a second sector"
      >
        <p className="text-sky-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
          If you do not need a second sector
        </p>
        <p className="text-gray-400 text-sm leading-relaxed">
          Let the first report land, then decide from a calmer position whether you need recurring coverage or just the free weekly rhythm.
        </p>
        <div className="flex flex-wrap gap-3 text-sm">
          <Link href="/answers/when-should-i-use-first-look-vs-dashboard" className="text-sky-300 hover:text-sky-200 underline underline-offset-2">
            Choose the next paid step
          </Link>
          <a href="https://gitdealflow.com/#signup" className="text-sky-300 hover:text-sky-200 underline underline-offset-2">
            Stay with the free digest
          </a>
          <Link href="/buyers-guide" className="text-sky-300 hover:text-sky-200 underline underline-offset-2">
            Read the buyer's guide
          </Link>
        </div>
      </aside>

      <p className="text-slate-600 text-xs leading-relaxed">
        Receipt for First Look:{" "}
        <code className="bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded text-[11px]">
          {session.id}
        </code>
        {session.email ? <> · sent to {session.email}</> : null}
        <br />
        Need help?{" "}
        <Link
          href="/contact"
          className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
        >
          contact us
        </Link>
        .
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
      <p className="text-slate-500 text-[10px] uppercase tracking-wider">
        {label}
      </p>
      <p
        className={`font-bold text-base sm:text-lg tabular-nums ${
          accent
            ? "text-sky-300 text-xl sm:text-2xl"
            : muted
            ? "text-slate-300"
            : "text-gray-100"
        } ${strike ? "line-through opacity-70" : ""}`}
      >
        {value}
      </p>
    </div>
  );
}
