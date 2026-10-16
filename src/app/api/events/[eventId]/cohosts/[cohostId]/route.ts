import { NextRequest, NextResponse } from 'next/server';
import { CoHostService } from '@/lib/services/cohost-service';
import { EventService } from '@/lib/services/event-service';
import { getAuthSession } from '@/lib/auth/session';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { eventId: string; cohostId: string } }
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

    const { allowed, role } = CoHostService.assertPermission(params.eventId, session, 'manage_cohosts');
    if (!allowed) {
      return NextResponse.json(
        { error: `Forbidden: Role '${role}' cannot revoke co-hosts.` },
        { status: 403 }
      );
    }

    const revoked = CoHostService.revokeCoHost(params.cohostId);
    return NextResponse.json({ success: true, cohost: revoked });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { eventId: string; cohostId: string } }
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

    const { allowed, role } = CoHostService.assertPermission(params.eventId, session, 'manage_cohosts');
    if (!allowed) {
      return NextResponse.json(
        { error: `Forbidden: Role '${role}' cannot modify co-host roles.` },
        { status: 403 }
      );
    }

    const body = await req.json();
    if (!body.role || !['manager', 'guest_manager', 'check_in_staff'].includes(body.role)) {
      return NextResponse.json(
        { error: 'Valid role is required (manager, guest_manager, check_in_staff).' },
        { status: 400 }
      );
    }

    const updated = CoHostService.updateCoHostRole(params.cohostId, body.role);
    return NextResponse.json({ success: true, cohost: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
