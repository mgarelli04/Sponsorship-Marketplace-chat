"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CreatorDashboard() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f5f6f8]">
        <p className="text-[#6b7e9e]">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Section */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#0f1c3f] mb-2">
            Welcome back, {session?.user?.name || "Creator"}
          </h1>
          <p className="text-base text-[#6b7e9e]">
            Here&apos;s how your sponsorship pipeline looks today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Profile Views */}
          <div className="bg-white rounded-lg p-6 border border-[#d9e0eb]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">👁️</span>
              <span className="text-sm font-semibold text-[#00b366]">+18%</span>
            </div>
            <p className="text-4xl font-bold text-[#0f1c3f] mb-1">2,340</p>
            <p className="text-sm text-[#6b7e9e]">Profile Views</p>
          </div>

          {/* Active Leads */}
          <div className="bg-white rounded-lg p-6 border border-[#d9e0eb]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">👥</span>
              <span className="text-sm font-semibold text-[#00b366]">+2</span>
            </div>
            <p className="text-4xl font-bold text-[#0f1c3f] mb-1">5</p>
            <p className="text-sm text-[#6b7e9e]">Active Leads</p>
          </div>

          {/* Deals Closed */}
          <div className="bg-white rounded-lg p-6 border border-[#d9e0eb]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">📈</span>
              <span className="text-sm font-semibold text-[#00b366]">$95K</span>
            </div>
            <p className="text-4xl font-bold text-[#0f1c3f] mb-1">3</p>
            <p className="text-sm text-[#6b7e9e]">Deals Closed</p>
          </div>

          {/* Media Kit Score */}
          <div className="bg-white rounded-lg p-6 border border-[#d9e0eb]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">📊</span>
              <span className="text-sm font-semibold text-[#00b366]">
                Excellent
              </span>
            </div>
            <p className="text-4xl font-bold text-[#0f1c3f] mb-1">92%</p>
            <p className="text-sm text-[#6b7e9e]">Media Kit Score</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Inquiries */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-[#0f1c3f]">
                Recent Inquiries
              </h2>
              <a
                href="/creator/leads"
                className="text-sm font-medium text-[#0a66c2] hover:underline"
              >
                View all →
              </a>
            </div>

            <div className="space-y-4">
              {/* Nike */}
              <div className="bg-white rounded-lg p-5 border border-[#d9e0eb] flex items-center gap-4 hover:shadow-[0_4px_12px_rgba(18,34,72,0.06)] transition">
                <div className="w-12 h-12 rounded-lg bg-[#fef3e2] flex items-center justify-center text-xl shrink-0">
                  👟
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#0f1c3f] mb-1">Nike</h3>
                  <p className="text-sm text-[#6b7e9e]">
                    Gold Package · Brand Awareness
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="px-3 py-1 rounded-full bg-[#fff3e2] text-[#f79009] text-xs font-medium whitespace-nowrap">
                    Pending
                  </span>
                  <span className="text-sm text-[#6b7e9e] whitespace-nowrap">
                    2025-03-07
                  </span>
                </div>
              </div>

              {/* Spotify */}
              <div className="bg-white rounded-lg p-5 border border-[#d9e0eb] flex items-center gap-4 hover:shadow-[0_4px_12px_rgba(18,34,72,0.06)] transition">
                <div className="w-12 h-12 rounded-lg bg-[#e2f0ff] flex items-center justify-center text-xl shrink-0">
                  🎵
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#0f1c3f] mb-1">Spotify</h3>
                  <p className="text-sm text-[#6b7e9e]">
                    Silver Package · Lead Generation
                  </p>
                </div>
                <span className="text-sm text-[#6b7e9e] whitespace-nowrap">
                  2025-03-05
                </span>
              </div>

              {/* Red Bull */}
              <div className="bg-white rounded-lg p-5 border border-[#d9e0eb] flex items-center gap-4 hover:shadow-[0_4px_12px_rgba(18,34,72,0.06)] transition">
                <div className="w-12 h-12 rounded-lg bg-[#fff0f0] flex items-center justify-center text-xl shrink-0">
                  🐂
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[#0f1c3f] mb-1">
                    Red Bull
                  </h3>
                  <p className="text-sm text-[#6b7e9e]">
                    Gold Package · Community Building
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="px-3 py-1 rounded-full bg-[#e2f5f0] text-[#00b366] text-xs font-medium whitespace-nowrap">
                    Won
                  </span>
                  <span className="text-sm text-[#6b7e9e] whitespace-nowrap">
                    2025-02-28
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <aside className="space-y-4">
            <div>
              <h2 className="text-2xl font-bold text-[#0f1c3f] mb-2">
                Quick Actions
              </h2>
              <p className="text-sm text-[#6b7e9e]">
                Jump to the pages you use most.
              </p>
            </div>

            <Link
              href="/creator/media-kit"
              className="group block rounded-2xl border border-[#d9e0eb] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#cfd8e6] hover:bg-[#fbfcfe] hover:shadow-[0_10px_24px_rgba(18,34,72,0.08)]"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#fef7ef] text-2xl text-[#f79009]">
                  📝
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-[#0f1c3f]">Edit Media Kit</h3>
                    <span className="text-sm font-semibold text-[#0a66c2] group-hover:underline">
                      Open →
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#6b7e9e]">
                    Update packages, add events, and refresh your offer sheet.
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/creator/leads"
              className="group block rounded-2xl border border-[#d9e0eb] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#cfd8e6] hover:bg-[#fbfcfe] hover:shadow-[0_10px_24px_rgba(18,34,72,0.08)]"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#eef5ff] text-2xl text-[#0a66c2]">
                  📧
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-[#0f1c3f]">Manage Leads</h3>
                    <span className="text-sm font-semibold text-[#0a66c2] group-hover:underline">
                      Open →
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#6b7e9e]">
                    Review pending inquiries and move deals forward.
                  </p>
                </div>
              </div>
            </Link>

            <div className="rounded-2xl border border-[#d9e0eb] bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-[#0f1c3f]">Profile Completeness</h3>
                <span className="text-sm font-semibold text-[#f79009]">92%</span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e2e7ef]">
                <div
                  className="h-full w-[92%] rounded-full bg-[#f79009]"
                />
              </div>
              <p className="mt-2 text-xs text-[#6b7e9e]">
                Add a promo video to reach 100%
              </p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
