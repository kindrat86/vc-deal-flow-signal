import React from "react";
import { AbsoluteFill } from "remotion";
import { theme, fonts } from "../lib/theme";
import { ScoutMark } from "../lib/ScoutMark";

// 1280×720 YouTube thumbnail. Static composition — renders as a single PNG
// via `npx remotion still`. Designed to read at 320×180 (search-results size)
// and at 16:9 fullscreen on the channel page.
//
// Hierarchy:
//   1. Headline (largest, 4-5 words, contrarian claim)
//   2. Stamp (rose, rotated, "31 DAYS EARLY")
//   3. URL pill at bottom
//   4. Scout mark anchor top-left
export const Thumbnail: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        backgroundImage: `radial-gradient(ellipse 80% 60% at 70% 30%, ${theme.amberGlow}, transparent 70%), radial-gradient(ellipse 60% 50% at 30% 80%, ${theme.emeraldGlow}, transparent 70%)`,
        fontFamily: fonts.sans,
      }}
    >
      {/* Top-left: Scout mark + brand */}
      <div style={{ position: "absolute", top: 36, left: 44, display: "flex", alignItems: "center", gap: 14 }}>
        <ScoutMark size={56} />
        <div style={{ color: theme.text, fontSize: 24, fontWeight: 600, letterSpacing: "-0.005em" }}>
          GitDealFlow
        </div>
      </div>

      {/* Top-right: rotated stamp */}
      <div
        style={{
          position: "absolute",
          top: 60,
          right: 48,
          transform: "rotate(-6deg)",
          border: `4px solid ${theme.rose}`,
          padding: "10px 24px",
          color: theme.rose,
          fontFamily: fonts.mono,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          backgroundColor: "rgba(15, 23, 42, 0.6)",
        }}
      >
        31 days early
      </div>

      {/* Center: headline + supporting line */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 60,
          right: 60,
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        <div
          style={{
            fontSize: 86,
            color: theme.text,
            fontWeight: 800,
            letterSpacing: "-0.025em",
            lineHeight: 1.02,
          }}
        >
          We named the<br />
          <span style={{ color: theme.amberDim }}>Series A</span>
          <span style={{ color: theme.text }}> 31 days early.</span>
        </div>
        <div
          style={{
            fontSize: 28,
            color: theme.textDim,
            fontFamily: fonts.mono,
            letterSpacing: "-0.005em",
            marginTop: 6,
          }}
        >
          GitHub commit-velocity → fundraise · n=219 · SSRN
        </div>
      </div>

      {/* Bottom: URL pill */}
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: "50%",
          transform: "translateX(-50%)",
          padding: "10px 24px",
          fontFamily: fonts.mono,
          fontSize: 30,
          fontWeight: 700,
          color: theme.emerald,
          border: `2px solid ${theme.emerald}`,
          borderRadius: 12,
          backgroundColor: "rgba(15, 23, 42, 0.7)",
          letterSpacing: "-0.005em",
        }}
      >
        gitdealflow.com/predicted
      </div>
    </AbsoluteFill>
  );
};
