'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Sparkles, Plus } from 'lucide-react';
import { STICKER_ASSETS, type StickerAsset } from '@/lib/assets/stickers';

interface StickersPanelProps {
  onInsertSticker: (asset: StickerAsset) => void;
  onClose?: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Stickers' },
  { id: 'planner', label: '🎨 Doodles & Planner' },
  { id: 'stationery', label: '💌 Washi & Wax Seals' },
  { id: 'botanical', label: '🌿 Florals & Botanicals' },
  { id: 'party', label: '🥂 Toast & Celebration' },
  { id: 'badges', label: '✨ Slogans & Badges' },
  { id: 'cultural', label: '🦁 Heritage & Harusi' },
  { id: 'romance', label: '💍 Romance & Love' },
];

export function StickersPanel({ onInsertSticker, onClose }: StickersPanelProps) {
  const [selectedCat, setSelectedCat] = useState('all');
  const [search, setSearch] = useState('');

  const filteredStickers = useMemo(() => {
    return STICKER_ASSETS.filter((s) => {
      const matchCat = selectedCat === 'all' || s.category === selectedCat;
      const matchSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [selectedCat, search]);

  return (
    <div className="flex flex-col h-full bg-[#1F1F1F] text-white">
      {/* Search Input */}
      <div className="p-3 border-b border-white/10">
        <div className="flex items-center gap-2 bg-white/10 border border-white/10 rounded-lg px-2.5 py-1.5 focus-within:border-[#B99A62]">
          <Search size={13} className="text-white/40 shrink-0" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stickers (washi, seal, rose, champagne, harusi)..."
            className="w-full bg-transparent text-xs text-white placeholder-white/40 focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-white/40 hover:text-white">
              <X size={12} />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1 mt-2.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${
                selectedCat === cat.id
                  ? 'bg-[#B99A62] text-[#112327] font-semibold'
                  : 'bg-white/5 hover:bg-white/10 text-white/70'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stickers Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="grid grid-cols-2 gap-3">
          {filteredStickers.map((sticker) => (
            <div
              key={sticker.id}
              onClick={() => onInsertSticker(sticker)}
              className="group relative aspect-square rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-[#B99A62]/60 p-3 flex flex-col items-center justify-between cursor-pointer transition-all duration-200 hover:scale-[1.03] select-none"
              title={`Click to add ${sticker.name}`}
            >
              {/* Real 3D Sticker Preview with genuine transparent background */}
              <div className="w-full h-24 flex items-center justify-center pointer-events-none p-1.5">
                <img
                  src={sticker.imageUrl}
                  alt={sticker.name}
                  className="max-w-full max-h-full object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)] transition-transform duration-200 group-hover:scale-110 select-none"
                  loading="lazy"
                />
              </div>

              {/* Name & Quick Add pill on hover */}
              <div className="w-full flex items-center justify-between mt-2 pt-1 border-t border-white/5">
                <span className="text-[10px] text-white/70 group-hover:text-white truncate">
                  {sticker.name}
                </span>
                <div className="w-5 h-5 rounded-full bg-[#B99A62]/20 group-hover:bg-[#B99A62] text-white/70 group-hover:text-[#112327] flex items-center justify-center shrink-0 transition-colors">
                  <Plus size={11} strokeWidth={2.5} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStickers.length === 0 && (
          <div className="text-center py-10 text-xs text-white/40">
            No stickers found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
}
