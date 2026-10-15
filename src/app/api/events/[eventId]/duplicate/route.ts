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

    const original = EventService.getEventById(params.eventId);
    if (!original) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    // Strict ownership verification: cannot duplicate another user's private event
    if (original.hostId !== session.id) {
      return NextResponse.json({ error: 'Forbidden: You do not own this event.' }, { status: 403 });
    }

    // Duplicates as a clean draft owned by current user without copying RSVPs/guest tokens
    const duplicated = EventService.duplicateEvent(params.eventId, session.id);
    return NextResponse.json({ success: true, event: duplicated }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
