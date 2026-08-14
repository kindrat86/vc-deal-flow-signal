# GitDealFlow, distribution response taxonomy

Purpose: normalize outbound responses so follow-up is fast, routing is consistent, and page patches are based on real demand instead of guesses.

Core rule:
- classify the response first
- route to one next page
- log immediately
- patch pages only after repeated patterns

## Primary response types

### 1. asked-for-methodology
Meaning:
- they want to verify how the signal is built
Best next page:
- `/methodology`
Good after:
- `/research`
- `/answers/deal-flow-timing-vs-verification`
- `/integrations/best-mcp-server-for-vc-research`
What it implies:
- trust is rising
- they are not rejecting the thesis, they want proof of rigor

### 2. asked-for-proof
Meaning:
- they want visible examples, not theory
Best next page:
- `/from-stars-to-seed`
Good after:
- `/research`
- `/compare/crunchbase-alternative-for-angel-investors`
- `/answers/how-angel-investors-use-github-signals`
What it implies:
- abstract explanation was not enough
- case studies matter more than methodology in this context

### 3. asked-for-workflow
Meaning:
- they want to know how this fits into real sourcing
Best next page:
- `/use-cases`
Backup next page:
- `/answers/how-angel-investors-use-github-signals`
What it implies:
- they believe the signal might matter
- they need operating fit, not more theory

### 4. asked-for-difference-vs-crunchbase
Meaning:
- they are comparing against the incumbent
Best next page:
- `/compare/crunchbase-alternative-for-angel-investors`
Backup next page:
- `/answers/can-gitdealflow-replace-crunchbase`
What it implies:
- high commercial relevance
- very close to real category understanding

### 5. asked-for-tool-choice
Meaning:
- they want help deciding what tool or paid step fits
Best next page:
- `/buyers-guide`
Backup next page:
- `/answers/when-should-i-use-first-look-vs-dashboard`
What it implies:
- late-stage interest
- route toward buyer-side evaluation, not broad education

### 6. asked-for-sample-output
Meaning:
- they want to see the artifact shape
Best next page:
- `https://gitdealflow.com/report`
Backup next page:
- `/weekly/top-100`
What it implies:
- they need to feel the output before trusting the workflow

### 7. asked-for-agent-integration
Meaning:
- they care about MCP, API, Claude, Cursor, or agent usage
Best next page:
- `/integrations/best-mcp-server-for-vc-research`
Backup next page:
- `/developers`
What it implies:
- technical or AI-native context
- likely strong fit for agent-led distribution angles

### 8. asked-what-is-this
Meaning:
- the first touch was too compressed or they missed the wedge
Best next page:
- `/answers`
Backup next page:
- `/answers/deal-flow-timing-vs-verification`
What it implies:
- you need a simpler first explanation next time
- maybe the wrong page or wrong context was used

### 9. positive-signal
Meaning:
- they reacted well but asked no specific question yet
Best next page:
- `/buyers-guide` if they feel buyer-like
- `/research` if they feel skeptical/technical
What it implies:
- do not overexplain
- send one calm next page only

### 10. neutral
Meaning:
- polite response, weak pull
Best next move:
- log it and do not force a follow-up
What it implies:
- context fit may be weak
- do not waste a second touch unless the person reopens it

### 11. negative
Meaning:
- explicit disagreement, hostility, or poor fit
Best next move:
- stop
What it implies:
- do not argue
- do not send more links

### 12. no-response
Meaning:
- nothing came back
Best next move:
- log it
- only retry if a new live context appears later
What it implies:
- first-touch page/angle pair may need to be reconsidered

### 13. intro-offered
Meaning:
- they offered to connect you or make an intro
Best next page:
- `/buyers-guide` or `/research` depending on recipient type
What it implies:
- highest-value response type
- handle fast and carefully

### 14. mention-detected
Meaning:
- someone referenced GitDealFlow without you prompting
Best next move:
- respond quickly with one exact page matched to the context
What it implies:
- authority is compounding

## Route map by response type

- asked-for-methodology -> `/methodology`
- asked-for-proof -> `/from-stars-to-seed`
- asked-for-workflow -> `/use-cases`
- asked-for-difference-vs-crunchbase -> `/compare/crunchbase-alternative-for-angel-investors`
- asked-for-tool-choice -> `/buyers-guide`
- asked-for-sample-output -> `https://gitdealflow.com/report`
- asked-for-agent-integration -> `/integrations/best-mcp-server-for-vc-research`
- asked-what-is-this -> `/answers`
- positive-signal -> `/buyers-guide` or `/research`
- neutral -> no push
- negative -> stop
- no-response -> log and wait
- intro-offered -> `/buyers-guide` or `/research`
- mention-detected -> context-matched flagship page

## Patch signals

If you repeatedly get:
- asked-what-is-this -> patch the intro of the first-touch page
- asked-for-methodology -> strengthen proof block and method bridge
- asked-for-proof -> strengthen case-study routing
- asked-for-tool-choice -> strengthen buyer-side handoff
- no-response on the same page-angle pair -> patch snippet or page intro before more sends

## Command

Do not improvise every follow-up.
Classify the response, send one next page, and let repeated patterns tell you what to patch.