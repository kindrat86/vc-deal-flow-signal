import { getReleaseBySlug } from "@/content/press-releases";
import { renderBrandOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "VC Deal Flow Signal — Press Release";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const r = getReleaseBySlug(slug);

  return renderBrandOG({
    kind: "Press Release",
    title: r?.headline ?? "Press Release",
    subtitle: r?.subhead,
    footerLeft: `signals.gitdealflow.com/press/${slug}`,
    footerRight: r?.dateline,
    accent: "#22d3ee",
  });
}
