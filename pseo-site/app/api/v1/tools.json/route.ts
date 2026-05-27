/**
 * /api/v1/tools.json — machine-readable catalog of the /tools archetype.
 *
 * Companion to /api/v1/glossary.json + /api/v1/dataset.jsonl. Enables
 * MCP servers, AI agents, RAG pipelines, and external curators to
 * discover the 8 free calculators with one fetch instead of crawling
 * /tools and parsing JSON-LD per page.
 *
 * Each entry carries:
 *   - slug, name, tagline, category (matches the /tools index UI)
 *   - canonical page URL
 *   - per-share OG image URL template (no params = default render)
 *   - JSON-LD type emitted by the page (always SoftwareApplication
 *     for calculators)
 *   - param keys the page reads for URL-state sharing
 *
 * CC BY 4.0. Refresh weekly.
 */

const SITE = "https://signals.gitdealflow.com";

interface ToolCatalogEntry {
  slug: string;
  name: string;
  tagline: string;
  category: string;
  url: string;
  og_image_url: string;
  json_ld_type: "SoftwareApplication";
  share_params: string[];
  description: string;
  bands_source: string | null;
}

const TOOLS: ToolCatalogEntry[] = [
  {
    slug: "safe-calculator",
    name: "SAFE Calculator",
    tagline: "Post-money SAFE conversion math",
    category: "Financing math",
    url: `${SITE}/tools/safe-calculator`,
    og_image_url: `${SITE}/api/og/tools/safe-calculator`,
    json_ld_type: "SoftwareApplication",
    share_params: ["amount", "cap", "discount", "pre", "invest"],
    description:
      "Model YC 2018+ post-money SAFE conversion under both the valuation cap and the discount. Compare effective ownership at the next priced round.",
    bands_source: null,
  },
  {
    slug: "runway-calculator",
    name: "Runway Calculator",
    tagline: "Cash, burn, headcount scenarios",
    category: "Cash horizon",
    url: `${SITE}/tools/runway-calculator`,
    og_image_url: `${SITE}/api/og/tools/runway-calculator`,
    json_ld_type: "SoftwareApplication",
    share_params: ["cash", "burn", "rev", "hires", "salary"],
    description:
      "Cash divided by net burn gives months of runway, with the option to model adding engineers at loaded cost (salary × 1.3 / 12).",
    bands_source:
      "Fundraise-timing convention: danger <6mo, warning 6-12mo, safe ≥12mo.",
  },
  {
    slug: "burn-multiple-calculator",
    name: "Burn Multiple Calculator",
    tagline: "SaaS capital efficiency",
    category: "SaaS metrics",
    url: `${SITE}/tools/burn-multiple-calculator`,
    og_image_url: `${SITE}/api/og/tools/burn-multiple-calculator`,
    json_ld_type: "SoftwareApplication",
    share_params: ["start", "end", "burn", "months"],
    description:
      "Total burn / net new ARR, classified into the David Sacks bands (<1× exceptional, 1-1.5× great, 1.5-2× OK, 2-3× suspect, >3× bad).",
    bands_source: "David Sacks (2020)",
  },
  {
    slug: "magic-number-calculator",
    name: "Magic Number Calculator",
    tagline: "SaaS sales efficiency",
    category: "SaaS metrics",
    url: `${SITE}/tools/magic-number-calculator`,
    og_image_url: `${SITE}/api/og/tools/magic-number-calculator`,
    json_ld_type: "SoftwareApplication",
    share_params: ["prior", "current", "spend"],
    description:
      "Annualized net new ARR / quarterly S&M spend. Bessemer / OpenView bands (>1.5 exceptional, 1-1.5 good, 0.75-1 OK, <0.75 bad).",
    bands_source: "Bessemer / OpenView",
  },
  {
    slug: "cac-payback-calculator",
    name: "CAC Payback Calculator",
    tagline: "Customer-acquisition-cost in months",
    category: "SaaS metrics",
    url: `${SITE}/tools/cac-payback-calculator`,
    og_image_url: `${SITE}/api/og/tools/cac-payback-calculator`,
    json_ld_type: "SoftwareApplication",
    share_params: ["spend", "customers", "arpc", "gm"],
    description:
      "CAC / (monthly ARPC × GM%) in months. Standard bands (<6 exceptional, 6-12 great, 12-18 good, 18-24 OK, >24 bad).",
    bands_source: "Bessemer / OpenView",
  },
  {
    slug: "ltv-calculator",
    name: "LTV Calculator",
    tagline: "Customer lifetime value + LTV:CAC ratio",
    category: "SaaS metrics",
    url: `${SITE}/tools/ltv-calculator`,
    og_image_url: `${SITE}/api/og/tools/ltv-calculator`,
    json_ld_type: "SoftwareApplication",
    share_params: ["arpc", "gm", "churn", "cac"],
    description:
      "(ARPC/12) × gross margin × customer lifetime, with optional CAC for the LTV:CAC ratio. Bands: >5× exceptional, 3-5× healthy, 2-3× OK, 1-2× suspect, <1× bad.",
    bands_source: "SaaStr / ICONIQ / Bessemer",
  },
  {
    slug: "quick-ratio-calculator",
    name: "Quick Ratio Calculator",
    tagline: "SaaS growth efficiency",
    category: "SaaS metrics",
    url: `${SITE}/tools/quick-ratio-calculator`,
    og_image_url: `${SITE}/api/og/tools/quick-ratio-calculator`,
    json_ld_type: "SoftwareApplication",
    share_params: ["new", "exp", "churn", "contract"],
    description:
      "(New ARR + expansion) / (churned + contracted). Kleiner Perkins / Mamoon Hamid bands (≥4 exceptional, 2-4 healthy, 1.5-2 OK, 1-1.5 concerning, <1 bad).",
    bands_source: "Kleiner Perkins / Mamoon Hamid",
  },
  {
    slug: "dilution-stack",
    name: "Dilution Stack",
    tagline: "Multi-SAFE + Series A + option pool",
    category: "Financing math",
    url: `${SITE}/tools/dilution-stack`,
    og_image_url: `${SITE}/api/og/tools/dilution-stack`,
    json_ld_type: "SoftwareApplication",
    share_params: [
      "s1a",
      "s1c",
      "s2a",
      "s2c",
      "s3a",
      "s3c",
      "pre",
      "invest",
      "pool",
    ],
    description:
      "Up to 3 stacked post-money SAFEs converting at a priced Series A with option pool refresh. Shows final cap table and founder ownership with over-dilution warnings.",
    bands_source:
      "Founders' final %: ≥50% excellent, 30-50% healthy, 15-30% diluted, <15% very-diluted, <0% over-diluted.",
  },
];

const CATEGORIES = [
  {
    slug: "financing-math",
    name: "Financing math",
    tool_slugs: ["safe-calculator", "dilution-stack"],
  },
  {
    slug: "cash-horizon",
    name: "Cash horizon",
    tool_slugs: ["runway-calculator"],
  },
  {
    slug: "saas-metrics",
    name: "SaaS efficiency suite",
    tool_slugs: [
      "burn-multiple-calculator",
      "magic-number-calculator",
      "cac-payback-calculator",
      "ltv-calculator",
      "quick-ratio-calculator",
    ],
  },
];

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
  const body = {
    version: "1.0",
    source: "VC Deal Flow Signal",
    source_url: SITE,
    catalog_url: `${SITE}/api/v1/tools.json`,
    license: "CC-BY-4.0",
    cite_as:
      "The Data Nerd. \"VC Deal Flow Signal Tools Catalog.\" https://signals.gitdealflow.com/api/v1/tools.json",
    last_modified: new Date().toISOString().slice(0, 10),
    count: TOOLS.length,
    categories: CATEGORIES.map((c) => ({
      ...c,
      count: c.tool_slugs.length,
    })),
    tools: TOOLS,
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800",
      "X-Robots-Tag": "index, follow",
      Link: `<${SITE}/api/v1/tools.json>; rel="canonical"`,
      "Access-Control-Allow-Origin": "*",
    },
  });
}
