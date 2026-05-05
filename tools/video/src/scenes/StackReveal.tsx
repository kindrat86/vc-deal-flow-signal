import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { theme, fonts } from "../lib/theme";

type StackItem = { name: string; detail: string; value: string };

// Brunson stack reveal. Each row drops in at a staggered offset, value pill
// animating in last. Total bar fades in once the stack completes; "your
// price" pulse-glows after the total.
export const StackReveal: React.FC<{
  items: StackItem[];
  totalValue: string;
  yourPrice: string;
}> = ({ items, totalValue, yourPrice }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 22, stiffness: 110 }, durationInFrames: fps * 0.6 });

  // Item reveal cadence — pace matches VO (~5s per pair, 2.5s per item).
  // Total items 8 → reveal across ~32s; total bar appears thereafter.
  const ITEM_STAGGER_SEC = 4.0;
  const ITEM_OFFSET_START = 1.5;

  const lastItemEndSec = ITEM_OFFSET_START + items.length * ITEM_STAGGER_SEC * 0.5; // value lands ~halfway through each stagger
  const totalStartSec = lastItemEndSec + 0.5;
  const priceStartSec = totalStartSec + 1.5;

  const totalSpring = spring({
    frame: frame - totalStartSec * fps,
    fps,
    config: { damping: 18, stiffness: 100 },
    durationInFrames: fps * 0.7,
  });
  const priceSpring = spring({
    frame: frame - priceStartSec * fps,
    fps,
    config: { damping: 14, stiffness: 80 },
    durationInFrames: fps * 0.8,
  });
  // pulse on the price near end
  const pulse = 1 + 0.012 * Math.sin((frame / fps) * 2.4 * Math.PI);
  const outro = interpolate(frame, [durationInFrames - fps * 0.4, durationInFrames], [1, 0.9], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: theme.bg,
        fontFamily: fonts.sans,
        padding: "44px 120px",
        opacity: outro,
      }}
    >
      <div
        style={{
          fontSize: 26,
          color: theme.skyDim,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontWeight: 700,
          marginBottom: 8,
          opacity: titleSpring,
        }}
      >
        The Stack
      </div>
      <div
        style={{
          fontSize: 44,
          color: theme.text,
          fontWeight: 700,
          letterSpacing: "-0.015em",
          marginBottom: 22,
          opacity: titleSpring,
        }}
      >
        What €9.97/mo gets you.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {items.map((item, i) => (
          <StackRow
            key={i}
            item={item}
            startSec={ITEM_OFFSET_START + i * ITEM_STAGGER_SEC * 0.5}
          />
        ))}
      </div>

      {/* Total + price reveal */}
      <div
        style={{
          marginTop: 18,
          display: "flex",
          alignItems: "center",
          gap: 24,
          opacity: totalSpring,
          transform: `translateY(${interpolate(totalSpring, [0, 1], [12, 0])}px)`,
        }}
      >
        <div
          style={{
            flex: 1,
            padding: "12px 22px",
            borderRadius: 10,
            background: theme.bgPanel,
            border: `1px solid ${theme.border}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ fontSize: 26, color: theme.textDim, fontWeight: 600 }}>Total real value</div>
          <div style={{ fontSize: 36, color: theme.text, fontFamily: fonts.mono, fontWeight: 700 }}>
            {totalValue}
          </div>
        </div>
      </div>
      <div
        style={{
          marginTop: 14,
          display: "flex",
          alignItems: "center",
          gap: 24,
          opacity: priceSpring,
          transform: `scale(${interpolate(priceSpring, [0, 1], [0.95, 1]) * pulse})`,
          transformOrigin: "left center",
        }}
      >
        <div
          style={{
            flex: 1,
            padding: "16px 26px",
            borderRadius: 12,
            background: `linear-gradient(90deg, ${theme.emeraldGlow}, transparent)`,
            border: `2px solid ${theme.emerald}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: `0 0 60px ${theme.emeraldGlow}`,
          }}
        >
          <div style={{ fontSize: 30, color: theme.emeraldDim, fontWeight: 700 }}>Your price</div>
          <div style={{ fontSize: 56, color: theme.emerald, fontFamily: fonts.mono, fontWeight: 800, letterSpacing: "-0.02em" }}>
            {yourPrice}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

const StackRow: React.FC<{ item: StackItem; startSec: number }> = ({ item, startSec }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = spring({
    frame: frame - startSec * fps,
    fps,
    config: { damping: 20, stiffness: 110 },
    durationInFrames: fps * 0.5,
  });
  const opacity = interpolate(reveal, [0, 1], [0, 1]);
  const x = interpolate(reveal, [0, 1], [-22, 0]);
  const valOp = interpolate(reveal, [0.4, 1], [0, 1]);

  const isFree = item.value === "€0" || item.value === "Bonus";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 18,
        padding: "10px 18px",
        borderRadius: 8,
        background: theme.bgPanel,
        border: `1px solid ${theme.borderSubtle}`,
        opacity,
        transform: `translateX(${x}px)`,
      }}
    >
      <div
        style={{
          width: 14,
          height: 14,
          borderRadius: 4,
          background: isFree ? theme.emerald : theme.amber,
          flexShrink: 0,
        }}
      />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
        <div style={{ fontSize: 26, color: theme.text, fontWeight: 700, letterSpacing: "-0.005em" }}>{item.name}</div>
        <div style={{ fontSize: 18, color: theme.textDim, fontFamily: fonts.mono }}>{item.detail}</div>
      </div>
      <div
        style={{
          fontSize: 28,
          fontFamily: fonts.mono,
          fontWeight: 700,
          color: isFree ? theme.emerald : theme.amberDim,
          opacity: valOp,
          minWidth: 120,
          textAlign: "right",
        }}
      >
        {item.value}
      </div>
    </div>
  );
};
