import { NextRequest, NextResponse } from 'next/server';
import { GuestService } from '@/lib/services/guest-service';
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

    if (event.hostId !== session.id) {
      return NextResponse.json({ error: 'Forbidden: You do not own this event.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || '';
    const group = searchParams.get('group') || 'all';

    const guests = GuestService.listGuests(params.eventId, search, group);
    const groups = GuestService.getGroups(params.eventId);

    return NextResponse.json({ success: true, guests, groups });
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

    if (event.hostId !== session.id) {
      return NextResponse.json({ error: 'Forbidden: You do not own this event.' }, { status: 403 });
    }

    const body = await req.json();
    if (!body.displayName || typeof body.displayName !== 'string' || !body.displayName.trim()) {
      return NextResponse.json(
        { error: 'Guest or household displayName is required.' },
        { status: 400 }
      );
    }

    const rawPlusOnes = Number(body.allowedPlusOnes ?? 1);
    const allowedPlusOnes = Math.min(Math.max(isNaN(rawPlusOnes) ? 1 : rawPlusOnes, 0), 10);

    const guest = GuestService.addGuest(params.eventId, {
      displayName: body.displayName.trim(),
      contactPhone: body.contactPhone?.trim(),
      contactEmail: body.contactEmail?.trim(),
      group: body.group?.trim() || 'General',
      allowedPlusOnes,
      notes: body.notes?.trim(),
    });

    return NextResponse.json({ success: true, guest }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
