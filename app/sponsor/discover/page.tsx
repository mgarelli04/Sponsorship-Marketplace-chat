"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  ArrowUpDown,
  Grid3X3,
  Heart,
  List,
  MapPin,
  Search,
  Shield,
  SlidersHorizontal,
  Star,
  Users,
  X,
} from "lucide-react";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  type AudienceType,
  type MarketplaceCreator,
  marketplaceCategories,
  marketplaceCreators,
  suggestedSponsorSearches,
} from "@/src/data/sponsor-marketplace";

const STORAGE_KEY = "sponsorSavedCreators";
const EMPTY_SAVED_CREATORS: string[] = [];
let cachedSavedRaw: string | null = null;
let cachedSavedCreators: string[] = EMPTY_SAVED_CREATORS;

const AUDIENCE_SIZE_OPTIONS = ["Any size", "1,000+", "5,000+", "10,000+"] as const;
const BUDGET_OPTIONS = ["Any budget", "Under $5K", "$5K - $15K", "$15K - $35K", "$35K+"] as const;
const SORT_OPTIONS = ["Most Relevant", "Highest Audience", "Lowest CPM", "Recently Updated"] as const;

type AudienceSizeOption = (typeof AUDIENCE_SIZE_OPTIONS)[number];
type BudgetOption = (typeof BUDGET_OPTIONS)[number];
type SortOption = (typeof SORT_OPTIONS)[number];

function readSavedCreators() {
  if (typeof window === "undefined") {
    return EMPTY_SAVED_CREATORS;
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

  window.addEventListener("storage", callback);
  window.addEventListener("sponsor-saved-updated", callback);

  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("sponsor-saved-updated", callback);
  };
}

function writeSavedCreators(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event("sponsor-saved-updated"));
  } catch {
    // Storage can be unavailable in private browsing contexts.
  }
}

function firstPackage(creator: MarketplaceCreator) {
  return creator.packages[0];
}

function bestCpm(creator: MarketplaceCreator) {
  return Math.min(...creator.packages.map((item) => item.cpm));
}

export default function SponsorDiscover() {
  const { data: session, status } = useSession();
  const savedCreatorIds = useSyncExternalStore(
    subscribeToSavedCreators,
    readSavedCreators,
    () => EMPTY_SAVED_CREATORS,
  );
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<(typeof marketplaceCategories)[number]>("All");
  const [audienceSize, setAudienceSize] = useState<AudienceSizeOption>("Any size");
  const [budgetRange, setBudgetRange] = useState<BudgetOption>("Any budget");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedAudienceTypes, setSelectedAudienceTypes] = useState<AudienceType[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("Most Relevant");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredCreators = useMemo(() => {
    const results = marketplaceCreators.filter((creator) => {
      const matchesCategory = selectedCategory === "All" || creator.category === selectedCategory;
      const matchesVerified = !verifiedOnly || creator.verified;
      const matchesAudienceType =
        selectedAudienceTypes.length === 0 ||
        selectedAudienceTypes.some((type) => creator.audienceTypes.includes(type));
      const matchesAudienceSize =
        audienceSize === "Any size" ||
        (audienceSize === "1,000+" && creator.audienceSize >= 1000) ||
        (audienceSize === "5,000+" && creator.audienceSize >= 5000) ||
        (audienceSize === "10,000+" && creator.audienceSize >= 10000);
      const price = firstPackage(creator).price;
      const matchesBudget =
        budgetRange === "Any budget" ||
        (budgetRange === "Under $5K" && price < 5000) ||
        (budgetRange === "$5K - $15K" && price >= 5000 && price <= 15000) ||
        (budgetRange === "$15K - $35K" && price >= 15000 && price <= 35000) ||
        (budgetRange === "$35K+" && price > 35000);

      return (
        matchesCategory &&
        matchesVerified &&
        matchesAudienceType &&
        matchesAudienceSize &&
        matchesBudget
      );
    });

    return results.sort((a, b) => {
      if (sortBy === "Highest Audience") {
        return b.audienceSize - a.audienceSize;
      }

      if (sortBy === "Lowest CPM") {
        return bestCpm(a) - bestCpm(b);
      }

      if (sortBy === "Recently Updated") {
        return b.lastUpdated.localeCompare(a.lastUpdated);
      }

      return b.matchScore - a.matchScore;
    });
  }, [audienceSize, budgetRange, selectedAudienceTypes, selectedCategory, sortBy, verifiedOnly]);

  const toggleAudienceType = (type: AudienceType) => {
    setSelectedAudienceTypes((previous) =>
      previous.includes(type) ? previous.filter((item) => item !== type) : [...previous, type],
    );
  };

  const toggleSave = (creatorId: string) => {
    const nextSaved = savedCreatorIds.includes(creatorId)
      ? savedCreatorIds.filter((id) => id !== creatorId)
      : [...savedCreatorIds, creatorId];

    writeSavedCreators(nextSaved);
  };

  const resetFilters = () => {
    setQuery("");
    setSelectedCategory("All");
    setAudienceSize("Any size");
    setBudgetRange("Any budget");
    setVerifiedOnly(false);
    setSelectedAudienceTypes([]);
  };

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
        <section className="mb-5">
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#8ba0bc]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search creators, events, categories, locations..."
              className="h-12 w-full rounded-lg border border-[#d9e2ef] bg-white pl-12 pr-4 text-sm text-[#24324b] shadow-[0_2px_8px_rgba(15,23,42,0.07)] outline-none placeholder:text-[#64748b]"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {suggestedSponsorSearches.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => setQuery(example)}
                className="rounded-full bg-[#edf2f7] px-3 py-1 text-[11px] font-medium text-[#526984] transition hover:bg-[#e5ecf5]"
              >
                {example}
              </button>
            ))}
          </div>
        </section>

        <div className="flex gap-6">
          {showFilters ? (
            <aside className="hidden w-[255px] shrink-0 lg:block">
              <div className="rounded-lg border border-[#d9e2ef] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.06)]">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-sm font-bold text-[#111827]">Filters</h2>
                  <button
                    type="button"
                    onClick={() => setShowFilters(false)}
                    className="rounded-md p-1 text-[#0f172a] hover:bg-[#f1f5f9]"
                    aria-label="Hide filters"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <FilterBlock title="Category">
                  <div className="space-y-1.5">
                    {marketplaceCategories.map((category) => (
                      <button
                        key={category}
                        type="button"
                        onClick={() => setSelectedCategory(category)}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                          selectedCategory === category
                            ? "bg-[#fff2dd] font-medium text-[#f79009]"
                            : "text-[#526984] hover:bg-[#f3f6fa]"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>
                </FilterBlock>

                <FilterBlock title="Audience Size">
                  <select
                    value={audienceSize}
                    onChange={(event) => setAudienceSize(event.target.value as AudienceSizeOption)}
                    className="h-9 w-full rounded-lg border border-[#d6dfeb] bg-white px-3 text-sm text-[#0f172a] outline-none"
                  >
                    {AUDIENCE_SIZE_OPTIONS.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </FilterBlock>

                <FilterBlock title="Budget Range">
                  <select
                    value={budgetRange}
                    onChange={(event) => setBudgetRange(event.target.value as BudgetOption)}
                    className="h-9 w-full rounded-lg border border-[#d6dfeb] bg-white px-3 text-sm text-[#0f172a] outline-none"
                  >
                    {BUDGET_OPTIONS.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </FilterBlock>

                <label className="mb-5 flex items-center gap-2 text-sm text-[#0f172a]">
                  <input
                    type="checkbox"
                    checked={verifiedOnly}
                    onChange={(event) => setVerifiedOnly(event.target.checked)}
                    className="h-4 w-4 rounded border-[#94a3b8] accent-[#f79009]"
                  />
                  <Shield className="h-3.5 w-3.5 text-[#10b981]" />
                  Verified only
                </label>

                <FilterBlock title="Audience Type">
                  <div className="flex gap-2">
                    {(["B2C", "B2B"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => toggleAudienceType(type)}
                        className={`rounded-full border px-3 py-1 text-xs font-semibold ${
                          selectedAudienceTypes.includes(type)
                            ? "border-[#f0c27a] bg-[#fff2dd] text-[#c67800]"
                            : "border-[#d9e2ef] bg-white text-[#334155]"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </FilterBlock>
              </div>
            </aside>
          ) : null}

          <section className="min-w-0 flex-1">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm text-[#526984]">{filteredCreators.length} creators found</p>
              <div className="flex items-center gap-2">
                {!showFilters ? (
                  <button
                    type="button"
                    onClick={() => setShowFilters(true)}
                    className="hidden h-8 items-center gap-1 rounded-lg border border-[#d9e2ef] bg-white px-3 text-xs text-[#334155] lg:flex"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Filters
                  </button>
                ) : null}
                <label className="relative">
                  <ArrowUpDown className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#334155]" />
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortOption)}
                    className="h-8 w-32 rounded-lg border border-[#d9e2ef] bg-white pl-8 pr-2 text-xs text-[#0f172a] outline-none"
                    aria-label="Sort creators"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <div className="flex h-8 overflow-hidden rounded-lg border border-[#d9e2ef] bg-white">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`grid w-8 place-items-center ${viewMode === "grid" ? "bg-[#edf2f7]" : ""}`}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="h-4 w-4 text-[#334155]" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`grid w-8 place-items-center ${viewMode === "list" ? "bg-[#edf2f7]" : ""}`}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4 text-[#334155]" />
                  </button>
                </div>
              </div>
            </div>

            <section className="mb-6">
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0f172a]">
                <Star className="h-4 w-4 text-[#f79009]" />
                Recommended for you
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {marketplaceCreators.slice(0, 3).map((creator) => (
                  <Link
                    key={creator.id}
                    href={`/sponsor/discover?creator=${creator.id}`}
                    className="w-[190px] shrink-0 rounded-lg border border-[#d9e2ef] bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)] transition hover:shadow-[0_8px_18px_rgba(15,23,42,0.08)]"
                  >
                    <div className="mb-2 text-2xl">{creator.logo}</div>
                    <p className="truncate text-sm font-bold text-[#0f172a]">{creator.name}</p>
                    <p className="text-xs text-[#64748b]">{creator.location}</p>
                    <Match score={creator.matchScore} className="mt-3" />
                  </Link>
                ))}
              </div>
            </section>

            {viewMode === "grid" ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredCreators.map((creator) => (
                  <CreatorCard
                    key={creator.id}
                    creator={creator}
                    isSaved={savedCreatorIds.includes(creator.id)}
                    onToggleSave={() => toggleSave(creator.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {filteredCreators.map((creator) => (
                  <CreatorListItem
                    key={creator.id}
                    creator={creator}
                    isSaved={savedCreatorIds.includes(creator.id)}
                    onToggleSave={() => toggleSave(creator.id)}
                  />
                ))}
              </div>
            )}

            {filteredCreators.length === 0 ? (
              <div className="mt-4 rounded-lg border border-dashed border-[#d9e2ef] bg-white p-8 text-center text-sm text-[#64748b]">
                No creators match the current filters.
                <button type="button" onClick={resetFilters} className="ml-2 font-semibold text-[#f79009]">
                  Reset filters
                </button>
              </div>
            ) : null}

            <p className="mt-8 text-sm text-[#7a879d]">Signed in as {session?.user?.name || "Sponsor"}</p>
          </section>
        </div>
      </div>
    </main>
  );
}

function FilterBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-xs font-bold text-[#0f172a]">{title}</p>
      {children}
    </div>
  );
}

function CreatorCard({
  creator,
  isSaved,
  onToggleSave,
}: {
  creator: MarketplaceCreator;
  isSaved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <article className="group flex h-full min-h-[252px] flex-col overflow-hidden rounded-lg border border-[#d9e2ef] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.07)] transition hover:shadow-[0_8px_20px_rgba(15,23,42,0.08)]">
      <div className="relative h-16 bg-[#13203e]">
        <button
          type="button"
          onClick={onToggleSave}
          className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg border border-[#d9e2ef] bg-white/90 text-[#64748b] hover:text-[#f79009]"
          aria-label={isSaved ? `Remove ${creator.name} from saved` : `Save ${creator.name}`}
        >
          <Heart className={`h-4 w-4 ${isSaved ? "fill-[#f79009] text-[#f79009]" : ""}`} />
        </button>
      </div>
      <div className="relative flex flex-1 flex-col p-4 pt-8">
        <div className="absolute -top-5 left-4 grid h-10 w-10 place-items-center rounded-lg border border-[#d9e2ef] bg-white text-xl shadow-sm">
          {creator.logo}
        </div>
        <div className="mb-1 flex items-center gap-2">
          <h2 className="truncate text-sm font-bold text-[#0f172a] group-hover:text-[#f79009]">{creator.name}</h2>
          {creator.verified ? <Shield className="h-3.5 w-3.5 shrink-0 text-[#10b981]" /> : null}
        </div>
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-[#64748b]">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {creator.location}
          </span>
          <span className="rounded-full border border-[#d9e2ef] px-2 py-0.5 text-[10px] font-semibold text-[#0f172a]">
            {creator.category}
          </span>
        </div>
        <div className="mb-3 flex items-center justify-between text-xs">
          <span className="inline-flex items-center gap-1 text-[#64748b]">
            <Users className="h-3 w-3" />
            {creator.audienceSize.toLocaleString()}
          </span>
          <Match score={creator.matchScore} />
        </div>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {creator.interests.slice(0, 3).map((interest) => (
            <span key={interest} className="rounded-full bg-[#edf2f7] px-2 py-1 text-[10px] font-medium text-[#64748b]">
              {interest}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between">
          <span className="text-xs text-[#64748b]">From ${firstPackage(creator).price.toLocaleString()}</span>
          <Link
            href={`/sponsor/discover?creator=${creator.id}`}
            className="rounded-lg bg-linear-to-r from-[#f79009] to-[#f97316] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
          >
            View Profile
          </Link>
        </div>
      </div>
    </article>
  );
}

function CreatorListItem({
  creator,
  isSaved,
  onToggleSave,
}: {
  creator: MarketplaceCreator;
  isSaved: boolean;
  onToggleSave: () => void;
}) {
  return (
    <article className="flex items-center gap-4 rounded-lg border border-[#d9e2ef] bg-white p-4 shadow-[0_2px_8px_rgba(15,23,42,0.06)]">
      <div className="grid h-12 w-12 place-items-center rounded-lg bg-[#edf2f7] text-2xl">{creator.logo}</div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h2 className="truncate text-sm font-bold text-[#0f172a]">{creator.name}</h2>
          {creator.verified ? <Shield className="h-3.5 w-3.5 text-[#10b981]" /> : null}
          <span className="rounded-full border border-[#d9e2ef] px-2 py-0.5 text-[10px] font-semibold">
            {creator.category}
          </span>
        </div>
        <div className="mt-1 flex flex-wrap gap-4 text-xs text-[#64748b]">
          <span>{creator.location}</span>
          <span>{creator.audienceSize.toLocaleString()} audience</span>
          <span>From ${firstPackage(creator).price.toLocaleString()}</span>
        </div>
      </div>
      <Match score={creator.matchScore} />
      <button type="button" onClick={onToggleSave} className="p-2 text-[#64748b]" aria-label="Save creator">
        <Heart className={`h-4 w-4 ${isSaved ? "fill-[#f79009] text-[#f79009]" : ""}`} />
      </button>
      <Link
        href={`/sponsor/discover?creator=${creator.id}`}
        className="rounded-lg bg-linear-to-r from-[#f79009] to-[#f97316] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
      >
        View
      </Link>
    </article>
  );
}

function Match({ score, className = "" }: { score: number; className?: string }) {
  return (
    <span className={`inline-flex w-fit rounded-full border border-[#ffd59b] bg-[#fff2dd] px-2.5 py-1 text-[11px] font-bold text-[#f79009] ${className}`}>
      {score}% match
    </span>
  );
}
