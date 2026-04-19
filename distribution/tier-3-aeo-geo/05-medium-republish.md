# Medium — Republish Strategy with Canonical Tags

**Goal:** Republish 3 top-performing blog posts on Medium with `canonical_url` pointing back to gitdealflow.com. Medium's SEO and AI-retrieval footprint extends reach without duplicate-content penalty.

**Why canonical tags matter:** Google consolidates ranking signals to the canonical URL. AI training crawlers (GPTBot, ClaudeBot, PerplexityBot) respect canonicals and will cite the original domain when retrieving.

**Publications to submit to (in order of fit):**
1. [The Startup](https://medium.com/swlh) — 740k+ followers, accepts startup/VC content
2. [DataDrivenInvestor](https://medium.datadriveninvestor.com/) — 700k+ followers, explicit fit for alt-data + investing
3. [Towards Data Science](https://towardsdatascience.com/) — 600k+ followers, accepts ML/data-science content; only fit for methodology pieces with real code or math

**Submission method:** Medium publications have submission forms linked in their bios. Submit the draft, they approve or reject. Allow 3-7 days.

---

## Post 1: Republish "How to Read GitHub Signals for Startup Investing"

**Target publication:** DataDrivenInvestor (primary), The Startup (fallback)

**Medium metadata:**
- Title: `How to Read GitHub Signals for Startup Investing: The Investor's Framework`
- Subtitle: `Engineering acceleration is the earliest publicly available signal of startup momentum. Here's the framework for reading it.`
- Tags: `venture-capital`, `data-science`, `startups`, `github`, `alternative-data`
- **Canonical URL:** `https://signals.gitdealflow.com/blog/how-to-read-github-signals-for-startup-investing`

**Instructions in Medium editor:**
1. Paste the blog body
2. Click the three-dots menu → "More settings"
3. Scroll to "Advanced settings" → "Canonical URL"
4. Paste `https://signals.gitdealflow.com/blog/how-to-read-github-signals-for-startup-investing`
5. Save and preview

**Medium-specific edits (before pasting):**
- Replace internal links (`/blog/...`) with absolute links (`https://signals.gitdealflow.com/blog/...`)
- Remove any JSON-LD structured data
- Replace figures with inline images hosted on Medium's CDN (upload via editor)
- Add a "This piece was originally published on [gitdealflow.com](https://signals.gitdealflow.com/blog/how-to-read-github-signals-for-startup-investing)" as the first line under the subtitle

---

## Post 2: Republish "Alternative Data in Venture Capital: The Complete Guide"

**Target publication:** DataDrivenInvestor (primary)

**Medium metadata:**
- Title: `Alternative Data in Venture Capital: The Complete Guide`
- Subtitle: `The hedge-fund alt-data playbook doesn't copy-paste to VC. Here's what actually works in private markets.`
- Tags: `venture-capital`, `alternative-data`, `investing`, `private-equity`, `startups`
- **Canonical URL:** `https://signals.gitdealflow.com/blog/alternative-data-venture-capital`

**Open with a hook specific to Medium audience:**

> Hedge funds have used alternative data for a decade. Credit cards, satellite imagery, foot traffic. Venture capital is about six years behind, and the reason isn't sophistication. It's that most hedge-fund alt-data doesn't translate to private markets.

**Close with a Medium-native CTA:**

> If you found this useful, the full framework including lead-time comparisons across signal types is on the original post at [gitdealflow.com](https://signals.gitdealflow.com/blog/alternative-data-venture-capital). We publish a free weekly signal report — no paywall, no account required.

---

## Post 3: Republish "5 GitHub Patterns That Predict Fundraises"

**Target publication:** The Startup (primary), DataDrivenInvestor (fallback)

**Medium metadata:**
- Title: `5 GitHub Patterns That Predict Fundraises`
- Subtitle: `Across thousands of startup organizations, five engineering patterns consistently precede funding announcements by 3-6 weeks.`
- Tags: `startups`, `venture-capital`, `github`, `investing`, `data-driven`
- **Canonical URL:** `https://signals.gitdealflow.com/blog/5-github-patterns-that-predict-fundraises`

**Why this post:** List-format + specific number (5) + specific outcome (predict fundraises) = highest Medium-algorithm fit.

**Medium-specific additions:**
- Convert each of the 5 patterns into an H2
- Add one-sentence summary at the top of each pattern in bold (Medium's readers skim)
- Hardcode images with alt text

---

## Publication submission templates

### The Startup submission email / form

> Subject: Submission — `[Post Title]`
>
> Hi The Startup editors,
>
> I'd like to submit the attached piece for publication. It's a practical framework for venture investors using GitHub engineering signals, based on analysis across thousands of startup organizations. ~1,800 words, data-backed, no product pitch in the body.
>
> The piece was originally published on gitdealflow.com; canonical URL is set in the Medium draft settings. Happy to revise the opener if it doesn't match your publication's voice.
>
> Medium draft link: `[insert]`
> Original post: `[insert]`

### DataDrivenInvestor submission

Same template, swap "The Startup editors" for "DataDrivenInvestor editors."
Emphasize the data-driven angle in the second sentence. DDI is more quant-friendly.

### Towards Data Science submission

Only submit methodology pieces. If you write a future post specifically on the commit-velocity-change algorithm (derivative calculation, windowing, thresholds, with code snippets), submit that. Do not submit the current blog posts; they're too product-oriented for TDS's editorial bar.

---

## Medium Notes (bonus)

Medium has a Notes feature similar to Substack Notes. Post 3-5 short observations per week, each ~40-80 words. Pattern: hook sentence → one specific data point → one-sentence implication. Link sparingly (1 note in 5 should link).

Draft notes are in [07-substack-notes.md](./07-substack-notes.md) — they cross-post to Medium Notes with minor edits (Medium Notes allow slightly longer; 80-120 words works).

---

## Execution checklist

- [ ] **Apr 21:** Create Medium account if not existing, set profile with canonical-URL link to gitdealflow.com
- [ ] **Apr 22:** Submit Post 1 to DataDrivenInvestor
- [ ] **Apr 24:** If DDI accepts or no response, submit Post 2
- [ ] **Apr 28:** Submit Post 3 to The Startup
- [ ] **Weekly:** Post 3-5 Medium Notes (reuse from Substack Notes batch)
- [ ] **30-day review:** Track read time, claps, and referral traffic to gitdealflow.com. If any post crosses 1k reads, write a follow-up piece and link from it.

**Hard rule:** Canonical URL must be set on every Medium post before publishing. Miss this once and Google consolidates ranking to Medium instead of gitdealflow.com. Worth re-checking after publish via `view-source` on the Medium page — the `<link rel="canonical">` should point to gitdealflow.com.
