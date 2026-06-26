import { NextRequest, NextResponse } from "next/server";
import { addChatMessage } from "@/src/chat/repository";
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
  const body = String(formData.get("body") ?? "");
  const user = await getCurrentChatUser();

  await addChatMessage(threadId, user, body);

  const path = user.role === "creator" ? "/creator/inbox" : "/sponsor/inbox";
  return htmlRedirect(`${path}?thread=${threadId}`);
}
