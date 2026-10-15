import test from 'node:test';
import assert from 'node:assert/strict';

import { TEMPLATES, getTemplateById, getTemplatesByCategory } from '../src/lib/templates/catalogue.ts';

test('Template Catalogue - all templates have valid IDs, palettes, and required assets', () => {
  assert.ok(TEMPLATES.length >= 6);

  const ids = new Set();
  for (const tmpl of TEMPLATES) {
    assert.ok(tmpl.id);
    assert.ok(!ids.has(tmpl.id), `Duplicate template ID: ${tmpl.id}`);
    ids.add(tmpl.id);

    // Verify palette tokens
    assert.ok(tmpl.palette.primary.startsWith('#'));
    assert.ok(tmpl.palette.envelope.startsWith('#'));
    assert.ok(tmpl.palette.cardBackground.startsWith('#'));

    // Verify liner and seal
    assert.ok(tmpl.liner.id);
    assert.ok(tmpl.liner.className);
    assert.ok(tmpl.seal.shape);
    assert.ok(tmpl.seal.color);

    // Verify sample data
    assert.ok(tmpl.sampleData.title);
    assert.ok(tmpl.sampleData.hosts);
    assert.ok(tmpl.sampleData.venue);
  }
});

test('Video-reference invitation worlds exist as distinct template experiences', () => {
  const expected = new Map([
    ['ruby-disco-birthday', 'ruby-disco'],
    ['these-are-for-you', 'gift-box'],
    ['pastel-garden-birthday', 'pastel-garden'],
    ['sage-love-letter', 'sage-love-letter'],
  ]);

  for (const [templateId, experienceTheme] of expected) {
    const template = getTemplateById(templateId);
    assert.ok(template, `Missing video-reference template: ${templateId}`);
    assert.equal(template.experienceTheme, experienceTheme);
    assert.ok(template.sampleData.galleryImages?.length >= 3, `${templateId} should have demo gallery media`);
  }
});

test('Motion Constraints - memorial templates never inherit playful or celebratory motion', () => {
  const memorialTemplates = getTemplatesByCategory('memorial');
  assert.ok(memorialTemplates.length >= 1);

  for (const tmpl of memorialTemplates) {
    assert.equal(
      tmpl.motionPreset,
      'dignified-memorial',
      'Memorial template must strictly use dignified-memorial motion'
    );
    assert.notEqual(tmpl.motionPreset, 'birthday-playful');
  }
});

test('Template Catalogue - diversity requirements and per-category counts', () => {
  assert.ok(TEMPLATES.length >= 24, `Expected at least 24 templates, got ${TEMPLATES.length}`);
  const counts = {};
  for (const t of TEMPLATES) {
    counts[t.category] = (counts[t.category] || 0) + 1;
  }
  assert.ok((counts['housewarming'] || 0) >= 2, 'Housewarming must have at least 2 templates');
  assert.ok((counts['graduation'] || 0) >= 2, 'Graduation must have at least 2 templates');
  assert.ok((counts['birthday'] || 0) >= 3, 'Birthday must have at least 3 templates');
  assert.ok((counts['wedding'] || 0) >= 3, 'Wedding must have at least 3 templates');
  assert.ok((counts['memorial'] || 0) >= 1, 'Memorial must have at least 1 template');
  assert.ok((counts['funeral'] || 0) >= 1, 'Funeral must have at least 1 template');
  assert.ok((counts['baby-shower'] || 0) >= 1, 'Baby shower must have at least 1 template');
  assert.ok((counts['corporate'] || 0) >= 1, 'Corporate must have at least 1 template');
  assert.ok((counts['anniversary'] || 0) >= 1, 'Anniversary must have at least 1 template');
});

test('Template Catalogue - all 23 canonical categories are fully covered', async () => {
  const { EVENT_CATEGORY_IDS } = await import('../src/lib/events/categories.ts');
  const coveredCategories = new Set(TEMPLATES.map((t) => t.category));

  for (const catId of EVENT_CATEGORY_IDS) {
    assert.ok(
      coveredCategories.has(catId),
      `Expected category '${catId}' to have at least one template, but found none.`
    );
  }
});
