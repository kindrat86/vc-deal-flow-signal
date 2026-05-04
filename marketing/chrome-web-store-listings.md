# Chrome Web Store listing copy — both extensions (paste-ready)

Both listings reference the apex (gitdealflow.com) and the live signals subdomain (signals.gitdealflow.com), and explicitly cross-link to each other as companions.

> Where to paste: https://chrome.google.com/webstore/devconsole — pick the listing → **Store listing** tab → paste into "Description" / "Summary". Per memory `feedback_chrome_webstore_dev_console_blocked`, the dev console is blocked from Chrome MCP — this is user-only.

---

## Extension #1 — VC Deal Flow Signal (id `hehkgipiamajnnlpkfhpeoeaoaogmknn`)

### Short description (132-char cap)

```
Engineering-acceleration badge on Crunchbase + Wellfound startup profiles. Spot breakout startups via public GitHub data.
```
*120 chars*

### Full description

```
See VC-grade engineering acceleration data overlaid on every Crunchbase and Wellfound startup profile. Spot breakout startups before anyone else.

When you open a company profile on Crunchbase or Wellfound, an inline badge appears showing the live engineering signal:

• "Accelerating" — commit velocity up sharply vs the company's own baseline
• "Steady" — within normal range
• "Decelerating" — velocity down vs prior period
• "No data" — company not in our public dataset yet

Hover the badge for the underlying metrics: 14-day commit velocity, velocity change vs prior period, contributor count and growth, and the engineering signal type (hiring burst, infrastructure buildout, framework migration, deploy-frequency spike).

Data comes from GitDealFlow's public sector rankings — built from the public GitHub API across ~4,200 candidate startup organizations, refreshed weekly, and free to browse at https://signals.gitdealflow.com.

Marketing site, methodology, and SSRN preprint: https://gitdealflow.com (the /chrome page lists both extensions and the data flow).

Privacy:
• No analytics, no tracking, no account required.
• Reads only the company slug from the URL of the page you're on.
• One outbound request to https://signals.gitdealflow.com per profile load.
• No host-page content collection, no DOM beyond the URL.

Companion extension: "VC GitHub Lookup — Startup Signals on Hover" (https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm) puts the same signal on every GitHub repo or org page. Install both for the complete loop — the deal-research surface (Crunchbase, Wellfound) AND the engineering-origin surface (GitHub itself).

Free in perpetuity. Manifest V3, ~30 KB.
```

### Website (Store listing → Website)

```
https://gitdealflow.com
```
*Apex root only. Deep paths (`/chrome`, `/integrations`, etc.) trigger "Website link is not reachable" even when HTTP 200. Validated 2026-05-04 in the live dev console.*

### Support link

```
https://signals.gitdealflow.com/faq
```
*`mailto:` is rejected by CWS as "Support link is not valid" (validator policy changed). Use the apex `/faq` HTTPS URL. Validated 2026-05-04.*

### Privacy policy

```
https://gitdealflow.com/privacy
```

### Operational paste tips (the most common cause of "not reachable" when URL is fine)

- Always clear the form field fully before pasting (`Cmd+A` → `Delete`). The widget caches the previous error.
- Never copy from inside Markdown backticks — the trailing newline breaks the URL. Copy plain text from this paragraph.
- After pasting, click outside the field once to fire validation, then **Save Draft**.
- If a "not reachable" error persists after pasting a URL that returns HTTP 200, refresh the dev console page and re-enter — the validator caches per-form-load.

---

## Extension #2 — VC GitHub Lookup — Startup Signals on Hover (id `plgngijmloeljfkenecdkhiblcfcbblm`)

### Short description (132-char cap)

```
Hover any GitHub repo or org for VC-grade engineering signals: commit velocity, contributor growth, breakout status.
```
*116 chars*

### Full description (current live listing already includes much of this — paste replaces it)

```
Hover any GitHub repo or org to see VC-grade engineering signals: commit velocity, contributor growth, signal type, and stage estimate.

VC GitHub Lookup turns GitHub itself into a deal-flow surface. Hover any link to github.com/<owner> or github.com/<owner>/<repo> and instantly see the data investors and engineering leads use to spot breakout startups before anyone else:

• Commit velocity (last 14 days)
• Velocity change vs. prior period
• Contributor count and growth
• Engineering signal type (hiring burst, reorg, breakout, …)
• Stage estimate

When you visit a repo or org page directly, a chip is injected next to the page header so the data is always one glance away. The toolbar icon opens a manual lookup form for any GitHub org or arbitrary GitHub URL.

Data comes from GitDealFlow's public sector rankings — built from the public GitHub API, refreshed continuously, and free to browse at https://signals.gitdealflow.com.

Marketing site, methodology, and SSRN preprint: https://gitdealflow.com (the /chrome page lists both extensions and the data flow).

Privacy:
• No analytics, no tracking, no account required.
• The only network request is to https://signals.gitdealflow.com — only when you hover a GitHub link or open the popup.
• The owner slug is sent in the URL; nothing else is collected.
• Responses are cached in session storage (≤5 minutes) so the API stays friendly.

Companion extension: "VC Deal Flow Signal" (https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn) surfaces the same signals on Crunchbase and Wellfound profiles. Install both for the complete loop — the engineering-origin surface (GitHub itself) AND the deal-research surface (Crunchbase, Wellfound).

Free in perpetuity. Manifest V3, ~16 KB.
```

### Website (Store listing → Website)

```
https://gitdealflow.com
```
*Apex root only. Deep paths (`/chrome`, `/integrations`, etc.) trigger "Website link is not reachable" even when HTTP 200. Validated 2026-05-04 in the live dev console.*

### Support link

```
https://signals.gitdealflow.com/faq
```
*`mailto:` is rejected by CWS as "Support link is not valid" (validator policy changed). Use the apex `/faq` HTTPS URL. Validated 2026-05-04.*

### Privacy policy

```
https://gitdealflow.com/privacy
```

### Operational paste tips (the most common cause of "not reachable" when URL is fine)

- Always clear the form field fully before pasting (`Cmd+A` → `Delete`). The widget caches the previous error.
- Never copy from inside Markdown backticks — the trailing newline breaks the URL. Copy plain text from this paragraph.
- After pasting, click outside the field once to fire validation, then **Save Draft**.
- If a "not reachable" error persists after pasting a URL that returns HTTP 200, refresh the dev console page and re-enter — the validator caches per-form-load.

---

## Verification after paste

For each listing:

1. Save and submit. Chrome Web Store typically queues review in ≤24 h for description-only updates.
2. Once live, fetch with WebFetch and `grep -c gitdealflow.com` + `grep -c signals.gitdealflow.com` — both should be ≥1 in each listing's full description.
3. Update `monitoring/build-dashboard.py` `as_of` for both rows to the verification date.
