import { NextRequest, NextResponse } from 'next/server';
import { MessagingService } from '@/lib/services/messaging-service';
import { EventService } from '@/lib/services/event-service';
import { CoHostService } from '@/lib/services/cohost-service';
import { getAuthSession } from '@/lib/auth/session';

export async function GET(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    const event = EventService.getEventById(params.eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    const { allowed, role } = CoHostService.assertPermission(params.eventId, session, 'view_rsvps');
    if (!allowed) {
      return NextResponse.json(
        { error: `Forbidden: Role '${role}' cannot view messages.` },
        { status: 403 }
      );
    }

    const jobs = MessagingService.listMessageJobs(params.eventId);
    const audits = MessagingService.listAuditLogs(params.eventId);

    return NextResponse.json({
      success: true,
      jobs,
      audits,
      userRole: role,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Authentication required.' }, { status: 401 });
    }

    const event = EventService.getEventById(params.eventId);
    if (!event) {
      return NextResponse.json({ error: 'Event not found.' }, { status: 404 });
    }

    const { allowed, role } = CoHostService.assertPermission(params.eventId, session, 'manage_messages');
    if (!allowed) {
      return NextResponse.json(
        { error: `Forbidden: Role '${role}' cannot dispatch messages.` },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { idempotencyKey, subject, body: messageBody, channel, audienceFilter, scheduledFor, autoDispatch } = body;

    if (!idempotencyKey) {
      return NextResponse.json(
        { error: 'idempotencyKey is required to guarantee duplicate-free delivery.' },
        { status: 400 }
      );
    }

    if (!messageBody || typeof messageBody !== 'string') {
      return NextResponse.json(
        { error: 'Message body is required.' },
        { status: 400 }
      );
    }

    const job = MessagingService.createMessageJob(params.eventId, {
      idempotencyKey,
      subject,
      body: messageBody,
      channel: channel || 'manual_whatsapp',
      audienceFilter: audienceFilter || 'all',
      scheduledFor,
      createdBy: session.id,
    });

    if (autoDispatch && job.status !== 'scheduled' && job.status !== 'delivered') {
      const dispatched = await MessagingService.dispatchJob(job.id);
      return NextResponse.json({ success: true, job: dispatched });
    }

    return NextResponse.json({ success: true, job }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
