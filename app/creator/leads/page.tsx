"use client";

export default function CreatorLeadsPage() {
  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#0f1c3f] mb-2">
            Sponsorship Pipeline
          </h1>
          <p className="text-base text-[#6b7e9e]">5 total leads</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#0f1c3f]">
                <span className="text-[#f79009]">◔</span>
                <h2 className="text-lg font-semibold">Pending</h2>
              </div>
              <span className="rounded-full border border-[#d9e0eb] px-3 py-1 text-sm font-semibold text-[#0f1c3f]">2</span>
            </div>
            <div className="space-y-4">
              <article className="rounded-2xl border border-[#d9e0eb] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f3f5f9] text-xl">✓</div>
                  <div>
                    <h3 className="font-semibold text-[#0f1c3f]">Nike</h3>
                    <p className="text-sm text-[#6b7e9e]">Nike Inc.</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-[#5f7190]">
                  <p>◎ Brand Awareness</p>
                  <p>$ 30,000 - $50,000</p>
                  <p>📅 2025-03-07</p>
                </div>
                <div className="mt-4 inline-flex rounded-full border border-[#d9e0eb] px-3 py-1 text-sm font-semibold text-[#0f1c3f]">Gold</div>
              </article>

              <article className="rounded-2xl border border-[#d9e0eb] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f3f5f9] text-xl">👟</div>
                  <div>
                    <h3 className="font-semibold text-[#0f1c3f]">Adidas</h3>
                    <p className="text-sm text-[#6b7e9e]">Adidas AG</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-[#5f7190]">
                  <p>◎ Brand Awareness</p>
                  <p>$ 15,000 - $25,000</p>
                  <p>📅 2025-03-08</p>
                </div>
                <div className="mt-4 inline-flex rounded-full border border-[#d9e0eb] px-3 py-1 text-sm font-semibold text-[#0f1c3f]">Silver</div>
              </article>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#0f1c3f]">
                <span className="text-[#0f1c3f]">◔</span>
                <h2 className="text-lg font-semibold">Negotiating</h2>
              </div>
              <span className="rounded-full border border-[#d9e0eb] px-3 py-1 text-sm font-semibold text-[#0f1c3f]">1</span>
            </div>
            <div className="space-y-4">
              <article className="rounded-2xl border border-[#d9e0eb] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f3f5f9] text-xl">🎧</div>
                  <div>
                    <h3 className="font-semibold text-[#0f1c3f]">Spotify</h3>
                    <p className="text-sm text-[#6b7e9e]">Spotify AB</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-[#5f7190]">
                  <p>◎ Lead Generation</p>
                  <p>$ 10,000 - $20,000</p>
                  <p>📅 2025-03-05</p>
                </div>
                <div className="mt-4 inline-flex rounded-full border border-[#d9e0eb] px-3 py-1 text-sm font-semibold text-[#0f1c3f]">Silver</div>
              </article>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#0f1c3f]">
                <span className="text-[#00b366]">◔</span>
                <h2 className="text-lg font-semibold">Closed Won</h2>
              </div>
              <span className="rounded-full border border-[#d9e0eb] px-3 py-1 text-sm font-semibold text-[#0f1c3f]">1</span>
            </div>
            <div className="space-y-4">
              <article className="rounded-2xl border border-[#d9e0eb] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f3f5f9] text-xl">🐂</div>
                  <div>
                    <h3 className="font-semibold text-[#0f1c3f]">Red Bull</h3>
                    <p className="text-sm text-[#6b7e9e]">Red Bull GmbH</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-[#5f7190]">
                  <p>◎ Community Building</p>
                  <p>$ 40,000 - $60,000</p>
                  <p>📅 2025-02-28</p>
                </div>
                <div className="mt-4 inline-flex rounded-full border border-[#d9e0eb] px-3 py-1 text-sm font-semibold text-[#0f1c3f]">Gold</div>
              </article>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#0f1c3f]">
                <span className="text-[#ff4d4d]">◔</span>
                <h2 className="text-lg font-semibold">Closed Lost</h2>
              </div>
              <span className="rounded-full border border-[#d9e0eb] px-3 py-1 text-sm font-semibold text-[#0f1c3f]">1</span>
            </div>
            <div className="space-y-4">
              <article className="rounded-2xl border border-[#d9e0eb] bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f3f5f9] text-xl">₿</div>
                  <div>
                    <h3 className="font-semibold text-[#0f1c3f]">Coinbase</h3>
                    <p className="text-sm text-[#6b7e9e]">Coinbase Global</p>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-[#5f7190]">
                  <p>◎ Product Launch</p>
                  <p>$ 3,000 - $5,000</p>
                  <p>📅 2025-02-20</p>
                </div>
                <div className="mt-4 inline-flex rounded-full border border-[#d9e0eb] px-3 py-1 text-sm font-semibold text-[#0f1c3f]">Bronze</div>
              </article>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
