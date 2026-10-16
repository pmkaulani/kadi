import test from 'node:test';
import assert from 'node:assert/strict';

import { EventService } from '../src/lib/services/event-service.ts';
import { GuestService } from '../src/lib/services/guest-service.ts';
import { RSVPService } from '../src/lib/services/rsvp-service.ts';
import { CheckInService } from '../src/lib/services/checkin-service.ts';
import { InsightsService } from '../src/lib/services/insights-service.ts';

test('Phase 16 — Host Insights Calculation from Authentic DB Records (Zero Mock Data)', () => {
  const eventId = `test-insights-${Date.now()}`;
  EventService.createEvent({
    id: eventId,
    title: 'Authentic Metrics Gala',
    category: 'wedding',
    status: 'published',
    visibility: 'private',
    city: 'Nairobi',
    venue: 'Muthaiga Country Club, Karura Forest Rd',
  });

  // 1. Add 4 Guest Households with plus-ones
  const g1 = GuestService.addGuest(eventId, {
    displayName: 'Amina & Salim (2 attending)',
    allowedPlusOnes: 1, // total 2 headcount expected
    group: 'Family',
  });
  const g2 = GuestService.addGuest(eventId, {
    displayName: 'Chef Ochieng (1 attending)',
    allowedPlusOnes: 0, // total 1 headcount expected
    group: 'VIP',
  });
  const g3 = GuestService.addGuest(eventId, {
    displayName: 'The Johnsons (Declined)',
    allowedPlusOnes: 2, // total 3 headcount expected
    group: 'Friends',
  });
  const g4 = GuestService.addGuest(eventId, {
    displayName: 'Wanjiru (Pending)',
    allowedPlusOnes: 1, // total 2 headcount expected
    group: 'Family',
  });

  // 2. Submit RSVPs
  // g1 Attending with 2 headcount and Halal dietary requirement
  RSVPService.submitRSVP({
    eventId,
    primaryName: 'Amina & Salim',
    contact: '+254711111111',
    status: 'yes',
    attendeeCount: 2,
    householdId: g1.id,
    dietaryRequirements: 'Halal only',
    source: 'wa',
  });

  // g2 Attending with 1 headcount and Halal dietary requirement
  RSVPService.submitRSVP({
    eventId,
    primaryName: 'Chef Ochieng',
    contact: '+254722222222',
    status: 'yes',
    attendeeCount: 1,
    householdId: g2.id,
    dietaryRequirements: 'Halal only',
    source: 'qr',
  });

  // g3 Declined
  RSVPService.submitRSVP({
    eventId,
    primaryName: 'The Johnsons',
    contact: '+254733333333',
    status: 'no',
    attendeeCount: 0,
    householdId: g3.id,
    source: 'direct',
  });

  // Record some page views
  InsightsService.recordPageView(eventId, 'wa');
  InsightsService.recordPageView(eventId, 'wa');
  InsightsService.recordPageView(eventId, 'qr');
  InsightsService.recordPageView(eventId, 'direct');

  // Record RSVP attribution
  InsightsService.recordSourceRsvp(eventId, 'wa');
  InsightsService.recordSourceRsvp(eventId, 'qr');

  // Verify Insights Calculation
  const insights = InsightsService.getEventInsights(eventId);

  // Overview metrics
  assert.equal(insights.overview.totalHouseholdsInvited, 4, 'Should record exactly 4 invited households');
  assert.equal(insights.overview.totalHeadcountExpected, 8, 'Sum of 1+plusOnes: (2 + 1 + 3 + 2) = 8');
  assert.equal(insights.overview.attendingHouseholds, 2, 'Exactly 2 households accepted');
  assert.equal(insights.overview.attendingHeadcount, 3, 'Sum of attendees: 2 + 1 = 3 confirmed people');
  assert.equal(insights.overview.declinedHouseholds, 1, '1 household declined');
  assert.equal(insights.overview.pendingHouseholds, 1, '1 household remains pending');
  // Response rate: 3 responses out of 4 households = 75%
  assert.equal(insights.overview.householdResponseRate, 75);
  // Attendance approval ratio: 2 attending out of 3 responses = 67%
  assert.equal(insights.overview.attendanceApprovalRatio, 67);

  // Check-In stats before any check-in
  assert.equal(insights.checkInStats.hasCheckIns, false, 'Should have no check-in records initially');
  assert.equal(insights.checkInStats.checkedInCount, 0);

  // Perform physical reception check-in for g1
  CheckInService.checkIn(eventId, { guestId: g1.id }, 'Reception Desk Usher');

  const updatedInsights = InsightsService.getEventInsights(eventId);
  assert.equal(updatedInsights.checkInStats.hasCheckIns, true, 'Check-in state should now be active');
  assert.equal(updatedInsights.checkInStats.checkedInCount, 1);
  // 1 checked-in out of 3 attending headcount = 33%
  assert.equal(updatedInsights.checkInStats.checkInRate, 33);

  // Dietary Summary Aggregation
  assert.equal(updatedInsights.dietarySummary.length, 1);
  assert.equal(updatedInsights.dietarySummary[0].requirement, 'Halal only');
  assert.equal(updatedInsights.dietarySummary[0].count, 3, '2 from Amina + 1 from Ochieng = 3 halal meals');

  // Metric Definitions Presence
  assert.ok(updatedInsights.metricDefinitions.totalHouseholdsInvited.definition);
  assert.ok(updatedInsights.metricDefinitions.checkInRate.dataSource.includes('mockDb.checkIns'));
});

test('Phase 16 — Privacy by Default: Events are strictly omitted from Public Discovery unless explicitly opt-in', () => {
  const privateEventId = `private-event-${Date.now()}`;
  EventService.createEvent({
    id: privateEventId,
    title: 'Secret Intimate Anniversary',
    category: 'anniversary',
    status: 'published',
    visibility: 'private', // Explicitly private
    city: 'Naivasha',
    venue: 'Great Rift Valley Lodge',
  });

  const unlistedEventId = `unlisted-event-${Date.now()}`;
  EventService.createEvent({
    id: unlistedEventId,
    title: 'Family Gathering Unlisted',
    category: 'family',
    status: 'published',
    visibility: 'unlisted', // Unlisted (accessible via link, but not discovered)
    city: 'Nakuru',
    venue: 'Private Residence',
  });

  // Verify that neither private nor unlisted event appears on public discovery
  const publicList = InsightsService.listPublicEvents();
  assert.ok(!publicList.some((e) => e.id === privateEventId), 'Private events must never appear in public discovery');
  assert.ok(!publicList.some((e) => e.id === unlistedEventId), 'Unlisted events must never appear in public discovery');
});

test('Phase 16 — Public Discovery Opt-In, Search Filtering, and Immediate Revocation', () => {
  const summitEventId = `summit-${Date.now()}`;
  EventService.createEvent({
    id: summitEventId,
    title: 'East Africa FinTech Summit 2026',
    subtitle: 'Building the next era of African payments',
    category: 'corporate',
    status: 'published',
    visibility: 'private',
    city: 'Nairobi',
    venue: 'Sarit Expo Centre, Westlands',
  });

  // 1. Initially private: cannot be found
  let results = InsightsService.listPublicEvents({ search: 'FinTech' });
  assert.equal(results.some((e) => e.id === summitEventId), false);

  // 2. Opt-in to public discovery with tags
  InsightsService.updateEventPrivacy(summitEventId, {
    visibility: 'public',
    tags: ['fintech', 'payments', 'tech', 'africa'],
  });

  // 3. Search and category filters
  results = InsightsService.listPublicEvents({ search: 'FinTech' });
  assert.ok(results.some((e) => e.id === summitEventId), 'Should appear in search after opt-in');

  const categoryResults = InsightsService.listPublicEvents({ category: 'corporate' });
  assert.ok(categoryResults.some((e) => e.id === summitEventId), 'Should match category filter');

  const tagResults = InsightsService.listPublicEvents({ tag: 'payments' });
  assert.ok(tagResults.some((e) => e.id === summitEventId), 'Should match tag filter');

  const mismatchedResults = InsightsService.listPublicEvents({ category: 'wedding' });
  assert.ok(!mismatchedResults.some((e) => e.id === summitEventId), 'Should not match wedding category');

  // 4. Draft or archived status excludes even if marked public
  const event = EventService.getEventById(summitEventId);
  event.status = 'draft';
  assert.ok(!InsightsService.listPublicEvents().some((e) => e.id === summitEventId), 'Draft events must never be discoverable');
  event.status = 'published';

  // 5. Immediate Revocation back to private
  InsightsService.updateEventPrivacy(summitEventId, {
    visibility: 'private',
  });

  const revokedResults = InsightsService.listPublicEvents({ search: 'FinTech' });
  assert.equal(revokedResults.some((e) => e.id === summitEventId), false, 'Revoking public visibility must immediately remove event from discovery');
});

test('Phase 16 — Exact Venue Masking Protection (`hideExactVenueUntilRsvp: true`)', () => {
  const protectedEventId = `venue-protect-${Date.now()}`;
  EventService.createEvent({
    id: protectedEventId,
    title: 'Exclusive Founders Dinner',
    category: 'corporate',
    status: 'published',
    visibility: 'public',
    city: 'Nairobi',
    venue: 'Secret Penthouse Villa, Riverside Drive #404',
    hideExactVenueUntilRsvp: true,
  });

  const openEventId = `venue-open-${Date.now()}`;
  EventService.createEvent({
    id: openEventId,
    title: 'Open Tech Meetup',
    category: 'corporate',
    status: 'published',
    visibility: 'public',
    city: 'Nairobi',
    venue: 'iHub Nairobi, Senteu Plaza, Galana Rd',
    hideExactVenueUntilRsvp: false,
  });

  const publicList = InsightsService.listPublicEvents({ city: 'Nairobi' });
  const protectedListing = publicList.find((e) => e.id === protectedEventId);
  const openListing = publicList.find((e) => e.id === openEventId);

  assert.ok(protectedListing, 'Protected event should be listed');
  assert.ok(openListing, 'Open event should be listed');

  // Protected venue should be masked with city name and disclosure note
  assert.equal(
    protectedListing.venue,
    'Nairobi (Exact location disclosed upon RSVP)',
    'Exact address must be masked when hideExactVenueUntilRsvp is true'
  );

  // Open venue should reveal full address
  assert.equal(
    openListing.venue,
    'iHub Nairobi, Senteu Plaza, Galana Rd',
    'Open event displays full venue address'
  );
});

test('Phase 16 — Privacy-Safe Referral Tracking without Personal Identity Leakage', () => {
  const eventId = `tracking-test-${Date.now()}`;
  EventService.createEvent({
    id: eventId,
    title: 'Referral Campaign Test Event',
    category: 'birthday',
    status: 'published',
  });

  // Track page views from different channels
  InsightsService.recordPageView(eventId, 'wa');
  InsightsService.recordPageView(eventId, 'wa');
  InsightsService.recordPageView(eventId, 'wa');
  InsightsService.recordPageView(eventId, 'qr');
  // Malicious/Invasive characters must be stripped and sanitized
  InsightsService.recordPageView(eventId, 'ig?user=john_doe&token=secret123');

  // Track RSVPs
  InsightsService.recordSourceRsvp(eventId, 'wa');
  InsightsService.recordSourceRsvp(eventId, 'qr');

  const insights = InsightsService.getEventInsights(eventId);
  const waStat = insights.referralSources.find((s) => s.source === 'wa');
  const qrStat = insights.referralSources.find((s) => s.source === 'qr');

  assert.ok(waStat);
  assert.equal(waStat.visits, 3);
  assert.equal(waStat.rsvps, 1);
  assert.equal(waStat.conversionRate, 33); // 1 / 3 = 33%

  assert.ok(qrStat);
  assert.equal(qrStat.visits, 1);
  assert.equal(qrStat.rsvps, 1);
  assert.equal(qrStat.conversionRate, 100); // 1 / 1 = 100%

  // Check sanitized source key
  const sanitized = insights.referralSources.find((s) => s.source.includes('john'));
  assert.ok(!sanitized, 'Invasive query parameters and PII must be completely stripped');
});

test('Phase 16 — Public Content Moderation and Abuse Reporting', () => {
  const eventId = `reportable-event-${Date.now()}`;
  EventService.createEvent({
    id: eventId,
    title: 'Suspicious Event Listing',
    category: 'other',
    status: 'published',
    visibility: 'public',
  });

  const report = InsightsService.reportEvent(eventId, {
    reason: 'spam',
    details: 'Spam promotion for unauthorized cryptocurrency scheme.',
    reporterContact: 'concerned_attendee@example.com',
  });

  assert.ok(report.id.startsWith('rep-'));
  assert.equal(report.eventId, eventId);
  assert.equal(report.reason, 'spam');
  assert.equal(report.status, 'pending');
  assert.ok(report.createdAt);

  const reports = InsightsService.listReports(eventId);
  assert.equal(reports.length, 1);
  assert.equal(reports[0].id, report.id);
});
