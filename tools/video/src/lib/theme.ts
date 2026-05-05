// Brand colors lifted from pseo-site (signals.gitdealflow.com).
// Tailwind tokens → hex. Keep in sync if /predicted is restyled.
export const theme = {
  bg: "#020617",        // slate-950
  bgPanel: "#0f172a",   // slate-900
  bgPanelAlt: "#1e293b",// slate-800
  border: "#334155",    // slate-700
  borderSubtle: "#1e293b",
  text: "#f3f4f6",      // gray-100
  textDim: "#9ca3af",   // gray-400
  textFaint: "#64748b", // slate-500
  emerald: "#34d399",   // emerald-400
  emeraldDim: "#6ee7b7",// emerald-300
  emeraldGlow: "rgba(52, 211, 153, 0.18)",
  amber: "#fbbf24",     // amber-400
  amberDim: "#fcd34d",  // amber-300
  amberGlow: "rgba(251, 191, 36, 0.18)",
  sky: "#38bdf8",       // sky-400
  skyDim: "#7dd3fc",    // sky-300
  rose: "#fb7185",      // rose-400
} as const;

export const fonts = {
  sans: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Inter", system-ui, sans-serif',
  mono: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
};
