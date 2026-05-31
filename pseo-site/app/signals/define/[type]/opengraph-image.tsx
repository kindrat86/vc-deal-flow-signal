import { getPrimitiveBySlug } from "@/content/signal-primitives";
import { renderBrandOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "VC Deal Flow Signal — Signal Definition";

export default async function OGImage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const p = getPrimitiveBySlug(type);

  if (!p) {
    return renderBrandOG({
      kind: "Definition",
      title: "Signal Definition",
      footerLeft: `signals.gitdealflow.com/signals/define/${type}`,
      accent: "#10b981",
    });
  }

  return renderBrandOG({
    kind: "Definition",
    title: p.name,
    subtitle: p.interpretation,
    stats: [
      { value: p.unit, label: "Unit" },
      { value: p.window, label: "Window" },
    ],
    footerLeft: `signals.gitdealflow.com/signals/define/${type}`,
    footerRight: p.shortName,
    accent: "#10b981",
  });
}
