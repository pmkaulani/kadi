import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { TEMPLATES } from '../src/lib/templates/catalogue';
import { getTemplateCanvasElements } from '../src/lib/templates/canvas-defaults';

test('Template library uses a distinct hero photo for every curated design', () => {
  const sourceKeys = TEMPLATES.map((template) => template.sampleData.heroImage.split('?')[0]);
  assert.equal(TEMPLATES.length, 39, 'the curated template collection should remain complete');
  assert.equal(new Set(sourceKeys).size, sourceKeys.length, 'template thumbnails should not recycle the same hero photograph');
});

test('Every template produces a real portrait artboard with image and typography elements', () => {
  for (const template of TEMPLATES) {
    const elements = getTemplateCanvasElements(template, {
      title: template.sampleData.title,
      hosts: template.sampleData.hosts,
      celebrants: template.sampleData.celebrants,
      date: template.sampleData.date,
      time: template.sampleData.time,
      timezone: 'Africa/Nairobi',
      venue: template.sampleData.venue,
      city: template.sampleData.city,
      heroImage: template.sampleData.heroImage,
      galleryImages: template.sampleData.galleryImages || [],
      story: template.sampleData.story || '',
    });
    assert.ok(elements.some((element) => element.type === 'photo'), `${template.id}: real photography should be part of the artboard`);
    assert.ok(elements.some((element) => element.type === 'text' && element.id === 'text-title'), `${template.id}: the event title should be rendered on the artboard`);
    assert.ok(elements.some((element) => element.type === 'text' && element.id === 'text-date'), `${template.id}: event details should be part of the artboard`);
  }
});

test('Shared template cards render the real canvas rather than a single hero-image thumbnail', async () => {
  const [component, stylesheet, visualAudit] = await Promise.all([
    readFile(new URL('../src/components/templates/ResponsiveTemplateCard.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../src/app/globals.css', import.meta.url), 'utf8'),
    readFile(new URL('../scripts/visual-audit-open.mjs', import.meta.url), 'utf8'),
  ]);
  assert.match(component, /CanvasCardView/);
  assert.match(component, /getTemplateCanvasElements/);
  assert.match(component, /kadi-template-card__image--canvas/);
  assert.doesNotMatch(component, /from ['"]next\/image['"]/);
  assert.match(stylesheet, /\.kadi-template-card__image--canvas\s*\{[\s\S]*?background-image:/);
  assert.match(stylesheet, /\.kadi-template-card__image--canvas::after\s*\{\s*content:\s*none;/);
  assert.match(visualAudit, /canvasRendered/);
});
