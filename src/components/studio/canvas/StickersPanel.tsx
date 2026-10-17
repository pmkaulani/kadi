'use client';

import React, { useState, useMemo } from 'react';
import { Search, X, Plus, Flower2, PartyPopper, Heart, Stamp, Sparkles, PenTool } from 'lucide-react';
import { STICKER_ASSETS, type StickerAsset } from '@/lib/assets/stickers';

interface StickersPanelProps {
  onInsertSticker: (asset: StickerAsset) => void;
  onClose?: () => void;
}

const CATEGORIES = [
  { id: 'all', label: 'Everything', icon: Sparkles },
  { id: 'stationery', label: 'Stationery', icon: Stamp },
  { id: 'botanical', label: 'Botanical', icon: Flower2 },
  { id: 'romance', label: 'Romance', icon: Heart },
  { id: 'party', label: 'Celebration', icon: PartyPopper },
  { id: 'cultural', label: 'Heritage', icon: Sparkles },
  { id: 'planner', label: 'Illustrations', icon: PenTool },
  { id: 'badges', label: 'Lettering', icon: Plus },
] as const;

export function StickersPanel({ onInsertSticker, onClose }: StickersPanelProps) {
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filteredStickers = useMemo(() => {
    const query = search.trim().toLowerCase();
    return STICKER_ASSETS.filter((asset) => {
      const matchesCategory = selectedCat === 'all' || asset.category === selectedCat;
      const matchesSearch =
        !query ||
        asset.name.toLowerCase().includes(query) ||
        asset.tags.some((tag) => tag.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCat, search]);

  return (
    <section className="flex h-full min-h-0 flex-col bg-[#20201E] text-[#F6F2EA]" aria-label="Sticker library">
      <header className="shrink-0 border-b border-white/10 px-4 pb-3 pt-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#C6AD82]">
              The embellishment drawer
            </p>
            <h2 className="mt-1 font-serif text-lg leading-tight text-[#FBF8F1]">Stickers & artwork</h2>
            <p className="mt-1 text-[11px] leading-relaxed text-white/50">
              Small details, chosen with care.
            </p>
          </div>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close artwork library"
              className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center border border-white/10 text-white/60 transition-colors hover:border-white/25 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C6AD82]"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <label className="flex h-10 items-center gap-2 border border-white/15 bg-white/[0.045] px-3 transition-colors focus-within:border-[#C6AD82]/80">
          <Search size={14} className="shrink-0 text-white/40" aria-hidden="true" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Find a flower, seal, ribbon…"
            aria-label="Search artwork"
            className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-white/35"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              aria-label="Clear artwork search"
              className="inline-flex h-6 w-6 items-center justify-center text-white/45 hover:text-white"
            >
              <X size={12} />
            </button>
          )}
        </label>

        <nav className="mt-3 flex gap-1.5 overflow-x-auto pb-1 scrollbar-none" aria-label="Artwork categories">
          {CATEGORIES.map((category) => {
            const Icon = category.icon;
            const selected = selectedCat === category.id;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCat(category.id)}
                aria-pressed={selected}
                className={`inline-flex shrink-0 items-center gap-1.5 border px-2.5 py-1.5 text-[10px] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C6AD82] ${
                  selected
                    ? 'border-[#C6AD82]/70 bg-[#C6AD82]/12 text-[#F0DDB8]'
                    : 'border-white/10 bg-transparent text-white/55 hover:border-white/25 hover:text-white/85'
                }`}
              >
                <Icon size={11} strokeWidth={1.7} aria-hidden="true" />
                {category.label}
              </button>
            );
          })}
        </nav>

        <div className="mt-2 flex items-center justify-between text-[10px] text-white/40">
          <span>{filteredStickers.length} {filteredStickers.length === 1 ? 'piece' : 'pieces'}</span>
          <span>Transparent artwork</span>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-4 pt-3">
        {filteredStickers.length > 0 ? (
          <div className="grid grid-cols-2 gap-2.5">
            {filteredStickers.map((asset) => (
              <button
                key={asset.id}
                type="button"
                onClick={() => onInsertSticker(asset)}
                aria-label={`Add ${asset.name} to the invitation`}
                title={`Add ${asset.name}`}
                className="group min-w-0 border border-white/10 bg-white/[0.025] p-2 text-left transition-colors hover:border-[#C6AD82]/65 hover:bg-white/[0.055] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#C6AD82]"
              >
                <span className="relative flex aspect-[1.12/1] items-center justify-center overflow-hidden border border-black/[0.04] bg-[#F4EFE6] p-3">
                  <img
                    src={asset.imageUrl}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                    className="max-h-full max-w-full select-none object-contain transition-transform duration-200 group-hover:scale-[1.035]"
                  />
                  <span className="absolute bottom-1.5 right-1.5 inline-flex h-5 w-5 items-center justify-center border border-black/10 bg-[#FBF8F1] text-[#5A5145] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                    <Plus size={11} strokeWidth={1.8} aria-hidden="true" />
                  </span>
                </span>
                <span className="mt-2 block truncate text-[10px] leading-snug text-white/70 transition-colors group-hover:text-white">
                  {asset.name}
                </span>
                <span className="mt-0.5 block truncate text-[9px] capitalize text-white/35">
                  {asset.category}
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex min-h-40 flex-col items-center justify-center px-5 text-center">
            <Search size={20} strokeWidth={1.4} className="text-white/25" aria-hidden="true" />
            <p className="mt-3 font-serif text-sm text-white/70">No artwork found</p>
            <p className="mt-1 max-w-[220px] text-[11px] leading-relaxed text-white/40">
              Try another term or choose a different category.
            </p>
            <button
              type="button"
              onClick={() => { setSearch(''); setSelectedCat('all'); }}
              className="mt-3 border-b border-[#C6AD82]/50 pb-0.5 text-[10px] text-[#E1CCA3] hover:text-white"
            >
              Show all artwork
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
