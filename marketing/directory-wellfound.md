# Wellfound (ex-AngelList) Listing — GitDealFlow

**Submit at:** https://wellfound.com/ → Sign up as Founder → "Add company" / Startup admin
**Direct path after login:** https://wellfound.com/company/edit
**Expected DA:** ~91 (one of the highest-authority backlinks in the VC/startup space), do-follow company URL field
**Why this matters:** VCs literally browse Wellfound for deal flow — listing your VC-deal-flow tool there puts the product in front of exact-fit ICP. Plus Chrome extension already overlays signals on Wellfound profiles, so the surfaces tie together.

---

## Account setup

1. Sign up at https://wellfound.com/jobs (founder/recruiter flow, NOT the candidate flow)
2. Use **signal@gitdealflow.com** (not Omilia) — ties to brand inbox
3. Create company: "VC Deal Flow Signal" (display name) / handle: `gitdealflow`
4. Verify by founder email (you are the only employee → "Founder & CEO")

## Founder profile (your side)

- **Name:** The Data Nerd (or your preferred public name)
- **Title:** Founder
- **LinkedIn:** linkedin.com/company/gitdealflow (company page; preserve anonymity per memory note)
- **Twitter/X:** @data_nerd

---

## Company form fields

**Company name:**
VC Deal Flow Signal

**Tagline / one-liner (140 char max):**
Spot breakout startups 3 weeks early via GitHub engineering signals. Self-serve VC deal flow from EUR 9.97/mo.

**Website:**
https://gitdealflow.com

**Logo:**
Upload `/Users/sipi/launch-projects/vc-deal-flow-signal/distribution/logo-v2-512.png` (512×512, square)

**Cover image:** (optional — skip unless you want to upload a hero shot of the dashboard)

**Location / HQ:**
Remote (or your actual city)

**Markets / categories** (pick 3-5):
- Venture Capital
- Developer Tools
- SaaS
- Artificial Intelligence
- Data & Analytics

**Company size:**
1 employee

**Stage:**
Pre-seed (or "Bootstrapped" if available)

**Founded:**
2026

**Funding raised:** (leave blank — bootstrapped)

**Tech stack** (Wellfound has a structured picker):
Next.js, TypeScript, Vercel, GitHub API, MCP, Chrome Extensions, Tailwind, Supabase

---

## Long description (paste into "About")

VC Deal Flow Signal monitors GitHub engineering activity across thousands of startup orgs and surfaces the ones showing unusual acceleration — typically 3-6 weeks before a fundraise hits TechCrunch.

**The thesis:** when a startup's commit velocity, contributor count, and release cadence deviate sharply from their own baseline, something is changing — hiring spikes, product acceleration, or a push toward a milestone (often a round). That signal is public, free, and updates daily. Nobody was reading it systematically.

**What's inside:**
- 272 sector / stage / geo pSEO pages with ranked startups
- Free weekly Signal Digest (5 breakout companies with real data)
- Dashboard (EUR 9.97/mo) — 60+ startups ranked across 20 sectors
- Insider Circle (EUR 97/mo) — private investor community + API access
- **MCP server** — query the signal from inside Claude Desktop or Claude Code: `npx @gitdealflow/mcp-signal`
- **Chrome extension** — overlays the engineering signal onto Crunchbase, AngelList/Wellfound, and PitchBook profiles

**How it differs from Harmonic / Dealroom / Crunchbase:** those charge $10K+/yr, require demo calls, and use proprietary black-box data. GitDealFlow uses transparent public GitHub data, is fully self-serve, and starts at EUR 9.97/mo. None of the incumbents track engineering momentum — they report rounds after the fact. We show the acceleration before the deck exists.

Built solo by The Data Nerd. Shipping in public. Feedback welcome.

---

## "What we're hiring for" section

**Skip.** Posting fake jobs to game discovery is against Wellfound TOS and gets profiles flagged. Leave the jobs section empty — the company profile alone is the goal.

If you ever want to post a real role (e.g. part-time data engineer), use it then. Until then, empty.

---

## Pitch deck / pitch section (optional)

Skip. Wellfound's "Investor pitch" flow is for raising — you're not raising. Leaving it blank is fine.

---

## Screenshots / media to upload (optional but boosts profile completeness)

1. Landing hero — gitdealflow.com above the fold
2. Sector ranking table (signals.gitdealflow.com)
3. Sample signal card
4. MCP demo still from `/Users/sipi/Desktop/mcp-server-demo.mov`
5. Chrome extension overlay on a Wellfound (or Crunchbase) profile — meta and on-brand

---

## After submission

- [ ] Mark `[x]` on [seo-geo-aio-aeo-checklist.md:121](distribution/seo-geo-aio-aeo-checklist.md:121)
- [ ] Add wellfound.com/company/vc-deal-flow-signal to JSON-LD `sameAs` arrays in [pseo-site/app/page.tsx](pseo-site/app/page.tsx) and [pseo-site/app/about/page.tsx](pseo-site/app/about/page.tsx) (entity consolidation to Google — same pattern used for SaaSHub, Crunchbase, SideProjectors)
- [ ] Add the Wellfound URL to [pseo-site/app/llms.txt/route.ts](pseo-site/app/llms.txt/route.ts) and [llms-full.txt/route.ts](pseo-site/app/llms-full.txt/route.ts) presence list
- [ ] Add to landing footer "Find us on" section alongside Crunchbase / G2 / SaaSHub badges
- [ ] Tweet from @data_nerd linking the listing once approved
- [ ] Save the Wellfound company URL to memory as `project_wellfound.md`

## Gotchas

- **Founder verification:** Wellfound may email-verify you as a founder. Use signal@gitdealflow.com (Zoho, warmed) so the verification mail doesn't bounce.
- **No paid promo:** Wellfound will pitch you on "Recruit Pro" or similar — decline. The free company profile is what gives the backlink + discoverability.
- **Don't post jobs you won't fill** — TOS violation, gets profiles flagged. Empty jobs section is fine.
- **AngelList vs Wellfound URLs:** AngelList rebranded to Wellfound in 2022 but old `angel.co/company/...` URLs sometimes still resolve. Use the canonical `wellfound.com/company/...` URL everywhere (sameAs, footer, etc.).
- **Chrome extension synergy:** your extension already targets `wellfound.com/company/` (per [chrome-extension/content.js:36](chrome-extension/content.js:36)) — once you have a Wellfound profile, you can install the extension on your own page and screenshot it for Twitter. Free meta-content.
