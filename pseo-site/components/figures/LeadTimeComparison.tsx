/**
 * Horizontal bar chart comparing lead times of different deal flow data sources.
 * Used in alternative data and Crunchbase comparison posts.
 */
export default function LeadTimeComparison() {
  const sources = [
    { name: "GitHub Engineering", weeks: 12, color: "#0ea5e9", label: "6-12 weeks" },
    { name: "Hiring Signals", weeks: 8, color: "#a78bfa", label: "4-8 weeks" },
    { name: "Web Traffic", weeks: 6, color: "#34d399", label: "4-6 weeks" },
    { name: "Social / Press", weeks: 2, color: "#fbbf24", label: "1-2 weeks" },
    { name: "Crunchbase", weeks: 0.5, color: "#ef4444", label: "0 weeks (lagging)" },
  ];

  const maxWeeks = 14;

  return (
    <figure className="my-8" role="img" aria-label="Bar chart comparing deal flow signal lead times: GitHub engineering signals provide 6-12 weeks, hiring signals 4-8 weeks, web traffic 4-6 weeks, social signals 1-2 weeks, and Crunchbase provides zero lead time">
      <svg
        viewBox="0 0 720 230"
        className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text x="360" y="28" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="600" fontFamily="system-ui">
          Lead Time Before Fundraise Announcement
        </text>

        {sources.map((s, i) => {
          const y = 50 + i * 36;
          const barWidth = Math.max((s.weeks / maxWeeks) * 420, 8);
          return (
            <g key={s.name}>
              <text x="155" y={y + 16} textAnchor="end" fill="#94a3b8" fontSize="11" fontFamily="system-ui">
                {s.name}
              </text>
              <rect x="165" y={y + 2} width={barWidth} height="20" rx="4" fill={s.color} opacity="0.7" />
              <text
                x={170 + barWidth}
                y={y + 16}
                fill={s.color}
                fontSize="11"
                fontWeight="600"
                fontFamily="system-ui"
              >
                {s.label}
              </text>
            </g>
          );
        })}

        {/* X-axis */}
        <line x1="165" y1="232" x2="585" y2="232" stroke="#334155" strokeWidth="1" />
        <text x="360" y="225" textAnchor="middle" fill="#475569" fontSize="10" fontFamily="system-ui">
          Weeks before announcement (more is better)
        </text>
      </svg>
      <figcaption className="mt-2 text-center text-gray-500 text-xs">
        GitHub engineering signals provide the longest lead time of any publicly
        available deal flow signal. Crunchbase data appears after rounds close.
      </figcaption>
    </figure>
  );
}
