import { NextRequest, NextResponse } from 'next/server';
import { InsightsService } from '@/lib/services/insights-service';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || undefined;
    const city = searchParams.get('city') || undefined;
    const search = searchParams.get('search') || undefined;
    const tag = searchParams.get('tag') || undefined;

    const events = InsightsService.listPublicEvents({
      category,
      city,
      search,
      tag,
    });

    return NextResponse.json({
      success: true,
      count: events.length,
      events,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
