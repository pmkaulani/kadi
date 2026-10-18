import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('template gallery constrains the real canvas to the thumbnail stage', async () => {
  const [css, audit] = await Promise.all([
    readFile(new URL('../src/app/globals.css', import.meta.url), 'utf8'),
    readFile(new URL('../scripts/visual-audit-open.mjs', import.meta.url), 'utf8'),
  ]);
  const rule = css.match(/\.kadi-template-card__canvas-view\s*\{([^}]+)\}/);
  assert.ok(rule, 'Gallery canvas view has an explicit layout rule');
  assert.match(rule[1], /min-width:\s*0\s*;/, 'Canvas wrapper must not expand to the intrinsic 480px child width');
  assert.match(rule[1], /min-height:\s*0\s*;/, 'Canvas wrapper must not expand to the intrinsic 680px child height');
  assert.match(rule[1], /overflow:\s*hidden\s*;/, 'Gallery-stage canvas is clipped to its stage after fitting');
  assert.match(audit, /canvasFitsStage/, 'Rendered UI audit measures the canvas against its thumbnail stage');
  assert.match(audit, /canvasOverflows/, 'Rendered UI audit reports thumbnails which overflow their stage');
});
