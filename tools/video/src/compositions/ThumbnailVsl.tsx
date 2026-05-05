import React from "react";
import { AbsoluteFill } from "remotion";
import { theme, fonts } from "../lib/theme";
import { ScoutMark } from "../lib/ScoutMark";

// 1280×720 thumbnail for the VSL. Same brand chassis as ThumbnailPredicted
// but the headline carries the Big Domino conclusion ("LAGGING indicator")
// and the bottom pill points to /perfect-webinar.
export const ThumbnailVsl: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        backgroundImage: `radial-gradient(ellipse 80% 60% at 70% 30%, ${theme.amberGlow}, transparent 70%), radial-gradient(ellipse 60% 50% at 30% 80%, ${theme.emeraldGlow}, transparent 70%)`,
        fontFamily: fonts.sans,
      }}
    >
      <div style={{ position: "absolute", top: 36, left: 44, display: "flex", alignItems: "center", gap: 14 }}>
        <ScoutMark size={56} />
        <div style={{ color: theme.text, fontSize: 24, fontWeight: 600, letterSpacing: "-0.005em" }}>
          GitDealFlow
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 60,
          right: 48,
          transform: "rotate(-6deg)",
          border: `4px solid ${theme.emerald}`,
          padding: "10px 24px",
          color: theme.emerald,
          fontFamily: fonts.mono,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          backgroundColor: "rgba(15, 23, 42, 0.6)",
        }}
      >
        €9.97/mo
      </div>

      <div
        style={{
          position: "absolute",
          top: "50%",
          left: 60,
          right: 60,
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        <div
          style={{
            fontSize: 28,
            color: theme.amberDim,
            fontFamily: fonts.mono,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          The Big Domino
        </div>
        <div
          style={{
            fontSize: 78,
            color: theme.text,
            fontWeight: 800,
            letterSpacing: "-0.025em",
            lineHeight: 1.04,
          }}
        >
          Every other deal-flow source is a{" "}
          <span style={{ color: theme.amber }}>lagging indicator</span>.
        </div>
        <div
          style={{
            fontSize: 26,
            color: theme.textDim,
            fontFamily: fonts.mono,
            letterSpacing: "-0.005em",
            marginTop: 6,
          }}
        >
          Engineering moves first · pitch decks move last · n=219 · SSRN
        </div>
      </div>

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
        gitdealflow.com/perfect-webinar
      </div>
    </AbsoluteFill>
  );
};
