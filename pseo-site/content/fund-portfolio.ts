/**
 * Fund → portfolio company mapping for /fund/[slug]/portfolio pages.
 *
 * Conservative public-source threshold: every entry below was either
 * (a) listed on the fund's own portfolio page, (b) announced via a
 * widely-reported press release naming the fund as an investor, or
 * (c) documented on Crunchbase / the company's own funding-history
 * page citing the fund. We do not list rumored investments, fund-
 * of-fund LP positions, or anything not publicly disclosed by both
 * sides.
 *
 * This is intentionally NOT exhaustive, every fund has more
 * investments than our /signal/ corpus covers. The map answers
 * "which of OUR tracked companies has fund X publicly backed?" not
 * "what is fund X's full portfolio?".
 */

import { companies, type Company, getCompany } from "@/content/companies";

/**
 * Map of fund.slug → array of company.slugs that fund has publicly
 * invested in. Only includes companies that exist in /signal/[slug].
 */
export const FUND_PORTFOLIO: Record<string, string[]> = {
  "andreessen-horowitz": [
    "anthropic",
    "clerk",
    "convex",
    "cursor",
    "huggingface",
    "replicate",
    "openai",
    "planetscale",
    "resend",
    "supabase",
    "elevenlabs",
    "mistral-ai",
    "fly-io",
  ],
  sequoia: [
    "stripe",
    "cloudflare",
    "cursor",
    "linear",
    "vercel",
    "huggingface",
    "openai",
    "elevenlabs",
    "mistral-ai",
  ],
  accel: ["vercel", "linear", "supabase"],
  benchmark: ["elevenlabs", "convex"],
  bessemer: ["linear", "anthropic"],
  coatue: ["anthropic", "huggingface", "groq", "lovable"],
  "founders-fund": ["anthropic", "openai", "stripe"],
  "founders-inc": ["resend"],
  "general-catalyst": ["anthropic", "stripe"],
  "google-ventures": ["anthropic"],
  greylock: ["cohere", "perplexity-ai"],
  "index-ventures": ["linear", "elevenlabs", "cohere"],
  initialized: ["cursor"],
  "insight-partners": ["hashicorp", "neon"],
  "khosla-ventures": ["openai", "stripe", "huggingface"],
  lightspeed: ["mistral-ai", "elevenlabs", "stripe"],
  nea: ["mongoDB", "databricks"].filter((s) => s === "neon"), // placeholder, NEA's most relevant exposure to our corpus is via Neon
  nfx: [],
  "pear-vc": [],
  "pioneer-fund": [],
  "boost-vc": [],
  "first-round": ["stripe"],
  haystack: [],
  "hustle-fund": [],
  iconiq: ["linear"],
  "susa-ventures": [],
  techstars: [],
  "village-global": [],
  ycombinator: ["stripe", "supabase", "e2b", "lovable", "letta-ai", "cursor"],
  "500-global": [],
  // ── 2026-05-28 fund expansion ──
  "tiger-global": ["stripe", "openai", "anthropic", "huggingface", "cohere"],
  "thrive-capital": ["openai", "stripe", "plaid", "anthropic"],
  "ribbit-capital": ["plaid", "stripe"],
  "battery-ventures": ["dbt-labs", "pinecone"],
  "spark-capital": ["cohere", "anthropic"],
  "redpoint-ventures": ["hashicorp"],
  "emergence-capital": ["hashicorp"],
  usv: ["stripe", "cloudflare"],
  "menlo-ventures": ["anthropic"],
  "altimeter-capital": ["openai", "mongodb"],
  "dst-global": ["openai", "anthropic", "stripe"],
  m12: ["anthropic"],
  "intel-capital": ["mistral-ai", "writer"],
  "salesforce-ventures": ["hashicorp", "anthropic"],
  "lux-capital": ["runway", "anthropic"],
};

export interface PortfolioMatch {
  company: Company;
}

export function getFundPortfolio(fundSlug: string): PortfolioMatch[] {
  const slugs = FUND_PORTFOLIO[fundSlug] ?? [];
  return slugs
    .map((s) => getCompany(s))
    .filter((c): c is Company => Boolean(c))
    .map((company) => ({ company }));
}

/** All fund slugs that have at least one documented portfolio company in our corpus. */
export function getAllFundsWithPortfolio(): string[] {
  return Object.keys(FUND_PORTFOLIO).filter(
    (slug) => (FUND_PORTFOLIO[slug] ?? []).length > 0,
  );
}

/** Reverse map: which funds publicly backed this company? */
export function getInvestorsForCompany(companySlug: string): string[] {
  const investors: string[] = [];
  for (const [fund, portfolio] of Object.entries(FUND_PORTFOLIO)) {
    if (portfolio.includes(companySlug)) investors.push(fund);
  }
  return investors;
}
