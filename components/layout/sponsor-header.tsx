"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const STORAGE_KEY = "sponsorSavedCreators";

function readSavedCount() {
  if (typeof window === "undefined") {
    return 0;
  }

  try {
    const rawSaved = window.localStorage.getItem(STORAGE_KEY);
    const parsed = rawSaved ? (JSON.parse(rawSaved) as string[]) : [];
    return parsed.length;
  } catch {
    return 0;
  }
}

export default function SponsorHeader() {
  const pathname = usePathname();
  const [savedCount, setSavedCount] = useState(0);
  const isDiscoverRoute = pathname === "/sponsor/discover";
  const isSavedRoute = pathname === "/sponsor/saved";

  useEffect(() => {
    const syncSavedCount = () => setSavedCount(readSavedCount());

    syncSavedCount();
    window.addEventListener("sponsor-saved-updated", syncSavedCount);
    window.addEventListener("storage", syncSavedCount);

    return () => {
      window.removeEventListener("sponsor-saved-updated", syncSavedCount);
      window.removeEventListener("storage", syncSavedCount);
    };
  }, []);

  if (pathname === "/sponsor/login" || pathname === "/sponsor/register") {
    return null;
  }

  return (
    <header className="border-b border-[#e4e8ef] bg-white">
      <div className="mx-auto flex h-[56px] w-full max-w-[1260px] items-center justify-between px-4">
        <div className="flex items-center gap-7">
          <Link className="flex items-center gap-2.5" href="/" aria-label="SponsorHub home">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#f79009] text-xs font-bold text-white">
              S
            </span>
            <p className="text-sm font-bold text-[#111827]">SponsorHub</p>
          </Link>

          <div className="hidden items-center gap-6 text-xs font-semibold text-[#4f5f79] md:flex">
            <Link
              className={isDiscoverRoute ? "text-[#111827]" : "text-[#4f5f79] transition hover:text-[#111827]"}
              href="/sponsor/discover"
            >
              Discover
            </Link>
            <Link
              className={isSavedRoute ? "text-[#111827]" : "text-[#4f5f79] transition hover:text-[#111827]"}
              href="/sponsor/saved"
            >
              Saved ({savedCount})
            </Link>
          </div>
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

        <div className="hidden h-7 w-7 items-center justify-center rounded-full bg-[#f3f0ff] text-xs md:flex" aria-label="Sponsor account">
          &#127970;
        </div>
      </div>
    </header>
  );
}
