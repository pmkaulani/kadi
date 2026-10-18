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

test('suite selector uses editorial typography and material swatches rather than faux envelope drawings', () => {
  assert.match(atelierSource, /ka-suite-option__palette/);
  assert.match(atelierSource, /ka-suite-option__name/);
  assert.match(stylesheet, /\.ka-suite-option\s*\{/);
  assert.match(stylesheet, /\.ka-suite-option__palette i:nth-child\(1\)/);
  assert.ok(!atelierSource.includes('ka-specimen__'), 'The landing page should not render simplified CSS envelope mockups');
  assert.ok(!stylesheet.includes('.ka-specimen__'), 'The stylesheet should not retain faux envelope illustration rules');
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

test('atelier live preview sits inside the same deep-teal visual world as the moving gallery', () => {
  assert.match(stylesheet, /\.ka-atelier\s*\{[^}]*background:radial-gradient\(circle at 72% 18%,#466F7F 0%,#365B6A 48%,#284753 100%\)/s);
  assert.match(stylesheet, /\.ka-atelier__preview \.iv-world \.iv-opening-title\s*\{\s*color:#F6F2EA;text-shadow:none;/);
  assert.match(stylesheet, /\.ka-atelier__preview \.iv-world\s*\{[^}]*background:transparent!important;/s);
  assert.match(stylesheet, /\.ka-atelier__preview \.iv-opening-stage\s*\{[^}]*background:transparent!important;/s);
});


test('atelier hides only duplicate intro text while preserving the envelope theme choreography', () => {
  assert.match(stylesheet, /\.ka-atelier__preview \.iv-opening-copy\s*\{\s*display:none !important;/);
  assert.doesNotMatch(stylesheet, /\.ka-atelier__preview \.iv-tabletop-scene[\s\S]{0,220}display:none/);
  assert.doesNotMatch(stylesheet, /\.ka-atelier__preview \.iv-confetti-stage\s*\{\s*display:none/);
  assert.match(atelierSource, /initialPhase="closed"/);
  assert.match(atelierSource, /<EnvelopeRenderer/);
});
