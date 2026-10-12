import { NextRequest, NextResponse } from 'next/server';
import { EventService } from '@/lib/services/event-service';

export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const duplicated = EventService.duplicateEvent(params.eventId);
    return NextResponse.json({ success: true, event: duplicated }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
