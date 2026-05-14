import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/src/auth/options";
import { and, desc, eq } from "drizzle-orm";
import { creators, packages, profiles, sponsorCompanies, sponsorshipInquiries } from "@/src/db/schema";

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "text-[#f79009]" },
  negotiating: { label: "Negotiating", color: "text-[#0f1c3f]" },
  closed_won: { label: "Closed Won", color: "text-[#00b366]" },
  closed_lost: { label: "Closed Lost", color: "text-[#ff4d4d]" },
};

const GOAL_LABELS: Record<string, string> = {
  brand_awareness: "Brand Awareness",
  lead_generation: "Lead Generation",
  product_launch: "Product Launch",
  community_building: "Community Building",
  sampling: "Sampling",
  employer_branding: "Employer Branding",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value);
}

function formatBudget(min: string | null, max: string | null) {
  if (min && max && min === max) return formatCurrency(Number(min));
  if (min && max) return `${formatCurrency(Number(min))} - ${formatCurrency(Number(max))}`;
  if (min) return `${formatCurrency(Number(min))}+`;
  if (max) return `Up to ${formatCurrency(Number(max))}`;
  return "Custom budget";
}

export default async function CreatorLeadsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || session.user.role !== "creator") {
    redirect("/creator/login");
  }

  const { db } = await import("@/src/db/db");

  const [creatorRow] = await db
    .select()
    .from(creators)
    .where(eq(creators.createdByUserId, session.user.id))
    .limit(1);

  if (!creatorRow) {
    redirect("/creator/login");
  }

  const inquiryRows = await db
    .select({
      inquiry: sponsorshipInquiries,
      sponsor: sponsorCompanies,
      package: packages,
    })
    .from(sponsorshipInquiries)
    .leftJoin(sponsorCompanies, eq(sponsorshipInquiries.sponsorCompanyId, sponsorCompanies.id))
    .leftJoin(packages, eq(sponsorshipInquiries.packageId, packages.id))
    .where(eq(sponsorshipInquiries.creatorId, creatorRow.id))
    .orderBy(desc(sponsorshipInquiries.createdAt));

  const grouped: Record<string, typeof inquiryRows> = {};
  for (const row of inquiryRows) {
    const status = row.inquiry.status;
    if (!grouped[status]) grouped[status] = [];
    grouped[status].push(row);
  }

  const statusOrder = ["pending", "negotiating", "closed_won", "closed_lost"];
  const totalLeads = inquiryRows.length;

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold text-[#0f1c3f]">Sponsorship Pipeline</h1>
          <p className="text-base text-[#6b7e9e]">{totalLeads} total {totalLeads === 1 ? "lead" : "leads"}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          {statusOrder.map((status) => {
            const rows = grouped[status] ?? [];
            const statusInfo = STATUS_LABELS[status];

            return (
              <section key={status}>
                <div className="mb-4 flex items-center justify-between">
                  <div className={`flex items-center gap-2 ${statusInfo.color}`}>
                    <span>◔</span>
                    <h2 className="text-lg font-semibold">{statusInfo.label}</h2>
                  </div>
                  <span className="rounded-full border border-[#d9e0eb] px-3 py-1 text-sm font-semibold text-[#0f1c3f]">
                    {rows.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {rows.length > 0 ? (
                    rows.map(({ inquiry, sponsor, package: pkg }) => (
                      <article key={inquiry.id} className="rounded-2xl border border-[#d9e0eb] bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f3f5f9] text-lg font-bold text-[#f79009]">
                            {(sponsor?.name ?? "S").slice(0, 1)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-[#0f1c3f]">{sponsor?.name ?? "Unknown Sponsor"}</h3>
                            <p className="text-sm text-[#6b7e9e]">{sponsor?.industry ?? ""}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-[#5f7190]">
                          <p>◎ {GOAL_LABELS[inquiry.campaignGoal] ?? inquiry.campaignGoal}</p>
                          <p>{formatBudget(inquiry.budgetMin, inquiry.budgetMax)}</p>
                          <p>📅 {new Date(inquiry.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                        </div>
                        {pkg && (
                          <div className="mt-4 inline-flex rounded-full border border-[#d9e0eb] px-3 py-1 text-sm font-semibold text-[#0f1c3f]">
                            {pkg.packageType.charAt(0).toUpperCase() + pkg.packageType.slice(1)}
                          </div>
                        )}
                        {inquiry.requirementsText && inquiry.requirementsText !== "No specific requirements provided." && (
                          <div className="mt-3 rounded-lg bg-[#f8f9fb] p-3">
                            <p className="text-xs font-semibold text-[#0f1c3f]">Requirements</p>
                            <p className="mt-1 text-xs text-[#6b7e9e]">{inquiry.requirementsText}</p>
                          </div>
                        )}
                      </article>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-dashed border-[#d9e0eb] bg-white p-6 text-center text-sm text-[#6b7e9e]">
                      No {statusInfo.label.toLowerCase()} leads
                    </div>
                  )}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
