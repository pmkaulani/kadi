import { NextRequest, NextResponse } from 'next/server';
import { SupportService } from '@/lib/services/support-service';

export async function GET(
  _req: NextRequest,
  { params }: { params: { ticketId: string } }
) {
  const { ticketId } = params;
  if (!ticketId) {
    return NextResponse.json({ error: 'Ticket ID required' }, { status: 400 });
  }

  const ticket = SupportService.getTicketById(ticketId);
  if (!ticket) {
    return NextResponse.json(
      { error: 'Not found', message: 'No support inquiry matches this reference ID.' },
      { status: 404 }
    );
  }

  // Safe subset returned to user
  return NextResponse.json({
    ticket: {
      id: ticket.id,
      category: ticket.category,
      subject: ticket.subject,
      status: ticket.status,
      priority: ticket.priority,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      resolutionNotes: ticket.resolutionNotes,
    },
  });
}
