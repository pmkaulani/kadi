import { NextRequest, NextResponse } from 'next/server';
import { MessagingService } from '@/lib/services/messaging-service';
import { CoHostService } from '@/lib/services/cohost-service';
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

    const { allowed } = CoHostService.assertPermission(params.eventId, session, 'view_rsvps');
    if (!allowed) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const filter = searchParams.get('filter') || 'all';

    const guests = MessagingService.getAudienceGuests(params.eventId, filter);
    const count = guests.length;
    const sampleRecipients = guests.slice(0, 10).map((g) => ({
      id: g.id,
      displayName: g.displayName,
      group: g.group,
      status: g.status,
      contact: g.contactPhone || g.contactEmail || 'No contact saved',
    }));

    return NextResponse.json({
      success: true,
      filter,
      count,
      sampleRecipients,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
