import { parseRegionPageSlug } from "@/lib/data";
import { renderBrandOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "VC Deal Flow Signal, Region Ranking";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseRegionPageSlug(slug);

  if (!parsed) {
    return renderBrandOG({
      kind: "Region",
      title: "Startups to Watch",
      footerLeft: `signals.gitdealflow.com/startups-to-watch/region/${slug}`,
      accent: "#10b981",
    });
  }

  return renderBrandOG({
    kind: "Region Ranking",
    title: `${parsed.geoName}, All Sectors`,
    subtitle: `${parsed.startups.length} startups across ${parsed.sectorBreakdown.length} sectors ranked by GitHub engineering acceleration.`,
    stats: [
      { value: parsed.startups.length, label: "Startups" },
      { value: parsed.sectorBreakdown.length, label: "Sectors" },
    ],
    footerLeft: `signals.gitdealflow.com/startups-to-watch/region/${slug}`,
    footerRight: parsed.period.name,
    accent: "#10b981",
  });
}
