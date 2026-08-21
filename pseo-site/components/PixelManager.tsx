import Script from "next/script";

/**
 * Centralized optional measurement loader.
 * Each optional integration is gated on its env var: empty/missing = the script
 * is not emitted.
 *
 * All vars are NEXT_PUBLIC_ because pixel IDs are public by design, they
 * appear in the page source on every ad-tracked site.
 */
export default function PixelManager() {
  // The GA4 fallback preserves the qualified-visitor bridge on archive builds
  // where NEXT_PUBLIC_* values are unavailable. Env vars win when present.
  const ga4 = process.env.NEXT_PUBLIC_GA4_ID || "G-7SV2SNZE4C";
  const googleAds = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;

  const twitter = process.env.NEXT_PUBLIC_TWITTER_PIXEL_ID;
  const tiktok = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  const reddit = process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID;
  const quora = process.env.NEXT_PUBLIC_QUORA_PIXEL_ID;
  const pinterest = process.env.NEXT_PUBLIC_PINTEREST_TAG_ID;
  const msUet = process.env.NEXT_PUBLIC_MS_UET_ID;

  const gtagId = ga4 || googleAds;

  return (
    <>

      {gtagId && (
        <>
          {/* lazyOnload (perf fix 2026-08-16): afterInteractive made Next
              inject a <link rel=preload> for gtag.js into <head>, pulling a
              third-party script into the LCP window on every page. PostHog
              (the north-star tracker) already runs lazyOnload; GA4 is the
              secondary acquisition view and can load after window.onload.
              Trade-off: sessions that bounce before load completes are not
              recorded by GA4 (PostHog still sees them). */}
          <Script
            id="gtag-loader"
            strategy="lazyOnload"
            src={`https://www.googletagmanager.com/gtag/js?id=${gtagId}`}
          />
          <Script
            id="gtag-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());${ga4 ? `gtag('config','${ga4}');` : ""}${googleAds ? `gtag('config','${googleAds}');` : ""}`,
            }}
          />
        </>
      )}

      {ga4 && (
        <Script
          id="gdf-ga4-qualifier"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){var CONV=["signup_verify_sent","beta_signup","lead_submitted","subscribed","analysis_purchased","purchase_confirmed","lead_magnet_requested","exit_intent_subscribed","tools_subscribe_submitted"];var ENG=["concierge_opened","exit_modal_opened","exit_modal_submitted"];var EVAL_RE=/(\\/pricing|\\/vs\\/|alternatives-to|\\/methodology|\\/mcp|\\/api|\\/docs)/;var qFired=false;function pushGtag(){try{window.dataLayer=window.dataLayer||[];window.dataLayer.push(Array.prototype.slice.call(arguments));}catch(e){}}function qualified(source){var K="gdf_qualified_visit";if(qFired)return;try{if(sessionStorage.getItem(K))return;sessionStorage.setItem(K,"1");}catch(e){}qFired=true;pushGtag("event","qualified_visit",{path:location.pathname,source:source||"unknown"});}function mirror(name,props){if(!name)return;var params={source:location.pathname};if(props&&typeof props==="object"){for(var k in props){var v=props[k];if(v===null||v===undefined)continue;if(typeof v==="string"||typeof v==="number"||typeof v==="boolean")params[k]=v;}}if(ENG.indexOf(name)>=0){pushGtag("event",name,params);qualified("engagement");}else if(CONV.indexOf(name)>=0){pushGtag("event",name,params);qualified("conversion");}}function wrapCapture(){var ph=window.posthog;if(!ph||!ph.__loaded||typeof ph.capture!=="function"||ph.__gdfMirrorWrapped)return;var orig=ph.capture;ph.capture=function(){try{mirror(arguments[0],arguments[1]);}catch(e){}return orig.apply(ph,arguments);};try{ph.__gdfMirrorWrapped=true;}catch(e){}}if(EVAL_RE.test(location.pathname))qualified("eval_path");wrapCapture();var tries=0;var timer=setInterval(function(){wrapCapture();if(++tries>600)clearInterval(timer);},100);})();`,
          }}
        />
      )}


      {twitter && (
        <Script
          id="twitter-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(e,t,n,s,u,a){e.twq||(s=e.twq=function(){s.exe?s.exe.apply(s,arguments):s.queue.push(arguments)},s.version='1.1',s.queue=[],u=t.createElement(n),u.async=!0,u.src='https://static.ads-twitter.com/uwt.js',a=t.getElementsByTagName(n)[0],a.parentNode.insertBefore(u,a))}(window,document,'script');twq('config','${twitter}');`,
          }}
        />
      )}

      {tiktok && (
        <Script
          id="tiktok-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e};ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=r;ttq._t=ttq._t||{};ttq._t[e]=+new Date;ttq._o=ttq._o||{};ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript";n.async=!0;n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load('${tiktok}');ttq.page()}(window,document,'ttq');`,
          }}
        />
      )}

      {reddit && (
        <Script
          id="reddit-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);rdt('init','${reddit}');rdt('track','PageVisit');`,
          }}
        />
      )}

      {quora && (
        <Script
          id="quora-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(q,e,v,n,t,s){if(q.qp)return;n=q.qp=function(){n.qp?n.qp.apply(n,arguments):n.queue.push(arguments)};n.queue=[];t=document.createElement(e);t.async=!0;t.src=v;s=document.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,'script','https://a.quora.com/qevents.js');qp('init','${quora}');qp('track','ViewContent');`,
          }}
        />
      )}

      {pinterest && (
        <Script
          id="pinterest-tag"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(e){if(!window.pintrk){window.pintrk=function(){window.pintrk.queue.push(Array.prototype.slice.call(arguments))};var n=window.pintrk;n.queue=[],n.version="3.0";var t=document.createElement("script");t.async=!0,t.src=e;var r=document.getElementsByTagName("script")[0];r.parentNode.insertBefore(t,r)}}("https://s.pinimg.com/ct/core.js");pintrk('load','${pinterest}');pintrk('page');`,
          }}
        />
      )}

      {msUet && (
        <Script
          id="ms-uet"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,t,r,u){var f,n,i;w[u]=w[u]||[],f=function(){var o={ti:'${msUet}',enableAutoSpaTracking:true};o.q=w[u],w[u]=new UET(o),w[u].push("pageLoad")},n=d.createElement(t),n.src=r,n.async=1,n.onload=n.onreadystatechange=function(){var s=this.readyState;s&&s!=="loaded"&&s!=="complete"||(f(),n.onload=n.onreadystatechange=null)},i=d.getElementsByTagName(t)[0],i.parentNode.insertBefore(n,i)})(window,document,"script","//bat.bing.com/bat.js","uetq");`,
          }}
        />
      )}
    </>
  );
}
