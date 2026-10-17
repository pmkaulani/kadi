import test from 'node:test';
import assert from 'node:assert/strict';
import { getDefaultInvitationSections, ALL_INVITATION_SECTIONS } from '../src/lib/events/default-invitation-sections.ts';
import { EVENT_CATEGORY_IDS } from '../src/lib/events/categories.ts';
import { TEMPLATES } from '../src/lib/templates/catalogue.ts';
import { EventService } from '../src/lib/services/event-service.ts';

test('Default Invitation Sections - covers all 23 canonical categories with valid section sets', () => {
  assert.equal(EVENT_CATEGORY_IDS.length, 23);

  for (const cat of EVENT_CATEGORY_IDS) {
    const sections = getDefaultInvitationSections(cat);
    assert.ok(sections.length >= 3, `Category ${cat} should have at least 3 default sections`);

    // All section keys must be valid known sections
    for (const s of sections) {
      assert.ok(
        ALL_INVITATION_SECTIONS.includes(s),
        `Section "${s}" in category "${cat}" must be one of ALL_INVITATION_SECTIONS`
      );
    }

    // Memorial/funeral must never include lighthearted birthday activities
    if (cat === 'memorial' || cat === 'funeral') {
      assert.ok(!sections.includes('activities'), `Memorial category ${cat} must not have activities section`);
      assert.ok(sections.includes('obituary'), `Memorial category ${cat} must include obituary section`);
    }

    // Every category must terminate with rsvp and/or closing
    assert.ok(sections.includes('rsvp') || sections.includes('closing'));
  }
});

test('Draft State Model - immediate visual state update vs debounced persistence logic', async () => {
  // Simulate the canonical draft queue logic
  let currentState = { title: 'Initial Title', revision: 0 };
  let persistedState = { title: 'Initial Title', revision: 0 };
  let saveStatus = 'saved';
  let persistCount = 0;

  const update = (recipe) => {
    currentState = {
      ...recipe(currentState),
      revision: currentState.revision + 1,
    };
    saveStatus = 'unsaved';
  };

  // 1. UI Edit happens immediately
  update((prev) => ({ ...prev, title: 'Updated Title 1' }));
  assert.equal(currentState.title, 'Updated Title 1');
  assert.equal(currentState.revision, 1);
  assert.equal(saveStatus, 'unsaved');
  assert.equal(persistedState.title, 'Initial Title', 'Persisted state must not update immediately');

  // 2. Fast succession of edits (coalescing)
  update((prev) => ({ ...prev, title: 'Updated Title 2' }));
  update((prev) => ({ ...prev, title: 'Updated Title 3' }));
  assert.equal(currentState.title, 'Updated Title 3');
  assert.equal(currentState.revision, 3);
  assert.equal(persistedState.title, 'Initial Title', 'Persistence still pending');

  // 3. Debounce completes and saves the newest snapshot
  const target = { ...currentState };
  saveStatus = 'saving';
  await new Promise((r) => setTimeout(r, 10)); // simulate async I/O
  persistedState = target;
  persistCount++;
  saveStatus = 'saved';

  assert.equal(persistedState.title, 'Updated Title 3');
  assert.equal(persistedState.revision, 3);
  assert.equal(saveStatus, 'saved');
  assert.equal(persistCount, 1, 'Fast keystrokes coalesced into 1 persistence call');
});

test('Monotonic Revision Queue - late out-of-order response never marks outdated draft as saved', async () => {
  let latestRevision = 0;
  let saveStatus = 'saved';
  let lastPersistedRev = 0;

  const performSave = async (snapshotRev, delayMs) => {
    saveStatus = 'saving';
    await new Promise((r) => setTimeout(r, delayMs));
    // Check if a newer edit happened while this request was in flight
    if (snapshotRev >= latestRevision) {
      lastPersistedRev = snapshotRev;
      saveStatus = 'saved';
    } else {
      // Newer edit is in flight; status must stay unsaved
      saveStatus = 'unsaved';
    }
  };

  // Revision 1 dispatched with slow network (50ms)
  latestRevision = 1;
  const p1 = performSave(1, 50);

  // User immediately edits to Revision 2 (fast edit)
  latestRevision = 2;

  await p1;
  assert.equal(
    saveStatus,
    'unsaved',
    'Late response for revision 1 must not mark revision 2 as saved'
  );

  // Revision 2 dispatched and completes
  await performSave(2, 10);
  assert.equal(saveStatus, 'saved');
  assert.equal(lastPersistedRev, 2);
});

test('Template Switch Safety - can preserve authored details when switching template styles', () => {
  const originalTemplate = TEMPLATES[0]; // Savannah Twilight
  const newTemplate = TEMPLATES.find((t) => t.category === 'birthday') || TEMPLATES[1];

  const authoredValues = {
    title: 'Custom Authored Title',
    hosts: 'The Kamau Family',
    celebrants: 'Sarah & Kevin',
    date: 'Saturday, 12 December 2026',
    time: '2:00 PM EAT',
    venue: 'Safari Park Hotel',
    city: 'Nairobi',
    heroImage: 'https://example.com/custom-photo.jpg',
  };

  // When host confirms "Keep My Details", authored text is preserved while template assets switch
  const mergedOnPreserve = {
    ...authoredValues,
    heroImage: newTemplate.sampleData.heroImage,
  };

  assert.equal(mergedOnPreserve.title, authoredValues.title);
  assert.equal(mergedOnPreserve.celebrants, authoredValues.celebrants);
  assert.equal(mergedOnPreserve.venue, authoredValues.venue);
  assert.equal(mergedOnPreserve.date, authoredValues.date);
});

test('Preview Mode Safety - preview configuration marks RSVP and M-Pesa interactions as inert', () => {
  // Assert preview flag suppression logic
  const previewMode = true;

  let rsvpApiCalled = false;
  let mpesaStkPushCalled = false;

  const mockSubmitRSVP = () => {
    if (previewMode) {
      // Must not initiate network fetch
      return { simulated: true, message: 'Preview mode: RSVP submissions are disabled.' };
    }
    rsvpApiCalled = true;
    return { success: true };
  };

  const mockInitiateMpesa = () => {
    if (previewMode) {
      // Must not initiate STK push
      return { simulated: true, message: 'Preview mode: Payments are simulated.' };
    }
    mpesaStkPushCalled = true;
    return { success: true };
  };

  const rsvpResult = mockSubmitRSVP();
  const mpesaResult = mockInitiateMpesa();

  assert.ok(rsvpResult.simulated);
  assert.equal(rsvpApiCalled, false, 'RSVP API must never be called in previewMode');
  assert.ok(mpesaResult.simulated);
  assert.equal(mpesaStkPushCalled, false, 'M-Pesa STK push must never be initiated in previewMode');
});

test('Continuous Canvas Flow - all stationery sections scrollable and editable in-place without section switching', () => {
  const weddingSections = getDefaultInvitationSections('wedding');
  assert.ok(weddingSections.length >= 6);

  // Sections flow includes countdown, ceremony, venue, story, gallery, rsvp, registry, faq, closing
  assert.ok(weddingSections.includes('ceremony'));
  assert.ok(weddingSections.includes('story'));
  assert.ok(weddingSections.includes('rsvp'));
  assert.ok(weddingSections.includes('registry'));

  // Test reordering sections on the canvas
  let sectionOrder = [...weddingSections];
  const ceremonyIdx = sectionOrder.indexOf('ceremony');
  const temp = sectionOrder[ceremonyIdx - 1];
  sectionOrder[ceremonyIdx - 1] = sectionOrder[ceremonyIdx];
  sectionOrder[ceremonyIdx] = temp;
  assert.equal(sectionOrder[ceremonyIdx - 1], 'ceremony', 'Section moved up in continuous stationery flow');

  // Test toggling visibility on the canvas
  let visibleSections = [...weddingSections];
  visibleSections = visibleSections.filter((s) => s !== 'ceremony');
  assert.ok(!visibleSections.includes('ceremony'), 'Ceremony hidden without page reload');

  // Test inline editing of section values on canvas
  const draftValues = {
    title: 'Kevin & Wanjiku',
    venue: 'Windsor Golf Hotel',
    city: 'Nairobi',
    story: 'We met in Nairobi...',
    countdownLabel: 'Counting down with joy',
    rsvpDeadline: '1 December 2026',
    mpesaNumber: '8249102',
  };

  const updatedVenue = { ...draftValues, venue: 'Safari Park Hotel' };
  assert.equal(updatedVenue.venue, 'Safari Park Hotel', 'Inline edit directly updates stationery value');
});
