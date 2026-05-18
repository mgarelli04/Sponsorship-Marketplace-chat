"use client";

import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();

  if (pathname === "/login") {
    return null;
  }

  return (
    <footer className="bg-[#f4f5f7] px-6 py-7">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <a className="flex items-center gap-3" href="/" aria-label="SponsorHub home footer">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#f79009] font-bold text-white">
            s
          </span>
          <span className="text-2xl font-bold tracking-tight text-[#0b173b]">SponsorHub</span>
        </a>
        <p className="text-base text-[#5f7190]">&copy; 2025 SponsorHub. All rights reserved.</p>
      </div>
    </footer>
  );
}
