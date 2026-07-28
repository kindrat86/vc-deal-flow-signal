# OWNER ACTIONS — signals.gitdealflow.com

Deploy is owner-gated on this site (auto-deploy loop disabled; domain is
alias-pinned on Vercel). Entries below are prepared but NOT deployed. Apply and
verify each manually, newest first.

---

## 2026-07-26 — conversion(T1+T4): on-page email capture — close the cross-domain leak

**What changed (prepared, NOT deployed).** Commit `6eed3ed5` in the growth-loop
worktree `/Users/sipi/growth-loop/sites/signals.gitdealflow.com/worktrees/20260726T041252Z-backlog-conversion-SIGNALS`
(detached HEAD off `8fea2e13`). 4 files, +184 lines, no deletions:

- `components/InlineSubscribe.tsx` — NEW. Email-only, low-friction capture.
  `"use client"`. POSTs to the SAME-DOMAIN `/api/subscribe` (the existing
  double-opt-in function the homepage squeeze uses; signals.gitdealflow.com is
  already in `lib/validation.ts` `ALLOWED_ORIGINS`). Honeypot `website` field.
  Success state: "Almost there — check your inbox to confirm." Error/retry
  state. Fires PostHog `signals_inline_subscribed` `{template, path}` on success
  (T4). No `innerHTML`/`dangerouslySetInnerHTML`/`eval` — the Trusted-Types CSP
  footgun is structurally not triggered.
- `components/SeoCta.tsx` — renders `<InlineSubscribe>` ABOVE the existing
  cross-domain CTAs (which are KEPT — money ladder). Adds optional
  `template?: string` prop (default `"seo-cta"`). SeoCta is the shared
  end-of-article block, so this one edit adds the form to ~80 content templates
  (startup, compare, research-paper, startups-to-watch, faq, and the rest).
- `app/answers/[slug]/page.tsx` — answers has its own CTA block (no SeoCta);
  injected `<InlineSubscribe template="answers">` above it.
- `app/methodology/page.tsx` — injected `<InlineSubscribe template="methodology">`
  before the final CTA.

**Verification (local `next dev` + puppeteer, screenshot-only per house rule):**
- `tsc --noEmit`: 0 errors.
- 7 sampled templates (methodology, answers/[slug], compare/[slug],
  research-paper/[slug], faq [static SeoCta], startup/[slug],
  startups-to-watch/[slug]) all HTTP 200 with the form visible and non-blank
  (bodyLen 4968–15421; disproves the blank-screen/hydration-wipe footgun).
  Exactly one form per page (no duplication).
- Submit test (endpoint mocked, no local Resend key): POST goes to same-domain
  `/api/subscribe` with `source:"inline:<template>"` and `landing_path` = the
  page path; success UI shows the confirm-your-inbox double-opt-in message;
  PostHog `signals_inline_subscribed` fires with `{template, path}`.

### ⚠️ LINEAGE — read before deploying
This worktree is on the **internal-link-engine** lineage (HEAD `8fea2e13`),
NOT the live `worldclass-signals` branch (`a121f2fa`). Confirmed divergence:
`components/GuidedConcierge.tsx` is a null-stub here but ships real on
`worldclass-signals`. **These 4 changes must be cherry-picked onto
`worldclass-signals`** (same recurring issue as the prior T1 traffic partials
below). Do NOT merge this branch wholesale — take the `6eed3ed5` change only.

### Deploy steps (owner)
1. Cherry-pick / re-apply the `6eed3ed5` change onto the `worldclass-signals`
   worktree (`/Users/sipi/signals-worldclass`). Confirm it compiles there
   (`npm run typecheck`) — note SeoCta gained an optional `template?: string`
   prop; verify no local edit conflicts.
2. `npm run build` in that worktree.
3. Prebuilt/CLI deploy only — never a cloud build (Vercel spend cap):
   `vercel deploy --prod --prebuilt --archive=tgz`.
4. Domain is **alias-pinned** — a bare `vercel deploy --prod` does NOT move the
   alias. RE-PIN: `vercel alias set <new-deployment-url> signals.gitdealflow.com`
   (confirm exact current target via `vercel alias ls` first).
5. SCREENSHOT-verify live (a curl 200 has hidden a blank page here): `/methodology`,
   `/answers/<slug>`, a `/compare/<slug>`, a `/research-paper/<slug>`, a
   `/startup/<slug>`, a `/startups-to-watch/<slug>` — form visible, page not blank.
   Roll the alias back on failure (`vercel alias ls` → previous URL).
6. Do a real submit from one live content page → confirm the verification email
   arrives (Resend bcc `sales@sipiteno.com`) and PostHog project 143861 shows
   `signals_inline_subscribed` with the page path.

### Deferred (not in this slice) — tracked in plan.md `backlog-conversion-SIGNALS-remainder`
- T2: `/explore` conversion block. T3: honest social-proof thumbnail of the real
  `/report` sample next to the squeeze form.

---

## 2026-07-25 — traffic(T7): owner-action packet (GSC/Bing, WAF bot-mitigation, content distribution)

**What changed**
- New file committed in the growth-loop worktree: `pseo-site/OWNER_ACTIONS_SIGNALS.md`
  (165 lines, additive doc only — no code, build, JSON-LD, `layout.tsx`, `ux.js`,
  or CSP change; zero rendering/deploy risk). Commit `2e61ac8b` on the detached
  worktree HEAD off `99345d46`.
- Contents (all owner manual actions, nothing deployed):
  1. Google Search Console — add **URL-prefix** property for
     `https://signals.gitdealflow.com/`, verify via the **HTML file** method
     (token from GSC UI, drop into `pseo-site/public/` alongside existing
     verification files, do not overwrite), then submit `sitemap.xml`.
  2. Bing Webmaster Tools — `BingSiteAuth.xml` already staged in `public/`;
     import the property / verify.
  3. Vercel WAF — recommendation to add a Firewall custom rule **challenging**
     (not denying) datacenter ASNs behind the ~75% CN/HK/SG `$direct` bot share
     from the 2026-07-23 audit. Caveat carried through: identify the real ASNs
     from logs first (don't guess), and challenge-not-deny so verified
     crawlers/humans aren't blocked.
  4. Three content-distribution drafts (2 IndieHackers + 1 r/startups) — every
     factual claim quoted verbatim from already-published sources
     (`content/standalone-faqs.ts`, live `llms.txt`); volatile momentum figures
     left as `<fill from live /trending>` placeholders, not invented.

**No code deploy in this slice.** This iteration produced a repository doc, not a
rendered page. There is nothing to `vercel deploy` for T7 itself.

**Deploy / action command (owner)**
```bash
# 1. Read the full packet:
cat /Users/sipi/signals-gitdealflow/pseo-site/OWNER_ACTIONS_SIGNALS.md
# 2. Perform §1–§4 manually (GSC verify+sitemap, Bing verify, WAF rule, post drafts).
# 3. If the GSC HTML-file token requires a code change, add it to public/ on the
#    LIVE worldclass-signals source and deploy there (see branch/deploy notes below).
```

**CRITICAL branch note (read before any deploy)**
The packet was prepared on the **`internal-link-engine`** lineage
(detached HEAD off `99345d46`), **NOT** the live `worldclass-signals` branch.
Any file that must go live (e.g. the GSC verification token) must be added to the
`worldclass-signals` source at `/Users/sipi/signals-worldclass`, not this worktree.

**Pre-deploy checks (per site CLAUDE.md / pseo-site AGENTS.md)** — only relevant if
a token file needs to ship:
- Confirm which source is live (`vercel ls` / current alias) — production is the
  `worldclass-signals` worktree, aliased to the domain.
- Prebuilt/CLI deploy only, never a cloud build (Vercel spend cap):
  `vercel deploy --prod --prebuilt --archive=tgz`.
- Domain is **alias-pinned**: a bare `vercel deploy --prod` does NOT move the
  alias — run `vercel alias set <deployment-url> signals.gitdealflow.com`.
- Verify **by screenshot only** (a curl 200 has hidden a blank hydration shell
  here before); confirm real content renders. Roll the alias back on failure.

**Remaining runbook work (tracked in plan.md `backlog-traffic-SIGNALS-remainder`)**
T1 per-template `RelatedLinks` rollout to ~240 routes; T2 homepage HTML diet +
JSON-LD dedupe; T3 TL;DR blocks; T6 sitemap `lastmod` truthfulness + news-sitemap
48h freshness. T4 (`/llms-full.txt`) found already present in repo — struck.
T5 IndexNow already complete.

---

## 2026-07-24 — traffic(T1): sitewide `/explore` hub link in Footer

**What changed**
- File: `pseo-site/components/Footer.tsx` — one line added: a
  `<Link href="/explore" ...>Explore all views</Link>` at the top of the Footer
  "Browse" nav group.
- Why: Runbook T1 requires every content page to link to the `/explore` hub
  once. `/explore` had **no** global inbound link (only a self-reference + the
  sitemap route). The Footer renders on every route via `layout.tsx`, so this
  one-line change gives all ~250 pages the required hub link with the smallest
  possible diff and zero rendering risk (pure JSX link — no scripts, schema, or
  layout-structure change, so it cannot trigger the Trusted-Types / `ux.js`
  blank-page landmine).
- Committed in the growth-loop worktree at `ee951039` (detached HEAD off
  `9a2c6248`).

**CRITICAL branch note (read before deploying)**
This change was prepared in the growth-loop isolated worktree, which is on the
**`internal-link-engine`** lineage (detached HEAD `9a2c6248`), **NOT** the live
`worldclass-signals` branch. Editing this lineage alone does **not** update
production. Before deploying, apply/cherry-pick this one-line Footer edit onto
`worldclass-signals` (live source at `/Users/sipi/signals-worldclass`), or make
the equivalent one-line edit there directly.

**Pre-deploy checks (per site CLAUDE.md)**
- Confirm which source is live: production is served from the
  `worldclass-signals` worktree, aliased to the domain — verify with
  `vercel ls` / current alias before you start.
- Prebuilt/CLI deploy only — never a cloud build (Vercel spend cap). Use
  `vercel deploy --prod --prebuilt --archive=tgz` if building locally first.
- The domain is **alias-pinned**: a bare `vercel deploy --prod` does NOT move
  the alias. You must run `vercel alias set` explicitly (see below).

**Deploy command (owner, from the `worldclass-signals` worktree)**
```bash
cd /Users/sipi/signals-worldclass            # live worldclass-signals source
git status                                    # confirm clean before applying
# apply the one-line Footer edit (add the <Link href="/explore"> to Browse), then:
git add components/Footer.tsx && git commit -m "traffic(T1): add sitewide /explore hub link in Footer"
vercel deploy --prod                          # capture the deployment URL
vercel alias set <deployment-url> signals.gitdealflow.com   # REQUIRED — domain is alias-pinned
```

**Verify — SCREENSHOT ONLY (a curl 200 has hidden a blank page here before)**
After the alias points at the new deploy, screenshot the live homepage and one
content page (e.g. `/research-paper/hu-2021-lora-low-rank-adaptation`) with a
headless browser and confirm:
- the page renders real content (not a blank hydration shell), and
- the Footer "Browse" column shows **"Explore all views"** linking to
  `/explore`, and `/explore` itself returns 200 and renders its `<h1>`.

If the page is blank or the link is absent, roll the alias back to the previous
deployment: `vercel ls` → `vercel alias set <prev-url> signals.gitdealflow.com`.

**Remaining runbook work (not in this slice — tracked in plan.md)**
T1 is only partially satisfied (global `/explore` link added). The per-template
`RelatedLinks` rollout to the ~240 routes still missing contextual internal
links, plus T2/T3/T4/T6/T7, remain — see plan.md backlog entry
`backlog-traffic-SIGNALS-remainder`. (T5 IndexNow is already complete in repo.)
