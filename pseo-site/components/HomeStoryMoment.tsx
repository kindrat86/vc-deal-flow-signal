import Link from "next/link";

/**
 * HomeStoryMoment — 30-second cinematic story above the fold.
 *
 * Audit gap (2026-05-09 Russell Secret Trilogy pass): Expert Secrets §2 Ch 5
 * (Storytelling) was scoring 95/100 because the email sequence carries the
 * story arc beautifully (Day 0 "the deal I missed because I went to bed",
 * Day 14 "the deal I missed because I trusted the deck", Day 25 "rebuilt
 * the regression last weekend"), and /origin walks the long-form Hero's
 * Two Journeys, but the home page above-the-fold had no story moment at
 * all — H1, avatar pin, stat band, subhead, then straight into the
 * 5-step Epiphany Bridge pills. The first emotional beat the reader hit
 * was already the abstracted version of the story, not the story itself.
 *
 * This component fixes that. It's the same canon scene as the Day 0
 * email (a Saturday afternoon, the laptop fan, a fintech's GitHub on
 * the screen, an email never sent, a Series A announced three weeks
 * later), tightened to ~85 words for a 30-second read, with the same
 * sensory detail the Soap Opera Sequence email earned its 100/100
 * score on:
 *   - low autumn light through the kitchen window
 *   - the fan stopping (silence = the moment of inattention)
 *   - three open tabs (the unsent email is the cliffhanger)
 *   - tripled commit velocity / four contributors / three repos (the
 *     numerical signal the rest of the page argues for)
 *
 * The closing line is the bridge to the product: "This product is the
 * version of me that wouldn't have closed the laptop." That sentence
 * does what the audit asked for — it converts the H1 hook into an
 * emotional payoff before the reader is asked to scroll.
 *
 * Anonymity: narrated in The Data Nerd's first-person voice, no real
 * name, no real face, no real location. The "Athens not San Francisco"
 * geographic anchor stays in /origin where the long-form arc lives.
 *
 * Visual treatment: amber accent border-left signals "this is a story,
 * not copy" — same accent the Manifesto block uses lower on the page,
 * so the reader's eye reads them as the same voice.
 *
 * Server component. Pure markup, no interactivity.
 */
export default function HomeStoryMoment() {
  return (
    <section
      aria-label="How this product started — 30-second story"
      className="my-2 sm:my-3 border-l-2 border-amber-500/50 pl-5 sm:pl-6 py-1"
    >
      <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
        How this started · 30 seconds
      </p>
      <div className="space-y-3 text-gray-200 text-base sm:text-lg leading-relaxed">
        <p className="italic">
          Saturday afternoon, low autumn light through the kitchen
          window. The fan in the back of the laptop had stopped, the
          way it does when nothing is running. I had three open tabs:
          a small fintech&rsquo;s GitHub, my notes file, and a draft
          email I&rsquo;d written and not sent.
        </p>
        <p className="italic">
          Their commit velocity had tripled in fourteen days. Four new
          contributors. Three new infrastructure repos. None of it was
          on Crunchbase yet.
        </p>
        <p className="italic">
          I closed the laptop. Three weeks later they announced a{" "}
          <span className="not-italic font-semibold text-gray-100">
            $4M Series&nbsp;A
          </span>
          .
        </p>
        <p className="text-amber-200 font-semibold not-italic">
          This product is the version of me that wouldn&rsquo;t have
          closed the laptop.
        </p>
      </div>
      <p className="mt-4 text-gray-500 text-xs leading-relaxed">
        Long version on{" "}
        <Link
          href="/origin"
          className="text-amber-400 hover:text-amber-300 underline decoration-dotted"
        >
          /origin
        </Link>
        {" "}— the same scene at full length, plus the three false
        beliefs it collapsed.
      </p>
    </section>
  );
}
