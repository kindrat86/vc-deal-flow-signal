import {
  getAllSectors,
  getAllPeriods,
  getCurrentPeriod,
  getDataLastModified,
  SIGNAL_TYPES,
} from "@/lib/data";

const BASE = "https://signals.gitdealflow.com";
const APEX = "https://gitdealflow.com";

export async function GET() {
  const sectors = getAllSectors();
  const periods = getAllPeriods();
  const currentPeriod = getCurrentPeriod();
  const lastModified = getDataLastModified();
  const dateModified = lastModified.toISOString().slice(0, 10);

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${APEX}/#organization`,
        name: "VC Deal Flow Signal",
        alternateName: ["GitDealFlow", "VC Deal Flow Signal (GitDealFlow)"],
        url: APEX,
        logo: {
          "@type": "ImageObject",
          url: `${BASE}/icon`,
          contentUrl: `${BASE}/icon`,
          width: 192,
          height: 192,
          encodingFormat: "image/png",
          caption: "VC Deal Flow Signal logo",
        },
        image: {
          "@type": "ImageObject",
          url: `${BASE}/opengraph-image`,
          width: 1200,
          height: 630,
          encodingFormat: "image/png",
        },
        foundingDate: "2025",
        description:
          "VC Deal Flow Signal tracks startup engineering acceleration using public GitHub data to surface breakout startups before they appear on the funding radar.",
        contactPoint: {
          "@type": "ContactPoint",
          email: "signal@gitdealflow.com",
          contactType: "customer support",
        },
        areaServed: "Worldwide",
        availableLanguage: ["en", "en-US"],
        sameAs: [
          "https://t.me/gitdealflow",
          "https://x.com/data_nerd",
          "https://www.linkedin.com/company/gitdealflow",
          "https://www.wikidata.org/wiki/Q139376302",
          "https://www.crunchbase.com/organization/gitdealflow",
          "https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn",
          "https://www.npmjs.com/package/@gitdealflow/mcp-signal",
          "https://www.producthunt.com/products/vc-deal-flow-signal",
          "https://www.g2.com/products/vc-deal-flow-signal/reviews",
          "https://www.saashub.com/vc-deal-flow-signal",
          "https://alternativeto.net/software/vc-deal-flow-signal/",
          "https://github.com/kindrat86/mcp-deal-flow-signal",
          "https://ssrn.com/abstract=6606558",
          "https://openalex.org/works/W7154916891",
          "https://zenodo.org/records/19650920",
          "https://api.crossref.org/works/10.2139/ssrn.6606558",
          "https://www.semanticscholar.org/paper/A-Longitudinal-Panel-of-GitHub-Engineering-Velocity",
          "https://kaggle.com/datasets/thedatanerd/vc-deal-flow-signal",
        ],
        knowsAbout: [
          "GitHub commit velocity",
          "venture capital alternative data",
          "code-side momentum signals",
          "startup engineering acceleration",
          "open-source contributor-growth analytics",
          "repository-expansion signals",
        ],
        founder: {
          "@type": "Person",
          "@id": `${BASE}/about#person`,
          name: "The Data Nerd",
          jobTitle: "Founder, VC Deal Flow Signal",
          url: `${BASE}/about`,
          sameAs: [
            "https://orcid.org/0009-0002-2222-4112",
            "https://x.com/data_nerd",
            "https://github.com/kindrat86",
            "https://news.ycombinator.com/user?id=the_data_nerd",
            "https://www.indiehackers.com/The_Data_Nerd",
            "https://dev.to/the_data_nerd",
          ],
        },
      },
      {
        "@type": "WebSite",
        "@id": `${BASE}/#website`,
        name: "VC Deal Flow Signal",
        url: BASE,
        publisher: { "@id": `${APEX}/#organization` },
        inLanguage: "en-US",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${BASE}/api/nlweb?query={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "Dataset",
        "@id": `${BASE}/#dataset`,
        name: "VC Deal Flow Signal — Startup Engineering Acceleration Dataset",
        alternateName: "GitDealFlow Startup Engineering Velocity Panel",
        description: `Quarterly longitudinal panel of GitHub engineering-velocity signals across venture-backed startups. Covers commit velocity, contributor growth, repository expansion, and acceleration-signal classification across ${sectors.length} startup sectors and ${periods.length} quarterly periods.`,
        url: BASE,
        identifier: BASE,
        sameAs: APEX,
        version: "1.0.0",
        datePublished: "2026-04-19",
        dateModified,
        isAccessibleForFree: true,
        license: "https://creativecommons.org/licenses/by/4.0/",
        keywords: [
          "venture capital",
          "startups",
          "alternative data",
          "GitHub",
          "open source",
          "engineering velocity",
          "commit activity",
          "deal flow",
          "funding prediction",
          "panel data",
        ],
        creator: { "@id": `${APEX}/#organization` },
        publisher: { "@id": `${APEX}/#organization` },
        distribution: [
          {
            "@type": "DataDownload",
            name: "Startup signals — JSON",
            encodingFormat: "application/json",
            contentUrl: `${BASE}/api/signals.json`,
          },
          {
            "@type": "DataDownload",
            name: "Startup signals — CSV",
            encodingFormat: "text/csv",
            contentUrl: `${BASE}/api/signals.csv`,
          },
          {
            "@type": "DataDownload",
            name: "Q&A corpus — JSONL",
            encodingFormat: "application/x-ndjson",
            contentUrl: `${BASE}/qa.jsonl`,
          },
          {
            "@type": "DataDownload",
            name: "HuggingFace Datasets — JSONL",
            encodingFormat: "application/x-ndjson",
            contentUrl: `${BASE}/api/dataset.jsonl`,
          },
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${BASE}/#software`,
        name: "VC Deal Flow Signal MCP Server",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Cross-platform",
        url: `${BASE}/install`,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@id": `${APEX}/#organization` },
      },
      {
        "@type": "ItemList",
        "@id": `${BASE}/#sectors`,
        name: "Startup Sectors Tracked",
        numberOfItems: sectors.length,
        itemListElement: sectors
          .filter((s) => s.periods[currentPeriod.slug])
          .map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: s.name,
            url: `${BASE}/startups-to-watch/${s.slug}-${currentPeriod.slug}`,
          })),
      },
      {
        "@type": "ItemList",
        "@id": `${BASE}/#signal-types`,
        name: "Engineering Acceleration Signal Types",
        numberOfItems: SIGNAL_TYPES.length,
        itemListElement: SIGNAL_TYPES.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.name,
          url: `${BASE}/signals/${s.slug}`,
        })),
      },
      {
        "@type": "ItemList",
        "@id": `${BASE}/#agent-surfaces`,
        name: "Agent-Discoverable Surfaces",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "MCP server (Streamable HTTP)", url: `${BASE}/api/mcp/rpc` },
          { "@type": "ListItem", position: 2, name: "Google A2A endpoint", url: `${BASE}/api/a2a` },
          { "@type": "ListItem", position: 3, name: "Microsoft NLWeb endpoint", url: `${BASE}/api/nlweb` },
          { "@type": "ListItem", position: 4, name: "OpenAPI 3.1 spec", url: `${BASE}/api/openapi.json` },
          { "@type": "ListItem", position: 5, name: "Agent function-calling tools", url: `${BASE}/api/agent/tools` },
          { "@type": "ListItem", position: 6, name: "ChatGPT plugin manifest", url: `${BASE}/.well-known/ai-plugin.json` },
          { "@type": "ListItem", position: 7, name: "MCP manifest", url: `${BASE}/.well-known/mcp.json` },
          { "@type": "ListItem", position: 8, name: "Google AgentCard (A2A)", url: `${BASE}/.well-known/agent-card.json` },
          { "@type": "ListItem", position: 9, name: "agents.md", url: `${BASE}/agents.md` },
          { "@type": "ListItem", position: 10, name: "llms.txt", url: `${BASE}/llms.txt` },
          { "@type": "ListItem", position: 11, name: "llms-full.txt", url: `${BASE}/llms-full.txt` },
          { "@type": "ListItem", position: 12, name: "Q&A corpus", url: `${BASE}/qa.jsonl` },
          { "@type": "ListItem", position: 13, name: "Knowledge graph (this file)", url: `${BASE}/knowledge-graph.json` },
          { "@type": "ListItem", position: 14, name: "AI usage policy", url: `${BASE}/.well-known/ai-policy.json` },
        ],
      },
      {
        "@type": "ScholarlyArticle",
        "@id": "https://ssrn.com/abstract=6606558",
        name: "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups",
        author: { "@id": `${BASE}/about#person` },
        publisher: { "@id": `${APEX}/#organization` },
        url: "https://ssrn.com/abstract=6606558",
        sameAs: [
          "https://openalex.org/works/W7154916891",
          "https://zenodo.org/records/19650920",
          "https://api.crossref.org/works/10.2139/ssrn.6606558",
          "https://www.semanticscholar.org/paper/A-Longitudinal-Panel-of-GitHub-Engineering-Velocity",
        ],
        license: "https://creativecommons.org/licenses/by/4.0/",
      },
    ],
  };

  return new Response(JSON.stringify(graph, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/ld+json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
