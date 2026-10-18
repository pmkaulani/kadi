'use client';

import React, { useMemo, useState, type CSSProperties } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, MoveUpRight } from 'lucide-react';
import { EnvelopeRenderer } from '@/components/animation/EnvelopeRenderer';
import { TEMPLATES } from '@/lib/templates/catalogue';
import { getTemplateCanvasElements } from '@/lib/templates/canvas-defaults';
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

function suiteStyle(template: FeaturedEnvelope['template']): CSSProperties {
  return {
    '--suite-envelope': template.palette.envelope,
    '--suite-liner': template.palette.secondary,
    '--suite-seal': template.seal.color,
  } as CSSProperties;
}

function SuiteOption({
  specimen,
  selected,
  onSelect,
}: {
  specimen: FeaturedEnvelope;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      className={'ka-suite-option' + (selected ? ' is-selected' : '')}
      onClick={onSelect}
      aria-pressed={selected}
      aria-label={'Preview ' + specimen.template.name + ' stationery'}
      style={suiteStyle(specimen.template)}
    >
      <span className="ka-suite-option__index">{specimen.index}</span>
      <span className="ka-suite-option__palette" aria-hidden="true"><i /><i /><i /></span>
      <span className="ka-suite-option__copy">
        <span className="ka-suite-option__mood">{specimen.mood}</span>
        <span className="ka-suite-option__name">{specimen.template.name}</span>
        <span className="ka-suite-option__material">{specimen.material}</span>
      </span>
      <span className="ka-suite-option__state" aria-hidden="true">
        {selected ? <Check size={15} strokeWidth={1.6} /> : <MoveUpRight size={14} strokeWidth={1.4} />}
      </span>
    </button>
  );
}

/**
 * Editorial envelope showcase.
 * The actual guest-facing renderer remains the hero; suite choices are typography and
 * material swatches, not simplified CSS drawings pretending to be invitation artwork.
 */
export function EnvelopeAtelier() {
  const [activeTemplateId, setActiveTemplateId] = useState<string>(
    FEATURED_ENVELOPES[0]?.template.id || TEMPLATES[0].id
  );
  const activeSpecimen =
    FEATURED_ENVELOPES.find((item) => item.template.id === activeTemplateId) || FEATURED_ENVELOPES[0];
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
          <p className="ka-atelier__eyebrow"><span>02</span> A little ceremony</p>
          <h2 id="ka-atelier-title">The envelope sets <em>the tone.</em></h2>
          <p className="ka-atelier__intro">
            Paper, lining, seal, and the invitation waiting inside—composed as one thoughtful reveal.
            Choose a suite, then open the seal in the live preview.
          </p>
        </div>
        <p className="ka-atelier__side-note">
          <span>MADE TO BE OPENED</span>
          Every detail sets the mood before the first word is read.
        </p>
      </div>

      <div className="ka-atelier__workbench">
        <aside className="ka-atelier__selection" aria-label="Choose a stationery suite">
          <div className="ka-atelier__selection-heading">
            <span>CHOOSE A SUITE</span>
            <span>{String(FEATURED_ENVELOPES.length).padStart(2, '0')} EDITIONS</span>
          </div>
          <div className="ka-suite-list">
            {FEATURED_ENVELOPES.map((specimen) => (
              <SuiteOption
                key={specimen.template.id}
                specimen={specimen}
                selected={specimen.template.id === template.id}
                onSelect={() => setActiveTemplateId(specimen.template.id)}
              />
            ))}
          </div>
          <Link
            href={'/app/events/new?templateId=' + encodeURIComponent(template.id)}
            className="ka-atelier__make-link"
          >
            Create with this stationery <ArrowUpRight size={16} strokeWidth={1.6} aria-hidden="true" />
          </Link>
          <Link href="/templates" className="ka-atelier__all-link">Explore all invitations</Link>
        </aside>

        <div className="ka-atelier__preview" aria-label="Live envelope and invitation preview">
          <div className="ka-atelier__preview-topline">
            <span>LIVE OPENING</span><span>ENVELOPE / LINER / LETTER</span>
          </div>
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
