import { NextRequest, NextResponse } from 'next/server';
import { EventService } from '@/lib/services/event-service';

export async function GET(req: NextRequest) {
  try {
    const events = EventService.listEvents('host-1');
    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const event = EventService.createEvent(body);
    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
