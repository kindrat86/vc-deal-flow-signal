/**
 * SVG diagram showing the five engineering signal types with descriptions.
 * Used in posts about signal classification.
 */
export default function SignalTypes() {
  const signals = [
    {
      name: "Hiring Burst",
      metric: "Contributors +50%",
      color: "#38bdf8",
      bg: "#0c4a6e",
      desc: "Team scaling rapidly",
    },
    {
      name: "Infra Buildout",
      metric: "3+ new repos / 30d",
      color: "#a78bfa",
      bg: "#2e1065",
      desc: "Platform expanding",
    },
    {
      name: "Deploy Spike",
      metric: "Velocity +150%",
      color: "#34d399",
      bg: "#064e3b",
      desc: "Shipping fast",
    },
    {
      name: "Migration",
      metric: "General accel.",
      color: "#fbbf24",
      bg: "#451a03",
      desc: "Stack transition",
    },
    {
      name: "Deceleration",
      metric: "Velocity < prior",
      color: "#fb7185",
      bg: "#4c0519",
      desc: "Pace falling",
    },
  ];

  return (
    <figure className="my-8" role="img" aria-label="Five types of engineering acceleration signals: hiring burst, infrastructure buildout, deploy frequency spike, framework migration, and deceleration">
      <svg
        viewBox="0 0 884 160"
        className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2"
        xmlns="http://www.w3.org/2000/svg"
      >
        {signals.map((s, i) => {
          const x = 16 + i * 176;
          return (
            <g key={s.name}>
              <rect x={x} y="12" width="164" height="130" rx="8" fill={s.bg} opacity="0.6" />
              <rect x={x} y="12" width="164" height="130" rx="8" fill="none" stroke={s.color} strokeWidth="1" opacity="0.4" />
              <text x={x + 82} y="40" textAnchor="middle" fill={s.color} fontSize="13" fontWeight="700" fontFamily="system-ui">
                {s.name}
              </text>
              <text x={x + 82} y="72" textAnchor="middle" fill="#e2e8f0" fontSize="11" fontFamily="system-ui">
                {s.metric}
              </text>
              <line x1={x + 30} y1="86" x2={x + 134} y2="86" stroke={s.color} strokeWidth="1" opacity="0.3" />
              <text x={x + 82} y="108" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="system-ui">
                {s.desc}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="mt-2 text-center text-gray-400 text-xs">
        Each startup is classified into one of five signal types based on which
        metric drives the acceleration. The classification helps investors
        understand what phase the company is in.
      </figcaption>
    </figure>
  );
}
