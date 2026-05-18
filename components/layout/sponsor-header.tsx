"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";

function readHistoryCount() {
  if (typeof window === "undefined") return 0;
  try {
    const raw = window.localStorage.getItem("sponsorRecentlyViewed");
    const parsed = raw ? (JSON.parse(raw) as string[]) : [];
    return parsed.length;
  } catch {
    return 0;
  }
}

export default function SponsorHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [historyCount, setHistoryCount] = useState(0);
  const isDiscoverRoute = pathname === "/sponsor/discover";
  const isHistoryRoute = pathname === "/sponsor/history";

  useEffect(() => {
    const syncCount = () => setHistoryCount(readHistoryCount());

    syncCount();
    window.addEventListener("storage", syncCount);

    return () => {
      window.removeEventListener("storage", syncCount);
    };
  }, []);

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

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
              className={isHistoryRoute ? "text-[#111827]" : "text-[#4f5f79] transition hover:text-[#111827]"}
              href="/sponsor/history"
            >
              History
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
            className={isHistoryRoute ? "text-sm font-medium text-[#1f2a44]" : "text-sm font-medium text-[#4f5f79]"}
            href="/sponsor/history"
          >
            History ({historyCount})
          </Link>
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex flex-col items-end">
            <p className="text-xs font-semibold text-[#111827]">{session?.user?.name || "Sponsor"}</p>
            <p className="text-[10px] text-[#6b7280]">Sponsor</p>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-lg bg-[#f79009]/10 px-3 py-1.5 text-xs font-medium text-[#f79009] transition hover:bg-[#f79009]/20"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
