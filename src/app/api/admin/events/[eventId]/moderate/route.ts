import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth/session';
import { AdminService, UnauthorizedAdminError } from '@/lib/services/admin-service';

export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await getAuthSession(req);
    const adminUser = AdminService.requireAdminRole(session);

    const body = await req.json();
    const { action, reason } = body;

    if (!action || !['unlist', 'suspend', 'restore'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action', message: 'Action must be unlist, suspend, or restore.' },
        { status: 400 }
      );
    }

    if (!reason || reason.trim().length < 3) {
      return NextResponse.json(
        { error: 'Reason required', message: 'A justifiable operational reason is required for moderation actions.' },
        { status: 400 }
      );
    }

    const updatedEvent = AdminService.moderateEvent(params.eventId, action, reason, adminUser);

    return NextResponse.json({
      success: true,
      event: {
        id: updatedEvent.id,
        moderationStatus: updatedEvent.moderationStatus,
        moderationReason: updatedEvent.moderationReason,
        moderatedAt: updatedEvent.moderatedAt,
        moderatedBy: updatedEvent.moderatedBy,
      },
      message: `Event successfully marked as ${updatedEvent.moderationStatus}.`,
    });
  } catch (err: any) {
    if (err instanceof UnauthorizedAdminError) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Administrative role required to execute moderation operations.' },
        { status: 403 }
      );
    }
    return NextResponse.json({ error: 'Server error', message: err.message }, { status: 500 });
  }
}
