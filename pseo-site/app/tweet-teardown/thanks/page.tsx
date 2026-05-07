import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Thanks — your teardown is in the queue",
  description:
    "Confirmation page for the €1 Tweet Teardown. Manual reply within 4 hours, with refund if no org match.",
  alternates: { canonical: "/tweet-teardown/thanks" },
  robots: { index: false, follow: false },
};

export default function TeardownThanksPage() {
  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/tweet-teardown/thanks"
        languages={getHreflangLanguages("/tweet-teardown/thanks")}
      />
      <AgentMirrorLinks path="/tweet-teardown/thanks" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* Confirmed header */}
        <header className="space-y-3 text-center">
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-[0.18em]">
            Payment confirmed · Teardown queued
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Your <span className="text-sky-300">€1 teardown</span> is in the
            queue.
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">
            The receipt is in your inbox. The teardown reply lands within four
            business hours — usually faster, never slower than next-business-
            morning UTC.
          </p>
        </header>

        {/* What happens next */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            What happens next
          </p>
          <ol className="space-y-3 text-gray-200 text-sm leading-relaxed list-decimal list-inside">
            <li>
              We read the tweet you submitted at checkout and identify the
              GitHub org the tweet is naming or implying.
            </li>
            <li>
              We run the live 7-signal Scout methodology against that org,
              freeze the score for the day you bought, and capture three
              short paragraphs of written teardown.
            </li>
            <li>
              The reply lands in your inbox as plain prose — no PDF attachment,
              no clickbait formatting. You can forward it, paste it into a
              memo, or reply with a follow-up question.
            </li>
            <li>
              If we can't match the tweet to a real public GitHub org, you
              get a refund inside an hour. Reply "REFUND" to the receipt and
              we don't even ask why.
            </li>
          </ol>
        </section>

        {/* Where to send the tweet (if not captured at checkout) */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 space-y-3">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Didn't paste the tweet at checkout?
          </p>
          <p className="text-gray-200 text-sm leading-relaxed">
            Just reply to the receipt email with the tweet URL (or paste the
            text). The clock starts when the tweet arrives in our inbox, not
            when the payment cleared. We'll confirm receipt within 30 minutes.
          </p>
          <p className="text-gray-400 text-xs">
            Direct address:{" "}
            <a
              href="mailto:teardown@gitdealflow.com"
              className="text-sky-400 hover:text-sky-300"
            >
              teardown@gitdealflow.com
            </a>
          </p>
        </section>

        {/* OTO ascension — Brunson Ladder, exactly one logical next move */}
        <section className="bg-gradient-to-br from-sky-950/40 via-slate-900 to-slate-950 border border-sky-700/50 rounded-xl p-6 space-y-4">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            One-time offer · for teardown buyers only
          </p>
          <h2 className="text-2xl font-bold text-gray-100 leading-tight">
            Skip the one-tweet bottleneck. Get the ranked panel every Sunday.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            The €1 teardown answers one tweet. The €9.97/mo Dashboard answers
            four thousand two hundred orgs continuously, with the same Scout
            Score, refreshed every Monday at 09:00 UTC. Founding-member rate
            locked forever for the cohort closing in days, not weeks.
          </p>
          <Link
            href="/pricing#dashboard-beta"
            className="inline-flex items-center justify-center w-full sm:w-auto rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-6 py-3 transition-colors"
          >
            Lock in €9.97/mo Dashboard →
          </Link>
        </section>

        {/* Free signal digest */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-lg p-5 space-y-3 text-sm">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Either way, the free signal stays free
          </p>
          <p className="text-gray-200 leading-relaxed">
            Whether or not you upgrade, you'll get the free Sunday signal
            digest with five ranked acceleration calls every week. No
            commitment, no pressure, free forever.
          </p>
          <Link
            href="https://gitdealflow.com/#signup"
            className="text-sky-400 hover:text-sky-300 font-medium"
          >
            Confirm I'm on the free Sunday list →
          </Link>
        </section>

        <p className="text-center text-xs text-gray-400">
          Questions? Reply to the receipt email or write to{" "}
          <a
            className="text-sky-400 hover:text-sky-300"
            href="mailto:signal@gitdealflow.com"
          >
            signal@gitdealflow.com
          </a>
          .
        </p>
      </div>
    </>
  );
}
