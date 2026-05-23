"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function CreatorHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (pathname === "/creator/login" || pathname === "/creator/register") {
    return null;
  }

  const navLinkClass = (href: string) =>
    pathname === href
      ? "font-semibold text-[#0f1c3f]"
      : "transition-colors hover:text-[#f79009]";

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="border-b border-[#e2e7ef] bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <a className="flex items-center gap-3" href="/" aria-label="SponsorHub home">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#f79009] font-bold text-white">s</span>
          <span className="text-2xl font-bold tracking-tight text-[#0f1c3f]">SponsorHub</span>
        </a>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#66758f] md:flex">
          <a className={navLinkClass("/creator/dashboard")} href="/creator/dashboard">
            Dashboard
          </a>
          <a className={navLinkClass("/creator/media-kit")} href="/creator/media-kit">
            Media Kit
          </a>
          <a className={navLinkClass("/creator/leads")} href="/creator/leads">
            Leads
          </a>
        </nav>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-[#66758f] hover:text-[#0f1c3f]" aria-label="Notifications">
            🔔
          </button>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <p className="text-sm font-semibold text-[#0f1c3f]">{session?.user?.name || "User"}</p>
              <p className="text-xs text-[#66758f]">Creator</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="cursor-pointer ml-2 rounded-lg bg-[#f79009]/10 px-3 py-1.5 text-sm font-medium text-[#f79009] transition hover:bg-[#f79009]/20"
          >
            Sign Out
          </button>
        </div>
      </div>
    </header>
  );
}
