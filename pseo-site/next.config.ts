import type { NextConfig } from "next";
import * as path from "node:path";

const nextConfig: NextConfig = {
  // Pin turbopack root to this package so worktree builds (and any nested
  // checkout layout) don't drift to a parent lockfile. Harmless on Vercel —
  // the production root resolves to the same directory.
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return [
      {
        source: "/.well-known/llms.txt",
        destination: "/llms.txt",
      },
      {
        source: "/AGENTS.md",
        destination: "/agents.md",
      },
      {
        source: "/openapi.json",
        destination: "/api/openapi.json",
      },
      {
        source: "/.well-known/llms-full.txt",
        destination: "/llms-full.txt",
      },
      {
        source: "/.well-known/qa.jsonl",
        destination: "/qa.jsonl",
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/startups-to-watch/:sector([a-z0-9-]+)-q2-2025",
        destination: "/startups-to-watch/:sector-q3-2025",
        permanent: true,
      },
      {
        source: "/icon",
        destination: "/icon.png",
        permanent: true,
      },
      {
        source: "/apple-icon",
        destination: "/apple-icon.png",
        permanent: true,
      },
      {
        source: "/signals/commit-velocity",
        destination: "/signals/define/commit-velocity",
        permanent: true,
      },
      {
        source: "/signals/commit-velocity-change",
        destination: "/signals/define/commit-velocity-change",
        permanent: true,
      },
      {
        source: "/signals/contributor-growth",
        destination: "/signals/define/contributor-growth",
        permanent: true,
      },
      {
        source: "/startups-to-watch",
        destination: "/",
        permanent: true,
      },
      {
        source: "/signals/engineering-hiring-burst",
        destination: "/signals/define/engineering-hiring-burst",
        permanent: true,
      },
    ];
  },

  async headers() {
    // Crawler-friendly SWR for HTML: edge serves hot copies for 5 minutes
    // and stale copies (with background revalidation) for up to a day.
    // Replaces Next.js's implicit `max-age=0, must-revalidate` default,
    // which forces every crawler to round-trip on every fetch.
    //
    // Why next.config.ts and not proxy.ts: middleware can't override the
    // Cache-Control header on prerendered (`x-vercel-cache: PRERENDER`)
    // routes — Next.js bakes the header into the build artifact. Headers
    // configured here are applied at the platform layer and DO override
    // the build-time default.
    const swrCache = {
      key: "Cache-Control",
      value: "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
    };
    // Auth-gated HTML must NEVER land on a shared CDN node — rendered
    // content is per-user.
    const noCache = {
      key: "Cache-Control",
      value: "private, no-cache, no-store, max-age=0, must-revalidate",
    };
    const securityHeaders = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "X-Frame-Options", value: "DENY" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      {
        key: "Permissions-Policy",
        value: "camera=(), microphone=(), geolocation=()",
      },
      {
        key: "Strict-Transport-Security",
        value: "max-age=63072000; includeSubDomains; preload",
      },
      {
        key: "Content-Security-Policy",
        value: [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' https://eu.i.posthog.com https://eu-assets.i.posthog.com",
          "style-src 'self' 'unsafe-inline'",
          "img-src 'self' data: https:",
          "font-src 'self'",
          "connect-src 'self' https://eu.i.posthog.com https://eu.posthog.com https://eu-assets.i.posthog.com https://api.resend.com",
          "frame-ancestors 'none'",
        ].join("; "),
      },
    ];
    return [
      // 1) Security headers everywhere.
      { source: "/(.*)", headers: securityHeaders },
      // 2) SWR Cache-Control for non-API HTML. Negative lookahead excludes
      //    /api/* (route handlers set their own cache policy) and /_next/*
      //    (immutable assets with their own immutable cache).
      { source: "/((?!api/|_next/).*)", headers: [swrCache] },
      // 3) Override SWR for auth-gated subtrees. Each prefix needs both
      //    an exact match and a wildcard child match because path-to-regexp
      //    `:path*` doesn't match the bare prefix on its own.
      { source: "/account", headers: [noCache] },
      { source: "/account/:path*", headers: [noCache] },
      { source: "/dashboard", headers: [noCache] },
      { source: "/dashboard/:path*", headers: [noCache] },
      { source: "/login", headers: [noCache] },
      { source: "/login/:path*", headers: [noCache] },
    ];
  },
};

export default nextConfig;
