import type { Metadata } from "next";
import Link from "next/link";
import ChallengeForm from "./ChallengeForm";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

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

const CURRICULUM = [
  {
    day: 1,
    title: "Commit velocity",
    detail:
      "The simplest acceleration signal. 14d-vs-90d ratio, sustained vs. spike, single-repo vs. org-level read.",
  },
  {
    day: 2,
    title: "Contributor diversity",
    detail:
      "Why a single-bus-factor codebase tanks the round. Gini coefficient at month -3, the 4-contributor floor.",
  },
  {
    day: 3,
    title: "Dependents graph",
    detail:
      "GitHub's hidden dependents page. The cheapest external-adoption proxy. Cross-portfolio warm-intro vector.",
  },
  {
    day: 4,
    title: "README freshness",
    detail:
      "The under-rated leading indicator. Substantive-diff filter. The 'Funding' section that just appeared.",
  },
  {
    day: 5,
    title: "New repo creation rate",
    detail:
      "The platform-buildout tell. SDK / CLI / example-app pattern. The 'deploying capital' signal.",
  },
  {
    day: 6,
    title: "Issue-to-PR ratio",
    detail:
      "Engagement vs. shipping. Why a 1.5+ ratio is healthy and a 0.7 ratio means the round is firefighting.",
  },
  {
    day: 7,
    title: "The composite + the fast version",
    detail:
      "Compose all six signals into one score. Then see how it runs across 4,200 venture-backed orgs in 4 seconds.",
  },
];

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
        syllabusSections: CURRICULUM.map((d) => ({
          "@type": "Syllabus",
          name: `Day ${d.day} — ${d.title}`,
          description: d.detail,
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
            Free email course
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            The 7-Day Deal Flow Reset Challenge
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            Seven GitHub signals. Seven days. Seven 5-minute exercises you can
            run yourself on any public startup. End the week with a sourcing
            framework that works without any tool — drawn directly from the
            SSRN-published methodology covering 219 confirmed venture rounds.
          </p>
        </header>

        <div className="mb-10">
          <ChallengeForm />
        </div>

        <section className="mb-12" aria-label="Curriculum">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            What you&rsquo;ll get, day by day
          </h2>
          <ol className="space-y-3">
            {CURRICULUM.map((d) => (
              <li
                key={d.day}
                className="flex gap-4 rounded-lg border border-slate-800 bg-slate-900 p-4"
              >
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 font-mono text-sm font-bold flex items-center justify-center">
                  {d.day}
                </span>
                <div>
                  <p className="text-gray-100 font-semibold text-sm mb-1">
                    {d.title}
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {d.detail}
                  </p>
                </div>
              </li>
            ))}
          </ol>
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
              procedures you keep referring to (no PDF; the emails are the
              reference)
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
                <em>GitHub Signals as Leading Indicators of Venture
                Fundraising</em>{" "}
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
