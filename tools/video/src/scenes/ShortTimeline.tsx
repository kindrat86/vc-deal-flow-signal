import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, fonts } from "../lib/theme";

type Beat = { day: string; label: string; detail: string; win?: boolean; startSec: number };

// 1080×1920 vertical adaptation of MagicBullet — wider day-label gutter,
// stacked card layout, big labels for thumbreel readability.
export const ShortTimeline: React.FC<{ title: string; beats: Beat[] }> = ({ title, beats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const titleIn = spring({ frame, fps, config: { damping: 22, stiffness: 110 }, durationInFrames: fps * 0.6 });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        fontFamily: fonts.sans,
        padding: "120px 60px",
      }}
    >
      <div
        style={{
          fontSize: 36,
          color: theme.amberDim,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: 14,
          opacity: titleIn,
          textAlign: "center",
        }}
      >
        {title}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 36, marginTop: 40 }}>
        {beats.map((b, i) => (
          <BeatCard key={i} beat={b} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const BeatCard: React.FC<{ beat: Beat }> = ({ beat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = beat.startSec * fps;
  const reveal = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 18, stiffness: 95 },
    durationInFrames: fps * 0.5,
  });
  const opacity = interpolate(reveal, [0, 1], [0, 1]);
  const x = interpolate(reveal, [0, 1], [-30, 0]);
  const isWin = beat.win === true;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        padding: "24px 28px",
        borderRadius: 16,
        background: isWin ? `linear-gradient(90deg, ${theme.emeraldGlow}, transparent)` : theme.bgPanel,
        border: `2px solid ${isWin ? theme.emerald : theme.borderSubtle}`,
        boxShadow: isWin ? `0 0 60px ${theme.emeraldGlow}` : "none",
        opacity,
        transform: `translateX(${x}px)`,
      }}
    >
      <div
        style={{
          fontFamily: fonts.mono,
          fontSize: isWin ? 64 : 56,
          color: isWin ? theme.emerald : theme.amber,
          fontWeight: 800,
          letterSpacing: "-0.02em",
          lineHeight: 1,
        }}
      >
        {beat.day}
      </div>
      <div
        style={{
          fontSize: isWin ? 56 : 46,
          color: isWin ? theme.emeraldDim : theme.text,
          fontWeight: 700,
          letterSpacing: "-0.01em",
          lineHeight: 1.15,
        }}
      >
        {beat.label}
      </div>
      <div
        style={{
          fontSize: 28,
          color: isWin ? theme.emerald : theme.textDim,
          fontFamily: fonts.mono,
          marginTop: 4,
        }}
      >
        {beat.detail}
      </div>
    </div>
  );
};
