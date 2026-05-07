import { getFramework } from "@/lib/a2a-frameworks";
import { renderBrandOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "VC Deal Flow Signal — A2A Integration";

export default async function OGImage({
  params,
}: {
  params: Promise<{ framework: string }>;
}) {
  const { framework } = await params;
  const fw = getFramework(framework);

  if (!fw) {
    return renderBrandOG({
      kind: "A2A",
      title: "A2A Integration",
      footerLeft: `signals.gitdealflow.com/a2a/${framework}`,
      accent: "#22d3ee",
    });
  }

  return renderBrandOG({
    kind: "A2A · Free",
    title: `${fw.name} + GitDealFlow`,
    subtitle: `Plug ${fw.name} into the A2A endpoint and let your agent query startup engineering signals — trending, sector, lookup, methodology — in real time.`,
    footerLeft: `signals.gitdealflow.com/a2a/${framework}`,
    footerRight: "No auth · Free tier",
    accent: "#22d3ee",
  });
}
