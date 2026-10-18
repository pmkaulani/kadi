import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const gallerySource = await readFile(new URL('../src/components/landing/MovingInvitationGallery.tsx', import.meta.url), 'utf8');
const stylesheet = await readFile(new URL('../src/app/globals.css', import.meta.url), 'utf8');
const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

test('landing scroll preserves native wheel, trackpad, touch and keyboard responsiveness', () => {
  assert.doesNotMatch(gallerySource, /from ['"]lenis['"]/);
  assert.doesNotMatch(gallerySource, /new Lenis\(/);
  assert.doesNotMatch(stylesheet, /lenis\/dist\/lenis\.css/);
  assert.equal(packageJson.dependencies.lenis, undefined);
  assert.match(gallerySource, /gsap\.registerPlugin\(ScrollTrigger\)/);
  assert.match(gallerySource, /context\.revert\(\)/);
  assert.match(gallerySource, /ScrollTrigger\.refresh\(\)/);
});

test('landing still has its moving invitation tapestry and restrained scroll-linked motion', () => {
  assert.match(gallerySource, /kadi-stream-up/);
  assert.match(gallerySource, /kadi-stream-down/);
  assert.match(gallerySource, /data-kadi-reveal/);
  assert.match(gallerySource, /scrub: 0\.12/);
  assert.match(gallerySource, /prefers-reduced-motion: reduce/);
  assert.match(gallerySource, /pointer: fine/);
});

test('landing scroll-linked animation does not wrap filtered search, editor or guest RSVP routes', () => {
  assert.match(gallerySource, /if \(hasActiveFilters \|\| !experienceRef\.current\) return/);
});
