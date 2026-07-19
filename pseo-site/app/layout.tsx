import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ReadingProgressBar from "@/components/ReadingProgressBar";
import BackToTop from "@/components/BackToTop";
import LaunchBanner from "@/components/LaunchBanner";
import PixelManager from "@/components/PixelManager";
import { RootIdentitySchema } from "@/components/RootIdentitySchema";
import BreadcrumbsSchema from "@/components/BreadcrumbsSchema";
import WebVitalsReporter from "@/components/WebVitalsReporter";
import GuidedConcierge from "@/components/GuidedConcierge";
import CookieNotice from "@/components/CookieNotice";
import { NotInEmbed } from "@/components/NotInEmbed";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default:
      "VC Deal Flow Signal — Find breakout startups via GitHub momentum",
    template: "%s | VC Deal Flow Signal",
  },
  description:
    "Public engineering signals for earlier startup timing. Weekly rankings, proof pages, API access, and a reproducible methodology.",
  keywords: [
    "GitHub commit velocity",
    "venture capital alternative data",
    "startup deal flow",
    "GitHub momentum tracking",
    "code-side momentum signals",
    "engineering velocity",
    "contributor growth",
    "VC sourcing",
  ],
  metadataBase: new URL("https://signals.gitdealflow.com"),
  openGraph: {
    type: "website",
    siteName: "VC Deal Flow Signal",
  },
  alternates: {
    languages: {
      "en-US": "https://signals.gitdealflow.com",
      "x-default": "https://signals.gitdealflow.com",
    },
    types: {
      "application/rss+xml": "https://signals.gitdealflow.com/feed.xml",
      "text/plain": [
        { url: "https://signals.gitdealflow.com/llms.txt", title: "LLMs.txt" },
        {
          url: "https://signals.gitdealflow.com/llms-full.txt",
          title: "LLMs-full.txt",
        },
      ],
      "text/markdown": [
        {
          url: "https://signals.gitdealflow.com/md/",
          title: "Markdown mirror — every page available as plain Markdown at /md/{path}",
        },
      ],
      "application/x-ndjson": [
        {
          url: "https://signals.gitdealflow.com/qa.jsonl",
          title: "Q&A dataset (newline-delimited JSON, CC BY 4.0)",
        },
        {
          url: "https://signals.gitdealflow.com/api/dataset.jsonl",
          title: "Full signals dataset (newline-delimited JSON, CC BY 4.0)",
        },
      ],
    },
  },
  manifest: "https://signals.gitdealflow.com/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180" }],
    other: [
      {
        rel: "api-catalog",
        url: "https://signals.gitdealflow.com/.well-known/api-catalog",
      },
      {
        rel: "alternate",
        url: "https://signals.gitdealflow.com/.well-known/mcp.json",
      },
      {
        rel: "alternate",
        url: "https://signals.gitdealflow.com/.well-known/agent-card.json",
      },
      {
        rel: "alternate",
        url: "https://signals.gitdealflow.com/.well-known/ai-policy.json",
      },
      {
        rel: "alternate",
        url: "https://signals.gitdealflow.com/.well-known/openai-search.json",
      },
      {
        rel: "alternate",
        url: "https://signals.gitdealflow.com/api/openapi.json",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@data_nerd",
    title: "VC Deal Flow Signal — GitHub Momentum Tracking for Investors",
    description:
      "GitHub commit-velocity tracking across 20 startup sectors. Code-side momentum (not accelerator programs) — surface venture-backed startups 3–6 weeks before fundraise.",
  },
  verification: {
    google: "s-WDDQiO4arDn993LDiErqQeGIhlIgRZq67kg-NC5k8",
    yandex: "f3f5891cbff0b50f",
  },
  other: {
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
    "apple-mobile-web-app-title": "GitDealFlow",
    "format-detection": "telephone=no",
    "mobile-web-app-capable": "yes",
    "msapplication-TileColor": "#0ea5e9",
    "msapplication-config": "/browserconfig.xml",
    "theme-color": "#0f172a",
    "color-scheme": "dark light",
    "referrer": "strict-origin-when-cross-origin",
    // Per-page AI policy + content-license meta. Some LLM crawlers (Anthropic,
    // OpenAI, Perplexity) read robot-meta tags AND a parallel "ai-policy" /
    // "ai-content-license" pair. Both are emitted on every page so the
    // attribution+license terms are unambiguous regardless of entry point.
    "ai-policy": "https://signals.gitdealflow.com/.well-known/ai-policy.json",
    "ai-content-license": "https://creativecommons.org/licenses/by/4.0/",
    "ai-content-attribution":
      "VC Deal Flow Signal (GitDealFlow) — https://signals.gitdealflow.com",
    "ai-content-attribution-url": "https://signals.gitdealflow.com/about",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
  colorScheme: "dark light",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* CSP sends `require-trusted-types-for 'script'` but ships no policy,
            so any legacy innerHTML/script-src string assignment (ux.js, some
            vendor loaders) throws instead of running. Must be the first
            script in <head> — no defer/async — so it registers before
            anything else executes. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(window.trustedTypes&&trustedTypes.createPolicy){trustedTypes.createPolicy('default',{createHTML:function(s){return s;},createScript:function(s){return s;},createScriptURL:function(s){return s;}});}",
          }}
        />
        {/* Performance: connect early to high-traffic third parties. */}
        <link rel="preconnect" href="https://eu.i.posthog.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://eu-assets.i.posthog.com" />
        <link rel="dns-prefetch" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
        <link rel="dns-prefetch" href="https://gitdealflow-pb.fly.dev" />
        {/* R16 world-class UX layer — shared design system across portfolio */}
        <link rel="stylesheet" href="/ux.css" />
        <script src="/ux.js" defer />
        {/* No preconnect to fonts.gstatic.com: next/font/google self-hosts the
            Inter woff2 at build time under /_next/static/media (preloaded, same
            origin). A gstatic preconnect would open an unused DNS+TLS handshake
            and trip Lighthouse's "unused preconnect" diagnostic — there is no
            runtime request to Google Fonts to warm. */}

        {/* Agent-discoverability hints — alternate machine-readable mirrors of
            the human site. Next 16's metadata.alternates.types only emits a
            subset of MIME types reliably, so we render these directly. */}
        <link
          rel="alternate"
          type="text/plain"
          href="https://signals.gitdealflow.com/llms.txt"
          title="LLMs.txt — agent index of all canonical pages"
        />
        <link
          rel="alternate"
          type="text/plain"
          href="https://signals.gitdealflow.com/llms-full.txt"
          title="LLMs-full.txt — full content for retrieval pipelines"
        />
        <link
          rel="alternate"
          type="text/markdown"
          href="https://signals.gitdealflow.com/md/"
          title="Markdown mirror — every page available as plain Markdown at /md/{path}"
        />
        <link
          rel="alternate"
          type="application/x-ndjson"
          href="https://signals.gitdealflow.com/qa.jsonl"
          title="Q&A dataset (CC BY 4.0)"
        />
        <link
          rel="alternate"
          type="application/json"
          href="https://signals.gitdealflow.com/qa.json"
          title="Q&A dataset — single JSON document with deep-link anchors (CC BY 4.0)"
        />
        <link
          rel="alternate"
          type="application/x-bibtex"
          href="https://signals.gitdealflow.com/research/citations.bib"
          title="BibTeX citations — paper, dataset, 30 atomic findings (CC BY 4.0)"
        />
        <link
          rel="alternate"
          type="text/plain"
          href="https://signals.gitdealflow.com/agents.txt"
          title="agents.txt — autonomous agent policy"
        />
        <link
          rel="alternate"
          type="application/json"
          href="https://signals.gitdealflow.com/.well-known/openai-search.json"
          title="OpenAI search-discovery descriptor"
        />
        <link
          rel="alternate"
          type="application/x-ndjson"
          href="https://signals.gitdealflow.com/api/dataset.jsonl"
          title="Full signals dataset (CC BY 4.0)"
        />
        <link
          rel="alternate"
          type="application/json"
          href="https://signals.gitdealflow.com/.well-known/ai-policy.json"
          title="AI Policy (machine-readable per-agent permissions)"
        />
        <link
          rel="search"
          type="application/json"
          href="https://signals.gitdealflow.com/api/llms-search?q={searchTerms}"
          title="VC Deal Flow Signal — JSON search for AI agents"
        />
        <link
          rel="search"
          type="application/opensearchdescription+xml"
          href="https://signals.gitdealflow.com/opensearch.xml"
          title="VC Deal Flow Signal — Search venture-backed startups"
        />
        <link
          rel="alternate"
          type="text/csv"
          href="https://signals.gitdealflow.com/qa.csv"
          title="Q&A dataset (CSV alternate, CC BY 4.0)"
        />
        <link
          rel="alternate"
          type="text/plain"
          href="https://signals.gitdealflow.com/sitemap.txt"
          title="Plain-text sitemap"
        />
        {/* Modern RSS sibling. Inoreader, NetNewsWire, FeedBin, and most LLM
            feed-pipelines prefer JSON Feed v1.1 over XML RSS. */}
        <link
          rel="alternate"
          type="application/feed+json"
          href="https://signals.gitdealflow.com/feed.json"
          title="JSON Feed v1.1 — blog updates"
        />
        {/* Federated-graph discovery: WebFinger + NodeInfo let Mastodon, Lemmy,
            and IndieWeb crawlers find canonical entity metadata. */}
        <link
          rel="alternate"
          type="application/jrd+json"
          href="https://signals.gitdealflow.com/.well-known/webfinger?resource=acct:signals@gitdealflow.com"
          title="WebFinger (RFC 7033)"
        />
        <link
          rel="alternate"
          type="application/json"
          href="https://signals.gitdealflow.com/.well-known/nodeinfo"
          title="NodeInfo discovery"
        />
        <link
          rel="describedby"
          type="application/ld+json"
          href="https://signals.gitdealflow.com/.well-known/dataset.json"
          title="DCAT 3 dataset catalog descriptor"
        />
        <link
          rel="describedby"
          type="application/json"
          href="https://signals.gitdealflow.com/.well-known/model.json"
          title="Model card — capabilities, evaluation, limitations, agent entrypoints"
        />
        <link
          rel="describedby"
          type="application/json"
          href="https://signals.gitdealflow.com/.well-known/compliance.json"
          title="Compliance descriptor — GDPR / CCPA / SOC2 posture, subprocessors, DPA contact"
        />
        {/* Content licensing for AI training, RAG, citation, fine-tuning.
            `rel=license` is RFC 8288 standard; the JSON-typed alternates
            add machine-readable use-mode permissions and exclusions.
            Crawlers that respect TDM Reservation Protocol resolve the
            JSON form via /.well-known/tdm-reservation.json's tdm-policy
            field. F39 audit closed gap "no machine-readable AI license
            file" / "no TDM Reservation Protocol" / "no GPC advertisement". */}
        <link
          rel="license"
          href="https://creativecommons.org/licenses/by/4.0/"
          title="Creative Commons Attribution 4.0 International"
        />
        <link
          rel="describedby"
          type="application/json"
          href="https://signals.gitdealflow.com/.well-known/ai-content-license.json"
          title="AI content license — training, inference, citation, fine-tune permissions"
        />
        <link
          rel="describedby"
          type="application/json"
          href="https://signals.gitdealflow.com/.well-known/tdm-reservation.json"
          title="W3C TDM Reservation Protocol — machine-readable opt-in for text-and-data-mining"
        />
        <link
          rel="describedby"
          type="application/json"
          href="https://signals.gitdealflow.com/.well-known/gpc.json"
          title="Global Privacy Control — publisher honors Sec-GPC: 1"
        />
        <link
          rel="author"
          type="text/plain"
          href="https://signals.gitdealflow.com/humans.txt"
        />
        {/* F38 (2026-05-08) — explicit content license declaration. Surfaces
            in Google Search Central reports as a structured trust signal and
            is consumed by AI-content-licensing crawlers (CCC, Anthropic-Web,
            etc.) without requiring JSON-LD parsing. */}
        <link
          rel="license"
          href="https://creativecommons.org/licenses/by/4.0/"
          title="CC BY 4.0 — site content, datasets, and JSON-LD output"
        />
        <link
          rel="alternate"
          type="text/html"
          href="https://signals.gitdealflow.com/trust"
          title="Trust Center — privacy, security, compliance hub"
        />
        <link
          rel="alternate"
          type="text/html"
          href="https://signals.gitdealflow.com/privacy"
          title="Privacy Policy"
        />
        <link
          rel="alternate"
          type="text/html"
          href="https://signals.gitdealflow.com/terms"
          title="Terms of Service"
        />
        {/* IndieWeb / IndieAuth verification. Each rel=me must be reciprocated
            on the destination profile to count as a verified identity link.
            ORCID + Wikidata + X + GitHub + LinkedIn + npm cover the canonical
            graph of the project's authorship. */}
        <link rel="me" href="https://orcid.org/0009-0002-2222-4112" />
        <link rel="me" href="https://www.wikidata.org/wiki/Q139376302" />
        <link rel="me" href="https://x.com/data_nerd" />
        <link rel="me" href="https://github.com/kindrat86/mcp-deal-flow-signal" />
        <link rel="me" href="https://www.linkedin.com/company/gitdealflow" />
        <link rel="me" href="https://www.npmjs.com/~thedatanerd" />
        <link rel="me" href="https://t.me/gitdealflow" />
        <link rel="me" href="mailto:signals@gitdealflow.com" />
        {/* Site-wide hreflang removed: every page-level emission via
            <HreflangLinks/> is now authoritative and contextual. Layout-level
            entries pointed to root for every page, conflicting with the
            per-page canonical and breaking Google's bidirectional check. */}
        <link
          rel="alternate"
          type="application/ld+json"
          href="https://signals.gitdealflow.com/knowledge-graph.json"
          title="Canonical knowledge graph (JSON-LD entity map)"
        />
        <link
          rel="alternate"
          type="application/json"
          href="https://signals.gitdealflow.com/api/answer?q={question}"
          title="Direct Q→A API for AI agents"
        />
        <link
          rel="alternate"
          type="application/json"
          href="https://signals.gitdealflow.com/api/ask?q={query}"
          title="Multi-result fuzzy answer search"
        />
        <RootIdentitySchema />
        <BreadcrumbsSchema />
      </head>
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-950 text-gray-100`}>
        <ReadingProgressBar />
        {/* Site chrome (Header, Footer, LaunchBanner, retargeting pixels,
            PostHog/RefGrow, web-vitals beacon) is gated off on iframe-embed
            surfaces — `/embed/<widget>/...` paths render only `<main>` so
            the calculator widgets and mini-leaderboards fit inside a
            Substack/Ghost/WordPress column without bleeding the site
            chrome into the embedder. `/embed` (docs index) keeps its
            chrome because users browse there standalone. Contract:
            components/NotInEmbed.tsx. */}
        <NotInEmbed>
          <LaunchBanner />
          <Header />
        </NotInEmbed>
        <main className="flex-1">{children}</main>
        <NotInEmbed>
          <Footer />
          <GuidedConcierge />
          <Script
            id="posthog"
            strategy="lazyOnload"
            dangerouslySetInnerHTML={{
              __html: `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+" (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init('phc_lyZCgvTpicjLzAO3rY2GhxuX5WUc5jQjP8ZVwwJqauX',{api_host:'https://eu.i.posthog.com',persistence:'localStorage+cookie',cross_subdomain_cookie:true,respect_dnt:true,person_profiles:'identified_only',before_send:function(event){if(!event||!event.properties)return event;var SELF=/(^|\\.)gitdealflow\\.com$/i;var props=event.properties;function isSelf(host){if(!host)return false;try{return SELF.test(String(host).replace(/^https?:\\/\\//,'').split('/')[0]);}catch(e){return false;}}if(isSelf(props.$referring_domain)){props.$referrer='$direct';props.$referring_domain='$direct';}if(isSelf(props.$initial_referring_domain)){props.$initial_referrer='$direct';props.$initial_referring_domain='$direct';}return event;}});`,
            }}
          />
          <Script
            id="refgrow"
            src="https://scripts.refgrowcdn.com/latest.js"
            data-project-id="829"
            strategy="lazyOnload"
          />
          <PixelManager />
          {/* Core Web Vitals beacon — ships LCP/INP/CLS/FCP/TTFB to the
              existing PostHog EU instance. Closes the audit gap "no CWV
              measurement" (Performance: 75/100 → measurable). Honors GPC
              and DNT, no new dependency. */}
          <WebVitalsReporter />
          <CookieNotice />
          <BackToTop />
        </NotInEmbed>
      
        {/* Cross-Portfolio Network Footer */}
        <div dangerouslySetInnerHTML={{ __html: `<!-- CROSS-PORTFOLIO NETWORK FOOTER — generated 2026-07-18 -->
<style>
.portfolio-network {
    max-width: 1200px;
    margin: 4rem auto 2rem;
    padding: 2rem 1.5rem;
    border-top: 1px solid #e5e7eb;
    font-family: system-ui, -apple-system, sans-serif;
}
.portfolio-network h3 {
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #9ca3af;
    margin: 0 0 1rem;
    text-align: center;
}
.network-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 0.75rem;
}
.network-card {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 8px;
    text-decoration: none;
    transition: background 0.15s;
    background: #f9fafb;
}
.network-card:hover {
    background: #f3f4f6;
}
.network-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex-shrink: 0;
}
.network-name {
    font-size: 0.8125rem;
    font-weight: 600;
    color: #111827;
    white-space: nowrap;
}
.network-tagline {
    font-size: 0.6875rem;
    color: #9ca3af;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
/* Dark mode */
@media (prefers-color-scheme: dark) {
    .portfolio-network { border-top-color: #374151; }
    .portfolio-network h3 { color: #6b7280; }
    .network-card { background: #1f2937; }
    .network-card:hover { background: #374151; }
    .network-name { color: #f9fafb; }
    .network-tagline { color: #6b7280; }
}
</style>
<section class="portfolio-network">
    <h3>🚀 Explore Our Network</h3>
    <nav class="network-grid" aria-label="Portfolio network">
            <a href="https://gitdealflow.com" class="network-card" 
               title="GitDealFlow: Track startup acquisitions & funding rounds">
                <span class="network-dot" style="background:#10B981"></span>
                <span class="network-name">GitDealFlow</span>
                <span class="network-tagline">Data & Analytics</span>
            </a>
            <a href="https://signals.gitdealflow.com" class="network-card" 
               title="Signals by GitDealFlow: AI-powered startup investment signals">
                <span class="network-dot" style="background:#3B82F6"></span>
                <span class="network-name">Signals by GitDealFlow</span>
                <span class="network-tagline">AI & Investing</span>
            </a>
            <a href="https://invisibleexit.com" class="network-card" 
               title="Invisible Exit: Acquisition readiness for bootstrapped SaaS">
                <span class="network-dot" style="background:#8B5CF6"></span>
                <span class="network-name">Invisible Exit</span>
                <span class="network-tagline">SaaS & M&A</span>
            </a>
            <a href="https://sipiteno.com" class="network-card" 
               title="SipiTeno: AI Agents for SaaS Operations">
                <span class="network-dot" style="background:#F59E0B"></span>
                <span class="network-name">SipiTeno</span>
                <span class="network-tagline">AI Agents & Automation</span>
            </a>
            <a href="https://unlocksaas.com" class="network-card" 
               title="UnlockSaaS: Launch your SaaS in 60 days">
                <span class="network-dot" style="background:#EC4899"></span>
                <span class="network-name">UnlockSaaS</span>
                <span class="network-tagline">SaaS Building</span>
            </a>
            <a href="https://voicelogpro.com" class="network-card" 
               title="VoiceLogPro: Voice-to-insight for field teams">
                <span class="network-dot" style="background:#06B6D4"></span>
                <span class="network-name">VoiceLogPro</span>
                <span class="network-tagline">Voice AI & Field Ops</span>
            </a>
            <a href="https://carshake.online" class="network-card" 
               title="CarShake: Valet-damage-proof vehicle handover">
                <span class="network-dot" style="background:#EF4444"></span>
                <span class="network-name">CarShake</span>
                <span class="network-tagline">Automotive & Insurance</span>
            </a>
            <a href="https://churnlens.site" class="network-card" 
               title="ChurnLens: Churn analytics that predict, not just report">
                <span class="network-dot" style="background:#6366F1"></span>
                <span class="network-name">ChurnLens</span>
                <span class="network-tagline">SaaS Analytics</span>
            </a>
            <a href="https://sanctionsai.dev" class="network-card" 
               title="SanctionsAI: AI agent payment compliance">
                <span class="network-dot" style="background:#DC2626"></span>
                <span class="network-name">SanctionsAI</span>
                <span class="network-tagline">Compliance & Fintech</span>
            </a>
            <a href="https://sipi.bot" class="network-card" 
               title="Sipi.bot: AI spend firewall for agent payments">
                <span class="network-dot" style="background:#14B8A6"></span>
                <span class="network-name">Sipi.bot</span>
                <span class="network-tagline">AI Infrastructure</span>
            </a>
    </nav>
</section>` }} />
        {/* Brunson Trust Bar — Dotcom Secrets Ch 7 */}
        <div dangerouslySetInnerHTML={{ __html: `<!-- BRUNSON TRUST BAR -- idempotency:trust-bar-v1 -->
<section class="brunson-trust-bar" style="background:linear-gradient(135deg, #0f172a, #1e293b);color:#e8eaed;padding:40px 24px;margin:60px 0 0;border-top:3px solid #00d4aa;text-align:center;font-family:-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif">
  <div style="max-width:900px;margin:0 auto">
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:28px;margin-bottom:28px">
      <div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">47 days</span><br><span style="font-size:.82rem;color:#94a3b8">Avg Signal Lead Time</span></div>
      <div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">$80M+</span><br><span style="font-size:.82rem;color:#94a3b8">Rounds Tracked</span></div>
      <div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">90 sec</span><br><span style="font-size:.82rem;color:#94a3b8">Per Scan</span></div>
      <div><span style="font-size:1.6rem;font-weight:700;color:#00d4aa">5,000+</span><br><span style="font-size:.82rem;color:#94a3b8">Founders Tracked</span></div>
    </div>
    <p style="font-size:1.05rem;margin-bottom:24px;color:#cbd5e1">One missed signal is a missed round. Get the Velocity Verdict in your inbox every Sunday free.</p>
    <a href="https://signals.gitdealflow.com/#signup" style="display:inline-block;background:linear-gradient(135deg,#00d4aa,#2deec0);color:#04130e;padding:14px 32px;border-radius:12px;font-weight:700;text-decoration:none;font-size:.95rem;box-shadow:0 8px 24px -10px rgba(0,212,170,.5)">Get Free Signals</a>
    <p style="margin-top:18px;font-size:.78rem;color:#6b7178">Free weekly digest. Cancel anytime. No spam, no VC pitches just data.</p>
  </div>
</section>` }} />
      </body>
    </html>
  );
}
