import { NextRequest, NextResponse } from 'next/server';
import { CheckInService } from '@/lib/services/checkin-service';
import { CoHostService } from '@/lib/services/cohost-service';
import { EventService } from '@/lib/services/event-service';
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

    const { allowed, role } = CoHostService.assertPermission(params.eventId, session, 'check_in');
    if (!allowed) {
      return NextResponse.json(
        { error: `Forbidden: Role '${role}' is not authorized to access check-in.` },
        { status: 403 }
      );
    }

    const summary = CheckInService.getStatus(params.eventId);
    return NextResponse.json({ success: true, summary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

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

    const { allowed, role } = CoHostService.assertPermission(params.eventId, session, 'check_in');
    if (!allowed) {
      return NextResponse.json(
        { error: `Forbidden: Role '${role}' cannot perform check-in operations.` },
        { status: 403 }
      );
    }

    const body = await req.json();
    const action = body.action || 'checkin';
    const actorName = session.name || session.email;

    if (action === 'undo') {
      if (!body.guestId) {
        return NextResponse.json({ error: 'Guest ID is required to undo check-in.' }, { status: 400 });
      }
      const result = CheckInService.undoCheckIn(params.eventId, body.guestId, actorName);
      if (!result.success) {
        return NextResponse.json({ error: result.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, message: result.message });
    }

    // Default: Check in guest
    if (!body.passCode && !body.guestId) {
      return NextResponse.json(
        { error: 'Either passCode or guestId must be provided for check-in.' },
        { status: 400 }
      );
    }

    const result = CheckInService.checkIn(
      params.eventId,
      { passCode: body.passCode, guestId: body.guestId },
      actorName
    );

    if (!result.success) {
      return NextResponse.json(
        {
          error: result.message,
          alreadyCheckedIn: result.alreadyCheckedIn,
          guest: result.guest,
        },
        { status: result.alreadyCheckedIn ? 409 : 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      checkIn: result.checkIn,
      guest: result.guest,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
