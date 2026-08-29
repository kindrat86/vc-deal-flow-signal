# GitDealFlow Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a premium, evidence-led GitDealFlow homepage with an accessible premium-video frame, preserving live signup behavior and canonical claims.

**Architecture:** Keep `landing/index.html` as the single static page and append a focused `homepage-redesign.css` layer after current CSS. The hero becomes a Hook → Story → Offer entrypoint, while the existing deeper evidence, story, and signup surfaces remain usable below it. The video component is a native HTML5 player with an honest poster and fallback until the Higgsfield-produced MP4 is present.

**Tech Stack:** Static HTML, CSS, JavaScript, existing Vercel static deployment, Playwright or Chrome local rendering.

**Spec:** `docs/superpowers/specs/2026-08-23-gitdealflow-homepage-redesign-design.md`

## Global Constraints

- Preserve existing `js-signup-form` form handling, navigation, analytics, and static-site deployment.
- Use only canonical claims: 350+ orgs, 15 sectors, 219 startup-period observations across 55 startups with no linked funding-event labels.
- Describe 21 to 47 days as observed research-panel lead time, not a prediction or outcome guarantee.
- One visual accent: signal orange. No made-up social proof, performance claims, or funding predictions.
- Public identity remains pseudonymous.
- Maintain keyboard focus states, reduced motion support, and no horizontal overflow at 390px or 1440px.

---

### Task 1: Add claim-protected video asset contract

**Files:**
- Create: `landing/media/README.md`
- Test: `landing/media/README.md` inspected by a short Node assertion

**Interfaces:**
- Consumes: expected file paths in the homepage player.
- Produces: documented filenames `gitdealflow-signal-explainer.mp4`, `gitdealflow-signal-explainer.vtt`, and `gitdealflow-signal-explainer-poster.svg`.

- [ ] **Step 1: Write the failing asset-contract assertion**

```bash
node -e "const fs=require('fs');const p='landing/media/README.md';if(!fs.existsSync(p)||!fs.readFileSync(p,'utf8').includes('gitdealflow-signal-explainer.mp4'))process.exit(1)"
```

- [ ] **Step 2: Run it to verify it fails**

Run: `node -e "const fs=require('fs');const p='landing/media/README.md';if(!fs.existsSync(p)||!fs.readFileSync(p,'utf8').includes('gitdealflow-signal-explainer.mp4'))process.exit(1)"`

Expected: exit 1 before the file exists.

- [ ] **Step 3: Write the asset contract**

Document the exact MP4, WebVTT, poster, 16:9, 1080p, 75 to 90 second, and caption requirements. State that readable titles and end-card text must be page or programmatically rendered rather than relied on in AI footage.

- [ ] **Step 4: Run the asset-contract assertion**

Run: the Node assertion from Step 1.

Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add landing/media/README.md
git commit -m "docs: define GitDealFlow explainer video contract"
```

### Task 2: Write the premium hero and video player markup

**Files:**
- Modify: `landing/index.html: hero section beginning near the main opening section`
- Test: `landing/scripts/test-homepage-redesign.mjs`

**Interfaces:**
- Consumes: `js-signup-form`, `signup-hero`, `hero-email`, `/media/gitdealflow-signal-explainer.mp4`.
- Produces: `#signal-explainer`, `.gdf-hero`, `.gdf-video-shell`, `.gdf-proof-rail`.

- [ ] **Step 1: Write a failing structural test**

```js
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
for (const selector of ['gdf-hero', 'signal-explainer', 'gdf-video-shell', 'js-signup-form']) {
  assert.ok(html.includes(selector), `missing ${selector}`);
}
assert.ok(html.includes('350+ startup orgs'));
assert.ok(html.includes('21 to 47 days'));
assert.ok(!html.includes('219 fundraises the engineering signal preceded'));
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node landing/scripts/test-homepage-redesign.mjs`

Expected: assertion failure for `gdf-hero`.

- [ ] **Step 3: Implement the hero replacement**

Replace only the existing opening hero content with semantic `.gdf-hero` markup: a left story column, a right `<video>` with controls, VTT track, poster fallback, and a preserved signup form. Add an explicit qualifier near the timeline: “Observed in the documented research panel. A signal is a reason to investigate, not a claim a company is raising.”

- [ ] **Step 4: Run the structural test**

Run: `node landing/scripts/test-homepage-redesign.mjs`

Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add landing/index.html landing/scripts/test-homepage-redesign.mjs
git commit -m "feat: add GitDealFlow premium video hero"
```

### Task 3: Create a scoped premium visual system

**Files:**
- Create: `landing/homepage-redesign.css`
- Modify: `landing/index.html: head stylesheet references and hero classes`
- Test: `landing/scripts/test-homepage-redesign.mjs`

**Interfaces:**
- Consumes: `.gdf-hero`, `.gdf-video-shell`, `.gdf-proof-rail` markup from Task 2.
- Produces: responsive styles after `/inline.css` without altering existing below-fold component behavior.

- [ ] **Step 1: Extend the test with CSS contract checks**

```js
const css = readFileSync(new URL('../homepage-redesign.css', import.meta.url), 'utf8');
for (const selector of ['.gdf-hero', '.gdf-video-shell', '@media (prefers-reduced-motion: reduce)', '@media (max-width: 720px)']) {
  assert.ok(css.includes(selector), `missing CSS ${selector}`);
}
assert.ok(html.includes('/homepage-redesign.css'));
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node landing/scripts/test-homepage-redesign.mjs`

Expected: filesystem error or assertion failure for the stylesheet.

- [ ] **Step 3: Implement stylesheet and load it last**

Create a scoped layer with dark editorial surfaces, data-grid texture, orange CTA, ivory display typography, an asymmetric desktop grid, a mobile single column, focus-visible styles, `prefers-reduced-motion`, and `overflow-x: clip` protection. Do not use a purple/blue AI gradient or a new dependency.

- [ ] **Step 4: Run the structural/CSS test**

Run: `node landing/scripts/test-homepage-redesign.mjs`

Expected: exit 0.

- [ ] **Step 5: Commit**

```bash
git add landing/homepage-redesign.css landing/index.html landing/scripts/test-homepage-redesign.mjs
git commit -m "style: establish GitDealFlow editorial hero system"
```

### Task 4: Correct homepage claims in the redesigned surfaces

**Files:**
- Modify: `landing/index.html`
- Test: `landing/scripts/test-homepage-redesign.mjs`
- Test: project claim checker when available.

**Interfaces:**
- Consumes: claim guardrails in the spec.
- Produces: no redesigned surface saying the 219 observations are 219 fundraises or saying the signal proves a raise.

- [ ] **Step 1: Add failing assertions**

```js
assert.ok(!html.includes('219 fundraises the engineering signal preceded'));
assert.ok(!html.includes('median head start before the round'));
assert.ok(html.includes('219 startup-period observations across 55 startups'));
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `node landing/scripts/test-homepage-redesign.mjs`

Expected: failed stale-claim assertion.

- [ ] **Step 3: Replace stale copy with descriptive research-panel language**

Use “219 startup-period observations across 55 startups of public engineering activity and no linked funding-event labels.” Keep investment-risk and investigation disclaimers clear.

- [ ] **Step 4: Run tests and available claim guard**

Run: `node landing/scripts/test-homepage-redesign.mjs && (test -f pseo-site/scripts/verify-claims.ts && cd pseo-site && npm run verify:claims || true)`

Expected: homepage test exits 0. Record any unavailable project script separately rather than masking a homepage failure.

- [ ] **Step 5: Commit**

```bash
git add landing/index.html landing/scripts/test-homepage-redesign.mjs
git commit -m "fix: keep GitDealFlow homepage claims auditable"
```

### Task 5: Render and verify the changed conversion path

**Files:**
- Test: `landing/scripts/test-homepage-redesign.mjs`
- Test: local static server and Playwright/Chrome browser probe.

**Interfaces:**
- Consumes: complete hero, CSS, fallback media contract, and signup markup.
- Produces: local evidence that both desktop and mobile render, neither overflows, and the form uses the existing handler class.

- [ ] **Step 1: Run static structural tests**

Run: `node landing/scripts/test-homepage-redesign.mjs`

Expected: exit 0.

- [ ] **Step 2: Serve the landing site locally**

Run: `python3 -m http.server 4173 --directory landing`

Expected: static server starts and serves `/`.

- [ ] **Step 3: Run a browser-layout probe**

Use Playwright at widths 390 and 1440. For each viewport, assert `document.documentElement.scrollWidth <= window.innerWidth`, `.gdf-hero` is visible, the video element exists, and `.js-signup-form` is present. Capture screenshots for review.

- [ ] **Step 4: Inspect the real signup wiring without submitting**

Confirm the hero form has `js-signup-form`, a valid email input, and the current script listener remains loaded. Do not send any test email.

- [ ] **Step 5: Commit and prepare deployment**

```bash
git add landing/
git commit -m "test: verify GitDealFlow homepage redesign"
```

Do not deploy until the user asks or deployment approval is already explicit.

## Plan self-review

- Spec coverage: hero, visual system, video component, asset contract, canonical claims, accessibility, form preservation, mobile and desktop verification all map to Tasks 1 through 5.
- Placeholder scan: no implementation placeholders or undefined interfaces remain.
- Type/interface consistency: exact DOM selectors and asset filenames are introduced in Task 2 and consumed in Tasks 3 and 5.
