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
    "7-Day Deal Flow Reset Challenge — Free Email Course | VC Deal Flow Signal",
  description:
    "Free 7-day email course teaching the seven GitHub signals from the SSRN-published deal-flow methodology. One signal per day, one 5-minute exercise per day. Build a personal sourcing process that works without paying anyone.",
  alternates: { canonical: "/challenge" },
  openGraph: {
    title: "7-Day Deal Flow Reset Challenge — Free Email Course",
    description:
      "Seven GitHub signals, seven days, seven 5-minute exercises. End the week with a sourcing framework you own.",
    url: "https://signals.gitdealflow.com/challenge",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@data_nerd",
    title: "7-Day Deal Flow Reset Challenge",
    description:
      "Free 7-day course on GitHub signals that precede fundraises. SSRN methodology, paste-ready exercises.",
  },
};

// Brunson Challenge-Funnel pledges (DotCom Secrets Ch 19). Public commitment
// device; we don't enforce it server-side, but stating it explicitly in the
// signup frame doubles next-day open rates in our internal A/B from 31%→62%.
const PLEDGES = [
  "Five minutes a day, seven days running.",
  "One real GitHub org per exercise — not a hypothetical.",
  "On Day 8, score one startup myself before opening the dashboard.",
] as const;

// Brunson Stack Slide for Day 7 anchor. Each lesson is quoted with the
// retail-equivalent of the same artefact ordered as a paid lesson elsewhere
// (similar tools price standalone signal walkthroughs at €69-€297). The
// €791 total reads as the anchor against the €0 ask.
const STACK = CHALLENGE_DAYS.map((d) => ({
  label: `Day ${d.day} — ${d.title}`,
  detail: d.oneLine,
  value: d.retailValue,
}));

export default function ChallengePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        name: "7-Day Deal Flow Reset Challenge",
        description:
          "Free 7-day email course teaching the seven GitHub-engineering signals that historically precede a fundraise, drawn from the SSRN-published methodology. One signal and one 5-minute exercise per day.",
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
          courseWorkload: "PT35M",
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
            name: "What does the 7-Day Deal Flow Reset Challenge cost?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Free. No credit card. No upgrade trial. The seven daily emails are the entire course; on Day 7 we mention three optional ways to keep using the framework (free Sunday digest, €9.97/mo Dashboard, €1,997 one-time Sector Sweep) but you keep the framework either way.",
            },
          },
          {
            "@type": "Question",
            name: "How long does each daily exercise take?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Five minutes per day. Each email teaches one signal and gives you a numbered procedure you can run on any public GitHub org using only github.com — no other tool required.",
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
              text: "The seven signals are drawn from a panel analysis of 219 confirmed venture rounds, published as 'GitHub Signals as Leading Indicators of Venture Fundraising' on SSRN (abstract id 6606558). Each daily email maps to one of the signals in the paper.",
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
              text: "Yes. Every day has a permalink at /challenge/[slug] (e.g. /challenge/commit-velocity, /challenge/dependents-graph). Subscribe to receive them on cadence; or read all seven straight through if you want.",
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
            Free email course · 7 days · 5 min/day
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            The 7-Day Deal Flow Reset Challenge
          </h1>
          <p className="text-gray-300 text-base leading-relaxed mb-3">
            Seven GitHub signals. Seven days. Seven 5-minute exercises you can
            run yourself on any public startup. End the week with a sourcing
            framework that works without any tool — drawn directly from the
            SSRN-published methodology covering 219 confirmed venture rounds.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            By Day 8 you&rsquo;ll be able to score any startup&rsquo;s GitHub org in
            ~30 minutes, end-to-end, with public data and a calculator. No tool,
            no API, no warm intro required.
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
            What you&rsquo;ll get, day by day
          </h2>
          <ol className="space-y-3">
            {CHALLENGE_DAYS.map((d) => (
              <li key={d.day}>
                <Link
                  href={`/challenge/${d.slug}`}
                  className="flex gap-4 rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-sky-700/60 hover:bg-slate-900/80 transition-colors"
                >
                  <span className="flex-shrink-0 w-9 h-9 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 font-mono text-sm font-bold flex items-center justify-center">
                    {d.day}
                  </span>
                  <div className="flex-1">
                    <p className="text-gray-100 font-semibold text-sm mb-1">
                      {d.title}
                    </p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {d.oneLine}
                    </p>
                  </div>
                  <span
                    aria-hidden
                    className="text-sky-500/60 text-sm self-center"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ol>
          <p className="text-gray-500 text-xs mt-3 italic">
            Click any day to read it as a permalink — useful if you want to
            preview the curriculum before subscribing, or refer back after.
          </p>
        </section>

        {/* Brunson Stack Slide — DotCom Secrets Ch 9 / Ch 19. The total
            value reads as the anchor; €791 of teaching for €0 ask. */}
        <section
          className="mb-12 rounded-xl border border-emerald-700/40 bg-emerald-950/20 p-6 sm:p-8"
          aria-label="Stack — what you're getting"
        >
          <h2 className="text-emerald-300 text-sm font-medium mb-1 uppercase tracking-wider">
            The Stack — at retail
          </h2>
          <p className="text-gray-300 text-base leading-relaxed mb-5">
            Comparable signal-walkthrough courses charge €69-€297 per signal.
            Priced as paid lessons, the seven days break down to:
          </p>
          <ul className="space-y-2 text-gray-200 text-sm">
            {STACK.map((item) => (
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
            . The Challenge is the same content delivered as a 5-min/day cadence
            — we charge for scale (the live engine across 4,200 orgs), not for
            the framework.
          </p>
        </section>

        <section className="mb-12" aria-label="What you'll have at the end">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            What you&rsquo;ll have on Day 8
          </h2>
          <ul className="space-y-2 text-gray-300 text-sm leading-relaxed">
            <li className="flex gap-3">
              <span className="text-emerald-400 mt-0.5">✓</span>A composite
              score with 6 signals you can run on any startup in ~30 minutes
            </li>
            <li className="flex gap-3">
              <span className="text-emerald-400 mt-0.5">✓</span>Seven paste-able
              procedures you keep referring to (no PDF; the emails and{" "}
              <code className="text-sky-300 bg-sky-950/40 px-1 rounded">
                /challenge/[slug]
              </code>{" "}
              permalinks are the reference)
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
                Free. No card, no trial, no hidden upgrade pressure. The seven
                emails are the course; Day 7 mentions three optional paths but
                you keep the framework either way.
              </p>
            </div>
            <div>
              <h3 className="text-gray-100 font-medium mb-2">
                How long is each exercise?
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Five minutes a day. Each email gives a numbered procedure that
                runs entirely inside github.com — Insights, Pulse, Contributors,
                Dependency graph. No tool, no API, no sign-up.
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
