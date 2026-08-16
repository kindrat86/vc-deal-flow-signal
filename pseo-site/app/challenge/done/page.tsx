import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { CHALLENGE_DAYS } from "@/content/challenge-curriculum";

export const metadata: Metadata = {
  title:
    "You finished the 30-Day Reset, what's next",
  description:
    "Graduation page for the 30-Day Deal Flow Reset Challenge. Three optional ways to keep using the system: free Sunday digest, €9.97/mo Dashboard, €1,997 one-time Sector Sweep. The framework + your watchlist + custom weights stay yours either way.",
  alternates: { canonical: "/challenge/done" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "You finished the 30-Day Reset, what's next",
    description:
      "Three optional ways to keep using the system. Pick none of them and you still own it.",
    url: "https://signals.gitdealflow.com/challenge/done",
    type: "article",
  },
};

// Stack-Slide close for the Day-30 graduation. Three rungs of the value
// ladder, free, founding-rate Dashboard, one-time Sector Sweep, each
// priced against the standalone retail equivalent. Total stacked retail
// anchors the €9.97/mo founding-rate ask at ~50× value-to-price.
const RUNGS = [
  {
    rung: "Rung 0",
    name: "Free Sunday Digest",
    price: "Free, forever",
    headline: "Five named startups every Sunday, applied, not theoretical.",
    deliverables: [
      "5 named GitHub orgs surfacing this week, scored against the same 7-signal composite you just learned",
      "14-day acceleration delta + sector + stage tag for each",
      "Direct GitHub URL, click through and run the manual exercise",
      "Unsubscribe with a reply. No card, no upgrade pressure.",
    ],
    standaloneValue: 0,
    cta: "Subscribe (free)",
    href: "https://gitdealflow.com/#signup",
    tone: "slate" as const,
  },
  {
    rung: "Rung 1",
    name: "Dashboard",
    price: "€9.97/mo founding rate",
    headline:
      "The 7-signal composite, computed continuously across 400+ startup orgs.",
    deliverables: [
      "400+ venture-backed startups ranked by 14-day commit-velocity acceleration, refreshed every Monday at 06:00 UTC",
      "Filter by sector, stage, geography",
      "The 219-startup panel dataset, five quarters of historical signal-to-fundraise pairs",
      "Two free Chrome extensions (Crunchbase + Wellfound badge; VC GitHub Lookup)",
      "Free MCP server with 6 read-only tools (Claude, Cursor, Windsurf, any MCP host)",
      "30-day Signal-or-It's-Free guarantee, reply REFUND, no questions",
    ],
    standaloneValue: 1431, // 348 + 297 + 198 + 588 (sum of Perfect-Webinar Stack)
    cta: "Upgrade to Dashboard",
    href: "/pricing#dashboard",
    tone: "sky" as const,
    primary: true,
  },
  {
    rung: "Rung 2",
    name: "Custom Sector Sweep",
    price: "€1,997 one-time",
    headline:
      "Pick one sector. We deliver the 40-page written deep-dive in 5 business days.",
    deliverables: [
      "40-page written deep-dive on the one sector you pick",
      "Top 25 ranked GitHub orgs by 14-day acceleration",
      "Three pre-Crunchbase breakouts named + thesis-tagged",
      "Raw CSV (every org × every metric)",
      "Async Q&A with the methodology team for 30 days post-delivery",
      "Capped at 8 per quarter, bandwidth, not artificial scarcity",
    ],
    standaloneValue: 4970,
    cta: "Book a Sector Sweep",
    href: "/sector-sweep",
    tone: "amber" as const,
  },
] as const;

const TONE_CLASSES = {
  slate: {
    border: "border-slate-700/60",
    bg: "bg-slate-900/40",
    label: "text-slate-300",
    button:
      "bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-600",
  },
  sky: {
    border: "border-sky-600/60",
    bg: "bg-sky-950/30",
    label: "text-sky-300",
    button: "bg-signal-500 hover:bg-signal-400 text-slate-950 font-semibold",
  },
  amber: {
    border: "border-amber-700/60",
    bg: "bg-amber-950/20",
    label: "text-amber-300",
    button:
      "bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold",
  },
} as const;

export default function ChallengeDonePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        name: "You finished the 30-Day Deal Flow Reset",
        description:
          "Graduation page with three optional next steps after the 30-day Challenge: free Sunday digest, founding-rate Dashboard at €9.97/mo, or a one-time Sector Sweep at €1,997.",
        url: "https://signals.gitdealflow.com/challenge/done",
        isPartOf: {
          "@type": "Course",
          name: "30-Day Deal Flow Reset Challenge",
          url: "https://signals.gitdealflow.com/challenge",
        },
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
          {
            "@type": "ListItem",
            position: 3,
            name: "Graduation",
            item: "https://signals.gitdealflow.com/challenge/done",
          },
        ],
      },
    ],
  };

  return (
    <>
      <AgentMirrorLinks path="/challenge/done" qaCategory="methodology" />
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
          <Link
            href="/challenge"
            className="hover:text-gray-300 transition-colors"
          >
            Challenge
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Graduation</span>
        </nav>

        <header className="mb-10">
          <p className="text-emerald-400 text-sm font-medium mb-3 uppercase tracking-wider">
            Day 31 · System complete
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            You finished. The system is yours.
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">
            Thirty days. Seven atomic signals. Three real-pipeline candidates
            scored. A 10-org watchlist. A Monday rhythm. Alerts. A custom-weighted
            composite calibrated to your beat. An MCP integration that runs the
            whole thing from your editor. The next section is optional, three
            ways to scale the system if the manual cadence doesn&rsquo;t fit
            anymore. Pick none of them and the system still works.
          </p>
        </header>

        {/* What you just learned, recap chips. */}
        <section className="mb-10" aria-label="What you learned">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            The 30 days, at a glance
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {CHALLENGE_DAYS.map((d) => (
              <Link
                key={d.day}
                href={`/challenge/${d.slug}`}
                className="flex gap-3 rounded-lg border border-slate-800 bg-slate-900/60 hover:border-slate-700 px-4 py-3 transition-colors"
              >
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold flex items-center justify-center">
                  {d.day}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-100 text-sm font-medium truncate">
                    {d.title}
                  </p>
                  <p className="text-gray-500 text-xs truncate">{d.oneLine}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* The three optional rungs, Brunson Stack-Slide close. */}
        <section className="mb-10" aria-label="Three optional next steps">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Three optional next steps
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Stacked from least to most committed. Compare the standalone retail
            value of each rung against its price, the founding rate on the
            Dashboard is locked for life and never re-priced retroactively.
          </p>
          <div className="space-y-5">
            {RUNGS.map((r) => {
              const tone = TONE_CLASSES[r.tone];
              const isPrimary = "primary" in r && r.primary;
              return (
                <article
                  key={r.rung}
                  className={`rounded-xl border ${tone.border} ${tone.bg} p-6 sm:p-7 ${
                    isPrimary ? "ring-1 ring-sky-500/30" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                    <div>
                      <p
                        className={`${tone.label} text-xs font-medium uppercase tracking-wider mb-1`}
                      >
                        {r.rung}
                        {isPrimary ? " · Most pick this" : ""}
                      </p>
                      <h3 className="text-gray-100 font-semibold text-xl">
                        {r.name}
                      </h3>
                    </div>
                    <p className={`${tone.label} font-mono text-sm font-bold`}>
                      {r.price}
                    </p>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {r.headline}
                  </p>
                  <ul className="space-y-2 mb-5 text-gray-300 text-sm leading-relaxed">
                    {r.deliverables.map((line) => (
                      <li key={line} className="flex gap-3">
                        <span className="text-emerald-400 mt-0.5 flex-shrink-0">
                          ✓
                        </span>
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                  {r.standaloneValue > 0 ? (
                    <p className="text-gray-500 text-xs mb-4 italic">
                      Standalone retail value of the components:{" "}
                      <span className="text-gray-300 font-mono">
                        €{r.standaloneValue.toLocaleString()}
                      </span>
                      .
                    </p>
                  ) : null}
                  <Link
                    href={r.href}
                    className={`inline-flex items-center justify-center px-5 py-2.5 rounded-md ${tone.button} text-sm transition-colors`}
                  >
                    {r.cta} →
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        {/* Brunson "What if you do nothing" honest framing. */}
        <section
          className="mb-10 rounded-xl border border-slate-700/60 bg-slate-900/40 p-6 sm:p-8"
          aria-label="What if you pick none of these"
        >
          <h2 className="text-gray-100 font-semibold text-lg mb-3">
            What if you pick none of these?
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            Then nothing changes. The seven emails are yours. The seven{" "}
            <code className="text-sky-300 bg-sky-950/40 px-1 rounded">
              /challenge/[slug]
            </code>{" "}
            permalinks stay live and indexed. The methodology is published
            CC BY 4.0 at{" "}
            <a
              href="https://ssrn.com/abstract=6606558"
              target="_blank"
              rel="noopener"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              ssrn.com/abstract=6606558
            </a>{" "}
            so you can re-derive every metric from public GitHub data
            indefinitely.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            We charge for scale (the live engine across 400+ orgs and the
            custom Sector Sweep), not for the framework. If the manual version
            fits you, the manual version is genuinely the right answer.
          </p>
        </section>

        {/* Re-engagement loop, refer a friend. */}
        <section
          className="mb-10 rounded-xl border border-amber-700/40 bg-amber-950/20 p-6 sm:p-8"
          aria-label="Refer a friend"
        >
          <h2 className="text-amber-300 text-sm font-medium mb-3 uppercase tracking-wider">
            One ask
          </h2>
          <p className="text-gray-200 text-base leading-relaxed mb-3">
            If the Challenge worked for you, send the landing-page link to one
            other investor or analyst who&rsquo;d use it.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            That&rsquo;s the entire ask. We don&rsquo;t run an affiliate program, we
            don&rsquo;t want incentives to distort whether someone tells a friend.
          </p>
          <code className="block text-sky-300 bg-slate-950/60 px-3 py-2 rounded text-sm break-all">
            https://signals.gitdealflow.com/challenge
          </code>
        </section>

        <p className="text-xs text-gray-400 text-center">
          Challenge curriculum:{" "}
          <Link
            href="/challenge"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            /challenge
          </Link>{" "}
          · Methodology:{" "}
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

        <DataNerdSignoff variant="compact" className="mt-8" />
      </div>
    </>
  );
}
