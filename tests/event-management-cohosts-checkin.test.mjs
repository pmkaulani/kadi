import test from 'node:test';
import assert from 'node:assert/strict';

import { mockDb } from '../src/lib/db/mock-db.ts';
import { EventService } from '../src/lib/services/event-service.ts';
import { GuestService } from '../src/lib/services/guest-service.ts';
import { RSVPService } from '../src/lib/services/rsvp-service.ts';
import { CoHostService, ROLE_PERMISSIONS } from '../src/lib/services/cohost-service.ts';
import { CheckInService } from '../src/lib/services/checkin-service.ts';

test('Phase 14 — Role-Based Permission Matrix (Least Privilege Enforcement)', () => {
  // Test Event
  const testEventId = 'event-phase14-roles';
  const ownerId = 'host-phase14-owner';

  const testEvent = EventService.createEvent({
    id: testEventId,
    hostId: ownerId,
    title: 'Roles & Permissions Gala',
    category: 'corporate',
    status: 'published',
  });

  // Setup Co-Hosts with explicit roles
  const manager = CoHostService.inviteCoHost(testEventId, {
    email: 'manager@kadi.co.ke',
    name: 'Event Manager Alice',
    role: 'manager',
  });
  CoHostService.acceptInvite(manager.inviteToken, { email: 'manager@kadi.co.ke' });

  const guestManager = CoHostService.inviteCoHost(testEventId, {
    email: 'guestmgr@kadi.co.ke',
    name: 'Guest Manager Bob',
    role: 'guest_manager',
  });
  CoHostService.acceptInvite(guestManager.inviteToken, { email: 'guestmgr@kadi.co.ke' });

  const checkInStaff = CoHostService.inviteCoHost(testEventId, {
    email: 'staff@kadi.co.ke',
    name: 'Checkin Staff Charlie',
    role: 'check_in_staff',
  });
  CoHostService.acceptInvite(checkInStaff.inviteToken, { email: 'staff@kadi.co.ke' });

  const ownerSession = { id: ownerId, email: 'owner@kadi.co.ke', name: 'Owner', role: 'host', exp: 0 };
  const managerSession = { id: 'user-manager', email: 'manager@kadi.co.ke', name: 'Alice', role: 'host', exp: 0 };
  const guestMgrSession = { id: 'user-guestmgr', email: 'guestmgr@kadi.co.ke', name: 'Bob', role: 'host', exp: 0 };
  const staffSession = { id: 'user-staff', email: 'staff@kadi.co.ke', name: 'Charlie', role: 'host', exp: 0 };
  const strangerSession = { id: 'user-stranger', email: 'stranger@example.com', name: 'Stranger', role: 'host', exp: 0 };

  // 1. Owner has all permissions
  assert.equal(CoHostService.assertPermission(testEventId, ownerSession, 'manage_event').allowed, true);
  assert.equal(CoHostService.assertPermission(testEventId, ownerSession, 'manage_guests').allowed, true);
  assert.equal(CoHostService.assertPermission(testEventId, ownerSession, 'export_data').allowed, true);
  assert.equal(CoHostService.assertPermission(testEventId, ownerSession, 'check_in').allowed, true);
  assert.equal(CoHostService.assertPermission(testEventId, ownerSession, 'delete_event').allowed, true);

  // 2. Manager can edit event, manage guests, export data, and check in; CANNOT delete event
  assert.equal(CoHostService.assertPermission(testEventId, managerSession, 'manage_event').allowed, true);
  assert.equal(CoHostService.assertPermission(testEventId, managerSession, 'manage_guests').allowed, true);
  assert.equal(CoHostService.assertPermission(testEventId, managerSession, 'export_data').allowed, true);
  assert.equal(CoHostService.assertPermission(testEventId, managerSession, 'check_in').allowed, true);
  assert.equal(CoHostService.assertPermission(testEventId, managerSession, 'delete_event').allowed, false);

  // 3. Guest List Manager can manage guests and export; CANNOT edit event or delete
  assert.equal(CoHostService.assertPermission(testEventId, guestMgrSession, 'manage_guests').allowed, true);
  assert.equal(CoHostService.assertPermission(testEventId, guestMgrSession, 'export_data').allowed, true);
  assert.equal(CoHostService.assertPermission(testEventId, guestMgrSession, 'check_in').allowed, true);
  assert.equal(CoHostService.assertPermission(testEventId, guestMgrSession, 'manage_event').allowed, false);
  assert.equal(CoHostService.assertPermission(testEventId, guestMgrSession, 'delete_event').allowed, false);

  // 4. Check-in Staff can ONLY check in; CANNOT export data, edit event, or manage guests (Least Privilege)
  assert.equal(CoHostService.assertPermission(testEventId, staffSession, 'check_in').allowed, true);
  assert.equal(CoHostService.assertPermission(testEventId, staffSession, 'export_data').allowed, false);
  assert.equal(CoHostService.assertPermission(testEventId, staffSession, 'manage_guests').allowed, false);
  assert.equal(CoHostService.assertPermission(testEventId, staffSession, 'manage_event').allowed, false);

  // 5. Stranger has zero access
  assert.equal(CoHostService.assertPermission(testEventId, strangerSession, 'check_in').allowed, false);
  assert.equal(CoHostService.assertPermission(testEventId, strangerSession, 'export_data').allowed, false);
});

test('Phase 14 — Co-Host Invitation Lifecycle (Invite, Accept, Revoke)', () => {
  const eventId = 'event-phase14-invite-lifecycle';
  EventService.createEvent({ id: eventId, hostId: 'host-1', title: 'Lifecycle Gala' });

  // 1. Send invite
  const cohost = CoHostService.inviteCoHost(eventId, {
    email: 'newplanner@kadi.co.ke',
    name: 'Faith Mwende',
    role: 'manager',
  });
  assert.ok(cohost.inviteToken.startsWith('tok_cohost_'));
  assert.equal(cohost.status, 'pending');

  // 2. Reject duplicate invite to same email
  assert.throws(
    () => {
      CoHostService.inviteCoHost(eventId, {
        email: 'newplanner@kadi.co.ke',
        role: 'check_in_staff',
      });
    },
    /An active invitation has already been sent/
  );

  // 3. Accept invite
  const accepted = CoHostService.acceptInvite(cohost.inviteToken, {
    email: 'newplanner@kadi.co.ke',
    name: 'Faith Mwende',
  });
  assert.equal(accepted.status, 'accepted');
  assert.ok(accepted.acceptedAt);

  // 4. Revoke access
  const revoked = CoHostService.revokeCoHost(accepted.id);
  assert.equal(revoked.status, 'revoked');

  // User with revoked token loses permissions
  const revokedSession = { id: 'u-revoked', email: 'newplanner@kadi.co.ke', name: 'Faith', role: 'host', exp: 0 };
  assert.equal(CoHostService.assertPermission(eventId, revokedSession, 'check_in').allowed, false);
});

test('Phase 14 — Registration Policy & RSVP Enforcement (Closed, Deadline, Waitlist, Custom Questions)', () => {
  const eventId = 'event-phase14-policy';

  // 1. Closed RSVPs: rsvpEnabled === false
  EventService.createEvent({
    id: eventId,
    hostId: 'host-1',
    title: 'Private Closed Celebration',
    rsvpEnabled: false,
    rsvpDeadline: '2026-12-31',
  });

  assert.throws(
    () => {
      RSVPService.submitRSVP({
        eventId,
        primaryName: 'John Doe',
        contact: '+254711000111',
        status: 'yes',
        attendeeCount: 1,
      });
    },
    /RSVP submissions are currently closed/
  );

  // 2. Expired Deadline
  const expiredEventId = 'event-phase14-expired';
  EventService.createEvent({
    id: expiredEventId,
    hostId: 'host-1',
    title: 'Past Event',
    rsvpEnabled: true,
    rsvpDeadline: '2020-01-01', // Explicit past date
  });

  assert.throws(
    () => {
      RSVPService.submitRSVP({
        eventId: expiredEventId,
        primaryName: 'Late Guest',
        contact: '+254711000222',
        status: 'yes',
        attendeeCount: 1,
      });
    },
    /The RSVP deadline for this celebration has passed/
  );

  // 3. Custom Questions Requirement Check
  const questionEventId = 'event-phase14-customq';
  EventService.createEvent({
    id: questionEventId,
    hostId: 'host-1',
    title: 'Banquet with Dietary Survey',
    rsvpEnabled: true,
    rsvpDeadline: '2026-12-31',
    customQuestions: [
      {
        id: 'q-table',
        prompt: 'Select your preferred seating zone',
        type: 'choice',
        options: ['Indoor Ballroom', 'Garden Terrace'],
        required: true,
      },
      {
        id: 'q-song',
        prompt: 'Favorite dance song',
        type: 'text',
        required: false,
      },
    ],
  });

  // Missing required custom question throws error
  assert.throws(
    () => {
      RSVPService.submitRSVP({
        eventId: questionEventId,
        primaryName: 'Alice Seater',
        contact: '+254711000333',
        status: 'yes',
        attendeeCount: 1,
        customAnswers: {},
      });
    },
    /Please answer the required question: "Select your preferred seating zone"/
  );

  // Providing required custom question succeeds and stores answer
  const sub = RSVPService.submitRSVP({
    eventId: questionEventId,
    primaryName: 'Alice Seater',
    contact: '+254711000333',
    status: 'yes',
    attendeeCount: 1,
    customAnswers: {
      'q-table': 'Garden Terrace',
      'q-song': 'African Beauty',
    },
  });
  assert.equal(sub.customAnswers['q-table'], 'Garden Terrace');
  assert.equal(sub.customAnswers['q-song'], 'African Beauty');

  // 4. Max Capacity and Waitlist Enforcement
  const capacityEventId = 'event-phase14-capacity';
  EventService.createEvent({
    id: capacityEventId,
    hostId: 'host-1',
    title: 'Intimate Dinner',
    rsvpEnabled: true,
    rsvpDeadline: '2026-12-31',
    maxCapacity: 2,
    capacityWaitlist: true,
  });

  // First 2 seats fill capacity
  RSVPService.submitRSVP({
    eventId: capacityEventId,
    primaryName: 'Guest One',
    contact: '+254711111111',
    status: 'yes',
    attendeeCount: 2,
  });

  // Third guest triggers waitlist rather than rejection when waitlist enabled
  const waitlisted = RSVPService.submitRSVP({
    eventId: capacityEventId,
    primaryName: 'Guest Three',
    contact: '+254711111112',
    status: 'yes',
    attendeeCount: 1,
  });
  assert.equal(waitlisted.isWaitlisted, true);
});

test('Phase 14 — On-the-Day QR & Pass Check-In (Replay Prevention & Undo)', () => {
  const eventId = 'event-phase14-checkin';
  EventService.createEvent({ id: eventId, hostId: 'host-1', title: 'Day-Of Checkin Summit' });

  // Add guest with unique pass code
  const guest = GuestService.addGuest(eventId, {
    displayName: 'Senator Kiprono',
    contactPhone: '+254733999888',
    allowedPlusOnes: 2,
  });
  assert.ok(guest.passCode.startsWith('pass_'));
  assert.equal(guest.checkedIn, false);

  // 1. Initial check-in succeeds
  const checkInRes = CheckInService.checkIn(eventId, { passCode: guest.passCode }, 'Lead Usher Dan');
  assert.equal(checkInRes.success, true);
  assert.equal(checkInRes.guest.checkedIn, true);
  assert.equal(checkInRes.checkIn.checkedInBy, 'Lead Usher Dan');

  // 2. Duplicate / Replay check-in is rejected
  const replayRes = CheckInService.checkIn(eventId, { passCode: guest.passCode }, 'Lead Usher Dan');
  assert.equal(replayRes.success, false);
  assert.equal(replayRes.alreadyCheckedIn, true);
  assert.match(replayRes.message, /Already checked in/);

  // 3. Stats update accurately
  const status = CheckInService.getStatus(eventId);
  assert.equal(status.totalHouseholds, 1);
  assert.equal(status.checkedInHouseholds, 1);
  assert.equal(status.percentage, 100);

  // 4. Authorized undo reverses arrival status
  const undoRes = CheckInService.undoCheckIn(eventId, guest.id, 'Manager Alice');
  assert.equal(undoRes.success, true);

  const updatedGuest = GuestService.getGuestById(guest.id);
  assert.equal(updatedGuest.checkedIn, false);
  assert.equal(updatedGuest.checkedInAt, undefined);
});

test('Phase 14 — Event Duplication Safe Reset Contract (Zero Leaked Data)', () => {
  const originalId = 'event-phase14-original';
  const original = EventService.createEvent({
    id: originalId,
    hostId: 'host-1',
    title: 'Original Grand Wedding',
    category: 'wedding',
    date: 'Saturday, 14 November 2026',
    time: '2:00 PM',
    rsvpDeadline: '1 November 2026',
    venue: 'Safari Park Hotel',
  });

  // Seed original event with guests, RSVPs, cohosts, and check-ins
  const guest = GuestService.addGuest(originalId, { displayName: 'Original VIP', contactPhone: '+254700000000' });
  RSVPService.submitRSVP({
    eventId: originalId,
    primaryName: 'Original VIP',
    contact: '+254700000000',
    status: 'yes',
    attendeeCount: 1,
  });
  CheckInService.checkIn(originalId, { guestId: guest.id }, 'Staff');
  CoHostService.inviteCoHost(originalId, { email: 'cohost@original.com', role: 'manager' });

  // Execute Duplicate Event with safe reset
  const duplicated = EventService.duplicateEvent(originalId, {
    newHostId: 'host-2',
    copyDates: false,
  });

  // 1. Content & metadata cloned
  assert.equal(duplicated.title, 'Copy of Original Grand Wedding');
  assert.equal(duplicated.status, 'draft');
  assert.equal(duplicated.category, 'wedding');
  assert.equal(duplicated.venue, 'Safari Park Hotel');
  assert.equal(duplicated.hostId, 'host-2');
  assert.notEqual(duplicated.id, originalId);
  assert.notEqual(duplicated.slug, original.slug);

  // 2. Dates reset because copyDates: false
  assert.equal(duplicated.date, 'TBD Date');

  // 3. ZERO guests duplicated
  const dupGuests = GuestService.listGuests(duplicated.id);
  assert.equal(dupGuests.length, 0);

  // 4. ZERO RSVPs duplicated
  const dupRsvps = RSVPService.listRSVPs(duplicated.id);
  assert.equal(dupRsvps.length, 0);

  // 5. ZERO check-ins duplicated
  const dupCheckIns = CheckInService.getStatus(duplicated.id);
  assert.equal(dupCheckIns.checkedInHouseholds, 0);

  // 6. ZERO co-hosts duplicated
  const dupCoHosts = CoHostService.listCoHosts(duplicated.id);
  assert.equal(dupCoHosts.length, 0);
});

test('Phase 14 — CSV Import Row Validation & Zero Message Side-Effect', () => {
  const eventId = 'event-phase14-csv';
  EventService.createEvent({ id: eventId, hostId: 'host-1', title: 'CSV Test' });

  // Pre-seed an existing contact to test duplicate detection
  GuestService.addGuest(eventId, {
    displayName: 'Existing Guest',
    contactPhone: '+254712345678',
    contactEmail: 'existing@example.com',
  });

  const csvRows = [
    { name: '', phone: '+254711111111' }, // Missing name -> ERROR
    { name: 'Bad Email Guest', phone: '+254722222222', email: 'not-an-email' }, // Bad email -> ERROR
    { name: 'Duplicate Contact', phone: '0712345678' }, // Duplicate phone -> WARNING / SKIP
    { name: 'Valid New Guest', phone: '0733445566', email: 'valid@example.com', group: 'VIP', plusOnes: 2 },
  ];

  const result = GuestService.importGuests(eventId, csvRows, { skipDuplicates: true });

  assert.equal(result.importedCount, 1);
  assert.equal(result.duplicateCount, 1);
  assert.equal(result.errorCount, 2);

  // Errors reported row-by-row
  assert.equal(result.errors.length, 2);
  assert.match(result.errors[0].reason, /Missing guest or household name/);
  assert.match(result.errors[1].reason, /Invalid email address/);
});

test('Phase 14 — CSV Export Formula Injection Mitigation & Dynamic Custom Questions', () => {
  const eventId = 'event-phase14-csvexport';
  EventService.createEvent({
    id: eventId,
    hostId: 'host-1',
    title: 'Formula Security Event',
    rsvpEnabled: true,
    rsvpDeadline: '2026-12-31',
    customQuestions: [
      { id: 'q-transport', prompt: 'Shuttle Bus Needed?', type: 'choice', required: false },
    ],
  });

  // Submit RSVP with dangerous spreadsheet formula injection payload
  RSVPService.submitRSVP({
    eventId,
    primaryName: '=cmd|’ /C calc’!A0', // Excel formula execution vector
    contact: '+254700000999',
    status: 'yes',
    attendeeCount: 1,
    songRequest: '+HYPERLINK("http://evil.com")',
    customAnswers: {
      'q-transport': '@SUM(1+1)',
    },
  });

  const csv = RSVPService.exportRSVPsCSV(eventId);

  // Verifies custom question header included
  assert.match(csv, /Shuttle Bus Needed\?/);

  // Verifies dangerous formula characters are safely escaped with leading single quote `'`
  assert.match(csv, /"'=cmd/);
  assert.match(csv, /"'\+HYPERLINK/);
  assert.match(csv, /"'@SUM/);
});
