'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  BringToFront,
  SendToBack,
  Copy,
  Trash2,
  Lock,
  Unlock,
  Sparkles,
  Crop,
  Layers,
  ChevronDown,
  RefreshCw,
  Type,
  Plus,
  Minus,
} from 'lucide-react';
import type { CanvasElement, CanvasElementStyle, AnimationEffect, MaskShape } from '@/types/canvas';

interface ContextualElementToolbarProps {
  element: CanvasElement;
  zoom: number;
  onUpdateStyle: (style: Partial<CanvasElementStyle>) => void;
  onUpdateContent?: (content: string) => void;
  onUpdateAnimation: (anim: { effect: AnimationEffect; duration?: number }) => void;
  onBringForward: () => void;
  onSendBackward: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onToggleLock: () => void;
  onRequestReplace?: () => void;
  className?: string;
}

const FONT_FAMILIES = [
  'Playfair Display',
  'Cormorant Garamond',
  'Inter',
  'DM Sans',
];

const PRESET_COLORS = [
  '#272620',
  '#934638',
  '#B99A62',
  '#A94F51',
  '#4A6B53',
  '#1D4ED8',
  '#FAF8F5',
  '#FFFFFF',
];

const ANIMATION_EFFECTS: { id: AnimationEffect; label: string }[] = [
  { id: 'none', label: 'None' },
  { id: 'fadeIn', label: 'Fade In' },
  { id: 'rise', label: 'Soft Rise' },
  { id: 'gentleScale', label: 'Gentle Scale' },
  { id: 'drift', label: 'Drift & Float' },
  { id: 'sway', label: 'Sway' },
  { id: 'sparkle', label: 'Sparkle Shimmer' },
];

const MASK_SHAPES: { id: MaskShape; label: string }[] = [
  { id: 'none', label: 'Square / Full' },
  { id: 'rounded', label: 'Soft Rounded' },
  { id: 'oval', label: 'Portrait Oval' },
  { id: 'circle', label: 'Classic Circle' },
];

export function ContextualElementToolbar({
  element,
  zoom,
  onUpdateStyle,
  onUpdateContent,
  onUpdateAnimation,
  onBringForward,
  onSendBackward,
  onDuplicate,
  onDelete,
  onToggleLock,
  onRequestReplace,
  className,
}: ContextualElementToolbarProps) {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showAnimPicker, setShowAnimPicker] = useState(false);
  const [showMaskPicker, setShowMaskPicker] = useState(false);

  // Close popovers if clicking outside or switching element
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (toolbarRef.current && !toolbarRef.current.contains(e.target as Node)) {
        setShowColorPicker(false);
        setShowAnimPicker(false);
        setShowMaskPicker(false);
      }
    }
    window.addEventListener('mousedown', handleClickOutside);
    return () => window.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setShowColorPicker(false);
    setShowAnimPicker(false);
    setShowMaskPicker(false);
  }, [element.id]);

  const style = element.styleProps || {};
  const isText = element.type === 'text';
  const isPhoto = element.type === 'photo';
  const isSticker = element.type === 'sticker';
  const isLocked = !!element.isLocked;

  // Font size handler
  const currentFontSize = style.fontSize || 16;
  const setFontSize = (size: number) => {
    onUpdateStyle({ fontSize: Math.max(8, Math.min(120, size)) });
  };

  return (
    <div
      ref={toolbarRef}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className={`relative bg-[#1D1D1F] text-white rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.65)] border border-white/20 px-2.5 py-1.5 flex items-center gap-1 text-xs select-none backdrop-blur-md whitespace-nowrap animate-in fade-in zoom-in-95 duration-100 z-50 ${className || ''}`}
    >
      {/* ── TEXT SPECIFIC CONTROLS ───────────────────────────────────── */}
      {isText && !isLocked && (
        <>
          {/* Font Family Dropdown */}
          <select
            value={style.fontFamily || 'Inter'}
            onChange={(e) => onUpdateStyle({ fontFamily: e.target.value })}
            className="bg-white/10 hover:bg-white/20 text-white rounded-md px-2 py-1 text-xs border border-white/10 focus:outline-none focus:border-[#B99A62] cursor-pointer max-w-[120px] truncate"
          >
            {FONT_FAMILIES.map((font) => (
              <option key={font} value={font} className="bg-[#1D1D1F] text-white">
                {font}
              </option>
            ))}
          </select>

          {/* Font Size Stepper */}
          <div className="flex items-center bg-white/10 rounded-md border border-white/10 px-1 py-0.5">
            <button
              type="button"
              onClick={() => setFontSize(currentFontSize - 2)}
              className="p-1 hover:text-amber-300 text-white/80"
              title="Decrease size"
            >
              <Minus size={11} />
            </button>
            <span className="w-6 text-center font-mono text-[11px] font-semibold">
              {currentFontSize}
            </span>
            <button
              type="button"
              onClick={() => setFontSize(currentFontSize + 2)}
              className="p-1 hover:text-amber-300 text-white/80"
              title="Increase size"
            >
              <Plus size={11} />
            </button>
          </div>

          <div className="w-[1px] h-4 bg-white/15 mx-0.5" />

          {/* Bold, Italic, Underline */}
          <button
            type="button"
            onClick={() =>
              onUpdateStyle({
                fontWeight: style.fontWeight === '700' || style.fontWeight === 700 ? '400' : '700',
              })
            }
            className={`p-1.5 rounded hover:bg-white/20 ${
              style.fontWeight === '700' || style.fontWeight === 700
                ? 'bg-[#B99A62] text-[#112327] font-bold'
                : 'text-white/80'
            }`}
            title="Bold"
          >
            <Bold size={13} />
          </button>

          <button
            type="button"
            onClick={() =>
              onUpdateStyle({
                fontStyle: style.fontStyle === 'italic' ? 'normal' : 'italic',
              })
            }
            className={`p-1.5 rounded hover:bg-white/20 ${
              style.fontStyle === 'italic'
                ? 'bg-[#B99A62] text-[#112327]'
                : 'text-white/80'
            }`}
            title="Italic"
          >
            <Italic size={13} />
          </button>

          {/* Alignment */}
          <button
            type="button"
            onClick={() => {
              const nextAlign =
                style.textAlign === 'center'
                  ? 'right'
                  : style.textAlign === 'right'
                  ? 'left'
                  : 'center';
              onUpdateStyle({ textAlign: nextAlign });
            }}
            className="p-1.5 rounded hover:bg-white/20 text-white/80"
            title={`Align (${style.textAlign || 'center'})`}
          >
            {style.textAlign === 'left' ? (
              <AlignLeft size={13} />
            ) : style.textAlign === 'right' ? (
              <AlignRight size={13} />
            ) : (
              <AlignCenter size={13} />
            )}
          </button>

          {/* Color Picker Popover */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowColorPicker(!showColorPicker)}
              className="p-1.5 rounded hover:bg-white/20 flex items-center gap-1"
              title="Text color"
            >
              <div
                className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-xs"
                style={{ backgroundColor: style.color || '#272620' }}
              />
            </button>
            {showColorPicker && (
              <div className="absolute top-full left-0 mt-2 bg-[#262626] border border-white/20 p-2 rounded-lg shadow-xl grid grid-cols-4 gap-1.5 z-50">
                {PRESET_COLORS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      onUpdateStyle({ color: c });
                      setShowColorPicker(false);
                    }}
                    className="w-5 h-5 rounded-full border border-white/30 hover:scale-110 transition-transform"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="w-[1px] h-4 bg-white/15 mx-0.5" />
        </>
      )}

      {/* ── STICKER & PHOTO SPECIFIC CONTROLS ─────────────────────────── */}
      {(isSticker || isPhoto) && !isLocked && (
        <>
          {onRequestReplace && (
            <button
              type="button"
              onClick={onRequestReplace}
              className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 text-[11px]"
              title="Replace element"
            >
              <RefreshCw size={11} />
              <span>Replace</span>
            </button>
          )}

          {/* Mask Shape for Photo */}
          {isPhoto && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowMaskPicker(!showMaskPicker)}
                className="px-2 py-1 rounded bg-white/10 hover:bg-white/20 text-white flex items-center gap-1 text-[11px]"
                title="Photo Mask Shape"
              >
                <Crop size={11} />
                <span>Mask</span>
                <ChevronDown size={10} />
              </button>

              {showMaskPicker && (
                <div className="absolute top-full left-0 mt-2 bg-[#262626] border border-white/20 p-1.5 rounded-lg shadow-xl flex flex-col gap-1 z-50">
                  {MASK_SHAPES.map((mask) => (
                    <button
                      key={mask.id}
                      type="button"
                      onClick={() => {
                        onUpdateStyle({ maskShape: mask.id });
                        setShowMaskPicker(false);
                      }}
                      className={`px-3 py-1 text-left text-xs rounded hover:bg-white/15 ${
                        style.maskShape === mask.id ? 'text-[#B99A62] font-semibold' : 'text-white'
                      }`}
                    >
                      {mask.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="w-[1px] h-4 bg-white/15 mx-0.5" />
        </>
      )}

      {/* ── COMMON ACTIONS: ANIMATE, ARRANGE, LOCK, DUPLICATE, DELETE ─── */}
      {!isLocked && (
        <>
          {/* Animate Picker */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowAnimPicker(!showAnimPicker)}
              className={`p-1.5 rounded hover:bg-white/20 flex items-center gap-1 ${
                element.animation && element.animation.effect !== 'none'
                  ? 'text-[#F59E0B] font-medium'
                  : 'text-white/80'
              }`}
              title="Set entrance animation"
            >
              <Sparkles size={13} />
              <span className="text-[11px] hidden sm:inline">Animate</span>
            </button>

            {showAnimPicker && (
              <div className="absolute top-full left-0 mt-2 bg-[#262626] border border-white/20 p-1.5 rounded-lg shadow-xl flex flex-col gap-1 z-50 min-w-[130px]">
                {ANIMATION_EFFECTS.map((eff) => (
                  <button
                    key={eff.id}
                    type="button"
                    onClick={() => {
                      onUpdateAnimation({ effect: eff.id, duration: 1.0 });
                      setShowAnimPicker(false);
                    }}
                    className={`px-2.5 py-1 text-left text-xs rounded hover:bg-white/15 ${
                      element.animation?.effect === eff.id
                        ? 'text-[#F59E0B] font-semibold'
                        : 'text-white'
                    }`}
                  >
                    {eff.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Layer Controls */}
          <button
            type="button"
            onClick={onBringForward}
            className="p-1.5 rounded hover:bg-white/20 text-white/80"
            title="Bring Forward"
          >
            <BringToFront size={13} />
          </button>
          <button
            type="button"
            onClick={onSendBackward}
            className="p-1.5 rounded hover:bg-white/20 text-white/80"
            title="Send Backward"
          >
            <SendToBack size={13} />
          </button>

          {/* Duplicate */}
          <button
            type="button"
            onClick={onDuplicate}
            className="p-1.5 rounded hover:bg-white/20 text-white/80"
            title="Duplicate (Ctrl+D)"
          >
            <Copy size={13} />
          </button>
        </>
      )}

      {/* Lock / Unlock */}
      <button
        type="button"
        onClick={onToggleLock}
        className={`p-1.5 rounded hover:bg-white/20 ${
          isLocked ? 'bg-amber-500 text-white' : 'text-white/80'
        }`}
        title={isLocked ? 'Unlock element' : 'Lock element position'}
      >
        {isLocked ? <Lock size={13} /> : <Unlock size={13} />}
      </button>

      {/* Delete */}
      {!isLocked && (
        <button
          type="button"
          onClick={onDelete}
          className="p-1.5 rounded hover:bg-red-500/30 text-red-400 hover:text-red-200 transition-colors"
          title="Delete (Backspace/Delete)"
        >
          <Trash2 size={13} />
        </button>
      )}
    </div>
  );
}
