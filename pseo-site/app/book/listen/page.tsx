import type { Metadata } from "next";
import Link from "next/link";
import { BOOK } from "@/lib/book";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

const PAGE_URL = "https://signals.gitdealflow.com/book/listen";
const FEED_URL = "https://signals.gitdealflow.com/book/podcast.xml";
const AUDIO_BASE = "https://signals.gitdealflow.com/downloads/audio";

export const metadata: Metadata = {
  title: `${BOOK.title} — Audiobook (free, synthetic narration)`,
  description:
    "Listen to all eleven chapters of the SSRN-indexed methodology book on your commute. Free, synthetic narration, RSS-syndicated to Apple Podcasts and Spotify, ad-free.",
  alternates: { canonical: "/book/listen" },
  openGraph: {
    title: `${BOOK.title} — Audiobook`,
    description:
      "Eleven chapters. Synthetic narration. RSS-syndicated. Ad-free.",
    url: PAGE_URL,
    type: "website",
  },
};

const TOTAL_DURATION_MIN = BOOK.chapters.reduce(
  (sum, c) => sum + c.estimatedReadMinutes,
  0,
);

export default function BookListenPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Audiobook",
        "@id": `${PAGE_URL}#audiobook`,
        name: BOOK.title,
        bookFormat: "https://schema.org/AudiobookFormat",
        author: {
          "@type": "Person",
          name: BOOK.authorName,
          jobTitle: BOOK.authorRole,
          url: "https://signals.gitdealflow.com/about/founder",
        },
        readBy: {
          "@type": "Person",
          name: "Synthetic narration · Cartesia neural voice",
        },
        publisher: {
          "@type": "Organization",
          name: "GitDealFlow",
          url: "https://gitdealflow.com",
        },
        inLanguage: BOOK.language,
        datePublished: BOOK.publishedDate,
        isbn: BOOK.isbn,
        duration: `PT${TOTAL_DURATION_MIN}M`,
        description:
          "Audiobook edition of the SSRN-indexed methodology book. Synthetic neural narration via Cartesia, ad-free, free to stream and free to subscribe via the public RSS feed.",
        url: PAGE_URL,
        offers: {
          "@type": "Offer",
          availability: "https://schema.org/InStock",
          price: "0.00",
          priceCurrency: "EUR",
          url: PAGE_URL,
          name: "Free streaming + free RSS subscription",
        },
        hasPart: BOOK.chapters.map((c) => ({
          "@type": "AudioObject",
          name: c.title,
          alternativeHeadline: c.subtitle,
          position: c.number + 1,
          contentUrl: `${AUDIO_BASE}/${c.slug}.mp3`,
          encodingFormat: "audio/mpeg",
          duration: `PT${c.estimatedReadMinutes}M`,
          url: `${PAGE_URL}/${c.slug}`,
        })),
        workExample: {
          "@type": "Book",
          "@id": "https://signals.gitdealflow.com/book#book",
        },
      },
      {
        "@type": "PodcastSeries",
        "@id": `${PAGE_URL}#podcast`,
        name: `${BOOK.title} — Audiobook Podcast`,
        description:
          "Chapter-per-episode RSS feed of the audiobook. Subscribe in Apple Podcasts, Spotify, Overcast, Pocket Casts, or any standard RSS reader.",
        webFeed: FEED_URL,
        url: PAGE_URL,
        author: {
          "@type": "Person",
          name: BOOK.authorName,
        },
        inLanguage: BOOK.language,
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
            name: "Audiobook",
            item: PAGE_URL,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={PAGE_URL}
        languages={getHreflangLanguages("/book/listen")}
      />
      <link
        rel="alternate"
        type="application/rss+xml"
        title={`${BOOK.title} — Audiobook RSS`}
        href={FEED_URL}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/book/listen" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        <header className="space-y-5 text-center">
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-[0.18em]">
            Audiobook · Free · {TOTAL_DURATION_MIN} minutes · 11 chapters
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-100 leading-[1.05] tracking-tight">
            Listen to the book
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 leading-relaxed max-w-3xl mx-auto">
            The full {BOOK.title} narrated by a synthetic neural voice — every
            chapter free to stream, free to subscribe via RSS, ad-free, no signup
            required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-3">
            <Link
              href="/book/listen/introduction"
              className="inline-flex items-center justify-center rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-6 py-3 transition-colors"
            >
              ▶ Start the introduction
            </Link>
            <a
              href={FEED_URL}
              className="inline-flex items-center justify-center rounded-lg border border-emerald-600/60 hover:border-emerald-400 text-emerald-200 hover:text-emerald-100 font-semibold px-6 py-3 transition-colors"
            >
              Subscribe via RSS
            </a>
            <Link
              href="/book"
              className="inline-flex items-center justify-center rounded-lg border border-slate-700 hover:border-slate-500 text-gray-300 hover:text-gray-100 font-semibold px-6 py-3 transition-colors"
            >
              Read instead
            </Link>
          </div>
        </header>

        {/* Why a synthetic narration */}
        <section className="bg-gradient-to-br from-slate-900/80 via-slate-950 to-slate-950 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-3">
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            Why synthetic narration
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            The methodology pillar in the manifesto is{" "}
            <em>methodology over personality</em>. A real human narrator would
            put a face on a measurement product the same way a real human author
            would — and we&rsquo;ve chosen not to. The synthetic voice keeps the
            audiobook anonymous, consistent, regeneratable per edition, and
            costs nothing to ship in additional languages later. Cartesia&rsquo;s
            neural model is the same one used for the weekly Acceleration Watch
            on YouTube.
          </p>
        </section>

        {/* Chapter list */}
        <section className="space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 tracking-tight">
            Chapters
          </h2>
          <ol className="border border-slate-800 rounded-lg divide-y divide-slate-800">
            {BOOK.chapters.map((c) => (
              <li
                key={c.slug}
                className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 p-4 hover:bg-slate-900/60 transition-colors"
              >
                <span className="text-sky-400 font-mono text-sm font-bold w-12 flex-shrink-0">
                  {c.number === 0
                    ? "Intro"
                    : c.number === 8
                      ? "App."
                      : c.number === 9
                        ? "Walk."
                        : c.number === 10
                          ? "Conc."
                          : `0${c.number}`}
                </span>
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/book/listen/${c.slug}`}
                    className="text-gray-100 hover:text-sky-300 font-semibold text-base"
                  >
                    {c.title}
                  </Link>
                  <p className="text-gray-400 text-sm mt-0.5">{c.subtitle}</p>
                </div>
                <span className="text-gray-400 text-xs flex-shrink-0">
                  ~{c.estimatedReadMinutes} min
                </span>
              </li>
            ))}
          </ol>
        </section>

        {/* Subscribe in your podcast app */}
        <section
          id="subscribe"
          className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-700/40 rounded-xl p-6 sm:p-8 space-y-5"
        >
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            Subscribe in your podcast app
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-tight">
            One feed. Every chapter. Every podcast app.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Paste the RSS URL into any podcast app and the chapters arrive as
            episodes. New chapters and follow-on volumes auto-deliver to the
            same feed.
          </p>
          <code className="block bg-slate-950/60 border border-slate-800 rounded-lg px-4 py-3 text-emerald-200 text-sm font-mono break-all">
            {FEED_URL}
          </code>
          <div className="flex flex-wrap gap-2.5 text-sm">
            <a
              href={`https://podcasts.apple.com/podcast/id?ls=1&mt=2&app=podcast&podcast=${encodeURIComponent(FEED_URL)}`}
              className="inline-flex items-center justify-center rounded-md border border-slate-700 hover:border-slate-500 text-gray-200 px-4 py-2"
            >
              Apple Podcasts
            </a>
            <a
              href={`https://open.spotify.com/show/?feed=${encodeURIComponent(FEED_URL)}`}
              className="inline-flex items-center justify-center rounded-md border border-slate-700 hover:border-slate-500 text-gray-200 px-4 py-2"
            >
              Spotify
            </a>
            <a
              href={`https://overcast.fm/itunes/${encodeURIComponent(FEED_URL)}`}
              className="inline-flex items-center justify-center rounded-md border border-slate-700 hover:border-slate-500 text-gray-200 px-4 py-2"
            >
              Overcast
            </a>
            <a
              href={`https://pca.st/?feed=${encodeURIComponent(FEED_URL)}`}
              className="inline-flex items-center justify-center rounded-md border border-slate-700 hover:border-slate-500 text-gray-200 px-4 py-2"
            >
              Pocket Casts
            </a>
            <a
              href={FEED_URL}
              className="inline-flex items-center justify-center rounded-md border border-slate-700 hover:border-slate-500 text-gray-200 px-4 py-2"
            >
              Raw RSS
            </a>
          </div>
        </section>

        {/* Cross-sell */}
        <section className="text-center space-y-4 py-6">
          <p className="text-sm text-gray-400 max-w-2xl mx-auto">
            Prefer to read?{" "}
            <Link
              href="/book"
              className="text-sky-400 hover:text-sky-300 underline underline-offset-2"
            >
              Free PDF + EPUB
            </Link>{" "}
            ·{" "}
            <Link
              href="/book/read/introduction"
              className="text-sky-400 hover:text-sky-300 underline underline-offset-2"
            >
              Read in browser
            </Link>{" "}
            · Looking for the workflow live?{" "}
            <Link
              href="/pricing#dashboard-beta"
              className="text-amber-300 hover:text-amber-200 underline underline-offset-2"
            >
              Founding-member Dashboard €9.97/mo
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}
