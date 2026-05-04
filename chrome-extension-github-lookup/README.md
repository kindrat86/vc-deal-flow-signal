# VC GitHub Lookup — Startup Signals on Hover

Forward-reference folder. The source for this Chrome extension was shipped directly to the Chrome Web Store on 2026-05-04 and is not yet committed to this repository.

- **Install URL**: https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm
- **Extension ID**: `plgngijmloeljfkenecdkhiblcfcbblm`
- **Version at launch**: 0.1.0
- **Size**: 15.51 KiB
- **Manifest**: V3
- **Category (Chrome Web Store)**: Developer Tools

## What it does

Hover any link to `github.com/<owner>` or `github.com/<owner>/<repo>` and a tooltip surfaces:

- Commit velocity (last 14 days)
- Velocity change vs prior period
- Contributor count and growth
- Engineering signal type (hiring burst, reorg, breakout, …)
- Stage estimate

When you visit a repo or org page directly, a chip is injected next to the page header so the data is always one glance away. The toolbar icon opens a manual lookup form for any GitHub org or arbitrary GitHub URL.

## Privacy

- `host_permissions`: `https://signals.gitdealflow.com/*` only
- The only outbound network request is to `signals.gitdealflow.com` — fired only on hover or popup interaction
- Only the owner slug is sent in the URL; nothing else is collected
- Responses cached in session storage (≤5 minutes) so the public API stays friendly
- No analytics SDK, no tracking, no cookies, no account
- No host-page content collection beyond the URL of the GitHub link being hovered

## Web surfaces (link from popup + in-product CTAs)

The extension should reference both GitDealFlow surfaces:

- **Apex / landing** — https://gitdealflow.com (marketing + funnel story; the dedicated extensions hub at https://gitdealflow.com/chrome lists both extensions side-by-side, and is the canonical short URL for tweet announcements)
- **Signals / pSEO** — https://signals.gitdealflow.com (live dashboard, integrations, citations, llms.txt + llms-full.txt; also the only `host_permissions` target in the manifest)

Either surface alone is incomplete — apex covers the marketing/funnel story, signals covers the live data + discovery surfaces. The popup should link to both and the toolbar's manual-lookup popup should drive to `https://signals.gitdealflow.com/` on empty input.

## Companion extension

[VC Deal Flow Signal — Crunchbase + Wellfound badge](../chrome-extension/) (`hehkgipiamajnnlpkfhpeoeaoaogmknn`) covers the deal-research surfaces (Crunchbase + Wellfound). This extension covers GitHub itself. Together they form the complete loop. The companion's [popup](../chrome-extension/popup.html) cross-promotes this extension; this extension's popup (when source lands) should cross-promote the companion via the install URL above.

## Source

The committed source for this extension will land here when the user pushes the local working copy. Until then, this README is the authoritative pointer to the live Chrome Web Store listing.
