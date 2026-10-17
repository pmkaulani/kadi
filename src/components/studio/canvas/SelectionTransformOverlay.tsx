'use client';

import React from 'react';
import { RotateCw, Lock } from 'lucide-react';
import type { CanvasElement } from '@/types/canvas';

interface SelectionTransformOverlayProps {
  element: CanvasElement;
  zoom: number;
  isSelected: boolean;
  isHovered: boolean;
  isMultiSelected?: boolean;
  onStartDrag: (e: React.PointerEvent) => void;
  onStartResize: (e: React.PointerEvent, corner: 'tl' | 'tr' | 'bl' | 'br') => void;
  onStartRotate: (e: React.PointerEvent) => void;
  onUnlock?: () => void;
}

export function SelectionTransformOverlay({
  element,
  zoom,
  isSelected,
  isHovered,
  isMultiSelected = false,
  onStartDrag,
  onStartResize,
  onStartRotate,
  onUnlock,
}: SelectionTransformOverlayProps) {
  // If not selected and not hovered, render nothing (no idle decoration)
  if (!isSelected && !isHovered) return null;

  const isLocked = !!element.isLocked;

  // Hover state (desktop only) is a restrained, thin indicator
  if (!isSelected && isHovered) {
    return (
      <div
        className="absolute inset-0 pointer-events-none rounded-sm transition-opacity duration-150"
        style={{
          boxShadow: '0 0 0 1.5px rgba(185, 154, 98, 0.65)',
        }}
      />
    );
  }

  // Selected State (§5.3.1): Unmistakable, high-contrast, no-fill transform frame
  return (
    <div
      className="absolute inset-0 select-none pointer-events-auto"
      onPointerDown={isLocked ? undefined : onStartDrag}
      style={{
        cursor: isLocked ? 'not-allowed' : 'move',
      }}
    >
      {/* 1.5px High-Contrast Frame with Dual Contrast (visible on light & dark) */}
      <div
        className="absolute inset-0 pointer-events-none rounded-[2px]"
        style={{
          border: '1.5px solid #2563EB',
          boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.85), 0 2px 8px rgba(0, 0, 0, 0.25)',
        }}
      />

      {/* Locked Badge */}
      {isLocked && (
        <div
          onClick={(e) => {
            e.stopPropagation();
            onUnlock?.();
          }}
          className="absolute -top-3.5 -right-3.5 w-7 h-7 bg-amber-500 text-white rounded-full flex items-center justify-center shadow-md cursor-pointer hover:bg-amber-600 transition-colors pointer-events-auto z-30"
          title="Click to unlock this element"
        >
          <Lock size={12} strokeWidth={2.5} />
        </div>
      )}

      {/* Resize & Rotate handles (hidden when locked) */}
      {!isLocked && (
        <>
          {/* Bottom Rotation Handle with Connector Line (Canva style, prevents toolbar overlap) */}
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto z-30">
            {/* Connector Line */}
            <div className="w-[1.5px] h-3 bg-[#2563EB] shadow-[0_0_2px_rgba(255,255,255,0.9)]" />
            {/* Rotation Knob with large touch hit area */}
            <div
              onPointerDown={onStartRotate}
              className="group relative -mt-0.5 flex items-center justify-center cursor-grab active:cursor-grabbing p-1"
              title="Drag to rotate"
              style={{ touchAction: 'none' }}
            >
              {/* Visible Handle */}
              <div className="w-4 h-4 rounded-full bg-white border-2 border-[#2563EB] shadow-md group-hover:scale-110 group-hover:border-amber-600 transition-transform flex items-center justify-center">
                <RotateCw size={9} className="text-[#2563EB] group-hover:text-amber-600" />
              </div>
            </div>
          </div>

          {/* 4 Corner Resize Handles */}
          {/* Top-Left */}
          <CornerHandle
            position="top-left"
            cursor="nwse-resize"
            onPointerDown={(e) => onStartResize(e, 'tl')}
          />
          {/* Top-Right */}
          <CornerHandle
            position="top-right"
            cursor="nesw-resize"
            onPointerDown={(e) => onStartResize(e, 'tr')}
          />
          {/* Bottom-Left */}
          <CornerHandle
            position="bottom-left"
            cursor="nesw-resize"
            onPointerDown={(e) => onStartResize(e, 'bl')}
          />
          {/* Bottom-Right */}
          <CornerHandle
            position="bottom-right"
            cursor="nwse-resize"
            onPointerDown={(e) => onStartResize(e, 'br')}
          />
        </>
      )}
    </div>
  );
}

function CornerHandle({
  position,
  cursor,
  onPointerDown,
}: {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  cursor: string;
  onPointerDown: (e: React.PointerEvent) => void;
}) {
  const posClasses = {
    'top-left': '-top-2 -left-2',
    'top-right': '-top-2 -right-2',
    'bottom-left': '-bottom-2 -left-2',
    'bottom-right': '-bottom-2 -right-2',
  }[position];

  return (
    <div
      onPointerDown={onPointerDown}
      className={`absolute ${posClasses} w-6 h-6 flex items-center justify-center z-30 cursor-${cursor} pointer-events-auto select-none`}
      style={{ cursor, touchAction: 'none' }}
      title="Resize"
    >
      {/* Visual handle: 10px circular white knob with blue border & drop shadow */}
      <div className="w-2.5 h-2.5 rounded-full bg-white border-[1.5px] border-[#2563EB] shadow-[0_1px_4px_rgba(0,0,0,0.35)] transition-transform hover:scale-125" />
    </div>
  );
}
