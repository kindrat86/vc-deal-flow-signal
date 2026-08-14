import { parseGeoPageSlug } from "@/lib/data";
import { renderBrandOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "VC Deal Flow Signal, Geo Ranking";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const parsed = parseGeoPageSlug(slug);

  if (!parsed) {
    return renderBrandOG({
      kind: "Geo",
      title: "Startups to Watch",
      footerLeft: `signals.gitdealflow.com/startups-to-watch/geo/${slug}`,
      accent: "#10b981",
    });
  }

  const { geoName, sector, period, startups } = parsed;

  return renderBrandOG({
    kind: "Geo Ranking",
    title: `${sector.name} in ${geoName}`,
    subtitle: `Top ${sector.name.toLowerCase()} startups in ${geoName} ranked by GitHub engineering acceleration in ${period.name}.`,
    stats: [{ value: startups.length, label: "Startups" }],
    footerLeft: `signals.gitdealflow.com/startups-to-watch/geo/${slug}`,
    footerRight: period.name,
    accent: "#10b981",
  });
}
