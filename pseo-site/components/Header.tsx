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
  name: NAV.map((n) => n.label),
  url: NAV.map((n) =>
    n.href.startsWith("http") ? n.href : `${SITE}${n.href}`
  ),
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
          href="https://gitdealflow.com"
          className="flex items-center gap-2 text-gray-100 font-semibold text-base tracking-tight hover:text-sky-400 transition-colors"
        >
          <span
            aria-hidden="true"
            className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-sky-500 to-indigo-600 text-[11px] font-bold text-slate-950 shadow-sm shadow-sky-500/30"
          >
            G
          </span>
          <span>VC Deal Flow Signal</span>
        </Link>

        {/* Hamburger button — mobile only */}
        <button
          className="md:hidden text-gray-300 hover:text-white p-1.5 -mr-1.5 rounded-md hover:bg-slate-800/60 transition-colors"
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
        <nav className="hidden md:flex items-center gap-1">
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
          <Link
            href="https://gitdealflow.com/#signup"
            className="ml-2 inline-flex items-center gap-1 text-sm bg-sky-600 hover:bg-sky-500 text-white px-3 py-1.5 rounded-md transition-colors font-medium shadow-sm shadow-sky-500/20"
          >
            See This Week&rsquo;s Signals
            <span aria-hidden="true">→</span>
          </Link>
        </nav>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="md:hidden border-t border-slate-800 bg-slate-950 px-4 py-3 flex flex-col gap-0.5">
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
            href="https://gitdealflow.com/#signup"
            onClick={() => setOpen(false)}
            className="mt-2 inline-flex items-center justify-center gap-1 text-sm bg-sky-600 hover:bg-sky-500 text-white px-3 py-2.5 rounded-md transition-colors font-medium"
          >
            See This Week&rsquo;s Signals
            <span aria-hidden="true">→</span>
          </Link>
        </nav>
      )}
    </header>
  );
}
