import {
  getAllSectors,
  getCurrentPeriod,
  getSortedStartups,
} from "@/lib/data";

export async function GET() {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const activeSectors = sectors.filter((s) => s.periods[period.slug]);

  const headers = [
    "Sector",
    "Startup",
    "Description",
    "Stage",
    "Geography",
    "Commits_14d",
    "Velocity_Change",
    "Contributors",
    "Contributor_Growth",
    "New_Repos",
    "Signal_Type",
    "GitHub_URL",
    "Website_URL",
    "LinkedIn_URL",
  ];

  const rows: string[] = [headers.join(",")];

  for (const sector of activeSectors) {
    const snapshot = sector.periods[period.slug];
    const sorted = getSortedStartups(snapshot.startups);

    for (const s of sorted) {
      const row = [
        csvEscape(sector.name),
        csvEscape(s.name),
        csvEscape(s.description),
        csvEscape(s.stage),
        csvEscape(s.geography),
        String(s.commitVelocity14d),
        csvEscape(s.commitVelocityChange),
        String(s.contributors),
        csvEscape(s.contributorGrowth),
        String(s.newRepos),
        csvEscape(s.signalType),
        csvEscape(s.githubUrl),
        csvEscape(s.websiteUrl ?? ""),
        csvEscape(s.linkedinUrl ?? ""),
      ];
      rows.push(row.join(","));
    }
  }

  return new Response(rows.join("\n"), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="vc-deal-flow-signal-${period.slug}.csv"`,
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

function csvEscape(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}
