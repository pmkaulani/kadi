import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE_NAME, isEdgeSessionPresent, getEdgeSessionPayload } from '@/lib/auth/edge-session';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public access to creating/customizing invitations and browsing templates
  const isPublicAppRoute =
    pathname.startsWith('/app/events/new') ||
    pathname.startsWith('/app/templates');

  if (isPublicAppRoute) {
    return NextResponse.next();
  }

  // Protect private host dashboard & event management routes server-side
  if (pathname.startsWith('/app')) {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const isValid = isEdgeSessionPresent(token);

    if (!isValid) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protect /admin routes server-side (Fail Closed: requires admin role)
  if (pathname.startsWith('/admin')) {
    const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = getEdgeSessionPayload(token);

    if (!session) {
      const loginUrl = new URL('/login', req.url);
      loginUrl.searchParams.set('from', pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (session.role !== 'admin') {
      const appUrl = new URL('/app/events', req.url);
      appUrl.searchParams.set('auth_error', 'admin_required');
      return NextResponse.redirect(appUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/app/:path*', '/admin/:path*'],
};

