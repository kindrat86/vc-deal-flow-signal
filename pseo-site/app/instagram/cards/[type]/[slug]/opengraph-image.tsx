/**
 * Per-card 1080×1080 PNG endpoint — used by Instagram and by link unfurls.
 *
 * Next.js App Router serves this automatically at
 *   /instagram/cards/<type>/<slug>/opengraph-image
 * with `Content-Type: image/png`. The render-batch script downloads each
 * URL into a folder uploaded via Meta Creator Studio.
 *
 * Generates only the (type, slug) pairs that appear in the queue — keeps
 * the static build deterministic and fast.
 */
import { renderInstagramCard } from "@/lib/instagram-card-renderer";
import {
  type InstagramCardType,
  getAllCardKeys,
} from "@/content/instagram-queue";

export const size = { width: 1080, height: 1080 };
export const contentType = "image/png";
export const alt = "@thedatanerd — VC Deal Flow Signal · 1080×1080 card";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateImageMetadata({
  params,
}: {
  params: { type: string; slug: string };
}) {
  return [
    {
      id: `${params.type}-${params.slug}`,
      size,
      contentType,
      alt,
    },
  ];
}

export default async function CardImage({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type, slug } = await params;
  return renderInstagramCard(type as InstagramCardType, slug);
}

// Export the static-param generator so generateImageMetadata + the parent
// page route can share the canonical list.
export function generateStaticParams() {
  return getAllCardKeys().map(({ type, slug }) => ({ type, slug }));
}
