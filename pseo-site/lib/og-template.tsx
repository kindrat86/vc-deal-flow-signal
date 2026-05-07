import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png" as const;

export interface OGStat {
  value: string | number;
  label: string;
}

export interface OGTemplateProps {
  /** Pill label in top-right (e.g. "Press Release", "Trend", "Author") */
  kind: string;
  /** Headline; truncated to ~130 chars */
  title: string;
  /** Optional 1–2 line description; truncated to ~220 chars */
  subtitle?: string;
  /** Up to 3 stats shown above the footer */
  stats?: OGStat[];
  /** Bottom-left text (defaults to brand domain) */
  footerLeft?: string;
  /** Bottom-right text (period, dateline, tag) */
  footerRight?: string;
  /** Hex accent color (default sky-500) */
  accent?: string;
}

const TITLE_MAX = 130;
const SUB_MAX = 220;

function clamp(s: string | undefined, max: number): string | undefined {
  if (!s) return s;
  return s.length > max ? s.slice(0, Math.max(0, max - 3)) + "..." : s;
}

/**
 * Renders a per-slug branded Open Graph image (1200×630 PNG).
 * Used by every programmatic surface's opengraph-image.tsx so social previews
 * vary by slug instead of all sharing the site-wide default.
 *
 * Constraints: next/og uses Satori — only inline styles, flex layout.
 */
export function renderBrandOG(p: OGTemplateProps): ImageResponse {
  const accent = p.accent ?? "#0ea5e9";
  const title = clamp(p.title, TITLE_MAX) ?? "VC Deal Flow Signal";
  const subtitle = clamp(p.subtitle, SUB_MAX);
  const stats = (p.stats ?? []).slice(0, 3);

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
          backgroundImage:
            "radial-gradient(circle at 80% 0%, rgba(14,165,233,0.18), transparent 60%), radial-gradient(circle at 0% 100%, rgba(34,211,238,0.12), transparent 50%)",
        }}
      >
        {/* Header row: brand + kind pill */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: accent,
              fontWeight: 700,
            }}
          >
            VC Deal Flow Signal
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 14,
              color: accent,
              padding: "6px 14px",
              borderRadius: 999,
              border: `1px solid ${accent}`,
              backgroundColor: "rgba(14,165,233,0.10)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              fontWeight: 700,
            }}
          >
            {p.kind}
          </div>
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            fontSize: 52,
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: subtitle ? "20px" : "0",
          }}
        >
          {title}
        </div>

        {/* Subtitle */}
        {subtitle ? (
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "#94a3b8",
              lineHeight: 1.45,
              maxWidth: "1080px",
            }}
          >
            {subtitle}
          </div>
        ) : null}

        {/* Stats row */}
        {stats.length > 0 ? (
          <div style={{ display: "flex", gap: "32px", marginTop: "auto" }}>
            {stats.map((s, i) => (
              <div
                key={i}
                style={{ display: "flex", flexDirection: "column" }}
              >
                <div
                  style={{
                    display: "flex",
                    fontSize: 44,
                    fontWeight: 700,
                    color: accent,
                  }}
                >
                  {String(s.value)}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontSize: 16,
                    color: "#64748b",
                  }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "flex", marginTop: "auto" }} />
        )}

        {/* Footer */}
        <div
          style={{
            display: "flex",
            marginTop: "30px",
            justifyContent: "space-between",
            fontSize: 14,
            color: "#475569",
          }}
        >
          <div style={{ display: "flex" }}>
            {p.footerLeft ?? "signals.gitdealflow.com"}
          </div>
          {p.footerRight ? (
            <div style={{ display: "flex" }}>{p.footerRight}</div>
          ) : null}
        </div>
      </div>
    ),
    OG_SIZE
  );
}
