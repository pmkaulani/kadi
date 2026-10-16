import crypto from 'crypto';
import { telemetry } from '../telemetry/logger';

export type SupportCategory = 'issue' | 'abuse' | 'payment' | 'invite_failure';
export type SupportStatus = 'open' | 'investigating' | 'resolved' | 'closed';
export type SupportPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface SupportTicket {
  id: string; // KADI-SUP-XXXX-YYYY
  userId?: string;
  userEmail: string;
  category: SupportCategory;
  subject: string;
  description: string;
  safeEventId?: string;
  status: SupportStatus;
  priority: SupportPriority;
  createdAt: string;
  updatedAt: string;
  resolutionNotes?: string;
}

export function generateSupportId(): string {
  const seg1 = crypto.randomBytes(2).toString('hex').toUpperCase();
  const seg2 = crypto.randomBytes(2).toString('hex').toUpperCase();
  return `KADI-SUP-${seg1}-${seg2}`;
}

class SupportServiceRegistry {
  private tickets: Map<string, SupportTicket> = new Map();

  constructor() {
    this.seedInitialTickets();
  }

  private seedInitialTickets() {
    const seed: SupportTicket[] = [
      {
        id: 'KADI-SUP-7A1B-9C4D',
        userId: 'host-1',
        userEmail: 'host@kadi.africa',
        category: 'payment',
        subject: 'M-Pesa STK push confirmation latency query',
        description: 'Testing sandbox contribution flow to verify if webhook auto-updates guest row.',
        safeEventId: 'event-wedding-1',
        status: 'resolved',
        priority: 'normal',
        createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
        resolutionNotes: 'Confirmed sandbox environment returns mock receipt within 500ms.',
      },
      {
        id: 'KADI-SUP-3F2E-8A5B',
        userEmail: 'guest.concern@example.com',
        category: 'abuse',
        subject: 'Inappropriate image report on public discovery event',
        description: 'Flagged suspicious event title on public discovery directory.',
        safeEventId: 'event-corp-1',
        status: 'open',
        priority: 'high',
        createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
        updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      },
    ];

    for (const t of seed) {
      this.tickets.set(t.id, t);
    }
  }

  public createTicket(params: {
    userId?: string;
    userEmail: string;
    category: SupportCategory;
    subject: string;
    description: string;
    safeEventId?: string;
    priority?: SupportPriority;
  }): SupportTicket {
    const id = generateSupportId();
    const now = new Date().toISOString();

    const ticket: SupportTicket = {
      id,
      userId: params.userId,
      userEmail: params.userEmail,
      category: params.category,
      subject: params.subject.trim(),
      description: params.description.trim(),
      safeEventId: params.safeEventId,
      status: 'open',
      priority: params.priority || (params.category === 'abuse' ? 'high' : 'normal'),
      createdAt: now,
      updatedAt: now,
    };

    this.tickets.set(id, ticket);

    telemetry.log({
      level: 'info',
      operation: 'SUPPORT_TICKET_CREATED',
      route: '/api/support/ticket',
      message: `Support ticket created: ${id} [${ticket.category}]`,
      meta: {
        ticketId: id,
        category: ticket.category,
        priority: ticket.priority,
        safeEventId: ticket.safeEventId,
      },
    });

    return ticket;
  }

  public getTicketById(id: string): SupportTicket | null {
    return this.tickets.get(id) || null;
  }

  public listTickets(filters?: {
    category?: SupportCategory | 'all';
    status?: SupportStatus | 'all';
  }): SupportTicket[] {
    let all = Array.from(this.tickets.values());

    if (filters?.category && filters.category !== 'all') {
      all = all.filter((t) => t.category === filters.category);
    }

    if (filters?.status && filters.status !== 'all') {
      all = all.filter((t) => t.status === filters.status);
    }

    return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public updateTicketStatus(
    id: string,
    status: SupportStatus,
    resolutionNotes?: string
  ): SupportTicket | null {
    const ticket = this.tickets.get(id);
    if (!ticket) return null;

    ticket.status = status;
    ticket.updatedAt = new Date().toISOString();
    if (resolutionNotes) {
      ticket.resolutionNotes = resolutionNotes;
    }

    telemetry.log({
      level: 'info',
      operation: 'SUPPORT_TICKET_UPDATED',
      message: `Support ticket ${id} updated to status: ${status}`,
      meta: { ticketId: id, status },
    });

    return ticket;
  }
}

// Global Singleton
const globalForSupport = globalThis as unknown as { __kadi_support?: SupportServiceRegistry };
export const SupportService = globalForSupport.__kadi_support || new SupportServiceRegistry();
if (process.env.NODE_ENV !== 'production') {
  globalForSupport.__kadi_support = SupportService;
}
