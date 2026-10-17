import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CanonicalInvitationConfigSchema,
  buildPublishedInvitationConfig,
  buildDraftPreviewInvitationConfig,
  buildTemplatePreviewInvitationConfig,
  buildPrivateReviewInvitationConfig,
  resolveActiveSections,
} from '../src/lib/invitations/config';
import { getTemplateById, TEMPLATES } from '../src/lib/templates/catalogue';
import { mockDb } from '../src/lib/db/mock-db';
import { getDefaultInvitationSections } from '../src/lib/events/default-invitation-sections';

test('Invitation Config - schema validates canonical configurations correctly', () => {
  const weddingTemplate = getTemplateById('savannah-twilight');
  assert.ok(weddingTemplate, 'Wedding template exists');
  const weddingEvent = mockDb.events.find((e) => e.id === 'event-wedding-1');
  assert.ok(weddingEvent, 'Wedding event exists');

  const config = buildPublishedInvitationConfig(weddingEvent, weddingTemplate, {
    guestToken: 'test-tok-123',
  });

  const parsed = CanonicalInvitationConfigSchema.safeParse(config);
  assert.ok(parsed.success, 'Valid published configuration passes schema validation');
  assert.equal(config.mode, 'published');
  assert.equal(config.isReadOnly, false);
});

test('Invitation Config - schema rejects malformed configurations', () => {
  const malformed = {
    version: '1.0.0',
    mode: 'invalid-mode', // invalid enum
    event: {
      id: 'evt-1',
      // missing title, slug, hosts, celebrants, etc.
    },
  };

  const parsed = CanonicalInvitationConfigSchema.safeParse(malformed);
  assert.equal(parsed.success, false, 'Schema rejects malformed configuration');
});

test('Renderer Parity - draft preview and published configs share identical section tree and order', () => {
  const template = getTemplateById('savannah-twilight');
  const weddingEvent = mockDb.events.find((e) => e.id === 'event-wedding-1');
  assert.ok(template && weddingEvent);

  const designOverride = {
    linerId: 'gold-foil',
    sealMonogram: 'K&W',
    sealColor: '#E6C15C',
    sectionOrder: ['story', 'ceremony', 'schedule', 'gallery', 'faq', 'registry', 'rsvp', 'closing'],
  };

  const publishedConfig = buildPublishedInvitationConfig(weddingEvent, template, {
    design: designOverride,
    guestToken: 'guest-token-abc',
  });

  const draftConfig = buildDraftPreviewInvitationConfig(
    template,
    {
      title: weddingEvent.title,
      hosts: weddingEvent.hosts,
      celebrants: weddingEvent.celebrants,
      date: weddingEvent.date,
      time: weddingEvent.time,
      venue: weddingEvent.venue,
      city: weddingEvent.city,
      heroImage: weddingEvent.heroImage,
      galleryImages: weddingEvent.galleryImages,
      story: weddingEvent.story,
    },
    designOverride,
    { guestName: 'Hon. & Mrs. Anyango' }
  );

  // Assert exact section order parity between draft preview and published guest route
  assert.deepEqual(
    publishedConfig.sectionOrder,
    draftConfig.sectionOrder,
    'Section order must be 100% identical between draft and published configs'
  );

  // Assert design overrides are identically preserved
  assert.equal(publishedConfig.design?.sealMonogram, draftConfig.design?.sealMonogram);
  assert.equal(publishedConfig.design?.sealColor, draftConfig.design?.sealColor);
  assert.equal(publishedConfig.design?.linerId, draftConfig.design?.linerId);
});

test('Renderer Parity - side effect safety in preview and read-only modes', () => {
  const template = getTemplateById('savannah-twilight');
  const weddingEvent = mockDb.events.find((e) => e.id === 'event-wedding-1');
  assert.ok(template && weddingEvent);

  const templatePreview = buildTemplatePreviewInvitationConfig(template);
  assert.equal(templatePreview.mode, 'template-preview');
  assert.equal(templatePreview.isReadOnly, true);

  const draftPreview = buildDraftPreviewInvitationConfig(
    template,
    {
      title: 'Draft Event',
      hosts: 'Hosts',
      celebrants: 'Celebrants',
      date: '12 Dec 2026',
      time: '2:00 PM',
      venue: 'Nairobi',
      city: 'Nairobi',
      heroImage: 'https://example.com/hero.jpg',
    },
    {}
  );
  assert.equal(draftPreview.mode, 'draft-preview');
  assert.equal(draftPreview.isReadOnly, true);

  const privateReview = buildPrivateReviewInvitationConfig(weddingEvent, template);
  assert.equal(privateReview.mode, 'private-review');
  assert.equal(privateReview.isReadOnly, true);
  assert.equal(privateReview.allowedPlusOnes, 0);

  const published = buildPublishedInvitationConfig(weddingEvent, template);
  assert.equal(published.mode, 'published');
  assert.equal(published.isReadOnly, false);
});

test('Category Section Defaults - appropriate content blocks per occasion', () => {
  // 1. Wedding
  const weddingSections = getDefaultInvitationSections('wedding');
  assert.ok(weddingSections.includes('story'), 'Wedding includes story');
  assert.ok(weddingSections.includes('ceremony'), 'Wedding includes ceremony');
  assert.ok(weddingSections.includes('schedule'), 'Wedding includes schedule');
  assert.ok(weddingSections.includes('registry'), 'Wedding includes registry');
  assert.ok(weddingSections.includes('rsvp'), 'Wedding includes rsvp');

  // 2. Birthday
  const birthdaySections = getDefaultInvitationSections('birthday');
  assert.ok(birthdaySections.includes('about'), 'Birthday includes about celebrant');
  assert.ok(birthdaySections.includes('activities'), 'Birthday includes activities & menu');
  assert.ok(birthdaySections.includes('rsvp'), 'Birthday includes rsvp');

  // 3. Funeral (Must strictly omit registry celebration gifts)
  const funeralSections = getDefaultInvitationSections('funeral');
  assert.ok(funeralSections.includes('obituary'), 'Funeral includes obituary');
  assert.ok(funeralSections.includes('services'), 'Funeral includes memorial services');
  assert.ok(funeralSections.includes('candles'), 'Funeral includes virtual candles');
  assert.ok(funeralSections.includes('condolences'), 'Funeral includes condolences');
  assert.ok(!funeralSections.includes('registry'), 'Funeral MUST NOT include celebratory gift registry');

  // 4. Corporate
  const corporateSections = getDefaultInvitationSections('corporate');
  assert.ok(corporateSections.includes('schedule'), 'Corporate includes schedule');
  assert.ok(corporateSections.includes('venue'), 'Corporate includes venue');
  assert.ok(corporateSections.includes('faq'), 'Corporate includes faq');
  assert.ok(!corporateSections.includes('story'), 'Corporate omits romantic story');

  // 5. Graduation
  const gradSections = getDefaultInvitationSections('graduation');
  assert.ok(gradSections.includes('ceremony'), 'Graduation includes ceremony');
  assert.ok(gradSections.includes('schedule'), 'Graduation includes schedule');
  assert.ok(gradSections.includes('rsvp'), 'Graduation includes rsvp');

  // 6. Housewarming
  const houseSections = getDefaultInvitationSections('housewarming');
  assert.ok(houseSections.includes('venue'), 'Housewarming includes venue');
  assert.ok(houseSections.includes('schedule'), 'Housewarming includes schedule');
  assert.ok(houseSections.includes('rsvp'), 'Housewarming includes rsvp');
});

test('Section Resolution - handles visibleSections and custom reordering safely', () => {
  // Host hides gallery and reorders schedule before story
  const resolved = resolveActiveSections('wedding', {
    visibleSections: ['story', 'schedule', 'rsvp'],
    sectionOrder: ['schedule', 'story', 'rsvp'],
  });

  assert.deepEqual(
    resolved,
    ['schedule', 'story', 'rsvp'],
    'Correctly filters out hidden sections and preserves authored ordering'
  );

  // If host provides unknown section keys, they are ignored safely
  const resolvedWithUnknown = resolveActiveSections('wedding', {
    visibleSections: ['story', 'ceremony', 'unknown-future-block'],
  });

  assert.ok(!resolvedWithUnknown.includes('unknown-future-block'), 'Unknown block key is omitted safely');
  assert.ok(resolvedWithUnknown.includes('story'));
  assert.ok(resolvedWithUnknown.includes('ceremony'));
});

test('Backwards Compatibility Contract - older template versions and partial fields render safely', () => {
  const template = getTemplateById('savannah-twilight');
  assert.ok(template);

  // Event entity created with v0.9.0 schema lacking newer optional fields
  const legacyEvent = {
    id: 'legacy-event-001',
    hostId: 'host-legacy',
    title: 'Legacy Celebration',
    slug: 'legacy-celebration',
    category: 'custom',
    status: 'published',
    templateId: 'savannah-twilight',
    templateVersion: '0.9.0', // Older version
    hosts: 'Old Host',
    celebrants: 'Old Celebrant',
    date: '10 October 2024',
    time: '3:00 PM',
    timezone: 'Africa/Nairobi',
    venue: 'Legacy Garden',
    city: 'Nairobi',
    heroImage: 'https://example.com/legacy.jpg',
    rsvpDeadline: '1 October 2024',
    // Missing galleryImages, milestones, FAQ, registry, audioUrl, countdownLabel, etc.
  };

  const config = buildPublishedInvitationConfig(legacyEvent, template);
  assert.ok(config);
  assert.equal(config.event.templateVersion, '0.9.0');
  assert.ok(config.sectionOrder.length > 0, 'Generates valid section order for legacy event');

  // Verify that active sections resolve cleanly without crashing
  const activeSections = resolveActiveSections(legacyEvent.category);
  assert.ok(Array.isArray(activeSections));
});


test('Renderer integration - every guest and preview mode receives the art-directed default canvas', () => {
  const template = getTemplateById('savannah-twilight');
  const event = mockDb.events.find((candidate) => candidate.id === 'event-wedding-1');
  assert.ok(template && event);

  const draftValues = {
    title: event.title,
    hosts: event.hosts,
    celebrants: event.celebrants,
    date: event.date,
    time: event.time,
    venue: event.venue,
    city: event.city,
    heroImage: event.heroImage,
    galleryImages: event.galleryImages,
    story: event.story,
  };

  const configs = [
    ['template preview', buildTemplatePreviewInvitationConfig(template)],
    ['draft preview', buildDraftPreviewInvitationConfig(template, draftValues, {})],
    ['published route', buildPublishedInvitationConfig(event, template)],
    ['private review', buildPrivateReviewInvitationConfig(event, template)],
  ];

  for (const [label, config] of configs) {
    const elements = config.design?.canvasElements || [];
    assert.ok(
      elements.some((element) => element.id === 'photo-hero' && element.type === 'photo'),
      `${label} should render its real photo as invitation artwork`
    );
    assert.ok(
      elements.some((element) => element.id === 'text-title' && element.type === 'text'),
      `${label} should render the art-directed invitation title`
    );
  }
});

test('Renderer integration - a saved custom canvas is never replaced by generated defaults', () => {
  const template = getTemplateById('savannah-twilight');
  const event = mockDb.events.find((candidate) => candidate.id === 'event-wedding-1');
  assert.ok(template && event);

  const customCanvas = [
    {
      id: 'host-authored-title',
      type: 'text',
      name: 'Custom title artwork',
      content: 'Wanjiku & Otieno',
      x: 36,
      y: 280,
      width: 408,
      height: 70,
      rotation: 0,
      zIndex: 5,
      opacity: 1,
      styleProps: {
        fontFamily: 'Cormorant Garamond',
        fontSize: 38,
        fontWeight: 500,
        color: '#272620',
        textAlign: 'center',
      },
    },
  ];

  const config = buildPublishedInvitationConfig(event, template, {
    design: { canvasElements: customCanvas },
  });

  assert.equal(config.design?.canvasElements, customCanvas);
  assert.deepEqual(config.design?.canvasElements?.map((element) => element.id), ['host-authored-title']);
});
