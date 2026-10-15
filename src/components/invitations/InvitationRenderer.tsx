'use client';

import React, { useMemo } from 'react';
import type { EventEntity, EventDesignEntity } from '@/lib/db/types';
import type { TemplateDefinition } from '@/lib/templates/types';
import { EnvelopeRenderer, type AnimationPhase } from '@/components/animation/EnvelopeRenderer';
import { InvitationSectionsRenderer } from '@/components/invitations/InvitationSectionsRenderer';
import { InvitationThemeScope } from '@/components/invitations/InvitationThemeScope';
import {
  type CanonicalInvitationConfig,
  type InvitationMode,
  buildPublishedInvitationConfig,
  buildTemplatePreviewInvitationConfig,
  resolveActiveSections,
} from '@/lib/invitations/config';

export interface InvitationRendererProps {
  /**
   * Pre-built canonical configuration object.
   * If provided, all other props are derived from this config.
   */
  config?: CanonicalInvitationConfig;

  // Decomposed convenience props (normalized into CanonicalInvitationConfig if config is not passed)
  event?: EventEntity;
  template?: TemplateDefinition;
  design?: Partial<EventDesignEntity>;
  mode?: InvitationMode;
  guestToken?: string;
  guestName?: string;
  allowedPlusOnes?: number;
  initialPhase?: AnimationPhase;
  sectionKeys?: string[];
  audioUrl?: string;
  className?: string;
  restartKey?: number | string;
  onPhaseChange?: (phase: AnimationPhase) => void;
}

/**
 * The Single Authoritative Invitation Renderer for the entire Kadi platform.
 * Drives:
 * - Public guest pages (/e/[slug])
 * - Live studio draft preview (DraftInvitationPreview)
 * - Template preview (/templates/[templateId])
 * - Private review links
 *
 * Guarantees 100% visual, architectural, and behavioral parity across every surface.
 * Side effects (such as RSVP submissions and payment collection) are strictly disabled
 * when mode !== 'published'.
 */
export function InvitationRenderer({
  config: providedConfig,
  event: propEvent,
  template: propTemplate,
  design: propDesign,
  mode: propMode = 'published',
  guestToken: propGuestToken,
  guestName: propGuestName,
  allowedPlusOnes: propAllowedPlusOnes,
  initialPhase: propInitialPhase,
  sectionKeys: propSectionKeys,
  audioUrl: propAudioUrl,
  className = '',
  restartKey,
  onPhaseChange,
}: InvitationRendererProps) {
  // Normalize configuration
  const config = useMemo<CanonicalInvitationConfig>(() => {
    if (providedConfig) return providedConfig;

    if (propEvent && propTemplate) {
      if (propMode === 'published') {
        return buildPublishedInvitationConfig(propEvent, propTemplate, {
          design: propDesign,
          guestToken: propGuestToken,
          initialPhase: propInitialPhase,
        });
      }
      const activeSections =
        propSectionKeys ||
        resolveActiveSections(propEvent.category, propDesign);

      return {
        version: '1.0.0',
        mode: propMode,
        event: propEvent,
        template: propTemplate,
        design: propDesign,
        sectionOrder: activeSections,
        visibleSections: propDesign?.visibleSections || activeSections,
        guestToken: propGuestToken,
        guestName: propGuestName,
        allowedPlusOnes: propAllowedPlusOnes ?? 1,
        initialPhase: propInitialPhase,
        isReadOnly: true,
      };
    }

    if (propTemplate) {
      return buildTemplatePreviewInvitationConfig(propTemplate, {
        guestName: propGuestName,
        initialPhase: propInitialPhase,
      });
    }

    throw new Error(
      '[Kadi InvitationRenderer] Either "config" or ("template" and "event") props must be provided.'
    );
  }, [
    providedConfig,
    propEvent,
    propTemplate,
    propDesign,
    propMode,
    propGuestToken,
    propGuestName,
    propAllowedPlusOnes,
    propInitialPhase,
    propSectionKeys,
  ]);

  // Construct reactive template with custom design overrides
  const resolvedTemplate = useMemo<TemplateDefinition>(() => {
    const base = config.template;
    const customPalette = config.design?.palette;

    return {
      ...base,
      palette: {
        ...base.palette,
        primary: customPalette?.primary || base.palette.primary,
        secondary: customPalette?.secondary || base.palette.secondary,
        accent: customPalette?.accent || base.palette.accent,
        envelope: customPalette?.envelope || base.palette.envelope,
        flap: customPalette?.flap || base.palette.flap,
        cardBackground: customPalette?.cardBackground || base.palette.cardBackground,
      },
      liner: {
        ...base.liner,
        id: (config.design?.linerId || base.liner.id) as any,
        name: config.design?.linerId || base.liner.name,
        className: `bg-liner-${config.design?.linerId || base.liner.id}`,
      },
      seal: {
        ...base.seal,
        monogram: config.design?.sealMonogram || base.seal.monogram,
        color: config.design?.sealColor || base.seal.color,
        shape: (config.design?.sealShape || base.seal.shape) as any,
      },
      sampleData: {
        ...base.sampleData,
        title: config.event.title || base.sampleData.title,
        subtitle: config.event.subtitle || base.sampleData.subtitle,
        hosts: config.event.hosts || base.sampleData.hosts,
        celebrants: config.event.celebrants || base.sampleData.celebrants,
        date: config.event.date || base.sampleData.date,
        time: config.event.time || base.sampleData.time,
        venue: config.event.venue || base.sampleData.venue,
        city: config.event.city || base.sampleData.city,
        heroImage: config.event.heroImage || base.sampleData.heroImage,
        galleryImages:
          config.event.galleryImages?.length
            ? config.event.galleryImages
            : base.sampleData.galleryImages || [],
        milestoneAge: config.event.milestoneAge ?? base.sampleData.milestoneAge,
        story: config.event.story || base.sampleData.story,
      },
    };
  }, [config.template, config.design, config.event]);

  const isDemo = config.mode !== 'published';
  const effectiveAudioUrl = propAudioUrl || config.event.audioUrl;
  const fontStyle = config.design?.fontFamily ? { fontFamily: config.design.fontFamily } : undefined;

  return (
    <InvitationThemeScope
      template={resolvedTemplate}
      design={config.design}
      className={`kadi-invitation-container ${className}`.trim()}
      style={fontStyle}
    >
      <EnvelopeRenderer
        key={restartKey ? String(restartKey) : undefined}
        template={resolvedTemplate}
        guestName={config.guestName}
        audioUrl={effectiveAudioUrl}
        isDemo={isDemo}
        design={config.design}
        initialPhase={config.initialPhase}
        onPhaseChange={onPhaseChange}
      >
        <InvitationSectionsRenderer
          event={config.event}
          blocks={config.blocks}
          sectionKeys={config.sectionOrder}
          guestToken={config.guestToken}
          guestName={config.guestName}
          previewMode={isDemo}
        />
      </EnvelopeRenderer>
    </InvitationThemeScope>
  );
}
