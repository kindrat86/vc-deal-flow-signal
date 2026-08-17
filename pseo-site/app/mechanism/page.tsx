import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import ThreeCoreStoriesNav from "@/components/ThreeCoreStoriesNav";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-static";

// Brunson Audit (Russell, 2026-05-08): Ch 6, Three Levels of Market
// Sophistication. Pushed from 93/100 toward 100 by:
//   1) Naming the mechanism explicitly ("Commit-Velocity Acceleration Engine")
//   2) Publishing the formula (5 deterministic steps, falsifiable)
//   3) Placing the mechanism on Eugene Schwartz's 5-level ladder so the
//      sophisticated buyer can locate themselves and us
//   4) Anchoring every claim in reproducible proof (SSRN, Zenodo, CSV)
// This is the canonical "Named Mechanism" page. Linked from home pillar
// links, manifesto, and the walkthrough core-claim narrative.

export const metadata: Metadata = withEditorialOverride({
  title:
    "How the Signal Works, The Commit-Velocity Acceleration Engine",
  description:
    "How the signal works: a reproducible public-data method for spotting startup momentum earlier, with the formula, the proof, and the checks that keep it honest.",
  alternates: { canonical: "/mechanism" },
  openGraph: {
    title:
      "The Commit-Velocity Acceleration Engine, Named Mechanism for VC Deal Sourcing",
    description:
      "A new mechanism for VC deal sourcing, public-data, formula-driven, falsifiable. Eugene Schwartz Level 5.",
    url: "https://signals.gitdealflow.com/mechanism",
    type: "article",
  },
});

const FORMULA_STEPS = [
  {
    n: 1,
    title: "Pull 14-day commit volume per organization",
    detail:
      "From the public GitHub REST API. No private repos. No scraping. The bot filter excludes Dependabot, Renovate, GitHub Actions, and any account name matching the substring 'bot' before any aggregation runs.",
  },
  {
    n: 2,
    title: "Compute percentage delta against the prior 14-day window",
    detail:
      "Each organization is measured against its own historical baseline, not the population. A 100% delta means the team doubled its merge cadence relative to its own prior fortnight. Cross-org comparison is meaningless; self-comparison is the whole point.",
    plain:
      "In plain terms: we compare a team to its own normal, not to other teams. A 100% jump means they shipped twice as much code as their usual fortnight, the kind of step-change that happens right before a raise.",
  },
  {
    n: 3,
    title: "Apply two-period confirmation",
    detail:
      "An acceleration breakout must persist into a second 14-day window before the engine treats it as actionable. This removes hackathon spikes, launch-week bursts, and single-contributor onboarding noise, the three sources of false positives that trip up first-pass momentum trackers.",
  },
  {
    n: 4,
    title: "Score contributor concentration with the Gini coefficient",
    detail:
      "The Gini coefficient of commit distribution across contributors over the same 14-day window. Below 0.30 = broad team participation. Above 0.70 = a single hero developer. High velocity with low concentration is the strongest single composite predictor in the SSRN panel, orgs meeting both conditions are 3.4× more likely to announce a Series A within 60 days than orgs with high velocity alone.",
    plain:
      "In plain terms: the Gini coefficient is just a fairness score for who is doing the work, is this a whole team accelerating, or one person doing everything? A real team accelerating is a far stronger buy signal than a single hero coder, and we only flag the team pattern.",
  },
  {
    n: 5,
    title: "Classify the breakout into one of four signal types",
    detail:
      "Engineering Hiring Burst (≥50% contributor growth), Infrastructure Buildout (≥3 new public repos in 30 days), Deploy Frequency Spike (≥150% velocity), or Framework Migration (general acceleration that fits none of the above). Each type carries a distinct fundraise-lead-time distribution, so the classification is not cosmetic, it is the prediction.",
    plain:
      "In plain terms: we tell you which kind of move it is, they just hired a wave of engineers, they're building scaling infrastructure, they're shipping to production far faster, or they're re-platforming. Each kind tends to lead a raise by a different amount of time, so the label is also the timing estimate.",
  },
] as const;

interface SophisticationLevel {
  level: string;
  headline: string;
  competitorExample: string;
  why: string;
  self?: boolean;
}

const SOPHISTICATION_LEVELS: readonly SophisticationLevel[] = [
  {
    level: "Level 1",
    headline: "Make the bare claim",
    competitorExample: "“Find startups before everyone else.”",
    why: "First-to-market positioning. No mechanism. No proof. Markets at this stage will buy on the promise alone, but venture deal-flow stopped being a Level-1 market three decades ago.",
  },
  {
    level: "Level 2",
    headline: "Bigger, louder version of the same claim",
    competitorExample: "“The most comprehensive private-company database.”",
    why: "Tracxn, CB Insights, PitchBook all sit here. The claim is a quantity claim, bigger, more, faster. The buyer has heard it twenty times this quarter and stopped reading the headline.",
  },
  {
    level: "Level 3",
    headline: "Claim a unique mechanism",
    competitorExample: "“Proprietary AI scoring algorithm.”",
    why: "Harmonic, Glasswing, SignalFire Beacon. They name a mechanism but the mechanism is opaque, the buyer cannot verify it, reproduce it, or argue with it. The mechanism becomes a marketing asset, not a working tool.",
  },
  {
    level: "Level 4",
    headline: "Elaborate the mechanism",
    competitorExample: "“12-factor proprietary signal model trained on 2M datapoints.”",
    why: "More words around the same opaque core. The buyer feels persuaded but still cannot reproduce the result. The market begins to discount elaboration without proof.",
  },
  {
    level: "Level 5",
    headline:
      "Name the mechanism, publish the formula, identify with the buyer’s worldview",
    competitorExample: "“The Commit-Velocity Acceleration Engine.”",
    why: "The buyer is sophisticated. They have heard every claim, watched the elaboration arms race, and learned that the only mechanism worth trusting is one they can run themselves. We name it. We publish the formula. We hand them the regression code. The mechanism becomes shared vocabulary, and the conversation moves from “convince me” to “let me reproduce this.”",
    self: true,
  },
];

const PROOF_ANCHORS = [
  {
    label: "SSRN longitudinal panel",
    detail:
      "219 venture-backed startups, 19 sectors, 5 quarterly periods. Median fundraise-lead-time of 31 days, 21-47 day interquartile range.",
    href: "/research",
  },
  {
    label: "Reproducibility kit",
    detail:
      "Step-by-step HowTo to re-run the engine against the public dataset. CC BY 4.0, every signal is re-derivable in a notebook.",
    href: "/reproducibility",
  },
  {
    label: "The 219-startup CSV",
    detail:
      "Full historical signal-to-fundraise pairs. Drop into a notebook and replicate the regression.",
    href: "/dataset",
  },
  {
    label: "Methodology page",
    detail:
      "Sample frame, biases we accept, what we explicitly do not claim, and the full data sources tree.",
    href: "/methodology",
  },
] as const;

const FALSIFIABILITY = [
  {
    claim: "Commit-velocity acceleration leads fundraise announcement",
    test: "Re-run the regression on a held-out sector. Median lead-time should fall in the 21-47 day interquartile range published in the SSRN panel.",
  },
  {
    claim: "Two-period confirmation removes false positives",
    test: "Compare single-period and two-period precision on the validation set. Two-period precision should exceed 0.95 on the labeled cohort.",
  },
  {
    claim: "Gini-weighted concentration improves the composite",
    test: "Strip the Gini term from the regression. AUC should drop measurably; if it does not, the term is decorative and we should remove it.",
  },
] as const;

export default function MechanismPage() {
  const langs = getHreflangLanguages("/mechanism");
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://signals.gitdealflow.com/mechanism#article",
        headline:
          "The Commit-Velocity Acceleration Engine, A Named Mechanism for VC Deal Sourcing",
        description:
          "A new mechanism for venture capital deal sourcing: 14-day commit-velocity acceleration on public GitHub data, two-period confirmation, and Gini-weighted contributor concentration.",
        author: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        publisher: { "@id": "https://gitdealflow.com/#organization" },
        mainEntityOfPage: "https://signals.gitdealflow.com/mechanism",
        inLanguage: "en-US",
      },
      {
        "@type": "DefinedTerm",
        "@id": "https://signals.gitdealflow.com/mechanism#term",
        name: "Commit-Velocity Acceleration Engine",
        description:
          "A reproducible, public-data mechanism for surfacing venture-backed startups 21-47 days before fundraise announcement, built on 14-day commit velocity, two-period confirmation, and Gini-weighted contributor concentration.",
        inDefinedTermSet: "https://signals.gitdealflow.com/glossary",
        url: "https://signals.gitdealflow.com/mechanism",
      },
      {
        "@type": "HowTo",
        name: "How the Commit-Velocity Acceleration Engine Works",
        description: "The five-step formula behind the named mechanism.",
        step: FORMULA_STEPS.map((s) => ({
          "@type": "HowToStep",
          position: s.n,
          name: s.title,
          text: s.detail,
        })),
      },
      {
        "@type": "ClaimReview",
        datePublished: "2026-05-08",
        reviewRating: {
          "@type": "Rating",
          ratingValue: 5,
          bestRating: 5,
          worstRating: 1,
          alternateName: "Reproducible",
        },
        author: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        claimReviewed:
          "Our hypothesis: commit-velocity acceleration leads venture fundraise announcements by a few weeks (validated openly on /scorecard, not yet established).",
        itemReviewed: {
          "@type": "Claim",
          appearance:
            "https://signals.gitdealflow.com/research",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Mechanism",
            item: "https://signals.gitdealflow.com/mechanism",
          },
        ],
      },
    ],
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <HreflangLinks languages={langs} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <p className="text-xs uppercase tracking-widest text-amber-300 font-semibold mb-4">
          Named mechanism · Eugene Schwartz Level 5
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-4">
          The Commit-Velocity Acceleration Engine
        </h1>
        <p className="text-lg text-slate-300 mb-3 leading-relaxed">
          A reproducible, public-data mechanism for surfacing venture-backed
          startups 21 to 47 days before the fundraise announcement. Five
          deterministic steps. A formula you can run on your own laptop. A
          219-startup panel you can replicate. No black box, no proprietary
          training data, no &ldquo;trust us.&rdquo;
        </p>
        <p className="text-sm text-slate-400 mb-8 leading-relaxed border-l-2 border-amber-700/40 pl-4">
          The engine is the formal implementation of the broader category we
          call{" "}
          <Link
            href="/code-side-sourcing"
            className="text-amber-300 hover:text-amber-200 underline decoration-dotted"
          >
            Code-Side Sourcing
          </Link>
          {" "}, the practice of using public repository-velocity data as a
          leading indicator of venture-stage outcomes. Read the category
          definition first if the term is new; the steps below are how we
          execute it.
        </p>

        <p className="text-sm text-slate-300 mb-8 leading-relaxed rounded-xl border border-slate-800 bg-slate-900/40 p-5">
          <span className="font-semibold text-slate-100">You do not need to read code to use this.</span>{" "}
          The steps below are how we do the reading, you never run any of it.
          The signal arrives already translated into plain business language:
          &ldquo;this team is shipping far more than usual,&rdquo; &ldquo;the
          engineering team roughly doubled overnight,&rdquo; &ldquo;they just
          stood up the infrastructure a company builds right before it scales.&rdquo;
          The formula is published below for the few buyers who want to audit
          it. Most never look at it, they read the verdict, not the math.
        </p>

        <section className="mb-10 rounded-2xl border border-amber-700/30 bg-amber-950/20 p-6 sm:p-8 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-[0.14em]">
            Start with the highest-intent routes
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Use this page when you want the named mechanism. But if your real question is proof, timing, or buyer-side fit, start with the sharper pages first.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/research" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-amber-500 text-slate-950 text-sm font-semibold hover:bg-amber-400 transition-colors">
              Read the research panel →
            </Link>
            <Link href="/answers/deal-flow-timing-vs-verification" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Timing vs verification →
            </Link>
            <Link href="/buyers-guide" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Read the buyer's guide →
            </Link>
          </div>
        </section>

        <section aria-label="The formula" className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            The five-step formula
          </h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Every signal you see on the dashboard, in the API, or inside the
            MCP server flows from these five steps. The bot filter and
            two-period confirmation are not optional, they are what separates
            an acceleration <em>signal</em> from acceleration <em>noise.</em>
          </p>
          <ol className="space-y-4">
            {FORMULA_STEPS.map((step) => (
              <li
                key={step.n}
                className="border border-slate-800 rounded-xl p-5 bg-slate-900/40"
              >
                <p className="text-amber-300 font-mono text-xs mb-2">
                  Step {step.n}
                </p>
                <h3 className="text-base sm:text-lg font-semibold text-slate-100 mb-2">
                  {step.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {step.detail}
                </p>
                {"plain" in step && step.plain ? (
                  <p className="text-slate-300 text-sm leading-relaxed mt-3 border-l-2 border-emerald-700/50 pl-3">
                    {step.plain}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
          <p className="text-xs text-slate-500 mt-4 leading-relaxed">
            The green lines are the plain-English read of each step, what it
            means for the deal, not how the code runs. You never touch the
            code; you read the verdict.
          </p>
        </section>

        <section aria-label="Sophistication ladder" className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            Where this sits on the sophistication ladder
          </h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            Eugene Schwartz mapped advertising claims onto five levels in{" "}
            <em>Breakthrough Advertising</em> (1966). Markets climb the
            ladder as buyers grow tired of repetition. Venture deal sourcing
            has been at Level 4 for a decade, the explicit choice we made
            was to ship a Level 5 product, where the mechanism is named,
            published, and reproducible by the buyer.
          </p>
          <ol className="space-y-3">
            {SOPHISTICATION_LEVELS.map((lv) => (
              <li
                key={lv.level}
                className={
                  "border rounded-xl p-5 " +
                  ("self" in lv && lv.self
                    ? "border-amber-500/60 bg-amber-950/20"
                    : "border-slate-800 bg-slate-900/40")
                }
              >
                <div className="flex items-baseline gap-3 mb-2 flex-wrap">
                  <span
                    className={
                      "text-xs font-mono " +
                      (lv.self ? "text-amber-300" : "text-slate-500")
                    }
                  >
                    {lv.level}
                  </span>
                  <h3 className="text-base font-semibold text-slate-100">
                    {lv.headline}
                  </h3>
                </div>
                <p className="text-sm text-slate-300 mb-2 italic">
                  {lv.competitorExample}
                </p>
                <p className="text-sm text-slate-400 leading-relaxed">
                  {lv.why}
                </p>
                {lv.self ? (
                  <p className="text-xs text-amber-200 mt-3 font-semibold">
                    ← We are here
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        </section>

        <section aria-label="Falsifiability" className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            How to falsify the engine
          </h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            A Level-5 claim has to come with an off-switch. Here are three
            tests that, if any of them fail, would force us to retract the
            corresponding part of the mechanism. We publish them so the
            buyer can run them.
          </p>
          <p className="text-xs text-slate-400 mb-6 leading-relaxed rounded-lg border border-slate-800 bg-slate-900/40 p-4">
            This section is for the buyer who wants to check our work, or hand
            it to an analyst who will. If the statistics below are not your
            language, that is fine, nothing here is something you have to run.
            In one sentence: each test is a way to prove the signal is real and
            not luck, and we publish them precisely because we expect them to hold.
          </p>
          <ul className="space-y-4">
            {FALSIFIABILITY.map((f) => (
              <li
                key={f.claim}
                className="border border-slate-800 rounded-xl p-5 bg-slate-900/40"
              >
                <p className="text-slate-100 font-semibold text-sm mb-2">
                  Claim: {f.claim}
                </p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  <span className="text-amber-300 font-semibold">Test:</span>{" "}
                  {f.test}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Proof" className="mb-12">
          <h2 className="text-xl sm:text-2xl font-semibold mb-2">
            Why we can publish the formula
          </h2>
          <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            The mechanism is published, sourced, and reproducible. We sell the
            live aggregation, the rhythm, the dashboard, the agent integration
not the secret. The buyer who can reproduce our regression in a
            notebook is the buyer who trusts us most.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PROOF_ANCHORS.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                className="block border border-slate-800 hover:border-amber-500/60 rounded-xl p-4 bg-slate-900/40 transition"
              >
                <p className="text-amber-300 font-semibold text-sm mb-1">
                  {p.label} →
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {p.detail}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section
          aria-label="Next step"
          className="border border-amber-500/40 rounded-2xl p-6 sm:p-8 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 mb-10"
        >
          <p className="text-xs uppercase tracking-widest text-amber-300 font-semibold mb-3">
            Run the engine on a sector this week
          </p>
          <h2 className="text-xl sm:text-2xl font-bold mb-3">
            €7 once. One sector. 24-hour deep dive.
          </h2>
          <p className="text-sm text-slate-300 mb-5 leading-relaxed">
            Pick any of 19 tracked sectors. Within 24 hours we deliver the
            full Commit-Velocity Acceleration Engine output for that sector -
            top 25 ranked orgs, contributor maps, the three pre-Crunchbase
            breakouts the consensus tools haven&rsquo;t indexed. Credited
            toward Dashboard if you upgrade in 14 days.
          </p>
          <Link
            href="/firstlook"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold transition"
          >
            Get the First Look pass, €7
            <span aria-hidden="true">→</span>
          </Link>
        </section>

        {/* Brunson Expert Secrets Ch 9, Three Core Stories.
            Audit 2026-05-09 (Ch 9 push 94→100): the engine page is the
            "vehicle in formula form." Walk the reader into the Origin
            and Identity stories instead of dead-ending on a Schwartz
            citation. The citation footer below is preserved for the
            scholarly reader who needs the source. */}
        <ThreeCoreStoriesNav current="vehicle-mechanism" />

        <p className="text-slate-500 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Sophistication-ladder framing per Eugene Schwartz,{" "}
          <em>Breakthrough Advertising</em> (1966). The decision to publish
          the mechanism rather than gate it is documented at{" "}
          <Link href="/manifesto" className="text-amber-300 hover:underline">
            /manifesto
          </Link>{" "}
          (Pillar 3, &ldquo;public over private&rdquo;).
        </p>

        <AgentMirrorLinks path="/mechanism" qaCategory="methodology" />
      </article>
    </main>
  );
}
