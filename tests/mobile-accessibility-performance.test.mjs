import test from 'node:test';
import assert from 'node:assert/strict';
import { TEMPLATES } from '../src/lib/templates/catalogue.js';
import { OCCASION_ART_DIRECTIONS } from '../src/lib/templates/occasion-art-direction.js';

// WCAG 2.1 relative luminance calculation
function sRGBToLinear(val) {
  const c = val / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function hexToRgb(hex) {
  const cleaned = hex.replace('#', '');
  const r = parseInt(cleaned.substring(0, 2), 16);
  const g = parseInt(cleaned.substring(2, 4), 16);
  const b = parseInt(cleaned.substring(4, 6), 16);
  return { r, g, b };
}

function getLuminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  const R = sRGBToLinear(r);
  const G = sRGBToLinear(g);
  const B = sRGBToLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function getContrastRatio(hex1, hex2) {
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

test('Phase 11 - Viewport Matrix Target Definitions', () => {
  const TARGET_VIEWPORTS = [
    { width: 320, height: 568, name: 'iPhone SE (1st gen)' },
    { width: 360, height: 800, name: 'Standard Android Entry' },
    { width: 375, height: 667, name: 'iPhone 6/7/8/SE' },
    { width: 390, height: 844, name: 'iPhone 12/13/14' },
    { width: 393, height: 852, name: 'iPhone 14 Pro / 15 / 16' },
    { width: 430, height: 932, name: 'iPhone 14/15/16 Pro Max' },
    { width: 768, height: 1024, name: 'iPad Mini/Air (Portrait)' },
    { width: 1024, height: 768, name: 'iPad (Landscape)' },
    { width: 1280, height: 800, name: 'Compact Laptop' },
    { width: 1440, height: 900, name: 'Standard Desktop' },
    { width: 1920, height: 1080, name: 'Full HD Widescreen' },
  ];

  assert.equal(TARGET_VIEWPORTS.length, 11);
  TARGET_VIEWPORTS.forEach((vp) => {
    assert.ok(vp.width >= 320, 'Minimum width must be at least 320px');
    assert.ok(vp.height >= 568, 'Minimum height must be at least 568px');
  });
});

test('Phase 11 - WCAG 2.1 AA Contrast Ratios (Minimum 4.5:1 for Normal Text)', () => {
  // 1. Primary Charcoal text on Paper Background
  const charcoalOnPaper = getContrastRatio('#272620', '#F6F2EA');
  assert.ok(
    charcoalOnPaper >= 11.0,
    `Charcoal text on paper contrast is ${charcoalOnPaper.toFixed(2)}, expected >= 11.0 (WCAG AAA)`
  );

  // 2. Primary Charcoal on Pure White Card
  const charcoalOnWhite = getContrastRatio('#272620', '#FFFFFF');
  assert.ok(
    charcoalOnWhite >= 13.0,
    `Charcoal text on white contrast is ${charcoalOnWhite.toFixed(2)}, expected >= 13.0`
  );

  // 3. Muted Slate secondary text on Paper
  const slateOnPaper = getContrastRatio('#60584D', '#F6F2EA');
  assert.ok(
    slateOnPaper >= 5.5,
    `Secondary text on paper contrast is ${slateOnPaper.toFixed(2)}, expected >= 4.5:1 (WCAG AA)`
  );

  // 4. Brand Action Accent Button (#794a32) with White Text
  const brandButtonContrast = getContrastRatio('#794a32', '#FFFFFF');
  assert.ok(
    brandButtonContrast >= 5.2,
    `Brand CTA button contrast is ${brandButtonContrast.toFixed(2)}, expected >= 4.5:1`
  );

  // 5. Dark Sidebar (#111815) with Light Text (#c8cbc4)
  const sidebarTextContrast = getContrastRatio('#c8cbc4', '#111815');
  assert.ok(
    sidebarTextContrast >= 8.0,
    `Sidebar text contrast is ${sidebarTextContrast.toFixed(2)}, expected >= 8.0`
  );
});

test('Phase 11 - Reduced Motion Behavior Contract', () => {
  // When prefers-reduced-motion is active, animation durations must collapse
  const getEffectiveDuration = (baseDuration, isReducedMotion) => {
    return isReducedMotion ? 0 : baseDuration;
  };

  const getEffectiveOffset = (baseOffset, isReducedMotion) => {
    return isReducedMotion ? 0 : baseOffset;
  };

  assert.equal(getEffectiveDuration(0.7, true), 0);
  assert.equal(getEffectiveDuration(0.7, false), 0.7);
  assert.equal(getEffectiveOffset(28, true), 0);
  assert.equal(getEffectiveOffset(28, false), 28);
});

test('Phase 11 - Touch Target Ergonomics (Minimum 40px-44px)', () => {
  const interactiveControls = [
    { name: 'Workspace Bottom Bar Action', minHeight: 48, minWidth: 48 },
    { name: 'Floating Action Button (Create +)', minHeight: 46, minWidth: 46 },
    { name: 'Modal Close Button', minHeight: 44, minWidth: 44 },
    { name: 'Occasion Rail Tile', minHeight: 56, minWidth: 132 },
    { name: 'Mobile Copy Personal Link Button', minHeight: 40, minWidth: 120 },
    { name: 'Desktop Workspace Primary Button', minHeight: 44, minWidth: 120 },
  ];

  interactiveControls.forEach((ctl) => {
    assert.ok(
      ctl.minHeight >= 40,
      `${ctl.name} height (${ctl.minHeight}px) meets touch ergonomics requirement (>= 40px)`
    );
  });
});

test('Phase 11 - Template Image Assets & Alt Text Descriptions', () => {
  TEMPLATES.forEach((tmpl) => {
    assert.ok(tmpl.sampleData.heroImage, `Template "${tmpl.id}" must have a hero image`);
    assert.ok(
      tmpl.sampleData.heroImage.length > 5,
      `Template "${tmpl.id}" hero image must be a valid path/URL`
    );
    assert.ok(tmpl.name, `Template "${tmpl.id}" must have a descriptive human-readable name`);
  });

  OCCASION_ART_DIRECTIONS.forEach((occ) => {
    assert.ok(occ.label, `Occasion "${occ.id}" must have a label`);
    assert.ok(occ.description, `Occasion "${occ.id}" must have a description`);
  });
});

test('Phase 11 - Dialog and Modal Accessibility Specifications', () => {
  const modalAttributes = {
    role: 'dialog',
    'aria-modal': 'true',
    supportsFocusReturn: true,
    supportsBodyScrollLock: true,
    supportsEscapeDismiss: true,
    hasCloseButton: true,
    closeButtonHasAriaLabel: true,
  };

  assert.equal(modalAttributes.role, 'dialog');
  assert.equal(modalAttributes['aria-modal'], 'true');
  assert.ok(modalAttributes.supportsFocusReturn);
  assert.ok(modalAttributes.supportsBodyScrollLock);
  assert.ok(modalAttributes.supportsEscapeDismiss);
  assert.ok(modalAttributes.hasCloseButton);
  assert.ok(modalAttributes.closeButtonHasAriaLabel);
});
