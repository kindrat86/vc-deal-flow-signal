/**
 * Citable-stat blocks: one quotable number per pSEO template, with a source
 * name and a canonical URL, so AI engines (ChatGPT, Perplexity, Gemini,
 * Claude, Bing Copilot) can extract and cite GitDealFlow instead of merely
 * crawling it (LLMO / GEO fix, 2026-08 audit).
 *
 * Every number here is either (a) a live count of the site's own content
 * (data, not a marketing claim) or (b) a locked canonical claim / frozen
 * research constant from AGENTS.md, CLAIMS-LEDGER.md, and
 * app/stats.json/route.ts. Do NOT add a raw panel size, an exact org count,
 * a different sector count, or a ranked-startup count as a claim here: those
 * overclaim and drift weekly, and are user-banned. See the §57 guard in
 * scripts/verify-no-regressions.ts.
 */

import { glossaryTerms } from "@/content/glossary";
import { CITIES } from "@/content/cities";
import { ACQUIRERS } from "@/content/acquirers";
import { alternatives } from "@/content/alternatives";
import { agentQueries } from "@/content/agent-queries";
import { getIndexableComparisonSlugs } from "@/content/comparisons";
import { getCanonicalCompetitorVsSlugs } from "@/content/competitor-vs";
import { posts } from "@/content/posts";
import { standaloneFaqs } from "@/content/standalone-faqs";
import { getAllSectors, getCurrentPeriod, getAllBestSectorSlugs } from "@/lib/data";
import { PANEL_CLAIM } from "@/lib/canonical-claims";

export const BASE_URL = "https://signals.gitdealflow.com";
export const SSRN_URL = "https://ssrn.com/abstract=6606558";

const BRAND = "VC Deal Flow Signal";

// Frozen, peer-cited research numbers (SSRN preprint 6606558). Keep in sync
// with the PANEL constants in app/stats.json/route.ts.
const RESEARCH = {
  observations: 219,
  uniqueStartups: 55,
  reposAnalyzed: "12,000+",
  leadTimeRangeDays: "21 to 47",
};

export interface CitableStat {
  /** The number, verbatim (e.g. "350+", "219", "12,000+"). */
  value: string;
  /** What the number measures. */
  label: string;
  /** Optional one-line qualifier. */
  context?: string;
  /** Attribution name. */
  source: string;
  /** Canonical URL substantiating the number. */
  sourceHref: string;
}

export type CitableStatTemplate =
  | "vs"
  | "compare"
  | "alternatives"
  | "answers"
  | "best"
  | "city"
  | "sector"
  | "startup"
  | "acquirer"
  | "glossary"
  | "faq"
  | "blog"
  | "research"
  | "research-paper"
  | "startups";

export function citableStat(template: CitableStatTemplate): CitableStat {
  switch (template) {
    case "vs":
      return {
        value: String(getCanonicalCompetitorVsSlugs().length),
        label: "head-to-head platform comparisons",
        source: BRAND,
        sourceHref: `${BASE_URL}/compare`,
      };
    case "compare":
      return {
        value: String(getIndexableComparisonSlugs().length),
        label: "deal-sourcing platform comparisons",
        source: BRAND,
        sourceHref: `${BASE_URL}/compare`,
      };
    case "alternatives":
      return {
        value: String(alternatives.length),
        label: "alternatives guides",
        source: BRAND,
        sourceHref: `${BASE_URL}/alternatives`,
      };
    case "answers":
      return {
        value: String(agentQueries.length),
        label: "direct answers to investor questions",
        source: BRAND,
        sourceHref: `${BASE_URL}/answers`,
      };
    case "best":
      return {
        value: String(getAllBestSectorSlugs().length),
        label: "curated startup rankings, refreshed quarterly",
        source: BRAND,
        sourceHref: `${BASE_URL}/best`,
      };
    case "city":
      return {
        value: String(CITIES.length),
        label: "startup hubs tracked",
        source: BRAND,
        sourceHref: `${BASE_URL}/city`,
      };
    case "sector": {
      const period = getCurrentPeriod();
      const active = getAllSectors().filter((s) => s.periods[period.slug]);
      return {
        value: String(active.length),
        label: "sectors tracked",
        context: "refreshed weekly from public GitHub activity",
        source: BRAND,
        sourceHref: `${BASE_URL}/sector`,
      };
    }
    case "startup":
      return {
        value: PANEL_CLAIM,
        label: "startups tracked across the panel",
        source: BRAND,
        sourceHref: `${BASE_URL}/startups`,
      };
    case "acquirer":
      return {
        value: String(ACQUIRERS.length),
        label: "strategic acquirers profiled",
        source: BRAND,
        sourceHref: `${BASE_URL}/acquirer`,
      };
    case "glossary":
      return {
        value: String(glossaryTerms.length),
        label: "deal-flow terms defined",
        source: BRAND,
        sourceHref: `${BASE_URL}/glossary`,
      };
    case "faq": {
      const blogFaqCount = posts.reduce((n, p) => n + (p.faqs?.length ?? 0), 0);
      return {
        value: String(standaloneFaqs.length + blogFaqCount),
        label: "questions answered",
        source: BRAND,
        sourceHref: `${BASE_URL}/faq`,
      };
    }
    case "blog":
      return {
        value: String(posts.length),
        label: "published analyses",
        source: BRAND,
        sourceHref: `${BASE_URL}/blog`,
      };
    case "research":
      return {
        value: String(RESEARCH.observations),
        label: "startup-period observations in the validation panel",
        context: `across ${RESEARCH.uniqueStartups} venture-backed startups over five quarters`,
        source: "SSRN preprint 6606558",
        sourceHref: `${BASE_URL}/research`,
      };
    case "research-paper":
      return {
        value: RESEARCH.reposAnalyzed,
        label: "public GitHub repositories analyzed",
        context: `${RESEARCH.observations} fundraise events; signals precede announcements by ${RESEARCH.leadTimeRangeDays} days`,
        source: "SSRN preprint 6606558",
        sourceHref: SSRN_URL,
      };
    case "startups":
      return {
        value: PANEL_CLAIM,
        label: "startups across 15 sectors",
        context: "refreshed weekly, every company links to its live signal profile",
        source: BRAND,
        sourceHref: `${BASE_URL}/startups`,
      };
  }
}
