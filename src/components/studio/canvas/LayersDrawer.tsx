'use client';

import React from 'react';
import {
  Layers,
  X,
  Type,
  Sparkles,
  Image as ImageIcon,
  Lock,
  Unlock,
  ChevronUp,
  ChevronDown,
  Trash2,
  Eye,
  EyeOff,
} from 'lucide-react';
import type { CanvasElement } from '@/types/canvas';

interface LayersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  elements: CanvasElement[];
  selectedId: string | null;
  onSelectElement: (id: string) => void;
  onReorder: (id: string, direction: 'up' | 'down') => void;
  onToggleLock: (id: string) => void;
  onDelete: (id: string) => void;
}

export function LayersDrawer({
  isOpen,
  onClose,
  elements,
  selectedId,
  onSelectElement,
  onReorder,
  onToggleLock,
  onDelete,
}: LayersDrawerProps) {
  if (!isOpen) return null;

  // Stacking order: higher zIndex appears at the top of the layer list
  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  return (
    <aside
      aria-label="Canvas layers and object order"
      className="absolute top-0 right-0 bottom-0 w-72 bg-[#1A1A1A] border-l border-white/10 z-40 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 text-white select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/10 bg-[#222222]">
        <div className="flex items-center gap-2">
          <Layers size={15} className="text-[#B99A62]" />
          <h2 className="text-xs font-semibold tracking-wide uppercase text-neutral-200">
            Layers &amp; Stacking ({elements.length})
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded-md text-white/60 hover:text-white transition-colors"
          aria-label="Close layers panel"
        >
          <X size={15} />
        </button>
      </div>

      <div className="px-3 py-2 bg-black/20 text-[11px] text-white/50 border-b border-white/5">
        Select covered or overlapped elements below:
      </div>

      {/* Elements List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {sortedElements.map((el, index) => {
          const isSelected = selectedId === el.id;
          const isLocked = !!el.isLocked;

          return (
            <div
              key={el.id}
              onClick={() => onSelectElement(el.id)}
              className={`group flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition-all ${
                isSelected
                  ? 'bg-[#B99A62] text-[#112327] font-medium shadow-md'
                  : 'bg-white/5 hover:bg-white/10 text-white/80'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {/* Element Type Icon */}
                <div
                  className={`w-6 h-6 rounded flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-black/20 text-[#112327]' : 'bg-white/10 text-white/70'
                  }`}
                >
                  {el.type === 'text' ? (
                    <Type size={12} />
                  ) : el.type === 'photo' ? (
                    <ImageIcon size={12} />
                  ) : (
                    <Sparkles size={12} />
                  )}
                </div>

                {/* Name / Preview snippet */}
                <span className="truncate text-xs">
                  {el.name || (el.type === 'text' ? el.content : el.type)}
                </span>
              </div>

              {/* Actions: Reorder Up/Down, Lock, Delete */}
              <div
                className="flex items-center gap-1 opacity-80 group-hover:opacity-100 shrink-0 ml-2"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Move Up */}
                <button
                  onClick={() => onReorder(el.id, 'up')}
                  disabled={index === 0}
                  className="p-1 hover:bg-black/20 rounded disabled:opacity-20"
                  title="Bring Forward"
                  aria-label="Bring layer forward"
                >
                  <ChevronUp size={13} />
                </button>

                {/* Move Down */}
                <button
                  onClick={() => onReorder(el.id, 'down')}
                  disabled={index === sortedElements.length - 1}
                  className="p-1 hover:bg-black/20 rounded disabled:opacity-20"
                  title="Send Backward"
                  aria-label="Send layer backward"
                >
                  <ChevronDown size={13} />
                </button>

                {/* Lock Toggle */}
                <button
                  onClick={() => onToggleLock(el.id)}
                  className={`p-1 rounded hover:bg-black/20 ${isLocked ? 'text-amber-400' : ''}`}
                  title={isLocked ? 'Unlock layer' : 'Lock layer'}
                  aria-label={isLocked ? 'Unlock layer' : 'Lock layer'}
                >
                  {isLocked ? <Lock size={12} /> : <Unlock size={12} />}
                </button>

                {/* Delete */}
                <button
                  onClick={() => onDelete(el.id)}
                  className="p-1 rounded hover:bg-red-500/30 text-red-400"
                  title="Delete element"
                  aria-label="Delete layer"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
