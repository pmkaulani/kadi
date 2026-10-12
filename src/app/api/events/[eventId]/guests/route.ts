import { NextRequest, NextResponse } from 'next/server';
import { GuestService } from '@/lib/services/guest-service';

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
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
    const body = await req.json();
    if (!body.displayName) {
      return NextResponse.json(
        { error: 'Guest or household displayName is required.' },
        { status: 400 }
      );
    }

    const guest = GuestService.addGuest(params.eventId, {
      displayName: body.displayName,
      contactPhone: body.contactPhone,
      contactEmail: body.contactEmail,
      group: body.group,
      allowedPlusOnes: body.allowedPlusOnes !== undefined ? Number(body.allowedPlusOnes) : 1,
      notes: body.notes,
    });

    return NextResponse.json({ success: true, guest }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
