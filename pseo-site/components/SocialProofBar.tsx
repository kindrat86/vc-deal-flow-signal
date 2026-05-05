interface SocialProofBarProps {
  startupCount: number;
  sectorCount: number;
}

function Dot() {
  return (
    <span
      aria-hidden="true"
      className="hidden sm:inline-block h-1 w-1 rounded-full bg-slate-700"
    />
  );
}

export default function SocialProofBar({
  startupCount,
  sectorCount,
}: SocialProofBarProps) {
  return (
    <aside
      aria-label="Credibility"
      className="rounded-lg border border-slate-800 bg-slate-900/60 px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs"
    >
      <span className="flex items-center gap-1.5">
        <span className="text-gray-100 font-semibold tabular-nums">{startupCount}</span>
        <span className="text-gray-500">venture-backed startups</span>
      </span>
      <Dot />
      <span className="flex items-center gap-1.5">
        <span className="text-gray-100 font-semibold tabular-nums">{sectorCount}</span>
        <span className="text-gray-500">sectors</span>
      </span>
      <Dot />
      <a
        href="https://ssrn.com/abstract=6606558"
        rel="noopener noreferrer"
        target="_blank"
        className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
      >
        SSRN-indexed methodology
      </a>
      <Dot />
      <a
        href="https://www.npmjs.com/package/@gitdealflow/mcp-signal"
        rel="noopener noreferrer"
        target="_blank"
        className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
      >
        Free MCP for Claude / Cursor
      </a>
      <Dot />
      <span className="text-gray-500 inline-flex items-center gap-1.5">
        <span className="relative inline-flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/60 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
        </span>
        Updated every Monday
      </span>
    </aside>
  );
}
