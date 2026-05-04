import type { Metadata } from "next";
import Link from "next/link";
import { alternatives } from "@/content/alternatives";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

export const metadata: Metadata = {
  title: "Alternatives to Harmonic.ai, Dealroom, Crunchbase & Forager.ai",
  description:
    "Compare VC Deal Flow Signal against Harmonic.ai, Dealroom, Crunchbase alerts, and Forager.ai. Engineering-signal alternatives for early deal flow — 6-12 weeks before fundraise announcements.",
  alternates: {
    canonical: "/alternatives",
  },
};

export default function AlternativesIndex() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Deal Flow Tool Alternatives",
        description:
          "Head-to-head alternatives comparing VC Deal Flow Signal to Harmonic.ai, Dealroom, Crunchbase, and Forager.ai.",
        url: "https://signals.gitdealflow.com/alternatives",
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
      },
      {
        "@type": "ItemList",
        itemListElement: alternatives.map((alt, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://signals.gitdealflow.com/alternatives/${alt.slug}`,
          name: alt.h1,
        })),
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is VC Deal Flow Signal a direct replacement for Harmonic.ai or Dealroom?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Not a 1:1 replacement — VC Deal Flow Signal is a focused engineering-signal layer, not a full-stack deal-flow platform. Harmonic.ai and Dealroom cover broader entity graphs (founders, funding rounds, hiring, social signals) at enterprise pricing. We cover the GitHub-momentum slice deeply and freely, with machine-readable APIs and an MCP server. Most users run them side-by-side: VC Deal Flow Signal as the leading-indicator alert layer, Harmonic/Dealroom as the enrichment layer once a signal triggers.",
            },
          },
          {
            "@type": "Question",
            name: "What's the lead-time advantage vs Crunchbase alerts?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Crunchbase alerts fire on announced events: funding rounds, leadership changes, product launches. By definition these are lagging indicators — the company has already committed to the milestone. GitHub commit-velocity acceleration patterns historically precede fundraise announcements by 3 to 6 weeks in our dataset (7 of 10 tracked rounds). The lead-time gap is real and reproducible from the public methodology.",
            },
          },
          {
            "@type": "Question",
            name: "Does Forager.ai or Specter.ai cover GitHub signals?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Forager.ai and Specter.ai surface signals from job postings, web traffic, hiring momentum, and social mentions. They do not, as of 2026, package GitHub commit-velocity acceleration as a first-class signal layer with weekly rankings. VC Deal Flow Signal is the only product currently focused exclusively on the GitHub engineering-velocity slice — our methodology is published openly on SSRN at https://ssrn.com/abstract=6606558.",
            },
          },
          {
            "@type": "Question",
            name: "How is pricing different from incumbent platforms?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Most incumbent platforms (Harmonic, SignalFire, Dealroom Enterprise, PitchBook) operate at enterprise tiers — typically USD 30k+ per seat per year, with annual contracts and seat minimums. VC Deal Flow Signal has a free tier (Signal Digest weekly email + 5 free MCP tools), a EUR 9.97/month Dashboard Beta, and a EUR 97/month Insider Circle. The 5 core MCP tools and Chrome extension stay free in perpetuity; paid tiers add private briefings, API access, and custom watchlists.",
            },
          },
          {
            "@type": "Question",
            name: "Can the comparison data here be used for procurement decisions?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "These pages are written by the VC Deal Flow Signal team — useful for surfacing differences, but you should also read the comparison page from the competing tool (most publish their own) and run a hands-on trial. We list public pricing and feature data accurate at the time of writing; tool teams change roadmaps frequently, so verify on the vendor's own site before signing a contract.",
            },
          },
        ],
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
            name: "Alternatives",
            item: "https://signals.gitdealflow.com/alternatives",
          },
        ],
      },
    ],
  };

  return (
    <>
      <AgentMirrorLinks path="/alternatives" qaCategory="general" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Alternatives</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          VC Deal Flow Signal Alternatives
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          Head-to-head alternatives to the most common deal flow tools investors
          already use. Each comparison covers signal philosophy, lead time,
          coverage, pricing, and when each tool is the better fit.
        </p>

        <div className="space-y-6">
          {alternatives.map((alt) => (
            <Link
              key={alt.slug}
              href={`/alternatives/${alt.slug}`}
              className="group block rounded-lg border border-slate-800 bg-slate-900 p-6 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
            >
              <p className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-2">
                vs {alt.competitor}
              </p>
              <h2 className="text-gray-100 font-semibold text-lg mb-2 group-hover:text-sky-400 transition-colors">
                {alt.h1}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                {alt.tagline}
              </p>
              <span className="mt-3 inline-block text-sky-500 text-xs font-medium group-hover:text-sky-400 transition-colors">
                Read comparison &rarr;
              </span>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
