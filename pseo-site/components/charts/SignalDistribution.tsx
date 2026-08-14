import type { Startup } from "@/lib/data";

interface SignalDistributionProps {
  startups: Startup[];
  sectorName?: string;
}

const SIGNAL_COLORS: Record<string, string> = {
  "Engineering hiring burst": "#0ea5e9",
  "Infrastructure buildout": "#8b5cf6",
  "Deploy frequency spike": "#10b981",
  "Framework migration": "#f59e0b",
};

/**
 * Server-rendered SVG donut chart showing signal type distribution.
 */
export default function SignalDistribution({
  startups,
  sectorName = "all sectors",
}: SignalDistributionProps) {
  const counts: Record<string, number> = {};
  for (const s of startups) {
    counts[s.signalType] = (counts[s.signalType] || 0) + 1;
  }

  const entries = Object.entries(counts).sort(([, a], [, b]) => b - a);
  if (entries.length === 0) return null;

  const total = startups.length;
  const cx = 60;
  const cy = 60;
  const r = 45;
  const innerR = 28;

  // Build arcs
  let cumAngle = -Math.PI / 2;
  const arcs = entries.map(([type, count]) => {
    const angle = (count / total) * 2 * Math.PI;
    const startAngle = cumAngle;
    const endAngle = cumAngle + angle;
    cumAngle = endAngle;

    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const ix1 = cx + innerR * Math.cos(endAngle);
    const iy1 = cy + innerR * Math.sin(endAngle);
    const ix2 = cx + innerR * Math.cos(startAngle);
    const iy2 = cy + innerR * Math.sin(startAngle);
    const largeArc = angle > Math.PI ? 1 : 0;

    const d = [
      `M ${x1} ${y1}`,
      `A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${ix1} ${iy1}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${ix2} ${iy2}`,
      "Z",
    ].join(" ");

    return { type, count, d, color: SIGNAL_COLORS[type] ?? "#64748b" };
  });

  const altText = `Signal distribution for ${sectorName}: ${entries.map(([t, c]) => `${t} (${c})`).join(", ")}. ${total} startups total.`;

  return (
    <figure className="my-6">
      <div className="flex items-start gap-6">
        <svg
          viewBox="0 0 120 120"
          className="w-28 h-28 shrink-0"
          role="img"
          aria-label={altText}
        >
          <title>{altText}</title>
          {arcs.map((arc) => (
            <path key={arc.type} d={arc.d} fill={arc.color} opacity={0.85} />
          ))}
          <text
            x={cx}
            y={cy - 4}
            textAnchor="middle"
            fill="#e2e8f0"
            fontSize={18}
            fontWeight={700}
            fontFamily="system-ui"
          >
            {total}
          </text>
          <text
            x={cx}
            y={cy + 10}
            textAnchor="middle"
            fill="#64748b"
            fontSize={10}
            fontFamily="system-ui"
          >
            startups
          </text>
        </svg>
        <div className="space-y-1.5 pt-1">
          {entries.map(([type, count]) => (
            <div key={type} className="flex items-center gap-2 text-xs">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: SIGNAL_COLORS[type] ?? "#64748b" }}
              />
              <span className="text-gray-400">
                {type}{" "}
                <span className="text-gray-400">
                  ({count}, {Math.round((count / total) * 100)}%)
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
      <figcaption className="text-gray-600 text-xs mt-2">
        Signal type distribution across {total} {sectorName.toLowerCase()}{" "}
        startups. Data: VC Deal Flow Signal.
      </figcaption>
    </figure>
  );
}
