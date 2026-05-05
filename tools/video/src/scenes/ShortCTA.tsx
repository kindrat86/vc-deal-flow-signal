import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, fonts } from "../lib/theme";
import { ScoutMark } from "../lib/ScoutMark";

export const ShortCTA: React.FC<{ headline: string; url: string; tag: string }> = ({ headline, url, tag }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const markIn = spring({ frame, fps, config: { damping: 16, stiffness: 80 }, durationInFrames: fps * 0.6 });
  const headIn = spring({
    frame: frame - fps * 0.2,
    fps,
    config: { damping: 22, stiffness: 110 },
    durationInFrames: fps * 0.5,
  });
  const urlIn = spring({
    frame: frame - fps * 0.5,
    fps,
    config: { damping: 14, stiffness: 80 },
    durationInFrames: fps * 0.7,
  });
  const tagIn = interpolate(frame, [fps * 1.4, fps * 1.7], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 1 + 0.012 * Math.sin((frame / fps) * 2.6 * Math.PI);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        backgroundImage: `radial-gradient(ellipse at center, ${theme.emeraldGlow}, transparent 60%)`,
        fontFamily: fonts.sans,
        padding: "0 60px",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 36 }}>
        <div style={{ transform: `scale(${markIn})`, opacity: markIn }}>
          <ScoutMark size={140} />
        </div>
        <div
          style={{
            fontSize: 78,
            color: theme.text,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            lineHeight: 1.05,
            textAlign: "center",
            opacity: headIn,
            transform: `translateY(${interpolate(headIn, [0, 1], [16, 0])}px)`,
          }}
        >
          {headline}
        </div>
        <div
          style={{
            fontSize: 56,
            color: theme.emerald,
            fontFamily: fonts.mono,
            fontWeight: 800,
            padding: "20px 28px",
            border: `3px solid ${theme.emerald}`,
            borderRadius: 16,
            backgroundColor: "rgba(15, 23, 42, 0.7)",
            letterSpacing: "-0.01em",
            opacity: urlIn,
            transform: `scale(${interpolate(urlIn, [0, 1], [0.92, 1]) * pulse})`,
            textAlign: "center",
          }}
        >
          {url}
        </div>
        <div
          style={{
            fontSize: 36,
            color: theme.textDim,
            opacity: tagIn,
            letterSpacing: "0.02em",
            marginTop: 8,
          }}
        >
          {tag}
        </div>
      </div>
    </AbsoluteFill>
  );
};
