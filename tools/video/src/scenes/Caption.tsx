import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, fonts } from "../lib/theme";

// Burn-in subtitle band — locked-bottom, fades with the scene's VO timing.
// We don't have word-level timestamps in v1, so we treat the caption as a
// single block visible for the duration of the VO with a brief in/out fade.
export const Caption: React.FC<{ text: string; voDurationSec: number }> = ({ text, voDurationSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const fadeIn = fps * 0.25;
  const fadeOut = fps * 0.4;
  const start = 0;
  const end = voDurationSec * fps;

  const opacity = interpolate(
    frame,
    [start, start + fadeIn, end - fadeOut, end],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" },
  );

  if (!text) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: "50%",
        transform: "translateX(-50%)",
        maxWidth: 1500,
        padding: "16px 28px",
        background: "rgba(2, 6, 23, 0.78)",
        border: `1px solid ${theme.borderSubtle}`,
        borderRadius: 12,
        opacity,
        backdropFilter: "blur(6px)",
      }}
    >
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: 26,
          color: theme.text,
          letterSpacing: "-0.005em",
          lineHeight: 1.35,
          textAlign: "center",
        }}
      >
        {text}
      </div>
    </div>
  );
};
