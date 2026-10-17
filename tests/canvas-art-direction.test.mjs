import test from 'node:test';
import assert from 'node:assert/strict';
import { getTemplateCanvasElements } from '../src/lib/templates/canvas-defaults';
import { getTemplateById, TEMPLATES } from '../src/lib/templates/catalogue';

function valuesFor(template, overrides = {}) {
  return {
    title: template.sampleData.title,
    hosts: template.sampleData.hosts,
    celebrants: template.sampleData.celebrants,
    date: template.sampleData.date,
    time: template.sampleData.time,
    venue: template.sampleData.venue,
    city: template.sampleData.city,
    heroImage: template.sampleData.heroImage,
    ...overrides,
  };
}

function template(id) {
  const result = getTemplateById(id);
  assert.ok(result, `Expected template "${id}" to exist`);
  return result;
}

function byId(elements, id) {
  const result = elements.find((element) => element.id === id);
  assert.ok(result, `Expected canvas element "${id}" to exist`);
  return result;
}

test('Canvas art direction - invitations use the selected event photo as real artwork', () => {
  const wedding = template('savannah-twilight');
  const values = valuesFor(wedding, { heroImage: '/uploads/wedding-couple.webp' });
  const elements = getTemplateCanvasElements(wedding, values);
  const photo = byId(elements, 'photo-hero');

  assert.equal(photo.type, 'photo');
  assert.equal(photo.content, '/uploads/wedding-couple.webp');
  assert.equal(photo.styleProps?.maskShape, 'arch');
  assert.equal(elements.filter((element) => element.type === 'photo').length, 1);
});

test('Canvas art direction - occasion layouts use different compositions', () => {
  const wedding = getTemplateCanvasElements(
    template('savannah-twilight'),
    valuesFor(template('savannah-twilight'))
  );
  const birthday = getTemplateCanvasElements(
    template('milestone-gold'),
    valuesFor(template('milestone-gold'))
  );
  const memorial = getTemplateCanvasElements(
    template('everlasting-peace'),
    valuesFor(template('everlasting-peace'))
  );
  const baby = getTemplateCanvasElements(
    template('sweet-beginnings'),
    valuesFor(template('sweet-beginnings'))
  );

  assert.equal(byId(wedding, 'photo-hero').styleProps?.maskShape, 'arch');
  assert.equal(byId(birthday, 'photo-hero').styleProps?.maskShape, 'none');
  assert.equal(byId(memorial, 'photo-hero').styleProps?.maskShape, 'oval');
  assert.equal(byId(baby, 'photo-hero').styleProps?.maskShape, 'arch');

  assert.notDeepEqual(
    byId(wedding, 'photo-hero'),
    byId(birthday, 'photo-hero'),
    'Wedding and birthday photography should have different placement and scale'
  );
  assert.notEqual(byId(wedding, 'text-title').styleProps?.fontFamily, byId(birthday, 'text-title').styleProps?.fontFamily);
});

test('Canvas art direction - default layout avoids mirrored corner decoration', () => {
  const samples = ['savannah-twilight', 'milestone-gold', 'everlasting-peace', 'sweet-beginnings'];
  for (const id of samples) {
    const elements = getTemplateCanvasElements(template(id), valuesFor(template(id)));
    assert.equal(elements.some((element) => element.id === 'sticker-bottom-left'), false, `${id} should not mirror stickers`);
    assert.equal(elements.some((element) => element.id === 'sticker-bottom-right'), false, `${id} should not mirror stickers`);
    assert.equal(new Set(elements.map((element) => element.id)).size, elements.length, `${id} must have unique canvas element IDs`);
  }
});

test('Canvas art direction - embellishments reference real PNG assets, not inline SVG markup', () => {
  const elements = getTemplateCanvasElements(
    template('savannah-twilight'),
    valuesFor(template('savannah-twilight'))
  );
  const stickers = elements.filter((element) => element.type === 'sticker');

  assert.ok(stickers.length > 0, 'Wedding design has at least one relevant embellishment');
  for (const asset of stickers) {
    assert.match(asset.content, /^\/stickers\/.+\.png$/);
    assert.equal(asset.content.startsWith('<svg'), false);
  }
});

test('Canvas art direction - guest details reflect the host values and optional RSVP deadline', () => {
  const tpl = template('savannah-twilight');
  const values = valuesFor(tpl, {
    hosts: 'The Njoroge and Kamau families',
    celebrants: 'Wanjiku & Otieno',
    date: 'Saturday, 12 December 2026',
    time: '2:00 PM EAT',
    venue: 'Nairobi Chapel',
    city: 'Nairobi, Kenya',
    rsvpDeadline: '1 December 2026',
  });
  const elements = getTemplateCanvasElements(tpl, values);

  assert.equal(byId(elements, 'text-hosts').content, 'The Njoroge and Kamau families');
  assert.equal(byId(elements, 'text-title').content, 'Wanjiku & Otieno');
  assert.match(byId(elements, 'text-date').content, /12 December 2026/);
  assert.match(byId(elements, 'text-venue').content, /Nairobi Chapel/);
  assert.match(byId(elements, 'text-rsvp').content, /1 DECEMBER 2026/);
});

test('Canvas art direction - important canvas elements receive coordinated entrance motion', () => {
  const tpl = template('savannah-twilight');
  const elements = getTemplateCanvasElements(tpl, valuesFor(tpl));

  assert.equal(byId(elements, 'photo-hero').animation?.effect, 'fadeIn');
  assert.equal(byId(elements, 'text-title').animation?.effect, 'fadeIn');
  assert.equal(byId(elements, 'text-hosts').animation?.effect, 'fadeIn');
  assert.ok(
    byId(elements, 'text-title').animation!.delay! > byId(elements, 'photo-hero').animation!.delay!,
    'The title should follow the artwork, not appear before it'
  );
});

test('Canvas art direction - memorial artwork remains unembellished and restrained', () => {
  const tpl = template('everlasting-peace');
  const elements = getTemplateCanvasElements(tpl, valuesFor(tpl));

  assert.equal(elements.some((element) => element.type === 'sticker'), false);
  assert.equal(byId(elements, 'photo-hero').styleProps?.maskShape, 'oval');
  assert.equal(byId(elements, 'text-hosts').content, tpl.sampleData.hosts);
  assert.equal(byId(elements, 'text-title').animation?.effect, 'rise');
});


test('Canvas art direction - every template keeps image, invitation request, and headline from colliding', () => {
  for (const tpl of TEMPLATES) {
    const elements = getTemplateCanvasElements(tpl, valuesFor(tpl));
    const request = byId(elements, 'text-request');
    const title = byId(elements, 'text-title');
    const photos = elements.filter((element) => element.type === 'photo');

    const lowerEdgeOfPhotography = Math.max(
      0,
      ...photos.map((photo) => photo.y + photo.height)
    );

    assert.ok(
      request.y >= lowerEdgeOfPhotography,
      `${tpl.id}: invitation request should sit below the photography (photo bottom ${lowerEdgeOfPhotography}, request y ${request.y})`
    );
    assert.ok(
      request.y + request.height <= title.y,
      `${tpl.id}: invitation request must end before the headline begins (request bottom ${request.y + request.height}, title y ${title.y})`
    );
    assert.ok(
      title.y + title.height <= byId(elements, 'text-date').y,
      `${tpl.id}: headline must finish before the date begins`
    );
  }
});

test('Canvas art direction - collage templates intentionally use two distinct photos', () => {
  for (const id of ['these-are-for-you', 'silver-memories']) {
    const tpl = template(id);
    const elements = getTemplateCanvasElements(tpl, valuesFor(tpl));
    const photos = elements.filter((element) => element.type === 'photo');
    assert.equal(photos.length, 2, `${id} should use two separate memory images`);
    assert.notEqual(photos[0].id, photos[1].id);
    assert.notDeepEqual(
      { x: photos[0].x, y: photos[0].y, width: photos[0].width, height: photos[0].height },
      { x: photos[1].x, y: photos[1].y, width: photos[1].width, height: photos[1].height }
    );
  }
});
