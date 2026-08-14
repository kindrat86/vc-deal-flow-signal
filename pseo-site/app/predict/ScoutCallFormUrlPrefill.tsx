"use client";

import { useSearchParams } from "next/navigation";
import ScoutCallForm from "./ScoutCallForm";

/**
 * Reads the ?org= query param client-side so /predict stays a static
 * prerender (the server previously awaited searchParams to produce this
 * prefill, forcing private, no-store on every crawl). Must sit inside a
 * <Suspense> boundary: useSearchParams on a static route requires it.
 * Line-2 consumers: none, this wrapper exists solely for the /predict page.
 */
export default function ScoutCallFormUrlPrefill() {
  const org = useSearchParams().get("org") ?? "";
  return <ScoutCallForm prefilledOrg={org} />;
}
