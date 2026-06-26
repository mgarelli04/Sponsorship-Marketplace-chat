import { NextResponse } from "next/server";
import { createChatConnection, listChatThreads } from "@/src/chat/repository";
import { getCurrentChatUser } from "@/src/chat/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getCurrentChatUser();
    const threads = await listChatThreads(user);
    return NextResponse.json({ threads });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentChatUser();
    const body = await request.json();
    const creatorId = typeof body.creatorId === "string" ? body.creatorId : "";
    const thread = await createChatConnection(user, creatorId);
    return NextResponse.json({ thread });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 400 });
  }
}
