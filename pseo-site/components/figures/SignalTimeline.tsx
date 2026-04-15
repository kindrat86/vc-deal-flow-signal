/**
 * SVG diagram showing the 6-12 week lead time from engineering acceleration
 * to fundraise announcement. Used in signal-timing blog posts.
 */
export default function SignalTimeline() {
  return (
    <figure className="my-8" role="img" aria-label="Timeline showing engineering acceleration signals appearing 6-12 weeks before fundraise announcements">
      <svg
        viewBox="0 0 720 200"
        className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background timeline bar */}
        <rect x="60" y="90" width="600" height="4" rx="2" fill="#1e293b" />

        {/* Week markers */}
        {[0, 2, 4, 6, 8, 10, 12].map((week, i) => {
          const x = 60 + (week / 12) * 600;
          return (
            <g key={week}>
              <line x1={x} y1="82" x2={x} y2="102" stroke="#334155" strokeWidth="2" />
              <text x={x} y="120" textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="system-ui">
                Week {week}
              </text>
            </g>
          );
        })}

        {/* Signal detection zone */}
        <rect x="60" y="50" width="200" height="30" rx="4" fill="#0c4a6e" opacity="0.5" />
        <text x="160" y="70" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="600" fontFamily="system-ui">
          Signal Detected
        </text>

        {/* Optimal outreach zone */}
        <rect x="160" y="50" width="200" height="30" rx="4" fill="#064e3b" opacity="0.5" />
        <text x="260" y="70" textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="600" fontFamily="system-ui">
          Optimal Outreach
        </text>

        {/* Round in progress */}
        <rect x="360" y="50" width="200" height="30" rx="4" fill="#451a03" opacity="0.5" />
        <text x="460" y="70" textAnchor="middle" fill="#fbbf24" fontSize="11" fontWeight="600" fontFamily="system-ui">
          Round In Progress
        </text>

        {/* Announcement */}
        <circle cx="610" cy="92" r="8" fill="#ef4444" />
        <text x="610" y="145" textAnchor="middle" fill="#f87171" fontSize="10" fontWeight="600" fontFamily="system-ui">
          Fundraise
        </text>
        <text x="610" y="158" textAnchor="middle" fill="#f87171" fontSize="10" fontFamily="system-ui">
          Announced
        </text>

        {/* Start marker */}
        <circle cx="60" cy="92" r="8" fill="#0ea5e9" />
        <text x="60" y="145" textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="600" fontFamily="system-ui">
          Velocity
        </text>
        <text x="60" y="158" textAnchor="middle" fill="#38bdf8" fontSize="10" fontFamily="system-ui">
          Spike
        </text>

        {/* Arrow */}
        <text x="360" y="185" textAnchor="middle" fill="#475569" fontSize="11" fontFamily="system-ui">
          6-12 weeks lead time
        </text>
      </svg>
      <figcaption className="mt-2 text-center text-gray-500 text-xs">
        Engineering acceleration signals typically appear 6-12 weeks before fundraise announcements.
        The optimal investor outreach window is weeks 2-4 after the signal is first detected.
      </figcaption>
    </figure>
  );
}
