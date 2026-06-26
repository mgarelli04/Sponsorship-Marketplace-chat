import { NextRequest, NextResponse } from "next/server";
import { getChatThreadForUser } from "@/src/chat/repository";
import { getCurrentChatUser } from "@/src/chat/session";

export async function GET(request: NextRequest) {
  try {
    const threadId = request.nextUrl.searchParams.get("threadId") ?? "";
    const user = await getCurrentChatUser();
    const thread = await getChatThreadForUser(threadId, user);
    return NextResponse.json({ ok: true, thread, userId: user.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo cargar el thread";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
