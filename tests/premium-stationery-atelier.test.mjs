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


test('the inner flap stays attached to the envelope fold during its 3D opening', () => {
  assert.match(stylesheet, /\.iv-world \.iv-envelope-flap-face\s*\{\s*transform-origin:\s*50%\s+0%;/);
});

test('atelier live preview uses readable ink on its light paper surface', () => {
  assert.match(stylesheet, /\.ka-atelier__preview \.iv-world \.iv-opening-title\s*\{[^}]*color:\s*var\(--atelier-ink\)/s);
  assert.match(stylesheet, /\.ka-atelier__preview \.iv-world \.iv-eyebrow,\s*\.ka-atelier__preview \.iv-world \.iv-open-instruction,[\s\S]*?\.ka-atelier__preview \.iv-world \.iv-opening-footer\s*\{\s*color:\s*var\(--atelier-muted\)/);
});
