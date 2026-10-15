import { NextRequest, NextResponse } from 'next/server';
import { EventService } from '@/lib/services/event-service';
import { getAuthSession } from '@/lib/auth/session';

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
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Strict ownership verification
    if (event.hostId !== session.id) {
      return NextResponse.json({ error: 'Forbidden: You do not own this event.' }, { status: 403 });
    }

    const published = EventService.publishEvent(params.eventId);
    return NextResponse.json({ success: true, event: published });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
