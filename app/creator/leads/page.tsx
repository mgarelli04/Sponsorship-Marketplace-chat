"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

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

interface Lead {
  id: string;
  status: string;
  campaignGoal: string;
  budgetMin: string | null;
  budgetMax: string | null;
  currencyCode: string;
  requirementsText: string;
  createdAt: string;
  sponsorName: string | null;
  sponsorIndustry: string | null;
  packageType: string | null;
}

export default function CreatorLeadsPage() {
  const { data: session, status } = useSession();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/creator/login");
    }
  }, [status]);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role === "creator") {
      fetch("/api/creator/leads")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch leads");
          return res.json();
        })
        .then((data) => {
          setLeads(data.leads);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [session, status]);

  if (status === "loading" || loading) {
    return (
      <main className="min-h-screen bg-[#f5f6f8]">
        <div className="mx-auto max-w-7xl px-6 py-12 text-[#6b7e9e]">
          Loading leads...
        </div>
      </main>
    );
  }

  if (session?.user?.role !== "creator") {
    return null;
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#f5f6f8]">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </main>
    );
  }

  const grouped: Record<string, Lead[]> = {};
  for (const lead of leads) {
    if (!grouped[lead.status]) grouped[lead.status] = [];
    grouped[lead.status].push(lead);
  }

  const statusOrder = ["pending", "negotiating", "closed_won", "closed_lost"];
  const totalLeads = leads.length;

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
                    <span>&#x25D4;</span>
                    <h2 className="text-lg font-semibold">{statusInfo.label}</h2>
                  </div>
                  <span className="rounded-full border border-[#d9e0eb] px-3 py-1 text-sm font-semibold text-[#0f1c3f]">
                    {rows.length}
                  </span>
                </div>
                <div className="space-y-4">
                  {rows.length > 0 ? (
                    rows.map((lead) => (
                      <article key={lead.id} className="rounded-2xl border border-[#d9e0eb] bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#f3f5f9] text-lg font-bold text-[#f79009]">
                            {(lead.sponsorName ?? "S").slice(0, 1)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-[#0f1c3f]">{lead.sponsorName ?? "Unknown Sponsor"}</h3>
                            <p className="text-sm text-[#6b7e9e]">{lead.sponsorIndustry ?? ""}</p>
                          </div>
                        </div>
                        <div className="space-y-2 text-sm text-[#5f7190]">
                          <p>{GOAL_LABELS[lead.campaignGoal] ?? lead.campaignGoal}</p>
                          <p>{formatBudget(lead.budgetMin, lead.budgetMax)}</p>
                          <p>{new Date(lead.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</p>
                        </div>
                        {lead.packageType && (
                          <div className="mt-4 inline-flex rounded-full border border-[#d9e0eb] px-3 py-1 text-sm font-semibold text-[#0f1c3f]">
                            {lead.packageType.charAt(0).toUpperCase() + lead.packageType.slice(1)}
                          </div>
                        )}
                        {lead.requirementsText && lead.requirementsText !== "No specific requirements provided." && (
                          <div className="mt-3 rounded-lg bg-[#f8f9fb] p-3">
                            <p className="text-xs font-semibold text-[#0f1c3f]">Requirements</p>
                            <p className="mt-1 text-xs text-[#6b7e9e]">{lead.requirementsText}</p>
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