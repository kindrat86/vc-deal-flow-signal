import { BOOK, getChapterBySlug } from "@/lib/book";
import { renderBrandOG, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-template";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "VC Deal Flow Signal — Book Chapter";

export default async function OGImage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter } = await params;
  const c = getChapterBySlug(chapter);

  if (!c) {
    return renderBrandOG({
      kind: "Book",
      title: BOOK.title,
      subtitle: BOOK.subtitle,
      footerLeft: `signals.gitdealflow.com/book/read/${chapter}`,
      accent: "#f59e0b",
    });
  }

  return renderBrandOG({
    kind: "Book Chapter",
    title: c.title,
    subtitle: c.summary,
    footerLeft: `signals.gitdealflow.com/book/read/${chapter}`,
    footerRight: BOOK.title,
    accent: "#f59e0b",
  });
}
