'use client';

import React, { useRef, useState, useEffect } from 'react';
import type { CanvasElement } from '@/types/canvas';

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

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex ${
        fit === 'fill-width' ? 'items-start' : 'items-center'
      } justify-center overflow-hidden select-none ${className}`}
    >
      <div
        className="relative shrink-0 shadow-lg rounded-2xl overflow-hidden transition-transform duration-75"
        style={{
          width: ARTBOARD_WIDTH,
          height: ARTBOARD_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: fit === 'fill-width' ? 'top center' : 'center center',
          backgroundColor: bg,
          color: textColor,
        }}
      >
        {/* Subtle Paper Linen texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
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
                    className="w-full h-full flex items-center justify-center p-1"
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
                      lineHeight: style.lineHeight || 1.3,
                    }}
                  >
                    <span className="whitespace-pre-wrap">{elem.content}</span>
                  </div>
                )}

                {/* 2. PHOTO */}
                {elem.type === 'photo' && (
                  <div
                    className={`w-full h-full overflow-hidden ${
                      style.maskShape === 'circle'
                        ? 'rounded-full aspect-square'
                        : style.maskShape === 'oval'
                        ? 'rounded-[50%]'
                        : style.maskShape === 'rounded'
                        ? 'rounded-3xl'
                        : 'rounded-md'
                    }`}
                  >
                    <img
                      src={elem.content}
                      alt={elem.name || 'Photo'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* 3. STICKER */}
                {elem.type === 'sticker' && (
                  <div
                    className="w-full h-full flex items-center justify-center drop-shadow-xs"
                    dangerouslySetInnerHTML={{ __html: elem.content }}
                  />
                )}

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
              </div>
            );
          })}
      </div>
    </div>
  );
}
