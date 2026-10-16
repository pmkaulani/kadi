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
      return NextResponse.json(
        { error: 'Unauthorized: Authentication required.' },
        { status: 401 }
      );
    }

    const event = EventService.getEventById(params.eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    // Enforce least privilege: Only roles with export_data permission (Owner, Manager, Guest Manager) can export
    const { allowed, role } = CoHostService.assertPermission(params.eventId, session, 'export_data');
    if (!allowed) {
      return NextResponse.json(
        { error: `Forbidden: Role '${role}' is not authorized to export guest RSVP data.` },
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
