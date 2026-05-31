# GitDealFlow — page-angle-platform experiment matrix

Purpose: make it easy to test which page-angle-platform combinations deserve more pressure and which should be stopped.

Rule:
- test one page-angle-platform combo at a time
- log it
- do not judge from one touch
- stop after three clean misses

## Tier 1 experiments

### Experiment 1
Page:
- `/compare/crunchbase-alternative-for-angel-investors`
Angle:
- timing vs verification
Platform:
- X replies
Why:
- strongest commercial wedge
Success looks like:
- asks how it differs from Crunchbase / PitchBook / Dealroom
Next page if it lands:
- `/buyers-guide`
Stop if:
- 3 good contexts, 0 replies, 0 second-step interest

### Experiment 2
Page:
- `/answers/deal-flow-timing-vs-verification`
Angle:
- early signal is noisier, but earlier
Platform:
- Reddit comments
Why:
- strongest category distinction
Success looks like:
- asks if the signal is too noisy or too early
Next page if it lands:
- `/compare/crunchbase-alternative-for-angel-investors`
Stop if:
- threads are high-fit but the angle still gets ignored 3 times

### Experiment 3
Page:
- `/research`
Angle:
- public panel, not story
Platform:
- newsletter replies
Why:
- strongest evidence surface
Success looks like:
- asks for methodology, data, or reproducibility
Next page if it lands:
- `/buyers-guide`
Stop if:
- the audience clearly prefers anecdotes to evidence across 3 attempts

### Experiment 4
Page:
- `/from-stars-to-seed`
Angle:
- proof before the round
Platform:
- LinkedIn comments / posts
Why:
- strongest visible proof page
Success looks like:
- asks for more examples or asks whether this is backfit
Next page if it lands:
- `/research`
Stop if:
- the context is too broad and the proof angle gets no traction 3 times

### Experiment 5
Page:
- `/answers/how-angel-investors-use-github-signals`
Angle:
- practical use without reading code
Platform:
- Reddit comments
Why:
- strong practical explanation page
Success looks like:
- asks how non-technical angels would use this in practice
Next page if it lands:
- `/buyers-guide`
Stop if:
- workflow threads still prefer generic startup-database advice after 3 tries

## Tier 2 experiments

### Experiment 6
Page:
- `/buyers-guide`
Angle:
- shortest buyer-side evaluation page
Platform:
- private investor chats
Why:
- strongest late-stage evaluator page
Success looks like:
- asks which paid step fits
Next page if it lands:
- `/answers/when-should-i-use-first-look-vs-dashboard`
Stop if:
- buyer-like chats still do not move toward offer-choice after 3 tries

### Experiment 7
Page:
- `/integrations/best-mcp-server-for-vc-research`
Angle:
- signal inside Claude / Cursor, not another tab
Platform:
- X or GitHub AI/MCP threads
Why:
- strong technical wedge
Success looks like:
- asks about MCP, Claude, Cursor, API, or install
Next page if it lands:
- `/research` or `/developers`
Stop if:
- the thread is AI-native but still shows no follow-up after 3 tries

### Experiment 8
Page:
- `/use-cases`
Angle:
- practical workflow by investor type
Platform:
- LinkedIn comments
Why:
- strong practical operating page
Success looks like:
- asks which investor type or workflow this fits best
Next page if it lands:
- `/buyers-guide`
Stop if:
- operator/investor workflow posts still produce no follow-up after 3 good placements

## Tier 3 experiments

### Experiment 9
Page:
- `/answers/can-gitdealflow-replace-crunchbase`
Angle:
- replacement question
Platform:
- X or LinkedIn replies
Why:
- explicit buyer-ready objection handler
Success looks like:
- asks what Crunchbase still does better
Next page if it lands:
- `/compare/crunchbase-alternative-for-angel-investors`
Stop if:
- explicit replacement questions still do not trigger any deeper discussion after 3 tries

### Experiment 10
Page:
- `/answers/when-should-i-use-first-look-vs-dashboard`
Angle:
- which paid step fits first
Platform:
- private chats / replies
Why:
- strongest offer-choice answer
Success looks like:
- asks about one-off vs recurring need
Next page if it lands:
- `/pricing`
Stop if:
- buyer-like replies still avoid offer choice after 3 clear uses

## Score rule

A combo is promising if it does any of these:
- gets a reply
- gets a question
- gets a second-step request
- creates a cleaner explanation than other pages in the same context

A combo is weak if it:
- repeatedly needs extra explanation
- repeatedly gets ignored in high-fit contexts
- pulls the wrong next question

## Command

Test fewer combinations.
Measure them honestly.
Push the winners and kill the dead angles fast.