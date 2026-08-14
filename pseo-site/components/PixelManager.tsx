import Script from "next/script";

/**
 * Centralized retargeting-pixel loader.
 * Each pixel is gated on its env var: empty/missing = the script is not emitted.
 * That means we can ship this component now and pixels start firing the moment
 * the corresponding NEXT_PUBLIC_* var is set in Vercel (no code change needed).
 *
 * All vars are NEXT_PUBLIC_ because pixel IDs are public by design, they
 * appear in the page source on every ad-tracked site.
 */
export default function PixelManager() {
  const meta = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const ga4 = process.env.NEXT_PUBLIC_GA4_ID;
  const googleAds = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  const linkedin = process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID;
  const twitter = process.env.NEXT_PUBLIC_TWITTER_PIXEL_ID;
  const tiktok = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID;
  const reddit = process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID;
  const quora = process.env.NEXT_PUBLIC_QUORA_PIXEL_ID;
  const pinterest = process.env.NEXT_PUBLIC_PINTEREST_TAG_ID;
  const msUet = process.env.NEXT_PUBLIC_MS_UET_ID;

  const gtagId = ga4 || googleAds;

  return (
    <>
      {meta && (
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${meta}');fbq('track','PageView');`,
          }}
        />
      )}

      {gtagId && (
        <>
          <Script
            id="gtag-loader"
            strategy="afterInteractive"
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

      {linkedin && (
        <>
          <Script
            id="linkedin-init"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `_linkedin_partner_id="${linkedin}";window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(_linkedin_partner_id);`,
            }}
          />
          <Script
            id="linkedin-loader"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s)})(window.lintrk);`,
            }}
          />
        </>
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
