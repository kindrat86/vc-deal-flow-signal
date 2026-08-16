"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SITE = "https://signals.gitdealflow.com";

// Single source of truth for the top-level nav. The same array drives the
// rendered desktop + mobile nav and the SiteNavigationElement JSON-LD that
// crawlers ingest.
const NAV: readonly { href: string; label: string }[] = [
  { href: "/", label: "Sectors" },
  { href: "/trending", label: "Trending" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/pricing", label: "Pricing" },
  { href: "/methodology", label: "Methodology" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
];

const NAV_JSONLD = {
  "@context": "https://schema.org",
  "@type": "SiteNavigationElement",
  "@id": `${SITE}#navigation`,
  name: [...NAV.map((n) => n.label), "Search"],
  url: [
    ...NAV.map((n) =>
      n.href.startsWith("http") ? n.href : `${SITE}${n.href}`
    ),
    `${SITE}/search`,
  ],
};

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-800 bg-slate-950/85 backdrop-blur-md sticky top-0 z-50">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(NAV_JSONLD) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-100 font-semibold text-base tracking-tight hover:text-sky-400 transition-colors"
        >
          <span
            aria-hidden="true"
            className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-sky-500 to-indigo-600 text-[11px] font-bold text-slate-950 shadow-sm shadow-sky-500/30"
          >
            G
          </span>
          <span>GitDealFlow</span>
          <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-sky-400">
            signals
          </span>
        </Link>

        {/* Hamburger button, mobile only. p-3 pads the 20px icon to a 44px hit area. */}
        <button
          className="md:hidden text-gray-300 hover:text-white p-3 -mr-2 rounded-md hover:bg-slate-800/60 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Desktop nav */}
        <nav aria-label="Primary" className="hidden md:flex items-center gap-1">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            const isDashboard = item.href === "/dashboard";
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`text-sm transition-colors px-2.5 py-1.5 rounded-md ${
                  active
                    ? "text-gray-100 bg-slate-800/70"
                    : isDashboard
                    ? "text-sky-400 hover:text-sky-300 font-medium"
                    : "text-gray-400 hover:text-gray-100 hover:bg-slate-800/40"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          {/* Site search: links to the SSR /search results page (works
              without JS; matches the WebSite SearchAction target). */}
          <Link
            href="/search"
            aria-label="Search the site"
            title="Search"
            className="text-gray-400 hover:text-gray-100 hover:bg-slate-800/40 transition-colors px-2.5 py-1.5 rounded-md"
          >
            <svg
              className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                  aria-hidden="true"
                >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </Link>
          <Link
            href="https://gitdealflow.com/#signup"
            className="ml-2 inline-flex items-center gap-1 text-sm bg-[#ff6b1a] hover:bg-[#ff8c4d] text-slate-950 px-3 py-1.5 rounded-md transition-colors font-semibold shadow-sm shadow-[#ff6b1a]/30"
          >
            See This Week&rsquo;s Signals
            <span aria-hidden="true">→</span>
          </Link>
        </nav>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav aria-label="Mobile" className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 flex flex-col gap-0.5">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            const isDashboard = item.href === "/dashboard";
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`text-sm transition-colors py-2.5 px-3 rounded-md ${
                  active
                    ? "text-gray-100 bg-slate-800/70 font-medium"
                    : isDashboard
                    ? "text-sky-400 hover:text-sky-300 font-medium hover:bg-slate-800/60"
                    : "text-gray-400 hover:text-gray-100 hover:bg-slate-800/60"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/search"
            onClick={() => setOpen(false)}
            className="text-gray-400 hover:text-gray-100 hover:bg-slate-800/60 transition-colors py-2.5 px-3 rounded-md inline-flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
            Search
          </Link>
          <Link
            href="https://gitdealflow.com/#signup"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-1 text-sm bg-[#ff6b1a] hover:bg-[#ff8c4d] text-slate-950 px-3 py-2.5 rounded-md transition-colors font-semibold"
          >
            See This Week&rsquo;s Signals
            <span aria-hidden="true">→</span>
          </Link>
        </nav>
      )}
    </header>
  );
}
