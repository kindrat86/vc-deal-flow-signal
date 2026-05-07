import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "First Look — confirmed.",
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

export default async function FirstLookDonePage({ searchParams }: Props) {
  const sp = await searchParams;
  const raw = Array.isArray(sp.session_id) ? sp.session_id[0] : sp.session_id;
  const session = await loadSession(raw);

  if (!session) {
    redirect("/firstlook?cancelled=1");
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-8">
      <header className="space-y-3">
        <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
          ✓ All set — your First Look is queued
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-tight">
          Watch your inbox.
        </h1>
        <p className="text-gray-400 text-base leading-relaxed">
          The intake email lands at{" "}
          <strong className="text-gray-200">{session.email || "the address you paid with"}</strong>{" "}
          within minutes. Reply with the sector you want covered and the
          deep dive (PDF + raw CSV) follows in 24 hours, weekdays.
        </p>
      </header>

      <section className="rounded-xl border border-slate-800 bg-slate-900/50 p-5 sm:p-6 space-y-3">
        <p className="text-slate-300 text-sm font-semibold">While you wait:</p>
        <ul className="space-y-2 text-sm text-slate-400 leading-relaxed">
          <li>
            →{" "}
            <Link
              href="/predicted"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              This week&rsquo;s Acceleration Watch
            </Link>{" "}
            — the five names the engine flagged this Monday.
          </li>
          <li>
            →{" "}
            <Link
              href="/scorecard"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              Live Scout Score scorecard
            </Link>{" "}
            — see how the engine reasons in real time.
          </li>
          <li>
            →{" "}
            <Link
              href="/funnels"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              The full ascension ladder
            </Link>{" "}
            — every rung from free to Sharp Tier, mapped.
          </li>
        </ul>
      </section>

      <p className="text-slate-600 text-xs leading-relaxed">
        Receipt: <code className="bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded text-[11px]">{session.id}</code>
        <br />
        Lost the intake email?{" "}
        <Link href="/contact" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
          Reply here
        </Link>{" "}
        and we&rsquo;ll resend.
      </p>
    </div>
  );
}
