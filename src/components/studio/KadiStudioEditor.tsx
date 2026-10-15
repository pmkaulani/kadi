'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  RotateCcw,
  Smartphone,
  Monitor,
  Copy,
  Check,
  AlertCircle,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Palette,
  Mail,
  Music,
  Layout,
  HelpCircle,
  ExternalLink,
  Sliders,
  Settings,
  ShieldCheck,
  Info,
  Calendar,
  Clock,
  MapPin,
  Image as ImageIcon,
  Heart,
  Share2,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { EventEntity, EventDesignEntity } from '@/lib/db/types';
import type { TemplateDefinition } from '@/lib/templates/types';
import { TEMPLATES } from '@/lib/templates/catalogue';
import {
  getDefaultInvitationSections,
  getAvailableSectionsForCategory,
  SECTION_METADATA,
  type InvitationSectionKey,
} from '@/lib/events/default-invitation-sections';
import {
  DraftInvitationPreview,
  type DraftInvitationValues,
} from '@/components/invitations/DraftInvitationPreview';
import { useInvitationDraft, type SaveStatus } from '@/hooks/useInvitationDraft';
import { Button } from '@/components/ui/Button';
import { ContentBlockBuilder } from '@/components/studio/ContentBlockBuilder';
import { TypographyPaletteControls } from '@/components/studio/TypographyPaletteControls';
import { migrateEventToBlocks } from '@/lib/blocks/registry';
import type { InvitationBlockConfig } from '@/lib/blocks/types';

export interface StudioDraft {
  values: DraftInvitationValues;
  design: Partial<EventDesignEntity>;
  category: string;
  templateId: string;
}

export type PreviewDevice = 'iphone' | 'android' | 'desktop';

export interface PreviewGuestOption {
  id: string;
  label: string;
}

export interface KadiStudioEditorProps {
  initialEvent?: Partial<EventEntity>;
  initialDesign?: Partial<EventDesignEntity>;
  template?: TemplateDefinition;
  availableTemplates?: TemplateDefinition[];
  guests?: PreviewGuestOption[];
  onSaveDraft: (draft: StudioDraft, revision: number) => Promise<void>;
  onPublish?: () => Promise<void>;
  onGeneratePrivatePreviewLink?: () => Promise<string>;
  publicSlug?: string;
}

const DEFAULT_GUESTS: PreviewGuestOption[] = [
  { id: 'kamau-household', label: 'Mr. & Mrs. Kamau' },
  { id: 'sarah-kamau', label: 'Sarah Kamau' },
  { id: 'david-mwangi', label: 'David Mwangi' },
  { id: 'wanjiku-family', label: 'Wanjiku Otieno & Family' },
  { id: 'peter-otieno', label: 'Dr. Peter Otieno & Family' },
];

const FONT_OPTIONS = [
  { value: 'Playfair Display', label: 'Playfair Display — Editorial & Regal' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond — Timeless Elegance' },
  { value: 'Inter', label: 'Inter — Clean & Modern' },
  { value: 'DM Sans', label: 'DM Sans — Warm Contemporary' },
];

const ENVELOPE_STYLES = [
  { value: 'classic-fold', label: 'Classic Diamond Flap' },
  { value: 'pocket-fold', label: 'Pocket Sleeve' },
  { value: 'scalloped-edge', label: 'Scalloped Edge Flap' },
  { value: 'minimal', label: 'Modern Square Flap' },
] as const;

const OPENING_MOTION_PRESETS = [
  { value: 'classic-wax-seal', label: 'Classic Wax Seal — Traditional & Regal' },
  { value: 'floral-bloom', label: 'Floral Bloom — Romantic Petals & Botanicals' },
  { value: 'confetti-burst', label: 'Confetti Burst — Joyous Sparkles & Glints' },
  { value: 'minimal-fade', label: 'Minimal Fade — Clean Architectural Folds' },
  { value: 'gold-foil', label: 'Gold Foil — Opulent Shimmer & Filigree' },
  { value: 'dignified-memorial', label: 'Dignified Memorial — Solemn Candlelight' },
] as const;

const LETTER_FORMATS = [
  { value: 'printed-letter', label: 'Single Flat Card' },
  { value: 'handwritten-letter', label: 'Deckle-edge Letter' },
  { value: 'folded-card', label: 'Folded Folio' },
] as const;

const LINER_OPTIONS = [
  { id: 'gold-foil', label: 'Gold Foil Shimmer' },
  { id: 'blush-floral', label: 'Blush Botanical' },
  { id: 'botanical', label: 'Savannah Acacia' },
  { id: 'geometric', label: 'Kitenge Geometric' },
  { id: 'none', label: 'Solid Paper' },
];

const SEAL_SHAPES = [
  { id: 'circle', label: 'Classic Round' },
  { id: 'diamond', label: 'Heritage Diamond' },
  { id: 'shield', label: 'Ceremonial Shield' },
] as const;

const MUSIC_PRESETS = [
  { label: 'None (Silent by default)', url: '' },
  {
    label: 'Acoustic Afro-Soul (Guitar & Strings)',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
  },
  {
    label: 'Soft Piano & Cello (Ceremonial)',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3',
  },
  {
    label: 'Ambient Garden Reverie',
    url: 'https://cdn.pixabay.com/download/audio/2021/08/09/audio_88447e769f.mp3',
  },
];

function buildInitialDraft(
  event?: Partial<EventEntity>,
  design?: Partial<EventDesignEntity>,
  template?: TemplateDefinition
): StudioDraft {
  const activeTemplate = template || TEMPLATES[0];
  const category = event?.category || activeTemplate.category;
  const defaultSections = getDefaultInvitationSections(category);

  const initialValues: DraftInvitationValues = {
    title: event?.title || activeTemplate.sampleData.title,
    hosts: event?.hosts || activeTemplate.sampleData.hosts,
    celebrants: event?.celebrants || activeTemplate.sampleData.celebrants,
    date: event?.date || activeTemplate.sampleData.date,
    time: event?.time || activeTemplate.sampleData.time,
    timezone: event?.timezone || 'Africa/Nairobi',
    venue: event?.venue || activeTemplate.sampleData.venue,
    city: event?.city || activeTemplate.sampleData.city,
    heroImage: event?.heroImage || activeTemplate.sampleData.heroImage,
    galleryImages: event?.galleryImages || activeTemplate.sampleData.galleryImages || [],
    rsvpDeadline: event?.rsvpDeadline || '1 December 2026',
    dressCode: event?.dressCode || 'Formal Traditional / Black Tie',
    story: event?.story || activeTemplate.sampleData.story,
    countdownLabel: event?.subtitle || 'Counting down with joy',
    audioUrl: event?.audioUrl || '',
    mpesaType: event?.mpesaType || 'till',
    mpesaNumber: event?.mpesaNumber || '8249102',
    mpesaRecipient: event?.mpesaRecipient || event?.celebrants || 'Kevin & Wanjiku',
    mpesaReference: event?.mpesaReference || event?.title || 'Wedding Gift',
  };

  const initialBlocks =
    design?.blocks ||
    event?.blocks ||
    migrateEventToBlocks(
      {
        id: event?.id || 'draft-init',
        title: initialValues.title,
        category,
        hosts: initialValues.hosts,
        celebrants: initialValues.celebrants,
        date: initialValues.date,
        time: initialValues.time,
        timezone: initialValues.timezone,
        venue: initialValues.venue,
        city: initialValues.city,
        heroImage: initialValues.heroImage,
        galleryImages: initialValues.galleryImages,
        rsvpDeadline: initialValues.rsvpDeadline,
        story: initialValues.story,
        audioUrl: initialValues.audioUrl,
        mpesaType: initialValues.mpesaType,
        mpesaNumber: initialValues.mpesaNumber,
        mpesaRecipient: initialValues.mpesaRecipient,
        mpesaReference: initialValues.mpesaReference,
        status: 'draft',
        slug: 'draft',
        templateId: activeTemplate.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as any,
      design
    );

  return {
    templateId: event?.templateId || activeTemplate.id,
    category,
    values: initialValues,
    design: {
      palette: {
        primary: design?.palette?.primary || activeTemplate.palette.primary,
        secondary: design?.palette?.secondary || activeTemplate.palette.secondary,
        accent: design?.palette?.accent || activeTemplate.palette.accent,
        envelope: design?.palette?.envelope || activeTemplate.palette.envelope,
        flap: design?.palette?.flap || activeTemplate.palette.flap,
        cardBackground: design?.palette?.cardBackground || activeTemplate.palette.cardBackground,
        text: design?.palette?.text || activeTemplate.palette.text || '#272620',
      },
      fontFamily: design?.fontFamily || (activeTemplate.fonts.heading === 'sans' ? 'Inter' : 'Playfair Display'),
      linerId: design?.linerId || activeTemplate.liner.id,
      sealShape: design?.sealShape || (activeTemplate.seal.shape === 'oval' ? 'circle' : (activeTemplate.seal.shape as any)) || 'circle',
      sealMonogram: design?.sealMonogram || activeTemplate.seal.monogram || 'K',
      sealColor: design?.sealColor || activeTemplate.seal.color,
      envelopeStyle: design?.envelopeStyle || 'classic-fold',
      letterStyle: design?.letterStyle || 'printed-letter',
      backgroundAnimation: design?.backgroundAnimation || 'none',
      scrollAnimation: design?.scrollAnimation || 'fade-up',
      transitionSpeed: design?.transitionSpeed || 'medium',
      layoutSpacing: design?.layoutSpacing || 'comfortable',
      cardPadding: design?.cardPadding || 'normal',
      visibleSections: design?.visibleSections || defaultSections,
      sectionOrder: design?.sectionOrder || defaultSections,
      countdownLabel: design?.countdownLabel || 'Counting down with joy',
      blocks: initialBlocks,
      typography: design?.typography || {
        headingFont: design?.fontFamily || (activeTemplate.fonts.heading === 'sans' ? 'Inter' : 'Playfair Display'),
        bodyFont: 'Inter',
        scale: 1,
        headingLetterSpacing: 0,
        bodyLineHeight: 1.6,
      },
      layoutPreset: design?.layoutPreset || {
        spacing: design?.layoutSpacing || 'comfortable',
        cornerStyle: 'soft',
        borderStyle: 'none',
      },
    },
  };
}

export function KadiStudioEditor({
  initialEvent,
  initialDesign,
  template,
  availableTemplates = TEMPLATES,
  guests = DEFAULT_GUESTS,
  onSaveDraft,
  onPublish,
  onGeneratePrivatePreviewLink,
  publicSlug,
}: KadiStudioEditorProps) {
  const fallbackTemplate = template || availableTemplates[0];
  const initialDraftState = useMemo(
    () => buildInitialDraft(initialEvent, initialDesign, fallbackTemplate),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  // Hook handles debounced persistence, queuing, and save states
  const {
    draft,
    revision,
    update,
    setDraftDirect,
    saveStatus,
    saveError,
    retrySave,
    flushSave,
  } = useInvitationDraft<StudioDraft>(
    initialDraftState,
    async (val, rev) => {
      await onSaveDraft(val, rev);
    },
    300
  );

  // Active template resolved from draft
  const activeTemplate = useMemo(() => {
    return (
      availableTemplates.find((t) => t.id === draft.templateId) ||
      template ||
      availableTemplates[0]
    );
  }, [availableTemplates, draft.templateId, template]);

  // Studio UI state
  const [device, setDevice] = useState<PreviewDevice>('iphone');
  const [guestId, setGuestId] = useState<string>(guests[0]?.id || 'kamau-household');
  const [replayKey, setReplayKey] = useState<number>(0);
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const [activeAccordion, setActiveAccordion] = useState<string>('details');
  const [notice, setNotice] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [templateSwitchConfirm, setTemplateSwitchConfirm] = useState<string | null>(null);

  const selectedGuest = guests.find((g) => g.id === guestId) || guests[0];
  const guestSalutation = selectedGuest?.label || 'Distinguished Guest';

  // Updaters for single draft model
  const patchValues = useCallback(
    <K extends keyof DraftInvitationValues>(key: K, value: DraftInvitationValues[K]) => {
      update((prev) => ({
        ...prev,
        values: {
          ...prev.values,
          [key]: value,
        },
      }));
    },
    [update]
  );

  const patchDesign = useCallback(
    (patch: Partial<EventDesignEntity>) => {
      update((prev) => ({
        ...prev,
        design: {
          ...prev.design,
          ...patch,
        },
      }));
    },
    [update]
  );

  const patchPalette = useCallback(
    (key: keyof EventDesignEntity['palette'], value: string) => {
      update((prev) => ({
        ...prev,
        design: {
          ...prev.design,
          palette: {
            ...prev.design.palette!,
            [key]: value,
          },
        },
      }));
    },
    [update]
  );

  const activeBlocks = useMemo(() => {
    return draft.design.blocks || [];
  }, [draft.design.blocks]);

  const handleBlocksChange = useCallback(
    (newBlocks: InvitationBlockConfig[]) => {
      patchDesign({ blocks: newBlocks });
    },
    [patchDesign]
  );

  // Section visibility and reordering logic
  const toggleSection = (sectionKey: string, isChecked: boolean) => {
    const currentVisible = draft.design.visibleSections || getDefaultInvitationSections(draft.category);
    const nextVisible = isChecked
      ? Array.from(new Set([...currentVisible, sectionKey]))
      : currentVisible.filter((k) => k !== sectionKey);

    const currentOrder = draft.design.sectionOrder || getDefaultInvitationSections(draft.category);
    let nextOrder = currentOrder.filter((k) => nextVisible.includes(k));
    if (isChecked && !nextOrder.includes(sectionKey)) {
      nextOrder.push(sectionKey);
    }

    patchDesign({
      visibleSections: nextVisible,
      sectionOrder: nextOrder,
    });
  };

  const moveSection = (sectionKey: string, direction: -1 | 1) => {
    const currentOrder = [
      ...(draft.design.sectionOrder || getDefaultInvitationSections(draft.category)),
    ];
    const currentIndex = currentOrder.indexOf(sectionKey);
    if (currentIndex < 0) return;

    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= currentOrder.length) return;

    const temp = currentOrder[currentIndex];
    currentOrder[currentIndex] = currentOrder[targetIndex];
    currentOrder[targetIndex] = temp;

    patchDesign({ sectionOrder: currentOrder });
  };

  // Safe template switching: prompts to preserve or reset authored values
  const handleTemplateSelect = (newTemplateId: string) => {
    const nextTemplate = availableTemplates.find((t) => t.id === newTemplateId);
    if (!nextTemplate) return;

    // Check if authored details differ from default
    const hasCustomTitle = draft.values.title !== activeTemplate.sampleData.title;
    if (hasCustomTitle) {
      setTemplateSwitchConfirm(newTemplateId);
    } else {
      applyTemplateSwitch(nextTemplate, false);
    }
  };

  const applyTemplateSwitch = (nextTemplate: TemplateDefinition, preserveDetails = true) => {
    setDraftDirect({
      templateId: nextTemplate.id,
      category: nextTemplate.category,
      values: preserveDetails
        ? {
            ...draft.values,
            heroImage: nextTemplate.sampleData.heroImage,
          }
        : {
            ...draft.values,
            title: nextTemplate.sampleData.title,
            hosts: nextTemplate.sampleData.hosts,
            celebrants: nextTemplate.sampleData.celebrants,
            date: nextTemplate.sampleData.date,
            time: nextTemplate.sampleData.time,
            venue: nextTemplate.sampleData.venue,
            city: nextTemplate.sampleData.city,
            heroImage: nextTemplate.sampleData.heroImage,
            story: nextTemplate.sampleData.story,
          },
      design: {
        ...draft.design,
        palette: { ...nextTemplate.palette },
        linerId: nextTemplate.liner.id,
        sealColor: nextTemplate.seal.color,
        sealMonogram: nextTemplate.seal.monogram || draft.design.sealMonogram || 'K',
        sealShape: (nextTemplate.seal.shape === 'oval' ? 'circle' : (nextTemplate.seal.shape as any)) || 'circle',
        visibleSections: getDefaultInvitationSections(nextTemplate.category),
        sectionOrder: getDefaultInvitationSections(nextTemplate.category),
      },
    });
    setTemplateSwitchConfirm(null);
    setReplayKey((k) => k + 1);
  };

  // Share preview link handler
  const handleSharePreview = async () => {
    if (onGeneratePrivatePreviewLink) {
      try {
        const link = await onGeneratePrivatePreviewLink();
        await navigator.clipboard.writeText(link);
        setNotice('Private preview link copied to clipboard.');
      } catch (e) {
        setNotice('Failed to generate preview link. Please retry.');
      }
    } else if (publicSlug) {
      const origin = typeof window !== 'undefined' ? window.location.origin : '';
      const link = `${origin}/e/${publicSlug}?tok=preview-sample`;
      await navigator.clipboard.writeText(link);
      setNotice('Guest preview link copied to clipboard.');
    } else {
      setNotice('Private token links require saving the draft first.');
    }
    setTimeout(() => setNotice(''), 3500);
  };

  const handlePublishClick = async () => {
    if (!onPublish) return;
    setIsPublishing(true);
    try {
      await flushSave();
      await onPublish();
    } catch (e: any) {
      alert(e?.message || 'Could not publish invitation.');
    } finally {
      setIsPublishing(false);
    }
  };

  const availableSections = getAvailableSectionsForCategory(draft.category);
  const visibleSections = draft.design.visibleSections || getDefaultInvitationSections(draft.category);
  const orderedSections = (draft.design.sectionOrder || getDefaultInvitationSections(draft.category)).filter(
    (s) => visibleSections.includes(s)
  );

  return (
    <div className="flex flex-col h-[calc(100vh-100px)] min-h-[700px] w-full bg-[#FAF8F5] text-[#272620] overflow-hidden border border-[rgba(39,38,32,0.12)] rounded-xl shadow-sm">
      {/* Top Studio Header */}
      <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-3 sm:px-6 py-2.5 bg-white border-b border-[rgba(39,38,32,0.12)] shrink-0 z-20">
        <div className="flex items-center justify-between w-full sm:w-auto gap-3">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-[0.16em] text-[#934638]">
              Live Preview Studio
            </div>
            <h1 className="font-serif text-sm sm:text-lg font-medium leading-none text-[#272620] mt-0.5 truncate max-w-[200px] sm:max-w-none">
              {draft.values.celebrants || 'Your Celebration'}
            </h1>
          </div>
          <span className="hidden md:inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-[#FAF4EB] text-[#794a32] border border-[rgba(147,70,56,0.2)] capitalize">
            {activeTemplate.name}
          </span>
        </div>

        {/* Central Save Status Indicator & Actions */}
        <div className="flex items-center justify-between w-full sm:w-auto gap-2">
          <div
            className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border"
            data-testid="studio-save-status"
            style={{
              borderColor:
                saveStatus === 'saved'
                  ? 'rgba(16, 185, 129, 0.3)'
                  : saveStatus === 'saving'
                    ? 'rgba(59, 130, 246, 0.3)'
                    : saveStatus === 'error'
                      ? 'rgba(239, 68, 68, 0.4)'
                      : 'rgba(245, 158, 11, 0.3)',
              backgroundColor:
                saveStatus === 'saved'
                  ? '#ECFDF5'
                  : saveStatus === 'saving'
                    ? '#EFF6FF'
                    : saveStatus === 'error'
                      ? '#FEF2F2'
                      : '#FFFBEB',
              color:
                saveStatus === 'saved'
                  ? '#065F46'
                  : saveStatus === 'saving'
                    ? '#1E40AF'
                    : saveStatus === 'error'
                      ? '#991B1B'
                      : '#92400E',
            }}
          >
            {saveStatus === 'saved' && (
              <>
                <Check size={13} className="text-emerald-600" />
                <span className="hidden sm:inline">All changes saved</span>
                <span className="sm:hidden">Saved</span>
              </>
            )}
            {saveStatus === 'saving' && (
              <>
                <RefreshCw size={12} className="animate-spin text-blue-600" />
                <span>Saving…</span>
              </>
            )}
            {saveStatus === 'unsaved' && (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span>Unsaved changes</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <AlertCircle size={13} className="text-red-600" />
                <span>Save failed</span>
                <button
                  type="button"
                  onClick={retrySave}
                  className="underline ml-1 font-semibold hover:text-red-900"
                >
                  Retry
                </button>
              </>
            )}
          </div>

          {/* Mobile Edit/Preview Segmented Toggle */}
          <div className="lg:hidden flex items-center p-0.5 bg-[#F0EBE1] rounded-lg" role="group" aria-label="Studio display mode">
            <button
              type="button"
              onClick={() => setMobileTab('edit')}
              aria-pressed={mobileTab === 'edit'}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                mobileTab === 'edit'
                  ? 'bg-white text-[#272620] shadow-sm font-semibold'
                  : 'text-[#6D6558] hover:text-[#272620]'
              }`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setMobileTab('preview')}
              aria-pressed={mobileTab === 'preview'}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                mobileTab === 'preview'
                  ? 'bg-white text-[#272620] shadow-sm font-semibold'
                  : 'text-[#6D6558] hover:text-[#272620]'
              }`}
            >
              Preview
            </button>
          </div>

          {onPublish && (
            <Button
              size="sm"
              variant="primary"
              onClick={handlePublishClick}
              disabled={isPublishing}
            >
              {isPublishing ? 'Publishing…' : 'Publish'}
            </Button>
          )}
        </div>
      </header>

      {/* Main Studio Body: 2-Column Split Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT COLUMN: Controls Accordions (~400px fixed on desktop) */}
        <aside
          className={`w-full lg:w-[410px] xl:w-[440px] shrink-0 bg-white border-r border-[rgba(39,38,32,0.12)] flex flex-col z-10 ${
            mobileTab === 'edit' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Scrollable controls list */}
          <div className="flex-1 overflow-y-auto px-4 py-4 pb-28 lg:pb-6 space-y-3">
            {/* Accordion 1: Event Details */}
            <details
              className="group border border-[rgba(39,38,32,0.12)] rounded-lg overflow-hidden bg-white shadow-xs"
              open={activeAccordion === 'details'}
            >
              <summary
                onClick={(e) => {
                  e.preventDefault();
                  setActiveAccordion((prev) => (prev === 'details' ? '' : 'details'));
                }}
                className="flex items-center justify-between p-3.5 bg-[#FAF8F5] cursor-pointer select-none font-medium text-xs tracking-wide uppercase text-[#6D6558] group-hover:text-[#272620] transition-colors"
              >
                <span className="flex items-center gap-2 font-bold text-[#272620]">
                  <Calendar size={14} className="text-[#934638]" /> Event Details
                </span>
                <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-4 space-y-3.5 bg-white border-t border-[rgba(39,38,32,0.08)]">
                {/* Template Selector */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
                    Stationery Template
                  </label>
                  <select
                    className="w-full text-xs p-2 rounded border border-[rgba(39,38,32,0.18)] bg-white focus:outline-[#934638]"
                    value={draft.templateId}
                    onChange={(e) => handleTemplateSelect(e.target.value)}
                  >
                    {availableTemplates.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} · {t.category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
                    Invitation Title
                  </label>
                  <input
                    type="text"
                    className="w-full text-xs p-2 rounded border border-[rgba(39,38,32,0.18)] bg-white focus:outline-[#934638]"
                    value={draft.values.title}
                    onChange={(e) => patchValues('title', e.target.value)}
                    placeholder="e.g. Wedding Celebration"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
                      Host Name(s)
                    </label>
                    <input
                      type="text"
                      className="w-full text-xs p-2 rounded border border-[rgba(39,38,32,0.18)] bg-white focus:outline-[#934638]"
                      value={draft.values.hosts}
                      onChange={(e) => patchValues('hosts', e.target.value)}
                      placeholder="e.g. Together with their families"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
                      Honourees / Celebrants
                    </label>
                    <input
                      type="text"
                      className="w-full text-xs p-2 rounded border border-[rgba(39,38,32,0.18)] bg-white focus:outline-[#934638]"
                      value={draft.values.celebrants}
                      onChange={(e) => patchValues('celebrants', e.target.value)}
                      placeholder="e.g. Wanjiku & Otieno"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
                      Date
                    </label>
                    <input
                      type="text"
                      className="w-full text-xs p-2 rounded border border-[rgba(39,38,32,0.18)] bg-white focus:outline-[#934638]"
                      value={draft.values.date}
                      onChange={(e) => patchValues('date', e.target.value)}
                      placeholder="Saturday, 12 Dec 2026"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
                      Time & Timezone
                    </label>
                    <input
                      type="text"
                      className="w-full text-xs p-2 rounded border border-[rgba(39,38,32,0.18)] bg-white focus:outline-[#934638]"
                      value={draft.values.time}
                      onChange={(e) => patchValues('time', e.target.value)}
                      placeholder="2:00 PM EAT"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
                      Venue Name
                    </label>
                    <input
                      type="text"
                      className="w-full text-xs p-2 rounded border border-[rgba(39,38,32,0.18)] bg-white focus:outline-[#934638]"
                      value={draft.values.venue}
                      onChange={(e) => patchValues('venue', e.target.value)}
                      placeholder="e.g. Windsor Golf & Country Club"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
                      City / Area
                    </label>
                    <input
                      type="text"
                      className="w-full text-xs p-2 rounded border border-[rgba(39,38,32,0.18)] bg-white focus:outline-[#934638]"
                      value={draft.values.city}
                      onChange={(e) => patchValues('city', e.target.value)}
                      placeholder="e.g. Ridgeways, Nairobi"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
                    Hero Cover Photo URL
                  </label>
                  <input
                    type="text"
                    className="w-full text-xs p-2 rounded border border-[rgba(39,38,32,0.18)] bg-white focus:outline-[#934638]"
                    value={draft.values.heroImage}
                    onChange={(e) => patchValues('heroImage', e.target.value)}
                    placeholder="https://..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
                      RSVP Deadline
                    </label>
                    <input
                      type="text"
                      className="w-full text-xs p-2 rounded border border-[rgba(39,38,32,0.18)] bg-white focus:outline-[#934638]"
                      value={draft.values.rsvpDeadline || ''}
                      onChange={(e) => patchValues('rsvpDeadline', e.target.value)}
                      placeholder="1 Dec 2026"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
                      Dress Code
                    </label>
                    <input
                      type="text"
                      className="w-full text-xs p-2 rounded border border-[rgba(39,38,32,0.18)] bg-white focus:outline-[#934638]"
                      value={draft.values.dressCode || ''}
                      onChange={(e) => patchValues('dressCode', e.target.value)}
                      placeholder="e.g. Black Tie / Traditional"
                    />
                  </div>
                </div>
              </div>
            </details>

            {/* Accordion 2: Design & Palette */}
            <details
              className="group border border-[rgba(39,38,32,0.12)] rounded-lg overflow-hidden bg-white shadow-xs"
              open={activeAccordion === 'design'}
            >
              <summary
                onClick={(e) => {
                  e.preventDefault();
                  setActiveAccordion((prev) => (prev === 'design' ? '' : 'design'));
                }}
                className="flex items-center justify-between p-3.5 bg-[#FAF8F5] cursor-pointer select-none font-medium text-xs tracking-wide uppercase text-[#6D6558] group-hover:text-[#272620] transition-colors"
              >
                <span className="flex items-center gap-2 font-bold text-[#272620]">
                  <Palette size={14} className="text-[#934638]" /> Palette & Typography
                </span>
                <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-4 bg-white border-t border-[rgba(39,38,32,0.08)]">
                <TypographyPaletteControls
                  design={draft.design}
                  onChange={patchDesign}
                  category={draft.category}
                />
              </div>
            </details>

            {/* Accordion 3: Envelope Construction & Wax Seal */}
            <details
              className="group border border-[rgba(39,38,32,0.12)] rounded-lg overflow-hidden bg-white shadow-xs"
              open={activeAccordion === 'envelope'}
            >
              <summary
                onClick={(e) => {
                  e.preventDefault();
                  setActiveAccordion((prev) => (prev === 'envelope' ? '' : 'envelope'));
                }}
                className="flex items-center justify-between p-3.5 bg-[#FAF8F5] cursor-pointer select-none font-medium text-xs tracking-wide uppercase text-[#6D6558] group-hover:text-[#272620] transition-colors"
              >
                <span className="flex items-center gap-2 font-bold text-[#272620]">
                  <Mail size={14} className="text-[#934638]" /> Stationery & Wax Seal
                </span>
                <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-4 space-y-3.5 bg-white border-t border-[rgba(39,38,32,0.08)]">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
                    Opening Motion Choreography
                  </label>
                  {draft.category === 'memorial' || draft.category === 'funeral' ? (
                    <div className="text-xs p-2.5 rounded border border-[rgba(39,38,32,0.18)] bg-[#FAF8F5] text-[#554e42] flex items-center justify-between">
                      <span className="font-medium">Dignified Memorial (Candlelight)</span>
                      <span className="text-[10px] text-[#8C7B6C] italic">Reverent mode enforced</span>
                    </div>
                  ) : (
                    <select
                      className="w-full text-xs p-2 rounded border border-[rgba(39,38,32,0.18)] bg-white focus:outline-[#934638]"
                      value={draft.design.motionPreset || activeTemplate.motionPreset || 'classic-wax-seal'}
                      onChange={(e) =>
                        patchDesign({
                          motionPreset: e.target.value,
                        })
                      }
                    >
                      {OPENING_MOTION_PRESETS.map((preset) => (
                        <option key={preset.value} value={preset.value}>
                          {preset.label}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
                    Envelope Construction
                  </label>
                  <select
                    className="w-full text-xs p-2 rounded border border-[rgba(39,38,32,0.18)] bg-white focus:outline-[#934638]"
                    value={draft.design.envelopeStyle || 'classic-fold'}
                    onChange={(e) =>
                      patchDesign({
                        envelopeStyle: e.target.value as EventDesignEntity['envelopeStyle'],
                      })
                    }
                  >
                    {ENVELOPE_STYLES.map((style) => (
                      <option key={style.value} value={style.value}>
                        {style.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
                    Letter Format
                  </label>
                  <select
                    className="w-full text-xs p-2 rounded border border-[rgba(39,38,32,0.18)] bg-white focus:outline-[#934638]"
                    value={draft.design.letterStyle || 'printed-letter'}
                    onChange={(e) =>
                      patchDesign({
                        letterStyle: e.target.value as EventDesignEntity['letterStyle'],
                      })
                    }
                  >
                    {LETTER_FORMATS.map((fmt) => (
                      <option key={fmt.value} value={fmt.value}>
                        {fmt.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
                    Liner Pattern
                  </label>
                  <select
                    className="w-full text-xs p-2 rounded border border-[rgba(39,38,32,0.18)] bg-white focus:outline-[#934638]"
                    value={draft.design.linerId || 'gold-foil'}
                    onChange={(e) => patchDesign({ linerId: e.target.value })}
                  >
                    {LINER_OPTIONS.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
                      Seal Monogram / Initials
                    </label>
                    <input
                      type="text"
                      maxLength={4}
                      className="w-full text-xs p-2 rounded border border-[rgba(39,38,32,0.18)] bg-white uppercase font-serif tracking-widest focus:outline-[#934638]"
                      value={draft.design.sealMonogram || 'K'}
                      onChange={(e) =>
                        patchDesign({ sealMonogram: e.target.value.toUpperCase() })
                      }
                      placeholder="e.g. K&W"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
                      Wax Seal Color
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        aria-label="Wax seal colour"
                        className="w-8 h-8 rounded border-none cursor-pointer"
                        value={draft.design.sealColor || activeTemplate.seal.color}
                        onChange={(e) => patchDesign({ sealColor: e.target.value })}
                      />
                      <span className="font-mono text-xs uppercase text-[#6D6558]">
                        {draft.design.sealColor || activeTemplate.seal.color}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </details>

            {/* Accordion 4: Content Blocks & Creative Controls */}
            <details
              className="group border border-[rgba(39,38,32,0.12)] rounded-lg overflow-hidden bg-white shadow-xs"
              open={activeAccordion === 'sections'}
            >
              <summary
                onClick={(e) => {
                  e.preventDefault();
                  setActiveAccordion((prev) => (prev === 'sections' ? '' : 'sections'));
                }}
                className="flex items-center justify-between p-3.5 bg-[#FAF8F5] cursor-pointer select-none font-medium text-xs tracking-wide uppercase text-[#6D6558] group-hover:text-[#272620] transition-colors"
              >
                <span className="flex items-center gap-2 font-bold text-[#272620]">
                  <Layout size={14} className="text-[#934638]" /> Content Blocks ({activeBlocks.length})
                </span>
                <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-4 bg-white border-t border-[rgba(39,38,32,0.08)]">
                <ContentBlockBuilder
                  blocks={activeBlocks}
                  onChange={handleBlocksChange}
                  category={draft.category}
                />
              </div>
            </details>

            {/* Accordion 5: Contributions & M-Pesa */}
            <details
              className="group border border-[rgba(39,38,32,0.12)] rounded-lg overflow-hidden bg-white shadow-xs"
              open={activeAccordion === 'registry'}
            >
              <summary
                onClick={(e) => {
                  e.preventDefault();
                  setActiveAccordion((prev) => (prev === 'registry' ? '' : 'registry'));
                }}
                className="flex items-center justify-between p-3.5 bg-[#FAF8F5] cursor-pointer select-none font-medium text-xs tracking-wide uppercase text-[#6D6558] group-hover:text-[#272620] transition-colors"
              >
                <span className="flex items-center gap-2 font-bold text-[#272620]">
                  <Smartphone size={14} className="text-[#934638]" /> M-Pesa & Harambee
                </span>
                <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-4 space-y-3.5 bg-white border-t border-[rgba(39,38,32,0.08)]">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
                    M-Pesa Contribution Type
                  </label>
                  <select
                    className="w-full text-xs p-2 rounded border border-[rgba(39,38,32,0.18)] bg-white focus:outline-[#934638]"
                    value={draft.values.mpesaType || 'till'}
                    onChange={(e) =>
                      patchValues('mpesaType', e.target.value as DraftInvitationValues['mpesaType'])
                    }
                  >
                    <option value="till">Buy Goods (Till Number)</option>
                    <option value="paybill">Paybill</option>
                    <option value="send_money">Send Money (Phone Number)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
                      M-Pesa Number
                    </label>
                    <input
                      type="text"
                      className="w-full text-xs p-2 rounded border border-[rgba(39,38,32,0.18)] bg-white font-mono focus:outline-[#934638]"
                      value={draft.values.mpesaNumber || ''}
                      onChange={(e) => patchValues('mpesaNumber', e.target.value)}
                      placeholder="e.g. 8249102"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
                      Account / Recipient Name
                    </label>
                    <input
                      type="text"
                      className="w-full text-xs p-2 rounded border border-[rgba(39,38,32,0.18)] bg-white focus:outline-[#934638]"
                      value={draft.values.mpesaRecipient || ''}
                      onChange={(e) => patchValues('mpesaRecipient', e.target.value)}
                      placeholder="e.g. Kevin & Wanjiku"
                    />
                  </div>
                </div>
              </div>
            </details>

            {/* Accordion 6: Background Music */}
            <details
              className="group border border-[rgba(39,38,32,0.12)] rounded-lg overflow-hidden bg-white shadow-xs"
              open={activeAccordion === 'music'}
              onToggle={(e) => {
                if ((e.target as HTMLDetailsElement).open) setActiveAccordion('music');
              }}
            >
              <summary className="flex items-center justify-between p-3.5 bg-[#FAF8F5] cursor-pointer select-none font-medium text-xs tracking-wide uppercase text-[#6D6558] group-hover:text-[#272620] transition-colors">
                <span className="flex items-center gap-2 font-bold text-[#272620]">
                  <Music size={14} className="text-[#934638]" /> Background Music
                </span>
                <ChevronDown size={14} className="group-open:rotate-180 transition-transform" />
              </summary>
              <div className="p-4 space-y-3.5 bg-white border-t border-[rgba(39,38,32,0.08)]">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
                    Select Audio Preset
                  </label>
                  <select
                    className="w-full text-xs p-2 rounded border border-[rgba(39,38,32,0.18)] bg-white focus:outline-[#934638]"
                    value={draft.values.audioUrl || ''}
                    onChange={(e) => patchValues('audioUrl', e.target.value)}
                  >
                    {MUSIC_PRESETS.map((m) => (
                      <option key={m.label} value={m.url}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-[#6D6558] mb-1">
                    Or Custom Audio URL (mp3/aac)
                  </label>
                  <input
                    type="text"
                    className="w-full text-xs p-2 rounded border border-[rgba(39,38,32,0.18)] bg-white focus:outline-[#934638]"
                    value={draft.values.audioUrl || ''}
                    onChange={(e) => patchValues('audioUrl', e.target.value)}
                    placeholder="https://example.com/song.mp3"
                  />
                </div>
              </div>
            </details>
          </div>
        </aside>

        {/* RIGHT COLUMN: Live Guest Preview Stage */}
        <main
          className={`flex-1 flex flex-col bg-[#F3EFEA] overflow-hidden ${
            mobileTab === 'preview' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Top Toolbar above preview */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-2.5 bg-white border-b border-[rgba(39,38,32,0.12)] shrink-0 z-10 gap-3">
            {/* Preview As Guest picker */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-[#6D6558] whitespace-nowrap hidden sm:inline">
                Preview as:
              </label>
              <select
                aria-label="Preview as guest household"
                className="text-xs py-1.5 px-2.5 rounded border border-[rgba(39,38,32,0.18)] bg-[#FAF8F5] text-[#272620] font-medium focus:outline-[#934638]"
                value={guestId}
                onChange={(e) => setGuestId(e.target.value)}
              >
                {guests.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Device Switcher */}
            <div
              className="flex items-center p-0.5 bg-[#FAF8F5] border border-[rgba(39,38,32,0.12)] rounded-lg"
              role="group"
              aria-label="Preview device viewport"
            >
              <button
                type="button"
                onClick={() => setDevice('iphone')}
                aria-pressed={device === 'iphone'}
                className={`p-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
                  device === 'iphone'
                    ? 'bg-white text-[#934638] shadow-xs'
                    : 'text-[#756F64] hover:text-[#272620]'
                }`}
                title="iPhone View (393 × 852)"
              >
                <Smartphone size={14} />
                <span className="hidden sm:inline">iPhone</span>
              </button>
              <button
                type="button"
                onClick={() => setDevice('android')}
                aria-pressed={device === 'android'}
                className={`p-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
                  device === 'android'
                    ? 'bg-white text-[#934638] shadow-xs'
                    : 'text-[#756F64] hover:text-[#272620]'
                }`}
                title="Android View (412 × 915)"
              >
                <Smartphone size={14} />
                <span className="hidden sm:inline">Android</span>
              </button>
              <button
                type="button"
                onClick={() => setDevice('desktop')}
                aria-pressed={device === 'desktop'}
                className={`p-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
                  device === 'desktop'
                    ? 'bg-white text-[#934638] shadow-xs'
                    : 'text-[#756F64] hover:text-[#272620]'
                }`}
                title="Responsive Desktop View"
              >
                <Monitor size={14} />
                <span className="hidden sm:inline">Desktop</span>
              </button>
            </div>

            {/* Action buttons: Restart & Share Preview */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setReplayKey((k) => k + 1)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium border border-[rgba(39,38,32,0.18)] bg-white text-[#272620] hover:bg-[#FAF8F5] transition-colors"
                title="Replay Envelope Unsealing Sequence"
              >
                <RotateCcw size={13} />
                <span className="hidden sm:inline">Replay</span>
              </button>

              <button
                type="button"
                onClick={handleSharePreview}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium border border-[rgba(39,38,32,0.18)] bg-white text-[#272620] hover:bg-[#FAF8F5] transition-colors"
              >
                <Copy size={13} />
                <span className="hidden sm:inline">Share preview</span>
              </button>
            </div>
          </div>

          {/* Floating Notice Toast */}
          <AnimatePresence>
            {notice && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="absolute top-14 left-1/2 -translate-x-1/2 bg-[#272620] text-white text-xs px-4 py-2 rounded-full shadow-lg z-30 flex items-center gap-2"
              >
                <Check size={13} className="text-emerald-400" />
                <span>{notice}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Preview Viewport Canvas */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-start justify-center">
            <div
              className={`transition-all duration-300 w-full ${
                device === 'iphone'
                  ? 'max-w-[400px] shadow-2xl rounded-[40px] border-[8px] border-[#272620] bg-white overflow-hidden my-auto'
                  : device === 'android'
                    ? 'max-w-[420px] shadow-2xl rounded-[32px] border-[7px] border-[#333333] bg-white overflow-hidden my-auto'
                    : 'max-w-[1080px] shadow-md rounded-lg bg-white overflow-hidden my-2'
              }`}
            >
              {/* Device camera cutout indicator for mobile frames */}
              {(device === 'iphone' || device === 'android') && (
                <div className="h-6 bg-[#272620] w-full flex items-center justify-center shrink-0">
                  <div className="w-16 h-3 bg-black rounded-full" />
                </div>
              )}

              {/* The Canonical Draft Preview Component */}
              <div className="min-h-[600px] w-full bg-[#FAF8F5]">
                <DraftInvitationPreview
                  template={activeTemplate}
                  values={draft.values}
                  design={draft.design}
                  guestName={guestSalutation}
                  restartKey={replayKey}
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Confirmation Modal when switching templates with authored values */}
      {templateSwitchConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-[rgba(39,38,32,0.12)]">
            <div className="w-10 h-10 rounded-full bg-[#FAF4EB] text-[#934638] flex items-center justify-center mb-4">
              <Palette size={20} />
            </div>
            <h3 className="font-serif text-lg font-bold text-[#272620]">
              Switch Template Design?
            </h3>
            <p className="text-xs text-[#756F64] mt-2 mb-6 leading-relaxed">
              Switching templates updates stationery colors, fonts, and envelope finishes. Would you
              like to keep your custom event details (title, dates, and venue) or reset to the
              template sample content?
            </p>
            <div className="flex flex-col sm:flex-row gap-2.5 justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTemplateSwitchConfirm(null)}
              >
                Cancel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const target = availableTemplates.find((t) => t.id === templateSwitchConfirm);
                  if (target) applyTemplateSwitch(target, false);
                }}
              >
                Reset to Sample Content
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  const target = availableTemplates.find((t) => t.id === templateSwitchConfirm);
                  if (target) applyTemplateSwitch(target, true);
                }}
              >
                Keep My Details
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
