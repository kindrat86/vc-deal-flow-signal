interface SocialProofBarProps {
  startupCount: number;
  sectorCount: number;
}

export default function SocialProofBar({
  startupCount,
  sectorCount,
}: SocialProofBarProps) {
  return (
    <aside
      aria-label="Credibility"
      className="rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs"
    >
      <span className="flex items-center gap-1.5">
        <span className="text-gray-100 font-semibold">{startupCount}</span>
        <span className="text-gray-500">venture-backed startups tracked</span>
      </span>
      <span className="text-slate-700" aria-hidden="true">·</span>
      <span className="flex items-center gap-1.5">
        <span className="text-gray-100 font-semibold">{sectorCount}</span>
        <span className="text-gray-500">sectors</span>
      </span>
      <span className="text-slate-700" aria-hidden="true">·</span>
      <a
        href="https://ssrn.com/abstract=6606558"
        rel="noopener noreferrer"
        target="_blank"
        className="text-emerald-400 hover:text-emerald-300 font-medium"
      >
        SSRN-indexed methodology
      </a>
      <span className="text-slate-700" aria-hidden="true">·</span>
      <a
        href="https://www.npmjs.com/package/@gitdealflow/mcp-signal"
        rel="noopener noreferrer"
        target="_blank"
        className="text-sky-400 hover:text-sky-300 font-medium"
      >
        Free MCP for Claude / Cursor
      </a>
      <span className="text-slate-700" aria-hidden="true">·</span>
      <span className="text-gray-500">Updated every Monday</span>
    </aside>
  );
}
