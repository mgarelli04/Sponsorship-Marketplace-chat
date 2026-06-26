import { redirect } from "next/navigation";
import { desc, eq } from "drizzle-orm";
import { getCurrentChatUser } from "@/src/chat/session";
import { db } from "@/src/db/db";
import { creators, packages, sponsorCompanies, sponsorshipInquiries } from "@/src/db/schema";

export const dynamic = "force-dynamic";

function statusLabel(status: string) {
  return status
    .split("_")
    .map((part) => part[0]?.toUpperCase() + part.slice(1))
    .join(" ");
}

function formatCurrency(value: string | null) {
  if (!value) return "";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(Number(value));
}

function formatBudget(min: string | null, max: string | null) {
  if (min && max && min === max) return formatCurrency(min);
  if (min && max) return `${formatCurrency(min)} - ${formatCurrency(max)}`;
  if (min) return `${formatCurrency(min)}+`;
  if (max) return `Hasta ${formatCurrency(max)}`;
  return "Presupuesto personalizado";
}

export default async function CreatorLeadsPage() {
  const user = await getCurrentChatUser().catch(() => null);

  if (!user || user.role !== "creator") {
    redirect("/creator/login");
  }

  const [creator] = await db
    .select()
    .from(creators)
    .where(eq(creators.createdByUserId, user.id))
    .limit(1);

  if (!creator) {
    redirect("/creator/dashboard");
  }

  const leads = await db
    .select({
      id: sponsorshipInquiries.id,
      status: sponsorshipInquiries.status,
      campaignGoal: sponsorshipInquiries.campaignGoal,
      budgetMin: sponsorshipInquiries.budgetMin,
      budgetMax: sponsorshipInquiries.budgetMax,
      currencyCode: sponsorshipInquiries.currencyCode,
      requirementsText: sponsorshipInquiries.requirementsText,
      createdAt: sponsorshipInquiries.createdAt,
      sponsorName: sponsorCompanies.name,
      sponsorIndustry: sponsorCompanies.industry,
      packageType: packages.packageType,
    })
    .from(sponsorshipInquiries)
    .leftJoin(sponsorCompanies, eq(sponsorshipInquiries.sponsorCompanyId, sponsorCompanies.id))
    .leftJoin(packages, eq(sponsorshipInquiries.packageId, packages.id))
    .where(eq(sponsorshipInquiries.creatorId, creator.id))
    .orderBy(desc(sponsorshipInquiries.createdAt));

  return (
    <main className="min-h-screen bg-[#f5f6f8]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wide text-[#f79009]">
            Creator leads
          </p>
          <h1 className="text-4xl font-bold text-[#0f1c3f]">Solicitudes de sponsors</h1>
          <p className="mt-2 text-base text-[#6b7e9e]">
            Leads recibidos para {creator.displayName}.
          </p>
        </div>

        {leads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#cfd8e6] bg-white p-8">
            <h2 className="font-semibold text-[#0f1c3f]">No hay leads todavia</h2>
            <p className="mt-2 text-sm text-[#6b7e9e]">
              Cuando un sponsor envie una solicitud desde tu perfil, aparecera aqui.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map((lead) => (
              <article key={lead.id} className="rounded-2xl border border-[#d9e0eb] bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[#0f1c3f]">
                      {lead.sponsorName || "Sponsor"}
                    </h2>
                    <p className="mt-1 text-sm text-[#6b7e9e]">
                      {lead.sponsorIndustry || "General"} · {statusLabel(lead.campaignGoal)}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#fff3e2] px-3 py-1 text-xs font-bold text-[#f79009]">
                    {statusLabel(lead.status)}
                  </span>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-[#475569] md:grid-cols-3">
                  <p><strong>Budget:</strong> {formatBudget(lead.budgetMin, lead.budgetMax)}</p>
                  <p><strong>Package:</strong> {lead.packageType ? statusLabel(lead.packageType) : "Custom"}</p>
                  <p><strong>Created:</strong> {new Intl.DateTimeFormat("es-ES").format(new Date(lead.createdAt))}</p>
                </div>
                <p className="mt-4 rounded-xl bg-[#f8fafc] p-4 text-sm text-[#475569]">
                  {lead.requirementsText}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
