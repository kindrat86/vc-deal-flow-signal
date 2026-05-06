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
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
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
        ],
      },
    ];
  },
};

export default nextConfig;
