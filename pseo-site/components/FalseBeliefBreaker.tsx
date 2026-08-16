/**
 * FalseBeliefBreaker, Brunson Expert Secrets Ch 13 (Identifying False
 * Beliefs / Buyer's Roadmap intro).
 *
 * Audit 2026-05-09 verdict (Ch 13, score 92/100):
 *   "/scorecard rolling Magic Bullet. False-belief patterns named."
 *
 * The false beliefs ARE named throughout the site, but as scattered prose.
 * Brunson's Ch 13 teaching: list them as beliefs, name what they actually
 * are (Vehicle / Internal / External), and put a one-line break beside
 * each. This component is the explicit table, three patterns, three
 * breaks, indexed and reusable.
 *
 * Server Component. Drops into /scorecard, /walkthrough, /pricing.
 */

import Link from "next/link";

type BeliefPattern = "vehicle" | "internal" | "external";

interface FalseBelief {
  pattern: BeliefPattern;
  /** The false belief, in the buyer's voice. */
  belief: string;
  /** Why it feels true. */
  origin: string;
  /** The one-line break. */
  breakLine: string;
  /** Receipt, link to the surface that proves the break. */
  proof: { label: string; href: string };
}

const FALSE_BELIEFS: FalseBelief[] = [
  {
    pattern: "vehicle",
    belief:
      "“Commit-velocity acceleration is just survivorship, the unicorns we already know about happen to have nice GitHub graphs.”",
    origin:
      "Survivorship bias is the right thing to suspect when someone shows you a chart. It's the default skeptical move and the buyer is correct to make it.",
    breakLine:
      "The SSRN paper grades n=219 paired observations PROSPECTIVELY, picks made before the fundraise, not after. The miss column is published. Survivorship would require the miss column to be empty; it isn't.",
    proof: { label: "/methodology, n=219 panel + miss column", href: "/methodology" },
  },
  {
    pattern: "internal",
    belief:
      "“Reading code is a partner-track skill. I'm an investor, not an engineer, this isn't for me.”",
    origin:
      "Most VC tooling is built for partner-track GPs at funds with eight-figure data budgets. The default visual language of every dashboard reinforces that this is partner work.",
    breakLine:
      "The signal works without you reading a single line of code. The Acceleration Watch is the partner-track output WITHOUT the partner-track prerequisite, the contributor-quality + acceleration math runs once a week and lands as a ranked list.",
    proof: { label: "/about/founder, who this is actually for", href: "/about/founder" },
  },
  {
    pattern: "external",
    belief:
      "“Even if the signal works, my fund won't switch, we already pay €120k/yr for Harmonic / Pitchbook / Affinity / etc.”",
    origin:
      "Switching costs are real. Procurement cycles are real. The partner who signed the existing contract is real and may not want to be told their tool isn't enough.",
    breakLine:
      "The signal is additive, not replacement. Run it for €588/yr alongside whatever you already have, on a 30-day refund. Six months in, either the leading-indicator column changed how you triage, or it didn't, and you cancel without touching the existing stack.",
    proof: { label: "/alternatives, additive, not replacement", href: "/alternatives" },
  },
];

const PATTERN_LABEL: Record<BeliefPattern, string> = {
  vehicle: "Vehicle belief",
  internal: "Internal belief",
  external: "External belief",
};

const PATTERN_DESC: Record<BeliefPattern, string> = {
  vehicle: "Will the new vehicle work?",
  internal: "Can I work it?",
  external: "Will my world let me work it?",
};

export function FalseBeliefBreaker() {
  return (
    <section
      id="false-beliefs"
      aria-label="The three false beliefs, and the line that breaks each"
      className="space-y-5"
    >
      <header className="space-y-2">
        <p className="text-rose-300 text-xs font-semibold uppercase tracking-wider">
          Three false beliefs · One break each
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-tight">
          The three reasons buyers walk away, and the one line that breaks each.
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
          Every buyer who doesn&rsquo;t convert holds at least one of three
          false beliefs. The patterns are stable: a doubt about the vehicle,
          a doubt about themselves, or a doubt about their world. Naming the
          pattern is half the work. The other half is the one-line break,
          backed by a public receipt.
        </p>
      </header>

      <ol className="space-y-4">
        {FALSE_BELIEFS.map((fb, i) => (
          <li
            key={fb.pattern}
            className="rounded-xl border border-rose-900/40 bg-gradient-to-br from-rose-950/15 via-slate-900 to-slate-950 p-5 sm:p-6 space-y-3"
          >
            <header className="flex items-baseline justify-between gap-3 flex-wrap">
              <div>
                <p className="text-rose-300 text-[10px] font-bold uppercase tracking-wider">
                  Belief {i + 1} · {PATTERN_LABEL[fb.pattern]}
                </p>
                <p className="text-gray-500 text-xs italic">
                  {PATTERN_DESC[fb.pattern]}
                </p>
              </div>
            </header>

            <blockquote className="text-gray-200 text-base leading-snug border-l-2 border-rose-500/60 pl-4 italic">
              {fb.belief}
            </blockquote>

            <div className="space-y-2 text-sm leading-relaxed">
              <p className="text-gray-400">
                <span className="text-rose-400 text-[10px] font-bold uppercase tracking-wider mr-2">
                  Why it feels true
                </span>
                {fb.origin}
              </p>
              <p className="text-gray-200">
                <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider mr-2">
                  The break
                </span>
                {fb.breakLine}
              </p>
              <p className="pt-1">
                <Link
                  href={fb.proof.href}
                  className="text-emerald-300 hover:text-emerald-200 text-xs underline decoration-dotted"
                >
                  → {fb.proof.label}
                </Link>
              </p>
            </div>
          </li>
        ))}
      </ol>

      <p className="text-gray-500 text-xs leading-relaxed border-t border-slate-800 pt-3">
        Three false beliefs is the canonical pattern count. If a buyer holds
        a fourth, &ldquo;the team behind it might disappear&rdquo;, that&rsquo;s a
        legitimate concern, not a false belief. The methodology code is
        MIT-licensed; the dataset mirrors to Zenodo. The signal outlives the
        team.
      </p>
    </section>
  );
}
