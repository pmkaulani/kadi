'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Copy, Monitor, RotateCcw, Smartphone, AlertCircle, ChevronUp, ChevronDown } from 'lucide-react';
import type { EventDesignEntity } from '@/lib/db/types';
import type { TemplateDefinition } from '@/lib/templates/types';
import { getDefaultInvitationSections } from '@/lib/events/default-invitation-sections';
import { DraftInvitationPreview, type DraftInvitationValues } from '@/components/invitations/DraftInvitationPreview';

export type StudioDraft = {
  values: DraftInvitationValues;
  design: Partial<EventDesignEntity>;
};

type Device = 'iphone' | 'android' | 'desktop';
type SaveState = 'ready' | 'unsaved' | 'saving' | 'saved' | 'error';

export interface PreviewGuestOption {
  id: string;
  label: string; // Supports a couple / household label such as "Mr. & Mrs. Kamau".
}

interface KadiStudioEditorProps {
  template: TemplateDefinition;
  templates?: TemplateDefinition[];
  initialValues: DraftInvitationValues;
  initialDesign: Partial<EventDesignEntity>;
  guests?: PreviewGuestOption[];
  /** Wire this to the existing event/design persistence service. Resolve only after persistence succeeds. */
  onSaveDraft: (draft: StudioDraft) => Promise<void>;
  /** Must create a private, expiring preview URL on the server; do not make draft slugs public. */
  onGeneratePrivatePreviewLink?: () => Promise<string>;
}

const defaultGuests: PreviewGuestOption[] = [
  { id: 'kamau-household', label: 'Mr. & Mrs. Kamau' },
  { id: 'sarah-kamau', label: 'Sarah Kamau' },
  { id: 'david-mwangi', label: 'David Mwangi' },
  { id: 'wanjiku-family', label: 'Wanjiku Otieno & Family' },
];

const FONT_OPTIONS = [
  { value: 'Inter', label: 'Inter — modern' },
  { value: 'Playfair Display', label: 'Playfair Display — editorial' },
  { value: 'Cormorant Garamond', label: 'Cormorant Garamond — elegant' },
  { value: 'DM Sans', label: 'DM Sans — clean' },
];

const ENVELOPE_OPTIONS: Array<{ value: NonNullable<EventDesignEntity['envelopeStyle']>; label: string }> = [
  { value: 'classic-fold', label: 'Classic fold' },
  { value: 'pocket-fold', label: 'Pocket sleeve' },
  { value: 'scalloped-edge', label: 'Scalloped edge' },
  { value: 'minimal', label: 'Modern minimal' },
];

const LETTER_OPTIONS: Array<{ value: NonNullable<EventDesignEntity['letterStyle']>; label: string }> = [
  { value: 'printed-letter', label: 'Printed invitation' },
  { value: 'handwritten-letter', label: 'Handwritten letter' },
  { value: 'folded-card', label: 'Folded card' },
];

function defaultsForTemplate(template: TemplateDefinition, previous?: DraftInvitationValues): DraftInvitationValues {
  return {
    title: template.sampleData.title,
    hosts: template.sampleData.hosts,
    celebrants: template.sampleData.celebrants,
    date: template.sampleData.date,
    time: template.sampleData.time,
    venue: template.sampleData.venue,
    city: template.sampleData.city,
    heroImage: template.sampleData.heroImage,
    rsvpDeadline: previous?.rsvpDeadline || '',
    dressCode: previous?.dressCode || '',
  };
}

function designForTemplate(template: TemplateDefinition): Partial<EventDesignEntity> {
  const defaults = getDefaultInvitationSections(template.category);
  return {
    motionPreset: template.motionPreset,
    palette: {
      primary: template.palette.primary,
      secondary: template.palette.secondary,
      accent: template.palette.accent,
      envelope: template.palette.envelope,
      flap: template.palette.flap,
      cardBackground: template.palette.cardBackground,
    },
    linerId: template.liner.id,
    sealShape: template.seal.shape === 'oval' ? 'circle' : template.seal.shape,
    sealMonogram: template.seal.monogram || 'K',
    sealColor: template.seal.color,
    visibleSections: defaults,
    sectionOrder: defaults,
    fontFamily: template.fonts.heading === 'sans' ? 'Inter' : template.fonts.heading === 'display' ? 'Cormorant Garamond' : 'Playfair Display',
    envelopeStyle: 'classic-fold',
    letterStyle: 'printed-letter',
    backgroundAnimation: 'none',
    scrollAnimation: 'fade-up',
    transitionSpeed: 'medium',
  };
}

function useReducedMotionFlag() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener?.('change', sync);
    return () => media.removeEventListener?.('change', sync);
  }, []);
  return reduced;
}

/**
 * Real preview editor. Controls update local draft state immediately; preview is rendered from
 * that same state. Only persistence is debounced. Pass the actual EventService-backed save
 * callback so the "Saved" status means the server/service has really accepted the draft.
 */
export function KadiStudioEditor({
  template,
  templates = [template],
  initialValues,
  initialDesign,
  guests = defaultGuests,
  onSaveDraft,
  onGeneratePrivatePreviewLink,
}: KadiStudioEditorProps) {
  const [templateId, setTemplateId] = useState(template.id);
  const activeTemplate = useMemo(
    () => templates.find((item) => item.id === templateId) || template,
    [templates, templateId, template],
  );
  const [draft, setDraft] = useState<StudioDraft>({ values: initialValues, design: initialDesign });
  const [guestId, setGuestId] = useState(guests[0]?.id || 'default');
  const [device, setDevice] = useState<Device>('iphone');
  const [replayKey, setReplayKey] = useState(0);
  const [saveState, setSaveState] = useState<SaveState>('ready');
  const [notice, setNotice] = useState('');
  const hasEdited = useRef(false);
  const saveQueue = useRef<Promise<void>>(Promise.resolve());
  const saveCallbackRef = useRef(onSaveDraft);
  const reducedMotion = useReducedMotionFlag();
  const guest = guests.find((item) => item.id === guestId) || guests[0];

  useEffect(() => { saveCallbackRef.current = onSaveDraft; }, [onSaveDraft]);

  // Every field modifies the one draft object. This is the key to live preview parity.
  const patchValue = <K extends keyof DraftInvitationValues>(key: K, value: DraftInvitationValues[K]) => {
    hasEdited.current = true;
    setSaveState('unsaved');
    setDraft((current) => ({ ...current, values: { ...current.values, [key]: value } }));
  };

  const patchDesign = (patch: Partial<EventDesignEntity>) => {
    hasEdited.current = true;
    setSaveState('unsaved');
    setDraft((current) => ({ ...current, design: { ...current.design, ...patch } }));
  };

  const patchPalette = (key: 'primary' | 'secondary' | 'accent' | 'envelope' | 'flap' | 'cardBackground', value: string) => {
    const base = { ...activeTemplate.palette, ...(draft.design.palette || {}) };
    patchDesign({ palette: { ...base, [key]: value } });
  };

  const toggleSection = (section: string, checked: boolean) => {
    const defaults = getDefaultInvitationSections(activeTemplate.category);
    const current = (draft.design.visibleSections || defaults).filter((key) => defaults.includes(key));
    const next = checked ? [...current, section].filter((key, index, all) => all.indexOf(key) === index) : current.filter((key) => key !== section);
    const oldOrder = draft.design.sectionOrder || defaults;
    const nextOrder = oldOrder.filter((key) => next.includes(key));
    next.forEach((key) => { if (!nextOrder.includes(key)) nextOrder.push(key); });
    patchDesign({ visibleSections: next, sectionOrder: nextOrder });
  };

  const moveSection = (section: string, direction: -1 | 1) => {
    const defaults = getDefaultInvitationSections(activeTemplate.category);
    const visible = (draft.design.visibleSections || defaults).filter((key) => defaults.includes(key));
    const order = (draft.design.sectionOrder || defaults).filter((key) => visible.includes(key));
    const index = order.indexOf(section);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= order.length) return;
    const next = [...order];
    [next[index], next[target]] = [next[target], next[index]];
    patchDesign({ sectionOrder: next });
  };

  const selectTemplate = (nextId: string) => {
    const nextTemplate = templates.find((item) => item.id === nextId);
    if (!nextTemplate) return;
    setTemplateId(nextId);
    hasEdited.current = true;
    setSaveState('unsaved');
    setDraft((current) => ({ values: defaultsForTemplate(nextTemplate, current.values), design: designForTemplate(nextTemplate) }));
    setReplayKey((key) => key + 1);
  };

  // Preview updates on every state change; only network/service persistence waits for 500ms.
  useEffect(() => {
    if (!hasEdited.current) return;
    let active = true;
    const snapshot = draft;
    const timer = window.setTimeout(() => {
      setSaveState('saving');
      const operation = saveQueue.current
        .catch(() => undefined)
        .then(() => saveCallbackRef.current(snapshot));
      saveQueue.current = operation;
      operation.then(() => {
        if (active) setSaveState('saved');
      }).catch(() => {
        if (active) setSaveState('error');
      });
    }, 500);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [draft]);

  const sharePreview = async () => {
    if (!onGeneratePrivatePreviewLink) {
      setNotice('Private preview links are not configured yet. Do not share a public draft URL.');
      return;
    }
    if (saveState !== 'saved') {
      setNotice('Save the latest changes before generating a preview link.');
      return;
    }
    try {
      const url = await onGeneratePrivatePreviewLink();
      await navigator.clipboard.writeText(url);
      setNotice('Private preview link copied.');
    } catch {
      setNotice('Could not create or copy the private preview link. Check the share service and browser clipboard permissions.');
    }
  };

  const sectionDefaults = getDefaultInvitationSections(activeTemplate.category);
  const activeSections = (draft.design.visibleSections || sectionDefaults).filter((key) => sectionDefaults.includes(key));
  const sectionOrder = (draft.design.sectionOrder || sectionDefaults).filter((key) => activeSections.includes(key));
  const sectionRows = [...sectionOrder, ...sectionDefaults.filter((key) => !activeSections.includes(key))];
  const resolvedGuestName = guest?.label || 'Guest';
  const palette = { ...activeTemplate.palette, ...(draft.design.palette || {}) };

  return (
    <div className="kd-studio kd-app-surface">
      <header className="kd-studio__header">
        <div className="kd-studio__header-copy">
          <div className="kd-kicker">Kadi invitation studio</div>
          <h1 className="kd-page-title">Make it yours.</h1>
          <p className="kd-muted kd-studio__subheading">Edit on the left. Your guest sees the result on the right.</p>
        </div>
        <div className="kd-studio__header-actions">
          <span className="kd-status" data-state={saveState} role="status" aria-live="polite">
            <span className="kd-status__dot" />
            {saveState === 'ready' ? 'Draft ready' : saveState === 'unsaved' ? 'Unsaved changes' : saveState === 'saving' ? 'Saving changes…' : saveState === 'saved' ? 'All changes saved' : 'Could not save'}
          </span>
        </div>
      </header>

      <div className="kd-studio__body">
        <aside className="kd-studio__controls" aria-label="Invitation controls">
          <details className="kd-studio__accordion" open>
            <summary>Event details</summary>
            <div className="kd-studio__fields">
              <label className="kd-field"><span className="kd-label">Template</span>
                <select className="kd-select" value={templateId} onChange={(event) => selectTemplate(event.target.value)}>
                  {templates.map((item) => <option key={item.id} value={item.id}>{item.name} · {item.category}</option>)}
                </select>
              </label>
              <label className="kd-field"><span className="kd-label">Invitation title</span><input className="kd-input" value={draft.values.title} onChange={(event) => patchValue('title', event.target.value)} /></label>
              <label className="kd-field"><span className="kd-label">Host name(s)</span><input className="kd-input" value={draft.values.hosts} onChange={(event) => patchValue('hosts', event.target.value)} /></label>
              <label className="kd-field"><span className="kd-label">Celebrant / honouree</span><input className="kd-input" value={draft.values.celebrants} onChange={(event) => patchValue('celebrants', event.target.value)} /></label>
              <div className="kd-studio__field-row">
                <label className="kd-field"><span className="kd-label">Date</span><input className="kd-input" value={draft.values.date} onChange={(event) => patchValue('date', event.target.value)} placeholder="12 Dec 2026" /></label>
                <label className="kd-field"><span className="kd-label">Time</span><input className="kd-input" value={draft.values.time} onChange={(event) => patchValue('time', event.target.value)} placeholder="2:00 PM" /></label>
              </div>
              <label className="kd-field"><span className="kd-label">Venue</span><input className="kd-input" value={draft.values.venue} onChange={(event) => patchValue('venue', event.target.value)} /></label>
              <label className="kd-field"><span className="kd-label">City / area</span><input className="kd-input" value={draft.values.city} onChange={(event) => patchValue('city', event.target.value)} /></label>
              <label className="kd-field"><span className="kd-label">Hero image URL</span><input className="kd-input" value={draft.values.heroImage} onChange={(event) => patchValue('heroImage', event.target.value)} /></label>
              <label className="kd-field"><span className="kd-label">RSVP deadline</span><input className="kd-input" value={draft.values.rsvpDeadline || ''} onChange={(event) => patchValue('rsvpDeadline', event.target.value)} placeholder="1 Dec 2026" /></label>
              <label className="kd-field"><span className="kd-label">Dress code</span><input className="kd-input" value={draft.values.dressCode || ''} onChange={(event) => patchValue('dressCode', event.target.value)} placeholder="Optional" /></label>
            </div>
          </details>

          <details className="kd-studio__accordion" open>
            <summary>Design</summary>
            <div className="kd-studio__fields">
              <label className="kd-field"><span className="kd-label">Heading typeface</span>
                <select className="kd-select" value={draft.design.fontFamily || 'Inter'} onChange={(event) => patchDesign({ fontFamily: event.target.value })}>
                  {FONT_OPTIONS.map((font) => <option key={font.value} value={font.value}>{font.label}</option>)}
                </select>
              </label>
              <div className="kd-studio__field-row kd-studio__field-row--colors">
                <label className="kd-field"><span className="kd-label">Primary</span><input className="kd-color-input" aria-label="Primary colour" type="color" value={palette.primary} onChange={(event) => patchPalette('primary', event.target.value)} /></label>
                <label className="kd-field"><span className="kd-label">Envelope</span><input className="kd-color-input" aria-label="Envelope colour" type="color" value={palette.envelope} onChange={(event) => patchPalette('envelope', event.target.value)} /></label>
                <label className="kd-field"><span className="kd-label">Flap</span><input className="kd-color-input" aria-label="Envelope flap colour" type="color" value={palette.flap} onChange={(event) => patchPalette('flap', event.target.value)} /></label>
                <label className="kd-field"><span className="kd-label">Paper</span><input className="kd-color-input" aria-label="Letter paper colour" type="color" value={palette.cardBackground} onChange={(event) => patchPalette('cardBackground', event.target.value)} /></label>
              </div>
              <label className="kd-field"><span className="kd-label">Envelope construction</span>
                <select className="kd-select" value={draft.design.envelopeStyle || 'classic-fold'} onChange={(event) => patchDesign({ envelopeStyle: event.target.value as EventDesignEntity['envelopeStyle'] })}>
                  {ENVELOPE_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <label className="kd-field"><span className="kd-label">Letter format</span>
                <select className="kd-select" value={draft.design.letterStyle || 'printed-letter'} onChange={(event) => patchDesign({ letterStyle: event.target.value as EventDesignEntity['letterStyle'] })}>
                  {LETTER_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </label>
              <div className="kd-studio__field-row kd-studio__field-row--colors">
                <label className="kd-field"><span className="kd-label">Wax colour</span><input className="kd-color-input" aria-label="Wax seal colour" type="color" value={draft.design.sealColor || activeTemplate.seal.color} onChange={(event) => patchDesign({ sealColor: event.target.value })} /></label>
                <label className="kd-field"><span className="kd-label">Seal initials</span><input maxLength={3} className="kd-input" value={draft.design.sealMonogram || 'K'} onChange={(event) => patchDesign({ sealMonogram: event.target.value.toUpperCase() })} /></label>
              </div>
            </div>
          </details>

          <details className="kd-studio__accordion">
            <summary>Invitation sections</summary>
            <p className="kd-help">Turn sections on or off and reorder them. Available sections depend on the event type.</p>
            <div className="kd-studio__section-list">
              {sectionRows.map((section) => {
                const isActive = activeSections.includes(section);
                const index = sectionOrder.indexOf(section);
                return (
                  <div className={`kd-studio__section-row ${isActive ? '' : 'is-inactive'}`} key={section}>
                    <label className="kd-studio__section-label"><input type="checkbox" checked={isActive} onChange={(event) => toggleSection(section, event.target.checked)} /><span>{section.replace(/-/g, ' ').replace(/^./, (match) => match.toUpperCase())}</span></label>
                    {isActive && <span className="kd-studio__section-reorder">
                      <button type="button" className="kd-icon-button" disabled={index === 0} onClick={() => moveSection(section, -1)} aria-label={`Move ${section} up`}><ChevronUp size={15} /></button>
                      <button type="button" className="kd-icon-button" disabled={index === sectionOrder.length - 1} onClick={() => moveSection(section, 1)} aria-label={`Move ${section} down`}><ChevronDown size={15} /></button>
                    </span>}
                  </div>
                );
              })}
            </div>
          </details>

          <details className="kd-studio__accordion">
            <summary>Animations</summary>
            <div className="kd-studio__fields">
              <label className="kd-field"><span className="kd-label">Background animation</span>
                <select className="kd-select" value={draft.design.backgroundAnimation || 'none'} onChange={(event) => patchDesign({ backgroundAnimation: event.target.value as EventDesignEntity['backgroundAnimation'] })}>
                  <option value="none">None</option><option value="petals">Floating petals</option><option value="confetti">Confetti</option><option value="bokeh">Soft bokeh</option><option value="leaves">Falling leaves</option><option value="snow">Snow</option><option value="candles">Candle flicker</option>
                </select>
              </label>
              <label className="kd-field"><span className="kd-label">Scroll motion</span>
                <select className="kd-select" value={draft.design.scrollAnimation || 'fade-up'} onChange={(event) => patchDesign({ scrollAnimation: event.target.value as EventDesignEntity['scrollAnimation'] })}>
                  <option value="none">None</option><option value="fade-up">Fade up</option><option value="slide-in">Slide in</option><option value="scale-in">Scale in</option><option value="parallax">Parallax</option>
                </select>
              </label>
              <label className="kd-field"><span className="kd-label">Transition speed</span>
                <select className="kd-select" value={draft.design.transitionSpeed || 'medium'} onChange={(event) => patchDesign({ transitionSpeed: event.target.value as EventDesignEntity['transitionSpeed'] })}>
                  <option value="slow">Slow</option><option value="medium">Medium</option><option value="fast">Fast</option>
                </select>
              </label>
            </div>
          </details>
        </aside>

        <section className="kd-studio__preview-column" aria-label="Live guest preview">
          <div className="kd-studio__preview-toolbar">
            <label className="kd-field kd-studio__guest-picker"><span className="kd-label">Preview as guest</span>
              <select className="kd-select" value={guestId} onChange={(event) => setGuestId(event.target.value)}>
                {guests.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
              </select>
            </label>
            <div className="kd-studio__toolbar-buttons">
              <button className="kd-button kd-button--small" type="button" onClick={() => setReplayKey((key) => key + 1)}><RotateCcw size={14} /> Restart</button>
              <button className="kd-button kd-button--small" type="button" onClick={sharePreview} disabled={saveState === 'saving' || saveState === 'unsaved'}><Copy size={14} /> Share preview</button>
            </div>
          </div>

          <div className="kd-studio__device-switch" role="group" aria-label="Preview device">
            <button type="button" className={device === 'iphone' ? 'is-active' : ''} aria-pressed={device === 'iphone'} onClick={() => setDevice('iphone')}><Smartphone size={15} /> iPhone</button>
            <button type="button" className={device === 'android' ? 'is-active' : ''} aria-pressed={device === 'android'} onClick={() => setDevice('android')}><Smartphone size={15} /> Android</button>
            <button type="button" className={device === 'desktop' ? 'is-active' : ''} aria-pressed={device === 'desktop'} onClick={() => setDevice('desktop')}><Monitor size={15} /> Desktop</button>
          </div>

          <div className="kd-studio__stage">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={device}
                className={`kd-studio__device kd-studio__device--${device}`}
                initial={reducedMotion ? false : { opacity: 0, y: 8, scale: .99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={reducedMotion ? undefined : { opacity: 0, y: -4, scale: .995 }}
                transition={{ duration: reducedMotion ? 0 : .24, ease: [.32, .72, 0, 1] }}
              >
                <div className="kd-studio__viewport">
                  <DraftInvitationPreview
                    template={activeTemplate}
                    values={draft.values}
                    design={{ ...draft.design, visibleSections: activeSections, sectionOrder }}
                    guestName={resolvedGuestName}
                    restartKey={replayKey}
                  />
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {notice && (
              <motion.div className="kd-studio__notice" role="status" initial={reducedMotion ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {notice.startsWith('Private preview link copied') ? <Check size={15} /> : <AlertCircle size={15} />}
                <span>{notice}</span>
                <button type="button" onClick={() => setNotice('')} aria-label="Dismiss message">×</button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
