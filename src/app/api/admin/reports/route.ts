import { NextRequest, NextResponse } from 'next/server';
import { getAuthSession } from '@/lib/auth/session';
import { AdminService, UnauthorizedAdminError } from '@/lib/services/admin-service';

export async function GET(req: NextRequest) {
  try {
    const session = await getAuthSession(req);
    AdminService.requireAdminRole(session);

    const reports = AdminService.listReports();
    return NextResponse.json({ reports });
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
