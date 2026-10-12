import { NextRequest, NextResponse } from 'next/server';
import { EventService } from '@/lib/services/event-service';
import { RSVPService } from '@/lib/services/rsvp-service';

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const event = EventService.getEventById(params.eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    const design = EventService.getEventDesign(params.eventId);
    const rsvpSummary = RSVPService.getRSVPSummary(params.eventId);

    return NextResponse.json({ success: true, event, design, rsvpSummary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const body = await req.json();
    const updated = EventService.updateEvent(params.eventId, body);
    return NextResponse.json({ success: true, event: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const deleted = EventService.deleteEvent(params.eventId);
    if (!deleted) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
