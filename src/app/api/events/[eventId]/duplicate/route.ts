import { NextRequest, NextResponse } from 'next/server';
import { EventService } from '@/lib/services/event-service';
import { CoHostService } from '@/lib/services/cohost-service';
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

    const { allowed, role } = CoHostService.assertPermission(params.eventId, session, 'manage_event');
    if (!allowed) {
      return NextResponse.json(
        { error: `Forbidden: Role '${role}' cannot duplicate this event.` },
        { status: 403 }
      );
    }

    let copyDates = true;
    try {
      const body = await req.json();
      if (body.copyDates !== undefined) {
        copyDates = Boolean(body.copyDates);
      }
    } catch {
      // Body may be empty
    }

    // Duplicates as a clean draft owned by current user without copying RSVPs/guest tokens/check-ins
    const duplicated = EventService.duplicateEvent(params.eventId, {
      newHostId: session.id,
      copyDates,
    });
    return NextResponse.json({ success: true, event: duplicated }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
