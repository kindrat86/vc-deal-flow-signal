import "server-only";
import marketsData from "@/data/markets.json";

export interface MarketCandidate {
  name: string;
  displayName: string;
  websiteUrl: string;
  githubUrl: string;
  stage: string;
  sector: string;
  sectorSlug: string;
  signalType: string;
  commitVelocity14d: number;
  commitVelocityChange: string;
  contributors: number;
  contributorGrowth: string;
  newRepos: number;
  impliedProbability: number;
  rationale: string;
}

export interface MarketMirror {
  platform: string;
  status: "live" | "draft" | "submitted-as-suggestion" | "not-applicable";
  url: string | null;
  playMoneyOnly?: boolean;
  note: string;
}

export interface Market {
  slug: string;
  question: string;
  shortName: string;
  category: string;
  openedOn: string;
  resolvesOn: string;
  resolverNote: string;
  methodologyUrl: string;
  sourceOfTruth: string;
  candidates: MarketCandidate[];
  noResolution: { label: string; impliedProbability: number };
  externalMirrors: MarketMirror[];
}

interface MarketsData {
  markets: Market[];
}

const data = marketsData as unknown as MarketsData;

export function getAllMarkets(): Market[] {
  return data.markets;
}

export function getMarket(slug: string): Market | null {
  return data.markets.find((m) => m.slug === slug) ?? null;
}

export function getMarketSlugs(): string[] {
  return data.markets.map((m) => m.slug);
}

export function pctLabel(p: number): string {
  return `${Math.round(p * 100)}%`;
}
