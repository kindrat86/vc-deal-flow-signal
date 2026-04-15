import { getAllPeriods, getAllSectors, getCurrentPeriod, getDataLastModified } from "@/lib/data";

export async function GET() {
  const periods = getAllPeriods();
  const sectors = getAllSectors();
  const current = getCurrentPeriod();
  const lastModified = getDataLastModified();

  const activeSectors = sectors.filter((s) => s.periods[current.slug]);
  const totalStartups = activeSectors.reduce(
    (sum, s) => sum + s.periods[current.slug].startups.length,
    0
  );

  const changelog = {
    meta: {
      name: "VC Deal Flow Signal — Data Changelog",
      description:
        "Structured log of data updates, periods added, and sector changes. Use this endpoint to determine when data was last refreshed and what changed.",
      lastUpdated: lastModified.toISOString(),
      updateFrequency: "weekly",
      updateDay: "Monday",
    },
    currentPeriod: {
      slug: current.slug,
      name: current.name,
      sectorsActive: activeSectors.length,
      startupsTracked: totalStartups,
      lastDataRefresh: lastModified.toISOString(),
    },
    periods: periods.map((p) => {
      const pSectors = sectors.filter((s) => s.periods[p.slug]);
      const pStartups = pSectors.reduce(
        (sum, s) => sum + s.periods[p.slug].startups.length,
        0
      );
      return {
        slug: p.slug,
        name: p.name,
        current: p.current,
        sectorsActive: pSectors.length,
        startupsTracked: pStartups,
        sectors: pSectors.map((s) => ({
          slug: s.slug,
          name: s.name,
          startupCount: s.periods[p.slug].startups.length,
        })),
      };
    }),
    availableFormats: {
      json: "/api/signals.json",
      csv: "/api/signals.csv",
      openapi: "/api/openapi.json",
      llmsTxt: "/llms.txt",
      llmsFullTxt: "/llms-full.txt",
      aiTxt: "/ai.txt",
      rss: "/feed.xml",
      sitemap: "/sitemap.xml",
    },
  };

  return new Response(JSON.stringify(changelog, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
