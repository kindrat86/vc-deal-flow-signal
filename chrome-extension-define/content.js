/**
 * VC Term Highlighter — content script
 *
 * Scans visible text on the page, underlines VC terms from the bundled
 * glossary, shows a definition snippet on hover, and links the click
 * through to /glossary#<term-id> on signals.gitdealflow.com.
 *
 * Anonymity-safe: no PII collected, no remote tracking, no eval, no innerHTML
 * with dynamic data. DNT respected for the optional click ping.
 */

(function () {
  "use strict";

  // Already injected on this document? bail.
  if (window.__VC_TERM_HL_INSTALLED__) return;
  window.__VC_TERM_HL_INSTALLED__ = true;

  const GLOSSARY_URL = "https://signals.gitdealflow.com/glossary";
  const UTM = "utm_source=extension&utm_medium=browser&utm_campaign=vc_term_highlighter";

  // Tunables — keep modest so we never visibly jank a page.
  const MAX_HIGHLIGHTS_PER_PAGE = 60;
  const MAX_PER_TERM = 2;
  const MAX_TEXT_NODES_VISITED = 8000;
  const MIN_TEXT_LENGTH = 3;

  // Tags whose contents we never touch.
  const SKIP_TAGS = new Set([
    "SCRIPT",
    "STYLE",
    "NOSCRIPT",
    "CODE",
    "PRE",
    "KBD",
    "SAMP",
    "VAR",
    "TEXTAREA",
    "INPUT",
    "SELECT",
    "OPTION",
    "BUTTON",
    "TEMPLATE",
    "IFRAME",
    "OBJECT",
    "SVG",
    "MATH",
    "CANVAS",
  ]);

  // -----------------------------------------------------------------------
  // Storage / state
  // -----------------------------------------------------------------------

  let enabled = true;
  let terms = []; // [{term, id, definition}]
  let termIndex = new Map(); // lowercased term → entry
  let regex = null;
  let highlightsTotal = 0;
  const highlightsPerTerm = new Map();

  // -----------------------------------------------------------------------
  // Boot
  // -----------------------------------------------------------------------

  async function boot() {
    try {
      const settings = await getSettings();
      if (settings.enabled === false) return;
      enabled = settings.enabled !== false;

      terms = await loadGlossary();
      if (!terms.length) return;

      for (const t of terms) termIndex.set(t.term.toLowerCase(), t);
      regex = buildRegex(terms);

      // Defer initial scan to next idle tick to avoid stealing time from
      // the host page's own first paint.
      scheduleIdle(() => scanRoot(document.body));

      // Re-scan on SPA navigation + on significant content insertions.
      observeMutations();
    } catch (err) {
      // Fail silent — extension errors should never break the host page.
      // console.debug("[vc-term-highlighter] boot failed:", err);
    }
  }

  function scheduleIdle(fn) {
    if (typeof window.requestIdleCallback === "function") {
      window.requestIdleCallback(fn, { timeout: 1500 });
    } else {
      setTimeout(fn, 250);
    }
  }

  async function getSettings() {
    return new Promise((resolve) => {
      try {
        chrome.storage.sync.get({ enabled: true }, (v) => resolve(v || { enabled: true }));
      } catch {
        resolve({ enabled: true });
      }
    });
  }

  async function loadGlossary() {
    const url = chrome.runtime.getURL("glossary.json");
    const res = await fetch(url);
    if (!res.ok) throw new Error(`glossary fetch ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data?.terms)) return [];
    // Filter to terms with both a name and id. Defensive.
    return data.terms.filter(
      (t) => t && typeof t.term === "string" && typeof t.id === "string",
    );
  }

  // -----------------------------------------------------------------------
  // Regex assembly
  // -----------------------------------------------------------------------

  function escapeRegex(s) {
    return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  /**
   * Build a single alternation regex from all term names, longest first so
   * the regex engine prefers "Engineering Hiring Burst" over "Engineering".
   * Whole-word boundaries on both sides.
   *
   * Some terms contain parentheses or hyphens — we escape, but keep the
   * raw spelling. Case-insensitive matching ('gi').
   */
  function buildRegex(termList) {
    // Already sorted by build-glossary.mjs but re-sort defensively.
    const ordered = [...termList].sort((a, b) => b.term.length - a.term.length);
    const parts = ordered.map((t) => escapeRegex(t.term));
    // \b doesn't behave well next to punctuation like "(" or ")". Use a
    // lookaround that requires the surrounding char to NOT be a word char,
    // start of string, or end of string.
    const pat = `(?<![A-Za-z0-9])(${parts.join("|")})(?![A-Za-z0-9])`;
    return new RegExp(pat, "gi");
  }

  // -----------------------------------------------------------------------
  // DOM scanning
  // -----------------------------------------------------------------------

  function shouldSkipElement(el) {
    if (!el) return true;
    if (SKIP_TAGS.has(el.tagName)) return true;
    if (el.isContentEditable) return true;
    if (el.closest('[contenteditable="true"]')) return true;
    if (el.closest(".vc-term-hl")) return true; // already highlighted
    // Hidden subtrees — don't waste cycles.
    if (el.getAttribute && el.getAttribute("aria-hidden") === "true") return true;
    return false;
  }

  function scanRoot(root) {
    if (!enabled || !regex || !root) return;
    if (highlightsTotal >= MAX_HIGHLIGHTS_PER_PAGE) return;

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue || node.nodeValue.length < MIN_TEXT_LENGTH) {
          return NodeFilter.FILTER_REJECT;
        }
        const parent = node.parentElement;
        if (shouldSkipElement(parent)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const candidates = [];
    let visited = 0;
    let n;
    while ((n = walker.nextNode())) {
      if (++visited > MAX_TEXT_NODES_VISITED) break;
      candidates.push(n);
    }

    for (const node of candidates) {
      if (highlightsTotal >= MAX_HIGHLIGHTS_PER_PAGE) break;
      try {
        highlightTextNode(node);
      } catch {
        // skip — never break the page
      }
    }
  }

  function highlightTextNode(textNode) {
    const text = textNode.nodeValue;
    if (!text) return;

    // Reset regex state — it's a global RegExp.
    regex.lastIndex = 0;
    const matches = [];
    let m;
    while ((m = regex.exec(text)) !== null) {
      const matched = m[1];
      const lower = matched.toLowerCase();
      const entry = termIndex.get(lower);
      if (!entry) continue;

      const count = highlightsPerTerm.get(entry.id) || 0;
      if (count >= MAX_PER_TERM) continue;
      if (highlightsTotal >= MAX_HIGHLIGHTS_PER_PAGE) break;

      matches.push({ index: m.index, length: matched.length, entry, matched });
      highlightsPerTerm.set(entry.id, count + 1);
      highlightsTotal++;
    }

    if (!matches.length) return;

    // Replace the text node with a sequence of text + span fragments.
    const parent = textNode.parentNode;
    if (!parent) return;

    const frag = document.createDocumentFragment();
    let cursor = 0;
    for (const match of matches) {
      if (match.index > cursor) {
        frag.appendChild(
          document.createTextNode(text.slice(cursor, match.index)),
        );
      }
      frag.appendChild(buildHighlight(match.matched, match.entry));
      cursor = match.index + match.length;
    }
    if (cursor < text.length) {
      frag.appendChild(document.createTextNode(text.slice(cursor)));
    }
    parent.replaceChild(frag, textNode);
  }

  function buildHighlight(matchedText, entry) {
    const span = document.createElement("span");
    span.className = "vc-term-hl";
    span.setAttribute("role", "link");
    span.setAttribute("tabindex", "0");
    span.dataset.vcTermId = entry.id;
    span.textContent = matchedText;

    const url = `${GLOSSARY_URL}?${UTM}#${encodeURIComponent(entry.id)}`;
    span.title = truncate(entry.definition, 240);

    const open = (e) => {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      window.open(url, "_blank", "noopener,noreferrer");
    };
    span.addEventListener("click", open);
    span.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") open(e);
    });
    span.addEventListener("mouseenter", () => showCard(span, entry));
    span.addEventListener("mouseleave", () => hideCardSoon(span));
    span.addEventListener("focus", () => showCard(span, entry));
    span.addEventListener("blur", () => hideCardSoon(span));

    return span;
  }

  function truncate(s, n) {
    if (!s) return "";
    return s.length > n ? s.slice(0, n - 1) + "…" : s;
  }

  // -----------------------------------------------------------------------
  // Hover card
  // -----------------------------------------------------------------------

  let card = null;
  let cardHideTimer = null;

  function ensureCard() {
    if (card) return card;
    card = document.createElement("div");
    card.className = "vc-term-hl-card";
    card.setAttribute("role", "tooltip");
    card.addEventListener("mouseenter", () => {
      if (cardHideTimer) clearTimeout(cardHideTimer);
    });
    card.addEventListener("mouseleave", () => hideCardSoon());
    document.documentElement.appendChild(card);
    return card;
  }

  function showCard(anchor, entry) {
    if (cardHideTimer) clearTimeout(cardHideTimer);
    const c = ensureCard();
    // Build content with textContent only — no innerHTML.
    while (c.firstChild) c.removeChild(c.firstChild);

    const title = document.createElement("div");
    title.className = "vc-term-hl-card__title";
    title.textContent = entry.term;
    c.appendChild(title);

    const body = document.createElement("div");
    body.className = "vc-term-hl-card__body";
    body.textContent = truncate(entry.definition, 420);
    c.appendChild(body);

    const link = document.createElement("a");
    link.className = "vc-term-hl-card__link";
    link.href = `${GLOSSARY_URL}?${UTM}#${encodeURIComponent(entry.id)}`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = "Read the full definition →";
    c.appendChild(link);

    // Position below the anchor, clamped to viewport.
    const rect = anchor.getBoundingClientRect();
    const cardWidth = 340;
    const left = Math.max(
      8,
      Math.min(window.innerWidth - cardWidth - 8, rect.left),
    );
    const top = rect.bottom + window.scrollY + 6;
    c.style.left = `${left + window.scrollX}px`;
    c.style.top = `${top}px`;
    c.style.maxWidth = `${cardWidth}px`;
    c.classList.add("vc-term-hl-card--visible");
  }

  function hideCardSoon() {
    if (!card) return;
    if (cardHideTimer) clearTimeout(cardHideTimer);
    cardHideTimer = setTimeout(() => {
      if (card) card.classList.remove("vc-term-hl-card--visible");
    }, 180);
  }

  // -----------------------------------------------------------------------
  // SPA / mutation handling
  // -----------------------------------------------------------------------

  let mutationTimer = null;
  function observeMutations() {
    let lastUrl = location.href;

    const obs = new MutationObserver((records) => {
      // URL change → reset budget so a brand-new page gets fresh highlights.
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        highlightsTotal = 0;
        highlightsPerTerm.clear();
        scheduleIdle(() => scanRoot(document.body));
        return;
      }
      if (mutationTimer) return;
      // Debounce — gather mutations for ~400ms then process additions only.
      mutationTimer = setTimeout(() => {
        mutationTimer = null;
        if (highlightsTotal >= MAX_HIGHLIGHTS_PER_PAGE) return;
        const roots = new Set();
        for (const r of records) {
          if (r.type !== "childList") continue;
          r.addedNodes.forEach((n) => {
            if (n.nodeType === Node.ELEMENT_NODE) roots.add(n);
          });
        }
        for (const root of roots) {
          if (highlightsTotal >= MAX_HIGHLIGHTS_PER_PAGE) break;
          scanRoot(root);
        }
      }, 400);
    });

    obs.observe(document.body, { subtree: true, childList: true });
  }

  // -----------------------------------------------------------------------
  // Listen for popup toggle
  // -----------------------------------------------------------------------

  chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (!msg || typeof msg !== "object") return;
    if (msg.type === "VC_TERM_HL_PING") {
      sendResponse({ ok: true, highlights: highlightsTotal });
      return true;
    }
    if (msg.type === "VC_TERM_HL_SET_ENABLED") {
      enabled = !!msg.enabled;
      if (!enabled) {
        // Unwrap all highlights so the page returns to its baseline.
        document.querySelectorAll(".vc-term-hl").forEach((el) => {
          const txt = document.createTextNode(el.textContent || "");
          el.parentNode && el.parentNode.replaceChild(txt, el);
        });
        highlightsTotal = 0;
        highlightsPerTerm.clear();
      } else {
        highlightsTotal = 0;
        highlightsPerTerm.clear();
        scanRoot(document.body);
      }
      sendResponse({ ok: true, enabled });
      return true;
    }
  });

  boot();
})();
