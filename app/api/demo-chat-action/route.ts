import { NextRequest, NextResponse } from "next/server";
import { acceptChatConnection, closeChatConnection } from "@/src/chat/repository";
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
  return htmlRedirect(`${path}?thread=${threadId}`);
}
