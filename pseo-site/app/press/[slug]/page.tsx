import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getReleaseBySlug,
  getAllReleaseSlugs,
} from "@/content/press-releases";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";

const SITE = "https://signals.gitdealflow.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllReleaseSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 86400;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const r = getReleaseBySlug(slug);
  if (!r) return {};
  return {
    title: `${r.headline} — Press Release`,
    description: r.subhead,
    alternates: { canonical: `/press/${slug}` },
    openGraph: {
      title: r.headline,
      description: r.subhead,
      type: "article",
      url: `${SITE}/press/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: r.headline,
      description: r.subhead,
    },
  };
}

export default async function PressReleasePage({ params }: PageProps) {
  const { slug } = await params;
  const r = getReleaseBySlug(slug);
  if (!r) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "NewsArticle",
        "@id": `${SITE}/press/${slug}#article`,
        headline: r.headline,
        description: r.subhead,
        articleSection: "Press release",
        articleBody: [r.lead, ...r.body, r.quote].join("\n\n"),
        datePublished: r.date,
        dateModified: r.date,
        author: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        mainEntityOfPage: `${SITE}/press/${slug}`,
        copyrightHolder: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
        },
        copyrightNotice: "CC BY 4.0",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Press",
            item: `${SITE}/press`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: r.headline,
            item: `${SITE}/press/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks canonical={`${SITE}/press/${slug}`} languages={{}} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/press/${slug}`} />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <nav className="text-xs text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/press" className="hover:text-gray-300">
            Press
          </Link>
          <span className="mx-2">/</span>
          <span>{r.slug}</span>
        </nav>

        <header className="space-y-4 border-b border-slate-800 pb-6">
          <p className="text-gray-500 text-xs font-mono uppercase tracking-wider">
            {r.dateline} — {r.date}
          </p>
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            FOR IMMEDIATE RELEASE
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-[1.15]">
            {r.headline}
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed italic">
            {r.subhead}
          </p>
        </header>

        <article className="space-y-5 text-gray-200 text-base leading-relaxed">
          <p className="text-gray-100 font-medium">{r.lead}</p>
          {r.body.map((p, i) => (
            <p key={i} className="text-gray-300">
              {p}
            </p>
          ))}
          <blockquote className="border-l-4 border-emerald-500/60 bg-slate-900/40 pl-5 py-3 my-6 italic text-gray-200">
            {r.quote}
            <footer className="text-gray-500 text-sm not-italic mt-2">
              — The Data Nerd, founder of VC Deal Flow Signal
            </footer>
          </blockquote>
        </article>

        <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 space-y-3">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
            About VC Deal Flow Signal
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {r.boilerplate}
          </p>
        </section>

        <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 space-y-3">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
            Press contact
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            <a
              href="mailto:signal@gitdealflow.com"
              className="text-sky-400 hover:text-sky-300"
            >
              signal@gitdealflow.com
            </a>
            <br />
            Founder is anonymous (handle: The Data Nerd, ORCID
            0009-0002-2222-4112). Email-only — no podcasts, voice, or video
            interviews.
          </p>
        </section>

        <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-5 space-y-3">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
            Wire metadata (for the desk filing this)
          </p>
          <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-300">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                Categories
              </p>
              <ul className="space-y-1">
                {r.wireCategories.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">
                Suggested desks
              </p>
              <ul className="space-y-1 text-xs">
                {r.targetDesks.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <p className="text-gray-500 text-sm border-t border-slate-800 pt-5">
          Back to the{" "}
          <Link
            href="/press"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            press kit
          </Link>
          {" "}or read the{" "}
          <Link
            href="/state-of-github"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            monthly State of GitHub Engineering Velocity address
          </Link>
          .
        </p>
      </main>
    </>
  );
}
