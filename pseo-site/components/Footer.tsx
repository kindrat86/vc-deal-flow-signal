import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
          <div>
            <p className="text-xs font-medium text-gray-300 uppercase tracking-wider mb-3">Product</p>
            <nav className="flex flex-col gap-2 text-sm text-gray-500">
              <Link href="/alternatives" className="hover:text-gray-300 transition-colors">Alternatives</Link>
              <Link href="/use-cases" className="hover:text-gray-300 transition-colors">Use Cases</Link>
              <Link href="/integrations" className="hover:text-gray-300 transition-colors">Integrations</Link>
              <Link href="/install" className="hover:text-gray-300 transition-colors">Bookmarklet</Link>
              <Link href="/changelog" className="hover:text-gray-300 transition-colors">Changelog</Link>
            </nav>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-300 uppercase tracking-wider mb-3">Data</p>
            <nav className="flex flex-col gap-2 text-sm text-gray-500">
              <Link href="/methodology" className="hover:text-gray-300 transition-colors">Methodology</Link>
              <Link href="/data-sources" className="hover:text-gray-300 transition-colors">Data Sources</Link>
              <Link href="/developers" className="hover:text-gray-300 transition-colors">Developers / API</Link>
              <Link href="/feed.xml" className="hover:text-gray-300 transition-colors">RSS Feed</Link>
            </nav>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-300 uppercase tracking-wider mb-3">Browse</p>
            <nav className="flex flex-col gap-2 text-sm text-gray-500">
              <Link href="/" className="hover:text-gray-300 transition-colors">All Sectors</Link>
              <Link href="/trending" className="hover:text-gray-300 transition-colors">Trending</Link>
              <Link href="/stage/seed" className="hover:text-gray-300 transition-colors">By Stage</Link>
              <Link href="/vs/harmonic-ai-vs-dealroom" className="hover:text-gray-300 transition-colors">Head-to-Head</Link>
              <Link href="/blog" className="hover:text-gray-300 transition-colors">Blog</Link>
              <Link href="/glossary" className="hover:text-gray-300 transition-colors">Glossary</Link>
              <Link href="/faq" className="hover:text-gray-300 transition-colors">FAQ</Link>
            </nav>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-300 uppercase tracking-wider mb-3">Elsewhere</p>
            <nav className="flex flex-col gap-2 text-sm text-gray-500">
              <a href="https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn" className="hover:text-gray-300 transition-colors" rel="noopener noreferrer" target="_blank">Chrome Extension</a>
              <a href="https://t.me/gitdealflow" className="hover:text-gray-300 transition-colors" rel="noopener noreferrer" target="_blank">Telegram</a>
              <a href="https://x.com/data_nerd" className="hover:text-gray-300 transition-colors" rel="noopener noreferrer" target="_blank">Twitter/X</a>
              <a href="https://www.linkedin.com/company/gitdealflow" className="hover:text-gray-300 transition-colors" rel="noopener noreferrer" target="_blank">LinkedIn</a>
              <a href="https://www.npmjs.com/package/@gitdealflow/mcp-signal" className="hover:text-gray-300 transition-colors" rel="noopener noreferrer" target="_blank">npm (MCP)</a>
            </nav>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-6 border-t border-slate-800">
          <p className="text-gray-400 text-sm max-w-md">
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
