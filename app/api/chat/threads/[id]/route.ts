import { NextResponse } from "next/server";
import { getChatThreadForUser } from "@/src/chat/repository";
import { getCurrentChatUser } from "@/src/chat/session";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentChatUser();
    const { id } = await params;
    const thread = await getChatThreadForUser(id, user);
    return NextResponse.json({ thread });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: message === "Unauthorized" ? 401 : 404 });
  }
}
