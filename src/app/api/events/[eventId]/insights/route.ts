import { NextRequest, NextResponse } from 'next/server';
import { InsightsService } from '@/lib/services/insights-service';
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
        { error: `Forbidden: Role '${role}' cannot view insights.` },
        { status: 403 }
      );
    }

    const insights = InsightsService.getEventInsights(params.eventId);
    return NextResponse.json({ success: true, ...insights, insights });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const body = await req.json().catch(() => ({}));
    const source = typeof body?.source === 'string' ? body.source : 'direct';
    const action = body?.action || 'page_view';

    if (action === 'rsvp') {
      InsightsService.recordSourceRsvp(params.eventId, source);
    } else {
      InsightsService.recordPageView(params.eventId, source);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PATCH(
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

    const { allowed, role } = CoHostService.assertPermission(params.eventId, session, 'manage_event');
    if (!allowed) {
      return NextResponse.json(
        { error: `Forbidden: Role '${role}' cannot modify privacy settings.` },
        { status: 403 }
      );
    }

    const body = await req.json();
    const updated = InsightsService.updateEventPrivacy(params.eventId, body);

    return NextResponse.json({ success: true, event: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
