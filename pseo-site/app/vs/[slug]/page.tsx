import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  competitors,
  getAllCompetitorVsSlugs,
  getCompetitorVsPair,
} from "@/content/competitor-vs";
import { getDataLastModified } from "@/lib/data";
import CTABanner from "@/components/CTABanner";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllCompetitorVsSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pair = getCompetitorVsPair(slug);
  if (!pair) return {};

  const a = competitors[pair.a];
  const b = competitors[pair.b];
  if (!a || !b) return {};

  const title = `${a.name} vs ${b.name} — Deal Flow Platform Comparison (2026)`;
  const description = `${a.name} vs ${b.name} compared head-to-head for VC deal sourcing. Signal type, lead time, pricing, coverage, and when to pick each one. Independent comparison maintained by VC Deal Flow Signal.`;

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
      question: `What is the main difference between ${a.name} and ${b.name}?`,
      answer: `${a.name} focuses on ${a.signalType.toLowerCase()} with a ${a.leadTime.toLowerCase()} lead time, while ${b.name} focuses on ${b.signalType.toLowerCase()} with a ${b.leadTime.toLowerCase()} lead time. They serve different points in the deal-flow funnel: ${a.name} is priced at ${a.pricing.toLowerCase()} and covers ${a.coverage.toLowerCase()}; ${b.name} is priced at ${b.pricing.toLowerCase()} and covers ${b.coverage.toLowerCase()}.`,
    },
    {
      question: `Which is better for individual angels and scouts — ${a.name} or ${b.name}?`,
      answer: `For individual angels and scouts, pricing usually decides. ${a.name} costs ${a.pricing.toLowerCase()}; ${b.name} costs ${b.pricing.toLowerCase()}. Neither is specifically designed for individual investors — VC Deal Flow Signal's EUR 9.97/mo Dashboard is often a better fit for that persona. If budget isn't a constraint, pick based on lead time and coverage.`,
    },
    {
      question: `Can you use ${a.name} and ${b.name} together?`,
      answer: `Yes, and many firms do. ${a.name} and ${b.name} are complementary when their signal types and lead times are different. A common stack is: ${a.name} for ${a.signalType.toLowerCase()}, ${b.name} for ${b.signalType.toLowerCase()}, plus a leading engineering-signal tool like VC Deal Flow Signal to catch technical startups before either platform does.`,
    },
    {
      question: `Is there a cheaper alternative to ${a.name} and ${b.name}?`,
      answer: `For technical-sector investors, VC Deal Flow Signal offers GitHub commit-velocity acceleration signals (6-12 weeks pre-fundraise) at EUR 9.97/mo during beta — far below ${a.name} and ${b.name} pricing. It's narrower in coverage (technical startups with public GitHub activity) but delivers the earliest leading signal in the market for that niche.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${a.name} vs ${b.name} — Deal Flow Platform Comparison`,
        description: `Head-to-head comparison of ${a.name} and ${b.name} for VC deal sourcing.`,
        author: { "@type": "Organization", name: "VC Deal Flow Signal", url: "https://gitdealflow.com" },
        publisher: { "@type": "Organization", name: "VC Deal Flow Signal", url: "https://gitdealflow.com" },
        datePublished: lastModified.toISOString().slice(0, 10),
        dateModified: lastModified.toISOString().slice(0, 10),
        about: [
          { "@type": "SoftwareApplication", name: a.name, url: a.url, applicationCategory: "BusinessApplication" },
          { "@type": "SoftwareApplication", name: b.name, url: b.url, applicationCategory: "BusinessApplication" },
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
          <CTABanner
            heading={`Skip the ${a.name}-vs-${b.name} debate — see who's actually shipping`}
            primaryLabel="Get the free Sunday issue"
          />
          <DataNerdSignoff variant="compact" className="mt-5" />
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
