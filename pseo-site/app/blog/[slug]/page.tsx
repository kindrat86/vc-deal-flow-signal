import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, getAllPostSlugs, posts } from "@/content/posts";
import { getAllSectors, getCurrentPeriod } from "@/lib/data";
import { getAuthor } from "@/content/authors";
import { slugify } from "@/lib/slugify";
import { getPillarForPost, getPostsInPillar } from "@/content/pillars";
import figureRegistry from "@/components/figures";
import StatCallout from "@/components/StatCallout";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

/**
 * Post-to-author override map. Most posts are authored by the default persona;
 * a small curated subset uses the research-desk or founder-perspective bylines
 * for E-E-A-T diversity. Keys are post slugs; values are keys from authors.ts.
 */
const POST_AUTHOR_OVERRIDES: Record<string, string> = {
  "alternative-data-venture-capital": "engineering-research",
  "github-signals-vs-hiring-data": "engineering-research",
  "github-due-diligence-for-vcs": "engineering-research",
  "startup-engineering-metrics-investors-should-track": "engineering-research",
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
    },
    alternates: {
      canonical: `/blog/${slug}`,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  const today = new Date().toISOString().slice(0, 10);
  if (post.date > today) {
    notFound();
  }

  const author = getAuthor(POST_AUTHOR_OVERRIDES[slug]);

  const pillar = getPillarForPost(slug);
  const relatedPostSlugs = pillar
    ? getPostsInPillar(pillar.slug).filter((s) => s !== slug)
    : [];
  const relatedPosts = relatedPostSlugs
    .map((s) => {
      const p = posts.find((post) => post.slug === s);
      return p ? { slug: p.slug, title: p.title, description: p.description } : null;
    })
    .filter((p): p is { slug: string; title: string; description: string } => p !== null)
    .slice(0, 4);

  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const relatedSectorData = post.relatedSectors
    .map((rs) => {
      const sector = sectors.find((s) => s.slug === rs);
      if (!sector || !sector.periods[period.slug]) return null;
      return {
        name: sector.name,
        slug: `${sector.slug}-${period.slug}`,
        count: sector.periods[period.slug].startups.length,
      };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);

  // Build TOC from H2 headings in post body
  const headings: { text: string; id: string }[] = [];
  for (const block of post.body.split("\n\n")) {
    const trimmed = block.trim();
    if (trimmed.startsWith("## ")) {
      const text = trimmed.slice(3).trim();
      headings.push({ text, id: slugify(text) });
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: post.title,
        description: post.description,
        datePublished: post.date,
        dateModified: post.date,
        author: {
          "@type": "Person",
          name: author.name,
          url: author.url,
          jobTitle: author.jobTitle,
          affiliation: {
            "@type": "Organization",
            name: author.affiliation,
            url: "https://gitdealflow.com",
          },
          knowsAbout: author.credentials,
          sameAs: author.sameAs,
        },
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
          logo: "https://signals.gitdealflow.com/opengraph-image",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[aria-label='Summary']", "h1"],
        },
        ...(pillar
          ? {
              articleSection: pillar.name,
              keywords: pillar.keywords.join(", "),
              about: {
                "@type": "Thing",
                name: pillar.name,
                description: pillar.description,
              },
              isPartOf: {
                "@type": "CreativeWorkSeries",
                name: pillar.name,
                description: pillar.description,
              },
            }
          : {}),
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
            name: "Blog",
            item: "https://signals.gitdealflow.com/blog",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: `https://signals.gitdealflow.com/blog/${slug}`,
          },
        ],
      },
      ...(post.faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: post.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            },
          ]
        : []),
      ...(post.howTo
        ? [
            {
              "@type": "HowTo",
              name: post.howTo.name,
              description: post.howTo.description,
              ...(post.howTo.totalTime
                ? { totalTime: post.howTo.totalTime }
                : {}),
              step: post.howTo.steps.map((step, i) => ({
                "@type": "HowToStep",
                position: i + 1,
                name: step.name,
                text: step.text,
              })),
            },
          ]
        : []),
    ],
  };

  // Build a set of valid reference labels for this post
  const refLabels = new Set((post.references ?? []).map((r) => r.label));

  // Parse inline markdown links [text](/path) and citation markers [1] into elements
  function renderInline(text: string): React.ReactNode[] {
    const parts: React.ReactNode[] = [];
    // Match markdown links [text](url) or bare citation markers [1], [2], etc.
    const tokenRe = /\[([^\]]+)\]\(([^)]+)\)|\[(\d+)\]/g;
    let last = 0;
    let match;
    while ((match = tokenRe.exec(text)) !== null) {
      if (match.index > last) parts.push(text.slice(last, match.index));
      if (match[2]) {
        // Markdown link
        parts.push(
          <Link
            key={match.index}
            href={match[2]}
            className="text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors"
          >
            {match[1]}
          </Link>
        );
      } else if (match[3] && refLabels.has(match[3])) {
        // Citation marker – link to references section
        parts.push(
          <sup key={match.index}>
            <a
              href="#references"
              className="text-sky-500 hover:text-sky-400 font-mono text-[10px] no-underline"
            >
              [{match[3]}]
            </a>
          </sup>
        );
      } else {
        // Unknown bracket content – keep as-is
        parts.push(match[0]);
      }
      last = match.index + match[0].length;
    }
    if (last < text.length) parts.push(text.slice(last));
    return parts;
  }

  // Build a set of figure insertions keyed by heading substring
  const figureMap = new Map<string, React.ComponentType>();
  for (const fig of post.figures ?? []) {
    const Component = figureRegistry[fig.id];
    if (Component) figureMap.set(fig.afterHeading, Component);
  }

  // Convert markdown-ish body to simple HTML paragraphs, inserting figures after matching H2s
  const sections = post.body.split("\n\n").flatMap((block, i) => {
    const trimmed = block.trim();
    if (trimmed.startsWith("## ")) {
      const headingText = trimmed.slice(3);
      const headingId = slugify(headingText);
      const nodes: React.ReactNode[] = [
        <h2
          key={i}
          id={headingId}
          className="group text-xl font-semibold text-gray-100 mt-10 mb-4 scroll-mt-20"
        >
          <a
            href={`#${headingId}`}
            aria-label={`Link to section: ${headingText}`}
            className="inline-block"
          >
            {headingText}
            <span className="ml-2 text-sky-600 opacity-0 group-hover:opacity-100 transition-opacity text-sm align-middle">
              #
            </span>
          </a>
        </h2>,
      ];
      // Check if any figure should be inserted after this heading
      for (const [substring, Component] of figureMap) {
        if (headingText.includes(substring)) {
          nodes.push(<Component key={`fig-${i}`} />);
          break;
        }
      }
      return nodes;
    }
    if (trimmed.startsWith("**") && trimmed.includes("**:")) {
      const [, label, rest] = trimmed.match(/^\*\*(.+?)\*\*:?\s*(.*)/) || [];
      if (label) {
        return (
          <p
            key={i}
            className="text-gray-400 text-base leading-relaxed mb-4"
          >
            <strong className="text-gray-200">{label}:</strong> {renderInline(rest)}
          </p>
        );
      }
    }
    if (trimmed.match(/^\d+\.\s/)) {
      const items = trimmed.split("\n").map((line) => line.replace(/^\d+\.\s+/, ""));
      return (
        <ol key={i} className="list-decimal list-inside space-y-2 text-gray-400 text-base mb-4 pl-4">
          {items.map((item, j) => (
            <li key={j}>{renderInline(item)}</li>
          ))}
        </ol>
      );
    }
    return (
      <p key={i} className="text-gray-400 text-base leading-relaxed mb-4">
        {renderInline(trimmed)}
      </p>
    );
  });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/blog"
            className="hover:text-gray-300 transition-colors"
          >
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{post.title}</span>
        </nav>

        <article>
          <header className="mb-8">
            <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
              <Link href={author.url} className="hover:text-gray-300 transition-colors font-medium">
                {author.name}
              </Link>
              <span className="text-slate-700">|</span>
              <span className="text-gray-500 text-xs">{author.jobTitle}</span>
              <span className="text-slate-700">|</span>
              <time dateTime={post.date}>{post.date}</time>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
              {post.title}
            </h1>
            <p className="text-gray-400 text-base leading-relaxed">
              {post.description}
            </p>
          </header>

          {/* Summary block – self-contained for AI extraction */}
          {post.summary && (
            <section className="mb-10" aria-label="Summary">
              <div className="rounded-lg border border-sky-900/50 bg-sky-950/30 p-5">
                <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
                  Key Takeaway
                </p>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {post.summary}
                </p>
              </div>
            </section>
          )}

          {/* Table of contents – AEO win + jump-link anchors for AI answer engines */}
          {headings.length >= 2 && (
            <nav
              className="mb-10 rounded-lg border border-slate-800 bg-slate-900/50 p-5"
              aria-label="Table of contents"
            >
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                In this article
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-sm">
                {headings.map((h) => (
                  <li key={h.id} className="text-gray-400">
                    <a
                      href={`#${h.id}`}
                      className="text-sky-500 hover:text-sky-400 transition-colors"
                    >
                      {h.text}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Authoritative data context – concrete numbers AI models prefer to cite */}
          <div className="mb-8 flex flex-wrap gap-4 text-xs text-gray-500">
            <span>{sectors.filter((s) => s.periods[period.slug]).length} sectors tracked</span>
            <span className="text-slate-700">|</span>
            <span>{sectors.filter((s) => s.periods[period.slug]).reduce((sum, s) => sum + s.periods[period.slug].startups.length, 0)} startup signals</span>
            <span className="text-slate-700">|</span>
            <span>Data: {period.name}</span>
            <span className="text-slate-700">|</span>
            <span>Updated weekly</span>
          </div>

          {/* Key statistics – GEO-optimized quotable stat block */}
          {post.keyStats && post.keyStats.length > 0 && (
            <StatCallout
              stats={post.keyStats}
              source="VC Deal Flow Signal"
              sourceHref="https://signals.gitdealflow.com"
            />
          )}

          <div className="prose-invert">{sections}</div>

          {/* Sources footer – boosts AI citation confidence */}
          <footer className="mt-10 pt-6 border-t border-slate-800">
            <p className="text-gray-600 text-xs leading-relaxed">
              <strong className="text-gray-500">Sources &amp; methodology:</strong> According
              to data from{" "}
              <a
                href="https://docs.github.com/en/rest"
                className="text-sky-600 hover:text-sky-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                GitHub API v3
              </a>{" "}
              (commit activity, contributor counts, repository metadata),
              as analyzed by{" "}
              <Link href="/methodology" className="text-sky-600 hover:text-sky-500">
                VC Deal Flow Signal&apos;s methodology
              </Link>
              . Signal classification and engineering acceleration metrics are
              computed weekly across {sectors.filter((s) => s.periods[period.slug]).length} startup
              sectors. Data current as of {period.name}. This is not investment advice.
            </p>

            {/* Author bio – E-E-A-T signal for Google and LLM reviewers */}
            <div className="mt-6 rounded-lg border border-slate-800 bg-slate-900/50 p-5">
              <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">
                About the author
              </p>
              <p className="text-gray-300 text-sm font-medium mb-1">{author.name}</p>
              <p className="text-gray-500 text-xs mb-2">{author.jobTitle}</p>
              <p className="text-gray-400 text-sm leading-relaxed">{author.bio}</p>
            </div>

            {/* Academic-style references */}
            {post.references && post.references.length > 0 && (
              <div className="mt-6" id="references">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">
                  References
                </p>
                <ol className="list-none space-y-1">
                  {post.references.map((ref) => (
                    <li key={ref.label} className="text-gray-600 text-xs leading-relaxed">
                      <span className="text-gray-500 font-mono">[{ref.label}]</span>{" "}
                      <a
                        href={ref.url}
                        className="text-sky-600 hover:text-sky-500 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {ref.title}
                      </a>
                      {" – "}
                      <span className="text-gray-700">{ref.source}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </footer>
        </article>

        {/* FAQ section */}
        {post.faqs.length > 0 && (
          <section
            className="mt-12 max-w-3xl"
            aria-label="Frequently asked questions"
          >
            <h2 className="text-xl font-semibold text-gray-100 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {post.faqs.map((faq) => (
                <div
                  key={faq.question}
                  className="rounded-lg border border-slate-800 bg-slate-900 p-5"
                >
                  <h3 className="text-gray-100 font-medium mb-2">
                    {faq.question}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Related articles in the same pillar — TSO topical authority signal */}
        {relatedPosts.length > 0 && pillar && (
          <section className="mt-12" aria-label={`More on ${pillar.name}`}>
            <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-2">
              Series: {pillar.name}
            </p>
            <h2 className="text-lg font-semibold text-gray-100 mb-2">
              More articles in this series
            </h2>
            <p className="text-gray-500 text-sm mb-5">{pillar.description}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.slug}
                  href={`/blog/${rp.slug}`}
                  className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
                >
                  <h3 className="text-gray-100 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1.5 leading-snug">
                    {rp.title}
                  </h3>
                  <p className="text-gray-500 text-xs leading-relaxed line-clamp-2">
                    {rp.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related sector links */}
        {relatedSectorData.length > 0 && (
          <section className="mt-12" aria-label="Related sectors">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">
              Related Sector Rankings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedSectorData.map((s) => (
                <Link
                  key={s.slug}
                  href={`/startups-to-watch/${s.slug}`}
                  className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                >
                  <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                    {s.name}
                  </h3>
                  <p className="text-gray-500 text-xs">
                    {s.count} startups tracked &rarr;
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <div className="mt-12 rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Get this week's top breakout startups
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
      </div>
    </>
  );
}
