/**
 * Visual flowchart of the 5-step startup screening checklist.
 * Used in the engineering metrics post.
 */
export default function ScreeningChecklist() {
  const steps = [
    { label: "Velocity change > +50%?", pass: "Yes", fail: "Skip" },
    { label: "Contributors growing?", pass: "Yes", fail: "Skip" },
    { label: "New repos in 30 days?", pass: "Yes", fail: "Maybe" },
    { label: "Product-related activity?", pass: "Yes", fail: "Skip" },
    { label: "Tech stack matches pitch?", pass: "Yes", fail: "Investigate" },
  ];

  return (
    <figure className="my-8" role="img" aria-label="Five-step startup screening checklist: check velocity change, contributor growth, new repositories, product-related activity, and tech stack consistency">
      <svg
        viewBox="0 0 720 300"
        className="w-full rounded-lg border border-slate-800 bg-slate-900 p-2"
        xmlns="http://www.w3.org/2000/svg"
      >
        <text x="360" y="28" textAnchor="middle" fill="#e2e8f0" fontSize="13" fontWeight="600" fontFamily="system-ui">
          Quick Screening Checklist
        </text>

        {steps.map((s, i) => {
          const y = 48 + i * 50;
          return (
            <g key={i}>
              {/* Step number */}
              <circle cx="80" cy={y + 14} r="14" fill="#0c4a6e" />
              <text x="80" y={y + 19} textAnchor="middle" fill="#38bdf8" fontSize="12" fontWeight="700" fontFamily="system-ui">
                {i + 1}
              </text>

              {/* Question box */}
              <rect x="110" y={y} width="310" height="28" rx="6" fill="#1e293b" />
              <text x="265" y={y + 18} textAnchor="middle" fill="#e2e8f0" fontSize="12" fontFamily="system-ui">
                {s.label}
              </text>

              {/* Pass */}
              <rect x="440" y={y} width="70" height="28" rx="6" fill="#064e3b" />
              <text x="475" y={y + 18} textAnchor="middle" fill="#34d399" fontSize="11" fontWeight="600" fontFamily="system-ui">
                {s.pass}
              </text>

              {/* Fail */}
              <rect x="525" y={y} width="90" height="28" rx="6" fill="#1c1917" />
              <text x="570" y={y + 18} textAnchor="middle" fill="#78716c" fontSize="11" fontFamily="system-ui">
                {s.fail}
              </text>

              {/* Connector to next step */}
              {i < steps.length - 1 && (
                <line x1="475" y1={y + 28} x2="475" y2={y + 50} stroke="#064e3b" strokeWidth="2" strokeDasharray="4,3" />
              )}
            </g>
          );
        })}

        {/* Result */}
        <rect x="400" y="300" width="160" height="0" rx="6" fill="transparent" />
        <text x="475" y="290" textAnchor="middle" fill="#34d399" fontSize="12" fontWeight="600" fontFamily="system-ui">
          All pass = deeper look
        </text>
      </svg>
      <figcaption className="mt-2 text-center text-gray-400 text-xs">
        A five-check screen that takes 2-5 minutes per startup. If a company
        fails checks 1 or 2, the engineering signal is not there — move on.
      </figcaption>
    </figure>
  );
}
