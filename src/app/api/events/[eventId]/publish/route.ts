import { NextRequest, NextResponse } from 'next/server';
import { EventService } from '@/lib/services/event-service';

export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const published = EventService.publishEvent(params.eventId);
    return NextResponse.json({ success: true, event: published });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
