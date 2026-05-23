import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/auth/options";
import { getCreatorDashboardData } from "@/src/creator/data";

const numberFormatter = new Intl.NumberFormat("en-US");
const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "2-digit",
  year: "numeric",
});

function formatDate(value: Date | string | null) {
  if (!value) {
    return "No date";
  }

  return dateFormatter.format(new Date(value));
}

function statusLabel(status: string) {
  return status
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

export default async function CreatorDashboard() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "creator" || !session.user.email) {
    redirect("/creator/login");
  }

  const data = await getCreatorDashboardData({
    userId: session.user.id,
    email: session.user.email,
    fullName: session.user.name,
  });

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#f79009]">
            {data.creator.profileStatus}
          </p>
          <h1 className="mb-2 text-4xl font-bold text-[#0f1c3f]">
            Welcome back, {data.profile?.fullName || data.creator.displayName}
          </h1>
          <p className="text-base text-[#6b7e9e]">
            Dashboard for {data.creator.displayName}. Your media kit and pipeline are loaded from your account data.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-8 lg:grid-cols-3 items-start">
          <div className="lg:col-span-2">
            <div className="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg border border-[#d9e0eb] bg-white p-6">
                <p className="mb-1 text-4xl font-bold text-[#0f1c3f]">
                  {numberFormatter.format(data.stats.totalAudience)}
                </p>
                <p className="text-sm text-[#6b7e9e]">Verified Audience</p>
              </div>

              <div className="rounded-lg border border-[#d9e0eb] bg-white p-6">
                <p className="mb-1 text-4xl font-bold text-[#0f1c3f]">
                  {data.stats.activeLeads}
                </p>
                <p className="text-sm text-[#6b7e9e]">Active Leads</p>
              </div>

              <div className="rounded-lg border border-[#d9e0eb] bg-white p-6">
                <p className="mb-1 text-4xl font-bold text-[#0f1c3f]">
                  {data.stats.closedDeals}
                </p>
                <p className="text-sm text-[#6b7e9e]">
                  Deals Closed
                  {data.stats.revenueWon > 0 ? ` - ${currencyFormatter.format(data.stats.revenueWon)}` : ""}
                </p>
              </div>
            </div>

            <div>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-[#0f1c3f]">Recent Inquiries</h2>
                <Link
                  href="/creator/leads"
                  className="text-sm font-medium text-[#0a66c2] hover:underline"
                >
                  View all
                </Link>
              </div>

              <div className="space-y-4">
                {data.recentInquiries.length > 0 ? (
                  data.recentInquiries.map(({ inquiry, sponsor, package: selectedPackage }) => (
                    <article
                      key={inquiry.id}
                      className="flex items-center gap-4 rounded-lg border border-[#d9e0eb] bg-white p-5 transition hover:shadow-[0_4px_12px_rgba(18,34,72,0.06)]"
                    >
                      <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-[#eef5ff] text-lg font-bold text-[#0a66c2]">
                        {(sponsor?.name || "S").slice(0, 1)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="mb-1 font-semibold text-[#0f1c3f]">
                          {sponsor?.name || "Sponsor"}
                        </h3>
                        <p className="truncate text-sm text-[#6b7e9e]">
                          {selectedPackage?.name || "Custom inquiry"} - {statusLabel(inquiry.campaignGoal)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-3">
                        <span className="rounded-full bg-[#fff3e2] px-3 py-1 text-xs font-medium text-[#f79009]">
                          {statusLabel(inquiry.status)}
                        </span>
                        <span className="hidden whitespace-nowrap text-sm text-[#6b7e9e] sm:inline">
                          {formatDate(inquiry.createdAt)}
                        </span>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="rounded-lg border border-dashed border-[#cfd8e6] bg-white p-8">
                    <h3 className="font-semibold text-[#0f1c3f]">No inquiries yet</h3>
                    <p className="mt-2 text-sm text-[#6b7e9e]">
                      Publish your media kit and add sponsorship packages to make this pipeline useful.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="space-y-4">
            <div>
              <h2 className="mb-2 text-2xl font-bold text-[#0f1c3f]">Quick Actions</h2>
              <p className="text-sm text-[#6b7e9e]">Jump to the pages you use most.</p>
            </div>

            <Link
              href="/creator/media-kit"
              className="group block rounded-2xl border border-[#d9e0eb] bg-white p-5 transition hover:-translate-y-0.5 hover:border-[#cfd8e6] hover:bg-[#fbfcfe] hover:shadow-[0_10px_24px_rgba(18,34,72,0.08)]"
            >
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-[#fef7ef] text-lg font-bold text-[#f79009]">
                  MK
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="font-semibold text-[#0f1c3f]">Open Media Kit</h3>
                    <span className="text-sm font-semibold text-[#0a66c2] group-hover:underline">
                      Open
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-[#6b7e9e]">
                    Review your profile, audience data, packages, and sponsor inventory.
                  </p>
                </div>
              </div>
            </Link>

            <div className="rounded-2xl border border-[#d9e0eb] bg-white p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-semibold text-[#0f1c3f]">Profile Completeness</h3>
                <span className="text-sm font-semibold text-[#f79009]">
                  {data.stats.mediaKitScore}%
                </span>
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#e2e7ef]">
                <div
                  className="h-full rounded-full bg-[#f79009]"
                  style={{ width: `${data.stats.mediaKitScore}%` }}
                />
              </div>
              <p className="mt-2 text-xs text-[#6b7e9e]">
                Complete your media kit sections to improve this score.
              </p>
            </div>

            <div className="rounded-2xl border border-[#d9e0eb] bg-white p-5">
              <h3 className="font-semibold text-[#0f1c3f]">Recent Events</h3>
              <div className="mt-4 space-y-3">
                {data.recentEvents.length > 0 ? (
                  data.recentEvents.slice(0, 3).map((event) => (
                    <div key={event.id} className="border-b border-[#eef2f7] pb-3 last:border-0 last:pb-0">
                      <p className="text-sm font-medium text-[#0f1c3f]">{event.title}</p>
                      <p className="mt-1 text-xs text-[#6b7e9e]">
                        {formatDate(event.startsAt)} - {numberFormatter.format(event.ticketsSold)} tickets
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#6b7e9e]">No events connected yet.</p>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
