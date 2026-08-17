import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BOOK,
  getChapterBySlug,
  getChapterMarkdown,
  renderChapterHtml,
  nextChapter,
  prevChapter,
} from "@/lib/book";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-static";
export const dynamicParams = false;

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

  const url = `https://signals.gitdealflow.com/book/read/${chapter.slug}`;
  return withEditorialOverride({
    title: `${chapter.title}, ${BOOK.title}`,
    description: chapter.summary,
    alternates: { canonical: `/book/read/${chapter.slug}` },
    openGraph: {
      title: chapter.title,
      description: chapter.summary,
      url,
      type: "article",
      authors: [BOOK.authorName],
    },
  });
}

export default async function ChapterPage({ params }: PageProps) {
  const { chapter: slug } = await params;
  const chapter = getChapterBySlug(slug);
  if (!chapter) notFound();

  const md = getChapterMarkdown(chapter);
  const html = renderChapterHtml(md);
  const next = nextChapter(slug);
  const prev = prevChapter(slug);

  const url = `https://signals.gitdealflow.com/book/read/${chapter.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Chapter",
        "@id": `${url}#chapter`,
        name: chapter.title,
        alternativeHeadline: chapter.subtitle,
        position: chapter.number + 1,
        isPartOf: {
          "@type": "Book",
          "@id": "https://signals.gitdealflow.com/book#book",
          name: BOOK.title,
        },
        author: {
          "@type": "Person",
          name: BOOK.authorName,
          jobTitle: BOOK.authorRole,
        },
        timeRequired: `PT${chapter.estimatedReadMinutes}M`,
        url,
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
            name: "Book",
            item: "https://signals.gitdealflow.com/book",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Read online",
            item: "https://signals.gitdealflow.com/book/read",
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
        languages={getHreflangLanguages(`/book/read/${chapter.slug}`)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/book/read/${chapter.slug}`} />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-400 mb-8">
          <Link href="/book" className="hover:text-sky-400">
            {BOOK.title}
          </Link>
          {" → "}
          <Link href="/book/read" className="hover:text-sky-400">
            Web edition
          </Link>
          {" → "}
          <span className="text-gray-300">{chapter.title}</span>
        </nav>

        <header className="space-y-3 mb-10 pb-6 border-b border-slate-800">
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-[0.18em]">
            Chapter {chapter.number} · {chapter.estimatedReadMinutes} min read
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            {chapter.title}
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed italic">
            {chapter.subtitle}
          </p>
        </header>

        <div
          className="book-prose"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        <nav className="mt-16 pt-8 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {prev ? (
            <Link
              href={`/book/read/${prev.slug}`}
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
              href={`/book/read/${next.slug}`}
              className="bg-slate-900/60 border border-slate-800 rounded-lg p-4 hover:border-slate-600 transition-colors text-right"
            >
              <p className="text-xs text-gray-400 mb-1">Next →</p>
              <p className="text-gray-100 font-semibold">{next.title}</p>
            </Link>
          ) : (
            <Link
              href="/book#download"
              className="bg-gradient-to-br from-sky-950/40 via-slate-900 to-slate-950 border border-sky-700/50 rounded-lg p-4 hover:border-sky-500 transition-colors text-right"
            >
              <p className="text-xs text-sky-300 mb-1">Done reading? →</p>
              <p className="text-gray-100 font-semibold">
                Get the free PDF + EPUB
              </p>
            </Link>
          )}
        </nav>

        <aside className="mt-12 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 border border-amber-900/40 rounded-xl p-5 space-y-3 text-sm">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            Use the methodology Monday morning
          </p>
          <p className="text-gray-300 leading-relaxed">
            The free Monday-morning Signal Digest delivers the top five firings
            from the universe of tracked organizations every week. Five
            startups, ranked, with the signal that fired and the public GitHub
            link. <Link href="/" className="text-sky-400 hover:text-sky-300">Subscribe in one click →</Link>
          </p>
        </aside>
      </article>
    </>
  );
}
