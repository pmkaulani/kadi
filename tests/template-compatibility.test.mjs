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
