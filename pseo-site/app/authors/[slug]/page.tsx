import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { authors, getAllAuthors } from "@/content/authors";
import { allPosts as posts } from "@/content/posts";
import SeoCta from "@/components/SeoCta";

const BASE_URL = "https://signals.gitdealflow.com";

export function generateStaticParams() {
  return getAllAuthors().map((a) => ({ slug: a.slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const author = authors[slug];
  if (!author) return { title: "Author not found" };
  return {
    title: `${author.name}, Author at VC Deal Flow Signal`,
    description: author.bio,
    alternates: { canonical: `/authors/${author.slug}` },
    openGraph: {
      title: `${author.name}`,
      description: author.bio,
      url: `${BASE_URL}/authors/${author.slug}`,
      type: "profile",
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const author = authors[slug];
  if (!author) notFound();

  const authoredPosts = posts.filter((p) => (p.author ?? "the-data-nerd") === slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${BASE_URL}/authors/${author.slug}#person`,
        name: author.name,
        url: `${BASE_URL}/authors/${author.slug}`,
        jobTitle: author.jobTitle,
        description: author.bio,
        knowsAbout: author.credentials,
        knowsLanguage: ["en"],
        sameAs: author.sameAs,
        affiliation: {
          "@type": "Organization",
          name: author.affiliation,
          url: "https://gitdealflow.com",
          sameAs: [
            "https://www.wikidata.org/wiki/Q139376302",
            "https://www.crunchbase.com/organization/gitdealflow",
          ],
        },
        worksFor: {
          "@type": "Organization",
          name: author.affiliation,
          url: "https://gitdealflow.com",
        },
      },
      {
        "@type": "ProfilePage",
        url: `${BASE_URL}/authors/${author.slug}`,
        name: `${author.name}, Author at VC Deal Flow Signal`,
        description: author.bio,
        inLanguage: "en",
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: BASE_URL,
        },
        mainEntity: { "@id": `${BASE_URL}/authors/${author.slug}#person` },
        about: { "@id": `${BASE_URL}/authors/${author.slug}#person` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", ".speakable", "[data-agent-summary]"],
        },
        hasPart:
          authoredPosts.length > 0
            ? {
                "@type": "ItemList",
                name: `Posts by ${author.name}`,
                numberOfItems: authoredPosts.length,
                itemListElement: authoredPosts.map((p, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  url: `${BASE_URL}/blog/${p.slug}`,
                  name: p.title,
                })),
              }
            : undefined,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: BASE_URL },
          { "@type": "ListItem", position: 2, name: "Authors", item: `${BASE_URL}/authors` },
          {
            "@type": "ListItem",
            position: 3,
            name: author.name,
            item: `${BASE_URL}/authors/${author.slug}`,
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
          <Link href="/blog" className="hover:text-gray-300 transition-colors">
            Blog
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{author.name}</span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-3 leading-tight">
            {author.name}
          </h1>
          <p className="text-sky-400 text-sm font-semibold mb-4">
            {author.jobTitle}
          </p>
          <p className="text-gray-300 text-base leading-relaxed">{author.bio}</p>
        </header>

        <section className="mb-10 rounded-lg border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            Credentials
          </h2>
          <ul className="space-y-2 text-gray-400 text-sm leading-relaxed">
            {author.credentials.map((c) => (
              <li key={c} className="flex gap-2">
                <span className="text-sky-400 flex-shrink-0">·</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </section>

        {author.sameAs.length > 0 && (
          <section className="mb-10">
            <h2 className="text-gray-100 font-semibold text-lg mb-3">
              Public profiles
            </h2>
            <ul className="space-y-1.5 text-sm">
              {author.sameAs.map((url) => (
                <li key={url}>
                  <a
                    href={url}
                    rel="me noopener noreferrer"
                    target="_blank"
                    className="text-sky-400 hover:text-sky-300 underline underline-offset-2 break-all"
                  >
                    {url}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {authoredPosts.length > 0 && (
          <section>
            <h2 className="text-gray-100 font-semibold text-lg mb-4">
              Posts by {author.name}
            </h2>
            <ul className="space-y-3">
              {authoredPosts.map((p) => (
                <li
                  key={p.slug}
                  className="rounded-lg border border-slate-800 bg-slate-900 p-4"
                >
                  <Link
                    href={`/blog/${p.slug}`}
                    className="text-gray-100 font-semibold hover:text-sky-400 transition-colors block mb-1"
                  >
                    {p.title}
                  </Link>
                  <p className="text-gray-400 text-xs mb-2">{p.date}</p>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                    {p.description}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <SeoCta className="mt-10" />
      </div>
    </>
  );
}
