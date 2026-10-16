import { NextRequest, NextResponse } from 'next/server';
import { EventService } from '@/lib/services/event-service';
import { RSVPService } from '@/lib/services/rsvp-service';
import { CoHostService } from '@/lib/services/cohost-service';
import { getAuthSession } from '@/lib/auth/session';
import { UpdateEventSchema } from '@/lib/validation/events';

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
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }

    const userRole = CoHostService.getUserRoleForEvent(params.eventId, session);
    if (!userRole) {
      return NextResponse.json({ error: 'Forbidden: You do not have access to this event.' }, { status: 403 });
    }

    const design = EventService.getEventDesign(params.eventId);
    const rsvpSummary = RSVPService.getRSVPSummary(params.eventId);

    return NextResponse.json({ success: true, event, design, rsvpSummary, userRole });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
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

    const { allowed, role } = CoHostService.assertPermission(params.eventId, session, 'manage_event');
    if (!allowed) {
      return NextResponse.json({ error: `Forbidden: Role '${role}' cannot edit event details.` }, { status: 403 });
    }

    const body = await req.json();
    const parsed = UpdateEventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || 'Invalid update payload.' },
        { status: 400 }
      );
    }

    // Prevent reassigning hostId or id
    const { hostId: _, id: __, ...allowedUpdates } = body;
    const updated = EventService.updateEvent(params.eventId, allowedUpdates);
    return NextResponse.json({ success: true, event: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
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

    const { allowed, role } = CoHostService.assertPermission(params.eventId, session, 'delete_event');
    if (!allowed) {
      return NextResponse.json({ error: `Forbidden: Only the owner can delete this event.` }, { status: 403 });
    }

    const deleted = EventService.deleteEvent(params.eventId);
    if (!deleted) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Event deleted.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
