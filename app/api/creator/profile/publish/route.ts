import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/auth/options";
import { ensureCreatorForUser } from "@/src/creator/defaults";
import { db } from "@/src/db/db";
import { creators, creatorsMediaKit } from "@/src/db/schema";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session.user.email || session.user.role !== "creator") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const creator = await ensureCreatorForUser({
      userId: session.user.id,
      email: session.user.email,
      fullName: session.user.name,
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
