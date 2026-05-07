import { getSignalTypeData, getCurrentPeriod } from "@/lib/data";
import { renderBrandOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "VC Deal Flow Signal — Signal Type";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getSignalTypeData(slug);
  const period = getCurrentPeriod();

  if (!data) {
    return renderBrandOG({
      kind: "Signal",
      title: "Signal Type",
      footerLeft: `signals.gitdealflow.com/signals/${slug}`,
      accent: "#22d3ee",
    });
  }

  const accent =
    slug === "breakout" || slug === "accelerating" ? "#22d3ee" : "#0ea5e9";

  return renderBrandOG({
    kind: data.name,
    title: `${data.name} — Engineering Signal`,
    subtitle: data.description,
    stats: [
      { value: data.totalAcrossSectors, label: "Startups (all sectors)" },
      { value: data.startups.length, label: "Featured" },
    ],
    footerLeft: `signals.gitdealflow.com/signals/${slug}`,
    footerRight: period.name,
    accent,
  });
}
