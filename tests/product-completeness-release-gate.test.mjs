import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import path from 'path';

import {
  CanonicalInvitationConfigSchema,
  buildPublishedInvitationConfig,
  buildDraftPreviewInvitationConfig,
} from '../src/lib/invitations/config.ts';
import { getTemplateById, TEMPLATES } from '../src/lib/templates/catalogue.ts';
import { mockDb } from '../src/lib/db/mock-db.ts';
import { getDefaultInvitationSections } from '../src/lib/events/default-invitation-sections.ts';
import { resolveEnvelopeMotionStyle } from '../src/components/animation/EnvelopeRenderer.tsx';
import { SaveStateMachine } from '../src/lib/errors/catalog.ts';
import { RSVPService } from '../src/lib/services/rsvp-service.ts';
import { EventService } from '../src/lib/services/event-service.ts';
import { sanitizeLogData } from '../src/lib/telemetry/logger.ts';
import { getBillingProviderStatus, checkFeatureEntitlement } from '../src/lib/billing/entitlements.ts';
import { NotificationService } from '../src/lib/services/notification-service.ts';

test('Release Gate 1 - Route Inventory & Access Boundary Integrity', () => {
  const expectedPages = [
    'src/app/page.tsx',
    'src/app/about/page.tsx',
    'src/app/admin/page.tsx',
    'src/app/app/events/page.tsx',
    'src/app/app/events/new/page.tsx',
    'src/app/app/events/[eventId]/page.tsx',
    'src/app/app/templates/page.tsx',
    'src/app/contact/page.tsx',
    'src/app/cookies/page.tsx',
    'src/app/data-protection/page.tsx',
    'src/app/discover/page.tsx',
    'src/app/e/[slug]/page.tsx',
    'src/app/faq/page.tsx',
    'src/app/how-it-works/page.tsx',
    'src/app/login/page.tsx',
    'src/app/pricing/page.tsx',
    'src/app/privacy/page.tsx',
    'src/app/templates/page.tsx',
    'src/app/templates/[templateId]/page.tsx',
    'src/app/terms/page.tsx',
  ];

  for (const pagePath of expectedPages) {
    const fullPath = path.resolve(pagePath);
    assert.ok(fs.existsSync(fullPath), `Expected page route must exist: ${pagePath}`);
  }

  const expectedApiRoutes = [
    'src/app/api/admin/audit-logs/route.ts',
    'src/app/api/admin/events/route.ts',
    'src/app/api/admin/events/[eventId]/moderate/route.ts',
    'src/app/api/admin/reports/route.ts',
    'src/app/api/admin/reports/[reportId]/route.ts',
    'src/app/api/admin/telemetry/route.ts',
    'src/app/api/auth/login/route.ts',
    'src/app/api/auth/logout/route.ts',
    'src/app/api/auth/me/route.ts',
    'src/app/api/auth/signup/route.ts',
    'src/app/api/events/route.ts',
    'src/app/api/events/[eventId]/route.ts',
    'src/app/api/events/[eventId]/archive/route.ts',
    'src/app/api/events/[eventId]/checkin/route.ts',
    'src/app/api/events/[eventId]/cohosts/route.ts',
    'src/app/api/events/[eventId]/duplicate/route.ts',
    'src/app/api/events/[eventId]/guests/route.ts',
    'src/app/api/events/[eventId]/guests/import/route.ts',
    'src/app/api/events/[eventId]/insights/route.ts',
    'src/app/api/events/[eventId]/messages/route.ts',
    'src/app/api/events/[eventId]/publish/route.ts',
    'src/app/api/events/[eventId]/rsvps/route.ts',
    'src/app/api/events/[eventId]/rsvps/export/route.ts',
    'src/app/api/health/route.ts',
    'src/app/api/mpesa/stk-push/route.ts',
    'src/app/api/public/discovery/route.ts',
    'src/app/api/public/rsvp/route.ts',
    'src/app/api/support/ticket/route.ts',
  ];

  for (const apiPath of expectedApiRoutes) {
    const fullPath = path.resolve(apiPath);
    assert.ok(fs.existsSync(fullPath), `Expected API route must exist: ${apiPath}`);
  }
});

test('Release Gate 2 - Data-Flow Parity (Editor Draft -> Canonical Renderer -> Published Guest State)', () => {
  const weddingTemplate = getTemplateById('savannah-twilight');
  const weddingEvent = mockDb.events.find((e) => e.id === 'event-wedding-1');
  assert.ok(weddingTemplate && weddingEvent, 'Entities exist in database');

  const draftConfig = buildDraftPreviewInvitationConfig(
    weddingTemplate,
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
    {
      sealMonogram: 'K&W',
      sealColor: '#E6C15C',
    },
    { guestName: 'Amina & Family' }
  );

  const publishedConfig = buildPublishedInvitationConfig(weddingEvent, weddingTemplate, {
    design: {
      sealMonogram: 'K&W',
      sealColor: '#E6C15C',
    },
    guestToken: 'guest-live-token',
    guestPersonalization: {
      guestName: 'Amina & Family',
      isPlusOne: true,
      maxAttendees: 3,
    },
  });

  // 1. Both adhere strictly to CanonicalInvitationConfigSchema
  const draftParsed = CanonicalInvitationConfigSchema.safeParse(draftConfig);
  const publishedParsed = CanonicalInvitationConfigSchema.safeParse(publishedConfig);
  assert.ok(draftParsed.success, 'Draft config conforms to canonical schema');
  assert.ok(publishedParsed.success, 'Published config conforms to canonical schema');

  // 2. Draft is strictly marked readOnly with mode 'draft-preview'
  assert.equal(draftConfig.mode, 'draft-preview');
  assert.equal(draftConfig.isReadOnly, true);

  // 3. Published is marked with mode 'published' and interactive
  assert.equal(publishedConfig.mode, 'published');
  assert.equal(publishedConfig.isReadOnly, false);

  // 4. Section structure, order, and visual styling are identical
  assert.deepEqual(draftConfig.sectionOrder, publishedConfig.sectionOrder);
  assert.equal(draftConfig.design?.sealMonogram, publishedConfig.design?.sealMonogram);
  assert.equal(draftConfig.design?.sealColor, publishedConfig.design?.sealColor);
  assert.equal(draftConfig.guest?.name, publishedConfig.guest?.name);
});

test('Release Gate 3 - Six Envelope Motion Presets & Memorial Restraint', () => {
  const template = getTemplateById('savannah-twilight');
  assert.ok(template);

  const presets = [
    'classic-wax-seal',
    'floral-bloom',
    'confetti-burst',
    'minimal-fade',
    'gold-foil',
    'dignified-memorial',
  ];

  for (const preset of presets) {
    const resolved = resolveEnvelopeMotionStyle(template, { motionPreset: preset });
    assert.equal(resolved, preset, `Preset ${preset} must resolve correctly`);
  }

  // Memorial templates must strictly enforce dignified-memorial
  const memorialTemplates = TEMPLATES.filter((t) => t.category === 'memorial' || t.category === 'funeral');
  for (const memTemplate of memorialTemplates) {
    const defaultMotion = resolveEnvelopeMotionStyle(memTemplate);
    assert.equal(
      defaultMotion,
      'dignified-memorial',
      `Memorial template ${memTemplate.id} must enforce dignified-memorial`
    );

    // Overrides requesting confetti must be rejected/restrained to dignified-memorial
    const forcedCelebratory = resolveEnvelopeMotionStyle(memTemplate, { motionPreset: 'confetti-burst' });
    assert.equal(
      forcedCelebratory,
      'dignified-memorial',
      `Memorial template ${memTemplate.id} must reject playful confetti motion`
    );
  }
});

import { EVENT_CATEGORY_IDS } from '../src/lib/events/categories.ts';

test('Release Gate 4 - 23 Canonical Occasion Templates & Asset Integrity', () => {
  assert.equal(EVENT_CATEGORY_IDS.length, 23, 'Must have 23 canonical occasions');

  for (const cat of EVENT_CATEGORY_IDS) {
    const defaultSections = getDefaultInvitationSections(cat);
    assert.ok(
      Array.isArray(defaultSections) && defaultSections.length > 0,
      `Category ${cat} must provide default invitation sections`
    );

    const templatesInCat = TEMPLATES.filter((t) => t.category === cat);
    assert.ok(
      templatesInCat.length > 0,
      `Category ${cat} must have at least one authentic template in catalogue`
    );

    for (const t of templatesInCat) {
      assert.ok(t.sampleData?.heroImage, `Template ${t.id} must have a heroImage sample asset`);
      assert.ok(t.palette.envelope, `Template ${t.id} must define an envelope color`);
      assert.ok(t.palette.seal, `Template ${t.id} must define a seal color`);
      // Zero human faces in cover assets
      assert.ok(
        !t.sampleData.heroImage.toLowerCase().includes('portrait') && !t.sampleData.heroImage.toLowerCase().includes('face'),
        `Template ${t.id} sample hero asset must avoid human portraits`
      );
    }
  }
});


test('Release Gate 5 - Monotonic Autosave State Machine with Out-of-Order Save Isolation', () => {
  const sm = new SaveStateMachine(1);
  assert.equal(sm.getState().status, 'idle');

  // Keystroke 1 -> rev 2
  sm.registerEdit();
  assert.equal(sm.getState().currentRevision, 2);
  assert.equal(sm.getState().status, 'unsaved');

  // Keystroke 2 -> rev 3
  sm.registerEdit();
  assert.equal(sm.getState().currentRevision, 3);

  // Network initiates saving
  sm.startSaving(2);
  assert.equal(sm.getState().status, 'saving');

  // Simulate late response from earlier rev 2 arriving after rev 3 was typed
  sm.saveSucceeded(2);
  assert.equal(sm.getState().status, 'unsaved', 'Late out-of-order save response for rev 2 must not mark rev 3 as saved');

  // Correct rev 3 response arrives
  sm.saveSucceeded(3);
  assert.equal(sm.getState().status, 'saved', 'Up-to-date save response for rev 3 marks state clean');
});

test('Release Gate 6 - Security Review: Formula Injection Neutralization', () => {
  const event = EventService.createEvent({
    title: 'Release Gate Formula Security Test',
    category: 'wedding',
  });

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

  assert.ok(csvData.includes("'=cmd"), 'Formula starting with = must be prepended with apostrophe');
  assert.ok(csvData.includes("'@SUM"), 'Formula starting with @ must be prepended with apostrophe');
  assert.ok(csvData.includes("'+HYPERLINK"), 'Formula starting with + must be prepended with apostrophe');
});

test('Release Gate 7 - Security Review: Sensitive Data Redaction in Server Telemetry', () => {
  const rawLog = {
    userEmail: 'host@kadi.africa',
    password: 'SuperSecretPassword123!',
    token: 'jwt.tok.abc12345',
    stkSecret: 'daraja_sandbox_passkey_998',
    sqlQuery: 'SELECT * FROM users WHERE password = "abc"',
    eventTitle: 'Golden Jubilee Celebration',
  };

  const sanitized = sanitizeLogData(rawLog);

  assert.equal(sanitized.password, '[REDACTED]');
  assert.equal(sanitized.token, '[REDACTED]');
  assert.equal(sanitized.stkSecret, '[REDACTED]');
  assert.equal(sanitized.eventTitle, 'Golden Jubilee Celebration');
  assert.equal(sanitized.userEmail, 'host@kadi.africa');
});

test('Release Gate 8 - Honest Pilot Preview Entitlements & Provider Declarations', () => {
  const providerStatus = getBillingProviderStatus();
  assert.equal(providerStatus.mode, 'pilot_preview');

  // During pilot preview, Pro features are granted complimetarily without deception
  const check = checkFeatureEntitlement('host-user-1', 'premiumTemplates');
  assert.equal(check.granted, true);
  assert.equal(check.tier, 'pro');
});

test('Release Gate 9 - External Provider Dispatches vs Manual Share Links', () => {
  const weddingEvent = mockDb.events.find((e) => e.id === 'event-wedding-1');
  assert.ok(weddingEvent);

  const shareUrl = 'https://kadi.africa/e/savannah-soiree?tok=abc1234';
  const waUrl = NotificationService.getWhatsAppDirectUrl(weddingEvent, shareUrl, '+254712345678', 'Wanjiku & Kevin');

  // WhatsApp click-to-chat must format wa.me cleanly without pretending server sent it
  assert.ok(waUrl.startsWith('https://wa.me/254712345678?text='));
  assert.ok(waUrl.includes(encodeURIComponent(shareUrl)));
});
