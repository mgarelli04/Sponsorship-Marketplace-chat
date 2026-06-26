import { NextResponse } from "next/server";
import { getCurrentChatUser } from "@/src/chat/session";
import { desc, eq } from "drizzle-orm";
import { creators, packages, sponsorCompanies, sponsorshipInquiries } from "@/src/db/schema";

export async function GET() {
  try {
    const user = await getCurrentChatUser().catch(() => null);
    if (!user || user.role !== "creator") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { db } = await import("@/src/db/db");

    const [creatorRow] = await db
      .select()
      .from(creators)
      .where(eq(creators.createdByUserId, user.id))
      .limit(1);

    if (!creatorRow) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    const rows = await db
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
      .where(eq(sponsorshipInquiries.creatorId, creatorRow.id))
      .orderBy(desc(sponsorshipInquiries.createdAt));

    return NextResponse.json({ leads: rows });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
