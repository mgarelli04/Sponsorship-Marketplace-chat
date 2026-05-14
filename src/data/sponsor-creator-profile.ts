import "server-only";

import { and, eq, inArray } from "drizzle-orm";
import { creators, events, inventoryItems, packageItems, packages, creatorPastSponsors, audienceSnapshots } from "@/src/db/schema";
import type { CreatorPackage, MarketplaceCreator } from "@/src/data/sponsor-marketplace";

function toNumber(value: unknown, fallback = 0) {
  if (value === null || value === undefined) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join("") || "SH";
}

function normalizePackageTier(value: string): CreatorPackage["tier"] {
  if (value === "silver") return "Silver";
  if (value === "gold") return "Gold";
  return "Bronze";
}

export type PastSponsorCampaign = {
  sponsorName: string;
  logoUrl: string;
  campaignTitle: string | null;
  description: string;
  metrics: {
    impressions?: number;
    leads?: number;
    engagementRatePct?: number;
  } | null;
  startDate: string | null;
  endDate: string | null;
};

export type CreatorProfileData = {
  creator: MarketplaceCreator;
  events: Array<{
    id: string;
    title: string;
    startsAt: string;
    city: string;
    ticketsSold: number;
    checkinsCount: number;
    eventStatus: string;
  }>;
  pastSponsors: PastSponsorCampaign[];
  demographics: {
    ageGroups: { label: string; value: number }[];
    gender: { label: string; value: number }[];
    topLocations: { city: string; percentage: number }[];
  } | null;
};

export async function getCreatorProfile(id: string): Promise<CreatorProfileData | null> {
  const connectionString = process.env.DATABASE_URL ?? process.env.SUPABASE_DATABASE_URL;
  if (!connectionString) return null;

  try {
    const { db } = await import("@/src/db/db");

    const [creatorRow] = await db.select().from(creators).where(eq(creators.id, id)).limit(1);
    if (!creatorRow) return null;

    const [eventRows, packageRows, pastSponsorRows, snapshotRows] = await Promise.all([
      db.select().from(events).where(eq(events.creatorId, id)).limit(20),
      db
        .select()
        .from(packages)
        .where(eq(packages.creatorId, id))
        .orderBy(packages.sortOrder),
      db.select().from(creatorPastSponsors).where(eq(creatorPastSponsors.creatorId, id)),
      db
        .select()
        .from(audienceSnapshots)
        .where(eq(audienceSnapshots.creatorId, id))
        .orderBy(audienceSnapshots.snapshotDate),
    ]);

    const packageIds = packageRows.map((p) => p.id);
    const packageItemRows = packageIds.length > 0
      ? await db
          .select({
            packageId: packageItems.packageId,
            itemName: inventoryItems.name,
            itemDescription: inventoryItems.description,
          })
          .from(packageItems)
          .innerJoin(inventoryItems, eq(packageItems.inventoryItemId, inventoryItems.id))
          .where(and(inArray(packageItems.packageId, packageIds)))
      : [];

    const itemsByPackage = new Map<string, { name: string; description: string }[]>();
    for (const row of packageItemRows) {
      const current = itemsByPackage.get(row.packageId) ?? [];
      current.push({ name: row.itemName, description: row.itemDescription });
      itemsByPackage.set(row.packageId, current);
    }

    const creatorPackages: CreatorPackage[] = packageRows.map((row) => ({
      id: row.id,
      tier: normalizePackageTier(row.packageType),
      price: toNumber(row.priceAmount),
      impressions: row.estimatedImpressions ?? 0,
      reach: row.estimatedReach ?? 0,
      cpm: toNumber(row.estimatedCpm),
      benefits: row.description ? [row.description] : [],
      items: itemsByPackage.get(row.id) ?? [],
    }));

    const eventAudience = eventRows.reduce((max, e) => Math.max(max, e.ticketsSold, e.checkinsCount), 0);
    const totalTickets = eventRows.reduce((sum, e) => sum + e.ticketsSold, 0);
    const totalCheckins = eventRows.reduce((sum, e) => sum + e.checkinsCount, 0);
    const checkInRate = totalTickets > 0 ? Math.round((totalCheckins / totalTickets) * 100) : 0;
    const returningAttendees = snapshotRows.length > 0
      ? Math.round(toNumber(snapshotRows[0].repeatAttendancePct))
      : 0;
    const verified = creatorRow.verificationStatus === "verified";
    const audienceSize = snapshotRows[0]?.totalAttendees ?? eventAudience;

    const profileCreator: MarketplaceCreator = {
      id: creatorRow.id,
      logo: initials(creatorRow.displayName),
      name: creatorRow.displayName,
      tagline: creatorRow.tagline,
      location: [creatorRow.city, creatorRow.region].filter(Boolean).join(", "),
      city: creatorRow.city,
      region: creatorRow.region,
      country: creatorRow.countryCode,
      category: "Uncategorized",
      audienceSize,
      matchScore: 0,
      verified,
      returningAttendees,
      checkInRate,
      responseTimeHours: creatorRow.responseTimeHours ?? 48,
      lastUpdated: creatorRow.updatedAt.toISOString().slice(0, 10),
      previousSponsors: pastSponsorRows.map((s) => s.sponsorName),
      interests: [],
      audienceTypes: [],
      packages: creatorPackages,
    };

    const latestSnapshot = snapshotRows[0] ?? null;
    const demographics = latestSnapshot
      ? {
          ageGroups: (latestSnapshot.demographicsJsonb as { ageGroups?: { label: string; value: number }[] })?.ageGroups ?? [],
          gender: (latestSnapshot.demographicsJsonb as { gender?: { label: string; value: number }[] })?.gender ?? [],
          topLocations: (latestSnapshot.topLocationsJsonb as { locations?: { city: string; percentage: number }[] })?.locations ?? [],
        }
      : null;

    return {
      creator: profileCreator,
      events: eventRows.map((e) => ({
        id: e.id,
        title: e.title,
        startsAt: e.startsAt.toISOString().slice(0, 10),
        city: e.city,
        ticketsSold: e.ticketsSold,
        checkinsCount: e.checkinsCount,
        eventStatus: e.eventStatus,
      })),
      pastSponsors: pastSponsorRows.map((s) => ({
        sponsorName: s.sponsorName,
        logoUrl: s.logoUrl,
        campaignTitle: s.campaignTitle,
        description: s.description,
        metrics: s.resultMetricsJsonb
          ? {
              impressions: (s.resultMetricsJsonb as { impressions?: number }).impressions,
              leads: (s.resultMetricsJsonb as { leads?: number }).leads,
              engagementRatePct: (s.resultMetricsJsonb as { engagementRatePct?: number }).engagementRatePct,
            }
          : null,
        startDate: s.startDate,
        endDate: s.endDate,
      })),
      demographics,
    };
  } catch {
    return null;
  }
}
