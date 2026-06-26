import { NextRequest, NextResponse } from "next/server";
import { acceptChatConnection, closeChatConnection } from "@/src/chat/repository";
import { getCurrentChatUser } from "@/src/chat/session";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const threadId = String(formData.get("threadId") ?? "");
  const action = String(formData.get("action") ?? "");
  const user = await getCurrentChatUser();

  if (action === "accept") {
    await acceptChatConnection(threadId, user);
  }

  if (action === "close") {
    await closeChatConnection(threadId, user);
  }

  const path = user.role === "creator" ? "/creator/inbox" : "/sponsor/inbox";
  return NextResponse.redirect(new URL(`${path}?thread=${threadId}`, request.url), 303);
}
