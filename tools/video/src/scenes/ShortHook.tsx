import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, fonts } from "../lib/theme";

export const ShortHook: React.FC<{
  topLine: string;
  midLine: string;
  bottomLine: string;
  stamp: string;
}> = ({ topLine, midLine, bottomLine, stamp }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const topIn = spring({ frame, fps, config: { damping: 22, stiffness: 110 }, durationInFrames: fps * 0.5 });
  const midIn = spring({
    frame: frame - fps * 0.6,
    fps,
    config: { damping: 14, stiffness: 80 },
    durationInFrames: fps * 0.7,
  });
  const botIn = spring({
    frame: frame - fps * 1.1,
    fps,
    config: { damping: 22, stiffness: 110 },
    durationInFrames: fps * 0.5,
  });
  const stampIn = interpolate(frame, [fps * 1.6, fps * 1.8], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        fontFamily: fonts.sans,
        padding: "0 60px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20, alignItems: "center" }}>
        <div
          style={{
            fontSize: 60,
            color: theme.textDim,
            fontWeight: 600,
            letterSpacing: "-0.01em",
            opacity: topIn,
            transform: `translateY(${interpolate(topIn, [0, 1], [16, 0])}px)`,
            textAlign: "center",
            lineHeight: 1.15,
          }}
        >
          {topLine}
        </div>
        <div
          style={{
            fontSize: 200,
            color: theme.amber,
            fontWeight: 900,
            letterSpacing: "-0.04em",
            lineHeight: 1,
            opacity: midIn,
            transform: `scale(${interpolate(midIn, [0, 1], [0.7, 1])})`,
            textShadow: `0 0 80px ${theme.amberGlow}`,
            fontFamily: fonts.mono,
          }}
        >
          {midLine}
        </div>
        <div
          style={{
            fontSize: 60,
            color: theme.text,
            fontWeight: 800,
            letterSpacing: "-0.015em",
            lineHeight: 1.15,
            opacity: botIn,
            transform: `translateY(${interpolate(botIn, [0, 1], [16, 0])}px)`,
            textAlign: "center",
          }}
        >
          {bottomLine}
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 100,
          right: 60,
          transform: "rotate(-7deg)",
          border: `4px solid ${theme.emerald}`,
          padding: "10px 22px",
          color: theme.emerald,
          fontFamily: fonts.mono,
          fontSize: 28,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          backgroundColor: "rgba(15, 23, 42, 0.65)",
          opacity: stampIn,
        }}
      >
        {stamp}
      </div>
    </AbsoluteFill>
  );
};
