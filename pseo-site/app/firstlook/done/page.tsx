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

      {/* Brunson Traffic Secrets Ch 12 (Conversation Domination) — the
          buyer is at peak commitment right now (just paid). The lowest-
          friction post-purchase ask is not "buy something else", it's
          "tell one person who'd want this". The sharable link is the
          /firstlook URL with a ref tag so we can attribute referred
          buyers in PostHog. No referral payout — this is a pure word-of-
          mouth ask, congruent with the manifesto pillar #4 (Methodology
          over personality / no growth-hacking schemes). */}
      <section
        aria-label="Tell one investor"
        className="rounded-xl border border-amber-700/30 bg-amber-950/10 p-5 sm:p-6 space-y-3"
      >
        <p className="text-amber-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
          One ask, then we&rsquo;re out of your inbox
        </p>
        <h2 className="text-gray-100 font-bold text-base sm:text-lg leading-snug">
          Know one investor who moves on the engineering signal before the round?
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          That&rsquo;s our buyer. If a name comes to mind, the share link
          below opens a pre-written note — feel free to edit. We attribute
          the referrer in our weekly write-up; nothing else, no payout, no
          tracking pixel.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <a
            href={`mailto:?subject=${encodeURIComponent(
              "Worth €7 — sector deep dive on GitHub momentum",
            )}&body=${encodeURIComponent(
              "I just bought one of these and the 24-hour intake is unusual.\n\nIt's €7, picks any of 19 venture sectors, and you get a 14-page PDF + raw CSV on which startups in that sector are accelerating on commit-velocity (the SSRN paper backs it up — 21–47 day lead on fundraise announcements).\n\nhttps://signals.gitdealflow.com/firstlook?ref=" +
                encodeURIComponent(session.id),
            )}`}
            className="inline-flex items-center justify-center rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm px-4 py-2.5 transition-colors"
          >
            ✉ Send a one-line email
          </a>
          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
              "€7, 24h, one sector, 14-page PDF on commit-velocity acceleration. The SSRN-backed engine is unusual: signals.gitdealflow.com/firstlook?ref=" +
                session.id,
            )}`}
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="inline-flex items-center justify-center rounded-lg border border-slate-700 text-slate-300 hover:text-slate-100 hover:border-slate-600 text-sm px-4 py-2.5 transition-colors"
          >
            Share on X
          </a>
        </div>
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
