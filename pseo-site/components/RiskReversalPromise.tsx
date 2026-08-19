/**
 * RiskReversalPromise, Brunson Expert Secrets Ch 15 (Money / Identity /
 * Risk closes), the Risk Reversal beat specifically.
 *
 * Audit 2026-05-09 verdict (Ch 15, score 94/100):
 *   "Risk Reversal close could be louder ('if 31-day prediction misses,
 *    full refund')."
 *
 * The 30-day Signal-or-It's-Free guarantee already lives in /firstlook,
 * /sector-sweep, /pricing copy, but as paragraph text, not a punchy
 * named badge. This component is the visual badge: one card, three
 * declarative lines (THE PROMISE / THE STAKE / THE PROCESS) and a
 * wax-seal-style "30 DAYS" mark. Gets dropped on every close-side
 * surface so the buyer reads it the same way every time.
 *
 * Server Component, pure presentation, no client state. Variants:
 *   tier="dashboard"    , €49/mo, Signal-or-It's-Free
 *   tier="insider"      , €197/mo,  Signal-or-It's-Free
 *   tier="sharp"        , €497/mo, Signal-or-It's-Free
 *   tier="sector-sweep" , €1,997 once, Three-Orgs-or-Refund
 *   tier="firstlook"    , €7 once, no-questions
 *
 * Anonymity rule: copy is voice-of-The-Data-Nerd. No founder reference.
 */

import Link from "next/link";

export type RiskReversalTier =
  | "dashboard"
  | "insider"
  | "sharp"
  | "sector-sweep"
  | "firstlook";

interface PromiseSpec {
  /** The named promise. One line, declarative. */
  promise: string;
  /** The dollar stake on the line. */
  stake: string;
  /** The redemption process, what to type and where it lands. */
  process: string;
  /** Calibration receipt, refunds issued historically. */
  receipt: string;
  /** Refund window in days. */
  windowDays: 30;
}

const SPEC: Record<RiskReversalTier, PromiseSpec> = {
  firstlook: {
    promise:
      "If the First Look Pass doesn't surface one startup you'd otherwise have missed, reply REFUND inside 30 days.",
    stake: "€7",
    process:
      "One reply, no questionnaire. The €7 lands back on your card inside one business day. You keep the PDF and the CSV, we'd rather you have them than have you feel oversold.",
    receipt: "Two refunds issued in three years of running this.",
    windowDays: 30,
  },
  dashboard: {
    promise:
      "If, in your first 30 days, the Acceleration Watch doesn't surface a startup you find genuinely interesting, defined as one you'd have wanted to know about earlier, full refund.",
    stake: "€49/mo",
    process:
      "Reply REFUND to any system email. Full payment back inside two business days. No exit interview, no 'wait, let me show you one more thing'.",
    receipt:
      "The guarantee exists because the signal either works or it doesn't. Charging for an output you don't find useful is bad business.",
    windowDays: 30,
  },
  insider: {
    promise:
      "If, in your first 30 days, the private Telegram + JSON/CSV API don't earn the seat, measured by you, against your own thesis, full refund.",
    stake: "€197/mo",
    process:
      "Reply REFUND to any Insider email. Full payment back inside two business days. The MCP server stays free regardless of refund decision.",
    receipt:
      "The rate lock means your price locks to entry, not tenure. Even after refund, your locked price is preserved if you ever come back.",
    windowDays: 30,
  },
  sharp: {
    promise:
      "If the quarterly review call + custom watchlist + white-labeled API don't fit the way your fund actually works in the first 30 days, full refund.",
    stake: "€497/mo",
    process:
      "Reply REFUND or pick up the phone on the next quarterly call. Full payment back, methodology source code stays in your repo (it's MIT-licensed, not gated).",
    receipt:
      "Application-gated, capped at 8 funds in 2026. The cap exists so the guarantee can stay this loose, we can only refund what we can serve.",
    windowDays: 30,
  },
  "sector-sweep": {
    promise:
      "If the Sector Sweep doesn't surface at least three orgs you didn't already know about, or if the methodology can't be reproduced from the published panel, full refund.",
    stake: "€1,997",
    process:
      "Reply REFUND to the delivery email inside 30 days. Full €1,997 back inside two business days. No exit interview, no clawback of the artefacts you received.",
    receipt:
      "Three orgs or refund. The bar is binary because the deliverable is binary, you either learn three new names or you don't.",
    windowDays: 30,
  },
};

interface Props {
  tier: RiskReversalTier;
  /** Optional id for #anchor links. Default: "guarantee". */
  anchor?: string;
  /** When true, renders a denser variant for tight cart contexts. */
  compact?: boolean;
}

export function RiskReversalPromise({ tier, anchor = "guarantee", compact = false }: Props) {
  const spec = SPEC[tier];
  const padding = compact ? "p-5 sm:p-6" : "p-6 sm:p-8";
  const titleSize = compact ? "text-lg sm:text-xl" : "text-xl sm:text-2xl";

  return (
    <section
      id={anchor}
      aria-label={`${spec.windowDays}-day guarantee, ${spec.stake}`}
      className={`relative rounded-xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 ${padding} space-y-4`}
    >
      {/* Wax-seal style stamp, visual anchor, screen-reader hidden. */}
      <div
        aria-hidden="true"
        className="absolute -top-3 -right-3 sm:top-4 sm:right-4 sm:relative sm:float-right sm:ml-3 w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex flex-col items-center justify-center text-emerald-300 leading-none rotate-[-6deg] shadow-lg shadow-emerald-500/10"
      >
        <span className="text-[10px] font-bold tracking-wider">SIGNAL</span>
        <span className="text-2xl sm:text-3xl font-black my-0.5">{spec.windowDays}</span>
        <span className="text-[9px] font-semibold tracking-wider">DAY GUARANTEE</span>
      </div>

      <div className="space-y-1.5">
        <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          Risk on us · {spec.stake}
        </p>
        <h2 className={`${titleSize} font-bold text-gray-100 leading-snug pr-24 sm:pr-0`}>
          Signal or it&rsquo;s free. {spec.windowDays} days. No questions.
        </h2>
      </div>

      <dl className="space-y-3 text-sm leading-relaxed">
        <div>
          <dt className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            The promise
          </dt>
          <dd className="text-gray-200">{spec.promise}</dd>
        </div>
        <div>
          <dt className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            How to redeem
          </dt>
          <dd className="text-gray-300">{spec.process}</dd>
        </div>
        <div>
          <dt className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-1">
            Calibration receipt
          </dt>
          <dd className="text-gray-400 italic">{spec.receipt}</dd>
        </div>
      </dl>

      {!compact && (
        <p className="text-gray-400 text-xs leading-relaxed border-t border-emerald-900/40 pt-3">
          The guarantee is the point. If the signal doesn&rsquo;t earn its
          place inside your workflow inside one calendar month, you have
          paid us nothing.{" "}
          <Link
            href="/methodology"
            className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted"
          >
            Read the methodology that backs the promise →
          </Link>
        </p>
      )}
    </section>
  );
}
