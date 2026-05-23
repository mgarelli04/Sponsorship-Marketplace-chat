"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Hide header on login and auth routes
  const hideHeaderRoutes = ["/login", "/creator/login", "/sponsor/login"];
  if (hideHeaderRoutes.includes(pathname)) {
    return null;
  }

  return (
    <header className="border-b border-[#e2e7ef] bg-[#f8f9fb]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <Link className="flex items-center gap-3" href="/" aria-label="SponsorHub home">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#f79009] font-bold text-white">
            s
          </span>
          <span className="text-2xl font-bold tracking-tight">SponsorHub</span>
        </Link>

        <nav className="hidden items-center gap-10 text-sm font-medium text-[#66758f] md:flex">
          <a className="transition-colors hover:text-[#0f1c3f]" href="/#features">
            Features
          </a>
          <a className="transition-colors hover:text-[#0f1c3f]" href="/#how-it-works">
            How it Works
          </a>
          <a className="transition-colors hover:text-[#0f1c3f]" href="/#testimonials">
            Testimonials
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {!session?.user ? (
            <>
              <Link className="px-4 py-2 text-sm font-medium text-[#1c284f]" href="/login">
                Log in
              </Link>
              <Link
                className="rounded-xl bg-[#f79009] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#e88507]"
                href="/"
              >
                Get Started
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-[#0f172a]">{session.user.name}</span>
              {(() => {
                const role = (session.user as any).role as string | undefined;
                if (role === "creator") {
                  return (
                    <Link
                      href="/creator/dashboard"
                      className="rounded-xl bg-[#f79009] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#e88507]"
                    >
                      Ir a Creator
                    </Link>
                  );
                }

                if (role === "sponsor") {
                  return (
                    <Link
                      href="/sponsor/discover"
                      className="rounded-xl bg-[#f79009] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#e88507]"
                    >
                      Ir a Sponsor
                    </Link>
                  );
                }

                return (
                  <Link
                    href="/"
                    className="rounded-xl bg-[#f79009] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#e88507]"
                  >
                    Ir a inicio
                  </Link>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
