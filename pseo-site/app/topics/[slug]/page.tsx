import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pillars, getPostsInPillar, type Pillar } from "@/content/pillars";
import { posts as allPosts, type BlogPost } from "@/content/posts";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import SeoCta from "@/components/SeoCta";
import RelatedLinks from "@/components/RelatedLinks";
import { getRelatedGroups } from "@/lib/related-links";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(pillars).map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pillar = pillars[slug];
  if (!pillar) return {};

  return {
    title: `${pillar.name}, Topical Series`,
    description: pillar.description,
    keywords: pillar.keywords.join(", "),
    openGraph: {
      title: `${pillar.name}, Topical Series`,
      description: pillar.description,
      type: "website",
      url: `/topics/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${pillar.name}, Topical Series`,
      description: pillar.description,
    },
    alternates: {
      canonical: `/topics/${slug}`,
    },
  };
}

function getPostsForPillar(pillar: Pillar): BlogPost[] {
  const slugs = getPostsInPillar(pillar.slug);
  return slugs
    .map((s) => allPosts.find((p) => p.slug === s))
    .filter((p): p is BlogPost => Boolean(p))
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export default async function TopicHubPage({ params }: PageProps) {
  const { slug } = await params;
  const pathname = `/topics/${slug}`;
  const pillar = pillars[slug];

  if (!pillar) {
    notFound();
  }

  const pillarPosts = getPostsForPillar(pillar);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `https://signals.gitdealflow.com/topics/${slug}#webpage`,
        url: `https://signals.gitdealflow.com/topics/${slug}`,
        name: `${pillar.name}, Topical Series | VC Deal Flow Signal`,
        description: pillar.description,
        inLanguage: "en-US",
        isAccessibleForFree: true,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "CollectionPage",
        name: `${pillar.name}, Topical Series`,
        description: pillar.description,
        url: `https://signals.gitdealflow.com/topics/${slug}`,
        about: {
          "@type": "Thing",
          name: pillar.name,
          description: pillar.description,
        },
        keywords: pillar.keywords.join(", "),
        isPartOf: {
          "@type": "CreativeWorkSeries",
          name: pillar.name,
          description: pillar.description,
        },
        hasPart: pillarPosts.map((p) => ({
          "@type": "Article",
          headline: p.title,
          description: p.description,
          datePublished: p.date,
          url: `https://signals.gitdealflow.com/blog/${p.slug}`,
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
            name: "Topics",
            item: "https://signals.gitdealflow.com/topics",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: pillar.name,
            item: `https://signals.gitdealflow.com/topics/${slug}`,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `https://signals.gitdealflow.com/topics/${slug}#webpage`,
        url: `https://signals.gitdealflow.com/topics/${slug}`,
        name: `${pillar.name}, Topical Series`,
        description: pillar.description,
        inLanguage: "en-US",
        isPartOf: { "@id": "https://signals.gitdealflow.com/#website" },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", ".speakable", "[data-agent-summary]"],
        },
        keywords: pillar.keywords.join(", "),
      },
      {
        "@type": "FAQPage",
        "@id": `https://signals.gitdealflow.com/topics/${slug}#faq`,
        url: `https://signals.gitdealflow.com/topics/${slug}`,
        inLanguage: "en-US",
        mainEntity: [
          {
            "@type": "Question",
            name: `What is the "${pillar.name}" topical series?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${pillar.description} The series collects ${pillarPosts.length} long-form posts on this topic, organised by publish date. Each post is published under CC BY 4.0 and indexed in /llms.txt for AI-assistant retrieval.`,
            },
          },
          {
            "@type": "Question",
            name: `Which keywords does this series cover?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `${pillar.keywords.join(", ")}.`,
            },
          },
          {
            "@type": "Question",
            name: `Where can I follow new posts in this series?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Subscribe to the site-wide RSS at /feed.xml, every new post in any topical series appears in the same feed within five minutes of publish. The free weekly Signal Report email also includes the latest series update.`,
              url: "https://signals.gitdealflow.com/feed.xml",
            },
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`https://signals.gitdealflow.com/topics/${slug}`}
        languages={getHreflangLanguages(`/topics/${slug}`)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/topics/${slug}`} qaCategory="blog" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link href="/topics" className="hover:text-gray-300 transition-colors">
            Topics
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{pillar.name}</span>
        </nav>

        <header className="mb-10">
          <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-3">
            Topical Series
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            {pillar.name}
          </h1>
          <p className="text-gray-400 text-base leading-relaxed mb-6">
            {pillar.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {pillar.keywords.map((kw) => (
              <span
                key={kw}
                className="text-xs text-gray-400 border border-slate-800 rounded-full px-3 py-1"
              >
                {kw}
              </span>
            ))}
          </div>
        </header>

        <section className="mb-12" aria-label={`Articles in ${pillar.name}`}>
          <h2 className="text-xl font-semibold text-gray-100 mb-2">
            Articles in this series ({pillarPosts.length})
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            {pillarPosts.length === 1
              ? "This series opens with a single foundational post; the pillar map below shows where the series goes next."
              : `The series runs ${pillarPosts[pillarPosts.length - 1]?.date} through ${pillarPosts[0]?.date}, ${pillarPosts.length} posts so far, newest first below.`}
            {pillarPosts.length >= 2 &&
              ` The spread of publish dates is the cadence: the pillar is maintained, not a one-off essay collection.`}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillarPosts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
              >
                <time
                  dateTime={p.date}
                  className="text-xs text-gray-400 mb-2 block"
                >
                  {p.date}
                </time>
                <h3 className="text-gray-100 font-medium text-base group-hover:text-sky-400 transition-colors mb-2 leading-snug">
                  {p.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                  {p.description}
                </p>
              </Link>
            ))}
          </div>
        </section>

        <section
          className="mb-12 rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6"
          aria-label="How this pillar fits together"
        >
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            How this pillar fits together
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            &quot;{pillar.name}&quot; is one of{" "}
            {Object.keys(pillars).length} topical series on the site, and its
            scope is deliberately narrow: {pillar.description.toLowerCase()}{" "}
            The keyword set ({pillar.keywords.slice(0, 4).join(", ")}) marks
            the edges of that scope.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-3">
            {pillarPosts.length >= 2
              ? `Each post in the grid above covers one slice of that scope, and together the ${pillarPosts.length} posts sequence from measurement (what the signals are) to workflow (what an investor does with them). Read them in publish order if you are new to the series; jump to the newest if you already run a sourcing stack.`
              : "The post in the grid above opens the sequence from measurement (what the signals are) to workflow (what an investor does with them)."}
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            The pillar interlocks with the dataset itself: every claim in the
            series cites the same weekly-recomputed{" "}
            <Link
              href="/methodology"
              className="text-sky-400 hover:text-sky-300 underline underline-offset-2"
            >
              methodology
            </Link>{" "}
            and the same machine-readable feeds, so the essays age as data
            updates rather than as opinions.
          </p>
        </section>

        <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Get this week&apos;s top breakout startups
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            Top breakout engineering signals across all sectors, straight to
            your inbox. Free, no spam.
          </p>
          <Link
            href="https://gitdealflow.com/#signup"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-signal-500 hover:bg-signal-600 text-slate-950 text-sm font-medium transition-colors"
          >
            Get the Report
          </Link>
        </div>

        <SeoCta className="mt-10" />
        <RelatedLinks groups={getRelatedGroups(pathname)} heading="Related views" />
      </div>
    </>
  );
}
