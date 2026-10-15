import { NextRequest, NextResponse } from 'next/server';
import { GuestService } from '@/lib/services/guest-service';
import { EventService } from '@/lib/services/event-service';
import { getAuthSession } from '@/lib/auth/session';
import { GuestImportPayloadSchema } from '@/lib/validation/events';

export async function POST(
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

    if (event.hostId !== session.id) {
      return NextResponse.json({ error: 'Forbidden: You do not own this event.' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = GuestImportPayloadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid guest import data.' },
        { status: 400 }
      );
    }

    const result = GuestService.importGuests(params.eventId, parsed.data.rows);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
