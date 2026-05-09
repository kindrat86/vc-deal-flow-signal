import type { Metadata } from "next";
import Link from "next/link";
import ChallengeForm from "./ChallengeForm";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import {
  CHALLENGE_DAYS,
  CHALLENGE_TOTAL_RETAIL_VALUE,
} from "@/content/challenge-curriculum";

export const metadata: Metadata = {
  title:
    "30-Day Deal Flow Reset Challenge — Free Email Course | VC Deal Flow Signal",
  description:
    "Free 30-day email course. Week 1 teaches the 7 GitHub signals from the SSRN methodology. Weeks 2-4 build your operational sourcing system: watchlist, weekly rhythm, alerts, MCP integration. ~10 min/day; the framework stays yours either way.",
  alternates: { canonical: "/challenge" },
  openGraph: {
    title: "30-Day Deal Flow Reset Challenge — Free Email Course",
    description:
      "Four weeks. Week 1 — Learn the 7 signals. Week 2 — Apply on real candidates. Week 3 — Synthesize the watchlist + cadence. Week 4 — Operationalize alerts, sharing, MCP integration. The framework is yours either way.",
    url: "https://signals.gitdealflow.com/challenge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@data_nerd",
    title: "30-Day Deal Flow Reset Challenge",
    description:
      "Free 30-day course building a real sourcing system from public GitHub data. SSRN methodology, paste-ready procedures.",
  },
};

// Public-pledge commitment device. Stating the pledge before signup
// has roughly doubled next-day open rates in our internal A/B (31%→62%).
const PLEDGES = [
  "5-10 minutes a day, 30 days running.",
  "One real GitHub org per exercise — not a hypothetical.",
  "On Day 31, the Sunday digest rhythm continues; the framework is mine to keep.",
] as const;

// Stack-Slide for the Day 30 close. Each lesson is priced at the
// retail-equivalent of the same artefact ordered as a paid lesson elsewhere
// (similar tools price standalone signal walkthroughs at €39-€297). The
// total reads as the anchor against the €0 ask. To keep the landing
// readable the stack is grouped by week rather than line-by-line over 30
// rows; the per-day retail breakdown is preserved in the email Day-30
// graduation pitch.
const STACK_BY_WEEK: { label: string; detail: string; value: number }[] = [
  {
    label: "Week 1 — Learn (Days 1-7)",
    detail:
      "Each of the 7 atomic signals: commit velocity, contributor diversity, dependents graph, README freshness, new repo creation, issue-to-PR ratio, composite scoring.",
    value: CHALLENGE_DAYS.filter((d) => d.phase === "learn").reduce(
      (s, d) => s + d.retailValue,
      0,
    ),
  },
  {
    label: "Week 2 — Apply (Days 8-14)",
    detail:
      "Score 3 real candidates from your pipeline + 1 calibration backtest + your first scorecard artifact.",
    value: CHALLENGE_DAYS.filter((d) => d.phase === "apply").reduce(
      (s, d) => s + d.retailValue,
      0,
    ),
  },
  {
    label: "Week 3 — Synthesize (Days 15-21)",
    detail:
      "Build a 10-org watchlist, set the Monday rhythm, sector batching, score-driven founder Q&A, the 30-second pre-read.",
    value: CHALLENGE_DAYS.filter((d) => d.phase === "synthesize").reduce(
      (s, d) => s + d.retailValue,
      0,
    ),
  },
  {
    label: "Week 4 — Operationalize (Days 22-30)",
    detail:
      "Alerts, anti-signals, co-investor share template, MCP integration, custom weights, retrospective, graduation.",
    value: CHALLENGE_DAYS.filter((d) => d.phase === "operationalize").reduce(
      (s, d) => s + d.retailValue,
      0,
    ),
  },
];

export default function ChallengePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        name: "30-Day Deal Flow Reset Challenge",
        description:
          "Free 30-day email course building a real sourcing system from public GitHub data. Week 1 teaches the 7 atomic signals (drawn from the SSRN-published panel of 219 confirmed venture rounds). Weeks 2-4 apply the framework, build a continuous watchlist, and operationalize alerts plus MCP integration. ~10 minutes per day; the framework stays yours either way.",
        provider: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
          sameAs: [
            "https://ssrn.com/abstract=6606558",
            "https://signals.gitdealflow.com",
          ],
        },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "Online",
          courseWorkload: "PT5H", // ~10 min × 30 days
          inLanguage: "en-US",
        },
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
        },
        syllabusSections: CHALLENGE_DAYS.map((d) => ({
          "@type": "Syllabus",
          name: `Day ${d.day} — ${d.title}`,
          description: d.oneLine,
          url: `https://signals.gitdealflow.com/challenge/${d.slug}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "All Sectors",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Challenge",
            item: "https://signals.gitdealflow.com/challenge",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "What does the 30-Day Deal Flow Reset Challenge cost?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Free. No credit card. No upgrade trial. Thirty daily emails are the entire course; on Day 30 we mention three optional ways to keep using the system (free Sunday digest, €9.97/mo Dashboard, €1,997 one-time Sector Sweep) but you keep the framework either way.",
            },
          },
          {
            "@type": "Question",
            name: "How long does each daily exercise take?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Roughly 5-10 minutes per day. Week 1 (Learn) is a tight 5 min/day teaching one signal at a time. Weeks 2-4 (Apply, Synthesize, Operationalize) run 10-15 min/day as you score real candidates, build a watchlist, set alerts, and integrate the framework into your weekly rhythm. Total commitment: ~5 hours over 30 days.",
            },
          },
          {
            "@type": "Question",
            name: "Do I need to know how to code?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "No. The exercises use only the public GitHub web interface — Insights, Pulse, Contributors, Dependency graph. If you've ever opened a repository on github.com you have everything you need.",
            },
          },
          {
            "@type": "Question",
            name: "What's the source of the methodology?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The seven Week-1 signals are drawn from a panel analysis of 219 confirmed venture rounds, published as 'GitHub Signals as Leading Indicators of Venture Fundraising' on SSRN (abstract id 6606558). Weeks 2-4 (Apply, Synthesize, Operationalize) extend that framework into the operational practice an investor would build around it — calibration, watchlist cadence, alerting, custom weights, MCP-server integration.",
            },
          },
          {
            "@type": "Question",
            name: "How is this different from the Sunday digest?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "The Sunday digest is the ongoing free product — five named startups every week, applied. The Challenge is the framework — it teaches you the underlying signals so you can run the analysis yourself on any startup, not just the ones we name.",
            },
          },
          {
            "@type": "Question",
            name: "Can I read each day as a webpage instead of waiting for email?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. Every day has a permalink at /challenge/[slug] (e.g. /challenge/commit-velocity, /challenge/score-candidate-one, /challenge/mcp-integration). Subscribe to receive them on cadence; or read all 30 straight through if you want.",
            },
          },
          {
            "@type": "Question",
            name: "How is the Challenge structured across 30 days?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Week 1 (Days 1-7) — Learn: each of the 7 atomic signals individually with a 5-minute manual exercise. Week 2 (Days 8-14) — Apply: run the composite on three real candidates from your own pipeline plus one calibration backtest. Week 3 (Days 15-21) — Synthesize: build a 10-org watchlist, set the Monday rhythm, sector batching, and the 30-second pre-read for first meetings. Week 4 (Days 22-30) — Operationalize: alerts, anti-signals, co-investor share template, MCP integration, custom weights, retrospective, graduation. Each phase ends with a wrap day that produces a real artifact.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <AgentMirrorLinks path="/challenge" qaCategory="methodology" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Challenge</span>
        </nav>

        <header className="mb-8">
          <p className="text-sky-400 text-sm font-medium mb-3 uppercase tracking-wider">
            Free email course · 30 days · ~10 min/day
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            The 30-Day Deal Flow Reset Challenge
          </h1>
          <p className="text-gray-300 text-base leading-relaxed mb-3">
            Four weeks. Seven GitHub signals in Week 1. Three real-pipeline
            candidates in Week 2. A 10-org watchlist + weekly Monday rhythm in
            Week 3. Alerts, MCP integration, and a custom-weighted composite in
            Week 4. End the month with an operational sourcing system that runs
            in ~25 minutes a week — drawn from the SSRN-published methodology
            covering 219 confirmed venture rounds.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            By Day 31 you&rsquo;ll have a watchlist, a personal heuristic for
            your beat, an alerting layer, an MCP integration, and a 30-day
            retrospective on what the framework actually caught. No tool, no
            API, no warm intro required for the manual version.
          </p>
        </header>

        <div className="mb-10">
          <ChallengeForm />
        </div>

        {/* Brunson commitment device — public pledge framing. */}
        <section
          className="mb-12 rounded-xl border border-amber-700/40 bg-amber-950/20 p-6 sm:p-8"
          aria-label="Pledge"
        >
          <h2 className="text-amber-300 text-sm font-medium mb-3 uppercase tracking-wider">
            What you&rsquo;re committing to
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            This challenge works because you do the work, not because we email
            you well. Three pledges before you start:
          </p>
          <ul className="space-y-2 text-gray-200 text-sm leading-relaxed">
            {PLEDGES.map((pledge) => (
              <li key={pledge} className="flex gap-3">
                <span className="text-amber-400 mt-0.5">→</span>
                <span>{pledge}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12" aria-label="Curriculum">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            What you&rsquo;ll get, week by week
          </h2>
          {(["learn", "apply", "synthesize", "operationalize"] as const).map(
            (phase) => {
              const days = CHALLENGE_DAYS.filter((cd) => cd.phase === phase);
              const week = ["learn", "apply", "synthesize", "operationalize"].indexOf(phase) + 1;
              const phaseTitle = {
                learn: "Learn — the 7 atomic signals",
                apply: "Apply — composite on real candidates",
                synthesize: "Synthesize — watchlist + cadence",
                operationalize: "Operationalize — alerts + share + MCP",
              }[phase];
              return (
                <details
                  key={phase}
                  className="mb-3 rounded-lg border border-slate-800 bg-slate-900/60 group"
                  open={phase === "learn"}
                >
                  <summary className="cursor-pointer px-5 py-3 flex items-center justify-between hover:bg-slate-900 rounded-lg">
                    <span>
                      <span className="text-sky-400 text-xs font-mono uppercase tracking-wider mr-3">
                        Week {week}
                      </span>
                      <span className="text-gray-100 text-sm font-semibold">
                        {phaseTitle}
                      </span>
                    </span>
                    <span className="text-gray-500 text-xs font-mono">
                      Days {days[0]?.day}-{days[days.length - 1]?.day}
                    </span>
                  </summary>
                  <ol className="space-y-2 px-5 pb-4 pt-2">
                    {days.map((d) => (
                      <li key={d.day}>
                        <Link
                          href={`/challenge/${d.slug}`}
                          className="flex gap-3 rounded-lg border border-slate-800 bg-slate-950/60 p-3 hover:border-sky-700/60 hover:bg-slate-900/80 transition-colors"
                        >
                          <span className="flex-shrink-0 w-7 h-7 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 font-mono text-xs font-bold flex items-center justify-center">
                            {d.day}
                          </span>
                          <div className="flex-1">
                            <p className="text-gray-100 font-medium text-sm">
                              {d.title}
                            </p>
                            <p className="text-gray-400 text-xs leading-relaxed">
                              {d.oneLine}
                            </p>
                          </div>
                          <span
                            aria-hidden
                            className="text-sky-500/60 text-xs self-center"
                          >
                            →
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ol>
                </details>
              );
            },
          )}
          <p className="text-gray-500 text-xs mt-3 italic">
            Click any day to read it as a permalink — useful if you want to
            preview the curriculum before subscribing, or refer back after.
          </p>
        </section>

        {/* Stack-Slide for the Day-30 anchor. The total reads as the
            value-vs-price contrast; ~€2,800 of teaching + practice for €0
            ask. */}
        <section
          className="mb-12 rounded-xl border border-emerald-700/40 bg-emerald-950/20 p-6 sm:p-8"
          aria-label="Stack — what you're getting"
        >
          <h2 className="text-emerald-300 text-sm font-medium mb-1 uppercase tracking-wider">
            The Stack — at retail
          </h2>
          <p className="text-gray-300 text-base leading-relaxed mb-5">
            Comparable signal-walkthrough + applied-practice courses charge
            €69-€297 per lesson. Priced as paid lessons across the four
            phases, the 30 days break down to:
          </p>
          <ul className="space-y-2 text-gray-200 text-sm">
            {STACK_BY_WEEK.map((item) => (
              <li
                key={item.label}
                className="flex justify-between gap-4 border-b border-emerald-900/40 pb-2"
              >
                <div className="flex-1">
                  <p className="text-gray-100 font-medium">{item.label}</p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {item.detail}
                  </p>
                </div>
                <span className="text-emerald-300 font-mono text-sm self-start whitespace-nowrap">
                  €{item.value}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-5 pt-4 border-t border-emerald-700/40 flex justify-between items-baseline">
            <span className="text-gray-300 text-sm">Total retail value</span>
            <span className="text-emerald-200 font-mono text-lg font-semibold">
              €{CHALLENGE_TOTAL_RETAIL_VALUE}
            </span>
          </div>
          <div className="mt-2 flex justify-between items-baseline">
            <span className="text-gray-300 text-sm">Your ask</span>
            <span className="text-emerald-300 font-mono text-2xl font-bold">
              €0
            </span>
          </div>
          <p className="text-gray-500 text-xs mt-4 italic leading-relaxed">
            Free because the methodology is published (CC BY 4.0) at{" "}
            <a
              href="https://ssrn.com/abstract=6606558"
              target="_blank"
              rel="noopener"
              className="text-emerald-400 hover:text-emerald-300 underline decoration-dotted"
            >
              ssrn.com/abstract=6606558
            </a>
            . The Challenge delivers the framework as a 30-day cadence and
            adds the operational practice around it — we charge for scale (the
            live engine across 4,200 orgs and the custom Sector Sweep), not for
            the framework.
          </p>
        </section>

        <section className="mb-12" aria-label="What you'll have at the end">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            What you&rsquo;ll have on Day 31
          </h2>
          <ul className="space-y-2 text-gray-300 text-sm leading-relaxed">
            <li className="flex gap-3">
              <span className="text-emerald-400 mt-0.5">✓</span>A composite
              score with 7 atomic signals you can run on any public GitHub org
              in ~5 minutes (or 30 seconds via the MCP integration)
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 mt-0.5">✓</span>Thirty
              paste-able procedures you keep referring to (no PDF; the emails
              and{" "}
              <code className="text-sky-300 bg-sky-950/40 px-1 rounded">
                /challenge/[slug]
              </code>{" "}
              permalinks are the reference)
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 mt-0.5">✓</span>A 10-org
              watchlist with weekly Monday rhythm, plus a calibration backtest
              and a 30-day retrospective on what the framework actually caught
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 mt-0.5">✓</span>A custom-weighted
              composite calibrated to your beat, plus an alerting layer and a
              co-investor share template
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 mt-0.5">✓</span>The exact same
              framework that powers the GitDealFlow ranking — open methodology,
              re-derivable from public GitHub data
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 mt-0.5">✓</span>Three optional
              next steps if you want to scale the framework: free Sunday
              digest, €9.97/mo Dashboard, €1,997 one-time Sector Sweep — no
              upgrade pressure if you keep it manual
            </li>
          </ul>
        </section>

        <section className="mb-12" aria-label="FAQ">
          <h2 className="text-gray-100 font-semibold text-lg mb-6">FAQ</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-gray-100 font-medium mb-2">
                What does the Challenge cost?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Free. No card, no trial, no hidden upgrade pressure. Thirty
                emails are the course; Day 30 mentions three optional paths
                but you keep the framework either way.
              </p>
            </div>
            <div>
              <h3 className="text-gray-100 font-medium mb-2">
                How long is each exercise?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                ~5-10 minutes a day. Week 1 is tight 5-min walkthroughs of one
                signal each. Weeks 2-4 stretch to 10-15 min/day as you score
                real candidates and build the watchlist + alerting + share
                template + MCP integration.
              </p>
            </div>
            <div>
              <h3 className="text-gray-100 font-medium mb-2">
                Do I need to code?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                No. If you have ever opened a repo on github.com, you have
                everything you need. The exercises read what is already on
                screen and combine simple counts.
              </p>
            </div>
            <div>
              <h3 className="text-gray-100 font-medium mb-2">
                Where is the methodology from?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Panel analysis of 219 confirmed venture rounds, published as{" "}
                <em>
                  GitHub Signals as Leading Indicators of Venture Fundraising
                </em>{" "}
                on SSRN (abstract id 6606558). Each daily email maps to one
                signal in the paper.
              </p>
            </div>
            <div>
              <h3 className="text-gray-100 font-medium mb-2">
                How is this different from the Sunday digest?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The Sunday digest is the applied product — five named startups
                every week. The Challenge is the framework — the underlying
                signals so you can run the analysis yourself on any startup,
                not only the ones we surface.
              </p>
            </div>
            <div>
              <h3 className="text-gray-100 font-medium mb-2">
                Can I read each day as a webpage instead?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Yes. Every day has a permalink — see the day-by-day list above,
                or jump straight to{" "}
                <Link
                  href="/challenge/commit-velocity"
                  className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
                >
                  /challenge/commit-velocity
                </Link>
                . Subscribe to receive them on cadence, or read all seven
                straight through.
              </p>
            </div>
          </div>
        </section>

        <p className="text-xs text-gray-400 text-center">
          Methodology:{" "}
          <Link
            href="/methodology"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            /methodology
          </Link>{" "}
          · Paper:{" "}
          <a
            href="https://ssrn.com/abstract=6606558"
            target="_blank"
            rel="noopener"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            ssrn.com/abstract=6606558
          </a>
        </p>
      </div>
    </>
  );
}
