import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const token = await getToken({
		req: request,
		secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;
	const role = token?.role;
	const tokenUserId = token?.id ?? token?.sub;
	const isAuthenticated = Boolean(token && tokenUserId);
	const hasValidRole = role === "creator" || role === "sponsor";

  // Rutas públicas que no requieren autenticación
	const publicRoutes = [
		"/login",
		"/creator/login",
		"/sponsor/login",
		"/creator/register",
		"/sponsor/register",
		"/",
	];

	const creatorRoutes = /^\/creator(?:\/|$)/;
	const sponsorRoutes = /^\/sponsor(?:\/|$)/;

	const isCreatorArea = creatorRoutes.test(pathname);
	const isSponsorArea = sponsorRoutes.test(pathname);

  if (publicRoutes.includes(pathname)) {
		// Si el usuario ya está logueado y entra en login/register, redirigir por rol.
		if (isAuthenticated && hasValidRole && (pathname.includes("login") || pathname.includes("register"))) {
			if (role === "creator") {
				return NextResponse.redirect(new URL("/creator/dashboard", request.url));
			}
			return NextResponse.redirect(new URL("/sponsor/discover", request.url));
		}
		return NextResponse.next();
  }

	// Si intenta acceder a una ruta protegida sin sesión válida
	if (!isAuthenticated) {
		if (isCreatorArea) {
			return NextResponse.redirect(new URL("/creator/login", request.url));
		}
		if (isSponsorArea) {
			return NextResponse.redirect(new URL("/sponsor/login", request.url));
		}
  }

	// Si hay sesión pero rol inválido/missing, forzar re-login.
	if (isAuthenticated && !hasValidRole) {
		return NextResponse.redirect(new URL("/login", request.url));
	}

	// Si el rol no corresponde al área, bloquear acceso cruzado y redirigir a su área.
	if (isCreatorArea && role !== "creator") {
		return NextResponse.redirect(new URL("/sponsor/discover", request.url));
	}

	if (isSponsorArea && role !== "sponsor") {
		return NextResponse.redirect(new URL("/creator/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
