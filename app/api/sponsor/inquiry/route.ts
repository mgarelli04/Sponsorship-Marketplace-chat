import { getServerSession } from "next-auth";
import { authOptions } from "@/src/auth/options";
import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { sponsorCompanies, sponsorshipInquiries } from "@/src/db/schema";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id || session.user.role !== "sponsor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { creatorId, packageTier, packagePrice, campaignGoal, budgetMin, budgetMax, currencyCode, source, requirementsText } = body;

    if (!creatorId || !campaignGoal || !source || !requirementsText) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const extras: string[] = [];
    if (packageTier) extras.push(`Package: ${packageTier}${packagePrice ? ` ($${Number(packagePrice).toLocaleString()})` : ""}`);

    const finalRequirements = extras.length > 0
      ? `${extras.join("\n")}\n\n${requirementsText}`
      : requirementsText;

    const { db } = await import("@/src/db/db");

    const [company] = await db
      .select()
      .from(sponsorCompanies)
      .where(eq(sponsorCompanies.createdByUserId, session.user.id))
      .limit(1);

    if (!company) {
      return NextResponse.json({ error: "No sponsor company found for this user" }, { status: 400 });
    }

    const [inquiry] = await db
      .insert(sponsorshipInquiries)
      .values({
        creatorId,
        sponsorCompanyId: company.id,
        sponsorUserId: session.user.id,
        source,
        campaignGoal,
        budgetMin: budgetMin?.toString() ?? null,
        budgetMax: budgetMax?.toString() ?? null,
        currencyCode: currencyCode ?? "EUR",
        requirementsText: finalRequirements,
        status: "pending",
      })
      .returning({ id: sponsorshipInquiries.id });

    return NextResponse.json({ id: inquiry.id, message: "Inquiry submitted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
