import { getSignalSectorData } from "@/lib/data";
import { renderBrandOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "VC Deal Flow Signal — Signal × Sector";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string; sector: string }>;
}) {
  const { slug, sector } = await params;
  const data = getSignalSectorData(slug, sector);

  if (!data) {
    return renderBrandOG({
      kind: "Signal × Sector",
      title: "Signal × Sector",
      footerLeft: `signals.gitdealflow.com/signals/${slug}/${sector}`,
      accent: "#22d3ee",
    });
  }

  return renderBrandOG({
    kind: `${data.signalName} · ${data.sector.name}`,
    title: `${data.sector.name} startups showing ${data.signalName}`,
    subtitle: data.signalDescription,
    stats: [{ value: data.startups.length, label: "Startups" }],
    footerLeft: `signals.gitdealflow.com/signals/${slug}/${sector}`,
    footerRight: data.period.name,
    accent: "#22d3ee",
  });
}
