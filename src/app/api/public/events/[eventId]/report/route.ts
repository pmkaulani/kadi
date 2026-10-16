import { NextRequest, NextResponse } from 'next/server';
import { InsightsService } from '@/lib/services/insights-service';

export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const body = await req.json();
    const { reason, details, reporterContact } = body;

    if (!reason) {
      return NextResponse.json(
        { error: 'A valid report reason is required (spam, inappropriate, copyright, harassment, fraud, other).' },
        { status: 400 }
      );
    }

    const report = InsightsService.reportEvent(params.eventId, {
      reason,
      details,
      reporterContact,
    });

    return NextResponse.json({
      success: true,
      message: 'Thank you. Your report has been submitted for moderation review.',
      reportId: report.id,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
