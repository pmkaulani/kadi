import { NextRequest, NextResponse } from 'next/server';
import { GuestService } from '@/lib/services/guest-service';

export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const body = await req.json();
    if (!body.rows || !Array.isArray(body.rows)) {
      return NextResponse.json(
        { error: 'An array of guest rows is required for import.' },
        { status: 400 }
      );
    }

    const result = GuestService.importGuests(params.eventId, body.rows);
    return NextResponse.json({ success: true, result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
