import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth/session';
import { AdminService, UnauthorizedAdminError } from '@/lib/services/admin-service';

export async function POST(
  req: NextRequest,
  { params }: { params: { reportId: string } }
) {
  try {
    const session = await getAuthSession(req);
    const adminUser = AdminService.requireAdminRole(session);

    const body = await req.json();
    const { action, reason } = body;

    if (action === 'dismiss') {
      const updated = AdminService.dismissReport(params.reportId, adminUser, reason);
      return NextResponse.json({ success: true, report: updated });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    if (err instanceof UnauthorizedAdminError) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Administrative credentials required.' },
        { status: 403 }
      );
    }
    return NextResponse.json({ error: 'Server error', message: err.message }, { status: 500 });
  }
}
