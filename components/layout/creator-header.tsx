"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { href: "/creator/dashboard", label: "Dashboard" },
  { href: "/creator/media-kit", label: "Media Kit" },
  { href: "/creator/events", label: "Events" },
  { href: "/creator/leads", label: "Leads" },
];

export default function CreatorHeader() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/creator/login" || pathname === "/creator/register") {
    return null;
  }

  const navButtonClass = (href: string) =>
    pathname === href
      ? "cursor-pointer font-semibold text-[#0f1c3f]"
      : "cursor-pointer transition-colors hover:text-[#f79009]";

  const handleSignOut = () => {
    signOut({ callbackUrl: "/login" });
  };

  return (
    <header className="border-b border-[#e2e7ef] bg-white">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <Link className="flex items-center gap-3" href="/" aria-label="SponsorHub home">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-[#f79009] font-bold text-white">s</span>
          <span className="text-2xl font-bold tracking-tight text-[#0f1c3f]">SponsorHub</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[#66758f] md:flex">
          {navItems.map((item) => (
            <button
              key={item.href}
              type="button"
              onClick={() => router.push(item.href)}
              className={navButtonClass(item.href)}
            >
              {item.label}
            </button>
          ))}
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
