import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { glossaryTerms } from "@/content/glossary";
import { EmbedAutoHeight } from "@/components/EmbedAutoHeight";

/**
 * /embed/define/[term], iframe-embeddable glossary card.
 *
 * Distribution lever: tech blogs, Substack newsletters, Notion handbooks,
 * and Ghost publications that mention a VC term (e.g., "engineering
 * acceleration", "commit velocity") can paste a single
 *
 *   <iframe src="https://signals.gitdealflow.com/embed/define/commit-velocity" />
 *
 * snippet and get a definition card with persistent attribution. Same
 * iframe contract as /embed/tools/[slug], iframe-friendly headers in
 * next.config.ts, no site chrome (NotInEmbed strips Header/Footer for
 * /embed/* paths), CC BY 4.0 attribution baked into the asset.
 *
 * Net new traffic mechanism: each embed on a third-party domain is a
 * branded impression + a backlink to /define/[term]. Definitions are
 * the highest-fanout artifact we ship (135 terms across 4 categories);
 * this turns each one into a paste-able widget that lives on other
 * properties without us having to ask for the link.
 */

const SITE = "https://signals.gitdealflow.com";

interface PageProps {
  params: Promise<{ term: string }>;
}

export function generateStaticParams() {
  return glossaryTerms.map((t) => ({ term: t.id }));
}

export const dynamicParams = false;
export const revalidate = 604800;

function getTerm(id: string) {
  return glossaryTerms.find((t) => t.id === id);
}

function firstSentence(text: string): string {
  const match = text.match(/^[^.]+\./);
  return (match ? match[0] : text).trim();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { term } = await params;
  const t = getTerm(term);
  if (!t) return {};
  const url = `${SITE}/embed/define/${term}`;
  return {
    title: `${t.term}, Embed`,
    description: `Embeddable glossary card for "${t.term}". ${firstSentence(t.definition)} CC BY 4.0.`,
    alternates: { canonical: url },
    // Iframe surface, keep it out of search so it doesn't compete with
    // the canonical /define/<term> page for the same head terms.
    robots: { index: false, follow: false },
  };
}

const FOUC_STYLE = `
/* Belt-and-braces chrome hide: NotInEmbed unmounts Header/Footer on
   hydration, but server-rendered HTML may paint chrome briefly. Hide
   every direct child of <body> except <main> so the iframe paint is
   widget-only from the first frame. */
body > :not(main):not(script) { display: none !important; }
html, body { background: #0f172a; margin: 0; padding: 0; }
main { padding: 0 !important; margin: 0 !important; }
`.trim();

export default async function EmbedDefinePage({ params }: PageProps) {
  const { term } = await params;
  const t = getTerm(term);
  if (!t) notFound();

  const deepLink = `${SITE}/define/${term}?utm_source=embed&utm_medium=iframe&utm_campaign=glossary-embed`;

  return (
    <>
      <style
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: FOUC_STYLE }}
      />
      <div className="px-4 py-4 sm:px-5 sm:py-5 bg-slate-950 text-gray-100">
        <div className="mb-3 flex items-baseline justify-between gap-3 border-b border-slate-800 pb-2">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-sky-400">
            Definition
          </p>
          <a
            href={deepLink}
            target="_top"
            rel="noopener"
            className="text-[11px] text-gray-400 hover:text-sky-300 transition-colors"
          >
            Full glossary entry ↗
          </a>
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-gray-100 mb-3 leading-tight">
          {t.term}
        </h1>
        <p className="text-sm text-gray-300 leading-relaxed">
          {t.definition}
        </p>

        <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-800 pt-3 text-[11px] text-gray-500">
          <span>CC BY 4.0 · VC Deal Flow Signal Glossary</span>
          <a
            href={deepLink}
            target="_top"
            rel="noopener"
            className="text-gray-400 hover:text-sky-300 transition-colors"
          >
            via gitdealflow.com →
          </a>
        </div>

        <EmbedAutoHeight />
      </div>
    </>
  );
}
