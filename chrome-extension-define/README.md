# VC Term Highlighter — Chrome extension

Highlights VC terminology (SAFE, runway, burn multiple, magic number, …) on
any web page. Click a highlighted term to jump to the full definition on
[gitdealflow.com/glossary](https://signals.gitdealflow.com/glossary).

This is the third Chrome extension in the GitDealFlow line:

| Extension | Where it activates | Source |
| --- | --- | --- |
| GitHub Startup Signals | Crunchbase + Wellfound | `chrome-extension/` |
| VC GitHub Lookup | Anywhere with a github.com link | `chrome-extension-github/` (source recovery pending — see that dir's README) |
| **VC Term Highlighter** | **Any page** (opt-out per host) | **`chrome-extension-define/`** |

## What it does

1. On every page load, scans visible text against the 69-term controlled
   vocabulary published at
   [/api/v1/glossary.json](https://signals.gitdealflow.com/api/v1/glossary.json).
2. Underlines matches with a soft cyan background; hovering shows a
   definition snippet card; clicking opens the canonical definition on
   the GitDealFlow glossary anchor (`#term-id`) in a new tab.
3. Toggles globally from the toolbar popup. State persists via
   `chrome.storage.sync`.

The extension is fully **local-only** at runtime — the glossary is bundled
into the package (`glossary.json`). No remote fetches, no PII, no analytics.

## Performance & politeness

- **Max 60 highlights per page**, max 2 per term — so a glossary-heavy article
  doesn't drown in underlines.
- TreeWalker visits at most 8,000 text nodes before stopping.
- Initial scan is scheduled via `requestIdleCallback`; mutations are
  debounced 400 ms before re-scan.
- Skips `<script>`, `<style>`, `<code>`, `<pre>`, form controls,
  `contenteditable` regions, and `aria-hidden="true"` subtrees.
- All host styles defended via `!important` on the highlight + tooltip
  selectors only.

## Anonymity guarantees

- No network requests after install (glossary is bundled).
- No tracking pixel, no PostHog, no remote logging.
- UTM params on the destination URL are static — they identify the
  extension as a traffic source but contain no user, session, or device ID.

## Install (developer / unpacked)

1. Clone the repo and `cd chrome-extension-define`.
2. Visit `chrome://extensions`.
3. Toggle **Developer mode** on (top right).
4. Click **Load unpacked**, pick this directory.
5. Pin the extension via the puzzle-piece menu for easy access.

Visit any article that mentions VC terminology — try
[a16z's enduring company essay](https://a16z.com/) or
[Stripe Press](https://press.stripe.com) — terms like *runway*, *burn*,
*SAFE*, *dilution*, *ARR* should pick up a subtle cyan underline.

## Development workflow

```bash
# Refresh the bundled glossary from production
node chrome-extension-define/scripts/build-glossary.mjs

# Re-render the icons from icon.svg
node chrome-extension-define/scripts/build-icons.mjs

# Build a Chrome Web Store-ready .zip
node chrome-extension-define/scripts/package.mjs
# → chrome-extension-define/dist/vc-term-highlighter-<version>.zip
```

After editing any source file, return to `chrome://extensions` and click the
↻ refresh arrow on the extension card to reload.

## Files

| File | Purpose |
| --- | --- |
| `manifest.json` | MV3 manifest, content scripts, action popup |
| `content.js` | Scanner, regex builder, highlight + hover card |
| `content.css` | Highlight + tooltip styles (scoped, `!important`) |
| `popup.html/css/js` | Toolbar popup — toggle + stats + links |
| `glossary.json` | Bundled snapshot (69 terms) — refreshed via `scripts/build-glossary.mjs` |
| `icons/icon-{16,48,128}.png` | Action icons — regenerated via `scripts/build-icons.mjs` |
| `icon.svg` | Editable icon source |
| `scripts/` | Build helpers (glossary refresh, icon render, zip packager) |

## Roadmap

- [ ] v0.2 — site-level opt-out list in popup (`exclude this domain`).
- [ ] v0.2 — Edge / Firefox builds (manifest v3 cross-compat is mostly there).
- [ ] v0.2 — telemetry-free click count via local-only counter for the
        popup "highlights clicked this week" stat.
- [ ] v0.3 — bring `/tools` calculators into the hover card (e.g. *runway*
        term gets a mini calculator inline).
- [ ] v1.0 — Chrome Web Store publish under the same developer account as
        the two siblings.

## License

MIT — same as the parent repo.
