import { NextRequest, NextResponse } from 'next/server';
import { RSVPService } from '@/lib/services/rsvp-service';

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const csvContent = RSVPService.exportRSVPsCSV(params.eventId);

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="kadi-rsvps-${params.eventId}.csv"`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
