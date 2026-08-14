import { parseTrendSlug } from "@/lib/data";
import { renderBrandOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "VC Deal Flow Signal, Trend";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = parseTrendSlug(slug);

  if (!t) {
    return renderBrandOG({
      kind: "Trend",
      title: "Sector Trend",
      footerLeft: `signals.gitdealflow.com/trends/${slug}`,
      accent: "#22d3ee",
    });
  }

  return renderBrandOG({
    kind: "Trend",
    title: `${t.sector.name}: ${t.periodA.name} → ${t.periodB.name}`,
    subtitle: `Period-over-period engineering acceleration in ${t.sector.name.toLowerCase()} startups, commit velocity, contributor growth, and signal mix.`,
    stats: [
      { value: t.snapshotA.startups.length, label: `Startups (${t.periodA.name})` },
      { value: t.snapshotB.startups.length, label: `Startups (${t.periodB.name})` },
    ],
    footerLeft: `signals.gitdealflow.com/trends/${slug}`,
    footerRight: `${t.periodA.name} → ${t.periodB.name}`,
    accent: "#22d3ee",
  });
}
