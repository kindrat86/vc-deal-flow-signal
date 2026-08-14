import { headers } from "next/headers";

const BASE_URL = "https://signals.gitdealflow.com";

/**
 * Site-wide BreadcrumbList JSON-LD. Renders on every page through the root
 * layout, derived from the `x-pathname` header injected by middleware/proxy.
 *
 * Server component (2026-08-12 fix): the previous client-side implementation
 * used `usePathname()` and rendered a `<script>` tag via React. For some
 * ISR/static pages (notably `/startups-to-watch/[slug]` sector pages),
 * `usePathname()` resolved correctly at runtime but the JSON-LD `<script>`
 * tag was NOT present in the initial server-rendered HTML, Googlebot saw
 * pages with either a missing or malformed BreadcrumbList, triggering the
 * GSC "Missing field 'itemListElement'" error.
 *
 * Reading `x-pathname` from `headers()` in this isolated component is safe
 * for ISR: Next.js evaluates `headers()` at prerender time for
 * `generateStaticParams` routes (the middleware writes the concrete path on
 * every outbound response), so the JSON-LD lands in the static HTML payload
 * without forcing per-request dynamic rendering of the page body.
 *
 * CRITICAL INVARIANT: this component MUST return a complete BreadcrumbList
 * with a non-empty `itemListElement` array, or return `null`. Never emit
 * `{"@type":"BreadcrumbList"}` without `itemListElement`, that is the exact
 * Google Search Console error we are fixing.
 */

// Friendly labels for the top-level segments. Anything not in this map falls
// through to a titlecase of the slug (with hyphens → spaces).
const SEGMENT_LABELS: Record<string, string> = {
  // primary content surfaces
  blog: "Blog",
  research: "Research",
  answers: "Answers",
  faq: "FAQ",
  glossary: "Glossary",
  methodology: "Methodology",
  pricing: "Pricing",
  about: "About",
  press: "Press",
  launch: "Launches",
  changelog: "Changelog",
  citations: "Citations",
  "citation-guide": "Citation Guide",
  // pSEO route families
  vs: "Compare",
  alternatives: "Alternatives",
  compare: "Compare",
  best: "Best",
  "use-cases": "Use Cases",
  signals: "Signals",
  stage: "Stage",
  startup: "Startups",
  "startups-to-watch": "Startups to Watch",
  predicted: "Engineering Acceleration Watch",
  weekly: "Weekly",
  trends: "Trends",
  topics: "Topics",
  geo: "Geographies",
  region: "Regions",
  momentum: "Momentum",
  llms: "LLM Pillars",
  authors: "Authors",
  // commerce/funnel
  book: "Book",
  challenge: "7-Day Challenge",
  walkthrough: "Walkthrough",
  "target-list": "Target List",
  "top-partners": "Top Partners",
  insider: "Insider",
  enterprise: "Enterprise",
  firstlook: "First Look",
  pitch: "Pitch",
  apply: "Apply",
  quiz: "Quiz",
  thanks: "Thanks",
  // agent/dev
  agents: "Agents",
  developers: "Developers",
  install: "Install",
  integrations: "Integrations",
  a2a: "A2A",
  "a2a-demo": "A2A Demo",
  embed: "Embed",
  // i18n root
  ja: "日本語",
  de: "Deutsch",
  es: "Español",
  fr: "Français",
  pt: "Português",
  ko: "한국어",
  hi: "हिन्दी",
  ru: "Русский",
  it: "Italiano",
  nl: "Nederlands",
  ar: "العربية",
  zh: "中文",
};

const HOMEPAGE_NAME = "VC Deal Flow Signal";

// Skip pages that don't benefit from breadcrumbs or already have authoritative
// breadcrumbs that we don't want to dilute. Compared as path prefixes.
const SKIP_PREFIXES = [
  "/api/", // API routes never serve HTML
  "/md/", // Markdown mirror
  "/jsonld/", // JSON-LD mirror
  "/embed/", // iframed widgets
  "/share/", // share-token routes
  "/dashboard", // gated dashboard
  "/account", // gated account
  "/login",
  "/welcome",
];

function titleCase(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function labelForSegment(segment: string): string {
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];
  // Decode percent-encoded segments before titlecasing.
  try {
    const decoded = decodeURIComponent(segment);
    return titleCase(decoded);
  } catch {
    return titleCase(segment);
  }
}

export default async function BreadcrumbsSchema() {
  const hdrs = await headers();
  const pathname = hdrs.get("x-pathname") ?? "/";

  // Skip homepage, a single-item BreadcrumbList is redundant with the
  // sitelink/Organization graph already emitted by RootIdentitySchema.
  if (pathname === "/" || pathname === "") return null;

  // Skip API/asset/internal paths, plus Next internals such as the
  // prerendered /_not-found shell.
  if (pathname.startsWith("/_")) return null;
  if (SKIP_PREFIXES.some((prefix) => pathname.startsWith(prefix))) return null;

  // Strip query/hash if any made it into the header.
  const cleanPath = pathname.split("?")[0].split("#")[0];

  const segments = cleanPath
    .split("/")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // DEFENSIVE GUARD: never emit a BreadcrumbList with an empty itemListElement.
  // This is the exact Google Search Console error we're fixing.
  if (segments.length === 0) return null;

  const itemListElement: Array<Record<string, unknown>> = [
    {
      "@type": "ListItem",
      position: 1,
      name: HOMEPAGE_NAME,
      item: BASE_URL + "/",
    },
  ];

  let cumulativePath = "";
  segments.forEach((segment, idx) => {
    cumulativePath += "/" + segment;
    itemListElement.push({
      "@type": "ListItem",
      position: idx + 2,
      name: labelForSegment(segment),
      item: BASE_URL + cumulativePath,
    });
  });

  // Final safety net: if itemListElement somehow ended up empty, bail.
  if (itemListElement.length === 0) return null;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement,
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify is safe, values are strings derived from URL segments
      // and a static label table; no user input reaches this serialization.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
    />
  );
}
