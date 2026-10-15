'use client';

import { ENVELOPE_SHAPES, ENVELOPE_THEMES, LETTER_FORMATS } from './themes';
import type { CSSProperties } from 'react';
import type { EnvelopeShape, EnvelopeTheme, LetterFormat } from './types';

type Props = {
  theme: EnvelopeTheme;
  shape: EnvelopeShape;
  letterFormat: LetterFormat;
  onThemeChange: (value: EnvelopeTheme) => void;
  onShapeChange: (value: EnvelopeShape) => void;
  onLetterFormatChange: (value: LetterFormat) => void;
  className?: string;
};

/** A small design-studio picker for hosts; it is not rendered on the guest invite itself. */
export function EnvelopeStylePicker({ theme, shape, letterFormat, onThemeChange, onShapeChange, onLetterFormatChange, className }: Props) {
  return (
    <div className={`ke-style-picker ${className ?? ''}`}>
      <fieldset className="ke-style-picker__fieldset">
        <legend>Choose a visual world</legend>
        <div className="ke-style-picker__themes">
          {Object.entries(ENVELOPE_THEMES).map(([id, config]) => {
            const key = id as EnvelopeTheme;
            return (
              <button key={key} type="button" className={`ke-style-picker__theme ${theme === key ? 'is-selected' : ''}`} onClick={() => onThemeChange(key)} aria-pressed={theme === key}>
                <span className="ke-style-picker__swatch" style={{ '--swatch': config.envelope, '--swatch-dark': config.envelopeDark, '--swatch-accent': config.accent } as CSSProperties} aria-hidden="true"><i /><b /></span>
                <span className="ke-style-picker__name">{config.label}</span>
                <span className="ke-style-picker__description">{config.description}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="ke-style-picker__fieldset">
        <legend>Envelope construction</legend>
        <div className="ke-style-picker__options">
          {ENVELOPE_SHAPES.map((option) => (
            <button key={option.id} type="button" className={`ke-style-picker__option ke-shape-preview--${option.id} ${shape === option.id ? 'is-selected' : ''}`} onClick={() => onShapeChange(option.id)} aria-pressed={shape === option.id}>
              <span className="ke-shape-preview" aria-hidden="true"><i /><b /></span>
              <span className="ke-style-picker__name">{option.label}</span>
              <span className="ke-style-picker__description">{option.description}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="ke-style-picker__fieldset">
        <legend>Letter treatment</legend>
        <div className="ke-style-picker__options ke-style-picker__options--letters">
          {LETTER_FORMATS.map((option) => (
            <button key={option.id} type="button" className={`ke-style-picker__option ke-letter-preview--${option.id} ${letterFormat === option.id ? 'is-selected' : ''}`} onClick={() => onLetterFormatChange(option.id)} aria-pressed={letterFormat === option.id}>
              <span className="ke-letter-preview" aria-hidden="true"><i /><b /><em /></span>
              <span className="ke-style-picker__name">{option.label}</span>
              <span className="ke-style-picker__description">{option.description}</span>
            </button>
          ))}
        </div>
      </fieldset>
    </div>
  );
}

export default EnvelopeStylePicker;
