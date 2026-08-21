import type { Metadata } from "next";
import Link from "next/link";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";

export const metadata: Metadata = {
  title:
    "Confirmed, your 30-Day Deal Flow Reset starts now",
  description:
    "Email confirmed. Day 1 of the 30-Day Deal Flow Reset is queued for the next 15 minutes. Here's the four-week curriculum and what to expect.",
  alternates: { canonical: "/challenge/started" },
  robots: { index: false, follow: true },
};

export default function ChallengeStartedPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <p className="text-emerald-400 text-sm font-medium mb-3 uppercase tracking-wider">
        Confirmed
      </p>
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
        You&rsquo;re in. Day 1 lands within 15 minutes.
      </h1>
      <p className="text-gray-400 text-base leading-relaxed mb-8">
        Welcome to the 30-Day Deal Flow Reset. Pick one startup before tomorrow
any one. A founder you met, a company you almost-invested in, a
        portfolio org you want to monitor. Have its GitHub URL ready. The first
        email walks you through the framework; over the next 30 days you&rsquo;ll
        learn the 7 atomic signals (Week 1), apply the composite to real
        candidates (Week 2), build a watchlist + weekly rhythm (Week 3), and
        operationalize alerts + MCP integration (Week 4).
      </p>

      <div className="rounded-xl border border-emerald-700/40 bg-emerald-950/20 p-6 mb-8">
        <h2 className="text-gray-100 font-semibold text-lg mb-3">
          What lands in your inbox
        </h2>
        <ol className="space-y-2 text-sm text-gray-300">
          <li>
            <span className="text-emerald-400 font-mono">Day 0</span> (now) -
            Welcome + curriculum + tomorrow&rsquo;s prep
          </li>
          <li>
            <span className="text-emerald-400 font-mono">Week 1 (D1-7)</span>: Learn: each of the 7 atomic signals (commit velocity →
            contributor diversity → dependents graph → README freshness → new
            repo creation → issue-to-PR ratio → composite scoring)
          </li>
          <li>
            <span className="text-emerald-400 font-mono">Week 2 (D8-14)</span>: Apply: score 3 candidates from your pipeline + 1 calibration
            backtest, ending with your first scorecard artifact
          </li>
          <li>
            <span className="text-emerald-400 font-mono">Week 3 (D15-21)</span>: Synthesize: 10-org watchlist, weekly Monday rhythm, sector
            batching, score-driven founder Q&amp;A, the 30-second pre-read
          </li>
          <li>
            <span className="text-emerald-400 font-mono">Week 4 (D22-30)</span>: Operationalize: alerts, anti-signals, co-investor share template,
            MCP integration, custom weights, retrospective, graduation
          </li>
        </ol>
      </div>

      <h2 className="text-gray-100 font-semibold text-lg mb-3">
        While you wait, three optional reads
      </h2>
      <ul className="space-y-3 mb-8">
        <li>
          <Link
            href="/methodology"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted text-sm"
          >
            /methodology
          </Link>{" "}
          <span className="text-gray-400 text-sm">the open, reproducible methodology behind the seven signals.
          </span>
        </li>
        <li>
          <Link
            href="/predicted"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted text-sm"
          >
            /predicted
          </Link>{" "}
          <span className="text-gray-400 text-sm">this week&rsquo;s public Acceleration Watch (10 named startups,
            graded post-hoc).
          </span>
        </li>
        <li>
          <a
            href="https://ssrn.com/abstract=6606558"
            target="_blank"
            rel="noopener"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted text-sm"
          >
            ssrn.com/abstract=6606558
          </a>{" "}
          <span className="text-gray-400 text-sm">the SSRN paper covering the 219-observation panel.
          </span>
        </li>
      </ul>

      <p className="text-gray-400 text-xs">
        If Day 1 doesn&rsquo;t arrive within 30 minutes, check your spam folder
        and add{" "}
        <code className="bg-slate-800 px-1 rounded text-gray-300">
          signals@gitdealflow.com
        </code>{" "}
        to your address book. To unsubscribe at any point, reply to any email
        with the word{" "}
        <code className="bg-slate-800 px-1 rounded text-gray-300">
          unsubscribe
        </code>
        .
      </p>

      <DataNerdSignoff variant="compact" className="mt-8" />
    </div>
  );
}
