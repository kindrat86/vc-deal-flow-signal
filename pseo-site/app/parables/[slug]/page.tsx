import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import {
  DATA_NERD_NAME,
  DATA_NERD_PARABLES,
  DATA_NERD_TRIBE,
} from "@/lib/data-nerd";
import SeoCta from "@/components/SeoCta";

export const dynamic = "force-static";
// Block requests for slugs not pre-rendered at build time. Brunson DCS
// Ch 7: the canon is closed, six parables, no auto-generated extras.
export const dynamicParams = false;

type Params = Promise<{ slug: string }>;

// Next 16: generateStaticParams returns the param values to pre-render.
// Each parable in lib/data-nerd.ts becomes its own SSG page.
export function generateStaticParams() {
  return DATA_NERD_PARABLES.map((p) => ({ slug: p.slug }));
}

function findParable(slug: string) {
  return DATA_NERD_PARABLES.find((p) => p.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const parable = findParable(slug);
  if (!parable) {
    return {
      title: "Parable not found",
      robots: { index: false, follow: false },
    };
  }
  return {
    title: `${parable.title}, a parable from ${DATA_NERD_NAME}`,
    description: parable.lesson,
    alternates: { canonical: `/parables/${parable.slug}` },
    openGraph: {
      title: `${parable.title}, ${DATA_NERD_NAME}`,
      description: parable.lesson,
      url: `https://signals.gitdealflow.com/parables/${parable.slug}`,
      type: "article",
    },
  };
}

export default async function ParablePage({ params }: { params: Params }) {
  const { slug } = await params;
  const parable = findParable(slug);
  if (!parable) notFound();

  const idx = DATA_NERD_PARABLES.findIndex((p) => p.slug === parable.slug);
  const prev = idx > 0 ? DATA_NERD_PARABLES[idx - 1] : null;
  const next =
    idx < DATA_NERD_PARABLES.length - 1
      ? DATA_NERD_PARABLES[idx + 1]
      : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `https://signals.gitdealflow.com/parables/${parable.slug}#article`,
        headline: parable.title,
        description: parable.lesson,
        articleBody: parable.body,
        url: `https://signals.gitdealflow.com/parables/${parable.slug}`,
        author: {
          "@type": "Person",
          "@id": "https://signals.gitdealflow.com/about#person",
          name: DATA_NERD_NAME,
        },
        publisher: {
          "@type": "Organization",
          "@id": "https://gitdealflow.com/#organization",
          name: "VC Deal Flow Signal",
        },
        inLanguage: "en-US",
        license: "https://creativecommons.org/licenses/by/4.0/",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
        isPartOf: {
          "@type": "CollectionPage",
          "@id": "https://signals.gitdealflow.com/parables#page",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Parables", item: "https://signals.gitdealflow.com/parables" },
          {
            "@type": "ListItem",
            position: 3,
            name: parable.title,
            item: `https://signals.gitdealflow.com/parables/${parable.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`https://signals.gitdealflow.com/parables/${parable.slug}`}
        languages={getHreflangLanguages(`/parables/${parable.slug}`)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/parables/${parable.slug}`} />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <nav className="text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/parables"
            className="hover:text-gray-300 transition-colors"
          >
            Parables
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{parable.title}</span>
        </nav>

        <header className="space-y-4">
          <p className="text-amber-300 text-xs font-medium uppercase tracking-wider">
            Parable {idx + 1} of {DATA_NERD_PARABLES.length} ·{" "}
            {DATA_NERD_NAME}
          </p>
          <h1
            className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.05] tracking-tight"
            data-speakable
          >
            {parable.title}
          </h1>
        </header>

        <article className="space-y-6">
          <p
            className="text-gray-100 text-lg sm:text-xl leading-relaxed"
            data-speakable
          >
            {parable.body}
          </p>

          <div className="rounded-xl border border-emerald-700/30 bg-gradient-to-br from-emerald-950/15 via-slate-900 to-slate-950 p-5 sm:p-6 space-y-2">
            <p className="text-emerald-300 text-[10px] font-semibold uppercase tracking-wider">
              The lesson
            </p>
            <p className="text-gray-100 text-base leading-relaxed">
              {parable.lesson}
            </p>
          </div>

          <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-amber-700/40 pl-4">
            <strong className="text-amber-200">Why this matters for{" "}
              {DATA_NERD_TRIBE.name}:</strong>{" "}
            The parables aren&rsquo;t metaphors for branding. They&rsquo;re
            the shape of the underlying claim. If you find yourself nodding
            at this story, the rest of the methodology will land. If you
            think the story is wrong, the product probably is too, and
            that&rsquo;s honest.
          </p>
        </article>

        {/* PREV / NEXT, Brunson Expert Secrets Ch 5: serialized story
            chains. Each page closes by previewing the next so the
            reader-as-tribe-member finishes the bible. */}
        <nav
          aria-label="Parable navigation"
          className="border-t border-slate-800 pt-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {prev ? (
            <Link
              href={`/parables/${prev.slug}`}
              className="block rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900/40 p-4 transition-colors group"
            >
              <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-1">
                ← Previous parable
              </p>
              <p className="text-gray-200 group-hover:text-gray-100 text-sm font-semibold leading-snug">
                {prev.title}
              </p>
            </Link>
          ) : (
            <div className="block rounded-lg border border-slate-800/40 bg-slate-900/20 p-4">
              <p className="text-gray-500 text-[10px] font-semibold uppercase tracking-wider mb-1">
                ← First in the series
              </p>
              <p className="text-gray-500 text-sm leading-snug">
                You&rsquo;re at the start.
              </p>
            </div>
          )}
          {next ? (
            <Link
              href={`/parables/${next.slug}`}
              className="block rounded-lg border border-amber-700/40 hover:border-amber-600/60 bg-amber-950/15 p-4 transition-colors group sm:text-right"
            >
              <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider mb-1">
                Next parable →
              </p>
              <p className="text-gray-200 group-hover:text-gray-100 text-sm font-semibold leading-snug">
                {next.title}
              </p>
            </Link>
          ) : (
            <Link
              href="/data-nerd"
              className="block rounded-lg border border-amber-700/40 hover:border-amber-600/60 bg-amber-950/15 p-4 transition-colors group sm:text-right"
            >
              <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider mb-1">
                You&rsquo;ve read all six →
              </p>
              <p className="text-gray-200 group-hover:text-gray-100 text-sm font-semibold leading-snug">
                Open the full character bible
              </p>
            </Link>
          )}
        </nav>

        <SeoCta
          heading="One parable landed. The Sunday issue is where the pattern pays off."
          blurb="Five breakout startups every Sunday, the engineering signal in plain English, 21 to 47 days before the deck circulates. No code-reading, no card."
          className="mt-2"
        />

        <section className="border-t border-slate-800 pt-8 space-y-3 text-sm">
          <p className="text-gray-400 leading-relaxed">
            Send this single page to a friend instead of forwarding the
            whole bible. The URL is permanent and the page is{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-300 hover:text-amber-200 underline decoration-dotted"
            >
              CC BY 4.0
            </a>{" "}
copy the text, quote the lesson, attribute the source.
          </p>
          <ul className="space-y-1.5">
            <li>
              →{" "}
              <Link
                href="/parables"
                className="text-amber-300 hover:text-amber-200 underline decoration-dotted font-semibold"
              >
                Index of all six parables
              </Link>
            </li>
            <li>
              →{" "}
              <Link
                href="/data-nerd"
                className="text-amber-300 hover:text-amber-200 underline decoration-dotted font-semibold"
              >
                The full {DATA_NERD_NAME} character bible
              </Link>
            </li>
            <li>
              →{" "}
              <a
                href="https://gitdealflow.com/#signup"
                rel="noopener noreferrer"
                className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted font-semibold"
              >
                Subscribe to the free Sunday digest
              </a>
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
