import { NextRequest, NextResponse } from 'next/server';
import { SupportService, SupportCategory } from '@/lib/services/support-service';
import { getAuthSession } from '@/lib/auth/session';
import { telemetry, generateCorrelationId } from '@/lib/telemetry/logger';

export async function POST(req: NextRequest) {
  const requestId = generateCorrelationId();
  try {
    const session = await getAuthSession(req);
    const body = await req.json();

    const { category, subject, description, safeEventId, contactEmail } = body;

    if (!category || !subject || !description) {
      return NextResponse.json(
        {
          error: 'Missing required fields',
          message: 'Category, subject, and description are required.',
        },
        { status: 400 }
      );
    }

    const email = session?.email || contactEmail;
    if (!email) {
      return NextResponse.json(
        {
          error: 'Missing email',
          message: 'Please provide a valid contact email address.',
        },
        { status: 400 }
      );
    }

    const ticket = SupportService.createTicket({
      userId: session?.id,
      userEmail: email,
      category: category as SupportCategory,
      subject,
      description,
      safeEventId,
    });

    return NextResponse.json(
      {
        success: true,
        ticket: {
          id: ticket.id,
          category: ticket.category,
          subject: ticket.subject,
          status: ticket.status,
          priority: ticket.priority,
          createdAt: ticket.createdAt,
        },
        message: `Your support request has been logged under reference ${ticket.id}. Our operations desk will review it promptly.`,
      },
      { status: 201 }
    );
  } catch (err: any) {
    telemetry.recordFailure('api_failures', 'CREATE_SUPPORT_TICKET', err, requestId);
    return NextResponse.json(
      {
        error: 'Support ticket error',
        message: 'Unable to submit your support inquiry at this moment. Please try again shortly.',
      },
      { status: 500 }
    );
  }
}
