import { NextRequest, NextResponse } from "next/server";
import { addChatMessage } from "@/src/chat/repository";
import { getCurrentChatUser } from "@/src/chat/session";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const threadId = String(formData.get("threadId") ?? "");
  const body = String(formData.get("body") ?? "");
  const user = await getCurrentChatUser();

  await addChatMessage(threadId, user, body);

  const path = user.role === "creator" ? "/creator/inbox" : "/sponsor/inbox";
  return NextResponse.redirect(new URL(`${path}?thread=${threadId}`, request.url), 303);
}
