# ConvertKit Email Setup Instructions

## Step 1: Create the Welcome Sequence (Soap Opera)

1. Go to ConvertKit > Send > Sequences > New Sequence
2. Name it: "VC Deal Flow Signal - Welcome"
3. Add 5 emails in order, pasting content from each file:

| Email | File | Delay after signup |
|---|---|---|
| 1 | soap-opera-1.md | Day 0 (immediate) |
| 2 | soap-opera-2.md | Day 1 |
| 3 | soap-opera-3.md | Day 2 |
| 4 | soap-opera-4.md | Day 4 |
| 5 | soap-opera-5.md | Day 7 |

4. For each email:
   - Paste the subject line from the `subject:` frontmatter field
   - Paste the preview text from the `preview:` field
   - Paste the body as plain text
   - Set the delay per the table above

## Step 2: Create the Broadcast Emails (Seinfeld)

These are NOT part of the sequence. They are manual broadcasts sent after the welcome sequence ends.

1. Go to ConvertKit > Send > Broadcasts
2. Schedule one per week starting 2 weeks after launch
3. Files: seinfeld-1.md through seinfeld-7.md
4. Use subject and preview from frontmatter
5. Send to all subscribers who have completed the welcome sequence

## Step 3: Connect the Form

1. Go to ConvertKit > Grow > Forms
2. Find the inline form you created for the landing page
3. Under "Settings" > "After subscribing" > select the welcome sequence
4. This ensures every new signup enters the Soap Opera sequence automatically

## Step 4: Test

1. Subscribe with your own email
2. Confirm you receive email 1 immediately
3. Check that subsequent emails arrive on schedule
4. Verify the Stripe Payment Link URLs work in email 5
