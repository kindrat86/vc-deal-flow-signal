"use client";

import { useEffect } from "react";

/**
 * Reports document height to the parent window via postMessage so embedder
 * sites that load /embed.js can resize the iframe to fit the widget, no
 * scrollbars on slider drags, no clipped result tables, no eyeballed
 * `height=420` guesses.
 *
 * Message contract (read by /embed.js on the parent):
 *   {
 *     type: 'gitdealflow:embed:size',
 *     slug: <pathname>,            // e.g. "/embed/tools/safe-calculator"
 *     height: <pixels>,            // documentElement.scrollHeight
 *   }
 *
 * The slug doubles as a routing key so a single parent page can host
 * multiple gitdealflow iframes (one per tool) and route each height
 * update to the right `<iframe>` element.
 *
 * Cadence: ResizeObserver on documentElement + one initial measurement on
 * mount + load + resize. Height is rounded up so sub-pixel reflow doesn't
 * cause repeated +1px postMessage spam.
 */
export function EmbedAutoHeight() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.parent === window) return; // Standalone view, not in an iframe.

    let lastHeight = 0;
    const post = () => {
      const height = Math.ceil(
        document.documentElement.scrollHeight ||
          document.body.scrollHeight ||
          0,
      );
      if (height <= 0 || height === lastHeight) return;
      lastHeight = height;
      window.parent.postMessage(
        {
          type: "gitdealflow:embed:size",
          slug: window.location.pathname,
          height,
        },
        "*",
      );
    };

    post();

    // ResizeObserver fires whenever the body box changes, covers slider
    // drags, conditional reveals, validation errors expanding the result
    // panel, etc.
    const ro = new ResizeObserver(() => post());
    ro.observe(document.documentElement);

    // Some browsers don't notify ResizeObserver for font swap / image load;
    // rebroadcast on those too.
    const onLoad = () => post();
    window.addEventListener("load", onLoad);
    window.addEventListener("resize", post);

    return () => {
      ro.disconnect();
      window.removeEventListener("load", onLoad);
      window.removeEventListener("resize", post);
    };
  }, []);

  return null;
}
