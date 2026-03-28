import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Proxy base requerido por Next.js. De momento no altera la peticion.
export function proxy(_request: NextRequest) {
	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
