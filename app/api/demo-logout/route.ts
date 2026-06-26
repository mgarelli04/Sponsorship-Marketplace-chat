import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));

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
