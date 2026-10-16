import { NextRequest, NextResponse } from 'next/server';
import { RSVPService } from '@/lib/services/rsvp-service';
import { EventService } from '@/lib/services/event-service';
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

    const event = EventService.getEventById(params.eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    const { allowed, role } = CoHostService.assertPermission(params.eventId, session, 'view_rsvps');
    if (!allowed) {
      return NextResponse.json({ error: `Forbidden: Role '${role}' cannot view RSVP responses.` }, { status: 403 });
    }

    const submissions = RSVPService.listRSVPs(params.eventId);
    const summary = RSVPService.getRSVPSummary(params.eventId);
    return NextResponse.json({ success: true, submissions, summary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
