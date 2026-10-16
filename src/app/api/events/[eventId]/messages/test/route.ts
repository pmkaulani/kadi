import { NextRequest, NextResponse } from 'next/server';
import { MessagingService } from '@/lib/services/messaging-service';
import { CoHostService } from '@/lib/services/cohost-service';
import { getAuthSession } from '@/lib/auth/session';

export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    const { allowed, role } = CoHostService.assertPermission(params.eventId, session, 'manage_messages');
    if (!allowed) {
      return NextResponse.json(
        { error: `Forbidden: Role '${role}' cannot send test messages.` },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { subject, body: messageBody, channel, testRecipient } = body;

    if (!testRecipient) {
      return NextResponse.json({ error: 'Test recipient is required.' }, { status: 400 });
    }

    const result = await MessagingService.sendTestPreview(
      params.eventId,
      {
        subject,
        body: messageBody || '',
        channel: channel || 'email',
        testRecipient,
        hostId: session.id,
      }
    );

    return NextResponse.json({ ...result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
