// Instant-gratification teaser for the post-submit "Almost there" bridge.
//
// Brunson DotCom Secrets, close the value gap. The visitor came for names, so
// the moment they submit we show real names, BEFORE the double opt-in click.
// Three are revealed; the rest stay locked behind email confirmation. That
// reframes the confirm-click from "do this chore to get what I promised" into
// "confirm to unlock the rest + so next Sunday lands in your inbox."
//
// HONESTY: these three mirror the public sample issue (landing/report.html).
// They are presented as "a recent issue / a sample", never as a live,
// personalised list, the recipient's own first issue is generated and sent
// after they confirm. Keep this array in sync with landing/report.html.

export type TeaserSignal = {
  /** GitHub org / startup handle, as it appears in the issue. */
  name: string;
  /** Human sector label. */
  sector: string;
  /** 14-day commit-velocity acceleration, pre-formatted (e.g. "+329%"). */
  momentum: string;
  /** Short signal classification shown as a pill. */
  signalType: string;
};

/** The names we reveal immediately on the bridge page. */
export const TEASER_VISIBLE: TeaserSignal[] = [
  {
    name: "orbiternassp",
    sector: "Space Tech",
    momentum: "+329%",
    signalType: "Engineering momentum spike",
  },
  {
    name: "akto-api-security",
    sector: "Cybersecurity",
    momentum: "+75%",
    signalType: "Sustained momentum",
  },
  {
    name: "NDLANO",
    sector: "EdTech",
    momentum: "+32%",
    signalType: "Platform rebuild",
  },
];

/** How many names stay blurred until the email is confirmed. */
export const TEASER_LOCKED_COUNT = 2;
