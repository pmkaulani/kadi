import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { EventService } from '../src/lib/services/event-service.ts';
import { NotificationService } from '../src/lib/services/notification-service.ts';
import { isValidStatusTransition } from '../src/lib/validation/events.ts';
import { mockDb } from '../src/lib/db/mock-db.ts';

const ROOT_DIR = process.cwd();

// -----------------------------------------------------------------------------
// 1. Route Inventory - All Required App Routes Exist
// -----------------------------------------------------------------------------
test('Route Inventory - all specified public and workspace pages exist', () => {
  const requiredRoutes = [
    // Public Pages
    'src/app/page.tsx',
    'src/app/about/page.tsx',
    'src/app/how-it-works/page.tsx',
    'src/app/pricing/page.tsx',
    'src/app/faq/page.tsx',
    'src/app/contact/page.tsx',
    'src/app/privacy/page.tsx',
    'src/app/terms/page.tsx',
    'src/app/cookies/page.tsx',
    'src/app/data-protection/page.tsx',
    'src/app/login/page.tsx',
    'src/app/templates/page.tsx',
    'src/app/templates/[templateId]/page.tsx',
    'src/app/e/[slug]/page.tsx',

    // Workspace Pages
    'src/app/app/events/page.tsx',
    'src/app/app/events/new/page.tsx',
    'src/app/app/events/[eventId]/page.tsx',
    'src/app/app/templates/page.tsx',
  ];

  for (const relPath of requiredRoutes) {
    const fullPath = path.join(ROOT_DIR, relPath);
    assert.ok(fs.existsSync(fullPath), `Required route page must exist: ${relPath}`);
  }
});

// -----------------------------------------------------------------------------
// 2. Loading and Error Boundaries
// -----------------------------------------------------------------------------
test('Boundaries & Skeletons - loading, error, and not-found boundaries exist', () => {
  const boundaryFiles = [
    'src/app/not-found.tsx',
    'src/app/error.tsx',
    'src/app/loading.tsx',
    'src/app/app/loading.tsx',
    'src/app/app/error.tsx',
    'src/app/app/not-found.tsx',
    'src/app/e/[slug]/loading.tsx',
    'src/app/templates/[templateId]/loading.tsx',
  ];

  for (const relPath of boundaryFiles) {
    const fullPath = path.join(ROOT_DIR, relPath);
    assert.ok(fs.existsSync(fullPath), `Boundary file must exist: ${relPath}`);
  }
});

// -----------------------------------------------------------------------------
// 3. Event Lifecycle State Transitions
// -----------------------------------------------------------------------------
test('Event Lifecycle - draft -> published -> archived -> draft state machine transitions', () => {
  // Test valid transitions
  assert.equal(isValidStatusTransition('draft', 'published'), true, 'Draft should transition to published');
  assert.equal(isValidStatusTransition('draft', 'archived'), true, 'Draft should transition to archived');
  assert.equal(isValidStatusTransition('published', 'archived'), true, 'Published should transition to archived');
  assert.equal(isValidStatusTransition('archived', 'draft'), true, 'Archived can be restored to draft');

  // Test invalid transitions
  assert.equal(isValidStatusTransition('archived', 'published'), false, 'Archived cannot directly jump to published');
  assert.equal(isValidStatusTransition('published', 'draft'), false, 'Published cannot regress directly to draft without archiving/unarchiving');

  // Verify EventService methods
  const testEvent = EventService.createEvent({
    title: 'Lifecycle Verification Gala',
    hosts: 'The Committee',
    celebrants: 'Dr. Jane M.',
    category: 'gala',
    templateId: 'savannah-twilight',
    date: 'Saturday, 12 December 2026',
    time: '7:00 PM EAT',
    venue: 'Villa Rosa Kempinski',
    city: 'Nairobi',
    heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    rsvpDeadline: '1 December 2026',
  });

  assert.equal(testEvent.status, 'draft', 'Newly created event should have draft status');

  const published = EventService.publishEvent(testEvent.id);
  assert.equal(published.status, 'published', 'Published event should have published status');

  const archived = EventService.archiveEvent(testEvent.id);
  assert.equal(archived.status, 'archived', 'Archived event should have archived status');

  const restored = EventService.unarchiveEvent(testEvent.id);
  assert.equal(restored.status, 'draft', 'Unarchived event should restore to draft status');

  // Cleanup
  EventService.deleteEvent(testEvent.id);
});

// -----------------------------------------------------------------------------
// 4. Public Access Enforcement & Security
// -----------------------------------------------------------------------------
test('Event Security - public route access rules for draft, published, and archived states', () => {
  const privateDraft = EventService.createEvent({
    title: 'Secret Family Blessing',
    hosts: 'Host One',
    category: 'wedding',
    templateId: 'savannah-twilight',
    date: 'Saturday, 19 December 2026',
    time: '2:00 PM',
    venue: 'Garden Venue',
    city: 'Nairobi',
    heroImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    rsvpDeadline: '1 December 2026',
  });

  // Verify draft preview token generation
  const shareUrl = NotificationService.generateShareUrl(privateDraft, { baseUrl: 'https://kadi.co.ke' });
  assert.ok(shareUrl.includes('?tok=prev_'), 'Share URL for draft should contain signed preview token');

  const tokenString = shareUrl.split('?tok=')[1].split('&')[0];
  assert.equal(
    NotificationService.verifyPreviewToken(tokenString, privateDraft.id),
    true,
    'Valid signed preview token must verify successfully'
  );

  assert.equal(
    NotificationService.verifyPreviewToken('prev_fake_invalid_token', privateDraft.id),
    false,
    'Invalid preview token must be rejected'
  );

  // Cross-event token rejection
  assert.equal(
    NotificationService.verifyPreviewToken(tokenString, 'different-event-id'),
    false,
    'Preview token must be bound to specific event ID'
  );

  // Cleanup
  EventService.deleteEvent(privateDraft.id);
});

// -----------------------------------------------------------------------------
// 5. Navigation Links & Footer Integrity
// -----------------------------------------------------------------------------
test('Navigation Integrity - public navbar and footer links point to valid routes', () => {
  const navbarContent = fs.readFileSync(path.join(ROOT_DIR, 'src/components/layout/PublicNavbar.tsx'), 'utf-8');
  const footerContent = fs.readFileSync(path.join(ROOT_DIR, 'src/components/layout/PublicFooter.tsx'), 'utf-8');

  // Extract href values from navbar and footer
  const hrefRegex = /href="([^"#][^"]*)"/g;
  const navbarHrefs = [...navbarContent.matchAll(hrefRegex)].map((m) => m[1]);
  const footerHrefs = [...footerContent.matchAll(hrefRegex)].map((m) => m[1]);

  const allHrefs = Array.from(new Set([...navbarHrefs, ...footerHrefs]));

  for (const href of allHrefs) {
    // Standardize page path
    const pageRoute = href === '/' ? 'src/app/page.tsx' : `src/app${href}/page.tsx`;
    const fullPath = path.join(ROOT_DIR, pageRoute);
    assert.ok(
      fs.existsSync(fullPath),
      `Navigation href '${href}' must resolve to an existing page file at '${pageRoute}'`
    );
  }
});

// -----------------------------------------------------------------------------
// 6. Content States & Anti-Patterns Check
// -----------------------------------------------------------------------------
test('Quality Assurance - checks for forbidden placeholder anti-patterns in app pages', () => {
  const publicPages = [
    'src/app/page.tsx',
    'src/app/about/page.tsx',
    'src/app/how-it-works/page.tsx',
    'src/app/pricing/page.tsx',
    'src/app/faq/page.tsx',
    'src/app/contact/page.tsx',
    'src/app/privacy/page.tsx',
    'src/app/terms/page.tsx',
    'src/app/cookies/page.tsx',
    'src/app/data-protection/page.tsx',
  ];

  const forbiddenSnippets = [
    'Coming soon',
    'Lorem ipsum',
    'dolor sit amet',
    'TODO:',
    'FIXME:',
    'dummy text',
  ];

  for (const relPath of publicPages) {
    const content = fs.readFileSync(path.join(ROOT_DIR, relPath), 'utf-8');
    for (const forbidden of forbiddenSnippets) {
      assert.equal(
        content.toLowerCase().includes(forbidden.toLowerCase()),
        false,
        `Page '${relPath}' must not contain forbidden placeholder text '${forbidden}'`
      );
    }
  }
});
