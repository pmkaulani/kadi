import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const gallerySource = await readFile(new URL('../src/components/landing/MovingInvitationGallery.tsx', import.meta.url), 'utf8');

test('landing scroll motion is optional, scoped, and cleaned up', () => {
  assert.match(gallerySource, /prefers-reduced-motion: reduce/);
  assert.match(gallerySource, /pointer: fine/);
  assert.match(gallerySource, /lenis\.on\('scroll', updateScrollTrigger\)/);
  assert.match(gallerySource, /gsap\.ticker\.remove\(tick\)/);
  assert.match(gallerySource, /lenis\.destroy\(\)/);
  assert.match(gallerySource, /context\.revert\(\)/);
  assert.match(gallerySource, /ScrollTrigger\.refresh\(\)/);
});

test('landing scroll motion does not wrap the invitation editor or guest renderer', () => {
  assert.match(gallerySource, /Smooth scrolling is limited to the public invitation gallery/);
  assert.match(gallerySource, /if \(hasActiveFilters \|\| !experienceRef\.current\) return/);
});
