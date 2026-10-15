import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, isEdgeSessionPresent } from '@/lib/auth/edge-session';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /app routes server-side
  if (pathname.startsWith('/app')) {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const isValid = isEdgeSessionPresent(token);

    if (!isValid) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*'],
};
