import { authors } from "@/content/authors";
import { renderBrandOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "VC Deal Flow Signal, Author";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = authors[slug];

  return renderBrandOG({
    kind: "Author",
    title: a?.name ?? "Author",
    subtitle: a?.bio,
    footerLeft: `signals.gitdealflow.com/authors/${slug}`,
    footerRight: a?.jobTitle,
    accent: "#a78bfa",
  });
}
