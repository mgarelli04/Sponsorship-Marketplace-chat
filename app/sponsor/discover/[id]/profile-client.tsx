"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft, DollarSign, Lock, MapPin, Shield, Users, Calendar, CheckCircle2, Heart,
  X, TrendingUp, Eye, MessageCircle,
} from "lucide-react";
import { useEffect, useSyncExternalStore, useState } from "react";
import type { CreatorProfileData } from "@/src/data/sponsor-creator-profile";

const STORAGE_KEY = "sponsorSavedCreators";
const EMPTY_SAVED: string[] = [];
let cachedSaved: string[] = EMPTY_SAVED;
let cachedRaw: string | null = null;

function readSaved() {
  if (typeof window === "undefined") return EMPTY_SAVED;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === cachedRaw) return cachedSaved;
    cachedRaw = raw;
    cachedSaved = raw ? (JSON.parse(raw) as string[]) : EMPTY_SAVED;
    return cachedSaved;
  } catch {
    cachedRaw = null;
    cachedSaved = EMPTY_SAVED;
    return cachedSaved;
  }
}

function subscribeToSaved(cb: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", cb);
  window.addEventListener("sponsor-saved-updated", cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener("sponsor-saved-updated", cb);
  };
}

function writeSaved(ids: string[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    window.dispatchEvent(new Event("sponsor-saved-updated"));
  } catch {}
}

const GOALS = {
  brand_awareness: { label: "Brand Awareness", desc: "Increase brand recognition among the creator's audience" },
  lead_generation: { label: "Lead Generation", desc: "Capture qualified contacts and potential customers" },
  product_launch: { label: "Product Launch", desc: "Introduce a new product or service to the market" },
  community_building: { label: "Community Building", desc: "Connect with a community and build brand affinity" },
  sampling: { label: "Sampling", desc: "Distribute samples and gather direct audience feedback" },
  employer_branding: { label: "Employer Branding", desc: "Position your company as an attractive place to work" },
} as const;

const BUDGET_OPTIONS = [
  { value: "5000-15000", label: "$5K - $15K", min: "5000", max: "15000" },
  { value: "15000-30000", label: "$15K - $30K", min: "15000", max: "30000" },
  { value: "30000-50000", label: "$30K - $50K", min: "30000", max: "50000" },
  { value: "50000-100000", label: "$50K - $100K", min: "50000", max: "100000" },
  { value: "100000+", label: "$100K+", min: "100000", max: "" },
] as const;

export default function CreatorProfileClient({ data }: { data: CreatorProfileData }) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const savedIds = useSyncExternalStore(subscribeToSaved, readSaved, () => EMPTY_SAVED);
  const isSaved = savedIds.includes(data.creator.id);
  const [showInquiry, setShowInquiry] = useState(false);
  const [selectedPackageTier, setSelectedPackageTier] = useState<string>("");
  const [campaignGoal, setCampaignGoal] = useState("brand_awareness");
  const [budgetRange, setBudgetRange] = useState("30000-50000");
  const [requirements, setRequirements] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [chatStarting, setChatStarting] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);

  const toggleSave = () => {
    const next = isSaved
      ? savedIds.filter((id) => id !== data.creator.id)
      : [...savedIds, data.creator.id];
    writeSaved(next);
  };

  useEffect(() => {
    try {
      const key = "sponsorRecentlyViewed";
      const raw = window.localStorage.getItem(key);
      const viewed: string[] = raw ? JSON.parse(raw) : [];
      const next = [data.creator.id, ...viewed.filter((id) => id !== data.creator.id)].slice(0, 6);
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {}
  }, [data.creator.id]);

  const firstPackage = data.creator.packages[0];
  const selectedPackage = data.creator.packages.find((p) => p.tier === selectedPackageTier);

  const goalForTier = (tier: string) => {
    if (tier === "Bronze") return "sampling";
    if (tier === "Silver") return "lead_generation";
    return "brand_awareness";
  };

  const openInquiry = (tier?: string) => {
    const defaultTier = tier ?? data.creator.packages.at(-1)?.tier ?? "";
    setSelectedPackageTier(defaultTier);
    setCampaignGoal(defaultTier ? goalForTier(defaultTier) : "brand_awareness");
    setBudgetRange("30000-50000");
    setRequirements("");
    setSubmitError(null);
    setSubmitSuccess(false);
    setShowInquiry(true);
  };

  const submitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);

    try {
      const budgetMin = selectedPackage ? selectedPackage.price : (BUDGET_OPTIONS.find((b) => b.value === budgetRange)?.min ?? null);
      const budgetMax = selectedPackage ? selectedPackage.price : (BUDGET_OPTIONS.find((b) => b.value === budgetRange)?.max ?? null);

      const payload: Record<string, unknown> = {
        creatorId: data.creator.id,
        campaignGoal,
        budgetMin: budgetMin ? Number(budgetMin) : null,
        budgetMax: budgetMax ? Number(budgetMax) : null,
        currencyCode: "EUR",
        source: "public_profile",
        requirementsText: requirements || "No specific requirements provided.",
      };

      if (selectedPackage) {
        payload.packageTier = selectedPackage.tier;
        payload.packagePrice = selectedPackage.price;
      }

      const res = await fetch("/api/sponsor/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.error || "Failed to submit inquiry");
      }

      setSubmitSuccess(true);
      setTimeout(() => setShowInquiry(false), 1500);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const startChatConnection = async () => {
    if (status === "unauthenticated") {
      router.push("/sponsor/login");
      return;
    }

    setChatStarting(true);
    setChatError(null);

    try {
      const res = await fetch("/api/chat/threads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creatorId: data.creator.id }),
      });
      const body = await res.json();

      if (!res.ok) {
        throw new Error(body.error || "No se pudo abrir el chat.");
      }

      router.push(`/sponsor/inbox?thread=${body.thread.id}`);
    } catch (err) {
      setChatError(err instanceof Error ? err.message : "No se pudo abrir el chat.");
    } finally {
      setChatStarting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-[#0f172a]">
      <div className="mx-auto w-full max-w-5xl px-4 py-6">
        <Link
          href="/sponsor/discover"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-[#64748b] hover:text-[#0f172a]"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Discover
        </Link>

        <div className="mb-6 overflow-hidden rounded-xl border border-[#d9e2ef] bg-white shadow-[0_2px_10px_rgba(15,23,42,0.06)]">
          <div className="h-32 bg-linear-to-r from-[#13203e] to-[#1e3264]" />
          <div className="p-6 pt-4">
            <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-end">
              <div className="-mt-14 flex h-20 w-20 items-center justify-center rounded-xl border-4 border-white bg-white text-3xl shadow-sm">
                {data.creator.logo}
              </div>
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-[#0f172a]">{data.creator.name}</h1>
                  {data.creator.verified && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-600">
                      <Shield className="h-3 w-3" /> Verified
                    </span>
                  )}

                </div>
                <p className="mt-1 text-sm text-[#64748b]">{data.creator.tagline}</p>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-[#64748b]">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {data.creator.location}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Users className="h-3 w-3" /> {data.creator.audienceSize.toLocaleString()} audience
                  </span>
                  {firstPackage && <span>From ${firstPackage.price.toLocaleString()}</span>}
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={toggleSave}
                    className={`inline-flex items-center gap-1.5 rounded-lg border px-4 py-2 text-sm font-medium transition ${
                      isSaved
                        ? "border-[#f0c27a] bg-[#fff2dd] text-[#f79009]"
                        : "border-[#d9e2ef] bg-white text-[#64748b] hover:border-[#f0c27a]"
                    }`}
                  >
                    <Heart className={`h-4 w-4 ${isSaved ? "fill-[#f79009]" : ""}`} />
                    {isSaved ? "Saved" : "Save"}
                  </button>
                  <Link
                    href={`/api/demo-open-chat?creatorId=${data.creator.id}`}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#d9e2ef] bg-white px-4 py-2 text-sm font-bold text-[#0f172a] shadow-sm transition hover:border-[#f79009]"
                  >
                    <MessageCircle className="h-4 w-4" />
                    Open chat
                  </Link>
                  <button
                    type="button"
                    onClick={() => openInquiry()}
                    className="rounded-lg bg-linear-to-r from-[#f79009] to-[#f97316] px-5 py-2 text-sm font-bold text-white shadow-sm transition hover:opacity-90"
                  >
                    Sponsor this creator
                  </button>
                </div>
                {chatError && <p className="max-w-sm text-right text-xs text-red-600">{chatError}</p>}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <KpiCard label="Total Audience" value={data.creator.audienceSize.toLocaleString()} sub="across all events" />
          <KpiCard label="Returning Rate" value={`${data.creator.returningAttendees}%`} sub="loyal attendees" />
          <KpiCard label="Avg CPM" value={firstPackage ? `$${firstPackage.cpm}` : "—"} sub={firstPackage ? `${firstPackage.tier} package` : "no data"} />
          <KpiCard label="Events" value={data.events.length.toString()} sub="total events" />
        </div>

        {/* Audience insights removed to reduce unverifiable complexity; keep KPIs and packages instead. */}

        <section className="mb-6">
          <h2 className="mb-3 text-base font-bold text-[#0f172a]">Sponsorship Packages</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {data.creator.packages.length > 0 ? (
              data.creator.packages.map((pkg) => (
                <div
                  key={pkg.tier}
                  className={`rounded-xl border p-5 ${
                    pkg.tier === "Gold"
                      ? "border-[#f0c27a] ring-2 ring-[#f79009]/20 bg-white"
                      : "border-[#d9e2ef] bg-white"
                  } shadow-[0_2px_10px_rgba(15,23,42,0.06)]`}
                >
                  {pkg.tier === "Gold" && (
                    <span className="mb-3 inline-flex rounded-full bg-linear-to-r from-[#f79009] to-[#f97316] px-2 py-0.5 text-[10px] font-bold text-white">
                      Most Popular
                    </span>
                  )}
                  <span className="mb-2 inline-flex rounded-full border border-[#d9e2ef] px-2 py-0.5 text-[10px] font-semibold text-[#0f172a]">
                    {pkg.tier}
                  </span>
                  <p className="mb-1 text-2xl font-bold text-[#0f172a]">${pkg.price.toLocaleString()}</p>
                  <p className="mb-3 text-[11px] text-[#64748b]">
                    CPM: ${pkg.cpm} · {pkg.impressions.toLocaleString()} imp.
                  </p>
                  <ul className="mb-5 space-y-1.5">
                    {pkg.items.length > 0
                      ? pkg.items.map((item) => (
                          <li key={item.name} className="flex items-start gap-1.5 text-xs text-[#64748b]">
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                            <span>{item.name}</span>
                          </li>
                        ))
                      : pkg.benefits.map((b) => (
                          <li key={b} className="flex items-start gap-1.5 text-xs text-[#64748b]">
                            <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-500" />
                            {b}
                          </li>
                        ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => openInquiry(pkg.tier)}
                    className="w-full rounded-lg bg-linear-to-r from-[#f79009] to-[#f97316] px-4 py-2 text-xs font-bold text-white shadow-sm transition hover:opacity-90"
                  >
                    Request Sponsorship
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full rounded-xl border border-dashed border-[#d9e2ef] bg-white p-8 text-center text-sm text-[#64748b]">
                No packages available yet.
              </div>
            )}
          </div>
        </section>

        {data.events.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 text-base font-bold text-[#0f172a]">Events</h2>
            <div className="grid gap-4 sm:grid-cols-3">
              {data.events.map((event) => (
                <div key={event.id} className="rounded-xl border border-[#d9e2ef] bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.06)]">
                  <p className="mb-2 text-sm font-bold text-[#0f172a]">{event.title}</p>
                  <div className="space-y-1 text-xs text-[#64748b]">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {event.startsAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {event.city}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {event.ticketsSold.toLocaleString()} ·
                      <CheckCircle2 className="h-3 w-3 text-emerald-500" /> {event.checkinsCount.toLocaleString()} check-ins
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {data.pastSponsors.length > 0 && (
          <section className="mb-6">
            <h2 className="mb-3 text-base font-bold text-[#0f172a]">Previous Sponsors</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {data.pastSponsors.map((s) => (
                <div key={s.sponsorName} className="rounded-xl border border-[#d9e2ef] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.06)]">
                  <div className="mb-3 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#edf2f7] text-sm font-bold text-[#64748b]">
                      {s.sponsorName[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#0f172a]">{s.sponsorName}</p>
                      {s.campaignTitle && (
                        <p className="text-xs text-[#64748b]">{s.campaignTitle}</p>
                      )}
                    </div>
                  </div>
                  <p className="mb-3 text-xs leading-relaxed text-[#64748b]">{s.description}</p>
                  {s.metrics && (
                    <div className="flex gap-4 border-t border-[#edf2f7] pt-3">
                      {s.metrics.impressions != null && (
                        <div className="flex items-center gap-1 text-xs text-[#64748b]">
                          <Eye className="h-3 w-3 text-[#f79009]" />
                          <span>{s.metrics.impressions.toLocaleString()}</span>
                        </div>
                      )}
                      {s.metrics.leads != null && (
                        <div className="flex items-center gap-1 text-xs text-[#64748b]">
                          <MessageCircle className="h-3 w-3 text-[#f79009]" />
                          <span>{s.metrics.leads} leads</span>
                        </div>
                      )}
                      {s.metrics.engagementRatePct != null && (
                        <div className="flex items-center gap-1 text-xs text-[#64748b]">
                          <TrendingUp className="h-3 w-3 text-emerald-500" />
                          <span>{s.metrics.engagementRatePct}% eng.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <p className="mt-8 text-sm text-[#7a879d]">Signed in as {session?.user?.name || "Sponsor"}</p>
      </div>

      {showInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-xl border border-[#d9e2ef] bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-[#edf2f7] px-6 py-4">
              <h2 className="text-base font-bold text-[#0f172a]">
                {submitSuccess ? "Inquiry Sent!" : `Sponsor ${data.creator.name}`}
              </h2>
              {!submitSuccess && (
                <button type="button" onClick={() => setShowInquiry(false)} className="rounded-md p-1 text-[#64748b] hover:bg-[#f1f5f9]">
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {submitSuccess ? (
              <div className="p-6 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-500" />
                <p className="mt-3 text-sm font-bold text-[#0f172a]">Inquiry submitted successfully</p>
                <p className="mt-1 text-xs text-[#64748b]">The creator will review your request and respond shortly.</p>
              </div>
            ) : (
              <form onSubmit={submitInquiry} className="space-y-4 p-6">
                {submitError && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
                    {submitError}
                  </div>
                )}

                <div className="flex gap-3">
                  <div className="flex-1">
                    <p className="mb-1 text-xs font-semibold text-[#0f172a]">Your Name</p>
                    <input
                      value={session?.user?.name ?? ""}
                      disabled
                      className="h-10 w-full rounded-lg border border-[#d9e2ef] bg-[#f8fafc] px-3 text-sm text-[#64748b] outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="mb-1 text-xs font-semibold text-[#0f172a]">Contact Email</p>
                    <input
                      value={session?.user?.email ?? ""}
                      disabled
                      className="h-10 w-full rounded-lg border border-[#d9e2ef] bg-[#f8fafc] px-3 text-sm text-[#64748b] outline-none"
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-xs font-semibold text-[#0f172a]">Package of Interest</p>
                  <div className="mb-3 flex gap-2">
                    {data.creator.packages.map((pkg) => {
                      const isSelected = selectedPackageTier === pkg.tier;
                      return (
                        <button
                          key={pkg.tier}
                          type="button"
                          onClick={() => {
                            setSelectedPackageTier(pkg.tier);
                            setCampaignGoal(goalForTier(pkg.tier));
                          }}
                          className={`flex-1 rounded-lg border px-3 py-2 text-center text-sm transition ${
                            isSelected
                              ? "border-[#f79009] bg-[#fff2dd] font-bold text-[#f79009]"
                              : "border-[#d9e2ef] bg-white text-[#64748b] hover:border-[#d9e2ef]"
                          }`}
                        >
                          <span className="block text-xs font-semibold">{pkg.tier}</span>
                          <span className="block text-[11px]">${pkg.price.toLocaleString()}</span>
                        </button>
                      );
                    })}

                  </div>

                  {selectedPackageTier && (() => {
                    const tierIndex = ["Bronze", "Silver", "Gold"].indexOf(selectedPackageTier);
                    const allItems = data.creator.packages.flatMap((p) =>
                      p.items.map((item) => ({ item, tier: p.tier }))
                    );
                    const uniqueItems = allItems.filter(
                      (entry, i, arr) => arr.findIndex((e) => e.item.name === entry.item.name) === i
                    );

                    return (
                      <div className="mb-3 rounded-lg border border-[#d9e2ef] bg-[#f8f9fb] p-3">
                        <p className="mb-2 text-[11px] font-semibold text-[#0f172a]">What&apos;s included</p>
                        <div className="space-y-1.5">
                          {uniqueItems.map(({ item, tier }) => {
                            const itemTierIndex = ["Bronze", "Silver", "Gold"].indexOf(tier);
                            const isIncluded = itemTierIndex <= tierIndex;
                            return (
                              <div
                                key={item.name}
                                className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs ${
                                  isIncluded
                                    ? "text-[#0f172a]"
                                    : "text-[#94a3b8]"
                                }`}
                              >
                                {isIncluded ? (
                                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
                                ) : (
                                  <Lock className="h-3.5 w-3.5 shrink-0 text-[#94a3b8]" />
                                )}
                                <span className={!isIncluded ? "line-through" : ""}>{item.name}</span>
                                {!isIncluded && (
                                  <span className="ml-auto text-[10px] text-[#94a3b8]">
                                    {tier}
                                  </span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })()}


                </div>

                <div>
                  <p className="mb-1 text-xs font-semibold text-[#0f172a]">Budget</p>
                  {selectedPackage ? (
                    <div className="flex h-10 items-center gap-2 rounded-lg border border-[#d9e2ef] bg-[#f8fafc] px-3 text-sm">
                      <DollarSign className="h-4 w-4 text-[#f79009]" />
                      <span className="font-semibold text-[#0f172a]">${selectedPackage.price.toLocaleString()}</span>
                      <span className="text-[#64748b]">(fixed - {selectedPackage.tier} package)</span>
                    </div>
                  ) : (
                    <select
                      value={budgetRange}
                      onChange={(e) => setBudgetRange(e.target.value)}
                      className="h-10 w-full rounded-lg border border-[#d9e2ef] px-3 text-sm text-[#0f172a] outline-none"
                    >
                      {BUDGET_OPTIONS.map((b) => (
                        <option key={b.value} value={b.value}>{b.label}</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <p className="mb-1 text-xs font-semibold text-[#0f172a]">Campaign Objective</p>
                  <select
                    value={campaignGoal}
                    onChange={(e) => setCampaignGoal(e.target.value)}
                    className="h-10 w-full rounded-lg border border-[#d9e2ef] px-3 text-sm text-[#0f172a] outline-none"
                  >
                    {Object.entries(GOALS).map(([value, g]) => (
                      <option key={value} value={value}>{g.label}</option>
                    ))}
                  </select>
                  <p className="mt-1 text-[10px] text-[#64748b]">{GOALS[campaignGoal as keyof typeof GOALS]?.desc}</p>
                </div>

                <div>
                  <p className="mb-1 text-xs font-semibold text-[#0f172a]">Requirements <span className="font-normal text-[#94a3b8]">(optional)</span></p>
                  <textarea
                    value={requirements}
                    onChange={(e) => setRequirements(e.target.value)}
                    placeholder="Any specific details about your campaign, target audience, or expectations..."
                    rows={3}
                    className="w-full resize-none rounded-lg border border-[#d9e2ef] px-3 py-2 text-sm text-[#0f172a] outline-none placeholder:text-[#94a3b8]"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInquiry(false)}
                    className="flex-1 rounded-lg border border-[#d9e2ef] px-4 py-2 text-sm font-medium text-[#64748b] transition hover:bg-[#f1f5f9]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 rounded-lg bg-linear-to-r from-[#f79009] to-[#f97316] px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:opacity-90 disabled:opacity-50"
                  >
                    {submitting ? "Sending..." : "Send Inquiry"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

function KpiCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl border border-[#d9e2ef] bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.06)]">
      <p className="text-2xl font-bold text-[#0f172a]">{value}</p>
      <p className="text-xs text-[#64748b]">{label}</p>
      <p className="mt-0.5 text-[10px] text-emerald-600">{sub}</p>
    </div>
  );
}
