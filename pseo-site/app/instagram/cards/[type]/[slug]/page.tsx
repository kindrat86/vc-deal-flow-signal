/**
 * Per-card preview page.
 *
 * Each Instagram post in the queue gets its own URL: a small HTML page that
 * shows the rendered 1080×1080 card inline + the caption text + hashtags +
 * link-in-bio target. Useful for:
 *   - copy-pasting the caption into Instagram on the phone
 *   - link unfurls (the og:image is the same 1080×1080 card)
 *   - sharing a single post link to anyone curious
 *
 * The image itself comes from the sibling `opengraph-image.tsx`.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  type InstagramCardType,
  findCard,
  getAllCardKeys,
} from "@/content/instagram-queue";

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return getAllCardKeys().map(({ type, slug }) => ({ type, slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}): Promise<Metadata> {
  const { type, slug } = await params;
  const post = findCard(type as InstagramCardType, slug);
  const title = post
    ? `${prettyType(type)} · ${slug} — @thedatanerd`
    : `Card · ${type}/${slug} — @thedatanerd`;
  return {
    title,
    description: post
      ? post.caption.split("\n")[0]?.slice(0, 160) ?? title
      : `Instagram card — ${type}/${slug}`,
    alternates: {
      canonical: `/instagram/cards/${type}/${slug}`,
    },
    openGraph: {
      title,
      type: "article",
      url: `https://signals.gitdealflow.com/instagram/cards/${type}/${slug}`,
    },
    robots: {
      // Indexable — these are public reference pages for the IG queue and
      // help link unfurls + agent-side discovery (the cards mirror the same
      // data we expose at /predicted, /signal-of-the-week, /methodology).
      index: true,
      follow: true,
    },
  };
}

function prettyType(t: string): string {
  return t
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default async function InstagramCardPreview({
  params,
}: {
  params: Promise<{ type: string; slug: string }>;
}) {
  const { type, slug } = await params;
  const post = findCard(type as InstagramCardType, slug);
  if (!post) notFound();

  const imageUrl = `/instagram/cards/${type}/${slug}/opengraph-image`;
  return (
    <main
      style={{
        maxWidth: "780px",
        margin: "0 auto",
        padding: "48px 24px",
        fontFamily: "Inter, system-ui, sans-serif",
        color: "#0f172a",
      }}
    >
      <div style={{ marginBottom: "16px", fontSize: "14px", color: "#64748b" }}>
        <Link href="/instagram" style={{ color: "#0ea5e9", textDecoration: "none" }}>
          ← Back to /instagram
        </Link>
        {" · "}
        <span>{post.date}</span>
        {" · "}
        <span>{prettyType(type)}</span>
      </div>

      <h1 style={{ fontSize: "28px", lineHeight: 1.2, margin: "0 0 16px" }}>
        {prettyType(type)} · {slug}
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "24px",
          backgroundColor: "#f1f5f9",
          borderRadius: "16px",
          marginBottom: "24px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageUrl}
          alt={`Instagram card — ${type}/${slug}`}
          width={540}
          height={540}
          style={{ borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
        />
      </div>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "18px", color: "#475569", margin: "0 0 8px" }}>
          Caption · copy + paste into Instagram
        </h2>
        <pre
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            fontFamily: "Inter, system-ui, sans-serif",
            fontSize: "15px",
            lineHeight: 1.5,
            backgroundColor: "#0f172a",
            color: "#f1f5f9",
            padding: "20px",
            borderRadius: "12px",
            margin: 0,
          }}
        >
          {post.caption}
          {"\n\n"}
          {post.hashtags.join(" ")}
        </pre>
      </section>

      <section style={{ marginBottom: "32px" }}>
        <h2 style={{ fontSize: "18px", color: "#475569", margin: "0 0 8px" }}>
          Link in bio for this post
        </h2>
        <a
          href={post.ctaUrl}
          target="_blank"
          rel="noopener"
          style={{
            display: "inline-block",
            padding: "12px 20px",
            backgroundColor: "#0ea5e9",
            color: "#fff",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          {post.ctaLabel}
        </a>
        <div style={{ marginTop: "8px", fontSize: "14px", color: "#64748b" }}>
          {post.ctaUrl}
        </div>
      </section>

      <section style={{ marginBottom: "32px", fontSize: "14px", color: "#64748b" }}>
        <h2 style={{ fontSize: "16px", color: "#475569", margin: "0 0 8px" }}>
          Direct image URL
        </h2>
        <code style={{ wordBreak: "break-all" }}>
          https://signals.gitdealflow.com{imageUrl}
        </code>
      </section>
    </main>
  );
}
