import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, fonts } from "../lib/theme";

export type Word = { text: string; fromMs: number; toMs: number };

const CHUNK_SIZE = 3;

// Karaoke-style burn-in. Shows up to CHUNK_SIZE words; once the current chunk
// completes, advances to the next. Active word is colored emerald, prior
// words in chunk fade to a softer brightness, future words are dim.
export const WordCaption: React.FC<{ words: Word[] }> = ({ words }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const tMs = (frame / fps) * 1000;

  if (!words || words.length === 0) return null;

  // Build fixed chunks from the word array.
  const chunks: Word[][] = [];
  for (let i = 0; i < words.length; i += CHUNK_SIZE) {
    chunks.push(words.slice(i, i + CHUNK_SIZE));
  }

  // Pick the latest chunk whose first word has been reached.
  let activeChunkIdx = 0;
  for (let i = 0; i < chunks.length; i++) {
    if (chunks[i][0].fromMs <= tMs) activeChunkIdx = i;
    else break;
  }
  const chunk = chunks[activeChunkIdx];

  // Within the chunk, find the current word.
  let activeWordIdx = -1;
  for (let i = 0; i < chunk.length; i++) {
    if (chunk[i].fromMs <= tMs) activeWordIdx = i;
    else break;
  }

  // Fade between chunks for smoothness
  const chunkStart = chunk[0].fromMs;
  const fadeIn = interpolate(tMs, [chunkStart, chunkStart + 120], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div
      style={{
        position: "absolute",
        bottom: 100,
        left: "50%",
        transform: "translateX(-50%)",
        padding: "18px 36px",
        background: "rgba(2, 6, 23, 0.85)",
        border: `1px solid ${theme.borderSubtle}`,
        borderRadius: 14,
        opacity: fadeIn,
        backdropFilter: "blur(8px)",
        boxShadow: `0 18px 60px -28px rgba(0,0,0,0.6)`,
      }}
    >
      <div
        style={{
          fontFamily: fonts.sans,
          fontSize: 38,
          fontWeight: 600,
          letterSpacing: "-0.005em",
          lineHeight: 1.25,
          display: "flex",
          gap: 14,
          alignItems: "baseline",
        }}
      >
        {chunk.map((w, i) => {
          const isActive = i === activeWordIdx;
          const isPast = i < activeWordIdx;
          return (
            <span
              key={i}
              style={{
                color: isActive ? theme.emerald : theme.text,
                opacity: isActive ? 1 : isPast ? 0.85 : 0.4,
                transition: "color 80ms",
              }}
            >
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
};
