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
    // Extension-stripped aliases for /api/v1/* — generic agents that infer
    // REST conventions and strip ".json" from URLs hit 404 without these.
    // Each alias is a routing-layer rewrite (NOT alias-via-import — that
    // pattern silently breaks under force-static; see Pass VIII memo).
    const v1Aliases = [
      { from: "/api/v1/signals", to: "/api/v1/signals.json" },
      { from: "/api/v1/agents", to: "/api/v1/agents.json" },
      { from: "/api/v1/answers", to: "/api/v1/answers.json" },
      { from: "/api/v1/changelog", to: "/api/v1/changelog.json" },
      { from: "/api/v1/faq", to: "/api/v1/faq.json" },
      { from: "/api/v1/glossary", to: "/api/v1/glossary.json" },
      { from: "/api/v1/methodology", to: "/api/v1/methodology.json" },
      { from: "/api/v1/openapi", to: "/api/v1/openapi.json" },
      { from: "/api/v1/pricing", to: "/api/v1/pricing.json" },
      { from: "/api/v1/uptime", to: "/api/v1/uptime.json" },
      { from: "/api/v1/citations", to: "/api/v1/citations.json" },
      { from: "/api/v1/dataset", to: "/api/v1/dataset.jsonl" },
      // Charter Cohort 2026 — Brunson Expert Secrets §1 Ch 4 (Mass
      // Movement Vehicle) + DCS Ch 13 (Best Bait, agent-side). Mirrors
      // /members hub as JSON for crawlers, agents, and MCP hosts.
      { from: "/api/v1/members", to: "/api/v1/members.json" },
      // Platform-native opener variants — Brunson Traffic Secrets §1
      // Ch 3 (Hook, Story, Offer × Hidden Campaign). Twelve openers
      // resolving the universal product story per platform. Backs the
      // /distribution/platform-hooks HTML surface and is consumed by
      // the daily-briefing pipeline + agent retrieval.
      { from: "/api/v1/platform-hooks", to: "/api/v1/platform-hooks.json" },
      // Playbooks — operator how-tos shipped 2026-05-22. Same shape as
      // /api/v1/answers; mirrors content/playbooks.ts into a JSON corpus
      // for RAG ingestion alongside the answers corpus.
      { from: "/api/v1/playbooks", to: "/api/v1/playbooks.json" },
    ].map(({ from, to }) => ({ source: from, destination: to }));

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
      ...v1Aliases,
    ];
  },

  async redirects() {
    return [
      {
        source: "/perfect-webinar/5min",
        destination: "/walkthrough/5min",
        permanent: true,
      },
      {
        source: "/perfect-webinar/90s",
        destination: "/walkthrough/90s",
        permanent: true,
      },
      {
        source: "/perfect-webinar/quick",
        destination: "/walkthrough/quick",
        permanent: true,
      },
      {
        source: "/perfect-webinar",
        destination: "/walkthrough",
        permanent: true,
      },
      {
        source: "/dream-100",
        destination: "/target-list",
        permanent: true,
      },
      {
        source: "/affiliates/dream-50",
        destination: "/affiliates/top-partners",
        permanent: true,
      },
      {
        source: "/summit/big-domino-engineering-acceleration",
        destination: "/summit/core-claim-engineering-acceleration",
        permanent: true,
      },
      {
        source: "/summit/icp-engineering-dream-100-by-github",
        destination: "/summit/icp-engineering-target-list-by-github",
        permanent: true,
      },
      {
        source: "/summit/stadium-pitch-falsifiable-predictions",
        destination: "/summit/state-of-engine-falsifiable-predictions",
        permanent: true,
      },
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
      {
        source: "/integrations/best-mcp-server-for-vc-research",
        destination: "/answers/best-mcp-server-for-vc-research",
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
      // Iframe-friendly embed surfaces — re-open framing for the public
      // embed widgets so newsletter authors / blog writers can drop them
      // into Substack, Ghost, WordPress, etc. The route handlers also set
      // these headers on their Responses (belt + braces); this entry is
      // the deterministic site-config-level override.
      //
      // Listed AFTER the catch-all so Next merges + later-wins overrides
      // X-Frame-Options and CSP frame-ancestors. Other security headers
      // (HSTS, nosniff, Referrer-Policy, Permissions-Policy) inherit
      // unchanged.
      {
        source: "/embed/weekly",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOWALL",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self'",
              "frame-ancestors *",
            ].join("; "),
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      {
        source: "/embed/leaderboard/:slug*",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOWALL",
          },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self'",
              "frame-ancestors *",
            ].join("; "),
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
