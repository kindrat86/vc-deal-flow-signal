import { ImageResponse } from "next/og";
import { getPost } from "@/content/posts";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "VC Deal Flow Signal — Blog";

export default async function OGImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            width: "100%",
            height: "100%",
            backgroundColor: "#0f172a",
            color: "#f1f5f9",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          VC Deal Flow Signal
        </div>
      ),
      size
    );
  }

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          backgroundColor: "#0f172a",
          color: "#f1f5f9",
          padding: "60px",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 20,
              color: "#0ea5e9",
              fontWeight: 600,
            }}
          >
            VC Deal Flow Signal
          </div>
          <div style={{ display: "flex", fontSize: 18, color: "#64748b" }}>
            Signal Intelligence Blog
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: 48,
            fontWeight: 700,
            lineHeight: 1.2,
            marginBottom: "20px",
          }}
        >
          {post.title}
        </div>

        {/* Description */}
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#94a3b8",
            lineHeight: 1.4,
            maxWidth: "900px",
          }}
        >
          {post.description.length > 160
            ? post.description.slice(0, 157) + "..."
            : post.description}
        </div>

        {/* Bottom */}
        <div
          style={{
            display: "flex",
            marginTop: "auto",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ display: "flex", fontSize: 16, color: "#475569" }}>
            signals.gitdealflow.com
          </div>
          <div style={{ display: "flex", fontSize: 16, color: "#475569" }}>
            {post.date}
          </div>
        </div>
      </div>
    ),
    size
  );
}
