import { NextRequest, NextResponse } from 'next/server';
import { GuestService } from '@/lib/services/guest-service';
import { EventService } from '@/lib/services/event-service';
import { CoHostService } from '@/lib/services/cohost-service';
import { getAuthSession } from '@/lib/auth/session';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { eventId: string; guestId: string } }
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

    const { allowed, role } = CoHostService.assertPermission(params.eventId, session, 'manage_guests');
    if (!allowed) {
      return NextResponse.json({ error: `Forbidden: Role '${role}' cannot edit guests.` }, { status: 403 });
    }

    const guest = GuestService.getGuestById(params.guestId);
    if (!guest || guest.eventId !== params.eventId) {
      return NextResponse.json({ error: 'Guest not found for this event.' }, { status: 404 });
    }

    const body = await req.json();

    if (body.action === 'rotate_token') {
      const updated = GuestService.rotateGuestToken(params.guestId);
      return NextResponse.json({ success: true, guest: updated, message: 'Token rotated successfully.' });
    }

    if (body.action === 'revoke_token') {
      const updated = GuestService.revokeGuestToken(params.guestId);
      return NextResponse.json({ success: true, guest: updated, message: 'Token revoked.' });
    }

    const updated = GuestService.updateGuest(params.guestId, body);
    return NextResponse.json({ success: true, guest: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { eventId: string; guestId: string } }
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

    const { allowed, role } = CoHostService.assertPermission(params.eventId, session, 'manage_guests');
    if (!allowed) {
      return NextResponse.json({ error: `Forbidden: Role '${role}' cannot delete guests.` }, { status: 403 });
    }

    const guest = GuestService.getGuestById(params.guestId);
    if (!guest || guest.eventId !== params.eventId) {
      return NextResponse.json({ error: 'Guest not found for this event.' }, { status: 404 });
    }

    const ok = GuestService.deleteGuest(params.guestId);
    if (!ok) {
      return NextResponse.json({ error: 'Guest not found.' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Guest deleted.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
