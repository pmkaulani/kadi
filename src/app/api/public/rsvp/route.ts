import { NextRequest, NextResponse } from 'next/server';
import { RSVPService } from '@/lib/services/rsvp-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.eventId || !body.status || !body.primaryName || !body.contact) {
      return NextResponse.json(
        { error: 'Missing required RSVP fields (eventId, status, primaryName, contact).' },
        { status: 400 }
      );
    }

    const submission = RSVPService.submitRSVP({
      eventId: body.eventId,
      guestToken: body.guestToken,
      primaryName: body.primaryName,
      contact: body.contact,
      status: body.status,
      attendeeCount: Number(body.attendeeCount) || 1,
      dietaryRequirements: body.dietaryRequirements,
      songRequest: body.songRequest,
      noteToHost: body.noteToHost,
    });

    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'An error occurred while processing your RSVP.' },
      { status: 400 }
    );
  }
}
