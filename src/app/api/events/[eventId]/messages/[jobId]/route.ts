import { NextRequest, NextResponse } from 'next/server';
import { MessagingService } from '@/lib/services/messaging-service';
import { CoHostService } from '@/lib/services/cohost-service';
import { getAuthSession } from '@/lib/auth/session';

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string; jobId: string } }
) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    const { allowed } = CoHostService.assertPermission(params.eventId, session, 'view_rsvps');
    if (!allowed) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    const job = MessagingService.getJobById(params.jobId);
    if (!job || job.eventId !== params.eventId) {
      return NextResponse.json({ error: 'Message job not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, job });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { eventId: string; jobId: string } }
) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    const { allowed, role } = CoHostService.assertPermission(params.eventId, session, 'manage_messages');
    if (!allowed) {
      return NextResponse.json(
        { error: `Forbidden: Role '${role}' cannot cancel scheduled reminders.` },
        { status: 403 }
      );
    }

    const cancelled = MessagingService.cancelScheduledJob(params.jobId, session.id);
    return NextResponse.json({ success: true, job: cancelled });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
