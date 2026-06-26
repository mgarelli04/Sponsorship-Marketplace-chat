import { NextRequest, NextResponse } from "next/server";
import { createChatConnection } from "@/src/chat/repository";
import { getCurrentChatUser } from "@/src/chat/session";

function htmlRedirect(path: string) {
  return new NextResponse(
    `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta http-equiv="refresh" content="0;url=${path}" />
  <script>window.location.replace(${JSON.stringify(path)});</script>
</head>
<body>Redirecting...</body>
</html>`,
    {
      status: 200,
      headers: { "content-type": "text/html; charset=utf-8" },
    }
  );
}

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentChatUser();
    const creatorId = request.nextUrl.searchParams.get("creatorId") ?? "";
    const thread = await createChatConnection(user, creatorId);
    return htmlRedirect(`/sponsor/inbox?thread=${thread.id}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "No se pudo abrir el chat";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
