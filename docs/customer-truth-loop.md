# GitDealFlow customer-truth loop

GitDealFlow does not treat a marketing guess as customer evidence.

## Sources

1. `/feedback`: feature requests and problems, captured with the job, blocker, expected frequency, source, and optional follow-up consent.
2. `/support`: billing, login, data-quality, newsletter-delivery, and other support requests.
3. `/pulse`: 0-10 recommendation score, whether the reader found a useful lead, the main reason, and the one-point improvement.
4. `/cancel` and Stripe: cancellation reason, written improvement, what would have earned one more month, and follow-up consent.
5. Free-list exit survey: optional unsubscribe reason.
6. One-to-one interviews: notes are added manually to the private customer-truth record after explicit consent.

Structured web submissions emit `customer_voice_submitted` to PostHog EU with no email property and send a private internal alert to the GitDealFlow inbox. Optional reply emails exist only in that inbox.

## Weekly review

Run:

```bash
~/.local/bin/python3.11 monitoring/gdf_voc_weekly.py --days 7
```

The private report lands at `~/gitdealflow-audit/voc/latest.md`.

Every record gets one outcome:

- **Build it** when repeated demand and expected use justify the cost.
- **Test it** when the need is credible but the solution or frequency is uncertain.
- **Explain it better** when the capability exists and customers cannot find or understand it.
- **Decline it** when it conflicts with the product boundary or has insufficient expected value. Record why.

Confidence rules:

- 1 independent record: low confidence, do not generalize.
- 2 independent records: medium confidence, run a small reversible test.
- 3 or more independent records with consistent language: high confidence, prioritize against revenue and retention impact.

No audit may claim a customer pain, objection, feature demand, satisfaction level, or churn reason without citing a customer-truth record. Otherwise label it a hypothesis.

## Exact questions

### Weekly signal

> What would make this signal more useful in your next deal decision?

Act by tagging the job, blocker, frequency, and source, then assigning one weekly-review outcome.

### Cancellation

1. What is the closest reason you are leaving?
2. What should we improve?
3. What would have made you stay for one more month?
4. May we ask two follow-up questions?

Act by grouping reasons monthly, fixing the largest controllable reason first, and contacting only people who explicitly consented. Do not restore an unsubscribed contact.

### Satisfaction pulse

1. How likely are you to recommend GitDealFlow to another investor? (0-10)
2. Did you find at least one startup worth investigating?
3. What is the main reason for your score?
4. What would raise it by one point?

Use the score only with the written reason. Review detractors and passives first; never report NPS until the sample size is shown.

### One-to-one interview

1. Tell me about the last time you tried to source a startup before the round was public.
2. What triggered you to look that day?
3. What did you do before GitDealFlow?
4. Which part of this week's signal changed a real action, if any?
5. What nearly stopped you from using it?
6. What would you miss if GitDealFlow disappeared?

Write notes immediately after the call. Preserve exact language, remove personal identifiers from shared artifacts, and connect every accepted insight to a product, messaging, onboarding, or distribution decision.

## Outbound boundary

Interview recruitment and churn follow-up emails require the complete draft to be reviewed and explicitly approved before sending. The deployed product only records consent; it does not automatically send an interview invitation.
