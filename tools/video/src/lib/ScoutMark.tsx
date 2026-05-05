import React from "react";
import { theme } from "./theme";

// Brand mark: an upward chevron inside a soft-emerald circle.
// Stand-in for a Scout logo until/unless we commission a real one.
export const ScoutMark: React.FC<{ size?: number; opacity?: number }> = ({
  size = 64,
  opacity = 1,
}) => {
  const stroke = Math.max(2, size / 16);
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      style={{ opacity }}
      aria-hidden
    >
      <circle
        cx={32}
        cy={32}
        r={30}
        fill={theme.emeraldGlow}
        stroke={theme.emerald}
        strokeWidth={stroke}
      />
      <path
        d="M16 38 L32 22 L48 38"
        fill="none"
        stroke={theme.emerald}
        strokeWidth={stroke * 1.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
