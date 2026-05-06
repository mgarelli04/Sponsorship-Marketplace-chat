"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { Heart, MapPin, Search, ShieldCheck, Users } from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import type { DiscoverDataSourceStatus, MarketplaceCreator } from "@/src/data/sponsor-marketplace";

const STORAGE_KEY = "sponsorSavedCreators";
const EMPTY_SAVED_CREATORS: string[] = [];
let cachedSavedRaw: string | null = null;
let cachedSavedCreators: string[] = EMPTY_SAVED_CREATORS;
const SORT_OPTIONS = ["Recently Saved", "Highest Match", "Audience Size"] as const;

type SavedSortOption = (typeof SORT_OPTIONS)[number];

function readSavedCreators() {
  if (typeof window === "undefined") {
    return [] as string[];
  }

  try {
    const rawSaved = window.localStorage.getItem(STORAGE_KEY);
    if (!rawSaved) {
      cachedSavedRaw = null;
      cachedSavedCreators = EMPTY_SAVED_CREATORS;
      return cachedSavedCreators;
    }

    if (rawSaved === cachedSavedRaw) {
      return cachedSavedCreators;
    }

    cachedSavedRaw = rawSaved;
    cachedSavedCreators = JSON.parse(rawSaved) as string[];
    return cachedSavedCreators;
  } catch {
    cachedSavedRaw = null;
    cachedSavedCreators = EMPTY_SAVED_CREATORS;
    return cachedSavedCreators;
  }
}

function subscribeToSavedCreators(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  window.addEventListener("sponsor-saved-updated", callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener("sponsor-saved-updated", callback);
    window.removeEventListener("storage", callback);
  };
}

function writeSavedCreators(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event("sponsor-saved-updated"));
  } catch {
    // Storage may be unavailable in private browsing contexts.
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function SponsorSavedClient({
  creators,
  categories,
  sourceStatus,
  sourceMessage,
}: {
  creators: MarketplaceCreator[];
  categories: string[];
  sourceStatus: DiscoverDataSourceStatus;
  sourceMessage?: string;
}) {
  const { data: session, status } = useSession();
  const savedCreatorIds = useSyncExternalStore(
    subscribeToSavedCreators,
    readSavedCreators,
    () => EMPTY_SAVED_CREATORS,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const categoryOptions = useMemo(() => ["All", ...categories], [categories]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState<SavedSortOption>("Recently Saved");

  const savedCreators = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const visible = creators.filter((creator) => {
      if (!savedCreatorIds.includes(creator.id)) {
        return false;
      }

      const matchesCategory = activeCategory === "All" || creator.category === activeCategory;
      const searchableText = [creator.name, creator.location, creator.category, ...creator.interests]
        .join(" ")
        .toLowerCase();
      const matchesSearch = query.length === 0 || searchableText.includes(query);

      return matchesCategory && matchesSearch;
    });

    return visible.sort((a, b) => {
      if (sortBy === "Highest Match") {
        return b.matchScore - a.matchScore;
      }

      if (sortBy === "Audience Size") {
        return b.audienceSize - a.audienceSize;
      }

      return savedCreatorIds.indexOf(b.id) - savedCreatorIds.indexOf(a.id);
    });
  }, [activeCategory, creators, savedCreatorIds, searchQuery, sortBy]);

  const totalBudget = savedCreators.reduce((sum, creator) => sum + (creator.packages[0]?.price ?? 0), 0);

  const removeSavedCreator = (creatorId: string) => {
    writeSavedCreators(savedCreatorIds.filter((id) => id !== creatorId));
  };

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f6f8]">
        <p className="text-sm font-medium text-[#6b7e9e]">Loading saved creators...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f6f9] text-[#1f2a44]">
      <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6">
        <section className="mb-6 rounded-xl border border-[#dce3ed] bg-white p-5 shadow-[0_2px_10px_rgba(18,34,72,0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#7a879d]">Saved Creators</p>
              <h1 className="mt-1 text-3xl font-bold text-[#1f2a44]">Your shortlist</h1>
              <p className="mt-2 text-sm text-[#6f7f98]">
                Keep strong sponsorship opportunities ready for comparison and outreach.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Metric label="Saved" value={savedCreators.length.toString()} />
              <Metric label="Base Budget" value={formatCurrency(totalBudget)} />
            </div>
          </div>
        </section>

        <section className="mb-5 flex flex-wrap items-center gap-3">
          <div className="flex min-w-60 flex-1 items-center rounded-xl border border-[#dfe5ee] bg-white px-4 py-3 shadow-[0_2px_8px_rgba(18,31,57,0.03)]">
            <Search className="mr-3 h-4 w-4 text-[#94a2b8]" />
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search your saved creators..."
              className="w-full bg-transparent text-sm text-[#223151] outline-none placeholder:text-[#7f8ba2]"
            />
          </div>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SavedSortOption)}
            className="h-11 rounded-xl border border-[#dce3ec] bg-white px-3 text-sm font-bold text-[#4f607c] outline-none"
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </section>

        <section className="mb-5 flex flex-wrap gap-2">
          {categoryOptions.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={
                  isActive
                    ? "rounded-full bg-[#fff2dd] px-3 py-1.5 text-xs font-bold text-[#c97c01]"
                    : "rounded-full border border-[#d8e1ed] bg-white px-3 py-1.5 text-xs font-bold text-[#5f708b] transition hover:bg-[#f8fafd]"
                }
              >
                {category}
              </button>
            );
          })}
        </section>

        {savedCreators.length === 0 ? (
          <section className="rounded-xl border border-dashed border-[#d8e0eb] bg-white p-10 text-center">
            <Heart className="mx-auto h-8 w-8 text-[#f79009]" />
            <p className="mt-3 text-lg font-bold text-[#2b3956]">No saved creators yet</p>
            <p className="mt-2 text-sm text-[#71819b]">
              {sourceStatus === "connected"
                ? "Save opportunities from Discover and they will appear here automatically."
                : sourceMessage ?? "Saved creators are not available because Discover could not load from the database."}
            </p>
            <Link
              href="/sponsor/discover"
              className="mt-5 inline-flex rounded-lg bg-[#f79009] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#da7f08]"
            >
              Go to Discover
            </Link>
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {savedCreators.map((creator) => (
              <article
                key={creator.id}
                className="overflow-hidden rounded-xl border border-[#d8e0eb] bg-white shadow-[0_2px_10px_rgba(20,33,61,0.05)]"
              >
                <div className="relative h-20 bg-linear-to-r from-[#101b3d] to-[#152b63] px-4 py-3">
                  <button
                    type="button"
                    onClick={() => removeSavedCreator(creator.id)}
                    className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/30 bg-white/90 text-[#f79009]"
                    aria-label={`Remove ${creator.name} from saved`}
                  >
                    <Heart className="h-4 w-4 fill-[#f79009]" />
                  </button>
                </div>

                <div className="relative p-4">
                  <div className="absolute -top-6 left-4 inline-flex h-12 w-12 items-center justify-center rounded-xl border border-[#dfe5ee] bg-white text-sm font-black text-[#f79009] shadow-sm">
                    {creator.logo}
                  </div>

                  <div className="mt-4">
                    <div className="mb-1 flex items-center gap-2">
                      <h2 className="text-base font-bold leading-tight text-[#25344f]">{creator.name}</h2>
                      {creator.verified ? <ShieldCheck className="h-4 w-4 text-emerald-500" /> : null}
                    </div>
                    <p className="mb-3 line-clamp-2 min-h-10 text-xs leading-5 text-[#65748d]">{creator.tagline}</p>

                    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs font-medium text-[#6e7e97]">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {creator.location}
                      </span>
                      <span className="rounded-full bg-[#edf1f6] px-2 py-0.5 text-[11px] font-bold text-[#4f607c]">
                        {creator.category}
                      </span>
                    </div>

                    <div className="mb-4 flex items-center justify-between text-xs font-bold text-[#60708a]">
                      <span className="inline-flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {creator.audienceSize.toLocaleString()}
                      </span>
                      <span className="rounded-full border border-[#ffd59b] bg-[#fff2dd] px-2.5 py-1 text-[11px] text-[#cf7f00]">
                        {creator.matchScore}% match
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-bold text-[#6c7c96]">
                        {creator.packages[0] ? `From ${formatCurrency(creator.packages[0].price)}` : "No public package"}
                      </p>
                      <Link
                        href={`/sponsor/discover?creator=${creator.id}`}
                        className="rounded-lg bg-[#f79009] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#da7f08]"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}

        <p className="mt-8 text-sm text-[#7a879d]">Signed in as {session?.user?.name || "Sponsor"}</p>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-[#e1e8f1] bg-[#fbfcfe] px-4 py-3">
      <p className="text-xs text-[#7887a0]">{label}</p>
      <p className="text-xl font-bold text-[#213151]">{value}</p>
    </div>
  );
}
