'use client';

import React, { useRef, useState, useEffect } from 'react';
import type { CanvasElement } from '@/types/canvas';
import { PhotoMaskRenderer } from './PhotoMaskRenderer';

export interface CanvasCardViewProps {
  elements?: CanvasElement[];
  cardBackground?: string;
  palette?: {
    primary?: string;
    secondary?: string;
    text?: string;
    cardBackground?: string;
  };
  fit?: 'contain' | 'fill-width';
  className?: string;
}

const ARTBOARD_WIDTH = 480;
const ARTBOARD_HEIGHT = 680;

export function CanvasCardView({
  elements = [],
  cardBackground,
  palette,
  fit = 'contain',
  className = '',
}: CanvasCardViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.65);

  useEffect(() => {
    if (!containerRef.current) return;
    const updateScale = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        if (clientWidth > 0 && clientHeight > 0) {
          const scaleX = clientWidth / ARTBOARD_WIDTH;
          const scaleY = clientHeight / ARTBOARD_HEIGHT;
          // Scale to fit width or proportionally within container bounds
          const nextScale = fit === 'fill-width' ? scaleX : Math.min(scaleX, scaleY);
          setScale(Math.max(0.15, Math.min(1.5, nextScale)));
        }
      }
    };
    updateScale();
    const ro = new ResizeObserver(updateScale);
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [fit]);

  const bg = cardBackground || palette?.cardBackground || '#FCFAF7';
  const textColor = palette?.text || '#272620';
  const primaryColor = palette?.primary || '#934638';

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex ${
        fit === 'fill-width' ? 'items-start' : 'items-center'
      } justify-center overflow-visible select-none ${className}`}
    >
      <div
        className="relative shrink-0 shadow-[0_12px_36px_-6px_rgba(0,0,0,0.18),0_4px_12px_-2px_rgba(0,0,0,0.08)] ring-1 ring-black/10 rounded-2xl overflow-visible transition-transform duration-75 kadi-canvas-artboard"
        style={{
          width: ARTBOARD_WIDTH,
          minWidth: ARTBOARD_WIDTH,
          maxWidth: 'none',
          height: ARTBOARD_HEIGHT,
          minHeight: ARTBOARD_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: fit === 'fill-width' ? 'top center' : 'center center',
          backgroundColor: bg,
          color: textColor,
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

        {/* Elements */}
        {elements
          .slice()
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((elem) => {
            const style = elem.styleProps || {};
            return (
              <div
                key={elem.id}
                className="absolute select-none pointer-events-none"
                style={{
                  left: elem.x,
                  top: elem.y,
                  width: elem.width,
                  height: elem.height,
                  transform: `rotate(${elem.rotation}deg)`,
                  zIndex: elem.zIndex,
                  opacity: elem.opacity ?? 1,
                }}
              >
                {/* 1. TEXT */}
                {elem.type === 'text' && (
                  <div
                    className="w-full h-full flex items-center justify-center p-1 text-center"
                    style={{
                      fontFamily: style.fontFamily || 'Inter',
                      fontSize: style.fontSize || 16,
                      fontWeight: style.fontWeight || '400',
                      fontStyle: style.fontStyle || 'normal',
                      color: style.color || textColor,
                      textAlign: style.textAlign || 'center',
                      letterSpacing: style.letterSpacing
                        ? `${style.letterSpacing}px`
                        : undefined,
                      lineHeight: style.lineHeight || 1.25,
                    }}
                  >
                    <span className="whitespace-pre-wrap break-words max-w-full px-1">{elem.content}</span>
                  </div>
                )}

                {/* 2. PHOTO */}
                {elem.type === 'photo' && (
                  <PhotoMaskRenderer
                    id={elem.id}
                    src={elem.content}
                    alt={elem.name || 'Photo'}
                    maskShape={style.maskShape || 'none'}
                    stickerEffect={style.stickerEffect}
                    stickerBorderWidth={style.stickerBorderWidth || 8}
                    stickerBorderColor={style.stickerBorderColor || '#FFFFFF'}
                  />
                )}

                {/* 3. STICKER */}
                {elem.type === 'sticker' && (() => {
                  let content = elem.content;
                  const isBaby = elements.some((e) =>
                    e.type === 'text' && e.content && e.content.toLowerCase().includes('baby')
                  );
                  if (
                    isBaby &&
                    (content.includes('romance-solitaire') ||
                      content.includes('diamond-ring') ||
                      content.includes('solitaire') ||
                      content.includes('interlocking-rings'))
                  ) {
                    content = '/stickers/planner-doodle-heart.png';
                  }

                  return content.startsWith('<svg') || content.startsWith('<?xml') ? (
                    <div
                      className="w-full h-full flex items-center justify-center drop-shadow-xs"
                      dangerouslySetInnerHTML={{ __html: content }}
                    />
                  ) : (
                    <img
                      src={content}
                      alt={elem.name || 'Sticker'}
                      className="w-full h-full object-contain pointer-events-none select-none drop-shadow-md"
                      draggable={false}
                    />
                  );
                })()}

                {/* 4. SHAPE */}
                {elem.type === 'shape' && (
                  <div
                    className={`w-full h-full ${
                      style.shapeType === 'circle'
                        ? 'rounded-full'
                        : style.shapeType === 'rounded'
                        ? 'rounded-2xl'
                        : 'rounded-none'
                    }`}
                    style={{
                      backgroundColor: style.fill || 'transparent',
                      border: style.borderWidth
                        ? `${style.borderWidth}px solid ${style.borderColor || '#B99A62'}`
                        : undefined,
                    }}
                  />
                )}

                {/* 5. BUTTON */}
                {elem.type === 'button' && (
                  <div
                    className="w-full h-full flex items-center justify-center pointer-events-auto transition-transform active:scale-95 shadow-xs"
                    style={{
                      backgroundColor: style.fill || primaryColor,
                      color: style.color || '#FFFFFF',
                      borderRadius:
                        style.borderRadius !== undefined ? `${style.borderRadius}px` : '9999px',
                      borderWidth:
                        style.borderWidth !== undefined ? `${style.borderWidth}px` : '0px',
                      borderColor: style.borderColor || 'transparent',
                      fontFamily: style.fontFamily || 'Inter',
                      fontSize: style.fontSize || 13,
                      fontWeight: style.fontWeight || 600,
                      letterSpacing: style.letterSpacing ? `${style.letterSpacing}px` : '0.04em',
                    }}
                  >
                    <span>{elem.content}</span>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
}
