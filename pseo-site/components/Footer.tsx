import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-[rgba(148,163,184,0.1)] mt-auto">
      <div className="max-w-[1120px] mx-auto px-[clamp(20px,5vw,40px)] py-8 flex flex-wrap gap-4 justify-between items-center">
        <div
          className="text-sm text-[#64748b]"
          style={{ fontFamily: "'IBM Plex Mono', monospace" }}
        >
          GitDealFlow/signals — © 2026
        </div>
        <div className="flex flex-wrap gap-5 text-[13.5px]">
          <Link href="https://gitdealflow.com/privacy" className="text-[#94a3b8] hover:text-[#e2e8f0] transition-colors">
            Privacy
          </Link>
          <Link href="https://gitdealflow.com/terms" className="text-[#94a3b8] hover:text-[#e2e8f0] transition-colors">
            Terms
          </Link>
          <Link href="/blog" className="text-[#94a3b8] hover:text-[#e2e8f0] transition-colors">
            Blog
          </Link>
          <Link href="/feed.xml" className="text-[#94a3b8] hover:text-[#e2e8f0] transition-colors">
            RSS
          </Link>
        </div>
      </div>
    </footer>
  );
}
