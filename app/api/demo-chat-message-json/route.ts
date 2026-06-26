import { NextRequest, NextResponse } from "next/server";
import { addChatMessage } from "@/src/chat/repository";
import { getCurrentChatUser } from "@/src/chat/session";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const threadId = String(formData.get("threadId") ?? "");
    const body = String(formData.get("body") ?? "");
    const user = await getCurrentChatUser();

    const message = await addChatMessage(threadId, user, body);

    return NextResponse.json({ ok: true, message });
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo enviar el mensaje";
    return NextResponse.json({ ok: false, error: message }, { status: 400 });
  }
}
