import { NextRequest, NextResponse } from 'next/server';
import { MpesaService } from '@/lib/services/mpesa-service';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.eventId || !body.phone || !body.amount || !body.contributorName) {
      return NextResponse.json(
        {
          error:
            'Missing required contribution fields (eventId, phone, amount, contributorName).',
        },
        { status: 400 }
      );
    }

    const result = await MpesaService.requestStkPush({
      eventId: body.eventId,
      phone: body.phone,
      amount: Number(body.amount),
      contributorName: body.contributorName,
      note: body.note,
    });

    return NextResponse.json({ success: true, result }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Failed to initiate M-Pesa contribution.' },
      { status: 400 }
    );
  }
}
