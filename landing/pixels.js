/*
 * Centralized retargeting pixels for gitdealflow.com (static landing).
 * Each pixel is gated on its ID below: empty string = no script load, no fire.
 *
 * To activate a pixel:
 *   1. Create the ad account on the platform (see monitoring/retargeting-pixels.md).
 *   2. Drop the pixel ID into the corresponding field in PIXEL_IDS below.
 *   3. Redeploy. The pixel starts collecting visitors immediately.
 *
 * Same env vars are wired in pseo-site/components/PixelManager.tsx for the app.
 * Keep both in sync when you add an ID.
 */
(function () {
  if (!/^https?:$/.test(location.protocol)) return;

  var PIXEL_IDS = {
    meta: "",                         // Paid pixels are disabled for earned/community growth.
    ga4: "G-7SV2SNZE4C",           // GA4 measurement ID (GitDealFlow property)
    googleAds: "",     // Google Ads conversion ID. e.g. "AW-123456789"
    linkedin: "",                 // Paid pixels are disabled for earned/community growth.
    twitter: "",       // X/Twitter pixel ID. e.g. "abc12"
    tiktok: "",        // TikTok pixel ID. e.g. "C0XXXXXXXXXXXXXXXXXX"
    reddit: "",        // Reddit pixel ID. e.g. "t2_xxxxxxxx"
    quora: "",         // Quora pixel ID. e.g. "abcdef1234567890"
    pinterest: "",     // Pinterest tag ID. e.g. "2612345678901"
    msUet: ""          // Microsoft / Bing UET tag ID. e.g. "12345678"
  };

  // Google (GA4 + Google Ads share gtag)
  var gtagId = PIXEL_IDS.ga4 || PIXEL_IDS.googleAds;
  if (gtagId) {
    var g = document.createElement("script");
    g.async = true;
    g.src = "https://www.googletagmanager.com/gtag/js?id=" + gtagId;
    document.head.appendChild(g);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments) };
    gtag("js", new Date());
    if (PIXEL_IDS.ga4) gtag("config", PIXEL_IDS.ga4);
    if (PIXEL_IDS.googleAds) gtag("config", PIXEL_IDS.googleAds);
  }

  // X / Twitter
  if (PIXEL_IDS.twitter) {
    !function (e, t, n, s, u, a) { e.twq || (s = e.twq = function () { s.exe ? s.exe.apply(s, arguments) : s.queue.push(arguments) }, s.version = "1.1", s.queue = [], u = t.createElement(n), u.async = !0, u.src = "https://static.ads-twitter.com/uwt.js", a = t.getElementsByTagName(n)[0], a.parentNode.insertBefore(u, a)) }(window, document, "script");
    twq("config", PIXEL_IDS.twitter);
  }

  // TikTok
  if (PIXEL_IDS.tiktok) {
    !function (w, d, t) { w.TiktokAnalyticsObject = t; var ttq = w[t] = w[t] || []; ttq.methods = ["page", "track", "identify", "instances", "debug", "on", "off", "once", "ready", "alias", "group", "enableCookie", "disableCookie", "holdConsent", "revokeConsent", "grantConsent"]; ttq.setAndDefer = function (t, e) { t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))) } }; for (var i = 0; i < ttq.methods.length; i++) ttq.setAndDefer(ttq, ttq.methods[i]); ttq.instance = function (t) { for (var e = ttq._i[t] || [], n = 0; n < ttq.methods.length; n++) ttq.setAndDefer(e, ttq.methods[n]); return e }; ttq.load = function (e, n) { var r = "https://analytics.tiktok.com/i18n/pixel/events.js", o = n && n.partner; ttq._i = ttq._i || {}; ttq._i[e] = []; ttq._i[e]._u = r; ttq._t = ttq._t || {}; ttq._t[e] = +new Date; ttq._o = ttq._o || {}; ttq._o[e] = n || {}; n = document.createElement("script"); n.type = "text/javascript"; n.async = !0; n.src = r + "?sdkid=" + e + "&lib=" + t; e = document.getElementsByTagName("script")[0]; e.parentNode.insertBefore(n, e) }; ttq.load(PIXEL_IDS.tiktok); ttq.page() }(window, document, "ttq");
  }

  // Reddit
  if (PIXEL_IDS.reddit) {
    !function (w, d) { if (!w.rdt) { var p = w.rdt = function () { p.sendEvent ? p.sendEvent.apply(p, arguments) : p.callQueue.push(arguments) }; p.callQueue = []; var t = d.createElement("script"); t.src = "https://www.redditstatic.com/ads/pixel.js", t.async = !0; var s = d.getElementsByTagName("script")[0]; s.parentNode.insertBefore(t, s) } }(window, document);
    rdt("init", PIXEL_IDS.reddit);
    rdt("track", "PageVisit");
  }

  // Quora
  if (PIXEL_IDS.quora) {
    !function (q, e, v, n, t, s) { if (q.qp) return; n = q.qp = function () { n.qp ? n.qp.apply(n, arguments) : n.queue.push(arguments) }; n.queue = []; t = document.createElement(e); t.async = !0; t.src = v; s = document.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s) }(window, "script", "https://a.quora.com/qevents.js");
    qp("init", PIXEL_IDS.quora);
    qp("track", "ViewContent");
  }

  // Pinterest
  if (PIXEL_IDS.pinterest) {
    !function (e) { if (!window.pintrk) { window.pintrk = function () { window.pintrk.queue.push(Array.prototype.slice.call(arguments)) }; var n = window.pintrk; n.queue = []; n.version = "3.0"; var t = document.createElement("script"); t.async = !0; t.src = e; var r = document.getElementsByTagName("script")[0]; r.parentNode.insertBefore(t, r) } }("https://s.pinimg.com/ct/core.js");
    pintrk("load", PIXEL_IDS.pinterest);
    pintrk("page");
  }

  // Microsoft / Bing UET
  if (PIXEL_IDS.msUet) {
    (function (w, d, t, r, u) { var f, n, i; w[u] = w[u] || [], f = function () { var o = { ti: PIXEL_IDS.msUet, enableAutoSpaTracking: true }; o.q = w[u], w[u] = new UET(o), w[u].push("pageLoad") }, n = d.createElement(t), n.src = r, n.async = 1, n.onload = n.onreadystatechange = function () { var s = this.readyState; s && s !== "loaded" && s !== "complete" || (f(), n.onload = n.onreadystatechange = null) }, i = d.getElementsByTagName(t)[0], i.parentNode.insertBefore(n, i) })(window, document, "script", "//bat.bing.com/bat.js", "uetq");
  }

  // ------------------------------------------------------------------
  // Core Web Vitals beacon (added 2026-08-15). Ships LCP/INP/CLS/FCP/TTFB
  // to the existing PostHog EU project as $web_vitals events, the same
  // event shape as pseo-site components/WebVitalsReporter.tsx, so ONE
  // PostHog insight covers both domains. Closes the audit gap "no CWV
  // field measurement on gitdealflow.com". Uses the self-hosted
  // /web-vitals.js IIFE (no new CSP script origin). Honors GPC and DNT.
  // ------------------------------------------------------------------
  (function () {
    try {
      if (navigator.globalPrivacyControl === true || navigator.doNotTrack === "1") return;
      // 2026-08-16 fix: was https://eu.i.posthog.com/i/v2/e/ which returns
      // 404 (verified live): every beacon since 2026-08-15 died silently
      // (0 $web_vitals events in PostHog over 10 days). /e/ is posthog-js's
      // capture endpoint and returns 200 {"status":"Ok"} (verified).
      var TH = { LCP: [2500, 4000], INP: [200, 500], CLS: [0.1, 0.25], FCP: [1800, 3000], TTFB: [800, 1800] };
      function rate(n, v) { var t = TH[n]; if (!t) return "good"; return v <= t[0] ? "good" : v <= t[1] ? "needs-improvement" : "poor"; }
      function send(name, value, id) {
        var props = {
          distinct_id: "ga4-cwv-forward",
          $pathname: location.pathname,
          $current_url: location.href,
          $process_person_profile: false,
          $web_vitals_name: name,
          metric_name: name,
          metric_value: value,
          metric_rating: rate(name, value),
          metric_id: id
        };
        props["$web_vitals_" + name + "_value"] = value;
        props["$web_vitals_" + name + "_rating"] = rate(name, value);
        props["$web_vitals_" + name + "_event_id"] = id;
        // 2026-08-16: direct-to-PostHog send REMOVED. posthog-js 1.417
        // (loaded by this site) auto-captures $web_vitals natively with
        // proper metric_ids: the custom send double-counted every load
        // under different distinct_ids (cwv-*), polluting PostHog's CWV
        // insight. PostHog = native SDK only; this beacon now serves GA4.
        // Forward the same metric to GA4 (G-7SV2SNZE4C) with Google's standard
        // event params so GA4's Core Web Vitals reporting fills up alongside
        // PostHog. gtag is loaded by this same file; a no-op if it is absent.
        try {
          if (window.gtag) {
            window.gtag("event", name, {
              value: Math.round(name === "CLS" ? value * 1000 : value),
              metric_id: id,
              metric_value: value,
              metric_delta: undefined,
              metric_rating: rate(name, value)
            });
          }
        } catch (e) {}
      }
      function start() {
        var wv = window.webVitals; if (!wv) return;
        wv.onLCP(function (m) { send("LCP", m.value, m.id); });
        wv.onINP(function (m) { send("INP", m.value, m.id); });
        wv.onCLS(function (m) { send("CLS", m.value, m.id); });
        wv.onFCP(function (m) { send("FCP", m.value, m.id); });
        wv.onTTFB(function (m) { send("TTFB", m.value, m.id); });
      }
      if (window.webVitals) { start(); return; }
      var s = document.createElement("script");
      s.src = "/web-vitals.js"; s.async = true; s.onload = start;
      document.head.appendChild(s);
    } catch (e) { /* beacon must never throw */ }
  })();

  // ------------------------------------------------------------------
  // GA4 qualified-visitor mirror (added 2026-08-16). Mirrors the PostHog
  // north-star definition in ~/portfolio/scripts/fetch_north_star.py into
  // GA4 (G-7SV2SNZE4C) so GA4's "Qualified Visitors" audience + Looker
  // Studio dashboard mirror the PostHog number and feed Google Ads /
  // LinkedIn retargeting (the highest-value use of the qualified set).
  // Fires a once-per-session `qualified_visit` event and forwards the
  // qualifying conversion/engagement events. Deliberately does NOT mirror
  // $pageview (GA4 already collects its own page_view) and never
  // double-counts: the posthog.capture wrap is idempotent and re-applies
  // only if posthog-js replaces its snippet stub with the real instance.
  // ------------------------------------------------------------------
  (function () {
    var CONV = ["signup_verify_sent", "beta_signup", "lead_submitted", "subscribed",
      "analysis_purchased", "purchase_confirmed", "lead_magnet_requested",
      "exit_intent_subscribed", "tools_subscribe_submitted"];
    var ENG = ["concierge_opened", "exit_modal_opened", "exit_modal_submitted"];
    var EVAL_RE = /(\/pricing|\/vs\/|alternatives-to|\/methodology|\/mcp|\/api|\/docs)/;
    var qFired = false;

    function pushGtag() {
      try {
        if (window.gtag && typeof window.gtag === "function") {
          window.gtag.apply(window, arguments);
        } else {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push(Array.prototype.slice.call(arguments));
        }
      } catch (e) { /* never throw */ }
    }
    function gtagReady() {
      try {
        var dl = window.dataLayer || [];
        for (var i = 0; i < dl.length; i++) {
          if (dl[i] && typeof dl[i].event === "string" && dl[i].event.indexOf("gtm.") === 0) return true;
        }
        if (window.google_tag_manager && Object.keys(window.google_tag_manager).length > 0) return true;
      } catch (e) { /* fall through to not-ready */ }
      return false;
    }
    function qualified(source) {
      var K = "gdf_qualified_visit";
      if (qFired) return;
      try {
        if (sessionStorage.getItem(K)) return;
        sessionStorage.setItem(K, "1");
      } catch (e) { /* private mode: fall through to the volatile qFired guard */ }
      qFired = true;
      var payload = { path: location.pathname, source: source || "unknown" };
      if (gtagReady()) { pushGtag("event", "qualified_visit", payload); return; }
      // gtag.js loads lazily (onload); a push made before it loads is not
      // reliably replayed, so defer until the library has configured itself.
      var qTries = 0;
      var qTimer = setInterval(function () {
        if (gtagReady()) { pushGtag("event", "qualified_visit", payload); clearInterval(qTimer); }
        else if (++qTries > 600) { clearInterval(qTimer); }
      }, 100);
    }
    function mirror(name, props) {
      if (!name) return;
      var params = { source: location.pathname };
      if (props && typeof props === "object") {
        for (var k in props) {
          var v = props[k];
          if (v === null || v === undefined) continue;
          if (typeof v === "string" || typeof v === "number" || typeof v === "boolean") params[k] = v;
        }
      }
      if (ENG.indexOf(name) >= 0) {
        pushGtag("event", name, params);
        qualified("engagement");
      } else if (CONV.indexOf(name) >= 0) {
        pushGtag("event", name, params);
        qualified("conversion");
      }
    }
    function wrapCapture() {
      var ph = window.posthog;
      if (!ph || typeof ph.capture !== "function" || ph.__gdfMirrorWrapped) return;
      var orig = ph.capture;
      ph.capture = function () {
        try { mirror(arguments[0], arguments[1]); } catch (e) {}
        return orig.apply(ph, arguments);
      };
      try { ph.__gdfMirrorWrapped = true; } catch (e) {}
    }
    if (EVAL_RE.test(location.pathname)) qualified("eval_path");
    wrapCapture();
    var tries = 0;
    var timer = setInterval(function () {
      // posthog-js swaps its snippet stub for the real instance after
      // array.js loads; re-wrap whenever the mark is gone (idempotent).
      wrapCapture();
      if (++tries > 600) clearInterval(timer);  // ~60s; array.js loads in <2s
    }, 100);
  })();
})();
