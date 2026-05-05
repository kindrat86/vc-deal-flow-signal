import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Brand row */}
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-sky-500 to-indigo-600 text-xs font-bold text-slate-950 shadow-sm shadow-sky-500/30"
            >
              G
            </span>
            <span className="text-gray-100 font-semibold tracking-tight">
              VC Deal Flow Signal
            </span>
            <span className="hidden sm:inline text-gray-600">·</span>
            <span className="hidden sm:inline text-gray-500 text-xs">
              GitHub momentum, before the fundraise
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
            <a
              href="https://ssrn.com/abstract=6606558"
              rel="noopener noreferrer"
              target="_blank"
              className="text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              SSRN-indexed methodology
            </a>
            <span aria-hidden="true">·</span>
            <a
              href="https://www.npmjs.com/package/@gitdealflow/mcp-signal"
              rel="noopener noreferrer"
              target="_blank"
              className="text-sky-400 hover:text-sky-300 transition-colors"
            >
              Free MCP for Claude / Cursor
            </a>
            <span aria-hidden="true">·</span>
            <span>Refreshed every Monday</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-8">
          <div>
            <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">Product</p>
            <nav className="flex flex-col gap-2 text-sm text-gray-500">
              <Link href="/pricing" className="hover:text-gray-200 transition-colors">Pricing</Link>
              <Link href="/buyers-guide" className="hover:text-gray-200 transition-colors">Buyers Guide</Link>
              <Link href="/enterprise" className="hover:text-gray-200 transition-colors">Enterprise</Link>
              <Link href="/alternatives" className="hover:text-gray-200 transition-colors">Alternatives</Link>
              <Link href="/use-cases" className="hover:text-gray-200 transition-colors">Use Cases</Link>
              <Link href="/integrations" className="hover:text-gray-200 transition-colors">Integrations</Link>
              <Link href="/install" className="hover:text-gray-200 transition-colors">Bookmarklet</Link>
              <Link href="/changelog" className="hover:text-gray-200 transition-colors">Changelog</Link>
            </nav>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">Data</p>
            <nav className="flex flex-col gap-2 text-sm text-gray-500">
              <Link href="/methodology" className="hover:text-gray-200 transition-colors">Methodology</Link>
              <Link href="/reproducibility" className="hover:text-gray-200 transition-colors">Reproducibility</Link>
              <Link href="/data-sources" className="hover:text-gray-200 transition-colors">Data Sources</Link>
              <Link href="/signals" className="hover:text-gray-200 transition-colors">Signal Vocabulary</Link>
              <Link href="/knowledge" className="hover:text-gray-200 transition-colors">Knowledge Graph</Link>
              <Link href="/developers" className="hover:text-gray-200 transition-colors">Developers / API</Link>
              <Link href="/feed.xml" className="hover:text-gray-200 transition-colors">RSS Feed</Link>
            </nav>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">Browse</p>
            <nav className="flex flex-col gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-200 transition-colors">All Sectors</Link>
              <Link href="/trending" className="hover:text-gray-200 transition-colors">Trending</Link>
              <Link href="/stage/seed" className="hover:text-gray-200 transition-colors">By Stage</Link>
              <Link href="/vs/harmonic-ai-vs-dealroom" className="hover:text-gray-200 transition-colors">Head-to-Head</Link>
              <Link href="/blog" className="hover:text-gray-200 transition-colors">Blog</Link>
              <Link href="/glossary" className="hover:text-gray-200 transition-colors">Glossary</Link>
              <Link href="/faq" className="hover:text-gray-200 transition-colors">FAQ</Link>
            </nav>
          </div>
          <div>
            <p className="text-xs font-semibold text-gray-300 uppercase tracking-wider mb-3">Elsewhere</p>
            <nav className="flex flex-col gap-2 text-sm text-gray-500">
              <a href="https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn" className="hover:text-gray-200 transition-colors" rel="noopener noreferrer" target="_blank">Chrome — Crunchbase/Wellfound</a>
              <a href="https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm" className="hover:text-gray-200 transition-colors" rel="noopener noreferrer" target="_blank">Chrome — GitHub Hover Lookup</a>
              <a href="https://t.me/gitdealflow" className="hover:text-gray-200 transition-colors" rel="noopener noreferrer" target="_blank">Telegram</a>
              <a href="https://x.com/data_nerd" className="hover:text-gray-200 transition-colors" rel="noopener noreferrer" target="_blank">Twitter/X</a>
              <a href="https://www.linkedin.com/company/gitdealflow" className="hover:text-gray-200 transition-colors" rel="noopener noreferrer" target="_blank">LinkedIn</a>
              <a href="https://www.npmjs.com/package/@gitdealflow/mcp-signal" className="hover:text-gray-200 transition-colors" rel="noopener noreferrer" target="_blank">npm (MCP)</a>
            </nav>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-500 pt-6 border-t border-slate-800">
          <Link href="/standards" className="hover:text-gray-300 transition-colors">Standards</Link>
          <Link href="/attestations" className="hover:text-gray-300 transition-colors">Attestations</Link>
          <Link href="/corrections" className="hover:text-gray-300 transition-colors">Corrections</Link>
          <Link href="/citation-guide" className="hover:text-gray-300 transition-colors">Citation Guide</Link>
          <Link href="/press" className="hover:text-gray-300 transition-colors">Press</Link>
          <Link href="/mirrors" className="hover:text-gray-300 transition-colors">Mirrors</Link>
          <Link href="/embed" className="hover:text-gray-300 transition-colors">Embed</Link>
          <Link href="/translations" className="hover:text-gray-300 transition-colors">Translations</Link>
          <Link href="/wikipedia" className="hover:text-gray-300 transition-colors">Wikipedia</Link>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 mt-6 border-t border-slate-800">
          <p className="text-gray-400 text-sm max-w-md leading-relaxed">
            VC Deal Flow Signal tracks GitHub engineering acceleration as a
            leading indicator of startup momentum. Data is updated weekly.
          </p>
          <nav className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
            <Link href="https://gitdealflow.com" className="hover:text-gray-300 transition-colors">Main Site</Link>
            <Link href="/about" className="hover:text-gray-300 transition-colors">About</Link>
            <Link href="https://gitdealflow.com/privacy" className="hover:text-gray-300 transition-colors">Privacy</Link>
            <Link href="https://gitdealflow.com/terms" className="hover:text-gray-300 transition-colors">Terms</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
