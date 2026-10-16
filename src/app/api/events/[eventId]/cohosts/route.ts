import { NextRequest, NextResponse } from 'next/server';
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

    const { allowed, role } = CoHostService.assertPermission(params.eventId, session, 'manage_cohosts');
    if (!allowed) {
      return NextResponse.json(
        { error: `Forbidden: Role '${role}' is not authorized to view team co-hosts.` },
        { status: 403 }
      );
    }

    const cohosts = CoHostService.listCoHosts(params.eventId);
    return NextResponse.json({ success: true, cohosts, userRole: role });
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

    const { allowed, role } = CoHostService.assertPermission(params.eventId, session, 'manage_cohosts');
    if (!allowed) {
      return NextResponse.json(
        { error: `Forbidden: Role '${role}' cannot invite co-hosts.` },
        { status: 403 }
      );
    }

    const body = await req.json();
    if (!body.email || typeof body.email !== 'string') {
      return NextResponse.json({ error: 'Valid email address is required.' }, { status: 400 });
    }
    if (!body.role || !['manager', 'guest_manager', 'check_in_staff'].includes(body.role)) {
      return NextResponse.json(
        { error: 'Valid role is required (manager, guest_manager, check_in_staff).' },
        { status: 400 }
      );
    }

    const newCoHost = CoHostService.inviteCoHost(params.eventId, {
      email: body.email,
      name: body.name,
      role: body.role,
      invitedBy: session.id,
    });

    return NextResponse.json({ success: true, cohost: newCoHost });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
