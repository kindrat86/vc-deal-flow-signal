/**
 * popup.js — toggle highlighting + show stats. No tracking, no remote calls.
 */

(function () {
  "use strict";

  const $ = (sel) => document.querySelector(sel);
  const toggle = $("#toggle");
  const countEl = $("#count");
  const totalEl = $("#total");

  // --- Initial state -------------------------------------------------------

  chrome.storage.sync.get({ enabled: true }, (v) => {
    toggle.checked = v.enabled !== false;
  });

  // --- Total terms in the bundled glossary ---------------------------------

  fetch(chrome.runtime.getURL("glossary.json"))
    .then((r) => r.json())
    .then((d) => {
      if (typeof d?.count === "number") totalEl.textContent = String(d.count);
    })
    .catch(() => {
      totalEl.textContent = "—";
    });

  // --- Highlights count on the active tab ----------------------------------

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs && tabs[0];
    if (!tab || !tab.id) {
      countEl.textContent = "0";
      return;
    }
    try {
      chrome.tabs.sendMessage(
        tab.id,
        { type: "VC_TERM_HL_PING" },
        (resp) => {
          // chrome.runtime.lastError is set if the content script didn't load
          // (e.g. chrome:// pages, Web Store). Silently degrade.
          if (chrome.runtime.lastError) {
            countEl.textContent = "0";
            return;
          }
          if (resp && typeof resp.highlights === "number") {
            countEl.textContent = String(resp.highlights);
          } else {
            countEl.textContent = "0";
          }
        },
      );
    } catch {
      countEl.textContent = "0";
    }
  });

  // --- Toggle handler ------------------------------------------------------

  toggle.addEventListener("change", () => {
    const enabled = !!toggle.checked;
    chrome.storage.sync.set({ enabled });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs && tabs[0];
      if (!tab || !tab.id) return;
      try {
        chrome.tabs.sendMessage(
          tab.id,
          { type: "VC_TERM_HL_SET_ENABLED", enabled },
          () => {
            // Ignore lastError — see PING handler note above.
            if (chrome.runtime.lastError) return;
          },
        );
      } catch {
        // noop
      }
    });
  });
})();
