"use client";

export default function CreatorMediaKitPage() {
  const audienceSegments = [
    { label: "18-24", value: 35, color: "bg-[#f59e0b]" },
    { label: "25-34", value: 40, color: "bg-[#3b82f6]" },
    { label: "35-44", value: 18, color: "bg-[#8b5cf6]" },
    { label: "45+", value: 7, color: "bg-[#94a3b8]" },
  ];

  const topLocations = [
    { city: "Los Angeles", value: 35 },
    { city: "San Francisco", value: 20 },
    { city: "San Diego", value: 15 },
    { city: "Las Vegas", value: 10 },
  ];

  const events = [
    {
      name: "Neon Nights Summer 2024",
      date: "2024-07-15",
      city: "Los Angeles",
      attendees: "15.200 attendees",
      checkIns: "14.800 check-ins",
    },
    {
      name: "Neon Nights NYE 2024",
      date: "2023-12-31",
      city: "Los Angeles",
      attendees: "8500 attendees",
      checkIns: "8200 check-ins",
    },
    {
      name: "Neon Nights Spring 2024",
      date: "2024-03-20",
      city: "San Diego",
      attendees: "6000 attendees",
      checkIns: "5700 check-ins",
    },
  ];

  const sponsors = [
    { name: "Red Bull", detail: "2.3M social impressions", icon: "🐂" },
    { name: "Samsung", detail: "45K booth interactions", icon: "📱" },
    { name: "Spotify", detail: "12K app downloads", icon: "🎧" },
  ];

  const packages = [
    {
      name: "Bronze",
      price: "$5000",
      cpm: "CPM: $100 - 50.000 impressions",
      accent: "border-[#d9e0eb]",
      button: "bg-white text-[#0f1c3f] border-[#d9e0eb]",
      features: ["Logo on event website", "Social media mention", "Banner placement"],
    },
    {
      name: "Silver",
      price: "$15.000",
      cpm: "CPM: $75 - 200.000 impressions",
      accent: "border-[#d9e0eb]",
      button: "bg-white text-[#0f1c3f] border-[#d9e0eb]",
      features: ["Stage mentions", "Branded lounge area", "Email blast inclusion", "VIP passes (10)", "Social content package"],
    },
    {
      name: "Gold",
      price: "$35.000",
      cpm: "CPM: $70 - 500.000 impressions",
      accent: "border-[#f59e0b]",
      button: "bg-[#f79009] text-white border-[#f79009]",
      popular: true,
      features: ["Title sponsorship opportunity", "Main stage branding", "Exclusive activation zone", "Full media package", "VIP passes (25)", "Post-event report"],
    },
  ];

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <section className="overflow-hidden rounded-4xl border border-[#d9e0eb] bg-white shadow-[0_8px_30px_rgba(18,34,72,0.08)]">
          <div className="h-40 bg-linear-to-r from-[#0b173b] to-[#1a2b5a] md:h-48" />
          <div className="px-6 pb-8 pt-6 md:px-10 md:pb-10 md:pt-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:gap-5">
                <div className="-mt-22 grid h-24 w-24 place-items-center rounded-3xl border border-white bg-white text-4xl shadow-[0_10px_30px_rgba(18,34,72,0.12)] md:-mt-26">
                  🎵
                </div>
                <div className="max-w-3xl pt-2 md:pt-0">
                  <div className="mb-2 inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                    Verified
                  </div>
                  <h1 className="text-3xl font-bold leading-none tracking-tight text-[#0f1c3f] md:text-4xl">
                    Neon Nights Festival
                  </h1>
                  <p className="mt-2 text-base text-[#6b7e9e]">
                    California&apos;s premier electronic music experience
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-[#66758f]">
                    <span>📍 Los Angeles, CA</span>
                    <span className="rounded-full border border-[#d9e0eb] px-3 py-1 font-semibold text-[#0f1c3f]">
                      Music Festival
                    </span>
                    <span>👥 15,000 audience</span>
                    <span>Updated 2025-03-05</span>
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
            Neon Nights brings together 15,000+ electronic music fans for a 3-day immersive experience featuring world-class DJs, interactive art installations, and brand activation zones. Our audience is highly engaged, affluent, and digitally connected.
          </p>
        </section>

        <section className="mt-8 rounded-3xl border border-[#d9e0eb] bg-white p-8 shadow-[0_8px_30px_rgba(18,34,72,0.06)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-[#0f1c3f]">Past Events</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {events.map((event) => (
              <article key={event.name} className="rounded-2xl border border-[#d9e0eb] bg-[#fbfcfe] p-5 shadow-[0_1px_2px_rgba(18,34,72,0.04)]">
                <h3 className="text-base font-semibold text-[#0f1c3f]">{event.name}</h3>
                <div className="mt-3 space-y-1 text-sm text-[#66758f]">
                  <p>📅 {event.date}</p>
                  <p>📍 {event.city}</p>
                  <p>👥 {event.attendees}</p>
                  <p>✅ {event.checkIns}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#d9e0eb] bg-white p-8 shadow-[0_8px_30px_rgba(18,34,72,0.06)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-[#0f1c3f]">Audience Insights</h2>
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-sm font-medium text-emerald-600">
              Verified Data
            </span>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_1fr_1fr_1.1fr]">
            <article>
              <h3 className="text-base font-medium text-[#0f1c3f]">Age Distribution</h3>
              <div className="mt-6 flex items-center justify-center">
                <div
                  className="h-48 w-48 rounded-full"
                  style={{
                    background:
                      "conic-gradient(#f59e0b 0 35%, #3b82f6 35% 75%, #8b5cf6 75% 93%, #94a3b8 93% 100%)",
                  }}
                >
                  <div className="m-auto mt-10 h-28 w-28 rounded-full bg-white" />
                </div>
              </div>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-[#0f1c3f]">
                {audienceSegments.map((segment) => (
                  <span key={segment.label} className="inline-flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${segment.color}`} />
                    {segment.label}: {segment.value}%
                  </span>
                ))}
              </div>
            </article>

            <article>
              <h3 className="text-base font-medium text-[#0f1c3f]">Gender Split</h3>
              <div className="mt-6 h-48 rounded-2xl border border-dashed border-[#d9e0eb] bg-[#fbfcfe] p-4">
                <div className="flex h-full items-end gap-6">
                  <div className="flex flex-1 flex-col items-center gap-2">
                    <div className="w-full rounded-t-xl bg-[#f59e0b]" style={{ height: "78%" }} />
                    <span className="text-sm text-[#66758f]">Male</span>
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-2">
                    <div className="w-full rounded-t-xl bg-[#f59e0b]" style={{ height: "65%" }} />
                    <span className="text-sm text-[#66758f]">Female</span>
                  </div>
                  <div className="flex flex-1 flex-col items-center gap-2">
                    <div className="w-full rounded-t-xl bg-[#f59e0b]" style={{ height: "12%" }} />
                    <span className="text-sm text-[#66758f]">Non-binary</span>
                  </div>
                </div>
              </div>
            </article>

            <article>
              <h3 className="text-base font-medium text-[#0f1c3f]">Top Locations</h3>
              <div className="mt-6 space-y-4">
                {topLocations.map((location) => (
                  <div key={location.city}>
                    <div className="mb-2 flex items-center justify-between text-sm text-[#0f1c3f]">
                      <span>{location.city}</span>
                      <span>{location.value}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[#eef2f7]">
                      <div className="h-2 rounded-full bg-[#f79009]" style={{ width: `${location.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article>
              <h3 className="text-base font-medium text-[#0f1c3f]">Interests</h3>
              <div className="mt-6 flex flex-wrap gap-2">
                {['Electronic Music', 'Nightlife', 'Fashion', 'Tech', 'Fitness'].map((interest) => (
                  <span key={interest} className="rounded-full border border-[#d9e0eb] bg-white px-3 py-1 text-sm font-medium text-[#0f1c3f]">
                    {interest}
                  </span>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <p className="text-3xl font-bold text-emerald-500">62%</p>
                <p className="mt-1 text-sm text-[#5f7190]">Returning Attendees</p>
              </div>
            </article>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#d9e0eb] bg-white p-8 shadow-[0_8px_30px_rgba(18,34,72,0.06)]">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-[#0f1c3f]">Ticket Sales vs Check-ins</h2>
            <span className="inline-flex rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1 text-sm font-medium text-emerald-600">
              Verified
            </span>
          </div>
          <div className="mt-8 h-72 rounded-2xl border border-[#e5eaf2] bg-[#fbfcfe] p-6">
            <div className="flex h-full items-end gap-8">
              <div className="flex flex-1 flex-col items-center gap-3">
                <div className="flex w-full items-end justify-center gap-2">
                  <div className="w-20 rounded-t-lg bg-[#0b173b] h-62" />
                  <div className="w-20 rounded-t-lg bg-[#f59e0b] h-60" />
                </div>
                <span className="text-sm text-[#66758f]">Summer 2024</span>
              </div>
              <div className="flex flex-1 flex-col items-center gap-3">
                <div className="flex w-full items-end justify-center gap-2">
                  <div className="w-20 rounded-t-lg bg-[#0b173b] h-34" />
                  <div className="w-20 rounded-t-lg bg-[#f59e0b] h-33" />
                </div>
                <span className="text-sm text-[#66758f]">NYE 2024</span>
              </div>
              <div className="flex flex-1 flex-col items-center gap-3">
                <div className="flex w-full items-end justify-center gap-2">
                  <div className="w-20 rounded-t-lg bg-[#0b173b] h-24" />
                  <div className="w-20 rounded-t-lg bg-[#f59e0b] h-23" />
                </div>
                <span className="text-sm text-[#66758f]">Spring 2024</span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#d9e0eb] bg-white p-8 shadow-[0_8px_30px_rgba(18,34,72,0.06)]">
          <h2 className="text-2xl font-bold text-[#0f1c3f]">Previous Sponsors</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {sponsors.map((sponsor) => (
              <article key={sponsor.name} className="rounded-2xl border border-[#d9e0eb] bg-[#fbfcfe] p-6 text-center">
                <div className="text-3xl">{sponsor.icon}</div>
                <h3 className="mt-3 text-lg font-semibold text-[#0f1c3f]">{sponsor.name}</h3>
                <p className="mt-1 text-sm text-emerald-500">{sponsor.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-[#d9e0eb] bg-white p-8 shadow-[0_8px_30px_rgba(18,34,72,0.06)]">
          <h2 className="text-2xl font-bold text-[#0f1c3f]">Sponsorship Inventory</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              'Main stage branding',
              'VIP lounge naming',
              'Lanyard sponsorship',
              'Digital screens',
              'Branded water stations',
              'After-party sponsorship',
            ].map((item) => (
              <span key={item} className="rounded-full border border-[#d9e0eb] bg-white px-4 py-2 text-sm font-medium text-[#0f1c3f]">
                {item}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-8 pb-4">
          <h2 className="text-2xl font-bold text-[#0f1c3f]">Sponsorship Packages</h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {packages.map((pkg) => (
              <article
                key={pkg.name}
                className={`relative rounded-3xl border bg-white p-6 shadow-[0_8px_30px_rgba(18,34,72,0.06)] ${pkg.accent}`}
              >
                {pkg.popular ? (
                  <div className="absolute -top-3 left-5 rounded-full bg-[#f79009] px-3 py-1 text-xs font-semibold text-white shadow-sm">
                    Most Popular
                  </div>
                ) : null}
                <div className="inline-flex rounded-full border border-[#d9e0eb] px-3 py-1 text-xs font-semibold text-[#0f1c3f]">
                  {pkg.name}
                </div>
                <p className="mt-4 text-4xl font-bold tracking-tight text-[#0f1c3f]">{pkg.price}</p>
                <p className="mt-2 text-sm text-[#66758f]">{pkg.cpm}</p>
                <ul className="mt-6 space-y-3 text-sm text-[#5f7190]">
                  {pkg.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <span className="mt-0.5 text-emerald-500">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`mt-8 w-full rounded-xl border px-4 py-3 text-sm font-semibold transition hover:opacity-95 ${pkg.button}`}
                >
                  Sponsor this creator
                </button>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
