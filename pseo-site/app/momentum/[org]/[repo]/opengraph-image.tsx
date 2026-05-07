import { getAllSectors, getCurrentPeriod, type Startup } from "@/lib/data";
import { tierFromVelocityChange } from "@/lib/badge-svg";
import { renderBrandOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "VC Deal Flow Signal — Momentum Score";

const TIER_ACCENT: Record<string, string> = {
  cold: "#94a3b8",
  warming: "#0ea5e9",
  hot: "#f59e0b",
  breakout: "#f43f5e",
};

const TIER_LABEL: Record<string, string> = {
  cold: "COLD",
  warming: "WARMING",
  hot: "HOT",
  breakout: "BREAKOUT",
};

function findStartupByGithubPath(orgSlash: string): Startup | null {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const target = `github.com/${orgSlash.toLowerCase()}`;
  const orgOnly = `github.com/${orgSlash.split("/")[0].toLowerCase()}`;
  for (const sector of sectors) {
    const snap = sector.periods[period.slug];
    if (!snap) continue;
    for (const startup of snap.startups) {
      const url = (startup.githubUrl || "").toLowerCase();
      if (url.includes(target) || url.includes(orgOnly)) return startup;
    }
  }
  return null;
}

export default async function OGImage({
  params,
}: {
  params: Promise<{ org: string; repo: string }>;
}) {
  const { org, repo } = await params;
  const startup = findStartupByGithubPath(`${org}/${repo}`);
  const period = getCurrentPeriod();

  if (!startup) {
    return renderBrandOG({
      kind: "Momentum",
      title: `${org}/${repo}`,
      subtitle:
        "Live GitHub momentum score — engineering acceleration tier based on commit velocity Δ.",
      footerLeft: `signals.gitdealflow.com/momentum/${org}/${repo}`,
      footerRight: period.name,
      accent: "#94a3b8",
    });
  }

  const tier = tierFromVelocityChange(startup.commitVelocityChange);
  const accent = TIER_ACCENT[tier] ?? "#0ea5e9";

  return renderBrandOG({
    kind: TIER_LABEL[tier] ?? "Momentum",
    title: `${org}/${repo} — ${TIER_LABEL[tier] ?? "Momentum"}`,
    subtitle: startup.description,
    stats: [
      { value: startup.commitVelocityChange, label: "Commit velocity Δ" },
      { value: startup.contributors, label: "Contributors" },
      { value: startup.commitVelocity14d ?? "—", label: "Commits / 14d" },
    ],
    footerLeft: `signals.gitdealflow.com/momentum/${org}/${repo}`,
    footerRight: period.name,
    accent,
  });
}
