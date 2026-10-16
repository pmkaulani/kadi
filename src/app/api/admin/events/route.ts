import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth/session';
import { AdminService, UnauthorizedAdminError } from '@/lib/services/admin-service';

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    AdminService.requireAdminRole(session);

    const events = AdminService.listAllEvents();
    return NextResponse.json({
      events: events.map((e) => ({
        id: e.id,
        title: e.title,
        hostId: e.hostId,
        slug: e.slug,
        category: e.category,
        status: e.status,
        visibility: e.visibility || 'private',
        moderationStatus: e.moderationStatus || 'active',
        moderationReason: e.moderationReason,
        moderatedAt: e.moderatedAt,
        moderatedBy: e.moderatedBy,
        date: e.date,
        pageViews: e.pageViews || 0,
      })),
    });
  } catch (err: any) {
    if (err instanceof UnauthorizedAdminError) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Administrative role required to access this resource.' },
        { status: 403 }
      );
    }
    return NextResponse.json({ error: 'Server error', message: err.message }, { status: 500 });
  }
}
