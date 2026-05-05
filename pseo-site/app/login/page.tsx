import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Log In — VC Deal Flow Signal",
  robots: { index: false },
};

export default async function LoginPage() {
  const session = await getSession();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="relative min-h-[calc(100vh-3.5rem-1px)] flex items-center justify-center px-6 py-12 brand-glow">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link
            href="https://gitdealflow.com"
            className="inline-flex items-center gap-2 mb-6 text-gray-100 font-semibold hover:text-sky-400 transition-colors"
          >
            <span
              aria-hidden="true"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-indigo-600 text-sm font-bold text-slate-950 shadow-md shadow-sky-500/30"
            >
              G
            </span>
            <span className="tracking-tight">VC Deal Flow Signal</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-2 tracking-tight">
            Log in to your Dashboard
          </h1>
          <p className="text-gray-400 text-sm">
            Enter the email you used when subscribing.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm p-6 sm:p-8 shadow-lg shadow-slate-950/40">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm mb-2">
            Don&apos;t have a subscription yet?
          </p>
          <Link
            href="https://gitdealflow.com/#pricing"
            className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors"
          >
            See pricing plans <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
