import { NextResponse } from "next/server";
import { getAllSectors, getCurrentPeriod, getStartupProfile, getAllStartupSlugs } from "@/lib/data";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export interface ApiStartupEntry {
  name: string;
  slug: string;
  description: string;
  sector: string;
  sectorSlug: string;
  stage: string;
  geography: string;
  signalType: string;
  commitVelocity14d: number;
  commitVelocityChange: string;
  contributors: number;
  contributorGrowth: string;
  newRepos: number;
  githubUrl: string;
  websiteUrl?: string;
  linkedinUrl?: string;
}

export async function GET() {
  const period = getCurrentPeriod();
  const entries: ApiStartupEntry[] = [];

  for (const sector of getAllSectors()) {
    const snapshot = sector.periods[period.slug];
    if (!snapshot) continue;

    for (const startup of snapshot.startups) {
      const slug = startup.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

      entries.push({
        name: startup.name,
        slug,
        description: startup.description || "",
        sector: sector.name,
        sectorSlug: sector.slug,
        stage: startup.stage,
        geography: startup.geography,
        signalType: startup.signalType,
        commitVelocity14d: startup.commitVelocity14d,
        commitVelocityChange: startup.commitVelocityChange,
        contributors: startup.contributors,
        contributorGrowth: startup.contributorGrowth,
        newRepos: startup.newRepos,
        githubUrl: startup.githubUrl,
        websiteUrl: startup.websiteUrl,
        linkedinUrl: (startup as { linkedinUrl?: string }).linkedinUrl,
      });
    }
  }

  // Compute velocity score (0-100) for each startup
  const withScore = entries.map((e) => {
    const changePct = parseInt(e.commitVelocityChange.replace(/[^0-9-]/g, ""), 10) || 0;
    const contribGrowthPct =
      parseInt(e.contributorGrowth.replace(/[^0-9-]/g, ""), 10) || 0;

    // Velocity score: weighted combo of change magnitude, absolute velocity,
    // contributor growth, and new repos
    const changeScore = Math.min(Math.abs(changePct) / 10, 50);
    const absScore = Math.min(e.commitVelocity14d / 2, 20);
    const contribScore = Math.min(contribGrowthPct / 5, 20);
    const repoScore = Math.min(e.newRepos * 5, 10);

    const velocityScore = Math.round(changeScore + absScore + contribScore + repoScore);

    return { ...e, velocityScore };
  });

  return NextResponse.json({
    meta: {
      total: entries.length,
      sectors: getAllSectors().length,
      period: period.name,
      periodSlug: period.slug,
      updatedAt: new Date().toISOString(),
    },
    startups: withScore,
  });
}
