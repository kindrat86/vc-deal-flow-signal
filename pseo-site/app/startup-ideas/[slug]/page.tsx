import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getStartupIdeaBySlug,
  getAllStartupIdeaSlugs,
  getRelatedStartupIdeas,
  type StartupIdea,
} from "@/content/startup-ideas";
import {
  getStartupsForIdea,
  type MatchedStartup,
} from "@/lib/startup-ideas";
import { getDataLastModified } from "@/lib/data";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

interface PageProps {
  params: Promise<{ slug: string }>;
}

const SITE = "https://signals.gitdealflow.com";

export async function generateStaticParams() {
  return getAllStartupIdeaSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

function buildIdeaDescription(idea: StartupIdea): string {
  // Prefer the editorial `metaDescription` when it's already SERP-length
  // (>=120); otherwise fall back to the richer `oneLiner`. Clamp to 155 so the
  // description lands in the 150-155 sweet spot without SERP truncation.
  const source =
    idea.metaDescription && idea.metaDescription.length >= 120
      ? idea.metaDescription
      : idea.oneLiner;
  if (source.length <= 155) return source;
  return `${source.slice(0, 152).trimEnd()}...`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const idea = getStartupIdeaBySlug(slug);
  if (!idea) return {};

  const description = buildIdeaDescription(idea);
  return {
    title: idea.title,
    description,
    keywords: idea.keywords.join(", "),
    alternates: { canonical: `/startup-ideas/${slug}` },
    openGraph: {
      title: idea.title,
      description,
      url: `${SITE}/startup-ideas/${slug}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: idea.title,
      description,
    },
  };
}

function buildJsonLd(
  idea: StartupIdea,
  matches: MatchedStartup[],
  lastModifiedIso: string,
): object {
  const url = `${SITE}/startup-ideas/${idea.slug}`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${url}#article`,
        headline: idea.title,
        description: idea.metaDescription,
        url,
        datePublished: lastModifiedIso,
        dateModified: lastModifiedIso,
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
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[data-speakable]"],
        },
        articleSection: idea.category,
        keywords: idea.keywords.join(", "),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Startup Ideas",
            item: `${SITE}/startup-ideas`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: idea.title,
            item: url,
          },
        ],
      },
      matches.length > 0
        ? {
            "@type": "ItemList",
            name: `Top repos already trying, ${idea.title}`,
            numberOfItems: matches.length,
            itemListElement: matches.map((m, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: m.name,
              description: `${m.description || m.sectorName}, ${m.commitVelocityChange} commit-velocity change in ${m.sectorName}`,
              url: m.githubUrl,
            })),
          }
        : undefined,
      {
        "@type": "FAQPage",
        mainEntity: idea.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: {
            "@type": "Answer",
            text: f.a,
          },
        })),
      },
    ].filter(Boolean),
  };
}

export default async function StartupIdeaPage({ params }: PageProps) {
  const { slug } = await params;
  const idea = getStartupIdeaBySlug(slug);
  if (!idea) notFound();

  const matches = getStartupsForIdea(idea, 3);
  const related = getRelatedStartupIdeas(slug, 4);
  const lastModifiedIso = getDataLastModified().toISOString();
  const jsonLd = buildJsonLd(idea, matches, lastModifiedIso);

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/startup-ideas/${slug}`}
        languages={getHreflangLanguages(`/startup-ideas/${slug}`)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/startup-ideas/${slug}`} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/startup-ideas"
              className="hover:text-gray-300"
            >
              Startup Ideas
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">{idea.title}</span>
          </nav>
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            {idea.category} · Startup idea
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            {idea.title}
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
            data-speakable
          >
            {idea.oneLiner}
          </p>
        </header>

        {/* Why now */}
        <section
          aria-label="Why now"
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-3"
        >
          <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
            Why now
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            {idea.whyNow}
          </p>
        </section>

        {/* What you'd build today */}
        <section
          aria-label="What you'd build today"
          className="rounded-xl border border-sky-800/40 bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-950 p-5 sm:p-7 space-y-3"
        >
          <p className="text-sky-300 text-[10px] font-semibold uppercase tracking-wider">
            The idea you could build today
          </p>
          <p className="text-gray-200 text-base leading-relaxed">
            {idea.buildToday}
          </p>
          {idea.buildStack.length > 0 && (
            <>
              <p className="text-sky-300 text-[10px] font-semibold uppercase tracking-wider pt-2">
                Build stack
              </p>
              <ul className="text-gray-300 text-sm leading-relaxed space-y-1.5">
                {idea.buildStack.map((b, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-sky-400 select-none">·</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        {/* The 3 repos already trying, live signals join */}
        <section
          aria-label="Three repos already trying"
          className="space-y-4"
        >
          <div className="space-y-1">
            <p className="text-emerald-300 text-[10px] font-semibold uppercase tracking-wider">
              The three repos already trying
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
              Pulled live from our current-period signal index.
            </h2>
          </div>
          {matches.length === 0 ? (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm text-gray-400 leading-relaxed">
              <p>
                No repos in the current period have crossed our minimum-volume
                + sector match for this idea. That can mean two things, the
                niche is too new for public GitHub signal to show up yet, or
                the buildable wedge is genuinely greenfield. Either way, watch
                this page; matches refresh weekly.
              </p>
              <p className="mt-3">
                <Link
                  href="/trending"
                  className="text-sky-300 underline decoration-dotted hover:text-sky-200"
                >
                  Browse the live trending board →
                </Link>
              </p>
            </div>
          ) : (
            <ol className="grid gap-3 sm:gap-4">
              {matches.map((m, i) => (
                <li
                  key={m.name}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 hover:border-emerald-700/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-1.5 min-w-0 flex-1">
                      <div className="flex items-baseline gap-2 flex-wrap">
                        <span className="text-emerald-300 text-xs font-semibold tabular-nums">
                          #{i + 1}
                        </span>
                        <a
                          href={m.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-100 font-semibold hover:text-sky-300 transition-colors text-lg break-all"
                        >
                          {m.name}
                        </a>
                        <span className="text-gray-500 text-[10px] uppercase tracking-wider">
                          {m.sectorName}
                        </span>
                      </div>
                      {m.description && (
                        <p className="text-gray-400 text-sm leading-relaxed">
                          {m.description}
                        </p>
                      )}
                      <p className="text-gray-500 text-xs leading-relaxed pt-1">
                        {m.signalType}
                      </p>
                    </div>
                    <div className="text-right space-y-0.5 shrink-0">
                      <p className="text-emerald-300 text-2xl font-bold tabular-nums">
                        {m.commitVelocityChange}
                      </p>
                      <p className="text-gray-500 text-[10px] uppercase tracking-wider">
                        14-day velocity Δ
                      </p>
                      <p className="text-gray-500 text-[10px] tabular-nums">
                        {m.contributors} contributors
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
          <p className="text-gray-500 text-xs leading-relaxed">
            Matched against the current-period startup signal panel (
            {idea.matchSignal.sectorSlugs.join(", ")}). Rankings shift weekly as
            the underlying GitHub activity moves.{" "}
            <Link
              href="/methodology"
              className="text-sky-400 underline decoration-dotted hover:text-sky-300"
            >
              Read the methodology
            </Link>
            .
          </p>
        </section>

        {/* Seed-round pattern */}
        <section
          aria-label="Seed-round pattern"
          className="rounded-xl border border-violet-900/40 bg-violet-950/15 p-5 sm:p-6 space-y-3"
        >
          <p className="text-violet-300 text-[10px] font-semibold uppercase tracking-wider">
            The seed-round pattern hiding in the trendline
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            {idea.seedPattern}
          </p>
        </section>

        {/* FAQ */}
        {idea.faqs.length > 0 && (
          <section aria-label="Frequently asked questions" className="space-y-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
              Frequently asked
            </h2>
            <div className="space-y-3">
              {idea.faqs.map((f, i) => (
                <details
                  key={i}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 group"
                >
                  <summary className="cursor-pointer text-gray-100 font-medium text-base list-none flex items-start justify-between gap-4">
                    <span>{f.q}</span>
                    <span className="text-sky-400 text-sm select-none group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-gray-400 text-sm leading-relaxed">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <section
          aria-label="Call to action"
          className="rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3"
        >
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            Use the signal, not just the idea
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Watch this idea live, every week.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            The repos above re-rank automatically as commit velocity, contributor
            growth, and new-repo creation move. Want the data feed for this idea
            wired into your own stack? The MCP server exposes every signal as a
            tool any agent host can query.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/firstlook"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-signal-500 hover:bg-signal-400 text-slate-950 font-bold text-sm transition-colors"
            >
              Get the weekly First Look →
            </Link>
            <Link
              href="/integrations"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Wire up the MCP feed →
            </Link>
          </div>
        </section>

        {/* Related */}
        {related.length > 0 && (
          <section aria-label="Related startup ideas" className="space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-100">
              Related ideas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/startup-ideas/${r.slug}`}
                  className="block rounded-lg border border-slate-800 bg-slate-900/60 hover:border-sky-700/40 hover:bg-slate-900 transition-colors p-4 space-y-1.5"
                >
                  <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                    {r.category}
                  </p>
                  <p className="text-gray-100 font-medium text-sm leading-snug">
                    {r.title}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <p className="text-gray-500 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Updated {new Date(lastModifiedIso).toISOString().slice(0, 10)}. The
          framing is editorial; the &ldquo;three repos already trying&rdquo;
          slot is generated from the live signal panel. Anonymity rule: we name
          public GitHub orgs, never individual founders or stealth teams.
        </p>
      </div>
    </>
  );
}
