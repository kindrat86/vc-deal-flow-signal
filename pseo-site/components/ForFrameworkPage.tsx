/**
 * Shared rendering for the /for-{framework} programmatic landing pages.
 *
 * Each /for-X/page.tsx is a thin server component that imports the matching
 * positioning entry from lib/for-framework-data and hands it to this
 * renderer. Output is a Tailwind-styled, dark-themed page mirroring the
 * existing pSEO pattern (see app/integrations/mistral/page.tsx).
 *
 * No client state, no effects — render-only Server Component.
 */
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import {
  FRAMEWORKS,
  type FrameworkPositioning,
} from "@/lib/for-framework-data";

const SITE = "https://signals.gitdealflow.com";
const A2A_URL = `${SITE}/api/a2a`;
const MCP_URL = `${SITE}/api/mcp/rpc`;

interface Props {
  framework: FrameworkPositioning;
}

export function ForFrameworkPage({ framework: f }: Props) {
  const path = `/for-${f.slug}`;
  const url = `${SITE}${path}`;
  const title = `Use GitDealFlow with ${f.name} — VC Engineering Signals for Your Agent`;
  const description = `${f.hook} Free A2A endpoint, MCP server, no auth. 140 venture-backed startups across 20 sectors, refreshed weekly.`;

  const others = FRAMEWORKS.filter((x) => x.slug !== f.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: title,
        description,
        url,
        author: {
          "@type": "Organization",
          name: "GitDealFlow",
          url: "https://gitdealflow.com",
        },
        datePublished: "2026-05-03",
        dateModified: new Date().toISOString().slice(0, 10),
        about: {
          "@type": "SoftwareApplication",
          name: `GitDealFlow Signal Agent for ${f.name}`,
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Any",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", ".speakable", "[data-agent-summary]"],
        },
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: SITE,
        },
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
            name: "Integrations",
            item: `${SITE}/integrations`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: f.name,
            item: url,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: f.faqs.map((q) => ({
          "@type": "Question",
          name: q.q,
          acceptedAnswer: { "@type": "Answer", text: q.a },
        })),
      },
      {
        "@type": "HowTo",
        name: `Wire GitDealFlow into ${f.name}`,
        description: f.hook,
        totalTime: "PT5M",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Install dependencies",
            text: `Install your ${f.name} runtime and any networking helper (requests for Python, fetch is built in for TypeScript).`,
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Wire the GitDealFlow tool",
            text: `Define a tool that POSTs JSON-RPC to ${A2A_URL} or, for MCP-native frameworks, point to the @gitdealflow/mcp-signal package over stdio.`,
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Run and ask a question",
            text: `Hand the tool to a ${f.name} agent and ask it about trending sectors, named startups, or methodology citations. Verify response shape against the published schema.`,
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
      <AgentMirrorLinks path={path} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav
          className="mb-6 text-sm text-gray-400"
          aria-label="Breadcrumb"
        >
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/integrations"
            className="hover:text-gray-300 transition-colors"
          >
            Integrations
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{f.name}</span>
        </nav>

        <div className="mb-3 text-xs font-medium text-sky-500 uppercase tracking-wider">
          PROGRAMMATIC INTEGRATION · {f.name.toUpperCase()}
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          GitDealFlow × {f.name}
        </h1>
        <p
          className="text-gray-300 text-lg leading-relaxed mb-6 max-w-2xl speakable"
          data-agent-summary
        >
          {f.hook}
        </p>

        <div className="rounded-xl border border-amber-900/50 bg-amber-950/30 p-4 mb-10 text-sm">
          <div className="flex items-center gap-2 text-amber-400 font-medium mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Crunchbase Pro: $20K/yr. GitDealFlow A2A: free, no signup.
          </div>
          <code className="text-amber-200 font-mono text-xs break-all">
            POST {A2A_URL}
          </code>
        </div>

        <section
          className="mb-12 prose prose-invert max-w-none"
          aria-labelledby="why"
        >
          <h2
            id="why"
            className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-4"
          >
            Why ship this
          </h2>
          {f.narrative.map((para, i) => (
            <p
              key={i}
              className="text-gray-400 text-base leading-relaxed mb-4 last:mb-0"
            >
              {para}
            </p>
          ))}
        </section>

        <section className="mb-12" aria-labelledby="outcomes">
          <h2
            id="outcomes"
            className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-4"
          >
            What you can build
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {f.outcomes.map((o) => (
              <div
                key={o.title}
                className="rounded-lg border border-slate-800 bg-slate-900 p-5"
              >
                <h3 className="text-gray-100 font-semibold mb-2">{o.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {o.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12" aria-labelledby="starter">
          <h2
            id="starter"
            className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-4"
          >
            {f.starterCode.title}
          </h2>
          <CodeBlock code={f.starterCode.code} lang={f.starterCode.lang} />
        </section>

        <section className="mb-12" aria-labelledby="production">
          <h2
            id="production"
            className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-4"
          >
            {f.productionCode.title}
          </h2>
          <CodeBlock
            code={f.productionCode.code}
            lang={f.productionCode.lang}
          />
        </section>

        <section className="mb-12" aria-labelledby="prompts">
          <h2
            id="prompts"
            className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-4"
          >
            Five prompts to try first
          </h2>
          <ul className="rounded-lg border border-slate-800 bg-slate-900 divide-y divide-slate-800">
            {f.examplePrompts.map((p) => (
              <li
                key={p}
                className="p-4 sm:p-5 text-gray-300 text-sm leading-relaxed"
              >
                <span className="text-emerald-400 font-mono mr-2">›</span>
                {p}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12" aria-labelledby="faq">
          <h2
            id="faq"
            className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-4"
          >
            FAQ
          </h2>
          <div className="space-y-3">
            {f.faqs.map((q) => (
              <details
                key={q.q}
                className="rounded-lg border border-slate-800 bg-slate-900 p-5 group"
              >
                <summary className="text-gray-100 font-semibold cursor-pointer list-none flex items-start justify-between gap-4">
                  <span>{q.q}</span>
                  <span className="text-sky-500 text-xl leading-none flex-shrink-0 group-open:rotate-45 transition-transform">
                    +
                  </span>
                </summary>
                <p className="text-gray-400 text-sm leading-relaxed mt-3">
                  {q.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-12" aria-labelledby="gotchas">
          <h2
            id="gotchas"
            className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-4"
          >
            Gotchas
          </h2>
          <ul className="rounded-lg border border-slate-800 bg-slate-900 divide-y divide-slate-800">
            {f.gotchas.map((g) => (
              <li
                key={g}
                className="p-4 sm:p-5 text-gray-400 text-sm leading-relaxed"
              >
                {g}
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12" aria-labelledby="references">
          <h2
            id="references"
            className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-4"
          >
            References
          </h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5 text-sm text-gray-400 leading-relaxed">
            <ul className="space-y-2 list-disc pl-5">
              {f.docsLinks.map((d) => (
                <li key={d.url}>
                  <a
                    href={d.url}
                    className="text-sky-400 hover:text-sky-300 font-medium"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {d.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={`${SITE}/.well-known/agent-card.json`}
                  className="text-sky-400 hover:text-sky-300 font-medium"
                >
                  Our AgentCard (A2A descriptor)
                </a>
              </li>
              <li>
                <a
                  href={MCP_URL}
                  className="text-sky-400 hover:text-sky-300 font-medium break-all"
                >
                  MCP HTTP endpoint
                </a>{" "}
                — same five skills, Streamable HTTP, no auth.
              </li>
              <li>
                <a
                  href="https://ssrn.com/abstract=6606558"
                  className="text-sky-400 hover:text-sky-300 font-medium"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Methodology paper (SSRN)
                </a>
              </li>
              {f.a2aSlug ? (
                <li>
                  <Link
                    href={`/a2a/${f.a2aSlug}`}
                    className="text-sky-400 hover:text-sky-300 font-medium"
                  >
                    Companion: A2A wire-up for {f.name}
                  </Link>{" "}
                  — copy/paste install snippets and the alternative-approach
                  patterns.
                </li>
              ) : null}
            </ul>
          </div>
        </section>

        <section className="mb-12" aria-labelledby="other-frameworks">
          <h2
            id="other-frameworks"
            className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-4"
          >
            Other frameworks
          </h2>
          <ul className="flex flex-wrap gap-2 list-none p-0">
            {others.map((o) => (
              <li key={o.slug}>
                <Link
                  href={`/for-${o.slug}`}
                  className="inline-block px-3 py-1.5 rounded-full border border-slate-700 bg-slate-900 text-gray-300 text-sm hover:border-sky-700 hover:text-sky-300 transition-colors"
                >
                  {o.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-12" aria-labelledby="upgrade">
          <h2
            id="upgrade"
            className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-4"
          >
            When the free signal isn&rsquo;t enough
          </h2>
          <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-6 sm:p-8">
            <p className="text-gray-300 text-base leading-relaxed mb-2 max-w-2xl">
              The A2A and MCP endpoints above are free and ungated — that&rsquo;s
              where every {f.name} agent should start. When you need report-grade
              enrichment on a named startup, the deep signal runs at{" "}
              <span className="text-emerald-300 font-semibold">
                €0.19 / call
              </span>{" "}
              — €19 buys 100 credits, credits never expire, and a miss (an org we
              don&rsquo;t track) is free.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-2xl">
              Prefer to pay per call with no API key? The same endpoint speaks{" "}
              <a
                href="https://x402.org"
                className="text-emerald-300 hover:text-emerald-200 font-medium underline decoration-dotted"
                target="_blank"
                rel="noopener noreferrer"
              >
                x402
              </a>{" "}
              — settle in USDC on Base, $0.19/call, no signup.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/agents/credits"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold transition-colors"
              >
                Buy 100 credits — €19 <span aria-hidden="true">&nbsp;→</span>
              </Link>
              <Link
                href="/for-builders"
                className="inline-flex items-center justify-center px-6 py-3 rounded-lg border border-emerald-700 bg-transparent hover:border-emerald-500 text-emerald-200 text-sm font-semibold transition-colors"
              >
                See the builder offer <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Stuck on the wire-up?
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            Email signals@gitdealflow.com — replies within 24 hours, EU business
            time. Include the framework name and the error in the message body
            and a snippet of your tool definition.
          </p>
          <Link
            href={`mailto:signals@gitdealflow.com?subject=${encodeURIComponent(
              `${f.name} integration help`,
            )}`}
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
          >
            Email support
          </Link>
        </div>

        <div className="mt-8 flex justify-center">
          <DataNerdSignoff variant="compact" />
        </div>
      </div>
    </>
  );
}

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  return (
    <pre
      className="rounded-lg border border-slate-800 bg-slate-950 p-4 sm:p-5 overflow-x-auto text-xs sm:text-sm leading-relaxed"
      data-lang={lang}
    >
      <code className="text-gray-200 font-mono whitespace-pre">{code}</code>
    </pre>
  );
}
