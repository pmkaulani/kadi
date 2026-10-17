'use client';

import React, { useMemo } from 'react';
import type { EventDesignEntity } from '@/lib/db/types';
import type { TemplateDefinition } from '@/lib/templates/types';
import { InvitationRenderer } from '@/components/invitations/InvitationRenderer';
import { buildDraftPreviewInvitationConfig } from '@/lib/invitations/config';

export interface DraftInvitationValues {
  title: string;
  hosts: string;
  celebrants: string;
  date: string;
  time: string;
  timezone?: string;
  venue: string;
  city: string;
  heroImage: string;
  galleryImages?: string[];
  rsvpDeadline?: string;
  dressCode?: string;
  story?: string;
  countdownLabel?: string;
  imageCropFocalPosition?: string;
  audioUrl?: string;
  mpesaType?: 'till' | 'paybill' | 'send_money';
  mpesaNumber?: string;
  mpesaRecipient?: string;
  mpesaReference?: string;
  // Section text overrides for direct in-place editing across the stationery
  registryHeading?: string;
  registryTitle?: string;
  registryMessage?: string;
  registryAccountLabel?: string;
  ceremonyHeading?: string;
  ceremonyTitle?: string;
  ceremonyTime?: string;
  receptionTitle?: string;
  receptionTime?: string;
  receptionLocation?: string;
  venueHeading?: string;
  venueNote?: string;
  storyHeading?: string;
  storyTitle?: string;
  galleryHeading?: string;
  galleryTitle?: string;
  rsvpHeading?: string;
  rsvpTitle?: string;
  rsvpSubtitle?: string;
  faqHeading?: string;
  faqTitle?: string;
  closingHeading?: string;
  closingTitle?: string;
  closingMessage?: string;
}

export interface DraftInvitationPreviewProps {
  template: TemplateDefinition;
  values: DraftInvitationValues;
  design: Partial<EventDesignEntity>;
  guestName: string;
  restartKey: number;
}

/**
 * Live Draft Invitation Preview for Kadi Studio.
 * Directly consumes the single canonical InvitationRenderer component with mode='draft-preview'.
 * In preview mode, RSVP submissions and payment collection are completely inert and simulated.
 */
export function DraftInvitationPreview({
  template,
  values,
  design,
  guestName,
  restartKey,
}: DraftInvitationPreviewProps) {
  const config = useMemo(() => {
    return buildDraftPreviewInvitationConfig(template, values, design, { guestName });
  }, [template, values, design, guestName]);

  return (
    <InvitationRenderer
      config={config}
      restartKey={restartKey}
      className="kadi-draft-preview w-full max-w-full overflow-x-hidden min-w-0"
    />
  );
}
