import {
  getAllSectors,
  getCurrentPeriod,
  getAllPeriods,
  SIGNAL_TYPES,
} from "@/lib/data";

const BASE_URL = "https://signals.gitdealflow.com";

export async function GET() {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const allPeriods = getAllPeriods();
  const active = sectors.filter((s) => s.periods[period.slug]);
  const totalStartups = active.reduce(
    (sum, s) => sum + s.periods[period.slug].startups.length,
    0
  );

  const body =
    `---\n` +
    `title: "VC Deal Flow Signal, ${period.name}"\n` +
    `url: ${BASE_URL}/\n` +
    `description: "Engineering acceleration signals from public GitHub data."\n` +
    `source: VC Deal Flow Signal\n` +
    `---\n\n` +
    `# VC Deal Flow Signal\n\n` +
    `Engineering acceleration signals from public GitHub data across ${active.length} startup sectors.\n\n` +
    `## Current Period\n\n${period.name}. ${totalStartups} startup signals across ${active.length} sectors. ${allPeriods.length} quarters of history.\n\n` +
    `## Sectors\n\n${active
      .map(
        (s) =>
          `- [${s.name}](${BASE_URL}/md/startups-to-watch/${s.slug}-${period.slug})`
      )
      .join("\n")}\n\n` +
    `## Signal Types\n\n${SIGNAL_TYPES.map(
      (s) =>
        `- [${s.name}](${BASE_URL}/md/signals/${s.slug}), ${s.description}`
    ).join("\n")}\n\n` +
    `## Other Markdown Alternates\n\n` +
    `- [Methodology](${BASE_URL}/md/methodology)\n` +
    `- [Stage pages](${BASE_URL}/md/stage/seed), ${BASE_URL}/md/stage/{pre-seed,seed,series-a-b,growth}[-{period}]\n` +
    `- [Startup pages](${BASE_URL}/md/startup/{slug}), see [index](${BASE_URL}/llms.txt)\n\n` +
    `## See Also\n\n- [llms.txt](${BASE_URL}/llms.txt)\n- [llms-full.txt](${BASE_URL}/llms-full.txt)\n- [API](${BASE_URL}/api/signals.json)\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      // Content negotiation: the HTML and markdown representations of the
      // same URL must not share an edge-cache entry. Set here (the response
      // origin), not in proxy.ts: Next.js overwrites a middleware-set Vary on
      // the final response, dropping the Accept variant marker.
      "Vary": "Accept",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "index, follow",
    },
  });
}
