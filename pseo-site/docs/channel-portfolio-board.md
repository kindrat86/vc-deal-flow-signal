# GitDealFlow Channel Portfolio Board

**Canonical source:** this file is the only lifecycle board for GitDealFlow distribution channels.

**Updated:** 2026-08-20, Europe/Athens
**Owner:** GitDealFlow
**Scope:** channels that can place GitDealFlow, its data, or its content in front of buyers, developers, agents, researchers, or credible amplifiers. Search ranking itself is excluded.

## Status contract

| Status | Exact meaning |
|---|---|
| **LIVE** | Public or operational now, with a verified route to reach. A listing may be live but still be maintenance-only. |
| **STAGED** | Asset, account, copy, package, or plan exists, but no current external reach is verified. |
| **BLOCKED** | Ready or attempted, but an external gate prevents activation: login, permission, moderation, membership, CAPTCHA, payment, or maintainer review. |
| **KILLED** | Deliberately stopped. Do not revive without a new explicit decision and fresh evidence. |

A row can use only one of those four labels. If state changes, update this file first. Other plans and logs may hold execution details, but they do not override this board.

## Portfolio status snapshot

| Status | Channels | Share |
|---|---:|---:|
| **LIVE** | 52 | 33.5% |
| **STAGED** | 44 | 28.4% |
| **BLOCKED** | 36 | 23.2% |
| **KILLED** | 23 | 14.8% |
| **Total** | **155** | **100%** |

Only 52 of 155 known channels are live. Many of those 52 are proof or passive listings rather than active buyer reach, so the board does not treat “live” as “working.”

## Decision snapshot

- **Scale buyer reach:** Sunday digest, X, LinkedIn company page, safe Reddit communities, earned newsletter/editorial placements, podcast guesting, and scout-program partnerships.
- **Maintain as proof:** websites, APIs, MCP listings, npm, GitHub, Chrome listings, datasets, and research indexes.
- **Clear valuable gates:** Telegram posting rights, HN account restoration, HackerNoon review, Capterra family review, GoodFirms review, and selected investor communities.
- **Do not spend on:** Reddit Ads, personal LinkedIn, prohibited Reddit communities, generic buyer cold email, paid LinkedIn, broad display, or further badge-issue blasting.

## Ground truth used for this classification

- 30-day distribution file, generated 2026-08-20: 630 human visitors, 87 qualified visitors, 39.2% explicit UTM coverage, and 0% tracking-link registry coverage.
- Managed-channel evidence: GitHub 10 visitors and 1 qualified, LinkedIn 3 and 1, X 1 and 1, Dev.to 1 and 0, outreach email 3 and 0, Reddit paid 226 and 0.
- Owned-audience evidence: 30 active email subscribers, LinkedIn company page 12 followers, X 3 followers, Discord 1 member, Telegram 1 subscriber.
- Fresh HN API check on 2026-08-20: `SipitenoMK` has 24 submitted items, 24 dead, 0 live. `the_data_nerd` no longer exists.
- Fresh public probes on 2026-08-20 confirmed both sites, RSS, X, LinkedIn company page, Telegram, Discord invite, Substack, Dev.to, Hashnode, Product Hunt, both Reddit posts, GitHub repos, Official MCP Registry, Glama, Smithery, both Chrome listings, Kaggle, Zenodo, Figshare, ORCID, OpenAlex, Semantic Scholar, Wikidata, and JOSS.
- Local execution state comes from the GitDealFlow profile cron registry, Reddit state, delivery logs, directory trackers, research submission state, and Scout Pass status files.

## 1. Owned audience and repeatable publishing

| ID | Channel | POEM and audience | Mode | Status | Evidence now | Next rule |
|---|---|---|---|---|---|---|
| OWN-01 | `gitdealflow.com` landing, tools, and lead magnets | Owned, buyer | Always-on | **LIVE** | HTTP 200. Direct traffic produced 250 human visitors and 37 qualified in the 30-day window. | Maintain. Do not confuse more pages with more distribution. |
| OWN-02 | `signals.gitdealflow.com` data product and free surfaces | Owned, mixed | Always-on | **LIVE** | HTTP 200. Public data, tools, API, pricing, research, and Scout surfaces are reachable. | Maintain as product plus proof surface. |
| OWN-03 | Free Sunday Signal Digest | Owned, buyer | Weekly send | **LIVE** | 30 active subscribers. `gitdealflow-sunday-digest` is enabled for Sunday 16:00 EEST; daily subscriber-count job is healthy. | Scale list growth and report opens, clicks, and qualified visits weekly. |
| OWN-04 | Welcome and nurture sequence | Owned, buyer | Lifecycle email | **STAGED** | Copy exists, but `gitdealflow-soap-opera` is disabled. | Re-enable only after confirming current copy, suppression checks, and exact trigger path. |
| OWN-05 | Re-engagement and Seinfeld sequence | Owned, buyer | Lifecycle email | **STAGED** | Email assets exist, but no verified active re-engagement sender is running. | Activate only for consented, unsuppressed subscribers with a measured holdout. |
| OWN-06 | GitDealFlow Substack | Owned, mixed | Publication | **LIVE** | `https://gitdealflow.substack.com` returned HTTP 200. | Use only buyer-facing data stories; tag every outbound link. |
| OWN-07 | Telegram `@gitdealflow` | Owned, buyer | Broadcast | **BLOCKED** | Public channel returns HTTP 200, but it has 1 subscriber and stale cadence. The correction cron is still waiting because the bot lacks posting rights; no success state exists. | Add the GDF bot as channel admin with posting rights, then verify one real post. |
| OWN-08 | GitDealFlow Scout Network on Discord | Owned, mixed | Community | **LIVE** | Invite `Fdd9mH3M6q` resolves to “GitDealFlow Scout Network.” Audit count is 1 member. | Keep live, but call it active reach only after a weekly data drop and member growth. |
| OWN-09 | RSS and WebSub | Owned, mixed | Feed syndication | **LIVE** | `https://signals.gitdealflow.com/feed.xml` returned HTTP 200. Weekly WebSub ping and RSS submitter jobs are enabled. | Maintain. Track real feed subscribers separately from crawler requests. |
| OWN-10 | Cross-portfolio link mesh | Owned, mixed | Always-on referral | **LIVE** | Portfolio network links are deployed across owned properties. | Maintain tagged links and measure qualified visitors by source property. |
| OWN-11 | Flipboard magazine | Rented, mixed | Syndication listing | **STAGED** | The magazine URL is published in site `sameAs`, but no fresh cadence or reach was verified in this audit. | Reverify once. Keep only if it has public items and measurable referral traffic. |

## 2. Social, community, and editorial publishing

| ID | Channel | POEM and audience | Mode | Status | Evidence now | Next rule |
|---|---|---|---|---|---|---|
| SOC-01 | X `@sipiteno` | Rented, buyer | Weekday publishing | **LIVE** | Public profile returned HTTP 200. Audit: 113 posts, 3 followers, 1 visitor and 1 qualified visitor. Weekday persona cron is enabled and healthy. | Continue data-first posts and replies. Scale only after 30 tagged visitors. |
| SOC-02 | LinkedIn GitDealFlow company page | Rented, buyer | Weekly publishing | **LIVE** | Public page returned HTTP 200. Audit: 12 followers and 10 recent posts. Weekly company-page job is enabled. | Post only as the company page. Tag every link and track qualified visitors. |
| SOC-03 | Maryan’s personal LinkedIn | Rented, buyer | Personal account | **KILLED** | Standing identity rule forbids agent posts, comments, and DMs from the personal profile. | Never use. Company page only, with explicit approval for outreach. |
| SOC-04 | Reddit `r/datasets` | Rented, mixed | Earned community post | **LIVE** | Post `t3_1vsnjcj` is public, anonymously visible, correctly flaired, and not spam-filtered. | Respect 7-day pacing and ownership disclosure. Measure comments and qualified visits. |
| SOC-05 | Reddit `r/angelinvestors` | Rented, buyer | Earned community post | **LIVE** | Post `t3_1vpt7ev` is public and anonymously visible. It produced no genuine comments in 44 hours. | Keep low frequency. Link in a comment, not the post body. Kill after three clean zero-response tests. |
| SOC-06 | Reddit `r/juststart` | Rented, mixed | Case study | **STAGED** | A dated post package exists in the Reddit distribution folder. No current live placement is recorded. | Post only after pacing gate and current-rule check. |
| SOC-07 | Reddit `r/devops` | Rented, developer | Technical story | **STAGED** | A dated post package exists. Safe only in the correct tools or self-promo context. | Check current rules and weekly thread before any submission. |
| SOC-08 | Prohibited or high-risk Reddit communities | Rented, mixed | Self-promo | **KILLED** | Account is banned from `r/SaaS`; standing blocked list includes `r/Entrepreneur`, `r/startups`, `r/venturecapital`, `r/microsaas`, `r/SideProject`, `r/angelinvestors` variants where rules disallow the post, `r/fatFIRE`, `r/sidehustle`, and `r/AI_Agents`. | Do not retry, evade, or rotate identities. |
| SOC-09 | Hacker News | Earned, mixed | Show HN and comments | **BLOCKED** | Fresh Firebase check: 24 of 24 `SipitenoMK` items are dead; `the_data_nerd` is gone. Moderator process is human-only and all future writing is Maryan-only. | Wait for moderator-confirmed restoration or merge. No agent drafting, editing, posting, or commenting. |
| SOC-10 | Indie Hackers community | Rented, mixed | Burst plus discussion | **LIVE** | Prior launch follow-up earned 15 upvotes and about 30 substantive comments. | Use sparingly for honest build reports, not repetitive product drops. |
| SOC-11 | On Deck Slack | Rented, buyer | Private community | **BLOCKED** | Data-drop pack exists, but membership and a two-week participation runway are required. | Join honestly, lurk, contribute, then post one native data drop. |
| SOC-12 | VC Stack community | Rented, buyer | Private community | **BLOCKED** | Reply pack exists, but membership is required. | Join only if membership is available and the community permits tools discussion. |
| SOC-13 | GVC Discord | Rented, buyer | Private community | **BLOCKED** | Weekly-summary copy exists, but no verified membership or posting path exists. | Join and follow server rules before any brand mention. |
| SOC-14 | Sifted and EUVC community surfaces | Earned, buyer | European data angle | **BLOCKED** | Draft angle exists, but access or editor acceptance is required. | Use the European data story only after a real opening or invitation. |
| SOC-15 | Newsletter comment threads | Earned, buyer | Native comments | **STAGED** | No-link comment templates exist; no repeatable logged placement cadence exists. | Comment only in a real relevant thread. Profile carries the link. |
| SOC-16 | Facebook and LinkedIn groups | Rented, buyer | Group participation | **STAGED** | No verified active group membership or current placement log. | Activate only one tightly matched investor group after rules review. |
| SOC-17 | Quora | Rented, mixed | Answers | **STAGED** | Historical account and drafts exist, but no fresh public answer URL or current cadence was verified. | Reverify the account once. Kill if answers are not public or buyer-aligned. |
| SOC-18 | Stack Exchange network | Earned, developer and research | Answers | **STAGED** | Five answer drafts exist. No live placement is recorded. | Post only when an answer directly solves an existing question and disclosure is allowed. |
| SOC-19 | Dev.to | Rented, developer | Weekly cross-post | **LIVE** | Public profile returned HTTP 200. Distribution file recorded one recent visitor and zero qualified. Weekly cross-post job is enabled. | Keep as developer proof. Do not treat it as a primary buyer channel. |
| SOC-20 | Medium | Rented, mixed | Syndication | **LIVE** | Public profile exists; audit counted five posts, 16 views, and 3 reads. | Maintenance-only until it sends tagged qualified traffic. |
| SOC-21 | Hashnode | Rented, developer | Syndication | **LIVE** | `https://gitdealflow.hashnode.dev` returned HTTP 200 with public articles. | Maintain canonical links. No extra cadence without qualified traffic. |
| SOC-22 | HackerNoon | Earned, mixed | Editorial publication | **BLOCKED** | Two stories are in editorial review; the latest has draft ID `6a84df60a9af8641a927e1ff`. No live article URL yet. | Wait for editorial result. Do not resubmit duplicates. |
| SOC-23 | Bluesky | Rented, mixed | Social feed | **KILLED** | One warm-up post existed, but no buyer reach or current cadence was verified. | Do not feed another low-fit social queue. |
| SOC-24 | Mastodon | Rented, mixed | Social feed | **KILLED** | One warm-up post existed, but no buyer reach or current cadence was verified. | Do not feed another low-fit social queue. |
| SOC-25 | Farcaster | Rented, developer | Social feed | **KILLED** | Queue was draft-only and required missing provider access. Buyer fit is weak. | Do not activate absent new buyer evidence. |
| SOC-26 | YouTube | Rented, mixed | Long-form demo | **STAGED** | Script and upload workflow exist, but this audit did not verify a public GitDealFlow video URL or recurring channel. | Publish one factual five-minute demo, then classify by real views and qualified clicks. |
| SOC-27 | Short-form video clips | Rented, mixed | Repurposing | **STAGED** | Scripts and visual assets exist, but no current repeatable publishing loop is verified. | Produce only from a proven long-form asset, not as a separate content factory. |

## 3. Product, startup, review, and software directories

| ID | Channel | POEM and audience | Mode | Status | Evidence now | Next rule |
|---|---|---|---|---|---|---|
| DIR-01 | Product Hunt | Rented, mixed | Product listing | **LIVE** | Public listing returned HTTP 200. It was not featured and had zero votes at launch in the audit snapshot. | Correct stale copy when logged in. Keep as proof, not an active growth source. |
| DIR-02 | Launch Llama | Rented, mixed | Launch listing | **LIVE** | Audit: 9 upvotes and 1 comment. | Maintenance-only. Do not manufacture launch activity. |
| DIR-03 | Uneed | Rented, mixed | Product listing | **LIVE** | It sent 4 visitors in the current 30-day referral data. | Keep listing current and tagged. Scale only if qualified rate becomes measurable. |
| DIR-04 | AlternativeTo | Rented, buyer | Alternatives listing | **LIVE** | Public listing is referenced by Wikidata and sent 1 visitor in the current referral data. Automated probe hit the site WAF, not a missing listing. | Maintain copy and competitor set. Do not pay for queue acceleration. |
| DIR-05 | G2 | Rented, buyer | Review profile | **LIVE** | Claimed profile and pricing are public. The free tier does not expose a clickable website CTA. | Keep free brand presence. Do not buy Starter without lead evidence. |
| DIR-06 | Capterra | Rented, buyer | Review profile | **BLOCKED** | Submission is pending editorial publication; daily publication monitor is healthy. | Wait. Do not resubmit. |
| DIR-07 | GetApp | Rented, buyer | Review profile | **BLOCKED** | It depends on the same Gartner Digital Markets approval as Capterra. | Wait for the parent review result. |
| DIR-08 | Software Advice | Rented, buyer | Review profile | **BLOCKED** | It depends on the same Gartner Digital Markets approval as Capterra. | Wait for the parent review result. |
| DIR-09 | GoodFirms | Rented, buyer | Vendor profile | **BLOCKED** | Vendor 222151 was registered and entered review; public verification is still WAF or editorial gated. | Wait for review. Re-login only if an edit is requested. |
| DIR-10 | Launching Next | Rented, mixed | Startup listing | **BLOCKED** | Submission 144926 is in the free 2 to 4 month queue. | Never resubmit. Wait for the monitor. |
| DIR-11 | SaaSHub | Rented, buyer | Alternatives listing | **STAGED** | An older checklist says approved, but no fresh public page or current referral was verified on 2026-08-20. | Reverify once and promote to LIVE only with a public URL. |
| DIR-12 | StackShare | Rented, developer | Tool profile | **LIVE** | Public profile and dofollow “Try It” link were verified in the directory tracker. | Maintain as proof. |
| DIR-13 | Crunchbase | Rented, buyer | Company profile | **LIVE** | Company profile exists and is linked in structured data. Public automation hits a WAF. | Maintain factual company data. It is a verification channel, not early-signal reach. |
| DIR-14 | Indie Hackers product listing | Rented, mixed | Product listing | **LIVE** | Product was listed and the community launch produced real discussion. | Keep current, but avoid duplicate launch posts. |
| DIR-15 | SideProjectors | Rented, mixed | Startup listing | **STAGED** | Submitted historically; no fresh public listing was verified. | Reverify once. Kill if still absent. |
| DIR-16 | StartupRanking | Rented, mixed | Startup listing | **BLOCKED** | Ownership was verified, but the free approval queue was 80 or more days. | Wait. Do not pay for approval. |
| DIR-17 | 10words | Rented, mixed | Startup listing | **BLOCKED** | Submitted to a multi-year queue. | Leave parked. No follow-up effort. |
| DIR-18 | VentureRadar | Rented, buyer | Company listing | **STAGED** | Submitted historically; no fresh public page was verified. | Reverify once, then kill if absent. |
| DIR-19 | Dealroom for Builders | Rented, buyer | Company listing | **STAGED** | Application was made historically; no fresh approval proof was verified. | Reverify once, then close the loop. |
| DIR-20 | FutureTools | Rented, developer | AI tool listing | **STAGED** | An older checklist says live, but no fresh page or qualified referral was verified. | Reverify once. Keep only as proof. |
| DIR-21 | AItoolslist.io | Rented, developer | AI tool listing | **STAGED** | An older checklist says live, but no fresh page or qualified referral was verified. | Reverify once. Keep only as proof. |
| DIR-22 | BetaList | Rented, mixed | Startup listing | **STAGED** | Named in the directory backlog; no submission or listing proof. | Submit only if the free path remains available. |
| DIR-23 | Microlaunch | Rented, mixed | Launch listing | **STAGED** | Named in the directory backlog; no submission or listing proof. | One free submission test, then stop. |
| DIR-24 | Startup Stash | Rented, mixed | Curated directory | **STAGED** | Named in the directory backlog; no submission or listing proof. | Submit only with a factual category fit. |
| DIR-25 | BetaPage | Rented, mixed | Startup listing | **STAGED** | Named in the directory backlog; no submission or listing proof. | One free submission test, then stop. |
| DIR-26 | OpenHunts | Rented, mixed | Launch listing | **STAGED** | Named in the directory backlog; no submission or listing proof. | One free submission test, then stop. |
| DIR-27 | Peerlist Launchpad | Rented, developer | Launch listing | **STAGED** | Named in the directory backlog; no submission or listing proof. | Use only if an existing account can submit without spam. |
| DIR-28 | Wellfound | Rented, buyer | Company and tool profile | **STAGED** | A submission guide exists, but no verified live GitDealFlow profile. | Submit once through the normal company path. |
| DIR-29 | F6S | Rented, mixed | Startup profile | **STAGED** | Backlog only; no submission proof. | Low priority. Use only the free path. |
| DIR-30 | TrustRadius | Rented, buyer | Review profile | **STAGED** | Backlog only; no submission proof. | Activate only if a free vendor profile is available. |
| DIR-31 | SaaSworthy | Rented, buyer | Software profile | **STAGED** | Backlog only; no submission proof. | Activate only if the free path is available. |
| DIR-32 | SoftwareSuggest | Rented, buyer | Software profile | **STAGED** | Backlog only; no submission proof. | Activate only if the free path is available. |
| DIR-33 | There’s An AI For That | Rented, developer | Paid directory | **KILLED** | Minimum paid submission and weak buyer fit. | Do not pay. |
| DIR-34 | AppSumo and deal marketplaces | Paid or rented, mixed | Discount launch | **KILLED** | No validated deal offer or support capacity; channel conflicts with buyer-first positioning. | Do not launch a discount deal pre-PMF. |

## 4. Agent, developer, extension, and protocol distribution

These surfaces are proof and agent distribution. They are not primary buyer-acquisition channels.

| ID | Channel | POEM and audience | Mode | Status | Evidence now | Next rule |
|---|---|---|---|---|---|---|
| AGT-01 | Public API, A2A, NLWeb, OpenAPI, and function-calling surfaces | Owned, agent | Always-on protocol | **LIVE** | Public endpoints are deployed. Audit counted 5,331 agent requests from 110 distinct agents. | Maintain reliability and truth. Do not score agent requests as human buyers. |
| AGT-02 | Official MCP Registry | Earned, agent | Registry listing | **LIVE** | Registry API returned the GitDealFlow server. Version 2.2.1 includes the hosted remote. | Maintenance-only. Publish updates when the server changes. |
| AGT-03 | Glama | Earned, agent | MCP listing | **LIVE** | Public listing returned HTTP 200. | Maintain metadata. No recurring distribution work. |
| AGT-04 | Smithery | Earned, agent | MCP listing | **LIVE** | Public listing returned HTTP 200. | Maintain metadata. No recurring distribution work. |
| AGT-05 | mcp.so | Earned, agent | MCP listing | **BLOCKED** | Three submission issues already exist and await maintainer review. | Do not create another issue. |
| AGT-06 | PulseMCP | Earned, agent | MCP listing | **BLOCKED** | Submissions were paused; Official Registry auto-ingestion is the approved fallback. | Wait for auto-ingestion. No manual chase unless submissions reopen. |
| AGT-07 | MCPT directory | Earned, agent | MCP listing | **KILLED** | No verified listing and the strategic correction says extra MCP directory work is low ROI. | Do not spend more buyer-distribution time here. |
| AGT-08 | OpenTools directory | Earned, agent | Tool listing | **KILLED** | No verified listing and the strategic correction says extra agent-directory work is low ROI. | Do not spend more buyer-distribution time here. |
| AGT-09 | `awesome-mcp-servers` | Earned, developer | Curated GitHub list | **LIVE** | Entry is merged. A factual 20 to 15 sector correction PR remains maintainer-side. | Maintain the claim correction only. |
| AGT-10 | `awesome-ai-agents` | Earned, developer | Curated GitHub list | **BLOCKED** | Issue 890 and a factual follow-up are posted; maintainer has not accepted it. | One polite maintainer follow-up only, then stop. |
| AGT-11 | npm `@gitdealflow/mcp-signal` | Rented, developer | Package registry | **LIVE** | Audit: 471 downloads last week and 817 last month. | Keep package healthy. Treat downloads as developer reach, not buyer demand. |
| AGT-12 | PyPI | Rented, developer | Package registry | **KILLED** | There is no supported Python package and no need to duplicate the npm MCP client. | Do not publish a placeholder package. |
| AGT-13 | GitHub MCP repository | Earned, developer | Open-source repository | **LIVE** | Public repo returned HTTP 200. | Maintain source, install path, and truthful metadata. |
| AGT-14 | GitHub signal-engine repository | Earned, developer and research | Open-source repository | **LIVE** | Public repo returned HTTP 200; JOSS pre-review is linked to it. | Maintain tests and reproducibility. Do not mass-promote it to buyers. |
| AGT-15 | Chrome Web Store, Crunchbase and Wellfound extension | Rented, mixed | Extension listing | **LIVE** | Listing ID `hehkgipiamajnnlpkfhpeoeaoaogmknn` returned HTTP 200. | Maintenance-only proof asset. Keep copy truthful. |
| AGT-16 | Chrome Web Store, GitHub hover extension | Rented, developer | Extension listing | **LIVE** | Listing ID `plgngijmloeljfkenecdkhiblcfcbblm` returned HTTP 200. | Maintenance-only proof asset. Keep copy truthful. |
| AGT-17 | Microsoft Edge Add-ons | Rented, mixed | Extension listing | **BLOCKED** | Package and copy exist, but first submission requires the user’s Microsoft account. | Upload once when the human gate is available. No recurring effort. |
| AGT-18 | Firefox AMO | Rented, mixed | Extension listing | **BLOCKED** | Package and copy exist, but first submission requires the user’s Mozilla account. | Upload once when the human gate is available. No recurring effort. |
| AGT-19 | Hugging Face dataset | Earned, developer and research | Dataset registry | **LIVE** | `the-data-nerd/vc-deal-flow-signal` returned HTTP 200. Audit recorded 32 downloads on the primary dataset. | Maintain the canonical card and data freshness. |
| AGT-20 | Cursor community forum | Rented, developer | Native forum post | **BLOCKED** | A current post draft exists, but the account and manual posting path are required. | Post only if it solves a current Cursor workflow question. |
| AGT-21 | Anthropic connectors and agent directories | Earned, agent | Directory submission | **STAGED** | Submission copy exists, but no verified live placement. | Reverify the current submission path once, then stop. |

## 5. Research, datasets, citation, and academic distribution

| ID | Channel | POEM and audience | Mode | Status | Evidence now | Next rule |
|---|---|---|---|---|---|---|
| RES-01 | SSRN | Earned, research and buyer proof | Preprint | **LIVE** | Paper 6606558 is approved and public. Automated requests hit a bot wall, while the canonical record is indexed elsewhere. | Maintain canonical metadata and cite the exact paper. |
| RES-02 | Zenodo | Earned, research | Dataset archive | **LIVE** | Record 19650920 returned HTTP 200; DOI `10.5281/zenodo.19650920`. | Keep as the canonical dataset archive. |
| RES-03 | Kaggle | Rented, developer and research | Dataset mirror | **LIVE** | Public dataset URL responds through a browser check. | Maintain only if data refreshes remain cheap and truthful. |
| RES-04 | Data.world | Rented, research | Dataset mirror | **KILLED** | The old dataset URL now redirects to Data.world’s community goodbye page. | Remove it from active-channel claims. Keep only as historical evidence. |
| RES-05 | Figshare | Earned, research | Dataset mirror | **LIVE** | Published item 33276765 and DOI `10.6084/m9.figshare.33276765.v1` are recorded; public request was accepted. | Maintain metadata. No duplicate dataset marketing. |
| RES-06 | ORCID | Earned, research | Author identity | **LIVE** | ORCID `0009-0002-2222-4112` returned HTTP 200. | Keep works and identity consistent. |
| RES-07 | OpenAlex | Earned, research | Citation graph | **LIVE** | DOI lookup returned paper `W7154992629`; dataset record also exists. | Wait for graph propagation. No repeated support requests before due date. |
| RES-08 | Semantic Scholar | Earned, research | Citation graph | **LIVE** | DOI lookup returned paper ID `4dd7b11e79757f68e0c4107252514cbfdfbb0462`. | Maintain canonical DOI and author links. |
| RES-09 | Wikidata product and paper entities | Earned, mixed | Knowledge graph | **LIVE** | Both Q139376302 and Q139493250 returned HTTP 200 with enriched claims. | Maintain only factual, sourced changes. |
| RES-10 | DataCite | Earned, research | DOI index | **LIVE** | Zenodo DOI is findable through DataCite. | No action beyond metadata consistency. |
| RES-11 | ICPSR | Earned, research | Dataset archive | **BLOCKED** | The claimed study URL currently renders “Study Error” in a fresh public probe. | Verify in a real browser or correct the record before calling it live. |
| RES-12 | OSF Preprints and SocArXiv | Earned, research | Preprint | **BLOCKED** | Resubmitted after two moderation rejections; currently pending moderator review. | Wait for the decision. Do not resubmit another duplicate. |
| RES-13 | ResearchGate | Rented, research | Author upload | **STAGED** | Draft exists; account has not been verified. | Create only if the exact paper can be uploaded under policy. |
| RES-14 | MPRA and RePEc | Earned, research | Working-paper index | **BLOCKED** | Deposit 130499 is awaiting editor review; the URI redirects to login rather than a public paper. | Wait for publication and RePEc propagation. |
| RES-15 | EconStor | Earned, research | Working-paper archive | **BLOCKED** | Email deposit was sent and awaits ZBW review. | Follow up once on the recorded due date. |
| RES-16 | HAL | Earned, research | Preprint archive | **BLOCKED** | HAL record is submitted and awaiting moderation; public probe reaches the anti-bot page. | Wait for moderation. |
| RES-17 | Research Square | Earned, research | Preprint | **BLOCKED** | Two submissions are in QA or QC; public URL redirects to sign-in. | Resolve the duplicate if asked, then wait for the editorial result. |
| RES-18 | Harvard Dataverse | Earned, research | Dataset mirror | **KILLED** | Curator rejected the deposit as a duplicate of Zenodo and the draft was removed. | Never reattempt the same mirror. |
| RES-19 | Dryad | Earned, research | Dataset archive | **BLOCKED** | Reserved DOI exists, but the final step requires payment and explicit authorization. | Do not pay or submit without Maryan’s approval. |
| RES-20 | DANS SSH Data Station | Earned, research | Dataset archive | **BLOCKED** | Deposit is in progress but the JavaScript flow blocks completion. | Resume only through the normal authenticated deposit flow. |
| RES-21 | SciELO Preprints | Earned, research | Preprint | **BLOCKED** | reCAPTCHA blocks submission. | Human gate only. No solver service. |
| RES-22 | engrXiv | Earned, research | Preprint | **BLOCKED** | Requires an OSF login and accepted account state. | Revisit only after OSF account state is clean. |
| RES-23 | IEEE DataPort | Rented, research | Dataset archive | **STAGED** | Account and deposit are not created. | Low priority behind the live canonical archive. |
| RES-24 | ScienceOpen | Earned, research | Research index | **BLOCKED** | ORCID OAuth and form flow are unresolved. | Resume only through normal OAuth. |
| RES-25 | Mendeley Data | Rented, research | Dataset archive | **STAGED** | Draft exists and requires Elsevier OAuth. | Low priority. Use only if it adds unique reach. |
| RES-26 | Humanities Commons | Rented, research | Repository | **STAGED** | Draft exists; account is missing. | Low priority and weak field fit. |
| RES-27 | Academia.edu | Rented, research | Author upload | **STAGED** | Draft exists; account is missing. | Low priority. Do not pay for promotion. |
| RES-28 | arXiv and Hugging Face Papers | Earned, research | Preprint index | **BLOCKED** | arXiv endorsement is missing, which also blocks the HF Papers path. | Use only the formal endorsement path. |
| RES-29 | JOSS | Earned, developer and research | Journal submission | **LIVE** | Pre-review issue 11168 returned HTTP 200. | Respond to editors and reviewers; no promotional follow-up. |
| RES-30 | IEEE SSCI CIFEr 2027 | Earned, research | Conference submission | **LIVE** | Short paper is submitted and under evaluation, submission `cifer_fsp112`. | Watch reviewer obligations and decision. |
| RES-31 | ACM SAC AIFT 2027 | Earned, research | Conference submission | **LIVE** | Paper is submitted as EasyChair 7791471. | Wait for review and answer only official requests. |
| RES-32 | MSR 2027 Data and Tool Showcase | Earned, developer and research | Conference submission | **STAGED** | Paper is ready, but the correct portal is not open yet. | Watch the official portal and submit when it opens. |
| RES-33 | ICAIF 2027 | Earned, research | Conference submission | **STAGED** | Draft is ready, but the 2027 CFP is not published. | Watch the official CFP only. |
| RES-34 | Google Scholar | Earned, research | Citation index | **STAGED** | No fresh public indexed result was verified. | Let DOI and repository propagation work; do not force it. |
| RES-35 | Researcher and university citation outreach | Earned, research | Curated outreach | **LIVE** | Two verified waves were sent; follow-up is capped at one and guarded by reply checks. | Finish the one allowed follow-up, then stop. |

## 6. Referrals, partnerships, earned media, and viral loops

| ID | Channel | POEM and audience | Mode | Status | Evidence now | Next rule |
|---|---|---|---|---|---|---|
| PAR-01 | Newsletter embed widget | Earned, buyer | Embedded distribution | **STAGED** | Pitch assets exist, but `https://gitdealflow.com/widget` returns 404 and the audit found no confirmed external embeds. | Ship one stable public widget URL before further pitching. |
| PAR-02 | Newsletter and editorial pitches | Earned, buyer | Curated campaign | **LIVE** | Seven recent newsletter pitches were delivered; wave sender and reply scanner jobs are healthy. | Finish the current measured wave. No scraped or mass prospecting. |
| PAR-03 | Podcast guest pitches | Earned, buyer | Curated campaign | **LIVE** | Six verified shows have delivery records; follow-up engine ran successfully on 2026-08-20. | One follow-up maximum, then stop. Guesting only, no paid placement. |
| PAR-04 | Press and data-desk pitches | Earned, buyer | Curated campaign | **LIVE** | Editorial rounds and dated follow-up jobs exist for relevant publications. | Keep evidence-first. Stop after the planned follow-up. |
| PAR-05 | Generic buyer cold email | Paid or owned, buyer | Outbound acquisition | **KILLED** | Prior audit recorded 347 sends and 0 replies; current distribution data shows 3 visitors and 0 qualified. It also conflicts with the community-first rule. | Never restart autonomous mass buyer outreach. |
| PAR-06 | Scout Pass operator campaign | Earned, buyer | Partner outreach | **LIVE** | Scout Pass page returned HTTP 200. Five operator pitches sent: 4 delivered, 1 opened, 1 bounced; guarded follow-up job is active. | Complete the two-step follow-up, then judge replies and introductions. |
| PAR-07 | Individual scout LinkedIn DMs | Rented, buyer | Direct outreach | **BLOCKED** | Safe path cannot use Maryan’s personal profile; Hustle Fund fallback also needs a company-page route. | Use company page only with explicit approval. Never personal DMs. |
| PAR-08 | Affiliate program | Owned and earned, buyer | Referral | **STAGED** | Public `/affiliates` page returned HTTP 200 and offers 30% recurring, but no active affiliate or attributed referral is recorded. | Recruit only through warm partner conversations and issue unique tagged links. |
| PAR-09 | JV and co-marketing program | Owned and earned, buyer | Partnership | **STAGED** | Public `/partners` page returned HTTP 200, but no live co-branded partner distribution is verified. | Land one real partner before calling it live. |
| PAR-10 | API and platform integration partnerships | Earned, buyer and agent | Integration | **STAGED** | Public partner offer exists, but no third-party product embeds GitDealFlow signals as a verified distribution channel. | Pursue only one high-fit CRM or investor platform pilot. |
| PAR-11 | “Refer 3, Free For Life” | Owned, buyer | Referral loop | **KILLED** | That is the InvisibleExit referral model, not a verified GitDealFlow offer. | Do not copy another product’s promise into GitDealFlow. |
| PAR-12 | Embeddable Scout and momentum badges | Earned, developer | Viral artifact | **LIVE** | Badge endpoints and builder are deployed; embed watcher exists. | Keep the product live, but judge the loop by real external embeds. |
| PAR-13 | Badge-fleet GitHub issue campaign | Earned, developer | Outbound embed asks | **KILLED** | More than 50 issues were sent, one explicit rejection is logged, and the embed watcher still shows 0 embeds. | No more issue blasting. Leave the passive badge product live. |
| PAR-14 | Advocate and ambassador program | Earned, buyer | Community referrals | **STAGED** | Program mechanics are drafted, but there are no verified active advocates. | Activate only after real scouts or subscribers ask to refer peers. |
| PAR-15 | Newsletter swaps and social DMs | Earned, buyer | Direct partnership | **BLOCKED** | Swap copy exists, but DM send log is empty and there is no approved safe account path for personal-profile DMs. | Use warm email or company-page routes only. |

## 7. Paid distribution and sponsorships

| ID | Channel | POEM and audience | Mode | Status | Evidence now | Next rule |
|---|---|---|---|---|---|---|
| PAD-01 | Reddit Ads | Paid, mixed | Paid acquisition | **KILLED** | 226 human visitors produced 0 qualified visitors. | No relaunch. Keep the verdict job only for final accounting. |
| PAD-02 | LinkedIn paid campaigns | Paid, buyer | Paid acquisition | **KILLED** | Standing rule says no LinkedIn campaigns. Organic company-page use is separate. | Never launch without a new explicit owner decision. |
| PAD-03 | LinkedIn retargeting audience | Paid infrastructure, buyer | Passive audience build | **BLOCKED** | Insight tag is live, but the matched audience is not verified as created. Campaigns remain forbidden. | Create the audience only if useful for measurement; do not launch ads. |
| PAD-04 | Meta prospecting | Paid, mixed | Paid acquisition | **KILLED** | Community-first stance and no proven buyer angle. Meta Pixel is not configured. | Do not fund broad prospecting. |
| PAD-05 | Meta retargeting | Paid, mixed | Retargeting | **BLOCKED** | Pixel and audience are missing, and the owned audience is tiny. | Revisit only after a meaningful qualified-visitor pool exists. |
| PAD-06 | X Ads | Paid, buyer | Paid acquisition | **KILLED** | Organic account has 3 followers and no paid angle proof. | Build organic buyer signal first. |
| PAD-07 | Google Display Network | Paid, mixed | Display | **KILLED** | Broad display is high-junk and conflicts with the qualified-visitor objective. | Do not launch. |
| PAD-08 | Google Search Ads | Paid, buyer | Search acquisition | **STAGED** | Import-ready brief exists, but paid is paused after the failed Reddit quality test. | Reopen only after an earned channel proves a buyer message and a live budget decision exists. |
| PAD-09 | Newsletter sponsorship | Paid, buyer | Sponsorship | **STAGED** | Sponsorship brief exists, but no earned newsletter placement has validated the angle. | Buy nothing until an earned placement sends qualified visitors. |
| PAD-10 | Podcast sponsorship | Paid, buyer | Sponsorship | **KILLED** | Guest pitches offer the same audience without paid spend. | Pursue guesting, not sponsorship. |
| PAD-11 | Paid creator, influencer, and UGC campaigns | Paid, mixed | Sponsorship | **KILLED** | No creator fit, offer, or qualified-visitor benchmark. | Do not spend pre-PMF. |
| PAD-12 | Paid directory upgrades and queue jumps | Paid, mixed | Listing promotion | **KILLED** | Several directories offer paid acceleration, but no listing has proved enough qualified traffic to justify it. | Stay on free tiers. |

## Operating rules

1. **One board:** no second channel ledger. Link here from plans, audits, and runbooks.
2. **Status evidence:** every promotion to LIVE needs either a public URL or a verified operational send/post path.
3. **Buyer versus proof:** agent requests, downloads, crawler traffic, citations, and listings do not count as qualified human buyer reach.
4. **Attribution:** every managed outbound link uses a registered UTM. Direct, organic, internal, and unknown referrals remain attribution buckets, not managed channel rows.
5. **Pacing and identity:** Reddit follows the account pacing and safe-subreddit rules. HN is Maryan-only. LinkedIn is company-page-only.
6. **Kill discipline:** a KILLED row stays dead until an explicit reopen decision names the new evidence that changed the economics or policy.
7. **Weekly review:** update only rows whose evidence changed. Do not rewrite history or convert pending review into LIVE.
8. **Monthly review:** compare LIVE buyer channels on human visitors, qualified visitors, qualified rate, cash spend, and founder time. Kill or stage channels that fail their pre-registered threshold.

## Next five state changes by ROI

1. **PAR-01, newsletter widget:** ship one stable public embed URL before sending another pitch.
2. **OWN-07, Telegram:** restore bot posting rights and verify one factual post.
3. **SOC-09, HN:** wait for moderator-confirmed account restoration; all writing and posting remain Maryan-only.
4. **DIR-06 to DIR-08, Gartner Digital Markets:** let the monitor close Capterra, GetApp, and Software Advice together; no duplicate submissions.
5. **PAR-09, JV program:** land one actual co-branded partner. A public partners page without a partner is not distribution.
