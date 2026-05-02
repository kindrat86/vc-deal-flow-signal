import type { Metadata } from "next";
import Link from "next/link";
import { allPosts as posts } from "@/content/posts";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title: "Blog — VC Deal Flow Signal",
  description:
    "Insights on using GitHub engineering signals for startup investing. Practical guides for VCs and angel investors on reading engineering momentum as a leading indicator of traction.",
  alternates: {
    canonical: "/blog",
    types: {
      "application/rss+xml": `${SITE}/feed.xml`,
      "application/feed+json": `${SITE}/feed.json`,
    },
  },
};

export default function BlogIndex() {
  // ItemList of every post — gives Yandex (and other "low-value" classifiers)
  // a strong inbound link graph from the index page. Pairs with the body
  // <a> tags below; the JSON-LD ItemList carries position metadata that
  // LLM crawlers use to rank.
  const itemList = posts.map((post, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: `${SITE}/blog/${post.slug}`,
    name: post.title,
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Blog",
        "@id": `${SITE}/blog#blog`,
        name: "Signal Intelligence Blog",
        description:
          "Practical guides on using GitHub engineering data for startup investing.",
        url: `${SITE}/blog`,
        inLanguage: "en-US",
        publisher: { "@id": "https://gitdealflow.com/#organization" },
        blogPost: posts.slice(0, 25).map((post) => ({
          "@type": "BlogPosting",
          "@id": `${SITE}/blog/${post.slug}#post`,
          headline: post.title,
          description: post.description,
          datePublished: post.date,
          url: `${SITE}/blog/${post.slug}`,
          author: { "@id": "https://gitdealflow.com/#organization" },
          mainEntityOfPage: `${SITE}/blog/${post.slug}`,
        })),
      },
      {
        "@type": "CollectionPage",
        "@id": `${SITE}/blog#webpage`,
        name: "Signal Intelligence Blog",
        description:
          "Insights on using GitHub engineering signals for startup investing. Practical guides for VCs and angel investors.",
        url: `${SITE}/blog`,
        isPartOf: { "@id": `${SITE}/#website` },
        mainEntity: { "@id": `${SITE}/blog#blog` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", ".speakable", "[data-agent-summary]"],
        },
        relatedLink: [
          `${SITE}/research`,
          `${SITE}/methodology`,
          `${SITE}/glossary`,
          `${SITE}/faq`,
          `${SITE}/citations`,
          `${SITE}/answers`,
          `${SITE}/trending`,
          `${SITE}/data-sources`,
        ],
        significantLink: [
          `${SITE}/qa.jsonl`,
          `${SITE}/qa.json`,
          `${SITE}/llms-full.txt`,
          `${SITE}/research/citations.bib`,
          "https://ssrn.com/abstract=6606558",
        ],
      },
      {
        "@type": "ItemList",
        name: "All blog posts",
        numberOfItems: posts.length,
        itemListElement: itemList,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "All Sectors",
            item: SITE,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: `${SITE}/blog`,
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
      <AgentMirrorLinks path="/blog" />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Blog</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Signal Intelligence Blog
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-6">
          Practical guides on using GitHub engineering data for startup
          investing. How to read the signals, what patterns predict fundraises,
          and how to build a data-driven deal flow practice.
        </p>

        {/* Cross-cluster pillar links — fixes Yandex "low-value" classifier
            by giving the blog index a strong outbound link graph into the
            authoritative pages. */}
        <nav
          aria-label="Related pillars"
          className="mb-10 flex flex-wrap gap-2 text-xs"
        >
          <Link
            href="/research"
            className="rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
          >
            Research (30 findings)
          </Link>
          <Link
            href="/methodology"
            className="rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
          >
            Methodology
          </Link>
          <Link
            href="/glossary"
            className="rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
          >
            Glossary
          </Link>
          <Link
            href="/faq"
            className="rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
          >
            FAQ
          </Link>
          <Link
            href="/citations"
            className="rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
          >
            Citations
          </Link>
          <Link
            href="/answers"
            className="rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
          >
            AI Answers
          </Link>
          <Link
            href="/trending"
            className="rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
          >
            Trending
          </Link>
          <a
            href="/feed.xml"
            className="rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
          >
            RSS
          </a>
          <a
            href="/feed.json"
            className="rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
          >
            JSON Feed
          </a>
        </nav>

        <div className="space-y-6">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-6 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
            >
              <p className="text-gray-500 text-xs mb-2">{post.date}</p>
              <h2 className="text-gray-100 font-semibold text-lg mb-2 group-hover:text-sky-400 transition-colors">
                {post.title}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                {post.description}
              </p>
              <span className="mt-3 inline-block text-sky-500 text-xs font-medium group-hover:text-sky-400 transition-colors">
                Read more &rarr;
              </span>
            </Link>
          ))}
        </div>

        {/* Inline post archive list — gives Yandex/Google a flat link list
            of every post URL on the page, which matters for low-value
            classifier rehabilitation. */}
        <section className="mt-12" aria-label="Full post archive">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            Full post archive
          </h2>
          <ul className="space-y-1.5 text-sm">
            {posts.map((post) => (
              <li key={post.slug} className="text-gray-500">
                <span className="text-gray-600 font-mono text-xs mr-2">
                  {post.date}
                </span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-gray-300 hover:text-sky-400 transition-colors"
                >
                  {post.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
