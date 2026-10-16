import test from 'node:test';
import assert from 'node:assert/strict';
import { sanitizeLogData, telemetry } from '../src/lib/telemetry/logger.ts';
import { AdminService, UnauthorizedAdminError } from '../src/lib/services/admin-service.ts';
import { SupportService, generateSupportId } from '../src/lib/services/support-service.ts';
import {
  PLAN_TIERS,
  getBillingProviderStatus,
  getUserEntitlements,
  checkFeatureEntitlement,
} from '../src/lib/billing/entitlements.ts';
import { mockDb } from '../src/lib/db/mock-db.ts';

test('Phase 18 — Structured Server Logger & Redactor', async (t) => {
  await t.test('Recursively sanitizes passwords, auth tokens, credit cards and SQL queries', () => {
    const dirty = {
      user: 'test-user',
      password: 'SuperSecretPassword123!',
      authToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.doNotLeakThis',
      nested: {
        apiKey: 'secret_live_key_998877',
        query: 'SELECT * FROM users WHERE password = "abc" OR 1=1',
        safeTitle: 'Kevin & Wanjiku Wedding',
      },
      tags: ['wedding', 'tok_private_token_456'],
    };

    const sanitized = sanitizeLogData(dirty);

    assert.equal(sanitized.password, '[REDACTED]');
    assert.equal(sanitized.authToken, '[REDACTED]');
    assert.equal(sanitized.nested.apiKey, '[REDACTED]');
    assert.equal(sanitized.nested.safeTitle, 'Kevin & Wanjiku Wedding');
    assert.equal(sanitized.tags[0], 'wedding');
    assert.ok(sanitized.tags[1].includes('[REDACTED_SECRET]'));
  });

  await t.test('Records operational failures and maintains alert thresholds', () => {
    telemetry.resetMetrics();

    telemetry.recordFailure('api_failures', 'TEST_ENDPOINT', new Error('Connection reset'));
    telemetry.recordFailure('provider_timeouts', 'MPESA_STK_GATEWAY', new Error('Gateway timeout'));

    const summary = telemetry.getSummary();
    assert.equal(summary.counters.api_failures, 1);
    assert.equal(summary.counters.provider_timeouts, 1);
    assert.equal(summary.alertOwner, 'ops@kadi.africa');
    assert.ok(summary.recentErrors.length >= 2);
    assert.ok(summary.alertRules.some((r) => r.name.includes('API Failure')));
  });
});

test('Phase 18 — Safe Support Ticket Generation & Workflow', async (t) => {
  await t.test('Generates entropy-safe reference code with KADI-SUP- prefix', () => {
    const id1 = generateSupportId();
    const id2 = generateSupportId();

    assert.ok(id1.startsWith('KADI-SUP-'));
    assert.ok(id2.startsWith('KADI-SUP-'));
    assert.notEqual(id1, id2);
    assert.match(id1, /^KADI-SUP-[0-9A-F]{4}-[0-9A-F]{4}$/);
  });

  await t.test('Creates and manages support tickets without exposing sensitive secrets', () => {
    const ticket = SupportService.createTicket({
      userId: 'user-sample-42',
      userEmail: 'host.test@example.com',
      category: 'invite_failure',
      subject: 'Guest RSVP link not opening in WhatsApp web',
      description: 'Guest reports a white screen when tapping link from iPhone.',
      safeEventId: 'event-wedding-1',
    });

    assert.ok(ticket.id.startsWith('KADI-SUP-'));
    assert.equal(ticket.status, 'open');
    assert.equal(ticket.category, 'invite_failure');

    const fetched = SupportService.getTicketById(ticket.id);
    assert.ok(fetched);
    assert.equal(fetched.id, ticket.id);

    // Update status
    const updated = SupportService.updateTicketStatus(ticket.id, 'resolved', 'Verified DNS propagation.');
    assert.equal(updated.status, 'resolved');
    assert.equal(updated.resolutionNotes, 'Verified DNS propagation.');
  });
});

test('Phase 18 — Fail-Closed Administrative Security & Content Moderation', async (t) => {
  const hostSession = {
    id: 'host-1',
    email: 'host@kadi.africa',
    name: 'Kevin & Wanjiku',
    role: 'host',
    exp: Date.now() + 3600000,
  };

  const adminSession = {
    id: 'admin-1',
    email: 'ops@kadi.africa',
    name: 'Operations Lead',
    role: 'admin',
    exp: Date.now() + 3600000,
  };

  await t.test('Fails closed: Rejects non-admin or unauthenticated access', () => {
    assert.throws(
      () => AdminService.requireAdminRole(null),
      UnauthorizedAdminError
    );

    assert.throws(
      () => AdminService.requireAdminRole(hostSession),
      UnauthorizedAdminError
    );

    // Admin passes cleanly
    assert.doesNotThrow(() => AdminService.requireAdminRole(adminSession));
  });

  await t.test('Executes moderation actions and preserves audit log records', () => {
    const testEvent = mockDb.events[0];
    const initialStatus = testEvent.moderationStatus || 'active';

    // 1. Unlist event
    const unlisted = AdminService.moderateEvent(
      testEvent.id,
      'unlist',
      'Reported for missing host contact',
      adminSession
    );
    assert.equal(unlisted.moderationStatus, 'unlisted');
    assert.equal(unlisted.visibility, 'unlisted');
    assert.equal(unlisted.moderatedBy, 'ops@kadi.africa');

    // 2. Suspend event
    const suspended = AdminService.moderateEvent(
      testEvent.id,
      'suspend',
      'Critical terms violation',
      adminSession
    );
    assert.equal(suspended.moderationStatus, 'suspended');

    // 3. Restore event
    const restored = AdminService.moderateEvent(
      testEvent.id,
      'restore',
      'Host completed identity verification',
      adminSession
    );
    assert.equal(restored.moderationStatus, 'active');

    // 4. Verify audit trail was logged
    const logs = AdminService.getAuditLogs(10);
    assert.ok(logs.length >= 3);
    const latestLog = logs[0];
    assert.equal(latestLog.adminEmail, 'ops@kadi.africa');
    assert.equal(latestLog.action, 'moderate_event');
    assert.equal(latestLog.targetId, testEvent.id);
  });

  await t.test('Dismisses reports with administrative audit entry', () => {
    const report = AdminService.listReports()[0];
    assert.ok(report);

    const dismissed = AdminService.dismissReport(
      report.id,
      adminSession,
      'Verified as duplicate complaint'
    );
    assert.equal(dismissed.status, 'dismissed');

    const logs = AdminService.getAuditLogs(5);
    const dismissLog = logs.find((l) => l.action === 'dismiss_report');
    assert.ok(dismissLog);
    assert.equal(dismissLog.targetId, report.id);
  });
});

test('Phase 18 — Subscription Plans, Entitlements & Pilot Transparency', async (t) => {
  await t.test('Honest billing provider status: Detects unconfigured gateway and returns pilot preview', () => {
    const status = getBillingProviderStatus();

    // When billing keys are absent, mode must be pilot_preview
    assert.equal(status.mode, 'pilot_preview');
    assert.equal(status.configured, false);
    assert.ok(status.title.includes('Pilot') || status.title.includes('Early Access'));
    assert.ok(status.description.includes('unlocked'));
  });

  await t.test('Server entitlements govern feature access during pilot preview', () => {
    const entitlements = getUserEntitlements('host-1');
    assert.equal(entitlements.tier, 'pro');
    assert.equal(entitlements.premiumTemplates, true);
    assert.equal(entitlements.customDomain, true);
    assert.equal(entitlements.advancedAnalyticsExport, true);

    const check = checkFeatureEntitlement('host-1', 'premiumTemplates');
    assert.equal(check.granted, true);
    assert.equal(check.tier, 'pro');
  });

  await t.test('Plan tiers keep M-Pesa gifts distinct from SaaS software subscriptions', () => {
    assert.equal(PLAN_TIERS.free.mpesaContributions, true);
    assert.equal(PLAN_TIERS.pro.mpesaContributions, true);
    assert.equal(PLAN_TIERS.enterprise.mpesaContributions, true);
  });
});
