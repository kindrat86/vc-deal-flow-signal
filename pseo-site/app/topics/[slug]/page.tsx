import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pillars, getPostsInPillar, type Pillar } from "@/content/pillars";
import { posts as allPosts, type BlogPost } from "@/content/posts";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return Object.keys(pillars).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pillar = pillars[slug];
  if (!pillar) return {};

  return {
    title: `${pillar.name} — Topical Series`,
    description: pillar.description,
    keywords: pillar.keywords.join(", "),
    openGraph: {
      title: `${pillar.name} — Topical Series`,
      description: pillar.description,
      type: "website",
      images: ["/opengraph-image"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${pillar.name} — Topical Series`,
      description: pillar.description,
      images: ["/opengraph-image"],
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
  const pillar = pillars[slug];

  if (!pillar) {
    notFound();
  }

  const pillarPosts = getPostsForPillar(pillar);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: `${pillar.name} — Topical Series`,
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
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
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
                className="text-xs text-gray-500 border border-slate-800 rounded-full px-3 py-1"
              >
                {kw}
              </span>
            ))}
          </div>
        </header>

        <section className="mb-12" aria-label={`Articles in ${pillar.name}`}>
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Articles in this series ({pillarPosts.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {pillarPosts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
              >
                <time
                  dateTime={p.date}
                  className="text-xs text-gray-500 mb-2 block"
                >
                  {p.date}
                </time>
                <h3 className="text-gray-100 font-medium text-base group-hover:text-sky-400 transition-colors mb-2 leading-snug">
                  {p.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-3">
                  {p.description}
                </p>
              </Link>
            ))}
          </div>
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
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
          >
            Get the Report
          </Link>
        </div>

        <AgentMirrorLinks path={`/topics/${slug}`} qaCategory="blog" />
      </div>
    </>
  );
}
