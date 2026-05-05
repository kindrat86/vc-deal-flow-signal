import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, fonts } from "../lib/theme";

type Stat = { value: string; label: string };

export const Scorecard: React.FC<{ stats: Stat[]; footnote: string }> = ({ stats, footnote }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 20, stiffness: 110 }, durationInFrames: fps * 0.6 });
  const footOp = interpolate(frame, [durationInFrames - fps * 3, durationInFrames - fps * 2.4], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, fontFamily: fonts.sans, padding: "0 140px", justifyContent: "center" }}>
      <div
        style={{
          fontSize: 32,
          color: theme.skyDim,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontWeight: 600,
          marginBottom: 36,
          opacity: titleSpring,
        }}
      >
        Public scorecard
      </div>
      <div style={{ display: "flex", gap: 40, marginBottom: 48 }}>
        {stats.map((s, i) => (
          <StatCard key={i} stat={s} index={i} />
        ))}
      </div>
      <div style={{ fontSize: 24, color: theme.textDim, fontFamily: fonts.mono, opacity: footOp }}>
        Methodology · {footnote}
      </div>
    </AbsoluteFill>
  );
};

const StatCard: React.FC<{ stat: Stat; index: number }> = ({ stat, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const start = fps * (0.3 + index * 0.5);
  const reveal = spring({ frame: frame - start, fps, config: { damping: 18, stiffness: 95 }, durationInFrames: fps * 0.7 });
  const opacity = interpolate(reveal, [0, 1], [0, 1]);
  const y = interpolate(reveal, [0, 1], [24, 0]);

  return (
    <div
      style={{
        flex: 1,
        background: theme.bgPanel,
        border: `1px solid ${theme.border}`,
        borderRadius: 16,
        padding: "40px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 14,
        opacity,
        transform: `translateY(${y}px)`,
        boxShadow: `0 0 0 1px ${theme.borderSubtle}, 0 18px 60px -28px rgba(56, 189, 248, 0.18)`,
      }}
    >
      <div
        style={{
          fontSize: 96,
          color: theme.text,
          fontWeight: 700,
          fontFamily: fonts.mono,
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }}
      >
        {stat.value}
      </div>
      <div style={{ fontSize: 22, color: theme.textDim, letterSpacing: "0.02em" }}>{stat.label}</div>
    </div>
  );
};
