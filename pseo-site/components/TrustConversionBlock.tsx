/**
 * TrustConversionBlock — the conversion + rapport footer for trust/proof pages.
 *
 * The trust cluster (methodology, reproducibility, transparency, uptime,
 * corrections, citations, data-sources, …) was auditing high on credibility
 * but leaking on conversion: most pages either dead-ended or routed only to
 * more content. Brunson DCS: every page is a funnel step — it must offer a
 * single dominant next action and reverse the risk. ES: the reader must also
 * know whose voice they were reading (the Attractive Character), or the page
 * reads as a disconnected SEO surface.
 *
 * This block carries all four lifts in one drop-in:
 *   1. Marcus reassurance — "you don't read the code, we translate it"
 *      (relieves the core "looking non-technical" fear before the ask).
 *   2. One dominant offer CTA + a free-digest secondary (one funnel).
 *   3. Honest risk-reversal — the 30-day Signal-or-It's-Free line, no
 *      fabricated value stack, no fake countdown.
 *   4. A compact Data Nerd signoff for rapport.
 *
 * `dominant`:
 *   "firstlook" — €7 tripwire leads (default; the reader is mid-evaluation)
 *   "digest"    — free Sunday issue leads (cold/research/press readers)
 */

import Link from "next/link";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";

interface Props {
  /** Optional one-line context tying the block to the page it sits on. */
  context?: string;
  /** Which offer leads. Defaults to the €7 First Look tripwire. */
  dominant?: "firstlook" | "digest";
  className?: string;
}

export function TrustConversionBlock({
  context,
  dominant = "firstlook",
  className = "",
}: Props) {
  const firstLook = (
    <Link
      href="/firstlook"
      className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold transition-colors shadow-sm shadow-sky-500/30"
    >
      Get my First Look — €7
      <span aria-hidden="true">→</span>
    </Link>
  );

  const digest = (
    <Link
      href="https://gitdealflow.com/#signup"
      className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-semibold transition-colors shadow-sm shadow-sky-500/30"
    >
      Get the free Sunday issue
      <span aria-hidden="true">→</span>
    </Link>
  );

  const firstLookOutline = (
    <Link
      href="/firstlook"
      className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-600 hover:border-slate-400 hover:bg-slate-800/40 text-gray-200 hover:text-white text-sm font-medium transition-colors"
    >
      Or test one sector for €7
    </Link>
  );

  const digestOutline = (
    <Link
      href="https://gitdealflow.com/#signup"
      className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-600 hover:border-slate-400 hover:bg-slate-800/40 text-gray-200 hover:text-white text-sm font-medium transition-colors"
    >
      Or start free — the Sunday issue
    </Link>
  );

  const leadFirstLook = dominant === "firstlook";

  return (
    <section
      className={`rounded-xl border border-slate-700 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 overflow-hidden shadow-lg shadow-slate-950/40 ${className}`}
      aria-label="Next step"
    >
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, #0ea5e9 40%, #6366f1 60%, transparent)",
        }}
      />
      <div className="px-6 py-7 sm:px-8 space-y-5">
        {context ? (
          <p className="text-sky-300/90 text-xs font-medium">{context}</p>
        ) : null}

        <div className="space-y-2">
          <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
            You don&rsquo;t read the code — we do
          </p>
          <h3 className="text-gray-100 font-semibold text-lg sm:text-xl leading-snug">
            See the signal on your own sector before you commit a euro
          </h3>
          <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
            You never open a repo. We translate the engineering signal into plain
            business English — who&rsquo;s accelerating, who&rsquo;s stalling,
            who&rsquo;s worth a meeting. No GitHub account, no terminal, nothing
            to install.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {leadFirstLook ? firstLook : digest}
          {leadFirstLook ? digestOutline : firstLookOutline}
        </div>

        <p className="text-gray-500 text-xs">
          €7 once · 30-day Signal-or-It&rsquo;s-Free — reply{" "}
          <span className="text-gray-300 font-medium">REFUND</span>, keep
          everything · no auto-renew ·{" "}
          <Link
            href="/pricing"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            compare all tiers
          </Link>
        </p>

        <div className="pt-1">
          <DataNerdSignoff variant="compact" />
        </div>
      </div>
    </section>
  );
}

export default TrustConversionBlock;
