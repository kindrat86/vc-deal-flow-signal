import type { Metadata } from "next";
import Link from "next/link";
import SignalDeskCheckoutForm from "./SignalDeskCheckoutForm";
import SignalDeskTracker from "./SignalDeskTracker";

export const metadata: Metadata = {
  title: "Signal Desk pilot for investor sourcing | GitDealFlow",
  description: "A 30-day, manually fulfilled investor-sourcing pilot. Five GitHub-accelerating companies every Monday, matched to your sectors with counter-evidence and a next action.",
  alternates: { canonical: "/signal-desk" },
};

type Props = {
  searchParams: Promise<{ cancelled?: string | string[]; full?: string | string[]; capacity?: string | string[] }>;
};

export default async function SignalDeskPage({ searchParams }: Props) {
  const query = await searchParams;
  const isFull = Boolean(query.full);
  const cancelled = Boolean(query.cancelled);
  const capacityUnavailable = Boolean(query.capacity);

  return (
    <main className="mx-auto max-w-4xl space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      <SignalDeskTracker event="signal_desk_offer_viewed" />
      <header className="space-y-5 border-b border-slate-800 pb-8">
        <p className="text-xs font-semibold uppercase tracking-wider text-amber-300">Founding offer · manual pilot</p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-gray-100 sm:text-5xl">Make Monday your earliest sourcing meeting.</h1>
        <p className="max-w-3xl text-lg leading-relaxed text-gray-300">
          Every Monday, receive five GitHub-accelerating companies matched to your sectors, with plain-English reasoning, counter-evidence, and a suggested next action.
        </p>
      </header>

      {cancelled ? <p className="rounded-lg border border-amber-500/40 bg-amber-950/30 p-4 text-sm text-amber-100">Checkout was cancelled. No payment was taken.</p> : null}
      {isFull ? <p className="rounded-lg border border-amber-500/40 bg-amber-950/30 p-4 text-sm text-amber-100">The five founding pilot places are currently filled. Email signals@gitdealflow.com if you want to hear about the next opening.</p> : null}
      {capacityUnavailable ? <p className="rounded-lg border border-rose-500/40 bg-rose-950/30 p-4 text-sm text-rose-100">We could not verify pilot capacity right now. Please try again later.</p> : null}

      <section className="grid gap-5 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-slate-950 to-slate-950 p-6 sm:grid-cols-[1fr_auto] sm:items-end sm:p-8">
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-100">GitDealFlow Signal Desk, 30-day pilot</h2>
          <p className="text-sm leading-relaxed text-gray-300">€250 upfront. If you continue, the €250 is credited toward the €490 annual Dashboard. We are opening five founding pilot places, checked against paid Stripe sessions.</p>
        </div>
        {isFull ? null : <SignalDeskCheckoutForm />}
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <article className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-lg font-bold text-gray-100">Who it is for</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-gray-300">
            <li>Solo GPs and emerging managers who source technical startups.</li>
            <li>Scouts who need a weekly list worth a closer look.</li>
            <li>Angels who want a smaller, repeatable public-data research routine.</li>
          </ul>
        </article>
        <article className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
          <h2 className="text-lg font-bold text-gray-100">What arrives every Monday</h2>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-gray-300">
            <li>Five candidates matched to the sectors you state after payment.</li>
            <li>A plain-English explanation of the public GitHub activity.</li>
            <li>Counter-evidence and one suggested next action per company.</li>
          </ul>
        </article>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-100">How the pilot works</h2>
        <ol className="mt-5 grid gap-4 text-sm leading-relaxed text-gray-300 sm:grid-cols-2 lg:grid-cols-5">
          <li><strong className="block text-amber-300">1. Pay once</strong>Start the €250 one-time Stripe checkout.</li>
          <li><strong className="block text-amber-300">2. Set sectors</strong>Tell us your investor type, sectors, and delivery email.</li>
          <li><strong className="block text-amber-300">3. Review five</strong>Read the signal and the counter-evidence.</li>
          <li><strong className="block text-amber-300">4. Choose diligence</strong>Decide which companies deserve 30 minutes.</li>
          <li><strong className="block text-amber-300">5. Record the next action</strong>Use the brief in your own sourcing workflow.</li>
        </ol>
        <p className="mt-5 text-sm leading-relaxed text-slate-400">The intake and first issue are reviewed manually. We do not promise instant automated delivery.</p>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-100">What this is not</h2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-gray-300">
          <li>No investment recommendation.</li>
          <li>No guarantee that a company will raise.</li>
          <li>No private or non-public data claim.</li>
          <li>No promise of access or allocation.</li>
        </ul>
        <p className="mt-5 text-sm leading-relaxed text-slate-400">GitDealFlow uses public GitHub activity. The pilot is research output for your own diligence, not investment advice. Read the <Link href="/methodology" className="text-sky-300 underline">methodology</Link> for how the signals are built.</p>
      </section>

      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-100">After payment</h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-300">Stripe returns you to a secure confirmation page. There you submit your sector and delivery intake. Payment status is checked server-side against Stripe before an intake can be accepted.</p>
      </section>
    </main>
  );
}
