import { getStagePageData } from "@/lib/data";
import { renderBrandOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "VC Deal Flow Signal, Stage";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = getStagePageData(slug);

  if (!data) {
    return renderBrandOG({
      kind: "Stage",
      title: "Stage",
      footerLeft: `signals.gitdealflow.com/stage/${slug}`,
      accent: "#a78bfa",
    });
  }

  return renderBrandOG({
    kind: "Stage",
    title: `${data.name} Startups`,
    subtitle:
      data.description ||
      `Engineering acceleration leaders at ${data.name.toLowerCase()} stage in ${data.period.name}.`,
    stats: [
      { value: data.startups.length, label: "Startups" },
      { value: data.sectorBreakdown.length, label: "Sectors" },
    ],
    footerLeft: `signals.gitdealflow.com/stage/${slug}`,
    footerRight: data.period.name,
    accent: "#a78bfa",
  });
}
