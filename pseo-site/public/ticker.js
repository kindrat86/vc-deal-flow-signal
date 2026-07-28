/**
 * GitDealFlow Live Deal Ticker — Embeddable Widget
 *
 * Add one <script> tag to any website to show a live VC deal-flow ticker.
 * Zero dependencies, vanilla JS, ~3KB gzipped.
 *
 * Usage:
 *   <script src="https://signals.gitdealflow.com/ticker.js"
 *           data-mode="ticker"
 *           data-height="60"></script>
 *
 * Modes:
 *   ticker — horizontal scrolling ticker (default)
 *   card   — vertical stack of cards
 *   mini   — compact horizontal ticker
 *
 * The script injects an iframe that loads /ticker/embed/#<mode>.
 * Each iframe auto-sizes to fit content via postMessage.
 */
(function () {
  "use strict";

  var BASE = "https://signals.gitdealflow.com";
  var MSG_TYPE = "gitdealflow:ticker:size";
  var ATTACHED_KEY = "__gitdealflowTickerAttached";

  function build(scriptEl) {
    var mode = scriptEl.getAttribute("data-mode") || "ticker";
    var height = parseInt(scriptEl.getAttribute("data-height") || "0", 10) || 68;
    var title = scriptEl.getAttribute("data-title") || "VC Deal Flow Signals — GitDealFlow";

    var wrapper = document.createElement("div");
    wrapper.style.cssText =
      "width:100%;max-width:100%;overflow:hidden;" +
      "margin:12px 0;";

    var iframe = document.createElement("iframe");
    iframe.src = BASE + "/ticker/embed/#" + mode;
    iframe.title = title;
    iframe.loading = "lazy";
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("scrolling", "no");
    iframe.setAttribute("allowtransparency", "true");
    iframe.style.cssText =
      "width:100%;border:0;display:block;" +
      "background:#0f172a;border-radius:10px;" +
      "overflow:hidden;min-height:" + height + "px;";

    // Insert wrapper + iframe before the script tag
    scriptEl.parentNode.insertBefore(wrapper, scriptEl);
    wrapper.appendChild(iframe);
    scriptEl.setAttribute("data-gitdealflow-ticker-mounted", "1");
  }

  function init() {
    var scripts = document.querySelectorAll(
      'script[src*="ticker.js"]:not([data-gitdealflow-ticker-mounted])'
    );
    for (var i = 0; i < scripts.length; i++) {
      build(scripts[i]);
    }
  }

  // Listen for iframe height updates
  window.addEventListener("message", function (e) {
    var d = e && e.data;
    if (!d || d.type !== MSG_TYPE || typeof d.height !== "number") return;
    // Find the iframe that sent this
    var iframes = document.querySelectorAll(
      'iframe[src*="ticker/embed"]'
    );
    for (var i = 0; i < iframes.length; i++) {
      var ifr = iframes[i];
      if (ifr.src.indexOf(d.slug) !== -1) {
        ifr.style.height = d.height + "px";
        break;
      }
    }
  });

  // Run on DOM ready + on subsequent calls
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose manual init for dynamic content
  window.GitDealFlowTicker = { init: init };
})();
