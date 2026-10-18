import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const landingSource = await readFile(new URL('../src/components/visual-reference/KadiReferenceLanding.tsx', import.meta.url), 'utf8');
const atelierSource = await readFile(new URL('../src/components/landing/EnvelopeAtelier.tsx', import.meta.url), 'utf8');
const stylesheet = await readFile(new URL('../src/app/globals.css', import.meta.url), 'utf8');

test('landing page includes an envelope collection and the real envelope opening renderer', () => {
  assert.match(landingSource, /<EnvelopeAtelier\s*\/>/);
  assert.match(atelierSource, /<EnvelopeRenderer/);
  assert.match(atelierSource, /getTemplateCanvasElements\(template, values\)/);
  assert.match(atelierSource, /aria-pressed=\{selected\}/);
  assert.match(atelierSource, /ENVELOPE_OPTIONS/);
});

test('stationery specimens include paper, liner, folds, flap, and wax seal layers', () => {
  for (const selector of ['.ka-specimen__letter','.ka-specimen__liner','.ka-specimen__fold--left','.ka-specimen__fold--right','.ka-specimen__fold--bottom','.ka-specimen__flap','.ka-specimen__seal']) {
    assert.ok(stylesheet.includes(selector), 'Missing stationery layer: ' + selector);
  }
});

test('shared Kadi theme uses warm paper and oxblood accents', () => {
  assert.match(stylesheet, /--kadi-bg:\s*#F7F2EA/);
  assert.match(stylesheet, /--kadi-accent:\s*#7B3547/);
  assert.match(stylesheet, /--kadi-gold:\s*#B99A62/);
});


test('the inner flap opens upward from the shared envelope hinge without vertical offset', () => {
  assert.match(stylesheet, /\.iv-world \.iv-envelope-flap-face\s*\{\s*transform-origin:\s*50%\s+0%;/);
  assert.match(stylesheet, /\.iv-world \.iv-envelope-flap-face--inner\s*\{\s*transform:\s*rotateY\(180deg\);/);
});

test('atelier live preview uses readable ink on its light paper surface', () => {
  assert.match(stylesheet, /\.ka-atelier__preview \.iv-world \.iv-opening-title\s*\{[^}]*color:\s*var\(--atelier-ink\)/s);
  assert.match(stylesheet, /\.ka-atelier__preview \.iv-world \.iv-eyebrow,\s*\.ka-atelier__preview \.iv-world \.iv-open-instruction,[\s\S]*?\.ka-atelier__preview \.iv-world \.iv-opening-footer\s*\{\s*color:\s*var\(--atelier-muted\)/);
});

const templateCardSource = await readFile(new URL('../src/components/templates/ResponsiveTemplateCard.tsx', import.meta.url), 'utf8');
const canvasRendererSource = await readFile(new URL('../src/components/studio/canvas/CanvasCardView.tsx', import.meta.url), 'utf8');

test('design library renders the authored portrait canvas rather than a recycled hero image', () => {
  assert.match(templateCardSource, /getTemplateCanvasElements\(template, previewValues\)/);
  assert.match(templateCardSource, /<CanvasCardView/);
  assert.match(templateCardSource, /kadi-template-card__image--canvas/);
  assert.doesNotMatch(templateCardSource, /<Image\s/);
  assert.doesNotMatch(templateCardSource, /src=\{template\.sampleData\.heroImage\}/);
  assert.match(canvasRendererSource, /ARTBOARD_WIDTH = 480/);
  assert.match(canvasRendererSource, /ARTBOARD_HEIGHT = 680/);
});

test('canvas card stage keeps paper texture and avoids photo-gallery image cropping', () => {
  assert.match(stylesheet, /\.kadi-template-card__image--canvas\s*\{[^}]*linear-gradient\(145deg, #F3ECE2, #E2D8C9\)/s);
  assert.match(stylesheet, /\.kadi-template-card__image--canvas::after\s*\{\s*content:\s*none;/);
  assert.match(stylesheet, /\.kadi-template-card__image > img\s*\{\s*object-fit:\s*cover;/);
});
