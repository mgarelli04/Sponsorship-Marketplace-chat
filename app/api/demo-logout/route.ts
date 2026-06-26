import { NextResponse } from "next/server";

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

export async function GET() {
  const response = htmlRedirect("/login");

  const cookieOptions = {
    path: "/",
    maxAge: 0,
  };

  response.cookies.set("next-auth.session-token", "", cookieOptions);
  response.cookies.set("__Secure-next-auth.session-token", "", cookieOptions);
  response.cookies.set("next-auth.csrf-token", "", cookieOptions);
  response.cookies.set("__Host-next-auth.csrf-token", "", cookieOptions);
  response.cookies.set("next-auth.callback-url", "", cookieOptions);
  response.cookies.set("__Secure-next-auth.callback-url", "", cookieOptions);
  response.cookies.set("demo-user-id", "", cookieOptions);
  response.cookies.set("demo-role", "", cookieOptions);

  return response;
}
