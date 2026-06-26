import { NextRequest, NextResponse } from "next/server";
import { createChatConnection } from "@/src/chat/repository";
import { getCurrentChatUser } from "@/src/chat/session";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentChatUser();
    const creatorId = request.nextUrl.searchParams.get("creatorId") ?? "";
    const thread = await createChatConnection(user, creatorId);
    return NextResponse.redirect(new URL(`/sponsor/inbox?thread=${thread.id}`, request.url));
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo abrir el chat";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
