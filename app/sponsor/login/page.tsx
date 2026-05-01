"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useState } from "react";

export default function SponsorLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLinkedInLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await signIn("linkedin", { redirectTo: "/sponsor/discover" });
    } catch {
      setError("Fallo al iniciar sesión con LinkedIn. Intenta de nuevo.");
      setIsLoading(false);
    }
  };

  const handleEmailLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      setError("Completa email y contraseña para continuar.");
      return;
    }

    setError(null);
  };

  return (
    <main className="grid min-h-screen bg-[#f5f6f8] md:grid-cols-[1.1fr_0.9fr]">
      <section className="relative overflow-hidden bg-linear-to-br from-[#07163c] via-[#0c1e4a] to-[#1a2b5a] px-8 py-10 text-white md:px-12 md:py-14">
        <div
          className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/4"
          aria-hidden="true"
        />
        <div
          className="absolute right-16 top-16 h-56 w-56 rounded-full bg-white/5"
          aria-hidden="true"
        />

        <div className="relative z-10 flex min-h-[30vh] flex-col justify-between md:min-h-[calc(100vh-7rem)]">
          <div>
            <Link
              className="inline-flex items-center gap-3"
              href="/"
              aria-label="SponsorHub home"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f79009] text-sm font-bold lowercase text-white">
                s
              </span>
              <span className="text-xl font-bold tracking-tight md:text-2xl">SponsorHub</span>
            </Link>

            <div className="mt-16 max-w-lg">
              <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                <span className="block text-white">Welcome,</span>
                <span className="block text-[#f7b14b]">sponsor brand</span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-relaxed text-[#d3e2f7] md:text-lg">
                Discover verified creators, launch campaigns faster, and manage
                sponsorship opportunities from one place.
              </p>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-[#b7cced] md:mt-0 md:text-base">
            <span>🔎 Curated Creators</span>
            <span>📩 Faster Outreach</span>
            <span>📈 Smarter Campaigns</span>
          </div>
        </div>
      </section>

      <section className="grid place-items-center px-6 py-12 md:px-10 md:py-16">
        <div className="w-full max-w-lg">
          <Link
            href="/login"
            className="mb-6 inline-flex items-center gap-2 text-sm text-[#6b7e9e] transition hover:text-[#0f1c3f]"
          >
            <span aria-hidden="true">←</span>
            Back
          </Link>

          <h2 className="text-2xl font-bold tracking-tight text-[#0f1c3f] md:text-3xl">
            Sponsor Login
          </h2>
          <p className="mt-3 text-sm text-[#6b7e9e] md:text-base">
            Sign in to discover sponsorship opportunities
          </p>

          <div className="mt-8 space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              onClick={handleLinkedInLogin}
              disabled={isLoading}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[#d9e0eb] bg-white px-5 py-4 transition hover:border-[#c5cfdf] hover:shadow-[0_4px_12px_rgba(18,34,72,0.06)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <span className="text-2xl font-bold text-[#0a66c2]" aria-hidden="true">
                in
              </span>
              <span>
                <span className="block text-lg font-semibold text-[#0f1c3f] md:text-xl">
                  {isLoading ? "Connecting..." : "Continue with LinkedIn"}
                </span>
              </span>
            </button>

            <div className="flex items-center gap-4 text-sm text-[#8fa0c9]">
              <span className="h-px flex-1 bg-[#d9e0eb]" aria-hidden="true" />
              <span>OR</span>
              <span className="h-px flex-1 bg-[#d9e0eb]" aria-hidden="true" />
            </div>

            <form onSubmit={handleEmailLogin} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-semibold text-[#0f1c3f]">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="you@company.com"
                  className="w-full rounded-2xl border border-[#d9e0eb] bg-white px-4 py-3 text-[#0f1c3f] outline-none transition placeholder:text-[#8fa0c9] focus:border-[#f79009]"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-semibold text-[#0f1c3f]">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-[#d9e0eb] bg-white px-4 py-3 text-[#0f1c3f] outline-none transition placeholder:text-[#8fa0c9] focus:border-[#f79009]"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-linear-to-r from-[#0a66c2] to-[#0d5ea8] px-5 py-4 text-base font-semibold text-white transition hover:brightness-105"
              >
                Get Started
              </button>
            </form>

            <div className="rounded-lg bg-[#eef5ff] p-4 text-sm text-[#5b7399]">
              <p className="mb-2 font-medium">Why LinkedIn?</p>
              <p>
                We use your LinkedIn profile to keep outreach trusted and help
                brands connect with verified creators.
              </p>
            </div>

            <p className="flex items-center gap-2 text-sm text-[#6b7e9e]">
              <span aria-hidden="true">🛡️</span>
              Your data is encrypted and secure
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
