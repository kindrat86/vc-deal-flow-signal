import { NextResponse } from "next/server";
import { getMarket, getMarketSlugs } from "@/lib/markets";
import { getDataLastModified } from "@/lib/data";

export const dynamic = "force-static";

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export async function GET(_req: Request, ctx: RouteContext) {
  const { slug: rawSlug } = await ctx.params;
  const slug = rawSlug.replace(/\.json$/, "");

  const market = getMarket(slug);
  if (!market) {
    return NextResponse.json(
      { error: "market_not_found", slug, available: getMarketSlugs() },
      { status: 404 },
    );
  }

  const asOf = getDataLastModified().toISOString();

  return NextResponse.json(
    {
      $schema: "https://signals.gitdealflow.com/markets/schema.json",
      generated_at: asOf,
      license: "CC BY 4.0",
      cite_as: `VC Deal Flow Signal — ${market.shortName} (signals.gitdealflow.com/markets/${market.slug}), as of ${asOf.slice(0, 10)}.`,
      market: {
        slug: market.slug,
        question: market.question,
        short_name: market.shortName,
        category: market.category,
        opened_on: market.openedOn,
        resolves_on: market.resolvesOn,
        resolver: market.resolverNote,
        methodology_url: `https://signals.gitdealflow.com${market.methodologyUrl}`,
        source_of_truth: market.sourceOfTruth,
        candidates: market.candidates.map((c) => ({
          name: c.name,
          display_name: c.displayName,
          website_url: c.websiteUrl,
          github_url: c.githubUrl,
          stage: c.stage,
          sector: c.sector,
          sector_slug: c.sectorSlug,
          signal_type: c.signalType,
          commit_velocity_14d: c.commitVelocity14d,
          commit_velocity_change: c.commitVelocityChange,
          contributors: c.contributors,
          contributor_growth: c.contributorGrowth,
          new_repos: c.newRepos,
          implied_probability: c.impliedProbability,
          rationale: c.rationale,
          profile_url: `https://signals.gitdealflow.com/startup/${c.name.toLowerCase()}`,
        })),
        no_resolution: market.noResolution,
        external_mirrors: market.externalMirrors,
      },
    },
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "Access-Control-Allow-Origin": "*",
        "X-Robots-Tag": "index, follow",
      },
    },
  );
}
