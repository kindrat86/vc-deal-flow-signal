"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const SITE = "https://signals.gitdealflow.com";

const NAV: readonly { href: string; label: string }[] = [
  { href: "/trending", label: "Trending" },
  { href: "/pricing", label: "Pricing" },
  { href: "/methodology", label: "Methodology" },
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
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-4 px-[clamp(16px,4vw,40px)] py-4 glass border-b border-[rgba(148,163,184,0.12)]">
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(NAV_JSONLD) }}
      />
      <Link
        href="/"
        className="flex items-center gap-2 font-semibold text-[17px] tracking-[-0.02em] text-[#f8fafc] hover:text-[#38bdf8] transition-colors"
        style={{ fontFamily: "'IBM Plex Mono', monospace" }}
      >
        <span className="w-2 h-2 rounded-full bg-[#0ea5e9] shadow-[0_0_12px_#0ea5e9]" />
        GitDealFlow
        <span className="text-[#38bdf8]">/signals</span>
      </Link>

      <nav aria-label="Primary" className="hidden md:flex items-center gap-7 text-[15px] font-medium text-[#cbd5e1]">
        {NAV.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={`transition-colors hover:text-[#f8fafc] ${
                active ? "text-[#f8fafc]" : "text-[#cbd5e1]"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3">
        <Link
          href="/pricing"
          className="hidden md:inline-flex px-[18px] py-[10px] bg-[#0ea5e9] text-[#04121f] font-semibold text-[14px] rounded-lg hover:bg-[#38bdf8] transition-colors whitespace-nowrap"
        >
          Get free signals
        </Link>
        <button
          className="md:hidden w-11 h-11 flex items-center justify-center bg-[rgba(148,163,184,0.1)] border border-[rgba(148,163,184,0.2)] rounded-lg text-[#e2e8f0] text-[20px] cursor-pointer hover:bg-[rgba(148,163,184,0.18)] transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
        >
          {open ? "×" : "☰"}
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-60 bg-[#0b1220] p-6 flex flex-col gap-1 md:hidden">
          <div className="flex justify-end mb-6">
            <button
              className="w-11 h-11 flex items-center justify-center bg-[rgba(148,163,184,0.1)] border border-[rgba(148,163,184,0.2)] rounded-lg text-[#e2e8f0] text-[22px]"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
          </div>
          {NAV.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`py-[18px] px-2 text-[22px] font-semibold border-b border-[rgba(148,163,184,0.1)] ${
                  active ? "text-[#f8fafc]" : "text-[#f1f5f9]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/pricing"
            onClick={() => setOpen(false)}
            className="mt-6 py-4 text-center bg-[#0ea5e9] text-[#04121f] font-bold text-[17px] rounded-[10px]"
          >
            Get free signals
          </Link>
        </div>
      )}
    </header>
  );
}
