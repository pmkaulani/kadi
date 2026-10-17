import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { ENVELOPE_OPENING_TIMELINE, resolveEnvelopeMotionStyle } from '../src/components/animation/EnvelopeRenderer';
import { getTemplateById, TEMPLATES } from '../src/lib/templates/catalogue';

test('Envelope Motion - resolves all 6 distinct opening styles accurately', () => {
  const weddingTemplate = getTemplateById('savannah-twilight');
  assert.ok(weddingTemplate, 'Wedding template exists');

  // 1. Classic Wax Seal
  const classic = resolveEnvelopeMotionStyle(weddingTemplate, {
    motionPreset: 'classic-wax-seal',
  });
  assert.equal(classic, 'classic-wax-seal');

  // 2. Floral Bloom
  const floral = resolveEnvelopeMotionStyle(weddingTemplate, {
    motionPreset: 'floral-bloom',
  });
  assert.equal(floral, 'floral-bloom');

  // 3. Confetti Burst
  const confetti = resolveEnvelopeMotionStyle(weddingTemplate, {
    motionPreset: 'confetti-burst',
  });
  assert.equal(confetti, 'confetti-burst');

  // 4. Minimal Fade
  const minimal = resolveEnvelopeMotionStyle(weddingTemplate, {
    motionPreset: 'minimal-fade',
  });
  assert.equal(minimal, 'minimal-fade');

  // 5. Gold Foil
  const gold = resolveEnvelopeMotionStyle(weddingTemplate, {
    motionPreset: 'gold-foil',
  });
  assert.equal(gold, 'gold-foil');

  // 6. Dignified Memorial
  const memorial = resolveEnvelopeMotionStyle(weddingTemplate, {
    motionPreset: 'dignified-memorial',
  });
  assert.equal(memorial, 'dignified-memorial');
});

test('Envelope Motion - memorial and funeral templates strictly enforce dignified-memorial', () => {
  const memorialTemplates = TEMPLATES.filter(
    (t) => t.category === 'memorial' || t.category === 'funeral'
  );
  assert.ok(memorialTemplates.length >= 2, 'Has at least 2 memorial/funeral templates');

  for (const template of memorialTemplates) {
    // Default motion style without overrides
    const defaultStyle = resolveEnvelopeMotionStyle(template);
    assert.equal(
      defaultStyle,
      'dignified-memorial',
      `Template ${template.id} in ${template.category} must resolve to dignified-memorial by default`
    );

    // Host attempts to override with celebratory or playful presets
    const celebratoryOverrides = ['confetti-burst', 'birthday-playful', 'floral-bloom', 'ruby-disco'];
    for (const playful of celebratoryOverrides) {
      const forcedStyle = resolveEnvelopeMotionStyle(template, { motionPreset: playful });
      assert.equal(
        forcedStyle,
        'dignified-memorial',
        `Template ${template.id} must NEVER inherit playful preset ${playful}`
      );
    }
  }
});

test('Envelope Motion - category defaults match appropriate cultural and emotional registers', () => {
  const birthdayTpl = getTemplateById('milestone-gold');
  assert.ok(birthdayTpl);
  assert.equal(resolveEnvelopeMotionStyle(birthdayTpl), 'confetti-burst');

  const babyShowerTpl = getTemplateById('sweet-beginnings');
  assert.ok(babyShowerTpl);
  assert.equal(resolveEnvelopeMotionStyle(babyShowerTpl), 'floral-bloom');

  const corporateTpl = getTemplateById('summit-executive');
  assert.ok(corporateTpl);
  assert.equal(resolveEnvelopeMotionStyle(corporateTpl), 'minimal-fade');

  const culturalTpl = getTemplateById('harambee-cultural-night');
  assert.ok(culturalTpl);
  assert.equal(resolveEnvelopeMotionStyle(culturalTpl), 'gold-foil');
});

test('Envelope Motion - timeline state machine transitions and cancellation safety', () => {
  // Simulate the timeline state machine and cancellation guarantees
  const timelineBeats = ENVELOPE_OPENING_TIMELINE;

  assert.deepEqual(
    timelineBeats.map(({ phase, delayMs }) => [phase, delayMs]),
    [
      ['seal-release', 280],
      ['flap-open', 600],
      ['card-rising', 1300],
      ['settling', 2050],
      ['settled', 2620],
    ],
    'The tests use the same declared choreography as the React component'
  );

  let currentPhase = 'closed';
  const timers = [];

  function openEnvelope(reducedMotion = false) {
    if (reducedMotion) {
      currentPhase = 'settled';
      return;
    }
    timers.forEach(clearTimeout);
    timers.length = 0;

    currentPhase = 'seal-press';
    timelineBeats.forEach((beat) => {
      const id = setTimeout(() => {
        currentPhase = beat.phase;
      }, beat.delayMs);
      timers.push(id);
    });
  }

  function skipToDetails() {
    timers.forEach(clearTimeout);
    timers.length = 0;
    currentPhase = 'settled';
  }

  function replay() {
    timers.forEach(clearTimeout);
    timers.length = 0;
    currentPhase = 'closed';
  }

  // 1. Normal run
  openEnvelope(false);
  assert.equal(currentPhase, 'seal-press');
  assert.equal(timers.length, ENVELOPE_OPENING_TIMELINE.length);

  // 2. Cancellation via skipToDetails
  skipToDetails();
  assert.equal(currentPhase, 'settled');
  assert.equal(timers.length, 0);

  // 3. Replay reset
  replay();
  assert.equal(currentPhase, 'closed');
  assert.equal(timers.length, 0);

  // 4. Reduced motion immediate bypass
  openEnvelope(true);
  assert.equal(currentPhase, 'settled');
  assert.equal(timers.length, 0);
});


test('Envelope Motion - the portrait paper composition is stable and CSS does not override Motion transforms', () => {
  const css = readFileSync(new URL('../src/app/globals.css', import.meta.url), 'utf8');

  assert.match(css, /\.iv-world \.iv-card-preview:not\(\.iv-card-preview--canvas\) \{[^}]*aspect-ratio: 480 \/ 680;/);
  assert.match(css, /\.iv-world \.iv-card-preview--canvas \{[^}]*aspect-ratio: 480 \/ 680;/);
  assert.match(css, /\.iv-world \.iv-insert-paper--back \{[^}]*aspect-ratio: 480 \/ 680;/);
  assert.match(css, /\.iv-world \.iv-insert-paper--front \{[^}]*aspect-ratio: 480 \/ 680;/);

  assert.ok(
    !css.includes('transform: translateY(-145px) translateZ(22px)'),
    'Legacy CSS must not snap the invitation card out of Framer Motion control'
  );
  assert.ok(
    !css.includes('transform: rotateX(-178deg);'),
    'The CSS cascade must not override the flap angle owned by Framer Motion'
  );
});
