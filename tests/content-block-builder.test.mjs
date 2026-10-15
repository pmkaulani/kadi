import test from 'node:test';
import assert from 'node:assert/strict';
import {
  BLOCK_DEFINITIONS,
  createBlock,
  duplicateBlock,
  reorderBlocks,
  sanitizeUrl,
  sanitizeVideoUrl,
  sanitizeLivestreamUrl,
  migrateEventToBlocks,
} from '../src/lib/blocks/registry';
import {
  InvitationBlockConfigSchema,
} from '../src/lib/blocks/types';
import {
  CURATED_FONT_PAIRS,
  CURATED_PALETTE_PRESETS,
  calculateContrastRatio,
  evaluateWcagContrast,
  autoFixContrast,
} from '../src/lib/design/presets';
import { mockDb } from '../src/lib/db/mock-db';

test('Block Registry - supports all 17 canonical block types with valid schema and stable unique IDs', () => {
  const allTypes = Object.keys(BLOCK_DEFINITIONS);
  assert.equal(allTypes.length, 17, 'Must support exactly 17 canonical block types');

  const generatedIds = new Set();

  for (const type of allTypes) {
    const block = createBlock(type);
    assert.equal(block.type, type);
    assert.equal(block.version, 1);
    assert.equal(block.enabled, true);
    assert.ok(block.id.startsWith(`blk_${type}_`), `Block ID must start with blk_${type}_`);
    assert.ok(!generatedIds.has(block.id), 'Each created block ID must be globally unique');
    generatedIds.add(block.id);

    // Verify Zod schema validation
    const parsed = InvitationBlockConfigSchema.safeParse(block);
    assert.ok(parsed.success, `Block of type "${type}" must strictly validate against Zod schema`);
  }
});

test('Block Operations - duplication creates distinct new ID while preserving content and settings', () => {
  const original = createBlock('rich-text', {
    headline: 'Original Headline',
    body: 'Original Body Text',
  }, {
    maxWidth: 'narrow',
    padding: 'spacious',
  });

  const duplicate = duplicateBlock(original);
  assert.notEqual(original.id, duplicate.id, 'Duplicate block must have a newly generated ID');
  assert.equal(duplicate.type, original.type);
  assert.equal(duplicate.version, 1);
  assert.equal(duplicate.enabled, true);
  assert.deepEqual(duplicate.settings, original.settings, 'Settings must be cloned');
  assert.deepEqual(duplicate.content, original.content, 'Content must be cloned');
});

test('Block Operations - reorderBlocks works immutably with boundary safety', () => {
  const b1 = createBlock('hero');
  const b2 = createBlock('countdown');
  const b3 = createBlock('venue-map');
  const initial = [b1, b2, b3];

  // Move b1 from index 0 to index 2
  const reordered = reorderBlocks(initial, 0, 2);
  assert.deepEqual(reordered.map((b) => b.id), [b2.id, b3.id, b1.id]);
  assert.notEqual(initial, reordered, 'Must return a new array');

  // Move b3 from index 2 to index 1
  const reordered2 = reorderBlocks(reordered, 2, 1);
  assert.deepEqual(reordered2.map((b) => b.id), [b2.id, b1.id, b3.id]);

  // Out of bounds / invalid operations should return copy without crashing
  const outOfBounds1 = reorderBlocks(initial, -1, 2);
  assert.deepEqual(outOfBounds1.map((b) => b.id), initial.map((b) => b.id));

  const outOfBounds2 = reorderBlocks(initial, 0, 99);
  assert.deepEqual(outOfBounds2.map((b) => b.id), initial.map((b) => b.id));

  const sameIndex = reorderBlocks(initial, 1, 1);
  assert.deepEqual(sameIndex.map((b) => b.id), initial.map((b) => b.id));
});

test('Security & XSS Sanitization - video URL parser strictly allows YouTube and Vimeo only', () => {
  // 1. YouTube variations
  const yt1 = sanitizeVideoUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  assert.ok(yt1);
  assert.equal(yt1.provider, 'youtube');
  assert.equal(yt1.videoId, 'dQw4w9WgXcQ');
  assert.ok(yt1.embedUrl.includes('youtube-nocookie.com/embed/dQw4w9WgXcQ'));

  const yt2 = sanitizeVideoUrl('https://youtu.be/dQw4w9WgXcQ');
  assert.ok(yt2);
  assert.equal(yt2.videoId, 'dQw4w9WgXcQ');

  const yt3 = sanitizeVideoUrl('dQw4w9WgXcQ');
  assert.ok(yt3);
  assert.equal(yt3.videoId, 'dQw4w9WgXcQ');

  // 2. Vimeo variations
  const vim1 = sanitizeVideoUrl('https://vimeo.com/76979871');
  assert.ok(vim1);
  assert.equal(vim1.provider, 'vimeo');
  assert.equal(vim1.videoId, '76979871');
  assert.ok(vim1.embedUrl.includes('player.vimeo.com/video/76979871'));

  // 3. Dangerous or unverified origins must be strictly rejected
  const malicious1 = sanitizeVideoUrl('javascript:alert("pwned")');
  assert.equal(malicious1, null, 'Reject javascript: URLs');

  const malicious2 = sanitizeVideoUrl('https://evil-attacker.com/malicious.mp4');
  assert.equal(malicious2, null, 'Reject unallowlisted external video sources');

  const malicious3 = sanitizeVideoUrl('data:text/html,<script>alert(1)</script>');
  assert.equal(malicious3, null, 'Reject data: URI injection');
});

test('Security & XSS Sanitization - button URL parser prevents script execution', () => {
  assert.equal(sanitizeUrl('https://safariparkhotel.com'), 'https://safariparkhotel.com');
  assert.equal(sanitizeUrl('http://insecure.com'), 'http://insecure.com');
  assert.equal(sanitizeUrl('mailto:rsvp@kadi.africa'), 'mailto:rsvp@kadi.africa');
  assert.equal(sanitizeUrl('tel:+254712345678'), 'tel:+254712345678');

  // Script injection vectors must be replaced with harmless '#'
  assert.equal(sanitizeUrl('javascript:alert(1)'), '#');
  assert.equal(sanitizeUrl('JAVASCRIPT:void(0)'), '#');
  assert.equal(sanitizeUrl('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg=='), '#');
  assert.equal(sanitizeUrl('vbscript:msgbox("hello")'), '#');
});

test('Schema Migration - converts legacy EventEntity into typed canonical blocks', () => {
  const weddingEvent = mockDb.events.find((e) => e.id === 'event-wedding-1');
  assert.ok(weddingEvent);

  const blocks = migrateEventToBlocks(weddingEvent);
  assert.ok(Array.isArray(blocks));
  assert.ok(blocks.length >= 5, 'Must generate multiple canonical blocks from event details');

  const blockTypes = blocks.map((b) => b.type);
  assert.ok(blockTypes.includes('countdown'), 'Must include countdown block');
  assert.ok(blockTypes.includes('venue-map'), 'Must include venue-map block');
  assert.ok(blockTypes.includes('rsvp'), 'Must include rsvp block');
  assert.ok(blockTypes.includes('contribution'), 'Must include contribution block');

  // Verify JSON serializability: zero functions, undefined, or circular references
  const serialized = JSON.stringify(blocks);
  assert.ok(serialized.length > 50);
  const deserialized = JSON.parse(serialized);
  assert.equal(deserialized.length, blocks.length);
});

test('Schema Migration - dignity rule: funeral events strictly omit celebration gift registry', () => {
  const funeralEvent = {
    id: 'funeral-event-1',
    category: 'funeral',
    title: 'Commemoration of Mzee Kiprono',
    celebrants: 'Mzee Kiprono',
    date: '10 November 2026',
    time: '10:00 AM',
    venue: 'Lee Funeral Chapel & St. Andrews Church',
    city: 'Nairobi',
    mpesaNumber: '8249102', // Host had an M-Pesa number
    rsvpDeadline: '5 November 2026',
  };

  const blocks = migrateEventToBlocks(funeralEvent);
  const blockTypes = blocks.map((b) => b.type);
  assert.ok(!blockTypes.includes('contribution'), 'Funeral events must NEVER generate a celebratory registry block');
  assert.ok(blockTypes.includes('guestbook'), 'Funeral events must include commemorative tributes/guestbook');
});

test('Typography Controls - provides ≥10 usable curated font pairings', () => {
  assert.ok(CURATED_FONT_PAIRS.length >= 10, 'Must have at least 10 font pairs');
  for (const pair of CURATED_FONT_PAIRS) {
    assert.ok(pair.id);
    assert.ok(pair.label);
    assert.ok(pair.headingFont);
    assert.ok(pair.bodyFont);
    assert.ok(pair.description);
  }
});

test('Palette Controls - provides ≥20 presets with valid WCAG contrast calculation', () => {
  assert.ok(CURATED_PALETTE_PRESETS.length >= 20, 'Must have at least 20 palette presets');

  for (const preset of CURATED_PALETTE_PRESETS) {
    assert.ok(preset.colors.primary);
    assert.ok(preset.colors.secondary);
    assert.ok(preset.colors.accent);
    assert.ok(preset.colors.background);
    assert.ok(preset.colors.text);

    // Calculate contrast ratio between text and paper background
    const ratio = calculateContrastRatio(preset.colors.text, preset.colors.background);
    assert.ok(ratio >= 1.0 && ratio <= 21.0, 'Contrast ratio must be between 1.0 and 21.0');

    const evalResult = evaluateWcagContrast(preset.colors.text, preset.colors.background);
    assert.ok(typeof evalResult.passAA === 'boolean');
    assert.ok(evalResult.badgeColor);
  }
});

test('Palette Controls - autoFixContrast guarantees WCAG AA (>= 4.5:1) compliance', () => {
  // Low-contrast pairing: Light yellow text on white background
  const lowContrastText = '#FAF089';
  const lightBg = '#FFFFFF';
  const initialRatio = calculateContrastRatio(lowContrastText, lightBg);
  assert.ok(initialRatio < 3.0, 'Initial pairing must fail contrast');

  // Auto-fix
  const fixedColor = autoFixContrast(lowContrastText, lightBg);
  const fixedRatio = calculateContrastRatio(fixedColor, lightBg);
  assert.ok(fixedRatio >= 4.5, `Auto-fixed text color must achieve WCAG AA (>= 4.5:1), got ${fixedRatio}:1`);
});
