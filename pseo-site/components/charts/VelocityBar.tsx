import type { Startup } from "@/lib/data";

interface VelocityBarProps {
  startups: Startup[];
  maxBars?: number;
  title?: string;
}

/**
 * Server-rendered SVG bar chart showing commit velocity change for top startups.
 * Includes proper alt text and aria labels for accessibility and image SEO.
 */
export default function VelocityBar({
  startups,
  maxBars = 8,
  title = "Commit Velocity Change",
}: VelocityBarProps) {
  const sorted = [...startups]
    .map((s) => ({
      name: s.name,
      value: parseInt(s.commitVelocityChange.replace(/[^0-9-]/g, ""), 10) || 0,
      raw: s.commitVelocityChange,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, maxBars);

  if (sorted.length === 0) return null;

  const maxVal = Math.max(...sorted.map((s) => Math.abs(s.value)), 1);
  const barHeight = 28;
  const gap = 6;
  const labelWidth = 120;
  const chartWidth = 400;
  const totalWidth = labelWidth + chartWidth + 60;
  const totalHeight = sorted.length * (barHeight + gap) + 30;

  const altText = `Bar chart: ${title}. ${sorted.map((s) => `${s.name}: ${s.raw}`).join(", ")}.`;

  return (
    <figure className="my-6">
      <svg
        viewBox={`0 0 ${totalWidth} ${totalHeight}`}
        className="w-full max-w-lg"
        role="img"
        aria-label={altText}
      >
        <title>{altText}</title>
        {/* Title */}
        <text x={labelWidth} y={16} fill="#94a3b8" fontSize={12} fontFamily="system-ui">
          {title}
        </text>

        {sorted.map((s, i) => {
          const y = 28 + i * (barHeight + gap);
          const barW = (Math.abs(s.value) / maxVal) * chartWidth;
          const isPositive = s.value >= 0;
          const fill = isPositive ? "#0ea5e9" : "#ef4444";

          return (
            <g key={s.name}>
              {/* Label */}
              <text
                x={labelWidth - 8}
                y={y + barHeight / 2 + 4}
                fill="#94a3b8"
                fontSize={11}
                textAnchor="end"
                fontFamily="system-ui"
              >
                {s.name.length > 16 ? s.name.slice(0, 15) + "..." : s.name}
              </text>
              {/* Bar */}
              <rect
                x={labelWidth}
                y={y}
                width={Math.max(barW, 2)}
                height={barHeight}
                rx={3}
                fill={fill}
                opacity={0.8}
              />
              {/* Value */}
              <text
                x={labelWidth + barW + 6}
                y={y + barHeight / 2 + 4}
                fill={isPositive ? "#38bdf8" : "#f87171"}
                fontSize={11}
                fontFamily="system-ui, monospace"
                fontWeight={600}
              >
                {s.raw}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="text-gray-600 text-xs mt-1">
        {title}, top {sorted.length} startups by 14-day commit velocity change.
        Data: VC Deal Flow Signal.
      </figcaption>
    </figure>
  );
}
