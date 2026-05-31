import { getStageSectorData } from "@/lib/data";
import { renderBrandOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "VC Deal Flow Signal — Stage × Sector";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string; sector: string }>;
}) {
  const { slug, sector } = await params;
  const data = getStageSectorData(slug, sector);

  if (!data) {
    return renderBrandOG({
      kind: "Stage × Sector",
      title: "Stage × Sector",
      footerLeft: `signals.gitdealflow.com/stage/${slug}/${sector}`,
      accent: "#a78bfa",
    });
  }

  return renderBrandOG({
    kind: `${data.stageName} · ${data.sector.name}`,
    title: `${data.stageName} ${data.sector.name} Startups`,
    subtitle: `${data.startups.length} ${data.sector.name.toLowerCase()} startups at ${data.stageName.toLowerCase()} stage in ${data.period.name}.`,
    stats: [{ value: data.startups.length, label: "Startups" }],
    footerLeft: `signals.gitdealflow.com/stage/${slug}/${sector}`,
    footerRight: data.period.name,
    accent: "#a78bfa",
  });
}
