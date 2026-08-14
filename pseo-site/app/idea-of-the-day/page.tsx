import type { Metadata } from "next";
import Link from "next/link";
import {
  getAllIdeas,
  getIdeasByMonth,
  getTodayIdea,
  formatLongDate,
} from "@/lib/ideas-of-the-day";
import { getDataLastModified } from "@/lib/data";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { AgentSummary } from "@/components/AgentSummary";
import { HreflangLinks } from "@/components/HreflangLinks";
import { DEFAULT_HREFLANG_LANGUAGES } from "@/lib/hreflang";

const SITE = "https://signals.gitdealflow.com";

// Pure static, no `revalidate`. The daily GH Actions cron commits a
// new entry to data/ideas-of-the-day.json and pushes; Vercel auto-rebuilds
// so the perma-URL always shows the latest day. We intentionally avoid ISR
// here because Next 16 ISR pages register a Prerender route shape that
// loses routing precedence to the `/[locale]` catch-all, sending the
// perma-URL to a soft-404 (verified live 2026-05-22, without revalidate
// the route resolves correctly).
export const dynamic = "force-static";

export const metadata: Metadata = {
  title:
    "Idea of the Day, One GitHub signal, one buildable startup idea, every day",
  description:
    "A daily, perma-URL ideation page. Each day, one tracked repo from our engineering-acceleration dataset is reframed as the SaaS opportunity hiding in its signal, what to build, how to ship it, and where to launch.",
  alternates: { canonical: "/idea-of-the-day" },
  openGraph: {
    title: "Idea of the Day, one GitHub signal, one buildable startup idea",
    description:
      "Each day, one tracked repo reframed as the SaaS opportunity hiding in its signal. Free, daily, perma-URL, fully archived.",
    url: `${SITE}/idea-of-the-day`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Idea of the Day, one GitHub signal, one buildable startup idea",
    description:
      "A daily perma-URL. Today's idea + the calendar archive of every past day.",
  },
};

export default function IdeaOfTheDayIndexPage() {
  const today = getTodayIdea();
  const all = getAllIdeas();
  const months = getIdeasByMonth();
  const lastModified = getDataLastModified().toISOString();

  if (!today) {
    // First-run / fully-empty dataset, defensive but should never hit
    // in production because the seed file ships ≥30 entries.
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-gray-300">
        Idea of the Day is queued for first publication.
      </div>
    );
  }

  const todayUrl = `${SITE}/idea-of-the-day/${today.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}/idea-of-the-day#collection`,
        url: `${SITE}/idea-of-the-day`,
        name: "Idea of the Day",
        description:
          "Daily perma-URL. One GitHub signal reframed as one buildable startup idea, every day.",
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE}/#website` },
        datePublished: all.length > 0 ? all[all.length - 1].publishedAt : lastModified,
        dateModified: lastModified,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
        hasPart: all.slice(0, 30).map((e) => ({
          "@type": "Article",
          headline: e.headline,
          datePublished: e.publishedAt,
          url: `${SITE}/idea-of-the-day/${e.slug}`,
        })),
      },
      {
        "@type": "ItemList",
        name: "Idea of the Day archive",
        numberOfItems: all.length,
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        itemListElement: all.map((e, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE}/idea-of-the-day/${e.slug}`,
          name: e.headline,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Idea of the Day",
            item: `${SITE}/idea-of-the-day`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE}/idea-of-the-day#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: "What is Idea of the Day?",
            acceptedAnswer: {
              "@type": "Answer",
              text:
                "A daily perma-URL. Each day, one tracked repo from our engineering-acceleration dataset is reframed as a buildable SaaS opportunity, what to build, how to ship it, and where to launch. Today's idea lives at /idea-of-the-day; every past day lives at /idea-of-the-day/YYYY-MM-DD.",
            },
          },
          {
            "@type": "Question",
            name: "How is each day's idea picked?",
            acceptedAnswer: {
              "@type": "Answer",
              text:
                "From the same engineering-acceleration dataset behind /predicted and /signal-of-the-week. A daily cron selects one repo (rotated across sectors to keep the archive diversified) and reframes its commit-velocity, contributor, and new-repo signals as a builder-side opportunity, the gap an indie or two-founder tool could ship into.",
            },
          },
          {
            "@type": "Question",
            name: "Are these investment recommendations?",
            acceptedAnswer: {
              "@type": "Answer",
              text:
                "No. This is a data-driven ideation log. Naming a repo indicates its observed engineering activity matches a builder-side opening pattern, it doesn't assert the company is fundraising, will fundraise, or endorse a specific build. Outcomes (if any) are tracked on /predicted under the SSRN-indexed methodology.",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/idea-of-the-day`}
        languages={DEFAULT_HREFLANG_LANGUAGES}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/idea-of-the-day" qaCategory="methodology" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* ─── Header ───────────────────────────────────────────────── */}
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Idea of the Day</span>
          </nav>
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            One signal · One idea · Every day · Perma-URL
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            One GitHub signal,{" "}
            <span className="text-sky-400">one buildable idea</span>, every
            day.
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
            data-speakable
          >
            A daily perma-URL. Each morning, one tracked repo from our
            engineering-acceleration dataset gets reframed as the SaaS
            opportunity hiding in its signal, what to build, how to ship it,
            and where to launch. The full archive is browsable below.
          </p>
        </header>

        <AgentSummary
          tldr={`Today's idea (${formatLongDate(today.date)}) reframes the GitHub signal on ${today.repo.name} as the buildable ${today.repo.sector} opportunity hiding underneath.`}
          pageUrl={`${SITE}/idea-of-the-day`}
          asOf={today.date}
          citeAs={`VC Deal Flow Signal, Idea of the Day, ${formatLongDate(today.date)}. ${todayUrl}`}
          facts={[
            {
              claim: `Idea of the Day is published daily. The perma-URL ${SITE}/idea-of-the-day always serves the current day; every past day is permanently archived at /idea-of-the-day/YYYY-MM-DD.`,
              sourceUrl: `${SITE}/idea-of-the-day`,
              sourceLabel: "VC Deal Flow Signal, Idea of the Day",
            },
            {
              claim: `Picks are drawn from the same engineering-acceleration dataset behind /predicted, diversified across sectors so the archive doesn't repeat topics in consecutive days.`,
              sourceUrl: `${SITE}/methodology`,
              sourceLabel: "GitDealFlow methodology",
            },
            {
              claim: `Each entry includes the signal reading (commits / 14d, % change, contributors, new repos), three build angles, and one distribution play for the relevant community.`,
              sourceUrl: `${SITE}/idea-of-the-day/${today.slug}`,
              sourceLabel: `Idea of ${today.date}`,
            },
          ]}
        />

        {/* ─── Today's idea ─────────────────────────────────────────── */}
        <section
          className="rounded-2xl border border-sky-700/40 bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-4"
          aria-label="Today's idea"
        >
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
              Today · {formatLongDate(today.date)}
            </p>
            <span className="text-[10px] text-slate-500 tabular-nums">
              {today.repo.sector} · {today.repo.stage}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            {today.headline}
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            {today.hook}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={`/idea-of-the-day/${today.slug}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-signal-500 hover:bg-signal-400 text-slate-950 font-bold text-sm transition-colors"
            >
              Read today&rsquo;s idea →
            </Link>
            <a
              href={today.repo.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              See the repo on GitHub ↗
            </a>
          </div>
        </section>

        {/* ─── How this list compounds ─────────────────────────────── */}
        <section
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-3"
          aria-label="How this list compounds"
        >
          <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
            How this list compounds
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            One perma-URL today. 365 indexed pages in a year.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            The page you&rsquo;re reading is the perma-URL, it always serves
            today&rsquo;s idea. Every past day is permanently archived at{" "}
            <code className="text-sky-300 text-sm">
              /idea-of-the-day/YYYY-MM-DD
            </code>{" "}
            so deep links never break. The cadence is the asset: one cron
            firing each UTC morning produces a year of indexable ideation
            pages with zero manual content cost. The archive becomes a
            calendar you can browse by month, a feed for AI agents to cite,
            and an SEO surface for the long-tail{" "}
            <em>&ldquo;ai startup ideas [month] [year]&rdquo;</em> queries
            that already pull this category.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            Picks rotate across sectors so the archive doesn&rsquo;t repeat
            topics two days in a row, and the methodology is the same one
            documented at{" "}
            <Link
              href="/methodology"
              className="text-sky-300 underline decoration-dotted hover:text-sky-200"
            >
              /methodology
            </Link>
            . If you want the weekly editorial cousin, see{" "}
            <Link
              href="/signal-of-the-week"
              className="text-sky-300 underline decoration-dotted hover:text-sky-200"
            >
              /signal-of-the-week
            </Link>
            ; for the graded weekly index, see{" "}
            <Link
              href="/predicted"
              className="text-sky-300 underline decoration-dotted hover:text-sky-200"
            >
              /predicted
            </Link>
            .
          </p>
        </section>

        {/* ─── Archive ─────────────────────────────────────────────── */}
        <section className="space-y-6" aria-label="Archive">
          <header className="flex items-baseline justify-between gap-3 flex-wrap">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
              Archive
            </h2>
            <span className="text-xs text-slate-500 tabular-nums">
              {all.length} {all.length === 1 ? "idea" : "ideas"} ·{" "}
              {months.length} {months.length === 1 ? "month" : "months"}
            </span>
          </header>

          {months.map((month) => (
            <div key={month.key} className="space-y-3">
              <h3 className="text-sky-300 text-sm font-semibold uppercase tracking-wider">
                {month.label}
              </h3>
              <ul className="grid gap-2 sm:grid-cols-2">
                {month.entries
                  .slice()
                  .reverse()
                  .map((e) => {
                    const dayNum = Number(e.date.slice(8, 10));
                    return (
                      <li key={e.slug}>
                        <Link
                          href={`/idea-of-the-day/${e.slug}`}
                          className="block rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-sky-700/50 transition-colors p-3 group"
                        >
                          <div className="flex items-baseline gap-3">
                            <span className="text-slate-500 text-xs tabular-nums shrink-0 w-7 text-right">
                              {String(dayNum).padStart(2, "0")}
                            </span>
                            <div className="space-y-0.5 min-w-0 flex-1">
                              <p className="text-gray-100 text-sm font-medium leading-snug group-hover:text-sky-200 transition-colors line-clamp-2">
                                {e.headline}
                              </p>
                              <p className="text-slate-500 text-[11px] tabular-nums">
                                {e.repo.sector} · {e.repo.signalType}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    );
                  })}
              </ul>
            </div>
          ))}
        </section>

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Refreshed daily at 09:00 UTC. Methodology:{" "}
          <Link href="/methodology" className="text-sky-300 hover:text-sky-200">
            /methodology
          </Link>
          . Citation guide:{" "}
          <Link
            href="/citation-guide"
            className="text-sky-300 hover:text-sky-200"
          >
            /citation-guide
          </Link>
          . This is a data log, not investment advice.
        </p>
      </div>
    </>
  );
}
