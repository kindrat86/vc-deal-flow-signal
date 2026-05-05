import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, fonts } from "../lib/theme";
import { ScoutMark } from "../lib/ScoutMark";

export const Title: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const markIn = spring({ frame, fps, config: { damping: 18, stiffness: 90 }, durationInFrames: fps * 0.8 });
  const titleIn = spring({ frame: frame - fps * 0.2, fps, config: { damping: 20, stiffness: 120 }, durationInFrames: fps * 0.7 });
  const subIn = interpolate(frame, [fps * 0.6, fps * 1.1], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });

  const titleY = interpolate(titleIn, [0, 1], [16, 0]);
  const markScale = interpolate(markIn, [0, 1], [0.7, 1]);

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, alignItems: "center", justifyContent: "center", fontFamily: fonts.sans }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <div style={{ transform: `scale(${markScale})`, opacity: markIn }}>
          <ScoutMark size={112} />
        </div>
        <h1
          style={{
            fontSize: 78,
            fontWeight: 700,
            letterSpacing: "-0.02em",
            color: theme.text,
            margin: 0,
            opacity: titleIn,
            transform: `translateY(${titleY}px)`,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 28,
            color: theme.textDim,
            margin: 0,
            opacity: subIn,
            letterSpacing: "0.02em",
          }}
        >
          {subtitle}
        </p>
      </div>
    </AbsoluteFill>
  );
};
