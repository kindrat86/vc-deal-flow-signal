import type { Metadata } from "next";
import Script from "next/script";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PixelManager from "@/components/PixelManager";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: {
    default: "VC Deal Flow Signal — Startup Engineering Acceleration Tracker",
    template: "%s | VC Deal Flow Signal",
  },
  description:
    "Track startup engineering acceleration by sector. GitHub commit velocity, contributor growth, and breakout signals for investors.",
  metadataBase: new URL("https://signals.gitdealflow.com"),
  openGraph: {
    type: "website",
    siteName: "VC Deal Flow Signal",
  },
  alternates: {
    types: {
      "application/rss+xml": "https://signals.gitdealflow.com/feed.xml",
      "text/plain": [
        { url: "https://signals.gitdealflow.com/llms.txt", title: "LLMs.txt" },
      ],
    },
  },
  twitter: {
    card: "summary_large_image",
    site: "@data_nerd",
    title: "VC Deal Flow Signal — Startup Engineering Acceleration Tracker",
    description:
      "Track startup engineering acceleration by sector. GitHub commit velocity, contributor growth, and breakout signals for investors.",
  },
  verification: {
    google: "s-WDDQiO4arDn993LDiErqQeGIhlIgRZq67kg-NC5k8",
    yandex: "f3f5891cbff0b50f",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} min-h-full flex flex-col bg-slate-950 text-gray-100`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Script
          id="posthog"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+" (stub)"},o="init capture register register_once register_for_session unregister unregister_for_session getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty createPersonProfile opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);posthog.init('phc_lyZCgvTpicjLzAO3rY2GhxuX5WUc5jQjP8ZVwwJqauX',{api_host:'https://eu.i.posthog.com',persistence:'memory',person_profiles:'identified_only'});`,
          }}
        />
        <PixelManager />
      </body>
    </html>
  );
}
