import { NextResponse } from "next/server";
import { listChatThreads } from "@/src/chat/repository";
import { getCurrentChatUser } from "@/src/chat/session";

export async function GET() {
  try {
    const user = await getCurrentChatUser();
    const threads = await listChatThreads(user);

    const signature = threads
      .map((thread) => [thread.id, thread.status].join(":"))
      .join("|");

    return NextResponse.json({
      ok: true,
      userId: user.id,
      role: user.role,
      signature,
      threads,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudieron cargar las conversaciones";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
