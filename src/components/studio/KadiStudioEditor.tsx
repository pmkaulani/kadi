'use client';

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  Signal,
  Wifi,
  Battery,
  Lock,
  Maximize2,
  Minimize2,
  Type,
  Layers,
  MousePointerClick,
  ArrowLeft,
  Undo2,
  Redo2,
  X,
  UploadCloud,
  Send,
  Plus,
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
import type { CanvasElement, MaskShape } from '@/types/canvas';
import { getCanvasHeadingFontOverride, getTemplateCanvasElements } from '@/lib/templates/canvas-defaults';
import { InvitationCanvas } from './canvas/InvitationCanvas';
import { StickersPanel } from './canvas/StickersPanel';
import { TextPanel } from './canvas/TextPanel';
import { UploadsPanel } from './canvas/UploadsPanel';
import { LayersDrawer } from './canvas/LayersDrawer';

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
  defaultExpanded?: boolean;
  hideExpandButton?: boolean;
  backHref?: string;
}

const DEFAULT_GUESTS: PreviewGuestOption[] = [
  { id: 'kamau-household', label: 'Mr. & Mrs. Kamau' },
  { id: 'sarah-kamau', label: 'Sarah Kamau' },
  { id: 'david-mwangi', label: 'David Mwangi' },
  { id: 'wanjiku-family', label: 'Wanjiku Otieno & Family' },
  { id: 'peter-otieno', label: 'Dr. Peter Otieno & Family' },
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

const LINER_OPTIONS = [
  { id: 'gold-foil', label: 'Gold Foil Shimmer' },
  { id: 'blush-floral', label: 'Blush Botanical' },
  { id: 'botanical', label: 'Savannah Acacia' },
  { id: 'geometric', label: 'Kitenge Geometric' },
  { id: 'none', label: 'Solid Paper' },
];

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

  const rawCanvasElements =
    design?.canvasElements ||
    getTemplateCanvasElements(activeTemplate, initialValues, {
      palette: design?.palette,
      headingFont: getCanvasHeadingFontOverride(activeTemplate, design),
    });

  const isBabyEvent =
    category === 'baby-shower' ||
    category === 'welcome-baby' ||
    initialValues.title?.toLowerCase().includes('baby') ||
    initialValues.celebrants?.toLowerCase().includes('baby');

  const initialCanvasElements = rawCanvasElements.map((el) => {
    // 1. If it's a baby event and has a wedding ring top sticker, replace with sweet baby doodle heart
    if (
      isBabyEvent &&
      el.id === 'sticker-hero-crest' &&
      (el.content.includes('wedding') ||
        el.content.includes('diamond-ring') ||
        el.content.includes('solitaire') ||
        el.content.includes('interlocking-rings'))
    ) {
      return {
        ...el,
        name: 'Hand-Drawn Pink Heart',
        content: '/stickers/planner-doodle-heart.png',
        accessibilityLabel: 'Hand-Drawn Pink Heart',
      };
    }

    // 2. Responsive title font size scaling for long event titles / celebrant names
    if (el.id === 'text-title' && el.styleProps?.fontSize && el.styleProps.fontSize >= 34) {
      const len = el.content?.length || 0;
      if (len > 24) {
        return {
          ...el,
          styleProps: { ...el.styleProps, fontSize: 26, lineHeight: 1.2 },
          width: Math.max(el.width, 432),
          x: Math.min(el.x, 24),
        };
      } else if (len > 18) {
        return {
          ...el,
          styleProps: { ...el.styleProps, fontSize: 30, lineHeight: 1.2 },
          width: Math.max(el.width, 432),
          x: Math.min(el.x, 24),
        };
      }
    }

    // 3. If an element overhangs outside the right card boundary (> 480), nudge inward safely
    if (el.x + el.width > 480) {
      return {
        ...el,
        x: Math.max(15, 480 - el.width - 15),
      };
    }

    return el;
  });

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
      canvasElements: initialCanvasElements,
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
  defaultExpanded = false,
  hideExpandButton = false,
  backHref = '/',
}: KadiStudioEditorProps) {
  const router = useRouter();
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

  // Studio Mode: Canvas editing (default) vs Guest Preview
  const [studioMode, setStudioMode] = useState<'canvas' | 'preview'>('canvas');
  const [activeRailTool, setActiveRailTool] = useState<
    'templates' | 'text' | 'stickers' | 'photos' | 'buttons' | 'style' | 'envelope' | 'sections' | 'layers' | null
  >(null);

  // Selected element ID on canvas
  const [selectedCanvasId, setSelectedCanvasId] = useState<string | null>(null);

  // Preview UI state
  const [device, setDevice] = useState<PreviewDevice>('iphone');
  const [guestId, setGuestId] = useState<string>(guests[0]?.id || 'kamau-household');
  const [replayKey, setReplayKey] = useState<number>(0);
  const [notice, setNotice] = useState<string>('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [templateSwitchConfirm, setTemplateSwitchConfirm] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  // ── UNDO / REDO HISTORY ENGINE (§5.3) ─────────────────────────────────
  const canvasElements = useMemo(() => {
    return (
      draft.design.canvasElements ||
      getTemplateCanvasElements(activeTemplate, draft.values, {
        palette: draft.design.palette,
        headingFont: getCanvasHeadingFontOverride(activeTemplate, { fontFamily: draft.design.fontFamily, typography: draft.design.typography }),
      })
    );
  }, [
    draft.design.canvasElements,
    draft.design.palette,
    draft.design.typography,
    draft.design.fontFamily,
    activeTemplate,
    draft.values,
  ]);

  const [history, setHistory] = useState<CanvasElement[][]>([canvasElements]);
  const [historyIndex, setHistoryIndex] = useState(0);

  const pushHistory = useCallback((nextElements: CanvasElement[]) => {
    setHistory((prev) => [...prev.slice(0, historyIndex + 1), nextElements]);
    setHistoryIndex((prev) => prev + 1);
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      const prevElements = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      update((prev) => ({
        ...prev,
        design: {
          ...prev.design,
          canvasElements: prevElements,
        },
      }));
    }
  }, [historyIndex, history, update]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextElements = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      update((prev) => ({
        ...prev,
        design: {
          ...prev.design,
          canvasElements: nextElements,
        },
      }));
    }
  }, [historyIndex, history, update]);

  // Keyboard Undo / Redo listeners (Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z)
  useEffect(() => {
    const handleUndoRedoKeys = (e: KeyboardEvent) => {
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', handleUndoRedoKeys);
    return () => window.removeEventListener('keydown', handleUndoRedoKeys);
  }, [handleUndo, handleRedo]);

  // Updaters for single draft model
  const patchValues = useCallback(
    <K extends keyof DraftInvitationValues>(key: K, value: DraftInvitationValues[K]) => {
      update((prev) => {
        let updatedCanvasElements = prev.design?.canvasElements;
        if (typeof value === 'string' && updatedCanvasElements && updatedCanvasElements.length > 0) {
          if (key === 'title' || key === 'celebrants') {
            updatedCanvasElements = updatedCanvasElements.map((el) =>
              el.id === 'text-title' ? { ...el, content: value } : el
            );
          } else if (key === 'date') {
            updatedCanvasElements = updatedCanvasElements.map((el) => {
              if (el.id !== 'text-date') return el;
              const timePart = prev.values.time ? ` · ${prev.values.time}` : '';
              return { ...el, content: `${value}${timePart}` };
            });
          } else if (key === 'time') {
            updatedCanvasElements = updatedCanvasElements.map((el) => {
              if (el.id !== 'text-date') return el;
              const datePart = prev.values.date || 'Saturday, 14 November 2026';
              return { ...el, content: `${datePart} · ${value}` };
            });
          } else if (key === 'venue') {
            updatedCanvasElements = updatedCanvasElements.map((el) => {
              if (el.id !== 'text-venue') return el;
              const cityPart = prev.values.city ? `\n${prev.values.city}` : '';
              return { ...el, content: `${value}${cityPart}` };
            });
          } else if (key === 'city') {
            updatedCanvasElements = updatedCanvasElements.map((el) => {
              if (el.id !== 'text-venue') return el;
              const venuePart = prev.values.venue || 'Safari Park Hotel';
              return { ...el, content: `${venuePart}\n${value}` };
            });
          } else if (key === 'hosts') {
            updatedCanvasElements = updatedCanvasElements.map((el) =>
              el.id === 'text-hosts' ? { ...el, content: value } : el
            );
          } else if (key === 'countdownLabel') {
            updatedCanvasElements = updatedCanvasElements.map((el) =>
              el.id === 'text-request' ? { ...el, content: value } : el
            );
          }
        }
        return {
          ...prev,
          values: {
            ...prev.values,
            [key]: value,
          },
          design: updatedCanvasElements
            ? { ...prev.design, canvasElements: updatedCanvasElements }
            : prev.design,
        };
      });
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

  // ── CANVAS ELEMENT CRUD HANDLERS ──────────────────────────────────────
  const handleUpdateCanvasElement = (id: string, updates: Partial<CanvasElement>) => {
    const next = canvasElements.map((el) =>
      el.id === id ? { ...el, ...updates } : el
    );

    // Sync values if canvas text element content changed
    if (updates.content !== undefined) {
      if (id === 'text-title') {
        patchValues('title', updates.content);
        patchValues('celebrants', updates.content);
      } else if (id === 'text-hosts') {
        patchValues('hosts', updates.content);
      } else if (id === 'text-date') {
        const parts = updates.content.split('·');
        patchValues('date', parts[0].trim());
        if (parts[1]) {
          patchValues('time', parts[1].trim());
        }
      } else if (id === 'text-venue') {
        const parts = updates.content.split('\n');
        patchValues('venue', parts[0].trim());
        if (parts[1]) {
          patchValues('city', parts[1].trim());
        }
      } else if (id === 'text-request') {
        patchValues('countdownLabel', updates.content);
      }
    }

    pushHistory(next);
    patchDesign({ canvasElements: next });
  };

  const handleDuplicateCanvasElement = (id: string) => {
    const target = canvasElements.find((el) => el.id === id);
    if (!target) return;

    const copy: CanvasElement = {
      ...target,
      id: `${target.type}-${Date.now()}`,
      x: target.x + 20,
      y: target.y + 20,
      zIndex: Math.max(...canvasElements.map((e) => e.zIndex), 0) + 1,
    };

    const next = [...canvasElements, copy];
    pushHistory(next);
    patchDesign({ canvasElements: next });
    setSelectedCanvasId(copy.id);
  };

  const handleDeleteCanvasElement = (id: string) => {
    const next = canvasElements.filter((el) => el.id !== id);
    pushHistory(next);
    patchDesign({ canvasElements: next });
    setSelectedCanvasId(null);
  };

  const handleBringForward = (id: string) => {
    const target = canvasElements.find((e) => e.id === id);
    if (!target) return;
    const sorted = [...canvasElements].sort((a, b) => a.zIndex - b.zIndex);
    const idx = sorted.findIndex((e) => e.id === id);
    if (idx < sorted.length - 1) {
      const above = sorted[idx + 1];
      const targetZ = target.zIndex;
      target.zIndex = above.zIndex;
      above.zIndex = targetZ;
      pushHistory([...canvasElements]);
      patchDesign({ canvasElements: [...canvasElements] });
    }
  };

  const handleSendBackward = (id: string) => {
    const target = canvasElements.find((e) => e.id === id);
    if (!target) return;
    const sorted = [...canvasElements].sort((a, b) => a.zIndex - b.zIndex);
    const idx = sorted.findIndex((e) => e.id === id);
    if (idx > 0) {
      const below = sorted[idx - 1];
      const targetZ = target.zIndex;
      target.zIndex = below.zIndex;
      below.zIndex = targetZ;
      pushHistory([...canvasElements]);
      patchDesign({ canvasElements: [...canvasElements] });
    }
  };

  const handleToggleLock = (id: string) => {
    const next = canvasElements.map((el) =>
      el.id === id ? { ...el, isLocked: !el.isLocked } : el
    );
    patchDesign({ canvasElements: next });
  };

  // Add new Sticker to canvas
  const handleInsertSticker = (asset: any) => {
    const newSticker: CanvasElement = {
      id: `sticker-${Date.now()}`,
      type: 'sticker',
      name: asset.name,
      content: asset.imageUrl || asset.content || asset.svgContent,
      x: 180,
      y: 260,
      width: asset.defaultWidth || 120,
      height: asset.defaultHeight || 120,
      rotation: 0,
      zIndex: Math.max(...canvasElements.map((e) => e.zIndex), 0) + 1,
      opacity: 1,
      styleProps: {},
      animation: { effect: 'fadeIn', duration: 0.8 },
      accessibilityLabel: asset.name,
    };

    const next = [...canvasElements, newSticker];
    pushHistory(next);
    patchDesign({ canvasElements: next });
    setSelectedCanvasId(newSticker.id);
    setActiveRailTool(null); // close panel to focus on canvas
  };

  // Add new Text to canvas
  const handleInsertText = (preset: any) => {
    const newText: CanvasElement = {
      id: `text-${Date.now()}`,
      type: 'text',
      name: preset.content.slice(0, 16),
      content: preset.content,
      x: 60,
      y: 300,
      width: 360,
      height: 48,
      rotation: 0,
      zIndex: Math.max(...canvasElements.map((e) => e.zIndex), 0) + 1,
      opacity: 1,
      styleProps: preset.style,
    };

    const next = [...canvasElements, newText];
    pushHistory(next);
    patchDesign({ canvasElements: next });
    setSelectedCanvasId(newText.id);
    setActiveRailTool(null);
  };

  // Add new Photo to canvas (with keepsake die-cut shapes & sticker borders)
  const handleInsertPhoto = (
    photoUrl: string,
    maskShape: MaskShape,
    stickerEffect: boolean = false
  ) => {
    const isSticker =
      stickerEffect ||
      maskShape === 'heart' ||
      maskShape === 'star' ||
      maskShape === 'polaroid' ||
      maskShape === 'stamp' ||
      maskShape === 'flower';

    const photoName =
      maskShape === 'heart'
        ? 'Heart Photo Sticker'
        : maskShape === 'polaroid'
        ? 'Polaroid Keepsake'
        : maskShape === 'stamp'
        ? 'Postage Stamp Photo'
        : maskShape === 'arch'
        ? 'Arch Photo Frame'
        : 'User Photo';

    const newPhoto: CanvasElement = {
      id: `photo-${Date.now()}`,
      type: 'photo',
      name: photoName,
      content: photoUrl,
      originalAssetUrl: photoUrl,
      x: 140,
      y: 200,
      width: 200,
      height: maskShape === 'polaroid' ? 240 : 200,
      rotation: 0,
      zIndex: Math.max(...canvasElements.map((e) => e.zIndex), 0) + 1,
      opacity: 1,
      styleProps: {
        maskShape,
        stickerEffect: isSticker,
        stickerBorderWidth: 8,
        stickerBorderColor: '#FFFFFF',
      },
    };

    const next = [...canvasElements, newPhoto];
    pushHistory(next);
    patchDesign({ canvasElements: next });
    setSelectedCanvasId(newPhoto.id);
    setActiveRailTool(null);
  };

  // Add new Button to canvas
  const handleInsertButton = (preset: {
    label: string;
    fill?: string;
    color?: string;
    borderRadius?: number;
    linkUrl?: string;
  }) => {
    const newButton: CanvasElement = {
      id: `button-${Date.now()}`,
      type: 'button',
      name: preset.label,
      content: preset.label,
      linkUrl: preset.linkUrl,
      x: 140,
      y: 320,
      width: 200,
      height: 44,
      rotation: 0,
      zIndex: Math.max(...canvasElements.map((e) => e.zIndex), 0) + 1,
      opacity: 1,
      styleProps: {
        fill: preset.fill || draft.design.palette?.primary || activeTemplate.palette.primary,
        color: preset.color || '#FFFFFF',
        borderRadius: preset.borderRadius ?? 9999,
        fontSize: 13,
        fontWeight: 600,
        fontFamily: 'Inter',
        letterSpacing: 1.5,
      },
    };

    const next = [...canvasElements, newButton];
    pushHistory(next);
    patchDesign({ canvasElements: next });
    setSelectedCanvasId(newButton.id);
    setActiveRailTool(null);
  };

  // Safe template switching
  const handleTemplateSelect = (newTemplateId: string) => {
    const nextTemplate = availableTemplates.find((t) => t.id === newTemplateId);
    if (!nextTemplate) return;

    const hasCustomTitle = draft.values.title !== activeTemplate.sampleData.title;
    if (hasCustomTitle) {
      setTemplateSwitchConfirm(newTemplateId);
    } else {
      applyTemplateSwitch(nextTemplate, false);
    }
  };

  const applyTemplateSwitch = (nextTemplate: TemplateDefinition, preserveDetails = true) => {
    const nextCanvasElements = getTemplateCanvasElements(
      nextTemplate,
      preserveDetails ? draft.values : (nextTemplate.sampleData as any),
      {
        palette: nextTemplate.palette,
        headingFont: preserveDetails ? getCanvasHeadingFontOverride(activeTemplate, draft.design) : undefined,
      }
    );

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
        canvasElements: nextCanvasElements,
      },
    });
    setTemplateSwitchConfirm(null);
    setReplayKey((k) => k + 1);
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

  const selectedGuest = guests.find((g) => g.id === guestId) || guests[0];
  const guestSalutation = selectedGuest?.label || 'Distinguished Guest';

  const visibleSections = draft.design.visibleSections || getDefaultInvitationSections(draft.category);
  const orderedSections = (draft.design.sectionOrder || getDefaultInvitationSections(draft.category)).filter(
    (s) => visibleSections.includes(s)
  );

  return (
    <div
      className={`flex flex-col w-full bg-[#21191D] text-[#F7F0E8] overflow-hidden transition-all duration-200 select-none ${
        isExpanded
          ? 'fixed inset-0 z-50 h-screen w-screen rounded-none border-0'
          : 'h-[calc(100vh-140px)] min-h-[660px] border border-white/10 rounded-2xl shadow-2xl'
      }`}
    >
      {/* ── 1. TOP STUDIO HEADER & TOOLBAR (§5.1) ────────────────────── */}
      <header className="flex items-center justify-between px-3 sm:px-6 py-2.5 bg-[#2A2024] border-b border-white/10 shrink-0 z-30 gap-3">
        {/* Left: Back to Gallery + Project Name */}
        <div className="flex items-center gap-3 min-w-0 shrink">
          <Link
            href={backHref}
            className="flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors px-2 py-1 rounded-md hover:bg-white/5 shrink-0"
            title="Back to Gallery"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline font-sans">Gallery</span>
          </Link>

          <div className="h-4 w-[1px] bg-white/15 hidden sm:block shrink-0" />

          {/* Inline Editable Project Title */}
          <div className="min-w-0">
            <input
              type="text"
              value={draft.values.title}
              onChange={(e) => patchValues('title', e.target.value)}
              className="bg-transparent text-sm sm:text-base font-serif font-medium text-white hover:bg-white/5 focus:bg-white/10 px-2 py-1 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-[#B99A62] truncate w-full max-w-[160px] sm:max-w-[280px]"
              placeholder="Name your invitation"
              title="Click to rename invitation"
            />
          </div>
        </div>

        {/* Center: Undo, Redo, Mode Switcher */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Real Undo / Redo */}
          <div className="flex items-center bg-white/5 rounded-lg border border-white/10 p-0.5">
            <button
              onClick={handleUndo}
              disabled={historyIndex <= 0}
              className="p-1.5 text-white/70 hover:text-white disabled:opacity-20 transition-opacity"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={14} />
            </button>
            <button
              onClick={handleRedo}
              disabled={historyIndex >= history.length - 1}
              className="p-1.5 text-white/70 hover:text-white disabled:opacity-20 transition-opacity"
              title="Redo (Ctrl+Y)"
            >
              <Redo2 size={14} />
            </button>
          </div>

          {/* Mode Switcher: Studio Canvas vs. Guest Preview */}
          <div className="flex items-center bg-white/5 rounded-lg border border-white/10 p-0.5">
            <button
              onClick={() => setStudioMode('canvas')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                studioMode === 'canvas'
                  ? 'bg-[#B99A62] text-[#112327] font-semibold shadow-xs'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              Studio Canvas
            </button>
            <button
              onClick={() => setStudioMode('preview')}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all flex items-center gap-1.5 ${
                studioMode === 'preview'
                  ? 'bg-[#B99A62] text-[#112327] font-semibold shadow-xs'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Eye size={13} />
              <span>Guest Preview</span>
            </button>
          </div>
        </div>

        {/* Right: Autosave Status, Publish CTA & Fullscreen */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Canonical Autosave State Machine Indicator */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium border"
            data-testid="studio-save-status"
            style={{
              borderColor:
                saveStatus === 'saved'
                  ? 'rgba(16, 185, 129, 0.4)'
                  : saveStatus === 'saving'
                  ? 'rgba(212, 175, 55, 0.4)'
                  : saveStatus === 'error'
                  ? 'rgba(239, 68, 68, 0.5)'
                  : 'rgba(245, 158, 11, 0.4)',
              backgroundColor:
                saveStatus === 'saved'
                  ? 'rgba(16, 185, 129, 0.12)'
                  : saveStatus === 'saving'
                  ? 'rgba(212, 175, 55, 0.12)'
                  : saveStatus === 'error'
                  ? 'rgba(239, 68, 68, 0.15)'
                  : 'rgba(245, 158, 11, 0.12)',
              color:
                saveStatus === 'saved'
                  ? '#34D399'
                  : saveStatus === 'saving'
                  ? '#FBBF24'
                  : saveStatus === 'error'
                  ? '#F87171'
                  : '#FBBF24',
            }}
          >
            {saveStatus === 'saved' && (
              <>
                <Check size={12} className="text-emerald-400" />
                <span className="hidden sm:inline">All changes saved</span>
                <span className="sm:hidden">Saved</span>
              </>
            )}
            {saveStatus === 'saving' && (
              <>
                <RefreshCw size={11} className="animate-spin text-amber-400" />
                <span>Saving…</span>
              </>
            )}
            {saveStatus === 'unsaved' && (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span>Unsaved</span>
              </>
            )}
            {saveStatus === 'error' && (
              <>
                <AlertCircle size={12} className="text-red-400" />
                <span>Save failed</span>
                <button
                  type="button"
                  onClick={retrySave}
                  className="underline ml-1 font-semibold hover:text-red-300"
                >
                  Retry
                </button>
              </>
            )}
          </div>

          {onPublish && (
            <button
              onClick={handlePublishClick}
              disabled={isPublishing}
              className="px-4 py-1.5 rounded-lg bg-[#7B3547] hover:bg-[#622838] text-white font-semibold text-xs transition-all shadow-md active:scale-95 flex items-center gap-1.5"
            >
              <Send size={13} />
              <span>{isPublishing ? 'Publishing…' : 'Publish & Share'}</span>
            </button>
          )}

          {!hideExpandButton && (
            <button
              onClick={() => setIsExpanded((v) => !v)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
              title={isExpanded ? 'Collapse' : 'Full Screen Studio'}
            >
              {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
          )}
        </div>
      </header>

      {/* ── 2. MAIN CREATIVE WORKSPACE BODY ──────────────────────────── */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Tool Rail (§5.1) */}
        <aside
          aria-label="Creative tools"
          className="w-16 bg-[#241A1E] border-r border-white/10 flex flex-col items-center py-3 gap-2 shrink-0 z-30"
        >
          <RailButton
            icon={Sparkles}
            label="Stickers"
            isActive={activeRailTool === 'stickers'}
            onClick={() =>
              setActiveRailTool(activeRailTool === 'stickers' ? null : 'stickers')
            }
          />
          <RailButton
            icon={Type}
            label="Text"
            isActive={activeRailTool === 'text'}
            onClick={() =>
              setActiveRailTool(activeRailTool === 'text' ? null : 'text')
            }
          />
          <RailButton
            icon={ImageIcon}
            label="Photos"
            isActive={activeRailTool === 'photos'}
            onClick={() =>
              setActiveRailTool(activeRailTool === 'photos' ? null : 'photos')
            }
          />
          <RailButton
            icon={MousePointerClick}
            label="Buttons"
            isActive={activeRailTool === 'buttons'}
            onClick={() =>
              setActiveRailTool(activeRailTool === 'buttons' ? null : 'buttons')
            }
          />
          <RailButton
            icon={Layout}
            label="Templates"
            isActive={activeRailTool === 'templates'}
            onClick={() =>
              setActiveRailTool(activeRailTool === 'templates' ? null : 'templates')
            }
          />
          <RailButton
            icon={Palette}
            label="Style"
            isActive={activeRailTool === 'style'}
            onClick={() =>
              setActiveRailTool(activeRailTool === 'style' ? null : 'style')
            }
          />
          <RailButton
            icon={Mail}
            label="Envelope"
            isActive={activeRailTool === 'envelope'}
            onClick={() =>
              setActiveRailTool(activeRailTool === 'envelope' ? null : 'envelope')
            }
          />
          <RailButton
            icon={Sliders}
            label="Sections"
            isActive={activeRailTool === 'sections'}
            onClick={() =>
              setActiveRailTool(activeRailTool === 'sections' ? null : 'sections')
            }
          />
          <RailButton
            icon={Layers}
            label="Layers"
            isActive={activeRailTool === 'layers'}
            onClick={() =>
              setActiveRailTool(activeRailTool === 'layers' ? null : 'layers')
            }
          />
        </aside>

        {/* Secondary Tool Drawer (width: 320px) */}
        <AnimatePresence>
          {activeRailTool && (
            <motion.aside
              aria-label="Tool configuration drawer"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 320, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="h-full bg-[#2A2024] border-r border-white/10 overflow-hidden flex flex-col shrink-0 z-20"
            >
              {/* Drawer Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-[#34262B]">
                <span className="text-xs font-semibold tracking-wide uppercase text-white/80">
                  {activeRailTool === 'stickers' && 'Transparent Stickers'}
                  {activeRailTool === 'text' && 'Typography & Text'}
                  {activeRailTool === 'photos' && 'Photos & Masking'}
                  {activeRailTool === 'buttons' && 'Buttons & Actions'}
                  {activeRailTool === 'templates' && 'Occasion Suites'}
                  {activeRailTool === 'style' && 'Colors, Fonts & Theme'}
                  {activeRailTool === 'envelope' && 'Envelope & Motion'}
                  {activeRailTool === 'sections' && 'Guest Page Sections'}
                  {activeRailTool === 'layers' && 'Layers & Stacking'}
                </span>
                <button
                  onClick={() => setActiveRailTool(null)}
                  className="p-1 hover:bg-white/10 rounded text-white/60 hover:text-white"
                  aria-label="Close tool drawer"
                >
                  <X size={14} />
                </button>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto">
                {activeRailTool === 'stickers' && (
                  <StickersPanel onInsertSticker={handleInsertSticker} />
                )}
                {activeRailTool === 'text' && (
                  <TextPanel onInsertText={handleInsertText} />
                )}
                {activeRailTool === 'photos' && (
                  <UploadsPanel onInsertPhoto={handleInsertPhoto} />
                )}
                {activeRailTool === 'buttons' && (
                  <div className="p-4 space-y-4">
                    <p className="text-[11px] text-white/60 leading-relaxed">
                      Click any button style to drop it onto your card. You have full freedom to position, drag, resize, rotate, or duplicate it anywhere.
                    </p>
                    <div className="space-y-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleInsertButton({
                            label: 'RSVP JOYFULLY',
                            fill: '#B99A62',
                            color: '#112327',
                            borderRadius: 9999,
                            linkUrl: '#canvas-section-rsvp',
                          })
                        }
                        className="w-full py-3 px-4 rounded-full bg-[#B99A62] text-[#112327] font-sans font-semibold text-xs tracking-wider shadow-md hover:brightness-110 transition-all flex items-center justify-between"
                      >
                        <span>RSVP Joyfully</span>
                        <span className="text-[10px] uppercase font-mono opacity-60">Gold Pill</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleInsertButton({
                            label: 'ADD TO CALENDAR',
                            fill: '#934638',
                            color: '#FFFFFF',
                            borderRadius: 9999,
                            linkUrl: '#canvas-section-ceremony',
                          })
                        }
                        className="w-full py-3 px-4 rounded-full bg-[#934638] text-white font-sans font-semibold text-xs tracking-wider shadow-md hover:brightness-110 transition-all flex items-center justify-between"
                      >
                        <span>Add to Calendar</span>
                        <span className="text-[10px] uppercase font-mono opacity-60">Terracotta</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleInsertButton({
                            label: 'VIEW VENUE & MAP',
                            fill: '#7B3547',
                            color: '#FFFFFF',
                            borderRadius: 9999,
                            linkUrl: '#canvas-section-venue',
                          })
                        }
                        className="w-full py-3 px-4 rounded-full bg-[#7B3547] text-white font-sans font-semibold text-xs tracking-wider shadow-md hover:brightness-110 transition-all flex items-center justify-between"
                      >
                        <span>View Venue &amp; Map</span>
                        <span className="text-[10px] uppercase font-mono opacity-60">Forest Teal</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleInsertButton({
                            label: 'M-PESA REGISTRY',
                            fill: '#272620',
                            color: '#F6CFA0',
                            borderRadius: 9999,
                            linkUrl: '#canvas-section-registry',
                          })
                        }
                        className="w-full py-3 px-4 rounded-full bg-[#272620] text-[#F6CFA0] font-sans font-semibold text-xs tracking-wider border border-[#B99A62]/40 shadow-md hover:bg-black transition-all flex items-center justify-between"
                      >
                        <span>M-Pesa Registry</span>
                        <span className="text-[10px] uppercase font-mono opacity-60">Harambee</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleInsertButton({
                            label: 'CUSTOM ACTION',
                            fill: 'transparent',
                            color: '#FFFFFF',
                            borderRadius: 8,
                            linkUrl: '',
                          })
                        }
                        className="w-full py-3 px-4 rounded-lg bg-white/5 border border-white/20 text-white font-sans font-medium text-xs tracking-wider hover:bg-white/10 transition-all flex items-center justify-between"
                      >
                        <span>Custom Action Link</span>
                        <span className="text-[10px] uppercase font-mono opacity-60">Outlined</span>
                      </button>
                    </div>
                  </div>
                )}
                {activeRailTool === 'layers' && (
                  <LayersDrawer
                    isOpen={true}
                    onClose={() => setActiveRailTool(null)}
                    elements={canvasElements}
                    selectedId={selectedCanvasId}
                    onSelectElement={(id) => setSelectedCanvasId(id)}
                    onReorder={(id, dir) =>
                      dir === 'up' ? handleBringForward(id) : handleSendBackward(id)
                    }
                    onToggleLock={handleToggleLock}
                    onDelete={handleDeleteCanvasElement}
                  />
                )}
                {activeRailTool === 'templates' && (
                  <div className="p-3 space-y-3">
                    <span className="text-[11px] text-white/50 block">
                      Choose from 23 canonical occasion suites:
                    </span>
                    <div className="space-y-2">
                      {availableTemplates.map((tpl) => (
                        <div
                          key={tpl.id}
                          onClick={() => handleTemplateSelect(tpl.id)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            draft.templateId === tpl.id
                              ? 'border-[#B99A62] bg-[#B99A62]/15 text-white font-medium'
                              : 'border-white/10 bg-white/5 hover:bg-white/10 text-white/80'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold">{tpl.name}</span>
                            <span className="text-[10px] uppercase tracking-wider text-[#B99A62]">
                              {tpl.category}
                            </span>
                          </div>
                          <p className="text-[10px] text-white/50 mt-1 line-clamp-2">
                            {tpl.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {activeRailTool === 'style' && (
                  <div className="p-4 bg-[#FAF8F5] min-h-full text-[#272620]">
                    <TypographyPaletteControls
                      design={draft.design}
                      onChange={patchDesign}
                      category={draft.category}
                    />
                  </div>
                )}
                {activeRailTool === 'envelope' && (
                  <div className="p-4 space-y-4 text-xs">
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1.5">
                        Envelope Flap Style
                      </label>
                      <select
                        className="w-full text-xs p-2 rounded-lg border border-white/15 bg-white/10 text-white focus:outline-[#B99A62]"
                        value={draft.design.envelopeStyle || 'classic-fold'}
                        onChange={(e) => patchDesign({ envelopeStyle: e.target.value as any })}
                      >
                        {ENVELOPE_STYLES.map((s) => (
                          <option key={s.value} value={s.value} className="bg-[#2A2024]">
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1.5">
                        Liner Pattern
                      </label>
                      <select
                        className="w-full text-xs p-2 rounded-lg border border-white/15 bg-white/10 text-white focus:outline-[#B99A62]"
                        value={draft.design.linerId || 'gold-foil'}
                        onChange={(e) => patchDesign({ linerId: e.target.value })}
                      >
                        {LINER_OPTIONS.map((l) => (
                          <option key={l.id} value={l.id} className="bg-[#2A2024]">
                            {l.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1.5">
                        Wax Seal Monogram
                      </label>
                      <input
                        type="text"
                        maxLength={4}
                        className="w-full text-xs p-2 rounded-lg border border-white/15 bg-white/10 text-white font-serif uppercase tracking-widest focus:outline-[#B99A62]"
                        value={draft.design.sealMonogram || 'K'}
                        onChange={(e) =>
                          patchDesign({ sealMonogram: e.target.value.toUpperCase() })
                        }
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1.5">
                        Opening Animation Preset
                      </label>
                      <select
                        className="w-full text-xs p-2 rounded-lg border border-white/15 bg-white/10 text-white focus:outline-[#B99A62]"
                        value={draft.design.scrollAnimation || 'classic-wax-seal'}
                        onChange={(e) => patchDesign({ scrollAnimation: e.target.value as any })}
                      >
                        {OPENING_MOTION_PRESETS.map((m) => (
                          <option key={m.value} value={m.value} className="bg-[#2A2024]">
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-white/60 mb-1.5">
                        Background Music
                      </label>
                      <select
                        className="w-full text-xs p-2 rounded-lg border border-white/15 bg-white/10 text-white focus:outline-[#B99A62]"
                        value={draft.values.audioUrl || ''}
                        onChange={(e) => patchValues('audioUrl', e.target.value)}
                      >
                        {MUSIC_PRESETS.map((m) => (
                          <option key={m.url} value={m.url} className="bg-[#2A2024]">
                            {m.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
                {activeRailTool === 'sections' && (
                  <div className="p-3">
                    <ContentBlockBuilder
                      blocks={draft.design.blocks || []}
                      onChange={(newBlocks) => patchDesign({ blocks: newBlocks })}
                      category={draft.category}
                    />
                  </div>
                )}
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── 3. CENTRAL WORKSPACE ───────────────────────────────────── */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-[#302428]">
          {studioMode === 'canvas' ? (
            /* Canva-like Freeform Studio Canvas Mode */
            <InvitationCanvas
              elements={canvasElements}
              selectedId={selectedCanvasId}
              onSelectId={setSelectedCanvasId}
              onUpdateElement={handleUpdateCanvasElement}
              onDuplicateElement={handleDuplicateCanvasElement}
              onDeleteElement={handleDeleteCanvasElement}
              onBringForward={handleBringForward}
              onSendBackward={handleSendBackward}
              onToggleLock={handleToggleLock}
              cardBackground={draft.design.palette?.cardBackground || '#FCFAF7'}
              palette={{
                primary: draft.design.palette?.primary || activeTemplate.palette.primary,
                secondary: draft.design.palette?.secondary || activeTemplate.palette.secondary,
                text: draft.design.palette?.text || '#272620',
                cardBackground:
                  draft.design.palette?.cardBackground || activeTemplate.palette.cardBackground,
              }}
              onRequestReplace={() => setActiveRailTool('stickers')}
              values={draft.values}
              design={draft.design}
              category={draft.category}
              template={activeTemplate}
              onUpdateValues={patchValues}
              onUpdateDesign={patchDesign}
              onOpenPhotoRail={() => setActiveRailTool('photos')}
              onOpenStickerRail={() => setActiveRailTool('stickers')}
              onAddText={() =>
                handleInsertText({
                  content: 'Click to edit text',
                  style: {
                    fontSize: 22,
                    fontFamily: 'Playfair Display',
                    fontWeight: '600',
                    color: draft.design.palette?.text || '#272620',
                  },
                })
              }
              onAddPhoto={() => setActiveRailTool('photos')}
              onAddButton={() =>
                handleInsertButton({
                  label: 'RSVP JOYFULLY',
                  fill: draft.design.palette?.primary || activeTemplate.palette.primary,
                  color: '#FFFFFF',
                  borderRadius: 9999,
                  linkUrl: '#canvas-section-rsvp',
                })
              }
            />
          ) : (
            /* True Guest Preview Mode (with phone mockup & envelope) */
            <div className="flex-1 flex flex-col overflow-hidden bg-[#E9E0D5]">
              {/* Preview Toolbar */}
              <div className="flex items-center justify-between px-4 py-2 bg-[#FBF8F2] border-b border-[#D8CDC1] text-[#292320] text-xs">
                {/* Guest Salutation */}
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-500">Preview as:</span>
                  <select
                    value={guestId}
                    onChange={(e) => setGuestId(e.target.value)}
                    className="p-1 rounded border border-slate-200 bg-slate-50 text-[#292320] text-xs font-medium"
                  >
                    {guests.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Device Selector */}
                <div className="flex items-center bg-[#EEE5DA] rounded-lg border border-[#D8CDC1] p-0.5">
                  <button
                    onClick={() => setDevice('iphone')}
                    className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 ${
                      device === 'iphone' ? 'bg-white text-[#7B3547] font-bold shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    <Smartphone size={13} />
                    <span>iPhone</span>
                  </button>
                  <button
                    onClick={() => setDevice('android')}
                    className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 ${
                      device === 'android' ? 'bg-white text-[#7B3547] font-bold shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    <Smartphone size={13} />
                    <span>Android</span>
                  </button>
                  <button
                    onClick={() => setDevice('desktop')}
                    className={`px-2.5 py-1 rounded text-xs flex items-center gap-1 ${
                      device === 'desktop' ? 'bg-white text-[#7B3547] font-bold shadow-xs' : 'text-slate-500'
                    }`}
                  >
                    <Monitor size={13} />
                    <span>Desktop</span>
                  </button>
                </div>

                {/* Replay & Share */}
                <div className="flex items-center gap-2">
                  {replayKey > 0 && (
                    <button
                      onClick={() => setReplayKey(0)}
                      className="px-2.5 py-1 rounded border border-[#7B3547]/30 bg-[#7B3547]/10 hover:bg-[#7B3547]/20 text-[#7B3547] flex items-center gap-1 font-medium"
                      title="Skip animation and view full invitation directly"
                    >
                      <Eye size={12} />
                      <span>Full Invitation</span>
                    </button>
                  )}
                  <button
                    onClick={() => setReplayKey((k) => (k > 0 ? k + 1 : 1))}
                    className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-1 font-medium"
                    title="Play the 3D envelope and wax seal opening animation"
                  >
                    <RotateCcw size={12} />
                    <span>Replay Opening</span>
                  </button>
                  <button
                    onClick={handleSharePreview}
                    className="px-2.5 py-1 rounded border border-slate-200 bg-white hover:bg-slate-50 flex items-center gap-1 font-medium"
                  >
                    <Copy size={12} />
                    <span>Share Preview</span>
                  </button>
                </div>
              </div>

              {/* Viewport Canvas */}
              <div className="flex-1 overflow-y-auto p-4 flex justify-center items-center">
                {device === 'desktop' ? (
                  <div className="w-full max-w-4xl h-full rounded-2xl overflow-hidden shadow-2xl bg-[#FCFAF7] border border-[rgba(39,38,32,0.12)]">
                    <DraftInvitationPreview
                      template={activeTemplate}
                      values={draft.values}
                      design={draft.design}
                      guestName={guestSalutation}
                      restartKey={replayKey}
                    />
                  </div>
                ) : (
                  /* Modern Luxury Phone Frame */
                  <div className="kadi-phone-frame relative mx-auto my-auto w-[385px] sm:w-[393px] h-[790px] sm:h-[844px] max-w-[calc(100vw-24px)] shrink-0">
                    <div className="w-full h-full rounded-[44px] p-[10px] bg-[#1E1D1A] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] flex flex-col relative select-none">
                      <div
                        className="rounded-[34px] overflow-hidden flex flex-col flex-1 relative ring-1 ring-black/80 shadow-inner w-full min-w-0 transition-colors"
                        style={{
                          backgroundColor:
                            draft.design.palette?.cardBackground ||
                            activeTemplate.palette.cardBackground ||
                            '#FAF7F2',
                        }}
                      >
                        {/* Dynamic Island */}
                        <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-[90px] h-[23px] bg-black rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.6)] z-30 pointer-events-none" />
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
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Floating Notice Toast */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-[#2A2024] text-white text-xs px-4 py-2.5 rounded-full shadow-2xl border border-white/15 z-50 flex items-center gap-2"
          >
            <Check size={13} className="text-emerald-400" />
            <span>{notice}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Safe Template Switch Confirmation Modal */}
      {templateSwitchConfirm && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-[#242426] border border-white/15 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-serif text-lg font-semibold text-white">
              Switching Invitation Style
            </h3>
            <p className="text-xs text-white/70 leading-relaxed">
              Would you like to keep your personalized event details (title, hosts, date, venue) or load the new template&apos;s sample contents?
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setTemplateSwitchConfirm(null)}
                className="px-3 py-1.5 rounded-lg text-xs text-white/60 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const t = availableTemplates.find((x) => x.id === templateSwitchConfirm);
                  if (t) applyTemplateSwitch(t, false);
                }}
                className="px-3 py-1.5 rounded-lg text-xs bg-white/10 hover:bg-white/20 text-white"
              >
                Reset to Sample
              </button>
              <button
                onClick={() => {
                  const t = availableTemplates.find((x) => x.id === templateSwitchConfirm);
                  if (t) applyTemplateSwitch(t, true);
                }}
                className="px-4 py-1.5 rounded-lg text-xs bg-[#B99A62] text-[#112327] font-semibold"
              >
                Keep My Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function RailButton({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: any;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`group w-12 h-12 rounded-xl flex flex-col items-center justify-center gap-1 text-[10px] transition-all ${
        isActive
          ? 'bg-[#B99A62] text-[#112327] font-semibold shadow-md'
          : 'text-white/60 hover:text-white hover:bg-white/5'
      }`}
      title={label}
    >
      <Icon size={18} />
      <span className="scale-90">{label}</span>
    </button>
  );
}
