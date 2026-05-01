"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

type AudienceType = "B2C" | "B2B";

type CreatorCard = {
  id: string;
  icon: string;
  name: string;
  location: string;
  category: string;
  attendees: number;
  matchScore: number;
  tags: string[];
  budgetFrom: number;
  verified: boolean;
  audienceTypes: AudienceType[];
};

const CREATORS: CreatorCard[] = [
  {
    id: "neon-nights-festival",
    icon: "🎵",
    name: "Neon Nights Festival",
    location: "Los Angeles, CA",
    category: "Music Festival",
    attendees: 15000,
    matchScore: 94,
    tags: ["Electronic Music", "Nightlife", "Fashion"],
    budgetFrom: 5000,
    verified: true,
    audienceTypes: ["B2C"],
  },
  {
    id: "techforward-summit",
    icon: "💻",
    name: "TechForward Summit",
    location: "Austin, TX",
    category: "Tech Conference",
    attendees: 3200,
    matchScore: 87,
    tags: ["SaaS", "AI/ML", "Venture Capital"],
    budgetFrom: 3000,
    verified: true,
    audienceTypes: ["B2B"],
  },
  {
    id: "educonnect-global",
    icon: "📊",
    name: "EduConnect Global",
    location: "Madrid, Spain",
    category: "Education",
    attendees: 2000,
    matchScore: 76,
    tags: ["EdTech", "K-12", "Higher Ed"],
    budgetFrom: 2500,
    verified: true,
    audienceTypes: ["B2B", "B2C"],
  },
  {
    id: "street-flavor-expo",
    icon: "🍔",
    name: "Street Flavor Expo",
    location: "Barcelona, Spain",
    category: "Food & Culture",
    attendees: 4200,
    matchScore: 72,
    tags: ["Food Trucks", "Family", "Lifestyle"],
    budgetFrom: 2800,
    verified: false,
    audienceTypes: ["B2C"],
  },
  {
    id: "wellness-live-summit",
    icon: "🧘",
    name: "Wellness Live Summit",
    location: "Miami, FL",
    category: "Health & Wellness",
    attendees: 1800,
    matchScore: 68,
    tags: ["Fitness", "Supplements", "Mindfulness"],
    budgetFrom: 2200,
    verified: false,
    audienceTypes: ["B2C", "B2B"],
  },
];

const SUGGESTED_SEARCHES = [
  "Music festivals in California with 2000+ attendees",
  "Tech conferences in Austin targeting Gen Z",
  "Education events in Madrid with verified audience data",
];

const CATEGORIES = [
  "All",
  "Music Festival",
  "Tech Conference",
  "Education",
  "Food & Culture",
  "Health & Wellness",
] as const;

const AUDIENCE_SIZE_OPTIONS = ["Any size", "Under 2K", "2K - 5K", "5K+"] as const;
const BUDGET_OPTIONS = ["Any budget", "Under $3K", "$3K - $5K", "$5K+"] as const;

type AudienceSizeOption = (typeof AUDIENCE_SIZE_OPTIONS)[number];
type BudgetOption = (typeof BUDGET_OPTIONS)[number];
type SortOption = "Most Relevant" | "Highest Match" | "Audience Size" | "Lowest Budget";

export default function SponsorDiscover() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [audienceSize, setAudienceSize] = useState<AudienceSizeOption>("Any size");
  const [budgetRange, setBudgetRange] = useState<BudgetOption>("Any budget");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [selectedAudienceTypes, setSelectedAudienceTypes] = useState<AudienceType[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>("Most Relevant");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [savedCreatorIds, setSavedCreatorIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const rawSaved = localStorage.getItem("sponsorSavedCreators");
      const parsed = rawSaved ? (JSON.parse(rawSaved) as string[]) : [];
      setSavedCreatorIds(parsed);
    } catch {
      setSavedCreatorIds([]);
    }
  }, []);

  const toggleAudienceType = (type: AudienceType) => {
    setSelectedAudienceTypes((prev) =>
      prev.includes(type) ? prev.filter((item) => item !== type) : [...prev, type],
    );
  };

  const toggleSavedCreator = (creatorId: string) => {
    const nextSaved = savedCreatorIds.includes(creatorId)
      ? savedCreatorIds.filter((id) => id !== creatorId)
      : [...savedCreatorIds, creatorId];

    setSavedCreatorIds(nextSaved);

    try {
      localStorage.setItem("sponsorSavedCreators", JSON.stringify(nextSaved));
      window.dispatchEvent(new Event("sponsor-saved-updated"));
    } catch {
      // no-op if storage is unavailable
    }
  };

  const resetFilters = () => {
    setSelectedCategory("All");
    setAudienceSize("Any size");
    setBudgetRange("Any budget");
    setVerifiedOnly(false);
    setSelectedAudienceTypes([]);
    setSearchQuery("");
    setSortBy("Most Relevant");
  };

  const filteredCreators = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    const results = CREATORS.filter((creator) => {
      const matchesCategory =
        selectedCategory === "All" || creator.category === selectedCategory;

      const matchesAudienceSize =
        audienceSize === "Any size" ||
        (audienceSize === "Under 2K" && creator.attendees < 2000) ||
        (audienceSize === "2K - 5K" && creator.attendees >= 2000 && creator.attendees <= 5000) ||
        (audienceSize === "5K+" && creator.attendees > 5000);

      const matchesBudget =
        budgetRange === "Any budget" ||
        (budgetRange === "Under $3K" && creator.budgetFrom < 3000) ||
        (budgetRange === "$3K - $5K" && creator.budgetFrom >= 3000 && creator.budgetFrom <= 5000) ||
        (budgetRange === "$5K+" && creator.budgetFrom > 5000);

      const matchesVerified = !verifiedOnly || creator.verified;

      const matchesAudienceType =
        selectedAudienceTypes.length === 0 ||
        selectedAudienceTypes.some((type) => creator.audienceTypes.includes(type));

      const haystack = [
        creator.name,
        creator.location,
        creator.category,
        ...creator.tags,
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch = normalizedQuery.length === 0 || haystack.includes(normalizedQuery);

      return (
        matchesCategory &&
        matchesAudienceSize &&
        matchesBudget &&
        matchesVerified &&
        matchesAudienceType &&
        matchesSearch
      );
    });

    return results.sort((a, b) => {
      if (sortBy === "Audience Size") {
        return b.attendees - a.attendees;
      }

      if (sortBy === "Lowest Budget") {
        return a.budgetFrom - b.budgetFrom;
      }

      if (sortBy === "Highest Match" || sortBy === "Most Relevant") {
        return b.matchScore - a.matchScore;
      }

      return 0;
    });
  }, [
    searchQuery,
    selectedCategory,
    audienceSize,
    budgetRange,
    verifiedOnly,
    selectedAudienceTypes,
    sortBy,
  ]);

  const recommendedCreators = filteredCreators.slice(0, 3);

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f6f8]">
        <p className="text-[#6b7e9e]">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f6f9] text-[#1f2a44]">
      <div className="mx-auto w-full max-w-305 px-4 py-7 sm:px-6">
        <div className="mb-3 flex items-center rounded-xl border border-[#dfe5ee] bg-white px-4 py-3 shadow-[0_2px_8px_rgba(18,31,57,0.03)]">
          <span className="mr-3 text-[#94a2b8]">🔍</span>
          <input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search creators, events, categories, locations..."
            className="w-full bg-transparent text-sm text-[#223151] placeholder:text-[#7f8ba2] focus:outline-none"
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          {SUGGESTED_SEARCHES.map((chip) => (
            <button
              type="button"
              key={chip}
              onClick={() => setSearchQuery(chip)}
              className="rounded-full bg-[#eef2f7] px-3 py-1 text-xs font-medium text-[#60708a] transition hover:bg-[#e4ebf4]"
            >
              {chip}
            </button>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[230px_1fr]">
          <aside className="h-fit rounded-2xl border border-[#dde4ee] bg-white p-4 shadow-[0_2px_10px_rgba(23,34,56,0.04)]">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[20px] font-semibold text-[#2a3650]">Filters</h2>
              <button onClick={resetFilters} className="text-lg text-[#6f7f99]" aria-label="Reset filters">
                ×
              </button>
            </div>

            <div className="mb-6">
              <p className="mb-3 text-sm font-semibold text-[#384661]">Category</p>
              <div className="space-y-2 text-[15px]">
                {CATEGORIES.map((category) => {
                  const isActive = selectedCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setSelectedCategory(category)}
                      className={
                        isActive
                          ? "block w-full rounded-xl bg-[#fff2dd] px-3 py-2 text-left font-semibold text-[#f79009]"
                          : "block w-full rounded-xl px-3 py-2 text-left text-[#6a7990] transition hover:bg-[#f3f6fa]"
                      }
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mb-5">
              <p className="mb-2 text-sm font-semibold text-[#384661]">Audience Size</p>
              <select
                value={audienceSize}
                onChange={(event) => setAudienceSize(event.target.value as AudienceSizeOption)}
                className="w-full rounded-xl border border-[#dce3ed] bg-white px-3 py-2 text-sm text-[#60708a] focus:border-[#c7d0dd] focus:outline-none"
              >
                {AUDIENCE_SIZE_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <p className="mb-2 text-sm font-semibold text-[#384661]">Budget Range</p>
              <select
                value={budgetRange}
                onChange={(event) => setBudgetRange(event.target.value as BudgetOption)}
                className="w-full rounded-xl border border-[#dce3ed] bg-white px-3 py-2 text-sm text-[#60708a] focus:border-[#c7d0dd] focus:outline-none"
              >
                {BUDGET_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            <label className="mb-5 flex cursor-pointer items-center gap-2 text-sm text-[#50607b]">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(event) => setVerifiedOnly(event.target.checked)}
                className="h-4 w-4 rounded border border-[#7b8aa4]"
              />
              <span>Verified only</span>
            </label>

            <div>
              <p className="mb-2 text-sm font-semibold text-[#384661]">Audience Type</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => toggleAudienceType("B2C")}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    selectedAudienceTypes.includes("B2C")
                      ? "border-[#f0c27a] bg-[#fff2dd] text-[#c67800]"
                      : "border-[#d6deea] text-[#556582] hover:bg-[#f5f8fc]"
                  }`}
                >
                  B2C
                </button>
                <button
                  type="button"
                  onClick={() => toggleAudienceType("B2B")}
                  className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                    selectedAudienceTypes.includes("B2B")
                      ? "border-[#f0c27a] bg-[#fff2dd] text-[#c67800]"
                      : "border-[#d6deea] text-[#556582] hover:bg-[#f5f8fc]"
                  }`}
                >
                  B2B
                </button>
              </div>
            </div>
          </aside>

          <section>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xl font-semibold text-[#3a4862]">{filteredCreators.length} creators found</p>
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortOption)}
                  className="h-9 rounded-xl border border-[#dce3ec] bg-white px-3 text-sm font-medium text-[#4f607c] focus:outline-none"
                >
                  <option value="Most Relevant">Most Relevant</option>
                  <option value="Highest Match">Highest Match</option>
                  <option value="Audience Size">Audience Size</option>
                  <option value="Lowest Budget">Lowest Budget</option>
                </select>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border text-[#687892] ${
                    viewMode === "grid"
                      ? "border-[#f0c27a] bg-[#fff2dd]"
                      : "border-[#dce3ec] bg-white"
                  }`}
                >
                  ▦
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`inline-flex h-9 w-9 items-center justify-center rounded-xl border text-[#687892] ${
                    viewMode === "list"
                      ? "border-[#f0c27a] bg-[#fff2dd]"
                      : "border-[#dce3ec] bg-white"
                  }`}
                >
                  ☰
                </button>
              </div>
            </div>

            <div className="mb-2 flex items-center gap-2 text-base font-semibold text-[#2d3a55]">
              <span className="text-[#f7a31a]">☆</span>
              <span>Recommended for you</span>
            </div>

            <div className="mb-5 grid gap-3 md:grid-cols-3">
              {recommendedCreators.map((item) => (
                <article
                  key={item.name}
                  className="rounded-2xl border border-[#dbe3ed] bg-white p-4 shadow-[0_2px_8px_rgba(20,33,60,0.04)]"
                >
                  <div className="mb-2 text-2xl">{item.icon}</div>
                  <p className="text-lg font-semibold text-[#293652]">{item.name}</p>
                  <p className="mb-3 text-sm text-[#6f809a]">{item.location}</p>
                  <span className="inline-flex rounded-full bg-[#fff2dd] px-3 py-1 text-xs font-semibold text-[#cf7f00]">
                    {item.matchScore}% match
                  </span>
                </article>
              ))}
            </div>

            <div
              className={`grid gap-4 ${
                viewMode === "grid" ? "md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"
              }`}
            >
              {filteredCreators.map((card) => (
                <article
                  key={card.name}
                  className="overflow-hidden rounded-2xl border border-[#d8e0eb] bg-white shadow-[0_2px_10px_rgba(20,33,61,0.05)]"
                >
                  <div className="relative h-21.5 bg-linear-to-r from-[#0f1b3f] to-[#13275b] px-4 py-3">
                    <button
                      type="button"
                      onClick={() => toggleSavedCreator(card.id)}
                      className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-[#7a869f]"
                    >
                      {savedCreatorIds.includes(card.id) ? "♥" : "♡"}
                    </button>
                  </div>

                  <div className="relative p-4">
                    <div className="absolute -top-5 left-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dfe5ee] bg-white text-xl shadow-sm">
                      {card.icon}
                    </div>

                    <div className="mt-3">
                      <div className="mb-1 flex items-center gap-2">
                        <h3 className="text-2xl font-semibold leading-tight text-[#25344f]">{card.name}</h3>
                        {card.verified ? <span className="text-[#1fb97a]">◌</span> : null}
                      </div>

                      <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-[#6e7e97]">
                        <span>◉ {card.location}</span>
                        <span className="rounded-full bg-[#edf1f6] px-2 py-0.5 text-xs font-semibold text-[#4f607c]">
                          {card.category}
                        </span>
                      </div>

                      <div className="mb-2 flex items-center justify-between text-sm text-[#6e7e97]">
                        <span>◌ {card.attendees.toLocaleString()}</span>
                        <span className="rounded-full bg-[#fff2dd] px-2 py-1 text-xs font-semibold text-[#cf7f00]">
                          {card.matchScore}% match
                        </span>
                      </div>

                      <div className="mb-4 flex flex-wrap gap-2">
                        {card.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-[#f0f3f8] px-2 py-1 text-xs font-medium text-[#70809a]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-[#6c7c96]">From ${card.budgetFrom}</p>
                        <Link
                          href={`/sponsor/discover?creator=${card.id}`}
                          className="rounded-xl bg-[#f79009] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#da7f08]"
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            {filteredCreators.length === 0 ? (
              <div className="mt-4 rounded-2xl border border-dashed border-[#d9e0eb] bg-white p-8 text-center text-sm text-[#6f809a]">
                No creators match the current filters. Try broadening your criteria.
              </div>
            ) : null}
          </section>
        </div>

        <p className="mt-8 text-sm text-[#7a879d]">
          Signed in as {session?.user?.name || "Sponsor"}
        </p>
      </div>
    </main>
  );
}
