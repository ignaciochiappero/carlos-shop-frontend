import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Verifica si existe el token en las cookies
  const token = request.cookies.get('access_token')?.value;
  
  // Si no hay token y la ruta es /profile, redirige a login
  if (!token && request.nextUrl.pathname.startsWith('/profile')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

// Configura en qué rutas se aplica este middleware
export const config = {
  matcher: '/profile/:path*',
};