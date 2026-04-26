export default function Home() {
  return (
    <div className="bg-[#f4f5f7] text-[#0f1c3f]">
      <main>
        <section className="border-b border-[#e2e7ef] px-6 py-20 md:py-24">
          <div className="mx-auto flex w-full max-w-4xl flex-col items-center text-center">
            <div className="mb-10 inline-flex items-center gap-2 rounded-full border border-[#f7d3a0] bg-[#fff4e8] px-4 py-2 text-sm font-medium text-[#d8891e]">
              <span aria-hidden="true">⚡</span>
              <span>The sponsorship marketplace is here</span>
            </div>

            <h1 className="text-balance text-5xl font-extrabold leading-[1.05] tracking-[-0.03em] text-[#0b173b] md:text-7xl">
              <span className="block">Where Brands Meet</span>
              <span className="block text-[#f79009]">Creators</span>
            </h1>

            <p className="mt-8 max-w-3xl text-pretty text-base leading-relaxed text-[#5f7190] md:text-lg">
              The data-driven marketplace connecting event creators with sponsors.
              Verified audiences. Dynamic media kits. Faster deals.
            </p>

            <div className="mt-10 flex w-full max-w-xl flex-col gap-4 sm:flex-row sm:justify-center">
              <a
                className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#0b173b] px-8 text-base font-semibold text-white shadow-md shadow-[#0b173b]/10 transition hover:bg-[#101f4f]"
                href="#"
              >
                Build my media kit
                <span aria-hidden="true">→</span>
              </a>
              <a
                className="inline-flex h-14 items-center justify-center gap-3 rounded-2xl border border-[#cad3e2] bg-[#f7f8fa] px-8 text-base font-semibold text-[#22345b] transition hover:bg-white"
                href="#"
              >
                Explore creators
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </div>
        </section>

        <section className="px-6 py-12 md:py-14">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-2 gap-y-10 text-center md:grid-cols-4 md:text-left">
            <article>
              <p className="text-4xl font-extrabold tracking-tight text-[#0b173b] md:text-5xl">247+</p>
              <p className="mt-2 text-base font-medium text-[#6d7c96] md:text-lg">Active Creators</p>
            </article>
            <article>
              <p className="text-4xl font-extrabold tracking-tight text-[#0b173b] md:text-5xl">1,840</p>
              <p className="mt-2 text-base font-medium text-[#6d7c96] md:text-lg">Sponsor Brands</p>
            </article>
            <article>
              <p className="text-4xl font-extrabold tracking-tight text-[#0b173b] md:text-5xl">$4.2M</p>
              <p className="mt-2 text-base font-medium text-[#6d7c96] md:text-lg">Deals Closed</p>
            </article>
            <article>
              <p className="text-4xl font-extrabold tracking-tight text-[#0b173b] md:text-5xl">93%</p>
              <p className="mt-2 text-base font-medium text-[#6d7c96] md:text-lg">Data Verified</p>
            </article>
          </div>
        </section>

        <section id="features" className="border-y border-[#e2e7ef] px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-4xl font-bold tracking-tight text-[#0b173b] md:text-5xl">
                Built for modern sponsorships
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[#5f7190] md:text-lg">
                Everything creators and sponsors need to find each other, build
                trust, and close deals faster.
              </p>
            </div>

            <div className="mt-14 grid gap-6 md:grid-cols-2">
              <article className="rounded-2xl border border-[#d7dee9] bg-[#f5f7fa] p-8 shadow-[0_2px_6px_rgba(15,28,63,0.05)]">
                <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-[#f3eadc] text-2xl text-[#f79009]">
                  <span aria-hidden="true">🛡️</span>
                </div>
                <h3 className="text-3xl font-semibold tracking-tight text-[#0b173b] md:text-4xl">
                  Verified Audience Data
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#5f7190] md:text-lg">
                  Every metric pulled directly from ticketing platforms. No
                  guesswork, no inflated numbers.
                </p>
              </article>

              <article className="rounded-2xl border border-[#d7dee9] bg-[#f5f7fa] p-8 shadow-[0_2px_6px_rgba(15,28,63,0.05)]">
                <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-[#f3eadc] text-2xl text-[#f79009]">
                  <span aria-hidden="true">📊</span>
                </div>
                <h3 className="text-3xl font-semibold tracking-tight text-[#0b173b] md:text-4xl">
                  Dynamic Media Kits
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#5f7190] md:text-lg">
                  Replace static PDFs with living, data-rich profiles that
                  update automatically.
                </p>
              </article>

              <article className="rounded-2xl border border-[#d7dee9] bg-[#f5f7fa] p-8 shadow-[0_2px_6px_rgba(15,28,63,0.05)]">
                <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-[#f3eadc] text-2xl text-[#f79009]">
                  <span aria-hidden="true">⚡</span>
                </div>
                <h3 className="text-3xl font-semibold tracking-tight text-[#0b173b] md:text-4xl">
                  Smart Matching
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#5f7190] md:text-lg">
                  AI-powered discovery connects sponsors with creators that fit
                  their target audience.
                </p>
              </article>

              <article className="rounded-2xl border border-[#d7dee9] bg-[#f5f7fa] p-8 shadow-[0_2px_6px_rgba(15,28,63,0.05)]">
                <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl bg-[#f3eadc] text-2xl text-[#f79009]">
                  <span aria-hidden="true">👥</span>
                </div>
                <h3 className="text-3xl font-semibold tracking-tight text-[#0b173b] md:text-4xl">
                  Structured Workflows
                </h3>
                <p className="mt-4 text-base leading-relaxed text-[#5f7190] md:text-lg">
                  From discovery to deal, manage the entire sponsorship
                  lifecycle in one place.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-b border-[#e2e7ef] px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="text-center text-4xl font-bold tracking-tight text-[#0b173b] md:text-5xl">
              How it works
            </h2>

            <div className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
              <article className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#f79009] text-3xl font-black text-white">
                  01
                </div>
                <h3 className="mt-6 text-3xl font-semibold tracking-tight text-[#0b173b]">
                  Connect &amp; Build
                </h3>
                <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-[#5f7190] md:text-lg">
                  Creators connect their event platform and generate a dynamic
                  media kit in minutes.
                </p>
              </article>

              <article className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#f79009] text-3xl font-black text-white">
                  02
                </div>
                <h3 className="mt-6 text-3xl font-semibold tracking-tight text-[#0b173b]">
                  Discover &amp; Match
                </h3>
                <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-[#5f7190] md:text-lg">
                  Sponsors search, filter, and find creators that match their
                  campaign goals.
                </p>
              </article>

              <article className="text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#f79009] text-3xl font-black text-white">
                  03
                </div>
                <h3 className="mt-6 text-3xl font-semibold tracking-tight text-[#0b173b]">
                  Negotiate &amp; Close
                </h3>
                <p className="mx-auto mt-4 max-w-sm text-base leading-relaxed text-[#5f7190] md:text-lg">
                  Start structured conversations and manage deals through a
                  built-in CRM.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section id="testimonials" className="border-b border-[#e2e7ef] px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-5xl">
            <h2 className="text-3xl font-bold tracking-tight text-[#0b173b] md:text-4xl">
              Trusted by creators &amp; brands
            </h2>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <article className="rounded-2xl border border-[#d7dee9] bg-[#f5f7fa] p-8 shadow-[0_2px_6px_rgba(15,28,63,0.05)]">
                <p className="text-lg text-[#f59e0b]">★★★★★</p>
                <blockquote className="mt-5 text-xl leading-[1.45] text-[#0b173b] md:text-2xl">
                  "We closed 3 sponsorship deals in our first month. The
                  verified data made brands trust us instantly."
                </blockquote>
                <p className="mt-7 text-lg font-semibold text-[#0b173b] md:text-xl">Maria Santos</p>
                <p className="text-sm text-[#5f7190] md:text-lg">Founder, Urban Bites Festival</p>
              </article>

              <article className="rounded-2xl border border-[#d7dee9] bg-[#f5f7fa] p-8 shadow-[0_2px_6px_rgba(15,28,63,0.05)]">
                <p className="text-lg text-[#f59e0b]">★★★★★</p>
                <blockquote className="mt-5 text-xl leading-[1.45] text-[#0b173b] md:text-2xl">
                  "Finding niche events that match our audience used to take
                  weeks. Now it takes minutes."
                </blockquote>
                <p className="mt-7 text-lg font-semibold text-[#0b173b] md:text-xl">David Kim</p>
                <p className="text-sm text-[#5f7190] md:text-lg">Brand Partnerships, Spotify</p>
              </article>
            </div>
          </div>
        </section>

        <section className="border-b border-[#e2e7ef] px-6 py-16 md:py-20">
          <div className="mx-auto w-full max-w-6xl">
            <div className="mx-auto max-w-3xl rounded-3xl bg-linear-to-r from-[#0b173b] to-[#1d2c57] px-8 py-12 text-center md:px-14 md:py-16">
              <h2 className="text-balance text-3xl font-bold leading-tight text-white md:text-4xl">
                Ready to transform your sponsorship game?
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-[#cfd7e7] md:text-base">
                Join hundreds of creators and brands already using SponsorHub
                to close better deals, faster.
              </p>

              <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <a
                  className="inline-flex h-12 min-w-44 items-center justify-center rounded-xl bg-[#f79009] px-6 text-base font-semibold text-white transition hover:bg-[#e88507]"
                  href="#"
                >
                  I&apos;m a Creator
                </a>
                <a
                  className="inline-flex h-12 min-w-44 items-center justify-center rounded-xl bg-white px-6 text-base font-semibold text-[#0b173b] transition hover:bg-[#eef2f8]"
                  href="#"
                >
                  I&apos;m a Sponsor
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
