import React from "react";
import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, fonts } from "../lib/theme";

export const Hook: React.FC<{ lines: string[]; stamp: string }> = ({ lines, stamp }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Each line fades in 0.7s after the previous.
  const lineDelay = (i: number) => fps * (0.2 + i * 0.7);
  const lineOpacity = (i: number) =>
    interpolate(frame, [lineDelay(i), lineDelay(i) + fps * 0.5], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const lineY = (i: number) =>
    interpolate(frame, [lineDelay(i), lineDelay(i) + fps * 0.5], [12, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  // Stamp slams in once the third line reaches.
  const stampStart = lineDelay(lines.length - 1) + fps * 0.4;
  const stampOpacity = interpolate(frame, [stampStart, stampStart + 6], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const stampScale = interpolate(frame, [stampStart, stampStart + 4, stampStart + 12], [1.4, 0.92, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const stampRot = -7;

  // Soft outro
  const outro = interpolate(frame, [durationInFrames - fps * 0.4, durationInFrames], [1, 0.85], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, fontFamily: fonts.sans, padding: "0 140px", justifyContent: "center", opacity: outro }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 1500 }}>
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              fontSize: i === lines.length - 1 ? 64 : 56,
              fontWeight: i === lines.length - 1 ? 700 : 500,
              color: i === lines.length - 1 ? theme.text : theme.textDim,
              opacity: lineOpacity(i),
              transform: `translateY(${lineY(i)}px)`,
              lineHeight: 1.18,
              letterSpacing: "-0.01em",
            }}
          >
            {l}
          </div>
        ))}
      </div>
      <div
        style={{
          position: "absolute",
          right: 110,
          top: 110,
          opacity: stampOpacity,
          transform: `rotate(${stampRot}deg) scale(${stampScale})`,
          border: `4px solid ${theme.rose}`,
          padding: "14px 32px",
          color: theme.rose,
          fontFamily: fonts.mono,
          fontSize: 36,
          fontWeight: 700,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          backgroundColor: "rgba(15, 23, 42, 0.6)",
        }}
      >
        {stamp}
      </div>
    </AbsoluteFill>
  );
};
