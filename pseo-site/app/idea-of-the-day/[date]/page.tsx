import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllIdeaSlugs,
  getIdeaBySlug,
  getNeighbours,
  formatLongDate,
  type IdeaOfTheDay,
} from "@/lib/ideas-of-the-day";
import { getDataLastModified } from "@/lib/data";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { AgentSummary } from "@/components/AgentSummary";
import { HreflangLinks } from "@/components/HreflangLinks";
import { DEFAULT_HREFLANG_LANGUAGES } from "@/lib/hreflang";

const SITE = "https://signals.gitdealflow.com";

interface PageProps {
  params: Promise<{ date: string }>;
}

export const dynamic = "force-static";
export const dynamicParams = false;
// Daily-published archive: a new slug ships each morning. Hourly ISR
// keeps the latest day's neighbour links honest without a redeploy.
export const revalidate = 3600;

export function generateStaticParams() {
  return getAllIdeaSlugs().map((slug) => ({ date: slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { date } = await params;
  const idea = getIdeaBySlug(date);
  if (!idea) return {};

  const url = `${SITE}/idea-of-the-day/${idea.slug}`;
  const titleBase = `Idea of the day — ${formatLongDate(idea.date)}`;
  return {
    title: `${titleBase} — ${idea.headline}`,
    description: idea.hook,
    alternates: { canonical: `/idea-of-the-day/${idea.slug}` },
    openGraph: {
      title: titleBase,
      description: idea.headline,
      url,
      type: "article",
      publishedTime: idea.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: titleBase,
      description: idea.headline,
    },
  };
}

function buildJsonLd(idea: IdeaOfTheDay, lastModified: string) {
  const url = `${SITE}/idea-of-the-day/${idea.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: idea.headline,
        description: idea.hook,
        articleBody: [
          idea.hook,
          idea.ideaThesis,
          ...idea.buildAngles,
          idea.distributionPlay,
          ...idea.signalReading.map((s) => `${s.metric}: ${s.reading}`),
        ].join("\n\n"),
        url,
        mainEntityOfPage: url,
        datePublished: idea.publishedAt,
        dateModified: lastModified,
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE}/idea-of-the-day#collection` },
        keywords: [
          idea.repo.sector,
          idea.repo.signalType,
          idea.repo.stage,
          "GitHub momentum",
          "startup ideas",
          "engineering acceleration",
        ].join(", "),
        about: {
          "@type": "Thing",
          name: `${idea.repo.sector} — ${idea.repo.signalType}`,
        },
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: SITE,
        },
        author: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: SITE,
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
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
          {
            "@type": "ListItem",
            position: 3,
            name: formatLongDate(idea.date),
            item: url,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: [
          {
            "@type": "Question",
            name: `What signal is this idea reading?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${idea.repo.signalType} on ${idea.repo.name} — ${idea.repo.commitVelocity14d.toLocaleString()} commits over 14 days at ${idea.repo.commitVelocityChange} change, ${idea.repo.contributors} contributors (${idea.repo.contributorGrowth}). See the full reading below.`,
            },
          },
          {
            "@type": "Question",
            name: `Is this investment advice?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `No. Idea of the Day is a builder-side reframing of an observed engineering signal. Naming a repo indicates its activity matches a pattern; it does not assert intent or endorse a build. The methodology is documented at ${SITE}/methodology.`,
            },
          },
          {
            "@type": "Question",
            name: `Where can I see the underlying data?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${idea.repo.githubUrl} for the repo, and ${SITE}/predicted for the weekly graded index that uses the same dataset.`,
            },
          },
        ],
      },
    ],
  };
}

export default async function IdeaOfTheDayDatedPage({ params }: PageProps) {
  const { date } = await params;
  const idea = getIdeaBySlug(date);
  if (!idea) notFound();

  const { prev, next } = getNeighbours(idea.slug);
  const lastModified = getDataLastModified().toISOString();
  const url = `${SITE}/idea-of-the-day/${idea.slug}`;
  const jsonLd = buildJsonLd(idea, lastModified);

  return (
    <>
      <HreflangLinks
        canonical={url}
        languages={{
          ...DEFAULT_HREFLANG_LANGUAGES,
          "en-US": url,
          en: url,
          "x-default": url,
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks
        path={`/idea-of-the-day/${idea.slug}`}
        qaCategory="methodology"
      />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        {/* ─── Breadcrumb + header ─────────────────────────────────── */}
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/idea-of-the-day"
              className="hover:text-gray-300"
            >
              Idea of the Day
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">{idea.date}</span>
          </nav>
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            {formatLongDate(idea.date)} ·{" "}
            <span className="text-slate-500">
              {idea.repo.sector} · {idea.repo.signalType}
            </span>
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-[1.15] tracking-tight">
            {idea.headline}
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
            data-speakable
          >
            {idea.hook}
          </p>
        </header>

        <AgentSummary
          tldr={`${idea.headline}. Signal: ${idea.repo.signalType} on ${idea.repo.name} — ${idea.repo.commitVelocity14d.toLocaleString()} commits / 14d at ${idea.repo.commitVelocityChange}, ${idea.repo.contributors} contributors. Builder-side reframing follows below.`}
          pageUrl={url}
          asOf={idea.date}
          citeAs={`VC Deal Flow Signal — Idea of the Day, ${formatLongDate(idea.date)}. ${url}`}
          facts={[
            {
              claim: `Repo: ${idea.repo.name} (${idea.repo.stage}, ${idea.repo.geography}). Signal: ${idea.repo.signalType} — ${idea.repo.commitVelocity14d.toLocaleString()} commits over 14 days at ${idea.repo.commitVelocityChange}.`,
              sourceUrl: idea.repo.githubUrl,
              sourceLabel: `${idea.repo.name} on GitHub`,
            },
            {
              claim: `${idea.repo.contributors} contributors (${idea.repo.contributorGrowth}), ${idea.repo.newRepos} new repos in the window. Sector: ${idea.repo.sector}.`,
              sourceUrl: `${SITE}/predicted`,
              sourceLabel: "Engineering Acceleration Watch",
            },
            {
              claim: `Idea framing: ${idea.ideaThesis.split(".")[0]}.`,
              sourceUrl: `${SITE}/methodology`,
              sourceLabel: "GitDealFlow methodology",
            },
          ]}
        />

        {/* ─── Signal panel ────────────────────────────────────────── */}
        <section
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-4"
          aria-label="Signal reading"
        >
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <p className="text-sky-300 text-[10px] font-semibold uppercase tracking-wider">
              The signal
            </p>
            <a
              href={idea.repo.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 text-xs font-mono"
            >
              {idea.repo.githubUrl.replace(/^https?:\/\//, "")} ↗
            </a>
          </div>
          <ul className="space-y-3">
            {idea.signalReading.map((s, i) => (
              <li key={i} className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <span className="text-sky-200 text-sm font-mono tabular-nums sm:w-44 shrink-0">
                  {s.metric}
                </span>
                <span className="text-gray-300 text-sm leading-relaxed flex-1">
                  {s.reading}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* ─── Thesis ──────────────────────────────────────────────── */}
        <section className="space-y-3" aria-label="Idea thesis">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            The opening
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            {idea.ideaThesis}
          </p>
        </section>

        {/* ─── Build angles ───────────────────────────────────────── */}
        <section className="space-y-3" aria-label="Build angles">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Three ways to build into it
          </h2>
          <ul className="space-y-2.5">
            {idea.buildAngles.map((a, i) => (
              <li
                key={i}
                className="flex gap-3 text-gray-300 text-base leading-relaxed"
              >
                <span className="text-sky-400 font-mono shrink-0 w-6 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1">{a}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* ─── Distribution play ──────────────────────────────────── */}
        <section
          className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 sm:p-6 space-y-2"
          aria-label="Distribution play"
        >
          <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
            Distribution play
          </p>
          <p className="text-gray-200 text-base leading-relaxed">
            {idea.distributionPlay}
          </p>
        </section>

        {/* ─── Prev / Next ─────────────────────────────────────────── */}
        <nav
          aria-label="Archive navigation"
          className="border-t border-slate-800 pt-6 flex items-stretch justify-between gap-3 flex-wrap"
        >
          {prev ? (
            <Link
              href={`/idea-of-the-day/${prev.slug}`}
              className="flex-1 min-w-[200px] block rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-sky-700/50 transition-colors p-3 group"
              rel="prev"
            >
              <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">
                ← Previous · {prev.date}
              </p>
              <p className="text-gray-100 text-sm font-medium leading-snug group-hover:text-sky-200 transition-colors line-clamp-2">
                {prev.headline}
              </p>
            </Link>
          ) : (
            <div className="flex-1 min-w-[200px]" aria-hidden="true" />
          )}
          {next ? (
            <Link
              href={`/idea-of-the-day/${next.slug}`}
              className="flex-1 min-w-[200px] block rounded-lg border border-slate-800 bg-slate-900/40 hover:bg-slate-900 hover:border-sky-700/50 transition-colors p-3 group text-right"
              rel="next"
            >
              <p className="text-slate-500 text-[10px] uppercase tracking-wider mb-1">
                Next · {next.date} →
              </p>
              <p className="text-gray-100 text-sm font-medium leading-snug group-hover:text-sky-200 transition-colors line-clamp-2">
                {next.headline}
              </p>
            </Link>
          ) : (
            <div className="flex-1 min-w-[200px]" aria-hidden="true" />
          )}
        </nav>

        {/* ─── Cross-links ─────────────────────────────────────────── */}
        <section
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-3"
          aria-label="Related"
        >
          <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
            Where this fits
          </p>
          <ul className="text-gray-300 text-sm space-y-1.5 leading-relaxed">
            <li>
              All days in the archive:{" "}
              <Link
                href="/idea-of-the-day"
                className="text-sky-300 underline decoration-dotted hover:text-sky-200"
              >
                /idea-of-the-day
              </Link>
            </li>
            <li>
              Weekly editorial cousin (single-startup deep-dive):{" "}
              <Link
                href="/signal-of-the-week"
                className="text-sky-300 underline decoration-dotted hover:text-sky-200"
              >
                /signal-of-the-week
              </Link>
            </li>
            <li>
              Graded weekly index (10 picks, graded at 60/90 days):{" "}
              <Link
                href="/predicted"
                className="text-sky-300 underline decoration-dotted hover:text-sky-200"
              >
                /predicted
              </Link>
            </li>
            <li>
              Methodology (how we read these signals):{" "}
              <Link
                href="/methodology"
                className="text-sky-300 underline decoration-dotted hover:text-sky-200"
              >
                /methodology
              </Link>
            </li>
          </ul>
        </section>

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Published {idea.publishedAt}. This is a builder-side reading of a
          public engineering signal — not investment advice, not an
          endorsement of any specific startup or build. Outcomes (if any) are
          recorded post-hoc on{" "}
          <Link href="/predicted" className="text-sky-300 hover:text-sky-200">
            /predicted
          </Link>{" "}
          under the SSRN-indexed methodology.
        </p>
      </article>
    </>
  );
}
