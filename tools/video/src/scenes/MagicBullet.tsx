import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, fonts } from "../lib/theme";

type Beat = {
  day: string;
  label: string;
  detail: string;
  win?: boolean;
  // Whisper-derived "Day" word time. Falls back to a tuned default if
  // captions are missing (in which case the script never ran 02-captions.mjs).
  startSec: number;
};

const FALLBACK_OFFSETS_SEC = [1.5, 9.0, 16.0, 23.0, 31.0];

export const MagicBullet: React.FC<{ title: string; beats: Beat[] }> = ({ title, beats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 20, stiffness: 110 }, durationInFrames: fps * 0.8 });

  return (
    <AbsoluteFill style={{ backgroundColor: theme.bg, fontFamily: fonts.sans, padding: "60px 140px", justifyContent: "center" }}>
      <div
        style={{
          fontSize: 36,
          color: theme.amberDim,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          fontWeight: 600,
          marginBottom: 8,
          opacity: titleSpring,
          transform: `translateY(${interpolate(titleSpring, [0, 1], [10, 0])}px)`,
        }}
      >
        The signal in action
      </div>
      <div
        style={{
          fontSize: 60,
          color: theme.text,
          fontWeight: 700,
          letterSpacing: "-0.015em",
          marginBottom: 56,
          opacity: titleSpring,
        }}
      >
        {title}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 18, position: "relative" }}>
        {/* Vertical guide line — animates length with beat reveals */}
        <BeatGuide beats={beats} />

        {beats.map((beat, i) => (
          <BeatRow key={i} beat={beat} index={i} startSec={beat.startSec ?? FALLBACK_OFFSETS_SEC[i] ?? i * 7} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

const BeatGuide: React.FC<{ beats: Beat[] }> = ({ beats }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const firstSec = beats[0]?.startSec ?? FALLBACK_OFFSETS_SEC[0];
  const lastSec = beats[beats.length - 1]?.startSec ?? FALLBACK_OFFSETS_SEC[beats.length - 1] ?? beats.length * 7;
  const start = firstSec * fps;
  const end = lastSec * fps + fps * 0.6;
  const progress = interpolate(frame, [start, end], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const rowH = 100;
  const fullH = rowH * beats.length;
  return (
    <div
      style={{
        position: "absolute",
        left: 105,
        top: 18,
        width: 3,
        height: fullH * progress,
        background: `linear-gradient(180deg, ${theme.amberDim}, ${theme.emerald})`,
        borderRadius: 2,
        opacity: 0.6,
      }}
    />
  );
};

const BeatRow: React.FC<{ beat: Beat; index: number; startSec: number }> = ({ beat, index, startSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const startFrame = startSec * fps;
  const reveal = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 20, stiffness: 100 },
    durationInFrames: fps * 0.6,
  });
  const opacity = interpolate(reveal, [0, 1], [0, 1]);
  const x = interpolate(reveal, [0, 1], [-30, 0]);
  const isWin = beat.win === true;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 32,
        opacity,
        transform: `translateX(${x}px)`,
        padding: "10px 0",
      }}
    >
      <div
        style={{
          width: 168,
          fontFamily: fonts.mono,
          fontSize: isWin ? 48 : 40,
          color: isWin ? theme.emerald : theme.amber,
          fontWeight: 700,
          textAlign: "right",
          paddingRight: 36,
          letterSpacing: "-0.02em",
          flexShrink: 0,
        }}
      >
        {beat.day}
      </div>
      <div
        style={{
          width: 28,
          height: 28,
          borderRadius: "50%",
          background: isWin ? theme.emerald : theme.amber,
          boxShadow: isWin ? `0 0 32px ${theme.emerald}` : `0 0 18px ${theme.amber}`,
          flexShrink: 0,
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: 4, marginLeft: 16 }}>
        <div
          style={{
            fontSize: isWin ? 44 : 36,
            color: isWin ? theme.emeraldDim : theme.text,
            fontWeight: 700,
            letterSpacing: "-0.01em",
          }}
        >
          {beat.label}
        </div>
        <div
          style={{
            fontSize: 26,
            color: isWin ? theme.emerald : theme.textDim,
            fontFamily: fonts.mono,
            opacity: 0.85,
          }}
        >
          {beat.detail}
        </div>
      </div>
    </div>
  );
};
