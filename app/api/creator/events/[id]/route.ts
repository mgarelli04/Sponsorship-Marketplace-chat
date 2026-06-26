import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentChatUser } from "@/src/chat/session";
import { ensureCreatorForUser } from "@/src/creator/defaults";
import {
  buildEventMutationValues,
  categoryExists,
  touchCreatorEventContent,
  validateCreatorEventPayload,
} from "@/src/creator/events";
import { db } from "@/src/db/db";
import { events } from "@/src/db/schema";

async function getCreatorSession() {
  const user = await getCurrentChatUser().catch(() => null);

  if (!user || user.role !== "creator" || !user.email) {
    return null;
  }

  return {
    userId: user.id,
    email: user.email,
    fullName: user.name,
  };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
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

    const { id } = await params;
    const creator = await ensureCreatorForUser(creatorSession);
    const [event] = await db
      .update(events)
      .set(buildEventMutationValues(creator.id, parsed.data))
      .where(and(eq(events.id, id), eq(events.creatorId, creator.id)))
      .returning();

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await touchCreatorEventContent(creator.id);

    return NextResponse.json({ event });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const creatorSession = await getCreatorSession();

    if (!creatorSession) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const creator = await ensureCreatorForUser(creatorSession);
    const [deletedEvent] = await db
      .delete(events)
      .where(and(eq(events.id, id), eq(events.creatorId, creator.id)))
      .returning({ id: events.id });

    if (!deletedEvent) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    await touchCreatorEventContent(creator.id);

    return NextResponse.json({ id: deletedEvent.id });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
