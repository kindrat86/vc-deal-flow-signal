/**
 * OG card for /define/[term].
 *
 * 1200x630 PNG with the term name, category badge, and the definition
 * lede (capped to a sentence that fits the card). One file serves all
 * 62 glossary terms via the [term] dynamic param.
 *
 * Pattern matches /api/og/tools/{safe,runway,burn-multiple,magic-number}-
 * calculator/route.tsx. Satori reminder: flex only, no display:grid.
 */

import { ImageResponse } from "next/og";
import { glossaryTerms } from "@/content/glossary";
import {
  CATEGORY_META,
  getCategoryFor,
  getSignalPrimitiveSlug,
  getToolCrossLink,
} from "@/lib/glossary-categories";

export const runtime = "nodejs";

interface RouteContext {
  params: Promise<{ term: string }>;
}

const CATEGORY_ACCENT: Record<string, { fg: string; bg: string; border: string }> = {
  "code-side-sourcing": {
    fg: "#fbbf24",
    bg: "rgba(251, 191, 36, 0.12)",
    border: "rgba(251, 191, 36, 0.55)",
  },
  "engineering-acceleration": {
    fg: "#7dd3fc",
    bg: "rgba(56, 189, 248, 0.12)",
    border: "rgba(56, 189, 248, 0.55)",
  },
  discoverability: {
    fg: "#a5b4fc",
    bg: "rgba(129, 140, 248, 0.12)",
    border: "rgba(129, 140, 248, 0.55)",
  },
  "agent-infrastructure": {
    fg: "#86efac",
    bg: "rgba(34, 197, 94, 0.12)",
    border: "rgba(34, 197, 94, 0.55)",
  },
  "academic-citation": {
    fg: "#fdba74",
    bg: "rgba(249, 115, 22, 0.12)",
    border: "rgba(249, 115, 22, 0.55)",
  },
  "venture-vocabulary": {
    fg: "#f9a8d4",
    bg: "rgba(236, 72, 153, 0.12)",
    border: "rgba(236, 72, 153, 0.55)",
  },
};

/**
 * Pick a self-contained lede for the OG card. Tries the first sentence;
 * if that's too long for the card, drops down to a hard char cap.
 */
function pickLede(definition: string, maxChars = 320): string {
  const firstSentence = definition.match(/^[^.]+\./)?.[0]?.trim();
  if (firstSentence && firstSentence.length <= maxChars) {
    return firstSentence;
  }
  if (definition.length <= maxChars) return definition;
  const cut = definition.slice(0, maxChars);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 0 ? cut.slice(0, lastSpace) : cut) + "…";
}

export async function GET(_req: Request, ctx: RouteContext) {
  try {
    const { term } = await ctx.params;
    const t = glossaryTerms.find((g) => g.id === term);
    if (!t) return fallback();

    const category = getCategoryFor(t.id);
    const catMeta = CATEGORY_META[category];
    const accent = CATEGORY_ACCENT[category] ?? CATEGORY_ACCENT.discoverability;
    const lede = pickLede(t.definition);
    const signalSlug = getSignalPrimitiveSlug(t.id);
    const toolLink = getToolCrossLink(t.id);
    const ribbon =
      signalSlug && toolLink
        ? "Formal signal · Free tool"
        : signalSlug
          ? "Formal signal primitive"
          : toolLink
            ? "Has a free tool"
            : null;

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            background:
              "linear-gradient(135deg, #0b1220 0%, #0f1b33 60%, #0b1220 100%)",
            padding: 56,
            color: "#f1f5f9",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 28,
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 16,
                fontWeight: 700,
                color: accent.fg,
                letterSpacing: 2,
              }}
            >
              GITDEALFLOW · DEFINITION
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                padding: "6px 14px",
                borderRadius: 999,
                background: accent.bg,
                border: `1px solid ${accent.border}`,
                color: accent.fg,
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              {catMeta.label}
            </div>
          </div>

          {/* Term name */}
          <div
            style={{
              display: "flex",
              fontSize: 56,
              fontWeight: 800,
              lineHeight: 1.05,
              marginBottom: 24,
              letterSpacing: -1.5,
              color: "#f8fafc",
            }}
          >
            {t.term}
          </div>

          {/* Definition card */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              padding: 28,
              borderRadius: 16,
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              marginBottom: "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 24,
                color: "#e2e8f0",
                lineHeight: 1.4,
              }}
            >
              {lede}
            </div>
          </div>

          {/* Ribbon (cross-link advert, if any) */}
          {ribbon ? (
            <div
              style={{
                display: "flex",
                marginTop: 18,
                marginBottom: 14,
                padding: "6px 14px",
                borderRadius: 999,
                background: "rgba(34, 197, 94, 0.12)",
                border: "1px solid rgba(34, 197, 94, 0.45)",
                color: "#86efac",
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
                alignSelf: "flex-start",
              }}
            >
              {ribbon}
            </div>
          ) : null}

          {/* Footer */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
              paddingTop: 16,
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 16,
                fontWeight: 700,
                color: "#fbbf24",
              }}
            >
              VC Deal Flow Signal Glossary · CC BY 4.0 · cite by URL
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 14,
                color: "#94a3b8",
              }}
            >
              signals.gitdealflow.com/define/{t.id}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          "Cache-Control": "public, max-age=600, s-maxage=86400",
        },
      },
    );
  } catch (error) {
    console.error("[og/define] render failed:", error);
    return fallback();
  }
}

function fallback() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #0b1220 0%, #0f1b33 60%, #0b1220 100%)",
          color: "#f1f5f9",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 56,
            fontWeight: 800,
            letterSpacing: -1,
          }}
        >
          VC Deal Flow Signal
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 22,
            color: "#7dd3fc",
            marginTop: 16,
            fontWeight: 700,
          }}
        >
          Glossary · Definitions · CC BY 4.0
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: { "Cache-Control": "public, max-age=60, s-maxage=60" },
    },
  );
}
