'use client';

import React, { useMemo } from 'react';
import type { EventDesignEntity } from '@/lib/db/types';
import type { TemplateDefinition } from '@/lib/templates/types';
import { InvitationRenderer } from '@/components/invitations/InvitationRenderer';
import {
  buildDraftPreviewInvitationConfig,
  type DraftInvitationValues,
} from '@/lib/invitations/config';

export type { DraftInvitationValues };

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
    return buildDraftPreviewInvitationConfig(template, values, design, {
      guestName,
      // Start settled so the user instantly sees what they edited; replay button starts closed to play animation
      initialPhase: restartKey > 0 ? 'closed' : 'settled',
    });
  }, [template, values, design, guestName, restartKey]);

  return (
    <InvitationRenderer
      config={config}
      restartKey={restartKey}
      className="kadi-draft-preview w-full max-w-full overflow-x-hidden min-w-0"
    />
  );
}
