import type { Metadata } from "next";
import Link from "next/link";
import {
  WORKS_WITH,
  categoryLabel,
  pathLabel,
  type ToolCategory,
} from "@/content/works-with";
import { HreflangLinks } from "@/components/HreflangLinks";
import SeoCta from "@/components/SeoCta";

export const metadata: Metadata = {
  title: `Works with — CRM & Workflow Integrations | VC Deal Flow Signal`,
  description: `${WORKS_WITH.length} CRM and workflow tool integration pages — Affinity, HubSpot, Salesforce, Notion, Airtable, Slack, Linear, and more. For Corp Dev, PE Operating Partners, and emerging-manager funds who want signals inside their existing stack.`,
  alternates: { canonical: "/works-with" },
  openGraph: {
    title: "Works with — VC Deal Flow Signal",
    description: "CRM and workflow tool integrations for VC Deal Flow Signal.",
    type: "website",
    url: "/works-with",
  },
  twitter: {
    card: "summary_large_image",
    title: "Works with — VC Deal Flow Signal",
    description: "CRM and workflow tool integrations.",
  },
};

export const revalidate = 604800;

const PAGE_URL = "https://signals.gitdealflow.com/works-with";

const CATEGORY_ORDER: ToolCategory[] = [
  "vc-crm",
  "general-crm",
  "knowledge",
  "spreadsheet",
  "messaging",
  "project-management",
  "automation",
];

export default function WorksWithHubPage() {
  const byCategory = new Map<ToolCategory, typeof WORKS_WITH>();
  for (const tool of WORKS_WITH) {
    const arr = byCategory.get(tool.category) ?? [];
    arr.push(tool);
    byCategory.set(tool.category, arr);
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        url: PAGE_URL,
        name: "Works with — CRM & Workflow Integrations",
        description: `${WORKS_WITH.length} CRM and workflow integrations for VC Deal Flow Signal — for Marcus 100 audiences who want signals inside their existing stack.`,
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: "https://signals.gitdealflow.com",
        },
      },
      {
        "@type": "ItemList",
        itemListOrder: "Unordered",
        numberOfItems: WORKS_WITH.length,
        itemListElement: WORKS_WITH.map((t, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${PAGE_URL}/${t.slug}`,
          name: t.name,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Works with",
            item: PAGE_URL,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={PAGE_URL}
        languages={{ en: PAGE_URL, "en-US": PAGE_URL, "x-default": PAGE_URL }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Works with</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Works with
        </h1>
        <p className="text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {WORKS_WITH.length} CRM and workflow tool integrations for VC Deal Flow Signal.
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          Each leaf describes how engineering-acceleration signals flow into the tool —
          current paths (CSV, REST API, MCP, Zapier, webhooks) plus custom integrations
          available on request. Built for Marcus 100 audiences (Corp Dev, PE Operating
          Partners, non-engineer tech VPs) who want signals inside their existing stack
          rather than another standalone tool.
        </p>

        {CATEGORY_ORDER.map((cat) => {
          const tools = byCategory.get(cat) ?? [];
          if (tools.length === 0) return null;
          return (
            <section key={cat} className="mb-10" id={cat}>
              <h2 className="text-xl font-semibold text-gray-100 mb-4">
                {categoryLabel(cat)}{" "}
                <span className="text-gray-500 text-sm font-normal">
                  ({tools.length})
                </span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {tools.map((tool) => (
                  <Link
                    key={tool.slug}
                    href={`/works-with/${tool.slug}`}
                    className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                  >
                    <h3 className="text-gray-100 font-medium text-base group-hover:text-sky-400 transition-colors mb-1">
                      {tool.name}
                    </h3>
                    <p className="text-gray-500 text-xs mb-2">
                      {tool.availablePaths.length} paths today
                    </p>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {tool.availablePaths
                        .slice(0, 3)
                        .map(pathLabel)
                        .join(" · ")}
                      {tool.availablePaths.length > 3 ? " · ..." : ""}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <SeoCta className="mt-8" />
      </div>
    </>
  );
}
