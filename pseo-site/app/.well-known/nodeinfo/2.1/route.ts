import { getAllSectors, getCurrentPeriod, getAllStartupSlugs } from "@/lib/data";
import { posts } from "@/content/posts";

export async function GET() {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const totalStartups = sectors.reduce(
    (sum, s) => sum + (s.periods[period.slug]?.startups.length ?? 0),
    0
  );

  const body = {
    version: "2.1",
    software: {
      name: "vc-deal-flow-signal",
      version: "1.0.0",
      repository: "https://github.com/kindrat86/mcp-deal-flow-signal",
      homepage: "https://gitdealflow.com",
    },
    protocols: ["activitypub"],
    services: { inbound: [], outbound: ["rss2.0", "atom1.0", "jsonfeed1.1"] },
    openRegistrations: false,
    usage: {
      users: { total: 1, activeMonth: 1, activeHalfyear: 1 },
      localPosts: posts.length,
      localComments: 0,
    },
    metadata: {
      nodeName: "VC Deal Flow Signal",
      nodeDescription:
        "GitHub commit-velocity tracking for venture capital — open-data alternative-data product.",
      sectorsTracked: sectors.length,
      startupsTracked: totalStartups,
      currentPeriod: period.name,
      apis: [
        "https://signals.gitdealflow.com/api/openapi.json",
        "https://signals.gitdealflow.com/api/signals.json",
        "https://signals.gitdealflow.com/api/dataset.jsonl",
      ],
      mcp: "https://signals.gitdealflow.com/.well-known/mcp.json",
      aiPolicy: "https://signals.gitdealflow.com/.well-known/ai-policy.json",
      license: "CC-BY-4.0",
    },
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type":
        'application/json; profile="http://nodeinfo.diaspora.software/ns/schema/2.1#"; charset=utf-8',
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
