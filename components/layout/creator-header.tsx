"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/creator/dashboard", label: "Dashboard" },
  { href: "/creator/media-kit", label: "Media Kit" },
  { href: "/creator/events", label: "Events" },
  { href: "/creator/leads", label: "Leads" },
  { href: "/creator/inbox", label: "Inbox" },
];

export default function CreatorHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (pathname === "/creator/login" || pathname === "/creator/register") {
    return null;
  }

  const navClass = (href: string) =>
    pathname === href
      ? "font-semibold text-[#0f1c3f]"
      : "transition-colors hover:text-[#f79009]";

  return (
    <header className="border-b border-[#e2e7ef] bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <Link className="flex items-center gap-3" href="/" aria-label="SponsorHub home">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#f79009] font-bold text-white">s</span>
          <span className="text-2xl font-bold tracking-tight text-[#0f1c3f]">SponsorHub</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#66758f] md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={navClass(item.href)}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-[#66758f] hover:text-[#0f1c3f]" aria-label="Notifications">
            🔔
          </button>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <p className="text-sm font-semibold text-[#0f1c3f]">{session?.user?.name || "Creator"}</p>
              <p className="text-xs text-[#66758f]">Creator</p>
            </div>
          </div>
          <Link
            href="/api/demo-logout"
            className="cursor-pointer ml-2 rounded-lg bg-[#f79009]/10 px-3 py-1.5 text-sm font-medium text-[#f79009] transition hover:bg-[#f79009]/20"
          >
            Sign Out
          </Link>
        </div>
      </div>
    </header>
  );
}
