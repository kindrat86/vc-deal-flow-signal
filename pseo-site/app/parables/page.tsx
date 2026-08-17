import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { DATA_NERD_NAME, DATA_NERD_PARABLES } from "@/lib/data-nerd";
import SeoCta from "@/components/SeoCta";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-static";

// Two parables resolve on raw engineering jargon in their punchline
// ("monorepo migration" / "off-by-one in the contributor-deduplication
// step"). For the non-coding reader (corp-dev / PE / angel), a one-line
// plain-English gloss is rendered after the lesson so the point lands
// without code. Keyed by slug; lib/data-nerd.ts is the source of truth
// and is left untouched.
const PARABLE_PLAIN_GLOSS: Record<string, string> = {
  "wrong-reader":
    "In plain terms: the model briefly mistook a big internal code cleanup for real momentum, and a reader caught the false alarm before we did.",
  "tuesday-regression":
    "In plain terms: one late-night change quietly broke the math, so a few wrong names reached the top of the list, readers flagged it, and the whole fix was made public the same week.",
};

// Brunson Expert Secrets Ch 5 (Storytelling) + DCS Ch 7 (Attractive
// Character): every core claim needs a parable that makes it feel
// obvious. The /data-nerd character bible already lists the six
// parables inline; this index page makes each one *hyperlinkable so
// you can send a single one to a friend without sending the bible.*
//
// Per-parable pages live at /parables/[slug] (SSG via
// generateStaticParams). Each one is a standalone page with the story,
// the lesson, the email anchor where it first surfaced, and an
// invitation to read the next one.

export const metadata: Metadata = withEditorialOverride({
  title: `Six parables, the teaching stories of ${DATA_NERD_NAME}`,
  description:
    "Six parables The Data Nerd rotates through emails, videos, and the Sunday digest. Each one is a single story with a single lesson, hyperlinkable so you can send one to a friend without sending the whole character bible.",
  alternates: { canonical: "/parables" },
  openGraph: {
    title: `Six parables, ${DATA_NERD_NAME}`,
    description:
      "Six teaching stories. Each one a hyperlinkable standalone page.",
    url: "https://signals.gitdealflow.com/parables",
    type: "article",
  },
});

export default function ParablesIndexPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": "https://signals.gitdealflow.com/parables#page",
        url: "https://signals.gitdealflow.com/parables",
        name: `Six parables, ${DATA_NERD_NAME}`,
        description:
          "Index of six teaching stories the founder character rotates through emails, videos, and the Sunday digest.",
        inLanguage: "en-US",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2", "h3"],
        },
      },
      {
        "@type": "ItemList",
        name: "Six parables",
        numberOfItems: DATA_NERD_PARABLES.length,
        itemListElement: DATA_NERD_PARABLES.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: p.title,
          url: `https://signals.gitdealflow.com/parables/${p.slug}`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Parables", item: "https://signals.gitdealflow.com/parables" },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/parables"
        languages={getHreflangLanguages("/parables")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/parables" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <nav className="text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Parables</span>
        </nav>

        <header className="space-y-4">
          <p className="text-amber-300 text-xs font-medium uppercase tracking-wider">
            The teaching stories of {DATA_NERD_NAME}
          </p>
          <h1
            className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.05] tracking-tight"
            data-speakable
          >
            Six parables.{" "}
            <span className="text-amber-300">
              Each one a single page you can send to a friend.
            </span>
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
            data-speakable
          >
            Every core claim about engineering acceleration on this site
            traces back to one of six small stories. They&rsquo;re what I
            tell at dinner if someone asks why GitHub data leads the deal
            flow. Each one has its own page, pick the one that fits
            your reader and send the URL.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-amber-700/40 pl-4">
            These are for the <strong className="text-amber-200">First Mover</strong>: the investor who reaches the founder before the round. The creed
            is one line: <em>&ldquo;We move on the engineering signal before
            the round, without reading a line of code.&rdquo;</em> You never
            read a line of code; the read is done for you.
          </p>
        </header>

        <ol className="space-y-5">
          {DATA_NERD_PARABLES.map((p, i) => (
            <li
              key={p.slug}
              className="rounded-xl border-l-4 border-amber-500 bg-slate-900/60 p-5 sm:p-6 space-y-3"
            >
              <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
                Parable {i + 1}
              </p>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
                <Link
                  href={`/parables/${p.slug}`}
                  className="hover:text-amber-200 underline decoration-dotted"
                >
                  {p.title}
                </Link>
              </h2>
              <p className="text-gray-300 text-base leading-relaxed">
                {p.body}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed border-t border-slate-800 pt-3">
                <strong className="text-emerald-300">Lesson:</strong>{" "}
                {p.lesson}
              </p>
              {PARABLE_PLAIN_GLOSS[p.slug] && (
                <p className="text-gray-400 text-sm leading-relaxed italic">
                  {PARABLE_PLAIN_GLOSS[p.slug]}
                </p>
              )}
              <Link
                href={`/parables/${p.slug}`}
                className="inline-flex items-center gap-1 text-sm font-bold text-amber-300 hover:text-amber-200 underline decoration-dotted"
              >
                Open the standalone page →
              </Link>
            </li>
          ))}
        </ol>

        <SeoCta
          heading="The parables make the case. The Sunday issue is the proof."
          blurb="Five breakout startups every Sunday, the engineering signal translated into plain English, 21 to 47 days before the deck circulates. No code-reading, no card."
          secondary={{ label: "Or test one sector, First Look €7 →", href: "/firstlook" }}
          className="mt-4"
        />

        <section className="border-t border-slate-800 pt-8 space-y-3">
          <p className="text-gray-400 text-sm leading-relaxed">
            Read more from the founder character -
          </p>
          <ul className="space-y-1.5 text-sm">
            <li>
              →{" "}
              <Link
                href="/data-nerd"
                className="text-amber-300 hover:text-amber-200 underline decoration-dotted font-semibold"
              >
                The full character bible
              </Link>{" "}
              (archetype, polarity, parables, voice rules, flaws).
            </li>
            <li>
              →{" "}
              <Link
                href="/now"
                className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted font-semibold"
              >
                /now, what I&rsquo;m working on this week
              </Link>{" "}
              (updated every Monday).
            </li>
            <li>
              →{" "}
              <Link
                href="/manifesto"
                className="text-rose-300 hover:text-rose-200 underline decoration-dotted font-semibold"
              >
                The manifesto
              </Link>{" "}
              (seven pillars, named enemy, who&rsquo;s on the bus).
            </li>
            <li>
              →{" "}
              <Link
                href="/origin"
                className="text-sky-300 hover:text-sky-200 underline decoration-dotted font-semibold"
              >
                The origin story
              </Link>{" "}
              (why I built the regression in the first place).
            </li>
          </ul>
        </section>
      </div>
    </>
  );
}
