import { NextRequest, NextResponse } from 'next/server';
import { MessagingService } from '@/lib/services/messaging-service';
import { getAuthSession } from '@/lib/auth/session';

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    const notifications = MessagingService.listInAppNotifications(session.id, params.eventId);
    const unreadCount = notifications.filter((n) => !n.read).length;

    return NextResponse.json({
      success: true,
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest
) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    const body = await req.json();
    const { notificationId } = body;

    if (!notificationId) {
      return NextResponse.json({ error: 'notificationId is required.' }, { status: 400 });
    }

    const success = MessagingService.markNotificationRead(notificationId);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
