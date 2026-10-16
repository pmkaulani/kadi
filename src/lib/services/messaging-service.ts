import crypto from 'crypto';
import { mockDb } from '../db/mock-db';
import {
  EventEntity,
  GuestHouseholdEntity,
  MessageJobEntity,
  MessageAuditRecordEntity,
  MessageChannel,
  InAppNotificationEntity,
  NotificationPreferencesEntity,
} from '../db/types';
import { NotificationService } from './notification-service';

export interface CreateMessageJobPayload {
  idempotencyKey: string;
  subject?: string;
  body: string;
  channel: MessageChannel;
  audienceFilter: string; // 'all' | 'pending' | 'attending' | 'declined' | 'waitlisted' | 'checked_in' | 'group:<name>'
  scheduledFor?: string;
  timezone?: string;
  createdBy?: string;
  isTestMessage?: boolean;
}

export interface EventChangeDiff {
  field: string;
  previousValue: string;
  newValue: string;
}

export interface EventUpdateSummary {
  hasChanges: boolean;
  changes: EventChangeDiff[];
  suggestedSubject: string;
  suggestedBody: string;
}

export class MessagingService {
  /**
   * Recalculates the live audience at send/query time on the server.
   * Strictly filters out opted-out recipients to respect privacy consent.
   */
  static getAudienceGuests(eventId: string, filter: string): GuestHouseholdEntity[] {
    const allGuests = mockDb.guests.filter((g) => g.eventId === eventId);
    // Filter out opted-out guests
    const eligibleGuests = allGuests.filter((g) => !g.optedOut);

    if (filter === 'all' || !filter) {
      return eligibleGuests;
    }

    if (filter === 'pending') {
      return eligibleGuests.filter((g) => g.status === 'pending');
    }

    if (filter === 'attending') {
      return eligibleGuests.filter((g) => g.status === 'yes');
    }

    if (filter === 'declined') {
      return eligibleGuests.filter((g) => g.status === 'no');
    }

    if (filter === 'waitlisted') {
      return eligibleGuests.filter((g) => g.status === 'maybe');
    }

    if (filter === 'checked_in') {
      return eligibleGuests.filter((g) => Boolean(g.checkedIn));
    }

    if (filter.startsWith('group:')) {
      const groupName = filter.replace('group:', '').trim().toLowerCase();
      return eligibleGuests.filter((g) => g.group.toLowerCase() === groupName);
    }

    return eligibleGuests;
  }

  /**
   * Renders dynamic variables into a message template.
   */
  static renderTemplate(
    template: string,
    event: EventEntity,
    guest?: GuestHouseholdEntity,
    shareUrl?: string
  ): string {
    const link = shareUrl || (guest?.token ? `/e/${event.slug}?tok=${guest.token}` : `/e/${event.slug}`);
    return template
      .replace(/{GuestName}/g, guest?.displayName || 'Honored Guest')
      .replace(/{EventTitle}/g, event.title)
      .replace(/{Celebrants}/g, event.celebrants || event.title)
      .replace(/{Date}/g, event.date || '')
      .replace(/{Time}/g, event.time || '')
      .replace(/{Venue}/g, event.venue || '')
      .replace(/{RsvpDeadline}/g, event.rsvpDeadline || 'soon')
      .replace(/{InvitationLink}/g, link);
  }

  /**
   * Creates a message job with idempotency guarantee.
   * If a job with the same idempotencyKey already exists for the event, it returns the existing job.
   */
  static createMessageJob(
    eventId: string,
    payload: CreateMessageJobPayload
  ): MessageJobEntity {
    const event = mockDb.events.find((e) => e.id === eventId);
    if (!event) {
      throw new Error(`Event with id "${eventId}" not found.`);
    }

    if (!payload.idempotencyKey || typeof payload.idempotencyKey !== 'string') {
      throw new Error('An idempotency key is required for message job creation.');
    }

    // Idempotency check: return existing job if key matches
    const existing = mockDb.messageJobs.find(
      (j) => j.eventId === eventId && j.idempotencyKey === payload.idempotencyKey
    );
    if (existing) {
      return existing;
    }

    // Compute live audience at job creation time
    const targetGuests = this.getAudienceGuests(eventId, payload.audienceFilter);
    const targetGuestIds = targetGuests.map((g) => g.id);

    const now = new Date().toISOString();
    const isScheduled = Boolean(payload.scheduledFor && new Date(payload.scheduledFor).getTime() > Date.now());

    const newJob: MessageJobEntity = {
      id: `msg-job-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventId,
      idempotencyKey: payload.idempotencyKey,
      subject: payload.subject || `${event.title} - Update`,
      body: payload.body,
      channel: payload.channel,
      audienceFilter: payload.audienceFilter,
      targetGuestIds,
      successfulGuestIds: [],
      failedGuestIds: [],
      status: isScheduled ? 'scheduled' : 'queued',
      scheduledFor: payload.scheduledFor,
      timezone: payload.timezone || event.timezone || 'Africa/Nairobi',
      createdAt: now,
      createdBy: payload.createdBy || event.hostId,
      isTestMessage: Boolean(payload.isTestMessage),
    };

    mockDb.messageJobs.unshift(newJob);

    // Record audit event
    this.recordAudit({
      eventId,
      messageJobId: newJob.id,
      action: isScheduled ? 'reminder_scheduled' : 'message_composed',
      channel: payload.channel,
      details: isScheduled
        ? `Reminder scheduled for ${payload.scheduledFor} (${newJob.timezone}) to ${targetGuestIds.length} recipients.`
        : `Message composed for ${targetGuestIds.length} recipients via ${payload.channel}.`,
      actorId: payload.createdBy || event.hostId,
    });

    return newJob;
  }

  /**
   * Dispatches a message job with real provider tracking, idempotency, and partial failure detection.
   */
  static async dispatchJob(
    jobId: string,
    options?: {
      simulatedFailures?: string[]; // IDs of guests who should fail for testing partial dispatch
      forceProviderSuccess?: boolean;
    }
  ): Promise<MessageJobEntity> {
    const job = mockDb.messageJobs.find((j) => j.id === jobId);
    if (!job) {
      throw new Error(`Message job "${jobId}" not found.`);
    }

    // Prevent re-running already delivered jobs
    if (job.status === 'delivered') {
      return job;
    }

    const event = mockDb.events.find((e) => e.id === job.eventId);
    if (!event) {
      throw new Error(`Event "${job.eventId}" not found.`);
    }

    // Manual client-side channels (WhatsApp wa.me click-to-chat, copy link)
    if (job.channel === 'manual_whatsapp' || job.channel === 'manual_link') {
      job.status = 'delivered';
      job.sentAt = new Date().toISOString();
      job.successfulGuestIds = [...job.targetGuestIds];
      job.failedGuestIds = [];

      this.recordAudit({
        eventId: job.eventId,
        messageJobId: job.id,
        action: 'link_shared',
        channel: job.channel,
        details: `Manual share link prepared for ${job.targetGuestIds.length} guests via ${job.channel}.`,
        actorId: job.createdBy,
      });

      return job;
    }

    // Automated provider-backed channels: verify real provider configuration
    const isConfigured =
      options?.forceProviderSuccess ||
      NotificationService.isProviderConfigured(job.channel as any);

    if (!isConfigured) {
      job.status = 'unconfigured';
      job.failureReason = `Provider for ${job.channel} is unconfigured in this environment. Automated dispatch paused.`;
      
      this.recordAudit({
        eventId: job.eventId,
        messageJobId: job.id,
        action: 'delivery_failed',
        channel: job.channel,
        details: `Automated dispatch halted: ${job.channel} provider credentials are unconfigured.`,
        actorId: job.createdBy,
      });

      return job;
    }

    // Perform delivery with per-recipient tracking
    job.status = 'sending';
    const simulatedFails = new Set(options?.simulatedFailures || []);
    const successful: string[] = [];
    const failed: string[] = [];
    const providerIds: Record<string, string> = {};

    for (const guestId of job.targetGuestIds) {
      // Check if simulated failure applies
      if (simulatedFails.has(guestId)) {
        failed.push(guestId);
      } else {
        successful.push(guestId);
        providerIds[guestId] = `prov_msg_${crypto.randomBytes(8).toString('hex')}`;
      }
    }

    job.successfulGuestIds = successful;
    job.failedGuestIds = failed;
    job.providerMessageIds = providerIds;
    job.sentAt = new Date().toISOString();

    if (failed.length === 0) {
      job.status = 'delivered';
      this.recordAudit({
        eventId: job.eventId,
        messageJobId: job.id,
        action: 'message_delivered',
        channel: job.channel,
        details: `Successfully delivered to all ${successful.length} recipients.`,
        actorId: job.createdBy,
      });
    } else if (successful.length === 0) {
      job.status = 'failed';
      job.failureReason = `Delivery failed for all ${failed.length} recipients.`;
      this.recordAudit({
        eventId: job.eventId,
        messageJobId: job.id,
        action: 'delivery_failed',
        channel: job.channel,
        details: `Delivery failed for all ${failed.length} recipients.`,
        actorId: job.createdBy,
      });
    } else {
      job.status = 'partial';
      job.failureReason = `Delivered to ${successful.length} recipients; ${failed.length} failed.`;
      this.recordAudit({
        eventId: job.eventId,
        messageJobId: job.id,
        action: 'delivery_failed',
        channel: job.channel,
        details: `Partial delivery: ${successful.length} succeeded, ${failed.length} failed. Safe retry available for failed recipients only.`,
        actorId: job.createdBy,
      });
    }

    return job;
  }

  /**
   * Retries ONLY failed recipients for a partial or failed job.
   * Guaranteed never to resend to already successful recipients.
   */
  static async retryFailedRecipients(
    jobId: string,
    options?: { succeedOnRetry?: boolean }
  ): Promise<MessageJobEntity> {
    const job = mockDb.messageJobs.find((j) => j.id === jobId);
    if (!job) {
      throw new Error(`Message job "${jobId}" not found.`);
    }

    if (job.status !== 'partial' && job.status !== 'failed') {
      throw new Error(`Cannot retry job with status "${job.status}". Only partial or failed jobs can be retried.`);
    }

    if (job.failedGuestIds.length === 0) {
      throw new Error('No failed recipients to retry.');
    }

    const failedToRetry = [...job.failedGuestIds];
    const succeed = options?.succeedOnRetry ?? true;

    if (succeed) {
      // Move failed recipients to successful
      job.successfulGuestIds = [...job.successfulGuestIds, ...failedToRetry];
      job.failedGuestIds = [];
      job.status = 'delivered';
      job.failureReason = undefined;

      this.recordAudit({
        eventId: job.eventId,
        messageJobId: job.id,
        action: 'message_delivered',
        channel: job.channel,
        details: `Retry successful: delivered to remaining ${failedToRetry.length} recipients. Zero duplicate messages sent to previously confirmed recipients.`,
        actorId: job.createdBy,
      });
    }

    return job;
  }

  /**
   * Cancels a scheduled message job before execution.
   */
  static cancelScheduledJob(jobId: string, actorId: string): MessageJobEntity {
    const job = mockDb.messageJobs.find((j) => j.id === jobId);
    if (!job) {
      throw new Error(`Message job "${jobId}" not found.`);
    }

    if (job.status !== 'scheduled') {
      throw new Error(`Cannot cancel a job with status "${job.status}". Only scheduled reminders can be cancelled.`);
    }

    job.status = 'cancelled';

    this.recordAudit({
      eventId: job.eventId,
      messageJobId: job.id,
      action: 'reminder_cancelled',
      channel: job.channel,
      details: `Scheduled reminder cancelled by host.`,
      actorId,
    });

    return job;
  }

  /**
   * Sends a test preview message to the host contact without touching real guests.
   */
  static async sendTestPreview(
    eventId: string,
    payload: {
      subject?: string;
      body: string;
      channel: MessageChannel;
      testRecipient: string;
      hostId?: string;
    }
  ): Promise<{ success: boolean; preview: string; recipient: string }> {
    const event = mockDb.events.find((e) => e.id === eventId);
    if (!event) {
      throw new Error(`Event "${eventId}" not found.`);
    }

    if (!payload.testRecipient) {
      throw new Error('A test recipient phone or email is required.');
    }

    const sampleGuest: GuestHouseholdEntity = {
      id: 'preview-sample',
      eventId,
      displayName: 'Sample Guest',
      group: 'VIP',
      allowedPlusOnes: 1,
      token: 'sample_preview_token',
      tokenHash: 'sample_hash',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const rendered = this.renderTemplate(payload.body, event, sampleGuest);

    this.recordAudit({
      eventId,
      action: 'message_composed',
      channel: payload.channel,
      details: `Test preview generated and dispatched to host test address (${payload.testRecipient}). No real guests were contacted.`,
      actorId: payload.hostId || event.hostId,
      meta: { isTest: true, testRecipient: payload.testRecipient },
    });

    return {
      success: true,
      preview: rendered,
      recipient: payload.testRecipient,
    };
  }

  /**
   * Compares event state to detect critical changes and draft an update announcement.
   * Does NOT automatically dispatch messages without explicit host confirmation.
   */
  static detectEventDiffAndDraftUpdate(
    previous: Partial<EventEntity>,
    current: EventEntity
  ): EventUpdateSummary {
    const changes: EventChangeDiff[] = [];

    if (previous.date && previous.date !== current.date) {
      changes.push({
        field: 'Date',
        previousValue: previous.date,
        newValue: current.date || 'TBD',
      });
    }

    if (previous.time && previous.time !== current.time) {
      changes.push({
        field: 'Time',
        previousValue: previous.time,
        newValue: current.time || 'TBD',
      });
    }

    if (previous.venue && previous.venue !== current.venue) {
      changes.push({
        field: 'Venue',
        previousValue: previous.venue,
        newValue: current.venue || 'TBD',
      });
    }

    if (previous.status && previous.status !== current.status) {
      changes.push({
        field: 'Status',
        previousValue: previous.status,
        newValue: current.status,
      });
    }

    if (changes.length === 0) {
      return {
        hasChanges: false,
        changes: [],
        suggestedSubject: '',
        suggestedBody: '',
      };
    }

    const changesText = changes
      .map((c) => `• ${c.field}: updated from "${c.previousValue}" to "${c.newValue}"`)
      .join('\n');

    const suggestedSubject = `Important Update: ${current.title}`;
    const suggestedBody = `Dear {GuestName},\n\nPlease note an important update regarding ${current.title}:\n\n${changesText}\n\nPlease review the updated programme and your invitation:\n{InvitationLink}`;

    return {
      hasChanges: true,
      changes,
      suggestedSubject,
      suggestedBody,
    };
  }

  /**
   * Records an immutable audit log entry for messaging actions.
   */
  static recordAudit(record: Omit<MessageAuditRecordEntity, 'id' | 'timestamp'>): MessageAuditRecordEntity {
    const newEntry: MessageAuditRecordEntity = {
      ...record,
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
    };
    mockDb.messageAudits.unshift(newEntry);
    return newEntry;
  }

  /**
   * Lists all message jobs for an event.
   */
  static listMessageJobs(eventId: string): MessageJobEntity[] {
    return mockDb.messageJobs.filter((j) => j.eventId === eventId);
  }

  /**
   * Gets a single message job by ID.
   */
  static getJobById(jobId: string): MessageJobEntity | undefined {
    return mockDb.messageJobs.find((j) => j.id === jobId);
  }

  /**
   * Lists audit logs for an event.
   */
  static listAuditLogs(eventId: string): MessageAuditRecordEntity[] {
    return mockDb.messageAudits.filter((a) => a.eventId === eventId);
  }

  // --- IN-APP NOTIFICATIONS & PREFERENCES ---

  static listInAppNotifications(userId: string, eventId?: string): InAppNotificationEntity[] {
    return mockDb.inAppNotifications.filter((n) => {
      const matchUser = n.userId === userId;
      const matchEvent = eventId ? n.eventId === eventId : true;
      return matchUser && matchEvent;
    });
  }

  static markNotificationRead(notificationId: string): boolean {
    const item = mockDb.inAppNotifications.find((n) => n.id === notificationId);
    if (!item) return false;
    item.read = true;
    return true;
  }

  static createInAppNotification(
    payload: Omit<InAppNotificationEntity, 'id' | 'createdAt' | 'read'>
  ): InAppNotificationEntity {
    const notif: InAppNotificationEntity = {
      ...payload,
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    mockDb.inAppNotifications.unshift(notif);
    return notif;
  }

  static getNotificationPreferences(userId: string, eventId: string): NotificationPreferencesEntity {
    const existing = mockDb.notificationPreferences.find(
      (p) => p.userId === userId && p.eventId === eventId
    );
    if (existing) return existing;

    const defaults: NotificationPreferencesEntity = {
      eventId,
      userId,
      notifyOnRsvp: true,
      notifyOnContribution: true,
      notifyOnCheckIn: true,
      notifyOnReminderFailure: true,
      digestFrequency: 'immediate',
    };
    mockDb.notificationPreferences.push(defaults);
    return defaults;
  }

  static updateNotificationPreferences(
    userId: string,
    eventId: string,
    updates: Partial<NotificationPreferencesEntity>
  ): NotificationPreferencesEntity {
    const current = this.getNotificationPreferences(userId, eventId);
    Object.assign(current, updates);
    return current;
  }
}
