"use client";

import { useState } from "react";
import Link from "next/link";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link
          href="https://gitdealflow.com"
          className="text-gray-100 font-semibold text-base tracking-tight hover:text-sky-400 transition-colors"
        >
          VC Deal Flow Signal
        </Link>

        {/* Hamburger button — mobile only */}
        <button
          className="md:hidden text-gray-300 hover:text-white"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-gray-400 text-sm hover:text-gray-100 transition-colors">
            Sectors
          </Link>
          <Link href="/trending" className="text-gray-400 text-sm hover:text-gray-100 transition-colors">
            Trending
          </Link>
          <Link href="/dashboard" className="text-sky-400 text-sm hover:text-sky-300 transition-colors font-medium">
            Dashboard
          </Link>
          <Link href="/methodology" className="text-gray-400 text-sm hover:text-gray-100 transition-colors">
            Methodology
          </Link>
          <Link href="/blog" className="text-gray-400 text-sm hover:text-gray-100 transition-colors">
            Blog
          </Link>
          <Link href="/about" className="text-gray-400 text-sm hover:text-gray-100 transition-colors">
            About
          </Link>
          <Link
            href="https://gitdealflow.com/#signup"
            className="text-sm bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-md transition-colors font-medium"
          >
            See This Week&apos;s Signals
          </Link>
        </nav>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-4 flex flex-col gap-1">
          <Link href="/" onClick={() => setOpen(false)} className="text-gray-400 text-sm hover:text-gray-100 transition-colors py-2 px-2 rounded hover:bg-slate-800/60">
            Sectors
          </Link>
          <Link href="/trending" onClick={() => setOpen(false)} className="text-gray-400 text-sm hover:text-gray-100 transition-colors py-2 px-2 rounded hover:bg-slate-800/60">
            Trending
          </Link>
          <Link href="/dashboard" onClick={() => setOpen(false)} className="text-sky-400 text-sm hover:text-sky-300 transition-colors font-medium py-2 px-2 rounded hover:bg-slate-800/60">
            Dashboard
          </Link>
          <Link href="/methodology" onClick={() => setOpen(false)} className="text-gray-400 text-sm hover:text-gray-100 transition-colors py-2 px-2 rounded hover:bg-slate-800/60">
            Methodology
          </Link>
          <Link href="/blog" onClick={() => setOpen(false)} className="text-gray-400 text-sm hover:text-gray-100 transition-colors py-2 px-2 rounded hover:bg-slate-800/60">
            Blog
          </Link>
          <Link href="/about" onClick={() => setOpen(false)} className="text-gray-400 text-sm hover:text-gray-100 transition-colors py-2 px-2 rounded hover:bg-slate-800/60">
            About
          </Link>
          <Link
            href="https://gitdealflow.com/#signup"
            onClick={() => setOpen(false)}
            className="text-sm bg-sky-600 hover:bg-sky-500 text-white px-3 py-2.5 rounded-md transition-colors font-medium text-center mt-2"
          >
            See This Week&apos;s Signals
          </Link>
        </nav>
      )}
    </header>
  );
}
