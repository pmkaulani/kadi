import test from 'node:test';
import assert from 'node:assert/strict';

import { EventService } from '../src/lib/services/event-service.ts';
import { GuestService } from '../src/lib/services/guest-service.ts';
import { RSVPService } from '../src/lib/services/rsvp-service.ts';

test('Event Lifecycle - creates draft, generates unique slug, and publishes', () => {
  const event = EventService.createEvent({
    title: 'Nairobi Tech Summit',
    category: 'corporate',
    venue: 'Sarit Expo Centre',
  });

  assert.equal(event.status, 'draft');
  assert.ok(event.slug.startsWith('nairobi-tech-summit'));
  assert.equal(event.category, 'corporate');

  // Verify design defaults were initialized
  const design = EventService.getEventDesign(event.id);
  assert.ok(design);
  assert.ok(design.palette.primary);

  // Publish event
  const published = EventService.publishEvent(event.id);
  assert.equal(published.status, 'published');
});

test('Event Duplication Security - clean draft duplication without leaking guests, tokens, or RSVPs', () => {
  const original = EventService.createEvent({
    title: 'Original Gala',
    category: 'wedding',
  });

  const guest = GuestService.addGuest(original.id, {
    displayName: 'Private Guest Record',
    contactPhone: '+254700999888',
  });

  RSVPService.submitRSVP({
    eventId: original.id,
    guestToken: guest.token,
    primaryName: 'Private Guest Record',
    contact: '+254700999888',
    status: 'yes',
    attendeeCount: 1,
  });

  // Duplicate the event
  const duplicate = EventService.duplicateEvent(original.id);

  assert.notEqual(duplicate.id, original.id);
  assert.notEqual(duplicate.slug, original.slug);
  assert.equal(duplicate.status, 'draft');
  assert.ok(duplicate.title.includes('Copy of Original Gala'));

  // NON-NEGOTIABLE RULE: Duplicating an event MUST NOT duplicate guest tokens or RSVPs
  const duplicateGuests = GuestService.listGuests(duplicate.id);
  assert.equal(duplicateGuests.length, 0);

  const duplicateRSVPs = RSVPService.listRSVPs(duplicate.id);
  assert.equal(duplicateRSVPs.length, 0);
});
