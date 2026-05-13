import { eq } from "drizzle-orm";
import { db } from "@/src/db/db";
import { creators, creatorsMediaKit, profiles } from "@/src/db/schema";

type CreatorUserInput = {
  userId: string;
  email: string;
  fullName?: string | null;
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

export function buildCreatorSlug(input: CreatorUserInput) {
  const fallbackName = input.email.split("@")[0] || "creator";
  const baseSlug = slugify(input.fullName || fallbackName) || "creator";
  return `${baseSlug}-${input.userId.slice(0, 8)}`;
}

export async function ensureCreatorForUser(input: CreatorUserInput) {
  const displayName = input.fullName?.trim() || input.email.split("@")[0] || "Creator";

  await db
    .insert(profiles)
    .values({
      id: input.userId,
      email: input.email,
      fullName: displayName,
      avatarUrl: "",
      phone: "",
      role: "creator",
      status: "active",
    })
    .onConflictDoNothing();

  const existingCreator = await db
    .select()
    .from(creators)
    .where(eq(creators.createdByUserId, input.userId))
    .limit(1);

  if (existingCreator[0]) {
    return existingCreator[0];
  }

  const slug = buildCreatorSlug({ ...input, fullName: displayName });

  const [creator] = await db.transaction(async (tx) => {
    const insertedCreators = await tx
      .insert(creators)
      .values({
        creatorType: "organizer",
        displayName,
        legalName: null,
        slug,
        tagline: `${displayName} is preparing a sponsor-ready media kit.`,
        websiteUrl: "",
        linkedinUrl: "",
        instagramUrl: "",
        contactEmail: input.email,
        countryCode: "ES",
        region: "",
        city: "",
        addressLine: null,
        latitude: null,
        longitude: null,
        onboardingStatus: "in_progress",
        profileStatus: "draft",
        verificationStatus: "unverified",
        responseTimeHours: null,
        createdByUserId: input.userId,
      })
      .returning();

    const created = insertedCreators[0];

    await tx.insert(creatorsMediaKit).values({
      creatorId: created.id,
      headline: `${displayName} media kit`,
      shortDescription: `${displayName} is building a media kit for sponsors.`,
      aboutText:
        "Add your creator story, audience profile, events, and sponsor opportunities here.",
      missionText: "Create valuable sponsorship opportunities for aligned brands.",
      whyPartnerText:
        "Partners will see the available sponsorship inventory, packages, and audience data here.",
      audienceSummaryText:
        "Audience data will appear after events, snapshots, or integrations are added.",
      isPublic: false,
      publishedAt: null,
      lastContentUpdateAt: new Date(),
    });

    return insertedCreators;
  });

  return creator;
}
