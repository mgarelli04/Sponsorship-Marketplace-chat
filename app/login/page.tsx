export default function Home() {
  return (
    <main className="grid min-h-screen bg-[#f5f6f8] md:grid-cols-[1.1fr_0.9fr]">
      <section className="relative overflow-hidden bg-linear-to-br from-[#07163c] via-[#0c1e4a] to-[#1a2b5a] px-8 py-10 text-white md:px-12 md:py-14">
        <div
          className="absolute -bottom-24 -left-24 h-96 w-96 rounded-full bg-white/4"
          aria-hidden="true"
        />
        <div
          className="absolute right-16 top-16 h-56 w-56 rounded-full bg-white/5"
          aria-hidden="true"
        />

        <div className="relative z-10 flex min-h-[30vh] flex-col justify-between md:min-h-[calc(100vh-7rem)]">
          <div>
            <a className="inline-flex items-center gap-3" href="#" aria-label="SponsorHub home">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#f79009] text-sm font-bold lowercase text-white">
                s
              </span>
              <span className="text-xl font-bold tracking-tight md:text-2xl">SponsorHub</span>
            </a>

            <div className="mt-16 max-w-lg">
              <h1 className="text-3xl font-bold leading-tight tracking-tight md:text-4xl">
                <span className="block text-white">The marketplace where</span>
                <span className="block text-[#f79a1d]">sponsorships happen</span>
              </h1>

              <p className="mt-6 max-w-md text-base leading-relaxed text-[#aab7d4] md:text-lg">
                Verified data. Dynamic media kits. Smarter matching. Join the
                platform redefining B2B sponsorships.
              </p>
            </div>
          </div>

          <div className="mt-14 flex flex-wrap gap-x-8 gap-y-3 text-sm font-medium text-[#8fa0c9] md:mt-0 md:text-base">
            <span>247+ Creators</span>
            <span>1,840 Brands</span>
            <span>93% Verified</span>
          </div>
        </div>
      </section>

      <section className="grid place-items-center px-6 py-12 md:px-10 md:py-16">
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-bold tracking-tight text-[#0f1c3f] md:text-3xl">
            Welcome to SponsorHub
          </h2>
          <p className="mt-3 text-sm text-[#6b7e9e] md:text-base">
            Choose how you&apos;d like to get started
          </p>

          <div className="mt-8 space-y-4">
            <a
              href="#"
              className="flex items-start gap-4 rounded-2xl border border-[#d9e0eb] bg-white px-5 py-4 transition hover:border-[#c5cfdf] hover:shadow-[0_4px_12px_rgba(18,34,72,0.06)]"
            >
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#fff3ea] text-lg"
                aria-hidden="true"
              >
                ⛺
              </span>
              <span>
                <span className="block text-lg font-semibold text-[#0f1c3f] md:text-xl">
                  Creator / Organizer
                </span>
                <span className="mt-1 block text-sm text-[#7082a0] md:text-base">
                  Build your media kit and attract sponsors
                </span>
              </span>
            </a>

            <a
              href="#"
              className="flex items-start gap-4 rounded-2xl border border-[#d9e0eb] bg-white px-5 py-4 transition hover:border-[#c5cfdf] hover:shadow-[0_4px_12px_rgba(18,34,72,0.06)]"
            >
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#eef5ff] text-lg"
                aria-hidden="true"
              >
                🏢
              </span>
              <span>
                <span className="block text-lg font-semibold text-[#0f1c3f] md:text-xl">
                  Sponsor / Brand
                </span>
                <span className="mt-1 block text-sm text-[#7082a0] md:text-base">
                  Discover and connect with event creators
                </span>
              </span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
