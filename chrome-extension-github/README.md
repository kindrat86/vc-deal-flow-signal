# chrome-extension-github — source not tracked in this repo

## What this directory should contain

The source for **Chrome Extension #2 — VC GitHub Lookup**, published on
the Chrome Web Store at:

  https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm

What the extension does, per shipped marketing copy
(`pseo-site/app/perfect-webinar/page.tsx`, `pseo-site/lib/emails.ts:218`,
`pseo-site/app/install/InstallClient.tsx`):

> Hover any GitHub repo or org link from any page and a chip injects with
> commit velocity, contributor growth, signal type, and stage estimate
> in 200ms. Direct visits to github.com/org or github.com/org/repo also
> get the chip. Toolbar popup runs a manual lookup form against any
> GitHub URL.

## What this directory currently contains

Only `.DS_Store` (macOS finder metadata). No `manifest.json`, no
`background.js`, no popup HTML, no icons. Git history shows zero commits
that ever touched files inside `chrome-extension-github/`.

## How this happened

The extension was built and published to the Chrome Web Store at some
point on or around 2026-05-04 (per `pseo-site/app/changelog/page.tsx`:
*"Second Chrome extension shipped: VC GitHub Lookup — Startup Signals on
Hover"*) but the source artifacts were never added to this repository.
The publish pipeline ran from another local directory, a separate repo,
or directly from a build output that wasn't checked in.

PR #14 (May 4) titled *"chrome-ext: ship VC GitHub Lookup as companion +
refresh marketing copy"* was opened but later closed in stale-PR triage
on 2026-05-06 without merging — the marketing-copy parts shipped via
later passes, but the extension source never made it back into the repo.

## Recovery options (in priority order)

1. **Best — recover from local working copy.** If the original local
   directory the extension was built from still exists on the founder's
   machine, copy it here and commit. Look for a directory containing
   `manifest.json` with `"name": "VC GitHub Lookup — Startup Signals on
   Hover"`. Check `~/Projects`, `~/Desktop`, and any `chrome-extension*`
   directories outside this repo.

2. **Second-best — pull from Chrome Web Store ZIP.** The Chrome Web
   Store does not expose source ZIPs publicly; only the developer
   account does. Sign in to the Chrome developer console at
   https://chrome.google.com/webstore/devconsole, find the listing for
   `plgngijmloeljfkenecdkhiblcfcbblm`, and download the latest reviewed
   package. Unzip to this directory.

3. **Last resort — re-implement.** The behaviour is well-documented in
   the marketing copy referenced above. A re-implementation would need
   to replicate: (a) `chrome.runtime` content script that scans page
   DOM for `github.com/<org>` and `github.com/<org>/<repo>` link hrefs,
   (b) hover handler that fetches signal JSON from
   `https://signals.gitdealflow.com/api/v1/signals.json?org=<org>` (or
   the per-repo equivalent), (c) DOM injection of the chip with
   velocity/contributor/signal-type/stage. The Crunchbase + Wellfound
   extension at `chrome-extension/` (sibling directory) is a good
   reference for the manifest, content-script registration, and injection
   patterns. Would also need to re-publish under the existing listing
   to keep `plgngijmloeljfkenecdkhiblcfcbblm` install base.

## Why this is filed as a non-blocker for now

The extension still works for all installed users — Chrome Web Store
hosts the published artifact independently of this repo. The risk is
only future: any update or bug fix requires recovery via option 1 or 2
above before any code change is possible.

## Tracking

Filed via Brunson audit cycle 2026-05-06 (claude/install-ext2-symmetry
follow-on, after the /install asymmetry was fixed in PR #50 but the
underlying source-tracking gap was discovered to persist).

When recovery happens, this README should be replaced by the recovered
extension's actual README (`manifest.json` description, build steps,
dev workflow).
