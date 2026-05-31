import { getLaunchBySlug } from "@/content/launches";
import { renderBrandOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "VC Deal Flow Signal — Launch";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const l = getLaunchBySlug(slug);

  return renderBrandOG({
    kind: l?.isOpen ? "Launch · Open" : "Launch",
    title: l?.headline ?? "Launch",
    subtitle: l?.hook,
    stats: l
      ? [
          { value: l.launchPrice, label: "Launch price" },
          { value: l.standaloneTotal, label: "Standalone total" },
        ]
      : undefined,
    footerLeft: `signals.gitdealflow.com/launch/${slug}`,
    footerRight: l?.cohort,
    accent: "#f59e0b",
  });
}
