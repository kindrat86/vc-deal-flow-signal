#!/usr/bin/env python3
"""
Deepen 4 cornerstone articles to full 1,500-2,000 word definitive guides.

Reuses build_page() + the template from _gen_cornerstone_articles.py and
overrides the sections/faqs/lead for four slugs, then rewrites just those pages.

Run: python3 _deepen_cornerstone_articles.py
"""

import os
import re
import importlib.util

HERE = os.path.dirname(os.path.abspath(__file__))
GEN = os.path.join(HERE, "_gen_cornerstone_articles.py")

spec = importlib.util.spec_from_file_location("gen", GEN)
gen = importlib.util.module_from_spec(spec)
spec.loader.exec_module(gen)

BASE_URL = gen.BASE_URL

# ============================================================================
# Deepened content. Facts stay on the evergreen baseline:
# 350+ startups / 15 sectors / 3 signals / 3 to 6 weeks lead / SSRN 6606558 /
# 219-fundraise panel. No invented benchmarks or statistics.
# ============================================================================

DEEPEN = {
    # ── 1. What Is Commit Velocity? ────────────────────────────────────────
    "what-is-commit-velocity": {
        "lead": (
            "Commit velocity is the rate at which a startup's engineers commit code to public "
            "repositories, usually measured in commits per week. It is one of the few leading "
            "indicators of startup traction you can read for free, and it has historically risen "
            "3 to 6 weeks before a fundraise is announced. This guide is the definitive reference: "
            "what commit velocity is, how to calculate and read it yourself on GitHub, what it can "
            "and cannot prove, and how to fold it into a real sourcing and diligence process."
        ),
        "sections": [
            ("What commit velocity actually measures", [
                "Commit velocity counts how frequently a team pushes code to its public repositories. A team shipping daily commits far more often than one that pushes once a month, and that difference shows up immediately in the commit graph. The raw number is noisy, so the useful form is the trend over time: is velocity rising, flat, or falling across 4 to 12 weeks?",
                "Velocity is a proxy for execution, not for code quality. A team that ships constantly is answering the question investors care about most at the earliest stages: can this team actually build and iterate? When revenue and product-market fit are unproven, shipping speed is one of the best available signals of execution capacity.",
                "Three nuances matter from the start. First, velocity is a rate, not a total: commits per unit of time, not lifetime commits. Second, it is a team property, not a single author's: a healthy velocity is spread across contributors, not concentrated in one founder. Third, it is only meaningful as a trend: a single week is a snapshot, and snapshots mislead.",
            ]),
            ("How to calculate commit velocity", [
                "The mechanics are simple enough to do by hand. Pick a repository, count the commits in each of the last 12 weeks, and plot them. Then smooth the noise with a rolling 4-week average. The signal you read is the slope of that smoothed line, not any individual point.",
                "A worked example, using a clearly hypothetical repository:",
                [
                    "Week 1 to 4: 8, 9, 10, 9 commits, a 4-week average of 9.",
                    "Week 5 to 8: 12, 14, 15, 16 commits, a 4-week average of roughly 14.",
                    "Week 9 to 12: 20, 22, 24, 25 commits, a 4-week average of roughly 23.",
                ],
                "That trajectory, from a 9 average to a 23 average over a quarter, is a breakout. A single 25-commit week with no surrounding trend is not. The slope over 8 to 12 weeks is the signal; the rest is noise.",
                "You do not need to do this arithmetic yourself. GitDealFlow computes velocity weekly across 350+ startups and normalizes it by sector, so the breakout shows up as a comparable momentum score rather than a raw count you have to interpret by hand.",
            ]),
            ("Why commit velocity predicts fundraising", [
                "The pattern is causal, not just correlational. When a startup prepares to raise, it accelerates. Founders push to ship the roadmap items they will demo, engineers race to close the gaps diligence will expose, and the team front-loads work before the distraction of a fundraise process absorbs everyone's attention.",
                "That acceleration shows up in public GitHub activity before it shows up anywhere else. A round announcement, a press hit, or a Crunchbase entry is a lagging indicator; the commit spike that preceded it is the leading indicator. GitDealFlow's published methodology (SSRN abstract 6606558, CC BY 4.0) documents this lead time across a research panel of 219 startup-period observations across 55 startups, with signals typically appearing 21 to 47 days before the round hits the press.",
                "The mechanism is intuitive once you see it: fundraising compresses the roadmap, and a compressed roadmap looks like a velocity spike in the commit graph. It is not that founders fabricate activity; it is that the weeks before a raise are genuinely the busiest weeks a team has.",
            ]),
            ("How to read commit velocity on GitHub yourself", [
                "You can verify any velocity claim in a few minutes without any special tooling. On any public repository, open the Insights tab and look at two views:",
                [
                    "Contributors: shows commits per author over time, which reveals both the pace and the concentration of the work.",
                    "Pulse: shows the recent activity summary, including how many commits, pull requests, and issues changed in the last week and month.",
                ],
                "The Contributors view is the more useful of the two for velocity. Look at the trailing 4-week bars for each author: is the total rising across the team, and is the work spread across multiple people? A rising total spread across a growing team is the healthy pattern.",
                "For a whole organization rather than a single repo, the process is the same but slower: visit each active repository and read its Contributors graph. This is exactly the aggregation GitDealFlow automates, because doing it by hand across a portfolio of dozens of companies is not sustainable.",
            ]),
            ("What commit velocity does NOT tell you", [
                "Commit velocity has real limits, and a good investor holds all of them in mind:",
                [
                    "It can be gamed: teams can inflate commits with trivial changes. Sustained velocity over months is hard to fake, but single-week spikes are not evidence of anything.",
                    "It is blind to private work: a team that moved development to private repositories or internal tools disappears from the public signal.",
                    "It says nothing about quality: shipping fast and shipping well are different. Velocity is an execution signal, not a code-quality audit.",
                    "It is sector-dependent: a developer-tools team commits differently from a fintech or biotech team, so raw counts are not comparable across sectors.",
                ],
                "This is why commit velocity should never be used alone. The strongest readings combine velocity with contributor growth and repository expansion, the other two signals GitDealFlow tracks, and then cross-check against qualitative diligence.",
            ]),
            ("Commit velocity vs other GitHub signals", [
                "GitHub exposes several public signals, and they mean different things. Stars and forks measure popularity, not shipping. A repository can accumulate stars while development stalls, and a heavily-forked repo can be abandoned. Stars tell you what other developers found interesting; they say little about whether the team is still building.",
                "Contributor growth measures team expansion, repository creation measures direction, and commit velocity measures pace. Of the three, velocity is the most direct execution signal, but it is most valuable when all three move together: a team that is shipping faster, with a growing team, into new product areas.",
            ]),
            ("Common misconceptions about commit velocity", [
                "Three misconceptions come up constantly. The first is that more commits always means a better team; it does not, because commit quality and product relevance matter more than raw count. The second is that a low public commit count means a slow team; it may just mean private repositories or a different workflow. The third is that velocity is a ranking score; it is a trend you read in context, not a number you compare in isolation.",
                "Each misconception traces to the same error: treating velocity as an absolute metric rather than a relative, contextual signal. Velocity is meaningful as a slope over time, normalized within sector, and read alongside contributor growth and repository expansion. Strip away that context and the number misleads.",
            ]),
            ("Using commit velocity in your process", [
                "Investors use commit velocity in three places. In sourcing, it finds teams whose velocity just broke out before the market notices. In screening, it quickly ranks a long list of candidates by execution evidence. In diligence, it confirms that a founder's claims about momentum match the public record.",
                "The weekly GitDealFlow digest surfaces the five startups with the strongest velocity breakouts each Sunday, so the signal arrives pre-packaged rather than requiring you to run the numbers yourself. Start with the free digest, then graduate to a watchlist with alerts as your process matures.",
            ]),
        ],
        "faqs": [
            ("What is a good commit velocity for a startup?", "There is no universal number. Velocity is meaningful only as a trend and relative to sector. GitDealFlow normalizes by sector, so a fintech team and a developer-tools team are comparable on the same relative scale. Focus on rising 4-week averages over 8 to 12 weeks, not absolute counts."),
            ("How is commit velocity calculated?", "Count commits per repository per week, then smooth with a rolling 4-week average. The signal is the slope of that smoothed line over 8 to 12 weeks. A sustained rise is a breakout; a single-week spike is noise."),
            ("Can commit velocity be faked?", "Single-week spikes can be inflated with trivial commits, but sustained velocity across months is hard to fake. GitDealFlow tracks 350+ startups over time, so anomalies and one-off spikes stand out against each team's own history."),
            ("Does commit velocity equal product velocity?", "Not always. Some teams commit often but ship little, and some ship a lot with fewer commits. That is why GitDealFlow combines velocity with contributor growth and repository expansion to filter noise. Look for rising velocity with rising contributors, not velocity alone."),
            ("Where do I see commit velocity on GitHub?", "On any repository, open the Insights tab and use the Contributors and Pulse views. Contributors shows commits per author over time; Pulse shows the last week and month of activity. For a whole organization, repeat this across its active repositories, or use a signal layer that aggregates it for you."),
        ],
    },

    # ── 2. What Is Engineering Velocity? ─────────────────────────────────
    "what-is-engineering-velocity": {
        "lead": (
            "Engineering velocity is the rate at which a startup's engineering team produces "
            "software. More than a raw commit count, it combines how fast the team ships, how fast "
            "the team is growing, and how fast its codebase is expanding into new areas. It is the "
            "leading indicator most VCs never look at, and it has historically led fundraise "
            "announcements by 3 to 6 weeks."
        ),
        "sections": [
            ("The three components of engineering velocity", [
                "A complete picture of engineering velocity is built from three public signals, and each answers a different question:",
                [
                    "Commit velocity asks 'are they shipping?'. It measures how frequently the team pushes code, the raw pace of execution.",
                    "Contributor growth asks 'are they scaling?'. It measures how many distinct developers are committing, a proxy for team expansion and hiring.",
                    "Repository expansion asks 'are they expanding?'. It measures new public repositories and code growth, a proxy for exploration into new product areas.",
                ],
                "Together they separate real momentum from activity theater. A team can have high commit velocity but a stagnant, one-founder contributor base, which is a concentration risk. A team can add contributors without shipping more, which is hiring without execution. Only when all three move together is the signal strong.",
                "This three-part structure is not arbitrary; it maps to the three questions every investor has about an early team: can they build, are they scaling, and are they building toward something bigger?",
            ]),
            ("Why engineering velocity is a leading indicator", [
                "Most investor data is lagging. Funding rounds, press coverage, and revenue reports all describe what already happened. Engineering velocity describes what is happening right now, in public, before anyone announces anything.",
                "Teams accelerate before they raise because fundraising forces deadlines: the roadmap gets compressed, hiring decisions get made, and the codebase is pushed forward to support the pitch. That acceleration is visible in GitHub weeks before the round hits the press. This is the core insight behind GitDealFlow: 3 to 6 weeks of lead time, documented in a published methodology on SSRN.",
                "The lead time is what makes the signal commercially valuable. A lagging indicator tells you who already raised, which is useless for access. A leading indicator tells you who is about to raise, which is exactly the window where a check or an introduction is worth the most.",
            ]),
            ("Engineering velocity vs product velocity", [
                "These are related but not identical, and confusing them leads to bad decisions. Product velocity is about what ships to customers: features, releases, outcomes. Engineering velocity is about what the team is producing in code.",
                "A team can have high engineering velocity and low product velocity if it is building the wrong thing. A team can also have high product velocity with lower engineering velocity if it is unusually efficient. The practical rule: engineering velocity is a signal of execution capacity, and it is most useful early, when there is no product revenue to measure yet.",
                "As a company matures, product velocity becomes the more meaningful number, because revenue and usage exist to measure it. Engineering velocity does not stop mattering; it just recedes from being the primary signal to being one input among several.",
            ]),
            ("How engineering velocity connects to DORA and developer productivity", [
                "Engineering velocity overlaps with a well-known framework from the DORA (DevOps Research and Assessment) research program, which measures software delivery with four metrics: deployment frequency, lead time for changes, change failure rate, and time to restore service. Those four metrics are the industry standard for engineering throughput.",
                "The difference is one of visibility. DORA metrics are usually measured inside a company with access to its CI/CD pipeline, which an outside investor cannot see. Public GitHub activity is the outside-in proxy for the same underlying question: how fast and how reliably does this team deliver software?",
                "An investor cannot read a startup's deployment frequency directly, but a sustained rise in commit velocity and repository expansion is the public trace of a team that is delivering more. The two frameworks answer the same question from opposite sides of the company's firewall.",
            ]),
            ("Reading velocity in context", [
                "Velocity is never meaningful in the abstract. Four contexts matter:",
                [
                    "Stage: a pre-seed team of three commits differently from a Series B team of forty, so the expectation scales with maturity.",
                    "Sector: hardware and biotech teams commit differently from pure software teams, so cross-sector comparison is meaningless.",
                    "Geography and tooling: some teams work in private repos or use GitLab instead of GitHub, which changes what is publicly visible.",
                    "Business model: open-source companies have a public footprint by design, while closed-source companies may keep the core product private.",
                ],
                "GitDealFlow handles the sector problem by normalizing every startup's momentum relative to its sector peers. That normalization is what lets you compare a fintech breakout to a developer-tools breakout on one leaderboard.",
            ]),
            ("The limits and how to mitigate them", [
                "Engineering velocity has three structural limits, each with a mitigation. The signal can be gamed in the short run, so read sustained trends over months rather than single-week spikes. The signal is blind to private work, so treat a thin public footprint as a data limitation rather than a verdict. The signal is sector-dependent, so normalize within sector instead of comparing raw counts across sectors.",
                "The discipline is to use engineering velocity to verify specific claims, not to generate a blanket score. 'Is the founder's momentum claim true?' is a clean question the data answers. 'Is this a good company?' is not, and no single signal should be asked to answer it.",
            ]),
            ("How to verify an engineering velocity claim", [
                "Any velocity claim can be checked against the public record in minutes. Open the company's GitHub organization, find the repositories behind the product, and read the Insights views: Contributors for pace and team composition, and Pulse for the last week and month. If the claimed momentum does not appear there, treat the claim with skepticism.",
                "The verification habit protects you from the most common failure: taking a pitch-deck momentum slide at face value. A founder can write 'we ship weekly' on a slide, but the commit graph either confirms it or does not, and the founder cannot edit the past. Make verification the default, and the signal becomes evidence instead of a talking point.",
            ]),
            ("How investors use engineering velocity", [
                "The workflow is simple: watch for velocity breakouts, verify them against contributor growth and repository expansion, then reach out while the round is still being assembled. The signal does the sourcing; you do the judgment.",
                "The free weekly GitDealFlow digest ships five breakout names every Sunday, each verifiable on GitHub, typically 21 to 47 days before the round is public. The Scout Score tool (0 to 100) is the backwards-looking companion: it checks whether a GitHub user starred validated unicorns before the market did, a measure of taste rather than momentum.",
            ]),
        ],
        "faqs": [
            ("What is the difference between commit velocity and engineering velocity?", "Commit velocity is one component: how often the team commits code. Engineering velocity is the broader concept that also includes contributor growth and repository expansion. Commit velocity measures pace; engineering velocity measures pace, scale, and direction together."),
            ("Why do VCs miss engineering velocity?", "Most VCs run on lagging data sources: Crunchbase, press, and their own networks. Public GitHub activity is free but requires engineering-adjacent tooling and a weekly routine to read. Most funds have never built that muscle, which is why the signal remains uncrowded."),
            ("Is high engineering velocity always good?", "Not always. Velocity that comes from one founder is fragile, velocity building the wrong product is wasted effort, and velocity in a sector that does not fit the thesis is irrelevant. The signal is strongest when velocity rises together with contributor growth and is consistent over months."),
            ("How does engineering velocity relate to DORA metrics?", "DORA's four keys (deployment frequency, lead time, change failure rate, time to restore) measure delivery throughput inside a company. Engineering velocity is the outside-in proxy an investor can read from public GitHub activity. They answer the same question from opposite sides of the firewall."),
            ("What if a startup keeps its code in private repos?", "Then the public signal is thin, and you should weight qualitative diligence more heavily. A thin footprint is a data limitation, not proof of a weak team. For closed-source companies, ask for a code walkthrough and references who can speak to execution."),
            ("How does GitDealFlow compute engineering velocity?", "GitDealFlow reads public GitHub activity weekly, computes commit velocity, contributor growth, and repository expansion for each startup, and normalizes the result within its sector. The output is a relative momentum measure, not an absolute count, which is what makes teams comparable across a portfolio."),
        ],
    },

    # ── 3. How to Evaluate a Startup's Engineering Team ──────────────────
    "how-to-evaluate-a-startups-engineering-team": {
        "lead": (
            "You cannot sit in on a team's standups before you invest, but you can read the public "
            "record of how they build. This guide is a complete, four-step framework for evaluating "
            "a startup's engineering team using evidence anyone can inspect on GitHub, plus a worked "
            "example and a scoring rubric, so you walk away with a repeatable process rather than a "
            "checklist of vibes."
        ),
        "sections": [
            ("Step 1: Map the public engineering footprint", [
                "Start by finding what the team actually builds in public. Locate the company's GitHub organization, list its repositories, and classify each as active or dormant. The footprint itself is informative: a team with one active repo is different from one with a dozen, and a team whose core product is open source is different from one that keeps everything private.",
                "Four things to record at this stage:",
                [
                    "Which repositories exist, and which are actually being worked on right now.",
                    "Whether the core product is public, private, or a mix.",
                    "How old the organization is and how the commit activity is distributed across repos.",
                    "Whether the public footprint matches the product the founder described in the pitch.",
                ],
                "If the core product is private, note it explicitly and lean on the remaining steps plus qualitative diligence. A thin public footprint is a data limitation, not a verdict.",
            ]),
            ("Step 2: Read velocity and contributor growth over time", [
                "Pull commit velocity and contributor counts for the last 12 weeks, not the last week. Look for three things:",
                [
                    "Is velocity trending up, flat, or down? A rising 4-week average is execution evidence; a falling one is a warning.",
                    "Is the work spread across a team, or concentrated in one founder? Concentration is fragility, regardless of how fast that founder ships.",
                    "Is contributor count growing? Team expansion is conviction made visible: a founder adding engineers is betting cash and equity on the roadmap.",
                ],
                "GitDealFlow computes these signals weekly and normalizes them by sector, so you get a comparable momentum score instead of raw numbers you have to interpret yourself. If you are doing it by hand, the Insights tab on each repository is where the raw data lives.",
            ]),
            ("Step 3: Check repository expansion and architecture signals", [
                "New repositories are a window into where the team is heading. Teams create new repos when they start new product lines, spin out tooling, or open-source a component. A cluster of new repos often precedes a product launch.",
                "Also read the structural signals that reveal process quality:",
                [
                    "How issues and pull requests are handled, and whether code review actually happens before merges.",
                    "Whether there is a test suite and whether it is run.",
                    "Whether releases are tagged and versioned with discipline.",
                    "Whether the commit history is coherent, or a series of vague 'fix' messages.",
                ],
                "Sloppy process in public is usually sloppy process in private too. A team that merges unreviewed code with no tests is a team whose technical debt will compound as it scales.",
            ]),
            ("Step 4: Triangulate with non-GitHub signals", [
                "Engineering evidence is one input, not the whole picture. Cross-check it against four external signals:",
                [
                    "Hiring: are they actually adding the engineers their public activity implies, or is the org chart aspirational?",
                    "Product: does the shipped product match the claimed roadmap, or is the deck ahead of the code?",
                    "Funding and network: do the founders have the access and relationships to actually raise?",
                    "Narrative: does the founder's story match the public record of their work?",
                ],
                "When the GitHub evidence and the founder's claims disagree, believe the GitHub evidence. It is the one record the founder did not write for you.",
            ]),
            ("A worked example: evaluating a seed-stage team", [
                "To make the framework concrete, here is how it runs on a clearly hypothetical seed-stage developer-tools startup. None of these numbers are real; the point is the method.",
                [
                    "Footprint: the organization has six public repositories; four are active, two are dormant. The core product is open source, which is normal for developer tools and gives you a full public record to read.",
                    "Velocity: the 4-week commit average rose from roughly 14 to roughly 26 over the quarter, a genuine breakout rather than a one-week spike.",
                    "Contributor growth: contributors grew from 3 to 7 in the same window, with the work spread across the team rather than concentrated in one founder.",
                    "Repository expansion: two new repositories appeared in the last six weeks, consistent with a new product push.",
                    "Process: pull requests are reviewed, there is a test suite, and releases are tagged. Red flags are minimal.",
                ],
                "Reading: this team ships, is scaling, and is building toward something new, with disciplined process. On the scoring rubric below, it would clear the bar comfortably. The framework's value is that every one of those observations came from public evidence you could re-derive in an afternoon.",
            ]),
            ("How to document your evaluation", [
                "Write down the evaluation as you go, because an undocumented assessment is just a memory. For each of the four steps, record one or two sentences of evidence and your read on it, then assign the five scores from the rubric. The result is a one-page evaluation you can attach to the memo and defend later.",
                "Documentation matters for two reasons: it forces you to ground each judgment in evidence, and it gives you a baseline to compare against when you re-evaluate the team in six months. A team that scored 20 at seed and 14 at Series A is a different story than one that held steady.",
            ]),
            ("Common mistakes when evaluating engineering teams", [
                "Investors most often go wrong in four ways. First, reading a single-week snapshot instead of a trend, which mistakes noise for signal. Second, comparing across sectors instead of within them, which produces meaningless verdicts. Third, overweighting commit counts while ignoring contributor concentration, which mistakes a busy founder for a real team. Fourth, assuming no public footprint means no engineering, which mistakes a data limitation for a red flag.",
                "The antidote to all four is the same: read trends over 8 to 12 weeks, normalize within sector, weight both pace and team composition, and treat a thin footprint as a prompt for more qualitative diligence rather than a conclusion.",
            ]),
            ("A simple scoring framework", [
                "Rate the team on five dimensions, each from 1 to 5: footprint and product match, velocity trend, contributor growth and distribution, repository expansion and process, and non-GitHub triangulation. A total of 20 or more out of 25 is a strong signal; 13 to 19 is mixed and warrants a founder conversation; below 13 means the engineering evidence does not support the deal.",
                "The number is not the point; the discipline is. Forcing every claim through a public-evidence filter, with a score you can defend in the memo, is what separates a repeatable evaluation process from a gut feeling with extra steps.",
            ]),
        ],
        "faqs": [
            ("What if the startup's code is all in private repos?", "Then the public signal is limited, and you should weight qualitative diligence more heavily. The public footprint is a data source, not the only one. A thin footprint is not proof of a weak team, but it removes one of your cheapest checks."),
            ("How long a history do I need before I trust the signal?", "Twelve weeks of weekly data is the practical minimum to see a trend. Anything shorter is a snapshot, and snapshots mislead. GitDealFlow tracks teams continuously so the history is already there when you need it."),
            ("Is commit velocity a substitute for a technical interview?", "No. It is evidence of execution pace, not of architecture judgment or code quality. Use it to decide who is worth a deeper look, then do the qualitative work on the shortlist."),
            ("How do I evaluate a team that is not on GitHub at all?", "Treat it as a thin public footprint. Ask for a code walkthrough, read the product and hiring signals, and lean on references who can speak to execution. You lose the public record, so you compensate with more direct evidence."),
            ("Should I weight this differently at seed vs Series A?", "Yes. At seed the question is 'can they ship at all', so velocity trend and contributor concentration dominate. At Series A the question is 'can they scale', so contributor growth and process quality matter more. The same public evidence answers both; you just weight it differently."),
            ("What if I am not technical at all?", "You do not need to read code, only trends: is velocity rising, is the team growing, is the process disciplined? A data layer like GitDealFlow hands you those trends as scores, so the analysis is judgment rather than arithmetic."),
        ],
    },

    # ── 4. GitHub Due Diligence Checklist ────────────────────────────────
    "github-due-diligence-checklist": {
        "lead": (
            "This is the checklist version of technical due diligence: 21 checks across four "
            "categories, each answerable from public GitHub data, plus a scoring rubric and a "
            "practical guide to running it in the GitHub UI. Run it on any software startup before "
            "you invest, and attach the scored result to your investment memo."
        ),
        "sections": [
            ("How the checklist is organized", [
                "The 21 checks are grouped into four categories that map to four questions: velocity (are they shipping?), team (are they real and scaling?), process (how do they work?), and expansion and red flags (where are they heading?). Work through them in order, and record pass, warn, or fail for each.",
                "Each check below includes a short note on what a healthy result looks like, so you are scoring against a standard rather than a feeling. None of the checks requires reading code; all of them are answerable from the GitHub web interface in under an hour.",
            ]),
            ("Velocity: is the team actually shipping?", [
                {"table": {"headers": ["Check", "What good looks like"], "rows": [
                    ["1. Is 12-week commit velocity trending up, flat, or down?", "A rising 4-week average over the quarter, not a one-week spike."],
                    ["2. Is there a sustained rise, or only a single-week spike?", "Sustained momentum across 8+ weeks; spikes are noise."],
                    ["3. Does the velocity match the founder's claims?", "The public record confirms the pitch, rather than contradicting it."],
                    ["4. Is there active development in the core product repos?", "Recent commits in the repos behind the actual product, not a stale demo."],
                    ["5. Are there abandoned repos suggesting a pattern of not finishing?", "Few or no half-built repos left mid-feature."],
                ]}},
            ]),
            ("Team: is the engineering team real and scaling?", [
                {"table": {"headers": ["Check", "What good looks like"], "rows": [
                    ["6. How many distinct contributors committed in the last 90 days?", "A team count that matches the stage, not a single author."],
                    ["7. Is contributor count growing, flat, or shrinking?", "Growth consistent with the hiring plan; a decline is worth probing."],
                    ["8. Is the work concentrated in one founder?", "Work spread across multiple contributors; concentration is fragility."],
                    ["9. Does the team size match what the founder claimed?", "The public record confirms the pitch, not the opposite."],
                    ["10. Is there short-tenure contractor churn inflating the count?", "A stable contributor base, not a revolving door."],
                ]}},
            ]),
            ("Process: how do they actually work?", [
                {"table": {"headers": ["Check", "What good looks like"], "rows": [
                    ["11. Are pull requests reviewed before merge?", "Reviewed PRs, not unreviewed merges to main."],
                    ["12. Are issues triaged and closed?", "Issues opened and closed at a steady clip, not piling up."],
                    ["13. Is there a test suite, and is it run?", "Tests present and run in CI, not absent."],
                    ["14. Are releases tagged and versioned?", "Tagged releases with version numbers, not untracked pushes."],
                    ["15. Is commit history coherent?", "Descriptive commit messages, not a wall of vague 'fix' entries."],
                    ["16. Is there documentation?", "Maintainable code with docs, not undocumented internals."],
                ]}},
            ]),
            ("Expansion and red flags: where are they heading?", [
                {"table": {"headers": ["Check", "What good looks like"], "rows": [
                    ["17. Are new repositories appearing?", "New repos consistent with a product push, not stagnation."],
                    ["18. Does codebase growth match the roadmap?", "The direction of the code aligns with the pitch."],
                    ["19. Is there a velocity spike right before the raise?", "Pre-raise acceleration is normal, but a spike that does not match history is a question."],
                    ["20. Do public claims contradict the record?", "The pitch, team page, and product all agree with the code."],
                    ["21. Does the footprint match the stage and sector?", "The footprint looks right for a team of that maturity in that sector."],
                ]}},
            ]),
            ("How to run the checklist in GitHub", [
                "Every check above is answerable from three places on GitHub: the organization page (which lists repositories and their activity), the Insights tab on each repository (Contributors and Pulse for velocity and team data), and the Pull Requests and Issues tabs (for process quality).",
                "The fastest path: start on the organization page to map the footprint, then open the two or three repositories that are the actual product, and read their Insights, Pull Requests, and Issues views. For velocity and contributor checks, the Contributors view under Insights is where the raw data lives. A 30 to 60 minute pass per company is enough to complete the checklist.",
                "Keep a simple spreadsheet with one row per check and columns for the result and a one-line note. That note is what makes the checklist useful in a memo, because a bare pass or fail without the underlying evidence does not survive scrutiny three weeks later.",
            ]),
            ("How to score the checklist", [
                "Score each check as pass, warn, or fail. Then use a simple rubric:",
                [
                    "Strong: 18 or more pass, no fails. The engineering substance supports the deal.",
                    "Mixed: 12 to 17 pass, or 1 to 2 fails. Proceed only if the founder answers the warns cleanly.",
                    "Weak: fewer than 12 pass, or 3 or more fails. The engineering evidence does not support the investment.",
                ],
                "The point is not the number; it is forcing every claim through a public-evidence filter. A founder who clears the checklist cleanly has done something real.",
            ]),
            ("Reading the results: what strong, mixed, and weak look like", [
                "A strong result (18 or more pass, no fails) is a team whose public record confirms the pitch: shipping steadily, scaling the team, working with discipline, and heading where the roadmap says. That is the evidence you want behind a check, and it is worth writing down in the memo.",
                "A mixed result (12 to 17 pass, or 1 to 2 fails) usually means a real team with one or two open questions: maybe velocity is flat this quarter, or process is sloppy in public, or the team is still concentrated in one founder. These are founder conversations, not deal-breakers, but they need to happen before you sign.",
                "A weak result (fewer than 12 pass, or 3 or more fails) means the engineering evidence does not support the investment as pitched. That does not always mean a bad company, but it does mean you are being asked to invest on narrative rather than evidence, which is a very different bet and should be priced accordingly.",
            ]),
            ("What to do with the results", [
                "Attach the scored checklist to your investment memo. The pass and warn items become your diligence questions for the founder; the fail items become either deal-breakers or the specific conditions you negotiate around.",
                "For teams where the core product is private, note the thinner footprint explicitly and lean on qualitative diligence instead of pretending the signal is complete. The checklist's value is that it makes the evidence, and the gaps in the evidence, explicit before you sign.",
                "Finally, keep the checklist as a living document. Re-run the velocity and team sections quarterly on every company you are tracking, and note the trend. A company whose score is improving quarter over quarter is a different asset than one whose score is quietly declining.",
            ]),
        ],
        "faqs": [
            ("How long does this checklist take to run?", "With a signal layer that already tracks velocity and contributor growth, the velocity and team sections take minutes. The process and red-flag sections require reading the repositories, which is 30 to 60 minutes per company."),
            ("Is this checklist only for software startups?", "It is strongest for software and software-adjacent companies where code is the product. For hardware and biotech, the public footprint is thinner and you should weight qualitative diligence more heavily."),
            ("Can I use this checklist for open-source-heavy companies?", "Yes, and you should add a check for external contributor pull: is the open-source community actually using and contributing to the project? For developer-tools companies, that is early product-market fit in code form."),
            ("What is the single most important check?", "The 12-week velocity and contributor trend, because it converts the founder's momentum claims into a verifiable record and is the hardest signal to fake over a meaningful window."),
            ("Should I run this for a seed round?", "Yes, but weight it by stage. At seed you are checking that the team can execute, not auditing a mature architecture. The same public evidence answers the seed question: is this team actually shipping?"),
            ("What should I do when the checklist and the pitch disagree?", "Believe the checklist, then ask the founder. The public record is the one account the founder did not write for you, so a mismatch is a specific, answerable question rather than a reason to quietly pass."),
            ("How do I track a company's checklist score over time?", "Re-run the velocity and team sections quarterly and note the trend. A rising score confirms an improving asset; a quietly declining score is an early warning that financials and press will not show for months."),
        ],
    },
}


def main():
    written = []
    for slug, override in DEEPEN.items():
        article = None
        for a in gen.ARTICLES:
            if a["slug"] == slug:
                article = dict(a)
                break
        if article is None:
            print("SKIP unknown slug:", slug)
            continue
        article["lead"] = override["lead"]
        article["sections"] = override["sections"]
        article["faqs"] = override["faqs"]

        html = gen.build_page(article)
        path = os.path.join(gen.BASE, article["dir"], slug + ".html")
        with open(path, "w", encoding="utf-8") as f:
            f.write(html)
        written.append(path)

        text = re.sub(r"<(style|script)[^>]*>.*?</\1>", "", html, flags=re.S | re.I)
        text = re.sub(r"<[^>]+>", " ", text)
        text = re.sub(r"\s+", " ", text).strip()
        wc = len(text.split())
        flag = "OK" if wc >= 1500 else "SHORT"
        print("%s %5d words  %s" % (flag, wc, path.replace(gen.BASE + "/", "")))

    print("\nDeepened pages:", len(written))


if __name__ == "__main__":
    main()
