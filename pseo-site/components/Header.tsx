import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link
          href="https://gitdealflow.com"
          className="text-gray-100 font-semibold text-base tracking-tight hover:text-sky-400 transition-colors"
        >
          VC Deal Flow Signal
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-gray-400 text-sm hover:text-gray-100 transition-colors"
          >
            Sectors
          </Link>
          <Link
            href="/trending"
            className="text-gray-400 text-sm hover:text-gray-100 transition-colors"
          >
            Trending
          </Link>
          <Link
            href="/dashboard"
            className="text-sky-400 text-sm hover:text-sky-300 transition-colors font-medium"
          >
            Dashboard
          </Link>
          <Link
            href="/methodology"
            className="text-gray-400 text-sm hover:text-gray-100 transition-colors"
          >
            Methodology
          </Link>
          <Link
            href="/blog"
            className="text-gray-400 text-sm hover:text-gray-100 transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/about"
            className="text-gray-400 text-sm hover:text-gray-100 transition-colors"
          >
            About
          </Link>
          <Link
            href="https://gitdealflow.com/#signup"
            className="text-sm bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-md transition-colors font-medium"
          >
            Get Free Digest
          </Link>
        </nav>
      </div>
    </header>
  );
}
