import { NextRequest, NextResponse } from 'next/server';
import { RSVPService } from '@/lib/services/rsvp-service';
import { EventService } from '@/lib/services/event-service';
import { getAuthSession } from '@/lib/auth/session';

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required.' },
        { status: 401 }
      );
    }

    const event = EventService.getEventById(params.eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    // Strict host authorization: Only the verified owner can export guest RSVP data
    if (event.hostId !== session.id) {
      return NextResponse.json(
        { error: 'Forbidden: You do not own this event.' },
        { status: 403 }
      );
    }

    // Safe CSV content with formula injection mitigation
    const csvContent = RSVPService.exportRSVPsCSV(params.eventId);

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="kadi-rsvps-${event.slug || params.eventId}.csv"`,
        'Cache-Control': 'no-store, max-age=0',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
