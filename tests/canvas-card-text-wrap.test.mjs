import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('canvas invitation text is constrained to its authored box and can wrap', async () => {
  const source = await readFile(
    new URL('../src/components/studio/canvas/CanvasCardView.tsx', import.meta.url),
    'utf8'
  );
  const match = source.match(/<span className="([^"]+)"[^>]*>\{elem\.content\}<\/span>/);
  assert.ok(match, 'CanvasCardView should render invitation text in a dedicated span');
  const classes = match[1].split(/\s+/);
  assert.ok(classes.includes('block'), 'The text span must have a layout box for width constraints to apply');
  assert.ok(classes.includes('w-full'), 'The text span should use the authored text box width');
  assert.ok(classes.includes('min-w-0'), 'The flex child must be allowed to shrink below its max-content width');
  assert.ok(classes.includes('break-words'), 'Long guest/couple names must wrap instead of spilling out of the artboard');
  assert.ok(!classes.includes('whitespace-nowrap'), 'Invitation text must not be forced onto one line');
});
