"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function SponsorHeader() {
  const pathname = usePathname();
  const [savedCount, setSavedCount] = useState(0);
  const isDiscoverRoute = pathname === "/sponsor/discover";
  const isSavedRoute = pathname === "/sponsor/saved";

  if (pathname === "/sponsor/login" || pathname === "/sponsor/register") {
    return null;
  }

  useEffect(() => {
    const loadSavedCount = () => {
      try {
        const rawSaved = localStorage.getItem("sponsorSavedCreators");
        const parsed = rawSaved ? (JSON.parse(rawSaved) as string[]) : [];
        setSavedCount(parsed.length);
      } catch {
        setSavedCount(0);
      }
    };

    loadSavedCount();
    window.addEventListener("sponsor-saved-updated", loadSavedCount);
    window.addEventListener("storage", loadSavedCount);

    return () => {
      window.removeEventListener("sponsor-saved-updated", loadSavedCount);
      window.removeEventListener("storage", loadSavedCount);
    };
  }, []);

  return (
    <header className="border-b border-[#e4e8ef] bg-white">
      <div className="mx-auto flex h-18 w-full max-w-305 items-center justify-between px-4 sm:px-6">
        <Link className="flex items-center gap-3" href="/" aria-label="SponsorHub home">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f79009] text-sm font-bold text-white">
            S
          </span>
          <p className="text-[20px] font-semibold text-[#1f2a44]">SponsorHub</p>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-[#4f5f79] md:flex">
          <Link
            className={isDiscoverRoute ? "text-[#1f2a44]" : "text-[#4f5f79] transition hover:text-[#1f2a44]"}
            href="/sponsor/discover"
          >
            Discover
          </Link>
          <Link
            className={isSavedRoute ? "text-[#1f2a44]" : "text-[#4f5f79] transition hover:text-[#1f2a44]"}
            href="/sponsor/saved"
          >
            Saved ({savedCount})
          </Link>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <Link
            className={isDiscoverRoute ? "text-sm font-medium text-[#1f2a44]" : "text-sm font-medium text-[#4f5f79]"}
            href="/sponsor/discover"
          >
            Discover
          </Link>
          <Link
            className={isSavedRoute ? "text-sm font-medium text-[#1f2a44]" : "text-sm font-medium text-[#4f5f79]"}
            href="/sponsor/saved"
          >
            Saved ({savedCount})
          </Link>
        </div>
      </div>
    </header>
  );
}
