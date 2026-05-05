import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, fonts } from "../lib/theme";

// "If X, then Y" — single-statement reveal scene. The highlighted phrase
// (typically the "Y" — the conclusion that breaks the prior frame) lands
// last with a colour pop.
export const BigDomino: React.FC<{
  label: string;
  before: string;
  highlight: string;
  after: string;
  footnote: string;
}> = ({ label, before, highlight, after, footnote }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const labelSpring = spring({ frame, fps, config: { damping: 22, stiffness: 110 }, durationInFrames: fps * 0.6 });
  const beforeOp = interpolate(frame, [fps * 0.5, fps * 1.0], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const highlightStart = fps * 4.5;
  const highlightSpring = spring({
    frame: frame - highlightStart,
    fps,
    config: { damping: 18, stiffness: 100 },
    durationInFrames: fps * 0.7,
  });
  const afterOp = interpolate(frame, [fps * 6.5, fps * 7.2], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const footOp = interpolate(frame, [durationInFrames - fps * 4, durationInFrames - fps * 3], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        backgroundImage: `radial-gradient(ellipse at 30% 30%, ${theme.amberGlow}, transparent 60%)`,
        fontFamily: fonts.sans,
        padding: "60px 140px",
        justifyContent: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 28, maxWidth: 1500 }}>
        <div
          style={{
            fontSize: 26,
            color: theme.amberDim,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            fontWeight: 700,
            opacity: labelSpring,
            transform: `translateY(${interpolate(labelSpring, [0, 1], [10, 0])}px)`,
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 56,
            color: theme.text,
            fontWeight: 600,
            letterSpacing: "-0.015em",
            lineHeight: 1.18,
            opacity: beforeOp,
          }}
        >
          {before}
        </div>
        <div
          style={{
            fontSize: 78,
            color: theme.amber,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            opacity: highlightSpring,
            transform: `translateY(${interpolate(highlightSpring, [0, 1], [16, 0])}px) scale(${interpolate(
              highlightSpring,
              [0, 1],
              [0.96, 1],
            )})`,
            textShadow: `0 0 40px ${theme.amberGlow}`,
          }}
        >
          {highlight}
        </div>
        <div
          style={{
            fontSize: 36,
            color: theme.textDim,
            opacity: afterOp,
            letterSpacing: "-0.005em",
            lineHeight: 1.3,
          }}
        >
          {after}
        </div>
        <div
          style={{
            fontSize: 26,
            color: theme.emeraldDim,
            fontFamily: fonts.mono,
            opacity: footOp,
            marginTop: 16,
            paddingTop: 20,
            borderTop: `1px solid ${theme.border}`,
          }}
        >
          {footnote}
        </div>
      </div>
    </AbsoluteFill>
  );
};
