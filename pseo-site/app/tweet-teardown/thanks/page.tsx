import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";

// Legacy URL kept only as a permanent redirect; never indexable.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function LegacyTweetTeardownThanks() {
  permanentRedirect("/thanks/teardown");
}
