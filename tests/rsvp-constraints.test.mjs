import test from 'node:test';
import assert from 'node:assert/strict';

// Import domain services
import { RSVPService } from '../src/lib/services/rsvp-service.ts';
import { GuestService } from '../src/lib/services/guest-service.ts';
import { EventService } from '../src/lib/services/event-service.ts';

test('RSVP constraints - allows valid attendee count within plus-one limits', () => {
  const event = EventService.createEvent({
    title: 'Test Wedding Gala',
    category: 'wedding',
  });

  const guest = GuestService.addGuest(event.id, {
    displayName: 'Mr. & Mrs. Ouma',
    allowedPlusOnes: 1, // Max 2 attendees
  });

  const submission = RSVPService.submitRSVP({
    eventId: event.id,
    guestToken: guest.token,
    primaryName: 'Mr. Ouma',
    contact: '+254711223344',
    status: 'yes',
    attendeeCount: 2,
    dietaryRequirements: 'Vegetarian',
  });

  assert.equal(submission.status, 'yes');
  assert.equal(submission.attendeeCount, 2);
  assert.equal(submission.dietaryRequirements, 'Vegetarian');

  const updatedGuest = GuestService.getGuestById(guest.id);
  assert.equal(updatedGuest?.status, 'yes');
});

test('RSVP constraints - rejects attendee count exceeding allowed plus-ones', () => {
  const event = EventService.createEvent({
    title: 'Capacity Test Event',
    category: 'wedding',
  });

  const guest = GuestService.addGuest(event.id, {
    displayName: 'Solo Guest',
    allowedPlusOnes: 0, // Max 1 attendee
  });

  assert.throws(
    () => {
      RSVPService.submitRSVP({
        eventId: event.id,
        guestToken: guest.token,
        primaryName: 'Solo Guest',
        contact: '+254700000000',
        status: 'yes',
        attendeeCount: 4, // Exceeds limit
      });
    },
    {
      message: /exceeds allowed invitation limit of 1/,
    }
  );
});

test('RSVP summary - correctly distinguishes household count from attendee headcount', () => {
  const event = EventService.createEvent({
    title: 'Headcount Test',
    category: 'birthday',
  });

  const g1 = GuestService.addGuest(event.id, { displayName: 'Family A', allowedPlusOnes: 3 });
  const g2 = GuestService.addGuest(event.id, { displayName: 'Family B', allowedPlusOnes: 1 });

  RSVPService.submitRSVP({
    eventId: event.id,
    guestToken: g1.token,
    primaryName: 'Family A Leader',
    contact: '+254712000001',
    status: 'yes',
    attendeeCount: 4,
  });

  RSVPService.submitRSVP({
    eventId: event.id,
    guestToken: g2.token,
    primaryName: 'Family B Leader',
    contact: '+254712000002',
    status: 'no',
    attendeeCount: 0,
  });

  const summary = RSVPService.getRSVPSummary(event.id);
  assert.equal(summary.totalHouseholds, 2);
  assert.equal(summary.attendingAttendeeCount, 4); // 4 individual people
  assert.equal(summary.attendingHouseholds, 1);
  assert.equal(summary.declinedHouseholds, 1);
});
