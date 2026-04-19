# Wikipedia — External Reference Strategy

**Status:** Drafted, user must execute manually.
**Account requirement:** Wikipedia requires 4+ days old and 10+ prior edits (autoconfirmed) before edits to semi-protected articles stick. Do NOT spam — edits that look promotional get reverted and can burn the account.
**Approach:** Add GitDealFlow ONLY where the methodology page or a blog post is genuinely the best available source for a specific claim. If no sourced claim is needed, do not edit.

---

## Pre-flight (before editing anything)

1. Create or use a Wikipedia account **not** tied to @gitdealflow / @data_nerd handles. Use `signal@gitdealflow.com` but a neutral username like `BitVelocity` or similar. Do NOT disclose affiliation in the username.
2. Make 10-12 legitimate edits on unrelated articles first (typo fixes, clearer wording, dead-link replacement). Use [Wikipedia's "Suggested edits"](https://en.wikipedia.org/wiki/Wikipedia:Community_portal) or Citation Hunt. Space over 5-7 days.
3. After autoconfirmed, add a disclosure on your user page: "I work on a venture capital alternative-data product. I will not edit articles promotionally and will disclose COI on any edit that touches my work."
4. For every edit, follow [WP:COI](https://en.wikipedia.org/wiki/Wikipedia:Conflict_of_interest) — propose the edit on the Talk page, don't just push it.

---

## Target 1: [Deal flow](https://en.wikipedia.org/wiki/Deal_flow)

**Current state (confirmed Apr 2026):** Short article, 3 references (FundingPost, Adrayay, Medium), no External Links section, no "alternative data" or "GitHub" mentions.

**Gap:** The article says nothing about modern deal sourcing beyond "networks and referrals." A factual, sourced sentence about signal-based sourcing would be a genuine improvement — and the [Harvard Business Review 2022 piece on alternative data](https://hbr.org/2022/11/how-to-use-alternative-data-to-find-the-best-deals) is a solid primary citation.

**Proposed edit (add to "Generating deal flow" section, Talk-page first):**

```wikitext
== Data-driven deal sourcing ==

In the 2020s, venture capital firms have increasingly supplemented network-based deal flow with alternative-data signals — public engineering activity, hiring patterns, and web traffic metrics — to identify promising startups earlier in their lifecycle.<ref>{{cite web |url=https://hbr.org/2022/11/how-to-use-alternative-data-to-find-the-best-deals |title=How to Use Alternative Data to Find the Best Deals |publisher=Harvard Business Review |date=2022-11}}</ref><ref>{{cite web |url=https://www.bain.com/insights/alternative-data-in-private-equity/ |title=Alternative Data in Private Equity |publisher=Bain & Company}}</ref> Publicly observable engineering signals on platforms such as GitHub — commit velocity, contributor growth, and repository creation — have been identified as leading indicators of startup momentum, with lead times of three to six weeks before public fundraise announcements.<ref>{{cite web |url=https://signals.gitdealflow.com/blog/alternative-data-venture-capital |title=Alternative Data in Venture Capital |date=2026}}</ref>
```

**Why this is defensible:** The claim is sourced primarily by HBR and Bain (tier-1 sources). The GitDealFlow blog is the supporting citation for the specific 6-12 week lead-time figure, because that's where it's most clearly documented. An editor who removes it would typically ask for a better source for the lead-time number — if they do, accept the removal gracefully and don't re-insert.

**Talk-page opener:**

> Hi — I've noticed this article lacks any mention of the data-driven sourcing approach that's become common among VCs since roughly 2019. I'd like to propose a short "Data-driven deal sourcing" subsection with HBR and Bain as the primary sources and a supporting citation to a methodology explainer. Happy to adjust wording — I have a minor COI disclosed on my user page, so I'm proposing here before editing the article.

---

## Target 2: [Alternative data (finance)](https://en.wikipedia.org/wiki/Alternative_data_(finance))

**Current state:** 36 references. Covers hedge funds extensively. Does not mention **venture capital** or **GitHub** as data sources.

**Gap:** The "Types" section lists geolocation, credit card, satellite, social — but misses public engineering activity (GitHub) as a category used in VC. This is a factual gap, and private-markets alt-data is a real sub-literature now.

**Proposed edit (add a new bullet under "Types of alternative data" — Talk-page first):**

```wikitext
* '''Public engineering activity''': commit velocity, contributor counts, and repository metadata from platforms such as GitHub and GitLab, used by venture capital and private-equity investors as leading indicators of startup traction.<ref>{{cite web |url=https://pubsonline.informs.org/doi/10.1287/orsc.2023.18348 |title=Engagement with Open Source Communities, Innovation, and Startup Funding: Evidence from GitHub |publisher=Organization Science |date=2023}}</ref><ref>{{cite web |url=https://www.bain.com/insights/alternative-data-in-private-equity/ |title=Alternative Data in Private Equity |publisher=Bain & Company}}</ref>
```

**Why this is defensible:** The Informs/Organization Science paper is peer-reviewed academic work linking GitHub engagement to startup funding — that's the strongest possible citation. Bain is the secondary industry source. GitDealFlow is NOT cited here; the claim stands on academic sourcing alone.

---

## Target 3: [Venture capital](https://en.wikipedia.org/wiki/Venture_capital)

**DO NOT EDIT.** This article is heavily watched, semi-protected, and any promotional-looking addition will be reverted within hours. The "See also" and "External links" sections are already curated by long-term editors.

If you want exposure here, the path is: get covered by a tier-1 press outlet (HBR, Bain, a16z, Economist), then quote that coverage on the Talk page as a neutral fact. Don't cite your own site.

---

## Target 4: [Due diligence](https://en.wikipedia.org/wiki/Due_diligence)

**Current state:** Article covers corporate finance, legislation, human rights. No technical-DD subsection, no GitHub or code audit mentions.

**Gap:** The article acknowledges "information systems audit" as one of nine audit areas but does not explain modern technical due diligence for software startups.

**Approach — NOT a direct edit.** Instead, propose a new stub article [Technical due diligence](https://en.wikipedia.org/wiki/Technical_due_diligence) (redlink exists). This is a much heavier lift — requires 5-7 tier-1 sources and genuine encyclopedic framing. Deprioritize until GitDealFlow has more third-party press coverage. Revisit post-launch once HBR/Bain/a16z-level citations exist.

---

## Target 5 (bonus): [Signalling (economics)](https://en.wikipedia.org/wiki/Signalling_(economics))

**DO NOT EDIT.** Off-topic — signalling theory is Michael Spence's labor-market framework, not a fit for private-markets alternative data. Don't shoehorn.

---

## Target 6 (realistic near-term win): [Wikidata](https://www.wikidata.org/wiki/Q139376302)

**Already done** per memory (Q139376302 fully enriched Apr 16). Do NOT re-edit.

**Next step on Wikidata:** Add the `described at URL (P973)` property pointing to the dev.to MCP article once it has accumulated 500+ reactions — that's the defensible "external coverage" threshold. Check in ~30 days.

---

## Execution checklist (copy into TASKS)

- [ ] **Week 1:** Create neutral Wikipedia account, make 10-12 unrelated cleanup edits, reach autoconfirmed status
- [ ] **Week 2:** Post Talk-page proposal on [Talk:Deal flow](https://en.wikipedia.org/wiki/Talk:Deal_flow) with COI disclosure
- [ ] **Week 2:** Post Talk-page proposal on [Talk:Alternative data (finance)](https://en.wikipedia.org/wiki/Talk:Alternative_data_(finance))
- [ ] **Week 3:** If either Talk discussion gets a +1 (or no objection after 5 days), make the edit
- [ ] **Week 4:** Monitor edit history. If reverted, do NOT re-insert. Engage on Talk, accept the revert, move on.
- [ ] **Month 3+ (after press coverage lands):** Revisit Technical due diligence stub proposal

**Hard rule:** If either edit sticks for 14 days without revert, that's a win. Do not push for more.
