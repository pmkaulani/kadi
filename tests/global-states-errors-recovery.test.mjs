import test from 'node:test';
import assert from 'node:assert/strict';

import {
  ERROR_CATALOGUE,
  mapSafeError,
  SaveStateMachine,
  PaymentStateMachine,
} from '../src/lib/errors/catalog.ts';

test('Phase 17 — Error Catalogue Mapping & Leakage Prevention', () => {
  // 1. Safe Mapping of Network Offline Errors
  const netErr = mapSafeError(new Error('Failed to fetch: browser is offline'));
  assert.equal(netErr.code, 'NETWORK_OFFLINE');
  assert.equal(netErr.userMessage, "You're offline. Your changes may not have synced yet.");
  assert.equal(netErr.isRetryable, true);

  // 2. Safe Sanitization of SQL / DB Internals (Zero Schema or Stack Leakage)
  const sqlErr = mapSafeError(new Error('PostgreSQL Error 42601: syntax error at or near "SELECT * FROM users_private_credentials"'));
  assert.equal(sqlErr.code, 'UNEXPECTED_ERROR');
  assert.ok(!sqlErr.userMessage.includes('PostgreSQL'), 'Must never leak database provider name');
  assert.ok(!sqlErr.userMessage.includes('SELECT'), 'Must never leak SQL query syntax');
  assert.ok(!sqlErr.userMessage.includes('credentials'), 'Must never leak internal table names');
  assert.equal(sqlErr.userMessage, 'An unexpected issue occurred. Your progress has been preserved.');

  // 3. Session Expiration Error
  const authErr = mapSafeError(new Error('Session token expired at 2026-10-16'));
  assert.equal(authErr.code, 'SESSION_EXPIRED');
  assert.equal(authErr.userMessage, 'Your session has expired. Sign in to continue.');

  // 4. Permission / Role Denial Error
  const permErr = mapSafeError(new Error('Permission denied: role viewer cannot update settings'));
  assert.equal(permErr.code, 'PERMISSION_DENIED');
  assert.equal(permErr.userMessage, "You don't have permission to make this change.");

  // 5. RSVP Closed Error
  const rsvpErr = mapSafeError(new Error('Submissions are currently closed for this celebration'));
  assert.equal(rsvpErr.code, 'RSVP_CLOSED');

  // 6. Event Capacity Full
  const capErr = mapSafeError(new Error('Event has reached maximum capacity (200 guests)'));
  assert.equal(capErr.code, 'EVENT_FULL');
  assert.equal(capErr.userMessage, 'This event is full.');

  // 7. Save Conflict / Stale Revision
  const conflictErr = mapSafeError(new Error('Save conflict: revision 3 already exists on server'));
  assert.equal(conflictErr.code, 'SAVE_CONFLICT');
  assert.equal(conflictErr.userMessage, 'This invitation changed in another tab or device.');
});

test('Phase 17 — Monotonic Autosave State Machine with Out-of-Order Save Isolation', () => {
  const sm = new SaveStateMachine(1);
  assert.equal(sm.getState().status, 'idle');
  assert.equal(sm.getState().currentRevision, 1);
  assert.equal(sm.getState().lastSavedRevision, 1);

  // Step 1: User types title edit
  sm.registerEdit();
  assert.equal(sm.getState().status, 'unsaved');
  assert.equal(sm.getState().currentRevision, 2);

  // Step 2: Autosave starts for revision 2
  sm.startSaving(2);
  assert.equal(sm.getState().status, 'saving');

  // Step 3: User makes another edit while revision 2 save is still in-flight
  sm.registerEdit(); // revision 3
  assert.equal(sm.getState().status, 'unsaved');
  assert.equal(sm.getState().currentRevision, 3);

  // Step 4: Server responds with success for revision 2!
  // MONOTONIC INVARIANT:
  // Because currentRevision is 3, state must NOT become 'saved' — it must stay 'unsaved'!
  sm.saveSucceeded(2);
  assert.equal(sm.getState().status, 'unsaved', 'Must not falsely report saved when newer edits are pending');
  assert.equal(sm.getState().lastSavedRevision, 2);

  // Step 5: Autosave starts for revision 3
  sm.startSaving(3);
  assert.equal(sm.getState().status, 'saving');

  // Step 6: Server responds with success for revision 3
  sm.saveSucceeded(3);
  assert.equal(sm.getState().status, 'saved');
  assert.equal(sm.getState().lastSavedRevision, 3);
  assert.equal(sm.getState().currentRevision, 3);

  // Step 7: Offline handling
  sm.registerEdit(); // revision 4
  sm.goOffline();
  assert.equal(sm.getState().status, 'offline');

  // While offline, attempts to save are prevented
  sm.startSaving(4);
  assert.equal(sm.getState().status, 'offline');

  // Reconnecting returns to unsaved because revision 4 is uncommitted
  sm.reconnect();
  assert.equal(sm.getState().status, 'unsaved');
});

test('Phase 17 — Payment State Machine & Unknown Reconciliation Protection', () => {
  const psm = new PaymentStateMachine();
  assert.equal(psm.getState().status, 'ready');

  // 1. Initial Request
  psm.requestPayment({ amount: 1500, phone: '+254712345678' });
  assert.equal(psm.getState().status, 'requesting');
  assert.equal(psm.getState().amount, 1500);

  // 2. STK Push Dispatched -> Awaiting Confirmation
  psm.dispatchAwaiting('ws_CO_16102026_99482');
  assert.equal(psm.getState().status, 'awaiting_confirmation');

  // 3. Double-charge prevention while awaiting confirmation
  assert.throws(
    () => {
      psm.requestPayment({ amount: 1500, phone: '+254712345678' });
    },
    /We're waiting for payment confirmation/,
    'Must reject initiating a duplicate payment while confirmation is pending'
  );

  // 4. Ambiguous network timeout / Provider latency -> UNKNOWN state
  psm.markUnknown();
  assert.equal(psm.getState().status, 'unknown');
  assert.ok(psm.getState().errorMessage?.includes("We couldn't confirm the payment yet"));

  // 5. CRITICAL DOUBLE-DEBIT PREVENTION:
  // Must NOT allow new payment attempt until transaction is reconciled
  assert.throws(
    () => {
      psm.requestPayment({ amount: 1500, phone: '+254712345678' });
    },
    /Check status before trying again/,
    'Must prevent new payment request when prior status is unknown'
  );

  // 6. Reconciliation confirms success
  psm.markSucceeded();
  assert.equal(psm.getState().status, 'succeeded');
});

test('Phase 17 — Authoritative Error Catalog Invariants', () => {
  const requiredCodes = [
    'DRAFT_SAVE_FAILED',
    'NETWORK_OFFLINE',
    'SAVE_CONFLICT',
    'SESSION_EXPIRED',
    'FORM_REQUIRED',
    'EMAIL_INVALID',
    'RSVP_CLOSED',
    'EVENT_FULL',
    'INVITATION_UNAVAILABLE',
    'UPLOAD_TOO_LARGE',
    'UPLOAD_TYPE_UNSUPPORTED',
    'MESSAGE_SEND_FAILED',
    'CALENDAR_EXPORT_FAILED',
    'MAP_UNAVAILABLE',
    'RSVP_SUBMIT_FAILED',
    'PAYMENT_PENDING',
    'PAYMENT_FAILED',
    'PAYMENT_UNKNOWN',
    'PERMISSION_DENIED',
    'RATE_LIMITED',
    'TEMPLATE_UNAVAILABLE',
    'EVENT_CANCELLED',
    'NO_SEARCH_RESULTS',
    'IMPORT_PARTIAL',
  ];

  for (const code of requiredCodes) {
    const def = ERROR_CATALOGUE[code];
    assert.ok(def, `Error catalogue must contain entry for ${code}`);
    assert.ok(def.userMessage, `Code ${code} must have a user-facing message`);
    assert.ok(def.recoveryAction, `Code ${code} must specify a recovery action`);
    assert.ok(def.httpStatus >= 200 && def.httpStatus <= 599, `Code ${code} must have a valid HTTP status`);
  }
});
