import "server-only";

import { and, asc, eq, inArray } from "drizzle-orm";
import {
  audienceSnapshots,
  categories,
  creatorCategories,
  creatorInterests,
  creatorPastSponsors,
  creators,
  events,
  interests,
  packages,
} from "@/src/db/schema";
import type {
  AudienceType,
  CreatorPackage,
  DiscoverData,
  MarketplaceCreator,
} from "@/src/data/sponsor-marketplace";

const DEFAULT_EMPTY_DATA: DiscoverData = {
  creators: [],
  categories: [],
  sourceStatus: "missing-env",
  sourceMessage: "DATABASE_URL o SUPABASE_DATABASE_URL no esta configurada.",
};

function toNumber(value: unknown, fallback = 0) {
  if (value === null || value === undefined) {
    return fallback;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join("") || "SH";
}

function normalizePackageTier(value: string): CreatorPackage["tier"] {
  if (value === "silver") {
    return "Silver";
  }

  if (value === "gold") {
    return "Gold";
  }

  return "Bronze";
}

function inferAudienceTypes(category: string, creatorInterestsList: string[]): AudienceType[] {
  const searchableText = [category, ...creatorInterestsList].join(" ").toLowerCase();
  const hasB2BSignals = ["tech", "conference", "education", "saas", "venture", "policy", "cloud"].some((term) =>
    searchableText.includes(term),
  );
  const hasB2CSignals = ["festival", "food", "wellness", "music", "nightlife", "fitness", "culture"].some((term) =>
    searchableText.includes(term),
  );

  if (hasB2BSignals && hasB2CSignals) {
    return ["B2B", "B2C"];
  }

  if (hasB2BSignals) {
    return ["B2B"];
  }

  return ["B2C"];
}

function getConnectionString() {
  return process.env.DATABASE_URL ?? process.env.SUPABASE_DATABASE_URL;
}

export async function getSponsorDiscoverData(): Promise<DiscoverData> {
  if (!getConnectionString()) {
    return DEFAULT_EMPTY_DATA;
  }

  try {
    const { db } = await import("@/src/db/db");

    const [creatorRows, categoryRows] = await Promise.all([
      db.select().from(creators).where(eq(creators.profileStatus, "published")),
      db.select().from(categories).where(eq(categories.isActive, true)).orderBy(asc(categories.name)),
    ]);

    if (creatorRows.length === 0) {
      return {
        creators: [],
        categories: categoryRows.map((category) => category.name),
        sourceStatus: "connected",
      };
    }

    const creatorIds = creatorRows.map((creator) => creator.id);

    const [creatorCategoryRows, creatorInterestRows, packageRows] = await Promise.all([
      db
        .select({
          creatorId: creatorCategories.creatorId,
          categoryName: categories.name,
          isPrimary: creatorCategories.isPrimary,
        })
        .from(creatorCategories)
        .innerJoin(categories, eq(creatorCategories.categoryId, categories.id))
        .where(inArray(creatorCategories.creatorId, creatorIds)),
      db
        .select({
          creatorId: creatorInterests.creatorId,
          interestName: interests.name,
          weight: creatorInterests.weight,
        })
        .from(creatorInterests)
        .innerJoin(interests, eq(creatorInterests.interestId, interests.id))
        .where(inArray(creatorInterests.creatorId, creatorIds)),
      db
        .select({
          creatorId: packages.creatorId,
          packageType: packages.packageType,
          priceAmount: packages.priceAmount,
          estimatedImpressions: packages.estimatedImpressions,
          estimatedReach: packages.estimatedReach,
          estimatedCpm: packages.estimatedCpm,
          description: packages.description,
        })
        .from(packages)
        .where(and(inArray(packages.creatorId, creatorIds), eq(packages.isPublic, true)))
        .orderBy(asc(packages.sortOrder)),
    ]);

    const [snapshotResult, eventResult, pastSponsorResult] = await Promise.allSettled([
      db
        .select({
          creatorId: audienceSnapshots.creatorId,
          snapshotDate: audienceSnapshots.snapshotDate,
          totalAttendees: audienceSnapshots.totalAttendees,
          totalTicketsSold: audienceSnapshots.totalTicketsSold,
          totalCheckins: audienceSnapshots.totalCheckins,
          repeatAttendancePct: audienceSnapshots.repeatAttendancePct,
        })
        .from(audienceSnapshots)
        .where(inArray(audienceSnapshots.creatorId, creatorIds)),
      db
        .select({
          creatorId: events.creatorId,
          ticketsSold: events.ticketsSold,
          checkinsCount: events.checkinsCount,
        })
        .from(events)
        .where(inArray(events.creatorId, creatorIds)),
      db
        .select({
          creatorId: creatorPastSponsors.creatorId,
          sponsorName: creatorPastSponsors.sponsorName,
        })
        .from(creatorPastSponsors)
        .where(inArray(creatorPastSponsors.creatorId, creatorIds)),
    ]);

    const snapshotRows = snapshotResult.status === "fulfilled" ? snapshotResult.value : [];
    const eventRows = eventResult.status === "fulfilled" ? eventResult.value : [];
    const pastSponsorRows = pastSponsorResult.status === "fulfilled" ? pastSponsorResult.value : [];

    const categoriesByCreator = new Map<string, string[]>();
    for (const row of creatorCategoryRows) {
      const current = categoriesByCreator.get(row.creatorId) ?? [];
      if (row.isPrimary) {
        categoriesByCreator.set(row.creatorId, [row.categoryName, ...current.filter((name) => name !== row.categoryName)]);
      } else {
        current.push(row.categoryName);
        categoriesByCreator.set(row.creatorId, current);
      }
    }

    const interestsByCreator = new Map<string, string[]>();
    for (const row of creatorInterestRows.sort((a, b) => toNumber(b.weight) - toNumber(a.weight))) {
      const current = interestsByCreator.get(row.creatorId) ?? [];
      current.push(row.interestName);
      interestsByCreator.set(row.creatorId, current);
    }

    const packagesByCreator = new Map<string, CreatorPackage[]>();
    for (const row of packageRows) {
      const current = packagesByCreator.get(row.creatorId) ?? [];
      current.push({
        tier: normalizePackageTier(row.packageType),
        price: toNumber(row.priceAmount),
        impressions: row.estimatedImpressions ?? 0,
        reach: row.estimatedReach ?? 0,
        cpm: toNumber(row.estimatedCpm),
        benefits: row.description ? [row.description] : [],
        items: [],
      });
      packagesByCreator.set(row.creatorId, current);
    }

    const latestSnapshotByCreator = new Map<string, (typeof snapshotRows)[number]>();
    for (const row of snapshotRows) {
      if (!row.creatorId) {
        continue;
      }

      const current = latestSnapshotByCreator.get(row.creatorId);
      if (!current || row.snapshotDate > current.snapshotDate) {
        latestSnapshotByCreator.set(row.creatorId, row);
      }
    }

    const eventsByCreator = new Map<string, (typeof eventRows)>();
    for (const row of eventRows) {
      const current = eventsByCreator.get(row.creatorId) ?? [];
      current.push(row);
      eventsByCreator.set(row.creatorId, current);
    }

    const sponsorsByCreator = new Map<string, string[]>();
    for (const row of pastSponsorRows) {
      const current = sponsorsByCreator.get(row.creatorId) ?? [];
      current.push(row.sponsorName);
      sponsorsByCreator.set(row.creatorId, current);
    }

    const discoverCreators: MarketplaceCreator[] = creatorRows.map((creator) => {
      const creatorCategoriesList = categoriesByCreator.get(creator.id) ?? [];
      const primaryCategory = creatorCategoriesList[0] ?? "Uncategorized";
      const creatorInterestsList = interestsByCreator.get(creator.id) ?? [];
      const creatorPackages = packagesByCreator.get(creator.id) ?? [];
      const snapshot = latestSnapshotByCreator.get(creator.id);
      const creatorEvents = eventsByCreator.get(creator.id) ?? [];
      const eventAudience = creatorEvents.reduce(
        (max, event) => Math.max(max, event.ticketsSold, event.checkinsCount),
        0,
      );
      const audienceSize = snapshot?.totalAttendees ?? eventAudience;
      const totalTickets = snapshot?.totalTicketsSold ?? creatorEvents.reduce((sum, event) => sum + event.ticketsSold, 0);
      const totalCheckins = snapshot?.totalCheckins ?? creatorEvents.reduce((sum, event) => sum + event.checkinsCount, 0);
      const checkInRate = totalTickets > 0 ? Math.round((totalCheckins / totalTickets) * 100) : 0;
      const returningAttendees = Math.round(toNumber(snapshot?.repeatAttendancePct));
      const verified = creator.verificationStatus === "verified";

      return {
        id: creator.id,
        logo: initials(creator.displayName),
        name: creator.displayName,
        tagline: creator.tagline,
        location: [creator.city, creator.region].filter(Boolean).join(", "),
        city: creator.city,
        region: creator.region,
        country: creator.countryCode,
        category: primaryCategory,
        audienceSize,
        matchScore: 0,
        verified,
        audienceTypes: inferAudienceTypes(primaryCategory, creatorInterestsList),
        interests: creatorInterestsList,
        returningAttendees,
        checkInRate,
        responseTimeHours: creator.responseTimeHours ?? 48,
        lastUpdated: creator.updatedAt.toISOString().slice(0, 10),
        previousSponsors: sponsorsByCreator.get(creator.id) ?? [],
        packages: creatorPackages,
      };
    });

    return {
      creators: discoverCreators,
      categories: categoryRows.map((category) => category.name),
      sourceStatus: "connected",
    };
  } catch (error) {
    return {
      creators: [],
      categories: [],
      sourceStatus: "query-error",
      sourceMessage: error instanceof Error ? error.message : "No se pudo cargar Discover desde la base de datos.",
    };
  }
}
