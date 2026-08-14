/**
 * /embed.js, drop-in loader for GitDealFlow widgets.
 *
 * Usage on the embedder side (Ghost, WordPress, Notion, any HTML host
 * that allows <script>):
 *
 *   <script src="https://signals.gitdealflow.com/embed.js"
 *           data-tool="safe-calculator"></script>
 *
 * Behavior:
 *   - Replaces itself with an <iframe src="/embed/tools/<data-tool>">.
 *   - Listens for postMessage `gitdealflow:embed:size` events emitted
 *     by <EmbedAutoHeight/> inside the iframe and resizes the iframe
 *     height to fit the content. Works for multiple iframes on one
 *     page, each height update is routed to the matching iframe by
 *     pathname.
 *
 * Iframe-first vs script-first: Substack and Beehiiv strip <script>
 * tags from posts. The PRIMARY distribution surface is still the
 * raw <iframe> tag (documented at /embed). This loader is for hosts
 * that do allow JS and prefer the auto-resize ergonomics.
 *
 * Why a Route Handler (not /public/embed.js): we want a single source
 * of truth on the deployment, with the canonical site URL baked in
 * at request time so the loader works no matter what domain the script
 * was pulled from (apex / www / preview). Cache-Control + CORS are set
 * once here and at next.config.ts. */

const BASE_URL = "https://signals.gitdealflow.com";

const SOURCE = `(function () {
  "use strict";
  var BASE = ${JSON.stringify(BASE_URL)};
  var MSG = "gitdealflow:embed:size";
  // Each iframe we create stores its slug on a dataset attr so the
  // global postMessage listener can route height updates back to the
  // right element when a page hosts multiple GitDealFlow widgets.
  function build(scriptEl) {
    var tool = scriptEl.getAttribute("data-tool");
    if (!tool) return;
    var height = parseInt(scriptEl.getAttribute("data-height") || "0", 10);
    var iframe = document.createElement("iframe");
    iframe.src = BASE + "/embed/tools/" + encodeURIComponent(tool);
    iframe.title = scriptEl.getAttribute("data-title") || (tool + " (GitDealFlow)");
    iframe.loading = "lazy";
    iframe.setAttribute("frameborder", "0");
    iframe.setAttribute("scrolling", "no");
    iframe.style.cssText =
      "width:100%;border:0;display:block;background:#0f172a;" +
      "border-radius:8px;overflow:hidden;" +
      "min-height:" + (height > 0 ? height : 520) + "px;";
    iframe.dataset.gitdealflowSlug = "/embed/tools/" + tool;
    scriptEl.parentNode.insertBefore(iframe, scriptEl);
    // Replace the <script> with the iframe; leave the script in DOM so a
    // second pass doesn't re-create. Cheaper than removing it.
    scriptEl.setAttribute("data-gitdealflow-mounted", "1");
  }
  function init() {
    var scripts = document.querySelectorAll(
      'script[src*="/embed.js"][data-tool]:not([data-gitdealflow-mounted])'
    );
    for (var i = 0; i < scripts.length; i++) build(scripts[i]);
  }
  if (window.__gitdealflowEmbedListenerAttached) {
    init();
    return;
  }
  window.__gitdealflowEmbedListenerAttached = true;
  window.addEventListener("message", function (e) {
    var d = e && e.data;
    if (!d || d.type !== MSG || typeof d.height !== "number") return;
    if (typeof d.slug !== "string") return;
    var iframes = document.querySelectorAll(
      'iframe[data-gitdealflow-slug=' + JSON.stringify(d.slug) + ']'
    );
    for (var i = 0; i < iframes.length; i++) {
      iframes[i].style.height = d.height + "px";
      iframes[i].style.minHeight = "0";
    }
  });
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();`;

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  return new Response(SOURCE, {
    headers: {
      "Content-Type": "application/javascript; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800",
      "Access-Control-Allow-Origin": "*",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
