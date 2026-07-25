import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  competitors,
  getAllCompetitorVsSlugs,
  getCompetitorVsPair,
} from "@/content/competitor-vs";
import { getDataLastModified } from "@/lib/data";
import SeoCta from "@/components/SeoCta";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCompetitorVsSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

function clampDescription(text: string, max = 155) {
  return text.length > max ? `${text.slice(0, max - 3).trimEnd()}...` : text;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pair = getCompetitorVsPair(slug);
  if (!pair) return {};

  const a = competitors[pair.a];
  const b = competitors[pair.b];
  if (!a || !b) return {};

  // 2026-07-23: GSC query data on this page shows the dominant real-world
  // phrasing is "how does X compare to Y?" (matched across the pitchbook,
  // dealroom, and specter pairs at positions 1-9 with ~0% CTR) rather than
  // the flat "X vs Y" the old title used. Matching the literal question also
  // helps AI-answer surfaces (AI Overviews, AI Mode) recognise this page as
  // the direct answer, which is where most of this traffic actually sits.
  const title = `How Does ${a.name} Compare to ${b.name}? (2026)`;

  // Leads with a real sentence from the hand-authored verdict (never invented
  // copy), then a concrete reason to click through rather than stop at the
  // snippet - the old description was a fully generic template that answered
  // nothing and gave no reason to visit the page.
  //
  // 5 of 33 verdicts (2026-07-23 audit) open with a shared-trait sentence
  // ("Both are enterprise-priced...") rather than the actual differentiator,
  // which in every one of those 5 cases is the sentence right after it -
  // skip the opener in that case rather than leading with a non-answer.
  const verdictSentences = pair.verdict.split(". ");
  const verdictLead =
    (verdictSentences[0].startsWith("Both ") && verdictSentences[1]
      ? verdictSentences[1]
      : verdictSentences[0]) + ".";
  const description = clampDescription(
    `${verdictLead} Full feature table, pricing, and FAQ inside.`,
  );

  return {
    title,
    description,
    openGraph: { title, description, type: "article", url: `/vs/${slug}` },
    twitter: { card: "summary_large_image", title, description },
    alternates: {
      canonical: `/vs/${slug}`,
    },
  };
}

export default async function VsPage({ params }: PageProps) {
  const { slug } = await params;
  const pair = getCompetitorVsPair(slug);
  if (!pair) notFound();

  const a = competitors[pair.a];
  const b = competitors[pair.b];
  if (!a || !b) notFound();

  const lastModified = getDataLastModified();

  const features: { label: string; a: string; b: string }[] = [
    { label: "Primary signal", a: a.signalType, b: b.signalType },
    { label: "Typical lead time", a: a.leadTime, b: b.leadTime },
    { label: "Pricing", a: a.pricing, b: b.pricing },
    { label: "Free tier", a: a.freeTier, b: b.freeTier },
    { label: "Coverage", a: a.coverage, b: b.coverage },
  ];

  const faqs = [
    {
      // Reverse-ordering question, deliberately first. Search Console (28d) shows
      // two demand shapes this family was only half-serving:
      //   "cb insights vs pitchbook"          182 impr, position 23.2
      //   "how does harmonic compare to X?"   60-113 impr each, position 1.9-3.1
      // Pages are generated as {a}-vs-{b} only, so every title, heading and FAQ
      // put A first -- the B-first phrasing appeared ZERO times on the very page
      // that should own it. The question form is also what already ranks, and is
      // what Google lifts into People Also Ask / AI Overviews via the FAQPage
      // JSON-LD built from this array.
      question: `How does ${b.name} compare to ${a.name}?`,
      answer: `${b.name} is ${b.signalType.toLowerCase()} with a ${b.leadTime.toLowerCase()} lead time, priced at ${b.pricing.toLowerCase()}. ${a.name} is ${a.signalType.toLowerCase()} with a ${a.leadTime.toLowerCase()} lead time, priced at ${a.pricing.toLowerCase()}. The practical difference is coverage and timing: ${b.name} covers ${b.coverage.toLowerCase()}, while ${a.name} covers ${a.coverage.toLowerCase()}. Pick ${b.name} if ${b.strengths[0].toLowerCase()} matters more to your process; pick ${a.name} if ${a.strengths[0].toLowerCase()} does.`,
    },
    {
      question: `What is the main difference between ${a.name} and ${b.name}?`,
      answer: `${a.name} focuses on ${a.signalType.toLowerCase()} with a ${a.leadTime.toLowerCase()} lead time, while ${b.name} focuses on ${b.signalType.toLowerCase()} with a ${b.leadTime.toLowerCase()} lead time. They serve different points in the deal-flow funnel: ${a.name} is priced at ${a.pricing.toLowerCase()} and covers ${a.coverage.toLowerCase()}; ${b.name} is priced at ${b.pricing.toLowerCase()} and covers ${b.coverage.toLowerCase()}.`,
    },
    {
      question: `Which is better for individual angels and scouts — ${a.name} or ${b.name}?`,
      answer: `For individual angels and scouts, pricing usually decides. ${a.name} costs ${a.pricing.toLowerCase()}; ${b.name} costs ${b.pricing.toLowerCase()}. Neither is specifically designed for individual investors — VC Deal Flow Signal's EUR 49/mo Dashboard is often a better fit for that persona. If budget isn't a constraint, pick based on lead time and coverage.`,
    },
    {
      question: `Can you use ${a.name} and ${b.name} together?`,
      answer: `Yes, and many firms do. ${a.name} and ${b.name} are complementary when their signal types and lead times are different. A common stack is: ${a.name} for ${a.signalType.toLowerCase()}, ${b.name} for ${b.signalType.toLowerCase()}, plus a leading engineering-signal tool like VC Deal Flow Signal to catch technical startups before either platform does.`,
    },
    {
      question: `Is there a cheaper alternative to ${a.name} and ${b.name}?`,
      answer: `For technical-sector investors, VC Deal Flow Signal offers GitHub commit-velocity acceleration signals (6-12 weeks pre-fundraise) at EUR 49/mo during beta — far below ${a.name} and ${b.name} pricing. It's narrower in coverage (technical startups with public GitHub activity) but delivers the earliest leading signal in the market for that niche.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${a.name} vs ${b.name} — Deal Flow Platform Comparison`,
        description: `Head-to-head comparison of ${a.name} and ${b.name} for VC deal sourcing.`,
        author: DATA_NERD_AUTHOR_REF,
        publisher: { "@id": "https://gitdealflow.com/#organization" },
        datePublished: lastModified.toISOString().slice(0, 10),
        dateModified: lastModified.toISOString().slice(0, 10),
        // `Thing`, not `SoftwareApplication`: a product-eligible @type with no
        // offers/review/aggregateRating is a CRITICAL GSC "Product snippets"
        // error ("Either 'offers', 'review' or 'aggregateRating' should be
        // specified"). These are competitors we compare, so we have no honest
        // offer and won't invent a rating — name + url carry the entity link.
        about: [
          { "@type": "Thing", name: a.name, url: a.url },
          { "@type": "Thing", name: b.name, url: b.url },
        ],
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[aria-label='Verdict']"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Comparisons", item: "https://signals.gitdealflow.com/compare" },
          { "@type": "ListItem", position: 3, name: `${a.name} vs ${b.name}`, item: `https://signals.gitdealflow.com/vs/${slug}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/vs/${slug}`} />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link href="/compare" className="hover:text-gray-300 transition-colors">
            Comparisons
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{a.name} vs {b.name}</span>
        </nav>

        <header className="mb-8">
          <p className="text-sky-400 text-sm font-medium mb-2 uppercase tracking-wider">
            Head-to-head comparison
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            {a.name} vs {b.name}
          </h1>
          <p className="text-gray-400 text-base leading-relaxed">
            Two different approaches to venture deal sourcing compared side-by-side:{" "}
            <a href={a.url} rel="noopener noreferrer" target="_blank" className="text-sky-500 hover:text-sky-400 underline">
              {a.name}
            </a>{" "}
            — {a.tagline.toLowerCase()} vs{" "}
            <a href={b.url} rel="noopener noreferrer" target="_blank" className="text-sky-500 hover:text-sky-400 underline">
              {b.name}
            </a>{" "}
            — {b.tagline.toLowerCase()}
          </p>
        </header>

        <section className="mb-10" aria-label="Feature comparison">
          <h2 className="text-gray-100 font-semibold text-lg mb-4">
            Feature-by-feature comparison
          </h2>
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60">
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Feature</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3">{a.name}</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3">{b.name}</th>
                </tr>
              </thead>
              <tbody>
                {features.map((f) => (
                  <tr key={f.label} className="border-b border-slate-800/60 last:border-0">
                    <td className="px-4 py-3 text-gray-300 font-medium">{f.label}</td>
                    <td className="px-4 py-3 text-gray-400">{f.a}</td>
                    <td className="px-4 py-3 text-gray-400">{f.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {[a, b].map((c) => (
            <article
              key={c.key}
              className="rounded-lg border border-slate-800 bg-slate-900 p-6"
            >
              <h3 className="text-gray-100 font-semibold text-lg mb-2">
                {c.name}
              </h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                {c.tagline}
              </p>
              <p className="text-xs font-medium text-emerald-400 uppercase tracking-wider mb-2">
                Strengths
              </p>
              <ul className="list-disc list-inside text-gray-400 text-sm space-y-1 mb-4">
                {c.strengths.map((s) => <li key={s}>{s}</li>)}
              </ul>
              <p className="text-xs font-medium text-amber-400 uppercase tracking-wider mb-2">
                Weaknesses
              </p>
              <ul className="list-disc list-inside text-gray-400 text-sm space-y-1">
                {c.weaknesses.map((w) => <li key={w}>{w}</li>)}
              </ul>
            </article>
          ))}
        </section>

        <section
          className="mb-10 rounded-lg border border-sky-900/50 bg-sky-950/30 p-5"
          aria-label="Verdict"
        >
          <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
            Verdict
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {pair.verdict}
          </p>
        </section>

        <section className="mb-12" aria-label="Call to action">
          <SeoCta
            heading={`Skip the ${a.name}-vs-${b.name} debate — see who's actually shipping`}
            secondary={{ label: "Unlock the Dashboard", href: "https://gitdealflow.com/dashboard" }}
          />
        </section>

        <section className="mb-12" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((f) => (
              <div
                key={f.question}
                className="rounded-lg border border-slate-800 bg-slate-900 p-5"
              >
                <h3 className="text-gray-100 font-medium mb-2">{f.question}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section aria-label="Other comparisons">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Other head-to-head comparisons
          </h2>
          <div className="flex flex-wrap gap-2">
            {getAllCompetitorVsSlugs()
              .filter((s) => s !== slug)
              .slice(0, 8)
              .map((s) => {
                const p = getCompetitorVsPair(s);
                if (!p) return null;
                const ca = competitors[p.a];
                const cb = competitors[p.b];
                if (!ca || !cb) return null;
                return (
                  <Link
                    key={s}
                    href={`/vs/${s}`}
                    className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors"
                  >
                    {ca.name} vs {cb.name}
                  </Link>
                );
              })}
          </div>
        </section>
      </div>
    </>
  );
}
