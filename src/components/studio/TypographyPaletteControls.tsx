'use client';

import React, { useMemo } from 'react';
import {
  Type,
  Palette,
  Sliders,
  Sparkles,
  Check,
  AlertTriangle,
  Wand2,
  Layout,
} from 'lucide-react';
import {
  CURATED_FONT_PAIRS,
  CURATED_PALETTE_PRESETS,
  evaluateWcagContrast,
  autoFixContrast,
} from '@/lib/design/presets';
import type { EventDesignEntity } from '@/lib/db/types';

interface TypographyPaletteControlsProps {
  design: Partial<EventDesignEntity>;
  onChange: (patch: Partial<EventDesignEntity>) => void;
  category?: string;
}

export function TypographyPaletteControls({
  design,
  onChange,
  category,
}: TypographyPaletteControlsProps) {
  // Current values
  const typography = design.typography || {
    headingFont: design.fontFamily || 'Playfair Display, Georgia, serif',
    bodyFont: 'Inter, sans-serif',
    scale: 1,
    headingLetterSpacing: 0,
    bodyLineHeight: 1.6,
  };

  const palette = design.palette || {
    primary: '#934638',
    secondary: '#3E2F28',
    accent: '#C59B4B',
    envelope: '#934638',
    flap: '#7A3529',
    cardBackground: '#FAF8F5',
    text: '#272620',
  };

  const layout = design.layoutPreset || {
    spacing: design.layoutSpacing || 'comfortable',
    cornerStyle: 'soft',
    borderStyle: 'none',
  };

  // WCAG contrast calculation between text and paper card background
  const textColor = palette.text || '#272620';
  const bgColor = palette.cardBackground || '#FAF8F5';
  const wcag = useMemo(() => evaluateWcagContrast(textColor, bgColor), [textColor, bgColor]);

  // Patch palette helper
  const handleColorChange = (key: keyof typeof palette, value: string) => {
    onChange({
      palette: {
        ...palette,
        [key]: value,
      },
    });
  };

  // Auto-fix contrast button handler
  const handleAutoFix = () => {
    const fixedText = autoFixContrast(textColor, bgColor);
    onChange({
      palette: {
        ...palette,
        text: fixedText,
      },
    });
  };

  // Preset selection handler
  const handlePalettePreset = (presetId: string) => {
    const preset = CURATED_PALETTE_PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    onChange({
      palette: {
        primary: preset.colors.primary,
        secondary: preset.colors.secondary,
        accent: preset.colors.accent,
        envelope: preset.colors.primary,
        flap: preset.colors.secondary,
        cardBackground: preset.colors.background,
        text: preset.colors.text,
      },
    });
  };

  // Font pair selection handler
  const handleFontPairSelect = (pairId: string) => {
    const pair = CURATED_FONT_PAIRS.find((p) => p.id === pairId);
    if (!pair) return;
    onChange({
      fontFamily: pair.headingFont,
      typography: {
        ...typography,
        headingFont: pair.headingFont,
        bodyFont: pair.bodyFont,
      },
    });
  };

  // Active font pair ID
  const activePair =
    CURATED_FONT_PAIRS.find(
      (p) => p.headingFont === typography.headingFont || p.headingFont.includes(design.fontFamily || '')
    ) || CURATED_FONT_PAIRS[0];

  return (
    <div className="space-y-6">
      {/* 1. TYPOGRAPHY CONTROLS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#6D6558] flex items-center gap-1.5">
            <Type size={13} className="text-[#934638]" /> Curated Font Pairing ({CURATED_FONT_PAIRS.length})
          </label>
        </div>

        <select
          value={activePair.id}
          onChange={(e) => handleFontPairSelect(e.target.value)}
          className="w-full text-xs p-2.5 rounded border border-[rgba(39,38,32,0.18)] bg-white font-medium focus:outline-[#934638]"
        >
          {CURATED_FONT_PAIRS.map((pair) => (
            <option key={pair.id} value={pair.id}>
              {pair.label} ({pair.headingStyle})
            </option>
          ))}
        </select>
        <p className="text-[11px] text-[#756F64] italic">
          {activePair.description}
        </p>

        {/* Micro-Sliders for Typography fine-tuning */}
        <div className="bg-[#FAF8F5] p-3.5 rounded-lg border border-[rgba(39,38,32,0.1)] space-y-3">
          <div className="text-[10px] uppercase font-bold tracking-wider text-[#6D6558] flex items-center gap-1">
            <Sliders size={12} /> Fine-tune Type Scale & Rhythm
          </div>

          {/* Scale */}
          <div>
            <div className="flex justify-between text-[11px] font-medium text-[#272620] mb-1">
              <span>Font Scale</span>
              <span className="font-mono text-[10px] text-[#8C8375]">
                {((typography.scale || 1) * 100).toFixed(0)}%
              </span>
            </div>
            <input
              type="range"
              min="0.85"
              max="1.25"
              step="0.05"
              value={typography.scale || 1}
              onChange={(e) =>
                onChange({
                  typography: {
                    ...typography,
                    scale: parseFloat(e.target.value),
                  },
                })
              }
              className="w-full accent-[#934638] h-1.5 bg-gray-200 rounded cursor-pointer"
            />
          </div>

          {/* Letter Spacing */}
          <div>
            <div className="flex justify-between text-[11px] font-medium text-[#272620] mb-1">
              <span>Heading Letter Spacing</span>
              <span className="font-mono text-[10px] text-[#8C8375]">
                {(typography.headingLetterSpacing || 0).toFixed(2)}em
              </span>
            </div>
            <input
              type="range"
              min="-0.04"
              max="0.16"
              step="0.01"
              value={typography.headingLetterSpacing || 0}
              onChange={(e) =>
                onChange({
                  typography: {
                    ...typography,
                    headingLetterSpacing: parseFloat(e.target.value),
                  },
                })
              }
              className="w-full accent-[#934638] h-1.5 bg-gray-200 rounded cursor-pointer"
            />
          </div>

          {/* Line Height */}
          <div>
            <div className="flex justify-between text-[11px] font-medium text-[#272620] mb-1">
              <span>Body Line Height</span>
              <span className="font-mono text-[10px] text-[#8C8375]">
                {(typography.bodyLineHeight || 1.6).toFixed(2)}
              </span>
            </div>
            <input
              type="range"
              min="1.3"
              max="1.9"
              step="0.05"
              value={typography.bodyLineHeight || 1.6}
              onChange={(e) =>
                onChange({
                  typography: {
                    ...typography,
                    bodyLineHeight: parseFloat(e.target.value),
                  },
                })
              }
              className="w-full accent-[#934638] h-1.5 bg-gray-200 rounded cursor-pointer"
            />
          </div>
        </div>
      </div>

      <hr className="border-[rgba(39,38,32,0.1)]" />

      {/* 2. PALETTE CONTROLS & CONTRAST MATH */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-bold uppercase tracking-wider text-[#6D6558] flex items-center gap-1.5">
            <Palette size={13} className="text-[#934638]" /> Curated Palette Presets ({CURATED_PALETTE_PRESETS.length})
          </label>
        </div>

        <select
          onChange={(e) => handlePalettePreset(e.target.value)}
          defaultValue=""
          className="w-full text-xs p-2.5 rounded border border-[rgba(39,38,32,0.18)] bg-white font-medium focus:outline-[#934638]"
        >
          <option value="" disabled>
            Choose a palette preset…
          </option>
          {CURATED_PALETTE_PRESETS.map((preset) => (
            <option key={preset.id} value={preset.id}>
              {preset.name} · {preset.description.split('.')[0]}
            </option>
          ))}
        </select>

        {/* 5 Editable Swatches */}
        <div>
          <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6D6558] mb-2">
            5 Core Stationery Swatches
          </label>
          <div className="grid grid-cols-5 gap-1.5 text-center text-[10px]">
            {/* Primary */}
            <label className="border border-[rgba(39,38,32,0.12)] p-1.5 rounded flex flex-col items-center gap-1 cursor-pointer bg-white hover:bg-black/[0.02]">
              <span className="font-medium text-[#6D6558] text-[9px] uppercase">Primary</span>
              <input
                type="color"
                aria-label="Primary colour"
                className="w-6 h-6 rounded border-none cursor-pointer"
                value={palette.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
              />
              <span className="font-mono text-[8px] uppercase text-[#8C8375] truncate max-w-full">
                {palette.primary}
              </span>
            </label>

            {/* Secondary */}
            <label className="border border-[rgba(39,38,32,0.12)] p-1.5 rounded flex flex-col items-center gap-1 cursor-pointer bg-white hover:bg-black/[0.02]">
              <span className="font-medium text-[#6D6558] text-[9px] uppercase">Secondary</span>
              <input
                type="color"
                aria-label="Secondary colour"
                className="w-6 h-6 rounded border-none cursor-pointer"
                value={palette.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
              />
              <span className="font-mono text-[8px] uppercase text-[#8C8375] truncate max-w-full">
                {palette.secondary}
              </span>
            </label>

            {/* Accent */}
            <label className="border border-[rgba(39,38,32,0.12)] p-1.5 rounded flex flex-col items-center gap-1 cursor-pointer bg-white hover:bg-black/[0.02]">
              <span className="font-medium text-[#6D6558] text-[9px] uppercase">Accent</span>
              <input
                type="color"
                aria-label="Accent colour"
                className="w-6 h-6 rounded border-none cursor-pointer"
                value={palette.accent}
                onChange={(e) => handleColorChange('accent', e.target.value)}
              />
              <span className="font-mono text-[8px] uppercase text-[#8C8375] truncate max-w-full">
                {palette.accent}
              </span>
            </label>

            {/* Card Background Paper */}
            <label className="border border-[rgba(39,38,32,0.12)] p-1.5 rounded flex flex-col items-center gap-1 cursor-pointer bg-white hover:bg-black/[0.02]">
              <span className="font-medium text-[#6D6558] text-[9px] uppercase">Paper</span>
              <input
                type="color"
                aria-label="Paper background colour"
                className="w-6 h-6 rounded border-none cursor-pointer"
                value={palette.cardBackground}
                onChange={(e) => handleColorChange('cardBackground', e.target.value)}
              />
              <span className="font-mono text-[8px] uppercase text-[#8C8375] truncate max-w-full">
                {palette.cardBackground}
              </span>
            </label>

            {/* Ink / Text */}
            <label className="border border-[rgba(39,38,32,0.12)] p-1.5 rounded flex flex-col items-center gap-1 cursor-pointer bg-white hover:bg-black/[0.02]">
              <span className="font-medium text-[#6D6558] text-[9px] uppercase">Ink Text</span>
              <input
                type="color"
                aria-label="Ink text colour"
                className="w-6 h-6 rounded border-none cursor-pointer"
                value={palette.text || '#272620'}
                onChange={(e) => handleColorChange('text', e.target.value)}
              />
              <span className="font-mono text-[8px] uppercase text-[#8C8375] truncate max-w-full">
                {palette.text || '#272620'}
              </span>
            </label>
          </div>
        </div>

        {/* Live Contrast Ratio & WCAG Alert */}
        <div className="p-3 rounded-lg border border-[rgba(39,38,32,0.1)] bg-[#FAF8F5] flex items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-xs" style={{ color: wcag.badgeColor }}>
                {wcag.ratio}:1
              </span>
              <span
                className="text-[10px] px-2 py-0.5 rounded font-semibold text-white uppercase tracking-wider"
                style={{ backgroundColor: wcag.badgeColor }}
              >
                {wcag.label}
              </span>
            </div>
            <p className="text-[10px] text-[#756F64]">
              Contrast between ink text ({palette.text || '#272620'}) and card paper ({palette.cardBackground})
            </p>
          </div>

          {!wcag.passAA && (
            <button
              type="button"
              onClick={handleAutoFix}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-[#934638] text-white text-[11px] font-medium shadow-xs hover:bg-[#7A3529] transition-colors shrink-0"
              title="Automatically darken/lighten text to achieve WCAG AA compliance"
            >
              <Wand2 size={12} />
              <span>Auto-Fix</span>
            </button>
          )}
        </div>
      </div>

      <hr className="border-[rgba(39,38,32,0.1)]" />

      {/* 3. LAYOUT & CORNER PRESETS */}
      <div className="space-y-3.5">
        <label className="text-[11px] font-bold uppercase tracking-wider text-[#6D6558] flex items-center gap-1.5">
          <Layout size={13} className="text-[#934638]" /> Layout & Surface Styling
        </label>

        {/* Spacing */}
        <div>
          <label className="block text-[10px] font-semibold text-[#6D6558] mb-1">
            Section Spacing
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['compact', 'comfortable', 'spacious'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() =>
                  onChange({
                    layoutSpacing: mode,
                    layoutPreset: { ...layout, spacing: mode },
                  })
                }
                className={`py-1.5 text-xs font-medium rounded border capitalize transition-all ${
                  (design.layoutSpacing || layout.spacing) === mode
                    ? 'border-[#934638] bg-[#FAF4EB] text-[#794a32]'
                    : 'border-[rgba(39,38,32,0.15)] bg-white text-[#6D6558] hover:bg-black/[0.02]'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        {/* Corner Style */}
        <div>
          <label className="block text-[10px] font-semibold text-[#6D6558] mb-1">
            Card Corners
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(['square', 'soft', 'round', 'pill'] as const).map((corner) => (
              <button
                key={corner}
                type="button"
                onClick={() =>
                  onChange({
                    layoutPreset: { ...layout, cornerStyle: corner },
                  })
                }
                className={`py-1.5 text-xs font-medium rounded border capitalize transition-all ${
                  layout.cornerStyle === corner
                    ? 'border-[#934638] bg-[#FAF4EB] text-[#794a32]'
                    : 'border-[rgba(39,38,32,0.15)] bg-white text-[#6D6558] hover:bg-black/[0.02]'
                }`}
              >
                {corner}
              </button>
            ))}
          </div>
        </div>

        {/* Border Style */}
        <div>
          <label className="block text-[10px] font-semibold text-[#6D6558] mb-1">
            Card Borders
          </label>
          <div className="grid grid-cols-4 gap-1.5">
            {(['none', 'thin', 'thick', 'dotted'] as const).map((border) => (
              <button
                key={border}
                type="button"
                onClick={() =>
                  onChange({
                    layoutPreset: { ...layout, borderStyle: border },
                  })
                }
                className={`py-1.5 text-xs font-medium rounded border capitalize transition-all ${
                  layout.borderStyle === border
                    ? 'border-[#934638] bg-[#FAF4EB] text-[#794a32]'
                    : 'border-[rgba(39,38,32,0.15)] bg-white text-[#6D6558] hover:bg-black/[0.02]'
                }`}
              >
                {border}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
