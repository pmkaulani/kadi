'use client';

import React from 'react';
import { Type, Sparkles, Plus } from 'lucide-react';
import type { CanvasElement } from '@/types/canvas';

interface TextPanelProps {
  onInsertText: (preset: {
    content: string;
    style: {
      fontFamily: string;
      fontSize: number;
      fontWeight: string | number;
      fontStyle?: 'normal' | 'italic';
      color: string;
      textAlign: 'left' | 'center' | 'right';
      letterSpacing?: number;
    };
  }) => void;
}

export function TextPanel({ onInsertText }: TextPanelProps) {
  return (
    <div className="flex flex-col h-full bg-[#1F1F1F] text-white p-4 space-y-4">
      <div>
        <h3 className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-3">
          Add Text to Canvas
        </h3>

        {/* Primary Text Actions (§5.4) */}
        <div className="space-y-2">
          {/* Heading */}
          <button
            onClick={() =>
              onInsertText({
                content: 'Add a heading',
                style: {
                  fontFamily: 'Playfair Display',
                  fontSize: 34,
                  fontWeight: '700',
                  color: '#934638',
                  textAlign: 'center',
                },
              })
            }
            className="w-full py-3 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-between text-left transition-all hover:scale-[1.01]"
          >
            <div>
              <span className="font-serif text-xl font-bold block text-white">
                Add a heading
              </span>
              <span className="text-[10px] text-white/50">Large title text for celebrants or event</span>
            </div>
            <Plus size={16} className="text-[#B99A62]" />
          </button>

          {/* Subheading */}
          <button
            onClick={() =>
              onInsertText({
                content: 'Add a subheading',
                style: {
                  fontFamily: 'Cormorant Garamond',
                  fontSize: 20,
                  fontWeight: '500',
                  fontStyle: 'italic',
                  color: '#272620',
                  textAlign: 'center',
                },
              })
            }
            className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-between text-left transition-all hover:scale-[1.01]"
          >
            <div>
              <span className="font-serif text-base italic block text-white/90">
                Add a subheading
              </span>
              <span className="text-[10px] text-white/50">Wording, dates, or request line</span>
            </div>
            <Plus size={16} className="text-[#B99A62]" />
          </button>

          {/* Body Text */}
          <button
            onClick={() =>
              onInsertText({
                content: 'Add body text with event details, venue address, and reception notes.',
                style: {
                  fontFamily: 'Inter',
                  fontSize: 12,
                  fontWeight: '400',
                  color: '#4A4A4A',
                  textAlign: 'center',
                  letterSpacing: 0.2,
                },
              })
            }
            className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-between text-left transition-all hover:scale-[1.01]"
          >
            <div>
              <span className="font-sans text-xs block text-white/80">
                Add body text
              </span>
              <span className="text-[10px] text-white/50">Descriptions, venues, times, and RSVP</span>
            </div>
            <Plus size={16} className="text-[#B99A62]" />
          </button>

          {/* Calligraphy Script Accent */}
          <button
            onClick={() =>
              onInsertText({
                content: 'Save the Date',
                style: {
                  fontFamily: 'Cormorant Garamond',
                  fontSize: 24,
                  fontWeight: '600',
                  fontStyle: 'italic',
                  color: '#B99A62',
                  textAlign: 'center',
                  letterSpacing: 2,
                },
              })
            }
            className="w-full py-2.5 px-4 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 flex items-center justify-between text-left transition-all hover:scale-[1.01]"
          >
            <div>
              <span className="font-serif text-lg italic text-[#B99A62] block">
                Calligraphy Accent
              </span>
              <span className="text-[10px] text-white/50">Gilded italic lettering</span>
            </div>
            <Plus size={16} className="text-[#B99A62]" />
          </button>
        </div>
      </div>

      <div className="pt-2 border-t border-white/10 text-[11px] text-white/40 leading-relaxed">
        Tip: Double-click any text on the canvas to edit words directly, or use the floating toolbar to change fonts and colors.
      </div>
    </div>
  );
}
