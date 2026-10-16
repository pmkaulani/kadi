import test from 'node:test';
import assert from 'node:assert/strict';

import { EventService } from '../src/lib/services/event-service.ts';
import { GuestService } from '../src/lib/services/guest-service.ts';
import { MessagingService } from '../src/lib/services/messaging-service.ts';
import { CoHostService, ROLE_PERMISSIONS } from '../src/lib/services/cohost-service.ts';
import { NotificationService } from '../src/lib/services/notification-service.ts';

test('Phase 15 — Live Audience Calculation at Send Time & Opt-Out Enforcement', () => {
  const eventId = 'event-phase15-audience';
  const event = EventService.createEvent({
    id: eventId,
    title: 'Audience Calculation Gala',
    category: 'wedding',
    status: 'published',
  });

  // Setup Guests with various RSVP states and opt-out
  const guest1 = GuestService.addGuest(eventId, {
    displayName: 'Wanjiku Mwangi (Attending)',
    contactPhone: '+254711000001',
    group: 'Family',
  });
  guest1.status = 'yes';

  const guest2 = GuestService.addGuest(eventId, {
    displayName: 'Brian Otieno (Pending)',
    contactPhone: '+254711000002',
    group: 'Friends',
  });
  guest2.status = 'pending';

  const guest3 = GuestService.addGuest(eventId, {
    displayName: 'Sarah Kamau (Declined)',
    contactPhone: '+254711000003',
    group: 'Family',
  });
  guest3.status = 'no';

  const guest4 = GuestService.addGuest(eventId, {
    displayName: 'David Kiptoo (Opted Out)',
    contactPhone: '+254711000004',
    group: 'Friends',
  });
  guest4.status = 'pending';
  guest4.optedOut = true; // Guest opted out of automated communications

  // 1. Pending Filter
  const pendingAudience = MessagingService.getAudienceGuests(eventId, 'pending');
  assert.equal(pendingAudience.length, 1, 'Only non-opted-out pending guest should be in pending audience');
  assert.equal(pendingAudience[0].id, guest2.id);

  // 2. Attending Filter
  const attendingAudience = MessagingService.getAudienceGuests(eventId, 'attending');
  assert.equal(attendingAudience.length, 1);
  assert.equal(attendingAudience[0].id, guest1.id);

  // 3. Declined Filter
  const declinedAudience = MessagingService.getAudienceGuests(eventId, 'declined');
  assert.equal(declinedAudience.length, 1);
  assert.equal(declinedAudience[0].id, guest3.id);

  // 4. All Filter (Excludes opted out)
  const allAudience = MessagingService.getAudienceGuests(eventId, 'all');
  assert.equal(allAudience.length, 3, 'Opted out guest must be omitted from total eligible audience');
  assert.ok(!allAudience.some((g) => g.id === guest4.id), 'Opted out guest must not receive messages');

  // 5. Group Filter
  const familyAudience = MessagingService.getAudienceGuests(eventId, 'group:Family');
  assert.equal(familyAudience.length, 2, 'Family group has 2 guests');
});

test('Phase 15 — Idempotency & Duplicate Send Prevention', () => {
  const eventId = 'event-phase15-idempotency';
  const event = EventService.createEvent({
    id: eventId,
    title: 'Idempotency Test Soiree',
    category: 'birthday',
    status: 'published',
  });

  const guest = GuestService.addGuest(eventId, {
    displayName: 'Alice Kariuki',
    contactPhone: '+254722111222',
    group: 'VIP',
  });

  const idempotencyKey = 'idem_key_unique_test_12345';

  // First creation
  const job1 = MessagingService.createMessageJob(eventId, {
    idempotencyKey,
    subject: 'First Invitation Try',
    body: 'Hello {GuestName}, please join us!',
    channel: 'manual_whatsapp',
    audienceFilter: 'all',
  });

  assert.ok(job1.id);
  assert.equal(job1.idempotencyKey, idempotencyKey);
  assert.equal(job1.targetGuestIds.length, 1);

  // Duplicate submission with identical idempotencyKey
  const job2 = MessagingService.createMessageJob(eventId, {
    idempotencyKey,
    subject: 'Duplicate Request',
    body: 'Different body should be ignored because idempotency key matched',
    channel: 'manual_whatsapp',
    audienceFilter: 'all',
  });

  assert.equal(job1.id, job2.id, 'Duplicate send with same idempotency key must return existing job');

  // Verify only 1 job exists for this key
  const matchingJobs = MessagingService.listMessageJobs(eventId).filter((j) => j.idempotencyKey === idempotencyKey);
  assert.equal(matchingJobs.length, 1, 'Exactly one job must be stored');
});

test('Phase 15 — Partial Delivery Failure & Failed-Only Retry Invariant', async () => {
  const eventId = 'event-phase15-retry';
  const event = EventService.createEvent({
    id: eventId,
    title: 'Retry Invariant Dinner',
    category: 'corporate',
    status: 'published',
  });

  const g1 = GuestService.addGuest(eventId, { displayName: 'Guest One', contactPhone: '+254711111111' });
  const g2 = GuestService.addGuest(eventId, { displayName: 'Guest Two', contactPhone: '+254722222222' });
  const g3 = GuestService.addGuest(eventId, { displayName: 'Guest Three', contactPhone: '+254733333333' });

  const job = MessagingService.createMessageJob(eventId, {
    idempotencyKey: 'idem_retry_test_999',
    subject: 'Corporate Programme',
    body: 'Dear {GuestName}, here is the schedule: {InvitationLink}',
    channel: 'sms',
    audienceFilter: 'all',
  });

  assert.equal(job.targetGuestIds.length, 3);

  // Simulate dispatch where g2 fails (e.g. carrier timeout / invalid phone)
  const dispatched = await MessagingService.dispatchJob(job.id, {
    forceProviderSuccess: true,
    simulatedFailures: [g2.id],
  });

  assert.equal(dispatched.status, 'partial', 'Job must be marked partial when some recipients fail');
  assert.equal(dispatched.successfulGuestIds.length, 2);
  assert.ok(dispatched.successfulGuestIds.includes(g1.id));
  assert.ok(dispatched.successfulGuestIds.includes(g3.id));
  assert.equal(dispatched.failedGuestIds.length, 1);
  assert.ok(dispatched.failedGuestIds.includes(g2.id));

  // Execute Retry: Must ONLY target g2, strictly NEVER resending to g1 or g3
  const retried = await MessagingService.retryFailedRecipients(job.id, { succeedOnRetry: true });

  assert.equal(retried.status, 'delivered', 'Job must be marked delivered after all failed recipients succeed');
  assert.equal(retried.failedGuestIds.length, 0);
  assert.equal(retried.successfulGuestIds.length, 3);
  assert.ok(retried.successfulGuestIds.includes(g2.id));
});

test('Phase 15 — Provider Unconfigured Honesty (No Fake Delivery)', async () => {
  const eventId = 'event-phase15-unconfigured';
  const event = EventService.createEvent({
    id: eventId,
    title: 'Unconfigured Provider Test',
    category: 'wedding',
    status: 'published',
  });

  const guest = GuestService.addGuest(eventId, { displayName: 'Test Recipient', contactPhone: '+254799000111' });

  const job = MessagingService.createMessageJob(eventId, {
    idempotencyKey: 'idem_unconfigured_provider',
    subject: 'Automated WhatsApp Cloud Message',
    body: 'Automated message template',
    channel: 'whatsapp_cloud',
    audienceFilter: 'all',
  });

  // Dispatch without mocked provider credentials
  const result = await MessagingService.dispatchJob(job.id, { forceProviderSuccess: false });

  // When credentials are not set in environment, status must be unconfigured or failed, never delivered!
  if (!NotificationService.isProviderConfigured('whatsapp_cloud')) {
    assert.equal(result.status, 'unconfigured', 'Must not fake delivery when provider credentials are unset');
    assert.ok(result.failureReason?.includes('unconfigured'));
    assert.equal(result.successfulGuestIds.length, 0);
  }
});

test('Phase 15 — Scheduled Reminders & Timezone Preservation & Cancellation', () => {
  const eventId = 'event-phase15-schedule';
  const event = EventService.createEvent({
    id: eventId,
    title: 'Scheduled Reminder Luncheon',
    category: 'graduation',
    status: 'published',
    timezone: 'Africa/Nairobi',
  });

  const guest = GuestService.addGuest(eventId, { displayName: 'Grad Guest', contactPhone: '+254700000000' });

  const futureDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();

  const job = MessagingService.createMessageJob(eventId, {
    idempotencyKey: 'idem_scheduled_reminder_1',
    subject: 'Graduation Reminder',
    body: 'Reminder for {GuestName}: event takes place on {Date}.',
    channel: 'sms',
    audienceFilter: 'all',
    scheduledFor: futureDate,
    timezone: 'Africa/Nairobi',
  });

  assert.equal(job.status, 'scheduled', 'Job scheduled in future must have status scheduled');
  assert.equal(job.timezone, 'Africa/Nairobi', 'Event timezone must be preserved');
  assert.equal(job.scheduledFor, futureDate);

  // Cancel Reminder
  const cancelled = MessagingService.cancelScheduledJob(job.id, 'host-1');
  assert.equal(cancelled.status, 'cancelled');

  // Verify audit record was logged
  const audit = MessagingService.listAuditLogs(eventId).find(
    (a) => a.messageJobId === job.id && a.action === 'reminder_cancelled'
  );
  assert.ok(audit, 'Audit trail must record reminder cancellation');
});

test('Phase 15 — Test Preview Message (Host Isolation)', async () => {
  const eventId = 'event-phase15-test-preview';
  const event = EventService.createEvent({
    id: eventId,
    title: 'Preview Isolation Test',
    category: 'housewarming',
    status: 'published',
  });

  const realGuest = GuestService.addGuest(eventId, {
    displayName: 'Real Guest Who Must Not Be Messaged',
    contactPhone: '+254711999999',
  });

  const testRecipient = '+254722000000';
  const res = await MessagingService.sendTestPreview(
    eventId,
    {
      subject: 'Preview: Welcome to our Home',
      body: 'Dear {GuestName}, welcome on {Date} at {Venue}!',
      channel: 'email',
      testRecipient,
      hostId: 'host-1',
    }
  );

  assert.equal(res.success, true);
  assert.equal(res.recipient, testRecipient);
  assert.ok(res.preview.includes('Sample Guest'));

  // Ensure no message job was targeted to the real guest
  const jobsForRealGuest = MessagingService.listMessageJobs(eventId).filter(
    (j) => j.targetGuestIds.includes(realGuest.id)
  );
  assert.equal(jobsForRealGuest.length, 0, 'Real guests must never be targeted by a test preview');
});

test('Phase 15 — Event Change Diff Detector & Update Announcement Draft', () => {
  const eventId = 'event-phase15-diff';
  const event = EventService.createEvent({
    id: eventId,
    title: 'Venue Change Wedding',
    date: 'Saturday, 12 December 2026',
    time: '2:00 PM EAT',
    venue: 'Villa Rosa Kempinski, Nairobi',
    status: 'published',
  });

  // Previous snapshot before venue change
  const previousSnapshot = {
    date: 'Saturday, 12 December 2026',
    time: '2:00 PM EAT',
    venue: 'Safari Park Hotel, Thika Road',
    status: 'published',
  };

  const diffResult = MessagingService.detectEventDiffAndDraftUpdate(
    previousSnapshot,
    event
  );

  assert.equal(diffResult.hasChanges, true);
  assert.equal(diffResult.changes.length, 1);
  assert.equal(diffResult.changes[0].field, 'Venue');
  assert.equal(diffResult.changes[0].previousValue, 'Safari Park Hotel, Thika Road');
  assert.equal(diffResult.changes[0].newValue, 'Villa Rosa Kempinski, Nairobi');
  assert.ok(diffResult.suggestedBody.includes('Venue: updated from "Safari Park Hotel, Thika Road" to "Villa Rosa Kempinski, Nairobi"'));
});

test('Phase 15 — Least Privilege Role Enforcement for Message Management', () => {
  assert.ok(ROLE_PERMISSIONS.owner.includes('manage_messages'));
  assert.ok(ROLE_PERMISSIONS.manager.includes('manage_messages'));
  assert.ok(ROLE_PERMISSIONS.guest_manager.includes('manage_messages'));
  assert.ok(!ROLE_PERMISSIONS.check_in_staff.includes('manage_messages'), 'Check-in staff cannot manage messages');
});
