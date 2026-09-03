import { permanentRedirect } from "next/navigation";

export default function LegacyTweetTeardownThanks() {
  permanentRedirect("/thanks/teardown");
}
