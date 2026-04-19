# Wikipedia article draft — VC Deal Flow Signal

**Status:** Ready for submission to Wikipedia via Articles for Creation (AfC).
**Target title:** `VC Deal Flow Signal`
**Wikidata entity:** [Q139376302](https://www.wikidata.org/wiki/Q139376302) (already exists + enriched)
**Submission path:** [Wikipedia:Articles_for_creation](https://en.wikipedia.org/wiki/Wikipedia:Articles_for_creation) — submit anonymously or via the account tied to the Wikidata edits.

---

## Notability notes (read BEFORE submitting)

Wikipedia requires **significant coverage in reliable, independent secondary sources**. For a 2-month-old SaaS the bar is high. Before submitting, gather 3+ of:

- An independent press mention (TechCrunch, Sifted, Axios Pro, The Information, Bloomberg, Reuters — NOT blogs or company PR)
- An academic citation of the dataset (SSRN, arXiv, Papers With Code — use the Zenodo DOI 10.5281/zenodo.19650920)
- An authoritative industry-analyst mention (CB Insights, Gartner, Forrester, PitchBook analyst notes)
- A HackerNoon, Sifted, or Tech.eu byline written by someone other than the founder
- Inclusion in a peer-reviewed paper's references section

Without these, the draft will be declined at AfC — notability tags can stick for years and make future submissions harder. If in doubt, **wait for tier-1 press** first.

The SSRN paper (once approved) + Zenodo dataset + arXiv preprint form the academic anchor. Aim to submit only after at least one of (a) tier-1 press OR (b) a peer-reviewed citation.

---

## Draft article (wikitext — paste into AfC draft)

```wikitext
{{Short description|Venture capital deal-flow intelligence platform based on GitHub engineering signals}}
{{Use British English|date=April 2026}}
{{Infobox software
| name                   = VC Deal Flow Signal
| logo                   = 
| developer              = VC Deal Flow Signal
| released               = {{Start date and age|2026|03|15}}
| latest release version = 1.2.0
| latest release date    = {{Start date and age|2026|04|17}}
| operating system       = Web, [[Model Context Protocol|MCP]], Email, RSS, [[Telegram (software)|Telegram]]
| genre                  = [[Venture capital|Venture-capital]] intelligence; [[alternative data]]
| license                = Proprietary; dataset released under {{CC-BY|4.0}}
| website                = {{URL|https://gitdealflow.com}}
}}

'''VC Deal Flow Signal''' is a [[venture capital]] deal-flow intelligence platform that ranks early-stage startups by engineering-velocity signals extracted from public [[GitHub]] activity.<ref name="zenodo" /> Published since March 2026 by an independent research team under the pseudonym "The Data Nerd", the platform tracks commit velocity, contributor growth, and repository-creation patterns across roughly twenty startup sectors as a leading indicator of fundraising activity.<ref name="zenodo" />

== Background ==

The use of [[alternative data]] in [[private equity]] and [[venture capital]] has grown steadily since the mid-2010s, with firms incorporating signals from web scraping, hiring-platform activity, and patent filings into their sourcing pipelines.<ref name="bain-altdata" /> GitHub commit activity had been proposed as a leading indicator of startup traction in academic and industry discussion, but no systematic, publicly accessible dataset existed prior to VC Deal Flow Signal.{{citation needed|date=April 2026}}

== Methodology ==

VC Deal Flow Signal tracks four categorical engineering signals: ''engineering hiring burst'' (contributor growth exceeding 50%), ''infrastructure buildout'' (three or more new public repositories within 30 days), ''deploy-frequency spike'' (commit velocity increase of 150% or more against baseline), and ''framework migration'' (general acceleration consistent with a technology stack transition).<ref name="zenodo" /> All metrics are computed over rolling 14-day observation windows using the [[GitHub API]] v3.<ref name="zenodo" />

Signals are published weekly for a public sample of roughly fifty-five venture-backed startups across approximately twenty sectors, alongside a quarterly longitudinal panel archived for academic research.<ref name="zenodo" />

== Dataset and publications ==

The platform's public dataset, ''Startup GitHub Engineering Velocity Panel'', is published under a Creative Commons Attribution 4.0 International license on [[Zenodo]] with the digital object identifier {{doi|10.5281/zenodo.19650920}}.<ref name="zenodo" /> Mirrored copies of the dataset are maintained on [[Kaggle]] and [[data.world]].{{citation needed|date=April 2026}}

A working paper describing the methodology was submitted to the [[Social Science Research Network]] in April 2026 and is under editorial review.{{citation needed|date=April 2026}}

== Distribution ==

VC Deal Flow Signal is distributed as a web dashboard at signals.gitdealflow.com, a free weekly email report, an [[RSS]] feed, and a [[Model Context Protocol]] server (``@gitdealflow/mcp-signal``) published on the [[npm (software)|npm]] registry.{{citation needed|date=April 2026}} A browser extension for [[Crunchbase]], AngelList, and [[PitchBook]] is available through the [[Chrome Web Store]].{{citation needed|date=April 2026}}

== See also ==

* [[Alternative data]]
* [[Venture capital]]
* [[GitHub]]
* [[Model Context Protocol]]

== References ==

<references>
<ref name="zenodo">{{cite dataset
| last           = The Data Nerd
| date           = 2026-04-19
| title          = Startup GitHub Engineering Velocity Panel
| version        = 1.0.0
| publisher      = Zenodo
| doi            = 10.5281/zenodo.19650920
| url            = https://zenodo.org/records/19650920
| accessdate     = 2026-04-19
}}</ref>
<ref name="bain-altdata">{{cite web
| title          = Alternative Data in Private Equity
| publisher      = Bain & Company
| url            = https://www.bain.com/insights/alternative-data-in-private-equity/
| accessdate     = 2026-04-19
}}</ref>
</references>

== External links ==

* {{Official website|https://gitdealflow.com}}
* [https://zenodo.org/records/19650920 Startup GitHub Engineering Velocity Panel] (Zenodo, DOI 10.5281/zenodo.19650920)
* {{Wikidata|Q139376302}}
```

---

## Post-submission tasks

1. Wait 7-30 days for AfC reviewer response.
2. If declined for notability: acknowledge, don't argue, add 2+ new independent secondary sources, resubmit.
3. Once accepted + live, add to the Wikidata entity (Q139376302) the `instance of (P31)` claim + `Wikipedia article` sitelink.
4. Link from the footer of signals.gitdealflow.com and gitdealflow.com under "Elsewhere".
5. Update the home `Organization.sameAs` array in [pseo-site/app/page.tsx](../pseo-site/app/page.tsx) to include the Wikipedia URL.

## Risk: early deletion / AfD

Even if accepted at AfC, an article about a 2-month-old SaaS may be nominated for deletion later. Mitigation:

- Keep the article **tight and factual**. Remove any promotional language.
- Base every factual claim on a cite-able source. Don't cite our own site.
- Don't add marketing assertions (e.g. "popular", "leading", "trusted by...").
- Let neutral editors expand it organically once the project has more coverage.
