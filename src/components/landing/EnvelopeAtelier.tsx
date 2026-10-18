'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, MoveUpRight } from 'lucide-react';
import { EnvelopeRenderer } from '@/components/animation/EnvelopeRenderer';
import { TEMPLATES } from '@/lib/templates/catalogue';
import { getTemplateCanvasElements } from '@/lib/templates/canvas-defaults';
import type { TemplateDefinition } from '@/lib/templates/types';
import type { DraftInvitationValues } from '@/lib/invitations/config';
import type { EventDesignEntity } from '@/lib/db/types';

const ENVELOPE_OPTIONS = [
  { templateId: 'savannah-twilight', index: '01', mood: 'THE HEIRLOOM', material: 'Oxblood · champagne foil' },
  { templateId: 'sage-love-letter', index: '02', mood: 'THE BOTANICAL', material: 'Sage linen · rose wax' },
  { templateId: 'ruby-disco-birthday', index: '03', mood: 'THE CELEBRATION', material: 'Ruby paper · gilt liner' },
  { templateId: 'summit-of-honor', index: '04', mood: 'THE EDITION', material: 'Midnight ink · brass' },
  { templateId: 'everlasting-peace', index: '05', mood: 'THE REMEMBRANCE', material: 'Olive paper · quiet detail' },
] as const;

const FEATURED_ENVELOPES = ENVELOPE_OPTIONS.flatMap((option) => {
  const template = TEMPLATES.find((item) => item.id === option.templateId);
  return template ? [{ ...option, template }] : [];
});

type FeaturedEnvelope = (typeof FEATURED_ENVELOPES)[number];

function specimenStyle(template: TemplateDefinition): React.CSSProperties {
  return {
    '--specimen-envelope': template.palette.envelope,
    '--specimen-flap': template.palette.flap,
    '--specimen-paper': template.palette.cardBackground,
    '--specimen-ink': template.palette.text,
    '--specimen-accent': template.palette.secondary,
    '--specimen-seal': template.seal.color,
  } as React.CSSProperties;
}

function EnvelopeSpecimen({ specimen, selected, onSelect }: {
  specimen: FeaturedEnvelope;
  selected: boolean;
  onSelect: () => void;
}) {
  const monogram = specimen.template.seal.monogram || 'K';

  return (
    <button
      type="button"
      className={`ka-specimen ${selected ? 'is-selected' : ''}`}
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={`Preview ${specimen.template.name} envelope, liner and letter`}
      style={specimenStyle(specimen.template)}
    >
      <span className="ka-specimen__visual" aria-hidden="true">
        <span className="ka-specimen__letter">
          <span className="ka-specimen__letter-mark">{monogram}</span>
          <span className="ka-specimen__letter-rule" />
          <span className="ka-specimen__letter-title">{specimen.template.sampleData.celebrants}</span>
          <span className="ka-specimen__letter-lines"><i /><i /><i /></span>
        </span>
        <span className="ka-specimen__envelope">
          <span className="ka-specimen__shell" />
          <span className="ka-specimen__liner" />
          <span className="ka-specimen__fold ka-specimen__fold--left" />
          <span className="ka-specimen__fold ka-specimen__fold--right" />
          <span className="ka-specimen__fold ka-specimen__fold--bottom" />
          <span className="ka-specimen__flap"><span className="ka-specimen__flap-rule" /></span>
          <span className={`ka-specimen__seal ka-specimen__seal--${specimen.template.seal.shape}`}><span>{monogram}</span></span>
        </span>
        <span className="ka-specimen__ground-shadow" />
      </span>
      <span className="ka-specimen__meta">
        <span className="ka-specimen__index">{specimen.index}</span>
        <span className="ka-specimen__copy">
          <span className="ka-specimen__mood">{specimen.mood}</span>
          <span className="ka-specimen__material">{specimen.material}</span>
        </span>
        <span className="ka-specimen__state" aria-hidden="true">
          {selected ? <Check size={14} strokeWidth={1.6} /> : <MoveUpRight size={14} strokeWidth={1.5} />}
        </span>
      </span>
    </button>
  );
}

/** Landing-page collection built from Kadi's real envelope renderer and portrait-canvas defaults. */
export function EnvelopeAtelier() {
  const [activeTemplateId, setActiveTemplateId] = useState<string>(
    FEATURED_ENVELOPES[0]?.template.id || TEMPLATES[0].id
  );
  const activeSpecimen = FEATURED_ENVELOPES.find((item) => item.template.id === activeTemplateId) || FEATURED_ENVELOPES[0];
  const template = activeSpecimen?.template || TEMPLATES[0];

  const values = useMemo<DraftInvitationValues>(() => ({
    title: template.sampleData.title,
    hosts: template.sampleData.hosts,
    celebrants: template.sampleData.celebrants,
    date: template.sampleData.date,
    time: template.sampleData.time,
    timezone: 'Africa/Nairobi',
    venue: template.sampleData.venue,
    city: template.sampleData.city,
    heroImage: template.sampleData.heroImage,
    galleryImages: template.sampleData.galleryImages || [],
    story: template.sampleData.story || '',
  }), [template]);

  const design = useMemo<Partial<EventDesignEntity>>(() => ({
    motionPreset: template.motionPreset,
    palette: {
      primary: template.palette.primary,
      secondary: template.palette.secondary,
      accent: template.palette.accent,
      envelope: template.palette.envelope,
      flap: template.palette.flap,
      cardBackground: template.palette.cardBackground,
      text: template.palette.text,
    },
    linerId: template.liner.id,
    sealShape: template.seal.shape === 'oval' ? 'circle' : template.seal.shape,
    sealMonogram: template.seal.monogram || 'K',
    sealColor: template.seal.color,
    visibleSections: template.supportedSections,
    canvasElements: getTemplateCanvasElements(template, values),
    envelopeStyle: 'classic-fold',
    letterStyle: 'printed-letter',
  }), [template, values]);

  if (!activeSpecimen) return null;

  return (
    <section className="ka-atelier" aria-labelledby="ka-atelier-title">
      <div className="ka-atelier__masthead">
        <div>
          <p className="ka-atelier__eyebrow"><span>02</span> The stationery atelier</p>
          <h2 id="ka-atelier-title">Before the letter, <em>the moment.</em></h2>
          <p className="ka-atelier__intro">
            The envelope is not a loading screen. It is the first piece of the invitation:
            the paper, the lining, the seal, and the note waiting inside.
          </p>
        </div>
        <p className="ka-atelier__side-note"><span>MADE TO BE OPENED</span>Choose a suite. Then press the seal.</p>
      </div>

      <div className="ka-atelier__workbench">
        <aside className="ka-atelier__selection" aria-label="Choose an envelope style">
          <div className="ka-atelier__selection-heading">
            <span>THE ENVELOPE COLLECTION</span>
            <span>{String(FEATURED_ENVELOPES.length).padStart(2, '0')} SUITES</span>
          </div>
          <div className="ka-atelier__specimens">
            {FEATURED_ENVELOPES.map((specimen) => (
              <EnvelopeSpecimen
                key={specimen.template.id}
                specimen={specimen}
                selected={specimen.template.id === template.id}
                onSelect={() => setActiveTemplateId(specimen.template.id)}
              />
            ))}
          </div>
          <div className="ka-atelier__selected-note">
            <span className="ka-atelier__selected-name">{template.name}</span>
            <span className="ka-atelier__selected-detail">{template.liner.name} <span aria-hidden="true">·</span> {template.seal.shape} wax seal</span>
          </div>
          <Link href={`/app/events/new?templateId=${encodeURIComponent(template.id)}`} className="ka-atelier__make-link">
            Create with this stationery <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
          </Link>
          <Link href="/templates" className="ka-atelier__all-link">Browse the full invitation collection</Link>
        </aside>

        <div className="ka-atelier__preview" aria-label="Live envelope and invitation preview">
          <div className="ka-atelier__preview-topline"><span>LIVE OPENING</span><span>ENVELOPE / LINER / LETTER</span></div>
          <EnvelopeRenderer
            key={template.id}
            template={template}
            design={design}
            guestName="Hon. & Mrs. Anyango"
            isDemo
            initialPhase="closed"
          />
        </div>
      </div>
    </section>
  );
}

export default EnvelopeAtelier;
