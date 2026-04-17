# Reddit r/SideProject Post — Wave 1 (Sunday April 19)
## Frame as side project story

---

### Title
Side project: I monitor 2,000+ startup GitHub orgs and rank them by engineering momentum for investors

### Body (copy-paste below)

Built this as a side project over the past few months. The idea: use public GitHub data to spot startups showing unusual engineering acceleration — before they hit the news.

**How it works:**
- Pull commit activity, contributor data, and repo creation from the GitHub API across 2,000+ startup orgs
- Calculate 14-day rolling commit velocity and its rate of change
- Classify signal types (hiring burst, infrastructure buildout, deploy spike, migration)
- Publish weekly sector rankings across 20 startup sectors

**Tech stack:** Next.js pSEO site on Vercel (generates 100+ pages from structured data), GitHub API for the pipeline, Pocketbase for subscribers, Stripe for payments.

**What it looks like:** Each sector page ranks startups by commit velocity change with real numbers — no hand-waving. Example: carlos-emr in healthcare spiked +199% velocity with 94 contributors this week.

**Why build this when Harmonic/Dealroom exist?** Those platforms charge $10K+/year and require a demo call just to see the product. They also use proprietary black-box data. I wanted something transparent (public GitHub data), self-serve (no sales call), and priced for indie investors — not just institutional funds.

**Monetization:**
- Free: monthly Signal Digest (5 breakout startups)
- EUR 9.97/mo: full dashboard with 50+ startups, sector/stage/geography filters
- EUR 97/mo: private investor community + API access

Still early — launched the site this month. Getting signal on whether investors actually find this useful.

Also shipped a free Chrome extension that overlays the signal on Crunchbase, AngelList, and PitchBook profiles — so investors see the acceleration data inside their existing research workflow, not a separate dashboard. Was by far the most fun piece to build.

Check it out:
- Main site: https://gitdealflow.com
- Sector data: https://signals.gitdealflow.com
- Chrome extension: https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn

Would love any feedback on the idea or the execution. What would you add?
