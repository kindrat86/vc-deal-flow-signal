interface SocialProofBarProps {
  startupCount: number;
  sectorCount: number;
}

function Dot() {
  return (
    <span
      aria-hidden="true"
      className="hidden sm:inline-block h-1 w-1 rounded-full bg-[#334155]"
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
      className="rounded-lg border border-[rgba(148,163,184,0.12)] bg-[rgba(148,163,184,0.04)] px-4 py-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs"
    >
      <span className="flex items-center gap-1.5">
        <span className="text-[#f8fafc] font-semibold tabular-nums">{startupCount}</span>
        <span className="text-[#94a3b8]">venture-backed startups</span>
      </span>
      <Dot />
      <span className="flex items-center gap-1.5">
        <span className="text-[#f8fafc] font-semibold tabular-nums">{sectorCount}</span>
        <span className="text-[#94a3b8]">sectors</span>
      </span>
      <Dot />
      <a
        href="https://ssrn.com/abstract=6606558"
        rel="noopener noreferrer"
        target="_blank"
        className="text-[#4ade80] hover:text-[#86efac] font-medium transition-colors"
      >
        SSRN-indexed methodology
      </a>
      <Dot />
      <a
        href="https://www.npmjs.com/package/@gitdealflow/mcp-signal"
        rel="noopener noreferrer"
        target="_blank"
        className="text-[#38bdf8] hover:text-[#7dd3fc] font-medium transition-colors"
      >
        Free MCP for Claude / Cursor
      </a>
      <Dot />
      <span className="text-[#94a3b8] inline-flex items-center gap-1.5">
        <span className="relative inline-flex h-1.5 w-1.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#4ade80]/60 opacity-75" />
          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#4ade80]" />
        </span>
        Updated every Monday
      </span>
    </aside>
  );
}
