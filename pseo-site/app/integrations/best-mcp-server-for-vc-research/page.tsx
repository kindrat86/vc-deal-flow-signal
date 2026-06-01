import type { Metadata } from "next";
import Link from "next/link";
import { HreflangLinks } from "@/components/HreflangLinks";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

const SITE = "https://signals.gitdealflow.com";
const TITLE = "Best MCP Server for VC Research | VC Deal Flow Signal";
const DESCRIPTION =
  "Use VC Deal Flow Signal as an MCP server for VC research, startup monitoring, GitHub signal discovery, and agent-native sourcing workflows without private API friction.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/integrations/best-mcp-server-for-vc-research" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE}/integrations/best-mcp-server-for-vc-research`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

const FAQS = [
  {
    q: "Why is this MCP server useful for VC research?",
    a: "Because it gives agents structured access to startup engineering momentum, sector rankings, company-level signal lookup, Scout Score receipts, and methodology without requiring private APIs or manual screen scraping.",
  },
  {
    q: "Do I need an API key?",
    a: "No. The core MCP server is free, read-only, and works without authentication. It is designed to be easy to install inside Claude Desktop, Cursor, and other MCP-compatible runtimes.",
  },
  {
    q: "What should I use after the MCP server gives me a lead?",
    a: "Use the MCP server for early signal discovery, then move into methodology, comparison pages, and your normal verification workflow once a company deserves deeper attention.",
  },
] as const;

export default function BestMcpServerForVcResearchPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: TITLE,
        description: DESCRIPTION,
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: SITE,
        },
        mainEntityOfPage: `${SITE}/integrations/best-mcp-server-for-vc-research`,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[data-key-takeaway]"],
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((faq) => ({
          "@type": "Question",
          name: faq.q,
          acceptedAnswer: { "@type": "Answer", text: faq.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: SITE },
          { "@type": "ListItem", position: 2, name: "Integrations", item: `${SITE}/integrations` },
          { "@type": "ListItem", position: 3, name: "Best MCP Server for VC Research", item: `${SITE}/integrations/best-mcp-server-for-vc-research` },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/integrations/best-mcp-server-for-vc-research`}
        languages={{
          en: `${SITE}/integrations/best-mcp-server-for-vc-research`,
          "en-US": `${SITE}/integrations/best-mcp-server-for-vc-research`,
          "x-default": `${SITE}/integrations/best-mcp-server-for-vc-research`,
        }}
      />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">All Sectors</Link>
          <span className="mx-2">/</span>
          <Link href="/integrations" className="hover:text-gray-300 transition-colors">Integrations</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Best MCP Server for VC Research</span>
        </nav>

        <header className="mb-8 space-y-4">
          <p className="text-xs font-medium text-sky-500 uppercase tracking-wider">Integration guide</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-tight">The best MCP server for VC research if you track startup signals</h1>
          <p className="text-gray-400 text-base leading-relaxed">
            If you use agent-native workflows for VC research, the best MCP server is the one that gives you useful signal with low friction. This page explains where VC Deal Flow Signal fits in that stack, why it works well for startup momentum research, and when it should hand off to human-facing proof and buyer pages.
          </p>
        </header>

        <section data-key-takeaway className="mb-8 rounded-2xl border border-sky-900/50 bg-sky-950/30 p-6 sm:p-8">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">Quick answer</p>
          <p className="text-gray-200 text-lg leading-relaxed">
            VC Deal Flow Signal works well as an MCP server for VC research because it gives agents structured access to startup engineering momentum, sector rankings, and company-level signal surfaces without private API friction.
          </p>
        </section>

        <section className="space-y-5 mb-10">
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-gray-100 text-lg font-semibold mb-3">What makes an MCP server useful for VC research</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              The useful questions are simple: can your agent query real startup signal data, does it return structured answers, does it fit your workflow, and can you trust what it surfaces enough to take the next step? A useful MCP server reduces friction. It does not just add another protocol badge.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-gray-100 text-lg font-semibold mb-3">Where VC Deal Flow Signal fits</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              VC Deal Flow Signal is strongest when you want startup monitoring, GitHub-based momentum research, sector-level rankings, and company lookup that supports earlier sourcing. It is not trying to be a CRM or a late-stage financial database. It is an earlier signal layer for technical startups, then a routing layer into proof, workflow, and buyer-side evaluation.
            </p>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="text-gray-100 text-lg font-semibold mb-3">Who this is for</h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              This fits analysts, angels, scouts, operator-investors, and anyone running agent-native research workflows who wants startup signal data in a format an LLM can actually use without duct tape.
            </p>
          </div>
        </section>

        <section className="mb-10 rounded-xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">If you want to verify the claim</h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-4">
            The signal logic is public. Read the methodology, inspect the runtime coverage, and connect the machine-facing surface back to the investor-facing workflow.
          </p>
          <div className="flex flex-col gap-3">
            <Link href="/integrations/agent-runtimes" className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm">See all supported agent runtimes</Link>
            <Link href="/methodology" className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm">Read the methodology</Link>
            <Link href="/research" className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm">Read the research panel</Link>
            <Link href="/answers/how-angel-investors-use-github-signals" className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm">How angel investors can use GitHub signals without reading code</Link>
          </div>
        </section>

        <section className="mb-12" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold text-gray-100 mb-5">Frequently asked questions</h2>
          <div className="space-y-4">
            {FAQS.map((faq) => (
              <details key={faq.q} className="rounded-lg border border-slate-800 bg-slate-900/50 px-5 py-3">
                <summary className="cursor-pointer font-semibold text-gray-100 text-sm">{faq.q}</summary>
                <p className="mt-3 text-gray-300 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-10" aria-label="What to read next">
          <h2 className="text-base font-semibold text-gray-300 mb-4">What to read next</h2>
          <ul className="space-y-2">
            <li><Link href="/integrations/agent-runtimes" className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm">See all supported agent runtimes</Link></li>
            <li><Link href="/research" className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm">Read the research panel</Link></li>
            <li><Link href="/answers/how-angel-investors-use-github-signals" className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm">How angel investors can use GitHub signals without reading code</Link></li>
            <li><Link href="/buyers-guide" className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm">Read the buyer's guide</Link></li>
            <li><Link href="https://gitdealflow.com/report" className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm">Read a sample Sunday watchlist</Link></li>
          </ul>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">If you want the human-facing version of this signal</h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            Machines can query the data. Humans still need a clean read. Start with the sample Sunday watchlist, then use the buyer's guide if you want to decide whether this belongs in your stack.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link href="https://gitdealflow.com/report" className="inline-flex w-full sm:w-auto items-center justify-center px-6 py-3 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition-colors">
              Read a sample Sunday watchlist
            </Link>
            <Link href="/buyers-guide" className="inline-flex w-full sm:w-auto items-center justify-center px-6 py-3 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-200 text-sm font-medium transition-colors">
              Read the buyer's guide
            </Link>
          </div>
        </section>
      </article>
    </>
  );
}
