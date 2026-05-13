import { and, desc, eq } from "drizzle-orm";
import { ensureCreatorForUser } from "@/src/creator/defaults";
import { db } from "@/src/db/db";
import {
  audienceSnapshots,
  categories,
  creatorCategories,
  creatorPastSponsors,
  creatorsAssets,
  creatorsMediaKit,
  events,
  inventoryItems,
  packageItems,
  packages,
  profiles,
  sponsorCompanies,
  sponsorshipInquiries,
} from "@/src/db/schema";

type CreatorUserInput = {
  userId: string;
  email: string;
  fullName?: string | null;
};

type CreatorRecord = Awaited<ReturnType<typeof ensureCreatorForUser>>;
type MediaKitRecord = typeof creatorsMediaKit.$inferSelect;
type InventoryItemRecord = typeof inventoryItems.$inferSelect;
type PackageRecord = typeof packages.$inferSelect;

function isFilled(value: unknown) {
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

function calculateMediaKitScore(input: {
  creator: CreatorRecord;
  mediaKit?: MediaKitRecord | null;
  assetCount: number;
  packageCount: number;
  eventCount: number;
  audienceSnapshotCount: number;
}) {
  const checks = [
    isFilled(input.creator.displayName),
    isFilled(input.creator.tagline),
    isFilled(input.creator.contactEmail),
    isFilled(input.creator.city) || isFilled(input.creator.region),
    isFilled(input.mediaKit?.headline),
    isFilled(input.mediaKit?.aboutText),
    isFilled(input.mediaKit?.whyPartnerText),
    input.assetCount > 0,
    input.packageCount > 0,
    input.eventCount > 0,
    input.audienceSnapshotCount > 0,
  ];

  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

export async function getCreatorDashboardData(input: CreatorUserInput) {
  const creator = await ensureCreatorForUser(input);

  const [
    profileRows,
    mediaKitRows,
    assetRows,
    eventRows,
    audienceRows,
    packageRows,
    inquiryRows,
  ] = await Promise.all([
    db.select().from(profiles).where(eq(profiles.id, input.userId)).limit(1),
    db
      .select()
      .from(creatorsMediaKit)
      .where(eq(creatorsMediaKit.creatorId, creator.id))
      .limit(1),
    db.select().from(creatorsAssets).where(eq(creatorsAssets.creatorId, creator.id)),
    db
      .select()
      .from(events)
      .where(eq(events.creatorId, creator.id))
      .orderBy(desc(events.startsAt))
      .limit(5),
    db
      .select()
      .from(audienceSnapshots)
      .where(eq(audienceSnapshots.creatorId, creator.id))
      .orderBy(desc(audienceSnapshots.snapshotDate))
      .limit(1),
    db
      .select()
      .from(packages)
      .where(eq(packages.creatorId, creator.id))
      .orderBy(packages.sortOrder),
    db
      .select({
        inquiry: sponsorshipInquiries,
        sponsor: sponsorCompanies,
        package: packages,
      })
      .from(sponsorshipInquiries)
      .leftJoin(
        sponsorCompanies,
        eq(sponsorshipInquiries.sponsorCompanyId, sponsorCompanies.id),
      )
      .leftJoin(packages, eq(sponsorshipInquiries.packageId, packages.id))
      .where(eq(sponsorshipInquiries.creatorId, creator.id))
      .orderBy(desc(sponsorshipInquiries.createdAt))
      .limit(5),
  ]);

  const totalAudience = audienceRows[0]?.totalAttendees ?? 0;
  const activeLeads = inquiryRows.filter(({ inquiry }) =>
    ["pending", "negotiating"].includes(inquiry.status),
  ).length;
  const closedDeals = inquiryRows.filter(({ inquiry }) => inquiry.status === "closed_won").length;
  const revenueWon = inquiryRows.reduce((total, { inquiry }) => {
    if (inquiry.status !== "closed_won") {
      return total;
    }

    return total + Number(inquiry.budgetMax ?? inquiry.budgetMin ?? 0);
  }, 0);

  return {
    creator,
    profile: profileRows[0] ?? null,
    mediaKit: mediaKitRows[0] ?? null,
    stats: {
      totalAudience,
      activeLeads,
      closedDeals,
      revenueWon,
      mediaKitScore: calculateMediaKitScore({
        creator,
        mediaKit: mediaKitRows[0] ?? null,
        assetCount: assetRows.length,
        packageCount: packageRows.length,
        eventCount: eventRows.length,
        audienceSnapshotCount: audienceRows.length,
      }),
    },
    recentInquiries: inquiryRows,
    recentEvents: eventRows,
    packages: packageRows,
  };
}

export async function getCreatorMediaKitData(input: CreatorUserInput) {
  const creator = await ensureCreatorForUser(input);

  const [
    mediaKitRows,
    assetRows,
    categoryRows,
    eventRows,
    audienceRows,
    sponsorRows,
    inventoryRows,
    packageRows,
  ] = await Promise.all([
    db
      .select()
      .from(creatorsMediaKit)
      .where(eq(creatorsMediaKit.creatorId, creator.id))
      .limit(1),
    db
      .select()
      .from(creatorsAssets)
      .where(eq(creatorsAssets.creatorId, creator.id))
      .orderBy(creatorsAssets.sortOrder),
    db
      .select({ category: categories, relation: creatorCategories })
      .from(creatorCategories)
      .innerJoin(categories, eq(creatorCategories.categoryId, categories.id))
      .where(eq(creatorCategories.creatorId, creator.id)),
    db
      .select()
      .from(events)
      .where(eq(events.creatorId, creator.id))
      .orderBy(desc(events.startsAt))
      .limit(6),
    db
      .select()
      .from(audienceSnapshots)
      .where(
        and(
          eq(audienceSnapshots.creatorId, creator.id),
          eq(audienceSnapshots.snapshotScope, "creator"),
        ),
      )
      .orderBy(desc(audienceSnapshots.snapshotDate))
      .limit(1),
    db
      .select()
      .from(creatorPastSponsors)
      .where(eq(creatorPastSponsors.creatorId, creator.id))
      .orderBy(desc(creatorPastSponsors.createdAt))
      .limit(6),
    db
      .select()
      .from(inventoryItems)
      .where(eq(inventoryItems.creatorId, creator.id))
      .orderBy(inventoryItems.createdAt),
    db
      .select({
        package: packages,
        item: inventoryItems,
        packageItem: packageItems,
      })
      .from(packages)
      .leftJoin(packageItems, eq(packageItems.packageId, packages.id))
      .leftJoin(inventoryItems, eq(packageItems.inventoryItemId, inventoryItems.id))
      .where(eq(packages.creatorId, creator.id))
      .orderBy(packages.sortOrder),
  ]);

  const packagesById = new Map<
    string,
    { package: PackageRecord; items: InventoryItemRecord[] }
  >();

  for (const row of packageRows) {
    const existing = packagesById.get(row.package.id) ?? {
      package: row.package,
      items: [],
    };

    if (row.item) {
      existing.items.push(row.item);
    }

    packagesById.set(row.package.id, existing);
  }

  return {
    creator,
    mediaKit: mediaKitRows[0] ?? null,
    assets: assetRows,
    categories: categoryRows,
    events: eventRows,
    audienceSnapshot: audienceRows[0] ?? null,
    pastSponsors: sponsorRows,
    inventoryItems: inventoryRows,
    packages: Array.from(packagesById.values()),
  };
}
