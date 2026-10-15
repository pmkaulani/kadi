import test from 'node:test';
import assert from 'node:assert/strict';
import { hashPassword, verifyPassword } from '../src/lib/auth/password.ts';
import {
  createSessionToken,
  verifySessionToken,
  getAuthSession,
} from '../src/lib/auth/session.ts';
import { getDbAdapter, resetDbAdapter } from '../src/lib/db/index.ts';
import { EventService } from '../src/lib/services/event-service.ts';
import { GuestService } from '../src/lib/services/guest-service.ts';
import { RSVPService } from '../src/lib/services/rsvp-service.ts';
import { NotificationService } from '../src/lib/services/notification-service.ts';
import {
  isValidStatusTransition,
  CreateEventSchema,
  UpdateEventSchema,
  GuestImportPayloadSchema,
} from '../src/lib/validation/events.ts';

// -----------------------------------------------------------------------------
// 1. Password Hashing & Verification
// -----------------------------------------------------------------------------
test('Password Security - hashes with PBKDF2 salt and verifies constant-time', () => {
  const password = 'SuperSecretHostPassword2026!';
  const hash = hashPassword(password);

  assert.ok(hash.startsWith('pbkdf2$'), 'Hash should use pbkdf2 prefix');
  assert.ok(verifyPassword(password, hash), 'Correct password must verify as true');
  assert.equal(verifyPassword('WrongPassword123!', hash), false, 'Incorrect password must verify as false');
  assert.equal(verifyPassword('', hash), false, 'Empty password must verify as false');
  assert.equal(verifyPassword(password, 'tampered$hash$value'), false, 'Malformed hash must return false');
});

// -----------------------------------------------------------------------------
// 2. Cryptographic Session Token & Expiry
// -----------------------------------------------------------------------------
test('Session Management - creates signed HMAC session token and verifies payload', () => {
  const mockUser = {
    id: 'host-1',
    email: 'host@kadi.co.ke',
    name: 'Peter Kaulani',
    role: 'host',
  };

  const token = createSessionToken(mockUser);
  assert.ok(token.includes('.'), 'Session token should contain dot separator for signature');

  const verified = verifySessionToken(token);
  assert.ok(verified, 'Verified session should not be null');
  assert.equal(verified?.id, mockUser.id);
  assert.equal(verified?.email, mockUser.email);
  assert.equal(verified?.role, 'host');

  // Signature tampering
  const tamperedToken = token.slice(0, -4) + 'abcd';
  assert.equal(verifySessionToken(tamperedToken), null, 'Tampered token signature must be rejected');

  // Expired token simulation (negative days)
  const expiredToken = createSessionToken(mockUser, -1);
  assert.equal(verifySessionToken(expiredToken), null, 'Expired token must be rejected');
});

// -----------------------------------------------------------------------------
// 3. Database Adapter Boundary & Sandbox Diagnostics
// -----------------------------------------------------------------------------
test('Database Adapter - exposes diagnostic status and user repository operations', async () => {
  resetDbAdapter();
  const db = getDbAdapter();
  const diag = db.getDiagnostics();

  assert.equal(diag.driver, 'memory');
  assert.equal(diag.isPersistent, false, 'Memory adapter must honestly report non-persistence');

  // Seeded hosts lookup
  const host = await db.getUserByEmail('host@kadi.co.ke');
  assert.ok(host, 'Pre-seeded host-1 should exist');
  assert.equal(host?.id, 'host-1');

  // User password verification
  const hash = await db.getUserPasswordHash(host.id);
  assert.ok(hash, 'Host password hash must exist in repository');
  assert.ok(verifyPassword('KadiHost2026!', hash), 'Default host password must match');

  // Create isolated user
  const newUser = await db.createUser({
    email: 'newplanner@kadi.co.ke',
    name: 'Jane Mutua',
    role: 'planner',
    passwordHash: hashPassword('PlannerPass2026!'),
  });

  assert.ok(newUser.id);
  const fetched = await db.getUserByEmail('newplanner@kadi.co.ke');
  assert.equal(fetched?.name, 'Jane Mutua');
});

// -----------------------------------------------------------------------------
// 4. Multi-User Ownership Isolation (User A vs User B)
// -----------------------------------------------------------------------------
test('Ownership Isolation - User B cannot view, modify, or manage User A events', async () => {
  const userAId = 'host-1';
  const userBId = 'host-2';

  // User A creates an event
  const eventA = EventService.createEvent({
    hostId: userAId,
    title: 'Private Gala for User A',
    category: 'corporate',
    venue: 'Villa Rosa Kempinski',
    city: 'Nairobi',
    date: 'Saturday, 12 December 2026',
    time: '6:00 PM',
    heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552',
    rsvpDeadline: '1 December 2026',
  });

  // User A adds a guest
  const guestA = GuestService.addGuest(eventA.id, {
    displayName: 'Ambassador Amina',
    group: 'VIP',
    contactEmail: 'amina@example.com',
    allowedPlusOnes: 2,
  });

  // Verification 1: Listing events by User B isolates User A's event
  const userBEvents = EventService.listEvents(userBId);
  const foundAInB = userBEvents.some((e) => e.id === eventA.id);
  assert.equal(foundAInB, false, 'User B event list must NEVER contain User A events');

  // Verification 2: Checking event ownership matches user A
  assert.equal(eventA.hostId, userAId);
  assert.notEqual(eventA.hostId, userBId);

  // Verification 3: Guest isolation
  const guestsInEventA = GuestService.listGuests(eventA.id);
  assert.ok(guestsInEventA.some((g) => g.id === guestA.id));

  // Verification 4: Cross-event token rejection in RSVP
  assert.throws(
    () => {
      RSVPService.submitRSVP({
        eventId: 'event-memorial-1', // Different event
        guestToken: guestA.token, // Token for Event A
        primaryName: 'Ambassador Amina',
        contact: '0712345678',
        status: 'yes',
        attendeeCount: 1,
      });
    },
    /Cross-event token error|belongs to a different event/
  );
});

// -----------------------------------------------------------------------------
// 5. Clean Event Duplication (No Leaking RSVPs or Guest Tokens)
// -----------------------------------------------------------------------------
test('Event Duplication Security - creates clean draft without copying RSVPs, attendees, or guest tokens', () => {
  // Original event with existing guest and RSVP
  const original = EventService.getEventById('event-wedding-1');
  assert.ok(original, 'Original wedding event must exist');

  const originalRSVPs = RSVPService.listRSVPs(original.id);
  const originalGuests = GuestService.listGuests(original.id);
  assert.ok(originalRSVPs.length > 0, 'Original event should have RSVPs');
  assert.ok(originalGuests.length > 0, 'Original event should have guests');

  // Duplicate the event
  const duplicate = EventService.duplicateEvent(original.id, 'host-1');

  // Assertions on the duplicate
  assert.notEqual(duplicate.id, original.id, 'Duplicate must have new event ID');
  assert.notEqual(duplicate.slug, original.slug, 'Duplicate must have distinct slug');
  assert.equal(duplicate.status, 'draft', 'Duplicate must strictly start in draft status');
  assert.ok(duplicate.title.startsWith('Copy of '), 'Duplicate title should reflect copy');

  // Ensure duplicate has ZERO copied RSVPs or guest tokens
  const duplicateRSVPs = RSVPService.listRSVPs(duplicate.id);
  const duplicateGuests = GuestService.listGuests(duplicate.id);
  const duplicateAttendees = RSVPService.getRSVPSummary(duplicate.id).namedAttendeesList;

  assert.equal(duplicateRSVPs.length, 0, 'Duplicated event must have zero RSVP submissions');
  assert.equal(duplicateGuests.length, 0, 'Duplicated event must have zero guest records');
  assert.equal(duplicateAttendees.length, 0, 'Duplicated event must have zero named attendees');
});

// -----------------------------------------------------------------------------
// 6. Draft Slug Security & Signed Preview Tokens
// -----------------------------------------------------------------------------
test('Draft Security - signed preview tokens require valid HMAC signature and reject expired tokens', () => {
  const draftEventId = 'event-draft-999';

  // 1. Generate signed token
  const validToken = NotificationService.createSignedPreviewToken(draftEventId, 24);
  assert.ok(validToken.startsWith('prev_'), 'Preview token must start with prev_ prefix');
  assert.ok(NotificationService.verifyPreviewToken(validToken, draftEventId), 'Valid token must verify');

  // 2. Wrong event ID verification
  assert.equal(
    NotificationService.verifyPreviewToken(validToken, 'different-event-123'),
    false,
    'Preview token must be rejected when tested against a different event'
  );

  // 3. Tampered signature
  const tamperedToken = validToken.slice(0, -4) + '9999';
  assert.equal(
    NotificationService.verifyPreviewToken(tamperedToken, draftEventId),
    false,
    'Tampered preview token signature must fail verification'
  );

  // 4. Expired token (negative expiry hours)
  const expiredToken = NotificationService.createSignedPreviewToken(draftEventId, -2);
  assert.equal(
    NotificationService.verifyPreviewToken(expiredToken, draftEventId),
    false,
    'Expired preview token must be rejected'
  );
});

// -----------------------------------------------------------------------------
// 7. Event Status State Transitions & Zod Validation
// -----------------------------------------------------------------------------
test('Status State Transitions - enforces valid lifecycles and rejects illegal transitions', () => {
  // Valid transitions
  assert.equal(isValidStatusTransition('draft', 'published'), true);
  assert.equal(isValidStatusTransition('published', 'archived'), true);
  assert.equal(isValidStatusTransition('draft', 'archived'), true);
  assert.equal(isValidStatusTransition('archived', 'draft'), true);

  // Invalid transitions
  assert.equal(isValidStatusTransition('draft', 'archived'), true);
  assert.equal(isValidStatusTransition('archived', 'published'), false);
  assert.equal(isValidStatusTransition('draft', 'unknown'), false);

  // Service-level enforcement
  const testEvent = EventService.createEvent({
    hostId: 'host-1',
    title: 'State Transition Test',
    category: 'birthday',
    status: 'draft',
    date: 'Saturday, 12 December 2026',
    time: '2:00 PM',
    venue: 'Safari Park',
    city: 'Nairobi',
    heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552',
    rsvpDeadline: '1 December 2026',
  });

  // Valid update to published
  const published = EventService.publishEvent(testEvent.id);
  assert.equal(published.status, 'published');

  // Valid update to archived
  const archived = EventService.updateEvent(testEvent.id, { status: 'archived' });
  assert.equal(archived.status, 'archived');

  // Illegal direct update from archived to published
  assert.throws(() => {
    EventService.updateEvent(testEvent.id, { status: 'published' });
  }, /Invalid status transition/);
});

// -----------------------------------------------------------------------------
// 8. Unique Slug Enforcement
// -----------------------------------------------------------------------------
test('Slug Uniqueness - guarantees no duplicate slugs across events in storage', () => {
  const slug1 = EventService.generateUniqueSlug('Kiprono Wedding');
  const slug2 = EventService.generateUniqueSlug('Kiprono Wedding');

  assert.ok(slug1.startsWith('kiprono-wedding-'));
  assert.ok(slug2.startsWith('kiprono-wedding-'));
  assert.notEqual(slug1, slug2, 'Consecutive slug generation must never collide');

  // Collision detection on update
  const existing = EventService.getEventById('event-wedding-1');
  assert.ok(existing);

  const another = EventService.createEvent({
    hostId: 'host-1',
    title: 'Another Celebration',
    category: 'wedding',
    venue: 'Nairobi',
    date: 'Saturday, 12 December 2026',
    time: '2:00 PM',
    heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552',
    rsvpDeadline: '1 December 2026',
  });

  assert.throws(() => {
    EventService.updateEvent(another.id, { slug: existing.slug });
  }, /already in use/);
});

// -----------------------------------------------------------------------------
// 9. Zod Schemas & Guest Import Validation
// -----------------------------------------------------------------------------
test('Validation Schemas - rejects malformed event and guest import payloads', () => {
  // 1. Rejects invalid event category
  const invalidCategory = CreateEventSchema.safeParse({
    title: 'Test Event',
    category: 'non-existent-category',
    templateId: 'savannah-twilight',
    hosts: 'Host',
    date: 'Date',
    time: 'Time',
    venue: 'Venue',
    heroImage: 'https://example.com/img.jpg',
    rsvpDeadline: 'Deadline',
  });
  assert.equal(invalidCategory.success, false);

  // 2. Rejects negative plus-ones or > 10 plus-ones in guest import
  const invalidImport = GuestImportPayloadSchema.safeParse({
    rows: [
      {
        displayName: 'Guest With Negative Plus Ones',
        allowedPlusOnes: -1,
      },
    ],
  });
  assert.equal(invalidImport.success, false);

  const validImport = GuestImportPayloadSchema.safeParse({
    rows: [
      {
        displayName: 'Valid Guest & Family',
        group: 'Family',
        allowedPlusOnes: 3,
        contactEmail: 'valid@example.com',
      },
    ],
  });
  assert.equal(validImport.success, true);
});

// -----------------------------------------------------------------------------
// 10. Data Leak Prevention (Public Sanitization)
// -----------------------------------------------------------------------------
test('Data Leak Prevention - public event sanitization strips internal host IDs and secrets', () => {
  const event = EventService.getEventById('event-wedding-1');
  assert.ok(event);

  const sanitized = EventService.sanitizeForPublic(event);
  assert.equal('hostId' in sanitized, false, 'hostId must be stripped in public views');
  assert.equal('mpesaConsumerSecret' in sanitized, false, 'mpesaConsumerSecret must never be exposed');
  assert.equal(sanitized.title, event.title);
  assert.equal(sanitized.slug, event.slug);
});
