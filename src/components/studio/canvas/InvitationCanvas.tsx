'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Move,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  RotateCw,
} from 'lucide-react';
import type {
  CanvasElement,
  CanvasElementStyle,
  AnimationEffect,
} from '@/types/canvas';
import type { DraftInvitationValues } from '@/components/invitations/DraftInvitationPreview';
import type { EventDesignEntity } from '@/lib/db/types';
import type { TemplateDefinition } from '@/lib/templates/types';
import { SelectionTransformOverlay } from './SelectionTransformOverlay';
import { ContextualElementToolbar } from './ContextualElementToolbar';
import { StationerySectionCards } from './StationerySectionCards';

interface InvitationCanvasProps {
  elements: CanvasElement[];
  selectedId: string | null;
  onSelectId: (id: string | null) => void;
  onUpdateElement: (id: string, updates: Partial<CanvasElement>) => void;
  onDuplicateElement: (id: string) => void;
  onDeleteElement: (id: string) => void;
  onBringForward: (id: string) => void;
  onSendBackward: (id: string) => void;
  onToggleLock: (id: string) => void;
  cardBackground: string;
  palette: {
    primary: string;
    secondary: string;
    text: string;
    cardBackground: string;
  };
  onRequestReplace?: (id: string) => void;
  values?: DraftInvitationValues;
  design?: Partial<EventDesignEntity>;
  category?: string;
  template?: TemplateDefinition;
  onUpdateValues?: <K extends keyof DraftInvitationValues>(key: K, value: DraftInvitationValues[K]) => void;
  onUpdateDesign?: (patch: Partial<EventDesignEntity>) => void;
  onOpenPhotoRail?: () => void;
  onOpenStickerRail?: () => void;
}

const ARTBOARD_WIDTH = 480;
const ARTBOARD_HEIGHT = 680;

export function InvitationCanvas({
  elements,
  selectedId,
  onSelectId,
  onUpdateElement,
  onDuplicateElement,
  onDeleteElement,
  onBringForward,
  onSendBackward,
  onToggleLock,
  cardBackground,
  palette,
  onRequestReplace,
  values,
  design,
  category,
  template,
  onUpdateValues,
  onUpdateDesign,
  onOpenPhotoRail,
  onOpenStickerRail,
}: InvitationCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const artboardRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(1);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [editingTextId, setEditingTextId] = useState<string | null>(null);

  // Active transform state: dragging, resizing, rotating
  const activeTransform = useRef<{
    type: 'drag' | 'resize' | 'rotate' | null;
    elementId: string | null;
    startX: number;
    startY: number;
    startElemX: number;
    startElemY: number;
    startElemW: number;
    startElemH: number;
    startRotation: number;
    resizeCorner?: 'tl' | 'tr' | 'bl' | 'br';
    centerX?: number;
    centerY?: number;
  }>({
    type: null,
    elementId: null,
    startX: 0,
    startY: 0,
    startElemX: 0,
    startElemY: 0,
    startElemW: 0,
    startElemH: 0,
    startRotation: 0,
  });

  const selectedElement = elements.find((e) => e.id === selectedId);

  // Auto-fit zoom on mount or resize
  const fitZoom = useCallback(() => {
    if (!containerRef.current) return;
    const { clientWidth, clientHeight } = containerRef.current;
    const padding = 48;
    const availableW = clientWidth - padding;
    const availableH = clientHeight - padding;
    const scale = Math.min(
      availableW / ARTBOARD_WIDTH,
      availableH / ARTBOARD_HEIGHT,
      1.1
    );
    setZoom(Math.max(0.4, Math.min(1.5, scale)));
  }, []);

  useEffect(() => {
    fitZoom();
    window.addEventListener('resize', fitZoom);
    return () => window.removeEventListener('resize', fitZoom);
  }, [fitZoom]);

  // Keyboard navigation & Shortcuts (§5.3):
  // Nudge arrows (WCAG 2.2 SC 2.5.7), Delete, Duplicate (Ctrl+D), Deselect (Esc)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // If user is actively typing in an input or text edit mode, ignore shortcuts
      if (
        editingTextId ||
        ['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)
      ) {
        return;
      }

      if (!selectedElement) return;

      const isShift = e.shiftKey;
      const step = isShift ? 10 : 1;

      if (e.key === 'Escape') {
        e.preventDefault();
        onSelectId(null);
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        if (!selectedElement.isLocked) {
          e.preventDefault();
          onDeleteElement(selectedElement.id);
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        onDuplicateElement(selectedElement.id);
      } else if (e.key === 'ArrowLeft') {
        if (!selectedElement.isLocked) {
          e.preventDefault();
          onUpdateElement(selectedElement.id, { x: selectedElement.x - step });
        }
      } else if (e.key === 'ArrowRight') {
        if (!selectedElement.isLocked) {
          e.preventDefault();
          onUpdateElement(selectedElement.id, { x: selectedElement.x + step });
        }
      } else if (e.key === 'ArrowUp') {
        if (!selectedElement.isLocked) {
          e.preventDefault();
          onUpdateElement(selectedElement.id, { y: selectedElement.y - step });
        }
      } else if (e.key === 'ArrowDown') {
        if (!selectedElement.isLocked) {
          e.preventDefault();
          onUpdateElement(selectedElement.id, { y: selectedElement.y + step });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    selectedElement,
    editingTextId,
    onSelectId,
    onDeleteElement,
    onDuplicateElement,
    onUpdateElement,
  ]);

  // Pointer move & up handlers for Drag, Resize, and Rotate
  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      const transform = activeTransform.current;
      if (!transform.type || !transform.elementId) return;

      const elem = elements.find((el) => el.id === transform.elementId);
      if (!elem || elem.isLocked) return;

      const deltaX = (e.clientX - transform.startX) / zoom;
      const deltaY = (e.clientY - transform.startY) / zoom;

      if (transform.type === 'drag') {
        onUpdateElement(elem.id, {
          x: Math.round(transform.startElemX + deltaX),
          y: Math.round(transform.startElemY + deltaY),
        });
      } else if (transform.type === 'resize') {
        const corner = transform.resizeCorner || 'br';
        let newW = transform.startElemW;
        let newH = transform.startElemH;
        let newX = transform.startElemX;
        let newY = transform.startElemY;

        // Aspect ratio preservation for stickers/photos
        const isAspectLocked = elem.type === 'sticker' || elem.type === 'photo';
        const ratio = transform.startElemW / transform.startElemH;

        if (corner === 'br') {
          newW = Math.max(30, transform.startElemW + deltaX);
          newH = isAspectLocked ? newW / ratio : Math.max(20, transform.startElemH + deltaY);
        } else if (corner === 'bl') {
          newW = Math.max(30, transform.startElemW - deltaX);
          newH = isAspectLocked ? newW / ratio : Math.max(20, transform.startElemH + deltaY);
          newX = transform.startElemX + (transform.startElemW - newW);
        } else if (corner === 'tr') {
          newW = Math.max(30, transform.startElemW + deltaX);
          newH = isAspectLocked ? newW / ratio : Math.max(20, transform.startElemH - deltaY);
          newY = transform.startElemY + (transform.startElemH - newH);
        } else if (corner === 'tl') {
          newW = Math.max(30, transform.startElemW - deltaX);
          newH = isAspectLocked ? newW / ratio : Math.max(20, transform.startElemH - deltaY);
          newX = transform.startElemX + (transform.startElemW - newW);
          newY = transform.startElemY + (transform.startElemH - newH);
        }

        onUpdateElement(elem.id, {
          x: Math.round(newX),
          y: Math.round(newY),
          width: Math.round(newW),
          height: Math.round(newH),
        });
      } else if (transform.type === 'rotate') {
        if (transform.centerX !== undefined && transform.centerY !== undefined) {
          const currentAngle =
            Math.atan2(e.clientY - transform.centerY, e.clientX - transform.centerX) *
            (180 / Math.PI);
          const startAngle =
            Math.atan2(
              transform.startY - transform.centerY,
              transform.startX - transform.centerX
            ) * (180 / Math.PI);
          let newRotation = transform.startRotation + (currentAngle - startAngle);
          // Snap near 0, 90, 180, 270 degrees
          if (Math.abs(newRotation % 90) < 3) {
            newRotation = Math.round(newRotation / 90) * 90;
          }
          onUpdateElement(elem.id, { rotation: Math.round(newRotation) });
        }
      }
    },
    [elements, zoom, onUpdateElement]
  );

  const handlePointerUp = useCallback(() => {
    activeTransform.current.type = null;
    activeTransform.current.elementId = null;
    window.removeEventListener('pointermove', handlePointerMove);
    window.removeEventListener('pointerup', handlePointerUp);
  }, [handlePointerMove]);

  const startDrag = (e: React.PointerEvent, element: CanvasElement) => {
    e.stopPropagation();
    if (element.isLocked) return;

    activeTransform.current = {
      type: 'drag',
      elementId: element.id,
      startX: e.clientX,
      startY: e.clientY,
      startElemX: element.x,
      startElemY: element.y,
      startElemW: element.width,
      startElemH: element.height,
      startRotation: element.rotation,
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const startResize = (
    e: React.PointerEvent,
    element: CanvasElement,
    corner: 'tl' | 'tr' | 'bl' | 'br'
  ) => {
    e.stopPropagation();
    if (element.isLocked) return;

    activeTransform.current = {
      type: 'resize',
      elementId: element.id,
      startX: e.clientX,
      startY: e.clientY,
      startElemX: element.x,
      startElemY: element.y,
      startElemW: element.width,
      startElemH: element.height,
      startRotation: element.rotation,
      resizeCorner: corner,
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  const startRotate = (e: React.PointerEvent, element: CanvasElement) => {
    e.stopPropagation();
    if (element.isLocked) return;

    // Calculate center in client coordinates
    const artboardRect = (artboardRef.current || containerRef.current)?.getBoundingClientRect();
    if (!artboardRect) return;

    const elemCenterX = artboardRect.left + (element.x + element.width / 2) * zoom;
    const elemCenterY = artboardRect.top + (element.y + element.height / 2) * zoom;

    activeTransform.current = {
      type: 'rotate',
      elementId: element.id,
      startX: e.clientX,
      startY: e.clientY,
      startElemX: element.x,
      startElemY: element.y,
      startElemW: element.width,
      startElemH: element.height,
      startRotation: element.rotation,
      centerX: elemCenterX,
      centerY: elemCenterY,
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  return (
    <div
      ref={containerRef}
      onClick={() => {
        onSelectId(null);
        setEditingTextId(null);
      }}
      className="relative flex-1 w-full h-full bg-[#18181A] overflow-y-auto overflow-x-hidden p-6 sm:p-10 select-none scroll-smooth"
      style={{
        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)`,
        backgroundSize: '24px 24px',
      }}
    >
      {/* Zoom Control Toolbar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="fixed bottom-6 right-6 z-50 bg-[#262626] border border-white/10 rounded-full px-3 py-1.5 flex items-center gap-2 shadow-2xl text-white text-xs"
      >
        <button
          onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.1).toFixed(1))))}
          className="p-1 hover:text-amber-400"
          title="Zoom Out"
        >
          <ZoomOut size={13} />
        </button>
        <span className="w-12 text-center font-mono text-[11px] font-medium">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom((z) => Math.min(1.6, Number((z + 0.1).toFixed(1))))}
          className="p-1 hover:text-amber-400"
          title="Zoom In"
        >
          <ZoomIn size={13} />
        </button>
        <div className="w-[1px] h-3 bg-white/20 mx-0.5" />
        <button
          onClick={fitZoom}
          className="p-1 hover:text-amber-400 flex items-center gap-1 text-[11px]"
          title="Fit to screen"
        >
          <Maximize2 size={12} />
          <span>Fit</span>
        </button>
      </div>

      {/* ── CONTINUOUS SCROLLABLE DOCUMENT CONTAINER ────────────────────────── */}
      <div
        className="w-full flex flex-col items-center min-h-full pb-36"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
        }}
      >
        {/* ── THE PORTRAIT INVITATION ARTBOARD (480 x 680) ──────────────────── */}
        <div
          ref={artboardRef}
          onClick={(e) => {
            // If clicked directly on the artboard background, deselect
            if (e.target === e.currentTarget) {
              onSelectId(null);
              setEditingTextId(null);
            }
          }}
          className="relative shadow-[0_24px_70px_rgba(0,0,0,0.85)] rounded-2xl transition-transform duration-75 shrink-0"
          style={{
            width: ARTBOARD_WIDTH,
            height: ARTBOARD_HEIGHT,
            backgroundColor: cardBackground || palette.cardBackground || '#FCFAF7',
            color: palette.text || '#272620',
          }}
        >
        {/* Subtle Paper Linen texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035] rounded-2xl overflow-hidden"
          style={{
            backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
            backgroundSize: '8px 8px',
          }}
        />

        {/* Inner Border Frame */}
        <div className="absolute inset-3 border border-black/[0.08] pointer-events-none rounded-xl" />

        {/* ── CANVAS ELEMENTS ────────────────────────────────────────────── */}
        {elements
          .slice()
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((elem) => {
            const isSelected = selectedId === elem.id;
            const isHovered = hoveredId === elem.id;
            const isEditing = editingTextId === elem.id;
            const style = elem.styleProps || {};

            return (
              <div
                key={elem.id}
                id={`canvas-elem-${elem.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectId(elem.id);
                }}
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  if (elem.type === 'text') {
                    setEditingTextId(elem.id);
                  }
                }}
                onMouseEnter={() => setHoveredId(elem.id)}
                onMouseLeave={() => setHoveredId(null)}
                className={`absolute select-none group transition-opacity duration-150 ${
                  isSelected ? 'z-40' : ''
                }`}
                style={{
                  left: elem.x,
                  top: elem.y,
                  width: elem.width,
                  height: elem.height,
                  transform: `rotate(${elem.rotation}deg)`,
                  zIndex: isSelected ? 999 : elem.zIndex,
                  opacity: elem.opacity ?? 1,
                  cursor: elem.isLocked ? 'default' : 'move',
                }}
              >
                {/* ── 1. TEXT ELEMENT ──────────────────────────────────────── */}
                {elem.type === 'text' && (
                  <div
                    className="w-full h-full flex items-center justify-center relative p-1"
                    style={{
                      fontFamily: style.fontFamily || 'Inter',
                      fontSize: style.fontSize || 16,
                      fontWeight: style.fontWeight || '400',
                      fontStyle: style.fontStyle || 'normal',
                      color: style.color || palette.text || '#272620',
                      textAlign: style.textAlign || 'center',
                      letterSpacing: style.letterSpacing
                        ? `${style.letterSpacing}px`
                        : undefined,
                      lineHeight: style.lineHeight || 1.3,
                    }}
                  >
                    {isEditing ? (
                      <textarea
                        autoFocus
                        value={elem.content}
                        onChange={(e) =>
                          onUpdateElement(elem.id, { content: e.target.value })
                        }
                        onBlur={() => setEditingTextId(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Escape') setEditingTextId(null);
                        }}
                        className="w-full h-full bg-white/80 text-black border border-blue-500 rounded p-1 resize-none focus:outline-none"
                      />
                    ) : (
                      <span className="w-full whitespace-pre-wrap select-none">
                        {elem.content}
                      </span>
                    )}
                  </div>
                )}

                {/* ── 2. STICKER ELEMENT (GENUINE TRANSPARENT CUTOUT SILHOUETTE) ─ */}
                {elem.type === 'sticker' && (
                  <div
                    className="w-full h-full pointer-events-none flex items-center justify-center overflow-visible"
                    dangerouslySetInnerHTML={{ __html: elem.content }}
                  />
                )}

                {/* ── 3. PHOTO ELEMENT (WITH NON-DESTRUCTIVE MASK SHAPES) ──── */}
                {elem.type === 'photo' && (
                  <div
                    className="w-full h-full overflow-hidden shadow-sm"
                    style={{
                      borderRadius:
                        style.maskShape === 'circle'
                          ? '9999px'
                          : style.maskShape === 'oval'
                          ? '50% / 40%'
                          : style.maskShape === 'rounded'
                          ? '20px'
                          : '0px',
                    }}
                  >
                    <img
                      src={elem.content}
                      alt={elem.name || 'User photo'}
                      className="w-full h-full object-cover pointer-events-none"
                    />
                  </div>
                )}

                {/* ── SELECTION OVERLAY & HANDLES (§5.3.1) ─────────────────── */}
                <SelectionTransformOverlay
                  element={elem}
                  zoom={zoom}
                  isSelected={isSelected}
                  isHovered={isHovered}
                  onStartDrag={(e) => startDrag(e, elem)}
                  onStartResize={(e, corner) => startResize(e, elem, corner)}
                  onStartRotate={(e) => startRotate(e, elem)}
                  onUnlock={() => onToggleLock(elem.id)}
                />
              </div>
            );
          })}

        {/* ── FLOATING CONTEXTUAL TOOLBAR (§5.2) ──────────────────── */}
        {selectedElement && (
          <div
            onClick={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            className="absolute pointer-events-auto transition-all duration-75"
            style={{
              left: ARTBOARD_WIDTH / 2,
              top: Math.max(-52, selectedElement.y - 56),
              transform: 'translateX(-50%)',
              zIndex: 1000,
            }}
          >
            <ContextualElementToolbar
              element={selectedElement}
              zoom={zoom}
              onUpdateStyle={(newStyle) =>
                onUpdateElement(selectedElement.id, {
                  styleProps: {
                    ...(selectedElement.styleProps || {}),
                    ...newStyle,
                  },
                })
              }
              onUpdateContent={(content) =>
                onUpdateElement(selectedElement.id, { content })
              }
              onUpdateAnimation={(anim) =>
                onUpdateElement(selectedElement.id, { animation: anim })
              }
              onBringForward={() => onBringForward(selectedElement.id)}
              onSendBackward={() => onSendBackward(selectedElement.id)}
              onDuplicate={() => onDuplicateElement(selectedElement.id)}
              onDelete={() => onDeleteElement(selectedElement.id)}
              onToggleLock={() => onToggleLock(selectedElement.id)}
              onRequestReplace={
                onRequestReplace ? () => onRequestReplace(selectedElement.id) : undefined
              }
            />
          </div>
        )}
      </div>

      {/* ── CONTINUOUS STATIONERY SECTIONS FLOW ─────────────────────────── */}
      {values && design && template && onUpdateValues && onUpdateDesign && (
        <StationerySectionCards
          values={values}
          design={design}
          category={category || template.category}
          template={template}
          cardBackground={cardBackground}
          palette={palette}
          onUpdateValues={onUpdateValues}
          onUpdateDesign={onUpdateDesign}
          onOpenPhotoRail={onOpenPhotoRail}
          onOpenStickerRail={onOpenStickerRail}
          onScrollToTop={() => {
            if (containerRef.current) {
              containerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
        />
      )}
    </div>
  </div>
);
}
