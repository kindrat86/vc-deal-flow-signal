import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import * as fs from "node:fs";
import * as path from "node:path";
import { BOOK, getChapterBySlug, nextChapter, prevChapter } from "@/lib/book";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";
export const dynamicParams = false;

const SITE = "https://signals.gitdealflow.com";
const AUDIO_BASE = `${SITE}/downloads/audio`;

interface PageProps {
  params: Promise<{ chapter: string }>;
}

export async function generateStaticParams() {
  return BOOK.chapters.map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { chapter: slug } = await params;
  const chapter = getChapterBySlug(slug);
  if (!chapter) return {};

  const url = `${SITE}/book/listen/${chapter.slug}`;
  return {
    title: `${chapter.title} — audiobook chapter`,
    description: `Listen to ${chapter.title}. ${chapter.summary}`,
    alternates: { canonical: `/book/listen/${chapter.slug}` },
    openGraph: {
      title: chapter.title,
      description: chapter.summary,
      url,
      type: "article",
      authors: [BOOK.authorName],
    },
  };
}

/**
 * Build-time check for whether a synthetic-narration MP3 has already been
 * generated for this chapter. The audio is produced by the
 * `generate-data-nerd-audio.yml` cron pattern (Cartesia neural narration);
 * this page renders a graceful "in production" placeholder for chapters that
 * haven't been narrated yet without breaking the route.
 */
function audioFileExists(slug: string): boolean {
  const candidate = path.join(
    process.cwd(),
    "public",
    "downloads",
    "audio",
    `${slug}.mp3`,
  );
  try {
    return fs.existsSync(candidate);
  } catch {
    return false;
  }
}

export default async function ChapterListenPage({ params }: PageProps) {
  const { chapter: slug } = await params;
  const chapter = getChapterBySlug(slug);
  if (!chapter) notFound();

  const next = nextChapter(slug);
  const prev = prevChapter(slug);
  const audioUrl = `${AUDIO_BASE}/${chapter.slug}.mp3`;
  const url = `${SITE}/book/listen/${chapter.slug}`;
  const hasAudio = audioFileExists(chapter.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "AudioObject",
        "@id": `${url}#audio`,
        name: chapter.title,
        alternativeHeadline: chapter.subtitle,
        description: chapter.summary,
        contentUrl: audioUrl,
        encodingFormat: "audio/mpeg",
        duration: `PT${chapter.estimatedReadMinutes}M`,
        author: {
          "@type": "Person",
          name: BOOK.authorName,
          jobTitle: BOOK.authorRole,
        },
        publisher: {
          "@type": "Organization",
          name: "GitDealFlow",
          url: "https://gitdealflow.com",
        },
        inLanguage: BOOK.language,
        position: chapter.number + 1,
        isPartOf: {
          "@type": "Audiobook",
          "@id": `${SITE}/book/listen#audiobook`,
          name: BOOK.title,
        },
        url,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Book",
            item: `${SITE}/book`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Audiobook",
            item: `${SITE}/book/listen`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: chapter.title,
            item: url,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={url}
        languages={getHreflangLanguages(`/book/listen/${chapter.slug}`)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/book/listen/${chapter.slug}`} />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-400 mb-8">
          <Link href="/book" className="hover:text-sky-400">
            {BOOK.title}
          </Link>
          {" → "}
          <Link href="/book/listen" className="hover:text-sky-400">
            Audiobook
          </Link>
          {" → "}
          <span className="text-gray-300">{chapter.title}</span>
        </nav>

        <header className="space-y-3 mb-10 pb-6 border-b border-slate-800">
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-[0.18em]">
            Chapter {chapter.number} · audiobook · ~{chapter.estimatedReadMinutes} min
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            {chapter.title}
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed italic">
            {chapter.subtitle}
          </p>
        </header>

        {hasAudio ? (
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 space-y-3">
            <audio
              controls
              preload="none"
              src={audioUrl}
              className="w-full"
            >
              <a href={audioUrl}>Download MP3</a>
            </audio>
            <p className="text-xs text-gray-400">
              Synthetic neural narration · Cartesia ·{" "}
              <a
                href={audioUrl}
                className="text-sky-400 hover:text-sky-300 underline underline-offset-2"
                download
              >
                download MP3
              </a>{" "}
              ·{" "}
              <a
                href="/book/podcast.xml"
                className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
              >
                subscribe RSS
              </a>
            </p>
          </div>
        ) : (
          <div className="bg-slate-900/60 border border-amber-900/40 rounded-xl p-6 space-y-3">
            <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
              Narration in production
            </p>
            <p className="text-gray-200 leading-relaxed">
              The neural narration for this chapter is queued for the next
              Cartesia render pass. Subscribe to the RSS feed and the chapter
              will arrive as a normal podcast episode the moment it lands.
            </p>
            <div className="flex flex-wrap gap-2.5 pt-1">
              <a
                href="/book/podcast.xml"
                className="inline-flex items-center justify-center rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold px-4 py-2 text-sm"
              >
                Subscribe to the RSS feed
              </a>
              <Link
                href={`/book/read/${chapter.slug}`}
                className="inline-flex items-center justify-center rounded-md border border-slate-700 hover:border-slate-500 text-gray-200 px-4 py-2 text-sm"
              >
                Read this chapter instead
              </Link>
            </div>
          </div>
        )}

        <section className="mt-10 space-y-2 text-gray-200 text-base leading-relaxed">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">
            What this chapter covers
          </p>
          <p>{chapter.summary}</p>
        </section>

        <nav className="mt-16 pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prev ? (
            <Link
              href={`/book/listen/${prev.slug}`}
              className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 hover:border-slate-600 transition-colors"
            >
              <p className="text-xs text-gray-400 mb-1">← Previous</p>
              <p className="text-gray-100 font-semibold">{prev.title}</p>
            </Link>
          ) : (
            <div />
          )}
          {next ? (
            <Link
              href={`/book/listen/${next.slug}`}
              className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 hover:border-slate-600 transition-colors text-right"
            >
              <p className="text-xs text-gray-400 mb-1">Next →</p>
              <p className="text-gray-100 font-semibold">{next.title}</p>
            </Link>
          ) : (
            <Link
              href="/book/certificate"
              className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-700/50 rounded-lg p-4 hover:border-amber-500 transition-colors text-right"
            >
              <p className="text-xs text-amber-300 mb-1">Finished the audiobook? →</p>
              <p className="text-gray-100 font-semibold">
                Claim your completion certificate
              </p>
            </Link>
          )}
        </nav>

        <aside className="mt-12 bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-950 border border-sky-900/40 rounded-xl p-5 space-y-3 text-sm">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            Use the methodology Monday morning
          </p>
          <p className="text-gray-300 leading-relaxed">
            The same trace this audiobook walks you through is run for you
            weekly on the Dashboard — 209 ranked orgs, sector and stage filters,
            €9.97/mo founding-member rate.{" "}
            <Link
              href="/pricing#dashboard-beta"
              className="text-sky-400 hover:text-sky-300"
            >
              See the Dashboard →
            </Link>
          </p>
        </aside>
      </article>
    </>
  );
}
