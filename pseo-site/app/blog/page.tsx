import type { Metadata } from "next";
import Link from "next/link";
import { allPosts as posts } from "@/content/posts";
import PSEOFooterNav from "@/components/PSEOFooterNav";

export const metadata: Metadata = {
  title: "Blog — VC Deal Flow Signal",
  description:
    "Insights on using GitHub engineering signals for startup investing. Practical guides for VCs and angel investors on reading engineering momentum as a leading indicator of traction.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
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
      <p className="text-gray-400 text-base leading-relaxed mb-10">
        Practical guides on using GitHub engineering data for startup
        investing. How to read the signals, what patterns predict fundraises,
        and how to build a data-driven deal flow practice.
      </p>

      <div className="space-y-4">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group block rounded-lg border border-slate-800 bg-slate-900 p-6 hover:border-sky-600/50 hover:bg-slate-800/60 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-sky-500/10 transition-all"
          >
            <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider font-mono">
              {post.date}
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
    </div>
    </>
  );
}
