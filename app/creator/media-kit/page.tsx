import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/auth/options";
import { getCreatorMediaKitData } from "@/src/creator/data";

type Segment = {
  label: string;
  value: number;
};

type Location = {
  city: string;
  pct: number;
};

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

const ageColors = ["#f59e0b", "#3b82f6", "#8b5cf6", "#94a3b8"];

function formatDate(value: Date | string | null) {
  if (!value) {
    return "No date";
  }

  return dateFormatter.format(new Date(value));
}

function readSegments(value: unknown, key: "ageGroups" | "gender") {
  if (!value || typeof value !== "object" || !(key in value)) {
    return [] as Segment[];
  }

  const rows = (value as Record<string, unknown>)[key];

  if (!Array.isArray(rows)) {
    return [] as Segment[];
  }

  return rows
    .map((row) => {
      if (!row || typeof row !== "object") {
        return null;
      }

      const record = row as Record<string, unknown>;
      const label = String(record.label ?? "");
      const value = Number(record.value ?? 0);

      return label && Number.isFinite(value) ? { label, value } : null;
    })
    .filter((row): row is Segment => Boolean(row));
}

function readLocations(value: unknown) {
  if (!value || typeof value !== "object" || !("locations" in value)) {
    return [] as Location[];
  }

  const rows = (value as Record<string, unknown>).locations;

  if (!Array.isArray(rows)) {
    return [] as Location[];
  }

  return rows
    .map((row) => {
      if (!row || typeof row !== "object") {
        return null;
      }

      const record = row as Record<string, unknown>;
      const city = String(record.city ?? "");
      const pct = Number(record.pct ?? 0);

      return city && Number.isFinite(pct) ? { city, pct } : null;
    })
    .filter((row): row is Location => Boolean(row));
}

function readInterests(value: unknown) {
  if (!value || typeof value !== "object" || !("interests" in value)) {
    return [] as string[];
  }

  const rows = (value as Record<string, unknown>).interests;

  if (!Array.isArray(rows)) {
    return [] as string[];
  }

  return rows.filter((row): row is string => typeof row === "string" && row.length > 0);
}

function buildConicGradient(segments: Segment[]) {
  if (segments.length === 0) {
    return "conic-gradient(#e5eaf2 0 100%)";
  }

  let cursor = 0;
  const stops = segments.map((segment, index) => {
    const start = cursor;
    cursor += segment.value;
    return `${ageColors[index % ageColors.length]} ${start}% ${cursor}%`;
  });

  return `conic-gradient(${stops.join(", ")})`;
}

export default async function CreatorMediaKitPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "creator" || !session.user.email) {
    redirect("/creator/login");
  }

  const data = await getCreatorMediaKitData({
    userId: session.user.id,
    email: session.user.email,
    fullName: session.user.name,
  });

  const logo = data.assets.find((asset) => asset.assetRole === "logo");
  const cover = data.assets.find((asset) => asset.assetRole === "cover");
  const primaryCategory =
    data.categories.find((row) => row.relation.isPrimary)?.category.name ||
    data.categories[0]?.category.name ||
    "Creator";
  const ageSegments = readSegments(data.audienceSnapshot?.demographicsJsonb, "ageGroups");
  const genderSegments = readSegments(data.audienceSnapshot?.demographicsJsonb, "gender");
  const topLocations = readLocations(data.audienceSnapshot?.topLocationsJsonb);
  const interests = readInterests(data.audienceSnapshot?.interestsJsonb);

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <section className="overflow-hidden rounded-3xl border border-[#d9e0eb] bg-white shadow-[0_8px_30px_rgba(18,34,72,0.08)]">
          {cover ? (
            <div
              className="h-40 bg-cover bg-center md:h-48"
              style={{ backgroundImage: `url(${cover.publicUrl})` }}
            />
          ) : (
            <div className="h-40 bg-linear-to-r from-[#0b173b] to-[#1a2b5a] md:h-48" />
          )}
          <div className="px-6 pb-8 pt-6 md:px-10 md:pb-10 md:pt-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-5">
                <div className="-mt-22 grid h-24 w-24 place-items-center overflow-hidden rounded-3xl border border-white bg-white text-4xl font-bold text-[#f79009] shadow-[0_10px_30px_rgba(18,34,72,0.12)] md:-mt-26">
                  {logo ? (
                    <span
                      aria-label={`${data.creator.displayName} logo`}
                      className="h-full w-full bg-cover bg-center"
                      role="img"
                      style={{ backgroundImage: `url(${logo.publicUrl})` }}
                    />
                  ) : (
                    data.creator.displayName.slice(0, 1)
                  )}
                </div>
                <div className="max-w-3xl pt-2 md:pt-0">
                  <div className="mb-2 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                    {data.creator.verificationStatus}
                  </div>
                  <h1 className="text-3xl font-bold leading-none tracking-tight text-[#0f1c3f] md:text-4xl">
                    {data.creator.displayName}
                  </h1>
                  <p className="mt-2 text-base text-[#6b7e9e]">
                    {data.mediaKit?.headline || data.creator.tagline}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[#66758f]">
                    <span>
                      {data.creator.city || data.creator.region || data.creator.countryCode}
                    </span>
                    <span className="rounded-full border border-[#d9e0eb] px-3 py-1 font-semibold text-[#0f1c3f]">
                      {primaryCategory}
                    </span>
                    <span>
                      {numberFormatter.format(data.audienceSnapshot?.totalAttendees ?? 0)} audience
                    </span>
                    <span>
                      Updated {formatDate(data.mediaKit?.lastContentUpdateAt ?? data.creator.updatedAt)}
                    </span>
                  </div>
                </div>
              </div>
              <a
                href="/creator/dashboard"
                className="inline-flex items-center justify-center self-start rounded-xl bg-[#f79009] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#e88507]"
              >
                Back to dashboard
              </a>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#d9e0eb] bg-white p-8 shadow-[0_8px_30px_rgba(18,34,72,0.06)]">
          <h2 className="text-2xl font-bold text-[#0f1c3f]">About</h2>
          <p className="mt-4 leading-relaxed text-[#5f7190] md:text-lg">
            {data.mediaKit?.aboutText || data.creator.tagline}
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-[#e5eaf2] bg-[#fbfcfe] p-5">
              <h3 className="font-semibold text-[#0f1c3f]">Mission</h3>
              <p className="mt-2 text-sm leading-6 text-[#5f7190]">
                {data.mediaKit?.missionText || "No mission text has been added yet."}
              </p>
            </div>
            <div className="rounded-2xl border border-[#e5eaf2] bg-[#fbfcfe] p-5">
              <h3 className="font-semibold text-[#0f1c3f]">Why Partner</h3>
              <p className="mt-2 text-sm leading-6 text-[#5f7190]">
                {data.mediaKit?.whyPartnerText || "No partner pitch has been added yet."}
              </p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#d9e0eb] bg-white p-8 shadow-[0_8px_30px_rgba(18,34,72,0.06)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-[#0f1c3f]">Events</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {data.events.length > 0 ? (
              data.events.map((event) => (
                <article
                  key={event.id}
                  className="rounded-2xl border border-[#d9e0eb] bg-[#fbfcfe] p-5 shadow-[0_1px_2px_rgba(18,34,72,0.04)]"
                >
                  <h3 className="text-base font-semibold text-[#0f1c3f]">{event.title}</h3>
                  <div className="mt-3 space-y-1 text-sm text-[#66758f]">
                    <p>{formatDate(event.startsAt)}</p>
                    <p>{event.city}</p>
                    <p>{numberFormatter.format(event.ticketsSold)} tickets sold</p>
                    <p>{numberFormatter.format(event.checkinsCount)} check-ins</p>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#d9e0eb] bg-[#fbfcfe] p-6 text-sm text-[#66758f] md:col-span-3">
                No events have been connected yet.
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#d9e0eb] bg-white p-8 shadow-[0_8px_30px_rgba(18,34,72,0.06)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-[#0f1c3f]">Audience Insights</h2>
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-sm font-medium text-emerald-600">
              {data.audienceSnapshot?.verificationStatus || "No data"}
            </span>
          </div>

          <p className="mt-4 leading-relaxed text-[#5f7190]">
            {data.mediaKit?.audienceSummaryText ||
              "Audience data will appear after snapshots or integrations are added."}
          </p>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr_1fr_1.1fr]">
            <article>
              <h3 className="text-base font-medium text-[#0f1c3f]">Age Distribution</h3>
              <div className="mt-6 flex items-center justify-center">
                <div
                  className="h-48 w-48 rounded-full"
                  style={{ background: buildConicGradient(ageSegments) }}
                >
                  <div className="m-auto mt-10 h-28 w-28 rounded-full bg-white" />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#0f1c3f]">
                {ageSegments.length > 0 ? (
                  ageSegments.map((segment, index) => (
                    <span key={segment.label} className="inline-flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 rounded-full"
                        style={{ backgroundColor: ageColors[index % ageColors.length] }}
                      />
                      {segment.label}: {segment.value}%
                    </span>
                  ))
                ) : (
                  <span className="text-[#66758f]">No age data yet.</span>
                )}
              </div>
            </article>

            <article>
              <h3 className="text-base font-medium text-[#0f1c3f]">Gender Split</h3>
              <div className="mt-6 h-48 rounded-2xl border border-dashed border-[#d9e0eb] bg-[#fbfcfe] p-4">
                {genderSegments.length > 0 ? (
                  <div className="flex h-full items-end gap-6">
                    {genderSegments.map((segment) => (
                      <div key={segment.label} className="flex flex-1 flex-col items-center gap-2">
                        <div
                          className="w-full rounded-t-xl bg-[#f59e0b]"
                          style={{ height: `${Math.min(segment.value, 100)}%` }}
                        />
                        <span className="text-sm text-[#66758f]">{segment.label}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="grid h-full place-items-center text-sm text-[#66758f]">
                    No gender data yet.
                  </div>
                )}
              </div>
            </article>

            <article>
              <h3 className="text-base font-medium text-[#0f1c3f]">Top Locations</h3>
              <div className="mt-6 space-y-4">
                {topLocations.length > 0 ? (
                  topLocations.map((location) => (
                    <div key={location.city}>
                      <div className="mb-2 flex items-center justify-between text-sm text-[#0f1c3f]">
                        <span>{location.city}</span>
                        <span>{location.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#eef2f7]">
                        <div
                          className="h-2 rounded-full bg-[#f79009]"
                          style={{ width: `${Math.min(location.pct, 100)}%` }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-[#66758f]">No location data yet.</p>
                )}
              </div>
            </article>

            <article>
              <h3 className="text-base font-medium text-[#0f1c3f]">Interests</h3>
              <div className="mt-6 flex flex-wrap gap-2">
                {interests.length > 0 ? (
                  interests.map((interest) => (
                    <span
                      key={interest}
                      className="rounded-full border border-[#d9e0eb] bg-white px-3 py-1 text-sm font-medium text-[#0f1c3f]"
                    >
                      {interest}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-[#66758f]">No interest data yet.</p>
                )}
              </div>
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-3xl font-bold text-emerald-500">
                  {data.audienceSnapshot?.repeatAttendancePct ?? "0"}%
                </p>
                <p className="mt-1 text-sm text-[#5f7190]">Returning Attendees</p>
              </div>
            </article>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#d9e0eb] bg-white p-8 shadow-[0_8px_30px_rgba(18,34,72,0.06)]">
          <h2 className="text-2xl font-bold text-[#0f1c3f]">Previous Sponsors</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {data.pastSponsors.length > 0 ? (
              data.pastSponsors.map((sponsor) => (
                <article
                  key={sponsor.id}
                  className="rounded-2xl border border-[#d9e0eb] bg-[#fbfcfe] p-6 text-center"
                >
                  <div className="mx-auto grid h-12 w-12 place-items-center overflow-hidden rounded-xl bg-white font-bold text-[#f79009]">
                    {sponsor.logoUrl ? (
                      <span
                        aria-label={`${sponsor.sponsorName} logo`}
                        className="h-full w-full bg-cover bg-center"
                        role="img"
                        style={{ backgroundImage: `url(${sponsor.logoUrl})` }}
                      />
                    ) : (
                      sponsor.sponsorName.slice(0, 1)
                    )}
                  </div>
                  <h3 className="mt-3 text-lg font-semibold text-[#0f1c3f]">
                    {sponsor.sponsorName}
                  </h3>
                  <p className="mt-1 text-sm text-emerald-600">
                    {sponsor.campaignTitle || sponsor.description}
                  </p>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#d9e0eb] bg-[#fbfcfe] p-6 text-sm text-[#66758f] md:col-span-3">
                No previous sponsors have been added yet.
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#d9e0eb] bg-white p-8 shadow-[0_8px_30px_rgba(18,34,72,0.06)]">
          <h2 className="text-2xl font-bold text-[#0f1c3f]">Sponsorship Inventory</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {data.inventoryItems.length > 0 ? (
              data.inventoryItems.map((item) => (
                <span
                  key={item.id}
                  className="rounded-full border border-[#d9e0eb] bg-white px-4 py-2 text-sm font-medium text-[#0f1c3f]"
                >
                  {item.name}
                </span>
              ))
            ) : (
              <p className="text-sm text-[#66758f]">No inventory items have been added yet.</p>
            )}
          </div>
        </section>

        <section className="mt-8 pb-4">
          <h2 className="text-2xl font-bold text-[#0f1c3f]">Sponsorship Packages</h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {data.packages.length > 0 ? (
              data.packages.map(({ package: pkg, items }) => (
                <article
                  key={pkg.id}
                  className="relative rounded-3xl border border-[#d9e0eb] bg-white p-6 shadow-[0_8px_30px_rgba(18,34,72,0.06)]"
                >
                  <div className="inline-flex rounded-full border border-[#d9e0eb] px-3 py-1 text-xs font-semibold text-[#0f1c3f]">
                    {pkg.packageType}
                  </div>
                  <p className="mt-4 text-4xl font-bold tracking-tight text-[#0f1c3f]">
                    {currencyFormatter.format(Number(pkg.priceAmount))}
                  </p>
                  <p className="mt-2 text-sm text-[#66758f]">
                    {pkg.estimatedImpressions
                      ? `${numberFormatter.format(pkg.estimatedImpressions)} estimated impressions`
                      : pkg.description}
                  </p>
                  <ul className="mt-6 space-y-3 text-sm text-[#5f7190]">
                    {(items.length > 0 ? items : []).map((item) => (
                      <li key={item.id} className="flex items-start gap-2">
                        <span className="mt-0.5 text-emerald-500">-</span>
                        <span>{item.name}</span>
                      </li>
                    ))}
                    {items.length === 0 ? <li>{pkg.description}</li> : null}
                  </ul>
                  <button className="mt-8 w-full rounded-xl border border-[#f79009] bg-[#f79009] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#e88507]">
                    Sponsor this creator
                  </button>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-[#d9e0eb] bg-white p-6 text-sm text-[#66758f] lg:col-span-3">
                No sponsorship packages have been added yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
