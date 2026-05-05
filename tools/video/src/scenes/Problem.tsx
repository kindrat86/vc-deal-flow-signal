import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, fonts } from "../lib/theme";

export const Problem: React.FC<{ headline: string; subhead: string }> = ({ headline, subhead }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headSpring = spring({ frame, fps, config: { damping: 22, stiffness: 110 }, durationInFrames: fps * 0.7 });
  const headOpacity = interpolate(headSpring, [0, 1], [0, 1]);
  const headY = interpolate(headSpring, [0, 1], [18, 0]);

  const subOpacity = interpolate(frame, [fps * 1.2, fps * 1.7], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
  const ruleWidth = interpolate(frame, [fps * 1.1, fps * 1.6], [0, 700], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, fontFamily: fonts.sans, padding: "0 160px", justifyContent: "center" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 1500 }}>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: theme.text,
            letterSpacing: "-0.015em",
            lineHeight: 1.12,
            opacity: headOpacity,
            transform: `translateY(${headY}px)`,
          }}
        >
          {headline}
        </div>
        <div style={{ width: ruleWidth, height: 3, background: `linear-gradient(90deg, ${theme.amber}, transparent)` }} />
        <div style={{ fontSize: 40, color: theme.amberDim, opacity: subOpacity, letterSpacing: "-0.005em", lineHeight: 1.3 }}>
          {subhead}
        </div>
      </div>
    </AbsoluteFill>
  );
};
