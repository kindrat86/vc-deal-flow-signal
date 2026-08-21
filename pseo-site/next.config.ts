import type { NextConfig } from "next";
import * as path from "node:path";
import { readFileSync } from "node:fs";

// Historical /best/ redirects are DATA-DERIVED (2026-08-19, quarterly
// freshness fix): scripts/generate-best-redirects.ts writes
// data/best-redirects.json in prebuild from data/startups.json, and
// verify-no-regressions.ts fails any tree where the JSON drifted from the
// data or where a /best/ redirect is hardcoded. Before this, the five
// hardcoded Q2-freeze redirects silently shadowed five live Q3 pages.
const bestRedirects: { source: string; destination: string }[] = (() => {
  try {
    return JSON.parse(
      readFileSync(path.join(__dirname, "data", "best-redirects.json"), "utf8"),
    ).redirects;
  } catch {
    return []; // missing only in bare dev checkouts; the prebuild guard owns correctness
  }
})();

const nextConfig: NextConfig = {
  // Pin turbopack root to this package so worktree builds (and any nested
  // checkout layout) don't drift to a parent lockfile. Harmless on Vercel -
  // the production root resolves to the same directory.
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    // Extension-stripped aliases for /api/v1/*, generic agents that infer
    // REST conventions and strip ".json" from URLs hit 404 without these.
    // Each alias is a routing-layer rewrite (NOT alias-via-import, that
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
      // Charter Cohort 2026, Brunson Expert Secrets §1 Ch 4 (Mass
      // Movement Vehicle) + DCS Ch 13 (Best Bait, agent-side). Mirrors
      // /members hub as JSON for crawlers, agents, and MCP hosts.
      { from: "/api/v1/members", to: "/api/v1/members.json" },
      // Platform-native opener variants, Brunson Traffic Secrets §1
      // Ch 3 (Hook, Story, Offer × Hidden Campaign). Twelve openers
      // resolving the universal product story per platform. Backs the
      // /distribution/platform-hooks HTML surface and is consumed by
      // the daily-briefing pipeline + agent retrieval.
      { from: "/api/v1/platform-hooks", to: "/api/v1/platform-hooks.json" },
      // Playbooks, operator how-tos shipped 2026-05-22. Same shape as
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
        destination: "/agents",
      },
      {
        source: "/agents.md",
        destination: "/agents",
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
        // Consolidate thin noindex /compare cross mirrors into their rich
        // /vs/ twins (2026-08-16). The mirrors still earned GSC impressions
        // (868/482/210/115 in 90d) while splitting ranking signals against
        // the /vs/ pages that hold positions 4-8 for the same queries.
        // Generation was removed in content/comparisons.ts; these 301s
        // forward the old URLs (and any equity/backlinks) to the twins.
        source: "/compare/pitchbook-vs-cb-insights",
        destination: "/vs/pitchbook-vs-cb-insights",
        permanent: true,
      },
      {
        source: "/compare/crunchbase-vs-cb-insights",
        destination: "/vs/cb-insights-vs-crunchbase",
        permanent: true,
      },
      {
        // Reverse /compare/ mirror for the same pair (was a 404 trust leak).
        // Both word-orders consolidate onto the natural-order canonical.
        source: "/compare/cb-insights-vs-crunchbase",
        destination: "/vs/cb-insights-vs-crunchbase",
        permanent: true,
      },
      {
        source: "/compare/pitchbook-vs-crunchbase",
        destination: "/vs/crunchbase-vs-pitchbook",
        permanent: true,
      },
      {
        source: "/compare/crunchbase-vs-dealroom",
        destination: "/vs/dealroom-vs-crunchbase",
        permanent: true,
      },
      {
        source: "/compare/pitchbook-vs-dealroom",
        destination: "/vs/dealroom-vs-pitchbook",
        permanent: true,
      },
      {
        source: "/compare/harmonic-ai-vs-dealroom",
        destination: "/vs/harmonic-ai-vs-dealroom",
        permanent: true,
      },
      {
        source: "/compare/harmonic-ai-vs-forager-ai",
        destination: "/vs/harmonic-ai-vs-forager-ai",
        permanent: true,
      },
      {
        // Thin programmatic twin of the rich editorial Affinity page
        // (2026-08-16). Both ranked for "vc deal flow signal vs affinity"
        // (twin pos 20.7/16 imps vs editorial pos 7.9/284 imps). Generation
        // stopped in content/comparisons.ts (programmaticVsExcluded); this
        // 301 consolidates the twin's equity into the editorial page.
        source: "/compare/vc-deal-flow-signal-vs-affinity",
        destination: "/compare/vc-deal-flow-signal-vs-affinity-relationship-intelligence",
        permanent: true,
      },
      {
        // /contact never existed as a page; contact happens via
        // signals@gitdealflow.com (surfaced on /about). Investors, AI
        // crawlers, and diligence flows probing the conventional /contact
        // URL hit a 404 trust leak. 308 to the strongest identity page
        // instead (added 2026-08-15, live-audit finding).
        source: "/contact",
        destination: "/about",
        permanent: true,
      },
      {
        // ---- §22 template retirement, 2026-08-16 (pSEO audit Win: kill the
        // two weakest templates). GSC 90d evidence: /define/* = 125 URLs,
        // 2,940 impressions, 1 click, positions 57-93 on dictionary head
        // terms we never win (Investopedia/Wikipedia own them); the /glossary
        // hub already renders every term as an anchored DefinedTerm, so the
        // 134 deep pages were a thin duplicate layer. /idea-of-the-day/* =
        // hub + ~105 archive pages, 129 impressions, 0 clicks (40 URLs got
        // impressions at all). Generation removed (app/define, app/idea-of-
        // the-day, lib/ideas-of-the-day, generator script, og route); these
        // 301s preserve equity and keep every old URL working.
        source: "/define",
        destination: "/glossary",
        permanent: true,
      },
      {
        source: "/define/:term",
        destination: "/glossary#:term",
        permanent: true,
      },
      {
        source: "/idea-of-the-day",
        destination: "/startup-ideas",
        permanent: true,
      },
      {
        source: "/idea-of-the-day/:date",
        destination: "/startup-ideas",
        permanent: true,
      },
      {
        // Legacy pSEO generator once shadowed the real /alternatives/[slug]
        // pages with a bare-slug static file at /vs/tracxn (removed
        // 2026-07-20, see predeploy audit). Redirect the old inbound
        // links/backlinks to the real page instead of 404ing.
        source: "/vs/tracxn",
        destination: "/alternatives/tracxn",
        permanent: true,
      },
      {
        source: "/vs/crunchbase",
        destination: "/alternatives/crunchbase",
        permanent: true,
      },
      {
        // Reverse-alias /vs/ slug (2026-08-18): the pair renders BOTH
        // directions (harmonic-ai-vs-affinity AND affinity-vs-harmonic-ai),
        // with the HTML canonical pointing at the primary. But proxy.ts adds
        // a self-referential `Link: <self>; rel=canonical` header to every
        // response, contradicting the HTML canonical. Google chose the
        // reverse URL: GSC 90d shows /vs/harmonic-ai-vs-affinity at pos 6.7
        // with 348 impressions while the primary sits unranked for the pair.
        // 308 consolidates both directions into ONE URL (same pattern as the
        // /compare/ mirror consolidation above).
        source: "/vs/harmonic-ai-vs-affinity",
        destination: "/vs/affinity-vs-harmonic-ai",
        permanent: true,
      },
      {
        // Reverse-alias direction FLIPPED 2026-08-16: GSC 90d shows Google
        // ranks /vs/cb-insights-vs-crunchbase at pos 14.4 on the dominant query
        // "cb insights vs crunchbase" vs the reversed slug at 38.7. Canonical is
        // the query-word-order slug; the reversed direction 308s into it.
        source: "/vs/crunchbase-vs-cb-insights",
        destination: "/vs/cb-insights-vs-crunchbase",
        permanent: true,
      },
      // Historical /best/ slugs (data-derived, see the bestRedirects const at
      // the top of this file). A /best/ URL that stops generating (sector
      // freeze or year rollover) keeps its GSC equity via a 308 to the
      // intent-matched quarter snapshot. Empty today (all sectors carry the
      // current period), self-maintains at every future quarter rollover.
      ...bestRedirects.map((r) => ({
        source: r.source,
        destination: r.destination,
        permanent: true,
      })),
      {
        // Legacy sitemap path (retired 2026-07-21): the "high-intent" pSEO shard
        // was consolidated into the /sitemap/[id] shards, but the old URL still
        // 404s and any stale crawler/bookmark/GSC reference points at it. 301 to
        // the canonical index instead of serving a 404 HTML page.
        source: "/sitemap-pseo.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        // Same retired-shard cleanup: /sitemap-high-intent.xml was the pre-rename
        // name of the consolidated shard.
        source: "/sitemap-high-intent.xml",
        destination: "/sitemap.xml",
        permanent: true,
      },
      {
        // /image-sitemap.xml was renamed to /sitemap-images.xml; the old URL 404s.
        // 301 stale references to the live images shard.
        source: "/image-sitemap.xml",
        destination: "/sitemap-images.xml",
        permanent: true,
      },
      {
        // Stale-count slug: the post title and body were corrected from "4,200"
        // to the real 350+-startup panel (2026-08-14), but the URL still
        // advertised "4200". 301 the old inbound links / backlinks / any
        // already-indexed URL to the corrected slug.
        source: "/blog/i-tracked-4200-startup-github-orgs-six-months",
        destination: "/blog/i-tracked-369-startup-github-orgs-six-months",
        permanent: true,
      },
      {
        // Consolidated the duplicate €1 teardown product into /teardown
        // (2026-06-01). /tweet-teardown/thanks stays for in-flight purchases.
        source: "/tweet-teardown",
        destination: "/teardown",
        permanent: true,
      },
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
      {
        // /free was a soft-404: the homepage CTA "Get the Sunday issue"
        // linked here, but no route file existed, Next.js served the 404
        // page body with a 200 status + self-canonical, creating a
        // duplicate of the homepage title (audit C5) and an indexable
        // soft-404 (audit T6). Redirect to the actual free weekly issue.
        source: "/free",
        destination: "/predicted",
        permanent: true,
      },
      // Showdown family removed 2026-06-10: ~1,582 statically generated
      // company-pair pages were 100% near-duplicates (audit:pseo) and
      // already noindexed. Slugs don't map 1:1 to /vs (different
      // namespace: tracked-company pairs vs competitor tools), so old
      // leaves consolidate into the /compare hub.
      {
        source: "/showdown",
        destination: "/compare",
        permanent: true,
      },
      {
        source: "/showdown/:slug",
        destination: "/compare",
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
              "script-src 'self' 'unsafe-inline' https://eu.i.posthog.com https://eu-assets.i.posthog.com https://scripts.refgrowcdn.com https://www.googletagmanager.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "font-src 'self'",
              "connect-src 'self' https://eu.i.posthog.com https://eu.posthog.com https://eu-assets.i.posthog.com https://api.resend.com https://scripts.refgrowcdn.com https://www.googletagmanager.com https://*.google-analytics.com https://*.analytics.google.com; frame-ancestors 'none'",
              // Added 2026-07-25 (portfolio audit): this was the only site in the
              // portfolio missing both. object-src blocks <object>/<embed> plugin
              // vectors the other directives do not cover, and base-uri stops an
              // injected <base> tag re-pointing every relative URL on the page -
              // which would defeat the script-src allowlist above by making
              // "self"-relative script paths resolve to an attacker host.
              "object-src 'none'",
              "base-uri 'self'",
              "upgrade-insecure-requests",
              "require-trusted-types-for 'script'",
            ].join("; "),
          },
          {
            key: "Cross-Origin-Opener-Policy",
            value: "same-origin",
          },
          {
            key: "Cross-Origin-Embedder-Policy",
            value: "credentialless",
          },
        ],
      },
      // Ticker embed, allow framing from any origin (embeddable widget)
      // Must come AFTER the global /(.*) rule so it overrides frame-ancestors.
      {
        source: "/ticker/embed",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *; default-src 'self'; script-src 'self' 'unsafe-inline' https://eu.i.posthog.com https://eu-assets.i.posthog.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://signals.gitdealflow.com",
          },
        ],
      },
      {
        source: "/ticker/embed/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "frame-ancestors *; default-src 'self'; script-src 'self' 'unsafe-inline' https://eu.i.posthog.com https://eu-assets.i.posthog.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self'; connect-src 'self' https://signals.gitdealflow.com",
          },
        ],
      },
      // SWR Cache-Control for non-API HTML (PR #96): edge serves hot copies
      // for 5 min and stale (background-revalidated) copies for up to a day.
      // Excludes /api/* (handlers set their own policy) and /_next/* (immutable).
      {
        source: "/((?!api/|_next/).*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, s-maxage=300, stale-while-revalidate=86400",
          },
        ],
      },
      // Auth-gated subtrees must never hit a shared CDN node, override SWR
      // with private no-store. Each prefix needs an exact + wildcard match.
      { source: "/account", headers: [{ key: "Cache-Control", value: "private, no-cache, no-store, max-age=0, must-revalidate" }] },
      { source: "/account/:path*", headers: [{ key: "Cache-Control", value: "private, no-cache, no-store, max-age=0, must-revalidate" }] },
      { source: "/dashboard", headers: [{ key: "Cache-Control", value: "private, no-cache, no-store, max-age=0, must-revalidate" }] },
      { source: "/dashboard/:path*", headers: [{ key: "Cache-Control", value: "private, no-cache, no-store, max-age=0, must-revalidate" }] },
      { source: "/login", headers: [{ key: "Cache-Control", value: "private, no-cache, no-store, max-age=0, must-revalidate" }] },
      { source: "/login/:path*", headers: [{ key: "Cache-Control", value: "private, no-cache, no-store, max-age=0, must-revalidate" }] },
      // API responses are data surfaces for agents/integrations, not SERP
      // candidates. noindex keeps raw JSON/CSV out of search results while
      // leaving crawl + fetch access fully open (AI crawlers still read them).
      {
        source: "/api/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex",
          },
        ],
      },
      // Iframe-friendly embed surfaces, re-open framing for the public
      // embed widgets so newsletter authors / blog writers can drop them
      // into Substack, Ghost, WordPress, etc. The route handlers also set
      // ── Embed widget farm, catch-all for all /embed/* paths ──
      // Covers: portfolio-network, 7 calculators, define glossary, and
      // any future embeddable widgets. After the global catch-all so
      // later-wins header merging applies frame-ancestors * correctly.
      {
        source: "/embed/:path*",
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
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
        ],
      },
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
      // Glossary definition embeds, paste-able iframe card for any of
      // the 84 /define/<term> entries. Tech blogs (Substack, Ghost,
      // WordPress, Notion handbooks) that mention a VC term drop a
      // single <iframe src="https://signals.gitdealflow.com/embed/define/<term>">
      // and get a definition card with CC BY 4.0 attribution baked into
      // the asset. generateStaticParams fans out over glossaryTerms.
      {
        source: "/embed/define/:term*",
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
      // Calculator embed widgets, same iframe-friendly contract as the
      // mini-leaderboard. Operator newsletters (Lenny's, FirstRound,
      // Sacra), founder blogs, and incubator portals drop a single
      // <iframe src="https://signals.gitdealflow.com/embed/tools/<slug>">
      // and get a working calculator with persistent attribution. Each
      // of the 8 /tools/<slug> calcs has a matching /embed/tools/<slug>
      // route via generateStaticParams.
      {
        source: "/embed/tools/:slug*",
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
              "font-src 'self' data:",
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
      // /embed.js, small loader that creates the iframe + listens for
      // the postMessage height handshake from <EmbedAutoHeight/>. Served
      // from the same origin so it can be `<script src=>`'d cross-origin
      // by embedder sites (Substack, Ghost, WordPress, Notion). The
      // route handler caches it aggressively at the CDN; this entry
      // makes the cross-origin fetch + correct Content-Type explicit.
      {
        source: "/embed.js",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
          {
            key: "Cache-Control",
            value:
              "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
