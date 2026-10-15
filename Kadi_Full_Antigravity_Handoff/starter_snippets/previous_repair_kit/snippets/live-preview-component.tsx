'use client';

import React, { useMemo } from 'react';
import type { EventDesignEntity, EventEntity } from '@/lib/db/types';
import { InvitationSectionsRenderer } from '@/components/invitations/InvitationSectionsRenderer';
import { getDefaultInvitationSections } from '@/lib/events/default-invitation-sections';
import type { TemplateDefinition } from '@/lib/templates/types';
import { EnvelopeRenderer } from '@/components/animation/EnvelopeRenderer';
import { InvitationThemeScope } from '@/components/invitations/InvitationThemeScope';

export type DraftInvitationValues = {
  title: string;
  hosts: string;
  celebrants: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  heroImage: string;
  rsvpDeadline?: string;
  dressCode?: string;
};

interface DraftInvitationPreviewProps {
  template: TemplateDefinition;
  values: DraftInvitationValues;
  design: Partial<EventDesignEntity>;
  guestName: string;
  restartKey: number;
}

/**
 * Uses the production EnvelopeRenderer for the editor preview. This deliberately
 * avoids drawing a separate poster mockup, so edits use the same envelope and
 * animation implementation as a published guest invitation.
 */
export function DraftInvitationPreview({
  template,
  values,
  design,
  guestName,
  restartKey,
}: DraftInvitationPreviewProps) {
  const previewTemplate = useMemo<TemplateDefinition>(() => ({
    ...template,
    palette: {
      ...template.palette,
      primary: design.palette?.primary || template.palette.primary,
      secondary: design.palette?.secondary || template.palette.secondary,
      accent: design.palette?.accent || template.palette.accent,
      envelope: design.palette?.envelope || template.palette.envelope,
      flap: design.palette?.flap || template.palette.flap,
      cardBackground: design.palette?.cardBackground || template.palette.cardBackground,
    },
    liner: {
      ...template.liner,
      id: (design.linerId || template.liner.id) as TemplateDefinition['liner']['id'],
      name: design.linerId || template.liner.name,
      className: `bg-liner-${design.linerId || template.liner.id}`,
    },
    seal: {
      ...template.seal,
      monogram: design.sealMonogram || template.seal.monogram,
      color: design.sealColor || template.seal.color,
      shape: (design.sealShape || template.seal.shape) as TemplateDefinition['seal']['shape'],
    },
    sampleData: {
      ...template.sampleData,
      title: values.title,
      hosts: values.hosts,
      celebrants: values.celebrants,
      date: values.date,
      time: values.time,
      venue: values.venue,
      city: values.city,
      heroImage: values.heroImage || template.sampleData.heroImage,
    },
  }), [template, values, design]);

  const isMemorial = template.category === 'memorial' || template.category === 'funeral';
  const isBirthday = template.category === 'birthday';
  const previewEvent = useMemo<EventEntity>(() => {
    const story = template.sampleData.story || template.sampleData.subtitle || '';
    const galleryImages = template.sampleData.galleryImages?.length
      ? template.sampleData.galleryImages
      : values.heroImage ? [values.heroImage] : [];
    return {
      id: 'kadi-draft-preview',
      hostId: 'kadi-preview-host',
      title: values.title,
      subtitle: template.sampleData.subtitle || '',
      slug: 'kadi-draft-preview',
      category: template.category,
      status: 'draft',
      templateId: template.id,
      templateVersion: template.version,
      hosts: values.hosts,
      celebrants: values.celebrants,
      date: values.date,
      time: values.time,
      timezone: 'Africa/Nairobi',
      venue: values.venue,
      city: values.city,
      dressCode: values.dressCode,
      story,
      heroImage: values.heroImage || template.sampleData.heroImage,
      galleryImages,
      rsvpDeadline: values.rsvpDeadline || 'Not set',
      ourStoryMilestones: story ? [{ yearOrDate: 'A note from the hosts', title: 'The story so far', story }] : undefined,
      programmeSchedule: [{
        time: values.time || 'Time to be confirmed',
        title: isBirthday ? 'Gather and celebrate' : isMemorial ? 'Service and gathering' : template.category === 'graduation' ? 'Ceremony and celebration' : template.category === 'housewarming' ? 'Welcome to the new home' : 'Event begins',
        description: template.sampleData.subtitle || 'Event details will appear here as you customize the invitation.',
        location: values.venue,
      }],
      faqItems: [
        { question: 'Where is the event?', answer: [values.venue, values.city].filter(Boolean).join(', ') || 'Venue details to be confirmed.' },
        { question: 'When should I arrive?', answer: `The event is scheduled for ${values.date || 'the date shown on this invitation'} at ${values.time || 'the listed time'}.` },
      ],
      birthdayAbout: isBirthday ? { heading: `About ${values.celebrants || 'the celebrant'}`, bio: story } : undefined,
      memorialObituary: isMemorial ? { biography: story || `Details about ${values.celebrants || 'the person being remembered'} will be added by the host.` } : undefined,
      memorialServices: isMemorial ? [{ name: 'Service', date: values.date, time: values.time, venue: values.venue, type: 'service' as const }] : undefined,
      createdAt: '',
      updatedAt: '',
    };
  }, [template, values, isBirthday, isMemorial]);

  const previewSectionKeys = getDefaultInvitationSections(template.category);

  return (
    <InvitationThemeScope template={previewTemplate} className="kadi-draft-preview">
      <EnvelopeRenderer
        key={restartKey}
        template={previewTemplate}
        design={design}
        guestName={guestName}
        isDemo
      >
        <InvitationSectionsRenderer
          event={previewEvent}
          sectionKeys={previewSectionKeys}
          guestName={guestName}
          previewMode
        />
      </EnvelopeRenderer>
    </InvitationThemeScope>
  );
}
