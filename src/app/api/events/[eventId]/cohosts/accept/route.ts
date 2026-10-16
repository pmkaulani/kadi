import { NextRequest, NextResponse } from 'next/server';
import { CoHostService } from '@/lib/services/cohost-service';
import { getAuthSession } from '@/lib/auth/session';

export async function POST(
  req: NextRequest,
  { params }: { params: { eventId: string } }
) {
  try {
    const session = await getAuthSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized: Please log in to accept the co-host invitation.' }, { status: 401 });
    }

    const body = await req.json();
    if (!body.inviteToken || typeof body.inviteToken !== 'string') {
      return NextResponse.json({ error: 'Invite token is required.' }, { status: 400 });
    }

    const accepted = CoHostService.acceptInvite(body.inviteToken, {
      email: session.email,
      name: session.name,
    });

    return NextResponse.json({ success: true, message: `Joined event as ${accepted.role}!`, cohost: accepted });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
