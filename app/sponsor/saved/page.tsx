"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useMemo, useState } from "react";

type SavedCreator = {
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
  pitchLine: string;
};

const SAVED_CREATORS_DATA: SavedCreator[] = [
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
    pitchLine: "Strong Gen Z reach and premium nightlife positioning.",
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
    pitchLine: "High-value B2B audience with strong startup ecosystem.",
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
    pitchLine: "Trusted education vertical with international decision-makers.",
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
    pitchLine: "Great for lifestyle activations and product sampling.",
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
    pitchLine: "Perfect fit for wellness and performance brands.",
  },
];

const SAVED_CATEGORIES = [
  "All",
  "Music Festival",
  "Tech Conference",
  "Education",
  "Food & Culture",
  "Health & Wellness",
] as const;

type SavedSortOption = "Recently Saved" | "Highest Match" | "Audience Size";

export default function SponsorSaved() {
  const { data: session, status } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<(typeof SAVED_CATEGORIES)[number]>("All");
  const [sortBy, setSortBy] = useState<SavedSortOption>("Recently Saved");
  const [savedCreatorIds, setSavedCreatorIds] = useState<string[]>([]);

  useEffect(() => {
    const loadSaved = () => {
      try {
        const rawSaved = localStorage.getItem("sponsorSavedCreators");
        const parsed = rawSaved ? (JSON.parse(rawSaved) as string[]) : [];
        setSavedCreatorIds(parsed);
      } catch {
        setSavedCreatorIds([]);
      }
    };

    loadSaved();
    window.addEventListener("sponsor-saved-updated", loadSaved);
    window.addEventListener("storage", loadSaved);

    return () => {
      window.removeEventListener("sponsor-saved-updated", loadSaved);
      window.removeEventListener("storage", loadSaved);
    };
  }, []);

  const toggleSavedCreator = (creatorId: string) => {
    const nextSaved = savedCreatorIds.includes(creatorId)
      ? savedCreatorIds.filter((id) => id !== creatorId)
      : [...savedCreatorIds, creatorId];

    setSavedCreatorIds(nextSaved);

    try {
      localStorage.setItem("sponsorSavedCreators", JSON.stringify(nextSaved));
      window.dispatchEvent(new Event("sponsor-saved-updated"));
    } catch {
      // no-op if localStorage is unavailable
    }
  };

  const savedCreators = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const visible = SAVED_CREATORS_DATA.filter((creator) => {
      if (!savedCreatorIds.includes(creator.id)) {
        return false;
      }

      const matchesCategory = activeCategory === "All" || creator.category === activeCategory;
      const searchableText = [creator.name, creator.location, creator.category, ...creator.tags]
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
        return b.attendees - a.attendees;
      }

      return savedCreatorIds.indexOf(b.id) - savedCreatorIds.indexOf(a.id);
    });
  }, [activeCategory, savedCreatorIds, searchQuery, sortBy]);

  const totalBudget = savedCreators.reduce((sum, creator) => sum + creator.budgetFrom, 0);

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
        <section className="mb-6 rounded-2xl border border-[#dce3ed] bg-white p-5 shadow-[0_2px_10px_rgba(18,34,72,0.05)]">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#7a879d]">Saved Creators</p>
              <h1 className="mt-1 text-3xl font-bold text-[#1f2a44]">Your shortlist</h1>
              <p className="mt-2 text-sm text-[#6f7f98]">
                Keep your favorite events organized and ready for outreach.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[#e1e8f1] bg-[#fbfcfe] px-4 py-3">
                <p className="text-xs text-[#7887a0]">Saved</p>
                <p className="text-xl font-semibold text-[#213151]">{savedCreators.length}</p>
              </div>
              <div className="rounded-xl border border-[#e1e8f1] bg-[#fbfcfe] px-4 py-3">
                <p className="text-xs text-[#7887a0]">Base Budget</p>
                <p className="text-xl font-semibold text-[#213151]">${totalBudget.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-5 flex flex-wrap items-center gap-3">
          <div className="flex min-w-60 flex-1 items-center rounded-xl border border-[#dfe5ee] bg-white px-4 py-3 shadow-[0_2px_8px_rgba(18,31,57,0.03)]">
            <span className="mr-3 text-[#94a2b8]">🔍</span>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search your saved creators..."
              className="w-full bg-transparent text-sm text-[#223151] placeholder:text-[#7f8ba2] focus:outline-none"
            />
          </div>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SavedSortOption)}
            className="h-11 rounded-xl border border-[#dce3ec] bg-white px-3 text-sm font-medium text-[#4f607c] focus:outline-none"
          >
            <option value="Recently Saved">Recently Saved</option>
            <option value="Highest Match">Highest Match</option>
            <option value="Audience Size">Audience Size</option>
          </select>
        </section>

        <section className="mb-5 flex flex-wrap gap-2">
          {SAVED_CATEGORIES.map((category) => {
            const isActive = activeCategory === category;

            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={
                  isActive
                    ? "rounded-full bg-[#fff2dd] px-3 py-1.5 text-xs font-semibold text-[#c97c01]"
                    : "rounded-full border border-[#d8e1ed] bg-white px-3 py-1.5 text-xs font-semibold text-[#5f708b] transition hover:bg-[#f8fafd]"
                }
              >
                {category}
              </button>
            );
          })}
        </section>

        {savedCreators.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-[#d8e0eb] bg-white p-10 text-center">
            <p className="text-lg font-semibold text-[#2b3956]">No saved creators yet</p>
            <p className="mt-2 text-sm text-[#71819b]">
              Start saving events from Discover and they will appear here automatically.
            </p>
            <Link
              href="/sponsor/discover"
              className="mt-5 inline-flex rounded-xl bg-[#f79009] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#da7f08]"
            >
              Go to Discover
            </Link>
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {savedCreators.map((creator) => (
              <article
                key={creator.id}
                className="overflow-hidden rounded-2xl border border-[#d8e0eb] bg-white shadow-[0_2px_10px_rgba(20,33,61,0.05)]"
              >
                <div className="relative h-21.5 bg-linear-to-r from-[#0f1b3f] to-[#13275b] px-4 py-3">
                  <button
                    type="button"
                    onClick={() => toggleSavedCreator(creator.id)}
                    className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-[#7a869f]"
                    aria-label={`Remove ${creator.name} from saved`}
                  >
                    ♥
                  </button>
                </div>

                <div className="relative p-4">
                  <div className="absolute -top-5 left-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#dfe5ee] bg-white text-xl shadow-sm">
                    {creator.icon}
                  </div>

                  <div className="mt-3">
                    <div className="mb-1 flex items-center gap-2">
                      <h3 className="text-2xl font-semibold leading-tight text-[#25344f]">{creator.name}</h3>
                      {creator.verified ? <span className="text-[#1fb97a]">◌</span> : null}
                    </div>

                    <div className="mb-2 flex flex-wrap items-center gap-2 text-sm text-[#6e7e97]">
                      <span>◉ {creator.location}</span>
                      <span className="rounded-full bg-[#edf1f6] px-2 py-0.5 text-xs font-semibold text-[#4f607c]">
                        {creator.category}
                      </span>
                    </div>

                    <p className="mb-3 text-sm text-[#60708a]">{creator.pitchLine}</p>

                    <div className="mb-2 flex items-center justify-between text-sm text-[#6e7e97]">
                      <span>◌ {creator.attendees.toLocaleString()}</span>
                      <span className="rounded-full bg-[#fff2dd] px-2 py-1 text-xs font-semibold text-[#cf7f00]">
                        {creator.matchScore}% match
                      </span>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                      {creator.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-[#f0f3f8] px-2 py-1 text-xs font-medium text-[#70809a]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-[#6c7c96]">From ${creator.budgetFrom}</p>
                      <Link
                        href={`/sponsor/discover?creator=${creator.id}`}
                        className="rounded-xl bg-[#f79009] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#da7f08]"
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

        <p className="mt-8 text-sm text-[#7a879d]">
          Signed in as {session?.user?.name || "Sponsor"}
        </p>
      </div>
    </main>
  );
}
