import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, fonts } from "../lib/theme";
import { ScoutMark } from "../lib/ScoutMark";

export const CTA: React.FC<{ headline: string; url: string; ctas: string[] }> = ({ headline, url, ctas }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const headSpring = spring({ frame, fps, config: { damping: 22, stiffness: 110 }, durationInFrames: fps * 0.6 });
  const urlSpring = spring({ frame: frame - fps * 0.5, fps, config: { damping: 16, stiffness: 90 }, durationInFrames: fps * 0.7 });
  const markSpring = spring({ frame: frame - fps * 0.2, fps, config: { damping: 16, stiffness: 80 }, durationInFrames: fps * 0.7 });

  const ctaDelay = (i: number) => fps * (1.4 + i * 0.4);
  const ctaOp = (i: number) =>
    interpolate(frame, [ctaDelay(i), ctaDelay(i) + fps * 0.4], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  // gentle pulse on URL near end
  const pulse = 1 + 0.012 * Math.sin((frame / fps) * 2.6 * Math.PI);

  // outro fade
  const outro = interpolate(frame, [durationInFrames - fps * 0.6, durationInFrames], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        backgroundImage: `radial-gradient(ellipse at center, ${theme.emeraldGlow}, transparent 60%)`,
        fontFamily: fonts.sans,
        alignItems: "center",
        justifyContent: "center",
        opacity: outro,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28 }}>
        <div style={{ transform: `scale(${markSpring})`, opacity: markSpring }}>
          <ScoutMark size={88} />
        </div>
        <div
          style={{
            fontSize: 64,
            color: theme.text,
            fontWeight: 700,
            letterSpacing: "-0.015em",
            opacity: headSpring,
            transform: `translateY(${interpolate(headSpring, [0, 1], [12, 0])}px)`,
          }}
        >
          {headline}
        </div>
        <div
          style={{
            fontSize: 56,
            color: theme.emerald,
            fontFamily: fonts.mono,
            fontWeight: 700,
            letterSpacing: "-0.01em",
            opacity: urlSpring,
            transform: `scale(${interpolate(urlSpring, [0, 1], [0.92, 1]) * pulse})`,
            padding: "14px 36px",
            border: `2px solid ${theme.emerald}`,
            borderRadius: 16,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            marginTop: 10,
          }}
        >
          {url}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 24 }}>
          {ctas.map((c, i) => (
            <div
              key={i}
              style={{
                fontSize: 28,
                color: theme.textDim,
                opacity: ctaOp(i),
                fontWeight: 500,
                letterSpacing: "-0.005em",
                textAlign: "center",
              }}
            >
              {c}
            </div>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
