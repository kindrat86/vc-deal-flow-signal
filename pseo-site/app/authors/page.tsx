import type { Metadata } from "next";
import Link from "next/link";
import { getAllAuthors } from "@/content/authors";
import { allPosts as posts } from "@/content/posts";

const BASE_URL = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title: "Authors — VC Deal Flow Signal",
  description:
    "Editorial bylines behind VC Deal Flow Signal: founder, engineering research desk, and guest founder perspective. Each author maintains the methodology and dataset behind every signal published.",
  alternates: { canonical: "/authors" },
};

export default function AuthorsIndexPage() {
  const all = getAllAuthors();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "VC Deal Flow Signal — Authors",
        url: `${BASE_URL}/authors`,
        hasPart: all.map((a) => ({
          "@type": "Person",
          "@id": `${BASE_URL}/authors/${a.slug}#person`,
          name: a.name,
          url: `${BASE_URL}/authors/${a.slug}`,
          jobTitle: a.jobTitle,
          description: a.bio,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Authors", item: `${BASE_URL}/authors` },
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
          <span className="text-gray-400">Authors</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            Editorial Bylines
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            VC Deal Flow Signal publishes under three editorial bylines. Each
            persona has its own credentials, public profiles, and accountability
            for the work shipped under that byline.
          </p>
        </header>

        <div className="space-y-6">
          {all.map((a) => {
            const postCount = posts.filter(
              (p) => (p.author ?? "the-data-nerd") === a.slug
            ).length;
            return (
              <Link
                key={a.slug}
                href={`/authors/${a.slug}`}
                className="block rounded-lg border border-slate-800 bg-slate-900 p-6 hover:border-slate-600 hover:bg-slate-800/60 transition-colors"
              >
                <h2 className="text-gray-100 font-semibold text-lg mb-1">
                  {a.name}
                </h2>
                <p className="text-sky-400 text-xs font-semibold mb-3">
                  {a.jobTitle}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                  {a.bio}
                </p>
                <p className="text-xs text-gray-400">
                  {postCount} {postCount === 1 ? "post" : "posts"}
                  {" · "}
                  {a.credentials.length} credentials
                  {" · "}
                  {a.sameAs.length} public profiles
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
