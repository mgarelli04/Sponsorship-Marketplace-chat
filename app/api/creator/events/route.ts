import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/src/auth/options";
import { ensureCreatorForUser } from "@/src/creator/defaults";
import {
  buildEventMutationValues,
  categoryExists,
  getCreatorEventsData,
  touchCreatorEventContent,
  validateCreatorEventPayload,
} from "@/src/creator/events";
import { db } from "@/src/db/db";
import { events } from "@/src/db/schema";

async function getCreatorSession() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id || !session.user.email || session.user.role !== "creator") {
    return null;
  }

  return {
    userId: session.user.id,
    email: session.user.email,
    fullName: session.user.name,
  };
}

export async function GET() {
  const creatorSession = await getCreatorSession();

  if (!creatorSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getCreatorEventsData(creatorSession);

  return NextResponse.json({
    events: data.events,
    categories: data.categories,
    creator: data.creator,
  });
}

export async function POST(request: Request) {
  try {
    const creatorSession = await getCreatorSession();

    if (!creatorSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const parsed = validateCreatorEventPayload(await request.json());

    if (!parsed.ok) {
      return NextResponse.json({ error: "Validation failed", details: parsed.errors }, { status: 400 });
    }

    if (!(await categoryExists(parsed.data.categoryId))) {
      return NextResponse.json({ error: "Selected category does not exist" }, { status: 400 });
    }

    const creator = await ensureCreatorForUser(creatorSession);
    const [event] = await db
      .insert(events)
      .values({
        ...buildEventMutationValues(creator.id, parsed.data),
        importedAt: new Date(),
      })
      .returning();

    await touchCreatorEventContent(creator.id);

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
