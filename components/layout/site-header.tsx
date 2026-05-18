"use client";

import { usePathname } from "next/navigation";

export default function SiteHeader() {
  const pathname = usePathname();

  // Hide header on login and auth routes
  const hideHeaderRoutes = ["/login", "/creator/login", "/sponsor/login"];
  if (hideHeaderRoutes.includes(pathname)) {
    return null;
  }

  return (
    <header className="border-b border-[#e2e7ef] bg-[#f8f9fb]/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <a className="flex items-center gap-3" href="/" aria-label="SponsorHub home">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#f79009] font-bold text-white">
            s
          </span>
          <span className="text-2xl font-bold tracking-tight">SponsorHub</span>
        </a>

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
          <a className="px-4 py-2 text-sm font-medium text-[#1c284f]" href="/login">
            Log in
          </a>
          <a
            className="rounded-xl bg-[#f79009] px-5 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#e88507]"
            href="/"
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}
