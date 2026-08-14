"use client";

import { useSearchParams } from "next/navigation";
import PredictForm from "./PredictForm";

/**
 * Reads the ?org= query param client-side so /predict itself stays a
 * static prerender. Awaiting searchParams on the server forced dynamic
 * rendering (private, no-store) on every crawl of this sitemap'd page.
 * Must sit inside a <Suspense> boundary (useSearchParams requirement
 * for static routes). The prefill lookup fires after hydration, same
 * end-to-end behavior as the server-prefill version.
 */
export default function PredictFormUrlPrefill() {
  const org = useSearchParams().get("org") ?? "";
  return <PredictForm initialOrg={org} />;
}
