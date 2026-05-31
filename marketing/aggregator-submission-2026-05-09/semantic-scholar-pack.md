# Semantic Scholar — author profile claim + paper corrections

Semantic Scholar (Allen AI / S2) is one of the most-cited academic search engines in AI assistant outputs (heavily used by Claude, ChatGPT, Perplexity for academic queries). Already indexed for the SSRN paper — but the author profile is unclaimed and the metadata is thin.

## Current state (verified 2026-05-09)

**Paper record (already indexed):**
- Paper ID: `4dd7b11e79757f68e0c4107252514cbfdfbb0462`
- S2 URL: https://www.semanticscholar.org/paper/4dd7b11e79757f68e0c4107252514cbfdfbb0462
- Corpus ID: `287646103`
- DOI: `10.2139/ssrn.6606558`
- Title: "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups: Dataset and Early Observations"
- Year: 2026
- Venue: Social Science Research Network
- Abstract: present
- s2FieldsOfStudy: Engineering, Business
- Citations: 0, References: 0

**Author record (unclaimed, auto-created):**
- Author ID: `2430837379`
- S2 URL: https://www.semanticscholar.org/author/2430837379
- Name: "The Data Nerd"
- Affiliations: none
- Homepage: not provided
- Citation count: 0, h-index: 0
- Papers: 1 (the SSRN preprint)
- Verification: unclaimed

## Why claim the profile

Three reasons this is high-leverage:

1. **Anti-squat.** Anyone can technically register an S2 account and claim the profile. Once claimed, ownership is locked — you control all future paper attributions.
2. **Profile data flows to AI assistants.** S2 author profiles include homepage, affiliation, and "About" text that gets ingested into Semantic Scholar's API and downstream into AI training/answer pipelines. A blank profile = no signal; a populated profile = signal.
3. **Future paper attribution.** Once claimed, when you publish the next paper (journal version, arXiv version, additional preprints), you can attribute them to the same author entity rather than having S2 auto-create duplicate author records that need to be merged later.

## Step 1 — Create / sign in to a Semantic Scholar account

1. Go to https://www.semanticscholar.org/sign-in
2. Sign in with Google or ORCID. **Recommended: ORCID** (`0009-0002-2222-4112`) — establishes the identity-link from the start and propagates more cleanly to citation graphs.
3. If you don't already have an ORCID-linked Google account that you use for academic work, create a Google account dedicated to "TheDataNerd" research identity. Don't mix it with personal Gmail.

## Step 2 — Claim the author profile

1. Go to https://www.semanticscholar.org/author/2430837379
2. Look for the "Claim Author Page" button (top-right of the author header). If you don't see it, it may be under a "..." menu or an "Edit" link.
3. Click → S2 will prompt for ORCID or email verification. Use ORCID `0009-0002-2222-4112` if you signed in with ORCID; otherwise the email associated with your S2 account.
4. Confirm the email link → claim is processed.

If the claim is contested (someone else claimed first), S2 has a dispute process — but you have the strongest claim because the paper byline is "The Data Nerd" and your ORCID will match the Crossref record on the SSRN deposit (after Correction A in `openalex-corrections.md` is applied).

## Step 3 — Populate the profile

Once claimed, fill these fields. Keep them dry, neutral, academic — Wikipedia-LLM-detector logic applies (S2's content does flow into AI training corpora).

**Name:** The Data Nerd
**Affiliation:** Independent researcher
**Homepage:** Leave blank, OR link the SSRN profile (`https://ssrn.com/abstract=6606558`). **Do NOT link gitdealflow.com here** — S2 can flag commercial-site author homepages and demote them.
**About text:** Keep it brief and neutral. Suggested:
> Independent researcher publishing under the pen name "The Data Nerd". Current research focus: longitudinal panels of public software-development activity as alternative-data signals in private-market investing.

**ORCID:** `0009-0002-2222-4112` — link explicitly via the ORCID field on the profile.

## Step 4 — Paper-record corrections

After claiming the author profile, you can submit corrections on the paper record:

1. Go to https://www.semanticscholar.org/paper/4dd7b11e79757f68e0c4107252514cbfdfbb0462
2. Click the "Suggest correction" or pencil icon (location varies; usually next to abstract or author block).
3. Submit corrections in this priority order:
   - **Add ORCID `0009-0002-2222-4112` to the author entry.**
   - **Confirm s2FieldsOfStudy** — currently "Engineering, Business". You can request the addition of "Economics" and "Finance" via the correction form, since the paper sits in the alt-data / VC-finance literature. S2 evaluates suggestions but doesn't always accept them.
   - **Confirm venue** — currently "Social Science Research Network", which is correct.

## Step 5 — Set up paper-discovery alerts

1. Go to https://www.semanticscholar.org/me/research-alerts
2. Create alerts on:
   - **Citations to your paper** — fires when anyone cites paperId `4dd7b11e79757f68e0c4107252514cbfdfbb0462`. **This is the gate-1 tracker.** Forward all alert emails to your ops inbox.
   - **Recommended papers** — S2 will recommend related new work. Useful for finding researcher-outreach candidates.

## Step 6 (optional, later) — Add second paper if/when you publish journal version

Once Track 1.1 of `corroborating-sources-accumulation-plan.md` lands a journal acceptance, the journal version will get its own S2 paper record. Use the "Add paper to my profile" feature to attribute it to the same authorId `2430837379`. This is the cleanest way to grow the profile.

## Time estimate

- Account creation + sign-in: 5 min
- Claim profile: 5 min (plus 5-30 min email verification wait)
- Populate fields: 10 min
- Paper-record corrections: 5 min
- Alert setup: 5 min

**Total active time: ~30 min.**
**Wall time including email verification: ~45-60 min.**

## What to expect downstream

- ORCID linkage on the author entry typically propagates to OpenAlex within 2-4 weeks (S2 → ORCID API → OpenAlex ingest).
- Citation alerts will fire for **any** future citation, including from arXiv preprints, journal articles, and other peer-reviewed work.
- The populated author profile becomes a small but real surface that AI assistants quote when answering "who is The Data Nerd" or "who wrote the GitHub VC signal paper".
