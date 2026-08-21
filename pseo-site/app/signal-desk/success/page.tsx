import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import SignalDeskIntakeForm from "../SignalDeskIntakeForm";
import SignalDeskTracker from "../SignalDeskTracker";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Signal Desk payment confirmed", robots: { index: false, follow: false } };

const SESSION_RX = /^cs_(test_|live_)?[a-zA-Z0-9]+$/;

type Props = { searchParams: Promise<{ session_id?: string | string[] }> };

async function loadPilotSession(rawSessionId: string | undefined) {
  if (!rawSessionId || !SESSION_RX.test(rawSessionId)) return null;
  try {
    const session = await stripe.checkout.sessions.retrieve(rawSessionId);
    if (session.payment_status !== "paid") return null;
    if (session.metadata?.offer !== "signal_desk_pilot") return null;
    if (session.amount_total !== 25000 || session.currency !== "eur") return null;
    return { id: session.id, email: session.customer_details?.email ?? "" };
  } catch {
    return null;
  }
}

export default async function SignalDeskSuccessPage({ searchParams }: Props) {
  const query = await searchParams;
  const rawSessionId = Array.isArray(query.session_id) ? query.session_id[0] : query.session_id;
  const session = await loadPilotSession(rawSessionId);
  if (!session) redirect("/signal-desk?cancelled=1");

  return (
    <main className="mx-auto max-w-3xl space-y-8 px-4 py-12 sm:px-6 lg:px-8">
      <SignalDeskTracker event="signal_desk_checkout_completed" />
      <header className="space-y-3 border-b border-slate-800 pb-7">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-300">Payment confirmed · €250 one-time pilot</p>
        <h1 className="text-3xl font-bold text-gray-100 sm:text-4xl">Set your Monday Signal Desk intake.</h1>
        <p className="text-base leading-relaxed text-gray-300">Stripe confirmed the payment. Give us the details below so the pilot can be prepared manually.</p>
      </header>
      <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8">
        <h2 className="text-xl font-bold text-gray-100">Your sectors and delivery email</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">We verify this paid Stripe checkout again when the form is sent. A URL parameter alone cannot mark a pilot as paid.</p>
        <div className="mt-6"><SignalDeskIntakeForm checkoutSessionId={session.id} paidEmail={session.email} /></div>
      </section>
      <p className="text-xs leading-relaxed text-slate-500">Receipt: <code>{session.id}</code>. The pilot runs for 30 days. If you continue to the annual Dashboard, the €250 is credited toward the €490 annual Dashboard. Need help? <Link href="/contact" className="text-sky-300 underline">Contact GitDealFlow</Link>.</p>
    </main>
  );
}
