import test from 'node:test';
import assert from 'node:assert/strict';

import {
  GuestService,
  normalizeKenyanPhoneNumber,
} from '../src/lib/services/guest-service.ts';
import { EventService } from '../src/lib/services/event-service.ts';

test('Guest Tokens - generates high-entropy unique tokens for each household', () => {
  const event = EventService.createEvent({ title: 'Token Test' });

  const g1 = GuestService.addGuest(event.id, { displayName: 'Household 1' });
  const g2 = GuestService.addGuest(event.id, { displayName: 'Household 2' });

  assert.ok(g1.token.startsWith('tok_'));
  assert.ok(g2.token.startsWith('tok_'));
  assert.ok(g1.token.length >= 30);
  assert.notEqual(g1.token, g2.token);

  // Token hashes are stored
  assert.ok(g1.tokenHash.startsWith('hash_'));
});

test('Phone normalization - accurately standardizes Kenyan telephone numbers', () => {
  assert.equal(normalizeKenyanPhoneNumber('0712345678'), '+254712345678');
  assert.equal(normalizeKenyanPhoneNumber('0722 123 456'), '+254722123456');
  assert.equal(normalizeKenyanPhoneNumber('254733112233'), '+254733112233');
  assert.equal(normalizeKenyanPhoneNumber('+254799887766'), '+254799887766');
});

test('CSV Importer - safely maps columns, imports valid rows, and reports errors for invalid rows', () => {
  const event = EventService.createEvent({ title: 'CSV Test' });

  const rows = [
    { name: 'Alice Mutua', phone: '0712111222', group: 'Friends', plusOnes: 1 },
    { name: 'Dr. John', phone: '0722333444', group: 'VIP', plusOnes: 2 },
    { name: '', phone: '0733555666', group: 'Invalid' }, // Missing name
    { name: 'Kariuki Family', phone: '+254700112233', group: 'Family', plusOnes: 4 },
  ];

  const result = GuestService.importGuests(event.id, rows);

  assert.equal(result.importedCount, 3);
  assert.equal(result.errors.length, 1);
  assert.equal(result.errors[0].row, 3);
  assert.match(result.errors[0].reason, /Missing guest or household name/);

  const importedGuests = GuestService.listGuests(event.id);
  assert.ok(importedGuests.some((g) => g.displayName === 'Alice Mutua'));
  assert.ok(importedGuests.some((g) => g.displayName === 'Kariuki Family'));
});
