import test from 'node:test';
import assert from 'node:assert/strict';

import { EventService } from '../src/lib/services/event-service.ts';
import { GuestService } from '../src/lib/services/guest-service.ts';
import { RSVPService } from '../src/lib/services/rsvp-service.ts';
import { MpesaService } from '../src/lib/services/mpesa-service.ts';
import { NotificationService } from '../src/lib/services/notification-service.ts';

test('Guest Token Generation & Verification - Generates high entropy tokens and hashes', () => {
  const event = EventService.createEvent({
    title: 'Token Security Test',
    category: 'wedding',
  });

  const guest = GuestService.addGuest(event.id, {
    displayName: 'Wanjiku Mwangi',
    contactPhone: '+254712345678',
    allowedPlusOnes: 2,
    group: 'VIP',
  });

  assert.ok(guest.token, 'Guest must have a token');
  assert.ok(guest.token.length >= 16, 'Token must be high-entropy (>= 16 chars)');
  assert.ok(guest.tokenHash, 'Guest must have a stored token hash');

  const resolved = GuestService.getGuestByTokenAndEvent(guest.token, event.id);
  assert.ok(resolved, 'Should resolve guest by token and event');
  assert.equal(resolved?.id, guest.id);
});

test('Cross-Event Token Isolation - Rejects Token from Event A on Event B', () => {
  const eventA = EventService.createEvent({
    title: 'Event Alpha Gala',
    category: 'wedding',
  });
  const eventB = EventService.createEvent({
    title: 'Event Beta Soiree',
    category: 'birthday',
  });

  const guestA = GuestService.addGuest(eventA.id, {
    displayName: 'Alpha Guest',
    allowedPlusOnes: 1,
  });

  // Attempting to resolve guestA token on eventB must return undefined
  const crossLookup = GuestService.getGuestByTokenAndEvent(guestA.token, eventB.id);
  assert.equal(crossLookup, undefined, 'Guest lookup on mismatched event must fail');

  // Attempting to submit RSVP with Event A token for Event B must throw error
  assert.throws(
    () => {
      RSVPService.submitRSVP({
        eventId: eventB.id,
        guestToken: guestA.token,
        primaryName: 'Alpha Guest',
        contact: '+254712345678',
        status: 'yes',
        attendeeCount: 1,
      });
    },
    {
      message: /belongs to a different event/i,
    }
  );
});

test('Token Rotation and Revocation - Invalidates old token immediately', () => {
  const event = EventService.createEvent({
    title: 'Token Lifecycle Test',
    category: 'wedding',
  });

  const guest = GuestService.addGuest(event.id, {
    displayName: 'Kiprono Cheruiyot',
    allowedPlusOnes: 1,
  });

  const oldToken = guest.token;
  const rotated = GuestService.rotateGuestToken(guest.id);
  assert.ok(rotated, 'Token rotation should return updated guest');
  assert.notEqual(rotated?.token, oldToken, 'New token must differ from old token');

  // Old token lookup should now fail
  const oldLookup = GuestService.getGuestByTokenAndEvent(oldToken, event.id);
  assert.equal(oldLookup, undefined, 'Old token lookup must return undefined after rotation');

  // New token lookup should succeed
  const newLookup = GuestService.getGuestByTokenAndEvent(rotated.token, event.id);
  assert.equal(newLookup?.id, guest.id, 'New token must resolve to guest');

  // Revoke token
  const revoked = GuestService.revokeGuestToken(guest.id);
  assert.ok(revoked, 'Revocation should succeed');
  assert.equal(revoked?.tokenRevoked, true);

  const revokedLookup = GuestService.getGuestByTokenAndEvent(rotated.token, event.id);
  assert.equal(revokedLookup, undefined, 'Revoked token lookup must return undefined');
});

test('RSVP Named Attendees - Populates attendee records with names and dietary requirements', () => {
  const event = EventService.createEvent({
    title: 'Named Attendees Gala',
    category: 'wedding',
  });

  const guest = GuestService.addGuest(event.id, {
    displayName: 'Dr. Peter Otieno & Family',
    allowedPlusOnes: 2, // Max 3 attendees
  });

  const submission = RSVPService.submitRSVP({
    eventId: event.id,
    guestToken: guest.token,
    primaryName: 'Dr. Peter Otieno',
    contact: '+254711998877',
    status: 'yes',
    attendeeCount: 3,
    dietaryRequirements: 'Halal for all',
    attendeeNames: ['Dr. Peter Otieno', 'Mrs. Jane Otieno', 'Junior Otieno'],
  });

  assert.equal(submission.status, 'yes');
  assert.equal(submission.attendeeCount, 3);

  const summary = RSVPService.getRSVPSummary(event.id);
  assert.equal(summary.attendingAttendeeCount, 3);
  assert.equal(summary.namedAttendeesList.length, 3);
  assert.equal(summary.namedAttendeesList[0].name, 'Dr. Peter Otieno');
  assert.equal(summary.namedAttendeesList[1].name, 'Mrs. Jane Otieno');
  assert.equal(summary.namedAttendeesList[2].name, 'Junior Otieno');
});

test('RSVP Capacity Limit - Rejects submissions exceeding allowed plus-ones', () => {
  const event = EventService.createEvent({
    title: 'Strict Capacity Banquet',
    category: 'corporate',
  });

  const guest = GuestService.addGuest(event.id, {
    displayName: 'Single Delegate',
    allowedPlusOnes: 0, // Solo only
  });

  assert.throws(
    () => {
      RSVPService.submitRSVP({
        eventId: event.id,
        guestToken: guest.token,
        primaryName: 'Single Delegate',
        contact: '+254700112233',
        status: 'yes',
        attendeeCount: 2, // Exceeds limit
      });
    },
    {
      message: /exceeds allowed invitation limit of 1/i,
    }
  );
});

test('RSVP Untokenized Policy - Blocks tokenless submissions when private', () => {
  const event = EventService.createEvent({
    title: 'Private Closed Reception',
    category: 'wedding',
  });

  assert.throws(
    () => {
      RSVPService.submitRSVP({
        eventId: event.id,
        primaryName: 'Uninvited Guest',
        contact: '+254799999999',
        status: 'yes',
        attendeeCount: 1,
        allowUntokenizedRsvp: false,
      });
    },
    {
      message: /valid personal invitation link is required/i,
    }
  );
});

test('CSV Import - Parses headers flexibly and identifies duplicate contacts', () => {
  const event = EventService.createEvent({
    title: 'CSV Import Test Event',
    category: 'wedding',
  });

  const csvRaw = `Full Name,Mobile Phone,Email Address,Group Category,Plus Ones
Grace Mwangi,+254 722 111 222,grace@example.com,Family,2
Brian Otieno,+254 733 444 555,brian@example.com,Friends,1
Grace Duplicate,+254 722 111 222,grace.work@example.com,Family,1`;

  const parsedRows = GuestService.parseCsvText(csvRaw);
  assert.equal(parsedRows.length, 3, 'Should parse 3 data rows');
  assert.equal(parsedRows[0].displayName, 'Grace Mwangi');
  assert.equal(parsedRows[0].allowedPlusOnes, 2);

  const importResult = GuestService.importGuests(event.id, parsedRows, { skipDuplicates: true });
  assert.equal(importResult.importedCount, 2, 'Should import 2 unique guests');
  assert.equal(importResult.duplicateCount, 1, 'Should flag 1 duplicate phone');
});

test('CSV Export Formula Injection Mitigation - Neutralizes formula cells', () => {
  const event = EventService.createEvent({
    title: 'Formula Security Event',
    category: 'wedding',
  });

  // Submit RSVP with dangerous spreadsheet formulas
  RSVPService.submitRSVP({
    eventId: event.id,
    primaryName: '=cmd|"/c calc"!A0',
    contact: '+254700000001',
    status: 'yes',
    attendeeCount: 1,
    dietaryRequirements: '@SUM(1,2)',
    songRequest: '+HYPERLINK("http://malicious.com")',
  });

  const csvData = RSVPService.exportRSVPsCSV(event.id);

  // Any formula trigger characters must be neutralized with leading apostrophe
  assert.ok(csvData.includes("'=cmd"), 'Formula starting with = must be prepended with apostrophe');
  assert.ok(csvData.includes("'@SUM"), 'Formula starting with @ must be prepended with apostrophe');
  assert.ok(csvData.includes("'+HYPERLINK"), 'Formula starting with + must be prepended with apostrophe');
});

test('M-Pesa Service - Formats KES and validates Paybill, Till, Send Money configs', () => {
  assert.equal(MpesaService.formatKES(1500), 'KES 1,500');
  assert.equal(MpesaService.formatKES(50000), 'KES 50,000');

  // Valid Till
  const tillResult = MpesaService.validateConfig({
    type: 'till',
    number: '8249102',
    recipientName: 'Kevin & Wanjiku',
  });
  assert.equal(tillResult.valid, true);

  // Invalid Till (letters or too short)
  const invalidTill = MpesaService.validateConfig({
    type: 'till',
    number: 'ABC',
    recipientName: 'Kevin & Wanjiku',
  });
  assert.equal(invalidTill.valid, false);

  // Valid Paybill
  const paybillResult = MpesaService.validateConfig({
    type: 'paybill',
    number: '247247',
    accountReference: 'KW-WEDDING',
    recipientName: 'Equity Collection',
  });
  assert.equal(paybillResult.valid, true);

  // Invalid Paybill (missing account reference)
  const missingRefPaybill = MpesaService.validateConfig({
    type: 'paybill',
    number: '247247',
    recipientName: 'Equity Collection',
  });
  assert.equal(missingRefPaybill.valid, false);
});

test('M-Pesa STK Push Simulation - Emits sandbox disclaimer and avoids marking paid', async () => {
  const result = await MpesaService.requestStkPush({
    eventId: 'evt-test-123',
    phone: '0712345678',
    amount: 2500,
    contributorName: 'Auntie Mary',
  });

  assert.equal(result.success, true);
  assert.equal(result.isSimulation, true, 'Without live Daraja credentials, must be simulation');
  assert.ok(result.disclaimer.includes('Sandbox'), 'Must include sandbox disclaimer');
  assert.equal(result.amountFormatted, 'KES 2,500');
  assert.equal(result.phoneFormatted, '+254712345678');
});

test('Notification Service - Differentiates Draft Tokens from Canonical Links and builds wa.me links', () => {
  const draftEvent = EventService.createEvent({
    title: 'Draft Celebration',
    category: 'wedding',
    slug: 'draft-celebration-2026',
  });

  const draftUrl = NotificationService.generateShareUrl(draftEvent, {
    baseUrl: 'https://kadi.africa',
  });
  assert.ok(draftUrl.includes('preview=true'), 'Draft share URL must include preview flag');
  assert.ok(draftUrl.includes('tok=prev_'), 'Draft share URL must include private preview token');

  // Publish event
  const published = EventService.publishEvent(draftEvent.id);
  assert.ok(published);
  const publishedUrl = NotificationService.generateShareUrl(published, {
    baseUrl: 'https://kadi.africa',
  });
  assert.equal(publishedUrl, `https://kadi.africa/e/${published.slug}`);

  // Build WhatsApp pre-filled message and direct wa.me link
  const waDirect = NotificationService.getWhatsAppDirectUrl(
    published,
    publishedUrl,
    '+254712345678',
    'Aunt Jane'
  );
  assert.ok(waDirect.startsWith('https://wa.me/254712345678?text='), 'Must format E.164 phone in wa.me URL');
  assert.ok(waDirect.includes(encodeURIComponent('Dear Aunt Jane')), 'Must personalize message');

  // Provider configuration detection
  assert.equal(typeof NotificationService.isProviderConfigured('whatsapp_cloud'), 'boolean');
  assert.equal(typeof NotificationService.isProviderConfigured('sms'), 'boolean');
});
