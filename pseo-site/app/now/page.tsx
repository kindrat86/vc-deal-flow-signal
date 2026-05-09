import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import {
  DATA_NERD_NAME,
  DATA_NERD_NOW,
  DATA_NERD_FUTURE_SELF,
  DATA_NERD_ARCHETYPE,
  DATA_NERD_TRIBE,
} from "@/lib/data-nerd";

export const dynamic = "force-static";

// Brunson Expert Secrets Ch 2 (Charismatic Leader 2.0): the founder
// character must be in daily contact with the tribe. The Sunday digest
// covers broadcast cadence; the monthly /state-of-github address covers
// long-form. /now is the in-between status surface — five fields, five
// minutes, every Monday. Convention borrowed from nownownow.com (Derek
// Sivers) — anonymity-compatible because it's status, not face.
//
// Single source of truth for the content lives in lib/data-nerd.ts so the
// /about/founder page and the /data-nerd character bible can teaser-link
// here without copy duplication. To update the page, edit DATA_NERD_NOW
// in that file and ship a single deploy.

export const metadata: Metadata = {
  title: `/now — what The Data Nerd is working on this week (${DATA_NERD_NOW.weekISO})`,
  description: `Current weekly status from ${DATA_NERD_NAME}. Five fields, updated every Monday: shipping, reading, blocked, parking lot, weekly rhythm. The cadence is the character. Updated ${DATA_NERD_NOW.asOf}.`,
  alternates: { canonical: "/now" },
  openGraph: {
    title: `/now — ${DATA_NERD_NAME}`,
    description:
      "What I'm working on this week. Updated every Monday. The cadence is the character.",
    url: "https://signals.gitdealflow.com/now",
    type: "article",
  },
};

const RHYTHM_DAYS: Array<{ key: keyof typeof DATA_NERD_NOW.rhythm; label: string }> = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

export default function NowPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/now#page",
        url: "https://signals.gitdealflow.com/now",
        name: `/now — ${DATA_NERD_NAME}`,
        description: `Current weekly status. Updated every Monday. ${DATA_NERD_NOW.asOf}.`,
        inLanguage: "en-US",
        dateModified: DATA_NERD_NOW.asOf,
        author: {
          "@type": "Person",
          "@id": "https://signals.gitdealflow.com/about#author",
          name: DATA_NERD_NAME,
        },
        publisher: {
          "@type": "Organization",
          "@id": "https://gitdealflow.com/#organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2", "h3"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Now", item: "https://signals.gitdealflow.com/now" },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/now"
        languages={getHreflangLanguages("/now")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/now" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <nav className="text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Now</span>
        </nav>

        <header className="space-y-4">
          <p className="text-emerald-300 text-xs font-medium uppercase tracking-wider">
            Live status · {DATA_NERD_NOW.weekISO} · updated {DATA_NERD_NOW.asOf}
          </p>
          <h1
            className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.05] tracking-tight"
            data-speakable
          >
            What I&rsquo;m{" "}
            <span className="text-emerald-300">actually</span> working on this
            week.
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
            data-speakable
          >
            The Sunday digest is the broadcast. The monthly{" "}
            <Link
              href="/state-of-github"
              className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted"
            >
              State of GitHub
            </Link>{" "}
            is the long-form. This is the in-between — five fields,
            updated every Monday. Status, not face. Convention borrowed
            from{" "}
            <a
              href="https://nownownow.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted"
            >
              nownownow.com
            </a>
            .
          </p>
        </header>

        {/* SHIPPING */}
        <section className="rounded-xl border border-emerald-700/30 bg-gradient-to-br from-emerald-950/15 via-slate-900 to-slate-950 p-5 sm:p-6 space-y-3">
          <p className="text-emerald-300 text-[10px] font-semibold uppercase tracking-wider">
            01 · Shipping this week
          </p>
          <ul className="space-y-2.5">
            {DATA_NERD_NOW.shipping.map((item, i) => (
              <li key={i} className="flex gap-3 text-gray-200 text-base leading-relaxed">
                <span aria-hidden className="text-emerald-300 shrink-0">→</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* READING */}
        <section className="space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            02 · Reading
          </p>
          <h2 className="text-xl font-bold text-gray-100">
            What&rsquo;s open in tabs.
          </h2>
          <ul className="space-y-2.5">
            {DATA_NERD_NOW.reading.map((item, i) => (
              <li key={i} className="flex gap-3 text-gray-300 text-base leading-relaxed">
                <span aria-hidden className="text-amber-300 shrink-0">📖</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* BLOCKED */}
        {DATA_NERD_NOW.blocked.length > 0 && (
          <section className="rounded-xl border border-rose-700/30 bg-rose-950/10 p-5 sm:p-6 space-y-3">
            <p className="text-rose-300 text-[10px] font-semibold uppercase tracking-wider">
              03 · Blocked
            </p>
            <h2 className="text-xl font-bold text-gray-100">
              What&rsquo;s stuck and why.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Publishing the blocker keeps the cadence honest. If I keep
              writing &ldquo;blocked&rdquo; for a thing every week, that&rsquo;s
              a real signal — please DM me about it.
            </p>
            <ul className="space-y-2.5 pt-1">
              {DATA_NERD_NOW.blocked.map((item, i) => (
                <li key={i} className="flex gap-3 text-gray-300 text-base leading-relaxed">
                  <span aria-hidden className="text-rose-300 shrink-0">⛔</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* PARKING LOT */}
        <section className="space-y-3">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            04 · Parking lot
          </p>
          <h2 className="text-xl font-bold text-gray-100">
            What&rsquo;s next, when bandwidth opens.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Not a roadmap. A backlog of things I want to ship and have
            decided not to ship yet. Listed publicly so I can&rsquo;t
            quietly drop them.
          </p>
          <ul className="space-y-2.5 pt-1">
            {DATA_NERD_NOW.parkingLot.map((item, i) => (
              <li key={i} className="flex gap-3 text-gray-300 text-base leading-relaxed">
                <span aria-hidden className="text-sky-300 shrink-0">🅿️</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* WEEKLY RHYTHM */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            05 · Weekly rhythm
          </p>
          <h2 className="text-xl font-bold text-gray-100">
            What every week looks like, week after week.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            The cadence is the character. If a Monday digest doesn&rsquo;t
            arrive, something broke; if every Monday digest is on time for
            twelve months, the rhythm is real.
          </p>
          <dl className="space-y-2 pt-2">
            {RHYTHM_DAYS.map((d) => (
              <div
                key={d.key}
                className="grid grid-cols-[100px_1fr] gap-3 text-sm"
              >
                <dt className="text-amber-200 font-semibold tabular-nums">
                  {d.label}
                </dt>
                <dd className="text-gray-300 leading-relaxed">
                  {DATA_NERD_NOW.rhythm[d.key]}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        {/* TWELVE-MONTH FUTURE COMMIT — anchor of the future-self arc.
            Repeated from /data-nerd + /about/founder so the reader who
            lands here from a Substack share has the full character
            commitment in view, not just the weekly status. */}
        <section className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/15 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-4">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            06 · Twelve months from now
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            Five public commitments. Graded {DATA_NERD_FUTURE_SELF.graderDate}.
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            The character has to project a future or it&rsquo;s a static
            pose. The five public commits below get graded one year from
            publish (
            <span className="font-mono text-amber-200">
              {DATA_NERD_FUTURE_SELF.graderDate}
            </span>
            ). Either kept or admitted-broken-with-reason. No third option.
          </p>
          <ol className="space-y-3 pt-1">
            {DATA_NERD_FUTURE_SELF.twelveMonthCommit.map((c) => (
              <li
                key={c.n}
                className="rounded-lg border border-slate-800 bg-slate-900/40 p-4"
              >
                <p className="text-amber-300 text-sm font-bold leading-snug mb-1">
                  Commit {c.n} — {c.label}
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {c.body}
                </p>
              </li>
            ))}
          </ol>
        </section>

        {/* CHARACTER + TRIBE FOOTER — link the live status to the wider
            character bible so readers landing from a share have the
            anchor. */}
        <section className="border-t border-slate-800 pt-8 space-y-3">
          <p className="text-gray-400 text-sm leading-relaxed">
            <strong className="text-gray-200">{DATA_NERD_NAME}</strong>{" "}
            ({DATA_NERD_ARCHETYPE.label}) writes for{" "}
            <strong className="text-sky-300">{DATA_NERD_TRIBE.name}</strong>{" "}
            — &ldquo;{DATA_NERD_TRIBE.oneLine}&rdquo;
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>
              →{" "}
              <Link
                href="/data-nerd"
                className="text-amber-300 hover:text-amber-200 underline decoration-dotted font-semibold"
              >
                Read the full character bible
              </Link>{" "}
              (archetype, polarity, parables, voice rules, flaws,
              touchpoints).
            </li>
            <li>
              →{" "}
              <Link
                href="/manifesto"
                className="text-rose-300 hover:text-rose-200 underline decoration-dotted font-semibold"
              >
                Read the manifesto
              </Link>{" "}
              (seven pillars, named enemy, who&rsquo;s on the bus).
            </li>
            <li>
              →{" "}
              <Link
                href="/parables"
                className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted font-semibold"
              >
                Read the parables
              </Link>{" "}
              (six teaching stories, each a hyperlinkable standalone page).
            </li>
            <li>
              →{" "}
              <a
                href="https://gitdealflow.com/#signup"
                rel="noopener noreferrer"
                className="text-sky-300 hover:text-sky-200 underline decoration-dotted font-semibold"
              >
                Subscribe to the Sunday digest
              </a>{" "}
              (free, weekly, the broadcast version of this rhythm).
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
