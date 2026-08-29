import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import CancelFlow from "./CancelFlow";

export const metadata: Metadata = {
  title: "Manage your GitDealFlow subscription",
  robots: { index: false },
};

export default async function CancelPage() {
  if (!(await getSession())) redirect("/login");
  return <CancelFlow />;
}
