import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentChatUser } from "@/src/chat/session";
import { ensureCreatorForUser } from "@/src/creator/defaults";
import { db } from "@/src/db/db";
import { creators, creatorsMediaKit } from "@/src/db/schema";

export async function POST() {
  try {
    const user = await getCurrentChatUser().catch(() => null);

    if (!user || user.role !== "creator" || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const creator = await ensureCreatorForUser({
      userId: user.id,
      email: user.email,
      fullName: user.name,
    });
    const now = new Date();

    await db.transaction(async (tx) => {
      await tx
        .update(creators)
        .set({
          profileStatus: "published",
          onboardingStatus: "completed",
          updatedAt: now,
        })
        .where(eq(creators.id, creator.id));

      await tx
        .update(creatorsMediaKit)
        .set({
          isPublic: true,
          publishedAt: now,
          updatedAt: now,
          lastContentUpdateAt: now,
        })
        .where(eq(creatorsMediaKit.creatorId, creator.id));
    });

    return NextResponse.json({
      creatorId: creator.id,
      profileStatus: "published",
      mediaKitPublic: true,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
