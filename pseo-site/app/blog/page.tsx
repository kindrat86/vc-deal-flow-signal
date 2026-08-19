import type { Metadata } from "next";
import Link from "next/link";
import { allPosts as posts } from "@/content/posts";
import { getPostLastUpdated } from "@/content/post-freshness";
import PSEOFooterNav from "@/components/PSEOFooterNav";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const metadata: Metadata = {
  title: "Blog: GitHub Signals, Deal Sourcing & VC Data",
  description:
    "GitHub Signals for Startup Investing: practical guides for VCs and angel investors on reading engineering momentum as a leading indicator of traction.",
  // hreflang emitted via <HreflangLinks/> in JSX (single source of truth).
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/blog#webpage",
        url: "https://signals.gitdealflow.com/blog",
        name: "Signal Intelligence Blog, VC Deal Flow Signal",
        description:
          "Insights on using GitHub engineering signals for startup investing.",
        inLanguage: "en-US",
        isAccessibleForFree: true,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "CollectionPage",
        name: "Signal Intelligence Blog",
        description:
          "Insights on using GitHub engineering signals for startup investing. Practical guides for VCs and angel investors.",
        url: "https://signals.gitdealflow.com/blog",
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
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
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/blog"
        languages={getHreflangLanguages("/blog")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gray-300 transition-colors">
          All Sectors
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">Blog</span>
      </nav>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
        Signal Intelligence Blog
      </h1>
      <p className="text-gray-300 text-base leading-relaxed mb-4">
        In short: this blog is the site&rsquo;s long-form layer, {" "}
        {posts.length} practical guides on reading GitHub engineering signals
        for startup investing, all written by the same pseudonymous author as
        the methodology. The recurring theme: which code-side patterns tend to
        move before fundraise announcements, and how to use them without
        reading code.
      </p>
      <p className="text-gray-400 text-base leading-relaxed mb-10">
        Practical guides on using GitHub engineering data for startup
        investing. How to read the signals, what patterns predict fundraises,
        and how to build a data-driven deal flow practice. If you are here for
        proof, comparison, or buyer-side clarity rather than browsing essays,
        start with the strongest routes below.
      </p>

      <section className="mb-10 rounded-2xl border border-sky-700/30 bg-sky-950/20 p-6 sm:p-8">
        <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
          Start with the highest-intent routes
        </p>
        <p className="text-gray-300 text-sm leading-relaxed mb-4">
          Use the blog when you want depth. But if the real question is proof, timing, or what to buy first, start with a sharper page before diving into the archive.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/research" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-signal-500 text-slate-950 text-sm font-semibold hover:bg-signal-600 transition-colors">
            Read the research panel →
          </Link>
          <Link href="/compare/crunchbase-alternative-for-angel-investors" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
            Compare timing vs verification →
          </Link>
          <Link href="/buyers-guide" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
            Read the buyer's guide →
          </Link>
        </div>
      </section>

      <div className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-lg border border-slate-800 bg-slate-900 p-6 hover:border-sky-600/50 hover:bg-slate-800/60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/10 transition-all"
          >
            <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider font-mono">
              {post.date}
              {getPostLastUpdated(post.slug, post.date) > post.date && (
                <span className="text-sky-400 normal-case tracking-normal ml-2">
                  · Updated {getPostLastUpdated(post.slug, post.date)}
                </span>
              )}
            </p>
            <h2 className="text-gray-100 font-semibold text-lg sm:text-xl mb-2 group-hover:text-sky-400 transition-colors leading-snug tracking-tight">
              {post.title}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
              {post.description}
            </p>
            <span className="mt-3 inline-flex items-center gap-1 text-sky-400 text-xs font-medium group-hover:text-sky-300 transition-colors">
              Read more <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </Link>
        ))}
      </div>

      <PSEOFooterNav excludeHrefs={["/blog"]} />

      <DataNerdSignoff variant="default" className="mt-12" />
    </div>
    </>
  );
}
