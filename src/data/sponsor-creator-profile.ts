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

function normalizePercent(value: unknown) {
  const parsed = toNumber(value);
  return Math.max(0, Math.min(100, Math.round(parsed)));
}

function normalizeBreakdown(
  value: unknown,
  labelKeys: string[],
  valueKeys: string[],
): { label: string; value: number }[] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const label = labelKeys
        .map((key) => record[key])
        .find((candidate): candidate is string => typeof candidate === "string" && candidate.trim().length > 0);
      const percent = valueKeys
        .map((key) => record[key])
        .find((candidate) => candidate !== undefined && candidate !== null);

      if (!label) return null;

      return {
        label,
        value: normalizePercent(percent),
      };
    })
    .filter((item): item is { label: string; value: number } => item !== null);
}

function normalizeInterests(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }

  if (!value || typeof value !== "object") return [];

  const interests = (value as { interests?: unknown }).interests;
  return Array.isArray(interests)
    ? interests.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
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
      db
        .select()
        .from(events)
        .where(and(eq(events.creatorId, id), inArray(events.eventStatus, ["upcoming", "past"])))
        .limit(20),
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
    const latestSnapshot = snapshotRows[0] ?? null;
    const snapshotInterests = normalizeInterests(latestSnapshot?.interestsJsonb);

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
      interests: snapshotInterests,
      audienceTypes: [],
      packages: creatorPackages,
    };

    const demographics = latestSnapshot
      ? {
          ageGroups: normalizeBreakdown(
            (latestSnapshot.demographicsJsonb as { ageGroups?: unknown })?.ageGroups,
            ["label", "name", "age"],
            ["value", "percentage", "pct"],
          ),
          gender: normalizeBreakdown(
            (latestSnapshot.demographicsJsonb as { gender?: unknown })?.gender,
            ["label", "name", "gender"],
            ["value", "percentage", "pct"],
          ),
          topLocations: normalizeBreakdown(
            (latestSnapshot.topLocationsJsonb as { locations?: unknown })?.locations,
            ["city", "label", "name"],
            ["percentage", "pct", "value"],
          ).map((location) => ({
            city: location.label,
            percentage: location.value,
          })),
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
