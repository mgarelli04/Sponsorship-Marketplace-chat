import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Proxy base requerido por Next.js. De momento no altera la peticion.
export function proxy(request: NextRequest) {
	// TODO: Protección de rutas - descomentar para activar
	/*
	const pathname = request.nextUrl.pathname;
	const protectedRoutes = ['/creator/dashboard', '/sponsor/discover', '/sponsor/saved'];
	
	if (protectedRoutes.includes(pathname)) {
		const token = request.cookies.get('next-auth.session-token')?.value;
		if (!token) {
			return NextResponse.redirect(new URL('/login', request.url));
		}
	}
	*/
	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
