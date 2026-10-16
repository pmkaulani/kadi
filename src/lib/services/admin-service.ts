import crypto from 'crypto';
import { mockDb } from '../db/mock-db';
import { EventEntity, EventReportEntity, AdminAuditRecord } from '../db/types';
import { SessionUser } from '../auth/session';
import { telemetry, sanitizeLogData } from '../telemetry/logger';

export class UnauthorizedAdminError extends Error {
  constructor(message = 'Administrative credentials with admin role required.') {
    super(message);
    this.name = 'UnauthorizedAdminError';
  }
}

class AdminServiceRegistry {
  private auditLogs: AdminAuditRecord[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    this.auditLogs = [
      {
        id: 'audit-adm-1',
        adminId: 'admin-1',
        adminEmail: 'ops@kadi.africa',
        action: 'moderate_event',
        targetType: 'event',
        targetId: 'event-wedding-1',
        reason: 'Initial platform compliance review',
        metadata: { status: 'active', checks: 'verified_clean' },
        timestamp: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
      },
    ];

    // Seed a pending test report for moderation queue visibility
    if (mockDb.reports.length === 0) {
      mockDb.reports.push({
        id: 'rep-seed-1',
        eventId: 'event-wedding-1',
        reason: 'other',
        details: 'Testing discovery report intake queue.',
        reporterContact: 'verifier@kadi.africa',
        createdAt: new Date(Date.now() - 5 * 3600 * 1000).toISOString(),
        status: 'pending',
      });
    }
  }

  public requireAdminRole(session: SessionUser | null): SessionUser & { role: 'admin' } {
    if (!session || session.role !== 'admin') {
      telemetry.log({
        level: 'warn',
        operation: 'ADMIN_ACCESS_DENIED',
        message: `Unauthorized admin access attempt by user: ${session?.id || 'unauthenticated'}`,
        meta: { userId: session?.id, role: session?.role },
      });
      throw new UnauthorizedAdminError();
    }
    return session as SessionUser & { role: 'admin' };
  }

  public logAuditAction(params: {
    adminId: string;
    adminEmail: string;
    action: AdminAuditRecord['action'];
    targetType: AdminAuditRecord['targetType'];
    targetId: string;
    reason?: string;
    metadata?: Record<string, any>;
  }): AdminAuditRecord {
    const record: AdminAuditRecord = {
      id: `audit-${crypto.randomBytes(6).toString('hex')}`,
      adminId: params.adminId,
      adminEmail: params.adminEmail,
      action: params.action,
      targetType: params.targetType,
      targetId: params.targetId,
      reason: params.reason ? sanitizeLogData(params.reason) : undefined,
      metadata: params.metadata ? sanitizeLogData(params.metadata) : undefined,
      timestamp: new Date().toISOString(),
    };

    this.auditLogs.unshift(record);

    telemetry.log({
      level: 'info',
      operation: 'ADMIN_AUDIT_LOGGED',
      message: `Admin [${record.adminEmail}] executed [${record.action}] on [${record.targetType}:${record.targetId}]`,
      meta: {
        adminId: record.adminId,
        action: record.action,
        targetType: record.targetType,
        targetId: record.targetId,
      },
    });

    return record;
  }

  public getAuditLogs(limit = 100): AdminAuditRecord[] {
    return this.auditLogs.slice(0, limit);
  }

  public listAllEvents(): EventEntity[] {
    return [...mockDb.events];
  }

  public listReports(): EventReportEntity[] {
    return [...mockDb.reports].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public moderateEvent(
    eventId: string,
    action: 'unlist' | 'suspend' | 'restore',
    reason: string,
    admin: SessionUser
  ): EventEntity {
    this.requireAdminRole(admin);

    const event = mockDb.events.find((e) => e.id === eventId);
    if (!event) {
      throw new Error(`Event not found: ${eventId}`);
    }

    const now = new Date().toISOString();

    if (action === 'unlist') {
      event.visibility = 'unlisted';
      event.moderationStatus = 'unlisted';
      event.moderationReason = reason;
      event.moderatedAt = now;
      event.moderatedBy = admin.email;
    } else if (action === 'suspend') {
      event.moderationStatus = 'suspended';
      event.moderationReason = reason;
      event.moderatedAt = now;
      event.moderatedBy = admin.email;
    } else if (action === 'restore') {
      event.moderationStatus = 'active';
      event.moderationReason = undefined;
      event.moderatedAt = now;
      event.moderatedBy = admin.email;
    }

    this.logAuditAction({
      adminId: admin.id,
      adminEmail: admin.email,
      action: 'moderate_event',
      targetType: 'event',
      targetId: eventId,
      reason,
      metadata: { newStatus: event.moderationStatus, visibility: event.visibility },
    });

    return event;
  }

  public dismissReport(reportId: string, admin: SessionUser, reason = 'No violation found'): EventReportEntity {
    this.requireAdminRole(admin);

    const report = mockDb.reports.find((r) => r.id === reportId);
    if (!report) {
      throw new Error(`Report not found: ${reportId}`);
    }

    report.status = 'dismissed';

    this.logAuditAction({
      adminId: admin.id,
      adminEmail: admin.email,
      action: 'dismiss_report',
      targetType: 'report',
      targetId: reportId,
      reason,
    });

    return report;
  }
}

// Global Singleton
const globalForAdmin = globalThis as unknown as { __kadi_admin?: AdminServiceRegistry };
export const AdminService = globalForAdmin.__kadi_admin || new AdminServiceRegistry();
if (process.env.NODE_ENV !== 'production') {
  globalForAdmin.__kadi_admin = AdminService;
}
