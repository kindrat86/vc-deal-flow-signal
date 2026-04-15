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
    <div className="max-w-md mx-auto px-6 py-20">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-2">
          Log in to your Dashboard
        </h1>
        <p className="text-gray-400">
          Enter the email you used when subscribing.
        </p>
      </div>

      <Suspense>
        <LoginForm />
      </Suspense>

      <div className="mt-10 pt-6 border-t border-slate-800 text-center">
        <p className="text-gray-500 text-sm mb-3">
          Don&apos;t have a subscription yet?
        </p>
        <Link
          href="https://gitdealflow.com/#pricing"
          className="text-sky-500 hover:text-sky-400 text-sm font-medium transition"
        >
          See pricing plans
        </Link>
      </div>
    </div>
  );
}
