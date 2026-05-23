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

  if (pathname === "/sponsor/login" || pathname === "/sponsor/register") return null;

  return (
    <header className="border-b border-[#e2e7ef] bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <Link className="flex items-center gap-3" href="/" aria-label="SponsorHub home">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#f79009] font-bold text-white">s</span>
          <span className="text-2xl font-bold tracking-tight text-[#0f1c3f]">SponsorHub</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#66758f] md:flex">
          <Link className={isDiscoverRoute ? "font-semibold text-[#0f1c3f]" : "transition-colors hover:text-[#f79009]"} href="/sponsor/discover">Discover</Link>
          <Link className={isHistoryRoute ? "font-semibold text-[#0f1c3f]" : "transition-colors hover:text-[#f79009]"} href="/sponsor/history">History</Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="flex flex-col items-end">
            <p className="text-sm font-semibold text-[#0f1c3f]">{session?.user?.name || "Sponsor"}</p>
            <p className="text-xs text-[#66758f]">Sponsor</p>
          </div>
          <button
            onClick={handleSignOut}
            className="cursor-pointer rounded-lg bg-[#f79009]/10 px-3 py-1.5 text-sm font-medium text-[#f79009] transition hover:bg-[#f79009]/20"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
