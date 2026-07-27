import type { Metadata } from "next";
import Script from "next/script";
import { Instrument_Sans, IBM_Plex_Mono } from "next/font/google";
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

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-body",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  variable: "--font-mono",
});

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
    "theme-color": "#0b1220",
    "color-scheme": "dark light",
    "referrer": "strict-origin-when-cross-origin",
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
    { media: "(prefers-color-scheme: dark)", color: "#0b1220" },
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
        <script
          dangerouslySetInnerHTML={{
            __html:
              "if(window.trustedTypes&&trustedTypes.createPolicy){trustedTypes.createPolicy('default',{createHTML:function(s){return s;},createScript:function(s){return s;},createScriptURL:function(s){return s;}});}",
          }}
        />
        <link rel="preconnect" href="https://eu.i.posthog.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://eu-assets.i.posthog.com" />
        <link rel="dns-prefetch" href="https://api.github.com" />
        <link rel="dns-prefetch" href="https://avatars.githubusercontent.com" />
        <link rel="dns-prefetch" href="https://gitdealflow-pb.fly.dev" />
        <link rel="stylesheet" href="/ux.css" />
        {/* ux.js REMOVED 2026-07-21: it calls document.body.prepend/appendChild on
            load, mutating the DOM before React (App Router) hydrates → hydration
            mismatch wiped SSR content → blank white page. Static portfolio sites
            tolerate ux.js (no React); this Next.js app must NOT load it. Do not
            re-add — the swarm R18 rollout must exclude this Next.js site. */}

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
        <link
          rel="alternate"
          type="application/feed+json"
          href="https://signals.gitdealflow.com/feed.json"
          title="JSON Feed v1.1 — blog updates"
        />
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
        <link rel="me" href="https://orcid.org/0009-0002-2222-4112" />
        <link rel="me" href="https://www.wikidata.org/wiki/Q139376302" />
        <link rel="me" href="https://x.com/data_nerd" />
        <link rel="me" href="https://github.com/kindrat86/mcp-deal-flow-signal" />
        <link rel="me" href="https://www.linkedin.com/company/gitdealflow" />
        <link rel="me" href="https://www.npmjs.com/~thedatanerd" />
        <link rel="me" href="https://t.me/gitdealflow" />
        <link rel="me" href="mailto:signals@gitdealflow.com" />
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
      <body className={`${instrumentSans.className} min-h-full flex flex-col bg-[#0b1220] text-[#e2e8f0]`}>
        <ReadingProgressBar />
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
              __html: `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+" (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init('phc_lyZCgvTpicjLzAO3rY2GhxuX5WUc5jQjP8ZVwwJqauX',{api_host:'https://eu.i.posthog.com',persistence:'localStorage+cookie',cross_subdomain_cookie:true,respect_dnt:true,person_profiles:'identified_only',before_send:function(event){if(!event||!event.properties)return event;var SELF=/(^|\\.)gitdealflow\\.com$/i;var props=event.properties;if(props.$current_url&&!SELF.test(new URL(props.$current_url).hostname))return null;return event}});`,
            }}
          />
          <Script
            id="refgrow"
            src="https://scripts.refgrowcdn.com/latest.js"
            data-project-id="829"
            strategy="lazyOnload"
          />
          <PixelManager />
          <WebVitalsReporter />
          <CookieNotice />
          <BackToTop />
        </NotInEmbed>
      </body>
    </html>
  );
}
