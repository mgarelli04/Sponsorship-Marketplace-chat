"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { History, MapPin, Shield, Users, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { DiscoverDataSourceStatus, MarketplaceCreator } from "@/src/data/sponsor-marketplace";

const RECENTLY_KEY = "sponsorRecentlyViewed";

function readRecentlyViewed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(RECENTLY_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function firstPackage(creator: MarketplaceCreator) {
  return creator.packages[0] ?? null;
}

export default function SponsorHistoryClient({
  creators,
  sourceStatus,
  sourceMessage,
}: {
  creators: MarketplaceCreator[];
  sourceStatus: DiscoverDataSourceStatus;
  sourceMessage?: string;
}) {
  const { data: session, status } = useSession();
  const [recentIds, setRecentIds] = useState<string[]>([]);

  useEffect(() => {
    setRecentIds(readRecentlyViewed());
  }, []);

  const refreshHistory = () => setRecentIds(readRecentlyViewed());

  const clearHistory = () => {
    try {
      window.localStorage.removeItem(RECENTLY_KEY);
    } catch {}
    setRecentIds([]);
  };

  const recentCreators = useMemo(
    () => recentIds.map((id) => creators.find((c) => c.id === id)).filter(Boolean) as MarketplaceCreator[],
    [creators, recentIds],
  );

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8fafc]">
        <p className="text-sm text-[#64748b]">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#0f172a]">
      <div className="mx-auto w-full max-w-[1260px] px-4 py-7">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-[#7a879d]">History</p>
            <h1 className="mt-1 text-3xl font-bold text-[#1f2a44]">Recently viewed</h1>
            <p className="mt-2 text-sm text-[#6f7f98]">
              Profiles you have visited, sorted from most recent.
            </p>
          </div>
          {recentCreators.length > 0 && (
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Are you sure you want to clear your entire browsing history?")) {
                  clearHistory();
                }
              }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#d9e2ef] bg-white px-4 py-2 text-xs font-medium text-[#64748b] transition hover:bg-[#f1f5f9]"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Clear history
            </button>
          )}
        </div>

        {recentCreators.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {recentCreators.map((creator) => (
              <article
                key={creator.id}
                className="overflow-hidden rounded-xl border border-[#d8e0eb] bg-white shadow-[0_2px_10px_rgba(20,33,61,0.05)]"
              >
                <div className="relative h-16 bg-linear-to-r from-[#101b3d] to-[#152b63]" />
                <div className="relative p-4">
                  <div className="absolute -top-6 left-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dfe5ee] bg-white text-sm font-black text-[#f79009] shadow-sm">
                    {creator.logo}
                  </div>
                  <div className="mt-4">
                    <div className="mb-1 flex items-center gap-2">
                      <h2 className="text-sm font-bold leading-tight text-[#25344f]">{creator.name}</h2>
                      {creator.verified ? <Shield className="h-3.5 w-3.5 text-emerald-500" /> : null}
                    </div>
                    <p className="mb-3 text-xs text-[#65748d]">{creator.tagline}</p>
                    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-[#6e7e97]">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {creator.location}
                      </span>
                      <span className="rounded-full bg-[#edf1f6] px-2 py-0.5 text-[11px] font-bold text-[#4f607c]">
                        {creator.category}
                      </span>
                    </div>
                    <div className="mb-3 flex items-center text-xs text-[#60708a]">
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {creator.audienceSize.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-bold text-[#6c7c96]">
                        {firstPackage(creator) ? `From $${firstPackage(creator)!.price.toLocaleString()}` : "No public package"}
                      </p>
                      <Link
                        href={`/sponsor/discover/${creator.id}`}
                        className="rounded-lg bg-[#f79009] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#da7f08]"
                        onClick={refreshHistory}
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#d8e0eb] bg-white p-10 text-center">
            <History className="mx-auto h-8 w-8 text-[#64748b]" />
            <p className="mt-3 text-lg font-bold text-[#2b3956]">No history yet</p>
            <p className="mt-2 text-sm text-[#71819b]">
              Profiles you visit will appear here automatically.
            </p>
            <Link
              href="/sponsor/discover"
              className="mt-5 inline-flex rounded-lg bg-[#f79009] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#da7f08]"
            >
              Go to Discover
            </Link>
          </div>
        )}

        <p className="mt-8 text-sm text-[#7a879d]">Signed in as {session?.user?.name || "Sponsor"}</p>
      </div>
    </main>
  );
}
