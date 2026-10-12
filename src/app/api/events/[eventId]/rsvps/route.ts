import { NextRequest, NextResponse } from 'next/server';
import { RSVPService } from '@/lib/services/rsvp-service';

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const submissions = RSVPService.listRSVPs(params.eventId);
    const summary = RSVPService.getRSVPSummary(params.eventId);
    return NextResponse.json({ success: true, submissions, summary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
