/* GitDealFlow first-touch distribution attribution, v1.
 * No PII. Persists only campaign fields, hostnames, and paths.
 */
(function (w, d) {
  "use strict";
  if (w.__GDF_ATTR_INSTALLED || !/^https?:$/.test(w.location.protocol)) return;
  w.__GDF_ATTR_INSTALLED = true;
  w.__GDF_ATTR_VERSION = "1";

  var VERSION = "1";
  var FIRST_KEY = "gdf_ft_v1";
  var LAST_KEY = "gdf_lt_v1";
  var SESSION_KEY = "gdf_attr";
  var UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term", "utm_id"];
  var SOURCE_CHANNEL = {
    x: "x", x_profile: "x", twitter: "x", "t.co": "x", "x.com": "x",
    reddit: "reddit", linkedin: "linkedin", "lnkd.in": "linkedin", youtube: "youtube",
    email: "newsletter", newsletter: "newsletter", substack: "newsletter",
    outreach: "outreach", coldmail: "outreach", followup: "followup",
    scout: "scout", scout_forward: "scout", scout_link: "scout", scout_pdf: "scout",
    scout_social: "scout", operator: "scout",
    hackernews: "hackernews", "news.ycombinator.com": "hackernews",
    indiehackers: "indiehackers", devto: "devto", "dev.to": "devto",
    hackernoon: "hackernoon", medium: "medium", quora: "quora",
    producthunt: "producthunt", sideprojectors: "sideprojectors",
    stackshare: "stackshare", "stackshare.io": "stackshare",
    g2: "g2", capterra: "capterra", getapp: "getapp", softwareadvice: "software-advice",
    glama: "glama", smithery: "smithery", "mcp-registry": "mcp-registry",
    "open-tools": "open-tools", github: "github", npm: "npm", pypi: "pypi",
    huggingface: "huggingface", embed: "embed", widget: "embed", badge: "badge",
    extension: "extension", "chrome-web-store": "chrome-web-store",
    "firefox-amo": "firefox-amo", "edge-addons": "edge-addons",
    partner: "partner", affiliate: "affiliate", podcast: "podcast", press: "press",
    "guest-post": "guest-post", "cross-portfolio": "cross-portfolio"
  };

  function clean(value, max) {
    return String(value || "").replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, max || 160);
  }

  function safeHost(value) {
    try { return clean(new URL(value).hostname.toLowerCase().replace(/^www\./, ""), 120); }
    catch (e) { return ""; }
  }

  function isInternal(host) {
    return host === "gitdealflow.com" || /\.gitdealflow\.com$/.test(host);
  }

  function readStore(store, key) {
    try { return JSON.parse(store.getItem(key) || "null"); }
    catch (e) { return null; }
  }

  function writeStore(store, key, value) {
    try { store.setItem(key, JSON.stringify(value)); }
    catch (e) {}
  }

  function readCookie(name) {
    try {
      var match = d.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
      return match ? JSON.parse(decodeURIComponent(match[1])) : null;
    } catch (e) { return null; }
  }

  function writeCookie(name, value) {
    try {
      var domain = /(^|\.)gitdealflow\.com$/.test(w.location.hostname) ? "; Domain=.gitdealflow.com" : "";
      d.cookie = name + "=" + encodeURIComponent(JSON.stringify(value)) +
        "; Path=/; Max-Age=7776000; SameSite=Lax; Secure" + domain;
    } catch (e) {}
  }

  function isPrivateMode() {
    try { return navigator.globalPrivacyControl === true || navigator.doNotTrack === "1"; }
    catch (e) { return false; }
  }

  function paidChannel(source, medium) {
    if (!/(^|[-_])(cpc|ppc|paid|sponsor|display|retargeting)([-_]|$)/.test(medium)) return "";
    if (source.indexOf("reddit") >= 0) return "reddit-ads";
    if (source.indexOf("linkedin") >= 0) return "linkedin-ads";
    if (source === "x" || source.indexOf("twitter") >= 0) return "x-ads";
    if (source.indexOf("facebook") >= 0 || source.indexOf("meta") >= 0 || source.indexOf("instagram") >= 0) return "meta-ads";
    return "paid-other";
  }

  function channelFor(source, medium) {
    source = clean(source, 120).toLowerCase();
    medium = clean(medium, 80).toLowerCase();
    var paid = paidChannel(source, medium);
    if (paid) return paid;
    if (SOURCE_CHANNEL[source]) return SOURCE_CHANNEL[source];
    if (/^(google|bing|duckduckgo|brave|yahoo|yandex|ecosia)(\.|$)/.test(source)) return "organic-search";
    if (/(chatgpt|openai|perplexity|claude|anthropic|gemini|copilot|phind|you\.com)/.test(source)) return "ai-referral";
    if (!source || source === "direct" || source === "$direct") return "direct";
    if (isInternal(source)) return "internal";
    return "referral-other";
  }

  function bucketFor(channel) {
    if (/^(x|reddit|linkedin|youtube)$/.test(channel)) return "social";
    if (/^(newsletter|outreach|followup|scout)$/.test(channel)) return "email";
    if (/^(reddit|linkedin|x|meta)-ads$/.test(channel) || channel === "paid-other") return "paid";
    if (channel === "organic-search") return "organic";
    if (channel === "ai-referral") return "ai";
    if (channel === "direct" || channel === "internal") return channel;
    return "referral";
  }

  function currentTouch() {
    var params = new URLSearchParams(w.location.search);
    var utm = {};
    var hasUtm = false;
    for (var i = 0; i < UTM_KEYS.length; i++) {
      var key = UTM_KEYS[i];
      utm[key] = clean(params.get(key), key === "utm_campaign" ? 200 : 120);
      if (utm[key]) hasUtm = true;
    }
    var referrerHost = safeHost(d.referrer);
    var externalReferrer = referrerHost && !isInternal(referrerHost);
    var source = utm.utm_source || (externalReferrer ? referrerHost : "direct");
    var channel = channelFor(source, utm.utm_medium);
    return {
      version: VERSION,
      source: clean(source.toLowerCase(), 120),
      channel: channel,
      bucket: bucketFor(channel),
      utm_source: utm.utm_source.toLowerCase(),
      utm_medium: utm.utm_medium.toLowerCase(),
      utm_campaign: utm.utm_campaign.toLowerCase(),
      utm_content: utm.utm_content.toLowerCase(),
      utm_term: utm.utm_term.toLowerCase(),
      utm_id: utm.utm_id.toLowerCase(),
      referrer_host: referrerHost,
      landing_host: clean(w.location.hostname.toLowerCase().replace(/^www\./, ""), 120),
      landing_path: clean(w.location.pathname, 300),
      touched_at: new Date().toISOString(),
      explicit_utm: hasUtm,
      meaningful: hasUtm || !!externalReferrer
    };
  }

  function flat(prefix, touch, out) {
    out[prefix + "source"] = touch.source || "direct";
    out[prefix + "channel"] = touch.channel || "direct";
    out[prefix + "bucket"] = touch.bucket || "direct";
    out[prefix + "medium"] = touch.utm_medium || "";
    out[prefix + "campaign"] = touch.utm_campaign || "";
    out[prefix + "content"] = touch.utm_content || "";
    out[prefix + "term"] = touch.utm_term || "";
    out[prefix + "id"] = touch.utm_id || "";
    out[prefix + "landing_host"] = touch.landing_host || "";
    out[prefix + "landing_path"] = touch.landing_path || "";
    out[prefix + "referrer_host"] = touch.referrer_host || "";
    out[prefix + "touched_at"] = touch.touched_at || "";
    return out;
  }

  function fingerprint(touch) {
    var raw = [touch.landing_host, touch.landing_path, touch.source, touch.utm_campaign, touch.utm_content].join("|");
    var h = 2166136261;
    for (var i = 0; i < raw.length; i++) { h ^= raw.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0).toString(36);
  }

  var state = null;
  var wireTimer = null;

  function attributionPayload(sourceLabel) {
    if (!state) refresh();
    var out = {
      source: clean(sourceLabel, 100) || "landing-page",
      utm_source: state.last.utm_source || "",
      utm_medium: state.last.utm_medium || "",
      utm_campaign: state.last.utm_campaign || "",
      utm_content: state.last.utm_content || "",
      utm_term: state.last.utm_term || "",
      utm_id: state.last.utm_id || "",
      referrer: state.first.referrer_host || "",
      landing_path: state.first.landing_path || w.location.pathname,
      attribution_channel: state.first.channel || "direct",
      attribution_version: VERSION
    };
    flat("first_", state.first, out);
    flat("last_", state.last, out);
    return out;
  }

  function wirePostHog() {
    var ph = w.posthog;
    if (!state || !ph || typeof ph.capture !== "function") return false;
    var props = { gdf_attr_version: VERSION };
    flat("gdf_first_", state.first, props);
    flat("gdf_last_", state.last, props);
    props.gdf_channel = state.first.channel;
    props.gdf_bucket = state.first.bucket;
    if (state.last.utm_source) {
      props.utm_source = state.last.utm_source;
      props.utm_medium = state.last.utm_medium;
      props.utm_campaign = state.last.utm_campaign;
      props.utm_content = state.last.utm_content;
      props.utm_term = state.last.utm_term;
      props.utm_id = state.last.utm_id;
    }
    try {
      if (typeof ph.register_once === "function") ph.register_once(flat("gdf_first_", state.first, { gdf_attr_version: VERSION }));
      if (typeof ph.register_for_session === "function") ph.register_for_session(props);
      else if (typeof ph.register === "function") ph.register(props);
      if (typeof ph.register === "function") ph.register(props);
      var eventKey = "gdf_distribution_landing_v1_" + fingerprint(state.current);
      if (!readStore(w.sessionStorage, eventKey)) {
        ph.capture("distribution_landing", Object.assign({
          attribution_version: VERSION,
          current_source: state.current.source,
          current_channel: state.current.channel,
          current_bucket: state.current.bucket,
          explicit_utm: state.current.explicit_utm,
          landing_host: state.current.landing_host,
          landing_path: state.current.landing_path,
          referrer_host: state.current.referrer_host
        }, attributionPayload("distribution-landing")));
        writeStore(w.sessionStorage, eventKey, { sent: true });
      }
      return true;
    } catch (e) { return false; }
  }

  function scheduleWire() {
    if (wirePostHog() || wireTimer) return;
    var tries = 0;
    wireTimer = w.setInterval(function () {
      if (wirePostHog() || ++tries > 120) {
        w.clearInterval(wireTimer);
        wireTimer = null;
      }
    }, 250);
  }

  function refresh() {
    var current = currentTouch();
    var persistent = !isPrivateMode();
    var first = (persistent && (readCookie(FIRST_KEY) || readStore(w.localStorage, FIRST_KEY))) || current;
    var previousLast = (persistent && (readCookie(LAST_KEY) || readStore(w.localStorage, LAST_KEY))) || null;
    var session = readStore(w.sessionStorage, SESSION_KEY);
    var last = current.meaningful ? current : (previousLast || session || first);

    if (persistent) {
      if (!readCookie(FIRST_KEY) && !readStore(w.localStorage, FIRST_KEY)) {
        writeCookie(FIRST_KEY, first);
        writeStore(w.localStorage, FIRST_KEY, first);
      }
      if (current.meaningful || !previousLast) {
        writeCookie(LAST_KEY, last);
        writeStore(w.localStorage, LAST_KEY, last);
      }
    }

    var sessionTouch = current.meaningful ? current : (session || current);
    writeStore(w.sessionStorage, SESSION_KEY, sessionTouch);
    state = { first: first, last: last, current: current, session: sessionTouch };
    w.GDFattribution = attributionPayload;
    w.GDFAttribution = attributionPayload;
    scheduleWire();
  }

  refresh();
  var oldHref = w.location.href;
  function routeChanged() {
    if (w.location.href === oldHref) return;
    oldHref = w.location.href;
    refresh();
  }
  w.addEventListener("popstate", function () { w.setTimeout(routeChanged, 0); });
  ["pushState", "replaceState"].forEach(function (name) {
    try {
      var original = w.history[name];
      w.history[name] = function () {
        var result = original.apply(this, arguments);
        w.setTimeout(routeChanged, 0);
        return result;
      };
    } catch (e) {}
  });
})(window, document);
